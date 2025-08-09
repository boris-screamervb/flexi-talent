-- Ensure required extension
create extension if not exists pgcrypto;

-- Create tables first (hr_emails needed by functions)
create table if not exists public.hr_emails (
  email text primary key,
  added_by uuid,
  created_at timestamptz not null default now()
);

-- Helper functions (depend on hr_emails)
create or replace function public.requesting_email()
returns text
language sql
stable
as $$
  select auth.jwt() ->> 'email';
$$;

create or replace function public.is_hr()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.hr_emails e
    where lower(e.email) = lower(coalesce(public.requesting_email(), ''))
  );
$$;

-- Other tables
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  email text,
  full_name text,
  job_title text,
  business_unit text,
  city text,
  country text,
  languages text[] default array[]::text[],
  availability_pct int not null default 100,
  earliest_start date,
  open_to_mission boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_skills (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  proficiency int not null default 3,
  years_of_experience int not null default 0,
  certified boolean not null default false,
  last_used_year int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (profile_id, skill_id)
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- Updated_at trigger function
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger trg_skills_updated_at
before update on public.skills
for each row execute function public.set_updated_at();

create trigger trg_profile_skills_updated_at
before update on public.profile_skills
for each row execute function public.set_updated_at();

-- Seed basic skills before RLS is enabled
insert into public.skills (name, category, is_active)
values
  ('React', 'Web', true),
  ('TypeScript', 'Web', true),
  ('Node.js', 'Web', true),
  ('Python', 'Data/AI', true),
  ('Pandas', 'Data/AI', true),
  ('TensorFlow', 'Data/AI', true),
  ('AWS', 'Cloud/Infra', true),
  ('Docker', 'Cloud/Infra', true),
  ('Kubernetes', 'Cloud/Infra', true),
  ('Azure', 'Cloud/Infra', true),
  ('GCP', 'Cloud/Infra', true),
  ('Cybersecurity', 'Cyber', true),
  ('Penetration Testing', 'Cyber', true),
  ('C++', 'Embedded', true),
  ('Rust', 'Embedded', true),
  ('Project Management', 'PM/BA', true),
  ('Business Analysis', 'PM/BA', true),
  ('QA Testing', 'QA', true),
  ('Playwright', 'QA', true),
  ('Other', 'Other', true)
  on conflict do nothing;

-- Seed demo profiles (no user_id so they are browseable)
insert into public.profiles (email, full_name, job_title, business_unit, city, country, languages, availability_pct, open_to_mission, notes)
values
  ('alice@example.com','Alice Martin','Frontend Engineer','Web','Paris','France',array['fr','en'],80,true,'React specialist'),
  ('bob@example.com','Bob Dupont','Data Scientist','Data/AI','Lyon','France',array['fr','en'],60,true,'ML pipelines'),
  ('carol@example.com','Carol Leroy','Cloud Architect','Cloud/Infra','Marseille','France',array['fr','en'],100,false,'AWS focus'),
  ('dave@example.com','Dave Bernard','Security Analyst','Cyber','Toulouse','France',array['fr','en'],90,true,'Pentesting'),
  ('eve@example.com','Eve Moreau','QA Engineer','QA','Bordeaux','France',array['fr','en'],70,true,'E2E Tests'),
  ('frank@example.com','Frank Petit','Backend Engineer','Web','Nice','France',array['fr','en'],50,true,'Node.js APIs'),
  ('grace@example.com','Grace Laurent','DevOps Engineer','Cloud/Infra','Nantes','France',array['fr','en'],100,true,'K8s & CI/CD'),
  ('heidi@example.com','Heidi Lambert','Data Engineer','Data/AI','Rennes','France',array['fr','en'],40,true,'ETL with Python'),
  ('ivan@example.com','Ivan Garcia','Embedded Engineer','Embedded','Lille','France',array['fr','en'],100,true,'C/C++ on ARM'),
  ('judy@example.com','Judy Rossi','BA Consultant','PM/BA','Strasbourg','France',array['fr','en'],30,true,'Requirements'),
  ('kate@example.com','Kate Simon','Fullstack Developer','Web','Grenoble','France',array['fr','en'],100,true,'TS/React/Node'),
  ('leo@example.com','Leo Girard','Solutions Architect','Cloud/Infra','Dijon','France',array['fr','en'],85,true,'Azure & GCP'),
  ('mia@example.com','Mia Robert','ML Engineer','Data/AI','Montpellier','France',array['fr','en'],65,true,'DL, TF'),
  ('nick@example.com','Nick Fontaine','Security Engineer','Cyber','Tours','France',array['fr','en'],95,true,'Blue team'),
  ('olivia@example.com','Olivia Chevalier','QA Lead','QA','Orléans','France',array['fr','en'],75,true,'Automation'),
  ('paul@example.com','Paul Caron','Platform Engineer','Cloud/Infra','Reims','France',array['fr','en'],55,true,'Infra as Code'),
  ('quinn@example.com','Quinn Meyer','Frontend Dev','Web','Clermont-Ferrand','France',array['fr','en'],90,true,'UX-minded'),
  ('ruth@example.com','Ruth Lefevre','Data Analyst','Data/AI','Saint-Étienne','France',array['fr','en'],45,true,'BI dashboards'),
  ('sam@example.com','Sam Marchand','PM','PM/BA','Toulon','France',array['fr','en'],100,true,'Delivery'),
  ('tina@example.com','Tina Perrot','Test Engineer','QA','Angers','France',array['fr','en'],80,true,'Perf tests')
  on conflict do nothing;

-- Simple random attachment of a few skills to demo profiles
insert into public.profile_skills (profile_id, skill_id, proficiency, years_of_experience)
select p.id, s.id, (2 + (random()*3)::int), (random()*10)::int
from public.profiles p cross join lateral (
  select id from public.skills order by random() limit 3
) s
on conflict do nothing;

-- RLS
alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.profile_skills enable row level security;
alter table public.hr_emails enable row level security;

-- Profiles policies
create policy "Profiles are viewable by authenticated users" on public.profiles for select to authenticated using (true);
create policy "Users can insert their own profile" on public.profiles for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update their own profile" on public.profiles for update to authenticated using (auth.uid() = user_id);
create policy "Users can delete their own profile" on public.profiles for delete to authenticated using (auth.uid() = user_id);
create policy "HR can manage all profiles" on public.profiles for all to authenticated using (public.is_hr());

-- Skills policies
create policy "Skills are viewable by authenticated users" on public.skills for select to authenticated using (true);
create policy "HR can manage skills" on public.skills for all to authenticated using (public.is_hr());

-- Profile skills policies
create policy "Profile skills are viewable by authenticated users" on public.profile_skills for select to authenticated using (true);
create policy "Users can manage their own profile skills" on public.profile_skills for all to authenticated using (
  exists (select 1 from public.profiles pr where pr.id = profile_id and pr.user_id = auth.uid())
);
create policy "HR can manage all profile skills" on public.profile_skills for all to authenticated using (public.is_hr());

-- HR emails policies (only HR)
create policy "Only HR can view hr emails" on public.hr_emails for select to authenticated using (public.is_hr());
create policy "Only HR can modify hr emails" on public.hr_emails for all to authenticated using (public.is_hr());

-- Trigger to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
