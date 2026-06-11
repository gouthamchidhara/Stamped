import { useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { T } from '@/lib/theme';
import { usePosts } from '@/lib/store';
import PostCard from '@/components/PostCard';
import { DisclaimerBanner } from '@/components/Disclaimer';

const FILTERS = ['all', 'news', 'I-485', 'I-765', 'I-130', 'N-400'];
const TAGS = ['I-485', 'I-765', 'I-130', 'N-400'];

export default function CommunityScreen() {
  const [filter, setFilter] = useState('all');
  const { posts, loading, error, reload, vote, comment, create } = usePosts(filter);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tag, setTag] = useState('I-485');
  const [saving, setSaving] = useState(false);

  const publish = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try { await create(title.trim(), body.trim(), tag); setTitle(''); setBody(''); setShow(false); }
    finally { setSaving(false); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.paper }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, gap: 8 }}>
        {FILTERS.map((f) => (
          <Pressable key={f} onPress={() => setFilter(f)} style={{ borderWidth: 1, borderColor: filter === f ? T.navy : T.line, backgroundColor: filter === f ? T.navy : T.card, borderRadius: 99, paddingHorizontal: 13, paddingVertical: 7, height: 34 }}>
            <Text style={{ fontSize: 12.5, fontWeight: '600', color: filter === f ? '#fff' : T.inkSoft }}>
              {f === 'all' ? 'All' : f === 'news' ? '📰 News' : f}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={T.navy} /></View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={false} onRefresh={reload} />}
          ListEmptyComponent={
            <Text style={{ color: T.inkSoft, fontSize: 14, textAlign: 'center', padding: 24 }}>
              {error ? `Couldn't load posts: ${error}` : 'No posts yet. Be the first to share.'}
            </Text>
          }
          renderItem={({ item }) => <PostCard p={item} onVote={vote} onComment={comment} />}
          ListFooterComponent={<DisclaimerBanner />}
        />
      )}
      <Pressable onPress={() => setShow(true)} style={{ position: 'absolute', bottom: 20, right: 18, width: 52, height: 52, borderRadius: 26, backgroundColor: T.gold, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>
        <Text style={{ fontSize: 22, color: T.navyDeep }}>✎</Text>
      </Pressable>
      <Modal visible={show} animationType="slide" transparent onRequestClose={() => setShow(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(14,22,38,0.5)' }} onPress={() => setShow(false)} />
        <View style={{ backgroundColor: T.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 34 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: T.ink }}>New post</Text>
          <Text style={{ fontSize: 13, color: T.inkSoft, marginVertical: 10 }}>Share a timeline, tip, or question. Don't include personal info.</Text>
          <TextInput value={title} onChangeText={setTitle} placeholder="Title" style={{ borderWidth: 1, borderColor: T.line, borderRadius: 11, padding: 12, marginBottom: 11 }} />
          <TextInput value={body} onChangeText={setBody} placeholder="Details" multiline style={{ borderWidth: 1, borderColor: T.line, borderRadius: 11, padding: 12, minHeight: 80, marginBottom: 11, textAlignVertical: 'top' }} />
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 13 }}>
            {TAGS.map((t) => (
              <Pressable key={t} onPress={() => setTag(t)} style={{ borderWidth: 1, borderColor: tag === t ? T.navy : T.line, backgroundColor: tag === t ? T.navy : T.card, borderRadius: 99, paddingHorizontal: 13, paddingVertical: 7 }}>
                <Text style={{ fontSize: 12.5, fontWeight: '600', color: tag === t ? '#fff' : T.inkSoft }}>{t}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable onPress={publish} disabled={saving} style={{ backgroundColor: T.navy, borderRadius: 12, padding: 14, alignItems: 'center', opacity: saving ? 0.6 : 1 }}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Post to community</Text>}
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
