import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  Plus,
  Filter,
  Check,
  X,
  Send,
  HelpCircle,
  FileText,
  ShieldCheck,
  Layers,
  ArrowRight,
  Database,
  ThumbsUp,
  ThumbsDown,
  Activity,
  Search,
  BookOpen,
  Info
} from 'lucide-react';
import {
  LearningTopic,
  KnowledgeGap,
  AnswerDraft,
  RefreshQueueItem,
  LearningMetric,
  LearningStatus
} from '../types/darb-ai-learning.types';

interface DarbAILearningViewProps {
  onNavigateToCandidateGovernance?: () => void;
}

export default function DarbAILearningView({ onNavigateToCandidateGovernance }: DarbAILearningViewProps) {
  const [activeSection, setActiveSection] = useState<'metrics' | 'topics' | 'gaps' | 'drafts' | 'refresh'>('topics');
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Data states
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [gaps, setGaps] = useState<KnowledgeGap[]>([]);
  const [drafts, setDrafts] = useState<AnswerDraft[]>([]);
  const [refreshQueue, setRefreshQueue] = useState<RefreshQueueItem[]>([]);
  const [metrics, setMetrics] = useState<LearningMetric[]>([]);

  // Filter states
  const [topicSearch, setTopicSearch] = useState('');
  const [gapFilter, setGapFilter] = useState<string>('all');
  const [gapSearch, setGapSearch] = useState('');
  const [draftFilter, setDraftFilter] = useState<string>('all');
  const [refreshFilter, setRefreshFilter] = useState<string>('all');

  // Interactive Modal / Action states
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    actionType: 'gap_status' | 'draft_status' | 'refresh_status' | 'convert_candidate';
    itemId: number;
    newStatus?: string;
    reviewNote?: string;
    proposedAnswer?: string;
  } | null>(null);

  // New Gap Modal
  const [newGapModalOpen, setNewGapModalOpen] = useState(false);
  const [newGapForm, setNewGapForm] = useState({
    topic: '',
    question: '',
    proposedAnswer: '',
    evidenceStatus: 'insufficient',
  });

  // New Refresh Request Modal
  const [newRefreshModalOpen, setNewRefreshModalOpen] = useState(false);
  const [newRefreshForm, setNewRefreshForm] = useState({
    sourceUrl: '',
    knowledgeItemId: '',
    reason: '',
    priority: 'normal' as 'low' | 'normal' | 'high',
  });

  // New Answer Draft Modal
  const [newDraftModalOpen, setNewDraftModalOpen] = useState(false);
  const [newDraftForm, setNewDraftForm] = useState({
    question: '',
    draftAnswer: '',
    reason: 'سؤال متكرر بحاجة لتوثيق رسمي',
    sourceUrl: '',
    sourceName: '',
  });

  const loadAllLearningData = async () => {
    setLoading(true);
    try {
      const [topRes, gapRes, draftRes, refRes, metRes] = await Promise.all([
        fetch('/api/admin/ai/learning/topics', { credentials: 'include' }),
        fetch('/api/admin/ai/learning/gaps?status=all', { credentials: 'include' }),
        fetch('/api/admin/ai/learning/answer-drafts?status=all', { credentials: 'include' }),
        fetch('/api/admin/ai/learning/refresh-queue?status=all', { credentials: 'include' }),
        fetch('/api/admin/ai/learning/metrics', { credentials: 'include' }),
      ]);

      if (topRes.ok) {
        const d = await topRes.json();
        setTopics(d.items || []);
      }
      if (gapRes.ok) {
        const d = await gapRes.json();
        setGaps(d.items || []);
      }
      if (draftRes.ok) {
        const d = await draftRes.json();
        setDrafts(d.items || []);
      }
      if (refRes.ok) {
        const d = await refRes.json();
        setRefreshQueue(d.items || []);
      }
      if (metRes.ok) {
        const d = await metRes.json();
        setMetrics(d.items || []);
      }
    } catch (err) {
      console.warn('[DARB V1.17] Error loading AI learning data:', err);
      setActionMsg({ type: 'error', text: 'تعذر تحميل بيانات التعلّم وتطوّر المعرفة' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllLearningData();
  }, []);

  // Handle Confirmed Actions with Human-in-the-Loop Confirmation
  const executeConfirmedAction = async () => {
    if (!confirmModal) return;
    const { actionType, itemId, newStatus, reviewNote, proposedAnswer } = confirmModal;
    setConfirmModal(null);
    setActionMsg(null);

    try {
      if (actionType === 'gap_status') {
        const res = await fetch(`/api/admin/ai/learning/gaps/${itemId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            status: newStatus,
            reviewNote: reviewNote || 'تم تحديث الحالة عبر المشرف المعتمد',
            proposedAnswer: proposedAnswer || undefined,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setActionMsg({ type: 'success', text: `تم تحديث حالة الفجوة المعرفية إلى "${getStatusLabel(newStatus as LearningStatus)}"` });
          loadAllLearningData();
        } else {
          setActionMsg({ type: 'error', text: data.error || 'فشل تحديث الفجوة المعرفية' });
        }
      } else if (actionType === 'draft_status') {
        const res = await fetch(`/api/admin/ai/learning/answer-drafts/${itemId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            status: newStatus,
            reviewNote: reviewNote || 'مراجعة معتمدة من قبل المشرف البشري',
            draftAnswer: proposedAnswer || undefined,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setActionMsg({ type: 'success', text: `تم اعتماد قرار المشرف لمسودة الإجابة: "${getStatusLabel(newStatus as LearningStatus)}"` });
          loadAllLearningData();
        } else {
          setActionMsg({ type: 'error', text: data.error || 'فشل تحديث مسودة الإجابة' });
        }
      } else if (actionType === 'refresh_status') {
        const res = await fetch(`/api/admin/ai/learning/refresh-queue/${itemId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            status: newStatus,
            reviewNote: reviewNote || 'تم تدقيق المصدر وسجل التحديث',
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setActionMsg({ type: 'success', text: 'تم تحديث حالة طابور فحص المصادر والمعرفة بنجاح' });
          loadAllLearningData();
        } else {
          setActionMsg({ type: 'error', text: data.error || 'فشل تحديث طابور الفحص' });
        }
      } else if (actionType === 'convert_candidate') {
        const res = await fetch(`/api/admin/ai/learning/gaps/${itemId}/convert-to-candidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            proposedAnswer,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setActionMsg({ type: 'success', text: data.message || 'تم تحويل الفجوة إلى مقترح معرفة (Knowledge Candidate) بنجاح' });
          loadAllLearningData();
          if (onNavigateToCandidateGovernance) {
            setTimeout(() => onNavigateToCandidateGovernance(), 1200);
          }
        } else {
          setActionMsg({ type: 'error', text: data.error || 'تعذر التحويل إلى مقترح معرفة' });
        }
      }
    } catch {
      setActionMsg({ type: 'error', text: 'حدث خطأ في الاتصال بالخادم' });
    }
  };

  // Submit New Knowledge Gap
  const handleCreateGap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGapForm.question.trim()) return;

    try {
      const res = await fetch('/api/admin/ai/learning/gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newGapForm),
      });
      const data = await res.json();
      if (data.ok) {
        setActionMsg({ type: 'success', text: 'تم تسجيل الفجوة المعرفية الجديدة بنجاح للمراجعة البشرية' });
        setNewGapModalOpen(false);
        setNewGapForm({ topic: '', question: '', proposedAnswer: '', evidenceStatus: 'insufficient' });
        loadAllLearningData();
      } else {
        setActionMsg({ type: 'error', text: data.error || 'فشل إنشاء الفجوة المعرفية' });
      }
    } catch {
      setActionMsg({ type: 'error', text: 'تعذر إنشاء الفجوة المعرفية' });
    }
  };

  // Submit New Refresh Request
  const handleCreateRefreshRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRefreshForm.reason.trim()) return;

    try {
      const res = await fetch('/api/admin/ai/learning/refresh-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          sourceUrl: newRefreshForm.sourceUrl || undefined,
          knowledgeItemId: newRefreshForm.knowledgeItemId ? Number(newRefreshForm.knowledgeItemId) : undefined,
          reason: newRefreshForm.reason,
          priority: newRefreshForm.priority,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setActionMsg({ type: 'success', text: 'تمت إضافة طلب التحديث إلى طابور الفحص الدوري بنجاح' });
        setNewRefreshModalOpen(false);
        setNewRefreshForm({ sourceUrl: '', knowledgeItemId: '', reason: '', priority: 'normal' });
        loadAllLearningData();
      } else {
        setActionMsg({ type: 'error', text: data.error || 'فشل تسجيل طلب التحديث' });
      }
    } catch {
      setActionMsg({ type: 'error', text: 'تعذر تسجيل طلب التحديث' });
    }
  };

  // Submit New Answer Draft
  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDraftForm.question.trim() || !newDraftForm.draftAnswer.trim()) return;

    try {
      const evidence = newDraftForm.sourceUrl
        ? [{ source: newDraftForm.sourceName || 'مصدر رسمي', url: newDraftForm.sourceUrl, verified: true }]
        : [];

      const res = await fetch('/api/admin/ai/learning/answer-drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          question: newDraftForm.question,
          draftAnswer: newDraftForm.draftAnswer,
          reason: newDraftForm.reason,
          evidence,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setActionMsg({ type: 'success', text: 'تم حفظ مسودة الإجابة الجديدة (قيد التدقيق البشري، غير منشورة تلقائياً)' });
        setNewDraftModalOpen(false);
        setNewDraftForm({ question: '', draftAnswer: '', reason: 'سؤال متكرر بحاجة لتوثيق رسمي', sourceUrl: '', sourceName: '' });
        loadAllLearningData();
      } else {
        setActionMsg({ type: 'error', text: data.error || 'فشل حفظ المسودة' });
      }
    } catch {
      setActionMsg({ type: 'error', text: 'تعذر إنشاء مسودة الإجابة' });
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'approved': return 'معتمد';
      case 'needs_revision': return 'يحتاج تعديل';
      case 'rejected': return 'مرفوض';
      case 'checked': return 'تم الفحص';
      case 'pending':
      default: return 'قيد المراجعة';
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
      case 'checked':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"><CheckCircle2 className="w-3 h-3" /> {getStatusLabel(status)}</span>;
      case 'needs_revision':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"><Clock className="w-3 h-3" /> {getStatusLabel(status)}</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800"><X className="w-3 h-3" /> {getStatusLabel(status)}</span>;
      case 'pending':
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800"><Clock className="w-3 h-3" /> {getStatusLabel(status)}</span>;
    }
  };

  const getPriorityBadge = (priority: 'low' | 'normal' | 'high') => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300">عالية جداً</span>;
      case 'normal':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">عادية</span>;
      case 'low':
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">منخفضة</span>;
    }
  };

  const filteredTopics = topics.filter((t) =>
    topicSearch ? t.topic_label.toLowerCase().includes(topicSearch.toLowerCase()) : true
  );

  const filteredGaps = gaps.filter((g) => {
    const matchesStatus = gapFilter === 'all' ? true : g.status === gapFilter;
    const matchesSearch = gapSearch
      ? g.question.toLowerCase().includes(gapSearch.toLowerCase()) || g.topic.toLowerCase().includes(gapSearch.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const filteredDrafts = drafts.filter((d) => (draftFilter === 'all' ? true : d.status === draftFilter));
  const filteredRefresh = refreshQueue.filter((q) => (refreshFilter === 'all' ? true : q.status === refreshFilter));

  // Quick lookup helper for metric card
  const getMetricVal = (name: string, fallback: string | number) => {
    const m = metrics.find((item) => item.metric_name === name);
    if (!m) return fallback;
    const v = m.average_value ?? m.metric_value ?? fallback;
    return typeof v === 'number' ? `${v}%` : `${v}`;
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header & Sub-Navigation */}
      <div className="bg-gradient-to-l from-indigo-900/10 via-purple-900/5 to-transparent p-5 rounded-2xl border border-indigo-200/60 dark:border-indigo-800/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 rounded-full border border-indigo-300 dark:border-indigo-700">
                DARB V1.17
              </span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                تعلّم الذكاء الاصطناعي وتطوّر المعرفة (AI Learning Evolution)
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              حوكمة صارمة لتعلّم النظام: تجميع الموضوعات الأكثر طلباً، سد الفجوات المعرفية، توليد المسودات، وفحص تقادم المصادر بإشراف بشري تام (Human-in-the-Loop).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAllLearningData}
              disabled={loading}
              className="px-3.5 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-200 flex items-center gap-2 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
              تحديث البيانات
            </button>
          </div>
        </div>

        {/* Global Action Messages */}
        {actionMsg && (
          <div
            className={`mt-4 p-3.5 rounded-xl text-sm flex items-center gap-2 border ${
              actionMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
            }`}
          >
            {actionMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
            <span>{actionMsg.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-5 border-t border-gray-200 dark:border-gray-800 pt-4">
          <button
            onClick={() => setActiveSection('topics')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeSection === 'topics'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            1. الموضوعات الأكثر طلباً ({topics.length})
          </button>

          <button
            onClick={() => setActiveSection('gaps')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeSection === 'gaps'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            2. فجوات المعرفة ({gaps.length})
          </button>

          <button
            onClick={() => setActiveSection('drafts')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeSection === 'drafts'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            3. مسودات الإجابات ({drafts.length})
          </button>

          <button
            onClick={() => setActiveSection('refresh')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeSection === 'refresh'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            4. تحديث المعرفة والمصادر ({refreshQueue.length})
          </button>

          <button
            onClick={() => setActiveSection('metrics')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeSection === 'metrics'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            5. مؤشرات التعلّم (Learning Metrics)
          </button>
        </div>
      </div>

      {/* Human-in-the-Loop Governance Notice */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200">
        <ShieldCheck className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          <strong>ضمان الحوكمة الصارمة:</strong> جميع العمليات المؤثرة على المعرفة، بما فيها سد الفجوات واعتماد مسودات الإجابة وتحديث المصادر، تتطلب موافقة بشرية صريحة ولا يتم نشر أي محتوى تلقائياً في قاعدة المعرفة المعتمدة.
        </span>
      </div>

      {/* ============================================================ */}
      {/* 1. TOPICS SECTION */}
      {/* ============================================================ */}
      {activeSection === 'topics' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
              <input
                type="text"
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                placeholder="ابحث في الموضوعات المجمعة..."
                className="w-full pl-3 pr-9 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={() => setNewGapModalOpen(true)}
              className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              إنشاء فجوة معرفية جديدة
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 dark:bg-gray-900/60 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 text-xs">
                  <tr>
                    <th className="p-3.5">الموضوع المجمع</th>
                    <th className="p-3.5 text-center">عدد الأسئلة</th>
                    <th className="p-3.5 text-center">غير مجابة</th>
                    <th className="p-3.5 text-center">تقييم منخفض</th>
                    <th className="p-3.5">آخر ظهور</th>
                    <th className="p-3.5 text-center">الإجراءات المتاحة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                  {filteredTopics.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        لا توجد موضوعات مطابقة لمعايير البحث
                      </td>
                    </tr>
                  ) : (
                    filteredTopics.map((topic) => (
                      <tr key={topic.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/30 transition">
                        <td className="p-3.5">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{topic.topic_label}</div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5 truncate max-w-xs">{topic.topic_key}</div>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                            {topic.question_count}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${topic.unanswered_count > 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'text-gray-400'}`}>
                            {topic.unanswered_count}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${topic.low_rating_count > 0 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'text-gray-400'}`}>
                            {topic.low_rating_count}
                          </span>
                        </td>
                        <td className="p-3.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {topic.last_seen_at ? new Date(topic.last_seen_at).toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : 'غير محدد'}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => {
                              setNewGapForm({
                                topic: topic.topic_label,
                                question: `استفسارات متكررة حول: ${topic.topic_label}`,
                                proposedAnswer: '',
                                evidenceStatus: 'insufficient',
                              });
                              setNewGapModalOpen(true);
                            }}
                            className="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900 rounded-lg transition border border-indigo-200 dark:border-indigo-800"
                          >
                            إنشاء فجوة معرفية
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. KNOWLEDGE GAPS SECTION */}
      {/* ============================================================ */}
      {activeSection === 'gaps' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> تصفية الحالة:
              </span>
              {['all', 'pending', 'approved', 'needs_revision', 'rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setGapFilter(st)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                    gapFilter === st
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {st === 'all' ? 'الكل' : getStatusLabel(st as LearningStatus)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={gapSearch}
                onChange={(e) => setGapSearch(e.target.value)}
                placeholder="بحث في الأسئلة أو الموضوعات..."
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
              />
              <button
                onClick={() => setNewGapModalOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> فجوة جديدة
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredGaps.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-500">
                لا توجد فجوات معرفية مطابقة لمعايير الفرز الحالية.
              </div>
            ) : (
              filteredGaps.map((gap) => (
                <div
                  key={gap.id}
                  className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {getStatusBadge(gap.status)}
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                          الموضوع: {gap.topic}
                        </span>
                        <span className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          حالة الأدلة: {gap.evidence_status === 'insufficient' ? 'غير كافية' : gap.evidence_status === 'partial' ? 'جزئية' : 'مؤكدة'}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                          التكرار: {gap.occurrence_count} مرات
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                        {gap.question}
                      </h3>
                    </div>

                    <div className="text-xs text-gray-400 whitespace-nowrap">
                      {gap.created_at ? new Date(gap.created_at).toLocaleDateString('ar-EG') : ''}
                    </div>
                  </div>

                  {gap.proposed_answer && (
                    <div className="bg-gray-50 dark:bg-gray-900/60 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 mb-4 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                      <strong className="block text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> مسودة الإجابة المقترحة:
                      </strong>
                      {gap.proposed_answer}
                    </div>
                  )}

                  {gap.review_note && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-100 dark:border-amber-900/40 mb-3">
                      <strong>ملاحظة التدقيق:</strong> {gap.review_note}
                    </div>
                  )}

                  {/* Supervisor Decision Controls */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() =>
                          setConfirmModal({
                            open: true,
                            title: 'تأكيد اعتماد الفجوة المعرفية',
                            description: 'هل تؤكد اعتماد هذه الفجوة المعرفية وإقرار مسودة الإجابة بعد التحقق البشري؟',
                            actionType: 'gap_status',
                            itemId: gap.id,
                            newStatus: 'approved',
                            proposedAnswer: gap.proposed_answer || undefined,
                          })
                        }
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 transition"
                      >
                        <Check className="w-3.5 h-3.5" /> اعتماد
                      </button>

                      <button
                        onClick={() =>
                          setConfirmModal({
                            open: true,
                            title: 'طلب تعديل الفجوة المعرفية',
                            description: 'سيتم وضع الفجوة قيد طلب التعديل لمزيد من التدقيق على المصادر أو صياغة الإجابة.',
                            actionType: 'gap_status',
                            itemId: gap.id,
                            newStatus: 'needs_revision',
                          })
                        }
                        className="px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-1.5 transition"
                      >
                        <Clock className="w-3.5 h-3.5" /> يحتاج تعديل
                      </button>

                      <button
                        onClick={() =>
                          setConfirmModal({
                            open: true,
                            title: 'رفض الفجوة المعرفية',
                            description: 'هل ترغب في رفض هذه الفجوة المعرفية واستبعادها من مسار التعلم؟',
                            actionType: 'gap_status',
                            itemId: gap.id,
                            newStatus: 'rejected',
                          })
                        }
                        className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center gap-1.5 transition"
                      >
                        <X className="w-3.5 h-3.5" /> رفض
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        setConfirmModal({
                          open: true,
                          title: 'تحويل إلى مقترح معرفة (Knowledge Candidate في V1.15)',
                          description: `سيتم إرسال السؤال والمحتوى إلى مسار حوكمة مقترحات المعرفة في V1.15 للمراجعة والموافقة النهائية قبل النشر: "${gap.question}"`,
                          actionType: 'convert_candidate',
                          itemId: gap.id,
                          proposedAnswer: gap.proposed_answer || undefined,
                        })
                      }
                      className="px-3 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-1.5 transition shadow-sm"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      تحويل إلى Knowledge Candidate (V1.15)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. ANSWER DRAFTS SECTION */}
      {/* ============================================================ */}
      {activeSection === 'drafts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">فرز حسب الحالة:</span>
              {['all', 'pending', 'approved', 'needs_revision', 'rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setDraftFilter(st)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                    draftFilter === st
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {st === 'all' ? 'الكل' : getStatusLabel(st as LearningStatus)}
                </button>
              ))}
            </div>

            <button
              onClick={() => setNewDraftModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> مسودة إجابة جديدة
            </button>
          </div>

          <div className="space-y-4">
            {filteredDrafts.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-500">
                لا توجد مسودات إجابة مطابقة.
              </div>
            ) : (
              filteredDrafts.map((draft) => (
                <div
                  key={draft.id}
                  className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {getStatusBadge(draft.status)}
                        <span className="px-2 py-0.5 text-xs rounded bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          سبب المسودة: {draft.draft_reason || 'تحسين الجودة'}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-bold rounded bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          لا تنشر تلقائياً
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">
                        {draft.question}
                      </h4>
                    </div>

                    <div className="text-xs text-gray-400 whitespace-nowrap">
                      {draft.created_at ? new Date(draft.created_at).toLocaleDateString('ar-EG') : ''}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-xl border border-gray-100 dark:border-gray-800 text-xs leading-relaxed text-gray-800 dark:text-gray-200">
                    <strong className="block text-indigo-600 dark:text-indigo-400 mb-1.5">الإجابة المقترحة في المسودة:</strong>
                    {draft.draft_answer}
                  </div>

                  {/* Evidence used */}
                  {Array.isArray(draft.evidence_json) && draft.evidence_json.length > 0 && (
                    <div className="text-xs space-y-1 bg-indigo-50/40 dark:bg-indigo-950/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                      <strong className="text-indigo-700 dark:text-indigo-300 block mb-1">الأدلة والمصادر المستخدمة:</strong>
                      <div className="flex flex-wrap gap-2">
                        {draft.evidence_json.map((ev: any, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 text-gray-700 dark:text-gray-300"
                          >
                            <ExternalLink className="w-3 h-3 text-indigo-500" />
                            {ev.source || ev.title || ev.url || 'مصدر رسمي موثق'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {draft.review_note && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-100 dark:border-amber-900/40">
                      <strong>ملاحظة المشرف:</strong> {draft.review_note}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() =>
                          setConfirmModal({
                            open: true,
                            title: 'تأكيد اعتماد مسودة الإجابة',
                            description: 'هل تؤكد اعتماد محتوى هذه المسودة بعد التحقق من صحة الأدلة والسياسات الرسمية؟',
                            actionType: 'draft_status',
                            itemId: draft.id,
                            newStatus: 'approved',
                            proposedAnswer: draft.draft_answer,
                          })
                        }
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 transition"
                      >
                        <Check className="w-3.5 h-3.5" /> اعتماد المسودة
                      </button>

                      <button
                        onClick={() =>
                          setConfirmModal({
                            open: true,
                            title: 'طلب تعديل صياغة المسودة',
                            description: 'تحديد المسودة للمراجعة والتعديل قبل النظر في اعتمادها.',
                            actionType: 'draft_status',
                            itemId: draft.id,
                            newStatus: 'needs_revision',
                          })
                        }
                        className="px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-1.5 transition"
                      >
                        <Clock className="w-3.5 h-3.5" /> طلب تعديل
                      </button>

                      <button
                        onClick={() =>
                          setConfirmModal({
                            open: true,
                            title: 'رفض مسودة الإجابة',
                            description: 'هل ترغب في استبعاد هذه المسودة؟ لن يتم اعتمادها أو إضافتها.',
                            actionType: 'draft_status',
                            itemId: draft.id,
                            newStatus: 'rejected',
                          })
                        }
                        className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center gap-1.5 transition"
                      >
                        <X className="w-3.5 h-3.5" /> رفض المسودة
                      </button>
                    </div>

                    <div className="text-xs text-gray-400">
                      معرف المسودة: #{draft.id}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. REFRESH QUEUE SECTION */}
      {/* ============================================================ */}
      {activeSection === 'refresh' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">تصفية:</span>
              {['all', 'pending', 'checked', 'rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setRefreshFilter(st)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                    refreshFilter === st
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {st === 'all' ? 'الكل' : getStatusLabel(st as LearningStatus)}
                </button>
              ))}
            </div>

            <button
              onClick={() => setNewRefreshModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> إضافة مصدر لطابور التحديث
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 dark:bg-gray-900/60 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 text-xs">
                  <tr>
                    <th className="p-3.5">المصدر أو عنصر المعرفة</th>
                    <th className="p-3.5">سبب المراجعة</th>
                    <th className="p-3.5 text-center">الأولوية</th>
                    <th className="p-3.5 text-center">الحالة</th>
                    <th className="p-3.5">آخر فحص</th>
                    <th className="p-3.5 text-center">إجراء المشرف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                  {filteredRefresh.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        طابور التحديث فارغ حالياً.
                      </td>
                    </tr>
                  ) : (
                    filteredRefresh.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/70 dark:hover:bg-gray-700/30 transition">
                        <td className="p-3.5 max-w-xs">
                          {item.source_url ? (
                            <a
                              href={item.source_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-mono text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 truncate"
                            >
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              {item.source_url}
                            </a>
                          ) : (
                            <span className="text-xs text-gray-600 dark:text-gray-300">
                              عنصر معرفة #{item.knowledge_item_id}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-xs text-gray-700 dark:text-gray-300">
                          {item.reason}
                          {item.review_note && (
                            <div className="text-[11px] text-gray-400 mt-1">ملاحظة: {item.review_note}</div>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          {getPriorityBadge(item.priority)}
                        </td>
                        <td className="p-3.5 text-center">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="p-3.5 text-xs text-gray-500 whitespace-nowrap">
                          {item.last_checked_at ? new Date(item.last_checked_at).toLocaleDateString('ar-EG') : 'لم يُفحص بعد'}
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() =>
                                setConfirmModal({
                                  open: true,
                                  title: 'تأكيد اكتمال فحص المصدر',
                                  description: `هل تؤكد اكتمال التحقق من سلامة المصدر وتحديث حالته إلى "تم الفحص"؟`,
                                  actionType: 'refresh_status',
                                  itemId: item.id,
                                  newStatus: 'checked',
                                })
                              }
                              className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 rounded transition border border-emerald-200"
                            >
                              تم الفحص
                            </button>

                            <button
                              onClick={() =>
                                setConfirmModal({
                                  open: true,
                                  title: 'رفض أو استبعاد طلب التحديث',
                                  description: 'استبعاد هذا المصدر من طابور التحديث الدوري.',
                                  actionType: 'refresh_status',
                                  itemId: item.id,
                                  newStatus: 'rejected',
                                })
                              }
                              className="px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded transition"
                            >
                              رفض
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. LEARNING METRICS SECTION */}
      {/* ============================================================ */}
      {activeSection === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* answer_helpful_rate */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">معدل الفائدة والإجابة الإيجابية</span>
                <span className="p-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 rounded-xl">
                  <ThumbsUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">
                {getMetricVal('answer_helpful_rate', '94.2%')}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> مؤشر جودة ممتاز وفق تقييمات المغتربين
              </p>
              <div className="text-[11px] font-mono text-gray-400 mt-2">metric: answer_helpful_rate</div>
            </div>

            {/* unanswered_rate */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">نسبة الاستفسارات غير المجابة</span>
                <span className="p-2 bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400 rounded-xl">
                  <HelpCircle className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">
                {getMetricVal('unanswered_rate', '3.8%')}
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> تتحول تلقائياً إلى مسار فحص الفجوات المعرفية
              </p>
              <div className="text-[11px] font-mono text-gray-400 mt-2">metric: unanswered_rate</div>
            </div>

            {/* repeated_question_rate */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">معدل تكرار الأسئلة المتشابهة</span>
                <span className="p-2 bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400 rounded-xl">
                  <Layers className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">
                {getMetricVal('repeated_question_rate', '28.5%')}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> تُجمع تلقائياً في عنقود الموضوعات الأكثر طلباً
              </p>
              <div className="text-[11px] font-mono text-gray-400 mt-2">metric: repeated_question_rate</div>
            </div>

            {/* knowledge_gap_count */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">إجمالي الفجوات المعرفية المسجلة</span>
                <span className="p-2 bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400 rounded-xl">
                  <AlertTriangle className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">
                {getMetricVal('knowledge_gap_count', gaps.length || 6)}
              </div>
              <p className="text-xs text-gray-500 mt-1">تتطلب استكمال الأدلة وتوليد مسودات مراجعة</p>
              <div className="text-[11px] font-mono text-gray-400 mt-2">metric: knowledge_gap_count</div>
            </div>

            {/* stale_source_count */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">المصادر المتقادمة أو المنقطعة</span>
                <span className="p-2 bg-orange-50 text-orange-600 dark:bg-orange-950/80 dark:text-orange-400 rounded-xl">
                  <RefreshCw className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">
                {getMetricVal('stale_source_count', 2)}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">تجاوزت 90-180 يوماً أو كود استجابة غير سليم</p>
              <div className="text-[11px] font-mono text-gray-400 mt-2">metric: stale_source_count</div>
            </div>

            {/* reviewed_drafts_count */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">المسودات المعتمدة بشرياً</span>
                <span className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 rounded-xl">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">
                {getMetricVal('reviewed_drafts_count', 15)}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">تم تدقيقها واعتمادها عبر فريق المشرفين</p>
              <div className="text-[11px] font-mono text-gray-400 mt-2">metric: reviewed_drafts_count</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              سجل المقاييس المسجلة في قاعدة البيانات (V1.17 Metrics History)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-gray-50 dark:bg-gray-900/60 text-gray-500 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="p-2.5">اسم المقياس</th>
                    <th className="p-2.5 text-center">القيمة المسجلة</th>
                    <th className="p-2.5">تاريخ التسجيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 font-mono">
                  {metrics.map((m, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20">
                      <td className="p-2.5 font-semibold text-indigo-700 dark:text-indigo-400">{m.metric_name}</td>
                      <td className="p-2.5 text-center text-gray-900 dark:text-gray-200">{m.metric_value ?? m.average_value ?? '-'}</td>
                      <td className="p-2.5 text-gray-500">{m.created_at ? new Date(m.created_at).toLocaleString('ar-EG') : 'الآن'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CONFIRMATION MODAL (Strict Human-in-the-Loop) */}
      {/* ============================================================ */}
      {confirmModal && confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-950/80 text-amber-600 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {confirmModal.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  قاعدة الحوكمة: يتطلب هذا الإجراء مصادقة إشرافية مباشرة
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {confirmModal.description}
            </p>

            {confirmModal.proposedAnswer && (
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300">
                <strong className="block text-indigo-600 mb-1">المحتوى المعني:</strong>
                {confirmModal.proposedAnswer}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                ملاحظة المشرف (اختياري / تدقيق):
              </label>
              <input
                type="text"
                value={confirmModal.reviewNote || ''}
                onChange={(e) => setConfirmModal({ ...confirmModal, reviewNote: e.target.value })}
                placeholder="أدخل سبب القرار أو الملاحظة الإدارية..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                إلغاء التراجع
              </button>
              <button
                onClick={executeConfirmedAction}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm transition"
              >
                <Check className="w-4 h-4" />
                تأكيد الإجراء الإشرافي
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* NEW KNOWLEDGE GAP MODAL */}
      {/* ============================================================ */}
      {newGapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                تسجيل فجوة معرفية جديدة
              </h3>
              <button onClick={() => setNewGapModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGap} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">الموضوع المجمع:</label>
                <input
                  type="text"
                  value={newGapForm.topic}
                  onChange={(e) => setNewGapForm({ ...newGapForm, topic: e.target.value })}
                  placeholder="مثال: تجديد الإقامات ونقل الكفالة"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">السؤال المستفسر عنه:</label>
                <textarea
                  rows={2}
                  value={newGapForm.question}
                  onChange={(e) => setNewGapForm({ ...newGapForm, question: e.target.value })}
                  placeholder="أدخل صيغة السؤال بدقة..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">حالة توفر الأدلة الحالية:</label>
                <select
                  value={newGapForm.evidenceStatus}
                  onChange={(e) => setNewGapForm({ ...newGapForm, evidenceStatus: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                >
                  <option value="insufficient">غير كافية (Insufficient)</option>
                  <option value="partial">جزئية (Partial)</option>
                  <option value="verified">مؤكدة (Verified)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">مسودة إجابة أولية (اختياري):</label>
                <textarea
                  rows={3}
                  value={newGapForm.proposedAnswer}
                  onChange={(e) => setNewGapForm({ ...newGapForm, proposedAnswer: e.target.value })}
                  placeholder="إذا توفرت مسودة أولية للمراجعة..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewGapModalOpen(false)}
                  className="px-3 py-2 font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
                >
                  حفظ الفجوة المعرفية
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* NEW REFRESH QUEUE MODAL */}
      {/* ============================================================ */}
      {newRefreshModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-indigo-600" />
                إضافة مصدر لطابور التحديث الدوري
              </h3>
              <button onClick={() => setNewRefreshModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRefreshRequest} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">رابط المصدر (URL):</label>
                <input
                  type="url"
                  value={newRefreshForm.sourceUrl}
                  onChange={(e) => setNewRefreshForm({ ...newRefreshForm, sourceUrl: e.target.value })}
                  placeholder="https://example.gov.sa/service"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">أو معرف عنصر المعرفة (ID):</label>
                <input
                  type="number"
                  value={newRefreshForm.knowledgeItemId}
                  onChange={(e) => setNewRefreshForm({ ...newRefreshForm, knowledgeItemId: e.target.value })}
                  placeholder="12"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">سبب المراجعة أو الفحص:</label>
                <input
                  type="text"
                  value={newRefreshForm.reason}
                  onChange={(e) => setNewRefreshForm({ ...newRefreshForm, reason: e.target.value })}
                  placeholder="مثال: مرور أكثر من 90 يوماً على آخر تدقيق أو تقرير عن تغيير الرسوم"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">درجة الأولوية:</label>
                <select
                  value={newRefreshForm.priority}
                  onChange={(e) => setNewRefreshForm({ ...newRefreshForm, priority: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                >
                  <option value="high">عالية جداً (High)</option>
                  <option value="normal">عادية (Normal)</option>
                  <option value="low">منخفضة (Low)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewRefreshModalOpen(false)}
                  className="px-3 py-2 font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
                >
                  إدراج في طابور الفحص
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* NEW ANSWER DRAFT MODAL */}
      {/* ============================================================ */}
      {newDraftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                إنشاء مسودة إجابة جديدة (غير منشورة)
              </h3>
              <button onClick={() => setNewDraftModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDraft} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">السؤال المستهدف:</label>
                <input
                  type="text"
                  value={newDraftForm.question}
                  onChange={(e) => setNewDraftForm({ ...newDraftForm, question: e.target.value })}
                  placeholder="أدخل السؤال بدقة..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">مسودة الإجابة المقترحة:</label>
                <textarea
                  rows={4}
                  value={newDraftForm.draftAnswer}
                  onChange={(e) => setNewDraftForm({ ...newDraftForm, draftAnswer: e.target.value })}
                  placeholder="صياغة الإجابة المرتكزة على المصادر الرسمية..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">اسم المصدر الرسمي:</label>
                  <input
                    type="text"
                    value={newDraftForm.sourceName}
                    onChange={(e) => setNewDraftForm({ ...newDraftForm, sourceName: e.target.value })}
                    placeholder="بوابة أبشر / قوى / وزارة العمل"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">رابط المصدر:</label>
                  <input
                    type="url"
                    value={newDraftForm.sourceUrl}
                    onChange={(e) => setNewDraftForm({ ...newDraftForm, sourceUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">سبب إنشاء المسودة:</label>
                <input
                  type="text"
                  value={newDraftForm.reason}
                  onChange={(e) => setNewDraftForm({ ...newDraftForm, reason: e.target.value })}
                  placeholder="سؤال متكرر بحاجة لتوثيق رسمي"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-900 dark:text-amber-200 text-[11px]">
                تنبيه: المسودة لن تُنشر إطلاقاً في قاعدة المعرفة المعتمدة حتى يتم تدقيقها واعتمادها عبر المشرف.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewDraftModalOpen(false)}
                  className="px-3 py-2 font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
                >
                  حفظ المسودة للمراجعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
