import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/lib/auth';
import { T } from '@/lib/theme';

export default function Index() {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    (async () => {
      const accepted = await AsyncStorage.getItem('disclaimer_accepted_v1');
      if (!accepted) { router.replace('/welcome'); return; }
      router.replace(session ? '/(tabs)' : '/sign-in');
    })();
  }, [loading, session]);

  return (
    <View style={{ flex: 1, backgroundColor: T.navy, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={T.gold} />
    </View>
  );
}
