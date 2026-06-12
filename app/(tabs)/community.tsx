import { useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { T } from '@/lib/theme';
import { usePosts } from '@/lib/store';
import PostCard from '@/components/PostCard';
import { DisclaimerBanner } from '@/components/Disclaimer';

const FILTERS = ['all', 'news', 'I-485', 'I-765', 'I-130', 'I-140', 'N-400'];
const TAGS = ['I-485', 'I-765', 'I-130', 'I-140', 'N-400', 'General'];

export default function CommunityScreen() {
  const [filter, setFilter] = useState('all');
  const { posts, loading, error, reload, vote, comment, create } = usePosts(filter);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tag, setTag] = useState('I-485');
  const [saving, setSaving] = useState(false);
  const [postErr, setPostErr] = useState('');

  const publish = async () => {
    if (!title.trim()) { setPostErr('Add a title first'); return; }
    setSaving(true); setPostErr('');
    try { await create(title.trim(), body.trim(), tag); setTitle(''); setBody(''); setShow(false); }
    catch (e: any) { setPostErr(e.message ?? 'Could not post'); }
    finally { setSaving(false); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.paper }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, gap: 8 }} keyboardShouldPersistTaps="handled">
        {FILTERS.map((f) => (
          <Pressable key={f} onPress={() => setFilter(f)} style={{ borderWidth: 1, borderColor: filter === f ? T.navy : T.line, backgroundColor: filter === f ? T.navy : T.card, borderRadius: 99, paddingHorizontal: 13, paddingVertical: 7, height: 34 }}>
            <Text style={{ fontSize: 12.5, fontWeight: '600', color: filter === f ? '#fff' : T.inkSoft }}>
              {f === 'all' ? 'All' : f === 'news' ? 'News' : f}
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
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={false} onRefresh={reload} />}
          ListEmptyComponent={
            <Text style={{ color: T.inkSoft, fontSize: 14, textAlign: 'center', padding: 24, lineHeight: 21 }}>
              {error ? `Couldn't load posts: ${error}` : 'No posts yet.\nBe the first to share a timeline or tip.'}
            </Text>
          }
          renderItem={({ item }) => <PostCard p={item} onVote={vote} onComment={comment} />}
          ListFooterComponent={<DisclaimerBanner />}
        />
      )}
      <Pressable onPress={() => setShow(true)} style={{ position: 'absolute', bottom: 20, right: 18, width: 52, height: 52, borderRadius: 26, backgroundColor: T.gold, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: T.gold, shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }}>
        <Text style={{ fontSize: 22, color: T.navyDeep }}>✎</Text>
      </Pressable>
      <Modal visible={show} animationType="slide" transparent onRequestClose={() => setShow(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pressable style={{ flex: 1 }} onPress={() => setShow(false)} />
          <View style={{ backgroundColor: T.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 34 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: T.ink }}>New post</Text>
            <Text style={{ fontSize: 13, color: T.inkSoft, marginVertical: 10 }}>
              Share a timeline, tip, or question. Don't include receipt numbers or personal info.
            </Text>
            <TextInput value={title} onChangeText={setTitle} placeholder="Title" placeholderTextColor="#9AA3B5" maxLength={120}
              style={{ borderWidth: 1, borderColor: T.line, borderRadius: 11, padding: 12, marginBottom: 11, fontSize: 15 }} />
            <TextInput value={body} onChangeText={setBody} placeholder="Details" placeholderTextColor="#9AA3B5" multiline maxLength={2000}
              style={{ borderWidth: 1, borderColor: T.line, borderRadius: 11, padding: 12, minHeight: 80, marginBottom: 11, textAlignVertical: 'top', fontSize: 15 }} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 13 }}>
              {TAGS.map((t) => (
                <Pressable key={t} onPress={() => setTag(t)} style={{ borderWidth: 1, borderColor: tag === t ? T.navy : T.line, backgroundColor: tag === t ? T.navy : T.card, borderRadius: 99, paddingHorizontal: 13, paddingVertical: 7 }}>
                  <Text style={{ fontSize: 12.5, fontWeight: '600', color: tag === t ? '#fff' : T.inkSoft }}>{t}</Text>
                </Pressable>
              ))}
            </View>
            {postErr ? <Text style={{ color: T.red, fontSize: 12, marginBottom: 8 }}>{postErr}</Text> : null}
            <Pressable onPress={publish} disabled={saving} style={{ backgroundColor: T.navy, borderRadius: 12, padding: 14, alignItems: 'center', opacity: saving ? 0.6 : 1 }}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Post to community</Text>}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
