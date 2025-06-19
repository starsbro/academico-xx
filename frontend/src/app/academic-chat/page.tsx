// Refactored Chat Page - Clean and Modular

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '../../hooks/useChat';
import { ChatSidebar, ChatArea, ChatInput } from '../../components/Chat';

export default function AcademicChatPage() {
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
    isLoaded,
    isSignedIn,
    user,
  } = useChat();

  // Handle navigation to home/dashboard
  const handleGoHome = () => {
    router.push('/dashboard');
  };

  // Loading state / not signed in
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Academico AI...</p>
        </div>
      </div>
    );
  }

  const username: string = user.username || user.fullName || user.emailAddresses[0]?.emailAddress || 'Guest';

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Messages */}
        <ChatArea
          chatHistory={chatHistory}
          isLoadingMessages={isLoadingMessages}
          selectedChatId={selectedChatId}
          username={username}
          userId={user?.id}
          chatEndRef={chatEndRef}
        />

        {/* Input Area */}
        <ChatInput
          currentMessage={currentMessage}
          isSignedIn={isSignedIn}
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
