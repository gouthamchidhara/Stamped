import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { T } from '@/lib/theme';

// Entry gate: route to welcome on first launch, else into the app.
export default function Index() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const accepted = await AsyncStorage.getItem('disclaimer_accepted_v1');
      router.replace(accepted ? '/(tabs)' : '/welcome');
    })();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: T.navy, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={T.gold} />
    </View>
  );
}
