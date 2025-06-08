// src/lib/api.ts - Fixed API service
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://cinefluent-api-production-5082.up.railway.app';

export interface Movie {
  id: string;
  title: string;
  description: string;
  duration_minutes: number; // Keep existing field name
  difficulty_level: string;
  category: string;
  language: string;
  poster_url?: string;
  trailer_url?: string;
  is_premium: boolean;
  vocabulary_count?: number;
  release_year?: number;
  created_at?: string;
}

// Based on your actual backend response
export interface User {
  id: string;
  email: string;
  email_confirmed_at: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  native_language: string;
  learning_languages: string[];
  learning_goals: any;
  created_at: string;
  updated_at: string;
}

// This matches your actual backend response
export interface AuthResponse {
  user: User;
  profile: Profile;
  session: any;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  message: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Initialize token from localStorage
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    console.log('🌐 Making API request to:', url);
    
    try {
      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
        ...options,
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Response:', data);
      return data;
    } catch (error) {
      console.error(`❌ API request failed: ${url}`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request<{ 
      status: string; 
      checks: {
        database: string;
        auth: string;
      };
      timestamp: string;
    }>('/api/v1/health');
  }

  // Authentication
  async register(data: RegisterRequest): Promise<AuthResponse> {
    console.log('📝 API Register called with:', { email: data.email, full_name: data.full_name });
    const response = await this.request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    console.log('🔐 API Login called with:', { email: data.email });
    const response = await this.request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  async getProfile(): Promise<{ user: User; profile: Profile }> {
    return this.request<{ user: User; profile: Profile }>('/api/v1/auth/me');
  }

  // Movies
  async getMovies(params?: {
    skip?: number;
    limit?: number;
    category?: string;
    language?: string;
    difficulty?: string;
  }): Promise<Movie[]> {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.language) searchParams.append('language', params.language);
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty);
    
    const query = searchParams.toString();
    const endpoint = `/api/v1/movies${query ? `?${query}` : ''}`;
    
    const result = await this.request<{ movies: Movie[] }>(endpoint);
    return result.movies || [];
  }

  async searchMovies(query: string): Promise<{ movies: Movie[] }> {
    return this.request<{ movies: Movie[] }>(`/api/v1/movies/search?q=${encodeURIComponent(query)}`);
  }

  async getFeaturedMovies(): Promise<{ movies: Movie[] }> {
    return this.request<{ movies: Movie[] }>('/api/v1/movies/featured');
  }

  // Categories and Languages
  async getCategories(): Promise<any[]> {
    const result = await this.request<{ categories: any[] }>('/api/v1/categories');
    return result.categories || [];
  }

  async getLanguages(): Promise<any[]> {
    const result = await this.request<{ languages: string[] }>('/api/v1/languages');
    return result.languages || [];
  }
}

export const apiService = new ApiService();
