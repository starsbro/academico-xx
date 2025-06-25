'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if user has a theme preference
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-white/10 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 ease-out backdrop-blur-md shadow-lg hover:scale-110 hover:shadow-xl z-50"
      aria-label="Toggle theme"
    >
      <div className="w-6 h-6 flex items-center justify-center">
        <svg
          className={`w-full h-full text-indigo-500 dark:text-violet-400 transition-all duration-200 ${
            isDark ? 'rotate-180' : 'rotate-0'
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-testid={isDark ? 'moon-icon' : 'sun-icon'}
        >
          {isDark ? (
            // Moon icon
            <>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </>
          ) : (
            // Sun icon
            <>
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </>
          )}
        </svg>
      </div>
    </button>
  );
}
