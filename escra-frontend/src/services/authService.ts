import apiClient, { api } from '@/lib/apiClient';
import { AxiosError } from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  company?: string;
  phone?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  company?: string;
  phone?: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', credentials);
      const { access_token, refresh_token, user } = response.data;

      // Store tokens and user info
      apiClient.updateTokens(access_token, refresh_token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.detail || 'Login failed');
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/register', data);
      const { access_token, refresh_token, user } = response.data;

      // Store tokens and user info
      apiClient.updateTokens(access_token, refresh_token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.detail || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API response
      apiClient.logout();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>('/api/auth/me');
      const user = response.data;

      // Update cached user info
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return user;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.detail || 'Failed to get user info');
    }
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const response = await api.put<User>('/api/auth/update-profile', updates);
      const user = response.data;

      // Update cached user info
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return user;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.detail || 'Failed to update profile');
    }
  }

  async refreshToken(): Promise<string> {
    const refreshToken = typeof window !== 'undefined'
      ? localStorage.getItem('refresh_token')
      : null;

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await api.post<AuthResponse>('/api/auth/refresh', {
        refresh_token: refreshToken
      });

      const { access_token, refresh_token: newRefreshToken } = response.data;
      apiClient.updateTokens(access_token, newRefreshToken);

      return access_token;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.detail || 'Failed to refresh token');
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  }

  getUser(): User | null {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.is_admin || false;
  }
}

export const authService = new AuthService();
export default authService;