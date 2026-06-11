import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { T } from '@/lib/theme';

export default function Welcome() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const accept = async () => {
    setBusy(true);
    await AsyncStorage.setItem('disclaimer_accepted_v1', new Date().toISOString());
    router.replace('/sign-in');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, backgroundColor: T.navy }}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 72, flexGrow: 1 }}>
          <Text style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.5, color: 'rgba(201,162,39,0.7)', marginBottom: 14 }}>
            USA{'<<'}TRACKER{'<<'}COMMUNITY{'<<<<<<<<<<'}
          </Text>
          <Text style={{ fontSize: 34, color: '#fff', fontWeight: '700', marginBottom: 8 }}>
            Stamped<Text style={{ color: T.gold }}>.</Text>
          </Text>
          <Text style={{ fontSize: 16, color: '#AEB9D2', lineHeight: 24, marginBottom: 28 }}>
            Track your USCIS case and connect with others on the same journey.
          </Text>

          <View style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 18, marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: '#fff', fontWeight: '600', marginBottom: 10 }}>Before you start</Text>
            <Text style={{ fontSize: 13.5, color: '#C9D2E6', lineHeight: 21 }}>
              Stamped is an <Text style={{ color: '#fff', fontWeight: '600' }}>independent app</Text> — not
              affiliated with, endorsed by, or connected to USCIS or any government agency.{'\n\n'}
              It provides case tracking and community information only. Nothing here is{' '}
              <Text style={{ color: '#fff', fontWeight: '600' }}>legal advice</Text>. For advice about your case,
              consult a licensed immigration attorney.
            </Text>
          </View>

          <Pressable onPress={() => router.push('/disclaimer')}>
            <Text style={{ fontSize: 13, color: T.gold, textAlign: 'center', marginBottom: 24, fontWeight: '600' }}>
              Read full disclaimers & privacy
            </Text>
          </Pressable>

          <View style={{ flex: 1 }} />

          <Pressable onPress={accept} disabled={busy} style={{ backgroundColor: T.gold, borderRadius: 14, padding: 16, alignItems: 'center', opacity: busy ? 0.6 : 1 }}>
            <Text style={{ color: T.navyDeep, fontSize: 16, fontWeight: '700' }}>I understand — continue</Text>
          </Pressable>
          <Text style={{ fontSize: 11, color: '#8A96B0', textAlign: 'center', marginTop: 12, lineHeight: 16 }}>
            By continuing you acknowledge you have read and accept these terms.
          </Text>
        </ScrollView>
      </View>
    </>
  );
}
