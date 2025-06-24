// Chat Input Component

import React from 'react';
import { Input } from '../../app/components/ui/input';
import { ChatMessage } from '../../types/chat.types';
import styles from './ChatInput.module.css';

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
    <div className={styles.inputContainer}>
      <div className={styles.inputWrapper}>
        <div className={styles.inputField}>
          <Input
            placeholder="I am thinking about..."
            className="pr-20 h-12 text-lg"
            value={currentMessage || ''}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={onKeyPress}
            disabled={!isSignedIn}
          />
          <button
            className={styles.sendButton}
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
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {(!isSignedIn || currentMessage.trim() === '') && (
              <div className={styles.sendButtonTooltip}>
                {!isSignedIn ? 'Please sign in to send messages' : 'Type a message to send'}
              </div>
            )}
          </button>
        </div>

        {!isSignedIn && (
          <div className={styles.warningNotice}>
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
          <div className={styles.quickActions}>
            <p className={styles.quickActionsTitle}>Quick Start Ideas</p>
            <div className={styles.quickActionButtons}>
              {[
                { icon: '💡', text: 'Help me brainstorm ideas' },
                { icon: '📝', text: 'Review my writing' },
                { icon: '🔍', text: 'Research a topic' },
                { icon: '📊', text: 'Analyze data' },
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onMessageChange(suggestion.text)}
                  className={styles.quickActionButton}
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
  );
};
