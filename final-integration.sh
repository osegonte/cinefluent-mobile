#!/bin/bash
# final-integration.sh - Connect to your WORKING backend!

echo "🎉 CineFluent Backend Integration - BACKEND IS LIVE!"
echo "=================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Your working backend URL
WORKING_URL="https://cinefluent-api-production.up.railway.app"

echo -e "${GREEN}✅ Backend Status: LIVE AND OPERATIONAL${NC}"
echo -e "${GREEN}✅ URL: $WORKING_URL${NC}"
echo -e "${GREEN}✅ Documentation: $WORKING_URL/docs${NC}"
echo ""

echo -e "${CYAN}🧪 Step 1: Testing Your Live Backend${NC}"
echo "===================================="

echo "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "$WORKING_URL/api/v1/health")
HEALTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$WORKING_URL/api/v1/health")

if [ "$HEALTH_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Health check successful!${NC}"
    echo "Response: $HEALTH_RESPONSE"
else
    echo -e "${RED}❌ Health check failed (HTTP $HEALTH_CODE)${NC}"
    exit 1
fi

echo -e "\nTesting authentication..."
LOGIN_RESPONSE=$(curl -s -X POST "$WORKING_URL/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"testpass"}')
LOGIN_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$WORKING_URL/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"testpass"}')

echo "Login endpoint HTTP code: $LOGIN_CODE"
echo "Login response: $LOGIN_RESPONSE"

echo -e "\nTesting movies endpoint..."
MOVIES_RESPONSE=$(curl -s "$WORKING_URL/api/v1/movies")
MOVIES_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$WORKING_URL/api/v1/movies")

echo "Movies endpoint HTTP code: $MOVIES_CODE"
echo "Movies response: $MOVIES_RESPONSE"

echo -e "\n${CYAN}🔧 Step 2: Update Your Frontend Configuration${NC}"
echo "=============================================="

# Update .env file
ENV_FILE="cinefluent-mobile/.env"
echo "Updating $ENV_FILE..."

cat > "$ENV_FILE" << EOF
VITE_API_BASE_URL=$WORKING_URL
VITE_APP_NAME=CineFluent
VITE_APP_VERSION=0.1.0
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true
EOF

echo -e "${GREEN}✅ Updated $ENV_FILE${NC}"

# Update API service file
API_FILE="cinefluent-mobile/src/lib/api.ts"
if [ -f "$API_FILE" ]; then
    echo "Updating $API_FILE..."
    
    # Create backup
    cp "$API_FILE" "$API_FILE.backup"
    
    # Update the API_BASE constant
    sed -i.tmp "s|const API_BASE = .*|const API_BASE = '$WORKING_URL';|g" "$API_FILE"
    rm "$API_FILE.tmp" 2>/dev/null || true
    
    echo -e "${GREEN}✅ Updated $API_FILE${NC}"
    echo "   (Backup saved as $API_FILE.backup)"
else
    echo -e "${YELLOW}⚠️ $API_FILE not found - you may need to update it manually${NC}"
fi

echo -e "\n${CYAN}🚀 Step 3: Start Your Frontend${NC}"
echo "==============================="

cd cinefluent-mobile || {
    echo -e "${RED}❌ cinefluent-mobile directory not found${NC}"
    exit 1
}

echo "Installing dependencies..."
npm install --silent

echo -e "${GREEN}✅ Starting your frontend with the working backend!${NC}"
echo ""
echo "🎯 Your backend endpoints:"
echo "  • Health: $WORKING_URL/api/v1/health"
echo "  • Auth: $WORKING_URL/api/v1/auth/login"
echo "  • Movies: $WORKING_URL/api/v1/movies"
echo "  • Docs: $WORKING_URL/docs"
echo ""
echo "🔑 Test with any email/password for now"
echo "📱 Frontend will be available at: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev