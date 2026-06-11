import { ScrollView, Text, View } from 'react-native';
import { T } from '@/lib/theme';

const ALERTS = [
  { icon: '✅', bg: T.greenSoft, title: 'Status changed — I-765', body: 'New Card Is Being Produced', time: 'Today, 9:41 AM' },
  { icon: '💬', bg: T.goldSoft, title: 'Priya replied to your comment', body: '"Same! NBC seems to be moving fast this month."', time: 'Yesterday' },
  { icon: '📰', bg: T.blueSoft, title: 'News for your forms', body: 'New USCIS fee schedule takes effect July 1', time: '2 days ago' },
  { icon: '📈', bg: T.blueSoft, title: 'Processing time update', body: 'I-485 at NBC dropped from 12.1 → 11.5 months', time: '4 days ago' },
];

export default function AlertsScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.paper }} contentContainerStyle={{ padding: 16 }}>
      {ALERTS.map((a, i) => (
        <View key={i} style={{ backgroundColor: T.card, borderWidth: 1, borderColor: T.line, borderRadius: 12, padding: 13, marginBottom: 10, flexDirection: 'row', gap: 11 }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: a.bg, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16 }}>{a.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: T.ink }}>{a.title}</Text>
            <Text style={{ fontSize: 13, color: T.ink, lineHeight: 18 }}>{a.body}</Text>
            <Text style={{ fontSize: 11, color: T.inkSoft, marginTop: 3 }}>{a.time}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
