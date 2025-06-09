// src/hooks/useApi.ts
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';

// Movies hooks
export const useMovies = (params?: {
  page?: number;
  limit?: number;
  language?: string;
  difficulty?: string;
  genre?: string;
}) => {
  return useQuery({
    queryKey: ['movies', params],
    queryFn: () => apiService.getMovies(params || {}),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useFeaturedMovies = () => {
  return useQuery({
    queryKey: ['featured-movies'],
    queryFn: () => apiService.getFeaturedMovies(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

export const useSearchMovies = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['search-movies', query],
    queryFn: () => apiService.searchMovies(query),
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useMovie = (movieId: string) => {
  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => apiService.getMovie(movieId),
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000,
  });
};

// Progress hooks
export const useProgressStats = () => {
  return useQuery({
    queryKey: ['progress-stats'],
    queryFn: () => apiService.getProgressStats(),
    staleTime: 5 * 60 * 1000,
  });
};

// Metadata hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });
};

export const useLanguages = () => {
  return useQuery({
    queryKey: ['languages'],
    queryFn: () => apiService.getLanguages(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Health check hook for debugging
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health-check'],
    queryFn: () => apiService.healthCheck(),
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
  });
};