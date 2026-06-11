// Supabase Edge Function: poll USCIS Case Status API, detect changes, send push.
// Deploy:  supabase functions deploy poll-uscis
// Schedule: supabase functions schedule create poll-uscis --cron "0 */6 * * *"
//
// Reads these secrets (set via `supabase secrets set ...`, NEVER in code/git):
//   USCIS_CLIENT_ID, USCIS_CLIENT_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//
// Sandbox auth URL per USCIS docs. Swap to the production URL when granted prod access.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const USCIS_AUTH_URL = 'https://api-int.uscis.gov/oauth/accesstoken';
const USCIS_CASE_URL = 'https://api-int.uscis.gov/case-status'; // GET /case-status/{receiptNumber} — verified

// Map a USCIS status string to our step index for the timeline.
function stepIndexFor(form: string, status: string): number {
  const s = status.toLowerCase();
  if (s.includes('approved')) return 5;
  if (s.includes('card') && s.includes('produced')) return 4;
  if (s.includes('card') && s.includes('mailed')) return 4;
  if (s.includes('interview')) return 3;
  if (s.includes('actively') || s.includes('being reviewed')) return 2;
  if (s.includes('biometric') || s.includes('fingerprint')) return 1;
  return 0;
}

async function getToken(): Promise<string> {
  const id = Deno.env.get('USCIS_CLIENT_ID')!;
  const secret = Deno.env.get('USCIS_CLIENT_SECRET')!;
  const basic = btoa(`${id}:${secret}`);
  const res = await fetch(USCIS_AUTH_URL, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`USCIS auth failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.access_token;
}

async function fetchStatus(token: string, receipt: string) {
  const res = await fetch(`${USCIS_CASE_URL}/${encodeURIComponent(receipt)}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  // Handle USCIS RFC-9457 error envelope (required for prod demo).
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.errors?.[0]?.message ?? `HTTP ${res.status}`;
    return { ok: false as const, message: msg, status: res.status };
  }
  const data = await res.json();
  // USCIS nests under "case_status"; the human-readable status is in current_case_status_text_en.
  // Falls back across other observed key names so a schema tweak won't break polling.
  const cs = data?.case_status ?? data?.caseStatus ?? data;
  const status =
    cs?.current_case_status_text_en ??
    cs?.currentCaseStatusTextEn ??
    cs?.caseStatus ??
    cs?.status ??
    'Unknown';
  const desc =
    cs?.current_case_status_desc_en ??
    cs?.currentCaseStatusDescEn ??
    null;
  return { ok: true as const, status, desc };
}

async function sendPush(expoToken: string, title: string, body: string) {
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: expoToken, title, body, sound: 'default' }),
  });
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // service role: bypasses RLS for the cron job
  );

  let token: string;
  try { token = await getToken(); }
  catch (e) { return new Response(JSON.stringify({ error: String(e) }), { status: 502 }); }

  // Pull cases to check, oldest-checked first; cap per run to respect rate limits.
  const { data: cases, error } = await supabase
    .from('cases')
    .select('id, user_id, form_type, receipt_number, current_status')
    .order('last_checked_at', { ascending: true, nullsFirst: true })
    .limit(200);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  let changed = 0, checked = 0;
  for (const c of cases ?? []) {
    const result = await fetchStatus(token, c.receipt_number);
    checked++;
    await supabase.from('cases').update({ last_checked_at: new Date().toISOString() }).eq('id', c.id);
    if (!result.ok) continue;

    if (result.status !== c.current_status) {
      changed++;
      const stepIdx = stepIndexFor(c.form_type, result.status);
      await supabase.from('cases').update({ current_status: result.status, step_idx: stepIdx }).eq('id', c.id);
      await supabase.from('case_status_events').insert({
        case_id: c.id, status: result.status, occurred_at: new Date().toISOString().slice(0, 10),
      });
      // Notify the owner if they have a push token registered.
      const { data: prof } = await supabase.from('profiles').select('expo_push_token').eq('id', c.user_id).single();
      if (prof?.expo_push_token) {
        await sendPush(prof.expo_push_token, `Update on your ${c.form_type}`, result.status);
      }
    }
    await new Promise((r) => setTimeout(r, 220)); // ~5 tps cap per USCIS sandbox limit
  }

  return new Response(JSON.stringify({ checked, changed }), { headers: { 'Content-Type': 'application/json' } });
});
