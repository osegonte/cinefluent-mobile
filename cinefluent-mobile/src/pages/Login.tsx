import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Mail, Lock, Clapperboard, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cinefluent-api-production.up.railway.app';

export default function Login() {
  const [email, setEmail] = useState('enabled@example.com');
  const [password, setPassword] = useState('TestPass123!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('🔐 Attempting login...');
      
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        setSuccess(true);
        localStorage.setItem('auth_token', data.access_token || 'test-token');
        
        // Smooth transition to learn page
        setTimeout(() => {
          navigate('/learn');
        }, 1000);
      } else {
        setError(data.detail || data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestAccount = () => {
    setEmail('enabled@example.com');
    setPassword('TestPass123!');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full shadow-lg">
              <Clapperboard className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CineFluent
          </h1>
          <p className="text-gray-600 mt-2">Learn languages through movies</p>
        </div>

        {/* Main Login Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-semibold text-gray-800">Welcome back</CardTitle>
            <CardDescription>Sign in to continue your language learning journey</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Success Message */}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700 font-medium">
                  Login successful! Redirecting to your movies...
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Sign In Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 shadow-lg transition-all duration-200"
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Success!
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Test Account</span>
              </div>
            </div>

            {/* Test Account Card */}
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-800">Test Credentials</p>
                    <div className="text-xs text-green-700 mt-1 space-y-0.5">
                      <div>Email: enabled@example.com</div>
                      <div>Password: TestPass123!</div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 h-7 text-xs border-green-200 text-green-700 hover:bg-green-100"
                      onClick={handleTestAccount}
                      disabled={loading}
                    >
                      Use Test Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link 
                to="/register" 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign up for free
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-3">
            <div className="text-xs space-y-1">
              <div className="font-medium text-blue-800">🐛 Debug Information</div>
              <div className="text-blue-700">API: {API_BASE_URL}</div>
              <div className="text-blue-700">Environment: {import.meta.env.MODE}</div>
              <div className="text-blue-700">Status: Ready for testing</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}