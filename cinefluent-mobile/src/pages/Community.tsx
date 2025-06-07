import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, Crown, Medal, Award, Heart, Flame } from "lucide-react";

const Community = () => {
  const [newMessage, setNewMessage] = useState("");

  const leaderboard = [
    { rank: 1, name: "Sarah Chen", points: 2847, streak: 45, avatar: "SC", badge: "crown" },
    { rank: 2, name: "Miguel Rodriguez", points: 2654, streak: 32, avatar: "MR", badge: "medal" },
    { rank: 3, name: "Emma Thompson", points: 2431, streak: 28, avatar: "ET", badge: "award" },
    { rank: 4, name: "You", points: 1876, streak: 23, avatar: "YU", isCurrentUser: true },
    { rank: 5, name: "Akira Tanaka", points: 1654, streak: 19, avatar: "AT" },
  ];

  const messages = [
    {
      id: 1,
      user: "Sarah Chen",
      avatar: "SC",
      message: "Just finished Toy Story in Spanish! The vocabulary was perfect for beginners 🎬",
      time: "2m ago",
      likes: 12
    },
    {
      id: 2,
      user: "Miguel Rodriguez", 
      avatar: "MR",
      message: "Does anyone know where I can watch Finding Nemo with French subtitles?",
      time: "15m ago",
      likes: 5
    },
    {
      id: 3,
      user: "Emma Thompson",
      avatar: "ET", 
      message: "Tip: Use the 'Export to Anki' feature after each lesson. It's been a game changer for retention! 📚",
      time: "1h ago",
      likes: 23
    },
    {
      id: 4,
      user: "Akira Tanaka",
      avatar: "AT",
      message: "45-day streak achieved! This app makes learning so addictive 🔥",
      time: "2h ago", 
      likes: 18
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "crown": return <Crown className="w-4 h-4 text-warning" />;
      case "medal": return <Medal className="w-4 h-4 text-muted-foreground" />;
      case "award": return <Award className="w-4 h-4 text-warning/80" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-background to-pink-50/50 dark:from-gray-950 dark:via-background dark:to-purple-950/50">
      <div className="container mx-auto px-4 py-6 max-w-md pb-24">
        {/* Enhanced Header */}
        <div className="mb-8">
          <h1 className="text-headline text-foreground mb-2">Community</h1>
          <p className="text-body">Connect with fellow learners</p>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-surface-alt">
            <TabsTrigger value="chat" className="flex items-center gap-2 btn-mobile">
              <MessageCircle className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2 btn-mobile">
              <Crown className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            {/* Enhanced Messages */}
            <div className="space-y-4 mb-6">
              {messages.map((message) => (
                <Card key={message.id} className="mobile-card">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12 shadow-md">
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {message.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-foreground">{message.user}</span>
                          <span className="text-caption flex-shrink-0">{message.time}</span>
                        </div>
                        <p className="text-body mb-3 leading-relaxed">{message.message}</p>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 px-3 text-caption hover:text-foreground transition-colors">
                            <Heart className="w-4 h-4 mr-1" />
                            {message.likes}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Enhanced Message Input */}
            <Card className="mobile-card">
              <div className="p-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="Share your progress or ask for help..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-surface-alt border-border/50 focus:border-primary"
                  />
                  <Button onClick={handleSendMessage} size="sm" className="btn-mobile px-4">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            {leaderboard.map((user) => (
              <Card 
                key={user.rank} 
                className={`mobile-card ${user.isCurrentUser ? 'ring-2 ring-primary/50 bg-primary/5 shadow-lg' : ''}`}
              >
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 text-white font-bold shadow-md">
                      {user.rank}
                    </div>
                    
                    <Avatar className="w-14 h-14 shadow-md">
                      <AvatarFallback className={user.isCurrentUser ? "bg-primary text-primary-foreground text-lg font-bold" : "bg-secondary text-lg font-bold"}>
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`font-bold truncate ${user.isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                          {user.name}
                        </span>
                        {user.badge && getBadgeIcon(user.badge)}
                        {user.isCurrentUser && (
                          <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30">You</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-body">
                        <span className="font-semibold tabular-nums">{user.points.toLocaleString()} pts</span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-warning" />
                          {user.streak} days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <Card className="mobile-card text-center">
              <div className="p-6">
                <p className="text-body mb-4">
                  Keep learning to climb the leaderboard! 🚀
                </p>
                <Button variant="outline" size="sm" className="btn-mobile">
                  View Full Rankings
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Community;
