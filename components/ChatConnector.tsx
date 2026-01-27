import { useAuth } from '@/context/Auth';
import { chatService } from "@/services/ChatService";
import { useEffect } from 'react';

export const ChatConnector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthenticated, user } = useAuth();

  useEffect(() => {
    const socketUrl = `${process.env.EXPO_PUBLIC_BACKEND_URL}/ws`;

    if (isAuthenticated && token && user) {
      console.log("🔌 Auth detected, connecting socket...");
      chatService.start(socketUrl, token, user.id);
    } else {
      // If token is wiped from RAM (logout), kill the connection
      chatService.disconnect();
    }

    return () => chatService.disconnect();
  }, [isAuthenticated, token]);

  return <>{children}</>;
};