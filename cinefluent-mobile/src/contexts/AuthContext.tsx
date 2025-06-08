// src/contexts/AuthContext.tsx - Fixed to match your backend response
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService, User, Profile } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isPremium: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      console.log('🔍 Found existing token, verifying...');
      try {
        apiService.setToken(token);
        const userData = await apiService.getProfile();
        console.log('✅ Token verified, user loaded:', userData);
        setUser(userData.user);
        setProfile(userData.profile);
      } catch (error) {
        console.error('❌ Token verification failed:', error);
        localStorage.removeItem('auth_token');
        apiService.setToken(null);
      }
    } else {
      console.log('👤 No existing token found');
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    console.log('🔐 Starting login process...', { email });
    setLoading(true);
    
    try {
      const response = await apiService.login({ email, password });
      console.log('✅ Login successful:', response);
      
      // Your backend returns user, profile, and session data
      setUser(response.user);
      setProfile(response.profile);
      console.log('🎉 User logged in successfully!');
      
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    console.log('📝 Starting registration...', { email, name });
    setLoading(true);
    
    try {
      const response = await apiService.register({ 
        email, 
        password, 
        full_name: name 
      });
      console.log('✅ Registration successful:', response);
      
      setUser(response.user);
      setProfile(response.profile);
      console.log('🎉 User registered successfully!');
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('👋 Logging out...');
    localStorage.removeItem('auth_token');
    apiService.setToken(null);
    setUser(null);
    setProfile(null);
    console.log('✅ Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isPremium: false, // Will implement this when you add subscription data
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
