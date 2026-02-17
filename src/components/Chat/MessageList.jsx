import { useEffect, useRef } from 'react';
import { format, isToday, isYesterday } from 'date-fns';

export default function MessageList({ messages, currentUserId, otherUser, isTyping }) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);

    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  const getDeliveryStatus = (message) => {
    if (message.sender_id !== currentUserId) return null;

    if (message.read_at) {
      return (
        <span className="text-xs text-green-600 dark:text-green-400">
          Read
        </span>
      );
    } else if (message.delivered_at) {
      return (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Delivered
        </span>
      );
    }
    return (
      <span className="text-xs text-gray-400 dark:text-gray-500">
        Sent
      </span>
    );
  };

  if (!otherUser) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome to Chat
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Select a user from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gray-50 dark:bg-gray-900"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No messages yet. Start the conversation!
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => {
            const isSender = message.sender_id === currentUserId;

            return (
              <div
                key={message.id}
                className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] ${
                    isSender
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                  } rounded-lg px-4 py-2 shadow-sm`}
                >
                  <p className="text-sm break-words whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <div className={`flex items-center justify-between mt-1 space-x-2 ${
                    isSender ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    <span className="text-xs">
                      {formatMessageTime(message.created_at)}
                    </span>
                    {getDeliveryStatus(message)}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
