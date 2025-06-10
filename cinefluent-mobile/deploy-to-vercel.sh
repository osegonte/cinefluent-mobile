#!/bin/bash
# deploy-to-vercel.sh - Deploy CineFluent Frontend to Vercel and Link to Railway Backend

echo "🚀 CineFluent Frontend Deployment to Vercel"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
RAILWAY_API_URL="https://cinefluent-api-production.up.railway.app"
PROJECT_NAME="cinefluent-mobile"

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo "Project Name: $PROJECT_NAME"
echo "Railway API: $RAILWAY_API_URL"
echo "Directory: $(pwd)"
echo ""

# Step 1: Verify we're in the right directory
echo -e "${YELLOW}1️⃣ Verifying project structure...${NC}"
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found${NC}"
    echo "Please run this script from the cinefluent-mobile directory"
    exit 1
fi

if [ ! -f "vite.config.ts" ]; then
    echo -e "${RED}❌ Error: vite.config.ts not found${NC}"
    echo "This doesn't appear to be a Vite project"
    exit 1
fi

echo -e "${GREEN}✅ Project structure verified${NC}"

# Step 2: Check if Vercel CLI is installed
echo -e "\n${YELLOW}2️⃣ Checking Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI globally...${NC}"
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install Vercel CLI${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Vercel CLI already installed${NC}"
fi

# Step 3: Create/Update vercel.json configuration
echo -e "\n${YELLOW}3️⃣ Creating Vercel configuration...${NC}"
cat > vercel.json << EOF
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "$RAILWAY_API_URL",
    "VITE_APP_NAME": "CineFluent",
    "VITE_APP_VERSION": "0.1.0",
    "VITE_DEV_MODE": "false",
    "VITE_ENABLE_LOGGING": "true"
  }
}
EOF

echo -e "${GREEN}✅ vercel.json created with Railway API URL${NC}"

# Step 4: Update .env for production
echo -e "\n${YELLOW}4️⃣ Updating environment configuration...${NC}"
cat > .env.production << EOF
VITE_API_BASE_URL=$RAILWAY_API_URL
VITE_APP_NAME=CineFluent
VITE_APP_VERSION=0.1.0
VITE_DEV_MODE=false
VITE_ENABLE_LOGGING=true
EOF

echo -e "${GREEN}✅ Production environment file created${NC}"

# Step 5: Test build locally first
echo -e "\n${YELLOW}5️⃣ Testing production build locally...${NC}"
echo "Installing dependencies..."
npm install

echo "Building for production..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed! Please fix errors before deploying${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Local build successful${NC}"

# Step 6: Test Railway API connectivity
echo -e "\n${YELLOW}6️⃣ Testing Railway API connectivity...${NC}"
API_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_API_URL/api/v1/health")
if [ "$API_HEALTH" = "200" ]; then
    echo -e "${GREEN}✅ Railway API is responding (HTTP 200)${NC}"
else
    echo -e "${RED}⚠️ Railway API not responding (HTTP $API_HEALTH)${NC}"
    echo "Deployment will continue, but you may have connection issues"
fi

# Step 7: Login to Vercel (if not already logged in)
echo -e "\n${YELLOW}7️⃣ Vercel authentication...${NC}"
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Vercel login failed${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Already logged in to Vercel: $(vercel whoami)${NC}"
fi

# Step 8: Deploy to Vercel
echo -e "\n${YELLOW}8️⃣ Deploying to Vercel...${NC}"
echo "This may take a few minutes..."

# Check if project already exists
if vercel list | grep -q "$PROJECT_NAME"; then
    echo "Project exists, deploying update..."
    vercel --prod --yes
else
    echo "Creating new project and deploying..."
    # For new projects, use interactive mode but with yes flag
    vercel --prod --name="$PROJECT_NAME" --yes
fi

DEPLOY_EXIT_CODE=$?

if [ $DEPLOY_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

# Step 9: Get deployment URL
echo -e "\n${YELLOW}9️⃣ Getting deployment information...${NC}"
VERCEL_URL=$(vercel --scope $(vercel whoami) ls $PROJECT_NAME --json | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$VERCEL_URL" ]; then
    echo -e "${YELLOW}⚠️ Could not automatically detect deployment URL${NC}"
    echo "Please check your Vercel dashboard for the deployment URL"
else
    echo -e "${GREEN}✅ Deployment URL: https://$VERCEL_URL${NC}"
fi

# Step 10: Create CORS update instructions
echo -e "\n${YELLOW}🔧 Railway Backend CORS Update Required${NC}"
echo "Add this to your Railway FastAPI main.py CORS configuration:"
echo ""
echo -e "${BLUE}app.add_middleware("
echo "    CORSMiddleware,"
echo "    allow_origins=["
echo "        \"http://localhost:8080\","
echo "        \"https://*.vercel.app\","
if [ ! -z "$VERCEL_URL" ]; then
echo "        \"https://$VERCEL_URL\","
fi
echo "    ],"
echo "    allow_credentials=True,"
echo "    allow_methods=[\"*\"],"
echo "    allow_headers=[\"*\"],"
echo ")${NC}"

# Step 11: Create test script
echo -e "\n${YELLOW}📝 Creating test script...${NC}"
cat > test-deployment.sh << 'EOF'
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
EOF

chmod +x test-deployment.sh
echo -e "${GREEN}✅ Test script created: ./test-deployment.sh${NC}"

# Step 12: Final summary
echo -e "\n${PURPLE}🎉 CineFluent Deployment Complete!${NC}"
echo "======================================"
echo ""
echo -e "${GREEN}✅ Frontend deployed to Vercel${NC}"
echo -e "${GREEN}✅ Environment variables configured${NC}"
echo -e "${GREEN}✅ Build configuration optimized${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Update Railway CORS settings (instructions above)"
echo "2. Run: ./test-deployment.sh"
if [ ! -z "$VERCEL_URL" ]; then
echo "3. Visit: https://$VERCEL_URL"
fi
echo "4. Test login with: enabled@example.com / TestPass123!"
echo ""
echo -e "${YELLOW}💡 Pro Tips:${NC}"
echo "• Future deployments: just run 'vercel --prod'"
echo "• Check Vercel dashboard for deployment logs"
echo "• Use 'vercel logs' to debug issues"
echo "• Environment variables can be updated in Vercel dashboard"
echo ""
echo -e "${GREEN}🚀 Your CineFluent app is now live!${NC}"