// src/pages/LessonView.tsx - Updated with Interactive Subtitles
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InteractiveSubtitles, useVocabularyProgress } from "@/components/InteractiveSubtitles";
import { 
  ArrowLeft,
  BookOpen,
  Trophy,
  Target,
  BarChart3,
  Upload,
  FileText
} from "lucide-react";

const LessonView = () => {
  const { movieId, sceneId } = useParams();
  const navigate = useNavigate();
  const [currentProgress, setCurrentProgress] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("es"); // Spanish default
  const [movieData, setMovieData] = useState<any>(null);
  const [showUpload, setShowUpload] = useState(false);
  
  const { vocabulary, stats, loading, loadProgress } = useVocabularyProgress();

  useEffect(() => {
    loadMovieData();
    loadProgress(selectedLanguage);
  }, [movieId, selectedLanguage]);

  const loadMovieData = async () => {
    try {
      const response = await fetch(`/api/v1/movies/${movieId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMovieData(data.movie);
      }
    } catch (error) {
      console.error('Failed to load movie data:', error);
    }
  };

  const handleProgressUpdate = (currentTime: number) => {
    setCurrentProgress(currentTime);
    
    // Update user progress in backend (debounced)
    // This could be optimized with a debounce hook
  };

  const handleUploadSubtitles = async (file: File) => {
    if (!file || !movieId) return;

    try {
      // Convert file to base64
      const fileContent = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]); // Remove data:... prefix
        };
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/v1/subtitles/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          movie_id: movieId,
          language: selectedLanguage,
          subtitle_type: file.name.endsWith('.vtt') ? 'vtt' : 'srt',
          file_content: fileContent,
        }),
      });

      if (response.ok) {
        alert('Subtitles uploaded successfully!');
        setShowUpload(false);
        // Refresh the lesson view
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.detail}`);
      }
    } catch (error) {
      console.error('Failed to upload subtitles:', error);
      alert('Upload failed. Please try again.');
    }
  };

  if (!movieData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/learn')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{movieData.title}</h1>
            <p className="text-sm text-muted-foreground">Interactive Language Learning</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowUpload(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Subtitles
          </Button>
        </div>

        {/* Language Selection */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Learning Language
            </h3>
          </div>
          <div className="flex gap-2">
            {['es', 'fr', 'de', 'it'].map((lang) => (
              <Button
                key={lang}
                variant={selectedLanguage === lang ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang.toUpperCase()}
              </Button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Learning Area */}
          <div className="lg:col-span-2 space-y-6">
            <InteractiveSubtitles
              movieId={movieId!}
              language={selectedLanguage}
              onProgress={handleProgressUpdate}
            />
          </div>

          {/* Sidebar - Progress & Stats */}
          <div className="space-y-6">
            {/* Session Progress */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Session Progress
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Time Watched</span>
                  <span className="font-mono">{Math.floor(currentProgress / 60)}:{(currentProgress % 60).toFixed(0).padStart(2, '0')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Words Encountered</span>
                  <span className="font-mono">-</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>New Vocabulary</span>
                  <span className="font-mono">-</span>
                </div>
              </div>
            </Card>

            {/* Vocabulary Stats */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                Vocabulary Progress
              </h3>
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Total Words</span>
                    <span className="font-mono">{stats.total_words}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mastered</span>
                    <span className="font-mono text-green-600">{stats.mastered_words}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span className="font-mono">{stats.average_accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(stats.mastered_words / Math.max(stats.total_words, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Recent Vocabulary */}
            {vocabulary.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Recent Words
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {vocabulary.slice(0, 10).map((word: any, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                      <span className="font-medium">{word.word}</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={word.mastery_level >= 4 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {word.mastery_level}/5
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {word.accuracy}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-6 w-full max-w-md mx-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Upload Subtitle File
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select SRT or VTT file
                  </label>
                  <input
                    type="file"
                    accept=".srt,.vtt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleUploadSubtitles(file);
                      }
                    }}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Supported formats: .srt, .vtt<br/>
                  Max file size: 5MB
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowUpload(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonView;
