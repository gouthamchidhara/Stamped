import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { T } from '@/lib/theme';
import { sendOtpCode, verifyOtpCode } from '@/lib/auth';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submitEmail = async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(e)) { setErr('Enter a valid email address'); return; }
    setBusy(true); setErr('');
    try { await sendOtpCode(e); setSent(true); }
    catch (e: any) { setErr(e.message ?? 'Could not send code'); }
    finally { setBusy(false); }
  };

  const submitCode = async () => {
    const c = code.trim();
    if (!/^\d{6}$/.test(c)) { setErr('Enter the 6-digit code'); return; }
    setBusy(true); setErr('');
    try { await verifyOtpCode(email.trim().toLowerCase(), c); router.replace('/(tabs)'); }
    catch (e: any) { setErr(e.message ?? 'Invalid or expired code'); }
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
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 18, color: '#fff', fontWeight: '600', marginBottom: 8 }}>Enter your code</Text>
            <Text style={{ fontSize: 14, color: '#C9D2E6', lineHeight: 21, marginBottom: 18 }}>
              We emailed a 6-digit code to {email}. Enter it below to sign in.
            </Text>
            <TextInput
              value={code} onChangeText={setCode} placeholder="123456" placeholderTextColor="#7A86A0"
              keyboardType="number-pad" maxLength={6} autoFocus
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 15, color: '#fff', fontSize: 22, letterSpacing: 6, textAlign: 'center', marginBottom: 6 }}
            />
            {err ? <Text style={{ color: '#F0997B', fontSize: 13, marginBottom: 8 }}>{err}</Text> : null}
            <Pressable onPress={submitCode} disabled={busy} style={{ backgroundColor: T.gold, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10, opacity: busy ? 0.6 : 1 }}>
              {busy ? <ActivityIndicator color={T.navyDeep} /> : <Text style={{ color: T.navyDeep, fontSize: 16, fontWeight: '700' }}>Verify & sign in</Text>}
            </Pressable>
            <Pressable onPress={() => { setSent(false); setCode(''); setErr(''); }} style={{ marginTop: 16 }}>
              <Text style={{ color: T.gold, fontWeight: '600', fontSize: 13 }}>Use a different email</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={{ fontSize: 15, color: '#AEB9D2', lineHeight: 22, marginBottom: 24 }}>
              Sign in with your email — no password needed. We'll send you a 6-digit code.
            </Text>
            <TextInput
              value={email} onChangeText={setEmail} placeholder="you@email.com" placeholderTextColor="#7A86A0"
              autoCapitalize="none" keyboardType="email-address" autoComplete="email"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 15, color: '#fff', fontSize: 16, marginBottom: 6 }}
            />
            {err ? <Text style={{ color: '#F0997B', fontSize: 13, marginBottom: 8 }}>{err}</Text> : null}
            <Pressable onPress={submitEmail} disabled={busy} style={{ backgroundColor: T.gold, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10, opacity: busy ? 0.6 : 1 }}>
              {busy ? <ActivityIndicator color={T.navyDeep} /> : <Text style={{ color: T.navyDeep, fontSize: 16, fontWeight: '700' }}>Send code</Text>}
            </Pressable>
          </>
        )}
      </View>
    </>
  );
}
