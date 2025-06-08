// src/components/DebugApiTest.tsx - Add this temporarily to debug
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const API_BASE = 'https://cinefluent-api-production-5082.up.railway.app';

export function DebugApiTest() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const testEndpoint = async (name: string, endpoint: string, options?: RequestInit) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    
    try {
      console.log(`🧪 Testing ${name}: ${API_BASE}${endpoint}`);
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      console.log(`✅ ${name} Response:`, {
        status: response.status,
        statusText: response.statusText,
        data: data
      });

      setResults(prev => ({
        ...prev,
        [name]: {
          success: response.ok,
          status: response.status,
          data: data,
          error: null
        }
      }));
    } catch (error) {
      console.error(`❌ ${name} Error:`, error);
      setResults(prev => ({
        ...prev,
        [name]: {
          success: false,
          status: 0,
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const testLogin = () => {
    testEndpoint('Login', '/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'enabled@example.com',
        password: 'TestPass123!'
      })
    });
  };

  const tests = [
    { name: 'Health', endpoint: '/api/v1/health', method: 'GET' },
    { name: 'Movies', endpoint: '/api/v1/movies', method: 'GET' },
    { name: 'Categories', endpoint: '/api/v1/categories', method: 'GET' },
    { name: 'Languages', endpoint: '/api/v1/languages', method: 'GET' },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 API Debug Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          Backend: <code>{API_BASE}</code>
        </div>
        
        {/* Basic endpoint tests */}
        <div className="grid grid-cols-2 gap-2">
          {tests.map((test) => (
            <Button
              key={test.name}
              variant="outline"
              onClick={() => testEndpoint(test.name, test.endpoint)}
              disabled={loading[test.name]}
              className="flex items-center gap-2"
            >
              {loading[test.name] ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : results[test.name] ? (
                results[test.name].success ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )
              ) : null}
              Test {test.name}
            </Button>
          ))}
        </div>

        {/* Login test */}
        <Button
          onClick={testLogin}
          disabled={loading.Login}
          className="w-full flex items-center gap-2"
        >
          {loading.Login ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : results.Login ? (
            results.Login.success ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )
          ) : null}
          Test Login (enabled@example.com)
        </Button>

        {/* Results display */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {Object.entries(results).map(([name, result]) => (
            <div key={name} className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={result.success ? "default" : "destructive"}>
                  {name}
                </Badge>
                <span className="text-sm font-mono">
                  {result.status || 'No response'}
                </span>
              </div>
              
              {result.error && (
                <div className="text-sm text-red-600 mb-2">
                  Error: {result.error}
                </div>
              )}
              
              {result.data && (
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}