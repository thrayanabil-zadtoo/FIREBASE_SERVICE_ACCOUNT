import React, { useState, useEffect } from 'react';
import {
  Activity,
  Radio,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Clock,
  Globe2,
  Sparkles,
  Filter,
  Check,
  Search,
  Plus,
  ShieldCheck,
  Send,
  Layers,
  ThumbsDown,
  Info
} from 'lucide-react';
import {
  MonitoringSummaryData,
  MonitoringEvent,
  RepeatedQuestion,
  SourceHealth,
  MonitorSeverity
} from '../types/darb-ai-monitoring.types';

interface DarbAIMonitoringViewProps {
  onNavigateToGovernance?: () => void;
}

export default function DarbAIMonitoringView({ onNavigateToGovernance }: DarbAIMonitoringViewProps) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<MonitoringSummaryData | null>(null);
  const [events, setEvents] = useState<MonitoringEvent[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | MonitorSeverity>('all');
  const [eventSearch, setEventSearch] = useState('');
  const [questionSearch, setQuestionSearch] = useState('');
  const [sourceSearch, setSourceSearch] = useState('');
  
  // Action states
  const [checkingUrl, setCheckingUrl] = useState<string | null>(null);
  const [convertingQuestion, setConvertingQuestion] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New source check form
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [addingSource, setAddingSource] = useState(false);

  const fetchMonitoringData = async () => {
    setLoading(true);
    try {
      const [sumRes, evRes] = await Promise.all([
        fetch('/api/admin/ai/monitoring-summary', { credentials: 'include' }),
        fetch('/api/admin/ai/monitoring-events?limit=100', { credentials: 'include' })
      ]);

      if (sumRes.ok) {
        const sumData = await sumRes.json();
        setSummary(sumData);
      }
      if (evRes.ok) {
        const evData = await evRes.json();
        setEvents(evData.items || []);
      }
    } catch (err) {
      console.warn('[DARB V1.16] Failed to fetch monitoring data:', err);
      setActionMsg({ type: 'error', text: 'تعذر تحميل بيانات المراقبة' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoringData();
  }, []);

  // Re-check a source URL
  const handleRecheckSource = async (sourceUrl: string) => {
    setCheckingUrl(sourceUrl);
    setActionMsg(null);
    try {
      const res = await fetch('/api/admin/ai/check-source', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sourceUrl })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setActionMsg({
          type: 'success',
          text: `تم فحص المصدر بنجاح (${data.source.domain}): الحالة ${data.source.http_status}، الاستجابة ${data.responseTimeMs}ms`
        });
        fetchMonitoringData();
      } else {
        setActionMsg({ type: 'error', text: data.error || 'فشل فحص المصدر' });
      }
    } catch {
      setActionMsg({ type: 'error', text: 'خطأ في الاتصال أثناء فحص المصدر' });
    } finally {
      setCheckingUrl(null);
    }
  };

  // Convert repeated question to candidate (Human-in-the-loop)
  const handleConvertQuestion = async (question: string) => {
    setConvertingQuestion(question);
    setActionMsg(null);
    try {
      const res = await fetch('/api/admin/ai/convert-repeated-to-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setActionMsg({
          type: 'success',
          text: 'تم تحويل السؤال المتكرر إلى مقترح معرفة (قيد المراجعة). يمكنك اعتماده الآن من تبويب الحوكمة.'
        });
        fetchMonitoringData();
      } else {
        setActionMsg({ type: 'error', text: data.error || 'تعذر تحويل السؤال' });
      }
    } catch {
      setActionMsg({ type: 'error', text: 'خطأ في الاتصال أثناء التحويل' });
    } finally {
      setConvertingQuestion(null);
    }
  };

  // Add & test new source
  const handleAddAndCheckSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceUrl.trim()) return;
    setAddingSource(true);
    await handleRecheckSource(newSourceUrl.trim());
    setNewSourceUrl('');
    setAddingSource(false);
  };

  // Filtered repeated questions
  const repeatedQuestions = (summary?.repeatedQuestions || []).filter((q) =>
    q.normalized_question.toLowerCase().includes(questionSearch.toLowerCase())
  );

  // Filtered sources
  const sources = (summary?.sources || []).filter(
    (s) =>
      s.source_url.toLowerCase().includes(sourceSearch.toLowerCase()) ||
      (s.domain && s.domain.toLowerCase().includes(sourceSearch.toLowerCase()))
  );

  // Filtered events
  const filteredEvents = events.filter((ev) => {
    const matchesSeverity = selectedSeverity === 'all' || ev.severity === selectedSeverity;
    const matchesSearch =
      !eventSearch ||
      ev.event_type.toLowerCase().includes(eventSearch.toLowerCase()) ||
      (ev.question && ev.question.toLowerCase().includes(eventSearch.toLowerCase())) ||
      (ev.source_url && ev.source_url.toLowerCase().includes(eventSearch.toLowerCase()));
    return matchesSeverity && matchesSearch;
  });

  const getSeverityBadge = (severity: MonitorSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'info':
      default:
        return 'bg-sky-100 text-sky-800 border-sky-300';
    }
  };

  const getFreshnessBadge = (freshness?: string) => {
    switch (freshness) {
      case 'fresh':
        return { label: 'حديث (Fresh)', cls: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'aging':
        return { label: 'يحتاج متابعة (Aging)', cls: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'stale':
        return { label: 'قديم / غير متاح (Stale)', cls: 'bg-rose-100 text-rose-800 border-rose-300' };
      default:
        return { label: 'غير محدد', cls: 'bg-stone-100 text-stone-700 border-stone-200' };
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'repeated_question':
        return 'سؤال متكرر بكثافة';
      case 'stale_source':
        return 'مصدر يحتاج تحديث';
      case 'unreachable_source':
        return 'مصدر غير قابل للوصول';
      case 'low_feedback':
        return 'تقييم سلبي من مستخدم';
      case 'conflicting_sources':
        return 'تعارض بين المصادر';
      case 'candidate_created':
        return 'تم إنشاء مقترح معرفة';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-l from-[#071a2b] via-[#0b243b] to-[#123859] border border-cyan-500/30 rounded-2xl p-5 text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded-xl mt-0.5">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">DARB AI — نظام المراقبة وحداثة المصادر (V1.16)</h2>
                <span className="text-[10px] font-mono bg-cyan-400/20 text-cyan-200 border border-cyan-400/40 px-2 py-0.5 rounded-md font-bold">
                  AI Monitoring & Freshness
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1 max-w-3xl leading-relaxed">
                مراقبة مستمرة لتكرار أسئلة المستخدمين، فحص صحة واستجابة الروابط الحكومية والرسمية، وتصنيف حداثتها، مع نظام تنبيهات استباقي يدعم مسار المراجعة اليدوية (Human-in-the-Loop) دون أي نشر تلقائي في قاعدة المعرفة.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={fetchMonitoringData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>تحديث الفحص</span>
            </button>
          </div>
        </div>

        {/* Governance Guarantee Badge */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-cyan-200/90">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1bb49e]" />
            <span>ضمان الحوكمة: لا يتم تعديل أو نشر أي معلومة في قاعدة المعرفة تلقائياً، جميع المقترحات تتطلب اعتماد المشرف.</span>
          </div>
          {onNavigateToGovernance && (
            <button
              onClick={onNavigateToGovernance}
              className="text-xs font-bold text-[#8be4d4] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>فتح شاشة الاعتماد والحوكمة (V1.15)</span>
              <span>←</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-2 border ${
            actionMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-semibold">{actionMsg.text}</span>
          </div>
          <button
            onClick={() => setActionMsg(null)}
            className="text-stone-400 hover:text-stone-700 text-xs font-bold px-1.5 py-0.5"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* 1. KPI Monitoring Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Repeated Questions */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 font-semibold block">الأسئلة المتكررة النشطة</span>
            <span className="text-2xl font-black text-stone-900 mt-1 block">
              {summary?.metrics?.repeatedCount ?? summary?.repeatedQuestions?.length ?? 0}
            </span>
            <span className="text-[10px] text-stone-400">تكررت مرتين أو أكثر (توقيع SHA-256)</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        {/* Warning & Critical Events */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 font-semibold block">تنبيهات وأحداث حرجة</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">
              {summary?.metrics?.warningEvents ?? events.filter((e) => e.severity !== 'info').length}
            </span>
            <span className="text-[10px] text-stone-400">تحتاج متابعة المشرف</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Source Health */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 font-semibold block">المصادر المراقبة</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {summary?.sources?.length ?? 0}
            </span>
            <span className="text-[10px] text-stone-400">
              {summary?.metrics?.unreachableSources ? `${summary.metrics.unreachableSources} غير متاح` : 'جميع المصادر متاحة'}
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Globe2 className="w-5 h-5" />
          </div>
        </div>

        {/* Freshness Classification */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 font-semibold block">حداثة مصادر الويب</span>
            <span className="text-2xl font-black text-[#1bb49e] mt-1 block">
              {summary?.sources?.filter((s) => s.freshness === 'fresh').length ?? 0} حديث
            </span>
            <span className="text-[10px] text-stone-400">
              {summary?.metrics?.staleSources ? `${summary.metrics.staleSources} مصادر قديمة` : 'مفحوصة خلال 30 يوم'}
            </span>
          </div>
          <div className="p-3 bg-[#1bb49e]/10 text-[#1bb49e] rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Repeated Questions Section */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-stone-900 text-sm">اكتشاف الأسئلة المتكررة وتحويلها لمقترحات</h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                {repeatedQuestions.length} سؤال
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              تجميع الأسئلة ذات المعنى المتطابق عبر التوقيع الرياضي SHA-256 لتحديد النواقص المعرفية وتحويلها إلى مقترحات معتمدة.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث في الأسئلة المتكررة..."
              value={questionSearch}
              onChange={(e) => setQuestionSearch(e.target.value)}
              className="w-full text-xs pr-8 pl-3 py-1.5 rounded-xl border border-stone-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {repeatedQuestions.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400 bg-stone-50 rounded-xl">
            لم يتم تسجيل أسئلة متكررة حتى الآن. سيتم رصدها تلقائياً مع تزايد استفسارات المستخدمين.
          </div>
        ) : (
          <div className="divide-y divide-stone-100 border border-stone-100 rounded-xl overflow-hidden">
            {repeatedQuestions.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-white hover:bg-stone-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-black">
                      {item.hit_count}x
                    </span>
                    <h4 className="text-xs font-bold text-stone-900 leading-snug">
                      {item.normalized_question}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-stone-400 pr-8">
                    <span>آخر ظهور: {new Date(item.last_seen_at).toLocaleString('ar-EG')}</span>
                    {item.hit_count >= 5 && (
                      <span className="text-amber-600 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        سؤال عالي التكرار (أولوية للتوثيق)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                  <button
                    onClick={() => handleConvertQuestion(item.normalized_question)}
                    disabled={convertingQuestion === item.normalized_question}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1bb49e] hover:bg-[#159a86] text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {convertingQuestion === item.normalized_question ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>تحويل إلى مقترح معرفة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Source Health & Freshness Tracking */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-stone-900 text-sm">مراقبة صحة وحداثة المصادر الخارجية (Source Health)</h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                {sources.length} مصدر
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              فحص دوري لروابط المنصات الرسمية والوزارات للتحقق من كود الاستجابة (HTTP Status) وعدم توقف الروابط أو قدم محتواها.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث في النطاقات والروابط..."
                value={sourceSearch}
                onChange={(e) => setSourceSearch(e.target.value)}
                className="w-full text-xs pr-8 pl-3 py-1.5 rounded-xl border border-stone-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Quick Add and Test Form */}
        <form onSubmit={handleAddAndCheckSource} className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            placeholder="أدخل رابط مصدر جديد لفحصه وإضافته للمراقبة (https://...)"
            value={newSourceUrl}
            onChange={(e) => setNewSourceUrl(e.target.value)}
            className="flex-1 text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={addingSource || !newSourceUrl.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            {addingSource ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            <span>فحص وإضافة المصدر</span>
          </button>
        </form>

        {/* Sources Table */}
        <div className="border border-stone-100 rounded-xl overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-50 text-stone-500 border-b border-stone-100 font-semibold">
              <tr>
                <th className="p-3">المصدر والنطاق</th>
                <th className="p-3">حالة الوصول</th>
                <th className="p-3">كود HTTP</th>
                <th className="p-3">تصنيف الحداثة</th>
                <th className="p-3">آخر فحص</th>
                <th className="p-3 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sources.map((src, i) => {
                const badge = getFreshnessBadge(src.freshness);
                return (
                  <tr key={i} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-stone-900">
                          <Globe2 className="w-3.5 h-3.5 text-stone-400" />
                          <span>{src.domain || 'نطاق خارجي'}</span>
                        </div>
                        <a
                          href={src.source_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-[11px] text-sky-600 hover:underline inline-flex items-center gap-1 max-w-sm truncate"
                          title={src.source_url}
                        >
                          <span className="truncate">{src.source_url}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      </div>
                    </td>

                    <td className="p-3">
                      {src.is_reachable !== false ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>متاح ويعمل</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          <span>غير قابل للوصول</span>
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      <span
                        className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                          src.http_status && src.http_status >= 200 && src.http_status < 400
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {src.http_status || 'فشل الاتصال'}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </td>

                    <td className="p-3 text-stone-400 text-[11px]">
                      {src.last_checked_at
                        ? new Date(src.last_checked_at).toLocaleString('ar-EG')
                        : 'لم يتم الفحص بعد'}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleRecheckSource(src.source_url)}
                        disabled={checkingUrl === src.source_url}
                        title="إعادة فحص استجابة الرابط الآن"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${checkingUrl === src.source_url ? 'animate-spin' : ''}`} />
                        <span>إعادة الفحص</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Monitoring Events & Alerts */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-stone-900 text-sm">سجل تنبيهات وأحداث الجودة (Monitoring Events)</h3>
              <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                {filteredEvents.length} حدث
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              تنبيهات تلقائية عند حدوث أسئلة متكررة بكثافة، تعارضات في المصادر، أو روابط غير متاحة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Severity Filter Tabs */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setSelectedSeverity('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  selectedSeverity === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                الكل ({events.length})
              </button>
              <button
                onClick={() => setSelectedSeverity('critical')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  selectedSeverity === 'critical' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                حرجة ({events.filter((e) => e.severity === 'critical').length})
              </button>
              <button
                onClick={() => setSelectedSeverity('warning')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  selectedSeverity === 'warning' ? 'bg-amber-600 text-white shadow-2xs' : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                تحذيرات ({events.filter((e) => e.severity === 'warning').length})
              </button>
              <button
                onClick={() => setSelectedSeverity('info')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  selectedSeverity === 'info' ? 'bg-sky-600 text-white shadow-2xs' : 'text-sky-700 hover:bg-sky-50'
                }`}
              >
                معلومات ({events.filter((e) => e.severity === 'info').length})
              </button>
            </div>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400 bg-stone-50 rounded-xl">
            لا توجد أحداث مطابقة في سجل المراقبة.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-3.5 bg-stone-50/70 border border-stone-200 rounded-xl space-y-2 hover:border-stone-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(
                        ev.severity
                      )}`}
                    >
                      {ev.severity.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-stone-900">
                      {getEventTypeLabel(ev.event_type)}
                    </span>
                  </div>

                  <div className="text-[10px] text-stone-400">
                    {new Date(ev.created_at).toLocaleString('ar-EG')}
                  </div>
                </div>

                {ev.question && (
                  <div className="text-xs text-stone-800 bg-white p-2.5 rounded-lg border border-stone-200/80">
                    <span className="font-semibold text-stone-500 block text-[10px]">السؤال:</span>
                    <span>{ev.question}</span>
                  </div>
                )}

                {ev.source_url && (
                  <div className="text-xs text-stone-800 bg-white p-2.5 rounded-lg border border-stone-200/80 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-stone-500 block text-[10px]">المصدر المتأثر:</span>
                      <span className="font-mono text-[11px] text-rose-700">{ev.source_url}</span>
                    </div>
                    <button
                      onClick={() => handleRecheckSource(ev.source_url!)}
                      disabled={checkingUrl === ev.source_url}
                      className="px-2 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
                    >
                      فحص فوري
                    </button>
                  </div>
                )}

                {ev.metadata_json && Object.keys(ev.metadata_json).length > 0 && (
                  <div className="text-[11px] text-stone-600 bg-white/70 p-2 rounded-lg font-mono">
                    {JSON.stringify(ev.metadata_json, null, 2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
