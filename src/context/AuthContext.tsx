
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
  updateGuestInfo: (name: string, email: string) => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isGuest: true,
  login: async () => ({ success: false, error: "AuthContext not initialized" }),
  register: async () => ({ success: false, error: "AuthContext not initialized" }),
  logout: async () => ({ success: false, error: "AuthContext not initialized" }),
  refreshUser: async () => null,
  updateGuestInfo: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);

  // Load guest user from localStorage on initial render if available
  useEffect(() => {
    const savedGuestUser = localStorage.getItem('guestUser');
    if (savedGuestUser) {
      try {
        setUser(JSON.parse(savedGuestUser));
      } catch (e) {
        console.error("Failed to parse saved guest user:", e);
        setUser(createGuestUser());
      }
    } else {
      setUser(createGuestUser());
    }
  }, []);

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
                // Clear guest user from localStorage when logged in
                localStorage.removeItem('guestUser');
              } else {
                // If can't get user profile, fallback to guest
                const newGuestUser = createGuestUser();
                setUser(newGuestUser);
                setIsGuest(true);
                localStorage.setItem('guestUser', JSON.stringify(newGuestUser));
              }
              setLoading(false);
            } catch (error) {
              console.error("Error fetching user profile on auth change:", error);
              const newGuestUser = createGuestUser();
              setUser(newGuestUser);
              setIsGuest(true);
              localStorage.setItem('guestUser', JSON.stringify(newGuestUser));
              setLoading(false);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          const newGuestUser = createGuestUser();
          setUser(newGuestUser);
          setIsGuest(true);
          localStorage.setItem('guestUser', JSON.stringify(newGuestUser));
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
              // Clear guest user from localStorage when logged in
              localStorage.removeItem('guestUser');
              setLoading(false);
              return; // Exit early if we successfully loaded a user profile
            }
          } catch (error) {
            console.error("Error loading initial user profile:", error);
          }
        }
        
        // If we reach here, we either don't have a session or couldn't load the profile
        // Check for a saved guest user
        const savedGuestUser = localStorage.getItem('guestUser');
        if (savedGuestUser) {
          try {
            setUser(JSON.parse(savedGuestUser));
          } catch (e) {
            console.error("Failed to parse saved guest user:", e);
            const newGuestUser = createGuestUser();
            setUser(newGuestUser);
            localStorage.setItem('guestUser', JSON.stringify(newGuestUser));
          }
        } else {
          const newGuestUser = createGuestUser();
          setUser(newGuestUser);
          localStorage.setItem('guestUser', JSON.stringify(newGuestUser));
        }
        
        setIsGuest(true);
        setLoading(false);
      } catch (error) {
        console.error("Error during auth initialization:", error);
        const newGuestUser = createGuestUser();
        setUser(newGuestUser);
        setIsGuest(true);
        localStorage.setItem('guestUser', JSON.stringify(newGuestUser));
        setLoading(false);
      }
    };

    initializeUser();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const updateGuestInfo = (name: string, email: string) => {
    if (!isGuest || !user) return;
    
    const updatedUser = {
      ...user,
      name: name || user.name,
      email: email || user.email
    };
    
    setUser(updatedUser);
    localStorage.setItem('guestUser', JSON.stringify(updatedUser));
    toast.success("Guest information updated!");
  };

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
          localStorage.removeItem('guestUser');
          setLoading(false);
          return userProfile;
        }
      }
      
      // If we can't get a user profile, use the guest user
      const savedGuestUser = localStorage.getItem('guestUser');
      if (savedGuestUser) {
        try {
          const parsedUser = JSON.parse(savedGuestUser);
          setUser(parsedUser);
          setIsGuest(true);
          setLoading(false);
          return parsedUser;
        } catch (e) {
          console.error("Failed to parse saved guest user:", e);
        }
      }
      
      const guestUser = createGuestUser();
      setUser(guestUser);
      setIsGuest(true);
      localStorage.setItem('guestUser', JSON.stringify(guestUser));
      setLoading(false);
      return guestUser;
    } catch (error) {
      console.error("Error refreshing user profile:", error);
      const guestUser = createGuestUser();
      setUser(guestUser);
      setIsGuest(true);
      localStorage.setItem('guestUser', JSON.stringify(guestUser));
      setLoading(false);
      return guestUser;
    }
  };

  const register = async (data: RegisterFormData) => {
    console.log("Registering new user with data:", { ...data, password: '***hidden***' });
    setLoading(true);
    try {
      // Update the redirect URL to use the current origin instead of localhost
      const currentOrigin = window.location.origin;
      const result = await registerUser(data, currentOrigin);
      
      if (result.success) {
        console.log("Registration successful, refreshing user");
        await refreshUser();
        toast.success("Registration successful! Please check your email to verify your account.");
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
        const guestUser = createGuestUser();
        setUser(guestUser);
        setIsGuest(true);
        localStorage.setItem('guestUser', JSON.stringify(guestUser));
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
    refreshUser,
    updateGuestInfo
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
