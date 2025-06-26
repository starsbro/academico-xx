// Chat Sidebar Component

import React from 'react';
import { UserButton } from '../Auth/UserButton';
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
  setNewChatTitle,
}) => {
  return (
    <div className="w-80 h-full text-white flex flex-col shadow-xl chat-sidebar bg-transparent">
      {/* Header */}
      <div className="sidebar-header p-6">
        <div className="flex items-center gap-3 mb-8 pt-2 header-content">
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-white">Academico AI</h1>
            <p className="text-gray-200 text-sm truncate">{username}</p>
          </div>
          <UserButton />
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 px-4 new-chat-button rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 active:translate-y-0"
          onClick={onNewChat}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto sidebar-content pt-4">
        <h3 className="text-sm font-medium opacity-90 pl-4 mb-3">Chats ({userChats.length})</h3>
        <div className="space-y-2 content-inner">
          {isLoadingChats ? (
            <p className="text-white/80 text-sm pl-4">Loading chats...</p>
          ) : userChats.length === 0 ? (
            <p className="text-white/80 text-sm pl-4">No chats yet. Start a new one!</p>
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
                    className={`
                      w-full text-left py-3 px-4 rounded-lg text-white text-sm transition-all duration-250 ease-out relative
                      ${
                        selectedChatId === chat.id
                          ? 'bg-blue-500/25 font-semibold translate-x-1.5 shadow-lg before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-blue-500 before:to-blue-700 before:rounded-r-sm'
                          : 'hover:bg-white/20 hover:translate-x-1 hover:shadow-md hover:before:absolute hover:before:left-0 hover:before:top-0 hover:before:bottom-0 hover:before:w-1 hover:before:bg-gradient-to-b hover:before:from-blue-500 hover:before:to-blue-700 hover:before:rounded-r-sm hover:before:opacity-60'
                      }
                    `}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="truncate">{chat.title}</div>
                    <div className="text-xs opacity-70 mt-1">{new Date(chat.lastUpdatedAt).toLocaleDateString()}</div>
                  </button>
                )}
                {editingChatId !== chat.id && (
                  <button
                    className="ml-2 text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded hover:bg-white/10"
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
    </div>
  );
};
