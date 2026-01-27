import { chatService } from '@/services/ChatService';
import { useEffect, useState } from 'react';

export function useChatConnection() {
  const [isConnected, setIsConnected] = useState(chatService.connected);

  useEffect(() => {
    chatService.onStatusChange((status) => {
      setIsConnected(status);
    });
  }, []);

  return isConnected;
}