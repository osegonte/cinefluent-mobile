
# CineFluent Backend Specification

## Overview
This document provides a comprehensive backend specification for CineFluent, a mobile-first language learning platform that uses movies to teach languages. The backend must support real-time interactions, scalable content delivery, user progress tracking, and social features.

## Architecture Overview

### Technology Stack
- **Runtime**: Node.js 18+ / Supabase Edge Functions
- **Database**: PostgreSQL with Supabase
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **Caching**: Redis (optional)
- **Video Processing**: FFmpeg / Video.js
- **Search**: PostgreSQL Full-Text Search + pg_trgm

### Core Services
1. **Authentication Service** - User management and security
2. **Content Management Service** - Movie catalog and metadata
3. **Learning Engine** - Progress tracking and adaptive learning
4. **Social Service** - Community features and interactions
5. **Analytics Service** - Usage tracking and insights
6. **Notification Service** - Push notifications and alerts
7. **Payment Service** - Subscription and billing management

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  native_language VARCHAR(10) DEFAULT 'en',
  target_languages TEXT[] DEFAULT '{}',
  subscription_tier VARCHAR(20) DEFAULT 'free',
  subscription_ends_at TIMESTAMPTZ,
  streak_count INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  daily_goal INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Movies Table
```sql
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tmdb_id INTEGER UNIQUE,
  title VARCHAR(255) NOT NULL,
  original_title VARCHAR(255),
  description TEXT,
  release_date DATE,
  duration_minutes INTEGER,
  poster_url TEXT,
  backdrop_url TEXT,
  trailer_url TEXT,
  imdb_rating DECIMAL(3,1),
  age_rating VARCHAR(10),
  genres TEXT[] DEFAULT '{}',
  available_languages TEXT[] DEFAULT '{}',
  difficulty_levels JSONB DEFAULT '{}',
  popularity_score DECIMAL(5,2) DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for search performance
CREATE INDEX idx_movies_search ON movies USING GIN(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_movies_languages ON movies USING GIN(available_languages);
CREATE INDEX idx_movies_genres ON movies USING GIN(genres);
```

### Movie Lessons Table
```sql
CREATE TABLE movie_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  language VARCHAR(10) NOT NULL,
  difficulty_level VARCHAR(20) NOT NULL,
  lesson_order INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT,
  subtitle_url TEXT,
  vocabulary_count INTEGER DEFAULT 0,
  estimated_duration INTEGER, -- in minutes
  learning_objectives TEXT[],
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(movie_id, language, lesson_order)
);
```

### Subtitles Table
```sql
CREATE TABLE subtitles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES movie_lessons(id) ON DELETE CASCADE,
  start_time DECIMAL(10,3) NOT NULL, -- seconds
  end_time DECIMAL(10,3) NOT NULL,
  text TEXT NOT NULL,
  translation TEXT,
  difficulty_words TEXT[] DEFAULT '{}',
  context_notes TEXT,
  sequence_order INTEGER NOT NULL
);

CREATE INDEX idx_subtitles_timing ON subtitles(lesson_id, start_time, end_time);
```

### Vocabulary Table
```sql
CREATE TABLE vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word VARCHAR(255) NOT NULL,
  language VARCHAR(10) NOT NULL,
  translation VARCHAR(255) NOT NULL,
  pronunciation TEXT,
  part_of_speech VARCHAR(50),
  difficulty_level VARCHAR(20),
  frequency_rank INTEGER,
  example_sentence TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(word, language)
);

CREATE INDEX idx_vocabulary_search ON vocabulary USING GIN(to_tsvector('english', word || ' ' || translation));
```

### User Progress Table
```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES movie_lessons(id) ON DELETE CASCADE,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  completed_at TIMESTAMPTZ,
  time_spent INTEGER DEFAULT 0, -- seconds
  vocabulary_learned TEXT[] DEFAULT '{}',
  quiz_scores JSONB DEFAULT '{}',
  last_position DECIMAL(10,3) DEFAULT 0, -- video timestamp
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);
```

### User Vocabulary Progress Table
```sql
CREATE TABLE user_vocabulary_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vocabulary_id UUID REFERENCES vocabulary(id) ON DELETE CASCADE,
  mastery_level INTEGER DEFAULT 0, -- 0-5 scale
  times_seen INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vocabulary_id)
);
```

### Bookmarks Table
```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);
```

### Community Posts Table
```sql
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  movie_id UUID REFERENCES movies(id),
  language VARCHAR(10),
  post_type VARCHAR(50) DEFAULT 'general',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### User Activities Table
```sql
CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  activity_data JSONB DEFAULT '{}',
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_activities_user_date ON user_activities(user_id, created_at);
```

## API Endpoints

### Authentication Endpoints

#### POST /auth/register
```typescript
interface RegisterRequest {
  email: string;
  password: string;
  username?: string;
  fullName?: string;
  nativeLanguage?: string;
}

interface RegisterResponse {
  user: User;
  session: Session;
}
```

#### POST /auth/login
```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  session: Session;
}
```

#### POST /auth/google
```typescript
interface GoogleAuthRequest {
  idToken: string;
}
```

#### GET /auth/me
```typescript
interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  nativeLanguage: string;
  targetLanguages: string[];
  subscriptionTier: 'free' | 'premium' | 'pro';
  streakCount: number;
  totalPoints: number;
  dailyGoal: number;
}
```

### Content Management Endpoints

#### GET /movies
```typescript
interface MoviesQuery {
  search?: string;
  languages?: string[];
  genres?: string[];
  difficulty?: string[];
  isPremium?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'popularity' | 'rating' | 'recent' | 'alphabetical';
}

interface MoviesResponse {
  movies: Movie[];
  total: number;
  page: number;
  totalPages: number;
  filters: {
    languages: string[];
    genres: string[];
    difficulties: string[];
  };
}
```

#### GET /movies/:id
```typescript
interface MovieDetail {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  duration: number;
  rating: number;
  genres: string[];
  availableLanguages: string[];
  difficultyLevels: Record<string, string>;
  lessons: MovieLesson[];
  userProgress?: UserProgress;
  isBookmarked: boolean;
}
```

#### GET /movies/:id/lessons
```typescript
interface LessonQuery {
  language: string;
  difficulty?: string;
}

interface LessonResponse {
  lessons: MovieLesson[];
  totalDuration: number;
  vocabularyCount: number;
}
```

#### GET /lessons/:id
```typescript
interface LessonDetail {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  subtitles: Subtitle[];
  vocabulary: VocabularyItem[];
  learningObjectives: string[];
  userProgress: LessonProgress;
}
```

### Progress Tracking Endpoints

#### GET /progress/stats
```typescript
interface ProgressStats {
  currentStreak: number;
  longestStreak: number;
  totalLessonsCompleted: number;
  totalTimeSpent: number;
  wordsLearned: number;
  pointsEarned: number;
  weeklyGoalProgress: {
    target: number;
    completed: number;
    percentage: number;
  };
  dailyActivity: Array<{
    date: string;
    lessonsCompleted: number;
    timeSpent: number;
    pointsEarned: number;
  }>;
}
```

#### POST /progress/update
```typescript
interface ProgressUpdate {
  lessonId: string;
  progressPercentage: number;
  timeSpent: number;
  currentPosition: number;
  vocabularyLearned?: string[];
  quizResults?: Record<string, any>;
}
```

#### GET /progress/history
```typescript
interface ProgressHistory {
  lessons: Array<{
    lesson: MovieLesson;
    progress: number;
    completedAt?: string;
    timeSpent: number;
  }>;
  pagination: {
    page: number;
    totalPages: number;
  };
}
```

### Social Features Endpoints

#### GET /community/posts
```typescript
interface CommunityQuery {
  language?: string;
  movieId?: string;
  postType?: string;
  page?: number;
  limit?: number;
}

interface CommunityPost {
  id: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  content: string;
  movie?: {
    id: string;
    title: string;
  };
  language?: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
}
```

#### POST /community/posts
```typescript
interface CreatePostRequest {
  content: string;
  movieId?: string;
  language?: string;
  postType?: string;
}
```

#### GET /leaderboard
```typescript
interface LeaderboardQuery {
  period?: 'weekly' | 'monthly' | 'all-time';
  language?: string;
  limit?: number;
}

interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  points: number;
  lessonsCompleted: number;
  streak: number;
}
```

### Search Endpoints

#### GET /search
```typescript
interface SearchQuery {
  q: string;
  type?: 'movies' | 'vocabulary' | 'users' | 'all';
  language?: string;
  limit?: number;
}

interface SearchResponse {
  movies?: Movie[];
  vocabulary?: VocabularyItem[];
  users?: UserProfile[];
  suggestions: string[];
}
```

#### GET /search/suggestions
```typescript
interface SearchSuggestions {
  recent: string[];
  popular: string[];
  trending: string[];
}
```

### Subscription Endpoints

#### GET /subscription/status
```typescript
interface SubscriptionStatus {
  tier: 'free' | 'premium' | 'pro';
  isActive: boolean;
  expiresAt?: string;
  features: string[];
  limits: {
    dailyLessons: number;
    offlineDownloads: number;
    advancedFeatures: boolean;
  };
}
```

#### POST /subscription/upgrade
```typescript
interface UpgradeRequest {
  tier: 'premium' | 'pro';
  paymentMethodId: string;
}
```

## Real-time Features

### WebSocket Events

#### Progress Updates
```typescript
// Client -> Server
interface ProgressEvent {
  type: 'progress_update';
  lessonId: string;
  progress: number;
  timestamp: number;
}

// Server -> Client
interface ProgressBroadcast {
  type: 'user_progress';
  userId: string;
  lessonId: string;
  progress: number;
}
```

#### Community Activity
```typescript
interface CommunityEvent {
  type: 'new_post' | 'post_liked' | 'new_comment';
  postId: string;
  userId: string;
  data: any;
}
```

## Performance Requirements

### Response Time Targets
- Authentication: < 200ms
- Movie search: < 300ms
- Lesson loading: < 500ms
- Progress updates: < 100ms
- Community feed: < 400ms

### Scalability Requirements
- Support 100,000+ concurrent users
- Handle 1M+ API requests per hour
- Store 50TB+ of video content
- Process 10,000+ progress updates per minute

### Caching Strategy
```typescript
// Redis cache keys
const CACHE_KEYS = {
  MOVIE_DETAILS: 'movie:details:{id}',
  USER_PROGRESS: 'user:progress:{userId}',
  POPULAR_MOVIES: 'movies:popular:{language}',
  LEADERBOARD: 'leaderboard:{period}:{language}',
  SEARCH_RESULTS: 'search:{query}:{filters}'
};

// Cache TTL (seconds)
const CACHE_TTL = {
  MOVIE_DETAILS: 3600,      // 1 hour
  USER_PROGRESS: 300,       // 5 minutes
  POPULAR_MOVIES: 1800,     // 30 minutes
  LEADERBOARD: 600,         // 10 minutes
  SEARCH_RESULTS: 1800      // 30 minutes
};
```

## Security Considerations

### Authentication & Authorization
- JWT tokens with 24-hour expiration
- Refresh tokens with 30-day expiration
- Row Level Security (RLS) on all user data
- API rate limiting: 1000 requests/hour per user

### Data Protection
- All PII encrypted at rest
- HTTPS only for all endpoints
- Input sanitization and validation
- SQL injection prevention
- XSS protection

### Content Security
- Signed URLs for video content
- Geo-blocking for licensed content
- DRM integration for premium content
- Watermarking for user-generated content

## Analytics & Monitoring

### Key Metrics
```typescript
interface AnalyticsEvents {
  // User engagement
  lesson_started: { userId: string; lessonId: string; timestamp: number };
  lesson_completed: { userId: string; lessonId: string; duration: number };
  vocabulary_learned: { userId: string; wordId: string; attempts: number };
  
  // Content performance
  movie_viewed: { movieId: string; userId: string; source: string };
  search_performed: { query: string; resultsCount: number; userId: string };
  
  // Business metrics
  subscription_upgraded: { userId: string; tier: string; revenue: number };
  user_retention: { userId: string; daysSinceSignup: number };
}
```

### Error Tracking
- Application errors with stack traces
- Performance bottlenecks identification
- User experience issues tracking
- A/B testing framework integration

## Deployment & Infrastructure

### Environment Configuration
```typescript
interface EnvironmentConfig {
  DATABASE_URL: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  REDIS_URL?: string;
  STRIPE_SECRET_KEY: string;
  VIDEO_CDN_URL: string;
  TMDB_API_KEY: string;
  GOOGLE_OAUTH_CLIENT_ID: string;
  JWT_SECRET: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
}
```

### Edge Functions
```typescript
// Supabase Edge Functions
const EDGE_FUNCTIONS = [
  'auth-callback',
  'progress-update',
  'recommendation-engine',
  'payment-webhook',
  'content-sync',
  'analytics-processor'
];
```

## Integration Requirements

### Third-party Services
- **TMDB API**: Movie metadata and images
- **Stripe**: Payment processing
- **Google Translate**: Automated translations
- **OpenAI**: Content generation and personalization
- **SendGrid**: Email notifications
- **Firebase**: Push notifications

### Content Delivery
- **CDN**: Global video distribution
- **Adaptive Streaming**: HLS/DASH support
- **Offline Support**: Progressive download
- **Quality Selection**: 480p, 720p, 1080p options

This comprehensive backend specification provides the foundation for building a robust, scalable language learning platform that can support the rich frontend experience of CineFluent while ensuring optimal performance, security, and user experience.
