import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  History,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  GitBranch,
  FileCode,
  Copy,
  Check,
  Plus,
  ArrowRight,
  Lock,
  RefreshCw,
  Sliders,
  Eye,
  CheckSquare,
  Clock,
  UserCheck
} from "lucide-react";
import {
  AIReleaseVersion,
  AIReleaseActivePointer,
  AIReleaseAudit,
  ReleaseStatus
} from "../types/darb-ai-release-version";

export function DarbAIReleaseVersionManagerView() {
  const [versions, setVersions] = useState<AIReleaseVersion[]>([]);
  const [activePointer, setActivePointer] = useState<AIReleaseActivePointer | null>(null);
  const [audits, setAudits] = useState<AIReleaseAudit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [notice, setNotice] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Modals & Panels
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showRollbackModal, setShowRollbackModal] = useState<boolean>(false);
  const [selectedSnapshotVersion, setSelectedSnapshotVersion] = useState<AIReleaseVersion | null>(null);

  // New Draft State
  const [newLabel, setNewLabel] = useState<string>("");
  const [newDesc, setNewDesc] = useState<string>("");
  const [newGateId, setNewGateId] = useState<number>(1);
  const [newParentId, setNewParentId] = useState<number | null>(1);
  const [newConfigJson, setNewConfigJson] = useState<string>(
    JSON.stringify(
      {
        version: "1.25-rc2",
        orchestrator: { enabled: true, mode: "hybrid_rag" },
        search: { trustedOnly: true, maxResults: 10 },
        governance: { autoPublish: false, requireHumanApproval: true },
        releaseGate: { minPassRateDrop: 0.02, maxLatencyRatio: 0.25 }
      },
      null,
      2
    )
  );

  // Rollback Modal State
  const [rollbackTargetId, setRollbackTargetId] = useState<number | "">("");
  const [rollbackReason, setRollbackReason] = useState<string>("");
  const [rollbackConfirmed, setRollbackConfirmed] = useState<boolean>(false);

  // Copied checksum feedback
  const [copiedChecksum, setCopiedChecksum] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resVersions, resActive, resAudits] = await Promise.all([
        fetch("/api/admin/ai/releases/versions").then((r) => r.json()),
        fetch("/api/admin/ai/releases/active").then((r) => r.json()),
        fetch("/api/admin/ai/releases/audit").then((r) => r.json())
      ]);

      if (resVersions?.ok && resVersions.versions) {
        setVersions(resVersions.versions);
      }
      if (resActive?.ok) {
        setActivePointer(resActive.active);
      }
      if (resAudits?.ok && resAudits.audit) {
        setAudits(resAudits.audit);
      }
    } catch {
      setNotice({ text: "تعذر تحميل بيانات إدارة الإصدارات من الخادم", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopyChecksum = (chk: string) => {
    navigator.clipboard.writeText(chk);
    setCopiedChecksum(chk);
    setTimeout(() => setCopiedChecksum(null), 2000);
  };

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    setActionLoading(true);
    try {
      let parsedConfig = {};
      try {
        parsedConfig = JSON.parse(newConfigJson);
      } catch {
        parsedConfig = { raw: newConfigJson };
      }

      const res = await fetch("/api/admin/ai/releases/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          versionLabel: newLabel.trim(),
          description: newDesc.trim(),
          releaseGateId: newGateId || null,
          parentVersionId: newParentId || null,
          configSnapshot: parsedConfig,
          reason: `إنشاء مسودة إصدار: ${newLabel.trim()}`
        })
      });

      const data = await res.json();
      if (data.ok) {
        setNotice({ text: `تم إنشاء المسودة (${newLabel}) بنجاح مع تجزئة SHA-256.`, type: "success" });
        setShowCreateModal(false);
        setNewLabel("");
        setNewDesc("");
        fetchData();
      } else {
        setNotice({ text: `خطأ أثناء الإنشاء: ${data.error || "فشل الطلب"}`, type: "error" });
      }
    } catch {
      setNotice({ text: "فشل الاتصال بالخادم لإنشاء الإصدار", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransition = async (versionId: number, toStatus: ReleaseStatus, reasonPrompt: string) => {
    const reason = window.prompt(`يرجى كتابة سبب الانتقال إلى حالة (${toStatus}):`, reasonPrompt);
    if (reason === null) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/ai/releases/versions/${versionId}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toStatus,
          reason: reason || `تغيير الحالة إلى ${toStatus}`,
          actorId: 99
        })
      });

      const data = await res.json();
      if (data.ok) {
        setNotice({ text: `تم تحديث حالة الإصدار بنجاح إلى (${toStatus}).`, type: "success" });
        fetchData();
      } else {
        setNotice({ text: `تعذر تغيير الحالة: ${data.error || "مرفوض"}`, type: "error" });
      }
    } catch {
      setNotice({ text: "فشل الاتصال لتحديث حالة الإصدار", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = async (version: AIReleaseVersion) => {
    if (!version.id) return;
    const confirmMsg = `هل تؤكد تفعيل النسخة (${version.version_label}) لتصبح النسخة النشطة رسمياً للمحرك؟\n\nتنبيه: التفعيل هو قرار بشري صريح، والتبديل لا يقوم بالنشر التلقائي.`;
    if (!window.confirm(confirmMsg)) return;

    const reason = window.prompt("سبب التفعيل واعتماد النسخة النشطة:", "اجتياز كافة معايير الفحص وبوابة الإصدار");
    if (reason === null) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/ai/releases/versions/${version.id}/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actorId: 99,
          reason
        })
      });

      const data = await res.json();
      if (data.ok) {
        setNotice({ text: `تم تفعيل الإصدار (${version.version_label}) كإصدار نشط بموجب قرار المشرف.`, type: "success" });
        fetchData();
      } else {
        setNotice({ text: `تعذر التفعيل: ${data.error || "مرفوض"}`, type: "error" });
      }
    } catch {
      setNotice({ text: "فشل طلب التفعيل", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRollbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollbackTargetId || !rollbackConfirmed || !rollbackReason.trim()) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/ai/releases/versions/${activePointer?.active_version_id || 1}/rollback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetVersionId: Number(rollbackTargetId),
          actorId: 99,
          reason: rollbackReason.trim()
        })
      });

      const data = await res.json();
      if (data.ok) {
        setNotice({
          text: `تم الرجوع اليدوي الآمن (Rollback) بنجاح إلى النسخة #${rollbackTargetId} وتوثيقه بسجل التدقيق.`,
          type: "success"
        });
        setShowRollbackModal(false);
        setRollbackReason("");
        setRollbackConfirmed(false);
        fetchData();
      } else {
        setNotice({ text: `فشل التراجع: ${data.error || "مرفوض"}`, type: "error" });
      }
    } catch {
      setNotice({ text: "فشل الاتصال لتنفيذ عملية التراجع", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const activeVersionObj = versions.find((v) => v.id === activePointer?.active_version_id) || versions.find((v) => v.status === "active") || versions[0];
  const rollbackCandidate = versions.find((v) => v.id === Number(rollbackTargetId));

  const getStatusBadge = (status: ReleaseStatus) => {
    switch (status) {
      case "active":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> نشط (Active)</span>;
      case "approved":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> معتمد (Approved)</span>;
      case "candidate":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> مرشح (Candidate)</span>;
      case "draft":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-300 flex items-center gap-1"><FileCode className="w-3.5 h-3.5" /> مسودة (Draft)</span>;
      case "retired":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-200 text-stone-600 border border-stone-300">متقاعد (Retired)</span>;
      case "rollback":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> تراجع (Rollback)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 text-stone-900" dir="rtl">
      {/* HEADER & GOVERNANCE NOTICE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-teal-700 text-white text-xs font-black px-2.5 py-0.5 rounded-md">V1.25</span>
            <h2 className="text-xl font-black text-stone-800">
              إدارة إصدارات الذكاء الاصطناعي (AI Release & Version Manager)
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            إدارة دورة حياة نماذج وإصدارات محرك دَرْب، حفظ الـ Snapshots المشفرة، التحقق من بوابة V1.24 Release Gate، وتنفيذ الـ Rollback اليدوي الآمن.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            disabled={loading || actionLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>تحديث</span>
          </button>

          <button
            onClick={() => setShowRollbackModal(true)}
            disabled={versions.length < 2 || actionLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition cursor-pointer"
            id="btn-open-rollback-modal"
          >
            <RotateCcw className="w-4 h-4" />
            <span>تراجع يدوي آمن (Rollback)</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            disabled={actionLoading}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition shadow-xs cursor-pointer"
            id="btn-open-create-version-modal"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء مسودة إصدار</span>
          </button>
        </div>
      </div>

      {/* STRICT GOVERNANCE BANNER */}
      <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl flex items-start gap-3 text-amber-900 text-xs">
        <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">ضوابط الحوكمة الصارمة لإصدارات محرك الذكاء الاصطناعي (Strict Governance Rules):</p>
          <ul className="list-disc list-inside space-y-0.5 text-amber-800">
            <li><strong>تعطيل النشر التلقائي (Auto Publish = Strict Disabled):</strong> اجتياز بوابة Release Gate بحالة PASS لا يعني التفعيل التلقائي؛ القرار البشري مطلوب حصراً.</li>
            <li><strong>عدم الكتابة التلقائية لقاعدة المعرفة:</strong> إنشاء أو تفعيل أي نسخة لا يعدل محتوى قاعدة المعرفة الحية.</li>
            <li><strong>التراجع اليدوي المشروط:</strong> يتطلب مراجعة Snapshot وتجزئة SHA-256، بيان سبب التراجع، وتأكيداً بشرياً صريحاً موثقاً بالتدقيق.</li>
          </ul>
        </div>
      </div>

      {notice && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
            notice.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : notice.type === "error"
              ? "bg-rose-50 text-rose-800 border border-rose-200"
              : "bg-blue-50 text-blue-800 border border-blue-200"
          }`}
        >
          <span>{notice.text}</span>
          <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-stone-600">×</button>
        </div>
      )}

      {/* ACTIVE VERSION CARD */}
      <div className="bg-gradient-to-br from-teal-900 to-stone-900 text-white p-6 rounded-2xl shadow-sm border border-teal-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-teal-800/80 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-teal-500/20 text-teal-300 rounded border border-teal-500/30">
                  النسخة النشطة في الإنتاج (Active Pointer)
                </span>
                <span className="text-xs text-teal-200 font-mono">ID #{activePointer?.active_version_id || activeVersionObj?.id || 1}</span>
              </div>
              <h3 className="text-lg font-black mt-0.5 text-white">
                {activePointer?.version_label || activeVersionObj?.version_label || "DARB AI V1.24 Standard"}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> نشط ومعتمد (Active in Production)
            </span>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-stone-400 block mb-1">بوابة الفحص (Release Gate)</span>
            <div className="flex items-center gap-1.5 font-bold text-teal-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Gate #{activePointer?.release_gate_id || activeVersionObj?.release_gate_id || 1} (PASS)</span>
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-stone-400 block mb-1">النسخة الأم (Parent Version)</span>
            <div className="flex items-center gap-1.5 font-bold text-stone-200">
              <GitBranch className="w-4 h-4 text-teal-400" />
              <span>{activeVersionObj?.parent_version_id ? `#${activeVersionObj.parent_version_id}` : "إصدار أساسي (Root Baseline)"}</span>
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-stone-400 block mb-1">تاريخ التفعيل (Activated At)</span>
            <div className="flex items-center gap-1.5 font-bold text-stone-200">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>{activePointer?.activated_at ? new Date(activePointer.activated_at).toLocaleString("ar-EG") : "معتمد حالياً"}</span>
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-stone-400 block mb-1">تجزئة الـ Snapshot (SHA-256)</span>
            <div className="flex items-center justify-between gap-1">
              <span className="font-mono text-[11px] text-teal-200 truncate" title={activePointer?.active_checksum || activeVersionObj?.latest_checksum || ""}>
                {(activePointer?.active_checksum || activeVersionObj?.latest_checksum || "sha256-checksum").substring(0, 16)}...
              </span>
              <button
                onClick={() => handleCopyChecksum(activePointer?.active_checksum || activeVersionObj?.latest_checksum || "")}
                className="text-stone-400 hover:text-white p-1 rounded transition"
                title="نسخ التجزئة"
              >
                {copiedChecksum ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {activeVersionObj && (
          <div className="mt-4 pt-3 border-t border-teal-800/60 flex items-center justify-between text-xs text-teal-200">
            <span>الوصف: {String(activeVersionObj.metadata_json?.description || "النسخة المعتمدة لمحرك الذكاء الاصطناعي.")}</span>
            <button
              onClick={() => setSelectedSnapshotVersion(activeVersionObj)}
              className="flex items-center gap-1 text-teal-300 hover:text-white underline cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة Snapshot الإعدادات</span>
            </button>
          </div>
        )}
      </div>

      {/* VERSIONS TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-700" />
            <h3 className="font-bold text-sm text-stone-800">قائمة إصدارات الذكاء الاصطناعي ({versions.length})</h3>
          </div>
          <span className="text-xs text-stone-500">دورة الحياة: Draft ➔ Candidate ➔ Approved ➔ Active ➔ Retired / Rollback</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 font-bold">
                <th className="p-3">#</th>
                <th className="p-3">اسم الإصدار</th>
                <th className="p-3">الحالة الحالية</th>
                <th className="p-3">بوابة V1.24 Gate</th>
                <th className="p-3">النسخة الأم</th>
                <th className="p-3">SHA-256 Checksum</th>
                <th className="p-3">تاريخ الإنشاء</th>
                <th className="p-3 text-center">الإجراءات والتحكم البشري</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {versions.map((ver) => {
                const isActive = ver.id === activePointer?.active_version_id || ver.status === "active";
                return (
                  <tr key={ver.id || ver.version_label} className={`hover:bg-stone-50/80 transition ${isActive ? "bg-teal-50/40" : ""}`}>
                    <td className="p-3 font-mono font-bold text-stone-500">#{ver.id}</td>
                    <td className="p-3 font-bold text-stone-800">
                      <div className="flex items-center gap-1.5">
                        <span>{ver.version_label}</span>
                        {isActive && <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-bold">نشط</span>}
                      </div>
                      {ver.metadata_json?.description && (
                        <span className="text-[11px] text-stone-400 block">{String(ver.metadata_json.description)}</span>
                      )}
                    </td>
                    <td className="p-3">{getStatusBadge(ver.status)}</td>
                    <td className="p-3 font-mono">
                      {ver.release_gate_id ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                          <ShieldCheck className="w-3 h-3" /> Gate #{ver.release_gate_id}
                        </span>
                      ) : (
                        <span className="text-stone-400">-</span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-stone-500">
                      {ver.parent_version_id ? `#${ver.parent_version_id}` : "Baseline"}
                    </td>
                    <td className="p-3 font-mono text-[11px]">
                      {ver.latest_checksum ? (
                        <div className="flex items-center gap-1">
                          <span className="text-stone-500">{ver.latest_checksum.substring(0, 10)}...</span>
                          <button
                            onClick={() => handleCopyChecksum(ver.latest_checksum!)}
                            className="text-stone-400 hover:text-stone-700 p-0.5"
                            title="نسخ التجزئة"
                          >
                            {copiedChecksum === ver.latest_checksum ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      ) : (
                        <span className="text-stone-400">-</span>
                      )}
                    </td>
                    <td className="p-3 text-stone-500">
                      {ver.created_at ? new Date(ver.created_at).toLocaleDateString("ar-EG") : "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {/* Snapshot Preview */}
                        <button
                          onClick={() => setSelectedSnapshotVersion(ver)}
                          className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                          title="معاينة الـ Snapshot"
                        >
                          <FileCode className="w-3 h-3" />
                          <span>Snapshot</span>
                        </button>

                        {/* Transition to Candidate */}
                        {ver.status === "draft" && (
                          <button
                            onClick={() => handleTransition(ver.id!, "candidate", "ترقية المسودة إلى مرشح للاعتماد")}
                            className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold cursor-pointer"
                          >
                            ترشيح (Candidate)
                          </button>
                        )}

                        {/* Transition to Approved */}
                        {ver.status === "candidate" && (
                          <button
                            onClick={() => handleTransition(ver.id!, "approved", "اعتماد النسخة بعد التدقيق والفحص")}
                            className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-bold cursor-pointer"
                          >
                            اعتماد (Approve)
                          </button>
                        )}

                        {/* Activate Button */}
                        {(ver.status === "approved" || ver.status === "candidate") && !isActive && (
                          <button
                            onClick={() => handleActivate(ver)}
                            className="px-2.5 py-1 rounded bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>تفعيل في الإنتاج</span>
                          </button>
                        )}

                        {/* Rollback to this version if not active */}
                        {ver.status !== "active" && ver.status !== "draft" && (
                          <button
                            onClick={() => {
                              setRollbackTargetId(ver.id!);
                              setShowRollbackModal(true);
                            }}
                            className="px-2 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            title="التراجع إلى هذا الإصدار"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>تراجع</span>
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
      </div>

      {/* AUDIT TRAIL */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-teal-700" />
          <h3 className="font-bold text-sm text-stone-800">سجل التدقيق والعمليات (Audit Trail)</h3>
        </div>
        <p className="text-xs text-stone-500 mb-3">
          جميع إجراءات إنشاء الإصدارات، التغيير في دورة الحياة، التفعيل، والتراجع يتم تدوينها بدقة مع تفاصيل المشرف.
        </p>

        <div className="divide-y divide-stone-100">
          {audits.map((item, idx) => (
            <div key={item.id || idx} className="py-2.5 flex items-start justify-between text-xs gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-800 uppercase text-[11px] bg-stone-100 px-1.5 py-0.5 rounded">
                    {item.action}
                  </span>
                  <span className="text-stone-600 font-semibold">
                    نسخة #{item.version_id} {item.from_status ? `(${item.from_status} ➔ ${item.to_status})` : `➔ ${item.to_status}`}
                  </span>
                </div>
                {item.reason && <p className="text-stone-500 text-[11px]">السبب: {item.reason}</p>}
              </div>
              <div className="text-stone-400 text-left shrink-0 text-[11px]">
                {item.created_at ? new Date(item.created_at).toLocaleString("ar-EG") : "حديثاً"}
              </div>
            </div>
          ))}
          {audits.length === 0 && (
            <div className="text-stone-400 text-center py-4 text-xs">لا يوجد سجلات تدقيق حتى الآن.</div>
          )}
        </div>
      </div>

      {/* MODAL: CREATE DRAFT */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-base text-stone-800">إنشاء مسودة إصدار جديد (New Draft)</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-600 text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateDraft} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">اسم / ملصق الإصدار (Version Label) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DARB AI V1.25 — General Availability"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-teal-700"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">وصف الإصدار والأهداف</label>
                <input
                  type="text"
                  placeholder="وصف مختصر للتغييرات ومحاور التحسين..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">معرف بوابة V1.24 Gate</label>
                  <input
                    type="number"
                    min={1}
                    value={newGateId}
                    onChange={(e) => setNewGateId(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-teal-700 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">معرف النسخة الأم (Parent ID)</label>
                  <input
                    type="number"
                    min={1}
                    value={newParentId || ""}
                    onChange={(e) => setNewParentId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-teal-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Snapshot إعدادات المحرك (JSON Config)</label>
                <textarea
                  rows={6}
                  value={newConfigJson}
                  onChange={(e) => setNewConfigJson(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-teal-700 font-mono text-[11px] text-stone-700"
                />
                <p className="text-[10px] text-stone-400 mt-1">سيتم احتساب تجزئة SHA-256 تلقائياً عند حفظ الـ Snapshot.</p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 bg-stone-100 hover:bg-stone-200 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !newLabel.trim()}
                  className="px-5 py-2 rounded-xl text-white bg-teal-700 hover:bg-teal-800 font-bold shadow-xs cursor-pointer"
                >
                  إنشاء المسودة الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SAFE ROLLBACK */}
      {showRollbackModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-purple-700" />
                <h3 className="font-bold text-base text-stone-800">التراجع اليدوي الآمن (Safe Manual Rollback)</h3>
              </div>
              <button
                onClick={() => setShowRollbackModal(false)}
                className="text-stone-400 hover:text-stone-600 text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleRollbackSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">اختر النسخة السابقة المستهدفة للرجوع إليها *</label>
                <select
                  required
                  value={rollbackTargetId}
                  onChange={(e) => setRollbackTargetId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-purple-700"
                >
                  <option value="">-- اختر الإصدار --</option>
                  {versions
                    .filter((v) => v.id !== activePointer?.active_version_id && v.status !== "draft")
                    .map((v) => (
                      <option key={v.id} value={v.id}>
                        #{v.id} - {v.version_label} ({v.status})
                      </option>
                    ))}
                </select>
              </div>

              {rollbackCandidate && (
                <div className="bg-purple-50/70 border border-purple-200 p-3.5 rounded-xl space-y-2 text-purple-900 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-950">تفاصيل النسخة المستهدفة:</span>
                    <span className="font-mono text-purple-700">ID #{rollbackCandidate.id}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-purple-600 block">بوابة الإصدار:</span>
                      <span className="font-bold text-emerald-700">Gate #{rollbackCandidate.release_gate_id || 1} (PASS)</span>
                    </div>
                    <div>
                      <span className="text-purple-600 block">SHA-256 Checksum:</span>
                      <span className="font-mono text-purple-800 truncate block">
                        {(rollbackCandidate.latest_checksum || "sha256-verified").substring(0, 16)}...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-stone-700 block mb-1">سبب التراجع (Reason for Rollback) *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="اذكر بوضوح سبب الرجوع إلى هذا الإصدار (مثل ظهور أخطاء في السلوك، تراجع في دقة الإجابات، إلخ)..."
                  value={rollbackReason}
                  onChange={(e) => setRollbackReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-purple-700"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="confirm-rollback-checkbox"
                  checked={rollbackConfirmed}
                  onChange={(e) => setRollbackConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-purple-700 focus:ring-purple-700 cursor-pointer"
                />
                <label htmlFor="confirm-rollback-checkbox" className="text-[11px] text-stone-700 leading-relaxed cursor-pointer font-bold">
                  أؤكد بصفتي مشرفاً بشرياً مصرحاً تنفيذ التراجع اليدوي إلى هذا الإصدار، وإلغاء تنشيط الإصدار الحالي، وتوثيق العملية بسجل التدقيق.
                </label>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRollbackModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 bg-stone-100 hover:bg-stone-200 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !rollbackTargetId || !rollbackConfirmed || !rollbackReason.trim()}
                  className="px-5 py-2 rounded-xl text-white bg-purple-700 hover:bg-purple-800 font-bold shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>تنفيذ التراجع اليدوي الآمن</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW SNAPSHOT */}
      {selectedSnapshotVersion && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-teal-700" />
                <div>
                  <h3 className="font-bold text-sm text-stone-800">
                    Snapshot إعدادات: {selectedSnapshotVersion.version_label}
                  </h3>
                  <span className="text-[11px] font-mono text-stone-500">ID #{selectedSnapshotVersion.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSnapshotVersion(null)}
                className="text-stone-400 hover:text-stone-600 text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between bg-stone-50 p-2.5 rounded-xl border border-stone-200 font-mono text-[11px]">
                <span className="text-stone-500">SHA-256 Checksum:</span>
                <div className="flex items-center gap-1.5 text-stone-800">
                  <span>{selectedSnapshotVersion.latest_checksum || "sha256-standard"}</span>
                  <button
                    onClick={() => handleCopyChecksum(selectedSnapshotVersion.latest_checksum || "")}
                    className="text-stone-400 hover:text-stone-700 p-0.5"
                  >
                    {copiedChecksum ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="font-bold text-stone-700 block mb-1">محتوى الـ Snapshot:</span>
                <pre className="p-3 bg-stone-900 text-teal-300 rounded-xl overflow-x-auto text-[11px] font-mono max-h-72">
                  {JSON.stringify(selectedSnapshotVersion.config_snapshot_json ?? {}, null, 2)}
                </pre>
              </div>

              <div>
                <span className="font-bold text-stone-700 block mb-1">بيانات الـ Metadata:</span>
                <pre className="p-2.5 bg-stone-100 text-stone-700 rounded-xl overflow-x-auto text-[11px] font-mono max-h-36">
                  {JSON.stringify(selectedSnapshotVersion.metadata_json ?? {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setSelectedSnapshotVersion(null)}
                className="px-4 py-2 rounded-xl text-white bg-teal-700 hover:bg-teal-800 font-bold cursor-pointer text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
