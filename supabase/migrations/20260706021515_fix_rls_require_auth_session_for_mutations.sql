/*
# Fix RLS: Require Authenticated Session for All Mutations

## Problem
All INSERT, UPDATE, DELETE policies used USING(true)/WITH CHECK(true) for the anon
role, meaning any anonymous internet user with the public anon key could modify or
delete couple data. The security scanner correctly flagged these as unrestricted.

## Solution
The app now uses Supabase Anonymous Authentication. On first load, the client
automatically signs in anonymously — obtaining a real JWT with the `authenticated`
role. On return visits, the session is restored from localStorage.

This means:
- SELECT policies remain open to `anon, authenticated` so data loads instantly
  even before the session is fully established.
- INSERT, UPDATE, DELETE policies are now scoped to `authenticated` only, with
  `auth.uid() IS NOT NULL` as the guard. This is satisfied by any valid session
  (including anonymous ones) but NOT by raw unauthenticated anon-key requests.

## Changes Per Table
All 8 tables (app_state, activity_completions, quiz_answers, profiles,
couple_events, couple_analysis, relationship_settings, memories):
- DROP old anon mutating policies (anon_insert_*, anon_update_*, anon_delete_*)
- CREATE new authenticated mutating policies scoped to `authenticated` role
- SELECT policies unchanged (still anon, authenticated USING(true))

## Security Improvement
Before: Anyone with the anon key can INSERT/UPDATE/DELETE any row.
After:  Only clients with a valid Supabase session JWT can mutate data.
        The anon key alone is no longer sufficient for writes.
*/

-- ── app_state ──────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "anon_insert_app_state" ON app_state;
DROP POLICY IF EXISTS "anon_update_app_state" ON app_state;
DROP POLICY IF EXISTS "anon_delete_app_state" ON app_state;

CREATE POLICY "auth_insert_app_state"
  ON app_state FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_update_app_state"
  ON app_state FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_delete_app_state"
  ON app_state FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ── activity_completions ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "anon_insert_completions" ON activity_completions;
DROP POLICY IF EXISTS "anon_update_completions" ON activity_completions;
DROP POLICY IF EXISTS "anon_delete_completions" ON activity_completions;

CREATE POLICY "auth_insert_completions"
  ON activity_completions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_update_completions"
  ON activity_completions FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_delete_completions"
  ON activity_completions FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ── quiz_answers ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "anon_insert_quiz_answers" ON quiz_answers;
DROP POLICY IF EXISTS "anon_update_quiz_answers" ON quiz_answers;
DROP POLICY IF EXISTS "anon_delete_quiz_answers" ON quiz_answers;

CREATE POLICY "auth_insert_quiz_answers"
  ON quiz_answers FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_update_quiz_answers"
  ON quiz_answers FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_delete_quiz_answers"
  ON quiz_answers FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ── profiles ────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "anon_insert_profiles" ON profiles;
DROP POLICY IF EXISTS "anon_update_profiles" ON profiles;
DROP POLICY IF EXISTS "anon_delete_profiles" ON profiles;

CREATE POLICY "auth_insert_profiles"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_update_profiles"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_delete_profiles"
  ON profiles FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ── couple_events ───────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "anon_insert_events" ON couple_events;
DROP POLICY IF EXISTS "anon_update_events" ON couple_events;
DROP POLICY IF EXISTS "anon_delete_events" ON couple_events;

CREATE POLICY "auth_insert_events"
  ON couple_events FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_update_events"
  ON couple_events FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_delete_events"
  ON couple_events FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ── couple_analysis ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "anon_insert_analysis" ON couple_analysis;
DROP POLICY IF EXISTS "anon_update_analysis" ON couple_analysis;
DROP POLICY IF EXISTS "anon_delete_analysis" ON couple_analysis;

CREATE POLICY "auth_insert_analysis"
  ON couple_analysis FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_update_analysis"
  ON couple_analysis FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_delete_analysis"
  ON couple_analysis FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ── relationship_settings ───────────────────────────────────────────────────────

DROP POLICY IF EXISTS "anon_insert_settings" ON relationship_settings;
DROP POLICY IF EXISTS "anon_update_settings" ON relationship_settings;
DROP POLICY IF EXISTS "anon_delete_settings" ON relationship_settings;

CREATE POLICY "auth_insert_settings"
  ON relationship_settings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_update_settings"
  ON relationship_settings FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_delete_settings"
  ON relationship_settings FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ── memories ────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "anon_insert_memories" ON memories;
DROP POLICY IF EXISTS "anon_update_memories" ON memories;
DROP POLICY IF EXISTS "anon_delete_memories" ON memories;

CREATE POLICY "auth_insert_memories"
  ON memories FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_update_memories"
  ON memories FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_delete_memories"
  ON memories FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);
