// src/hooks/useApi.ts - Updated for Railway deployment
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 🚀 UPDATED: Use Railway API instead of localhost
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://cinefluent-api-production.up.railway.app';

const apiService = {
  async healthCheck() {
    const response = await fetch(`${API_BASE}/`);
    if (!response.ok) throw new Error('Health check failed');
    return response.json();
  },

  async getMovies() {
    const response = await fetch(`${API_BASE}/api/v1/movies`);
    if (!response.ok) throw new Error('Failed to fetch movies');
    return response.json();
  },

  async getCategories() {
    const response = await fetch(`${API_BASE}/api/v1/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  async getFeaturedMovies() {
    const response = await fetch(`${API_BASE}/api/v1/movies/featured`);
    if (!response.ok) throw new Error('Failed to fetch featured movies');
    return response.json();
  },

  async searchMovies(query: string) {
    const response = await fetch(`${API_BASE}/api/v1/movies/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  },

  async registerUser(userData: {
    email: string;
    password: string;
    name: string;
  }) {
    const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  async loginUser(credentials: {
    email: string;
    password: string;
  }) {
    const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  }
};

// Health Check Hook
export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiService.healthCheck(),
    refetchInterval: 30000, // Check every 30 seconds
    retry: 3,
  });
}

// Movies Hooks
export function useMovies() {
  return useQuery({
    queryKey: ['movies'],
    queryFn: () => apiService.getMovies(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFeaturedMovies() {
  return useQuery({
    queryKey: ['movies', 'featured'],
    queryFn: () => apiService.getFeaturedMovies(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useSearchMovies(query: string, enabled = true) {
  return useQuery({
    queryKey: ['movies', 'search', query],
    queryFn: () => apiService.searchMovies(query),
    enabled: enabled && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Auth Hooks
export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiService.registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiService.loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

// Connection Status Hook
export function useConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  const healthQuery = useHealthCheck();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (healthQuery.isSuccess) {
      setApiStatus('connected');
    } else if (healthQuery.isError) {
      setApiStatus('disconnected');
    } else {
      setApiStatus('checking');
    }
  }, [healthQuery.isSuccess, healthQuery.isError]);

  return {
    isOnline,
    apiStatus,
    isConnected: isOnline && apiStatus === 'connected',
  };
}
