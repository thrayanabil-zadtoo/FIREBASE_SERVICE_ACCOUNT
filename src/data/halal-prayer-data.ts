export interface HalalGuideEntry {
  country_code: string;
  country_name_ar: string;
  flag: string;
  halal_status_summary_ar: string;
  halal_certification_bodies: string[];
  halal_friendly_districts: Array<{
    city_ar: string;
    neighborhood_ar: string;
    highlights_ar: string;
  }>;
  iconic_mosques: Array<{
    name_ar: string;
    name_local: string;
    city_ar: string;
    nearest_metro_or_transit: string;
    historical_note_ar: string;
    has_jummah_prayer: boolean;
  }>;
  supermarket_halal_chains: string[];
  prayer_advisory: {
    qibla_direction_summary: string;
    high_latitude_note?: string;
    airport_prayer_rooms: string[];
  };
}

export const HALAL_PRAYER_DATA: Record<string, HalalGuideEntry> = {
  GB: {
    country_code: 'GB',
    country_name_ar: 'المملكة المتحدة (بريطانيا)',
    flag: '🇬🇧',
    halal_status_summary_ar: 'من أسهل الدول الأوروبية للمسافر المسلم؛ آلاف المطاعم الحلال المعتمدة ومصليات مجهزة في كبرى المراكز التجارية والمطارات.',
    halal_certification_bodies: [
      'Halal Food Authority (HFA)',
      'Halal Monitoring Committee (HMC)',
      'Muslim Council of Britain'
    ],
    halal_friendly_districts: [
      { city_ar: 'لندن', neighborhood_ar: 'إدجوير رود (Edgware Road) والمايفير', highlights_ar: 'الشارع العربي الشهير، عشرات المطاعم اللبنانية والخليجية والمصرية والمقاهي الحلال بالكامل.' },
      { city_ar: 'لندن', neighborhood_ar: 'وايت تشابل وإيست لندن (Whitechapel)', highlights_ar: 'أكبر تجمع للمجتمع المسلم ومطاعم المطبخ البنغالي والباكستاني والشرق أوسطي.' },
      { city_ar: 'مانشستر', neighborhood_ar: 'شارع الكاري والمطاعم (Wilmslow Road / Rusholme)', highlights_ar: 'أطول سلسلة مطاعم حلال ومشاوي وبوفيهات عربية وهندية مفتوحة حتى الفجر.' }
    ],
    iconic_mosques: [
      {
        name_ar: 'مسجد ريجنتس بارك (المركز الثقافي الإسلامي بلندن)',
        name_local: 'London Central Mosque (Regent’s Park)',
        city_ar: 'لندن',
        nearest_metro_or_transit: 'محطة Baker Street أو St John’s Wood (خطوط Jubilee / Bakerloo)',
        historical_note_ar: 'شيد بأرض أهداها الملك جورج السادس للمسلمين عام 1944 وتتوسطه قبة ذهبية شامخة ومكتبة إسلامية ضخمة.',
        has_jummah_prayer: true
      },
      {
        name_ar: 'مسجد شرق لندن التاريخي',
        name_local: 'East London Mosque & London Muslim Centre',
        city_ar: 'لندن',
        nearest_metro_or_transit: 'محطة Aldgate East أو Whitechapel',
        historical_note_ar: 'من أكبر مساجد أوروبا، يرفع الأذان عبر مكبرات الصوت ويتسع لأكثر من 7,000 مصلٍ.',
        has_jummah_prayer: true
      }
    ],
    supermarket_halal_chains: [
      'سلاسل كبرى توفر أجنحة حلال معتمدة: Tesco, Sainsbury’s, Asda, Waitrose',
      'سلاسل لحوم حلال متخصصة: Tariq Halal Meats, Green Valley Market (Edgware Road)'
    ],
    prayer_advisory: {
      qibla_direction_summary: 'جنوب شرق (حوالي 118 درجة من الشمال في لندن)',
      high_latitude_note: 'في فصل الصيف يطول النهار جداً (الفجر يبدأ قرابة 2:45 صباحاً والعشاء يقارب 10:30 مساءً)، بينما في الشتاء يقصر الوقت جداً.',
      airport_prayer_rooms: ['مطار لندن هيثرو (غرف صلاة متعددة في كل الصالات T2, T3, T4, T5 مع أماكن وضوء)', 'مطار غاتويك']
    }
  },

  TR: {
    country_code: 'TR',
    country_name_ar: 'تركيا',
    flag: '🇹🇷',
    halal_status_summary_ar: 'دولة إسلامية كافة اللحوم والأطعمة فيها حلال 100%، وتنتشر المساجد والمآذن التاريخية في كل شارع وحارة.',
    halal_certification_bodies: [
      'رئاسة الشؤون الدينية التركية (Diyanet)',
      'مؤسسة اعتماد الحلال التركية (HAK)'
    ],
    halal_friendly_districts: [
      { city_ar: 'إسطنبول', neighborhood_ar: 'حي الفاتح وباشاك شهير', highlights_ar: 'قلب الحضارة الإسلامية والمطاعم اليمنية والشامية والعراقية والتركية العريقة بدون أي شوائب.' },
      { city_ar: 'إسطنبول', neighborhood_ar: 'السلطان أحمد وإمينونو', highlights_ar: 'المطاعم العثمانية التقليدية ومحلات الحلقوم والبقلاوة التركية الفاخرة المعتمدة.' }
    ],
    iconic_mosques: [
      {
        name_ar: 'جامع آيا صوفيا الكبير',
        name_local: 'Ayasofya-i Kebir Cami-i Şerifi',
        city_ar: 'إسطنبول',
        nearest_metro_or_transit: 'محطة ترام Sultanahmet (خط T1)',
        historical_note_ar: 'تحفة العمارة العالمية ورمز فتح القسطنطينية على يد السلطان محمد الفاتح عام 1453م.',
        has_jummah_prayer: true
      },
      {
        name_ar: 'جامع السليمانية المعماري الشامخ',
        name_local: 'Süleymaniye Camii',
        city_ar: 'إسطنبول',
        nearest_metro_or_transit: 'محطة مترو Vezneciler (خط M2)',
        historical_note_ar: 'أعظم إبداعات المعمار سنان في عهد السلطان سليمان القانوني على التلة الثالثة بإطلالة خيالية على القرن الذهبي والبوسفور.',
        has_jummah_prayer: true
      },
      {
        name_ar: 'جامع تشامليجا الكبير (أكبر جامع في تركيا والبلقان)',
        name_local: 'Büyük Çamlıca Camii',
        city_ar: 'إسطنبول (الجانب الآسيوي)',
        nearest_metro_or_transit: 'تلة تشامليجا في أسكودار',
        historical_note_ar: 'صرح إسلامي حديث بمآذنه الست وقبته الشاهقة يتسع لـ 63 ألف مصلٍ.',
        has_jummah_prayer: true
      }
    ],
    supermarket_halal_chains: [
      'جميع سلاسل السوبرماركت في تركيا حلال 100%: BIM, A101, ŞOK, Migros, CarrefourSA'
    ],
    prayer_advisory: {
      qibla_direction_summary: 'جنوب - جنوب شرق (حوالي 151 درجة في إسطنبول)',
      airport_prayer_rooms: ['مطار إسطنبول الدولي الجديد (مسجد علي كوشو الضخم ومصليات متعددة بكل بوابة)', 'مطار صبيحة غوكشن']
    }
  },

  FR: {
    country_code: 'FR',
    country_name_ar: 'فرنسا',
    flag: '🇫🇷',
    halal_status_summary_ar: 'تضم أكبر جالية مسلمة في أوروبا الغربية (أكثر من 6 ملايين مسلم)، مع انتشار كثيف للمطاعم المغاربية والتركية والفرنسية الحلال.',
    halal_certification_bodies: [
      'مسجد باريس الكبير (Grande Mosquée de Paris)',
      'جمعية AVS لمراقبة الأطعمة الحلال (A Votre Service)',
      'مسجد ليون ومسجد إيفري'
    ],
    halal_friendly_districts: [
      { city_ar: 'باريس', neighborhood_ar: 'الدائرة الخامسة (Quartier Latin)', highlights_ar: 'محيط مسجد باريس الكبير وحديقته الأندلسية وشاي النعناع والحلويات المغربية.' },
      { city_ar: 'باريس', neighborhood_ar: 'باربيس وبلفيل (Barbes & Belleville)', highlights_ar: 'أسواق التوابل والمطاعم الحلال الجزائرية والتونسية والسنغالية.' },
      { city_ar: 'مرسيليا', neighborhood_ar: 'منطقة نواي (Noailles) والميناء القديم', highlights_ar: 'أغلبية المطاعم والأسواق تقدم طعاماً حلالاً ومأكولات بحرية طازجة.' }
    ],
    iconic_mosques: [
      {
        name_ar: 'مسجد باريس الكبير (الجامع الكبير)',
        name_local: 'Grande Mosquée de Paris',
        city_ar: 'باريس',
        nearest_metro_or_transit: 'محطة Place Monge أو Censier - Daubenton (خط 7)',
        historical_note_ar: 'بني عام 1926 على النمط المعماري الأندلسي المغربي تكريماً لجنود شمال إفريقيا المسلمين، ويضم باحة فناء رخامية ومئذنة أندلسية بديعة.',
        has_jummah_prayer: true
      }
    ],
    supermarket_halal_chains: [
      'أقسام متخصصة للحلال في Auchan, Carrefour, Monoprix (علامات ريجيا، زكي، والجزيرة)',
      'محلات قصابة إسلامية متخصصة في كل ضواحي باريس'
    ],
    prayer_advisory: {
      qibla_direction_summary: 'جنوب شرق (حوالي 120 درجة في باريس)',
      high_latitude_note: 'مراعاة فروق التوقيت الصيفي عند تحديد صلاة العشاء والفجر.',
      airport_prayer_rooms: ['مطار باريس شارل ديغول (CDG صالة 2E و 2F توجد مصليات مشتركة هادئة)', 'مطار أورلي']
    }
  },

  JP: {
    country_code: 'JP',
    country_name_ar: 'اليابان',
    flag: '🇯🇵',
    halal_status_summary_ar: 'اليابان تشهد ثورة ترحيبية بالمسلمين والسياح الخليجيين؛ مئات المطاعم الحلال المتخصصة، وخيارات السوشي النباتي والبحري، وتطبيقات ذكية يابانية للحلال.',
    halal_certification_bodies: [
      'Japan Muslim Association (JMA)',
      'Japan Halal Association (JHA)',
      'Nippon Asia Halal Association (NAHA)'
    ],
    halal_friendly_districts: [
      { city_ar: 'طوكيو', neighborhood_ar: 'شينجوكو وروبونجي وشيبويا', highlights_ar: 'مطاعم رامن حلال معتمدة ومطاعم واغيو ياباني حلال مشوي ومطاعم تركية وهندية.' },
      { city_ar: 'طوكيو', neighborhood_ar: 'أسكوسا (Asakusa)', highlights_ar: 'مركز السياحة التراثية، يوفر مطاعم تيمبورا وسوشي حلال بجوار معبد سينسوجي.' },
      { city_ar: 'أوساكا', neighborhood_ar: 'نامبا ودوتونبوري', highlights_ar: 'مطاعم تاكوياكي ورامن حلال معتمد ومصليات بالمركز التجاري.' }
    ],
    iconic_mosques: [
      {
        name_ar: 'مسجد طوكيو والمركز الثقافي التركي (جامع طوكيو)',
        name_local: 'Tokyo Camii & Diyanet Turkish Culture Center',
        city_ar: 'طوكيو',
        nearest_metro_or_transit: 'محطة Yoyogi-Uehara (خط Chiyoda أو Odakyu Line)',
        historical_note_ar: 'أجمل صرح عثماني في شرق آسيا، بنته الجالية التترية والتركية عام 1938، ويعتبر تحفة فنية ومعمارية يقصدها آلاف الزوار يومياً.',
        has_jummah_prayer: true
      },
      {
        name_ar: 'مسجد كوبي التاريخي',
        name_local: 'Kobe Muslim Mosque',
        city_ar: 'كوبي (قرب أوساكا)',
        nearest_metro_or_transit: 'محطة Sannomiya أو Motomachi',
        historical_note_ar: 'أول وأقدم مسجد بني في اليابان عام 1935م، وصمد بأعجوبة أمام الحرب العالمية الثانية وزلزال هانشين العنيف.',
        has_jummah_prayer: true
      }
    ],
    supermarket_halal_chains: [
      'بقالات Gyomu Super (سلسلة شهيرة تنتشر في كافة مدن اليابان توفر رفوف أطعمة حلال معتمدة بأسعار رخيصة)',
      'سلاسل السوشي الشهيرة (Kura Sushi / Sushiro) تقدم أطباق أسماك طازجة خالية من الكحول ومشتقات الخنزير'
    ],
    prayer_advisory: {
      qibla_direction_summary: 'غرب - شمال غرب (حوالي 293 درجة في طوكيو)',
      airport_prayer_rooms: ['مطار طوكيو هانيدا (صالات الصلاة مجهزة بالكامل بالصالات الدولية T3)', 'مطار ناريتا الدولي', 'مطار كانساي بأوساكا']
    }
  },

  UZ: {
    country_code: 'UZ',
    country_name_ar: 'جمهورية أوزبكستان',
    flag: '🇺🇿',
    halal_status_summary_ar: 'موطن الإمام البخاري والترمذي والسمرقندي؛ دولة إسلامية عريقة كل أطعمتها ولحومها وطبخاتها حلال 100%، مع رفع الأذان ومساجد تاريخية في كل ركن.',
    halal_certification_bodies: [
      'إدارة مسلمي أوزبكستان الرسمية (Muslim Board of Uzbekistan)'
    ],
    halal_friendly_districts: [
      { city_ar: 'طشقند', neighborhood_ar: 'محيط بازار تشورسو ومجمع حضرة إمام', highlights_ar: 'أشهى أطباق البلوف الأوزبكي باللحم والزبيب والسمبوسة في التنانير الطينية.' },
      { city_ar: 'سمرقند', neighborhood_ar: 'محيط ريجستان وشاه زنده', highlights_ar: 'مطاعم التراث الأوزبكي والشاي الأخضر بالفستق واللحوم المشوية الحلال بالكامل.' }
    ],
    iconic_mosques: [
      {
        name_ar: 'مسجد بيبي خانوم التاريخي العظيم',
        name_local: 'Bibi-Khanym Mosque',
        city_ar: 'سمرقند',
        nearest_metro_or_transit: 'ميدان ريجستان التاريخي',
        historical_note_ar: 'شيده القائد تيمورلنك في القرن الرابع عشر ليكون أعظم مسجد في العالم الإسلامي بقبته الفيروزية الهائلة.',
        has_jummah_prayer: true
      },
      {
        name_ar: 'مجمع حضرة إمام ومسجد تيل الشيخ',
        name_local: 'Hazrati Imam Complex',
        city_ar: 'طشقند',
        nearest_metro_or_transit: 'محطة مترو Gafur Gulom',
        historical_note_ar: 'المقر الديني لعلماء أوزبكستان ويحفظ في خزانته مصحف عثمان بن عفان رضي الله عنه المكتوب على جلد الغزال.',
        has_jummah_prayer: true
      }
    ],
    supermarket_halal_chains: [
      'جميع الأطعمة والمتاجر في أوزبكستان حلال بالكامل: Korzinka, Makro, بازار تشورسو'
    ],
    prayer_advisory: {
      qibla_direction_summary: 'جنوب غرب (حوالي 240 درجة في طشقند وسمرقند)',
      airport_prayer_rooms: ['مطار طشقند الدولي (TAS)', 'مطار سمرقند الدولي (SKD)']
    }
  },

  MV: {
    country_code: 'MV',
    country_name_ar: 'جمهورية المالديف',
    flag: '🇲🇻',
    halal_status_summary_ar: 'دولة إسلامية بنسبة 100% دستورياً، كافة الأطعمة واللحوم في العاصمة مالي والجزر المحلية حلال بالكامل بدون استثناء.',
    halal_certification_bodies: [
      'وزارة الشؤون الإسلامية المالديفية (Ministry of Islamic Affairs)'
    ],
    halal_friendly_districts: [
      { city_ar: 'مالي', neighborhood_ar: 'الكورنيش البحري والمركز الإسلامي', highlights_ar: 'مطاعم المأكولات البحرية الطازجة والمطابخ الآسيوية والعربية الحلال 100%.' },
      { city_ar: 'الجزر والمنتجعات', neighborhood_ar: 'الفلل والمنتجعات الفاخرة', highlights_ar: 'توفر كافة المنتجعات العالمية أطعمة ولحوماً حلالاً معتمدة، مع خصوصية تامة للعائلات المحافظة بالفلل المائية.' }
    ],
    iconic_mosques: [
      {
        name_ar: 'مسجد السلطان محمد تكرفان (المركز الإسلامي بمالي)',
        name_local: 'Malé Islamic Centre (Grand Friday Mosque)',
        city_ar: 'مالي',
        nearest_metro_or_transit: 'شارع Medhuziyaraiy Magu مقابل الميناء',
        historical_note_ar: 'المسجد الأكبر بالمالديف بقبته الذهبية الرائعة ومئذنته البارزة التي تستقبل الزوار من الميناء.',
        has_jummah_prayer: true
      },
      {
        name_ar: 'مسجد الجمعة القديم من المرجان المنحوت (هوكورو ميسكيي)',
        name_local: 'Malé Hukuru Miskiy (Old Friday Mosque)',
        city_ar: 'مالي',
        nearest_metro_or_transit: 'وسط مدينة مالي القديمة',
        historical_note_ar: 'بني عام 1656م بالكامل من صخور الشعب المرجانية البيضاء المنحوتة بنقوش قرآنية معقدة وهو مرشح لليونسكو.',
        has_jummah_prayer: true
      }
    ],
    supermarket_halal_chains: [
      'كل المتاجر في المالديف حلال بالكامل: STO People’s Choice, Agora Supermarket'
    ],
    prayer_advisory: {
      qibla_direction_summary: 'شمال غرب (حوالي 305 درجات باتجاه مكة المكرمة)',
      airport_prayer_rooms: ['مطار فيلانا الدولي بمالي (MLE - مصليات مكيفة بالصالات الداخلية والدولية)']
    }
  }
};
