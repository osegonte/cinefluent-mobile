// src/components/InteractiveSubtitles.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  BookOpen,
  Star,
  Check,
  X
} from 'lucide-react';

interface SubtitleWord {
  word: string;
  original_form: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  position: number;
}

interface SubtitleSegment {
  id: string;
  start_time: number;
  end_time: number;
  text: string;
  words: SubtitleWord[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
}

interface WordDefinition {
  word: string;
  definition: string;
  pronunciation?: string;
  part_of_speech?: string;
  example_sentence?: string;
  difficulty_level: string;
}

interface InteractiveSubtitlesProps {
  movieId: string;
  language: string;
  onProgress?: (currentTime: number) => void;
}

export function InteractiveSubtitles({ movieId, language, onProgress }: InteractiveSubtitlesProps) {
  // State management
  const [subtitles, setSubtitles] = useState<SubtitleSegment[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordDefinition, setWordDefinition] = useState<WordDefinition | null>(null);
  const [loadingDefinition, setLoadingDefinition] = useState(false);
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const timeUpdateInterval = useRef<NodeJS.Timeout>();

  // Get current subtitle segment
  const currentSegment = subtitles.find(
    segment => currentTime >= segment.start_time && currentTime <= segment.end_time
  );

  // Load subtitles on component mount
  useEffect(() => {
    loadSubtitles();
  }, [movieId, language]);

  // Time update handler
  useEffect(() => {
    if (isPlaying) {
      timeUpdateInterval.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 0.1;
          onProgress?.(newTime);
          return newTime;
        });
      }, 100);
    } else {
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
      }
    }

    return () => {
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
      }
    };
  }, [isPlaying, onProgress]);

  const loadSubtitles = async () => {
    try {
      const response = await fetch(`/api/v1/movies/${movieId}/subtitles?language=${language}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.subtitles && data.subtitles.length > 0) {
          setSubtitles(data.subtitles[0].segments);
        }
      }
    } catch (error) {
      console.error('Failed to load subtitles:', error);
    }
  };

  const handleWordClick = async (word: SubtitleWord) => {
    if (selectedWord === word.word) {
      setSelectedWord(null);
      setWordDefinition(null);
      return;
    }

    setSelectedWord(word.word);
    setLoadingDefinition(true);
    setWordDefinition(null);

    try {
      const response = await fetch(`/api/v1/vocabulary/lookup/${encodeURIComponent(word.word)}?language=${language}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const definition = await response.json();
        setWordDefinition(definition);
      }
    } catch (error) {
      console.error('Failed to fetch word definition:', error);
    } finally {
      setLoadingDefinition(false);
    }
  };

  const handleWordPractice = async (correct: boolean) => {
    if (!wordDefinition || !selectedWord) return;

    try {
      const response = await fetch(`/api/v1/vocabulary/practice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          word_id: selectedWord, // You might need to store word IDs differently
          correct,
        }),
      });

      if (response.ok) {
        if (correct) {
          setLearnedWords(prev => new Set([...prev, selectedWord]));
        }
        setSelectedWord(null);
        setWordDefinition(null);
      }
    } catch (error) {
      console.error('Failed to record practice:', error);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const skipTime = (seconds: number) => {
    setCurrentTime(prev => Math.max(0, prev + seconds));
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-600 bg-green-100 border-green-300';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'advanced': return 'text-red-600 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const renderInteractiveText = (segment: SubtitleSegment) => {
    if (!segment.words || segment.words.length === 0) {
      return <span className="text-lg">{segment.text}</span>;
    }

    let lastPosition = 0;
    const elements: JSX.Element[] = [];

    segment.words.forEach((word, index) => {
      // Add text before the word
      if (word.position > lastPosition) {
        const beforeText = segment.text.slice(lastPosition, word.position);
        elements.push(
          <span key={`before-${index}`} className="text-lg">
            {beforeText}
          </span>
        );
      }

      // Add the interactive word
      const isSelected = selectedWord === word.word;
      const isLearned = learnedWords.has(word.word);
      
      elements.push(
        <button
          key={`word-${index}`}
          onClick={() => handleWordClick(word)}
          className={`
            relative inline-block px-1 py-0.5 mx-0.5 rounded text-lg font-medium
            transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary
            ${isSelected 
              ? 'bg-primary text-primary-foreground shadow-md' 
              : `${getDifficultyColor(word.difficulty_level)} hover:shadow-sm`
            }
            ${isLearned ? 'ring-2 ring-green-400' : ''}
          `}
        >
          {word.original_form}
          {isLearned && (
            <Star className="absolute -top-1 -right-1 w-3 h-3 text-green-500 fill-green-500" />
          )}
        </button>
      );

      lastPosition = word.position + word.word.length;
    });

    // Add remaining text
    if (lastPosition < segment.text.length) {
      const remainingText = segment.text.slice(lastPosition);
      elements.push(
        <span key="remaining" className="text-lg">
          {remainingText}
        </span>
      );
    }

    return <div className="leading-relaxed">{elements}</div>;
  };

  return (
    <div className="space-y-4">
      {/* Video/Audio Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => skipTime(-10)}
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            size="lg"
            onClick={togglePlayPause}
            className="w-16 h-16 rounded-full"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => skipTime(10)}
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-100"
            style={{ 
              width: subtitles.length > 0 
                ? `${(currentTime / Math.max(...subtitles.map(s => s.end_time))) * 100}%` 
                : '0%' 
            }}
          />
        </div>

        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}</span>
          <span>
            {subtitles.length > 0 
              ? `${Math.floor(Math.max(...subtitles.map(s => s.end_time)) / 60)}:${(Math.max(...subtitles.map(s => s.end_time)) % 60).toFixed(0).padStart(2, '0')}`
              : '0:00'
            }
          </span>
        </div>
      </Card>

      {/* Interactive Subtitle Display */}
      <Card className="p-6 min-h-[120px]">
        {currentSegment ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={getDifficultyColor(currentSegment.difficulty_level)}>
                {currentSegment.difficulty_level}
              </Badge>
              <div className="text-sm text-muted-foreground">
                {Math.floor(currentSegment.start_time)}s - {Math.floor(currentSegment.end_time)}s
              </div>
            </div>
            
            <div className="text-center">
              {renderInteractiveText(currentSegment)}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-20 text-muted-foreground">
            <BookOpen className="w-6 h-6 mr-2" />
            <span>No subtitle at current time</span>
          </div>
        )}
      </Card>

      {/* Word Definition Panel */}
      {selectedWord && (
        <Card className="p-4 border-primary/50 bg-primary/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-primary">
              {selectedWord}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedWord(null);
                setWordDefinition(null);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {loadingDefinition ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">Loading definition...</span>
            </div>
          ) : wordDefinition ? (
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Definition</div>
                <div className="text-base">{wordDefinition.definition}</div>
              </div>

              {wordDefinition.pronunciation && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Pronunciation</div>
                  <div className="text-base font-mono">{wordDefinition.pronunciation}</div>
                </div>
              )}

              {wordDefinition.part_of_speech && (
                <div>
                  <Badge variant="secondary">{wordDefinition.part_of_speech}</Badge>
                </div>
              )}

              {wordDefinition.example_sentence && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Example</div>
                  <div className="text-sm italic text-muted-foreground">
                    "{wordDefinition.example_sentence}"
                  </div>
                </div>
              )}

              {/* Practice Buttons */}
              <div className="flex gap-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleWordPractice(false)}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Still Learning
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleWordPractice(true)}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Got It!
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Failed to load definition
            </div>
          )}
        </Card>
      )}

      {/* Learning Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">Words Learned</span>
          </div>
          <Badge variant="default">
            {learnedWords.size}
          </Badge>
        </div>
        
        {learnedWords.size > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {Array.from(learnedWords).map((word) => (
              <Badge key={word} variant="secondary" className="text-xs">
                {word}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Hidden audio element for actual playback */}
      <audio
        ref={audioRef}
        className="hidden"
        muted={isMuted}
        onTimeUpdate={(e) => {
          const audio = e.target as HTMLAudioElement;
          setCurrentTime(audio.currentTime);
        }}
      />
    </div>
  );
}

// Vocabulary Progress Hook
export function useVocabularyProgress() {
  const [vocabulary, setVocabulary] = useState([]);
  const [stats, setStats] = useState({
    total_words: 0,
    mastered_words: 0,
    average_accuracy: 0
  });
  const [loading, setLoading] = useState(false);

  const loadProgress = async (language?: string) => {
    setLoading(true);
    try {
      const url = language 
        ? `/api/v1/vocabulary/progress?language=${language}`
        : '/api/v1/vocabulary/progress';
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVocabulary(data.vocabulary);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load vocabulary progress:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    vocabulary,
    stats,
    loading,
    loadProgress,
    refresh: loadProgress
  };
}