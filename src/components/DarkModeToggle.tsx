import { useContext } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button"; // If using ShadCN button
import { ThemeContext } from "../contexts/ThemeProvider";

export function ThemeToggle() {
  const themeCtx = useContext(ThemeContext);
  if (!themeCtx) return null; // Prevent errors

  return (
    <Button variant="ghost" size="icon" onClick={themeCtx.toggleTheme}>
      <Sun className="h-5 w-5 transition-all dark:hidden" />
      <Moon className="h-5 w-5 hidden transition-all dark:block" />
    </Button>
  );
}