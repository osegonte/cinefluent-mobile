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
