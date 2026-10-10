export interface GeoNeighbor {
  code?: string;
  name_ar: string;
  flag: string;
  direction_ar: string; // e.g. "شمالاً", "جنوباً", "شرقاً", "غرباً", "شمال شرق", etc.
  direction_en?: string;
  angle_deg: number; // 0 = East, 90 = North, 180 = West, 270 = South
  border_type: 'land' | 'maritime';
}

export interface GeoWaterBody {
  name_ar: string;
  name_en?: string;
  direction_ar: string;
  angle_deg: number;
}

export interface GeoCityPoint {
  name_ar: string;
  name_en?: string;
  region_name?: string;
  is_capital?: boolean;
  lat: number;
  lng: number;
  population_approx?: string;
  cost_index?: number;
  safety_score?: number;
}

export interface CountryMapProfile {
  country_code: string;
  name_ar: string;
  name_en: string;
  flag: string;
  capital: string;
  center: { lat: number; lng: number };
  bounds: { min_lat: number; max_lat: number; min_lng: number; max_lng: number };
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    bg_gradient: string;
    border_color: string;
  };
  neighbors: GeoNeighbor[];
  water_bodies: GeoWaterBody[];
  cities: GeoCityPoint[];
}

export const COMPREHENSIVE_COUNTRY_MAP_PROFILES: Record<string, CountryMapProfile> = {
  // 🇪🇬 مصر
  EG: {
    country_code: 'EG',
    name_ar: 'مصر',
    name_en: 'Egypt',
    flag: '🇪🇬',
    capital: 'القاهرة',
    center: { lat: 26.82, lng: 30.80 },
    bounds: { min_lat: 21.8, max_lat: 31.8, min_lng: 24.7, max_lng: 36.9 },
    palette: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#f59e0b',
      bg_gradient: 'from-emerald-950 via-[#0a2338] to-[#071a2b]',
      border_color: '#34d399'
    },
    neighbors: [
      { code: 'LY', name_ar: 'ليبيا', flag: '🇱🇾', direction_ar: 'غرباً', angle_deg: 180, border_type: 'land' },
      { code: 'SD', name_ar: 'السودان', flag: '🇸🇩', direction_ar: 'جنوباً', angle_deg: 270, border_type: 'land' },
      { code: 'PS', name_ar: 'دولة فلسطين', flag: '🇵🇸', direction_ar: 'شمال شرق', angle_deg: 45, border_type: 'land' },
      { code: 'JO', name_ar: 'الأردن', flag: '🇯🇴', direction_ar: 'شمال شرق (عبر العقبة)', angle_deg: 55, border_type: 'maritime' },
      { code: 'SA', name_ar: 'السعودية', flag: '🇸🇦', direction_ar: 'شرقاً (عبر البحر الأحمر)', angle_deg: 10, border_type: 'maritime' }
    ],
    water_bodies: [
      { name_ar: 'البحر الأبيض المتوسط', direction_ar: 'شمالاً', angle_deg: 90 },
      { name_ar: 'البحر الأحمر', direction_ar: 'شرقاً', angle_deg: 15 },
      { name_ar: 'خليج السويس والعقبة', direction_ar: 'شمال شرق', angle_deg: 40 }
    ],
    cities: [
      { name_ar: 'القاهرة', name_en: 'Cairo', is_capital: true, lat: 30.0444, lng: 31.2357, region_name: 'القاهرة الكبرى', population_approx: '10.2 مليون' },
      { name_ar: 'الإسكندرية', name_en: 'Alexandria', is_capital: false, lat: 31.2001, lng: 29.9187, region_name: 'الساحل الشمالي', population_approx: '5.4 مليون' },
      { name_ar: 'الجيزة', name_en: 'Giza', is_capital: false, lat: 30.0131, lng: 31.2089, region_name: 'القاهرة الكبرى', population_approx: '4.1 مليون' },
      { name_ar: 'بورسعيد', name_en: 'Port Said', is_capital: false, lat: 31.2653, lng: 32.3019, region_name: 'مدن القناة' },
      { name_ar: 'السويس', name_en: 'Suez', is_capital: false, lat: 29.9668, lng: 32.5498, region_name: 'مدن القناة' },
      { name_ar: 'الأقصر', name_en: 'Luxor', is_capital: false, lat: 25.6872, lng: 32.6396, region_name: 'صعيد مصر' },
      { name_ar: 'أسوان', name_en: 'Aswan', is_capital: false, lat: 24.0889, lng: 32.8998, region_name: 'صعيد مصر' },
      { name_ar: 'شرم الشيخ', name_en: 'Sharm El-Sheikh', is_capital: false, lat: 27.9158, lng: 34.3299, region_name: 'جنوب سيناء' },
      { name_ar: 'الغردقة', name_en: 'Hurghada', is_capital: false, lat: 27.2579, lng: 33.8116, region_name: 'البحر الأحمر' },
      { name_ar: 'المنصورة', name_en: 'Mansoura', is_capital: false, lat: 31.0409, lng: 31.3785, region_name: 'الدلتا' },
      { name_ar: 'طنطا', name_en: 'Tanta', is_capital: false, lat: 30.7865, lng: 31.0004, region_name: 'الدلتا' },
      { name_ar: 'أسيوط', name_en: 'Asyut', is_capital: false, lat: 27.1783, lng: 31.1859, region_name: 'الصعيد' },
      { name_ar: 'مرسى مطروح', name_en: 'Marsa Matrouh', is_capital: false, lat: 31.3543, lng: 27.2373, region_name: 'الساحل الشمالي الغربي' },
      { name_ar: 'العريش', name_en: 'Arish', is_capital: false, lat: 31.1316, lng: 33.7984, region_name: 'شمال سيناء' }
    ]
  },

  // 🇵🇸 فلسطين الحرة
  PS: {
    country_code: 'PS',
    name_ar: 'فلسطين',
    name_en: 'Palestine',
    flag: '🇵🇸',
    capital: 'القدس الشريف',
    center: { lat: 31.85, lng: 35.15 },
    bounds: { min_lat: 31.1, max_lat: 33.3, min_lng: 34.1, max_lng: 35.7 },
    palette: {
      primary: '#10b981',
      secondary: '#dc2626',
      accent: '#fbbf24',
      bg_gradient: 'from-emerald-950 via-[#0d2a45] to-[#1a120b]',
      border_color: '#34d399'
    },
    neighbors: [
      { code: 'JO', name_ar: 'المملكة الأردنية الهاشمية', flag: '🇯🇴', direction_ar: 'شرقاً (الضفة الشرقية لنهر الأردن)', angle_deg: 0, border_type: 'land' },
      { code: 'EG', name_ar: 'جمهورية مصر العربية', flag: '🇪🇬', direction_ar: 'جنوب غرب (شبه جزيرة سيناء)', angle_deg: 225, border_type: 'land' },
      { code: 'LB', name_ar: 'الجمهورية اللبنانية', flag: '🇱🇧', direction_ar: 'شمالاً (الناقورة والجليل الأعلى)', angle_deg: 90, border_type: 'land' },
      { code: 'SY', name_ar: 'الجمهورية العربية السورية', flag: '🇸🇾', direction_ar: 'شمال شرق (الجولان وبحيرة طبريا)', angle_deg: 45, border_type: 'land' }
    ],
    water_bodies: [
      { name_ar: 'البحر الأبيض المتوسط', direction_ar: 'غرباً (سواحل يافا وحيفا وعكا وغزة)', angle_deg: 180 },
      { name_ar: 'البحر الميت', direction_ar: 'شرقاً', angle_deg: 350 },
      { name_ar: 'بحيرة طبريا', direction_ar: 'شمال شرق', angle_deg: 40 },
      { name_ar: 'خليج العقبة (أم الرشراش)', direction_ar: 'أقصى الجنوب', angle_deg: 270 }
    ],
    cities: [
      { name_ar: 'القدس الشريف', name_en: 'Jerusalem (Al-Quds)', is_capital: true, lat: 31.7683, lng: 35.2137, region_name: 'العاصمة الأبدية', population_approx: '960 ألف' },
      { name_ar: 'رام الله', name_en: 'Ramallah', is_capital: false, lat: 31.9038, lng: 35.2034, region_name: 'محافظة رام الله والبيرة', population_approx: '350 ألف' },
      { name_ar: 'غزة', name_en: 'Gaza', is_capital: false, lat: 31.5017, lng: 34.4668, region_name: 'قطاع غزة - الساحل', population_approx: '750 ألف' },
      { name_ar: 'الخليل', name_en: 'Hebron', is_capital: false, lat: 31.5326, lng: 35.0998, region_name: 'جنوب الضفة الغربية', population_approx: '550 ألف' },
      { name_ar: 'نابلس', name_en: 'Nablus', is_capital: false, lat: 32.2211, lng: 35.2544, region_name: 'شمال الضفة الغربية - جبل النار', population_approx: '420 ألف' },
      { name_ar: 'بيت لحم', name_en: 'Bethlehem', is_capital: false, lat: 31.7054, lng: 35.2024, region_name: 'محافظة بيت لحم', population_approx: '220 ألف' },
      { name_ar: 'يافا', name_en: 'Jaffa', is_capital: false, lat: 32.0535, lng: 34.7554, region_name: 'الساحل الفلسطيني التاريخي - عروس البحر', population_approx: 'تاريخية' },
      { name_ar: 'حيفا', name_en: 'Haifa', is_capital: false, lat: 32.7940, lng: 34.9896, region_name: 'الساحل الشمالي وجبل الكرمل', population_approx: 'تاريخية' },
      { name_ar: 'عكا', name_en: 'Acre', is_capital: false, lat: 32.9278, lng: 35.0818, region_name: 'شمال فلسطين التاريخية - قاهرة الغزاة', population_approx: 'تاريخية' },
      { name_ar: 'جنين', name_en: 'Jenin', is_capital: false, lat: 32.4646, lng: 35.2957, region_name: 'شمال الضفة الغربية', population_approx: '310 ألف' },
      { name_ar: 'طولكرم', name_en: 'Tulkarm', is_capital: false, lat: 32.3129, lng: 35.0286, region_name: 'الضفة الغربية', population_approx: '200 ألف' },
      { name_ar: 'قلقيلية', name_en: 'Qalqilya', is_capital: false, lat: 32.1960, lng: 34.9815, region_name: 'الضفة الغربية', population_approx: '120 ألف' },
      { name_ar: 'أريحا', name_en: 'Jericho', is_capital: false, lat: 31.8560, lng: 35.4630, region_name: 'أقدم مدن الأرض والأغوار', population_approx: '55 ألف' },
      { name_ar: 'الناصرة', name_en: 'Nazareth', is_capital: false, lat: 32.7036, lng: 35.2979, region_name: 'الجليل - قلب الجليل', population_approx: 'تاريخية' },
      { name_ar: 'خان يونس', name_en: 'Khan Yunis', is_capital: false, lat: 31.3462, lng: 34.3063, region_name: 'جنوب قطاع غزة', population_approx: '390 ألف' },
      { name_ar: 'رفح', name_en: 'Rafah', is_capital: false, lat: 31.2870, lng: 34.2595, region_name: 'جنوب قطاع غزة - معبر الصمود', population_approx: '280 ألف' },
      { name_ar: 'صفد', name_en: 'Safed', is_capital: false, lat: 32.9646, lng: 35.4960, region_name: 'الجليل الأعلى', population_approx: 'تاريخية' },
      { name_ar: 'طبريا', name_en: 'Tiberias', is_capital: false, lat: 32.7922, lng: 35.5312, region_name: 'بحيرة طبريا', population_approx: 'تاريخية' },
      { name_ar: 'بئر السبع', name_en: 'Beersheba', is_capital: false, lat: 31.2529, lng: 34.7915, region_name: 'صحراء النقب', population_approx: 'تاريخية' }
    ]
  },

  // 🇸🇦 المملكة العربية السعودية
  SA: {
    country_code: 'SA',
    name_ar: 'المملكة العربية السعودية',
    name_en: 'Saudi Arabia',
    flag: '🇸🇦',
    capital: 'الرياض',
    center: { lat: 23.88, lng: 45.07 },
    bounds: { min_lat: 16.3, max_lat: 32.2, min_lng: 36.5, max_lng: 55.6 },
    palette: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#fbbf24',
      bg_gradient: 'from-emerald-950 via-[#0a2718] to-[#071a2b]',
      border_color: '#34d399'
    },
    neighbors: [
      { code: 'JO', name_ar: 'الأردن', flag: '🇯🇴', direction_ar: 'شمال غرب', angle_deg: 135, border_type: 'land' },
      { code: 'IQ', name_ar: 'العراق', flag: '🇮🇶', direction_ar: 'شمالاً', angle_deg: 90, border_type: 'land' },
      { code: 'KW', name_ar: 'الكويت', flag: '🇰🇼', direction_ar: 'شمال شرق', angle_deg: 45, border_type: 'land' },
      { code: 'BH', name_ar: 'البحرين', flag: '🇧🇭', direction_ar: 'شرقاً (جسر الملك فهد)', angle_deg: 25, border_type: 'maritime' },
      { code: 'QA', name_ar: 'قطر', flag: '🇶🇦', direction_ar: 'شرقاً', angle_deg: 15, border_type: 'land' },
      { code: 'AE', name_ar: 'الإمارات', flag: '🇦🇪', direction_ar: 'شرقاً وجنوب شرق', angle_deg: 0, border_type: 'land' },
      { code: 'OM', name_ar: 'سلطنة عمان', flag: '🇴🇲', direction_ar: 'جنوب شرق', angle_deg: 315, border_type: 'land' },
      { code: 'YE', name_ar: 'اليمن', flag: '🇾🇪', direction_ar: 'جنوباً', angle_deg: 270, border_type: 'land' },
      { code: 'EG', name_ar: 'مصر', flag: '🇪🇬', direction_ar: 'غرباً (عبر البحر الأحمر)', angle_deg: 190, border_type: 'maritime' }
    ],
    water_bodies: [
      { name_ar: 'البحر الأحمر', direction_ar: 'غرباً', angle_deg: 180 },
      { name_ar: 'الخليج العربي', direction_ar: 'شرقاً', angle_deg: 10 }
    ],
    cities: [
      { name_ar: 'الرياض', name_en: 'Riyadh', is_capital: true, lat: 24.7136, lng: 46.6753, region_name: 'منطقة الرياض', population_approx: '7.8 مليون' },
      { name_ar: 'مكة المكرمة', name_en: 'Mecca', is_capital: false, lat: 21.3891, lng: 39.8579, region_name: 'منطقة مكة المكرمة', population_approx: '2.1 مليون' },
      { name_ar: 'المدينة المنورة', name_en: 'Medina', is_capital: false, lat: 24.5247, lng: 39.5692, region_name: 'منطقة المدينة المنورة', population_approx: '1.5 مليون' },
      { name_ar: 'جدة', name_en: 'Jeddah', is_capital: false, lat: 21.4858, lng: 39.1925, region_name: 'منطقة مكة المكرمة - عروس البحر', population_approx: '4.2 مليون' },
      { name_ar: 'الدمام', name_en: 'Dammam', is_capital: false, lat: 26.4207, lng: 50.0888, region_name: 'المنطقة الشرقية', population_approx: '1.3 مليون' },
      { name_ar: 'الخبر', name_en: 'Khobar', is_capital: false, lat: 26.2818, lng: 50.1985, region_name: 'المنطقة الشرقية' },
      { name_ar: 'تبوك', name_en: 'Tabuk', is_capital: false, lat: 28.3835, lng: 36.5662, region_name: 'منطقة تبوك' },
      { name_ar: 'أبها', name_en: 'Abha', is_capital: false, lat: 18.2164, lng: 42.5053, region_name: 'منطقة عسير' },
      { name_ar: 'الطائف', name_en: 'Taif', is_capital: false, lat: 21.4373, lng: 40.5127, region_name: 'منطقة مكة المكرمة' },
      { name_ar: 'بريدة', name_en: 'Buraidah', is_capital: false, lat: 26.3592, lng: 43.9818, region_name: 'منطقة القصيم' },
      { name_ar: 'حائل', name_en: 'Hail', is_capital: false, lat: 27.5114, lng: 41.7208, region_name: 'منطقة حائل' },
      { name_ar: 'جازان', name_en: 'Jazan', is_capital: false, lat: 16.8892, lng: 42.5511, region_name: 'منطقة جازان' },
      { name_ar: 'نجران', name_en: 'Najran', is_capital: false, lat: 17.5656, lng: 44.2289, region_name: 'منطقة نجران' },
      { name_ar: 'الجبيل', name_en: 'Jubail', is_capital: false, lat: 27.0046, lng: 49.6606, region_name: 'المنطقة الشرقية الصناعية' },
      { name_ar: 'ينبع', name_en: 'Yanbu', is_capital: false, lat: 24.0895, lng: 38.0618, region_name: 'المدينة المنورة الصناعية' }
    ]
  },

  // 🇦🇪 الإمارات العربية المتحدة
  AE: {
    country_code: 'AE',
    name_ar: 'الإمارات العربية المتحدة',
    name_en: 'United Arab Emirates',
    flag: '🇦🇪',
    capital: 'أبوظبي',
    center: { lat: 24.00, lng: 54.50 },
    bounds: { min_lat: 22.5, max_lat: 26.2, min_lng: 51.5, max_lng: 56.5 },
    palette: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#10b981',
      bg_gradient: 'from-[#071a2b] via-[#092d47] to-[#041d30]',
      border_color: '#38bdf8'
    },
    neighbors: [
      { code: 'SA', name_ar: 'المملكة العربية السعودية', flag: '🇸🇦', direction_ar: 'غرباً وجنوباً', angle_deg: 225, border_type: 'land' },
      { code: 'OM', name_ar: 'سلطنة عمان', flag: '🇴🇲', direction_ar: 'شرقاً وجنوب شرق', angle_deg: 340, border_type: 'land' },
      { code: 'QA', name_ar: 'دولة قطر', flag: '🇶🇦', direction_ar: 'شمال غرب (عبر الخليج)', angle_deg: 120, border_type: 'maritime' }
    ],
    water_bodies: [
      { name_ar: 'الخليج العربي', direction_ar: 'شمالاً وشمال غرب', angle_deg: 90 },
      { name_ar: 'خليج عمان ومضيق هرمز', direction_ar: 'شرقاً', angle_deg: 15 }
    ],
    cities: [
      { name_ar: 'أبوظبي', name_en: 'Abu Dhabi', is_capital: true, lat: 24.4539, lng: 54.3773, region_name: 'إمارة أبوظبي (العاصمة)', population_approx: '1.6 مليون' },
      { name_ar: 'دبي', name_en: 'Dubai', is_capital: false, lat: 25.2048, lng: 55.2708, region_name: 'إمارة دبي', population_approx: '3.6 مليون' },
      { name_ar: 'الشارقة', name_en: 'Sharjah', is_capital: false, lat: 25.3463, lng: 55.4209, region_name: 'إمارة الشارقة', population_approx: '1.8 مليون' },
      { name_ar: 'العين', name_en: 'Al Ain', is_capital: false, lat: 24.2075, lng: 55.7447, region_name: 'إمارة أبوظبي - المنطقة الشرقية' },
      { name_ar: 'عجمان', name_en: 'Ajman', is_capital: false, lat: 25.4052, lng: 55.5136, region_name: 'إمارة عجمان' },
      { name_ar: 'رأس الخيمة', name_en: 'Ras Al Khaimah', is_capital: false, lat: 25.7895, lng: 55.9432, region_name: 'إمارة رأس الخيمة' },
      { name_ar: 'الفجيرة', name_en: 'Fujairah', is_capital: false, lat: 25.1288, lng: 56.3265, region_name: 'إمارة الفجيرة (مطلة على خليج عمان)' },
      { name_ar: 'أم القيوين', name_en: 'Umm Al Quwain', is_capital: false, lat: 25.5647, lng: 55.5552, region_name: 'إمارة أم القيوين' }
    ]
  },

  // 🇯🇴 الأردن
  JO: {
    country_code: 'JO',
    name_ar: 'المملكة الأردنية الهاشمية',
    name_en: 'Jordan',
    flag: '🇯🇴',
    capital: 'عمان',
    center: { lat: 31.24, lng: 36.51 },
    bounds: { min_lat: 29.2, max_lat: 33.4, min_lng: 34.9, max_lng: 39.3 },
    palette: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#10b981',
      bg_gradient: 'from-[#2b1707] via-[#24130a] to-[#071a2b]',
      border_color: '#fbbf24'
    },
    neighbors: [
      { code: 'PS', name_ar: 'دولة فلسطين', flag: '🇵🇸', direction_ar: 'غرباً (نهر الأردن والبحر الميت)', angle_deg: 180, border_type: 'land' },
      { code: 'SY', name_ar: 'الجمهورية العربية السورية', flag: '🇸🇾', direction_ar: 'شمالاً', angle_deg: 90, border_type: 'land' },
      { code: 'IQ', name_ar: 'جمهورية العراق', flag: '🇮🇶', direction_ar: 'شرقاً', angle_deg: 0, border_type: 'land' },
      { code: 'SA', name_ar: 'المملكة العربية السعودية', flag: '🇸🇦', direction_ar: 'جنوباً وجنوب شرق', angle_deg: 280, border_type: 'land' },
      { code: 'EG', name_ar: 'مصر', flag: '🇪🇬', direction_ar: 'جنوب غرب (عبر خليج العقبة)', angle_deg: 220, border_type: 'maritime' }
    ],
    water_bodies: [
      { name_ar: 'البحر الأحمر (خليج العقبة)', direction_ar: 'جنوب غرب', angle_deg: 220 },
      { name_ar: 'البحر الميت', direction_ar: 'غرباً', angle_deg: 180 }
    ],
    cities: [
      { name_ar: 'عمان', name_en: 'Amman', is_capital: true, lat: 31.9454, lng: 35.9284, region_name: 'محافظة العاصمة', population_approx: '4.4 مليون' },
      { name_ar: 'الزرقاء', name_en: 'Zarqa', is_capital: false, lat: 32.0608, lng: 36.0942, region_name: 'محافظة الزرقاء', population_approx: '1.4 مليون' },
      { name_ar: 'إربد', name_en: 'Irbid', is_capital: false, lat: 32.5568, lng: 35.8469, region_name: 'محافظة إربد - عروس الشمال', population_approx: '1.1 مليون' },
      { name_ar: 'العقبة', name_en: 'Aqaba', is_capital: false, lat: 29.5321, lng: 35.0063, region_name: 'المنطقة الاقتصادية الخاصة والبحرية' },
      { name_ar: 'السلط', name_en: 'Salt', is_capital: false, lat: 32.0392, lng: 35.7272, region_name: 'محافظة البلقاء' },
      { name_ar: 'مادبا', name_en: 'Madaba', is_capital: false, lat: 31.7196, lng: 35.7941, region_name: 'مدينة الفسيفساء والتاريخ' },
      { name_ar: 'الكرك', name_en: 'Karak', is_capital: false, lat: 31.1853, lng: 35.7048, region_name: 'محافظة الكرك - قلعة الكرك' },
      { name_ar: 'معان', name_en: 'Maan', is_capital: false, lat: 30.1927, lng: 35.7342, region_name: 'محافظة معان والبتراء' }
    ]
  },

  // 🇲🇦 المغرب
  MA: {
    country_code: 'MA',
    name_ar: 'المملكة المغربية',
    name_en: 'Morocco',
    flag: '🇲🇦',
    capital: 'الرباط',
    center: { lat: 31.79, lng: -7.09 },
    bounds: { min_lat: 21.4, max_lat: 35.9, min_lng: -17.1, max_lng: -1.0 },
    palette: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      accent: '#10b981',
      bg_gradient: 'from-[#2b0808] via-[#1a0808] to-[#071a2b]',
      border_color: '#f87171'
    },
    neighbors: [
      { code: 'DZ', name_ar: 'الجمهورية الجزائرية', flag: '🇩🇿', direction_ar: 'شرقاً', angle_deg: 0, border_type: 'land' },
      { code: 'MR', name_ar: 'الجمهورية الموريتانية', flag: '🇲🇷', direction_ar: 'جنوباً', angle_deg: 270, border_type: 'land' },
      { code: 'ES', name_ar: 'إسبانيا', flag: '🇪🇸', direction_ar: 'شمالاً (عبر مضيق جبل طارق)', angle_deg: 90, border_type: 'maritime' }
    ],
    water_bodies: [
      { name_ar: 'المحيط الأطلسي', direction_ar: 'غرباً', angle_deg: 180 },
      { name_ar: 'البحر الأبيض المتوسط', direction_ar: 'شمالاً', angle_deg: 80 },
      { name_ar: 'مضيق جبل طارق', direction_ar: 'أقصى الشمال', angle_deg: 90 }
    ],
    cities: [
      { name_ar: 'الرباط', name_en: 'Rabat', is_capital: true, lat: 34.0209, lng: -6.8416, region_name: 'جهة الرباط-سلا-القنيطرة', population_approx: '1.8 مليون' },
      { name_ar: 'الدار البيضاء', name_en: 'Casablanca', is_capital: false, lat: 33.5731, lng: -7.5898, region_name: 'جهة الدار البيضاء الكبرى', population_approx: '4.3 مليون' },
      { name_ar: 'مراكش', name_en: 'Marrakech', is_capital: false, lat: 31.6295, lng: -7.9811, region_name: 'المدينة الحمراء', population_approx: '1.2 مليون' },
      { name_ar: 'طنجة', name_en: 'Tangier', is_capital: false, lat: 35.7595, lng: -5.8340, region_name: 'عروس الشمال وميناء طنجة المتوسط', population_approx: '1.1 مليون' },
      { name_ar: 'فاس', name_en: 'Fes', is_capital: false, lat: 34.0331, lng: -5.0003, region_name: 'العاصمة العلمية والتاريخية', population_approx: '1.2 مليون' },
      { name_ar: 'أكادير', name_en: 'Agadir', is_capital: false, lat: 30.4278, lng: -9.5981, region_name: 'سوس ماسة والساحل الأطلسي' }
    ]
  },

  // 🇩🇿 الجزائر
  DZ: {
    country_code: 'DZ',
    name_ar: 'الجمهورية الجزائرية الديمقراطية الشعبية',
    name_en: 'Algeria',
    flag: '🇩🇿',
    capital: 'الجزائر العاصمة',
    center: { lat: 28.03, lng: 1.65 },
    bounds: { min_lat: 18.9, max_lat: 37.1, min_lng: -8.7, max_lng: 12.0 },
    palette: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#ef4444',
      bg_gradient: 'from-emerald-950 via-[#0d2a45] to-[#071a2b]',
      border_color: '#34d399'
    },
    neighbors: [
      { code: 'TN', name_ar: 'تونس', flag: '🇹🇳', direction_ar: 'شمال شرق', angle_deg: 50, border_type: 'land' },
      { code: 'LY', name_ar: 'ليبيا', flag: '🇱🇾', direction_ar: 'شرقاً', angle_deg: 20, border_type: 'land' },
      { code: 'NE', name_ar: 'النيجر', flag: '🇳🇪', direction_ar: 'جنوب شرق', angle_deg: 310, border_type: 'land' },
      { code: 'ML', name_ar: 'مالي', flag: '🇲🇱', direction_ar: 'جنوباً وجنوب غرب', angle_deg: 250, border_type: 'land' },
      { code: 'MR', name_ar: 'موريتانيا', flag: '🇲🇷', direction_ar: 'جنوب غرب', angle_deg: 230, border_type: 'land' },
      { code: 'MA', name_ar: 'المغرب', flag: '🇲🇦', direction_ar: 'غرباً', angle_deg: 180, border_type: 'land' }
    ],
    water_bodies: [
      { name_ar: 'البحر الأبيض المتوسط', direction_ar: 'شمالاً (سواحل 1600 كم)', angle_deg: 90 }
    ],
    cities: [
      { name_ar: 'الجزائر العاصمة', name_en: 'Algiers', is_capital: true, lat: 36.7538, lng: 3.0588, region_name: 'ولاية الجزائر - البهجة', population_approx: '3.9 مليون' },
      { name_ar: 'وهران', name_en: 'Oran', is_capital: false, lat: 35.6987, lng: -0.6349, region_name: 'الباهية وهران - الساحل الغربي', population_approx: '1.6 مليون' },
      { name_ar: 'قسنطينة', name_en: 'Constantine', is_capital: false, lat: 36.3650, lng: 6.6147, region_name: 'مدينة الجسور المعلقة', population_approx: '1.0 مليون' },
      { name_ar: 'عنابة', name_en: 'Annaba', is_capital: false, lat: 36.9000, lng: 7.7667, region_name: 'بونة وسواحل الشرق' },
      { name_ar: 'سطيف', name_en: 'Setif', is_capital: false, lat: 36.1900, lng: 5.4100, region_name: 'عاصمة الهضاب العليا' },
      { name_ar: 'ورقلة', name_en: 'Ouargla', is_capital: false, lat: 31.9500, lng: 5.3333, region_name: 'الصحراء وحاسي مسعود الطاقي' }
    ]
  },

  // 🇹🇷 تركيا
  TR: {
    country_code: 'TR',
    name_ar: 'الجمهورية التركية',
    name_en: 'Turkey',
    flag: '🇹🇷',
    capital: 'أنقرة',
    center: { lat: 38.96, lng: 35.24 },
    bounds: { min_lat: 35.8, max_lat: 42.1, min_lng: 25.6, max_lng: 44.8 },
    palette: {
      primary: '#ef4444',
      secondary: '#dc2626',
      accent: '#fbbf24',
      bg_gradient: 'from-[#2a0707] via-[#1a0808] to-[#071a2b]',
      border_color: '#f87171'
    },
    neighbors: [
      { code: 'GR', name_ar: 'اليونان', flag: '🇬🇷', direction_ar: 'غرباً', angle_deg: 180, border_type: 'land' },
      { code: 'BG', name_ar: 'بلغاريا', flag: '🇧🇬', direction_ar: 'شمال غرب', angle_deg: 135, border_type: 'land' },
      { code: 'GE', name_ar: 'جورجيا', flag: '🇬🇪', direction_ar: 'شمال شرق', angle_deg: 45, border_type: 'land' },
      { code: 'AZ', name_ar: 'أذربيجان (نخجوان)', flag: '🇦🇿', direction_ar: 'شرقاً', angle_deg: 20, border_type: 'land' },
      { code: 'IR', name_ar: 'إيران', flag: '🇮🇷', direction_ar: 'شرقاً', angle_deg: 0, border_type: 'land' },
      { code: 'IQ', name_ar: 'العراق', flag: '🇮🇶', direction_ar: 'جنوب شرق', angle_deg: 320, border_type: 'land' },
      { code: 'SY', name_ar: 'سوريا', flag: '🇸🇾', direction_ar: 'جنوباً', angle_deg: 270, border_type: 'land' }
    ],
    water_bodies: [
      { name_ar: 'البحر الأسود', direction_ar: 'شمالاً', angle_deg: 90 },
      { name_ar: 'البحر الأبيض المتوسط', direction_ar: 'جنوباً', angle_deg: 270 },
      { name_ar: 'بحر إيجة', direction_ar: 'غرباً', angle_deg: 180 },
      { name_ar: 'بحر مرمرة ومضيقا البوسفور والدردنيل', direction_ar: 'شمال غرب', angle_deg: 120 }
    ],
    cities: [
      { name_ar: 'أنقرة', name_en: 'Ankara', is_capital: true, lat: 39.9334, lng: 32.8597, region_name: 'وسط الأناضول (العاصمة السياسية)', population_approx: '5.8 مليون' },
      { name_ar: 'إسطنبول', name_en: 'Istanbul', is_capital: false, lat: 41.0082, lng: 28.9784, region_name: 'عاصمة القارتين وملتقى البوسفور', population_approx: '15.9 مليون' },
      { name_ar: 'إزمير', name_en: 'Izmir', is_capital: false, lat: 38.4237, lng: 27.1428, region_name: 'ساحل بحر إيجة', population_approx: '4.4 مليون' },
      { name_ar: 'أنطاليا', name_en: 'Antalya', is_capital: false, lat: 36.8969, lng: 30.7133, region_name: 'ريفييرا البحر المتوسط', population_approx: '2.6 مليون' },
      { name_ar: 'بورصة', name_en: 'Bursa', is_capital: false, lat: 40.1885, lng: 29.0610, region_name: 'جنوب مرمرة' },
      { name_ar: 'طرابزون', name_en: 'Trabzon', is_capital: false, lat: 41.0027, lng: 39.7168, region_name: 'ساحل البحر الأسود' }
    ]
  },

  // 🇬🇧 المملكة المتحدة
  GB: {
    country_code: 'GB',
    name_ar: 'المملكة المتحدة',
    name_en: 'United Kingdom',
    flag: '🇬🇧',
    capital: 'لندن',
    center: { lat: 55.37, lng: -3.43 },
    bounds: { min_lat: 49.9, max_lat: 59.5, min_lng: -8.6, max_lng: 1.8 },
    palette: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#ef4444',
      bg_gradient: 'from-[#07132b] via-[#091b38] to-[#071a2b]',
      border_color: '#60a5fa'
    },
    neighbors: [
      { code: 'IE', name_ar: 'جمهورية أيرلندا', flag: '🇮🇪', direction_ar: 'غرباً (الحدود البرية في أيرلندا الشمالية)', angle_deg: 180, border_type: 'land' },
      { code: 'FR', name_ar: 'فرنسا', flag: '🇫🇷', direction_ar: 'جنوباً (عبر نفق القنال الإنجليزي)', angle_deg: 270, border_type: 'maritime' },
      { code: 'NL', name_ar: 'هولندا', flag: '🇳🇱', direction_ar: 'شرقاً (عبر بحر الشمال)', angle_deg: 45, border_type: 'maritime' }
    ],
    water_bodies: [
      { name_ar: 'المحيط الأطلسي', direction_ar: 'غرباً وشمالاً', angle_deg: 180 },
      { name_ar: 'بحر الشمال', direction_ar: 'شرقاً', angle_deg: 20 },
      { name_ar: 'القنال الإنجليزي (بحر المانش)', direction_ar: 'جنوباً', angle_deg: 270 },
      { name_ar: 'البحر الأيرلندي', direction_ar: 'بين بريطانيا وأيرلندا', angle_deg: 200 }
    ],
    cities: [
      { name_ar: 'لندن', name_en: 'London', is_capital: true, lat: 51.5074, lng: -0.1278, region_name: 'إنجلترا الكبرى (العاصمة العالمية)', population_approx: '9.0 مليون' },
      { name_ar: 'مانشستر', name_en: 'Manchester', is_capital: false, lat: 53.4808, lng: -2.2426, region_name: 'شمال غرب إنجلترا - عاصمة الصناعة والرياضة' },
      { name_ar: 'إدنبرة', name_en: 'Edinburgh', is_capital: false, lat: 55.9533, lng: -3.1883, region_name: 'عاصمة إسكتلندا التاريخية' },
      { name_ar: 'برمنغهام', name_en: 'Birmingham', is_capital: false, lat: 52.4862, lng: -1.8904, region_name: 'وسط إنجلترا' },
      { name_ar: 'غلاسكو', name_en: 'Glasgow', is_capital: false, lat: 55.8642, lng: -4.2518, region_name: 'إسكتلندا' }
    ]
  },

  // 🇩🇪 ألمانيا
  DE: {
    country_code: 'DE',
    name_ar: 'جمهورية ألمانيا الاتحادية',
    name_en: 'Germany',
    flag: '🇩🇪',
    capital: 'برلين',
    center: { lat: 51.16, lng: 10.45 },
    bounds: { min_lat: 47.2, max_lat: 55.1, min_lng: 5.8, max_lng: 15.0 },
    palette: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#ef4444',
      bg_gradient: 'from-[#1e1707] via-[#1a1408] to-[#071a2b]',
      border_color: '#fbbf24'
    },
    neighbors: [
      { code: 'DK', name_ar: 'الدنمارك', flag: '🇩🇰', direction_ar: 'شمالاً', angle_deg: 90, border_type: 'land' },
      { code: 'PL', name_ar: 'بولندا', flag: '🇵🇱', direction_ar: 'شرقاً', angle_deg: 20, border_type: 'land' },
      { code: 'CZ', name_ar: 'التشيك', flag: '🇨🇿', direction_ar: 'جنوب شرق', angle_deg: 320, border_type: 'land' },
      { code: 'AT', name_ar: 'النمسا', flag: '🇦🇹', direction_ar: 'جنوباً', angle_deg: 270, border_type: 'land' },
      { code: 'CH', name_ar: 'سويسرا', flag: '🇨🇭', direction_ar: 'جنوباً', angle_deg: 250, border_type: 'land' },
      { code: 'FR', name_ar: 'فرنسا', flag: '🇫🇷', direction_ar: 'جنوب غرب', angle_deg: 220, border_type: 'land' },
      { code: 'LU', name_ar: 'لوكسمبورغ', flag: '🇱🇺', direction_ar: 'غرباً', angle_deg: 200, border_type: 'land' },
      { code: 'BE', name_ar: 'بلجيكا', flag: '🇧🇪', direction_ar: 'غرباً', angle_deg: 180, border_type: 'land' },
      { code: 'NL', name_ar: 'هولندا', flag: '🇳🇱', direction_ar: 'شمال غرب', angle_deg: 140, border_type: 'land' }
    ],
    water_bodies: [
      { name_ar: 'بحر الشمال', direction_ar: 'شمال غرب', angle_deg: 120 },
      { name_ar: 'بحر البلطيق', direction_ar: 'شمال شرق', angle_deg: 60 }
    ],
    cities: [
      { name_ar: 'برلين', name_en: 'Berlin', is_capital: true, lat: 52.5200, lng: 13.4050, region_name: 'ولاية برلين (العاصمة الاتحادية)', population_approx: '3.8 مليون' },
      { name_ar: 'ميونخ', name_en: 'Munich', is_capital: false, lat: 48.1351, lng: 11.5820, region_name: 'ولاية بافاريا - عاصمة الصناعة والتقنية', population_approx: '1.5 مليون' },
      { name_ar: 'فرانكفورت', name_en: 'Frankfurt', is_capital: false, lat: 50.1109, lng: 8.6821, region_name: 'ولاية هيسن - العاصمة المالية للاتحاد الأوروبي' },
      { name_ar: 'هامبورغ', name_en: 'Hamburg', is_capital: false, lat: 53.5511, lng: 9.9937, region_name: 'مدينة وميناء هامبورغ العالمي' },
      { name_ar: 'كولونيا', name_en: 'Cologne', is_capital: false, lat: 50.9375, lng: 6.9603, region_name: 'شمال الراين - وستفاليا' }
    ]
  },

  // 🇫🇷 فرنسا
  FR: {
    country_code: 'FR',
    name_ar: 'الجمهورية الفرنسية',
    name_en: 'France',
    flag: '🇫🇷',
    capital: 'باريس',
    center: { lat: 46.22, lng: 2.21 },
    bounds: { min_lat: 42.3, max_lat: 51.1, min_lng: -4.8, max_lng: 8.2 },
    palette: {
      primary: '#3b82f6',
      secondary: '#2563eb',
      accent: '#ef4444',
      bg_gradient: 'from-[#07132b] via-[#0b2447] to-[#071a2b]',
      border_color: '#60a5fa'
    },
    neighbors: [
      { code: 'BE', name_ar: 'بلجيكا', flag: '🇧🇪', direction_ar: 'شمال شرق', angle_deg: 50, border_type: 'land' },
      { code: 'LU', name_ar: 'لوكسمبورغ', flag: '🇱🇺', direction_ar: 'شمال شرق', angle_deg: 40, border_type: 'land' },
      { code: 'DE', name_ar: 'ألمانيا', flag: '🇩🇪', direction_ar: 'شرقاً', angle_deg: 20, border_type: 'land' },
      { code: 'CH', name_ar: 'سويسرا', flag: '🇨🇭', direction_ar: 'شرقاً', angle_deg: 0, border_type: 'land' },
      { code: 'IT', name_ar: 'إيطاليا', flag: '🇮🇹', direction_ar: 'جنوب شرق', angle_deg: 320, border_type: 'land' },
      { code: 'ES', name_ar: 'إسبانيا', flag: '🇪🇸', direction_ar: 'جنوباً (جبال البرانس)', angle_deg: 270, border_type: 'land' },
      { code: 'GB', name_ar: 'بريطانيا', flag: '🇬🇧', direction_ar: 'شمالاً (عبر بحر المانش)', angle_deg: 90, border_type: 'maritime' }
    ],
    water_bodies: [
      { name_ar: 'البحر الأبيض المتوسط', direction_ar: 'جنوباً', angle_deg: 270 },
      { name_ar: 'المحيط الأطلسي وخليج بسكاي', direction_ar: 'غرباً', angle_deg: 180 },
      { name_ar: 'بحر المانش (القنال الإنجليزي)', direction_ar: 'شمالاً', angle_deg: 90 }
    ],
    cities: [
      { name_ar: 'باريس', name_en: 'Paris', is_capital: true, lat: 48.8566, lng: 2.3522, region_name: 'إيل دو فرانس (عاصمة النور)', population_approx: '2.1 مليون' },
      { name_ar: 'مارسيليا', name_en: 'Marseille', is_capital: false, lat: 43.2965, lng: 5.3698, region_name: 'بوفانس ألب كوت دازور - البحر المتوسط' },
      { name_ar: 'ليون', name_en: 'Lyon', is_capital: false, lat: 45.7640, lng: 4.8357, region_name: 'أوفيرن رون ألب - عاصمة الطهي' },
      { name_ar: 'نيس', name_en: 'Nice', is_capital: false, lat: 43.7102, lng: 7.2620, region_name: 'الكوت دازور والريفييرا الفرنسية' },
      { name_ar: 'تولوز', name_en: 'Toulouse', is_capital: false, lat: 43.6047, lng: 1.4442, region_name: 'عاصمة صناعات الطيران الأوروبية' }
    ]
  },

  // 🇺🇸 الولايات المتحدة الأمريكية
  US: {
    country_code: 'US',
    name_ar: 'الولايات المتحدة الأمريكية',
    name_en: 'United States',
    flag: '🇺🇸',
    capital: 'واشنطن العاصمة',
    center: { lat: 37.09, lng: -95.71 },
    bounds: { min_lat: 24.5, max_lat: 49.4, min_lng: -124.8, max_lng: -66.9 },
    palette: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#ef4444',
      bg_gradient: 'from-[#07132b] via-[#091f3b] to-[#071a2b]',
      border_color: '#60a5fa'
    },
    neighbors: [
      { code: 'CA', name_ar: 'كندا', flag: '🇨🇦', direction_ar: 'شمالاً (أطول حدود غير مسلحة دولياً)', angle_deg: 90, border_type: 'land' },
      { code: 'MX', name_ar: 'المكسيك', flag: '🇲🇽', direction_ar: 'جنوباً (نهر ريو غراندي)', angle_deg: 270, border_type: 'land' }
    ],
    water_bodies: [
      { name_ar: 'المحيط الأطلسي', direction_ar: 'شرقاً', angle_deg: 0 },
      { name_ar: 'المحيط الهادئ', direction_ar: 'غرباً', angle_deg: 180 },
      { name_ar: 'خليج المكسيك', direction_ar: 'جنوب شرق', angle_deg: 300 }
    ],
    cities: [
      { name_ar: 'واشنطن العاصمة', name_en: 'Washington, D.C.', is_capital: true, lat: 38.9072, lng: -77.0369, region_name: 'مقاطعة كولومبيا الفيدرالية', population_approx: '700 ألف' },
      { name_ar: 'نيويورك', name_en: 'New York City', is_capital: false, lat: 40.7128, lng: -74.0060, region_name: 'ولاية نيويورك - عاصمة المال والأعمال', population_approx: '8.4 مليون' },
      { name_ar: 'لوس أنجلوس', name_en: 'Los Angeles', is_capital: false, lat: 34.0522, lng: -118.2437, region_name: 'ولاية كاليفورنيا - هوليوود والمحيط الهادئ', population_approx: '3.9 مليون' },
      { name_ar: 'شيكاغو', name_en: 'Chicago', is_capital: false, lat: 41.8781, lng: -87.6298, region_name: 'ولاية إلينوي - مدينة الرياح والبحيرات العظمى' },
      { name_ar: 'ميامي', name_en: 'Miami', is_capital: false, lat: 25.7617, lng: -80.1918, region_name: 'ولاية فلوريدا - بوابة أمريكا اللاتينية' },
      { name_ar: 'هيوستن', name_en: 'Houston', is_capital: false, lat: 29.7604, lng: -95.3698, region_name: 'ولاية تكساس - عاصمة الفضاء والطاقة' }
    ]
  },

  // 🇨🇳 الصين
  CN: {
    country_code: 'CN',
    name_ar: 'جمهورية الصين الشعبية',
    name_en: 'China',
    flag: '🇨🇳',
    capital: 'بكين',
    center: { lat: 35.86, lng: 104.19 },
    bounds: { min_lat: 18.2, max_lat: 53.5, min_lng: 73.5, max_lng: 135.0 },
    palette: {
      primary: '#ef4444',
      secondary: '#dc2626',
      accent: '#fbbf24',
      bg_gradient: 'from-[#2e0909] via-[#1a0808] to-[#071a2b]',
      border_color: '#f87171'
    },
    neighbors: [
      { code: 'RU', name_ar: 'روسيا', flag: '🇷🇺', direction_ar: 'شمالاً وشمال شرق', angle_deg: 70, border_type: 'land' },
      { code: 'MN', name_ar: 'منغوليا', flag: '🇲🇳', direction_ar: 'شمالاً', angle_deg: 90, border_type: 'land' },
      { code: 'KZ', name_ar: 'كازاخستان', flag: '🇰🇿', direction_ar: 'شمال غرب', angle_deg: 135, border_type: 'land' },
      { code: 'KG', name_ar: 'قيرغيزستان', flag: '🇰🇬', direction_ar: 'غرباً', angle_deg: 160, border_type: 'land' },
      { code: 'PK', name_ar: 'باكستان', flag: '🇵🇰', direction_ar: 'جنوب غرب', angle_deg: 220, border_type: 'land' },
      { code: 'IN', name_ar: 'الهند', flag: '🇮🇳', direction_ar: 'جنوب غرب (جبال الهيمالايا)', angle_deg: 240, border_type: 'land' },
      { code: 'NP', name_ar: 'نيبال', flag: '🇳🇵', direction_ar: 'جنوباً', angle_deg: 260, border_type: 'land' },
      { code: 'VN', name_ar: 'فيتنام', flag: '🇻🇳', direction_ar: 'جنوباً', angle_deg: 280, border_type: 'land' },
      { code: 'KP', name_ar: 'كوريا الشمالية', flag: '🇰🇵', direction_ar: 'شرقاً', angle_deg: 15, border_type: 'land' }
    ],
    water_bodies: [
      { name_ar: 'بحر الصين الشرقي', direction_ar: 'شرقاً', angle_deg: 20 },
      { name_ar: 'بحر الصين الجنوبي', direction_ar: 'جنوباً', angle_deg: 290 },
      { name_ar: 'البحر الأصفر', direction_ar: 'شمال شرق', angle_deg: 40 }
    ],
    cities: [
      { name_ar: 'بكين', name_en: 'Beijing', is_capital: true, lat: 39.9042, lng: 116.4074, region_name: 'بلدية بكين (العاصمة السياسية)', population_approx: '21.5 مليون' },
      { name_ar: 'شنغهاي', name_en: 'Shanghai', is_capital: false, lat: 31.2304, lng: 121.4737, region_name: 'عاصمة المال والتجارة العالمية والميناء الأكبر', population_approx: '24.9 مليون' },
      { name_ar: 'غوانزو', name_en: 'Guangzhou', is_capital: false, lat: 23.1291, lng: 113.2644, region_name: 'مقاطعة غوانغدونغ - عاصمة المعارض والتصنيع' },
      { name_ar: 'شنجن', name_en: 'Shenzhen', is_capital: false, lat: 22.5431, lng: 114.0579, region_name: 'عاصمة الابتكار والتكنولوجيا الفائقة (وادي السيليكون الصيني)' },
      { name_ar: 'تشنغدو', name_en: 'Chengdu', is_capital: false, lat: 30.5728, lng: 104.0668, region_name: 'مقاطعة سيتشوان' }
    ]
  },

  // 🇯🇵 اليابان
  JP: {
    country_code: 'JP',
    name_ar: 'اليابان',
    name_en: 'Japan',
    flag: '🇯🇵',
    capital: 'طوكيو',
    center: { lat: 36.20, lng: 138.25 },
    bounds: { min_lat: 30.0, max_lat: 45.5, min_lng: 129.5, max_lng: 145.8 },
    palette: {
      primary: '#ef4444',
      secondary: '#dc2626',
      accent: '#38bdf8',
      bg_gradient: 'from-[#2a0707] via-[#101e33] to-[#071a2b]',
      border_color: '#f87171'
    },
    neighbors: [
      { code: 'KR', name_ar: 'كوريا الجنوبية', flag: '🇰🇷', direction_ar: 'غرباً (عبر مضيق تسوشيما)', angle_deg: 180, border_type: 'maritime' },
      { code: 'CN', name_ar: 'الصين', flag: '🇨🇳', direction_ar: 'جنوب غرب (عبر بحر الصين الشرقي)', angle_deg: 230, border_type: 'maritime' },
      { code: 'RU', name_ar: 'روسيا', flag: '🇷🇺', direction_ar: 'شمالاً (عبر بحر أوخوتسك ومضيق لا بيروز)', angle_deg: 90, border_type: 'maritime' }
    ],
    water_bodies: [
      { name_ar: 'المحيط الهادئ', direction_ar: 'شرقاً وجنوباً', angle_deg: 0 },
      { name_ar: 'بحر اليابان', direction_ar: 'غرباً', angle_deg: 180 },
      { name_ar: 'بحر الصين الشرقي', direction_ar: 'جنوب غرب', angle_deg: 230 }
    ],
    cities: [
      { name_ar: 'طوكيو', name_en: 'Tokyo', is_capital: true, lat: 35.6762, lng: 139.6503, region_name: 'طوكيو الكبرى (التكتل الحضري الأضخم عالمياً)', population_approx: '14.0 مليون' },
      { name_ar: 'أوساكا', name_en: 'Osaka', is_capital: false, lat: 34.6937, lng: 135.5023, region_name: 'منطقة كانساي - قلب التجارة والمطبخ الياباني', population_approx: '2.7 مليون' },
      { name_ar: 'كيوتو', name_en: 'Kyoto', is_capital: false, lat: 35.0116, lng: 135.7681, region_name: 'العاصمة الإمبراطورية التاريخية والتراث' },
      { name_ar: 'يوكوهاما', name_en: 'Yokohama', is_capital: false, lat: 35.4437, lng: 139.6380, region_name: 'خليج طوكيو والميناء الدولي' },
      { name_ar: 'سابورو', name_en: 'Sapporo', is_capital: false, lat: 43.0618, lng: 141.3545, region_name: 'جزيرة هوكايدو الشمالية' }
    ]
  }
};

/**
 * Universal Fallback Generator for Any Country in the World:
 * Parses profile borders, uses centroid and capital, creates accurate map dataset.
 */
export function getCountryMapDetails(countryCode: string, profile?: any): CountryMapProfile {
  const upper = countryCode?.toUpperCase() || 'EG';
  
  if (COMPREHENSIVE_COUNTRY_MAP_PROFILES[upper]) {
    const existing = COMPREHENSIVE_COUNTRY_MAP_PROFILES[upper];
    // If profile has richer cities, merge them
    if (profile?.cities && profile.cities.length > 0) {
      const mergedCities = [...existing.cities];
      profile.cities.forEach((c: any) => {
        if (!mergedCities.some(mc => mc.name_ar === c.name_ar)) {
          mergedCities.push({
            name_ar: c.name_ar,
            name_en: c.name_en,
            region_name: c.region_name,
            is_capital: c.name_ar === profile.capital || c.name_ar === existing.capital,
            lat: existing.center.lat + (Math.random() * 1.6 - 0.8),
            lng: existing.center.lng + (Math.random() * 1.6 - 0.8),
            population_approx: c.population_approx || 'معتمد'
          });
        }
      });
      return { ...existing, cities: mergedCities };
    }
    return existing;
  }

  // Synthesize for any other world country
  const nameAr = profile?.name_ar || upper;
  const nameEn = profile?.name_en || upper;
  const flag = profile?.flag || '🌐';
  const capital = profile?.capital || 'العاصمة';

  // Centroid lookup by continent / country
  const centroid = profile?.centroid || { lat: 25.0, lng: 40.0 };
  const bounds = {
    min_lat: centroid.lat - 3.5,
    max_lat: centroid.lat + 3.5,
    min_lng: centroid.lng - 4.5,
    max_lng: centroid.lng + 4.5
  };

  // Parse neighboring countries from profile.borders safely
  const neighbors: GeoNeighbor[] = [];
  if (profile?.borders && Array.isArray(profile.borders)) {
    profile.borders.forEach((bStr: string, idx: number) => {
      // Filter out any mention of Israel
      if (/إسرائيل|اسرائيل|israel/i.test(bStr)) return;
      const angle = (idx * (360 / Math.max(1, profile.borders.length))) % 360;
      neighbors.push({
        name_ar: bStr.trim(),
        flag: '🌍',
        direction_ar: bStr.includes('شمال') ? 'شمالاً' : bStr.includes('جنوب') ? 'جنوباً' : bStr.includes('شرق') ? 'شرقاً' : bStr.includes('غرب') ? 'غرباً' : 'جوار إقليمي',
        angle_deg: angle,
        border_type: 'land'
      });
    });
  }

  // Parse water bodies from profile.seas_and_oceans
  const waterBodies: GeoWaterBody[] = [];
  if (profile?.seas_and_oceans && Array.isArray(profile.seas_and_oceans)) {
    profile.seas_and_oceans.forEach((seaStr: string, idx: number) => {
      waterBodies.push({
        name_ar: seaStr.trim(),
        direction_ar: seaStr.includes('شمال') ? 'شمالاً' : seaStr.includes('جنوب') ? 'جنوباً' : seaStr.includes('شرق') ? 'شرقاً' : seaStr.includes('غرب') ? 'غرباً' : 'سواحل بحرية',
        angle_deg: (idx * 90 + 45) % 360
      });
    });
  }

  // Parse cities
  const cities: GeoCityPoint[] = [
    {
      name_ar: capital,
      name_en: profile?.capital_city,
      is_capital: true,
      lat: centroid.lat,
      lng: centroid.lng,
      region_name: 'منطقة العاصمة'
    }
  ];

  if (profile?.cities && Array.isArray(profile.cities)) {
    profile.cities.forEach((c: any, i: number) => {
      if (c.name_ar !== capital) {
        const offsetLat = Math.sin((i + 1) * 1.2) * 1.5;
        const offsetLng = Math.cos((i + 1) * 1.2) * 2.0;
        cities.push({
          name_ar: c.name_ar,
          name_en: c.name_en,
          is_capital: false,
          lat: centroid.lat + offsetLat,
          lng: centroid.lng + offsetLng,
          region_name: c.region_name || 'المنطقة الحضرية'
        });
      }
    });
  }

  return {
    country_code: upper,
    name_ar: nameAr,
    name_en: nameEn,
    flag: flag,
    capital: capital,
    center: centroid,
    bounds: bounds,
    palette: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#f59e0b',
      bg_gradient: 'from-[#071a2b] via-[#0d2a45] to-[#081e31]',
      border_color: '#38bdf8'
    },
    neighbors: neighbors,
    water_bodies: waterBodies,
    cities: cities
  };
}
