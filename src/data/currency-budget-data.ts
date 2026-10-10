export interface CurrencyRate {
  code: string;
  name_ar: string;
  name_en: string;
  symbol: string;
  rateToUSD: number; // 1 USD = X Currency
  flag: string;
  isArab: boolean;
  category: 'gcc' | 'arab_africa' | 'arab_levant' | 'global_major' | 'global_emerging';
}

export interface CountryBudgetProfile {
  country_code: string;
  country_name_ar: string;
  currency_code: string;
  currency_name_ar: string;
  symbol: string;
  // Daily costs estimated in USD
  budget_daily_usd: {
    backpacker: { lodging: number; food: number; transport: number; total: number; desc_ar: string };
    moderate: { lodging: number; food: number; transport: number; total: number; desc_ar: string };
    luxury: { lodging: number; food: number; transport: number; total: number; desc_ar: string };
  };
  tipping_customs_ar: string;
  tipping_score: 'mandatory' | 'customary' | 'optional' | 'discouraged'; // discouraged in Japan/Korea
  payment_method_advice_ar: string;
  cash_vs_card_ratio: string; // e.g. '80% بطاقات / 20% كاش'
  atms_and_cards_tip_ar: string;
}

export const ALL_CURRENCIES: CurrencyRate[] = [
  // عملات الخليج العربي
  { code: 'SAR', name_ar: 'ريال سعودي', name_en: 'Saudi Riyal', symbol: 'ر.س', rateToUSD: 3.75, flag: '🇸🇦', isArab: true, category: 'gcc' },
  { code: 'AED', name_ar: 'درهم إماراتي', name_en: 'UAE Dirham', symbol: 'د.إ', rateToUSD: 3.67, flag: '🇦🇪', isArab: true, category: 'gcc' },
  { code: 'KWD', name_ar: 'دينار كويتي', name_en: 'Kuwaiti Dinar', symbol: 'د.ك', rateToUSD: 0.308, flag: '🇰🇼', isArab: true, category: 'gcc' },
  { code: 'QAR', name_ar: 'ريال قطري', name_en: 'Qatari Riyal', symbol: 'ر.ق', rateToUSD: 3.64, flag: '🇶🇦', isArab: true, category: 'gcc' },
  { code: 'BHD', name_ar: 'دينار بحريني', name_en: 'Bahraini Dinar', symbol: 'د.ب', rateToUSD: 0.376, flag: '🇧🇭', isArab: true, category: 'gcc' },
  { code: 'OMR', name_ar: 'ريال عماني', name_en: 'Omani Rial', symbol: 'ر.ع', rateToUSD: 0.384, flag: '🇴🇲', isArab: true, category: 'gcc' },

  // بقية الدول العربية
  { code: 'EGP', name_ar: 'جنيه مصري', name_en: 'Egyptian Pound', symbol: 'ج.م', rateToUSD: 48.5, flag: '🇪🇬', isArab: true, category: 'arab_africa' },
  { code: 'JOD', name_ar: 'دينار أردني', name_en: 'Jordanian Dinar', symbol: 'د.أ', rateToUSD: 0.709, flag: '🇯🇴', isArab: true, category: 'arab_levant' },
  { code: 'MAD', name_ar: 'درهم مغربي', name_en: 'Moroccan Dirham', symbol: 'د.م.', rateToUSD: 9.95, flag: '🇲🇦', isArab: true, category: 'arab_africa' },
  { code: 'DZD', name_ar: 'دينار جزائري', name_en: 'Algerian Dinar', symbol: 'د.ج', rateToUSD: 134.5, flag: '🇩🇿', isArab: true, category: 'arab_africa' },
  { code: 'TND', name_ar: 'دينار تونسي', name_en: 'Tunisian Dinar', symbol: 'د.ت', rateToUSD: 3.12, flag: '🇹🇳', isArab: true, category: 'arab_africa' },
  { code: 'IQD', name_ar: 'دينار عراقي', name_en: 'Iraqi Dinar', symbol: 'د.ع', rateToUSD: 1310, flag: '🇮🇶', isArab: true, category: 'arab_levant' },
  { code: 'LYD', name_ar: 'دينار ليبي', name_en: 'Libyan Dinar', symbol: 'د.ل', rateToUSD: 4.88, flag: '🇱🇾', isArab: true, category: 'arab_africa' },
  { code: 'LBP', name_ar: 'ليرة لبنانية', name_en: 'Lebanese Pound', symbol: 'ل.ل', rateToUSD: 89500, flag: '🇱🇧', isArab: true, category: 'arab_levant' },
  { code: 'YER', name_ar: 'ريال يمني', name_en: 'Yemeni Rial', symbol: 'ر.ي', rateToUSD: 250, flag: '🇾🇪', isArab: true, category: 'arab_levant' },
  { code: 'SDG', name_ar: 'جنيه سوداني', name_en: 'Sudanese Pound', symbol: 'ج.س', rateToUSD: 600, flag: '🇸🇩', isArab: true, category: 'arab_africa' },
  { code: 'MRU', name_ar: 'أوقية موريتانية', name_en: 'Mauritanian Ouguiya', symbol: 'أ.م', rateToUSD: 39.8, flag: '🇲🇷', isArab: true, category: 'arab_africa' },

  // العملات العالمية الرئيسية
  { code: 'USD', name_ar: 'دولار أمريكي', name_en: 'US Dollar', symbol: '$', rateToUSD: 1.0, flag: '🇺🇸', isArab: false, category: 'global_major' },
  { code: 'EUR', name_ar: 'يورو أوروبي', name_en: 'Euro', symbol: '€', rateToUSD: 0.92, flag: '🇪🇺', isArab: false, category: 'global_major' },
  { code: 'GBP', name_ar: 'جنيه إسترليني', name_en: 'British Pound', symbol: '£', rateToUSD: 0.77, flag: '🇬🇧', isArab: false, category: 'global_major' },
  { code: 'CHF', name_ar: 'فرنك سويسري', name_en: 'Swiss Franc', symbol: 'CHF', rateToUSD: 0.88, flag: '🇨🇭', isArab: false, category: 'global_major' },
  { code: 'JPY', name_ar: 'ين ياباني', name_en: 'Japanese Yen', symbol: '¥', rateToUSD: 154.5, flag: '🇯🇵', isArab: false, category: 'global_major' },
  { code: 'CAD', name_ar: 'دولار كندي', name_en: 'Canadian Dollar', symbol: 'C$', rateToUSD: 1.39, flag: '🇨🇦', isArab: false, category: 'global_major' },
  { code: 'AUD', name_ar: 'دولار أسترالي', name_en: 'Australian Dollar', symbol: 'A$', rateToUSD: 1.53, flag: '🇦🇺', isArab: false, category: 'global_major' },

  // عملات الوجهات السياحية العالمية الأكثر شعبية للمسافر العربي
  { code: 'TRY', name_ar: 'ليرة تركية', name_en: 'Turkish Lira', symbol: '₺', rateToUSD: 34.8, flag: '🇹🇷', isArab: false, category: 'global_emerging' },
  { code: 'AZN', name_ar: 'مانات أذربيجاني', name_en: 'Azerbaijani Manat', symbol: '₼', rateToUSD: 1.70, flag: '🇦🇿', isArab: false, category: 'global_emerging' },
  { code: 'MVR', name_ar: 'روفية مالديفية', name_en: 'Maldivian Rufiyaa', symbol: 'Rf', rateToUSD: 15.42, flag: '🇲🇻', isArab: false, category: 'global_emerging' },
  { code: 'THB', name_ar: 'بات تايلاندي', name_en: 'Thai Baht', symbol: '฿', rateToUSD: 34.6, flag: '🇹🇭', isArab: false, category: 'global_emerging' },
  { code: 'MYR', name_ar: 'رينغيت ماليزي', name_en: 'Malaysian Ringgit', symbol: 'RM', rateToUSD: 4.45, flag: '🇲🇾', isArab: false, category: 'global_emerging' },
  { code: 'IDR', name_ar: 'روبية إندونيسية', name_en: 'Indonesian Rupiah', symbol: 'Rp', rateToUSD: 15850, flag: '🇮🇩', isArab: false, category: 'global_emerging' },
  { code: 'SGD', name_ar: 'دولار سنغافوري', name_en: 'Singapore Dollar', symbol: 'S$', rateToUSD: 1.34, flag: '🇸🇬', isArab: false, category: 'global_major' },
  { code: 'CZK', name_ar: 'كرونة تشيكية', name_en: 'Czech Koruna', symbol: 'Kč', rateToUSD: 23.9, flag: '🇨🇿', isArab: false, category: 'global_emerging' },
  { code: 'HUF', name_ar: 'فورنت مجري', name_en: 'Hungarian Forint', symbol: 'Ft', rateToUSD: 382, flag: '🇭🇺', isArab: false, category: 'global_emerging' },
  { code: 'UZS', name_ar: 'سوم أوزبكي', name_en: 'Uzbek Som', symbol: 'so\'m', rateToUSD: 12820, flag: '🇺🇿', isArab: false, category: 'global_emerging' },
  { code: 'RUB', name_ar: 'روبل روسي', name_en: 'Russian Ruble', symbol: '₽', rateToUSD: 99.5, flag: '🇷🇺', isArab: false, category: 'global_emerging' },
  { code: 'NOK', name_ar: 'كرونة نرويجية', name_en: 'Norwegian Krone', symbol: 'kr', rateToUSD: 11.05, flag: '🇳🇴', isArab: false, category: 'global_emerging' },
  { code: 'VND', name_ar: 'دونغ فيتنامي', name_en: 'Vietnamese Dong', symbol: '₫', rateToUSD: 25400, flag: '🇻🇳', isArab: false, category: 'global_emerging' },
  { code: 'LKR', name_ar: 'روبية سريلانكية', name_en: 'Sri Lankan Rupee', symbol: 'Rs', rateToUSD: 292, flag: '🇱🇰', isArab: false, category: 'global_emerging' },
  { code: 'KZT', name_ar: 'تينغ كازاخستاني', name_en: 'Kazakhstani Tenge', symbol: '₸', rateToUSD: 495, flag: '🇰🇿', isArab: false, category: 'global_emerging' },
  { code: 'KES', name_ar: 'شلن كيني', name_en: 'Kenyan Shilling', symbol: 'KSh', rateToUSD: 129.5, flag: '🇰🇪', isArab: false, category: 'global_emerging' },
  { code: 'SCR', name_ar: 'روبية سيشيلية', name_en: 'Seychellois Rupee', symbol: 'SR', rateToUSD: 14.1, flag: '🇸🇨', isArab: false, category: 'global_emerging' },
  { code: 'NZD', name_ar: 'دولار نيوزيلندي', name_en: 'NZ Dollar', symbol: 'NZ$', rateToUSD: 1.71, flag: '🇳🇿', isArab: false, category: 'global_emerging' },
];

export const COUNTRY_BUDGET_PROFILES: Record<string, CountryBudgetProfile> = {
  // المملكة المتحدة
  GB: {
    country_code: 'GB',
    country_name_ar: 'بريطانيا (المملكة المتحدة)',
    currency_code: 'GBP',
    currency_name_ar: 'جنيه إسترليني',
    symbol: '£',
    budget_daily_usd: {
      backpacker: { lodging: 45, food: 25, transport: 15, total: 85, desc_ar: 'نزل مشترك، ساندويتشات ووجبات سوبرماركت، مترو/حافلات بحد أقصى يومي' },
      moderate: { lodging: 140, food: 55, transport: 25, total: 220, desc_ar: 'فندق 3-4 نجوم خارج المنطقة 1، مطاعم عادية وبيرغر حلال، تنقلات غير محدودة' },
      luxury: { lodging: 380, food: 140, transport: 80, total: 600, desc_ar: 'فندق 5 نجوم مايفير/نايتسبريدج، مطاعم راقية وتاكسي لندن الأسود' },
    },
    tipping_customs_ar: 'في المطاعم يتم غالباً إضافة 12.5% رسوم خدمة اختيارية (Service Charge) في الفاتورة تلقائياً. إذا كانت موجودة، فلا داعي لدفع بقشيش إضافي. لسائقي التاكسي، يفضل تدوير الحساب لأقرب جنيه أو جنيهين.',
    tipping_score: 'customary',
    payment_method_advice_ar: 'المملكة المتحدة تكاد تكون مجتمعاً خالياً من الكاش بنسبة 98%. Apple Pay أو Google Pay أو البطاقات اللاتلامسية مقبولة في كل مكان، بما فيها أصغر أكشاك الشوارع والحافلات.',
    cash_vs_card_ratio: '95% بطاقات / 5% كاش طوارئ فقط',
    atms_and_cards_tip_ar: 'عند الدفع بالبطاقة، اختر دائماً الخصم بالعملة المحلية (GBP) وتجنب خيار التحويل الديناميكي للعملات (DCC) لتفادي عمولات الصرف المرتفعة.',
  },

  // تركيا
  TR: {
    country_code: 'TR',
    country_name_ar: 'تركيا',
    currency_code: 'TRY',
    currency_name_ar: 'ليرة تركية',
    symbol: '₺',
    budget_daily_usd: {
      backpacker: { lodging: 25, food: 15, transport: 6, total: 46, desc_ar: 'غرفة اقتصادية بفاتح/كاديكوي، شاورما وفطائر بوريك، ترام ومترو' },
      moderate: { lodging: 75, food: 35, transport: 15, total: 125, desc_ar: 'فندق 4 نجوم بمطل، مطاعم مشاوي وإفطار تركي قرى، تنقلات بالمترو وعبّارات' },
      luxury: { lodging: 250, food: 95, transport: 65, total: 410, desc_ar: 'فنادق البوسفور التاريخية والمنتجعات، مطاعم أسماك فاخرة وسيارة خاصة بسائق' },
    },
    tipping_customs_ar: 'البقشيش مرحب به جداً ومتبع في المطاعم السياحية بنسبة 5% إلى 10% نقداً على الطاولة حتى لو دفعت الحساب بالبطاقة. لسائقي التاكسي تدوير الفاتورة لأقرب 20-50 ليرة.',
    tipping_score: 'customary',
    payment_method_advice_ar: 'البطاقات الائتمانية مقبولة في معظم المتاجر والمطاعم الكبرى، ولكن احتفظ دائماً بمبلغ كاش من الليرات للتاكسي، البازارات الشعبية، وكروت إسطنبول كارت.',
    cash_vs_card_ratio: '70% بطاقات / 30% كاش',
    atms_and_cards_tip_ar: 'احذر من صرافات Euronet في الشوارع السياحية بسبب رسومها المرتفعة؛ اسحب فقط من الصرافات التابعة للبنوك التركية الرسمية مثل Ziraat, Garanti, İş Bankası أو بنوك إسلامية مثل Kuveyt Türk.',
  },

  // فرنسا
  FR: {
    country_code: 'FR',
    country_name_ar: 'فرنسا',
    currency_code: 'EUR',
    currency_name_ar: 'يورو',
    symbol: '€',
    budget_daily_usd: {
      backpacker: { lodging: 45, food: 25, transport: 12, total: 82, desc_ar: 'إقامة نزل في الضواحي القريبة، مخابز فرنسية ومترو باريس' },
      moderate: { lodging: 150, food: 60, transport: 20, total: 230, desc_ar: 'فندق بوتيك 3-4 نجوم، كافيهات ومطاعم براسيري، شبكة المترو وRER' },
      luxury: { lodging: 450, food: 160, transport: 90, total: 700, desc_ar: 'فنادق قصر بالقرب من الشانزلزيه، مطاعم ميشلان، وسيارات ليموزين خاصة' },
    },
    tipping_customs_ar: 'القانون الفرنسي يفرض تضمين رسوم الخدمة (Service Compris) بنسبة 15% في جميع الفواتير. ترك يورو أو اثنين إضافيين في المقاهي أو 5% في المطاعم الراقية يعتبر بادرة امتنان لطيفة.',
    tipping_score: 'optional',
    payment_method_advice_ar: 'البطاقات الإلكترونية مقبولة في كافة المعالم والمتاجر والمترو. الكاش مطلوب فقط في بعض أسواق السبت المفتوحة ومحلات الخبز التقليدية لطلبات أقل من 2 يورو.',
    cash_vs_card_ratio: '90% بطاقات / 10% كاش',
    atms_and_cards_tip_ar: 'اشتر تذاكر المترو عبر تطبيق Île-de-France Mobilités بهاتفك الذكي لتوفير رسوم التذاكر الورقية وتفادي طوابير شبابيك التذاكر.',
  },

  // سويسرا
  CH: {
    country_code: 'CH',
    country_name_ar: 'سويسرا',
    currency_code: 'CHF',
    currency_name_ar: 'فرنك سويسري',
    symbol: 'CHF',
    budget_daily_usd: {
      backpacker: { lodging: 70, food: 35, transport: 30, total: 135, desc_ar: 'نزل شباب، تسوق طعام من سوبرماركت Coop/Migros، تذاكر مخفضة' },
      moderate: { lodging: 220, food: 85, transport: 45, total: 350, desc_ar: 'فندق 3-4 نجوم بإنترلاكن أو لوزيرن، بطاقة Swiss Travel Pass، مطاعم تقليدية' },
      luxury: { lodging: 600, food: 220, transport: 120, total: 940, desc_ar: 'منتجعات جبال الألب 5 نجوم (زيرمات وسانت موريتز)، قطارات الدرجة الأولى البانورامية' },
    },
    tipping_customs_ar: 'الخدمة متضمنة قانوناً في جميع الفواتير بنسبة 100%. التدوير لأقرب فرنك أو إضافة 5% يعتبر كافياً جداً في حال الخدمة الممتازة.',
    tipping_score: 'optional',
    payment_method_advice_ar: 'كل شيء تقريباً يمكن دفعه بالبطاقة حتى في التلفريك ومحطات القمم الجبلية. بطاقات الخصم والائتمان الدولية تعمل بسلاسة فائقة.',
    cash_vs_card_ratio: '90% بطاقات / 10% كاش',
    atms_and_cards_tip_ar: 'شراء بطاقة Swiss Travel Pass هو أكثر قرار اقتصادي يوفر مئات الفرنكات في القطارات والحافلات والبواخر ورسوم المتاحف.',
  },

  // اليابان
  JP: {
    country_code: 'JP',
    country_name_ar: 'اليابان',
    currency_code: 'JPY',
    currency_name_ar: 'ين ياباني',
    symbol: '¥',
    budget_daily_usd: {
      backpacker: { lodging: 35, food: 20, transport: 12, total: 67, desc_ar: 'فنادق كبسولات نظيفة، وجبات 7-Eleven ومطاعم الرامن التلقائية، قطارات محلية' },
      moderate: { lodging: 120, food: 50, transport: 25, total: 195, desc_ar: 'فنادق رجال أعمال حديثة، سوشي وشواء واغيو اقتصادي، بطاقة Suica وقطارات' },
      luxury: { lodging: 450, food: 180, transport: 80, total: 710, desc_ar: 'نزل ريوكان يابانية فاخرة مع ينابيع حارة (أونسن)، وجبات كايسيكي الفاخرة' },
    },
    tipping_customs_ar: '⚠️ ممنوع البقشيش تماماً في اليابان ويُعد إهانة لمقدم الخدمة أو سلوكاً محرجاً. السعر المحدد في الفاتورة هو ما يدفع بالضبط، وإذا تركت مالاً على الطاولة سيركض النادل خلفك ليعيده لك.',
    tipping_score: 'discouraged',
    payment_method_advice_ar: 'رغم تقدم اليابان التكنولوجي، لا يزال الكاش ضرورياً جداً في محلات الشارع القديمة، المعابد، مطاعم الرامن الصغيرة، وشحن بطاقات Suica بالمحطات.',
    cash_vs_card_ratio: '55% بطاقات / 45% كاش',
    atms_and_cards_tip_ar: 'أفضل أماكن سحب الكاش ببطاقاتك الدولية هي صرافات متاجر 7-Eleven (7-Bank) ومتاجر Lawson البريدية، فهي تقبل جميع بطاقات الفيزا والماستركارد العربية برسوم منخفضة.',
  },

  // المالديف
  MV: {
    country_code: 'MV',
    country_name_ar: 'المالديف',
    currency_code: 'MVR',
    currency_name_ar: 'روفية مالديفية / دولار أمريكي',
    symbol: 'Rf / $',
    budget_daily_usd: {
      backpacker: { lodging: 60, food: 25, transport: 15, total: 100, desc_ar: 'جزر محلية (مافوشي/تودو)، بيوت ضيافة، عبّارات عامة، أكلات بحرية محلية' },
      moderate: { lodging: 250, food: 80, transport: 50, total: 380, desc_ar: 'فنادق 4 نجوم على الجزر المأهولة مع رحلات غطس يومية وقوارب سريعة' },
      luxury: { lodging: 850, food: 250, transport: 200, total: 1300, desc_ar: 'منتجع خاص جزيرة مستقلة، فلل فوق الماء بمسبح خاص، طيران مائي (Seaplane)' },
    },
    tipping_customs_ar: 'تضاف ضريبة سياحية (16% TGST) ورسوم خدمة 10% إلى كافة الفواتير في المنتجعات. منح 5 إلى 10 دولارات كاش لعمال النظافة ومقدمي خدمة الفلل فوق الماء يلقى تقديراً كبيراً.',
    tipping_score: 'customary',
    payment_method_advice_ar: 'في المنتجعات السياحية الفاخرة يتم التعامل حصرياً بالدولار الأمريكي والبطاقات الائتمانية. الروفية المالديفية تلزمك فقط في أسواق العاصمة ماليه والجزر المحلية الصغيرة.',
    cash_vs_card_ratio: '80% بطاقات ودولار / 20% روفية محلية',
    atms_and_cards_tip_ar: 'احرص على أخذ دولارات أمريكية نقدية نظيفة من الطبعات الحديثة، حيث ترفض بعض الأكشاك الدولارات القديمة أو الممزقة.',
  },

  // أذربيجان
  AZ: {
    country_code: 'AZ',
    country_name_ar: 'أذربيجان',
    currency_code: 'AZN',
    currency_name_ar: 'مانات أذربيجاني',
    symbol: '₼',
    budget_daily_usd: {
      backpacker: { lodging: 20, food: 12, transport: 4, total: 36, desc_ar: 'بيوت ضيافة بالمدينة القديمة، وجبات دونر وشوربة دوشبارا، مترو باكو' },
      moderate: { lodging: 65, food: 28, transport: 12, total: 105, desc_ar: 'فندق 4 نجوم بوسط باكو، مطاعم كباب وأطباق بلوف فاخرة، وتطبيقات أوبر وبولت' },
      luxury: { lodging: 220, food: 80, transport: 45, total: 345, desc_ar: 'فنادق أبراج الشعلة أو الفورسيزنز، جولات جبلية خاصة في قبالا وشاهداغ' },
    },
    tipping_customs_ar: 'تضيف بعض المطاعم 5-10% رسوم خدمة. ترك 5-10% إضافية نقداً يعبر عن الامتنان للخدمة. سائقو التاكسي يفضلون تدوير الفكة.',
    tipping_score: 'customary',
    payment_method_advice_ar: 'في العاصمة باكو البطاقات مقبولة في المولات والمطاعم الكبرى، لكن خارج باكو (قبالا، قوبا، شكي) الكاش بالمانات هو الأساس.',
    cash_vs_card_ratio: '60% بطاقات / 40% كاش',
    atms_and_cards_tip_ar: 'استخدم تطبيق Bolt أو Yango لطلب التاكسي بالبطاقة بدلاً من التاكسي العادي بالشارع لتفادي التفاوض على السعر.',
  },

  // الإمارات العربية المتحدة
  AE: {
    country_code: 'AE',
    country_name_ar: 'الإمارات العربية المتحدة',
    currency_code: 'AED',
    currency_name_ar: 'درهم إماراتي',
    symbol: 'د.إ',
    budget_daily_usd: {
      backpacker: { lodging: 35, food: 20, transport: 8, total: 63, desc_ar: 'نزل وشقق فندقية بديرة أو بر دبي، كافتيريات شعبية، مترو دبي وحافلات' },
      moderate: { lodging: 120, food: 45, transport: 22, total: 187, desc_ar: 'فندق 4 نجوم بوسط المدينة أو البرشاء، مطاعم مولات ومشاوي، تاكسي ومترو' },
      luxury: { lodging: 450, food: 150, transport: 90, total: 690, desc_ar: 'منتجعات نخلة جميرا وبرج العرب، مطاعم نجوم عالمية، وسيارات فاخرة' },
    },
    tipping_customs_ar: 'البقشيش غير إلزامي، لكن ترك 10-15% في المطاعم أو 5-10 دراهم لعمال التوصيل وحاملي الحقائب متعارف عليه ومقدر.',
    tipping_score: 'customary',
    payment_method_advice_ar: 'دولة فائقة الرقمنة؛ بطاقات الائتمان ومدفوعات الهواتف الذكية تقبل في 99% من الأماكن بما في ذلك سيارات الأجرة والمواقف.',
    cash_vs_card_ratio: '95% بطاقات / 5% كاش',
    atms_and_cards_tip_ar: 'احصل على بطاقة نول (Nol Card) الذهبية أو الفضية في دبي لركوب المترو والترام والحافلات والتاكسي المائي بسهولة.',
  },

  // المملكة العربية السعودية
  SA: {
    country_code: 'SA',
    country_name_ar: 'المملكة العربية السعودية',
    currency_code: 'SAR',
    currency_name_ar: 'ريال سعودي',
    symbol: 'ر.س',
    budget_daily_usd: {
      backpacker: { lodging: 35, food: 18, transport: 10, total: 63, desc_ar: 'شقق مخدومة، مطاعم كبسة وبخاري، مترو الرياض وحافلات' },
      moderate: { lodging: 110, food: 45, transport: 25, total: 180, desc_ar: 'فنادق 4 نجوم، مطاعم عائلية ومقاهي مختصة، سيارات تطبيقات أوبر وكريم' },
      luxury: { lodging: 380, food: 140, transport: 80, total: 600, desc_ar: 'فنادق 5 نجوم بالعليا ومنتجعات البحر الأحمر والعلا، سيارات خاصة مع سائق' },
    },
    tipping_customs_ar: 'البقشيش اختياري؛ ترك 5-10% في المطاعم الراقية أو بضعة ريالات لعمال الخدمة يلقى استحساناً.',
    tipping_score: 'optional',
    payment_method_advice_ar: 'نظام مدفوعات "مدى" والبطاقات الإلكترونية وApple Pay يغطي 100% تقريباً من المحلات حتى البقالات ومحطات الوقود.',
    cash_vs_card_ratio: '95% بطاقات / 5% كاش',
    atms_and_cards_tip_ar: 'استخدم تطبيق قطار الحرمين لحجز رحلات مكة والمدينة وجدة بأسعار تشجيعية قبل موعد الرحلة بأيام.',
  },

  // مصر
  EG: {
    country_code: 'EG',
    country_name_ar: 'مصر',
    currency_code: 'EGP',
    currency_name_ar: 'جنيه مصري',
    symbol: 'ج.م',
    budget_daily_usd: {
      backpacker: { lodging: 15, food: 8, transport: 3, total: 26, desc_ar: 'فنادق وسط البلد التاريخية، كشري وفلافل وفول، مترو القاهرة' },
      moderate: { lodging: 55, food: 22, transport: 10, total: 87, desc_ar: 'فندق 4 نجوم بالزمالك أو المعادي، مطاعم مشاوي ومأكولات نيلية، أوبر وإن درايف' },
      luxury: { lodging: 220, food: 70, transport: 45, total: 335, desc_ar: 'فنادق كورنيش النيل التاريخية 5 نجوم ومنتجعات الجونة، مركب خاص ومرشد خاص' },
    },
    tipping_customs_ar: 'البقشيش (الإكرامية) جزء أساسي من الثقافة اليومية في المطاعم والمواقف والمتاحف. احتفظ بفئات نقدية صغيرة من الجنيهات (20-50 ج.م) للإكراميات.',
    tipping_score: 'mandatory',
    payment_method_advice_ar: 'في الفنادق والمولات والمطاعم الكبرى تقبل البطاقات، لكن الكاش بالجنيه المصري لا غنى عنه في الأنشطة اليومية والأسواق والتنقلات الشعبية.',
    cash_vs_card_ratio: '50% بطاقات / 50% كاش',
    atms_and_cards_tip_ar: 'تذاكر المتاحف والمواقع الأثرية مثل الأهرامات والمتحف المصري الكبير أصبحت إلكترونية ولا تقبل الكاش؛ ادفعها دائماً بالبطاقة الائتمانية عبر البوابة الرسمية.',
  },

  // ماليزيا
  MY: {
    country_code: 'MY',
    country_name_ar: 'ماليزيا',
    currency_code: 'MYR',
    currency_name_ar: 'رينغيت ماليزي',
    symbol: 'RM',
    budget_daily_usd: {
      backpacker: { lodging: 18, food: 10, transport: 5, total: 33, desc_ar: 'نزل بمنطقة بوكيت بينتانغ، أسواق أطعمة ناسي ليماك الشعبية، قطارات MRT' },
      moderate: { lodging: 60, food: 25, transport: 12, total: 97, desc_ar: 'أبراج فندقية بإطلالة ومسبح، مطاعم حلال راقية، تطبيق Grab للتنقل' },
      luxury: { lodging: 200, food: 70, transport: 40, total: 310, desc_ar: 'منتجعات لنكاوي الفاخرة وفنادق 5 نجوم قرب برجي بتروناس، سيارة خاصة' },
    },
    tipping_customs_ar: 'البقشيش غير متوقع نظراً لإضافة 10% ضريبة خدمة و6% ضريبة مبيعات إلى الفواتير، لكن ترك الفكة المتبقية سائغ ومقبول.',
    tipping_score: 'optional',
    payment_method_advice_ar: 'البطاقات الائتمانية وتطبيق GrabPay مقبولة في المولات والمتاجر. يلزم الكاش فقط في أكشاك المأكولات وأسواق الفواكه الاستوائية.',
    cash_vs_card_ratio: '75% بطاقات / 25% كاش',
    atms_and_cards_tip_ar: 'استخدم تطبيق Grab لجميع تنقلاتك ومأكولاتك فهو مدعوم بالكامل ومحدد الأسعار دون أي فرصة للمغالاة.',
  },

  // تايلاند
  TH: {
    country_code: 'TH',
    country_name_ar: 'تايلاند',
    currency_code: 'THB',
    currency_name_ar: 'بات تايلاندي',
    symbol: '฿',
    budget_daily_usd: {
      backpacker: { lodging: 18, food: 10, transport: 5, total: 33, desc_ar: 'بيوت ضيافة، مأكولات شوارع حلال، قطارات BTS المعلقة' },
      moderate: { lodging: 65, food: 25, transport: 14, total: 104, desc_ar: 'فندق 4 نجوم بمسبح، مطاعم بحرية تايلاندية، تطبيق Bolt وGrab' },
      luxury: { lodging: 240, food: 85, transport: 50, total: 375, desc_ar: 'فلل شاطئية بفوكيت وساموي، يخوت خاصة برحلات جزر بي بي' },
    },
    tipping_customs_ar: 'البقشيش غير إلزامي ولكنه شائع جداً في المناطق السياحية (20 إلى 50 بات للخدمة أو لجلسات المساج والتنظيف).',
    tipping_score: 'customary',
    payment_method_advice_ar: 'الكاش بالبات ضروري للغاية في الأسواق الليلية والرحلات البحرية والتنقلات السريعة. الصرافات تفرض رسماً ثابتاً (220 بات) على كل سحبة أجنبية.',
    cash_vs_card_ratio: '50% بطاقات / 50% كاش',
    atms_and_cards_tip_ar: 'عند السحب من الصراف الآلي، اسحب مبلغاً كبيراً مرة واحدة لتجنب تكرار رسم الـ 220 بات الثابت المفروض على البطاقات غير التايلاندية.',
  }
};
