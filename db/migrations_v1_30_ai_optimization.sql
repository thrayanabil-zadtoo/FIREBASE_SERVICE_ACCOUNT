CREATE TABLE IF NOT EXISTS ai_optimization_recommendations (
  id BIGSERIAL PRIMARY KEY,
  environment VARCHAR(30) NOT NULL DEFAULT 'production',
  category VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  estimated_savings NUMERIC(18,8) NOT NULL DEFAULT 0,
  estimated_savings_percent NUMERIC(8,3) NOT NULL DEFAULT 0,
  risk_level VARCHAR(20) NOT NULL DEFAULT 'medium',
  status VARCHAR(30) NOT NULL DEFAULT 'pending_review',
  correlation_id VARCHAR(120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_optimization_reviews (
  id BIGSERIAL PRIMARY KEY,
  recommendation_id BIGINT NOT NULL,
  decision VARCHAR(30) NOT NULL,
  actor VARCHAR(160) NOT NULL,
  reason TEXT NOT NULL,
  correlation_id VARCHAR(120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_optimization_snapshots (
  id BIGSERIAL PRIMARY KEY,
  environment VARCHAR(30) NOT NULL,
  provider VARCHAR(120),
  model VARCHAR(160),
  requests BIGINT NOT NULL DEFAULT 0,
  input_tokens BIGINT NOT NULL DEFAULT 0,
  output_tokens BIGINT NOT NULL DEFAULT 0,
  estimated_cost NUMERIC(18,8) NOT NULL DEFAULT 0,
  efficiency_score NUMERIC(8,3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_optimization_audit (
  id BIGSERIAL PRIMARY KEY,
  action VARCHAR(80) NOT NULL,
  actor VARCHAR(160),
  recommendation_id BIGINT,
  correlation_id VARCHAR(120),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
