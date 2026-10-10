import React, { useState, useEffect } from 'react';
import {
  Wheat,
  Droplets,
  ShieldAlert,
  Activity,
  Sparkles,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Layers,
  ArrowRightLeft,
  Factory,
  Zap,
  Globe2,
  Scale,
  Calendar,
  Waves,
  Sun,
  ShieldCheck,
  Building2,
  Compass
} from 'lucide-react';
import {
  PanArabStrategicReserveItem,
  PanArabWaterDesalinationNode,
  PanArabGeopoliticalScenario,
  PanArabStressTestResult
} from '../types/country-profile';
import {
  STRATEGIC_FOOD_RESERVES,
  WATER_DESALINATION_NODES,
  GEOPOLITICAL_SCENARIOS,
  runPanArabStressTest
} from '../data/pan-arab-phase13-data';

interface PanArabPhase13ResilienceViewProps {
  onSelectCountry?: (countryCode: string) => void;
  onConsultAI?: (prompt: string) => void;
}

export const PanArabPhase13ResilienceView: React.FC<PanArabPhase13ResilienceViewProps> = ({
  onSelectCountry,
  onConsultAI
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'food' | 'water' | 'scenarios' | 'stress_test'>('food');

  // Food Reserves State
  const [foodFilter, setFoodFilter] = useState<string>('all');
  const [selectedReserve, setSelectedReserve] = useState<PanArabStrategicReserveItem>(STRATEGIC_FOOD_RESERVES[0]);

  // Water Security State
  const [selectedWaterNode, setSelectedWaterNode] = useState<PanArabWaterDesalinationNode>(WATER_DESALINATION_NODES[0]);

  // Geopolitical Scenarios State
  const [selectedScenario, setSelectedScenario] = useState<PanArabGeopoliticalScenario>(GEOPOLITICAL_SCENARIOS[0]);

  // Stress-Test State
  const [stressCountry, setStressCountry] = useState<string>('SA');
  const [stressShock, setStressShock] = useState<'grain_cutoff' | 'chokepoint_blockage' | 'oil_shock' | 'drought_water'>('grain_cutoff');
  const [stressResult, setStressResult] = useState<PanArabStressTestResult>(() => runPanArabStressTest('SA', 'grain_cutoff'));
  const [runningTest, setRunningTest] = useState<boolean>(false);

  const handleRunStressTest = () => {
    setRunningTest(true);
    setTimeout(() => {
      const res = runPanArabStressTest(stressCountry, stressShock);
      setStressResult(res);
      setRunningTest(false);
    }, 450);
  };

  const filteredReserves = STRATEGIC_FOOD_RESERVES.filter(r => {
    if (foodFilter === 'all') return true;
    return r.category.includes(foodFilter);
  });

  return (
    <div id="pan-arab-phase13-container" className="space-y-6 animate-fadeIn text-right" dir="rtl">
      
      {/* Sovereign Header Card */}
      <div className="bg-gradient-to-br from-[#071a2b] via-[#0d2a45] to-[#0a233a] border border-[#1bb49e]/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#1bb49e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#1bb49e]/20 text-[#8be4d4] border border-[#1bb49e]/40 px-3 py-1 rounded-full text-xs font-black tracking-wide inline-flex items-center gap-1.5">
                <Wheat className="w-3.5 h-3.5 text-[#1bb49e]" />
                المرحلة 13: الأمن الاستراتيجي الشامل 2035
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-mono">
                صمود تنموي عربي موحد
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              المرصد الاستراتيجي للأمن الغذائي والمائي ومحاكي الصمود والسيناريوهات 2035
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              منظومة الرصد والتنبؤ الجيواقتصادي لحماية مقدرات الأمة: شبكة الصوامع التبادلية لاحتياطي الحبوب ومحاصيل الخبز، أضخم شبكات تحلية المياه وإعادة التدوير، ممرات الطوارئ البديلة، ومحاكي اختبارات الجهد السيادي.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 text-center">
              <span className="block text-[11px] text-stone-400 font-medium">مخزون القمح الاستراتيجي</span>
              <span className="text-lg sm:text-2xl font-black text-amber-400 font-mono">18.2M طن</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">تغطية 6.4 شهر عربي</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 text-center">
              <span className="block text-[11px] text-stone-400 font-medium">قدرات التحلية اليومية</span>
              <span className="text-lg sm:text-2xl font-black text-[#8be4d4] font-mono">26.8M م³</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">الأضخم عالمياً</span>
            </div>
          </div>
        </div>

        {/* Phase 13 Sub-navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
          {[
            { id: 'food', label: 'صوامع الحبوب والأمن الغذائي', icon: Wheat },
            { id: 'water', label: 'الأمن المائي ومحطات التحلية', icon: Droplets },
            { id: 'scenarios', label: 'محاكي السيناريوهات الجيوسياسية 2035', icon: Compass },
            { id: 'stress_test', label: 'محاكي اختبار الجهد والصمود السيادي', icon: Activity },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#1bb49e] text-[#071a2b] shadow-md'
                    : 'bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SUB-TAB 1: STRATEGIC GRAIN & COMMODITY RESERVES                       */}
      {/* ===================================================================== */}
      {activeSubTab === 'food' && (
        <div className="space-y-6">
          {/* Controls & Filter */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <Wheat className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-sm font-bold text-stone-900">شبكة الصوامع ومخزون السلع الاستراتيجية العربية</h3>
                <p className="text-xs text-stone-500">مراقبة حية لاحتياطي المحاصيل الأساسية بالأشهر وحصص الإنتاج ومبادرات الاكتفاء</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'كافة السلع' },
                { id: 'حبوب', label: '🌾 حبوب وقمح' },
                { id: 'زيوت', label: '🛢️ زيوت وسكر' },
                { id: 'أسمدة', label: '🌱 أسمدة زراعية' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFoodFilter(f.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    foodFilter === f.id
                      ? 'bg-[#071a2b] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Commodity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReserves.map(item => {
              const isSelected = selectedReserve.commodity_key === item.commodity_key;
              return (
                <div
                  key={item.commodity_key}
                  onClick={() => setSelectedReserve(item)}
                  className={`bg-white border rounded-2xl p-5 shadow-2xs space-y-4 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-[#1bb49e] ring-2 ring-[#1bb49e]/30 shadow-md'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-stone-400 font-bold block">{item.category}</span>
                      <h4 className="text-sm font-bold text-stone-900">{item.name_ar}</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                      item.vulnerability_color === 'emerald'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {item.vulnerability_level}
                    </span>
                  </div>

                  {/* Months Gauge */}
                  <div className="space-y-1.5 bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-500">متوسط التغطية العربية:</span>
                      <span className="font-extrabold text-[#071a2b] font-mono">{item.total_arab_reserve_months} شهر</span>
                    </div>
                    <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.total_arab_reserve_months >= 12
                            ? 'bg-emerald-500'
                            : item.total_arab_reserve_months >= 6
                            ? 'bg-[#1bb49e]'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, (item.total_arab_reserve_months / 12) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-stone-400 pt-1">
                      <span>إجمالي المخزون: <strong>{item.total_arab_stock_million_tons}M طن</strong></span>
                      <span>سعة الصوامع: <strong>{item.strategic_silos_capacity_m_tons}M طن</strong></span>
                    </div>
                  </div>

                  {/* Top Producers */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-stone-600 block">أكبر المنتجين عربياً:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.top_arab_producers.map(p => (
                        <span key={p.country_code} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200">
                          {p.name_ar} ({p.share_pct}%)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Commodity Deep Dive Panel */}
          {selectedReserve && (
            <div className="bg-[#071a2b] text-white rounded-3xl p-6 sm:p-8 space-y-5 border border-stone-800 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#1bb49e]/20 flex items-center justify-center text-[#1bb49e]">
                    <Wheat className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold">بروتوكول الطوارئ لسلعة: {selectedReserve.name_ar}</h3>
                    <p className="text-xs text-stone-400">آلية السحب والتوزيع التبادلي بين الصوامع العربية عند الأزمات الدولية</p>
                  </div>
                </div>

                {onConsultAI && (
                  <button
                    onClick={() => onConsultAI(`حلل لي بالتفصيل وضع الأمن الغذائي العربي لمادة ${selectedReserve.name_ar} ومشاريع الاكتفاء الذاتي للصوامع`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1bb49e] hover:bg-[#169683] text-[#071a2b] text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>تحليل استشرافي عبر DARB AI</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                  <span className="text-xs text-stone-400 font-medium">بروتوكول المشاركة الفورية:</span>
                  <p className="text-xs text-stone-200 leading-relaxed">{selectedReserve.emergency_share_protocol_ar}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                  <span className="text-xs text-stone-400 font-medium">توزيع الطاقة الإنتاجية السنوية:</span>
                  <div className="space-y-1.5">
                    {selectedReserve.top_arab_producers.map(tp => (
                      <div key={tp.country_code} className="flex justify-between text-xs text-stone-300">
                        <span>{tp.name_ar}</span>
                        <span className="font-mono text-emerald-400">{tp.annual_production_m_tons}M طن/سنة ({tp.share_pct}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                  <span className="text-xs text-stone-400 font-medium">مؤشر الأمان السيادي:</span>
                  <div className="text-xs text-stone-300 space-y-2">
                    <div className="flex justify-between">
                      <span>فترة الصمود التام:</span>
                      <span className="font-bold text-amber-300 font-mono">{selectedReserve.total_arab_reserve_months} شهر</span>
                    </div>
                    <div className="flex justify-between">
                      <span>إجمالي سعة التخزين:</span>
                      <span className="font-bold text-[#8be4d4] font-mono">{selectedReserve.strategic_silos_capacity_m_tons} مليون طن</span>
                    </div>
                    <div className="text-[11px] text-stone-400">
                      محمي بنظام التخزين المبرد والمستودعات الاستراتيجية الحديثة.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-TAB 2: WATER SECURITY & RENEWABLE DESALINATION                     */}
      {/* ===================================================================== */}
      {activeSubTab === 'water' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-sky-600" />
              <div>
                <h3 className="text-sm font-bold text-stone-900">مرصد تحلية المياه بالطاقة المتجددة والأحواض المشتركة</h3>
                <p className="text-xs text-stone-500">متابعة الإنتاج اليومي للمياه المحلاة، نسب الطاقة الخضراء، ومحطات المعالجة الثلاثية العملاقة</p>
              </div>
            </div>

            <div className="text-xs font-mono bg-sky-50 text-sky-800 px-3 py-1.5 rounded-xl border border-sky-200 font-bold">
              💧 الطاقة الإنتاجية المرصودة: {(WATER_DESALINATION_NODES.reduce((a, c) => a + c.daily_desalination_capacity_m3, 0) / 1000000).toFixed(1)} مليون م³/يوم
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WATER_DESALINATION_NODES.map(node => {
              const isSelected = selectedWaterNode.node_id === node.node_id;
              return (
                <div
                  key={node.node_id}
                  onClick={() => setSelectedWaterNode(node)}
                  className={`bg-white border rounded-2xl p-5 shadow-2xs space-y-4 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-md'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{node.flag}</span>
                      <h4 className="text-sm font-bold text-stone-900">{node.country_name_ar}</h4>
                    </div>
                    <span className="text-[11px] font-mono font-bold bg-sky-50 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
                      {(node.daily_desalination_capacity_m3 / 1000000).toFixed(2)}M م³/يوم
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <div className="flex justify-between">
                      <span className="text-stone-400">نسبة الطاقة المتجددة بالتحلية:</span>
                      <span className="font-bold text-emerald-700 font-mono">{node.renewable_energy_share_pct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">إعادة استخدام مياه الصرف:</span>
                      <span className="font-bold text-sky-700 font-mono">{node.treated_sewage_reuse_pct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">نصيب الفرد المائي:</span>
                      <span className="font-bold text-stone-900 font-mono">{node.per_capita_water_annual_m3} م³/سنة</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-stone-500 block">الحوض الجوفي المشترك:</span>
                    <p className="text-[11px] text-stone-700 font-medium leading-relaxed">{node.shared_groundwater_basin_ar}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Node Projects Accordion */}
          {selectedWaterNode && (
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedWaterNode.flag}</span>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">المشاريع المائية والسيادية الكبرى في {selectedWaterNode.country_name_ar}</h3>
                    <p className="text-xs text-stone-500">محطات التحلية بالتناضح العكسي ومنظومة إعادة التدوير للزراعة المستدامة</p>
                  </div>
                </div>
                {onSelectCountry && (
                  <button
                    onClick={() => onSelectCountry(selectedWaterNode.country_code)}
                    className="text-xs text-[#1bb49e] font-bold hover:underline cursor-pointer"
                  >
                    استعراض الملف الشامل للدولة ←
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {selectedWaterNode.mega_water_projects_ar.map((proj, idx) => (
                  <div key={idx} className="bg-sky-50/50 border border-sky-100 rounded-xl p-3.5 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                    <span className="text-xs text-stone-800 font-medium leading-relaxed">{proj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-TAB 3: GEOPOLITICAL DISRUPTION & 2035 SCENARIOS                   */}
      {/* ===================================================================== */}
      {activeSubTab === 'scenarios' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="text-sm font-bold text-stone-900">محاكي السيناريوهات الجيواقتصادية وممرات الطوارئ 2035</h3>
                <p className="text-xs text-stone-500">محاكاة إغلاق المضائق المائية، تفعيل خطوط الأنابيب البرية، الجسر البري العربي، وممرات الهيدروجين النظيف</p>
              </div>
            </div>
          </div>

          {/* Scenario Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {GEOPOLITICAL_SCENARIOS.map(sc => {
              const isSelected = selectedScenario.scenario_id === sc.scenario_id;
              return (
                <button
                  key={sc.scenario_id}
                  onClick={() => setSelectedScenario(sc)}
                  className={`text-right p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-[#071a2b] text-white border-[#1bb49e] shadow-md'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                      sc.threat_level.includes('Extreme')
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : sc.threat_level.includes('High')
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {sc.threat_level}
                    </span>
                    <h4 className="text-xs font-bold leading-snug">{sc.scenario_title_ar}</h4>
                  </div>
                  <div className="text-[11px] text-stone-400 font-mono">
                    المضائق: {sc.affected_chokepoints.join('، ')}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Scenario Active Board */}
          {selectedScenario && (
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="space-y-2 border-b border-stone-100 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-extrabold text-stone-900">{selectedScenario.scenario_title_ar}</h3>
                  <span className="text-xs font-bold bg-stone-100 text-stone-700 px-3 py-1 rounded-xl border border-stone-200">
                    المضائق المتأثرة: {selectedScenario.affected_chokepoints.join(' • ')}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60">
                  {selectedScenario.disruption_impact_summary_ar}
                </p>
              </div>

              {/* Alternative Corridors */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-[#1bb49e]" />
                  <span>الممرات اللوجستية البديلة وخطوط الطوارئ الجاهزة للتفعيل:</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedScenario.alternative_corridors.map((ac, i) => (
                    <div key={i} className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-xs font-bold text-stone-900">{ac.corridor_name_ar}</h5>
                        <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                          جاهزية {ac.readiness_pct}%
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">{ac.route_path_ar}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs">
                        <span className="text-stone-400">الطاقة الاستيعابية:</span>
                        <span className="font-bold text-[#071a2b] font-mono">{ac.throughput_capacity_ar}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contingency Action Steps */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>خطوات الاستجابة والتنسيق السيادي العربي:</span>
                </h4>
                <div className="space-y-2">
                  {selectedScenario.contingency_action_steps_ar.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                      <span className="w-5 h-5 rounded-full bg-[#1bb49e] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-TAB 4: SOVEREIGN CRISIS STRESS-TEST CALCULATOR                     */}
      {/* ===================================================================== */}
      {activeSubTab === 'stress_test' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-600" />
              <div>
                <h3 className="text-sm font-bold text-stone-900">محاكي اختبار الجهد والصمود السيادي للأزمات (Sovereign Stress-Test)</h3>
                <p className="text-xs text-stone-500">اختر الدولة ونوع الصدمة لاحتساب مؤشر مرونة الصمود ومدة الأمان بالأشهر وخطة الطوارئ المشتركة</p>
              </div>
            </div>
          </div>

          {/* Test Control Panel */}
          <div className="bg-[#071a2b] text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-stone-800 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Select Country */}
              <div className="space-y-2">
                <label className="text-xs text-stone-300 font-bold block">الدولة المستهدفة بالاختبار:</label>
                <select
                  value={stressCountry}
                  onChange={(e) => setStressCountry(e.target.value)}
                  className="w-full bg-[#0d2a45] text-white border border-stone-700 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold focus:outline-hidden focus:border-[#1bb49e] cursor-pointer"
                >
                  <option value="SA">🇸🇦 المملكة العربية السعودية</option>
                  <option value="EG">🇪🇬 جمهورية مصر العربية</option>
                  <option value="AE">🇦🇪 الإمارات العربية المتحدة</option>
                  <option value="MA">🇲🇦 المملكة المغربية</option>
                  <option value="DZ">🇩🇿 الجمهورية الجزائرية</option>
                  <option value="IQ">🇮🇶 جمهورية العراق</option>
                  <option value="QA">🇶🇦 دولة قطر</option>
                  <option value="KW">🇰🇼 دولة الكويت</option>
                  <option value="OM">🇴🇲 سلطنة عُمان</option>
                  <option value="JO">🇯🇴 المملكة الأردنية الهاشمية</option>
                  <option value="TN">🇹🇳 الجمهورية التونسية</option>
                  <option value="SD">🇸🇩 جمهورية السودان</option>
                </select>
              </div>

              {/* Select Shock Type */}
              <div className="space-y-2">
                <label className="text-xs text-stone-300 font-bold block">نوع الصدمة الجيواقتصادية:</label>
                <select
                  value={stressShock}
                  onChange={(e) => setStressShock(e.target.value as any)}
                  className="w-full bg-[#0d2a45] text-white border border-stone-700 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold focus:outline-hidden focus:border-[#1bb49e] cursor-pointer"
                >
                  <option value="grain_cutoff">🌾 صدمة انقطاع الحبوب العالمية +45% لـ 6 أشهر</option>
                  <option value="chokepoint_blockage">🚢 تعطل ملاحي حرج في أحد المضائق البحرية</option>
                  <option value="oil_shock">📉 هبوط حاد في أسعار الطاقة العالمية (-35%)</option>
                  <option value="drought_water">☀️ موجة جفاف موسمي حاد وانخفاض التدفقات 25%</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                onClick={handleRunStressTest}
                disabled={runningTest}
                className="px-6 py-3 bg-[#1bb49e] hover:bg-[#169683] text-[#071a2b] font-black text-xs sm:text-sm rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${runningTest ? 'animate-spin' : ''}`} />
                <span>{runningTest ? 'جارٍ محاكاة اختبار الضغط...' : 'تشغيل محاكاة اختبار الصمود (Run Simulation)'}</span>
              </button>

              {onConsultAI && (
                <button
                  onClick={() => onConsultAI(`حلل لي نتائج اختبار الصمود السيادي لدولة ${stressCountry} تحت صدمة ${stressShock} وما هي التوصيات الاستراتيجية المثلى؟`)}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>استشارة تفصيلية عبر DARB AI</span>
                </button>
              )}
            </div>
          </div>

          {/* Stress Test Results Display */}
          {stressResult && (
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div className="space-y-1">
                  <span className="text-xs text-stone-500 font-bold block">{stressResult.shock_type}</span>
                  <h3 className="text-lg font-extrabold text-stone-900">
                    تقرير صمود: {stressResult.country_name_ar} ({stressResult.country_code})
                  </h3>
                </div>

                {/* Score Circular Badge */}
                <div className="flex items-center gap-3 bg-stone-50 px-4 py-2.5 rounded-2xl border border-stone-200">
                  <div className="text-left">
                    <span className="text-[10px] text-stone-500 font-bold block">مؤشر مرونة الصمود (Resilience)</span>
                    <span className="text-2xl font-black text-[#1bb49e] font-mono">{stressResult.overall_resilience_score}/100</span>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-[#1bb49e] flex items-center justify-center font-bold text-xs">
                    {stressResult.overall_resilience_score >= 80 ? 'قوي' : 'متوسط'}
                  </div>
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 text-center">
                  <span className="text-xs text-stone-500 block">مدة الأمان التام قبل السحب المشترك</span>
                  <span className="text-2xl font-black text-[#071a2b] font-mono mt-1 block">
                    {stressResult.buffer_duration_months} أشهر
                  </span>
                  <span className="text-[11px] text-emerald-600 block mt-0.5">محمي بالمخزون الداخلي</span>
                </div>
                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 text-center">
                  <span className="text-xs text-stone-500 block">الأثر المالي المتوقع على الناتج</span>
                  <span className="text-2xl font-black text-amber-600 font-mono mt-1 block">
                    {stressResult.fiscal_impact_pct_gdp}% GDP
                  </span>
                  <span className="text-[11px] text-stone-400 block mt-0.5">قابل للاستيعاب المالي</span>
                </div>
                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 text-center">
                  <span className="text-xs text-stone-500 block">مستوى الضغط على العملة الوطنية</span>
                  <span className={`text-2xl font-black font-mono mt-1 block ${
                    stressResult.currency_pressure_level === 'منخفض' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {stressResult.currency_pressure_level}
                  </span>
                  <span className="text-[11px] text-stone-400 block mt-0.5">احتياطي نقد أجنبي متوازن</span>
                </div>
              </div>

              {/* Synergies & Mitigation Plan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="space-y-2 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>خطط التكامل والمساندة الأخوية العربية:</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-700 leading-relaxed">
                    {stressResult.recommended_brotherly_synergies.map((syn, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{syn}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 bg-stone-50 border border-stone-200 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>خطة الإجراءات التنفيذية الفورية:</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-700 leading-relaxed">
                    {stressResult.emergency_mitigation_plan_ar.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
