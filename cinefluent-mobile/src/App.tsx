// src/App.tsx - Complete CineFluent App with Bottom Navigation
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';
import { NavigationTabs } from './components/NavigationTabs';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Main App Pages
import Learn from './pages/Learn';
import Progress from './pages/Progress';
import Community from './pages/Community';
import Profile from './pages/Profile';

// Optional Pages (commented out if not available)
// import LessonView from './pages/LessonView';

import './index.css';

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Main App Layout with Bottom Navigation
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main content area */}
      <main className="flex-1 pb-20">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <NavigationTabs />
    </div>
  );
}

// Simple auth check (you can enhance this with proper ProtectedRoute later)
function useAuth() {
  const token = localStorage.getItem('auth_token');
  return { isAuthenticated: !!token };
}

// Protected Routes Wrapper
function ProtectedApp() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Routes>
        {/* Main App Routes */}
        <Route path="/" element={<Navigate to="/learn" replace />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Catch all - redirect to learn */}
        <Route path="*" element={<Navigate to="/learn" replace />} />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="cinefluent-theme">
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected App Routes */}
                <Route path="/*" element={<ProtectedApp />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
