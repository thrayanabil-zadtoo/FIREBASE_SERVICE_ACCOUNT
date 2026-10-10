BEGIN;
ALTER TABLE service_reviews ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'pending';
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(40);
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_type VARCHAR(40) DEFAULT 'user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  job_title VARCHAR(200),
  skills TEXT,
  preferred_country_id BIGINT REFERENCES countries(id),
  preferred_city_id BIGINT REFERENCES cities(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ads_user_status ON ads(user_id,status,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_country_city ON jobs(country_id,city_id,active);
CREATE INDEX IF NOT EXISTS idx_services_country_city ON services(country_id,city_id,active);
COMMIT;
