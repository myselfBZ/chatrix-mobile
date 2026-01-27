import { ConversationWithUser } from '@/services/api';
import { formatDate } from '@/utils';
import { Pressable, Text, View } from 'react-native';
interface Props {
  item: ConversationWithUser;
  onPress: (id: string) => void;
}


export function ConversationItem({ item, onPress }: Props) {
  return (
    <Pressable 
      onPress={() => onPress(item.user_data.id)}
      className="flex-row items-center p-4 mb-3 rounded-2xl bg-slate-900/40 border border-slate-800/50 active:bg-slate-800/60"
    >
      <View className="w-12 h-12 rounded-full bg-slate-800 items-center justify-center border border-slate-700">
        <Text className="text-slate-300 font-bold text-lg">
          {item.user_data.username.charAt(0).toUpperCase()}
        </Text>
        {item.is_online && (
          <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
        )}
      </View>

      <View className="ml-4 flex-1">
        <Text className="text-slate-100 text-base font-semibold">{item.user_data.username}</Text>
        <Text className="text-slate-400 text-sm mt-0.5" numberOfLines={1}>
          {item.is_online ? 'Tap to chat' : `last seen ${formatDate(item.user_data.last_seen)}`}
        </Text>
      </View>
    </Pressable>
  );
}