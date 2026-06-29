-- ============================================================================
-- contAInuum — security hardening (Phase 0)
--   FIX 1: server-side entitlement gate on projects INSERT/UPDATE
--   FIX 2: block role self-escalation on profiles
-- Apply after 0004_trial_reminded.sql:  supabase db push
-- Idempotent: re-runnable (create or replace fn; drop policy if exists +
-- create; revoke is naturally idempotent).
-- ============================================================================

-- ============================================================================
-- FIX 1 — server-side entitlement gate for projects writes
-- ============================================================================

-- 1. Entitlement helper. SECURITY DEFINER so it can read subscriptions even
--    though the caller only has SELECT on their own row; STABLE because it
--    performs no writes and returns the same result within a statement.
--    The active set MUST mirror ACTIVE_STATUSES in src/lib/api/subscriptions.ts
--    exactly: ('trialing', 'active', 'past_due').
create or replace function public.has_active_subscription(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
      from public.subscriptions s
     where s.user_id = uid
       and s.status in ('trialing', 'active', 'past_due')
  );
$$;

-- Lock down EXECUTE: revoke from PUBLIC, grant only to the API roles.
revoke all on function public.has_active_subscription(uuid) from public;
grant execute on function public.has_active_subscription(uuid) to authenticated, service_role;

-- 2. Re-gate the projects WRITE policies. SELECT and DELETE stay ownership-only
--    (a lapsed user may still read and remove their own data). INSERT and UPDATE
--    additionally require an active subscription. Reuse the EXACT 0001 names.

-- INSERT: owner AND entitled.
drop policy if exists projects_insert_own on public.projects;
create policy projects_insert_own
  on public.projects for insert to authenticated
  with check (
    user_id = auth.uid()
    and public.has_active_subscription(auth.uid())
  );

-- UPDATE: owner AND entitled (both USING for the pre-image and WITH CHECK for
-- the post-image so a lapsed user can neither target nor produce a row).
drop policy if exists projects_update_own on public.projects;
create policy projects_update_own
  on public.projects for update to authenticated
  using (
    user_id = auth.uid()
    and public.has_active_subscription(auth.uid())
  )
  with check (
    user_id = auth.uid()
    and public.has_active_subscription(auth.uid())
  );

-- NOTE: projects_select_own and projects_delete_own are intentionally NOT
-- redefined here — they remain ownership-only from 0001_init.sql.

-- ============================================================================
-- FIX 2 — block role self-escalation on profiles
-- ----------------------------------------------------------------------------
-- Approach: column-level privilege. Supabase's default grant to the API roles
-- is a TABLE-level `GRANT ALL ON public.profiles TO authenticated, anon` (and
-- service_role). A column-level REVOKE UPDATE(role) carves `role` out of that
-- table-level UPDATE grant: any UPDATE statement that names the `role` column
-- is rejected at the privilege layer (error 42501), BEFORE RLS is evaluated,
-- for the authenticated and anon roles. service_role keeps full access (it is
-- the webhook/admin writer and bypasses RLS anyway).
--
-- Compatibility with profiles_update_own: that policy only constrains WHICH
-- rows may be updated (id = auth.uid()); it does not grant column privileges.
-- A normal PATCH that omits `role` (e.g. { full_name }) updates only granted
-- columns, so the table-level UPDATE grant still covers it and the policy still
-- passes — those patches keep working. Only statements that explicitly SET role
-- are refused. This is the documented, supported Supabase pattern and is
-- strictly more robust than a trigger for the "client cannot touch role" goal
-- because it cannot be bypassed by any RLS edge case.
-- ============================================================================

revoke update (role) on public.profiles from authenticated, anon;

-- Defense in depth: also ensure the column-level INSERT path can't seed an
-- elevated role from the client. handle_new_user (SECURITY DEFINER) inserts the
-- row with the default 'user'; the client never INSERTs profiles directly
-- (no insert policy exists), but revoke the column grant explicitly so a future
-- insert policy can't accidentally expose it.
revoke insert (role) on public.profiles from authenticated, anon;
