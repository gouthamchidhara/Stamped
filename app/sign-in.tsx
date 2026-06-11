import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { Stack } from 'expo-router';
import { T } from '@/lib/theme';
import { sendMagicLink } from '@/lib/auth';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(e)) { setErr('Enter a valid email address'); return; }
    setBusy(true); setErr('');
    try { await sendMagicLink(e); setSent(true); }
    catch (e: any) { setErr(e.message ?? 'Could not send link'); }
    finally { setBusy(false); }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, backgroundColor: T.navy, padding: 24, justifyContent: 'center' }}>
        <Text style={{ fontSize: 30, color: '#fff', fontWeight: '700', marginBottom: 6 }}>
          Stamped<Text style={{ color: T.gold }}>.</Text>
        </Text>

        {sent ? (
          <View style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 20, marginTop: 16 }}>
            <Text style={{ fontSize: 18, color: '#fff', fontWeight: '600', marginBottom: 8 }}>Check your email</Text>
            <Text style={{ fontSize: 14, color: '#C9D2E6', lineHeight: 21 }}>
              We sent a sign-in link to {email}. Tap it on this device to continue. You can close this screen.
            </Text>
            <Pressable onPress={() => setSent(false)} style={{ marginTop: 16 }}>
              <Text style={{ color: T.gold, fontWeight: '600', fontSize: 13 }}>Use a different email</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={{ fontSize: 15, color: '#AEB9D2', lineHeight: 22, marginBottom: 24 }}>
              Sign in with your email — no password needed. We'll send you a secure link.
            </Text>
            <TextInput
              value={email} onChangeText={setEmail} placeholder="you@email.com" placeholderTextColor="#7A86A0"
              autoCapitalize="none" keyboardType="email-address" autoComplete="email"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 15, color: '#fff', fontSize: 16, marginBottom: 6 }}
            />
            {err ? <Text style={{ color: '#F0997B', fontSize: 13, marginBottom: 8 }}>{err}</Text> : null}
            <Pressable onPress={submit} disabled={busy} style={{ backgroundColor: T.gold, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10, opacity: busy ? 0.6 : 1 }}>
              {busy ? <ActivityIndicator color={T.navyDeep} /> : <Text style={{ color: T.navyDeep, fontSize: 16, fontWeight: '700' }}>Send magic link</Text>}
            </Pressable>
          </>
        )}
      </View>
    </>
  );
}
