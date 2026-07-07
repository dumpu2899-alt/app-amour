-- ── 1. COUPLES table (container, no FK loop) ────────────────────────────────
CREATE TABLE IF NOT EXISTS couples (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;

-- ── 2. USER_PROFILES (one row per auth user) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL DEFAULT '',
  user_code  text NOT NULL UNIQUE,
  couple_id  uuid REFERENCES couples(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ── 3. RLS for couples ────────────────────────────────────────────────────────
CREATE POLICY "select_my_couple" ON couples FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
        AND user_profiles.couple_id = couples.id
    )
  );

CREATE POLICY "insert_couple" ON couples FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "delete_my_couple" ON couples FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
        AND user_profiles.couple_id = couples.id
    )
  );

-- ── 4. RLS for user_profiles ─────────────────────────────────────────────────
-- Users can see all profiles (needed for pairing by code lookup)
CREATE POLICY "select_profiles" ON user_profiles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "insert_own_profile" ON user_profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "update_own_profile" ON user_profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "delete_own_profile" ON user_profiles FOR DELETE TO authenticated
  USING (id = auth.uid());

-- ── 5. Helper function: returns current user's couple_id ─────────────────────
CREATE OR REPLACE FUNCTION get_my_couple_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT couple_id FROM user_profiles WHERE id = auth.uid();
$$;

-- ── 6. Add couple_id column to all app tables ─────────────────────────────────
ALTER TABLE app_state            ADD COLUMN IF NOT EXISTS couple_id uuid REFERENCES couples(id) ON DELETE CASCADE;
ALTER TABLE activity_completions ADD COLUMN IF NOT EXISTS couple_id uuid REFERENCES couples(id) ON DELETE CASCADE;
ALTER TABLE quiz_answers          ADD COLUMN IF NOT EXISTS couple_id uuid REFERENCES couples(id) ON DELETE CASCADE;
ALTER TABLE profiles              ADD COLUMN IF NOT EXISTS couple_id uuid REFERENCES couples(id) ON DELETE CASCADE;
ALTER TABLE couple_events         ADD COLUMN IF NOT EXISTS couple_id uuid REFERENCES couples(id) ON DELETE CASCADE;
ALTER TABLE couple_analysis       ADD COLUMN IF NOT EXISTS couple_id uuid REFERENCES couples(id) ON DELETE CASCADE;
ALTER TABLE relationship_settings ADD COLUMN IF NOT EXISTS couple_id uuid REFERENCES couples(id) ON DELETE CASCADE;
ALTER TABLE memories              ADD COLUMN IF NOT EXISTS couple_id uuid REFERENCES couples(id) ON DELETE CASCADE;

-- ── 7. Replace RLS on all app tables with couple-scoped policies ──────────────

-- app_state
DROP POLICY IF EXISTS "anon_select_app_state"    ON app_state;
DROP POLICY IF EXISTS "auth_insert_app_state"    ON app_state;
DROP POLICY IF EXISTS "auth_update_app_state"    ON app_state;
DROP POLICY IF EXISTS "auth_delete_app_state"    ON app_state;
CREATE POLICY "couple_select_app_state" ON app_state FOR SELECT TO authenticated
  USING (couple_id = get_my_couple_id());
CREATE POLICY "couple_insert_app_state" ON app_state FOR INSERT TO authenticated
  WITH CHECK (couple_id = get_my_couple_id());
CREATE POLICY "couple_update_app_state" ON app_state FOR UPDATE TO authenticated
  USING (couple_id = get_my_couple_id()) WITH CHECK (couple_id = get_my_couple_id());
CREATE POLICY "couple_delete_app_state" ON app_state FOR DELETE TO authenticated
  USING (couple_id = get_my_couple_id());

-- activity_completions
DROP POLICY IF EXISTS "anon_select_completions"  ON activity_completions;
DROP POLICY IF EXISTS "auth_insert_completions"  ON activity_completions;
DROP POLICY IF EXISTS "auth_update_completions"  ON activity_completions;
DROP POLICY IF EXISTS "auth_delete_completions"  ON activity_completions;
CREATE POLICY "couple_select_completions" ON activity_completions FOR SELECT TO authenticated
  USING (couple_id = get_my_couple_id());
CREATE POLICY "couple_insert_completions" ON activity_completions FOR INSERT TO authenticated
  WITH CHECK (couple_id = get_my_couple_id());
CREATE POLICY "couple_update_completions" ON activity_completions FOR UPDATE TO authenticated
  USING (couple_id = get_my_couple_id()) WITH CHECK (couple_id = get_my_couple_id());
CREATE POLICY "couple_delete_completions" ON activity_completions FOR DELETE TO authenticated
  USING (couple_id = get_my_couple_id());

-- quiz_answers
DROP POLICY IF EXISTS "anon_select_quiz_answers" ON quiz_answers;
DROP POLICY IF EXISTS "auth_insert_quiz_answers" ON quiz_answers;
DROP POLICY IF EXISTS "auth_update_quiz_answers" ON quiz_answers;
DROP POLICY IF EXISTS "auth_delete_quiz_answers" ON quiz_answers;
CREATE POLICY "couple_select_quiz_answers" ON quiz_answers FOR SELECT TO authenticated
  USING (couple_id = get_my_couple_id());
CREATE POLICY "couple_insert_quiz_answers" ON quiz_answers FOR INSERT TO authenticated
  WITH CHECK (couple_id = get_my_couple_id());
CREATE POLICY "couple_update_quiz_answers" ON quiz_answers FOR UPDATE TO authenticated
  USING (couple_id = get_my_couple_id()) WITH CHECK (couple_id = get_my_couple_id());
CREATE POLICY "couple_delete_quiz_answers" ON quiz_answers FOR DELETE TO authenticated
  USING (couple_id = get_my_couple_id());

-- profiles
DROP POLICY IF EXISTS "anon_select_profiles"    ON profiles;
DROP POLICY IF EXISTS "auth_insert_profiles"    ON profiles;
DROP POLICY IF EXISTS "auth_update_profiles"    ON profiles;
DROP POLICY IF EXISTS "auth_delete_profiles"    ON profiles;
CREATE POLICY "couple_select_profiles" ON profiles FOR SELECT TO authenticated
  USING (couple_id = get_my_couple_id());
CREATE POLICY "couple_insert_profiles" ON profiles FOR INSERT TO authenticated
  WITH CHECK (couple_id = get_my_couple_id());
CREATE POLICY "couple_update_profiles" ON profiles FOR UPDATE TO authenticated
  USING (couple_id = get_my_couple_id()) WITH CHECK (couple_id = get_my_couple_id());
CREATE POLICY "couple_delete_profiles" ON profiles FOR DELETE TO authenticated
  USING (couple_id = get_my_couple_id());

-- couple_events
DROP POLICY IF EXISTS "anon_select_events"      ON couple_events;
DROP POLICY IF EXISTS "auth_insert_events"      ON couple_events;
DROP POLICY IF EXISTS "auth_update_events"      ON couple_events;
DROP POLICY IF EXISTS "auth_delete_events"      ON couple_events;
CREATE POLICY "couple_select_events" ON couple_events FOR SELECT TO authenticated
  USING (couple_id = get_my_couple_id());
CREATE POLICY "couple_insert_events" ON couple_events FOR INSERT TO authenticated
  WITH CHECK (couple_id = get_my_couple_id());
CREATE POLICY "couple_update_events" ON couple_events FOR UPDATE TO authenticated
  USING (couple_id = get_my_couple_id()) WITH CHECK (couple_id = get_my_couple_id());
CREATE POLICY "couple_delete_events" ON couple_events FOR DELETE TO authenticated
  USING (couple_id = get_my_couple_id());

-- couple_analysis
DROP POLICY IF EXISTS "anon_select_analysis"    ON couple_analysis;
DROP POLICY IF EXISTS "auth_insert_analysis"    ON couple_analysis;
DROP POLICY IF EXISTS "auth_update_analysis"    ON couple_analysis;
DROP POLICY IF EXISTS "auth_delete_analysis"    ON couple_analysis;
CREATE POLICY "couple_select_analysis" ON couple_analysis FOR SELECT TO authenticated
  USING (couple_id = get_my_couple_id());
CREATE POLICY "couple_insert_analysis" ON couple_analysis FOR INSERT TO authenticated
  WITH CHECK (couple_id = get_my_couple_id());
CREATE POLICY "couple_update_analysis" ON couple_analysis FOR UPDATE TO authenticated
  USING (couple_id = get_my_couple_id()) WITH CHECK (couple_id = get_my_couple_id());
CREATE POLICY "couple_delete_analysis" ON couple_analysis FOR DELETE TO authenticated
  USING (couple_id = get_my_couple_id());

-- relationship_settings
DROP POLICY IF EXISTS "anon_select_settings"    ON relationship_settings;
DROP POLICY IF EXISTS "auth_insert_settings"    ON relationship_settings;
DROP POLICY IF EXISTS "auth_update_settings"    ON relationship_settings;
DROP POLICY IF EXISTS "auth_delete_settings"    ON relationship_settings;
CREATE POLICY "couple_select_settings" ON relationship_settings FOR SELECT TO authenticated
  USING (couple_id = get_my_couple_id());
CREATE POLICY "couple_insert_settings" ON relationship_settings FOR INSERT TO authenticated
  WITH CHECK (couple_id = get_my_couple_id());
CREATE POLICY "couple_update_settings" ON relationship_settings FOR UPDATE TO authenticated
  USING (couple_id = get_my_couple_id()) WITH CHECK (couple_id = get_my_couple_id());
CREATE POLICY "couple_delete_settings" ON relationship_settings FOR DELETE TO authenticated
  USING (couple_id = get_my_couple_id());

-- memories
DROP POLICY IF EXISTS "anon_select_memories"    ON memories;
DROP POLICY IF EXISTS "auth_insert_memories"    ON memories;
DROP POLICY IF EXISTS "auth_update_memories"    ON memories;
DROP POLICY IF EXISTS "auth_delete_memories"    ON memories;
CREATE POLICY "couple_select_memories" ON memories FOR SELECT TO authenticated
  USING (couple_id = get_my_couple_id());
CREATE POLICY "couple_insert_memories" ON memories FOR INSERT TO authenticated
  WITH CHECK (couple_id = get_my_couple_id());
CREATE POLICY "couple_update_memories" ON memories FOR UPDATE TO authenticated
  USING (couple_id = get_my_couple_id()) WITH CHECK (couple_id = get_my_couple_id());
CREATE POLICY "couple_delete_memories" ON memories FOR DELETE TO authenticated
  USING (couple_id = get_my_couple_id());
