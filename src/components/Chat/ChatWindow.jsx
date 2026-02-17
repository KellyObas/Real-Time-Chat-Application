import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ChatWindow({ selectedUser, onBack }) {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (selectedUser && user) {
      initializeConversation();
    }

    return () => {
      if (conversationId) {
        updateTypingIndicator(false);
      }
    };
  }, [selectedUser, user]);

  useEffect(() => {
    if (!conversationId) return;

    const messagesChannel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);

          if (payload.new.sender_id !== user.id) {
            markMessageAsRead(payload.new.id);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === payload.new.id ? payload.new : msg
            )
          );
        }
      )
      .subscribe();

    const typingChannel = supabase
      .channel(`typing:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          if (payload.new && payload.new.user_id !== user.id) {
            setIsTyping(payload.new.is_typing);
          }
        }
      )
      .subscribe();

    return () => {
      messagesChannel.unsubscribe();
      typingChannel.unsubscribe();
    };
  }, [conversationId, user]);

  const initializeConversation = async () => {
    try {
      setLoading(true);
      const convId = await getOrCreateConversation();
      setConversationId(convId);
      await loadMessages(convId);
    } catch (error) {
      console.error('Error initializing conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrCreateConversation = async () => {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('conversations')
        .select('id')
        .or(
          `and(participant_1.eq.${user.id},participant_2.eq.${selectedUser.id}),and(participant_1.eq.${selectedUser.id},participant_2.eq.${user.id})`
        )
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existing) {
        return existing.id;
      }

      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          participant_1: user.id,
          participant_2: selectedUser.id
        })
        .select('id')
        .single();

      if (createError) throw createError;
      return newConversation.id;
    } catch (error) {
      console.error('Error getting/creating conversation:', error);
      throw error;
    }
  };

  const loadMessages = async (convId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);

      const unreadMessages = data?.filter(
        (msg) => msg.sender_id !== user.id && !msg.is_read
      );

      for (const msg of unreadMessages || []) {
        await markMessageAsRead(msg.id);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await supabase
        .from('messages')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleSendMessage = async (content) => {
    if (!conversationId || !content.trim()) return;

    try {
      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
        delivered_at: new Date().toISOString()
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const updateTypingIndicator = useCallback(
    async (typing) => {
      if (!conversationId) return;

      try {
        const { data: existing } = await supabase
          .from('typing_indicators')
          .select('id')
          .eq('conversation_id', conversationId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('typing_indicators')
            .update({
              is_typing: typing,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
        } else {
          await supabase.from('typing_indicators').insert({
            conversation_id: conversationId,
            user_id: user.id,
            is_typing: typing
          });
        }
      } catch (error) {
        console.error('Error updating typing indicator:', error);
      }
    },
    [conversationId, user]
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center space-x-3">
        <button
          onClick={onBack}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
            {selectedUser?.username.charAt(0).toUpperCase()}
          </div>
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
              selectedUser?.is_online ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {selectedUser?.username}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedUser?.is_online ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      <MessageList
        messages={messages}
        currentUserId={user.id}
        otherUser={selectedUser}
        isTyping={isTyping}
      />

      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={updateTypingIndicator}
        disabled={!selectedUser}
      />
    </div>
  );
}
