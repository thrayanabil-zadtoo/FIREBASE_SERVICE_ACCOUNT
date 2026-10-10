export interface ArabPassport {
  code: string;
  name_ar: string;
  flag: string;
  nationality_ar: string;
  rank_ar: string;
}

export interface VisaRule {
  status: 'visa_free' | 'evisa' | 'voa' | 'embassy';
  status_ar: string;
  badge_color: string;
  duration_ar: string;
  cost_estimate_ar: string;
  processing_time_ar: string;
  official_portal?: string;
  official_portal_title?: string;
  required_docs: string[];
  advisory_tips: string[];
}

export const ARAB_PASSPORTS: ArabPassport[] = [
  { code: 'SA', name_ar: 'المملكة العربية السعودية', flag: '🇸🇦', nationality_ar: 'سعودي', rank_ar: 'المرتبة 55 عالمياً' },
  { code: 'AE', name_ar: 'الإمارات العربية المتحدة', flag: '🇦🇪', nationality_ar: 'إماراتي', rank_ar: 'الأقوى عربياً (المرتبة 11 عالمياً)' },
  { code: 'QA', name_ar: 'دولة قطر', flag: '🇶🇦', nationality_ar: 'قطري', rank_ar: 'المرتبة 46 عالمياً' },
  { code: 'KW', name_ar: 'دولة الكويت', flag: '🇰🇼', nationality_ar: 'كويتي', rank_ar: 'المرتبة 49 عالمياً' },
  { code: 'OM', name_ar: 'سلطنة عُمان', flag: '🇴🇲', nationality_ar: 'عُماني', rank_ar: 'المرتبة 58 عالمياً' },
  { code: 'BH', name_ar: 'مملكة البحرين', flag: '🇧🇭', nationality_ar: 'بحريني', rank_ar: 'المرتبة 56 عالمياً' },
  { code: 'EG', name_ar: 'جمهورية مصر العربية', flag: '🇪🇬', nationality_ar: 'مصري', rank_ar: 'أكثر من 50 وجهة سهلة' },
  { code: 'JO', name_ar: 'المملكة الأردنية الهاشمية', flag: '🇯🇴', nationality_ar: 'أردني', rank_ar: 'وجهات ميسرة بدون تأشيرة' },
  { code: 'MA', name_ar: 'المملكة المغربية', flag: '🇲🇦', nationality_ar: 'مغربي', rank_ar: 'تأشيرات إلكترونية متعددة' },
  { code: 'DZ', name_ar: 'الجمهورية الجزائرية', flag: '🇩🇿', nationality_ar: 'جزائري', rank_ar: 'وجهات بدون تأشيرة' },
  { code: 'TN', name_ar: 'الجمهورية التونسية', flag: '🇹🇳', nationality_ar: 'تونسي', rank_ar: 'أكثر من 70 وجهة ميسرة' },
  { code: 'IQ', name_ar: 'جمهورية العراق', flag: '🇮🇶', nationality_ar: 'عراقي', rank_ar: 'تأشيرات إلكترونية وتسهيلات' },
  { code: 'LB', name_ar: 'الجمهورية اللبنانية', flag: '🇱🇧', nationality_ar: 'لبناني', rank_ar: 'تسهيلات سياحية وتأشيرات عند الوصول' },
];

export const VISA_INTELLIGENCE: Record<string, Record<string, VisaRule>> = {
  // Saudi Passport
  SA: {
    GB: {
      status: 'evisa',
      status_ar: 'تصريح سفر إلكتروني فوري (UK ETA)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: 'إقامة حتى 6 أشهر للزيارة الواحدة (صالح لمدة عامين)',
      cost_estimate_ar: '10 جنيهات إسترلينية (حوالي 48 ريالاً)',
      processing_time_ar: 'خلال دقائق إلى 3 أيام كحد أقصى عبر تطبيق الهواتف',
      official_portal: 'https://www.gov.uk/electronic-travel-authorisation-eta',
      official_portal_title: 'بوابة تصريح السفر الإلكتروني البريطاني الرسمي (UK ETA)',
      required_docs: ['جواز سفر بيومتري صالح لأكثر من 6 أشهر', 'صورة شخصية رقمية عبر كاميرا الهاتف', 'بطاقة دفع بنكية'],
      advisory_tips: ['لا تحتاج لمراجعة السفارة أو تقديم كشوفات حساب.', 'يمكن تقديم الطلب لكافة أفراد الأسرة بسهولة عبر تطبيق UK ETA الرسمي.']
    },
    TR: {
      status: 'visa_free',
      status_ar: 'دخول بدون تأشيرة مسبقة (معفى بالكامل)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: 'حتى 90 يوماً خلال فترة 180 يوماً',
      cost_estimate_ar: 'مجاناً 100%',
      processing_time_ar: 'فوري عند كاونتر الجوازات بالمطار',
      required_docs: ['جواز سفر ساري المفعول لمدة لا تقل عن 6 أشهر', 'تذكرة عودة مؤكدة وحجز فندقي مبدئي'],
      advisory_tips: ['قرار الإعفاء ساري رسمياً لكافة المواطنين السعوديين ومواطني دول الخليج.', 'تأكد من ختم الدخول وتاريخ المغادرة بدقة.']
    },
    MV: {
      status: 'voa',
      status_ar: 'تأشيرة مجانية عند الوصول (Visa on Arrival)',
      badge_color: 'bg-blue-600 text-white',
      duration_ar: '30 يوماً سياحية قابلة للتمديد',
      cost_estimate_ar: 'مجاناً بدون أي رسوم',
      processing_time_ar: 'فور الوصول لمطار فيلانا الدولي بمالي',
      official_portal: 'https://imuga.immigration.gov.mv/',
      official_portal_title: 'بوابة إقرار السفر المالديفي الإلكتروني (IMUGA)',
      required_docs: ['جواز سفر صالح لمدة شهر على الأقل', 'تعبئة إقرار السفر الصحي والجمارك IMUGA خلال 96 ساعة قبل السفر', 'حجز منتجع أو فندق مؤكد وتذكرة عودة'],
      advisory_tips: ['تعبئة استمارة IMUGA إلكترونياً ومجانية إجبارية قبل الإقلاع.', 'المنتجعات توفر نقلاً بالقارب السريع أو الطائرة المائية.']
    },
    AZ: {
      status: 'voa',
      status_ar: 'تأشيرة فورية عند الوصول + إلكترونية (ASAN Visa)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: '30 يوماً سياحية',
      cost_estimate_ar: 'حوالي 26 دولاراً أمريكياً (تأشيرة إلكترونية أو بالمطار)',
      processing_time_ar: 'فوري عند الوصول لمطار باكو أو خلال 3 ساعات عبر ASAN Visa العاجلة',
      official_portal: 'https://evisa.gov.az/en/',
      official_portal_title: 'بوابة التأشيرة الأذربيجانية الرسمية (ASAN Visa)',
      required_docs: ['جواز سفر صالح لـ 6 أشهر', 'تذكرة ذهاب وعودة'],
      advisory_tips: ['إذا زادت مدة الإقامة عن 15 يوماً يجب تسجيل مقر الإقامة لدى دائرة الهجرة الحكومية (تتكفل به الفنادق عادة).']
    },
    UZ: {
      status: 'visa_free',
      status_ar: 'دخول بدون تأشيرة مسبقة (Visa-Free)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: '30 يوماً بدون تأشيرة',
      cost_estimate_ar: 'مجاناً 100%',
      processing_time_ar: 'فوري عند الوصول لمطار طشقند أو سمرقند',
      required_docs: ['جواز سفر سعودي صالح لأكثر من 6 أشهر', 'تذكرة عودة'],
      advisory_tips: ['أوزبكستان تقدم إعفاءً كاملاً لحاملي الجواز السعودي ومواطني الخليج للترويج للسياحة التاريخية والدينية.']
    },
    MY: {
      status: 'visa_free',
      status_ar: 'دخول بدون تأشيرة (Visa-Free)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: '90 يوماً كاملة (3 أشهر)',
      cost_estimate_ar: 'مجاناً',
      processing_time_ar: 'فوري عبر البوابات الذكية بالمطارات',
      official_portal: 'https://imigresen-online.imi.gov.my/mdac/main',
      official_portal_title: 'بطاقة الوصول الرقمية الماليزية (MDAC)',
      required_docs: ['جواز سفر ساري المفعول لمدة لا تقل عن 6 أشهر', 'تعبئة بطاقة الوصول الرقمية (MDAC) قبل السفر بـ 3 أيام'],
      advisory_tips: ['المواطنون السعوديون والخليجيون مؤهلون لاستخدام بوابات الجوازات الإلكترونية الآلية السريعة (Autogates) بمطار كوالالمبور.']
    },
    TH: {
      status: 'visa_free',
      status_ar: 'دخول بدون تأشيرة (Visa Exemption)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: '60 يوماً كاملة (قابلة للتمديد 30 يوماً أخرى)',
      cost_estimate_ar: 'مجاناً بالكامل',
      processing_time_ar: 'فوري عند الوصول لكافة مطارات تايلاند',
      required_docs: ['جواز سفر صالح لـ 6 أشهر على الأقل', 'تذكرة عودة مؤكدة خلال 60 يوماً'],
      advisory_tips: ['مؤخراً مددت تايلاند فترة الإقامة بدون تأشيرة للسعوديين من 30 يوماً إلى 60 يوماً لدعم السياحة العائلية والعلاجية.']
    },
    GE: {
      status: 'visa_free',
      status_ar: 'دخول بدون تأشيرة مسبقة لمدة عام كامل',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: '365 يوماً (سنة كاملة إقامة وسياحة)',
      cost_estimate_ar: 'مجاناً بالكامل',
      processing_time_ar: 'فوري بختم الدخول بمطار تبليسي وباتومي',
      required_docs: ['جواز سفر ساري المفعول', 'تأمين طبي للسفر يغطي فترة الإقامة'],
      advisory_tips: ['جورجيا تمنح مواطني السعودية ودول الخليج والمقيمين فيها حق الإقامة والسياحة والعمل الحر لمدة سنة كاملة دون تأشيرة.']
    },
    BA: {
      status: 'visa_free',
      status_ar: 'دخول بدون تأشيرة (موسم الصيف والعام)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: 'حتى 90 يوماً أو 30 يوماً موسمياً',
      cost_estimate_ar: 'مجاناً',
      processing_time_ar: 'فوري عند الوصول لمطار سراييفو',
      required_docs: ['جواز سفر ساري', 'تذكرة عودة وحجز إقامة'],
      advisory_tips: ['البوسنة والهرسك وجهة طبيعية وأسرية مميزة جداً مع طبيعة خلابة ومساجد تاريخية في كل مدينة.']
    },
    FR: {
      status: 'embassy',
      status_ar: 'تأشيرة شنغن الأوروبية الموحدة (Schengen Visa)',
      badge_color: 'bg-amber-600 text-white',
      duration_ar: 'تصل لـ 5 سنوات متعددة السفرات (نظام Cascade المعتمد للخليجيين)',
      cost_estimate_ar: '90 يورو (حوالي 370 ريالاً) + رسوم مركز التأشيرات VFS/TLS',
      processing_time_ar: 'بين 5 إلى 15 يوم عمل',
      official_portal: 'https://france-visas.gouv.fr/',
      official_portal_title: 'البوابة الرسمية لتأشيرة فرنسا (France-Visas)',
      required_docs: ['جواز سفر ساري لأكثر من 3 أشهر بعد العودة', 'كشف حساب بنكي لآخر 3 أشهر', 'تأمين سفر طبي بقيمة 30 ألف يورو', 'حجز طيران وفندق مبدئي', 'تعريف بالراتب أو السجل التجاري'],
      advisory_tips: ['المواطنون السعوديون والخليجيون يستفيدون من لائحة (Cascade) التي تمنحهم تلقائياً تأشيرة شنغن مدتها 5 سنوات عند التقديم الأول أو الثاني.']
    },
    DE: {
      status: 'embassy',
      status_ar: 'تأشيرة شنغن الأوروبية الموحدة (Schengen Visa)',
      badge_color: 'bg-amber-600 text-white',
      duration_ar: 'حتى 5 سنوات متعددة الدخول (نظام Cascade الميسر للخليجيين)',
      cost_estimate_ar: '90 يورو + رسوم VFS Global',
      processing_time_ar: 'من 7 إلى 15 يوماً',
      official_portal: 'https://videx.diplo.de/',
      official_portal_title: 'نظام VIDEX لتأشيرات ألمانيا الاتحادية',
      required_docs: ['جواز سفر ساري', 'تأمين سفر معتمد', 'كشف حساب مصرفي حديث', 'تعريف بالعمل باللغة الإنجليزية'],
      advisory_tips: ['تمنح تأشيرة متعددة السفرات صالحة لكافة دول الشنغن الـ 29.']
    },
    US: {
      status: 'embassy',
      status_ar: 'تأشيرة سياحية وتجارية (B1/B2) صالحة 10 سنوات',
      badge_color: 'bg-amber-600 text-white',
      duration_ar: 'صلاحية الجواز والتأشيرة 10 سنوات متعددة، وتصل الإقامة لـ 6 أشهر بالرحلة',
      cost_estimate_ar: '185 دولاراً أمريكياً (حوالي 695 ريالاً)',
      processing_time_ar: 'تعبئة استمارة DS-160 وتحديد موعد المقابلة بالقنصلية',
      official_portal: 'https://ceac.state.gov/genniv/',
      official_portal_title: 'البوابة الرسمية لوزارة الخارجية الأمريكية (DS-160)',
      required_docs: ['تعبئة استمارة DS-160 الإلكترونية بدقة', 'صورة شخصية بمواصفات أمريكية (5x5 سم بخلفية بيضاء)', 'سداد رسوم MRV وحضور المقابلة الشخصية'],
      advisory_tips: ['تم تمديد صلاحية تأشيرة B1/B2 للمواطنين السعوديين لتصبح 10 سنوات كاملة بدلاً من 5 سنوات.']
    },
    JP: {
      status: 'evisa',
      status_ar: 'تأشيرة إلكترونية ميسرة عبر الإنترنت (Japan eVisa)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: 'حتى 90 يوماً سياحية',
      cost_estimate_ar: 'نحو 3000 ين ياباني (حوالي 75 ريالاً)',
      processing_time_ar: 'من 5 إلى 7 أيام عمل بدون مقابلة شخصية',
      official_portal: 'https://www.evisa.mofa.go.jp/index',
      official_portal_title: 'بوابة التأشيرة الإلكترونية اليابانية الرسمية (MOFA eVisa)',
      required_docs: ['صورة جواز السفر واضحة', 'حجز تذكرة طيران وفندق', 'كشف حساب بنكي يثبت القدرة المالية'],
      advisory_tips: ['التقديم إلكتروني بالكامل عبر الهاتف أو الحاسوب دون الحاجة لزيارة السفارة.']
    }
  },

  // UAE Passport
  AE: {
    GB: {
      status: 'evisa',
      status_ar: 'تصريح سفر إلكتروني فوري (UK ETA)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: 'إقامة حتى 6 أشهر بالزيارة (سنتان صلاحية)',
      cost_estimate_ar: '10 جنيهات إسترلينية',
      processing_time_ar: 'خلال دقائق عبر تطبيق الهاتف',
      official_portal: 'https://www.gov.uk/electronic-travel-authorisation-eta',
      official_portal_title: 'بوابة UK ETA',
      required_docs: ['جواز سفر إماراتي ساري', 'صورة رقمية بالهاتف', 'بطاقة ائتمان'],
      advisory_tips: ['متاح لجميع المواطنين الإماراتيين فورياً.']
    },
    FR: {
      status: 'visa_free',
      status_ar: 'دخول بدون تأشيرة لكافة دول الشنغن (Schengen Visa-Free)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: '90 يوماً خلال أي فترة 180 يوماً',
      cost_estimate_ar: 'مجاناً بالكامل',
      processing_time_ar: 'فوري عند بوابات المطارات الأوروبية',
      required_docs: ['جواز سفر إماراتي صالح لـ 3 أشهر على الأقل بعد العودة', 'تأمين سفر وتذكرة عودة'],
      advisory_tips: ['الجواز الإماراتي معفى تماماً من تأشيرة الشنغن لدخول كافة دول الاتحاد الأوروبي.']
    },
    DE: {
      status: 'visa_free',
      status_ar: 'دخول بدون تأشيرة لكافة دول الشنغن (Visa-Free)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: '90 يوماً بدون تأشيرة',
      cost_estimate_ar: 'مجاناً بالكامل',
      processing_time_ar: 'فوري عند الوصول',
      required_docs: ['جواز سفر إماراتي ساري', 'تذكرة عودة مؤكدة'],
      advisory_tips: ['معفى بالكامل من الشنغن.']
    },
    TR: {
      status: 'visa_free',
      status_ar: 'دخول بدون تأشيرة مسبقة (Visa-Free)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: '90 يوماً',
      cost_estimate_ar: 'مجاناً بالكامل',
      processing_time_ar: 'فوري عند الوصول',
      required_docs: ['جواز سفر إماراتي صالح لـ 6 أشهر'],
      advisory_tips: ['معفى بالكامل من التأشيرة.']
    },
    JP: {
      status: 'visa_free',
      status_ar: 'دخول بدون تأشيرة مسبقة (Visa Exemption)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: '30 يوماً',
      cost_estimate_ar: 'مجاناً',
      processing_time_ar: 'فوري عند الوصول لمطارات طوكيو وأوساكا',
      required_docs: ['جواز سفر بيومتري صالح'],
      advisory_tips: ['إعفاء تام للمواطنين الإماراتيين.']
    },
    UZ: {
      status: 'visa_free',
      status_ar: 'دخول بدون تأشيرة (30 يوماً)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: '30 يوماً',
      cost_estimate_ar: 'مجاناً',
      processing_time_ar: 'فوري عند الوصول',
      required_docs: ['جواز سفر ساري المفعول'],
      advisory_tips: ['أوزبكستان تعفي حاملي الجواز الإماراتي بالكامل.']
    },
    MV: {
      status: 'voa',
      status_ar: 'تأشيرة مجانية فورية عند الوصول (30 يوماً)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: '30 يوماً سياحية',
      cost_estimate_ar: 'مجاناً',
      processing_time_ar: 'فوري عند الوصول',
      required_docs: ['جواز سفر ساري', 'تعبئة IMUGA قبل السفر'],
      advisory_tips: ['وجهة شهر العسل الأولى مجانية التأشيرة.']
    }
  },

  // Egyptian Passport
  EG: {
    MY: {
      status: 'visa_free',
      status_ar: 'دخول بدون تأشيرة (Visa-Free)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: 'حتى 30 يوماً سياحية',
      cost_estimate_ar: 'مجاناً بالكامل',
      processing_time_ar: 'فوري عند الوصول لمطار كوالالمبور',
      official_portal: 'https://imigresen-online.imi.gov.my/mdac/main',
      official_portal_title: 'بوابة بطاقة الوصول الرقمية الماليزية (MDAC)',
      required_docs: ['جواز سفر صالح لمدة لا تقل عن 6 أشهر', 'تذكرة عودة وحجز إقامة مؤكد', 'تعبئة استمارة MDAC قبل الوصول بـ 3 أيام'],
      advisory_tips: ['ماليزيا تمنح حاملي الجواز المصري إعفاءً سياحياً كاملاً بدون تأشيرة لمدة شهر.']
    },
    ID: {
      status: 'voa',
      status_ar: 'تأشيرة عند الوصول + إلكترونية (e-VoA)',
      badge_color: 'bg-blue-600 text-white',
      duration_ar: '30 يوماً قابلة للتمديد 30 يوماً أخرى',
      cost_estimate_ar: '500,000 روبية إندونيسية (نحو 32 دولاراً)',
      processing_time_ar: 'فوري عند الوصول لمطار بالي أو جاكرتا أو عبر الموقع المسبق',
      official_portal: 'https://molina.imigrasi.go.id/',
      official_portal_title: 'بوابة التأشيرة الإلكترونية الإندونيسية الرسمية (e-VoA)',
      required_docs: ['جواز سفر مصري صالح لـ 6 أشهر', 'تذكرة خروج من إندونيسيا'],
      advisory_tips: ['يمكن الحصول عليها بسهولة بالمطار أو التقديم أونلاين لتفادي صفوف الانتظار ببالي.']
    },
    MV: {
      status: 'voa',
      status_ar: 'تأشيرة سياحية مجانية عند الوصول (30 يوماً)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: '30 يوماً كاملة',
      cost_estimate_ar: 'مجاناً 100%',
      processing_time_ar: 'فوري بمطار مالي الدولي',
      official_portal: 'https://imuga.immigration.gov.mv/',
      official_portal_title: 'بوابة إقرار السفر IMUGA',
      required_docs: ['جواز سفر ساري المفعول', 'حجز منتجع مؤكد وتذكرة طيران ذهاب وعودة'],
      advisory_tips: ['المالديف تمنح كافة الجنسيات تأشيرة مجانية عند الوصول.']
    },
    TR: {
      status: 'evisa',
      status_ar: 'تأشيرة إلكترونية ميسرة (مشروطة بشرط العمر أو الشنغن)',
      badge_color: 'bg-blue-600 text-white',
      duration_ar: '30 يوماً سياحية',
      cost_estimate_ar: 'حوالي 60 دولاراً أمريكياً',
      processing_time_ar: 'خلال 5 دقائق عبر الإنترنت',
      official_portal: 'https://www.evisa.gov.tr/en/',
      official_portal_title: 'بوابة التأشيرة التركية الإلكترونية الرسمية (e-Visa)',
      required_docs: ['أقل من 20 عاماً أو أكبر من 45 عاماً مؤهل فورياً للإلكترونية', 'حاملو إقامة سارية أو تأشيرة شنغن/أمريكا/بريطانيا مؤهلون فورياً للإلكترونية', 'الفئات الأخرى تحتاج تأشيرة لاصقة عبر مكتب جيت واي (Gateway)'],
      advisory_tips: ['إذا كانت لديك تأشيرة شنغن أو أمريكية سارية يمكنك استخراج التأشيرة التركية إلكترونياً خلال 3 دقائق.']
    },
    GB: {
      status: 'embassy',
      status_ar: 'تأشيرة زيارة بريطانية قياسية (Standard Visitor Visa)',
      badge_color: 'bg-amber-600 text-white',
      duration_ar: '6 أشهر (أو سنتان أو 5 سنوات أو 10 سنوات)',
      cost_estimate_ar: '115 جنيهاً إسترلينياً لـ 6 أشهر',
      processing_time_ar: 'حوالي 3 إلى 6 أسابيع',
      official_portal: 'https://www.gov.uk/standard-visitor',
      official_portal_title: 'الموقع الرسمي للتأشيرات البريطانية GOV.UK',
      required_docs: ['جواز سفر ساري', 'كشف حساب بنكي لـ 6 أشهر مع حركات واضحة', 'إثبات عمل أو دراسة', 'بيان الغرض من الزيارة'],
      advisory_tips: ['يجب حجز موعد للبصمات في مركز VFS Global بالقاهرة أو الإسكندرية.']
    },
    FR: {
      status: 'embassy',
      status_ar: 'تأشيرة شنغن الأوروبية (Schengen Visa)',
      badge_color: 'bg-amber-600 text-white',
      duration_ar: 'تحددها القنصلية وفق مسار السفر',
      cost_estimate_ar: '90 يورو + رسوم مركز TLScontact',
      processing_time_ar: 'من 15 إلى 25 يوماً',
      official_portal: 'https://france-visas.gouv.fr/',
      official_portal_title: 'بوابة France-Visas الرسمية بمصر',
      required_docs: ['جواز سفر صالح', 'كشف حساب بنكي قوي لـ 6 أشهر', 'تأمين سفر يغطي 30 ألف يورو', 'شهادة تحركات من الجوازات (إن طُلبت)', 'حجز فندق وطيران مبدئي'],
      advisory_tips: ['احرص على تقديم ملف مالي متماسك وحجز الموعد مبكراً قبل موسم الصيف بشهرين على الأقل.']
    }
  }
};

// Generic fallback calculator for combinations not explicitly overwritten above
export function getVisaRuleForPair(passportCode: string, destinationCode: string): VisaRule {
  const passportMap = VISA_INTELLIGENCE[passportCode];
  if (passportMap && passportMap[destinationCode]) {
    return passportMap[destinationCode];
  }

  // Gulf Cooperation Council Passports perks
  const isGCC = ['SA', 'AE', 'QA', 'KW', 'OM', 'BH'].includes(passportCode);
  const isArabDest = ['SA', 'AE', 'QA', 'KW', 'OM', 'BH', 'EG', 'JO', 'MA', 'DZ', 'TN', 'OM'].includes(destinationCode);
  
  if (isGCC && isArabDest) {
    return {
      status: 'visa_free',
      status_ar: 'دخول بالهوية الوطنية أو الجواز بدون تأشيرة',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: 'إقامة وتنقل حر ومفتوح لمواطني مجلس التعاون',
      cost_estimate_ar: 'مجاناً بالكامل',
      processing_time_ar: 'فوري عند البوابات الإلكترونية',
      required_docs: ['الهوية الوطنية الذكية أو جواز السفر الساري'],
      advisory_tips: ['تتمتع بكامل حقوق التنقل والإقامة والاستثمار في دول مجلس التعاون.']
    };
  }

  // Schengen destinations
  const isSchengen = ['FR', 'DE', 'IT', 'ES', 'CH', 'AT', 'NL', 'GR', 'PT', 'CZ', 'HU', 'NO'].includes(destinationCode);
  if (isSchengen) {
    if (passportCode === 'AE') {
      return {
        status: 'visa_free',
        status_ar: 'معفى تماماً من تأشيرة الشنغن (Visa-Free)',
        badge_color: 'bg-emerald-600 text-white',
        duration_ar: '90 يوماً خلال 180 يوماً',
        cost_estimate_ar: 'مجاناً',
        processing_time_ar: 'فوري بالمطارات',
        required_docs: ['جواز سفر إماراتي ساري لأكثر من 3 أشهر بعد العودة', 'تأمين سفر'],
        advisory_tips: ['لا تحتاج لأي تأشيرة لدخول منطقة الشنغن.']
      };
    }
    if (isGCC) {
      return {
        status: 'embassy',
        status_ar: 'تأشيرة شنغن بنظام كاسكيد الميسر (Cascade 5 Years)',
        badge_color: 'bg-blue-600 text-white',
        duration_ar: 'تأشيرة متعددة السفرات صالحة لمدة 5 سنوات',
        cost_estimate_ar: '90 يورو + رسوم مركز التأشيرات',
        processing_time_ar: 'من 5 إلى 10 أيام عمل',
        official_portal: 'https://visa.vfsglobal.com/',
        official_portal_title: 'مراكز VFS Global المعتمدة',
        required_docs: ['جواز سفر ساري', 'تأمين سفر 30,000 يورو', 'كشف حساب بنكي 3 أشهر', 'تعريف بالعمل'],
        advisory_tips: ['دول الشنغن تمنح مواطني الخليج تأشيرة 5 سنوات متعددة تلقائياً وفق لائحة التسهيل.']
      };
    }
    return {
      status: 'embassy',
      status_ar: 'تأشيرة شنغن الأوروبية (Schengen Visa)',
      badge_color: 'bg-amber-600 text-white',
      duration_ar: 'حسب خطة السفر المعتمدة',
      cost_estimate_ar: '90 يورو + رسوم مركز التأشيرات',
      processing_time_ar: 'من 15 إلى 20 يوماً',
      required_docs: ['جواز سفر صالح', 'تأمين سفر معتمد 30,000 يورو', 'كشف حساب بنكي لـ 3 إلى 6 أشهر', 'إثبات عمل أو سجل تجاري', 'حجوزات طيران وفنادق'],
      advisory_tips: ['احرص على تقديم كشف حساب موثق برصيد يغطي مدة الإقامة المقررة مع حجز موعد مبكر.']
    };
  }

  // Maldives
  if (destinationCode === 'MV') {
    return {
      status: 'voa',
      status_ar: 'تأشيرة سياحية مجانية عند الوصول (30 يوماً)',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: '30 يوماً لكافة الجنسيات',
      cost_estimate_ar: 'مجاناً 100%',
      processing_time_ar: 'فوري عند الوصول لمطار مالي',
      official_portal: 'https://imuga.immigration.gov.mv/',
      official_portal_title: 'بوابة إقرار السفر المالديفي IMUGA',
      required_docs: ['جواز سفر صالح لشهر على الأقل', 'تعبئة استمارة IMUGA الإلكترونية خلال 96 ساعة قبل الوصول'],
      advisory_tips: ['وجهة شاطئية مفتوحة ومجانية بدون قيود.']
    };
  }

  // Malaysia
  if (destinationCode === 'MY') {
    return {
      status: 'visa_free',
      status_ar: 'دخول سياحي بدون تأشيرة مسبقة',
      badge_color: 'bg-emerald-600 text-white',
      duration_ar: 'بين 30 إلى 90 يوماً حسب الجنسية',
      cost_estimate_ar: 'مجاناً بالكامل',
      processing_time_ar: 'فوري عند بوابات مطار كوالالمبور',
      official_portal: 'https://imigresen-online.imi.gov.my/mdac/main',
      official_portal_title: 'بطاقة الوصول الرقمية الماليزية (MDAC)',
      required_docs: ['جواز سفر صالح لـ 6 أشهر', 'تعبئة استمارة MDAC الإلكترونية'],
      advisory_tips: ['تأكد من تسجيل استمارة MDAC قبل السفر بثلاثة أيام لتسريع الخروج.']
    };
  }

  // Turkey
  if (destinationCode === 'TR') {
    if (isGCC) {
      return {
        status: 'visa_free',
        status_ar: 'معفى تماماً من التأشيرة (Visa-Free)',
        badge_color: 'bg-emerald-600 text-white',
        duration_ar: '90 يوماً سياحية',
        cost_estimate_ar: 'مجاناً بالكامل',
        processing_time_ar: 'فوري عند كاونتر الجوازات',
        required_docs: ['جواز سفر ساري المفعول لـ 6 أشهر'],
        advisory_tips: ['إعفاء رئاسي تركي ساري لكافة مواطني دول مجلس التعاون.']
      };
    }
    return {
      status: 'evisa',
      status_ar: 'تأشيرة إلكترونية أو عبر مركز Gateway',
      badge_color: 'bg-blue-600 text-white',
      duration_ar: '30 يوماً سياحية',
      cost_estimate_ar: 'بين 60 إلى 150 دولاراً حسب النوع',
      processing_time_ar: 'فوري للإلكترونية أو 7 أيام للمركز',
      official_portal: 'https://www.evisa.gov.tr/en/',
      official_portal_title: 'بوابة التأشيرة التركية الرسمية',
      required_docs: ['جواز سفر صالح لـ 6 أشهر', 'تأشيرة شنغن/أمريكا/بريطانيا لمن يقدم إلكترونياً أو التقديم عبر المركز'],
      advisory_tips: ['تحقق من أهليتك للتأشيرة الإلكترونية المباشرة عبر موقع evisa.gov.tr.']
    };
  }

  // UK
  if (destinationCode === 'GB') {
    if (isGCC || passportCode === 'JO') {
      return {
        status: 'evisa',
        status_ar: 'تصريح سفر إلكتروني فوري (UK ETA)',
        badge_color: 'bg-emerald-600 text-white',
        duration_ar: 'زيارات متعددة حتى 6 أشهر للزيارة (صالح عامين)',
        cost_estimate_ar: '10 جنيهات إسترلينية فقط',
        processing_time_ar: 'دقائق إلى 3 أيام كحد أقصى عبر تطبيق الهواتف',
        official_portal: 'https://www.gov.uk/electronic-travel-authorisation-eta',
        official_portal_title: 'بوابة تصريح السفر الإلكتروني البريطاني UK ETA',
        required_docs: ['جواز سفر بيومتري ساري', 'صورة رقمية عبر الهاتف'],
        advisory_tips: ['لا تحتاج لكشف حساب أو زيارة سفارة، التقديم يتم من هاتفك المحمول.']
      };
    }
    return {
      status: 'embassy',
      status_ar: 'تأشيرة زيارة بريطانية قياسية (Standard Visitor)',
      badge_color: 'bg-amber-600 text-white',
      duration_ar: '6 أشهر سياحية',
      cost_estimate_ar: '115 جنيهاً إسترلينياً',
      processing_time_ar: 'من 3 إلى 6 أسابيع',
      official_portal: 'https://www.gov.uk/standard-visitor',
      official_portal_title: 'تأشيرات بريطانيا GOV.UK',
      required_docs: ['جواز سفر صالح', 'كشف حساب بنكي 6 أشهر', 'إثبات عمل أو دراسة', 'بصمات بمركز VFS'],
      advisory_tips: ['قدم قبل شهرين من موعد الرحلة لضمان استلام الجواز في موعده.']
    };
  }

  // USA
  if (destinationCode === 'US') {
    return {
      status: 'embassy',
      status_ar: 'تأشيرة B1/B2 السياحية والتجارية',
      badge_color: 'bg-amber-600 text-white',
      duration_ar: 'من سنة إلى 10 سنوات حسب الجنسية (إقامة 6 أشهر بالزيارة)',
      cost_estimate_ar: '185 دولاراً أمريكياً',
      processing_time_ar: 'تعبئة استمارة DS-160 وحضور مقابلة شخصية',
      official_portal: 'https://ceac.state.gov/genniv/',
      official_portal_title: 'استمارة تأشيرة أمريكا DS-160',
      required_docs: ['استمارة DS-160 مؤكدة', 'صورة 5×5 بخلفية بيضاء', 'حضور المقابلة بالقنصلية'],
      advisory_tips: ['احجز موعد المقابلة مبكراً نظراً لتباين مواعيد الانتظار بالقنصليات.']
    };
  }

  // Default fallback
  return {
    status: 'embassy',
    status_ar: 'تأشيرة مسبقة أو إلكترونية بحسب لوائح الدولة',
    badge_color: 'bg-stone-600 text-white',
    duration_ar: 'عادة من 30 إلى 90 يوماً سياحية',
    cost_estimate_ar: 'بين 30 إلى 100 دولار تقريباً',
    processing_time_ar: 'من 5 إلى 14 يوم عمل',
    required_docs: ['جواز سفر ساري المفعول لأكثر من 6 أشهر', 'تذكرة عودة وحجز إقامة فندقية مؤكد', 'تأمين طبي للسفر'],
    advisory_tips: ['يُرجى مراجعة الموقع القنصلي الرسمي للوجهة قبل الحجز النهائي للتأكد من أحدث التحديثات الدبلوماسية.']
  };
}
