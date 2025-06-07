#!/bin/bash

# add-connection-test.sh
# Script to properly add ConnectionTest component to CineFluent app

echo "🔧 Adding ConnectionTest to CineFluent app..."

# Check if we're in the right directory
if [[ ! -f "src/App.tsx" ]]; then
    echo "❌ Error: Not in the correct directory. Please run from cinefluent-mobile/cinefluent-mobile/"
    exit 1
fi

# Fix main.tsx (remove incorrectly placed ConnectionTest)
echo "📝 Fixing main.tsx..."
cat > src/main.tsx << 'EOF'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
EOF

# Add ConnectionTest to Learn page (main page)
echo "📝 Adding ConnectionTest to Learn page..."
cat > temp_learn.tsx << 'EOF'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Play, Clock, Star, Globe } from "lucide-react";
import { ConnectionTest } from "@/components/ConnectionTest";

const Learn = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample movie data - will be replaced with API data
  const sampleMovies = [
    {
      id: "1",
      title: "Amélie",
      language: "French",
      difficulty: "Beginner",
      duration: "122 min",
      rating: 4.2,
      poster: "https://image.tmdb.org/t/p/w500/nSxDa3M9aMvGVLoItzWTepQ5h5d.jpg"
    },
    {
      id: "2", 
      title: "Roma",
      language: "Spanish",
      difficulty: "Intermediate",
      duration: "135 min",
      rating: 4.6,
      poster: "https://image.tmdb.org/t/p/w500/aPQV4VmhFtA1TgFyPMzCw1d2rSp.jpg"
    }
  ];

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
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleMovies.map((movie) => (
          <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[2/3] relative">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="lg" className="gap-2">
                  <Play className="h-4 w-4" />
                  Start Learning
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{movie.title}</h3>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{movie.language}</Badge>
                  <Badge variant={movie.difficulty === "Beginner" ? "default" : 
                                 movie.difficulty === "Intermediate" ? "secondary" : "destructive"}>
                    {movie.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {movie.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {movie.rating}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Learn;
EOF

# Check if Learn page exists and back it up
if [[ -f "src/pages/Learn.tsx" ]]; then
    echo "📋 Backing up existing Learn.tsx..."
    cp src/pages/Learn.tsx src/pages/Learn.tsx.backup
fi

# Replace Learn page
mv temp_learn.tsx src/pages/Learn.tsx

echo "✅ ConnectionTest successfully added to your app!"
echo ""
echo "🎯 Next steps:"
echo "1. Your React app should still be running at http://localhost:8080/"
echo "2. Make sure your FastAPI is running at http://localhost:8000/"
echo "3. Check your browser - you should see the ConnectionTest component!"
echo ""
echo "🔧 If you need to restore the original Learn page:"
echo "   mv src/pages/Learn.tsx.backup src/pages/Learn.tsx"