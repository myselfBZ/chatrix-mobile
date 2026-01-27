import { Text, View } from 'react-native';

export function ChatHeader({ connected }: { connected: boolean }) {
  return (
    <View className="px-6 pt-12 pb-4 border-b border-slate-900 bg-slate-950/50">
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-3xl font-extrabold tracking-tight">Chatrix</Text>
        <View className="flex-row items-center bg-slate-900 px-3 py-1 rounded-full">
          <View className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <Text className="text-slate-400 text-xs font-medium">{connected ? 'Live' : 'Offline'}</Text>
        </View>
      </View>
    </View>
  );
}