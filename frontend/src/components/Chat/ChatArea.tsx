// Chat Messages Area Component

import React from 'react';
import { ChatMessage } from '../../types/chat.types';

interface ChatAreaProps {
  chatHistory: ChatMessage[];
  isLoadingMessages: boolean;
  selectedChatId: string | null;
  username: string;
  userId?: string;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  chatHistory,
  isLoadingMessages,
  selectedChatId,
  username,
  userId,
  chatEndRef,
}) => {
  if (isLoadingMessages && selectedChatId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (chatHistory.length === 0 && !selectedChatId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Academico AI</h2>
          <p className="text-gray-600 mb-6">Your intelligent academic companion</p>
          <p className="text-gray-500 text-sm">
            Ready to help with research, writing, analysis, and academic questions. Start by typing your first message
            below.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-full px-4 py-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="font-medium">{username}</span>
          </div>
        </div>
      </div>
    );
  }

  if (chatHistory.length === 0 && selectedChatId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Fresh Start</h3>
          <p className="text-gray-500">Begin your conversation with your first message!</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full overflow-y-auto pl-6 pr-4 pt-12 pb-6 chat-area"
      style={{
        backgroundColor: 'var(--chat-bg, white)',
        minHeight: '100%',
      }}
    >
      <div className="max-w-4xl mx-auto pr-2">
        <div className="h-8" />
        {chatHistory.map((chat) => (
          <div
            key={chat.id}
            className={`chat-message-container flex mb-6 ml-4 ${chat.userId === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl rounded-2xl shadow-lg ${
                chat.userId === userId
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white'
              }`}
            >
              <div className="p-8">
                {/* Header with user label and avatar */}
                <div className="flex items-center justify-between mb-6" style={{ paddingRight: '6px' }}>
                  <div className="flex items-center gap-3">
                    {chat.userId !== userId && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                    )}
                    <span
                      className={`text-sm font-semibold uppercase tracking-wide ${
                        chat.userId === userId ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}
                      style={{ marginLeft: '6px', paddingLeft: '6px' }}
                    >
                      {chat.userId === userId ? 'You' : 'Academico AI'}
                    </span>
                  </div>
                  {chat.userId === userId && (
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Message content with generous padding */}
                <div
                  className="text-lg leading-relaxed whitespace-pre-wrap mb-6"
                  style={{ marginLeft: '6px', paddingLeft: '6px', paddingRight: '6px' }}
                >
                  {chat.message}
                </div>

                {/* Timestamp */}
                <div
                  className={`flex justify-end pt-4 border-t ${
                    chat.userId === userId ? 'border-blue-400/30' : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <span
                    className={`text-sm ${chat.userId === userId ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'}`}
                    style={{ marginRight: '6px', paddingRight: '6px' }}
                  >
                    {new Date(chat.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
};
