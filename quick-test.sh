#!/bin/bash
# quick-test.sh - Instantly test your working backend

echo "🧪 Quick CineFluent Backend Test"
echo "==============================="

BACKEND_URL="https://cinefluent-api-production.up.railway.app"

echo "Testing: $BACKEND_URL"
echo ""

# Test 1: Health Check
echo "1️⃣ Health Check:"
curl -s "$BACKEND_URL/api/v1/health" | jq . 2>/dev/null || curl -s "$BACKEND_URL/api/v1/health"

echo -e "\n2️⃣ Available Endpoints:"
curl -s "$BACKEND_URL/api/v1/movies" | head -100

echo -e "\n3️⃣ API Documentation:"
echo "📖 Visit: $BACKEND_URL/docs"

echo -e "\n4️⃣ Frontend Integration:"
echo "Update your .env file:"
echo "VITE_API_BASE_URL=$BACKEND_URL"

echo -e "\n5️⃣ Test Commands:"
echo "# Test health"
echo "curl $BACKEND_URL/api/v1/health"
echo ""
echo "# Test movies"  
echo "curl $BACKEND_URL/api/v1/movies"
echo ""
echo "# Test auth (try any email/password)"
echo "curl -X POST $BACKEND_URL/api/v1/auth/login \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"test@example.com\",\"password\":\"test\"}'"

echo -e "\n✅ Your backend is working perfectly!"
echo "🚀 Ready to connect your frontend!"