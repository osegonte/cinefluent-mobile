
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  Crown, 
  Languages, 
  Bell, 
  Moon, 
  Volume2,
  Download,
  Heart,
  LogOut,
  ChevronRight,
  Search,
  Shield,
  Smartphone,
  Star
} from "lucide-react";

/**
 * Profile Component - User account management and settings
 * 
 * Features:
 * - User profile display with stats
 * - Premium subscription management
 * - Learning preferences and settings
 * - Account management options
 * - Cross-platform mobile optimization
 */
const Profile = () => {
  // User data - will be fetched from backend/Supabase
  const userStats = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    memberSince: "January 2024",
    totalPoints: 1876,
    streak: 23,
    completedMovies: 3,
    wordsLearned: 347,
    studyTime: "32h 15m",
    isPremium: true // Premium status
  };

  // Available languages for learning
  const languages = [
    { name: "Spanish", level: "Intermediate", progress: 65 },
    { name: "French", level: "Beginner", progress: 30 },
    { name: "German", level: "Beginner", progress: 15 }
  ];

  // App settings with premium indicators
  const settings = [
    { icon: Bell, label: "Push Notifications", enabled: true, premium: false },
    { icon: Download, label: "Offline Downloads", enabled: false, premium: true },
    { icon: Volume2, label: "Sound Effects", enabled: true, premium: false },
    { icon: Search, label: "Advanced Search", enabled: true, premium: true },
    { icon: Shield, label: "Ad-free Experience", enabled: true, premium: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your learning journey</p>
        </div>

        {/* User Profile Card */}
        <Card className="mobile-card p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                AJ
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{userStats.name}</h2>
              <p className="text-sm text-muted-foreground">{userStats.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Member since {userStats.memberSince}
              </p>
            </div>
            <Badge 
              variant={userStats.isPremium ? "default" : "secondary"} 
              className="flex items-center gap-1"
            >
              <Crown className="w-3 h-3" />
              {userStats.isPremium ? "Premium" : "Free"}
            </Badge>
          </div>

          {/* Stats Grid - optimized for mobile */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground tabular-nums">{userStats.totalPoints}</div>
              <div className="text-xs text-muted-foreground">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground tabular-nums">{userStats.streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </Card>

        {/* Premium Upgrade Section (if not premium) */}
        {!userStats.isPremium && (
          <Card className="mobile-card p-4 mb-6 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Upgrade to Premium</h3>
                <p className="text-sm text-muted-foreground">Unlock advanced features</p>
              </div>
            </div>
            <Button className="w-full btn-mobile">
              Upgrade Now
            </Button>
          </Card>
        )}

        {/* Learning Statistics */}
        <Card className="mobile-card p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-4">Learning Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Movies Completed</span>
              <span className="font-semibold text-foreground tabular-nums">{userStats.completedMovies}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Words Learned</span>
              <span className="font-semibold text-foreground tabular-nums">{userStats.wordsLearned}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Study Time</span>
              <span className="font-semibold text-foreground tabular-nums">{userStats.studyTime}</span>
            </div>
          </div>
        </Card>

        {/* Language Learning Section */}
        <Card className="mobile-card p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Your Languages
          </h3>
          <div className="space-y-3">
            {languages.map((language, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">{language.name}</div>
                  <div className="text-sm text-muted-foreground">{language.level}</div>
                </div>
                <Badge variant="outline" className="tabular-nums">{language.progress}%</Badge>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 btn-mobile">
            Add New Language
          </Button>
        </Card>

        {/* App Settings */}
        <Card className="mobile-card p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            App Settings
          </h3>
          <div className="space-y-4">
            {settings.map((setting, index) => {
              const Icon = setting.icon;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <span className="text-foreground">{setting.label}</span>
                      {setting.premium && (
                        <Crown className="w-3 h-3 text-primary inline ml-2" />
                      )}
                    </div>
                  </div>
                  <Switch 
                    defaultChecked={setting.enabled} 
                    disabled={setting.premium && !userStats.isPremium}
                  />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Premium Settings (only if premium) */}
        {userStats.isPremium && (
          <Card className="mobile-card p-4 mb-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              Premium Features
            </h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-between btn-mobile">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Manager
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <Button variant="outline" className="w-full justify-between btn-mobile">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy Settings
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Account Management Actions */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-between btn-mobile focus-ring">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Rate CineFluent
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button variant="outline" className="w-full justify-between btn-mobile focus-ring">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Account Settings
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button variant="outline" className="w-full justify-between btn-mobile focus-ring">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              App Preferences
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Sign Out Button */}
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive btn-mobile"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
