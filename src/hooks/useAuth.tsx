
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
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
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to safely parse JSON responses
const safeJsonParse = async (response: Response) => {
  const contentType = response.headers.get('Content-Type');
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response received:', text);
    throw new Error('Server returned non-JSON response');
  }

  const text = await response.text();
  
  if (!text || text.trim() === '') {
    console.error('Empty response received');
    throw new Error('Empty response from server');
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('JSON parsing error:', error);
    console.error('Response text:', text);
    throw new Error('Invalid JSON response from server');
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Check for existing token on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Attempting to sign in to:', 'http://localhost:8080/api/auth/login');
      
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', response.headers);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Authentication service not available. Please ensure the backend server is running on port 8080.');
        }
        
        // Try to get error message from response
        try {
          const errorData = await safeJsonParse(response);
          throw new Error(errorData.error || `Login failed with status ${response.status}`);
        } catch (parseError) {
          throw new Error(`Login failed with status ${response.status}`);
        }
      }

      const data = await safeJsonParse(response);

      // Store token and user data
      const authToken = data.token;
      const userData: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.full_name,
        role: data.user.role || 'user'
      };

      setToken(authToken);
      setUser(userData);
      
      // Save to localStorage
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    try {
      console.log('Attempting to register at:', 'http://localhost:8080/api/auth/register');
      
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          full_name: fullName 
        }),
      });

      console.log('Register response status:', response.status);
      console.log('Register response headers:', response.headers);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Registration service not available. Please ensure the backend server is running on port 8080.');
        }
        
        // Try to get error message from response
        try {
          const errorData = await safeJsonParse(response);
          throw new Error(errorData.error || `Registration failed with status ${response.status}`);
        } catch (parseError) {
          throw new Error(`Registration failed with status ${response.status}`);
        }
      }

      const data = await safeJsonParse(response);

      toast({
        title: "Registration Successful",
        description: data.message || "Account created successfully. Please check your email for verification.",
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Clear local state
      setUser(null);
      setToken(null);
      
      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');

      toast({
        title: "Signed Out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: user?.role === 'admin',
    token
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
