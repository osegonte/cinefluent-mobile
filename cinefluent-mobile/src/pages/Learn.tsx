import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Play, 
  Clock, 
  Star, 
  BookOpen, 
  Users, 
  Loader2,
  Globe,
  ArrowLeft,
  Crown,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cinefluent-api-production.up.railway.app';

interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  release_year: number;
  difficulty_level: string;
  languages: string[];
  genres: string[];
  thumbnail_url: string;
  video_url: string | null;
  is_premium: boolean;
  vocabulary_count: number;
  imdb_rating: number;
}

interface MoviesResponse {
  movies: Movie[];
  total: number;
  page: number;
  per_page: number;
}

export default function Learn() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  
  const navigate = useNavigate();

  const fetchMovies = async () => {
    try {
      console.log('🎬 Fetching movies...');
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/v1/movies`);
      const data: MoviesResponse = await response.json();

      console.log('Movies response:', data);

      if (response.ok && data.movies) {
        setMovies(data.movies);
        console.log(`✅ Successfully loaded ${data.movies.length} movies`);
      } else {
        throw new Error('Failed to load movies');
      }
    } catch (err: any) {
      console.error('❌ Error loading movies:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Filter movies based on search and filters
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || movie.languages.includes(selectedLanguage);
    const matchesDifficulty = selectedDifficulty === 'all' || movie.difficulty_level === selectedDifficulty;
    
    return matchesSearch && matchesLanguage && matchesDifficulty;
  });

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleStartLearning = (movie: Movie) => {
    console.log(`Starting learning for movie: ${movie.title} (ID: ${movie.id})`);
    alert(`Learning mode for "${movie.title}" coming soon! 🎬\n\nThis will open the subtitle-based learning interface where you can:\n• Study movie dialogues\n• Learn vocabulary in context\n• Practice pronunciation\n• Take comprehension quizzes`);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="p-8 text-center border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <CardTitle className="text-xl text-gray-800 mb-2">Loading Movies</CardTitle>
          <CardDescription>Discovering amazing content for your language journey...</CardDescription>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <Card className="w-full max-w-md text-center border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <CardTitle className="text-xl text-red-800">Connection Error</CardTitle>
            <CardDescription className="text-red-600">{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={fetchMovies} className="w-full">
              Try Again
            </Button>
            <Button variant="outline" onClick={handleLogout} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CineFluent
                </h1>
                <p className="text-sm text-gray-600">Language Learning Platform</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Success Message */}
        {movies.length > 0 && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 font-medium">
              🎉 Successfully connected! Found {movies.length} movies ready for language learning.
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Discover Movies to Learn Languages
            </CardTitle>
            <CardDescription>
              Choose from our curated collection of movies with subtitle-based learning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search movies, genres, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All Languages</option>
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="ja">Japanese</option>
                </select>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            
            {searchTerm && (
              <div className="text-sm text-gray-600">
                Found {filteredMovies.length} results for "{searchTerm}"
              </div>
            )}
          </CardContent>
        </Card>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMovies.map((movie) => (
                <Card key={movie.id} className="group overflow-hidden shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-[2/3] relative overflow-hidden">
                    <img
                      src={movie.thumbnail_url || `https://via.placeholder.com/300x450/6366f1/white?text=${encodeURIComponent(movie.title)}`}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = `https://via.placeholder.com/300x450/6366f1/white?text=${encodeURIComponent(movie.title)}`;
                      }}
                    />
                    
                    {movie.is_premium && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button 
                        onClick={() => handleStartLearning(movie)}
                        size="lg" 
                        className="bg-white text-black hover:bg-gray-100 font-semibold shadow-lg"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Learning
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1 text-gray-800">{movie.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {movie.languages[0]?.toUpperCase() || 'Multi'}
                        </Badge>
                        <Badge className={`text-xs ${getDifficultyColor(movie.difficulty_level)}`}>
                          {movie.difficulty_level}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(movie.duration)}
                      </div>
                      {movie.vocabulary_count && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {movie.vocabulary_count} words
                        </div>
                      )}
                      {movie.imdb_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {movie.imdb_rating}
                        </div>
                      )}
                    </div>
                    
                    {movie.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {movie.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Results Summary */}
            <div className="text-center">
              <Card className="inline-block px-6 py-3 border-0 bg-white/60 backdrop-blur-sm">
                <p className="text-sm text-gray-600">
                  {searchTerm || selectedLanguage !== 'all' || selectedDifficulty !== 'all' ? (
                    <>Showing {filteredMovies.length} of {movies.length} movies</>
                  ) : (
                    <>Showing all {movies.length} movies</>
                  )}
                </p>
              </Card>
            </div>
          </>
        ) : (
          <Card className="text-center py-12 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <CardTitle className="text-xl text-gray-800 mb-2">
                {searchTerm ? 'No movies found' : 'No movies available'}
              </CardTitle>
              <CardDescription className="mb-6">
                {searchTerm ? 
                  'Try adjusting your search or filters' : 
                  'Check your connection and try refreshing'
                }
              </CardDescription>
              <div className="space-x-2">
                {searchTerm && (
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    Clear Search
                  </Button>
                )}
                <Button onClick={fetchMovies}>
                  <Users className="h-4 w-4 mr-2" />
                  Refresh Movies
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}