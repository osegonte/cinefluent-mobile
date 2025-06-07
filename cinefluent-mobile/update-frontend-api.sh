#!/bin/bash

# update-frontend-api.sh
# Script to update CineFluent frontend to use Railway API

echo "🔧 Updating CineFluent frontend to use Railway API..."

# Check if we're in the right directory
if [[ ! -f "src/App.tsx" ]]; then
    echo "❌ Error: Not in the correct directory. Please run from cinefluent-mobile/cinefluent-mobile/"
    exit 1
fi

# Create environment file
echo "📝 Creating environment configuration..."
cat > .env.local << 'EOF'
# Railway API Configuration
VITE_API_BASE_URL=https://cinefluent-api-production.up.railway.app
VITE_API_VERSION=v1

# Supabase Configuration
VITE_SUPABASE_URL=https://astrltlngrrjziuwthgk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdHJsdGxuZ3JyanppdXd0aGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjc3NjYsImV4cCI6MjA2NDg0Mzc2Nn0.eT1c0uzibT2NsHK3i_2iI8TMMRvotU85mIK0z_H8fXE

# App Configuration
VITE_APP_NAME=CineFluent
VITE_APP_VERSION=0.1.0
VITE_ENVIRONMENT=development
EOF

# Update .gitignore to exclude environment files
echo "📝 Updating .gitignore..."
if ! grep -q ".env" .gitignore; then
    echo "" >> .gitignore
    echo "# Environment variables" >> .gitignore
    echo ".env" >> .gitignore
    echo ".env.local" >> .gitignore
    echo ".env.production" >> .gitignore
    echo ".env.development" >> .gitignore
fi

# Update the API configuration in useApi.ts
echo "📝 Updating useApi.ts for Railway deployment..."
cat > src/hooks/useApi.ts << 'EOF'
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
EOF

# Update ConnectionTest component to show Railway status
echo "📝 Updating ConnectionTest component..."
cat > src/components/ConnectionTest.tsx << 'EOF'
// src/components/ConnectionTest.tsx - Updated for Railway
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Wifi, WifiOff, Cloud } from 'lucide-react';
import { useHealthCheck, useConnectionStatus } from '@/hooks/useApi';

export function ConnectionTest() {
  const { data: healthData, isLoading, isError, refetch } = useHealthCheck();
  const { isOnline, apiStatus, isConnected } = useConnectionStatus();

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (isConnected) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-500">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">Disconnected</Badge>;
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          API Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Internet:</span>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">API Status:</span>
          {getStatusBadge(apiStatus)}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Backend:</span>
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">Railway (Production)</span>
          </div>
        </div>

        {healthData && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              ✅ {healthData.service}
            </p>
            <p className="text-xs text-green-600 dark:text-green-300">
              Status: {healthData.status}
            </p>
            {healthData.database && (
              <p className="text-xs text-green-600 dark:text-green-300">
                Database: {healthData.database}
              </p>
            )}
          </div>
        )}

        {isError && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              ❌ Connection Failed
            </p>
            <p className="text-xs text-red-600 dark:text-red-300">
              Unable to connect to Railway API. Check your internet connection.
            </p>
          </div>
        )}

        <Button 
          onClick={() => refetch()} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Railway Connection'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
EOF

echo "✅ Frontend API integration complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start your development server: npm run dev"
echo "2. Open http://localhost:8080/"
echo "3. Check the ConnectionTest component shows 'Connected'"
echo "4. Test movie loading and search functionality"
echo ""
echo "🚀 If everything works, your frontend is now connected to Railway!"
echo ""
echo "To deploy to production:"
echo "1. git add ."
echo "2. git commit -m 'Connect frontend to Railway API'"
echo "3. git push origin main"
echo "4. Vercel will automatically deploy the updated app"
EOF

chmod +x update-frontend-api.sh

echo "✅ Frontend update script created!"
echo ""
echo "🎯 **Stage 8: Frontend Integration**"
echo ""
echo "**READY TO EXECUTE:**"
echo "1. Run the script: ./update-frontend-api.sh"
echo "2. Test the connection: npm run dev"
echo "3. Verify Railway API integration works"
echo ""
echo "**Your backend is deployed and working!** 🚀"
echo "https://cinefluent-api-production.up.railway.app"
echo ""
echo "**Current Status:**"
echo "✅ Backend: Railway deployment working"
echo "🔄 Frontend: Ready to connect to Railway API" 
echo ""
echo "This will switch your React app from localhost:8000 to the live Railway API!"