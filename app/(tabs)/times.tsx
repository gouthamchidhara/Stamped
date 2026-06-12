import { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { T } from '@/lib/theme';
import { supabase } from '@/lib/supabase';

interface MedianRow { form_type: string; median_days: number; sample_size: number; }

const FORM_NAMES: Record<string, string> = {
  'I-485': 'Adjustment of Status',
  'I-765': 'Work Authorization',
  'I-130': 'Petition for Relative',
  'I-140': 'Immigrant Worker Petition',
  'N-400': 'Naturalization',
  'I-129': 'Nonimmigrant Worker',
  'I-90': 'Green Card Replacement',
  'I-751': 'Remove Conditions',
};

export default function TimesScreen() {
  const [rows, setRows] = useState<MedianRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('processing_medians').select('*');
    setRows((data as MedianRow[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  if (loading) return <View style={{ flex: 1, backgroundColor: T.paper, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={T.navy} /></View>;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.paper }} contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={load} />}>
      <View style={{ backgroundColor: T.goldSoft, borderRadius: 12, padding: 13, marginBottom: 14 }}>
        <Text style={{ fontSize: 12.5, color: '#7A5C00', lineHeight: 18 }}>
          Medians computed from community-reported case timelines. Your case may vary — always check your official USCIS account.
        </Text>
      </View>
      {rows.length === 0 ? (
        <View style={{ backgroundColor: T.card, borderWidth: 1, borderColor: T.line, borderRadius: 12, padding: 18 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: T.ink, marginBottom: 6 }}>Building community data</Text>
          <Text style={{ fontSize: 13, color: T.inkSoft, lineHeight: 20 }}>
            Processing time medians appear here once enough members are tracking cases of each form type.
            Each median requires at least 10 completed timelines to protect privacy. For official estimates,
            visit egov.uscis.gov/processing-times.
          </Text>
        </View>
      ) : (
        rows.map((r) => (
          <View key={r.form_type} style={{ backgroundColor: T.card, borderWidth: 1, borderColor: T.line, borderRadius: 12, padding: 13, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontFamily: T.mono, fontWeight: '600', fontSize: 13, color: T.navy, width: 54 }}>{r.form_type}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: T.ink }}>{FORM_NAMES[r.form_type] ?? r.form_type}</Text>
              <Text style={{ fontSize: 11.5, color: T.inkSoft }}>{r.sample_size} community timelines</Text>
            </View>
            <Text style={{ fontSize: 17, color: T.navy, fontWeight: '700' }}>{(r.median_days / 30.4).toFixed(1)} mo</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}
