
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, Target, Calendar, Star, TrendingUp, BookOpen } from "lucide-react";

const ProgressPage = () => {
  const streakDays = 23;
  const totalWords = 347;
  const weeklyGoal = 5;
  const completedThisWeek = 3;

  // Heatmap data (7 days x 5 weeks)
  const heatmapData = [
    [2, 0, 1, 3, 2, 1, 0],
    [1, 2, 3, 1, 2, 0, 1],
    [3, 1, 2, 2, 1, 3, 2],
    [2, 3, 1, 0, 2, 1, 3],
    [1, 2, 0, 1, 3, 2, 1],
  ];

  const achievements = [
    { title: "First Movie", description: "Complete your first movie", earned: true, icon: Star },
    { title: "Week Warrior", description: "7-day learning streak", earned: true, icon: Flame },
    { title: "Vocab Master", description: "Learn 100 new words", earned: true, icon: BookOpen },
    { title: "Monthly Goal", description: "Complete monthly target", earned: false, icon: Target },
  ];

  const getHeatmapColor = (value: number) => {
    if (value === 0) return "bg-muted/50";
    if (value === 1) return "bg-success/30 dark:bg-success/40";
    if (value === 2) return "bg-success/60 dark:bg-success/60";
    if (value === 3) return "bg-success dark:bg-success/80";
    return "bg-success dark:bg-success";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-background to-blue-50/50 dark:from-gray-950 dark:via-background dark:to-green-950/50">
      <div className="container mx-auto px-4 py-6 max-w-md pb-24">
        {/* Enhanced Header */}
        <div className="mb-8">
          <h1 className="text-headline text-foreground mb-2">Your Progress</h1>
          <p className="text-body">Track your learning journey</p>
        </div>

        {/* Enhanced Stats Overview with Better Hierarchy */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="mobile-card text-center p-6">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-warning/20 rounded-full">
                <Flame className="w-6 h-6 text-warning" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1 tabular-nums">{streakDays}</div>
            <div className="text-caption">Day Streak</div>
          </Card>

          <Card className="mobile-card text-center p-6">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-primary/20 rounded-full">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1 tabular-nums">{totalWords}</div>
            <div className="text-caption">Words Learned</div>
          </Card>
        </div>

        {/* Enhanced Weekly Goal */}
        <Card className="mobile-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-title text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Weekly Goal
            </h3>
            <Badge variant={completedThisWeek >= weeklyGoal ? "default" : "secondary"} className="text-sm">
              {completedThisWeek}/{weeklyGoal}
            </Badge>
          </div>
          <div className="progress-enhanced mb-3">
            <div 
              className="progress-fill" 
              style={{ width: `${(completedThisWeek / weeklyGoal) * 100}%` }}
            />
          </div>
          <p className="text-body">
            {weeklyGoal - completedThisWeek > 0 
              ? `${weeklyGoal - completedThisWeek} more lessons to reach your goal`
              : "🎉 Goal achieved! Keep the momentum going!"
            }
          </p>
        </Card>

        {/* Enhanced Learning Heatmap */}
        <Card className="mobile-card p-6 mb-8">
          <h3 className="text-title text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Learning Activity
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={day} className="text-caption text-center p-1 font-medium">
                {day}
              </div>
            ))}
            {heatmapData.flat().map((value, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-md ${getHeatmapColor(value)} border border-border/50 transition-all duration-200 hover:scale-110`}
                title={`${value} lessons completed`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 text-caption">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted/50" />
              <div className="w-3 h-3 rounded-sm bg-success/30" />
              <div className="w-3 h-3 rounded-sm bg-success/60" />
              <div className="w-3 h-3 rounded-sm bg-success" />
            </div>
            <span>More</span>
          </div>
        </Card>

        {/* Enhanced Achievements */}
        <Card className="mobile-card p-6 mb-8">
          <h3 className="text-title text-foreground mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Achievements
          </h3>
          <div className="space-y-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                    achievement.earned
                      ? "bg-primary/10 border-2 border-primary/20 shadow-sm"
                      : "bg-surface-alt border border-border/50"
                  }`}
                >
                  <div
                    className={`p-3 rounded-full transition-all duration-200 ${
                      achievement.earned
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground mb-1">{achievement.title}</div>
                    <div className="text-body">{achievement.description}</div>
                  </div>
                  {achievement.earned && (
                    <Badge variant="default" className="text-xs animate-bounce-subtle">
                      ✨ Earned
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Enhanced Study Stats */}
        <Card className="mobile-card p-6">
          <h3 className="text-title text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            This Month
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
              <span className="text-body">Lessons Completed</span>
              <span className="font-bold text-foreground tabular-nums">24</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
              <span className="text-body">Study Time</span>
              <span className="font-bold text-foreground tabular-nums">8h 32m</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
              <span className="text-body">New Words</span>
              <span className="font-bold text-success tabular-nums">127</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-body">Accuracy</span>
              <span className="font-bold text-primary tabular-nums">87%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;
