import { CountryProvinceDetail } from '../types/country-profile';

// ============================================================================
// PROVINCES & STATES ATLAS: ARAB PENINSULA & LEVANT EXTENSION
// (QA, KW, BH, SY, LB, PS, YE)
// ============================================================================

export const ARAB_NEW_PROVINCES: Record<string, CountryProvinceDetail[]> = {
  // 🇶🇦 دولة قطر (كافة البلديات والمدن)
  QA: [
    {
      id: 'qa_doha',
      country_code: 'QA',
      province_name_ar: 'بلدية الدوحة',
      province_name_en: 'Doha Municipality',
      type_label_ar: 'بلدية',
      administrative_capital_ar: 'مدينة الدوحة',
      area_km2: 234,
      population_approx: '956 ألف نسمة',
      geographic_location_ar: 'الساحل الشرقي لشبه الجزيرة القطرية المطل على الخليج العربي، المحور السياسي والاقتصادي.',
      economic_specialization_ar: 'الخدمات المالية والمصرفية، السياحة والمؤتمرات الدولية، المقرات الدبلوماسية، والابتكار الرياضي.',
      famous_landmarks_ar: ['سوق واقف التاريخي', 'متحف الفن الإسلامي', 'كورنيش الدوحة', 'مشيرب قلب الدوحة'],
      cities_count: 3,
      key_cities: [
        {
          name_ar: 'الدوحة',
          name_en: 'Doha',
          is_capital: true,
          population_approx: '800 ألف نسمة',
          description_ar: 'العاصمة القطرية والمركز المالي والإداري الأول وموطن الاستادات العالمية والأبراج الشاهقة.',
          cost_index: 82,
          safety_score: 99,
          internet_score: 98,
          famous_industries: ['الخدمات المالية والاستثمارية', 'الضيافة العالمية الفاخرة', 'تكنولوجيا المعلومات'],
          famous_landmarks: ['مشيرب قلب الدوحة', 'حي الدوحة الدبلوماسي', 'أبراج الخليج الغربي']
        },
        {
          name_ar: 'مشيرب',
          name_en: 'Msheireb',
          is_capital: false,
          population_approx: '35 ألف نسمة',
          description_ar: 'أول مشروع مستدام بالكامل لتجديد وسط المدينة عالمياً، ومركز للابتكار والتصميم.',
          cost_index: 88,
          safety_score: 99,
          internet_score: 99,
          famous_industries: ['المدن الذكية والتقنيات الخضراء', 'الفنون والتصميم الحضري', 'المطاعم الفاخرة'],
          famous_landmarks: ['متاحف مشيرب', 'براحة مشيرب', 'ترام مشيرب الذكي']
        },
        {
          name_ar: 'اللؤلؤة',
          name_en: 'The Pearl',
          is_capital: false,
          population_approx: '45 ألف نسمة',
          description_ar: 'جزيرة اصطناعية فاخرة ووجهة سكنية وسياحية استثنائية تضم مارينا يخوت عالمية وقنوات مائية.',
          cost_index: 92,
          safety_score: 99,
          internet_score: 99,
          famous_industries: ['التطوير العقاري الفاخر', 'اليخوت والملاحة الترفيهية', 'التسوق الراقي'],
          famous_landmarks: ['قناة كارتييه', 'بورتو أرابيا', 'مدينا سنترال']
        }
      ]
    },
    {
      id: 'qa_rayyan',
      country_code: 'QA',
      province_name_ar: 'بلدية الريان',
      province_name_en: 'Al Rayyan Municipality',
      type_label_ar: 'بلدية',
      administrative_capital_ar: 'مدينة الريان',
      area_km2: 2450,
      population_approx: '605 ألف نسمة',
      geographic_location_ar: 'تحيط بالعاصمة الدوحة غرباً وتضم المدينة التعليمية والمجمعات الرياضية العملاقة.',
      economic_specialization_ar: 'التعليم العالي والبحوث المتقدمة، المرافق الرياضية الأولمبية، والفروسية العالمية.',
      famous_landmarks_ar: ['المدينة التعليمية (مؤسسة قطر)', 'استاد أحمد بن علي', 'استاد المدينة التعليمية', 'الشقب للفروسية'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'الريان',
          name_en: 'Al Rayyan',
          is_capital: false,
          population_approx: '480 ألف نسمة',
          description_ar: 'معقل الثقافة الرياضية والتعليم العالمي والجامعات الدولية المرموقة ومرابط الخيل العربية الأصيلة.',
          cost_index: 76,
          safety_score: 98,
          internet_score: 97,
          famous_industries: ['التعليم الأكاديمي الدولي', 'البحث العلمي والابتكار', 'الرعاية الصحية التخصصية'],
          famous_landmarks: ['مؤسسة قطر', 'مكتبة قطر الوطنية', 'ميدان الشقب للفروسية']
        },
        {
          name_ar: 'معيذر',
          name_en: 'Muaither',
          is_capital: false,
          population_approx: '125 ألف نسمة',
          description_ar: 'منطقة تجارية وسكنية حيوية محاذية لأسباير زون واستاد خليفة الدولي ومراكز التسوق الكبرى.',
          cost_index: 72,
          safety_score: 97,
          internet_score: 96,
          famous_industries: ['التجارة والخدمات السريعة', 'اللياقة والرياضة المجتمعية', 'الضيافة'],
          famous_landmarks: ['أسباير زون', 'فيلاجيو مول', 'برج الشعلة (أسباير)']
        }
      ]
    },
    {
      id: 'qa_wakra',
      country_code: 'QA',
      province_name_ar: 'بلدية الوكرة',
      province_name_en: 'Al Wakrah Municipality',
      type_label_ar: 'بلدية',
      administrative_capital_ar: 'مدينة الوكرة',
      area_km2: 2520,
      population_approx: '299 ألف نسمة',
      geographic_location_ar: 'الجنوب الشرقي لقطر، وتضم ميناء حمد الدولي والمناطق الاقتصادية اللوجستية.',
      economic_specialization_ar: 'الملاحة والتجارة البحرية الدولية، البتروكيماويات بمساعد، وسوق الوكرة التراثي الساحلي.',
      famous_landmarks_ar: ['ميناء حمد الدولي', 'سوق الوكرة القديم والشاطئ', 'استاد الجنوب', 'منطقة مسيعيد الصناعية'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'الوكرة',
          name_en: 'Al Wakrah',
          is_capital: false,
          population_approx: '180 ألف نسمة',
          description_ar: 'مدينة ساحلية عريقة تجمع بين عبق الصيد وتجارة اللؤلؤ والميناء الاستراتيجي الأكبر في الشرق الأوسط.',
          cost_index: 70,
          safety_score: 98,
          internet_score: 96,
          famous_industries: ['الخدمات اللوجستية البحرية', 'السياحة الشاطئية والتراثية', 'الصناعات الخفيفة'],
          famous_landmarks: ['سوق الوكرة التراثي', 'استاد الجنوب المونديالي', 'كورنيش الوكرة']
        },
        {
          name_ar: 'مسيعيد',
          name_en: 'Mesaieed',
          is_capital: false,
          population_approx: '65 ألف نسمة',
          description_ar: 'القطب الصناعي البتروكيماوي الأول وميناء تصدير المشتقات النفطية وموقع الكثبان الرملية وخور العديد.',
          cost_index: 65,
          safety_score: 97,
          internet_score: 94,
          famous_industries: ['تكرير البتروكيماويات والأسمدة', 'صناعة الحديد والصلب', 'سياحة السفاري بالرمال'],
          famous_landmarks: ['شاطئ سيلين', 'خور العديد (البحر الداخلي)', 'المجمع الصناعي للبتروكيماويات']
        }
      ]
    },
    {
      id: 'qa_khor',
      country_code: 'QA',
      province_name_ar: 'بلدية الخور والذخيرة',
      province_name_en: 'Al Khor & Al Thakhira',
      type_label_ar: 'بلدية',
      administrative_capital_ar: 'مدينة الخور',
      area_km2: 1613,
      population_approx: '202 ألف نسمة',
      geographic_location_ar: 'شمال شرق دولة قطر، بوابة صناعة الغاز الطبيعي المسال ومحميات القرم الطبيعية.',
      economic_specialization_ar: 'إنتاج وتصدير الغاز الطبيعي المسال (LNG) برأس لفان، والسياحة البيئية واستاد البيت.',
      famous_landmarks_ar: ['مدينة راس لفان الصناعية', 'استاد البيت المونديالي', 'غابات القرم بالذخيرة', 'كورنيش الخور'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'الخور',
          name_en: 'Al Khor',
          is_capital: false,
          population_approx: '120 ألف نسمة',
          description_ar: 'مدينة الشواطئ الهادئة وصيد الأسماك والرحلات البحرية، واحتضنت افتتاح كأس العالم باستاد البيت.',
          cost_index: 68,
          safety_score: 98,
          internet_score: 96,
          famous_industries: ['الخدمات المرتبطة بالطاقة والغاز', 'السياحة البيئية البحرية', 'الثروة السمكية'],
          famous_landmarks: ['استاد البيت المعماري', 'متنزه الخور الترفيهي', 'برج الخور الأثري']
        },
        {
          name_ar: 'راس لفان',
          name_en: 'Ras Laffan',
          is_capital: false,
          population_approx: '40 ألف نسمة',
          description_ar: 'أكبر مجمع صناعي بحري في العالم لإنتاج وتسييل الغاز الطبيعي وميناء الشحن العملاق.',
          cost_index: 75,
          safety_score: 99,
          internet_score: 98,
          famous_industries: ['تسييل الغاز الطبيعي (LNG)', 'تحويل الغاز إلى سوائل (GTL)', 'تصدير الهيليوم والغاز'],
          famous_landmarks: ['ميناء راس لفان العملاق', 'مدينة الطاقة ومحطات التسييل']
        }
      ]
    }
  ],

  // 🇰🇼 دولة الكويت (المحافظات الست ومدنها)
  KW: [
    {
      id: 'kw_capital',
      country_code: 'KW',
      province_name_ar: 'محافظة العاصمة',
      province_name_en: 'Al Asimah (Capital)',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'مدينة الكويت',
      area_km2: 175,
      population_approx: '585 ألف نسمة',
      geographic_location_ar: 'على الساحل الجنوبي لجون الكويت، المركز السياسي والاقتصادي والمالي للدولة.',
      economic_specialization_ar: 'المقرات السيادية للحكم والوزارات، البنوك وبورصة الكويت، والمجمعات التجارية والتاريخية.',
      famous_landmarks_ar: ['أبراج الكويت الشامخة', 'سوق المباركية التاريخي', 'قصر السيف العامر', 'مركز الشيخ جابر الأحمد الثقافي'],
      cities_count: 3,
      key_cities: [
        {
          name_ar: 'مدينة الكويت',
          name_en: 'Kuwait City',
          is_capital: true,
          population_approx: '350 ألف نسمة',
          description_ar: 'عاصمة دولة الكويت وحاضرة التجارة البحرية والمال، تجمع بين ناطحات السحاب وسوق المباركية التراثي.',
          cost_index: 74,
          safety_score: 96,
          internet_score: 95,
          famous_industries: ['البنوك والاستثمار المالي', 'التجارة الدولية والخدمات اللوجستية', 'المقرات الحكومية'],
          famous_landmarks: ['أبراج الكويت', 'برج الحمراء', 'سوق المباركية', 'المسجد الكبير']
        },
        {
          name_ar: 'شرق',
          name_en: 'Sharq',
          is_capital: false,
          population_approx: '65 ألف نسمة',
          description_ar: 'الحي المالي التاريخي والحديث، مقر بورصة الكويت وبنك الكويت المركزي ومراكز الأعمال.',
          cost_index: 78,
          safety_score: 97,
          internet_score: 96,
          famous_industries: ['الأوراق المالية والتداول', 'الشركات متعددة الجنسيات', 'المطاعم الفاخرة'],
          famous_landmarks: ['بورصة الكويت', 'سوق شرق ومارينا اليخوت', 'متحف الكويت الوطني']
        },
        {
          name_ar: 'الشويخ',
          name_en: 'Shuwaikh',
          is_capital: false,
          population_approx: '75 ألف نسمة',
          description_ar: 'المنطقة التجارية والصناعية والمينائية الرئيسية ومقر جامعة الكويت ومراكز التصميم العالمية.',
          cost_index: 69,
          safety_score: 95,
          internet_score: 95,
          famous_industries: ['ميناء الشويخ والشحن التجاري', 'التصميم الداخلي والمقاهي الإبداعية', 'التعليم الجامعي'],
          famous_landmarks: ['ميناء الشويخ التجاري', 'مجمع مروج ومناطق التصميم الحديثة', 'جامعة الكويت']
        }
      ]
    },
    {
      id: 'kw_hawalli',
      country_code: 'KW',
      province_name_ar: 'محافظة حولي',
      province_name_en: 'Hawalli Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'منطقة حولي',
      area_km2: 82,
      population_approx: '960 ألف نسمة',
      geographic_location_ar: 'تمتد بمحاذاة الشريط الساحلي لخليج الكويت، الواجهة السكنية والتجارية الأكثر كثافة.',
      economic_specialization_ar: 'تجارة الإلكترونيات والتقنية، الضيافة والترفيه الساحلي، والمجمعات التجارية والطبية.',
      famous_landmarks_ar: ['شارع سالم المبارك ومارينا مول', 'المركز العلمي الكويتي', 'شارع ابن خلدون للتقنية', 'منتزه الشعب'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'السالمية',
          name_en: 'Salmiya',
          is_capital: false,
          population_approx: '320 ألف نسمة',
          description_ar: 'درة الواجهة البحرية ووجهة التسوق والترفيه الأولى ومقر السفارات والجامعات والمركز العلمي.',
          cost_index: 72,
          safety_score: 95,
          internet_score: 95,
          famous_industries: ['السياحة الترفيهية والتسوق', 'الخدمات الفندقية والضيافة', 'التعليم الخاص الدولي'],
          famous_landmarks: ['المركز العلمي الكويتي (الأكواريوم)', 'مارينا مول وممشى المارينا', 'شارع بغداد']
        },
        {
          name_ar: 'حولي',
          name_en: 'Hawalli',
          is_capital: false,
          population_approx: '240 ألف نسمة',
          description_ar: 'عاصمة الحواسيب وتكنولوجيا الاتصالات في الكويت ومقصد المتخصصين والمهندسين وأسواق الإلكترونيات.',
          cost_index: 62,
          safety_score: 93,
          internet_score: 94,
          famous_industries: ['تجارة وصيانة الإلكترونيات والحواسيب', 'العيادات والمراكز الطبية التخصصية', 'الخدمات التجارية'],
          famous_landmarks: ['شارع ابن خلدون التقني', 'مجمع مجمع العثمان', 'نادي القادسية الرياضي']
        }
      ]
    },
    {
      id: 'kw_ahmadi',
      country_code: 'KW',
      province_name_ar: 'محافظة الأحمدي',
      province_name_en: 'Al Ahmadi Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'مدينة الأحمدي',
      area_km2: 5120,
      population_approx: '1.02 مليون نسمة',
      geographic_location_ar: 'جنوب الكويت، الموطن التاريخي والحالي لصناعة النفط الكويتي وتكريره وتصديره عالمياً.',
      economic_specialization_ar: 'استخراج وتكرير البترول، الصناعات الثقيلة، الموانئ النفطية، والمنتجعات البحرية بالخيران.',
      famous_landmarks_ar: ['مقر شركة نفط الكويت (KOC)', 'ميناء الأحمدي لتصدير النفط', 'مدينة الخيران البحرية', 'مصفاة ميناء عبدالله'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'الأحمدي',
          name_en: 'Al Ahmadi',
          is_capital: false,
          population_approx: '85 ألف نسمة',
          description_ar: 'المدينة الخضراء المصممة هندسياً كمقر لصناعة النفط وشركة نفط الكويت ومتحف النفط ومعارض الطاقة.',
          cost_index: 60,
          safety_score: 96,
          internet_score: 92,
          famous_industries: ['إنتاج واستخراج النفط الخام', 'البحوث الجيولوجية والطاقية', 'التشجير والمساحات الخضراء'],
          famous_landmarks: ['حديقة الأحمدي العامة', 'معرض شركة نفط الكويت للنفط والغاز', 'الملاعب الرياضية التراثية']
        },
        {
          name_ar: 'صباح الأحمد البحرية (الخيران)',
          name_en: 'Sabah Al Ahmad Sea City',
          is_capital: false,
          population_approx: '55 ألف نسمة',
          description_ar: 'أعجوبة معمارية وهيدروليكية بمد القنوات البحرية للصحراء ومركز المنتجعات والرياضات المائية.',
          cost_index: 80,
          safety_score: 98,
          internet_score: 94,
          famous_industries: ['السياحة الترفيهية والشاليهات البحرية', 'الرياضات البحرية واليخوت', 'مراكز التسوق الفاخرة'],
          famous_landmarks: ['مجمع أوتلت الخيران', 'قنوات الخيران المائية', 'مارينا الخيران']
        }
      ]
    },
    {
      id: 'kw_farwaniya',
      country_code: 'KW',
      province_name_ar: 'محافظة الفروانية',
      province_name_en: 'Farwaniya Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'الفروانية',
      area_km2: 190,
      population_approx: '1.18 مليون نسمة',
      geographic_location_ar: 'جنوب العاصمة مباشرة، وتضم مطار الكويت الدولي ومجمع الأفنيوز التجاري الأضخم.',
      economic_specialization_ar: 'الملاحة الجوية الدولية، الشحن الجوي والخدمات اللوجستية، وأكبر مجمعات التجزئة في الشرق الأوسط.',
      famous_landmarks_ar: ['مطار الكويت الدولي', 'مجمع الأفنيوز التجاري (The Avenues)', 'استاد جابر الأحمد الدولي', 'جامعة عبدالله السالم'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'الري',
          name_en: 'Al Rai',
          is_capital: false,
          population_approx: '60 ألف نسمة',
          description_ar: 'القطب التجاري الأكبر وموطن الأفنيوز ومعارض السيارات العالمية والأسواق الكبرى.',
          cost_index: 70,
          safety_score: 95,
          internet_score: 96,
          famous_industries: ['تجارة التجزئة العالمية', 'الخدمات اللوجستية والتوزيع', 'التسوق الفاخر'],
          famous_landmarks: ['مجمع الأفنيوز مول', 'أسواق الري التجارية المتكاملة']
        },
        {
          name_ar: 'الفروانية',
          name_en: 'Farwaniya',
          is_capital: false,
          population_approx: '310 ألف نسمة',
          description_ar: 'مركز سكني وتجاري نشط للغاية يضم مئات المحلات والأسواق والخدمات العائلية والمصرفية.',
          cost_index: 55,
          safety_score: 92,
          internet_score: 92,
          famous_industries: ['الذهب والمجوهرات والملابس', 'الخدمات المصرفية والحوالات', 'المطاعم الشعبية والتراثية'],
          famous_landmarks: ['سوق الفروانية ومجمعات الذهب', 'حديقة الفروانية العامة']
        }
      ]
    }
  ],

  // 🇧🇭 مملكة البحرين (كافة المحافظات ومدنها)
  BH: [
    {
      id: 'bh_capital',
      country_code: 'BH',
      province_name_ar: 'محافظة العاصمة',
      province_name_en: 'Capital Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'مدينة المنامة',
      area_km2: 90,
      population_approx: '535 ألف نسمة',
      geographic_location_ar: 'الساحل الشمالي الشرقي لجزيرة البحرين، المركز المالي والإقليمي الأول للمصارف الإسلامية.',
      economic_specialization_ar: 'الخدمات المصرفية والمالية الإسلامية، التكنولوجيا المالية (FinTech)، والسياحة الثقافية.',
      famous_landmarks_ar: ['مرفأ البحرين المالي', 'مركز البحرين التجاري العالمي', 'باب البحرين وسوق المنامة', 'متحف البحرين الوطني'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'المنامة',
          name_en: 'Manama',
          is_capital: true,
          population_approx: '350 ألف نسمة',
          description_ar: 'عاصمة البحرين والواحة المالية العالمية المفتوحة ومركز التسامح والتجارة والمؤسسات المصرفية.',
          cost_index: 68,
          safety_score: 96,
          internet_score: 95,
          famous_industries: ['الصيرفة والتمويل الإسلامي', 'التكنولوجيا المالية وحاضنات الابتكار', 'المؤتمرات والمعارض الدولية'],
          famous_landmarks: ['مرفأ البحرين المالي', 'باب البحرين التاريخي', 'خليج البحرين (Bahrain Bay)']
        },
        {
          name_ar: 'الجفير',
          name_en: 'Juffair',
          is_capital: false,
          population_approx: '85 ألف نسمة',
          description_ar: 'الضاحية الحديثة النابضة بالحياة الفندقية ومقر مركز عيسى الثقافي ومسجد الفاتح الإسلامي الكبير.',
          cost_index: 72,
          safety_score: 95,
          internet_score: 96,
          famous_industries: ['الضيافة الفندقية والشقق السكنية الفاخرة', 'المطاعم العالمية', 'المراكز الثقافية والدينية'],
          famous_landmarks: ['جامع أحمد الفاتح الكبير', 'مركز عيسى الثقافي', 'الممشى السياحي بالجفير']
        }
      ]
    },
    {
      id: 'bh_muharraq',
      country_code: 'BH',
      province_name_ar: 'محافظة المحرق',
      province_name_en: 'Muharraq Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'مدينة المحرق',
      area_km2: 67,
      population_approx: '270 ألف نسمة',
      geographic_location_ar: 'جزيرة المحرق شمال شرق المنامة، مهد صيد اللؤلؤ وبوابة البحرين الجوية.',
      economic_specialization_ar: 'الملاحة الجوية الدولية بمطار البحرين، طريق اللؤلؤ المسجل باليونسكو، والخدمات اللوجستية.',
      famous_landmarks_ar: ['مطار البحرين الدولي', 'مسار اللؤلؤ العالمي (اليونسكو)', 'قلعة عراد التاريخية', 'جزر أمواج'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'المحرق',
          name_en: 'Muharraq',
          is_capital: false,
          population_approx: '180 ألف نسمة',
          description_ar: 'العاصمة التاريخية للبحرين وعاصمة الثقافة والفنون الإسلامية وموطن بيوت التراث واللؤلؤ المعاد ترميمها.',
          cost_index: 62,
          safety_score: 97,
          internet_score: 94,
          famous_industries: ['السياحة التراثية والتاريخية', 'صناعة الحلوى البحرينية التقليدية', 'الحرف البحرية واللؤلؤ'],
          famous_landmarks: ['بيت الشيخ عيسى بن علي', 'مركز الشيخ إبراهيم للثقافة والبحوث', 'سوق القيصرية']
        },
        {
          name_ar: 'جزر أمواج',
          name_en: 'Amwaj Islands',
          is_capital: false,
          population_approx: '40 ألف نسمة',
          description_ar: 'مجموعة جزر اصطناعية رائدة للتملك الحر والسياحة والرياضات البحرية والمقاهي العائمة.',
          cost_index: 78,
          safety_score: 98,
          internet_score: 96,
          famous_industries: ['العقارات الفاخرة والتملك الحر', 'الرياضات المائية والغوص', 'المطاعم الشاطئية'],
          famous_landmarks: ['مجمع اللاجون المائي', 'شواطئ أمواج الهادئة', 'مارينا اليخوت']
        }
      ]
    },
    {
      id: 'bh_southern',
      country_code: 'BH',
      province_name_ar: 'المحافظة الجنوبية',
      province_name_en: 'Southern Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'الرفاع',
      area_km2: 480,
      population_approx: '315 ألف نسمة',
      geographic_location_ar: 'المحافظة الأكبر مساحة وتشمل وسط وجنوب جزيرة البحرين وحلبة الفورمولا 1 ومصفاة بابكو.',
      economic_specialization_ar: 'سباقات الفورمولا 1 الدولية، الطاقة وتكرير البترول، محميات الحياة الفطرية، ومنتجعات درة البحرين.',
      famous_landmarks_ar: ['حلبة البحرين الدولية للفورمولا 1', 'شجرة الحياة الأسطورية', 'قلعة الرفاع', 'درة البحرين'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'الرفاع',
          name_en: 'Riffa',
          is_capital: false,
          population_approx: '150 ألف نسمة',
          description_ar: 'معقل العائلة المالكة والتاريخ العريق وتضم الرفاع الغربي والرفاع الشرقي وأرقى الأحياء السكنية وملاعب الجولف.',
          cost_index: 68,
          safety_score: 98,
          internet_score: 95,
          famous_industries: ['الخدمات الإدارية والعسكرية', 'رياضة الجولف الدولية', 'التجارة الراقية'],
          famous_landmarks: ['قلعة الرفاع (قلعة الشيخ سلمان)', 'نادي الرفاع للجولف', 'سوق الرفاع الشرقي']
        },
        {
          name_ar: 'الصخير',
          name_en: 'Sakhir',
          is_capital: false,
          population_approx: '35 ألف نسمة',
          description_ar: 'منطقة الفعاليات الكبرى الصحراوية ومعقل سباقات الجائزة الكبرى للفورمولا 1 والمعارض الدولية للطيران.',
          cost_index: 70,
          safety_score: 97,
          internet_score: 95,
          famous_industries: ['رياضة المحركات والفعاليات العالمية', 'محميات الحياة الفطرية', 'التخييم والأنشطة الشتوية'],
          famous_landmarks: ['حلبة البحرين الدولية', 'محمية العرين الطبيعية', 'مركز البحرين الدولي للمعارض الجديد']
        }
      ]
    }
  ],

  // 🇵🇸 دولة فلسطين (محافظات الضفة الغربية والقدس الشريف وقطاع غزة ومدنها)
  PS: [
    {
      id: 'ps_jerusalem',
      country_code: 'PS',
      province_name_ar: 'محافظة القدس الشريف',
      province_name_en: 'Jerusalem Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'القدس الشريف',
      area_km2: 345,
      population_approx: '480 ألف نسمة',
      geographic_location_ar: 'قلب فلسطين وجبال القدس، مهد الرسالات السماوية والعاصمة الأبدية لفلسطين.',
      economic_specialization_ar: 'السياحة الدينية والثقافية العالمية، التعليم العالي والمقدسي، والأسواق التراثية العريقة.',
      famous_landmarks_ar: ['المسجد الأقصى وقبة الصخرة المشرفة', 'كنيسة القيامة', 'أسوار القدس وأبوابها التاريخية (باب العامود)', 'جبل الزيتون'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'القدس الشرقية',
          name_en: 'East Jerusalem',
          is_capital: true,
          population_approx: '350 ألف نسمة',
          description_ar: 'البلدة القديمة ومحيطها، المركز الروحي والحضاري المقدس وميدان التجارة التراثية والأسواق القديمة.',
          cost_index: 70,
          safety_score: 75,
          internet_score: 85,
          famous_industries: ['السياحة والزيارات الدينية', 'التحف والأعمال الخشبية والصدفية', 'التعليم والتراث المقدس'],
          famous_landmarks: ['المسجد الأقصى المبارك', 'كنيسة القيامة', 'سوق القطانين', 'باب الخليل']
        },
        {
          name_ar: 'العيزرية',
          name_en: 'Al-Eizariya',
          is_capital: false,
          population_approx: '25 ألف نسمة',
          description_ar: 'بلدة تاريخية مقدسة ملاصقة للقدس، موقع ضريح العازر ومعبر التجارة بين القدس وأريحا.',
          cost_index: 48,
          safety_score: 75,
          internet_score: 78,
          famous_industries: ['التجارة والخدمات الحرفية', 'الزراعة التقليدية والزيتون', 'السياحة الدينية'],
          famous_landmarks: ['كنيسة العازر', 'البلدة القديمة بالعيزرية', 'أديرة وادي القلط القريبة']
        }
      ]
    },
    {
      id: 'ps_ramallah',
      country_code: 'PS',
      province_name_ar: 'محافظة رام الله والبيرة',
      province_name_en: 'Ramallah & Al-Bireh',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'رام الله',
      area_km2: 855,
      population_approx: '360 ألف نسمة',
      geographic_location_ar: 'وسط الضفة الغربية، المركز الإداري والتجاري والتقني والمالي الحالي لدولة فلسطين.',
      economic_specialization_ar: 'الخدمات المصرفية، الاتصالات والشركات البرمجية، المنظمات الدولية، والأنشطة الثقافية.',
      famous_landmarks_ar: ['متحف محمود درويش', 'قصر رام الله الثقافي', 'ميدان المنارة', 'جامعة بيرزيت'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'رام الله',
          name_en: 'Ramallah',
          is_capital: false,
          population_approx: '75 ألف نسمة',
          description_ar: 'المدينة الحيوية الصاعدة ومقر المؤسسات الاقتصادية والشركات التقنية والريادية والجامعات العريقة.',
          cost_index: 62,
          safety_score: 78,
          internet_score: 84,
          famous_industries: ['تكنولوجيا المعلومات والبرمجيات', 'المصارف وشركات التأمين', 'الخدمات القانونية والاستشارية'],
          famous_landmarks: ['ميدان المنارة', 'متحف ياسر عرفات', 'سرية رام الله الأولى']
        },
        {
          name_ar: 'البيرة',
          name_en: 'Al-Bireh',
          is_capital: false,
          population_approx: '65 ألف نسمة',
          description_ar: 'المدينة التوأم لرام الله، المركز البلدي والخدماتي والتجاري وتضم كبرى المقرات المؤسسية.',
          cost_index: 60,
          safety_score: 78,
          internet_score: 82,
          famous_industries: ['التجارة العامة والخدمات', 'الصناعات الغذائية والأدوية', 'المراكز الثقافية والرياضية'],
          famous_landmarks: ['استاد فيصل الحسيني الدولي', 'مبنى بلدية البيرة', 'مسجد البيرة الكبير']
        }
      ]
    },
    {
      id: 'ps_nablus',
      country_code: 'PS',
      province_name_ar: 'محافظة نابلس',
      province_name_en: 'Nablus Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'مدينة نابلس',
      area_km2: 605,
      population_approx: '415 ألف نسمة',
      geographic_location_ar: 'شمال الضفة الغربية بين جبلي عيبال وجرزيم، عاصمة الاقتصاد والتعليم والصناعة التاريخية.',
      economic_specialization_ar: 'الصناعات الغذائية (الكنافة والحلويات)، صابون زيت الزيتون النابلسي، النسيج، والتعليم بجامعة النجاح.',
      famous_landmarks_ar: ['البلدة القديمة بنابلس ومصابنها التاريخية', 'جامعة النجاح الوطنية', 'برج الساعة العثماني (المنارة)', 'بئر يعقوب'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'نابلس (جبل النار)',
          name_en: 'Nablus',
          is_capital: false,
          population_approx: '175 ألف نسمة',
          description_ar: 'دمشق الصغرى، أقدم مدن التجارة والصناعة التقليدية والحديثة وموطن الحلويات والصابون والمطابع.',
          cost_index: 52,
          safety_score: 74,
          internet_score: 80,
          famous_industries: ['صناعة الصابون النابلسي النقي', 'الحلويات الشرقية والكنافة النابلسية', 'الصناعات المعدنية والبلاستيكية'],
          famous_landmarks: ['خان التجار والبلدة القديمة', 'جامع النصر', 'سوق البصل العتيق']
        },
        {
          name_ar: 'سبسطية',
          name_en: 'Sebastia',
          is_capital: false,
          population_approx: '12 ألف نسمة',
          description_ar: 'الجوهرة الأثرية الرومانية والبيزنطية وعاصمة السياحة التاريخية في شمال الضفة.',
          cost_index: 45,
          safety_score: 76,
          internet_score: 75,
          famous_industries: ['السياحة والآثار والتنقيب', 'زراعة الزيتون واللوزيات', 'الحرف التقليدية والمطاعم الشعبية'],
          famous_landmarks: ['المدرج الروماني الأثري', 'شارع الأعمدة', 'مسجد النبي يحيى التاريخي']
        }
      ]
    },
    {
      id: 'ps_hebron',
      country_code: 'PS',
      province_name_ar: 'محافظة الخليل',
      province_name_en: 'Hebron Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'مدينة الخليل',
      area_km2: 997,
      population_approx: '780 ألف نسمة',
      geographic_location_ar: 'جنوب الضفة الغربية، المحافظة الأكثر سكاناً والعمود الفقري للصناعة والتجارة الوطنية.',
      economic_specialization_ar: 'صناعة الجلود والأحذية، خزف وزجاج الخليل، الحجر والرخام (الذهب الأبيض)، وتجارة التجزئة.',
      famous_landmarks_ar: ['الحرم الإبراهيمي الشريف', 'البلدة القديمة وأسواق الخليل', 'مصانع الزجاج والخزف اليدوي', 'بلوط إبراهيم'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'الخليل (مدينة خليل الرحمن)',
          name_en: 'Hebron',
          is_capital: false,
          population_approx: '230 ألف نسمة',
          description_ar: 'عاصمة الصناعة الفلسطينية ومقر أقدم المصانع والورش والحرف اليدوية وأنشط الأسواق التجارية.',
          cost_index: 48,
          safety_score: 72,
          internet_score: 78,
          famous_industries: ['صناعة الجلود والأحذية المتطورة', 'استخراج وتشكيل الحجر والرخام', 'صناعة الزجاج المنفوخ والخزف'],
          famous_landmarks: ['الحرم الإبراهيمي الشريف', 'سوق القزازين', 'متحف الخليل الأثري']
        },
        {
          name_ar: 'حلحول',
          name_en: 'Halhul',
          is_capital: false,
          population_approx: '35 ألف نسمة',
          description_ar: 'أعلى بلدة مأهولة في فلسطين وتشتهر بأجود أنواع العنب الفلسطيني والمحاصيل الزراعية البستانية.',
          cost_index: 44,
          safety_score: 76,
          internet_score: 76,
          famous_industries: ['زراعة وتجارة العنب والدبس والزبيب', 'التجارة الزراعية', 'الصناعات الغذائية البيتية'],
          famous_landmarks: ['مسجد النبي يونس الأثري', 'كروم العنب الجبلية', 'عين الذروة التاريخية']
        }
      ]
    },
    {
      id: 'ps_bethlehem',
      country_code: 'PS',
      province_name_ar: 'محافظة بيت لحم',
      province_name_en: 'Bethlehem Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'مدينة بيت لحم',
      area_km2: 659,
      population_approx: '235 ألف نسمة',
      geographic_location_ar: 'جنوب القدس مباشرة، مهد ميلاد السيد المسيح عليه السلام وأبرز وجهات السياحة العالمية.',
      economic_specialization_ar: 'السياحة الدينية والضيافة، صناعة خشب الزيتون والصدف، التعليم الجامعي، والمهرجانات الثقافية.',
      famous_landmarks_ar: ['كنيسة المهد ومغارة الحليب', 'ساحة المهد وشارع النجمة', 'دير مار سابا المعلق بالوادي', 'برك سليمان الأثرية'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'بيت لحم',
          name_en: 'Bethlehem',
          is_capital: false,
          population_approx: '35 ألف نسمة',
          description_ar: 'مدينة السلام والمهد، تستقبل سنوياً ملايين الزوار وتضم أرقى ورش النحت على خشب الزيتون والتطريز الفلسطيني.',
          cost_index: 54,
          safety_score: 78,
          internet_score: 80,
          famous_industries: ['السياحة الدينية والفندقية', 'نحت خشب الزيتون والصدف', 'التطريز والحرف التقليدية'],
          famous_landmarks: ['كنيسة المهد', 'ساحة المهد وبلدية بيت لحم', 'متحف بيت لحم الدولي']
        },
        {
          name_ar: 'بيت جالا',
          name_en: 'Beit Jala',
          is_capital: false,
          population_approx: '18 ألف نسمة',
          description_ar: 'بلدة جبلية ساحرة تشتهر بكروم الزيتون العتيقة وصناعة زيت الزيتون عالي الجودة والمدارس العريقة.',
          cost_index: 55,
          safety_score: 80,
          internet_score: 82,
          famous_industries: ['عصر وتصدير زيت الزيتون البكر', 'المطاعم والضيافة الجبلية', 'المؤسسات التعليمية والطبية'],
          famous_landmarks: ['كنيسة مار نقولا', 'دير كريمزان وبساتينه التاريخية', 'مستشفى الجمعية العربية للتأهيل']
        }
      ]
    },
    {
      id: 'ps_gaza',
      country_code: 'PS',
      province_name_ar: 'محافظة غزة',
      province_name_en: 'Gaza Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'مدينة غزة',
      area_km2: 74,
      population_approx: '720 ألف نسمة',
      geographic_location_ar: 'الساحل الجنوبي لفلسطين على البحر المتوسط، الحاضرة الساحلية التاريخية ومركز الصمود والنشاط الاقتصادي.',
      economic_specialization_ar: 'الصيد البحري، التجارة والأسواق العامة، الصناعات النسيجية، والتعليم الجامعي العريض.',
      famous_landmarks_ar: ['المسجد العمري الكبير التاريخي', 'ميناء غزة القديم', 'قصر الباشا الأثري', 'سوق الزاوية التاريخي'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'غزة (هاشم)',
          name_en: 'Gaza City',
          is_capital: false,
          population_approx: '550 ألف نسمة',
          description_ar: 'إحدى أقدم مدن العالم الساحلية، مركز التجارة والجامعات والصناعات الخفيفة والصيد والمطاعم البحرية.',
          cost_index: 40,
          safety_score: 55,
          internet_score: 72,
          famous_industries: ['الصيد البحري والصناعات السمكية', 'صناعة الفخار التراثي والأثاث', 'الخدمات الأكاديمية والتعليمية'],
          famous_landmarks: ['المسجد العمري الكبير', 'قصر الباشا', 'كورنيش وميناء صيادي غزة']
        },
        {
          name_ar: 'خان يونس',
          name_en: 'Khan Yunis',
          is_capital: false,
          population_approx: '240 ألف نسمة',
          description_ar: 'ثاني كبرى مدن القطاع، عقدة التجارة الجنوبية والزراعة البستانية وتضم قلعة برقوق المملوكية التاريخية.',
          cost_index: 38,
          safety_score: 55,
          internet_score: 70,
          famous_industries: ['الزراعة والحمضيات والخضار', 'التجارة الإقليمية والمواشي', 'الحرف اليدوية والتطريز'],
          famous_landmarks: ['قلعة برقوق التاريخية', 'البلدة القديمة والسوق الأسبوعي', 'مجمع ناصر الطبي']
        }
      ]
    }
  ],

  // 🇸🇾 الجمهورية العربية السورية (كافة المحافظات ومدنها)
  SY: [
    {
      id: 'sy_damascus',
      country_code: 'SY',
      province_name_ar: 'محافظة دمشق',
      province_name_en: 'Damascus Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'مدينة دمشق',
      area_km2: 105,
      population_approx: '2.1 مليون نسمة',
      geographic_location_ar: 'جنوب غرب سوريا وسفح جبل قاسيّون، أقدم عاصمة مأهولة في التاريخ والمركز السياسي والتجاري.',
      economic_specialization_ar: 'الصناعات الحرفية والدمشقية (الموزاييك والبروكار)، التجارة والأسواق القديمة، والتعليم العالي.',
      famous_landmarks_ar: ['الجامع الأموي الكبير', 'سوق الحميدية الشهير', 'قصر العظم التراثي', 'جبل قاسيون ومطل المدينة'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'دمشق (الفيحاء)',
          name_en: 'Damascus',
          is_capital: true,
          population_approx: '1.8 مليون نسمة',
          description_ar: 'قلب الشام وأم الحضارات، تجمع بين عبق التاريخ وأسواق الحرير والتوابل والصروح المعمارية الخالدة.',
          cost_index: 35,
          safety_score: 65,
          internet_score: 62,
          famous_industries: ['الحرير الدمشقي والبروكار', 'الموزاييك والأرابيسك الخشبي', 'الصناعات الغذائية والتوابل'],
          famous_landmarks: ['الجامع الأموي', 'سوق الحميدية', 'باب شرقي وباب توما']
        },
        {
          name_ar: 'المزة',
          name_en: 'Mezzeh',
          is_capital: false,
          population_approx: '300 ألف نسمة',
          description_ar: 'الحي الإداري والدبلوماسي والجامعي الراقي، يضم الوزارات والسفارات وجامعة دمشق ومراكز الأبحاث.',
          cost_index: 42,
          safety_score: 72,
          internet_score: 68,
          famous_industries: ['الخدمات الحكومية والدبلوماسية', 'التعليم الجامعي والبحثي', 'الخدمات المصرفية والتجارية'],
          famous_landmarks: ['مدينة المعارض القديمة', 'جامعة دمشق (مجمع المزة)', 'أوتوستراد المزة التجاري']
        }
      ]
    },
    {
      id: 'sy_aleppo',
      country_code: 'SY',
      province_name_ar: 'محافظة حلب',
      province_name_en: 'Aleppo Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'مدينة حلب',
      area_km2: 18482,
      population_approx: '3.9 مليون نسمة',
      geographic_location_ar: 'شمال سوريا، عاصمة الصناعة السورية والتجارة التاريخية على طريق الحرير وأكبر محافظات سوريا سكاناً.',
      economic_specialization_ar: 'الصناعات النسيجية والغزل، صابون الغار الحلبي الشهير عالمياً، الصناعات الهندسية، والطهي الحلبي التراثي.',
      famous_landmarks_ar: ['قلعة حلب الصامدة', 'أسواق حلب المسقوفة (أطول أسواق مسقوفة بالعالم)', 'خان الشونة الأثري', 'الجامع الكبير بحلب'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'حلب (الشهباء)',
          name_en: 'Aleppo',
          is_capital: false,
          population_approx: '2.5 مليون نسمة',
          description_ar: 'العاصمة الاقتصادية والصناعية العريقة لسوريا وموئل الموسيقى والقدود الحلبية وصناعة الغار والأقمشة.',
          cost_index: 32,
          safety_score: 62,
          internet_score: 58,
          famous_industries: ['صناعة النسيج والأقمشة الفاخرة', 'صابون الغار الحلبي الطبيعي', 'الصناعات الغذائية والحلويات الحلبية'],
          famous_landmarks: ['قلعة حلب التاريخية', 'سوق المدينة العتيق', 'محطة بغداد للقطارات']
        },
        {
          name_ar: 'الشيخ نجار',
          name_en: 'Sheikh Najjar',
          is_capital: false,
          population_approx: '80 ألف نسمة',
          description_ar: 'المدينة الصناعية الأكبر في سوريا، مركز مصانع الغزل والنسيج والصناعات الكيميائية والغذائية الحديثة.',
          cost_index: 30,
          safety_score: 65,
          internet_score: 60,
          famous_industries: ['الصناعات الهندسية والميكانيكية', 'تجهيز وصباغة الأقمشة', 'الصناعات الدوائية والتحويلية'],
          famous_landmarks: ['المدينة الصناعية بالشيخ نجار', 'المجمعات التقنية والمخازن اللوجستية']
        }
      ]
    },
    {
      id: 'sy_homs',
      country_code: 'SY',
      province_name_ar: 'محافظة حمص',
      province_name_en: 'Homs Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'مدينة حمص',
      area_km2: 42223,
      population_approx: '1.8 مليون نسمة',
      geographic_location_ar: 'وسط سوريا، أكبر المحافظات مساحة وعقدة المواصلات وخطوط السكك والأنابيب بين الساحل والداخل.',
      economic_specialization_ar: 'تكرير البترول، الصناعات الكيماوية والفوسفات، إنتاج الحلاوة الحمصية، والآثار بتدمر.',
      famous_landmarks_ar: ['مدينة تدمر الأثرية ومسرحها الروماني', 'قلعة الحصن (Crac des Chevaliers)', 'جامع خالد بن الوليد', 'بحيرة قطينة'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'حمص (مدينة ابن الوليد)',
          name_en: 'Homs',
          is_capital: false,
          population_approx: '800 ألف نسمة',
          description_ar: 'قلب سوريا النابض وملتقى الطرق الاستراتيجية وتشتهر بروح أهلها الطيبة ومصفاة النفط والصناعات الغذائية.',
          cost_index: 30,
          safety_score: 64,
          internet_score: 58,
          famous_industries: ['تكرير وتوزيع المشتقات النفطية', 'صناعة الغزل والألبسة', 'الصناعات الغذائية والحلاوة الحمصية'],
          famous_landmarks: ['جامع خالد بن الوليد', 'سوق حمص المسقوف', 'ساحة الساعة الجديدة']
        },
        {
          name_ar: 'تدمر',
          name_en: 'Palmyra',
          is_capital: false,
          population_approx: '55 ألف نسمة',
          description_ar: 'عروس البادية وعاصمة الملكة زنوبيا وإحدى أعظم الوجهات الأثرية والتاريخية في الشرق الأدنى.',
          cost_index: 28,
          safety_score: 58,
          internet_score: 50,
          famous_industries: ['السياحة الأثرية والتراثية العالمية', 'استخراج الفوسفات والأملاح', 'الزراعة الصحراوية والتمور'],
          famous_landmarks: ['المسرح الروماني بتدمر', 'معبد بل وقوس النصر', 'وادي القبور وقلعة فخر الدين المعني']
        }
      ]
    },
    {
      id: 'sy_lattakia',
      country_code: 'SY',
      province_name_ar: 'محافظة اللاذقية',
      province_name_en: 'Latakia Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'مدينة اللاذقية',
      area_km2: 2297,
      population_approx: '1.25 مليون نسمة',
      geographic_location_ar: 'شمال غرب سوريا على البحر المتوسط، الميناء البحري الأول والواجهة الساحلية والسياحية الخضراء.',
      economic_specialization_ar: 'التجارة البحرية والشحن الدولي، السياحة الشاطئية والجبلية (صلنفة وكسب)، وزراعة الحمضيات والتبغ.',
      famous_landmarks_ar: ['ميناء اللاذقية التجاري', 'مملكة أوغاريت (أول أبجدية في التاريخ)', 'قلعة صلاح الدين الأيوبي', 'منتجع الشاطئ الأزرق'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'اللاذقية',
          name_en: 'Latakia',
          is_capital: false,
          population_approx: '550 ألف نسمة',
          description_ar: 'عروس الساحل السوري وعاصمة البحرية والتجارة والملاحة وجامعة تشرين والمنتجعات الشاطئية.',
          cost_index: 34,
          safety_score: 72,
          internet_score: 65,
          famous_industries: ['إدارة الموانئ والشحن والتفريغ', 'السياحة الشاطئية والاصطياف', 'تعبئة وتصدير الحمضيات وزيت الزيتون'],
          famous_landmarks: ['ميناء اللاذقية', 'الشاطئ الأزرق', 'متحف اللاذقية القومي']
        },
        {
          name_ar: 'جبلة',
          name_en: 'Jableh',
          is_capital: false,
          population_approx: '110 ألف نسمة',
          description_ar: 'مدينة ساحلية تاريخية عريقة تضم أضخم مدرج روماني ساحلي وميناء صيد ومزارع البرتقال الخصبة.',
          cost_index: 30,
          safety_score: 72,
          internet_score: 62,
          famous_industries: ['الصيد البحري والإنتاج السمكي', 'زراعة الحمضيات والخضار المبكرة', 'السياحة والآثار'],
          famous_landmarks: ['مدرج جبلة الروماني الأثري', 'جامع ومقام السلطان إبراهيم بن أدهم', 'كورنيش جبلة البحري']
        }
      ]
    }
  ],

  // 🇱🇧 الجمهورية اللبنانية (كافة المحافظات ومدنها)
  LB: [
    {
      id: 'lb_beirut',
      country_code: 'LB',
      province_name_ar: 'محافظة بيروت',
      province_name_en: 'Beirut Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'مدينة بيروت',
      area_km2: 20,
      population_approx: '430 ألف نسمة',
      geographic_location_ar: 'شبه جزيرة صخرية على البحر المتوسط، عاصمة الفكر والصحافة والإبداع والطب والجامعات العالمية.',
      economic_specialization_ar: 'الخدمات الإبداعية والتصميم، المصارف والتمويل، التعليم الجامعي المتقدم (الجامعة الأمريكية AUB)، والضيافة.',
      famous_landmarks_ar: ['صخرة الروشة الشهيرة', 'وسط بيروت التجاري (Solidaire)', 'شارع الحمرا التاريخي', 'متحف بيروت الوطني'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'بيروت',
          name_en: 'Beirut',
          is_capital: true,
          population_approx: '380 ألف نسمة',
          description_ar: 'سويسرا الشرق وعاصمة الثقافة والحرية الفكرية وفنون الطهي والمقاهي العريقة والمشافي الرائدة.',
          cost_index: 55,
          safety_score: 68,
          internet_score: 72,
          famous_industries: ['التعليم الجامعي الدولي والرعاية الطبية', 'التصميم والأزياء والفنون المعاصرة', 'المطاعم والضيافة الفاخرة'],
          famous_landmarks: ['صخرة الروشة', 'ميدان النجمة وبرج الساعة', 'حي الجميزة ومار مخايل']
        },
        {
          name_ar: 'الحمرا',
          name_en: 'Hamra',
          is_capital: false,
          population_approx: '50 ألف نسمة',
          description_ar: 'معقل المثقفين والصحافة والمكتبات ومسارح بيروت ومقر الجامعة الأمريكية ومستشفاها العريق.',
          cost_index: 52,
          safety_score: 70,
          internet_score: 74,
          famous_industries: ['النشر والصحافة والمكتبات', 'الرعاية الصحية الجامعية', 'المقاهي التراثية والمسارح'],
          famous_landmarks: ['شارع الحمرا الرئيسي', 'الجامعة الأمريكية في بيروت (AUB)', 'مسرح المدينة']
        }
      ]
    },
    {
      id: 'lb_mount_lebanon',
      country_code: 'LB',
      province_name_ar: 'محافظة جبل لبنان',
      province_name_en: 'Mount Lebanon Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'بعبدا',
      area_km2: 1968,
      population_approx: '1.85 مليون نسمة',
      geographic_location_ar: 'تحتضن العاصمة بيروت وتمتد من السواحل إلى قمم جبال صنين، قلب الاصطياف والسياحة الطبيعية.',
      economic_specialization_ar: 'السياحة والتزلج الجبلي (فاريا)، تجارة التجزئة، الصناعات الخفيفة، والمؤسسات الأكاديمية.',
      famous_landmarks_ar: ['مغارة جعيتا العجيبة', 'سيدة حريصا وتلفريك جونيه', 'قلعة جبيل (بيبلوس - اليونسكو)', 'قصر بيت الدين الشهابي'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'جونيه',
          name_en: 'Jounieh',
          is_capital: false,
          population_approx: '120 ألف نسمة',
          description_ar: 'عروس الخليج الساحلي وسفح حريصا وموطن الكازينو والتلفريك وأرقى المنتجعات واليخوت.',
          cost_index: 56,
          safety_score: 78,
          internet_score: 75,
          famous_industries: ['السياحة الترفيهية والشاطئية', 'التلفريك والضيافة الجبلية', 'اليخوت والرياضات المائية'],
          famous_landmarks: ['تلفريك جونيه وسيدة لبنان بحريصا', 'كازينو لبنان', 'سوق جونيه القديم']
        },
        {
          name_ar: 'جبيل (بيبلوس)',
          name_en: 'Byblos (Jbeil)',
          is_capital: false,
          population_approx: '50 ألف نسمة',
          description_ar: 'أقدم ميناء فينيقي مأهول ومصدر أول أبجدية صوتية في العالم ومدينة اليونسكو للتراث والمهرجانات.',
          cost_index: 54,
          safety_score: 82,
          internet_score: 76,
          famous_industries: ['السياحة الثقافية والآثار العالمية', 'مهرجانات الموسيقى الدولية', 'المأكولات البحرية الفاخرة'],
          famous_landmarks: ['قلعة جبيل الصليبية والفينيقية', 'ميناء جبيل التاريخي القديم', 'أسواق جبيل الحجرية الرومانسية']
        }
      ]
    },
    {
      id: 'lb_north',
      country_code: 'LB',
      province_name_ar: 'محافظة لبنان الشمالي',
      province_name_en: 'North Lebanon Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'مدينة طرابلس',
      area_km2: 1236,
      population_approx: '820 ألف نسمة',
      geographic_location_ar: 'شمال لبنان، وتضم طرابلس عاصمة الشمال وغابات أرز الرب ووادي قاديشا المقدس.',
      economic_specialization_ar: 'صناعة الحلويات الشرقية، صابون طرابلس الحرفي، الميناء التجاري، والسياحة البيئية ووادي قنوبين.',
      famous_landmarks_ar: ['قلعة طرابلس (قلعة سان جيل)', 'غابة أرز الرب بالبشري', 'وادي قاديشا المقدس (اليونسكو)', 'سوق الصاغة والعطارين بطرابلس'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'طرابلس (الفيحاء)',
          name_en: 'Tripoli',
          is_capital: false,
          population_approx: '500 ألف نسمة',
          description_ar: 'عاصمة المماليك الثانية بعد القاهرة وأكبر مدن الشمال وموطن الحرف النحاسية والحلويات الشرقية المشهورة عالمياً.',
          cost_index: 40,
          safety_score: 65,
          internet_score: 68,
          famous_industries: ['الحلويات الشرقية الفاخرة', 'الصابون البلدي العطري', 'النحاسيات والأسواق التراثية المسقوفة'],
          famous_landmarks: ['قلعة طرابلس التاريخية', 'الجامع المنصوري الكبير', 'خان الخياطين والصابون']
        },
        {
          name_ar: 'بشري (مدينة الأرز)',
          name_en: 'Bsharri',
          is_capital: false,
          population_approx: '25 ألف نسمة',
          description_ar: 'بلدة جبران خليل جبران وموطن غابات الأرز الدهرية ومراكز التزلج على الثلوج في أعلى قمم لبنان.',
          cost_index: 46,
          safety_score: 84,
          internet_score: 70,
          famous_industries: ['السياحة الشتوية والتزلج', 'متحف وتراث جبران خليل جبران', 'الزراعة الجبلية (التفاح والكرز)'],
          famous_landmarks: ['متحف ومغارة جبران خليل جبران', 'غابة أرز الرب الشامخة', 'منحدرات التزلج في الأرز']
        }
      ]
    },
    {
      id: 'lb_south',
      country_code: 'LB',
      province_name_ar: 'محافظة لبنان الجنوبي',
      province_name_en: 'South Lebanon Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'مدينة صيدا',
      area_km2: 930,
      population_approx: '590 ألف نسمة',
      geographic_location_ar: 'الساحل الجنوبي للبنان، يضم صيدا وصور الفينيقيتين ومواقع الآثار البحرية العالمية.',
      economic_specialization_ar: 'صيد الأسماك والموانئ، زراعة الحمضيات والموز، الحلويات الصيداوية (السنيورة)، والآثار الرومانية بصور.',
      famous_landmarks_ar: ['قلعة صيدا البحرية', 'متحف قصر دبانة التاريخي', 'مواقع صور الأثرية ومسرح السباق الروماني (اليونسكو)', 'مرفأ الصيادين بصيدا'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'صيدا (بوابة الجنوب)',
          name_en: 'Sidon (Saida)',
          is_capital: false,
          population_approx: '260 ألف نسمة',
          description_ar: 'عاصمة الجنوب وحاضنة القلاع البحرية والأسواق القديمة الشهيرة بصناعة الصابون والحلاوة الصيداوية.',
          cost_index: 42,
          safety_score: 72,
          internet_score: 70,
          famous_industries: ['صناعة الصابون العطري بمتحف الصابون', 'الحلويات الصيداوية الأصيلة', 'الصيد البحري والتجارة'],
          famous_landmarks: ['قلعة صيدا البحرية', 'خان الإفرنج', 'متحف الصابون بقصر عودة']
        },
        {
          name_ar: 'صور',
          name_en: 'Tyre (Sour)',
          is_capital: false,
          population_approx: '140 ألف نسمة',
          description_ar: 'سيدة البحار الفينيقية ومصدر الصباغ الأرجواني وموطن أعظم ميدان سباق عربات روماني وشواطئ الرمل الذهبية.',
          cost_index: 44,
          safety_score: 70,
          internet_score: 68,
          famous_industries: ['السياحة الأثرية والتاريخية (اليونسكو)', 'الصيد البحري ومحمية السلاحف', 'المطاعم البحرية التراثية'],
          famous_landmarks: ['ميدان سباق الخيل الروماني (Hippodrome)', 'الآثار البحرية الفينيقية', 'محمية شاطئ صور الطبيعية']
        }
      ]
    }
  ],

  // 🇾🇪 الجمهورية اليمنية (كافة المحافظات ومدنها)
  YE: [
    {
      id: 'ye_sanaa',
      country_code: 'YE',
      province_name_ar: 'أمانة العاصمة وصنعاء',
      province_name_en: 'Sanaa Municipality',
      type_label_ar: 'محافظة / أمانة العاصمة',
      administrative_capital_ar: 'مدينة صنعاء',
      area_km2: 12150,
      population_approx: '3.3 مليون نسمة',
      geographic_location_ar: 'وسط المرتفعات الجبلية الغربية لليمن بارتفاع 2200م، عاصمة اليمن وأحد أروع متاحف العمارة الطينية الحية.',
      economic_specialization_ar: 'العمارة التراثية والقمريات الزجاجية، صناعة الجنابي والفضيات، التجارة وسوق الملح، والبن اليمني.',
      famous_landmarks_ar: ['صنعاء القديمة (اليونسكو)', 'باب اليمن التاريخي', 'جامع الصالح الكبير', 'دار الحجر الأسطوري بوادي ظهر'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'صنعاء القديمة',
          name_en: 'Old Sanaa',
          is_capital: true,
          population_approx: '1.9 مليون نسمة',
          description_ar: 'جوهرة التراث الإنساني ومبانيها الشاهقة المزينة بالجبس والقمريات الملونة وأسواق البهارات والفضة.',
          cost_index: 30,
          safety_score: 55,
          internet_score: 50,
          famous_industries: ['حرف الفضة والعقيق اليماني', 'صناعة القمريات والجبس المعماري', 'تجارة البن اليمني الأصيل'],
          famous_landmarks: ['باب اليمن وسوق الملح', 'الجامع الكبير بصنعاء', 'منازل البرج الطينية التراثية']
        },
        {
          name_ar: 'وادي ظهر',
          name_en: 'Wadi Dahr',
          is_capital: false,
          population_approx: '110 ألف نسمة',
          description_ar: 'واحة خضراء غناء وبساتين أعناب وموقع دار الحجر الشهير المنحوت فوق صخرة عملاقة.',
          cost_index: 28,
          safety_score: 60,
          internet_score: 48,
          famous_industries: ['زراعة الأعناب والرمان واللوز', 'السياحة البيئية والمعمارية', 'الحرف التراثية'],
          famous_landmarks: ['قصر دار الحجر التاريخي', 'بساتين وادي ظهر']
        }
      ]
    },
    {
      id: 'ye_aden',
      country_code: 'YE',
      province_name_ar: 'محافظة عدن',
      province_name_en: 'Aden Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'مدينة عدن',
      area_km2: 760,
      population_approx: '1.05 مليون نسمة',
      geographic_location_ar: 'شبه جزيرة بركانية طبيعية على خليج عدن وباب المندب، العاصمة الاقتصادية والميناء الطبيعي التاريخي.',
      economic_specialization_ar: 'الملاحة البحرية الدولية وتزويد السفن بالوقود، صيد وتصدير الأسماك، والمصافي والتجارة الحرة.',
      famous_landmarks_ar: ['صهاريج عدن التاريخية (صهاريج الطويلة)', 'قلعة صيرة الصامدة', 'فوهة البركان (كريتر)', 'جبل شمسين وساعة بيغ بن عدن'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'عدن (كريتر والمعلا)',
          name_en: 'Aden (Crater & Mualla)',
          is_capital: false,
          population_approx: '600 ألف نسمة',
          description_ar: 'القلب التاريخي والبحري لعدن الواقع داخل فوهة البركان الخامد وشارع الميناء وصوامع الغلال وسوق الحرير.',
          cost_index: 34,
          safety_score: 60,
          internet_score: 55,
          famous_industries: ['الملاحة البحرية وخدمات الموانئ', 'التجارة العامة والشحن والتخزين', 'الصناعات الغذائية والسمكية'],
          famous_landmarks: ['صهاريج عدن التاريخية', 'قلعة صيرة البحرية', 'متحف عدن للآثار']
        },
        {
          name_ar: 'الخور مكسر والبريقة',
          name_en: 'Khor Maksar & Buraiqa',
          is_capital: false,
          population_approx: '350 ألف نسمة',
          description_ar: 'منطقة الساحل والمطار الدولي ومصفاة عدن والشواطئ السياحية والمرافق الدبلوماسية.',
          cost_index: 32,
          safety_score: 62,
          internet_score: 55,
          famous_industries: ['تكرير وتخزين المشتقات النفطية', 'السياحة الشاطئية والضيافة', 'الخدمات اللوجستية والمطار'],
          famous_landmarks: ['مطار عدن الدولي', 'ساحل أبين وكورنيش قحطان', 'مصفاة البريقة']
        }
      ]
    },
    {
      id: 'ye_hadramout',
      country_code: 'YE',
      province_name_ar: 'محافظة حضرموت',
      province_name_en: 'Hadhramaut Governorate',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'المكلا',
      area_km2: 191737,
      population_approx: '1.55 مليون نسمة',
      geographic_location_ar: 'شرق اليمن، أكبر محافظات البلاد مساحة، مهد الحضارات التجارية البحرية ووادي حضرموت وناطحات الطين.',
      economic_specialization_ar: 'إنتاج العسل الدوعني (أغلى عسل في العالم)، استخراج النفط، العمارة الطينية، والتجارة والأسماك.',
      famous_landmarks_ar: ['مدينة شبام حضرموت (مانهاتن الصحراء)', 'قصر سيئون الطيني التاريخي', 'خور المكلا وقصر القعيطي', 'وادي دوعن والعسل الملكي'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'المكلا',
          name_en: 'Mukalla',
          is_capital: false,
          population_approx: '550 ألف نسمة',
          description_ar: 'عروس بحر العرب وحاضرة ساحل حضرموت الآمنة والمتميزة بمينائها وتجارة الأسماك والمطاعم البحرية.',
          cost_index: 35,
          safety_score: 75,
          internet_score: 62,
          famous_industries: ['صيد وتجميد وتصدير الأسماك والتونة', 'الخدمات المصرفية والتجارة العامة', 'الملاحة والتخليص الجمركي'],
          famous_landmarks: ['خور المكلا والجسر الصيني', 'حصن الغويزي التاريخي', 'قصر السلطان القعيطي']
        },
        {
          name_ar: 'شبام وسيئون (وادي حضرموت)',
          name_en: 'Shibam & Seiyun',
          is_capital: false,
          population_approx: '220 ألف نسمة',
          description_ar: 'شبام ذات أقدم ناطحات سحاب طينية في العالم ترتفع 8 طوابق منذ القرن السادس عشر، وسيئون عاصمة الوادي.',
          cost_index: 30,
          safety_score: 72,
          internet_score: 55,
          famous_industries: ['إنتاج وتصدير العسل الدوعني الأصيل', 'صناعة الطوب الطيني المعماري', 'زراعة النخيل وإنتاج التمور'],
          famous_landmarks: ['ناطحات سحاب شبام الطينية (اليونسكو)', 'قصر سيئون الكثيري الضخم', 'مسجد ومدرسة تريم العلمية']
        }
      ]
    },
    {
      id: 'ye_socotra',
      country_code: 'YE',
      province_name_ar: 'محافظة أرخبيل سقطرى',
      province_name_en: 'Socotra Archipelago',
      type_label_ar: 'محافظة',
      administrative_capital_ar: 'حديبو',
      area_km2: 3796,
      population_approx: '65 ألف نسمة',
      geographic_location_ar: 'أرخبيل في المحيط الهندي قبالة القرن الأفريقي وبحر العرب، محمية طبيعية ومتحف للتنوع الحيوي الفريد.',
      economic_specialization_ar: 'السياحة البيئية العالمية، صيد الأسماك واللؤلؤ، جمع دم الأخوين والبخور واللبان النادر، والعسل الجبلي.',
      famous_landmarks_ar: ['شجرة دم الأخوين الأسطورية النادرة', 'هضبة دكسم وكثبان عرهر الرملية البيضاء', 'شاطئ قلنسية ومحمية ديتواه (رامسار)', 'كهف هوق'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'حديبو',
          name_en: 'Hadibu',
          is_capital: false,
          population_approx: '35 ألف نسمة',
          description_ar: 'عاصمة أرخبيل سقطرى والمركز الإداري والخدمي وبوابة انطلاق المستكشفين وعلماء الطبيعة والسياح البيئيين.',
          cost_index: 38,
          safety_score: 95,
          internet_score: 55,
          famous_industries: ['السياحة البيئية والاستكشافية', 'الصيد البحري والغوص التراثي', 'الحرف التراثية وصمغ دم الأخوين'],
          famous_landmarks: ['ميناء حديبو القديم', 'سوق حديبو التراثي', 'سلسلة جبال حجهر الشاهقة']
        },
        {
          name_ar: 'قلنسية',
          name_en: 'Qalansiyah',
          is_capital: false,
          population_approx: '18 ألف نسمة',
          description_ar: 'ثاني كبرى مدن الجزيرة، تتميز ببحيرة ديتواه الفيروزية الساحرة وأشجار القرم والطيور المهاجرة النادرة.',
          cost_index: 35,
          safety_score: 98,
          internet_score: 50,
          famous_industries: ['السياحة الشاطئية والبيئية المحمية', 'الصيد البحري والحرف اليدوية', 'تربية النحل والعسل السقطري'],
          famous_landmarks: ['محمية بحيرة ديتواه لاغون', 'شواطئ قلنسية الفيروزية', 'كهوف ومغارات قلنسية']
        }
      ]
    }
  ]
};
