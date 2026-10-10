import React, { useState, useEffect } from 'react';
import {
  Zap,
  Coins,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Globe2,
  RefreshCw,
  Printer,
  ChevronRight,
  Share2,
  Sliders,
  BarChart3,
  Sparkles,
  Building,
  Anchor,
  Clock,
  ExternalLink
} from 'lucide-react';
import {
  PanArabPowerGridProject,
  PanArabDigitalSettlementChannel,
  PanArabSovereignImpactResult
} from '../types/country-profile';
import { fetchApi } from '../api';

interface PanArabSovereignIntegrationViewProps {
  onSelectCountry?: (countryCode: string) => void;
  onConsultAI?: (prompt: string) => void;
}

export const PanArabSovereignIntegrationView: React.FC<PanArabSovereignIntegrationViewProps> = ({
  onSelectCountry,
  onConsultAI
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'simulator' | 'power_grid' | 'settlement'>('simulator');

  // Simulator Inputs
  const [originCountry, setOriginCountry] = useState<string>('SA');
  const [partnerCountries, setPartnerCountries] = useState<string[]>(['EG', 'AE', 'JO']);
  const [sector, setSector] = useState<string>('الصناعات التحويلية والطاقة النظيفة');
  const [investmentTicket, setInvestmentTicket] = useState<number>(25000000);
  const [annualTradeVolume, setAnnualTradeVolume] = useState<number>(18000000);
  const [useGafta, setUseGafta] = useState<boolean>(true);
  const [useFreeZones, setUseFreeZones] = useState<boolean>(true);
  const [useDigitalSettlement, setUseDigitalSettlement] = useState<boolean>(true);
  const [usePowerGrid, setUsePowerGrid] = useState<boolean>(true);

  // Simulator Result
  const [impactResult, setImpactResult] = useState<PanArabSovereignImpactResult | null>(null);
  const [calculatingImpact, setCalculatingImpact] = useState<boolean>(false);

  // Data States
  const [gridProjects, setGridProjects] = useState<PanArabPowerGridProject[]>([]);
  const [settlementChannels, setSettlementChannels] = useState<PanArabDigitalSettlementChannel[]>([]);
  const [loadingGrid, setLoadingGrid] = useState<boolean>(true);
  const [loadingSettlement, setLoadingSettlement] = useState<boolean>(true);

  const loadGridProjects = async () => {
    setLoadingGrid(true);
    try {
      const res = await fetchApi<{ ok: boolean; data: PanArabPowerGridProject[] }>('/api/countries/analytics/power-grid-projects');
      if (res?.data) {
        setGridProjects(res.data);
      }
    } catch (e) {
      console.error('Failed to load power grid projects', e);
    } finally {
      setLoadingGrid(false);
    }
  };

  const loadSettlementChannels = async () => {
    setLoadingSettlement(true);
    try {
      const res = await fetchApi<{ ok: boolean; data: PanArabDigitalSettlementChannel[] }>('/api/countries/analytics/digital-settlement-channels');
      if (res?.data) {
        setSettlementChannels(res.data);
      }
    } catch (e) {
      console.error('Failed to load settlement channels', e);
    } finally {
      setLoadingSettlement(false);
    }
  };

  const calculateImpact = async () => {
    setCalculatingImpact(true);
    try {
      const res = await fetchApi<{ ok: boolean; data: PanArabSovereignImpactResult }>('/api/countries/analytics/sovereign-impact/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin_country: originCountry,
          partner_countries: partnerCountries,
          sector: sector,
          investment_ticket_usd: investmentTicket,
          annual_trade_volume_usd: annualTradeVolume,
          utilize_gafta_exemption: useGafta,
          utilize_free_zones: useFreeZones,
          utilize_digital_settlement: useDigitalSettlement,
          utilize_power_grid_benefits: usePowerGrid
        })
      });
      if (res?.data) {
        setImpactResult(res.data);
      }
    } catch (e) {
      console.error('Failed to calculate sovereign impact', e);
    } finally {
      setCalculatingImpact(false);
    }
  };

  useEffect(() => {
    loadGridProjects();
    loadSettlementChannels();
    calculateImpact();
  }, []);

  const togglePartner = (code: string) => {
    if (partnerCountries.includes(code)) {
      if (partnerCountries.length > 1) {
        setPartnerCountries(partnerCountries.filter(c => c !== code));
      }
    } else {
      setPartnerCountries([...partnerCountries, code]);
    }
  };

  return (
    <div id="pan-arab-sovereign-integration-view" className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#051424] via-[#092238] to-[#061828] border border-[#1bb49e]/30 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#1bb49e]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1bb49e]/20 border border-[#1bb49e]/40 text-[#1bb49e] text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>المرحلة العاشرة: الربط الكهربائي الإقليمي وتسوية CBDC وحاسبة الأثر السيادي</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              منظومة التكامل السيادي الكبرى، شبكات الطاقة، وتسوية العملات اللحظية
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              ذروة التكامل العربي المشترك: خطوط الربط الكهربائي فائق الجهد (HVDC)، ممرات الهيدروجين النظيف، منصات تسوية العملات الرقمية للبنوك المركزية (mBridge & Buna)، ومحاكي احتساب الأثر السيادي الشامل والعائد الاستثماري.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onConsultAI?.('قم بتحليل متعمق لفرص الربط الكهربائي العربي ومشاريع الهيدروجين الأخضر والتسوية عبر mBridge')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1bb49e] to-[#159482] text-[#071a2b] font-extrabold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>استشارة استراتيجية حول التكامل السيادي</span>
            </button>
          </div>
        </div>

        {/* Phase 10 Sub-Tabs */}
        <div className="mt-8 flex items-center gap-2 border-b border-white/10 pb-1 overflow-x-auto scrollbar-none">
          <button
            id="subtab-simulator"
            onClick={() => setActiveSubTab('simulator')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'simulator'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-md'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>حاسبة ومحاكي الأثر السيادي الشامل (Pan-Arab ROI)</span>
          </button>

          <button
            id="subtab-power-grid"
            onClick={() => setActiveSubTab('power_grid')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'power_grid'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-md'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>شبكات الربط الكهربائي وممرات الهيدروجين ({gridProjects.length})</span>
          </button>

          <button
            id="subtab-settlement"
            onClick={() => setActiveSubTab('settlement')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'settlement'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-md'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>منصات التسوية الفورية والعملات الرقمية CBDC (3)</span>
          </button>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* 1. COMPREHENSIVE SOVEREIGN IMPACT & ROI SIMULATOR                      */}
      {/* ====================================================================== */}
      {activeSubTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="font-extrabold text-stone-900 dark:text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#1bb49e]" />
                <span>معطيات الشراكة والمشروع الاستثماري</span>
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-500 font-bold mb-1">دولة انطلاق المشروع / المستثمر الأساسي</label>
                <select
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-bold"
                >
                  <option value="SA">🇸🇦 المملكة العربية السعودية</option>
                  <option value="AE">🇦🇪 الإمارات العربية المتحدة</option>
                  <option value="EG">🇪🇬 جمهورية مصر العربية</option>
                  <option value="MA">🇲🇦 المملكة المغربية</option>
                  <option value="JO">🇯🇴 المملكة الأردنية الهاشمية</option>
                  <option value="OM">🇴🇲 سلطنة عُمان</option>
                  <option value="QA">🇶🇦 دولة قطر</option>
                  <option value="KW">🇰🇼 دولة الكويت</option>
                  <option value="BH">🇧🇭 مملكة البحرين</option>
                  <option value="DZ">🇩🇿 الجمهورية الجزائرية</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-500 font-bold mb-1.5">
                  الدول العربية الشريكة في سلاسل الإمداد والاستثمار:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { code: 'EG', flag: '🇪🇬', name: 'مصر' },
                    { code: 'SA', flag: '🇸🇦', name: 'السعودية' },
                    { code: 'AE', flag: '🇦🇪', name: 'الإمارات' },
                    { code: 'JO', flag: '🇯🇴', name: 'الأردن' },
                    { code: 'MA', flag: '🇲🇦', name: 'المغرب' },
                    { code: 'OM', flag: '🇴🇲', name: 'عُمان' },
                    { code: 'QA', flag: '🇶🇦', name: 'قطر' },
                    { code: 'KW', flag: '🇰🇼', name: 'الكويت' },
                    { code: 'BH', flag: '🇧🇭', name: 'البحرين' }
                  ].map(c => {
                    const isSelected = partnerCountries.includes(c.code);
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => togglePartner(c.code)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                          isSelected
                            ? 'bg-[#1bb49e]/15 border-[#1bb49e] text-[#1bb49e]'
                            : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500'
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-stone-500 font-bold mb-1">القطاع الاقتصادي</label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-bold"
                >
                  <option value="الصناعات التحويلية والطاقة النظيفة">الصناعات التحويلية والطاقة النظيفة والهيدروجين</option>
                  <option value="الصناعات الطبية والدوائية">الصناعات الطبية والدوائية والتكنولوجيا الحيوية</option>
                  <option value="التكنولوجيا الزراعية والأمن الغذائي">التكنولوجيا الزراعية والأمن الغذائي وسلاسل التبريد</option>
                  <option value="الاقتصاد الرقمي ومراكز البيانات">الاقتصاد الرقمي، مراكز البيانات، والتكنولوجيا المالية</option>
                  <option value="اللوجستيات والشحن متعدد الوسائط">اللوجستيات والشحن البري والبحري متعدد الوسائط</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-500 font-bold mb-1">قيمة الاستثمار الرأسمالي ($)</label>
                  <input
                    type="number"
                    value={investmentTicket}
                    onChange={(e) => setInvestmentTicket(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-500 font-bold mb-1">حجم التبادل التجاري السنوي ($)</label>
                  <input
                    type="number"
                    value={annualTradeVolume}
                    onChange={(e) => setAnnualTradeVolume(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <span className="text-[11px] font-extrabold text-stone-400 block">قنوات الاستفادة التكاملية المفعلة:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useGafta}
                    onChange={(e) => setUseGafta(e.target.checked)}
                    className="rounded accent-[#1bb49e]"
                  />
                  <span className="text-stone-700 dark:text-stone-300 font-medium">الإعفاء الجمركي الكامل (اتفاقية GAFTA 0%)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useFreeZones}
                    onChange={(e) => setUseFreeZones(e.target.checked)}
                    className="rounded accent-[#1bb49e]"
                  />
                  <span className="text-stone-700 dark:text-stone-300 font-medium">حوافز المناطق الحرة (0% ضريبة شركات وملكية 100%)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useDigitalSettlement}
                    onChange={(e) => setUseDigitalSettlement(e.target.checked)}
                    className="rounded accent-[#1bb49e]"
                  />
                  <span className="text-stone-700 dark:text-stone-300 font-medium">التسوية اللحظية بالعملات المحلية (منصات بُنى / آفاق / mBridge)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usePowerGrid}
                    onChange={(e) => setUsePowerGrid(e.target.checked)}
                    className="rounded accent-[#1bb49e]"
                  />
                  <span className="text-stone-700 dark:text-stone-300 font-medium">وفورات استهلاك الطاقة وتبادل أحمال الذروة الكهربائية</span>
                </label>
              </div>

              <button
                id="btn-calculate-sovereign-impact"
                onClick={calculateImpact}
                disabled={calculatingImpact}
                className="w-full py-2.5 rounded-xl bg-[#1bb49e] text-[#071a2b] font-black text-xs hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                {calculatingImpact ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري احتساب النموذج السيادي...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    <span>احتساب الأثر السيادي والجدوى التكاملية</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Summary (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {impactResult && (
              <div className="space-y-4">
                {/* Score & Main Badge */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#071b2d] via-[#0d2e4c] to-[#081a2b] border border-[#1bb49e]/50 text-white shadow-xl space-y-6">
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-stone-400 font-mono tracking-widest uppercase">
                        SOVEREIGN SYNERGY EVALUATION
                      </span>
                      <h4 className="text-xl font-extrabold text-white">
                        درجة التكامل والجدوى السيادية:
                      </h4>
                      <span className="inline-block px-3 py-1 rounded-full bg-[#1bb49e]/20 text-[#1bb49e] font-black text-xs border border-[#1bb49e]/40">
                        {impactResult.strategic_synergy_grade}
                      </span>
                    </div>

                    <div className="text-left font-mono space-y-0.5">
                      <div className="text-[10px] text-stone-400">العائد المتوقع على 5 سنوات</div>
                      <div className="text-3xl font-black text-emerald-400">
                        {impactResult.projected_5yr_roi_pct}%
                      </div>
                      <div className="text-[10px] text-stone-400">ROI التراكمي</div>
                    </div>
                  </div>

                  {/* 4 Metric Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[10px] text-stone-400 block">الوفر السنوي الإجمالي</span>
                      <span className="text-base font-black text-[#1bb49e]">
                        ${(impactResult.total_annual_cost_savings_usd / 1000000).toFixed(2)}M
                      </span>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[10px] text-stone-400 block">صافي القيمة التراكمية (5 سنوات)</span>
                      <span className="text-base font-black text-emerald-400">
                        ${(impactResult.net_5yr_economic_value_usd / 1000000).toFixed(1)}M
                      </span>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[10px] text-stone-400 block">وفورات الجمارك (GAFTA)</span>
                      <span className="text-base font-black text-blue-400">
                        ${(impactResult.customs_savings_usd / 1000000).toFixed(2)}M
                      </span>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[10px] text-stone-400 block">فرص العمل النوعية المباشرة</span>
                      <span className="text-base font-black text-amber-400">
                        +{impactResult.direct_jobs_created.toLocaleString('ar-EG')}
                      </span>
                    </div>
                  </div>

                  {/* Savings Breakdown Grid */}
                  <div className="space-y-2 text-xs">
                    <span className="font-extrabold text-stone-300 block">تفصيل الوفورات السنوية المحققة:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 bg-white/5 rounded-lg flex justify-between items-center">
                        <span className="text-stone-400">وفورات إعفاءات المناطق الحرة:</span>
                        <span className="font-bold text-white">${impactResult.tax_incentive_savings_usd.toLocaleString('en-US')}</span>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-lg flex justify-between items-center">
                        <span className="text-stone-400">وفورات التسوية (Buna/AFAQ):</span>
                        <span className="font-bold text-white">${impactResult.digital_settlement_savings_usd.toLocaleString('en-US')}</span>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-lg flex justify-between items-center">
                        <span className="text-stone-400">وفورات شبكات الربط الكهربائي:</span>
                        <span className="font-bold text-white">${impactResult.energy_grid_savings_usd.toLocaleString('en-US')}</span>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-lg flex justify-between items-center">
                        <span className="text-stone-400">وفورات الجمارك السنوية:</span>
                        <span className="font-bold text-white">${impactResult.customs_savings_usd.toLocaleString('en-US')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Synthesis Note */}
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-stone-300 leading-relaxed">
                    <strong className="text-white block mb-1">الخلاصة الاستراتيجية التنفيذية:</strong>
                    {impactResult.strategic_takeaway_ar}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-all cursor-pointer flex items-center gap-2 border border-stone-200 dark:border-stone-700"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة تقرير الأثر السيادي (PDF)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 2. POWER GRID & GREEN HYDROGEN ENERGY CORRIDORS                        */}
      {/* ====================================================================== */}
      {activeSubTab === 'power_grid' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gridProjects.map((p) => (
              <div
                key={p.project_id}
                id={`grid-card-${p.project_id}`}
                className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Participating Flags */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {p.participating_countries.map(c => (
                        <span
                          key={c.country_code}
                          onClick={() => onSelectCountry?.(c.country_code)}
                          className="text-lg cursor-pointer hover:scale-110 transition-transform"
                          title={c.name_ar}
                        >
                          {c.flag}
                        </span>
                      ))}
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      {p.status_ar}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-stone-900 dark:text-white leading-snug">
                    {p.project_name_ar}
                  </h4>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100 dark:border-stone-800">
                    <div>
                      <span className="text-[10px] text-stone-400 block">سعة النقل والتبادل:</span>
                      <span className="font-extrabold text-stone-900 dark:text-white">
                        {p.transmission_capacity_mw.toLocaleString('ar-EG')} MW
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">حجم الاستثمار:</span>
                      <span className="font-extrabold text-[#1bb49e]">
                        ${(p.total_investment_usd_million / 1000).toFixed(2)}B
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">نوع التكنولوجيا:</span>
                      <span className="font-bold text-stone-700 dark:text-stone-300">{p.technology_type}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">حصة الطاقة النظيفة:</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        {p.clean_energy_share_pct}%
                      </span>
                    </div>
                  </div>

                  {/* Peak Benefit */}
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {p.peak_offset_benefit_ar}
                  </p>

                  {/* Substations */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-stone-400 block">محطات التحويل والربط الرئيسية:</span>
                    <div className="flex flex-wrap gap-1">
                      {p.key_substations_ar.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-bold text-stone-600 dark:text-stone-400"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onConsultAI?.(`قدم لي تحليلاً فنياً واستثمارياً لمشروع: ${p.project_name_ar}`)}
                  className="w-full mt-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#1bb49e] hover:text-[#071a2b] text-stone-800 dark:text-stone-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تحليل فني عبر الذكاء الاصطناعي</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 3. DIGITAL SETTLEMENT & CBDC PLATFORMS (mBridge & Buna)                 */}
      {/* ====================================================================== */}
      {activeSubTab === 'settlement' && (
        <div className="space-y-6">
          {/* System Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {settlementChannels.map((s) => (
              <div
                key={s.system_id}
                id={`settlement-card-${s.system_id}`}
                className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1bb49e]/15 text-[#1bb49e] text-[10px] font-extrabold">
                      {s.operator_ar}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      وفر {s.cost_saving_vs_swift_pct}% vs SWIFT
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-stone-900 dark:text-white leading-snug">
                    {s.system_name_ar}
                  </h4>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {s.governance_model}
                  </p>

                  {/* Technical Specs */}
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-400">سرعة التسوية اللحظية:</span>
                      <span className="font-extrabold text-stone-900 dark:text-white">{s.average_settlement_speed_seconds} ثوانٍ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">حجم المعاملات اليومي:</span>
                      <span className="font-extrabold text-[#1bb49e]">${s.daily_volume_usd_million} مليون دولار</span>
                    </div>
                  </div>

                  {/* Supported Currencies */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-stone-400 block">العملات المدعومة:</span>
                    <div className="flex flex-wrap gap-1">
                      {s.supported_currencies.map((curr, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-[10px] font-bold text-blue-700 dark:text-blue-300"
                        >
                          {curr}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Use Cases */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-extrabold text-stone-400 block">حالات الاستخدام الرئيسية:</span>
                    <ul className="space-y-1 text-[11px] text-stone-600 dark:text-stone-400">
                      {s.use_cases_ar.map((uc, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-[#1bb49e] shrink-0 mt-0.5" />
                          <span>{uc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[10px] text-stone-400 block mb-1">البنوك المركزية المشاركة:</span>
                  <div className="text-[11px] font-bold text-stone-700 dark:text-stone-300 truncate">
                    {s.participating_central_banks.join(' • ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
