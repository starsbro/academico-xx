// Refactored Chat Page - Clean and Modular

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { ChatSidebar, ChatArea, PdfChatUpload } from '../../components/Chat';
import { ProtectedRoute } from '../../components/Auth/ProtectedRoute';
import { ThemeToggle } from '../components/ThemeToggle/ThemeToggle';
import { Menu, X } from 'lucide-react';
import GetIdTokenButton from '../components/GetIdTokenButton';

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
    selectedChatId,
    userChats,
    isLoadingChats,
    isLoadingMessages,
    editingChatId,
    newChatTitle,
    chatEndRef,

    // Actions
    setNewChatTitle,
    handleNewChat,
    handleSelectChat,
    handleSaveChatTitle,
    handleEditChatTitle,
    handleCancelEdit,
    fetchMessagesForChat,

    // User data
    user,
  } = useChat();

  // Local state for AI thinking placeholder
  const [aiThinkingMessage, setAiThinkingMessage] = useState<null | { userId: string; message: string }>(null);

  // Ref for chat container (for scroll-to-latest)
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Loading state handled by ProtectedRoute
  const username: string = user?.displayName || user?.email || 'Guest';

  // Removed unused pdfResponse state

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

      {/* Center the chat window */}
      <div className="flex justify-center items-center w-full min-h-[80vh]">
        <div
          className="flex overflow-hidden relative rounded-3xl chat-window-container border-2 border-gray-200 dark:border-gray-600 shadow-2xl w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-8 lg:px-12 xl:px-20 2xl:px-32 gap-x-0 lg:gap-x-8 xl:gap-x-12"
          style={{
            backgroundColor: 'var(--chat-container-bg, white)',
            paddingRight: '1.5rem',
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
            <GetIdTokenButton />
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
              {/* Chat messages container with ref for scroll-to-latest */}
              <div
                ref={chatContainerRef}
                className="chat-messages-container h-full overflow-y-auto pr-2"
                style={{ maxHeight: '80vh' }}
              >
                <ChatArea
                  chatHistory={
                    aiThinkingMessage && !isLoadingMessages
                      ? [
                          ...chatHistory,
                          {
                            ...aiThinkingMessage,
                            id: 'ai-thinking',
                            userId: 'ai',
                            timestamp: new Date().toISOString(),
                          },
                        ]
                      : chatHistory
                  }
                  isLoadingMessages={isLoadingMessages}
                  selectedChatId={selectedChatId}
                  username={username}
                  userId={user?.uid}
                  chatEndRef={chatEndRef}
                />
              </div>
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="flex-shrink-0">
              <PdfChatUpload
                onSubmitPdfChat={async ({ message, file }) => {
                  if (!user?.uid) return;
                  if (!message.trim()) return;
                  setAiThinkingMessage({ userId: 'ai', message: 'Thinking...' });

                  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-with-pdf`;
                  const idToken = await (await import('../../utils/getIdToken')).getIdToken();
                  const headers = idToken ? { Authorization: `Bearer ${idToken}` } : {};

                  let response;
                  if (file) {
                    // Send as FormData if file is present
                    const formData = new FormData();
                    formData.append('message', message);
                    formData.append('pdf', file);
                    if (selectedChatId) formData.append('chatId', selectedChatId);

                    response = await fetch(apiUrl, {
                      method: 'POST',
                      body: formData,
                      ...(idToken ? { headers: { Authorization: `Bearer ${idToken}` } } : {}),
                      // headers, // Do NOT set Content-Type here!
                    });
                  } else {
                    // Send as JSON if no file
                    response = await fetch(apiUrl, {
                      method: 'POST',
                      headers: {
                        ...headers,
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        message,
                        ...(selectedChatId ? { chatId: selectedChatId } : {}),
                      }),
                    });
                  }

                  if (!response.ok) {
                    const error = await response.text();
                    setAiThinkingMessage({ userId: 'ai', message: `Upload failed: ${error}` });
                    setTimeout(() => setAiThinkingMessage(null), 4000);
                  }
                  if (selectedChatId) {
                    setTimeout(async () => {
                      await fetchMessagesForChat(selectedChatId);
                      setAiThinkingMessage(null);
                    }, 700);
                  } else {
                    setAiThinkingMessage(null);
                  }
                }}
                chatContainerRef={chatContainerRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
