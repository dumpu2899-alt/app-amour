-- Profiles table for both partners
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  photo_url text,
  birthday date,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Important events (anniversaries, first dates, etc.)
CREATE TABLE couple_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date date NOT NULL,
  event_type text NOT NULL DEFAULT 'anniversary',
  description text,
  reminder boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Daily/Weekly couple analysis stats
CREATE TABLE couple_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  questions_answered int DEFAULT 0,
  quizzes_completed int DEFAULT 0,
  games_played int DEFAULT 0,
  messages_sent int DEFAULT 0,
  connection_score int DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Relationship settings
CREATE TABLE relationship_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner1_name text DEFAULT 'Vous',
  partner2_name text DEFAULT 'Votre amour',
  relationship_start_date date,
  language text DEFAULT 'fr',
  theme text DEFAULT 'violet',
  shared_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies (single-tenant app)
CREATE POLICY "anon_select_profiles" ON profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_profiles" ON profiles FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_profiles" ON profiles FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_profiles" ON profiles FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "anon_select_events" ON couple_events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_events" ON couple_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_events" ON couple_events FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_events" ON couple_events FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "anon_select_analysis" ON couple_analysis FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_analysis" ON couple_analysis FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_analysis" ON couple_analysis FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_analysis" ON couple_analysis FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "anon_select_settings" ON relationship_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_settings" ON relationship_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_settings" ON relationship_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_settings" ON relationship_settings FOR DELETE TO anon, authenticated USING (true);

-- Table comments
COMMENT ON TABLE profiles IS 'Single-tenant: partner profiles shared in app';
COMMENT ON TABLE couple_events IS 'Single-tenant: important dates/events for the couple';
COMMENT ON TABLE couple_analysis IS 'Single-tenant: daily/weekly analysis stats';
COMMENT ON TABLE relationship_settings IS 'Single-tenant: relationship configuration';

-- Insert default profiles
INSERT INTO profiles (name) VALUES ('Partner 1'), ('Partner 2');

-- Insert default settings
INSERT INTO relationship_settings DEFAULT VALUES;
