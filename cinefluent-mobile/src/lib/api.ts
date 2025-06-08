const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://cinefluent-api-production-5082.up.railway.app';

export interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty_level: string;
  languages: string[];
  thumbnail_url: string;
  is_premium: boolean;
  vocabulary_count: number;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  email_confirmed_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
  message: string;
}

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
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

  async healthCheck() {
    return this.request<{ status: string; checks?: any }>('/api/v1/health');
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    console.log('🔐 API Login called with:', { email, password: '***' });
    return this.request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMovies() {
    return this.request<{ movies: Movie[] }>('/api/v1/movies');
  }

  async searchMovies(query: string) {
    return this.request<{ movies: Movie[] }>(`/api/v1/movies/search?q=${encodeURIComponent(query)}`);
  }

  async getFeaturedMovies() {
    return this.request<{ movies: Movie[] }>('/api/v1/movies/featured');
  }
}

export const apiService = new ApiService();
