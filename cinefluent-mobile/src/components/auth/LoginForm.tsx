// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('enabled@example.com');
  const [password, setPassword] = useState('TestPass123!');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      await login(email, password);
      console.log('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const useTestCredentials = () => {
    setEmail('enabled@example.com');
    setPassword('TestPass123!');
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">🎬 CineFluent</h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            '🔓 Sign in'
          )}
        </button>
      </form>

      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
        <h3 className="text-sm font-medium text-green-800 mb-2">
          ✅ Test Credentials (pre-filled):
        </h3>
        <p className="text-sm text-green-700">📧 enabled@example.com</p>
        <p className="text-sm text-green-700">🔑 TestPass123!</p>
        <p className="text-xs text-green-600 mt-1">
          This is a working test account on your Railway backend
        </p>
        <button
          type="button"
          onClick={useTestCredentials}
          className="mt-2 text-xs bg-green-100 hover:bg-green-200 px-2 py-1 rounded border border-green-300"
        >
          Use Test Account
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button className="text-blue-600 hover:text-blue-500">
            Sign up
          </button>
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        API: {import.meta.env.VITE_API_BASE_URL || 'Not configured'}
      </div>
    </div>
  );
};

export default LoginForm;