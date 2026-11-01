-- A users list that includes role.
-- Run in the Supabase SQL editor AFTER roles.sql.
--
-- The dashboard's Authentication > Users table has a fixed set of columns and
-- cannot show profiles.role. This view joins auth.users to profiles so the
-- Table Editor can show email, role and verification state together.
--
-- Find it under Table Editor > admin_users (views are listed with the tables).

create or replace view admin_users
with (security_invoker = on)
as
select
  u.id,
  u.email,
  p.full_name,
  coalesce(p.role, 'customer') as role,
  u.created_at,
  u.last_sign_in_at,
  u.email_confirmed_at,
  (u.email_confirmed_at is not null) as email_verified
from auth.users u
left join profiles p on p.id = u.id;

-- security_invoker means the view runs with the caller's privileges, so a
-- logged-in user hitting it through PostgREST still cannot read auth.users.
-- Revoke as well, so it never appears in the client API surface at all.
revoke all on admin_users from anon, authenticated;

comment on view admin_users is
  'Dashboard-only view of auth.users joined to profiles.role. Not exposed to the client API.';
