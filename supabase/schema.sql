-- Stamped — Supabase schema
-- Run this in the Supabase SQL editor.

-- ============ PROFILES ============
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null,
  avatar_color text default '#1B2B4D',
  created_at timestamptz default now()
);

-- ============ CASES (private per user) ============
create table cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  form_type text not null,                  -- 'I-485', 'I-765', ...
  nickname text,
  receipt_number text not null,             -- store encrypted at rest; mask in UI
  current_status text,
  step_idx int default 0,
  filed_at date,
  last_checked_at timestamptz,
  created_at timestamptz default now()
);

-- ============ STATUS HISTORY (powers timeline + crowdsourced medians) ============
create table case_status_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases on delete cascade,
  status text not null,
  occurred_at date not null,
  created_at timestamptz default now()
);

-- ============ COMMUNITY ============
create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  tag text not null,                        -- form type or 'news'
  is_news boolean default false,
  title text not null,
  body text,
  created_at timestamptz default now()
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

create table votes (
  post_id uuid references posts on delete cascade,
  user_id uuid references auth.users on delete cascade,
  primary key (post_id, user_id)
);

-- ============ ROW LEVEL SECURITY ============
alter table profiles enable row level security;
alter table cases enable row level security;
alter table case_status_events enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table votes enable row level security;

-- Profiles: readable by all, writable by owner
create policy "profiles read" on profiles for select using (true);
create policy "profiles write" on profiles for all using (auth.uid() = id);

-- Cases: strictly private
create policy "own cases" on cases for all using (auth.uid() = user_id);
create policy "own case events" on case_status_events for all
  using (exists (select 1 from cases where cases.id = case_id and cases.user_id = auth.uid()));

-- Community: public read, authed write, owner edit/delete
create policy "posts read" on posts for select using (true);
create policy "posts insert" on posts for insert with check (auth.uid() = user_id);
create policy "posts modify" on posts for update using (auth.uid() = user_id);
create policy "posts delete" on posts for delete using (auth.uid() = user_id);

create policy "comments read" on comments for select using (true);
create policy "comments insert" on comments for insert with check (auth.uid() = user_id);
create policy "comments delete" on comments for delete using (auth.uid() = user_id);

create policy "votes read" on votes for select using (true);
create policy "votes write" on votes for all using (auth.uid() = user_id);

-- ============ CROWDSOURCED PROCESSING TIMES ============
-- Median days from "Received" to "Approved" per form type (anonymized, aggregate only)
create view processing_medians as
select
  c.form_type,
  percentile_cont(0.5) within group (
    order by (approved.occurred_at - received.occurred_at)
  ) as median_days,
  count(*) as sample_size
from cases c
join case_status_events received
  on received.case_id = c.id and received.status = 'Case Was Received'
join case_status_events approved
  on approved.case_id = c.id and approved.status in ('Case Approved', 'Card Was Mailed')
group by c.form_type
having count(*) >= 10;  -- privacy floor

-- ============ ADDED FOR USCIS POLLING + PUSH ============
alter table profiles add column if not exists expo_push_token text;
-- cases.current_status, step_idx, last_checked_at already exist above.
