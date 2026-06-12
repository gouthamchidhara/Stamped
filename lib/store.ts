// Real Supabase-backed hooks. Mock mode is gone — set EXPO_PUBLIC_USE_MOCK=1 to fall back.
import { useCallback, useEffect, useState } from 'react';
import * as db from './db';

export const maskReceipt = (r: string) => r.slice(0, 3) + '••••••' + r.slice(-4);

export function useCases() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try { setError(null); setCases(await db.fetchCases()); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async (receipt: string, nick: string, formType: string) => {
    await db.createCase(receipt, nick, formType);
    await load();
  };

  return { cases, loading, error, reload: load, add };
}

export function usePosts(filter: string) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try { setError(null); setPosts(await db.fetchPosts(filter)); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  return {
    posts, loading, error, reload: load,
    vote: async (id: string) => { await db.toggleVote(id); await load(); },
    comment: async (id: string, body: string) => { await db.addComment(id, body); await load(); },
    create: async (title: string, body: string, tag: string) => { await db.createPost(title, body, tag); await load(); },
  };
}
