import axios from "axios";


export const serverApiInstance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BACKEND_URL}`,
});


export type SearchUserResult = {
    username: string;
    id: string;
    last_seen: string;
    is_online: boolean;
}

export type CreateConversationResponse = {
    user1: string;
    user2 : string;
    id: string;
}


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
    msg_history_loaded?: boolean;
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

export const searchUser = ({ token, query } : {
    token: string;
    query: string;
}) => {
    return serverApiInstance.post<SearchUserResult[]>('/authenticated/users/search', { query } ,{
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
}

export const createConversation = ({ token, user1, user2 } : {
    token: string;
    user1: string;
    user2: string;
}) => {
    return serverApiInstance.post<CreateConversationResponse>('/authenticated/conversations', { user1, user2 }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}