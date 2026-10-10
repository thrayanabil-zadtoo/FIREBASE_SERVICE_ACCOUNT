import React, { useState, useEffect } from "react";
import {
  Activity,
  ShieldCheck,
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Server,
  Zap,
  Lock,
  Search,
  Database,
  SlidersHorizontal,
  Flame,
  Clock,
  Fingerprint,
  Info
} from "lucide-react";
import {
  AIHealth,
  AIReadiness,
  ProviderHealthItem,
  ResilienceEvent,
  CircuitState
} from "../types/darb-ai-v1-20";

export default function DarbAIResilienceView() {
  const [health, setHealth] = useState<AIHealth | null>(null);
  const [readiness, setReadiness] = useState<AIReadiness | null>(null);
  const [providers, setProviders] = useState<ProviderHealthItem[]>([]);
  const [events, setEvents] = useState<ResilienceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [componentFilter, setComponentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Retry Simulator state
  const [simAttempt, setSimAttempt] = useState<number>(0);
  const [simStatus, setSimStatus] = useState<number>(503);
  const [simPlan, setSimPlan] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [healthRes, readyRes, provRes, evRes] = await Promise.all([
        fetch("/api/ai/health").catch(() => null),
        fetch("/api/ai/readiness").catch(() => null),
        fetch("/api/admin/ai/resilience-providers").catch(() => null),
        fetch("/api/admin/ai/resilience-events").catch(() => null),
      ]);

      if (healthRes && healthRes.ok) {
        setHealth(await healthRes.json());
      }
      if (readyRes && readyRes.ok) {
        setReadiness(await readyRes.json());
      }
      if (provRes && provRes.ok) {
        const pData = await provRes.json();
        setProviders(pData.providers || []);
      }
      if (evRes && evRes.ok) {
        const eData = await evRes.json();
        setEvents(eData.events || []);
      }
    } catch (err) {
      console.error("[DarbAI Resilience] Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleResetCircuit = async (providerKey?: string) => {
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/ai/resilience/reset-circuit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerKey }),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg({ type: "success", text: data.message || "تمت إعادة تهيئة قاطع الدائرة بنجاح." });
        await fetchData();
      } else {
        setMsg({ type: "error", text: data.error || "تعذرت إعادة تهيئة قاطع الدائرة." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "خطأ أثناء الاتصال بالخادم" });
    } finally {
      setActionLoading(false);
      setTimeout(() => setMsg(null), 5000);
    }
  };

  const handleSimulateFailure = async (providerKey: string) => {
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/ai/resilience/simulate-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "circuit_failure", providerKey }),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg({
          type: "success",
          text: `تمت محاكاة تعثر في ${providerKey}. الحالة الآن: ${data.state} (فشل: ${data.failureCount})`,
        });
        await fetchData();
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "خطأ أثناء محاكاة التعثر" });
    } finally {
      setActionLoading(false);
      setTimeout(() => setMsg(null), 5000);
    }
  };

  const handleTestRetryPlan = async () => {
    try {
      setActionLoading(true);
      const res = await fetch("/api/ai/resilience/retry-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attempt: simAttempt, status: simStatus }),
      });
      const data = await res.json();
      setSimPlan(data);
      await fetchData();
    } catch (err: any) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredEvents = events.filter((ev) => {
    if (componentFilter !== "all" && ev.component !== componentFilter) return false;
    if (statusFilter !== "all" && ev.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCorr = (ev.correlation_id || "").toLowerCase().includes(q);
      const matchComp = (ev.component || "").toLowerCase().includes(q);
      const matchType = (ev.event_type || "").toLowerCase().includes(q);
      if (!matchCorr && !matchComp && !matchType) return false;
    }
    return true;
  });

  const getCircuitBadge = (state: CircuitState) => {
    switch (state) {
      case "closed":
        return {
          label: "مغلق (سليم وطبيعي)",
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle2,
        };
      case "open":
        return {
          label: "مفتوح (معلّق لحماية المزود)",
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          icon: Flame,
        };
      case "half_open":
        return {
          label: "شبه مفتوح (فحص استباقي)",
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: AlertTriangle,
        };
      default:
        return {
          label: state,
          bg: "bg-stone-50 text-stone-700 border-stone-200",
          icon: Info,
        };
    }
  };

  return (
    <div className="space-y-6 text-stone-900" dir="rtl">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-l from-indigo-900 via-stone-900 to-indigo-950 p-5 rounded-2xl text-white shadow-sm border border-indigo-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold">DARB AI — موثوقية التشغيل والحماية من الأعطال (V1.20)</h3>
              <span className="text-[11px] font-mono bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 px-2 py-0.5 rounded-md font-bold">
                Production Resilience & Privacy Guard
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
              منظومة متقدمة لمنع انهيار الخدمة: قواطع الدائرة (Circuit Breaker) لمزودي الذكاء الاصطناعي والويب، ومحاولات الإعادة الآمنة المحسوبة (Exponential Backoff)، مع حجب البيانات الحساسة وأسرار الاعتماد (Privacy Redaction)، والالتزام الصارم بالمراجعة البشرية دون أي نشر تلقائي.
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer border border-white/10 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>تحديث البيانات</span>
          </button>
        </div>

        {/* Core Constraints Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2 bg-black/25 px-3 py-1.5 rounded-lg border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-stone-300">المراجعة البشرية:</span>
            <span className="font-bold text-emerald-300">مُفعلة دائماً (HITL)</span>
          </div>
          <div className="flex items-center gap-2 bg-black/25 px-3 py-1.5 rounded-lg border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-stone-300">النشر التلقائي:</span>
            <span className="font-bold text-emerald-300">معطّل (Auto Publish = False)</span>
          </div>
          <div className="flex items-center gap-2 bg-black/25 px-3 py-1.5 rounded-lg border border-white/5">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span className="text-stone-300">حجب السجلات:</span>
            <span className="font-bold text-indigo-300">حماية تامة للخصوصية</span>
          </div>
          <div className="flex items-center gap-2 bg-black/25 px-3 py-1.5 rounded-lg border border-white/5">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span className="text-stone-300">بصمة التتبع:</span>
            <span className="font-bold text-purple-300">Correlation ID لكل عملية</span>
          </div>
        </div>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
            msg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {msg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Grid: Health & Readiness Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Service Health Card */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">صحة الخدمة العامة (Health)</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${health?.ok ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
            ></span>
            <span className="text-base font-bold text-stone-900">
              {health?.ok ? "سليمة ونشطة (Healthy)" : "غير متاحة"}
            </span>
          </div>
          <div className="text-[11px] text-stone-500 flex justify-between pt-1 border-t border-stone-100">
            <span>الإصدار: {health?.version || "V1.20"}</span>
            <span className="font-mono text-[10px] text-stone-400 truncate max-w-[120px]">
              {health?.correlationId?.slice(0, 8)}...
            </span>
          </div>
        </div>

        {/* Readiness Card */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">جاهزية التشغيل (Readiness)</span>
            <Server className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${readiness?.ready ? "bg-emerald-500" : "bg-amber-500"}`}
            ></span>
            <span className="text-base font-bold text-stone-900">
              {readiness?.ready ? "جاهزة للخدمة (Ready)" : "استعداد مؤقت"}
            </span>
          </div>
          <div className="text-[11px] text-stone-500 flex justify-between pt-1 border-t border-stone-100">
            <span>قاعدة البيانات:</span>
            <span className="font-bold text-stone-700 uppercase">{readiness?.database || "memory"}</span>
          </div>
        </div>

        {/* Bounded Retry Guard Card */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">حارس الإعادة (Retry Guard)</span>
            <RotateCw className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-base font-bold text-stone-900">
            حد أقصى: 2 محاولات
          </div>
          <div className="text-[11px] text-stone-500 flex justify-between pt-1 border-t border-stone-100">
            <span>التراجع الأسي:</span>
            <span className="text-amber-700 font-semibold">400ms ← 5000ms</span>
          </div>
        </div>

        {/* Privacy Redaction Guard */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">حارس الخصوصية (Redaction)</span>
            <Lock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-base font-bold text-stone-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>حجب أسرار الاعتماد</span>
          </div>
          <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-100">
            منع تسريب Authorization وTokens
          </div>
        </div>
      </div>

      {/* Provider Circuit Breakers Section */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>قواطع الدائرة للمزودين الخارجيين (Provider Circuit Breakers)</span>
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              مراقبة صحة المزودين الخارجيين وفصل الاتصال مؤقتاً عند تكرار الأعطال لتفادي استهلاك الموارد وتراكم الأخطاء.
            </p>
          </div>
          <button
            onClick={() => handleResetCircuit()}
            disabled={actionLoading}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-center"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>إعادة تهيئة كافة القواطع</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.map((prov) => {
            const badge = getCircuitBadge(prov.state);
            const BadgeIcon = badge.icon;
            const isWeb = prov.providerKey.includes("web");

            return (
              <div
                key={prov.providerKey}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-stone-200 text-stone-700">
                      {isWeb ? <Search className="w-4 h-4" /> : <Server className="w-4 h-4" />}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-stone-900">
                        {isWeb ? "مزود البحث في الويب (Web Search Provider)" : "مزود نموذج الذكاء الاصطناعي (Gemini)"}
                      </span>
                      <div className="text-[10px] font-mono text-stone-400">{prov.providerKey}</div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                  >
                    <BadgeIcon className="w-3.5 h-3.5" />
                    <span>{badge.label}</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-stone-200/70 text-xs">
                  <div>
                    <span className="text-stone-400 text-[10px] block">طلبات ناجحة</span>
                    <span className="font-bold text-emerald-700">{prov.successCount}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">عثرات مسجلة</span>
                    <span className={`font-bold ${prov.failureCount > 0 ? "text-rose-600" : "text-stone-700"}`}>
                      {prov.failureCount} / 5
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">فترة التهدئة</span>
                    <span className="font-mono text-[11px] text-stone-600">
                      {prov.cooldownRemainingMs > 0 ? `${Math.ceil(prov.cooldownRemainingMs / 1000)}s` : "لا يوجد"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-stone-500">
                    حالة استقبال الطلبات:{" "}
                    <strong className={prov.isCallAllowed ? "text-emerald-700" : "text-rose-700"}>
                      {prov.isCallAllowed ? "مسموح" : "موقوف مؤقتاً"}
                    </strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSimulateFailure(prov.providerKey)}
                      disabled={actionLoading}
                      className="px-2 py-1 rounded bg-stone-200 hover:bg-stone-300 text-stone-700 text-[10px] font-bold cursor-pointer"
                      title="محاكاة عطل لاختبار قاطع الدائرة"
                    >
                      محاكاة عطل
                    </button>
                    <button
                      onClick={() => handleResetCircuit(prov.providerKey)}
                      disabled={actionLoading}
                      className="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold cursor-pointer border border-indigo-200"
                    >
                      تصفير
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Retry Guard Simulator Panel */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>مختبر حاسبة إعادة المحاولة الآمنة (Bounded Retry & Exponential Backoff)</span>
          </h4>
          <p className="text-xs text-stone-500 mt-0.5">
            التحقق من صحة خطة الإعادة لتجنب الضغط الزائد على الخوادم (لا تتجاوز 2 محاولات بحد أقصى 5000ms).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">رقم المحاولة (Attempt)</label>
            <select
              value={simAttempt}
              onChange={(e) => setSimAttempt(Number(e.target.value))}
              className="w-full text-xs p-2.5 rounded-lg border border-stone-200 bg-white"
            >
              <option value={0}>المحاولة الأولى (Attempt 0)</option>
              <option value={1}>المحاولة الثانية (Attempt 1)</option>
              <option value={2}>المحاولة الثالثة (Attempt 2 - تتجاوز الحد)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">رمز الخطأ من المزود (HTTP Status)</label>
            <select
              value={simStatus}
              onChange={(e) => setSimStatus(Number(e.target.value))}
              className="w-full text-xs p-2.5 rounded-lg border border-stone-200 bg-white"
            >
              <option value={503}>503 Service Unavailable (قابل للإعادة)</option>
              <option value={429}>429 Rate Limit (قابل للإعادة)</option>
              <option value={408}>408 Request Timeout (قابل للإعادة)</option>
              <option value={400}>400 Bad Request (غير قابل للإعادة)</option>
              <option value={403}>403 Forbidden (غير قابل للإعادة)</option>
            </select>
          </div>

          <button
            onClick={handleTestRetryPlan}
            disabled={actionLoading}
            className="w-full p-2.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            <span>حساب خطة الإعادة وتسجيلها</span>
          </button>
        </div>

        {simPlan && (
          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950">نتيجة الخطة المحسوبة:</span>
              <span className="font-mono text-[11px] text-stone-500">ID: {simPlan.correlationId}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="bg-white p-2 rounded-md border border-indigo-100">
                <span className="text-stone-400 text-[10px] block">هل تجوز الإعادة؟</span>
                <span className={`font-bold ${simPlan.retry ? "text-emerald-700" : "text-rose-700"}`}>
                  {simPlan.retry ? "نعم (Retry Allowed)" : "لا (Halt & Fail-Safe)"}
                </span>
              </div>
              <div className="bg-white p-2 rounded-md border border-indigo-100">
                <span className="text-stone-400 text-[10px] block">مدة الانتظار المحسوبة</span>
                <span className="font-bold text-stone-800">{simPlan.waitMs} ms</span>
              </div>
              <div className="bg-white p-2 rounded-md border border-indigo-100">
                <span className="text-stone-400 text-[10px] block">المحاولة الحالية</span>
                <span className="font-bold text-stone-800">{simPlan.attempt}</span>
              </div>
              <div className="bg-white p-2 rounded-md border border-indigo-100">
                <span className="text-stone-400 text-[10px] block">الحد الأقصى</span>
                <span className="font-bold text-stone-800">{simPlan.maxRetries}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Incidents & Resilience Events Log */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-indigo-600" />
              <span>سجل أحداث الموثوقية والحوادث (Resilience & Incident Log)</span>
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              كل سجل مرتبط بـ Correlation ID فريد، مع حجب كامل للبيانات الحساسة وأسرار الاعتماد (Redacted).
            </p>
          </div>

          <span className="text-xs text-stone-400 font-mono self-start md:self-center">
            إجمالي السجلات: {filteredEvents.length}
          </span>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالـ Correlation ID أو المكون..."
              className="w-full text-xs pr-9 pl-3 py-2 rounded-lg border border-stone-200 bg-white"
            />
          </div>

          <div>
            <select
              value={componentFilter}
              onChange={(e) => setComponentFilter(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-stone-200 bg-white"
            >
              <option value="all">كافة المكونات</option>
              <option value="retry_guard">حارس الإعادة (retry_guard)</option>
              <option value="circuit_breaker">قاطع الدائرة (circuit_breaker)</option>
              <option value="web_search_provider">مزود الويب (web_search_provider)</option>
              <option value="gemini_model_provider">مزود النموذج (gemini_model_provider)</option>
              <option value="health_monitor">مراقب الصحة (health_monitor)</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-stone-200 bg-white"
            >
              <option value="all">كافة الحالات</option>
              <option value="info">معلومات (info)</option>
              <option value="warning">تنبيه (warning)</option>
              <option value="critical">حرج (critical)</option>
            </select>
          </div>
        </div>

        {/* Events Table / List */}
        <div className="border border-stone-200 rounded-xl overflow-hidden">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400 space-y-1">
              <CheckCircle2 className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p>لا توجد أحداث مطابقة للشروط المحددة.</p>
              <p className="text-[11px] text-stone-400">النظام يعمل في وضع الاستقرار والمرونة الإنتاجية.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100 max-h-[460px] overflow-y-auto">
              {filteredEvents.map((ev, idx) => {
                const isCrit = ev.status === "critical";
                const isWarn = ev.status === "warning";

                return (
                  <div
                    key={ev.id || idx}
                    className={`p-3.5 text-xs hover:bg-stone-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      isCrit ? "bg-rose-50/30" : isWarn ? "bg-amber-50/20" : ""
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isCrit
                              ? "bg-rose-100 text-rose-800"
                              : isWarn
                              ? "bg-amber-100 text-amber-800"
                              : "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {ev.status}
                        </span>

                        <span className="font-mono text-xs font-semibold text-stone-900">{ev.event_type}</span>

                        <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px]">
                          {ev.component}
                        </span>

                        {ev.duration_ms !== null && ev.duration_ms !== undefined && (
                          <span className="text-[11px] text-stone-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {ev.duration_ms}ms
                          </span>
                        )}
                      </div>

                      {/* Correlation ID & Details */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
                        {ev.correlation_id && (
                          <span className="font-mono text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                            corr: {ev.correlation_id}
                          </span>
                        )}
                        {ev.details_json && Object.keys(ev.details_json).length > 0 && (
                          <span className="font-mono text-[10px] text-stone-500 truncate max-w-md">
                            {JSON.stringify(ev.details_json)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-400 shrink-0 font-mono text-left md:text-right">
                      {ev.created_at ? new Date(ev.created_at).toLocaleTimeString("ar-SA") : "الآن"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
