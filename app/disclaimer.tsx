import { ScrollView, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { T } from '@/lib/theme';

function Block({ title, children }: { title: string; children: string }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={{ fontSize: 15, fontWeight: '600', color: T.ink, marginBottom: 6 }}>{title}</Text>
      <Text style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 21 }}>{children}</Text>
    </View>
  );
}

export default function DisclaimerScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Legal & disclaimers' }} />
      <ScrollView style={{ flex: 1, backgroundColor: T.paper }} contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>
        <View style={{ backgroundColor: T.goldSoft, borderRadius: 12, padding: 14, marginBottom: 20 }}>
          <Text style={{ fontSize: 13.5, color: '#7A5C00', lineHeight: 20, fontWeight: '600' }}>
            Stamped is an independent application. It is not affiliated with, endorsed by, sponsored by, or
            connected to U.S. Citizenship and Immigration Services (USCIS), the Department of Homeland Security,
            or any government agency.
          </Text>
        </View>

        <Block title="Not legal advice">
          Stamped provides case-status tracking and a community space for general information sharing. Nothing in
          this app is legal advice and no attorney-client relationship is created by using it. Immigration matters
          are fact-specific — consult a licensed immigration attorney or an accredited representative for advice
          about your situation.
        </Block>

        <Block title="Not affiliated with USCIS">
          Case status data originates from USCIS systems but Stamped is a private, independent product. USCIS does
          not review, endorse, or guarantee anything shown here. Official information always lives at uscis.gov.
        </Block>

        <Block title="No guarantee of accuracy">
          Statuses, processing times, and community-reported timelines may be delayed, incomplete, or inaccurate.
          Estimated completion dates are projections, not promises. Always verify anything important against your
          official USCIS notices and account.
        </Block>

        <Block title="Community content">
          Posts and comments reflect the views of individual users, not Stamped. Community members are not
          verified attorneys unless explicitly labeled. Treat tips as personal experience, not professional
          guidance, and never share another person's receipt number or personal information.
        </Block>

        <Block title="Your privacy">
          Receipt numbers are masked in the interface and are never shown in community posts. Do not post personal
          identifiers. See our Privacy Policy for how data is stored and handled.
        </Block>

        <Text style={{ fontSize: 12, color: T.inkSoft, lineHeight: 18, marginTop: 6 }}>
          By using Stamped you acknowledge that you have read and understood these disclaimers.
        </Text>
      </ScrollView>
    </>
  );
}
