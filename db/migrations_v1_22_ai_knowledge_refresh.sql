-- DARB V1.22 additive migration
CREATE TABLE IF NOT EXISTS ai_knowledge_refresh_queue (
  id BIGSERIAL PRIMARY KEY,
  knowledge_id BIGINT,
  title TEXT NOT NULL,
  country TEXT,
  city TEXT,
  reason TEXT NOT NULL,
  freshness_status TEXT NOT NULL DEFAULT 'aging',
  priority TEXT NOT NULL DEFAULT 'normal',
  source_url TEXT,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending',
  created_by BIGINT
);

CREATE INDEX IF NOT EXISTS idx_ai_refresh_queue_status
  ON ai_knowledge_refresh_queue(status);
CREATE INDEX IF NOT EXISTS idx_ai_refresh_queue_priority
  ON ai_knowledge_refresh_queue(priority);

CREATE TABLE IF NOT EXISTS ai_knowledge_update_candidates (
  id BIGSERIAL PRIMARY KEY,
  refresh_id BIGINT REFERENCES ai_knowledge_refresh_queue(id),
  knowledge_id BIGINT,
  old_content TEXT,
  proposed_content TEXT NOT NULL,
  sources_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  confidence_level TEXT NOT NULL DEFAULT 'limited',
  review_status TEXT NOT NULL DEFAULT 'pending',
  reviewer_id BIGINT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_update_candidates_status
  ON ai_knowledge_update_candidates(review_status);

CREATE TABLE IF NOT EXISTS ai_knowledge_refresh_audit (
  id BIGSERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  refresh_id BIGINT,
  candidate_id BIGINT,
  actor_id BIGINT,
  details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_refresh_audit_created_at
  ON ai_knowledge_refresh_audit(created_at);
