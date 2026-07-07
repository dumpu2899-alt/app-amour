/*
# Paired App Progress Tracking

## Purpose
Single-tenant schema (no authentication) to track user progress in the Paired couples app clone.

## New Tables

### 1. `app_state`
Stores the global app state:
- `id` (uuid, PK)
- `streak_count` (integer) — current daily streak
- `last_active_date` (date) — date of last activity, used to compute streaks
- `current_question_index` (integer) — which daily question the user is on
- `created_at` (timestamp)

### 2. `activity_completions`
Tracks which activities (quizzes, questions, games) have been completed:
- `id` (uuid, PK)
- `activity_type` (text) — 'quiz', 'question', 'game'
- `activity_id` (text) — identifier for the specific activity
- `answer` (text, nullable) — user's answer or response
- `completed_at` (timestamp)

### 3. `quiz_answers`
Stores per-question answers within a quiz:
- `id` (uuid, PK)
- `quiz_id` (text)
- `question_index` (integer)
- `answer` (text)
- `is_correct` (boolean)
- `answered_at` (timestamp)

## Security
- RLS enabled on all tables.
- All policies use `TO anon, authenticated` since this is a single-tenant app with no sign-in.
- `USING (true)` is acceptable here because the data is intentionally shared/public within the single-tenant app.

## Notes
- No `user_id` columns — this app does not require authentication.
- Idempotent: uses `IF NOT EXISTS` and `DROP POLICY IF EXISTS`.
*/

CREATE TABLE IF NOT EXISTS app_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  streak_count integer NOT NULL DEFAULT 0,
  last_active_date date NOT NULL DEFAULT CURRENT_DATE,
  current_question_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE app_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_app_state" ON app_state;
CREATE POLICY "anon_select_app_state" ON app_state FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_app_state" ON app_state;
CREATE POLICY "anon_insert_app_state" ON app_state FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_app_state" ON app_state;
CREATE POLICY "anon_update_app_state" ON app_state FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_app_state" ON app_state;
CREATE POLICY "anon_delete_app_state" ON app_state FOR DELETE
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS activity_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type text NOT NULL,
  activity_id text NOT NULL,
  answer text,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(activity_type, activity_id)
);

ALTER TABLE activity_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_completions" ON activity_completions;
CREATE POLICY "anon_select_completions" ON activity_completions FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_completions" ON activity_completions;
CREATE POLICY "anon_insert_completions" ON activity_completions FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_completions" ON activity_completions;
CREATE POLICY "anon_update_completions" ON activity_completions FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_completions" ON activity_completions;
CREATE POLICY "anon_delete_completions" ON activity_completions FOR DELETE
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id text NOT NULL,
  question_index integer NOT NULL,
  answer text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  answered_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_quiz_answers" ON quiz_answers;
CREATE POLICY "anon_select_quiz_answers" ON quiz_answers FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_quiz_answers" ON quiz_answers;
CREATE POLICY "anon_insert_quiz_answers" ON quiz_answers FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_quiz_answers" ON quiz_answers;
CREATE POLICY "anon_update_quiz_answers" ON quiz_answers FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_quiz_answers" ON quiz_answers;
CREATE POLICY "anon_delete_quiz_answers" ON quiz_answers FOR DELETE
TO anon, authenticated USING (true);
