# Stamped — USCIS tracker + community (iOS & Android)

One Expo React Native codebase. Ships to both stores.

## Run it now (mock data, no backend needed)

```bash
npm install
npx expo start
```

Scan the QR with **Expo Go** on your iPhone or Android phone. The app runs
fully on mock data out of the box (`USE_MOCK = true` in `lib/store.ts`).

## Wire up Supabase (real backend)

1. Create a project at supabase.com
2. SQL editor → paste and run `supabase/schema.sql`
3. Put your URL + anon key in `lib/supabase.ts`
4. Replace the mock actions in `lib/store.ts` with Supabase queries
   (tables: `cases`, `posts`, `comments`, `votes` — RLS is already set up)

## USCIS case status (real data)

USCIS has an official Case Status API at developer.uscis.gov (OAuth2,
sandbox available). Build a Supabase Edge Function that:
1. Runs on a cron (every 1–4 hours)
2. Pulls status for each tracked receipt number
3. Inserts a row in `case_status_events` on change
4. Fires an Expo push notification to the case owner

Never call USCIS directly from the app — keep credentials server-side.

## Ship to stores

```bash
npm install -g eas-cli
eas build --platform all     # builds iOS + Android in the cloud
eas submit                    # pushes to App Store Connect + Play Console
```

You already have App Store Connect + TestFlight set up, so iOS beta is:
`eas build -p ios --profile preview` → upload → add your internal testers.

## Project map

```
app/(tabs)/index.tsx       Cases list + add-case sheet
app/(tabs)/community.tsx   Filterable feed + post composer
app/(tabs)/times.tsx       Processing times
app/(tabs)/alerts.tsx      Notifications feed
app/case/[id].tsx          Timeline detail
lib/store.ts               State + mock/Supabase switch
lib/theme.ts               Design tokens (navy/gold passport identity)
supabase/schema.sql        Full schema with RLS + crowdsourced medians view
```

## Build order (suggested)

1. Run on Expo Go, click around, adjust UI
2. Supabase auth (email magic link) + swap store to real queries
3. Edge Function for USCIS polling + push notifications
4. Crowdsourced medians view → Times tab
5. EAS build → TestFlight + Play internal testing
