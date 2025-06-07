// src/hooks/useApi.ts
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';

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
export function useMovies(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['movies', page, limit],
    queryFn: () => apiService.getMovies(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMovie(id: string) {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => apiService.getMovie(id),
    enabled: !!id,
  });
}

export function useMovieSearch(query: string) {
  return useQuery({
    queryKey: ['movies', 'search', query],
    queryFn: () => apiService.searchMovies(query),
    enabled: query.length > 2, // Only search if query is 3+ characters
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Progress Hooks
export function useUserProgress(userId: string) {
  return useQuery({
    queryKey: ['progress', userId],
    queryFn: () => apiService.getUserProgress(userId),
    enabled: !!userId,
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, movieId, progress }: {
      userId: string;
      movieId: string;
      progress: number;
    }) => apiService.updateProgress(userId, movieId, progress),
    onSuccess: (data, variables) => {
      // Invalidate and refetch progress data
      queryClient.invalidateQueries({ queryKey: ['progress', variables.userId] });
    },
  });
}

// Subtitles Hook
export function useSubtitles(movieId: string, language = 'en') {
  return useQuery({
    queryKey: ['subtitles', movieId, language],
    queryFn: () => apiService.getSubtitles(movieId, language),
    enabled: !!movieId,
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