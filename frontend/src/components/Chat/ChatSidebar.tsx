// Chat Sidebar Component

import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { UserChat } from '../../types/chat.types';

interface ChatSidebarProps {
  userChats: UserChat[];
  selectedChatId: string | null;
  isLoadingChats: boolean;
  editingChatId: string | null;
  newChatTitle: string;
  username: string;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onEditChatTitle: (chatId: string, currentTitle: string) => void;
  onSaveChatTitle: (chatId: string) => void;
  onCancelEdit: () => void;
  onGoHome: () => void;
  setNewChatTitle: (title: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  userChats,
  selectedChatId,
  isLoadingChats,
  editingChatId,
  newChatTitle,
  username,
  onNewChat,
  onSelectChat,
  onEditChatTitle,
  onSaveChatTitle,
  onCancelEdit,
  onGoHome,
  setNewChatTitle,
}) => {
  return (
    <div className="w-80 h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-white">Academico AI</h1>
            <p className="text-gray-300 text-sm truncate">{username}</p>
          </div>
          <UserButton />
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
          onClick={onNewChat}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 px-6">
        <h3 className="text-sm font-medium opacity-90 pl-2 mb-3">Chats ({userChats.length})</h3>
        <div className="space-y-2">
          {isLoadingChats ? (
            <p className="text-white/70 text-sm pl-2">Loading chats...</p>
          ) : userChats.length === 0 ? (
            <p className="text-white/70 text-sm pl-2">No chats yet. Start a new one!</p>
          ) : (
            userChats.map((chat) => (
              <div key={chat.id} className="flex items-center justify-between group">
                {editingChatId === chat.id ? (
                  <input
                    type="text"
                    value={newChatTitle}
                    onChange={(e) => setNewChatTitle(e.target.value)}
                    className="flex-1 bg-white/20 text-white px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSaveChatTitle(chat.id);
                      if (e.key === 'Escape') onCancelEdit();
                    }}
                    autoFocus
                  />
                ) : (
                  <button
                    className={`w-full text-left py-3 px-4 rounded-lg text-white text-sm transition duration-200 ease-in-out
                        ${selectedChatId === chat.id ? 'bg-white/30 font-semibold' : 'hover:bg-white/20'}`}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="truncate">{chat.title}</div>
                    <div className="text-xs opacity-70 mt-1">{new Date(chat.lastUpdatedAt).toLocaleDateString()}</div>
                  </button>
                )}
                {editingChatId !== chat.id && (
                  <button
                    className="ml-2 text-white/50 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    onClick={() => onEditChatTitle(chat.id, chat.title)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-700">
        <button
          onClick={onGoHome}
          className="w-full text-gray-300 hover:text-white hover:bg-white/10 py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};
