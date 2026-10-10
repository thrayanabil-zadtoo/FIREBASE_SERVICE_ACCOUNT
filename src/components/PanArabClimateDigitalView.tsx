import React, { useState, useEffect } from 'react';
import {
  Zap,
  Droplets,
  Cpu,
  Sparkles,
  CheckCircle2,
  Clock,
  Coins,
  ShieldCheck,
  Building2,
  ExternalLink,
  Layers,
  Search,
  Compass,
  FileCheck,
  TrendingUp,
  AlertCircle,
  Leaf,
  SlidersHorizontal,
  Radio
} from 'lucide-react';
import {
  PanArabClimateEnergyProfile,
  PanArabDigitalReadiness,
  PanArabDecisionSimulationResponse
} from '../types/country-profile';
import { fetchApi } from '../api';

const ARAB_COUNTRIES_SIMULATOR = [
  { code: 'SA', name: 'المملكة العربية السعودية', flag: '🇸🇦' },
  { code: 'AE', name: 'دولة الإمارات العربية المتحدة', flag: '🇦🇪' },
  { code: 'EG', name: 'جمهورية مصر العربية', flag: '🇪🇬' },
  { code: 'QA', name: 'دولة قطر', flag: '🇶🇦' },
  { code: 'KW', name: 'دولة الكويت', flag: '🇰🇼' },
  { code: 'OM', name: 'سلطنة عُمان', flag: '🇴🇲' },
  { code: 'BH', name: 'مملكة البحرين', flag: '🇧🇭' },
  { code: 'MA', name: 'المملكة المغربية', flag: '🇲🇦' },
  { code: 'JO', name: 'المملكة الأردنية الهاشمية', flag: '🇯🇴' }
];

interface PanArabClimateDigitalViewProps {
  onOpenAIWithPrompt?: (prompt: string) => void;
  onSelectCountryProfile?: (countryCode: string) => void;
}

export default function PanArabClimateDigitalView({
  onOpenAIWithPrompt,
  onSelectCountryProfile
}: PanArabClimateDigitalViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'climate_energy' | 'digital_ai' | 'decision_simulator'>('climate_energy');

  // Climate & Digital Data
  const [climateProfiles, setClimateProfiles] = useState<PanArabClimateEnergyProfile[]>([]);
  const [digitalData, setDigitalData] = useState<PanArabDigitalReadiness[]>([]);
  const [loadingBase, setLoadingBase] = useState(true);

  // Decision Simulator Inputs
  const [simCountry, setSimCountry] = useState('SA');
  const [simSector, setSimSector] = useState('ai_tech');
  const [simCapital, setSimCapital] = useState(2500000);
  const [simRisk, setSimRisk] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [simResult, setSimResult] = useState<PanArabDecisionSimulationResponse | null>(null);
  const [simLoading, setSimLoading] = useState(false);

  useEffect(() => {
    loadBaseData();
  }, []);

  useEffect(() => {
    runDecisionSimulation();
  }, [simCountry, simSector, simCapital, simRisk]);

  const loadBaseData = async () => {
    setLoadingBase(true);
    try {
      const [climateRes, digitalRes] = await Promise.all([
        fetchApi<any>('/api/countries/analytics/climate-energy'),
        fetchApi<any>('/api/countries/analytics/digital-readiness')
      ]);

      if (climateRes.ok && climateRes.data) {
        setClimateProfiles(climateRes.data);
      }
      if (digitalRes.ok && digitalRes.data) {
        setDigitalData(digitalRes.data);
      }
    } catch (err) {
      console.error('Failed to load climate & digital data', err);
    } finally {
      setLoadingBase(false);
    }
  };

  const runDecisionSimulation = async () => {
    setSimLoading(true);
    try {
      const res = await fetch('/api/countries/analytics/decision-simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country_code: simCountry,
          sector: simSector,
          capital_usd: simCapital,
          risk_tolerance: simRisk
        })
      });
      const data = await res.json();
      if (data.ok && data.data) {
        setSimResult(data.data);
      }
    } catch (err) {
      console.error('Decision simulation failed', err);
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <div id="pan-arab-climate-digital-view" className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-[#071a2b] text-white border border-stone-800 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-[#1bb49e]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#1bb49e]/20 text-[#8be4d4] text-[11px] font-bold mb-3 border border-[#1bb49e]/30">
              <Zap className="w-3.5 h-3.5" />
              <span>المرحلة السادسة: تحول الطاقة، الذكاء الاصطناعي، ومحاكي الاستثمار</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">مرصد الاستدامة والسيادة الرقمية ومحاكي القرارات الاستثمارية</h2>
            <p className="text-xs text-stone-300 max-w-2xl mt-1 leading-relaxed">
              تحليل القدرات الإنتاجية للطاقة النظيفة (الشمس والرياح والهيدروجين الأخضر) وتحلية المياه، مؤشرات الجاهزية للذكاء الاصطناعي ومراكز البيانات والكابلات البحرية، ومحاكي تفاعلي فوري لتقييم دراسات الجدوى الاستثمارية السيادية.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onOpenAIWithPrompt) {
                  onOpenAIWithPrompt(
                    'قدم لي تحليلاً مقارناً لاستراتيجيات التحول في الطاقة المتجددة (الطاقة الشمسية والهيدروجين الأخضر) ومراكز بيانات الذكاء الاصطناعي السيادي بين السعودية والإمارات ومصر والمغرب.'
                  );
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1bb49e] to-teal-500 text-[#071a2b] font-bold text-xs shadow-xs hover:brightness-105 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>استشارة الاستدامة والذكاء الاصطناعي مع AI</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('climate_energy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'climate_energy'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-xs'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>الطاقة المتجددة والأمن المائي والغذائي</span>
          </button>

          <button
            onClick={() => setActiveSubTab('digital_ai')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'digital_ai'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-xs'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>الجاهزية الرقمية والكابلات والذكاء الاصطناعي</span>
          </button>

          <button
            onClick={() => setActiveSubTab('decision_simulator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'decision_simulator'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-xs'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>محاكي القرارات الاستثمارية السيادية (Decision Simulator)</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SUBTAB 1: CLIMATE, RENEWABLE ENERGY & WATER SECURITY                  */}
      {/* ===================================================================== */}
      {activeSubTab === 'climate_energy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {climateProfiles.map((p) => (
              <div
                key={p.country_code}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:border-[#1bb49e] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{p.flag}</span>
                      <h3 className="text-sm font-bold text-stone-900">{p.country_name_ar}</h3>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                      حياد كربوني: {p.net_zero_target_year}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <span className="text-[10px] text-stone-400 block">طاقة شمسية:</span>
                      <strong className="text-stone-900 font-mono text-xs">{p.solar_capacity_mw.toLocaleString()} MW</strong>
                    </div>
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <span className="text-[10px] text-stone-400 block">طاقة الرياح:</span>
                      <strong className="text-stone-900 font-mono text-xs">{p.wind_capacity_mw.toLocaleString()} MW</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-stone-600">
                      <span>مشاريع الهيدروجين الأخضر:</span>
                      <strong className="text-[#1bb49e] font-bold">{p.green_hydrogen_projects_count} مشاريع كبرى</strong>
                    </div>
                    <div className="flex justify-between items-center text-stone-600">
                      <span>سعة تحلية المياه:</span>
                      <strong className="text-stone-900 font-mono">{p.desalination_capacity_m3_day}</strong>
                    </div>
                    <div className="flex justify-between items-center text-stone-600">
                      <span>مؤشر الأمن الغذائي:</span>
                      <strong className="text-emerald-800 font-mono">{p.food_security_index}/100</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 space-y-0.5">
                    <span className="font-bold block">إجهاد المياه:</span>
                    <span>{p.water_stress_level_ar}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">أبرز المحطات والمجمعات:</span>
                    <ul className="text-[11px] text-stone-700 space-y-0.5 list-disc list-inside">
                      {p.flagship_projects.map((proj, idx) => (
                        <li key={idx}>{proj}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex justify-end">
                  <button
                    onClick={() => {
                      if (onOpenAIWithPrompt) {
                        onOpenAIWithPrompt(
                          `قدم لي دراسة استشارية متعمقة لفرص الاستثمار في الطاقة المتجددة وتحلية المياه في ${p.country_name_ar}، وأبرز الحوافز الحكومية للمشاريع الخضراء.`
                        );
                      }
                    }}
                    className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#1bb49e]" />
                    <span>تحليل الطاقة الخضراء</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUBTAB 2: DIGITAL READINESS, SUBMARINE CABLES & SOVEREIGN AI          */}
      {/* ===================================================================== */}
      {activeSubTab === 'digital_ai' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {digitalData.map((d) => (
              <div
                key={d.country_code}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:border-[#1bb49e] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{d.flag}</span>
                      <h3 className="text-sm font-bold text-stone-900">{d.country_name_ar}</h3>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-teal-50 text-[#071a2b] border border-teal-200">
                      جاهزية AI: {d.ai_readiness_index}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <span className="text-[10px] text-stone-400 block">الحكومة الرقمية:</span>
                      <strong className="text-stone-900 text-xs">المركز #{d.digital_gov_rank_arab} عربياً</strong>
                    </div>
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <span className="text-[10px] text-stone-400 block">تغطية الجيل الخامس 5G:</span>
                      <strong className="text-emerald-800 font-mono text-xs">{d.five_g_coverage_pct}%</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <span className="text-stone-600">الكابلات البحرية المتصلة:</span>
                    <strong className="text-[#071a2b] font-mono font-bold flex items-center gap-1">
                      <Radio className="w-3.5 h-3.5 text-[#1bb49e]" />
                      {d.submarine_cables_count} كابل قاري ودولي
                    </strong>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">مبادرات الذكاء الاصطناعي والحوسبة السيادية:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {d.sovereign_cloud_ai_initiatives.map((init, i) => (
                        <span key={i} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200">
                          {init}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex justify-end">
                  <button
                    onClick={() => {
                      if (onOpenAIWithPrompt) {
                        onOpenAIWithPrompt(
                          `قدم لي تحليلاً للبنية التحتية الرقمية ومراكز البيانات ونماذج الذكاء الاصطناعي السيادي في ${d.country_name_ar}، وفرص تأسيس شركات التقنية المتقدمة.`
                        );
                      }
                    }}
                    className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#1bb49e]" />
                    <span>تحليل الجاهزية الرقمية</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUBTAB 3: STRATEGIC DECISION SIMULATOR                                */}
      {/* ===================================================================== */}
      {activeSubTab === 'decision_simulator' && (
        <div className="space-y-6">
          {/* Simulator Inputs Header */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#1bb49e]" />
              <span>حدد معايير الاستثمار المؤسسي لتوليد محاكاة الجدوى السيادية الفورية</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Country Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">الدولة المستهدفة:</label>
                <select
                  value={simCountry}
                  onChange={(e) => setSimCountry(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-hidden focus:border-[#1bb49e] transition-all cursor-pointer"
                >
                  {ARAB_COUNTRIES_SIMULATOR.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sector Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">القطاع الاستثماري:</label>
                <select
                  value={simSector}
                  onChange={(e) => setSimSector(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-hidden focus:border-[#1bb49e] transition-all cursor-pointer"
                >
                  <option value="ai_tech">الذكاء الاصطناعي ومراكز البيانات</option>
                  <option value="clean_energy">الطاقة النظيفة والهيدروجين</option>
                  <option value="logistics_trade">اللوجستيات وسلاسل الإمداد</option>
                  <option value="tourism_hospitality">السياحة والترفيه الفاخر</option>
                  <option value="industrial_manufacturing">الصناعات التحويلية المتقدمة</option>
                </select>
              </div>

              {/* Capital USD */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">حجم رأس المال الاستثماري:</label>
                <select
                  value={simCapital}
                  onChange={(e) => setSimCapital(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-hidden focus:border-[#1bb49e] transition-all cursor-pointer"
                >
                  <option value={500000}>$500,000 (مؤسسات ناشئة)</option>
                  <option value={2500000}>$2,500,000 (شركات متوسطة وتوسع إقليمي)</option>
                  <option value={10000000}>$10,000,000 (مشاريع صناعية وتقنية كبرى)</option>
                  <option value={50000000}>$50,000,000+ (شراكات سيادية ومصانع)</option>
                </select>
              </div>

              {/* Risk Tolerance */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">مستوى تقبل المخاطر:</label>
                <div className="grid grid-cols-3 gap-1 pt-0.5">
                  {(['conservative', 'balanced', 'aggressive'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSimRisk(r)}
                      className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                        simRisk === r
                          ? 'bg-[#071a2b] text-white border-[#071a2b]'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {r === 'conservative' ? 'محافظ' : r === 'balanced' ? 'متوازن' : 'جريء'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Simulation Output Card */}
          {simLoading ? (
            <div className="py-12 text-center bg-white border border-stone-200 rounded-2xl">
              <div className="w-10 h-10 border-3 border-[#1bb49e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-stone-500 font-semibold">جاري حساب الجدوى التنظيمية ومطابقة الحوافز الاستثمارية...</p>
            </div>
          ) : simResult ? (
            <div className="space-y-5">
              {/* Top Score Banner */}
              <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-stone-50 border border-teal-200 rounded-2xl p-5 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#071a2b] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <ShieldCheck className="w-6 h-6 text-[#8be4d4]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-500 mb-0.5">
                        <span>{simResult.flag} {simResult.country_name_ar}</span>
                        <span>•</span>
                        <span className="text-[#071a2b] font-extrabold">{simResult.sector_ar}</span>
                      </div>
                      <h4 className="text-base font-bold text-stone-900 leading-snug">
                        مؤشر الجدوى الاستثمارية: {simResult.viability_score}/100 | العائد التقديري: {simResult.projected_roi_pct}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                        {simResult.ai_executive_summary}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onOpenAIWithPrompt) {
                        onOpenAIWithPrompt(
                          `أنا مستثمر بصدد استثمار $${simCapital.toLocaleString()} في قطاع ${simResult.sector_ar} بـ ${simResult.country_name_ar}. قدم لي دراسة استشارية سيادية تشمل: تفاصيل التراخيص، الضرائب، التوطين، وأفضل السبل للاستفادة من مزايا ${simResult.recommended_free_zone}.`
                        );
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#071a2b] hover:bg-stone-800 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap self-start md:self-auto"
                  >
                    <Sparkles className="w-4 h-4 text-[#8be4d4]" />
                    <span>دراسة الجدوى الكاملة مع AI</span>
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
                  <span className="text-xs text-stone-500 block">الوضوح التنظيمي والاستقرار:</span>
                  <div className="text-xl font-extrabold text-stone-900 mt-1">
                    {simResult.regulatory_clarity_score}/100
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">بيئة تشريعية متطورة وحماية للمستثمرين</span>
                </div>

                <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
                  <span className="text-xs text-stone-500 block">الموقع الجغرافي المقترح:</span>
                  <div className="text-sm font-bold text-stone-900 mt-1">
                    {simResult.recommended_free_zone}
                  </div>
                  <span className="text-[11px] text-[#1bb49e] font-semibold block mt-0.5">منطقة حرة معفاة من الرسوم والضرائب</span>
                </div>

                <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
                  <span className="text-xs text-stone-500 block">فرصة الاستثمار المشترك السيادي:</span>
                  <div className={`text-sm font-bold mt-1 ${simResult.sovereign_fund_co_investment_possible ? 'text-purple-800' : 'text-stone-600'}`}>
                    {simResult.sovereign_fund_co_investment_possible ? 'متاحة ومؤهلة للصناديق السيادية ⭐' : 'استثمار مباشر عبر القطاع الخاص'}
                  </div>
                  <span className="text-[11px] text-stone-400 block mt-0.5">تعتمد على حجم المشروع والمواءمة الاستراتيجية</span>
                </div>
              </div>

              {/* Incentives & Risks Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-2.5">
                  <h5 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>أبرز الحوافز والضمانات المتاحة للمشروع:</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-stone-700 list-disc list-inside">
                    {simResult.key_incentives.map((inc, i) => (
                      <li key={i} className="leading-relaxed">{inc}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-2.5">
                  <h5 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>المخاطر الرئيسية واستراتيجيات التحوط:</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-stone-700 list-disc list-inside">
                    {simResult.primary_risks.map((risk, i) => (
                      <li key={i} className="leading-relaxed">{risk}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
