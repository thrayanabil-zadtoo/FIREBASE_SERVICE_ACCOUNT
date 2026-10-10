import { CountryProvinceDetail } from '../types/country-profile';

// ============================================================================
// PROVINCES & STATES ATLAS: ARAB NORTH AFRICA & HORN OF AFRICA
// (TN, LY, SD, MR, SO, DJ, KM)
// ============================================================================

export const ARAB_AFRICA_NEW_PROVINCES: Record<string, CountryProvinceDetail[]> = {
  // 🇹🇳 الجمهورية التونسية (كافة الأقاليم والولايات ومدنها)
  TN: [
    {
      id: 'tn_tunis',
      country_code: 'TN',
      province_name_ar: 'ولاية تونس وتونس الكبرى',
      province_name_en: 'Tunis Governorate',
      type_label_ar: 'ولاية',
      administrative_capital_ar: 'تونس العاصمة',
      area_km2: 346,
      population_approx: '1.08 مليون نسمة',
      geographic_location_ar: 'شمال شرق تونس على خليج تونس وبحيرة تونس، القلب السياسي والاقتصادي والتاريخي.',
      economic_specialization_ar: 'البرمجيات وتكنولوجيا المعلومات، الخدمات المالية، السياحة الثقافية بقرطاج وسيدي بوسعيد، والجامعات.',
      famous_landmarks_ar: ['مدينة قرطاج الأثرية ومسرحها (اليونسكو)', 'قرية سيدي بوسعيد الزرقاء والبيضاء', 'جامع الزيتونة المعمور والمدينة العتيقة', 'شارع الحبيب بورقيبة'],
      cities_count: 3,
      key_cities: [
        {
          name_ar: 'تونس العاصمة (المدينة العتيقة)',
          name_en: 'Tunis',
          is_capital: true,
          population_approx: '650 ألف نسمة',
          description_ar: 'حاضرة الخضراء وأسواقها الأندلسية العتيقة ومقر جامع الزيتونة والوزارات والمراكز المصرفية والمسارح.',
          cost_index: 40,
          safety_score: 80,
          internet_score: 78,
          famous_industries: ['الخدمات المصرفية والتأمين', 'تطوير البرمجيات ومراكز الاتصال', 'الصناعات التقليدية والجلدية والعطور'],
          famous_landmarks: ['جامع الزيتونة', 'سوق العطارين والقماشين', 'ساحة القصبة']
        },
        {
          name_ar: 'سيدي بوسعيد وقرطاج',
          name_en: 'Sidi Bou Said & Carthage',
          is_capital: false,
          population_approx: '50 ألف نسمة',
          description_ar: 'أيقونة السياحة المتوسطية بألوانها البيضاء والزرقاء ومطلها البانورامي الخلاب على الخليج وقصور قرطاج البونية.',
          cost_index: 52,
          safety_score: 92,
          internet_score: 82,
          famous_industries: ['السياحة الراقية والضيافة الثقافية', 'الفنون التشكيلية والمعارض', 'المقاهي التراثية ومشموم الفل'],
          famous_landmarks: ['القهوة العالية بسيدي بوسعيد', 'حمامات أنطونيوس بقرطاج', 'المتحف الوطني بقرطاج']
        },
        {
          name_ar: 'المرسى وقمرت',
          name_en: 'La Marsa & Gammarth',
          is_capital: false,
          population_approx: '110 ألف نسمة',
          description_ar: 'الضاحية الشمالية الفاخرة المطلة على البحر المتوسط، موطن الفنادق الخمس نجوم والشركات العالمية والمطاعم الراقية.',
          cost_index: 55,
          safety_score: 90,
          internet_score: 84,
          famous_industries: ['الفنادق الفاخرة وسياحة المؤتمرات', 'التطوير العقاري الساحلي', 'المطاعم العالمية'],
          famous_landmarks: ['شاطئ قمرت', 'قصر العبدلية بالمرسى', 'مجمع البوليفارد']
        }
      ]
    },
    {
      id: 'tn_sousse',
      country_code: 'TN',
      province_name_ar: 'ولاية سوسة والساحل',
      province_name_en: 'Sousse Governorate',
      type_label_ar: 'ولاية',
      administrative_capital_ar: 'مدينة سوسة',
      area_km2: 2669,
      population_approx: '730 ألف نسمة',
      geographic_location_ar: 'وسط الساحل الشرقي التونسي، جوهرة الساحل وقطب الصناعات الميكانيكية والنسيجية والسياحة البحرية.',
      economic_specialization_ar: 'السياحة الشاطئية الفندقية (القنطاوي)، صناعة مكونات السيارات، النسيج والملابس، وزيت الزيتون الساحلي.',
      famous_landmarks_ar: ['رباط سوسة التاريخي والمدينة العتيقة (اليونسكو)', 'ميناء القنطاوي الترفيهي (Port El Kantaoui)', 'المتحف الأثري بسوسة', 'شواطئ بوجعفر'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'سوسة (جوهرة الساحل)',
          name_en: 'Sousse',
          is_capital: false,
          population_approx: '280 ألف نسمة',
          description_ar: 'القطب السياحي والصناعي الأبرز، تجمع بين القلاع الإسلامية البحرية ومصانع الكابلات والمنظومات الإلكترونية.',
          cost_index: 38,
          safety_score: 82,
          internet_score: 80,
          famous_industries: ['صناعة كوابل ومكونات السيارات', 'السياحة والاستجمام الفندقي', 'الصناعات الغذائية وعصر الزيتون'],
          famous_landmarks: ['رباط سوسة', 'المسجد الكبير بسوسة', 'كورنيش بوجعفر']
        },
        {
          name_ar: 'مرسى القنطاوي',
          name_en: 'Port El Kantaoui',
          is_capital: false,
          population_approx: '35 ألف نسمة',
          description_ar: 'أول ميناء ترفيهي مدمج بتونس وحدائق الجولف العالمية ومارينا اليخوت والقرى السياحية المبنية على الطراز الأندلسي.',
          cost_index: 48,
          safety_score: 92,
          internet_score: 82,
          famous_industries: ['سياحة اليخوت والموانئ الترفيهية', 'رياضة الجولف الدولية', 'المهرجانات الصيفية'],
          famous_landmarks: ['مارينا القنطاوي لليخوت', 'نادي القنطاوي للجولف', 'النافورة الراقصة']
        }
      ]
    },
    {
      id: 'tn_sfax',
      country_code: 'TN',
      province_name_ar: 'ولاية صفاقس',
      province_name_en: 'Sfax Governorate',
      type_label_ar: 'ولاية',
      administrative_capital_ar: 'مدينة صفاقس',
      area_km2: 7545,
      population_approx: '1.02 مليون نسمة',
      geographic_location_ar: 'وسط الساحل التونسي الجنوبي قبالة أرخبيل قرقنة، عاصمة التجارة والعمل والصناعة وزيت الزيتون التونسي.',
      economic_specialization_ar: 'إنتاج وتصدير زيت الزيتون البكر التونسي رقم 1 عالمياً، الصناعات الكيماوية والفسفاطية، وصيد الأسماك واللوز.',
      famous_landmarks_ar: ['أسوار صفاقس التاريخية وباب الجبلي وباب الديوان', 'أرخبيل جزر قرقنة البحرية الساحرة', 'المدينة العتيقة بصفاقس', 'قصر معهد الزيتونة'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'صفاقس (عاصمة الجنوب الاقتصادية)',
          name_en: 'Sfax',
          is_capital: false,
          population_approx: '330 ألف نسمة',
          description_ar: 'مدينة العمل والجد وعاصمة رواد الأعمال والصناعات التحويلية وتصدير زيت الزيتون واللوز والمأكولات البحرية.',
          cost_index: 35,
          safety_score: 82,
          internet_score: 78,
          famous_industries: ['تكرير وتعبئة زيت الزيتون الممتاز', 'الصناعات المعدنية والتحويلية', 'الصيد البحري وقوارب الشرافي'],
          famous_landmarks: ['باب الديوان والأسوار العتيقة', 'سوق الحوت (سوق السمك الشهير)', 'قصر البلدية الأثري']
        },
        {
          name_ar: 'جزر قرقنة',
          name_en: 'Kerkennah Islands',
          is_capital: false,
          population_approx: '25 ألف نسمة',
          description_ar: 'أرخبيل جزر هادئة محاطة بأشجار النخيل والتقاليد البحرية الفريدة وطريقة صيد الشرافي التقليدية المسجلة بالتراث العالمي.',
          cost_index: 32,
          safety_score: 95,
          internet_score: 70,
          famous_industries: ['الصيد التقليدي بالشرافي والحبار (السيبيا)', 'السياحة البيئية الهادئة', 'الحرف التقليدية من سعف النخيل'],
          famous_landmarks: ['برج الحصار الأثري', 'شواطئ سيدي فنخل الهادئة', 'متحف التراث بالعباسية']
        }
      ]
    }
  ],

  // 🇱🇾 دولة ليبيا (كافة الأقاليم والبلديات ومدنها)
  LY: [
    {
      id: 'ly_tripoli',
      country_code: 'LY',
      province_name_ar: 'شعبية وبلدية طرابلس',
      province_name_en: 'Tripoli Municipality',
      type_label_ar: 'بلدية / محافظة',
      administrative_capital_ar: 'مدينة طرابلس',
      area_km2: 400,
      population_approx: '1.35 مليون نسمة',
      geographic_location_ar: 'شمال غرب ليبيا على البحر المتوسط، عروس البحر الأبيض وعاصمة الدولة ومقر المؤسسة الوطنية للنفط ومصرف ليبيا المركزي.',
      economic_specialization_ar: 'إدارة قطاع النفط والغاز، الخدمات المصرفية والمالية، التجارة والموانئ، والأسواق التراثية القديمة.',
      famous_landmarks_ar: ['قلعة السرايا الحمراء التاريخية', 'ميدان الشهداء (الساحة الخضراء سابقاً)', 'قوس ماركوس أوريليوس الروماني', 'المدينة القديمة بطرابلس'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'طرابلس (عروس البحر)',
          name_en: 'Tripoli',
          is_capital: true,
          population_approx: '1.15 مليون نسمة',
          description_ar: 'عاصمة البلاد وحاضرة التجارة والتاريخ البحري والأزقة الأندلسية والعثمانية العتيقة وميناء الشحن النشط.',
          cost_index: 42,
          safety_score: 65,
          internet_score: 70,
          famous_industries: ['الخدمات النفطية والمؤسسية', 'التجارة العامة والاستيراد والتوزيع', 'الصناعات الغذائية والمطاحن'],
          famous_landmarks: ['السرايا الحمراء', 'سوق القصديرية والصاغة', 'كورنيش طرابلس وميناء الشعاب']
        },
        {
          name_ar: 'تاجوراء',
          name_en: 'Tajoura',
          is_capital: false,
          population_approx: '180 ألف نسمة',
          description_ar: 'الضاحية الساحلية الشرقية للعاصمة، مركز مراكز البحوث النووية والطاقية والمزارع الشاطئية والجامعات.',
          cost_index: 38,
          safety_score: 68,
          internet_score: 68,
          famous_industries: ['البحوث العلمية والتقنية', 'السياحة الشاطئية والاستراحات', 'الزراعة البستانية والصيد'],
          famous_landmarks: ['جامع مراد آغا التاريخي', 'مركز بحوث الطاقة والتقنيات', 'شواطئ تاجوراء الصخرية']
        }
      ]
    },
    {
      id: 'ly_benghazi',
      country_code: 'LY',
      province_name_ar: 'بلدية بنغازي وبرقة',
      province_name_en: 'Benghazi Municipality',
      type_label_ar: 'بلدية / محافظة',
      administrative_capital_ar: 'مدينة بنغازي',
      area_km2: 800,
      population_approx: '750 ألف نسمة',
      geographic_location_ar: 'شرق ليبيا على خليج سرت، العاصمة الاقتصادية لشرق البلاد وعقدة خطوط التجارة وموانئ تصدير النفط بمحيطها.',
      economic_specialization_ar: 'الخدمات البحرية والتجارة، الصناعات الأسمنتية والإنشائية، التعليم الجامعي، وشركات الطاقة.',
      famous_landmarks_ar: ['منارة بنغازي التاريخية', 'كاتدرائية بنغازي المعمارية', 'سوق الحوت وميدان الشجرة', 'بحيرة 23 يوليو'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'بنغازي',
          name_en: 'Benghazi',
          is_capital: false,
          population_approx: '650 ألف نسمة',
          description_ar: 'حاضرة برقة ومدينة الثقافة والشعر والجامعات ومقر ميناء الشحن والتجارة ومشاريع الإعمار الكبرى.',
          cost_index: 40,
          safety_score: 70,
          internet_score: 68,
          famous_industries: ['إعمار البنية التحتية والتشييد', 'الخدمات النفطية واللوجستية', 'التجارة البحرية وتفريغ الحاويات'],
          famous_landmarks: ['منارة بنغازي القديمة', 'جامعة بنغازي (جامعة قاريونس)', 'كورنيش الشابي']
        },
        {
          name_ar: 'المرج',
          name_en: 'Al Marj',
          is_capital: false,
          population_approx: '95 ألف نسمة',
          description_ar: 'مدينة زراعية خصبة فوق هضبة الجبل الأخضر، سلة الغلال والحبوب والمحاصيل وثروة الماشية في الشرق.',
          cost_index: 34,
          safety_score: 78,
          internet_score: 64,
          famous_industries: ['زراعة القمح والشعير والحبوب', 'تربية الأبقار وإنتاج الحليب ومشتقاته', 'التجارة الزراعية'],
          famous_landmarks: ['سهل المرج الخصيب', 'ميدان المدينة والمباني الحديثة', 'غابات الصنوبر المحيطة']
        }
      ]
    },
    {
      id: 'ly_misrata',
      country_code: 'LY',
      province_name_ar: 'بلدية مصراتة والمنطقة الحرة',
      province_name_en: 'Misrata Municipality',
      type_label_ar: 'بلدية / محافظة',
      administrative_capital_ar: 'مدينة مصراتة',
      area_km2: 2770,
      population_approx: '550 ألف نسمة',
      geographic_location_ar: 'الطرف الغربي لخليج سرت، عاصمة التجارة الحرة وصناعة الحديد والصلب والميناء التجاري الأكثر كفاءة في ليبيا.',
      economic_specialization_ar: 'المنطقة الحرة بمصراتة (MFZ)، مجمع الحديد والصلب، النقل البحري والتوكيلات الملاحية، وتجارة الترانزيت.',
      famous_landmarks_ar: ['المنطقة الحرة بمصراتة وميناء قصر أحمد', 'الشركة الليبية للحديد والصلب (LISCO)', 'سوق مصراتة التجاري', 'شاطئ كرزاز'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'مصراتة',
          name_en: 'Misrata',
          is_capital: false,
          population_approx: '420 ألف نسمة',
          description_ar: 'عاصمة التجارة والريادة الاقتصادية في ليبيا، تستحوذ على النصيب الأكبر من حركة الاستيراد وتجارة السيارات والصلب.',
          cost_index: 42,
          safety_score: 78,
          internet_score: 72,
          famous_industries: ['صناعة ودرفلة الحديد والصلب', 'الخدمات اللوجستية وتجارة الترانزيت', 'استيراد وإعادة تصدير السلع'],
          famous_landmarks: ['ميناء المنطقة الحرة بقصر أحمد', 'مجمع الحديد والصلب', 'شارع طرابلس التجاري']
        },
        {
          name_ar: 'زليتن',
          name_en: 'Zliten',
          is_capital: false,
          population_approx: '130 ألف نسمة',
          description_ar: 'مدينة العلم والقرآن وحصن سيدي عبدالسلام الأسمر وأكبر مصانع الأسمنت ومزارع الزيتون والنخيل.',
          cost_index: 36,
          safety_score: 82,
          internet_score: 66,
          famous_industries: ['صناعة الأسمنت ومواد البناء', 'إنتاج وتكرير زيت الزيتون', 'التعليم الديني والجامعي التراثي'],
          famous_landmarks: ['الجامعة الأسمرية الإسلامية', 'مجمع مصانع أسمنت زليتن', 'شواطئ زليتن الرملية']
        }
      ]
    }
  ],

  // 🇸🇩 جمهورية السودان (كافة الولايات ومدنها)
  SD: [
    {
      id: 'sd_red_sea',
      country_code: 'SD',
      province_name_ar: 'ولاية البحر الأحمر',
      province_name_en: 'Red Sea State',
      type_label_ar: 'ولاية',
      administrative_capital_ar: 'مدينة بورتسودان',
      area_km2: 218887,
      population_approx: '1.48 مليون نسمة',
      geographic_location_ar: 'شمال شرق السودان على البحر الأحمر، المنفذ البحري الاستراتيجي الوحيد للبلاد والعاصمة الإدارية الحالية.',
      economic_specialization_ar: 'الموانئ البحرية والشحن والتفريغ، صوامع الغلال، خطوط أنابيب تصدير النفط، وتعدين الذهب.',
      famous_landmarks_ar: ['ميناء بورتسودان الجنوبي والشمالي', 'جزيرة سواكن التاريخية ومنازل المرجان العثمانية', 'منتجع عروس والشعب المرجانية الفريدة (سنجنب)', 'سلسلة جبال البحر الأحمر'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'بورتسودان',
          name_en: 'Port Sudan',
          is_capital: true,
          population_approx: '750 ألف نسمة',
          description_ar: 'ثغر السودان الباسم والميناء التجاري الاستراتيجي والمقر الحكومي والدبلوماسي الحالي للبلاد.',
          cost_index: 38,
          safety_score: 72,
          internet_score: 65,
          famous_industries: ['الملاحة البحرية وإدارة الموانئ', 'صوامع الغلال والمخازن اللوجستية', 'تصدير القطن والسمسم والذهب'],
          famous_landmarks: ['كورنيش بورتسودان وميناء الأمير غياث', 'صومعة الغلال العملاقة', 'محمية جزيرة سنجنب البحرية']
        },
        {
          name_ar: 'سواكن',
          name_en: 'Suakin',
          is_capital: false,
          population_approx: '60 ألف نسمة',
          description_ar: 'الميناء التاريخي الأسطوري المبني بحجارة الشعب المرجانية وميناء الركاب ونقل الحجاج وسفن المواشي إلى جدة.',
          cost_index: 32,
          safety_score: 76,
          internet_score: 60,
          famous_industries: ['نقل المسافرين والركاب بحراً', 'تصدير الثروة الحيوانية والماشية', 'السياحة التاريخية والتراثية'],
          famous_landmarks: ['جزيرة سواكن التاريخية المرجانية', 'ميناء الأمير عثمان دقنة', 'بوابة سواكن القديمة']
        }
      ]
    },
    {
      id: 'sd_nile_river',
      country_code: 'SD',
      province_name_ar: 'ولاية نهر النيل',
      province_name_en: 'River Nile State',
      type_label_ar: 'ولاية',
      administrative_capital_ar: 'الدامر',
      area_km2: 122123,
      population_approx: '1.51 مليون نسمة',
      geographic_location_ar: 'شمال السودان حيث يلتقي النيل بنهر عطبرة، مهد أهرامات مروي وحضارة كوش وعاصمة السكك الحديدية والأسمنت.',
      economic_specialization_ar: 'أهرامات مروي (اليونسكو)، تعدين الذهب، صناعة الأسمنت (أكبر مصانع السودان)، وزراعة التمور والحبوب.',
      famous_landmarks_ar: ['أهرامات البجراوية (مروي - اليونسكو)', 'مدينة الحديد والنار (عطبرة)', 'شلال السبلوقة الطبيعي', 'معبد النقعة والمصورات الصفراء'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'عطبرة',
          name_en: 'Atbara',
          is_capital: false,
          population_approx: '180 ألف نسمة',
          description_ar: 'مدينة الحديد والنار وعاصمة نقابات العمال والسكك الحديدية السودانية ومركز صناعة الأسمنت وتعدين الذهب.',
          cost_index: 34,
          safety_score: 78,
          internet_score: 66,
          famous_industries: ['صيانة وهندسة السكك الحديدية', 'صناعة الأسمنت ومواد البناء', 'تجارة وسباكة الذهب'],
          famous_landmarks: ['متحف السكك الحديدية بعطبرة', 'جسر عطبرة المعلق ومقرن النيلين', 'سوق عطبرة الكبير']
        },
        {
          name_ar: 'شندي ومروي',
          name_en: 'Shendi & Meroe',
          is_capital: false,
          population_approx: '110 ألف نسمة',
          description_ar: 'حاضرة الجعليين والتاريخ القديم، موقع أهرامات مروي السوداء الشامخة ومركز صناعة النسيج اليدوي الفاخر.',
          cost_index: 32,
          safety_score: 80,
          internet_score: 62,
          famous_industries: ['السياحة الأثرية العالمية بحضارة كوش', 'صناعة المنسوجات والدمور السوداني', 'زراعة البصل والمانجو والحمضيات'],
          famous_landmarks: ['أهرامات البجراوية الكوشية', 'معابد النقعة القديمة', 'سوق شندي للنسيج اليدوي']
        }
      ]
    }
  ],

  // 🇲🇷 الجمهورية الإسلامية الموريتانية (كافة الولايات ومدنها)
  MR: [
    {
      id: 'mr_nouakchott',
      country_code: 'MR',
      province_name_ar: 'جهة وولايات نواكشوط الثلاث',
      province_name_en: 'Nouakchott Region',
      type_label_ar: 'جهة / ولاية',
      administrative_capital_ar: 'مدينة نواكشوط',
      area_km2: 1036,
      population_approx: '1.31 مليون نسمة',
      geographic_location_ar: 'ساحل المحيط الأطلسي غرب موريتانيا، العاصمة السياسية ومقر البنوك والجامعات وميناء الصداقة المستقل.',
      economic_specialization_ar: 'الصيد البحري وتصدير الأسماك، الخدمات المصرفية، تجارة الترانزيت مع غرب أفريقيا، والعمارة التراثية.',
      famous_landmarks_ar: ['سوق السمك الشهير على شاطئ الأطلسي', 'المسجد السعودي الكبير', 'المتحف الوطني الموريتاني', 'ميناء نواكشوط المستقل (ميناء الصداقة)'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'نواكشوط (تفرغ زينة)',
          name_en: 'Nouakchott (Tevragh-Zeina)',
          is_capital: true,
          population_approx: '950 ألف نسمة',
          description_ar: 'عاصمة البلاد والمركز الإداري والدبلوماسي، تشتهر بشاطئ قوارب الصيد الخشبية الملونة وأسواق الملاحف والصمغ العربي.',
          cost_index: 42,
          safety_score: 76,
          internet_score: 70,
          famous_industries: ['الصيد التقليدي والصناعي للأسماك والرخويات', 'الخدمات المالية وشركات الاتصالات', 'تجارة الملاحف والصناعات التقليدية'],
          famous_landmarks: ['سوق السمك (مارشي بيش)', 'سوق العاصمة المركزي', 'المتحف الوطني']
        },
        {
          name_ar: 'الميناء والسبخة',
          name_en: 'El Mina & Sebkha',
          is_capital: false,
          population_approx: '350 ألف نسمة',
          description_ar: 'المنطقة الحرفية والتجارية والمينائية الصاخبة، مركز ورش النجارة والمستودعات وسوق الماشية وسوق التبادل الإفريقي.',
          cost_index: 35,
          safety_score: 70,
          internet_score: 65,
          famous_industries: ['التجارة الشعبية والإقليمية', 'الخدمات اللوجستية وتخزين الحاويات', 'الحرف الخشبية والحدادة'],
          famous_landmarks: ['ميناء الصداقة', 'سوق السبخة الكبير', 'أرصفة تفريغ البضائع']
        }
      ]
    },
    {
      id: 'mr_dakhlet_nouadhibou',
      country_code: 'MR',
      province_name_ar: 'ولاية داخلة نواذيبو والمنطقة الحرة',
      province_name_en: 'Dakhlet Nouadhibou',
      type_label_ar: 'ولاية',
      administrative_capital_ar: 'مدينة نواذيبو',
      area_km2: 22300,
      population_approx: '170 ألف نسمة',
      geographic_location_ar: 'شبه جزيرة الرأس الأبيض على المحيط الأطلسي شمالاً، عاصمة الصيد البحري وتصدير خام الحديد عبر أطول قطار بالعالم.',
      economic_specialization_ar: 'المنطقة الحرة بنواذيبو (ZFN)، تصدير خام الحديد (SNIM)، دقيق وزيوت الأسماك، ومحمية الفقمة الراهبة النادرة.',
      famous_landmarks_ar: ['ميناء نواذيبو للمنطقة الحرة', 'أطول قطار لنقل خام الحديد في العالم (قطار الصحراء)', 'محمية الرأس الأبيض للفقمة الراهبة', 'شواطئ كاب بلانك'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'نواذيبو',
          name_en: 'Nouadhibou',
          is_capital: false,
          population_approx: '140 ألف نسمة',
          description_ar: 'العاصمة الاقتصادية لموريتانيا ومقر المنطقة الحرة والمصانع العملاقة لمعالجة الأسماك ورصيف شحن الحديد.',
          cost_index: 44,
          safety_score: 82,
          internet_score: 72,
          famous_industries: ['صناعة دقيق وزيت السمك وتجميد الأخطبوط', 'شحن وتصدير الحديد من مناجم ازويرات', 'الخدمات اللوجستية البحرية'],
          famous_landmarks: ['رصيف تصدير الحديد بالكانسادو', 'المنطقة الحرة بنواذيبو', 'منارة الرأس الأبيض']
        },
        {
          name_ar: 'شوم وبولنوار',
          name_en: 'Choum & Boulenouar',
          is_capital: false,
          population_approx: '25 ألف نسمة',
          description_ar: 'محطات خط السكة الحديدية الصحراوية العملاقة ومصدر مياه الشرب النقية وتجارة الإبل والتمور.',
          cost_index: 32,
          safety_score: 85,
          internet_score: 60,
          famous_industries: ['خدمات وصيانة سكة حديد سنيم', 'استخراج وتعبئة المياه الجوفية', 'تجارة التمور والماشية الصحراوية'],
          famous_landmarks: ['سكة حديد قطار الصحراء الأسطوري', 'حقل آبار بولنوار العذب']
        }
      ]
    }
  ],

  // 🇸🇴 جمهورية الصومال الفيدرالية (كافة الولايات والأقاليم ومدنها)
  SO: [
    {
      id: 'so_banadir',
      country_code: 'SO',
      province_name_ar: 'إقليم بنادر ومقديشو',
      province_name_en: 'Banaadir Region (Mogadishu)',
      type_label_ar: 'إقليم فيدرالي / ولاية',
      administrative_capital_ar: 'مدينة مقديشو',
      area_km2: 370,
      population_approx: '2.42 مليون نسمة',
      geographic_location_ar: 'الساحل الجنوبي الشرقي على المحيط الهندي، العاصمة الوطنية وعقدة الأعمال والتجارة البحرية والتحويلات المالية.',
      economic_specialization_ar: 'الصيرفة عبر الهاتف المحمول (Hormuud EVC)، الموانئ البحرية، الصيد، الفنادق الساحلية، والجامعات.',
      famous_landmarks_ar: ['شاطئ ليدو الرائع والمطاعم البحرية', 'مسجد فخر الدين العتيق (القرن 13)', 'ميناء مقديشو الدولي', 'سوق بكارة المركزي الضخم'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'مقديشو (عروس المحيط الهندي)',
          name_en: 'Mogadishu',
          is_capital: true,
          population_approx: '2.1 مليون نسمة',
          description_ar: 'العاصمة النابضة بنهضة عمرانية واستثمارية واسعة وأقوى شبكة دفع رقمي بالهاتف وميناء بحري نشط للغاية.',
          cost_index: 36,
          safety_score: 60,
          internet_score: 65,
          famous_industries: ['التكنولوجيا المالية والمدفوعات الإلكترونية', 'الشحن البحري والخدمات اللوجستية', 'الاتصالات والتعليم الجامعي'],
          famous_landmarks: ['شاطئ ليدو الساحر', 'سوق بكارة التاريخي', 'منارة مقديشو القديمة']
        },
        {
          name_ar: 'الجزيرة',
          name_en: 'Jazeera',
          is_capital: false,
          population_approx: '60 ألف نسمة',
          description_ar: 'الضاحية الشاطئية الفيروزية جنوب مقديشو، معقل المأكولات البحرية الطازجة واستخراج الملح والرياضات المائية.',
          cost_index: 34,
          safety_score: 65,
          internet_score: 62,
          famous_industries: ['السياحة الشاطئية والاستجمام', 'استخراج ملح البحر الطبيعي', 'الصيد البحري التقليدي والحديث'],
          famous_landmarks: ['شاطئ الجزيرة الفيروزي', 'مزارع وملاحات الجزيرة البحرية']
        }
      ]
    },
    {
      id: 'so_puntland',
      country_code: 'SO',
      province_name_ar: 'ولاية بونتلاند (أرض البنط)',
      province_name_en: 'Puntland State',
      type_label_ar: 'ولاية فيدرالية',
      administrative_capital_ar: 'مدينة غاروي',
      area_km2: 212510,
      population_approx: '4.2 مليون نسمة',
      geographic_location_ar: 'شمال شرق الصومال على رأس عسير وخليج عدن والمحيط الهندي، موطن اللبان التاريخي والموانئ المستقرة.',
      economic_specialization_ar: 'إنتاج اللبان والبخور الصومالي الأول عالمياً، ميناء بوساسو وتصدير الماشية لدول الخليج، وصيد الأسماك.',
      famous_landmarks_ar: ['ميناء بوساسو الدولي على خليج عدن', 'رأس عسير (رأس غواردافوي - أقصى شرق قارة أفريقيا)', 'سوق اللبان بغاروي', 'جبال جوليس الطبيعية'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'بوساسو',
          name_en: 'Bosaso',
          is_capital: false,
          population_approx: '700 ألف نسمة',
          description_ar: 'العاصمة التجارية لبونتلاند والميناء البحري الرئيسي لتصدير ملايين رؤوس الماشية والجمال واللبان إلى الخليج.',
          cost_index: 35,
          safety_score: 72,
          internet_score: 68,
          famous_industries: ['تصدير الماشية الحية واللحوم', 'تجارة اللبان الصومالي والبخور النادر', 'الصيد البحري وتعليب التونة'],
          famous_landmarks: ['ميناء بوساسو التجاري', 'سوق المواشي الإقليمي', 'شواطئ خليج عدن']
        },
        {
          name_ar: 'غاروي',
          name_en: 'Garowe',
          is_capital: true,
          population_approx: '250 ألف نسمة',
          description_ar: 'العاصمة الإدارية لولاية بونتلاند، مدينة حديثة ومخططة وتعتبر نموذجاً للاستقرار والأمان والمؤسسات الحكومية والجامعات.',
          cost_index: 34,
          safety_score: 80,
          internet_score: 70,
          famous_industries: ['الخدمات الإدارية والمؤسساتية', 'التعليم الجامعي والمؤتمرات', 'التجارة البرية العابرة للأقاليم'],
          famous_landmarks: ['المجمع الحكومي الرئاسي بغاروي', 'مكتبة ومتحف غاروي', 'جامعة ولاية بونتلاند (PSU)']
        }
      ]
    }
  ],

  // 🇩🇯 جمهورية جيبوتي (كافة الأقاليم ومدنها)
  DJ: [
    {
      id: 'dj_djibouti_city',
      country_code: 'DJ',
      province_name_ar: 'إقليم ومدينة جيبوتي العاصمة',
      province_name_en: 'Djibouti Region',
      type_label_ar: 'إقليم / محافظة',
      administrative_capital_ar: 'مدينة جيبوتي',
      area_km2: 200,
      population_approx: '620 ألف نسمة',
      geographic_location_ar: 'مدخل مضيق باب المندب وخليج تاجورة، المحور اللوجستي البحري العالمي ورئة إثيوبيا البحرية والمالية.',
      economic_specialization_ar: 'الموانئ البحرية فائقة التطور (دوراليه DIFTZ)، محطات الحاويات، كابلات الألياف الضوئية البحرية الدولية، والبنوك.',
      famous_landmarks_ar: ['ميناء دوراليه متعدد الأغراض ومحطة الحاويات', 'المنطقة الحرة الدولية بجيبوتي (DIFTZ)', 'جامع الحمودي التاريخي', 'ميدان 27 يونيو والحي الأوروبي'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'جيبوتي العاصمة',
          name_en: 'Djibouti City',
          is_capital: true,
          population_approx: '550 ألف نسمة',
          description_ar: 'عاصمة التجارة والموانئ وبوابة باب المندب، تستقبل مئات السفن الضخمة وتضم مصارف دولية وتجمع ثقافي عربي وأفريقي.',
          cost_index: 55,
          safety_score: 82,
          internet_score: 75,
          famous_industries: ['الشحن وتفريغ الحاويات العالمية', 'الخدمات المصرفية والتجارة الدولية الحرة', 'الربط الرقمي وكابلات الإنترنت القارية'],
          famous_landmarks: ['ميناء دوراليه للحاويات', 'ميدان منليك والحي التاريخي', 'قصر الشعب بجيبوتي']
        },
        {
          name_ar: 'دوراليه',
          name_en: 'Doraleh',
          is_capital: false,
          population_approx: '70 ألف نسمة',
          description_ar: 'المجمع المينائي والصناعي الأحدث في أفريقيا ومحطة تصدير واستيراد النفط والبضائع والسكك الحديدية نحو أديس أبابا.',
          cost_index: 52,
          safety_score: 85,
          internet_score: 78,
          famous_industries: ['الخدمات اللوجستية ومستودعات الترانزيت', 'محطات نقل البترول والغاز', 'محطة القطار الكهربائي الدولي (جيبوتي - أديس أبابا)'],
          famous_landmarks: ['ميناء دوراليه الدولي', 'المنطقة الحرة التجريبية الدولية', 'محطة السكة الحديدية الحديثة']
        }
      ]
    },
    {
      id: 'dj_tadjourah',
      country_code: 'DJ',
      province_name_ar: 'إقليم تاجورة وبحيرة عسل',
      province_name_en: 'Tadjourah Region',
      type_label_ar: 'إقليم',
      administrative_capital_ar: 'مدينة تاجورة',
      area_km2: 7100,
      population_approx: '95 ألف نسمة',
      geographic_location_ar: 'شمال خليج تاجورة، موطن بحيرة عسل (أخفض نقطة في أفريقيا) والمدينة البيضاء التاريخية.',
      economic_specialization_ar: 'استخراج الملح والبرومين من بحيرة عسل، ميناء تصدير البوتاس، السياحة البيئية والشعب المرجانية والغوص مع أسماك القرش الحوتي.',
      famous_landmarks_ar: ['بحيرة عسل (أخفض نقطة في أفريقيا وثاني أكثر بحيرات العالم ملوحة)', 'مدينة تاجورة البيضاء (مدينة المساجد السبعة)', 'غابة داي الوطنية الطبيعية بجبال جودا', 'خليج غوبيه'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'تاجورة (المدينة البيضاء)',
          name_en: 'Tadjourah',
          is_capital: false,
          population_approx: '45 ألف نسمة',
          description_ar: 'أقدم مدن جيبوتي ومقر سلطنة تاجورة التاريخية، تشتهر ببيوتها البيضاء الناصعة وميناء البوتاس الحديث وشواطئ الغوص.',
          cost_index: 45,
          safety_score: 88,
          internet_score: 65,
          famous_industries: ['ميناء شحن البوتاس والمعادن', 'السياحة البيئية والغوص البحري', 'الصيد الحرفي والتمور'],
          famous_landmarks: ['المساجد السبعة العتيقة', 'ميناء تاجورة الجديد', 'شواطئ الرمال البيضاء']
        },
        {
          name_ar: 'بحيرة عسل',
          name_en: 'Lake Assal',
          is_capital: false,
          population_approx: '15 ألف نسمة',
          description_ar: 'أعجوبة جيولوجية تنخفض 155 متراً تحت سطح البحر، محاطة بحقول الملح الأبيض الناصع والبراكين الخامدة.',
          cost_index: 42,
          safety_score: 90,
          internet_score: 55,
          famous_industries: ['تعدين وتصدير الملح الطبيعي الصخري', 'استخراج المعادن الصناعية', 'سياحة المغامرات والتصوير الجيولوجي'],
          famous_landmarks: ['حقول الملح الكريستالي لبحيرة عسل', 'فوهة بركان آردوكوبا', 'شلالات المياه الكبريتية الحارة']
        }
      ]
    }
  ],

  // 🇰🇲 جمهورية جزر القمر الاتحادية الإسلامية (كافة الجزر والولايات ومدنها)
  KM: [
    {
      id: 'km_ngazidja',
      country_code: 'KM',
      province_name_ar: 'جزيرة القمر الكبرى (نغازيدجا)',
      province_name_en: 'Grande Comore (Ngazidja)',
      type_label_ar: 'جزيرة اتحادية مستقلة / ولاية',
      administrative_capital_ar: 'مدينة موروني',
      area_km2: 1148,
      population_approx: '420 ألف نسمة',
      geographic_location_ar: 'كبرى جزر الأرخبيل في المحيط الهندي وقناة موزمبيق، يعلوها بركان القرطالة النشط، العاصمة السياسية والميناء.',
      economic_specialization_ar: 'إنتاج خلاصة زهور الإيلنغ-إيلنغ (المكون الأهم للعطور العالمية الفاخرة)، الفانيليا، القرنفل، والسياحة البركانية.',
      famous_landmarks_ar: ['بركان القرطالة الضخم (أكبر فوهة بركان نشط)', 'مسجد بادجاناني العتيق بموروني (القرن 15)', 'الميناء التراثي لموروني', 'سوق فولوفولو الشعبي الكبير'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'موروني',
          name_en: 'Moroni',
          is_capital: true,
          population_approx: '110 ألف نسمة',
          description_ar: 'عاصمة جزر القمر، تمتاز بهدوئها ومبانيها البيضاء الحجرية ومساجدها القديمة وميناء قوارب الصيد ومزارع التوابل.',
          cost_index: 40,
          safety_score: 85,
          internet_score: 65,
          famous_industries: ['تقطير زيت الإيلنغ-إيلنغ العطري', 'تصدير التوابل والفانيليا القمرية الفاخرة', 'الخدمات المصرفية والحكومية'],
          famous_landmarks: ['مسجد بادجاناني التاريخي', 'ميناء موروني القديم', 'متحف المركز الوطني للتوثيق والبحث']
        },
        {
          name_ar: 'ميتساميولي',
          name_en: 'Mutsamudu / Mitsamiouli',
          is_capital: false,
          population_approx: '35 ألف نسمة',
          description_ar: 'شمال الجزيرة، عاصمة الشواطئ السياحية الخلابة والغوص بين الشعاب المرجانية ورقصات التراث القمري.',
          cost_index: 38,
          safety_score: 88,
          internet_score: 62,
          famous_industries: ['السياحة الشاطئية والمنتجعات', 'الصيد البحري التقليدي', 'زراعة جوز الهند والفواكه الاستوائية'],
          famous_landmarks: ['شواطئ ميتساميولي البيضاء', 'قصر السلطان التاريخي', 'مزارع الفانيليا الاستوائية']
        }
      ]
    },
    {
      id: 'km_ndzwani',
      country_code: 'KM',
      province_name_ar: 'جزيرة أنجوان (ندزواني)',
      province_name_en: 'Anjouan (Ndzwani)',
      type_label_ar: 'جزيرة اتحادية مستقلة / ولاية',
      administrative_capital_ar: 'مدينة متسامودو',
      area_km2: 424,
      population_approx: '340 ألف نسمة',
      geographic_location_ar: 'وسط أرخبيل جزر القمر، لؤلؤة الجزر وموطن الشلالات الجبلية الكثيفة ومزارع العطور الرئيسية وميناء المياه العميقة.',
      economic_specialization_ar: 'ميناء متسامودو بالمياه العميقة، إنتاج وتصدير القرنفل والكاكاو، تقطير الزيوت العطرية، والمدرجات الجبلية الخضراء.',
      famous_landmarks_ar: ['قلعة متسامودو العتيقة وأسوارها (القرن 18)', 'شلالات دزياندي الجبلية الرائعة', 'قصر سلاطين أنجوان', 'ميناء متسامودو التجاري'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'متسامودو',
          name_en: 'Mutsamudu',
          is_capital: false,
          population_approx: '65 ألف نسمة',
          description_ar: 'عاصمة أنجوان وميناؤها التجاري الأعمق في جزر القمر وأزقتها العتيقة المسقوفة وقلاعها الحصينة ضد القراصنة.',
          cost_index: 36,
          safety_score: 86,
          internet_score: 62,
          famous_industries: ['الملاحة واستقبال سفن الحاويات الدولية', 'تجارة التوابل العطرية المجففة', 'الحرف الخشبية والمنحوتات التقليدية'],
          famous_landmarks: ['قلعة متسامودو (The Citadel)', 'البلدة القديمة وأبوابها الخشبية المحفورة', 'كورنيش متسامودو']
        },
        {
          name_ar: 'دوموني',
          name_en: 'Domoni',
          is_capital: false,
          population_approx: '25 ألف نسمة',
          description_ar: 'العاصمة التاريخية الأولى لسلاطين أنجوان ومسقط رأس أول رئيس للدولة، تشتهر ببيوت الأشراف والقصور الأثرية.',
          cost_index: 34,
          safety_score: 88,
          internet_score: 58,
          famous_industries: ['زراعة وتجارة القرنفل والفانيليا', 'صيد الأسماك بالقوارب الشراعية', 'السياحة التاريخية التراثية'],
          famous_landmarks: ['قصر سلاطين دوموني التاريخي', 'المسجد القديم ذو المئذنة الحجرية', 'شواطئ دوموني الصخرية']
        }
      ]
    }
  ]
};
