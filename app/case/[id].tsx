import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { T } from '@/lib/theme';
import { useStore } from '@/lib/store';

export default function CaseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cases } = useStore();
  const c = cases.find((x) => x.id === id);
  if (!c) return null;

  const days = Math.max(1, Math.round((Date.now() - new Date(c.filed_at).getTime()) / 86400000));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.paper }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: 1.5, color: T.inkSoft, marginBottom: 12 }}>{c.receipt}</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 18 }}>
        <View style={{ flex: 1, backgroundColor: T.card, borderWidth: 1, borderColor: T.line, borderRadius: 12, padding: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: T.navy }}>{days}</Text>
          <Text style={{ fontSize: 11, color: T.inkSoft, marginTop: 2 }}>Days since filing</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: T.card, borderWidth: 1, borderColor: T.line, borderRadius: 12, padding: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: T.navy }}>{c.eta}</Text>
          <Text style={{ fontSize: 11, color: T.inkSoft, marginTop: 2 }}>Est. completion</Text>
        </View>
      </View>
      <Text style={{ fontSize: 18, fontWeight: '700', color: T.ink, marginBottom: 12 }}>Journey</Text>
      <View style={{ paddingLeft: 4 }}>
        {c.steps.map((s, i) => {
          const state = i < c.step_idx ? 'done' : i === c.step_idx ? 'current' : 'future';
          return (
            <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center',
                  borderColor: state === 'future' ? T.line : state === 'done' ? T.gold : T.navy,
                  backgroundColor: state === 'done' ? T.goldSoft : state === 'current' ? T.navy : T.card,
                }}>
                  <Text style={{ fontSize: 10, color: state === 'current' ? '#fff' : '#946B00' }}>
                    {state === 'done' ? '✓' : state === 'current' ? '●' : ''}
                  </Text>
                </View>
                {i < c.steps.length - 1 && <View style={{ width: 2, flex: 1, backgroundColor: T.line, minHeight: 28 }} />}
              </View>
              <View style={{ paddingBottom: 22, flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: state === 'future' ? '#A6AFC2' : T.ink }}>{s}</Text>
                {c.step_dates[i] && (
                  <Text style={{ fontFamily: T.mono, fontSize: 11, color: T.inkSoft, marginTop: 2 }}>{c.step_dates[i]}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
      <View style={{ backgroundColor: T.blueSoft, borderRadius: 12, padding: 13 }}>
        <Text style={{ fontSize: 13, color: T.navy, lineHeight: 19 }}>
          💬 1,204 people are tracking {c.form}. See their timelines and tips in the Community tab.
        </Text>
      </View>
    </ScrollView>
  );
}
