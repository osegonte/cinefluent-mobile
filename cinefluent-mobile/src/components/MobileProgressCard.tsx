
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flame, Target, Calendar, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileProgressCardProps {
  title: string;
  value: number;
  target?: number;
  unit?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning';
  showProgress?: boolean;
  className?: string;
}

const MobileProgressCard: React.FC<MobileProgressCardProps> = ({
  title,
  value,
  target,
  unit = '',
  icon,
  variant = 'default',
  showProgress = false,
  className
}) => {
  const progressPercentage = target ? (value / target) * 100 : 0;
  
  const variantStyles = {
    default: 'border-border bg-card',
    success: 'border-green-500/20 bg-green-50 dark:bg-green-950/20',
    warning: 'border-orange-500/20 bg-orange-50 dark:bg-orange-950/20'
  };

  const getValueColor = () => {
    if (variant === 'success') return 'text-green-600 dark:text-green-400';
    if (variant === 'warning') return 'text-orange-600 dark:text-orange-400';
    return 'text-foreground';
  };

  return (
    <Card className={cn(
      'mobile-card transition-all duration-200 hover:scale-[1.02]',
      variantStyles[variant],
      className
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            {icon && (
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                variant === 'success' && "bg-green-100 dark:bg-green-900/40",
                variant === 'warning' && "bg-orange-100 dark:bg-orange-900/40",
                variant === 'default' && "bg-primary/10"
              )}>
                {icon}
              </div>
            )}
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
          {target && (
            <Badge variant="outline" className="text-xs">
              Goal: {target}{unit}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Value Display */}
          <div className="flex items-baseline gap-1">
            <span className={cn(
              "text-2xl font-bold tabular-nums",
              getValueColor()
            )}>
              {value.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">{unit}</span>
            {target && (
              <span className="text-sm text-muted-foreground ml-auto">
                / {target.toLocaleString()}{unit}
              </span>
            )}
          </div>

          {/* Progress Bar */}
          {showProgress && target && (
            <div className="space-y-2">
              <Progress 
                value={Math.min(progressPercentage, 100)} 
                className="h-2 bg-muted"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progressPercentage.toFixed(0)}% complete</span>
                <span>{Math.max(0, target - value)} {unit} to go</span>
              </div>
            </div>
          )}

          {/* Achievement Badge */}
          {target && value >= target && (
            <div className="flex items-center gap-2 p-2 bg-success/10 rounded-lg border border-success/20">
              <Trophy className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-success">Goal achieved! 🎉</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Predefined progress card variants for common use cases
export const StreakCard: React.FC<{ streak: number; className?: string }> = ({ 
  streak, 
  className 
}) => (
  <MobileProgressCard
    title="Learning Streak"
    value={streak}
    unit=" days"
    icon={<Flame className="w-4 h-4 text-orange-500" />}
    variant={streak >= 7 ? 'success' : 'default'}
    className={className}
  />
);

export const WeeklyGoalCard: React.FC<{ 
  current: number; 
  target: number; 
  className?: string 
}> = ({ current, target, className }) => (
  <MobileProgressCard
    title="Weekly Goal"
    value={current}
    target={target}
    unit=" min"
    icon={<Target className="w-4 h-4 text-primary" />}
    variant={current >= target ? 'success' : 'default'}
    showProgress={true}
    className={className}
  />
);

export const VocabularyCard: React.FC<{ 
  learned: number; 
  className?: string 
}> = ({ learned, className }) => (
  <MobileProgressCard
    title="Words Learned"
    value={learned}
    unit=" words"
    icon={<Calendar className="w-4 h-4 text-purple-500" />}
    variant="default"
    className={className}
  />
);

export default MobileProgressCard;
