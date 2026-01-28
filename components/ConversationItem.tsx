import { ConversationWithUser } from '@/services/api';
import { formatDate } from '@/utils';
import { Pressable, Text, View } from 'react-native';
import { TypingIndicator } from './TypingIndicator';

interface Props {
  item: ConversationWithUser;
  onPress: (id: string) => void;
}


export function ConversationItem({ item, onPress }: Props) {
  const unreadCount = item.user_data.unread_msg_count;

  return (
    <Pressable 
      onPress={() => onPress(item.user_data.id)}
      className="flex-row items-center p-4 mb-3 rounded-2xl bg-slate-900/40 border border-slate-800/50 active:bg-slate-800/60"
    >
      {/* Avatar Section */}
      <View className="w-12 h-12 rounded-full bg-slate-800 items-center justify-center border border-slate-700">
        <Text className="text-slate-300 font-bold text-lg">
          {item.user_data.username.charAt(0).toUpperCase()}
        </Text>
        {item.is_online && (
          <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
        )}
      </View>

      {/* Info Section */}
      <View className="ml-4 flex-1">
        <Text className="text-slate-100 text-base font-semibold">
          {item.user_data.username}
        </Text>
        
        {/* Conditional Status / Typing Indicator */}
        <View className="mt-0.5 h-5 justify-center">
          {item.is_typing ? (
            <TypingIndicator />
          ) : (
            <Text className="text-slate-400 text-sm" numberOfLines={1}>
              {item.is_online ? 'Tap to chat' : `last seen ${formatDate(item.user_data.last_seen)}`}
            </Text>
          )}
        </View>
      </View>

      {/* Unread Message Badge */}
      {unreadCount > 0 && (
        <View className="bg-blue-600 min-w-[24px] h-6 px-1.5 rounded-full items-center justify-center ml-2">
          <Text className="text-white text-xs font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </Pressable>
  );
}