#!/bin/bash
# quick-deploy-fix.sh - Fixed deployment for CineFluent

echo "🔧 Quick Deploy Fix for CineFluent"
echo "================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_NAME="cinefluent-mobile"

echo -e "${YELLOW}🚀 Deploying to Vercel with --yes flag...${NC}"

# Try the deployment with the correct flags
if vercel list 2>/dev/null | grep -q "$PROJECT_NAME"; then
    echo "Project exists, updating..."
    vercel --prod --yes
else
    echo "Creating new project..."
    vercel --prod --name="$PROJECT_NAME" --yes
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    
    # Get the deployment URL
    echo -e "${YELLOW}📋 Getting deployment info...${NC}"
    VERCEL_URL=$(vercel ls $PROJECT_NAME 2>/dev/null | grep -E "cinefluent.*\.vercel\.app" | awk '{print $2}' | head -1)
    
    if [ ! -z "$VERCEL_URL" ]; then
        echo -e "${GREEN}🌐 Your app is live at: https://$VERCEL_URL${NC}"
    fi
    
    echo -e "\n${BLUE}🔧 Next Steps:${NC}"
    echo "1. Update your Railway backend CORS to include:"
    echo "   https://$VERCEL_URL"
    echo "   https://*.vercel.app"
    echo ""
    echo "2. Test your app:"
    echo "   - Visit: https://$VERCEL_URL"
    echo "   - Login: enabled@example.com / TestPass123!"
    echo ""
    echo "3. Check browser console for any CORS errors"
    
else
    echo -e "${RED}❌ Deployment failed${NC}"
    echo "Try running: vercel --prod --yes"
fi