-- DARB V1.8 — DARB AI conversations. Additive migration only.
CREATE TABLE IF NOT EXISTS ai_conversations (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 title VARCHAR(180) NOT NULL DEFAULT 'محادثة جديدة',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS ai_messages (
 id BIGSERIAL PRIMARY KEY,
 conversation_id BIGINT NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
 role VARCHAR(20) NOT NULL CHECK (role IN ('user','assistant','system')),
 content TEXT NOT NULL,
 source VARCHAR(30) NOT NULL DEFAULT 'darb',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_updated ON ai_conversations(user_id,updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_created ON ai_messages(conversation_id,created_at);
