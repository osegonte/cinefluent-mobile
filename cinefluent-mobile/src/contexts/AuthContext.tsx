// src/contexts/AuthContext.tsx - FINAL FIXED VERSION
import React, { createContext, useContext, useEffect, useState } from 'react';

// Match the EXACT backend response structure from your curl test
interface User {
  id: string;
  email: string;
  email_confirmed_at: string;
}

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string | null;
  native_language: string;
  learning_languages: string[];
  learning_goals: any;
  created_at: string;
  updated_at: string;
}

// This EXACTLY matches your backend response
interface LoginResponse {
  user: User;
  profile: Profile;
  session: any;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  message: string;
}

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

  // Use the EXACT API URL that works in curl
  const API_BASE = 'https://cinefluent-api-production-5082.up.railway.app';

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    console.log('🔍 Initializing auth...');
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      console.log('🔍 Found existing token, verifying...');
      try {
        const userData = await getProfile(token);
        console.log('✅ Token verified, user loaded:', userData);
        setUser(userData.user);
        setProfile(userData.profile);
      } catch (error) {
        console.error('❌ Token verification failed:', error);
        localStorage.removeItem('auth_token');
      }
    } else {
      console.log('👤 No existing token found');
    }
    setLoading(false);
  };

  const makeApiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE}${endpoint}`;
    
    console.log('🌐 Making request to:', url);
    console.log('🌐 Request method:', options.method || 'GET');

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText };
        }
        
        const errorMessage = errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ API Response received successfully');
      return data;
    } catch (error) {
      console.error(`❌ Request failed: ${url}`, error);
      
      // Provide better error messages for common issues
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
        }
        if (error.message.includes('CORS')) {
          throw new Error('CORS error: Cross-origin request blocked. Please contact support.');
        }
      }
      throw error;
    }
  };

  const getProfile = async (token: string) => {
    return makeApiRequest('/api/v1/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  };

  const login = async (email: string, password: string) => {
    console.log('🔐 Starting login process...', { email });
    setLoading(true);
    
    try {
      // Make the exact same request that works in curl
      const response: LoginResponse = await makeApiRequest('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      console.log('✅ Login response received');
      console.log('User ID:', response.user?.id);
      console.log('Profile username:', response.profile?.username);
      console.log('Token length:', response.access_token?.length);
      
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
        console.log('🔑 Token stored in localStorage');
      } else {
        throw new Error('No access token received from server');
      }
      
      if (response.user && response.profile) {
        setUser(response.user);
        setProfile(response.profile);
        console.log('🎉 User logged in successfully!');
      } else {
        throw new Error('Invalid user data received from server');
      }
      
    } catch (error) {
      console.error('❌ Login error:', error);
      // Clean up any partial state
      localStorage.removeItem('auth_token');
      setUser(null);
      setProfile(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    console.log('📝 Starting registration...', { email, name });
    setLoading(true);
    
    try {
      const response: LoginResponse = await makeApiRequest('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          password, 
          full_name: name 
        }),
      });
      
      console.log('✅ Registration successful');
      
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
      } else {
        throw new Error('No access token received from server');
      }
      
      if (response.user && response.profile) {
        setUser(response.user);
        setProfile(response.profile);
        console.log('🎉 User registered successfully!');
      } else {
        throw new Error('Invalid user data received from server');
      }
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      // Clean up any partial state
      localStorage.removeItem('auth_token');
      setUser(null);
      setProfile(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('👋 Logging out...');
    localStorage.removeItem('auth_token');
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