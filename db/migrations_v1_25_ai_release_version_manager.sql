-- DARB V1.25 additive migration only

CREATE TABLE IF NOT EXISTS ai_release_versions (
  id BIGSERIAL PRIMARY KEY,
  version_label TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft',
  release_gate_id BIGINT,
  parent_version_id BIGINT,
  config_snapshot_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by BIGINT,
  approved_by BIGINT,
  approved_at TIMESTAMPTZ,
  activated_at TIMESTAMPTZ,
  retired_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_release_versions_status
  ON ai_release_versions(status);

CREATE TABLE IF NOT EXISTS ai_release_version_snapshots (
  id BIGSERIAL PRIMARY KEY,
  version_id BIGINT REFERENCES ai_release_versions(id),
  snapshot_type TEXT NOT NULL DEFAULT 'config',
  snapshot_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  checksum TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_release_snapshots_version
  ON ai_release_version_snapshots(version_id);

CREATE TABLE IF NOT EXISTS ai_release_version_audit (
  id BIGSERIAL PRIMARY KEY,
  version_id BIGINT,
  action TEXT NOT NULL,
  actor_id BIGINT,
  from_status TEXT,
  to_status TEXT,
  reason TEXT,
  details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_release_version_audit_created
  ON ai_release_version_audit(created_at);

CREATE TABLE IF NOT EXISTS ai_release_active_pointer (
  id SMALLINT PRIMARY KEY DEFAULT 1,
  active_version_id BIGINT,
  updated_by BIGINT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO ai_release_active_pointer(id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;
