#!/bin/bash
# restore-comprehensive.sh - Fix and deploy comprehensive CineFluent frontend

echo "🔧 Restoring Comprehensive CineFluent Frontend"
echo "============================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Step 1: Backup current App.tsx
echo -e "${YELLOW}1️⃣ Backing up current App.tsx...${NC}"
if [ -f "src/App.tsx" ]; then
    cp src/App.tsx src/App.tsx.backup
    echo -e "${GREEN}✅ Backup created: src/App.tsx.backup${NC}"
else
    echo -e "${RED}❌ src/App.tsx not found${NC}"
    exit 1
fi

# Step 2: Install missing dependencies
echo -e "\n${YELLOW}2️⃣ Installing missing dependencies...${NC}"
echo "Installing @tanstack/react-query for state management..."
npm install @tanstack/react-query

echo "Installing sonner for toast notifications..."
npm install sonner

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 3: Create the comprehensive App.tsx
echo -e "\n${YELLOW}3️⃣ Creating comprehensive App.tsx...${NC}"

cat > src/App.tsx << 'EOF'
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
EOF

echo -e "${GREEN}✅ Comprehensive App.tsx created${NC}"

# Step 4: Verify all required files exist
echo -e "\n${YELLOW}4️⃣ Verifying required components...${NC}"

REQUIRED_FILES=(
    "src/contexts/AuthContext.tsx"
    "src/components/ThemeProvider.tsx"
    "src/components/NavigationTabs.tsx"
    "src/pages/Learn.tsx"
    "src/pages/Progress.tsx"
    "src/pages/Community.tsx"
    "src/pages/Profile.tsx"
    "src/pages/Auth/LoginPage.tsx"
    "src/pages/Auth/RegisterPage.tsx"
)

MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file${NC}"
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo -e "\n${YELLOW}⚠️ Some files are missing. Creating minimal versions...${NC}"
    
    # Create missing auth pages if needed
    if [ ! -f "src/pages/Auth/LoginPage.tsx" ]; then
        mkdir -p src/pages/Auth
        echo "// Simple redirect to existing login" > src/pages/Auth/LoginPage.tsx
        echo "export { default } from '../Login';" >> src/pages/Auth/LoginPage.tsx
    fi
    
    if [ ! -f "src/pages/Auth/RegisterPage.tsx" ]; then
        mkdir -p src/pages/Auth
        echo "// Simple register placeholder" > src/pages/Auth/RegisterPage.tsx
        echo "export { default } from '../Login';" >> src/pages/Auth/RegisterPage.tsx
    fi
fi

# Step 5: Clear cache and test build
echo -e "\n${YELLOW}5️⃣ Clearing cache and testing build...${NC}"
rm -rf dist node_modules/.vite

echo "Installing all dependencies..."
npm install

echo "Testing TypeScript compilation..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ TypeScript compilation successful${NC}"
else
    echo -e "${RED}❌ TypeScript errors found${NC}"
    echo "Fix TypeScript errors before proceeding"
fi

echo "Building for production..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    echo "Check the errors above and fix before deploying"
    exit 1
fi

# Step 6: Test locally first
echo -e "\n${YELLOW}6️⃣ Testing locally...${NC}"
echo "Starting preview server..."
echo -e "${BLUE}🌐 Visit: http://localhost:4173${NC}"
echo -e "${BLUE}🔑 Test login: enabled@example.com / TestPass123!${NC}"
echo ""
echo "Test all tabs: Learn, Progress, Community, Profile"
echo "Press Ctrl+C when done testing"

npm run preview &
PREVIEW_PID=$!

echo ""
echo -e "${YELLOW}When ready to deploy to Vercel:${NC}"
echo "1. Stop the preview server (Ctrl+C)"
echo "2. Run: vercel --prod --yes"
echo "3. Test the live deployment"

# Wait for user to stop preview
wait $PREVIEW_PID

echo -e "\n${GREEN}🎯 Comprehensive frontend restored!${NC}"
echo ""
echo -e "${BLUE}📋 What you now have:${NC}"
echo "✅ Learn page with movie browsing"
echo "✅ Progress page with statistics"
echo "✅ Community page with social features"
echo "✅ Profile page with user management"
echo "✅ Bottom navigation tabs"
echo "✅ Proper routing between pages"
echo ""
echo "To deploy: vercel --prod --yes"