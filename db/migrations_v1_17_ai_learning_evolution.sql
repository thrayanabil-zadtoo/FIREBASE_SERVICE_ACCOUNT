CREATE TABLE IF NOT EXISTS ai_learning_topics (
  id BIGSERIAL PRIMARY KEY,
  topic_key TEXT NOT NULL UNIQUE,
  topic_label TEXT NOT NULL,
  question_count INTEGER NOT NULL DEFAULT 0,
  unanswered_count INTEGER NOT NULL DEFAULT 0,
  low_rating_count INTEGER NOT NULL DEFAULT 0,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_learning_topics_questions
  ON ai_learning_topics(question_count DESC);

CREATE TABLE IF NOT EXISTS ai_knowledge_gaps (
  id BIGSERIAL PRIMARY KEY,
  topic TEXT NOT NULL,
  question TEXT NOT NULL,
  evidence_status TEXT NOT NULL DEFAULT 'insufficient',
  occurrence_count INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending',
  proposed_answer TEXT,
  reviewer_id BIGINT,
  review_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_gaps_status
  ON ai_knowledge_gaps(status);

CREATE TABLE IF NOT EXISTS ai_answer_drafts (
  id BIGSERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  draft_answer TEXT NOT NULL,
  source_answer_run_id BIGINT,
  evidence_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  draft_reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewer_id BIGINT,
  review_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_answer_drafts_status
  ON ai_answer_drafts(status);

CREATE TABLE IF NOT EXISTS ai_knowledge_refresh_queue (
  id BIGSERIAL PRIMARY KEY,
  source_url TEXT,
  knowledge_item_id BIGINT,
  reason TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'pending',
  last_checked_at TIMESTAMPTZ,
  reviewer_id BIGINT,
  review_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_refresh_queue_status
  ON ai_knowledge_refresh_queue(status);

CREATE TABLE IF NOT EXISTS ai_learning_metrics (
  id BIGSERIAL PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_learning_metrics_name
  ON ai_learning_metrics(metric_name);
