import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { T } from '@/lib/theme';
import { signIn, signUp } from '@/lib/auth';

export default function SignIn() {
  const router = useRouter();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(e)) { setErr('Enter a valid email address'); return; }
    if (password.length < 8) { setErr('Password must be at least 8 characters'); return; }
    setBusy(true); setErr('');
    try {
      if (mode === 'up') await signUp(e, password);
      else await signIn(e, password);
      router.replace('/(tabs)');
    } catch (ex: any) {
      setErr(ex.message ?? 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: T.navy }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
          <Text style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.5, color: 'rgba(201,162,39,0.7)', marginBottom: 12 }}>
            USA{'<<'}TRACKER{'<<'}COMMUNITY{'<<<<<<<<<<'}
          </Text>
          <Text style={{ fontSize: 30, color: '#fff', fontWeight: '700', marginBottom: 6 }}>
            Stamped<Text style={{ color: T.gold }}>.</Text>
          </Text>
          <Text style={{ fontSize: 15, color: '#AEB9D2', lineHeight: 22, marginBottom: 24 }}>
            {mode === 'in' ? 'Sign in to your account.' : 'Create your account.'}
          </Text>

          <TextInput
            value={email} onChangeText={setEmail} placeholder="you@email.com" placeholderTextColor="#7A86A0"
            autoCapitalize="none" keyboardType="email-address" autoComplete="email"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 15, color: '#fff', fontSize: 16, marginBottom: 10 }}
          />
          <TextInput
            value={password} onChangeText={setPassword} placeholder="Password (8+ characters)" placeholderTextColor="#7A86A0"
            secureTextEntry autoCapitalize="none" autoComplete={mode === 'up' ? 'new-password' : 'current-password'}
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 15, color: '#fff', fontSize: 16, marginBottom: 6 }}
          />
          {err ? <Text style={{ color: '#F0997B', fontSize: 13, marginBottom: 6 }}>{err}</Text> : null}

          <Pressable onPress={submit} disabled={busy} style={{ backgroundColor: T.gold, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10, opacity: busy ? 0.6 : 1 }}>
            {busy ? <ActivityIndicator color={T.navyDeep} /> : (
              <Text style={{ color: T.navyDeep, fontSize: 16, fontWeight: '700' }}>
                {mode === 'in' ? 'Sign in' : 'Create account'}
              </Text>
            )}
          </Pressable>

          <Pressable onPress={() => { setMode(mode === 'in' ? 'up' : 'in'); setErr(''); }} style={{ marginTop: 18 }}>
            <Text style={{ color: T.gold, textAlign: 'center', fontWeight: '600', fontSize: 14 }}>
              {mode === 'in' ? "New here? Create an account" : 'Already have an account? Sign in'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
