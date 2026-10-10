import React, { useState, useEffect } from 'react';
import {
  Factory,
  TrendingUp,
  ShieldCheck,
  Wheat,
  DollarSign,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Calculator,
  RefreshCw,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Users,
  Building2,
  Droplets,
  Coins
} from 'lucide-react';
import {
  PanArabIndustrialProject,
  PanArabCoInvestmentDeal,
  PanArabFoodSecurityCommodity,
  PanArabRulesOfOriginInput,
  PanArabRulesOfOriginResult
} from '../types/country-profile';
import { fetchApi } from '../api';

interface PanArabCommonMarketViewProps {
  onConsultAI?: (prompt: string) => void;
  onSelectCountry?: (countryCode: string) => void;
}

export const PanArabCommonMarketView: React.FC<PanArabCommonMarketViewProps> = ({
  onConsultAI,
  onSelectCountry
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'industrial' | 'deals' | 'food_security' | 'rules_of_origin'>('industrial');

  // Industrial Partnerships State
  const [industrialProjects, setIndustrialProjects] = useState<PanArabIndustrialProject[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [loadingIndustrial, setLoadingIndustrial] = useState<boolean>(true);

  // Co-Investment Deals State
  const [deals, setDeals] = useState<PanArabCoInvestmentDeal[]>([]);
  const [selectedDealStage, setSelectedDealStage] = useState<string>('all');
  const [loadingDeals, setLoadingDeals] = useState<boolean>(true);

  // Food Security State
  const [foodCommodities, setFoodCommodities] = useState<PanArabFoodSecurityCommodity[]>([]);
  const [selectedCommodityKey, setSelectedCommodityKey] = useState<string>('wheat_grains');
  const [loadingFood, setLoadingFood] = useState<boolean>(true);

  // Rules of Origin Calculator State
  const [calcInput, setCalcInput] = useState<PanArabRulesOfOriginInput>({
    product_name_ar: 'أجهزة تكييف وتبريد صناعية متقدمة',
    hs_code: '84.15',
    exporting_country: 'SA',
    importing_country: 'EG',
    ex_works_price_usd: 1200,
    arab_origin_materials_cost_usd: 480,
    direct_local_labor_cost_usd: 140,
    factory_overhead_cost_usd: 90,
    non_arab_imported_materials_cost_usd: 490
  });

  const [calcResult, setCalcResult] = useState<PanArabRulesOfOriginResult | null>(null);
  const [calculating, setCalculating] = useState<boolean>(false);

  // Preset scenarios for Rules of Origin
  const PRESET_SCENARIOS = [
    {
      title_ar: 'تكييفات سعودية تصدير لمصر',
      data: {
        product_name_ar: 'وحدات تكييف وتبريد مركزية',
        hs_code: '84.15',
        exporting_country: 'SA',
        importing_country: 'EG',
        ex_works_price_usd: 1500,
        arab_origin_materials_cost_usd: 620,
        direct_local_labor_cost_usd: 180,
        factory_overhead_cost_usd: 120,
        non_arab_imported_materials_cost_usd: 580
      }
    },
    {
      title_ar: 'أسمدة فوسفاتية مغربية للأردن',
      data: {
        product_name_ar: 'أسمدة فوسفاتية مركبة عالية النقاوة',
        hs_code: '31.05',
        exporting_country: 'MA',
        importing_country: 'JO',
        ex_works_price_usd: 800,
        arab_origin_materials_cost_usd: 550,
        direct_local_labor_cost_usd: 110,
        factory_overhead_cost_usd: 60,
        non_arab_imported_materials_cost_usd: 80
      }
    },
    {
      title_ar: 'منسوجات قطنية مصرية للإمارات',
      data: {
        product_name_ar: 'منسوجات وألياف قطنية طويلة التيلة',
        hs_code: '52.08',
        exporting_country: 'EG',
        importing_country: 'AE',
        ex_works_price_usd: 500,
        arab_origin_materials_cost_usd: 280,
        direct_local_labor_cost_usd: 90,
        factory_overhead_cost_usd: 40,
        non_arab_imported_materials_cost_usd: 90
      }
    },
    {
      title_ar: 'أجهزة إلكترونية (مكون أجنبي مرتفع)',
      data: {
        product_name_ar: 'لوحات دوائر إلكترونية وشاشات ذكية',
        hs_code: '85.28',
        exporting_country: 'AE',
        importing_country: 'SA',
        ex_works_price_usd: 2000,
        arab_origin_materials_cost_usd: 300,
        direct_local_labor_cost_usd: 180,
        factory_overhead_cost_usd: 120,
        non_arab_imported_materials_cost_usd: 1400
      }
    }
  ];

  // Fetch initial data
  useEffect(() => {
    async function loadAllData() {
      try {
        const indRes = await fetchApi<{ ok: boolean; data: PanArabIndustrialProject[] }>('/api/countries/analytics/industrial-partnerships');
        if (indRes?.data) setIndustrialProjects(indRes.data);
      } catch (e) {
        console.error('Failed to load industrial partnerships', e);
      } finally {
        setLoadingIndustrial(false);
      }

      try {
        const dealsRes = await fetchApi<{ ok: boolean; data: PanArabCoInvestmentDeal[] }>('/api/countries/analytics/co-investment-pipeline');
        if (dealsRes?.data) setDeals(dealsRes.data);
      } catch (e) {
        console.error('Failed to load deals', e);
      } finally {
        setLoadingDeals(false);
      }

      try {
        const foodRes = await fetchApi<{ ok: boolean; data: PanArabFoodSecurityCommodity[] }>('/api/countries/analytics/food-water-security');
        if (foodRes?.data) setFoodCommodities(foodRes.data);
      } catch (e) {
        console.error('Failed to load food security', e);
      } finally {
        setLoadingFood(false);
      }
    }

    loadAllData();
    handleRunCalculation(calcInput);
  }, []);

  const handleRunCalculation = async (input: PanArabRulesOfOriginInput) => {
    setCalculating(true);
    try {
      const res = await fetchApi<{ ok: boolean; data: PanArabRulesOfOriginResult }>('/api/countries/analytics/calculate-rules-of-origin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (res?.data) {
        setCalcResult(res.data);
      }
    } catch (e) {
      console.error('Rules of origin calculation failed', e);
    } finally {
      setCalculating(false);
    }
  };

  const handleApplyPreset = (presetData: PanArabRulesOfOriginInput) => {
    setCalcInput(presetData);
    handleRunCalculation(presetData);
  };

  // Filter industrial projects
  const filteredIndustrial = industrialProjects.filter(p => {
    if (selectedSector === 'all') return true;
    return p.sector_ar.includes(selectedSector);
  });

  // Filter deals
  const filteredDeals = deals.filter(d => {
    if (selectedDealStage === 'all') return true;
    return d.deal_stage === selectedDealStage;
  });

  const selectedCommodity = foodCommodities.find(c => c.commodity_key === selectedCommodityKey) || foodCommodities[0];

  return (
    <div id="pan-arab-common-market-view" className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#071a2b] via-[#0d2a45] to-[#0a233a] border border-[#1bb49e]/30 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#1bb49e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1bb49e]/20 border border-[#1bb49e]/40 text-[#1bb49e] text-xs font-bold">
              <Factory className="w-3.5 h-3.5" />
              <span>المرحلة الثامنة: التكامل الاقتصادي والسوق العربية المشتركة</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              الشراكة الصناعية التكاملية وسلاسل القيمة والأمن الغذائي المشترك
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              منصة رصد المشاريع الصناعية العابرة للحدود، بنك الصفقات السيادية المشتركة، مصفوفة الاحتياطي الاستراتيجي للأمن الغذائي والمائي العربي، ومحاكي احتساب قواعد المنشأ العربية (GAFTA) للإعفاء الجمركي الكامل.
            </p>
          </div>

          <button
            id="btn-ai-common-market"
            onClick={() => onConsultAI?.('قدم لي تحليلاً تنفيذياً حول آفاق التكامل الصناعي وسلاسل القيمة العربية المشتركة، وكيفية تعظيم الاستفادة من اتفاقية تيسير وتنمية التبادل التجاري العربي (GAFTA) في خفض تكاليف سلاسل الإمداد.')}
            className="self-start md:self-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1bb49e] to-[#159482] text-[#071a2b] font-extrabold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>استشارة مستشار التكامل العربي الذكي</span>
          </button>
        </div>

        {/* Phase 8 Navigation Tabs */}
        <div className="mt-8 flex items-center gap-2 border-b border-white/10 pb-1 overflow-x-auto scrollbar-none">
          <button
            id="subtab-industrial"
            onClick={() => setActiveSubTab('industrial')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'industrial'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-md'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <Factory className="w-4 h-4" />
            <span>الشراكة الصناعية التكاملية ({industrialProjects.length})</span>
          </button>

          <button
            id="subtab-deals"
            onClick={() => setActiveSubTab('deals')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'deals'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-md'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>بنك الفرص والصفقات السيادية ({deals.length})</span>
          </button>

          <button
            id="subtab-food-security"
            onClick={() => setActiveSubTab('food_security')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'food_security'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-md'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <Wheat className="w-4 h-4" />
            <span>المرصد الاستراتيجي للأمن الغذائي والمائي</span>
          </button>

          <button
            id="subtab-rules-of-origin"
            onClick={() => setActiveSubTab('rules_of_origin')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'rules_of_origin'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-md'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>محاكي قواعد المنشأ والإعفاء الجمركي (GAFTA)</span>
          </button>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* 1. INDUSTRIAL INTEGRATION & CROSS-BORDER VALUE CHAINS */}
      {/* ====================================================================== */}
      {activeSubTab === 'industrial' && (
        <div className="space-y-6">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span>إجمالي الاستثمارات المشتركة</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-stone-900 dark:text-white">
                ${industrialProjects.reduce((acc, p) => acc + p.investment_value_usd_million, 0).toLocaleString()}M
              </div>
              <div className="text-[11px] text-stone-400 mt-1">عبر 5 تحالفات صناعية استراتيجية</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span>فرص العمل المستحدثة</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-stone-900 dark:text-white">
                +{industrialProjects.reduce((acc, p) => acc + p.jobs_created, 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-stone-400 mt-1">وظيفة صناعية وتقنية عالية المهارة</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span>الدول الشريكة الفاعلة</span>
                <Building2 className="w-4 h-4 text-[#1bb49e]" />
              </div>
              <div className="text-2xl font-black text-stone-900 dark:text-white">7 دول</div>
              <div className="text-[11px] text-stone-400 mt-1">الإمارات، السعودية، مصر، الأردن، البحرين، المغرب، عُمان</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span>توطين الواردات والعملات</span>
                <Coins className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-stone-900 dark:text-white">$2.8B+</div>
              <div className="text-[11px] text-stone-400 mt-1">وفر سنوي مقدر بالعملات الأجنبية الصعبة</div>
            </div>
          </div>

          {/* Sector Filter */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-stone-100 dark:bg-stone-900/60 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
            <div className="text-xs font-bold text-stone-600 dark:text-stone-300">
              تصفية حسب القطاع الصناعي:
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { key: 'all', label: 'كافة القطاعات' },
                { key: 'الكيماويات', label: 'الكيماويات والتعدين' },
                { key: 'الأسمدة', label: 'الأسمدة والزراعة' },
                { key: 'البطاريات', label: 'التنقل والبطاريات' },
                { key: 'الدوائية', label: 'الصناعات الدوائية' },
                { key: 'المنسوجات', label: 'المنسوجات التقنية' }
              ].map(sec => (
                <button
                  key={sec.key}
                  onClick={() => setSelectedSector(sec.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    selectedSector === sec.key
                      ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm font-extrabold'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Industrial Projects List */}
          {loadingIndustrial ? (
            <div className="text-center py-12 text-stone-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#1bb49e]" />
              <p className="text-xs">جاري تحميل مشاريع الشراكة الصناعية التكاملية...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredIndustrial.map((proj) => (
                <div
                  key={proj.id}
                  id={`project-card-${proj.id}`}
                  className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm hover:border-[#1bb49e]/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header: Title & Sector */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold mb-2">
                          {proj.sector_ar}
                        </span>
                        <h3 className="text-base font-bold text-stone-900 dark:text-white leading-snug">
                          {proj.project_name_ar}
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-bold whitespace-nowrap border border-stone-200 dark:border-stone-700">
                        {proj.status_ar}
                      </span>
                    </div>

                    {/* Participating Countries & Strategic Roles */}
                    <div className="bg-stone-50 dark:bg-stone-950/50 p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800/80 space-y-2">
                      <div className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
                        الدول الشريكة والأدوار الاستراتيجية:
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {proj.participating_countries.map((country, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs">
                            <span className="text-base leading-none">{country.flag}</span>
                            <span className="font-bold text-stone-800 dark:text-stone-200 whitespace-nowrap">
                              {country.name_ar}:
                            </span>
                            <span className="text-stone-600 dark:text-stone-400 text-[11px]">
                              {country.role_ar}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Value Chain Synergy */}
                    <div className="space-y-1.5 text-xs">
                      <div className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#1bb49e]" />
                        <span>تكامل سلاسل القيمة المضافة:</span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed">
                        {proj.value_chain_synergy_ar}
                      </p>
                    </div>

                    {/* Strategic Impact & Target Output */}
                    <div className="p-3 rounded-xl bg-[#1bb49e]/5 border border-[#1bb49e]/20 text-xs text-stone-700 dark:text-stone-300 space-y-1">
                      <div className="font-bold text-[#1bb49e] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>الأثر الاستراتيجي والطاقة السنوية:</span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {proj.expected_annual_output_ar} — {proj.strategic_impact_ar}
                      </p>
                    </div>
                  </div>

                  {/* Footer Metrics */}
                  <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-stone-400">حجم الاستثمار</div>
                      <div className="text-base font-black text-stone-900 dark:text-white">
                        ${proj.investment_value_usd_million}M
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-stone-400">الوظائف المستحدثة</div>
                      <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        +{proj.jobs_created.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => onConsultAI?.(`ما هي المزايا الاستثمارية لسلسلة توريد ${proj.project_name_ar}؟ وما هي الفرص المتاحة للشركات الخاصة للاستفادة من المخرجات والمنتجات الوسيطة؟`)}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-[#1bb49e]/20 hover:text-[#1bb49e] transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>تحليل الفرص</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================== */}
      {/* 2. PAN-ARAB CO-INVESTMENT DEALS PIPELINE (DEALROOM) */}
      {/* ====================================================================== */}
      {activeSubTab === 'deals' && (
        <div className="space-y-6">
          {/* Stage Filter */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-stone-100 dark:bg-stone-900/60 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
            <div className="text-xs font-bold text-stone-600 dark:text-stone-300">
              تصفية حسب مرحلة الصفقة:
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { key: 'all', label: 'كافة الصفقات الاستثمارية' },
                { key: 'مرحلة الاكتتاب المغلق', label: 'اكتتاب مغلق' },
                { key: 'مرحلة الفحص النافي للجهالة (DD)', label: 'فحص نافٍ للجهالة' },
                { key: 'مرحلة طرح الأسهم والتمويل المشترك', label: 'تمويل مشترك وطرح' }
              ].map(stg => (
                <button
                  key={stg.key}
                  onClick={() => setSelectedDealStage(stg.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    selectedDealStage === stg.key
                      ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm font-extrabold'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {stg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Deals Grid */}
          {loadingDeals ? (
            <div className="text-center py-12 text-stone-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#1bb49e]" />
              <p className="text-xs">جاري تحميل صفقات بنك الاستثمار العربي المشترك...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredDeals.map((deal) => (
                <div
                  key={deal.id}
                  id={`deal-card-${deal.id}`}
                  className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm hover:border-[#1bb49e]/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                            {deal.sector_ar}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold">
                            IRR المستهدف: {deal.projected_irr_pct}%
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-stone-900 dark:text-white leading-snug">
                          {deal.deal_title_ar}
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-bold whitespace-nowrap border border-stone-200 dark:border-stone-700">
                        {deal.deal_stage}
                      </span>
                    </div>

                    {/* Host Countries */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-stone-400 font-semibold">الدول المستضيفة:</span>
                      <div className="flex items-center gap-2">
                        {deal.host_countries.map(c => (
                          <span key={c.country_code} className="inline-flex items-center gap-1 font-bold text-stone-700 dark:text-stone-300">
                            <span>{c.flag}</span>
                            <span>{c.name_ar}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Overview */}
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {deal.overview_ar}
                    </p>

                    {/* Sovereign Co-investors */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
                        الشركاء والصناديق السيادية المشاركة:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {deal.sovereign_co_investors.map((sov, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200/50 dark:border-emerald-800/50"
                          >
                            {sov}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Regulatory Incentives */}
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200/70 dark:border-stone-800/70 space-y-1">
                      <div className="text-[11px] font-extrabold text-stone-500">
                        الحوافز والضمانات التنظيمية:
                      </div>
                      <ul className="list-disc list-inside text-[11px] text-stone-600 dark:text-stone-400 space-y-0.5">
                        {deal.regulatory_incentives_ar.map((inc, i) => (
                          <li key={i}>{inc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Financial Metrics & CTAs */}
                  <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-stone-400">حجم الاستثمار المستهدف</div>
                      <div className="text-base font-black text-stone-900 dark:text-white">
                        ${deal.target_ticket_size_usd_million}M
                      </div>
                      <div className="text-[10px] text-stone-400">الحد الأدنى: ${deal.minimum_check_size_usd_million}M</div>
                    </div>

                    <button
                      onClick={() => onConsultAI?.(`قدم لي مذكرة فحص نافٍ للجهالة (Due Diligence Summary) لصفقة "${deal.deal_title_ar}"، تشمل تحليل المخاطر، العوائد المتوقعة، والحوافز الضريبية.`)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#1bb49e] to-[#159482] text-[#071a2b] text-xs font-black hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>طلب مذكرة الفحص الاستثماري</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================== */}
      {/* 3. STRATEGIC PAN-ARAB FOOD & WATER SECURITY GRID */}
      {/* ====================================================================== */}
      {activeSubTab === 'food_security' && (
        <div className="space-y-6">
          {/* Commodity Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {foodCommodities.map((item) => (
              <button
                key={item.commodity_key}
                id={`btn-commodity-${item.commodity_key}`}
                onClick={() => setSelectedCommodityKey(item.commodity_key)}
                className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
                  selectedCommodityKey === item.commodity_key
                    ? 'bg-[#1bb49e]/10 border-[#1bb49e] ring-2 ring-[#1bb49e]/20'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Wheat className={`w-4 h-4 ${selectedCommodityKey === item.commodity_key ? 'text-[#1bb49e]' : 'text-stone-400'}`} />
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                    item.risk_status === 'آمن ومستقر'
                      ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                      : item.risk_status === 'استقرار حرج يتطلب تحوط'
                      ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                      : 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                  }`}>
                    {item.risk_status}
                  </span>
                </div>
                <div className="font-bold text-xs text-stone-900 dark:text-white truncate">
                  {item.commodity_name_ar}
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  اكتفاء: <span className="font-extrabold text-stone-800 dark:text-stone-200">{item.pan_arab_self_sufficiency_pct}%</span>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Commodity Deep Dive */}
          {selectedCommodity && (
            <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-5">
                <div>
                  <div className="text-xs text-stone-400 font-bold mb-1">السلعة الاستراتيجية المختارة</div>
                  <h3 className="text-xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                    <Wheat className="w-5 h-5 text-[#1bb49e]" />
                    <span>{selectedCommodity.commodity_name_ar}</span>
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <div className="text-[10px] text-stone-400">متوسط المخزون الاستراتيجي العربي</div>
                    <div className="text-lg font-black text-stone-900 dark:text-white">
                      {selectedCommodity.average_strategic_reserve_months} أشهر
                    </div>
                  </div>

                  <div className="h-8 w-px bg-stone-200 dark:bg-stone-700" />

                  <div className="text-left">
                    <div className="text-[10px] text-stone-400">الاستهلاك السنوي</div>
                    <div className="text-lg font-black text-stone-900 dark:text-white">
                      {selectedCommodity.pan_arab_annual_consumption_million_tons}M طن
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress & Self-Sufficiency Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-stone-700 dark:text-stone-300">نسبة الاكتفاء الذاتي العربي الإجمالي:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                    {selectedCommodity.pan_arab_self_sufficiency_pct}% (الفجوة الاستيرادية: {(100 - selectedCommodity.pan_arab_self_sufficiency_pct).toFixed(1)}%)
                  </span>
                </div>
                <div className="h-3 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#1bb49e]"
                    style={{ width: `${selectedCommodity.pan_arab_self_sufficiency_pct}%` }}
                  />
                  <div
                    className="h-full bg-rose-400/30"
                    style={{ width: `${100 - selectedCommodity.pan_arab_self_sufficiency_pct}%` }}
                  />
                </div>
              </div>

              {/* Leading Producing Countries */}
              <div className="space-y-3">
                <div className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">
                  أكبر الدول المنتجة عربياً وحصتها من الإنتاج الكلي:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {selectedCommodity.leading_producing_countries.map(prod => (
                    <div
                      key={prod.country_code}
                      onClick={() => onSelectCountry?.(prod.country_code)}
                      className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 cursor-pointer hover:border-[#1bb49e]/50 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{prod.flag}</span>
                          <span className="font-bold text-xs text-stone-900 dark:text-white">{prod.name_ar}</span>
                        </div>
                        <span className="text-xs font-black text-[#1bb49e]">{prod.share_pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1bb49e]" style={{ width: `${prod.share_pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Joint Initiatives */}
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="text-xs font-extrabold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1bb49e]" />
                  <span>المبادرات والمشاريع العربية المشتركة لسد الفجوة وتأمين الاحتياطي:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                  {selectedCommodity.strategic_joint_initiatives.map((init, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#1bb49e] font-black">•</span>
                      <span>{init}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================== */}
      {/* 4. GAFTA RULES OF ORIGIN & CUSTOMS TARIFF EXEMPTION CALCULATOR */}
      {/* ====================================================================== */}
      {activeSubTab === 'rules_of_origin' && (
        <div className="space-y-6">
          {/* Preset Buttons */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-stone-600 dark:text-stone-400">
              نماذج جاهزة للاختبار السريع:
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_SCENARIOS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(preset.data)}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-[#1bb49e]/15 hover:text-[#1bb49e] text-stone-700 dark:text-stone-300 text-xs font-semibold transition-all cursor-pointer border border-stone-200 dark:border-stone-700"
                >
                  {preset.title_ar}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Form (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <h3 className="font-extrabold text-stone-900 dark:text-white text-sm flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#1bb49e]" />
                  <span>بيانات المنتج وتكلفة المصنع (Ex-Works)</span>
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-500 font-bold mb-1">اسم المنتج الصناعي</label>
                  <input
                    type="text"
                    value={calcInput.product_name_ar}
                    onChange={(e) => setCalcInput({ ...calcInput, product_name_ar: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#1bb49e]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-500 font-bold mb-1">بلد التصدير العربي</label>
                    <select
                      value={calcInput.exporting_country}
                      onChange={(e) => setCalcInput({ ...calcInput, exporting_country: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#1bb49e]"
                    >
                      <option value="SA">🇸🇦 السعودية</option>
                      <option value="AE">🇦🇪 الإمارات</option>
                      <option value="EG">🇪🇬 مصر</option>
                      <option value="MA">🇲🇦 المغرب</option>
                      <option value="JO">🇯🇴 الأردن</option>
                      <option value="BH">🇧🇭 البحرين</option>
                      <option value="OM">🇴🇲 عُمان</option>
                      <option value="QA">🇶🇦 قطر</option>
                      <option value="KW">🇰🇼 الكويت</option>
                      <option value="TN">🇹🇳 تونس</option>
                      <option value="DZ">🇩🇿 الجزائر</option>
                      <option value="IQ">🇮🇶 العراق</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-500 font-bold mb-1">بلد الاستيراد العربي</label>
                    <select
                      value={calcInput.importing_country}
                      onChange={(e) => setCalcInput({ ...calcInput, importing_country: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-medium focus:outline-none focus:border-[#1bb49e]"
                    >
                      <option value="EG">🇪🇬 مصر</option>
                      <option value="SA">🇸🇦 السعودية</option>
                      <option value="AE">🇦🇪 الإمارات</option>
                      <option value="JO">🇯🇴 الأردن</option>
                      <option value="MA">🇲🇦 المغرب</option>
                      <option value="OM">🇴🇲 عُمان</option>
                      <option value="KW">🇰🇼 الكويت</option>
                      <option value="QA">🇶🇦 قطر</option>
                      <option value="BH">🇧🇭 البحرين</option>
                      <option value="IQ">🇮🇶 العراق</option>
                      <option value="DZ">🇩🇿 الجزائر</option>
                      <option value="TN">🇹🇳 تونس</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-500 font-bold mb-1">سعر باب المصنع الإجمالي (Ex-Works USD)</label>
                  <input
                    type="number"
                    value={calcInput.ex_works_price_usd}
                    onChange={(e) => setCalcInput({ ...calcInput, ex_works_price_usd: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-black text-sm focus:outline-none focus:border-[#1bb49e]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/50 space-y-2">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300 text-[11px]">
                    عناصر القيمة المضافة العربية (Arab Value-Added Components):
                  </div>
                  <div>
                    <label className="block text-stone-500 font-medium text-[11px] mb-0.5">مواد خام ومدخلات عربية المنشأ ($)</label>
                    <input
                      type="number"
                      value={calcInput.arab_origin_materials_cost_usd}
                      onChange={(e) => setCalcInput({ ...calcInput, arab_origin_materials_cost_usd: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-medium text-[11px] mb-0.5">أجور عمالة محلية مباشرة ($)</label>
                    <input
                      type="number"
                      value={calcInput.direct_local_labor_cost_usd}
                      onChange={(e) => setCalcInput({ ...calcInput, direct_local_labor_cost_usd: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-medium text-[11px] mb-0.5">تكاليف تصنيع غير مباشرة وطاقة محلية ($)</label>
                    <input
                      type="number"
                      value={calcInput.factory_overhead_cost_usd}
                      onChange={(e) => setCalcInput({ ...calcInput, factory_overhead_cost_usd: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-500 font-bold mb-1">مواد خام ومكونات مستوردة من خارج الدول العربية ($)</label>
                  <input
                    type="number"
                    value={calcInput.non_arab_imported_materials_cost_usd}
                    onChange={(e) => setCalcInput({ ...calcInput, non_arab_imported_materials_cost_usd: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-bold focus:outline-none focus:border-[#1bb49e]"
                  />
                </div>

                <button
                  id="btn-recalculate-origin"
                  onClick={() => handleRunCalculation(calcInput)}
                  disabled={calculating}
                  className="w-full py-2.5 rounded-xl bg-[#1bb49e] text-[#071a2b] font-black text-xs hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  {calculating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>جاري الاحتساب والتحقق...</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4" />
                      <span>احتساب نسبة القيمة المضافة والإعفاء</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Output (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {calcResult ? (
                <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-5">
                  {/* Verdict Badge */}
                  <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                    calcResult.is_gafta_compliant
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                      : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                  }`}>
                    {calcResult.is_gafta_compliant ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-extrabold text-sm mb-0.5">
                        {calcResult.tariff_exemption_verdict_ar}
                      </div>
                      <div className="text-xs opacity-90">
                        {calcResult.is_gafta_compliant
                          ? `يحق للمستورد في ${calcResult.importing_country_ar} تخليص الشحنة معفاة بالكامل من الرسوم الجمركية بنسبة 0% بدلاً من سداد ${calcResult.standard_customs_duty_without_gafta_pct}%.`
                          : `المنتج يحتاج إلى زيادة القيمة المضافة العربية بمقدار ${(calcResult.gafta_threshold_required_pct - calcResult.arab_value_added_percentage).toFixed(1)}% لكي يتأهل لشهادة المنشأ العربية الموحدة.`}
                      </div>
                    </div>
                  </div>

                  {/* Visual Percentage Meter */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-stone-700 dark:text-stone-300">نسبة القيمة المضافة العربية المحققة:</span>
                      <span className={`text-base font-black ${calcResult.is_gafta_compliant ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                        {calcResult.arab_value_added_percentage}%
                      </span>
                    </div>

                    <div className="relative h-4 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          calcResult.is_gafta_compliant
                            ? 'bg-gradient-to-r from-emerald-500 to-[#1bb49e]'
                            : 'bg-gradient-to-r from-amber-500 to-rose-500'
                        }`}
                        style={{ width: `${Math.min(calcResult.arab_value_added_percentage, 100)}%` }}
                      />
                      {/* 40% Threshold Indicator Marker */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-stone-900 dark:bg-white z-10"
                        style={{ left: '40%' }}
                        title="عتبة اتفاقية جافتا (40%)"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-stone-400">
                      <span>0%</span>
                      <span className="font-extrabold text-stone-600 dark:text-stone-300">حد الإعفاء الأدنى: 40%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
                      <div className="text-[10px] text-stone-400">إجمالي القيمة المضافة العربية</div>
                      <div className="text-lg font-black text-stone-900 dark:text-white">
                        ${calcResult.total_arab_value_added_usd.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-stone-400">من أصل ${calcResult.ex_works_price_usd.toLocaleString()} سعر المصنع</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                      <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold">الوفر الجمركي التقديري</div>
                      <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                        ${calcResult.estimated_duty_savings_usd.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-300">لكل وحدة مصدرة (15% رسوم موفرة)</div>
                    </div>
                  </div>

                  {/* Required Documentation */}
                  <div className="space-y-2">
                    <div className="text-xs font-extrabold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-[#1bb49e]" />
                      <span>المستندات الجمركية والإجرائية المطلوبة للتخليص:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                      {calcResult.required_certificates_ar.map((cert, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-stone-50 dark:bg-stone-950/40 p-2.5 rounded-lg border border-stone-200/60 dark:border-stone-800/60">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1bb49e] shrink-0 mt-0.5" />
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Advisory Note */}
                  <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 space-y-1">
                    <div className="font-bold text-stone-800 dark:text-stone-200">التوصية الاستشارية:</div>
                    <p className="leading-relaxed">{calcResult.regulatory_advisory_note_ar}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-stone-400">
                  <Calculator className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                  <p className="text-xs">اضغط على زر احتساب لعرض نتيجة مطابقة قواعد المنشأ والوفر الجمركي.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
