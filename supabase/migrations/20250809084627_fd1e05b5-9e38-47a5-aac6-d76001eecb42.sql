-- Fix linter: set search_path on functions and enable RLS on audit_log
create or replace function public.requesting_email()
returns text
language sql
stable
set search_path = public
as $$
  select auth.jwt() ->> 'email';
$$;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql
set search_path = public;

alter table public.audit_log enable row level security;
-- No policies added (deny all by default), safe since not used by the app
