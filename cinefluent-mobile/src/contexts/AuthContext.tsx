// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiService, User, UserProfile } from '../lib/api';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        setProfile(null);
        return;
      }

      const response = await apiService.getCurrentUser();
      setUser(response.user);
      setProfile(response.profile);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // Token might be invalid, clear it
      localStorage.removeItem('access_token');
      apiService.clearToken();
      setUser(null);
      setProfile(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.login(email, password);
      setUser(response.user);
      setProfile(response.profile || null);
      
      // Store refresh token if provided
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.register(email, password, fullName);
      setUser(response.user);
      setProfile(response.profile || null);
      
      // Store refresh token if provided
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      setUser(null);
      setProfile(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsLoading(false);
    }
  };

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        apiService.setToken(token);
        await refreshUser();
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;