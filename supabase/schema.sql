-- Phase-0 Skills Directory schema (public)
-- Safe to run on Supabase. Includes tables, policies, helper functions, and seed data.

-- Extensions
create extension if not exists pgcrypto;

-- Helper to resolve requesting user's email from JWT
create or replace function public.requesting_email()
returns text
language sql
stable
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claims', true), '' )::json ->> 'email',
    ''
  );
$$;

-- Helper to check HR membership
create or replace function public.is_hr()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.hr_emails h
    where lower(h.email) = lower(public.requesting_email())
  );
$$;

-- profiles
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique not null,
  full_name text not null,
  email text unique not null,
  job_title text,
  business_unit text,
  location_city text,
  location_country text,
  languages text[],
  availability_percent int2 check (availability_percent between 0 and 100),
  availability_earliest_start date,
  availability_notes text,
  open_to_mission boolean default false,
  last_updated timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- skills
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  category text not null check (category in ('Data/AI','Cyber','Cloud/Infra','Web','Embedded','PM/BA','QA','Other')),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- profile_skills
create table if not exists public.profile_skills (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  skill_id uuid not null references public.skills(id),
  proficiency_level int2 not null check (proficiency_level between 1 and 5),
  years_experience numeric(4,1) check (years_experience >= 0),
  last_used date,
  certified boolean default false,
  evidence_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (profile_id, skill_id)
);

-- hr_emails
create table if not exists public.hr_emails (
  email text primary key,
  created_at timestamptz default now()
);

-- audit_log
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id),
  event_type text not null check (event_type in ('ProfileUpdated','ReminderSent')),
  details text,
  occurred_at timestamptz default now()
);

-- Updated-at triggers
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger trg_skills_updated_at
before update on public.skills
for each row execute function public.set_updated_at();

create trigger trg_profile_skills_updated_at
before update on public.profile_skills
for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.profile_skills enable row level security;

-- profiles policies
create policy profiles_select_all on public.profiles
for select using (true);

create policy profiles_insert_self_or_hr on public.profiles
for insert with check (
  auth.uid() = auth_user_id or public.is_hr()
);

create policy profiles_update_self_or_hr on public.profiles
for update using (
  auth.uid() = auth_user_id or public.is_hr()
);

-- profile_skills policies
create policy profile_skills_select_all on public.profile_skills
for select using (true);

create policy profile_skills_write_owner_or_hr on public.profile_skills
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = profile_id and (p.auth_user_id = auth.uid() or public.is_hr())
  )
) with check (
  exists (
    select 1 from public.profiles p
    where p.id = profile_id and (p.auth_user_id = auth.uid() or public.is_hr())
  )
);

-- skills policies
create policy skills_select_all on public.skills
for select using (true);

create policy skills_write_hr_only on public.skills
for all using (public.is_hr()) with check (public.is_hr());

-- Seed taxonomy (subset)
insert into public.skills (id, name, category)
values
  (gen_random_uuid(),'Python','Data/AI'),
  (gen_random_uuid(),'R','Data/AI'),
  (gen_random_uuid(),'SQL','Data/AI'),
  (gen_random_uuid(),'Terraform','Cloud/Infra'),
  (gen_random_uuid(),'Kubernetes','Cloud/Infra'),
  (gen_random_uuid(),'Docker','Cloud/Infra'),
  (gen_random_uuid(),'TypeScript','Web'),
  (gen_random_uuid(),'React','Web'),
  (gen_random_uuid(),'Node.js','Web')
on conflict do nothing;

-- Demo HR
insert into public.hr_emails (email) values ('hr@example.com') on conflict do nothing;

-- Note: For demo profiles, insert after users sign in so auth_user_id can be set properly.
