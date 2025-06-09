// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cinefluent-api-production.up.railway.app';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  release_year: number;
  difficulty_level: string;
  languages: string[];
  genres: string[];
  thumbnail_url: string;
  video_url: string | null;
  is_premium: boolean;
  vocabulary_count: number;
  imdb_rating: number;
}

interface MoviesResponse {
  movies: Movie[];
  total: number;
  page: number;
  per_page: number;
}

interface MoviesParams {
  page?: number;
  limit?: number;
  language?: string;
  difficulty?: string;
  genre?: string;
}

class ApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log(`🌐 API Request: ${url}`);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ API Response for ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`❌ API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/');
  }

  // Movies endpoints
  async getMovies(params: MoviesParams = {}): Promise<MoviesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('per_page', params.limit.toString());
    if (params.language) searchParams.append('language', params.language);
    if (params.difficulty) searchParams.append('difficulty', params.difficulty);
    if (params.genre) searchParams.append('genre', params.genre);

    const query = searchParams.toString();
    const endpoint = `/api/v1/movies${query ? `?${query}` : ''}`;
    
    return this.makeRequest<MoviesResponse>(endpoint);
  }

  async getFeaturedMovies(): Promise<MoviesResponse> {
    // For now, return the same as getMovies since your API doesn't have a featured endpoint
    // You can implement this later with a specific endpoint
    return this.getMovies({ limit: 6 });
  }

  async searchMovies(query: string): Promise<MoviesResponse> {
    const searchParams = new URLSearchParams({
      search: query,
    });
    
    return this.makeRequest<MoviesResponse>(`/api/v1/movies?${searchParams.toString()}`);
  }

  async getMovie(movieId: string): Promise<Movie> {
    return this.makeRequest<Movie>(`/api/v1/movies/${movieId}`);
  }

  // Progress endpoints (implement these when your backend has them)
  async getProgressStats() {
    // Placeholder - implement when backend is ready
    return {
      movies_completed: 0,
      words_learned: 0,
      study_streak: 0,
      total_study_time: 0,
    };
  }

  // Metadata endpoints
  async getCategories() {
    // Extract from movies data or implement backend endpoint
    const movies = await this.getMovies();
    const genres = new Set<string>();
    movies.movies.forEach(movie => {
      movie.genres.forEach(genre => genres.add(genre));
    });
    return Array.from(genres).map(genre => ({ id: genre, name: genre }));
  }

  async getLanguages() {
    // Extract from movies data or implement backend endpoint
    const movies = await this.getMovies();
    const languages = new Set<string>();
    movies.movies.forEach(movie => {
      movie.languages.forEach(lang => languages.add(lang));
    });
    return Array.from(languages).map(lang => ({ code: lang, name: lang }));
  }
}

export const apiService = new ApiService();

// Export individual functions for backward compatibility
export const api = {
  get: <T>(endpoint: string) => apiService.makeRequest<T>(endpoint),
  post: <T>(endpoint: string, data: any) => apiService.makeRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: <T>(endpoint: string, data: any) => apiService.makeRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: <T>(endpoint: string) => apiService.makeRequest<T>(endpoint, {
    method: 'DELETE',
  }),
};

export default apiService;