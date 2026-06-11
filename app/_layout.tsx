import { Stack } from 'expo-router';
import { T } from '@/lib/theme';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: T.navy }, headerTintColor: '#fff' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="case/[id]" options={{ title: 'Case detail' }} />
      <Stack.Screen name="disclaimer" options={{ title: 'Legal & disclaimers' }} />
    </Stack>
  );
}
