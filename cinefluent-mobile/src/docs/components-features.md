
# CineFluent - Components & Features Documentation

## Overview
CineFluent is a mobile-first language learning app that uses movies to teach languages. This document outlines all components, features, and backend integration requirements.

## Core Components

### 1. SearchBar Component (`/src/components/SearchBar.tsx`)
**Purpose**: Movie search and discovery functionality
**Features**:
- Real-time search with debouncing
- Search suggestions and autocomplete
- Filter panel (language, difficulty, genre)
- Recent searches history
- Popular searches display
- Mobile-optimized touch interactions

**Backend Requirements**:
- Movie database with full-text search
- Search analytics and tracking
- User search history storage
- Autocomplete/suggestion API
- Search result caching

### 2. ThemeProvider & ThemeToggle (`/src/components/`)
**Purpose**: Dark/light theme management
**Features**:
- System preference detection
- Manual theme switching
- Persistent theme storage
- Smooth transitions
- Cross-component theme consistency

### 3. NavigationTabs (`/src/components/NavigationTabs.tsx`)
**Purpose**: Bottom tab navigation
**Features**:
- Active state management
- Route-based highlighting
- Touch-optimized hit targets
- Smooth animations
- Badge notifications support

## Page Components

### 1. Learn Page (`/src/pages/Learn.tsx`)
**Purpose**: Main learning interface
**Features**:
- Movie discovery and browsing
- Category filtering
- Search integration
- Progress tracking
- Daily goal visualization
- Quick stats dashboard
- Bookmark functionality
- Premium content indicators

**Backend Requirements**:
- Movie catalog API
- User progress tracking
- Recommendation engine
- Bookmark management
- Analytics tracking

### 2. Profile Page (`/src/pages/Profile.tsx`)
**Purpose**: User account and settings management
**Features**:
- User profile display
- Learning statistics
- Premium subscription management
- App settings configuration
- Language preferences
- Account management
- Sign out functionality

**Backend Requirements**:
- User authentication
- Profile data management
- Subscription handling
- Settings synchronization
- Usage analytics

### 3. Progress Page (`/src/pages/Progress.tsx`)
**Purpose**: Learning progress visualization
**Features**:
- Weekly goal tracking
- Streak counter
- Activity calendar
- Statistics dashboard
- Achievement badges
- Progress charts

**Backend Requirements**:
- Progress data storage
- Goal tracking system
- Achievement engine
- Statistics computation
- Historical data retention

### 4. Community Page (`/src/pages/Community.tsx`)
**Purpose**: Social learning features
**Features**:
- Leaderboards
- User posts and discussions
- Social interactions
- Community challenges
- Achievement sharing

**Backend Requirements**:
- User-generated content system
- Social interaction APIs
- Leaderboard computation
- Community moderation
- Push notifications

## UI Components (Shadcn/UI)

### Form Components
- `Input` - Text inputs with validation
- `Button` - Interactive buttons with variants
- `Switch` - Toggle switches for settings
- `Progress` - Progress bars and indicators

### Display Components
- `Card` - Content containers
- `Badge` - Status and category indicators
- `Avatar` - User profile images
- `Separator` - Visual dividers

### Navigation Components
- `NavigationMenu` - Dropdown navigation
- `Tabs` - Tabbed interfaces
- `Breadcrumb` - Navigation breadcrumbs

## Features by Category

### 🎬 Content Management
- Movie catalog browsing
- Search and filtering
- Category organization
- Difficulty levels
- Language variants
- Premium content gating

### 📊 Progress Tracking
- Learning streaks
- Daily/weekly goals
- Skill progression
- Time tracking
- Achievement system
- Performance analytics

### 👤 User Management
- Profile customization
- Preference settings
- Subscription management
- Social features
- Privacy controls

### 🔍 Search & Discovery
- Full-text search
- Smart filtering
- Personalized recommendations
- Trending content
- Recently viewed
- Bookmarks and favorites

### 🎨 UI/UX Features
- Dark/light theme support
- Responsive mobile design
- Touch-optimized interactions
- Accessibility compliance
- Smooth animations
- Offline capability

### 💰 Premium Features
- Ad-free experience
- Offline downloads
- Advanced search
- Priority support
- Exclusive content
- Enhanced analytics

## Backend Integration Requirements

### Authentication & User Management
```typescript
// User authentication endpoints
POST /auth/login
POST /auth/register  
POST /auth/logout
GET /auth/me
PUT /auth/profile
```

### Content Management
```typescript
// Movie and content APIs
GET /movies
GET /movies/:id
GET /movies/search?q=query&filters={}
GET /categories
GET /languages
```

### Progress & Analytics
```typescript
// User progress tracking
GET /progress/stats
POST /progress/update
GET /progress/history
GET /achievements
```

### Subscription & Payments
```typescript
// Premium subscription management
GET /subscription/status
POST /subscription/upgrade
POST /subscription/cancel
GET /subscription/features
```

### Social Features
```typescript
// Community and social APIs
GET /leaderboard
GET /community/posts
POST /community/posts
GET /community/user/:id
```

## Mobile Optimization Features

### iOS Specific
- Safe area handling
- Native scroll behavior
- Haptic feedback integration
- iOS-style navigation
- Dynamic Type support

### Android Specific
- Material Design elements
- Android back gesture
- Status bar theming
- Android-style ripple effects
- Adaptive icons

### Cross-Platform
- Touch-optimized hit targets (44px minimum)
- Swipe gestures
- Pull-to-refresh
- Infinite scrolling
- Responsive breakpoints
- Performance optimization

## Development Notes

### State Management
- React Context for theme
- Local state for UI interactions
- Future: Redux/Zustand for complex state

### Performance
- Image lazy loading
- Virtual scrolling for large lists
- Code splitting by routes
- Bundle optimization
- Caching strategies

### Accessibility
- Screen reader support
- Keyboard navigation
- High contrast mode
- Focus management
- ARIA labels

### Testing Strategy
- Unit tests for components
- Integration tests for user flows
- E2E tests for critical paths
- Performance testing
- Accessibility testing

This documentation serves as a comprehensive guide for backend developers to understand the frontend requirements and implement appropriate APIs and services.
