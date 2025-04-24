
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { uploadFile } from "@/integrations/supabase/storage";

interface ProfileEditFormProps {
  user: User;
  onSave: (updatedData: Partial<User>) => void;
  onCancel: () => void;
}

export function ProfileEditForm({ user, onSave, onCancel }: ProfileEditFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: user.name || "",
      bio: user.bio || "",
      location: user.location || "",
      profileImage: user.profileImage || "",
      coverImage: user.coverImage || "",
    }
  });
  
  const [profileImageFile, setProfileImageFile] = React.useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = React.useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = React.useState<string | null>(user.profileImage || null);
  const [coverImagePreview, setCoverImagePreview] = React.useState<string | null>(user.coverImage || null);
  const [isUploading, setIsUploading] = React.useState(false);
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (data: any) => {
    try {
      setIsUploading(true);
      let profileImageUrl = user.profileImage;
      let coverImageUrl = user.coverImage;
      
      // Upload profile image if changed
      if (profileImageFile) {
        try {
          const fileExt = profileImageFile.name.split('.').pop();
          const fileName = `${user.id}-profile-${Date.now()}.${fileExt}`;
          
          const uploadResult = await uploadFile('avatars', fileName, profileImageFile);
          
          if (!uploadResult.success) {
            throw new Error("Failed to upload profile image");
          }
          
          profileImageUrl = uploadResult.publicUrl || '';
        } catch (error) {
          console.error("Profile image upload error:", error);
          toast.error("Failed to upload profile image");
        }
      }
      
      // Upload cover image if changed
      if (coverImageFile) {
        try {
          const fileExt = coverImageFile.name.split('.').pop();
          const fileName = `${user.id}-cover-${Date.now()}.${fileExt}`;
          
          const uploadResult = await uploadFile('covers', fileName, coverImageFile);
          
          if (!uploadResult.success) {
            throw new Error("Failed to upload cover image");
          }
          
          coverImageUrl = uploadResult.publicUrl || '';
        } catch (error) {
          console.error("Cover image upload error:", error);
          toast.error("Failed to upload cover image");
        }
      }
      
      // Save updated data
      const updatedData = {
        ...data,
        profileImage: profileImageUrl,
        coverImage: coverImageUrl
      };
      
      onSave(updatedData);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            {...register("name", { required: "Name is required" })}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message?.toString()}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea 
            id="bio" 
            {...register("bio")}
            className="min-h-[100px]"
            placeholder="Write a short bio about yourself"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location" 
            {...register("location")}
            placeholder="e.g., Mumbai, India"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="profileImage">Profile Image</Label>
          {profileImagePreview && (
            <div className="mb-2">
              <img 
                src={profileImagePreview} 
                alt="Profile Preview" 
                className="w-20 h-20 rounded-full object-cover border"
              />
            </div>
          )}
          <Input 
            id="profileImage" 
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image</Label>
          {coverImagePreview && (
            <div className="mb-2">
              <img 
                src={coverImagePreview} 
                alt="Cover Preview" 
                className="w-full h-32 object-cover rounded-md border"
              />
            </div>
          )}
          <Input 
            id="coverImage" 
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isUploading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isUploading || isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
