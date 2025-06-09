// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface User {
  id: string;
  email: string;
  role: string;
  email_confirmed_at?: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  native_language: string;
  learning_languages: string[];
  learning_goals: object;
  created_at?: string;
}

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
  imdb_rating?: number;
}

export interface AuthResponse {
  user: User;
  profile?: UserProfile;
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in?: number;
  message: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('access_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`API Request: ${config.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`API Response: ${url}`, data);
      return data;
    } catch (error) {
      console.error(`API Error: ${url}`, error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  // Health check
  async healthCheck() {
    return this.request('/api/v1/health');
  }

  // Authentication endpoints
  async register(email: string, password: string, fullName?: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
      }),
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/api/v1/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser(): Promise<{ user: User; profile: UserProfile }> {
    return this.request('/api/v1/auth/me');
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  // Movies endpoints
  async getMovies(params: {
    page?: number;
    limit?: number;
    language?: string;
    difficulty?: string;
    genre?: string;
  } = {}): Promise<{
    movies: Movie[];
    total: number;
    page: number;
    per_page: number;
  }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    
    const queryString = searchParams.toString();
    const endpoint = `/api/v1/movies${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getFeaturedMovies(): Promise<{ movies: Movie[] }> {
    return this.request('/api/v1/movies/featured');
  }

  async searchMovies(query: string, limit = 10): Promise<{
    movies: Movie[];
    query: string;
    total: number;
  }> {
    return this.request(`/api/v1/movies/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async getMovie(movieId: string): Promise<{
    movie: Movie;
    user_progress?: any;
  }> {
    return this.request(`/api/v1/movies/${movieId}`);
  }

  // Progress endpoints
  async updateProgress(movieId: string, progressData: {
    progress_percentage: number;
    time_watched: number;
    vocabulary_learned?: number;
  }) {
    return this.request('/api/v1/progress/update', {
      method: 'POST',
      body: JSON.stringify({
        movie_id: movieId,
        ...progressData,
      }),
    });
  }

  async getProgressStats() {
    return this.request('/api/v1/progress/stats');
  }

  // Metadata endpoints
  async getCategories() {
    return this.request('/api/v1/categories');
  }

  async getLanguages() {
    return this.request('/api/v1/languages');
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;