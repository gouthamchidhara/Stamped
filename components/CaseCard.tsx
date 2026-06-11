import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '@/lib/theme';
import { Case } from '@/lib/types';
import { maskReceipt } from '@/lib/store';
import StatusStamp from './StatusStamp';

export default function CaseCard({ c }: { c: Case }) {
  const router = useRouter();
  const pct = Math.round(((c.step_idx + 1) / c.steps.length) * 100);
  return (
    <Pressable
      onPress={() => router.push(`/case/${c.id}`)}
      style={({ pressed }) => ({
        backgroundColor: T.card, borderWidth: 1, borderColor: T.line, borderRadius: T.radius,
        padding: 14, marginBottom: 12, transform: [{ scale: pressed ? 0.985 : 1 }],
      })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <View style={{ alignSelf: 'flex-start', backgroundColor: T.blueSoft, borderRadius: 6, paddingHorizontal: 9, paddingVertical: 3 }}>
            <Text style={{ color: T.navy, fontWeight: '700', fontSize: 12 }}>{c.form}</Text>
          </View>
          <Text style={{ fontWeight: '600', fontSize: 15, color: T.ink, marginTop: 6 }}>{c.nick}</Text>
          <Text style={{ fontFamily: T.mono, fontSize: 11.5, color: T.inkSoft, letterSpacing: 1.2, marginTop: 3 }}>
            {maskReceipt(c.receipt)}
          </Text>
        </View>
        <StatusStamp kind={c.stamp} label={c.stamp_text} />
      </View>
      <View style={{ marginTop: 10 }}>
        <View style={{ height: 6, backgroundColor: T.line, borderRadius: 3, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${pct}%`, backgroundColor: T.gold, borderRadius: 3 }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
          <Text style={{ fontSize: 11.5, color: T.inkSoft }}>{c.steps[c.step_idx]}</Text>
          <Text style={{ fontSize: 11.5, color: T.inkSoft }}>{pct}%</Text>
        </View>
      </View>
      <Text style={{ fontSize: 11, color: T.inkSoft, marginTop: 8 }}>● Checked 12 min ago · est. {c.eta}</Text>
    </Pressable>
  );
}
