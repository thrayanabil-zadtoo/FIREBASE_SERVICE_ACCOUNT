CREATE TABLE IF NOT EXISTS ai_eval_run_jobs (
 id BIGSERIAL PRIMARY KEY, suite_id BIGINT, run_id BIGINT, correlation_id TEXT NOT NULL,
 mode TEXT NOT NULL DEFAULT 'dry_run', status TEXT NOT NULL DEFAULT 'queued',
 total_cases INT NOT NULL DEFAULT 0, completed_cases INT NOT NULL DEFAULT 0,
 failed_cases INT NOT NULL DEFAULT 0, started_at TIMESTAMPTZ, finished_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_ai_eval_run_jobs_status ON ai_eval_run_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ai_eval_run_jobs_correlation ON ai_eval_run_jobs(correlation_id);
CREATE TABLE IF NOT EXISTS ai_eval_case_executions (
 id BIGSERIAL PRIMARY KEY, job_id BIGINT REFERENCES ai_eval_run_jobs(id), case_id BIGINT,
 route_expected TEXT, route_actual TEXT, source_expected TEXT, source_actual TEXT,
 confidence_expected TEXT, confidence_actual TEXT, evidence_ok BOOLEAN NOT NULL DEFAULT false,
 citations_ok BOOLEAN NOT NULL DEFAULT false, passed BOOLEAN NOT NULL DEFAULT false,
 latency_ms INT, tokens INT, error_code TEXT, observation_json JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_eval_case_exec_job ON ai_eval_case_executions(job_id);
