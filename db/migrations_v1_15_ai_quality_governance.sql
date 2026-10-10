CREATE TABLE IF NOT EXISTS ai_answer_feedback (
  id BIGSERIAL PRIMARY KEY,
  answer_run_id BIGINT,
  conversation_id BIGINT,
  user_id BIGINT,
  rating TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_answer_feedback_run
  ON ai_answer_feedback(answer_run_id);

CREATE INDEX IF NOT EXISTS idx_ai_answer_feedback_created
  ON ai_answer_feedback(created_at);

CREATE TABLE IF NOT EXISTS ai_knowledge_candidates (
  id BIGSERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  proposed_answer TEXT,
  source_answer_run_id BIGINT,
  source_type TEXT NOT NULL DEFAULT 'unanswered',
  status TEXT NOT NULL DEFAULT 'pending',
  reviewer_id BIGINT,
  review_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_candidates_status
  ON ai_knowledge_candidates(status);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_candidates_created
  ON ai_knowledge_candidates(created_at);

CREATE TABLE IF NOT EXISTS ai_quality_reviews (
  id BIGSERIAL PRIMARY KEY,
  answer_run_id BIGINT,
  reviewer_id BIGINT,
  decision TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_quality_reviews_run
  ON ai_quality_reviews(answer_run_id);
