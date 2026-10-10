CREATE TABLE IF NOT EXISTS ai_capacity_cost_metrics (
  id BIGSERIAL PRIMARY KEY,
  environment VARCHAR(30) NOT NULL DEFAULT 'production',
  provider VARCHAR(120),
  model VARCHAR(160),
  window_start TIMESTAMPTZ NOT NULL,
  window_end TIMESTAMPTZ NOT NULL,
  requests BIGINT NOT NULL DEFAULT 0,
  successful_requests BIGINT NOT NULL DEFAULT 0,
  failed_requests BIGINT NOT NULL DEFAULT 0,
  input_tokens BIGINT NOT NULL DEFAULT 0,
  output_tokens BIGINT NOT NULL DEFAULT 0,
  estimated_cost NUMERIC(18,8) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_cost_budget_policies (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  environment VARCHAR(30) NOT NULL DEFAULT 'production',
  period VARCHAR(20) NOT NULL DEFAULT 'monthly',
  budget_amount NUMERIC(18,8) NOT NULL,
  warning_percent NUMERIC(6,2) NOT NULL DEFAULT 80,
  critical_percent NUMERIC(6,2) NOT NULL DEFAULT 100,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_capacity_policies (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  environment VARCHAR(30) NOT NULL DEFAULT 'production',
  metric VARCHAR(60) NOT NULL,
  operator VARCHAR(10) NOT NULL,
  threshold NUMERIC(18,8) NOT NULL,
  window_minutes INTEGER NOT NULL DEFAULT 60,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_capacity_cost_alerts (
  id BIGSERIAL PRIMARY KEY,
  type VARCHAR(40) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'open',
  environment VARCHAR(30) NOT NULL,
  message TEXT NOT NULL,
  observed_value NUMERIC(18,8),
  threshold NUMERIC(18,8),
  correlation_id VARCHAR(120),
  acknowledged_by VARCHAR(160),
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_cost_forecasts (
  id BIGSERIAL PRIMARY KEY,
  environment VARCHAR(30) NOT NULL,
  period VARCHAR(20) NOT NULL,
  observed_cost NUMERIC(18,8) NOT NULL DEFAULT 0,
  forecast_cost NUMERIC(18,8) NOT NULL DEFAULT 0,
  forecast_method VARCHAR(80) NOT NULL DEFAULT 'rolling_average',
  confidence VARCHAR(20) NOT NULL DEFAULT 'limited',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_capacity_cost_audit (
  id BIGSERIAL PRIMARY KEY,
  action VARCHAR(80) NOT NULL,
  actor VARCHAR(160),
  policy_id BIGINT,
  alert_id BIGINT,
  correlation_id VARCHAR(120),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
