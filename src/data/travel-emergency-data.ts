export interface CountryEmergencyContact {
  country_code: string;
  country_name_ar: string;
  police: string;
  ambulance: string;
  fire: string;
  general_emergency: string; // e.g. 112 in EU, 999 in UK, 911 in USA
  tourist_police?: string;
  arab_embassies: Array<{
    country_name_ar: string;
    flag: string;
    phone: string;
    emergency_hotline: string;
    address_ar: string;
  }>;
  health_and_insurance_rules_ar: string;
  restricted_medications_ar: string[];
}

export interface MultiLingualSosPhrase {
  id: string;
  category: 'medical' | 'police' | 'passport' | 'halal' | 'transport' | 'lost';
  icon: string;
  phrase_ar: string;
  translations: {
    en: string;
    fr?: string;
    tr?: string;
    ja?: string;
    ru?: string;
    es?: string;
  };
}

export const EMERGENCY_CONTACTS_DATA: Record<string, CountryEmergencyContact> = {
  GB: {
    country_code: 'GB',
    country_name_ar: 'المملكة المتحدة (بريطانيا)',
    general_emergency: '999 (طوارئ قصوى) أو 112',
    police: '999 (طوارئ) / 101 (غير الطوارئ)',
    ambulance: '999 / 111 (استشارة طبية مجانية NHS)',
    fire: '999',
    tourist_police: '101',
    arab_embassies: [
      {
        country_name_ar: 'سفارة المملكة العربية السعودية - لندن',
        flag: '🇸🇦',
        phone: '+44 20 7917 3000',
        emergency_hotline: '+44 7977 777000',
        address_ar: '30 Charles Street, Mayfair, London W1J 5DZ'
      },
      {
        country_name_ar: 'سفارة دولة الإمارات العربية المتحدة - لندن',
        flag: '🇦🇪',
        phone: '+44 20 7581 1281',
        emergency_hotline: '+44 7825 566669',
        address_ar: '1-2 Grosvenor Crescent, Belgravia, London SW1X 7EE'
      },
      {
        country_name_ar: 'سفارة جمهورية مصر العربية - لندن',
        flag: '🇪🇬',
        phone: '+44 20 7235 9771',
        emergency_hotline: '+44 7984 892095',
        address_ar: '26 South Street, Mayfair, London W1K 1DW'
      },
      {
        country_name_ar: 'سفارة دولة الكويت - لندن',
        flag: '🇰🇼',
        phone: '+44 20 7590 3400',
        emergency_hotline: '+44 7985 747070',
        address_ar: '2 Albert Gate, Knightsbridge, London SW1X 7JU'
      },
      {
        country_name_ar: 'سفارة دولة قطر - لندن',
        flag: '🇶🇦',
        phone: '+44 20 7493 2200',
        emergency_hotline: '+44 7984 100000',
        address_ar: '1 South Audley Street, London W1K 1NB'
      }
    ],
    health_and_insurance_rules_ar: 'العلاج في أقسام الطوارئ (A&E) بمستشفيات هيئة الخدمات الصحية الوطنية (NHS) يقدم للإصابات المهددة للحياة، ولكن المستشفيات تفرض رسوماً على الزوار غير المقيمين لاحقاً ما لم يكن لديك تأمين سفر دولي معتمد. الاتصال برقم 111 يمنحك توجيهاً سريعاً لأقرب عيادة.',
    restricted_medications_ar: [
      'الأدوية المهدئة التي تحتوي على الكوديين أو الترامادول تتطلب وصفة طبية أصلية باللغة الإنجليزية من طبيبك تثبت الجرعة واسمك المطابق لجواز السفر.',
      'الحد الأقصى المسموح بإدخاله من الأدوية الشخصية هو كمية تكفي لمدة 3 أشهر كحد أقصى.',
      'يمنع إدخال أي أدوية عشبية غير مدرجة أو غير معتمدة من هيئة الأدوية البريطانية (MHRA).'
    ]
  },

  TR: {
    country_code: 'TR',
    country_name_ar: 'تركيا',
    general_emergency: '112 (مركز الطوارئ الموحد لكافة الحالات)',
    police: '155 (شرطة) أو 112',
    ambulance: '112',
    fire: '110',
    tourist_police: '112 أو شرطة السياحة بالسلطان أحمد: +90 212 527 4503',
    arab_embassies: [
      {
        country_name_ar: 'القنصلية العامة للسعودية - إسطنبول',
        flag: '🇸🇦',
        phone: '+90 212 281 9140',
        emergency_hotline: '+90 530 955 2120',
        address_ar: 'حي ليفنت، إسطنبول'
      },
      {
        country_name_ar: 'القنصلية العامة للإمارات - إسطنبول',
        flag: '🇦🇪',
        phone: '+90 212 317 9257',
        emergency_hotline: '+90 533 088 8888',
        address_ar: 'حي مسلك، ساريير، إسطنبول'
      },
      {
        country_name_ar: 'القنصلية العامة لمصر - إسطنبول',
        flag: '🇪🇬',
        phone: '+90 212 324 2160',
        emergency_hotline: '+90 549 713 0184',
        address_ar: 'شارع جواد باشا، بشكتاش، إسطنبول'
      },
      {
        country_name_ar: 'سفارة دولة قطر - أنقرة',
        flag: '🇶🇦',
        phone: '+90 312 490 7274',
        emergency_hotline: '+90 530 069 6666',
        address_ar: 'تشانكايا، أنقرة'
      }
    ],
    health_and_insurance_rules_ar: 'تأمين السفر الطبي إلزامي للحصول على التأشيرة ودخول الأراضي التركية. المستشفيات الخاصة في إسطنبول وأنقرة على أعلى مستوى عالمي ومعظمها يضم مترجمين فوريين للغة العربية، وتقبل تغطية التأمين الدولي مباشرة.',
    restricted_medications_ar: [
      'الأدوية المؤثرة عقلياً والمنومة (مثل الزولبيدم، لورازيبام، ريتالين) ممنوعة منعاً باتاً إلا بتقرير طبي رسمي مصدق ومترجم للتركية أو الإنجليزية.',
      'يحظر دخول أي عقاقير تحتوي على نسب من المواد المخدرة مثل الترامادول أو الميثادون.',
      'أدوية الضغط والسكري وأدوية الربو مسموح بها مع وصفة الطبيب في حدود الاستخدام الشخصي.'
    ]
  },

  FR: {
    country_code: 'FR',
    country_name_ar: 'فرنسا',
    general_emergency: '112 (طوارئ الاتحاد الأوروبي الموحد - متعدد اللغات)',
    police: '17',
    ambulance: '15 (SAMU الإسعاف الطبي المتخصص)',
    fire: '18 (رجال الإطفاء يقومون بالإسعاف الأولي أيضاً)',
    tourist_police: '112',
    arab_embassies: [
      {
        country_name_ar: 'سفارة المملكة العربية السعودية - باريس',
        flag: '🇸🇦',
        phone: '+33 1 56 79 40 00',
        emergency_hotline: '+33 6 73 65 67 06',
        address_ar: '92 Rue de Courcelles, 75008 Paris'
      },
      {
        country_name_ar: 'سفارة دولة الإمارات - باريس',
        flag: '🇦🇪',
        phone: '+33 1 44 34 02 00',
        emergency_hotline: '+33 6 42 61 70 85',
        address_ar: '2 Boulevard de La Tour-Maubourg, 75007 Paris'
      },
      {
        country_name_ar: 'سفارة المملكة المغربية - باريس',
        flag: '🇲🇦',
        phone: '+33 1 45 20 69 35',
        emergency_hotline: '+33 6 22 22 28 88',
        address_ar: '5 Rue Le Tasse, 75016 Paris'
      }
    ],
    health_and_insurance_rules_ar: 'تأمين شنغن الطبي يغطي بحد أدنى 30,000 يورو، وهو شرط قانوني للدخول. خدمة SAMU (رقم 15) مخصصة للحالات القلبية والحوادث الكبرى وتقدم رعاية طبية متنقلة مع طبيب داخل سيارة الإسعاف.',
    restricted_medications_ar: [
      'الأدوية التابعة لقائمة المواد الخاضعة للرقابة تتطلب تصريحاً ووصفة رسمية لا تزيد مدتها عن شهر واحد.',
      'تمنع كميات الأدوية التجارية؛ ويجب أن تكون في علبتها الصيدلانية الأصلية مع نشرة الاستخدام.'
    ]
  },

  CH: {
    country_code: 'CH',
    country_name_ar: 'سويسرا',
    general_emergency: '112',
    police: '117',
    ambulance: '144 (خدمة الإسعاف الطبي السويسري)',
    fire: '118',
    tourist_police: '1414 (خدمة الإنقاذ الجوي الجبلي Rega عبر الهليكوبتر)',
    arab_embassies: [
      {
        country_name_ar: 'سفارة السعودية - برن',
        flag: '🇸🇦',
        phone: '+41 31 352 80 55',
        emergency_hotline: '+41 79 224 43 00',
        address_ar: 'Kirchenfeldstrasse 64, 3005 Bern'
      },
      {
        country_name_ar: 'سفارة الإمارات - برن',
        flag: '🇦🇪',
        phone: '+41 31 312 11 11',
        emergency_hotline: '+41 79 678 77 77',
        address_ar: 'Schwarztorstrasse 31, 3007 Bern'
      }
    ],
    health_and_insurance_rules_ar: 'الرعاية الطبية السويسرية فائقة التقدم لكنها باهظة التكلفة جداً. يوم واحد في المستشفى قد يكلف آلاف الفرنكات؛ لذا يجب التأكد من شمول وثيقة التأمين لحالات الإنقاذ الجبلي بالهليكوبتر (Rega) إذا كنت تمارس رياضة التزلج أو المشي الجبلي في جبال الألب.',
    restricted_medications_ar: [
      'الأدوية المنومة والمسكنات القوية تتطلب شهادة طبية من طبيب مصرح توضح الحاجة العلاجية الملحة.',
      'يسمح بكمية أدوية للاستعمال الشخصي لمدة لا تتجاوز 30 يوماً فقط.'
    ]
  },

  JP: {
    country_code: 'JP',
    country_name_ar: 'اليابان',
    general_emergency: '110 (شرطة) / 119 (إسعاف ومطافئ)',
    police: '110',
    ambulance: '119 (إسعاف طبي)',
    fire: '119',
    tourist_police: 'مكاتب الكوبان (Koban) في كل زاوية وشارع',
    arab_embassies: [
      {
        country_name_ar: 'سفارة المملكة العربية السعودية - طوكيو',
        flag: '🇸🇦',
        phone: '+81 3 3589 5241',
        emergency_hotline: '+81 90 2741 0422',
        address_ar: '1-8-4 Roppongi, Minato-ku, Tokyo 106-0032'
      },
      {
        country_name_ar: 'سفارة دولة الإمارات - طوكيو',
        flag: '🇦🇪',
        phone: '+81 3 5474 6677',
        emergency_hotline: '+81 80 4363 6444',
        address_ar: '9-10 Nanpeidaicho, Shibuya-ku, Tokyo 150-0036'
      }
    ],
    health_and_insurance_rules_ar: 'تأمين السفر الطبي ضروري للغاية. المستشفيات اليابانية تطلب الدفع المسبق قبل تقديم الخدمة غالباً إذا لم يكن هناك خطاب ضمان من شركة تأمين معتمدة. استخدم خدمة الخط الساخن السياحي لمنظمة السياحة الوطنية اليابانية (JNTO) بلغات متعددة: +81 50 3816 2720.',
    restricted_medications_ar: [
      '⚠️ تحذير صارم: أدوية الزكام ونزلات البرد الشائعة التي تحتوي على مادة السودوإيفيدرين (مثل Sudafed أو بعض أنواع Panadol Cold & Flu) محظورة تماماً في اليابان وتعتبر جريمة مخدرات يعاقب عليها بالاحتجاز.',
      'أدوية قصور الانتباه مثل Adderall ممنوعة قطعاً حتى مع وجود وصفة طبية.',
      'إذا كنت بحاجة لأدوية مزمنة تزيد عن شهر، يجب استخراج تصريح (Yakkan Shoumei) مسبقاً من وزارة الصحة اليابانية قبل الوصول.'
    ]
  },

  MV: {
    country_code: 'MV',
    country_name_ar: 'المالديف',
    general_emergency: '119 (شرطة) / 102 (إسعاف)',
    police: '119',
    ambulance: '102',
    fire: '118',
    tourist_police: '+960 979 0070',
    arab_embassies: [
      {
        country_name_ar: 'سفارة المملكة العربية السعودية - ماليه',
        flag: '🇸🇦',
        phone: '+960 330 0811',
        emergency_hotline: '+960 790 0811',
        address_ar: 'أرخبيل ماليه، جزر المالديف'
      },
      {
        country_name_ar: 'سفارة دولة الإمارات - كولومبو (تغطي المالديف)',
        flag: '🇦🇪',
        phone: '+94 11 256 5053',
        emergency_hotline: '+94 77 778 0000',
        address_ar: 'كولومبو / التمثيل الدبلوماسي بالمالديف'
      }
    ],
    health_and_insurance_rules_ar: 'كل منتجع سياحي يضم عيادة طبية وطبيباً مقيماً للحالات البسيطة ولدغات البحر وحروق الشمس. الحالات الجراحية والحرجة تنقل بالقارب السريع أو الطيران المائي إلى المستشفى المركزي بالعاصمة ماليه (ADK Hospital أو IGMH).',
    restricted_medications_ar: [
      'ممنوع جلب أي كميات غير مصرح بها من الأدوية النفسية أو المسكنة بدون وصفة طبية أصلية بالإنجليزية.',
      'يمنع إدخال الكحول أو لحوم الخنزير بأي شكل تحت طائلة المصادرة بالغرامة عند التفتيش في المطار.'
    ]
  },

  AZ: {
    country_code: 'AZ',
    country_name_ar: 'أذربيجان',
    general_emergency: '112 (مركز الطوارئ التابع لوزارة الحالات الطارئة)',
    police: '102',
    ambulance: '103',
    fire: '101',
    tourist_police: '+994 12 590 99 66',
    arab_embassies: [
      {
        country_name_ar: 'سفارة السعودية - باكو',
        flag: '🇸🇦',
        phone: '+994 12 497 23 05',
        emergency_hotline: '+994 50 255 58 55',
        address_ar: 'شارع سليمان داداشيف، باكو'
      },
      {
        country_name_ar: 'سفارة الإمارات - باكو',
        flag: '🇦🇪',
        phone: '+994 12 594 70 31',
        emergency_hotline: '+994 50 252 50 00',
        address_ar: 'شارع نظامي، باكو'
      },
      {
        country_name_ar: 'سفارة قطر - باكو',
        flag: '🇶🇦',
        phone: '+994 12 404 02 01',
        emergency_hotline: '+994 50 273 00 00',
        address_ar: 'باكو'
      }
    ],
    health_and_insurance_rules_ar: 'المستشفيات الحديثة في باكو (مثل مستشفى بونا ديا الدولي Bona Dea وBaku Medical Plaza) تقدم خدمات ممتازة بلغات متعددة. تأمين السفر يغطي المصاريف في هذه المستشفيات الخاصة مباشرة.',
    restricted_medications_ar: [
      'أدوية الترامادول ومسكنات الأعصاب محظورة بشدة وتتطلب إذناً وتصريحاً رسمياً مسبقاً، وإلا قد يتعرض المسافر للتوقيف في مطار حيدر علييف.',
      'احتفظ دائماً بالروشتة الطبية الأصلية مختومة من الطبيب ومترجمة للإنجليزية لأي دواء تحمله.'
    ]
  },

  DE: {
    country_code: 'DE',
    country_name_ar: 'ألمانيا',
    general_emergency: '112 (طوارئ وإسعاف ومطافئ)',
    police: '110',
    ambulance: '112 / 116117 (طبيب مناوب غير طارئ)',
    fire: '112',
    tourist_police: '110',
    arab_embassies: [
      {
        country_name_ar: 'سفارة السعودية - برلين',
        flag: '🇸🇦',
        phone: '+49 30 889 250',
        emergency_hotline: '+49 174 722 0000',
        address_ar: 'Tiergartenstraße 33-34, 10785 Berlin'
      },
      {
        country_name_ar: 'سفارة الإمارات - برلين',
        flag: '🇦🇪',
        phone: '+49 30 516 510',
        emergency_hotline: '+49 173 800 0000',
        address_ar: 'Hiroshimastraße 18-20, 10785 Berlin'
      },
      {
        country_name_ar: 'سفارة مصر - برلين',
        flag: '🇪🇬',
        phone: '+49 30 477 5470',
        emergency_hotline: '+49 176 845 0000',
        address_ar: 'Stauffenbergstraße 6-7, 10785 Berlin'
      }
    ],
    health_and_insurance_rules_ar: 'تأمين السشنغن الصحي إلزامي بتغطية لا تقل عن 30,000 يورو. النظام الطبي الألماني متقدم للغاية؛ عند الحالات غير الحرجة يمكن الاتصال بـ 116117 لتحديد عيادة طبيب مناوبة ليلاً أو خلال عطلات نهاية الأسبوع.',
    restricted_medications_ar: [
      'الأدوية التابعة لقانون المخدرات الألماني (BtMG) بما فيها المنومات القوية ومشتقات الأفيون تتطلب شهادة طبية موقعة ومختومة ومترجمة.',
      'أدوية الاستعمال الشخصي مسموح بها بحد أقصى يعادل احتياج 3 أشهر.'
    ]
  },

  US: {
    country_code: 'US',
    country_name_ar: 'الولايات المتحدة الأمريكية',
    general_emergency: '911 (شرطة، إسعاف، ومطافئ لكافة الولايات)',
    police: '911',
    ambulance: '911',
    fire: '911',
    tourist_police: '911',
    arab_embassies: [
      {
        country_name_ar: 'سفارة السعودية - واشنطن',
        flag: '🇸🇦',
        phone: '+1 202 342 3800',
        emergency_hotline: '+1 202 746 0666',
        address_ar: '601 New Hampshire Ave NW, Washington, DC 20037'
      },
      {
        country_name_ar: 'سفارة الإمارات - واشنطن',
        flag: '🇦🇪',
        phone: '+1 202 243 2400',
        emergency_hotline: '+1 202 669 4976',
        address_ar: '3522 International Ct NW, Washington, DC 20008'
      },
      {
        country_name_ar: 'سفارة الكويت - واشنطن',
        flag: '🇰🇼',
        phone: '+1 202 966 0702',
        emergency_hotline: '+1 202 262 0758',
        address_ar: '2940 Tilden St NW, Washington, DC 20008'
      }
    ],
    health_and_insurance_rules_ar: 'تكاليف العلاج في الولايات المتحدة هي الأعلى عالمياً؛ نقل الإسعاف وحده قد يكلف 2000 إلى 5000 دولار، ويوم العناية المركزة يتجاوز 15,000 دولار. تأمين سفر شامل بتغطية لا تقل عن 100,000 دولار هو أمر حيوي ولا غنى عنه.',
    restricted_medications_ar: [
      'هيئة الغذاء والدواء الأمريكية (FDA) والجمارك (CBP) تشترط أن تكون كافة الأدوية في عبواتها الأصلية وعليها وصفة الطبيب باللغة الإنجليزية باسمك المطابق لجواز السفر.',
      'الكمية القصوى المسموح بإدخالها هي ما يكفي لـ 90 يوماً فقط، ويحظر إدخال أي أدوية غير معتمدة من FDA.'
    ]
  },

  MY: {
    country_code: 'MY',
    country_name_ar: 'ماليزيا',
    general_emergency: '999 (مركز الطوارئ الموحد)',
    police: '999',
    ambulance: '999',
    fire: '994',
    tourist_police: '+60 3 2149 6590 (شرطة السياحة بكوالالمبور)',
    arab_embassies: [
      {
        country_name_ar: 'سفارة السعودية - كوالالمبور',
        flag: '🇸🇦',
        phone: '+60 3 4257 9433',
        emergency_hotline: '+60 11 1555 8888',
        address_ar: '4th Floor, Wisma Chinese Chamber, Jalan Ampang, Kuala Lumpur'
      },
      {
        country_name_ar: 'سفارة الإمارات - كوالالمبور',
        flag: '🇦🇪',
        phone: '+60 3 4256 2200',
        emergency_hotline: '+60 17 200 0000',
        address_ar: '1 Gerling House, Jalan Ampang, Kuala Lumpur'
      }
    ],
    health_and_insurance_rules_ar: 'المستشفيات الخاصة في ماليزيا (مثل مستشفى جلينيجلز Gleneagles وبكوالالمبور وPrince Court) من أرقى مراكز السياحة العلاجية في آسيا وتوفر مترجمين للغة العربية وأسعارا معقولة مقارنة بأوروبا.',
    restricted_medications_ar: [
      'قوانين المخدرات والمؤثرات العقلية في ماليزيا صارمة جداً؛ احرص على حمل الروشتة الطبية بالإنجليزية لأي عقاقير مهدئة.',
      'يحظر استيراد أو حيازة أي سجائر إلكترونية في بعض الولايات الماليزية.'
    ]
  },

  TH: {
    country_code: 'TH',
    country_name_ar: 'تايلاند',
    general_emergency: '191 (شرطة) / 1669 (إسعاف) / 1155 (شرطة السياحة المعتمدة)',
    police: '191',
    ambulance: '1669',
    fire: '199',
    tourist_police: '1155 (خط ساخن مخصص للسياح يتحدث الإنجليزية 24/7)',
    arab_embassies: [
      {
        country_name_ar: 'سفارة السعودية - بانكوك',
        flag: '🇸🇦',
        phone: '+66 2 639 2999',
        emergency_hotline: '+66 81 846 0000',
        address_ar: '82 Sathorn North Road, Bangrak, Bangkok'
      },
      {
        country_name_ar: 'سفارة الإمارات - بانكوك',
        flag: '🇦🇪',
        phone: '+66 2 400 9800',
        emergency_hotline: '+66 81 900 0000',
        address_ar: 'Sathorn City Tower, Bangkok'
      },
      {
        country_name_ar: 'سفارة الكويت - بانكوك',
        flag: '🇰🇼',
        phone: '+66 2 636 6600',
        emergency_hotline: '+66 81 833 0000',
        address_ar: 'Sathorn Thani Building, Bangkok'
      }
    ],
    health_and_insurance_rules_ar: 'المستشفيات التايلاندية الخاصة (مثل مستشفى بومرونجراد الدولي Bumrungrad ومستشفى بانكوك Bangkok Hospital) توفر أجنحة طبية كاملة للزوار العرب وتتعامل مع أغلب شركات التأمين الخليجية والعالمية.',
    restricted_medications_ar: [
      'الأدوية المحتوية على إيفيدرين أو سودوإيفيدرين أو كوديين تخضع لتنظيمات إدارة الغذاء والدواء التايلاندية (Thai FDA) وتتطلب إذناً وتصريحاً إلكترونياً مسبقاً إذا كانت الكمية لأكثر من 30 يوماً.',
      'السجائر الإلكترونية والفيب (Vapes) محظورة تماماً في تايلاند ومصادرتها يصاحبها غرامات باهظة أو احتجاز.'
    ]
  },

  AE: {
    country_code: 'AE',
    country_name_ar: 'الإمارات العربية المتحدة',
    general_emergency: '999 (شرطة) / 998 (إسعاف) / 997 (دفاع مدني)',
    police: '999',
    ambulance: '998',
    fire: '997',
    tourist_police: '901 (استفسارات الشرطة غير الطارئة) أو تطبيق دبي للشرطة',
    arab_embassies: [
      {
        country_name_ar: 'سفارة السعودية - أبوظبي',
        flag: '🇸🇦',
        phone: '+971 2 444 5700',
        emergency_hotline: '+971 50 644 4444',
        address_ar: 'منطقة السفارات، أبوظبي'
      },
      {
        country_name_ar: 'سفارة مصر - أبوظبي',
        flag: '🇪🇬',
        phone: '+971 2 444 5566',
        emergency_hotline: '+971 50 123 4567',
        address_ar: 'منطقة السفارات، أبوظبي'
      },
      {
        country_name_ar: 'سفارة الكويت - أبوظبي',
        flag: '🇰🇼',
        phone: '+971 2 447 7144',
        emergency_hotline: '+971 50 888 8888',
        address_ar: 'أبوظبي'
      }
    ],
    health_and_insurance_rules_ar: 'المنظومة الصحية في الإمارات فائقة الحداثة والرقمنة. يحصل الزائر على رعاية فورية في طوارئ المستشفيات الحكومية والخاصة مع سريان وثيقة تأمين السفر الصادرة مع تأشيرة الدخول.',
    restricted_medications_ar: [
      'وزارة الصحة ووقاية المجتمع (MOHAP) تتيح خدمة إلكترونية مجانية لفسح الأدوية المقيدة للمسافرين القادمين قبل الرحلة بدقائق عبر موقعها الإلكتروني.',
      'أحضر دائماً الوصفة الطبية الأصلية لأي أدوية مهدئة أو مسكنات أعصاب.'
    ]
  },

  SA: {
    country_code: 'SA',
    country_name_ar: 'المملكة العربية السعودية',
    general_emergency: '911 (المركز الوطني للعمليات الأمنية الموحد بمكة والرياض والشرقية)',
    police: '999 أو 911',
    ambulance: '997 (الهلال الأحمر السعودي)',
    fire: '998',
    tourist_police: '930 (مركز الاتصال السياحي الموحد 24/7)',
    arab_embassies: [
      {
        country_name_ar: 'سفارة الإمارات - الرياض',
        flag: '🇦🇪',
        phone: '+966 11 488 1100',
        emergency_hotline: '+966 50 000 0000',
        address_ar: 'حي السفارات، الرياض'
      },
      {
        country_name_ar: 'سفارة مصر - الرياض',
        flag: '🇪🇬',
        phone: '+966 11 481 0464',
        emergency_hotline: '+966 50 200 0000',
        address_ar: 'حي السفارات، الرياض'
      },
      {
        country_name_ar: 'سفارة الكويت - الرياض',
        flag: '🇰🇼',
        phone: '+966 11 488 3500',
        emergency_hotline: '+966 50 300 0000',
        address_ar: 'حي السفارات، الرياض'
      }
    ],
    health_and_insurance_rules_ar: 'تأشيرات الزيارة والسياحة والعمرة تشمل تأميناً طبياً معتمداً من مجلس الضمان الصحي (CCHI) يغطي الحالات الطارئة والعلاج في شبكة واسعة من المستشفيات والمراكز الطبية الخاصة والحكومية بالمملكة.',
    restricted_medications_ar: [
      'الهيئة العامة للغذاء والدواء (SFDA) تمنع إدخال المواد المخدرة الخاضعة للرقابة دون تقرير طبي رسمي ومختوم باللغة العربية أو الإنجليزية.',
      'يسمح بالأدوية الشخصية المزمنة لمدة لا تزيد عن 30 يوماً أو مدة الإقامة أيهما أقل.'
    ]
  }
};


export const MULTILINGUAL_SOS_CARDS: MultiLingualSosPhrase[] = [
  {
    id: 'sos-medical',
    category: 'medical',
    icon: '🚑',
    phrase_ar: 'أنا بحاجة لمساعدة طبية عاجلة جداً! أرجو الاتصال بالإسعاف أو نقلي لأقرب مستشفى.',
    translations: {
      en: 'I need urgent medical assistance! Please call an ambulance or take me to the nearest hospital immediately.',
      fr: 'J\'ai besoin d\'une assistance médicale urgente ! Veuillez appeler une ambulance ou m\'emmener à l\'hôpital le plus proche immédiatement.',
      tr: 'Acil tıbbi yardıma ihtiyacım var! Lütfen hemen bir ambulans çağırın veya beni en yakın hastaneye götürün.',
      ja: '至急、医療支援が必要です！すぐに救急車を呼ぶか、最寄りの病院へ連れて行ってください。',
      ru: 'Мне срочно нужна медицинская помощь! Пожалуйста, вызовите скорую помощь или отвезите меня в ближайшую больницу.',
      es: '¡Necesito asistencia médica urgente! Por favor, llame a una ambulancia o lléveme al hospital más cercano de inmediato.'
    }
  },
  {
    id: 'sos-halal-allergy',
    category: 'halal',
    icon: '🥩',
    phrase_ar: 'أنا مسلم؛ لا أتناول لحم الخنزير أو مشتقاته أو أي طعام مطبوخ بالكحول إطلاقاً.',
    translations: {
      en: 'I am Muslim. I strictly do not eat pork, pork gelatin, or any food cooked with alcohol or wine.',
      fr: 'Je suis musulman. Je ne consomme strictement aucun porc, gélatine de porc, ni aliments préparés avec de l\'alcool ou du vin.',
      tr: 'Ben Müslümanım. Kesinlikle domuz eti, domuz jelatini veya alkolle pişirilmiş yiyecekler tüketmiyorum.',
      ja: '私はイスラム教徒です。豚肉、豚ゼラチン、アルコールやみりんを使った料理は一切食べられません。',
      ru: 'Я мусульманин. Я строго не употребляю свинину, свиной желатин или любую пищу, приготовленную с алкоголем.',
      es: 'Soy musulmán. No como carne de cerdo, gelatina de cerdo ni ningún alimento cocinado con alcohol.'
    }
  },
  {
    id: 'sos-lost-passport',
    category: 'passport',
    icon: '🛂',
    phrase_ar: 'لقد فقدت جواز سفري ومحفظتي. أحتاج للوصول إلى أقرب مركز شرطة أو سفارتي لإصدار وثيقة مرور.',
    translations: {
      en: 'I have lost my passport and wallet. I need to reach the nearest police station or my embassy immediately.',
      fr: 'J\'ai perdu mon passeport et mon portefeuille. Je dois me rendre au commissariat de police le plus proche ou à mon ambassade.',
      tr: 'Pasaportumu ve cüzdanımı kaybettim. En yakın polis karakoluna veya elçiliğime ulaşmam gerekiyor.',
      ja: 'パスポートと財布を紛失しました。最寄りの警察署か大使館へ行く必要があります。',
      ru: 'Я потерял паспорт и кошелек. Мне нужно немедленно добраться до ближайшего полицейского участка или посольства.',
      es: 'He perdido mi pasaporte y mi billetera. Necesito ir a la comisaría de policía más cercana o a mi embajada.'
    }
  },
  {
    id: 'sos-taxi-hotel',
    category: 'transport',
    icon: '🚕',
    phrase_ar: 'من فضلك، أوصلني إلى عنوان الفندق المكتوب هنا عبر المسار الأسرع وبالمتر/العداد الرسمي.',
    translations: {
      en: 'Please take me to the hotel address shown here using the fastest route and the official taximeter.',
      fr: 'Veuillez m\'emmener à l\'adresse de l\'hôtel indiquée ici en empruntant l\'itinéraire le plus rapide avec le taximètre officiel.',
      tr: 'Lütfen beni burada yazılı olan otel adresine en hızlı güzergahtan ve taksimetreyi açarak götürün.',
      ja: 'ここに記載されているホテルの住所まで、メーターを使って一番早いルートで連れて行ってください。',
      ru: 'Пожалуйста, отвезите меня по указанному адресу отеля самым быстрым маршрутом по счетчику.',
      es: 'Por favor, lléveme a la dirección del hotel indicada aquí por la ruta más rápida y con el taxímetro oficial.'
    }
  },
  {
    id: 'sos-pharmacy',
    category: 'medical',
    icon: '💊',
    phrase_ar: 'أين أجد أقرب صيدلية مفتوحة الآن؟ أنا بحاجة لشراء دواء ضروري.',
    translations: {
      en: 'Where can I find the nearest open pharmacy right now? I need to purchase urgent medication.',
      fr: 'Où puis-je trouver la pharmacie de garde la plus proche ? J\'ai besoin d\'acheter un médicament urgent.',
      tr: 'Şu an en yakın nöbetçi eczaneyi nerede bulabilirim? Acil bir ilaç almam gerekiyor.',
      ja: '今、一番近くで開いている薬局はどこですか？緊急で薬を購入する必要があります。',
      ru: 'Где находится ближайшая открытая аптека прямо сейчас? Мне нужно купить срочное лекарство.',
      es: '¿Dónde puedo encontrar la farmacia de guardia más cercana? Necesito comprar un medicamento urgente.'
    }
  }
];
