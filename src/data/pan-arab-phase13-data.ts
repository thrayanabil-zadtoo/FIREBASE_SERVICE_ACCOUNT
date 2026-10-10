import {
  PanArabStrategicReserveItem,
  PanArabWaterDesalinationNode,
  PanArabGeopoliticalScenario,
  PanArabStressTestResult
} from '../types/country-profile';

// ============================================================================
// 1. STRATEGIC GRAIN & COMMODITY RESERVES DATA
// ============================================================================

export const STRATEGIC_FOOD_RESERVES: PanArabStrategicReserveItem[] = [
  {
    commodity_key: 'wheat_grain',
    name_ar: 'القمح الصلب واللين (محصول الخبز الاستراتيجي)',
    category: 'حبوب ومحاصيل أساسية',
    total_arab_reserve_months: 6.4,
    total_arab_stock_million_tons: 18.2,
    top_arab_producers: [
      { country_code: 'EG', name_ar: 'مصر', share_pct: 38, annual_production_m_tons: 9.8 },
      { country_code: 'DZ', name_ar: 'الجزائر', share_pct: 19, annual_production_m_tons: 3.5 },
      { country_code: 'MA', name_ar: 'المغرب', share_pct: 16, annual_production_m_tons: 4.1 },
      { country_code: 'IQ', name_ar: 'العراق', share_pct: 15, annual_production_m_tons: 5.2 },
      { country_code: 'SA', name_ar: 'السعودية', share_pct: 7, annual_production_m_tons: 1.2 }
    ],
    strategic_silos_capacity_m_tons: 24.5,
    emergency_share_protocol_ar: 'تفعيل شبكة الصوامع العربية الموحدة لتوزيع 2.5 مليون طن فوراً في حال تعطل موانئ البحر الأسود مع الأولوية للدول ذات المخزون الأقل من 3 أشهر.',
    vulnerability_level: 'متوسط (يتطلب يقظة وتنويع)',
    vulnerability_color: 'amber'
  },
  {
    commodity_key: 'rice_paddy',
    name_ar: 'الأرز الأبيض والمطحون',
    category: 'حبوب ومحاصيل أساسية',
    total_arab_reserve_months: 5.8,
    total_arab_stock_million_tons: 6.7,
    top_arab_producers: [
      { country_code: 'EG', name_ar: 'مصر', share_pct: 82, annual_production_m_tons: 4.2 },
      { country_code: 'IQ', name_ar: 'العراق', share_pct: 12, annual_production_m_tons: 0.4 },
      { country_code: 'MR', name_ar: 'موريتانيا', share_pct: 4, annual_production_m_tons: 0.15 }
    ],
    strategic_silos_capacity_m_tons: 9.0,
    emergency_share_protocol_ar: 'اتفاقية التوريد التفضيلي للأرز المصري والعراقي لدول الخليج والمغرب العربي عبر المسار السريع الأخضر المعفى من الرسوم.',
    vulnerability_level: 'متوسط (يتطلب يقظة وتنويع)',
    vulnerability_color: 'amber'
  },
  {
    commodity_key: 'edible_oils',
    name_ar: 'زيوت الطعام النباتية (دوار الشمس والذرة والنخيل)',
    category: 'زيوت وسكر',
    total_arab_reserve_months: 5.2,
    total_arab_stock_million_tons: 3.8,
    top_arab_producers: [
      { country_code: 'SD', name_ar: 'السودان', share_pct: 35, annual_production_m_tons: 0.9 },
      { country_code: 'TN', name_ar: 'تونس (زيت الزيتون البكر)', share_pct: 28, annual_production_m_tons: 0.35 },
      { country_code: 'EG', name_ar: 'مصر', share_pct: 22, annual_production_m_tons: 0.45 },
      { country_code: 'SY', name_ar: 'سوريا', share_pct: 10, annual_production_m_tons: 0.15 }
    ],
    strategic_silos_capacity_m_tons: 6.2,
    emergency_share_protocol_ar: 'مجمع التكرير الإقليمي بالموانئ الحرة بالعين السخنة وجبل علي لتأمين خط إمداد مستمر بسعة تكرير 8000 طن يومياً.',
    vulnerability_level: 'متوسط (يتطلب يقظة وتنويع)',
    vulnerability_color: 'amber'
  },
  {
    commodity_key: 'refined_sugar',
    name_ar: 'السكر المكرر وبنجر وقصب السكر',
    category: 'زيوت وسكر',
    total_arab_reserve_months: 7.9,
    total_arab_stock_million_tons: 5.4,
    top_arab_producers: [
      { country_code: 'EG', name_ar: 'مصر (مصنع القناة الأكبر عالمياً)', share_pct: 54, annual_production_m_tons: 2.8 },
      { country_code: 'SD', name_ar: 'السودان (شركة كنانة)', share_pct: 18, annual_production_m_tons: 0.6 },
      { country_code: 'MA', name_ar: 'المغرب', share_pct: 15, annual_production_m_tons: 0.52 },
      { country_code: 'AE', name_ar: 'الإمارات (تكرير الخليج للسكر)', share_pct: 9, annual_production_m_tons: 1.5 }
    ],
    strategic_silos_capacity_m_tons: 8.5,
    emergency_share_protocol_ar: 'اكتفاء ذاتي عربي يقترب من 88% بدعم إنتاج بنجر السكر في غرب المنيا والدلتا ومصانع التكرير الحرة بدبي.',
    vulnerability_level: 'منخفض (آمن ومستقر)',
    vulnerability_color: 'emerald'
  },
  {
    commodity_key: 'phosphate_fertilizers',
    name_ar: 'الأسمدة الفوسفاتية والنيتروجينية (عماد الإنتاج الزراعي)',
    category: 'أسمدة زراعية',
    total_arab_reserve_months: 18.0,
    total_arab_stock_million_tons: 32.0,
    top_arab_producers: [
      { country_code: 'MA', name_ar: 'المغرب (المكتب الشريف للفوسفاط OCP)', share_pct: 46, annual_production_m_tons: 12.5 },
      { country_code: 'SA', name_ar: 'السعودية (شركة معادن - وعد الشمال)', share_pct: 24, annual_production_m_tons: 6.8 },
      { country_code: 'EG', name_ar: 'مصر (شركة النصر وأبو قير للأسمدة)', share_pct: 15, annual_production_m_tons: 4.2 },
      { country_code: 'JO', name_ar: 'الأردن (مناجم الفوسفات الأردنية)', share_pct: 9, annual_production_m_tons: 2.4 }
    ],
    strategic_silos_capacity_m_tons: 45.0,
    emergency_share_protocol_ar: 'المنطقة العربية تمثل أكثر من 70% من احتياطي الفوسفات العالمي وتضمن إمداد كافة المزارع العربية بأسعار تفضيلية مستقرة للأسمدة المركبة DAP/MAP.',
    vulnerability_level: 'منخفض (آمن ومستقر)',
    vulnerability_color: 'emerald'
  }
];

// ============================================================================
// 2. WATER DESALINATION & WATER SECURITY NODES
// ============================================================================

export const WATER_DESALINATION_NODES: PanArabWaterDesalinationNode[] = [
  {
    node_id: 'sa_desal_hub',
    country_code: 'SA',
    country_name_ar: 'المملكة العربية السعودية',
    flag: '🇸🇦',
    daily_desalination_capacity_m3: 11500000,
    renewable_energy_share_pct: 22,
    shared_groundwater_basin_ar: 'حوض الساق وحوض الوجيد المشترك مع الأردن واليمن',
    per_capita_water_annual_m3: 92,
    treated_sewage_reuse_pct: 78,
    mega_water_projects_ar: [
      'المؤسسة العامة لتحلية المياه المالحة (أكبر منتج للمياه المحلاة بالعالم)',
      'محطة الجبيل 3A و 3B بتقنية التناضح العكسي RO بالطاقة الشمسية',
      'مشروع المياه المستقل في رابغ ومحطات نيوم الخالية من الانبعاثات',
      'نظام الخزن الاستراتيجي للمياه بالرياض ومكة المكرمة بسعة 15 مليون م³'
    ]
  },
  {
    node_id: 'ae_desal_hub',
    country_code: 'AE',
    country_name_ar: 'الإمارات العربية المتحدة',
    flag: '🇦🇪',
    daily_desalination_capacity_m3: 5200000,
    renewable_energy_share_pct: 28,
    shared_groundwater_basin_ar: 'حوض أم الرضمة الشرقي مع سلطنة عُمان',
    per_capita_water_annual_m3: 110,
    treated_sewage_reuse_pct: 84,
    mega_water_projects_ar: [
      'محطة الطويلة بأبوظبي (أكبر محطة تناضح عكسي بالعالم بسعة 909,000 م³/يوم)',
      'محطة حصيان بدبي بتقنية RO الصديقة للبيئة المرتبطة بمجمع محمد بن راشد للطاقة',
      'مشروع التخزين الاستراتيجي لحوض ليوا الجوفي بأبوظبي (احتياطي 90 يوماً للطوارئ)'
    ]
  },
  {
    node_id: 'eg_water_hub',
    country_code: 'EG',
    country_name_ar: 'جمهورية مصر العربية',
    flag: '🇪🇬',
    daily_desalination_capacity_m3: 2850000,
    renewable_energy_share_pct: 18,
    shared_groundwater_basin_ar: 'خزان الحجر الرملي النوبي (الأضخم عالمياً المشترك مع ليبيا والسودان وتشاد)',
    per_capita_water_annual_m3: 560,
    treated_sewage_reuse_pct: 92,
    mega_water_projects_ar: [
      'محطة معالجة مياه مصرف بحر البقر (الأكبر بالعالم بموسوعة غينيس بسعة 5.6 مليون م³/يوم)',
      'محطة معالجة مياه مصرف الدلتا الجديدة العملاقة (7.5 مليون م³/يوم) لزراعة 2.2 مليون فدان',
      'البرنامج الوطني لتحلية مياه البحر بالمدن الساحلية (العلمين، الجلالة، شرق بورسعيد)',
      'تبطين وتأهيل الترع القومية لتقليل الفاقد المائي بنسبة 20%'
    ]
  },
  {
    node_id: 'ma_water_hub',
    country_code: 'MA',
    country_name_ar: 'المملكة المغربية',
    flag: '🇲🇦',
    daily_desalination_capacity_m3: 1950000,
    renewable_energy_share_pct: 35,
    shared_groundwater_basin_ar: 'حوض تافيلالت والمائدة المائية الساحلية المشتركة',
    per_capita_water_annual_m3: 620,
    treated_sewage_reuse_pct: 65,
    mega_water_projects_ar: [
      'محطة تحلية مياه البحر بالدار البيضاء (الأضخم في إفريقيا بسعة 300 مليون م³ سنوياً)',
      'محطة تحلية اشتوكة آيت باها بسوس لتأمين مياه الشرب والري الفلاحي',
      'مشروع الطريق السيار للماء لربط حوض سبو بحوض أبي رقراق لنقل فائض المياه شمالاً'
    ]
  },
  {
    node_id: 'om_water_hub',
    country_code: 'OM',
    country_name_ar: 'سلطنة عُمان',
    flag: '🇴🇲',
    daily_desalination_capacity_m3: 1650000,
    renewable_energy_share_pct: 20,
    shared_groundwater_basin_ar: 'حوض نجد المائي المشترك مع اليمن والسعودية',
    per_capita_water_annual_m3: 350,
    treated_sewage_reuse_pct: 75,
    mega_water_projects_ar: [
      'محطة بركاء وصحار المستقلة لتحلية المياه وتوليد الكهرباء',
      'مشروع سد الحماية من مخاطر الفيضانات وتغذية الخزانات الجوفية بوادي ضيقة',
      'مشروع تحلية مياه البحر بالدقم لخدمة المنطقة الاقتصادية الخاصة والميناء'
    ]
  },
  {
    node_id: 'dz_water_hub',
    country_code: 'DZ',
    country_name_ar: 'الجمهورية الجزائرية الديمقراطية الشعبية',
    flag: '🇩🇿',
    daily_desalination_capacity_m3: 3700000,
    renewable_energy_share_pct: 12,
    shared_groundwater_basin_ar: 'النظام المائي للصحراء الشمالية (SASS) المشترك مع تونس وليبيا',
    per_capita_water_annual_m3: 420,
    treated_sewage_reuse_pct: 58,
    mega_water_projects_ar: [
      'البرنامج الاستعجالي الوطني لإنجاز 5 محطات تحلية عملاقة (قدرة 300 ألف م³/يوم لكل محطة)',
      'محطة كاب جنات ومحطة فوكة ومحطة الطارف لتأمين مياه الشرب لـ 15 مليون نسمة',
      'التحويلات الكبرى للمياه من السدود الشرقية نحو الهضاب العليا والمناطق الداخلية'
    ]
  }
];

// ============================================================================
// 3. GEOPOLITICAL DISRUPTION & 2035 SCENARIOS
// ============================================================================

export const GEOPOLITICAL_SCENARIOS: PanArabGeopoliticalScenario[] = [
  {
    scenario_id: 'scenario_hormuz_closure',
    scenario_title_ar: 'سيناريو تعطل أو إغلاق مضيق هرمز ومسارات تصدير الطاقة البديلة',
    threat_level: 'حرج للغاية (Extreme)',
    affected_chokepoints: ['مضيق هرمز', 'الخليج العربي الداخلي'],
    disruption_impact_summary_ar: 'تهديد مباشر لتدفق 18-20 مليون برميل نفط يومياً وقرابة 25% من إمدادات الغاز المسال العالمية، مما يرفع أسعار الطاقة ويفرض تشغيل خطوط الأنابيب البرية العابرة للمضائق فوراً.',
    alternative_corridors: [
      {
        corridor_name_ar: 'خط أنابيب بترولاين (شرق - غرب السعودية)',
        route_path_ar: 'من بقيق والأحساء إلى ميناء ينبع على البحر الأحمر',
        throughput_capacity_ar: '5.0 إلى 7.0 مليون برميل نفط يومياً',
        readiness_pct: 100,
        key_operating_states: ['SA']
      },
      {
        corridor_name_ar: 'خط أنابيب حبشان - الفجيرة (الإمارات)',
        route_path_ar: 'من حقول حبشان بأبوظبي مباشرة إلى ميناء الفجيرة على خليج عُمان والمحيط الهندي',
        throughput_capacity_ar: '1.5 إلى 1.8 مليون برميل نفط يومياً',
        readiness_pct: 100,
        key_operating_states: ['AE']
      },
      {
        corridor_name_ar: 'خط أنابيب كركوك - جيهان وطريق التنمية البديل',
        route_path_ar: 'من حقول شمال العراق إلى ميناء جيهان التركي على البحر المتوسط',
        throughput_capacity_ar: '1.2 مليون برميل نفط يومياً',
        readiness_pct: 75,
        key_operating_states: ['IQ']
      }
    ],
    contingency_action_steps_ar: [
      'توجيه ناقلات النفط للتحميل المباشر من موانئ ينبع وجازان (البحر الأحمر) والفجيرة والدقم (المحيط الهندي).',
      'تشغيل خطوط السكك الحديدية للشحن بين موانئ الخليج وموانئ البحر الأحمر لنقل الحاويات والسلع الاستهلاكية.',
      'تفعيل عقود التبادل والتخزين الاستراتيجي الموقعة في صهاريج الفجيرة وسيدي كرير وأوكيناوا برعاية أوبك+.'
    ]
  },
  {
    scenario_id: 'scenario_redsea_mandeb',
    scenario_title_ar: 'سيناريو استمرار اضطراب باب المندب وتفعيل الجسر البري العربي',
    threat_level: 'عالي المخاطر (High Alert)',
    affected_chokepoints: ['مضيق باب المندب', 'جنوب البحر الأحمر', 'قناة السويس'],
    disruption_impact_summary_ar: 'زيادة مدة شحن الحاويات بين آسيا وأوروبا بمقدار 12-16 يوماً وتكلفة إضافية بنسبة 250% عبر طريق رأس الرجاء الصالح، مع انخفاض رسوم قناة السويس وتأثر واردات موانئ البحر الأحمر.',
    alternative_corridors: [
      {
        corridor_name_ar: 'الجسر البري اللوجستي العربي الموحد (Land Bridge)',
        route_path_ar: 'من موانئ جبل علي/أبوظبي والدمام عبر شبكة الطرق والقطارات إلى الرياض، ثم الأردن، وميناء العقبة أو ميناء نويبع والإسكندرية',
        throughput_capacity_ar: '4,500 شاحنة وحاوية مكافئة يومياً (زمن عبور 48-72 ساعة)',
        readiness_pct: 92,
        key_operating_states: ['AE', 'SA', 'JO', 'EG']
      },
      {
        corridor_name_ar: 'الخط العربي لنقل التجارة عبر طابا - الإسكندرية',
        route_path_ar: 'من خليج العقبة عبر شبكة قطار الدلتا السريع إلى موانئ المتوسط (الدخيلة، دمياط، بورسعيد)',
        throughput_capacity_ar: '3,200 حاوية يومياً',
        readiness_pct: 85,
        key_operating_states: ['EG', 'JO']
      }
    ],
    contingency_action_steps_ar: [
      'إعفاء شاحنات الترانزيت العابرة للجسر البري من رسوم العبور الجمركية البينية بموجب أحكام المادة الرابعة من GAFTA.',
      'توفير مرافقة أمنية بحرية منسقة للناقلات العربية التجارية التابعة لمجلس الدول العربية والإفريقية المطلة على البحر الأحمر.',
      'تقديم حوافز وتخفيضات مرنة لرسوم قناة السويس للخطوط البحرية التي تستخدم مراكز التخزين اللوجستية المصرية.'
    ]
  },
  {
    scenario_id: 'scenario_blacksea_wheat_cutoff',
    scenario_title_ar: 'سيناريو انقطاع إمدادات الحبوب من البحر الأسود ومظلة الأمن الغذائي 2035',
    threat_level: 'عالي المخاطر (High Alert)',
    affected_chokepoints: ['مضيق البوسفور والدردنيل', 'موانئ البحر الأسود'],
    disruption_impact_summary_ar: 'توقف تدفق 30% من واردات القمح العربي من روسيا وأوكرانيا ورومانيا، مما يتطلب تفعيل المخزون الاستراتيجي المشترك وتسريع خطط الزراعة التعاقدية.',
    alternative_corridors: [
      {
        corridor_name_ar: 'سلة الغذاء التعاقدية من دلتا النيل وتوشكى وغرب المنيا',
        route_path_ar: 'ضخ 4 ملايين طن إضافية من القمح المصري بفضل مشاريع الدلتا الجديدة واستصلاح الأراضي',
        throughput_capacity_ar: '4.0 ملايين طن قمح سنوياً',
        readiness_pct: 88,
        key_operating_states: ['EG']
      },
      {
        corridor_name_ar: 'سلاسل الاستيراد البديلة من أمريكا اللاتينية وأستراليا والهند',
        route_path_ar: 'تحالف استيرادي عربي موحد للتفاوض الجماعي وخفض هوامش الشحن البحري',
        throughput_capacity_ar: '6.5 ملايين طن سنوياً',
        readiness_pct: 95,
        key_operating_states: ['SA', 'AE', 'DZ', 'MA']
      }
    ],
    contingency_action_steps_ar: [
      'صرف حصص إغاثية فورية من شبكة الصوامع السعودية والمصرية والجزائرية للدول الأكثر انكشافاً (لبنان، تونس، اليمن، السودان).',
      'تثبيت أسعار الأسمدة الفوسفاتية والنيتروجينية للمزارعين المحليين لضمان عدم تراجع الإنتاج الداخلي.',
      'تفعيل التبادل العيني (سلع زراعية مقابل محروقات وطاقة أو أسمدة) دون استنزاف الاحتياطيات النقدية الدولارية.'
    ]
  },
  {
    scenario_id: 'scenario_green_energy_corridors_2035',
    scenario_title_ar: 'سيناريو ممرات الهيدروجين الأخضر والربط الكهربائي القاري 2035',
    threat_level: 'تحول استراتيجي (Strategic Shift)',
    affected_chokepoints: ['مضيق جبل طارق', 'قناة صقلية والبحر الأبيض المتوسط', 'البحر الأحمر'],
    disruption_impact_summary_ar: 'تحول العالم نحو الحياد الكربوني وتصدير الطاقة النظيفة، مما يجعل العالم العربي المورد الأول لأوروبا وآسيا بالكهرباء الشمسية والأمونيا الخضراء.',
    alternative_corridors: [
      {
        corridor_name_ar: 'مشروع الربط الكهربائي المصري - اليوناني (GREGY Interconnector)',
        route_path_ar: 'كابل بحري تيار مستمر عالي الجهد HVDC بقدرة 3,000 ميجاواط لنقل الكهرباء النظيفة من مصر لأوروبا',
        throughput_capacity_ar: '3,000 ميجاواط (نظيفة)',
        readiness_pct: 68,
        key_operating_states: ['EG']
      },
      {
        corridor_name_ar: 'مشروع خط الربط التونسي - الإيطالي (ELMED)',
        route_path_ar: 'كابل بحري بقدرة 600 ميجاواط يربط شبكتي الكهرباء بين تونس وإيطاليا',
        throughput_capacity_ar: '600 ميجاواط',
        readiness_pct: 72,
        key_operating_states: ['TN']
      },
      {
        corridor_name_ar: 'ممر الهيدروجين الأخضر المغربي - الأوروبي (SoutH2 Corridor)',
        route_path_ar: 'توليد الهيدروجين من طاقة الرياح والشمس بالصحراء المغربية ونقله بالأنابيب لإسبانيا وألمانيا',
        throughput_capacity_ar: '10 تيراواط/ساعة سنوياً',
        readiness_pct: 60,
        key_operating_states: ['MA', 'DZ']
      }
    ],
    contingency_action_steps_ar: [
      'توحيد معايير شهادات المنشأ الخضراء بين الدول العربية لتعظيم القيمة المضافة للتصدير للاتحاد الأوروبي (CBAM).',
      'بناء شبكة عربية متكاملة لنقل الهيدروجين والأمونيا تربط مزارع الطاقة المتجددة في الخليج ومصر والمغرب.',
      'توطين صناعة خلايا التحليل الكهربائي (Electrolyzers) والألواح الشمسية في المدن الصناعية العربية.'
    ]
  }
];

// ============================================================================
// 4. STRESS-TEST EVALUATOR ENGINE
// ============================================================================

export function runPanArabStressTest(
  countryCode: string,
  shockType: 'grain_cutoff' | 'oil_shock' | 'chokepoint_blockage' | 'drought_water'
): PanArabStressTestResult {
  const code = countryCode.toUpperCase();

  // Baseline resilience weights by country economic structure
  const isGulf = ['SA', 'AE', 'QA', 'KW', 'OM', 'BH'].includes(code);
  const isMaghreb = ['MA', 'DZ', 'TN', 'LY', 'MR'].includes(code);
  const isEgypt = code === 'EG';

  if (shockType === 'grain_cutoff') {
    const score = isGulf ? 88 : isEgypt ? 79 : isMaghreb ? 74 : 52;
    const months = isGulf ? 9.5 : isEgypt ? 6.2 : isMaghreb ? 6.8 : 2.5;
    return {
      country_code: code,
      country_name_ar: code === 'EG' ? 'جمهورية مصر العربية' : code === 'SA' ? 'المملكة العربية السعودية' : code,
      shock_type: 'انقطاع واردات الحبوب العالمية بنسبة 40% لمدة 6 أشهر',
      shock_magnitude: 'ارتفاع الأسعار العالمية +45% وتراجع المعروض',
      overall_resilience_score: score,
      buffer_duration_months: months,
      fiscal_impact_pct_gdp: isGulf ? 0.3 : 1.4,
      food_security_status: score >= 75 ? 'مستوى أمان مرتفع مع اعتماد خطة السحب من الصوامع الاستراتيجية' : 'ضغط متوسط يتطلب تنشيط عقود التوريد الأخوية التبادلية',
      energy_balance_status: 'مستقر - لا تأثير مباشر على إمدادات الطاقة',
      currency_pressure_level: isGulf ? 'منخفض' : isEgypt ? 'متوسط' : 'مرتفع',
      recommended_brotherly_synergies: [
        'تفعيل اتفاقية الصوامع التبادلية العربية مع مصر والسعودية لتعويض النقص العاجل.',
        'شراء شحنات مشتركة عبر تحالف الشراء العربي لخفض هوامش الشحن البحري بنسبة 18%.'
      ],
      emergency_mitigation_plan_ar: [
        'حظر إعادة تصدير الحبوب والزيوت فوراً من الموانئ والمستودعات الحرة.',
        'صرف حصص تموينية ذكية مع توجيه الدعم للمنتجات ذات الاكتفاء المحلي.',
        'تقديم قروض ميسرة وتشجيع المزارعين المحليين لزراعة المحاصيل الحقلية الاستراتيجية.'
      ]
    };
  }

  if (shockType === 'chokepoint_blockage') {
    const score = code === 'SA' ? 92 : code === 'AE' ? 89 : code === 'EG' ? 76 : 65;
    return {
      country_code: code,
      country_name_ar: code,
      shock_type: 'إغلاق أو تعطل ملاحي حرج في أحد المضائق البحرية الرئيسية',
      shock_magnitude: 'تحويل 80% من حركة السفن وتضاعف تكاليف التأمين البحري',
      overall_resilience_score: score,
      buffer_duration_months: code === 'SA' || code === 'AE' ? 12 : 7,
      fiscal_impact_pct_gdp: code === 'EG' ? 2.1 : 0.8,
      food_security_status: 'مستقر بفضل المخزون الداخلي ونقاط الشحن البديلة',
      energy_balance_status: 'تفعيل مسارات الأنابيب البرية فوراً (بترولاين وينبع وحبشان والفجيرة)',
      currency_pressure_level: isGulf ? 'منخفض' : 'متوسط',
      recommended_brotherly_synergies: [
        'تشغيل الجسر البري الخليجي - الأردني - المصري على مدار الساعة لنقل البضائع الجافة والمبردة.',
        'استخدام الموانئ العربية البديلة على المحيط الهندي (صلالة والدقم والفجيرة) والبحر الأحمر (ينبع وجازان).'
      ],
      emergency_mitigation_plan_ar: [
        'تفعيل غرف العمليات المشتركة ومتابعة حركة الشاحنات عبر بوابات التخليص السريع (Green Lane).',
        'تثبيت أسعار نقل الحاويات بالاتفاق مع الناقلين الوطنيين لمنع التضخم المفاجئ في أسواق التجزئة.'
      ]
    };
  }

  if (shockType === 'oil_shock') {
    const score = isGulf ? 94 : isEgypt ? 70 : 62;
    return {
      country_code: code,
      country_name_ar: code,
      shock_type: 'صدمة هبوط أو تقلب حاد في أسعار النفط العالمية (-35%)',
      shock_magnitude: 'انخفاض العائدات الهيدروكربونية بمقدار الثلث',
      overall_resilience_score: score,
      buffer_duration_months: isGulf ? 18 : 6,
      fiscal_impact_pct_gdp: isGulf ? 3.5 : 1.1,
      food_security_status: 'مستقر مع كفاءة ترشيد الإنفاق الرأسمالي',
      energy_balance_status: 'فائض إنتاجي مع إعادة جدولة الصادرات',
      currency_pressure_level: isGulf ? 'منخفض' : 'متوسط',
      recommended_brotherly_synergies: [
        'تسوية المعاملات التجارية البينية عبر منصات العملات المحلية (بُنى وآفاق) لتوفير السيولة الصعبة.',
        'توجيه استثمارات الصناديق السيادية الخليجية للمشاريع الإنتاجية والصناعية الكبرى في مصر والمغرب والأردن.'
      ],
      emergency_mitigation_plan_ar: [
        'تسريع خطط التنويع الاقتصادي ورفع الإيرادات غير النفطية ومشاركة القطاع الخاص.',
        'تفعيل تحالفات الشراكة الصناعية التكاملية لسد فجوات الاستيراد بالإنتاج العربي المشترك.'
      ]
    };
  }

  // Default: drought & water stress
  const score = isGulf ? 89 : code === 'EG' ? 82 : isMaghreb ? 76 : 58;
  return {
    country_code: code,
    country_name_ar: code,
    shock_type: 'موجة جفاف موسمي حاد وانخفاض التدفقات المائية بنسبة 25%',
    shock_magnitude: 'تراجع رقعة المحاصيل المطرية واشتداد الطلب على المياه العذبة',
    overall_resilience_score: score,
    buffer_duration_months: 8.5,
    fiscal_impact_pct_gdp: 1.2,
    food_security_status: 'تشغيل محطات معالجة مياه الصرف الزراعي والصوامع المركزية',
    energy_balance_status: 'تشغيل محطات التحلية بالطاقة الشمسية بنسبة 100% لتفادي استهلاك الوقود الأحفوري',
    currency_pressure_level: isGulf ? 'منخفض' : 'متوسط',
    recommended_brotherly_synergies: [
      'تبادل تقنيات التحلية بالتناضح العكسي والاستمطار الصناعي وتدوير المياه المعالجة ثلاثياً.',
      'إدارة أحواض المياه الجوفية المشتركة (الحجر الرملي النوبي وحوض الساق والديسي) بالتنسيق الفني المشترك.'
    ],
    emergency_mitigation_plan_ar: [
      'حظر زراعة المحاصيل الشرهة للمياه وتكثيف الزراعات المائية (Hydroponics) والبيوت المحمية.',
      'زيادة الطاقة الإنتاجية لمحطات التحلية بنسبة 20% وربطها بالشبكة القومية الموحدة للمياه.'
    ]
  };
}
