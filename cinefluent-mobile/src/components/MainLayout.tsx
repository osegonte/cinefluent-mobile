
import { Outlet } from "react-router-dom";
import { NavigationTabs } from "./NavigationTabs";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";

const MainLayout = () => {
  const isMobile = useIsMobile();

  return (
    <ThemeProvider defaultTheme="system" storageKey="cinefluent-theme">
      <div className="min-h-screen bg-background flex flex-col transition-colors duration-300 overflow-x-hidden">
        {/* Theme toggle - positioned for mobile accessibility */}
        <div className={`fixed top-4 ${isMobile ? 'right-4' : 'right-6'} z-50`}>
          <ThemeToggle />
        </div>
        
        {/* Main content with mobile-optimized spacing */}
        <main className={`flex-1 ${isMobile ? 'pb-20' : 'pb-24'} ${isMobile ? 'px-4' : 'px-6'}`}>
          <div className="max-w-md mx-auto w-full">
            <Outlet />
          </div>
        </main>
        
        {/* Enhanced navigation tabs with better mobile UX */}
        <NavigationTabs />
        
        {/* Safe area handling for iOS devices */}
        <div className="h-safe-area-inset-bottom bg-background" />
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;
