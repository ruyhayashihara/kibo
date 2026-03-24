import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any, error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      // Demo bypass for testing
      if (email === "admin@kibojobs.com" && password === "admin123") {
        const mockUser = {
          id: "demo-admin-id",
          email: "admin@kibojobs.com",
          user_metadata: { is_admin: true },
          app_metadata: { role: "admin" }
        } as any;
        setUser(mockUser);
        setIsAdmin(true);
        setLoading(false);
        return { data: { user: mockUser }, error: null };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      console.error("Erro ao entrar:", error.message)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check active sessions and sets the user
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        // Simple admin check: check user metadata or a specific email/domain
        // In a real app, this should be done via a 'role' column in the profiles table
        const adminStatus = currentUser.app_metadata?.role === 'admin' || 
                           currentUser.user_metadata?.is_admin === true ||
                           currentUser.email?.endsWith('@kibojobs.com'); // Fallback for demo
        setIsAdmin(adminStatus);
      }
      
      setLoading(false);
    };

    checkUser();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const adminStatus = currentUser.app_metadata?.role === 'admin' || 
                           currentUser.user_metadata?.is_admin === true ||
                           currentUser.email?.endsWith('@kibojobs.com');
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signOut }}>
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
