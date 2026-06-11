import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { T } from '@/lib/theme';
import { actions, useStore } from '@/lib/store';
import { validateReceipt } from '@/lib/validate';
import CaseCard from '@/components/CaseCard';

export default function CasesScreen() {
  const { cases } = useStore();
  const [show, setShow] = useState(false);
  const [receipt, setReceipt] = useState('');
  const [nick, setNick] = useState('');

  const [error, setError] = useState('');
  const add = () => {
    const v = validateReceipt(receipt);
    if (!v.ok) { setError(v.error ?? 'Invalid receipt number'); return; }
    actions.addCase(v.value, nick.trim());
    setReceipt(''); setNick(''); setError(''); setShow(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.paper }}>
      <FlatList
        data={cases}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <CaseCard c={item} />}
        ListFooterComponent={
          <Pressable onPress={() => setShow(true)} style={{ borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#B9C3D6', borderRadius: T.radius, padding: 14, alignItems: 'center' }}>
            <Text style={{ color: T.navy, fontWeight: '600' }}>＋ Track a new receipt number</Text>
          </Pressable>
        }
      />
      <Modal visible={show} animationType="slide" transparent onRequestClose={() => setShow(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(14,22,38,0.5)' }} onPress={() => setShow(false)} />
        <View style={{ backgroundColor: T.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 34 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: T.ink }}>Track a case</Text>
          <Text style={{ fontSize: 13, color: T.inkSoft, marginVertical: 10 }}>
            Enter the 13-character receipt number from your USCIS notice (Form I-797).
          </Text>
          <TextInput
            value={receipt} onChangeText={setReceipt} placeholder="IOE0000000000"
            autoCapitalize="characters" maxLength={13}
            style={{ borderWidth: 1, borderColor: error ? T.red : T.line, borderRadius: 11, padding: 12, fontFamily: T.mono, letterSpacing: 1.5, marginBottom: 4 }}
          />
          {error ? <Text style={{ color: T.red, fontSize: 12, marginBottom: 8 }}>{error}</Text> : <Text style={{ marginBottom: 8 }} />}
          <TextInput
            value={nick} onChangeText={setNick} placeholder="Nickname (e.g. My green card)"
            style={{ borderWidth: 1, borderColor: T.line, borderRadius: 11, padding: 12, marginBottom: 11 }}
          />
          <Pressable onPress={add} style={{ backgroundColor: T.navy, borderRadius: 12, padding: 14, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Start tracking</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
