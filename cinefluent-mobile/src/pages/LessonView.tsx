
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  ArrowLeft,
  BookOpen,
  CheckCircle,
  XCircle,
  RotateCcw
} from "lucide-react";

const LessonView = () => {
  const { movieId, sceneId } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const lessonData = {
    title: "Toy Story - Scene 1",
    subtitle: "Woody introduces himself",
    duration: 45,
    currentSubtitle: "¡Hola! Soy Woody, el sheriff de este lugar.",
    translation: "Hello! I'm Woody, the sheriff of this place.",
    vocabulary: [
      { word: "Hola", translation: "Hello", difficulty: "basic" },
      { word: "Soy", translation: "I am", difficulty: "basic" },
      { word: "Sheriff", translation: "Sheriff", difficulty: "intermediate" },
      { word: "Lugar", translation: "Place", difficulty: "basic" },
    ],
    quiz: {
      question: "What does 'sheriff' mean in English?",
      options: ["Teacher", "Sheriff", "Doctor", "Friend"],
      correctAnswer: 1
    }
  };

  const progress = (currentTime / lessonData.duration) * 100;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
  };

  const handleNextLesson = () => {
    navigate('/learn');
  };

  const isCorrectAnswer = selectedAnswer === lessonData.quiz.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/learn')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{lessonData.title}</h1>
            <p className="text-sm text-muted-foreground">{lessonData.subtitle}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Scene Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {!showQuiz ? (
          <>
            {/* Video/Audio Player Placeholder */}
            <Card className="p-6 mb-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8" />
                </div>
                <p className="text-sm opacity-90">Audio visualization</p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <SkipBack className="w-5 h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <SkipForward className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Volume2 className="w-5 h-5" />
                </Button>
              </div>
            </Card>

            {/* Subtitles */}
            <Card className="p-4 mb-6">
              <div className="text-center">
                <p className="text-lg font-medium text-foreground mb-2">
                  {lessonData.currentSubtitle}
                </p>
                <p className="text-sm text-muted-foreground">
                  {lessonData.translation}
                </p>
              </div>
            </Card>

            {/* Vocabulary */}
            <Card className="p-4 mb-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Key Vocabulary
              </h3>
              <div className="space-y-2">
                {lessonData.vocabulary.map((vocab, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div>
                      <span className="font-medium text-foreground">{vocab.word}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        - {vocab.translation}
                      </span>
                    </div>
                    <Badge variant={vocab.difficulty === 'basic' ? 'secondary' : 'outline'}>
                      {vocab.difficulty}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Continue Button */}
            <Button 
              onClick={() => setShowQuiz(true)} 
              className="w-full"
              size="lg"
            >
              Take Quiz
            </Button>
          </>
        ) : (
          // Quiz Section
          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-6 text-center">Quick Quiz</h3>
            
            <div className="mb-6">
              <p className="text-foreground mb-4">{lessonData.quiz.question}</p>
              
              <div className="space-y-3">
                {lessonData.quiz.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      showResult
                        ? index === lessonData.quiz.correctAnswer
                          ? "default"
                          : selectedAnswer === index
                          ? "destructive"
                          : "outline"
                        : selectedAnswer === index
                        ? "default"
                        : "outline"
                    }
                    className="w-full justify-start"
                    onClick={() => !showResult && handleQuizAnswer(index)}
                    disabled={showResult}
                  >
                    <div className="flex items-center gap-2">
                      {showResult && index === lessonData.quiz.correctAnswer && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {showResult && selectedAnswer === index && index !== lessonData.quiz.correctAnswer && (
                        <XCircle className="w-4 h-4" />
                      )}
                      {option}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {showResult && (
              <div className="text-center">
                <div className={`text-lg font-semibold mb-3 ${
                  isCorrectAnswer ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isCorrectAnswer ? '¡Correcto! Well done!' : 'Not quite right. Try again!'}
                </div>
                
                <div className="flex gap-3">
                  {!isCorrectAnswer && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedAnswer(null);
                        setShowResult(false);
                      }}
                      className="flex-1"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  )}
                  <Button onClick={handleNextLesson} className="flex-1">
                    {isCorrectAnswer ? 'Continue Learning' : 'Next Lesson'}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default LessonView;
