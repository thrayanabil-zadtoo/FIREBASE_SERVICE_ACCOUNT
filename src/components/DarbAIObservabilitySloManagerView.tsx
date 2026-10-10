import React, { useState, useEffect, useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Lock,
  RefreshCw,
  FileText,
  Copy,
  Check,
  Plus,
  Sliders,
  TrendingDown,
  TrendingUp,
  Server,
  AlertCircle,
  HelpCircle,
  UserCheck,
  CheckSquare,
} from "lucide-react";
import {
  ObservabilityHealth,
  AlertSeverity,
  AlertStatus,
  ObservabilitySummary,
  SloPolicy,
  ObservabilityAlert,
  ObservabilityIncident,
} from "../types/darb-ai-observability-slo";

interface ObservabilityAuditItem {
  id: number;
  action: string;
  actor_id: number | null;
  environment: string | null;
  version_id: number | null;
  alert_id: number | null;
  incident_id: number | null;
  reason: string;
  details_json: any;
  created_at: string;
}

export function DarbAIObservabilitySloManagerView() {
  const [selectedEnv, setSelectedEnv] = useState<string>("production");
  const [summary, setSummary] = useState<ObservabilitySummary | null>(null);
  const [sloPolicies, setSloPolicies] = useState<SloPolicy[]>([]);
  const [alerts, setAlerts] = useState<ObservabilityAlert[]>([]);
  const [incidents, setIncidents] = useState<ObservabilityIncident[]>([]);
  const [auditLogs, setAuditLogs] = useState<ObservabilityAuditItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Filters & Modals
  const [alertStatusFilter, setAlertStatusFilter] = useState<"all" | "open" | "acknowledged" | "resolved">("open");
  const [alertSeverityFilter, setAlertSeverityFilter] = useState<"all" | "info" | "warning" | "critical">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Acknowledge Modal
  const [selectedAlertToAck, setSelectedAlertToAck] = useState<ObservabilityAlert | null>(null);
  const [ackReason, setAckReason] = useState<string>("");
  const [ackActorId, setAckActorId] = useState<number>(99);
  const [ackSubmitting, setAckSubmitting] = useState<boolean>(false);

  // Create Incident Modal
  const [showCreateIncidentModal, setShowCreateIncidentModal] = useState<boolean>(false);
  const [newIncTitle, setNewIncTitle] = useState<string>("");
  const [newIncSummary, setNewIncSummary] = useState<string>("");
  const [newIncSeverity, setNewIncSeverity] = useState<string>("medium");
  const [newIncAlertId, setNewIncAlertId] = useState<string>("");
  const [creatingIncident, setCreatingIncident] = useState<boolean>(false);

  // Resolve Incident Modal
  const [selectedIncToResolve, setSelectedIncToResolve] = useState<ObservabilityIncident | null>(null);
  const [incRootCause, setIncRootCause] = useState<string>("");
  const [incRemediation, setIncRemediation] = useState<string>("");
  const [incResolveReason, setIncResolveReason] = useState<string>("");
  const [resolvingIncident, setResolvingIncident] = useState<boolean>(false);

  // Test SLO Evaluation Modal
  const [showSloTestModal, setShowSloTestModal] = useState<boolean>(false);
  const [testMetricKey, setTestMetricKey] = useState<string>("error_rate");
  const [testMetricValue, setTestMetricValue] = useState<number>(0.06);
  const [testTarget, setTestTarget] = useState<number>(0.05);
  const [testComparison, setTestComparison] = useState<"lte" | "gte">("lte");
  const [sloTestResult, setSloTestResult] = useState<any>(null);

  const fetchAllData = async (env: string) => {
    setLoading(true);
    try {
      const [sumRes, sloRes, alertsRes, incRes, auditRes] = await Promise.all([
        fetch(`/api/admin/ai/observability/summary?environment=${env}`),
        fetch(`/api/admin/ai/observability/slo`),
        fetch(`/api/admin/ai/observability/alerts?environment=${env}&status=all`),
        fetch(`/api/admin/ai/observability/incidents`),
        fetch(`/api/admin/ai/observability/audit?environment=${env}`),
      ]);

      if (sumRes.ok) {
        const d = await sumRes.json();
        setSummary({
          environment: env,
          status: d.status || "healthy",
          metrics: d.metrics || {},
          autoRemediation: false,
        });
      }

      if (sloRes.ok) {
        const d = await sloRes.json();
        setSloPolicies(d.policies || []);
      }

      if (alertsRes.ok) {
        const d = await alertsRes.json();
        setAlerts(d.alerts || []);
      }

      if (incRes.ok) {
        const d = await incRes.json();
        setIncidents(d.incidents || []);
      }

      if (auditRes.ok) {
        const d = await auditRes.json();
        setAuditLogs(d.audit || []);
      }
    } catch (err) {
      console.error("Failed to load observability data:", err);
      setStatusMessage({ text: "تعذر الاتصال بمركز المراقبة، استخدام بيانات الذاكرة الاحتياطية", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData(selectedEnv);
  }, [selectedEnv]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData(selectedEnv);
    setRefreshing(false);
    setStatusMessage({ text: "تم تحديث مؤشرات المراقبة التشغيلية بنجاح", type: "success" });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAcknowledgeAlert = async () => {
    if (!selectedAlertToAck?.id) return;
    setAckSubmitting(true);
    try {
      const res = await fetch(`/api/admin/ai/observability/alerts/${selectedAlertToAck.id}/acknowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actorId: ackActorId,
          reason: ackReason || "تم الاطلاع وتأكيد التنبيه يدويًا من قبل مهندس الذكاء الاصطناعي",
        }),
      });
      if (res.ok) {
        setStatusMessage({
          text: `تم تسجيل الإقرار البشري للتنبيه #${selectedAlertToAck.id} بنجاح. لا إجراء تشغيلي تلقائي (Auto Remediation Disabled).`,
          type: "success",
        });
        setSelectedAlertToAck(null);
        setAckReason("");
        await fetchAllData(selectedEnv);
      } else {
        setStatusMessage({ text: "فشل إقرار التنبيه", type: "error" });
      }
    } catch (e) {
      setStatusMessage({ text: "خطأ أثناء تسجيل الإقرار", type: "error" });
    } finally {
      setAckSubmitting(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleCreateIncident = async () => {
    if (!newIncTitle.trim()) return;
    setCreatingIncident(true);
    try {
      const res = await fetch("/api/admin/ai/observability/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          environment: selectedEnv,
          versionId: 1,
          alertId: newIncAlertId ? Number(newIncAlertId) : null,
          severity: newIncSeverity,
          title: newIncTitle,
          summary: newIncSummary,
          actorId: 99,
        }),
      });
      if (res.ok) {
        setStatusMessage({ text: "تم تسجيل الحادث التشغيلي بنجاح في السجل المركزي", type: "success" });
        setShowCreateIncidentModal(false);
        setNewIncTitle("");
        setNewIncSummary("");
        setNewIncAlertId("");
        await fetchAllData(selectedEnv);
      } else {
        setStatusMessage({ text: "فشل إنشاء الحادث", type: "error" });
      }
    } catch (e) {
      setStatusMessage({ text: "خطأ في الاتصال بالخادم", type: "error" });
    } finally {
      setCreatingIncident(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleResolveIncident = async () => {
    if (!selectedIncToResolve?.id || !incRootCause.trim() || !incRemediation.trim()) {
      setStatusMessage({ text: "يجب توثيق السبب الجذري والإجراء التصحيحي قبل الإغلاق", type: "error" });
      return;
    }
    setResolvingIncident(true);
    try {
      const res = await fetch(`/api/admin/ai/observability/incidents/${selectedIncToResolve.id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actorId: 99,
          rootCause: incRootCause,
          remediation: incRemediation,
          reason: incResolveReason || "إغلاق يدوي معتمد بعد التحقق من استقرار النظام",
        }),
      });
      if (res.ok) {
        setStatusMessage({
          text: `تم حل وتوثيق الحادث #${selectedIncToResolve.id} يدويًا بنجاح مع حفظ السبب الجذري والإجراء التصحيحي.`,
          type: "success",
        });
        setSelectedIncToResolve(null);
        setIncRootCause("");
        setIncRemediation("");
        setIncResolveReason("");
        await fetchAllData(selectedEnv);
      } else {
        setStatusMessage({ text: "فشل إغلاق الحادث", type: "error" });
      }
    } catch (e) {
      setStatusMessage({ text: "خطأ أثناء محاولة إغلاق الحادث", type: "error" });
    } finally {
      setResolvingIncident(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleEvaluateSloTest = async () => {
    try {
      const res = await fetch("/api/admin/ai/observability/slo/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metricKey: testMetricKey,
          value: Number(testMetricValue),
          target: Number(testTarget),
          comparison: testComparison,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        setSloTestResult(d);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered Alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      const matchStatus = alertStatusFilter === "all" || a.status === alertStatusFilter;
      const matchSeverity = alertSeverityFilter === "all" || a.severity === alertSeverityFilter;
      return matchStatus && matchSeverity;
    });
  }, [alerts, alertStatusFilter, alertSeverityFilter]);

  // Environment-specific incidents
  const envIncidents = useMemo(() => {
    return incidents.filter((i) => i.environment === selectedEnv);
  }, [incidents, selectedEnv]);

  // Metrics extraction
  const curMetrics = summary?.metrics || {};
  const errorRate = Number(curMetrics.error_rate ?? 0);
  const p95Latency = Number(curMetrics.p95_latency_ms ?? 0);
  const providerFailure = Number(curMetrics.provider_failure_rate ?? 0);
  const helpfulRate = Number(curMetrics.answer_helpful_rate ?? 0);

  const activeAlertsCount = alerts.filter((a) => a.status === "open").length;

  return (
    <div className="space-y-6 text-stone-900 pb-12" dir="rtl">
      {/* Header & Controls */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                <Activity className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-900">
                  مراقبة AI وSLO الموحدة V1.27 (AI Observability & SLO Manager)
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  رصد جودة وصحة نماذج DARB AI بعد النشر، مطابقة أهداف الخدمة (SLO)، وإدارة التنبيهات والحوادث التشغيلية
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Environment Selector */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              {(["production", "staging", "development"] as const).map((env) => (
                <button
                  key={env}
                  onClick={() => setSelectedEnv(env)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedEnv === env
                      ? "bg-white text-emerald-800 shadow-xs border border-stone-200"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {env === "production" ? "الإنتاج (Production)" : env === "staging" ? "التجهيز (Staging)" : "التطوير (Dev)"}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors cursor-pointer border border-stone-200"
              title="تحديث البيانات اللحظية"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>تحديث</span>
            </button>
          </div>
        </div>

        {/* Strict Governance Notice */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="font-semibold">
              ضوابط الحوكمة الصارمة: ممنوع كليًا أي Auto Remediation أو Auto Deploy أو Auto Rollback. التنبيهات لا تنفذ إجراءات تلقائية، وأي تدخّل يتطلب قرارًا وتوثيقًا بشريًا.
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 bg-amber-200/60 rounded-md text-[11px] font-bold text-amber-950">
            <Lock className="w-3 h-3 text-amber-800" />
            <span>Remediation Disabled</span>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`mt-3 p-3 rounded-xl text-xs font-medium flex items-center justify-between border ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : statusMessage.type === "error"
                ? "bg-rose-50 text-rose-800 border-rose-200"
                : "bg-blue-50 text-blue-800 border-blue-200"
            }`}
          >
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="text-stone-400 hover:text-stone-700">✕</button>
          </div>
        )}
      </div>

      {/* Health Overview & Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* System Health Status */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
            <span>الحالة التشغيلية العامة</span>
            <Server className="w-4 h-4 text-stone-400" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            {summary?.status === "healthy" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl text-sm font-bold border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>مستقر (Healthy)</span>
              </span>
            ) : summary?.status === "degraded" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-xl text-sm font-bold border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>متراجع (Degraded)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 rounded-xl text-sm font-bold border border-rose-200">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>حرج (Critical)</span>
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            بيئة: <span className="font-semibold text-stone-800">{selectedEnv}</span> | نافذة التقييم: 60 دقيقة
          </p>
        </div>

        {/* Error Rate Metric */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>معدل الأخطاء (Error Rate)</span>
            <AlertCircle className="w-4 h-4 text-stone-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-stone-900">
              {(errorRate * 100).toFixed(1)}%
            </span>
            <span className={`text-xs font-semibold ${errorRate <= 0.05 ? "text-emerald-700" : "text-rose-700"}`}>
              {errorRate <= 0.05 ? "✓ مطابق" : "⚠ تجاوز"}
            </span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full ${errorRate <= 0.05 ? "bg-emerald-600" : "bg-rose-600"}`}
              style={{ width: `${Math.min(100, errorRate * 1000)}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-1.5">الحد الأقصى المسموح به: ≤ 5.0%</p>
        </div>

        {/* P95 Latency Metric */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>زمن الاستجابة (P95 Latency)</span>
            <Clock className="w-4 h-4 text-stone-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-stone-900">
              {p95Latency ? Math.round(p95Latency) : 0} <span className="text-xs font-normal text-stone-500">ms</span>
            </span>
            <span className={`text-xs font-semibold ${p95Latency <= 3000 ? "text-emerald-700" : "text-rose-700"}`}>
              {p95Latency <= 3000 ? "✓ سريع" : "⚠ مرتفع"}
            </span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full ${p95Latency <= 3000 ? "bg-emerald-600" : "bg-rose-600"}`}
              style={{ width: `${Math.min(100, (p95Latency / 5000) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-1.5">الهدف المستهدف: ≤ 3,000 ms</p>
        </div>

        {/* Provider Failure Rate */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>فشل المزود (Provider Failure)</span>
            <TrendingDown className="w-4 h-4 text-stone-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-stone-900">
              {(providerFailure * 100).toFixed(1)}%
            </span>
            <span className={`text-xs font-semibold ${providerFailure <= 0.10 ? "text-emerald-700" : "text-rose-700"}`}>
              {providerFailure <= 0.10 ? "✓ ممتاز" : "⚠ انقطاع"}
            </span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full ${providerFailure <= 0.10 ? "bg-emerald-600" : "bg-rose-600"}`}
              style={{ width: `${Math.min(100, providerFailure * 500)}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-1.5">الحد الأقصى المسموح به: ≤ 10.0%</p>
        </div>

        {/* Helpful Rate Metric */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>فائدة الإجابات (Helpful Rate)</span>
            <TrendingUp className="w-4 h-4 text-stone-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-stone-900">
              {(helpfulRate * 100).toFixed(1)}%
            </span>
            <span className={`text-xs font-semibold ${helpfulRate >= 0.80 ? "text-emerald-700" : "text-amber-700"}`}>
              {helpfulRate >= 0.80 ? "✓ دقيق" : "⚠ دون الهدف"}
            </span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full ${helpfulRate >= 0.80 ? "bg-emerald-600" : "bg-amber-600"}`}
              style={{ width: `${Math.min(100, helpfulRate * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-1.5">الهدف الأدنى للرضا: ≥ 80.0%</p>
        </div>
      </div>

      {/* Section 1: SLO Policies Table */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-stone-900">
              سياسات مستوى الخدمة (SLO Policies & Targets)
            </h2>
          </div>
          <button
            onClick={() => setShowSloTestModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-stone-200"
          >
            <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
            <span>محاكاة فحص SLO تجريبي</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <th className="py-3 px-4 font-semibold">المؤشر (Metric Key)</th>
                <th className="py-3 px-4 font-semibold">المعادلة المستهدفة</th>
                <th className="py-3 px-4 font-semibold">نافذة الحساب</th>
                <th className="py-3 px-4 font-semibold">القيمة اللحظية الحالية</th>
                <th className="py-3 px-4 font-semibold">حالة المطابقة</th>
                <th className="py-3 px-4 font-semibold">إجراءات الحوكمة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sloPolicies.map((p, idx) => {
                const curVal = curMetrics[p.metric_key];
                const hasValue = curVal !== undefined;
                const isLte = p.comparison === "lte";
                const passed = hasValue ? (isLte ? Number(curVal) <= Number(p.target) : Number(curVal) >= Number(p.target)) : true;

                return (
                  <tr key={idx} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                      {p.metric_key}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-700">
                      {p.comparison === "lte" ? "أقل من أو يساوي (≤)" : "أكبر من أو يساوي (≥)"}{" "}
                      <span className="font-mono font-bold text-stone-900">
                        {p.metric_key.includes("rate") ? `${(Number(p.target) * 100).toFixed(0)}%` : `${p.target} ms`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {p.window_minutes >= 60 ? `${p.window_minutes / 60} ساعة` : `${p.window_minutes} دقيقة`}
                    </td>
                    <td className="py-3.5 px-4">
                      {hasValue ? (
                        <span className="font-mono font-bold text-stone-900">
                          {p.metric_key.includes("rate")
                            ? `${(Number(curVal) * 100).toFixed(1)}%`
                            : `${Math.round(Number(curVal))} ms`}
                        </span>
                      ) : (
                        <span className="text-stone-400">قيد الاحتساب</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {passed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md text-[11px] font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>مطابق للـ SLO</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-800 rounded-md text-[11px] font-bold border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>مخالفة (Breached)</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-stone-500">
                        <Lock className="w-3 h-3 text-stone-400" />
                        <span>مراقبة بشرية فقط</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Alerts Management & Acknowledgment */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-stone-900">
              سجل التنبيهات التشغيلية (Operational Alerts)
            </h2>
            <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-full text-xs font-semibold">
              {filteredAlerts.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
              {(["all", "open", "acknowledged", "resolved"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setAlertStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    alertStatusFilter === st ? "bg-white text-stone-900 shadow-2xs font-bold" : "text-stone-600"
                  }`}
                >
                  {st === "all" ? "الكل" : st === "open" ? "مفتوح" : st === "acknowledged" ? "مُقرّ به" : "محلول"}
                </button>
              ))}
            </div>

            {/* Severity Filter */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
              {(["all", "critical", "warning", "info"] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setAlertSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    alertSeverityFilter === sev ? "bg-white text-stone-900 shadow-2xs font-bold" : "text-stone-600"
                  }`}
                >
                  {sev === "all" ? "جميع المستويات" : sev === "critical" ? "حرج" : sev === "warning" ? "تحذير" : "معلومات"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-stone-200 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-700">لا توجد تنبيهات نشطة مطابقة للفلتر في بيئة {selectedEnv}</p>
            <p className="text-xs text-stone-500 mt-0.5">النظام يعمل ضمن الحدود الطبيعية المقررة</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="border border-stone-200 rounded-xl p-4 hover:border-stone-300 transition-colors bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Severity Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                        alert.severity === "critical"
                          ? "bg-rose-100 text-rose-800 border-rose-200"
                          : alert.severity === "warning"
                          ? "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-blue-100 text-blue-800 border-blue-200"
                      }`}
                    >
                      {alert.severity === "critical" ? "حرج (Critical)" : alert.severity === "warning" ? "تحذير (Warning)" : "معلوماتي (Info)"}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                        alert.status === "open"
                          ? "bg-rose-50 text-rose-700"
                          : alert.status === "acknowledged"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {alert.status === "open" ? "مفتوح" : alert.status === "acknowledged" ? "تم الإقرار بشريًا" : "محلول"}
                    </span>

                    <span className="text-xs font-bold text-stone-900 font-mono">
                      #{alert.id} - {alert.metric_key}
                    </span>

                    {/* Correlation ID badge */}
                    {alert.correlation_id && (
                      <button
                        onClick={() => copyToClipboard(alert.correlation_id || "", `alert_${alert.id}`)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded text-[11px] font-mono transition-colors cursor-pointer"
                        title="نسخ معرف التتبع"
                      >
                        <span>{alert.correlation_id}</span>
                        {copiedId === `alert_${alert.id}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-stone-400" />
                        )}
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {alert.message || "لا توجد تفاصيل إضافية للرسالة"}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-stone-500">
                    <span>
                      القيمة المرصودة: <strong className="text-stone-800 font-mono">{alert.observed_value ?? "N/A"}</strong>
                    </span>
                    <span>
                      الحد المسموح (Threshold): <strong className="text-stone-800 font-mono">{alert.threshold ?? "N/A"}</strong>
                    </span>
                    <span>
                      الوقت: {new Date(alert.opened_at || "").toLocaleTimeString("ar-EG")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {alert.status === "open" && (
                    <button
                      onClick={() => {
                        setSelectedAlertToAck(alert);
                        setAckReason(`إقرار ومتابعة التنبيه #${alert.id} الخاص بـ ${alert.metric_key}`);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>إقرار بشري (Acknowledge)</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setNewIncAlertId(String(alert.id));
                      setNewIncTitle(`حادث تشغيلي مرتبط بالتنبيه #${alert.id} (${alert.metric_key})`);
                      setNewIncSummary(alert.message || "");
                      setShowCreateIncidentModal(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-stone-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ربط بحادث تشغيلي</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Incidents Tracking & Human Resolution */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-700" />
            <h2 className="text-base font-bold text-stone-900">
              إدارة الحوادث التشغيلية وتوثيق الأسباب الجذرية (Incident Management & RCA)
            </h2>
            <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-full text-xs font-semibold">
              {envIncidents.length}
            </span>
          </div>

          <button
            onClick={() => {
              setNewIncAlertId("");
              setNewIncTitle("");
              setNewIncSummary("");
              setShowCreateIncidentModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل حادث جديد (New Incident)</span>
          </button>
        </div>

        {envIncidents.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-stone-200 rounded-xl">
            <CheckSquare className="w-7 h-7 text-stone-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-stone-700">لا توجد حوادث مسجلة في بيئة {selectedEnv}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {envIncidents.map((inc) => (
              <div
                key={inc.id}
                className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 hover:bg-white transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                          inc.status === "open"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {inc.status === "open" ? "حادث مفتوح" : "تم الحل والتوثيق (Resolved)"}
                      </span>

                      <span className="px-2 py-0.5 bg-stone-200 text-stone-800 rounded text-[11px] font-bold uppercase">
                        {inc.severity}
                      </span>

                      <h3 className="text-xs font-bold text-stone-900">
                        #{inc.id} - {inc.title}
                      </h3>

                      {inc.alert_id && (
                        <span className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-mono">
                          مرتبط بالتنبيه #{inc.alert_id}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {inc.summary || "لا يوجد ملخص للحادث"}
                    </p>

                    {/* RCA & Remediation Box if resolved */}
                    {inc.status === "resolved" && (
                      <div className="mt-2.5 p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1 text-xs">
                        <div className="text-emerald-950 font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>السبب الجذري الموثق (Root Cause):</span>
                          <span className="font-normal text-emerald-900">{inc.root_cause || "غير محدد"}</span>
                        </div>
                        <div className="text-emerald-950 font-semibold flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                          <span>الإجراء التصحيحي البشري (Remediation):</span>
                          <span className="font-normal text-emerald-900">{inc.remediation || "غير محدد"}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {inc.status === "open" && (
                      <button
                        onClick={() => {
                          setSelectedIncToResolve(inc);
                          setIncRootCause("");
                          setIncRemediation("");
                          setIncResolveReason(`إغلاق الحادث #${inc.id} بعد الفحص والتحقق`);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>توثيق وحل الحادث (Resolve)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 4: Observability Audit Trail */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-stone-700" />
          <h2 className="text-base font-bold text-stone-900">
            سجل التدقيق والمراقبة الموثق (Observability Audit Trail)
          </h2>
        </div>

        {auditLogs.length === 0 ? (
          <p className="text-xs text-stone-500 py-4 text-center">لا توجد سجلات تدقيق حتى الآن</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                  <th className="py-2.5 px-3 font-semibold">الإجراء</th>
                  <th className="py-2.5 px-3 font-semibold">المسؤول (Actor ID)</th>
                  <th className="py-2.5 px-3 font-semibold">البيئة</th>
                  <th className="py-2.5 px-3 font-semibold">المبرر / التفاصيل</th>
                  <th className="py-2.5 px-3 font-semibold">وقت التنفيذ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-stone-800">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-3 text-stone-700">
                      مهندس #{log.actor_id || 99}
                    </td>
                    <td className="py-2.5 px-3 text-stone-600">
                      {log.environment || selectedEnv}
                    </td>
                    <td className="py-2.5 px-3 text-stone-700 max-w-md truncate">
                      {log.reason}
                    </td>
                    <td className="py-2.5 px-3 text-stone-500 font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleString("ar-EG")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Acknowledge Alert */}
      {selectedAlertToAck && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50" dir="rtl">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-sm">
                  إقرار بشري بالتنبيه التشغيلي #{selectedAlertToAck.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAlertToAck(null)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              <strong>تنبيه الحوكمة:</strong> الإقرار يوثق فقط علم المشرف بالخلل ولا يعطل أنظمة الرصد ولا ينفذ أي إجراء برمجي تلقائيًا.
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">المؤشر ورسالة التنبيه</label>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 font-medium">
                  {selectedAlertToAck.metric_key} — {selectedAlertToAck.message}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">سبب ومبرر الإقرار البشري</label>
                <textarea
                  value={ackReason}
                  onChange={(e) => setAckReason(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  placeholder="وثّق سبب الإقرار والخطوات المزمع اتخاذها..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">معرّف المسؤول (Actor ID)</label>
                <input
                  type="number"
                  value={ackActorId}
                  onChange={(e) => setAckActorId(Number(e.target.value))}
                  className="w-full text-xs p-2 bg-white border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setSelectedAlertToAck(null)}
                className="px-3.5 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-xs font-semibold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleAcknowledgeAlert}
                disabled={ackSubmitting}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                {ackSubmitting ? "جاري الحفظ..." : "تأكيد الإقرار البشري"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Incident */}
      {showCreateIncidentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50" dir="rtl">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-700" />
                <h3 className="font-bold text-stone-900 text-sm">
                  تسجيل حادث تشغيلي جديد في بيئة {selectedEnv}
                </h3>
              </div>
              <button
                onClick={() => setShowCreateIncidentModal(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">عنوان الحادث</label>
                <input
                  type="text"
                  value={newIncTitle}
                  onChange={(e) => setNewIncTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  placeholder="مثال: ارتفاع غير متوقع في زمن استجابة الاستدلال"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">مستوى الخطورة</label>
                  <select
                    value={newIncSeverity}
                    onChange={(e) => setNewIncSeverity(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-stone-300 rounded-xl"
                  >
                    <option value="low">منخفض (Low)</option>
                    <option value="medium">متوسط (Medium)</option>
                    <option value="high">عالي (High)</option>
                    <option value="critical">حرج (Critical)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">رقم التنبيه المرتبط (اختياري)</label>
                  <input
                    type="number"
                    value={newIncAlertId}
                    onChange={(e) => setNewIncAlertId(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-stone-300 rounded-xl"
                    placeholder="Alert ID"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">ملخص وتفاصيل الحادث</label>
                <textarea
                  value={newIncSummary}
                  onChange={(e) => setNewIncSummary(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  placeholder="اشرح المشاهدات الأولية للحادث..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setShowCreateIncidentModal(false)}
                className="px-3.5 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-xs font-semibold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateIncident}
                disabled={creatingIncident || !newIncTitle.trim()}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                {creatingIncident ? "جاري التسجيل..." : "إنشاء الحادث"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Resolve Incident & Document RCA */}
      {selectedIncToResolve && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50" dir="rtl">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-stone-900 text-sm">
                  حل وتوثيق الحادث التشغيلي #{selectedIncToResolve.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIncToResolve(null)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
              <strong>شرط التوثيق الإلزامي:</strong> يجب إدخال السبب الجذري الفعلي والإجراء التصحيحي المتخذ لضمان اكتمال السجل التدقيقي للحادث.
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">السبب الجذري (Root Cause Analysis - RCA)</label>
                <textarea
                  value={incRootCause}
                  onChange={(e) => setIncRootCause(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="وثق السبب الفني للخلل (مثل: ضغط مؤقت على خوادم الاستدلال)..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">الإجراء التصحيحي المتخذ (Remediation Actions)</label>
                <textarea
                  value={incRemediation}
                  onChange={(e) => setIncRemediation(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="وثق الخطوات التصحيحية المنفذة يدويًا..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">ملاحظة الإغلاق</label>
                <input
                  type="text"
                  value={incResolveReason}
                  onChange={(e) => setIncResolveReason(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-stone-300 rounded-xl"
                  placeholder="ملاحظات الاعتماد..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setSelectedIncToResolve(null)}
                className="px-3.5 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-xs font-semibold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleResolveIncident}
                disabled={resolvingIncident || !incRootCause.trim() || !incRemediation.trim()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                {resolvingIncident ? "جاري الاعتماد..." : "اعتماد حل الحادث وتوثيقه"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Test SLO Evaluation */}
      {showSloTestModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50" dir="rtl">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-stone-900 text-sm">
                  محاكاة واختبار مطابقة سياسة SLO
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowSloTestModal(false);
                  setSloTestResult(null);
                }}
                className="text-stone-400 hover:text-stone-700 cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">المؤشر المراد اختباره</label>
                <select
                  value={testMetricKey}
                  onChange={(e) => setTestMetricKey(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-stone-300 rounded-xl"
                >
                  <option value="error_rate">معدل الأخطاء (error_rate)</option>
                  <option value="p95_latency_ms">زمن الاستجابة (p95_latency_ms)</option>
                  <option value="provider_failure_rate">فشل المزود (provider_failure_rate)</option>
                  <option value="answer_helpful_rate">معدل الفائدة (answer_helpful_rate)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">القيمة المرصودة</label>
                  <input
                    type="number"
                    step="0.01"
                    value={testMetricValue}
                    onChange={(e) => setTestMetricValue(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-white border border-stone-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">الهدف المقارن (Target)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={testTarget}
                    onChange={(e) => setTestTarget(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-white border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">نوع المقارنة</label>
                <select
                  value={testComparison}
                  onChange={(e) => setTestComparison(e.target.value as "lte" | "gte")}
                  className="w-full text-xs p-2 bg-white border border-stone-300 rounded-xl"
                >
                  <option value="lte">أقل من أو يساوي Target (≤)</option>
                  <option value="gte">أكبر من أو يساوي Target (≥)</option>
                </select>
              </div>

              <button
                onClick={handleEvaluateSloTest}
                className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                تنفيذ الفحص الحسابي
              </button>

              {sloTestResult && (
                <div className={`p-3 rounded-xl text-xs border ${
                  sloTestResult.ok ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-rose-50 border-rose-200 text-rose-900"
                }`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {sloTestResult.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                    <span>النتيجة: {sloTestResult.ok ? "مطابق لمستوى الخدمة (SLO Passed)" : "مخالفة للهدف (Breached)"}</span>
                  </div>
                  <p className="text-[11px] font-mono text-stone-600">
                    Correlation ID: {sloTestResult.correlationId}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    {sloTestResult.governanceNotice}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default DarbAIObservabilitySloManagerView;
