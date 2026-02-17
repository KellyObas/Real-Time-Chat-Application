import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useUnreadMessages() {
  const [unreadCounts, setUnreadCounts] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    fetchUnreadCounts();

    const subscription = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchUnreadCounts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const fetchUnreadCounts = async () => {
    if (!user) return;

    try {
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('id, participant_1, participant_2')
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`);

      if (convError) throw convError;

      const counts = {};

      for (const conv of conversations || []) {
        const otherUserId =
          conv.participant_1 === user.id
            ? conv.participant_2
            : conv.participant_1;

        const { count, error: countError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('is_read', false)
          .neq('sender_id', user.id);

        if (!countError) {
          counts[otherUserId] = count || 0;
        }
      }

      setUnreadCounts(counts);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  return unreadCounts;
}
