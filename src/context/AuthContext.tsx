
import React, { createContext, useState, useEffect, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { User as AppUser } from "@/types";
import { getCurrentUser, loginUser, logoutUser, registerUser, AuthFormData, RegisterFormData } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  login: (data: AuthFormData) => Promise<{ success: boolean; error?: any }>;
  register: (data: RegisterFormData) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<{ success: boolean; error?: any }>;
  refreshUser: () => Promise<AppUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user and set up auth state change listener
  useEffect(() => {
    console.log("Setting up auth state listener");

    // Set up auth state change listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        
        if (newSession && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          // Use setTimeout to prevent deadlocks with Supabase auth
          setTimeout(async () => {
            try {
              const userProfile = await getCurrentUser();
              console.log("User profile fetched:", userProfile ? "success" : "null");
              setUser(userProfile);
            } catch (error) {
              console.error("Error fetching user profile:", error);
              setUser(null);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    const initializeUser = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        setSession(existingSession);
        
        if (existingSession?.user) {
          try {
            const userProfile = await getCurrentUser();
            console.log("Initial user profile:", userProfile ? "loaded" : "not found");
            setUser(userProfile);
          } catch (error) {
            console.error("Error loading initial user profile:", error);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error during auth initialization:", error);
        setLoading(false);
      }
    };

    initializeUser();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const refreshUser = async () => {
    console.log("Refreshing user profile");
    try {
      const userProfile = await getCurrentUser();
      console.log("User profile refreshed:", userProfile ? "success" : "not found");
      setUser(userProfile);
      return userProfile;
    } catch (error) {
      console.error("Error refreshing user profile:", error);
      setUser(null);
      return null;
    }
  };

  const register = async (data: RegisterFormData) => {
    console.log("Registering new user with data:", { ...data, password: '***hidden***' });
    try {
      const result = await registerUser(data);
      if (result.success) {
        console.log("Registration successful, refreshing user");
        await refreshUser();
        toast.success("Registration successful!");
      } else {
        console.error("Registration failed:", result.error);
        toast.error(`Registration failed: ${result.error?.message || "Unknown error"}`);
      }
      return result;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(`Registration error: ${error instanceof Error ? error.message : "Unknown error"}`);
      return { success: false, error };
    }
  };

  const login = async (data: AuthFormData) => {
    console.log("Logging in user");
    try {
      const result = await loginUser(data);
      if (result.success) {
        console.log("Login successful, refreshing user");
        await refreshUser();
        toast.success("Login successful!");
      } else {
        console.error("Login failed:", result.error);
        toast.error(`Login failed: ${result.error?.message || "Unknown error"}`);
      }
      return result;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(`Login error: ${error instanceof Error ? error.message : "Unknown error"}`);
      return { success: false, error };
    }
  };

  const logout = async () => {
    console.log("Logging out user");
    try {
      const result = await logoutUser();
      if (result.success) {
        console.log("Logout successful");
        setUser(null);
        toast.success("Logged out successfully");
      } else {
        console.error("Logout failed:", result.error);
        toast.error(`Logout failed: ${result.error?.message || "Unknown error"}`);
      }
      return result;
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(`Logout error: ${error instanceof Error ? error.message : "Unknown error"}`);
      return { success: false, error };
    }
  };

  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
