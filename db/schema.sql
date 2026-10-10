CREATE TABLE IF NOT EXISTS countries(id BIGSERIAL PRIMARY KEY,code VARCHAR(10) UNIQUE NOT NULL,name_ar VARCHAR(120) NOT NULL,name_en VARCHAR(120),description_ar TEXT,active BOOLEAN DEFAULT TRUE,created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS regions(id BIGSERIAL PRIMARY KEY,country_id BIGINT REFERENCES countries(id) ON DELETE CASCADE,name_ar VARCHAR(120) NOT NULL,name_en VARCHAR(120),description_ar TEXT,active BOOLEAN DEFAULT TRUE);
CREATE TABLE IF NOT EXISTS cities(id BIGSERIAL PRIMARY KEY,country_id BIGINT REFERENCES countries(id) ON DELETE CASCADE,region_id BIGINT REFERENCES regions(id) ON DELETE SET NULL,name_ar VARCHAR(120) NOT NULL,name_en VARCHAR(120),description_ar TEXT,cost_index NUMERIC,internet_score NUMERIC,safety_score NUMERIC,weather_score NUMERIC,active BOOLEAN DEFAULT TRUE);
CREATE TABLE IF NOT EXISTS users(id UUID PRIMARY KEY,email VARCHAR(320) UNIQUE NOT NULL,name VARCHAR(200),avatar_url TEXT,role VARCHAR(40) DEFAULT 'user',country_id BIGINT REFERENCES countries(id),city_id BIGINT REFERENCES cities(id),google_sub VARCHAR(255) UNIQUE,is_verified BOOLEAN DEFAULT FALSE,active BOOLEAN DEFAULT TRUE,created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS companies(id BIGSERIAL PRIMARY KEY,user_id UUID REFERENCES users(id) ON DELETE CASCADE,name_ar VARCHAR(200) NOT NULL,name_en VARCHAR(200),description_ar TEXT,logo_url TEXT,country_id BIGINT REFERENCES countries(id),city_id BIGINT REFERENCES cities(id),verified BOOLEAN DEFAULT FALSE,created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS services(id BIGSERIAL PRIMARY KEY,user_id UUID REFERENCES users(id) ON DELETE SET NULL,company_id BIGINT REFERENCES companies(id) ON DELETE SET NULL,name_ar VARCHAR(200) NOT NULL,description_ar TEXT,category VARCHAR(80),country_id BIGINT REFERENCES countries(id),city_id BIGINT REFERENCES cities(id),featured_until TIMESTAMPTZ,active BOOLEAN DEFAULT TRUE,created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS jobs(id BIGSERIAL PRIMARY KEY,company_id BIGINT REFERENCES companies(id) ON DELETE CASCADE,title VARCHAR(200) NOT NULL,description TEXT,salary_min NUMERIC,salary_max NUMERIC,currency VARCHAR(10),country_id BIGINT REFERENCES countries(id),city_id BIGINT REFERENCES cities(id),featured_until TIMESTAMPTZ,active BOOLEAN DEFAULT TRUE,created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS ads(id BIGSERIAL PRIMARY KEY,user_id UUID REFERENCES users(id) ON DELETE SET NULL,company_id BIGINT REFERENCES companies(id) ON DELETE SET NULL,title VARCHAR(200) NOT NULL,description TEXT,category VARCHAR(80),country_id BIGINT REFERENCES countries(id),city_id BIGINT REFERENCES cities(id),plan VARCHAR(30) DEFAULT 'free',status VARCHAR(30) DEFAULT 'pending',starts_at TIMESTAMPTZ,ends_at TIMESTAMPTZ,views BIGINT DEFAULT 0,clicks BIGINT DEFAULT 0,created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS plans(id BIGSERIAL PRIMARY KEY,code VARCHAR(40) UNIQUE NOT NULL,name_ar VARCHAR(100) NOT NULL,price NUMERIC DEFAULT 0,currency VARCHAR(10) DEFAULT 'EGP',duration_days INT DEFAULT 30,features JSONB DEFAULT '{}'::jsonb,active BOOLEAN DEFAULT TRUE);
CREATE TABLE IF NOT EXISTS payment_providers(id BIGSERIAL PRIMARY KEY,code VARCHAR(50) UNIQUE NOT NULL,name_ar VARCHAR(120) NOT NULL,enabled BOOLEAN DEFAULT FALSE,config JSONB DEFAULT '{}'::jsonb);
CREATE TABLE IF NOT EXISTS payments(id BIGSERIAL PRIMARY KEY,user_id UUID REFERENCES users(id) ON DELETE SET NULL,provider_id BIGINT REFERENCES payment_providers(id),amount NUMERIC NOT NULL,currency VARCHAR(10),reference VARCHAR(255),status VARCHAR(30) DEFAULT 'pending',metadata JSONB DEFAULT '{}'::jsonb,created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS reviews(id BIGSERIAL PRIMARY KEY,user_id UUID REFERENCES users(id) ON DELETE SET NULL,service_id BIGINT REFERENCES services(id) ON DELETE CASCADE,rating INT CHECK(rating BETWEEN 1 AND 5),comment TEXT,created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS reports(id BIGSERIAL PRIMARY KEY,user_id UUID REFERENCES users(id) ON DELETE SET NULL,target_type VARCHAR(30),target_id BIGINT,reason TEXT,status VARCHAR(30) DEFAULT 'open',created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS site_settings(key VARCHAR(100) PRIMARY KEY,value JSONB NOT NULL);
INSERT INTO countries(code,name_ar,name_en,description_ar) VALUES
('EG','مصر','Egypt','نقطة البداية في دَرْب: المدن والوظائف والخدمات للمغتربين.'),
('SA','السعودية','Saudi Arabia','دليل المدن والوظائف والخدمات للمغتربين.'),
('AE','الإمارات العربية المتحدة','United Arab Emirates','دليل المدن والوظائف والخدمات للمغتربين.'),
('QA','قطر','Qatar','دليل المدن والوظائف والخدمات للمغتربين.'),
('KW','الكويت','Kuwait','دليل المدن والوظائف والخدمات للمغتربين.'),
('JO','الأردن','Jordan','دليل المدن والوظائف والخدمات للمغتربين.'),
('PS','فلسطين','Palestine','فلسطين: مدينة غزة والضفة الغربية.'),
('BH','البحرين','Bahrain','دليل المدن والوظائف والخدمات للمغتربين.'),
('OM','عُمان','Oman','دليل المدن والوظائف والخدمات للمغتربين.'),
('LB','لبنان','Lebanon','دليل المدن والوظائف والخدمات للمغتربين.'),
('IQ','العراق','Iraq','دليل المدن والوظائف والخدمات للمغتربين.'),
('SY','سوريا','Syria','دليل المدن والوظائف والخدمات للمغتربين.'),
('YE','اليمن','Yemen','دليل المدن والوظائف والخدمات للمغتربين.'),
('MA','المغرب','Morocco','دليل المدن والوظائف والخدمات للمغتربين.'),
('DZ','الجزائر','Algeria','دليل المدن والوظائف والخدمات للمغتربين.'),
('TN','تونس','Tunisia','دليل المدن والوظائف والخدمات للمغتربين.'),
('LY','ليبيا','Libya','دليل المدن والوظائف والخدمات للمغتربين.'),
('SD','السودان','Sudan','دليل المدن والوظائف والخدمات للمغتربين.'),
('SO','الصومال','Somalia','دليل المدن والوظائف والخدمات للمغتربين.'),
('DJ','جيبوتي','Djibouti','دليل المدن والوظائف والخدمات للمغتربين.'),
('MR','موريتانيا','Mauritania','دليل المدن والوظائف والخدمات للمغتربين.'),
('KM','جزر القمر','Comoros','دليل المدن والوظائف والخدمات للمغتربين.')
ON CONFLICT(code) DO NOTHING;

WITH p AS (SELECT id FROM countries WHERE code='PS') INSERT INTO regions(country_id,name_ar,name_en) SELECT id,'الضفة الغربية','West Bank' FROM p WHERE NOT EXISTS(SELECT 1 FROM regions r WHERE r.country_id=p.id AND r.name_ar='الضفة الغربية');
WITH p AS (SELECT id FROM countries WHERE code='PS') INSERT INTO cities(country_id,name_ar,name_en,description_ar) SELECT id,'مدينة غزة','Gaza City','صفحة مدينة مستقلة للخدمات والوظائف والإعلانات ومعلومات المدينة.' FROM p WHERE NOT EXISTS(SELECT 1 FROM cities c WHERE c.country_id=p.id AND c.name_ar='مدينة غزة');
INSERT INTO plans(code,name_ar,price,currency,duration_days,features) VALUES('free','مجاني',0,'EGP',30,'{"basic_listing":true}'),('featured','مميز',0,'EGP',30,'{"featured":true,"search_priority":true,"city_page":true}'),('pro','احترافي',0,'EGP',30,'{"featured":true,"homepage":true,"analytics":true,"search_priority":true}') ON CONFLICT(code) DO NOTHING;
INSERT INTO payment_providers(code,name_ar,enabled) VALUES('provider_1','بوابة دفع 1',false),('provider_2','بوابة دفع 2',false),('bank_transfer','تحويل بنكي',false),('mediator','وسيط دفع',false) ON CONFLICT(code) DO NOTHING;

ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Additional production indexes
CREATE INDEX IF NOT EXISTS idx_users_google_sub ON users(google_sub);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_services_category_city ON services(category,city_id);
CREATE INDEX IF NOT EXISTS idx_jobs_active_featured ON jobs(active,featured_until);
CREATE INDEX IF NOT EXISTS idx_ads_status_featured ON ads(status,plan,ends_at);
