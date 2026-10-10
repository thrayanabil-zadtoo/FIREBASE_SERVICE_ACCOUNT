export interface CountryImagery {
  country_code: string;
  name_ar: string;
  name_en: string;
  flag: string;
  landmark_name_ar: string;
  image_url: string;
  region_ar: string;
  tag_ar: string;
  capital_ar: string;
  continent?: 'ARAB' | 'EUROPE' | 'AMERICAS' | 'ASIA' | 'AFRICA';
  schengen?: boolean;
  visa_free_or_easy?: boolean;
  study_hub?: boolean;
  tourism_hub?: boolean;
  business_hub?: boolean;
}

export const ARAB_COUNTRIES_IMAGERY: Record<string, CountryImagery> = {
  EG: {
    country_code: 'EG',
    name_ar: 'مصر',
    name_en: 'Egypt',
    flag: '🇪🇬',
    capital_ar: 'القاهرة',
    landmark_name_ar: 'أهرامات الجيزة ونهر النيل الخالد',
    image_url: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80',
    region_ar: 'وادي النيل',
    tag_ar: 'قلب الحضارة وبوابة التجارة القارية'
  },
  SA: {
    country_code: 'SA',
    name_ar: 'السعودية',
    name_en: 'Saudi Arabia',
    flag: '🇸🇦',
    capital_ar: 'الرياض',
    landmark_name_ar: 'برج المملكة والعمارة العصرية، الرياض',
    image_url: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=800&q=80',
    region_ar: 'الخليج العربي',
    tag_ar: 'أكبر اقتصادات المنطقة ورؤية 2030'
  },
  AE: {
    country_code: 'AE',
    name_ar: 'الإمارات',
    name_en: 'United Arab Emirates',
    flag: '🇦🇪',
    capital_ar: 'أبوظبي',
    landmark_name_ar: 'برج خليفة وأفق الأعمال، دبي',
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    region_ar: 'الخليج العربي',
    tag_ar: 'المركز المالي والتقني واللوجستي العالمي'
  },
  QA: {
    country_code: 'QA',
    name_ar: 'قطر',
    name_en: 'Qatar',
    flag: '🇶🇦',
    capital_ar: 'الدوحة',
    landmark_name_ar: 'كورنيش الدوحة ومتحف الفن الإسلامي',
    image_url: 'https://images.unsplash.com/photo-1578895210405-907db486c111?auto=format&fit=crop&w=800&q=80',
    region_ar: 'الخليج العربي',
    tag_ar: 'عاصمة الطاقة والرياضة والاستثمار الدولي'
  },
  KW: {
    country_code: 'KW',
    name_ar: 'الكويت',
    name_en: 'Kuwait',
    flag: '🇰🇼',
    capital_ar: 'مدينة الكويت',
    landmark_name_ar: 'أبراج الكويت الشامخة على الخليج',
    image_url: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=800&q=80',
    region_ar: 'الخليج العربي',
    tag_ar: 'مركز الأعمال والصناديق السيادية العريقة'
  },
  JO: {
    country_code: 'JO',
    name_ar: 'الأردن',
    name_en: 'Jordan',
    flag: '🇯🇴',
    capital_ar: 'عمّان',
    landmark_name_ar: 'الخزنة الوردية المنحوتة في الصخر، البتراء',
    image_url: 'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?auto=format&fit=crop&w=800&q=80',
    region_ar: 'المشرق العربي',
    tag_ar: 'واحة التعليم والكفاءات والسياحة التاريخية'
  },
  PS: {
    country_code: 'PS',
    name_ar: 'فلسطين',
    name_en: 'Palestine',
    flag: '🇵🇸',
    capital_ar: 'القدس الشريف',
    landmark_name_ar: 'قبة الصخرة المشرفة والبلدة القديمة بالقدس',
    image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    region_ar: 'المشرق العربي',
    tag_ar: 'أرض المقدسات والتاريخ والصمود والأصالة'
  },
  BH: {
    country_code: 'BH',
    name_ar: 'البحرين',
    name_en: 'Bahrain',
    flag: '🇧🇭',
    capital_ar: 'المنامة',
    landmark_name_ar: 'مرفأ البحرين المالي وأفق المنامة',
    image_url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
    region_ar: 'الخليج العربي',
    tag_ar: 'الواحة المصرفية والتقنية المالية المتقدمة'
  },
  OM: {
    country_code: 'OM',
    name_ar: 'عُمان',
    name_en: 'Oman',
    flag: '🇴🇲',
    capital_ar: 'مسقط',
    landmark_name_ar: 'جامع السلطان قابوس الأكبر والطبيعة العمانية',
    image_url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
    region_ar: 'الخليج العربي',
    tag_ar: 'بوابة المحيط الهندي وسلاسل الإمداد وموانئ الدقم'
  },
  LB: {
    country_code: 'LB',
    name_ar: 'لبنان',
    name_en: 'Lebanon',
    flag: '🇱🇧',
    capital_ar: 'بيروت',
    landmark_name_ar: 'صخرة الروشة وبحر بيروت الخلاب',
    image_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
    region_ar: 'المشرق العربي',
    tag_ar: 'منارة الإشعاع الفكري والخدمات والريادة'
  },
  IQ: {
    country_code: 'IQ',
    name_ar: 'العراق',
    name_en: 'Iraq',
    flag: '🇮🇶',
    capital_ar: 'بغداد',
    landmark_name_ar: 'دجلة والفرات وبغداد التاريخية وبابل',
    image_url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    region_ar: 'المشرق العربي',
    tag_ar: 'مهد الحضارات وطريق التنمية ومشاريع الإعمار'
  },
  SY: {
    country_code: 'SY',
    name_ar: 'سوريا',
    name_en: 'Syria',
    flag: '🇸🇾',
    capital_ar: 'دمشق',
    landmark_name_ar: 'دمشق القديمة والجامع الأموي المعمور',
    image_url: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=800&q=80',
    region_ar: 'المشرق العربي',
    tag_ar: 'أقدم العواصم المأهولة والتجارة والحرف العريقة'
  },
  YE: {
    country_code: 'YE',
    name_ar: 'اليمن',
    name_en: 'Yemen',
    flag: '🇾🇪',
    capital_ar: 'صنعاء',
    landmark_name_ar: 'طراز العمارة الطينية الفريدة في صنعاء القديمة',
    image_url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    region_ar: 'شبه الجزيرة العربية',
    tag_ar: 'أصل العروبة والموقع الاستراتيجي لباب المندب'
  },
  MA: {
    country_code: 'MA',
    name_ar: 'المغرب',
    name_en: 'Morocco',
    flag: '🇲🇦',
    capital_ar: 'الرباط',
    landmark_name_ar: 'أزقة شفشاون الزرقاء ومآثر مراكش وفاس',
    image_url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80',
    region_ar: 'المغرب العربي',
    tag_ar: 'قطب الصناعة المتقدمة وميناء طنجة المتوسط'
  },
  DZ: {
    country_code: 'DZ',
    name_ar: 'الجزائر',
    name_en: 'Algeria',
    flag: '🇩🇿',
    capital_ar: 'الجزائر العاصمة',
    landmark_name_ar: 'مقام الشهيد وقصبة الجزائر على البحر',
    image_url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80',
    region_ar: 'المغرب العربي',
    tag_ar: 'أكبر دول أفريقيا مساحة ومورد الطاقة والغاز'
  },
  TN: {
    country_code: 'TN',
    name_ar: 'تونس',
    name_en: 'Tunisia',
    flag: '🇹🇳',
    capital_ar: 'تونس',
    landmark_name_ar: 'العمارة البيضاء والزرقاء في سيدي بوسعيد وقرطاج',
    image_url: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=800&q=80',
    region_ar: 'المغرب العربي',
    tag_ar: 'واحة السياحة والصناعات التقنية والزيتون'
  },
  LY: {
    country_code: 'LY',
    name_ar: 'ليبيا',
    name_en: 'Libya',
    flag: '🇱🇾',
    capital_ar: 'طرابلس',
    landmark_name_ar: 'آثار لبدة الكبرى والشواطئ المتوسطية',
    image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    region_ar: 'المغرب العربي',
    tag_ar: 'احتياطيات النفط وموقع العبور الأورومتوسطي'
  },
  SD: {
    country_code: 'SD',
    name_ar: 'السودان',
    name_en: 'Sudan',
    flag: '🇸🇩',
    capital_ar: 'الخرطوم',
    landmark_name_ar: 'أهرامات مروي وملتقى النيلين الأزرق والأبيض',
    image_url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80',
    region_ar: 'وادي النيل',
    tag_ar: 'سلة الغذاء العربي الواعدة والخصوبة الزراعية'
  },
  SO: {
    country_code: 'SO',
    name_ar: 'الصومال',
    name_en: 'Somalia',
    flag: '🇸🇴',
    capital_ar: 'مقديشو',
    landmark_name_ar: 'ساحل مقديشو وشواطئ المحيط الهندي الممتدة',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    region_ar: 'القرن الأفريقي',
    tag_ar: 'أطول السواحل الأفريقية والثروة البحرية والموقع'
  },
  DJ: {
    country_code: 'DJ',
    name_ar: 'جيبوتي',
    name_en: 'Djibouti',
    flag: '🇩🇯',
    capital_ar: 'جيبوتي',
    landmark_name_ar: 'بحيرة عسل وموانئ خليج عدن الحيوية',
    image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    region_ar: 'القرن الأفريقي',
    tag_ar: 'العقدة اللوجستية لمضيق باب المندب والتجارة العالمية'
  },
  MR: {
    country_code: 'MR',
    name_ar: 'موريتانيا',
    name_en: 'Mauritania',
    flag: '🇲🇷',
    capital_ar: 'نواكشوط',
    landmark_name_ar: 'كثبان الصحراء الذهبية ومكتبات شنقيط التاريخية',
    image_url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=800&q=80',
    region_ar: 'المغرب العربي',
    tag_ar: 'بلاد المليون شاعر ومناجم الحديد والغاز الطبيعي'
  },
  KM: {
    country_code: 'KM',
    name_ar: 'جزر القمر',
    name_en: 'Comoros',
    flag: '🇰🇲',
    capital_ar: 'موروني',
    landmark_name_ar: 'الطبيعة الاستوائية البركانية لموروني وجزر القمر',
    image_url: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80',
    region_ar: 'المحيط الهندي',
    tag_ar: 'جزر العطور ومزارع الفانيلا والسياحة البيئية العذراء'
  }
};

import { FOREIGN_COUNTRIES_IMAGERY } from './foreign-countries-imagery';

export const ALL_COUNTRIES_IMAGERY: Record<string, CountryImagery> = {
  ...ARAB_COUNTRIES_IMAGERY,
  ...FOREIGN_COUNTRIES_IMAGERY
};

export function getCountryImagery(code: string): CountryImagery {
  const upper = (code || '').toUpperCase();
  if (ALL_COUNTRIES_IMAGERY[upper]) {
    return ALL_COUNTRIES_IMAGERY[upper];
  }
  return {
    country_code: upper,
    name_ar: upper,
    name_en: upper,
    flag: '🌐',
    capital_ar: '',
    landmark_name_ar: 'دليل ومعالم الدولة',
    image_url: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80',
    region_ar: 'وجهة عالمية',
    tag_ar: 'دليل دَرْب للدول والمدن'
  };
}
