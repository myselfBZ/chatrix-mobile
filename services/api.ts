import axios from "axios";


export const serverApiInstance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BACKEND_URL}`,
});



export type LoginResposne = {
    access_token: string;
    user: {
        created_at: string;
        email: string;
        id: string;
        last_seen: string;
        username: string
    }
}

export const createAccessToken = ({ email, password } : { email : string, password: string }) => {
    return serverApiInstance.post<LoginResposne>('/auth/token', { email, password })
}


export type ConversationWithUser = {
    user_data: { 
        id : string;
        last_seen: string;
        username: string;
        conversation_id: string
        unread_msg_count: number;
    };
    is_online: boolean;
    // client side
    is_typing?: boolean
}

export type ChatMessage = {
    created_at:         string;
    id:                 string;
    sender_id:          string;
    content:            string;
    is_read:            boolean;
    conversation_id:    string;

    clientSide?: {
        temp_id : string
        state: "pending" | "delivered"
    }
}


export const getConversations = ({ token }: {token : string}) => {
    return serverApiInstance.get<ConversationWithUser[]>('/authenticated/conversations/mine', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export const getMessageHistory = ({ token, with_id } : {token: string, with_id:string}) => {
    return serverApiInstance.get<ChatMessage[]>(`authenticated/messages?with_id=${with_id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}