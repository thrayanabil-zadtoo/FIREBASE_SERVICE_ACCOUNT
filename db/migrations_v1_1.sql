-- DARB V1.1 SAFE MIGRATION
-- لا يحذف أي جدول أو بيانات من V1.0.
-- جميع الأوامر إضافية/Idempotent ويمكن تنفيذها أكثر من مرة.

-- 1) إضافة بقية الدول العربية الـ22، مع إبقاء مصر كالدولة الأولى في الواجهة.
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

-- 2) فلسطين: لا نحذف الهيكل السابق؛ نضيف المنطقة/المدن الناقصة فقط.
WITH p AS (SELECT id FROM countries WHERE code='PS'),
r AS (
  SELECT id FROM regions WHERE country_id=(SELECT id FROM p) AND name_ar='الضفة الغربية'
)
INSERT INTO cities(country_id,region_id,name_ar,name_en,description_ar)
SELECT p.id,NULL,'مدينة غزة','Gaza City','مدينة مستقلة في دَرْب للوظائف والخدمات والإعلانات ومعلومات المدينة.'
FROM p
WHERE NOT EXISTS (SELECT 1 FROM cities c WHERE c.country_id=p.id AND c.name_ar='مدينة غزة');

WITH p AS (SELECT id FROM countries WHERE code='PS'),
r AS (SELECT id FROM regions WHERE country_id=(SELECT id FROM p) AND name_ar='الضفة الغربية')
INSERT INTO cities(country_id,region_id,name_ar,name_en,description_ar)
SELECT p.id,r.id,v.name_ar,v.name_en,'مدينة ضمن الضفة الغربية، مع خصائص مستقلة للوظائف والخدمات والإعلانات.'
FROM p CROSS JOIN r
CROSS JOIN (VALUES
 ('رام الله','Ramallah'),('البيرة','Al-Bireh'),('نابلس','Nablus'),('الخليل','Hebron'),
 ('بيت لحم','Bethlehem'),('جنين','Jenin'),('طولكرم','Tulkarm'),('قلقيلية','Qalqilya'),
 ('أريحا','Jericho'),('طوباس','Tubas'),('سلفيت','Salfit')
) AS v(name_ar,name_en)
WHERE NOT EXISTS (
 SELECT 1 FROM cities c WHERE c.country_id=p.id AND c.name_ar=v.name_ar
);

-- 3) إعداد تفضيل الدولة الابتدائية، دون التأثير على الإعدادات الأخرى.
INSERT INTO site_settings(key,value)
VALUES ('default_country', '{"code":"EG","name_ar":"مصر"}'::jsonb)
ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value;

-- 4) فهارس آمنة للأداء.
CREATE INDEX IF NOT EXISTS idx_countries_active_code ON countries(active,code);
CREATE INDEX IF NOT EXISTS idx_cities_country_region ON cities(country_id,region_id,active);
