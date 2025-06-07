// src/lib/api.ts - Updated to work with new FastAPI endpoints

const API_BASE = 'http://localhost:8000/api/v1';

export interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  release_year: number;
  difficulty_level: string;
  languages: string[];
  genres: string[];
  thumbnail_url: string;
  video_url?: string;
  is_premium: boolean;
  vocabulary_count: number;
}

export interface MovieResponse {
  movies: Movie[];
  total: number;
  page: number;
  per_page: number;
}

export interface UserProgress {
  user_id: string;
  movie_id: string;
  progress_percentage: number;
  time_watched: number;
  vocabulary_learned: number;
  last_watched_at: string | null;
}

export interface ProgressUpdate {
  progress_percentage: number;
  time_watched: number;
  vocabulary_learned: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; service: string }>('/../../'); // Root endpoint
  }

  // Movies API
  async getMovies(params?: {
    page?: number;
    limit?: number;
    language?: string;
    difficulty?: string;
    genre?: string;
  }): Promise<MovieResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.language) searchParams.append('language', params.language);
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty);
    if (params?.genre) searchParams.append('genre', params.genre);

    const query = searchParams.toString();
    return this.request<MovieResponse>(`/movies${query ? `?${query}` : ''}`);
  }

  async getMovie(movieId: string): Promise<Movie> {
    return this.request<Movie>(`/movies/${movieId}`);
  }

  async searchMovies(query: string, limit = 10) {
    return this.request<{ movies: Movie[]; query: string }>(
      `/movies/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
  }

  async getFeaturedMovies() {
    return this.request<{ movies: Movie[] }>('/movies/featured');
  }

  // Progress API
  async getUserProgress(userId: string) {
    return this.request<{ progress: UserProgress[] }>(`/users/${userId}/progress`);
  }

  async updateProgress(userId: string, movieId: string, progress: ProgressUpdate) {
    return this.request<{ message: string; progress: UserProgress }>(
      `/users/${userId}/movies/${movieId}/progress`,
      {
        method: 'POST',
        body: JSON.stringify(progress),
      }
    );
  }

  async getMovieProgress(userId: string, movieId: string): Promise<UserProgress> {
    return this.request<UserProgress>(`/users/${userId}/movies/${movieId}/progress`);
  }

  // Subtitles API
  async getSubtitles(movieId: string, language = 'en') {
    return this.request<{
      movie_id: string;
      language: string;
      subtitles: Array<{ start: number; end: number; text: string }>;
    }>(`/movies/${movieId}/subtitles?lang=${language}`);
  }

  // Categories API
  async getCategories() {
    return this.request<{
      categories: Array<{ id: string; name: string; icon: string }>;
    }>('/categories');
  }

  // Languages API
  async getLanguages() {
    return this.request<{
      languages: Array<{ code: string; name: string; flag: string }>;
    }>('/languages');
  }
}

export const apiService = new ApiService();