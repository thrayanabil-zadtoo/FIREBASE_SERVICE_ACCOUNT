CREATE TABLE IF NOT EXISTS ai_incidents (
  id BIGSERIAL PRIMARY KEY,
  incident_key VARCHAR(120) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL DEFAULT 'warning',
  status VARCHAR(30) NOT NULL DEFAULT 'detected',
  environment VARCHAR(30) NOT NULL DEFAULT 'production',
  owner VARCHAR(160),
  alert_id BIGINT,
  correlation_id VARCHAR(120),
  slo_policy_id BIGINT,
  active_version_id BIGINT,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ,
  mitigated_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  root_cause TEXT,
  remediation_actions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_incident_events (
  id BIGSERIAL PRIMARY KEY,
  incident_id BIGINT NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  actor VARCHAR(160),
  note TEXT,
  correlation_id VARCHAR(120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_recovery_plans (
  id BIGSERIAL PRIMARY KEY,
  incident_id BIGINT NOT NULL,
  title TEXT NOT NULL,
  steps_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  risk_level VARCHAR(20) NOT NULL DEFAULT 'medium',
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  approval_required BOOLEAN NOT NULL DEFAULT TRUE,
  approved_by VARCHAR(160),
  approved_at TIMESTAMPTZ,
  executed_by VARCHAR(160),
  executed_at TIMESTAMPTZ,
  execution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_incident_audit (
  id BIGSERIAL PRIMARY KEY,
  incident_id BIGINT,
  recovery_plan_id BIGINT,
  action VARCHAR(80) NOT NULL,
  actor VARCHAR(160),
  reason TEXT,
  correlation_id VARCHAR(120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_post_incident_reviews (
  id BIGSERIAL PRIMARY KEY,
  incident_id BIGINT NOT NULL,
  summary TEXT,
  root_cause TEXT,
  contributing_factors TEXT,
  remediation_actions TEXT,
  prevention_actions TEXT,
  owner VARCHAR(160),
  approved_by VARCHAR(160),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
