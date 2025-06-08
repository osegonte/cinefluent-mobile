import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from '@/lib/api';

interface User {
  id: string;
  email: string;
  full_name?: string;
  name?: string;
  subscription_tier?: 'free' | 'premium' | 'pro';
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      console.log('🔍 Found existing token, verifying...');
      verifyToken();
    } else {
      console.log('👤 No existing token found');
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await apiService.getProfile();
      setUser(response.user);
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('🔐 Starting login process...', { email });
    setLoading(true);
    
    try {
      console.log('📡 Calling API login...');
      const response = await apiService.login(email, password);
      console.log('✅ Login API response:', response);
      
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
        console.log('💾 Token saved to localStorage');
        
        const userData = response.user || {
          id: response.user?.id || '',
          email: email,
          full_name: response.user?.full_name,
        };
        
        console.log('👤 Setting user data:', userData);
        setUser(userData);
        console.log('🎉 Login successful!');
      } else {
        throw new Error('No access token in response');
      }
      
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const response = await apiService.register(email, password, name);
      localStorage.setItem('auth_token', response.access_token);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isPremium: user?.subscription_tier !== 'free',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
