// Minimal in-memory store with mock data. Swap USE_MOCK=false once Supabase is wired.
import { useSyncExternalStore } from 'react';
import { Case, Post } from './types';
import { mockCases, mockPosts, STEPS_485 } from './mockData';

export const USE_MOCK = true;

let state = { cases: [...mockCases], posts: [...mockPosts] };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function useStore() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => state,
  );
}

export const actions = {
  addCase(receipt: string, nick: string) {
    state = { ...state, cases: [...state.cases, {
      id: String(Date.now()), form: 'I-485', nick: nick || 'New case', receipt,
      step_idx: 0, steps: STEPS_485, filed_at: new Date().toISOString().slice(0, 10),
      eta: 'TBD', stamp: 'received', stamp_text: 'Received',
      step_dates: [new Date().toDateString()],
    } as Case] };
    emit();
  },
  toggleVote(id: string) {
    state = { ...state, posts: state.posts.map((p) =>
      p.id === id ? { ...p, voted: !p.voted, votes: p.votes + (p.voted ? -1 : 1) } : p) };
    emit();
  },
  addComment(id: string, text: string) {
    state = { ...state, posts: state.posts.map((p) =>
      p.id === id ? { ...p, comments: [...p.comments, { author: 'You', text }] } : p) };
    emit();
  },
  addPost(title: string, body: string, tag: string) {
    state = { ...state, posts: [{
      id: String(Date.now()), author: 'You', initials: 'GO', color: '#1B2B4D',
      created_label: 'now', tag, is_news: false, title, body, votes: 1, voted: true, comments: [],
    } as Post, ...state.posts] };
    emit();
  },
};

export const maskReceipt = (r: string) => r.slice(0, 3) + '••••••' + r.slice(-4);
