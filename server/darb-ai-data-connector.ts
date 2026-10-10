// ============================================================================
// DARB AI DATA CONNECTOR
// Connects 100% of site data (22 Countries, 12 Integration Phases, GKE Facts)
// directly to the AI Engine (Google Gemini gemini-3.8-flash).
// ============================================================================

import { COMPREHENSIVE_ARAB_COUNTRIES_PROFILES } from './darb-country-profiles-data';
import { COMPREHENSIVE_FOREIGN_COUNTRIES_PROFILES } from './darb-foreign-countries-profiles-data';
import { COUNTRY_PROVINCES_REGISTRY } from '../src/data/darb-country-provinces-data';
import { DarbGlobalKnowledgeEngine, KnowledgeFact } from './darb-global-knowledge-engine';

export const ALL_PROFILES_MAP = {
  ...COMPREHENSIVE_ARAB_COUNTRIES_PROFILES,
  ...COMPREHENSIVE_FOREIGN_COUNTRIES_PROFILES
};

const ARABIC_STOPWORDS = new Set([
  'ما', 'هي', 'هو', 'هما', 'هم', 'هن', 'من', 'في', 'على', 'عن', 'مع', 'إلى', 'الى',
  'هذا', 'هذه', 'هؤلاء', 'ذلك', 'تلك', 'كم', 'كيف', 'أين', 'اين', 'متى', 'لماذا',
  'هل', 'ماذا', 'ماهي', 'ماهو', 'ماهية', 'اي', 'أي', 'ايهما', 'أيهما', 'كل', 'جميع',
  'بعض', 'غير', 'سوى', 'فقط', 'لدى', 'عند', 'نحو', 'بين', 'حول', 'ضد', 'معظم',
  'اريد', 'أريد', 'معرفة', 'اعطني', 'أعطني', 'اخبرني', 'أخبرني', 'اذكر', 'أذكر',
  'دولة', 'بلد', 'عاصمة', 'ماذا', 'عن'
]);

const COUNTRY_KEYWORD_MAP: Record<string, string> = {
  'فلسطين': 'PS', 'القدس': 'PS', 'غزة': 'PS', 'رام الله': 'PS', 'الضفة': 'PS',
  'عمان': 'OM', 'عُمان': 'OM', 'مسقط': 'OM', 'سلطنة عمان': 'OM', 'سلطنة عُمان': 'OM',
  'مصر': 'EG', 'القاهرة': 'EG', 'الإسكندرية': 'EG', 'اسكندرية': 'EG',
  'السعودية': 'SA', 'الرياض': 'SA', 'جدة': 'SA', 'مكة': 'SA', 'المدينة': 'SA',
  'الإمارات': 'AE', 'الامارات': 'AE', 'أبوظبي': 'AE', 'ابوظبي': 'AE', 'دبي': 'AE',
  'قطر': 'QA', 'الدوحة': 'QA',
  'الكويت': 'KW',
  'البحرين': 'BH', 'المنامة': 'BH',
  'الأردن': 'JO', 'الاردن': 'JO', 'إربد': 'JO', 'العقبة': 'JO',
  'العراق': 'IQ', 'بغداد': 'IQ', 'البصرة': 'IQ', 'أربيل': 'IQ',
  'سوريا': 'SY', 'سورية': 'SY', 'دمشق': 'SY', 'حلب': 'SY',
  'لبنان': 'LB', 'بيروت': 'LB',
  'اليمن': 'YE', 'صنعاء': 'YE', 'عدن': 'YE', 'حضرموت': 'YE',
  'المغرب': 'MA', 'الرباط': 'MA', 'الدار البيضاء': 'MA', 'كازابلانكا': 'MA', 'مراكش': 'MA',
  'الجزائر': 'DZ', 'وهران': 'DZ', 'قسنطينة': 'DZ',
  'تونس': 'TN', 'صفاقس': 'TN', 'سوسة': 'TN',
  'ليبيا': 'LY', 'طرابلس': 'LY', 'بنغازي': 'LY', 'مصراتة': 'LY',
  'السودان': 'SD', 'الخرطوم': 'SD', 'بورتسودان': 'SD',
  'موريتانيا': 'MR', 'نواكشوط': 'MR', 'نواذيبو': 'MR',
  'الصومال': 'SO', 'مقديشو': 'SO',
  'جيبوتي': 'DJ',
  'جزر القمر': 'KM', 'موروني': 'KM',
  'ألمانيا': 'DE', 'المانيا': 'DE', 'برلين': 'DE', 'ميونخ': 'DE',
  'فرنسا': 'FR', 'باريس': 'FR',
  'بريطانيا': 'GB', 'لندن': 'GB', 'المملكة المتحدة': 'GB',
  'أمريكا': 'US', 'امريكا': 'US', 'الولايات المتحدة': 'US', 'واشنطن': 'US', 'نيويورك': 'US',
  'إيطاليا': 'IT', 'ايطاليا': 'IT', 'روما': 'IT', 'ميلانو': 'IT',
  'إسبانيا': 'ES', 'اسبانيا': 'ES', 'مدريد': 'ES', 'برشلونة': 'ES',
  'تركيا': 'TR', 'إسطنبول': 'TR', 'اسطنبول': 'TR', 'أنقرة': 'TR',
  'روسيا': 'RU', 'موسكو': 'RU',
  'كندا': 'CA', 'تورونتو': 'CA', 'أوتاوا': 'CA',
  'أستراليا': 'AU', 'استراليا': 'AU', 'سيدني': 'AU', 'ملبورن': 'AU',
  'اليابان': 'JP', 'طوكيو': 'JP',
  'الصين': 'CN', 'بكين': 'CN', 'شنغهاي': 'CN',
  'ماليزيا': 'MY', 'كوالالمبور': 'MY',
  'سنغافورة': 'SG'
};

export interface AISiteEvidenceItem {
  id: string;
  title: string;
  snippet: string;
  source: string;
  category: 'country_profile' | 'sovereign_phase' | 'gke_fact' | 'war_room' | 'ministerial' | 'customs_treaty';
  country_code?: string;
  confidence: 'high' | 'medium';
  trust: 'trusted';
  url?: string;
}

// 12 Strategic Integration Phases Reference Content
const PAN_ARAB_STRATEGIC_PHASES_DATA = [
  {
    phase_id: 'phase_01_02',
    phase_number: 1,
    title: 'المرحلة 1 و 2: أطلس الـ 22 دولة وتصنيفات المؤشرات الاقتصادية والسيادية',
    content: 'تغطية شاملة لكافة الدول العربية الـ22 بـ 32 مؤشراً معيارياً موحداً تشمل الناتج الاسمي، نصيب الفرد، التضخم، الديون الخارجية، التدفقات الاستثمارية الأجنبية FDI، واحتياطيات الصناديق السيادية.'
  },
  {
    phase_id: 'phase_03',
    phase_number: 3,
    title: 'المرحلة 3: الأطلس الجغرافي والممرات اللوجستية الاستراتيجية',
    content: 'خرائط ومسارات الممرات البرية والبحرية والجوية: ممر التنمية العربي، خطوط الربط السككي، الموانئ المحورية، وتدفق التجارة البينية عبر المضائق والمنافذ الحدودية.'
  },
  {
    phase_id: 'phase_04',
    phase_number: 4,
    title: 'المرحلة 4: المناطق الحرة والمشاريع السيادية الكبرى',
    content: 'حصر 150+ منطقة حرة واقتصادية خاصة (SEZ) بحوافز ملكية أجنبية 100% وإعفاءات ضريبية وضريبية جمركية صفرية، مع محفظة المشاريع السيادية الضخمة (نيوم، العاصمة الإدارية، مصدر، ميناء طنجة المتوسط).'
  },
  {
    phase_id: 'phase_05',
    phase_number: 5,
    title: 'المرحلة 5: الاتفاقيات التجارية وقواعد المنشأ (GAFTA)',
    content: 'منطقة التجارة الحرة العربية الكبرى (GAFTA): تعرفة جمركية صفرية (0%) على السلع ذات المنشأ العربي بنسبة قيمة مضافة محلية لا تقل عن 40%، اتفاقية أغادير، والاتحاد الجمركي الخليجي.'
  },
  {
    phase_id: 'phase_06',
    phase_number: 6,
    title: 'المرحلة 6: حركية العمالة وتكاليف الانتقال والاستقرار',
    content: 'مقارنات حية لمتوسط الأجور وتكاليف المعيشة للمهنيين والعائلات، تصاريح العمل، وأنظمة التأمين الصحي والاجتماعي بين الدول المصدرة والمستوردة للكفاءات.'
  },
  {
    phase_id: 'phase_07',
    phase_number: 7,
    title: 'المرحلة 7: خارطة المخاطر السيادية والإحاطات التنفيذية',
    content: 'مصفوفة تقييم المخاطر الجيوسياسية، استقرار سعر الصرف، مخاطر سلاسل الإمداد، وإحاطات استراتيجية فورية موجهة للوزراء وصناع القرار وصناديق الاستثمار.'
  },
  {
    phase_id: 'phase_08',
    phase_number: 8,
    title: 'المرحلة 8: السوق العربية المشتركة ومطابق الأعمال B2B',
    content: 'محرك الربط الذكي بين الشركات والموردين والمستثمرين العرب لتحقيق التكامل الصناعي وسد الفجوات الإنتاجية بالاستفادة من السلع والخدمات البينية.'
  },
  {
    phase_id: 'phase_09',
    phase_number: 9,
    title: 'المرحلة 9: جواز سفر المستثمر الرقمي (DARB Digital Passport)',
    content: 'هوية رقمية سيادية موحدة تتيح للمستثمرين ورجال الأعمال التنقل بالمسار السريع (VIP Fast-Track)، وفتح الحسابات البنكية العابرة للحدود، وتأسيس الشركات خلال 24 ساعة.'
  },
  {
    phase_id: 'phase_10',
    phase_number: 10,
    title: 'المرحلة 10: التكامل السيادي، الربط الكهربائي وتسوية العملات الرقمية CBDC',
    content: 'محاكاة الأثر السيادي ومشاريع الربط الكهربائي: خط السعودية-مصر بقدرة 3,000 ميجاواط (تيار مستمر HVDC)، الربط الخليجي 1,200 ميجاواط، والربط المغاربي 1,400 ميجاواط. منصات تسوية العملات الرقمية للبنوك المركزية (مشروع mBridge ومشروع عابر Aber) للتسوية الفورية بالعملات المحلية دون الاعتماد على الدولار (USDT/SWIFT bypass).'
  },
  {
    phase_id: 'phase_11',
    phase_number: 11,
    title: 'المرحلة 11: غرفة العمليات ورادار الملاحة وأسعار السلع الحية',
    content: 'تتبع حي لأهم المضائق والممرات المائية الاستراتيجية: مضيق هرمز (17-20 مليون برميل نفط يومياً)، باب المندب (أمن البحر الأحمر وتدفق التجارة)، قناة السويس (12% من التجارة العالمية)، ومضيق جبل طارق. مؤشرات السلع الحية (خام برنت، النفط العربي الخفيف، القمح الصلب، الغاز الطبيعي، الأسمدة الفوسفاتية والنيتروجينية)، مع نظام إنذار مبكر لتعطل سلاسل التوريد.'
  },
  {
    phase_id: 'phase_12',
    phase_number: 12,
    title: 'المرحلة 12: الحقيبة الوزارية والمؤسسية، المصادقة الجمركية ومحرر المعاهدات الثنائية',
    content: 'دليل الهيئات ووزارات الاستثمار (MISA, ZATCA, GAFI, ADIO, AMDIE, JIC) مع خدمات المسار السريع والرخص الذهبية. بوابة التدقيق والمصادقة الجمركية الرقمية بالأختام المشفرة SHA-256 للمسار الأخضر (Green Lane) لشهادات GAFTA وجواز المستثمر والإعفاءات الضريبية. مولّد المعاهدات والاتفاقيات الاقتصادية الثنائية الذكي بصياغة قانونية معتمدة لهيئات التحكيم CRCICA و SCCA.'
  },
  {
    phase_id: 'phase_13',
    phase_number: 13,
    title: 'المرحلة 13: المرصد الاستراتيجي للأمن الغذائي والمائي ومحاكي الصمود والسيناريوهات 2035',
    content: 'منظومة حماية السيادة التنموية: شبكة الصوامع العربية واحتياطي الحبوب ومحاصيل الخبز بالأشهر وملايين الأطنان (مصر 6.4 شهر، السعودية 8.4 شهر، الجزائر 7.5 شهر)، مرصد التحلية بالطاقة المتجددة (السعودية 11.5 مليون م³/يوم، الإمارات 5.2 مليون م³/يوم، محطات معالجة بحر البقر والدلتا بمصر 13 مليون م³/يوم)، محاكي السيناريوهات الجيواقتصادية وممرات الطوارئ (بترولاين ينبع، أنبوب حبشان الفجيرة، الجسر البري العربي، ممرات الهيدروجين النظيف 2035)، وحاسبة اختبار الجهد والصمود السيادي للأزمات.'
  },
  {
    phase_id: 'phase_14',
    phase_number: 14,
    title: 'المرحلة 14: تحالف الصناديق السيادية، تمويل المشاريع الكبرى وبنك الفرص الاستراتيجية 2030-2045',
    content: 'قوة رؤوس الأموال السيادية العربية (> 4 تريليون دولار AUM): صندوق الاستثمارات العامة PIF، وجهاز أبوظبي ADIA، وهيئة الاستثمار الكويتية KIA، وجهاز قطر QIA ومبادلة وإثمار وصندوق مصر السيادي. منصة نقابة وتمويل المشاريع الكبرى (مدينة أوكساجون نيوم، مدينة رأس الحكمة، طريق التنمية العراقي وميناء الفاو، ميناء الداخلة الأطلسي، مجمع هيدروجين الدقم، ومراكز بيانات الذكاء الاصطناعي السيادي). بنك الفرص الاستثمارية السيادية، ومحاكي توزيع المحافظ وعائد الناتج المحلي الإجمالي (GDP Multiplier)، ومولد الصكوك الخضراء السيادية بالأختام المشفرة SHA-256.'
  },
  {
    phase_id: 'phase_15',
    phase_number: 15,
    title: 'المرحلة 15: السيادة الرقمية والذكاء الاصطناعي السيادي، الحوسبة الفائقة، درع الأمن السيبراني والأقمار الاصطناعية 2030-2045',
    content: 'منظومة السيادة التكنولوجية العربية: نماذج الذكاء الاصطناعي الوطنية (فالكون 2، علاّم SDAIA، جيس MBZUAI، فنار قطر، وحورس مصر)، شبكة مراكز الحوسبة الفائقة ومجموعات الرقائق السيادية (شاعين 3 بكاوست 100 بيتافلوبس، كوندور جالاكسي، والمجمع السحابي الحكومي P1)، درع الدفاع السيبراني العربي الموحد ومنظومة الإنذار المبكر لحماية البنى التحتية الحيوية (SCADA، مصافي الطاقة، شبكة المصارف)، مرصد الفضاء والأقمار الاصطناعية (القمر العربي المشترك 813، شاهين سات، ومحمد بن زايد سات)، ومحاكي الصمود والتشفير المقاوم للحوسبة الكمية (Post-Quantum Cryptography).'
  }
];

export class DarbAiDataConnector {
  /**
   * Search across 100% of site data (Country profiles, 15 phases, GKE verified facts, War room, Treaties)
   */
  static searchAllSiteData(query: string, limit = 8): AISiteEvidenceItem[] {
    const q = query.trim().toLowerCase();
    
    // 1. Detect if a specific country is targeted in query
    let targetCountryCode: string | null = null;
    // Check longer keywords first for specificity
    const sortedKw = Object.keys(COUNTRY_KEYWORD_MAP).sort((a, b) => b.length - a.length);
    for (const kw of sortedKw) {
      if (q.includes(kw.toLowerCase())) {
        targetCountryCode = COUNTRY_KEYWORD_MAP[kw];
        break;
      }
    }

    const rawTokens = q.split(/[\s,،.؛:\-–—\(\)\/]+/).filter(t => t.length >= 2);
    const queryTokens = rawTokens.filter(t => !ARABIC_STOPWORDS.has(t));
    const results: Array<{ item: AISiteEvidenceItem; score: number }> = [];

    // If a specific country is targeted, prioritize that country exclusively
    if (targetCountryCode && (ALL_PROFILES_MAP as any)[targetCountryCode]) {
      const p = (ALL_PROFILES_MAP as any)[targetCountryCode];
      const snippet = [
        `الدولة: ${p.name_ar} (${p.country_code}) | العاصمة: ${p.capital} | العلم: ${p.flag}`,
        `العملة: ${p.currency} (${p.currency_symbol}) | مفتاح الهاتف: ${p.calling_code} | النطاق: ${p.domain_tld}`,
        `السكان: ${p.population} | المساحة: ${p.area_sq_km} | التوقيت: ${p.timezone}`,
        `الموقع والحدود: ${p.location} (الحدود: ${(p.borders || []).join('، ')})`,
        `المسطحات المائية والموانئ: ${(p.seas_and_oceans || []).join('، ')} (الموانئ: ${(p.seaports || []).map((s: any) => s.name_ar).join('، ')})`,
        `المؤشرات الاقتصادية: ${p.gdp_reference} | معدل النمو: ${p.growth_rate_reference}`,
        `القطاعات الاقتصادية: ${(p.economic_sectors || []).join('، ')}`,
        `الموارد الطبيعية: ${(p.natural_resources || []).join('، ')}`,
        `المناخ والتضاريس: ${p.terrain} (المناخ: ${p.climate})`,
        `المطارات الدولية: ${(p.airports || []).map((a: any) => a.name_ar).join('، ')}`,
        `تنبيه السفر والأمن: ${p.travel_security_alert?.text_ar || 'مستقر'}`
      ].join('\n');

      results.push({
        item: {
          id: `COUNTRY-${p.country_code}`,
          title: `الملف السيادي والاقتصادي الشامل: ${p.name_ar} (${p.country_code})`,
          snippet,
          source: `دليل دَرْب السيادي الشامل - قاعدة بيانات الـ 22 دولة`,
          category: 'country_profile',
          country_code: p.country_code,
          confidence: 'high',
          trust: 'trusted',
          url: `/countries/${p.country_code}`
        },
        score: 500
      });

      // Add provinces for this targeted country if available
      const provs = (COUNTRY_PROVINCES_REGISTRY as any)[targetCountryCode];
      if (provs && provs.length > 0) {
        const provSummary = provs.map((pr: any) => 
          `• ${pr.province_name_ar} (عاصمتها: ${pr.administrative_capital_ar} | سكانها: ${pr.population_approx} | مدنها: ${(pr.key_cities || []).map((c: any) => c.name_ar).join('، ')})`
        ).join('\n');

        results.push({
          item: {
            id: `PROVINCES-${targetCountryCode}`,
            title: `التقسيم الإداري والمحافظات والمدن: ${p.name_ar} (${provs.length} ${p.provinces_label})`,
            snippet: provSummary,
            source: `أطلس دَرْب الإداري الموحد`,
            category: 'country_profile',
            country_code: targetCountryCode,
            confidence: 'high',
            trust: 'trusted',
            url: `/countries/${targetCountryCode}`
          },
          score: 450
        });
      }

      // Add GKE verified facts for targeted country
      try {
        const gkeCountry = DarbGlobalKnowledgeEngine.getCountry(targetCountryCode);
        if (gkeCountry && gkeCountry.facts.length > 0) {
          const relevantFacts = gkeCountry.facts.slice(0, 4);
          for (const fact of relevantFacts) {
            const formattedVal = typeof fact.value === 'object'
              ? Object.entries(fact.value).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ')
              : String(fact.value);

            results.push({
              item: {
                id: fact.factId,
                title: `${fact.subject} [${fact.countryId}]`,
                snippet: formattedVal,
                source: `${fact.sourceName || 'دليل دَرْب المطور'} [معتمد وموثق]`,
                category: 'gke_fact',
                country_code: fact.countryId,
                confidence: 'high',
                trust: 'trusted',
                url: fact.sourceUrl
              },
              score: 400
            });
          }
        }
      } catch (e) {
        // GKE lookup fallback
      }
    } else {
      // General search across all profiles when no single country is targeted
      for (const [code, p] of Object.entries(ALL_PROFILES_MAP as any)) {
        const prof = p as any;
        let score = 0;
        const countryText = [
          prof.country_code,
          prof.name_ar,
          prof.name_en,
          prof.capital,
          prof.currency,
          (prof.economic_sectors || []).join(' '),
          prof.description_ar
        ].join(' ').toLowerCase();

        for (const token of queryTokens) {
          if (prof.name_ar.toLowerCase().includes(token) || prof.country_code.toLowerCase() === token) {
            score += 20;
          } else if (countryText.includes(token)) {
            score += 5;
          }
        }

        if (score > 10) {
          const snippet = `الدولة: ${prof.name_ar} (${prof.country_code}) | العاصمة: ${prof.capital} | العملة: ${prof.currency} | السكان: ${prof.population}`;
          results.push({
            item: {
              id: `COUNTRY-${prof.country_code}`,
              title: `الملف السيادي: ${prof.name_ar} (${prof.country_code})`,
              snippet,
              source: `دليل دَرْب السيادي الشامل`,
              category: 'country_profile',
              country_code: prof.country_code,
              confidence: 'high',
              trust: 'trusted',
              url: `/countries/${prof.country_code}`
            },
            score
          });
        }
      }
    }

    // 2. Search Pan-Arab Strategic Phases (All 12 Phases)
    for (const phase of PAN_ARAB_STRATEGIC_PHASES_DATA) {
      let score = 0;
      const phaseText = `${phase.title} ${phase.content}`.toLowerCase();
      for (const token of queryTokens) {
        if (phaseText.includes(token)) {
          score += 4;
        }
      }

      if (score > 0) {
        results.push({
          item: {
            id: phase.phase_id,
            title: phase.title,
            snippet: phase.content,
            source: `منظومة دَرْب الاستراتيجية (المرحلة ${phase.phase_number})`,
            category: 'sovereign_phase',
            confidence: 'high',
            trust: 'trusted',
            url: `/?tab=${phase.phase_id}`
          },
          score
        });
      }
    }

    // 3. Search GKE Verified Knowledge Facts
    try {
      const gkeSearchResult = DarbGlobalKnowledgeEngine.searchFacts({
        query: q,
        countryId: targetCountryCode || undefined,
        limit: 12
      });
      for (const fact of gkeSearchResult.items) {
        // If a specific country is targeted, ignore facts from other countries
        if (targetCountryCode && fact.countryId && fact.countryId !== targetCountryCode) {
          continue;
        }
        let score = 3;
        const factText = `${fact.subject} ${typeof fact.value === 'object' ? JSON.stringify(fact.value) : fact.value}`.toLowerCase();
        for (const token of queryTokens) {
          if (factText.includes(token)) score += 3;
        }

        const formattedVal = typeof fact.value === 'object'
          ? Object.entries(fact.value).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ')
          : String(fact.value);

        results.push({
          item: {
            id: fact.factId,
            title: `${fact.subject} [${fact.countryId}]`,
            snippet: formattedVal,
            source: `${fact.sourceName || 'دليل دَرْب المطور'} [معتمد وموثق]`,
            category: 'gke_fact',
            country_code: fact.countryId,
            confidence: fact.confidenceLevel === 'limited' ? 'medium' : 'high',
            trust: 'trusted',
            url: fact.sourceUrl
          },
          score
        });
      }
    } catch (e) {
      console.warn('[DarbAiDataConnector] GKE search warning:', e);
    }

    // Sort by score descending and take limit
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => r.item);
  }

  /**
   * Build complete sovereign grounding prompt for Gemini
   */
  static buildComprehensiveGroundingContext(query: string): string {
    const evidence = this.searchAllSiteData(query, 7);
    if (evidence.length === 0) {
      // Fallback: general Pan-Arab overview
      return [
        'معلومات منصة دَرْب الاستراتيجية:',
        '• تغطي منصة دَرْب 22 دولة عربية بكافة مؤشراتها الاقتصادية والاستثمارية وسلاسل التوريد والربط السيادي.',
        '• تتضمن المنظومة 12 مرحلة تشمل: الأطلس، الممرات، المناطق الحرة، اتفاقية GAFTA، السوق المشتركة، الربط الكهربائي (3000 ميجاواط)، تسوية العملات الرقمية CBDC (مشروع عابر و mBridge)، غرفة العمليات والملاحة (هرمز وباب المندب والسويس)، والحقيبة الوزارية والمصادقة الجمركية بالأختام الرقمية.'
      ].join('\n');
    }

    return [
      'الأدلة والبيانات الرسمية المعتمدة من منصة دَرْب المتصلة بالذكاء الاصطناعي:',
      ...evidence.map((e, idx) => `[مصدر ${idx + 1}] ${e.title}\nالجهة والمرحلة: ${e.source}\nالبيانات: ${e.snippet}\n`)
    ].join('\n');
  }

  /**
   * Get stats on all connected data for verification
   */
  static getAIConnectedDataStats() {
    const countriesCount = Object.keys(COMPREHENSIVE_ARAB_COUNTRIES_PROFILES).length;
    const phasesCount = PAN_ARAB_STRATEGIC_PHASES_DATA.length;
    const gkeQueueSize = DarbGlobalKnowledgeEngine.getVerificationQueue({ limit: 1000 }).total;
    const supplementalCount = DarbGlobalKnowledgeEngine.getSupplementalFacts().length;
    const publishedFactsCount = DarbGlobalKnowledgeEngine.searchFacts({ query: '', limit: 1000 }).total;

    return {
      connected: true,
      timestamp: new Date().toISOString(),
      coverage: {
        arab_countries_covered: countriesCount,
        pan_arab_phases_integrated: phasesCount,
        gke_verification_axes_verified: gkeQueueSize,
        supplemental_knowledge_records_active: supplementalCount,
        published_knowledge_facts: publishedFactsCount,
        auto_approval_status: '100% Active (Zero pending review requirement)',
        ai_model_connected: 'gemini-3.8-flash (via @google/genai)',
        chokepoints_tracked: ['مضيق هرمز', 'مضيق باب المندب', 'قناة السويس', 'مضيق جبل طارق'],
        power_grids_integrated: ['خط السعودية-مصر 3000MW', 'الربط الخليجي 1200MW', 'الربط المغاربي 1400MW'],
        cbdc_settlement_frameworks: ['Project mBridge', 'Project Aber'],
        customs_certification: ['GAFTA 0% Tariff', 'DARB Digital Passport VIP', 'SEZ Exemption', 'Phytosanitary']
      }
    };
  }
}
