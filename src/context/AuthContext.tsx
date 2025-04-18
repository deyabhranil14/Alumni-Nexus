
import React, { createContext, useState, useEffect, useContext } from "react";
import { User } from "@/types";
import { getCurrentUser, loginUser, logoutUser, registerUser, AuthFormData, RegisterFormData } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: AuthFormData) => Promise<{ success: boolean; error?: any }>;
  register: (data: RegisterFormData) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<{ success: boolean; error?: any }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user
  useEffect(() => {
    const initializeUser = async () => {
      setLoading(true);
      const userProfile = await getCurrentUser();
      setUser(userProfile);
      setLoading(false);
    };

    initializeUser();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          const userProfile = await getCurrentUser();
          setUser(userProfile);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshUser = async () => {
    const userProfile = await getCurrentUser();
    setUser(userProfile);
  };

  const register = async (data: RegisterFormData) => {
    const result = await registerUser(data);
    if (result.success) {
      await refreshUser();
    }
    return result;
  };

  const login = async (data: AuthFormData) => {
    const result = await loginUser(data);
    if (result.success) {
      await refreshUser();
    }
    return result;
  };

  const logout = async () => {
    const result = await logoutUser();
    if (result.success) {
      setUser(null);
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
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
