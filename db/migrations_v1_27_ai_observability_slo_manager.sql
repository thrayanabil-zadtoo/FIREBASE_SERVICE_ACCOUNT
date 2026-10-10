-- DARB V1.27 additive migration only

CREATE TABLE IF NOT EXISTS ai_observability_metrics (
  id BIGSERIAL PRIMARY KEY,
  environment TEXT NOT NULL,
  version_id BIGINT,
  metric_key TEXT NOT NULL,
  metric_value NUMERIC,
  unit TEXT,
  window_start TIMESTAMPTZ,
  window_end TIMESTAMPTZ,
  labels_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_obs_metrics_lookup
  ON ai_observability_metrics(environment, metric_key, created_at);

CREATE TABLE IF NOT EXISTS ai_slo_policies (
  id BIGSERIAL PRIMARY KEY,
  environment TEXT NOT NULL,
  metric_key TEXT NOT NULL,
  target NUMERIC NOT NULL,
  comparison TEXT NOT NULL DEFAULT 'lte',
  window_minutes INTEGER NOT NULL DEFAULT 60,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_observability_alerts (
  id BIGSERIAL PRIMARY KEY,
  environment TEXT NOT NULL,
  version_id BIGINT,
  metric_key TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'warning',
  status TEXT NOT NULL DEFAULT 'open',
  observed_value NUMERIC,
  threshold NUMERIC,
  message TEXT,
  correlation_id TEXT,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  acknowledged_by BIGINT,
  resolved_by BIGINT
);

CREATE INDEX IF NOT EXISTS idx_ai_obs_alerts_status
  ON ai_observability_alerts(status, opened_at);

CREATE TABLE IF NOT EXISTS ai_observability_incidents (
  id BIGSERIAL PRIMARY KEY,
  environment TEXT NOT NULL,
  version_id BIGINT,
  alert_id BIGINT,
  status TEXT NOT NULL DEFAULT 'open',
  severity TEXT NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  summary TEXT,
  root_cause TEXT,
  remediation TEXT,
  opened_by BIGINT,
  resolved_by BIGINT,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS ai_observability_audit (
  id BIGSERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  actor_id BIGINT,
  environment TEXT,
  version_id BIGINT,
  alert_id BIGINT,
  incident_id BIGINT,
  reason TEXT,
  details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
