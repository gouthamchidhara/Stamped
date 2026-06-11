import { Text, View } from 'react-native';
import { T } from '@/lib/theme';

// Compact disclaimer banner — drop into any screen footer.
export function DisclaimerBanner() {
  return (
    <View style={{ backgroundColor: T.paper, borderWidth: 1, borderColor: T.line, borderRadius: 10, padding: 11, marginTop: 6 }}>
      <Text style={{ fontSize: 11, color: T.inkSoft, lineHeight: 16, textAlign: 'center' }}>
        Stamped is an independent app and is not affiliated with, endorsed by, or connected to USCIS or any
        government agency. Information is provided for tracking convenience only and is not legal advice.
      </Text>
    </View>
  );
}
