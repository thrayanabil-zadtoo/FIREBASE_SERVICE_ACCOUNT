export interface PackingItem {
  id: string;
  title_ar: string;
  category: 'docs' | 'tech' | 'health' | 'clothes' | 'family' | 'worship' | 'security';
  category_ar: string;
  importance: 'essential' | 'recommended' | 'optional';
  seasons?: Array<'all' | 'summer' | 'winter' | 'rain' | 'beach'>;
  tripTypes?: Array<'all' | 'leisure' | 'family' | 'business' | 'pilgrimage'>;
  tip_ar?: string;
}

export interface ElectricalPlugGuide {
  country_code: string;
  country_name_ar: string;
  plug_types: string[]; // e.g. ['Type G']
  voltage: string; // e.g. '230V'
  frequency: string; // e.g. '50Hz'
  adapter_needed_for_arab_traveler: string; // explanation
  plug_images_desc: string;
}

export interface TravelItinerary {
  id: string;
  destination_code: string;
  destination_name_ar: string;
  duration_days: number;
  trip_style_ar: string;
  best_season_ar: string;
  estimated_cost_level: 'اقتصادي' | 'متوسط' | 'فاخر';
  days: Array<{
    day_number: number;
    title_ar: string;
    morning_ar: string;
    afternoon_ar: string;
    evening_ar: string;
    halal_food_tip_ar: string;
    transport_tip_ar: string;
  }>;
}

export const SMART_PACKING_ITEMS: PackingItem[] = [
  // 1. الوثائق والأوراق والمالية
  {
    id: 'doc-passport',
    title_ar: 'جواز السفر الأصلي (صالح لأكثر من 6 أشهر من تاريخ العودة)',
    category: 'docs',
    category_ar: 'الوثائق والمالية',
    importance: 'essential',
    seasons: ['all'],
    tripTypes: ['all'],
    tip_ar: 'تأكد من وجود صفحات بيضاء كافية لختم الدخول والخروج.'
  },
  {
    id: 'doc-visa-print',
    title_ar: 'نسخة ورقية مطبوعة من التأشيرة الإلكترونية أو حجز الفندق المؤكد',
    category: 'docs',
    category_ar: 'الوثائق والمالية',
    importance: 'essential',
    seasons: ['all'],
    tripTypes: ['all'],
    tip_ar: 'تطلبها بعض سلطات الجوازات والمطارات حتى في وجود النسخة على الهاتف.'
  },
  {
    id: 'doc-cards-cash',
    title_ar: 'بطاقتان مصرفيتان مختلفتان (فيزا وماستركارد) + مبلغ نقدي طوارئ',
    category: 'docs',
    category_ar: 'الوثائق والمالية',
    importance: 'essential',
    seasons: ['all'],
    tripTypes: ['all'],
    tip_ar: 'أبلغ مصرفك بمواعيد سفرك لتفادي حظر البطاقة عند أول عملية سحب خارجي.'
  },
  {
    id: 'doc-insurance',
    title_ar: 'وثيقة التأمين الصحي الدولي لتغطية الحالات الطارئة ومستشفيات السفر',
    category: 'docs',
    category_ar: 'الوثائق والمالية',
    importance: 'essential',
    seasons: ['all'],
    tripTypes: ['all'],
    tip_ar: 'إلزامية لمنطقة الشنغن وبريطانيا وتريح البال من أي تكاليف طبية مفاجئة.'
  },
  {
    id: 'doc-driving-license',
    title_ar: 'رخصة القيادة الدولية المعتمدة (IDP) إذا كنت تنوي استئجار سيارة',
    category: 'docs',
    category_ar: 'الوثائق والمالية',
    importance: 'recommended',
    seasons: ['all'],
    tripTypes: ['leisure', 'family'],
    tip_ar: 'مطلوبة في سويسرا، أذربيجان، البوسنة، والولايات المتحدة لاستلام السيارة.'
  },

  // 2. الإلكترونيات والتقنية
  {
    id: 'tech-universal-adapter',
    title_ar: 'المحول الكهربائي الدولي الشامل (Universal Power Adapter)',
    category: 'tech',
    category_ar: 'الإلكترونيات والتقنية',
    importance: 'essential',
    seasons: ['all'],
    tripTypes: ['all'],
    tip_ar: 'يدعم جميع المقابس العالمية (Type A/C/G/I) مع مخارج USB-C سريعة.'
  },
  {
    id: 'tech-powerbank',
    title_ar: 'بنك طاقة محمول (باور بانك) أقل من 20,000 مللي أمبير',
    category: 'tech',
    category_ar: 'الإلكترونيات والتقنية',
    importance: 'essential',
    seasons: ['all'],
    tripTypes: ['all'],
    tip_ar: 'احمله حصراً في حقيبة اليد (Cabin bag)؛ الطيران يحظر وضعه في الحقائب المشحونة.'
  },
  {
    id: 'tech-esim',
    title_ar: 'شريحة إلكترونية دولية (eSIM) مثبتة مسبقاً قبل الإقلاع',
    category: 'tech',
    category_ar: 'الإلكترونيات والتقنية',
    importance: 'recommended',
    seasons: ['all'],
    tripTypes: ['all'],
    tip_ar: 'توفر عليك طوابير شراء الشريحة بمطار الوصول وتمنحك إنترنت فوري لتطبيقات الملاحة.'
  },
  {
    id: 'tech-headphones',
    title_ar: 'سماعات عازلة للضوضاء (Noise-Cancelling) لراحة الطيران والقطارات',
    category: 'tech',
    category_ar: 'الإلكترونيات والتقنية',
    importance: 'recommended',
    seasons: ['all'],
    tripTypes: ['all'],
    tip_ar: 'مفيدة جداً للتركيز والنوم أثناء الرحلات الطويلة وتقليل إرهاق السفر.'
  },

  // 3. الصحة والأدوية
  {
    id: 'health-prescriptions',
    title_ar: 'الأدوية اليومية المزمنة مع وصفة طبية أصلية ومترجمة بالإنجليزية',
    category: 'health',
    category_ar: 'الصحة والإسعافات',
    importance: 'essential',
    seasons: ['all'],
    tripTypes: ['all'],
    tip_ar: 'احفظها في عبواتها الأصلية المكتوب عليها الاسم الطبي لتفادي مساءلة الجمارك.'
  },
  {
    id: 'health-first-aid',
    title_ar: 'حقيبة إسعافات صغيرة (مسكن باراسيتامول، مضاد حموضة، أقراص دوار السفر، ضمادات)',
    category: 'health',
    category_ar: 'الصحة والإسعافات',
    importance: 'essential',
    seasons: ['all'],
    tripTypes: ['all'],
    tip_ar: 'في دول مثل سويسرا أو اليابان يصعب شراء بعض الأدوية البسيطة دون وصفة الطبيب.'
  },
  {
    id: 'health-sunscreen',
    title_ar: 'واقي شمس طبي + مرطب شفاه وقبعة واقية من الشمس',
    category: 'health',
    category_ar: 'الصحة والإسعافات',
    importance: 'recommended',
    seasons: ['summer', 'beach'],
    tripTypes: ['leisure', 'family'],
    tip_ar: 'ضروري للوجهات الاستوائية وشواطئ المالديف والرحلات البحرية في تايلاند.'
  },

  // 4. الملابس والأناقة حسب المناخ
  {
    id: 'clothes-walking-shoes',
    title_ar: 'حذاء مشي طبي عالي الجودة ومريح ومانع للانزلاق',
    category: 'clothes',
    category_ar: 'الملابس والأناقة',
    importance: 'essential',
    seasons: ['all'],
    tripTypes: ['all'],
    tip_ar: 'السفر يتطلب معدل 15,000 إلى 20,000 خطوة يومياً في المدن التاريخية والمتاحف.'
  },
  {
    id: 'clothes-thermal',
    title_ar: 'ملابس داخلية حرارية (Thermal Underwear) وجوارب صوفية',
    category: 'clothes',
    category_ar: 'الملابس والأناقة',
    importance: 'essential',
    seasons: ['winter'],
    tripTypes: ['all'],
    tip_ar: 'ضرورية لوجهات أوروبا الشمالية والشرقية وروسيا وسويسرا بين نوفمبر ومارس.'
  },
  {
    id: 'clothes-rain-jacket',
    title_ar: 'معطف مقاوم للماء والرياح (Wind & Waterproof Jacket) أو مظلة خفيفة',
    category: 'clothes',
    category_ar: 'الملابس والأناقة',
    importance: 'recommended',
    seasons: ['rain', 'winter', 'all'],
    tripTypes: ['all'],
    tip_ar: 'طقس بريطانيا وسويسرا ومناطق شرق آسيا قد يتغير ويمطر في أي لحظة.'
  },

  // 5. الصلاة والعبادة للمسافر المسلم
  {
    id: 'worship-prayer-mat',
    title_ar: 'سجادة صلاة جيب خفيفة مقاومة للماء مع بوصلة القبلة المدمجة',
    category: 'worship',
    category_ar: 'الصلاة والعبادة',
    importance: 'essential',
    seasons: ['all'],
    tripTypes: ['all'],
    tip_ar: 'تمكنك من أداء الصلاة بكرامة وطمأنينة في حدائق المطارات ومحطات القطار.'
  },
  {
    id: 'worship-offline-quran',
    title_ar: 'تحميل المصحف الشريف وأوقات الصلاة أوفلاين على الهاتف',
    category: 'worship',
    category_ar: 'الصحة والإسعافات',
    importance: 'recommended',
    seasons: ['all'],
    tripTypes: ['all'],
    tip_ar: 'لمتابعة أوقات الصلاة عند السفر في الطائرة أو في الأماكن التي لا تتصل بالشبكة.'
  },
  {
    id: 'worship-water-spray',
    title_ar: 'عبوة رذاذ ماء صغيرة محمولة للوضوء أو شطاف سفر متنقل',
    category: 'worship',
    category_ar: 'الصلاة والعبادة',
    importance: 'recommended',
    seasons: ['all'],
    tripTypes: ['all'],
    tip_ar: 'تسهل الطهارة والوضوء في الفنادق والمرافق العامة غير المزودة بشطافات.'
  },

  // 6. مستلزمات العائلة والأمان
  {
    id: 'family-airtags',
    title_ar: 'أجهزة تتبع الحقائب الذكية (Apple AirTag أو Galaxy SmartTag)',
    category: 'security',
    category_ar: 'الأمان والامتعة',
    importance: 'essential',
    seasons: ['all'],
    tripTypes: ['all'],
    tip_ar: 'ضع واحداً في كل حقيبة مشحونة لمعرفة موقعها فوراً عبر الهاتف في أي مطار.'
  },
  {
    id: 'family-stroller',
    title_ar: 'عربة أطفال خفيفة الوزن قابلة للطي حتى حجم المقصورة (Cabin Size)',
    category: 'family',
    category_ar: 'العائلة والأطفال',
    importance: 'essential',
    seasons: ['all'],
    tripTypes: ['family'],
    tip_ar: 'مثل عربات Yoyo أو ما يماثلها؛ تسمح شركات الطيران بحملها مباشرة داخل الكابينة.'
  }
];

export const ELECTRICAL_PLUG_DATABASE: Record<string, ElectricalPlugGuide> = {
  GB: {
    country_code: 'GB',
    country_name_ar: 'المملكة المتحدة (بريطانيا)',
    plug_types: ['Type G (المقبس الثلاثي البريطاني)'],
    voltage: '230V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'مطابق تماماً لمقابس دول الخليج العربي (السعودية والإمارات وقطر والكويت). المسافرون من مصر وبلاد الشام والمغرب العربي يحتاجون لمحول من الرأس الثنائي إلى الثلاثي.',
    plug_images_desc: 'ثلاث فتحات مستطيلة سميكة مع زر تشغيل مخصص على الجدار.'
  },
  TR: {
    country_code: 'TR',
    country_name_ar: 'تركيا',
    plug_types: ['Type C', 'Type F (الرأس الدائري الأوروبي الثنائي)'],
    voltage: '230V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'مسافرو الخليج يحتاجون محولاً من الرأس الثلاثي البريطاني إلى الثنائي الدائري. مسافرو مصر والأردن ولبنان والمغرب العربي أجهزتهم متوافقة مباشرة.',
    plug_images_desc: 'فتحتان دائريتان غائرتان داخل المقبس مع ملامسات تأريض جانبية.'
  },
  FR: {
    country_code: 'FR',
    country_name_ar: 'فرنسا',
    plug_types: ['Type C', 'Type E (الأوروبي الثنائي مع سن التأريض البارز)'],
    voltage: '230V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'مسافرو الخليج يحتاجون محول Type G إلى Type E/C. متوافق مع شواحن الهواتف الثنائية الذكية العادية.',
    plug_images_desc: 'فتحتان دائريتان مع سن معدني علوي بارز للتأريض.'
  },
  CH: {
    country_code: 'CH',
    country_name_ar: 'سويسرا',
    plug_types: ['Type J (السويسري السداسي)'],
    voltage: '230V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'المقابس السويسرية دقيقة وغائرة بشكل سداسي. شواحن الهاتف الثنائية النحيفة Type C تدخل فيها غالباً، لكن الأجهزة ذات الرؤوس السميكة تحتاج محولاً سويسرياً خاصاً Type J.',
    plug_images_desc: 'شكل سداسي غائر بثلاث فتحات دائرية متجاورة تشكل مثلثاً.'
  },
  JP: {
    country_code: 'JP',
    country_name_ar: 'اليابان',
    plug_types: ['Type A', 'Type B (الشفرات الأمريكية المسطحة)'],
    voltage: '100V (منخفض)',
    frequency: '50/60Hz',
    adapter_needed_for_arab_traveler: '⚠️ تنبيه مهم جداً: الفولتية 100V فقط (بدلاً من 220V). شواحن الهواتف واللابتوبات تدعم (100-240V) تلقائياً، ولكن مجففات الشعر وأجهزة تصفيف الحرارة العربية لن تعمل أو ستعمل بضعف شديد.',
    plug_images_desc: 'فتحتان عموديتان مسطحتان متوازيتان دون سن تأريض في أغلب الفنادق.'
  },
  US: {
    country_code: 'US',
    country_name_ar: 'الولايات المتحدة الأمريكية',
    plug_types: ['Type A', 'Type B'],
    voltage: '120V',
    frequency: '60Hz',
    adapter_needed_for_arab_traveler: 'يحتاج محولاً للشفرات المسطحة. تأكد أن أجهزتك تقبل 110-120V.',
    plug_images_desc: 'فتحتان مسطحتان رأسيتان، مع فتحة دائرية سفلية للتأريض في Type B.'
  },
  MV: {
    country_code: 'MV',
    country_name_ar: 'المالديف',
    plug_types: ['Type G (البريطاني)', 'Type D', 'Type C'],
    voltage: '230V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'أغلب المنتجعات توفر مقابس عالمية متوافقة مباشرة، أو تستخدم المقبس البريطاني Type G المطابق للخليج.',
    plug_images_desc: 'مقابس بريطانية ثلاثية أو مقابس جدارية دولية شاملة في الفلل.'
  },
  AZ: {
    country_code: 'AZ',
    country_name_ar: 'أذربيجان',
    plug_types: ['Type C', 'Type F'],
    voltage: '220V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'تحتاج محولاً من الرأس الثلاثي البريطاني إلى الرأس الثنائي الأوروبي.',
    plug_images_desc: 'فتحتان دائريتان أوروبيتان قياسيتان.'
  },
  SA: {
    country_code: 'SA',
    country_name_ar: 'المملكة العربية السعودية',
    plug_types: ['Type G (الثلاثي البريطاني المعتمد من SASO)'],
    voltage: '220V',
    frequency: '60Hz',
    adapter_needed_for_arab_traveler: 'المعيار الرسمي الموحد هو المقبس الثلاثي Type G. المسافرون من أوروبا أو مصر يحتاجون محولاً.',
    plug_images_desc: 'مقبس ثلاثي بريطاني مستطيل معتمد رسمياً.'
  },
  AE: {
    country_code: 'AE',
    country_name_ar: 'الإمارات العربية المتحدة',
    plug_types: ['Type G (الثلاثي البريطاني)'],
    voltage: '230V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'المقبس البريطاني Type G في جميع الفنادق والمنشآت.',
    plug_images_desc: 'مقبس ثلاثي بريطاني مستطيل.'
  },
  EG: {
    country_code: 'EG',
    country_name_ar: 'مصر',
    plug_types: ['Type C', 'Type F'],
    voltage: '220V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'المقبس الثنائي الدائري الأوروبي في معظم المنازل والفنادق.',
    plug_images_desc: 'فتحتان دائريتان ثنائيتان.'
  },
  MY: {
    country_code: 'MY',
    country_name_ar: 'ماليزيا',
    plug_types: ['Type G (الثلاثي البريطاني)'],
    voltage: '240V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'مطابق للخليج وبريطانيا بنسبة 100%.',
    plug_images_desc: 'مقبس ثلاثي بريطاني مستطيل Type G.'
  },
  TH: {
    country_code: 'TH',
    country_name_ar: 'تايلاند',
    plug_types: ['Type A', 'Type B', 'Type C', 'Type O'],
    voltage: '220V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'المقابس التايلاندية هجينة ومريحة جداً؛ تقبل الرؤوس الدائرية الأوروبية والشفرات الأمريكية المسطحة، لكن الرأس البريطاني الثلاثي يحتاج محولاً.',
    plug_images_desc: 'مقابس هجينة ذكية تقبل الرؤوس الدائرية والمسطحة معاً.'
  },
  DE: {
    country_code: 'DE',
    country_name_ar: 'ألمانيا',
    plug_types: ['Type C', 'Type F (Schuko)'],
    voltage: '230V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'مسافرو الخليج يحتاجون محولاً من الرأس الثلاثي Type G إلى الثنائي الدائري Type F.',
    plug_images_desc: 'مقبس دائري غائر مع مشبكي تأريض جانبيين.'
  },
  IT: {
    country_code: 'IT',
    country_name_ar: 'إيطاليا',
    plug_types: ['Type C', 'Type F', 'Type L'],
    voltage: '230V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'المقبس الإيطالي Type L يضم 3 فتحات دائرية متتالية على خط مستقيم؛ شواحن الهواتف Type C تركب فيه مباشرة.',
    plug_images_desc: 'ثلاث فتحات دائرية على خط مستقيم واحد.'
  },
  ES: {
    country_code: 'ES',
    country_name_ar: 'إسبانيا',
    plug_types: ['Type C', 'Type F'],
    voltage: '230V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'مطابق للمعايير الأوروبية الثنائية (يحتاج محولاً للرأس الثلاثي البريطاني).',
    plug_images_desc: 'فتحتان دائريتان قياسيتان.'
  },
  AT: {
    country_code: 'AT',
    country_name_ar: 'النمسا',
    plug_types: ['Type C', 'Type F'],
    voltage: '230V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'مطابق للنظام الألماني والأوروبي (Schuko).',
    plug_images_desc: 'فتحتان دائريتان مع تأريض جانبي.'
  },
  BA: {
    country_code: 'BA',
    country_name_ar: 'البوسنة والهرسك',
    plug_types: ['Type C', 'Type F'],
    voltage: '230V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'المقبس الأوروبي الثنائي المعتاد.',
    plug_images_desc: 'فتحتان دائريتان قياسيتان.'
  },
  GE: {
    country_code: 'GE',
    country_name_ar: 'جورجيا',
    plug_types: ['Type C', 'Type F'],
    voltage: '220V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'المقبس الأوروبي الثنائي الدائري.',
    plug_images_desc: 'فتحتان دائريتان قياسيتان.'
  },
  ID: {
    country_code: 'ID',
    country_name_ar: 'إندونيسيا (بالي وجاكرتا)',
    plug_types: ['Type C', 'Type F', 'Type G'],
    voltage: '230V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'تستخدم المقبس الأوروبي الثنائي في أغلب الفنادق والمقبس البريطاني في بعض منتجعات بالي العالمية.',
    plug_images_desc: 'فتحتان دائريتان ومقابس دولية مشتركة بالمنتجعات.'
  },
  QA: {
    country_code: 'QA',
    country_name_ar: 'دولة قطر',
    plug_types: ['Type G (الثلاثي البريطاني)'],
    voltage: '240V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'المعيار الخليجي الموحد Type G في جميع الفنادق والمنشآت.',
    plug_images_desc: 'مقبس ثلاثي بريطاني مستطيل.'
  },
  KW: {
    country_code: 'KW',
    country_name_ar: 'دولة الكويت',
    plug_types: ['Type G (الثلاثي البريطاني)'],
    voltage: '240V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'مطابق للخليج بنسبة 100%.',
    plug_images_desc: 'مقبس ثلاثي بريطاني مستطيل.'
  },
  OM: {
    country_code: 'OM',
    country_name_ar: 'سلطنة عُمان',
    plug_types: ['Type G (الثلاثي البريطاني)'],
    voltage: '240V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'مطابق للمعيار الخليجي الموحد Type G.',
    plug_images_desc: 'مقبس ثلاثي بريطاني مستطيل.'
  },
  BH: {
    country_code: 'BH',
    country_name_ar: 'مملكة البحرين',
    plug_types: ['Type G (الثلاثي البريطاني)'],
    voltage: '230V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'مطابق للمعيار الخليجي الموحد Type G.',
    plug_images_desc: 'مقبس ثلاثي بريطاني مستطيل.'
  },
  MA: {
    country_code: 'MA',
    country_name_ar: 'المملكة المغربية',
    plug_types: ['Type C', 'Type E'],
    voltage: '220V',
    frequency: '50Hz',
    adapter_needed_for_arab_traveler: 'المقبس الثنائي الفرنسي Type E (يحتاج محولاً لمسافري الخليج).',
    plug_images_desc: 'فتحتان دائريتان مع سن تأريض علوي.'
  }
};

export const CURATED_ITINERARIES: TravelItinerary[] = [
  // 1. لندن - 5 أيام
  {
    id: 'itin-london-5d',
    destination_code: 'GB',
    destination_name_ar: 'لندن (المملكة المتحدة)',
    duration_days: 5,
    trip_style_ar: 'سياحة عائلية وثقافية وتسوق',
    best_season_ar: 'مايو – سبتمبر',
    estimated_cost_level: 'متوسط',
    days: [
      {
        day_number: 1,
        title_ar: 'قلب العاصمة الملكية ورمز التاريخ',
        morning_ar: 'جولة مشي تبدأ من ساحة الطرف الأغر (Trafalgar Square)، ثم المشي عبر شارع Whitehall إلى ساعة بيغ بن والبرلمان وعين لندن (London Eye).',
        afternoon_ar: 'ركوب عين لندن لمشاهدة بانوراما المدينة، ثم التنزه في حديقة سانت جيمس الجميلة ومشاهدة قصر باكنغهام الملكي.',
        evening_ar: 'التسوق والتجول في كوفنت غاردن (Covent Garden) ومشاهدة العروض الحية وشرب الشاي الإنجليزي.',
        halal_food_tip_ar: 'منطقة كوفنت غاردن وسوهو مليئة بخيارات البيرغر الحلال والمطاعم الهندية واللبنانية المعتمدة.',
        transport_tip_ar: 'استخدم بطاقتك الائتمانية اللاتلامسية أو Apple Pay على بوابات المترو (Tube) مباشرة دون شراء تذاكر ورقية.'
      },
      {
        day_number: 2,
        title_ar: 'عالم المتاحف والمساحات الخضراء في هايد بارك',
        morning_ar: 'زيارة متحف التاريخ الطبيعي ومتحف العلوم في ساوث كنسينغتون (الدخول مجاني).',
        afternoon_ar: 'استئجار قارب في بحيرة سيربنتين في هايد بارك والتجول في حدائق كنسينغتون وزيارة قصر كنسينغتون.',
        evening_ar: 'التسوق في متجر هارودز الفاخر (Harrods) في نايتسبريدج وتناول الحلويات في صالة الطعام الشهيرة.',
        halal_food_tip_ar: 'شارع إدجور رود (Edgware Road) الشهير على بعد دقائق مشياً من هايد بارك يضم عشرات المطاعم والمقاهي العربية والخليجية والشامية.',
        transport_tip_ar: 'محطة South Kensington تخدم خطوط District وCircle وPiccadilly.'
      },
      {
        day_number: 3,
        title_ar: 'برج لندن ونهر التايمز وجسر البرج الشاهق',
        morning_ar: 'زيارة قلعة برج لندن التاريخية (Tower of London) ورؤية مجوهرات التاج الملكي البريطاني.',
        afternoon_ar: 'المشي على الممر الزجاجي العلوي لجسر البرج (Tower Bridge)، ثم جولة بحرية نهرية بالزورق السريع Uber Boat إلى منطقة غرينتش.',
        evening_ar: 'استكشاف ناطحة سحاب الشارد (The Shard) أو حديقة السماء (Sky Garden) لمشاهدة أضواء العاصمة ليلاً.',
        halal_food_tip_ar: 'سوق بورو ماركت (Borough Market) يقدم أطعمة طازجة وخيارات حلال عالمية متميزة.',
        transport_tip_ar: 'حجز تذكرة حديقة Sky Garden مجاني ولكن يتطلب الحجز المسبق عبر الإنترنت قبل أسبوعين إلى ثلاثة.'
      },
      {
        day_number: 4,
        title_ar: 'التسوق الأشهر عالمياً: أكسفورد وريجنت وشارع بوند',
        morning_ar: 'جولة تسوق متكاملة تبدأ من ماربل آرتش وتمر بشارع أكسفورد ومتاجر سيلفريدجز (Selfridges).',
        afternoon_ar: 'التنزه في شارع ريجنت (Regent Street) وزيارة متجر الألعاب التاريخي Hamleys ومحلات شارع كارنابي العصرية.',
        evening_ar: 'حضور مسرحية عالمية شهيرة في منطقة الوست إند (West End) في ليستر سكوير.',
        halal_food_tip_ar: 'منطقة سوهو خلف شارع ريجنت تحوي مطاعم ستيك وبيرغر ومأكولات آسيوية حلال ممتازة.',
        transport_tip_ar: 'محطة Oxford Circus تكون مزدحمة عصراً؛ يفضل النزول بمحطة Bond Street أو Tottenham Court Road عبر خط Elizabeth Line الحديث.'
      },
      {
        day_number: 5,
        title_ar: 'ريف لندن الأخضر وقصر وندسور أو أوتلت بيستر فيلدج',
        morning_ar: 'رحلة قطار صباحية (45 دقيقة) إلى قلعة وندسور التاريخية ومقر العائلة الملكية أو التوجه لقطار Bicester Village للتسوق المخفض.',
        afternoon_ar: 'التجول في شوارع وندسور التاريخية أو إتمام مشتريات الأزياء الفاخرة بأسعار الأوتلت.',
        evening_ar: 'العودة لوسط لندن وعشاء وداعي مطل على نهر التايمز وتجهيز الحقائب للعودة.',
        halal_food_tip_ar: 'في وندسور توجد مطاعم هندية وشامية حلال بالقرب من محطة القطار المركزية.',
        transport_tip_ar: 'قطارات وندسور تنطلق من محطة لندن بادينغتون (Paddington) أو واترلو (Waterloo).'
      }
    ]
  },

  // 2. إسطنبول - 5 أيام
  {
    id: 'itin-istanbul-5d',
    destination_code: 'TR',
    destination_name_ar: 'إسطنبول (تركيا)',
    duration_days: 5,
    trip_style_ar: 'تاريخ عثماني وأسواق وبوسفور',
    best_season_ar: 'أبريل – نوفمبر',
    estimated_cost_level: 'اقتصادي',
    days: [
      {
        day_number: 1,
        title_ar: 'مهد الإمبراطورية: السلطان أحمد وآيا صوفيا وقصر توبكابي',
        morning_ar: 'زيارة جامع آيا صوفيا الخالد والمسجد الأزرق (جامع السلطان أحمد) وميدان سباق الخيل البيزنطي.',
        afternoon_ar: 'استكشاف قصر توبكابي (قصر الباب العالي) وجناح الأمانات المقدسة وغرفة الحريم وحديقة غلهانة الخضراء.',
        evening_ar: 'نزول صهريج البازيليك المائي الغارق (Yerebatan Sarnıcı) والاستمتاع بإضاءاته الساحرة وأعمدة ميدوسا.',
        halal_food_tip_ar: 'جميع المطاعم حلال بالكامل؛ جرب كفتة السلطان أحمد التاريخية (Tarihi Sultanahmet Köftecisi).',
        transport_tip_ar: 'استخدم خط ترام T1 للوصول المباشر إلى محطة Sultanahmet.'
      },
      {
        day_number: 2,
        title_ar: 'البوسفور الساحر وبرج غلطة وأضواء تقسيم',
        morning_ar: 'الصعود لبرج غلطة لرؤية مآذن إسطنبول والقرن الذهبي بزاوية 360 درجة، ثم المشي عبر جسر غلطة.',
        afternoon_ar: 'التنزه في شارع الاستقلال وتجربة الترام الأحمر التاريخي وزيارة ميدان تقسيم.',
        evening_ar: 'رحلة بحرية بالعبّارة العامة في مضيق البوسفور بين قارتي أوروبا وآسيا حتى جسر البوسفور وقت الغروب.',
        halal_food_tip_ar: 'تناول ساندويتش السمك المشوي الطازج (Balık Ekmek) تحت جسر غلطة أو في ميناء إمينونو.',
        transport_tip_ar: 'عبّارات إمينونو العامة تكلف أقل من دولار وتمنحك نفس التجربة للبواخر السياحية الخاصة.'
      },
      {
        day_number: 3,
        title_ar: 'سحر التسوق التاريخي: البازار الكبير وسوق التوابل المصري',
        morning_ar: 'التجول في أزقة الغراند بازار (Kapalıçarşı) بأكثر من 4000 متجر للذهب والفضة والجلود والسجاد اليدوي.',
        afternoon_ar: 'زيارة السوق المصري (سوق التوابل) وتذوق الحلقوم التركي الفاخر والمكسرات وشاي التفاح والزعفران.',
        evening_ar: 'زيارة جامع السليمانية المعماري الرائع المطل على القرن الذهبي والاستمتاع بحدائقه الهادئة.',
        halal_food_tip_ar: 'مطاعم الفاصوليا العثمانية المجففة العريقة أمام جامع السليمانية (Erzincanlı Ali Baba).',
        transport_tip_ar: 'المساومة ضرورية في البازار الكبير؛ ابدأ بعرض 60% من السعر المعروض.'
      },
      {
        day_number: 4,
        title_ar: 'الجانب الآسيوي الهادئ: أوسكودار وتل العرائس وكاديكوي',
        morning_ar: 'ركوب العبّارة البحرية من إمينونو إلى أوسكودار ورؤية برج الفتاة (Kız Kulesi) في قلب البحر.',
        afternoon_ar: 'الصعود إلى تل العرائس (تشامليجا) وزيارة جامع تشامليجا الأكبر في تركيا وإطلالته الشاملة على المدينة.',
        evening_ar: 'التجول في شوارع حي كاديكوي الحيوية وأسواقه الشعبية وتناول البوظة التركية التقليدية (الماراك).',
        halal_food_tip_ar: 'مطاعم كباب إسكندر التركي الشهير في حي كاديكوي.',
        transport_tip_ar: 'استخدم خط قطار مرمراي (Marmaray) الذي يعبر تحت قاع مضيق البوسفور بين القارتين في 4 دقائق فقط.'
      },
      {
        day_number: 5,
        title_ar: 'إطلالة بيير لوتي الخلابة وأورتاكوي وباشكتاش',
        morning_ar: 'ركوب التلفريك إلى مقهى بيير لوتي المطل على خليج القرن الذهبي في منطقة أيوب سلطان وزيارة جامع الصحابي أبي أيوب الأنصاري.',
        afternoon_ar: 'التوجه إلى منطقة أورتاكوي الساحلية وتصوير الجامع الأبيض الشهير تحت جسر البوسفور المعلق وتناول بطاطا الكومبير التركية العملاقة والوافل.',
        evening_ar: 'التسوق في مجمع وادي إسطنبول (Vadistanbul) أو مول إستينيا بارك والتجهيز للمغادرة.',
        halal_food_tip_ar: 'كومبير أورتاكوي مع إطلالة البوسفور تجربة لا تفوت.',
        transport_tip_ar: 'احجز التاكسي عبر تطبيق BiTaksi أو Uber لتجنب مشاكل العداد مع التكاسي العادية.'
      }
    ]
  },

  // 3. المالديف - 5 أيام
  {
    id: 'itin-maldives-5d',
    destination_code: 'MV',
    destination_name_ar: 'المالديف',
    duration_days: 5,
    trip_style_ar: 'استجمام شاطئي فاخر وغوص وشهر عسل',
    best_season_ar: 'ديسمبر – أبريل',
    estimated_cost_level: 'فاخر',
    days: [
      {
        day_number: 1,
        title_ar: 'الوصول إلى الجنة الاستوائية والانتقال بالطيران المائي',
        morning_ar: 'الهبوط في مطار فيلانا الدولي بماليه، واستقبال المنتجع والانتقال المثير بالطيران المائي (Seaplane) أو القارب السريع فوق الحلقات المرجانية الزرقاء.',
        afternoon_ar: 'تسجيل الدخول في الفيلا العائمة فوق سطح المحيط (Water Villa) والاسترخاء على التراس الخاص.',
        evening_ar: 'عشاء شاطئي على الرمال البيضاء تحت النجوم وصوت الأمواج الهادئة.',
        halal_food_tip_ar: 'المالديف دولة مسلمة 100%؛ جميع الأطعمة واللحوم في المنتجعات حلال مع توفر أطباق المأكولات البحرية الطازجة.',
        transport_tip_ar: 'رحلات الطيران المائي تعمل نهاراً فقط حتى الساعة 4:30 عصراً؛ احرص على حجز رحلة طيران دولية تصل صباحاً.'
      },
      {
        day_number: 2,
        title_ar: 'سحر الشعاب المرجانية والغطس مع السلاحف البحرية',
        morning_ar: 'جولة سنوركلينغ (غوص سطحي) برفقة مدرب بحري في الحيد المرجاني للمنتجع ومشاهدة السلاحف والأسماك الملونة.',
        afternoon_ar: 'جلسة تدليك استرخائية في سبا المنتجع المطل على مياه المحيط الصافية.',
        evening_ar: 'رحلة بحرية وقت الغروب على متن قارب الدوني المالديفي التقليدي لمشاهدة الدلافين وهي تقفز بجانب القارب.',
        halal_food_tip_ar: 'جرب سمك التونة المشوي المالديفي مع بهارات الكاري وجوز الهند الطازج.',
        transport_tip_ar: 'معدات السنوركلينغ مجانية في معظم المنتجعات؛ اطلبها فور وصولك من مركز الغوص.'
      },
      {
        day_number: 3,
        title_ar: 'الرياضات المائية وجزيرة الرمال المعزولة (Sandbank)',
        morning_ar: 'رحلة خاصة إلى رصيف رملي معزول وسط المحيط (Sandbank Picnic) لالتقاط أجمل الصور والسباحة بخصوصية تامة.',
        afternoon_ar: 'ممارسة الرياضات المائية الممتعة: التجديف بالكاياك الشفاف (Clear Kayak) والدراجات المائية (Jet Ski).',
        evening_ar: 'سينما مفتوحة على شاطئ البحر مع فشار طازج وعصائر استوائية باردة.',
        halal_food_tip_ar: 'المشروبات الطازجة من جوز الهند الطبيعي (Kurumba) متوفرة في كل مكان.',
        transport_tip_ar: 'احرص على استخدام واقي شمس صديق للبيئة البحرية (Reef-Safe) لحماية الشعاب المرجانية.'
      },
      {
        day_number: 4,
        title_ar: 'زيارة جزيرة مأهولة واستكشاف الثقافة المحلية',
        morning_ar: 'جولة إلى إحدى الجزر المحلية القريبة للتعرف على نمط حياة أهل المالديف وزيارة المساجد التاريخية والمتاجر الحرفية.',
        afternoon_ar: 'جلسة تصوير خاصة بفوتوغراف المنتجع في المسبح اللامتناهي وممشى الفلل الخشبية.',
        evening_ar: 'عشاء فاخر في مطعم تحت الماء أو عشاء شواء خاص للمأكولات البحرية.',
        halal_food_tip_ar: 'وجبات الماس هوني (Mas Huni) المالديفية للإفطار المكونة من التونة وجوز الهند والبصل مع خبز الروشي الساخن.',
        transport_tip_ar: 'الاحتشام مطلوب عند زيارة الجزر المحلية احتراماً للثقافة الإسلامية للبلاد.'
      },
      {
        day_number: 5,
        title_ar: 'وداع المالديف وجولة سريعة في العاصمة ماليه',
        morning_ar: 'إفطار عائم في مسبح الفيلا، والسباحة الأخيرة في مياه اللاغون الفيروزية.',
        afternoon_ar: 'الانتقال إلى المطار، وإذا كان لديك وقت يمكنك عمل جولة في العاصمة ماليه لزيارة المركز الإسلامي ومسجد السلطان محمد وفرودسوق السمك.',
        evening_ar: 'التوجه إلى صالة المغادرة بمطار ماليه والعودة للوطن بذكريات لا تنسى.',
        halal_food_tip_ar: 'مطاعم المطار وصالات الفرسان توفر وجبات حلال وعالمية.',
        transport_tip_ar: 'تأكد من تعبئة نموذج إقرار المسافر الإلكتروني المالديفي (IMUGA) أونلاين قبل 96 ساعة من موعد إقلاعك.'
      }
    ]
  },

  // 4. باريس - 5 أيام
  {
    id: 'itin-paris-5d',
    destination_code: 'FR',
    destination_name_ar: 'باريس (فرنسا)',
    duration_days: 5,
    trip_style_ar: 'فنون وأزياء ومتاحف عالمية ومعالم أيقونية',
    best_season_ar: 'مايو – أكتوبر',
    estimated_cost_level: 'متوسط',
    days: [
      {
        day_number: 1,
        title_ar: 'سحر الشانزلزيه وقوس النصر وبرج إيفل',
        morning_ar: 'المشي في جادة الشانزلزيه العالمية، وصعود منصة قوس النصر (Arc de Triomphe) لمشاهدة 12 شارعاً تشع من تحته.',
        afternoon_ar: 'التوجه إلى ساحة التروكاديرو لالتقاط الصور البانورامية لبرج إيفل، ثم الصعود إلى قمة البرج بالمصعد.',
        evening_ar: 'رحلة بحرية ممتعة في نهر السين بباخرة باتو موش (Bateaux Mouches) لمشاهدة أضواء العاصمة الساحرة.',
        halal_food_tip_ar: 'شارع الشانزلزيه والشوارع المتفرعة منه تضم مطاعم لبنانية ومغربية راقية وخيارات حلال متنوعة.',
        transport_tip_ar: 'مترو خط 1 يمر بكافة هذه المعالم بصورة مباشرة وسريعة.'
      },
      {
        day_number: 2,
        title_ar: 'كنوز اللوفر وحدائق التويلري الفاتنة وميدان فاندوم',
        morning_ar: 'زيارة متحف اللوفر العالمي ورؤية لوحة الموناليزا وتمثال فينوس وجناح الفنون الإسلامية المبهر.',
        afternoon_ar: 'التنزه في حدائق التويلري (Jardin des Tuileries) وتناول حلوى الماكرون الفرنسية من متجر لادوريه أو بيير هيرمي.',
        evening_ar: 'زيارة ميدان فاندوم الفاخر وشارع فوبورغ سانت أونوريه لاستكشاف دور الأزياء والمجوهرات العالمية.',
        halal_food_tip_ar: 'منطقة أوبرا تضم مطاعم شاورما وفلافل وبيرغر حلال فاخرة.',
        transport_tip_ar: 'حجز تذكرة اللوفر مسبقاً عبر الإنترنت إلزامي ومحدد بالساعة لتفادي الانتظار بالساعات.'
      },
      {
        day_number: 3,
        title_ar: 'قصر فرساي الملكي الملكي وحدائقه الأسطورية',
        morning_ar: 'ركوب قطار RER C إلى قصر فرساي واستكشاف قاعة المرايا الشهيرة وغرف الملوك.',
        afternoon_ar: 'استئجار عربة جولف كهربائية أو قارب تجديف في البحيرة الكبرى بحدائق فرساي والتمتع بالنوافير الموسيقية.',
        evening_ar: 'العودة لباريس وزيارة حي المارين اللاتيني (Quartier Latin) ومكتبة شكسبير آند كومباني التاريخية.',
        halal_food_tip_ar: 'مطاعم الكباب التركي والوجبات الحلال متوفرة بالقرب من محطة قطار فرساي ريف غوش.',
        transport_tip_ar: 'استخدم بطاقة نافيغو لمنطقة الزونات 1-5 لتغطية قطار فرساي دون تذاكر إضافية.'
      },
      {
        day_number: 4,
        title_ar: 'عالم ديزني لاند باريس أو قمة مونمارتر وكاتدرائية القلب الأقدس',
        morning_ar: 'خياران: يوم كامل ممتع للعائلة في ديزني لاند باريس، أو الصعود إلى هضبة مونمارتر وزيارة كنيسة ساكري كور.',
        afternoon_ar: 'التجول بين رسامي ساحة تيرتر (Place du Tertre) وشراء لوحات تذكارية مرسومة باليد.',
        evening_ar: 'التسوق في متاجر غاليري لافاييت (Galeries Lafayette) الفاخرة والاستمتاع بإطلالة التراس المجانية للسطح.',
        halal_food_tip_ar: 'حي باربيس القريب من مونمارتر وحي الدائرة العاشرة مليء بالجزارين والمطاعم الحلال 100%.',
        transport_tip_ar: 'قطار RER A يصل مباشرة إلى مدخل بوابات ديزني لاند في 40 دقيقة من قلب باريس.'
      },
      {
        day_number: 5,
        title_ar: 'حي لو ماريه التاريخي وحدائق لوكسمبورغ والتسوق الأخير',
        morning_ar: 'زيارة حدائق لوكسمبورغ (Jardin du Luxembourg) الهادئة وقصر مجلس الشيوخ.',
        afternoon_ar: 'جولة تسوق للماركات والمنتجات الفرنسية في أوتلت لا فالي فيلدج (La Vallée Village) قرب باريس.',
        evening_ar: 'عشاء فرنسي راقٍ وتوديع معالم المدينة والتجهيز للمطار.',
        halal_food_tip_ar: 'جرب مطاعم الستيك الحلال المعتمدة في الدائرة الثامنة.',
        transport_tip_ar: 'تأكد من استرداد ضريبة القيمة المضافة (Tax Free) في مطار شارل ديغول قبل شحن الحقائب عبر أجهزة PABLO الآلية.'
      }
    ]
  },

  // 5. سويسرا (إنترلاكن وزيورخ ولوزيرن) - 5 أيام
  {
    id: 'itin-switzerland-5d',
    destination_code: 'CH',
    destination_name_ar: 'سويسرا (جبال الألب والبحيرات)',
    duration_days: 5,
    trip_style_ar: 'طبيعة عذراء، قمم ثلجية، شلالات وبحيرات كريستالية',
    best_season_ar: 'مايو – أكتوبر (للصيف والطبيعة) / ديسمبر – مارس (للثلوج والتزلج)',
    estimated_cost_level: 'فاخر',
    days: [
      {
        day_number: 1,
        title_ar: 'الوصول إلى زيورخ ومدينة لوزيرن وجسر الشابيل التاريخي',
        morning_ar: 'الهبوط في مطار زيورخ الدولي والركوب المباشر بقطار SBB إلى مدينة لوزيرن الساحرة المطلة على البحيرة.',
        afternoon_ar: 'المشي على جسر الشابيل الخشبي المغطى التاريخي وزيارة نصب الأسد الجريح والتنزه بالبلدة القديمة.',
        evening_ar: 'ركوب الباخرة البانورامية في بحيرة لوزيرن المحاطة بقمم الجبال، ثم استقلال القطار إلى إنترلاكن وتسجيل الدخول بالفندق.',
        halal_food_tip_ar: 'في لوزيرن وإنترلاكن توجد مطاعم كباب تركي وهندي ولبناني حلال ومصليات معتمدة.',
        transport_tip_ar: 'بطاقة Swiss Travel Pass تمنحك صعوداً غير محدود لكل هذه القطارات والبواخر دون أي حجز مسبق.'
      },
      {
        day_number: 2,
        title_ar: 'شلالات وادي لاوتربرونن وقرية غريندلفالد البديعة',
        morning_ar: 'رحلة قطار ممتعة إلى وادي لاوتربرونن (وادي الشلالات الـ 72) وزيارة شلال ستوباخ المنهمر من قمة الجرف الصخري.',
        afternoon_ar: 'الصعود بقطار التلفريك الجبلي Eiger Express الأسرع عالمياً إلى قمة يونغفراويوخ (قمة أوروبا الشاهقة على ارتفاع 3,454م) وقصر الجليد.',
        evening_ar: 'التنزه في بلدة غريندلفالد الجبلية وتناول فوندو الجبن السويسري اللذيذ وركوب زحليقة First الكارتينغ الجبلية.',
        halal_food_tip_ar: 'تتوفر وجبات نباتية وخيارات حلال في مطعم قمة يونغفراويوخ الهندي.',
        transport_tip_ar: 'السويس باس يغطي القطار حتى غريندلفالد ويوفر خصماً 25% على قطار قمة يونغفراويوخ.'
      },
      {
        day_number: 3,
        title_ar: 'قمة هاردر كولم وبحيرتا برينز وثون الفيروزية',
        morning_ar: 'ركوب القطار المسنن الجبلي الحاد إلى مطل هاردر كولم (Harder Kulm) المعلق لمشاهدة إنترلاكن بين البحيرتين وإطلالة جبال يونغفراو وإيغر.',
        afternoon_ar: 'جولة بحرية بالباخرة البخارية في بحيرة برينز وزيارة شلالات جيس باخ المتدفقة وفندق القصر التاريخي.',
        evening_ar: 'التجول في ساحة هويفيغ (Höhematte) بإنترلاكن ومشاهدة هبوط المظليين (Paragliding) وشراء الشوكولاتة السويسرية الفاخرة من Läderach.',
        halal_food_tip_ar: 'مطاعم شارع Höhematte بإنترلاكن تقدم خيارات طعام عربية وخليجية وشامية متعددة.',
        transport_tip_ar: 'الرحلات البحرية في بحيرتي ثون وبرينز مجانية بالكامل لحاملي السويس ترافيل باس.'
      },
      {
        day_number: 4,
        title_ar: 'قرية زيرمات الخالية من السيارات وجبل الماترهورن الأسطوري',
        morning_ar: 'رحلة قطار بانورامية خلابة من إنترلاكن إلى قرية زيرمات البيئية النقية التي يحظر فيها سير سيارات البنزين.',
        afternoon_ar: 'صعود قطار غورنيرات المسنن المفتوح (Gornergrat) لرؤية قمة جبل ماترهورن (شعار شوكولاتة التوبليرون الشهير) وانعكاسه على بحيرة ريفيلسي.',
        evening_ar: 'التسوق والتجول بين الشاليهات الخشبية المزينة بالزهور في زيرمات وركوب التاكسي الكهربائي الصغير.',
        halal_food_tip_ar: 'توجد مطاعم عالمية ومطاعم كباب حلال راقية في شارع Bahnhofstrasse بزيرمات.',
        transport_tip_ar: 'تذكر شحن كاميرتك بالكامل؛ مناظر قطار غورنيرات تعتبر من أروع مشاهد الطبيعة في الكرة الأرضية.'
      },
      {
        day_number: 5,
        title_ar: 'شلالات الراين الهادرة وعاصمة البنوك والتسوق في زيورخ',
        morning_ar: 'القطار إلى شلالات الراين (Rhine Falls) أكبر شلالات في أوروبا قرب شافهاوزن وركوب القارب الصخري المثير وسط المياه.',
        afternoon_ar: 'العودة لمدينة زيورخ والتسوق الراقي في شارع باهنهوف شتراسه (Bahnhofstrasse) وزيارة بحيرة زيورخ الساحرة.',
        evening_ar: 'التوجه إلى مطار زيورخ الدولي (مباشرة بالقطار في 10 دقائق من المحطة المركزية) والعودة للوطن.',
        halal_food_tip_ar: 'محطة قطارات زيورخ المركزية (HB) مليئة بالمطاعم وخيارات الوجبات السريعة الحلال.',
        transport_tip_ar: 'استرداد التاكس فري في مطار زيورخ يتم في مكتب الجمارك قرب صالة المغادرة 1 و2.'
      }
    ]
  },

  // 6. ماليزيا (كوالالمبور ولنكاوي) - 5 أيام
  {
    id: 'itin-malaysia-5d',
    destination_code: 'MY',
    destination_name_ar: 'ماليزيا (كوالالمبور وجزيرة لنكاوي)',
    duration_days: 5,
    trip_style_ar: 'سياحة عائلية استوائية وتسوق وجزر وطبيعة خضراء',
    best_season_ar: 'طوال العام (استوائي ممتع مع أمطار خفيفة منعشة)',
    estimated_cost_level: 'اقتصادي',
    days: [
      {
        day_number: 1,
        title_ar: 'أبراج بتروناس التوأم ومول سوريا وحديقة KLCC',
        morning_ar: 'الوصول بمطار KLIA واستقلال قطار KLIA Ekspres، ثم الصعود إلى جسر برجي بتروناس التوأم (Petronas Twin Towers).',
        afternoon_ar: 'التنزه في حديقة KLCC وتجربة المسبح المجاني للأطفال وزيارة أكواريوم عالم البحار (Aquaria KLCC).',
        evening_ar: 'مشاهدة عروض النوافير الموسيقية المضيئة ببحيرة سيمفوني، ثم التسوق وتناول العشاء بشارع العرب (بوكيت بينتانغ).',
        halal_food_tip_ar: 'ماليزيا دولة إسلامية؛ كافة الأطعمة والمطاعم حلال ومعتمدة وموثوقة بنسبة 100%.',
        transport_tip_ar: 'استخدم تطبيق Grab للتنقل العائلي فهو سريع ورخيص جداً.'
      },
      {
        day_number: 2,
        title_ar: 'مرتفعات جنتنغ هايلاندز وقرية الملاهي السحابية',
        morning_ar: 'الانطلاق صباحاً بسيارة خاصة أو باص إلى مرتفعات جنتنغ (Genting Highlands) في الأجواء الباردة والضباب.',
        afternoon_ar: 'ركوب تلفريك أووانا الزجاجي الشفاف، ثم قضاء اليوم في مدينة ملاهي جنتنغ سكاي وورلدز (SkyWorlds Theme Park).',
        evening_ar: 'التسوق بأسعار التخفيضات في أوتلت جنتنغ بريميوم (Genting Highlands Premium Outlets) والعودة لكوالالمبور.',
        halal_food_tip_ar: 'مجمع ملاهي جنتنغ ومول سكاي أفينيو يحوي مطاعم حلال محلية وعالمية لا حصر لها.',
        transport_tip_ar: 'احرص على أخذ سترة خفيفة لأن درجات الحرارة في قمة جنتنغ تكون باردة ومنعشة (18-20 درجة مئوية).'
      },
      {
        day_number: 3,
        title_ar: 'الطيران إلى جزيرة لنكاوي والتلفريك البانورامي',
        morning_ar: 'رحلة طيران داخلية (50 دقيقة) من كوالالمبور إلى جزيرة لنكاوي الساحرة واستلام السيارة أو السائق.',
        afternoon_ar: 'ركوب تلفريك لنكاوي الشاهق (SkyCab) والمشي على الجسر المعلق في الهواء فوق الغابات الاستوائية (SkyBridge).',
        evening_ar: 'الاسترخاء على شاطئ سينانغ (Pantai Cenang) وتجربة الرياضات المائية ومشاهدة الغروب الاستوائي.',
        halal_food_tip_ar: 'مطاعم المأكولات البحرية الحية الطازجة على شاطئ سينانغ متميزة وبأسعار اقتصادية.',
        transport_tip_ar: 'استئجار سيارة في لنكاوي رخيص جداً وممتع وسهل القيادة في شوارع الجزيرة الهادئة.'
      },
      {
        day_number: 4,
        title_ar: 'رحلة غابات المانجروف وإطعام النسور وجزر العذراء',
        morning_ar: 'جولة خاصة بالقارب السريع في محمية غابات المانجروف (Mangrove Kilim Geoforest) وزيارة كهف الخفافيش وكهف التماسيح.',
        afternoon_ar: 'مشاهدة إطعام النسور البرية، وزيارة مزرعة الأسماك العائمة وتناول الغداء البحري هناك.',
        evening_ar: 'زيارة ميدان النصب التذكاري للنسر (Eagle Square) في مدينة كواه والتسوق المعفى من الجمارك (Duty Free).',
        halal_food_tip_ar: 'عصائر المانجو والباشن فروت وجوز الهند الطازج متوفرة عند كل مرسى قوارب.',
        transport_tip_ar: 'احجز قارب المانجروف كجولة خاصة (Private Boat) بأسعار تبدأ من 250 إلى 350 رينغيت فقط للعائلة بالكامل.'
      },
      {
        day_number: 5,
        title_ar: 'شلالات الآبار السبعة والعودة إلى كوالالمبور والوطن',
        morning_ar: 'السباحة في برك المياه العذبة الطبيعية لشلالات الآبار السبعة (Telaga Tujuh Waterfalls).',
        afternoon_ar: 'العودة بالطيران إلى كوالالمبور، وشراء الهدايا التذكارية من سوق باسار سيني الشعبي (Central Market).',
        evening_ar: 'التوجه إلى مطار KLIA الدولي لرحلة العودة للوطن بعد رحلة استوائية متكاملة.',
        halal_food_tip_ar: 'جرب حلوى الروتي كاناي ومشروب الشاي المثلج (تيه تاريك Teh Tarik) قبل المغادرة.',
        transport_tip_ar: 'تأكد من الوصول لمطار كوالالمبور قبل الإقلاع بـ 3 ساعات لضخامة مبنى المطار وصالات القطار الداخلي.'
      }
    ]
  },

  // 7. دبي وأبوظبي (الإمارات) - 5 أيام
  {
    id: 'itin-uae-5d',
    destination_code: 'AE',
    destination_name_ar: 'دبي وأبوظبي (الإمارات العربية المتحدة)',
    duration_days: 5,
    trip_style_ar: 'حداثة معمارية، شواطئ فاخرة، مدن ترفيه وثقافة',
    best_season_ar: 'نوفمبر – أبريل',
    estimated_cost_level: 'متوسط',
    days: [
      {
        day_number: 1,
        title_ar: 'برج خليفة ودبي مول ونافورة دبي الراقصة',
        morning_ar: 'الصعود لمنصة قمة برج خليفة (At The Top) في الطابق 124 و148 لرؤية دبي بأكملها من أعلى بناء شيده الإنسان.',
        afternoon_ar: 'استكشاف دبي مول، وزيارة أكواريوم دبي العملاق وحديقة الحيوانات المائية والتسوق في فاشن أفينيو.',
        evening_ar: 'مشاهدة عروض نافورة دبي الراقصة والموسيقية، وتناول العشاء في سوق البحار بإطلالة مباشرة على البرج.',
        halal_food_tip_ar: 'دولة الإمارات توفر أعلى معايير الحلال العالمية في كافة المطاعم والمطابخ دون استثناء.',
        transport_tip_ar: 'مترو دبي (الخط الأحمر - محطة برج خليفة/دبي مول) متصل بالمول بجسر مكيف بالكامل.'
      },
      {
        day_number: 2,
        title_ar: 'سحر نخلة جميرا وأتلانتس ومتحف المستقبل',
        morning_ar: 'زيارة متحف المستقبل التحفة المعمارية الأكثر إبهاراً في شارع الشيخ زايد وتجربة رحلة المستقبل عام 2071.',
        afternoon_ar: 'ركوب قطار المونوريل إلى جزيرة نخلة جميرا وزيارة منصة The View at The Palm ومنتجع أتلانتس.',
        evening_ar: 'التنزه في ممشى الجي بي آر (The Walk JBR) وعين دبي في جزيرة بلوواترز وتناول الآيس كريم على البحر.',
        halal_food_tip_ar: 'مطاعم المارينا والبلوواترز توفر إطلالات بحرية استثنائية وأطباقاً خليجية وعالمية حلال.',
        transport_tip_ar: 'حجز تذاكر متحف المستقبل يتطلب أسبوعين مسبقاً عبر الإنترنت بسبب الإقبال العالمي الشديد.'
      },
      {
        day_number: 3,
        title_ar: 'رحلة إلى العاصمة أبوظبي: جامع الشيخ زايد واللوفر',
        morning_ar: 'الانطلاق صباحاً إلى أبوظبي وزيارة جامع الشيخ زايد الكبير والتحفة المعمارية الإسلامية الخالدة الرخامية.',
        afternoon_ar: 'زيارة متحف اللوفر أبوظبي وقبته العائمة ذات "شعاع النور" والاطلاع على روائع الفن الإنساني.',
        evening_ar: 'زيارة قصر الوطن الرئاسي المهيب وحضور العرض الضوئي المسائي أو الاستمتاع بكورنيش أبوظبي والعودة لدبي.',
        halal_food_tip_ar: 'المطاعم الإماراتية التقليدية مثل "الفنر" تقدم مجبوس اللحم والسمك واللقيمات بأعلى جودة.',
        transport_tip_ar: 'المسافة بين دبي وأبوظبي تستغرق ساعة و15 دقيقة بسيارة خاصة أو عبر حافلات E100/E101 الحديثة.'
      },
      {
        day_number: 4,
        title_ar: 'سفاري صحراء دبي والقرية العالمية',
        morning_ar: 'الاسترخاء صباحاً في منتزه حديقة الزهور المعجزة (Miracle Garden) لرؤية ملايين الأزهار الطبيعية.',
        afternoon_ar: 'الانطلاق بعد الظهر في رحلة سفاري صحراوية بدفع رباعي فوق الرمال الحمراء والتزلج على الرمال وركوب الجمال.',
        evening_ar: 'زيارة القرية العالمية (Global Village) للتسوق وتذوق أطعمة 90 دولة وثقافة في مكان واحد.',
        halal_food_tip_ar: 'القرية العالمية هي مهرجان الطعام الأكبر في الشرق الأوسط وتضم مئات أكشاك المأكولات الشعبية العالمية.',
        transport_tip_ar: 'القرية العالمية وحديقة الزهور تفتحان أبوابهما في الموسم الشتوي فقط (من أكتوبر حتى مايو).'
      },
      {
        day_number: 5,
        title_ar: 'دبي القديمة وسوق الذهب والتوابل وخور دبي',
        morning_ar: 'زيارة حي الفهيدي التاريخي ومتحف القهوة، وركوب العبرة المائية التراثية بدرهمين فقط عبر خور دبي.',
        afternoon_ar: 'التسوق في سوق التوابل وسوق الذهب الشهير في ديرة والتقاط الصور مع التحف التراثية.',
        evening_ar: 'التوجه إلى مطار دبي الدولي واسترجاع مبالغ التاكس فري وتوديع دانة الدنيا.',
        halal_food_tip_ar: 'جرب شاي الكرك الساخن وخبز الرقاق بالجبن والعسل في مقاهي الفهيدي الشعبية.',
        transport_tip_ar: 'تأكد من شحن رصيد بطاقة نول لاستخدام العبرة والمترو للتنقل بين ضفتي الخور بسهولة.'
      }
    ]
  }
];

