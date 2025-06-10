#!/bin/bash
# test-deployment.sh - Test the deployed CineFluent application

echo "🧪 Testing CineFluent Deployment"
echo "==============================="

# Get the Vercel URL
VERCEL_URL=$(vercel --scope $(vercel whoami) ls cinefluent-mobile --json | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$VERCEL_URL" ]; then
    echo "❌ Could not find deployment URL"
    exit 1
fi

echo "Testing: https://$VERCEL_URL"

# Test 1: Check if site loads
echo "1. Testing site accessibility..."
SITE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$VERCEL_URL")
if [ "$SITE_STATUS" = "200" ]; then
    echo "✅ Site loads successfully"
else
    echo "❌ Site not accessible (HTTP $SITE_STATUS)"
fi

# Test 2: Check API connectivity from frontend
echo "2. Testing API connectivity..."
RAILWAY_API_URL="https://cinefluent-api-production.up.railway.app"
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_API_URL/api/v1/health")
if [ "$API_STATUS" = "200" ]; then
    echo "✅ Railway API responding"
else
    echo "❌ Railway API not responding (HTTP $API_STATUS)"
fi

echo ""
echo "🔗 Test your deployment:"
echo "1. Visit: https://$VERCEL_URL"
echo "2. Login with: enabled@example.com / TestPass123!"
echo "3. Check browser console for errors"
echo ""
echo "🐛 If you see CORS errors, update your Railway backend CORS settings"
