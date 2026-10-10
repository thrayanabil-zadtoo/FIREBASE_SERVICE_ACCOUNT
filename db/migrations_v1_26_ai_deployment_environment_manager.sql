-- DARB V1.26 additive migration only

CREATE TABLE IF NOT EXISTS ai_deployment_environments (
  id BIGSERIAL PRIMARY KEY,
  environment_key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  protected BOOLEAN NOT NULL DEFAULT FALSE,
  active_version_id BIGINT,
  config_snapshot_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_deployment_jobs (
  id BIGSERIAL PRIMARY KEY,
  environment_id BIGINT,
  version_id BIGINT,
  source_environment_id BIGINT,
  status TEXT NOT NULL DEFAULT 'pending',
  correlation_id TEXT,
  preflight_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  checklist_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  requested_by BIGINT,
  approved_by BIGINT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  deployed_at TIMESTAMPTZ,
  rollback_of_job_id BIGINT,
  reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_ai_deployment_jobs_environment
  ON ai_deployment_jobs(environment_id);

CREATE INDEX IF NOT EXISTS idx_ai_deployment_jobs_created
  ON ai_deployment_jobs(requested_at);

CREATE TABLE IF NOT EXISTS ai_deployment_audit (
  id BIGSERIAL PRIMARY KEY,
  job_id BIGINT,
  environment_id BIGINT,
  version_id BIGINT,
  action TEXT NOT NULL,
  actor_id BIGINT,
  from_status TEXT,
  to_status TEXT,
  reason TEXT,
  details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_deployment_audit_created
  ON ai_deployment_audit(created_at);

CREATE TABLE IF NOT EXISTS ai_environment_checks (
  id BIGSERIAL PRIMARY KEY,
  job_id BIGINT,
  check_key TEXT NOT NULL,
  status TEXT NOT NULL,
  expected TEXT,
  actual TEXT,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO ai_deployment_environments
(environment_key, display_name, protected)
VALUES
('development', 'Development', FALSE),
('staging', 'Staging', TRUE),
('production', 'Production', TRUE)
ON CONFLICT (environment_key) DO NOTHING;
