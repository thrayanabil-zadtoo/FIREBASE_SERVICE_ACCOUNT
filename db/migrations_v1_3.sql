-- DARB V1.3 safe additive migration. No DROP/TRUNCATE.
CREATE TABLE IF NOT EXISTS community_questions(
 id BIGSERIAL PRIMARY KEY,
 user_id UUID REFERENCES users(id) ON DELETE SET NULL,
 country_id BIGINT REFERENCES countries(id) ON DELETE SET NULL,
 city_id BIGINT REFERENCES cities(id) ON DELETE SET NULL,
 title VARCHAR(220) NOT NULL,
 body TEXT NOT NULL,
 status VARCHAR(30) DEFAULT 'pending',
 views BIGINT DEFAULT 0,
 created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS question_answers(
 id BIGSERIAL PRIMARY KEY,
 question_id BIGINT REFERENCES community_questions(id) ON DELETE CASCADE,
 user_id UUID REFERENCES users(id) ON DELETE SET NULL,
 body TEXT NOT NULL,
 status VARCHAR(30) DEFAULT 'published',
 created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS service_reviews(
 id BIGSERIAL PRIMARY KEY,
 user_id UUID REFERENCES users(id) ON DELETE SET NULL,
 service_id BIGINT REFERENCES services(id) ON DELETE CASCADE,
 rating INT CHECK(rating BETWEEN 1 AND 5),
 comment TEXT,
 status VARCHAR(30) DEFAULT 'pending',
 created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS relocation_checklists(
 id BIGSERIAL PRIMARY KEY,
 country_id BIGINT REFERENCES countries(id) ON DELETE CASCADE,
 city_id BIGINT REFERENCES cities(id) ON DELETE CASCADE,
 title_ar VARCHAR(220) NOT NULL,
 items JSONB NOT NULL DEFAULT '[]'::jsonb,
 active BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS job_alerts(
 id BIGSERIAL PRIMARY KEY,
 user_id UUID REFERENCES users(id) ON DELETE CASCADE,
 country_id BIGINT REFERENCES countries(id) ON DELETE SET NULL,
 city_id BIGINT REFERENCES cities(id) ON DELETE SET NULL,
 keyword VARCHAR(160),
 channel VARCHAR(30) DEFAULT 'email',
 active BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS verified_profiles(
 id BIGSERIAL PRIMARY KEY,
 user_id UUID REFERENCES users(id) ON DELETE CASCADE,
 entity_type VARCHAR(40) NOT NULL,
 license_reference VARCHAR(160),
 verified_at TIMESTAMPTZ,
 status VARCHAR(30) DEFAULT 'pending',
 note TEXT
);
CREATE INDEX IF NOT EXISTS idx_questions_status_created ON community_questions(status,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_question_answers_question ON question_answers(question_id,created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_service_status ON service_reviews(service_id,status);
CREATE INDEX IF NOT EXISTS idx_job_alerts_user_active ON job_alerts(user_id,active);
INSERT INTO site_settings(key,value) VALUES
('default_country','"EG"'::jsonb),
('arab_world_scope','22'::jsonb),
('community_enabled','true'::jsonb),
('tools_enabled','true'::jsonb)
ON CONFLICT(key) DO NOTHING;
