import { useState, useRef, useEffect } from 'react';

export default function MessageInput({ onSendMessage, onTyping, disabled }) {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (onTyping) {
      onTyping(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || disabled) return;

    const trimmedMessage = message.trim();
    setMessage('');

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (onTyping) {
      onTyping(false);
    }

    await onSendMessage(trimmedMessage);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? 'Select a user to start chatting' : 'Type a message...'}
            disabled={disabled}
            rows="1"
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              minHeight: '44px',
              maxHeight: '120px'
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Send
        </button>
      </div>
    </form>
  );
}
