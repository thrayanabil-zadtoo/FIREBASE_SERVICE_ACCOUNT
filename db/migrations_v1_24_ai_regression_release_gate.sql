-- DARB V1.24 additive migration only

CREATE TABLE IF NOT EXISTS ai_regression_runs (
  id BIGSERIAL PRIMARY KEY,
  baseline_job_id BIGINT,
  current_job_id BIGINT,
  baseline_pass_rate NUMERIC(8,5),
  current_pass_rate NUMERIC(8,5),
  baseline_latency_ms NUMERIC(12,3),
  current_latency_ms NUMERIC(12,3),
  baseline_tokens NUMERIC(12,3),
  current_tokens NUMERIC(12,3),
  delta_pass_rate NUMERIC(8,5),
  delta_latency_ms NUMERIC(12,3),
  delta_tokens NUMERIC(12,3),
  regression_detected BOOLEAN NOT NULL DEFAULT false,
  gate_status TEXT NOT NULL DEFAULT 'review',
  details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_regression_runs_status
  ON ai_regression_runs(gate_status);

CREATE INDEX IF NOT EXISTS idx_ai_regression_runs_created
  ON ai_regression_runs(created_at);

CREATE TABLE IF NOT EXISTS ai_release_gates (
  id BIGSERIAL PRIMARY KEY,
  regression_run_id BIGINT REFERENCES ai_regression_runs(id),
  release_label TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'review',
  threshold_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  decision_reason TEXT,
  reviewer_id BIGINT,
  decided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_release_gates_status
  ON ai_release_gates(status);

CREATE TABLE IF NOT EXISTS ai_release_gate_audit (
  id BIGSERIAL PRIMARY KEY,
  gate_id BIGINT REFERENCES ai_release_gates(id),
  action TEXT NOT NULL,
  actor_id BIGINT,
  details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
