-- DARB GKE V1.1
CREATE TABLE IF NOT EXISTS darb_knowledge_seed_batches (
 id BIGSERIAL PRIMARY KEY, batch_name TEXT NOT NULL, source_name TEXT NOT NULL,
 source_version TEXT NOT NULL, imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 status TEXT NOT NULL DEFAULT 'pending_review', auto_publish BOOLEAN NOT NULL DEFAULT FALSE,
 reviewer_id TEXT, review_reason TEXT
);
CREATE TABLE IF NOT EXISTS darb_knowledge_verification_queue (
 id BIGSERIAL PRIMARY KEY, fact_key TEXT NOT NULL, country_code TEXT NOT NULL,
 axis TEXT NOT NULL, proposed_value TEXT, source_url TEXT, source_version TEXT,
 verification_status TEXT NOT NULL DEFAULT 'pending', confidence TEXT NOT NULL DEFAULT 'limited',
 verified_at TIMESTAMPTZ, reviewer_id TEXT, review_reason TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 reviewed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_darb_gke_verify_country_axis ON darb_knowledge_verification_queue(country_code, axis);
CREATE INDEX IF NOT EXISTS idx_darb_gke_verify_status ON darb_knowledge_verification_queue(verification_status);
-- Governance invariant: auto_publish=false; publication requires human review.
