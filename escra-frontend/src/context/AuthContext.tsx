'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing auth token and validate it
    const token = Cookies.get('auth_token');
    if (token) {
      // TODO: Validate token with your backend
      // For now, we'll just set a mock user
      setUser({
        id: '1',
        email: 'user@example.com',
        name: 'John Doe'
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      // Mock successful login
      const mockToken = 'mock-jwt-token';
      Cookies.set('auth_token', mockToken, { expires: 7 }); // Expires in 7 days
      
      setUser({
        id: '1',
        email,
        name: 'John Doe'
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Store the token
      Cookies.set('auth_token', data.token, { expires: 7 }); // Expires in 7 days
      
      // Set user data
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: `${data.user.firstName} ${data.user.lastName}`,
      });

      // Redirect to onboarding
      router.push('/onboarding');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('auth_token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 