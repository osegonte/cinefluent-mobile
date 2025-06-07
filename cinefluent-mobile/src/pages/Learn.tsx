import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Play, Clock, Star, Globe } from "lucide-react";
import { ConnectionTest } from "@/components/ConnectionTest";
import { useMovies, useFeaturedMovies, useSearchMovies } from "@/hooks/useApi";

const Learn = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Use real API data
  const { data: moviesData, isLoading: moviesLoading, error: moviesError } = useMovies();
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedMovies();
  const { data: searchData, isLoading: searchLoading } = useSearchMovies(
    searchQuery, 
    searchQuery.length > 2
  );

  // Determine which movies to display
  const displayMovies = searchQuery.length > 2 
    ? searchData?.movies || []
    : featuredData?.movies || [];

  const isLoading = searchQuery.length > 2 ? searchLoading : (featuredLoading || moviesLoading);

  const handleSearch = () => {
    // Search is handled automatically by the useSearchMovies hook
    console.log("Searching for:", searchQuery);
  };

  const handleStartLearning = (movie: any) => {
    console.log("Starting movie:", movie.title);
    alert(`Starting "${movie.title}" - Movie player coming soon!`);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="mb-6">
          <ConnectionTest />
        </div>
        
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-[2/3] bg-gray-200 animate-pulse"></div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (moviesError) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="mb-6">
          <ConnectionTest />
        </div>
        <Card className="p-8 text-center">
          <div className="text-red-600 mb-4">
            <Globe className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <h3 className="font-medium text-foreground mb-2">Connection Error</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Unable to load movies. Please check your connection.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Connection Status */}
      <div className="mb-6">
        <ConnectionTest />
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Discover Movies to Learn Languages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for movies, languages, or difficulty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayMovies.length > 0 ? (
          displayMovies.map((movie) => (
            <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[2/3] relative">
                <img
                  src={movie.thumbnail_url}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/300x400/6366f1/white?text=${encodeURIComponent(movie.title)}`;
                  }}
                />
                {movie.is_premium && (
                  <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded text-xs">
                    Premium
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="lg" className="gap-2" onClick={() => handleStartLearning(movie)}>
                    <Play className="h-4 w-4" />
                    Start Learning
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{movie.title}</h3>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {movie.languages && movie.languages[0] ? movie.languages[0] : 'Multiple'}
                    </Badge>
                    <Badge variant={
                      movie.difficulty_level === "Beginner" ? "default" : 
                      movie.difficulty_level === "Intermediate" ? "secondary" : "destructive"
                    }>
                      {movie.difficulty_level}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {movie.duration}min
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {movie.vocabulary_count} words
                    </div>
                  </div>
                  {movie.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                      {movie.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No movies found' : 'No movies available'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'Try a different search term' : 'Movies will appear here once loaded'}
            </p>
          </div>
        )}
      </div>

      {/* Show total count if we have data */}
      {(moviesData || featuredData) && (
        <div className="text-center text-sm text-muted-foreground">
          {searchQuery ? (
            `Found ${displayMovies.length} movies matching "${searchQuery}"`
          ) : (
            `Showing ${displayMovies.length} featured movies`
          )}
        </div>
      )}
    </div>
  );
};

export default Learn;