-- Channels
CREATE TABLE channels (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 50),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL
);

-- Messages
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  channel_id BIGINT NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL CHECK (char_length(nickname) >= 1 AND char_length(nickname) <= 30),
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_channel_created ON messages(channel_id, created_at DESC);

-- Reactions
CREATE TABLE reactions (
  id BIGSERIAL PRIMARY KEY,
  message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  emoji TEXT NOT NULL CHECK (char_length(emoji) BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(message_id, nickname, emoji)
);

CREATE INDEX idx_reactions_message_id ON reactions(message_id);

-- RLS (fully permissive for anonymous access)
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "channels_select_anon" ON channels FOR SELECT USING (true);
CREATE POLICY "channels_insert_anon" ON channels FOR INSERT WITH CHECK (true);

CREATE POLICY "messages_select_anon" ON messages FOR SELECT USING (true);
CREATE POLICY "messages_insert_anon" ON messages FOR INSERT WITH CHECK (true);

CREATE POLICY "reactions_select_anon" ON reactions FOR SELECT USING (true);
CREATE POLICY "reactions_insert_anon" ON reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "reactions_delete_anon" ON reactions FOR DELETE USING (true);

-- Enable Realtime for all tables (required for Supabase Realtime)
ALTER PUBLICATION supabase_realtime ADD TABLE channels;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE reactions;
