-- ============================================================================
-- DARB GKE V1.1 Supplemental Knowledge Clean Update (21 سبتمبر 2026)
-- Source: معلومات.txt (New Independent Supplemental Source)
-- Baseline 22 Arab Countries guide preserved as primary source.
-- Governance Invariants:
--   Auto Publish = OFF
--   Human-in-the-Loop = REQUIRED
--   Reference Data = NON-LIVE
-- ============================================================================

-- 1. Ensure Batch is recorded in darb_knowledge_seed_batches
INSERT INTO darb_knowledge_seed_batches (
  batch_name,
  source_name,
  source_version,
  imported_at,
  status,
  auto_publish,
  reviewer_id,
  review_reason
)
SELECT
  'DARB GKE V1.1 Supplemental Knowledge Clean Update (21 سبتمبر 2026)',
  'معلومات.txt',
  '1.1-supp',
  '2026-09-21T00:00:00Z',
  'pending_review',
  FALSE,
  'فريق الإشراف المركزي',
  'إضافة ملف معلومات.txt كمصدر تكميلي مستقل بحالة قيد التدقيق الإلزامي'
WHERE NOT EXISTS (
  SELECT 1 FROM darb_knowledge_seed_batches
  WHERE batch_name = 'DARB GKE V1.1 Supplemental Knowledge Clean Update (21 سبتمبر 2026)'
);

-- 2. Insert the 16 Supplemental Records into darb_knowledge_verification_queue (if not exists)
INSERT INTO darb_knowledge_verification_queue (
  fact_key, country_code, axis, proposed_value, source_url, source_version, verification_status, confidence, created_at
)
SELECT 'YE:GEO:AREA', 'YE', 'الجغرافيا - المساحة', 'نحو 527,968 كم²', 'معلومات.txt', '1.1-supp', 'pending', 'medium', NOW()
WHERE NOT EXISTS (SELECT 1 FROM darb_knowledge_verification_queue WHERE fact_key = 'YE:GEO:AREA');

INSERT INTO darb_knowledge_verification_queue (
  fact_key, country_code, axis, proposed_value, source_url, source_version, verification_status, confidence, created_at
)
SELECT 'YE:GEO:BORDERS', 'YE', 'الجغرافيا - الحدود', 'السعودية شمالاً؛ عُمان شرقاً؛ البحر الأحمر غرباً؛ خليج عدن وبحر العرب جنوباً', 'معلومات.txt', '1.1-supp', 'pending', 'medium', NOW()
WHERE NOT EXISTS (SELECT 1 FROM darb_knowledge_verification_queue WHERE fact_key = 'YE:GEO:BORDERS');

INSERT INTO darb_knowledge_verification_queue (
  fact_key, country_code, axis, proposed_value, source_url, source_version, verification_status, confidence, created_at
)
SELECT 'YE:GEO:CITIES', 'YE', 'الجغرافيا - أهم المدن', 'صنعاء، عدن، تعز، الحديدة، المكلا، إب، مأرب، سيئون', 'معلومات.txt', '1.1-supp', 'pending', 'medium', NOW()
WHERE NOT EXISTS (SELECT 1 FROM darb_knowledge_verification_queue WHERE fact_key = 'YE:GEO:CITIES');

INSERT INTO darb_knowledge_verification_queue (
  fact_key, country_code, axis, proposed_value, source_url, source_version, verification_status, confidence, created_at
)
SELECT 'YE:GEO:TERRAIN', 'YE', 'الجغرافيا - التضاريس', 'جبال مرتفعة؛ هضاب؛ سهول ساحلية؛ صحراء؛ جزر، وأشهرها سقطرى', 'معلومات.txt', '1.1-supp', 'pending', 'medium', NOW()
WHERE NOT EXISTS (SELECT 1 FROM darb_knowledge_verification_queue WHERE fact_key = 'YE:GEO:TERRAIN');

INSERT INTO darb_knowledge_verification_queue (
  fact_key, country_code, axis, proposed_value, source_url, source_version, verification_status, confidence, created_at
)
SELECT 'YE:TOURISM:SANAA_SEASON', 'YE', 'السياحة - موسم صنعاء والمناطق الجبلية', 'مارس–مايو وسبتمبر–نوفمبر', 'معلومات.txt', '1.1-supp', 'pending', 'limited', NOW()
WHERE NOT EXISTS (SELECT 1 FROM darb_knowledge_verification_queue WHERE fact_key = 'YE:TOURISM:SANAA_SEASON');

INSERT INTO darb_knowledge_verification_queue (
  fact_key, country_code, axis, proposed_value, source_url, source_version, verification_status, confidence, created_at
)
SELECT 'YE:TOURISM:SOCOTRA_SEASON', 'YE', 'السياحة - موسم سقطرى', 'أكتوبر–أبريل تقريباً', 'معلومات.txt', '1.1-supp', 'pending', 'limited', NOW()
WHERE NOT EXISTS (SELECT 1 FROM darb_knowledge_verification_queue WHERE fact_key = 'YE:TOURISM:SOCOTRA_SEASON');

INSERT INTO darb_knowledge_verification_queue (
  fact_key, country_code, axis, proposed_value, source_url, source_version, verification_status, confidence, created_at
)
SELECT 'YE:SAFETY:TRAVEL_ALERT', 'YE', 'السلامة والتنبيهات - تنبيه السفر', 'الوضع الأمني الحالي عامل حاسم، ولا ينبغي اعتبار المواسم المناخية توصية سفر فعلية', 'معلومات.txt', '1.1-supp', 'pending', 'high', NOW()
WHERE NOT EXISTS (SELECT 1 FROM darb_knowledge_verification_queue WHERE fact_key = 'YE:SAFETY:TRAVEL_ALERT');

INSERT INTO darb_knowledge_verification_queue (
  fact_key, country_code, axis, proposed_value, source_url, source_version, verification_status, confidence, created_at
)
SELECT 'YE:ECONOMY:CONTRACTION_2025', 'YE', 'الاقتصاد - انكماش 2025', 'نحو 1.5% وفق النص الذي ينسب التقدير إلى صندوق النقد', 'معلومات.txt', '1.1-supp', 'pending', 'limited', NOW()
WHERE NOT EXISTS (SELECT 1 FROM darb_knowledge_verification_queue WHERE fact_key = 'YE:ECONOMY:CONTRACTION_2025');

INSERT INTO darb_knowledge_verification_queue (
  fact_key, country_code, axis, proposed_value, source_url, source_version, verification_status, confidence, created_at
)
SELECT 'ARAB:GEO:REGIONAL_CLASSIFICATION', 'ARAB', 'الجغرافيا الإقليمية - تصنيف إقليمي', 'شمال أفريقيا؛ وادي النيل والقرن الأفريقي؛ بلاد الشام؛ العراق والخليج؛ جنوب الجزيرة العربية', 'معلومات.txt', '1.1-supp', 'pending', 'medium', NOW()
WHERE NOT EXISTS (SELECT 1 FROM darb_knowledge_verification_queue WHERE fact_key = 'ARAB:GEO:REGIONAL_CLASSIFICATION');

INSERT INTO darb_knowledge_verification_queue (
  fact_key, country_code, axis, proposed_value, source_url, source_version, verification_status, confidence, created_at
)
SELECT 'ARAB:GEO:LARGEST_AREAS', 'ARAB', 'الجغرافيا - أكبر الدول مساحة تقريباً', 'الجزائر → السعودية → السودان → ليبيا → موريتانيا → مصر → الصومال → اليمن → المغرب → العراق', 'معلومات.txt', '1.1-supp', 'pending', 'medium', NOW()
WHERE NOT EXISTS (SELECT 1 FROM darb_knowledge_verification_queue WHERE fact_key = 'ARAB:GEO:LARGEST_AREAS');

INSERT INTO darb_knowledge_verification_queue (
  fact_key, country_code, axis, proposed_value, source_url, source_version, verification_status, confidence, created_at
)
SELECT 'ARAB:GEO:SMALLEST_AREAS', 'ARAB', 'الجغرافيا - أصغر الدول مساحة تقريباً', 'البحرين → جزر القمر → قطر → لبنان → الكويت → جيبوتي → الإمارات', 'معلومات.txt', '1.1-supp', 'pending', 'medium', NOW()
WHERE NOT EXISTS (SELECT 1 FROM darb_knowledge_verification_queue WHERE fact_key = 'ARAB:GEO:SMALLEST_AREAS');

INSERT INTO darb_knowledge_verification_queue (
  fact_key, country_code, axis, proposed_value, source_url, source_version, verification_status, confidence, created_at
)
SELECT 'ARAB:ECONOMY:NOMINAL_GDP_2025', 'ARAB', 'الاقتصاد - الناتج المحلي الاسمي 2025', 'نحو 3.8 تريليون دولار وفق النص المنسوب للبنك الدولي', 'معلومات.txt', '1.1-supp', 'pending', 'limited', NOW()
WHERE NOT EXISTS (SELECT 1 FROM darb_knowledge_verification_queue WHERE fact_key = 'ARAB:ECONOMY:NOMINAL_GDP_2025');

INSERT INTO darb_knowledge_verification_queue (
  fact_key, country_code, axis, proposed_value, source_url, source_version, verification_status, confidence, created_at
)
SELECT 'ARAB:ECONOMY:GDP_GROWTH_2025', 'ARAB', 'الاقتصاد - نمو الناتج المحلي 2025', 'نحو 3.7% وفق النص المنسوب للبنك الدولي', 'معلومات.txt', '1.1-supp', 'pending', 'limited', NOW()
WHERE NOT EXISTS (SELECT 1 FROM darb_knowledge_verification_queue WHERE fact_key = 'ARAB:ECONOMY:GDP_GROWTH_2025');

INSERT INTO darb_knowledge_verification_queue (
  fact_key, country_code, axis, proposed_value, source_url, source_version, verification_status, confidence, created_at
)
SELECT 'ARAB:ECONOMY:OIL_GAS_ECONOMIES', 'ARAB', 'الاقتصاد - اقتصادات نفط وغاز', 'السعودية، الإمارات، قطر، الكويت، الجزائر، العراق، ليبيا، عُمان، البحرين', 'معلومات.txt', '1.1-supp', 'pending', 'medium', NOW()
WHERE NOT EXISTS (SELECT 1 FROM darb_knowledge_verification_queue WHERE fact_key = 'ARAB:ECONOMY:OIL_GAS_ECONOMIES');

INSERT INTO darb_knowledge_verification_queue (
  fact_key, country_code, axis, proposed_value, source_url, source_version, verification_status, confidence, created_at
)
SELECT 'ARAB:ECONOMY:DIVERSIFIED_ECONOMIES', 'ARAB', 'الاقتصاد - اقتصادات متنوعة نسبياً', 'مصر، المغرب، الإمارات، السعودية، تونس، الأردن', 'معلومات.txt', '1.1-supp', 'pending', 'medium', NOW()
WHERE NOT EXISTS (SELECT 1 FROM darb_knowledge_verification_queue WHERE fact_key = 'ARAB:ECONOMY:DIVERSIFIED_ECONOMIES');

INSERT INTO darb_knowledge_verification_queue (
  fact_key, country_code, axis, proposed_value, source_url, source_version, verification_status, confidence, created_at
)
SELECT 'ARAB:ECONOMY:AGRI_AID_ECONOMIES', 'ARAB', 'الاقتصاد - اعتماد مرتفع نسبياً على الزراعة والخدمات', 'موريتانيا، السودان، الصومال، جزر القمر، جيبوتي، اليمن وغيرها', 'معلومات.txt', '1.1-supp', 'pending', 'limited', NOW()
WHERE NOT EXISTS (SELECT 1 FROM darb_knowledge_verification_queue WHERE fact_key = 'ARAB:ECONOMY:AGRI_AID_ECONOMIES');
