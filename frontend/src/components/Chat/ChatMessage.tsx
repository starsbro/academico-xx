import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '../../types/chat.types';

interface ChatMessageProps {
  message: ChatMessage;
  userId?: string;
  username: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, userId, username }) => {
  const isPdf = message.source === 'pdf';
  const isUser = message.userId === userId;
  // const senderLabel = isUser ? username : message.userId === 'ai' ? 'AI Response' : username || 'Academico AI';
  const senderLabel = isUser ? username : 'Academico AI';
  return (
    <div className={`chat-message-container flex mb-6 ml-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-2xl rounded-2xl shadow-lg ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white'
        }`}
      >
        <div className="p-8">
          {/* Header with user label and avatar */}
          <div className="flex items-center justify-between mb-6" style={{ paddingRight: '6px' }}>
            <div className="flex items-center gap-3">
              {!isUser && (
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
                  isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}
                style={{ marginLeft: '6px', paddingLeft: '6px' }}
              >
                {senderLabel}
              </span>
            </div>
            {isUser && (
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

          {/* PDF badge if needed */}
          {isPdf && (
            <span
              style={{
                color: isUser ? '#fff' : '#2563eb',
                fontWeight: 600,
                fontSize: '0.9rem',
                marginRight: 8,
              }}
            >
              {(() => {
                if (typeof message.pdfFilename === 'string') {
                  return `📄 PDF: ${message.pdfFilename}`;
                }
                // Defensive: handle legacy or malformed object
                if (
                  message.pdfFilename &&
                  typeof message.pdfFilename === 'object' &&
                  'name' in message.pdfFilename &&
                  typeof (message.pdfFilename as { name?: unknown }).name === 'string'
                ) {
                  return `📄 PDF: ${(message.pdfFilename as { name: string }).name}`;
                }
                return '📄 PDF';
              })()}
            </span>
          )}

          {/* Message content with generous padding */}
          <div
            className="text-lg leading-relaxed whitespace-pre-wrap mb-6"
            style={{ marginLeft: '6px', paddingLeft: '6px', paddingRight: '6px' }}
          >
            <ReactMarkdown>{message.message}</ReactMarkdown>
          </div>

          {/* Timestamp */}
          <div
            className={`flex justify-end pt-4 border-t ${
              isUser ? 'border-blue-400/30' : 'border-gray-200 dark:border-gray-600'
            }`}
          >
            <span
              className={`text-sm ${isUser ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'}`}
              style={{ marginRight: '6px', paddingRight: '6px' }}
            >
              {new Date(message.timestamp).toLocaleString('en-US', {
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
  );
};

export default ChatMessage;
