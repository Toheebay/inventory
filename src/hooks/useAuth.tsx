
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (supabaseUser: User) => {
    try {
      // You'll replace this with your MongoDB API call
      const response = await fetch(`/api/users/${supabaseUser.id}`, {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          full_name: userData.full_name,
          role: userData.role || 'user'
        });
      } else {
        // Fallback if user doesn't exist in your MongoDB yet
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          role: 'user'
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to basic user data
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        role: 'user'
      });
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user);
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (data.user) {
        // Create user in your MongoDB via API
        try {
          await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            },
            body: JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
              role: 'user'
            })
          });
        } catch (apiError) {
          console.error('Error creating user in MongoDB:', apiError);
        }
      }

      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      setUser(null);
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully",
      });
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
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
