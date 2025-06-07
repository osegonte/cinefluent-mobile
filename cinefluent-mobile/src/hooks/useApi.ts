// src/hooks/useApi.ts - Fixed to work with your current setup
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Simple API service to match your existing structure
const API_BASE = 'http://localhost:8000';

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

  async getFeaturedMovies() {
    const response = await fetch(`${API_BASE}/api/v1/movies/featured`);
    if (!response.ok) throw new Error('Failed to fetch featured movies');
    return response.json();
  },

  async searchMovies(query: string) {
    const response = await fetch(`${API_BASE}/api/v1/movies/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
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

export function useSearchMovies(query: string, enabled = true) {
  return useQuery({
    queryKey: ['movies', 'search', query],
    queryFn: () => apiService.searchMovies(query),
    enabled: enabled && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
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