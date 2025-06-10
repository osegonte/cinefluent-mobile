#!/bin/bash
# fix-comprehensive-frontend.sh - Restore comprehensive CineFluent frontend

echo "🔧 Restoring Comprehensive CineFluent Frontend"
echo "============================================="

# Clear build cache
echo "1. Clearing build cache..."
rm -rf dist node_modules/.vite

# Reinstall dependencies to ensure everything is fresh
echo "2. Reinstalling dependencies..."
npm install

# Test build locally
echo "3. Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    
    # Test preview locally
    echo "4. Starting preview server..."
    echo "Visit http://localhost:4173 to test locally"
    echo "Press Ctrl+C when done testing"
    npm run preview &
    PREVIEW_PID=$!
    
    echo ""
    echo "5. When ready to deploy, run:"
    echo "   vercel --prod --yes"
    
    # Wait for user input
    read -p "Press Enter when done testing locally..."
    kill $PREVIEW_PID 2>/dev/null
    
else
    echo "❌ Build failed - fix errors first"
fi
