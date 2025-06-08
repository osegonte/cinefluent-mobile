// src/pages/Auth/LoginPage.tsx - FIXED VERSION
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, LogIn, Copy } from 'lucide-react';

export default function LoginPage() {
  // Pre-fill with the WORKING test credentials from your backend
  const [email, setEmail] = useState('enabled@example.com');
  const [password, setPassword] = useState('TestPass123!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('🔐 Attempting login with:', { email, password: password.substring(0, 4) + '...' });

    try {
      await login(email, password);
      console.log('✅ Login successful, redirecting...');
      navigate('/learn');
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const copyCredentials = () => {
    setEmail('enabled@example.com');
    setPassword('TestPass123!');
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

          {/* Updated Test credentials helper */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                🧪 Test Credentials (pre-filled):
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyCredentials}
                className="text-xs h-8"
              >
                <Copy className="w-3 h-3 mr-1" />
                Use Test Account
              </Button>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-blue-600 dark:text-blue-300 font-mono">
                📧 enabled@example.com
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 font-mono">
                🔑 TestPass123!
              </p>
            </div>
            <p className="text-xs text-blue-500 dark:text-blue-400 mt-2">
              This is a working test account on your Railway backend
            </p>
          </div>

          {/* API Connection Status */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              API: {import.meta.env.VITE_API_BASE_URL || 'Railway Production'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}