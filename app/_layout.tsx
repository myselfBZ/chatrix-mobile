import { ChatConnector } from '@/components/ChatConnector';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthProvider } from '@/context/Auth';
import { Stack } from 'expo-router';


export default function RootLayout() {
  return (
    <AuthProvider>
      <ProtectedRoute>
      <ChatConnector>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 200, 
            gestureEnabled: true,
            contentStyle: { backgroundColor: '#020617' }
          }}
        >
          <Stack.Screen name="index" /> 
          <Stack.Screen name="chat/[id]" />
          <Stack.Screen name="login"/>
        </Stack>
      </ChatConnector>
      </ProtectedRoute>
    </AuthProvider>
  );
}