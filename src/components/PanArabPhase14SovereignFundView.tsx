import React, { useState } from 'react';
import {
  Coins,
  Building2,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Globe2,
  PieChart,
  FileCheck2,
  Briefcase,
  ChevronRight,
  Layers,
  ArrowUpRight,
  Landmark,
  CheckCircle2,
  Filter,
  Download,
  Printer,
  Copy,
  Scale
} from 'lucide-react';
import {
  PanArabConsortiumSovereignFund,
  PanArabMegaprojectSyndicate,
  PanArabStrategicOpportunity,
  PanArabPortfolioSimulationResult,
  PanArabGreenSukukTermSheet
} from '../types/country-profile';
import {
  SOVEREIGN_WEALTH_FUNDS,
  MEGAPROJECT_SYNDICATES,
  STRATEGIC_OPPORTUNITIES_BANK,
  runPortfolioAllocationSimulation,
  generateSukukTermSheet
} from '../data/pan-arab-phase14-data';

interface PanArabPhase14SovereignFundViewProps {
  onSelectCountry?: (countryCode: string) => void;
  onConsultAI?: (prompt: string) => void;
}

export const PanArabPhase14SovereignFundView: React.FC<PanArabPhase14SovereignFundViewProps> = ({
  onSelectCountry,
  onConsultAI
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'funds' | 'syndicates' | 'opportunities' | 'simulator' | 'sukuk'>('syndicates');

  // Sovereign Funds Filter
  const [selectedFund, setSelectedFund] = useState<PanArabConsortiumSovereignFund>(SOVEREIGN_WEALTH_FUNDS[0]);

  // Megaproject Syndicates State
  const [selectedSyndicate, setSelectedSyndicate] = useState<PanArabMegaprojectSyndicate>(MEGAPROJECT_SYNDICATES[0]);
  const [sectorFilter, setSectorFilter] = useState<string>('all');

  // Opportunities State
  const [selectedOpp, setSelectedOpp] = useState<PanArabStrategicOpportunity>(STRATEGIC_OPPORTUNITIES_BANK[0]);

  // Portfolio Simulator State
  const [simCapital, setSimCapital] = useState<number>(500);
  const [simRisk, setSimRisk] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [simResult, setSimResult] = useState<PanArabPortfolioSimulationResult>(() =>
    runPortfolioAllocationSimulation({ capital_million_usd: 500, risk_profile: 'balanced', target_sectors: [], preferred_region: 'all' })
  );
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Sukuk Generator State
  const [sukukSyndicateId, setSukukSyndicateId] = useState<string>(MEGAPROJECT_SYNDICATES[0].syndicate_id);
  const [sukukTargetVolume, setSukukTargetVolume] = useState<number>(250);
  const [currentSukuk, setCurrentSukuk] = useState<PanArabGreenSukukTermSheet>(() =>
    generateSukukTermSheet(MEGAPROJECT_SYNDICATES[0].syndicate_id, 250)
  );
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const handleRunSimulation = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const res = runPortfolioAllocationSimulation({
        capital_million_usd: simCapital,
        risk_profile: simRisk,
        target_sectors: [],
        preferred_region: 'all'
      });
      setSimResult(res);
      setIsCalculating(false);
    }, 350);
  };

  const handleGenerateSukuk = () => {
    const s = generateSukukTermSheet(sukukSyndicateId, sukukTargetVolume);
    setCurrentSukuk(s);
  };

  const copySeal = () => {
    navigator.clipboard?.writeText(currentSukuk.digital_cryptoseal_sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const filteredSyndicates = MEGAPROJECT_SYNDICATES.filter(item => {
    if (sectorFilter === 'all') return true;
    return item.sector === sectorFilter;
  });

  const totalAumBillion = SOVEREIGN_WEALTH_FUNDS.reduce((sum, f) => sum + f.aum_billion_usd, 0);
  const totalSyndicateCapexBillion = MEGAPROJECT_SYNDICATES.reduce((sum, s) => sum + s.total_capex_billion_usd, 0);

  return (
    <div id="pan-arab-phase14-container" className="space-y-6 animate-fadeIn text-right" dir="rtl">
      
      {/* Sovereign Header Card */}
      <div className="bg-gradient-to-br from-[#071a2b] via-[#0b2840] to-[#04121e] border border-[#1bb49e]/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#1bb49e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#1bb49e]/20 text-[#8be4d4] border border-[#1bb49e]/40 px-3 py-1 rounded-full text-xs font-black tracking-wide inline-flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-[#1bb49e]" />
                المرحلة 14 • منصة التمويل والاستثمار السيادي العربي الموحد
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold">
                أصول سيادية تزيد عن 4.5 تريليون دولار
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              تحالف الصناديق السيادية، نقابة المشاريع الكبرى وبنك الفرص الاستراتيجية 2030-2045
            </h1>
            <p className="text-stone-300 text-sm leading-relaxed">
              منظومة إقليمية لتمويل المشاريع العملاقة المهيكلة للاقتصاد العربي عبر الشراكات الاستراتيجية بين كبرى الصناديق السيادية (PIF، ADIA، KIA، QIA، ومبادلة وصندوق مصر السيادي وإثمار)، مع محاكي توزيع المحافظ وعوائد الناتج المحلي وإصدار الصكوك الخضراء المشفرة.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onConsultAI?.('قدم لي تقييماً استراتيجياً شاملاً لفرص التمويل المشترك للمشاريع الكبرى العربية (أوكساجون، رأس الحكمة، ممر الدقم، وطريق التنمية) ومعدلات العائد الداخلي المتوقعة')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#1bb49e] to-[#148373] hover:from-[#169683] hover:to-[#0f675a] text-[#071a2b] font-black text-xs transition-all shadow-lg shadow-[#1bb49e]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>استشارة DARB AI السيادية</span>
            </button>
          </div>
        </div>

        {/* Global Sovereign Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-[#1bb49e]" />
              إجمالي الأصول المدارة (AUM)
            </div>
            <div className="text-lg font-black text-[#8be4d4] mt-1">
              ${(totalAumBillion / 1000).toFixed(2)} تريليون
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">10 صناديق سيادية كبرى</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              حجم المشاريع المهيكلة
            </div>
            <div className="text-lg font-black text-amber-300 mt-1">
              ${totalSyndicateCapexBillion} مليار
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">8 مشاريع إقليمية مشتركة</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              متوسط العائد الداخلي (IRR)
            </div>
            <div className="text-lg font-black text-emerald-400 mt-1">
              14.8% سنوياً
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">مدعوم بضمانات سيادية</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              الصكوك الخضراء المشفرة
            </div>
            <div className="text-lg font-black text-sky-300 mt-1">
              SHA-256 معتمد
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">حماية ضد التضخم ومخاطر الصرف</div>
          </div>
        </div>

        {/* Phase 14 Sub-Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto mt-6 pt-4 border-t border-white/10 scrollbar-none">
          <button
            onClick={() => setActiveSubTab('syndicates')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'syndicates'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-md shadow-[#1bb49e]/30'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>نقابة المشاريع الكبرى (Syndicates)</span>
            <span className="bg-[#071a2b]/20 px-1.5 py-0.5 rounded text-[10px]">8 مشاريع</span>
          </button>

          <button
            onClick={() => setActiveSubTab('funds')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'funds'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-md shadow-[#1bb49e]/30'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>تحالف الصناديق السيادية (Consortium)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('opportunities')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'opportunities'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-md shadow-[#1bb49e]/30'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>بنك الفرص الاستراتيجية 2030-2045</span>
          </button>

          <button
            onClick={() => setActiveSubTab('simulator')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'simulator'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-md shadow-[#1bb49e]/30'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>محاكي توزيع المحافظ ومضاعف الناتج</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sukuk')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'sukuk'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-md shadow-[#1bb49e]/30'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>مولّد الصكوك الخضراء السيادية</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: MEGAPROJECT SYNDICATES                                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'syndicates' && (
        <div className="space-y-6">
          {/* Sector Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300">
              <Filter className="w-4 h-4 text-[#1bb49e]" />
              <span>تصفية المشاريع بحسب القطاع الاستراتيجي:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'كافة القطاعات' },
                { id: 'مدن ذكية ومجمعات لوجستية', label: 'مدن ذكية ولوجستيات' },
                { id: 'طاقة متجددة وهيدروجين أخضر', label: 'طاقة وهيدروجين أخضر' },
                { id: 'بنية تحتية وموانئ استراتيجية', label: 'موانئ وسكك حديدية' },
                { id: 'أمن غذائي واستصلاح أراضي', label: 'أمن غذائي وزراعة' },
                { id: 'أشباه موصلات ومراكز ذكاء اصطناعي', label: 'حوسبة وذكاء اصطناعي' }
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setSectorFilter(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sectorFilter === s.id
                      ? 'bg-[#1bb49e] text-[#071a2b]'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Syndicates List */}
            <div className="lg:col-span-5 space-y-3 max-h-[720px] overflow-y-auto pr-1">
              {filteredSyndicates.map(syn => {
                const isSelected = selectedSyndicate.syndicate_id === syn.syndicate_id;
                const fundingPct = Math.round((syn.committed_funding_usd / syn.syndicated_funding_target_usd) * 100);

                return (
                  <div
                    key={syn.syndicate_id}
                    onClick={() => setSelectedSyndicate(syn)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#071a2b] to-[#0d2a45] text-white border-[#1bb49e] shadow-lg ring-2 ring-[#1bb49e]/30'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-[#1bb49e]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{syn.flag}</span>
                        <div>
                          <h4 className="text-sm font-black leading-snug">{syn.project_name_ar}</h4>
                          <span className={`text-[11px] font-semibold ${isSelected ? 'text-[#8be4d4]' : 'text-stone-500 dark:text-stone-400'}`}>
                            {syn.host_country_name_ar} • {syn.sector}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        syn.status_ar === 'اكتمل الإغلاق المالي'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {syn.status_ar}
                      </span>
                    </div>

                    {/* Progress Bars */}
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className={isSelected ? 'text-stone-300' : 'text-stone-500'}>
                          التمويل الملتزم به: ${syn.committed_funding_usd} من ${syn.syndicated_funding_target_usd} مليار
                        </span>
                        <span className="text-[#1bb49e] font-black">{fundingPct}%</span>
                      </div>
                      <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-l from-[#1bb49e] to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, fundingPct)}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px]">
                      <span className={isSelected ? 'text-stone-300' : 'text-stone-500'}>
                        العائد المستهدف: <strong className="text-emerald-400">{syn.target_irr_pct}% IRR</strong>
                      </span>
                      <span className={isSelected ? 'text-stone-300' : 'text-stone-500'}>
                        سنة الإنجاز: <strong>{syn.completion_year}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Syndicate Detailed View */}
            <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedSyndicate.flag}</span>
                  <div>
                    <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
                      {selectedSyndicate.project_name_ar}
                    </h3>
                    <p className="text-xs font-semibold text-[#1bb49e]">
                      الدولة المضيفة: {selectedSyndicate.host_country_name_ar} • قطاع: {selectedSyndicate.sector}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSukukSyndicateId(selectedSyndicate.syndicate_id);
                    setActiveSubTab('sukuk');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#071a2b] hover:bg-[#0d2a45] text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4 text-[#1bb49e]" />
                  <span>إصدار صكوك خضراء للمشروع</span>
                </button>
              </div>

              {/* Big KPI Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <div className="text-[10px] text-stone-500 font-bold">التكلفة الرأسمالية الكلية</div>
                  <div className="text-base font-black text-stone-900 dark:text-stone-100 mt-1">
                    ${selectedSyndicate.total_capex_billion_usd} مليار
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <div className="text-[10px] text-stone-500 font-bold">المستهدف في الطرح</div>
                  <div className="text-base font-black text-[#1bb49e] mt-1">
                    ${selectedSyndicate.syndicated_funding_target_usd} مليار
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <div className="text-[10px] text-stone-500 font-bold">معدل العائد الداخلي (IRR)</div>
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {selectedSyndicate.target_irr_pct}% سنوياً
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <div className="text-[10px] text-stone-500 font-bold">فرص العمل المستهدفة</div>
                  <div className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-1">
                    {selectedSyndicate.jobs_created.toLocaleString('ar-EG')} فرصة
                  </div>
                </div>
              </div>

              {/* Participating Funds Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-stone-800 dark:text-stone-200 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-[#1bb49e]" />
                  <span>الصناديق والجهات السيادية المساهمة في الكونسورتيوم:</span>
                </h4>
                <div className="space-y-2">
                  {selectedSyndicate.participating_funds.map((pf, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2 font-bold">
                        <span className="w-5 h-5 rounded-full bg-[#1bb49e]/20 text-[#1bb49e] flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        <span>{pf.fund_name_ar}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-stone-500">حصة ملكية: <strong className="text-stone-800 dark:text-stone-200">{pf.equity_share_pct}%</strong></span>
                        <span className="text-[#1bb49e] font-black">${pf.contribution_billion_usd} مليار</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sovereign Guarantee & ESG */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>الضمانة والحصانة السيادية الممنوحة:</span>
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-semibold">
                    {selectedSyndicate.sovereign_guarantee_ar}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 space-y-1">
                  <div className="text-[11px] font-black text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4" />
                    <span>معيار الاستدامة والحوكمة (ESG):</span>
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-semibold">
                    {selectedSyndicate.esg_rating}
                  </p>
                </div>
              </div>

              {/* Key Contractors */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                <div className="text-[11px] font-bold text-stone-500 mb-2">التحالفات الهندسية والمقاولون الرئيسيون:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSyndicate.key_contractors_ar.map((c, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold border border-stone-200 dark:border-stone-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: SOVEREIGN FUNDS CONSORTIUM                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'funds' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Fund Selection Cards */}
          <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {SOVEREIGN_WEALTH_FUNDS.map(fund => {
              const isSelected = selectedFund.fund_id === fund.fund_id;
              return (
                <div
                  key={fund.fund_id}
                  onClick={() => setSelectedFund(fund)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#071a2b] to-[#0c2a42] text-white border-[#1bb49e] shadow-md ring-2 ring-[#1bb49e]/30'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-[#1bb49e]/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{fund.flag}</span>
                      <div>
                        <h4 className="text-sm font-black">{fund.fund_name_ar}</h4>
                        <span className={`text-[11px] font-semibold ${isSelected ? 'text-[#8be4d4]' : 'text-stone-500 dark:text-stone-400'}`}>
                          {fund.country_name_ar} • المقر: {fund.headquarters_city}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#1bb49e] bg-[#1bb49e]/10 px-2.5 py-1 rounded-xl">
                      ${fund.aum_billion_usd} مليار
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className={isSelected ? 'text-stone-300' : 'text-stone-500'}>
                      حصة الاستثمار الإقليمي المشترك: <strong>{fund.co_investment_allocation_pct}%</strong>
                    </span>
                    <span className="text-amber-400 font-bold">{fund.sovereign_credit_rating}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fund Details */}
          <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedFund.flag}</span>
                <div>
                  <h3 className="text-xl font-black text-stone-900 dark:text-stone-100">{selectedFund.fund_name_ar}</h3>
                  <div className="text-xs text-stone-500 font-semibold">{selectedFund.fund_name_en} • تأسس عام {selectedFund.established_year}</div>
                </div>
              </div>

              {onSelectCountry && (
                <button
                  onClick={() => onSelectCountry(selectedFund.country_code)}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>ملف الدولة الكامل</span>
                  <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              )}
            </div>

            {/* Fund Philosophy */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-50 to-stone-100 dark:from-stone-800/50 dark:to-stone-800/30 border border-stone-200 dark:border-stone-700">
              <div className="text-xs font-black text-[#1bb49e] mb-1">الفلسفة الاستثمارية السيادية:</div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-semibold">
                {selectedFund.investment_philosophy_ar}
              </p>
            </div>

            {/* Key Fund Numbers */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#071a2b] text-white text-center">
                <div className="text-[10px] text-stone-300 font-bold">الأصول المدارة (AUM)</div>
                <div className="text-xl font-black text-[#8be4d4] mt-1">${selectedFund.aum_billion_usd} مليار</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#071a2b] text-white text-center">
                <div className="text-[10px] text-stone-300 font-bold">التصنيف الائتماني</div>
                <div className="text-xl font-black text-amber-300 mt-1">{selectedFund.sovereign_credit_rating}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#071a2b] text-white text-center">
                <div className="text-[10px] text-stone-300 font-bold">المشاريع المشتركة النشطة</div>
                <div className="text-xl font-black text-emerald-400 mt-1">{selectedFund.active_syndicates_count} مشروعاً</div>
              </div>
            </div>

            {/* Strategic Sectors */}
            <div className="space-y-2">
              <div className="text-xs font-black text-stone-800 dark:text-stone-200">القطاعات ذات الأولوية في التمويل:</div>
              <div className="flex flex-wrap gap-2">
                {selectedFund.strategic_sectors_ar.map((sec, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-[#1bb49e]/10 text-[#0f675a] dark:text-[#8be4d4] border border-[#1bb49e]/30 text-xs font-bold"
                  >
                    {sec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: STRATEGIC OPPORTUNITIES BANK                                    */}
      {/* ========================================================================= */}
      {activeSubTab === 'opportunities' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STRATEGIC_OPPORTUNITIES_BANK.map(opp => {
              const isSelected = selectedOpp.opp_id === opp.opp_id;
              return (
                <div
                  key={opp.opp_id}
                  onClick={() => setSelectedOpp(opp)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#071a2b] to-[#0c2a42] text-white border-[#1bb49e] shadow-xl ring-2 ring-[#1bb49e]/40'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-[#1bb49e]/40 shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#1bb49e]/20 text-[#8be4d4] border border-[#1bb49e]/30">
                        {opp.target_sector_ar}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400">
                        عائد: {opp.expected_annual_return_pct}
                      </span>
                    </div>

                    <h4 className="text-sm font-black leading-snug">{opp.title_ar}</h4>

                    <div className="flex items-center gap-1.5 text-xs text-stone-400">
                      <span>الدول المعنية:</span>
                      {opp.location_countries.map((c, i) => (
                        <span key={i} className="inline-flex items-center gap-1 font-bold text-stone-200">
                          <span>{c.flag}</span>
                          <span>{c.name_ar}</span>
                        </span>
                      ))}
                    </div>

                    <p className={`text-xs line-clamp-3 leading-relaxed ${isSelected ? 'text-stone-300' : 'text-stone-600 dark:text-stone-400'}`}>
                      {opp.incentive_package_ar}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
                    <span className={isSelected ? 'text-stone-300' : 'text-stone-500'}>
                      أدنى تذكرة: <strong className="text-[#1bb49e]">${opp.minimum_ticket_million_usd}M</strong>
                    </span>
                    <span className="font-bold text-amber-400">محتوى محلي: {opp.local_content_requirement_pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Opportunity Modal Card */}
          <div className="bg-[#071a2b] border border-[#1bb49e]/40 rounded-3xl p-6 text-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#8be4d4] bg-[#1bb49e]/20 px-3 py-1 rounded-full">
                  فرصة استثمارية سيادية معتمدة
                </span>
                <h3 className="text-lg font-black mt-2 text-white">{selectedOpp.title_ar}</h3>
              </div>

              <button
                onClick={() => onConsultAI?.(`قدم لي دراسة جدوى استثمارية لفرصة: "${selectedOpp.title_ar}" بمبلغ لا يقل عن ${selectedOpp.minimum_ticket_million_usd} مليون دولار مع آليات التحوط ضد المخاطر وحوافز GAFTA`)}
                className="px-4 py-2.5 rounded-xl bg-[#1bb49e] hover:bg-[#169683] text-[#071a2b] font-black text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>طلب تدقيق دراسة الجدوى عبر الذكاء الاصطناعي</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[11px] text-stone-400 font-bold">مستوى الرعاية السيادية:</div>
                <div className="text-xs font-black text-emerald-400">{selectedOpp.sovereign_backing_level}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[11px] text-stone-400 font-bold">حالة الجاهزية التنظيمية:</div>
                <div className="text-xs font-black text-sky-400">{selectedOpp.readiness_status_ar}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[11px] text-stone-400 font-bold">التوافق الشرعي:</div>
                <div className="text-xs font-black text-amber-400">{selectedOpp.shariah_compliant ? 'متوافق مع المعايير الشرعية AAOIFI' : 'استثمار تجاري تقليدي'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: SOVEREIGN PORTFOLIO ALLOCATOR & SIMULATOR                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#1bb49e]" />
              <span>محددات المحفظة الاستثمارية:</span>
            </h3>

            {/* Capital Input */}
            <div className="space-y-2">
              <label className="text-xs font-black text-stone-700 dark:text-stone-300 flex justify-between">
                <span>رأس المال المخصص للاستثمار المشترك:</span>
                <span className="text-[#1bb49e] font-black">${simCapital} مليون دولار</span>
              </label>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={simCapital}
                onChange={e => setSimCapital(Number(e.target.value))}
                className="w-full accent-[#1bb49e] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-bold">
                <span>$50M</span>
                <span>$1,000M</span>
                <span>$3,000M</span>
              </div>
            </div>

            {/* Risk Profile Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black text-stone-700 dark:text-stone-300">نمط المخاطر وتوجه العائد:</label>
              <div className="space-y-2">
                {[
                  { id: 'conservative', title: 'محافظ ومضمون سيادياً', desc: 'تركيز على السندات والصكوك الخضراء والبنية التحتية وضمانات سيادية 95%' },
                  { id: 'balanced', title: 'متوازن ومدر للدخل (موصى به)', desc: 'توازن بين عوائد المشاريع اللوجستية والهيدروجين وتدفقات نقدية مستمرة' },
                  { id: 'aggressive', title: 'نمو تحويلي استراتيجي', desc: 'استثمار في الذكاء الاصطناعي السيادي والمدن الذكية والتقنيات العميقة' }
                ].map(r => (
                  <div
                    key={r.id}
                    onClick={() => setSimRisk(r.id as any)}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      simRisk === r.id
                        ? 'bg-[#1bb49e]/10 border-[#1bb49e] text-stone-900 dark:text-stone-100 font-black'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{r.title}</span>
                      {simRisk === r.id && <CheckCircle2 className="w-4 h-4 text-[#1bb49e]" />}
                    </div>
                    <div className="text-[10px] text-stone-500 font-normal mt-0.5">{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isCalculating}
              className="w-full py-3.5 rounded-2xl bg-[#1bb49e] hover:bg-[#169683] text-[#071a2b] font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {isCalculating ? (
                <span>جارٍ محاكاة التوزيع وتحليل العائد...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تنفيذ محاكاة العائد القومي والمحفظة</span>
                </>
              )}
            </button>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-8 space-y-6">
            {/* Impact Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#071a2b] to-[#0c2a42] text-white border border-[#1bb49e]/30">
                <div className="text-[10px] text-stone-300 font-bold">معدل العائد الداخلي (IRR)</div>
                <div className="text-xl font-black text-emerald-400 mt-1">{simResult.projected_irr_pct}%</div>
                <div className="text-[10px] text-stone-400 mt-0.5">سنوياً معدل بالمخاطر</div>
              </div>

              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#071a2b] to-[#0c2a42] text-white border border-[#1bb49e]/30">
                <div className="text-[10px] text-stone-300 font-bold">التدفق النقدي السنوي</div>
                <div className="text-xl font-black text-[#8be4d4] mt-1">${simResult.annual_cash_yield_million_usd}M</div>
                <div className="text-[10px] text-stone-400 mt-0.5">عوائد وأرباح موزعة</div>
              </div>

              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#071a2b] to-[#0c2a42] text-white border border-[#1bb49e]/30">
                <div className="text-[10px] text-stone-300 font-bold">مضاعف الناتج الإجمالي</div>
                <div className="text-xl font-black text-amber-300 mt-1">{simResult.national_gdp_multiplier}x</div>
                <div className="text-[10px] text-stone-400 mt-0.5">أثر تراكمي في الاقتصاد</div>
              </div>

              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#071a2b] to-[#0c2a42] text-white border border-[#1bb49e]/30">
                <div className="text-[10px] text-stone-300 font-bold">فرص العمل المستحدثة</div>
                <div className="text-xl font-black text-indigo-300 mt-1">{simResult.jobs_created_estimate.toLocaleString('ar-EG')}</div>
                <div className="text-[10px] text-stone-400 mt-0.5">وظيفة مباشرة وغير مباشرة</div>
              </div>
            </div>

            {/* Asset Allocation Breakdown */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1bb49e]" />
                <span>توزيع الأصول والمشاريع الموصى بها في المحفظة:</span>
              </h4>

              <div className="space-y-3">
                {simResult.allocated_assets.map((asset, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
                        <span className="text-lg">{asset.flag}</span>
                        <span>{asset.asset_name_ar}</span>
                        <span className="text-[10px] font-normal text-stone-500">({asset.sector_ar})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">IRR: {asset.expected_irr_pct}%</span>
                        <span className="font-black text-[#1bb49e]">${asset.ticket_million_usd}M ({asset.allocation_pct}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1bb49e] h-full rounded-full"
                        style={{ width: `${asset.allocation_pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Recommendations */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>التوصيات والتحوطات الاستثمارية:</span>
              </h4>
              <ul className="space-y-2">
                {simResult.strategic_recommendations_ar.map((rec, i) => (
                  <li key={i} className="text-xs text-stone-600 dark:text-stone-300 flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1bb49e] mt-1.5 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 5: SMART SOVEREIGN GREEN SUKUK TERM-SHEET ENGINE                   */}
      {/* ========================================================================= */}
      {activeSubTab === 'sukuk' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-500">اختر المشروع المستهدف للإصدار:</label>
                <select
                  value={sukukSyndicateId}
                  onChange={e => setSukukSyndicateId(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 cursor-pointer"
                >
                  {MEGAPROJECT_SYNDICATES.map(s => (
                    <option key={s.syndicate_id} value={s.syndicate_id}>
                      {s.project_name_ar} ({s.host_country_name_ar})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-500">حجم الإصدار (مليون دولار):</label>
                <input
                  type="number"
                  min="50"
                  max="2000"
                  step="50"
                  value={sukukTargetVolume}
                  onChange={e => setSukukTargetVolume(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 w-36"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateSukuk}
              className="px-5 py-2.5 rounded-xl bg-[#1bb49e] hover:bg-[#169683] text-[#071a2b] font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>توليد وتوثيق شروط الصكوك (Term Sheet)</span>
            </button>
          </div>

          {/* Official Document Viewer */}
          <div className="bg-[#0b1c2b] border-2 border-[#1bb49e]/40 rounded-3xl p-6 sm:p-10 text-white shadow-2xl space-y-6 relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-stone-700/10 text-8xl font-black rotate-[-20deg] pointer-events-none select-none">
              SOVEREIGN SUKUK
            </div>

            {/* Header Document */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/10">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 bg-[#1bb49e]/20 text-[#8be4d4] px-3 py-1 rounded-full text-xs font-black">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>وثيقة شروط الطرح السيادي الأخضر المعتمد (OFFICIAL TERM-SHEET)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">{currentSukuk.issuance_title_ar}</h2>
                <div className="text-xs text-stone-400">
                  معرف الإصدار: <span className="font-mono text-[#8be4d4]">{currentSukuk.sukuk_id}</span> • تاريخ الاعتماد: {currentSukuk.issuance_date}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print?.()}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة</span>
                </button>
              </div>
            </div>

            {/* Document Core Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-stone-400 font-bold">الجهة المصدرة:</span>
                <div className="font-black text-white">{currentSukuk.issuer_name_ar}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-stone-400 font-bold">حجم الإصدار والعملة:</span>
                <div className="font-black text-[#8be4d4]">${currentSukuk.target_volume_million_usd} مليون ({currentSukuk.currency})</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-stone-400 font-bold">عائد الكوبون والأجل:</span>
                <div className="font-black text-emerald-400">{currentSukuk.coupon_profit_rate_pct}% سنوياً • الأجل {currentSukuk.tenor_years} سنوات</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-stone-400 font-bold">الهيكل الشرعي المعتمد:</span>
                <div className="font-semibold text-stone-200">{currentSukuk.shariah_structure_ar}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-stone-400 font-bold">إطار الاستدامة والسندات الخضراء:</span>
                <div className="font-semibold text-stone-200">{currentSukuk.green_framework_ar}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-stone-400 font-bold">التحكيم والقانون الحاكم:</span>
                <div className="font-semibold text-stone-200">{currentSukuk.arbitration_center_ar}</div>
              </div>
            </div>

            {/* Use of Proceeds */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-black text-[#8be4d4]">أوجه استخدام عوائد الإصدار (Use of Proceeds):</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {currentSukuk.use_of_proceeds_ar.map((use, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-stone-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1bb49e] shrink-0 mt-0.5" />
                    <span>{use}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cryptographic Seal & SHA-256 */}
            <div className="p-4 rounded-2xl bg-black/40 border border-[#1bb49e]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-stone-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1bb49e]" />
                  <span>الختم المشفر والتوقيع السيادي الرقمي (SHA-256):</span>
                </div>
                <div className="font-mono text-xs text-[#8be4d4] break-all">
                  {currentSukuk.digital_cryptoseal_sha256}
                </div>
              </div>

              <button
                onClick={copySeal}
                className="px-4 py-2 rounded-xl bg-[#1bb49e]/20 hover:bg-[#1bb49e]/30 text-[#8be4d4] border border-[#1bb49e]/40 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedHash ? 'تم النسخ!' : 'نسخ الختم'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
