-- DARB V1.13 — additive migration only
CREATE TABLE IF NOT EXISTS ai_web_search_cache (
  id BIGSERIAL PRIMARY KEY,
  query_hash TEXT NOT NULL UNIQUE,
  query TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'generic',
  searched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  results_json JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_ai_web_search_cache_expires_at
  ON ai_web_search_cache(expires_at);
