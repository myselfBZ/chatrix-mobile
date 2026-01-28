import * as Crypto from 'expo-crypto';
import { ChatMessage, ConversationWithUser, getConversations, getMessageHistory } from "./api";
type MessageTypes = {
        type: "WELCOME",
        message: {}
    } 
    | { type: "ACK_MSG_DELIVERED", message : {
      reciever_id: string;
      temp_id: string;
      created_at: string;
      id: string;
    } }
    | { type: "CHAT"; message : { 
      from: string; 
      content: string, 
      to: string;
      id: string;
      created_at: string;
    } }
    | { type: "ONLINE_PRESENCE", message : {user_id : string} }
    | { type: "OFFLINE_STATUS", message : {user_id : string; last_seen: string;} }
    | { type: "MSG_READ", message: { conversation_id: string, message_ids: string[] } }
    | { type: "TYPING", message: {
      from: string;
      to:   string;
     }}
    | {
      type: "STOPPED_TYPING", message: {
        from: string;
        to: string;
      } 
    }


class ChatService {
    private ws: WebSocket | null = null;
    private token : string | null = null;
    private user_id = "";
    private conversations: ConversationWithUser[] = [];
    private activeChatId = "";
    // Conversations listener
    private conversationListener: ((data: ConversationWithUser[]) => void) | null = null;
    
    private messages: Record<string, ChatMessage[]> = {};
    private messageListener: ((msgs: ChatMessage[]) => void) | null = null;

    // Online Status 
    private statusListener: ((connected: boolean) => void) | null = null;
    connected = false;

    start(url: string, token: string, user_id: string) {
        const ws = new WebSocket(url);
        this.user_id = user_id
        this.token = token
        this.ws = ws;

        this.ws.onopen = (e) => {
            this.sendMessage("AUTH", { token })
        }

        this.ws.onmessage = (e) => {
            const data : MessageTypes = JSON.parse(e.data)
            this.handleMessages(data)
        }

        this.ws.onclose = (e) => {
            console.log(e);
            
        }

        this.ws.onerror = (e) => {
            console.log(e);
        }
    }

    private handleMessages = async (m: MessageTypes) => {
        switch(m.type) {
            case "WELCOME":
                await this.syncConversations();
                this.connected = true
                if(this.statusListener) {
                    this.statusListener(this.connected)
                }
                break;
            case "CHAT":
                const currentMsgs : ChatMessage[] = this.messages[m.message.from] ? (this.messages[m.message.from]) : ([])
                const newMsg = {
                    sender_id: m.message.from,
                    is_read: false,
                    created_at: m.message.created_at,
                    content: m.message.content,
                    id: m.message.id,
                    // TODO
                    conversation_id: ""
                }
                const newMsgs = [...currentMsgs, newMsg]
                this.messages[m.message.from] = newMsgs

                // A BIG TODO.
                // EVERY NEW MESSAGE MIGHT BE A NEW RENDER OF THE CONVERSATIONS ARRAY
                if(this.activeChatId !== newMsg.sender_id) {
                    this.updateConversations(this.conversations.map((v) => {
                        if(v.user_data.id === newMsg.sender_id) {
                            v.user_data.unread_msg_count++
                        }
                        return v
                    }))
                }

                this.notifyMessages(newMsgs)
                break;
            case "ACK_MSG_DELIVERED":
                if(this.messages[m.message.reciever_id]) {
                    const newMsgs = this.messages[m.message.reciever_id].map((v) => {
                        if(v.clientSide && v.clientSide.temp_id === m.message.temp_id) {
                            v.clientSide.state = "delivered"
                            v.created_at = m.message.created_at
                            v.id = m.message.id
                            return v
                        }
                        return v
                    })

                    this.notifyMessages(newMsgs)
                }
                break;
            case "OFFLINE_STATUS":
                const newConversations = this.conversations.map((v) => {
                    if(v.user_data.id === m.message.user_id) {
                        v.is_online = false
                        v.user_data.last_seen = m.message.last_seen
                        v.is_typing = false
                    }
                    return v 
                })
                this.conversations = newConversations
                this.notifConversations()
                break
            case "ONLINE_PRESENCE":
                const newConvos = this.conversations.map((v) => {
                    if(v.user_data.id === m.message.user_id) {
                        v.is_online = true
                        return v
                    }
                    return v 
                })
                this.conversations = newConvos
                this.notifConversations()
                break;
            case "MSG_READ":
                const partner = this.conversations.find((v) => m.message.conversation_id === v.user_data.conversation_id)
                if(!partner) return;
                const conversation = this.messages[partner.user_data.id]
                if(!conversation) return;
                const updatedMsgs = conversation.map((v) => {
                    for(const id of m.message.message_ids) {
                        if(v.id === id) {
                            v.is_read = true
                        }
                    }
                    return v
                })
                this.messages[partner.user_data.id] = updatedMsgs
                this.notifyMessages(updatedMsgs)
                break;
            case "TYPING":
            case "STOPPED_TYPING":
                const newConv = this.conversations.map((v) => {
                    if(v.user_data.id === m.message.from) {
                        v.is_typing = m.type === "TYPING" ? (true) : (false)
                    }
                    return v
                })
                this.conversations = newConv
                this.notifConversations()
                break
        }
    }

    loadMessageHistory = async (partner_id: string) => {
        if(!this.token) return []; // Return empty array instead of nothing
        
        if(this.messages[partner_id]) {
            // Still notify other listeners, but return the data for the caller
            this.notifyMessages(this.messages[partner_id]);
            return this.messages[partner_id]; 
        }

        try {
            const resp = await getMessageHistory({
                token: this.token,
                with_id: partner_id,
            });
            this.messages[partner_id] = resp.data || [];
            this.notifyMessages(this.messages[partner_id]);
            return resp.data ? resp.data : []
        } catch(e: any) {
            console.log("Error fetching history:", partner_id);
            return [];
        }
    }

    private async syncConversations() {
        if(!this.token) return;

        try {
            const resp = await getConversations({ token: this.token })
            this.conversations = resp.data;
            if(this.conversationListener) {
                this.conversationListener(this.conversations);
            }
        } catch (e) {
            // TODO
            console.log("syncConversations() error:", e);
        }
    }

    private notifyMessages(msgs: ChatMessage[]) {
        if(this.messageListener) {
            this.messageListener(msgs)
        }
    }

    // Conversations
    private notifConversations() {
        if(this.conversationListener)
        this.conversationListener(this.conversations)
    }

    private updateConversations(c: ConversationWithUser[]) {
        this.conversations = c
        this.notifConversations()
    }

    setActiveChatId(id: string) {
        this.activeChatId = id
    }

    markMsgsReadForConvo(user_id: string) {
        const partner = this.conversations.find((v) => {
            return v.user_data.id === user_id
        })

        if(!partner) return;

        const conversations = this.conversations.map((v) => {
            if(v.user_data.id === user_id) {
                v.user_data.unread_msg_count = 0
            }
            return v
        })
        
        this.updateConversations(conversations)

        const msgs = this.messages[user_id] || []
        const readMsgs = msgs.map((v) => {
            if(!v.is_read && v.sender_id !== this.user_id) {
                v.is_read = true
                return v
            }
            return v
        })
        this.messages[user_id] = readMsgs
        this.notifyMessages(readMsgs)
        
        this.sendMessage("MARK_READ", {
            conversation_id: partner.user_data.conversation_id,
            msg_owner_id: user_id
        })

    }
    
    subscribeMessages(callback: (newMsgs: ChatMessage[]) => void) {
        this.messageListener = callback
        return () => { this.messageListener = null }
    }

    // Conversations
    subscribeConversations(callback: (data: ConversationWithUser[]) => void) {
        this.conversationListener = callback;

        callback(this.conversations);

        return () => { this.conversationListener = null };
    }

    sendChatMessage(to: string, from: string, content: string) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            const temp_id = Crypto.randomUUID()
            const data = JSON.stringify({ type: "CHAT", message: {
                to,
                from,
                content,
                temp_id
            } });
            // TODO: create a new conversation
            if(this.messages[to]) {
                this.messages[to].push({
                    sender_id: this.user_id,
                    content: content,
                    id: "",
                    is_read: false,
                    conversation_id: "",
                    created_at: "",
                    clientSide: {
                        temp_id: temp_id,
                        state: "pending"
                    }
                })
                this.notifyMessages([...this.messages[to]])
            }

            this.ws.send(data);
        } else {
            console.warn("Could not send: Socket is not open.");
        }
    }

    sendMessage(type: string, payload: any) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            const data = JSON.stringify({ type, message: payload });
            
            this.ws.send(data);
        } else {
            console.warn("Could not send: Socket is not open.");
        }
    }

    onStatusChange(callback: (connected: boolean) => void) {
        this.statusListener = callback;
        callback(this.connected);
    }


    disconnect() {
        this.ws?.close();
        this.ws = null;
    }
}

export const chatService = new ChatService()