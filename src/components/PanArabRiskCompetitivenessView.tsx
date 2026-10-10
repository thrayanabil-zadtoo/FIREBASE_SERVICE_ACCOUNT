import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Globe2,
  Lock,
  Layers,
  Award,
  Zap,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Navigation,
  Compass,
  FileText
} from 'lucide-react';
import {
  PanArabGeopoliticalRisk,
  PanArabRouteContingency,
  PanArabGlobalCompetitiveness
} from '../types/country-profile';

interface PanArabRiskCompetitivenessViewProps {
  onConsultAI?: (query: string) => void;
}

export const PanArabRiskCompetitivenessView: React.FC<PanArabRiskCompetitivenessViewProps> = ({
  onConsultAI
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'risk_matrix' | 'routing_contingencies' | 'competitiveness'>('risk_matrix');
  const [risks, setRisks] = useState<PanArabGeopoliticalRisk[]>([]);
  const [contingencies, setContingencies] = useState<PanArabRouteContingency[]>([]);
  const [competitiveness, setCompetitiveness] = useState<PanArabGlobalCompetitiveness[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedContingency, setSelectedContingency] = useState<PanArabRouteContingency | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'safety' | 'cyber' | 'stability'>('safety');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRisks, resContingencies, resComp] = await Promise.all([
        fetch('/api/countries/analytics/geopolitical-risk'),
        fetch('/api/countries/analytics/route-contingencies'),
        fetch('/api/countries/analytics/competitiveness-benchmarks')
      ]);

      const [dataRisks, dataContingencies, dataComp] = await Promise.all([
        resRisks.json(),
        resContingencies.json(),
        resComp.json()
      ]);

      if (dataRisks.ok && dataRisks.data) {
        setRisks(dataRisks.data);
      }
      if (dataContingencies.ok && dataContingencies.data) {
        setContingencies(dataContingencies.data);
        if (dataContingencies.data.length > 0) {
          setSelectedContingency(dataContingencies.data[0]);
        }
      }
      if (dataComp.ok && dataComp.data) {
        setCompetitiveness(dataComp.data);
      }
    } catch (err) {
      console.error('Failed to load risk and competitiveness data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRisks = risks
    .filter((r) => r.country_name_ar.includes(searchFilter) || r.country_code.includes(searchFilter.toUpperCase()))
    .sort((a, b) => {
      if (sortBy === 'safety') return b.overall_safety_index - a.overall_safety_index;
      if (sortBy === 'stability') return b.political_stability_score - a.political_stability_score;
      if (sortBy === 'cyber') return a.cybersecurity_resilience_rank - b.cybersecurity_resilience_rank;
      return 0;
    });

  const filteredCompetitiveness = competitiveness.filter((c) =>
    c.country_name_ar.includes(searchFilter) || c.country_code.includes(searchFilter.toUpperCase())
  );

  return (
    <div id="darb-risk-competitiveness-view" className="space-y-6 text-slate-800 dark:text-slate-100" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>المرحلة السابعة: الجيوسياسة والتنافسية وسلاسل الإمداد</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              مرصد إدارة المخاطر وسلاسل الإمداد والتنافسية العالمية
            </h2>
            <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
              تقييم مؤشرات الأمان والتحوط الجيوسياسي، محاكاة مسارات الطوارئ البديلة لنقاط الاختناق البحرية، ومقارنة التنافسية والابتكار عالمياً.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium rounded-xl flex items-center gap-2 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>تحديث المؤشرات</span>
            </button>
            {onConsultAI && (
              <button
                onClick={() =>
                  onConsultAI(
                    'قم بتحليل الجاهزية الجيوسياسية والمسارات البديلة لمضائق هرمز وباب المندب وتأثيرها على استثمارات الصناديق السيادية وسلاسل الإمداد العربية.'
                  )
                }
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>تحليل استشاري عبر AI</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('risk_matrix')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeSubTab === 'risk_matrix'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>مصفوفة الاستقرار والمخاطر الجيوسياسية</span>
          </button>
          <button
            onClick={() => setActiveSubTab('routing_contingencies')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeSubTab === 'routing_contingencies'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>محاكي المسارات البديلة والتحوط اللوجستي</span>
          </button>
          <button
            onClick={() => setActiveSubTab('competitiveness')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeSubTab === 'competitiveness'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>مؤشرات التنافسية العالمية والابتكار</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Geopolitical Risk Matrix */}
      {activeSubTab === 'risk_matrix' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="ابحث عن دولة..."
                className="w-full pl-3 pr-10 py-2 rounded-xl text-xs md:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>ترتيب حسب:</span>
              </span>
              <button
                onClick={() => setSortBy('safety')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  sortBy === 'safety'
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                مؤشر الأمان الشامل
              </button>
              <button
                onClick={() => setSortBy('stability')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  sortBy === 'stability'
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                الاستقرار السياسي
              </button>
              <button
                onClick={() => setSortBy('cyber')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  sortBy === 'cyber'
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                الأمن السيبراني
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRisks.map((item) => (
              <div
                key={item.country_code}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{item.flag}</span>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                          {item.country_name_ar}
                        </h3>
                        <span className="text-[11px] text-slate-500 font-medium inline-flex items-center gap-1">
                          <span className="text-xs">{item.flag}</span>
                          <span>رمز الدولة:</span>
                          <strong className="font-mono text-slate-700 dark:text-slate-300">{item.country_code}</strong>
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                        item.overall_safety_index >= 88
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : item.overall_safety_index >= 80
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {item.risk_level_ar}
                    </span>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 my-4 text-center">
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">مؤشر الأمان</div>
                      <div className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                        {item.overall_safety_index}/100
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">الاستقرار</div>
                      <div className="text-lg font-extrabold text-slate-800 dark:text-slate-200">
                        {item.political_stability_score}%
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">السيبراني</div>
                      <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                        #{item.cybersecurity_resilience_rank}
                      </div>
                    </div>
                  </div>

                  {/* Financial & Sanctions Badges */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">التعرض للعقوبات الدولية:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.sanctions_exposure_level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">نظام سعر الصرف:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.currency_volatility_rating}
                      </span>
                    </div>
                  </div>

                  {/* Threats & Hedging */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>أبرز التهديدات الجيوسياسية:</span>
                      </span>
                      <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5 text-[11px] pr-1">
                        {item.primary_geopolitical_threats.map((threat, idx) => (
                          <li key={idx} className="line-clamp-1">
                            {threat}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>استراتيجيات التحوط المعتمدة:</span>
                      </span>
                      <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5 text-[11px] pr-1">
                        {item.hedging_mitigation_strategies.map((hedge, idx) => (
                          <li key={idx} className="line-clamp-1">
                            {hedge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {onConsultAI && (
                    <button
                      onClick={() =>
                        onConsultAI(
                          `قدّم تقريراً مفصلاً حول مخاطر الاستثمار في ${item.country_name_ar}، بما يشمل استقرار العملة، سلاسل الإمداد، والتدابير الاحترازية للمستثمرين.`
                        )
                      }
                      className="w-full py-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg font-medium transition flex items-center justify-center gap-1"
                    >
                      <span>استشارة تفصيلية حول {item.country_name_ar}</span>
                      <ArrowRight className="w-3 h-3 rotate-180" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Routing Contingency & Resilience Simulator */}
      {activeSubTab === 'routing_contingencies' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of Contingency Plans */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 px-1">
                سيناريوهات الطوارئ والمسارات البديلة
              </h3>
              {contingencies.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedContingency(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition text-right ${
                    selectedContingency?.id === item.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-600 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.primary_chokepoint_or_corridor}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        item.capacity_readiness === 'جاهز وفوري'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {item.capacity_readiness}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {item.alternative_route_name_ar}
                  </p>
                </div>
              ))}
            </div>

            {/* Selected Contingency Deep-Dive */}
            <div className="lg:col-span-2">
              {selectedContingency ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
                        <Navigation className="w-3.5 h-3.5" />
                        <span>ممر التحوط اللوجستي وسلاسل الإمداد البديلة</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {selectedContingency.alternative_route_name_ar}
                      </h3>
                      <div className="text-xs text-slate-500 mt-1">
                        النقطة الحيوية المستهدفة: <strong className="text-slate-700 dark:text-slate-300">{selectedContingency.primary_chokepoint_or_corridor}</strong>
                      </div>
                    </div>

                    <span
                      className={`text-xs px-3 py-1.5 rounded-full font-bold border ${
                        selectedContingency.capacity_readiness === 'جاهز وفوري'
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      الحالة: {selectedContingency.capacity_readiness}
                    </span>
                  </div>

                  {/* Risk Scenario */}
                  <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-4 rounded-xl text-amber-900 dark:text-amber-200 space-y-1">
                    <div className="text-xs font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>سيناريو المخاطر المحاكى:</span>
                    </div>
                    <p className="text-xs leading-relaxed">{selectedContingency.risk_scenario}</p>
                  </div>

                  {/* Impact Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">أثر زمن العبور الملاحي (Transit Time)</div>
                      <div className="text-sm md:text-base font-bold text-indigo-600 dark:text-indigo-400">
                        {selectedContingency.transit_time_impact_days}
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">أثر تكاليف التأمين والشحن</div>
                      <div className="text-sm md:text-base font-bold text-emerald-600 dark:text-emerald-400">
                        {selectedContingency.cost_impact_pct}
                      </div>
                    </div>
                  </div>

                  {/* Strategic Description */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      الخطة التنفيذية للتحوط اللوجستي:
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      {selectedContingency.strategic_description_ar}
                    </p>
                  </div>

                  {/* Participating Countries */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400">
                      الدول العربية المشاركة في الممر البديل:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedContingency.participating_countries.map((c) => (
                        <div
                          key={c.country_code}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                        >
                          <span>{c.flag}</span>
                          <span>{c.name_ar}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI CTA */}
                  {onConsultAI && (
                    <div className="pt-2">
                      <button
                        onClick={() =>
                          onConsultAI(
                            `قم بوضع خطة عمل استراتيجية تفصيلية لنقل البضائع وسلاسل التوريد عبر (${selectedContingency.alternative_route_name_ar}) بدلاً من (${selectedContingency.primary_chokepoint_or_corridor})، مع حساب الجدوى والتراخيص المطلوبة.`
                          )
                        }
                        className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>طلب دراسة تفصيلية عبر AI لهذا الممر البديل</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">اختر سيناريو لعرض التفاصيل</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Global Competitiveness & Innovation Benchmarks */}
      {activeSubTab === 'competitiveness' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  لوحة مقارنة التنافسية والابتكار عالمياً
                </h3>
                <p className="text-xs text-slate-500">
                  مقارنة معيارية تستند لتقارير البنك الدولي، المنظمة العالمية للملكية الفكرية (WIPO)، والاتحاد الدولي للاتصالات (ITU).
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-4">الدولة</th>
                    <th className="py-3 px-3 text-center">التنافسية العالمية</th>
                    <th className="py-3 px-3 text-center">الابتكار (GII)</th>
                    <th className="py-3 px-3 text-center">الأداء اللوجستي (LPI)</th>
                    <th className="py-3 px-3 text-center">القوة الناعمة</th>
                    <th className="py-3 px-3 text-center">ثقة الاستثمار (FDI)</th>
                    <th className="py-3 px-4">الأمن السيبراني والميزة النوعية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCompetitiveness.map((item) => (
                    <tr
                      key={item.country_code}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.flag}</span>
                          <span>{item.country_name_ar}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-md font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                          #{item.global_competitiveness_rank}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                        #{item.global_innovation_index_rank}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                        #{item.logistics_performance_index_rank}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                        #{item.soft_power_rank}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                        #{item.fdi_confidence_index_rank}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                            {item.global_cybersecurity_index_tier}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {item.strategic_edge_ar}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
