import React, { useState, useEffect } from 'react';
import {
  GitFork,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  RefreshCw,
  Layers,
  ShieldCheck,
  Globe,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Compass,
  FileText,
  Activity,
  ChevronRight,
  Filter,
  PlayCircle,
  XCircle,
  Sparkles
} from 'lucide-react';
import {
  OrchestrationRun,
  OrchestrationStep,
  OrchestrationDecision,
  OrchestrationRoute,
  OrchestrationStatus
} from '../types/darb-ai-orchestrator.types';

export default function DarbAIOrchestratorView() {
  const [runs, setRuns] = useState<OrchestrationRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [routeFilter, setRouteFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected run details
  const [selectedRun, setSelectedRun] = useState<OrchestrationRun | null>(null);
  const [steps, setSteps] = useState<OrchestrationStep[]>([]);
  const [decisions, setDecisions] = useState<OrchestrationDecision[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Simulator state
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simQuestion, setSimQuestion] = useState('');
  const [simRoute, setSimRoute] = useState<'knowledge_only' | 'knowledge_then_web'>('knowledge_then_web');
  const [simConsent, setSimConsent] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  // Metrics
  const [metrics, setMetrics] = useState({
    totalRuns: 0,
    knowledgeOnly: 0,
    consentRequests: 0,
    insufficientEvidence: 0,
    completedRate: 100,
  });

  const fetchRunsAndMetrics = async () => {
    try {
      setRefreshing(true);
      const [runsRes, metricsRes] = await Promise.all([
        fetch(`/api/admin/ai/orchestration-runs?status=${statusFilter}&route=${routeFilter}&search=${encodeURIComponent(searchQuery)}`),
        fetch('/api/admin/ai/orchestration-metrics'),
      ]);

      if (runsRes.ok) {
        const data = await runsRes.json();
        setRuns(data.items || []);
        if (data.items && data.items.length > 0 && !selectedRun) {
          loadRunDetails(data.items[0]);
        }
      }

      if (metricsRes.ok) {
        const mData = await metricsRes.json();
        if (mData.metrics) setMetrics(mData.metrics);
      }
    } catch (err) {
      console.warn('[DARB Orchestrator] fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRunsAndMetrics();
  }, [statusFilter, routeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRunsAndMetrics();
  };

  const loadRunDetails = async (run: OrchestrationRun) => {
    setSelectedRun(run);
    setLoadingDetails(true);
    try {
      const [stepsRes, decisionsRes] = await Promise.all([
        fetch(`/api/admin/ai/orchestration-runs/${run.id}/steps`),
        fetch(`/api/admin/ai/orchestration-runs/${run.id}/decisions`),
      ]);

      if (stepsRes.ok) {
        const stepsData = await stepsRes.json();
        setSteps(stepsData.items || []);
      }
      if (decisionsRes.ok) {
        const decisionsData = await decisionsRes.json();
        setDecisions(decisionsData.items || []);
      }
    } catch (err) {
      console.warn('[DARB Orchestrator] load details error:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const runSimulation = async () => {
    if (!simQuestion.trim()) return;
    setSimulating(true);
    setSimResult(null);
    try {
      const res = await fetch('/api/admin/ai/orchestration-runs/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: simQuestion.trim(),
          simulateRoute: simRoute,
          hasConsent: simConsent,
        }),
      });

      if (res.ok) {
        const d = await res.json();
        setSimResult(d);
        fetchRunsAndMetrics();
      }
    } catch (err) {
      console.warn('[DARB Orchestrator] simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header & Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-200/60 dark:border-indigo-800/60">
              <GitFork className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  منسّق الذكاء الاصطناعي ومسار المعالجة (AI Orchestrator)
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700">
                  V1.18 نشط
                </span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                  حظر النشر التلقائي
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
                المسار الموحّد لمعالجة الاستفسارات: يبدأ من قاعدة معرفة دَرْب أولاً، يقيم كفاية الأدلة، يطلب موافقة المستخدم الصريحة عند الحاجة للويب، يدمج المصادر ويفحص التعارضات، ويوثق الخطوات والقرارات دون تعديل تلقائي لقاعدة المعرفة.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSimulatorOpen(!simulatorOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              {simulatorOpen ? 'إغلاق المحاكي' : 'محاكي المسار'}
            </button>
            <button
              onClick={fetchRunsAndMetrics}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              تحديث
            </button>
          </div>
        </div>

        {/* Simulator Drawer */}
        {simulatorOpen && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                محاكاة تشغيل استفسار عبر المنسّق
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                اختبار فوري للمسارات والقرارات وسجل الخطوات
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6">
                <input
                  type="text"
                  placeholder="اكتب استفساراً تجريبياً (مثال: شروط الإقامة، رسوم الفحص الطبي...)"
                  value={simQuestion}
                  onChange={(e) => setSimQuestion(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="md:col-span-3">
                <select
                  value={simRoute}
                  onChange={(e) => setSimRoute(e.target.value as any)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="knowledge_only">أدلة كافية في قاعدة المعرفة</option>
                  <option value="knowledge_then_web">معرفة غير كافية (طلب ويب)</option>
                </select>
              </div>
              <div className="md:col-span-3 flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simConsent}
                    onChange={(e) => setSimConsent(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  موافقة الويب ممنوحة
                </label>
                <button
                  onClick={runSimulation}
                  disabled={simulating || !simQuestion.trim()}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-colors mr-auto"
                >
                  {simulating ? 'جارٍ التشغيل...' : 'تشغيل المسار'}
                </button>
              </div>
            </div>

            {simResult && (
              <div className="mt-4 p-3 bg-white dark:bg-slate-700/80 rounded-lg border border-indigo-200 dark:border-indigo-800 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                <div className="font-bold text-indigo-700 dark:text-indigo-300">
                  نتيجة المحاكاة (المسار: {simResult.plan?.route} | الحالة: {simResult.plan?.status})
                </div>
                <div>الإجابة المقررة: {simResult.plan?.answer || simResult.run?.final_answer}</div>
                <div>عدد الأدلة المجمعة: {simResult.evidence?.length || 0} شارة</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>إجمالي المسارات</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {metrics.totalRuns}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">عمليات تشغيل مسجلة</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>المعرفة أولاً وفقط</span>
            <BookOpen className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {metrics.knowledgeOnly}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">اكتفاء بقاعدة دَرْب</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>طلبات موافقة الويب</span>
            <Globe className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {metrics.consentRequests}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Consent-Aware Gate</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>نقص الأدلة المكتشف</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {metrics.insufficientEvidence}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">امتناع عن التخمين</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>معدل الإنجاز</span>
            <CheckCircle2 className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
            {metrics.completedRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">نسبة المسارات الناجحة</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="البحث في الأسئلة أو المسارات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm pr-9 pl-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>الحالة:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="all">الكل</option>
              <option value="completed">مكتمل</option>
              <option value="needs_consent">بانتظار الموافقة</option>
              <option value="insufficient_evidence">نقص أدلة</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span>المسار:</span>
            <select
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="all">كل المسارات</option>
              <option value="knowledge_only">المعرفة فقط 🟢</option>
              <option value="knowledge_then_web">المعرفة ثم الويب 🔵</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Split View: Runs List & Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Primary Column: Runs Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                سجل مسارات التشغيل ({runs.length})
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              اختر مساراً لمعاينة تسلسل الخطوات والقرارات
            </span>
          </div>

          <div className="overflow-x-auto flex-1 max-h-[620px] overflow-y-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                جارٍ تحميل سجلات التشغيل...
              </div>
            ) : runs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                لا توجد مسارات تشغيل مطابقة للتصفية الحالية.
              </div>
            ) : (
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-100 dark:border-slate-700/80 sticky top-0 z-10 backdrop-blur-sm">
                  <tr>
                    <th className="p-3">المعرف</th>
                    <th className="p-3">السؤال</th>
                    <th className="p-3">المسار</th>
                    <th className="p-3">موافقة الويب</th>
                    <th className="p-3">الأدلة</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">التوقيت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {runs.map((run) => {
                    const isSelected = selectedRun?.id === run.id;
                    return (
                      <tr
                        key={run.id}
                        onClick={() => loadRunDetails(run)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-r-4 border-indigo-600'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/40'
                        }`}
                      >
                        <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                          #{run.id}
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-slate-900 dark:text-white line-clamp-1 max-w-[200px]" title={run.question}>
                            {run.question}
                          </div>
                        </td>
                        <td className="p-3">
                          {run.route === 'knowledge_only' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium border border-emerald-200/60 dark:border-emerald-800">
                              <span>🟢</span> المعرفة فقط
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-medium border border-blue-200/60 dark:border-blue-800">
                              <span>🔵</span> المعرفة + الويب
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {run.consent_web_search ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">ممنوحة ✓</span>
                          ) : run.status === 'needs_consent' ? (
                            <span className="text-amber-600 dark:text-amber-400 font-semibold">مطلوبة ⚠️</span>
                          ) : (
                            <span className="text-slate-400">غير مطلوبة</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300 font-mono">
                          {run.knowledge_count} م / {run.web_count} و
                        </td>
                        <td className="p-3">
                          {run.status === 'completed' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                              مكتمل
                            </span>
                          ) : run.status === 'needs_consent' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                              بانتظار الموافقة
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300">
                              نقص أدلة
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-[11px] text-slate-500 whitespace-nowrap">
                          {new Date(run.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Execution Steps & Decisions Inspector */}
        <div className="lg:col-span-5 space-y-4">
          {selectedRun ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    تشغيل #{selectedRun.id}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({new Date(selectedRun.created_at).toLocaleString('ar-EG')})
                  </span>
                </div>
                <div className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {selectedRun.route}
                </div>
              </div>

              {/* Question & Answer Box */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  السؤال الموجه
                </label>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm font-medium text-slate-900 dark:text-white border border-slate-200/60 dark:border-slate-700">
                  {selectedRun.question}
                </div>
              </div>

              {selectedRun.final_answer && (
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    الإجابة الناتجة
                  </label>
                  <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/20 rounded-xl text-xs text-slate-800 dark:text-slate-200 border border-indigo-100 dark:border-indigo-900 leading-relaxed">
                    {selectedRun.final_answer}
                  </div>
                </div>
              )}

              {/* Steps Timeline */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    سجل خطوات المسار ({steps.length})
                  </label>
                  <span className="text-[11px] text-slate-400">تسلسل متتابع</span>
                </div>

                {loadingDetails ? (
                  <div className="text-center py-6 text-xs text-slate-400">جارٍ جلب الخطوات والقرارات...</div>
                ) : steps.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    لم تسجل خطوات تفصيلية لهذا المسار
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {steps.map((step, idx) => (
                      <div
                        key={step.id || idx}
                        className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              {step.step_name}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              مدخلات: {step.input_count ?? 0} | مخرجات: {step.output_count ?? 0}
                            </div>
                          </div>
                        </div>
                        <div className="text-left">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            {step.status}
                          </span>
                          {step.duration_ms !== null && step.duration_ms !== undefined && (
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {step.duration_ms}ms
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Decisions Log */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                    سجل قرارات التحكيم والحوكمة ({decisions.length})
                  </label>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400">Human-In-The-Loop</span>
                </div>

                {decisions.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    لا توجد قرارات مسجلة
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {decisions.map((dec, dIdx) => (
                      <div
                        key={dec.id || dIdx}
                        className="p-2.5 rounded-lg border border-teal-200/70 dark:border-teal-900/60 bg-teal-50/40 dark:bg-teal-950/20 text-xs"
                      >
                        <div className="flex items-center justify-between font-semibold text-teal-800 dark:text-teal-300">
                          <span>{dec.decision_type}</span>
                          <span className="font-mono text-[11px] bg-teal-100 dark:bg-teal-900 px-1.5 py-0.5 rounded">
                            {dec.decision_value}
                          </span>
                        </div>
                        {dec.reason && (
                          <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-1 leading-relaxed">
                            {dec.reason}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Safety & Governance Notice */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>سياسة الأمان:</strong> لا يقوم المنسّق بنشر أي محتوى بشكل آلي إلى قاعدة المعرفة. إذا نتج عن المسار سد ثغرة معرفية، يرسل كمسودة للمراجعة البشرية في تبويب التعلّم الذاتي.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center text-slate-400 text-sm">
              <Compass className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              اختر مسار تشغيل من الجدول لمعاينة تفاصيله الكاملة
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
