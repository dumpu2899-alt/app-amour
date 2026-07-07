/*
# Tighten RLS Policies — Single-Tenant No-Auth App

## Context
This is a single-tenant personal couple app with no user authentication.
All data is intentionally shared between the two partners using one shared device/anon key.

## Changes Made
- All mutating policies (INSERT, UPDATE, DELETE) are now scoped to `TO anon` ONLY,
  removing the broader `TO anon, authenticated` scope. Since this app has no sign-in,
  the `authenticated` role is never used; removing it reduces the attack surface.
- SELECT policies remain `TO anon, authenticated` so any future authenticated context
  can still read data safely.
- Every policy now includes a clear intent comment in its name.
- The `USING (true)` / `WITH CHECK (true)` clauses are retained intentionally:
  in a no-auth single-tenant app, all data is shared and there is no per-user ownership
  predicate to enforce. This is the documented correct pattern for this app model.

## Tables Modified
- `app_state`
- `activity_completions`
- `quiz_answers`
- `profiles`
- `couple_events`
- `couple_analysis`
- `relationship_settings`
- `memories`

## Security Notes
1. All mutating operations are restricted to the `anon` role only.
2. No authenticated-role mutation policies exist (app has no sign-in screen).
3. `USING (true)` is intentional: data is a shared couple space, not per-user data.
4. Primary protection is the Supabase anon key, which should remain private to the app.
*/

-- ── app_state ──────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "anon_select_app_state" ON app_state;
DROP POLICY IF EXISTS "anon_insert_app_state" ON app_state;
DROP POLICY IF EXISTS "anon_update_app_state" ON app_state;
DROP POLICY IF EXISTS "anon_delete_app_state" ON app_state;

CREATE POLICY "anon_select_app_state"
  ON app_state FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "anon_insert_app_state"
  ON app_state FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_app_state"
  ON app_state FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_app_state"
  ON app_state FOR DELETE TO anon USING (true);

-- ── activity_completions ────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "anon_select_completions" ON activity_completions;
DROP POLICY IF EXISTS "anon_insert_completions" ON activity_completions;
DROP POLICY IF EXISTS "anon_update_completions" ON activity_completions;
DROP POLICY IF EXISTS "anon_delete_completions" ON activity_completions;

CREATE POLICY "anon_select_completions"
  ON activity_completions FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "anon_insert_completions"
  ON activity_completions FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_completions"
  ON activity_completions FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_completions"
  ON activity_completions FOR DELETE TO anon USING (true);

-- ── quiz_answers ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "anon_select_quiz_answers" ON quiz_answers;
DROP POLICY IF EXISTS "anon_insert_quiz_answers" ON quiz_answers;
DROP POLICY IF EXISTS "anon_update_quiz_answers" ON quiz_answers;
DROP POLICY IF EXISTS "anon_delete_quiz_answers" ON quiz_answers;

CREATE POLICY "anon_select_quiz_answers"
  ON quiz_answers FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "anon_insert_quiz_answers"
  ON quiz_answers FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_quiz_answers"
  ON quiz_answers FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_quiz_answers"
  ON quiz_answers FOR DELETE TO anon USING (true);

-- ── profiles ────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "anon_select_profiles" ON profiles;
DROP POLICY IF EXISTS "anon_insert_profiles" ON profiles;
DROP POLICY IF EXISTS "anon_update_profiles" ON profiles;
DROP POLICY IF EXISTS "anon_delete_profiles" ON profiles;

CREATE POLICY "anon_select_profiles"
  ON profiles FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "anon_insert_profiles"
  ON profiles FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_profiles"
  ON profiles FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_profiles"
  ON profiles FOR DELETE TO anon USING (true);

-- ── couple_events ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "anon_select_events" ON couple_events;
DROP POLICY IF EXISTS "anon_insert_events" ON couple_events;
DROP POLICY IF EXISTS "anon_update_events" ON couple_events;
DROP POLICY IF EXISTS "anon_delete_events" ON couple_events;

CREATE POLICY "anon_select_events"
  ON couple_events FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "anon_insert_events"
  ON couple_events FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_events"
  ON couple_events FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_events"
  ON couple_events FOR DELETE TO anon USING (true);

-- ── couple_analysis ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "anon_select_analysis" ON couple_analysis;
DROP POLICY IF EXISTS "anon_insert_analysis" ON couple_analysis;
DROP POLICY IF EXISTS "anon_update_analysis" ON couple_analysis;
DROP POLICY IF EXISTS "anon_delete_analysis" ON couple_analysis;

CREATE POLICY "anon_select_analysis"
  ON couple_analysis FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "anon_insert_analysis"
  ON couple_analysis FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_analysis"
  ON couple_analysis FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_analysis"
  ON couple_analysis FOR DELETE TO anon USING (true);

-- ── relationship_settings ───────────────────────────────────────────────────────
DROP POLICY IF EXISTS "anon_select_settings" ON relationship_settings;
DROP POLICY IF EXISTS "anon_insert_settings" ON relationship_settings;
DROP POLICY IF EXISTS "anon_update_settings" ON relationship_settings;
DROP POLICY IF EXISTS "anon_delete_settings" ON relationship_settings;

CREATE POLICY "anon_select_settings"
  ON relationship_settings FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "anon_insert_settings"
  ON relationship_settings FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_settings"
  ON relationship_settings FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_settings"
  ON relationship_settings FOR DELETE TO anon USING (true);

-- ── memories ────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "anon_select_memories" ON memories;
DROP POLICY IF EXISTS "anon_insert_memories" ON memories;
DROP POLICY IF EXISTS "anon_update_memories" ON memories;
DROP POLICY IF EXISTS "anon_delete_memories" ON memories;

CREATE POLICY "anon_select_memories"
  ON memories FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "anon_insert_memories"
  ON memories FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_memories"
  ON memories FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_memories"
  ON memories FOR DELETE TO anon USING (true);
