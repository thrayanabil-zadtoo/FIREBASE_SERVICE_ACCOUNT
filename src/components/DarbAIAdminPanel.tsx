import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  HelpCircle, 
  BookOpen, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Clock, 
  Globe2, 
  Tag,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  AlertTriangle,
  Check,
  X,
  Send,
  Layers,
  FileText,
  Filter,
  ArrowRight,
  Activity,
  Radio,
  BrainCircuit,
  GitFork,
  Lock,
  Server,
  FlaskConical
} from 'lucide-react';
import { 
  KnowledgeCandidate, 
  QualityReviewItem, 
  QualitySummaryData,
  KnowledgeCandidateStatus,
  QualityReviewDecision
} from '../types/darb-ai-quality.types';
import DarbAIMonitoringView from './DarbAIMonitoringView';
import DarbAILearningView from './DarbAILearningView';
import DarbAIOrchestratorView from './DarbAIOrchestratorView';
import DarbAISecurityView from './DarbAISecurityView';
import DarbAIResilienceView from './DarbAIResilienceView';
import DarbAIEvaluationLabView from './DarbAIEvaluationLabView';
import { DarbAIKnowledgeRefreshView } from './DarbAIKnowledgeRefreshView';

interface KnowledgeItem {
  id: string | number;
  slug: string;
  title: string;
  content: string;
  country_code?: string | null;
  city_name?: string | null;
  status?: string;
  updated_at?: string;
}

interface UnansweredItem {
  question: string;
  occurrences: number;
  last_seen: string;
}

export default function DarbAIAdminPanel() {
  const [activeTab, setActiveTab] = useState<'refresh' | 'evaluation' | 'resilience' | 'security' | 'orchestrator' | 'governance' | 'reviews' | 'summary' | 'monitoring' | 'learning' | 'knowledge'>('refresh');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // V1.15 State
  const [summary, setSummary] = useState<QualitySummaryData | null>(null);
  const [candidates, setCandidates] = useState<KnowledgeCandidate[]>([]);
  const [candidateFilter, setCandidateFilter] = useState<string>('all');
  const [reviews, setReviews] = useState<QualityReviewItem[]>([]);
  
  // Note / revision modal state
  const [reviewNoteInput, setReviewNoteInput] = useState<Record<string, string>>({});
  const [candidateNoteInput, setCandidateNoteInput] = useState<Record<number, string>>({});
  const [newCandidateOpen, setNewCandidateOpen] = useState(false);
  const [newCandidateForm, setNewCandidateForm] = useState({
    question: '',
    proposedAnswer: '',
    sourceType: 'admin' as const,
  });

  // V1.11 Knowledge Base State (Preserved)
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [unanswered, setUnanswered] = useState<UnansweredItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [form, setForm] = useState({
    slug: '',
    title: '',
    content: '',
    country_code: '',
    city_name: '',
    status: 'published',
  });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [kRes, uRes, sumRes, candRes, revRes] = await Promise.all([
        fetch('/api/admin/ai/knowledge', { credentials: 'include' }),
        fetch('/api/admin/ai/unanswered', { credentials: 'include' }),
        fetch('/api/admin/ai/quality-summary', { credentials: 'include' }),
        fetch(`/api/admin/ai/knowledge-candidates?status=${candidateFilter}`, { credentials: 'include' }),
        fetch('/api/admin/ai/quality-reviews?limit=100', { credentials: 'include' }),
      ]);

      if (kRes.ok) {
        const d = await kRes.json();
        setItems(d.data || []);
      }
      if (uRes.ok) {
        const d = await uRes.json();
        setUnanswered(d.data || []);
      }
      if (sumRes.ok) {
        const d = await sumRes.json();
        setSummary(d);
      }
      if (candRes.ok) {
        const d = await candRes.json();
        setCandidates(d.items || []);
      }
      if (revRes.ok) {
        const d = await revRes.json();
        setReviews(d.items || []);
      }
    } catch (err) {
      console.warn('[DARB AI ADMIN] Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [candidateFilter]);

  // V1.15: Handle Candidate Status Update
  const handleUpdateCandidate = async (
    candidateId: number, 
    status: KnowledgeCandidateStatus, 
    publishToKnowledge = false
  ) => {
    try {
      const reviewNote = candidateNoteInput[candidateId] || undefined;
      const res = await fetch(`/api/admin/ai/knowledge-candidates/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          status,
          reviewNote,
          publishToKnowledge,
        }),
      });

      if (res.ok) {
        setMsg({
          type: 'success',
          text: publishToKnowledge 
            ? '✅ تم اعتماد المقترح ونشره رسمياً إلى قاعدة المعرفة بنجاح!' 
            : `✅ تم تحديث حالة المقترح إلى (${status})`,
        });
        loadAll();
      } else {
        const d = await res.json().catch(() => ({}));
        setMsg({ type: 'error', text: d.error || 'تعذر تحديث المقترح' });
      }
    } catch {
      setMsg({ type: 'error', text: 'خطأ في الاتصال بالخادم' });
    }
  };

  // V1.15: Handle Create Candidate
  const handleCreateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateForm.question.trim()) {
      setMsg({ type: 'error', text: 'يرجى إدخال السؤال' });
      return;
    }

    try {
      const res = await fetch('/api/admin/ai/knowledge-candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          question: newCandidateForm.question,
          proposedAnswer: newCandidateForm.proposedAnswer,
          sourceType: newCandidateForm.sourceType,
        }),
      });

      if (res.ok) {
        setMsg({ type: 'success', text: '✅ تم إنشاء مقترح المعرفة وبانتظار المراجعة والاعتماد' });
        setNewCandidateForm({ question: '', proposedAnswer: '', sourceType: 'admin' });
        setNewCandidateOpen(false);
        loadAll();
      } else {
        const d = await res.json().catch(() => ({}));
        setMsg({ type: 'error', text: d.error || 'تعذر إنشاء المقترح' });
      }
    } catch {
      setMsg({ type: 'error', text: 'خطأ في الاتصال بالخادم' });
    }
  };

  // V1.15: Handle Review Answer Run
  const handleReviewAnswer = async (answerRunId: string | number, decision: QualityReviewDecision) => {
    try {
      const note = reviewNoteInput[String(answerRunId)] || undefined;
      const res = await fetch('/api/admin/ai/quality-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          answerRunId,
          decision,
          note,
        }),
      });

      if (res.ok) {
        setMsg({ type: 'success', text: `✅ تم تسجيل قرار المراجعة كـ (${decision})` });
        loadAll();
      } else {
        const d = await res.json().catch(() => ({}));
        setMsg({ type: 'error', text: d.error || 'تعذر حفظ المراجعة' });
      }
    } catch {
      setMsg({ type: 'error', text: 'خطأ في الاتصال بالخادم' });
    }
  };

  // V1.15: Convert Unanswered or Answer to Candidate
  const handleConvertToCandidate = (question: string, initialAnswer?: string, runId?: number | string) => {
    setNewCandidateForm({
      question,
      proposedAnswer: initialAnswer || '',
      sourceType: runId ? 'low_rating' : 'unanswered',
    });
    setNewCandidateOpen(true);
    setActiveTab('governance');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // V1.11 Handlers (Preserved)
  const handleAddKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!form.title.trim() || !form.content.trim()) {
      setMsg({ type: 'error', text: 'يرجى إدخال العنوان والمحتوى على الأقل' });
      return;
    }

    const finalSlug = form.slug.trim() || 'kn_' + Date.now().toString(36);
    setSubmitting(true);
    try {
      const r = await fetch('/api/admin/ai/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, slug: finalSlug }),
      });

      if (r.ok) {
        setMsg({ type: 'success', text: '✅ تمت إضافة المعلومة لقاعدة المعرفة بنجاح' });
        setForm({
          slug: '',
          title: '',
          content: '',
          country_code: '',
          city_name: '',
          status: 'published',
        });
        await loadAll();
      } else {
        const errData = await r.json().catch(() => ({}));
        setMsg({ type: 'error', text: errData.error || 'تعذر إضافة المعلومة، تحقق من الصلاحيات' });
      }
    } catch {
      setMsg({ type: 'error', text: 'خطأ في الاتصال بالخادم' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteKnowledge = async (id: string | number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المعلومة من قاعدة المعرفة؟')) return;
    try {
      const res = await fetch(`/api/admin/ai/knowledge/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setMsg({ type: 'success', text: 'تم حذف المعلومة بنجاح' });
        loadAll();
      } else {
        setMsg({ type: 'error', text: 'تعذر حذف المعلومة' });
      }
    } catch {
      setMsg({ type: 'error', text: 'خطأ في الاتصال أثناء الحذف' });
    }
  };

  const filteredItems = items.filter(
    (x) =>
      x.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      x.content.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (x.city_name && x.city_name.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (x.country_code && x.country_code.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  // Calculations for summary cards
  const helpfulCount = summary?.ratings?.find((r) => r.rating === 'helpful')?.count || 0;
  const notHelpfulCount = summary?.ratings?.find((r) => r.rating === 'not_helpful')?.count || 0;
  const totalFeedback = helpfulCount + notHelpfulCount;
  const satisfactionRate = totalFeedback > 0 ? Math.round((helpfulCount / totalFeedback) * 100) : 100;
  const pendingCandidatesCount = candidates.filter((c) => c.status === 'pending').length;

  return (
    <div dir="rtl" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#071a2b] to-[#0f2c42] rounded-2xl p-5 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#1bb49e]/20 border border-[#1bb49e]/40 text-[#8be4d4] rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">DARB AI — جودة وتحديث المعرفة ومختبر التقييم الآلي (V1.22)</h2>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-md font-bold">
                V1.22 Knowledge Refresh
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-1">
              إدارة جودة المعرفة (Fresh/Aging/Stale) وطوابير التحديث بالأدلة والمراجعة البشرية، مع مختبر التقييم وموثوقية التشغيل والحظر الصارم للنشر التلقائي.
            </p>
          </div>
        </div>

        <button
          onClick={loadAll}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-200 bg-white/10 hover:bg-white/20 transition-colors cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>تحديث البيانات</span>
        </button>
      </div>

      {/* Status Message Alert */}
      {msg && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center justify-between gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {msg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{msg.text}</span>
          </div>
          <button onClick={() => setMsg(null)} className="text-stone-400 hover:text-stone-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 font-semibold block">رضا المستخدمين</span>
            <span className="text-xl font-black text-stone-900 mt-1 block">{satisfactionRate}%</span>
            <span className="text-[10px] text-stone-400">
              {helpfulCount} مفيدة / {notHelpfulCount} غير مفيدة
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ThumbsUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 font-semibold block">مقترحات قيد الاعتماد</span>
            <span className="text-xl font-black text-amber-600 mt-1 block">{pendingCandidatesCount}</span>
            <span className="text-[10px] text-stone-400">تحتاج موافقة المشرف</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 font-semibold block">إجابات تم توليدها</span>
            <span className="text-xl font-black text-stone-900 mt-1 block">{reviews.length}</span>
            <span className="text-[10px] text-stone-400">متاحة للمراجعة والتدقيق</span>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 font-semibold block">معلومات معتمدة</span>
            <span className="text-xl font-black text-[#1bb49e] mt-1 block">{items.length}</span>
            <span className="text-[10px] text-stone-400">في قاعدة المعرفة الرسمية</span>
          </div>
          <div className="p-3 bg-[#1bb49e]/10 text-[#1bb49e] rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('refresh')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'refresh'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
          id="tab-btn-v122-refresh"
        >
          <RefreshCw className="w-4 h-4" />
          <span>جودة وتحديث المعرفة (V1.22)</span>
        </button>

        <button
          onClick={() => setActiveTab('evaluation')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'evaluation'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>مختبر ومشغّل التقييم (V1.21 / V1.23)</span>
        </button>

        <button
          onClick={() => setActiveTab('resilience')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'resilience'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>موثوقية التشغيل (V1.20)</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'security'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>الحماية والاستهلاك (V1.19)</span>
        </button>

        <button
          onClick={() => setActiveTab('orchestrator')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'orchestrator'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <GitFork className="w-4 h-4" />
          <span>منسّق الذكاء الاصطناعي (V1.18)</span>
        </button>

        <button
          onClick={() => setActiveTab('governance')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'governance'
              ? 'bg-[#1bb49e] text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>حوكمة مقترحات المعرفة</span>
          {pendingCandidatesCount > 0 && (
            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {pendingCandidatesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-[#071a2b] text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>مراجعة جودة الإجابات ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'summary'
              ? 'bg-stone-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>إحصاءات الأدلة ومستوى الثقة</span>
        </button>

        <button
          onClick={() => setActiveTab('monitoring')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'monitoring'
              ? 'bg-cyan-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>مراقبة DARB AI (V1.16)</span>
        </button>

        <button
          onClick={() => setActiveTab('learning')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'learning'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>التعلّم الذاتي وتطوّر المعرفة (V1.17)</span>
        </button>

        <button
          onClick={() => setActiveTab('knowledge')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'knowledge'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>قاعدة المعرفة والأسئلة غير المجابة</span>
        </button>
      </div>

      {/* TAB 1: KNOWLEDGE CANDIDATES GOVERNANCE */}
      {activeTab === 'governance' && (
        <div className="space-y-4">
          {/* Governance Notice Banner */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-amber-950">مبدأ الحوكمة وعدم النشر التلقائي:</h4>
              <p className="leading-relaxed">
                لا يقوم نظام DARB AI بإضافة أو تعديل أي معلومة في قاعدة المعرفة تلقائياً تحت أي ظرف. 
                أي استفسار غير مجاب أو إجابة تلقت تقييماً سلبياً تدخل قائمة مقترحات المعرفة، 
                ويجب على المشرف مراجعتها واعتماد النشر يدوياً لضمان الدقة والمصداقية.
              </p>
            </div>
          </div>

          {/* Controls: Filter & Add Candidate Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-stone-600 shrink-0 inline-flex items-center gap-1">
                <Filter className="w-3 h-3" />
                تصفية الحالة:
              </span>
              {(['all', 'pending', 'approved', 'needs_revision', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setCandidateFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                    candidateFilter === st
                      ? 'bg-[#1bb49e] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {st === 'all' && 'الكل'}
                  {st === 'pending' && 'قيد المراجعة'}
                  {st === 'approved' && 'معتمد'}
                  {st === 'needs_revision' && 'يحتاج تعديل'}
                  {st === 'rejected' && 'مرفوض'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setNewCandidateOpen(!newCandidateOpen)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#071a2b] hover:bg-[#0f2c42] transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة مقترح معرفة جديد</span>
            </button>
          </div>

          {/* Create Candidate Form (Collapsible) */}
          {newCandidateOpen && (
            <form
              onSubmit={handleCreateCandidate}
              className="bg-white border border-[#1bb49e]/30 rounded-2xl p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h4 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#1bb49e]" />
                  <span>صياغة مقترح معرفة جديد للمراجعة</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setNewCandidateOpen(false)}
                  className="text-stone-400 hover:text-stone-700 text-xs"
                >
                  إلغاء
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">السؤال أو الاستفسار *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كيفية تجديد الإقامة للمرافقين في السعودية؟"
                  value={newCandidateForm.question}
                  onChange={(e) => setNewCandidateForm({ ...newCandidateForm, question: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#1bb49e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">الإجابة المقترحة المعتمدة</label>
                <textarea
                  rows={4}
                  placeholder="اكتب الإجابة والخطوات الرسمية الدقيقة الموصى بها..."
                  value={newCandidateForm.proposedAnswer}
                  onChange={(e) => setNewCandidateForm({ ...newCandidateForm, proposedAnswer: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#1bb49e] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewCandidateOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  إغلاق
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#1bb49e] hover:bg-[#159a86] transition-colors cursor-pointer shadow-xs"
                >
                  حفظ في قائمة المراجعة (قيد الاعتماد)
                </button>
              </div>
            </form>
          )}

          {/* Candidates List */}
          {candidates.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400 bg-white border border-stone-200 rounded-2xl">
              لا توجد مقترحات معرفة تطابق التصفية الحالية.
            </div>
          ) : (
            <div className="space-y-3">
              {candidates.map((cand) => (
                <div
                  key={cand.id}
                  className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                        #{cand.id}
                      </span>
                      <h4 className="text-xs font-bold text-stone-900">{cand.question}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-mono">
                        المصدر: {cand.source_type === 'unanswered' ? 'سؤال غير مجاب' : cand.source_type === 'low_rating' ? 'تقييم منخفض' : 'إداري'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          cand.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cand.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : cand.status === 'needs_revision'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {cand.status === 'approved' && 'معتمد'}
                        {cand.status === 'rejected' && 'مرفوض'}
                        {cand.status === 'needs_revision' && 'يحتاج تعديل'}
                        {cand.status === 'pending' && 'قيد المراجعة'}
                      </span>
                    </div>
                  </div>

                  {cand.proposed_answer ? (
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                      {cand.proposed_answer}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-400 italic">لم تتم كتابة إجابة مقترحة بعد.</p>
                  )}

                  {cand.review_note && (
                    <div className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200/60 p-2 rounded-lg">
                      <span className="font-bold">ملاحظة المراجع: </span>
                      {cand.review_note}
                    </div>
                  )}

                  {/* Actions & Note Input */}
                  <div className="pt-2 border-t border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <input
                      type="text"
                      placeholder="أضف ملاحظة توجيهية أو تعديل مقترح..."
                      value={candidateNoteInput[cand.id] || ''}
                      onChange={(e) =>
                        setCandidateNoteInput({ ...candidateNoteInput, [cand.id]: e.target.value })
                      }
                      className="text-xs px-2.5 py-1.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#1bb49e] flex-1"
                    />

                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleUpdateCandidate(cand.id, 'needs_revision')}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors cursor-pointer"
                      >
                        طلب تعديل
                      </button>

                      <button
                        onClick={() => handleUpdateCandidate(cand.id, 'rejected')}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 transition-colors cursor-pointer"
                      >
                        رفض
                      </button>

                      <button
                        onClick={() => handleUpdateCandidate(cand.id, 'approved', false)}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors cursor-pointer"
                      >
                        اعتماد المقترح
                      </button>

                      {/* Explicit Human Approval to Publish to Knowledge Base */}
                      <button
                        onClick={() => handleUpdateCandidate(cand.id, 'approved', true)}
                        className="px-3 py-1 rounded-xl text-xs font-bold text-white bg-[#1bb49e] hover:bg-[#159a86] transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1"
                        title="اعتماد رسمي وتمرير مباشر لقاعدة المعرفة"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>اعتماد ونشر لقاعدة المعرفة</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QUALITY REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">سجل إجابات DARB AI وقرارات المراجعة</h3>
            <span className="text-xs text-stone-500">يتم فحص الإجابات للتأكد من خلوها من التناقض وصحة المصادر</span>
          </div>

          {reviews.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400 bg-white border border-stone-200 rounded-2xl">
              لا توجد سجلات إجابات مسجلة حالياً.
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r, i) => (
                <article
                  key={r.answer_run_id || i}
                  className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                          #{r.answer_run_id}
                        </span>
                        <h4 className="text-xs font-bold text-stone-900">{r.question}</h4>
                      </div>
                      <span className="text-[10px] text-stone-400 block mt-0.5">
                        {r.created_at ? new Date(r.created_at).toLocaleString('ar-EG') : 'حديثاً'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          r.confidence_level === 'supported'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.confidence_level === 'limited'
                            ? 'bg-amber-100 text-amber-800'
                            : r.confidence_level === 'conflicted'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {r.confidence_level === 'supported' && 'مدعوم بالأدلة'}
                        {r.confidence_level === 'limited' && 'معلومات محدودة'}
                        {r.confidence_level === 'conflicted' && 'تعارض مصادر'}
                        {r.confidence_level === 'insufficient' && 'نقص في الأدلة'}
                      </span>

                      <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md font-semibold">
                        المصدر: {r.answer_source === 'knowledge' ? 'دَرْب' : r.answer_source === 'mixed' ? 'هجين' : 'إنترنت'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                    {r.answer}
                  </p>

                  {/* Conflicts Warning */}
                  {r.conflicts_json && r.conflicts_json.length > 0 && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
                      <div className="font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>تعارض بين المصادر تم رصده:</span>
                      </div>
                      <ul className="list-disc list-inside text-[11px] text-rose-800 mt-1 space-y-0.5 pr-1">
                        {r.conflicts_json.map((c, ci) => (
                          <li key={ci}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Sources List */}
                  {r.sources_json && r.sources_json.length > 0 && (
                    <div className="text-[11px] text-stone-500 flex flex-wrap items-center gap-2 pt-1">
                      <span className="font-bold text-stone-700">المصادر المعتمدة:</span>
                      {r.sources_json.slice(0, 4).map((s: any, si: number) => (
                        <span key={si} className="bg-stone-100 px-2 py-0.5 rounded-md font-mono text-[10px]">
                          {s.title || s.source || 'مصدر خارجي'}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Review Actions */}
                  <div className="pt-2 border-t border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <input
                      type="text"
                      placeholder="ملاحظة المشرف على جودة الإجابة..."
                      value={reviewNoteInput[String(r.answer_run_id)] || ''}
                      onChange={(e) =>
                        setReviewNoteInput({ ...reviewNoteInput, [String(r.answer_run_id)]: e.target.value })
                      }
                      className="text-xs px-2.5 py-1.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#1bb49e] flex-1"
                    />

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleReviewAnswer(r.answer_run_id, 'approved')}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors cursor-pointer"
                      >
                        اعتماد الإجابة
                      </button>

                      <button
                        onClick={() => handleReviewAnswer(r.answer_run_id, 'needs_revision')}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors cursor-pointer"
                      >
                        طلب تعديل
                      </button>

                      <button
                        onClick={() => handleReviewAnswer(r.answer_run_id, 'rejected')}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 transition-colors cursor-pointer"
                      >
                        رفض الإجابة
                      </button>

                      <button
                        onClick={() => handleConvertToCandidate(r.question, r.answer, r.answer_run_id)}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold text-sky-800 bg-sky-100 hover:bg-sky-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                        title="تحويل السؤال والإجابة إلى مقترح لقاعدة المعرفة"
                      >
                        <Plus className="w-3 h-3" />
                        <span>تحويل لمقترح معرفة</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: QUALITY & CONFIDENCE SUMMARY */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Feedback Breakdown */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-xs text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-2">
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                <span>تقييمات المستخدمين للإجابات</span>
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600">مفيدة (👍)</span>
                  <span className="font-bold text-emerald-600">{helpfulCount}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600">غير مفيدة (👎)</span>
                  <span className="font-bold text-rose-600">{notHelpfulCount}</span>
                </div>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold">
                  <span>إجمالي التقييمات:</span>
                  <span>{totalFeedback}</span>
                </div>
              </div>
            </div>

            {/* Confidence Levels */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-xs text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-2">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>مستويات الأدلة والثقة</span>
              </h4>
              <div className="space-y-2 text-xs">
                {summary?.confidence?.map((c) => (
                  <div key={c.confidence_level} className="flex items-center justify-between">
                    <span className="text-stone-600">
                      {c.confidence_level === 'supported' && 'مدعوم بالأدلة (Supported)'}
                      {c.confidence_level === 'limited' && 'معلومات محدودة (Limited)'}
                      {c.confidence_level === 'conflicted' && 'تعارض مصادر (Conflicted)'}
                      {c.confidence_level === 'insufficient' && 'نقص في الأدلة (Insufficient)'}
                    </span>
                    <span className="font-bold text-stone-900">{c.count}</span>
                  </div>
                )) || <span className="text-stone-400">لا توجد بيانات كافية</span>}
              </div>
            </div>

            {/* Candidate Pipeline Status */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-xs text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-2">
                <BookOpen className="w-4 h-4 text-[#1bb49e]" />
                <span>حالة مسار حوكمة المعرفة</span>
              </h4>
              <div className="space-y-2 text-xs">
                {summary?.candidates?.map((c) => (
                  <div key={c.status} className="flex items-center justify-between">
                    <span className="text-stone-600">
                      {c.status === 'pending' && 'قيد المراجعة (Pending)'}
                      {c.status === 'approved' && 'معتمد (Approved)'}
                      {c.status === 'needs_revision' && 'يحتاج تعديل (Needs Revision)'}
                      {c.status === 'rejected' && 'مرفوض (Rejected)'}
                    </span>
                    <span className="font-bold text-stone-900">{c.count}</span>
                  </div>
                )) || <span className="text-stone-400">لا توجد بيانات كافية</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: DARB AI KNOWLEDGE QUALITY & REFRESH MANAGER (V1.22) */}
      {activeTab === 'refresh' && (
        <DarbAIKnowledgeRefreshView />
      )}

      {/* TAB: DARB AI EVALUATION & AUTOMATED TEST LAB (V1.21) */}
      {activeTab === 'evaluation' && (
        <DarbAIEvaluationLabView />
      )}

      {/* TAB: DARB AI RESILIENCE & PRIVACY GUARD (V1.20) */}
      {activeTab === 'resilience' && (
        <DarbAIResilienceView />
      )}

      {/* TAB: DARB AI SECURITY & COST GUARD (V1.19) */}
      {activeTab === 'security' && (
        <DarbAISecurityView />
      )}

      {/* TAB: DARB AI ORCHESTRATOR (V1.18) */}
      {activeTab === 'orchestrator' && (
        <DarbAIOrchestratorView />
      )}

      {/* TAB: DARB AI MONITORING (V1.16) */}
      {activeTab === 'monitoring' && (
        <DarbAIMonitoringView onNavigateToGovernance={() => setActiveTab('governance')} />
      )}

      {/* TAB: DARB AI LEARNING & KNOWLEDGE EVOLUTION (V1.17) */}
      {activeTab === 'learning' && (
        <DarbAILearningView onNavigateToCandidateGovernance={() => setActiveTab('governance')} />
      )}

      {/* TAB 4: KNOWLEDGE BASE RECORDS & UNANSWERED (V1.11 PRESERVED) */}
      {activeTab === 'knowledge' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form: Add Knowledge */}
            <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#1bb49e]" />
                  <h3 className="font-bold text-stone-900 text-sm">إضافة معلومة مباشرة لقاعدة المعرفة</h3>
                </div>
                <span className="text-[11px] text-stone-400 font-mono">POST /api/admin/ai/knowledge</span>
              </div>

              <form onSubmit={handleAddKnowledge} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      العنوان أو السؤال الشائع *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: رسوم تصديق الشهادات في الرياض"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#1bb49e]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      المعرف الفريد (Slug)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: attestation-riyadh"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#1bb49e]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">رمز الدولة</label>
                    <input
                      type="text"
                      placeholder="مثال: EG, SA, PS, AE"
                      value={form.country_code}
                      onChange={(e) => setForm({ ...form, country_code: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#1bb49e]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">المدينة</label>
                    <input
                      type="text"
                      placeholder="مثال: القاهرة، غزة، الرياض"
                      value={form.city_name}
                      onChange={(e) => setForm({ ...form, city_name: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#1bb49e]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">الحالة</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#1bb49e] bg-white"
                    >
                      <option value="published">منشورة (Published)</option>
                      <option value="draft">مسودة (Draft)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    نص المعلومة المعتمدة التي سيعتمد عليها DARB AI *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="اكتب تفاصيل الإجابة والمعلومات الدقيقة التي سيعرضها المساعد للمستخدمين..."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#1bb49e] leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1bb49e] hover:bg-[#159a86] transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{submitting ? 'جارٍ الحفظ...' : 'إضافة إلى قاعدة المعرفة'}</span>
                </button>
              </form>
            </div>

            {/* Unanswered Questions Panel */}
            <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-stone-900 text-sm">أسئلة تحتاج معرفة إضافية</h3>
                </div>
                <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                  {unanswered.length} سؤال
                </span>
              </div>

              <p className="text-xs text-stone-500">
                الأسئلة التي طرحها المستخدمون ولم تكن معلومات دَرْب كافية للإجابة عليها:
              </p>

              {unanswered.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-400 bg-stone-50 rounded-xl">
                  لا توجد أسئلة غير مجابة حالياً. جميع الاستفسارات مغطاة بقاعدة المعرفة أو تم الرد عليها.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {unanswered.map((u, i) => (
                    <div
                      key={i}
                      className="p-3 bg-stone-50 border border-stone-200/70 rounded-xl hover:border-stone-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-stone-900 leading-relaxed">
                          {u.question}
                        </p>
                        <span className="shrink-0 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                          تكرر {u.occurrences} مرة
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between gap-2 text-[10px] text-stone-400">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {u.last_seen ? new Date(u.last_seen).toLocaleDateString('ar-EG') : 'حديثاً'}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleConvertToCandidate(u.question)}
                            className="text-sky-600 hover:text-sky-800 font-bold cursor-pointer inline-flex items-center gap-1 hover:underline"
                          >
                            <ArrowRight className="w-3 h-3" />
                            <span>تحويل لمقترح معرفة</span>
                          </button>

                          <button
                            onClick={() => {
                              setForm({
                                slug: 'faq_' + Date.now().toString(36),
                                title: u.question,
                                content: '',
                                country_code: '',
                                city_name: '',
                                status: 'published',
                              });
                            }}
                            className="text-[#1bb49e] hover:text-[#159a86] font-bold cursor-pointer inline-flex items-center gap-1 hover:underline"
                          >
                            <Plus className="w-3 h-3" />
                            <span>إضافة فورية</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Knowledge Base Records Section */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-stone-900 text-sm">
                  قاعدة المعرفة الحالية ({items.length} معلومة)
                </h3>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ابحث في المعرفة..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full text-xs pr-9 pl-3 py-1.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#1bb49e]"
                />
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400 bg-stone-50 rounded-xl">
                لم يتم العثور على أي معلومات تطابق بحثك.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredItems.map((x) => (
                  <article
                    key={x.id}
                    className="p-4 bg-stone-50/70 border border-stone-200 rounded-xl space-y-2 relative group hover:border-[#1bb49e]/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-stone-900 line-clamp-1">{x.title}</h4>
                      <button
                        onClick={() => handleDeleteKnowledge(x.id)}
                        title="حذف المعلومة"
                        className="text-stone-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {x.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-200/50 text-[10px] text-stone-500">
                      <span className="inline-flex items-center gap-1 font-mono bg-stone-200/70 px-1.5 py-0.5 rounded">
                        <Tag className="w-2.5 h-2.5" />
                        {x.slug}
                      </span>

                      {(x.country_code || x.city_name) && (
                        <span className="inline-flex items-center gap-1 bg-[#1bb49e]/10 text-[#1bb49e] font-bold px-1.5 py-0.5 rounded">
                          <Globe2 className="w-2.5 h-2.5" />
                          {x.country_code || ''} {x.city_name ? `• ${x.city_name}` : ''}
                        </span>
                      )}

                      <span
                        className={`px-1.5 py-0.5 rounded font-bold ${
                          x.status === 'draft'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {x.status === 'draft' ? 'مسودة' : 'منشور'}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
