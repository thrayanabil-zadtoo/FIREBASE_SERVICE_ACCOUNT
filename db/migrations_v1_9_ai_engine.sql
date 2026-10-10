-- DARB V1.9 additive migration; no DROP/TRUNCATE.
CREATE TABLE IF NOT EXISTS ai_knowledge (id BIGSERIAL PRIMARY KEY,slug VARCHAR(120) UNIQUE NOT NULL,title VARCHAR(240) NOT NULL,content TEXT NOT NULL,country_code VARCHAR(10),city_name VARCHAR(160),status VARCHAR(20) NOT NULL DEFAULT 'published',updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS ai_usage_logs (id BIGSERIAL PRIMARY KEY,user_id BIGINT NULL,conversation_id BIGINT NULL,source VARCHAR(20) NOT NULL DEFAULT 'darb',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_country_city ON ai_knowledge(country_code,city_name,status);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created ON ai_usage_logs(created_at DESC);
