
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import SearchBar from "@/components/SearchBar";
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Bookmark,
  Trophy,
  Target,
  Zap
} from "lucide-react";

/**
 * Learn Component - Main learning interface
 * 
 * Features:
 * - Movie search and discovery
 * - Learning progress tracking
 * - Course recommendations
 * - Achievement system
 * - Cross-platform mobile optimization
 * 
 * Backend Integration Requirements:
 * - Movie database with metadata
 * - User progress tracking
 * - Recommendation engine
 * - Video streaming service
 * - Analytics and usage tracking
 */

const Learn = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categories for movie filtering
  const categories = [
    { id: 'all', label: 'All', count: 24 },
    { id: 'spanish', label: 'Spanish', count: 8 },
    { id: 'french', label: 'French', count: 6 },
    { id: 'german', label: 'German', count: 4 },
    { id: 'beginner', label: 'Beginner', count: 12 }
  ];

  // Mock featured movies data - will come from backend
  const featuredMovies = [
    {
      id: 1,
      title: "Finding Nemo",
      language: "Spanish",
      difficulty: "Beginner",
      duration: "45 min",
      progress: 35,
      thumbnail: "/placeholder.svg",
      rating: 4.8,
      studentsCount: 2341,
      newWords: 23,
      isBookmarked: false,
      isPremium: false
    },
    {
      id: 2,
      title: "Ratatouille",
      language: "French", 
      difficulty: "Intermediate",
      duration: "52 min",
      progress: 0,
      thumbnail: "/placeholder.svg",
      rating: 4.9,
      studentsCount: 1876,
      newWords: 31,
      isBookmarked: true,
      isPremium: false
    },
    {
      id: 3,
      title: "The Incredibles",
      language: "German",
      difficulty: "Advanced", 
      duration: "38 min",
      progress: 78,
      thumbnail: "/placeholder.svg",
      rating: 4.7,
      studentsCount: 987,
      newWords: 42,
      isBookmarked: false,
      isPremium: true
    }
  ];

  // Filter movies based on search and category
  const filteredMovies = featuredMovies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         movie.language.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           movie.language.toLowerCase() === selectedCategory ||
                           movie.difficulty.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-md">
        
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Learn with Movies
          </h1>
          <p className="text-muted-foreground">
            Master languages through cinematic storytelling
          </p>
        </div>

        {/* Search Bar Integration */}
        <div className="mb-6">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search movies, languages, or topics..."
          />
        </div>

        {/* Daily Goal Progress */}
        <Card className="mobile-card p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/20 rounded-full">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Daily Goal</h3>
              <p className="text-sm text-muted-foreground">3 of 5 lessons completed</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary tabular-nums">3/5</div>
            </div>
          </div>
          <Progress value={60} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Keep going!</span>
            <span>2 lessons left</span>
          </div>
        </Card>

        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`cursor-pointer whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category.id 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "hover:bg-primary/10 hover:border-primary/50"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label} ({category.count})
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="mobile-card p-3 text-center">
            <Trophy className="w-5 h-5 text-warning mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground tabular-nums">23</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </Card>
          
          <Card className="mobile-card p-3 text-center">
            <Zap className="w-5 h-5 text-success mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground tabular-nums">347</div>
            <div className="text-xs text-muted-foreground">Words</div>
          </Card>
          
          <Card className="mobile-card p-3 text-center">
            <Star className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground tabular-nums">1,876</div>
            <div className="text-xs text-muted-foreground">Points</div>
          </Card>
        </div>

        {/* Movie Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {searchQuery ? `Search Results (${filteredMovies.length})` : 'Featured Movies'}
            </h2>
          </div>

          {filteredMovies.length === 0 ? (
            // Empty State
            <Card className="mobile-card p-8 text-center">
              <div className="text-muted-foreground mb-4">
                <Play className="w-12 h-12 mx-auto opacity-50" />
              </div>
              <h3 className="font-medium text-foreground mb-2">No movies found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search or browse all categories
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </Card>
          ) : (
            // Movie Cards
            filteredMovies.map((movie) => (
              <Card key={movie.id} className="mobile-card p-4 hover:shadow-lg transition-all duration-200">
                <div className="flex gap-4">
                  {/* Movie Thumbnail */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img 
                      src={movie.thumbnail} 
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    {movie.isPremium && (
                      <div className="absolute top-1 right-1 p-1 bg-warning/90 rounded">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Movie Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground leading-tight truncate">
                        {movie.title}
                      </h3>
                      <Button variant="ghost" size="sm" className="p-0 h-6 w-6 flex-shrink-0">
                        <Bookmark 
                          className={`w-4 h-4 ${
                            movie.isBookmarked 
                              ? 'fill-primary text-primary' 
                              : 'text-muted-foreground'
                          }`} 
                        />
                      </Button>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {movie.language}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {movie.difficulty}
                      </Badge>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {movie.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {movie.studentsCount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-warning text-warning" />
                        <span className="tabular-nums">{movie.rating}</span>
                      </div>
                    </div>

                    {/* Progress Bar (if started) */}
                    {movie.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span className="tabular-nums">{movie.progress}%</span>
                        </div>
                        <Progress value={movie.progress} className="h-2" />
                      </div>
                    )}

                    {/* Action Button */}
                    <Button 
                      className="w-full btn-mobile"
                      variant={movie.progress > 0 ? "default" : "outline"}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {movie.progress > 0 ? 'Continue' : 'Start Learning'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Load More Button */}
        {filteredMovies.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline" className="btn-mobile">
              Load More Movies
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;
