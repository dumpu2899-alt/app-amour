CREATE TABLE memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date date NOT NULL,
  content text,
  photo_url text,
  type text NOT NULL DEFAULT 'text',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_memories" ON memories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_memories" ON memories FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_memories" ON memories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_memories" ON memories FOR DELETE TO anon, authenticated USING (true);

COMMENT ON TABLE memories IS 'Single-tenant: couple memories/souvenirs for timeline';

-- Seed a few example memories
INSERT INTO memories (title, date, content, type) VALUES
('Le premier câlin', '2026-06-26', 'Ce moment magique où on s''est pris dans les bras pour la première fois...', 'text'),
('On s''est mis ensemble', '2026-06-09', NULL, 'photo');
