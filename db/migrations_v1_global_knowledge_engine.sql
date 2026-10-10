-- =========================================================
-- DARB Global Knowledge Engine V1 Migration
-- Clean Update مبني على الدليل المطور للدول العربية الـ22
-- =========================================================

CREATE TABLE IF NOT EXISTS darb_knowledge_countries (
  country_id TEXT PRIMARY KEY,
  country_name_ar TEXT NOT NULL,
  country_name_en TEXT,
  capital TEXT,
  currency TEXT,
  timezone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  source_document TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS darb_knowledge_sources (
  source_id BIGSERIAL PRIMARY KEY,
  country_id TEXT REFERENCES darb_knowledge_countries(country_id),
  source_name TEXT,
  source_url TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'official',
  trust_level TEXT NOT NULL DEFAULT 'standard',
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS darb_knowledge_facts (
  fact_id BIGSERIAL PRIMARY KEY,
  country_id TEXT REFERENCES darb_knowledge_countries(country_id),
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  value_json JSONB NOT NULL,
  currency TEXT,
  source_id BIGINT REFERENCES darb_knowledge_sources(source_id),
  source_document TEXT,
  verified_at TIMESTAMPTZ,
  freshness_status TEXT NOT NULL DEFAULT 'unknown',
  confidence_level TEXT NOT NULL DEFAULT 'limited',
  publication_status TEXT NOT NULL DEFAULT 'pending_review',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS darb_knowledge_refresh_queue (
  refresh_id BIGSERIAL PRIMARY KEY,
  fact_id BIGINT REFERENCES darb_knowledge_facts(fact_id),
  priority TEXT NOT NULL DEFAULT 'normal',
  reason TEXT NOT NULL,
  requested_by TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  correlation_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_darb_facts_country_category
ON darb_knowledge_facts(country_id, category);

CREATE INDEX IF NOT EXISTS idx_darb_facts_publication_status
ON darb_knowledge_facts(publication_status);

CREATE INDEX IF NOT EXISTS idx_darb_facts_freshness
ON darb_knowledge_facts(freshness_status);
