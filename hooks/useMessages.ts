
import { chatService } from "@/services/ChatService";
import { useEffect, useState } from "react";

export function useMessages(id: string) {
  const [msgs, setMsgs] = useState<any[]>([]);

  useEffect(() => {
    const sync = async () => {
       const initialMsgs = await chatService.loadMessageHistory(id);
       if (initialMsgs) setMsgs(initialMsgs);
    };
    
    sync();

    const unsubscribe = chatService.subscribeMessages((updatedMsgs) => {
       setMsgs(updatedMsgs);
    });

    return () => unsubscribe();
  }, [id]);


  useEffect(() => {    
    chatService.markMsgsReadForConvo(id)
    
  }, [msgs.length, id])

  return msgs;
}