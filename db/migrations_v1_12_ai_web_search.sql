-- DARB V1.12 — safe incremental migration
-- No DROP / TRUNCATE / destructive changes.

CREATE TABLE IF NOT EXISTS ai_web_searches (
  id BIGSERIAL PRIMARY KEY,
  conversation_id TEXT,
  user_id TEXT,
  query TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'generic',
  searched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  result_count INTEGER NOT NULL DEFAULT 0,
  results_json JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_ai_web_searches_conversation
  ON ai_web_searches(conversation_id);

CREATE INDEX IF NOT EXISTS idx_ai_web_searches_searched_at
  ON ai_web_searches(searched_at);
