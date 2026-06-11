import { Text, View } from 'react-native';
import { stampStyles } from '@/lib/theme';
import { StampKind } from '@/lib/types';

export default function StatusStamp({ kind, label }: { kind: StampKind; label: string }) {
  const s = stampStyles[kind];
  return (
    <View style={{
      borderWidth: 1.5, borderColor: s.border, backgroundColor: s.bg,
      borderRadius: 5, paddingHorizontal: 8, paddingVertical: 4,
      transform: [{ rotate: '-2deg' }],
    }}>
      <Text style={{ color: s.color, fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' }}>
        {label}
      </Text>
    </View>
  );
}
