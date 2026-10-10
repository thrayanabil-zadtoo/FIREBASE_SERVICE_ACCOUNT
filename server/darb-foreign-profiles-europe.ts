import { CountryProfile } from '../src/types/country-profile';

export const EUROPE_PROFILES: Record<string, CountryProfile> = {
  TR: {
    country_code: 'TR',
    name_ar: 'الجمهورية التركية',
    name_en: 'Turkey (Türkiye)',
    capital: 'أنقرة',
    flag: '🇹🇷',
    currency: 'الليرة التركية',
    currency_symbol: 'TRY',
    language: 'اللغة التركية (رسمية)',
    population: '85.3 مليون نسمة',
    area_sq_km: '783,562 كم²',
    location: 'جسر استراتيجي يربط جنوب شرق أوروبا بغرب آسيا، تطل على البحر الأسود والمتوسط وبحر إيجه.',
    borders: ['اليونان وبلغاريا غرباً', 'جورجيا وأرمينيا وأذربيجان شرقاً', 'إيران والعراق وسوريا جنوباً'],
    seas_and_oceans: ['البحر الأبيض المتوسط', 'البحر الأسود', 'بحر إيجه', 'بحر مرمرة'],
    islands_and_straits: ['مضيق البوسفور', 'مضيق الدردنيل', 'جزر الأمراء'],
    provinces_count: 81,
    provinces_label: 'ولاية',
    timezone: 'GMT+3 (توقيت إسطنبول)',
    calling_code: '+90',
    domain_tld: '.tr',
    description_ar: 'ملتقى الحضارات والقارات، وأكبر وجهة سياحية وتجارية واستشفائية مفضلة للمواطنين والمقيمين العرب في المنطقة.',
    terrain: 'هضبة الأناضول الوسطى، سلاسل جبال طوروس والشمال، وسواحل دافئة خصبة.',
    climate: 'معتدل متوسطي على السواحل، محيطي رطب على البحر الأسود، وقاري معتدل في الداخل.',
    natural_resources: ['الفحم', 'خام الحديد', 'النحاس', 'البورون', 'الكروم', 'الأراضي الزراعية والمياه'],
    capital_city: 'أنقرة',
    cities: [
      { id: 601, country_code: 'TR', name_ar: 'إسطنبول', name_en: 'Istanbul', region_name: 'مرمرة', description_ar: 'عاصمة القارتين ومركز المال والأعمال والأزياء والتراث.', cost_index: 48, internet_score: 85, safety_score: 84, weather_score: 85 },
      { id: 602, country_code: 'TR', name_ar: 'طرابزون', name_en: 'Trabzon', region_name: 'البحر الأسود', description_ar: 'عروس الشمال التركي والغابات والأنهار والشلالات الساحرة.', cost_index: 38, internet_score: 80, safety_score: 92, weather_score: 90 },
      { id: 603, country_code: 'TR', name_ar: 'أنطاليا', name_en: 'Antalya', region_name: 'البحر المتوسط', description_ar: 'ريفييرا المنتجعات الشاطئية الفاخرة والطبيعة الخلابة.', cost_index: 45, internet_score: 84, safety_score: 88, weather_score: 92 }
    ],
    landmarks: [
      { name_ar: 'جامع آيا صوفيا ومسجد السلطان أحمد', type: 'تراث وحضارة إسلامية', description_ar: 'تحف معمارية تاريخية تتوسط شبه الجزيرة التاريخية في إسطنبول.' },
      { name_ar: 'مضيق البوسفور وجسوره المعلقة', type: 'معالم طبيعية وبحرية', description_ar: 'الممر المائي العالمي الفاصل والرابط بين آسيا وأوروبا.' },
      { name_ar: 'بحيرة أوزنجول ومرتفعات السلطان مراد', type: 'طبيعة وجبال', description_ar: 'أجمل المرتفعات الخضراء في ريف طرابزون الشمالي.' }
    ],
    visiting_seasons: [
      { season: 'الربيع والصيف والخريف', months: 'أبريل – نوفمبر', climate_description: 'أجواء معتدلة ممتازة للسياحة العائلية والتسوق والتنقل بين المدن.', travel_advisory_note: 'تأشيرة إلكترونية سهلة لمعظم الجنسيات العربية، ودخول بدون تأشيرة لعدة دول خليجية.' }
    ],
    airports: [
      { name_ar: 'مطار إسطنبول الدولي الجديد', code: 'IST', city: 'إسطنبول', international: true },
      { name_ar: 'مطار صبيحة كوكجن الدولي', code: 'SAW', city: 'إسطنبول', international: true },
      { name_ar: 'مطار طرابزون الدولي', code: 'TZX', city: 'طرابزون', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء إسطنبول (غالاطا بورت)', city: 'إسطنبول' },
      { name_ar: 'ميناء مرسين الدولي', city: 'مرسين' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'البلاد آمنة ومفتوحة بالكامل للسياحة والاستثمار، والمطاعم الحلال متوفرة في كل مكان مع انتشار المساجد والتسهيلات للمسافر العربي.',
      source: 'وزارة الثقافة والسياحة التركية',
      verified_at: '2026-09-20'
    },
    gdp_reference: 'نحو 1.1 تريليون دولار أمريكي',
    growth_rate_reference: '4.2%',
    economic_sectors: ['الصناعات التحويلية والسيارات', 'السياحة والضيافة', 'الزراعة والأغذية', 'الإنشاءات والعقارات', 'المنسوجات والملابس'],
    measurement_year: 2025,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'مؤشرات اقتصادية وتجارية مرجعية لتيسير دراسات الجدوى والأعمال للمغتربين والمستثمرين.',
    source_document: 'موسوعة درب الدولية - ملف تركيا الشامل'
  },

  GB: {
    country_code: 'GB',
    name_ar: 'المملكة المتحدة لبريطانيا العظمى وإيرلندا الشمالية',
    name_en: 'United Kingdom',
    capital: 'لندن',
    flag: '🇬🇧',
    currency: 'الجنيه الإسترليني',
    currency_symbol: 'GBP',
    language: 'اللغة الإنجليزية (رسمية)',
    population: '67.8 مليون نسمة',
    area_sq_km: '242,495 كم²',
    location: 'شمال غرب قارة أوروبا، محاطة بالمحيط الأطلسي وبحر الشمال والقناة الإنجليزية.',
    borders: ['جمهورية أيرلندا جنوباً وغرباً'],
    seas_and_oceans: ['المحيط الأطلسي', 'بحر الشمال', 'البحر الأيرلندي', 'بحر المانش (القناة الإنجليزية)'],
    islands_and_straits: ['مضيق دوفر', 'جزيرة وايت', 'جزر هبريدس'],
    provinces_count: 4,
    provinces_label: 'دول اتحادية (إنجلترا، اسكتلندا، ويلز، أيرلندا الشمالية)',
    timezone: 'GMT / BST (توقيت غرينتش)',
    calling_code: '+44',
    domain_tld: '.uk',
    description_ar: 'الوجهة العالمية التاريخية للتعليم العالي، الاستثمار العقاري، والمال والأعمال، وتستضيف أكبر جالية ومصالح خليجية وعربية في أوروبا.',
    terrain: 'تلال منخفضة وسهول خضراء في الجنوب والوسط، وجبال وبحيرات خلابة في اسكتلندا وويلز.',
    climate: 'محيطي معتدل رطب على مدار العام مع تساقط أمطار متكرر وصيف لطيف منعش.',
    natural_resources: ['الغاز الطبيعي والبترول في بحر الشمال', 'الفحم', 'الحجر الجيري', 'الأراضي الزراعية'],
    capital_city: 'لندن',
    cities: [
      { id: 604, country_code: 'GB', name_ar: 'لندن', name_en: 'London', region_name: 'إنجلترا الكبرى', description_ar: 'المركز المالي العالمي ومدينة المتاحف والحدائق الملكية وشارع أكسفورد.', cost_index: 92, internet_score: 95, safety_score: 86, weather_score: 72 },
      { id: 605, country_code: 'GB', name_ar: 'مانشستر', name_en: 'Manchester', region_name: 'شمال غرب إنجلترا', description_ar: 'عاصمة كرة القدم والصناعة والإعلام ومجتمع طلابي عربي بارز.', cost_index: 74, internet_score: 93, safety_score: 82, weather_score: 68 }
    ],
    landmarks: [
      { name_ar: 'ساعة بيغ بن وقصر وستمنستر', type: 'تاريخ وسياسة', description_ar: 'الرمز البريطاني الأيقوني على ضفاف نهر التايمز.' },
      { name_ar: 'قصر باكنغهام وحديقة هايد بارك', type: 'قصور وملكية', description_ar: 'مقر العائلة المالكة وأكبر واحة خضراء وسط لندن.' },
      { name_ar: 'المتحف البريطاني وعين لندن', type: 'ثقافة وترفيه', description_ar: 'أكبر كنوز الحضارات الإنسانية وإطلالة بانورامية على لندن.' }
    ],
    visiting_seasons: [
      { season: 'الصيف والربيع', months: 'مايو – سبتمبر', climate_description: 'أيام طويلة مشمسة معتدلة وفعاليات ثقافية ورياضية حية.', travel_advisory_note: 'نظام التأشيرة الإلكترونية ETA متاح لمواطني دول الخليج العربي بسهولة وسرعة فائقة.' }
    ],
    airports: [
      { name_ar: 'مطار لندن هيثرو الدولي', code: 'LHR', city: 'لندن', international: true },
      { name_ar: 'مطار لندن غاتويك', code: 'LGW', city: 'لندن', international: true },
      { name_ar: 'مطار مانشستر الدولي', code: 'MAN', city: 'مانشستر', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء ساوثهامبتون', city: 'ساوثهامبتون' },
      { name_ar: 'ميناء دوفر', city: 'دوفر' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'استقرار تام، شبكة مواصلات ومترو عصرية فائقة الكفاءة، وخدمات حلال ومراكز إسلامية واسعة في كافة المدن الكبرى.',
      source: 'هيئة السياحة البريطانية VisitBritain',
      verified_at: '2026-09-20'
    },
    gdp_reference: 'نحو 3.4 تريليون دولار أمريكي',
    growth_rate_reference: '1.4%',
    economic_sectors: ['الخدمات المالية والمصرفية', 'التعليم والبحث العلمي', 'التكنولوجيا الحيوية والبرمجيات', 'الصناعات الإبداعية', 'العقارات الفاخرة'],
    measurement_year: 2025,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'بيانات مرجعية لمجالات الأعمال والاستثمار والتعليم العالي.',
    source_document: 'موسوعة درب الدولية - ملف بريطانيا'
  },

  DE: {
    country_code: 'DE',
    name_ar: 'جمهورية ألمانيا الاتحادية',
    name_en: 'Germany',
    capital: 'برلين',
    flag: '🇩🇪',
    currency: 'اليورو',
    currency_symbol: 'EUR',
    language: 'اللغة الألمانية (رسمية)',
    population: '84.4 مليون نسمة',
    area_sq_km: '357,592 كم²',
    location: 'قلب القارة الأوروبية، تتوسط 9 دول أوروبية وتطل على بحري الشمال والبلطيق.',
    borders: ['الدنمارك شمالاً', 'بولندا والتشيك شرقاً', 'النمسا وسويسرا جنوباً', 'فرنسا ولوكسمبورغ وبلجيكا وهولندا غرباً'],
    seas_and_oceans: ['بحر الشمال', 'بحر البلطيق'],
    islands_and_straits: ['جزيرة روغن', 'جزيرة سيلت'],
    provinces_count: 16,
    provinces_label: 'ولاية اتحادية (Bundesland)',
    timezone: 'GMT+1 / GMT+2',
    calling_code: '+49',
    domain_tld: '.de',
    description_ar: 'القوة الاقتصادية والصناعية الأولى في أوروبا، وقبلة السياحة العلاجية العالمية والهندسة الدقيقة والتعليم الجامعي المجاني.',
    terrain: 'سهول منخفضة في الشمال، مرتفعات وهضاب وسطى، وجبال الألب الشامخة في بافاريا جنوباً.',
    climate: 'معتدل بحري إلى قاري مع هطول أمطار منتظم وصيف منعش وشتاء ثلجي في الجنوب.',
    natural_resources: ['الفحم الحجري', 'الغاز الطبيعي', 'النحاس والنيكل', 'الغابات الكثيفة'],
    capital_city: 'برلين',
    cities: [
      { id: 606, country_code: 'DE', name_ar: 'برلين', name_en: 'Berlin', region_name: 'برلين', description_ar: 'عاصمة الابتكار والتاريخ والشركات الناشئة ومتحف برغامون.', cost_index: 76, internet_score: 92, safety_score: 87, weather_score: 75 },
      { id: 607, country_code: 'DE', name_ar: 'ميونخ', name_en: 'Munich', region_name: 'بافاريا', description_ar: 'عاصمة بافاريا ومقر BMW والوجهة العلاجية والعائلية الأولى للعرب.', cost_index: 85, internet_score: 94, safety_score: 94, weather_score: 78 }
    ],
    landmarks: [
      { name_ar: 'بوابة براندنبورغ ومبنى الرايخشتاغ', type: 'تاريخ وسياسة', description_ar: 'رمز الوحدة الألمانية وصرح الديمقراطية العريق في برلين.' },
      { name_ar: 'قصر نويشفانشتاين في بافاريا', type: 'قصور خيالية', description_ar: 'قصر الأحلام الأسطوري وسط جبال الألب الملهم لديزني.' },
      { name_ar: 'ميدان مارين بلاتز ومتحف BMW بميونخ', type: 'تراث وصناعة', description_ar: 'قلب بافاريا التراثي وصرح هندسة السيارات الفاخرة.' }
    ],
    visiting_seasons: [
      { season: 'الصيف والربيع وأسواق الشتاء', months: 'مايو – أكتوبر وديسمبر', climate_description: 'أجواء صيفية رائعة وأسواق شتوية مبهجة في المدن القديمة.', travel_advisory_note: 'تتطلب تأشيرة شنغن الأوروبية (Schengen Visa).' }
    ],
    airports: [
      { name_ar: 'مطار فرانكفورت الدولي', code: 'FRA', city: 'فرانكفورت', international: true },
      { name_ar: 'مطار ميونخ الدولي', code: 'MUC', city: 'ميونخ', international: true },
      { name_ar: 'مطار برلين براندنبورغ', code: 'BER', city: 'برلين', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء هامبورغ العالمي', city: 'هامبورغ' },
      { name_ar: 'ميناء بريمن', city: 'بريمن' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'أمان كامل ونظام صحي متطور للغاية ومستشفيات معتمدة لخدمة المرضى والمرافقين من دول الخليج والوطن العربي.',
      source: 'الهيئة الوطنية للسياحة الألمانية DZT',
      verified_at: '2026-09-20'
    },
    gdp_reference: 'نحو 4.5 تريليون دولار أمريكي (الأول أوروبياً)',
    growth_rate_reference: '1.2%',
    economic_sectors: ['صناعة السيارات والآلات الدقيقة', 'الصناعات الكيميائية والدوائية', 'الطاقة المتجددة والكهربائية', 'التقنيات الطبية'],
    measurement_year: 2025,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'مؤشرات اقتصادية للمشاريع الهندسية والتعاون الصناعي والاستشفائي.',
    source_document: 'موسوعة درب الدولية - ملف ألمانيا'
  },

  FR: {
    country_code: 'FR',
    name_ar: 'الجمهورية الفرنسية',
    name_en: 'France',
    capital: 'باريس',
    flag: '🇫🇷',
    currency: 'اليورو',
    currency_symbol: 'EUR',
    language: 'اللغة الفرنسية (رسمية)',
    population: '68.2 مليون نسمة',
    area_sq_km: '551,695 كم²',
    location: 'غرب أوروبا، تطل على المحيط الأطلسي والبحر الأبيض المتوسط وبحر المانش.',
    borders: ['إسبانيا وأندورا جنوباً', 'إيطاليا وسويسرا وألمانيا شرقاً', 'بلجيكا ولوكسمبورغ شمال شرق'],
    seas_and_oceans: ['البحر الأبيض المتوسط', 'المحيط الأطلسي', 'بحر المانش'],
    islands_and_straits: ['جزيرة كورسيكا', 'مضيق كاليه'],
    provinces_count: 18,
    provinces_label: 'منطقة إدارية (Région)',
    timezone: 'GMT+1 / GMT+2',
    calling_code: '+33',
    domain_tld: '.fr',
    description_ar: 'الوجهة السياحية الأكثر استقطاباً للزوار في العالم، عاصمة الفنون والموضة الفاخرة والمعالم التاريخية والريفييرا الساحلية المشمسة.',
    terrain: 'سهول زراعية ممتدة في الشمال، جبال الألب الشاهقة والبيرينيه، وسواحل المتوسط الخلابة.',
    climate: 'محيطي في الغرب، قاري في الشرق، ومتوسطي مشمس دافئ في الجنوب.',
    natural_resources: ['اليورانيوم', 'خام الحديد', 'البوكسيت', 'الأراضي الزراعية والمياه المعدنية'],
    capital_city: 'باريس',
    cities: [
      { id: 608, country_code: 'FR', name_ar: 'باريس', name_en: 'Paris', region_name: 'إيل دو فرانس', description_ar: 'مدينة النور ومتحف اللوفر وبرج إيفل وعاصمة الموضة.', cost_index: 88, internet_score: 92, safety_score: 80, weather_score: 78 },
      { id: 609, country_code: 'FR', name_ar: 'نيس', name_en: 'Nice', region_name: 'كوت دازور', description_ar: 'ملكة الريفييرا الفرنسية وممشى الإنجليز والشواطئ الفيروزية.', cost_index: 82, internet_score: 90, safety_score: 85, weather_score: 92 }
    ],
    landmarks: [
      { name_ar: 'برج إيفل وساحة التروكاديرو', type: 'هندسة ومعالم أيقونية', description_ar: 'أشهر رمز معماري في العالم وإطلالة على معالم باريس.' },
      { name_ar: 'متحف اللوفر وقصر فرساي', type: 'تراث وفنون ملكية', description_ar: 'أكبر متحف للفنون وقصر الملوك التاريخي بحدائقه النادرة.' },
      { name_ar: 'شارع الشانزليزيه وقوس النصر', type: 'تسوق وتاريخ', description_ar: 'أفخم جادات التسوق والمطاعم والأزياء العالمية.' }
    ],
    visiting_seasons: [
      { season: 'الربيع والصيف والخريف', months: 'أبريل – أكتوبر', climate_description: 'أجواء مشمسة ومهرجانات ثقافية وسياحة شاطئية في الجنوب.', travel_advisory_note: 'دخول بموجب تأشيرة شنغن الأوروبية الموحدة.' }
    ],
    airports: [
      { name_ar: 'مطار باريس شارل ديغول الدولي', code: 'CDG', city: 'باريس', international: true },
      { name_ar: 'مطار باريس أورلي', code: 'ORY', city: 'باريس', international: true },
      { name_ar: 'مطار نيس كوت دازور الدولي', code: 'NCE', city: 'نيس', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء مارسيليا الكبير', city: 'مارسيليا' },
      { name_ar: 'ميناء لوهافر', city: 'لوهافر' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'تأهب سياحي منظم، توفر الفنادق العالمية، والمطاعم العربية والمغاربية والحلال منتشرة بكثافة.',
      source: 'وكالة تنمية السياحة الفرنسية Atout France',
      verified_at: '2026-09-20'
    },
    gdp_reference: 'نحو 3.1 تريليون دولار أمريكي',
    growth_rate_reference: '1.3%',
    economic_sectors: ['الأزياء الفاخرة ومستحضرات التجميل', 'الطيران والفضاء (Airbus)', 'السياحة والضيافة', 'الزراعة والأغذية الفاخرة', 'الخدمات المصرفية'],
    measurement_year: 2025,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'بيانات مرجعية لقطاعات السياحة والاستثمار والتجارة الدولية.',
    source_document: 'موسوعة درب الدولية - ملف فرنسا'
  },

  IT: {
    country_code: 'IT',
    name_ar: 'الجمهورية الإيطالية',
    name_en: 'Italy',
    capital: 'روما',
    flag: '🇮🇹',
    currency: 'اليورو',
    currency_symbol: 'EUR',
    language: 'اللغة الإيطالية (رسمية)',
    population: '58.8 مليون نسمة',
    area_sq_km: '301,340 كم²',
    location: 'شبه جزيرة تخترق قلب البحر الأبيض المتوسط جنوب قارة أوروبا على شكل الحذاء الشهير.',
    borders: ['فرنسا وسويسرا والنمسا وسلوفينيا شمالاً', 'سان مارينو والفاتيكان كجيوب داخلية'],
    seas_and_oceans: ['البحر الأبيض المتوسط', 'البحر الأدرياتيكي', 'البحر التيراني', 'البحر الأيوني'],
    islands_and_straits: ['جزيرة صقلية', 'جزيرة سردينيا', 'مضيق ميسينا'],
    provinces_count: 20,
    provinces_label: 'إقليم (Regione)',
    timezone: 'GMT+1 / GMT+2',
    calling_code: '+39',
    domain_tld: '.it',
    description_ar: 'متحف التاريخ المفتوح وموطن الفنون الإنسانية وروائع عصر النهضة وعاصمة التصميم والموضة والطهي الرفيع.',
    terrain: 'جبال الألب الشاهقة شمالاً، وسلسلة جبال الأبينين الممتدة على طول شبه الجزيرة، وسواحل بديعة.',
    climate: 'متوسطي كلاسيكي مشمس دافئ صيفاً ومعتدل شتاءً مع ثلوج على جبال الألب الشمالية.',
    natural_resources: ['الرخام الأبيض (كرارا)', 'الغاز الطبيعي', 'الأراضي الزراعية وبساتين الزيتون والليمون'],
    capital_city: 'روما',
    cities: [
      { id: 610, country_code: 'IT', name_ar: 'روما', name_en: 'Rome', region_name: 'لاتسيو', description_ar: 'المدينة الخالدة ومدرج الكولوسيوم ونافورة تريفي ودولة الفاتيكان.', cost_index: 76, internet_score: 88, safety_score: 82, weather_score: 88 },
      { id: 611, country_code: 'IT', name_ar: 'ميلانو', name_en: 'Milan', region_name: 'لومبارديا', description_ar: 'عاصمة الموضة والاقتصاد ودومو ميلانو وبوابة بحيرات الشمال.', cost_index: 84, internet_score: 93, safety_score: 84, weather_score: 80 }
    ],
    landmarks: [
      { name_ar: 'مدرج الكولوسيوم والمنتدى الروماني', type: 'آثار عالمية', description_ar: 'أكبر مدرج روماني تاريخي في العالم وأحد عجائب الدنيا السبع الجديدة.' },
      { name_ar: 'كاتدرائية دومو ميلانو وغاليريا فيتوريو', type: 'عمارة قوطية وأزياء', description_ar: 'تحفة الرخام الأبيض الفاخرة ومركز التسوق الأقدم في العالم.' },
      { name_ar: 'مدينة البندقية (فينيسيا) وقنواتها', type: 'تراث رومانسي عائم', description_ar: 'المدينة العائمة الفريدة وقوارب الجندول وقصر الدوق.' }
    ],
    visiting_seasons: [
      { season: 'الربيع والصيف والخريف', months: 'أبريل – نوفمبر', climate_description: 'أجواء دافئة مبهجة للتنزه بين المتاحف والبحيرات والآثار.', travel_advisory_note: 'تأشيرة شنغن الأوروبية مطلوبة لمواطني الدول التي لا تشملها الإعفاءات.' }
    ],
    airports: [
      { name_ar: 'مطار روما فيوميتشينو (ليوناردو دا فينشي)', code: 'FCO', city: 'روما', international: true },
      { name_ar: 'مطار ميلانو مالبينسا', code: 'MXP', city: 'ميلانو', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء جنوى', city: 'جنوى' },
      { name_ar: 'ميناء نابولي', city: 'نابولي' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'بلد سياحي مرحب، ويجب الانتباه للمقتنيات الشخصية في محطات القطارات والأماكن المزدحمة.',
      source: 'وزارة السياحة الإيطالية ENIT',
      verified_at: '2026-09-20'
    },
    gdp_reference: 'نحو 2.3 تريليون دولار أمريكي',
    growth_rate_reference: '1.0%',
    economic_sectors: ['صناعة السيارات الفاخرة (فيراري ولمبورغيني)', 'الأزياء والمنتجات الجلدية', 'الآلات الصناعية المتطورة', 'السياحة والأغذية الإيطالية'],
    measurement_year: 2025,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'مؤشرات مرجعية لدراسات السياحة والتجارة البينية.',
    source_document: 'موسوعة درب الدولية - ملف إيطاليا'
  },

  ES: {
    country_code: 'ES',
    name_ar: 'مملكة إسبانيا',
    name_en: 'Spain',
    capital: 'مدريد',
    flag: '🇪🇸',
    currency: 'اليورو',
    currency_symbol: 'EUR',
    language: 'اللغة الإسبانية (رسمية)',
    population: '48.3 مليون نسمة',
    area_sq_km: '505,990 كم²',
    location: 'جنوب غرب أوروبا في شبه الجزيرة الأيبيرية وتطل على المحيط الأطلسي والبحر الأبيض المتوسط.',
    borders: ['فرنسا وأندورا شمالاً', 'البرتغال غرباً', 'جبل طارق جنوباً ومضيق جبل طارق قبالة المغرب'],
    seas_and_oceans: ['البحر الأبيض المتوسط', 'المحيط الأطلسي', 'خليج بسكاي'],
    islands_and_straits: ['جزر البليار (مايوركا وإيبيزا)', 'جزر الكناري', 'مضيق جبل طارق'],
    provinces_count: 17,
    provinces_label: 'منطقة حكم ذاتي (Comunidad Autónoma)',
    timezone: 'GMT+1 / GMT+2',
    calling_code: '+34',
    domain_tld: '.es',
    description_ar: 'بلاد الأندلس الساحرة وعمارة الحمراء الإسلامية الخالدة، ملتقى الشواطئ المشمسة والفنون الحديثة والرياضة العالمية.',
    terrain: 'هضبة الميسيتا الوسطى المحاطة بسلاسل جبال، وسواحل ممتدة وشواطئ دافئة.',
    climate: 'متوسطي حار وجاف صيفاً ومعتدل شتاءً مع رطوبة في الشمال وجفاف في الجنوب.',
    natural_resources: ['خام الحديد', 'النحاس', 'الرصاص والزنك', 'زيت الزيتون والفواكه والأراضي الزراعية'],
    capital_city: 'مدريد',
    cities: [
      { id: 612, country_code: 'ES', name_ar: 'مدريد', name_en: 'Madrid', region_name: 'مدريد', description_ar: 'العاصمة الملكية ومتحف البرادو وحديقة الريتيرو والسانتياغو برنابيو.', cost_index: 73, internet_score: 94, safety_score: 90, weather_score: 86 },
      { id: 613, country_code: 'ES', name_ar: 'برشلونة', name_en: 'Barcelona', region_name: 'كتالونيا', description_ar: 'ساغرادا فاميليا وحديقة غويل وشواطئ المتوسط وشارع الرامبلا.', cost_index: 75, internet_score: 94, safety_score: 82, weather_score: 90 },
      { id: 614, country_code: 'ES', name_ar: 'غرناطة', name_en: 'Granada', region_name: 'الأندلس', description_ar: 'درة الأندلس وموطن قصر الحمراء وجنة العريف وحي البيازين.', cost_index: 52, internet_score: 89, safety_score: 92, weather_score: 88 }
    ],
    landmarks: [
      { name_ar: 'قصر الحمراء وجنة العريف بغرناطة', type: 'تراث وحضارة إسلامية أندلسية', description_ar: 'قمة الإبداع المعماري الإسلامي الأندلسي وأهم معالم إسبانيا التاريخية.' },
      { name_ar: 'كنيسة ساغرادا فاميليا ببرشلونة', type: 'عمارة سريالية حداثية', description_ar: 'تحفة العبقري أنطوني غاودي المصنفة في التراث الإنساني لليونسكو.' },
      { name_ar: 'القصر الملكي وساحة بلازا مايور بمدريد', type: 'قصور وتاريخ إسباني', description_ar: 'أكبر القصور الملكية في غرب أوروبا وساحات العاصمة النابضة.' }
    ],
    visiting_seasons: [
      { season: 'الربيع والخريف والصيف', months: 'مارس – نوفمبر', climate_description: 'شمس مشرقة وطقس معتدل مثالي لزيارة الأندلس ومدريد وبرشلونة.', travel_advisory_note: 'تأشيرة شنغن الأوروبية تتيح التنقل المباشر.' }
    ],
    airports: [
      { name_ar: 'مطار مدريد باراخاس الدولي (أدولفو سواريز)', code: 'MAD', city: 'مدريد', international: true },
      { name_ar: 'مطار برشلونة إل برات الدولي', code: 'BCN', city: 'برشلونة', international: true },
      { name_ar: 'مطار مالقة - كوستا ديل سول', code: 'AGP', city: 'مالقة', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء برشلونة', city: 'برشلونة' },
      { name_ar: 'ميناء الجزيرة الخضراء (ألخسيراس)', city: 'قادس' },
      { name_ar: 'ميناء بلنسية', city: 'بلنسية' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'بيئة سياحية ودودة وآمنة، وتوفر واسع للأطعمة الحلال والروابط الثقافية العميقة مع العالم العربي.',
      source: 'المعهد الإسباني للسياحة Turespaña',
      verified_at: '2026-09-20'
    },
    gdp_reference: 'نحو 1.6 تريليون دولار أمريكي',
    growth_rate_reference: '2.4%',
    economic_sectors: ['السياحة الدولية والضيافة', 'السيارات ومكوناتها', 'الطاقة المتجددة وطاقة الرياح', 'الزراعة وزيت الزيتون الإسباني الفاخر'],
    measurement_year: 2025,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'مؤشرات اقتصادية وتجارية وسياحية مرجعية.',
    source_document: 'موسوعة درب الدولية - ملف إسبانيا'
  },

  CH: {
    country_code: 'CH',
    name_ar: 'الاتحاد السويسري',
    name_en: 'Switzerland',
    capital: 'بيرن',
    flag: '🇨🇭',
    currency: 'الفرنك السويسري',
    currency_symbol: 'CHF',
    language: 'الألمانية، الفرنسية، الإيطالية، والرومانشية (رسمية)',
    population: '8.9 مليون نسمة',
    area_sq_km: '41,285 كم²',
    location: 'قلب جبال الألب في وسط غرب أوروبا، تتوسط فرنسا وألمانيا وإيطاليا والنمسا.',
    borders: ['ألمانيا شمالاً', 'فرنسا غرباً', 'إيطاليا جنوباً', 'النمسا وليختنشتاين شرقاً'],
    seas_and_oceans: ['بلد حبيس تحيط به بحيرات جبال الألب الكبرى (بحيرة ليمان، بحيرة زيورخ، بحيرة لوسيرن)'],
    islands_and_straits: ['ممر غوتهارد الجبلي', 'قمم يونغفراو وماترهورن'],
    provinces_count: 26,
    provinces_label: 'كانتون (Canton)',
    timezone: 'GMT+1 / GMT+2',
    calling_code: '+41',
    domain_tld: '.ch',
    description_ar: 'موطن الدقة والأمان المطلق والطبيعة الألبية الفردوسية، والمركز المالي والدبلوماسي العالمي الأول لإدارة الثروات والساعات الفاخرة.',
    terrain: 'جبال الألب الشاهقة تغطي 60% من البلاد، الهضبة السويسرية، وجبال جورا الشمالية.',
    climate: 'معتدل ألبوي منعش صيفاً وبارد مثلج شتاءً مع هواء نقي ومياه ينابيع عذبة.',
    natural_resources: ['الطاقة الكهرومائية', 'الغابات', 'الملح', 'الأراضي الرعوية والبحيرات العذبة'],
    capital_city: 'بيرن',
    cities: [
      { id: 615, country_code: 'CH', name_ar: 'زيورخ', name_en: 'Zurich', region_name: 'كانتون زيورخ', description_ar: 'العاصمة المالية وإدارة الثروات وشارع بانهوف شتراسه والبحيرة.', cost_index: 98, internet_score: 98, safety_score: 98, weather_score: 80 },
      { id: 616, country_code: 'CH', name_ar: 'جنيف', name_en: 'Geneva', region_name: 'كانتون جنيف', description_ar: 'عاصمة السلام الدولية ومقر الأمم المتحدة ونافورة جنيف وبحيرة ليمان.', cost_index: 97, internet_score: 97, safety_score: 96, weather_score: 79 }
    ],
    landmarks: [
      { name_ar: 'قمم جبال الألب ويونغفراو وماترهورن', type: 'قمم ثلجية وطبيعة', description_ar: 'أعلى محطة قطارات في أوروبا وإطلالة ألبية جليدية فريدة.' },
      { name_ar: 'نافورة جنيف وبحيرة ليمان', type: 'معالم بحرية أيقونية', description_ar: 'أشهر نافورة مياه في العالم تضخ المياه بارتفاع 140 متراً.' },
      { name_ar: 'شارع بانهوف شتراسه بزيورخ', type: 'تسوق فاخر ومصارف', description_ar: 'أرقى شوارع الساعات الفاخرة والمصارف الخاصة في العالم.' }
    ],
    visiting_seasons: [
      { season: 'الصيف والشتاء', months: 'يونيو – سبتمبر وديسمبر – مارس', climate_description: 'طبيعة خضراء وشلالات صيفاً وتزلج شتوي فاخر.', travel_advisory_note: 'سويسرا عضو في اتفاقية شنغن وتسمح بالدخول بتأشيرة شنغن.' }
    ],
    airports: [
      { name_ar: 'مطار زيورخ الدولي', code: 'ZRH', city: 'زيورخ', international: true },
      { name_ar: 'مطار جنيف الدولي', code: 'GVA', city: 'جنيف', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء بازل النهري على الراين', city: 'بازل' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'أعلى مستويات الأمان والنظافة في العالم، وخدمات راقية مصممة خصيصاً للعائلات الخليجية والعربية.',
      source: 'هيئة السياحة السويسرية Switzerland Tourism',
      verified_at: '2026-09-20'
    },
    gdp_reference: 'نحو 900 مليار دولار أمريكي (أعلى دخل فرد بالعالم)',
    growth_rate_reference: '1.5%',
    economic_sectors: ['المصارف الخاصة وإدارة الأصول', 'صناعة الساعات الفاخرة (Rolex / Patek Philippe)', 'الصناعات الدوائية والبيوتكنولوجية (Novartis / Roche)', 'التأمين وإعادة التأمين'],
    measurement_year: 2025,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'مؤشرات مرجعية للقطاعات المصرفية والاستثمارية.',
    source_document: 'موسوعة درب الدولية - ملف سويسرا'
  },

  AT: {
    country_code: 'AT',
    name_ar: 'جمهورية النمسا',
    name_en: 'Austria',
    capital: 'فيينا',
    flag: '🇦🇹',
    currency: 'اليورو',
    currency_symbol: 'EUR',
    language: 'اللغة الألمانية (رسمية)',
    population: '9.1 مليون نسمة',
    area_sq_km: '83,879 كم²',
    location: 'وسط قارة أوروبا في قلب جبال الألب وعلى ضفاف نهر الدانوب.',
    borders: ['ألمانيا والتشيك شمالاً', 'سلوفاكيا والمجر شرقاً', 'سلوفينيا وإيطاليا جنوباً', 'سويسرا وليختنشتاين غرباً'],
    seas_and_oceans: ['بلد حبيس يمر به نهر الدانوب الدولي وبحيرات سالزبورغ وتيرول الساحرة'],
    islands_and_straits: ['بحيرة زيلامسي الشهيرة', 'بحيرة ولفغانغ'],
    provinces_count: 9,
    provinces_label: 'ولاية اتحادية (Bundesland)',
    timezone: 'GMT+1 / GMT+2',
    calling_code: '+43',
    domain_tld: '.at',
    description_ar: 'عاصمة الفخامة والقصور الإمبراطورية والموسيقى الكلاسيكية، وموطن زيلامسي وبحيراتها المفضلة لدى العائلات الخليجية.',
    terrain: 'جبال الألب تغطي ثلثي مساحة الدولة، مع تلال وسهول نهر الدانوب الخصيبة.',
    climate: 'معتدل ألبوي وقاري منعش صيفاً ومثلج شتاءً مع بحيرات صالحة للسباحة صيفاً.',
    natural_resources: ['النفط والغاز', 'الحجر الجيري والحديد', 'الطاقة الكهرومائية', 'الغابات الشاسعة'],
    capital_city: 'فيينا',
    cities: [
      { id: 617, country_code: 'AT', name_ar: 'فيينا', name_en: 'Vienna', region_name: 'فيينا', description_ar: 'عاصمة القصور الإمبراطورية والمقاهي الكلاسيكية وأفضل مدينة للمعيشة في العالم.', cost_index: 80, internet_score: 95, safety_score: 96, weather_score: 82 }
    ],
    landmarks: [
      { name_ar: 'قصر شونبرون الإمبراطوري', type: 'قصور وتاريخ الهابسبورغ', description_ar: 'مقر إقامة الأباطرة التاريخي بحدائقه الباروكية وحديقة الحيوان الأقدم بالعالم.' },
      { name_ar: 'بحيرة زيلامسي وقرية كابرون الثلجية', type: 'طبيعة وبحيرات وجبال', description_ar: 'المقصد السياحي الطبيعي الأول للمسافرين العرب وعائلاتهم في الصيف.' },
      { name_ar: 'كاتدرائية سانت ستيفان وشارع غرابن', type: 'عمارة قوطية وتسوق', description_ar: 'قلب فيينا التاريخي ومركز الأناقة والمشي والفعاليات.' }
    ],
    visiting_seasons: [
      { season: 'الصيف والشتاء', months: 'مايو – سبتمبر وديسمبر', climate_description: 'صيف لطيف جداً للتنزه حول البحيرات وأسواق شتاء مميزة.', travel_advisory_note: 'تأشيرة شنغن الأوروبية سارية المفعول للدخول.' }
    ],
    airports: [
      { name_ar: 'مطار فيينا الدولي (شفيخات)', code: 'VIE', city: 'فيينا', international: true },
      { name_ar: 'مطار سالزبورغ الدولي', code: 'SZG', city: 'سالزبورغ', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء فيينا النهري على الدانوب', city: 'فيينا' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'تصنف كأكثر دول العالم استقراراً وأماناً، والخدمات الموجهة للسياحة الخليجية متطورة للغاية في فيينا وزيلامسي.',
      source: 'المكتب الوطني النمساوي للسياحة Österreich Werbung',
      verified_at: '2026-09-20'
    },
    gdp_reference: 'نحو 520 مليار دولار أمريكي',
    growth_rate_reference: '1.2%',
    economic_sectors: ['السياحة الراقية والمؤتمرات الدولية', 'الآلات والتكنولوجيا الهندسية', 'صناعة السيارات المتخصصة', 'الخدمات المصرفية الإقليمية'],
    measurement_year: 2025,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'مؤشرات مرجعية للقطاعات السياحية والتجارية.',
    source_document: 'موسوعة درب الدولية - ملف النمسا'
  },

  NL: {
    country_code: 'NL',
    name_ar: 'مملكة هولندا',
    name_en: 'Netherlands',
    capital: 'أمستردام',
    flag: '🇳🇱',
    currency: 'اليورو',
    currency_symbol: 'EUR',
    language: 'اللغة الهولندية (رسمية)',
    population: '17.9 مليون نسمة',
    area_sq_km: '41,543 كم²',
    location: 'شمال غرب أوروبا، تطل على بحر الشمال، ويقع جزء كبير من أراضيها تحت مستوى سطح البحر.',
    borders: ['ألمانيا شرقاً', 'بلجيكا جنوباً'],
    seas_and_oceans: ['بحر الشمال'],
    islands_and_straits: ['جزر فريزيا الغربية'],
    provinces_count: 12,
    provinces_label: 'مقاطعة (Provincie)',
    timezone: 'GMT+1 / GMT+2',
    calling_code: '+31',
    domain_tld: '.nl',
    description_ar: 'بلاد قنوات المياه التاريخية والتوليب وطواحين الهواء والابتكار الزراعي والتقني وميناء روتردام الأضخم في أوروبا.',
    terrain: 'أراضٍ منخفضة مستوية ومستصلحة من البحر عبر سدود عملاقة وقنوات مائية.',
    climate: 'محيطي معتدل رطب مع صيف منعش ورياح بحرية عليلة.',
    natural_resources: ['الغاز الطبيعي', 'الأراضي الزراعية الفائقة الخصوبة والإنتاجية', 'الرمال والحصى'],
    capital_city: 'أمستردام',
    cities: [
      { id: 618, country_code: 'NL', name_ar: 'أمستردام', name_en: 'Amsterdam', region_name: 'شمال هولندا', description_ar: 'مدينة القنوات ومتحف ريجكس وفان غوخ وثقافة الدراجات الهوائية.', cost_index: 85, internet_score: 96, safety_score: 92, weather_score: 75 }
    ],
    landmarks: [
      { name_ar: 'حزام قنوات أمستردام التاريخية', type: 'تراث يونسكو مائي', description_ar: 'شبكة قنوات مائية عمرها 400 عام وجسور حجرية وبيوت قروسطية أنيقة.' },
      { name_ar: 'حديقة كيوكنهوف وحقول التوليب', type: 'حدائق وزهور عالمية', description_ar: 'أكبر حديقة زهور في العالم بملايين زهور التوليب الملونة.' },
      { name_ar: 'قرية خيثورن (فينيسيا هولندا)', type: 'قرى مائية ساحرة', description_ar: 'قرية هادئة بلا سيارات تنتقل فيها بالقوارب بين الجسور الخشبية.' }
    ],
    visiting_seasons: [
      { season: 'الربيع والصيف', months: 'أبريل – سبتمبر', climate_description: 'تفتح أزهار التوليب وطقس رائع لجولات القوارب والدراجات.', travel_advisory_note: 'دخول بموجب تأشيرة شنغن الأوروبية.' }
    ],
    airports: [
      { name_ar: 'مطار أمستردام شيفول الدولي', code: 'AMS', city: 'أمستردام', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء روتردام العالمي (الأكبر أوروبياً)', city: 'روتردام' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'بلد مستقر ومتطور تقنياً بالكامل، وتعتبر اللغة الإنجليزية متحدثة بطلاقة من أكثر من 90% من السكان.',
      source: 'هيئة السياحة الهولندية NBTC',
      verified_at: '2026-09-20'
    },
    gdp_reference: 'نحو 1.1 تريليون دولار أمريكي',
    growth_rate_reference: '1.6%',
    economic_sectors: ['التجارة واللوجستيات والموانئ', 'الزراعة التكنولوجية المتقدمة والتصدير الغذائي', 'صناعة أشباه الموصلات (ASML العالمية)', 'التقنيات المالية الرقمية'],
    measurement_year: 2025,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'مؤشرات مرجعية للشحن الدولي والتقنية.',
    source_document: 'موسوعة درب الدولية - ملف هولندا'
  },

  GE: {
    country_code: 'GE',
    name_ar: 'جمهورية جورجيا',
    name_en: 'Georgia',
    capital: 'تبليسي',
    flag: '🇬🇪',
    currency: 'اللاري الجورجي',
    currency_symbol: 'GEL',
    language: 'اللغة الجورجية (رسمية)',
    population: '3.7 مليون نسمة',
    area_sq_km: '69,700 كم²',
    location: 'منطقة القوقاز عند نقطة التقاء شرق أوروبا بغرب آسيا، على الساحل الشرقي للبحر الأسود.',
    borders: ['روسيا شمالاً', 'أذربيجان شرقاً', 'أرمينيا وتركيا جنوباً'],
    seas_and_oceans: ['البحر الأسود غرباً'],
    islands_and_straits: ['سواحل باتومي شبه الاستوائية'],
    provinces_count: 9,
    provinces_label: 'إقليم (Mkhare)',
    timezone: 'GMT+4',
    calling_code: '+995',
    domain_tld: '.ge',
    description_ar: 'وجهة الطبيعة القوقازية الأسهل دخولاً والأسرع نمواً للسياح والمستثمرين العرب بفضل الإعفاء المباشر من التأشيرة وتكاليف المعيشة التنافسية.',
    terrain: 'سلاسل جبال القوقاز الكبرى الشاهقة، أودية وأنهار سريعة الجريان، وسواحل دافئة في باتومي.',
    climate: 'متوسطي رطب في الساحل الغربي، ومعتدل قاري جاف وصحي في الوسط والشرق.',
    natural_resources: ['الغابات الكثيفة', 'المياه المعدنية والينابيع الكبريتية', 'النحاس والمنغنيز', 'الطاقة الكهرومائية'],
    capital_city: 'تبليسي',
    cities: [
      { id: 619, country_code: 'GE', name_ar: 'تبليسي', name_en: 'Tbilisi', region_name: 'كارتلي', description_ar: 'العاصمة القديمة وقلعة ناريكالا والحمامات الكبريتية وجسر السلام.', cost_index: 38, internet_score: 85, safety_score: 95, weather_score: 88 }
    ],
    landmarks: [
      { name_ar: 'قلعة ناريكالا والتلفريك وتبليسي القديمة', type: 'تاريخ وحصون', description_ar: 'إطلالة بانورامية ساحرة على العاصمة ونهر كورا والحمامات الكبريتية.' },
      { name_ar: 'جبال كازبيجي وكنيسة جيرجيتي الأيقونية', type: 'طبيعة وجبال قوقازية', description_ar: 'أشهر بطاقة بريدية لجورجيا أمام قمة جبل كازبيك الثلجي الشاهق.' },
      { name_ar: 'ممشى باتومي وبوليفارد البحر الأسود', type: 'شواطئ ونوافير راقصة', description_ar: 'ريفييرا البحر الأسود بأبراجها الحديثة وتمثال علي ونينو المتحرك.' }
    ],
    visiting_seasons: [
      { season: 'الربيع والصيف والخريف والشتاء', months: 'على مدار العام', climate_description: 'طبيعة خضراء وأنهار صيفاً وتزلج شتوي في جوداوري وبكورياني.', travel_advisory_note: 'دخول بدون تأشيرة أو بتأشيرة إلكترونية ميسرة لمعظم المواطنين والمقيمين بدول الخليج.' }
    ],
    airports: [
      { name_ar: 'مطار تبليسي الدولي (شوتا روستافيلي)', code: 'TBS', city: 'تبليسي', international: true },
      { name_ar: 'مطار باتومي الدولي', code: 'BUS', city: 'باتومي', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء باتومي', city: 'باتومي' },
      { name_ar: 'ميناء بوتي', city: 'بوتي' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'تصنف بين أكثر دول العالم أماناً للسياح والعائلات، وتنتشر المطاعم الحلال والعربية بكثافة في تبليسي وباتومي.',
      source: 'إدارة السياحة الوطنية الجورجية GNTA',
      verified_at: '2026-09-20'
    },
    gdp_reference: 'نحو 32 مليار دولار أمريكي',
    growth_rate_reference: '6.8% (نمو متسارع)',
    economic_sectors: ['السياحة والضيافة', 'العقارات والاستثمار الأجنبي', 'اللوجستيات وتجارة الترانزيت', 'الزراعة والمياه المعدنية الجورجية (بورجومي)'],
    measurement_year: 2025,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'مؤشرات استثمارية وتجارية وسياحية.',
    source_document: 'موسوعة درب الدولية - ملف جورجيا'
  },

  BA: {
    country_code: 'BA',
    name_ar: 'البوسنة والهرسك',
    name_en: 'Bosnia and Herzegovina',
    capital: 'سراييفو',
    flag: '🇧🇦',
    currency: 'المارك البوسني القابل للتحويل',
    currency_symbol: 'BAM',
    language: 'البوسنية، الكرواتية، والصربية (رسمية)',
    population: '3.2 مليون نسمة',
    area_sq_km: '51,209 كم²',
    location: 'جنوب شرق أوروبا في شبه جزيرة البلقان، تتوسط كرواتيا وصربيا والجبل الأسود.',
    borders: ['كرواتيا شمالاً وغرباً', 'صربيا شرقاً', 'الجبل الأسود جنوب شرق'],
    seas_and_oceans: ['منفذ بحري ساحلي بطول 20 كم على البحر الأدرياتيكي عند مدينة نيوم'],
    islands_and_straits: ['أنهار نيريتفا وبونا ودرينيا وشلالات كرافيتسا'],
    provinces_count: 2,
    provinces_label: 'كيانان اتحاديان (اتحاد البوسنة والهرسك + جمهورية صربسكا)',
    timezone: 'GMT+1 / GMT+2',
    calling_code: '+387',
    domain_tld: '.ba',
    description_ar: 'قلب الإسلام في أوروبا وأرض المساجد العثمانية والطبيعة الفردوسية الخضراء والأنهار العذبة والشلالات، والمقصد العائلي المفضل للمسلمين.',
    terrain: 'جبال الألب الدينارية الخضراء المكسوة بالغابات، أودية عميقة، وأنهار جبلية كريستالية نقية.',
    climate: 'معتدل قاري منعش وممطر صيفاً ومثلج شتاءً مع مناخ متوسطي دافئ في إقليم الهرسك.',
    natural_resources: ['الفحم وخام الحديد', 'البوكسيت', 'الطاقة الكهرومائية', 'الغابات الخشبية والينابيع العذبة'],
    capital_city: 'سراييفو',
    cities: [
      { id: 620, country_code: 'BA', name_ar: 'سراييفو', name_en: 'Sarajevo', region_name: 'كانتون سراييفو', description_ar: 'قدس أوروبا وسوق باشتشارشيا وجامع غازي خسرو بك وتلفريك تريبيفيتش.', cost_index: 36, internet_score: 82, safety_score: 93, weather_score: 85 }
    ],
    landmarks: [
      { name_ar: 'سوق باشتشارشيا التاريخي وسبيل الماء', type: 'تراث وحضارة عثمانية إسلامية', description_ar: 'قلب سراييفو العثماني العريق بأزقته ومحلات النحاسين والمساجد الأثرية.' },
      { name_ar: 'الجسر القديم في موستار (ستاري موست)', type: 'تراث عالمي لليونسكو', description_ar: 'الجسر الحجري المقوس الأيقوني فوق مياه نهر نيريتفا الفيروزية.' },
      { name_ar: 'شلالات كرافيتسا ونبع فريلو بوسنة', type: 'شلالات وينابيع مائية ساحرة', description_ar: 'شلالات طبيعية مذهلة وينابيع مياه تتدفق وسط أحضان الطبيعة.' }
    ],
    visiting_seasons: [
      { season: 'الربيع والصيف والخريف', months: 'مايو – أكتوبر', climate_description: 'أجواء ربيعية وصيفية عليلة وخضرة ممتدة وشلالات متدفقة.', travel_advisory_note: 'إعفاء من التأشيرة أو تأشيرات إلكترونية ميسرة لمعظم الدول العربية والخليجية.' }
    ],
    airports: [
      { name_ar: 'مطار سراييفو الدولي', code: 'SJJ', city: 'سراييفو', international: true },
      { name_ar: 'مطار توزلا الدولي', code: 'TZL', city: 'توزلا', international: true }
    ],
    seaports: [
      { name_ar: 'ميناء نيوم الساحلي', city: 'نيوم' }
    ],
    travel_security_alert: {
      level: 'normal',
      text_ar: 'بيئة إسلامية وأخوية دافئة ومرحبة جداً بالعرب، وجميع الأطعمة واللحوم حلال 100% مع انتشار المساجد وسماع الأذان.',
      source: 'وكالة ترويج السياحة في البوسنة والهرسك',
      verified_at: '2026-09-20'
    },
    gdp_reference: 'نحو 27 مليار دولار أمريكي',
    growth_rate_reference: '2.8%',
    economic_sectors: ['السياحة العائلية والإسلامية', 'العقارات والمزارع وتملك الأجانب', 'الصناعات الخشبية والأثاث', 'المعادن والطاقة الكهرومائية'],
    measurement_year: 2025,
    economic_data_class: 'reference_indicator',
    economic_disclaimer: 'مؤشرات سياحية واستثمارية عقارية وتجارية مرجعية.',
    source_document: 'موسوعة درب الدولية - ملف البوسنة والهرسك'
  }
};
