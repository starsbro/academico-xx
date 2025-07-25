'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Check current DOM state first
    const currentlyDark = document.documentElement.classList.contains('dark');

    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let shouldBeDark;
    if (savedTheme) {
      shouldBeDark = savedTheme === 'dark';
    } else {
      shouldBeDark = systemPrefersDark;
    }

    console.log('ThemeToggle initialization:', {
      currentlyDark,
      savedTheme,
      systemPrefersDark,
      shouldBeDark,
      windowWidth: window.innerWidth,
    });

    // Sync the state with DOM
    setIsDark(shouldBeDark);

    if (shouldBeDark && !currentlyDark) {
      document.documentElement.classList.add('dark');
    } else if (!shouldBeDark && currentlyDark) {
      document.documentElement.classList.remove('dark');
    }

    // Listen for window resize events that might affect theme
    const handleResize = () => {
      const nowDark = document.documentElement.classList.contains('dark');
      // console.log('Window resize detected:', {
      //   width: window.innerWidth,
      //   height: window.innerHeight,
      //   isDarkClass: nowDark,
      //   isDarkState: isDark,
      // });

      // Force sync if they're out of sync
      if (nowDark !== isDark) {
        // console.log('Theme sync mismatch detected, forcing sync');
        setIsDark(nowDark);
      }
    };

    window.addEventListener('resize', handleResize);

    // Listen for manual changes to the document class (debugging)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const nowDark = document.documentElement.classList.contains('dark');
          console.log('DOM class mutation detected:', {
            nowDark,
            previousState: isDark,
            windowWidth: window.innerWidth,
          });
          setIsDark(nowDark);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove isDark from dependency array to prevent infinite loop

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    // Debug logging
    console.log('Theme toggle clicked:', {
      from: isDark ? 'dark' : 'light',
      to: newIsDark ? 'dark' : 'light',
      currentDOMClass: document.documentElement.classList.contains('dark'),
    });

    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log('Added dark class to DOM');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log('Removed dark class from DOM');
    }
  };

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="bg-white/70 border border-white/20 rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-md shadow-lg">
        <div className="w-6 h-6" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-white/10 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 ease-out backdrop-blur-md shadow-lg hover:scale-110 hover:shadow-xl"
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
