import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { T } from '@/lib/theme';
import { supabase } from '@/lib/supabase';

const STEP_LABELS: Record<string, string[]> = {
  'I-485': ['Case Was Received','Biometrics Reused / Completed','Case Actively Being Reviewed','Interview Scheduled','New Card Is Being Produced','Case Approved'],
  'I-765': ['Case Was Received','Case Actively Being Reviewed','New Card Is Being Produced','Card Was Mailed'],
  'I-130': ['Case Was Received','Case Actively Being Reviewed','Case Approved'],
};

export default function CaseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [c, setC] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('cases').select('*, case_status_events(status, occurred_at)').eq('id', id).single();
      setC(data); setLoading(false);
    })();
  }, [id]);

  if (loading) return <View style={{ flex: 1, backgroundColor: T.paper, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={T.navy} /></View>;
  if (!c) return <View style={{ flex: 1, backgroundColor: T.paper, padding: 20 }}><Text style={{ color: T.inkSoft }}>Case not found.</Text></View>;

  const steps = STEP_LABELS[c.form_type] ?? STEP_LABELS['I-485'];
  const stepIdx = c.step_idx ?? 0;
  const days = c.filed_at ? Math.max(1, Math.round((Date.now() - new Date(c.filed_at).getTime()) / 86400000)) : '—';
  const events: any[] = c.case_status_events ?? [];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.paper }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: 1.5, color: T.inkSoft, marginBottom: 12 }}>{c.receipt_number}</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 18 }}>
        <View style={{ flex: 1, backgroundColor: T.card, borderWidth: 1, borderColor: T.line, borderRadius: 12, padding: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: T.navy }}>{days}</Text>
          <Text style={{ fontSize: 11, color: T.inkSoft, marginTop: 2 }}>Days since filing</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: T.card, borderWidth: 1, borderColor: T.line, borderRadius: 12, padding: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: T.navy }}>{c.current_status ? '●' : '—'}</Text>
          <Text style={{ fontSize: 11, color: T.inkSoft, marginTop: 2 }}>{c.current_status ?? 'Awaiting first check'}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 18, fontWeight: '700', color: T.ink, marginBottom: 12 }}>Journey</Text>
      <View style={{ paddingLeft: 4 }}>
        {steps.map((s, i) => {
          const state = i < stepIdx ? 'done' : i === stepIdx ? 'current' : 'future';
          const evt = events.find((e) => e.status === s);
          return (
            <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ alignItems: 'center' }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center',
                  borderColor: state === 'future' ? T.line : state === 'done' ? T.gold : T.navy,
                  backgroundColor: state === 'done' ? T.goldSoft : state === 'current' ? T.navy : T.card }}>
                  <Text style={{ fontSize: 10, color: state === 'current' ? '#fff' : '#946B00' }}>{state === 'done' ? '✓' : state === 'current' ? '●' : ''}</Text>
                </View>
                {i < steps.length - 1 && <View style={{ width: 2, flex: 1, backgroundColor: T.line, minHeight: 28 }} />}
              </View>
              <View style={{ paddingBottom: 22, flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: state === 'future' ? '#A6AFC2' : T.ink }}>{s}</Text>
                {evt && <Text style={{ fontFamily: T.mono, fontSize: 11, color: T.inkSoft, marginTop: 2 }}>{new Date(evt.occurred_at).toLocaleDateString()}</Text>}
              </View>
            </View>
          );
        })}
      </View>
      <View style={{ backgroundColor: T.blueSoft, borderRadius: 12, padding: 13 }}>
        <Text style={{ fontSize: 13, color: T.navy, lineHeight: 19 }}>See {c.form_type} timelines and tips from others in the Community tab.</Text>
      </View>
    </ScrollView>
  );
}
