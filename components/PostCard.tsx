import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { T } from '@/lib/theme';
import { Post } from '@/lib/types';
import { actions } from '@/lib/store';

export default function PostCard({ p }: { p: Post }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  return (
    <View style={{ backgroundColor: T.card, borderWidth: 1, borderColor: T.line, borderRadius: T.radius, padding: 14, marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: p.color, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{p.initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: T.ink }}>{p.author}</Text>
          <Text style={{ fontSize: 11.5, color: T.inkSoft }}>{p.created_label}</Text>
        </View>
        <View style={{ backgroundColor: p.is_news ? T.goldSoft : T.blueSoft, borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: p.is_news ? '#946B00' : T.navy }}>
            {p.is_news ? 'NEWS' : p.tag}
          </Text>
        </View>
      </View>
      <Text style={{ fontWeight: '700', fontSize: 15, color: T.ink, lineHeight: 20, marginBottom: 5 }}>{p.title}</Text>
      <Text style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 20 }}>{p.body}</Text>
      <View style={{ flexDirection: 'row', gap: 14, marginTop: 11 }}>
        <Pressable onPress={() => actions.toggleVote(p.id)} style={{ backgroundColor: p.voted ? T.goldSoft : 'transparent', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 4 }}>
          <Text style={{ color: p.voted ? T.gold : T.inkSoft, fontWeight: '600', fontSize: 13 }}>▲ {p.votes}</Text>
        </Pressable>
        <Pressable onPress={() => setOpen(!open)} style={{ paddingVertical: 4 }}>
          <Text style={{ color: T.inkSoft, fontWeight: '600', fontSize: 13 }}>💬 {p.comments.length}</Text>
        </Pressable>
      </View>
      {open && (
        <View style={{ borderTopWidth: 1, borderTopColor: T.line, marginTop: 10, paddingTop: 10 }}>
          {p.comments.map((c, i) => (
            <View key={i} style={{ backgroundColor: T.paper, borderRadius: 10, padding: 10, marginBottom: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: T.ink }}>{c.author}</Text>
              <Text style={{ fontSize: 13, color: T.ink, lineHeight: 18 }}>{c.text}</Text>
            </View>
          ))}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              value={draft} onChangeText={setDraft} placeholder="Add a comment…"
              style={{ flex: 1, borderWidth: 1, borderColor: T.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13 }}
            />
            <Pressable
              onPress={() => { if (draft.trim()) { actions.addComment(p.id, draft.trim()); setDraft(''); } }}
              style={{ backgroundColor: T.navy, borderRadius: 10, paddingHorizontal: 14, justifyContent: 'center' }}
            >
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>Send</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
