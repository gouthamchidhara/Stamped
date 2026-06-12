import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '@/lib/theme';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/lib/auth';

interface EventRow { status: string; occurred_at: string; created_at: string; cases: { nickname: string | null; form_type: string } | null; }

export default function AlertsScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = async () => {
    const { data, error } = await supabase
      .from('case_status_events')
      .select('status, occurred_at, created_at, cases!inner(nickname, form_type)')
      .order('created_at', { ascending: false })
      .limit(30);
    setErr(error?.message ?? '');
    setEvents((data as unknown as EventRow[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const doSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: async () => { await signOut(); router.replace('/sign-in'); } },
    ]);
  };

  if (loading) return <View style={{ flex: 1, backgroundColor: T.paper, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={T.navy} /></View>;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.paper }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={load} />}>
      {events.length === 0 ? (
        <View style={{ backgroundColor: T.card, borderWidth: 1, borderColor: T.line, borderRadius: 12, padding: 18, marginBottom: 14 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: T.ink, marginBottom: 6 }}>
            {err ? "Couldn't load updates" : 'No updates yet'}
          </Text>
          <Text style={{ fontSize: 13, color: T.inkSoft, lineHeight: 20 }}>
            {err
              ? `${err}\nPull down to try again.`
              : "When USCIS updates the status of a case you're tracking, the change appears here. Statuses are checked automatically several times a day."}
          </Text>
        </View>
      ) : (
        events.map((e, i) => (
          <View key={i} style={{ backgroundColor: T.card, borderWidth: 1, borderColor: T.line, borderRadius: 12, padding: 13, marginBottom: 10, flexDirection: 'row', gap: 11 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.greenSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 16 }}>✓</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: T.ink }}>
                {e.cases?.nickname || e.cases?.form_type || 'Your case'}
              </Text>
              <Text style={{ fontSize: 13, color: T.ink, lineHeight: 18 }}>{e.status}</Text>
              <Text style={{ fontSize: 11, color: T.inkSoft, marginTop: 3 }}>{new Date(e.created_at).toLocaleString()}</Text>
            </View>
          </View>
        ))
      )}

      <Text style={{ fontSize: 12, fontWeight: '700', color: T.inkSoft, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 18, marginBottom: 8 }}>Account</Text>
      <Pressable onPress={doSignOut} style={{ backgroundColor: T.card, borderWidth: 1, borderColor: T.line, borderRadius: 12, padding: 14 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: T.red }}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}
