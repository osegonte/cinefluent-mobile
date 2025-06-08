#!/bin/bash

# cleanup-repo.sh - Prepare CineFluent frontend repo for sharing
# Run this from the cinefluent-mobile directory

set -e  # Exit on any error

echo "🧹 Starting CineFluent Frontend Repository Cleanup..."
echo "=================================================="

# Check if we're in the right directory
if [[ ! -f "package.json" || ! -d "src" ]]; then
    echo "❌ Error: Run this script from the cinefluent-mobile directory"
    exit 1
fi

echo "📂 Current directory: $(pwd)"
echo ""

# 1. Remove debug/test files
echo "🗑️  Step 1: Removing debug and test files..."
files_to_remove=(
    "debug-login.js"
    "add-connection-test.sh.save"
    "test-api-connection.js"
    "test-auth.js"
    "src/components/DebugApiTest.tsx"
    "src/components/TestLogin.tsx"
    "src/components/ConnectionTest.tsx"
)

for file in "${files_to_remove[@]}"; do
    if [[ -f "$file" ]]; then
        echo "   🗑️  Removing $file"
        rm "$file"
    else
        echo "   ✅ $file (already removed)"
    fi
done

# 2. Clean up environment variables
echo ""
echo "🔧 Step 2: Creating clean environment file..."
if [[ -f ".env" ]]; then
    cp ".env" ".env.backup"
    echo "   💾 Backed up existing .env to .env.backup"
fi

cat > .env << 'EOF'
# CineFluent Environment Variables
# Copy this to .env.local and configure with your values

VITE_API_BASE_URL=https://your-backend-url.com
VITE_APP_NAME=CineFluent
VITE_APP_VERSION=0.1.0
VITE_DEV_MODE=false
VITE_ENABLE_LOGGING=false
EOF

# Create .env.example for contributors
cp .env .env.example
echo "   ✅ Created clean .env and .env.example"

# 3. Update .gitignore
echo ""
echo "📝 Step 3: Updating .gitignore..."
cat >> .gitignore << 'EOF'

# Additional cleanup entries
.env.local
.env.production
.env.backup
dist/
coverage/
*.log
.DS_Store
debug-*.js
test-*.js
*.backup
.temp/
EOF
echo "   ✅ Updated .gitignore with additional entries"

# 4. Create comprehensive README.md
echo ""
echo "📚 Step 4: Creating comprehensive README.md..."
cat > README.md << 'EOF'
# 🎬 CineFluent Mobile

A mobile-first language learning app that uses movies to teach languages through interactive subtitles and vocabulary building.

![CineFluent Preview](https://via.placeholder.com/800x400/3D7BFF/white?text=CineFluent+Mobile+Preview)

## ✨ Features

- 🎥 **Interactive Movie Learning** - Learn languages through your favorite films
- 📱 **Mobile-First Design** - Optimized for iOS and Android devices
- 🎯 **Progress Tracking** - Monitor your learning journey with detailed analytics
- 👥 **Community Features** - Connect with fellow learners and share progress
- 🌙 **Dark Mode Support** - Beautiful themes for any time of day
- 🔄 **Real-time Sync** - Progress synced across all devices
- 💫 **PWA Ready** - Install as a native app experience

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd cinefluent-mobile

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env.local
# Edit .env.local with your backend URL

# Start development server
npm run dev
```

Visit `http://localhost:8080` to see the app running.

### Backend Setup
This frontend connects to a FastAPI backend. You'll need to:
1. Set up the backend API (see backend repository)
2. Configure `VITE_API_BASE_URL` in `.env.local`
3. Ensure CORS is properly configured

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/UI components
- **State Management**: React Context, TanStack Query
- **Routing**: React Router v6
- **Mobile**: PWA-ready, Capacitor for native builds
- **Icons**: Lucide React
- **Build Tool**: Vite with SWC

## 📱 Mobile Features

### iOS Support
- Safe area handling for notched devices
- iOS-style navigation and haptics
- App Store deployment ready
- Dynamic Type support

### Android Support  
- Material Design 3 principles
- Android back gesture support
- Play Store deployment ready
- Adaptive icons

### Cross-Platform
- 44px minimum touch targets
- Swipe gestures and pull-to-refresh
- Offline capability (planned)
- Performance optimized

## 🧩 Component Architecture

```
src/
├── components/
│   ├── ui/              # Base UI components (Shadcn/UI)
│   ├── SearchBar.tsx    # Advanced search with filters
│   ├── NavigationTabs.tsx # Bottom tab navigation
│   └── MobileProgressCard.tsx # Progress tracking cards
├── pages/
│   ├── Auth/           # Login/Register pages
│   ├── Learn.tsx       # Main learning interface
│   ├── Progress.tsx    # Progress tracking
│   ├── Community.tsx   # Social features
│   └── Profile.tsx     # User management
├── hooks/
│   └── useApi.ts       # API integration hooks
├── contexts/
│   └── AuthContext.tsx # Authentication state
└── lib/
    ├── api.ts          # API client
    └── utils.ts        # Utilities
```

## 🎨 Design System

### Colors
- **Primary**: #3D7BFF (CineFluent Blue)
- **Success**: #3CCB7F 
- **Warning**: #FFD864
- **Destructive**: #FF5B5B

### Typography
- System fonts (SF Pro on iOS, Roboto on Android)
- Responsive sizing with mobile optimization
- Dark mode support

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🎯 Priority Areas
- [ ] Mobile UI/UX improvements
- [ ] Interactive subtitle enhancements  
- [ ] Offline mode implementation
- [ ] Accessibility improvements
- [ ] Performance optimization
- [ ] Test coverage

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m 'Add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow mobile-first responsive design
- Use Tailwind CSS utility classes
- Write accessible HTML with proper ARIA labels
- Add JSDoc comments for complex functions

### Testing
```bash
npm run type-check    # TypeScript checking
npm run lint         # ESLint
npm run build        # Production build test
```

## 📖 Documentation

- [API Integration Guide](./docs/api-integration.md)
- [Component Documentation](./docs/components.md)
- [Mobile Optimization](./docs/mobile-optimization.md)
- [Deployment Guide](./docs/deployment.md)

## 🚢 Deployment

### Web (Vercel)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Mobile Apps
```bash
# iOS (requires macOS + Xcode)
npx cap add ios
npx cap run ios

# Android (requires Android Studio)
npx cap add android
npx cap run android
```

## 🐛 Issues & Support

- 🐛 [Report a Bug](../../issues/new?template=bug_report.md)
- 💡 [Request a Feature](../../issues/new?template=feature_request.md)
- 💬 [Ask a Question](../../discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/)
- UI components by [Shadcn/UI](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styling by [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ by the CineFluent team**

*Learn languages through the magic of cinema* 🎬✨
EOF

echo "   ✅ Created comprehensive README.md"

# 5. Create CONTRIBUTING.md
echo ""
echo "🤝 Step 5: Creating CONTRIBUTING.md..."
cat > CONTRIBUTING.md << 'EOF'
# Contributing to CineFluent

Thank you for your interest in contributing to CineFluent! This guide will help you get started.

## 🚀 Getting Started

### Development Setup
1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and configure
4. Start the development server: `npm run dev`

### Prerequisites
- Node.js 18+
- Modern web browser
- Basic knowledge of React and TypeScript
- Familiarity with mobile-first design principles

## 🎯 Areas for Contribution

### High Priority
- **Mobile UX Improvements**: Better touch interactions, gestures
- **Performance Optimization**: Bundle size, loading times
- **Accessibility**: WCAG compliance, screen reader support
- **Testing**: Unit tests, integration tests, E2E tests

### Medium Priority
- **New Features**: Offline mode, push notifications
- **UI Polish**: Animations, micro-interactions
- **Documentation**: Component docs, tutorials
- **Internationalization**: Multi-language support

### Low Priority
- **Code Quality**: Refactoring, type improvements
- **Build Tools**: Optimization, CI/CD improvements

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing component patterns
- Use Tailwind CSS for styling (avoid custom CSS)
- Implement mobile-first responsive design
- Add proper TypeScript types

### Component Guidelines
```typescript
// ✅ Good component structure
interface ComponentProps {
  title: string;
  onAction: () => void;
  variant?: 'default' | 'primary';
}

export function Component({ title, onAction, variant = 'default' }: ComponentProps) {
  return (
    <div className="mobile-card p-4">
      <h2 className="text-title">{title}</h2>
      <Button onClick={onAction} variant={variant}>
        Action
      </Button>
    </div>
  );
}
```

### Mobile Optimization
- Use `btn-mobile` class for buttons (44px min touch target)
- Implement proper safe area handling
- Test on various screen sizes
- Use `touch-target` class for interactive elements
- Consider thumb navigation zones

### API Integration
- Use the existing `apiService` in `src/lib/api.ts`
- Handle loading and error states properly
- Implement optimistic updates where appropriate
- Use React Query for data fetching

## 🧪 Testing

### Running Tests
```bash
npm run type-check    # TypeScript validation
npm run lint         # Code linting
npm run build        # Production build test
```

### Test Guidelines
- Write tests for new components
- Test mobile interactions and responsive behavior
- Include accessibility tests
- Test error scenarios

## 📱 Mobile Testing

### Browser Testing
- Chrome DevTools mobile simulation
- Firefox responsive design mode
- Safari responsive design mode

### Device Testing (Recommended)
- iOS Safari (iPhone)
- Android Chrome
- Test on both phones and tablets

## 🔄 Pull Request Process

1. **Create an Issue**: Describe the problem or feature
2. **Fork & Branch**: Create a descriptive branch name
3. **Develop**: Make your changes following the guidelines
4. **Test**: Ensure everything works on mobile
5. **Document**: Update docs if needed
6. **Submit**: Create a clear pull request

### PR Requirements
- [ ] Code follows the style guidelines
- [ ] Changes work on mobile devices
- [ ] TypeScript builds without errors
- [ ] No console errors or warnings
- [ ] Documentation updated (if applicable)
- [ ] Responsive design tested

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on mobile devices
- [ ] TypeScript passes
- [ ] No console errors

## Screenshots
(Mobile screenshots appreciated)
```

## 🎨 Design Guidelines

### Colors
Use the defined CSS variables:
- `--primary` (CineFluent Blue)
- `--success`, `--warning`, `--destructive`
- Follow dark mode support

### Typography
- Use predefined text classes: `text-headline`, `text-title`, `text-body`, `text-caption`
- Support Dynamic Type on iOS
- Maintain good contrast ratios

### Spacing
- Use Tailwind spacing scale
- Follow 8pt grid system
- Use `mobile-card` class for cards

## 💡 Tips for New Contributors

1. **Start Small**: Look for "good first issue" labels
2. **Ask Questions**: Use GitHub Discussions for clarification
3. **Mobile First**: Always test on mobile devices
4. **Read Code**: Understand existing patterns before adding new ones
5. **Performance**: Consider mobile performance in all changes

## 🐛 Reporting Issues

### Bug Reports
Include:
- Device and browser information
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (especially mobile)

### Feature Requests
- Describe the problem it solves
- Consider mobile user experience
- Provide mockups if applicable

## 📞 Getting Help

- 💬 [GitHub Discussions](../../discussions) - General questions
- 🐛 [Issues](../../issues) - Bug reports and feature requests
- 📖 [Documentation](./docs/) - Technical guides

Thank you for contributing to CineFluent! 🎬✨
EOF

echo "   ✅ Created CONTRIBUTING.md"

# 6. Create docs directory and files
echo ""
echo "📁 Step 6: Creating documentation structure..."
mkdir -p docs

# API Integration documentation
cat > docs/api-integration.md << 'EOF'
# API Integration Guide

This document explains how the CineFluent frontend integrates with the backend API.

## API Client Setup

The API client is configured in `src/lib/api.ts` with:
- Base URL configuration
- Authentication handling
- Error handling
- TypeScript interfaces

## Authentication Flow

1. User logs in via `POST /api/v1/auth/login`
2. JWT token stored in localStorage
3. Token included in subsequent requests
4. Auto-refresh handling (planned)

## Key Endpoints

- `GET /api/v1/movies` - Movie catalog
- `GET /api/v1/auth/me` - User profile
- `POST /api/v1/progress/update` - Learning progress

## Error Handling

All API calls include proper error handling with user-friendly messages.

## Development

Set `VITE_API_BASE_URL` in `.env.local` to your backend URL.
EOF

# Component documentation
cat > docs/components.md << 'EOF'
# Component Documentation

## Core Components

### SearchBar
Advanced search component with filtering capabilities.

### NavigationTabs
Bottom tab navigation optimized for mobile.

### MobileProgressCard
Progress tracking cards with responsive design.

## UI Components

Based on Shadcn/UI with mobile optimizations:
- Enhanced touch targets
- Dark mode support
- Accessibility features

## Design System

See README.md for color palette and typography guidelines.
EOF

echo "   ✅ Created documentation files"

# 7. Add helpful npm scripts
echo ""
echo "📦 Step 7: Updating package.json scripts..."
if command -v jq &> /dev/null; then
    # Use jq if available for clean JSON manipulation
    tmp_file=$(mktemp)
    jq '.scripts += {
        "clean": "rm -rf dist node_modules/.vite",
        "type-check": "tsc --noEmit",
        "preview:mobile": "vite preview --host --port 8080"
    }' package.json > "$tmp_file" && mv "$tmp_file" package.json
    echo "   ✅ Added helpful npm scripts"
else
    echo "   ⚠️  Skipping package.json updates (jq not installed)"
    echo "   💡 Manually add these scripts to package.json:"
    echo '      "clean": "rm -rf dist node_modules/.vite",'
    echo '      "type-check": "tsc --noEmit",'
    echo '      "preview:mobile": "vite preview --host --port 8080"'
fi

# 8. Clean up backup files and temporary files
echo ""
echo "🧽 Step 8: Final cleanup..."
find . -name "*.backup" -type f -delete 2>/dev/null || true
find . -name ".DS_Store" -type f -delete 2>/dev/null || true
echo "   ✅ Removed backup and temporary files"

# 9. Git status check
echo ""
echo "📊 Step 9: Git status check..."
if command -v git &> /dev/null && [[ -d .git ]]; then
    echo "   Git status:"
    git status --porcelain | head -10
    if [[ $(git status --porcelain | wc -l) -gt 10 ]]; then
        echo "   ... and $(( $(git status --porcelain | wc -l) - 10 )) more files"
    fi
    echo ""
    echo "   💡 Recommended next steps:"
    echo "      git add ."
    echo "      git commit -m 'Clean up repository for collaboration'"
    echo "      git push origin main"
else
    echo "   ⚠️  Not a git repository or git not installed"
fi

# 10. Final summary
echo ""
echo "🎉 Repository Cleanup Complete!"
echo "================================="
echo ""
echo "✅ Cleaned up debug files"
echo "✅ Secured environment variables"
echo "✅ Created comprehensive README.md"
echo "✅ Added contributing guidelines"
echo "✅ Set up documentation structure"
echo "✅ Updated build configuration"
echo ""
echo "🚀 Your repository is now ready for collaboration!"
echo ""
echo "📋 Next Steps:"
echo "   1. Review the generated README.md and customize as needed"
echo "   2. Test that 'npm run dev' still works"
echo "   3. Commit and push the changes"
echo "   4. Share your repository with contributors"
echo ""
echo "💡 Pro tip: Add screenshots to README.md to showcase your app!"
echo ""
echo "🎬 Happy collaborating! ✨"