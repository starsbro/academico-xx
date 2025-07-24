// Refactored Chat Page - Clean and Modular
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { ChatSidebar, ChatArea, PdfChatUpload } from '../../components/Chat';
import { ProtectedRoute } from '../../components/Auth/ProtectedRoute';
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle';
import { Menu, X } from 'lucide-react';
import { getBackendUrl } from '../../lib/env-config';
// import GetIdTokenButton from '../components/GetIdTokenButton';

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
    addMessageToChat,
    clearOptimisticMessages,
    setNewChatTitle,
    handleNewChat,
    handleSelectChat,
    handleSaveChatTitle,
    handleEditChatTitle,
    handleCancelEdit,
    fetchMessagesForChat,
    handleDeleteChat,

    // User data
    user,
  } = useChat();

  // Local state for AI thinking placeholder
  const [aiThinkingMessage, setAiThinkingMessage] = useState<null | { userId: string; message: string }>(null);

  // Ref for chat container (for scroll-to-latest)
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when chat changes, using chatEndRef for accuracy
  const prevChatId = useRef<string | null>(null);
  useEffect(() => {
    if (chatEndRef && chatEndRef.current) {
      if (selectedChatId !== prevChatId.current) {
        // Use setTimeout to ensure DOM is fully rendered before jumping for long chats
        setTimeout(() => {
          chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
        }, 0);
      } else {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
    prevChatId.current = selectedChatId;
  }, [chatHistory, aiThinkingMessage, selectedChatId, chatEndRef]);

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
              onDeleteChat={handleDeleteChat}
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

                  const requestStartTime = Date.now();
                  console.log(`[CHAT-REQUEST] Starting chat request at ${new Date().toISOString()}`);

                  // Clear any existing optimistic state first
                  setAiThinkingMessage(null);

                  // Optimistically add user's prompt
                  addMessageToChat({
                    userId: user.uid,
                    message,
                  });
                  setAiThinkingMessage({ userId: 'ai', message: 'Thinking...' });

                  const apiUrl = `${getBackendUrl()}/chat-with-pdf`;
                  const idToken = await (await import('../../utils/getIdToken')).getIdToken();
                  const headers: Record<string, string> = idToken ? { Authorization: `Bearer ${idToken}` } : {};

                  let response, data;
                  try {
                    // Create AbortController for timeout
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => {
                      console.log('[CHAT-TIMEOUT] Request timeout after 120 seconds');
                      controller.abort();
                    }, 120000); // 2 minutes timeout

                    if (file) {
                      // Send as FormData if file is present
                      const formData = new FormData();
                      formData.append('message', message);
                      formData.append('pdf', file, file.name);
                      // Only append chatId if continuing an existing chat
                      if (selectedChatId) formData.append('chatId', selectedChatId);

                      response = await fetch(apiUrl, {
                        method: 'POST',
                        body: formData,
                        signal: controller.signal,
                        ...(idToken ? { headers: { Authorization: `Bearer ${idToken}` } } : {}),
                      });
                    } else {
                      // Send as JSON if no file
                      response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                          ...headers,
                          'Content-Type': 'application/json',
                        },
                        signal: controller.signal,
                        body: JSON.stringify({
                          message,
                          ...(selectedChatId ? { chatId: selectedChatId } : {}),
                        }),
                      });
                    }

                    clearTimeout(timeoutId);

                    const requestDuration = Date.now() - requestStartTime;
                    console.log(`[CHAT-RESPONSE] Received response after ${requestDuration}ms`);

                    if (!response.ok) {
                      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }

                    data = await response.json();

                    const totalDuration = Date.now() - requestStartTime;
                    console.log(`[CHAT-COMPLETE] Full request completed in ${totalDuration}ms`);

                    // Clear AI thinking state first
                    setAiThinkingMessage(null);

                    // Always set selectedChatId to the returned chatId
                    if (data.chatId) {
                      handleSelectChat(data.chatId);

                      // Add environment-aware delay for database consistency
                      // Production Firebase needs longer delays due to network latency and distributed systems
                      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
                      const isProduction =
                        hostname.includes('web.app') ||
                        hostname.includes('firebaseapp.com') ||
                        hostname.includes('academico-ai') ||
                        (hostname !== 'localhost' && hostname !== '127.0.0.1');

                      const baseDelay = isProduction ? 300 : 50; // Minimal delay for local development since ordering is precise
                      const delay = requestDuration < 3000 ? baseDelay : Math.min(baseDelay + 50, 200);

                      console.log(
                        `[CHAT-SYNC] ${isProduction ? 'PRODUCTION' : 'LOCAL'} mode (hostname: ${hostname}): Waiting ${delay}ms for database sync (response took ${requestDuration}ms)`
                      );

                      setTimeout(async () => {
                        // Clear optimistic messages just before fetching fresh data
                        clearOptimisticMessages();
                        await fetchMessagesForChat(data.chatId);
                      }, delay);
                    } else {
                      // If no chatId, clear optimistic messages immediately
                      clearOptimisticMessages();
                    }
                  } catch (error) {
                    const errorDuration = Date.now() - requestStartTime;
                    console.error(`[CHAT-ERROR] Request failed after ${errorDuration}ms:`, error);

                    // Clear optimistic messages and AI thinking message, then show error
                    clearOptimisticMessages();
                    if (error instanceof Error) {
                      if (error.name === 'AbortError') {
                        setAiThinkingMessage({
                          userId: 'ai',
                          message: 'Request timed out. Please try again with a shorter message.',
                        });
                      } else {
                        setAiThinkingMessage({ userId: 'ai', message: `Error: ${error.message}` });
                      }
                    } else {
                      setAiThinkingMessage({
                        userId: 'ai',
                        message: 'An unexpected error occurred. Please try again.',
                      });
                    }

                    // Clear error message after 5 seconds
                    setTimeout(() => {
                      setAiThinkingMessage(null);
                    }, 5000);
                    setTimeout(() => setAiThinkingMessage(null), 5000);
                    return;
                  }

                  setAiThinkingMessage(null);
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
