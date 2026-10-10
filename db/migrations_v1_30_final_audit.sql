CREATE TABLE IF NOT EXISTS ai_production_signoffs (
  id BIGSERIAL PRIMARY KEY,
  version VARCHAR(50) NOT NULL DEFAULT 'V1.30',
  environment VARCHAR(50) NOT NULL DEFAULT 'production',
  decision VARCHAR(50) NOT NULL, -- APPROVED, REVIEW_REQUIRED, BLOCKED
  actor VARCHAR(160) NOT NULL,
  reason TEXT NOT NULL,
  gate_results JSONB,
  critical_findings JSONB,
  correlation_id VARCHAR(120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
