import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';

// Health Check Hook
export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiService.healthCheck(),
    refetchInterval: 30000, // Check every 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Movies Hooks
export function useMovies(params?: {
  page?: number;
  limit?: number;
  language?: string;
  difficulty?: string;
  genre?: string;
}) {
  return useQuery({
    queryKey: ['movies', params],
    queryFn: () => apiService.getMovies(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
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

// Categories and Languages
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useLanguages() {
  return useQuery({
    queryKey: ['languages'],
    queryFn: () => apiService.getLanguages(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Connection Status Hook
export function useConnectionStatus() {
  const healthQuery = useHealthCheck();
  
  return {
    isOnline: navigator.onLine,
    apiStatus: healthQuery.isSuccess ? 'connected' : healthQuery.isError ? 'disconnected' : 'checking',
    isConnected: navigator.onLine && healthQuery.isSuccess,
    healthData: healthQuery.data,
  };
}
