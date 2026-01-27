import { chatService } from '@/services/ChatService';
import { ConversationWithUser } from '@/services/api';
import { useEffect, useState } from 'react';

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationWithUser[]>([]);
  const getConversationData = (id: string) => {
    const item = conversations.find((c) => c.user_data.id === id);
    return item
  }
  useEffect(() => {
    const unsubscribe = chatService.subscribeConversations((data) => {
      setConversations(data);
    });

    return () => { unsubscribe() };
  }, []);
  

  return { 
    conversations,
    getConversationData 
  };
}