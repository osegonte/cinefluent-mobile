#!/bin/bash
# diagnose-frontend.sh - Diagnose and fix CineFluent frontend issues

echo "🔍 CineFluent Frontend Diagnosis"
echo "==============================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Analyzing current frontend structure...${NC}"

# Check if we have the comprehensive pages
echo -e "\n${YELLOW}1️⃣ Checking for comprehensive pages...${NC}"

REQUIRED_PAGES=(
    "src/pages/Learn.tsx"
    "src/pages/Progress.tsx"
    "src/pages/Community.tsx"
    "src/pages/Profile.tsx"
    "src/components/NavigationTabs.tsx"
    "src/components/SearchBar.tsx"
    "src/components/MobileProgressCard.tsx"
)

MISSING_PAGES=()
EXISTING_PAGES=()

for page in "${REQUIRED_PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo -e "${GREEN}✅ Found: $page${NC}"
        EXISTING_PAGES+=("$page")
    else
        echo -e "${RED}❌ Missing: $page${NC}"
        MISSING_PAGES+=("$page")
    fi
done

# Check routing configuration
echo -e "\n${YELLOW}2️⃣ Checking routing configuration...${NC}"
if [ -f "src/App.tsx" ]; then
    echo "Checking App.tsx routes..."
    if grep -q "Progress" src/App.tsx; then
        echo -e "${GREEN}✅ Progress route found${NC}"
    else
        echo -e "${RED}❌ Progress route missing${NC}"
    fi
    
    if grep -q "Community" src/App.tsx; then
        echo -e "${GREEN}✅ Community route found${NC}"
    else
        echo -e "${RED}❌ Community route missing${NC}"
    fi
    
    if grep -q "Profile" src/App.tsx; then
        echo -e "${GREEN}✅ Profile route found${NC}"
    else
        echo -e "${RED}❌ Profile route missing${NC}"
    fi
    
    if grep -q "NavigationTabs" src/App.tsx; then
        echo -e "${GREEN}✅ NavigationTabs component used${NC}"
    else
        echo -e "${RED}❌ NavigationTabs component missing${NC}"
    fi
else
    echo -e "${RED}❌ App.tsx not found${NC}"
fi

# Check current deployment URL
echo -e "\n${YELLOW}3️⃣ Checking current deployment...${NC}"
CURRENT_URL=$(vercel ls cinefluent-mobile 2>/dev/null | grep "vercel.app" | head -1 | awk '{print $2}')
if [ ! -z "$CURRENT_URL" ]; then
    echo -e "${GREEN}🌐 Current deployment: https://$CURRENT_URL${NC}"
    echo "Testing current deployment..."
    
    # Test if it loads
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$CURRENT_URL")
    if [ "$HTTP_STATUS" = "200" ]; then
        echo -e "${GREEN}✅ Site loads (HTTP 200)${NC}"
    else
        echo -e "${RED}❌ Site not loading (HTTP $HTTP_STATUS)${NC}"
    fi
else
    echo -e "${RED}❌ Could not determine deployment URL${NC}"
fi

# Check package.json for dependencies
echo -e "\n${YELLOW}4️⃣ Checking dependencies...${NC}"
if [ -f "package.json" ]; then
    echo "Key dependencies:"
    
    DEPS_TO_CHECK=(
        "react-router-dom"
        "lucide-react"
        "@radix-ui"
        "tailwindcss"
    )
    
    for dep in "${DEPS_TO_CHECK[@]}"; do
        if grep -q "\"$dep\"" package.json; then
            echo -e "${GREEN}✅ $dep installed${NC}"
        else
            echo -e "${RED}❌ $dep missing${NC}"
        fi
    done
else
    echo -e "${RED}❌ package.json not found${NC}"
fi

# Generate fix recommendations
echo -e "\n${BLUE}🔧 DIAGNOSIS COMPLETE${NC}"
echo "===================="

if [ ${#MISSING_PAGES[@]} -gt 0 ]; then
    echo -e "${RED}❌ ISSUE: Missing comprehensive pages${NC}"
    echo "Missing pages:"
    for page in "${MISSING_PAGES[@]}"; do
        echo "  - $page"
    done
    echo ""
    echo -e "${YELLOW}🎯 SOLUTION: Restore comprehensive frontend${NC}"
    echo "You need to:"
    echo "1. Restore the comprehensive pages (Learn, Progress, Community, Profile)"
    echo "2. Update App.tsx with proper routing"
    echo "3. Add NavigationTabs component for bottom navigation"
    echo "4. Redeploy to Vercel"
    echo ""
    echo -e "${BLUE}Would you like me to create the comprehensive frontend structure? (y/n)${NC}"
    
elif [ ${#EXISTING_PAGES[@]} -eq ${#REQUIRED_PAGES[@]} ]; then
    echo -e "${GREEN}✅ All pages present - checking deployment issue${NC}"
    echo ""
    echo -e "${YELLOW}🎯 POSSIBLE SOLUTIONS:${NC}"
    echo "1. Clear build cache: rm -rf dist node_modules/.vite"
    echo "2. Reinstall dependencies: npm install"
    echo "3. Test local build: npm run build && npm run preview"
    echo "4. Redeploy: vercel --prod --yes"
    
else
    echo -e "${YELLOW}⚠️ Partial frontend detected${NC}"
    echo "Some pages exist but others are missing."
    echo "This suggests a mixed state."
fi

# Check if this is the working version or simplified version
echo -e "\n${YELLOW}5️⃣ Version check...${NC}"
if [ -f "src/pages/Learn.tsx" ]; then
    # Check if Learn.tsx has comprehensive features
    if grep -q "SearchBar" src/pages/Learn.tsx && grep -q "Card" src/pages/Learn.tsx; then
        echo -e "${GREEN}✅ Comprehensive Learn page detected${NC}"
    else
        echo -e "${YELLOW}⚠️ Simplified Learn page detected${NC}"
        echo "This might be a basic version without full features"
    fi
fi

# Create quick fix script
echo -e "\n${YELLOW}📝 Creating quick fix script...${NC}"
cat > fix-comprehensive-frontend.sh << 'EOF'
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
EOF

chmod +x fix-comprehensive-frontend.sh
echo -e "${GREEN}✅ Fix script created: ./fix-comprehensive-frontend.sh${NC}"

echo -e "\n${BLUE}📋 NEXT STEPS:${NC}"
echo "1. Run: ./fix-comprehensive-frontend.sh"
echo "2. Test locally at http://localhost:4173"
echo "3. If it looks good, redeploy: vercel --prod --yes"
if [ ! -z "$CURRENT_URL" ]; then
echo "4. Test live app: https://$CURRENT_URL"
fi

echo -e "\n${GREEN}🎯 Goal: Restore your comprehensive CineFluent frontend with:${NC}"
echo "• Learn page with movie browsing"
echo "• Progress page with statistics" 
echo "• Community page with social features"
echo "• Profile page with user management"
echo "• Bottom navigation tabs"
echo "• Search and filtering"