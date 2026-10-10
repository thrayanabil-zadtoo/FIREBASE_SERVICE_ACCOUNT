-- DARB V1.14 — additive only
CREATE TABLE IF NOT EXISTS ai_answer_runs (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT,
  user_id BIGINT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  answer_source TEXT NOT NULL DEFAULT 'knowledge',
  confidence_level TEXT NOT NULL DEFAULT 'supported',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sources_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  conflicts_json JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_ai_answer_runs_conversation
  ON ai_answer_runs(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_answer_runs_created_at
  ON ai_answer_runs(created_at);
