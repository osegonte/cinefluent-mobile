#!/bin/bash
# start-frontend.sh - Frontend startup with environment check

echo "🎬 Starting CineFluent Frontend"
echo "=============================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Please run this script from the cinefluent-mobile directory${NC}"
    echo "Current directory: $(pwd)"
    echo "Expected files: package.json, src/, etc."
    exit 1
fi

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js version: $NODE_VERSION${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ npm install failed${NC}"
        exit 1
    fi
fi

# Verify/create environment variables
echo -e "${YELLOW}⚙️ Checking environment configuration...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOF
VITE_API_BASE_URL=https://cinefluent-api-production-5082.up.railway.app
VITE_APP_NAME=CineFluent
VITE_APP_VERSION=0.1.0
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true
EOF
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

# Show environment info
echo -e "\n${BLUE}🔧 Environment Configuration:${NC}"
echo "Frontend URL: http://localhost:8080"
echo "Backend API: https://cinefluent-api-production-5082.up.railway.app"
echo "Mode: Development"

# Test API connectivity before starting
echo -e "\n${YELLOW}🔌 Testing backend connectivity...${NC}"
API_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "https://cinefluent-api-production-5082.up.railway.app/api/v1/health")
if [ "$API_HEALTH" = "200" ]; then
    echo -e "${GREEN}✅ Backend is responding${NC}"
else
    echo -e "${RED}⚠️ Backend not responding (HTTP $API_HEALTH)${NC}"
    echo "Frontend will still start, but API calls may fail"
fi

# Display test credentials
echo -e "\n${BLUE}🔑 Test Credentials:${NC}"
echo "📧 Email: enabled@example.com"
echo "🔐 Password: TestPass123!"

echo -e "\n${BLUE}🚀 Starting development server...${NC}"
echo "================================"
echo ""
echo "After the server starts:"
echo "1. Open http://localhost:8080 in your browser"
echo "2. Use the test credentials above to login"
echo "3. Navigate through Learn, Progress, Community, Profile"
echo "4. Check browser console for any API errors"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev