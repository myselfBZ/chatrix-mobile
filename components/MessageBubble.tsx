import { useAuth } from "@/context/Auth";
import { ChatMessage } from "@/services/api";
import { formatMessageTime } from "@/utils";
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from "react-native";

export function MessageBubble({ item }: { item: ChatMessage }) {
  const { user } = useAuth()
  const isMe = item.sender_id === user?.id
  const isPending = item.clientSide?.state === "pending";

  return (
    <View className={`flex-row mb-2 px-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <View className={`max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
        <View
          className={`px-4 py-2.5 rounded-3xl ${
            isMe 
              ? 'bg-blue-600 rounded-br-md' 
              : 'bg-zinc-800 rounded-bl-md'
          }`}
        >
          <Text className="text-white text-base leading-5">
            {item.content}
          </Text>
        </View>

        <View className="flex-row items-center mt-1 px-2">
          {isPending ? (
            <Ionicons 
              name="time-outline" 
              size={14} 
              color="#71717a" 
            />
          ) : (
            <>
              <Text className="text-zinc-500 text-xs">
                {formatMessageTime(item.created_at)}
              </Text>
              {isMe && (
                <Ionicons
                  name={item.is_read ? "checkmark-done" : "checkmark"}
                  size={14}
                  color={item.is_read ? "#60a5fa" : "#71717a"}
                  style={{ marginLeft: 4 }}
                />
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
}