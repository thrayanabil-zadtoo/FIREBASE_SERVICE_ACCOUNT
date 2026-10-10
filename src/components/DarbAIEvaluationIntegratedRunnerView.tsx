import React, { useState, useEffect } from "react";
import {
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
  History,
  Lock,
  Cpu,
  RefreshCw,
  Copy,
  Check
} from "lucide-react";
import {
  EvaluationJob,
  CaseExecution,
  RunnerMode,
  RunnerSummary
} from "../types/darb-ai-evaluation-runner";

interface DarbAIEvaluationIntegratedRunnerViewProps {
  suites?: Array<{ id: number; name: string; description?: string; total_cases?: number }>;
}

export const DarbAIEvaluationIntegratedRunnerView: React.FC<DarbAIEvaluationIntegratedRunnerViewProps> = ({
  suites = []
}) => {
  // Config & Selection
  const [selectedSuiteId, setSelectedSuiteId] = useState<number>(suites[0]?.id || 1);
  const [runnerMode, setRunnerMode] = useState<RunnerMode>("dry_run");
  const [running, setRunning] = useState<boolean>(false);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  // Active Execution / Results
  const [activeJob, setActiveJob] = useState<EvaluationJob | null>(null);
  const [summary, setSummary] = useState<RunnerSummary | null>(null);
  const [executions, setExecutions] = useState<CaseExecution[]>([]);
  const [recentJobs, setRecentJobs] = useState<EvaluationJob[]>([]);

  // UI state
  const [filterFailedOnly, setFilterFailedOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedCaseId, setExpandedCaseId] = useState<number | null>(null);
  const [copiedCorrelation, setCopiedCorrelation] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const notify = (text: string, type: "success" | "error" | "info" = "success") => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 5000);
  };

  const loadJobsHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/admin/ai/evaluation/runner/jobs");
      const data = await res.json();
      if (data?.jobs && Array.isArray(data.jobs)) {
        setRecentJobs(data.jobs);
        if (!activeJob && data.jobs.length > 0) {
          loadJobExecutions(data.jobs[0]);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadJobExecutions = async (job: EvaluationJob) => {
    setActiveJob(job);
    try {
      const res = await fetch(`/api/admin/ai/evaluation/runner/jobs/${job.id}/executions`);
      const data = await res.json();
      if (Array.isArray(data?.executions)) {
        const execs: CaseExecution[] = data.executions;
        setExecutions(execs);

        // compute summary
        const total = execs.length;
        const passed = execs.filter(x => x.passed).length;
        const failed = total - passed;
        const latencies = execs.map(x => Number(x.latency_ms || x.latencyMs || 0));
        const tokensList = execs.map(x => Number(x.tokens || 0));
        setSummary({
          total,
          passed,
          failed,
          passRate: total ? passed / total : 0,
          avgLatencyMs: latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0,
          avgTokens: tokensList.length ? Math.round(tokensList.reduce((a, b) => a + b, 0) / tokensList.length) : 0
        });
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadJobsHistory();
  }, []);

  const handleStartEvaluation = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/admin/ai/evaluation/runner/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suiteId: selectedSuiteId,
          mode: runnerMode
        })
      });

      const data = await res.json();
      if (data?.ok) {
        notify(`اكتمل تشغيل التقييم بنجاح [${data.correlationId}] - معدل النجاح: ${Math.round((data.summary?.passRate || 0) * 100)}%`);
        if (data.summary) {
          setSummary(data.summary);
        }
        if (Array.isArray(data.executions)) {
          setExecutions(data.executions);
        }
        setActiveJob({
          id: data.jobId,
          suite_id: selectedSuiteId,
          correlation_id: data.correlationId,
          mode: data.mode,
          status: "completed",
          total_cases: data.summary?.total || data.executions?.length || 0,
          completed_cases: data.summary?.total || data.executions?.length || 0,
          failed_cases: data.summary?.failed || 0,
          finished_at: new Date().toISOString()
        });
        loadJobsHistory();
      } else {
        notify(data?.error || "فشل تشغيل التقييم الآلي", "error");
      }
    } catch {
      notify("تعذر الاتصال بخادم التقييم", "error");
    } finally {
      setRunning(false);
    }
  };

  const copyCorrelationId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedCorrelation(true);
    setTimeout(() => setCopiedCorrelation(false), 2000);
  };

  // Filtered executions
  const filteredExecutions = executions.filter(item => {
    if (filterFailedOnly && item.passed) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = (item.caseTitle || item.case_title || "").toLowerCase();
      const err = (item.errorReason || item.error_reason || "").toLowerCase();
      const rActual = (item.route_actual || item.route || "").toLowerCase();
      const sActual = (item.source_actual || item.source || "").toLowerCase();
      return title.includes(q) || err.includes(q) || rActual.includes(q) || sActual.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 text-right" dir="rtl" id="v123-evaluation-integrated-runner">
      {/* Control Card: Suite Selection, Mode & Start */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full font-mono">
                V1.23 INTEGRATED RUNNER
              </span>
              <h3 className="text-base font-bold text-stone-900">
                مشغّل التقييم الآلي المتكامل ومراقبة الامتثال
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              تنفيذ حزم الاختبار المرجعية آلياً مع توليد Correlation ID وتدقيق المسار والمصادر والأدلة وحساب معدلات النجاح والـ Latency واستهلاك الـ Tokens.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleStartEvaluation}
              disabled={running}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 shadow-xs cursor-pointer"
              id="btn-start-eval-runner"
            >
              <Play className={`w-4 h-4 ${running ? "animate-spin" : ""}`} />
              {running ? "جاري تشغيل الاختبارات الآلية..." : "بدء التقييم الشامل (Start Evaluation)"}
            </button>

            <button
              onClick={loadJobsHistory}
              disabled={loadingHistory}
              className="p-2.5 border border-stone-200 rounded-xl hover:bg-stone-50 transition text-stone-600 cursor-pointer"
              title="تحديث سجل التشغيل"
            >
              <RefreshCw className={`w-4 h-4 ${loadingHistory ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Suite & Mode Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-stone-100">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>اختيار حزمة الاختبار (Evaluation Suite):</span>
            </label>
            <select
              value={selectedSuiteId}
              onChange={e => setSelectedSuiteId(Number(e.target.value))}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 font-medium focus:ring-1 focus:ring-teal-600 focus:outline-none"
            >
              {suites.length > 0 ? (
                suites.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.total_cases || 0} حالة اختبار)
                  </option>
                ))
              ) : (
                <>
                  <option value={1}>حزمة استفسارات الإقامة والعمل والمعاملات الحكومية (5 حالات)</option>
                  <option value={2}>حزمة موثوقية مصادر الخليج والتوثيق (4 حالات)</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-teal-600" />
              <span>نمط التشغيل (Runner Mode):</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRunnerMode("dry_run")}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  runnerMode === "dry_run"
                    ? "bg-teal-50 border-teal-600 text-teal-800"
                    : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Dry Run (محاكاة آمنة)</span>
              </button>

              <button
                type="button"
                onClick={() => setRunnerMode("integration")}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  runnerMode === "integration"
                    ? "bg-indigo-50 border-indigo-600 text-indigo-800"
                    : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Integration (تكامل فعلي)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Strict Human-in-the-Loop Banner */}
        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>قواعد الحوكمة الصارمة (V1.23 Standards):</strong> وضع <strong>Dry Run</strong> لا يحدث أي تغيير على المعرفة؛ ووضع <strong>Integration</strong> محظور تماماً من الكتابة إلى قاعدة المعرفة الحية (Auto Publish = false).
            </span>
          </div>
          <span className="bg-white px-2 py-0.5 rounded border border-amber-200 font-mono text-[10px] font-bold shrink-0">
            Write-Locked
          </span>
        </div>
      </div>

      {/* Notice Message */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : feedback.type === "error"
              ? "bg-rose-50 text-rose-800 border border-rose-200"
              : "bg-blue-50 text-blue-800 border border-blue-200"
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="underline cursor-pointer">
            إغلاق
          </button>
        </div>
      )}

      {/* Correlation ID & Active Job Status */}
      {activeJob && (
        <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-400 font-bold">Correlation ID:</span>
              <span className="font-mono text-xs text-teal-300 bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-700 select-all">
                {activeJob.correlation_id}
              </span>
              <button
                onClick={() => copyCorrelationId(activeJob.correlation_id)}
                className="text-stone-400 hover:text-white p-1 transition cursor-pointer"
                title="نسخ المعرف"
              >
                {copiedCorrelation ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-400">حالة التشغيل:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                  activeJob.status === "completed"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : activeJob.status === "running"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                }`}
              >
                {activeJob.status === "completed" ? "مكتمل (Completed)" : activeJob.status}
              </span>
              <span className="bg-stone-800 text-stone-300 px-2 py-0.5 rounded text-[11px] font-mono border border-stone-700">
                Mode: {activeJob.mode}
              </span>
            </div>
          </div>

          {/* Metric KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
              <div className="text-[11px] text-stone-400">إجمالي الحالات</div>
              <div className="text-xl font-bold text-white mt-1">
                {summary ? summary.total : activeJob.total_cases}
              </div>
            </div>

            <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
              <div className="text-[11px] text-stone-400">الحالات الناجحة</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">
                {summary ? summary.passed : activeJob.completed_cases - activeJob.failed_cases}
              </div>
            </div>

            <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
              <div className="text-[11px] text-stone-400">الحالات غير المطابقة</div>
              <div className="text-xl font-bold text-rose-400 mt-1">
                {summary ? summary.failed : activeJob.failed_cases}
              </div>
            </div>

            <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
              <div className="text-[11px] text-stone-400">معدل النجاح (Pass Rate)</div>
              <div className="text-xl font-bold text-teal-300 mt-1">
                {summary ? `${Math.round(summary.passRate * 100)}%` : "—"}
              </div>
            </div>

            <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
              <div className="text-[11px] text-stone-400">متوسط الاستجابة</div>
              <div className="text-xl font-bold text-amber-300 mt-1 flex items-baseline gap-1">
                <span>{summary ? summary.avgLatencyMs : 0}</span>
                <span className="text-[10px] text-stone-400 font-normal">ms</span>
              </div>
            </div>

            <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
              <div className="text-[11px] text-stone-400">متوسط الـ Tokens</div>
              <div className="text-xl font-bold text-indigo-300 mt-1 flex items-baseline gap-1">
                <span>{summary ? summary.avgTokens : 0}</span>
                <span className="text-[10px] text-stone-400 font-normal">tok</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Case Executions Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <h4 className="text-sm font-bold text-stone-900">
              سجل تنفيذ حالات الاختبار (Case Executions)
            </h4>
            <span className="bg-stone-200 text-stone-700 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
              {filteredExecutions.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterFailedOnly(!filterFailedOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                filterFailedOnly
                  ? "bg-rose-600 text-white"
                  : "bg-white border border-stone-300 text-stone-700 hover:bg-stone-100"
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>الحالات الفاشلة فقط</span>
            </button>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="بحث في الحالات..."
                className="pr-8 pl-3 py-1.5 border border-stone-300 rounded-lg text-xs w-48 focus:ring-1 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-bold">
              <tr>
                <th className="py-3 px-3">الحالة والنتيجة</th>
                <th className="py-3 px-3">عنوان الحالة</th>
                <th className="py-3 px-3">فحص المسار</th>
                <th className="py-3 px-3">فحص المصدر</th>
                <th className="py-3 px-3">فحص الثقة</th>
                <th className="py-3 px-3">الأدلة والاستشهاد</th>
                <th className="py-3 px-3">Latency</th>
                <th className="py-3 px-3">Tokens</th>
                <th className="py-3 px-3 text-center">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredExecutions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-stone-400">
                    لا توجد حالات مسجلة تطابق التصفية الحالية
                  </td>
                </tr>
              ) : (
                filteredExecutions.map(item => {
                  const isExpanded = expandedCaseId === (item.id || item.caseId);
                  return (
                    <React.Fragment key={item.id || item.caseId}>
                      <tr className="hover:bg-stone-50 transition">
                        <td className="py-3 px-3 whitespace-nowrap">
                          {item.passed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" /> ناجحة (Pass)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <XCircle className="w-3.5 h-3.5" /> غير مطابقة (Fail)
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 font-medium text-stone-900 max-w-xs truncate">
                          {item.caseTitle || item.case_title || `Case #${item.caseId || item.case_id}`}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                              item.routeOk
                                ? "bg-stone-100 text-stone-800"
                                : "bg-rose-100 text-rose-800 font-bold"
                            }`}
                          >
                            {item.route_actual || item.route || "—"}
                          </span>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                              item.sourceOk
                                ? "bg-stone-100 text-stone-800"
                                : "bg-rose-100 text-rose-800 font-bold"
                            }`}
                          >
                            {item.source_actual || item.source || "—"}
                          </span>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] ${
                              item.confidenceOk
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-800 font-bold"
                            }`}
                          >
                            {item.confidence_actual || item.confidence || "—"}
                          </span>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded ${
                                item.evidenceOk
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-stone-100 text-stone-500"
                              }`}
                            >
                              أدلة {item.evidenceOk ? "✓" : "✗"}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded ${
                                item.citationsOk
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-stone-100 text-stone-500"
                              }`}
                            >
                              استشهاد {item.citationsOk ? "✓" : "✗"}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono text-stone-700 whitespace-nowrap">
                          {item.latency_ms || item.latencyMs || 0} ms
                        </td>

                        <td className="py-3 px-3 font-mono text-stone-700 whitespace-nowrap">
                          {item.tokens || 0}
                        </td>

                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <button
                            onClick={() =>
                              setExpandedCaseId(isExpanded ? null : item.id || item.caseId || 1)
                            }
                            className="p-1 text-stone-500 hover:text-stone-800 transition cursor-pointer"
                            title="عرض تفاصيل الملاحظة"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Observation Details Expandable Row */}
                      {isExpanded && (
                        <tr className="bg-stone-50/80">
                          <td colSpan={9} className="p-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div className="bg-white p-3 rounded-xl border border-stone-200">
                                <div className="font-bold text-stone-800 mb-1 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                                  <span>تفاصيل الملاحظة (Observation Details):</span>
                                </div>
                                <pre className="font-mono text-[11px] bg-stone-50 p-2.5 rounded-lg border border-stone-200/80 text-stone-800 overflow-x-auto whitespace-pre-wrap">
                                  {JSON.stringify(item.observation || item.observation_json || {}, null, 2)}
                                </pre>
                              </div>

                              <div className="bg-white p-3 rounded-xl border border-stone-200">
                                <div className="font-bold text-stone-800 mb-1 flex items-center gap-1">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                  <span>سبب الفشل والتشخيص (Failure Reason):</span>
                                </div>
                                {item.errorReason || item.error_reason ? (
                                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs leading-relaxed">
                                    <strong>الخطأ: </strong>
                                    {item.errorReason || item.error_reason}
                                    {item.errorCode || item.error_code ? (
                                      <div className="font-mono text-[10px] text-rose-600 mt-1">
                                        Code: {item.errorCode || item.error_code}
                                      </div>
                                    ) : null}
                                  </div>
                                ) : (
                                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs">
                                    جميع المعايير مطابقة للتوقعات بنجاح (المسار، المصدر، مستوى الثقة، الأدلة، الاستشهاد).
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Evaluation Jobs List */}
      {recentJobs.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-teal-600" />
              <span>سجل مهام التقييم السابقة (Previous Evaluation Jobs)</span>
            </h4>
            <span className="text-[11px] text-stone-500 font-mono">
              {recentJobs.length} Jobs
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {recentJobs.map(job => (
              <div
                key={job.id}
                onClick={() => loadJobExecutions(job)}
                className={`p-3 rounded-xl border text-xs transition cursor-pointer ${
                  activeJob?.id === job.id
                    ? "bg-teal-50/70 border-teal-600 shadow-xs"
                    : "bg-stone-50 border-stone-200 hover:bg-stone-100"
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-stone-500">Job #{job.id}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                      job.status === "completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-stone-900 mt-1 truncate">
                  {job.correlation_id}
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 pt-2 border-t border-stone-200/60">
                  <span>نمط: {job.mode}</span>
                  <span>حالات: {job.total_cases}</span>
                  <span className="text-rose-600">فشل: {job.failed_cases}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
