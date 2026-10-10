import React, { useState, useEffect } from "react";
import {
  FlaskConical,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  Layers,
  Plus,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Gauge,
  Cpu,
  ShieldAlert,
  GitBranch,
  Server,
  Activity,
  LifeBuoy,
  Coins,
  BadgeCheck
} from "lucide-react";
import { EvalSuite, EvalCase, EvalRun, EvalResult, RegressionComparison } from "../types/darb-ai-evaluation";
import { DarbAIEvaluationIntegratedRunnerView } from "./DarbAIEvaluationIntegratedRunnerView";
import { DarbAIRegressionReleaseGateView } from "./DarbAIRegressionReleaseGateView";
import { DarbAIReleaseVersionManagerView } from "./DarbAIReleaseVersionManagerView";
import { DarbAIDeploymentEnvironmentManagerView } from "./DarbAIDeploymentEnvironmentManagerView";
import { DarbAIObservabilitySloManagerView } from "./DarbAIObservabilitySloManagerView";
import { DarbAIIncidentRecoveryManagerView } from "./DarbAIIncidentRecoveryManagerView";
import { DarbAICapacityCostGovernanceView } from "./DarbAICapacityCostGovernanceView";
import { DarbAIOptimizationGovernanceView } from "./DarbAIOptimizationGovernanceView";
import { DarbAIFinalProductionAuditView } from "./DarbAIFinalProductionAuditView";

export default function DarbAIEvaluationLabView() {
  const [suites, setSuites] = useState<EvalSuite[]>([]);
  const [selectedSuiteId, setSelectedSuiteId] = useState<number>(1);
  const [cases, setCases] = useState<EvalCase[]>([]);
  const [runs, setRuns] = useState<EvalRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<EvalRun | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [runningLab, setRunningLab] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"final_audit_v130" | "optimization_v130" | "capacity_cost_v129" | "incident_recovery_v128" | "observability_v127" | "deployments_v126" | "versions_v125" | "release_gate" | "integrated_runner" | "runner" | "suites" | "regression">("final_audit_v130");

  // New Suite Form State
  const [showNewSuiteModal, setShowNewSuiteModal] = useState<boolean>(false);
  const [newSuiteName, setNewSuiteName] = useState<string>("");
  const [newSuiteDesc, setNewSuiteDesc] = useState<string>("");

  // New Case Form State
  const [showNewCaseModal, setShowNewCaseModal] = useState<boolean>(false);
  const [newCaseQuestion, setNewCaseQuestion] = useState<string>("");
  const [newCaseRoute, setNewCaseRoute] = useState<string>("knowledge_only");
  const [newCaseSource, setNewCaseSource] = useState<string>("darb_knowledge");
  const [newCaseConfidence, setNewCaseConfidence] = useState<string>("supported");
  const [newCaseTags, setNewCaseTags] = useState<string>("معاملات, رسمي");

  // Regression Comparison State
  const [baselineRunId, setBaselineRunId] = useState<number>(1);
  const [currentRunId, setCurrentRunId] = useState<number>(2);
  const [comparison, setComparison] = useState<RegressionComparison | null>(null);
  const [comparing, setComparing] = useState<boolean>(false);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedResultId, setExpandedResultId] = useState<number | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [suitesRes, runsRes] = await Promise.all([
        fetch("/api/admin/ai/evaluation/suites"),
        fetch("/api/admin/ai/evaluation/runs")
      ]);

      if (suitesRes.ok) {
        const data = await suitesRes.json();
        const suitesList: EvalSuite[] = data.suites || [];
        setSuites(suitesList);
        if (suitesList.length > 0) {
          setSelectedSuiteId(suitesList[0].id);
          fetchCases(suitesList[0].id);
        }
      }

      if (runsRes.ok) {
        const data = await runsRes.json();
        const runsList: EvalRun[] = data.runs || [];
        setRuns(runsList);
        if (runsList.length > 0) {
          fetchRunDetails(runsList[0].id);
          if (runsList.length >= 2) {
            setBaselineRunId(runsList[runsList.length - 1].id);
            setCurrentRunId(runsList[0].id);
          }
        }
      }
    } catch (err) {
      console.warn("[DARB V1.21] Error loading initial eval data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async (suiteId: number) => {
    try {
      const res = await fetch(`/api/admin/ai/evaluation/suites/${suiteId}/cases`);
      if (res.ok) {
        const data = await res.json();
        setCases(data.cases || []);
      }
    } catch (err) {
      console.warn("[DARB V1.21] Error fetching cases:", err);
    }
  };

  const fetchRunDetails = async (runId: number) => {
    try {
      const res = await fetch(`/api/admin/ai/evaluation/runs/${runId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedRun(data.run || null);
      }
    } catch (err) {
      console.warn("[DARB V1.21] Error fetching run details:", err);
    }
  };

  const handleSelectSuite = (suiteId: number) => {
    setSelectedSuiteId(suiteId);
    fetchCases(suiteId);
  };

  const handleCreateSuite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuiteName.trim()) return;

    try {
      const res = await fetch("/api/admin/ai/evaluation/suites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSuiteName.trim(),
          description: newSuiteDesc.trim()
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSuites([data.suite, ...suites]);
        setSelectedSuiteId(data.suite.id);
        setCases([]);
        setShowNewSuiteModal(false);
        setNewSuiteName("");
        setNewSuiteDesc("");
        setFeedbackMsg({ type: "success", text: "تم إنشاء حزمة الاختبار بنجاح" });
      }
    } catch {
      setFeedbackMsg({ type: "error", text: "تعذر إنشاء حزمة الاختبار" });
    }
  };

  const handleDeleteSuite = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الحزمة وجميع حالات الاختبار المرتبطة بها؟")) return;
    try {
      const res = await fetch(`/api/admin/ai/evaluation/suites/${id}`, { method: "DELETE" });
      if (res.ok) {
        const updated = suites.filter((s) => s.id !== id);
        setSuites(updated);
        if (updated.length > 0) {
          setSelectedSuiteId(updated[0].id);
          fetchCases(updated[0].id);
        }
        setFeedbackMsg({ type: "success", text: "تم حذف حزمة الاختبار" });
      }
    } catch {
      setFeedbackMsg({ type: "error", text: "تعذر حذف حزمة الاختبار" });
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseQuestion.trim()) return;

    const tags = newCaseTags
      .split(/[,،]/)
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/admin/ai/evaluation/suites/${selectedSuiteId}/cases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: newCaseQuestion.trim(),
          expected_route: newCaseRoute,
          expected_source: newCaseSource,
          expected_min_confidence: newCaseConfidence,
          tags_json: tags
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCases([...cases, data.item]);
        setShowNewCaseModal(false);
        setNewCaseQuestion("");
        setFeedbackMsg({ type: "success", text: "تمت إضافة حالة الاختبار بنجاح" });
      }
    } catch {
      setFeedbackMsg({ type: "error", text: "تعذر إضافة حالة الاختبار" });
    }
  };

  const handleDeleteCase = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/ai/evaluation/cases/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCases(cases.filter((c) => c.id !== id));
        setFeedbackMsg({ type: "success", text: "تم حذف حالة الاختبار" });
      }
    } catch {
      setFeedbackMsg({ type: "error", text: "تعذر حذف حالة الاختبار" });
    }
  };

  const handleRunEvaluation = async () => {
    setRunningLab(true);
    setFeedbackMsg(null);
    try {
      const selectedSuite = suites.find((s) => s.id === selectedSuiteId);
      const res = await fetch("/api/admin/ai/evaluation/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suiteId: selectedSuiteId,
          runLabel: `تقييم ${selectedSuite?.name?.slice(0, 25) || "مختبري"} — ${new Date().toLocaleTimeString("ar-SA")}`
        })
      });
      if (res.ok) {
        const data = await res.json();
        const run: EvalRun = data.run;
        setRuns([run, ...runs]);
        setSelectedRun(run);
        setFeedbackMsg({
          type: "success",
          text: `اكتمل التقييم بنجاح! نسبة النجاح: ${Math.round(((run.passRate ?? run.pass_rate ?? 0) * 100))}% (${run.passed_cases ?? run.passed} ناجح / ${run.total_cases ?? run.total} كلي)`
        });
      } else {
        setFeedbackMsg({ type: "error", text: "تعذر إكمال تشغيل الاختبارات المخبرية" });
      }
    } catch {
      setFeedbackMsg({ type: "error", text: "حدث خطأ أثناء الاتصال بمحرك التقييم" });
    } finally {
      setRunningLab(false);
    }
  };

  const handleRunComparison = async () => {
    setComparing(true);
    try {
      const res = await fetch("/api/admin/ai/evaluation/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baselineRunId,
          currentRunId
        })
      });
      if (res.ok) {
        const data = await res.json();
        setComparison(data.comparison);
      } else {
        setFeedbackMsg({ type: "error", text: "تعذر إجراء مقارنة التراجع بين التشغيلين" });
      }
    } catch {
      setFeedbackMsg({ type: "error", text: "حدث خطأ أثناء مقارنة نتائج الاختبار" });
    } finally {
      setComparing(false);
    }
  };

  // Helper labels & badges
  const routeLabel = (route?: string) => {
    switch (route) {
      case "knowledge_only":
        return "قاعدة المعرفة فقط";
      case "knowledge_then_web":
        return "المعرفة ثم الويب";
      case "refuse_insufficient":
        return "امتناع لنقص الأدلة";
      default:
        return route || "غير محدد";
    }
  };

  const sourceLabel = (source?: string) => {
    switch (source) {
      case "darb_knowledge":
        return "🟢 دَرْب المعتمدة";
      case "web_search":
        return "🌐 بحث الويب";
      case "none":
        return "⚪ لا مصادر (امتناع)";
      case "mixed":
        return "🔵 مختلط";
      default:
        return source || "—";
    }
  };

  const confidenceBadge = (conf?: string) => {
    switch (conf) {
      case "supported":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">مؤكد (Supported)</span>;
      case "limited":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">محدود (Limited)</span>;
      case "conflicted":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">متعارض (Conflicted)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-stone-100 text-stone-700">غير كافٍ (Insufficient)</span>;
    }
  };

  const activeSuite = suites.find((s) => s.id === selectedSuiteId);

  return (
    <div className="space-y-6">
      {/* Top Banner: Subview Title & Governance Rules */}
      <div className="bg-gradient-to-r from-teal-900 via-stone-900 to-emerald-950 text-white rounded-2xl p-5 shadow-sm border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                مختبر تقييم الذكاء الاصطناعي والاختبار الآلي (V1.21)
              </h3>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                AI Evaluation Lab
              </span>
            </div>
            <p className="text-xs text-stone-300 max-w-3xl leading-relaxed">
              مجموعات اختبار قابلة للتكرار تقيس دقة التوجيه (Routing)، ومصداقية الأدلة (Grounding)، ومستوى الثقة، وزمن الاستجابة والتكلفة، مع منع التراجع (Regression Testing) وحظر النشر التلقائي التام.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800/80 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Auto-Publish: Disabled</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800/80 border border-stone-700 text-stone-300 text-xs">
              <FileCheck2 className="w-4 h-4 text-teal-400" />
              <span>Human-in-the-Loop</span>
            </div>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-stone-700/60 text-xs">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-stone-400 block text-[11px]">حزم الاختبار (Suites)</span>
            <span className="text-lg font-bold text-white mt-0.5 block">{suites.length}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-stone-400 block text-[11px]">حالات الاختبار الكلية</span>
            <span className="text-lg font-bold text-emerald-300 mt-0.5 block">
              {suites.reduce((sum, s) => sum + (s.cases_count || 0), 0) || cases.length}
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-stone-400 block text-[11px]">نسبة نجاح آخر تشغيل</span>
            <span className="text-lg font-bold text-teal-300 mt-0.5 block">
              {runs.length > 0
                ? `${Math.round(((runs[0].passRate ?? runs[0].pass_rate ?? 0) * 100))}%`
                : "—"}
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-stone-400 block text-[11px]">سجلات التشغيل المخبري</span>
            <span className="text-lg font-bold text-amber-300 mt-0.5 block">{runs.length}</span>
          </div>
        </div>
      </div>

      {/* Feedback Message */}
      {feedbackMsg && (
        <div
          className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
            feedbackMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab("final_audit_v130")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "final_audit_v130"
              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
          id="tab-final-audit-v130"
        >
          <BadgeCheck className="w-4 h-4 text-emerald-400" />
          <span>الفحص النهائي للإنتاج V1.30 (Production Audit Pack)</span>
        </button>

        <button
          onClick={() => setActiveTab("optimization_v130")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "optimization_v130"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
          id="tab-optimization-v130"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>حوكمة وتحسين الاستهلاك V1.30 (Optimization)</span>
        </button>

        <button
          onClick={() => setActiveTab("capacity_cost_v129")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "capacity_cost_v129"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
          id="tab-capacity-cost-v129"
        >
          <Coins className="w-4 h-4 text-emerald-400" />
          <span>حوكمة السعة والتكاليف V1.29 (Capacity & Cost)</span>
        </button>

        <button
          onClick={() => setActiveTab("incident_recovery_v128")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "incident_recovery_v128"
              ? "bg-rose-900 text-white shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
          id="tab-incident-recovery-v128"
        >
          <LifeBuoy className="w-4 h-4 text-rose-300" />
          <span>إدارة الحوادث والتعافي V1.28 (Incidents & Recovery)</span>
        </button>

        <button
          onClick={() => setActiveTab("observability_v127")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "observability_v127"
              ? "bg-emerald-800 text-white shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
          id="tab-observability-slo-v127"
        >
          <Activity className="w-4 h-4 text-emerald-300" />
          <span>مراقبة AI وSLO V1.27</span>
        </button>

        <button
          onClick={() => setActiveTab("deployments_v126")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "deployments_v126"
              ? "bg-teal-800 text-white shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
          id="tab-deployment-environment-v126"
        >
          <Server className="w-4 h-4 text-emerald-300" />
          <span>إدارة النشر والبيئات V1.26</span>
        </button>

        <button
          onClick={() => setActiveTab("versions_v125")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "versions_v125"
              ? "bg-teal-700 text-white shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
          id="tab-release-version-v125"
        >
          <GitBranch className="w-4 h-4 text-amber-300" />
          <span>إدارة الإصدارات V1.25 (Version Manager)</span>
        </button>

        <button
          onClick={() => setActiveTab("release_gate")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "release_gate"
              ? "bg-teal-700 text-white shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
          id="tab-release-gate-v124"
        >
          <ShieldAlert className="w-4 h-4 text-emerald-300" />
          <span>بوابة الإصدار والتراجع V1.24 (Release Gate)</span>
        </button>

        <button
          onClick={() => setActiveTab("integrated_runner")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "integrated_runner"
              ? "bg-teal-700 text-white shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
          id="tab-integrated-runner-v123"
        >
          <Cpu className="w-4 h-4" />
          <span>المشغل المتكامل V1.23 (Integrated Runner)</span>
        </button>

        <button
          onClick={() => setActiveTab("runner")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "runner"
              ? "bg-teal-700 text-white shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <Play className="w-4 h-4" />
          <span>تشغيل المختبر والنتائج (Run Lab)</span>
        </button>

        <button
          onClick={() => setActiveTab("suites")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "suites"
              ? "bg-teal-700 text-white shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>مجموعات وحالات الاختبار ({suites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("regression")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "regression"
              ? "bg-teal-700 text-white shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>مقارنة التراجع المرجعي (Regression Analysis)</span>
        </button>
      </div>

      {/* TAB V1.30: FINAL PRODUCTION AUDIT PACK */}
      {activeTab === "final_audit_v130" && (
        <DarbAIFinalProductionAuditView />
      )}

      {/* TAB V1.30: AI OPTIMIZATION GOVERNANCE */}
      {activeTab === "optimization_v130" && (
        <DarbAIOptimizationGovernanceView />
      )}

      {/* TAB V1.29: AI CAPACITY & COST GOVERNANCE */}
      {activeTab === "capacity_cost_v129" && (
        <DarbAICapacityCostGovernanceView />
      )}

      {/* TAB V1.28: AI INCIDENT & RECOVERY MANAGER */}
      {activeTab === "incident_recovery_v128" && (
        <DarbAIIncidentRecoveryManagerView />
      )}

      {/* TAB V1.27: AI OBSERVABILITY & SLO MANAGER */}
      {activeTab === "observability_v127" && (
        <DarbAIObservabilitySloManagerView />
      )}

      {/* TAB V1.26: AI DEPLOYMENT & ENVIRONMENT MANAGER */}
      {activeTab === "deployments_v126" && (
        <DarbAIDeploymentEnvironmentManagerView />
      )}

      {/* TAB V1.25: AI RELEASE & VERSION MANAGER */}
      {activeTab === "versions_v125" && (
        <DarbAIReleaseVersionManagerView />
      )}

      {/* TAB V1.24: REGRESSION & RELEASE GATE */}
      {activeTab === "release_gate" && (
        <DarbAIRegressionReleaseGateView />
      )}

      {/* TAB 0: V1.23 INTEGRATED EVALUATION RUNNER */}
      {activeTab === "integrated_runner" && (
        <DarbAIEvaluationIntegratedRunnerView suites={suites} />
      )}

      {/* TAB 1: RUN LAB & LIVE RESULTS */}
      {activeTab === "runner" && (
        <div className="space-y-6">
          {/* Suite Selector & Execution Control */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Play className="w-4 h-4 text-teal-600" />
                  <span>تحديد حزمة الاختبار وتشغيل التقييم الآلي</span>
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  سيتم تنفيذ جميع حالات الاختبار في الحزمة المحددة ضد خط أنابيب DARB AI وفحص صحة المسار والمصادر والامتناع.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedSuiteId}
                  onChange={(e) => handleSelectSuite(Number(e.target.value))}
                  className="px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white text-stone-800 focus:outline-teal-600 font-medium"
                >
                  {suites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.cases_count || 0} حالات)
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleRunEvaluation}
                  disabled={runningLab || cases.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  {runningLab ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>جارٍ التقييم...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>بدء الفحص الآلي ({cases.length} حالات)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {activeSuite && (
              <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 border border-stone-200/80 flex items-start gap-2">
                <span className="font-bold text-stone-800 whitespace-nowrap">وصف الحزمة:</span>
                <span>{activeSuite.description || "حزمة فحص قياسية للتحقق من تكامل النظام."}</span>
              </div>
            )}
          </div>

          {/* Current / Selected Run Overview */}
          {selectedRun ? (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                  <div>
                    <span className="text-[11px] font-mono text-teal-700 font-bold block">
                      تشغيل رقم #{selectedRun.id}
                    </span>
                    <h4 className="text-base font-bold text-stone-900">
                      {selectedRun.run_label || "تشغيل تقييم مخبري"}
                    </h4>
                    <span className="text-xs text-stone-400">
                      تاريخ التشغيل: {new Date(selectedRun.created_at || "").toLocaleString("ar-SA")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        (selectedRun.failed_cases ?? selectedRun.failed ?? 0) === 0
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-rose-100 text-rose-800 border border-rose-300"
                      }`}
                    >
                      {(selectedRun.failed_cases ?? selectedRun.failed ?? 0) === 0
                        ? "ناجح بنسبة 100% (Passed)"
                        : `يوجد ${(selectedRun.failed_cases ?? selectedRun.failed)} حالات فشل`}
                    </span>
                  </div>
                </div>

                {/* Scorecards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-500 font-medium">معدل النجاح (Pass Rate)</span>
                      <Sparkles className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-2xl font-bold text-teal-800 mt-1 block">
                      {Math.round(((selectedRun.passRate ?? selectedRun.pass_rate ?? 0) * 100))}%
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {selectedRun.passed_cases ?? selectedRun.passed} من {selectedRun.total_cases ?? selectedRun.total}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-500 font-medium">حالات النجاح</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-2xl font-bold text-emerald-700 mt-1 block">
                      {selectedRun.passed_cases ?? selectedRun.passed ?? 0}
                    </span>
                    <span className="text-[11px] text-stone-500">مطابقة تامة للشروط</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-500 font-medium">متوسط زمن الاستجابة</span>
                      <Clock className="w-4 h-4 text-stone-600" />
                    </div>
                    <span className="text-2xl font-bold text-stone-800 mt-1 block font-mono">
                      {Math.round(Number(selectedRun.avgLatencyMs ?? selectedRun.avg_latency_ms ?? 0))} ms
                    </span>
                    <span className="text-[11px] text-stone-500">Latency Per Case</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-500 font-medium">التوكنز التقديرية</span>
                      <Zap className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-2xl font-bold text-indigo-700 mt-1 block font-mono">
                      {selectedRun.estimatedTokens ?? selectedRun.estimated_tokens ?? 0}
                    </span>
                    <span className="text-[11px] text-stone-500">استهلاك تقديري تقريبي</span>
                  </div>
                </div>

                {/* Case Results Table */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-bold text-stone-800">
                      تفاصيل نتائج الحالات ({selectedRun.results?.length || 0})
                    </h5>
                    <span className="text-[11px] text-stone-400">
                      انقر على أي حالة لعرض فحص المعايير ومقتطف الإجابة
                    </span>
                  </div>

                  <div className="border border-stone-200 rounded-xl overflow-hidden">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-stone-100 text-stone-600 font-bold border-b border-stone-200">
                        <tr>
                          <th className="p-3">الحالة</th>
                          <th className="p-3">السؤال</th>
                          <th className="p-3">المسار (متوقع / فعلي)</th>
                          <th className="p-3">المصدر</th>
                          <th className="p-3">الثقة</th>
                          <th className="p-3">الزمن</th>
                          <th className="p-3">النتيجة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {selectedRun.results && selectedRun.results.length > 0 ? (
                          selectedRun.results.map((r, idx) => {
                            const isExpanded = expandedResultId === (r.id || idx);
                            return (
                              <React.Fragment key={r.id || idx}>
                                <tr
                                  onClick={() => setExpandedResultId(isExpanded ? null : (r.id || idx))}
                                  className="hover:bg-stone-50 transition-colors cursor-pointer"
                                >
                                  <td className="p-3 font-mono font-bold text-stone-500">
                                    #{r.case_id ?? r.caseId ?? idx + 1}
                                  </td>
                                  <td className="p-3 font-medium text-stone-900 max-w-xs truncate">
                                    {r.question || `حالة اختبار رقم ${r.case_id || idx + 1}`}
                                  </td>
                                  <td className="p-3">
                                    <div className="text-[11px]">
                                      <span className="text-stone-500 block">
                                        متوقع: {routeLabel(r.expected_route)}
                                      </span>
                                      <span
                                        className={`font-bold ${
                                          (r.checks_json?.route ?? r.checks?.route ?? true)
                                            ? "text-emerald-700"
                                            : "text-rose-600"
                                        }`}
                                      >
                                        فعلي: {routeLabel(r.route_actual ?? r.routeActual)}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-3 text-[11px]">
                                    {sourceLabel(r.source_actual ?? r.sourceActual)}
                                  </td>
                                  <td className="p-3 text-[11px]">
                                    {confidenceBadge(r.confidence_actual ?? r.confidenceActual)}
                                  </td>
                                  <td className="p-3 font-mono text-stone-600">
                                    {r.latency_ms ?? r.latencyMs ?? 0} ms
                                  </td>
                                  <td className="p-3">
                                    {r.passed ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>نجاح</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
                                        <XCircle className="w-3.5 h-3.5" />
                                        <span>فشل</span>
                                      </span>
                                    )}
                                  </td>
                                </tr>

                                {/* Expanded Drawer */}
                                {isExpanded && (
                                  <tr className="bg-teal-50/40">
                                    <td colSpan={7} className="p-4 border-t border-stone-200">
                                      <div className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                          <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                                            <span className="text-[11px] text-stone-500 font-bold block mb-1">
                                              فحص المسار (Route Check):
                                            </span>
                                            <span
                                              className={`text-xs font-bold ${
                                                (r.checks_json?.route ?? r.checks?.route ?? true)
                                                  ? "text-emerald-700"
                                                  : "text-rose-600"
                                              }`}
                                            >
                                              {(r.checks_json?.route ?? r.checks?.route ?? true)
                                                ? "✓ مطابق للمسار المعتمد"
                                                : "✗ غير مطابق للمسار المتوقع"}
                                            </span>
                                          </div>

                                          <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                                            <span className="text-[11px] text-stone-500 font-bold block mb-1">
                                              فحص المصدر (Source Check):
                                            </span>
                                            <span
                                              className={`text-xs font-bold ${
                                                (r.checks_json?.source ?? r.checks?.source ?? true)
                                                  ? "text-emerald-700"
                                                  : "text-rose-600"
                                              }`}
                                            >
                                              {(r.checks_json?.source ?? r.checks?.source ?? true)
                                                ? "✓ مطابق لشارة المصدر"
                                                : "✗ المصدر الفعلي لا يطابق التوقع"}
                                            </span>
                                          </div>

                                          <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                                            <span className="text-[11px] text-stone-500 font-bold block mb-1">
                                              فحص الثقة (Confidence Check):
                                            </span>
                                            <span
                                              className={`text-xs font-bold ${
                                                (r.checks_json?.confidence ?? r.checks?.confidence ?? true)
                                                  ? "text-emerald-700"
                                                  : "text-rose-600"
                                              }`}
                                            >
                                              {(r.checks_json?.confidence ?? r.checks?.confidence ?? true)
                                                ? "✓ يحقق الحد الأدنى المطلوب للثقة"
                                                : "✗ مستوى الثقة أقل من المتوقع"}
                                            </span>
                                          </div>
                                        </div>

                                        {(r.answer_excerpt ?? r.answerExcerpt) && (
                                          <div className="p-3 bg-white rounded-lg border border-stone-200">
                                            <span className="text-[11px] text-stone-500 font-bold block mb-1">
                                              مقتطف الإجابة المولدة:
                                            </span>
                                            <p className="text-xs text-stone-700 leading-relaxed">
                                              "{r.answer_excerpt ?? r.answerExcerpt}"
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-6 text-center text-stone-400">
                              لا توجد نتائج مسجلة لهذا التشغيل.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center space-y-3">
              <FlaskConical className="w-10 h-10 text-stone-300 mx-auto" />
              <h4 className="text-sm font-bold text-stone-800">لا يوجد تشغيل محدد حالياً</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                اختر حزمة اختبار واضغط "بدء الفحص الآلي" لتنفيذ حالات الاختبار وقياس دقة التوجيه ومستوى الثقة.
              </p>
            </div>
          )}

          {/* Previous Runs History */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-teal-600" />
              <span>سجل التشغيلات السابقة ({runs.length})</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {runs.map((rn) => (
                <div
                  key={rn.id}
                  onClick={() => fetchRunDetails(rn.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedRun?.id === rn.id
                      ? "bg-teal-50/60 border-teal-500 ring-2 ring-teal-500/20"
                      : "bg-stone-50 hover:bg-stone-100/80 border-stone-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-stone-500">#{rn.id}</span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        (rn.passRate ?? rn.pass_rate ?? 0) >= 0.8
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {Math.round(((rn.passRate ?? rn.pass_rate ?? 0) * 100))}%
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-stone-900 mt-1 truncate">
                    {rn.run_label || `تشغيل رقم ${rn.id}`}
                  </h5>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2">
                    <span>{rn.passed_cases ?? rn.passed} ناجح / {rn.failed_cases ?? rn.failed} فاشل</span>
                    <span className="font-mono">{Math.round(Number(rn.avgLatencyMs ?? rn.avg_latency_ms ?? 0))} ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEST SUITES & CASES */}
      {activeTab === "suites" && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-stone-900">إدارة مجموعات وحالات الاختبار</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                تحديد الأسئلة المرجعية والشروط المتوقعة للمسار والمصدر ومستوى الثقة.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewSuiteModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-stone-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>حزمة جديدة</span>
              </button>

              <button
                onClick={() => setShowNewCaseModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة حالة اختبار</span>
              </button>
            </div>
          </div>

          {/* Suites Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {suites.map((s) => {
              const isSelected = s.id === selectedSuiteId;
              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectSuite(s.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-teal-50/50 border-teal-500 shadow-xs ring-2 ring-teal-500/20"
                      : "bg-white hover:bg-stone-50 border-stone-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-stone-900">{s.name}</h5>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSuite(s.id);
                      }}
                      className="text-stone-300 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                      title="حذف الحزمة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{s.description || "بدون وصف"}</p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100 text-[11px]">
                    <span className="text-teal-700 font-bold">
                      {s.cases_count || cases.filter((c) => c.suite_id === s.id).length} حالات اختبار
                    </span>
                    <span className="text-stone-400">
                      {new Date(s.created_at || "").toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cases List for Selected Suite */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h5 className="text-sm font-bold text-stone-900">
                  حالات الاختبار التابعة لـ: "{activeSuite?.name}" ({cases.length})
                </h5>
                <span className="text-xs text-stone-500">
                  كل حالة تحتوي على السؤال والشروط الواجب تحققها
                </span>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="بحث في الحالات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-8 pl-3 py-1.5 text-xs border border-stone-300 rounded-xl bg-stone-50 focus:outline-teal-600 w-56"
                />
              </div>
            </div>

            <div className="divide-y divide-stone-100">
              {cases
                .filter((c) => !searchQuery || c.question.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((c) => (
                  <div key={c.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-stone-400 text-xs">#{c.id}</span>
                        <h6 className="text-xs font-bold text-stone-900">{c.question}</h6>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          المسار المتوقع: <strong>{routeLabel(c.expected_route || c.expectedRoute)}</strong>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          المصدر: <strong>{sourceLabel(c.expected_source || c.expectedSource)}</strong>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          الحد الأدنى للثقة: <strong>{c.expected_min_confidence || c.expectedMinConfidence}</strong>
                        </span>
                      </div>

                      {c.tags_json && c.tags_json.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          {c.tags_json.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200/60 px-1.5 py-0.5 rounded"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button
                        onClick={() => handleDeleteCase(c.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="حذف الحالة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

              {cases.length === 0 && (
                <div className="p-8 text-center text-stone-400 text-xs">
                  لا توجد حالات اختبار في هذه الحزمة حتى الآن. اضغط "إضافة حالة اختبار" للبدء.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REGRESSION ANALYSIS */}
      {activeTab === "regression" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div>
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span>مقارنة التراجع بين تشغيلين (Baseline vs Current)</span>
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                تحديد ما إذا كان أي تعديل في النماذج أو التعليمات البرمجية قد أدى لتراجع في دقة المسار أو زمن الاستجابة أو معدل النجاح.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  التشغيل المرجعي (Baseline Run):
                </label>
                <select
                  value={baselineRunId}
                  onChange={(e) => setBaselineRunId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-teal-600"
                >
                  {runs.map((r) => (
                    <option key={r.id} value={r.id}>
                      #{r.id} — {r.run_label} ({Math.round(((r.passRate ?? r.pass_rate ?? 0) * 100))}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  التشغيل الحالي المراد اختباره (Current Run):
                </label>
                <select
                  value={currentRunId}
                  onChange={(e) => setCurrentRunId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-teal-600"
                >
                  {runs.map((r) => (
                    <option key={r.id} value={r.id}>
                      #{r.id} — {r.run_label} ({Math.round(((r.passRate ?? r.pass_rate ?? 0) * 100))}%)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleRunComparison}
                  disabled={comparing || baselineRunId === currentRunId}
                  className="w-full py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  {comparing ? "جارٍ المقارنة..." : "بدء مقارنة التراجع"}
                </button>
              </div>
            </div>
          </div>

          {/* Comparison Results */}
          {comparison && (
            <div className="space-y-4">
              {/* Verdict Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  comparison.regressedCount === 0
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : "bg-rose-50 border-rose-300 text-rose-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  {comparison.regressedCount === 0 ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-rose-600" />
                  )}
                  <div>
                    <h5 className="text-sm font-bold">{comparison.verdict}</h5>
                    <p className="text-xs mt-0.5 opacity-90">
                      {comparison.regressedCount === 0
                        ? "لم يتم رصد أي تراجع وظيفي مقارنة بالتشغيل المرجعي. النظام مستقر وجاهز."
                        : `تم رصد ${comparison.regressedCount} حالات تراجعت فيها نتائج الفحص عن الأداء المرجعي.`}
                    </p>
                  </div>
                </div>

                <div className="text-left font-mono text-xs font-bold">
                  {comparison.deltaPassRate >= 0 ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +{comparison.deltaPassRate}%
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1">
                      <TrendingDown className="w-4 h-4" />
                      {comparison.deltaPassRate}%
                    </span>
                  )}
                </div>
              </div>

              {/* Side by side stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-xl border border-stone-200">
                  <span className="text-xs text-stone-500 font-bold block mb-2">تغير معدل النجاح (Pass Rate Δ)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-stone-900 font-mono">
                      {comparison.deltaPassRate >= 0 ? `+${comparison.deltaPassRate}%` : `${comparison.deltaPassRate}%`}
                    </span>
                    <span className="text-xs text-stone-400">
                      (من {Math.round(comparison.baseline.passRate * 100)}% إلى {Math.round(comparison.current.passRate * 100)}%)
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200">
                  <span className="text-xs text-stone-500 font-bold block mb-2">فارق زمن الاستجابة (Latency Δ)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-stone-900 font-mono">
                      {comparison.deltaLatencyMs >= 0 ? `+${comparison.deltaLatencyMs}` : comparison.deltaLatencyMs} ms
                    </span>
                    <span className="text-xs text-stone-400">
                      ({comparison.baseline.avgLatencyMs}ms → {comparison.current.avgLatencyMs}ms)
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200">
                  <span className="text-xs text-stone-500 font-bold block mb-2">فارق استهلاك التوكنز (Tokens Δ)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-stone-900 font-mono">
                      {comparison.deltaTokens >= 0 ? `+${comparison.deltaTokens}` : comparison.deltaTokens}
                    </span>
                    <span className="text-xs text-stone-400">
                      ({comparison.baseline.tokens} → {comparison.current.tokens})
                    </span>
                  </div>
                </div>
              </div>

              {/* Regressed Cases Drawer */}
              {comparison.regressedCases.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-rose-200 space-y-3">
                  <h5 className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>الحالات التي تراجعت (Regressed Cases)</span>
                  </h5>
                  <div className="space-y-2">
                    {comparison.regressedCases.map((rc, i) => (
                      <div key={i} className="p-3 bg-rose-50/60 rounded-xl text-xs text-rose-900 border border-rose-100">
                        <span className="font-bold">حالة رقم #{rc.caseId}:</span> {rc.reason}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improved Cases */}
              {comparison.improvedCases.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-emerald-200 space-y-3">
                  <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>الحالات التي تحسنت (Improved Cases)</span>
                  </h5>
                  <div className="space-y-2">
                    {comparison.improvedCases.map((ic, i) => (
                      <div key={i} className="p-3 bg-emerald-50/60 rounded-xl text-xs text-emerald-900 border border-emerald-100">
                        <span className="font-bold">حالة رقم #{ic.caseId}:</span> {ic.reason}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal: New Suite */}
      {showNewSuiteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl">
            <h4 className="text-sm font-bold text-stone-900">إنشاء حزمة اختبار جديدة (New Test Suite)</h4>
            <form onSubmit={handleCreateSuite} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">اسم الحزمة:</label>
                <input
                  type="text"
                  required
                  value={newSuiteName}
                  onChange={(e) => setNewSuiteName(e.target.value)}
                  placeholder="مثلاً: حزمة أسعار التأشيرات والإقامات"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">الوصف والغرض:</label>
                <textarea
                  rows={3}
                  value={newSuiteDesc}
                  onChange={(e) => setNewSuiteDesc(e.target.value)}
                  placeholder="وصف المعايير المستهدفة في هذه الحزمة..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-teal-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewSuiteModal(false)}
                  className="px-3.5 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl cursor-pointer shadow-xs"
                >
                  إنشاء الحزمة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Case */}
      {showNewCaseModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <h4 className="text-sm font-bold text-stone-900">إضافة حالة اختبار جديدة (New Test Case)</h4>
            <form onSubmit={handleCreateCase} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">السؤال المستهدف (Question):</label>
                <textarea
                  rows={2}
                  required
                  value={newCaseQuestion}
                  onChange={(e) => setNewCaseQuestion(e.target.value)}
                  placeholder="مثلاً: ما هي شروط تمديد تأشيرة الزيارة العائلية؟"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">المسار المتوقع (Expected Route):</label>
                  <select
                    value={newCaseRoute}
                    onChange={(e) => setNewCaseRoute(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-teal-600"
                  >
                    <option value="knowledge_only">قاعدة المعرفة فقط (knowledge_only)</option>
                    <option value="knowledge_then_web">المعرفة ثم الويب (knowledge_then_web)</option>
                    <option value="refuse_insufficient">امتناع لعدم كفاية الأدلة (refuse_insufficient)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">المصدر المتوقع (Expected Source):</label>
                  <select
                    value={newCaseSource}
                    onChange={(e) => setNewCaseSource(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-teal-600"
                  >
                    <option value="darb_knowledge">🟢 دَرْب المعتمدة (darb_knowledge)</option>
                    <option value="web_search">🌐 بحث الويب الموثوق (web_search)</option>
                    <option value="none">⚪ لا مصادر / امتناع (none)</option>
                    <option value="mixed">🔵 مختلط (mixed)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">الحد الأدنى للثقة (Min Confidence):</label>
                  <select
                    value={newCaseConfidence}
                    onChange={(e) => setNewCaseConfidence(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-teal-600"
                  >
                    <option value="supported">مؤكد وموثوق (supported)</option>
                    <option value="limited">محدود (limited)</option>
                    <option value="insufficient">غير كافٍ (insufficient)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">الوسوم (مفصولة بفاصلة):</label>
                  <input
                    type="text"
                    value={newCaseTags}
                    onChange={(e) => setNewCaseTags(e.target.value)}
                    placeholder="تأشيرات, زيارة, رسمي"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-teal-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
                  className="px-3.5 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl cursor-pointer shadow-xs"
                >
                  حفظ الحالة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
