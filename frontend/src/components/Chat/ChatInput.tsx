// Chat Input Component

import React from 'react';
import { ChatMessage } from '../../types/chat.types';

interface ChatInputProps {
  currentMessage: string;
  isSignedIn: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  chatHistory: ChatMessage[];
  selectedChatId: string | null;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  currentMessage,
  isSignedIn,
  onMessageChange,
  onSendMessage,
  onKeyPress,
  chatHistory,
  selectedChatId,
}) => {
  return (
    <div
      className="border-t border-gray-200 dark:border-gray-700 rounded-b-3xl shadow-lg overflow-visible"
      style={{ backgroundColor: 'var(--chat-container-bg)' }}
    >
      <div className="py-0 px-0 overflow-visible">
        <div className="max-w-4xl mx-auto overflow-visible">
          <div className="relative overflow-visible p-0 m-0">
            <div className="chat-input-padding p-0 m-0 overflow-visible">
              <input
                type="text"
                placeholder="I am thinking about..."
                className="relative z-50 pr-24 h-20 text-3xl w-full py-6 px-6 bg-white dark:bg-gray-800 text-black dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-400 border-2 border-solid border-blue-500 dark:border-blue-400 rounded-xl shadow-2xl focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 focus:outline-none my-4"
                value={currentMessage || ''}
                onChange={(e) => onMessageChange(e.target.value)}
                onKeyDown={onKeyPress}
                disabled={!isSignedIn}
              />
            </div>
            <button
              className={`
                absolute right-4 top-1/2 -translate-y-1/2 
                w-14 h-14 rounded-full flex items-center justify-center
                transition-all duration-300 ease-out border-none cursor-pointer z-10
                ${
                  !isSignedIn || currentMessage.trim() === ''
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                    : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-110 shadow-lg hover:shadow-xl active:scale-95'
                }
              `}
              onClick={onSendMessage}
              disabled={!isSignedIn || currentMessage.trim() === ''}
              title={
                !isSignedIn
                  ? 'Please sign in to send messages'
                  : currentMessage.trim() === ''
                    ? 'Type a message to send'
                    : 'Send message'
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>

          {!isSignedIn && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg text-base border border-yellow-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span>Please sign in to start chatting</span>
              </div>
            </div>
          )}

          {/* Quick action hints */}
          {isSignedIn && chatHistory.length === 0 && !selectedChatId && (
            <div className="mt-4">
              <p className="text-center text-gray-500 text-base mb-3">Quick Start Ideas</p>
              <div className="flex flex-wrap gap-2 justify-center md:flex-row flex-col md:items-start items-center">
                {[
                  { icon: '💡', text: 'Help me brainstorm ideas' },
                  { icon: '📝', text: 'Review my writing' },
                  { icon: '🔍', text: 'Research a topic' },
                  { icon: '📊', text: 'Analyze data' },
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onMessageChange(suggestion.text)}
                    className="px-3 py-2 text-base bg-blue-50 text-blue-700 rounded-lg border border-blue-200 transition-all duration-200 hover:bg-blue-100 hover:border-blue-300 cursor-pointer"
                  >
                    <span className="mr-1">{suggestion.icon}</span>
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
