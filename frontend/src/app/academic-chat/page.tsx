// Refactored Chat Page - Clean and Modular

'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { ChatSidebar, ChatArea, ChatInput } from '../../components/Chat';
import { ProtectedRoute } from '../../components/Auth/ProtectedRoute';
import { ThemeToggle } from '../components/ThemeToggle/ThemeToggle';
import { Menu, X } from 'lucide-react';

export default function AcademicChatPage() {
  return (
    <ProtectedRoute>
      <AcademicChatContent />
    </ProtectedRoute>
  );
}

function AcademicChatContent() {
  // Initialize sidebar state based on screen size
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // On initial load, check if we're on mobile
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    // Default to false for SSR
    return false;
  });

  // Handle window resize to auto-open/close sidebar
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      setSidebarOpen(isDesktop);
    };

    // Set initial state after component mounts
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const {
    // State
    chatHistory,
    currentMessage,
    selectedChatId,
    userChats,
    isLoadingChats,
    isLoadingMessages,
    editingChatId,
    newChatTitle,
    chatEndRef,

    // Actions
    setCurrentMessage,
    setNewChatTitle,
    handleNewChat,
    handleSelectChat,
    handleSendMessage,
    handleSaveChatTitle,
    handleEditChatTitle,
    handleCancelEdit,
    handleKeyPress,

    // User data
    user,
  } = useChat();

  // Loading state handled by ProtectedRoute
  const username: string = user?.displayName || user?.email || 'Guest';

  return (
    <div
      className="min-h-screen pt-4 pb-2 px-2 sm:pt-6 sm:pb-4 sm:px-4 lg:pt-8 lg:pb-6 lg:px-6"
      style={{
        backgroundColor: 'var(--page-bg, #e2e8f0)',
      }}
    >
      {/* Theme Toggle - Fixed at top-right of webpage */}
      <div className="fixed top-4 right-4 z-[1001] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200 dark:border-gray-600">
        <ThemeToggle />
      </div>

      <div
        className="flex overflow-hidden relative rounded-3xl chat-window-container border-2 border-gray-200 dark:border-gray-600 shadow-2xl"
        style={{
          backgroundColor: 'var(--chat-container-bg, white)',
          gap: '0px',
        }}
      >
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-2 left-2 sm:top-4 sm:left-4 lg:top-6 lg:left-6 z-[1000] lg:hidden bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Sidebar - Responsive and toggleable */}
        <div
          className={`
          sidebar-container
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:relative z-50 lg:z-auto
          w-80 h-full 
          bg-gradient-to-b from-gray-700 to-gray-600 dark:from-gray-800 dark:to-gray-700
          rounded-none lg:rounded-l-3xl shadow-xl
          transition-transform duration-300 ease-in-out
          lg:flex-shrink-0 overflow-hidden
        `}
          style={{
            background: 'linear-gradient(to bottom, var(--sidebar-bg-start), var(--sidebar-bg-end))',
          }}
        >
          <ChatSidebar
            userChats={userChats}
            selectedChatId={selectedChatId}
            isLoadingChats={isLoadingChats}
            editingChatId={editingChatId}
            newChatTitle={newChatTitle}
            username={username}
            onNewChat={handleNewChat}
            onSelectChat={(chatId) => {
              handleSelectChat(chatId);
              // Close sidebar on mobile after selecting a chat
              if (window.innerWidth < 1024) {
                setSidebarOpen(false);
              }
            }}
            onEditChatTitle={handleEditChatTitle}
            onSaveChatTitle={handleSaveChatTitle}
            onCancelEdit={handleCancelEdit}
            setNewChatTitle={setNewChatTitle}
          />
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          />
        )}

        {/* Main Content Area - Fill remaining space with no gap */}
        <div
          className="flex-1 flex flex-col rounded-none lg:rounded-r-3xl shadow-xl main-content-area"
          style={{
            backgroundColor: 'var(--chat-container-bg, white)',
            height: '100%',
            minHeight: 0, // Important: Allow flex child to shrink
          }}
        >
          {/* Chat Messages - Scrollable area that takes remaining height */}
          <div
            className="flex-1 min-h-0"
            style={{
              backgroundColor: 'var(--chat-container-bg, white)',
            }}
          >
            <ChatArea
              chatHistory={chatHistory}
              isLoadingMessages={isLoadingMessages}
              selectedChatId={selectedChatId}
              username={username}
              userId={user?.uid}
              chatEndRef={chatEndRef}
            />
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="flex-shrink-0">
            <ChatInput
              currentMessage={currentMessage}
              isSignedIn={true}
              onMessageChange={setCurrentMessage}
              onSendMessage={handleSendMessage}
              onKeyPress={handleKeyPress}
              chatHistory={chatHistory}
              selectedChatId={selectedChatId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
