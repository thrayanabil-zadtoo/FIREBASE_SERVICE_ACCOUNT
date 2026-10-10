import React, { useState, useEffect } from "react";
import {
  LifeBuoy,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  RefreshCw,
  Search,
  UserCheck,
  X,
  Copy,
  Check,
  Activity,
  Flame,
  ShieldCheck,
  ArrowRight,
  History,
  ShieldAlert,
  Sliders,
  Send,
  Lock,
  ChevronDown
} from "lucide-react";
import {
  Incident,
  IncidentStatus,
  IncidentSeverity,
  RecoveryPlan,
  IncidentEvent,
  PostIncidentReview,
  IncidentAudit,
  IncidentSummaryData
} from "../types/darb-ai-incident-recovery";

export function DarbAIIncidentRecoveryManagerView() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [recoveryPlans, setRecoveryPlans] = useState<RecoveryPlan[]>([]);
  const [reviews, setReviews] = useState<PostIncidentReview[]>([]);
  const [audits, setAudits] = useState<IncidentAudit[]>([]);
  const [summary, setSummary] = useState<IncidentSummaryData | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<"incidents" | "recovery_plans" | "pir" | "audit">("incidents");
  const [selectedEnv, setSelectedEnv] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals
  const [showNewIncidentModal, setShowNewIncidentModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newSeverity, setNewSeverity] = useState<IncidentSeverity>("warning");
  const [newEnv, setNewEnv] = useState<string>("production");
  const [newOwner, setNewOwner] = useState<string>("فريق الموثوقية SRE");
  const [newNote, setNewNote] = useState<string>("");

  // Incident Details & Events Modal
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [incidentEvents, setIncidentEvents] = useState<IncidentEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);

  // Status Transition Modal
  const [showTransitionModal, setShowTransitionModal] = useState<boolean>(false);
  const [targetStatus, setTargetStatus] = useState<IncidentStatus>("investigating");
  const [transitionActor, setTransitionActor] = useState<string>("مشرف العمليات");
  const [transitionReason, setTransitionReason] = useState<string>("");

  // Closure Gate Modal
  const [showClosureModal, setShowClosureModal] = useState<boolean>(false);
  const [closureIncident, setClosureIncident] = useState<Incident | null>(null);
  const [rootCauseInput, setRootCauseInput] = useState<string>("");
  const [remediationActionsInput, setRemediationActionsInput] = useState<string>("");
  const [closureActor, setClosureActor] = useState<string>("مدير الموثوقية والحوكمة");
  const [closureError, setClosureError] = useState<string | null>(null);

  // New Recovery Plan Modal
  const [showNewPlanModal, setShowNewPlanModal] = useState<boolean>(false);
  const [planIncidentId, setPlanIncidentId] = useState<number | string>("");
  const [planTitle, setPlanTitle] = useState<string>("");
  const [planSteps, setPlanSteps] = useState<string>("");
  const [planRisk, setPlanRisk] = useState<"low" | "medium" | "high">("medium");

  // Plan Approval Modal
  const [showApprovePlanModal, setShowApprovePlanModal] = useState<boolean>(false);
  const [approvingPlan, setApprovingPlan] = useState<RecoveryPlan | null>(null);
  const [approverName, setApproverName] = useState<string>("م. أنس المنصور (Tech Lead)");
  const [approvalReason, setApprovalReason] = useState<string>("موافقة صريحة على خطة التعافي بعد مراجعة المخاطر");

  // Plan Execution Modal
  const [showExecutePlanModal, setShowExecutePlanModal] = useState<boolean>(false);
  const [executingPlan, setExecutingPlan] = useState<RecoveryPlan | null>(null);
  const [executorName, setExecutorName] = useState<string>("مشغل العمليات السحابية");
  const [executionNotes, setExecutionNotes] = useState<string>("تم تطبيق الخطوات ومراجعة استقرار الخدمة");

  // Post Incident Review Modal
  const [showNewReviewModal, setShowNewReviewModal] = useState<boolean>(false);
  const [reviewIncidentId, setReviewIncidentId] = useState<number | string>("");
  const [reviewSummary, setReviewSummary] = useState<string>("");
  const [reviewRootCause, setReviewRootCause] = useState<string>("");
  const [reviewContributing, setReviewContributing] = useState<string>("");
  const [reviewRemediation, setReviewRemediation] = useState<string>("");
  const [reviewPrevention, setReviewPrevention] = useState<string>("");
  const [reviewOwner, setReviewOwner] = useState<string>("مهندس الموثوقية SRE");
  const [reviewApprover, setReviewApprover] = useState<string>("مدير الجودة والعمليات");

  // Notification / Toast feedback
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [incRes, plansRes, sumRes, reviewsRes, auditRes] = await Promise.all([
        fetch(`/api/admin/ai/incident-recovery/incidents?environment=${selectedEnv}&severity=${selectedSeverity}`),
        fetch("/api/admin/ai/incident-recovery/recovery-plans"),
        fetch(`/api/admin/ai/incident-recovery/summary?environment=${selectedEnv}`),
        fetch("/api/admin/ai/incident-recovery/reviews"),
        fetch("/api/admin/ai/incident-recovery/audit"),
      ]);

      if (incRes.ok) {
        const d = await incRes.json();
        setIncidents(d.items || []);
      }
      if (plansRes.ok) {
        const d = await plansRes.json();
        setRecoveryPlans(d.items || []);
      }
      if (sumRes.ok) {
        const d = await sumRes.json();
        setSummary(d.summary || null);
      }
      if (reviewsRes.ok) {
        const d = await reviewsRes.json();
        setReviews(d.items || []);
      }
      if (auditRes.ok) {
        const d = await auditRes.json();
        setAudits(d.items || []);
      }
    } catch (err) {
      console.error("Failed to load incident recovery data:", err);
      setNotice({ type: "error", text: "تعذر تحميل بيانات الحوادث والتعافي" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [selectedEnv, selectedSeverity]);

  const copyToClipboard = (text: string, idKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idKey);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenIncidentDetails = async (inc: Incident) => {
    setSelectedIncident(inc);
    setLoadingEvents(true);
    try {
      const res = await fetch(`/api/admin/ai/incident-recovery/incidents/${inc.id}/events`);
      if (res.ok) {
        const d = await res.json();
        setIncidentEvents(d.items || []);
      }
    } catch (err) {
      console.error("Error fetching incident events:", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch("/api/admin/ai/incident-recovery/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          severity: newSeverity,
          environment: newEnv,
          owner: newOwner.trim(),
          note: newNote.trim(),
        }),
      });

      if (res.ok) {
        setNotice({ type: "success", text: "تم تسجيل الحادث التشغيلي الجديد بنجاح" });
        setShowNewIncidentModal(false);
        setNewTitle("");
        setNewNote("");
        fetchAllData();
      } else {
        const err = await res.json();
        setNotice({ type: "error", text: err.error || "فشل تسجيل الحادث" });
      }
    } catch (err) {
      setNotice({ type: "error", text: "حدث خطأ في الاتصال بالخادم" });
    }
  };

  const handleTransitionStatus = async () => {
    if (!selectedIncident) return;
    try {
      const res = await fetch(`/api/admin/ai/incident-recovery/incidents/${selectedIncident.id}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: targetStatus,
          actor: transitionActor,
          reason: transitionReason || `تحديث حالة الحادث إلى ${targetStatus}`,
        }),
      });

      if (res.ok) {
        const d = await res.json();
        setNotice({ type: "success", text: `تم تحديث مسار الحادث إلى ${targetStatus} بنجاح` });
        setShowTransitionModal(false);
        setSelectedIncident(d.incident);
        fetchAllData();
      } else {
        const err = await res.json();
        setNotice({ type: "error", text: err.error || "تعذر تغيير حالة الحادث" });
      }
    } catch (err) {
      setNotice({ type: "error", text: "خطأ أثناء محاولة تحديث حالة الحادث" });
    }
  };

  const handleCloseIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!closureIncident) return;
    setClosureError(null);

    if (!rootCauseInput.trim() || !remediationActionsInput.trim()) {
      setClosureError("السبب الجذري (RCA) وخطة الإجراءات التصحيحية إلزاميان لإغلاق الحادث وفق ضوابط الحوكمة.");
      return;
    }

    try {
      const res = await fetch(`/api/admin/ai/incident-recovery/incidents/${closureIncident.id}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rootCause: rootCauseInput.trim(),
          remediationActions: remediationActionsInput.trim(),
          actor: closureActor,
          reason: "استيفاء بوابة إغلاق الحوادث وتوثيق التحليل الجذري",
        }),
      });

      if (res.ok) {
        setNotice({ type: "success", text: "تم إغلاق الحادث واعتماد التحليل الجذري والإجراءات التصحيحية بنجاح" });
        setShowClosureModal(false);
        setRootCauseInput("");
        setRemediationActionsInput("");
        if (selectedIncident && selectedIncident.id === closureIncident.id) {
          setSelectedIncident(null);
        }
        fetchAllData();
      } else {
        const err = await res.json();
        setClosureError(err.error || "فشل إغلاق الحادث");
      }
    } catch (err) {
      setClosureError("خطأ في الاتصال بالخادم");
    }
  };

  const handleCreateRecoveryPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planIncidentId || !planTitle.trim()) return;

    const stepLines = planSteps
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/admin/ai/incident-recovery/incidents/${planIncidentId}/recovery-plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: planTitle.trim(),
          steps: stepLines,
          riskLevel: planRisk,
          author: "مشرف العمليات",
        }),
      });

      if (res.ok) {
        setNotice({ type: "success", text: "تم إنشاء مسودة خطة التعافي الجديدة بنجاح" });
        setShowNewPlanModal(false);
        setPlanTitle("");
        setPlanSteps("");
        fetchAllData();
      } else {
        const err = await res.json();
        setNotice({ type: "error", text: err.error || "فشل إنشاء خطة التعافي" });
      }
    } catch (err) {
      setNotice({ type: "error", text: "خطأ في الاتصال بالخادم" });
    }
  };

  const handleApprovePlan = async () => {
    if (!approvingPlan) return;
    try {
      const res = await fetch(`/api/admin/ai/incident-recovery/recovery-plans/${approvingPlan.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvedBy: approverName.trim(),
          reason: approvalReason.trim(),
        }),
      });

      if (res.ok) {
        setNotice({ type: "success", text: `تم اعتماد خطة التعافي #${approvingPlan.id} بواسطة ${approverName}` });
        setShowApprovePlanModal(false);
        setApprovingPlan(null);
        fetchAllData();
      } else {
        const err = await res.json();
        setNotice({ type: "error", text: err.error || "فشل اعتماد الخطة" });
      }
    } catch (err) {
      setNotice({ type: "error", text: "خطأ في الاتصال بالخادم" });
    }
  };

  const handleExecutePlan = async () => {
    if (!executingPlan) return;
    try {
      const res = await fetch(`/api/admin/ai/incident-recovery/recovery-plans/${executingPlan.id}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          executedBy: executorName.trim(),
          notes: executionNotes.trim(),
          reason: "تنفيذ يدوي بشري لخطوات خطة التعافي المعتمدة",
        }),
      });

      if (res.ok) {
        setNotice({ type: "success", text: `تم تنفيذ خطة التعافي #${executingPlan.id} يدوياً بنجاح` });
        setShowExecutePlanModal(false);
        setExecutingPlan(null);
        fetchAllData();
      } else {
        const err = await res.json();
        setNotice({ type: "error", text: err.error || "فشل تنفيذ الخطة" });
      }
    } catch (err) {
      setNotice({ type: "error", text: "خطأ في الاتصال بالخادم" });
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewIncidentId || !reviewSummary.trim()) return;

    try {
      const res = await fetch(`/api/admin/ai/incident-recovery/incidents/${reviewIncidentId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: reviewSummary.trim(),
          root_cause: reviewRootCause.trim(),
          contributing_factors: reviewContributing.trim(),
          remediation_actions: reviewRemediation.trim(),
          prevention_actions: reviewPrevention.trim(),
          owner: reviewOwner.trim(),
          approved_by: reviewApprover.trim() || null,
        }),
      });

      if (res.ok) {
        setNotice({ type: "success", text: "تم تسجيل تقرير المراجعة اللاحقة (PIR) بنجاح" });
        setShowNewReviewModal(false);
        setReviewSummary("");
        setReviewRootCause("");
        setReviewContributing("");
        setReviewRemediation("");
        setReviewPrevention("");
        fetchAllData();
      } else {
        const err = await res.json();
        setNotice({ type: "error", text: err.error || "فشل حفظ المراجعة" });
      }
    } catch (err) {
      setNotice({ type: "error", text: "خطأ في الاتصال بالخادم" });
    }
  };

  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case "critical":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">حرج (Critical)</span>;
      case "warning":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">تحذيري (Warning)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">معلوماتي (Info)</span>;
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case "detected":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">مرصود (Detected)</span>;
      case "investigating":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">قيد التحقيق (Investigating)</span>;
      case "mitigating":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">قيد التخفيف (Mitigating)</span>;
      case "resolved":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">تم الحل (Resolved)</span>;
      case "closed":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">مغلق رسمياً (Closed)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700">{status}</span>;
    }
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = inc.title.toLowerCase().includes(q);
      const matchKey = (inc.incident_key || inc.incidentKey || "").toLowerCase().includes(q);
      const matchOwner = (inc.owner || "").toLowerCase().includes(q);
      if (!matchTitle && !matchKey && !matchOwner) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 text-stone-800 font-sans" dir="rtl">
      {/* 1. Governance & Protocol Banner */}
      <div className="bg-stone-900 text-stone-100 p-4 rounded-2xl border border-stone-800 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
              <LifeBuoy className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-stone-100">DARB AI V1.28 — إدارة الحوادث والتعافي (Incident & Recovery)</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Human-in-the-Loop
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                دورة حياة الحوادث الشاملة، قياس MTTA/MTTR، خطط التعافي المعتمدة، وبوابة إغلاق الحوادث المشروطة بـ RCA.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-semibold">
            <span className="px-2.5 py-1 bg-stone-800 rounded-lg text-rose-300 border border-stone-700">
              Auto-Remediation: <strong className="text-rose-400">OFF</strong>
            </span>
            <span className="px-2.5 py-1 bg-stone-800 rounded-lg text-rose-300 border border-stone-700">
              Auto-Rollback: <strong className="text-rose-400">OFF</strong>
            </span>
            <span className="px-2.5 py-1 bg-stone-800 rounded-lg text-rose-300 border border-stone-700">
              Auto-Deploy: <strong className="text-rose-400">OFF</strong>
            </span>
            <span className="px-2.5 py-1 bg-emerald-900/60 rounded-lg text-emerald-300 border border-emerald-700/50 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Human Approval: <strong>REQUIRED</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div
          className={`p-3 rounded-xl flex items-center justify-between text-xs font-semibold ${
            notice.type === "success" ? "bg-emerald-50 text-emerald-900 border border-emerald-200" : "bg-rose-50 text-rose-900 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
            <span>{notice.text}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Top Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">الحوادث المفتوحة</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-stone-900">{summary?.openCount ?? 0}</div>
          <div className="text-[11px] text-stone-400 mt-1">قيد الرصد والتحقيق والتخفيف</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">متوسط الاستلام (MTTA)</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {summary?.avgMttaMinutes ?? 0} <span className="text-xs font-normal text-stone-500">دقيقة</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Mean Time to Acknowledge</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">متوسط التعافي (MTTR)</span>
            <Activity className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {summary?.avgMttrMinutes ?? 0} <span className="text-xs font-normal text-stone-500">دقيقة</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Mean Time to Resolve</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">خطط قيد الاعتماد</span>
            <ShieldAlert className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-stone-900">{summary?.pendingApprovalPlansCount ?? 0}</div>
          <div className="text-[11px] text-stone-400 mt-1">تتطلب مراجعة واعتماد بشري</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">إجمالي الحوادث</span>
            <FileText className="w-4 h-4 text-stone-500" />
          </div>
          <div className="text-2xl font-black text-stone-900">{summary?.totalIncidents ?? 0}</div>
          <div className="text-[11px] text-stone-400 mt-1">سجل البيئة المختارة</div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs & Actions */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab("incidents")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === "incidents" ? "bg-stone-900 text-white shadow-xs" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <Flame className="w-4 h-4 text-rose-400" />
            <span>الحوادث النشطة ودورة الحياة ({incidents.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("recovery_plans")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === "recovery_plans" ? "bg-stone-900 text-white shadow-xs" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>خطط التعافي وإجراءات الاستعادة ({recoveryPlans.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("pir")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === "pir" ? "bg-stone-900 text-white shadow-xs" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>المراجعة اللاحقة للحوادث (PIR) ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("audit")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === "audit" ? "bg-stone-900 text-white shadow-xs" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <History className="w-4 h-4 text-teal-400" />
            <span>سجل التدقيق والحوكمة ({audits.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAllData}
            disabled={loading}
            className="p-2 text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          {activeSubTab === "incidents" && (
            <button
              onClick={() => setShowNewIncidentModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل حادث جديد</span>
            </button>
          )}

          {activeSubTab === "recovery_plans" && (
            <button
              onClick={() => {
                if (incidents.length > 0) setPlanIncidentId(incidents[0].id);
                setShowNewPlanModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء خطة تعافٍ</span>
            </button>
          )}

          {activeSubTab === "pir" && (
            <button
              onClick={() => {
                const closedOrRes = incidents.find((i) => i.status === "closed" || i.status === "resolved");
                if (closedOrRes) setReviewIncidentId(closedOrRes.id);
                setShowNewReviewModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-700 text-white rounded-xl text-xs font-bold hover:bg-amber-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>صياغة تقرير PIR</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Filter & Search Controls (for Incidents tab) */}
      {activeSubTab === "incidents" && (
        <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">البيئة:</span>
              <select
                value={selectedEnv}
                onChange={(e) => setSelectedEnv(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-700 focus:outline-hidden"
              >
                <option value="all">كل البيئات</option>
                <option value="production">الإنتاج (Production)</option>
                <option value="staging">التجهيز (Staging)</option>
                <option value="development">التطوير (Development)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">مستوى الخطورة:</span>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-700 focus:outline-hidden"
              >
                <option value="all">كل المستويات</option>
                <option value="critical">حرج (Critical)</option>
                <option value="warning">تحذيري (Warning)</option>
                <option value="info">معلوماتي (Info)</option>
              </select>
            </div>
          </div>

          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="بحث بالعنوان، المعرف أو المسؤول..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-2.5 top-2" />
          </div>
        </div>
      )}

      {/* 5. Content View 1: Incidents List */}
      {activeSubTab === "incidents" && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-stone-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-300" />
              جارٍ تحميل سجل الحوادث التشغيلية...
            </div>
          ) : filteredIncidents.length === 0 ? (
            <div className="p-12 text-center text-stone-500 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              لا توجد حوادث مسجلة مطابقة للمعايير المحددة حالياً. النظام مستقر.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 font-bold">
                  <tr>
                    <th className="p-3">المعرف</th>
                    <th className="p-3">عنوان الحادث</th>
                    <th className="p-3">الخطورة</th>
                    <th className="p-3">الحالة التشغيلية</th>
                    <th className="p-3">البيئة</th>
                    <th className="p-3">زمن الاستلام / التعافي</th>
                    <th className="p-3">المسؤول</th>
                    <th className="p-3">معرف التتبع</th>
                    <th className="p-3 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredIncidents.map((inc) => {
                    const incKey = inc.incident_key || inc.incidentKey || `INC-${inc.id}`;
                    const corrId = inc.correlation_id || inc.correlationId || "N/A";
                    return (
                      <tr key={inc.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-stone-700">{incKey}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleOpenIncidentDetails(inc)}
                            className="font-bold text-stone-900 hover:text-rose-600 text-right cursor-pointer"
                          >
                            {inc.title}
                          </button>
                        </td>
                        <td className="p-3">{getSeverityBadge(inc.severity)}</td>
                        <td className="p-3">{getStatusBadge(inc.status)}</td>
                        <td className="p-3 font-mono text-[11px] text-stone-600">{inc.environment}</td>
                        <td className="p-3 text-stone-600">
                          <div>
                            MTTA: {inc.mttaMs ? `${Math.round(inc.mttaMs / 60000)} د` : "—"}
                          </div>
                          <div className="text-[11px] text-stone-400">
                            MTTR: {inc.mttrMs ? `${Math.round(inc.mttrMs / 60000)} د` : "—"}
                          </div>
                        </td>
                        <td className="p-3 text-stone-600">{inc.owner || "غير معين"}</td>
                        <td className="p-3">
                          <button
                            onClick={() => copyToClipboard(corrId, `corr-${inc.id}`)}
                            className="flex items-center gap-1 font-mono text-[10px] text-stone-500 hover:text-stone-800 bg-stone-100 px-2 py-1 rounded-lg cursor-pointer"
                            title="نسخ معرف التتبع"
                          >
                            <span>{corrId.slice(0, 14)}...</span>
                            {copiedId === `corr-${inc.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </td>
                        <td className="p-3 text-left">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenIncidentDetails(inc)}
                              className="px-2.5 py-1 text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                            >
                              التفاصيل والمسار
                            </button>

                            {inc.status !== "closed" && (
                              <button
                                onClick={() => {
                                  setClosureIncident(inc);
                                  setRootCauseInput(inc.root_cause || inc.rootCause || "");
                                  setRemediationActionsInput(inc.remediation_actions || inc.remediationActions || "");
                                  setShowClosureModal(true);
                                }}
                                className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                              >
                                إغلاق الحادث (RCA)
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 6. Content View 2: Recovery Plans Tab */}
      {activeSubTab === "recovery_plans" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recoveryPlans.map((plan) => {
              const steps = plan.steps_json || plan.steps || [];
              const isApproved = plan.status === "approved";
              const isExecuted = plan.status === "executed";

              return (
                <div key={plan.id} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-stone-500">Plan #{plan.id}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isExecuted
                            ? "bg-stone-100 text-stone-700 border border-stone-300"
                            : isApproved
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {isExecuted ? "تم التنفيذ (Executed)" : isApproved ? "معتمدة (Approved)" : "مسودة قيد المراجعة (Draft)"}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-stone-900 mb-2">{plan.title}</h4>

                    <div className="space-y-1.5 mb-3">
                      <div className="text-xs font-semibold text-stone-500">خطوات التعافي المقترحة ({steps.length}):</div>
                      <ol className="list-decimal list-inside space-y-1 text-xs text-stone-700">
                        {steps.map((s, idx) => (
                          <li key={idx} className="bg-stone-50 p-2 rounded-lg border border-stone-100">
                            {s.description || String(s)}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="text-[11px] text-stone-500 space-y-0.5 pt-2 border-t border-stone-100 font-mono">
                      <div>المخاطر: <strong className="text-stone-700">{plan.risk_level || plan.riskLevel || "medium"}</strong></div>
                      {plan.approved_by && <div>المعتمد: <strong className="text-emerald-700">{plan.approved_by}</strong></div>}
                      {plan.executed_by && <div>المنفذ: <strong className="text-stone-800">{plan.executed_by}</strong></div>}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                    {!isApproved && !isExecuted && (
                      <button
                        onClick={() => {
                          setApprovingPlan(plan);
                          setShowApprovePlanModal(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition-colors cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>اعتماد بشري (Approve)</span>
                      </button>
                    )}

                    {isApproved && !isExecuted && (
                      <button
                        onClick={() => {
                          setExecutingPlan(plan);
                          setShowExecutePlanModal(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>تنفيذ يدوي (Execute)</span>
                      </button>
                    )}

                    {isExecuted && (
                      <span className="text-xs text-stone-500 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        تم تنفيذ إجراءات التعافي وتوثيق النتائج
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Content View 3: Post-Incident Review (PIR) */}
      {activeSubTab === "pir" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg">
                    PIR #{rev.id} — Incident #{rev.incident_id}
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {new Date(rev.created_at).toLocaleDateString("ar-EG")}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold text-stone-500 mb-0.5">ملخص الحادث:</div>
                  <p className="text-xs text-stone-800 bg-stone-50 p-2.5 rounded-xl border border-stone-100">{rev.summary}</p>
                </div>

                <div>
                  <div className="text-xs font-bold text-rose-700 mb-0.5">السبب الجذري (Root Cause Analysis):</div>
                  <p className="text-xs text-stone-800 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">{rev.root_cause}</p>
                </div>

                <div>
                  <div className="text-xs font-bold text-emerald-700 mb-0.5">الإجراءات التصحيحية والوقائية:</div>
                  <p className="text-xs text-stone-800 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                    {rev.remediation_actions}
                    {rev.prevention_actions ? ` | ${rev.prevention_actions}` : ""}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                  <span>المعد: <strong className="text-stone-700">{rev.owner}</strong></span>
                  {rev.approved_by && <span>المعتمد: <strong className="text-emerald-700">{rev.approved_by}</strong></span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Content View 4: Audit Trail Tab */}
      {activeSubTab === "audit" && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
            <span className="font-bold text-xs text-stone-700">سجل حوكمة وتدقيق الحوادث والتعافي (Audit Trail)</span>
            <span className="text-xs text-stone-400 font-mono">آخر 100 إجراء مسجل</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 font-bold">
                <tr>
                  <th className="p-3">الإجراء (Action)</th>
                  <th className="p-3">المسؤول (Actor)</th>
                  <th className="p-3">المبرر وسياق الحوكمة</th>
                  <th className="p-3">معرف التتبع</th>
                  <th className="p-3">الوقت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {audits.map((a) => (
                  <tr key={a.id} className="hover:bg-stone-50">
                    <td className="p-3 font-mono font-bold text-indigo-700">{a.action}</td>
                    <td className="p-3 text-stone-800">{a.actor}</td>
                    <td className="p-3 text-stone-600">{a.reason}</td>
                    <td className="p-3 font-mono text-[11px] text-stone-500">{a.correlation_id}</td>
                    <td className="p-3 text-stone-400 font-mono text-[11px]">{new Date(a.created_at).toLocaleString("ar-EG")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Incident Details & Lifecycle Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-base text-stone-900">
                  {selectedIncident.incident_key || selectedIncident.incidentKey || `INC-${selectedIncident.id}`}: {selectedIncident.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lifecycle Progress Step Bar */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <div className="text-xs font-bold text-stone-500">مسار دورة حياة الحادث (Incident Lifecycle):</div>
              <div className="grid grid-cols-5 gap-1 text-center font-bold text-[11px]">
                {(["detected", "investigating", "mitigating", "resolved", "closed"] as IncidentStatus[]).map((st, idx) => {
                  const statuses: IncidentStatus[] = ["detected", "investigating", "mitigating", "resolved", "closed"];
                  const currentIdx = statuses.indexOf(selectedIncident.status);
                  const isCurrent = selectedIncident.status === st;
                  const isPast = currentIdx >= idx;

                  return (
                    <div
                      key={st}
                      className={`p-2 rounded-xl transition-all border ${
                        isCurrent
                          ? "bg-rose-600 text-white border-rose-700 shadow-xs"
                          : isPast
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-white text-stone-400 border-stone-200"
                      }`}
                    >
                      <div>{st.toUpperCase()}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Incident Details Info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                <span className="text-stone-400 block mb-0.5">البيئة والخطورة:</span>
                <span className="font-bold text-stone-800">{selectedIncident.environment} — </span>
                {getSeverityBadge(selectedIncident.severity)}
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                <span className="text-stone-400 block mb-0.5">المسؤول الحالي:</span>
                <span className="font-bold text-stone-800">{selectedIncident.owner || "غير محدد"}</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 font-mono">
                <span className="text-stone-400 block mb-0.5">وقت الرصد (Detected At):</span>
                <span className="text-stone-700">{new Date(selectedIncident.detected_at || "").toLocaleString("ar-EG")}</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 font-mono">
                <span className="text-stone-400 block mb-0.5">معرف التتبع (Correlation ID):</span>
                <span className="text-stone-700">{selectedIncident.correlation_id || selectedIncident.correlationId}</span>
              </div>
            </div>

            {/* Root Cause & Remediation (If present) */}
            {(selectedIncident.root_cause || selectedIncident.rootCause) && (
              <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200 space-y-1.5 text-xs">
                <div className="font-bold text-amber-900">التحليل الجذري الموثق (RCA):</div>
                <p className="text-stone-800">{selectedIncident.root_cause || selectedIncident.rootCause}</p>
                <div className="font-bold text-emerald-900 pt-1">الإجراءات التصحيحية:</div>
                <p className="text-stone-800">{selectedIncident.remediation_actions || selectedIncident.remediationActions}</p>
              </div>
            )}

            {/* Timeline / Events */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">سجل الأحداث والجدول الزمني (Timeline):</span>
                {loadingEvents && <RefreshCw className="w-3 h-3 animate-spin text-stone-400" />}
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                {incidentEvents.length === 0 ? (
                  <div className="text-xs text-stone-400 text-center py-2">لا توجد أحداث إضافية مسجلة.</div>
                ) : (
                  incidentEvents.map((ev) => (
                    <div key={ev.id} className="bg-white p-2.5 rounded-xl border border-stone-100 text-xs flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-stone-900 flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-stone-100 rounded text-[10px] font-mono">{ev.event_type}</span>
                          <span>{ev.actor}</span>
                        </div>
                        <div className="text-stone-600 mt-1">{ev.note}</div>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono shrink-0">
                        {new Date(ev.created_at).toLocaleTimeString("ar-EG")}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <div className="flex items-center gap-2">
                {selectedIncident.status !== "closed" && (
                  <button
                    onClick={() => {
                      const nextMap: Record<IncidentStatus, IncidentStatus> = {
                        detected: "investigating",
                        investigating: "mitigating",
                        mitigating: "resolved",
                        resolved: "investigating",
                        closed: "investigating",
                      };
                      setTargetStatus(nextMap[selectedIncident.status]);
                      setShowTransitionModal(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>تغيير الحالة التشغيلية</span>
                  </button>
                )}

                {selectedIncident.status !== "closed" && (
                  <button
                    onClick={() => {
                      setClosureIncident(selectedIncident);
                      setRootCauseInput(selectedIncident.root_cause || selectedIncident.rootCause || "");
                      setRemediationActionsInput(selectedIncident.remediation_actions || selectedIncident.remediationActions || "");
                      setShowClosureModal(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>اعتماد بوابة الإغلاق (RCA)</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-1.5 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-200 transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Incident */}
      {showNewIncidentModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateIncident} className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-base text-stone-900">تسجيل حادث تشغيلي جديد</h3>
              </div>
              <button onClick={() => setShowNewIncidentModal(false)} type="button" className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">عنوان الحادث *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ارتفاع مفاجئ في معدل أخطاء استرجاع المتجهات..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">البيئة</label>
                  <select
                    value={newEnv}
                    onChange={(e) => setNewEnv(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-hidden"
                  >
                    <option value="production">الإنتاج (Production)</option>
                    <option value="staging">التجهيز (Staging)</option>
                    <option value="development">التطوير (Development)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">مستوى الخطورة</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as IncidentSeverity)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-hidden"
                  >
                    <option value="warning">تحذيري (Warning)</option>
                    <option value="critical">حرج (Critical)</option>
                    <option value="info">معلوماتي (Info)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">المسؤول / الفريق المعني</label>
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">ملاحظات التشخيص الأولي</label>
                <textarea
                  rows={3}
                  placeholder="وصف مبسط لأعراض المشكلة ومؤشرات الـ SLO المتأثرة..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowNewIncidentModal(false)}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-200 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
              >
                تسجيل الحادث
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: Status Transition */}
      {showTransitionModal && selectedIncident && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">تحديث حالة الحادث التشغيلي</h3>
              <button onClick={() => setShowTransitionModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">الحالة المستهدفة *</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as IncidentStatus)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-hidden"
                >
                  <option value="investigating">قيد التحقيق (Investigating) — يبدأ حساب MTTA</option>
                  <option value="mitigating">قيد التخفيف (Mitigating)</option>
                  <option value="resolved">تم الحل تشغيلياً (Resolved) — يحسب MTTR</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">اسم المسؤول (Human Actor) *</label>
                <input
                  type="text"
                  value={transitionActor}
                  onChange={(e) => setTransitionActor(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">سبب وملاحظة الانتقال</label>
                <textarea
                  rows={2}
                  placeholder="بيان سبب الانتقال والإجراء المتخذ..."
                  value={transitionReason}
                  onChange={(e) => setTransitionReason(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowTransitionModal(false)}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-200 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleTransitionStatus}
                className="px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                تأكيد الانتقال
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Closure Gate (Enforces RCA & Remediation Actions) */}
      {showClosureModal && closureIncident && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCloseIncident} className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-stone-900">بوابة إغلاق الحادث (Closure Gate)</h3>
              </div>
              <button onClick={() => setShowClosureModal(false)} type="button" className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-900">
              <strong>شرط الحوكمة الإلزامي:</strong> لا يمكن إغلاق أي حادث وتحويله إلى حالة <code className="font-mono font-bold">closed</code> دون توثيق صريح للسبب الجذري (RCA) وخطة الإجراءات التصحيحية المتبعة لمنع التكرار.
            </div>

            {closureError && (
              <div className="p-3 bg-rose-50 text-rose-900 border border-rose-200 rounded-xl text-xs font-semibold">
                {closureError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">السبب الجذري (Root Cause) *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="تفصيل فني للسبب المباشر والظروف التي أدت لحدوث العطل أو تراجع الـ SLO..."
                  value={rootCauseInput}
                  onChange={(e) => setRootCauseInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">خطة الإجراءات التصحيحية والوقائية (Remediation Actions) *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="الإجراءات التي تم تنفيذها أو المجدولة لمنع تكرار الحادث مستقبلاً..."
                  value={remediationActionsInput}
                  onChange={(e) => setRemediationActionsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">اسم المسؤول المعتمد للإغلاق *</label>
                <input
                  type="text"
                  required
                  value={closureActor}
                  onChange={(e) => setClosureActor(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowClosureModal(false)}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-200 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                اعتماد إغلاق الحادث
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 5: Create Recovery Plan */}
      {showNewPlanModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateRecoveryPlan} className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">صياغة خطة تعافٍ تشغيلية جديدة</h3>
              <button onClick={() => setShowNewPlanModal(false)} type="button" className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">الحادث المرتبط *</label>
                <select
                  value={planIncidentId}
                  onChange={(e) => setPlanIncidentId(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-hidden"
                >
                  {incidents.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.incident_key || i.incidentKey || `INC-${i.id}`}: {i.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">عنوان خطة التعافي *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: خطة استعادة استقرار خوادم الاستدلال وتفعيل التخزين الاحتياطي..."
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">مستوى المخاطر التشغيلية</label>
                <select
                  value={planRisk}
                  onChange={(e) => setPlanRisk(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-hidden"
                >
                  <option value="low">منخفض (Low)</option>
                  <option value="medium">متوسط (Medium)</option>
                  <option value="high">عالي (High)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">خطوات التنفيذ (اكتب كل خطوة في سطر منفصل) *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="الخطوة 1: فحص مؤشرات المعالجة في السحابة&#10;الخطوة 2: توسيع ذاكرة التخزين المؤقت&#10;الخطوة 3: التحقق من انخفاض زمن الاستجابة لمستوى آمن"
                  value={planSteps}
                  onChange={(e) => setPlanSteps(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowNewPlanModal(false)}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-200 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                حفظ كمسودة
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 6: Approve Recovery Plan */}
      {showApprovePlanModal && approvingPlan && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">اعتماد خطة التعافي #{approvingPlan.id}</h3>
              <button onClick={() => setShowApprovePlanModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              أنت على وشك اعتماد الخطة: <strong>{approvingPlan.title}</strong>. يتطلب التنفيذ بعد الاعتماد توثيقاً بشرياً صريحاً.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">اسم المسؤول المعتمد *</label>
                <input
                  type="text"
                  required
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">مبررات الاعتماد</label>
                <textarea
                  rows={2}
                  value={approvalReason}
                  onChange={(e) => setApprovalReason(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowApprovePlanModal(false)}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-200 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleApprovePlan}
                className="px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                تأكيد الاعتماد البشري
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: Execute Recovery Plan */}
      {showExecutePlanModal && executingPlan && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">تنفيذ خطة التعافي يدوياً</h3>
              <button onClick={() => setShowExecutePlanModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs space-y-1">
              <div>الخطة: <strong>{executingPlan.title}</strong></div>
              <div>المعتمدة بواسطة: <strong className="text-emerald-700">{executingPlan.approved_by}</strong></div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">اسم منفذ الإجراء *</label>
                <input
                  type="text"
                  required
                  value={executorName}
                  onChange={(e) => setExecutorName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">ملاحظات ونتائج التنفيذ *</label>
                <textarea
                  rows={2}
                  value={executionNotes}
                  onChange={(e) => setExecutionNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowExecutePlanModal(false)}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-200 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleExecutePlan}
                className="px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                تأكيد التنفيذ اليدوي
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: New Post Incident Review (PIR) */}
      {showNewReviewModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleCreateReview} className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-stone-900">صياغة تقرير المراجعة اللاحقة (PIR)</h3>
              </div>
              <button onClick={() => setShowNewReviewModal(false)} type="button" className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">الحادث المرتبط *</label>
                <select
                  value={reviewIncidentId}
                  onChange={(e) => setReviewIncidentId(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-hidden"
                >
                  {incidents.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.incident_key || i.incidentKey || `INC-${i.id}`}: {i.title} ({i.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">ملخص الحادث والتأثير التشغيلي *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="وصف زمني للأثر على المستخدمين والخدمات..."
                  value={reviewSummary}
                  onChange={(e) => setReviewSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">السبب الجذري المكتشف (Root Cause) *</label>
                <textarea
                  rows={2}
                  required
                  value={reviewRootCause}
                  onChange={(e) => setReviewRootCause(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">العوامل المساهمة (Contributing Factors)</label>
                <input
                  type="text"
                  placeholder="ظروف استثنائية، ضغط شبكة، غياب مراقبة مبكرة..."
                  value={reviewContributing}
                  onChange={(e) => setReviewContributing(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">الإجراءات التصحيحية المنفذة (Remediation)</label>
                <input
                  type="text"
                  placeholder="ما تم تنفيذه لعلاج الخلل..."
                  value={reviewRemediation}
                  onChange={(e) => setReviewRemediation(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">الإجراءات الوقائية المستقبلية (Prevention)</label>
                <input
                  type="text"
                  placeholder="تحسينات في الاختبارات، ضبط مؤشرات الإنذار المبكر..."
                  value={reviewPrevention}
                  onChange={(e) => setReviewPrevention(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">المعد / المالك</label>
                  <input
                    type="text"
                    value={reviewOwner}
                    onChange={(e) => setReviewOwner(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">المعتمد</label>
                  <input
                    type="text"
                    value={reviewApprover}
                    onChange={(e) => setReviewApprover(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowNewReviewModal(false)}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-200 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-700 text-white rounded-xl text-xs font-bold hover:bg-amber-800 transition-colors cursor-pointer"
              >
                حفظ تقرير PIR
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
