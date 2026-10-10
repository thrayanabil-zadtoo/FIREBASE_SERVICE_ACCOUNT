import { CountryProvinceDetail } from '../types/country-profile';

// ============================================================================
// PROVINCES & STATES ATLAS: EUROPEAN & CAUCASUS FOREIGN COUNTRIES
// (DE, FR, IT, ES, CH, AT, NL, GE, BA, RU)
// ============================================================================

export const EUROPE_NEW_PROVINCES: Record<string, CountryProvinceDetail[]> = {
  // 🇩🇪 جمهورية ألمانيا الاتحادية (الولايات الاتحادية الكبرى ومدنها)
  DE: [
    {
      id: 'de_bavaria',
      country_code: 'DE',
      province_name_ar: 'ولاية بافاريا الحرة',
      province_name_en: 'Bavaria (Bayern)',
      type_label_ar: 'ولاية اتحادية (Bundesland)',
      administrative_capital_ar: 'مدينة ميونخ',
      area_km2: 70550,
      population_approx: '13.3 مليون نسمة',
      geographic_location_ar: 'جنوب شرق ألمانيا المحاذي للألب وسويسرا والنمسا، المحرك الصناعي والتقني الأكبر في أوروبا.',
      economic_specialization_ar: 'صناعة السيارات الفاخرة (BMW، أودي)، الإلكترونيات والطاقة (سيمنز)، التكنولوجيا الفائقة، والذكاء الاصطناعي.',
      famous_landmarks_ar: ['قصر نويشفانشتاين الأسطوري في الألب', 'ساحة ماريين بلاتس ومبنى بلدية ميونخ', 'متحف ومقر شركة BMW العالمي', 'استاد أليانز أرينا'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'ميونخ',
          name_en: 'Munich',
          is_capital: true,
          population_approx: '1.55 مليون نسمة',
          description_ar: 'عاصمة بافاريا وأغنى المدن الألمانية وجودة الحياة الأفضل عالمياً ومقر كبريات الشركات العالمية ومهرجانات التراث.',
          cost_index: 85,
          safety_score: 95,
          internet_score: 97,
          famous_industries: ['صناعة السيارات والبرمجيات المتقدمة', 'الخدمات المصرفية والتأمينية العالمية', 'التعليم الجامعي والبحث العلمي'],
          famous_landmarks: ['متحف بي إم دبليو (BMW Welt)', 'قصر نيمفنبورغ الملكي', 'الحديقة الإنجليزية (Englischer Garten)']
        },
        {
          name_ar: 'نورمبرغ',
          name_en: 'Nuremberg',
          is_capital: false,
          population_approx: '520 ألف نسمة',
          description_ar: 'ثاني كبرى مدن بافاريا، تجمع بين القلاع الإمبراطورية التاريخية وأكبر معرض للألعاب والتقنيات الصناعية في أوروبا.',
          cost_index: 72,
          safety_score: 92,
          internet_score: 95,
          famous_industries: ['صناعة الألعاب والابتكارات', 'الإلكترونيات والمحركات الكهربائية', 'الطباعة والنشر'],
          famous_landmarks: ['قلعة نورمبرغ الإمبراطورية (Kaiserburg)', 'سوق عيد الميلاد التاريخي', 'المتحف الوطني الجرماني']
        }
      ]
    },
    {
      id: 'de_berlin',
      country_code: 'DE',
      province_name_ar: 'ولاية ومدينة برلين العاصمة',
      province_name_en: 'Berlin City-State',
      type_label_ar: 'ولاية ومدينة اتحادية',
      administrative_capital_ar: 'برلين',
      area_km2: 891,
      population_approx: '3.75 مليون نسمة',
      geographic_location_ar: 'شمال شرق ألمانيا محاطة بولاية براندنبورغ، عاصمة السياسة والشركات الناشئة والابتكار الثقافي والشبابي.',
      economic_specialization_ar: 'الشركات التقنية الناشئة (Startups)، الصناعات الإبداعية والإعلامية، التكنولوجيا الحيوية، والمؤتمرات الدولية.',
      famous_landmarks_ar: ['بوابة براندنبورغ التاريخية', 'مبنى الرايخستاغ وقبته الزجاجية', 'بقايا جدار برلين (East Side Gallery)', 'جزيرة المتاحف (اليونسكو)'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'برلين',
          name_en: 'Berlin',
          is_capital: true,
          population_approx: '3.75 مليون نسمة',
          description_ar: 'عاصمة ألمانيا وأكبر مدن الاتحاد الأوروبي سكاناً، وجهة رواد الأعمال والمبرمجين والفنانين والباحثين من كل العالم.',
          cost_index: 74,
          safety_score: 88,
          internet_score: 96,
          famous_industries: ['ريادة الأعمال الرقمية والتطبيقات', 'السياحة الثقافية وسياحة المعارض', 'صناعة السينما والموسيقى والفنون'],
          famous_landmarks: ['بوابة براندنبورغ', 'برج التلفزيون في ألكسندر بلاتس', 'جزيرة المتاحف']
        },
        {
          name_ar: 'بوتسدام (الضاحية الملكية المحاذية)',
          name_en: 'Potsdam',
          is_capital: false,
          population_approx: '185 ألف نسمة',
          description_ar: 'عاصمة القصور والحدائق الملكية لملوك بروسيا واستوديوهات بابلسبيرغ السينمائية الأقدم في العالم ومراكز أبحاث المناخ.',
          cost_index: 70,
          safety_score: 95,
          internet_score: 94,
          famous_industries: ['الإنتاج السينمائي والوسائط الرقمية', 'أبحاث الفضاء والمناخ والفيزياء الفلكية', 'السياحة التراثية والقصور'],
          famous_landmarks: ['قصر سانسوسي وحدائقه الملكية (اليونسكو)', 'استوديوهات بابلسبيرغ للسينما', 'جسر الجواسيس الشهير (Glienicke Bridge)']
        }
      ]
    },
    {
      id: 'de_nrw',
      country_code: 'DE',
      province_name_ar: 'ولاية شمال الراين-وستفاليا',
      province_name_en: 'North Rhine-Westphalia (NRW)',
      type_label_ar: 'ولاية اتحادية (Bundesland)',
      administrative_capital_ar: 'مدينة دوسلدورف',
      area_km2: 34110,
      population_approx: '17.9 مليون نسمة',
      geographic_location_ar: 'غرب ألمانيا على نهر الراين محاذية لهولندا وبلجيكا، الولاية الأكبر سكاناً والقلب الصناعي الثقيل والكيميائي والتجاري.',
      economic_specialization_ar: 'الصناعات الكيميائية والصلب، الأزياء والمعارض بدوسلدورف، الملاحة النهرية بميناء دويسبورغ (أكبر ميناء نهري بالعالم)، والإعلام.',
      famous_landmarks_ar: ['كاتدرائية كولونيا القوطية العملاقة (اليونسكو)', 'شارع الملك (Königsallee) للأزياء بدوسلدورف', 'مجمع تسول فيرين الصناعي بإيسن (اليونسكو)', 'برج الراين'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'كولونيا',
          name_en: 'Cologne (Köln)',
          is_capital: false,
          population_approx: '1.08 مليون نسمة',
          description_ar: 'أقدم المدن الألمانية الكبرى وعاصمة الإعلام والمعارض والكرنفالات ونهر الراين وتضم الكاتدرائية القوطية الأضخم.',
          cost_index: 75,
          safety_score: 86,
          internet_score: 96,
          famous_industries: ['الإعلام وقنوات التلفزة الكبرى (RTL/WDR)', 'صناعة الكيماويات والسيارات (فورد)', 'صناعة العطور وماء كولونيا الأصلي'],
          famous_landmarks: ['كاتدرائية كولونيا الشهيرة', 'متحف الشوكولاتة على الراين', 'جسر هوهنتسولرن للأقفال']
        },
        {
          name_ar: 'دوسلدورف',
          name_en: 'Düsseldorf',
          is_capital: true,
          population_approx: '630 ألف نسمة',
          description_ar: 'عاصمة الولاية وعاصمة الموضة والأزياء والاتصالات ومقر الجالية اليابانية الأكبر في أوروبا والمصارف والبنوك الكبرى.',
          cost_index: 78,
          safety_score: 92,
          internet_score: 97,
          famous_industries: ['تصميم الأزياء والتسوق الراقي', 'الشركات اليابانية والآسيوية والتجارة', 'الاتصالات والاستشارات العالمية'],
          famous_landmarks: ['شارع الموضة كونيغس أليه (Kö)', 'ممشى الراين والميناء الإعلامي (MedienHafen)', 'برج الراين (Rheinturm)']
        }
      ]
    }
  ],

  // 🇫🇷 الجمهورية الفرنسية (المناطق والأقاليم الكبرى ومدنها)
  FR: [
    {
      id: 'fr_ile_de_france',
      country_code: 'FR',
      province_name_ar: 'منطقة إيل دو فرانس (منطقة باريس)',
      province_name_en: 'Île-de-France (Paris Region)',
      type_label_ar: 'منطقة إدارية (Région)',
      administrative_capital_ar: 'مدينة باريس',
      area_km2: 12012,
      population_approx: '12.3 مليون نسمة',
      geographic_location_ar: 'شمال وسط فرنسا على حوض نهر السين، عاصمة النور والجمال وأحد أكبر التكتلات الاقتصادية والمالية في العالم.',
      economic_specialization_ar: 'الموضة والأزياء الراقية (Haute Couture)، الخدمات المالية بحي لا ديفانس، الطيران، والسياحة الثقافية العالمية.',
      famous_landmarks_ar: ['برج إيفل ومتحف اللوفر وقوس النصر', 'قصر فرساي الملكي الشهير', 'كاتدرائية نوتردام دو باري', 'حي لا ديفانس المالي بناطحات سحابه'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'باريس (عاصمة النور)',
          name_en: 'Paris',
          is_capital: true,
          population_approx: '2.15 مليون نسمة',
          description_ar: 'عاصمة فرنسا والمدينة الأكثر استقطاباً للسياح بالعالم، عاصمة الفن والطهي والمسارح ومقرات الشركات متعددة الجنسيات.',
          cost_index: 88,
          safety_score: 84,
          internet_score: 97,
          famous_industries: ['الموضة والأزياء والعطور الفاخرة (LVMH، شانيل)', 'الخدمات المالية وحي الأعمال لا ديفانس', 'السياحة والضيافة وفنون الطهي'],
          famous_landmarks: ['برج إيفل', 'متحف اللوفر', 'شارع الشانزليزيه']
        },
        {
          name_ar: 'فرساي',
          name_en: 'Versailles',
          is_capital: false,
          population_approx: '85 ألف نسمة',
          description_ar: 'المدينة الملكية التاريخية غرب باريس، موطن قصر الملك لويس الرابع عشر وحدائقه الهندسية المذهلة وقاعة المرايا الشهيرة.',
          cost_index: 80,
          safety_score: 94,
          internet_score: 95,
          famous_industries: ['السياحة الملكية والآثار العالمية', 'التعليم العالي والأبحاث الزراعية والعطرية', 'الصناعات الحرفية الراقية'],
          famous_landmarks: ['قصر فرساي الملكي', 'حدائق فرساي وقناة المياه الكبرى', 'قصر التريانون']
        }
      ]
    },
    {
      id: 'fr_paca',
      country_code: 'FR',
      province_name_ar: 'منطقة بروفنس ألب كوت دازور (الريفيرا الفرنسية)',
      province_name_en: 'Provence-Alpes-Côte d\'Azur (PACA)',
      type_label_ar: 'منطقة إدارية (Région)',
      administrative_capital_ar: 'مدينة مارسيليا',
      area_km2: 31400,
      population_approx: '5.1 مليون نسمة',
      geographic_location_ar: 'جنوب شرق فرنسا على البحر المتوسط وجبال الألب والحدود الإيطالية، أشهر سواحل العالم السياحية (الكوت دازور).',
      economic_specialization_ar: 'السياحة الفاخرة ومهرجان كان السينمائي، اليخوت والموانئ بموناكو وكان ونيس، صناعة العطور بغراس، وميناء مارسيليا.',
      famous_landmarks_ar: ['ممشى الإنجليز في نيس (Promenade des Anglais)', 'ميناء مارسيليا القديم (Vieux-Port)', 'قصر المهرجانات في كان (Palais des Festivals)', 'عاصمة العطور في غراس'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'نيس وكان (الريفيرا)',
          name_en: 'Nice & Cannes',
          is_capital: false,
          population_approx: '420 ألف نسمة',
          description_ar: 'درة الريفيرا الفرنسية ومقر المهرجانات السينمائية العالمية وقصور البيل إيبوك واليخوت الفاخرة وشواطئ اللازورد.',
          cost_index: 84,
          safety_score: 90,
          internet_score: 96,
          famous_industries: ['السياحة الفاخرة ومهرجانات السينما', 'اليخوت والخدمات البحرية الراقية', 'صناعة العطور ومستحضرات التجميل'],
          famous_landmarks: ['ممشى الإنجليز بنيس', 'شارع لاكروازيت في كان', 'المدينة القديمة بنيس (Vieux Nice)']
        },
        {
          name_ar: 'مارسيليا',
          name_en: 'Marseille',
          is_capital: true,
          population_approx: '870 ألف نسمة',
          description_ar: 'ثاني كبرى مدن فرنسا وأقدمها على الإطلاق، أكبر ميناء تجاري فرنسي وعاصمة الثقافة المتوسطية وموطن حساء البويابيس.',
          cost_index: 68,
          safety_score: 72,
          internet_score: 94,
          famous_industries: ['الشحن وتفريغ الحاويات والملاحة', 'البتروكيماويات بميناء فوس', 'الصناعات الغذائية وصابون مارسيليا الشهير'],
          famous_landmarks: ['الميناء القديم (Vieux-Port)', 'كنيسة نوتردام دو لا غارد', 'متحف حضارات أوروبا والبحر المتوسط (Mucem)']
        }
      ]
    }
  ],

  // 🇮🇹 الجمهورية الإيطالية (الأقاليم والمدن الكبرى)
  IT: [
    {
      id: 'it_lombardy',
      country_code: 'IT',
      province_name_ar: 'إقليم لومبارديا وعاصمة الأزياء',
      province_name_en: 'Lombardy (Lombardia)',
      type_label_ar: 'إقليم (Regione)',
      administrative_capital_ar: 'مدينة ميلانو',
      area_km2: 23863,
      population_approx: '10.1 مليون نسمة',
      geographic_location_ar: 'شمال إيطاليا وسهول وادي بو وبحيرات كومو وغاردا المذهلة، المحرك المالي والصناعي الأقوى لإيطاليا.',
      economic_specialization_ar: 'الأزياء والتصميم العالمي (أسبوع ميلانو للموضة)، الخدمات المالية وبورصة إيطاليا، وبحيرة كومو الفاخرة.',
      famous_landmarks_ar: ['كاتدرائية ميلانو الرخامية (Duomo di Milano)', 'غاليريا فيتوريو إيمانويل الثاني للتسوق الفاخر', 'بحيرة كومو وقصورها الساحرة', 'دار أوبرا لا سكالا العالمية'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'ميلانو',
          name_en: 'Milan',
          is_capital: true,
          population_approx: '1.4 مليون نسمة',
          description_ar: 'عاصمة الموضة والأناقة العالمية والمركز المالي الأكبر لإيطاليا ومقر أشهر بيوت الأزياء (أرماني، برادا، فيرساتشي).',
          cost_index: 85,
          safety_score: 88,
          internet_score: 96,
          famous_industries: ['تصميم الأزياء والسلع الجلدية الراقية', 'البنوك والتمويل وإدارة الأصول', 'صناعة السيارات والابتكارات'],
          famous_landmarks: ['كاتدرائية الدومو', 'غاليريا فيتوريو إيمانويل', 'لوحة العشاء الأخير لليوناردو دا فينشي']
        },
        {
          name_ar: 'كومو (بحيرة كومو)',
          name_en: 'Como',
          is_capital: false,
          population_approx: '85 ألف نسمة',
          description_ar: 'الوجهة السياحية الأرقى لنجوم ومشاهير العالم المحاطة بقمم الألب والمياه الرقراقة وصناعة الحرير الفاخر.',
          cost_index: 82,
          safety_score: 95,
          internet_score: 94,
          famous_industries: ['السياحة الفاخرة والضيافة العالمية', 'صناعة ونسج الحرير الإيطالي الفاخر', 'الخدمات الترفيهية لليخوت'],
          famous_landmarks: ['فيلا بالبيانيلو الشهيرة', 'تلفريك كومو بروناتي', 'بحيرة كومو الساحرة']
        }
      ]
    },
    {
      id: 'it_lazio',
      country_code: 'IT',
      province_name_ar: 'إقليم لاتسيو والعاصمة روما',
      province_name_en: 'Lazio (Rome Region)',
      type_label_ar: 'إقليم (Regione)',
      administrative_capital_ar: 'مدينة روما',
      area_km2: 17232,
      population_approx: '5.75 مليون نسمة',
      geographic_location_ar: 'وسط غرب إيطاليا على نهر التيبر ومطل على البحر التيراني، موطن المدينة الخالدة ودولة الفاتيكان.',
      economic_specialization_ar: 'السياحة الأثرية والتاريخية الأولى بأوروبا، السينما الإيطالية (استوديوهات شينشيتا)، والمقرات الدبلوماسية.',
      famous_landmarks_ar: ['مدرج الكولوسيوم الروماني الشهير', 'دولة الفاتيكان وكاتدرائية القديس بطرس', 'نافورة تريفي والبانثيون', 'ساحة نافونا والسلالم الإسبانية'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'روما (المدينة الخالدة)',
          name_en: 'Rome',
          is_capital: true,
          population_approx: '2.87 مليون نسمة',
          description_ar: 'عاصمة إيطاليا ومتحف مفتوح لا مثيل له، تمتلئ شوارعها بأطلال الإمبراطورية الرومانية والقصور الباروكية والمطاعم الأصيلة.',
          cost_index: 80,
          safety_score: 85,
          internet_score: 95,
          famous_industries: ['السياحة العالمية والضيافة', 'الخدمات الحكومية والمنظمات الدولية (الفاو FAO)', 'الإنتاج السينمائي والدراما'],
          famous_landmarks: ['الكولوسيوم', 'نافورة تريفي', 'الفاتيكان ومتاحفه']
        },
        {
          name_ar: 'تيفولي',
          name_en: 'Tivoli',
          is_capital: false,
          population_approx: '60 ألف نسمة',
          description_ar: 'المنتجع التاريخي الروماني لطبقة النبلاء، يضم فيلا ديستي وشلالاتها ونافوراتها المائية العبقرية المسجلة باليونسكو.',
          cost_index: 68,
          safety_score: 92,
          internet_score: 90,
          famous_industries: ['السياحة الثقافية والقصور التاريخية', 'استخراج حجر الترافرتين الرخامي الشهير', 'الزراعة التقليدية وزيت الزيتون'],
          famous_landmarks: ['فيلا ديستي ونافوراتها المائية (اليونسكو)', 'فيلا هادريان الإمبراطورية الرومانية', 'شلالات نهر أنيين']
        }
      ]
    }
  ],

  // 🇪🇸 مملكة إسبانيا (أقاليم الحكم الذاتي ومدنها)
  ES: [
    {
      id: 'es_madrid',
      country_code: 'ES',
      province_name_ar: 'إقليم العاصمة مدريد',
      province_name_en: 'Community of Madrid',
      type_label_ar: 'منطقة حكم ذاتي (Comunidad Autónoma)',
      administrative_capital_ar: 'مدينة مدريد',
      area_km2: 8028,
      population_approx: '6.75 مليون نسمة',
      geographic_location_ar: 'قلب شبه الجزيرة الأيبيرية وهضبة الميزيتا الوسطى، العاصمة السياسية والمالية والرياضية لإسبانيا.',
      economic_specialization_ar: 'الخدمات المالية والمصرفية، الثقافة والمتاحف الفنية الكبرى، الرياضة العالمية، وصناعة الفضاء والطيران.',
      famous_landmarks_ar: ['القصر الملكي بمدريد (Palacio Real)', 'متحف البرادو الوطني ومتحف رينا صوفيا', 'استاد سانتياغو برنابيو', 'ساحة بويرتا ديل سول وميدان بلازا مايور'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'مدريد',
          name_en: 'Madrid',
          is_capital: true,
          population_approx: '3.3 مليون نسمة',
          description_ar: 'عاصمة إسبانيا وواحدة من أكثر عواصم أوروبا حيوية وضيافة، تجمع بين الفنون الملكية والحدائق الغناء وحياة المقاهي الصاخبة.',
          cost_index: 76,
          safety_score: 90,
          internet_score: 97,
          famous_industries: ['الخدمات المصرفية والتأمين', 'السياحة والمؤتمرات الدولية', 'الرياضة والفعاليات الكبرى'],
          famous_landmarks: ['متحف ديل برادو', 'استاد سانتياغو برنابيو', 'حديقة الريتيرو الملكية']
        },
        {
          name_ar: 'طليطلة (محاذية لمدريد)',
          name_en: 'Toledo',
          is_capital: false,
          population_approx: '85 ألف نسمة',
          description_ar: 'مدينة الثقافات الثلاث ومقر الأندلس التاريخي المحاطة بنهر التاجة والمشهورة بصناعة السيوف الفولاذية والحلويات اللوزية.',
          cost_index: 64,
          safety_score: 96,
          internet_score: 92,
          famous_industries: ['صناعة السيوف والفولاذ الدمشقي الطليطلي', 'السياحة التراثية والتاريخية (اليونسكو)', 'صناعة المارصبان وحلوى اللوز'],
          famous_landmarks: ['قصر طليطلة الحصين (Alcázar)', 'كاتدرائية طليطلة القوطية', 'جسر سان مارتين الحجري على نهر التاجة']
        }
      ]
    },
    {
      id: 'es_catalonia',
      country_code: 'ES',
      province_name_ar: 'إقليم كتالونيا',
      province_name_en: 'Catalonia (Catalunya)',
      type_label_ar: 'منطقة حكم ذاتي (Comunidad Autónoma)',
      administrative_capital_ar: 'مدينة برشلونة',
      area_km2: 32108,
      population_approx: '7.8 مليون نسمة',
      geographic_location_ar: 'شمال شرق إسبانيا على البحر المتوسط والحدود مع فرنسا وجبال البرانس، القطب الصناعي والتقني والسياحي الأبرز.',
      economic_specialization_ar: 'عمارة أنطوني غاودي الخالدة، المؤتمرات التقنية العالمية (MWC)، صناعة السيارات، والصناعات الدوائية والكيميائية.',
      famous_landmarks_ar: ['كنيسة ساغرادا فاميليا المعمارية الأسطورية', 'حديقة بارك غويل وقصور غاودي', 'شارع لارامبلا الشهير والحي القوطي', 'استاد كامب نو'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'برشلونة',
          name_en: 'Barcelona',
          is_capital: true,
          population_approx: '1.65 مليون نسمة',
          description_ar: 'عروس البحر المتوسط وعاصمة الابتكار والتصميم والعمارة الفريدة لغاودي والمؤتمر العالمي للجوال والكرة العالمية.',
          cost_index: 78,
          safety_score: 85,
          internet_score: 97,
          famous_industries: ['تكنولوجيا الاتصالات والمحمول (MWC)', 'السياحة الشاطئية والثقافية', 'الصناعات الكيميائية والدوائية المتقدمة'],
          famous_landmarks: ['كنيسة ساغرادا فاميليا', 'حديقة بارك غويل', 'شارع لارامبلا وشاطئ برشلونيتا']
        },
        {
          name_ar: 'خيرونا (جيرونا)',
          name_en: 'Girona',
          is_capital: false,
          population_approx: '105 ألف نسمة',
          description_ar: 'المدينة التاريخية الخلابة بمنازلها الملونة المعلقة على نهر أونيار وحيها اليهودي الأثري وموقع تصوير صراع العروش.',
          cost_index: 68,
          safety_score: 95,
          internet_score: 94,
          famous_industries: ['الطهي العالمي ومطاعم الميشلان الفاخرة (El Celler de Can Roca)', 'السياحة التاريخية وركوب الدراجات', 'الصناعات الغذائية'],
          famous_landmarks: ['كاتدرائية جيرونا العظيمة', 'المنازل الملونة على نهر أونيار', 'الحمامات العربية القديمة']
        }
      ]
    },
    {
      id: 'es_andalusia',
      country_code: 'ES',
      province_name_ar: 'إقليم الأندلس التاريخي',
      province_name_en: 'Andalusia (Andalucía)',
      type_label_ar: 'منطقة حكم ذاتي (Comunidad Autónoma)',
      administrative_capital_ar: 'مدينة إشبيلية',
      area_km2: 87268,
      population_approx: '8.5 مليون نسمة',
      geographic_location_ar: 'جنوب إسبانيا المشرف على مضيق جبل طارق والبحر المتوسط والمحيط الأطلسي، مهد الحضارة الأندلسية الإسلامية العريقة.',
      economic_specialization_ar: 'التراث والآثار الأندلسية (الحمراء ومسجد قرطبة)، سياحة كوستا ديل سول بملقة وماربيا، وزراعة الزيتون وإنتاج زيت الزيتون.',
      famous_landmarks_ar: ['قصر الحمراء وجنة العريف بغرناطة (اليونسكو)', 'مسجد وجامع قرطبة الكبير وقنطرته الرومانية', 'قصر إشبيلية الملكي وساحة إسبانيا', 'منتجعات ماربيا الفاخرة'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'غرناطة وقرطبة',
          name_en: 'Granada & Córdoba',
          is_capital: false,
          population_approx: '560 ألف نسمة',
          description_ar: 'عواصم الفردوس المفقود ودرة التراث الإسلامي والأندلسي العالمي؛ قصر الحمراء وجامع قرطبة وقنطرة الوادي الكبير.',
          cost_index: 62,
          safety_score: 94,
          internet_score: 94,
          famous_industries: ['السياحة التراثية والتاريخية العالمية', 'الصناعات الحرفية والأندلسية والجلدية', 'التعليم الجامعي التاريخي'],
          famous_landmarks: ['قصر الحمراء بغرناطة', 'مسجد قرطبة وقنطرتها', 'حي البيازين الأندلسي العتيق']
        },
        {
          name_ar: 'إشبيلية وملقة (كوستا ديل سول)',
          name_en: 'Seville & Málaga',
          is_capital: true,
          population_approx: '1.28 مليون نسمة',
          description_ar: 'إشبيلية عاصمة الأندلس وموطن الفلامنكو وبرج الخيرالدا، وملقة عاصمة شاطئ الشمس والمتاحف ومسقط رأس بيكاسو.',
          cost_index: 68,
          safety_score: 92,
          internet_score: 95,
          famous_industries: ['السياحة الشاطئية والضيافة بكوستا ديل سول وماربيا', 'فنون الفلامنكو والمهرجانات التقليدية', 'الصناعات الغذائية وزيت الزيتون'],
          famous_landmarks: ['برج الخيرالدا وقصر المورق بإشبيلية', 'ساحة إسبانيا بإشبيلية', 'قلعة القصبة ومتحف بيكاسو بملقة']
        }
      ]
    }
  ],

  // 🇷🇺 روسيا الاتحادية (الكيانات الفيدرالية الكبرى ومدنها)
  RU: [
    {
      id: 'ru_moscow',
      country_code: 'RU',
      province_name_ar: 'مدينة موسكو الفيدرالية',
      province_name_en: 'Moscow Federal City',
      type_label_ar: 'مدينة فيدرالية اتحادية',
      administrative_capital_ar: 'مدينة موسكو',
      area_km2: 2561,
      population_approx: '13.1 مليون نسمة',
      geographic_location_ar: 'غرب روسيا على نهر موسكفا، كبرى مدن القارة الأوروبية سكاناً والمركز السياسي والمالي والتقني للبلاد.',
      economic_specialization_ar: 'المقرات السيادية للحكم والطاقة، الخدمات المصرفية، مركز موسكو الدولي للأعمال (Moscow City)، وتطوير البرمجيات.',
      famous_landmarks_ar: ['الكرملين والساحة الحمراء (اليونسكو)', 'كاتدرائية القديس باسيل الملونة بأبراجها البصلية', 'مترو موسكو وقصوره الرخامية تحت الأرض', 'ناطحات سحاب موسكو سيتي الحديثة'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'موسكو',
          name_en: 'Moscow',
          is_capital: true,
          population_approx: '13.1 مليون نسمة',
          description_ar: 'العاصمة الروسية العملاقة، تمتاز بعمارتها الإمبراطورية الضخمة وشبكة المترو الأشبه بالمتاحف ومراكز التقنية والمسارح.',
          cost_index: 70,
          safety_score: 85,
          internet_score: 96,
          famous_industries: ['شركات الطاقة والنفط والغاز الكبرى', 'الخدمات المصرفية والتكنولوجيا الرقمية (ياندكس)', 'صناعة الفضاء والدفاع'],
          famous_landmarks: ['الكرملين والساحة الحمراء', 'مسرح البولشوي الشهير', 'جامعة موسكو الحكومية وتلال لينين']
        },
        {
          name_ar: 'سكولكوفو (وادي السيليكون الروسي)',
          name_en: 'Skolkovo',
          is_capital: false,
          population_approx: '40 ألف نسمة',
          description_ar: 'مركز الابتكار والتكنولوجيا الحديثة غرب موسكو، يضم مراكز أبحاث الذكاء الاصطناعي والحوسبة والتقنيات الطبية.',
          cost_index: 75,
          safety_score: 95,
          internet_score: 98,
          famous_industries: ['أبحاث الذكاء الاصطناعي والروبوتات', 'تكنولوجيا الطاقة النظيفة والمواد المتقدمة', 'حاضنات الشركات التقنية الناشئة'],
          famous_landmarks: ['معهد سكولكوفو للعلوم والتكنولوجيا (Skoltech)', 'مجمع مراكز الابتكار المعماري']
        }
      ]
    },
    {
      id: 'ru_tatarstan',
      country_code: 'RU',
      province_name_ar: 'جمهورية تتارستان وعاصمتها قازان',
      province_name_en: 'Republic of Tatarstan',
      type_label_ar: 'جمهورية فيدرالية ذاتية الحكم',
      administrative_capital_ar: 'مدينة قازان',
      area_km2: 67847,
      population_approx: '4.02 مليون نسمة',
      geographic_location_ar: 'ملتقى نهري الفولغا وكاما وسط روسيا، العاصمة الرياضية والإسلامية ونموذج التسامح والتعايش ومصانع الطائرات.',
      economic_specialization_ar: 'صناعة الطيران وطائرات الهليكوبتر، البتروكيماويات والنفط (تاتنفت)، صناعة شاحنات كاماز، والصيرفة الإسلامية.',
      famous_landmarks_ar: ['كرملين قازان التاريخي وجامع قل شريف (اليونسكو)', 'مدينة إينوبوليس التقنية الذكية', 'برج سويومبيكا المائل الأسطوري', 'معبد كل الأديان بقازان'],
      cities_count: 2,
      key_cities: [
        {
          name_ar: 'قازان (عاصمة التتار)',
          name_en: 'Kazan',
          is_capital: true,
          population_approx: '1.31 مليون نسمة',
          description_ar: 'العاصمة الثالثة لروسيا وعاصمة العالم الإسلامي في روسيا، تشتهر بجمال جامع قل شريف وجامعاتها العريقة ومصانع الطيران.',
          cost_index: 52,
          safety_score: 92,
          internet_score: 94,
          famous_industries: ['صناعة طائرات الهليكوبتر والطيران المدني', 'تكرير البترول والبتروكيماويات', 'الصيرفة الإسلامية والخدمات المالية'],
          famous_landmarks: ['جامع قل شريف داخل الكرملين', 'شارع باومان التراثي المخصص للمشاة', 'قصر كوزنيتسوف (قصر المزارعين)']
        },
        {
          name_ar: 'إينوبوليس (المدينة الذكية)',
          name_en: 'Innopolis',
          is_capital: false,
          population_approx: '15 ألف نسمة',
          description_ar: 'أول مدينة ذكية مخصصة للتقنية في روسيا، تدار بسيارات الأجرة ذاتية القيادة وروبوتات التوصيل وتضم جامعة إينوبوليس للبرمجيات.',
          cost_index: 58,
          safety_score: 98,
          internet_score: 99,
          famous_industries: ['القيادة الذاتية والذكاء الاصطناعي', 'الأمن السيبراني وتشفير البيانات', 'التعليم الجامعي البرمجي المتقدم'],
          famous_landmarks: ['جامعة إينوبوليس التقنية', 'تكنوبارك بوبوف المعماري', 'شبكة الروبوتات الذكية بالمدينة']
        }
      ]
    }
  ]
};
