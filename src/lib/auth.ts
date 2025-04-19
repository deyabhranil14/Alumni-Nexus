
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
    console.log("Starting user registration");
    
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

    if (authError) {
      console.error("Auth error during registration:", authError);
      throw authError;
    }
    if (!authData.user) {
      console.error("Registration failed: No user returned");
      throw new Error("Registration failed");
    }

    console.log("User registered successfully, uploading profile image if provided");
    
    // The user is created in the users table via the database trigger
    
    // Upload profile image if provided
    if (data.profileImage) {
      const fileExt = data.profileImage.name.split('.').pop();
      const fileName = `${authData.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      try {
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
            
          console.log("Profile image uploaded successfully");
        }
      } catch (imageError) {
        console.error("Image processing error:", imageError);
        // Continue with registration even if image processing fails
      }
    }
    
    toast.success("Registration successful! Please check your email to verify your account.");
    return { success: true, user: authData.user };
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage = error instanceof Error ? error.message : "Registration failed";
    toast.error(errorMessage);
    return { success: false, error };
  }
};

export const loginUser = async ({ email, password }: AuthFormData) => {
  try {
    console.log("Attempting user login");
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      throw error;
    }
    
    console.log("Login successful");
    toast.success("Login successful!");
    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Login failed";
    toast.error(errorMessage);
    return { success: false, error };
  }
};

export const logoutUser = async () => {
  try {
    console.log("Attempting user logout");
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      throw error;
    }
    
    console.log("Logout successful");
    toast.success("Logged out successfully");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    const errorMessage = error instanceof Error ? error.message : "Logout failed";
    toast.error(errorMessage);
    return { success: false, error };
  }
};

export const getCurrentUser = async () => {
  try {
    console.log("Fetching current user");
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("No authenticated user found");
      return null;
    }
    
    console.log("Auth user found, fetching profile data");
    
    // Get the user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      
      if (profileError.code === 'PGRST116') {
        console.log("User record not found in profiles table");
      }
      
      return null;
    }
      
    if (!profileData) {
      console.log("No profile data found for user");
      return null;
    }
    
    console.log("User profile data retrieved successfully");
    
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
    console.log("Sending password reset email");
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    
    if (error) {
      console.error("Password reset error:", error);
      throw error;
    }
    
    console.log("Password reset email sent");
    toast.success("Password reset email sent");
    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to send password reset email";
    toast.error(errorMessage);
    return { success: false, error };
  }
};
