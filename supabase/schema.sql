-- DecisionOS schema
-- Adapted from spec Section 3 to use Supabase Auth (auth.users) instead of a
-- custom users table with password_hash — Supabase Auth already owns that.
-- user_profiles holds the app-specific fields, keyed 1:1 to auth.users.id.

create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  gender text,
  age_group text,                      -- <18, 18-30, 31-44, 45-60, 60+
  years_investing numeric,
  employed boolean,
  sector text,                         -- Public / Private / Gig / N/A
  created_at timestamptz default now()
);

create table if not exists profile_survey (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references user_profiles(id) on delete cascade not null,
  portfolio_choices jsonb,             -- array of selected instruments
  trust_sources jsonb,                 -- {source: rating 1-5} per source
  challenges jsonb,                    -- array of selected challenge tags
  challenges_opinion text,             -- open-ended paragraph
  age_branch_answers jsonb,            -- shape depends on age_group
  submitted_at timestamptz default now()
);

create table if not exists survey_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references user_profiles(id) on delete cascade not null,
  day_number int not null,
  scenario_id text not null,
  scenario_prompt text,                -- full scenario context shown to the user
  scenario_question text,              -- full question text shown to the user
  intervention_type text,              -- info-only, AI coaching, social norm, etc.
  selected_response text not null,
  confidence_level text not null,      -- Very / Somewhat / Not very / Not at all
  response_latency_ms int,
  inferred_bias text,
  ai_feedback text,
  created_at timestamptz default now()
);

-- Migration for existing databases created before scenario_prompt/scenario_question existed.
alter table survey_responses add column if not exists scenario_prompt text;
alter table survey_responses add column if not exists scenario_question text;

create index if not exists survey_responses_user_id_idx on survey_responses(user_id);
create index if not exists profile_survey_user_id_idx on profile_survey(user_id);

-- Row Level Security: every user can only read/write their own rows.
alter table user_profiles enable row level security;
alter table profile_survey enable row level security;
alter table survey_responses enable row level security;

create policy "Users can view own profile" on user_profiles
  for select using (auth.uid() = id);
create policy "Users can insert own profile" on user_profiles
  for insert with check (auth.uid() = id);
create policy "Users can update own profile" on user_profiles
  for update using (auth.uid() = id);

create policy "Users can view own survey" on profile_survey
  for select using (auth.uid() = user_id);
create policy "Users can insert own survey" on profile_survey
  for insert with check (auth.uid() = user_id);

create policy "Users can view own responses" on survey_responses
  for select using (auth.uid() = user_id);
create policy "Users can insert own responses" on survey_responses
  for insert with check (auth.uid() = user_id);

-- Leaderboard needs to read everyone's points/streak, not just the caller's
-- own row — expose a minimal public view instead of relaxing the RLS above.
create or replace view leaderboard as
  select
    up.id as user_id,
    up.name,
    count(sr.id) as decisions_made,
    count(sr.id) * 20 as points
  from user_profiles up
  left join survey_responses sr on sr.user_id = up.id
  group by up.id, up.name;

grant select on leaderboard to authenticated;

-- Auto-create a user_profiles row when someone signs up via Supabase Auth.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
