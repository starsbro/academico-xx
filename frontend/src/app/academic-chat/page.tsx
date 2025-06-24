// Refactored Chat Page - Clean and Modular

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '../../hooks/useChat';
import { ChatSidebar, ChatArea, ChatInput } from '../../components/Chat';
import { ProtectedRoute } from '../../components/Auth/ProtectedRoute';
import styles from './page.module.css';

export default function AcademicChatPage() {
  return (
    <ProtectedRoute>
      <AcademicChatContent />
    </ProtectedRoute>
  );
}

function AcademicChatContent() {
  const router = useRouter();
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

  // Handle navigation to home/dashboard
  const handleGoHome = () => {
    router.push('/dashboard');
  };

  // Loading state handled by ProtectedRoute
  const username: string = user?.displayName || user?.email || 'Guest';

  return (
    <div className={styles.chatPageContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <ChatSidebar
          userChats={userChats}
          selectedChatId={selectedChatId}
          isLoadingChats={isLoadingChats}
          editingChatId={editingChatId}
          newChatTitle={newChatTitle}
          username={username}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onEditChatTitle={handleEditChatTitle}
          onSaveChatTitle={handleSaveChatTitle}
          onCancelEdit={handleCancelEdit}
          onGoHome={handleGoHome}
          setNewChatTitle={setNewChatTitle}
        />
      </div>

      {/* Main Content Area */}
      <div className={styles.chatMainArea}>
        {/* Chat Messages */}
        <ChatArea
          chatHistory={chatHistory}
          isLoadingMessages={isLoadingMessages}
          selectedChatId={selectedChatId}
          username={username}
          userId={user?.uid}
          chatEndRef={chatEndRef}
        />

        {/* Input Area */}
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
  );
}
