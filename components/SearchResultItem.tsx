import { SearchUserResult } from '@/services/api';
import { formatDate } from '@/utils';
import { Pressable, Text, View } from 'react-native';
interface SearchResultItemProps {
  user: SearchUserResult;
  onPress: (userId: string) => void;
}

export default function SearchResultItem({ user, onPress }: SearchResultItemProps) {
  return (
    <Pressable 
      onPress={() => {
         onPress(user.id)
      }}
      className="flex-row items-center p-3 mx-2 mb-1 rounded-2xl bg-slate-900/40 border border-slate-800/50 active:bg-slate-800/60"
    >
      {/* Avatar with Status Ring */}
      <View className="relative">
        <View className="w-12 h-12 rounded-full bg-slate-800 items-center justify-center border border-slate-700">
          <Text className="text-slate-300 font-bold text-lg">
            {user.username.charAt(0).toUpperCase()}
          </Text>
        </View>
        {user.is_online && (
          <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
        )}
      </View>

      {/* User Info */}
      <View className="ml-4 flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-slate-100 text-base font-semibold">
            {user.username}
          </Text>
          {/* Optional: Add a small chevron or arrow */}
          <Text className="text-slate-600 text-xs">View Profile</Text>
        </View>
        
        <Text className="text-slate-400 text-sm mt-0.5" numberOfLines={1}>
          {user.is_online ? (
            <Text className="text-emerald-500/90 font-medium">Active now</Text>
          ) : (
            `Last seen ${formatDate(user.last_seen)}`
          )}
        </Text>
      </View>
    </Pressable>
  );
}

