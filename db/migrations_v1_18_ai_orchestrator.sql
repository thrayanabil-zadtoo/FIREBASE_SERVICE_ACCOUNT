-- DARB Full V1.18 — AI Orchestrator Migration
-- Creates persistent storage for orchestration runs, steps, and decisions

CREATE TABLE IF NOT EXISTS ai_orchestration_runs (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT,
  user_id BIGINT,
  question TEXT NOT NULL,
  route TEXT NOT NULL DEFAULT 'knowledge_first',
  consent_web_search BOOLEAN NOT NULL DEFAULT FALSE,
  knowledge_count INTEGER NOT NULL DEFAULT 0,
  web_count INTEGER NOT NULL DEFAULT 0,
  confidence_level TEXT,
  final_answer TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_ai_orchestration_runs_created ON ai_orchestration_runs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_orchestration_runs_conversation ON ai_orchestration_runs(conversation_id);

CREATE TABLE IF NOT EXISTS ai_orchestration_steps (
  id BIGSERIAL PRIMARY KEY,
  run_id BIGINT NOT NULL,
  step_name TEXT NOT NULL,
  status TEXT NOT NULL,
  duration_ms INTEGER,
  input_count INTEGER,
  output_count INTEGER,
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_orchestration_steps_run ON ai_orchestration_steps(run_id);

CREATE TABLE IF NOT EXISTS ai_orchestration_decisions (
  id BIGSERIAL PRIMARY KEY,
  run_id BIGINT NOT NULL,
  decision_type TEXT NOT NULL,
  decision_value TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_orchestration_decisions_run ON ai_orchestration_decisions(run_id);
