import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Project URL + anon key are safe to ship in the client.
// Row Level Security (see supabase/schema.sql) is what protects user data.
const SUPABASE_URL = 'https://bfrdzhzsbyzphhzznqrw.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmcmR6aHpzYnl6cGhoenpucXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMDM4MTYsImV4cCI6MjA5Njc3OTgxNn0.YkeaSFY08WCrS_ILl6ci1PVEaHdjJy0aDRLqYOMiWts';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // PKCE returns the magic link as a ?code= query param, which survives the
    // browser→app deep-link handoff (the implicit flow's #fragment does not).
    // We complete it manually with exchangeCodeForSession (see lib/auth.tsx).
    flowType: 'pkce',
  },
});
