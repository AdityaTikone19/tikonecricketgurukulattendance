"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-md border ${currentTheme === "light" ? "bg-gray-200 dark:bg-gray-700" : ""}`}
        title="Light Mode"
      >
        <Sun className="h-5 w-5" />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-md border ${currentTheme === "dark" ? "bg-gray-200 dark:bg-gray-700" : ""}`}
        title="Dark Mode"
      >
        <Moon className="h-5 w-5" />
      </button>

      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-md border ${theme === "system" ? "bg-gray-200 dark:bg-gray-700" : ""}`}
        title="System Theme"
      >
        <Monitor className="h-5 w-5" />
      </button>
    </div>
  );
}