import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { T, stampStyles } from '@/lib/theme';
import { maskReceipt } from '@/lib/store';

// Maps a DB case row (with case_status_events) to display fields.
const STEP_LABELS: Record<string, string[]> = {
  'I-485': ['Case Was Received','Biometrics Reused / Completed','Case Actively Being Reviewed','Interview Scheduled','New Card Is Being Produced','Case Approved'],
  'I-765': ['Case Was Received','Case Actively Being Reviewed','New Card Is Being Produced','Card Was Mailed'],
  'I-130': ['Case Was Received','Case Actively Being Reviewed','Case Approved'],
};

function stampFor(stepIdx: number, total: number): { kind: keyof typeof stampStyles; text: string } {
  if (stepIdx >= total - 1) return { kind: 'approved', text: 'Approved' };
  if (stepIdx >= total - 2) return { kind: 'approved', text: 'Card Producing' };
  if (stepIdx === 0) return { kind: 'received', text: 'Received' };
  return { kind: 'review', text: 'In Review' };
}

export default function CaseCard({ c }: { c: any }) {
  const router = useRouter();
  const steps = STEP_LABELS[c.form_type] ?? STEP_LABELS['I-485'];
  // The poller writes step indices on an I-485 scale (0-5); clamp for shorter forms.
  const stepIdx = Math.min(c.step_idx ?? 0, steps.length - 1);
  const pct = Math.round(((stepIdx + 1) / steps.length) * 100);
  const stamp = stampFor(stepIdx, steps.length);
  const s = stampStyles[stamp.kind];

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
            <Text style={{ color: T.navy, fontWeight: '700', fontSize: 12 }}>{c.form_type}</Text>
          </View>
          <Text style={{ fontWeight: '600', fontSize: 15, color: T.ink, marginTop: 6 }}>{c.nickname || 'My case'}</Text>
          <Text style={{ fontFamily: T.mono, fontSize: 11.5, color: T.inkSoft, letterSpacing: 1.2, marginTop: 3 }}>
            {maskReceipt(c.receipt_number)}
          </Text>
        </View>
        <View style={{ borderWidth: 1.5, borderColor: s.border, backgroundColor: s.bg, borderRadius: 5, paddingHorizontal: 8, paddingVertical: 4, transform: [{ rotate: '-2deg' }] }}>
          <Text style={{ color: s.color, fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' }}>{stamp.text}</Text>
        </View>
      </View>
      <View style={{ marginTop: 10 }}>
        <View style={{ height: 6, backgroundColor: T.line, borderRadius: 3, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${pct}%`, backgroundColor: T.gold, borderRadius: 3 }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
          <Text style={{ fontSize: 11.5, color: T.inkSoft }}>{steps[stepIdx]}</Text>
          <Text style={{ fontSize: 11.5, color: T.inkSoft }}>{pct}%</Text>
        </View>
      </View>
      <Text style={{ fontSize: 11, color: T.inkSoft, marginTop: 8 }}>
        ● {c.last_checked_at ? 'Checked ' + new Date(c.last_checked_at).toLocaleDateString() : 'Not checked yet'}
      </Text>
    </Pressable>
  );
}
