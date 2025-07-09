"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function AppearanceSection() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Appearance</h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <span className="text-sm font-medium">Theme</span>
          <select
            value={theme === "system" ? resolvedTheme : theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white px-3 py-2 rounded w-full sm:w-auto"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Choose how the dashboard looks. System will follow your OS preference.
        </p>
      </div>
    </div>
  );
}