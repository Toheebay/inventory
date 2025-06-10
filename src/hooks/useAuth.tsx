
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

// Backend URL - update this if your backend runs on a different port
const BACKEND_URL = 'http://localhost:8080';

// Enhanced helper function to safely parse JSON responses with better debugging
const safeJsonParse = async (response: Response) => {
  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  
  const contentType = response.headers.get('Content-Type');
  console.log('Content-Type:', contentType);
  
  // Get the raw text first
  const text = await response.text();
  console.log('Raw response text:', text);
  console.log('Response text length:', text.length);
  
  // Check if response is empty
  if (!text || text.trim() === '') {
    console.error('Empty response received from server');
    throw new Error('Server returned an empty response. Please check if the backend server is running.');
  }

  // Check if content type indicates JSON
  if (!contentType || !contentType.includes('application/json')) {
    console.error('Non-JSON response received. Content-Type:', contentType);
    console.error('Response text:', text.substring(0, 200));
    throw new Error(`Server returned non-JSON response. Expected JSON but got: ${contentType || 'unknown'}. Response: ${text.substring(0, 100)}`);
  }

  // Try to parse JSON
  try {
    const parsed = JSON.parse(text);
    console.log('Successfully parsed JSON:', parsed);
    return parsed;
  } catch (error) {
    console.error('JSON parsing failed:', error);
    console.error('Text that failed to parse:', text);
    throw new Error(`Invalid JSON response from server. Parse error: ${error.message}. Response text: ${text.substring(0, 100)}`);
  }
};

// Function to check if backend is reachable
const checkBackendHealth = async () => {
  try {
    console.log('Checking backend health at:', `${BACKEND_URL}/api/health`);
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await safeJsonParse(response);
      console.log('Backend health check passed:', data);
      return true;
    } else {
      console.error('Backend health check failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Backend health check error:', error);
    return false;
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
      // First check if backend is reachable
      const isBackendHealthy = await checkBackendHealth();
      if (!isBackendHealthy) {
        throw new Error('Backend server is not responding. Please ensure the backend server is running on port 8080.');
      }

      const loginUrl = `${BACKEND_URL}/api/auth/login`;
      console.log('Attempting to sign in to:', loginUrl);
      console.log('Request payload:', { email, password: '***' });
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response received');

      if (!response.ok) {
        console.error('Login request failed with status:', response.status);
        
        // Try to get error message from response
        try {
          const errorData = await safeJsonParse(response);
          throw new Error(errorData.error || errorData.message || `Login failed with status ${response.status}`);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          throw new Error(`Login failed with status ${response.status}. Server may not be responding correctly.`);
        }
      }

      const data = await safeJsonParse(response);
      console.log('Login successful, received data:', data);

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
      // First check if backend is reachable
      const isBackendHealthy = await checkBackendHealth();
      if (!isBackendHealthy) {
        throw new Error('Backend server is not responding. Please ensure the backend server is running on port 8080.');
      }

      const registerUrl = `${BACKEND_URL}/api/auth/register`;
      console.log('Attempting to register at:', registerUrl);
      console.log('Request payload:', { email, password: '***', full_name: fullName });
      
      const response = await fetch(registerUrl, {
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

      console.log('Register response received');

      if (!response.ok) {
        console.error('Registration request failed with status:', response.status);
        
        // Try to get error message from response
        try {
          const errorData = await safeJsonParse(response);
          throw new Error(errorData.error || errorData.message || `Registration failed with status ${response.status}`);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          throw new Error(`Registration failed with status ${response.status}. Server may not be responding correctly.`);
        }
      }

      const data = await safeJsonParse(response);
      console.log('Registration successful, received data:', data);

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
