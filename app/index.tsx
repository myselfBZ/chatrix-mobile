import { ConversationItem } from '@/components/ConversationItem';
import { ChatHeader } from '@/components/Header';
import { useChatConnection } from '@/hooks/useChatConnection';
import { useConversations } from '@/hooks/useConversations';
import { useRouter } from 'expo-router';
import { ScrollView, View, } from 'react-native';


export default function Home() {
  const { conversations } = useConversations();
  const connected = useChatConnection();  
  const router = useRouter()
  return (
    <View className="flex-1 bg-slate-950">
      <ChatHeader connected={connected} />

      <ScrollView className="flex-1 px-4 pt-4">
        {conversations.map((item) => (
            <ConversationItem
              onPress={(id) => router.push({
                pathname: `/chat/[id]`,
                params: { id: id }
              })}
              key={item.user_data.conversation_id} 
              item={item} 

            />
        ))}
      </ScrollView>
    </View>
  );
}