#!/bin/bash

# setup-api.sh - Set up CineFluent API repository

echo "Setting up CineFluent API repository..."

# Navigate to API directory
cd cinefluent-api

# Create README.md
cat > README.md << 'EOF'
# CineFluent API

FastAPI backend for CineFluent language learning app.

## Features
- Movie metadata & subtitle processing
- User progress tracking
- Supabase authentication
- PostgreSQL database

## Tech Stack
- FastAPI
- PostgreSQL
- Supabase
- Railway deployment

## Development

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

## Deployment
Automatically deploys to Railway on push to main branch.
EOF

# Create requirements.txt
cat > requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
supabase==2.0.0
psycopg2-binary==2.9.7
python-jose[cryptography]==3.3.0
python-multipart==0.0.6
pytest==7.4.3
EOF

# Create main.py
cat > main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CineFluent API", version="0.1.0")

# CORS middleware for mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    return {"status": "healthy", "service": "CineFluent API"}

@app.get("/api/v1/health")
async def api_health():
    return {"status": "healthy", "version": "0.1.0"}
EOF

# Create LICENSE
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 CineFluent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

# Commit the changes
git add .
git commit -m "Initial FastAPI structure with health endpoints"
git push origin main

echo "✅ CineFluent API repository setup complete!"

# Navigate back to parent directory
cd ..

# ============================================================================

# setup-mobile.sh - Set up CineFluent Mobile repository

echo "Setting up CineFluent Mobile repository..."

# Navigate to mobile directory
cd cinefluent-mobile

# Create README.md
cat > README.md << 'EOF'
# CineFluent Mobile

iOS and Android app for learning languages through movie subtitles.

## Tech Stack
- React Native / Expo
- TypeScript
- Expo Router
- Supabase Auth

## Development

```bash
npm install
expo start
```

## Deployment
- Vercel for web preview builds
- Expo EAS for native app builds
EOF

# Create package.json
cat > package.json << 'EOF'
{
  "name": "cinefluent-mobile",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "react": "18.2.0",
    "react-native": "0.74.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
EOF

# Create app.json
cat > app.json << 'EOF'
{
  "expo": {
    "name": "CineFluent",
    "slug": "cinefluent",
    "version": "0.1.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
EOF

# Create LICENSE (same as API)
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 CineFluent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

# Create basic TypeScript config
cat > tsconfig.json << 'EOF'
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
EOF

# Create assets directory (placeholder)
mkdir -p assets
echo "# Placeholder for app assets (icons, splash screens)" > assets/README.md

# Commit the changes
git add .
git commit -m "Initial React Native/Expo project structure"
git push origin main

echo "✅ CineFluent Mobile repository setup complete!"

cd ..

echo ""
echo "🚀 Stage 0 Complete!"
echo "✅ Both repositories set up with basic structure"
echo "✅ Files committed and pushed to GitHub"
echo ""
echo "Next steps:"
echo "1. Connect cinefluent-mobile to Vercel"
echo "2. Connect cinefluent-api to Railway"
echo "3. Ready for Stage 1: Import Lobeable design!"`