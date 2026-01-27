import { AuthProvider } from '@/context/Auth';
import { Stack } from 'expo-router';
import "../global.css";
export default function RootLayout() {
  return (
    <AuthProvider>
       <Stack
        screenOptions={{
          headerShown: false,
        }}
       >
        <Stack.Screen
          name="(protected)"
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            animation: "none",
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
