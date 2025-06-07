#!/bin/bash

# implement-auth.sh
# Script to implement authentication system for CineFluent

echo "🔐 Implementing Stage 9: Authentication System..."

# Check if we're in the right directory
if [[ ! -f "src/App.tsx" ]]; then
    echo "❌ Error: Not in the correct directory. Please run from cinefluent-mobile/cinefluent-mobile/"
    exit 1
fi

# Create directories
echo "📁 Creating directory structure..."
mkdir -p src/contexts
mkdir -p src/pages/Auth
mkdir -p src/components

# Create Auth Context
echo "📝 Creating AuthContext..."
cat > src/contexts/AuthContext.tsx << 'EOF'
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'premium' | 'pro';
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isPremium: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://cinefluent-api-production.up.railway.app';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.access_token);
      setUser(data.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.access_token);
      setUser(data.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isPremium: user?.subscription_tier !== 'free',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
EOF

# Create Login Page
echo "📝 Creating LoginPage..."
cat > src/pages/Auth/LoginPage.tsx << 'EOF'
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/learn');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              🎬
            </div>
            CineFluent
          </CardTitle>
          <p className="text-muted-foreground">Sign in to your account</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
EOF

# Create Register Page
echo "📝 Creating RegisterPage..."
cat > src/pages/Auth/RegisterPage.tsx << 'EOF'
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, name);
      navigate('/learn');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              🎬
            </div>
            CineFluent
          </CardTitle>
          <p className="text-muted-foreground">Create your account</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password (6+ characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
EOF

# Create Protected Route Component
echo "📝 Creating ProtectedRoute..."
cat > src/components/ProtectedRoute.tsx << 'EOF'
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
EOF

# Update App.tsx
echo "📝 Updating App.tsx..."
cat > src/App.tsx << 'EOF'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import Learn from "./pages/Learn";
import Progress from "./pages/Progress";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import LessonView from "./pages/LessonView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/learn" replace />} />
              <Route path="learn" element={<Learn />} />
              <Route path="progress" element={<Progress />} />
              <Route path="community" element={<Community />} />
              <Route path="profile" element={<Profile />} />
              <Route path="lesson/:movieId/:sceneId" element={<LessonView />} />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
EOF

# Update Profile.tsx to use real auth data
echo "📝 Updating Profile.tsx..."
# Backup original
cp src/pages/Profile.tsx src/pages/Profile.tsx.backup

# Add auth import and update the component
cat > src/pages/Profile.tsx << 'EOF'
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  Settings, 
  Crown, 
  Languages, 
  Bell, 
  Volume2,
  Download,
  Heart,
  LogOut,
  ChevronRight,
  Search,
  Shield,
  Smartphone,
  Star
} from "lucide-react";

const Profile = () => {
  const { user, logout, isPremium } = useAuth();

  if (!user) return null;

  // User data from auth context
  const userStats = {
    name: user.name,
    email: user.email,
    memberSince: new Date(user.created_at).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    }),
    totalPoints: 1876, // Will come from backend later
    streak: 23,         // Will come from backend later
    completedMovies: 3, // Will come from backend later
    wordsLearned: 347,  // Will come from backend later
    studyTime: "32h 15m", // Will come from backend later
    isPremium: isPremium
  };

  // Available languages for learning
  const languages = [
    { name: "Spanish", level: "Intermediate", progress: 65 },
    { name: "French", level: "Beginner", progress: 30 },
    { name: "German", level: "Beginner", progress: 15 }
  ];

  // App settings with premium indicators
  const settings = [
    { icon: Bell, label: "Push Notifications", enabled: true, premium: false },
    { icon: Download, label: "Offline Downloads", enabled: false, premium: true },
    { icon: Volume2, label: "Sound Effects", enabled: true, premium: false },
    { icon: Search, label: "Advanced Search", enabled: true, premium: true },
    { icon: Shield, label: "Ad-free Experience", enabled: true, premium: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your learning journey</p>
        </div>

        {/* User Profile Card */}
        <Card className="mobile-card p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{userStats.name}</h2>
              <p className="text-sm text-muted-foreground">{userStats.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Member since {userStats.memberSince}
              </p>
            </div>
            <Badge 
              variant={userStats.isPremium ? "default" : "secondary"} 
              className="flex items-center gap-1"
            >
              <Crown className="w-3 h-3" />
              {userStats.isPremium ? "Premium" : "Free"}
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground tabular-nums">{userStats.totalPoints}</div>
              <div className="text-xs text-muted-foreground">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground tabular-nums">{userStats.streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </Card>

        {/* Premium Upgrade Section (if not premium) */}
        {!userStats.isPremium && (
          <Card className="mobile-card p-4 mb-6 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Upgrade to Premium</h3>
                <p className="text-sm text-muted-foreground">Unlock advanced features</p>
              </div>
            </div>
            <Button className="w-full btn-mobile">
              Upgrade Now
            </Button>
          </Card>
        )}

        {/* Learning Statistics */}
        <Card className="mobile-card p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-4">Learning Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Movies Completed</span>
              <span className="font-semibold text-foreground tabular-nums">{userStats.completedMovies}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Words Learned</span>
              <span className="font-semibold text-foreground tabular-nums">{userStats.wordsLearned}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Study Time</span>
              <span className="font-semibold text-foreground tabular-nums">{userStats.studyTime}</span>
            </div>
          </div>
        </Card>

        {/* Language Learning Section */}
        <Card className="mobile-card p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Your Languages
          </h3>
          <div className="space-y-3">
            {languages.map((language, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">{language.name}</div>
                  <div className="text-sm text-muted-foreground">{language.level}</div>
                </div>
                <Badge variant="outline" className="tabular-nums">{language.progress}%</Badge>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 btn-mobile">
            Add New Language
          </Button>
        </Card>

        {/* App Settings */}
        <Card className="mobile-card p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            App Settings
          </h3>
          <div className="space-y-4">
            {settings.map((setting, index) => {
              const Icon = setting.icon;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <span className="text-foreground">{setting.label}</span>
                      {setting.premium && (
                        <Crown className="w-3 h-3 text-primary inline ml-2" />
                      )}
                    </div>
                  </div>
                  <Switch 
                    defaultChecked={setting.enabled} 
                    disabled={setting.premium && !userStats.isPremium}
                  />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Account Management Actions */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-between btn-mobile focus-ring">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Rate CineFluent
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button variant="outline" className="w-full justify-between btn-mobile focus-ring">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Account Settings
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button variant="outline" className="w-full justify-between btn-mobile focus-ring">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              App Preferences
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Sign Out Button */}
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive btn-mobile"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
EOF

echo "✅ Stage 9: Authentication system implemented!"
echo ""
echo "🎯 Next steps:"
echo "1. Start your development server: npm run dev"
echo "2. Visit http://localhost:8081/ (should redirect to login)"
echo "3. Test user registration with the sign-up form"
echo "4. Test login with your new credentials"
echo "5. Test logout from the Profile page"
echo ""
echo "🔐 Your app now has complete authentication!"
echo ""
echo "Features added:"
echo "✅ User registration & login forms"
echo "✅ JWT token management"
echo "✅ Protected routes (redirects to login)"
echo "✅ Real user data in Profile page"
echo "✅ Logout functionality"
echo "✅ Premium status display"
echo ""
echo "Note: Auth endpoints need to be implemented in your Railway backend"
echo "For now, you can test the UI flow - the backend integration comes next!"