
import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, X, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filters: any) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onFilterChange, 
  placeholder = "Search movies...",
  className 
}) => {
  const [query, setQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState({
    language: '',
    difficulty: '',
    genre: ''
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Mock suggestions data - replace with actual API call
  const recentSearches = ['Toy Story', 'Finding Nemo', 'The Lion King'];
  const popularSearches = ['Spanish Movies', 'Beginner French', 'Comedy'];
  
  const suggestions = query.length > 0 
    ? ['Toy Story', 'Top Gun', 'Titanic'].filter(item => 
        item.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (query.length > 0) {
      const debounceTimer = setTimeout(() => {
        onSearch(query);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [query, onSearch]);

  const handleSearchFocus = () => {
    setIsSearchActive(true);
    setShowSuggestions(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow for suggestion clicks
    setTimeout(() => {
      setIsSearchActive(false);
      setShowSuggestions(false);
    }, 200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Search Input Container */}
      <div className="relative">
        <div className={cn(
          "relative transition-all duration-200",
          isSearchActive && "transform scale-[1.02]"
        )}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
          
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            placeholder={placeholder}
            className={cn(
              "pl-12 pr-20 h-12 rounded-xl bg-surface-alt border-border/50 text-base",
              "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background",
              "transition-all duration-200 placeholder:text-muted-foreground/70"
            )}
          />

          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="h-8 w-8 p-0 hover:bg-muted rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            
            {/* Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 rounded-full relative",
                    activeFiltersCount > 0 && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <Filter className="w-4 h-4" />
                  {activeFiltersCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 w-5 h-5 text-xs p-0 flex items-center justify-center"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Filter Movies</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  {/* Language Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-foreground">Language</h3>
                    <div className="flex flex-wrap gap-2">
                      {['All', 'Spanish', 'French', 'German', 'Italian'].map((lang) => (
                        <Button
                          key={lang}
                          variant={filters.language === lang ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleFilterChange('language', filters.language === lang ? '' : lang)}
                          className="rounded-full"
                        >
                          {lang}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-foreground">Difficulty</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                        <Button
                          key={level}
                          variant={filters.difficulty === level ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleFilterChange('difficulty', filters.difficulty === level ? '' : level)}
                          className="rounded-full"
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Genre Filter */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-foreground">Genre</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Comedy', 'Drama', 'Action', 'Animation', 'Romance'].map((genre) => (
                        <Button
                          key={genre}
                          variant={filters.genre === genre ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleFilterChange('genre', filters.genre === genre ? '' : genre)}
                          className="rounded-full"
                        >
                          {genre}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilters({ language: '', difficulty: '', genre: '' });
                        onFilterChange?.({ language: '', difficulty: '', genre: '' });
                      }}
                      className="w-full"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto bg-background/95 backdrop-blur-sm border shadow-xl">
            <div className="p-4 space-y-4">
              {/* Query Suggestions */}
              {suggestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Suggestions</h4>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              {query.length === 0 && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Popular Searches
                    </h4>
                    <div className="space-y-1">
                      {popularSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(search)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <span className="text-sm">{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Recent Searches</h4>
                      <div className="space-y-1">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(search)}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center justify-between group"
                          >
                            <span className="text-sm">{search}</span>
                            <X className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {Object.entries(filters).map(([key, value]) => 
            value ? (
              <Badge 
                key={key} 
                variant="secondary" 
                className="flex items-center gap-1 pr-1"
              >
                {value}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterChange(key, '')}
                  className="h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
