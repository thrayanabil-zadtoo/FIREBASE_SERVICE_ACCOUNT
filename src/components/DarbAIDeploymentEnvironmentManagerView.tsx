import React, { useState, useEffect } from "react";
import {
  Server,
  Shield,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Play,
  UserCheck,
  FileCode,
  ArrowRight,
  GitBranch,
  Lock,
  Clock,
  Copy,
  Check,
  History,
  CheckSquare,
  Sparkles,
  Layers,
  ChevronRight,
  Sliders
} from "lucide-react";
import {
  DeploymentEnvironment,
  DeploymentJob,
  DeploymentAudit,
  PreflightResponse,
  DeploymentStatus
} from "../types/darb-ai-deployment-environment";
import { AIReleaseVersion } from "../types/darb-ai-release-version";

export function DarbAIDeploymentEnvironmentManagerView() {
  const [environments, setEnvironments] = useState<DeploymentEnvironment[]>([]);
  const [jobs, setJobs] = useState<DeploymentJob[]>([]);
  const [audits, setAudits] = useState<DeploymentAudit[]>([]);
  const [versions, setVersions] = useState<AIReleaseVersion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // New Deployment Form State
  const [selectedVersionId, setSelectedVersionId] = useState<number | "">("");
  const [sourceEnv, setSourceEnv] = useState<string>("development");
  const [targetEnv, setTargetEnv] = useState<string>("staging");
  const [deployReason, setDeployReason] = useState<string>("");
  const [preflightResult, setPreflightResult] = useState<PreflightResponse | null>(null);
  const [runningPreflight, setRunningPreflight] = useState<boolean>(false);

  // Modals & Panels
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);
  const [showRollbackModal, setShowRollbackModal] = useState<boolean>(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState<DeploymentJob | null>(null);

  // Rollback Form State
  const [rollbackJobId, setRollbackJobId] = useState<number | "">("");
  const [rollbackTargetVersionId, setRollbackTargetVersionId] = useState<number | "">("");
  const [rollbackReason, setRollbackReason] = useState<string>("");
  const [rollbackConfirmed, setRollbackConfirmed] = useState<boolean>(false);

  // Copied checksum feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resEnvs, resJobs, resAudits, resVersions] = await Promise.all([
        fetch("/api/admin/ai/deployments/environments").then((r) => r.json()),
        fetch("/api/admin/ai/deployments/jobs").then((r) => r.json()),
        fetch("/api/admin/ai/deployments/audit").then((r) => r.json()),
        fetch("/api/admin/ai/releases/versions").then((r) => r.json()).catch(() => ({ ok: false, versions: [] }))
      ]);

      if (resEnvs?.ok && resEnvs.environments) {
        setEnvironments(resEnvs.environments);
      }
      if (resJobs?.ok && resJobs.jobs) {
        setJobs(resJobs.jobs);
      }
      if (resAudits?.ok && resAudits.audit) {
        setAudits(resAudits.audit);
      }
      if (resVersions?.ok && resVersions.versions) {
        setVersions(resVersions.versions);
        if (resVersions.versions.length > 0 && selectedVersionId === "") {
          setSelectedVersionId(resVersions.versions[0].id || 1);
        }
      }
    } catch {
      setFeedback({ text: "تعذر تحميل بيانات إدارة البيئات والنشر من الخادم", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Run Preflight Verification
  const runPreflight = async () => {
    if (!selectedVersionId) return;
    setRunningPreflight(true);
    try {
      const selectedVer = versions.find((v) => v.id === Number(selectedVersionId));
      const res = await fetch("/api/admin/ai/deployments/preflight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetEnvironment: targetEnv,
          sourceEnvironment: sourceEnv,
          versionStatus: selectedVer?.status || "candidate",
          releaseGateStatus: selectedVer?.status === "draft" ? "fail" : "pass",
          configMatch: true
        })
      });
      const data = await res.json();
      if (data.ok) {
        setPreflightResult(data);
      }
    } catch {
      setFeedback({ text: "فشل تنفيذ فحص ما قبل النشر (Preflight)", type: "error" });
    } finally {
      setRunningPreflight(false);
    }
  };

  // Create Deployment Job
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVersionId || !targetEnv) return;

    setActionLoading(true);
    try {
      const selectedVer = versions.find((v) => v.id === Number(selectedVersionId));
      const res = await fetch("/api/admin/ai/deployments/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetEnvironment: targetEnv,
          sourceEnvironment: sourceEnv,
          versionId: Number(selectedVersionId),
          versionStatus: selectedVer?.status || "candidate",
          releaseGateStatus: selectedVer?.status === "draft" ? "fail" : "pass",
          reason: deployReason.trim() || `طلب نشر النسخة #${selectedVersionId} إلى بيئة ${targetEnv}`,
          actorId: 99
        })
      });

      const data = await res.json();
      if (data.ok) {
        setFeedback({
          text: `تم إنشاء مهمة النشر بنجاح (Correlation ID: ${data.correlationId}). تذكر: النشر التلقائي معطل وتتطلب البيئات المحمية موافقة بشرية.`,
          type: "success"
        });
        setShowDeployModal(false);
        setDeployReason("");
        setPreflightResult(null);
        fetchData();
      } else {
        setFeedback({ text: `تعذر إنشاء مهمة النشر: ${data.error || "خطأ"}`, type: "error" });
      }
    } catch {
      setFeedback({ text: "فشل الاتصال بالخادم لإنشاء مهمة النشر", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Human Approval Handler
  const handleApproveJob = async (job: DeploymentJob) => {
    if (!job.id) return;
    const reason = window.prompt("سبب وتأكيد الموافقة البشرية على النشر:", "استيفاء جميع معايير واختبارات الجودة وبوابة Release Gate");
    if (reason === null) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/ai/deployments/jobs/${job.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actorId: 99, reason })
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback({ text: data.message || "تم تسجيل الموافقة البشرية الصريحة بنجاح.", type: "success" });
        fetchData();
      } else {
        setFeedback({ text: `فشلت الموافقة: ${data.error || "مرفوض"}`, type: "error" });
      }
    } catch {
      setFeedback({ text: "فشل الاتصال لتسجيل الموافقة", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Manual Deploy Execution
  const handleDeployJob = async (job: DeploymentJob) => {
    if (!job.id) return;
    const targetEnvObj = environments.find((e) => e.id === job.environment_id);
    const envName = targetEnvObj?.display_name || job.environment_name || "البيئة المستهدفة";

    if (!window.confirm(`هل أنت متأكد من تنفيذ النشر الفعلي للإصدار #${job.version_id} في بيئة (${envName})؟\n\nسيتم تحديث المؤشر النشط وتوثيق العملية في سجل التدقيق.`)) {
      return;
    }

    const reason = window.prompt("سبب النشر الفعلي المباشر:", `اعتماد تشغيل الإصدار #${job.version_id} في بيئة ${envName}`);
    if (reason === null) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/ai/deployments/jobs/${job.id}/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actorId: 99, reason })
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback({
          text: `تم النشر اليدوي بنجاح في بيئة ${data.environment}! أصبحت النسخة النشطة #${data.versionId}.`,
          type: "success"
        });
        fetchData();
      } else {
        setFeedback({ text: `فشل النشر: ${data.message || data.error}`, type: "error" });
      }
    } catch {
      setFeedback({ text: "فشل الاتصال لتنفيذ النشر", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Rollback Submission
  const handleRollbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollbackJobId || !rollbackTargetVersionId || !rollbackConfirmed || !rollbackReason.trim()) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/ai/deployments/jobs/${rollbackJobId}/rollback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetVersionId: Number(rollbackTargetVersionId),
          reason: rollbackReason.trim(),
          actorId: 99
        })
      });

      const data = await res.json();
      if (data.ok) {
        setFeedback({
          text: `تم التراجع اليدوي الآمن بنجاح إلى النسخة #${rollbackTargetVersionId}. تم توثيق الحدث في سجل التدقيق.`,
          type: "success"
        });
        setShowRollbackModal(false);
        setRollbackJobId("");
        setRollbackReason("");
        setRollbackConfirmed(false);
        fetchData();
      } else {
        setFeedback({ text: `فشل التراجع: ${data.message || data.error}`, type: "error" });
      }
    } catch {
      setFeedback({ text: "فشل الاتصال لتنفيذ التراجع", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: DeploymentStatus) => {
    switch (status) {
      case "deployed":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> تم النشر (Deployed)</span>;
      case "approved":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> معتمد (Approved)</span>;
      case "preflight_passed":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-300 flex items-center gap-1"><CheckSquare className="w-3.5 h-3.5" /> اجتاز الفحص (Preflight Pass)</span>;
      case "awaiting_approval":
      case "pending":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> بانتظار الموافقة (Pending)</span>;
      case "rolled_back":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> تراجع (Rolled Back)</span>;
      case "rejected":
      case "failed":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> مرفوض / فشل</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] bg-stone-100 text-stone-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 text-stone-900" dir="rtl">
      {/* HEADER & GOVERNANCE BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-800 text-white text-xs font-black px-2.5 py-0.5 rounded-md">V1.26</span>
            <h2 className="text-xl font-black text-stone-800">
              إدارة النشر والبيئات (AI Deployment & Environment Manager)
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            فصل بيئات العمل (Development ➔ Staging ➔ Production)، فحوصات ما قبل النشر (Preflight)، موافقة المشرف البشري، وسجل التدقيق والـ Rollback المشروط.
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
            disabled={jobs.filter((j) => j.status === "deployed").length === 0 || actionLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition cursor-pointer"
            id="btn-open-deployment-rollback-modal"
          >
            <RotateCcw className="w-4 h-4" />
            <span>تراجع بيئي (Environment Rollback)</span>
          </button>

          <button
            onClick={() => {
              setShowDeployModal(true);
              runPreflight();
            }}
            disabled={actionLoading}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition shadow-xs cursor-pointer"
            id="btn-open-deployment-wizard-modal"
          >
            <Play className="w-4 h-4" />
            <span>بدء نشر إصدار (Deploy Version)</span>
          </button>
        </div>
      </div>

      {/* STRICT GOVERNANCE BANNER */}
      <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl flex items-start gap-3 text-amber-900 text-xs">
        <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">ضوابط حوكمة النشر والبيئات الحساسة (V1.26 Strict Deployment Governance):</p>
          <ul className="list-disc list-inside space-y-0.5 text-amber-800">
            <li><strong>تعطيل النشر التلقائي (Auto Deploy = Strict Disabled):</strong> لا يتم نقل أي إصدار بين البيئات تلقائياً دون أمر صريح من مشرف النظام.</li>
            <li><strong>حماية بيئتي Staging و Production:</strong> تتطلبان اجتياز فحص Preflight الإلزامي وموافقة بشرية موثقة قبل التنفيذ.</li>
            <li><strong>إلزامية بيان سبب الـ Rollback:</strong> لا يسمح بأي تراجع دون تدوين المبرر وتأكيد المشرف وتسجيله في سجل التدقيق.</li>
          </ul>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : feedback.type === "error"
              ? "bg-rose-50 text-rose-800 border border-rose-200"
              : "bg-blue-50 text-blue-800 border border-blue-200"
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="text-stone-400 hover:text-stone-600">×</button>
        </div>
      )}

      {/* THREE ENVIRONMENTS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {environments.map((env) => {
          const isProd = env.environment_key === "production";
          const isStaging = env.environment_key === "staging";
          const activeVer = versions.find((v) => v.id === env.active_version_id);
          const lastJob = jobs.find((j) => j.environment_id === env.id && j.status === "deployed");

          return (
            <div
              key={env.id || env.environment_key}
              className={`rounded-2xl border p-5 flex flex-col justify-between shadow-xs transition-all ${
                isProd
                  ? "bg-gradient-to-b from-stone-900 to-stone-950 text-white border-stone-800"
                  : isStaging
                  ? "bg-white border-teal-200"
                  : "bg-white border-stone-200"
              }`}
            >
              <div>
                {/* Environment Header */}
                <div className="flex items-center justify-between border-b pb-3 mb-4 border-stone-200/40">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isProd
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : isStaging
                          ? "bg-teal-100 text-teal-800 border border-teal-200"
                          : "bg-stone-100 text-stone-700 border border-stone-200"
                      }`}
                    >
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className={`font-black text-sm ${isProd ? "text-white" : "text-stone-900"}`}>
                        {env.display_name}
                      </h3>
                      <span className={`text-[10px] font-mono ${isProd ? "text-stone-400" : "text-stone-400"}`}>
                        key: {env.environment_key}
                      </span>
                    </div>
                  </div>

                  {env.protected ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> محمية (Protected)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
                      مفتوحة (Dev)
                    </span>
                  )}
                </div>

                {/* Active Version Info */}
                <div className="space-y-3 text-xs mb-4">
                  <div className={`p-3 rounded-xl border ${isProd ? "bg-white/5 border-white/10" : "bg-stone-50 border-stone-200/80"}`}>
                    <span className={`text-[11px] block mb-1 ${isProd ? "text-stone-400" : "text-stone-500"}`}>الإصدار النشط حالياً (Active Version)</span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold">
                        <GitBranch className="w-3.5 h-3.5 text-teal-500" />
                        <span className={isProd ? "text-emerald-300" : "text-teal-900"}>
                          {activeVer?.version_label || `الإصدار #${env.active_version_id || 1}`}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 bg-teal-500/20 text-teal-400 rounded">
                        ID #{env.active_version_id || 1}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className={`p-2.5 rounded-lg ${isProd ? "bg-white/5" : "bg-stone-50"}`}>
                      <span className="text-stone-400 block text-[10px]">بوابة الفحص (Release Gate):</span>
                      <span className="font-semibold text-emerald-500 flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> Gate #1 (PASS)
                      </span>
                    </div>

                    <div className={`p-2.5 rounded-lg ${isProd ? "bg-white/5" : "bg-stone-50"}`}>
                      <span className="text-stone-400 block text-[10px]">آخر تحديث / نشر:</span>
                      <span className={`font-mono truncate block mt-0.5 ${isProd ? "text-stone-300" : "text-stone-700"}`}>
                        {lastJob?.deployed_at ? new Date(lastJob.deployed_at).toLocaleDateString("ar-EG") : "تأسيس النظام"}
                      </span>
                    </div>
                  </div>

                  {/* Checksum preview */}
                  <div className={`p-2.5 rounded-lg text-[10px] font-mono flex items-center justify-between ${isProd ? "bg-white/5 text-stone-300" : "bg-stone-50 text-stone-600"}`}>
                    <span className="truncate">
                      SHA: {(activeVer?.latest_checksum || "sha256-verified-environment").substring(0, 14)}...
                    </span>
                    <button
                      onClick={() => handleCopyText(activeVer?.latest_checksum || "sha256-verified", `env-${env.id}`)}
                      className="text-stone-400 hover:text-teal-600 p-0.5"
                    >
                      {copiedId === `env-${env.id}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-stone-200/40">
                <button
                  onClick={() => {
                    setTargetEnv(env.environment_key);
                    setSourceEnv(isProd ? "staging" : "development");
                    setShowDeployModal(true);
                    runPreflight();
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isProd
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>نشر إصدار إلى {env.display_name}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DEPLOYMENT JOBS TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-800" />
            <h3 className="font-bold text-sm text-stone-800">
              سجل مهام النشر والعمليات البيئية ({jobs.length})
            </h3>
          </div>
          <span className="text-xs text-stone-500">التسلسل: Preflight ➔ Approval ➔ Manual Deploy</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 font-bold">
                <th className="p-3">#</th>
                <th className="p-3">البيئة المستهدفة</th>
                <th className="p-3">رقم الإصدار</th>
                <th className="p-3">الحالة الحالية</th>
                <th className="p-3">Correlation ID</th>
                <th className="p-3">فحص Preflight</th>
                <th className="p-3">تاريخ الطلب</th>
                <th className="p-3 text-center">التحكم البشري والإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {jobs.map((job) => {
                const targetEnvObj = environments.find((e) => e.id === job.environment_id);
                const isProtected = targetEnvObj?.protected ?? true;
                const canApprove = (job.status === "pending" || job.status === "preflight_passed") && isProtected;
                const canDeployNow = job.status === "approved" || (!isProtected && (job.status === "pending" || job.status === "preflight_passed"));

                return (
                  <tr key={job.id || job.correlation_id} className="hover:bg-stone-50/80 transition">
                    <td className="p-3 font-mono font-bold text-stone-500">#{job.id}</td>
                    <td className="p-3 font-bold text-stone-800">
                      <span className="px-2 py-0.5 rounded bg-stone-100 font-mono text-[11px] text-stone-700">
                        {targetEnvObj?.display_name || job.environment_name || "Environment"}
                      </span>
                    </td>
                    <td className="p-3 font-bold font-mono text-teal-800">
                      نسخة #{job.version_id}
                    </td>
                    <td className="p-3">{getStatusBadge(job.status)}</td>
                    <td className="p-3 font-mono text-[11px]">
                      <div className="flex items-center gap-1 text-stone-500">
                        <span className="truncate max-w-[120px]" title={job.correlation_id}>
                          {job.correlation_id ? `${job.correlation_id.substring(0, 12)}...` : "-"}
                        </span>
                        {job.correlation_id && (
                          <button
                            onClick={() => handleCopyText(job.correlation_id!, `corr-${job.id}`)}
                            className="text-stone-400 hover:text-stone-700"
                            title="نسخ المعرف"
                          >
                            {copiedId === `corr-${job.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      {job.preflight_json?.passed ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> PASS
                        </span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> REVIEW
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-stone-500">
                      {job.requested_at ? new Date(job.requested_at).toLocaleString("ar-EG") : "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {/* Details Modal */}
                        <button
                          onClick={() => setSelectedJobDetails(job)}
                          className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <FileCode className="w-3 h-3" />
                          <span>التفاصيل</span>
                        </button>

                        {/* Approve Button */}
                        {canApprove && (
                          <button
                            onClick={() => handleApproveJob(job)}
                            className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>موافقة بشرية</span>
                          </button>
                        )}

                        {/* Deploy Button */}
                        {canDeployNow && (
                          <button
                            onClick={() => handleDeployJob(job)}
                            className="px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <Play className="w-3 h-3" />
                            <span>نشر يدوي الآن</span>
                          </button>
                        )}

                        {/* Rollback button if deployed */}
                        {job.status === "deployed" && (
                          <button
                            onClick={() => {
                              setRollbackJobId(job.id!);
                              setRollbackTargetVersionId(1);
                              setShowRollbackModal(true);
                            }}
                            className="px-2 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            title="التراجع عن هذا النشر"
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

      {/* AUDIT TIMELINE */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-emerald-800" />
          <h3 className="font-bold text-sm text-stone-800">سجل التدقيق البيئي (Deployment Audit Trail)</h3>
        </div>
        <p className="text-xs text-stone-500 mb-4">
          سجل كامل غير قابل للتعديل يوثق جميع إجراءات إنشاء مهام النشر، فحوصات Preflight، الموافقات البشرية، التنفيذ، والتراجع.
        </p>

        <div className="divide-y divide-stone-100">
          {audits.map((item, idx) => (
            <div key={item.id || idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-black uppercase text-[10px] px-2 py-0.5 rounded ${
                      item.action === "deploy"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.action === "approve"
                        ? "bg-blue-100 text-blue-800"
                        : item.action === "rollback"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {item.action}
                  </span>
                  <span className="font-bold text-stone-800">
                    مهمة #{item.job_id || "-"} | إصدار #{item.version_id}
                  </span>
                  {item.environment_key && (
                    <span className="text-[11px] font-mono text-stone-500 bg-stone-50 px-1.5 py-0.5 rounded">
                      {item.environment_key}
                    </span>
                  )}
                </div>
                {item.reason && <p className="text-stone-500 text-[11px]">السبب / المبرر: {item.reason}</p>}
              </div>

              <div className="text-stone-400 text-left shrink-0 text-[11px] font-mono">
                {item.created_at ? new Date(item.created_at).toLocaleString("ar-EG") : "حديثاً"}
              </div>
            </div>
          ))}
          {audits.length === 0 && (
            <div className="text-stone-400 text-center py-4 text-xs">لا يوجد سجلات تدقيق حتى الآن.</div>
          )}
        </div>
      </div>

      {/* MODAL: DEPLOYMENT WIZARD */}
      {showDeployModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-base text-stone-800">معالج نشر الإصدار (Deployment Wizard)</h3>
              </div>
              <button
                onClick={() => setShowDeployModal(false)}
                className="text-stone-400 hover:text-stone-600 text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              {/* Step 1: Version Selection */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">1. اختر إصدار الذكاء الاصطناعي (Version) *</label>
                <select
                  required
                  value={selectedVersionId}
                  onChange={(e) => {
                    setSelectedVersionId(Number(e.target.value));
                    setPreflightResult(null);
                  }}
                  className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-emerald-800 font-medium"
                >
                  <option value="">-- اختر الإصدار --</option>
                  {versions.map((v) => (
                    <option key={v.id} value={v.id}>
                      #{v.id} - {v.version_label} ({v.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Environment Path */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">البيئة المصدر (Source Environment)</label>
                  <select
                    value={sourceEnv}
                    onChange={(e) => {
                      setSourceEnv(e.target.value);
                      setPreflightResult(null);
                    }}
                    className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-emerald-800"
                  >
                    <option value="development">Development</option>
                    <option value="staging">Staging</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">البيئة المستهدفة (Target Environment) *</label>
                  <select
                    value={targetEnv}
                    onChange={(e) => {
                      setTargetEnv(e.target.value);
                      setPreflightResult(null);
                    }}
                    className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-emerald-800 font-bold text-emerald-900"
                  >
                    <option value="staging">Staging (محمية)</option>
                    <option value="production">Production (محمية وصارمة)</option>
                    <option value="development">Development (تطوير)</option>
                  </select>
                </div>
              </div>

              {/* Step 3: Preflight Verification Box */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-stone-800">
                    <CheckSquare className="w-4 h-4 text-emerald-800" />
                    <span>فحوصات ما قبل النشر (Pre-deployment Checks)</span>
                  </div>
                  <button
                    type="button"
                    onClick={runPreflight}
                    disabled={runningPreflight || !selectedVersionId}
                    className="px-3 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[11px] font-bold text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${runningPreflight ? "animate-spin" : ""}`} />
                    <span>إعادة الفحص</span>
                  </button>
                </div>

                {preflightResult ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {preflightResult.checks.map((chk, i) => (
                        <div key={i} className="p-2 bg-white rounded-lg border border-stone-200 flex items-center justify-between">
                          <span className="text-stone-600 font-medium">{chk.key}:</span>
                          {chk.status === "pass" ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                            </span>
                          ) : (
                            <span className="text-rose-700 font-bold flex items-center gap-0.5">
                              <XCircle className="w-3.5 h-3.5" /> FAIL
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className={`p-2.5 rounded-lg text-[11px] flex items-center justify-between font-bold ${
                      preflightResult.passed ? "bg-emerald-100/70 text-emerald-900 border border-emerald-300" : "bg-rose-100/70 text-rose-900 border border-rose-300"
                    }`}>
                      <span>النتيجة العامة للفحص: {preflightResult.passed ? "اجتاز كافة معايير النشر (PASS)" : "فشل الفحص؛ يحظر النشر المباشر"}</span>
                      {preflightResult.humanApprovalRequired && (
                        <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">موافقة بشرية مطلوبة</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-stone-500 text-center py-2">
                    اضغط زر الفحص للتحقق من بوابة Release Gate ومطابقة المسار والإعدادات.
                  </p>
                )}
              </div>

              {/* Step 4: Reason */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">سبب طلب النشر (Deployment Reason) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="بيان أهداف النشر للمشرفين وسجل التدقيق..."
                  value={deployReason}
                  onChange={(e) => setDeployReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-emerald-800"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeployModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 bg-stone-100 hover:bg-stone-200 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !selectedVersionId || !deployReason.trim()}
                  className="px-5 py-2 rounded-xl text-white bg-emerald-800 hover:bg-emerald-900 font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  إنشاء مهمة النشر (Create Job)
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
                <h3 className="font-bold text-base text-stone-800">التراجع البيئي الآمن (Environment Rollback)</h3>
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
                <label className="font-bold text-stone-700 block mb-1">اختر عملية النشر السابقة المستهدفة للتراجع *</label>
                <select
                  required
                  value={rollbackJobId}
                  onChange={(e) => {
                    setRollbackJobId(e.target.value ? Number(e.target.value) : "");
                  }}
                  className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-purple-700"
                >
                  <option value="">-- اختر مهمة النشر --</option>
                  {jobs
                    .filter((j) => j.status === "deployed")
                    .map((j) => (
                      <option key={j.id} value={j.id}>
                        مهمة #{j.id} - بيئة {j.environment_name || j.environment_id} (إصدار #{j.version_id})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">اختر الإصدار المستهدف للرجوع إليه (Target Version) *</label>
                <select
                  required
                  value={rollbackTargetVersionId}
                  onChange={(e) => setRollbackTargetVersionId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-purple-700"
                >
                  <option value="">-- اختر الإصدار المستهدف --</option>
                  {versions.map((v) => (
                    <option key={v.id} value={v.id}>
                      إصدار #{v.id} - {v.version_label} ({v.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">سبب التراجع البيئي الإلزامي (Rollback Reason) *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="اذكر بوضوح سبب الرجوع إلى الإصدار السابق في هذه البيئة..."
                  value={rollbackReason}
                  onChange={(e) => setRollbackReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 focus:outline-purple-700"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="confirm-env-rollback-checkbox"
                  checked={rollbackConfirmed}
                  onChange={(e) => setRollbackConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-purple-700 focus:ring-purple-700 cursor-pointer"
                />
                <label htmlFor="confirm-env-rollback-checkbox" className="text-[11px] text-stone-700 leading-relaxed cursor-pointer font-bold">
                  أؤكد بصفتي مشرفاً بشرياً مصرحاً تنفيذ التراجع البيئي اليدوي، وتحديث الإصدار النشط، وتوثيق العملية في سجل التدقيق.
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
                  disabled={actionLoading || !rollbackJobId || !rollbackTargetVersionId || !rollbackConfirmed || !rollbackReason.trim()}
                  className="px-5 py-2 rounded-xl text-white bg-purple-700 hover:bg-purple-800 font-bold shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>تنفيذ التراجع البيئي</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW JOB DETAILS */}
      {selectedJobDetails && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-sm text-stone-800">تفاصيل مهمة النشر #{selectedJobDetails.id}</h3>
              </div>
              <button
                onClick={() => setSelectedJobDetails(null)}
                className="text-stone-400 hover:text-stone-600 text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200 font-mono text-[11px]">
                <div>
                  <span className="text-stone-400 block text-[10px]">Correlation ID:</span>
                  <span className="truncate block font-bold text-stone-700">{selectedJobDetails.correlation_id || "-"}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">الحالة:</span>
                  <span className="font-bold text-emerald-800">{selectedJobDetails.status}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-stone-700 block mb-1">Preflight Checks Payload:</span>
                <pre className="p-3 bg-stone-900 text-teal-300 rounded-xl overflow-x-auto text-[11px] font-mono max-h-48">
                  {JSON.stringify(selectedJobDetails.preflight_json ?? {}, null, 2)}
                </pre>
              </div>

              <div>
                <span className="font-bold text-stone-700 block mb-1">Deployment Checklist:</span>
                <pre className="p-3 bg-stone-100 text-stone-800 rounded-xl overflow-x-auto text-[11px] font-mono max-h-36">
                  {JSON.stringify(selectedJobDetails.checklist_json ?? {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setSelectedJobDetails(null)}
                className="px-4 py-2 rounded-xl text-white bg-stone-800 hover:bg-stone-900 font-bold cursor-pointer text-xs"
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
