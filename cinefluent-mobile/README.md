
# CineFluent - Language Learning Through Movies

A mobile-first language learning application that uses movies to teach languages through interactive subtitles and vocabulary building.

## 🚀 Quick Start

### Web Development
```bash
npm install
npm run dev
```

### Mobile Development (Capacitor)

#### Initial Setup
```bash
# Install dependencies
npm install

# Initialize Capacitor (already configured)
npx cap init

# Add mobile platforms
npx cap add ios
npx cap add android
```

#### Running on Mobile Devices

1. **Export to GitHub**: Use the "Export to GitHub" button in Lovable
2. **Clone locally**: `git clone <your-repo-url>`
3. **Install dependencies**: `npm install`
4. **Build the project**: `npm run build`
5. **Sync with Capacitor**: `npx cap sync`

#### iOS Development
```bash
# Requires macOS with Xcode
npx cap run ios
# or open in Xcode
npx cap open ios
```

#### Android Development
```bash
# Requires Android Studio
npx cap run android
# or open in Android Studio
npx cap open android
```

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/UI** component library
- **React Router** for navigation
- **Capacitor** for native mobile deployment

### Mobile Features
- Native iOS and Android compilation
- Offline capability (PWA)
- Touch-optimized interactions
- Safe area support
- Hardware acceleration
- Platform-specific optimizations

## 📱 Mobile Optimizations

### iOS Specific
- Safe area insets support
- iOS-style haptic feedback ready
- Dynamic Type support
- Native scroll behavior
- SF Symbols icon compatibility

### Android Specific
- Material Design 3 compliance
- Android back gesture support
- Status bar theming
- Adaptive icons ready
- Android-style ripple effects

### Cross-Platform
- 44×44pt minimum touch targets
- Optimized scroll performance
- Pull-to-refresh patterns
- Gesture navigation
- Responsive breakpoints

## 🎨 Design System

### Colors
- **Primary**: #3D7BFF (Brand Blue)
- **Dark Background**: #0E0E12
- **Light Background**: #FFFFFF
- **Success**: #3CCB7F
- **Warning**: #FFD864
- **Destructive**: #FF5B5B

### Typography
- **System Fonts**: SF Pro (iOS) / Roboto (Android)
- **Font Sizes**: 12px, 14px, 16px, 18px, 24px, 32px
- **Dynamic Type**: Supports iOS accessibility scaling

### Spacing
- **Grid**: 8pt base grid system
- **Border Radius**: 12pt for cards, 8pt for buttons
- **Safe Areas**: Automatic iOS/Android safe area handling

## 🧩 Components

### Core Components
- `SearchBar` - Advanced search with filters
- `MobileProgressCard` - Progress tracking cards
- `NavigationTabs` - Bottom tab navigation
- `ThemeProvider` - Dark/light mode support

### UI Components (Shadcn/UI)
- Cards, Buttons, Inputs
- Sheets, Dialogs, Tooltips
- Progress bars, Badges, Avatars
- Navigation, Tabs, Separators

## 📊 Features

### 🎬 Content Discovery
- Movie search and filtering
- Category browsing
- Difficulty level sorting
- Language-specific content
- Premium content gating

### 📈 Progress Tracking
- Learning streaks
- Weekly goals
- Vocabulary progress
- Achievement system
- Analytics dashboard

### 👥 Community Features
- Discussion forums
- Leaderboards
- Social interactions
- Content sharing
- Study groups

### ⚙️ Settings & Preferences
- Language selection
- Learning goals
- Notification settings
- Theme preferences
- Privacy controls

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking

# Mobile Development
npx cap sync            # Sync web assets to native
npx cap run ios         # Run on iOS simulator/device
npx cap run android     # Run on Android emulator/device
npx cap open ios        # Open iOS project in Xcode
npx cap open android    # Open Android project in Android Studio

# Capacitor Updates
npx cap update          # Update Capacitor and plugins
npx cap doctor          # Check Capacitor setup
```

## 📦 Build & Deployment

### Web Deployment
The app is automatically deployed via Lovable's hosting platform.

### Mobile App Store Deployment

#### iOS App Store
1. Build and archive in Xcode
2. Upload to App Store Connect
3. Submit for review
4. Configure App Store metadata

#### Google Play Store
1. Generate signed APK/AAB in Android Studio
2. Upload to Google Play Console
3. Complete store listing
4. Submit for review

## 🔒 Security & Privacy

- HTTPS/TLS encryption
- Secure authentication
- Data privacy compliance (GDPR)
- Input validation and sanitization
- XSS and CSRF protection

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions:
- Documentation: [Project Documentation](./src/docs/)
- Issues: GitHub Issues
- Community: Discord/Slack channels

---

**CineFluent** - Learn languages through the magic of cinema! 🎬✨
