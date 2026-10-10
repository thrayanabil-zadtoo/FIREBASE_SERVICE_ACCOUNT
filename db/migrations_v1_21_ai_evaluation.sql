CREATE TABLE IF NOT EXISTS ai_eval_suites (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_eval_cases (
  id BIGSERIAL PRIMARY KEY,
  suite_id BIGINT NOT NULL REFERENCES ai_eval_suites(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  expected_route TEXT,
  expected_source TEXT,
  expected_min_confidence TEXT,
  tags_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_eval_runs (
  id BIGSERIAL PRIMARY KEY,
  suite_id BIGINT NOT NULL REFERENCES ai_eval_suites(id),
  run_label TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  total_cases INTEGER NOT NULL DEFAULT 0,
  passed_cases INTEGER NOT NULL DEFAULT 0,
  failed_cases INTEGER NOT NULL DEFAULT 0,
  avg_latency_ms NUMERIC,
  estimated_tokens BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_eval_results (
  id BIGSERIAL PRIMARY KEY,
  run_id BIGINT NOT NULL REFERENCES ai_eval_runs(id) ON DELETE CASCADE,
  case_id BIGINT NOT NULL REFERENCES ai_eval_cases(id),
  passed BOOLEAN NOT NULL,
  route_actual TEXT,
  source_actual TEXT,
  confidence_actual TEXT,
  latency_ms INTEGER,
  estimated_tokens BIGINT NOT NULL DEFAULT 0,
  checks_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  answer_excerpt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_eval_cases_suite ON ai_eval_cases(suite_id);
CREATE INDEX IF NOT EXISTS idx_ai_eval_runs_created ON ai_eval_runs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_eval_results_run ON ai_eval_results(run_id);
