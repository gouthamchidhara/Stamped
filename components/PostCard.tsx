import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { T } from '@/lib/theme';

function countOf(rel: any): number {
  if (Array.isArray(rel)) return rel[0]?.count ?? 0;
  return rel?.count ?? 0;
}
function initials(name?: string) {
  if (!name) return '··';
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function PostCard({ p, onVote, onComment }: { p: any; onVote: (id: string) => void; onComment: (id: string, body: string) => void; }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
  const author = profile?.display_name ?? 'Member';
  const color = profile?.avatar_color ?? T.navy;

  return (
    <View style={{ backgroundColor: T.card, borderWidth: 1, borderColor: T.line, borderRadius: T.radius, padding: 14, marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{initials(author)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: T.ink }}>{author}</Text>
          <Text style={{ fontSize: 11.5, color: T.inkSoft }}>{new Date(p.created_at).toLocaleDateString()}</Text>
        </View>
        <View style={{ backgroundColor: p.is_news ? T.goldSoft : T.blueSoft, borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: p.is_news ? '#946B00' : T.navy }}>{p.is_news ? 'NEWS' : p.tag}</Text>
        </View>
      </View>
      <Text style={{ fontWeight: '700', fontSize: 15, color: T.ink, lineHeight: 20, marginBottom: 5 }}>{p.title}</Text>
      {p.body ? <Text style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 20 }}>{p.body}</Text> : null}
      <View style={{ flexDirection: 'row', gap: 14, marginTop: 11 }}>
        <Pressable onPress={() => onVote(p.id)} style={{ paddingHorizontal: 6, paddingVertical: 4 }}>
          <Text style={{ color: T.inkSoft, fontWeight: '600', fontSize: 13 }}>▲ {countOf(p.votes)}</Text>
        </Pressable>
        <Pressable onPress={() => setOpen(!open)} style={{ paddingVertical: 4 }}>
          <Text style={{ color: T.inkSoft, fontWeight: '600', fontSize: 13 }}>💬 {countOf(p.comments)}</Text>
        </Pressable>
      </View>
      {open && (
        <View style={{ borderTopWidth: 1, borderTopColor: T.line, marginTop: 10, paddingTop: 10 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput value={draft} onChangeText={setDraft} placeholder="Add a comment…"
              style={{ flex: 1, borderWidth: 1, borderColor: T.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13 }} />
            <Pressable onPress={() => { if (draft.trim()) { onComment(p.id, draft.trim()); setDraft(''); } }}
              style={{ backgroundColor: T.navy, borderRadius: 10, paddingHorizontal: 14, justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>Send</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
