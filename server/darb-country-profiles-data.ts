import { CountryProfile } from '../src/types/country-profile';

export const COMPREHENSIVE_ARAB_COUNTRIES_PROFILES: Record<string, CountryProfile> = {
  EG: {
    country_code: 'EG',
    name_ar: 'جمهورية مصر العربية',
    name_en: 'Egypt',
    capital: 'القاهرة',
    flag: '🇪🇬',
    currency: 'الجنيه المصري',
    currency_symbol: 'EGP',
    language: 'اللغة العربية (رسمية)',
    population: '106 مليون نسمة (تقدير 2024 - الجهاز المركزي للتعبئة العامة والإحصاء)',
    area_sq_km: '1,002,450 كم²',
    location: 'شمال شرق قارة أفريقيا مع شبه جزيرة سيناء في قارة آسيا، تربط بين البحرين المتوسط والأحمر.',
    borders: ['ليبيا غرباً', 'السودان جنوباً', 'فلسطين شمال شرق'],
    seas_and_oceans: ['البحر الأبيض المتوسط شمالاً', 'البحر الأحمر شرقاً', 'قناة السويس رابط ملاحي دولي'],
    islands_and_straits: ['مضيق تيران', 'جزيرة شدوان', 'قناة السويس'],
    provinces_count: 27,
    provinces_label: 'محافظة',
    timezone: 'GMT+2 (توقيت القاهرة الرسمي)',
    calling_code: '+20',
    domain_tld: '.eg / .مصر',
    description_ar: 'قلب العالم العربي النابض، نقطة الوصل القارية بين أفريقيا وآسيا، وأحد أكبر الأسواق الحضرية والاقتصادية والصناعية.',
    terrain: 'وادي ودلتا النيل الخصيب، الصحراء الشرقية الجبلية، الصحراء الغربية ذات الواحات، وسلاسل جبال سيناء.',
    climate: 'صحراوي حار في معظم الأراضي، ومعتدل رطب على السواحل الشمالية المطلة على البحر المتوسط.',
    natural_resources: ['الغاز الطبيعي', 'البترول', 'الفوسفات', 'الذهب', 'خام الحديد', 'الحجر الجيري'],
    capital_city: 'القاهرة',
    cities: [
      { id: 13, country_code: 'EG', name_ar: 'القاهرة', name_en: 'Cairo', region_name: 'القاهرة الكبرى', description_ar: 'العاصمة النابضة، مقرات كبرى الشركات والسفارات والجامعات والخدمات الحكومية.', cost_index: 40, internet_score: 82, safety_score: 80, weather_score: 82 },
      { id: 14, country_code: 'EG', name_ar: 'الإسكندرية', name_en: 'Alexandria', region_name: 'الساحل الشمالي', description_ar: 'عروس البحر الأبيض المتوسط، مركز التجارة البحرية واللوجستيات والسياحة.', cost_index: 38, internet_score: 78, safety_score: 82, weather_score: 90 },
      { id: 15, country_code: 'EG', name_ar: 'الجيزة', name_en: 'Giza', region_name: 'القاهرة الكبرى', description_ar: 'مدينة الأعمال والتقنية ومدينة الإنتاج الإعلامي والسياحة والتراث العالمي.', cost_index: 39, internet_score: 80, safety_score: 79, weather_score: 82 }
    ],
    landmarks: [
      { name_ar: 'أهرامات الجيزة وتمثال أبو الهول', type: 'تراث عالمي / آثار', description_ar: 'إحدى عجائب الدنيا السبع القديمة وأبرز معالم التاريخ الإنساني.' },
      { name_ar: 'المتحف المصري الكبير', type: 'متاحف وثقافة', description_ar: 'أكبر متحف آثاري في العالم مخصص لحضارة واحدة قرب أهرامات الجيزة.' },
      { name_ar: 'خان الخليلي وشارع المعز', type: 'معالم تاريخية وأسواق', description_ar: 'قلب القاهرة الفاطمية وأحد أقدم الأسواق التاريخية الحية في الشرق.' }
    ],
    visiting_seasons: [
      { season: 'الخريف والشتاء والربيع', months: 'أكتوبر – أبريل', climate_description: 'طقس معتدل دافئ مناسب لزيارة المعالم والمدن التاريخية.', travel_advisory_note: 'بيانات مرجعية مناخية؛ التحقق من مواعيد الفعاليات والتأشيرات الرسمية مطلوب قبل السفر.' }
    ],
    airports: [
      { name_ar: 'مطار القاهرة الدولي', code: 'CAI', city: 'القاهرة', international: true },
      { name_ar: 'مطار برج العرب الدولي', code: 'HBE', city: 'الإسكندرية', international: true },
      { name_ar: 'مطار سفنكس الدولي', code: 'SPX', city: 'الجيزة', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء الإسكندرية البحري', city: 'الإسكندرية' },
      { name_ar: 'ميناء دمياط', city: 'دمياط' },
      { name_ar: 'ميناء العين السخنة', city: 'السويس' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'الوضع الأمني مستقر وميسر للزيارة والإقامة، مع الالتزام بتعليمات الإقامة الرسمية.',
      source: 'وزارة الداخلية المصرية - بوابة مصر الرقمية',
      verified_at: '2026-09-15'
    },
    gdp_reference: 'نحو 395 مليار دولار أمريكي (تقدير مرجعي 2024/2025)',
    growth_rate_reference: '3.8% – 4.2% (مؤشر مرجعي متغير بحسب مصادر التمويل الدولية)',
    economic_sectors: ['الصناعات التحويلية', 'الخدمات اللوجستية وقناة السويس', 'الزراعة واستصلاح الأراضي', 'السياحة', 'تكنولوجيا المعلومات'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية ونسب النمو أرقام مرجعية متغيرة ولا تعامل كأرقام فورية أو توصيات استثمارية حصرية.',
    source_document: 'الدليل المطور للدول العربية V1 - مصر + بوابة مصر الرقمية',
    verified_at: '2026-09-16T10:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'high',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 8,
    services_count: 14
  },

  SA: {
    country_code: 'SA',
    name_ar: 'المملكة العربية السعودية',
    name_en: 'Saudi Arabia',
    capital: 'الرياض',
    flag: '🇸🇦',
    currency: 'الريال السعودي',
    currency_symbol: 'SAR',
    language: 'اللغة العربية (رسمية)',
    population: '32.2 مليون نسمة (تعداد السعودية الرسمي)',
    area_sq_km: '2,149,690 كم²',
    location: 'الكتلة الكبرى لشبه الجزيرة العربية في جنوب غرب آسيا، تطل على الخليج العربي شرقاً والبحر الأحمر غرباً.',
    borders: ['الأردن والعراق والكويت شمالاً', 'قطر والإمارات شرقاً', 'عُمان واليمن جنوباً'],
    seas_and_oceans: ['البحر الأحمر غرباً', 'الخليج العربي شرقاً'],
    islands_and_straits: ['جزر فرسان', 'جزيرة تاروت'],
    provinces_count: 13,
    provinces_label: 'منطقة إدارية',
    timezone: 'GMT+3 (توقيت مكة المكرمة)',
    calling_code: '+966',
    domain_tld: '.sa / .السعودية',
    description_ar: 'أكبر اقتصاد في الشرق الأوسط، حاضنة الحرمين الشريفين، ومركز التحول التقني والاستثماري العملاق عبر رؤية 2030.',
    terrain: 'هضبة نجد الوسطى، صحاري الربع الخالي والنفود، وسلاسل جبال السروات وعسير الغربية.',
    climate: 'صحراوي حار صيفاً معتدل شتاءً، ومعتدل ماطر نسبياً على مرتفعات عسير والباحة.',
    natural_resources: ['البترول والنفط الخام', 'الغاز الطبيعي', 'الذهب', 'الفوسفات', 'البوكسيت'],
    capital_city: 'الرياض',
    cities: [
      { id: 16, country_code: 'SA', name_ar: 'الرياض', name_en: 'Riyadh', region_name: 'منطقة الرياض', description_ar: 'مركز الأعمال والتقنية والتوسع الاستثماري الأكبر والمقرات الإقليمية.', cost_index: 75, internet_score: 95, safety_score: 95, weather_score: 70 },
      { id: 17, country_code: 'SA', name_ar: 'جدة', name_en: 'Jeddah', region_name: 'منطقة مكة', description_ar: 'بوابة الحرمين الشريفين، والمركز التجاري والبحري واللوجستي الأول على البحر الأحمر.', cost_index: 70, internet_score: 92, safety_score: 94, weather_score: 75 }
    ],
    landmarks: [
      { name_ar: 'المسجد الحرام والمسجد النبوي', type: 'معالم دينية إسلامية', description_ar: 'أقدس بقاع المسلمين ومهوى قلوب الملايين في مكة المكرمة والمدينة المنورة.' },
      { name_ar: 'حي الطريف بالدرعية التاريخية', type: 'تراث عالمي (UNESCO)', description_ar: 'مهد الدولة السعودية الأولى ونموذج معماري نجدي فريد.' },
      { name_ar: 'العلا ومدائن صالح (الحجر)', type: 'آثار وتراث عالمي', description_ar: 'واحة تاريخية ومعالم نبطية منحوتة في صخور الجبال.' }
    ],
    visiting_seasons: [
      { season: 'موسم الشتاء والربيع', months: 'نوفمبر – مارس', climate_description: 'أجواء معتدلة ممتازة للسياحة والفعاليات وموسم الرياض.', travel_advisory_note: 'مرجع مناخي استرشادي؛ يتطلب الدخول استخراج التأشيرة الرسمية (سياحة، عمرة، أو عمل) عبر منصات التأشيرات المعتمدة.' }
    ],
    airports: [
      { name_ar: 'مطار الملك خالد الدولي', code: 'RUH', city: 'الرياض', international: true },
      { name_ar: 'مطار الملك عبدالعزيز الدولي', code: 'JED', city: 'جدة', international: true },
      { name_ar: 'مطار الملك فهد الدولي', code: 'DMM', city: 'الدمام', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء جدة الإسلامي', city: 'جدة' },
      { name_ar: 'ميناء الملك عبد العزيز', city: 'الدمام' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'أعلى مستويات الأمان والاستقرار الأمني المتقدم.',
      source: 'منصة أبشر - وزارة الداخلية السعودية',
      verified_at: '2026-09-18'
    },
    gdp_reference: 'يتجاوز 1.1 تريليون دولار أمريكي (تقدير مرجعي 2024)',
    growth_rate_reference: '4.4% في الأنشطة غير النفطية (مؤشر مرجعي)',
    economic_sectors: ['الطاقة والبتروكيماويات', 'الخدمات المالية والاستثمار', 'التعدين', 'السياحة والترفيه', 'التقنية والذكاء الاصطناعي'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'معدلات النمو غير النفطي مؤشر مرجعي من تقارير البنك المركزي ووزارة الاقتصاد والتخطيط.',
    source_document: 'الدليل المطور للدول العربية V1 - السعودية + منصة قوى وأبشر',
    verified_at: '2026-09-17T09:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'high',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 12,
    services_count: 18
  },

  AE: {
    country_code: 'AE',
    name_ar: 'الإمارات العربية المتحدة',
    name_en: 'United Arab Emirates',
    capital: 'أبوظبي',
    flag: '🇦🇪',
    currency: 'الدرهم الإماراتي',
    currency_symbol: 'AED',
    language: 'اللغة العربية (رسمية)، الإنجليزية شائعة في الأعمال',
    population: '9.9 مليون نسمة (تقدير المركز الاتحادي للتنافسية والإحصاء)',
    area_sq_km: '83,600 كم²',
    location: 'شرق شبه الجزيرة العربية على الساحل الجنوبي للخليج العربي وخليج عُمان.',
    borders: ['السعودية غرباً وجنوباً', 'سلطنة عُمان شرقاً وشمال شرق'],
    seas_and_oceans: ['الخليج العربي', 'بحر عُمان'],
    islands_and_straits: ['جزيرة ياس', 'جزيرة السعديات', 'جزر النخلة'],
    provinces_count: 7,
    provinces_label: 'إمارة',
    timezone: 'GMT+4',
    calling_code: '+971',
    domain_tld: '.ae / .امارات',
    description_ar: 'المركز العالمي الرائد للتجارة والمال والابتكار والذكاء الاصطناعي وجودة الحياة الحضرية في الشرق الأوسط.',
    terrain: 'سهول ساحلية رملية، كثبان صحراوية، وسلاسل جبال الحجر في الشمال والشرق.',
    climate: 'صحراوي دافئ شتاءً وحار رطب صيفاً على السواحل.',
    natural_resources: ['النفط والغاز الطبيعي', 'الطاقة المتجددة والشمسية'],
    capital_city: 'أبوظبي',
    cities: [
      { id: 18, country_code: 'AE', name_ar: 'دبي', name_en: 'Dubai', region_name: 'إمارة دبي', description_ar: 'المركز العالمي للتجارة والتكنولوجيا وريادة الأعمال للمغتربين واستقطاب الكفاءات.', cost_index: 85, internet_score: 98, safety_score: 98, weather_score: 72 },
      { id: 19, country_code: 'AE', name_ar: 'أبوظبي', name_en: 'Abu Dhabi', region_name: 'إمارة أبوظبي', description_ar: 'عاصمة دولة الإمارات، قطاعات الطاقة وصناديق الاستثمار السيادية والأبحاث المتقدمة.', cost_index: 80, internet_score: 96, safety_score: 98, weather_score: 73 }
    ],
    landmarks: [
      { name_ar: 'برج خليفة', type: 'معمار عالمي', description_ar: 'أطول برج شيّده الإنسان في التاريخ وأيقونة دبي العمرانية.' },
      { name_ar: 'جامع الشيخ زايد الكبير', type: 'عمارة إسلامية', description_ar: 'صرح معماري إسلامي استثنائي يجمع فنون العمارة الإسلامية في أبوظبي.' },
      { name_ar: 'متحف المستقبل', type: 'ابتكار وتقنية', description_ar: 'أحد أجمل مباني العالم ومنصة لاستشراف مستقبل التقنية والإنسانية.' }
    ],
    visiting_seasons: [
      { season: 'موسم الشتاء المعتدل', months: 'نوفمبر – إبريل', climate_description: 'أجواء ربيعية شتوية دافئة مثالية للسياحة والمؤتمرات.', travel_advisory_note: 'معلومة مناخية استرشادية؛ السفر يستوجب استخراج إذن الدخول أو التأشيرة عبر القنوات المعتمدة.' }
    ],
    airports: [
      { name_ar: 'مطار دبي الدولي', code: 'DXB', city: 'دبي', international: true },
      { name_ar: 'مطار زايد الدولي', code: 'AUH', city: 'أبوظبي', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء جبل علي', city: 'دبي' },
      { name_ar: 'ميناء خليفة', city: 'أبوظبي' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'أحد أكثر بلدان العالم أماناً واستقراراً وسيادة للقانون.',
      source: 'البوابة الرسمية لحكومة الإمارات (u.ae)',
      verified_at: '2026-09-17'
    },
    gdp_reference: 'نحو 500 مليار دولار أمريكي (تقدير مرجعي 2024)',
    growth_rate_reference: '3.9% – 4.2% (مؤشر مرجعي)',
    economic_sectors: ['التجارة واللوجستيات العالمية', 'الخدمات المالية والمصرفية', 'السياحة والضيافة', 'العقارات والإنشاءات', 'التقنية المتقدمة'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية مرجعية وفق تقارير مصرف الإمارات المركزي والجهات الإحصائية.',
    source_document: 'الدليل المطور للدول العربية V1 - الإمارات + u.ae',
    verified_at: '2026-09-17T11:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'high',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 10,
    services_count: 15
  },

  PS: {
    country_code: 'PS',
    name_ar: 'دولة فلسطين',
    name_en: 'Palestine',
    capital: 'القدس الشريف',
    flag: '🇵🇸',
    currency: 'الدينار الأردني / الدولار',
    currency_symbol: 'JOD / USD',
    language: 'اللغة العربية (رسمية)',
    population: '5.5 مليون نسمة داخل فلسطين (الجهاز المركزي للإحصاء الفلسطيني)',
    area_sq_km: '27,000 كم² (فلسطين التاريخية)',
    location: 'في قلب بلاد الشام على الساحل الشرقي للبحر الأبيض المتوسط رابطة بين آسيا وأفريقيا.',
    borders: ['الأردن شرقاً', 'مصر جنوب غرب', 'لبنان وسوريا شمالاً'],
    seas_and_oceans: ['البحر الأبيض المتوسط غرباً', 'البحر الميت شرقاً'],
    islands_and_straits: [],
    provinces_count: 16,
    provinces_label: 'محافظة',
    timezone: 'GMT+2 (توقيت القدس)',
    calling_code: '+970',
    domain_tld: '.ps / .فلسطين',
    description_ar: 'أرض الرسالات ومهد الحضارات وعاصمة القلوب، تضم مدينة غزة ومدن الضفة الغربية مع دعم ريادة الأعمال وصمود الكفاءات.',
    terrain: 'سلاسل جبال القدس ونابلس والخليل، السهل الساحلي المتوسطي، وغور الأردن والبحر الميت.',
    climate: 'متوسطي معتدل، ماطر شتاءً وحار جاف صيفاً، وشبه صحراوي في الأغوار.',
    natural_resources: ['الأراضي الزراعية وأشجار الزيتون', 'الحجر الجيري الفلسطيني', 'أملاح ومعادن البحر الميت'],
    capital_city: 'القدس الشريف',
    cities: [
      { id: 1, country_code: 'PS', name_ar: 'مدينة غزة', name_en: 'Gaza City', region_name: 'قطاع غزة', description_ar: 'مدينة مستقلة في دَرْب للوظائف والخدمات ودعم مبادرات العمل الحر والمجتمع.', cost_index: 30, internet_score: 55, safety_score: 40, weather_score: 85 },
      { id: 2, country_code: 'PS', name_ar: 'رام الله', name_en: 'Ramallah', region_name: 'الضفة الغربية', description_ar: 'المركز الاقتصادي والتجاري، كبرى الشركات والمؤسسات والوظائف التقنية.', cost_index: 65, internet_score: 82, safety_score: 75, weather_score: 88 },
      { id: 3, country_code: 'PS', name_ar: 'البيرة', name_en: 'Al-Bireh', region_name: 'الضفة الغربية', description_ar: 'مدينة حيوية ملاصقة لرام الله، مقرات المؤسسات والخدمات والتجارة.', cost_index: 60, internet_score: 80, safety_score: 75, weather_score: 88 },
      { id: 4, country_code: 'PS', name_ar: 'نابلس', name_en: 'Nablus', region_name: 'الضفة الغربية', description_ar: 'عاصمة الشمال الاقتصادية، حرفية وصناعية وتجارية وعلمية غنية بالجامعات.', cost_index: 50, internet_score: 75, safety_score: 70, weather_score: 85 },
      { id: 5, country_code: 'PS', name_ar: 'الخليل', name_en: 'Hebron', region_name: 'الضفة الغربية', description_ar: 'أكبر مركز صناعي وتجاري، الصناعات الخفيفة والجلدية والتجارة العامة.', cost_index: 48, internet_score: 70, safety_score: 70, weather_score: 86 }
    ],
    landmarks: [
      { name_ar: 'المسجد الأقصى وقبة الصخرة المشرفة', type: 'تراث ديني وإسلامي عالمي', description_ar: 'أولى القبلتين وثالث الحرمين الشريفين ومسرى الرسول صلى الله عليه وسلم في القدس.' },
      { name_ar: 'كنيسة القيامة', type: 'تراث مسيحي وتاريخي', description_ar: 'أقدس المعالم المسيحية في العالم داخل أسوار البلدة القديمة بالقدس.' },
      { name_ar: 'كنيسة المهد والبلدة القديمة ببيت لحم', type: 'تراث عالمي (UNESCO)', description_ar: 'مكان ولادة السيد المسيح ومعلم تاريخي ديني بارز.' }
    ],
    visiting_seasons: [
      { season: 'الربيع والخريف', months: 'مارس – مايو / سبتمبر – نوفمبر', climate_description: 'أجواء ربيعية جميلة ومعتدلة.', travel_advisory_note: 'تنبيه أمني وإنساني: إجراءات السفر والتنقل تخضع لظروف المعابر والوضع الميداني المعقد؛ التحقق المستمر إلزامي.' }
    ],
    airports: [
      { name_ar: 'مطار القدس الدولي (قلنديا - غير مفعّل حالياً)', code: 'JRS', city: 'القدس', international: false }
    ],
    seaports: [
      { name_ar: 'ميناء غزة البحري (ميناء صيد ومرفأ تاريخي)', city: 'غزة' }
    ],
    travel_security_alert: {
      level: 'warning',
      text_ar: 'يتطلب السفر والتنقل تدقيقاً صارماً في إجراءات المعابر والأوضاع الميدانية الراهنة.',
      source: 'تقارير رسمية ووزارة الخارجية الفلسطينية',
      verified_at: '2026-09-19'
    },
    gdp_reference: 'نحو 18 مليار دولار أمريكي (تقدير مرجعي قبل الأحداث الراهنة)',
    growth_rate_reference: 'شديد التأثر بالأوضاع السياسية والميدانية والمعابر',
    economic_sectors: ['تكنولوجيا المعلومات والعمل الحر الرقمي عن بُعد', 'الزراعة وزيت الزيتون', 'الصناعات الحجرية والإنشائية', 'التجارة والخدمات'],
    measurement_year: 2023,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'الأرقام الاقتصادية متأثرة بظروف الإغلاق وتخضع لتحديثات مستمرة من جهاز الإحصاء المركزي.',
    source_document: 'الدليل المطور للدول العربية V1 - فلسطين + الجهاز المركزي للإحصاء الفلسطيني',
    verified_at: '2026-09-18T10:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'high',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 6,
    services_count: 11
  },

  YE: {
    country_code: 'YE',
    name_ar: 'الجمهورية اليمنية',
    name_en: 'Yemen',
    capital: 'صنعاء / العاصمة المؤقتة عدن',
    flag: '🇾🇪',
    currency: 'الريال اليمني',
    currency_symbol: 'YER',
    language: 'اللغة العربية (رسمية)',
    population: '33 مليون نسمة (تقدير الجهاز المركزي للإحصاء ومصادر التعداد)',
    area_sq_km: '527,970 كم²',
    location: 'جنوب غرب شبه الجزيرة العربية، يتحكم بمضيق باب المندب، ويطل على بحر العرب وخليج عدن والبحر الأحمر.',
    borders: ['المملكة العربية السعودية شمالاً', 'سلطنة عُمان شرقاً'],
    seas_and_oceans: ['البحر الأحمر غرباً', 'خليج عدن وبحر العرب جنوباً', 'مضيق باب المندب ممر ملاحي دولي استراتيجي'],
    islands_and_straits: ['أرخبيل جزيرة سقطرى (UNESCO)', 'جزيرة ميون في باب المندب', 'جزيرة كمران'],
    provinces_count: 22,
    provinces_label: 'محافظة',
    timezone: 'GMT+3',
    calling_code: '+967',
    domain_tld: '.ye / .اليمن',
    description_ar: 'أصل العروبة ومهد الحضارات القديمة (سبأ وحمير وحضرموت)، وموقع جيوسياسي بالغ الحيوية على خطوط التجارة العالمية.',
    terrain: 'مرتفعات جبلية شاهقة (جبل النبي شعيب 3666م)، هضاب شرقية، سهل تهامة الساحلي، وأرخبيل سقطرى الفريد بيئياً.',
    climate: 'معتدل في المرتفعات الجبلية صيفاً وبارد شتاءً، حار رطب في السواحل، وحار جاف في الهضاب والصحاري.',
    natural_resources: ['النفط والغاز الطبيعي', 'الثروة السمكية والبحرية الغنية', 'الأراضي الزراعية الخصبة والبن واللبان'],
    capital_city: 'صنعاء / عدن',
    cities: [
      { id: 28, country_code: 'YE', name_ar: 'صنعاء', name_en: 'Sanaa', region_name: 'أمانة العاصمة', description_ar: 'المركز التاريخي والأسواق الحرفية والتجارة التقليدية والتراث المعماري الفريد.', cost_index: 32, internet_score: 50, safety_score: 55, weather_score: 82 },
      { id: 38, country_code: 'YE', name_ar: 'عدن', name_en: 'Aden', region_name: 'محافظة عدن', description_ar: 'العاصمة المؤقتة، الميناء التاريخي الطبيعي والمركز الاقتصادي والتجاري البحري.', cost_index: 35, internet_score: 60, safety_score: 62, weather_score: 80 }
    ],
    landmarks: [
      { name_ar: 'مدينة صنعاء القديمة', type: 'تراث عالمي (UNESCO)', description_ar: 'تحفة معمارية تاريخية من الطوب والقمريات تعود لآلاف السنين.' },
      { name_ar: 'أرخبيل سقطرى', type: 'تراث طبيعي عالمي (UNESCO)', description_ar: 'موطن شجرة دم الأخوين والتنوع الحيوي النباتي والحيواني النادر عالمياً.' },
      { name_ar: 'مدينة شبام حضرموت (ناطحات السحاب الطينية)', type: 'تراث عالمي (UNESCO)', description_ar: 'أولى ناطحات السحاب الطينية في تاريخ العمارة البشرية.' },
      { name_ar: 'صهاريج عدن وقلعة صيرة', type: 'هندسة وآثار تاريخية', description_ar: 'منظومة مائية تاريخية هندسية بديعة تعود لما قبل الميلاد.' }
    ],
    visiting_seasons: [
      { season: 'مواسم مناخية معتدلة', months: 'أكتوبر – مارس (المرتفعات) / الشتاء (السواحل)', climate_description: 'أجواء معتدلة لطيفة مناخياً.', travel_advisory_note: 'قاعدة حوكمة إلزامية: المناخ وحده لا يكفي لتحديد صلاحية السفر؛ يتطلب السفر تقييماً أمنياً وتصاريح رسمية من الجهات المختصة.' }
    ],
    airports: [
      { name_ar: 'مطار عدن الدولي', code: 'ADE', city: 'عدن', international: true },
      { name_ar: 'مطار سيئون الدولي', code: 'GXF', city: 'سيئون - حضرموت', international: true },
      { name_ar: 'مطار سقطرى الدولي', code: 'SCT', city: 'سقطرى', international: false }
    ],
    seaports: [
      { name_ar: 'ميناء عدن الطبيعي الدولي', city: 'عدن' },
      { name_ar: 'ميناء الحديدة', city: 'الحديدة' },
      { name_ar: 'ميناء المكلا', city: 'المكلا - حضرموت' }
    ],
    travel_security_alert: {
      level: 'advisory',
      text_ar: 'تنبيه أمني: التحقق المسبق من المعابر والمطارات والوضع الأمني في كل محافظة إلزامي قبل السفر.',
      source: 'معلومات.txt (الأسطر 1-40) ومصادر النقل اليمنية',
      verified_at: '2026-09-20'
    },
    gdp_reference: 'نحو 21 مليار دولار أمريكي (تقدير مرجعي متقلب وفق تقارير صندوق النقد والبنك الدولي)',
    growth_rate_reference: 'يتقلب بحسب استقرار صادرات النفط والغاز وسعر الصرف',
    economic_sectors: ['الزراعة والبن والفواكه', 'الثروة السمكية', 'النفط والغاز الطبيعي', 'الخدمات البحرية والموانئ'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'أسعار الصرف متباينة بين صنعاء وعدن؛ لذا تعد الأسعار في دَرْب أرقاماً استرشادية مرجعية وليست أسعار صرف فورية.',
    source_document: 'معلومات.txt (Lines 1-45) + الدليل المطور للدول العربية V1 - اليمن',
    verified_at: '2026-09-21T12:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'high',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 5,
    services_count: 9
  },

  QA: {
    country_code: 'QA',
    name_ar: 'دولة قطر',
    name_en: 'Qatar',
    capital: 'الدوحة',
    flag: '🇶🇦',
    currency: 'الريال القطري',
    currency_symbol: 'QAR',
    language: 'اللغة العربية (رسمية)، الإنجليزية شائعة',
    population: '3.0 مليون نسمة (جهاز التخطيط والإحصاء القطري)',
    area_sq_km: '11,586 كم²',
    location: 'شبه جزيرة تقع في منتصف الساحل الغربي للخليج العربي متصلة براً بالمملكة العربية السعودية.',
    borders: ['المملكة العربية السعودية جنوباً'],
    seas_and_oceans: ['الخليج العربي من ثلاث جهات'],
    islands_and_straits: ['جزيرة اللؤلؤة', 'جزيرة حالول'],
    provinces_count: 8,
    provinces_label: 'بلدية',
    timezone: 'GMT+3',
    calling_code: '+974',
    domain_tld: '.qa / .قطر',
    description_ar: 'عاصمة الطاقة العالمية النظيفة (الغاز المسال)، ومركز الرياضة والثقافة والتعليم العالي والاستثمار السيادي.',
    terrain: 'سطح صخري رملي منبسط تكسوه الكثبان الرملية في الجنوب الشرقي (خور العديد).',
    climate: 'صحراوي حار صيفاً ومعتدل لطيف شتاءً.',
    natural_resources: ['الغاز الطبيعي المسال (أكبر احتياطيات العالم)', 'النفط الخام', 'البتروكيماويات'],
    capital_city: 'الدوحة',
    cities: [
      { id: 20, country_code: 'QA', name_ar: 'الدوحة', name_en: 'Doha', region_name: 'بلدية الدوحة', description_ar: 'عاصمة الأعمال والرياضة والمشاريع الضخمة والتعليم العالمي والابتكار.', cost_index: 78, internet_score: 97, safety_score: 98, weather_score: 74 }
    ],
    landmarks: [
      { name_ar: 'متحف الفن الإسلامي ومتحف قطر الوطني', type: 'ثقافة ومتاحف عالمية', description_ar: 'تحف معمارية عالمية وصروح ثقافية تحتضن روائع الحضارة الإسلامية وتاريخ قطر.' },
      { name_ar: 'سوق واقف التاريخي', type: 'تراث وأسواق شعبية', description_ar: 'قلب الدوحة التراثي النابض بالحرف اليدوية والمطاعم والمقاهي الأصيلة.' },
      { name_ar: 'الحي الثقافي كتارا', type: 'فنون ومسارح وثقافة', description_ar: 'ملتقى الفنون العالمية والمسارح المفتوحة والمهرجانات الثقافية.' }
    ],
    visiting_seasons: [
      { season: 'فصل الشتاء والربيع', months: 'نوفمبر – مارس', climate_description: 'أجواء دافئة لطيفة مثالية للأنشطة والفعاليات.', travel_advisory_note: 'مرجع مناخي استرشادي؛ يتطلب الدخول استخراج بطاقة هيا أو تأشيرة الدخول المعتمدة.' }
    ],
    airports: [
      { name_ar: 'مطار حمد الدولي', code: 'DOH', city: 'الدوحة', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء حمد الدولي', city: 'أم الحول / مسيعيد' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'تصنف من بين أكثر دول العالم أماناً وأدناها في مؤشرات الجريمة.',
      source: 'بوابة حكومي - وزارة الداخلية القطرية',
      verified_at: '2026-09-17'
    },
    gdp_reference: 'نحو 235 مليار دولار أمريكي (تقدير مرجعي 2024)',
    growth_rate_reference: '2.5% – 3.2% مدفوعاً بتوسعة حقل الشمال للغاز',
    economic_sectors: ['الغاز الطبيعي المسال', 'البتروكيماويات والأسمدة', 'الخدمات المالية والاستثمار', 'السياحة الرياضية والمؤتمرات'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية مرجعية وفق تقارير مصرف قطر المركزي وجهاز الإحصاء.',
    source_document: 'الدليل المطور للدول العربية V1 - قطر + بوابة حكومي',
    verified_at: '2026-09-17T12:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'high',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 7,
    services_count: 8
  },

  KW: {
    country_code: 'KW',
    name_ar: 'دولة الكويت',
    name_en: 'Kuwait',
    capital: 'مدينة الكويت',
    flag: '🇰🇼',
    currency: 'الدينار الكويتي',
    currency_symbol: 'KWD',
    language: 'اللغة العربية (رسمية)',
    population: '4.8 مليون نسمة (الإدارة المركزية للإحصاء الكويتية)',
    area_sq_km: '17,818 كم²',
    location: 'في الركن الشمالي الغربي للخليج العربي في شبه الجزيرة العربية.',
    borders: ['العراق شمالاً وغرباً', 'السعودية جنوباً'],
    seas_and_oceans: ['الخليج العربي شرقاً'],
    islands_and_straits: ['جزيرة فيلكا', 'جزيرة بوبيان', 'جزيرة وربة'],
    provinces_count: 6,
    provinces_label: 'محافظة',
    timezone: 'GMT+3',
    calling_code: '+965',
    domain_tld: '.kw / .كويت',
    description_ar: 'أعلى عملات العالم قيمة، ديمقراطية برلمانية رائدة، وصاحبة تاريخ عريق في الملاحة والتجارة والعمل الإنساني.',
    terrain: 'أراضٍ سهلية رملية منبسطة تتخللها بعض التلال والوديان الضحلة وخلجان ساحلية واسعة (جون الكويت).',
    climate: 'صحراوي قاري جاف، حار جداً صيفاً ومعتدل يميل للبرودة شتاءً.',
    natural_resources: ['النفط الخام (نحو 8% من الاحتياطي العالمي المؤكد)', 'الغاز الطبيعي المصاحب'],
    capital_city: 'مدينة الكويت',
    cities: [
      { id: 21, country_code: 'KW', name_ar: 'مدينة الكويت', name_en: 'Kuwait City', region_name: 'العاصمة', description_ar: 'المركز التجاري والمالي وسوق العمل النشط ومقرات الوزارات ومجلس الأمة.', cost_index: 70, internet_score: 93, safety_score: 94, weather_score: 72 }
    ],
    landmarks: [
      { name_ar: 'أبراج الكويت', type: 'رمز وطني ومعماري', description_ar: 'الأيقونة الأشهر للعمارة الحديثة في الكويت المطلة على الخليج العربي.' },
      { name_ar: 'مركز الشيخ جابر الأحمد الثقافي (دار الأوبرا)', type: 'فنون ومسارح', description_ar: 'صرح ثقافي معماري مستوحى من الجواهر الإسلامية.' },
      { name_ar: 'سوق المباركية التاريخي', type: 'أسواق تراثية', description_ar: 'أقدم وأشهر الأسواق التراثية الشعبية في قلب العاصمة.' }
    ],
    visiting_seasons: [
      { season: 'فصل الشتاء والربيع', months: 'نوفمبر – مارس', climate_description: 'أجواء شتوية لطيفة وموسم التخييم الصحراوي (الكشتات).', travel_advisory_note: 'معلومة استرشادية؛ السفر يتطلب سمة دخول رسمية وتصاريح سارية.' }
    ],
    airports: [
      { name_ar: 'مطار الكويت الدولي', code: 'KWI', city: 'مدينة الكويت', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء الشويخ', city: 'مدينة الكويت' },
      { name_ar: 'ميناء الأحمدي (النفطي)', city: 'الأحمدي' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'بيئة آمنة ومستقرة تماماً.',
      source: 'البوابة الإلكترونية الرسمية لدولة الكويت (e.gov.kw)',
      verified_at: '2026-09-17'
    },
    gdp_reference: 'نحو 165 مليار دولار أمريكي (تقدير مرجعي 2024)',
    growth_rate_reference: '2.8% (مؤشر مرجعي متأثر بحصص إنتاج النفط)',
    economic_sectors: ['صناعة واستخراج النفط والتكرير', 'الخدمات المالية والاستثمار السيادي', 'التجارة العامة واللوجستيات'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية أرقام مرجعية من بنك الكويت المركزي وصندوق الأجيال القادمة.',
    source_document: 'الدليل المطور للدول العربية V1 - الكويت + e.gov.kw',
    verified_at: '2026-09-17T13:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'high',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 6,
    services_count: 7
  },

  JO: {
    country_code: 'JO',
    name_ar: 'المملكة الأردنية الهاشمية',
    name_en: 'Jordan',
    capital: 'عمّان',
    flag: '🇯🇴',
    currency: 'الدينار الأردني',
    currency_symbol: 'JOD',
    language: 'اللغة العربية (رسمية)',
    population: '11.5 مليون نسمة (دائرة الإحصاءات العامة الأردنية)',
    area_sq_km: '89,342 كم²',
    location: 'في قلب الشرق الأوسط وبلاد الشام، يربط بين آسيا وأفريقيا وشبه الجزيرة العربية وله منفذ على البحر الأحمر عبر العقبة.',
    borders: ['السعودية جنوباً وشرقاً', 'العراق شرقاً', 'سوريا شمالاً', 'فلسطين غرباً'],
    seas_and_oceans: ['خليج العقبة (البحر الأحمر) جنوباً', 'البحر الميت غرباً'],
    islands_and_straits: [],
    provinces_count: 12,
    provinces_label: 'محافظة',
    timezone: 'GMT+3 (التوقيت الصيفي الدائم)',
    calling_code: '+962',
    domain_tld: '.jo / .الاردن',
    description_ar: 'واحة أمان واستقرار إقليمي، مركز متقدم للرعاية الصحية والتعليم الجامعي وريادة الأعمال وتكنولوجيا المعلومات.',
    terrain: 'هضبة صحراوية شرقية، مرتفعات جبلية غربية، وأخدود وادي الأردن والبحر الميت (أخفض نقطة على سطح الأرض -430م).',
    climate: 'متوسطي معتدل في المرتفعات، جاف صحراوي في البادية، ودافئ شتاءً في وادي الأردن والعقبة.',
    natural_resources: ['الفوسفات', 'البوتاس وأملاح البحر الميت', 'الصخر الزيتي'],
    capital_city: 'عمّان',
    cities: [
      { id: 22, country_code: 'JO', name_ar: 'عمّان', name_en: 'Amman', region_name: 'محافظة العاصمة', description_ar: 'مركز ريادة الأعمال والشركات الناشئة والتعليم العالي والصحة والخدمات.', cost_index: 55, internet_score: 85, safety_score: 88, weather_score: 86 }
    ],
    landmarks: [
      { name_ar: 'مدينة البتراء الوردية', type: 'إحدى عجائب الدنيا السبع وتراث عالمي', description_ar: 'عاصمة الأنباط التاريخية المنحوتة في الصخر الوردي قبل أكثر من ألفي عام.' },
      { name_ar: 'وادي رم (وادي القمر)', type: 'تراث طبيعي وثقافي عالمي (UNESCO)', description_ar: 'صحراء صخرية ساحرة بطبيعة شبيهة بسطح المريخ وموقع لتصوير أشهر الأفلام العالمية.' },
      { name_ar: 'البحر الميت والمغطس', type: 'سياحة علاجية ودينية', description_ar: 'أكبر منتجع طبيعي للمياه المالحة والأملاح العلاجية وموقع عماد السيد المسيح.' }
    ],
    visiting_seasons: [
      { season: 'الربيع والخريف', months: 'مارس – مايو / سبتمبر – نوفمبر', climate_description: 'أفضل أوقات استكشاف المعالم والرحلات في عمّان والبتراء.', travel_advisory_note: 'بيانات مناخية؛ السفر يخضع لإجراءات التأشيرة عبر بوابة سند أو المراكز الحدودية.' }
    ],
    airports: [
      { name_ar: 'مطار الملكة علياء الدولي', code: 'AMM', city: 'عمّان', international: true },
      { name_ar: 'مطار الملك حسين الدولي', code: 'AQJ', city: 'العقبة', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء العقبة البحري', city: 'العقبة' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'بيئة آمنة جداً ومرحبة بالزوار والمغتربين والطلاب.',
      source: 'بوابة سند الحكومية ووزارة الداخلية الأردنية',
      verified_at: '2026-09-17'
    },
    gdp_reference: 'نحو 52 مليار دولار أمريكي (تقدير مرجعي 2024)',
    growth_rate_reference: '2.6% – 2.9% (مؤشر مرجعي)',
    economic_sectors: ['تكنولوجيا المعلومات والشركات الناشئة', 'السياحة والعلاج الاستشفائي', 'صناعة الأدوية', 'التعدين (فوسفات وبوتاس)', 'الخدمات المالية والتعليمية'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية أرقام مرجعية من البنك المركزي الأردني ودائرة الإحصاءات العامة.',
    source_document: 'الدليل المطور للدول العربية V1 - الأردن + بوابة سند',
    verified_at: '2026-09-17T14:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'high',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 5,
    services_count: 10
  },

  BH: {
    country_code: 'BH',
    name_ar: 'مملكة البحرين',
    name_en: 'Bahrain',
    capital: 'المنامة',
    flag: '🇧🇭',
    currency: 'الدينار البحريني',
    currency_symbol: 'BHD',
    language: 'اللغة العربية (رسمية)',
    population: '1.5 مليون نسمة (هيئة المعلومات والحكومة الإلكترونية)',
    area_sq_km: '780 كم²',
    location: 'أرخبيل مكون من 33 جزيرة طبيعية في الخليج العربي، ترتبط بالسعودية عبر جسر الملك فهد.',
    borders: ['ترتبط بالسعودية عبر جسر الملك فهد (25 كم)'],
    seas_and_oceans: ['الخليج العربي'],
    islands_and_straits: ['جزيرة البحرين الكبرى', 'جزيرة المحرق', 'جزر حوار', 'جسر الملك فهد'],
    provinces_count: 4,
    provinces_label: 'محافظة',
    timezone: 'GMT+3',
    calling_code: '+973',
    domain_tld: '.bh / .البحرين',
    description_ar: 'المركز المصرفي والمالي الإسلامي الرائد في الخليج، ذات تاريخ عريق في تجارة اللؤلؤ وسباقات الفورمولا 1.',
    terrain: 'سهول منبسطة مع تلال منخفضة في الوسط (جبل الدخان 134م).',
    climate: 'حار رطب صيفاً ومعتدل معتدل شتاءً.',
    natural_resources: ['النفط والغاز الطبيعي', 'صناعة الألمنيوم', 'اللؤلؤ الطبيعي'],
    capital_city: 'المنامة',
    cities: [
      { id: 23, country_code: 'BH', name_ar: 'المنامة', name_en: 'Manama', region_name: 'محافظة العاصمة', description_ar: 'المركز المالي والمصرفي والخدمات اللوجستية والفندقية في البحرين.', cost_index: 68, internet_score: 94, safety_score: 95, weather_score: 75 }
    ],
    landmarks: [
      { name_ar: 'قلعة البحرين (مرفأ دلمون القديم)', type: 'تراث عالمي (UNESCO)', description_ar: 'عاصمة حضارة دلمون التاريخية وأحد أهم المواقع الأثرية في الخليج.' },
      { name_ar: 'حلبة البحرين الدولية للفورمولا 1', type: 'رياضة وفعاليات عالمية', description_ar: 'موطن سباقات الجائزة الكبرى الأولى في الشرق الأوسط.' },
      { name_ar: 'طريق اللؤلؤ في المحرق', type: 'تراث عالمي (UNESCO)', description_ar: 'مسار تاريخي يوثق مهنة صيد وتجارة اللؤلؤ التاريخية.' }
    ],
    visiting_seasons: [
      { season: 'الشتاء والربيع', months: 'نوفمبر – إبريل', climate_description: 'أجواء شاطئية معتدلة ولطيفة جداً.', travel_advisory_note: 'معلومة استرشادية؛ السفر يستلزم تأشيرة رسمية إلكترونية أو عند الوصول لمواطني الدول المؤهلة.' }
    ],
    airports: [
      { name_ar: 'مطار البحرين الدولي', code: 'BAH', city: 'المحرق', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء خليفة بن سلمان', city: 'الحد' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'بيئة آمنة ومتسامحة ذات استقرار مجتمعي وقانوني عالي.',
      source: 'بوابة البحرين الوطنية (bahrain.bh)',
      verified_at: '2026-09-17'
    },
    gdp_reference: 'نحو 45 مليار دولار أمريكي (تقدير مرجعي 2024)',
    growth_rate_reference: '3.2% – 3.5% (مؤشر مرجعي)',
    economic_sectors: ['الخدمات المصرفية والمالية الإسلامية', 'صناعة الألمنيوم (ألبا)', 'النفط والتكرير', 'السياحة والضيافة والفعاليات'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية أرقام مرجعية من مصرف البحرين المركزي ومجلس التنمية الاقتصادية.',
    source_document: 'الدليل المطور للدول العربية V1 - البحرين + bahrain.bh',
    verified_at: '2026-09-17T15:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'high',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 4,
    services_count: 6
  },

  OM: {
    country_code: 'OM',
    name_ar: 'سلطنة عُمان',
    name_en: 'Oman',
    capital: 'مسقط',
    flag: '🇴🇲',
    currency: 'الريال العُماني',
    currency_symbol: 'OMR',
    language: 'اللغة العربية (رسمية)',
    population: '5.1 مليون نسمة (المركز الوطني للإحصاء والمعلومات)',
    area_sq_km: '309,500 كم²',
    location: 'في الركن الجنوبي الشرقي لشبه الجزيرة العربية، تطل على بحر العرب وخليج عُمان ومضيق هرمز الاستراتيجي.',
    borders: ['السعودية غرباً', 'الإمارات شمال غرب', 'اليمن جنوب غرب'],
    seas_and_oceans: ['بحر العرب وخليج عُمان', 'مضيق هرمز الاستراتيجي شمالاً'],
    islands_and_straits: ['شبه جزيرة مسندم (مضيق هرمز)', 'جزيرة مصيرة', 'جزر الحلانيات'],
    provinces_count: 11,
    provinces_label: 'محافظة',
    timezone: 'GMT+4',
    calling_code: '+968',
    domain_tld: '.om / .عمان',
    description_ar: 'حارسة مضيق هرمز ورمز الدبلوماسية المتزنة، تتميز بتراث بحري مجيد وطبيعة جغرافية متنوعة بين الجبال والخلجان والواحات.',
    terrain: 'سلاسل جبال الحجر الشاهقة (جبل شمس 3000م)، سهول الباطنة الساحلية، صحراء رمال وهيبة، وظفار الخضراء صيفاً.',
    climate: 'حار جاف في الداخل ومعتدل رطب في السواحل، بينما تتمتع ظفار بمناخ استوائي معتدل ماطر صيفاً (موسم الخريف).',
    natural_resources: ['النفط والغاز الطبيعي', 'النحاس والكروم والجبس', 'الثروة السمكية', 'اللبان العُماني الأصيل'],
    capital_city: 'مسقط',
    cities: [
      { id: 24, country_code: 'OM', name_ar: 'مسقط', name_en: 'Muscat', region_name: 'محافظة مسقط', description_ar: 'المركز الإداري والاقتصادي الهادئ والمتميز في سلطنة عُمان.', cost_index: 65, internet_score: 90, safety_score: 96, weather_score: 78 }
    ],
    landmarks: [
      { name_ar: 'جامع السلطان قابوس الأكبر', type: 'عمارة إسلامية', description_ar: 'صرح معماري إسلامي فائق الروعة يتسع لآلاف المصلين في قلب مسقط.' },
      { name_ar: 'خريف صلالة وظفار', type: 'طبيعة ومهرجانات موسمية', description_ar: 'تحول الجبال والصحاري إلى مروج خضراء وشلالات ضبابية صيفاً.' },
      { name_ar: 'قلعة بهلاء وأفلاج عُمان', type: 'تراث عالمي (UNESCO)', description_ar: 'منظومة الري الهندسي العريقة (الأفلاج) وقلاع الطين التاريخية الشامخة.' }
    ],
    visiting_seasons: [
      { season: 'الشتاء (عامة عُمان) / الصيف (خريف صلالة)', months: 'أكتوبر – إبريل (مسقط والجبال) / يوليو – سبتمبر (صلالة)', climate_description: 'تنوع مناخي استثنائي يجمع بين شتاء معتدل وصيف بارد ماطر في ظفار.', travel_advisory_note: 'معلومة مرجعية؛ السفر يتطلب الحصول على تأشيرة السفر الرسمية عبر شرطة عُمان السلطانية.' }
    ],
    airports: [
      { name_ar: 'مطار مسقط الدولي', code: 'MCT', city: 'مسقط', international: true },
      { name_ar: 'مطار صلالة الدولي', code: 'SLL', city: 'صلالة', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء السلطان قابوس وميناء صحار', city: 'مسقط / صحار' },
      { name_ar: 'ميناء الدقم وميناء صلالة', city: 'الدقم / صلالة' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'واحدة من أكثر دول العالم سلماً وأماناً وأدناها في مؤشرات الإرهاب والجريمة عالمياً.',
      source: 'البوابة الرسمية للخدمات الحكومية (oman.om)',
      verified_at: '2026-09-17'
    },
    gdp_reference: 'نحو 110 مليار دولار أمريكي (تقدير مرجعي 2024)',
    growth_rate_reference: '2.5% – 2.8% (مؤشر مرجعي وفق رؤية عُمان 2040)',
    economic_sectors: ['النفط والغاز الطبيعي المسال', 'الخدمات اللوجستية وموانئ الدقم وصحار', 'السياحة البيئية والتراثية', 'الثروة السمكية والزراعة'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية أرقام مرجعية من البنك المركزي العُماني والمركز الوطني للإحصاء.',
    source_document: 'الدليل المطور للدول العربية V1 - عُمان + oman.om',
    verified_at: '2026-09-17T16:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'high',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 4,
    services_count: 6
  },

  MA: {
    country_code: 'MA',
    name_ar: 'المملكة المغربية',
    name_en: 'Morocco',
    capital: 'الرباط',
    flag: '🇲🇦',
    currency: 'الدرهم المغربي',
    currency_symbol: 'MAD',
    language: 'اللغة العربية والأمازيغية (رسميتان)',
    population: '37 مليون نسمة (المندوبية السامية للتخطيط)',
    area_sq_km: '710,850 كم²',
    location: 'في أقصى شمال غرب قارة أفريقيا، يطل على البحر المتوسط شمالاً والمحيط الأطلسي غرباً، ويفصله عن أوروبا مضيق جبل طارق (14 كم).',
    borders: ['الجزائر شرقاً', 'موريتانيا جنوباً', 'مضيق جبل طارق شمالاً'],
    seas_and_oceans: ['المحيط الأطلسي غرباً', 'البحر الأبيض المتوسط شمالاً', 'مضيق جبل طارق الاستراتيجي'],
    islands_and_straits: ['مضيق جبل طارق'],
    provinces_count: 12,
    provinces_label: 'جهة',
    timezone: 'GMT+1',
    calling_code: '+212',
    domain_tld: '.ma / .المغرب',
    description_ar: 'بوابة إفريقيا نحو أوروبا وحاضرة الأندلس، رائدة صناعة السيارات وصناعات الطيران والطاقات المتجددة والسياحة العالمية.',
    terrain: 'سلاسل جبال الأطلس (توبقال 4167م) والريف، سهول الغرب والشاوية الخصبة، والواحات والصحراء المغربية.',
    climate: 'متوسطي معتدل رطب في السواحل والمرتفعات، ومحيطي في الغرب، وشبه جاف وصحراوي في الجنوب والشرق.',
    natural_resources: ['الفوسفات (أكبر احتياطي عالمي)', 'الصيد البحري', 'الطاقة الشمسية والريحية', 'الفلاحة والزيتون'],
    capital_city: 'الرباط',
    cities: [
      { id: 29, country_code: 'MA', name_ar: 'الدار البيضاء', name_en: 'Casablanca', region_name: 'جهة الدار البيضاء سطات', description_ar: 'القطب المالي والاقتصادي والصناعي الأكبر في شمال أفريقيا ومقر بورصة الدار البيضاء.', cost_index: 48, internet_score: 82, safety_score: 80, weather_score: 89 }
    ],
    landmarks: [
      { name_ar: 'جامع الحسن الثاني بالدار البيضاء', type: 'عمارة إسلامية حديثة', description_ar: 'إحدى كبرى وأجمل منارات العمارة الإسلامية في العالم مشيّد جزئياً فوق مياه الأطلسي.' },
      { name_ar: 'ساحة جامع الفنا وأسواق مراكش', type: 'تراث شفوي وغير مادي عالمي (UNESCO)', description_ar: 'مسرح حي مفتوح للحكواتيين والموسيقى والبهجة الشعبية المغربية الأصيلة.' },
      { name_ar: 'مدينة فاس البالي وجامعة القرويين', type: 'تراث عالمي (UNESCO)', description_ar: 'أقدم جامعة مستمرة في منح الدرجات العلمية في التاريخ وأكبر مدينة عتيقة دون سيارات.' }
    ],
    visiting_seasons: [
      { season: 'الربيع والخريف وطوال العام', months: 'مارس – يونيو / سبتمبر – نوفمبر', climate_description: 'أجواء معتدلة ممتازة للسياحة الثقافية والشاطئية وزيارة المدن العتيقة.', travel_advisory_note: 'معلومة استرشادية؛ السفر يتطلب جواز سفر ساري والتأكد من إعفاءات أو تأشيرة السفر الإلكترونية.' }
    ],
    airports: [
      { name_ar: 'مطار محمد الخامس الدولي', code: 'CMN', city: 'الدار البيضاء', international: true },
      { name_ar: 'مطار مراكش المنارة الدولي', code: 'RAK', city: 'مراكش', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء طنجة المتوسط (أكبر ميناء في إفريقيا والمتوسط)', city: 'طنجة' },
      { name_ar: 'ميناء الدار البيضاء', city: 'الدار البيضاء' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'أمن مستقر واستقرار مؤسساتي مشهود وترحيب سياحي واسع.',
      source: 'بوابة الخدمات العمومية المغربية (service-public.ma)',
      verified_at: '2026-09-17'
    },
    gdp_reference: 'نحو 145 مليار دولار أمريكي (تقدير مرجعي 2024)',
    growth_rate_reference: '3.2% – 3.6% (مؤشر مرجعي)',
    economic_sectors: ['صناعة السيارات وأجزاء الطائرات', 'تعدين وتصدير الفوسفات والأسمدة', 'الفلاحة وزيت الزيتون والحمضيات', 'السياحة الدولية', 'الطاقات النظيفة (محطة نور)'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية أرقام مرجعية من بنك المغرب والمندوبية السامية للتخطيط.',
    source_document: 'الدليل المطور للدول العربية V1 - المغرب + service-public.ma',
    verified_at: '2026-09-17T17:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'high',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 5,
    services_count: 8
  },

  DZ: {
    country_code: 'DZ',
    name_ar: 'الجمهورية الجزائرية الديمقراطية الشعبية',
    name_en: 'Algeria',
    capital: 'الجزائر العاصمة',
    flag: '🇩🇿',
    currency: 'الدينار الجزائري',
    currency_symbol: 'DZD',
    language: 'اللغة العربية والأمازيغية (رسميتان)',
    population: '45.5 مليون نسمة (الديوان الوطني للإحصائيات)',
    area_sq_km: '2,381,741 كم² (أكبر دول أفريقيا والعالم العربي مساحة)',
    location: 'في شمال أفريقيا، تطل على البحر الأبيض المتوسط، وتمتد جنوباً في عمق الصحراء الكبرى.',
    borders: ['تونس وليبيا شرقاً', 'المغرب والصحراء الغربية غرباً', 'موريتانيا ومالي والنيجر جنوباً'],
    seas_and_oceans: ['البحر الأبيض المتوسط شمالاً بشريط ساحلي يتجاوز 1200 كم'],
    islands_and_straits: [],
    provinces_count: 58,
    provinces_label: 'ولاية',
    timezone: 'GMT+1',
    calling_code: '+213',
    domain_tld: '.dz / .الجزائر',
    description_ar: 'بلد المليون ونصف المليون شهيد، العملاق الجغرافي الإفريقي، ومصدر رئيسي للغاز الطبيعي والطاقة نحو أوروبا.',
    terrain: 'الشريط الساحلي وسلسلة جبال الأطلس التلي والصحراوي، الهضاب العليا، والصحراء الكبرى وجبال الطاسيلي والهقار.',
    climate: 'متوسطي معتدل رطب في الشمال، شبه جاف في الهضاب العليا، وصحراوي جاف في الجنوب مع تباين حراري كبير.',
    natural_resources: ['الغاز الطبيعي (من كبار مصدري العالم)', 'البترول', 'الحديد والفوسفات والزنك'],
    capital_city: 'الجزائر العاصمة',
    cities: [
      { id: 30, country_code: 'DZ', name_ar: 'الجزائر العاصمة', name_en: 'Algiers', region_name: 'ولاية الجزائر', description_ar: 'عاصمة الأعمال والطاقة والموانئ والخدمات العامة والجامعات والمعالم البيضاء.', cost_index: 42, internet_score: 75, safety_score: 78, weather_score: 86 }
    ],
    landmarks: [
      { name_ar: 'مقام الشهيد وجامع الجزائر الأعظم', type: 'رموز وطنية وإسلامية', description_ar: 'ثالث أكبر مسجد في العالم وأطول مئذنة في التاريخ ومزار الشهداء الوطني.' },
      { name_ar: 'قصبة الجزائر العتيقة', type: 'تراث عالمي (UNESCO)', description_ar: 'مدينة تاريخية أثرية تطل على خليج الجزائر بعمارتها العثمانية والمغاربية الأصيلة.' },
      { name_ar: 'طاسيلي ناجر والهقار', type: 'تراث طبيعي وثقافي عالمي (UNESCO)', description_ar: 'أكبر متحف للنقوش الصخرية التي تعود لعشرة آلاف عام وسط تشكيلات جيولوجية خيالية.' }
    ],
    visiting_seasons: [
      { season: 'الربيع والخريف (الشمال) / الشتاء (الصحراء)', months: 'مارس – مايو (الشمال) / نوفمبر – فبراير (الصحراء وجانت وتمنراست)', climate_description: 'تنوع مناخي قاري وصحراوي يتيح السياحة في أوقات متعددة.', travel_advisory_note: 'معلومة مرجعية؛ السفر يتطلب تأشيرة سارية من القنصليات الجزائرية أو تأشيرة التسوية لجنوب الجزائر.' }
    ],
    airports: [
      { name_ar: 'مطار هواري بومدين الدولي', code: 'ALG', city: 'الجزائر العاصمة', international: true },
      { name_ar: 'مطار أحمد بن بلة الدولي', code: 'ORN', city: 'وهران', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء الجزائر العاصمة', city: 'الجزائر' },
      { name_ar: 'ميناء وهران وميناء جن جن', city: 'وهران / جيجل' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'استقرار أمني ومؤسساتي، مع مراعاة الضوابط الإجرائية المعتادة للمناطق الحدودية.',
      source: 'البوابة الرسمية للخدمات العمومية (el-mouradia.dz)',
      verified_at: '2026-09-17'
    },
    gdp_reference: 'نحو 240 مليار دولار أمريكي (تقدير مرجعي 2024)',
    growth_rate_reference: '3.8% – 4.0% (مؤشر مرجعي مدعوم بنشاط المحروقات والزراعة)',
    economic_sectors: ['المحروقات والغاز الطبيعي المسال', 'الصناعات البتروكيماوية والحديد والصلب', 'الفلاحة واستصلاح الجنوب', 'الصناعات الغذائية والأدوية'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية أرقام مرجعية من بنك الجزائر والديوان الوطني للإحصائيات.',
    source_document: 'الدليل المطور للدول العربية V1 - الجزائر + el-mouradia.dz',
    verified_at: '2026-09-17T18:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'high',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 4,
    services_count: 6
  },

  TN: {
    country_code: 'TN',
    name_ar: 'الجمهورية التونسية',
    name_en: 'Tunisia',
    capital: 'تونس العاصمة',
    flag: '🇹🇳',
    currency: 'الدينار التونسي',
    currency_symbol: 'TND',
    language: 'اللغة العربية (رسمية)',
    population: '12.4 مليون نسمة (المعهد الوطني للإحصاء)',
    area_sq_km: '163,610 كم²',
    location: 'في شمال قارة أفريقيا، تتوسط المغرب العربي وتتحكم بمضيق صقلية الفاصل بين الحوضين الشرقي والغربي للبحر المتوسط.',
    borders: ['الجزائر غرباً', 'ليبيا جنوب شرق'],
    seas_and_oceans: ['البحر الأبيض المتوسط شمالاً وشرقاً بشريط ساحلي يتجاوز 1300 كم'],
    islands_and_straits: ['جزيرة جربة', 'أرخبيل قرقنة', 'قناة صقلية'],
    provinces_count: 24,
    provinces_label: 'ولاية',
    timezone: 'GMT+1',
    calling_code: '+216',
    domain_tld: '.tn / .تونس',
    description_ar: 'مهد قرطاج وعاصمة الزيتونة الخضراء، رائدة صناعات البرمجيات ومكونات الطائرات والسيارات والسياحة المتوسطية.',
    terrain: 'جبال الأطلس التلي والشعانبي (أعلى قمة 1544م)، سهول مجردة الخصبة، والساحل الشرقي وبداية الصحراء بالجنوب.',
    climate: 'متوسطي معتدل رطب في الشمال، شبه جاف في الوسط، وصحراوي جاف في الجنوب.',
    natural_resources: ['الفوسفات', 'زيت الزيتون والتمور (دقلة النور)', 'البترول والغاز المحدود'],
    capital_city: 'تونس العاصمة',
    cities: [
      { id: 31, country_code: 'TN', name_ar: 'تونس العاصمة', name_en: 'Tunis', region_name: 'ولاية تونس', description_ar: 'مركز التكنولوجيا والخدمات البرمجية والتعليم والسياحة والجامعات والمدينة العتيقة.', cost_index: 40, internet_score: 78, safety_score: 80, weather_score: 87 }
    ],
    landmarks: [
      { name_ar: 'آثار قرطاج وسيدي بوسعيد', type: 'تراث عالمي (UNESCO) ومعالم سياحية', description_ar: 'أطلال إمبراطورية حنبعل الفينيقية والقرية البيضاء والزرقاء الساحرة المطلة على الخليج.' },
      { name_ar: 'مسرح الجم الروماني', type: 'تراث عالمي (UNESCO)', description_ar: 'أحد أكبر المسارح الرومانية المحفوظة في العالم المنافس لكولوسيوم روما.' },
      { name_ar: 'جامع الزيتونة المعمور ومدينة تونس العتيقة', type: 'تراث عالمي ومنارة علمية', description_ar: 'منارة إسلامية تاريخية عريقة تتوسط أسواق وصناع العاصمة القديمة.' }
    ],
    visiting_seasons: [
      { season: 'الربيع والصيف والخريف', months: 'إبريل – يونيو / سبتمبر – نوفمبر', climate_description: 'أجواء متوسطية مشمسة وجميلة تناسب السياحة الثقافية والشاطئية.', travel_advisory_note: 'مرجع مناخي؛ السفر يستوجب التأكد من متطلبات التأشيرة وفق الجنسية وجواز السفر.' }
    ],
    airports: [
      { name_ar: 'مطار تونس قرطاج الدولي', code: 'TUN', city: 'تونس العاصمة', international: true },
      { name_ar: 'مطار الحبيب بورقيبة الدولي', code: 'MIR', city: 'المنستير', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء رادس وحلق الوادي', city: 'تونس' },
      { name_ar: 'ميناء بنزرت وميناء صفاقس', city: 'بنزرت / صفاقس' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'الوضع الأمني مستقر وميسر للزوار والباحثين والمستثمرين.',
      source: 'بوابة الإدارة التونسية ووزارة الداخلية',
      verified_at: '2026-09-17'
    },
    gdp_reference: 'نحو 49 مليار دولار أمريكي (تقدير مرجعي 2024)',
    growth_rate_reference: '1.8% – 2.2% (مؤشر مرجعي)',
    economic_sectors: ['صناعة مكونات السيارات والطائرات', 'تكنولوجيا المعلومات وتصدير البرمجيات', 'زيت الزيتون والمنتجات الفلاحية', 'السياحة والصناعات التقليدية'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية أرقام مرجعية من البنك المركزي التونسي والمعهد الوطني للإحصاء.',
    source_document: 'الدليل المطور للدول العربية V1 - تونس + ministeres.tn',
    verified_at: '2026-09-17T19:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'high',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 4,
    services_count: 5
  },

  LB: {
    country_code: 'LB',
    name_ar: 'الجمهورية اللبنانية',
    name_en: 'Lebanon',
    capital: 'بيروت',
    flag: '🇱🇧',
    currency: 'الليرة اللبنانية / الدولار الأمريكي',
    currency_symbol: 'LBP / USD',
    language: 'اللغة العربية (رسمية)، والفرنسية والإنجليزية شائعتان',
    population: '5.3 مليون نسمة (تقدير إدارة الإحصاء المركزي)',
    area_sq_km: '10,452 كم²',
    location: 'على الساحل الشرقي للبحر الأبيض المتوسط في بلاد الشام غرب آسيا.',
    borders: ['سوريا شمالاً وشرقاً', 'فلسطين جنوباً'],
    seas_and_oceans: ['البحر الأبيض المتوسط غرباً'],
    islands_and_straits: ['جزر النخيل (طرابلس)'],
    provinces_count: 8,
    provinces_label: 'محافظة',
    timezone: 'GMT+2',
    calling_code: '+961',
    domain_tld: '.lb',
    description_ar: 'سويسرا الشرق وموطن شجرة الأرز، منارة الفكر والنشر والإعلام والطب والضيافة في العالم العربي.',
    terrain: 'سهل ساحلي ضيق، سلسلتا جبال لبنان الغربية والشرقية (القرنة السوداء 3088م)، وسهل البقاع الخصيب بينهما.',
    climate: 'متوسطي معتدل، ماطر ومثلج في المرتفعات شتاءً، وحار معتدل صيفاً على السواحل.',
    natural_resources: ['المياه العذبة والأنهار الجبلية', 'الأراضي الزراعية والكروم', 'الحجر الجيري'],
    capital_city: 'بيروت',
    cities: [
      { id: 25, country_code: 'LB', name_ar: 'بيروت', name_en: 'Beirut', region_name: 'محافظة بيروت', description_ar: 'عاصمة الثقافة والخدمات الإبداعية والتصميم والتعليم والطب والعمل الحر.', cost_index: 52, internet_score: 70, safety_score: 65, weather_score: 88 }
    ],
    landmarks: [
      { name_ar: 'صخرة الروشة وكورنيش بيروت', type: 'معالم طبيعية وسياحية', description_ar: 'الصخرة الطبيعية الشهيرة الصامدة قبالة ساحل بيروت البحري.' },
      { name_ar: 'مغارة جعيتا ومحمية أرز الرب', type: 'تراث طبيعي عالمي', description_ar: 'عجيبة طبيعية من النوازل الكلسية وسحر أشجار الأرز المعمرة لآلاف السنين.' },
      { name_ar: 'معابد بعلبك وقلعة جبيل الفينيقية', type: 'تراث عالمي (UNESCO)', description_ar: 'أضخم أعمدة ومعابد شيدها الرومان وأقدم المدن المأهولة باستمرار في التاريخ.' }
    ],
    visiting_seasons: [
      { season: 'الربيع والصيف / موسم التزلج شتاءً', months: 'مايو – أكتوبر (السياحة والاصطياف) / ديسمبر – مارس (التزلج في فاريا)', climate_description: 'تنوع يتيح السباحة في البحر والتزلج على الثلج في نفس اليوم.', travel_advisory_note: 'تنبيه أمني مرجعي: التحقق من التطورات الإقليمية والأوضاع الميدانية متطلب إلزامي قبل السفر.' }
    ],
    airports: [
      { name_ar: 'مطار رفيق الحريري الدولي', code: 'BEY', city: 'بيروت', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء بيروت البحري', city: 'بيروت' },
      { name_ar: 'ميناء طرابلس', city: 'طرابلس' }
    ],
    travel_security_alert: {
      level: 'advisory',
      text_ar: 'يتطلب السفر متابعة حذرة للأوضاع الأمنية والتوجيهات الرسمية.',
      source: 'تقارير وزارة السياحة والأمن العام اللبناني',
      verified_at: '2026-09-18'
    },
    gdp_reference: 'نحو 20 مليار دولار أمريكي (تقدير مرجعي متأثر بتقلبات سعر الصرف)',
    growth_rate_reference: 'يعتمد بشكل كبير على تحويلات المغتربين والنشاط السياحي الموسمي',
    economic_sectors: ['الخدمات المصرفية والسياحية', 'التصميم والخدمات الإبداعية وتكنولوجيا المعلومات', 'الطب والرعاية الصحية', 'الفلاحة والنبيذ والصناعات الغذائية'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'تعدد أسعار الصرف والدولرة الشائعة تجعل الأرقام استرشادية بحتة.',
    source_document: 'الدليل المطور للدول العربية V1 - لبنان + مصرف لبنان',
    verified_at: '2026-09-18T10:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'medium',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 4,
    services_count: 7
  },

  IQ: {
    country_code: 'IQ',
    name_ar: 'جمهورية العراق',
    name_en: 'Iraq',
    capital: 'بغداد',
    flag: '🇮🇶',
    currency: 'الدينار العراقي',
    currency_symbol: 'IQD',
    language: 'اللغة العربية والكردية (رسميتان)',
    population: '44 مليون نسمة (وزارة التخطيط العراقية)',
    area_sq_km: '438,317 كم²',
    location: 'في غرب آسيا في حوض الرافدين (دجلة والفرات)، يطل جنوباً على الخليج العربي.',
    borders: ['تركيا شمالاً', 'إيران شرقاً', 'سوريا والأردن غرباً', 'السعودية والكويت جنوباً'],
    seas_and_oceans: ['الخليج العربي جنوباً بشريط ساحلي محدود عبر شبه جزيرة الفاو'],
    islands_and_straits: ['شط العرب'],
    provinces_count: 18,
    provinces_label: 'محافظة',
    timezone: 'GMT+3',
    calling_code: '+964',
    domain_tld: '.iq / .العراق',
    description_ar: 'بلاد ما بين النهرين، مهد الكتابة وأولى الحضارات في التاريخ (سومر وبابل وآشور)، ومركز الطاقة والمشاريع الإعمارية الكبرى.',
    terrain: 'السهل الرسوبي الخصيب بين دجلة والفرات، الهضبة الغربية الصحراوية، وجبال كردستان الوعرة شمالاً.',
    climate: 'صحراوي حار جداً صيفاً ومعتدل يميل للبرودة شتاءً، وجبلي معتدل ماطر ومثلج في الشمال.',
    natural_resources: ['البترول (من كبرى احتياطيات العالم المؤكدة)', 'الغاز الطبيعي', 'الكبريت والفوسفات', 'الأراضي الزراعية والمياه العذبة'],
    capital_city: 'بغداد',
    cities: [
      { id: 26, country_code: 'IQ', name_ar: 'بغداد', name_en: 'Baghdad', region_name: 'محافظة بغداد', description_ar: 'عاصمة التاريخ والفرص التجارية ومشاريع الإعمار والجامعات والخدمات الحيوية.', cost_index: 48, internet_score: 75, safety_score: 68, weather_score: 78 }
    ],
    landmarks: [
      { name_ar: 'آثار بابل وبوابة عشتار', type: 'تراث عالمي (UNESCO)', description_ar: 'عاصمة نبوخذ نصر والحدائق المعلقة وأحد أقدم مراكز الإشعاع الحضاري البشري.' },
      { name_ar: 'العتبات المقدسة في النجف وكربلاء والكاظمية وسامراء', type: 'مزارات دينية إسلامية كبرى', description_ar: 'مقاصد ملايين الزوار سنوياً من مختلف أرجاء العالم الإسلامي.' },
      { name_ar: 'أهوار جنوب العراق وقلعة أربيل', type: 'تراث طبيعي وثقافي عالمي (UNESCO)', description_ar: 'أكبر نظام بيئي مائي دائم في الشرق الأوسط وأقدم قلعة مأهولة في العالم.' }
    ],
    visiting_seasons: [
      { season: 'الخريف والشتاء والربيع', months: 'أكتوبر – إبريل', climate_description: 'أجواء معتدلة ممتازة للسياحة والزيارات في بغداد والجنوب وشمال العراق.', travel_advisory_note: 'بيانات مرجعية؛ السفر يتطلب الحصول على تأشيرة الدخول الرسمية أو الفيزا الإلكترونية المعتمدة.' }
    ],
    airports: [
      { name_ar: 'مطار بغداد الدولي', code: 'BGW', city: 'بغداد', international: true },
      { name_ar: 'مطار النجف الدولي', code: 'NJF', city: 'النجف الأشرف', international: true },
      { name_ar: 'مطار أربيل الدولي', code: 'EBL', city: 'أربيل', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء أم قصر وميناء الفاو الكبير (قيد التوسعة)', city: 'البصرة' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'تحسن أمني واستقراري ملحوظ مع انتعاش حركة التجارة والزيارات الدولية.',
      source: 'وزارة الداخلية العراقية وبوابة أور الحكومية',
      verified_at: '2026-09-17'
    },
    gdp_reference: 'نحو 270 مليار دولار أمريكي (تقدير مرجعي 2024)',
    growth_rate_reference: '3.0% – 3.5% (مؤشر مرجعي)',
    economic_sectors: ['إنتاج وتصدير النفط والغاز', 'البنية التحتية والمقاولات ومشاريع الإعمار', 'الزراعة والنخيل والتمور', 'التجارة والخدمات اللوجستية والسياحة الدينية'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية أرقام مرجعية من البنك المركزي العراقي ووزارة التخطيط.',
    source_document: 'الدليل المطور للدول العربية V1 - العراق + بوابة أور',
    verified_at: '2026-09-17T20:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'high',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 5,
    services_count: 7
  },

  SY: {
    country_code: 'SY',
    name_ar: 'الجمهورية العربية السورية',
    name_en: 'Syria',
    capital: 'دمشق',
    flag: '🇸🇾',
    currency: 'الليرة السورية',
    currency_symbol: 'SYP',
    language: 'اللغة العربية (رسمية)',
    population: '22 مليون نسمة (تقدير مرجعي)',
    area_sq_km: '185,180 كم²',
    location: 'في قلب بلاد الشام على الساحل الشرقي للبحر الأبيض المتوسط، تربط بين آسيا وأفريقيا وأوروبا.',
    borders: ['تركيا شمالاً', 'العراق شرقاً', 'الأردن جنوباً', 'لبنان وفلسطين جنوب غرب'],
    seas_and_oceans: ['البحر الأبيض المتوسط غرباً بشريط ساحلي حيوي (اللاذقية وطرطوس)'],
    islands_and_straits: ['جزيرة أرواد (الجزيرة المأهولة الوحيدة في سوريا)'],
    provinces_count: 14,
    provinces_label: 'محافظة',
    timezone: 'GMT+3',
    calling_code: '+963',
    domain_tld: '.sy / .سوريا',
    description_ar: 'أقدم عاصمة مأهولة في التاريخ (دمشق)، مهد الأبجديات الأولى (أوغاريت)، ومركز الحرف العريقة والتجارة الشامية التاريخية.',
    terrain: 'السهل الساحلي المتوسطي، سلاسل الجبال الساحلية، سهول حلب وحمص وحوران الخصبة، والبادية السورية شرقاً ونهر الفرات.',
    climate: 'متوسطي معتدل رطب في الساحل والجبال، شبه جاف في السهول الداخلية، وجاف صحراوي في البادية الشرقية.',
    natural_resources: ['النفط والغاز الطبيعي', 'الفوسفات والكروم والرخام', 'الأراضي الزراعية والقمح والقطن والزيتون'],
    capital_city: 'دمشق',
    cities: [
      { id: 27, country_code: 'SY', name_ar: 'دمشق', name_en: 'Damascus', region_name: 'محافظة دمشق', description_ar: 'المركز التجاري والتاريخي والمهني والحرفي والجامعي العريق في سوريا.', cost_index: 35, internet_score: 60, safety_score: 65, weather_score: 84 }
    ],
    landmarks: [
      { name_ar: 'الجامع الأموي الكبير بدمشق', type: 'تراث إسلامي وعالمي (UNESCO)', description_ar: 'إحدى أعظم وأقدم المنارات المعمارية الإسلامية والفسيفسائية في العالم.' },
      { name_ar: 'قلعة حلب وأسواقها القديمة', type: 'تراث عالمي (UNESCO)', description_ar: 'أكبر وأمنع القلاع العسكرية التاريخية في الشرق وأسواق الحرير التاريخية.' },
      { name_ar: 'آثار تدمر ومسرح بصرى الشام', type: 'تراث عالمي (UNESCO)', description_ar: 'عروس البادية السورية ومملكة زنوبيا وأضخم المسارح الرومانية الحجرية المحفوظة.' }
    ],
    visiting_seasons: [
      { season: 'الربيع والخريف', months: 'إبريل – يونيو / سبتمبر – نوفمبر', climate_description: 'أجواء ربيعية شتوية دافئة لطيفة.', travel_advisory_note: 'تنبيه أمني مرجعي: تدقيق الأوضاع الميدانية وإجراءات سمات الدخول الرسمية إلزامي قبل السفر.' }
    ],
    airports: [
      { name_ar: 'مطار دمشق الدولي', code: 'DAM', city: 'دمشق', international: true },
      { name_ar: 'مطار حلب الدولي', code: 'ALP', city: 'حلب', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء اللاذقية البحري', city: 'اللاذقية' },
      { name_ar: 'ميناء طرطوس', city: 'طرطوس' }
    ],
    travel_security_alert: {
      level: 'advisory',
      text_ar: 'ضرورة التحقق المستمر من إجراءات السفر والمعابر والوضع الأمني في المحافظات.',
      source: 'تقارير رسمية ووزارة السياحة السورية',
      verified_at: '2026-09-18'
    },
    gdp_reference: 'تقدير مرجعي متقلب وفق تقارير المنظمات الاقتصادية الدولية',
    growth_rate_reference: 'مرتبط بمشاريع الإعمار وعودة الأنشطة الاقتصادية والزراعية',
    economic_sectors: ['الفلاحة والزيتون وزيت الزيتون والحبوب', 'الصناعات النسيجية والصابون الحرفي والغذائية', 'التجارة وإعادة الإعمار', 'السياحة الدينية والتراثية'],
    measurement_year: 2023,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية أرقام مرجعية أولية نظراً لتغيرات المشهد الميداني والمالي.',
    source_document: 'الدليل المطور للدول العربية V1 - سوريا + المكتب المركزي للإحصاء',
    verified_at: '2026-09-18T11:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'medium',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 3,
    services_count: 5
  },

  LY: {
    country_code: 'LY',
    name_ar: 'دولة ليبيا',
    name_en: 'Libya',
    capital: 'طرابلس',
    flag: '🇱🇾',
    currency: 'الدينار الليبي',
    currency_symbol: 'LYD',
    language: 'اللغة العربية (رسمية)',
    population: '7.0 مليون نسمة (مصلحة الإحصاء والتعداد الليبية)',
    area_sq_km: '1,759,540 كم²',
    location: 'في شمال أفريقيا على الساحل الجنوبي للبحر الأبيض المتوسط بشريط ساحلي يقارب 1900 كم.',
    borders: ['مصر شرقاً', 'السودان جنوب شرق', 'تشاد والنيجر جنوباً', 'الجزائر وتونس غرباً'],
    seas_and_oceans: ['البحر الأبيض المتوسط شمالاً'],
    islands_and_straits: [],
    provinces_count: 22,
    provinces_label: 'شعبية / بلدية',
    timezone: 'GMT+2',
    calling_code: '+218',
    domain_tld: '.ly / .ليبيا',
    description_ar: 'موطن أكبر احتياطيات النفط المؤكدة في أفريقيا، وشاطئ متوسطي ممتد ومواقع أثرية رومانية وإغريقية نادرة.',
    terrain: 'سهول ساحلية ومرتفعات الجبل الأخضر وجبل نفوسة، ومنخفضات وبحار الرمال في الصحراء الكبرى.',
    climate: 'متوسطي معتدل في الشمال الساحلي والجبل الأخضر، وشديد الجفاف والحرارة في الداخل الصحراوي.',
    natural_resources: ['النفط الخام الخفيف عالي الجودة', 'الغاز الطبيعي', 'المياه الجوفية (النهر الصناعي العظيم)'],
    capital_city: 'طرابلس',
    cities: [
      { id: 32, country_code: 'LY', name_ar: 'طرابلس', name_en: 'Tripoli', region_name: 'شعبية طرابلس', description_ar: 'المركز التجاري والبحري والمؤسسات الحكومية والشركات والمصارف والموانئ.', cost_index: 42, internet_score: 70, safety_score: 65, weather_score: 85 }
    ],
    landmarks: [
      { name_ar: 'مدينة لبدة الكبرى (Leptis Magna)', type: 'تراث عالمي (UNESCO)', description_ar: 'أكبر وأروع المدن الرومانية المحفوظة على حوض البحر الأبيض المتوسط.' },
      { name_ar: 'سراي الحمراء والمدينة القديمة بطرابلس', type: 'تاريخ وقلاع عتيقة', description_ar: 'قلعة تاريخية ومتحف يطل على البحر وأسواق قديمة مسقوفة نابضة بالحياة.' },
      { name_ar: 'مدينة غدامس التاريخية (لؤلؤة الصحراء)', type: 'تراث عالمي (UNESCO)', description_ar: 'نموذج فريد للعمارة الصحراوية البيضاء والممرات المظللة المقاومة لحرارة الصحراء.' }
    ],
    visiting_seasons: [
      { season: 'الخريف والشتاء والربيع', months: 'نوفمبر – إبريل', climate_description: 'أجواء معتدلة ممتازة للزيارة الساحلية واستكشاف المعالم.', travel_advisory_note: 'تنبيه أمني مرجعي: مراجعة تحديثات المعابر والمطارات وتصاريح الدخول الرسمية إلزامي.' }
    ],
    airports: [
      { name_ar: 'مطار معيتيقة الدولي', code: 'MJI', city: 'طرابلس', international: true },
      { name_ar: 'مطار بنينا الدولي', code: 'BEN', city: 'بنغازي', international: true },
      { name_ar: 'مطار مصراتة الدولي', code: 'MRA', city: 'مصراتة', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء طرابلس البحري وميناء مصراتة الحر', city: 'طرابلس / مصراتة' },
      { name_ar: 'ميناء بنغازي وموانئ الهلال النفطي', city: 'بنغازي / رأس لانوف' }
    ],
    travel_security_alert: {
      level: 'advisory',
      text_ar: 'تأكيد ضرورة التنسيق الرسمي مع الجهات المختصة ومتابعة حالة الاستقرار في كل مدينة.',
      source: 'تقارير مصلحة الجوازات والجنسية الليبية',
      verified_at: '2026-09-18'
    },
    gdp_reference: 'نحو 45 مليار دولار أمريكي (تقدير مرجعي متقلب وفق وتيرة إنتاج النفط)',
    growth_rate_reference: 'شديد التأثر بمستوى إنتاج وتصدير البراميل اليومية',
    economic_sectors: ['استخراج وتصدير النفط والغاز', 'التجارة والخدمات اللوجستية وموانئ العبور', 'الإنشاءات وإعادة الإعمار', 'الثروة السمكية'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية أرقام مرجعية من مصرف ليبيا المركزي والمؤسسة الوطنية للنفط.',
    source_document: 'الدليل المطور للدول العربية V1 - ليبيا + مصلحة الإحصاء',
    verified_at: '2026-09-18T12:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'medium',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 3,
    services_count: 5
  },

  SD: {
    country_code: 'SD',
    name_ar: 'جمهورية السودان',
    name_en: 'Sudan',
    capital: 'الخرطوم / العاصمة الإدارية بورتسودان',
    flag: '🇸🇩',
    currency: 'الجنيه السوداني',
    currency_symbol: 'SDG',
    language: 'اللغة العربية (رسمية)',
    population: '48 مليون نسمة (تقدير الجهاز المركزي للإحصاء السوداني)',
    area_sq_km: '1,861,484 كم²',
    location: 'في شمال شرق أفريقيا، يربط بين العالم العربي والعمق الأفريقي، ويطل شرقاً على البحر الأحمر.',
    borders: ['مصر وليبيا شمالاً', 'تشاد وأفريقيا الوسطى غرباً', 'جنوب السودان وإثيوبيا وإريتريا جنوباً وشرقاً'],
    seas_and_oceans: ['البحر الأحمر شرقاً'],
    islands_and_straits: ['شعب سنقنيب المرجانية (UNESCO)'],
    provinces_count: 18,
    provinces_label: 'ولاية',
    timezone: 'GMT+2',
    calling_code: '+249',
    domain_tld: '.sd / .السودان',
    description_ar: 'سلة غذاء العالم العربي ومجرى النيلين (الأزرق والأبيض)، يمتلك أكبر أعداد أهرامات تاريخية في العالم (أهرامات مروي وكوش).',
    terrain: 'سهول طينية ورملية واسعة يشقها نهر النيل العظيم، جبال البحر الأحمر شرقاً، وجبل مرة البركاني غرباً.',
    climate: 'صحراوي حار في الشمال، وشبه صحراوي في الوسط، ومداري مطير في الجنوب.',
    natural_resources: ['الأراضي الزراعية والمياه الوفيرة', 'الذهب والمعادن الثمينة', 'الثروة الحيوانية الضخمة (أكثر من 100 مليون رأس)', 'البترول'],
    capital_city: 'بورتسودان / الخرطوم',
    cities: [
      { id: 33, country_code: 'SD', name_ar: 'بورتسودان', name_en: 'Port Sudan', region_name: 'ولاية البحر الأحمر', description_ar: 'الميناء الرئيسي والمركز الإداري والتجاري واللوجستي والخدمات الحيوية والبعثات.', cost_index: 38, internet_score: 65, safety_score: 72, weather_score: 80 }
    ],
    landmarks: [
      { name_ar: 'أهرامات مروي والبجراوية (مملكة كوش)', type: 'تراث عالمي (UNESCO)', description_ar: 'أكثر من مئتي هرم تاريخي لحضارة الفراعنة السود والمملكة النوبية العظيمة.' },
      { name_ar: 'مقرن النيلين بالخرطوم', type: 'معالم طبيعية فريدة', description_ar: 'نقطة التقاء النيل الأزرق الهادر القادم من إثيوبيا مع النيل الأبيض الهادئ القادم من فيكتوريا.' },
      { name_ar: 'محمية سنقنيب وخليج دنقناب', type: 'تراث بحري عالمي (UNESCO)', description_ar: 'أجمل الشعاب المرجانية البكر والأسماك النادرة على ساحل البحر الأحمر.' }
    ],
    visiting_seasons: [
      { season: 'فصل الشتاء', months: 'نوفمبر – فبراير', climate_description: 'أجواء شتوية معتدلة لطيفة خاصة على ساحل البحر الأحمر.', travel_advisory_note: 'تنبيه أمني وإنساني إلزامي: متابعة الوضع الميداني والمنافذ العاملة وسلامة الطرق متطلب قطعي.' }
    ],
    airports: [
      { name_ar: 'مطار بورتسودان الدولي', code: 'PZU', city: 'بورتسودان', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء بورتسودان الجنوبي والشمالي', city: 'بورتسودان' },
      { name_ar: 'ميناء سواكن التاريخي', city: 'سواكن' }
    ],
    travel_security_alert: {
      level: 'warning',
      text_ar: 'تنبيه إنساني وأمني مستمر؛ العمليات تتركز في المنافذ الآمنة بولاية البحر الأحمر والولايات المستقرة.',
      source: 'تقارير رسمية ووزارة الداخلية السودانية',
      verified_at: '2026-09-18'
    },
    gdp_reference: 'تقدير مرجعي متقلب وفق تقارير المؤسسات الدولية ومعدلات الصادرات',
    growth_rate_reference: 'مرتبط باستقرار الأنشطة الإنتاجية والموانئ والممرات',
    economic_sectors: ['تعدين وتصدير الذهب', 'الزراعة والثروة الحيوانية والسمسم والصمغ العربي', 'الخدمات البحرية والموانئ'],
    measurement_year: 2023,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية أرقام مرجعية متأثرة بظروف الطوارئ وإعادة ترتيب المؤسسات.',
    source_document: 'الدليل المطور للدول العربية V1 - السودان + الجهاز المركزي للإحصاء',
    verified_at: '2026-09-18T13:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'medium',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 3,
    services_count: 5
  },

  SO: {
    country_code: 'SO',
    name_ar: 'جمهورية الصومال الفيدرالية',
    name_en: 'Somalia',
    capital: 'مقديشو',
    flag: '🇸🇴',
    currency: 'الشلن الصومالي / الدولار الأمريكي',
    currency_symbol: 'SOS / USD',
    language: 'اللغة الصومالية والعربية (رسميتان)',
    population: '18 مليون نسمة (الوكالة الوطنية للإحصاء الصومالية)',
    area_sq_km: '637,657 كم²',
    location: 'في القرن الأفريقي، يمتلك أطول ساحل على البر الرئيسي لقارة أفريقيا (أكثر من 3300 كم) يطل على المحيط الهندي وخليج عدن.',
    borders: ['جيبوتي شمال غرب', 'إثيوبيا غرباً', 'كينيا جنوب غرب'],
    seas_and_oceans: ['المحيط الهندي شرقاً', 'خليج عدن شمالاً'],
    islands_and_straits: ['رأس عسير (رأس غواردافوي)'],
    provinces_count: 18,
    provinces_label: 'إقليم',
    timezone: 'GMT+3',
    calling_code: '+252',
    domain_tld: '.so / .الصومال',
    description_ar: 'حارس القرن الأفريقي وبوابة التجارة نحو المحيط الهندي، رائد في التحول المالي الرقمي عبر الهاتف واقتصاد الثروة الحيوانية.',
    terrain: 'أراضٍ سهلية وهضاب واسعة ترتفع في الشمال نحو سلاسل جبال عولوقري، ونهران دائمان في الجنوب (شبيلي وجوبا).',
    climate: 'مداري شبه جاف، حار طوال العام مع رياح موسمية وموسمي أمطار (الغو والداير).',
    natural_resources: ['أطول شواطئ إفريقيا والثروة السمكية غير المستغلة', 'الثروة الحيوانية', 'اللبان والمر', 'الغاز والنفط قيد الاستكشاف'],
    capital_city: 'مقديشو',
    cities: [
      { id: 34, country_code: 'SO', name_ar: 'مقديشو', name_en: 'Mogadishu', region_name: 'إقليم بنادر', description_ar: 'المركز التجاري والبحري المتنامي والخدمات المصرفية الرقمية ومقرات الشركات.', cost_index: 36, internet_score: 65, safety_score: 60, weather_score: 82 }
    ],
    landmarks: [
      { name_ar: 'شاطئ ليدو والمدينة القديمة (حمروين)', type: 'شواطئ ومعالم تاريخية', description_ar: 'شاطئ مقديشو الأبيض النابض بالمطاعم والحياة والأسواق التاريخية الصومالية.' },
      { name_ar: 'كهوف لاس جيل الصخرية', type: 'تراث وآثار ما قبل التاريخ', description_ar: 'أقدم وأوضح اللوحات الصخرية في القارة الأفريقية التي توثق استئناس الأبقار.' },
      { name_ar: 'منارة مقديشو ومسجد فخر الدين', type: 'تاريخ وآثار إسلامية', description_ar: 'أحد أقدم المساجد في شرق أفريقيا شُيّد في القرن العاشر الميلادي.' }
    ],
    visiting_seasons: [
      { season: 'الموسم الجاف المعتدل', months: 'ديسمبر – مارس / يوليو – أغسطس', climate_description: 'رياح بحرية لطيفة تخفف من وطأة الرطوبة والحرارة.', travel_advisory_note: 'تنبيه أمني مرجعي: استخراج تأشيرة الدخول والتنسيق الأمني والاستقبال المعتمد متطلب أساسي.' }
    ],
    airports: [
      { name_ar: 'مطار آدم عدي الدولي', code: 'MGQ', city: 'مقديشو', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء مقديشو الدولي', city: 'مقديشو' },
      { name_ar: 'ميناء بربرة وميناء كيسمايو', city: 'بربرة / كيسمايو' }
    ],
    travel_security_alert: {
      level: 'advisory',
      text_ar: 'تأكيد الالتزام بالإجراءات الأمنية المعتمدة والتنقل عبر المناطق المؤمنة رسمياً.',
      source: 'وزارة الأمن الداخلي والوكالة الوطنية للإحصاء',
      verified_at: '2026-09-18'
    },
    gdp_reference: 'نحو 11 مليار دولار أمريكي (تقدير مرجعي 2024)',
    growth_rate_reference: '3.0% – 3.7% مدعوماً بالتجارة والتحويلات المالية واستثمارات الموانئ',
    economic_sectors: ['تصدير المواشي واللحوم والجلود', 'الاتصالات والمصارف الرقمية الفائقة', 'الخدمات البحرية والتجارة العامة', 'الزراعة على ضفاف نهري جوبا وشبيلي'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية أرقام مرجعية من البنك المركزي الصومالي وصندوق النقد الدولي.',
    source_document: 'الدليل المطور للدول العربية V1 - الصومال + الوكالة الوطنية للإحصاء',
    verified_at: '2026-09-18T14:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'medium',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 2,
    services_count: 4
  },

  DJ: {
    country_code: 'DJ',
    name_ar: 'جمهورية جيبوتي',
    name_en: 'Djibouti',
    capital: 'مدينة جيبوتي',
    flag: '🇩🇯',
    currency: 'الفرنك الجيبوتي',
    currency_symbol: 'DJF',
    language: 'اللغة العربية والفرنسية (رسميتان)',
    population: '1.1 مليون نسمة (المعهد الوطني للإحصاء بجيبوتي)',
    area_sq_km: '23,200 كم²',
    location: 'في القرن الأفريقي على الساحل الغربي لمضيق باب المندب وخليج تاجورة، ملتقى البحر الأحمر بالمحيط الهندي.',
    borders: ['إريتريا شمالاً', 'إثيوبيا غرباً وجنوباً', 'الصومال جنوب شرق'],
    seas_and_oceans: ['مضيق باب المندب', 'خليج عدن وبحر العرب', 'خليج تاجورة'],
    islands_and_straits: ['مضيق باب المندب', 'جزر مصكلي وموشا'],
    provinces_count: 6,
    provinces_label: 'إقليم',
    timezone: 'GMT+3',
    calling_code: '+253',
    domain_tld: '.dj',
    description_ar: 'المحور اللوجستي ومحطة الملاحة العالمية الكبرى في باب المندب، الميناء الحيوي لإثيوبيا وخطوط التجارة الدولية.',
    terrain: 'سهول ساحلية، هضاب بركانية، بحيرة عسل المالحة (أخفض نقطة في إفريقيا -155م)، وسلسلة جبال غودا.',
    climate: 'حار شبه جاف، معتدل شتاءً وحار رطب جداً صيفاً.',
    natural_resources: ['الموقع الجيواستراتيجي للموانئ واللوجستيات', 'أملاح بحيرة عسل النقية', 'الطاقة الحرارية الأرضية'],
    capital_city: 'مدينة جيبوتي',
    cities: [
      { id: 35, country_code: 'DJ', name_ar: 'جيبوتي', name_en: 'Djibouti City', region_name: 'إقليم جيبوتي', description_ar: 'المحور اللوجستي وموانئ الشحن والتجارة الدولية والخدمات المصرفية ومراكز الربط القاري.', cost_index: 55, internet_score: 75, safety_score: 82, weather_score: 78 }
    ],
    landmarks: [
      { name_ar: 'بحيرة عسل (Lac Assal)', type: 'عجائب طبيعية عالمية', description_ar: 'أكثر بحيرات العالم ملوحة بعد بحيرة البجع وأخفض بقعة في قارة إفريقيا.' },
      { name_ar: 'موانئ دوراليه المتطورة', type: 'لوجستيات وتجارة عالمية', description_ar: 'أحدث محطات الحاويات المتطورة في إفريقيا على مدخل باب المندب.' },
      { name_ar: 'خليج تاجورة وجزر موشا', type: 'سياحة بحرية وغوص', description_ar: 'موطن السباحة مع أسماك القرش الحوتي المسالمة والشعاب المرجانية البكر.' }
    ],
    visiting_seasons: [
      { season: 'فصل الشتاء المعتدل', months: 'نوفمبر – إبريل', climate_description: 'أجواء بحرية معتدلة ولطيفة مناسبة لرحلات الغوص والاستكشاف.', travel_advisory_note: 'معلومة استرشادية؛ السفر يستلزم تأشيرة إلكترونية عبر منصة التأشيرات الجيبوتية (eVisa).' }
    ],
    airports: [
      { name_ar: 'مطار جيبوتي أمبولي الدولي', code: 'JIB', city: 'مدينة جيبوتي', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء جيبوتي القديم وميناء دوراليه للحاويات', city: 'مدينة جيبوتي' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'بيئة آمنة ومستقرة تماماً تحتضن حضوراً وتنسيقاً دولياً واسعاً.',
      source: 'البوابة الرسمية لجمهورية جيبوتي',
      verified_at: '2026-09-17'
    },
    gdp_reference: 'نحو 4.1 مليار دولار أمريكي (تقدير مرجعي 2024)',
    growth_rate_reference: '5.5% – 6.0% (من أعلى معدلات النمو في المنطقة بفضل اللوجستيات)',
    economic_sectors: ['خدمات الموانئ والشحن وإعادة التصدير', 'النقل وسكك الحديد (خط جيبوتي - أديس أبابا)', 'الاتصالات وكابلات الألياف البحرية العالمية', 'الخدمات المصرفية'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية أرقام مرجعية من البنك المركزي الجيبوتي وصندوق النقد الدولي.',
    source_document: 'الدليل المطور للدول العربية V1 - جيبوتي + المعهد الوطني للإحصاء',
    verified_at: '2026-09-17T21:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'high',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 2,
    services_count: 3
  },

  MR: {
    country_code: 'MR',
    name_ar: 'الجمهورية الإسلامية الموريتانية',
    name_en: 'Mauritania',
    capital: 'نواكشوط',
    flag: '🇲🇷',
    currency: 'الأوقية الموريتانية',
    currency_symbol: 'MRU',
    language: 'اللغة العربية (رسمية)',
    population: '4.9 مليون نسمة (الوكالة الوطنية للإحصاء والتحليل الديمغرافي)',
    area_sq_km: '1,030,700 كم²',
    location: 'في شمال غرب أفريقيا، تربط بين المغرب العربي وغرب أفريقيا، وتطل غرباً على المحيط الأطلسي.',
    borders: ['الصحراء الغربية شمالاً', 'الجزائر شمال شرق', 'مالي شرقاً وجنوباً', 'السنغال جنوب غرب عبر نهر السنغال'],
    seas_and_oceans: ['المحيط الأطلسي غرباً بشريط ساحلي يتجاوز 750 كم'],
    islands_and_straits: ['أرخبيل حوض آركين (UNESCO)'],
    provinces_count: 15,
    provinces_label: 'ولاية',
    timezone: 'GMT+0',
    calling_code: '+222',
    domain_tld: '.mr / .موريتانيا',
    description_ar: 'بلد المليون شاعر، مهد المرابطين، وحاضنة مدن القوافل التاريخية (شنقيط وودان)، وغنية بخام الحديد والصيد والغاز الطبيعي.',
    terrain: 'صحراء رملية وصخرية واسعة (الكثبان والريشات - قلب الريشات)، وسهل ساحلي أطلسي، وحوض نهر السنغال جنوباً.',
    climate: 'صحراوي حار جاف في معظم الأراضي، ومعتدل رطب نسبياً على الساحل وفي الجنوب النهري.',
    natural_resources: ['خام الحديد عالي التركيز', 'الذهب والنحاس', 'الثروة السمكية الأطلسية الغنية', 'الغاز الطبيعي المسال (حقل أحميم)'],
    capital_city: 'نواكشوط',
    cities: [
      { id: 36, country_code: 'MR', name_ar: 'نواكشوط', name_en: 'Nouakchott', region_name: 'جهة نواكشوط', description_ar: 'عاصمة التجارة والتعدين والصيد البحري والخدمات الإدارية والميناء المستقل.', cost_index: 42, internet_score: 70, safety_score: 76, weather_score: 83 }
    ],
    landmarks: [
      { name_ar: 'مدينة شنقيط التاريخية ومكتباتها القديمة', type: 'تراث عالمي (UNESCO)', description_ar: 'المدينة السابعة في الإسلام ومستودع المخطوطات النادرة وقوافل الحجيج التاريخية.' },
      { name_ar: 'قلب الريشات (عين الصحراء)', type: 'ظاهرة جيولوجية عالمية', description_ar: 'تكوين دائري طبيعي غامض يرى بوضوح من الفضاء الخارجي بقطر 40 كم.' },
      { name_ar: 'حظيرة حوض آركين الوطنية', type: 'تراث طبيعي عالمي (UNESCO)', description_ar: 'أكبر محمية بحرية في غرب إفريقيا ومحطة ملايين الطيور المهاجرة في العالم.' }
    ],
    visiting_seasons: [
      { season: 'فصل الشتاء والربيع', months: 'نوفمبر – مارس', climate_description: 'أجواء معتدلة ممتازة للسياحة الصحراوية والبيئية وزيارة المدن التاريخية.', travel_advisory_note: 'معلومة مرجعية؛ السفر يتطلب تأشيرة بيومترية تمنح عند الوصول للمنافذ المعتمدة.' }
    ],
    airports: [
      { name_ar: 'مطار نواكشوط الدولي (أم التونسي)', code: 'NKC', city: 'نواكشوط', international: true },
      { name_ar: 'مطار نواذيبو الدولي', code: 'NDB', city: 'نواذيبو', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء الصداقة المستقل بنواكشوط', city: 'نواكشوط' },
      { name_ar: 'ميناء نواذيبو المستقل (ميناء تصدير الحديد والصيد)', city: 'نواذيبو' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'استقرار أمني ومؤسساتي مشهود في المدن الكبرى ومسارات السياحة.',
      source: 'البوابة الرسمية للموريتانية ووزارة الداخلية',
      verified_at: '2026-09-17'
    },
    gdp_reference: 'نحو 11.5 مليار دولار أمريكي (تقدير مرجعي 2024)',
    growth_rate_reference: '4.8% – 5.2% مدفوعاً ببدء إنتاج الغاز وصادرات الحديد',
    economic_sectors: ['التعدين وخام الحديد والذهب (سنيم)', 'الصيد البحري والتصدير الأوروبي', 'الغاز الطبيعي المسال', 'الرعي والتنمية الحيوانية'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية أرقام مرجعية من البنك المركزي الموريتاني والوكالة الوطنية للإحصاء.',
    source_document: 'الدليل المطور للدول العربية V1 - موريتانيا + ansade.mr',
    verified_at: '2026-09-17T22:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'high',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 2,
    services_count: 3
  },

  KM: {
    country_code: 'KM',
    name_ar: 'الاتحاد القمري (جزر القمر)',
    name_en: 'Comoros',
    capital: 'موروني',
    flag: '🇰🇲',
    currency: 'الفرنك القمري',
    currency_symbol: 'KMF',
    language: 'اللغة القمرية والعربية والفرنسية (رسمية)',
    population: '860 ألف نسمة (المعهد الوطني للإحصاء بجزر القمر)',
    area_sq_km: '2,235 كم²',
    location: 'أرخبيل بركاني في المحيط الهندي عند المدخل الشمالي لمضيق موزمبيق بين مدغشقر والساحل الشرقي لإفريقيا.',
    borders: ['حدود بحرية مع موزمبيق ومدغشقر وتنزانيا وسيشيل'],
    seas_and_oceans: ['المحيط الهندي', 'قناة موزمبيق'],
    islands_and_straits: ['جزيرة القمر الكبرى (نغازيدجا)', 'جزيرة أنجوان (ندزواني)', 'جزيرة موهيلي (موالي)'],
    provinces_count: 3,
    provinces_label: 'جزيرة اتحادية مستقلة',
    timezone: 'GMT+3',
    calling_code: '+269',
    domain_tld: '.km',
    description_ar: 'جزر العطور والبهارات وطبيعة المحيط الهندي الساحرة، موطن الفانيليا واليلانج يلانج وجبل كارتالا البركاني.',
    terrain: 'جزر بركانية جبلية وعرة، يتوسطها بركان كارتالا النشط (2361م)، وشواطئ رملية سوداء وبيضاء ومحميات بحرية.',
    climate: 'استوائي بحري دافئ طوال العام، يتميز بموسم ماطر دافئ (نوفمبر – إبريل) وموسم جاف معتدل لطيف (مايو – أكتوبر).',
    natural_resources: ['زراعة الفانيليا والقرنفل وزهرة اليلانج يلانج', 'الثروة السمكية والبحرية', 'السياحة البيئية النقية'],
    capital_city: 'موروني',
    cities: [
      { id: 37, country_code: 'KM', name_ar: 'موروني', name_en: 'Moroni', region_name: 'جزيرة القمر الكبرى', description_ar: 'المركز الإداري والتجاري والخدمي والميناء التاريخي والمساجد العتيقة في جزر القمر.', cost_index: 40, internet_score: 65, safety_score: 85, weather_score: 88 }
    ],
    landmarks: [
      { name_ar: 'بركان جبل كارتالا وفوهته العملاقة', type: 'طبيعة ومغامرات بركانية', description_ar: 'أكبر فوهة بركانية نشطة في العالم محاطة بالغابات المطيرة الاستوائية.' },
      { name_ar: 'مسجد بدجان والمدينة القديمة بموروني', type: 'تاريخ وتراث إسلامي', description_ar: 'مسجد تاريخي مطل على شاطئ الميناء الصخري وأزقة المدينة الحجرية التراثية.' },
      { name_ar: 'محمية موهيلي البحرية الوطنية', type: 'محميات وتنوع بيئي بحري', description_ar: 'موطن تعشيش السلاحف البحرية الخضراء والحيتان الحدباء والدلافين.' }
    ],
    visiting_seasons: [
      { season: 'الموسم الجاف اللطيف', months: 'مايو – أكتوبر', climate_description: 'أفضل أوقات السياحة البيئية والرحلات البحرية في المحيط الهندي.', travel_advisory_note: 'معلومة مرجعية؛ تمنح تأشيرة الدخول عند الوصول لمطار موروني الدولي بعد استيفاء الشروط.' }
    ],
    airports: [
      { name_ar: 'مطار الأمير سعيد إبراهيم الدولي', code: 'HAH', city: 'موروني', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء موروني وميناء متسامودو (أنجوان)', city: 'موروني / متسامودو' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'بلد هادئ ومسالم ومجتمع مرحب بالضيوف والسياح.',
      source: 'البوابة الحكومية لاتحاد جزر القمر',
      verified_at: '2026-09-17'
    },
    gdp_reference: 'نحو 1.4 مليار دولار أمريكي (تقدير مرجعي 2024)',
    growth_rate_reference: '3.0% – 3.3% (مؤشر مرجعي)',
    economic_sectors: ['تصدير الفانيليا والقرنفل وعطور اليلانج يلانج (من رواد العالم)', 'الفلاحة المعيشية وصيد الأسماك', 'التحويلات المالية للمغتربين في فرنسا', 'السياحة البيئية'],
    measurement_year: 2024,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'المؤشرات الاقتصادية أرقام مرجعية من البنك المركزي لجزر القمر وصندوق النقد الدولي.',
    source_document: 'الدليل المطور للدول العربية V1 - جزر القمر + inseed.km',
    verified_at: '2026-09-17T23:00:00.000Z',
    reviewer_id: 'darb_editorial_lead',
    confidence: 'high',
    freshness_status: 'fresh',
    auto_publish: false,
    publication_status: 'published',
    jobs_count: 1,
    services_count: 2
  }
};
