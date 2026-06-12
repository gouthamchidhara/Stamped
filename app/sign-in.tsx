import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { T } from '@/lib/theme';
import { sendMagicLink, useAuth } from '@/lib/auth';

export default function SignIn() {
  const router = useRouter();
  const { session, linking, linkError } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  // Session appears once the user taps the link in their email.
  useEffect(() => {
    if (session) router.replace('/(tabs)');
  }, [session]);

  const submit = async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(e)) { setErr('Enter a valid email address'); return; }
    setBusy(true); setErr('');
    try {
      await sendMagicLink(e);
      setSent(true);
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

          {linking ? (
            <View style={{ alignItems: 'center', paddingVertical: 12 }}>
              <ActivityIndicator color={T.gold} />
              <Text style={{ fontSize: 15, color: '#AEB9D2', lineHeight: 22, marginTop: 16 }}>
                Finishing sign-in…
              </Text>
            </View>
          ) : sent ? (
            <View>
              <Text style={{ fontSize: 15, color: '#AEB9D2', lineHeight: 22, marginBottom: 24 }}>
                We sent a sign-in link to{'\n'}
                <Text style={{ color: '#fff', fontWeight: '600' }}>{email.trim().toLowerCase()}</Text>
              </Text>
              {linkError ? <Text style={{ color: '#F0997B', fontSize: 13, marginBottom: 16 }}>{linkError}</Text> : null}
              <Text style={{ fontSize: 14, color: '#AEB9D2', lineHeight: 21, marginBottom: 24 }}>
                Open the email and tap the link to confirm — you'll be signed in here automatically. No password needed.
              </Text>
              <Pressable onPress={() => { setSent(false); setErr(''); }} style={{ marginTop: 6 }}>
                <Text style={{ color: T.gold, textAlign: 'center', fontWeight: '600', fontSize: 14 }}>
                  Use a different email or resend
                </Text>
              </Pressable>
            </View>
          ) : (
            <View>
              <Text style={{ fontSize: 15, color: '#AEB9D2', lineHeight: 22, marginBottom: 24 }}>
                Enter your email and we'll send you a sign-in link. No password needed.
              </Text>

              <TextInput
                value={email} onChangeText={setEmail} placeholder="you@email.com" placeholderTextColor="#7A86A0"
                autoCapitalize="none" keyboardType="email-address" autoComplete="email"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 15, color: '#fff', fontSize: 16, marginBottom: 6 }}
              />
              {(err || linkError) ? <Text style={{ color: '#F0997B', fontSize: 13, marginBottom: 6 }}>{err || linkError}</Text> : null}

              <Pressable onPress={submit} disabled={busy} style={{ backgroundColor: T.gold, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10, opacity: busy ? 0.6 : 1 }}>
                {busy ? <ActivityIndicator color={T.navyDeep} /> : (
                  <Text style={{ color: T.navyDeep, fontSize: 16, fontWeight: '700' }}>
                    Email me a sign-in link
                  </Text>
                )}
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
