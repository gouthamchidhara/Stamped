import { ScrollView, Text, View } from 'react-native';
import { T } from '@/lib/theme';

const ROWS = [
  { form: 'I-485', name: 'Adjustment of Status', office: 'National Benefits Center', months: '11.5', trend: 'faster' },
  { form: 'I-765', name: 'Work Authorization', office: 'National Benefits Center', months: '2.1', trend: 'faster' },
  { form: 'I-130', name: 'Petition for Relative', office: 'Texas Service Center', months: '13.8', trend: 'slower' },
  { form: 'I-140', name: 'Immigrant Worker Petition', office: 'Texas Service Center', months: '7.2', trend: 'slower' },
  { form: 'N-400', name: 'Naturalization', office: 'Dallas Field Office', months: '5.9', trend: 'faster' },
];

export default function TimesScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.paper }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ backgroundColor: T.goldSoft, borderRadius: 12, padding: 13, marginBottom: 14 }}>
        <Text style={{ fontSize: 12.5, color: '#7A5C00', lineHeight: 18 }}>
          ⚖️ Medians from community-reported timelines + official USCIS data. Your case may vary.
        </Text>
      </View>
      {ROWS.map((r) => (
        <View key={r.form} style={{ backgroundColor: T.card, borderWidth: 1, borderColor: T.line, borderRadius: 12, padding: 13, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={{ fontFamily: T.mono, fontWeight: '600', fontSize: 13, color: T.navy, width: 54 }}>{r.form}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: T.ink }}>{r.name}</Text>
            <Text style={{ fontSize: 11.5, color: T.inkSoft }}>{r.office}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 17, color: T.navy, fontWeight: '700' }}>{r.months} mo</Text>
            <Text style={{ fontSize: 11, fontWeight: '700', color: r.trend === 'faster' ? T.green : T.red }}>
              {r.trend === 'faster' ? '▼ faster' : '▲ slower'}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
