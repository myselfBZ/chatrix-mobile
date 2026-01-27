import { ChatInput } from '@/components/ChatInput';
import { MessageBubble } from '@/components/MessageBubble';
import { TypingIndicator } from '@/components/TypingIndicator';
import { useConversations } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';
import { chatService } from '@/services/ChatService';
import { formatDate } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { getConversationData } = useConversations();
  const conversationData = getConversationData(id as string);
  const router = useRouter();
  const messages = useMessages(id as string);
  
  const flatListRef = useRef<FlatList>(null);
  
  const handleBack = () => {
      router.back();
  };
  
  if (!id || !conversationData) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={['top']}>
        <View className="flex-1 bg-black" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
        {/* Header with gradient background */}
        <View className="bg-zinc-950/95 backdrop-blur-xl">
          <View className="px-5 pb-5 pt-3 flex-row items-center">
            <Pressable 
              onPress={handleBack} 
              className="w-9 h-9 -ml-1.5 items-center justify-center rounded-full active:bg-zinc-800/50"
            >
              <Ionicons name="chevron-back" size={26} color="#ffffff" />
            </Pressable>
            
            <View className="flex-row items-center ml-2 flex-1">
              {/* Avatar with gradient border */}
              <View className="relative">
                <View className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 opacity-75" 
                  style={{ 
                    shadowColor: '#a855f7',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  }}
                />
                <View className="w-11 h-11 rounded-full bg-zinc-900 items-center justify-center m-0.5">
                  <Text className="text-white font-bold text-lg tracking-tight">
                    {conversationData.user_data.username.charAt(0).toUpperCase()}
                  </Text> 
                </View>
              </View>
              
                <View className="ml-3.5 flex-1">
                  <Text className="text-white font-semibold text-[17px] tracking-tight">
                    {conversationData.user_data.username}
                  </Text>
                  
                  {conversationData.is_typing ? (
                    <TypingIndicator/>
                  ) : conversationData.is_online ? (
                    /* --- ONLINE STATE --- */
                    <View className="flex-row items-center mt-1">
                      <View 
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" 
                        style={{
                          shadowColor: '#34d399',
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.8,
                          shadowRadius: 4,
                        }}
                      />
                      <Text className="text-emerald-400 text-xs font-medium tracking-wide">
                        online
                      </Text>
                    </View>
                  ) : (
                    /* --- OFFLINE STATE --- */
                    <Text className="text-zinc-500 text-xs font-medium mt-1 tracking-wide">
                      last seen {formatDate(conversationData.user_data.last_seen)}
                    </Text>
                  )}
                </View>
            </View>

            <Pressable className="w-9 h-9 items-center justify-center rounded-full active:bg-zinc-800/50">
              <Ionicons name="ellipsis-horizontal" size={20} color="#a1a1aa" />
            </Pressable>
          </View>
          
          {/* Subtle bottom border with gradient */}
          <View className="h-[0.5px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </View>

        <KeyboardAvoidingView 
          behavior={'padding'}
          className="flex-1"
          keyboardVerticalOffset={-25}
          enabled={Platform.OS !== 'web'}
        >
          <FlatList
            ref={flatListRef}
            inverted
            data={[...messages].reverse()} 
            contentContainerStyle={{ 
              paddingHorizontal: 16, 
              paddingTop: 24,
              paddingBottom: 16,
              gap: 10,
              flexGrow: 1, 
              justifyContent: 'flex-end'
            }}
            keyExtractor={(item) => item.id || item.clientSide.temp_id}
            renderItem={({ item }) => <MessageBubble item={item} />}
            showsVerticalScrollIndicator={false}
            className="flex-1 bg-black"
          />
          
          <ChatInput 
            onSend={(msg) => chatService.sendChatMessage(
              conversationData.user_data.id,
              "5809d635-d645-408f-adef-0b763bc37c65",
              msg
            )} 
          />
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
}