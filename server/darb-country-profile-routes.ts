import { Express, Request, Response } from 'express';
import { COMPREHENSIVE_ARAB_COUNTRIES_PROFILES } from './darb-country-profiles-data';
import { COMPREHENSIVE_FOREIGN_COUNTRIES_PROFILES } from './darb-foreign-countries-profiles-data';
import { DarbGlobalKnowledgeEngine } from './darb-global-knowledge-engine';

export const ALL_GLOBAL_COUNTRIES_PROFILES = {
  ...COMPREHENSIVE_ARAB_COUNTRIES_PROFILES,
  ...COMPREHENSIVE_FOREIGN_COUNTRIES_PROFILES
};
import { getCitiesByCountryCode } from './darb-all-cities';
import { getCountryOutings } from '../src/data/darb-country-outings-data';
import { getProvincesByCountryCode, COUNTRY_PROVINCES_REGISTRY } from '../src/data/darb-country-provinces-data';
import {
  ArabRegion,
  MacroeconomicOverview,
  CountryRankingItem,
  CountryComparisonResult,
  PanArabGeospatialAtlas,
  StrategicStrait,
  StrategicMaritimePort,
  StrategicAirportHub,
  PanArabCurrencyRate,
  PanArabLivingBudgetCalculation,
  AnnualCountryUpdate,
  AnnualSimulationProjection,
  PanArabFreeZone,
  PanArabEmergencyDirectoryItem,
  PanArabVisaSimulatorResult,
  PanArabResidencyPathway,
  CountryExecutiveDossier,
  PanArabTradeAgreement,
  PanArabTransitCorridor,
  PanArabLaborSectorDemand,
  PanArabSalaryBenchmark,
  PanArabAttestationGuide,
  PanArabRelocationStep,
  PanArabRelocationComparisonResult,
  PanArabSovereignFund,
  PanArabMegaProject,
  PanArabClimateEnergyProfile,
  PanArabDigitalReadiness,
  PanArabDecisionSimulationResponse,
  PanArabGeopoliticalRisk,
  PanArabRouteContingency,
  PanArabGlobalCompetitiveness,
  PanArabExecutiveBriefingRequest,
  PanArabExecutiveBriefingResponse,
  PanArabIndustrialProject,
  PanArabCoInvestmentDeal,
  PanArabFoodSecurityCommodity,
  PanArabRulesOfOriginInput,
  PanArabRulesOfOriginResult,
  PanArabDigitalPassport,
  PanArabMatchmakerListing,
  PanArabStrategyCopilotRequest,
  PanArabStrategyCopilotResponse,
  PanArabPowerGridProject,
  PanArabDigitalSettlementChannel,
  PanArabSovereignImpactInput,
  PanArabSovereignImpactResult,
  PanArabMaritimeChokepoint,
  PanArabLiveCommodityQuote,
  PanArabSupplyChainAlert,
  PanArabInstitutionalEntity,
  PanArabCustomsVerificationRequest,
  PanArabCustomsVerificationResult,
  PanArabTreatyDraftRequest,
  PanArabTreatyDraftResponse
} from '../src/types/country-profile';

// Numeric area dictionary in km² for all 22 Arab countries
const NUMERIC_AREA_KM2: Record<string, number> = {
  DZ: 2381741,
  SA: 2149690,
  SD: 1886068,
  LY: 1759540,
  MR: 1030700,
  EG: 1002450,
  MA: 710850,
  SO: 637657,
  YE: 527968,
  IQ: 438317,
  OM: 309500,
  SY: 185180,
  TN: 163610,
  JO: 89342,
  AE: 83600,
  PS: 27000,
  DJ: 23200,
  KW: 17818,
  QA: 11586,
  LB: 10452,
  KM: 2235,
  BH: 785,
  TR: 783562,
  GB: 242495,
  DE: 357592,
  FR: 551695,
  IT: 301340,
  ES: 505990,
  CH: 41285,
  AT: 83879,
  NL: 41543,
  GE: 69700,
  BA: 51209,
  US: 9833517,
  CA: 9984670,
  BR: 8515767,
  MY: 330803,
  TH: 513120,
  ID: 1904569,
  SG: 734,
  JP: 377975,
  KR: 100210,
  CN: 9596960,
  AU: 7692024,
  ZA: 1219090,
  MU: 2040,
  TZ: 947303
};

// Economic Classification
const ECONOMIC_CLASSIFICATIONS: Record<string, 'oil_and_gas' | 'diversified' | 'agriculture_mining_services'> = {
  SA: 'oil_and_gas',
  AE: 'oil_and_gas',
  QA: 'oil_and_gas',
  KW: 'oil_and_gas',
  DZ: 'oil_and_gas',
  IQ: 'oil_and_gas',
  LY: 'oil_and_gas',
  OM: 'oil_and_gas',
  BH: 'oil_and_gas',
  EG: 'diversified',
  MA: 'diversified',
  TN: 'diversified',
  JO: 'diversified',
  MR: 'agriculture_mining_services',
  SD: 'agriculture_mining_services',
  SO: 'agriculture_mining_services',
  KM: 'agriculture_mining_services',
  DJ: 'agriculture_mining_services',
  YE: 'agriculture_mining_services',
  SY: 'agriculture_mining_services',
  LB: 'diversified',
  PS: 'agriculture_mining_services'
};

// 5 Geographic Arab Regions
const ARAB_REGIONS_DEFINITION: ArabRegion[] = [
  {
    id: 'north_africa',
    name_ar: 'شمال أفريقيا',
    name_en: 'North Africa',
    description_ar: 'يمتد عبر الساحل الجنوبي للبحر المتوسط والمحيط الأطلسي، ويضم كبرى الدول العربية مساحة ومواقع تجارية وبحرية واستراتيجية عريقة.',
    countries_count: 6,
    countries_codes: ['DZ', 'EG', 'LY', 'MA', 'TN', 'MR'],
    total_area_approx: '7,048,891 كم²',
    countries: [],
    key_features: [
      'شواطئ ساحلية ممتدة على المتوسط والأطلسي',
      'امتداد سلاسل جبال الأطلس والصحراء الكبرى',
      'أكبر دولتين عربيتين مساحة (الجزائر وليبيا وموريتانيا ومصر)',
      'تنوع اقتصادي بين النفط والغاز والفوسفات والزراعة والسياحة وصناعة السيارات'
    ]
  },
  {
    id: 'nile_horn_africa',
    name_ar: 'وادي النيل والقرن الأفريقي',
    name_en: 'Nile Valley & Horn of Africa',
    description_ar: 'يمثل العمق الأفريقي الجنوبي والشرقي للعالم العربي، محتضناً حوض النيل ومداخل البحر الأحمر وباب المندب وسواحل المحيط الهندي.',
    countries_count: 4,
    countries_codes: ['SD', 'SO', 'DJ', 'KM'],
    total_area_approx: '2,549,160 كم²',
    countries: [],
    key_features: [
      'حوض ورافد نهر النيل وشبكات المياه العذبة',
      'مواقع لوجستية وملاحية استراتيجية على باب المندب وخليج عدن',
      'أطول شواطئ أفريقية على المحيط الهندي (الصومال)',
      'إمكانيات زراعية وثروات حيوانية وسمكية ومعدنية كبرى'
    ]
  },
  {
    id: 'levant',
    name_ar: 'بلاد الشام',
    name_en: 'The Levant',
    description_ar: 'مهد الحضارات والأديان السماوية، موقع الوصل بين آسيا وأفريقيا وأوروبا، ويتميز بتنوع تضاريسي وطبيعي وبشري فريد.',
    countries_count: 4,
    countries_codes: ['PS', 'JO', 'LB', 'SY'],
    total_area_approx: '311,974 كم²',
    countries: [],
    key_features: [
      'عاصمة التاريخ والقدس الشريف والمقدسات الدينية',
      'تنوع مناخي بديع بين الثلوج الجبلية والشواطئ وغور الأردن وأخفض بقعة في العالم',
      'كفاءات علمية وثقافية ورأس مال بشري رائد عالمياً',
      'معالم سياحية وأثرية مسجلة في التراث الإنساني العالمي'
    ]
  },
  {
    id: 'iraq_gulf',
    name_ar: 'العراق والخليج العربي',
    name_en: 'Iraq & Arabian Gulf',
    description_ar: 'مركز الثقل الطاقي العالمي وموطن حضارة بلاد الرافدين وحواضر الأعمال والتقنية اللوجستية الحديثة.',
    countries_count: 7,
    countries_codes: ['IQ', 'KW', 'SA', 'BH', 'QA', 'AE', 'OM'],
    total_area_approx: '3,091,096 كم²',
    countries: [],
    key_features: [
      'أكبر احتياطيات النفط والغاز الطبيعي المسال عالمياً',
      'مراكز مالية وتقنية ولوجستية رائدة عالمياً (دبي، الرياض، الدوحة، الكويت، أبوظبي)',
      'نهضة سياحية وبنية تحتية ومطارات وموانئ هي الأحدث دولياً',
      'تسارع استثنائي نحو الاقتصاد المعرفي والذكاء الاصطناعي وتنويع المداخيل'
    ]
  },
  {
    id: 'south_arabia',
    name_ar: 'جنوب الجزيرة العربية',
    name_en: 'Southern Arabian Peninsula',
    description_ar: 'أصل العروبة وموطن ممالك سبأ وحمير، وتتميز بجغرافيا هي الأكثر تنوعاً في الجزيرة العربية وأرخبيل سقطرى النادر.',
    countries_count: 1,
    countries_codes: ['YE'],
    total_area_approx: '527,968 كم²',
    countries: [],
    key_features: [
      'جبال شامخة ومدرجات زراعية فريدة من نوعها عالمياً',
      'أرخبيل سقطرى المدرج على قائمة التراث الطبيعي العالمي لليونسكو',
      'موقع استراتيجي على مضيق باب المندب وبحر العرب وخليج عدن',
      'تراث معماري وتاريخي عريق في مدن صنعاء وشبام وعدن وتريم'
    ]
  }
];

export function registerCountryProfileRoutes(app: Express, demoData: any, queryDb: any) {
  // 1. Get detailed unified country profile with integrated GKE facts, jobs, and services
  app.get('/api/countries/:code/profile', async (req: Request, res: Response) => {
    try {
      const code = req.params.code?.toUpperCase();
      const profile = (ALL_GLOBAL_COUNTRIES_PROFILES as any)[code];

      if (!profile) {
        return res.status(404).json({
          ok: false,
          error: `Country profile with code '${code}' not found in registry.`
        });
      }

      // Fetch active jobs for this country
      let jobs: any[] = [];
      try {
        const dbJobs = await queryDb(
          `SELECT j.*, co.name_ar as company_name, ci.name_ar as city_name 
           FROM jobs j 
           LEFT JOIN companies co ON co.id=j.company_id 
           LEFT JOIN cities ci ON ci.id=j.city_id 
           JOIN countries cnt ON cnt.id=j.country_id
           WHERE cnt.code=$1 AND j.active=true 
           ORDER BY j.created_at DESC LIMIT 10`,
          [code]
        );
        if (dbJobs && dbJobs.length > 0) {
          jobs = dbJobs;
        } else {
          jobs = demoData.jobs.filter((j: any) => j.country_code === code);
        }
      } catch (err) {
        jobs = demoData.jobs.filter((j: any) => j.country_code === code);
      }

      // Fetch active services for this country
      let services: any[] = [];
      try {
        const dbServices = await queryDb(
          `SELECT s.*, ci.name_ar as city_name 
           FROM services s 
           LEFT JOIN cities ci ON ci.id=s.city_id 
           JOIN countries cnt ON cnt.id=s.country_id
           WHERE cnt.code=$1 AND s.active=true 
           ORDER BY s.featured DESC, s.created_at DESC LIMIT 10`,
          [code]
        );
        if (dbServices && dbServices.length > 0) {
          services = dbServices;
        } else {
          services = demoData.services.filter((s: any) => s.country_code === code);
        }
      } catch (err) {
        services = demoData.services.filter((s: any) => s.country_code === code);
      }

      // Fetch associated GKE facts from Darb Global Knowledge Engine
      const gkeCountry = DarbGlobalKnowledgeEngine.getCountry(code);
      const gkeFacts = gkeCountry ? gkeCountry.facts : [];
      const gkeSources = gkeCountry ? gkeCountry.sources : [];

      // Fetch detailed cities with area, customs, industries, and landmarks
      const detailedCities = getCitiesByCountryCode(code);
      const profileCities = detailedCities.length > 0 ? detailedCities : profile.cities;

      // Combine profile with live platform data
      const countryProvinces = getProvincesByCountryCode(code);
      const mergedProfile = {
        ...profile,
        cities: profileCities,
        provinces: countryProvinces,
        provinces_detailed: countryProvinces,
        provinces_count: countryProvinces.length > 0 ? countryProvinces.length : profile.provinces_count,
        outings: getCountryOutings(code),
        jobs_count: jobs.length,
        services_count: services.length,
        recent_jobs: jobs,
        recent_services: services,
        gke_facts_count: gkeFacts.length,
        gke_facts: gkeFacts,
        gke_sources: gkeSources,
        governance: {
          auto_publish: false,
          human_review_required: true,
          reference_data_is_live: false,
          economic_disclaimer: profile.economic_disclaimer,
          seasonal_disclaimer: 'المواسم المناخية معلومة مرجعية استرشادية ولا تمثل توصية سفر تلقائية؛ يتطلب السفر التحقق من الحالة الأمنية والتأشيرات الرسمية.'
        }
      };

      res.json({
        ok: true,
        success: true,
        data: mergedProfile
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch country profile' });
    }
  });

  // Dedicated endpoint for country provinces & administrative states
  app.get('/api/countries/:code/provinces', (req: Request, res: Response) => {
    try {
      const code = req.params.code?.toUpperCase();
      const provinces = getProvincesByCountryCode(code);
      res.json({
        ok: true,
        success: true,
        country_code: code,
        provinces_count: provinces.length,
        data: provinces
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch country provinces' });
    }
  });

  // Dedicated endpoint for all provinces registry across Arab & foreign countries
  app.get('/api/countries/provinces/all', (_req: Request, res: Response) => {
    try {
      res.json({
        ok: true,
        success: true,
        total_countries: Object.keys(COUNTRY_PROVINCES_REGISTRY).length,
        data: COUNTRY_PROVINCES_REGISTRY
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch all provinces registry' });
    }
  });

  // Dedicated endpoint for country outings and leisure
  app.get('/api/countries/:code/outings', (req: Request, res: Response) => {
    try {
      const code = req.params.code?.toUpperCase();
      const outings = getCountryOutings(code);
      res.json({ ok: true, data: outings });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch outings' });
    }
  });

  // 2. Get lightweight summary of all country profiles (Arab + Global)
  app.get('/api/countries/profiles/summary', (_req: Request, res: Response) => {
    try {
      const summaries = Object.values(ALL_GLOBAL_COUNTRIES_PROFILES).map((p: any) => {
        const dCities = getCitiesByCountryCode(p.country_code);
        const isArab = !!COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[p.country_code];
        const isEurope = ['TR', 'GB', 'DE', 'FR', 'IT', 'ES', 'CH', 'AT', 'NL', 'GE', 'BA'].includes(p.country_code);
        const isAmericas = ['US', 'CA', 'BR'].includes(p.country_code);
        const isAsia = ['MY', 'TH', 'ID', 'SG', 'JP', 'KR', 'CN', 'AU'].includes(p.country_code);

        let continent = 'AFRICA';
        if (isArab) continent = 'ARAB';
        else if (isEurope) continent = 'EUROPE';
        else if (isAmericas) continent = 'AMERICAS';
        else if (isAsia) continent = 'ASIA';

        return {
          country_code: p.country_code,
          name_ar: p.name_ar,
          name_en: p.name_en,
          capital: p.capital,
          flag: p.flag,
          currency: p.currency,
          currency_symbol: p.currency_symbol,
          population: p.population,
          area_sq_km: p.area_sq_km,
          timezone: p.timezone,
          calling_code: p.calling_code,
          domain_tld: p.domain_tld,
          cities_count: dCities.length > 0 ? dCities.length : (p.cities?.length || 0),
          landmarks_count: p.landmarks?.length || 0,
          confidence: p.confidence || 0.98,
          freshness_status: p.freshness_status || 'fresh',
          continent,
          is_arab: isArab
        };
      });

      // Sort with Arab countries first (Egypt first), then foreign countries
      summaries.sort((a, b) => {
        if (a.is_arab && !b.is_arab) return -1;
        if (!a.is_arab && b.is_arab) return 1;
        if (a.country_code === 'EG') return -1;
        if (b.country_code === 'EG') return 1;
        return a.name_ar.localeCompare(b.name_ar, 'ar');
      });

      res.json({
        ok: true,
        success: true,
        count: summaries.length,
        data: summaries,
        governance: {
          auto_publish: false,
          freshness_policy: '30_days_aging_90_days_stale'
        }
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch country summaries' });
    }
  });

  // =========================================================================
  // PHASE 2 ANALYTICS ENDPOINTS (المرحلة الثانية: التحليل المقارن والإقليمي)
  // =========================================================================

  // 3. GET /api/countries/analytics/regions - Five Geographic Arab Regions
  app.get('/api/countries/analytics/regions', (_req: Request, res: Response) => {
    try {
      const populatedRegions = ARAB_REGIONS_DEFINITION.map((region) => {
        const countryItems = region.countries_codes.map((code) => {
          const profile = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[code];
          return {
            country_code: code,
            name_ar: profile ? profile.name_ar : code,
            name_en: profile ? profile.name_en : code,
            flag: profile ? profile.flag : '🌐',
            capital: profile ? profile.capital : '',
            area_sq_km: profile ? profile.area_sq_km : '',
            population: profile ? profile.population : ''
          };
        });

        return {
          ...region,
          countries: countryItems
        };
      });

      res.json({
        ok: true,
        success: true,
        count: populatedRegions.length,
        data: populatedRegions,
        governance: {
          reference_source: 'وثيقة دَرْب الجغرافية المعتمدة - مصدر معلومات الدول العربية الـ22',
          verified_at: '2026-09-22',
          auto_publish: false
        }
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch regions' });
    }
  });

  // 4. GET /api/countries/analytics/macroeconomics - Pan-Arab 2025 Macroeconomic Overview
  app.get('/api/countries/analytics/macroeconomics', (_req: Request, res: Response) => {
    try {
      const overview: MacroeconomicOverview = {
        total_nominal_gdp_usd: 'نحو 3.8 تريليون دولار أمريكي (2025 - تقديرات البنك الدولي)',
        average_growth_rate: '3.7% (2025 - البنك الدولي وصندوق النقد الدولي)',
        source_agency: 'البنك الدولي (World Bank) وصندوق النقد الدولي (IMF) 2025',
        governance_advisory: 'مؤشرات مرجعية عامة لتكوين صورة كلية للاقتصاد العربي؛ تختلف المنهجيات والتقلبات باختلاف أسعار الطاقة وتدفقات الاستثمار.',
        critical_volatility_warning: 'تنبيه تحليلي حاسم: ارتفاع معدل النمو في بعض الدول (مثل ليبيا) لا يعني بالضرورة تحسناً اقتصادياً مستداماً؛ فمعدلات النمو في الاقتصادات النفطية التي تمر بتغيرات حادة في إنتاج وتصدير النفط بعد انقطاع قد تتقلب بشدة من سنة لأخرى. وهذا سبب رئيسي لعدم استخدام معدل النمو السنوي وحده للحكم على قوة أو استقرار اقتصاد أي دولة.',
        gulf_diversification_trends: 'تشير تقارير صندوق النقد الدولي والبنك الدولي لعام 2025 إلى تسارع ملحوظ في دول مجلس التعاون الخليجي نحو زيادة مساهمة القطاعات غير النفطية (السياحة، الخدمات اللوجستية، الصناعات المتقدمة، التكنولوجيا والذكاء الاصطناعي)، مع تفاوت سرعة التنويع الهيكلي بين دولة وأخرى.',
        categories: {
          oil_and_gas: {
            title_ar: 'اقتصادات النفط والغاز',
            description_ar: 'تعتمد بدرجة أساسية على عوائد المحروقات والطاقة، مع مسارات متسارعة للتنويع الاقتصادي الوطني.',
            countries: ['السعودية', 'الإمارات', 'قطر', 'الكويت', 'الجزائر', 'العراق', 'ليبيا', 'عُمان', 'البحرين']
          },
          diversified: {
            title_ar: 'اقتصادات متنوعة نسبياً',
            description_ar: 'تعتمد على مزيج متوازن من الصناعات التحويلية، الزراعة، التجارة، الخدمات المالية والسياحة وتكنولوجيا المعلومات.',
            countries: ['مصر', 'المغرب', 'الإمارات', 'السعودية', 'تونس', 'الأردن']
          },
          agriculture_mining_services: {
            title_ar: 'اقتصادات تعتمد على الزراعة / المعادن / المساعدات والخدمات',
            description_ar: 'قطاعات أساسية أولية غنية بالموارد الطبيعية، تحتاج إلى تعزيز استدامة سلاسل الإمداد والبنية التحتية.',
            countries: ['موريتانيا', 'السودان', 'الصومال', 'جزر القمر', 'جيبوتي', 'اليمن', 'سوريا', 'فلسطين']
          }
        },
        growth_sample_2025: [
          { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬', growth_rate: '3.8% – 4.2%', category: 'اقتصاد متنوع' },
          { country_code: 'SA', name_ar: 'السعودية', flag: '🇸🇦', growth_rate: '4.4% – 4.7%', category: 'نفط وغاز / تنويع قطاعات غير نفطية' },
          { country_code: 'AE', name_ar: 'الإمارات', flag: '🇦🇪', growth_rate: '4.0% – 4.2%', category: 'تنويع متقدم وسياحة وخدمات مالية' },
          { country_code: 'QA', name_ar: 'قطر', flag: '🇶🇦', growth_rate: '2.2% – 2.5%', category: 'طاقة وغاز طبيعي مسال' },
          { country_code: 'MA', name_ar: 'المغرب', flag: '🇲🇦', growth_rate: '3.5% – 3.7%', category: 'صناعة وسيارات وزراعة وسياحة' },
          { country_code: 'DZ', name_ar: 'الجزائر', flag: '🇩🇿', growth_rate: '3.1% – 3.3%', category: 'طاقة ومحروقات وتعدين' },
          { country_code: 'LY', name_ar: 'ليبيا', flag: '🇱🇾', growth_rate: 'تقلب حاد (انتعاش إنتاج)', category: 'اقتصاد نفطي متقلب', governance_note: 'تخضع لتقلبات الإنتاج النفطي، لا يعبر النمو وحده عن استدامة' },
          { country_code: 'YE', name_ar: 'اليمن', flag: '🇾🇪', growth_rate: '-1.5% (انكماش مرجعي وفق IMF)', category: 'تحديات اقتصادية وإنسانية' }
        ]
      };

      res.json({
        ok: true,
        success: true,
        data: overview
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch macroeconomics' });
    }
  });

  // 5. GET /api/countries/analytics/rankings - Area and Population Rankings
  app.get('/api/countries/analytics/rankings', (_req: Request, res: Response) => {
    try {
      // Area Ranking
      const areaList: CountryRankingItem[] = Object.keys(NUMERIC_AREA_KM2)
        .map((code) => {
          const profile = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[code];
          const val = NUMERIC_AREA_KM2[code];
          return {
            rank: 0,
            country_code: code,
            name_ar: profile ? profile.name_ar : code,
            flag: profile ? profile.flag : '🌐',
            numeric_value: val,
            display_value: val.toLocaleString('ar-EG') + ' كم²',
            unit: 'كم²',
            secondary_note: profile ? profile.capital : ''
          };
        })
        .sort((a, b) => b.numeric_value - a.numeric_value)
        .map((item, idx) => ({ ...item, rank: idx + 1 }));

      const totalArabArea = Object.values(NUMERIC_AREA_KM2).reduce((a, b) => a + b, 0);

      res.json({
        ok: true,
        success: true,
        data: {
          area_rankings: areaList,
          largest_10: areaList.slice(0, 10),
          smallest_7: areaList.slice(-7).reverse(),
          total_arab_area_km2: totalArabArea,
          total_arab_area_display: totalArabArea.toLocaleString('ar-EG') + ' كم² (نحو 13.1 مليون كم²)'
        }
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch rankings' });
    }
  });

  // 6. GET /api/countries/analytics/tourism-seasons - Visiting Seasons Matrix & Travel Safety
  app.get('/api/countries/analytics/tourism-seasons', (_req: Request, res: Response) => {
    try {
      const seasonsMatrix = Object.values(COMPREHENSIVE_ARAB_COUNTRIES_PROFILES).map((p) => {
        const primarySeason = p.visiting_seasons && p.visiting_seasons[0];
        return {
          country_code: p.country_code,
          name_ar: p.name_ar,
          flag: p.flag,
          capital: p.capital,
          season_name: primarySeason ? primarySeason.season : 'المواسم المعتدلة',
          months: primarySeason ? primarySeason.months : 'أكتوبر – أبريل',
          climate_summary: primarySeason ? primarySeason.climate_description : p.climate,
          security_alert: p.travel_security_alert || {
            level: 'normal',
            text_ar: 'الوضع الأمني مستقر اعتيادياً',
            source: 'المصادر الرسمية',
            verified_at: '2026-09-22'
          },
          governance_note: 'المعلومات المناخية استرشادية بحتة ولا تُعد تصريحاً أو توصية سفر؛ يجب مراجعة السفارات وإرشادات الطيران قبل حجز التذاكر.'
        };
      });

      res.json({
        ok: true,
        success: true,
        count: seasonsMatrix.length,
        data: seasonsMatrix,
        governance_disclaimer: 'الوضع الأمني والسياسي الحالي قد يجعل المناخ وحده غير كافٍ لتحديد صلاحية السفر في بعض الوجهات العربية.'
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch tourism seasons' });
    }
  });

  // 7. POST /api/countries/compare - Cross-Country Interactive Comparator
  app.post('/api/countries/compare', (req: Request, res: Response) => {
    try {
      const { country_codes } = req.body;
      if (!Array.isArray(country_codes) || country_codes.length < 2) {
        return res.status(400).json({
          ok: false,
          error: 'يرجى تحديد دولتين على الأقل للمقارنة المباشرة (بين 2 و 4 دول).'
        });
      }

      const selectedCodes = country_codes.slice(0, 4).map((c: string) => c.toUpperCase());
      const selectedProfiles = selectedCodes
        .map((code) => COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[code])
        .filter(Boolean);

      if (selectedProfiles.length < 2) {
        return res.status(400).json({
          ok: false,
          error: 'لم يتم العثور على ملفات تعريف كافية للدول المطلوبة.'
        });
      }

      // Build comparison metrics
      const areaComparison = selectedProfiles.map((p) => ({
        country_code: p.country_code,
        name_ar: p.name_ar,
        flag: p.flag,
        area: p.area_sq_km,
        numeric_km2: NUMERIC_AREA_KM2[p.country_code] || 0
      }));

      const populationComparison = selectedProfiles.map((p) => ({
        country_code: p.country_code,
        name_ar: p.name_ar,
        flag: p.flag,
        population: p.population
      }));

      const economyComparison = selectedProfiles.map((p) => ({
        country_code: p.country_code,
        name_ar: p.name_ar,
        flag: p.flag,
        gdp: p.gdp_reference,
        growth: p.growth_rate_reference,
        classification: ECONOMIC_CLASSIFICATIONS[p.country_code] || 'diversified'
      }));

      const qualityOfLife = selectedProfiles.map((p) => {
        const cities = p.cities || [];
        const avgSafety = cities.length > 0
          ? Math.round(cities.reduce((acc, c) => acc + (c.safety_score || 80), 0) / cities.length)
          : 80;
        const avgInternet = cities.length > 0
          ? Math.round(cities.reduce((acc, c) => acc + (c.internet_score || 75), 0) / cities.length)
          : 75;
        const avgCost = cities.length > 0
          ? Math.round(cities.reduce((acc, c) => acc + (c.cost_index || 50), 0) / cities.length)
          : 50;

        return {
          country_code: p.country_code,
          name_ar: p.name_ar,
          flag: p.flag,
          avg_safety: avgSafety,
          avg_internet: avgInternet,
          avg_cost: avgCost
        };
      });

      const currencyAndTime = selectedProfiles.map((p) => ({
        country_code: p.country_code,
        name_ar: p.name_ar,
        flag: p.flag,
        currency: `${p.currency} (${p.currency_symbol})`,
        timezone: p.timezone,
        calling_code: p.calling_code
      }));

      const seasons = selectedProfiles.map((p) => ({
        country_code: p.country_code,
        name_ar: p.name_ar,
        flag: p.flag,
        best_season: p.visiting_seasons && p.visiting_seasons[0] ? p.visiting_seasons[0].season : 'الخريف والربيع',
        best_months: p.visiting_seasons && p.visiting_seasons[0] ? p.visiting_seasons[0].months : 'أكتوبر - أبريل',
        advisory: p.travel_security_alert ? p.travel_security_alert.text_ar : 'مستقر اعتيادياً'
      }));

      const namesJoined = selectedProfiles.map((p) => p.name_ar).join(' و ');
      const aiPrompts = [
        `قارن لي بين تكاليف المعيشة ومتوسط الرواتب بين ${namesJoined}`,
        `ما هي شروط وإجراءات الحصول على تأشيرة العمل والإقامة بين ${namesJoined}؟`,
        `ما هي أفضل أشهر الزيارة والمعالم السياحية الرئيسية بين ${namesJoined}؟`,
        `قارن لي بين قطاعات النمو وفرص العمل التقنية بين ${namesJoined}`
      ];

      const result: CountryComparisonResult = {
        countries: selectedProfiles,
        metrics: {
          area_comparison: areaComparison,
          population_comparison: populationComparison,
          economy_comparison: economyComparison,
          quality_of_life: qualityOfLife,
          currency_and_time: currencyAndTime,
          seasons: seasons
        },
        ai_comparison_prompts: aiPrompts
      };

      res.json({
        ok: true,
        success: true,
        data: result
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to compare countries' });
    }
  });

  // =========================================================================
  // PHASE 3: GEOSPATIAL ATLAS, CORRIDORS & SPATIAL HUBS
  // =========================================================================
  const STRATEGIC_STRAITS_DATA: StrategicStrait[] = [
    {
      id: 'suez_canal',
      name_ar: 'قناة السويس',
      name_en: 'Suez Canal',
      associated_countries: ['EG'],
      description_ar: 'الممر المائي الاصطناعي الأهم عالمياً، يربط بين البحرين الأبيض المتوسط والأحمر دون الدوران حول أفريقيا.',
      global_significance_ar: 'يمر عبرها نحو 12% من إجمالي حركة التجارة العالمية وقرابة 30% من حركة سفن الحاويات العالمية.',
      coordinates: { lat: 30.705, lng: 32.344 }
    },
    {
      id: 'bab_el_mandeb',
      name_ar: 'مضيق باب المندب',
      name_en: 'Bab el-Mandeb Strait',
      associated_countries: ['DJ', 'YE', 'SO'],
      description_ar: 'البوابة الجنوبية للبحر الأحمر، يفصل بين شبه الجزيرة العربية والقرن الأفريقي ويربط البحر الأحمر بخليج عدن وبحر العرب.',
      global_significance_ar: 'شريان حيوي لنقل نفط الخليج والسلع التجارية بين آسيا وأوروبا، بعرض يقارب 30 كم.',
      coordinates: { lat: 12.583, lng: 43.333 }
    },
    {
      id: 'strait_of_hormuz',
      name_ar: 'مضيق هرمز',
      name_en: 'Strait of Hormuz',
      associated_countries: ['OM', 'AE'],
      description_ar: 'المنفذ البحري الاستراتيجي الوحيد للخليج العربي إلى خليج عمان وبحر العرب والمحيط الهندي.',
      global_significance_ar: 'أهم شريان نفطي في العالم؛ يعبر منه يومياً نحو خُمس (20%) استهلاك النفط السائل عالمياً.',
      coordinates: { lat: 26.566, lng: 56.25 }
    },
    {
      id: 'strait_of_gibraltar',
      name_ar: 'مضيق جبل طارق',
      name_en: 'Strait of Gibraltar',
      associated_countries: ['MA'],
      description_ar: 'المدخل الغربي الحاكم للبحر الأبيض المتوسط والفاصل بين القارة الأفريقية (المغرب) والأوروبية.',
      global_significance_ar: 'ممر تجاري عالمي يعبره أكثر من 100,000 سفينة سنوياً، وتطل عليه موانئ طنجة المتوسطية العملاقة.',
      coordinates: { lat: 35.964, lng: -5.6 }
    },
    {
      id: 'straits_of_tiran',
      name_ar: 'مضيق تيران',
      name_en: 'Straits of Tiran',
      associated_countries: ['EG', 'SA'],
      description_ar: 'الممر البحري الضيق الرابط بين خليج العقبة والبحر الأحمر، بين شبه جزيرة سيناء والمملكة العربية السعودية.',
      global_significance_ar: 'منفذ ملاحي محوري للموانئ الأردنية (العقبة) والمصرية والسعودية في خليج العقبة ومشروع جسر الملك سلمان.',
      coordinates: { lat: 28.007, lng: 34.464 }
    }
  ];

  const STRATEGIC_SEAPORTS_DATA: StrategicMaritimePort[] = [
    {
      name_ar: 'ميناء طنجة المتوسط',
      country_code: 'MA',
      country_name_ar: 'المملكة المغربية',
      city: 'طنجة',
      water_body: 'مضيق جبل طارق والبحر المتوسط',
      annual_capacity_teu: '9+ مليون حاوية نمطية',
      strategic_note: 'الميناء الأول في حوض المتوسط وأفريقيا من حيث مناولة الحاويات وربط الخطوط العالمية.',
      coordinates: { lat: 35.889, lng: -5.503 }
    },
    {
      name_ar: 'ميناء جبل علي',
      country_code: 'AE',
      country_name_ar: 'الإمارات العربية المتحدة',
      city: 'دبي',
      water_body: 'الخليج العربي',
      annual_capacity_teu: '15+ مليون حاوية نمطية',
      strategic_note: 'أكبر ميناء اصطناعي في العالم وأكبر ميناء في الشرق الأوسط، ومحور إعادة التصدير الإقليمي.',
      coordinates: { lat: 25.011, lng: 55.061 }
    },
    {
      name_ar: 'ميناء جدة الإسلامي',
      country_code: 'SA',
      country_name_ar: 'المملكة العربية السعودية',
      city: 'جدة',
      water_body: 'البحر الأحمر',
      annual_capacity_teu: '6+ مليون حاوية نمطية',
      strategic_note: 'الميناء المحوري الأول للمملكة على ساحل البحر الأحمر وبوابة الصادرات والواردات الغربية.',
      coordinates: { lat: 21.465, lng: 39.172 }
    },
    {
      name_ar: 'ميناء شرق بورسعيد',
      country_code: 'EG',
      country_name_ar: 'جمهورية مصر العربية',
      city: 'بورسعيد',
      water_body: 'المدخل الشمالي لقناة السويس / البحر المتوسط',
      annual_capacity_teu: '5+ مليون حاوية نمطية',
      strategic_note: 'محور ترانزيت عالمي رائد ومصنف بين أعلى موانئ العالم كفاءة وفق مؤشرات البنك الدولي.',
      coordinates: { lat: 31.229, lng: 32.341 }
    },
    {
      name_ar: 'ميناء الملك عبد العزيز',
      country_code: 'SA',
      country_name_ar: 'المملكة العربية السعودية',
      city: 'الدمام',
      water_body: 'الخليج العربي',
      annual_capacity_teu: '3.5+ مليون حاوية نمطية',
      strategic_note: 'بوابة المنطقة الشرقية والوسطى على الخليج العربي ومتصل بالخط الحديدي إلى الرياض.',
      coordinates: { lat: 26.446, lng: 50.187 }
    },
    {
      name_ar: 'ميناء صلالة',
      country_code: 'OM',
      country_name_ar: 'سلطنة عُمان',
      city: 'صلالة',
      water_body: 'بحر العرب والمحيط الهندي',
      annual_capacity_teu: '4.5+ مليون حاوية نمطية',
      strategic_note: 'موقع فريد خارج مضيق هرمز ومباشر على خطوط الشحن بين آسيا وأوروبا مع كفاءة مناولة فائقة.',
      coordinates: { lat: 16.945, lng: 54.004 }
    },
    {
      name_ar: 'ميناء الدقم',
      country_code: 'OM',
      country_name_ar: 'سلطنة عُمان',
      city: 'الدقم',
      water_body: 'بحر العرب',
      annual_capacity_teu: 'مركز صناعي وبحري متكامل',
      strategic_note: 'عملاق لوجستي عماني مستقبلي يضم أحواض صيانة جافة ومجمعات بتروكيماوية كبرى.',
      coordinates: { lat: 19.664, lng: 57.702 }
    },
    {
      name_ar: 'ميناء خليفة',
      country_code: 'AE',
      country_name_ar: 'الإمارات العربية المتحدة',
      city: 'أبوظبي',
      water_body: 'الخليج العربي',
      annual_capacity_teu: '4+ مليون حاوية نمطية (مستهدف 15 مليون)',
      strategic_note: 'ميناء شبه آلي بالكامل متصل بمنطقة خليفة الصناعية (كيزاد) بأحدث معايير الأتمتة.',
      coordinates: { lat: 24.795, lng: 54.686 }
    },
    {
      name_ar: 'ميناء حمد الدولي',
      country_code: 'QA',
      country_name_ar: 'دولة قطر',
      city: 'أم الحول / الوكرة',
      water_body: 'الخليج العربي',
      annual_capacity_teu: '7.5 مليون حاوية نمطية (القدرة الكلية)',
      strategic_note: 'أحد أحدث الموانئ الخضراء والذكية في المنطقة وبوابة قطر للتجارة الخارجية.',
      coordinates: { lat: 25.041, lng: 51.603 }
    },
    {
      name_ar: 'ميناء الإسكندرية الكبير',
      country_code: 'EG',
      country_name_ar: 'جمهورية مصر العربية',
      city: 'الإسكندرية',
      water_body: 'البحر الأبيض المتوسط',
      annual_capacity_teu: '60% من تجارة مصر الخارجية',
      strategic_note: 'أعرق ميناء تجاري مصري يضم محطة تحيا مصر متعددة الأغراض والمحطات الحديثة.',
      coordinates: { lat: 31.189, lng: 29.866 }
    },
    {
      name_ar: 'ميناء الجزائر وميناء جن جن',
      country_code: 'DZ',
      country_name_ar: 'الجمهورية الجزائرية',
      city: 'الجزائر / جيجل',
      water_body: 'البحر الأبيض المتوسط',
      annual_capacity_teu: 'المحور التجاري الوطني الأبرز',
      strategic_note: 'بوابة الربط البحري التجاري الكبرى للجزائر مع الموانئ الأوروبية والترانزيت الأفريقي.',
      coordinates: { lat: 36.782, lng: 3.072 }
    },
    {
      name_ar: 'ميناء جيبوتي الدولي',
      country_code: 'DJ',
      country_name_ar: 'جمهورية جيبوتي',
      city: 'جيبوتي',
      water_body: 'خليج عدن / مدخل البحر الأحمر',
      annual_capacity_teu: 'بوابة إثيوبيا والقرن الأفريقي',
      strategic_note: 'محطة إعادة شحن وتغذية استراتيجية على مدخل باب المندب تخدم أكثر من 120 مليون نسمة بالمنطقة.',
      coordinates: { lat: 11.601, lng: 43.136 }
    }
  ];

  const STRATEGIC_AIRPORT_HUBS_DATA: StrategicAirportHub[] = [
    {
      iata: 'DXB',
      name_ar: 'مطار دبي الدولي',
      country_code: 'AE',
      city: 'دبي',
      annual_passengers_million: '87+ مليون مسافر',
      hub_airlines: ['طيران الإمارات', 'فلاي دبي'],
      coordinates: { lat: 25.253, lng: 55.365 }
    },
    {
      iata: 'DOH',
      name_ar: 'مطار حمد الدولي',
      country_code: 'QA',
      city: 'الدوحة',
      annual_passengers_million: '45+ مليون مسافر',
      hub_airlines: ['الخطوط الجوية القطرية'],
      coordinates: { lat: 25.273, lng: 51.608 }
    },
    {
      iata: 'JED',
      name_ar: 'مطار الملك عبد العزيز الدولي',
      country_code: 'SA',
      city: 'جدة',
      annual_passengers_million: '42+ مليون مسافر',
      hub_airlines: ['الخطوط السعودية', 'طيران أديل'],
      coordinates: { lat: 21.679, lng: 39.156 }
    },
    {
      iata: 'RUH',
      name_ar: 'مطار الملك خالد الدولي',
      country_code: 'SA',
      city: 'الرياض',
      annual_passengers_million: '32+ مليون مسافر',
      hub_airlines: ['الخطوط السعودية', 'طيران ناس', 'طيران الرياض'],
      coordinates: { lat: 24.957, lng: 46.698 }
    },
    {
      iata: 'CAI',
      name_ar: 'مطار القاهرة الدولي',
      country_code: 'EG',
      city: 'القاهرة',
      annual_passengers_million: '26+ مليون مسافر',
      hub_airlines: ['مصر للطيران', 'إير كايرو'],
      coordinates: { lat: 30.121, lng: 31.405 }
    },
    {
      iata: 'AUH',
      name_ar: 'مطار زايد الدولي',
      country_code: 'AE',
      city: 'أبوظبي',
      annual_passengers_million: '23+ مليون مسافر',
      hub_airlines: ['الاتحاد للطيران', 'العربية للطيران أبوظبي'],
      coordinates: { lat: 24.433, lng: 54.651 }
    },
    {
      iata: 'CMN',
      name_ar: 'مطار محمد الخامس الدولي',
      country_code: 'MA',
      city: 'الدار البيضاء',
      annual_passengers_million: '10+ مليون مسافر',
      hub_airlines: ['الخطوط الملكية المغربية'],
      coordinates: { lat: 33.367, lng: -7.589 }
    },
    {
      iata: 'KWI',
      name_ar: 'مطار الكويت الدولي',
      country_code: 'KW',
      city: 'الكويت',
      annual_passengers_million: '15+ مليون مسافر',
      hub_airlines: ['الخطوط الجوية الكويتية', 'طيران الجزيرة'],
      coordinates: { lat: 29.226, lng: 47.988 }
    },
    {
      iata: 'BAH',
      name_ar: 'مطار البحرين الدولي',
      country_code: 'BH',
      city: 'المنامة / المحرق',
      annual_passengers_million: '9+ مليون مسافر',
      hub_airlines: ['طيران الخليج'],
      coordinates: { lat: 26.27, lng: 50.633 }
    },
    {
      iata: 'MCT',
      name_ar: 'مطار مسقط الدولي',
      country_code: 'OM',
      city: 'مسقط',
      annual_passengers_million: '12+ مليون مسافر',
      hub_airlines: ['الطيران العماني', 'طيران السلام'],
      coordinates: { lat: 23.593, lng: 58.284 }
    },
    {
      iata: 'AMM',
      name_ar: 'مطار الملكة علياء الدولي',
      country_code: 'JO',
      city: 'عمّان',
      annual_passengers_million: '9+ مليون مسافر',
      hub_airlines: ['الملكية الأردنية'],
      coordinates: { lat: 31.722, lng: 35.993 }
    },
    {
      iata: 'ALG',
      name_ar: 'مطار هواري بومدين الدولي',
      country_code: 'DZ',
      city: 'الجزائر',
      annual_passengers_million: '8+ مليون مسافر',
      hub_airlines: ['الخطوط الجوية الجزائرية'],
      coordinates: { lat: 36.691, lng: 3.215 }
    }
  ];

  // Benchmark exchange rates to USD (2025/2026 reference)
  const ARAB_CURRENCIES_LIST: PanArabCurrencyRate[] = [
    { currency_code: 'EGP', currency_symbol: 'ج.م', name_ar: 'الجنيه المصري', country_code: 'EG', rate_to_usd: 48.80, last_updated: '2025-Q1' },
    { currency_code: 'SAR', currency_symbol: 'ر.س', name_ar: 'الريال السعودي', country_code: 'SA', rate_to_usd: 3.75, last_updated: '2025-Q1' },
    { currency_code: 'AED', currency_symbol: 'د.إ', name_ar: 'الدرهم الإماراتي', country_code: 'AE', rate_to_usd: 3.67, last_updated: '2025-Q1' },
    { currency_code: 'KWD', currency_symbol: 'د.ك', name_ar: 'الدينار الكويتي', country_code: 'KW', rate_to_usd: 0.308, last_updated: '2025-Q1' },
    { currency_code: 'QAR', currency_symbol: 'ر.ق', name_ar: 'الريال القطري', country_code: 'QA', rate_to_usd: 3.64, last_updated: '2025-Q1' },
    { currency_code: 'BHD', currency_symbol: 'د.ب', name_ar: 'الدينار البحريني', country_code: 'BH', rate_to_usd: 0.376, last_updated: '2025-Q1' },
    { currency_code: 'OMR', currency_symbol: 'ر.ع', name_ar: 'الريال العماني', country_code: 'OM', rate_to_usd: 0.385, last_updated: '2025-Q1' },
    { currency_code: 'JOD', currency_symbol: 'د.أ', name_ar: 'الدينار الأردني', country_code: 'JO', rate_to_usd: 0.709, last_updated: '2025-Q1' },
    { currency_code: 'MAD', currency_symbol: 'د.م', name_ar: 'الدرهم المغربي', country_code: 'MA', rate_to_usd: 9.85, last_updated: '2025-Q1' },
    { currency_code: 'DZD', currency_symbol: 'د.ج', name_ar: 'الدينار الجزائري', country_code: 'DZ', rate_to_usd: 133.50, last_updated: '2025-Q1' },
    { currency_code: 'TND', currency_symbol: 'د.ت', name_ar: 'الدينار التونسي', country_code: 'TN', rate_to_usd: 3.12, last_updated: '2025-Q1' },
    { currency_code: 'LYD', currency_symbol: 'د.ل', name_ar: 'الدينار الليبي', country_code: 'LY', rate_to_usd: 4.85, last_updated: '2025-Q1' },
    { currency_code: 'IQD', currency_symbol: 'د.ع', name_ar: 'الدينار العراقي', country_code: 'IQ', rate_to_usd: 1310.0, last_updated: '2025-Q1' },
    { currency_code: 'SDG', currency_symbol: 'ج.س', name_ar: 'الجنيه السوداني', country_code: 'SD', rate_to_usd: 601.0, last_updated: '2025-Q1' },
    { currency_code: 'LBP', currency_symbol: 'ل.ل', name_ar: 'الليرة اللبنانية', country_code: 'LB', rate_to_usd: 89500.0, last_updated: '2025-Q1' },
    { currency_code: 'SYP', currency_symbol: 'ل.س', name_ar: 'الليرة السورية', country_code: 'SY', rate_to_usd: 13000.0, last_updated: '2025-Q1' },
    { currency_code: 'YER', currency_symbol: 'ر.ي', name_ar: 'الريال اليمني', country_code: 'YE', rate_to_usd: 250.0, last_updated: '2025-Q1' },
    { currency_code: 'MRU', currency_symbol: 'أ.م', name_ar: 'الأوقية الموريتانية', country_code: 'MR', rate_to_usd: 39.80, last_updated: '2025-Q1' },
    { currency_code: 'DJF', currency_symbol: 'ف.ج', name_ar: 'الفرنك الجيبوتي', country_code: 'DJ', rate_to_usd: 177.72, last_updated: '2025-Q1' },
    { currency_code: 'SOS', currency_symbol: 'ش.ص', name_ar: 'الشلن الصومالي', country_code: 'SO', rate_to_usd: 571.0, last_updated: '2025-Q1' },
    { currency_code: 'KMF', currency_symbol: 'ف.ق', name_ar: 'الفرنك القمري', country_code: 'KM', rate_to_usd: 455.0, last_updated: '2025-Q1' },
    { currency_code: 'JOD', currency_symbol: 'د.أ', name_ar: 'الدينار الأردني والدولار (المتداول في فلسطين)', country_code: 'PS', rate_to_usd: 0.71, last_updated: '2025-Q1' }
  ];

  // Centroid Coordinates for the 22 Arab Countries
  const ARAB_COUNTRY_CENTROIDS: Record<string, { lat: number; lng: number }> = {
    DZ: { lat: 28.0339, lng: 1.6596 },
    SA: { lat: 23.8859, lng: 45.0792 },
    SD: { lat: 12.8628, lng: 30.2176 },
    LY: { lat: 26.3351, lng: 17.2283 },
    MR: { lat: 21.0079, lng: -10.9408 },
    EG: { lat: 26.8206, lng: 30.8025 },
    MA: { lat: 31.7917, lng: -7.0926 },
    SO: { lat: 5.1521, lng: 46.1996 },
    YE: { lat: 15.5527, lng: 48.5164 },
    IQ: { lat: 33.2232, lng: 43.6793 },
    OM: { lat: 21.5126, lng: 55.9233 },
    SY: { lat: 34.8021, lng: 38.9968 },
    TN: { lat: 33.8869, lng: 9.5375 },
    JO: { lat: 30.5852, lng: 36.2384 },
    AE: { lat: 23.4241, lng: 53.8478 },
    PS: { lat: 31.9522, lng: 35.2332 },
    DJ: { lat: 11.8251, lng: 42.5903 },
    KW: { lat: 29.3117, lng: 47.4818 },
    QA: { lat: 25.3548, lng: 51.1839 },
    LB: { lat: 33.8547, lng: 35.8623 },
    KM: { lat: -11.8756, lng: 43.8722 },
    BH: { lat: 26.0667, lng: 50.5577 }
  };

  // In-Memory Annual Country Updates Registry (Initialized with 2025/2026 data)
  const ANNUAL_UPDATES_REGISTRY: AnnualCountryUpdate[] = [
    { country_code: 'EG', country_name_ar: 'جمهورية مصر العربية', flag: '🇪🇬', year: 2025, population_estimate: '106.5 مليون نسمة', nominal_gdp_usd: '400 مليار $', growth_rate_pct: '4.1%', primary_source: 'الجهاز المركزي للتعبئة العامة والإحصاء وصندوق النقد 2025', governance_audit_note: 'مؤشر مرجعي معتمد', updated_at: '2025-01-15' },
    { country_code: 'SA', country_name_ar: 'المملكة العربية السعودية', flag: '🇸🇦', year: 2025, population_estimate: '32.2 مليون نسمة', nominal_gdp_usd: '1.1 تريليون $', growth_rate_pct: '4.4%', primary_source: 'الهيئة العامة للإحصاء وصندوق النقد الدولي 2025', governance_audit_note: 'تسارع ملحوظ في الأنشطة غير النفطية', updated_at: '2025-01-20' },
    { country_code: 'AE', country_name_ar: 'الإمارات العربية المتحدة', flag: '🇦🇪', year: 2025, population_estimate: '9.5 مليون نسمة', nominal_gdp_usd: '530 مليار $', growth_rate_pct: '4.0%', primary_source: 'المركز الاتحادي للتنافسية والإحصاء 2025', governance_audit_note: 'اقتصاد متنوع رائد عالمياً', updated_at: '2025-01-18' },
    { country_code: 'MA', country_name_ar: 'المملكة المغربية', flag: '🇲🇦', year: 2025, population_estimate: '37.1 مليون نسمة', nominal_gdp_usd: '155 مليار $', growth_rate_pct: '3.6%', primary_source: 'المندوبية السامية للتخطيط والبنك الدولي 2025', governance_audit_note: 'نمو صناعي وسياحي مستقر', updated_at: '2025-01-12' },
    { country_code: 'DZ', country_name_ar: 'الجمهورية الجزائرية', flag: '🇩🇿', year: 2025, population_estimate: '45.6 مليون نسمة', nominal_gdp_usd: '240 مليار $', growth_rate_pct: '3.8%', primary_source: 'الديوان الوطني للإحصائيات وصندوق النقد 2025', governance_audit_note: 'عوائد طاقة واحتياطي أجنبي صلب', updated_at: '2025-01-22' },
    { country_code: 'QA', country_name_ar: 'دولة قطر', flag: '🇶🇦', year: 2025, population_estimate: '3.0 مليون نسمة', nominal_gdp_usd: '235 مليار $', growth_rate_pct: '2.5%', primary_source: 'جهاز التخطيط والإحصاء القطري 2025', governance_audit_note: 'توسعة حقل الشمال للغاز المسال', updated_at: '2025-01-19' },
    { country_code: 'KW', country_name_ar: 'دولة الكويت', flag: '🇰🇼', year: 2025, population_estimate: '4.3 مليون نسمة', nominal_gdp_usd: '165 مليار $', growth_rate_pct: '2.8%', primary_source: 'الإدارة المركزية للإحصاء بالكويت 2025', governance_audit_note: 'مشاريع تطوير الموانئ والنفط', updated_at: '2025-01-17' },
    { country_code: 'OM', country_name_ar: 'سلطنة عُمان', flag: '🇴🇲', year: 2025, population_estimate: '5.2 مليون نسمة', nominal_gdp_usd: '115 مليار $', growth_rate_pct: '3.1%', primary_source: 'المركز الوطني للإحصاء والمعلومات 2025', governance_audit_note: 'رؤية عمان 2040 وضبط المديونية', updated_at: '2025-01-16' },
    { country_code: 'JO', country_name_ar: 'المملكة الأردنية الهاشمية', flag: '🇯🇴', year: 2025, population_estimate: '11.5 مليون نسمة', nominal_gdp_usd: '53 مليار $', growth_rate_pct: '2.6%', primary_source: 'دائرة الإحصاءات العامة الأردنية 2025', governance_audit_note: 'مرونة خدمية وسياحية استرشادية', updated_at: '2025-01-14' },
    { country_code: 'TN', country_name_ar: 'الجمهورية التونسية', flag: '🇹🇳', year: 2025, population_estimate: '12.4 مليون نسمة', nominal_gdp_usd: '52 مليار $', growth_rate_pct: '1.9%', primary_source: 'المعهد الوطني للإحصاء بتونس 2025', governance_audit_note: 'تعافي تدريجي للموسم السياحي', updated_at: '2025-01-11' },
    { country_code: 'IQ', country_name_ar: 'جمهورية العراق', flag: '🇮🇶', year: 2025, population_estimate: '44.5 مليون نسمة', nominal_gdp_usd: '270 مليار $', growth_rate_pct: '3.5%', primary_source: 'وزارة التخطيط العراقية والبنك الدولي 2025', governance_audit_note: 'مشاريع طريق التنمية وإعمار البنى التحتية', updated_at: '2025-01-21' },
    { country_code: 'BH', country_name_ar: 'مملكة البحرين', flag: '🇧🇭', year: 2025, population_estimate: '1.55 مليون نسمة', nominal_gdp_usd: '46 مليار $', growth_rate_pct: '3.3%', primary_source: 'هيئة المعلومات والحكومة الإلكترونية 2025', governance_audit_note: 'توسع القطاع المالي والتقنية المالية', updated_at: '2025-01-15' },
    { country_code: 'LY', country_name_ar: 'دولة ليبيا', flag: '🇱🇾', year: 2025, population_estimate: '7.1 مليون نسمة', nominal_gdp_usd: '48 مليار $', growth_rate_pct: '7.5%', primary_source: 'صندوق النقد والبنك المركزي الليبي 2025', governance_audit_note: 'تنبيه: النمو ناتج عن استئناف إنتاج النفط ولا يمثل استقراراً شاملاً', updated_at: '2025-01-20' },
    { country_code: 'SD', country_name_ar: 'جمهورية السودان', flag: '🇸🇩', year: 2025, population_estimate: '48.1 مليون نسمة', nominal_gdp_usd: '32 مليار $', growth_rate_pct: '-1.8%', primary_source: 'تقديرات المنظمات الدولية والأمم المتحدة 2025', governance_audit_note: 'تأثيرات الأوضاع الإنسانية وظروف عدم الاستقرار', updated_at: '2025-01-10' },
    { country_code: 'YE', country_name_ar: 'الجمهورية اليمنية', flag: '🇾🇪', year: 2025, population_estimate: '34.4 مليون نسمة', nominal_gdp_usd: '21 مليار $', growth_rate_pct: '-1.5%', primary_source: 'تقديرات صندوق النقد الدولي 2025', governance_audit_note: 'تحديات اقتصادية وهيكلية مستمرة وتذبذب العملة', updated_at: '2025-01-10' },
    { country_code: 'PS', country_name_ar: 'دولة فلسطين', flag: '🇵🇸', year: 2025, population_estimate: '5.5 مليون نسمة', nominal_gdp_usd: '17 مليار $', growth_rate_pct: 'غير متاح بدقة', primary_source: 'الجهاز المركزي للإحصاء الفلسطيني 2025', governance_audit_note: 'ظروف استثنائية وإعادة إعمار وتحديات الحصار', updated_at: '2025-01-15' }
  ];

  // Endpoint 1: Geospatial Atlas Data
  app.get('/api/countries/geospatial/atlas', (req: Request, res: Response) => {
    try {
      const countriesGeo = Object.values(COMPREHENSIVE_ARAB_COUNTRIES_PROFILES).map((c) => {
        const coords = ARAB_COUNTRY_CENTROIDS[c.country_code] || { lat: 25.0, lng: 40.0 };
        const numericArea = NUMERIC_AREA_KM2[c.country_code] || 50000;
        
        // Find region
        const foundReg = ARAB_REGIONS_DEFINITION.find((r) => r.countries_codes.includes(c.country_code));

        return {
          country_code: c.country_code,
          name_ar: c.name_ar,
          name_en: c.name_en,
          capital: c.capital,
          flag: c.flag,
          region_id: foundReg ? foundReg.id : 'arab_world',
          coordinates: coords,
          area_sq_km: numericArea,
          population_display: c.population,
          gdp_reference: c.gdp_reference,
          calling_code: c.calling_code,
          currency_symbol: c.currency_symbol
        };
      });

      const atlas: PanArabGeospatialAtlas = {
        countries_geo: countriesGeo,
        straits: STRATEGIC_STRAITS_DATA,
        seaports: STRATEGIC_SEAPORTS_DATA,
        airports: STRATEGIC_AIRPORT_HUBS_DATA
      };

      res.json({
        ok: true,
        success: true,
        data: atlas
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch atlas data' });
    }
  });

  // Endpoint 2: Currencies & Conversion Rates
  app.get('/api/countries/calculator/currencies', (req: Request, res: Response) => {
    res.json({
      ok: true,
      success: true,
      data: ARAB_CURRENCIES_LIST
    });
  });

  // Endpoint 3: Living & Travel Budget Calculator Engine
  app.post('/api/countries/calculator/budget', (req: Request, res: Response) => {
    try {
      const {
        origin_country_code = 'EG',
        destination_country_code = 'SA',
        duration_days = 7,
        travelers_count = 1,
        lifestyle = 'moderate'
      } = req.body;

      const origin = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[origin_country_code]
        || Object.values(COMPREHENSIVE_ARAB_COUNTRIES_PROFILES)[0];
      const destination = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[destination_country_code]
        || Object.values(COMPREHENSIVE_ARAB_COUNTRIES_PROFILES)[1];

      const originRate = ARAB_CURRENCIES_LIST.find((c) => c.country_code === origin.country_code)?.rate_to_usd || 1;
      const destRate = ARAB_CURRENCIES_LIST.find((c) => c.country_code === destination.country_code)?.rate_to_usd || 1;

      // 1 Origin Unit = (1 / originRate) * destRate Destination Units
      const directRate = destRate / originRate;

      // Base Daily Cost in USD based on destination cost tier and lifestyle
      // Tier: Gulf (high), Levant/Maghreb (moderate), Nile/Horn (low)
      let baseDailyUsdPerPerson = 70;
      if (['SA', 'AE', 'QA', 'KW', 'BH', 'OM'].includes(destination.country_code)) {
        baseDailyUsdPerPerson = 120;
      } else if (['JO', 'LB', 'PS', 'MA', 'TN', 'DZ'].includes(destination.country_code)) {
        baseDailyUsdPerPerson = 75;
      } else {
        baseDailyUsdPerPerson = 45;
      }

      // Lifestyle multipliers
      const lifestyleMultipliers: Record<string, { accommodation: number; dining: number; transport: number; other: number }> = {
        budget: { accommodation: 0.6, dining: 0.6, transport: 0.5, other: 0.5 },
        moderate: { accommodation: 1.0, dining: 1.0, transport: 1.0, other: 1.0 },
        family: { accommodation: 1.4, dining: 1.2, transport: 1.3, other: 1.2 },
        luxury: { accommodation: 2.8, dining: 2.5, transport: 2.2, other: 2.4 }
      };

      const mult = lifestyleMultipliers[lifestyle] || lifestyleMultipliers.moderate;

      const days = Math.max(1, Number(duration_days) || 7);
      const people = Math.max(1, Number(travelers_count) || 1);

      const dailyAccUsd = (baseDailyUsdPerPerson * 0.45 * mult.accommodation) * Math.ceil(people / 2);
      const dailyDiningUsd = (baseDailyUsdPerPerson * 0.25 * mult.dining) * people;
      const dailyTransportUsd = (baseDailyUsdPerPerson * 0.15 * mult.transport) * people;
      const totalTelecomUsd = (25 * mult.other) * people;
      const totalContingencyUsd = (baseDailyUsdPerPerson * 0.15 * mult.other) * days * people;

      const totalAccUsd = dailyAccUsd * days;
      const totalDiningUsd = dailyDiningUsd * days;
      const totalTransportUsd = dailyTransportUsd * days;
      const totalUsd = Math.round(totalAccUsd + totalDiningUsd + totalTransportUsd + totalTelecomUsd + totalContingencyUsd);

      // Convert to Destination Currency
      const totalDestCurrency = Math.round(totalUsd * destRate);
      const destAcc = Math.round(totalAccUsd * destRate);
      const destDining = Math.round(totalDiningUsd * destRate);
      const destTransport = Math.round(totalTransportUsd * destRate);
      const destTelecom = Math.round(totalTelecomUsd * destRate);
      const destContingency = Math.round(totalContingencyUsd * destRate);

      // Convert to Origin Currency
      const totalOriginCurrency = Math.round(totalUsd * originRate);

      // Cost index difference
      const originIndex = ['SA', 'AE', 'QA', 'KW'].includes(origin.country_code) ? 80 : ['JO', 'MA', 'LB'].includes(origin.country_code) ? 60 : 45;
      const destIndex = ['SA', 'AE', 'QA', 'KW'].includes(destination.country_code) ? 80 : ['JO', 'MA', 'LB'].includes(destination.country_code) ? 60 : 45;
      const diffPct = Math.round(((destIndex - originIndex) / originIndex) * 100);

      const result: PanArabLivingBudgetCalculation = {
        origin_country: {
          country_code: origin.country_code,
          name_ar: origin.name_ar,
          flag: origin.flag,
          currency_symbol: origin.currency_symbol
        },
        destination_country: {
          country_code: destination.country_code,
          name_ar: destination.name_ar,
          flag: destination.flag,
          currency_symbol: destination.currency_symbol
        },
        duration_days: days,
        travelers_count: people,
        lifestyle: lifestyle as any,
        breakdown_destination_currency: {
          accommodation: destAcc,
          food_and_dining: destDining,
          transportation: destTransport,
          telecom_and_connectivity: destTelecom,
          contingency_and_activities: destContingency,
          total: totalDestCurrency
        },
        breakdown_origin_currency: {
          total: totalOriginCurrency
        },
        breakdown_usd: {
          total: totalUsd
        },
        exchange_rate_direct: Number(directRate.toFixed(4)),
        cost_index_comparison: {
          origin_index: originIndex,
          destination_index: destIndex,
          cost_difference_pct: diffPct
        },
        practical_travel_advice: [
          `سعر الصرف الاسترشادي: 1 ${origin.currency_symbol} يعادل نحو ${directRate.toFixed(3)} ${destination.currency_symbol}.`,
          `يُفضل استخدام البطاقات البنكية الدولية وتطبيقات الدفع الرقمي (مثل مدى، أبل باي، كليك) لتفادي عمولات الصرافة المرتفعة.`,
          `تأكد من شراء شريحة اتصال سياحية (eSIM أو شريحة محلية) فور الوصول بالمطار لتفادي تكلفة التجوال الدولي.`,
          `احرص على مراجعة متطلبات التأشيرة وتصريح العمل في ${destination.name_ar} عبر القنوات الرسمية.`
        ]
      };

      res.json({
        ok: true,
        success: true,
        data: result
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to calculate living budget' });
    }
  });

  // Endpoint 4: Annual Updates & In-Memory Updating
  app.get('/api/countries/analytics/annual-updates', (req: Request, res: Response) => {
    res.json({
      ok: true,
      success: true,
      data: ANNUAL_UPDATES_REGISTRY
    });
  });

  app.post('/api/countries/analytics/annual-updates', (req: Request, res: Response) => {
    try {
      const { country_code, year, population_estimate, nominal_gdp_usd, growth_rate_pct, primary_source, governance_audit_note } = req.body;
      if (!country_code || !year) {
        return res.status(400).json({ ok: false, error: 'country_code and year are required' });
      }

      const country = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[country_code];
      if (!country) {
        return res.status(404).json({ ok: false, error: 'Country not found' });
      }

      const newUpdate: AnnualCountryUpdate = {
        country_code,
        country_name_ar: country.name_ar,
        flag: country.flag,
        year: Number(year),
        population_estimate: population_estimate || country.population,
        nominal_gdp_usd: nominal_gdp_usd || country.gdp_reference,
        growth_rate_pct: growth_rate_pct || country.growth_rate_reference,
        primary_source: primary_source || 'توثيق رسمي معتمد 2025/2026',
        governance_audit_note: governance_audit_note || 'تحديث سنوي معتمد وفق ضوابط الحوكمة',
        updated_at: new Date().toISOString().split('T')[0]
      };

      // Check if exists
      const existingIdx = ANNUAL_UPDATES_REGISTRY.findIndex(
        (u) => u.country_code === country_code && u.year === Number(year)
      );

      if (existingIdx >= 0) {
        ANNUAL_UPDATES_REGISTRY[existingIdx] = newUpdate;
      } else {
        ANNUAL_UPDATES_REGISTRY.unshift(newUpdate);
      }

      res.json({
        ok: true,
        success: true,
        message: 'تم حفظ وتحديث المؤشر السنوي بنجاح وفق ضوابط الحوكمة',
        data: newUpdate
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to post annual update' });
    }
  });

  // Endpoint 5: Simulation Projections (2025 - 2030)
  app.get('/api/countries/analytics/simulation-projections', (req: Request, res: Response) => {
    const targetYear = Number(req.query.year) || 2027;

    // Model Arab Growth projection
    // 2025: Pop ~465M, GDP ~3.8T
    // 2027: Pop ~485M, GDP ~4.2T
    // 2030: Pop ~515M, GDP ~4.9T
    let projectedPop = 465;
    let projectedGdp = 3.8;
    let avgGrowth = 3.7;

    if (targetYear === 2026) {
      projectedPop = 475;
      projectedGdp = 4.0;
      avgGrowth = 3.8;
    } else if (targetYear === 2027) {
      projectedPop = 486;
      projectedGdp = 4.25;
      avgGrowth = 3.9;
    } else if (targetYear >= 2028 && targetYear <= 2030) {
      projectedPop = 515;
      projectedGdp = 4.95;
      avgGrowth = 4.1;
    }

    const simulation: AnnualSimulationProjection = {
      target_year: targetYear,
      projected_total_population_million: projectedPop,
      projected_total_gdp_trillion_usd: projectedGdp,
      assumed_avg_growth_rate_pct: avgGrowth,
      leading_growth_countries: [
        { country_code: 'SA', name_ar: 'المملكة العربية السعودية', flag: '🇸🇦', projected_growth: '4.8% (بدفع رؤية 2030 والقطاعات غير النفطية)' },
        { country_code: 'AE', name_ar: 'الإمارات العربية المتحدة', flag: '🇦🇪', projected_growth: '4.5% (مشاريع الذكاء الاصطناعي والتجارة العالمية)' },
        { country_code: 'EG', name_ar: 'جمهورية مصر العربية', flag: '🇪🇬', projected_growth: '4.6% (نمو الإنتاج الصناعي وقناة السويس والسياحة)' },
        { country_code: 'MA', name_ar: 'المملكة المغربية', flag: '🇲🇦', projected_growth: '4.2% (صناعة السيارات والطيران والطاقات المتجددة)' }
      ],
      diversification_index_forecast: 'ارتفاع متوقع لمساهمة القطاعات غير النفطية في الناتج المحلي العربي الإجمالي إلى أكثر من 68% بحلول عام 2030.'
    };

    res.json({
      ok: true,
      success: true,
      data: simulation
    });
  });

  // Endpoint 6: Logistics & Strategic Maritime Corridors
  app.get('/api/countries/logistics/corridors', (req: Request, res: Response) => {
    res.json({
      ok: true,
      success: true,
      data: {
        straits: STRATEGIC_STRAITS_DATA,
        seaports: STRATEGIC_SEAPORTS_DATA,
        airports: STRATEGIC_AIRPORT_HUBS_DATA
      }
    });
  });

  // =========================================================================
  // PHASE 4: PAN-ARAB MOBILITY, VISAS, FREE ZONES & EXECUTIVE DOSSIERS
  // =========================================================================

  // Dataset 1: Pan-Arab Free Zones & Special Economic Zones
  const PAN_ARAB_FREE_ZONES_DATA: PanArabFreeZone[] = [
    {
      id: 'sczone_eg',
      name_ar: 'المنطقة الاقتصادية لقناة السويس (SCZONE)',
      name_en: 'Suez Canal Economic Zone',
      country_code: 'EG',
      country_name_ar: 'جمهورية مصر العربية',
      city: 'العين السخنة / بورسعيد / الإسماعيلية',
      established_year: 2015,
      primary_sectors: ['اللوجستيات وتخزين الحاويات', 'صناعة الهيدروجين الأخضر والأمونيا', 'صناعة السيارات ومهمات السكك الحديدية', 'البتروكيماويات'],
      tax_incentives: ['ضريبة دخل 0% على الواردات للأنشطة التصديرية', 'إعفاء جمركي كامل لمدخلات الإنتاج والآلات', 'حوافز استثمارية نقدية تصل إلى 50%'],
      foreign_ownership_pct: 100,
      customs_duty_ar: 'صفر بالمائة للمعدات والمواد الخام المستخدمة للتصدير',
      strategic_features_ar: 'تمتد على ضفاف الممر الملاحي العالمي لقناة السويس بمساحة 461 كم² و6 موانئ بحرية رئيسية تربط آسيا وأفريقيا بأوروبا.',
      coordinates: { lat: 29.6231, lng: 32.3394 },
      website_url: 'https://sczone.eg'
    },
    {
      id: 'jafza_ae',
      name_ar: 'المنطقة الحرة بجبل علي (جافزا - JAFZA)',
      name_en: 'Jebel Ali Free Zone',
      country_code: 'AE',
      country_name_ar: 'الإمارات العربية المتحدة',
      city: 'دبي',
      established_year: 1985,
      primary_sectors: ['التجارة الدولية وإعادة التصدير', 'الإلكترونيات والتقنية المتقدمة', 'الكيماويات ومواد البناء', 'المركبات وقطع الغيار'],
      tax_incentives: ['إعفاء كامل من ضرائب الشركات لـ 50 عاماً قابلة للتجديد', 'إعفاء من ضريبة الدخل الشخصي', 'تحويل كامل للأرباح ورأس المال للخارج دون قيود'],
      foreign_ownership_pct: 100,
      customs_duty_ar: 'إعفاء كامل 0% لجميع بضائع الترانزيت والتصدير',
      strategic_features_ar: 'أكبر مجمع لوجستي وتجاري متكامل في الشرق الأوسط، يضم أكثر من 9,500 شركة عالمية متصلة مباشرة بميناء جبل علي ومطار آل مكتوم.',
      coordinates: { lat: 24.9950, lng: 55.0800 },
      website_url: 'https://www.jafza.ae'
    },
    {
      id: 'difc_ae',
      name_ar: 'مركز دبي المالي العالمي (DIFC)',
      name_en: 'Dubai International Financial Centre',
      country_code: 'AE',
      country_name_ar: 'الإمارات العربية المتحدة',
      city: 'دبي',
      established_year: 2004,
      primary_sectors: ['الخدمات المصرفية والتمويل', 'إدارة الثروات والأصول', 'التكنولوجيا المالية (FinTech)', 'الذكاء الاصطناعي والابتكار'],
      tax_incentives: ['ضريبة دخل 0% على الشركات والأفراد لمدة 50 عاماً', 'بيئة قانونية مستقلة بنظام القانون العام الإنجليزي (Common Law)', 'محاكم مالية مستقلة باللغة الإنجليزية'],
      foreign_ownership_pct: 100,
      customs_duty_ar: 'منطقة حرة مالية وخدمية مستقلة',
      strategic_features_ar: 'المركز المالي رقم 1 في الشرق الأوسط وجنوب آسيا، ومركز رئيسي لشركات التكنولوجيا المالية والاستثمار الجريء العالمية.',
      coordinates: { lat: 25.2104, lng: 55.2818 },
      website_url: 'https://www.difc.ae'
    },
    {
      id: 'adgm_ae',
      name_ar: 'سوق أبوظبي العالمي (ADGM)',
      name_en: 'Abu Dhabi Global Market',
      country_code: 'AE',
      country_name_ar: 'الإمارات العربية المتحدة',
      city: 'أبوظبي (جزيرتا الماريه والريم)',
      established_year: 2013,
      primary_sectors: ['صناديق الاستثمار السيادية والخاصة', 'الأصول المشفرة والافتراضية', 'تمويل المناخ والاستدامة', 'الشركات العائلية العالمية'],
      tax_incentives: ['إعفاءات ضريبية تنافسية', 'إطار تشريعي خاضع مباشرة للقانون الإنجليزي', 'مركز تسوية ومحاكم مستقلة عالمية'],
      foreign_ownership_pct: 100,
      customs_duty_ar: 'منطقة مالية حرة ذات سيادة تشريعية',
      strategic_features_ar: 'عاصمة رأس المال الاستثماري في المنطقة، وواحدة من أكبر المناطق المالية امتداداً جغرافياً بعد ضم جزيرة الريم.',
      coordinates: { lat: 24.5005, lng: 54.3889 },
      website_url: 'https://www.adgm.com'
    },
    {
      id: 'kezad_ae',
      name_ar: 'مناطق خليفة الاقتصادية (كيزاد - KEZAD)',
      name_en: 'Khalifa Economic Zones Abu Dhabi',
      country_code: 'AE',
      country_name_ar: 'الإمارات العربية المتحدة',
      city: 'أبوظبي',
      established_year: 2010,
      primary_sectors: ['الصناعات الدوائية والحيوية', 'صناعة الألمنيوم والصلب', 'الأغذية والزراعة المتقدمة', 'اللوجستيات وتجارة السيارات'],
      tax_incentives: ['ملكية أجنبية 100%', 'إعفاء جمركي للمنتجات المعاد تصديرها', 'حلول طاقة صناعية مدعومة وتأجير أراضٍ طويل الأجل'],
      foreign_ownership_pct: 100,
      customs_duty_ar: '0% على المواد الأولية والآلات المستوردة للتصنيع',
      strategic_features_ar: 'أكبر مركز متكامل للمناطق الاقتصادية والصناعية في الشرق الأوسط، يغطي أكثر من 550 كم² ومتصل مباشرة بميناء خليفة المتطور.',
      coordinates: { lat: 24.8115, lng: 54.7210 },
      website_url: 'https://www.kezadgroup.com'
    },
    {
      id: 'silz_sa',
      name_ar: 'المنطقة الخاصة اللوجستية المتكاملة بالرياض (SILZ)',
      name_en: 'Special Integrated Logistics Zone (SILZ)',
      country_code: 'SA',
      country_name_ar: 'المملكة العربية السعودية',
      city: 'الرياض (مطار الملك خالد الدولي)',
      established_year: 2022,
      primary_sectors: ['التجارة الإلكترونية والتقنية السحابية', 'خدمات التوزيع وسلاسل الإمداد العالمية', 'الأجهزة الطبية ومستلزمات الطيران', 'الصيانة والإصلاح والفرز'],
      tax_incentives: ['ضريبة دخل 0% على الكيانات المؤهلة لمدة 50 عاماً', 'ضريبة استقطاع 0% على توزيع الأرباح والخدمات لمدة 50 عاماً', 'إعفاء جمركي وضريبة القيمة المضافة 0% على البضائع الداخلة للمنطقة'],
      foreign_ownership_pct: 100,
      customs_duty_ar: 'إعفاء جمركي كامل وتعليق الرسوم للبضائع المؤهلة',
      strategic_features_ar: 'أول منطقة اقتصادية خاصة لوجستية بالمملكة بمساحة 3 ملايين م²، توفر وصولاً مباشراً إلى أكثر من 400 مليون مستهلك إقليمي.',
      coordinates: { lat: 24.9620, lng: 46.7280 },
      website_url: 'https://silz.gov.sa'
    },
    {
      id: 'kaec_sa',
      name_ar: 'المنطقة الاقتصادية الخاصة بمدينة الملك عبد الله (KAEC)',
      name_en: 'King Abdullah Economic City Special Economic Zone',
      country_code: 'SA',
      country_name_ar: 'المملكة العربية السعودية',
      city: 'رابغ / مكة المكرمة',
      established_year: 2023,
      primary_sectors: ['صناعة وتجميع السيارات الكهربائية (Lucid / Ceer)', 'الصناعات الدوائية والتقنية الحيوية', 'التجميع اللوجستي وتجارة الموانئ'],
      tax_incentives: ['ضريبة دخل مخفضة 5% لمدة تصل إلى 20 عاماً', 'إعفاء جمركي على الآلات والمواد الأولية المستوردة', 'مرونة عالية في استقدام الكفاءات والعمالة الأجنبية'],
      foreign_ownership_pct: 100,
      customs_duty_ar: '0% على الآلات وقطع الغيار والمواد الأولية للتصنيع',
      strategic_features_ar: 'تحتضن ميناء الملك عبد الله الذي يعد من أسرع موانئ الحاويات نمواً في العالم، ومركزاً رائداً لتصنيع السيارات الكهربائية بالمملكة.',
      coordinates: { lat: 22.4042, lng: 39.1120 },
      website_url: 'https://www.kaec.net'
    },
    {
      id: 'neom_oxagon_sa',
      name_ar: 'أوكساجون - مدينة نيوم الصناعية المتقدمة',
      name_en: 'Oxagon - NEOM Advanced Manufacturing City',
      country_code: 'SA',
      country_name_ar: 'المملكة العربية السعودية',
      city: 'نيوم / تبوك',
      established_year: 2022,
      primary_sectors: ['الطاقة النظيفة وإنتاج الهيدروجين الأخضر', 'التصنيع المتقدم والروبوتات والذكاء الاصطناعي', 'البناء الحديث والموانئ المؤتمتة ذاتياً', 'الابتكار البحري والمائي'],
      tax_incentives: ['حوافز تشريعية وتنظيمية غير مسبوقة خاصة بنيوم', 'طاقة متجددة 100% بتكلفة تنافسية عالمية', 'شبكة نقل آلية فائقة السرعة'],
      foreign_ownership_pct: 100,
      customs_duty_ar: 'بيئة جمركية ذكية مؤتمتة بدون أوراق',
      strategic_features_ar: 'أكبر هيكل صناعي عائم ومستدام في العالم على البحر الأحمر، متصل بموقع استراتيجي يمر به 13% من حركة التجارة العالمية.',
      coordinates: { lat: 27.9150, lng: 35.2900 },
      website_url: 'https://www.neom.com/ar-sa/regions/oxagon'
    },
    {
      id: 'ras_alkhair_sa',
      name_ar: 'المنطقة الاقتصادية الخاصة برأس الخير',
      name_en: 'Ras Al Khair Special Economic Zone',
      country_code: 'SA',
      country_name_ar: 'المملكة العربية السعودية',
      city: 'المنطقة الشرقية / رأس الخير',
      established_year: 2023,
      primary_sectors: ['بناء وصيانة السفن والمنصات البحرية', 'سلاسل إمداد الصناعات البحرية والتعدين', 'الألمنيوم والصناعات الثقيلة المرتبطة'],
      tax_incentives: ['ضريبة دخل تفضيلية 5% لمدة تصل إلى 20 عاماً', 'إعفاء كامل من الرسوم الجمركية على المعدات ومستلزمات الإنتاج', 'ضريبة استقطاع 0%'],
      foreign_ownership_pct: 100,
      customs_duty_ar: '0% على مكونات بناء وصيانة السفن والمعدات الثقيلة',
      strategic_features_ar: 'تضم مجمع الملك سلمان العالمي للصناعات والخدمات البحرية، أكبر حوض بحري متكامل لبناء وصيانة السفن بالشرق الأوسط.',
      coordinates: { lat: 27.5230, lng: 49.1920 },
      website_url: 'https://sez.gov.sa'
    },
    {
      id: 'sezad_om',
      name_ar: 'المنطقة الاقتصادية الخاصة بالدقم (SEZAD)',
      name_en: 'Special Economic Zone at Duqm',
      country_code: 'OM',
      country_name_ar: 'سلطنة عُمان',
      city: 'الدقم / الوسطى',
      established_year: 2011,
      primary_sectors: ['تكرير النفط والبتروكيماويات (مصفاة الدقم)', 'الطاقة الخضراء وإنتاج الهيدروجين', 'الصناعات السمكية والأحواض الجافة', 'اللوجستيات وتخزين النفط الخام (رأس مركز)'],
      tax_incentives: ['إعفاء ضريبي يصل إلى 30 عاماً قابلة للتجديد', 'إعفاء كامل من الجمارك والرسوم التصديرية', 'حق انتفاع بالأراضي حتى 50 عاماً'],
      foreign_ownership_pct: 100,
      customs_duty_ar: '0% على جميع الواردات وإعادة التصدير',
      strategic_features_ar: 'أكبر منطقة اقتصادية خاصة في الشرق الأوسط وشمال أفريقيا بمساحة 2,000 كم² على بحر العرب خارج مضيق هرمز مباشرة.',
      coordinates: { lat: 19.6700, lng: 57.7000 },
      website_url: 'https://www.duqm.gov.om'
    },
    {
      id: 'sohar_om',
      name_ar: 'ميناء ومنطقة صحار الحرة',
      name_en: 'Sohar Port and Freezone',
      country_code: 'OM',
      country_name_ar: 'سلطنة عُمان',
      city: 'صحار / شمال الباطنة',
      established_year: 2002,
      primary_sectors: ['المعادن والصلب والألمنيوم', 'الصناعات الغذائية والأمن الغذائي', 'البلاستيك والكيماويات', 'الخدمات اللوجستية البحرية'],
      tax_incentives: ['إعفاء من ضريبة الشركات يصل إلى 25 عاماً', 'ملكية أجنبية 100%', 'محطة خدمة واحدة لإصدار التراخيص خلال 48 ساعة'],
      foreign_ownership_pct: 100,
      customs_duty_ar: '0% رسوم جمركية على الاستيراد والتصدير',
      strategic_features_ar: 'مشروع مشترك بين سلطنة عُمان وميناء روتردام الهولندي، يمثل بوابة تجارية رئيسية للخليج العربي وشبه القارة الهندية.',
      coordinates: { lat: 24.4980, lng: 56.6270 },
      website_url: 'https://soharportandfreezone.com'
    },
    {
      id: 'qfza_qa',
      name_ar: 'هيئة المناطق الحرة بقطر (أم الحول ورأس بوفنطاس - QFZA)',
      name_en: 'Qatar Free Zones Authority',
      country_code: 'QA',
      country_name_ar: 'دولة قطر',
      city: 'الدوحة / الوكرة',
      established_year: 2018,
      primary_sectors: ['التقنيات الناشئة والبيانات السحابية (Google Cloud)', 'الخدمات اللوجستية البحرية والجوية', 'الصناعات الخفيفة المتقدمة والأدوية', 'التجارة البحرية الدولية'],
      tax_incentives: ['ضريبة دخل 0% على الشركات لمدة 20 عاماً قابلة للتجديد', 'إعفاء كامل من الرسوم الجمركية على الواردات', 'صندوق تنمية واستثمار لدعم الشركات المؤهلة'],
      foreign_ownership_pct: 100,
      customs_duty_ar: '0% على الآلات والمواد الأولية ومدخلات التجميع',
      strategic_features_ar: 'تتكون من منطقتين: رأس بوفنطاس الملاصقة لمطار حمد الدولي، وأم الحول المتصلة مباشرة بميناء حمد التجاري العملاق.',
      coordinates: { lat: 25.1760, lng: 51.5830 },
      website_url: 'https://fza.gov.qa'
    },
    {
      id: 'qfc_qa',
      name_ar: 'مركز قطر للمال (QFC)',
      name_en: 'Qatar Financial Centre',
      country_code: 'QA',
      country_name_ar: 'دولة قطر',
      city: 'الدوحة',
      established_year: 2005,
      primary_sectors: ['الخدمات المصرفية والاستثمارية', 'التأمين وإدارة الأصول', 'الخدمات القانونية والاستشارية العالمية', 'الأعمال الرقمية والرياضية'],
      tax_incentives: ['ضريبة دخل تفضيلية 10% على الأرباح ذات المصدر المحلي فقط', 'بيئة قانونية تتبع القانون العام الإنجليزي (English Common Law)', 'تحويل الأرباح بنسبة 100% بأي عملة'],
      foreign_ownership_pct: 100,
      customs_duty_ar: 'منطقة أعمال حرة للمال والخدمات المهنية',
      strategic_features_ar: 'منصة عالمية متطورة تتيح تأسيس وتشغيل الشركات داخل الدوحة دون اشتراط التواجد في نطاق جغرافي مغلق.',
      coordinates: { lat: 25.3200, lng: 51.5300 },
      website_url: 'https://www.qfc.qa'
    },
    {
      id: 'tangermed_ma',
      name_ar: 'المنطقة الاقتصادية واللوجستية طنجة المتوسط',
      name_en: 'Tanger Med Special Economic Zone',
      country_code: 'MA',
      country_name_ar: 'المملكة المغربية',
      city: 'طنجة',
      established_year: 2007,
      primary_sectors: ['صناعة السيارات (Renault / Stellantis)', 'صناعة هياكل وأجزاء الطيران', 'النسيج والجلود التقنية', 'اللوجستيات وتوزيع البضائع لأوروبا وأفريقيا'],
      tax_incentives: ['إعفاء من ضريبة الشركات لمدة 5 سنوات وضريبة مخفضة 15% بعدها', 'إعفاء من ضريبة القيمة المضافة ورسوم التسجيل', 'مساعدات تمويلية حكومية لدعم الاستثمار في العقار والتدريب'],
      foreign_ownership_pct: 100,
      customs_duty_ar: '0% على مدخلات التصنيع وإعادة التصدير',
      strategic_features_ar: 'المنصة الصناعية واللوجستية رقم 1 في أفريقيا والبحر الأبيض المتوسط، تربط المغرب بأكثر من 180 ميناء في 70 دولة.',
      coordinates: { lat: 35.8850, lng: -5.5050 },
      website_url: 'https://www.tangermedzones.com'
    },
    {
      id: 'cfc_ma',
      name_ar: 'القطب المالي للدار البيضاء (CFC)',
      name_en: 'Casablanca Finance City',
      country_code: 'MA',
      country_name_ar: 'المملكة المغربية',
      city: 'الدار البيضاء',
      established_year: 2010,
      primary_sectors: ['المؤسسات المالية والبنوك الاستثمارية', 'المقرات الإقليمية للشركات متعددة الجنسيات', 'شركات الاستشارات وإدارة الأصول', 'شركات التداول القاري'],
      tax_incentives: ['ضريبة دخل 0% خلال السنوات الخمس الأولى وضريبة مخفضة 15% بعد ذلك', 'إعفاء كامل من رسوم التسجيل وضريبة الدمغة', 'تسهيلات سريعة للحصول على تصاريح الإقامة والعمل للأجانب'],
      foreign_ownership_pct: 100,
      customs_duty_ar: 'مركز مالي وخدمي لإدارة الاستثمارات في أفريقيا',
      strategic_features_ar: 'المركز المالي الأول والرائد في قارة أفريقيا، يمثل الجسر المفضل للاستثمارات الأوروبية والآسيوية نحو دول غرب ووسط أفريقيا.',
      coordinates: { lat: 33.5650, lng: -7.6650 },
      website_url: 'https://casablancafinancecity.com'
    },
    {
      id: 'aseza_jo',
      name_ar: 'منطقة العقبة الاقتصادية الخاصة (ASEZA)',
      name_en: 'Aqaba Special Economic Zone Authority',
      country_code: 'JO',
      country_name_ar: 'المملكة الأردنية الهاشمية',
      city: 'العقبة',
      established_year: 2001,
      primary_sectors: ['النقل البحري والخدمات اللوجستية', 'السياحة البيئية والمنتجعات (البحر الأحمر ووادي رم)', 'الصناعات التجميعية والتصدير للولايات المتحدة (QIZ)', 'تكنولوجيا المعلومات والخدمات المشتركة'],
      tax_incentives: ['ضريبة دخل ثابتة 5% على صافي الأرباح لمعظم القطاعات', 'إعفاء من الرسوم الجمركية على البضائع المستوردة لداخل المنطقة', 'إعفاء من ضريبة العقار والمسقفات للأصول التجارية'],
      foreign_ownership_pct: 100,
      customs_duty_ar: '0% على المستوردات باستثناء المركبات والسلع الاستهلاكية المحددة',
      strategic_features_ar: 'المنفذ البحري الوحيد للأردن على البحر الأحمر، موقع جغرافي يربط أربع دول وممر حيوي لتجارة الترانزيت إلى العراق والشام.',
      coordinates: { lat: 29.5320, lng: 35.0060 },
      website_url: 'https://www.aseza.jo'
    },
    {
      id: 'blm_bh',
      name_ar: 'منطقة البحرين اللوجستية (BLM)',
      name_en: 'Bahrain Logistics Zone',
      country_code: 'BH',
      country_name_ar: 'مملكة البحرين',
      city: 'الحد / المحرق',
      established_year: 2008,
      primary_sectors: ['التخزين اللوجستي ثلاثي الأبعاد (3PL)', 'التجميع والتغليف المتخصص', 'خدمات الترانزيت السريع للسعودية والخليج', 'سلاسل التبريد والتوزيع الطبي'],
      tax_incentives: ['ضريبة دخل 0% على الشركات', 'ملكية أجنبية كاملة 100%', 'ربط مباشر سريع بجسر الملك فهد نحو السوق السعودي'],
      foreign_ownership_pct: 100,
      customs_duty_ar: 'إعفاء جمركي للمستودعات الجمركية وخدمات إعادة التصدير',
      strategic_features_ar: 'تقع بجوار ميناء خليفة بن سلمان مباشرة وعلى بعد دقائق من مطار البحرين الدولي، مصممة كأسرع بوابة لوجستية برية للسوق السعودي.',
      coordinates: { lat: 26.2250, lng: 50.6800 },
      website_url: 'https://mtt.gov.bh'
    },
    {
      id: 'diftz_dj',
      name_ar: 'منطقة التجارة الحرة الدولية بجيبوتي (DIFTZ)',
      name_en: 'Djibouti International Free Trade Zone',
      country_code: 'DJ',
      country_name_ar: 'جمهورية جيبوتي',
      city: 'جيبوتي العاصمة',
      established_year: 2018,
      primary_sectors: ['اللوجستيات وتجارة الترانزيت لدول شرق أفريقيا (إثيوبيا)', 'تجميع السيارات والآلات', 'الصناعات الغذائية والأجهزة المنزلية', 'التجارة الإلكترونية العابرة للقارات'],
      tax_incentives: ['إعفاء ضريبي كامل من ضريبة الشركات لمدة 10 سنوات', 'إعفاء من ضريبة الدخل الشخصي للعاملين الأجانب', 'حرية تامة في تحويل النقد الأجنبي'],
      foreign_ownership_pct: 100,
      customs_duty_ar: '0% على حركة الترانزيت والتصدير الإقليمي',
      strategic_features_ar: 'أكبر منطقة تجارة حرة في قارة أفريقيا بمساحة 4,800 هكتار، تسيطر على مدخل البحر الأحمر وباب المندب وتخدم 120 مليون مستهلك إثيوبي.',
      coordinates: { lat: 11.5880, lng: 43.1450 },
      website_url: 'https://dctx.dj'
    },
    {
      id: 'bizerte_tn',
      name_ar: 'فضاء الأنشطة الاقتصادية ببنزرت',
      name_en: 'Bizerte Free Trade Zone',
      country_code: 'TN',
      country_name_ar: 'الجمهورية التونسية',
      city: 'بنزرت',
      established_year: 1993,
      primary_sectors: ['صناعة مكونات السيارات والإلكترونيات', 'الصناعات الميكانيكية وتجهيزات اليخوت', 'الصناعات الغذائية الموجهة للتصدير', 'تكنولوجيا المعلومات والاتصالات'],
      tax_incentives: ['إعفاء ضريبي كامل من الأرباح التصديرية للسنوات الأولى ثم ضريبة مخفضة 10%', 'إعفاء تام من ضريبة القيمة المضافة والرسوم الجمركية للمدخلات', 'حرية كاملة في تحويل رؤوس الأموال'],
      foreign_ownership_pct: 100,
      customs_duty_ar: '0% للمواد الأولية والتجهيزات الموجهة للأسواق الخارجية',
      strategic_features_ar: 'أقصى نقطة شمالاً في قارة أفريقيا، تقع على بعد 60 كم فقط من مضيق صقلية وأوروبا مع خط بحري مباشر نحو الموانئ الإيطالية والفرنسية.',
      coordinates: { lat: 37.2740, lng: 9.8730 },
      website_url: 'https://www.faeb.com.tn'
    },
    {
      id: 'nouadhibou_mr',
      name_ar: 'منطقة نواذيبو الحرة الاقتصادية',
      name_en: 'Nouadhibou Free Zone',
      country_code: 'MR',
      country_name_ar: 'الجمهورية الإسلامية الموريتانية',
      city: 'نواذيبو',
      established_year: 2013,
      primary_sectors: ['الصيد الصناعي وتصنيع الأسماك', 'اللوجستيات وتصدير خامات الحديد والتعدين', 'السياحة الصحراوية والساحلية', 'الطاقة المتجددة والهيدروجين'],
      tax_incentives: ['نظام جبائي تفضيلي مبسط وإعفاءات جمركية شاملة', 'إعفاء من ضريبة الأرباح لمدة تصل إلى 7 سنوات', 'نظام شباك موحد للمستثمرين'],
      foreign_ownership_pct: 100,
      customs_duty_ar: '0% للمدخلات التعدينية والبحرية',
      strategic_features_ar: 'العاصمة الاقتصادية لموريتانيا وميناؤها التجاري الأعمق على المحيط الأطلسي، وبوابة الربط بين المغرب العربي وغرب أفريقيا.',
      coordinates: { lat: 20.9310, lng: -17.0340 },
      website_url: 'https://ndbfreezone.mr'
    }
  ];

  // Dataset 2: Pan-Arab Emergency Directory
  const PAN_ARAB_EMERGENCY_DATA: PanArabEmergencyDirectoryItem[] = [
    {
      country_code: 'SA',
      country_name_ar: 'المملكة العربية السعودية',
      flag: '🇸🇦',
      unified_emergency: '911',
      police: '999 (الشرطة) / 911 (الطوارئ الموحد في مكة والرياض والشرقية)',
      ambulance: '997 (الهلال الأحمر السعودي)',
      civil_defense: '998 (الدفاع المدني)',
      tourist_police: '930 (الهيئة السعودية للسياحة - مركز خدمة الزوار)',
      traffic_police: '993 (المرور) / 920000560 (نجم للحوادث)',
      advisories_and_legal_tips: [
        'تطبيق "توكلنا" و"أبشر" هما المنصتان الحكوميتان الأساسيتان للهوية الرقمية والتصاريح.',
        'الالتزام بلائحة المحافظة على الذوق العام والامتناع عن تصوير المنشآت الحكومية والعسكرية.',
        'في حال وقوع حادث مروري مؤمن عليه، الاتصال مباشرة برقم نجم 920000560 لتخطيط الحادث دون الحاجة للانتظار طويلاً.'
      ]
    },
    {
      country_code: 'AE',
      country_name_ar: 'الإمارات العربية المتحدة',
      flag: '🇦🇪',
      unified_emergency: '999',
      police: '999 (الشرطة) / 901 (للاستفسارات والخدمات غير الطارئة)',
      ambulance: '998 (الإسعاف الوطني)',
      civil_defense: '997 (الدفاع المدني)',
      tourist_police: '8004888 (شرطة دبي السياحية) / 8003333 (أبوظبي)',
      traffic_police: '999 (حوادث السير) / تطبيقات شرطة دبي وأبوظبي الذكية',
      advisories_and_legal_tips: [
        'توفر دولة الإمارات تطبيق "UAE PASS" كمعرف وطني ورقمي معتمد لكل الإجراءات والمعاملات.',
        'قوانين مكافحة الشائعات والجرائم الإلكترونية صارمة؛ يُحظر تصوير الحوادث أو الأشخاص بدون موافقتهم.',
        'تأمين السفر وتأمين القيادة إلزامي، وتتوفر خدمات تخطيط الحوادث البسيطة عبر التطبيقات الذكية خلال دقائق.'
      ]
    },
    {
      country_code: 'EG',
      country_name_ar: 'جمهورية مصر العربية',
      flag: '🇪🇬',
      unified_emergency: '112',
      police: '122 (شرطة النجدة)',
      ambulance: '123 (الإسعاف المصري)',
      civil_defense: '180 (الحماية المدنية والمطافئ)',
      tourist_police: '126 (شرطة السياحة والآثار)',
      traffic_police: '128 (مرور مصر) / 01221110000 (إغاثة الطرق السريعة)',
      advisories_and_legal_tips: [
        'شرطة السياحة متواجدة على مدار 24 ساعة في جميع المزارات والمتاحف والموانئ على الرقم 126.',
        'يُنصح بحمل جواز السفر أو بطاقة الهوية الرسمية الأصلية في جميع التنقلات بين المحافظات.',
        'في السفر البري على الطرق السريعة بين المدن، احتفظ برقم إدارة الإغاثة السريعة 01221110000 للطوارئ الميكانيكية.'
      ]
    },
    {
      country_code: 'QA',
      country_name_ar: 'دولة قطر',
      flag: '🇶🇦',
      unified_emergency: '999',
      police: '999 (القيادة والسيطرة الموحدة لوزارة الداخلية)',
      ambulance: '999 (خدمة الإسعاف بمؤسسة حمد الطبية)',
      civil_defense: '999 (الدفاع المدني)',
      tourist_police: '106 (الخط الساخن لقطر للسياحة)',
      traffic_police: '2344444 (إدارة المرور) أو عبر تطبيق مطراش2',
      advisories_and_legal_tips: [
        'تطبيق "مطراش2" (Metrash2) يوفر جميع الخدمات القنصلية والمرورية والإقامات بشكل إلكتروني فوري.',
        'الخدمات الطبية الإسعافية الطارئة تغطي جميع أنحاء الدولة عبر أسطول إسعاف طائر وأرضي مجهز.',
        'تأكد من سريان البطاقة الشخصية القطرية (QID) أو بطاقة هيّا والتأشيرة السياحية أثناء الإقامة.'
      ]
    },
    {
      country_code: 'KW',
      country_name_ar: 'دولة الكويت',
      flag: '🇰🇼',
      unified_emergency: '112',
      police: '112 (طوارئ النجدة والعمليات المركزية)',
      ambulance: '112 (إسعاف وزارة الصحة)',
      civil_defense: '112 (قوة الإطفاء العام)',
      tourist_police: '112 (مكتب المساعدة بوزارة الداخلية)',
      traffic_police: '112 (عمليات المرور) / 25583000',
      advisories_and_legal_tips: [
        'تطبيق "سهل" (Sahel) هو التطبيق الحكومي الموحد لإنجاز معاملات الإقامة والتراخيص.',
        'يجب الانتباه إلى قوانين المرور واستخدام حزام الأمان والالتزام بالسرعات المحددة حيث تخضع الطرق لرقابة رادارية مشددة.',
        'توفر الكويت خدمات الإسعاف الجوي والبحري للحالات الطارئة في الجزر والمناطق البرية عبر الرقم 112.'
      ]
    },
    {
      country_code: 'OM',
      country_name_ar: 'سلطنة عُمان',
      flag: '🇴🇲',
      unified_emergency: '9999',
      police: '9999 (عمليات شرطة عُمان السلطانية)',
      ambulance: '9999 (إسعاف شرطة عُمان السلطانية)',
      civil_defense: '9999 (هيئة الدفاع المدني والإسعاف)',
      tourist_police: '24583400 (مركز خدمة السياحة بوزارة التراث والسياحة)',
      traffic_police: '24343666 (الإدارة العامة للمرور)',
      advisories_and_legal_tips: [
        'شرطة عُمان السلطانية هي الجهة الشاملة للإنقاذ والإسعاف والمرور عبر الرقم الموحد 9999.',
        'في الرحلات الجبلية والوديان (مثل الجبل الأخضر وجبل شمس)، يجب استخدام مركبات الدفع الرباعي 4x4 وفق القانون.',
        'تجنب عبور مجاري الأودية والشعاب المائية أثناء هطول الأمطار وتحذيرات هيئة الأرصاد.'
      ]
    },
    {
      country_code: 'BH',
      country_name_ar: 'مملكة البحرين',
      flag: '🇧🇭',
      unified_emergency: '999',
      police: '999 (مركز العمليات الرئيسية لوزارة الداخلية)',
      ambulance: '999 (إسعاف وزارة الصحة)',
      civil_defense: '999 (الدفاع المدني)',
      tourist_police: '17282828 (هيئة البحرين للسياحة والمعارض)',
      traffic_police: '199 (الإدارة العامة للمرور)',
      advisories_and_legal_tips: [
        'تطبيق "الموظف الذكي" وتطبيقات الحكومة الإلكترونية (Bahrain.bh) تتيح كافة الخدمات الرقمية.',
        'الربط البري عبر جسر الملك فهد يربط المملكة مباشرة بالمنطقة الشرقية السعودية مع خدمات جمركية وجوازات موحدة.',
        'طوارئ خفر السواحل البحرينية متوفرة على الخط الساخن 17700000 لهواة الصيد والإبحار.'
      ]
    },
    {
      country_code: 'MA',
      country_name_ar: 'المملكة المغربية',
      flag: '🇲🇦',
      unified_emergency: '112',
      police: '19 (الأمن الوطني في المدن الحضرية) / 177 (الدرك الملكي خارج المدار الحضري والطرق)',
      ambulance: '15 (الوقاية المدنية والإسعاف)',
      civil_defense: '15 (الوقاية المدنية ومكافحة الحرائق)',
      tourist_police: '19 (طلب فرقة الشرطة السياحية Brigade Touristique)',
      traffic_police: '177 (حوادث الطرق الوطنية والسيارة - الدرك الملكي)',
      advisories_and_legal_tips: [
        'الشرطة السياحية متواجدة في مراكز المدن العتيقة والساحات السياحية الكبرى (مراكش، فاس، طنجة، الرباط).',
        'عند قيادة السيارة على الطرق السيارة السريعة، احتفظ برقم الشركة الوطنية للطرق السيارة بالمغرب 5050 للمساعدة.',
        'العملة الوطنية هي الدرهم المغربي، وتتوفر أجهزة الصرف الآلي والبطاقات الدولية في معظم المحال والمدن.'
      ]
    },
    {
      country_code: 'JO',
      country_name_ar: 'المملكة الأردنية الهاشمية',
      flag: '🇯🇴',
      unified_emergency: '911',
      police: '911 (مديرية الأمن العام)',
      ambulance: '911 (الدفاع المدني والإسعاف)',
      civil_defense: '911 (الدفاع المدني)',
      tourist_police: '117777 (إدارة الشرطة السياحية الأردنية)',
      traffic_police: '911 (إدارة السير المركزية والدوريات الخارجية)',
      advisories_and_legal_tips: [
        'تطبيق "سند" (Sanad) يوفر الهوية الرقمية والخدمات الحكومية الإلكترونية.',
        'الشرطة السياحية متواجدة بكثافة في البتراء ووادي رم وجرش والبحر الميت لتقديم العون والإرشاد.',
        'يُنصح بشراء التذكرة الموحدة (Jordan Pass) إلكترونياً قبل السفر لشمولها رسوم التأشيرة ورسوم دخول أكثر من 40 موقعاً أثرياً.'
      ]
    },
    {
      country_code: 'DZ',
      country_name_ar: 'الجمهورية الجزائرية الديمقراطية الشعبية',
      flag: '🇩🇿',
      unified_emergency: '112',
      police: '17 أو 1548 (المديرية العامة للأمن الوطني)',
      ambulance: '14 (الحماية المدنية الجزائرية)',
      civil_defense: '14 (الحماية المدنية ومكافحة الكوارث)',
      tourist_police: '1548 (شرطة النجدة والاستقبال السياحي)',
      traffic_police: '1055 (الدرك الوطني للطرق السريعة والولائية)',
      advisories_and_legal_tips: [
        'الدرك الوطني (1055) يؤمن شبكة الطرق السيارة والطرق الوطنية في جميع ولايات الجزائر الـ 58.',
        'في الرحلات السياحية بالجنوب الصحراوي الكبير (طاسيلي ناجر والهقار)، يتطلب السفر برفقة دليل سياحي معتمد ومحلي.',
        'العملة المحلية هي الدينار الجزائري، ويتم الصرف الرسمي عبر البنوك المعتمدة ومكاتب الصرف بالمطارات.'
      ]
    },
    {
      country_code: 'TN',
      country_name_ar: 'الجمهورية التونسية',
      flag: '🇹🇳',
      unified_emergency: '112',
      police: '197 (الأمن الوطني / الشرطة)',
      ambulance: '190 (الإسعاف الطبي الاستعجالي SAMU)',
      civil_defense: '198 (الحماية المدنية التونسية)',
      tourist_police: '197 (مكتب الشرطة السياحية بوزارة السياحة)',
      traffic_police: '193 (الحرس الوطني لطوارئ الطرق وحوادث السير)',
      advisories_and_legal_tips: [
        'الحرس الوطني (193) هو الجهة المسؤولة عن سلامة المسافرين عبر الطرقات السريعة والمناطق الساحلية والريفية.',
        'في المدن السياحية كالمهدية وسوسة وجربة والحمامات، تتوفر نقاط أمنية متخصصة لتسهيل إقامة الزوار.',
        'احتفظ دائماً بنسخة من حجز الفندق أو عقد الإيجار الرسمي لتقديمه عند التدقيق الأمني.'
      ]
    },
    {
      country_code: 'IQ',
      country_name_ar: 'جمهورية العراق',
      flag: '🇮🇶',
      unified_emergency: '112',
      police: '104 (شرطة النجدة)',
      ambulance: '122 (الإسعاف الفوري)',
      civil_defense: '115 (الدفاع المدني العراقي)',
      tourist_police: '104 (الأمن السياحي بغداد والمحافظات)',
      traffic_police: '443 (مديرية المرور العامة)',
      advisories_and_legal_tips: [
        'يُنصح بالتنقل بين المحافظات عبر الطرق السريعة المعتمدة واستخدام سيارات الأجرة المسجلة رسمياً.',
        'التأشيرة الإلكترونية متاحة لمواطني العديد من الدول عبر بوابة التأشيرات التابعة لوزارة الداخلية.',
        'إبراز جواز السفر ساري المفعول في نقاط التفتيش الرسمية بين المحافظات وإقليم كردستان.'
      ]
    },
    {
      country_code: 'LB',
      country_name_ar: 'الجمهورية اللبنانية',
      flag: '🇱🇧',
      unified_emergency: '112',
      police: '112 (قوى الأمن الداخلي)',
      ambulance: '140 (الصليب الأحمر اللبناني)',
      civil_defense: '125 (الدفاع المدني اللبناني) / 175 (فوج إطفاء بيروت)',
      tourist_police: '1735 (الشرطة السياحية اللبنانية)',
      traffic_police: '112 (شعبة السير والمرور)',
      advisories_and_legal_tips: [
        'الصليب الأحمر اللبناني (140) يقدم خدمات الإسعاف الطارئة في كافة المناطق اللبنانية.',
        'يُفضل استخدام الدولار الأمريكي نقداً أو البطاقات المصرفية الدولية لتقلب أسعار الصرف المحلية.',
        'تأكد من متابعة النشرات الجوية لهواة التزلج في جبال فاريا والأرز خلال فصل الشتاء.'
      ]
    },
    {
      country_code: 'SD',
      country_name_ar: 'جمهورية السودان',
      flag: '🇸🇩',
      unified_emergency: '999',
      police: '999 (الشرطة السودانية) / 777 (شرطة النجدة)',
      ambulance: '333 (الإسعاف المركزي)',
      civil_defense: '998 (قوات الدفاع المدني)',
      advisories_and_legal_tips: [
        'متابعة الإرشادات الأمنية الصادرة عن السفارات والجهات القنصلية الرسمية قبل التنقل بين الولايات.',
        'التنسيق المسبق مع الجهات الطبية واستخدام بطاقات التطعيم والوقاية الصحية المعتمدة.'
      ]
    },
    {
      country_code: 'SY',
      country_name_ar: 'الجمهورية العربية السورية',
      flag: '🇸🇾',
      unified_emergency: '112',
      police: '112 (الشرطة والنجدة)',
      ambulance: '110 (الهلال الأحمر العربي السوري والإسعاف السريع)',
      civil_defense: '113 (الإطفاء والدفاع المدني)',
      advisories_and_legal_tips: [
        'الاعتماد على المكاتب الرسمية ووكالات السفر المرخصة في تأمين التنقلات والإقامة الفندقية.',
        'مراعاة التعليمات المصرفية الرسمية لتصريف العملات عبر المصارف وشركات الصرافة المرخصة.'
      ]
    },
    {
      country_code: 'YE',
      country_name_ar: 'الجمهورية اليمنية',
      flag: '🇾🇪',
      unified_emergency: '199',
      police: '199 (شرطة النجدة)',
      ambulance: '191 (الإسعاف والطوارئ الطبية)',
      civil_defense: '191 (مصلحة الدفاع المدني)',
      advisories_and_legal_tips: [
        'مراعاة إرشادات السلامة المحلية والتنسيق مع وكالات السفر المعتمدة للرحلات في سقطرى وحضرموت.',
        'الاحتفاظ بوثائق الهوية وجواز السفر والتأشيرات الرسمية أثناء التنقل.'
      ]
    },
    {
      country_code: 'LY',
      country_name_ar: 'دولة ليبيا',
      flag: '🇱🇾',
      unified_emergency: '1515',
      police: '1515 (هيئة الشرطة والنجدة)',
      ambulance: '193 (جهاز الإسعاف والطوارئ) / 1515 (الهلال الأحمر الليبي)',
      civil_defense: '190 (هيئة السلامة الوطنية والدفاع المدني)',
      advisories_and_legal_tips: [
        'التنقل بين المدن الكبرى عبر الطرق الساحلية الرئيسية والتحقق من ساعات فتح المنافذ الحدودية.',
        'إلزامية تسجيل الإقامة والتأشيرة لدى مصلحة الجوازات والجنسية خلال المدة المحددة قانوناً.'
      ]
    },
    {
      country_code: 'MR',
      country_name_ar: 'الجمهورية الإسلامية الموريتانية',
      flag: '🇲🇷',
      unified_emergency: '117',
      police: '117 (الشرطة الوطنية) / 118 (الدرك الوطني على الطرق الخارجية)',
      ambulance: '101 (الإسعاف والحماية المدنية)',
      civil_defense: '118 (الحماية المدنية الوطنية)',
      advisories_and_legal_tips: [
        'تأشيرة الدخول الموريتانية البيومترية متاحة عند الوصول لجميع الجنسيات في مطار نواكشوط الدولي والمعابر الحدودية.',
        'الدرك الوطني (118) يؤمن كافة مسارات الطرق السريعة بين نواكشوط ونواذيبو والمدن التاريخية (شنقيط ووادان).'
      ]
    },
    {
      country_code: 'SO',
      country_name_ar: 'جمهورية الصومال الفيدرالية',
      flag: '🇸🇴',
      unified_emergency: '999',
      police: '999 (الشرطة الصومالية SPF) / 888 (النجدة العامة)',
      ambulance: '999 (الإسعاف والطوارئ - خدمة آمين للإسعاف)',
      civil_defense: '999 (فرقة الإطفاء والسلامة العامة)',
      advisories_and_legal_tips: [
        'استخدام الفنادق والخدمات المعتمدة وذات الترتيبات الأمنية الموثوقة في مقديشو والمدن الساحلية.',
        'التحويلات المالية عبر شبكات الهاتف المحمول (EVC Plus / Telesom) هي وسيلة الدفع الأكثر شيوعاً في البلاد.'
      ]
    },
    {
      country_code: 'DJ',
      country_name_ar: 'جمهورية جيبوتي',
      flag: '🇩🇯',
      unified_emergency: '17',
      police: '17 (الشرطة الوطنية) / 18 (الدرك الوطني)',
      ambulance: '19 (الإسعاف الطبي SAMU)',
      civil_defense: '18 (الحماية المدنية ومكافحة الحرائق)',
      advisories_and_legal_tips: [
        'التأشيرة الإلكترونية (eVisa) إلزامية ومتاحة عبر المنصة الرسمية لوزارة الشؤون الخارجية الجيبوتية (evisa.gouv.dj).',
        'الفرنك الجيبوتي مرتبط بالدولار الأمريكي بسعر صرف ثابت (1 USD ≈ 177.72 DJF).'
      ]
    },
    {
      country_code: 'KM',
      country_name_ar: 'جمهورية اتحاد جزر القمر',
      flag: '🇰🇲',
      unified_emergency: '17',
      police: '17 (الشرطة الوطنية والدرك)',
      ambulance: '773-2610 (الهلال الأحمر القمري والإسعاف الاستعجالي بموروني)',
      civil_defense: '18 (الحماية المدنية)',
      advisories_and_legal_tips: [
        'التأشيرة السياحية تصدر عند الوصول في مطار الأمير سعيد إبراهيم الدولي في موروني لجميع الجنسيات العربية.',
        'الفرنك القمري مرتبط باليورو بسعر صرف ثابت، وتتوفر خدمات الصرافة المعتمدة في العاصمة موروني.'
      ]
    },
    {
      country_code: 'PS',
      country_name_ar: 'دولة فلسطين',
      flag: '🇵🇸',
      unified_emergency: '100',
      police: '100 (الشرطة المدنية الفلسطينية)',
      ambulance: '101 (جمعية الهلال الأحمر الفلسطيني)',
      civil_defense: '102 (الدفاع المدني الفلسطيني)',
      tourist_police: '100 (إدارة الشرطة السياحية والآثار - بيت لحم والقدس وأريحا)',
      traffic_police: '100 (إدارة شرطة المرور)',
      advisories_and_legal_tips: [
        'طواقم جمعية الهلال الأحمر الفلسطيني (101) هي المزود الوطني الرئيسي لخدمات الإسعاف والرعاية الطبية الطارئة.',
        'مراجعة شروط التنقل والمعابر الدولية (معبر الكرامة / جسر الملك حسين) بالتنسيق المسبق.',
        'الشرطة السياحية متواجدة لتسهيل زيارة كنيسة المهد في بيت لحم والمواقع الأثرية في أريحا ورام الله.'
      ]
    }
  ];

  // Dataset 3: Pan-Arab Residency Pathways
  const PAN_ARAB_RESIDENCY_PATHWAYS: Record<string, PanArabResidencyPathway[]> = {
    SA: [
      {
        id: 'sa_prem_special_talent',
        title_ar: 'الإقامة المميزة - كفاءة استثنائية',
        category: 'skilled',
        validity_years: '5 سنوات قابلة للتجديد أو إقامة دائمة',
        minimum_requirements_ar: 'كفاءات علمية، صحية، أو باحثين في الجامعات والمراكز المعتمدة براتب شهري لا يقل عن 35,000 ريال سعودي أو جوائز تميز.',
        processing_portal: 'مركز الإقامة المميزة (pr.gov.sa)',
        perks_ar: ['الإقامة في المملكة مع الأسرة', 'التنقل بحرية دون الحاجة لكفيل', 'مزاولة الأعمال التجارية وتملك العقارات والسيارات', 'إعفاء من المقابل المالي للوافدين']
      },
      {
        id: 'sa_prem_investor',
        title_ar: 'الإقامة المميزة - مستثمر أعمال',
        category: 'investor',
        validity_years: 'إقامة دائمة مباشرة',
        minimum_requirements_ar: 'استثمار ما لا يقل عن 7 ملايين ريال سعودي في أنشطة اقتصادية مرخصة وفق نظام الاستثمار، وتوفير 10 وظائف للمواطنين خلال أول عامين.',
        processing_portal: 'مركز الإقامة المميزة (pr.gov.sa)',
        perks_ar: ['إقامة دائمة للمستثمر وأسرته', 'تأسيس شركات وتملك عقارات بالكامل', 'تسهيل إصدار تأشيرات الزيارة للأقارب']
      },
      {
        id: 'sa_prem_real_estate',
        title_ar: 'الإقامة المميزة - مالك عقار',
        category: 'investor',
        validity_years: 'مرتبطة بملكية العقار',
        minimum_requirements_ar: 'تملك أصول عقارية سكنية في المملكة بقيمة لا تقل عن 4 ملايين ريال سعودي، وأن يكون العقار غير مرهون وجاهزاً للسكن.',
        processing_portal: 'مركز الإقامة المميزة (pr.gov.sa)',
        perks_ar: ['إقامة سارية طيلة مدة تملك العقار', 'حرية الخروج والعودة من وإلى المملكة ذاتياً', 'إعفاء أسرة المقيم من رسوم المرافقين']
      }
    ],
    AE: [
      {
        id: 'ae_golden_investor',
        title_ar: 'الإقامة الذهبية - فئة المستثمر العقاري',
        category: 'golden',
        validity_years: '10 سنوات قابلة للتجديد تلقائياً',
        minimum_requirements_ar: 'شراء عقار أو أكثر بقيمة إجمالية لا تقل عن 2 مليون درهم إماراتي، مع إمكانية تمويل العقار من بنوك محلية معتمدة.',
        processing_portal: 'الهيئة الاتحادية للهوية والجنسية (icp.gov.ae) / إقامة دبي (gdrfad.gov.ae)',
        perks_ar: ['إقامة 10 سنوات بدون كفيل أو ضامن محلي', 'إمكانية البقاء خارج الدولة لأكثر من 6 أشهر دون إلغاء الإقامة', 'كفالة أفراد الأسرة والعمالة المساعدة بعدد غير محدود']
      },
      {
        id: 'ae_golden_talent',
        title_ar: 'الإقامة الذهبية - النوابغ والعلماء والمواهب',
        category: 'golden',
        validity_years: '10 سنوات',
        minimum_requirements_ar: 'أطباء، علماء معتمدون من مجلس علماء الإمارات، مخترعون، مبرمجون ومبدعون حاصلون على توصية وزارية معتمدة.',
        processing_portal: 'منصة تأشيرة المليون مبرمج / هيئة ICP',
        perks_ar: ['استقرار مهني طويل الأمد', 'تأسيس أعمال وتملك كامل للشركات', 'حقوق مصرفية وتسهيلات تجارية ميسرة']
      },
      {
        id: 'ae_digital_nomad',
        title_ar: 'تأشيرة العمل الافتراضي عن بُعد (Remote Work Visa)',
        category: 'digital_nomad',
        validity_years: 'سنة واحدة قابلة للتجديد',
        minimum_requirements_ar: 'إثبات عمل عن بُعد لدى شركة خارج الدولة براتب شهري لا يقل عن 3,500 دولار أمريكي، مع كشف حساب بنكي لـ 6 أشهر.',
        processing_portal: 'Visit Dubai / إقامة دبي (gdrfad.gov.ae)',
        perks_ar: ['العيش في دبي والعمل لصالح شركات عالمية', 'فتح حساب بنكي إماراتي وإصدار بطاقة هوية إماراتية', 'إلحاق الأبناء بالمدارس الخاصة والاستفادة من البنية التحتية العالمية']
      }
    ],
    QA: [
      {
        id: 'qa_real_estate_residency',
        title_ar: 'الإقامة العقارية القطرية المميزة',
        category: 'golden',
        validity_years: '5 سنوات أو إقامة دائمة',
        minimum_requirements_ar: 'تملك عقار في المناطق المخصصة للتملك الحر (مثل اللؤلؤة، لوسيل، الخليج الغربي) بقيمة تبدأ من 730,000 ريال (لـ 5 سنوات) أو 3,650,000 ريال (للإقامة الدائمة).',
        processing_portal: 'وزارة الداخلية القطرية (portal.moi.gov.qa)',
        perks_ar: ['إقامة بدون مستقدم أو كفيل للمالك وأسرته', 'مزايا الرعاية الصحية والتعليم في المدارس الحكومية لأصحاب الإقامة الدائمة', 'الاستثمار في الأنشطة التجارية الوطنية']
      }
    ],
    OM: [
      {
        id: 'om_investor_residency',
        title_ar: 'برنامج إقامة مستثمر في سلطنة عُمان',
        category: 'investor',
        validity_years: '5 سنوات أو 10 سنوات قابلة للتجديد',
        minimum_requirements_ar: 'استثمار ما لا يقل عن 250,000 ريال عُماني (لفئة 5 سنوات) أو 500,000 ريال عُماني (لفئة 10 سنوات) في شركات أو عقارات سياحية أو سندات حكومية.',
        processing_portal: 'وزارة التجارة والصناعة وترويج الاستثمار (investoman.om)',
        perks_ar: ['حق الإقامة للزوج والأولاد والوالدين دون اشتراط حد أعلى للسن', 'تملك عقار واحد خارج المجمعات السياحية المتكاملة لأغراض السكن', 'إمكانية تشغيل عمالة خاصة وتسهيل المعاملات المصرفية']
      }
    ],
    EG: [
      {
        id: 'eg_investor_property',
        title_ar: 'إقامة المستثمر وتملك العقار في مصر',
        category: 'investor',
        validity_years: 'من سنة حتى 5 سنوات قابلة للتجديد',
        minimum_requirements_ar: 'شراء عقار مسجل بقيمة تبدأ من 100 ألف دولار أمريكي (لإقامة سنة)، أو 200 ألف دولار (لإقامة 3 سنوات)، أو 400 ألف دولار (لإقامة 5 سنوات).',
        processing_portal: 'الإدارة العامة للجوازات والهجرة والجنسية بوزارة الداخلية',
        perks_ar: ['إقامة متجددة للمستثمر والزوجة والأولاد القصر', 'فتح حسابات بنكية بالعملات الأجنبية والمحلية', 'حق تملك الشركات والأنشطة التجارية في المناطق الحرة والعامة']
      }
    ]
  };

  // Helper function: Evaluate Visa Policy between Arab Countries
  function evaluateArabVisaPolicy(originCode: string, destCode: string): PanArabVisaSimulatorResult {
    const origin = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[originCode] || {
      country_code: originCode,
      name_ar: 'دولة الأصل',
      flag: '🌐'
    };
    const dest = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[destCode] || {
      country_code: destCode,
      name_ar: 'دولة الوجهة',
      flag: '📍',
      capital: 'العاصمة'
    };

    const gccCodes = ['SA', 'AE', 'QA', 'KW', 'OM', 'BH'];
    const maghrebCodes = ['DZ', 'TN', 'MR'];

    let category: 'visa_free' | 'gcc_national' | 'evisa' | 'visa_on_arrival' | 'embassy_visa' = 'embassy_visa';
    let categoryLabel = 'تأشيرة مسبقة عبر القنصلية / السفارة';
    let maxStay = 30;
    let feeUsd = 60;
    let portalName = `المنصة الرسمية لتأشيرات ${dest.name_ar}`;
    let portalUrl = 'https://visit.darb.app';
    const notes: string[] = [
      `يشترط صلاحية جواز السفر لمدة لا تقل عن 6 أشهر قبل موعد السفر إلى ${dest.name_ar}.`,
      `يُنصح بامتلاك تذكرة عودة مؤكدة وحجز فندقي أو مستند إقامة رسمي.`
    ];

    if (originCode === destCode) {
      category = 'visa_free';
      categoryLabel = 'مواطن محلي - لا تتطلب تأشيرة';
      maxStay = 365;
      feeUsd = 0;
      portalName = 'الجهات الوطنية الرسمية';
      portalUrl = '#';
      notes.push('أنت تتصفح متطلبات بلدك الأصلي، الدخول بالهوية الوطنية أو جواز السفر.');
    } else if (gccCodes.includes(originCode) && gccCodes.includes(destCode)) {
      // GCC to GCC
      category = 'gcc_national';
      categoryLabel = 'دخول حر بالهوية الوطنية (مواطنو مجلس التعاون الخليجي)';
      maxStay = 365;
      feeUsd = 0;
      portalName = 'بوابات السفر الذكية لدول مجلس التعاون';
      portalUrl = 'https://www.gcc-sg.org';
      notes.push('التنقل متاح عبر المنافذ الجوية والبرية والبحرية باستخدام بطاقة الهوية الوطنية الذكية أو جواز السفر.');
      notes.push('حق العمل والتملك العقاري وتأسيس الأعمال وفق الاتفاقية الاقتصادية الموحدة لدول الخليج.');
    } else if (gccCodes.includes(originCode) && ['EG', 'MA', 'JO', 'TN'].includes(destCode)) {
      // GCC to Egypt, Morocco, Jordan, Tunisia
      category = 'visa_free';
      categoryLabel = 'دخول بدون تأشيرة مسبقة (إعفاء كامل للمواطنين)';
      maxStay = 90;
      feeUsd = 0;
      portalName = `وزارة السياحة في ${dest.name_ar}`;
      portalUrl = 'https://www.darb.app';
      notes.push(`يحصل حاملو جوازات دول الخليج على إعفاء كامل من رسوم التأشيرة في ${dest.name_ar} لمدة تصل إلى 90 يوماً.`);
    } else if (maghrebCodes.includes(originCode) && maghrebCodes.includes(destCode)) {
      // Maghreb mutual visa-free
      category = 'visa_free';
      categoryLabel = 'دخول بدون تأشيرة (اتفاقيات التبادل البيني المغاربي)';
      maxStay = 90;
      feeUsd = 0;
      portalName = 'وزارة الداخلية والشؤون الخارجية';
      portalUrl = '#';
      notes.push('دخول معفى من التأشيرات بين الجزائر وتونس وموريتانيا لحاملي الجوازات العادية.');
    } else if (['SA', 'AE', 'QA', 'OM', 'BH'].includes(destCode)) {
      // Destination is Gulf for other Arab nationalities
      category = 'evisa';
      categoryLabel = 'تأشيرة إلكترونية مسبقة (eVisa) / تأشيرة سياحة مقيمي الخليج';
      maxStay = 30;
      feeUsd = 85;

      if (destCode === 'SA') {
        portalName = 'منصة التأشيرات السعودية الرسمية (روح السعودية / KSA Visa)';
        portalUrl = 'https://visa.visitsaudi.com';
        notes.push('حاملو الإقامة الخليجية السارية (لمدة 3 أشهر على الأقل) يحق لهم استخراج التأشيرة السياحية الفورية إلكترونياً.');
        notes.push('حاملو تأشيرات الشنغن أو أمريكا أو بريطانيا المستخدمة سابقاً يحق لهم الحصول على التأشيرة عند الوصول بمطارات المملكة.');
      } else if (destCode === 'AE') {
        portalName = 'منصة الهيئة الاتحادية للهوية والجنسية (ICP) وإقامة دبي (GDRFA)';
        portalUrl = 'https://smartservices.icp.gov.ae';
        notes.push('إمكانية التقديم عبر شركات الطيران الوطنية (طيران الإمارات، الاتحاد، العربية للطيران، فلاي دبي) أو الفنادق المعتمدة.');
        notes.push('تأشيرة دخول لمقيمي دول مجلس التعاون سارية إلكترونياً.');
      } else if (destCode === 'QA') {
        portalName = 'منصة هيّا الرسمية (Hayya Portal)';
        portalUrl = 'https://www.hayya.qa';
        notes.push('تقديم الطلب عبر منصة هيّا يتيح إصدار التأشيرة السياحية والإشعار الفوري خلال 48 ساعة.');
      } else if (destCode === 'OM') {
        portalName = 'شرطة عُمان السلطانية - التأشيرات الإلكترونية';
        portalUrl = 'https://evisa.rop.gov.om';
        notes.push('إعفاءات وتسهيلات خاصة لمقيمي دول مجلس التعاون وحملة التأشيرات الأمريكية والأوروبية.');
      } else {
        portalName = 'بوابة التأشيرة الإلكترونية لمملكة البحرين';
        portalUrl = 'https://www.evisa.gov.bh';
      }
    } else if (destCode === 'EG') {
      category = 'evisa';
      categoryLabel = 'تأشيرة إلكترونية (eVisa) أو تأشيرة عند الوصول لحملة إقامات محددة';
      maxStay = 30;
      feeUsd = 25;
      portalName = 'بوابة التأشيرة الإلكترونية المصرية (Visa2Egypt)';
      portalUrl = 'https://www.visa2egypt.gov.eg';
      notes.push('رسوم التأشيرة السياحية لمرة واحدة 25 دولاراً، أو 60 دولاراً للتأشيرة متعددة السفرات.');
      notes.push('يحصل مقيمو دول مجلس التعاون وحملة تأشيرات الشنغن وأمريكا وأستراليا على تأشيرة فورية عند الوصول بموانئ ومطارات مصر.');
    } else if (destCode === 'JO') {
      category = 'visa_on_arrival';
      categoryLabel = 'تأشيرة عند الوصول أو عبر التذكرة الموحدة (Jordan Pass)';
      maxStay = 30;
      feeUsd = 40;
      portalName = 'بوابة وزارة الداخلية الأردنية وJordan Pass';
      portalUrl = 'https://www.jordanpass.jo';
      notes.push('يُنصح بشراء Jordan Pass قبل الوصول لتغطية رسوم التأشيرة ورسوم دخول البتراء والمواقع التاريخية.');
    } else if (destCode === 'DJ' || destCode === 'MR') {
      category = 'evisa';
      categoryLabel = 'تأشيرة عند الوصول بيومترية أو تأشيرة إلكترونية فورية';
      maxStay = 30;
      feeUsd = 50;
      portalName = destCode === 'DJ' ? 'بوابة جيبوتي للتأشيرات (evisa.gouv.dj)' : 'المطارات والمنافذ البرية الموريتانية';
      portalUrl = destCode === 'DJ' ? 'https://www.evisa.gouv.dj' : '#';
      notes.push('تصدر التأشيرة السياحية في منافذ الوصول بسهولة بعد التحقق من جواز السفر وحجز الإقامة.');
    }

    const availableResidencies = PAN_ARAB_RESIDENCY_PATHWAYS[destCode] || [];

    return {
      origin_country: {
        country_code: origin.country_code,
        name_ar: origin.name_ar,
        flag: origin.flag
      },
      destination_country: {
        country_code: dest.country_code,
        name_ar: dest.name_ar,
        flag: dest.flag,
        capital: dest.capital || ''
      },
      visa_category: category,
      visa_category_label_ar: categoryLabel,
      max_stay_days: maxStay,
      estimated_fee_usd: feeUsd,
      passport_validity_months: 6,
      official_portal_name: portalName,
      official_portal_url: portalUrl,
      special_waivers_and_notes: notes,
      residencies_available: availableResidencies
    };
  }

  // Endpoint 7: Pan-Arab Visa & Mobility Policy Matrix
  app.get('/api/countries/analytics/visa-policy', (req: Request, res: Response) => {
    try {
      const origin = (req.query.origin as string) || 'EG';
      const destination = (req.query.destination as string) || 'SA';

      const result = evaluateArabVisaPolicy(origin.toUpperCase(), destination.toUpperCase());
      res.json({
        ok: true,
        success: true,
        data: result
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to evaluate visa policy' });
    }
  });

  // Endpoint 8: Pan-Arab Free Zones & Investment Hubs
  app.get('/api/countries/analytics/free-zones', (req: Request, res: Response) => {
    try {
      const countryFilter = req.query.country as string;
      const sectorFilter = req.query.sector as string;

      let list = [...PAN_ARAB_FREE_ZONES_DATA];

      if (countryFilter && countryFilter !== 'all') {
        list = list.filter((fz) => fz.country_code.toUpperCase() === countryFilter.toUpperCase());
      }

      if (sectorFilter && sectorFilter.trim()) {
        const q = sectorFilter.toLowerCase();
        list = list.filter((fz) =>
          fz.primary_sectors.some((s) => s.toLowerCase().includes(q)) ||
          fz.name_ar.toLowerCase().includes(q)
        );
      }

      res.json({
        ok: true,
        success: true,
        total_count: list.length,
        data: list
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch free zones' });
    }
  });

  // Endpoint 9: Pan-Arab Emergency & Consular Hotlines Directory
  app.get('/api/countries/analytics/emergency-directory', (req: Request, res: Response) => {
    try {
      const countryFilter = req.query.country as string;
      if (countryFilter && countryFilter !== 'all') {
        const item = PAN_ARAB_EMERGENCY_DATA.find(
          (e) => e.country_code.toUpperCase() === countryFilter.toUpperCase()
        );
        return res.json({
          ok: true,
          success: true,
          data: item ? [item] : []
        });
      }

      res.json({
        ok: true,
        success: true,
        total_count: PAN_ARAB_EMERGENCY_DATA.length,
        data: PAN_ARAB_EMERGENCY_DATA
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch emergency directory' });
    }
  });

  // Endpoint 10: Smart Executive Country Dossier Generator
  app.get('/api/countries/analytics/dossier/:code', (req: Request, res: Response) => {
    try {
      const code = req.params.code.toUpperCase();
      const country = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[code];
      if (!country) {
        return res.status(404).json({ ok: false, error: 'Country not found' });
      }

      const countryFreeZones = PAN_ARAB_FREE_ZONES_DATA.filter((fz) => fz.country_code === code);
      const emergency = PAN_ARAB_EMERGENCY_DATA.find((e) => e.country_code === code);
      const seaports = country.seaports ? country.seaports.map((p) => p.name_ar) : [];
      const airports = country.airports ? country.airports.map((a) => `${a.name_ar} (${a.code})`) : [];

      const dossier: CountryExecutiveDossier = {
        country: {
          country_code: country.country_code,
          name_ar: country.name_ar,
          name_en: country.name_en,
          flag: country.flag,
          capital: country.capital,
          currency: country.currency,
          currency_symbol: country.currency_symbol,
          population: country.population,
          area_sq_km: country.area_sq_km,
          calling_code: country.calling_code,
          timezone: country.timezone,
          domain_tld: country.domain_tld
        },
        economic_summary: {
          nominal_gdp: country.gdp_reference,
          growth_rate: country.growth_rate_reference,
          classification: ECONOMIC_CLASSIFICATIONS[code] === 'oil_and_gas' ? 'اقتصاد طاقة وبتروكيماويات' : ECONOMIC_CLASSIFICATIONS[code] === 'diversified' ? 'اقتصاد متنوع تجاري وصناعي' : 'اقتصاد تعدين وزراعة وخدمات',
          key_sectors: country.economic_sectors || []
        },
        geopolitical_hubs: {
          straits_count: country.islands_and_straits ? country.islands_and_straits.length : 0,
          seaports,
          airports
        },
        mobility_overview: {
          visa_types_available: ['تأشيرة سياحية', 'تأشيرة عمل وزيارة تجارية', 'إقامة مستثمرين'],
          official_visa_portal: code === 'SA' ? 'visa.visitsaudi.com' : code === 'AE' ? 'icp.gov.ae' : code === 'EG' ? 'visa2egypt.gov.eg' : code === 'QA' ? 'hayya.qa' : 'المنصة الوطنية الرسمية',
          golden_visas: !!PAN_ARAB_RESIDENCY_PATHWAYS[code]
        },
        free_zones_count: countryFreeZones.length,
        top_free_zones: countryFreeZones.map((fz) => fz.name_ar),
        emergency_numbers: {
          unified: emergency ? emergency.unified_emergency : '112 / 999',
          police: emergency ? emergency.police : 'شرطة النجدة',
          ambulance: emergency ? emergency.ambulance : 'الإسعاف الوطني'
        },
        key_cities_count: country.cities ? country.cities.length : 0,
        tourism_highlights: country.landmarks ? country.landmarks.slice(0, 5).map((l) => l.name_ar) : [],
        generated_at: new Date().toISOString(),
        dossier_fingerprint: `DARB-EXECUTIVE-${code}-${Date.now().toString(36).toUpperCase()}`
      };

      res.json({
        ok: true,
        success: true,
        data: dossier
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to generate country dossier' });
    }
  });

  // =========================================================================
  // PHASE 5: PAN-ARAB TRADE, LOGISTICS, LABOR MARKET & RELOCATION ROADMAP
  // =========================================================================

  const PAN_ARAB_TRADE_AGREEMENTS: PanArabTradeAgreement[] = [
    {
      id: 'gafta',
      name_ar: 'منطقة التجارة الحرة العربية الكبرى (GAFTA)',
      name_en: 'Greater Arab Free Trade Area',
      type: 'multilateral',
      member_countries: ['SA', 'AE', 'EG', 'JO', 'MA', 'TN', 'DZ', 'OM', 'KW', 'QA', 'BH', 'IQ', 'LB', 'SD', 'SY', 'YE', 'LY', 'PS'],
      summary_ar: 'الاتفاقية الاقتصادية الأوسع نطاقاً بين الدول العربية، دخلت حيز التنفيذ الكامل بإلغاء كافة الرسوم الجمركية والضرائب ذات الأثر المماثل على السلع المتبادلة ذات المنشأ العربي.',
      customs_benefits_ar: 'إعفاء جمركي بنسبة 100% لكافة السلع الصناعية والزراعية المتبادلة التي تحقق قاعدة المنشأ العربي.',
      rules_of_origin_pct: 40,
      official_body_ar: 'جامعة الدول العربية - المجلس الاقتصادي والاجتماعي'
    },
    {
      id: 'gcc_customs_union',
      name_ar: 'الاتحاد الجمركي لدول مجلس التعاون الخليجي',
      name_en: 'GCC Customs Union',
      type: 'regional',
      member_countries: ['SA', 'AE', 'QA', 'KW', 'BH', 'OM'],
      summary_ar: 'اتحاد جمركي كامل يوحد التعرفة الجمركية الخارجية تجاه العالم بنسبة 5% على معظم السلع، مع تطبيق مبدأ نقطة الدخول الواحدة وحرية تنقل البضائع البينية دون رسوم إضافية.',
      customs_benefits_ar: 'تعرفة خارجية موحدة 5%، نقطة دخول واحدة، حرية انتقال السلع الوطنية ورأسمال والخدمات دون قيود جمركية بينية.',
      rules_of_origin_pct: 40,
      official_body_ar: 'الأمانة العامة لمجلس التعاون لدول الخليج العربية - هيئة الاتحاد الجمركي'
    },
    {
      id: 'agadir_agreement',
      name_ar: 'اتفاقية أغادير للتبادل الحر',
      name_en: 'Agadir Agreement',
      type: 'regional',
      member_countries: ['EG', 'MA', 'TN', 'JO'],
      summary_ar: 'اتفاقية تهدف لتعزيز التكامل الصناعي والتجاري بين دول جنوب البحر المتوسط وإقامة منطقة تجارة حرة تدعم التراكم الإقليمي للمنشأ مع الاتحاد الأوروبي (قواعد بانا-يورو-ميد Pan-Euro-Med).',
      customs_benefits_ar: 'إعفاءات جمركية شاملة وتراكم مشترك للمنشأ لتسهيل التصدير المشترك إلى أسواق الاتحاد الأوروبي.',
      rules_of_origin_pct: 35,
      official_body_ar: 'الوحدة الفنية لاتفاقية أغادير (عَمّان)'
    },
    {
      id: 'saudi_egypt_trade_pact',
      name_ar: 'بروتوكول التجارة والفرص الاستثمارية المشتركة (السعودية - مصر)',
      name_en: 'Saudi-Egypt Comprehensive Trade Protocol',
      type: 'bilateral',
      member_countries: ['SA', 'EG'],
      summary_ar: 'شراكة اقتصادية كبرى تشمل تسهيل نفاذ الصادرات الزراعية والصناعية عبر موانئ البحر الأحمر وتفعيل التخليص المسبق والاعتراف المتبادل بالمواصفات القياسية.',
      customs_benefits_ar: 'مسار سريع للشحنات سريعة التلف عبر موانئ سفاجا-ضبا، وإعفاءات جمركية بموجب GAFTA مع تسهيلات ائتمانية وتخزينية.',
      rules_of_origin_pct: 40,
      official_body_ar: 'مجلس التنسيق السعودي المصري واللجنة الوزارية المشتركة'
    },
    {
      id: 'uae_cepas_arab',
      name_ar: 'اتفاقيات الشراكة الاقتصادية الشاملة الإماراتية (CEPA)',
      name_en: 'UAE Comprehensive Economic Partnership Agreements',
      type: 'bilateral',
      member_countries: ['AE', 'JO'],
      summary_ar: 'اتفاقيات شراكة حديثة الجيل تشمل خفض الحواجز أمام التجارة غير النفطية، وتحرير تجارة الخدمات، وتيسير الاستثمار واللوجستيات الرقمية وسلاسل الإمداد الذكية.',
      customs_benefits_ar: 'إلغاء وتخفيض فوري وتدريجي للتعرفات الجمركية على أكثر من 90% من خطوط السلع المتبادلة.',
      rules_of_origin_pct: 40,
      official_body_ar: 'وزارة الاقتصاد - دولة الإمارات العربية المتحدة'
    }
  ];

  const PAN_ARAB_TRANSIT_CORRIDORS: PanArabTransitCorridor[] = [
    {
      id: 'batha_ghwaifat',
      name_ar: 'منفذ البطحاء / الغويفات البري',
      corridor_type: 'land_border',
      country_a: 'SA',
      country_b: 'AE',
      border_crossing_name_ar: 'منفذ البطحاء (السعودية) / منفذ الغويفات (الإمارات)',
      status_ar: 'يعمل 24/7 بكفاءة جمركية رقمية عالية',
      avg_clearance_hours: '2 إلى 4 ساعات للشاحنات التجارية',
      primary_cargo_types: ['المعدات الصناعية', 'السلع الاستهلاكية سريعة التداول', 'المركبات وقطع الغيار', 'المواد الغذائية'],
      operational_notes_ar: 'أكبر شريان تجاري بري بين السعودية والإمارات بحركة تزيد عن 2000 شاحنة يومياً مزود بمسارات التخليص السريع (FASAH) والربط الإلكتروني الجمركي.'
    },
    {
      id: 'king_fahd_causeway',
      name_ar: 'منفذ جسر الملك فهد',
      corridor_type: 'land_border',
      country_a: 'SA',
      country_b: 'BH',
      border_crossing_name_ar: 'منطقة الإجراءات المركزية على جسر الملك فهد',
      status_ar: 'يعمل على مدار الساعة بكامل طاقته',
      avg_clearance_hours: '1 إلى 2.5 ساعة',
      primary_cargo_types: ['الألمنيوم والصناعات المعدنية', 'البتروكيماويات', 'المنتجات الطازجة والغذائية', 'بضائع التجارة الإلكترونية'],
      operational_notes_ar: 'الرابط البري الحيوي الوحيد لمملكة البحرين بطول 25 كم، يطبق فحصاً بالأشعة السينية المتطورة وتفويجاً ذكياً للشاحنات.'
    },
    {
      id: 'empty_quarter_crossing',
      name_ar: 'منفذ الربع الخالي / رملة خيلة',
      corridor_type: 'land_border',
      country_a: 'SA',
      country_b: 'OM',
      border_crossing_name_ar: 'منفذ الربع الخالي (السعودية) / منفذ رملة خيلة (عُمان)',
      status_ar: 'مفتوح للشحن التجاري والمسافرين',
      avg_clearance_hours: '3 إلى 5 ساعات',
      primary_cargo_types: ['المنتجات البتروكيماوية', 'مواد البناء والمعادن', 'الأسماك والمأكولات البحرية المبردة'],
      operational_notes_ar: 'إنجاز هندسي تاريخي يختصر مسافة النقل البري بين السعودية وسلطنة عمان بنحو 800 كم دون الحاجة للمرور بالإمارات.'
    },
    {
      id: 'salwa_abu_samra',
      name_ar: 'منفذ سلوى / أبو سمرة البري',
      corridor_type: 'land_border',
      country_a: 'SA',
      country_b: 'QA',
      border_crossing_name_ar: 'منفذ سلوى (السعودية) / منفذ أبو سمرة (قطر)',
      status_ar: 'يعمل 24/7 بطاقة استيعابية مضاعفة',
      avg_clearance_hours: '1.5 إلى 3 ساعات',
      primary_cargo_types: ['مواد البناء ومشاريع البنية التحتية', 'الأغذية والماشية', 'السلع الاستهلاكية'],
      operational_notes_ar: 'المنفذ البري الوحيد لدولة قطر الذي تم تطويره وتوسعته بالكامل لتسهيل التدفق اللوجستي وتكامل التخليص المسبق.'
    },
    {
      id: 'nuwaiseeb_khafji',
      name_ar: 'منفذ الخفجي / النويصيب',
      corridor_type: 'land_border',
      country_a: 'SA',
      country_b: 'KW',
      border_crossing_name_ar: 'منفذ الخفجي (السعودية) / منفذ النويصيب (الكويت)',
      status_ar: 'يعمل 24/7',
      avg_clearance_hours: '2 إلى 3 ساعات',
      primary_cargo_types: ['المواد الإنشائية', 'الأغذية المصنعة', 'الكيماويات ومعدات حقول النفط'],
      operational_notes_ar: 'المنفذ التجاري الرئيسي الرابط بين الكويت والمملكة والخليج مع تطبيق التتبع الإلكتروني للشاحنات العابرة (الترانزيت).'
    },
    {
      id: 'salloum_musaed',
      name_ar: 'معبر السلوم / امساعد البري',
      corridor_type: 'land_border',
      country_a: 'EG',
      country_b: 'LY',
      border_crossing_name_ar: 'ميناء السلوم البري المطور (مصر) / معبر امساعد (ليبيا)',
      status_ar: 'يعمل بالكامل بعد تطوير المنطقة اللوجستية المصرية',
      avg_clearance_hours: '4 إلى 8 ساعات',
      primary_cargo_types: ['مواد الإعمار والأسمنت والحديد', 'السلع الغذائية والزراعية', 'الأدوية والمستلزمات الطبية'],
      operational_notes_ar: 'البوابة اللوجستية الرئيسية لإعادة إعمار ليبيا وتدفق العمالة والصادرات المصرية، تم تزويده بساحات شحن ومستودعات مبردة حديثة.'
    },
    {
      id: 'ras_ajdir',
      name_ar: 'معبر رأس جدير الحدودي',
      corridor_type: 'land_border',
      country_a: 'TN',
      country_b: 'LY',
      border_crossing_name_ar: 'معبر رأس جدير الدولي (تونس - ليبيا)',
      status_ar: 'مفتوح لحركة الشحن التجاري والمسافرين',
      avg_clearance_hours: '3 إلى 6 ساعات',
      primary_cargo_types: ['المواد الغذائية والزيوت', 'الأدوية والمواد الاستهلاكية', 'قطع الغيار والمنسوجات'],
      operational_notes_ar: 'المنفذ الأهم في شمال أفريقيا بين تونس وليبيا، يخضع لبروتوكولات تنظيم وتنسيق أمني وجمركي مشترك.'
    },
    {
      id: 'guerguerat',
      name_ar: 'معبر الكركرات الحدودي الاستراتيجي',
      corridor_type: 'land_border',
      country_a: 'MA',
      country_b: 'MR',
      border_crossing_name_ar: 'معبر الكركرات (المغرب - موريتانيا)',
      status_ar: 'مؤمن ويعمل 24/7 بانسيابية تامة',
      avg_clearance_hours: '3 إلى 6 ساعات',
      primary_cargo_types: ['الخضروات والفواكه الطازجة', 'الأسماك المجمدة', 'المواد الغذائية المصنعة', 'السلع الموجهة لغرب أفريقيا'],
      operational_notes_ar: 'الشريان التجاري البري الوحيد الرابط بين المغرب وشمال أفريقيا ودول غرب أفريقيا (ECOWAS) عبر موريتانيا.'
    },
    {
      id: 'jaber_nasib',
      name_ar: 'معبر جابر / نصيب الحدودي',
      corridor_type: 'land_border',
      country_a: 'JO',
      country_b: 'SY',
      border_crossing_name_ar: 'مركز جابر (الأردن) / معبر نصيب (سوريا)',
      status_ar: 'يعمل بنظام النقل بالترانزيت والتبادل المباشر',
      avg_clearance_hours: '5 إلى 10 ساعات',
      primary_cargo_types: ['الفواكه والخضار', 'المنسوجات والملابس', 'الأحجار والرخام', 'الكيماويات'],
      operational_notes_ar: 'الممر التاريخي لشاحنات الترانزيت بين بلاد الشام ودول الخليج العربي وميناء العقبة.'
    },
    {
      id: 'safaga_duba_ferry',
      name_ar: 'الجسر الملاحي والعبارات (سفاجا - ضبا)',
      corridor_type: 'maritime_ferry',
      country_a: 'EG',
      country_b: 'SA',
      border_crossing_name_ar: 'ميناء سفاجا البحري (مصر) / ميناء ضبا (السعودية)',
      status_ar: 'رحلات منتظمة يومية لسفن الدحرجة (Ro-Ro) والركاب',
      avg_clearance_hours: '8 إلى 14 ساعة تشمل الإبحار والتخليص',
      primary_cargo_types: ['الحاصلات الزراعية المبردة', 'شاحنات البضائع العامة', 'المركبات والمعدات'],
      operational_notes_ar: 'الخط البحري الأقصر بين الموانئ المصرية والسعودية على البحر الأحمر ويمثل الرابط اللوجستي الأكبر بين شمال أفريقيا والجزيرة العربية.'
    }
  ];

  const PAN_ARAB_LABOR_SECTOR_DEMANDS: PanArabLaborSectorDemand[] = [
    {
      id: 'ai_cloud_cybersecurity',
      title_ar: 'الذكاء الاصطناعي، الحوسبة السحابية والأمن السيبراني',
      category: 'technology',
      top_hiring_countries: ['SA', 'AE', 'QA', 'EG', 'JO'],
      demand_level: 'very_high',
      growth_rate_forecast: '+32% سنوياً حتى 2030',
      typical_roles: [
        'مهندس نماذج تعلم الآلة وذكاء اصطناعي (AI/ML Engineer)',
        'مهندس حلول سحابية متقدمة (Cloud Solutions Architect)',
        'محلل استجابة للحوادث السيبرانية (Cyber Incident Responder)',
        'مهندس بيانات ضخمة وخطوط معالجة (Data Pipeline Engineer)'
      ],
      required_skills: ['Python', 'TensorFlow / PyTorch', 'AWS / Azure / GCP', 'Kubernetes', 'ISO 27001 / SOC2 Compliance', 'Arabic NLP'],
      notes_ar: 'تشهد دول الخليج وعلى رأسها السعودية والإمارات استثمارات تريليونية في مراكز البيانات الوطنية ومبادرات السيادة الرقمية.'
    },
    {
      id: 'renewable_green_hydrogen',
      title_ar: 'الطاقة المتجددة، الهيدروجين الأخضر والتعدين المستدام',
      category: 'energy',
      top_hiring_countries: ['SA', 'AE', 'MA', 'EG', 'OM', 'MR'],
      demand_level: 'very_high',
      growth_rate_forecast: '+28% سنوياً',
      typical_roles: [
        'مهندس كيميائي لمحطات الهيدروجين والأمونيا الخضراء',
        'مدير مشاريع طاقة رياح وشمسية عملاقة (PV & Wind Farms)',
        'جيولوجي استكشاف معادن حرجة وبطاريات (Critical Minerals)',
        'أخصائي استدامة واحتجاز الكربون (ESG & Carbon Capture)'
      ],
      required_skills: ['Green Electrolysis Systems', 'Solar PV Design', 'Geological GIS', 'Carbon Accounting', 'Industrial Safety HAZOP'],
      notes_ar: 'المغرب ومصر وعمان والسعودية تتصدر استراتيجيات التحول الطاقي وبناء أكبر مجمعات لإنتاج وتصدير الهيدروجين الأخضر لأوروبا وآسيا.'
    },
    {
      id: 'specialized_healthcare_nursing',
      title_ar: 'الرعاية الصحية التخصصية والتمريض الدقيق والتقنيات الطبية',
      category: 'healthcare',
      top_hiring_countries: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'],
      demand_level: 'very_high',
      growth_rate_forecast: '+24% سنوياً',
      typical_roles: [
        'طبيب استشاري عناية مركزة وتخدير وجراحة دقيقة',
        'أخصائي تمريض سريري وقسطرة قلبية',
        'مهندس أجهزة طبية وذكاء تشخيصي (Biomedical Engineer)',
        'أخصائي معلوماتية صحية وسجلات رقمية (Health Informatics)'
      ],
      required_skills: ['Board Certification (FRCS, Arab Board, etc.)', 'BLS / ACLS Certification', 'Clinical Data Governance', 'Hospital Accreditation (JCI)'],
      notes_ar: 'برامج التوسع في المدن الطبية المتكاملة والتأمين الصحي الإلزامي ترفع الطلب باستمرار مع شروط تراخيص مهنية مرنة لحملة البورد المعترف به.'
    },
    {
      id: 'logistics_supply_chain_ports',
      title_ar: 'إدارة سلاسل الإمداد، الموانئ البحرية والأتمتة اللوجستية',
      category: 'logistics',
      top_hiring_countries: ['AE', 'SA', 'MA', 'EG', 'DJ', 'OM'],
      demand_level: 'high',
      growth_rate_forecast: '+21% سنوياً',
      typical_roles: [
        'مدير عمليات محطات حاويات وموانئ بحرية (Port Operations)',
        'خبير تخطيط سلاسل إمداد وتوريد إقليمية (Supply Chain Planner)',
        'مدير مراكز توزيع مؤتمتة ومستودعات ذكية (Smart Warehousing)',
        'أخصائي شحن دولي ولوجستيات التبريد (Cold Chain Specialist)'
      ],
      required_skills: ['TOS (Terminal Operating Systems)', 'SAP SCM / Oracle WMS', 'Incoterms 2020', 'Customs Clearance Law', 'Fleet Telematics'],
      notes_ar: 'الموقع الاستراتيجي للمنطقة العربية حول مضايق التجارة العالمية يجعل الكفاءات اللوجستية محور جذب للشركات متعددة الجنسيات.'
    },
    {
      id: 'fintech_corporate_finance',
      title_ar: 'التقنية المالية والتمويل الإسلامي وإدارة الثروات',
      category: 'finance_business',
      top_hiring_countries: ['AE', 'SA', 'QA', 'BH', 'EG'],
      demand_level: 'high',
      growth_rate_forecast: '+19% سنوياً',
      typical_roles: [
        'مطور حلول مدفوعات وبنوك مفتوحة (Open Banking / APIs)',
        'مدير استثمار أسهم خاصة ورأس مال جريء (Venture Capital)',
        'أخصائي التزام ومكافحة غسل الأموال (AML / CFT Specialist)',
        'مستشار تمويل إسلامي وصكوك خضراء (Islamic Sukuk)'
      ],
      required_skills: ['CFA / ACCA / CAMS', 'Smart Contracts & Blockchain', 'Financial Modeling (DCF / LBO)', 'Central Bank Regulatory Sandbox'],
      notes_ar: 'الرياض ودبي وأبوظبي والدوحة والمنامة تتحول إلى مراكز مالية عالمية جاذبة لرؤوس الأموال الجريئة وحاضنات الفنتك.'
    },
    {
      id: 'tourism_mega_projects',
      title_ar: 'الضيافة الفاخرة، الترفيه، وتطوير المتاحف والآثار',
      category: 'engineering',
      top_hiring_countries: ['SA', 'AE', 'QA', 'EG', 'JO', 'OM'],
      demand_level: 'high',
      growth_rate_forecast: '+25% سنوياً',
      typical_roles: [
        'مدير منتجعات بيئية وفنادق 5 نجوم (Eco-Resort General Manager)',
        'أخصائي إدارة معارض وترميم متاحف وتراث عالمي (Curator)',
        'مدير فعاليات كبرى ومعارض دولية (Mega-Events Director)',
        'مرشد سياحي ثقافي معتمد متعدد اللغات'
      ],
      required_skills: ['Luxury Hospitality Standards', 'Heritage Preservation Principles', 'Large-Scale Event Logistics', 'Multi-Language Fluency'],
      notes_ar: 'استثمارات مشاريع البحر الأحمر والعلا والدرعية ونيوم في السعودية، والمتحف المصري الكبير، ومشاريع دبي والدوحة تدفع بالقطاع لمستويات نمو غير مسبوقة.'
    }
  ];

  const PAN_ARAB_SALARY_BENCHMARKS: PanArabSalaryBenchmark[] = [
    {
      role_title_ar: 'مهندس برمجيات وذكاء اصطناعي (Software / AI Engineer)',
      category: 'technology',
      salaries_by_country: {
        SA: { junior_usd: 2400, mid_usd: 4800, senior_usd: 8500, executive_usd: 14000, local_currency_code: 'SAR', fx_rate_to_usd: 3.75 },
        AE: { junior_usd: 2800, mid_usd: 5500, senior_usd: 9500, executive_usd: 16000, local_currency_code: 'AED', fx_rate_to_usd: 3.67 },
        QA: { junior_usd: 2600, mid_usd: 5200, senior_usd: 9000, executive_usd: 15000, local_currency_code: 'QAR', fx_rate_to_usd: 3.64 },
        KW: { junior_usd: 2200, mid_usd: 4500, senior_usd: 7500, executive_usd: 12500, local_currency_code: 'KWD', fx_rate_to_usd: 0.308 },
        EG: { junior_usd: 550, mid_usd: 1200, senior_usd: 2400, executive_usd: 4500, local_currency_code: 'EGP', fx_rate_to_usd: 48.8 },
        JO: { junior_usd: 800, mid_usd: 1600, senior_usd: 3000, executive_usd: 5500, local_currency_code: 'JOD', fx_rate_to_usd: 0.709 },
        MA: { junior_usd: 750, mid_usd: 1500, senior_usd: 2800, executive_usd: 5000, local_currency_code: 'MAD', fx_rate_to_usd: 9.85 }
      }
    },
    {
      role_title_ar: 'طبيب استشاري / جراح (Consultant Physician)',
      category: 'healthcare',
      salaries_by_country: {
        SA: { junior_usd: 4500, mid_usd: 8500, senior_usd: 15000, executive_usd: 25000, local_currency_code: 'SAR', fx_rate_to_usd: 3.75 },
        AE: { junior_usd: 5000, mid_usd: 9500, senior_usd: 16500, executive_usd: 28000, local_currency_code: 'AED', fx_rate_to_usd: 3.67 },
        QA: { junior_usd: 4800, mid_usd: 9000, senior_usd: 16000, executive_usd: 26000, local_currency_code: 'QAR', fx_rate_to_usd: 3.64 },
        KW: { junior_usd: 4200, mid_usd: 8000, senior_usd: 14000, executive_usd: 22000, local_currency_code: 'KWD', fx_rate_to_usd: 0.308 },
        EG: { junior_usd: 600, mid_usd: 1400, senior_usd: 3000, executive_usd: 6000, local_currency_code: 'EGP', fx_rate_to_usd: 48.8 },
        JO: { junior_usd: 1200, mid_usd: 2500, senior_usd: 4500, executive_usd: 8500, local_currency_code: 'JOD', fx_rate_to_usd: 0.709 },
        MA: { junior_usd: 1100, mid_usd: 2200, senior_usd: 4000, executive_usd: 7500, local_currency_code: 'MAD', fx_rate_to_usd: 9.85 }
      }
    },
    {
      role_title_ar: 'مهندس مدني ومدير مشاريع كبرى (Civil / Project Director)',
      category: 'engineering',
      salaries_by_country: {
        SA: { junior_usd: 2200, mid_usd: 4400, senior_usd: 8000, executive_usd: 15000, local_currency_code: 'SAR', fx_rate_to_usd: 3.75 },
        AE: { junior_usd: 2400, mid_usd: 4800, senior_usd: 8800, executive_usd: 16000, local_currency_code: 'AED', fx_rate_to_usd: 3.67 },
        QA: { junior_usd: 2300, mid_usd: 4600, senior_usd: 8400, executive_usd: 15500, local_currency_code: 'QAR', fx_rate_to_usd: 3.64 },
        KW: { junior_usd: 2000, mid_usd: 4000, senior_usd: 7000, executive_usd: 12000, local_currency_code: 'KWD', fx_rate_to_usd: 0.308 },
        EG: { junior_usd: 450, mid_usd: 1000, senior_usd: 2000, executive_usd: 4000, local_currency_code: 'EGP', fx_rate_to_usd: 48.8 },
        JO: { junior_usd: 700, mid_usd: 1400, senior_usd: 2600, executive_usd: 5000, local_currency_code: 'JOD', fx_rate_to_usd: 0.709 },
        MA: { junior_usd: 650, mid_usd: 1300, senior_usd: 2400, executive_usd: 4500, local_currency_code: 'MAD', fx_rate_to_usd: 9.85 }
      }
    },
    {
      role_title_ar: 'محلل مالي ومدير استثمار (Financial Analyst / CFA)',
      category: 'finance_business',
      salaries_by_country: {
        SA: { junior_usd: 2500, mid_usd: 5000, senior_usd: 9000, executive_usd: 16000, local_currency_code: 'SAR', fx_rate_to_usd: 3.75 },
        AE: { junior_usd: 2900, mid_usd: 5800, senior_usd: 10000, executive_usd: 18000, local_currency_code: 'AED', fx_rate_to_usd: 3.67 },
        QA: { junior_usd: 2700, mid_usd: 5300, senior_usd: 9200, executive_usd: 16500, local_currency_code: 'QAR', fx_rate_to_usd: 3.64 },
        KW: { junior_usd: 2300, mid_usd: 4600, senior_usd: 8000, executive_usd: 13500, local_currency_code: 'KWD', fx_rate_to_usd: 0.308 },
        EG: { junior_usd: 500, mid_usd: 1100, senior_usd: 2200, executive_usd: 4200, local_currency_code: 'EGP', fx_rate_to_usd: 48.8 },
        JO: { junior_usd: 750, mid_usd: 1500, senior_usd: 2800, executive_usd: 5200, local_currency_code: 'JOD', fx_rate_to_usd: 0.709 },
        MA: { junior_usd: 700, mid_usd: 1400, senior_usd: 2600, executive_usd: 4800, local_currency_code: 'MAD', fx_rate_to_usd: 9.85 }
      }
    }
  ];

  const PAN_ARAB_ATTESTATION_GUIDES: Record<string, PanArabAttestationGuide> = {
    SA: {
      country_code: 'SA',
      country_name_ar: 'المملكة العربية السعودية',
      flag: '🇸🇦',
      responsible_authority_ar: 'وزارة الخارجية والتعليم والهيئات المهنية (الهيئة السعودية للمهندسين، هيئة التخصصات الصحية SCFHS)',
      portal_url: 'https://www.scfhs.org.sa / https://www.saudieng.sa',
      stages: [
        { step_num: 1, title_ar: 'توثيق الشهادة وكشف الدرجات', description_ar: 'تصديق الشهادة الأصلية وسجل الدرجات من وزارة التعليم العالي والجامعة المانحة في دولة التخرج.', estimated_days: '3-7 أيام', approx_fee_usd: '$30 - $60' },
        { step_num: 2, title_ar: 'تصديق وزارة الخارجية وسفارة السعودية', description_ar: 'تصديق الأوراق من وزارة خارجية بلد التخرج، ثم من الملحقية الثقافية والقنصلية السعودية أو مراكز (تأشير / VFS).', estimated_days: '5-12 يوماً', approx_fee_usd: '$50 - $100' },
        { step_num: 3, title_ar: 'التحقق الأكاديمي والمهني (DataFlow)', description_ar: 'رفع الأوراق عبر نظام التحقق الدولي DataFlow للتخصصات الصحية والطبية والمهنية للتحقق من المصدر الأساسي.', estimated_days: '15-25 يوماً', approx_fee_usd: '$250 - $400' },
        { step_num: 4, title_ar: 'التسجيل المهني واختبار الهيئة', description_ar: 'الحصول على التصنيف المهني والتسجيل في هيئة التخصصات الصحية أو هيئة المهندسين أو المحاسبين لإصدار رخصة الممارسة.', estimated_days: '7-14 يوماً', approx_fee_usd: '$150 - $300' }
      ],
      healthcare_specific_notes_ar: 'يتطلب التسجيل الصحي شهادة خبرة لا تقل عن سنتين، ورخصة مزاولة مهنة سارية، واجتياز اختبار البرومترك (Prometric) المعتمد.',
      engineering_specific_notes_ar: 'يشترط الاعتماد المهني لهيئة المهندسين السعوديين فحص الشهادة عبر منصة معتمدة واجتياز اختبار المعايير الهندسية.'
    },
    AE: {
      country_code: 'AE',
      country_name_ar: 'الإمارات العربية المتحدة',
      flag: '🇦🇪',
      responsible_authority_ar: 'وزارة التربية والتعليم / وزارة الخارجية الإماراتية (MOFA) / هيئات الصحة (DHA / DOH / MOHAP)',
      portal_url: 'https://www.mofa.gov.ae / https://www.moe.gov.ae',
      stages: [
        { step_num: 1, title_ar: 'تصديق دولة المنشأ', description_ar: 'توثيق الشهادة من وزارة التعليم العالي ووزارة الخارجية في دولة إصدار الشهادة.', estimated_days: '3-7 أيام', approx_fee_usd: '$40 - $70' },
        { step_num: 2, title_ar: 'تصديق سفارة الإمارات', description_ar: 'تصديق الوثائق من سفارة دولة الإمارات أو مراكز خدمة المتعاملين التابعة لها في الخارج.', estimated_days: '3-6 أيام', approx_fee_usd: '$45' },
        { step_num: 3, title_ar: 'التصديق الرقمي لوزارة الخارجية الإماراتية (MOFA)', description_ar: 'التقديم عبر تطبيق MOFA الإلكتروني للحصول على الملصق الرقمي QR Code الفوري للتصديق.', estimated_days: '1-2 يوم', approx_fee_usd: '$42' },
        { step_num: 4, title_ar: 'معادلة الشهادة الأكاديمية (وزارة التربية والتعليم)', description_ar: 'إصدار شهادة المعادلة الرسمية (Equivalency Certificate) عبر موقع وزارة التربية والتعليم للعمل في القطاع الحكومي والتعليمي.', estimated_days: '10-20 يوماً', approx_fee_usd: '$30 - $60' }
      ],
      healthcare_specific_notes_ar: 'الأطباء والمهن الطبية يتقدمون لاختبارات DHA (دبي) أو DOH (أبوظبي) عبر فحص DataFlow، وتتيح الدولة حالياً تحويلاً سلساً وموحداً للتراخيص الطبية بين كافة الإمارات.',
      engineering_specific_notes_ar: 'بلديات أبوظبي ودبي تشترط قيد المهندسين في سجل الكوادر الهندسية المعتمدة وتصنيف الكفاءات.'
    },
    QA: {
      country_code: 'QA',
      country_name_ar: 'دولة قطر',
      flag: '🇶🇦',
      responsible_authority_ar: 'وزارة التعليم والتعليم العالي / وزارة الصحة العامة (DHP) / لجنة معادلة الشهادات',
      portal_url: 'https://www.edu.gov.qa / https://www.moph.gov.qa',
      stages: [
        { step_num: 1, title_ar: 'تصديق وزارة التعليم والخارجية', description_ar: 'توثيق الشهادة والسجل الدراسي من التعليم العالي وخارجية بلد الدراسة.', estimated_days: '4-8 أيام', approx_fee_usd: '$40' },
        { step_num: 2, title_ar: 'تصديق سفارة قطر بالخارج', description_ar: 'تصديق الشهادة المرفقة بكتاب إثبات انتظام رسمي من الجامعة يؤكد الدراسة الفعلية.', estimated_days: '5-10 أيام', approx_fee_usd: '$55' },
        { step_num: 3, title_ar: 'تصديق الخارجية القطرية بالدوحة', description_ar: 'إنهاء التصديق النهائي عبر مكاتب الشؤون القنصلية في الدوحة.', estimated_days: '1-2 يوم', approx_fee_usd: '$28' },
        { step_num: 4, title_ar: 'المعادلة الأكاديمية أو الترخيص المهني', description_ar: 'تقديم طلب المعادلة لوزارة التعليم، أو التقدم لتراخيص ممارسي الرعاية الصحية (DHP) بنظام Prometric.', estimated_days: '14-30 يوماً', approx_fee_usd: '$100 - $250' }
      ]
    },
    EG: {
      country_code: 'EG',
      country_name_ar: 'جمهورية مصر العربية',
      flag: '🇪🇬',
      responsible_authority_ar: 'المجلس الأعلى للجامعات / النقابات المهنية (نقابة المهندسين، نقابة الأطباء) / وزارة القوى العاملة',
      portal_url: 'https://scu.eg',
      stages: [
        { step_num: 1, title_ar: 'تصديق القنصلية المصرية بالخارج', description_ar: 'توثيق المؤهل الدراسي من خارجية الدولة المانحة والقنصلية المصرية في بلد الدراسة.', estimated_days: '5-10 أيام', approx_fee_usd: '$40 - $70' },
        { step_num: 2, title_ar: 'توثيق مكاتب التصديقات لوزارة الخارجية المصرية', description_ar: 'وضع خاتم تصديق الخارجية المصرية من أحد مقرات التصديقات الرسمية.', estimated_days: '1-2 يوم', approx_fee_usd: '$10' },
        { step_num: 3, title_ar: 'معادلة المؤهل بالمجلس الأعلى للجامعات', description_ar: 'فحص المقاصة العلمية وساعات الدراسة لمطابقة المؤهل بالمعايير الجامعية المصرية.', estimated_days: '20-45 يوماً', approx_fee_usd: '$50 - $120' },
        { step_num: 4, title_ar: 'القيد بالنقابة المهنية واستخراج تصريح العمل', description_ar: 'تسجيل العضوية بالنقابة المختصة للوافدين واستخراج ترخيص مزاولة المهنة.', estimated_days: '15-30 يوماً', approx_fee_usd: '$100' }
      ]
    }
  };

  const PAN_ARAB_RELOCATION_STEPS: PanArabRelocationStep[] = [
    {
      id: 'step_attestation',
      phase_key: 'prep_60',
      phase_title_ar: 'المرحلة 1: التحضير المسبق (60 إلى 30 يوماً قبل السفر)',
      title_ar: 'تصديق المؤهلات العلمية وعقود العمل والوثائق الشخصية',
      description_ar: 'بدء تصديقات الشهادات الدراسية، عقد الزواج، شهادات ميلاد الأبناء، والفيش الجنائي (بحث الحالة الجنائية) من وزارات التعليم والخارجية والسفارات.',
      category: 'legal_visas',
      priority: 'critical',
      days_range: 'اليوم 60- إلى 30-'
    },
    {
      id: 'step_medical_visa_prep',
      phase_key: 'prep_60',
      phase_title_ar: 'المرحلة 1: التحضير المسبق (60 إلى 30 يوماً قبل السفر)',
      title_ar: 'الفحص الطبي المعتمد للسفر وتأشيرة الدخول المبدئية',
      description_ar: 'إجراء الفحوصات الطبية عبر المراكز المعتمدة (مثل مراكز وافد Wafid للخليج) وإصدار تأشيرة الدخول أو إذن الدخول الإلكتروني.',
      category: 'legal_visas',
      priority: 'critical',
      days_range: 'اليوم 45- إلى 20-'
    },
    {
      id: 'step_shipping_temporary_stay',
      phase_key: 'prep_30',
      phase_title_ar: 'المرحلة 2: اللوجستيات والشحن (30 يوماً حتى الوصول)',
      title_ar: 'حجز السكن المؤقت والترتيب لشحن الأمتعة الشخصية',
      description_ar: 'حجز إقامة أولية لمدة 2 إلى 4 أسابيع (فندق أو شقة مفروشة) والتواصل مع شركات الشحن الدولية لنقل المتعلقات الشخصية بعد توثيق بوالص الشحن.',
      category: 'housing_logistics',
      priority: 'recommended',
      days_range: 'اليوم 30- إلى 10-'
    },
    {
      id: 'step_currency_banking_prep',
      phase_key: 'prep_30',
      phase_title_ar: 'المرحلة 2: اللوجستيات والشحن (30 يوماً حتى الوصول)',
      title_ar: 'تأمين السيولة النقدية والبطاقات الائتمانية الدولية',
      description_ar: 'توفير ميزانية طوارئ ونفقات التشغيل الأولى بالدولار أو العملة المحلية وتفعيل ميزة الاستخدام الدولي للبطاقات البنكية.',
      category: 'finance_banking',
      priority: 'critical',
      days_range: 'اليوم 15- إلى 1-'
    },
    {
      id: 'step_sim_and_transport',
      phase_key: 'arrival_30',
      phase_title_ar: 'المرحلة 3: الشهر الأول بعد الوصول (اليوم 1 إلى 30)',
      title_ar: 'شراء شريحة الاتصال المحلية وتفعيل النقل والتطبيقات الحكومية',
      description_ar: 'شراء شريحة اتصال برقم وطني موثق وتنزيل التطبيقات الوطنية (توكلنا / أبشر بالسعودية، الهوية الرقمية UAE Pass، مطراش2 في قطر).',
      category: 'housing_logistics',
      priority: 'critical',
      days_range: 'اليوم 1 إلى 3'
    },
    {
      id: 'step_residency_and_medical_in_country',
      phase_key: 'arrival_30',
      phase_title_ar: 'المرحلة 3: الشهر الأول بعد الوصول (اليوم 1 إلى 30)',
      title_ar: 'الفحص الطبي المحلي، البصمات، وإصدار بطاقة الإقامة والهوية',
      description_ar: 'إتمام الكشف الطبي للإقامة، البصمات العشرية، وإصدار بطاقة الهوية الوطنية أو الإقامة الرسمية التي تعد أساس كافة المعاملات.',
      category: 'legal_visas',
      priority: 'critical',
      days_range: 'اليوم 4 إلى 18'
    },
    {
      id: 'step_bank_account_opening',
      phase_key: 'arrival_30',
      phase_title_ar: 'المرحلة 3: الشهر الأول بعد الوصول (اليوم 1 إلى 30)',
      title_ar: 'فتح الحساب البنكي وتحويل الرواتب والتأمين الطبي',
      description_ar: 'فتح حساب جاري في بنك محلي معتمد فور صدور الهوية الوطنية، وربطه بنظام حماية الأجور (WPS) واستلام بطاقة التأمين الصحي.',
      category: 'finance_banking',
      priority: 'critical',
      days_range: 'اليوم 15 إلى 25'
    },
    {
      id: 'step_permanent_lease',
      phase_key: 'settling_90',
      phase_title_ar: 'المرحلة 4: الاستقرار العائلي والمؤسسي (اليوم 31 إلى 90)',
      title_ar: 'استئجار السكن الدائم وتوثيق عقد الإيجار الرسمي',
      description_ar: 'البحث عن السكن الدائم وتوثيقه عبر المنصات العقارية الرسمية (منصة إيجار في السعودية، إيجاري في دبي، توثيق في أبوظبي) لربط الخدمات والكهرباء.',
      category: 'housing_logistics',
      priority: 'critical',
      days_range: 'اليوم 30 إلى 50'
    },
    {
      id: 'step_family_sponsorship_schools',
      phase_key: 'settling_90',
      phase_title_ar: 'المرحلة 4: الاستقرار العائلي والمؤسسي (اليوم 31 إلى 90)',
      title_ar: 'استقدام الأسرة وتسجيل الأبناء في المدارس ورخصة القيادة',
      description_ar: 'التقديم على تأشيرات استقدام الزوجة والأبناء، تسجيلهم في المدارس المعتمدة، واستبدال أو استخراج رخصة القيادة المحلية.',
      category: 'family_healthcare',
      priority: 'recommended',
      days_range: 'اليوم 40 إلى 75'
    }
  ];

  // Endpoint 11: Trade Agreements & GAFTA
  app.get('/api/countries/trade/agreements', (req: Request, res: Response) => {
    try {
      const countryCode = req.query.country as string | undefined;
      let data = PAN_ARAB_TRADE_AGREEMENTS;
      if (countryCode) {
        const code = countryCode.toUpperCase();
        data = data.filter((a) => a.member_countries.includes(code));
      }
      res.json({
        ok: true,
        success: true,
        total_count: data.length,
        data
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch trade agreements' });
    }
  });

  // Endpoint 12: Pan-Arab Transit Corridors & Cross-Border Ports
  app.get('/api/countries/trade/transit-corridors', (req: Request, res: Response) => {
    try {
      const country = req.query.country as string | undefined;
      let data = PAN_ARAB_TRANSIT_CORRIDORS;
      if (country) {
        const c = country.toUpperCase();
        data = data.filter((corridor) => corridor.country_a === c || corridor.country_b === c);
      }
      res.json({
        ok: true,
        success: true,
        total_count: data.length,
        data
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch transit corridors' });
    }
  });

  // Endpoint 13: Bilateral Trade & Supply Chain Evaluator
  app.get('/api/countries/trade/bilateral-eval', (req: Request, res: Response) => {
    try {
      const countryA = (req.query.countryA as string || 'SA').toUpperCase();
      const countryB = (req.query.countryB as string || 'EG').toUpperCase();

      const profileA = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[countryA];
      const profileB = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[countryB];

      if (!profileA || !profileB) {
        return res.status(404).json({ ok: false, error: 'One or both countries not found' });
      }

      // Mutual trade agreements
      const mutualAgreements = PAN_ARAB_TRADE_AGREEMENTS.filter(
        (a) => a.member_countries.includes(countryA) && a.member_countries.includes(countryB)
      );

      // Connecting corridors
      const connectingCorridors = PAN_ARAB_TRANSIT_CORRIDORS.filter(
        (c) => (c.country_a === countryA && c.country_b === countryB) ||
               (c.country_a === countryB && c.country_b === countryA)
      );

      // Customs status
      const isGCC = ['SA', 'AE', 'QA', 'KW', 'BH', 'OM'].includes(countryA) && ['SA', 'AE', 'QA', 'KW', 'BH', 'OM'].includes(countryB);
      const isGAFTA = mutualAgreements.some((a) => a.id === 'gafta');

      const tariffSummary = isGCC
        ? 'معفاة تماماً بنسبة 0% بموجب الاتحاد الجمركي الخليجي مع نقطة دخول موحدة.'
        : isGAFTA
        ? 'معفاة جمركياً بنسبة 100% للسلع ذات المنشأ الوطني المحقق لمعيار قيمة مضافة 40%+ بموجب GAFTA.'
        : 'تخضع للتعرفات التفضيلية المتبادلة أو تعرفة الدولة الأولى بالرعاية (MFN).';

      const aiPrompt = `قدم لي دراسة جدوى موجزة حول تصدير واستيراد البضائع وسلاسل الإمداد بين ${profileA.name_ar} و${profileB.name_ar} مع التركيز على الاتفاقيات التجارية المعتمدة، الإعفاءات الجمركية، والمسارات اللوجستية الأسرع.`;

      res.json({
        ok: true,
        success: true,
        data: {
          country_a: { code: profileA.country_code, name_ar: profileA.name_ar, flag: profileA.flag },
          country_b: { code: profileB.country_code, name_ar: profileB.name_ar, flag: profileB.flag },
          mutual_agreements: mutualAgreements,
          connecting_corridors: connectingCorridors,
          tariff_summary: tariffSummary,
          rules_of_origin: '40% كحد أدنى للقيمة المضافة المحلية للمنتج لكي يعتبر ذو منشأ وطني عربي مؤهل للإعفاء.',
          ai_trade_prompt: aiPrompt
        }
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to evaluate bilateral trade' });
    }
  });

  // Endpoint 14: In-Demand Labor Sectors & Skills Observatory
  app.get('/api/countries/labor/sectors-demand', (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const country = req.query.country as string | undefined;

      let data = PAN_ARAB_LABOR_SECTOR_DEMANDS;
      if (category && category !== 'all') {
        data = data.filter((d) => d.category === category);
      }
      if (country) {
        const c = country.toUpperCase();
        data = data.filter((d) => d.top_hiring_countries.includes(c));
      }

      res.json({
        ok: true,
        success: true,
        total_count: data.length,
        data
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch labor sectors demand' });
    }
  });

  // Endpoint 15: Cross-Country Salary Benchmarking
  app.get('/api/countries/labor/salary-benchmarks', (req: Request, res: Response) => {
    try {
      res.json({
        ok: true,
        success: true,
        total_count: PAN_ARAB_SALARY_BENCHMARKS.length,
        data: PAN_ARAB_SALARY_BENCHMARKS
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch salary benchmarks' });
    }
  });

  // Endpoint 16: Degree Attestation & Licensing Guide
  app.get('/api/countries/labor/attestation-guide/:code', (req: Request, res: Response) => {
    try {
      const code = req.params.code.toUpperCase();
      const guide = PAN_ARAB_ATTESTATION_GUIDES[code];
      const country = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[code];

      if (!guide) {
        // Return a generic template for countries without specific custom guides
        const genericGuide: PanArabAttestationGuide = {
          country_code: code,
          country_name_ar: country ? country.name_ar : code,
          flag: country ? country.flag : '🌐',
          responsible_authority_ar: 'وزارة التعليم العالي ووزارة الخارجية وسفارة الدولة المعنية',
          portal_url: 'البوابة الدبلوماسية والقنصلية الرسمية',
          stages: [
            { step_num: 1, title_ar: 'تصديق وزارة التعليم العالي بالدولة المانحة', description_ar: 'اعتماد صحة المؤهل الدراسي من التعليم العالي والجامعة الأصلية.', estimated_days: '3-7 أيام', approx_fee_usd: '$30' },
            { step_num: 2, title_ar: 'تصديق وزارة الخارجية بالدولة المانحة', description_ar: 'إثبات توقيعات وزارة التعليم عبر الخارجية المركزية.', estimated_days: '1-3 أيام', approx_fee_usd: '$20' },
            { step_num: 3, title_ar: 'تصديق سفارة أو قنصلية الدولة المستهدفة', description_ar: 'اعتماد الأوراق في الملحقية الثقافية والقنصلية لدولة العمل.', estimated_days: '5-10 أيام', approx_fee_usd: '$50' },
            { step_num: 4, title_ar: 'التصديق النهائي في دولة المقصد والمعادلة', description_ar: 'توثيق الخارجية في دولة المقصد واستكمال إجراءات المعادلة أو التسجيل بالنقابة.', estimated_days: '7-14 يوماً', approx_fee_usd: '$40' }
          ]
        };
        return res.json({ ok: true, success: true, data: genericGuide });
      }

      res.json({
        ok: true,
        success: true,
        data: guide
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch attestation guide' });
    }
  });

  // Endpoint 17: Strategic Relocation & Setup Comparison Planner
  app.get('/api/countries/relocation/compare', (req: Request, res: Response) => {
    try {
      const rawCodes = req.query.codes as string || 'SA,AE,QA';
      const codes = rawCodes.split(',').map((c) => c.trim().toUpperCase()).filter((c) => COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[c]).slice(0, 3);

      if (codes.length === 0) {
        return res.status(400).json({ ok: false, error: 'Please provide at least one valid country code' });
      }

      const candidateCountries = codes.map((code) => {
        const country = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[code];
        const freeZones = PAN_ARAB_FREE_ZONES_DATA.filter((fz) => fz.country_code === code);
        const hasGoldenVisa = !!PAN_ARAB_RESIDENCY_PATHWAYS[code];

        // Cost estimation baseline
        let monthlyBudgetFamily = 2500;
        let avgSalaryMid = 3000;
        let easeOfBusiness = 75;
        let healthcareReadiness = 'متقدمة وشاملة';

        if (code === 'AE') {
          monthlyBudgetFamily = 3800;
          avgSalaryMid = 5200;
          easeOfBusiness = 92;
        } else if (code === 'SA') {
          monthlyBudgetFamily = 3100;
          avgSalaryMid = 4600;
          easeOfBusiness = 86;
        } else if (code === 'QA') {
          monthlyBudgetFamily = 3600;
          avgSalaryMid = 5000;
          easeOfBusiness = 84;
        } else if (code === 'KW') {
          monthlyBudgetFamily = 2900;
          avgSalaryMid = 4200;
          easeOfBusiness = 78;
        } else if (code === 'OM') {
          monthlyBudgetFamily = 2200;
          avgSalaryMid = 3400;
          easeOfBusiness = 80;
        } else if (code === 'EG') {
          monthlyBudgetFamily = 1100;
          avgSalaryMid = 1200;
          easeOfBusiness = 68;
        } else if (code === 'MA') {
          monthlyBudgetFamily = 1400;
          avgSalaryMid = 1500;
          easeOfBusiness = 76;
        } else if (code === 'JO') {
          monthlyBudgetFamily = 1600;
          avgSalaryMid = 1700;
          easeOfBusiness = 72;
        }

        const viabilityRatio = Math.round((avgSalaryMid / monthlyBudgetFamily) * 100) / 100;

        return {
          code: country.country_code,
          name_ar: country.name_ar,
          flag: country.flag,
          capital: country.capital,
          currency: country.currency,
          currency_symbol: country.currency_symbol,
          monthly_budget_family_usd: monthlyBudgetFamily,
          avg_salary_mid_usd: avgSalaryMid,
          viability_ratio: viabilityRatio,
          ease_of_business_index: easeOfBusiness,
          free_zones_count: freeZones.length,
          healthcare_readiness: healthcareReadiness,
          golden_visa_available: hasGoldenVisa
        };
      });

      const names = candidateCountries.map((c) => c.name_ar).join(' و ');
      const aiPrompt = `أنا بصدد التخطيط للانتقال والاستقرار وتأسيس عملي بين ${names}. قدم لي مقارنة استشارية محايدة وشاملة تشمل: أفضل دولة من حيث نسبة الدخل للمعيشة، سهولة تأسيس الشركات ونقل الملكية، المدارس واستقرار العائلة، وتوصية استراتيجية واضحة بناءً على نمط الأعمال المعاصر.`;

      const result: PanArabRelocationComparisonResult = {
        candidate_countries: candidateCountries,
        common_steps: PAN_ARAB_RELOCATION_STEPS,
        ai_recommendation_prompt: aiPrompt
      };

      res.json({
        ok: true,
        success: true,
        data: result
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to compare relocation candidates' });
    }
  });

  // ==========================================================================
  // PHASE 6: SOVEREIGN WEALTH, MEGA-PROJECTS, CLIMATE/ENERGY & DECISION SIMULATOR
  // ==========================================================================

  const PAN_ARAB_SOVEREIGN_FUNDS: PanArabSovereignFund[] = [
    {
      id: 'pif_sa',
      name_ar: 'صندوق الاستثمارات العامة (PIF)',
      name_en: 'Public Investment Fund',
      country_code: 'SA',
      country_name_ar: 'المملكة العربية السعودية',
      flag: '🇸🇦',
      aum_billion_usd: 925,
      established_year: 1971,
      mandate_ar: 'المحرك الأساسي للتحول الاقتصادي وتنويع مصادر الدخل الوطني وتمويل المشاريع الكبرى وفق رؤية 2030.',
      key_focus_areas: ['المشاريع الكبرى (Giga-projects)', 'الذكاء الاصطناعي وأشباه الموصلات (ALAT)', 'الطاقة المتجددة والهيدروجين', 'الصناعات التحويلية والترفيه والسياحة العالمية'],
      notable_investments: ['شركة نيوم NEOM', 'لوسيد موتورز Lucid Motors', 'شركة آلات ALAT', 'البحر الأحمر الدولية', 'شركة سكاكا للطاقة'],
      website: 'https://www.pif.gov.sa'
    },
    {
      id: 'adia_ae',
      name_ar: 'جهاز أبوظبي للاستثمار (ADIA)',
      name_en: 'Abu Dhabi Investment Authority',
      country_code: 'AE',
      country_name_ar: 'دولة الإمارات العربية المتحدة',
      flag: '🇦🇪',
      aum_billion_usd: 980,
      established_year: 1976,
      mandate_ar: 'إدارة وتنمية الأصول المالية السيادية للأجيال القادمة من خلال محفظة عالمية عالية التنوع عبر مختلف الأسواق وفئات الأصول.',
      key_focus_areas: ['الأسهم العالمية والخاصة', 'البنية التحتية والموانئ العالمية', 'العقارات التجارية المرموقة', 'الصناديق الاستثمارية المتقدمة'],
      notable_investments: ['أصول بنية تحتية ومطارات كبرى في أوروبا وآسيا', 'موانئ عالمية', 'أسهم تقنية رائدة'],
      website: 'https://www.adia.ae'
    },
    {
      id: 'kia_kw',
      name_ar: 'الهيئة العامة للاستثمار (KIA)',
      name_en: 'Kuwait Investment Authority',
      country_code: 'KW',
      country_name_ar: 'دولة الكويت',
      flag: '🇰🇼',
      aum_billion_usd: 980,
      established_year: 1953,
      mandate_ar: 'أقدم صندوق ثروة سيادي في العالم؛ يدير صندوق احتياطي الأجيال القادمة وصندوق الاحتياطي العام للدولة.',
      key_focus_areas: ['الاستثمارات طويلة الأجل في السندات والأسهم', 'البنوك والمؤسسات المالية الدولية', 'العقارات الإدارية في لندن ونيويورك'],
      notable_investments: ['محافظ عقارية مرموقة في حي السيتي بلندن', 'حصص في كبرى المجموعات الصناعية الأوروبية'],
      website: 'https://www.kia.gov.kw'
    },
    {
      id: 'qia_qa',
      name_ar: 'جهاز قطر للاستثمار (QIA)',
      name_en: 'Qatar Investment Authority',
      country_code: 'QA',
      country_name_ar: 'دولة قطر',
      flag: '🇶🇦',
      aum_billion_usd: 510,
      established_year: 2005,
      mandate_ar: 'تنويع وتنمية الاقتصاد الوطني من خلال بناء محفظة عالمية كبرى في التقنية والبنية التحتية والضيافة الفاخرة.',
      key_focus_areas: ['الشركات التقنية والذكاء الاصطناعي', 'سلاسل الفنادق والضيافة العالمية الفاخرة', 'الخدمات المالية والبنية التحتية الأوروبية والأمريكية'],
      notable_investments: ['مطار هيثرو بلندن', 'برج ذا شارد The Shard', 'مجموعة فولكس فاجن', 'بنك باركليز'],
      website: 'https://www.qia.qa'
    },
    {
      id: 'mubadala_ae',
      name_ar: 'شركة مبادلة للاستثمار (Mubadala)',
      name_en: 'Mubadala Investment Company',
      country_code: 'AE',
      country_name_ar: 'دولة الإمارات العربية المتحدة',
      flag: '🇦🇪',
      aum_billion_usd: 300,
      established_year: 2002,
      mandate_ar: 'شركة استثمار سيادي عالمية تهدف لبناء اقتصاد معرفي مستدام قائم على التكنولوجيا المتقدمة والطاقة النظيفة.',
      key_focus_areas: ['الذكاء الاصطناعي وأشباه الموصلات (GlobalFoundries)', 'الرعاية الصحية الحيوية', 'الطاقة النظيفة (مصدر)', 'الفضاء والصناعات الدفاعية'],
      notable_investments: ['جلوبل فاوندريز GlobalFoundries', 'شركة أبوظبي لطاقة المستقبل (مصدر)', 'مجموعة إم 42 الصحية'],
      website: 'https://www.mubadala.com'
    },
    {
      id: 'oia_om',
      name_ar: 'جهاز الاستثمار العُماني (OIA)',
      name_en: 'Oman Investment Authority',
      country_code: 'OM',
      country_name_ar: 'سلطنة عُمان',
      flag: '🇴🇲',
      aum_billion_usd: 50,
      established_year: 2020,
      mandate_ar: 'دمج وإدارة كافة الأصول والصناديق السيادية العمانية لتحقيق أهداف رؤية عُمان 2040 ودعم الاستدامة المالية.',
      key_focus_areas: ['تطوير الموانئ واللوجستيات (مجموعة أسياد)', 'الطاقة الخضراء والتعدين (تنمية طاقة عُمان)', 'السياحة والاستثمار السمكي'],
      notable_investments: ['مجموعة أسياد اللوجستية', 'مجموعة أوكيو OQ', 'شركة عمران للتطوير السياحي'],
      website: 'https://www.oia.gov.om'
    },
    {
      id: 'cdg_ma',
      name_ar: 'صندوق الإيداع والتدبير (CDG)',
      name_en: 'Caisse de Dépôt et de Gestion',
      country_code: 'MA',
      country_name_ar: 'المملكة المغربية',
      flag: '🇲🇦',
      aum_billion_usd: 35,
      established_year: 1959,
      mandate_ar: 'المستثمر المؤسساتي الرائد في المملكة المغربية لتمويل المشاريع الاستراتيجية والتنمية الإقليمية والمدن الصناعية.',
      key_focus_areas: ['مناطق ترحيل الخدمات والمناطق الصناعية الحرة', 'البنية التحتية والقطارات فائقة السرعة', 'التنمية السياحية والعقارية المستدامة'],
      notable_investments: ['ميدز MedZ لتطوير المناطق الصناعية', 'المركب المينائي والصناعي طنجة المتوسط', 'المشاريع السياحية الكبرى بالمملكة'],
      website: 'https://www.cdg.ma'
    },
    {
      id: 'tsfe_eg',
      name_ar: 'صندوق مصر السيادي (TSFE)',
      name_en: 'The Sovereign Fund of Egypt',
      country_code: 'EG',
      country_name_ar: 'جمهورية مصر العربية',
      flag: '🇪🇬',
      aum_billion_usd: 12,
      established_year: 2018,
      mandate_ar: 'جذب الاستثمارات الخاصة المحلية والأجنبية لإعادة استغلال الأصول غير المستغلة والشراكة في مشاريع الطاقة النظيفة والتحول الرقمي.',
      key_focus_areas: ['مشاريع الهيدروجين الأخضر وتحلية المياه', 'الخدمات المالية والتكنولوجيا المالية', 'إعادة تأهيل الأصول التاريخية وتطوير التعليم والرعاية الصحية'],
      notable_investments: ['مشروع إنتاج الهيدروجين الأخضر بالمنطقة الاقتصادية لقناة السويس', 'إعادة تطوير مجمع التحرير ومقر وزارة الداخلية القديم'],
      website: 'https://www.tsfe.com'
    },
    {
      id: 'mumtalakat_bh',
      name_ar: 'شركة ممتلكات البحرين القابضة (Mumtalakat)',
      name_en: 'Bahrain Real Estate Investment Company',
      country_code: 'BH',
      country_name_ar: 'مملكة البحرين',
      flag: '🇧🇭',
      aum_billion_usd: 18,
      established_year: 2006,
      mandate_ar: 'صندوق الثروة السيادي لمملكة البحرين لتنمية الأصول غير النفطية والاستثمار الاستراتيجي ذي الأثر المستدام.',
      key_focus_areas: ['الألمنيوم والصناعات الثقيلة (ألبا)', 'الطيران والضيافة (طيران الخليج)', 'الاتصالات والرعاية الصحية'],
      notable_investments: ['شركة ألمنيوم البحرين (ألبا Alba)', 'طيران الخليج', 'مجموعة ماكلارين McLaren Group'],
      website: 'https://www.bmhc.bh'
    }
  ];

  const PAN_ARAB_MEGA_PROJECTS: PanArabMegaProject[] = [
    {
      id: 'neom_sa',
      name_ar: 'مشروع نيوم (NEOM)',
      name_en: 'NEOM Megacity',
      country_code: 'SA',
      country_name_ar: 'المملكة العربية السعودية',
      flag: '🇸🇦',
      sector: 'smart_cities',
      estimated_cost_billion_usd: 500,
      target_completion_year: 2030,
      current_phase_ar: 'أعمال الإنشاءات الكبرى والتشغيل الأولي للمناطق الساحلية والميناء',
      description_ar: 'مدينة المستقبل الذكية المستدامة المعتمدة بنسبة 100% على الطاقة المتجددة، وتضم مدينة ذا لاين (THE LINE)، أوكساجون للصناعات المتقدمة، وتروجينا للسياحة الجبلية، وجزيرة سندالة.',
      key_milestones: ['افتتاح جزيرة سندالة الفاخرة', 'بدء تشغيل مصنع الهيدروجين الأخضر الأكبر عالمياً', 'أعمال الحفر والأساسات لمدينة ذا لاين بطول 170 كم'],
      jobs_target: 380000
    },
    {
      id: 'red_sea_sa',
      name_ar: 'مشروع البحر الأحمر الدولي (The Red Sea)',
      name_en: 'The Red Sea Global Project',
      country_code: 'SA',
      country_name_ar: 'المملكة العربية السعودية',
      flag: '🇸🇦',
      sector: 'tourism_entertainment',
      estimated_cost_billion_usd: 30,
      target_completion_year: 2030,
      current_phase_ar: 'تشغيل المرحلة الأولى وافتتاح المطار والمنتجعات الفاخرة',
      description_ar: 'وجهة سياحية رائدة فائقة الفخامة تعتمد على السياحة المتجددة لحماية الأرخبيل المرجاني وأشجار المانغروف بنسبة 100% طاقة نظيفة.',
      key_milestones: ['تشغيل مطار البحر الأحمر الدولي (RSI)', 'افتتاح منتجعات جزيرة أمهات ومحمية الشورى', 'اكتمال أكبر محطة للطاقة الشمسية المستقلة عن الشبكة'],
      jobs_target: 70000
    },
    {
      id: 'nac_eg',
      name_ar: 'العاصمة الإدارية الجديدة (New Administrative Capital)',
      name_en: 'New Administrative Capital',
      country_code: 'EG',
      country_name_ar: 'جمهورية مصر العربية',
      flag: '🇪🇬',
      sector: 'smart_cities',
      estimated_cost_billion_usd: 58,
      target_completion_year: 2026,
      current_phase_ar: 'انتقال كامل الوزارات والهيئات الحكومية وبدء التشغيل التجاري لمنطقة الأعمال',
      description_ar: 'مدينة ذكية من الجيل الرابع تقع شرق القاهرة لتخفيف التكدس وإدارة الدولة بأنظمة رقمية مؤتمتة، وتضم البرج الأيقوني الأطول في إفريقيا والقطار الكهربائي الخفيف (LRT) والمونوريل.',
      key_milestones: ['اكتمال البرج الأيقوني (385 متراً)', 'انتقال مجلس الوزراء والبرلمان والوزارات', 'تشغيل النهر الأخضر ومراكز البيانات الحكومية المؤمنة'],
      jobs_target: 1500000
    },
    {
      id: 'masdar_city_ae',
      name_ar: 'مدينة مصدر (Masdar City)',
      name_en: 'Masdar City Clean-Tech Cluster',
      country_code: 'AE',
      country_name_ar: 'دولة الإمارات العربية المتحدة',
      flag: '🇦🇪',
      sector: 'clean_energy',
      estimated_cost_billion_usd: 22,
      target_completion_year: 2030,
      current_phase_ar: 'توسع مجمعات البحث والتطوير ومقرات شركات التقنية والذكاء الاصطناعي',
      description_ar: 'أحد أكثر المجمعات الحضرية استدامة في العالم، ومقر الوكالة الدولية للطاقة المتجددة (IRENA) وجامعة محمد بن زايد للذكاء الاصطناعي (MBZUAI).',
      key_milestones: ['مقر الوكالة الدولية للطاقة المتجددة IRENA', 'مباني خالية من الانبعاثات الكربونية بنسبة 100%', 'حاضنة لمئات الشركات الناشئة في التكنولوجيا الخضراء'],
      jobs_target: 50000
    },
    {
      id: 'duqm_om',
      name_ar: 'المنطقة الاقتصادية الخاصة بالدقم (SEZAD)',
      name_en: 'Special Economic Zone at Duqm',
      country_code: 'OM',
      country_name_ar: 'سلطنة عُمان',
      flag: '🇴🇲',
      sector: 'infrastructure_logistics',
      estimated_cost_billion_usd: 25,
      target_completion_year: 2028,
      current_phase_ar: 'تشغيل مصفاة الدقم وتدشين مشاريع الهيدروجين الأخضر والموانئ',
      description_ar: 'أكبر منطقة اقتصادية وتنموية في الشرق الأوسط بمساحة 2000 كم² على بحر العرب خارج مضيق هرمز، وتضم ميناء عالمياً ومصفاة ومحطات لتصدير الهيدروجين النظيف.',
      key_milestones: ['تدشين مصفاة الدقم المشتركة مع الكويت', 'تخصيص مساحات لإنتاج الهيدروجين الأخضر بقيمة 30 مليار دولار', 'محطة الحوض الجاف لإصلاح السفن'],
      jobs_target: 65000
    },
    {
      id: 'ras_el_hekma_eg',
      name_ar: 'مشروع رأس الحكمة العالمي (Ras El Hekma)',
      name_en: 'Ras El Hekma Waterfront City',
      country_code: 'EG',
      country_name_ar: 'جمهورية مصر العربية',
      flag: '🇪🇬',
      sector: 'smart_cities',
      estimated_cost_billion_usd: 35,
      target_completion_year: 2030,
      current_phase_ar: 'المخطط العام والتهيئة الميدانية وتأسيس البنية التحتية والمطار الدولي',
      description_ar: 'أضخم صفقة استثمار أجنبي مباشر في تاريخ مصر بشراكة استراتيجية مع مجموعة ADQ الإماراتية لتطوير مدينة عالمية مستدامة على الساحل الشمالي الغربي بمساحة 170 مليون م².',
      key_milestones: ['تحويل الدفعة الاستثمارية الأولى بقيمة 35 مليار دولار', 'بدء تجهيز منطقة الميناء والمطار السياحي الدولي', 'تصميم المنطقة الحرة والحي المالي والتكنولوجي'],
      jobs_target: 750000
    },
    {
      id: 'king_salman_park_sa',
      name_ar: 'حديقة الملك سلمان (King Salman Park)',
      name_en: 'King Salman Park',
      country_code: 'SA',
      country_name_ar: 'المملكة العربية السعودية',
      flag: '🇸🇦',
      sector: 'tourism_entertainment',
      estimated_cost_billion_usd: 12,
      target_completion_year: 2027,
      current_phase_ar: 'أعمال الإنشاءات للمجمع الملكي للفنون والمناطق البيئية والمائية',
      description_ar: 'أكبر حديقة مدن في العالم بمساحة تزيد عن 16 كم² في قلب مدينة الرياض، وتضم مساحات خضراء شاسعة ومسارح ومراكز ثقافية وملاعب رياضية متطورة.',
      key_milestones: ['اكتمال تشييد المجمع الملكي للفنون', 'زراعة أكثر من مليون شجرة محلية', 'ربط الحديقة بشبكة قطار الرياض المباشرة'],
      jobs_target: 55000
    },
    {
      id: 'tangier_tech_ma',
      name_ar: 'مدينة محمد السادس طنجة-تك (Tangier Tech City)',
      name_en: 'Mohammed VI Tangier Tech City',
      country_code: 'MA',
      country_name_ar: 'المملكة المغربية',
      flag: '🇲🇦',
      sector: 'industrial_defense',
      estimated_cost_billion_usd: 10,
      target_completion_year: 2028,
      current_phase_ar: 'استقطاب كبرى شركات بطاريات السيارات الكهربائية والمكونات الصناعية',
      description_ar: 'مدينة صناعية وتكنولوجية ذكية بجوار ميناء طنجة المتوسط، مصممة لاستيعاب مئات المصانع العالمية في صناعة بطاريات السيارات الكهربائية (Giga-factories) والإلكترونيات.',
      key_milestones: ['توقيع اتفاقيات مصانع بطاريات السيارات الكهربائية لشركات صينية ودولية', 'تجهيز المرحلة الصناعية الأولى على مساحة 400 هكتار', 'ربط شبكي مباشر مع ميناء طنجة المتوسط'],
      jobs_target: 100000
    }
  ];

  const PAN_ARAB_CLIMATE_ENERGY_PROFILES: Record<string, PanArabClimateEnergyProfile> = {
    SA: {
      country_code: 'SA',
      country_name_ar: 'المملكة العربية السعودية',
      flag: '🇸🇦',
      net_zero_target_year: 2060,
      solar_capacity_mw: 4200,
      wind_capacity_mw: 1400,
      green_hydrogen_projects_count: 5,
      desalination_capacity_m3_day: '11.5 مليون م³/يوم',
      water_stress_level_ar: 'حرج جداً (الاعتماد الأساسي على تحلية مياه البحر وسدود الحصاد)',
      food_security_index: 78,
      flagship_projects: ['محطة سكاكا ومحطة الشقيق للطاقة الشمسية', 'مزرعة رياح دومة الجندل (400 ميجاواط)', 'مجمع نيوم للهيدروجين الأخضر (4 جيجاواط طاقة متجددة)']
    },
    AE: {
      country_code: 'AE',
      country_name_ar: 'دولة الإمارات العربية المتحدة',
      flag: '🇦🇪',
      net_zero_target_year: 2050,
      solar_capacity_mw: 4800,
      wind_capacity_mw: 300,
      green_hydrogen_projects_count: 4,
      desalination_capacity_m3_day: '8.4 مليون م³/يوم',
      water_stress_level_ar: 'مرتفع جداً (توسع سريع في محطات التناضح العكسي منخفضة الكربون)',
      food_security_index: 82,
      flagship_projects: ['مجمع محمد بن راشد آل مكتوم للطاقة الشمسية في دبي (5000 ميجاواط بحلول 2030)', 'محطة الظفرة للطاقة الشمسية (2 جيجاواط)', 'محطات براكة للطاقة النووية السلمية (5.6 جيجاواط)']
    },
    EG: {
      country_code: 'EG',
      country_name_ar: 'جمهورية مصر العربية',
      flag: '🇪🇬',
      net_zero_target_year: 2050,
      solar_capacity_mw: 2400,
      wind_capacity_mw: 2100,
      green_hydrogen_projects_count: 14,
      desalination_capacity_m3_day: '1.9 مليون م³/يوم',
      water_stress_level_ar: 'متوسط إلى مرتفع (الاعتماد على نهر النيل، وإعادة تدوير مياه الصرف الزراعي عبر محطات بحر البقر والدلتا الجديدة)',
      food_security_index: 64,
      flagship_projects: ['مجمع بنبان للطاقة الشمسية بأسوان (1465 ميجاواط)', 'مزارع رياح جبل الزيت ورأس غارب بخليج السويس', 'المركز الإقليمي لإنتاج وتصدير الهيدروجين الأخضر بالمنطقة الاقتصادية لقناة السويس']
    },
    MA: {
      country_code: 'MA',
      country_name_ar: 'المملكة المغربية',
      flag: '🇲🇦',
      net_zero_target_year: 2050,
      solar_capacity_mw: 2200,
      wind_capacity_mw: 2300,
      green_hydrogen_projects_count: 6,
      desalination_capacity_m3_day: '1.4 مليون م³/يوم',
      water_stress_level_ar: 'مرتفع (خطة وطنية لتشييد محطات تحلية كبرى في الدار البيضاء والناظور والداخلة)',
      food_security_index: 70,
      flagship_projects: ['مركب نور ورزازات للطاقة الشمسية المركزة (580 ميجاواط)', 'مزارع رياح طرفاية وتازة وطنجة', 'مشروع عرض المغرب للهيدروجين الأخضر والميثانول لمجموعة OCP']
    },
    QA: {
      country_code: 'QA',
      country_name_ar: 'دولة قطر',
      flag: '🇶🇦',
      net_zero_target_year: 2050,
      solar_capacity_mw: 1600,
      wind_capacity_mw: 50,
      green_hydrogen_projects_count: 2,
      desalination_capacity_m3_day: '3.1 مليون م³/يوم',
      water_stress_level_ar: 'مرتفع جداً (اعتماد كامل على تحلية المياه والتقنيات الحرارية والتناضح العكسي)',
      food_security_index: 80,
      flagship_projects: ['محطة الخرسعة للطاقة الشمسية (800 ميجاواط)', 'محطات راس لفان ومسيعيد للطاقة الشمسية', 'مشروع الأمونيا الزرقاء 1 بمدينة مسيعيد الصناعية']
    },
    OM: {
      country_code: 'OM',
      country_name_ar: 'سلطنة عُمان',
      flag: '🇴🇲',
      net_zero_target_year: 2050,
      solar_capacity_mw: 1500,
      wind_capacity_mw: 450,
      green_hydrogen_projects_count: 8,
      desalination_capacity_m3_day: '1.8 مليون م³/يوم',
      water_stress_level_ar: 'مرتفع (تحلية مياه البحر وشبكات الأفلاج التراثية)',
      food_security_index: 74,
      flagship_projects: ['محطة عبري للطاقة الشمسية (500 ميجاواط)', 'مزرعة رياح هرويل بظفار', 'مشاريع هيدروجين عُمان (هايدروم Hydrom) بالدقم وظفار']
    }
  };

  const PAN_ARAB_DIGITAL_READINESS_DATA: Record<string, PanArabDigitalReadiness> = {
    SA: {
      country_code: 'SA',
      country_name_ar: 'المملكة العربية السعودية',
      flag: '🇸🇦',
      ai_readiness_index: 86,
      digital_gov_rank_arab: 1,
      submarine_cables_count: 18,
      sovereign_cloud_ai_initiatives: ['الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA)', 'شركة آلات (ALAT) للحوسبة وأشباه الموصلات', 'مراكز الحوسبة الفائقة السحابية الوطنية', 'نموذج علّام اللغوي العربي (Allam LLM)'],
      five_g_coverage_pct: 94
    },
    AE: {
      country_code: 'AE',
      country_name_ar: 'دولة الإمارات العربية المتحدة',
      flag: '🇦🇪',
      ai_readiness_index: 89,
      digital_gov_rank_arab: 2,
      submarine_cables_count: 16,
      sovereign_cloud_ai_initiatives: ['مجلس أبحاث التكنولوجيا المتطورة (ATRC) ونماذج فالكون (Falcon)', 'مجموعة G42 المتخصصة في الذكاء الاصطناعي السيادي', 'جامعة محمد بن زايد للذكاء الاصطناعي', 'شبكات مراكز البيانات السحابية العملاقة'],
      five_g_coverage_pct: 98
    },
    QA: {
      country_code: 'QA',
      country_name_ar: 'دولة قطر',
      flag: '🇶🇦',
      ai_readiness_index: 78,
      digital_gov_rank_arab: 3,
      submarine_cables_count: 9,
      sovereign_cloud_ai_initiatives: ['استراتيجية قطر الوطنية للذكاء الاصطناعي', 'معهد قطر لبحوث الحوسبة (QCRI)', 'منطقة مايكروسوفت وجوجل السحابية السيادية بالدوحة'],
      five_g_coverage_pct: 96
    },
    OM: {
      country_code: 'OM',
      country_name_ar: 'سلطنة عُمان',
      flag: '🇴🇲',
      ai_readiness_index: 70,
      digital_gov_rank_arab: 5,
      submarine_cables_count: 15,
      sovereign_cloud_ai_initiatives: ['البرنامج الوطني للاقتصاد الرقمي', 'مركز البيانات الإقليمي لعمانتل ومحطات ربط الكابلات بصلالة ومسقط', 'مبادرات الذكاء الاصطناعي والأمن السيبراني'],
      five_g_coverage_pct: 85
    },
    EG: {
      country_code: 'EG',
      country_name_ar: 'جمهورية مصر العربية',
      flag: '🇪🇬',
      ai_readiness_index: 68,
      digital_gov_rank_arab: 6,
      submarine_cables_count: 19,
      sovereign_cloud_ai_initiatives: ['المجلس الوطني للذكاء الاصطناعي', 'مركز البيانات والحوسبة السحابية الحكومية (P1)', 'مدينة المعرفة بالعاصمة الإدارية الجديدة', 'نقطة الربط القارية الأكبر للكابلات الدولية بين آسيا وأوروبا'],
      five_g_coverage_pct: 70
    },
    MA: {
      country_code: 'MA',
      country_name_ar: 'المملكة المغربية',
      flag: '🇲🇦',
      ai_readiness_index: 72,
      digital_gov_rank_arab: 4,
      submarine_cables_count: 11,
      sovereign_cloud_ai_initiatives: ['استراتيجية المغرب الرقمي 2030', 'مركز الذكاء الاصطناعي بجامعة محمد السادس متعددة التخصصات التقنية (UM6P)', 'حاسوب توشكى العملاق للأبحاث الإفريقية والعربية'],
      five_g_coverage_pct: 76
    }
  };

  // Endpoint 18: Sovereign Wealth Funds Directory & Analytics
  app.get('/api/countries/analytics/sovereign-wealth', (_req: Request, res: Response) => {
    try {
      const totalAum = PAN_ARAB_SOVEREIGN_FUNDS.reduce((acc, f) => acc + f.aum_billion_usd, 0);
      res.json({
        ok: true,
        success: true,
        total_funds_count: PAN_ARAB_SOVEREIGN_FUNDS.length,
        total_aum_billion_usd: totalAum,
        data: PAN_ARAB_SOVEREIGN_FUNDS
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch sovereign funds' });
    }
  });

  // Endpoint 19: Giga & Mega-Projects Tracker
  app.get('/api/countries/analytics/mega-projects', (_req: Request, res: Response) => {
    try {
      const totalCost = PAN_ARAB_MEGA_PROJECTS.reduce((acc, p) => acc + p.estimated_cost_billion_usd, 0);
      const totalJobs = PAN_ARAB_MEGA_PROJECTS.reduce((acc, p) => acc + p.jobs_target, 0);
      res.json({
        ok: true,
        success: true,
        total_projects_count: PAN_ARAB_MEGA_PROJECTS.length,
        total_estimated_cost_billion_usd: totalCost,
        total_jobs_target: totalJobs,
        data: PAN_ARAB_MEGA_PROJECTS
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch mega-projects' });
    }
  });

  // Endpoint 20: Climate, Renewable Energy & Water Security
  app.get('/api/countries/analytics/climate-energy', (_req: Request, res: Response) => {
    try {
      const list = Object.values(PAN_ARAB_CLIMATE_ENERGY_PROFILES);
      res.json({
        ok: true,
        success: true,
        total_count: list.length,
        data: list
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch climate & energy profiles' });
    }
  });

  // Endpoint 21: Digital Readiness, Submarine Cables & Sovereign AI
  app.get('/api/countries/analytics/digital-readiness', (_req: Request, res: Response) => {
    try {
      const list = Object.values(PAN_ARAB_DIGITAL_READINESS_DATA);
      res.json({
        ok: true,
        success: true,
        total_count: list.length,
        data: list
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch digital readiness data' });
    }
  });

  // Endpoint 22: Strategic Investment Decision Simulator
  app.post('/api/countries/analytics/decision-simulator', (req: Request, res: Response) => {
    try {
      const { country_code = 'SA', sector = 'clean_energy', capital_usd = 1000000, risk_tolerance = 'balanced' } = req.body;
      const code = String(country_code).toUpperCase();
      const country = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[code] || COMPREHENSIVE_ARAB_COUNTRIES_PROFILES['SA'];
      const freeZones = PAN_ARAB_FREE_ZONES_DATA.filter((fz) => fz.country_code === code);
      const sovereignFund = PAN_ARAB_SOVEREIGN_FUNDS.find((f) => f.country_code === code);

      // Sector normalization
      let sectorAr = 'الطاقة النظيفة والتقنية الخضراء';
      let baseViability = 82;
      let projectedRoi = '14% - 19% سنوياً';
      let clarityScore = 88;
      let recommendedZone = freeZones[0]?.name_ar || 'المنطقة الاقتصادية الحرة الرئيسية';

      if (sector === 'ai_tech') {
        sectorAr = 'الذكاء الاصطناعي والحوسبة السحابية';
        baseViability = 86;
        projectedRoi = '18% - 24% سنوياً';
        clarityScore = 90;
        recommendedZone = code === 'AE' ? 'مدينة دبي للإنترنت (DIC)' : code === 'SA' ? 'منطقة الحوسبة السحابية الخاصة (SEZ)' : recommendedZone;
      } else if (sector === 'logistics_trade') {
        sectorAr = 'الخدمات اللوجستية وسلاسل الإمداد';
        baseViability = 84;
        projectedRoi = '12% - 17% سنوياً';
        clarityScore = 85;
        recommendedZone = code === 'EG' ? 'المنطقة الاقتصادية لقناة السويس (SCZone)' : code === 'MA' ? 'طنجة المتوسط اللوجستية' : recommendedZone;
      } else if (sector === 'tourism_hospitality') {
        sectorAr = 'السياحة والضيافة والترفيه';
        baseViability = 80;
        projectedRoi = '11% - 16% سنوياً';
        clarityScore = 82;
        recommendedZone = code === 'SA' ? 'وجهة البحر الأحمر والعلا' : code === 'EG' ? 'رأس الحكمة والساحل الشمالي' : recommendedZone;
      } else if (sector === 'industrial_manufacturing') {
        sectorAr = 'الصناعات التحويلية والمتقدمة';
        baseViability = 78;
        projectedRoi = '13% - 18% سنوياً';
        clarityScore = 84;
        recommendedZone = code === 'OM' ? 'المنطقة الاقتصادية الخاصة بالدقم' : recommendedZone;
      }

      // Risk tolerance adjustments
      if (risk_tolerance === 'conservative') {
        baseViability = Math.min(95, baseViability + 4);
      } else if (risk_tolerance === 'aggressive') {
        baseViability = Math.max(65, baseViability - 3);
      }

      const canCoInvest = !!sovereignFund && capital_usd >= 5000000;

      const incentives = [
        'ملكية أجنبية كاملة بنسبة 100% دون الحاجة لوكيل محلي',
        'إعفاء جمركي على استيراد الآلات والمعدات الرأسمالية ومدخلات الإنتاج',
        'تسهيل إصدار تأشيرات الكفاءات والإقامات الذهبية للمؤسسين والمدراء',
        'إمكانية تحويل الأرباح ورؤوس الأموال للخارج بحرية تامة دون قيود'
      ];

      const risks = [
        'تقلبات أسعار الطاقة العالمية وتغيرات سلاسل التوريد',
        'تفاوت نسب التوطين والكوادر الوطنية ومتطلبات الامتثال التنظيمي',
        'المنافسة الإقليمية المتسارعة لجذب استثمارات التقنية المتقدمة'
      ];

      const aiSummary = `قرار استثماري واعد في قطاع ${sectorAr} بـ ${country.name_ar} برأس مال مُقدّر بـ $${Number(capital_usd).toLocaleString()}. تتميز الدولة ببيئة حوافز قوية مع مؤشر جدوى ${baseViability}/100، وتعتبر ${recommendedZone} هي الموقع الأنسب لبدء التأسيس للاستفادة من الإعفاءات الجمركية والمزايا الضريبية.`;

      const simulationResponse: PanArabDecisionSimulationResponse = {
        country_code: country.country_code,
        country_name_ar: country.name_ar,
        flag: country.flag,
        sector_ar: sectorAr,
        viability_score: baseViability,
        projected_roi_pct: projectedRoi,
        regulatory_clarity_score: clarityScore,
        key_incentives: incentives,
        primary_risks: risks,
        sovereign_fund_co_investment_possible: canCoInvest,
        recommended_free_zone: recommendedZone,
        ai_executive_summary: aiSummary
      };

      res.json({
        ok: true,
        success: true,
        data: simulationResponse
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to simulate decision' });
    }
  });

  // ==========================================================================
  // PHASE 7: GEOPOLITICAL RISK, ROUTING CONTINGENCIES & EXECUTIVE BRIEFINGS
  // ==========================================================================

  const PAN_ARAB_GEOPOLITICAL_RISKS: PanArabGeopoliticalRisk[] = [
    {
      country_code: 'SA',
      country_name_ar: 'المملكة العربية السعودية',
      flag: '🇸🇦',
      overall_safety_index: 89,
      risk_level_ar: 'مستقر وآمن جداً',
      political_stability_score: 91,
      sanctions_exposure_level: 'معدوم',
      currency_volatility_rating: 'مستقر وثابت (ربط مباشر)',
      cybersecurity_resilience_rank: 2,
      primary_geopolitical_threats: [
        'توترات الملاحة في جنوب البحر الأحمر ومضيق باب المندب',
        'مخاطر استهداف البنى التحتية الحيوية بالطائرات المسيرة (مُحيّدة بأنظمة درع جوي متطورة)',
        'تقلبات أسواق النفط الدولية وحصص إنتاج تحالف أوبك+'
      ],
      hedging_mitigation_strategies: [
        'تفعيل خط أنابيب شرق-غرب (بترولاين) لتحويل النفط إلى ميناء ينبع على البحر الأحمر',
        'بناء مخزونات استراتيجية عملاقة للأمن الغذائي والدوائي تكفي لأكثر من 12 شهراً',
        'قيادة الهيئة الوطنية للأمن السيبراني (NCA) وتصنيف المملكة بالمرتبة الثانية عالمياً'
      ]
    },
    {
      country_code: 'AE',
      country_name_ar: 'دولة الإمارات العربية المتحدة',
      flag: '🇦🇪',
      overall_safety_index: 92,
      risk_level_ar: 'مستقر وآمن جداً',
      political_stability_score: 93,
      sanctions_exposure_level: 'معدوم',
      currency_volatility_rating: 'مستقر وثابت (ربط مباشر)',
      cybersecurity_resilience_rank: 5,
      primary_geopolitical_threats: [
        'احتمالات تصعيد التوترات البحرية في محيط مضيق هرمز',
        'تحديات الالتزام الصارم بمعايير مجموعة العمل المالي الدولية (FATF) لمكافحة غسيل الأموال',
        'حساسية سلاسل الإمداد العالمية للتجارة العابرة ومراكز إعادة التصدير'
      ],
      hedging_mitigation_strategies: [
        'تشغيل خط أنابيب حبشان-الفجيرة (ADCOP) لتصدير النفط مباشرة عبر خليج عُمان متجاوزاً مضيق هرمز',
        'استراتيجية دبلوماسية تحييد النزاعات (صفر مشاكل وتصفير الخلافات الإقليمية)',
        'تأسيس منظومة حوسبة سيادية وشبكات دفاع سيبراني متقدمة يقودها مجلس الأمن السيبراني'
      ]
    },
    {
      country_code: 'QA',
      country_name_ar: 'دولة قطر',
      flag: '🇶🇦',
      overall_safety_index: 91,
      risk_level_ar: 'مستقر وآمن جداً',
      political_stability_score: 92,
      sanctions_exposure_level: 'معدوم',
      currency_volatility_rating: 'مستقر وثابت (ربط مباشر)',
      cybersecurity_resilience_rank: 14,
      primary_geopolitical_threats: [
        'الاعتماد الحرج على حركة ناقلات الغاز الطبيعي المسال (LNG) عبر مضيق هرمز',
        'الوساطة الدبلوماسية النشطة في النزاعات المعقدة في الشرق الأوسط',
        'التهديدات السيبرانية الموجهة لقطاع الطاقة والغاز'
      ],
      hedging_mitigation_strategies: [
        'أسطول ناقلات الغاز الأضخم عالمياً مع عقود توريد طويلة الأجل (20-27 سنة) مع آسيا وأوروبا',
        'علاقات استراتيجية متينة مع القوى العالمية وشراكات دفاعية متقدمة',
        'توسيع استثمارات جهاز قطر للاستثمار (QIA) في أصول سيادية متنوعة جغرافياً'
      ]
    },
    {
      country_code: 'OM',
      country_name_ar: 'سلطنة عُمان',
      flag: '🇴🇲',
      overall_safety_index: 90,
      risk_level_ar: 'مستقر وآمن جداً',
      political_stability_score: 94,
      sanctions_exposure_level: 'معدوم',
      currency_volatility_rating: 'مستقر وثابت (ربط مباشر)',
      cybersecurity_resilience_rank: 21,
      primary_geopolitical_threats: [
        'الإشراف المباشر على الجانب العماني من مضيق هرمز ومسارات الملاحة الدولية',
        'تأثير الأعاصير المدارية المناخية على السواحل وموانئ المحيط الهندي',
        'عبء المديونية العامة التي يجري خفضها بانتظام'
      ],
      hedging_mitigation_strategies: [
        'موقع استراتيجي خارج مضيق هرمز عبر موانئ صلالة والدقم وصحار المطلة على بحر العرب',
        'سياسة الحياد الإيجابي والدبلوماسية الهادئة والموثوقة دولياً',
        'إنشاء مخزونات وقود ومناطق تخزين عملاقة خارج نقاط الاختناق البحرية'
      ]
    },
    {
      country_code: 'KW',
      country_name_ar: 'دولة الكويت',
      flag: '🇰🇼',
      overall_safety_index: 87,
      risk_level_ar: 'مستقر وآمن جداً',
      political_stability_score: 88,
      sanctions_exposure_level: 'معدوم',
      currency_volatility_rating: 'مستقر وثابت (ربط مباشر)',
      cybersecurity_resilience_rank: 28,
      primary_geopolitical_threats: [
        'الاعتماد الكلي على تصدير النفط واستيراد السلع عبر مياه الخليج العربي ومضيق هرمز',
        'القرب الجغرافي من بؤر التوتر في شمال الخليج والنزاعات البحرية الحدودية (حقل الدرة)',
        'البيروقراطية الحكومية والتجاذب بين السلطتين التشريعية والتنفيذية'
      ],
      hedging_mitigation_strategies: [
        'احتياطي الأجيال القادمة المدار بحصافة بالغة من الهيئة العامة للاستثمار (KIA) بقيمة تقارب تريليون دولار',
        'اتفاقيات أمنية ودفاعية مشتركة مع حلفاء دوليين وإقليميين',
        'خطط طوارئ لتأمين المخزون الاستراتيجي للحبوب والأدوية لعامين كاملين'
      ]
    },
    {
      country_code: 'BH',
      country_name_ar: 'مملكة البحرين',
      flag: '🇧🇭',
      overall_safety_index: 86,
      risk_level_ar: 'مستقر وآمن جداً',
      political_stability_score: 87,
      sanctions_exposure_level: 'معدوم',
      currency_volatility_rating: 'مستقر وثابت (ربط مباشر)',
      cybersecurity_resilience_rank: 32,
      primary_geopolitical_threats: [
        'مساحة جغرافية محدودة في قلب مياه الخليج العربي',
        'حساسية التوترات الإقليمية في محيطها المباشر',
        'حجم الدين العام وضغوط الميزانية التي يعالجها برنامج التوازن المالي'
      ],
      hedging_mitigation_strategies: [
        'عمق استراتيجي متكامل مع دول مجلس التعاون الخليجي وجسر الملك فهد الرابط مع السعودية',
        'برنامج التوازن المالي المدعوم خليجياً لتعزيز الاستدامة المالية',
        'مركز مالي مصرفي عريق وتشريعات رقمية مرنة لجذب شركات التكنولوجيا المالية'
      ]
    },
    {
      country_code: 'MA',
      country_name_ar: 'المملكة المغربية',
      flag: '🇲🇦',
      overall_safety_index: 85,
      risk_level_ar: 'مستقر مع مخاطر طفيفة',
      political_stability_score: 86,
      sanctions_exposure_level: 'معدوم',
      currency_volatility_rating: 'تذبذب مدار ومرن',
      cybersecurity_resilience_rank: 38,
      primary_geopolitical_threats: [
        'التنافس الإقليمي والحدود المغلقة في المغرب العربي',
        'تأثير الجفاف وتغير المناخ على القطاع الفلاحي والموارد المائية',
        'تقلبات أسعار الطاقة العالمية والمحروقات المستوردة'
      ],
      hedging_mitigation_strategies: [
        'موقع استراتيجي كبوابة مزدوجة على المحيط الأطلسي والبحر الأبيض المتوسط ومضيق جبل طارق',
        'تنويع الشراكات الاقتصادية مع الاتحاد الأوروبي، الولايات المتحدة، والصين، والعمق الإفريقي',
        'الريادة القارية في مجمعات الطاقة الشمسية والريحية وإنتاج الأسمدة الفوسفاتية عالمياً'
      ]
    },
    {
      country_code: 'EG',
      country_name_ar: 'جمهورية مصر العربية',
      flag: '🇪🇬',
      overall_safety_index: 76,
      risk_level_ar: 'معتدل المخاطر',
      political_stability_score: 78,
      sanctions_exposure_level: 'منخفض',
      currency_volatility_rating: 'تذبذب مدار ومرن',
      cybersecurity_resilience_rank: 23,
      primary_geopolitical_threats: [
        'تأثر عوائد قناة السويس باضطرابات الملاحة والتوترات في البحر الأحمر ومضيق باب المندب',
        'أزمة سد النهضة الإثيوبي وتحديات الأمن المائي التاريخي لنهر النيل',
        'ضغوط الديون الخارجية وتقلبات سعر الصرف والتضخم'
      ],
      hedging_mitigation_strategies: [
        'صفقات استثمار أجنبي مباشر تاريخية (مثل رأس الحكمة بقيمة 35 مليار دولار)',
        'تطوير شبكة لوجستية هائلة (القطار الكهربائي السريع والموانئ الجافة ومحور السويس)',
        'تضخيم الاحتياطي النقدي الأجنبي من خلال برامج الإصلاح الاقتصادي وتمويل صندوق النقد الدولي'
      ]
    },
    {
      country_code: 'JO',
      country_name_ar: 'المملكة الأردنية الهاشمية',
      flag: '🇯🇴',
      overall_safety_index: 79,
      risk_level_ar: 'مستقر مع مخاطر طفيفة',
      political_stability_score: 82,
      sanctions_exposure_level: 'منخفض',
      currency_volatility_rating: 'مستقر وثابت (ربط مباشر)',
      cybersecurity_resilience_rank: 45,
      primary_geopolitical_threats: [
        'الوجود في قلب إقليم ملتهب والحدود المباشرة مع فلسطين وسوريا والعراق',
        'شح الموارد المائية وعبء استضافة ملايين اللاجئين',
        'الاعتماد على واردات الطاقة وتأثر السياحة الإقليمية بالأحداث'
      ],
      hedging_mitigation_strategies: [
        'استقرار أمني ودبلوماسي راسخ بقيادة حكيمة وعلاقات دولية وثيقة',
        'ربط الدينار الأردني بالدولار الأمريكي مع احتياطيات قياسية تاريخية للبنك المركزي',
        'مشروع الناقل الوطني لتحلية مياه البحر الأحمر من العقبة إلى العاصمة عمان'
      ]
    }
  ];

  const PAN_ARAB_ROUTE_CONTINGENCIES: PanArabRouteContingency[] = [
    {
      id: 'contingency_bab_el_mandeb',
      primary_chokepoint_or_corridor: 'مضيق باب المندب وجنوب البحر الأحمر',
      risk_scenario: 'اضطرابات أمنية واستهداف السفن التجارية وعزوف شركات التأمين البحري عن المرور',
      alternative_route_name_ar: 'الجسر البري الخليجي وموانئ ينبع على البحر الأحمر',
      transit_time_impact_days: 'توفير 10 - 14 يوماً مقارنة بمسار رأس الرجاء الصالح',
      cost_impact_pct: 'توفير 25% - 40% في تكلفة التأمين الإضافي ضد مخاطر الحرب',
      capacity_readiness: 'جاهز وفوري',
      strategic_description_ar: 'تفريغ البضائع في موانئ دبي (جبل علي) أو الدمام ونقلها عبر الشاحنات والسكك الحديدية براً إلى ميناء جدة وينبع أو براً عبر الأردن إلى موانئ المتوسط.',
      participating_countries: [
        { country_code: 'AE', name_ar: 'الإمارات', flag: '🇦🇪' },
        { country_code: 'SA', name_ar: 'السعودية', flag: '🇸🇦' },
        { country_code: 'JO', name_ar: 'الأردن', flag: '🇯🇴' },
        { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬' }
      ]
    },
    {
      id: 'contingency_strait_of_hormuz',
      primary_chokepoint_or_corridor: 'مضيق هرمز (الخليج العربي)',
      risk_scenario: 'إغلاق أو احتجاز ناقلات النفط واشتعال الصراع العسكري البحري في الممر',
      alternative_route_name_ar: 'خطوط أنابيب الفجيرة وينبع وموانئ بحر العرب',
      transit_time_impact_days: 'لا يوجد تأخير - تحميل فوري خارج المضيق',
      cost_impact_pct: 'تجنب رسوم مخاطر حرب على الناقلات تصل لـ 1.5 مليون دولار للرحلة',
      capacity_readiness: 'جاهز وفوري',
      strategic_description_ar: 'تفعيل خط أنابيب حبشان-الفجيرة (ADCOP) بسعة 1.5 مليون برميل/يوم، وخط بترولاين السعودي شرق-غرب بسعة 5 ملايين برميل/يوم، واستخدام موانئ صحار والدقم وصلالة العمانية.',
      participating_countries: [
        { country_code: 'AE', name_ar: 'الإمارات', flag: '🇦🇪' },
        { country_code: 'SA', name_ar: 'السعودية', flag: '🇸🇦' },
        { country_code: 'OM', name_ar: 'عُمان', flag: '🇴🇲' }
      ]
    },
    {
      id: 'contingency_suez_canal_choke',
      primary_chokepoint_or_corridor: 'قناة السويس',
      risk_scenario: 'جنوح سفن أو حوادث إغلاق ملاحي مؤقتة في المجرى الملاحي',
      alternative_route_name_ar: 'خط السوميد لنقل النفط والقطار السريع العابر للقناة',
      transit_time_impact_days: 'عبور فوري للنفط خلال 24 ساعة عبر الأنابيب',
      cost_impact_pct: 'توفير تكلفة الدوران حول إفريقيا وتفادي غرامات التأخير',
      capacity_readiness: 'جاهز وفوري',
      strategic_description_ar: 'نقل الخام من العين السخنة إلى سيدي كرير عبر خط أنابيب سوميد (Sumed) بسعة 2.5 مليون برميل/يوم، وتشغيل القطار الكهربائي السريع لربط السخنة بمرسى مطروح والإسكندرية.',
      participating_countries: [
        { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬' },
        { country_code: 'SA', name_ar: 'السعودية', flag: '🇸🇦' },
        { country_code: 'AE', name_ar: 'الإمارات', flag: '🇦🇪' },
        { country_code: 'KW', name_ar: 'الكويت', flag: '🇰🇼' },
        { country_code: 'QA', name_ar: 'قطر', flag: '🇶🇦' }
      ]
    },
    {
      id: 'contingency_iraq_development_road',
      primary_chokepoint_or_corridor: 'طريق التنمية والقناة الجافة العراقية',
      risk_scenario: 'ازدحام الممرات البحرية واختناق التجارة بين آسيا وأوروبا',
      alternative_route_name_ar: 'الممر البري والسككي من ميناء الفاو الكبير إلى تركيا وأوروبا',
      transit_time_impact_days: 'تقليص زمن الشحن البحري من 33 يوماً إلى 15 يوماً فقط',
      cost_impact_pct: 'خفض تكلفة الوقود والمصاريف التشغيلية بنسبة 20%',
      capacity_readiness: 'قيد التطوير والتوسعة',
      strategic_description_ar: 'مشروع استراتيجي بقيمة 17 مليار دولار يربط ميناء الفاو بأقصى جنوب العراق عبر 1200 كم من السكك الحديدية والطرق السريعة بالحدود التركية وصولاً إلى الأسواق الأوروبية.',
      participating_countries: [
        { country_code: 'IQ', name_ar: 'العراق', flag: '🇮🇶' },
        { country_code: 'TR', name_ar: 'تركيا', flag: '🇹🇷' },
        { country_code: 'QA', name_ar: 'قطر', flag: '🇶🇦' },
        { country_code: 'AE', name_ar: 'الإمارات', flag: '🇦🇪' }
      ]
    }
  ];

  const PAN_ARAB_GLOBAL_COMPETITIVENESS: PanArabGlobalCompetitiveness[] = [
    {
      country_code: 'AE',
      country_name_ar: 'دولة الإمارات العربية المتحدة',
      flag: '🇦🇪',
      global_competitiveness_rank: 7,
      global_innovation_index_rank: 32,
      global_cybersecurity_index_tier: 'المرتبة الأولى عالمياً (Role Model - ITU)',
      logistics_performance_index_rank: 7,
      soft_power_rank: 10,
      fdi_confidence_index_rank: 8,
      strategic_edge_ar: 'الريادة الإقليمية في مرونة الأعمال، التجارة السريعة، وجذب الاستثمارات الأجنبية المباشرة ومقرات الشركات متعددة الجنسيات.'
    },
    {
      country_code: 'SA',
      country_name_ar: 'المملكة العربية السعودية',
      flag: '🇸🇦',
      global_competitiveness_rank: 16,
      global_innovation_index_rank: 47,
      global_cybersecurity_index_tier: 'المرتبة الثانية عالمياً (Role Model - ITU)',
      logistics_performance_index_rank: 38,
      soft_power_rank: 18,
      fdi_confidence_index_rank: 14,
      strategic_edge_ar: 'أكبر اقتصاد وقوة مالية وصناعية في الشرق الأوسط، تقود العالم في الأمن السيبراني والتحول الرقمي الحكومي والمشاريع العملاقة.'
    },
    {
      country_code: 'QA',
      country_name_ar: 'دولة قطر',
      flag: '🇶🇦',
      global_competitiveness_rank: 11,
      global_innovation_index_rank: 49,
      global_cybersecurity_index_tier: 'الفئة المتقدمة (Tier 1)',
      logistics_performance_index_rank: 34,
      soft_power_rank: 21,
      fdi_confidence_index_rank: 19,
      strategic_edge_ar: 'أعلى نصيب فرد من الدخل، ريادة مطلقة في أسواق الغاز الطبيعي المسال، وشبكة لوجستية وطيران فائق الكفاءة (الخطوط الجوية القطرية وميناء حمد).'
    },
    {
      country_code: 'BH',
      country_name_ar: 'مملكة البحرين',
      flag: '🇧🇭',
      global_competitiveness_rank: 21,
      global_innovation_index_rank: 64,
      global_cybersecurity_index_tier: 'الفئة المتقدمة (Tier 2)',
      logistics_performance_index_rank: 44,
      soft_power_rank: 48,
      fdi_confidence_index_rank: 27,
      strategic_edge_ar: 'بيئة تنظيمية مرنة وسباقة للتقنيات المالية والعملات الرقمية والبنوك الحرة وأقل تكاليف تشغيلية في الخليج.'
    },
    {
      country_code: 'OM',
      country_name_ar: 'سلطنة عُمان',
      flag: '🇴🇲',
      global_competitiveness_rank: 29,
      global_innovation_index_rank: 69,
      global_cybersecurity_index_tier: 'الفئة المتقدمة (Tier 1)',
      logistics_performance_index_rank: 43,
      soft_power_rank: 46,
      fdi_confidence_index_rank: 25,
      strategic_edge_ar: 'موقع جغرافي فريد على المحيط الهندي متجاوزاً مضيق هرمز، وملاذ آمن وحيادي للاستثمارات اللوجستية والهيدروجين الأخضر.'
    },
    {
      country_code: 'KW',
      country_name_ar: 'دولة الكويت',
      flag: '🇰🇼',
      global_competitiveness_rank: 37,
      global_innovation_index_rank: 63,
      global_cybersecurity_index_tier: 'الفئة المتقدمة (Tier 2)',
      logistics_performance_index_rank: 51,
      soft_power_rank: 35,
      fdi_confidence_index_rank: 31,
      strategic_edge_ar: 'احتياطيات مالية سيادية هائلة وقدرة تمويلية ضخمة واستقرار نقدي مدعوم بأقوى عملة في العالم (الدينار الكويتي).'
    },
    {
      country_code: 'MA',
      country_name_ar: 'المملكة المغربية',
      flag: '🇲🇦',
      global_competitiveness_rank: 54,
      global_innovation_index_rank: 70,
      global_cybersecurity_index_tier: 'الفئة المتقدمة (Tier 2)',
      logistics_performance_index_rank: 61,
      soft_power_rank: 50,
      fdi_confidence_index_rank: 33,
      strategic_edge_ar: 'بوابة إفريقيا وقوة صناعية أولى في صناعة السيارات وبطاريات المركبات الكهربائية والطيران بجوار ميناء طنجة المتوسط.'
    },
    {
      country_code: 'JO',
      country_name_ar: 'المملكة الأردنية الهاشمية',
      flag: '🇯🇴',
      global_competitiveness_rank: 58,
      global_innovation_index_rank: 71,
      global_cybersecurity_index_tier: 'الفئة المتقدمة (Tier 2)',
      logistics_performance_index_rank: 67,
      soft_power_rank: 62,
      fdi_confidence_index_rank: 39,
      strategic_edge_ar: 'كوادر بشرية ذات مهارة عالية في تكنولوجيا المعلومات والطب والتعليم، واستقرار تشريعي ومالي مستدام.'
    },
    {
      country_code: 'EG',
      country_name_ar: 'جمهورية مصر العربية',
      flag: '🇪🇬',
      global_competitiveness_rank: 63,
      global_innovation_index_rank: 86,
      global_cybersecurity_index_tier: 'الفئة المتقدمة (Tier 1)',
      logistics_performance_index_rank: 57,
      soft_power_rank: 38,
      fdi_confidence_index_rank: 22,
      strategic_edge_ar: 'أكبر سوق استهلاكي عربي (106 ملايين نسمة)، موقع محوري يربط آسيا بإفريقيا وأوروبا عبر قناة السويس والمنطقة الاقتصادية الحرة.'
    }
  ];

  // Endpoint 23: Geopolitical Risk & Safety Index
  app.get('/api/countries/analytics/geopolitical-risk', (_req: Request, res: Response) => {
    try {
      res.json({
        ok: true,
        success: true,
        total_count: PAN_ARAB_GEOPOLITICAL_RISKS.length,
        data: PAN_ARAB_GEOPOLITICAL_RISKS
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch geopolitical risks' });
    }
  });

  // Endpoint 24: Routing Contingency & Resilience Solutions
  app.get('/api/countries/analytics/route-contingencies', (_req: Request, res: Response) => {
    try {
      res.json({
        ok: true,
        success: true,
        total_count: PAN_ARAB_ROUTE_CONTINGENCIES.length,
        data: PAN_ARAB_ROUTE_CONTINGENCIES
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch route contingencies' });
    }
  });

  // Endpoint 25: Global Competitiveness Benchmarks
  app.get('/api/countries/analytics/competitiveness-benchmarks', (_req: Request, res: Response) => {
    try {
      res.json({
        ok: true,
        success: true,
        total_count: PAN_ARAB_GLOBAL_COMPETITIVENESS.length,
        data: PAN_ARAB_GLOBAL_COMPETITIVENESS
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch competitiveness benchmarks' });
    }
  });

  // Endpoint 26: Generate Ministerial / C-Suite Strategic Executive Briefing
  app.post('/api/countries/analytics/generate-executive-briefing', (req: Request, res: Response) => {
    try {
      const {
        recipient_title = 'معالي الوزير / سعادة رئيس مجلس الإدارة التنفيذي',
        selected_countries = ['SA', 'AE', 'EG', 'MA'],
        focus_domains = ['sovereign_investment', 'geopolitical_risk', 'supply_chains', 'digital_ai'],
        urgency_level = 'strategic',
        custom_notes = ''
      }: PanArabExecutiveBriefingRequest = req.body;

      const countries = selected_countries.map((c) => {
        const code = String(c).toUpperCase();
        const profile = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[code] || COMPREHENSIVE_ARAB_COUNTRIES_PROFILES['SA'];
        const risk = PAN_ARAB_GEOPOLITICAL_RISKS.find((r) => r.country_code === code);
        return {
          country_code: profile.country_code,
          country_name_ar: profile.name_ar,
          flag: profile.flag,
          risk_level_ar: risk ? risk.risk_level_ar : 'مستقر ومعتدل المخاطر',
          investment_outlook_ar: code === 'SA' || code === 'AE' || code === 'QA' ? 'إيجابي جداً - نمو مرتفع واستقرار سيادي' : 'إيجابي مع انتقائية في القطاعات الواعدة',
          critical_alert_ar: risk ? risk.primary_geopolitical_threats[0] : undefined
        };
      });

      const classification =
        urgency_level === 'urgent_crisis'
          ? 'سري للغاية - استخدام وزاري عاجل'
          : urgency_level === 'routine'
          ? 'إحاطة وزارية دورية'
          : 'استراتيجي تنفيذي - كبار صناع القرار';

      const docId = `DARB-BRIEF-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
      const now = new Date();
      const dateFormatted = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ت.ع`;

      const executiveSummary = `بناءً على طلب ${recipient_title}، يُقدّم مرصد "دَرْب (DARB)" هذه الإحاطة الاستراتيجية الرفيعة لتحليل الديناميكيات الاقتصادية والجيوسياسية وسلاسل الإمداد ومسارات الاستثمار السيادي في الدول المحددة (${countries.map((c) => c.country_name_ar).join('، ')}). تُشير التقييمات المعيارية إلى أن المنطقة العربية تشهد إعادة تموضع هيكلية تقودها الصناديق السيادية واستثمارات الطاقة النظيفة والذكاء الاصطناعي السيادي، مع ضرورة تفعيل خطط التحوط البديلة للممرات البحرية الاستراتيجية لضمان استمرارية الأعمال وحماية تدفقات رؤوس الأموال.`;

      const responsePayload: PanArabExecutiveBriefingResponse = {
        document_id: docId,
        timestamp_formatted: dateFormatted,
        recipient_title,
        classification_level: classification,
        executive_summary_ar: executiveSummary,
        strategic_takeaways: [
          'الصناديق السيادية الخليجية والعربية تدير أصولاً تتجاوز 3.8 تريليون دولار، وتُوجّه الفوائض نحو أشباه الموصلات، الطاقة المتجددة، ومشاريع البنية التحتية اللوجستية.',
          'تفعيل ممرات النقل البرية البديلة (الجسر البري الخليجي-المتوسط وطريق التنمية) يُمثّل أولوية أمن اقتصادي لتفادي اختناقات مضيقي هرمز وباب المندب.',
          'الريادة السيبرانية لدول المنطقة (خاصة السعودية والإمارات) تضمن بيئة تشغيلية آمنة لمراكز البيانات السحابية العملاقة ونماذج الذكاء الاصطناعي السيادية.',
          'الحوافز الاستثمارية في المناطق الاقتصادية الخاصة (إعفاءات ضريبية وملكية أجنبية 100%) تتيح للمستثمرين المؤسسيين عوائد متوقعة تتراوح بين 14% إلى 24% سنوياً.'
        ],
        country_assessments: countries,
        swot_analysis: {
          strengths: [
            'احتياطيات نقدية وسيادية ضخمة وملاءة مالية عالية تدعم المشاريع الوطنية الكبرى.',
            'موقع جغرافي عالمي يتوسط قارات العالم الثلاث ويسيطر على أهم الممرات الملاحية الدولية.',
            'بنية تحتية رقمية وموانئ ومطارات مصنفة بين الأكثر تطوراً وكفاءة على مستوى العالم.'
          ],
          weaknesses: [
            'تفاوت وتيرة الإصلاحات التشريعية والبيروقراطية بين بعض الاقتصادات العربية.',
            'حساسية سلاسل الإمداد الغذائي والمائي للتغيرات المناخية وتقلبات الأسواق العالمية.',
            'الحاجة المستمرة لتدريب وتأهيل الكوادر الوطنية لتلبية متطلبات الذكاء الاصطناعي والصناعات المتقدمة.'
          ],
          opportunities: [
            'الشراكات البينية في إطار اتفاقية التجارة الحرة العربية الكبرى (GAFTA) والتكامل الصناعي.',
            'جذب المصانع وسلاسل الإمداد العالمية الراغبة في توطين الإنتاج (Nearshoring / Friendshoring).',
            'الريادة العالمية في إنتاج وتصدير الهيدروجين الأخضر والأمونيا النظيفة لأوروبا وآسيا.'
          ],
          threats: [
            'اشتعال التوترات الجيوسياسية وتأثيرها على حركة الملاحة والتأمين البحري وأسعار الشحن.',
            'تقلبات أسعار الطاقة العالمية وتأثيرها على موازنات الدول المصدرة والمستوردة للنفط.',
            'التنافس الشديد على استقطاب المواهب التقنية ورؤوس الأموال الاستثمارية العالمية.'
          ]
        },
        recommended_action_roadmap: [
          {
            timeline_ar: 'المدى القريب (1 - 3 أشهر)',
            action_title_ar: 'تأمين سلاسل الإمداد وتفعيل عقود الشحن المزدوجة',
            details_ar: 'إبرام اتفاقيات استخدام الممرات البرية البديلة وتأمين مساحات تخزين لوجستية في المناطق الحرة المعفاة (مثل جبل علي، الملك سلمان، أو السخنة).',
            owner_stakeholders_ar: 'إدارة سلاسل الإمداد، قطاع العمليات، واللجان المشتركة'
          },
          {
            timeline_ar: 'المدى المتوسط (3 - 12 شهراً)',
            action_title_ar: 'تأسيس الكيانات الإقليمية والشراكات السيادية',
            details_ar: 'الاستفادة من برامج المقرات الإقليمية (RHQ) وتأسيس شركات تابعة في المناطق التكنولوجية للاستفادة من الإعفاءات الضريبية.',
            owner_stakeholders_ar: 'مجلس الإدارة، الإدارة المالية والقانونية، ووحدات الاستثمار'
          },
          {
            timeline_ar: 'المدى الاستراتيجي (1 - 3 سنوات)',
            action_title_ar: 'توطين التقنيات والتحول نحو الاقتصاد الأخضر والسيادة الرقمية',
            details_ar: 'استثمار مشترك في مراكز بيانات الذكاء الاصطناعي الصديقة للبيئة وتطوير حلول الطاقة المتجددة المتكاملة مع الأهداف الوطنية 2030.',
            owner_stakeholders_ar: 'القيادة التنفيذية، المستثمرون المؤسسيون، وممثلو الصناديق السيادية'
          }
        ],
        darb_synthesis_statement: `خلاصة تحليل دارب (DARB Synthesis): تُظهر البيئة الإقليمية نضجاً غير مسبوق في إدارة المخاطر وتحويل التحديات الجيوسياسية إلى فرص تكامل استثماري. التوصية التنفيذية المؤكدة هي تسريع وتيرة الاستثمار في القطاعات ذات المزايا التنافسية السيادية، مع تفعيل آليات التحوط اللوجستي والسيبراني وفق هذا المخطط الاستراتيجي المعتمد.`
      };

      res.json({
        ok: true,
        success: true,
        data: responsePayload
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to generate executive briefing' });
    }
  });

  // ==========================================================================
  // PHASE 8: INDUSTRIAL PARTNERSHIP, DEALS PIPELINE, FOOD SECURITY & ORIGIN
  // ==========================================================================

  const PAN_ARAB_INDUSTRIAL_PROJECTS: PanArabIndustrialProject[] = [
    {
      id: 'ind_soda_ash_chemicals',
      project_name_ar: 'مجمع تصنيع كربونات الصوديوم (رماد الصودا) والكيماويات التعدينية المتخصصة',
      sector_ar: 'الصناعات الكيماوية والتعدينية',
      participating_countries: [
        { country_code: 'SA', name_ar: 'السعودية', flag: '🇸🇦', role_ar: 'توريد المواد الخام وتوفير الطاقة التنافسية' },
        { country_code: 'AE', name_ar: 'الإمارات', flag: '🇦🇪', role_ar: 'التمويل المشترك وشبكات التصدير واللوجستيات' },
        { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬', role_ar: 'استضافة المجمع الصناعي وتوفير الكوادر الفنية' }
      ],
      investment_value_usd_million: 780,
      expected_annual_output_ar: '500,000 طن سنوياً لتغذية صناعات الزجاج والمنظفات والبطاريات',
      value_chain_synergy_ar: 'استبدال 100% من الواردات العربية من رماد الصودا القادمة من شرق آسيا وأوروبا، وتحقيق تكامل صناعي مباشر مع مصانع الزجاج في مصر والخليج.',
      status_ar: 'قيد الإنشاء والتشييد',
      jobs_created: 3400,
      strategic_impact_ar: 'تأمين سلسلة توريد مادة أساسية تدخل في 30 قطاعاً صناعياً وتوفير 600 مليون دولار سنوياً من العملات الصعبة للمنطقة.'
    },
    {
      id: 'ind_phosphate_fertilizers',
      project_name_ar: 'التحالف العربي للأسمدة الفوسفاتية والنيتروجينية والأمونيا الخضراء',
      sector_ar: 'الأسمدة والزراعة المتقدمة',
      participating_countries: [
        { country_code: 'MA', name_ar: 'المغرب', flag: '🇲🇦', role_ar: 'أكبر احتياطي فوسفات وتقنيات مجمع الجرف الأصفر' },
        { country_code: 'JO', name_ar: 'الأردن', flag: '🇯🇴', role_ar: 'تعدين وتصنيع البوتاس والأسمدة المتخصصة' },
        { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬', role_ar: 'الإنتاج النيتروجيني والتوزيع للأسواق الإفريقية' },
        { country_code: 'AE', name_ar: 'الإمارات', flag: '🇦🇪', role_ar: 'الاستثمار السيادي والشراكات التجارية العالمية' }
      ],
      investment_value_usd_million: 1450,
      expected_annual_output_ar: '3.2 مليون طن من الأسمدة المركبة واليوريا المتقدمة',
      value_chain_synergy_ar: 'دمج الفوسفات المغربي والبوتاس الأردني مع الأمونيا النظيفة المصنعة بالغاز المصري والطاقة المتجددة لتوفير أسمدة زراعية مدعومة للدول العربية.',
      status_ar: 'مرحلة التشغيل التجريبي',
      jobs_created: 6200,
      strategic_impact_ar: 'ضمان الاستقلال الغذائي والزراعي العربي ومضاعفة إنتاجية الأراضي الزراعية في حوض النيل والمغرب العربي والهلال الخصيب.'
    },
    {
      id: 'ind_ev_battery_materials',
      project_name_ar: 'سلسلة القيمة لتصنيع بطاريات المركبات الكهربائية ومكونات الكاثود',
      sector_ar: 'التنقل الكهربائي والصناعات المتقدمة',
      participating_countries: [
        { country_code: 'MA', name_ar: 'المغرب', flag: '🇲🇦', role_ar: 'مصانع الكاثود وتجميع السيارات في القنيطرة وطنجة' },
        { country_code: 'SA', name_ar: 'السعودية', flag: '🇸🇦', role_ar: 'تكرير الليثيوم والنيكل وسيارات لوسيد وسير (CEER)' },
        { country_code: 'BH', name_ar: 'البحرين', flag: '🇧🇭', role_ar: 'ألمنيوم فائق النقاوة لهياكل البطاريات (Alba)' }
      ],
      investment_value_usd_million: 2100,
      expected_annual_output_ar: 'حزم بطاريات تكفي لأكثر من 350,000 سيارة كهربائية سنوياً بحلول 2028',
      value_chain_synergy_ar: 'تكامل الألمنيوم البحريني المتقدم مع الليثيوم المكرر في السعودية مع الكوبالت والمنجنيز المغربي لتغذية خطوط إنتاج السيارات في المغرب والخليج.',
      status_ar: 'مرحلة دراسات الجدوى والإغلاق المالي',
      jobs_created: 9800,
      strategic_impact_ar: 'وضع العالم العربي على خارطة سلاسل توريد الثورة الصناعية الرابعة وصناعة السيارات العالمية وتقليل الاعتماد على استيراد البطاريات.'
    },
    {
      id: 'ind_biopharma_vaccines',
      project_name_ar: 'الشبكة العربية للأمن الدوائي واللقاحات والمستحضرات الحيوية (Biopharma)',
      sector_ar: 'الصناعات الدوائية والرعاية الصحية',
      participating_countries: [
        { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬', role_ar: 'مدينة الدواء (Gypto Pharma) والطاقة الإنتاجية الضخمة' },
        { country_code: 'JO', name_ar: 'الأردن', flag: '🇯🇴', role_ar: 'البحث والتطوير الصيدلاني المتقدم والمختبرات المعتمدة عالمياً' },
        { country_code: 'SA', name_ar: 'السعودية', flag: '🇸🇦', role_ar: 'تصنيع أدوية الأورام والأنسولين والمشتريات الحكومية الموحدة' },
        { country_code: 'AE', name_ar: 'الإمارات', flag: '🇦🇪', role_ar: 'مراكز الابتكار الحيوي وشركات التوزيع الإقليمية' }
      ],
      investment_value_usd_million: 920,
      expected_annual_output_ar: '1.4 مليار جرعة دوائية ولقاحات حيوية تغطي الأمراض المزمنة والأوبئة',
      value_chain_synergy_ar: 'اعتماد الاعتراف المتبادل بالترخيص الدوائي العربي والتكامل بين مراكز أبحاث الأردن ومصانع مصر والسعودية وسلاسل التوريد السريعة في الإمارات.',
      status_ar: 'قيد الإنشاء والتشييد',
      jobs_created: 4500,
      strategic_impact_ar: 'رفع نسبة الاكتفاء الذاتي العربي من الدواء من 58% إلى 82% وتفادي أي أزمات انقطاع للأدوية المنقذة للحياة.'
    },
    {
      id: 'ind_technical_textiles',
      project_name_ar: 'مجمع المنسوجات التقنية والأقمشة الصناعية المقاومة للحرارة',
      sector_ar: 'المنسوجات والملابس التقنية',
      participating_countries: [
        { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬', role_ar: 'القطن المصري طويل التيلة ومصانع المحلة الكبرى' },
        { country_code: 'JO', name_ar: 'الأردن', flag: '🇯🇴', role_ar: 'المناطق الصناعية المؤهلة (QIZ) والوصول للأسواق المعفاة' },
        { country_code: 'AE', name_ar: 'الإمارات', flag: '🇦🇪', role_ar: 'الاستثمار في الألياف البتروكيماوية الصناعية' }
      ],
      investment_value_usd_million: 430,
      expected_annual_output_ar: '85 مليون متر مربع من الأقمشة الفنية والملابس الصناعية المتخصصة',
      value_chain_synergy_ar: 'دمج البوليمرات البتروكيماوية الخليجية مع القطن المصري عالي الجودة وخبرات التصنيع الأردنية التصديرية المعفاة جمركياً.',
      status_ar: 'قيد التوسعة الاستراتيجية',
      jobs_created: 7200,
      strategic_impact_ar: 'مضاعفة الصادرات العربية للملابس التقنية ذات القيمة المضافة العالية إلى أسواق أمريكا الشمالية والاتحاد الأوروبي.'
    }
  ];

  const PAN_ARAB_CO_INVESTMENT_DEALS: PanArabCoInvestmentDeal[] = [
    {
      id: 'deal_green_hyperscale_dc',
      deal_title_ar: 'الشبكة القارية لمراكز البيانات الخضراء والحوسبة الفائقة للذكاء الاصطناعي',
      sector_ar: 'البنية التحتية الرقمية والذكاء الاصطناعي',
      host_countries: [
        { country_code: 'SA', name_ar: 'السعودية', flag: '🇸🇦' },
        { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬' },
        { country_code: 'AE', name_ar: 'الإمارات', flag: '🇦🇪' }
      ],
      target_ticket_size_usd_million: 1200,
      minimum_check_size_usd_million: 50,
      projected_irr_pct: 18.5,
      sovereign_co_investors: ['صندوق الاستثمارات العامة (PIF)', 'مبادلة للاستثمار', 'صندوق مصر السيادي (TSFE)'],
      regulatory_incentives_ar: [
        'إعفاء ضريبي كامل لمدة 20 عاماً في المناطق الخاصة',
        'توفير طاقة شمسية وريحية نظيفة بأسعار تفضيلية مدعومة',
        'حماية الملكية الفكرية وسهولة تحويل الأرباح بالعملات الصعبة'
      ],
      deal_stage: 'مرحلة الاكتتاب المغلق',
      overview_ar: 'بناء 6 مراكز بيانات بقدرة إجمالية 300 ميجاوات تعمل بالطاقة المتجددة بنسبة 100% لاستضافة نماذج الذكاء الاصطناعي السيادية وتدريب النماذج اللغوية الضخمة وتأجير السعات لشركات التقنية العالمية.'
    },
    {
      id: 'deal_refrigerated_cold_chain',
      deal_title_ar: 'مشروع الناقل اللوجستي المبرد لسلاسل الغذاء بين الخليج والبحر المتوسط',
      sector_ar: 'النقل واللوجستيات وسلاسل الإمداد المبردة',
      host_countries: [
        { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬' },
        { country_code: 'JO', name_ar: 'الأردن', flag: '🇯🇴' },
        { country_code: 'SA', name_ar: 'السعودية', flag: '🇸🇦' },
        { country_code: 'AE', name_ar: 'الإمارات', flag: '🇦🇪' }
      ],
      target_ticket_size_usd_million: 450,
      minimum_check_size_usd_million: 20,
      projected_irr_pct: 16.2,
      sovereign_co_investors: ['موانئ دبي العالمية (DP World)', 'صندوق الاستثمار الأردني', 'الشركة السعودية للاستثمار الزراعي (سالك)'],
      regulatory_incentives_ar: [
        'مسار جمركي أخضر وسريع عند المعابر الحدودية للسلع سريعة التلف',
        'تخصيص أراضٍ لوجستية بحق انتفاع طويل الأجل قرب الموانئ الحيوية',
        'تراخيص تشغيل موحدة وشهادات فحص سلامة غذاء معتمدة إلكترونياً'
      ],
      deal_stage: 'مرحلة الفحص النافي للجهالة (DD)',
      overview_ar: 'أسطول شاحنات مبردة ذكية ومستودعات تبريد عملاقة بسعة 500,000 طن متري على طول ممرات النقل البري والبحري لتقليص هدر المنتجات الزراعية والغذائية الطازجة بنسبة 80%.'
    },
    {
      id: 'deal_floating_solar_desal',
      deal_title_ar: 'محطات تحلية المياه بالطاقة الشمسية العائمة والهيدروجين الأخضر',
      sector_ar: 'المياه والطاقة المتجددة',
      host_countries: [
        { country_code: 'OM', name_ar: 'عُمان', flag: '🇴🇲' },
        { country_code: 'MA', name_ar: 'المغرب', flag: '🇲🇦' },
        { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬' }
      ],
      target_ticket_size_usd_million: 850,
      minimum_check_size_usd_million: 30,
      projected_irr_pct: 14.8,
      sovereign_co_investors: ['جهاز الاستثمار العماني (OIA)', 'الوكالة المغربية للطاقة المستدامة (مازن)', 'مصدر (Masdar)'],
      regulatory_incentives_ar: [
        'عقود شراء مياه وطاقة طويلة الأجل (PPA / WPA) لمدة 25 سنة بضمانات سيادية',
        'إعفاء جمركي لمعدات الأغشية والمحللات الكهربائية والألواح الشمسية',
        'تسهيلات تمويل مصرفي ميسر بنسب فائدة منخفضة مدعومة'
      ],
      deal_stage: 'مرحلة طرح الأسهم والتمويل المشترك',
      overview_ar: 'تطوير 4 مجمعات تحلية مياه بسعة إجمالية 1.2 مليون متر مكعب يومياً تعمل بالطاقة المتجددة لتوفير مياه الشرب والري للمناطق الساحلية وإنتاج الهيدروجين النظيف للتصدير.'
    },
    {
      id: 'deal_desert_agritech_farms',
      deal_title_ar: 'مزارع التكنولوجيا الزراعية والزراعة العمودية الذكية والبيوت المحمية',
      sector_ar: 'التكنولوجيا الزراعية والأمن الغذائي',
      host_countries: [
        { country_code: 'QA', name_ar: 'قطر', flag: '🇶🇦' },
        { country_code: 'SA', name_ar: 'السعودية', flag: '🇸🇦' },
        { country_code: 'JO', name_ar: 'الأردن', flag: '🇯🇴' }
      ],
      target_ticket_size_usd_million: 280,
      minimum_check_size_usd_million: 15,
      projected_irr_pct: 17.0,
      sovereign_co_investors: ['جهاز قطر للاستثمار (QIA)', 'حصاد الغذائية', 'الشركة السعودية للاستثمار الزراعي والحيواني'],
      regulatory_incentives_ar: [
        'دعم 50% لتكلفة الكهرباء والمياه لتقنيات التوفير المائي المتقدمة',
        'منح تراخيص زراعية وبيئية فورية عبر منصة النافذة الواحدة',
        'أولوية التوريد للمطاعم والفنادق وسلاسل التجزئة والمستشفيات الحكومية'
      ],
      deal_stage: 'مرحلة الاكتتاب المغلق',
      overview_ar: 'إنشاء مزارع عمودية مغلقة توفر 95% من المياه مقارنة بالزراعة التقليدية وتنتج خضروات وفواكه عضوية على مدار العام دون تأثر بحرارة الصيف الصحراوية.'
    },
    {
      id: 'deal_fintech_venture_fund',
      deal_title_ar: 'صندوق الاستثمار الجريء المشترك لشركات التكنولوجيا المالية والتجارة الرقمية',
      sector_ar: 'التكنولوجيا المالية والاقتصاد الرقمي',
      host_countries: [
        { country_code: 'BH', name_ar: 'البحرين', flag: '🇧🇭' },
        { country_code: 'AE', name_ar: 'الإمارات', flag: '🇦🇪' },
        { country_code: 'KW', name_ar: 'الكويت', flag: '🇰🇼' }
      ],
      target_ticket_size_usd_million: 350,
      minimum_check_size_usd_million: 10,
      projected_irr_pct: 22.4,
      sovereign_co_investors: ['شركة ممتلكات البحرين القابضة', 'القابضة ADQ', 'الصندوق الوطني الكويتي'],
      regulatory_incentives_ar: [
        'جواز مرور تنظيمي (Passporting) لتقديم الخدمات المالية عبر دول الخليج',
        'بيئة تجريبية رقابية مشتركة (Regulatory Sandbox)',
        'إعفاء من ضريبة الدخل على أرباح رأس المال (Capital Gains)'
      ],
      deal_stage: 'مرحلة الاكتتاب المغلق',
      overview_ar: 'صندوق استثمار إقليمي يركز على تمويل شركات المدفوعات والتمويل المفتوح وحلول سلاسل الكتل اللوجستية التي تسهل تسوية التجارة العربية البينية بالعملات المحلية.'
    }
  ];

  const PAN_ARAB_FOOD_SECURITY_COMMODITIES: PanArabFoodSecurityCommodity[] = [
    {
      commodity_key: 'wheat_grains',
      commodity_name_ar: 'القمح والحبوب الاستراتيجية',
      icon_type: 'wheat',
      pan_arab_annual_consumption_million_tons: 46.5,
      pan_arab_self_sufficiency_pct: 43.2,
      average_strategic_reserve_months: 6.8,
      leading_producing_countries: [
        { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬', share_pct: 35 },
        { country_code: 'DZ', name_ar: 'الجزائر', flag: '🇩🇿', share_pct: 22 },
        { country_code: 'MA', name_ar: 'المغرب', flag: '🇲🇦', share_pct: 18 },
        { country_code: 'IQ', name_ar: 'العراق', flag: '🇮🇶', share_pct: 14 }
      ],
      strategic_joint_initiatives: [
        'التحالف الزراعي في الأراضي الخصبة بالسودان وتوشكى ومستقبل مصر',
        'شبكة الصوامع الاستراتيجية لتخزين 12 مليون طن حبوب بتمويل خليجي',
        'برنامج استنباط بذور عالية الإنتاجية ومقاومة للجفاف والملوحة'
      ],
      risk_status: 'استقرار حرج يتطلب تحوط'
    },
    {
      commodity_key: 'edible_oils',
      commodity_name_ar: 'الزيوت النباتية وبذور المحاصيل الزيتية',
      icon_type: 'oil',
      pan_arab_annual_consumption_million_tons: 11.2,
      pan_arab_self_sufficiency_pct: 31.8,
      average_strategic_reserve_months: 5.4,
      leading_producing_countries: [
        { country_code: 'TN', name_ar: 'تونس', flag: '🇹🇳', share_pct: 32 },
        { country_code: 'MA', name_ar: 'المغرب', flag: '🇲🇦', share_pct: 28 },
        { country_code: 'SY', name_ar: 'سوريا', flag: '🇸🇾', share_pct: 16 },
        { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬', share_pct: 14 }
      ],
      strategic_joint_initiatives: [
        'التوسع في زراعة الكانولا وعباد الشمس وفول الصويا بالمناطق المستصلحة',
        'مجمعات تكرير وتعبئة الزيوت الاستراتيجية في ميناء العين السخنة وجبل علي',
        'مبادرة تصدير زيت الزيتون العربي الموحد للأسواق العالمية'
      ],
      risk_status: 'فجوة استيرادية مرتفعة'
    },
    {
      commodity_key: 'sugar',
      commodity_name_ar: 'السكر الأبيض والمحليات الغذائية',
      icon_type: 'sugar',
      pan_arab_annual_consumption_million_tons: 15.4,
      pan_arab_self_sufficiency_pct: 68.5,
      average_strategic_reserve_months: 7.9,
      leading_producing_countries: [
        { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬', share_pct: 48 },
        { country_code: 'SD', name_ar: 'السودان', flag: '🇸🇩', share_pct: 22 },
        { country_code: 'MA', name_ar: 'المغرب', flag: '🇲🇦', share_pct: 18 },
        { country_code: 'AE', name_ar: 'الإمارات', flag: '🇦🇪', share_pct: 8 }
      ],
      strategic_joint_initiatives: [
        'مشروع القناة للسكر بمصر لإنتاج 900,000 طن سنوياً من بنجر السكر باستثمار إماراتي',
        'تأهيل مصانع سكر كنانة والجنيد في السودان لمضاعفة الإنتاج التصديري',
        'الربط اللوجستي لنقل السكر الأبيض المعفى جمركياً ضمن اتفاقية جافتا'
      ],
      risk_status: 'آمن ومستقر'
    },
    {
      commodity_key: 'meat_poultry',
      commodity_name_ar: 'اللحوم الحمراء والبيضاء والدواجن',
      icon_type: 'meat',
      pan_arab_annual_consumption_million_tons: 13.8,
      pan_arab_self_sufficiency_pct: 59.4,
      average_strategic_reserve_months: 4.8,
      leading_producing_countries: [
        { country_code: 'SA', name_ar: 'السعودية', flag: '🇸🇦', share_pct: 30 },
        { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬', share_pct: 26 },
        { country_code: 'MA', name_ar: 'المغرب', flag: '🇲🇦', share_pct: 19 },
        { country_code: 'SD', name_ar: 'السودان', flag: '🇸🇩', share_pct: 15 }
      ],
      strategic_joint_initiatives: [
        'مشاريع شركة المراعي ونادك السعودية للاستثمار في إنتاج الدواجن والأعلاف',
        'ممرات نقل وتوريد الماشية الحية والمجمدة عبر البحر الأحمر',
        'توطين صناعة أعلاف الدواجن من خلال مجمعات الذرة الصفراء والصويا'
      ],
      risk_status: 'استقرار حرج يتطلب تحوط'
    },
    {
      commodity_key: 'rice_staples',
      commodity_name_ar: 'الأرز والمحاصيل النشوية',
      icon_type: 'rice',
      pan_arab_annual_consumption_million_tons: 12.1,
      pan_arab_self_sufficiency_pct: 64.2,
      average_strategic_reserve_months: 6.2,
      leading_producing_countries: [
        { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬', share_pct: 68 },
        { country_code: 'IQ', name_ar: 'العراق', flag: '🇮🇶', share_pct: 18 },
        { country_code: 'MR', name_ar: 'موريتانيا', flag: '🇲🇷', share_pct: 9 }
      ],
      strategic_joint_initiatives: [
        'استنباط سلالات أرز مصرية موفرة للمياه تستهلك 40% أقل وتتحمل الجفاف',
        'مشاريع زراعة أرز العنبر العراقي الشهير في سهول الفرات والرافدين',
        'اتفاقيات توريد أرز تفضيلية طويلة الأجل بين مصر ودول مجلس التعاون الخليجي'
      ],
      risk_status: 'آمن ومستقر'
    }
  ];

  // Endpoint 27: Integrated Industrial Partnership Projects
  app.get('/api/countries/analytics/industrial-partnerships', (_req: Request, res: Response) => {
    try {
      res.json({
        ok: true,
        success: true,
        total_count: PAN_ARAB_INDUSTRIAL_PROJECTS.length,
        data: PAN_ARAB_INDUSTRIAL_PROJECTS
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch industrial partnerships' });
    }
  });

  // Endpoint 28: Pan-Arab Co-Investment Deal Pipeline
  app.get('/api/countries/analytics/co-investment-pipeline', (_req: Request, res: Response) => {
    try {
      res.json({
        ok: true,
        success: true,
        total_count: PAN_ARAB_CO_INVESTMENT_DEALS.length,
        data: PAN_ARAB_CO_INVESTMENT_DEALS
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch co-investment deals' });
    }
  });

  // Endpoint 29: Pan-Arab Food Security & Commodity Reserves
  app.get('/api/countries/analytics/food-water-security', (_req: Request, res: Response) => {
    try {
      res.json({
        ok: true,
        success: true,
        total_count: PAN_ARAB_FOOD_SECURITY_COMMODITIES.length,
        data: PAN_ARAB_FOOD_SECURITY_COMMODITIES
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch food security data' });
    }
  });

  // Endpoint 30: GAFTA Rules of Origin & Customs Tariff Exemption Calculator
  app.post('/api/countries/analytics/calculate-rules-of-origin', (req: Request, res: Response) => {
    try {
      const {
        product_name_ar = 'منتج صناعي',
        hs_code = '84.18',
        exporting_country = 'SA',
        importing_country = 'EG',
        ex_works_price_usd = 1000,
        arab_origin_materials_cost_usd = 350,
        direct_local_labor_cost_usd = 120,
        factory_overhead_cost_usd = 80,
        non_arab_imported_materials_cost_usd = 450
      }: PanArabRulesOfOriginInput = req.body;

      const expProfile = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[exporting_country.toUpperCase()] || COMPREHENSIVE_ARAB_COUNTRIES_PROFILES['SA'];
      const impProfile = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[importing_country.toUpperCase()] || COMPREHENSIVE_ARAB_COUNTRIES_PROFILES['EG'];

      const totalArabValueAdded = arab_origin_materials_cost_usd + direct_local_labor_cost_usd + factory_overhead_cost_usd;
      const validExWorksPrice = ex_works_price_usd > 0 ? ex_works_price_usd : (totalArabValueAdded + non_arab_imported_materials_cost_usd);
      const arabValuePct = Number(((totalArabValueAdded / validExWorksPrice) * 100).toFixed(1));
      const requiredThreshold = 40.0;
      const isCompliant = arabValuePct >= requiredThreshold;

      // Standard import tariff rate without GAFTA typically 10% to 20%
      const standardDutyPct = 15;
      const estimatedSavings = isCompliant ? Number(((validExWorksPrice * standardDutyPct) / 100).toFixed(2)) : 0;

      const verdictAr = isCompliant
        ? 'مؤهل للإعفاء الجمركي الكامل (0% جمارك) بموجب اتفاقية التجارة الحرة العربية الكبرى (GAFTA)'
        : 'غير مؤهل للإعفاء الجمركي الكامل حالياً (نسبة القيمة المضافة أقل من الحد الأدنى 40%)';

      const certificates = isCompliant
        ? [
            'شهادة المنشأ العربية الموحدة (GAFTA Certificate of Origin) مصدقة من الغرفة التجارية ووزارة الصناعة',
            'الفاتورة التجارية الأصلية معتمدة ومتضمنة إقرار المنشأ العربي',
            'بيان التكلفة والقيمة المضافة (Cost Breakdown Sheet) مدقق من محاسب قانوني معتمد',
            'بوليصة الشحن المباشر تفيد النقل من بلد المنشأ إلى بلد المقصد دون وسيط غير عربي'
          ]
        : [
            'المطلوب زيادة نسبة المكونات أو مدخلات الإنتاج المشتراة من دول عربية بمقدار ' + (requiredThreshold - arabValuePct).toFixed(1) + '% للوصول إلى عتبة الإعفاء 40%.'
          ];

      const advisoryNote = isCompliant
        ? `المنتج يحقق نسبة قيمة مضافة عربية تبلغ ${arabValuePct}%، وهي أعلى من الحد الأدنى المشترط (40%). يمنح ذلك المستورد في ${impProfile.name_ar} إعفاءً جمركياً تاماً وتوفيراً قدره ${estimatedSavings.toLocaleString()} دولار أمريكي لكل شحنة بقيمة ${validExWorksPrice.toLocaleString()} دولار.`
        : `تبلغ نسبة القيمة المضافة الحالية ${arabValuePct}%. لتفادي سداد رسوم جمركية قدرها ${standardDutyPct}%، يُنصح باستبدال جزء من المواد الخام المستوردة من خارج المنطقة بمدخلات إنتاج مصنعة في دول عربية أعضاء باتفاقية GAFTA.`;

      const resultPayload: PanArabRulesOfOriginResult = {
        product_name_ar,
        exporting_country_ar: expProfile.name_ar,
        importing_country_ar: impProfile.name_ar,
        ex_works_price_usd: validExWorksPrice,
        total_arab_value_added_usd: totalArabValueAdded,
        arab_value_added_percentage: arabValuePct,
        gafta_threshold_required_pct: requiredThreshold,
        is_gafta_compliant: isCompliant,
        tariff_exemption_verdict_ar: verdictAr,
        estimated_duty_savings_usd: estimatedSavings,
        standard_customs_duty_without_gafta_pct: standardDutyPct,
        required_certificates_ar: certificates,
        regulatory_advisory_note_ar: advisoryNote
      };

      res.json({
        ok: true,
        success: true,
        data: resultPayload
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to calculate rules of origin' });
    }
  });

  // ==========================================================================
  // PHASE 9: DIGITAL PASSPORT, B2B MATCHMAKING & STRATEGY CO-PILOT
  // ==========================================================================

  // B2B Matchmaker Directory
  const PAN_ARAB_MATCHMAKER_DIRECTORY: PanArabMatchmakerListing[] = [
    {
      id: 'b2b_medtech_cairo_riyadh',
      entity_name_ar: 'الشركة العربية للصناعات الطبية المتقدمة (فارما تك)',
      country_code: 'EG',
      country_name_ar: 'مصر',
      flag: '🇪🇬',
      sector_ar: 'الصناعات الطبية والرعاية الصحية',
      partnership_type: 'توريد وتوزيع إقليمي',
      ticket_size_usd: 5000000,
      value_proposition_ar: 'مصنع حاصل على اعتمادات CE وISO ينتج مستلزمات طبية وجراحية دقيقة بنسبة قيمة مضافة عربية 68% معفاة جمركياً.',
      gafta_certified: true,
      looking_for_ar: 'وكيل وموزع استراتيجي وشريك سلاسل إمداد في السعودية والإمارات والكويت للمشتريات الصحية الحكومية والخاصة.',
      target_partner_countries: ['SA', 'AE', 'KW', 'QA'],
      contact_channel_ar: 'المنسق الإقليمي لدرب: match-eg-med@darb-panarab.org'
    },
    {
      id: 'b2b_agritech_jordan_saudi',
      entity_name_ar: 'شركة التقنيات المائية والزراعة العمودية (أكوا هيدرو)',
      country_code: 'JO',
      country_name_ar: 'الأردن',
      flag: '🇯🇴',
      sector_ar: 'التكنولوجيا الزراعية والأمن الغذائي',
      partnership_type: 'شراكة تقنية وتوطين صناعي',
      ticket_size_usd: 8500000,
      value_proposition_ar: 'أنظمة زراعة مائية موفرة بنسبة 90% للمياه، مجربة في البيئات الصحراوية الجافة مع برمجيات إنترنت الأشياء والذكاء الاصطناعي.',
      gafta_certified: true,
      looking_for_ar: 'مستثمر زراعي وصناديق رأس مال جريء ومزارع تجارية كبرى في السعودية ومصر لتأسيس مزارع ذكية مشتركة.',
      target_partner_countries: ['SA', 'EG', 'OM', 'AE'],
      contact_channel_ar: 'وحدة الصفقات: match-jo-agro@darb-panarab.org'
    },
    {
      id: 'b2b_logistics_dubai_suez',
      entity_name_ar: 'مجموعة الممرات اللوجستية والشحن المبرد (ترانس أراب)',
      country_code: 'AE',
      country_name_ar: 'الإمارات',
      flag: '🇦🇪',
      sector_ar: 'النقل واللوجستيات وسلاسل الإمداد',
      partnership_type: 'استحواذ واندماج مشترك',
      ticket_size_usd: 25000000,
      value_proposition_ar: 'شبكة مستودعات مبردة وأسطول نقل بري وبحري يربط جبل علي والرياض وميناء العين السخنة برخص تشغيل موحدة.',
      gafta_certified: true,
      looking_for_ar: 'شريك تخزين لوجستي في مصر والأردن والمغرب لتوسيع خط الربط التكاملي بين الخليج وشمال إفريقيا.',
      target_partner_countries: ['EG', 'JO', 'MA', 'SA'],
      contact_channel_ar: 'قطاع الاستثمار: match-ae-logistics@darb-panarab.org'
    },
    {
      id: 'b2b_fintech_bahrain_kuwait',
      entity_name_ar: 'منصة تسوية المدفوعات والتجارة البينية (سداد أرابيا)',
      country_code: 'BH',
      country_name_ar: 'البحرين',
      flag: '🇧🇭',
      sector_ar: 'التكنولوجيا المالية والاقتصاد الرقمي',
      partnership_type: 'طلب رأس مال وشريك استثماري',
      ticket_size_usd: 12000000,
      value_proposition_ar: 'بنية تحتية للمدفوعات الرقمية مرخصة من مصرف البحرين المركزي تتيح تسوية المعاملات التجارية بين الشركات العربية بالعملات المحلية.',
      gafta_certified: false,
      looking_for_ar: 'صناديق استثمار جريء ومؤسسات بنكية في السعودية والإمارات ومصر لتسريع التوسع الإقليمي.',
      target_partner_countries: ['SA', 'AE', 'EG', 'KW'],
      contact_channel_ar: 'إدارة الاستثمار الجريء: match-bh-fintech@darb-panarab.org'
    },
    {
      id: 'b2b_cleantech_morocco_gulf',
      entity_name_ar: 'مؤسسة أطلس للألواح والهيدروجين النظيف',
      country_code: 'MA',
      country_name_ar: 'المغرب',
      flag: '🇲🇦',
      sector_ar: 'الطاقة النظيفة والتصنيع الأخضر',
      partnership_type: 'شراكة تقنية وتوطين صناعي',
      ticket_size_usd: 35000000,
      value_proposition_ar: 'خبرات مجمع نور ورزازات ومصانع الألواح الكهروضوئية وهياكل الألمنيوم المقاومة للتآكل البحري والصحراوي.',
      gafta_certified: true,
      looking_for_ar: 'صناديق طاقة سيادية وشركات تطوير بنية تحتية في السعودية والإمارات وعُمان لمشاريع الطاقة الشمسية العملاقة.',
      target_partner_countries: ['SA', 'AE', 'OM', 'EG'],
      contact_channel_ar: 'مكتب التحالفات الخضراء: match-ma-green@darb-panarab.org'
    },
    {
      id: 'b2b_petrochem_saudi_oman',
      entity_name_ar: 'شركة البوليمرات والمواد المركبة المتقدمة',
      country_code: 'SA',
      country_name_ar: 'السعودية',
      flag: '🇸🇦',
      sector_ar: 'الصناعات البتروكيماوية والتحويلية',
      partnership_type: 'توريد وتوزيع إقليمي',
      ticket_size_usd: 18000000,
      value_proposition_ar: 'توريد مواد خام بلاستيكية متقدمة وبوليمرات هندسية لمصانع السيارات والأجهزة المنزلية بأسعار تفضيلية للمصانع العربية.',
      gafta_certified: true,
      looking_for_ar: 'مصانع تجميع سيارات وأجهزة كهربائية وشركات تعبئة صناعية في المغرب ومصر وتونس والجزائر.',
      target_partner_countries: ['MA', 'EG', 'TN', 'DZ'],
      contact_channel_ar: 'التجارة البينية: match-sa-poly@darb-panarab.org'
    }
  ];

  // Endpoint 31: Generate/Get Pan-Arab Digital Passport Credential
  app.get('/api/countries/analytics/digital-passport/template', (req: Request, res: Response) => {
    try {
      const tierParam = (req.query.tier as string) || 'مستثمر استراتيجي سيادي';
      const nameParam = (req.query.name as string) || 'عبدالعزيز الشريف';
      const originParam = (req.query.origin as string) || 'SA';
      const targetParam = (req.query.targets as string) || 'EG,AE,JO,MA';

      const originProfile = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[originParam.toUpperCase()] || COMPREHENSIVE_ARAB_COUNTRIES_PROFILES['SA'];
      const targetsList = targetParam.split(',').map(s => s.trim().toUpperCase());

      const validTiers = [
        'مستثمر استراتيجي سيادي',
        'رائد أعمال واقتصاد رقمي',
        'كفاءة مهنية ومهارات متقدمة',
        'تاجر ومورّد إقليمي'
      ] as const;

      const matchedTier = validTiers.find(t => t === tierParam) || 'مستثمر استراتيجي سيادي';

      const passportId = `DARB-${originParam}-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;
      const issueDate = new Date().toISOString().split('T')[0];
      const validUntil = new Date(Date.now() + 365 * 24 * 3600 * 1000 * 3).toISOString().split('T')[0];

      const privileges = [
        {
          code: 'PRIV_GAFTA_FAST_TRACK',
          title_ar: 'المسار الأخضر للتخليص الجمركي الفوري (GAFTA 0%)',
          description_ar: 'تخليص الشحنات الصناعية والزراعية ذات المنشأ العربي المطابق (40%+) خلال 4 ساعات مع الإعفاء الكامل من الرسوم الجمركية.',
          authority_ar: 'الأمانة العامة لجامعة الدول العربية والجمارك المشتركة',
          is_active: true
        },
        {
          code: 'PRIV_FREE_ZONE_EXEMPTION',
          title_ar: 'الإعفاء الضريبي للمناطق الاقتصادية والحرة',
          description_ar: 'ملكية أجنبية 100% وإعفاء من ضرائب الدخل والشركات بنسبة 0% في أكثر من 40 منطقة حرة عربية مسجلة.',
          authority_ar: 'اتحاد هيئات الاستثمار والمناطق الحرة العربية',
          is_active: true
        },
        {
          code: 'PRIV_GOLDEN_RESIDENCY',
          title_ar: 'مسار تأشيرة المستثمر والإقامة الذهبية الميسرة',
          description_ar: 'معاملة تفضيلية لإصدار إقامات المستثمرين ورواد الأعمال والكفاءات الاستثنائية لمدة 5 إلى 10 سنوات قابلة للتجديد.',
          authority_ar: 'إدارات الهجرة والجوازات وشؤون الأجانب',
          is_active: matchedTier === 'مستثمر استراتيجي سيادي' || matchedTier === 'رائد أعمال واقتصاد رقمي'
        },
        {
          code: 'PRIV_MUTUAL_LICENSE',
          title_ar: 'الاعتراف المتبادل بالتراخيص والاعتمادات المهنية',
          description_ar: 'معادلة فورية للرخص الهندسية والطبية والمالية لممارسة النشاط في الدول الشريكة دون اشتراط إعادة الاختبارات الوطنية.',
          authority_ar: 'المجلس الاقتصادي والاجتماعي العربي واتحادات النقابات',
          is_active: true
        },
        {
          code: 'PRIV_CROSS_BORDER_BANKING',
          title_ar: 'فتح الحسابات البنكية الاستثمارية والتسوية اللحظية (AFAQ)',
          description_ar: 'إجراءات اعرف عميلك (KYC) الرقمية الموحدة لفتح الحسابات التجارية والتسوية عبر نظام آفاق الخليجي وشبكة البنوك العربية.',
          authority_ar: 'اتحاد المصارف العربية والبنوك المركزية',
          is_active: true
        }
      ];

      const passport: PanArabDigitalPassport = {
        passport_id: passportId,
        holder_name: nameParam,
        credential_tier: matchedTier,
        primary_citizenship: originProfile.name_ar,
        target_operating_countries: targetsList,
        issue_date: issueDate,
        valid_until: validUntil,
        verified_privileges: privileges,
        compliance_rating: 98.6,
        digital_seal_hash: `SHA256:${Buffer.from(`${passportId}:${nameParam}:${issueDate}`).toString('base64').substring(0, 24)}`,
        qr_payload: `https://darb-panarab.app/verify/credential?id=${passportId}&holder=${encodeURIComponent(nameParam)}&tier=${encodeURIComponent(matchedTier)}&origin=${originParam}`
      };

      res.json({
        ok: true,
        success: true,
        data: passport
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to generate digital passport' });
    }
  });

  // Endpoint 32: B2B Matchmaker Directory
  app.get('/api/countries/analytics/b2b-matchmaker/listings', (_req: Request, res: Response) => {
    try {
      res.json({
        ok: true,
        success: true,
        total_count: PAN_ARAB_MATCHMAKER_DIRECTORY.length,
        data: PAN_ARAB_MATCHMAKER_DIRECTORY
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch matchmaker listings' });
    }
  });

  // Endpoint 33: B2B Matchmaker Engine (Compute Score)
  app.post('/api/countries/analytics/b2b-matchmaker/match', (req: Request, res: Response) => {
    try {
      const {
        applicant_sector = 'الرعاية الصحية',
        applicant_country = 'SA',
        desired_partnership_type = 'توريد وتوزيع إقليمي',
        investment_budget_usd = 10000000
      } = req.body;

      const scoredListings = PAN_ARAB_MATCHMAKER_DIRECTORY.map(item => {
        let score = 60; // base score

        // Sector synergy match
        if (item.sector_ar.includes(applicant_sector) || applicant_sector.includes(item.sector_ar)) {
          score += 25;
        }

        // Cross-border complement (different country increases cross-border trade score)
        if (item.country_code !== applicant_country) {
          score += 10;
        }

        // Target partner countries contains applicant country
        if (item.target_partner_countries.includes(applicant_country)) {
          score += 15;
        }

        // Partnership type match
        if (item.partnership_type === desired_partnership_type) {
          score += 10;
        }

        // Budget alignment
        if (investment_budget_usd >= item.ticket_size_usd * 0.5 && investment_budget_usd <= item.ticket_size_usd * 2.5) {
          score += 10;
        }

        const normalizedScore = Math.min(Math.max(score, 45), 98);

        return {
          ...item,
          match_score_pct: normalizedScore,
          synergy_summary_ar: `تكامل عالي بنسبة ${normalizedScore}% مع السوق المستهدف في ${item.country_name_ar} مع إمكانية استغلال مسار الإعفاء الجمركي (GAFTA) والتوسع المشترك.`
        };
      }).sort((a, b) => b.match_score_pct - a.match_score_pct);

      res.json({
        ok: true,
        success: true,
        matches_found: scoredListings.length,
        data: scoredListings
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to compute matches' });
    }
  });

  // Endpoint 34: DARB Pan-Arab Strategy Co-Pilot Knowledge Engine
  app.post('/api/countries/analytics/strategy-copilot', (req: Request, res: Response) => {
    try {
      const {
        user_query = '',
        context_country = 'SA',
        user_role = 'investor'
      }: PanArabStrategyCopilotRequest = req.body;

      const lowerQ = user_query.toLowerCase();

      let answerMarkdown = '';
      let recommendations: string[] = [];
      let relevantCountries: string[] = [context_country];
      let relevantTools: { title_ar: string; tab_id: string; subtab_id?: string }[] = [];

      if (lowerQ.includes('جافتا') || lowerQ.includes('gafta') || lowerQ.includes('منشأ') || lowerQ.includes('جمارك') || lowerQ.includes('إعفاء')) {
        answerMarkdown = `### التحليل الاستراتيجي لاتفاقية تيسير وتنمية التبادل التجاري العربي (GAFTA):
- **شرط الإعفاء الجمركي الكامل (0% جمارك)**: يتطلب تحقيق نسبة قيمة مضافة عربية لا تقل عن **40%** من سعر باب المصنع (Ex-Works).
- **العناصر المحتسبة في القيمة المضافة**:
  1. تكلفة المواد الخام ومدخلات الإنتاج المشتراة من دول عربية أعضاء.
  2. أجور العمالة المحلية المباشرة والتأمينات الاجتماعية.
  3. استهلاك الطاقة وتكاليف التشغيل الصناعي غير المباشرة (Factory Overhead).
- **المستندات الإلزامية**: شهادة المنشأ العربية الموحدة مصدقة، الفاتورة الأصلية المتضمنة إقرار المنشأ، وبوليصة الشحن المباشر دون وسيط غير عربي.`;

        recommendations = [
          'استخدم حاسبة ومحاكي قواعد المنشأ في درب للتحقق من بلوغ نسبة الـ 40% وحساب الوفر بالدولار.',
          'استبدل المكونات المستوردة من آسيا بموردين من المغرب أو مصر أو الخليج لرفع نسبة المنشأ العربي.',
          'سجل شركتك في المسار الجمركي الأخضر لتقليص وقت الفحص في المنافذ البرية والبحرية.'
        ];
        relevantCountries = ['SA', 'EG', 'JO', 'AE'];
        relevantTools = [
          { title_ar: 'محاكي قواعد المنشأ جافتا', tab_id: 'common_market', subtab_id: 'rules_of_origin' },
          { title_ar: 'الممرات والموانئ الاستراتيجية', tab_id: 'trade' }
        ];
      } else if (lowerQ.includes('مقر') || lowerQ.includes('rhq') || lowerQ.includes('منطقة حرة') || lowerQ.includes('تأسيس') || lowerQ.includes('ضرائب')) {
        answerMarkdown = `### التحليل المقارن للمقرات الإقليمية (RHQ) والمناطق الحرة العربية:
- **المملكة العربية السعودية (برنامج RHQ)**: يمنح حوافز ضريبية غير مسبوقة لمدة 30 عاماً (0% ضريبة شركات و0% ضريبة استقطاع على أنشطة المقر) وأولوية الترسية في المشاريع الحكومية.
- **دولة الإمارات العربية المتحدة (DIFC / ADGM / كيدز)**: بنية تشريعية خاضعة للقانون الإنجليزي العام (Common Law)، ملكية 100%، وسهولة تامة في تملك الأصول وحركة رؤوس الأموال.
- **المنطقة الاقتصادية لقناة السويس (SCZone بمصر)**: موقع عبقري يربط آسيا بأوروبا مع حوافز استثمارية نقدية تصل إلى 50% من التكلفة الاستثمارية للمشاريع الخضراء والصناعية.`;

        recommendations = [
          'إذا كان هدفك العقود الحكومية الكبرى في الخليج: اختر الرياض مقراً إقليمياً.',
          'إذا كان هدفك التمويل والاستثمار الجريء والتقنية: اختر مركز دبي المالي أو أبوظبي العالمي.',
          'إذا كان هدفك التصنيع التصديري لأوروبا وإفريقيا: اختر المنطقة الاقتصادية لقناة السويس أو طنجة المتوسط.'
        ];
        relevantCountries = ['SA', 'AE', 'EG', 'MA'];
        relevantTools = [
          { title_ar: 'دليل المناطق الاقتصادية والحرة', tab_id: 'free_zones' },
          { title_ar: 'أطلس الصناديق السيادية والمشاريع', tab_id: 'sovereign' }
        ];
      } else if (lowerQ.includes('تحويل') || lowerQ.includes('عملة') || lowerQ.includes('مصرف') || lowerQ.includes('بنك') || lowerQ.includes('سداد')) {
        answerMarkdown = `### خارطة المدفوعات والتحويلات المالية البينية العربية:
- **نظام آفاق (AFAQ)**: نظام التحويل الفوري الإقليمي الذي يربط البنوك المركزية الخليجية، ويوفر تسويات آنية للريال السعودي والدرهم الإماراتي والدينار الكويتي والبحريني والريال العماني والقطري بتكلفة منخفضة.
- **شبكة إنستاباي (InstaPay Egypt)**: أسرع قناة تحويل مباشر بالجنيه المصري للمغتربين مع ربط مباشر بحسابات بنوك الخليج عبر التطبيقات المصرفية المعتمدة.
- **منصة بُنى (Buna)**: المنصة العربية للمدفوعات التابعة لصندوق النقد العربي لدعم المقاصة بالعملات العربية والعملات الدولية.`;

        recommendations = [
          'استخدم القنوات المصرفية الرسمية لتفادي فروق أسعار الصرف غير الرسمية وتأمين الموقف الضريبي.',
          'فعل بطاقة المستثمر الرقمية من درب للاستفادة من تسريع فتح الحسابات المصرفية العابرة للحدود.'
        ];
        relevantCountries = ['SA', 'AE', 'EG', 'KW', 'BH'];
        relevantTools = [
          { title_ar: 'حاسبة العملات والتحويل المالي المباشر', tab_id: 'budget', subtab_id: 'converter' },
          { title_ar: 'تنقل الكفاءات والتحويلات', tab_id: 'labor' }
        ];
      } else {
        answerMarkdown = `### الخلاصة الاستشارية الاستراتيجية لمنظومة دَرْب (DARB Strategy Synthesis):
- استناداً إلى قاعدة بيانات دَرْب الشاملة لـ **22 دولة عربية** و**40+ منطقة اقتصادية حرة** واستثمارات تتجاوز **3.2 تريليون دولار** في الصناديق السيادية والمشاريع العملاقة:
- توفر البيئة الاستثمارية العربية الحالية تكاملاً غير مسبوق يجمع بين وفرة رأس المال السيادي في الخليج، الكوادر البشرية والقدرات التصنيعية في مصر والأردن، والموقع اللوجستي والموارد التعدينية في المغرب العربي.
- نوصي بالاستفادة من ميزات **السوق العربية المشتركة (المرحلة 8)** وبنك الصفقات المشتركة، مع تفعيل **جواز سفر المستثمر والمغترب الرقمي (المرحلة 9)** لضمان الاستفادة من كافة الإعفاءات التنظيمية والمسارات الجمركية الخضراء.`;

        recommendations = [
          'تحديد مسار الاستثمار المناسب عبر محاكي قرارات الاستثمار الاستراتيجي.',
          'استعراض الصفقات المطروحة للاكتتاب في بنك الاستثمار المشترك.',
          'استخراج جواز سفر درب الرقمي وتوثيق الحوافز الاستثمارية المتاحة لشركتك.'
        ];
        relevantCountries = ['SA', 'AE', 'EG', 'MA', 'JO'];
        relevantTools = [
          { title_ar: 'السوق المشتركة والتكامل الصناعي', tab_id: 'common_market' },
          { title_ar: 'مركز المذكرات التنفيذية', tab_id: 'briefing' }
        ];
      }

      const responsePayload: PanArabStrategyCopilotResponse = {
        answer_markdown: answerMarkdown,
        strategic_recommendations: recommendations,
        relevant_country_codes: relevantCountries,
        relevant_tools: relevantTools,
        confidence_score: 96.4
      };

      res.json({
        ok: true,
        success: true,
        data: responsePayload
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to process strategic copilot query' });
    }
  });

  // ==========================================================================
  // PHASE 10: POWER GRID, DIGITAL SETTLEMENT & SOVEREIGN IMPACT SIMULATOR
  // ==========================================================================

  const PAN_ARAB_POWER_GRID_PROJECTS: PanArabPowerGridProject[] = [
    {
      project_id: 'grid_saudi_egypt_hvdc',
      project_name_ar: 'مشروع الربط الكهربائي السعودي المصري العملاق (3,000 ميجاوات)',
      participating_countries: [
        { country_code: 'SA', name_ar: 'السعودية', flag: '🇸🇦' },
        { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬' }
      ],
      voltage_kv: 500,
      transmission_capacity_mw: 3000,
      technology_type: 'تيار مستمر فائق الجهد (HVDC)',
      total_investment_usd_million: 1800,
      status_ar: 'قيد التنفيذ الإنشائي المتقدم',
      peak_offset_benefit_ar: 'استغلال تباين ساعات الذروة بين البلدين (ذروة مصر المسائية وذروة السعودية بعد الظهر)، مما يوفر استثمارات بناء محطات توليد جديدة بقيمة تتجاوز 2.5 مليار دولار.',
      clean_energy_share_pct: 45,
      key_substations_ar: ['محطة تحويل بدر (مصر)', 'محطة تحويل طبرجل (السعودية)', 'محطة تحويل شرق المدينة المنورة']
    },
    {
      project_id: 'grid_gccia_regional',
      project_name_ar: 'شبكة الربط الكهربائي لدول مجلس التعاون الخليجي (GCCIA Backbone)',
      participating_countries: [
        { country_code: 'SA', name_ar: 'السعودية', flag: '🇸🇦' },
        { country_code: 'AE', name_ar: 'الإمارات', flag: '🇦🇪' },
        { country_code: 'KW', name_ar: 'الكويت', flag: '🇰🇼' },
        { country_code: 'QA', name_ar: 'قطر', flag: '🇶🇦' },
        { country_code: 'BH', name_ar: 'البحرين', flag: '🇧🇭' },
        { country_code: 'OM', name_ar: 'عُمان', flag: '🇴🇲' }
      ],
      voltage_kv: 400,
      transmission_capacity_mw: 5000,
      technology_type: 'ربط تيار متردد متزامن (AC)',
      total_investment_usd_million: 1400,
      status_ar: 'قيد التشغيل والتبادل التجاري',
      peak_offset_benefit_ar: 'تحقيق وفورات تراكمية تجاوزت 3.3 مليار دولار منذ التدشين ومنع أكثر من 2,500 حالة انقطاع طاقة عبر الدعم اللحظي الفوري للشبكات الخليجية.',
      clean_energy_share_pct: 32,
      key_substations_ar: ['محطة الفشخ (البحرين)', 'محطة السلع (الإمارات)', 'محطة غونان (السعودية)']
    },
    {
      project_id: 'grid_maghreb_clean_corridor',
      project_name_ar: 'الممر الكهربائي المغاربي والمحور الأورومتوسطي للطاقة النظيفة',
      participating_countries: [
        { country_code: 'MA', name_ar: 'المغرب', flag: '🇲🇦' },
        { country_code: 'DZ', name_ar: 'الجزائر', flag: '🇩🇿' },
        { country_code: 'TN', name_ar: 'تونس', flag: '🇹🇳' }
      ],
      voltage_kv: 400,
      transmission_capacity_mw: 2800,
      technology_type: 'كابلات بحرية متعددة الدوائر',
      total_investment_usd_million: 2100,
      status_ar: 'قيد التشغيل والتبادل التجاري',
      peak_offset_benefit_ar: 'تصدير فوائض الطاقة الشمسية وطاقة الرياح من مجمعات ورزازات وميدلت إلى الشبكات الإقليمية وتأمين استقرار إمدادات المغرب العربي.',
      clean_energy_share_pct: 58,
      key_substations_ar: ['محطة فرديوة (طنجة)', 'محطة الحجار (الجزائر)', 'محطة المورناقية (تونس)']
    },
    {
      project_id: 'grid_iraq_gcc_jordan',
      project_name_ar: 'مشروع ربط شبكة العراق مع شبكة الربط الخليجي والأردن',
      participating_countries: [
        { country_code: 'IQ', name_ar: 'العراق', flag: '🇮🇶' },
        { country_code: 'SA', name_ar: 'السعودية', flag: '🇸🇦' },
        { country_code: 'KW', name_ar: 'الكويت', flag: '🇰🇼' },
        { country_code: 'JO', name_ar: 'الأردن', flag: '🇯🇴' }
      ],
      voltage_kv: 400,
      transmission_capacity_mw: 1500,
      technology_type: 'ربط تيار متردد متزامن (AC)',
      total_investment_usd_million: 850,
      status_ar: 'مرحلة الربط التوسعي والتجارب التشغيلية',
      peak_offset_benefit_ar: 'إنهاء العجز الكهربائي في جنوب ووسط العراق وتوفير 1,500 ميجاوات من الشبكة الخليجية الموحدة ومحطة الريشة الأردنية بأسعار تنافسية.',
      clean_energy_share_pct: 28,
      key_substations_ar: ['محطة الفاو (العراق)', 'محطة الوفرة (الكويت)', 'محطة الريشة (الأردن)']
    },
    {
      project_id: 'grid_green_hydrogen_backbone',
      project_name_ar: 'الشبكة العربية الموحدة لتصدير الهيدروجين الأخضر والأمونيا النظيفة',
      participating_countries: [
        { country_code: 'SA', name_ar: 'السعودية', flag: '🇸🇦' },
        { country_code: 'AE', name_ar: 'الإمارات', flag: '🇦🇪' },
        { country_code: 'OM', name_ar: 'عُمان', flag: '🇴🇲' },
        { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬' },
        { country_code: 'MA', name_ar: 'المغرب', flag: '🇲🇦' }
      ],
      voltage_kv: 0,
      transmission_capacity_mw: 8500,
      technology_type: 'تيار مستمر فائق الجهد (HVDC)',
      total_investment_usd_million: 4500,
      status_ar: 'مرحلة الربط التوسعي والتجارب التشغيلية',
      peak_offset_benefit_ar: 'بنية تحتية موحدة لأنابيب الهيدروجين والموانئ المبردة لتمكين العالم العربي من السيطرة على 35% من تجارة الوقود النظيف العالمية بحلول عام 2035.',
      clean_energy_share_pct: 100,
      key_substations_ar: ['مجمع نيوم للهيدروجين الأخضر', 'ميناء السخنة الأخضر', 'مجمع الدقم للهيدروجين', 'ميناء الفجيرة']
    }
  ];

  const PAN_ARAB_DIGITAL_SETTLEMENT_CHANNELS: PanArabDigitalSettlementChannel[] = [
    {
      system_id: 'settle_buna',
      system_name_ar: 'منصة "بُنى" للمدفوعات العربية (Buna Payment System)',
      operator_ar: 'المؤسسة الإقليمية لمقاصة وتسويه المدفوعات العربية (صندوق النقد العربي)',
      governance_model: 'منصة تسوية عربية مركزية متوافقة مع معايير الامتثال الدولية ومكافحة غسل الأموال',
      supported_currencies: ['SAR (الريال السعودي)', 'AED (الدرهم الإماراتي)', 'EGP (الجنيه المصري)', 'JOD (الدينار الأردني)', 'USD (الدولار)', 'EUR (اليورو)'],
      average_settlement_speed_seconds: 15,
      cost_saving_vs_swift_pct: 75,
      daily_volume_usd_million: 450,
      participating_central_banks: ['البنك المركزي السعودي', 'مصرف الإمارات المركزي', 'البنك المركزي المصري', 'البنك المركزي الأردني', 'بنك المغرب'],
      use_cases_ar: [
        'تسوية الصادرات والواردات البينية بالعملات العربية دون وساطة البنوك المراسلة الأمريكية',
        'حوالات المغتربين والعمالة العربية بدون رسوم اقتطاع وسيطة',
        'التمويل التجاري والاعتمادات المستندية الفورية بين المصارف العربية'
      ]
    },
    {
      system_id: 'settle_mbridge',
      system_name_ar: 'مشروع "إم بريدج" للعملات الرقمية للبنوك المركزية (Project mBridge CBDC)',
      operator_ar: 'بنك التسويات الدولية (BIS) بمشاركة البنك المركزي السعودي ومصرف الإمارات المركزي',
      governance_model: 'سلسلة كتل موزعة (Distributed Ledger Technology - DLT) للتسوية اللحظية للعملات الرقمية',
      supported_currencies: ['e-SAR (الريال الرقمي)', 'e-AED (الدرهم الرقمي)', 'e-HKD', 'e-CNY'],
      average_settlement_speed_seconds: 4,
      cost_saving_vs_swift_pct: 90,
      daily_volume_usd_million: 1200,
      participating_central_banks: ['البنك المركزي السعودي (SAMA)', 'مصرف الإمارات المركزي (CBUAE)', 'بنك الشعب الصيني', 'سلطة النقد في هونغ كونغ'],
      use_cases_ar: [
        'تسوية عقود الطاقة والتجارة النفطية والصناعية الكبرى في ثوانٍ معدودة',
        'القضاء التام على مخاطر أسعار الصرف (FX Settlement Risk)',
        'توفير السيولة اللحظية لتمويل المشاريع الاستثمارية والسيادية الكبرى'
      ]
    },
    {
      system_id: 'settle_afaq',
      system_name_ar: 'نظام "آفاق" للمدفوعات الخليجية (AFAQ GCC RTGS)',
      operator_ar: 'شركة المدفوعات الخليجية (مجلس التعاون لدول الخليج العربية)',
      governance_model: 'نظام تسوية إجمالية آنية (RTGS) يربط البنوك المركزية لدول مجلس التعاون',
      supported_currencies: ['SAR', 'AED', 'KWD', 'BHD', 'OMR', 'QAR'],
      average_settlement_speed_seconds: 30,
      cost_saving_vs_swift_pct: 85,
      daily_volume_usd_million: 2800,
      participating_central_banks: ['البنك المركزي السعودي', 'مصرف الإمارات المركزي', 'بنك الكويت المركزي', 'مصرف قطر المركزي', 'مصرف البحرين المركزي', 'البنك المركزي العماني'],
      use_cases_ar: [
        'تسوية التعاملات المالية الحكومية والاستثمارية الخليجية المشتركة بالعملات الوطنية',
        'التحويل البنكي الفوري المباشر للأفراد والشركات برسوم رمزية ثابتة',
        'دعم الاستثمارات الخليجية المتبادلة في الأسواق المالية والعقارية'
      ]
    }
  ];

  // Endpoint 35: Pan-Arab Power Grid & Green Energy Projects
  app.get('/api/countries/analytics/power-grid-projects', (_req: Request, res: Response) => {
    try {
      res.json({
        ok: true,
        success: true,
        total_projects: PAN_ARAB_POWER_GRID_PROJECTS.length,
        total_capacity_mw: PAN_ARAB_POWER_GRID_PROJECTS.reduce((acc, p) => acc + p.transmission_capacity_mw, 0),
        data: PAN_ARAB_POWER_GRID_PROJECTS
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch power grid projects' });
    }
  });

  // Endpoint 36: Pan-Arab Digital Settlement Channels (Buna / mBridge / AFAQ)
  app.get('/api/countries/analytics/digital-settlement-channels', (_req: Request, res: Response) => {
    try {
      res.json({
        ok: true,
        success: true,
        total_systems: PAN_ARAB_DIGITAL_SETTLEMENT_CHANNELS.length,
        data: PAN_ARAB_DIGITAL_SETTLEMENT_CHANNELS
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch digital settlement channels' });
    }
  });

  // Endpoint 37: Pan-Arab Comprehensive Sovereign Impact & ROI Simulator
  app.post('/api/countries/analytics/sovereign-impact/calculate', (req: Request, res: Response) => {
    try {
      const {
        origin_country = 'SA',
        partner_countries = ['EG', 'AE', 'JO'],
        sector = 'الصناعات التحويلية والطاقة النظيفة',
        investment_ticket_usd = 20000000,
        annual_trade_volume_usd = 15000000,
        utilize_gafta_exemption = true,
        utilize_free_zones = true,
        utilize_digital_settlement = true,
        utilize_power_grid_benefits = true
      }: PanArabSovereignImpactInput = req.body;

      const originProfile = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[origin_country.toUpperCase()] || COMPREHENSIVE_ARAB_COUNTRIES_PROFILES['SA'];
      const partnersListAr = partner_countries.map(c => COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[c.toUpperCase()]?.name_ar || c);

      // Calculations:
      // 1. Customs Savings (GAFTA 0% vs standard 8-12%)
      const standardCustomsRate = 0.085;
      const customsSavings = utilize_gafta_exemption ? Math.round(annual_trade_volume_usd * standardCustomsRate) : 0;

      // 2. Tax Incentive Savings (SEZs 0% vs 20% corporate tax)
      const estimatedAnnualProfit = investment_ticket_usd * 0.16;
      const taxSavings = utilize_free_zones ? Math.round(estimatedAnnualProfit * 0.20) : 0;

      // 3. Digital Settlement Cost Savings (Buna/AFAQ 0.2% vs SWIFT 3.0%)
      const digitalSavings = utilize_digital_settlement ? Math.round(annual_trade_volume_usd * 0.028) : 0;

      // 4. Energy Efficiency & Grid load benefits (average 3.5% of investment operating costs)
      const energySavings = utilize_power_grid_benefits ? Math.round(investment_ticket_usd * 0.035) : 0;

      const totalAnnualSavings = customsSavings + taxSavings + digitalSavings + energySavings;

      // 5-Year Cumulative Net Economic Value:
      const fiveYearCumulativeSavings = totalAnnualSavings * 5;
      const fiveYearOperatingProfits = estimatedAnnualProfit * 5;
      const net5YrEconomicValue = Math.round(fiveYearCumulativeSavings + fiveYearOperatingProfits);

      const projectedRoiPct = Math.round(((net5YrEconomicValue) / investment_ticket_usd) * 100);

      // Estimated Direct High-Skill Jobs Created (e.g. ~$90k capital per industrial tech job)
      const jobsCreated = Math.max(Math.round(investment_ticket_usd / 95000), 25);

      let synergyGrade: 'AAA+ تكامل سيادي فائق' | 'AA+ شراكة استراتيجية كبرى' | 'A تكامل عالي الجدوى' = 'A تكامل عالي الجدوى';
      if (projectedRoiPct >= 120 && partner_countries.length >= 3) {
        synergyGrade = 'AAA+ تكامل سيادي فائق';
      } else if (projectedRoiPct >= 80) {
        synergyGrade = 'AA+ شراكة استراتيجية كبرى';
      }

      const takeawayAr = `يحقق هذا المشروع المشترك بين ${originProfile.name_ar} والشركاء في (${partnersListAr.join('، ')}) وفورات تشغيلية سنوية تقدر بـ $${(totalAnnualSavings / 1000000).toFixed(2)} مليون دولار بفضل الجمع بين مسار الإعفاء الجمركي (GAFTA)، والتسوية اللحظية بالعملات المحلية عبر بُنى وآفاق، مع توفير قرابة ${jobsCreated} فرصة عمل نوعية خلال الدورة الاستثمارية الأولى.`;

      const resultPayload: PanArabSovereignImpactResult = {
        origin_country_ar: originProfile.name_ar,
        partner_countries_ar: partnersListAr,
        sector_ar: sector,
        total_investment_usd: investment_ticket_usd,
        annual_trade_volume_usd: annual_trade_volume_usd,
        customs_savings_usd: customsSavings,
        tax_incentive_savings_usd: taxSavings,
        digital_settlement_savings_usd: digitalSavings,
        energy_grid_savings_usd: energySavings,
        total_annual_cost_savings_usd: totalAnnualSavings,
        projected_5yr_roi_pct: projectedRoiPct,
        net_5yr_economic_value_usd: net5YrEconomicValue,
        direct_jobs_created: jobsCreated,
        strategic_synergy_grade: synergyGrade,
        strategic_takeaway_ar: takeawayAr
      };

      res.json({
        ok: true,
        success: true,
        data: resultPayload
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to calculate sovereign impact' });
    }
  });

  // ==========================================================================
  // PHASE 11: REAL-TIME WAR ROOM, MARITIME CHOKEPOINT TRACKER & COMMODITIES
  // ==========================================================================

  const PAN_ARAB_MARITIME_CHOKEPOINTS: PanArabMaritimeChokepoint[] = [
    {
      chokepoint_id: 'choke_hormuz',
      name_ar: 'مضيق هرمز (Strait of Hormuz)',
      strategic_role_ar: 'الشريان الطاقي الأكبر عالمياً لنفط وغاز الخليج العربي نحو الأسواق الدولية والآسيوية.',
      daily_transit_vessels: 84,
      daily_crude_barrels_million: 21.0,
      global_trade_share_pct: 20.5,
      status: 'انسياب طبيعي وآمن',
      status_color: 'emerald',
      current_transit_delay_hours: 0.8,
      primary_alternative_route_ar: 'خط أنابيب بترولاين (شرق-غرب السعودية إلى ينبع) وخط حبشان-الفجيرة الإماراتي.',
      controlling_arab_states: [
        { country_code: 'OM', name_ar: 'سلطنة عُمان', flag: '🇴🇲' },
        { country_code: 'AE', name_ar: 'الإمارات', flag: '🇦🇪' }
      ]
    },
    {
      chokepoint_id: 'choke_mandeb',
      name_ar: 'مضيق باب المندب (Bab el-Mandeb)',
      strategic_role_ar: 'البوابة الجنوبية الحاكمة للبحر الأحمر والربط بين المحيط الهندي وقناة السويس.',
      daily_transit_vessels: 52,
      daily_crude_barrels_million: 7.2,
      global_trade_share_pct: 12.0,
      status: 'حالة ترقب وإجراءات أمنية مشددة',
      status_color: 'amber',
      current_transit_delay_hours: 4.5,
      primary_alternative_route_ar: 'الممر البري اللوجستي (جبل علي/الدمام - حيفا/بورسعيد) ومسار رأس الرجاء الصالح.',
      controlling_arab_states: [
        { country_code: 'YE', name_ar: 'اليمن', flag: '🇾🇪' },
        { country_code: 'DJ', name_ar: 'جيبوتي', flag: '🇩🇯' },
        { country_code: 'SO', name_ar: 'الصومال', flag: '🇸🇴' }
      ],
      live_incident_alert_ar: 'مرافقة عسكرية مستمرة لسفن الحبوب وسفن الصب الجاف مع تسيير خطوط ملاحية بديلة.'
    },
    {
      chokepoint_id: 'choke_suez',
      name_ar: 'قناة السويس المصرية (Suez Canal)',
      strategic_role_ar: 'أسرع ممر بحري رابط بين آسيا وأوروبا، وأهم قناة تجارية عالمية مخدومة بقاطرات عملاقة.',
      daily_transit_vessels: 76,
      daily_crude_barrels_million: 9.5,
      global_trade_share_pct: 14.8,
      status: 'انسياب طبيعي وآمن',
      status_color: 'emerald',
      current_transit_delay_hours: 1.2,
      primary_alternative_route_ar: 'المنطقة الاقتصادية لقناة السويس وشبكة القطار الكهربائي السريع (العين السخنة - العلمين).',
      controlling_arab_states: [
        { country_code: 'EG', name_ar: 'مصر', flag: '🇪🇬' }
      ]
    },
    {
      chokepoint_id: 'choke_gibraltar',
      name_ar: 'مضيق جبل طارق (Strait of Gibraltar)',
      strategic_role_ar: 'المنفذ الغربي للمتوسط وحلقة الوصل التجارية الحيوية بين إفريقيا وأوروبا والمحيط الأطلسي.',
      daily_transit_vessels: 310,
      daily_crude_barrels_million: 5.4,
      global_trade_share_pct: 18.0,
      status: 'انسياب طبيعي وآمن',
      status_color: 'emerald',
      current_transit_delay_hours: 0.5,
      primary_alternative_route_ar: 'ميناء طنجة المتوسط وشبكة الموانئ الأطلسية المغربية (الدار البيضاء، الجرف الأصفر).',
      controlling_arab_states: [
        { country_code: 'MA', name_ar: 'المغرب', flag: '🇲🇦' }
      ]
    }
  ];

  const PAN_ARAB_LIVE_COMMODITIES: PanArabLiveCommodityQuote[] = [
    {
      commodity_key: 'brent_crude',
      commodity_name_ar: 'نفط خام برنت القياسي',
      category: 'طاقة ومحروقات',
      spot_price_usd: 78.45,
      unit_ar: 'برميل',
      change_24h_pct: 1.35,
      is_positive_change: true,
      benchmark_market_ar: 'بورصة دبي للطاقة (DME) ولندن',
      leading_arab_exporter_ar: 'السعودية والعراق والإمارات',
      strategic_reserve_status_ar: 'فائض إنتاجي مرن واحتياطيات سيادية تكفي 90 يوماً'
    },
    {
      commodity_key: 'lng_arabian',
      commodity_name_ar: 'الغاز الطبيعي المسال (LNG)',
      category: 'طاقة ومحروقات',
      spot_price_usd: 12.80,
      unit_ar: 'مليون وحدة حرارية (MMBtu)',
      change_24h_pct: -0.85,
      is_positive_change: false,
      benchmark_market_ar: 'عقود تسليم راس لفان ومصر',
      leading_arab_exporter_ar: 'قطر والجزائر ومصر وعُمان',
      strategic_reserve_status_ar: 'عقود توريد طويلة الأجل وتأمين كامل لاحتياجات الخليج'
    },
    {
      commodity_key: 'wheat_milling',
      commodity_name_ar: 'القمح اللين (مستورد للطحين)',
      category: 'أمن غذائي ومحاصيل',
      spot_price_usd: 232.50,
      unit_ar: 'طن متري',
      change_24h_pct: -1.20,
      is_positive_change: false,
      benchmark_market_ar: 'بورصة شيكاغو والمناقصات المصرية والجزائرية',
      leading_arab_exporter_ar: 'مستورد صافٍ (المخزون الاستراتيجي: مصر، السعودية، المغرب)',
      strategic_reserve_status_ar: 'مخزون استراتيجي آمن يغطي 6.2 شهر بفضل صوامع الدعم الإقليمي'
    },
    {
      commodity_key: 'phosphate_dap',
      commodity_name_ar: 'أسمدة فوسفات الديدامونيوم (DAP)',
      category: 'أسمدة وكيماويات',
      spot_price_usd: 585.00,
      unit_ar: 'طن متري',
      change_24h_pct: 2.10,
      is_positive_change: true,
      benchmark_market_ar: 'مؤشر أسواق الجرف الأصفر والجبيل',
      leading_arab_exporter_ar: 'المغرب والسعودية وتونس والأردن',
      strategic_reserve_status_ar: 'هيمنة عربية بنسبة تتجاوز 65% من التجارة العالمية للأسمدة'
    },
    {
      commodity_key: 'aluminum_ingot',
      commodity_name_ar: 'الألمنيوم الأولي عالي النقاوة',
      category: 'معادن ومواد بناء',
      spot_price_usd: 2540.00,
      unit_ar: 'طن متري',
      change_24h_pct: 0.75,
      is_positive_change: true,
      benchmark_market_ar: 'بورصة لندن للمعادن (LME)',
      leading_arab_exporter_ar: 'الإمارات (EGA) والبحرين (Alba) والسعودية (معادن)',
      strategic_reserve_status_ar: 'طاقة إنتاجية كبرى بقدرة 6 ملايين طن سنوياً وتصدير لـ 80 دولة'
    },
    {
      commodity_key: 'green_ammonia',
      commodity_name_ar: 'الأمونيا الخضراء المعتمدة',
      category: 'طاقة ومحروقات',
      spot_price_usd: 720.00,
      unit_ar: 'طن متري',
      change_24h_pct: 3.40,
      is_positive_change: true,
      benchmark_market_ar: 'عقود التوريد المباشر لأوروبا واليابان',
      leading_arab_exporter_ar: 'مصر (السخنة) والسعودية (نيوم) وعُمان',
      strategic_reserve_status_ar: 'أولى الشحنات التجارية المصدرة بشهادات خفض كربون أوروبية'
    }
  ];

  const PAN_ARAB_SUPPLY_CHAIN_ALERTS: PanArabSupplyChainAlert[] = [
    {
      alert_id: 'alert_red_sea_contingency',
      timestamp_ar: 'منذ 18 دقيقة',
      severity: 'تنبيه استراتيجي (High)',
      corridor_name_ar: 'ممر البحر الأحمر - باب المندب',
      alert_title_ar: 'تفعيل مسارات الجسر البري التبادلي للشاحنات من موانئ الخليج',
      description_ar: 'سجلت غرف المتابعة اللوجستية تسارعاً في نقل الحاويات براً من ميناء جبل طارق والدمام وميناء الملك عبد الله إلى الموانئ الشمالية لتقليص زمن الانتظار الملاحي.',
      impacted_ports_or_borders: ['ميناء جدة الإسلامي', 'ميناء صلالة', 'منفذ البطحاء', 'ميناء العين السخنة'],
      recommended_alternative_action_ar: 'استخدام بوالص الشحن متعدد الوسائط المسجلة في منصة دَرْب (Multimodal GAFTA Corridor).'
    },
    {
      alert_id: 'alert_wheat_procurement_egypt',
      timestamp_ar: 'منذ 45 دقيقة',
      severity: 'إشعار تشغيلي (Informational)',
      corridor_name_ar: 'سلاسل الأمن الغذائي - البحر الأسود والمتوسط',
      alert_title_ar: 'تأمين شحنات القمح العربي والصلب عبر صوامع التخزين الإقليمية الموحدة',
      description_ar: 'إتمام تسوية شحنة استراتيجية من القمح الروماني والبلغاري لصالح مصر والمغرب بتسوية مصرفية رقمية خفضت تكلفة الاعتماد المستندي بنسبة 2.8%.',
      impacted_ports_or_borders: ['ميناء دمياط', 'ميناء الإسكندرية', 'ميناء الدار البيضاء'],
      recommended_alternative_action_ar: 'الاعتماد على منصة "بُنى" لتسريع فتح خطابات الضمان المصرفية.'
    },
    {
      alert_id: 'alert_gcc_customs_rush',
      timestamp_ar: 'منذ ساعتين',
      severity: 'إشعار تشغيلي (Informational)',
      corridor_name_ar: 'المنافذ الجمركية البرية الخليجية المشتركة',
      alert_title_ar: 'انسياب تام مع تدشين المسار الرقمي الأخضر لحاملي جواز سفر دَرْب',
      description_ar: 'انخفاض متوسط زمن عبور شاحنات الترانزيت عند منفذ الخفجي والبطحاء والغويفات إلى أقل من 35 دقيقة للشاحنة الواحدة.',
      impacted_ports_or_borders: ['منفذ البطحاء', 'منفذ الغويفات', 'منفذ النويصيب', 'جسر الملك فهد'],
      recommended_alternative_action_ar: 'إبراز بطاقة المستثمر والتاجر الرقمي لتسريع التفتيش بالأشعة السينية.'
    }
  ];

  // Endpoint 38: Pan-Arab Real-Time Maritime Chokepoints
  app.get('/api/countries/analytics/war-room/chokepoints', (_req: Request, res: Response) => {
    try {
      res.json({
        ok: true,
        success: true,
        total_chokepoints: PAN_ARAB_MARITIME_CHOKEPOINTS.length,
        data: PAN_ARAB_MARITIME_CHOKEPOINTS
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch maritime chokepoints' });
    }
  });

  // Endpoint 39: Pan-Arab Strategic Commodities Live Radar
  app.get('/api/countries/analytics/war-room/commodities', (_req: Request, res: Response) => {
    try {
      res.json({
        ok: true,
        success: true,
        total_commodities: PAN_ARAB_LIVE_COMMODITIES.length,
        data: PAN_ARAB_LIVE_COMMODITIES
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch live commodities' });
    }
  });

  // Endpoint 40: Pan-Arab Live Supply Chain & Maritime Alerts
  app.get('/api/countries/analytics/war-room/alerts', (_req: Request, res: Response) => {
    try {
      res.json({
        ok: true,
        success: true,
        total_alerts: PAN_ARAB_SUPPLY_CHAIN_ALERTS.length,
        data: PAN_ARAB_SUPPLY_CHAIN_ALERTS
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch supply chain alerts' });
    }
  });

  // ==========================================================================
  // PHASE 12: MINISTERIAL COMMAND HUB, CUSTOMS VERIFICATION & TREATY DRAFTER
  // ==========================================================================

  const PAN_ARAB_INSTITUTIONAL_AGENCIES: PanArabInstitutionalEntity[] = [
    {
      agency_id: 'agency_misa_sa',
      country_code: 'SA',
      country_name_ar: 'المملكة العربية السعودية',
      flag: '🇸🇦',
      agency_name_ar: 'وزارة الاستثمار السعودية (MISA) وهيئة الزكاة والضريبة والجمارك (ZATCA)',
      agency_type: 'وزارة استثمار وتجارة',
      jurisdiction_scope_ar: 'إصدار تراخيص الاستثمار الأجنبي، برنامج المقرات الإقليمية (RHQ)، إدارة الحوافز الضريبية والمسار السريع في 5 مناطق اقتصادية خاصة.',
      fast_track_services_ar: [
        'تأشيرة مستثمر خلال 24 ساعة عبر منصة "استثمر في السعودية"',
        'إعفاء ضريبة الدخل وضريبة الاستقطاع لمدة 30 عاماً للمقرات الإقليمية المعتمدة',
        'المسار الجمركي الفوري عبر المشغل الاقتصادي المعتمد (AEO - ZATCA)'
      ],
      key_incentives_summary_ar: 'ضريبة شركات 0% للمقرات الإقليمية لمدة 30 عاماً، تملك أجنبي كامل 100%، ودعم توظيف الكفاءات الوطنية عبر صندوق هدف.',
      focal_point_office_ar: 'مكتب خدمات المستثمرين الاستراتيجيين - الرياض',
      bilateral_agreements_count: 64
    },
    {
      agency_id: 'agency_gafi_eg',
      country_code: 'EG',
      country_name_ar: 'جمهورية مصر العربية',
      flag: '🇪🇬',
      agency_name_ar: 'الهيئة العامة للاستثمار والمناطق الحرة (GAFI) ومصلحة الجمارك المصرية',
      agency_type: 'هيئة تشجيع استثمار سيادية',
      jurisdiction_scope_ar: 'إصدار "الرخصة الذهبية" الشاملة، إدارة 11 منطقة حرة عامة وخاصة، والمناطق الاستثمارية المتخصصة.',
      fast_track_services_ar: [
        'الرخصة الذهبية (Golden License) للمشاريع الاستراتيجية وتأسيس المصانع بقرار واحد',
        'إعفاء تام من ضريبة القيمة المضافة على الآلات والمعدات المستوردة لخطوط الإنتاج',
        'تخليص جمركي مسبق (ACI) عبر منظومة "نافذة" الموحدة خلال ساعتين'
      ],
      key_incentives_summary_ar: 'خصم استثماري يصل إلى 50% من التكلفة الاستثمارية من الوعاء الضريبي، وإتاحة تسعير الأراضي الصناعية بحق الانتفاع أو التمليك الميسر.',
      focal_point_office_ar: 'وحدة دعم المستثمرين العرب والأجانب - القاهرة',
      bilateral_agreements_count: 72
    },
    {
      agency_id: 'agency_adio_ae',
      country_code: 'AE',
      country_name_ar: 'الإمارات العربية المتحدة',
      flag: '🇦🇪',
      agency_name_ar: 'مكتب أبوظبي للاستثمار (ADIO) ودائرة الاقتصاد والسياحة بدبي (DET)',
      agency_type: 'هيئة تشجيع استثمار سيادية',
      jurisdiction_scope_ar: 'جذب الاستثمارات التكنولوجية والمجمعات الصناعية المتقدمة، وبرامج الابتكار والبحث والتطوير.',
      fast_track_services_ar: [
        'الإقامة الذهبية الفورية لمدة 10 سنوات للمستثمرين والمبتكرين والشركاء المؤسسين',
        'حوافز نقدية وعينية لتكاليف التأسيس والبحث والتطوير عبر برنامج الابتكار',
        'الربط الرقمي الفوري للرخص التجارية عبر منصة "باشر"'
      ],
      key_incentives_summary_ar: 'ملكية أجنبية 100% في أكثر من 1,000 نشاط صناعي وتجاري، 0% ضريبة دخل شخصي، وشبكة تجارة واتفاقيات شراكة شاملة (CEPA).',
      focal_point_office_ar: 'مركز علاقات المستثمرين الدوليين - أبوظبي ودبي',
      bilateral_agreements_count: 88
    },
    {
      agency_id: 'agency_amdie_ma',
      country_code: 'MA',
      country_name_ar: 'المملكة المغربية',
      flag: '🇲🇦',
      agency_name_ar: 'الوكالة المغربية لتنمية الاستثمارات والصادرات (AMDIE) وإدارة الجمارك والضرائب غير المباشرة',
      agency_type: 'هيئة تشجيع استثمار سيادية',
      jurisdiction_scope_ar: 'ميثاق الاستثمار الوطني الجديد، مجمعات صناعة السيارات والطيران، ومشاريع الهيدروجين الأخضر والأسمدة.',
      fast_track_services_ar: [
        'منح استثمارية حكومية تصل إلى 30% من إجمالي المبلغ المستثمر للمشاريع الكبرى',
        'إعفاء ضريبي كامل لمدة 5 سنوات للشركات الصناعية المصدرة الجديدة',
        'منفذ جمركي رقمي فوري في ميناء طنجة المتوسط للتصدير نحو إفريقيا وأوروبا'
      ],
      key_incentives_summary_ar: 'دعم مباشر لتكوين وتشغيل الكفاءات الهندسية، بنية تحتية لوجستية من الطراز العالمي، وربط تفضيلي مع 1.3 مليار مستهلك عالمي.',
      focal_point_office_ar: 'قطب المستثمر الاستراتيجي - الرباط والدار البيضاء',
      bilateral_agreements_count: 58
    },
    {
      agency_id: 'agency_jic_jo',
      country_code: 'JO',
      country_name_ar: 'المملكة الأردنية الهاشمية',
      flag: '🇯🇴',
      agency_name_ar: 'وزارة الاستثمار الأردنية والجمارك الأردنية',
      agency_type: 'وزارة استثمار وتجارة',
      jurisdiction_scope_ar: 'قانون البيئة الاستثمارية لعام 2022، وتسهيل مشاريع الشراكة الصناعية التكاملية (الأردن ومصر والإمارات والسعودية والبحرين).',
      fast_track_services_ar: [
        'الخدمة الاستثمارية الشاملة لإصدار كافة التراخيص خلال 15 يوماً عمل كحد أقصى',
        'تأشيرات وإقامات للمستثمرين وعائلاتهم لمدد تصل إلى 5 سنوات قابلة للتجديد',
        'إعفاء الموجودات والمعدات الرأسمالية وقطع الغيار من الرسوم الجمركية وضريبة المبيعات'
      ],
      key_incentives_summary_ar: 'تخفيض ضريبة الدخل بنسب تصل إلى 50% للمشاريع في المناطق الأقل نمواً، ودعم تكاليف الطاقة للمصانع والمنشآت التحويلية.',
      focal_point_office_ar: 'وحدة الشراكة بين القطاعين العام والخاص - عمّان',
      bilateral_agreements_count: 52
    }
  ];

  // Endpoint 41: Pan-Arab Ministerial & Institutional Agencies Directory
  app.get('/api/countries/analytics/ministerial/agencies', (_req: Request, res: Response) => {
    try {
      res.json({
        ok: true,
        success: true,
        total_agencies: PAN_ARAB_INSTITUTIONAL_AGENCIES.length,
        data: PAN_ARAB_INSTITUTIONAL_AGENCIES
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to fetch institutional agencies' });
    }
  });

  // Endpoint 42: Pan-Arab Cross-Border Customs & Credential Verification Portal
  app.post('/api/countries/analytics/ministerial/verify-credential', (req: Request, res: Response) => {
    try {
      const {
        credential_id = 'GAFTA-2026-SA-EG-9981',
        credential_type = 'gafta_origin',
        origin_country = 'SA',
        destination_country = 'EG',
        goods_hs_code = '8471.30'
      }: PanArabCustomsVerificationRequest = req.body;

      const origin = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[origin_country.toUpperCase()] || COMPREHENSIVE_ARAB_COUNTRIES_PROFILES['SA'];
      const destination = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[destination_country.toUpperCase()] || COMPREHENSIVE_ARAB_COUNTRIES_PROFILES['EG'];

      const isSampleExpired = credential_id.toLowerCase().includes('expired') || credential_id.toLowerCase().includes('invalid');

      let typeAr = 'شهادة المنشأ العربية الموحدة (GAFTA Certificate)';
      let issuingAuthority = 'اتحاد الغرف التجارية ووزارة التجارة والصناعة';
      let privileges = [
        'إعفاء جمركي بنسبة 100% (تعرفة جمركية 0%) بموجب اتفاقية تيسير وتنمية التبادل التجاري العربي',
        'تجاوز نسبة القيمة المضافة الوطنية 42% (الحد الأدنى 40% مستوفى بالكامل)',
        'تأمين المعاينة الظاهرية وتخفيض رسوم الفحص المخبري بنسبة 60%'
      ];

      if (credential_type === 'digital_passport') {
        typeAr = 'جواز سفر المستثمر والمغترب الرقمي العربي (DARB Digital Passport)';
        issuingAuthority = 'منظومة دَرْب السيادية والجهات الاستثمارية المعتمدة';
        privileges = [
          'المسار السريع VIP في صالات المنافذ الجمركية والحدودية البرية والجوية',
          'أولوية حجز ونقل البضائع عبر ممرات الربط متعدد الوسائط',
          'تسهيل فتح الحسابات المصرفية الاستثمارية المباشرة'
        ];
      } else if (credential_type === 'sez_tax_exemption') {
        typeAr = 'شهادة الإعفاء الضريبي للمناطق الاقتصادية الخاصة (SEZ Certificate)';
        issuingAuthority = 'الهيئة العامة للمناطق الاقتصادية الخاصة والمناطق الحرة';
        privileges = [
          '0% ضريبة شركات على الأنشطة التصديرية المؤهلة',
          'استرداد وتأجيل ضريبة القيمة المضافة على الواردات الرأسمالية',
          'إعفاء من قيود ونسب توظيف وتأشيرات الكفاءات الفنية'
        ];
      } else if (credential_type === 'food_safety_phytosanitary') {
        typeAr = 'شهادة السلامة الغذائية والحجر الزراعي/البيطري الموحد';
        issuingAuthority = 'الهيئة القومية لسلامة الغذاء وهيئات الغذاء والدواء';
        privileges = [
          'فسح جمركي مسبق قبل وصول الشحنة إلى رصيف الميناء',
          'اعتماد متبادل للمختبرات والفحوصات الجرثومية والإشعاعية',
          'مسار تبريد أخضر مخصص للشاحنات المبردة لتجنب تلف المحاصيل'
        ];
      }

      const generatedHash = `SHA256-${Buffer.from(`${credential_id}:${origin_country}:${destination_country}:2026`).toString('base64').substring(0, 24).toUpperCase()}`;

      const verificationResult: PanArabCustomsVerificationResult = {
        is_valid: !isSampleExpired,
        credential_id,
        credential_type_ar: typeAr,
        status_ar: isSampleExpired ? 'منتهي الصلاحية أو غير مطابق' : 'معتمد وموثق رقمياً (Verified)',
        verification_timestamp: new Date().toISOString(),
        issuing_authority_ar: issuingAuthority,
        origin_country_ar: `${origin.name_ar} ${origin.flag}`,
        destination_country_ar: `${destination.name_ar} ${destination.flag}`,
        verified_privileges_ar: isSampleExpired ? ['لا توجد امتيازات فعالة - يتطلب إعادة إصدار'] : privileges,
        exemption_rate_pct: isSampleExpired ? 0 : 100,
        digital_seal_hash: generatedHash,
        border_clearance_lane: isSampleExpired ? 'المسار الأحمر (تفتيش دقيق)' : 'المسار الأخضر الفوري (Green Lane)'
      };

      res.json({
        ok: true,
        success: true,
        data: verificationResult
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to verify customs credential' });
    }
  });

  // Endpoint 43: Pan-Arab Bilateral Economic Treaty & MoU Drafter
  app.post('/api/countries/analytics/ministerial/treaty-draft', (req: Request, res: Response) => {
    try {
      const {
        party_a_country = 'SA',
        party_b_country = 'EG',
        treaty_type = 'industrial_synergy_partnership',
        designated_sectors = ['الصناعات التحويلية', 'الأدوية الحيوية', 'الهيدروجين النظيف'],
        arbitration_center = 'مركز القاهرة الإقليمي للتحكيم التجاري الدولي (CRCICA) والمركز السعودي للتحكيم التجاري (SCCA)'
      }: PanArabTreatyDraftRequest = req.body;

      const partyA = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[party_a_country.toUpperCase()] || COMPREHENSIVE_ARAB_COUNTRIES_PROFILES['SA'];
      const partyB = COMPREHENSIVE_ARAB_COUNTRIES_PROFILES[party_b_country.toUpperCase()] || COMPREHENSIVE_ARAB_COUNTRIES_PROFILES['EG'];

      const dateStr = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
      const treatyId = `DARB-TREATY-2026-${partyA.country_code}-${partyB.country_code}-${Math.floor(1000 + Math.random() * 9000)}`;

      let treatyTitle = `اتفاقية الشراكة الصناعية التكاملية للتنمية الاقتصادية المستدامة بين حكومة ${partyA.name_ar} وحكومة ${partyB.name_ar}`;
      let treatyTypeAr = 'اتفاقية شراكة صناعية وتكامل إنتاجي';

      if (treaty_type === 'bilateral_investment_protection') {
        treatyTitle = `اتفاقية تشجيع وحماية الاستثمارات المتبادلة وتيسير تدفق رؤوس الأموال بين حكومة ${partyA.name_ar} وحكومة ${partyB.name_ar}`;
        treatyTypeAr = 'معاهدة حماية وتشجيع الاستثمار المتبادل (BIT)';
      } else if (treaty_type === 'double_taxation_avoidance') {
        treatyTitle = `اتفاقية تجنب الازدواج الضريبي ومنع التهرب المالي فيما يتعلق بالضرائب على الدخل ورأس المال بين حكومة ${partyA.name_ar} وحكومة ${partyB.name_ar}`;
        treatyTypeAr = 'اتفاقية تجنب الازدواج الضريبي (DTAA)';
      } else if (treaty_type === 'joint_food_security_compact') {
        treatyTitle = `الميثاق الاستراتيجي المشترك للأمن الغذائي وسلاسل التوريد الزراعية وصوامع التخزين الإقليمية بين حكومة ${partyA.name_ar} وحكومة ${partyB.name_ar}`;
        treatyTypeAr = 'ميثاق أمن غذائي إقليمي مشترك';
      } else if (treaty_type === 'green_hydrogen_energy_treaty') {
        treatyTitle = `معاهدة الربط الكهربائي الموحد وتجارة الهيدروجين النظيف والأمونيا الخضراء بين حكومة ${partyA.name_ar} وحكومة ${partyB.name_ar}`;
        treatyTypeAr = 'معاهدة تكامل الطاقة النظيفة وممرات الهيدروجين';
      }

      const preamble = `إن حكومة ${partyA.name_ar} وحكومة ${partyB.name_ar} (المشار إليهما فيما بعد بـ "الطرفين المتعاقدين")، رغبة منهما في تعزيز وتوطيد الروابط الأخوية التاريخية، وتوسيع آفاق التعاون الاقتصادي والصناعي والتجاري والاستثماري المشترك، وإيماناً بضرورة خلق ظروف مواتية لتدفق رؤوس الأموال وتيسير حركة البضائع وحرية التنقل للكوادر والمستثمرين، واستناداً إلى ميثاق جامعة الدول العربية واتفاقية تيسير وتنمية التبادل التجاري بين الدول العربية (GAFTA)، قد اتفقتا على المواد التالية:`;

      const articles: any[] = [
        {
          article_number: 1,
          title_ar: 'المادة الأولى: التعاريف ونطاق التطبيق',
          content_ar: `يقصد بالمصطلحات الواردة في هذه الاتفاقية "المستثمر المؤهل"، "الاستثمار المشترك"، "شهادة المنشأ التراكمي"، و"المسار الرقمي الأخضر". تسري أحكام هذه المعاهدة على كافة المشاريع والأنشطة الاقتصادية المنشأة في إقليم أي من الطرفين في قطاعات: (${designated_sectors.join('، ')}).`
        },
        {
          article_number: 2,
          title_ar: 'المادة الثانية: المعاملة الوطنية ومعاملة الدولة الأولى بالرعاية',
          content_ar: `يمنح كل طرف متعاقد في إقليمه لمستثمري واستثمارات الطرف الآخر معاملة لا تقل رعاية وتفضيلاً عن تلك التي يمنحها في الظروف المماثلة لمستثمريه الوطنيين أو لمستثمري أي دولة ثالثة، بما في ذلك التملك وحرية تأسيس الشركات وتحويل الأرباح بالعملات القابلة للتحويل دون تأخير.`
        },
        {
          article_number: 3,
          title_ar: 'المادة الثالثة: الإعفاءات الجمركية وتراكم المنشأ الصناعي',
          content_ar: `تلتزم سلطات الجمارك لدى الطرفين بالاعتراف المتبادل بشهادات المنشأ الإلكترونية الصادرة عبر منصة دَرْب المعتمدة، مع تطبيق قاعدة المنشأ التراكمي العربي بحيث يعتبر المكون المصنع في أي من البلدين مكملاً للقيمة المضافة المستهدفة (40%)، مع الإعفاء التام من كافة الرسوم والضرائب الجمركية المماثلة.`
        },
        {
          article_number: 4,
          title_ar: 'المادة الرابعة: التسوية المالية المباشرة والعملات المحلية',
          content_ar: `يشجع الطرفان المتعاقدان مصارفهما المركزية ومؤسساتهما المالية على تسوية المدفوعات والتبادلات التجارية الناتجة عن تنفيذ هذه الاتفاقية عبر المنصات العربية المعتمدة ("بُنى" ونظام "آفاق") وبالعملات الوطنية للطرفين للحد من مخاطر تقلبات أسعار الصرف الدولية وخفض تكلفة الاعتمادات المستندية.`
        },
        {
          article_number: 5,
          title_ar: 'المادة الخامسة: تسوية المنازعات والتحكيم التجاري',
          content_ar: `أي نزاع ينشأ بين الطرفين أو بين أحد الطرفين ومستثمر تابع للطرف الآخر يتم حله ودياً بالمفاوضات المباشرة خلال 90 يوماً. وفي حال تعذر ذلك، يحال النزاع نهائياً إلى التحكيم المؤسسي أمام (${arbitration_center}) وفقاً لقواعده الإجرائية المعتمدة ويكون حكم التحكيم نهائياً وملزماً ونافذاً في كلا الإقليمين.`
        },
        {
          article_number: 6,
          title_ar: 'المادة السادسة: السريان والمدة والإنهاء',
          content_ar: `تدخل هذه المعاهدة حيز النفاذ اعتباراً من تاريخ استلام آخر إشعار خطي باستكمال الإجراءات الدستورية والقانونية اللازمة لتصديقها لدى كلا الطرفين، وتظل سارية المفعول لمدة عشر (10) سنوات قابلة للتجديد تلقائياً لمدد مماثلة.`
        }
      ];

      const responsePayload: PanArabTreatyDraftResponse = {
        treaty_id: treatyId,
        treaty_title_ar: treatyTitle,
        treaty_type_ar: treatyTypeAr,
        party_a_name_ar: `حكومة ${partyA.name_ar} ${partyA.flag}`,
        party_b_name_ar: `حكومة ${partyB.name_ar} ${partyB.flag}`,
        legal_preamble_ar: preamble,
        articles: articles,
        arbitration_forum_ar: arbitration_center,
        execution_date_ar: dateStr,
        official_seal_text_ar: 'الختم الدبلوماسي المعتمد - الأمانة العامة للشؤون الاقتصادية والتكامل العربي'
      };

      res.json({
        ok: true,
        success: true,
        data: responsePayload
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to draft bilateral treaty' });
    }
  });

  // ==========================================================================
  // PHASE 13: STRATEGIC FOOD & WATER SECURITY, RESILIENCE & 2035 SCENARIOS
  // ==========================================================================

  // Endpoint 44: Strategic Food & Grain Reserves
  app.get('/api/countries/analytics/phase13/food-reserves', async (_req: Request, res: Response) => {
    try {
      const { STRATEGIC_FOOD_RESERVES } = await import('../src/data/pan-arab-phase13-data');
      res.json({
        ok: true,
        success: true,
        data: STRATEGIC_FOOD_RESERVES
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to load strategic food reserves' });
    }
  });

  // Endpoint 45: Water Security & Desalination Nodes
  app.get('/api/countries/analytics/phase13/water-nodes', async (_req: Request, res: Response) => {
    try {
      const { WATER_DESALINATION_NODES } = await import('../src/data/pan-arab-phase13-data');
      res.json({
        ok: true,
        success: true,
        data: WATER_DESALINATION_NODES
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to load water nodes' });
    }
  });

  // Endpoint 46: Geopolitical & 2035 Horizon Scenarios
  app.get('/api/countries/analytics/phase13/scenarios', async (_req: Request, res: Response) => {
    try {
      const { GEOPOLITICAL_SCENARIOS } = await import('../src/data/pan-arab-phase13-data');
      res.json({
        ok: true,
        success: true,
        data: GEOPOLITICAL_SCENARIOS
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to load geopolitical scenarios' });
    }
  });

  // Endpoint 47: Sovereign Crisis Resilience Stress-Test
  app.post('/api/countries/analytics/phase13/stress-test', async (req: Request, res: Response) => {
    try {
      const { runPanArabStressTest } = await import('../src/data/pan-arab-phase13-data');
      const { country_code = 'SA', shock_type = 'grain_cutoff' } = req.body;
      const result = runPanArabStressTest(country_code, shock_type);
      res.json({
        ok: true,
        success: true,
        data: result
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to run stress test' });
    }
  });

  // ==========================================================================
  // PHASE 14: SOVEREIGN WEALTH CO-INVESTMENT, MEGAPROJECT SYNDICATION & STRATEGIC OPPORTUNITIES BANK 2030-2045
  // ==========================================================================

  // Endpoint 48: Sovereign Wealth Funds Consortium (AUM > $4T)
  app.get('/api/countries/analytics/phase14/sovereign-funds', async (_req: Request, res: Response) => {
    try {
      const { SOVEREIGN_WEALTH_FUNDS } = await import('../src/data/pan-arab-phase14-data');
      res.json({
        ok: true,
        success: true,
        data: SOVEREIGN_WEALTH_FUNDS
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to load sovereign wealth funds' });
    }
  });

  // Endpoint 49: Megaproject Syndicates Pipeline
  app.get('/api/countries/analytics/phase14/megaprojects', async (_req: Request, res: Response) => {
    try {
      const { MEGAPROJECT_SYNDICATES } = await import('../src/data/pan-arab-phase14-data');
      res.json({
        ok: true,
        success: true,
        data: MEGAPROJECT_SYNDICATES
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to load megaproject syndicates' });
    }
  });

  // Endpoint 50: Curated Strategic Opportunities Bank
  app.get('/api/countries/analytics/phase14/opportunities', async (_req: Request, res: Response) => {
    try {
      const { STRATEGIC_OPPORTUNITIES_BANK } = await import('../src/data/pan-arab-phase14-data');
      res.json({
        ok: true,
        success: true,
        data: STRATEGIC_OPPORTUNITIES_BANK
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to load strategic opportunities' });
    }
  });

  // Endpoint 51: Sovereign Portfolio Allocation Simulator
  app.post('/api/countries/analytics/phase14/portfolio-simulator', async (req: Request, res: Response) => {
    try {
      const { runPortfolioAllocationSimulation } = await import('../src/data/pan-arab-phase14-data');
      const simulation = runPortfolioAllocationSimulation(req.body || {});
      res.json({
        ok: true,
        success: true,
        data: simulation
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to run portfolio simulation' });
    }
  });

  // Endpoint 52: Generate Smart Green Sukuk Term Sheet
  app.post('/api/countries/analytics/phase14/generate-sukuk', async (req: Request, res: Response) => {
    try {
      const { generateSukukTermSheet } = await import('../src/data/pan-arab-phase14-data');
      const { syndicate_id = 'syn_neom_oxagon', target_volume_million_usd = 250 } = req.body;
      const termSheet = generateSukukTermSheet(syndicate_id, Number(target_volume_million_usd));
      res.json({
        ok: true,
        success: true,
        data: termSheet
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to generate sukuk term sheet' });
    }
  });

  // ==========================================================================
  // PHASE 15: SOVEREIGN DIGITAL TECH, CYBER SHIELD, SUPERCOMPUTING & SPACE 2030-2045
  // ==========================================================================

  // Endpoint 53: Sovereign Arab AI Models
  app.get('/api/countries/analytics/phase15/ai-models', async (_req: Request, res: Response) => {
    try {
      const { SOVEREIGN_AI_MODELS } = await import('../src/data/pan-arab-phase15-data');
      res.json({
        ok: true,
        success: true,
        data: SOVEREIGN_AI_MODELS
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to load sovereign AI models' });
    }
  });

  // Endpoint 54: Sovereign Supercomputers & GPU Clusters
  app.get('/api/countries/analytics/phase15/supercomputers', async (_req: Request, res: Response) => {
    try {
      const { SUPERCOMPUTER_CLUSTERS } = await import('../src/data/pan-arab-phase15-data');
      res.json({
        ok: true,
        success: true,
        data: SUPERCOMPUTER_CLUSTERS
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to load supercomputers' });
    }
  });

  // Endpoint 55: Pan-Arab Cyber Shield Threat Intelligence
  app.get('/api/countries/analytics/phase15/cyber-threats', async (_req: Request, res: Response) => {
    try {
      const { CYBER_SHIELD_INCIDENTS } = await import('../src/data/pan-arab-phase15-data');
      res.json({
        ok: true,
        success: true,
        data: CYBER_SHIELD_INCIDENTS
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to load cyber incidents' });
    }
  });

  // Endpoint 56: Pan-Arab Space & Satellite Constellations
  app.get('/api/countries/analytics/phase15/satellites', async (_req: Request, res: Response) => {
    try {
      const { PAN_ARAB_SATELLITES } = await import('../src/data/pan-arab-phase15-data');
      res.json({
        ok: true,
        success: true,
        data: PAN_ARAB_SATELLITES
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to load satellites' });
    }
  });

  // Endpoint 57: Cyber Readiness & Post-Quantum Defense Simulator
  app.post('/api/countries/analytics/phase15/cyber-simulator', async (req: Request, res: Response) => {
    try {
      const { runCyberReadinessSimulation } = await import('../src/data/pan-arab-phase15-data');
      const simulation = runCyberReadinessSimulation(req.body || {});
      res.json({
        ok: true,
        success: true,
        data: simulation
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Failed to run cyber simulation' });
    }
  });
}






