import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  ShieldCheck,
  ExternalLink,
  PlusCircle,
  Search,
  History,
  Lock,
  ArrowUpRight,
  Database,
  Calendar
} from "lucide-react";
import {
  RefreshItem,
  KnowledgeUpdateCandidate,
  RefreshAuditItem,
  RefreshSummaryData,
  FreshnessStatus,
  RefreshPriority,
  ReviewStatus
} from "../types";

export const DarbAIKnowledgeRefreshView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"queue" | "candidates" | "audit">("queue");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Data states
  const [summary, setSummary] = useState<RefreshSummaryData>({
    total: 0,
    pending: 0,
    high_priority: 0,
    fresh: 0,
    aging: 0,
    stale: 0,
    pending_reviews: 0,
  });
  const [queueItems, setQueueItems] = useState<RefreshItem[]>([]);
  const [candidates, setCandidates] = useState<KnowledgeUpdateCandidate[]>([]);
  const [auditLogs, setAuditLogs] = useState<RefreshAuditItem[]>([]);

  // Filters & Modals
  const [queueFilter, setQueueFilter] = useState<string>("all");
  const [candidateFilter, setCandidateFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Modal for new candidate
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedRefreshItem, setSelectedRefreshItem] = useState<RefreshItem | null>(null);
  const [formOldContent, setFormOldContent] = useState("");
  const [formProposedContent, setFormProposedContent] = useState("");
  const [formSources, setFormSources] = useState("");
  const [formConfidence, setFormConfidence] = useState("supported");

  // Notification / Message
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showNotice = (text: string, type: "success" | "error" | "info" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [sumRes, queueRes, candRes, auditRes] = await Promise.all([
        fetch("/api/admin/ai/knowledge-refresh/summary").then(r => r.json()),
        fetch("/api/admin/ai/knowledge-refresh/queue").then(r => r.json()),
        fetch("/api/admin/ai/knowledge-refresh/candidates").then(r => r.json()),
        fetch("/api/admin/ai/knowledge-refresh/audit").then(r => r.json()),
      ]);

      if (sumRes?.summary) {
        setSummary(sumRes.summary);
      }
      if (Array.isArray(queueRes?.items)) {
        setQueueItems(queueRes.items);
      }
      if (Array.isArray(candRes?.items)) {
        setCandidates(candRes.items);
      }
      if (Array.isArray(auditRes?.items)) {
        setAuditLogs(auditRes.items);
      }
    } catch {
      showNotice("تعذر جلب بيانات التحديث - جاري المحاولة بنمط الذاكرة", "info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDetectRefresh = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/ai/knowledge-refresh/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actorId: 1 }),
      });
      const data = await res.json();
      if (data.ok) {
        showNotice(`تم فحص المعرفة بنجاح. أضيف ${data.detected} عناصر جديدة إلى طابور المراجعة`);
        loadData();
      } else {
        showNotice("فشل فحص المعرفة", "error");
      }
    } catch {
      showNotice("خطأ في الاتصال بالخادم أثناء الفحص", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewCandidate = async (candidateId: number, status: ReviewStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/ai/knowledge-refresh/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId,
          reviewStatus: status,
          reviewerId: 99,
          reviewerName: "المشرف العام (Admin)",
          note: status === "approved" ? "تم التحقق من المصادر الرسمية واعتماد التعديل" : "رفض لعدم كفاية الأدلة",
        }),
      });
      const data = await res.json();
      if (data.ok) {
        showNotice(
          status === "approved"
            ? "تم اعتماد المقترح بنجاح ونقله لحالة مؤهل للنشر البشري."
            : status === "rejected"
            ? "تم رفض المقترح وتوثيق القرار في سجل التدقيق."
            : "تم تحويل المقترح لقيد الانتظار."
        );
        loadData();
      } else {
        showNotice(data.error || "فشل تحديث حالة المقترح", "error");
      }
    } catch {
      showNotice("خطأ في إرسال قرار المراجعة", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenCandidateModal = (item?: RefreshItem) => {
    if (item) {
      setSelectedRefreshItem(item);
      setFormOldContent(`المعلومة الحالية الخاصة بـ: ${item.title} (${item.country || "عام"} - ${item.city || ""})`);
      setFormProposedContent("");
      setFormSources(item.source_url ? `[{"name": "المصدر الأصلي", "url": "${item.source_url}", "verified": true}]` : "");
    } else {
      setSelectedRefreshItem(null);
      setFormOldContent("");
      setFormProposedContent("");
      setFormSources("");
    }
    setFormConfidence("supported");
    setShowCandidateModal(true);
  };

  const handleCreateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProposedContent.trim()) {
      showNotice("يرجى كتابة المحتوى المقترح للتحديث", "error");
      return;
    }

    let parsedSources: any[] = [];
    if (formSources.trim()) {
      try {
        parsedSources = JSON.parse(formSources);
      } catch {
        parsedSources = [{ name: "مصدر رسمي", url: formSources.trim() }];
      }
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/ai/knowledge-refresh/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshId: selectedRefreshItem?.id || null,
          knowledgeId: selectedRefreshItem?.knowledge_id || null,
          oldContent: formOldContent,
          proposedContent: formProposedContent,
          sources: parsedSources,
          confidence: formConfidence,
          actorId: 1,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        showNotice("تم إنشاء مقترح التحديث وإدراجه في قائمة المراجعة البشرية بنجاح");
        setShowCandidateModal(false);
        loadData();
        setActiveTab("candidates");
      } else {
        showNotice(data.error || "تعذر إنشاء المقترح", "error");
      }
    } catch {
      showNotice("خطأ في الاتصال بالخادم أثناء إنشاء المقترح", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Status badge styling
  const renderFreshnessBadge = (status: FreshnessStatus) => {
    switch (status) {
      case "fresh":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" /> حديثة (Fresh)
          </span>
        );
      case "aging":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> تقترب من التحديث (Aging)
          </span>
        );
      case "stale":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3" /> قديمة (Stale)
          </span>
        );
      default:
        return <span className="text-xs text-neutral-500">{status}</span>;
    }
  };

  const renderPriorityBadge = (priority: RefreshPriority) => {
    switch (priority) {
      case "critical":
        return (
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-600 text-white">
            حرجة (Critical)
          </span>
        );
      case "high":
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
            عالية (High)
          </span>
        );
      case "normal":
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            عادية (Normal)
          </span>
        );
      case "low":
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
            منخفضة (Low)
          </span>
        );
    }
  };

  const renderReviewStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3.5 h-3.5" /> معتمد (Approved)
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5" /> مرفوض (Rejected)
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5" /> بانتظار المراجعة (Pending)
          </span>
        );
    }
  };

  // Filtered lists
  const filteredQueue = queueItems.filter(item => {
    if (queueFilter !== "all" && item.status !== queueFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.country && item.country.toLowerCase().includes(q)) ||
        (item.city && item.city.toLowerCase().includes(q)) ||
        item.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredCandidates = candidates.filter(cand => {
    if (candidateFilter !== "all" && cand.review_status !== candidateFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        cand.proposed_content.toLowerCase().includes(q) ||
        (cand.old_content && cand.old_content.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 text-right" dir="rtl" id="darb-v122-knowledge-refresh-view">
      {/* Header with Title and Strict Governance Banner */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                DARB V1.22
              </span>
              <h2 className="text-xl font-bold text-neutral-900">
                جودة وتحديث قاعدة المعرفة (Knowledge Quality & Refresh Manager)
              </h2>
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              مراقبة أعمار وتحديثات المعرفة دورياً، صياغة مقترحات التعديل بالأدلة، وتطبيق الحظر الصارم للنشر التلقائي عبر المراجعة البشرية.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDetectRefresh}
              disabled={actionLoading || loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 shadow-sm"
              id="btn-detect-refresh"
            >
              <Search className="w-4 h-4" />
              فحص دوري لاكتشاف التحديثات
            </button>
            <button
              onClick={() => handleOpenCandidateModal()}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-neutral-900 hover:bg-black text-white rounded-lg text-sm font-medium transition shadow-sm"
              id="btn-open-candidate-modal"
            >
              <PlusCircle className="w-4 h-4" />
              صياغة مقترح تحديث
            </button>
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition text-neutral-700"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Strict Governance Notice Card */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>قيد الحوكمة الصارم (Auto Publish = false):</strong> لا يتم إدخال أي تحديث مباشرة إلى قاعدة المعرفة الحية؛ بل يُحفظ كمقترح تحديث (Candidate) خاضع لسجل التدقيق حتى يراجعه المشرف البشري يدوياً.
            </span>
          </div>
          <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-200 shrink-0">
            Immutable Audit Active
          </span>
        </div>
      </div>

      {/* Notice Notification */}
      {message && (
        <div
          className={`p-4 rounded-lg text-sm font-medium flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : message.type === "error"
              ? "bg-rose-50 text-rose-800 border border-rose-200"
              : "bg-blue-50 text-blue-800 border border-blue-200"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-sm underline">
            إغلاق
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Fresh */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <div className="text-xs text-neutral-500 flex items-center justify-between">
            <span>حديثة (Fresh)</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-2">{summary.fresh}</div>
          <div className="text-[11px] text-neutral-400 mt-1">&lt; 30 يوماً</div>
        </div>

        {/* Aging */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <div className="text-xs text-neutral-500 flex items-center justify-between">
            <span>تقترب (Aging)</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-2">{summary.aging}</div>
          <div className="text-[11px] text-neutral-400 mt-1">30 - 90 يوماً</div>
        </div>

        {/* Stale */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <div className="text-xs text-neutral-500 flex items-center justify-between">
            <span>قديمة (Stale)</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">{summary.stale}</div>
          <div className="text-[11px] text-rose-400 mt-1">&gt; 90 يوماً</div>
        </div>

        {/* Pending Refresh */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <div className="text-xs text-neutral-500 flex items-center justify-between">
            <span>في الطابور</span>
            <RefreshCw className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-2">{summary.pending}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Pending Refresh</div>
        </div>

        {/* High Priority */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <div className="text-xs text-neutral-500 flex items-center justify-between">
            <span>أولوية مرتفعة</span>
            <ShieldCheck className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-600 mt-2">{summary.high_priority}</div>
          <div className="text-[11px] text-orange-400 mt-1">High / Critical</div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <div className="text-xs text-neutral-500 flex items-center justify-between">
            <span>بانتظار المراجعة</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-2">
            {summary.pending_reviews || candidates.filter(c => c.review_status === "pending").length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Review Candidates</div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-neutral-200 bg-neutral-50/70 px-4 pt-3 gap-2">
          <button
            onClick={() => setActiveTab("queue")}
            className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "queue"
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-lg shadow-sm"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
            id="tab-queue"
          >
            <RefreshCw className="w-4 h-4" />
            طابور التحديث الدوري (Refresh Queue)
            <span className="bg-neutral-200 text-neutral-700 text-xs px-2 py-0.5 rounded-full font-mono">
              {queueItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("candidates")}
            className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "candidates"
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-lg shadow-sm"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
            id="tab-candidates"
          >
            <FileText className="w-4 h-4" />
            مقترحات التحديث للمراجعة (Update Candidates)
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-mono">
              {candidates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "audit"
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-lg shadow-sm"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
            id="tab-audit"
          >
            <History className="w-4 h-4" />
            سجل التدقيق (Audit Trail)
            <span className="bg-neutral-200 text-neutral-700 text-xs px-2 py-0.5 rounded-full font-mono">
              {auditLogs.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Refresh Queue */}
        {activeTab === "queue" && (
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 font-medium">تصفية حسب الحالة:</span>
                {["all", "pending", "resolved", "candidate_created"].map(statusKey => (
                  <button
                    key={statusKey}
                    onClick={() => setQueueFilter(statusKey)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                      queueFilter === statusKey
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {statusKey === "all"
                      ? "الكل"
                      : statusKey === "pending"
                      ? "قيد الانتظار"
                      : statusKey === "resolved"
                      ? "تم التحديث"
                      : "أُنشئ مقترح"}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="بحث في طابور التحديث..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pr-9 pl-3 py-1.5 border border-neutral-300 rounded-lg text-xs w-64 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-neutral-200">
              <table className="w-full text-xs text-neutral-800 text-right">
                <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200 font-semibold">
                  <tr>
                    <th className="py-3 px-3">المعرف</th>
                    <th className="py-3 px-3">الدولة / المدينة</th>
                    <th className="py-3 px-3">العنوان ومحتوى المعلومة</th>
                    <th className="py-3 px-3">سبب التحديث</th>
                    <th className="py-3 px-3">الحداثة</th>
                    <th className="py-3 px-3">الأولوية</th>
                    <th className="py-3 px-3">المصدر</th>
                    <th className="py-3 px-3 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredQueue.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-neutral-400">
                        لا توجد عناصر في طابور التحديث تطابق البحث الحالي
                      </td>
                    </tr>
                  ) : (
                    filteredQueue.map(item => (
                      <tr key={item.id} className="hover:bg-neutral-50 transition">
                        <td className="py-3 px-3 font-mono text-neutral-500">#{item.id}</td>
                        <td className="py-3 px-3 font-medium whitespace-nowrap">
                          {item.country || "عام"} {item.city ? `• ${item.city}` : ""}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-neutral-900 max-w-xs line-clamp-1">{item.title}</div>
                          {item.age_days !== undefined && (
                            <div className="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> عمر المعلومة: {item.age_days} يومًا
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 max-w-xs text-neutral-600">
                          {item.reason}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {renderFreshnessBadge(item.freshness_status)}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {renderPriorityBadge(item.priority)}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {item.source_url ? (
                            <a
                              href={item.source_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                            >
                              <ExternalLink className="w-3 h-3" /> رابط رسمي
                            </a>
                          ) : (
                            <span className="text-neutral-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleOpenCandidateModal(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-xs font-medium transition"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            صياغة مقترح
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Update Candidates */}
        {activeTab === "candidates" && (
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 font-medium">تصفية المقترحات:</span>
                {["all", "pending", "approved", "rejected"].map(st => (
                  <button
                    key={st}
                    onClick={() => setCandidateFilter(st)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                      candidateFilter === st
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {st === "all"
                      ? "الكل"
                      : st === "pending"
                      ? "قيد المراجعة"
                      : st === "approved"
                      ? "معتمد"
                      : "مرفوض"}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleOpenCandidateModal()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-black transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                إضافة مقترح يدوي
              </button>
            </div>

            {filteredCandidates.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 bg-neutral-50 rounded-xl border border-neutral-200">
                <FileText className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                لا توجد مقترحات تحديث مطابقة في الوقت الحالي
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredCandidates.map(candidate => (
                  <div
                    key={candidate.id}
                    className="border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition bg-white shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                          Candidate #{candidate.id}
                        </span>
                        {candidate.refresh_id && (
                          <span className="text-xs text-neutral-500">
                            (مرتبط بطابور التحديث #{candidate.refresh_id})
                          </span>
                        )}
                        <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                          مستوى الثقة: <strong>{candidate.confidence_level}</strong>
                        </span>
                      </div>
                      <div>{renderReviewStatusBadge(candidate.review_status)}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Old Content */}
                      <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200/70">
                        <div className="text-neutral-500 font-semibold mb-1 flex items-center gap-1">
                          <History className="w-3.5 h-3.5" /> المحتوى الأصلي / السابق:
                        </div>
                        <p className="text-neutral-700 leading-relaxed">
                          {candidate.old_content || "لا يوجد محتوى سابق (إدخال جديد)"}
                        </p>
                      </div>

                      {/* Proposed Content */}
                      <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-200/70">
                        <div className="text-emerald-800 font-semibold mb-1 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> المحتوى المقترح للتحديث:
                        </div>
                        <p className="text-neutral-900 leading-relaxed font-medium">
                          {candidate.proposed_content}
                        </p>
                      </div>
                    </div>

                    {/* Sources & Evidence */}
                    {Array.isArray(candidate.sources_json) && candidate.sources_json.length > 0 && (
                      <div className="text-xs bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 flex flex-wrap items-center gap-2">
                        <span className="text-neutral-500 font-medium">المصادر والأدلة المرفقة:</span>
                        {candidate.sources_json.map((src: any, idx: number) => (
                          <span
                            key={idx}
                            className="bg-white px-2 py-0.5 rounded border border-neutral-200 text-emerald-700 inline-flex items-center gap-1"
                          >
                            {src.name || "مصدر"}
                            {src.url && (
                              <a href={src.url} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-neutral-600">
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Review Actions Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-neutral-100 text-xs">
                      <div className="text-neutral-500">
                        {candidate.created_at && (
                          <span>تاريخ الإنشاء: {new Date(candidate.created_at).toLocaleString("ar-SA")}</span>
                        )}
                        {candidate.reviewed_at && (
                          <span className="mr-3">
                            تاريخ المراجعة: {new Date(candidate.reviewed_at).toLocaleString("ar-SA")}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {candidate.review_status !== "approved" && (
                          <button
                            onClick={() => handleReviewCandidate(candidate.id!, "approved")}
                            disabled={actionLoading}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            اعتماد التحديث (Approve)
                          </button>
                        )}
                        {candidate.review_status !== "rejected" && (
                          <button
                            onClick={() => handleReviewCandidate(candidate.id!, "rejected")}
                            disabled={actionLoading}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-medium transition disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            رفض (Reject)
                          </button>
                        )}
                        {candidate.review_status !== "pending" && (
                          <button
                            onClick={() => handleReviewCandidate(candidate.id!, "pending")}
                            disabled={actionLoading}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded font-medium transition"
                          >
                            إبقاء قيد المراجعة
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Audit Trail */}
        {activeTab === "audit" && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">
                سجل تدقيق كامل لكافة عمليات الفحص والمراجعة وقرارات الاعتماد والرفض لضمان الامتثال والحوكمة.
              </span>
              <span className="text-xs font-mono bg-neutral-100 px-2.5 py-1 rounded text-neutral-600">
                Immutable Ledger
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-neutral-200">
              <table className="w-full text-xs text-neutral-800 text-right">
                <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200 font-semibold">
                  <tr>
                    <th className="py-3 px-3">المعرف</th>
                    <th className="py-3 px-3">العملية (Action)</th>
                    <th className="py-3 px-3">المشرف / الفاعل</th>
                    <th className="py-3 px-3">التاريخ والوقت</th>
                    <th className="py-3 px-3">التفاصيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-neutral-400">
                        لا توجد سجلات تدقيق مسجلة حتى الآن
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-neutral-50 transition font-mono">
                        <td className="py-3 px-3 text-neutral-500">#{log.id}</td>
                        <td className="py-3 px-3 font-semibold text-neutral-900">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] ${
                              log.action.includes("approved")
                                ? "bg-emerald-100 text-emerald-800"
                                : log.action.includes("rejected")
                                ? "bg-rose-100 text-rose-800"
                                : "bg-blue-50 text-blue-800"
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-neutral-700 font-sans">
                          {log.actor_name || `المستخدم #${log.actor_id || "1"}`}
                        </td>
                        <td className="py-3 px-3 text-neutral-500">
                          {new Date(log.created_at).toLocaleString("ar-SA")}
                        </td>
                        <td className="py-3 px-3 text-neutral-600 font-sans max-w-md truncate">
                          {JSON.stringify(log.details_json)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create Knowledge Update Candidate */}
      {showCandidateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 text-right space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                صياغة مقترح تحديث لقاعدة المعرفة (Update Candidate)
              </h3>
              <button
                onClick={() => setShowCandidateModal(false)}
                className="text-neutral-400 hover:text-neutral-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCandidate} className="space-y-4 text-xs">
              {selectedRefreshItem && (
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700">
                  <div className="font-semibold text-neutral-900">{selectedRefreshItem.title}</div>
                  <div className="text-neutral-500 mt-1">{selectedRefreshItem.reason}</div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">المحتوى الأصلي / الحالي:</label>
                <textarea
                  value={formOldContent}
                  onChange={e => setFormOldContent(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  placeholder="المحتوى القديم قبل التعديل إن وجد..."
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-900 mb-1">
                  المحتوى المقترح للتحديث <span className="text-rose-600">*</span>:
                </label>
                <textarea
                  value={formProposedContent}
                  onChange={e => setFormProposedContent(e.target.value)}
                  rows={4}
                  required
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-medium"
                  placeholder="اكتب الصياغة المحدثة بدقة مع ذكر الإجراءات والرسوم المحدثة..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">مستوى الثقة والتأكيد:</label>
                  <select
                    value={formConfidence}
                    onChange={e => setFormConfidence(e.target.value)}
                    className="w-full p-2 border border-neutral-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="supported">مدعوم بمصدر رسمي موثق (Supported)</option>
                    <option value="limited">تحديث ذو تغطية جزئية (Limited)</option>
                    <option value="speculative">استدلال أولي تحت الفحص (Speculative)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">رابط المصدر أو JSON:</label>
                  <input
                    type="text"
                    value={formSources}
                    onChange={e => setFormSources(e.target.value)}
                    className="w-full p-2 border border-neutral-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"
                    placeholder="https://example.gov.sa"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0 text-amber-700" />
                <span>
                  <strong>تأكيد الحوكمة:</strong> سيتم حفظ هذا المقترح بحالة <strong>Pending</strong> ولن يتم نشره حتى يراجعه المشرف المختص ويعتمده.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowCandidateModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                >
                  حفظ المقترح للمراجعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
