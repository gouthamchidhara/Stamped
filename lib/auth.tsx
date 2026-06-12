import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import * as Linking from 'expo-linking';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthState { session: Session | null; loading: boolean; linking: boolean; linkError: string | null; }
const AuthContext = createContext<AuthState>({ session: null, loading: true, linking: false, linkError: null });

// A magic link can deep-link back either with a PKCE code in the query
// (?code=, our flowType) or with tokens in the fragment (#access_token=,
// implicit fallback). Collect params from both halves of the URL.
function parseAuthParams(url: string) {
  const hash = url.includes('#') ? url.split('#')[1] : '';
  const query = url.includes('?') ? url.split('?')[1].split('#')[0] : '';
  return new URLSearchParams([query, hash].filter(Boolean).join('&'));
}

function isAuthUrl(url: string) {
  return /[?#].*(code=|access_token=|error)/.test(url);
}

// Complete sign-in from the URL the magic link deep-links us back with.
// Returns true if a session was established.
async function createSessionFromUrl(url: string) {
  const params = parseAuthParams(url);

  const errorDescription = params.get('error_description') || params.get('error');
  if (errorDescription) throw new Error(decodeURIComponent(errorDescription.replace(/\+/g, ' ')));

  const code = params.get('code');
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return true;
  }

  const access_token = params.get('access_token');
  const refresh_token = params.get('refresh_token');
  if (access_token && refresh_token) {
    const { error } = await supabase.auth.setSession({ access_token, refresh_token });
    if (error) throw error;
    return true;
  }
  return false;
}

const AVATAR_COLORS = ['#1B2B4D', '#2E7D52', '#946B00', '#C44536', '#5B6478'];

// Nothing else creates profile rows (no DB trigger), and community posts and
// push notifications both need one — so make sure it exists on every sign-in.
async function ensureProfile(s: Session) {
  const name = s.user.email?.split('@')[0] || 'Member';
  const color = AVATAR_COLORS[s.user.id.charCodeAt(0) % AVATAR_COLORS.length];
  await supabase
    .from('profiles')
    .upsert({ id: s.user.id, display_name: name, avatar_color: color }, { onConflict: 'id', ignoreDuplicates: true });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  // A PKCE code can only be exchanged once; guard against the same launch URL
  // arriving via both getInitialURL and the 'url' event.
  const handled = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleUrl = async (url: string | null) => {
      if (!url || !isAuthUrl(url) || handled.current.has(url)) return;
      handled.current.add(url);
      setLinking(true); setLinkError(null);
      try {
        await createSessionFromUrl(url);
      } catch (e: any) {
        setLinkError(e?.message ?? 'That sign-in link could not be verified. Request a new one.');
      } finally {
        setLinking(false);
      }
    };

    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) ensureProfile(s).catch(() => {});
    });

    Linking.getInitialURL().then(handleUrl);
    const linkSub = Linking.addEventListener('url', ({ url }) => handleUrl(url));

    return () => { sub.subscription.unsubscribe(); linkSub.remove(); };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, linking, linkError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// Passwordless: Supabase emails a magic link that deep-links back into the app.
// New emails are signed up automatically; existing ones are signed in.
export async function sendMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: Linking.createURL('sign-in'),
      shouldCreateUser: true,
    },
  });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}
