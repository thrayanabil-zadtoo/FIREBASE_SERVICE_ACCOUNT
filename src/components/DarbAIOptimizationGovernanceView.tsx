import React, { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingDown,
  Percent,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  UserCheck,
  Info,
  Calculator,
  Flame,
  BarChart2,
  Scale,
  FileCheck2,
  AlertCircle,
  Copy,
  ChevronRight,
  Zap,
  ArrowDownRight,
  Database
} from "lucide-react";
import {
  OptimizationRecommendation,
  OptimizationSummary,
  OptimizationSnapshot,
  OptimizationAuditRecord,
  OptimizationReviewRecord,
  OptimizationDecision
} from "../types/darb-ai-optimization";

export function DarbAIOptimizationGovernanceView() {
  const [activeSubTab, setActiveSubTab] = useState<
    "overview" | "recommendations" | "token_efficiency" | "burn_rate" | "provider_comparison" | "review_queue" | "audit"
  >("overview");
  const [selectedEnv, setSelectedEnv] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Core Data
  const [summary, setSummary] = useState<OptimizationSummary | null>(null);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [snapshots, setSnapshots] = useState<OptimizationSnapshot[]>([]);
  const [audits, setAudits] = useState<OptimizationAuditRecord[]>([]);
  const [reviews, setReviews] = useState<OptimizationReviewRecord[]>([]);

  // Review Modal State
  const [reviewTarget, setReviewTarget] = useState<OptimizationRecommendation | null>(null);
  const [reviewDecision, setReviewDecision] = useState<OptimizationDecision>("approve");
  const [reviewActor, setReviewActor] = useState<string>("مهندس تحسين الأداء والتكلفة AI Architect");
  const [reviewReason, setReviewReason] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  // New Recommendation Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("prompt_caching");
  const [newEnv, setNewEnv] = useState<string>("production");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newSavingsAmount, setNewSavingsAmount] = useState<number>(0.5);
  const [newSavingsPct, setNewSavingsPct] = useState<number>(20);
  const [newRisk, setNewRisk] = useState<"low" | "medium" | "high">("low");
  const [newActor, setNewActor] = useState<string>("محلل استهلاك الذكاء الاصطناعي");
  const [submittingCreate, setSubmittingCreate] = useState<boolean>(false);

  // Interactive Efficiency Calculator State
  const [calcRequests, setCalcRequests] = useState<number>(2500);
  const [calcInputTokens, setCalcInputTokens] = useState<number>(2200000);
  const [calcOutputTokens, setCalcOutputTokens] = useState<number>(750000);
  const [calcCost, setCalcCost] = useState<number>(2.15);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
  const [scoreEvaluating, setScoreEvaluating] = useState<boolean>(false);

  // Savings Estimator State
  const [savingsCurrentCost, setSavingsCurrentCost] = useState<number>(150);
  const [savingsTargetPercent, setSavingsTargetPercent] = useState<number>(15);
  const [estimatedSavingsOutput, setEstimatedSavingsOutput] = useState<{ percent: number; amount: number } | null>(null);
  const [savingsEstimating, setSavingsEstimating] = useState<boolean>(false);

  // Burn Rate State
  const [burnSpent, setBurnSpent] = useState<number>(68.5);
  const [burnElapsedPercent, setBurnElapsedPercent] = useState<number>(50);
  const [calculatedBurnRate, setCalculatedBurnRate] = useState<number | null>(null);
  const [burnEvaluating, setBurnEvaluating] = useState<boolean>(false);

  // Fetch all data
  const fetchData = async () => {
    try {
      setRefreshing(true);
      const envParam = selectedEnv !== "all" ? `?environment=${selectedEnv}` : "";

      const [sumRes, recRes, snapRes, audRes, revRes] = await Promise.all([
        fetch(`/api/admin/ai/optimization/summary${envParam}`),
        fetch(`/api/admin/ai/optimization/recommendations${envParam}`),
        fetch(`/api/admin/ai/optimization/snapshots${envParam}`),
        fetch(`/api/admin/ai/optimization/audit`),
        fetch(`/api/admin/ai/optimization/reviews`)
      ]);

      if (sumRes.ok) {
        const d = await sumRes.json();
        if (d.ok && d.summary) setSummary(d.summary);
      }
      if (recRes.ok) {
        const d = await recRes.json();
        if (d.ok && d.items) setRecommendations(d.items);
      }
      if (snapRes.ok) {
        const d = await snapRes.json();
        if (d.ok && d.items) setSnapshots(d.items);
      }
      if (audRes.ok) {
        const d = await audRes.json();
        if (d.ok && d.items) setAudits(d.items);
      }
      if (revRes.ok) {
        const d = await revRes.json();
        if (d.ok && d.items) setReviews(d.items);
      }
    } catch (err: any) {
      console.error("Failed to load optimization governance data:", err);
      setFeedback({ type: "error", message: "تعذر تحميل بيانات تحسين الاستهلاك، الرجاء إعادة المحاولة." });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedEnv]);

  // Evaluate Efficiency Score via API
  const handleEvaluateScore = async () => {
    try {
      setScoreEvaluating(true);
      const res = await fetch("/api/admin/ai/optimization/efficiency/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: calcRequests,
          inputTokens: calcInputTokens,
          outputTokens: calcOutputTokens,
          cost: calcCost
        })
      });
      const data = await res.json();
      if (data.ok) {
        setCalculatedScore(data.score);
      }
    } catch (e: any) {
      console.error("Error evaluating score:", e);
    } finally {
      setScoreEvaluating(false);
    }
  };

  // Estimate Savings via API
  const handleEstimateSavings = async () => {
    try {
      setSavingsEstimating(true);
      const res = await fetch("/api/admin/ai/optimization/savings/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentCost: savingsCurrentCost,
          targetPercent: savingsTargetPercent
        })
      });
      const data = await res.json();
      if (data.ok) {
        setEstimatedSavingsOutput(data.result);
      }
    } catch (e: any) {
      console.error("Error estimating savings:", e);
    } finally {
      setSavingsEstimating(false);
    }
  };

  // Evaluate Burn Rate via API
  const handleEvaluateBurnRate = async () => {
    try {
      setBurnEvaluating(true);
      const res = await fetch("/api/admin/ai/optimization/burn-rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spent: burnSpent,
          elapsedPercent: burnElapsedPercent
        })
      });
      const data = await res.json();
      if (data.ok) {
        setCalculatedBurnRate(data.burnRate);
      }
    } catch (e: any) {
      console.error("Error evaluating burn rate:", e);
    } finally {
      setBurnEvaluating(false);
    }
  };

  // Submit Review Decision (Enforces Human in the Loop, No Auto-execution)
  const handleSubmitReview = async () => {
    if (!reviewTarget) return;
    if (!reviewActor.trim() || !reviewReason.trim()) {
      setFeedback({ type: "error", message: "يجب كتابة اسم المسؤول والمبرر التشغيلي قبل اعتماد أو رفض التوصية." });
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await fetch(`/api/admin/ai/optimization/recommendations/${reviewTarget.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision: reviewDecision,
          actor: reviewActor.trim(),
          reason: reviewReason.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setFeedback({
          type: "success",
          message: `تم تسجيل قرار المراجعة بنجاح (${data.status}). تنبيه: القرار يفوض إجراءً يدوياً فقط ولا ينفذ النظام أي تغيير تلقائياً.`
        });
        setReviewTarget(null);
        setReviewReason("");
        await fetchData();
      } else {
        setFeedback({ type: "error", message: data.error || "فشلت عملية حفظ المراجعة." });
      }
    } catch (e: any) {
      setFeedback({ type: "error", message: "حدث خطأ أثناء التواصل مع الخادم." });
    } finally {
      setSubmittingReview(false);
    }
  };

  // Submit New Recommendation
  const handleCreateRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      setFeedback({ type: "error", message: "يرجى ملء عنوان التوصية ووصفها بالكامل." });
      return;
    }

    try {
      setSubmittingCreate(true);
      const res = await fetch("/api/admin/ai/optimization/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          environment: newEnv,
          category: newCategory,
          title: newTitle.trim(),
          description: newDescription.trim(),
          estimatedSavings: newSavingsAmount,
          estimatedSavingsPercent: newSavingsPct,
          riskLevel: newRisk,
          actor: newActor.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setFeedback({ type: "success", message: "تمت إضافة مقترح التحسين إلى قائمة الانتظار للمراجعة البشرية بنجاح." });
        setShowCreateModal(false);
        setNewTitle("");
        setNewDescription("");
        await fetchData();
      } else {
        setFeedback({ type: "error", message: data.error || "تعذر إنشاء مقترح التحسين." });
      }
    } catch (e: any) {
      setFeedback({ type: "error", message: "خطأ في الاتصال بالخادم." });
    } finally {
      setSubmittingCreate(false);
    }
  };

  // Helper formatting
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved_for_manual_action":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3 h-3 text-emerald-600" />
            معتمد لإجراء يدوي
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <X className="w-3 h-3 text-rose-600" />
            مرفوض
          </span>
        );
      case "deferred":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            مؤجل للمراجعة اللاحقة
          </span>
        );
      case "pending_review":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <AlertCircle className="w-3 h-3 text-blue-600" />
            بانتظار المراجعة البشرية
          </span>
        );
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">مخاطرة عالية</span>;
      case "medium":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">مخاطرة متوسطة</span>;
      case "low":
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">مخاطرة منخفضة (آمن)</span>;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "prompt_caching":
        return "تخزين السياق المؤقت (Caching)";
      case "model_rightsizing":
        return "ملاءمة النموذج (Rightsizing)";
      case "context_compression":
        return "ضغط السياق والرموز (Compression)";
      case "batching":
        return "الدفعات المجدولة (Batching)";
      case "budget_cap":
        return "سقف الميزانية";
      default:
        return category;
    }
  };

  // Filter recommendations
  const filteredRecs = recommendations.filter((r) => {
    const matchCategory = selectedCategory === "all" || r.category === selectedCategory;
    const matchSearch =
      !searchQuery.trim() ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.correlationId && r.correlationId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6" dir="rtl" id="darb-ai-optimization-view">
      {/* 1. STRICT GOVERNANCE BANNER */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">حوكمة وتحسين استهلاك الذكاء الاصطناعي V1.30 (AI Optimization)</h2>
                <span className="text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-700/50 px-2 py-0.5 rounded-full font-mono">
                  Active V1.30
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                توليد توصيات استشارية لتحسين النفقات وكفاءة الرموز — لا يتم تطبيق أي توصية تلقائياً ويشترط الاعتماد البشري.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>تحديث البيانات</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>اقتراح تحسين جديد</span>
            </button>
          </div>
        </div>

        {/* Mandatory Policy Badges */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold ml-2">محددات الأمان الصارمة:</span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[11px]">
            AUTO REMEDIATION: <strong className="text-rose-400">OFF</strong>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[11px]">
            AUTO ROLLBACK: <strong className="text-rose-400">OFF</strong>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[11px]">
            AUTO DEPLOY: <strong className="text-rose-400">OFF</strong>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[11px]">
            AUTO SCALING: <strong className="text-rose-400">OFF</strong>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[11px]">
            AUTO OPTIMIZATION APPLY: <strong className="text-rose-400">OFF</strong>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-mono text-[11px]">
            HUMAN APPROVAL: <strong className="text-emerald-400">REQUIRED</strong>
          </span>
        </div>

        <div className="mt-2.5 bg-slate-800/60 rounded-lg p-2.5 text-[11px] text-slate-300 flex items-center gap-2 border border-slate-700/50">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>تأكيد سياسة الحوكمة:</strong> حتى بعد Approval لا ينفذ النظام الإجراء؛ القرار يعني السماح بإجراء يدوي منفصل فقط (No automatic execution).
          </span>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-600 cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab("overview")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === "overview"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>1. نظرة عامة (Overview)</span>
          </button>

          <button
            onClick={() => setActiveSubTab("recommendations")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === "recommendations"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
            <span>2. توصيات تحسين التكلفة ({recommendations.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("token_efficiency")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === "token_efficiency"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <Percent className="w-3.5 h-3.5 text-blue-500" />
            <span>3. كفاءة الرموز (Efficiency)</span>
          </button>

          <button
            onClick={() => setActiveSubTab("burn_rate")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === "burn_rate"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>4. معدل الحرق (Burn Rate)</span>
          </button>

          <button
            onClick={() => setActiveSubTab("provider_comparison")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === "provider_comparison"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-purple-500" />
            <span>5. مقارنة النماذج ({snapshots.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("review_queue")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === "review_queue"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-500" />
            <span>6. مراجعة التوصيات ({recommendations.filter((r) => r.status === "pending_review").length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("audit")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === "audit"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-stone-500" />
            <span>7. سجل التدقيق (Audit)</span>
          </button>
        </div>

        {/* Environment Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">البيئة:</span>
          <select
            value={selectedEnv}
            onChange={(e) => setSelectedEnv(e.target.value)}
            className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">كافة البيئات (All)</option>
            <option value="production">الإنتاج (Production)</option>
            <option value="staging">التجهيز (Staging)</option>
          </select>
        </div>
      </div>

      {/* 3. TAB 1: OVERVIEW */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-semibold">إجمالي الوفر المقترح شهرياً</span>
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-stone-900">
                ${summary?.estimatedSavings?.toFixed(2) ?? "1.82"}
              </div>
              <div className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
                <span>وفراً بنسبة {summary?.estimatedSavingsPercent?.toFixed(1) ?? "21.0"}% من النفقات</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-semibold">معامل كفاءة الرموز (Score)</span>
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-stone-900">
                {summary?.overallEfficiencyScore?.toFixed(3) ?? "0.385"}
              </div>
              <div className="text-xs text-stone-500 mt-1">
                معيار رياضي مركب (Tokens & Cost / Request)
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-semibold">توصيات بانتظار الاعتماد</span>
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-stone-900">
                {summary?.pendingReviews ?? recommendations.filter((r) => r.status === "pending_review").length}
              </div>
              <div className="text-xs text-amber-600 mt-1 font-medium">
                تتطلب مراجعة بشرية ومبرراً موثقاً
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-semibold">معدل الاستهلاك المتوقع (Burn Rate)</span>
                <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                  <Flame className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-stone-900">
                ${summary?.burnRate?.toFixed(2) ?? "3.28"}
              </div>
              <div className="text-xs text-purple-600 mt-1 font-medium">
                توقع نهاية الشهر الحالي
              </div>
            </div>
          </div>

          {/* Quick Recommendations Snapshot */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">أبرز مقترحات التحسين النشطة</h3>
                <p className="text-xs text-stone-500">تم رصدها تلقائياً استناداً إلى أنماط استهلاك الرموز</p>
              </div>
              <button
                onClick={() => setActiveSubTab("recommendations")}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <span>عرض كافة التوصيات</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendations.slice(0, 4).map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-stone-500 bg-stone-200/80 px-2 py-0.5 rounded">
                      {getCategoryLabel(rec.category)}
                    </span>
                    {getStatusBadge(rec.status)}
                  </div>
                  <h4 className="text-xs font-bold text-stone-800 line-clamp-1">{rec.title}</h4>
                  <p className="text-xs text-stone-600 line-clamp-2">{rec.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
                    <span className="text-emerald-700 font-bold">
                      وفـر متوقع: ${Number(rec.estimatedSavings).toFixed(2)} ({rec.estimatedSavingsPercent}%)
                    </span>
                    {getRiskBadge(rec.riskLevel)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Interactive Simulators Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quick Savings Estimator */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-stone-900">حاسبة تقدير الوفر المالي المباشر</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-stone-500 mb-1">الميزانية الحالية ($):</label>
                  <input
                    type="number"
                    value={savingsCurrentCost}
                    onChange={(e) => setSavingsCurrentCost(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">نسبة الوفر المستهدفة (%):</label>
                  <input
                    type="number"
                    value={savingsTargetPercent}
                    onChange={(e) => setSavingsTargetPercent(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1.5"
                  />
                </div>
              </div>
              <button
                onClick={handleEstimateSavings}
                disabled={savingsEstimating}
                className="w-full py-2 bg-stone-900 text-white text-xs font-bold rounded-lg hover:bg-stone-800 transition cursor-pointer"
              >
                {savingsEstimating ? "جارٍ الحساب..." : "احسب الوفر المتوقع"}
              </button>
              {estimatedSavingsOutput && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex justify-between items-center">
                  <span>المبلغ الموفر شهرياً:</span>
                  <strong className="text-sm">${estimatedSavingsOutput.amount.toFixed(2)} ({estimatedSavingsOutput.percent}%)</strong>
                </div>
              )}
            </div>

            {/* Quick Burn Rate Evaluator */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold text-stone-900">حاسبة معدل استهلاك الميزانية (Burn Rate)</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-stone-500 mb-1">المنفق حتى الآن ($):</label>
                  <input
                    type="number"
                    value={burnSpent}
                    onChange={(e) => setBurnSpent(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">النسبة المنقضية من الشهر (%):</label>
                  <input
                    type="number"
                    value={burnElapsedPercent}
                    onChange={(e) => setBurnElapsedPercent(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1.5"
                  />
                </div>
              </div>
              <button
                onClick={handleEvaluateBurnRate}
                disabled={burnEvaluating}
                className="w-full py-2 bg-stone-900 text-white text-xs font-bold rounded-lg hover:bg-stone-800 transition cursor-pointer"
              >
                {burnEvaluating ? "جارٍ التقدير..." : "تقدير إجمالي نهاية الشهر"}
              </button>
              {calculatedBurnRate !== null && (
                <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 flex justify-between items-center">
                  <span>الاستهلاك المتوقع لنهاية الدورة:</span>
                  <strong className="text-sm">${calculatedBurnRate.toFixed(2)}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: RECOMMENDATIONS */}
      {activeSubTab === "recommendations" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="ابحث بالاسم، الوصف، أو رقم التتبع Correlation ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs text-stone-800 placeholder-stone-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">التصنيف:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-700 font-medium"
              >
                <option value="all">كافة التصنيفات</option>
                <option value="prompt_caching">تخزين السياق المؤقت</option>
                <option value="model_rightsizing">ملاءمة النموذج</option>
                <option value="context_compression">ضغط السياق</option>
                <option value="batching">الدفعات المجدولة</option>
              </select>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="space-y-3">
            {filteredRecs.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-stone-500 text-xs">
                لا توجد توصيات مطابقة لمعايير البحث الحالية.
              </div>
            ) : (
              filteredRecs.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white rounded-xl border border-stone-200 p-5 hover:border-emerald-300 transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                        #{rec.id}
                      </span>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        {getCategoryLabel(rec.category)}
                      </span>
                      <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                        {rec.environment}
                      </span>
                      {getStatusBadge(rec.status)}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {getRiskBadge(rec.riskLevel)}
                      {rec.correlationId && (
                        <span className="font-mono text-[11px] text-stone-400 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded">
                          {rec.correlationId}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-stone-900">{rec.title}</h3>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{rec.description}</p>
                  </div>

                  {/* Evidence & Metrics */}
                  {rec.evidenceMetrics && (
                    <div className="bg-stone-50 rounded-lg p-3 border border-stone-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      {rec.evidenceMetrics.currentTpm && (
                        <div>
                          <span className="text-stone-400 block">الاستهلاك الحالي (TPM):</span>
                          <span className="font-bold text-stone-800">{rec.evidenceMetrics.currentTpm.toLocaleString()}</span>
                        </div>
                      )}
                      {rec.evidenceMetrics.potentialTpm && (
                        <div>
                          <span className="text-stone-400 block">المتوقع بعد التطبيق (TPM):</span>
                          <span className="font-bold text-emerald-600">{rec.evidenceMetrics.potentialTpm.toLocaleString()}</span>
                        </div>
                      )}
                      {rec.evidenceMetrics.tokenReduction && (
                        <div>
                          <span className="text-stone-400 block">وفر الرموز الشهري:</span>
                          <span className="font-bold text-stone-800">{rec.evidenceMetrics.tokenReduction.toLocaleString()}</span>
                        </div>
                      )}
                      {rec.evidenceMetrics.observedModel && (
                        <div>
                          <span className="text-stone-400 block">النموذج المرصود:</span>
                          <span className="font-bold text-purple-700">{rec.evidenceMetrics.observedModel}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-stone-500">الوفر المالي المتوقع: </span>
                        <strong className="text-emerald-700 text-sm font-bold">
                          ${Number(rec.estimatedSavings).toFixed(2)} ({rec.estimatedSavingsPercent}%)
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setReviewTarget(rec);
                          setReviewDecision("approve");
                        }}
                        className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>اتخاذ قرار المراجعة (Review)</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. TAB 3: TOKEN EFFICIENCY ANALYSIS */}
      {activeSubTab === "token_efficiency" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">معيار كفاءة الرموز الرياضي (Efficiency Metric Engine)</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  يتم احتساب المعيار وفق المعادلة: <code>Score = 1 / (1 + (Tokens / Request) / 1000 + (Cost / Request) * 100)</code>
                </p>
              </div>
            </div>

            {/* Interactive Calculator */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
              <h4 className="text-xs font-bold text-stone-800">حاسبة تقييم كفاءة الرموز المباشرة:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 mb-1">عدد الطلبات (Requests):</label>
                  <input
                    type="number"
                    value={calcRequests}
                    onChange={(e) => setCalcRequests(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">رموز الإدخال (Input Tokens):</label>
                  <input
                    type="number"
                    value={calcInputTokens}
                    onChange={(e) => setCalcInputTokens(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">رموز الإخراج (Output Tokens):</label>
                  <input
                    type="number"
                    value={calcOutputTokens}
                    onChange={(e) => setCalcOutputTokens(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">التكلفة الإجمالية ($):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={calcCost}
                    onChange={(e) => setCalcCost(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleEvaluateScore}
                  disabled={scoreEvaluating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  {scoreEvaluating ? "جارٍ التقييم..." : "احسب مؤشر الكفاءة"}
                </button>

                {calculatedScore !== null && (
                  <div className="text-xs flex items-center gap-2">
                    <span className="text-stone-600">نتيجة الكفاءة:</span>
                    <span className="text-base font-bold text-blue-700 font-mono bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
                      {calculatedScore}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Analysis details */}
            <div className="border-t border-stone-100 pt-4 text-xs text-stone-600 space-y-2">
              <h4 className="font-bold text-stone-800">قواعد تفسير مؤشر الكفاءة:</h4>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-600">
                <li>المؤشرات <strong>أعلى من 0.400</strong>: كفاءة استهلاك عالية واستهداف ممتاز لعدد الرموز بالطلب الواحد.</li>
                <li>المؤشرات <strong>بين 0.250 و 0.400</strong>: كفاءة نموذجية مع إمكانية تحسين التخزين المؤقت للسياق المتكرر.</li>
                <li>المؤشرات <strong>أقل من 0.250</strong>: استهلاك مفرط للرموز أو استخدام نماذج غير ملائمة للمهام البسيطة.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 4: BURN RATE ANALYSIS */}
      {activeSubTab === "burn_rate" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">تحليل معدل حرق الميزانية (Budget Burn-Rate Analysis)</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  رصد ومحاكاة وتيرة استهلاك الميزانية المخصصة للدورة الشهرية لتفادي تجاوز السقوف التشغيلية.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <span className="text-stone-500 block mb-1">الإنفاق الفعلي المسجل:</span>
                <span className="text-xl font-bold text-stone-900">${summary?.currentMonthSpend?.toFixed(2) ?? "2.19"}</span>
                <p className="text-[11px] text-stone-500 mt-1">خلال أول 20 يوماً من الدورة الحالية</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <span className="text-stone-500 block mb-1">المعدل المحسوب لنهاية الشهر:</span>
                <span className="text-xl font-bold text-purple-700">${summary?.burnRate?.toFixed(2) ?? "3.28"}</span>
                <p className="text-[11px] text-purple-600 mt-1">ضمن النطاق الآمن (أقل من سقف $150)</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <span className="text-stone-500 block mb-1">معدل التوفير بعد التوصيات:</span>
                <span className="text-xl font-bold text-emerald-600">
                  ${((summary?.burnRate || 3.28) - (summary?.estimatedSavings || 1.82)).toFixed(2)}
                </span>
                <p className="text-[11px] text-emerald-600 mt-1">حال اعتماد وتطبيق التوصيات يدوياً</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB 5: PROVIDER / MODEL COMPARISON */}
      {activeSubTab === "provider_comparison" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">مقارنة كفاءة النماذج والمزودين (Model Efficiency Snapshots)</h3>
                <p className="text-xs text-stone-500">لقطات استهلاك ومقارنة الأداء بين النماذج المشغلة في درب</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                    <th className="py-2.5 px-3 font-semibold">المزود والنموذج</th>
                    <th className="py-2.5 px-3 font-semibold">البيئة</th>
                    <th className="py-2.5 px-3 font-semibold">الطلبات</th>
                    <th className="py-2.5 px-3 font-semibold">رموز الإدخال</th>
                    <th className="py-2.5 px-3 font-semibold">رموز الإخراج</th>
                    <th className="py-2.5 px-3 font-semibold">التكلفة</th>
                    <th className="py-2.5 px-3 font-semibold">مؤشر الكفاءة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {snapshots.map((s) => (
                    <tr key={s.id} className="hover:bg-stone-50/60 transition">
                      <td className="py-2.5 px-3 font-bold text-stone-800">
                        <div className="flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-stone-400" />
                          <span>{s.model}</span>
                          <span className="text-[10px] text-stone-400 font-normal">({s.provider})</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[11px]">
                          {s.environment}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-700">{s.requests.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono text-stone-600">{s.inputTokens.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono text-stone-600">{s.outputTokens.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-bold text-stone-900">${s.estimatedCost.toFixed(2)}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {s.efficiencyScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB 6: REVIEW QUEUE */}
      {activeSubTab === "review_queue" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">طابور المراجعة والاعتماد البشري (Human Approval Queue)</h3>
              <p className="text-xs text-stone-500">
                التوصيات التي تتطلب قراراً بشرياً صريحاً موثقاً بالمسؤول والمبرر. الموافقة تفوض إجراءً يدوياً فقط.
              </p>
            </div>

            <div className="space-y-3">
              {recommendations.filter((r) => r.status === "pending_review").length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-xl text-xs text-stone-500">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                  لا توجد توصيات معلقة في طابور المراجعة حالياً.
                </div>
              ) : (
                recommendations
                  .filter((r) => r.status === "pending_review")
                  .map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-stone-700 bg-white px-2 py-0.5 rounded border border-stone-200">
                            #{rec.id}
                          </span>
                          <span className="text-xs font-bold text-stone-800">{rec.title}</span>
                        </div>
                        {getRiskBadge(rec.riskLevel)}
                      </div>
                      <p className="text-xs text-stone-600">{rec.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-amber-100 text-xs">
                        <span className="text-emerald-700 font-bold">
                          الوفر المقترح: ${rec.estimatedSavings} ({rec.estimatedSavingsPercent}%)
                        </span>
                        <button
                          onClick={() => {
                            setReviewTarget(rec);
                            setReviewDecision("approve");
                          }}
                          className="px-3.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition cursor-pointer"
                        >
                          مراجعة واعتماد يدوي
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 9. TAB 7: AUDIT TRAIL */}
      {activeSubTab === "audit" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">سجل التدقيق والموافقات (AI Optimization Audit Trail)</h3>
              <p className="text-xs text-stone-500">سجل غير قابل للتعديل يوثق كافة القرارات البشرية وأرقام الارتباط</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                    <th className="py-2.5 px-3 font-semibold">الوقت</th>
                    <th className="py-2.5 px-3 font-semibold">الإجراء</th>
                    <th className="py-2.5 px-3 font-semibold">المسؤول</th>
                    <th className="py-2.5 px-3 font-semibold">المبرر التشغيلي</th>
                    <th className="py-2.5 px-3 font-semibold">رقم التتبع (Correlation ID)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {audits.map((a) => (
                    <tr key={a.id} className="hover:bg-stone-50/60 transition">
                      <td className="py-2.5 px-3 text-stone-500 whitespace-nowrap">
                        {new Date(a.createdAt).toLocaleString("ar-EG")}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-stone-800">
                        <span className="bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                          {a.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-700">{a.actor || "system"}</td>
                      <td className="py-2.5 px-3 text-stone-600 max-w-xs truncate">{a.reason || "—"}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-stone-400">{a.correlationId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: REVIEW DECISION MODAL */}
      {reviewTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-stone-200" dir="rtl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-stone-900">مراجعة مقترح التحسين #{reviewTarget.id}</h3>
              </div>
              <button
                onClick={() => setReviewTarget(null)}
                className="text-stone-400 hover:text-stone-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-stone-50 rounded-lg p-3 text-xs space-y-1 border border-stone-200">
              <span className="font-bold text-stone-800 block">{reviewTarget.title}</span>
              <p className="text-stone-600">{reviewTarget.description}</p>
              <div className="pt-2 flex justify-between text-[11px] text-emerald-700 font-semibold border-t border-stone-200/60 mt-2">
                <span>الوفر المتوقع: ${reviewTarget.estimatedSavings} ({reviewTarget.estimatedSavingsPercent}%)</span>
                <span>المخاطرة: {reviewTarget.riskLevel}</span>
              </div>
            </div>

            {/* Strict Notice */}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>تذكير بالحوكمة:</strong> الموافقة تعني فقط تفويض تغيير يدوي منفصل من قبل المهندس المختص. لن يقوم النظام بتعديل أي بارامتر أو كود آلياً.
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">القرار (Decision):</label>
                <select
                  value={reviewDecision}
                  onChange={(e) => setReviewDecision(e.target.value as OptimizationDecision)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="approve">اعتماد للتنفيذ اليدوي (Approved for manual action)</option>
                  <option value="reject">رفض المقترح (Reject)</option>
                  <option value="defer">تأجيل للدراسة (Defer)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">المسؤول (Actor - مطلوب):</label>
                <input
                  type="text"
                  value={reviewActor}
                  onChange={(e) => setReviewActor(e.target.value)}
                  placeholder="مثال: admin@darb.app أو مهندس البنية التحتية"
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">المبرر التشغيلي (Reason - مطلوب):</label>
                <textarea
                  rows={3}
                  value={reviewReason}
                  onChange={(e) => setReviewReason(e.target.value)}
                  placeholder="وضح سبب الاعتماد أو الرفض استناداً لدراسة الأثر على دقة الإجابات أو زمن الاستجابة..."
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setReviewTarget(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                {submittingReview ? "جارٍ الحفظ..." : "تسجيل القرار رسمياً"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE RECOMMENDATION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-stone-200" dir="rtl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-stone-900">اقتراح تحسين استهلاك جديد</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRecommendation} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">عنوان المقترح:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: تفعيل التخزين المؤقت لاستعلامات نظام العمل"
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">التصنيف:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="prompt_caching">تخزين السياق المؤقت</option>
                    <option value="model_rightsizing">ملاءمة فئة النموذج</option>
                    <option value="context_compression">ضغط وتقليص الرموز</option>
                    <option value="batching">تجميع في دفعات مسائية</option>
                    <option value="budget_cap">سقف الميزانية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">البيئة المستهدفة:</label>
                  <select
                    value={newEnv}
                    onChange={(e) => setNewEnv(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="production">الإنتاج (Production)</option>
                    <option value="staging">التجهيز (Staging)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">الوصف والأدلة الميدانية:</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="اشرح آلية التوفير، نسبة الرموز المتكررة، وأثر التغيير على الجودة..."
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">الوفر المقدر ($):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSavingsAmount}
                    onChange={(e) => setNewSavingsAmount(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">نسبة الوفر (%):</label>
                  <input
                    type="number"
                    value={newSavingsPct}
                    onChange={(e) => setNewSavingsPct(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">مستوى المخاطرة:</label>
                  <select
                    value={newRisk}
                    onChange={(e) => setNewRisk(e.target.value as any)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-2 py-1.5 text-xs"
                  >
                    <option value="low">منخفضة (آمن)</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">صاحب المقترح (المسؤول):</label>
                <input
                  type="text"
                  value={newActor}
                  onChange={(e) => setNewActor(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submittingCreate}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  {submittingCreate ? "جارٍ الإضافة..." : "حفظ في قائمة المراجعة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
