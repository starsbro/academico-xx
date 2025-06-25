'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

interface UserButtonProps {
  className?: string;
}

export const UserButton: React.FC<UserButtonProps> = ({ className = '' }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8, // 8px below the button
        left: rect.right - 288, // 288px is the width of dropdown (w-72), align right edge
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef} style={{ zIndex: 1000 }}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        {user.photoURL ? (
          <Image src={user.photoURL} alt="Profile" width={32} height={32} className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
            {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
          </div>
        )}
        <svg
          className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          style={{
            zIndex: 9999,
            top: `${dropdownPosition.top}px`,
            left: `${Math.max(16, dropdownPosition.left)}px`, // Ensure it doesn't go off-screen
          }}
        >
          <div
            className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
            style={{ padding: '1.5rem' }}
          >
            <div className="flex items-center space-x-4">
              {user.photoURL ? (
                <Image src={user.photoURL} alt="Profile" width={48} height={48} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-lg">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0" style={{ gap: '6px', display: 'flex', flexDirection: 'column' }}>
                <div className="font-semibold text-gray-900 dark:text-white truncate text-base">
                  {user.displayName || 'User'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 truncate">{user.email}</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800" style={{ padding: '1rem 0' }}>
            <Link
              href="/dashboard"
              className="flex items-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg"
              style={{ padding: '0.875rem 1.25rem', margin: '0 0.75rem 0.5rem 0.75rem' }}
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                style={{ marginRight: '0.875rem' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5a2 2 0 012-2h2a2 2 0 012 2v2H8V5z"
                />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium">Dashboard</span>
            </Link>

            <div style={{ borderTop: '1px solid rgb(229 231 235)', margin: '0.5rem 0.75rem', paddingTop: '0.5rem' }}>
              <button
                onClick={handleSignOut}
                className="flex items-center w-full text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg"
                style={{ padding: '0.875rem 1.25rem', margin: '0 0' }}
              >
                <svg
                  className="w-5 h-5 text-red-500 dark:text-red-400"
                  style={{ marginRight: '0.875rem' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="text-red-600 dark:text-red-400 font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserButton;
