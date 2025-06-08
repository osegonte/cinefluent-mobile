// src/components/TestLogin.tsx - Simple test component to debug login
import React, { useState } from 'react';

const TestLogin = () => {
  const [email, setEmail] = useState('enabled@example.com');
  const [password, setPassword] = useState('TestPass123!');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult('Testing...');
    
    const API_BASE = 'https://cinefluent-api-production-5082.up.railway.app';
    
    try {
      console.log('🧪 Testing direct API call...');
      
      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('Success data:', data);
        
        setResult(`✅ SUCCESS!
User: ${data.user?.email}
Profile: ${data.profile?.username}
Token: ${data.access_token ? 'Received' : 'Missing'}
Token length: ${data.access_token?.length || 0}`);
        
        // Store token for testing
        if (data.access_token) {
          localStorage.setItem('auth_token', data.access_token);
        }
        
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setResult(`❌ ERROR ${response.status}: ${errorText}`);
      }
      
    } catch (error) {
      console.error('Network error:', error);
      setResult(`❌ NETWORK ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testProtectedRoute = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setResult('❌ No token found. Login first.');
      return;
    }

    setLoading(true);
    const API_BASE = 'https://cinefluent-api-production-5082.up.railway.app';
    
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResult(`✅ PROTECTED ROUTE SUCCESS!
User: ${data.user?.email}
Profile: ${data.profile?.full_name}`);
      } else {
        const errorText = await response.text();
        setResult(`❌ PROTECTED ROUTE ERROR ${response.status}: ${errorText}`);
      }
      
    } catch (error) {
      setResult(`❌ PROTECTED ROUTE NETWORK ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace', 
      maxWidth: '600px', 
      margin: '20px auto',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>🧪 Login Test Component</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Email:</label><br />
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Password:</label><br />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testLogin} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Login'}
        </button>
        
        <button 
          onClick={testProtectedRoute} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Test Protected Route
        </button>
      </div>
      
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#fff', 
        border: '1px solid #ddd',
        borderRadius: '4px',
        minHeight: '100px',
        whiteSpace: 'pre-wrap',
        fontSize: '12px'
      }}>
        <strong>Result:</strong><br />
        {result || 'Click "Test Login" to start...'}
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <strong>Instructions:</strong><br />
        1. Click "Test Login" to test direct API call<br />
        2. If login works, click "Test Protected Route"<br />
        3. Check browser console for detailed logs<br />
        4. Share the results with me if there are any issues
      </div>
    </div>
  );
};

export default TestLogin;