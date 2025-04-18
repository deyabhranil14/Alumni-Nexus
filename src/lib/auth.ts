
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, UserRole } from "@/types";

export type AuthFormData = {
  name?: string;
  email: string;
  password: string;
};

export type RegisterFormData = AuthFormData & {
  role: UserRole;
  // Additional registration fields
  phone?: string;
  institution?: string;
  course?: string;
  graduationYear?: string;
  enrollmentYear?: string;
  currentCompany?: string;
  designation?: string;
  interests?: string[];
  bio?: string;
  profileImage?: File;
};

export const registerUser = async (data: RegisterFormData) => {
  try {
    // Step 1: Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          role: data.role,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Registration failed");

    // The user is created in the users table via the database trigger
    
    // Upload profile image if provided
    if (data.profileImage) {
      const fileExt = data.profileImage.name.split('.').pop();
      const fileName = `${authData.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('alumni_media')
        .upload(`profiles/${fileName}`, data.profileImage);
      
      if (uploadError) {
        console.error("Error uploading profile image:", uploadError);
        // Continue with registration even if image upload fails
      } else {
        // Get the public URL
        const { data: imageData } = supabase.storage
          .from('alumni_media')
          .getPublicUrl(`profiles/${fileName}`);
          
        // Update the user profile with the image URL
        await supabase
          .from('users')
          .update({ profile_image: imageData.publicUrl })
          .eq('id', authData.user.id);
      }
    }
    
    toast.success("Registration successful! Please check your email to verify your account.");
    return { success: true, user: authData.user };
  } catch (error) {
    console.error("Registration error:", error);
    toast.error(error instanceof Error ? error.message : "Registration failed");
    return { success: false, error };
  }
};

export const loginUser = async ({ email, password }: AuthFormData) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    toast.success("Login successful!");
    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    console.error("Login error:", error);
    toast.error(error instanceof Error ? error.message : "Login failed");
    return { success: false, error };
  }
};

export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast.success("Logged out successfully");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    toast.error(error instanceof Error ? error.message : "Logout failed");
    return { success: false, error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Get the user profile data
    const { data: profileData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (!profileData) return null;
    
    // Transform database user to match our User type
    const userProfile: User = {
      id: profileData.id,
      role: profileData.role as UserRole,
      name: profileData.name,
      email: profileData.email,
      profileImage: profileData.profile_image,
      coverImage: profileData.cover_image,
      location: profileData.location || undefined,
      bio: profileData.bio || undefined,
      joinDate: profileData.join_date,
      education: [], // These will need to be fetched separately if needed
      experience: [],
      skills: [],
      interests: []
    };
      
    return userProfile;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

export const sendPasswordResetEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    
    if (error) throw error;
    
    toast.success("Password reset email sent");
    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to send password reset email");
    return { success: false, error };
  }
};
