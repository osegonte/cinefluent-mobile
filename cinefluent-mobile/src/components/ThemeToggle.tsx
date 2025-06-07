
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 focus-ring"
    >
      {theme === "light" ? (
        <Sun className="h-4 w-4 text-foreground" />
      ) : theme === "dark" ? (
        <Moon className="h-4 w-4 text-foreground" />
      ) : (
        <div className="h-4 w-4 rounded-full bg-gradient-to-r from-yellow-400 to-blue-600" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
