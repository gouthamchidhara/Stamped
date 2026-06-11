import { Tabs, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Text } from 'react-native';
import { T } from '@/lib/theme';

const icon = (e: string) => ({ color }: { color: string }) => <Text style={{ fontSize: 18, color }}>{e}</Text>;

export default function TabLayout() {
  const router = useRouter();
  return (
    <Tabs screenOptions={{
      headerStyle: { backgroundColor: T.navy },
      headerTitleStyle: { color: '#fff', fontWeight: '700' },
      tabBarActiveTintColor: T.navy,
      tabBarInactiveTintColor: '#9AA3B5',
    }}>
      <Tabs.Screen name="index" options={{
        title: 'Cases', headerTitle: 'Stamped.', tabBarIcon: icon('🗂'),
        headerRight: () => (
          <Pressable onPress={() => router.push('/disclaimer')} style={{ marginRight: 14 }}>
            <Text style={{ color: '#fff', fontSize: 18 }}>ⓘ</Text>
          </Pressable>
        ),
      }} />
      <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: icon('💬') }} />
      <Tabs.Screen name="times" options={{ title: 'Times', headerTitle: 'Processing times', tabBarIcon: icon('⏱') }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alerts', tabBarIcon: icon('🔔'), tabBarBadge: 3 }} />
    </Tabs>
  );
}
