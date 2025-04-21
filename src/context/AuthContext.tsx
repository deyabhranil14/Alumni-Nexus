import React, { createContext, useState, useEffect, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { User as AppUser, UserRole } from "@/types";
import { getCurrentUser, loginUser, logoutUser, registerUser, AuthFormData, RegisterFormData } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

const createGuestUser = (): AppUser => ({
  id: `guest-${uuidv4()}`,
  role: 'guest' as UserRole,
  name: 'Guest User',
  email: '',
  profileImage: '',
  coverImage: '',
  joinDate: new Date().toISOString(),
  education: [],
  experience: [],
  skills: [],
  interests: []
});

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  login: (data: AuthFormData) => Promise<{ success: boolean; error?: any }>;
  register: (data: RegisterFormData) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<{ success: boolean; error?: any }>;
  refreshUser: () => Promise<AppUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(createGuestUser());
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    console.log("Setting up auth state listener");

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, "Session:", newSession ? "exists" : "null");
        setSession(newSession);
        
        if (newSession && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          console.log("User signed in, fetching profile data");
          setLoading(true);
          
          setTimeout(async () => {
            try {
              const userProfile = await getCurrentUser();
              console.log("User profile fetched:", userProfile ? "success" : "null");
              if (userProfile) {
                setUser(userProfile);
                setIsGuest(false);
              } else {
                setUser(createGuestUser());
                setIsGuest(true);
              }
              setLoading(false);
            } catch (error) {
              console.error("Error fetching user profile on auth change:", error);
              setUser(createGuestUser());
              setIsGuest(true);
              setLoading(false);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          setUser(createGuestUser());
          setIsGuest(true);
          setLoading(false);
        }
      }
    );

    const initializeUser = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        setSession(existingSession);
        
        if (existingSession?.user) {
          try {
            console.log("Found existing session, loading user profile");
            const userProfile = await getCurrentUser();
            console.log("Initial user profile:", userProfile ? "loaded" : "not found");
            if (userProfile) {
              setUser(userProfile);
              setIsGuest(false);
            } else {
              setUser(createGuestUser());
              setIsGuest(true);
            }
          } catch (error) {
            console.error("Error loading initial user profile:", error);
            setUser(createGuestUser());
            setIsGuest(true);
          }
        } else {
          setUser(createGuestUser());
          setIsGuest(true);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error during auth initialization:", error);
        setUser(createGuestUser());
        setIsGuest(true);
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
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const userProfile = await getCurrentUser();
        console.log("User profile refreshed:", userProfile ? "success" : "not found");
        if (userProfile) {
          setUser(userProfile);
          setIsGuest(false);
          setLoading(false);
          return userProfile;
        }
      }
      
      const guestUser = createGuestUser();
      setUser(guestUser);
      setIsGuest(true);
      setLoading(false);
      return guestUser;
    } catch (error) {
      console.error("Error refreshing user profile:", error);
      const guestUser = createGuestUser();
      setUser(guestUser);
      setIsGuest(true);
      setLoading(false);
      return guestUser;
    }
  };

  const register = async (data: RegisterFormData) => {
    console.log("Registering new user with data:", { ...data, password: '***hidden***' });
    setLoading(true);
    try {
      const result = await registerUser(data);
      if (result.success) {
        console.log("Registration successful, refreshing user");
        await refreshUser();
        toast.success("Registration successful!");
      } else {
        console.error("Registration failed:", result.error);
        toast.error(`Registration failed: ${result.error?.message || "Unknown error"}`);
        setLoading(false);
      }
      return result;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(`Registration error: ${error instanceof Error ? error.message : "Unknown error"}`);
      setLoading(false);
      return { success: false, error };
    }
  };

  const login = async (data: AuthFormData) => {
    console.log("Logging in user");
    setLoading(true);
    try {
      const result = await loginUser(data);
      if (result.success) {
        console.log("Login successful");
        toast.success("Login successful!");
      } else {
        console.error("Login failed:", result.error);
        toast.error(`Login failed: ${result.error?.message || "Unknown error"}`);
        setLoading(false);
      }
      return result;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(`Login error: ${error instanceof Error ? error.message : "Unknown error"}`);
      setLoading(false);
      return { success: false, error };
    }
  };

  const logout = async () => {
    console.log("Logging out user");
    try {
      const result = await logoutUser();
      if (result.success) {
        console.log("Logout successful");
        setUser(createGuestUser());
        setIsGuest(true);
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
    isGuest,
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
