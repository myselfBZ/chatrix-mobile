import { useAuth } from '@/context/Auth';
import { useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    // Wait until navigation is ready
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === 'login';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [isAuthenticated, segments, navigationState?.key]);

  // Don't render children until navigation is ready
  if (!navigationState?.key) {
    return null;
  }

  return <>{children}</>;
}