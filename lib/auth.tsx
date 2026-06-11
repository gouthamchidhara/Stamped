import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthState { session: Session | null; loading: boolean; }
const AuthContext = createContext<AuthState>({ session: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

// OTP sign in. Supabase emails a 6-digit code (no deep link / browser needed on mobile).
// Requires the Supabase email template to include {{ .Token }}.
export async function sendOtpCode(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  if (error) throw error;
}

// Verifies the 6-digit code and establishes the session.
export async function verifyOtpCode(email: string, token: string) {
  const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}
