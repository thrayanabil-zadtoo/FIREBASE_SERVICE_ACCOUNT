-- DARB V1.11 additive migration. No DROP/TRUNCATE.
CREATE TABLE IF NOT EXISTS ai_unanswered_questions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NULL,
  question TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ai_unanswered_seen ON ai_unanswered_questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_unanswered_question ON ai_unanswered_questions(question);
