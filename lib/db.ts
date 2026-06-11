// Real Supabase data layer. Replaces the mock store once USE_MOCK = false.
import { supabase } from './supabase';
import { validateReceipt } from './validate';

export async function fetchCases() {
  const { data, error } = await supabase
    .from('cases')
    .select('*, case_status_events(status, occurred_at)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createCase(receiptRaw: string, nickname: string, formType = 'I-485') {
  const v = validateReceipt(receiptRaw);
  if (!v.ok) throw new Error(v.error);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  const { data, error } = await supabase
    .from('cases')
    .insert({ user_id: user.id, receipt_number: v.value, nickname, form_type: formType, step_idx: 0 })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchPosts(filter: string) {
  let q = supabase
    .from('posts')
    .select('*, comments(count), votes(count), profiles(display_name, avatar_color)')
    .order('created_at', { ascending: false });
  if (filter === 'news') q = q.eq('is_news', true);
  else if (filter !== 'all') q = q.eq('tag', filter);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function createPost(title: string, body: string, tag: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  const { data, error } = await supabase
    .from('posts')
    .insert({ user_id: user.id, title, body, tag, is_news: false })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleVote(postId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  const { data: existing } = await supabase
    .from('votes').select('*').eq('post_id', postId).eq('user_id', user.id).maybeSingle();
  if (existing) {
    await supabase.from('votes').delete().eq('post_id', postId).eq('user_id', user.id);
    return false;
  }
  await supabase.from('votes').insert({ post_id: postId, user_id: user.id });
  return true;
}

export async function addComment(postId: string, body: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  const { data, error } = await supabase
    .from('comments').insert({ post_id: postId, user_id: user.id, body }).select().single();
  if (error) throw error;
  return data;
}

export async function fetchProcessingMedians() {
  const { data, error } = await supabase.from('processing_medians').select('*');
  if (error) throw error;
  return data;
}
