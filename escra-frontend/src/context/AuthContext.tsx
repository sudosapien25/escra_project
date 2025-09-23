'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import authService, { User, LoginCredentials, RegisterData } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Initialize auth state from localStorage
  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check if we have tokens
      if (authService.isAuthenticated()) {
        // Try to get user from localStorage first
        const cachedUser = authService.getUser();
        if (cachedUser) {
          setUser(cachedUser);
          setIsAuthenticated(true);
        }

        // Then fetch fresh user data from API
        try {
          const freshUser = await authService.getCurrentUser();
          setUser(freshUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // If we can't get fresh data but have cached data, continue
          // If we have no cached data, clear auth
          if (!cachedUser) {
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);

      // Redirect to dashboard after successful login
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      setIsAuthenticated(true);

      // Redirect to dashboard after successful registration
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    }
  };

  const refreshUser = async () => {
    if (!isAuthenticated) return;

    try {
      const freshUser = await authService.getCurrentUser();
      setUser(freshUser);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    isAdmin: user?.is_admin || false,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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

// Hook for requiring authentication
export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
}

// Hook for requiring admin role
export function useRequireAdmin(redirectTo = '/dashboard') {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push(redirectTo);
    }
  }, [isAdmin, isLoading, router, redirectTo]);

  return { isAdmin, isLoading };
}