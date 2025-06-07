
import { NavLink, useLocation } from "react-router-dom";
import { Film, TrendingUp, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: 'learn', label: 'Learn', icon: Film, path: '/learn' },
  { id: 'progress', label: 'Progress', icon: TrendingUp, path: '/progress' },
  { id: 'community', label: 'Community', icon: Users, path: '/community' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export const NavigationTabs = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50">
      <div className="flex justify-around items-center h-16 px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path || (tab.path === '/learn' && location.pathname === '/');
          const Icon = tab.icon;
          
          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 py-1 px-2 rounded-lg transition-all duration-200",
                isActive 
                  ? "text-primary scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:scale-105"
              )}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 mb-1 transition-all duration-200",
                  isActive && "scale-110"
                )} 
              />
              <span className={cn(
                "text-xs font-medium transition-all duration-200",
                isActive && "font-semibold"
              )}>
                {tab.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
