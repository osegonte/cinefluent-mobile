#!/bin/bash
# test-integration.sh - Complete integration testing script

echo "🚀 CineFluent Frontend-Backend Integration Test"
echo "=============================================="

API_BASE="https://cinefluent-api-production-5082.up.railway.app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}API Base: $API_BASE${NC}"

# Test 1: Health Check
echo -e "\n${YELLOW}1️⃣ Testing Health Endpoint${NC}"
HEALTH_RESPONSE=$(curl -s "$API_BASE/api/v1/health")
HEALTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/api/v1/health")

if [ "$HEALTH_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "Response: $HEALTH_RESPONSE"
else
    echo -e "${RED}❌ Health check failed (HTTP $HEALTH_CODE)${NC}"
    echo "This is critical - backend may be down"
    exit 1
fi

# Test 2: Login with your test credentials
echo -e "\n${YELLOW}2️⃣ Testing Authentication${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"enabled@example.com","password":"TestPass123!"}')

echo "Login response: $LOGIN_RESPONSE"

if echo "$LOGIN_RESPONSE" | grep -q "access_token"; then
    echo -e "${GREEN}✅ Login successful${NC}"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    echo "Token: ${TOKEN:0:30}..."
    
    # Extract user info
    USER_EMAIL=$(echo "$LOGIN_RESPONSE" | grep -o '"email":"[^"]*"' | cut -d'"' -f4)
    echo "User: $USER_EMAIL"
else
    echo -e "${RED}❌ Login failed${NC}"
    echo "This will prevent frontend authentication"
    # Continue testing other endpoints
fi

# Test 3: Protected Route (if we have a token)
if [ ! -z "$TOKEN" ]; then
    echo -e "\n${YELLOW}3️⃣ Testing Protected Route (/auth/me)${NC}"
    PROFILE_RESPONSE=$(curl -s "$API_BASE/api/v1/auth/me" \
        -H "Authorization: Bearer $TOKEN")
    PROFILE_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/api/v1/auth/me" \
        -H "Authorization: Bearer $TOKEN")

    if [ "$PROFILE_CODE" = "200" ]; then
        echo -e "${GREEN}✅ Protected route works${NC}"
        echo "Profile response: $PROFILE_RESPONSE"
    else
        echo -e "${RED}❌ Protected route failed (HTTP $PROFILE_CODE)${NC}"
    fi
fi

# Test 4: Movies Endpoint
echo -e "\n${YELLOW}4️⃣ Testing Movies Endpoint${NC}"
MOVIES_RESPONSE=$(curl -s "$API_BASE/api/v1/movies")
MOVIES_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/api/v1/movies")

if [ "$MOVIES_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Movies endpoint accessible${NC}"
    echo "Movies response: $MOVIES_RESPONSE"
    
    # Check if it has movies
    if echo "$MOVIES_RESPONSE" | grep -q '"movies"'; then
        MOVIE_COUNT=$(echo "$MOVIES_RESPONSE" | grep -o '"movies":\[' | wc -l)
        echo "Movies structure found"
    else
        echo -e "${YELLOW}⚠️ Movies endpoint works but may have different structure${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ Movies endpoint returned HTTP $MOVIES_CODE${NC}"
    echo "Response: $MOVIES_RESPONSE"
fi

# Test 5: Categories (optional)
echo -e "\n${YELLOW}5️⃣ Testing Categories Endpoint${NC}"
CATEGORIES_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/api/v1/categories")
if [ "$CATEGORIES_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Categories endpoint working${NC}"
else
    echo -e "${YELLOW}⚠️ Categories endpoint not ready (HTTP $CATEGORIES_CODE)${NC}"
fi

# Test 6: CORS Check
echo -e "\n${YELLOW}6️⃣ Testing CORS Configuration${NC}"
CORS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "$API_BASE/api/v1/health" \
    -H "Origin: http://localhost:8080" \
    -H "Access-Control-Request-Method: GET")

if [ "$CORS_CODE" = "200" ] || [ "$CORS_CODE" = "204" ]; then
    echo -e "${GREEN}✅ CORS configured correctly${NC}"
else
    echo -e "${RED}❌ CORS configuration issue (HTTP $CORS_CODE)${NC}"
    echo "Frontend may have connection issues"
fi

# Summary
echo -e "\n${BLUE}📋 Integration Test Summary${NC}"
echo "================================"
echo -e "Health Check: $([ "$HEALTH_CODE" = "200" ] && echo "${GREEN}✅ Pass${NC}" || echo "${RED}❌ Fail${NC}")"
echo -e "Authentication: $([ ! -z "$TOKEN" ] && echo "${GREEN}✅ Pass${NC}" || echo "${RED}❌ Fail${NC}")"
echo -e "Movies API: $([ "$MOVIES_CODE" = "200" ] && echo "${GREEN}✅ Pass${NC}" || echo "${YELLOW}⚠️ Partial${NC}")"
echo -e "CORS: $([ "$CORS_CODE" = "200" ] || [ "$CORS_CODE" = "204" ] && echo "${GREEN}✅ Pass${NC}" || echo "${RED}❌ Fail${NC}")"

echo -e "\n${GREEN}🎉 Integration test complete!${NC}"
echo -e "\n${YELLOW}Next Steps:${NC}"
echo "1. cd cinefluent-mobile"
echo "2. npm run dev"
echo "3. Open http://localhost:8080"
echo "4. Login with: enabled@example.com / TestPass123!"

# Create quick start commands
echo -e "\n${BLUE}Quick Commands:${NC}"
echo "# Start frontend:"
echo "cd cinefluent-mobile && npm run dev"
echo ""
echo "# Test API manually:"
echo "curl $API_BASE/api/v1/health"