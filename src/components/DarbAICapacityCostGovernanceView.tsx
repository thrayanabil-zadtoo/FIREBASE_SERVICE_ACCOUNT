import React, { useState, useEffect } from "react";
import {
  Coins,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ShieldAlert,
  Lock,
  Plus,
  RefreshCw,
  FileText,
  Sliders,
  Cpu,
  Layers,
  Search,
  Zap,
  BarChart3,
  Clock,
  ArrowUpRight,
  Check,
  X,
  UserCheck,
  Info,
  Calculator,
  Server
} from "lucide-react";
import {
  CapacityCostSummary,
  BudgetPolicy,
  CapacityPolicy,
  CapacityCostAlert,
  CapacityCostForecast,
  CapacityCostAuditItem,
  CapacityCostMetricItem,
  BudgetStatus,
  CapacityCostSeverity
} from "../types/darb-ai-capacity-cost";

export function DarbAICapacityCostGovernanceView() {
  const [activeSubTab, setActiveSubTab] = useState<
    "overview" | "usage_tokens" | "cost_budget" | "capacity_slo" | "alerts" | "forecast" | "audit"
  >("overview");
  const [selectedEnv, setSelectedEnv] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Data states
  const [summary, setSummary] = useState<CapacityCostSummary | null>(null);
  const [metrics, setMetrics] = useState<CapacityCostMetricItem[]>([]);
  const [budgets, setBudgets] = useState<BudgetPolicy[]>([]);
  const [capacities, setCapacities] = useState<CapacityPolicy[]>([]);
  const [alerts, setAlerts] = useState<CapacityCostAlert[]>([]);
  const [forecasts, setForecasts] = useState<CapacityCostForecast[]>([]);
  const [audits, setAudits] = useState<CapacityCostAuditItem[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals & Sub-forms
  // 1. New Budget Policy
  const [showBudgetModal, setShowBudgetModal] = useState<boolean>(false);
  const [newBudgetName, setNewBudgetName] = useState<string>("");
  const [newBudgetEnv, setNewBudgetEnv] = useState<string>("production");
  const [newBudgetPeriod, setNewBudgetPeriod] = useState<"daily" | "monthly">("monthly");
  const [newBudgetAmount, setNewBudgetAmount] = useState<number>(200);
  const [newBudgetWarning, setNewBudgetWarning] = useState<number>(80);
  const [newBudgetCritical, setNewBudgetCritical] = useState<number>(100);
  const [budgetActor, setBudgetActor] = useState<string>("مدير العمليات المالية FinOps");
  const [budgetReason, setBudgetReason] = useState<string>("");

  // 2. New Capacity Policy
  const [showCapacityModal, setShowCapacityModal] = useState<boolean>(false);
  const [newCapName, setNewCapName] = useState<string>("");
  const [newCapEnv, setNewCapEnv] = useState<string>("production");
  const [newCapMetric, setNewCapMetric] = useState<string>("tokens_per_minute");
  const [newCapOperator, setNewCapOperator] = useState<"lte" | "gte">("lte");
  const [newCapThreshold, setNewCapThreshold] = useState<number>(150000);
  const [newCapWindow, setNewCapWindow] = useState<number>(1);
  const [capActor, setCapActor] = useState<string>("مهندس الموثوقية SRE");
  const [capApprovedBy, setCapApprovedBy] = useState<string>("مدير البنية التحتية");
  const [capReason, setCapReason] = useState<string>("");

  // 3. Acknowledge Alert Modal
  const [selectedAlertForAck, setSelectedAlertForAck] = useState<CapacityCostAlert | null>(null);
  const [ackActor, setAckActor] = useState<string>("مهندس العمليات المناوب");
  const [ackReason, setAckReason] = useState<string>("");

  // 4. Quick Cost Estimator Simulator
  const [calcInputTokens, setCalcInputTokens] = useState<number>(500000);
  const [calcOutputTokens, setCalcOutputTokens] = useState<number>(150000);
  const [calcInputRate, setCalcInputRate] = useState<number>(0.00015);
  const [calcOutputRate, setCalcOutputRate] = useState<number>(0.0006);
  const [simulatedCost, setSimulatedCost] = useState<number | null>(null);

  // 5. Forecast Generator Simulator
  const [forecastValuesInput, setForecastValuesInput] = useState<string>("120, 135, 148, 162");
  const [forecastPeriods, setForecastPeriods] = useState<number>(3);
  const [generatedForecast, setGeneratedForecast] = useState<any | null>(null);

  // Initial fetch
  useEffect(() => {
    fetchAllData();
  }, [selectedEnv]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const envQuery = selectedEnv !== "all" ? `?environment=${selectedEnv}` : "";

      const [sumRes, metRes, budRes, capRes, alrRes, fctRes, audRes] = await Promise.all([
        fetch(`/api/admin/ai/capacity-cost/summary${envQuery}`).then((r) => r.json()),
        fetch(`/api/admin/ai/capacity-cost/metrics${envQuery}`).then((r) => r.json()),
        fetch(`/api/admin/ai/capacity-cost/budgets${envQuery}`).then((r) => r.json()),
        fetch(`/api/admin/ai/capacity-cost/capacity${envQuery}`).then((r) => r.json()),
        fetch(`/api/admin/ai/capacity-cost/alerts${envQuery}`).then((r) => r.json()),
        fetch(`/api/admin/ai/capacity-cost/forecasts${envQuery}`).then((r) => r.json()),
        fetch(`/api/admin/ai/capacity-cost/audit`).then((r) => r.json()),
      ]);

      if (sumRes?.ok && sumRes?.summary) {
        setSummary(sumRes.summary);
      }
      if (metRes?.ok) setMetrics(metRes.items || []);
      if (budRes?.ok) setBudgets(budRes.items || []);
      if (capRes?.ok) setCapacities(capRes.items || []);
      if (alrRes?.ok) setAlerts(alrRes.items || []);
      if (fctRes?.ok) setForecasts(fctRes.items || []);
      if (audRes?.ok) setAudits(audRes.items || []);
    } catch (err: any) {
      console.error("Failed fetching capacity/cost data:", err);
      setFeedback({ type: "error", message: "تعذر تحميل بيانات إدارة السعة والتكاليف" });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateBudgetPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudgetName.trim() || !newBudgetAmount) {
      setFeedback({ type: "error", message: "يرجى كتابة اسم السياسة وقيمة الميزانية" });
      return;
    }
    if (!budgetActor.trim() || !budgetReason.trim()) {
      setFeedback({
        type: "error",
        message: "وفق معايير الحوكمة V1.29، يجب توثيق المسؤول والمبرر التشغيلي لاعتماد السياسة",
      });
      return;
    }

    try {
      const res = await fetch("/api/admin/ai/capacity-cost/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newBudgetName.trim(),
          environment: newBudgetEnv,
          period: newBudgetPeriod,
          budgetAmount: Number(newBudgetAmount),
          warningPercent: Number(newBudgetWarning),
          criticalPercent: Number(newBudgetCritical),
          actor: budgetActor.trim(),
          reason: budgetReason.trim(),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback({ type: "success", message: `تم إنشاء سياسة الميزانية بنجاح (${data.correlationId})` });
        setShowBudgetModal(false);
        setNewBudgetName("");
        setBudgetReason("");
        fetchAllData();
      } else {
        setFeedback({ type: "error", message: data.error || "فشل إنشاء سياسة الميزانية" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "خطأ في الشبكة أثناء الحفظ" });
    }
  };

  const handleCreateCapacityPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCapName.trim() || !newCapThreshold) {
      setFeedback({ type: "error", message: "يرجى تعبئة اسم السياسة والقيمة الحدية للسعة" });
      return;
    }
    if (!capActor.trim() || !capApprovedBy.trim() || !capReason.trim()) {
      setFeedback({
        type: "error",
        message: "تعديل سياسات القدرة الاستيعابية يتطلب توثيق المسؤول، المعتمد، والمبرر",
      });
      return;
    }

    try {
      const res = await fetch("/api/admin/ai/capacity-cost/capacity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCapName.trim(),
          environment: newCapEnv,
          metric: newCapMetric,
          operator: newCapOperator,
          threshold: Number(newCapThreshold),
          windowMinutes: Number(newCapWindow),
          actor: capActor.trim(),
          approvedBy: capApprovedBy.trim(),
          reason: capReason.trim(),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback({ type: "success", message: `تم اعتماد سياسة القدرة الاستيعابية (${data.correlationId})` });
        setShowCapacityModal(false);
        setNewCapName("");
        setCapReason("");
        fetchAllData();
      } else {
        setFeedback({ type: "error", message: data.error || "فشل إنشاء سياسة القدرة الاستيعابية" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "خطأ في الشبكة أثناء الحفظ" });
    }
  };

  const handleAcknowledgeAlert = async () => {
    if (!selectedAlertForAck) return;
    if (!ackActor.trim()) {
      setFeedback({ type: "error", message: "اسم المسؤول إلزامي لإشعار الاستلام" });
      return;
    }

    try {
      const res = await fetch(`/api/admin/ai/capacity-cost/alerts/${selectedAlertForAck.id}/acknowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actor: ackActor.trim(),
          reason: ackReason.trim() || "تمت المراجعة والتأكيد المكتبي للتنبيه التشغيلي",
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback({ type: "success", message: `تم إشعار استلام التنبيه وتوثيقه في التدقيق (${data.correlationId || "ACK"})` });
        setSelectedAlertForAck(null);
        setAckReason("");
        fetchAllData();
      } else {
        setFeedback({ type: "error", message: data.error || "فشل اعتماد استلام التنبيه" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "خطأ في الاتصال بالخادم" });
    }
  };

  const handleSimulateCost = async () => {
    try {
      const res = await fetch("/api/admin/ai/capacity-cost/cost-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputTokens: calcInputTokens,
          outputTokens: calcOutputTokens,
          inputPricePer1k: calcInputRate,
          outputPricePer1k: calcOutputRate,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSimulatedCost(data.estimatedCost);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateForecast = async () => {
    try {
      const values = forecastValuesInput
        .split(/[, ]+/)
        .map((v) => parseFloat(v.trim()))
        .filter((n) => !isNaN(n));

      const res = await fetch("/api/admin/ai/capacity-cost/forecasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          values,
          periods: forecastPeriods,
          environment: selectedEnv !== "all" ? selectedEnv : "production",
          period: "monthly",
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setGeneratedForecast(data.forecast);
        setFeedback({ type: "success", message: "تم احتساب التوقعات بنجاح (استشارية فقط)" });
        fetchAllData();
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: "فشل احتساب التوقعات" });
    }
  };

  // Helper formatting
  const formatTokens = (val?: number) => {
    if (val === undefined || val === null) return "0";
    if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val.toLocaleString();
  };

  const getBudgetStatusBadge = (status?: BudgetStatus) => {
    switch (status) {
      case "critical":
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">حرج (Critical)</span>;
      case "warning":
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">تحذيري (Warning)</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">آمن (Healthy)</span>;
    }
  };

  const getSeverityBadge = (sev: CapacityCostSeverity) => {
    switch (sev) {
      case "critical":
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800">حرج</span>;
      case "warning":
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800">تحذير</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800">معلومة</span>;
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Governance Banner V1.29 */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <Coins className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                إدارة السعة الاستيعابية وحوكمة التكاليف V1.29 (AI Capacity & Cost Governance)
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              مراقبة وتتبع استهلاك الرموز، النفقات التقديرية، وسياسات الميزانية والسعة التشغيلية مع استبعاد الإجراءات التلقائية غير المنضبطة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedEnv}
              onChange={(e) => setSelectedEnv(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-xl px-3 py-2 cursor-pointer focus:outline-hidden"
              id="select-capacity-cost-env"
            >
              <option value="all">كل البيئات (All Environments)</option>
              <option value="production">الإنتاج (Production)</option>
              <option value="staging">التجهيز (Staging)</option>
              <option value="development">التطوير (Development)</option>
            </select>

            <button
              onClick={() => {
                setRefreshing(true);
                fetchAllData();
              }}
              disabled={refreshing}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 p-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Strict Governance Enforcement Tags */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2.5 text-[11px]">
          <span className="text-slate-400 font-medium">محددات الحوكمة (Strict Governance):</span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3" /> AUTO REMEDIATION: OFF
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3" /> AUTO ROLLBACK: OFF
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3" /> AUTO DEPLOY: OFF
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3" /> AUTO SCALING: OFF
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1">
            <UserCheck className="w-3 h-3" /> HUMAN APPROVAL: REQUIRED
          </span>
        </div>
      </div>

      {/* Feedback message banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPIs Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Requests */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-[11px] text-stone-500 flex items-center justify-between">
            <span>الطلبات الكلية</span>
            <Activity className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <div className="mt-1 text-lg font-bold text-stone-900">
            {summary?.requests?.toLocaleString() ?? 0}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">
            {summary?.successfulRequests ?? summary?.requests ?? 0} ناجحة
          </div>
        </div>

        {/* Input Tokens */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-[11px] text-stone-500 flex items-center justify-between">
            <span>رموز الإدخال</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="mt-1 text-lg font-bold text-stone-900">
            {formatTokens(summary?.inputTokens)}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Prompt Tokens</div>
        </div>

        {/* Output Tokens */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-[11px] text-stone-500 flex items-center justify-between">
            <span>رموز الإخراج</span>
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="mt-1 text-lg font-bold text-stone-900">
            {formatTokens(summary?.outputTokens)}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Completion Tokens</div>
        </div>

        {/* Estimated Cost */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-[11px] text-stone-500 flex items-center justify-between">
            <span>التكلفة المقدرة</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-1 text-lg font-bold text-emerald-700">
            ${summary?.estimatedCost?.toFixed(3) ?? "0.000"}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">مزود النماذج</div>
        </div>

        {/* Budget Used % */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-[11px] text-stone-500 flex items-center justify-between">
            <span>الميزانية المستهلكة</span>
            {getBudgetStatusBadge(summary?.budgetStatus)}
          </div>
          <div className="mt-1 text-lg font-bold text-stone-900">
            {summary?.budgetUsedPercent ?? 0}%
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">
            من أصل ${summary?.budgetAmount ?? 150}
          </div>
        </div>

        {/* Capacity Utilization */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-[11px] text-stone-500 flex items-center justify-between">
            <span>استغلال السعة</span>
            <Cpu className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="mt-1 text-lg font-bold text-stone-900">
            {summary?.capacityUtilization ?? 0}%
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">ضمن الحدود المعتمدة</div>
        </div>

        {/* Forecast Cost */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-[11px] text-stone-500 flex items-center justify-between">
            <span>التكلفة المتوقعة</span>
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="mt-1 text-lg font-bold text-indigo-700">
            ${summary?.forecastCost?.toFixed(2) ?? "0.00"}
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">استشاري (Advisory)</div>
        </div>
      </div>

      {/* Sub-Tabs Navigation (7 Tabs) */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveSubTab("overview")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "overview"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
          id="subtab-overview"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>1. نظرة عامة</span>
        </button>

        <button
          onClick={() => setActiveSubTab("usage_tokens")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "usage_tokens"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
          id="subtab-usage-tokens"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2. الاستهلاك والرموز ({metrics.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("cost_budget")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "cost_budget"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
          id="subtab-cost-budget"
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>3. التكلفة والميزانية ({budgets.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("capacity_slo")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "capacity_slo"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
          id="subtab-capacity-slo"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>4. Capacity / SLO ({capacities.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("alerts")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "alerts"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
          id="subtab-alerts"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>5. التنبيهات ({alerts.filter((a) => a.status === "open").length} مفتوح)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("forecast")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "forecast"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
          id="subtab-forecast"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>6. Forecast (التوقعات)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("audit")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "audit"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
          id="subtab-audit"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>7. Audit (التدقيق) ({audits.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Budget Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <span>حالة الميزانية الحالية</span>
                </h3>
                {getBudgetStatusBadge(summary?.budgetStatus)}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-stone-600">
                  <span>المستهلك التقديري:</span>
                  <span className="font-bold text-stone-900">${summary?.budgetSpent ?? summary?.estimatedCost ?? 0}</span>
                </div>
                <div className="flex justify-between text-xs text-stone-600">
                  <span>السقف المعتمد:</span>
                  <span className="font-bold text-stone-900">${summary?.budgetAmount ?? 150}</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      (summary?.budgetUsedPercent || 0) >= 100
                        ? "bg-rose-500"
                        : (summary?.budgetUsedPercent || 0) >= 80
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, summary?.budgetUsedPercent || 0)}%` }}
                  />
                </div>
                <div className="text-[11px] text-stone-400 flex justify-between">
                  <span>النسبة: {summary?.budgetUsedPercent || 0}%</span>
                  <span>التحذير يبدأ عند 80%</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs text-stone-600 space-y-1">
                <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  <span>حوكمة تجاوز الميزانية:</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  لا يتم إيقاف الخدمة تلقائيًا أو تقييد المستخدمين تلقائيًا، بل يُطلق تنبيه عالي الأولوية ليتخذ الفريق الهندسي قرار الترقية أو التحسين برمجياً.
                </p>
              </div>
            </div>

            {/* Quick Interactive Cost Estimator */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-indigo-600" />
                  <span>حاسبة التكلفة المقدرة الفورية (Cost Estimator)</span>
                </h3>
                <span className="text-xs text-stone-400">نموذج الحساب المعتمد</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 mb-1">رموز الإدخال (Input Tokens)</label>
                  <input
                    type="number"
                    value={calcInputTokens}
                    onChange={(e) => setCalcInputTokens(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">رموز الإخراج (Output Tokens)</label>
                  <input
                    type="number"
                    value={calcOutputTokens}
                    onChange={(e) => setCalcOutputTokens(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">سعر الإدخال لكل 1K رمز ($)</label>
                  <input
                    type="number"
                    step="0.00001"
                    value={calcInputRate}
                    onChange={(e) => setCalcInputRate(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">سعر الإخراج لكل 1K رمز ($)</label>
                  <input
                    type="number"
                    step="0.00001"
                    value={calcOutputRate}
                    onChange={(e) => setCalcOutputRate(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <button
                  onClick={handleSimulateCost}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  احتساب التكلفة التقديرية
                </button>
                <div className="text-left text-xs">
                  <span className="text-stone-500 ml-2">الناتج التقديري:</span>
                  <span className="text-base font-bold text-indigo-700">
                    {simulatedCost !== null ? `$${simulatedCost.toFixed(6)}` : "$0.000000"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Active Alerts Overview */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>أبرز تنبيهات السعة والميزانية التشغيلية</span>
              </h3>
              <button
                onClick={() => setActiveSubTab("alerts")}
                className="text-xs text-indigo-600 hover:underline cursor-pointer"
              >
                عرض كل التنبيهات ←
              </button>
            </div>

            {alerts.length === 0 ? (
              <div className="py-6 text-center text-xs text-stone-400">لا توجد تنبيهات مسجلة حالياً</div>
            ) : (
              <div className="space-y-2">
                {alerts.slice(0, 3).map((alr) => (
                  <div
                    key={alr.id}
                    className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      alr.severity === "critical"
                        ? "bg-rose-50 border-rose-200"
                        : alr.severity === "warning"
                        ? "bg-amber-50 border-amber-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(alr.severity)}
                        <span className="font-bold text-stone-900">{alr.type}</span>
                        <span className="text-[10px] text-stone-500 font-mono">({alr.correlation_id || "COST-ALR"})</span>
                      </div>
                      <p className="text-stone-700 text-xs mt-0.5">{alr.message}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {alr.status === "open" ? (
                        <button
                          onClick={() => {
                            setSelectedAlertForAck(alr);
                            setAckReason("");
                          }}
                          className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium cursor-pointer"
                        >
                          إشعار استلام (Acknowledge)
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> تم الاطلاع ({alr.acknowledged_by})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: USAGE & TOKENS */}
      {activeSubTab === "usage_tokens" && (
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>سجلات استهلاك الرموز والطلبات</span>
              </h3>
              <p className="text-xs text-stone-500">تفاصيل نافذة الاستهلاك للطلبات الناجحة والفاشلة والتكلفة المحسوبة</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="بحث في النماذج أو البيئات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-8 pl-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs w-48 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">البيئة</th>
                  <th className="py-2.5 px-3">المزود والنموذج</th>
                  <th className="py-2.5 px-3">نافذة القياس</th>
                  <th className="py-2.5 px-3">الطلبات (ناجح/فاشل)</th>
                  <th className="py-2.5 px-3">رموز الإدخال</th>
                  <th className="py-2.5 px-3">رموز الإخراج</th>
                  <th className="py-2.5 px-3">التكلفة التقديرية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {metrics
                  .filter((m) => !searchQuery || m.model.toLowerCase().includes(searchQuery.toLowerCase()) || m.environment.includes(searchQuery))
                  .map((m) => (
                    <tr key={m.id} className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-3 font-semibold">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] ${m.environment === "production" ? "bg-purple-100 text-purple-800" : "bg-stone-100 text-stone-700"}`}>
                          {m.environment}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-stone-900">{m.model}</div>
                        <div className="text-[10px] text-stone-400">{m.provider}</div>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-stone-500 font-mono">
                        {new Date(m.window_start).toLocaleTimeString("ar-EG")} - {new Date(m.window_end).toLocaleTimeString("ar-EG")}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-stone-900">{m.requests}</span>
                        <span className="text-[10px] text-stone-400 mr-1">({m.successful_requests}/{m.failed_requests})</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono">{formatTokens(m.input_tokens)}</td>
                      <td className="py-2.5 px-3 font-mono">{formatTokens(m.output_tokens)}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700 font-mono">${Number(m.estimated_cost).toFixed(4)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: COST & BUDGET */}
      {activeSubTab === "cost_budget" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>سياسات الميزانية المعتمدة (Budget Policies)</span>
                </h3>
                <p className="text-xs text-stone-500">حدود الإنفاق اليومية والشهرية مع نسب التحذير والحرجة الموثقة</p>
              </div>

              <button
                onClick={() => setShowBudgetModal(true)}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                id="btn-new-budget-policy"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة سياسة ميزانية جديدة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgets.map((b) => (
                <div key={b.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs">{b.name}</h4>
                      <span className="text-[10px] text-stone-500">البيئة: {b.environment} • الدورة: {b.period === "daily" ? "يومية" : "شهرية"}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {b.enabled ? "مفعلة" : "معطلة"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-stone-200/60">
                    <div>
                      <span className="text-[10px] text-stone-400 block">سقف الميزانية</span>
                      <span className="font-bold text-stone-900 text-sm">${b.budget_amount ?? b.budgetAmount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">حد التحذير</span>
                      <span className="font-bold text-amber-600">{b.warning_percent ?? b.warningPercent}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">الحد الحرج</span>
                      <span className="font-bold text-rose-600">{b.critical_percent ?? b.criticalPercent}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CAPACITY / SLO */}
      {activeSubTab === "capacity_slo" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-teal-600" />
                  <span>سياسات القدرة الاستيعابية (Capacity Policies)</span>
                </h3>
                <p className="text-xs text-stone-500">
                  محددات السعة المسموحة (TPM, RPM, Latency P95) لمنع إرهاق النماذج أو تدهور الخدمة
                </p>
              </div>

              <button
                onClick={() => setShowCapacityModal(true)}
                className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                id="btn-new-capacity-policy"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة سياسة سعة جديدة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {capacities.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 text-xs">{c.name}</h4>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 text-teal-800">
                      {c.enabled ? "مفعلة" : "معطلة"}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-stone-600">
                      <span>المقياس (Metric):</span>
                      <span className="font-mono text-stone-900">{c.metric}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>الشرط والسقف:</span>
                      <span className="font-bold text-stone-900 font-mono">
                        {c.operator === "lte" ? "≤" : "≥"} {c.threshold.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>نافذة التجميع:</span>
                      <span className="text-stone-700">{c.window_minutes ?? c.windowMinutes} دقيقة</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ALERTS */}
      {activeSubTab === "alerts" && (
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>سجل تنبيهات التكلفة والسعة التشغيلية</span>
              </h3>
              <p className="text-xs text-stone-500">يتطلب كل تنبيه إشعار استلام بشري (Human Acknowledgement) دون إجراءات معالجة تلقائية</p>
            </div>
          </div>

          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400">لا توجد تنبيهات حالياً</div>
            ) : (
              alerts.map((alr) => (
                <div
                  key={alr.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    alr.severity === "critical"
                      ? "bg-rose-50/70 border-rose-200"
                      : alr.severity === "warning"
                      ? "bg-amber-50/70 border-amber-200"
                      : "bg-blue-50/70 border-blue-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(alr.severity)}
                      <span className="font-bold text-stone-900 text-sm">{alr.type}</span>
                      <span className="text-[10px] text-stone-500 font-mono">[{alr.environment}]</span>
                    </div>
                    <span className="text-[11px] text-stone-500 font-mono">{alr.correlation_id}</span>
                  </div>

                  <p className="text-stone-700 leading-relaxed">{alr.message}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-200/50 text-[11px]">
                    <div className="text-stone-500">
                      القيمة المرصودة: <strong className="text-stone-800">{alr.observed_value ?? "—"}</strong> | الحد: <strong className="text-stone-800">{alr.threshold ?? "—"}</strong>
                    </div>

                    <div>
                      {alr.status === "open" ? (
                        <button
                          onClick={() => {
                            setSelectedAlertForAck(alr);
                            setAckReason("");
                          }}
                          className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          إشعار استلام ومراجعة التنبيه
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> تم الاستلام بواسطة {alr.acknowledged_by} ({new Date(alr.acknowledged_at || "").toLocaleDateString("ar-EG")})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 6: FORECAST */}
      {activeSubTab === "forecast" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>توقعات التكلفة المستندة إلى المتوسط المتحرك (Rolling Average Forecast)</span>
                </h3>
                <p className="text-xs text-stone-500">
                  التوقعات استشارية فقط للمساعدة في التخطيط المالي، ولا تطلق أي نشر أو تحجيم أو تراجع تلقائي
                </p>
              </div>
            </div>

            {/* Interactive Forecast Playground */}
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3">
              <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                <span>محاكي التوقع المالي المستقبلي</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 mb-1">نقاط التكلفة السابقة (مفصولة بفواصل)</label>
                  <input
                    type="text"
                    value={forecastValuesInput}
                    onChange={(e) => setForecastValuesInput(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 text-xs font-mono"
                    placeholder="110, 125, 140"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">عدد فترات المتوسط المتحرك (Periods)</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={forecastPeriods}
                    onChange={(e) => setForecastPeriods(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleGenerateForecast}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  احتساب التوقع وتخزين لقطة
                </button>
                {generatedForecast && (
                  <div className="text-xs font-semibold text-indigo-900">
                    التوقع المحسوب: <span className="text-base font-bold text-indigo-700">${generatedForecast.forecast?.toFixed(2)}</span>
                    <span className="mr-2 text-stone-500 font-normal">| مستوى الثقة: {generatedForecast.confidence}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Historical Forecast Snapshots */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-800">سجل لقطات التوقعات السابقة:</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3">البيئة</th>
                      <th className="py-2.5 px-3">الدورة</th>
                      <th className="py-2.5 px-3">التكلفة المرصودة</th>
                      <th className="py-2.5 px-3">التكلفة المتوقعة</th>
                      <th className="py-2.5 px-3">طريقة التوقع</th>
                      <th className="py-2.5 px-3">مستوى الثقة</th>
                      <th className="py-2.5 px-3">تاريخ الالتقاط</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {forecasts.map((f) => (
                      <tr key={f.id} className="hover:bg-stone-50/50">
                        <td className="py-2.5 px-3 font-semibold">{f.environment}</td>
                        <td className="py-2.5 px-3">{f.period}</td>
                        <td className="py-2.5 px-3 font-mono">${Number(f.observed_cost).toFixed(2)}</td>
                        <td className="py-2.5 px-3 font-bold text-indigo-700 font-mono">${Number(f.forecast_cost).toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-stone-600">{f.forecast_method}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] bg-indigo-100 text-indigo-800">
                            {f.confidence}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-stone-400 font-mono">
                          {new Date(f.created_at).toLocaleString("ar-EG")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: AUDIT */}
      {activeSubTab === "audit" && (
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-stone-700" />
                <span>سجل التدقيق والمتابعة الصارم (Audit Trail)</span>
              </h3>
              <p className="text-xs text-stone-500">
                تسجيل كافة تغييرات السياسات وإشعارات التنبيهات وهوية المسؤولين وأرقام الارتباط
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">الإجراء (Action)</th>
                  <th className="py-2.5 px-3">المسؤول (Actor)</th>
                  <th className="py-2.5 px-3">رقم الارتباط (Correlation ID)</th>
                  <th className="py-2.5 px-3">المبرر والتفاصيل</th>
                  <th className="py-2.5 px-3">الوقت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {audits.map((a) => (
                  <tr key={a.id} className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-3 font-bold text-stone-900">
                      <span className="px-2 py-0.5 rounded-md text-[10px] bg-stone-200 text-stone-800 font-mono">
                        {a.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-stone-800">{a.actor}</td>
                    <td className="py-2.5 px-3 font-mono text-stone-500">{a.correlation_id || "—"}</td>
                    <td className="py-2.5 px-3 text-stone-700 max-w-md">{a.reason}</td>
                    <td className="py-2.5 px-3 text-stone-400 font-mono">
                      {new Date(a.created_at).toLocaleString("ar-EG")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE BUDGET POLICY */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl text-right">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>إضافة سياسة ميزانية جديدة V1.29</span>
              </h3>
              <button onClick={() => setShowBudgetModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBudgetPolicy} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">اسم السياسة *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ميزانية إنتاج الربع الأول"
                  value={newBudgetName}
                  onChange={(e) => setNewBudgetName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">البيئة</label>
                  <select
                    value={newBudgetEnv}
                    onChange={(e) => setNewBudgetEnv(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  >
                    <option value="production">الإنتاج (Production)</option>
                    <option value="staging">التجهيز (Staging)</option>
                    <option value="development">التطوير (Development)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">الدورة</label>
                  <select
                    value={newBudgetPeriod}
                    onChange={(e) => setNewBudgetPeriod(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  >
                    <option value="monthly">شهري (Monthly)</option>
                    <option value="daily">يومي (Daily)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">الميزانية ($) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newBudgetAmount}
                    onChange={(e) => setNewBudgetAmount(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">نسبة التحذير (%)</label>
                  <input
                    type="number"
                    value={newBudgetWarning}
                    onChange={(e) => setNewBudgetWarning(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">النسبة الحرجة (%)</label>
                  <input
                    type="number"
                    value={newBudgetCritical}
                    onChange={(e) => setNewBudgetCritical(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 space-y-2">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">المسؤول المنفذ (Actor) *</label>
                  <input
                    type="text"
                    required
                    value={budgetActor}
                    onChange={(e) => setBudgetActor(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">المبرر الإداري / المالي (Reason) *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="بيان سبب إضافة أو تعديل سقف الميزانية..."
                    value={budgetReason}
                    onChange={(e) => setBudgetReason(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowBudgetModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  حفظ السياسة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE CAPACITY POLICY */}
      {showCapacityModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl text-right">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-teal-600" />
                <span>إضافة سياسة سعة استيعابية جديدة V1.29</span>
              </h3>
              <button onClick={() => setShowCapacityModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCapacityPolicy} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">اسم السياسة *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سقف طلبات المعالجة بالدقيقة"
                  value={newCapName}
                  onChange={(e) => setNewCapName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">البيئة</label>
                  <select
                    value={newCapEnv}
                    onChange={(e) => setNewCapEnv(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  >
                    <option value="production">الإنتاج (Production)</option>
                    <option value="staging">التجهيز (Staging)</option>
                    <option value="development">التطوير (Development)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">المقياس (Metric)</label>
                  <select
                    value={newCapMetric}
                    onChange={(e) => setNewCapMetric(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-mono"
                  >
                    <option value="tokens_per_minute">tokens_per_minute (TPM)</option>
                    <option value="requests_per_minute">requests_per_minute (RPM)</option>
                    <option value="p95_latency_ms">p95_latency_ms</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">المعامل (Operator)</label>
                  <select
                    value={newCapOperator}
                    onChange={(e) => setNewCapOperator(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  >
                    <option value="lte">أقل من أو يساوي (≤)</option>
                    <option value="gte">أكبر من أو يساوي (≥)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">الحد (Threshold) *</label>
                  <input
                    type="number"
                    required
                    value={newCapThreshold}
                    onChange={(e) => setNewCapThreshold(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">النافذة (دقائق)</label>
                  <input
                    type="number"
                    min="1"
                    value={newCapWindow}
                    onChange={(e) => setNewCapWindow(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">المسؤول (Actor) *</label>
                    <input
                      type="text"
                      required
                      value={capActor}
                      onChange={(e) => setCapActor(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">المعتمد (Approved By) *</label>
                    <input
                      type="text"
                      required
                      value={capApprovedBy}
                      onChange={(e) => setCapApprovedBy(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">مبرر تحديد السعة (Reason) *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="موجب التعديل وتأثيره على تشغيل النموذج..."
                    value={capReason}
                    onChange={(e) => setCapReason(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowCapacityModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  اعتماد السياسة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ACKNOWLEDGE ALERT */}
      {selectedAlertForAck && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-right">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>إشعار استلام ومراجعة التنبيه</span>
              </h3>
              <button onClick={() => setSelectedAlertForAck(null)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
              <div className="font-bold text-stone-900">{selectedAlertForAck.type}</div>
              <p className="text-stone-600 text-[11px]">{selectedAlertForAck.message}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">اسم المسؤول المراجع *</label>
                <input
                  type="text"
                  required
                  value={ackActor}
                  onChange={(e) => setAckActor(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">ملاحظات المراجعة</label>
                <textarea
                  rows={2}
                  placeholder="ملاحظات المراجعة الفنية أو الإدارية..."
                  value={ackReason}
                  onChange={(e) => setAckReason(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setSelectedAlertForAck(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleAcknowledgeAlert}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                تأكيد الاطلاع وتوثيق في التدقيق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
