import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  Coins,
  ShieldCheck,
  Building2,
  ExternalLink,
  Layers,
  Search,
  Award,
  TrendingUp,
  MapPin,
  Compass,
  FileCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  PanArabLaborSectorDemand,
  PanArabSalaryBenchmark,
  PanArabAttestationGuide,
  PanArabRelocationStep,
  PanArabRelocationComparisonResult
} from '../types/country-profile';
import { fetchApi } from '../api';

const ARAB_COUNTRIES_LIST = [
  { code: 'SA', name: 'السعودية', flag: '🇸🇦' },
  { code: 'AE', name: 'الإمارات', flag: '🇦🇪' },
  { code: 'QA', name: 'قطر', flag: '🇶🇦' },
  { code: 'KW', name: 'الكويت', flag: '🇰🇼' },
  { code: 'OM', name: 'عُمان', flag: '🇴🇲' },
  { code: 'BH', name: 'البحرين', flag: '🇧🇭' },
  { code: 'EG', name: 'مصر', flag: '🇪🇬' },
  { code: 'JO', name: 'الأردن', flag: '🇯🇴' },
  { code: 'MA', name: 'المغرب', flag: '🇲🇦' }
];

interface PanArabLaborRelocationViewProps {
  onOpenAIWithPrompt?: (prompt: string) => void;
  onSelectCountryProfile?: (countryCode: string) => void;
}

export default function PanArabLaborRelocationView({
  onOpenAIWithPrompt,
  onSelectCountryProfile
}: PanArabLaborRelocationViewProps) {
  const [activeMainTab, setActiveMainTab] = useState<'labor_market' | 'relocation_planner'>('labor_market');

  // Labor Market State
  const [sectorDemands, setSectorDemands] = useState<PanArabLaborSectorDemand[]>([]);
  const [salaryBenchmarks, setSalaryBenchmarks] = useState<PanArabSalaryBenchmark[]>([]);
  const [selectedRoleIdx, setSelectedRoleIdx] = useState(0);
  const [attestationGuide, setAttestationGuide] = useState<PanArabAttestationGuide | null>(null);
  const [selectedAttestationCountry, setSelectedAttestationCountry] = useState('SA');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loadingLabor, setLoadingLabor] = useState(true);

  // Relocation Planner State
  const [selectedRelocationCandidates, setSelectedRelocationCandidates] = useState<string[]>(['SA', 'AE', 'QA']);
  const [relocationResult, setRelocationResult] = useState<PanArabRelocationComparisonResult | null>(null);
  const [loadingRelocation, setLoadingRelocation] = useState(false);

  // Local Checklist Progress
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('darb_relocation_checklist_v5');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    loadLaborData();
  }, []);

  useEffect(() => {
    loadAttestationGuide(selectedAttestationCountry);
  }, [selectedAttestationCountry]);

  useEffect(() => {
    loadRelocationPlan();
  }, [selectedRelocationCandidates]);

  const loadLaborData = async () => {
    setLoadingLabor(true);
    try {
      const [sectorsRes, salaryRes] = await Promise.all([
        fetchApi<any>('/api/countries/labor/sectors-demand'),
        fetchApi<any>('/api/countries/labor/salary-benchmarks')
      ]);
      if (sectorsRes.ok && sectorsRes.data) {
        setSectorDemands(sectorsRes.data);
      }
      if (salaryRes.ok && salaryRes.data) {
        setSalaryBenchmarks(salaryRes.data);
      }
    } catch (err) {
      console.error('Failed to load labor data', err);
    } finally {
      setLoadingLabor(false);
    }
  };

  const loadAttestationGuide = async (code: string) => {
    try {
      const res = await fetchApi<any>(`/api/countries/labor/attestation-guide/${code}`);
      if (res.ok && res.data) {
        setAttestationGuide(res.data);
      }
    } catch (err) {
      console.error('Failed to load attestation guide', err);
    }
  };

  const loadRelocationPlan = async () => {
    setLoadingRelocation(true);
    try {
      const codesStr = selectedRelocationCandidates.join(',');
      const res = await fetchApi<any>(`/api/countries/relocation/compare?codes=${codesStr}`);
      if (res.ok && res.data) {
        setRelocationResult(res.data);
      }
    } catch (err) {
      console.error('Failed to load relocation plan', err);
    } finally {
      setLoadingRelocation(false);
    }
  };

  const toggleCandidateCountry = (code: string) => {
    if (selectedRelocationCandidates.includes(code)) {
      if (selectedRelocationCandidates.length > 1) {
        setSelectedRelocationCandidates(selectedRelocationCandidates.filter(c => c !== code));
      }
    } else {
      if (selectedRelocationCandidates.length < 3) {
        setSelectedRelocationCandidates([...selectedRelocationCandidates, code]);
      } else {
        setSelectedRelocationCandidates([selectedRelocationCandidates[1], selectedRelocationCandidates[2], code]);
      }
    }
  };

  const toggleStep = (stepId: string) => {
    const updated = { ...checkedSteps, [stepId]: !checkedSteps[stepId] };
    setCheckedSteps(updated);
    try {
      localStorage.setItem('darb_relocation_checklist_v5', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredSectors = sectorDemands.filter(s =>
    categoryFilter === 'all' || s.category === categoryFilter
  );

  const selectedSalaryData = salaryBenchmarks[selectedRoleIdx] || salaryBenchmarks[0];

  const totalStepsCount = relocationResult?.common_steps?.length || 0;
  const completedStepsCount = relocationResult?.common_steps?.filter(s => checkedSteps[s.id]).length || 0;
  const progressPct = totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

  return (
    <div id="pan-arab-labor-relocation-view" className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-[#071a2b] text-white border border-stone-800 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-[#1bb49e]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#1bb49e]/20 text-[#8be4d4] text-[11px] font-bold mb-3 border border-[#1bb49e]/30">
              <Briefcase className="w-3.5 h-3.5" />
              <span>المرحلة الخامسة: الكفاءات، الرواتب، وخارطة الانتقال والاستقرار</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">مرصد سوق العمل ومخطط الانتقال والاستقرار العربي</h2>
            <p className="text-xs text-stone-300 max-w-2xl mt-1 leading-relaxed">
              تحليل المهن الأكثر طلباً عربياً، جدول مقارنة الرواتب التقديرية حسب مستويات الخبرة بالدولار والعملات المحلية، دليل معادلة وتصديق الشهادات، ومخطط الـ 90 يوماً للانتقال وتأسيس الأعمال.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onOpenAIWithPrompt) {
                  onOpenAIWithPrompt(
                    'أنا مهني / رائد أعمال أبحث عن الانتقال والاستقرار في دولة عربية. قدم لي خطة استشارية مهنية شاملة تتناول أفضل الأسواق لمهنتي، متوسط الرواتب المتوقع، ومتطلبات الترخيص والمعادلة.'
                  );
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1bb49e] to-teal-500 text-[#071a2b] font-bold text-xs shadow-xs hover:brightness-105 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>استشارة الانتقال والوظائف مع AI</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveMainTab('labor_market')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeMainTab === 'labor_market'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-xs'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>مرصد المهارات والرواتب ومعادلة الشهادات</span>
          </button>

          <button
            onClick={() => setActiveMainTab('relocation_planner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeMainTab === 'relocation_planner'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-xs'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>مخطط الانتقال والاستقرار الـ 90 يوماً</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: LABOR MARKET & SKILLS OBSERVATORY                               */}
      {/* ===================================================================== */}
      {activeMainTab === 'labor_market' && (
        <div className="space-y-6">
          {/* Section 1: In-Demand Sectors */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#1bb49e]" />
                  <span>القطاعات والمهن الأكثر طلباً ونمواً في الاقتصادات العربية 2025/2030</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  استناداً لمشاريع الرؤى الوطنية التنموية، الاستثمارات الرقمية، وتوسع الطاقة المتجددة والموانئ.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { key: 'all', label: 'كافة القطاعات' },
                  { key: 'technology', label: 'الذكاء الاصطناعي والتقنية' },
                  { key: 'energy', label: 'الطاقة النظيفة والتعدين' },
                  { key: 'healthcare', label: 'الرعاية الصحية' },
                  { key: 'logistics', label: 'اللوجستيات وسلاسل الإمداد' },
                  { key: 'finance_business', label: 'التقنية المالية والاستثمار' }
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setCategoryFilter(f.key)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer text-[11px] ${
                      categoryFilter === f.key
                        ? 'bg-[#071a2b] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {filteredSectors.map((sector) => (
                <div key={sector.id} className="border border-stone-200 rounded-xl p-4 bg-stone-50/60 hover:bg-white hover:border-[#1bb49e] transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        نمو {sector.growth_rate_forecast}
                      </span>
                      <span className="text-[10px] font-semibold text-stone-500">
                        الطلب: {sector.demand_level === 'very_high' ? 'مرتفع جداً 🔥' : 'مرتفع 📈'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-stone-900">{sector.title_ar}</h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed">{sector.notes_ar}</p>

                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-stone-700 block">أبرز المسميات الوظيفية:</span>
                      <ul className="text-[11px] text-stone-600 space-y-1 list-disc list-inside">
                        {sector.typical_roles.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-200/80">
                    <span className="text-[10px] font-bold text-stone-500 block mb-1">المهارات المطلوبة:</span>
                    <div className="flex flex-wrap gap-1">
                      {sector.required_skills.map((skill, idx) => (
                        <span key={idx} className="text-[9px] bg-white text-stone-700 px-1.5 py-0.5 rounded-md border border-stone-200 font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Salary Benchmarking Table */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#1bb49e]" />
                  <span>محاكي مقارنة الرواتب التقديرية حسب الدولة ومستوى الخبرة (شهرياً)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  قيم استرشادية موحدة بالدولار الأمريكي (USD) وما يعادلها بالعملة الوطنية لكل دولة.
                </p>
              </div>

              {/* Role Picker */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-600 shrink-0">اختر المسمى الوظيفي:</span>
                <select
                  value={selectedRoleIdx}
                  onChange={(e) => setSelectedRoleIdx(Number(e.target.value))}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-hidden focus:border-[#1bb49e] transition-all cursor-pointer"
                >
                  {salaryBenchmarks.map((bench, idx) => (
                    <option key={idx} value={idx}>
                      {bench.role_title_ar}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Salary Table */}
            {selectedSalaryData && (
              <div className="overflow-x-auto border border-stone-200 rounded-xl">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#071a2b] text-white text-[11px] font-bold">
                    <tr>
                      <th className="py-3 px-4">الدولة والعملة</th>
                      <th className="py-3 px-3">مبتدئ (0-2 سنة)</th>
                      <th className="py-3 px-3">متوسط (3-6 سنوات)</th>
                      <th className="py-3 px-3">خبير (7-12 سنة)</th>
                      <th className="py-3 px-3">تنفيذي / قيادي (13+ سنة)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {Object.entries(selectedSalaryData.salaries_by_country).map(([countryCode, val]: [string, any]) => {
                      const countryObj = ARAB_COUNTRIES_LIST.find(c => c.code === countryCode);
                      return (
                        <tr key={countryCode} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-stone-900 flex items-center gap-2">
                            <span>{countryObj?.flag || '🌐'}</span>
                            <span>{countryObj?.name || countryCode}</span>
                            <span className="text-[10px] text-stone-400 font-mono">({val.local_currency_code})</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-extrabold text-stone-800">${val.junior_usd.toLocaleString()}</span>
                            <span className="block text-[10px] text-stone-500 font-mono">
                              {(val.junior_usd * val.fx_rate_to_usd).toLocaleString(undefined, { maximumFractionDigits: 0 })} {val.local_currency_code}
                            </span>
                          </td>
                          <td className="py-3 px-3 bg-teal-50/40">
                            <span className="font-extrabold text-[#071a2b]">${val.mid_usd.toLocaleString()}</span>
                            <span className="block text-[10px] text-[#1bb49e] font-bold font-mono">
                              {(val.mid_usd * val.fx_rate_to_usd).toLocaleString(undefined, { maximumFractionDigits: 0 })} {val.local_currency_code}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-extrabold text-stone-800">${val.senior_usd.toLocaleString()}</span>
                            <span className="block text-[10px] text-stone-500 font-mono">
                              {(val.senior_usd * val.fx_rate_to_usd).toLocaleString(undefined, { maximumFractionDigits: 0 })} {val.local_currency_code}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-extrabold text-purple-900">${val.executive_usd.toLocaleString()}</span>
                            <span className="block text-[10px] text-purple-700 font-mono">
                              {(val.executive_usd * val.fx_rate_to_usd).toLocaleString(undefined, { maximumFractionDigits: 0 })} {val.local_currency_code}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 3: Degree & License Attestation Guide */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#1bb49e]" />
                  <span>دليل تصديق ومعادلة الشهادات والرخص المهنية للمغتربين</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  المراحل القانونية الأربع المعتمدة لاعتماد المؤهلات الأكاديمية والتسجيل في النقابات والهيئات المهنية.
                </p>
              </div>

              {/* Country Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['SA', 'AE', 'QA', 'EG'].map((code) => {
                  const c = ARAB_COUNTRIES_LIST.find(item => item.code === code);
                  return (
                    <button
                      key={code}
                      onClick={() => setSelectedAttestationCountry(code)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedAttestationCountry === code
                          ? 'bg-[#1bb49e] text-[#071a2b] shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      <span>{c?.flag}</span>
                      <span>{c?.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {attestationGuide && (
              <div className="space-y-4 pt-2">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-stone-500 font-medium">الجهة التنظيمية المسؤولة: </span>
                    <strong className="text-stone-900">{attestationGuide.responsible_authority_ar}</strong>
                  </div>
                  <span className="font-mono text-stone-600 bg-white px-2.5 py-1 rounded-md border border-stone-200">
                    {attestationGuide.portal_url}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {attestationGuide.stages.map((stage) => (
                    <div key={stage.step_num} className="border border-stone-200 rounded-xl p-4 bg-white space-y-2 relative">
                      <div className="w-6 h-6 rounded-full bg-[#071a2b] text-white text-[11px] font-bold flex items-center justify-center">
                        {stage.step_num}
                      </div>
                      <h4 className="text-xs font-bold text-stone-900">{stage.title_ar}</h4>
                      <p className="text-[11px] text-stone-600 leading-relaxed">{stage.description_ar}</p>
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
                        <span>المدة: <strong>{stage.estimated_days}</strong></span>
                        <span>الرسوم: <strong className="text-emerald-700">{stage.approx_fee_usd}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>

                {(attestationGuide.healthcare_specific_notes_ar || attestationGuide.engineering_specific_notes_ar) && (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                    <span className="font-bold block">إرشادات التخصصات الدقيقة (الصحة والهندسة):</span>
                    {attestationGuide.healthcare_specific_notes_ar && (
                      <p>• {attestationGuide.healthcare_specific_notes_ar}</p>
                    )}
                    {attestationGuide.engineering_specific_notes_ar && (
                      <p>• {attestationGuide.engineering_specific_notes_ar}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: 90-DAY STRATEGIC RELOCATION PLANNER                            */}
      {/* ===================================================================== */}
      {activeMainTab === 'relocation_planner' && (
        <div className="space-y-6">
          {/* Candidate Countries Selector */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#1bb49e]" />
                <span>حدد الدول المرشحة للانتقال أو تأسيس الأعمال (اختر حتى 3 دول)</span>
              </h3>
              <span className="text-xs text-stone-500">
                محدد حالياً: {selectedRelocationCandidates.length} دول
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {ARAB_COUNTRIES_LIST.map((c) => {
                const isSelected = selectedRelocationCandidates.includes(c.code);
                return (
                  <button
                    key={c.code}
                    onClick={() => toggleCandidateCountry(c.code)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-[#071a2b] text-white border-[#071a2b] shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#1bb49e]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Viability Comparison Cards */}
          {loadingRelocation ? (
            <div className="py-12 text-center bg-white border border-stone-200 rounded-2xl">
              <div className="w-10 h-10 border-3 border-[#1bb49e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-stone-500 font-semibold">جاري حساب مؤشرات الجدوى ونفقات الاستقرار...</p>
            </div>
          ) : relocationResult ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relocationResult.candidate_countries.map((cand) => (
                  <div key={cand.code} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:border-[#1bb49e] transition-all space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{cand.flag}</span>
                        <div>
                          <h4 className="text-sm font-bold text-stone-900">{cand.name_ar}</h4>
                          <span className="text-[10px] text-stone-400">العاصمة: {cand.capital}</span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-teal-50 text-[#071a2b] border border-teal-200">
                        مؤشر {cand.ease_of_business_index}/100
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center text-stone-600">
                        <span>ميزانية معيشة الأسرة (شهرياً):</span>
                        <strong className="text-stone-900">${cand.monthly_budget_family_usd.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between items-center text-stone-600">
                        <span>متوسط دخل المستوى المتوسط:</span>
                        <strong className="text-stone-900">${cand.avg_salary_mid_usd.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-stone-100">
                        <span className="font-bold text-stone-700">معدل كفاية الدخل:</span>
                        <strong className={`font-mono px-2 py-0.5 rounded-md ${
                          cand.viability_ratio >= 1.3 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {cand.viability_ratio}x
                        </strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1.5 text-[10px]">
                      <span className="bg-stone-100 px-2 py-0.5 rounded-md text-stone-700">
                        {cand.free_zones_count} منطقة حرة
                      </span>
                      <span className="bg-stone-100 px-2 py-0.5 rounded-md text-stone-700">
                        {cand.healthcare_readiness}
                      </span>
                      {cand.golden_visa_available && (
                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                          إقامة ذهبية متاحة ⭐
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Bar & AI Consultation Bar */}
              <div className="bg-gradient-to-r from-stone-900 to-[#071a2b] text-white rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between text-xs pr-1">
                    <span className="font-bold text-[#8be4d4]">إنجاز خطة الانتقال الـ 90 يوماً:</span>
                    <span className="font-mono font-bold text-white">{completedStepsCount} من {totalStepsCount} خطوة ({progressPct}%)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#1bb49e] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onOpenAIWithPrompt && relocationResult.ai_recommendation_prompt) {
                      onOpenAIWithPrompt(relocationResult.ai_recommendation_prompt);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#1bb49e] hover:bg-[#169d89] text-[#071a2b] text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap self-start md:self-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>توليد توصية استشارية للمقارنة</span>
                </button>
              </div>

              {/* Step-by-Step 90-Day Interactive Timeline */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1bb49e]" />
                  <span>جدول المهام والإجراءات التنفيذية خطوة بخطوة (انقر للتأشير والإنجاز)</span>
                </h4>

                <div className="space-y-3 pt-1">
                  {relocationResult.common_steps.map((step: PanArabRelocationStep) => {
                    const isDone = !!checkedSteps[step.id];
                    return (
                      <div
                        key={step.id}
                        onClick={() => toggleStep(step.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isDone
                            ? 'bg-emerald-50/50 border-emerald-300'
                            : 'bg-white border-stone-200 hover:border-[#1bb49e]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isDone
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-stone-300 bg-stone-50'
                        }`}>
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-xs font-bold ${isDone ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                              {step.title_ar}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-mono">
                              {step.days_range}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              step.priority === 'critical' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                            }`}>
                              {step.priority === 'critical' ? 'حرج وإلزامي' : 'موصى به'}
                            </span>
                          </div>
                          <p className={`text-xs leading-relaxed ${isDone ? 'text-stone-400' : 'text-stone-600'}`}>
                            {step.description_ar}
                          </p>
                          <span className="text-[10px] text-stone-400 block pt-0.5">
                            {step.phase_title_ar}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
