// Chat Input Component

import React from 'react';
import { Input } from '../../app/components/ui/input';
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
    <div className="border-t bg-fuchsia-100 rounded-2xl p-4">
      <div className="max-w-3xl mx-auto px-8">
        <div className="relative">
          <Input
            placeholder="I am thinking about..."
            className="pr-20 h-12 text-lg"
            value={currentMessage || ''}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={onKeyPress}
            disabled={!isSignedIn}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onSendMessage}
              disabled={!isSignedIn || currentMessage.trim() === ''}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
              <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg text-sm border border-yellow-200">
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
              <p className="text-center text-gray-500 text-sm mb-3">Quick Start Ideas</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { icon: '💡', text: 'Help me brainstorm ideas' },
                  { icon: '📝', text: 'Review my writing' },
                  { icon: '🔍', text: 'Research a topic' },
                  { icon: '📊', text: 'Analyze data' },
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onMessageChange(suggestion.text)}
                    className="px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
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
