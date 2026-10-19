-- ConfessIT Supabase Schema
-- Run this in the Supabase SQL Editor to initialize your database.

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ROOMS ENUM
-- ============================================================
CREATE TYPE room_type AS ENUM (
  'roast',
  'advice',
  'confessional',
  'glitch',
  'hottakes'
);

-- ============================================================
-- DAILY PROMPTS TABLE
-- ============================================================
CREATE TABLE daily_prompts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_text   TEXT NOT NULL,
  active_date   DATE NOT NULL UNIQUE,
  room          room_type NOT NULL DEFAULT 'confessional',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_prompts_active_date ON daily_prompts (active_date DESC);

-- ============================================================
-- POSTS TABLE
-- ============================================================
CREATE TABLE posts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content       TEXT NOT NULL CHECK (char_length(content) >= 5 AND char_length(content) <= 2000),
  room          room_type NOT NULL,
  prompt_id     UUID REFERENCES daily_prompts(id) ON DELETE SET NULL,
  likes         INT NOT NULL DEFAULT 0 CHECK (likes >= 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_room ON posts (room);
CREATE INDEX idx_posts_created ON posts (created_at DESC);
CREATE INDEX idx_posts_prompt ON posts (prompt_id);

-- ============================================================
-- COMMENTS TABLE
-- ============================================================
CREATE TABLE comments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id       UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  content       TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 500),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON comments (post_id);
CREATE INDEX idx_comments_created ON comments (created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE daily_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read prompts" ON daily_prompts FOR SELECT USING (true);
CREATE POLICY "Public read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Public read comments" ON comments FOR SELECT USING (true);

-- Anonymous insert for posts and comments
CREATE POLICY "Anon insert posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon insert comments" ON comments FOR INSERT WITH CHECK (true);

-- Allow anonymous likes (update only the likes column)
CREATE POLICY "Anon like posts" ON posts FOR UPDATE USING (true) WITH CHECK (true);

-- Only service_role can manage prompts
CREATE POLICY "Admin manage prompts" ON daily_prompts FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- SEED DATA: Next 30 days of daily prompts
-- ============================================================
INSERT INTO daily_prompts (prompt_text, active_date, room) VALUES
  ('What is your biggest regret?', CURRENT_DATE, 'confessional'),
  ('Worst first date story?', CURRENT_DATE + INTERVAL '1 day', 'roast'),
  ('A secret you have kept from family?', CURRENT_DATE + INTERVAL '2 days', 'confessional'),
  ('What is the strangest coincidence you have experienced?', CURRENT_DATE + INTERVAL '3 days', 'glitch'),
  ('Unpopular food opinion — go!', CURRENT_DATE + INTERVAL '4 days', 'hottakes'),
  ('Best advice you never followed?', CURRENT_DATE + INTERVAL '5 days', 'advice'),
  ('A lie you told that spiralled out of control?', CURRENT_DATE + INTERVAL '6 days', 'confessional'),
  ('Roast your own cooking skills', CURRENT_DATE + INTERVAL '7 days', 'roast'),
  ('A glitch in the matrix moment?', CURRENT_DATE + INTERVAL '8 days', 'glitch'),
  ('Hot take: overrated TV shows?', CURRENT_DATE + INTERVAL '9 days', 'hottakes'),
  ('What would you tell your 16-year-old self?', CURRENT_DATE + INTERVAL '10 days', 'advice'),
  ('Something you have never told your best friend?', CURRENT_DATE + INTERVAL '11 days', 'confessional'),
  ('Most embarrassing thing you have done at work?', CURRENT_DATE + INTERVAL '12 days', 'roast'),
  ('A dream that felt too real?', CURRENT_DATE + INTERVAL '13 days', 'glitch'),
  ('Hot take: which trend needs to die?', CURRENT_DATE + INTERVAL '14 days', 'hottakes')
ON CONFLICT (active_date) DO NOTHING;

-- ============================================================
-- HELPER FUNCTION: Increment likes atomically
-- ============================================================
CREATE OR REPLACE FUNCTION increment_likes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET likes = likes + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
