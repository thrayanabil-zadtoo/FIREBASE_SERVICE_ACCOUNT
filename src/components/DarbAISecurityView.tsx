import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Clock, 
  RefreshCw, 
  Sliders, 
  Cpu, 
  Fingerprint, 
  Eye, 
  Copy, 
  Check, 
  Search, 
  Lock,
  Filter
} from 'lucide-react';
import { SecurityEvent, SecurityStats, SecurityConfig } from '../types/darb-ai-security.types';

export default function DarbAISecurityView() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [config, setConfig] = useState<SecurityConfig | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'info' | 'warning' | 'critical'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedFp, setCopiedFp] = useState<string | null>(null);

  // Simulation State
  const [simQuestion, setSimQuestion] = useState('');
  const [simInjection, setSimInjection] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [eventsRes, statsRes] = await Promise.all([
        fetch('/api/admin/ai/security-events').then(r => r.json()).catch(() => ({ ok: false })),
        fetch('/api/admin/ai/security-stats').then(r => r.json()).catch(() => ({ ok: false }))
      ]);

      if (eventsRes.ok && Array.isArray(eventsRes.events)) {
        setEvents(eventsRes.events);
      }
      if (statsRes.ok) {
        if (statsRes.stats) setStats(statsRes.stats);
        if (statsRes.config) setConfig(statsRes.config);
      }
    } catch (e) {
      console.error('Error fetching security guard data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFp(text);
    setTimeout(() => setCopiedFp(null), 2000);
  };

  const handleSimulate = async () => {
    if (!simQuestion.trim()) return;
    setSimLoading(true);
    try {
      const res = await fetch('/api/admin/ai/security-events/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: simQuestion,
          simulateInjection: simInjection
        })
      });
      const data = await res.json();
      setSimResult(data);
    } catch (err) {
      console.error('Sim error:', err);
    } finally {
      setSimLoading(false);
    }
  };

  // Filtered Events
  const filteredEvents = events.filter(ev => {
    if (filterSeverity !== 'all' && ev.severity !== filterSeverity) return false;
    if (filterType !== 'all') {
      if (filterType === 'allowed' && ev.event_type !== 'request_allowed') return false;
      if (filterType === 'blocked' && !ev.event_type.startsWith('request_blocked')) return false;
      if (filterType === 'injection' && !ev.event_type.includes('injection')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const fpMatch = ev.fingerprint?.toLowerCase().includes(q);
      const typeMatch = ev.event_type.toLowerCase().includes(q);
      const jsonMatch = JSON.stringify(ev.details_json || {}).toLowerCase().includes(q);
      if (!fpMatch && !typeMatch && !jsonMatch) return false;
    }
    return true;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <ShieldAlert className="w-3 h-3" />
            حرج (Critical)
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            تحذير (Warning)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            سليم (Info)
          </span>
        );
    }
  };

  const getEventNameAr = (type: string) => {
    if (type === 'request_allowed') return 'طلب مسموح ومعتمد';
    if (type.includes('rate_limit')) return 'حظر: تجاوز حد معدل الطلبات';
    if (type.includes('duplicate_suppressed')) return 'حظر: تكرار الطلب السريع';
    if (type.includes('empty_question')) return 'حظر: استفسار فارغ';
    if (type.includes('daily_budget_exceeded')) return 'حظر: تجاوز ميزانية التوكنات اليومية';
    if (type.includes('prompt_injection')) return 'اكتشاف ومحاصرة نص مشبوه (Prompt Injection)';
    return type;
  };

  return (
    <div className="space-y-6 text-stone-100 animate-in fade-in duration-300" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-indigo-950/80 to-stone-900 border border-indigo-500/30 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">DARB AI — الحماية، التكلفة والاعتمادية (V1.19)</h3>
                <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 px-2 py-0.5 rounded-md font-bold">
                  Security & Cost Guard
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1">
                مراقبة حدود الطلبات، الميزانية اليومية، محاصرة حقن التعليمات (Prompt Injection)، وتصنيف بيانات الويب كأدلة فقط دون تنفيذ أوامر، مع عدم النشر التلقائي نهائياً.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>تحديث السجلات</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Allowed */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>الطلبات المسموحة</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">
              {stats?.totalAllowed ?? (events.filter(e => e.event_type === 'request_allowed').length)}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">✓ تشغيل سليم</span>
          </div>
        </div>

        {/* Blocked */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>الطلبات المرفوضة</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-300 font-mono">
              {stats?.totalBlocked ?? (events.filter(e => e.event_type.startsWith('request_blocked')).length)}
            </span>
            <span className="text-[10px] text-stone-400">حماية من الإفراط</span>
          </div>
        </div>

        {/* Prompt Injections */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>حقن التعليمات المحبط</span>
            <Zap className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-300 font-mono">
              {stats?.injectionAttempts ?? (events.filter(e => e.event_type.includes('injection')).length)}
            </span>
            <span className="text-[10px] text-rose-400 font-bold">محاصرة فورية</span>
          </div>
        </div>

        {/* Estimated Daily Tokens */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>استهلاك التوكنات اليوم</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-black text-cyan-300 font-mono">
              {(stats?.todayTokens ?? 0).toLocaleString()}
            </span>
            <span className="text-[10px] text-stone-400">
              / {((config?.dailyTokenBudget ?? 500000) / 1000)}k حد
            </span>
          </div>
        </div>

        {/* Daily Requests */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>طلبات اليوم الإجمالية</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-black text-indigo-300 font-mono">
              {(stats?.todayRequests ?? 0).toLocaleString()}
            </span>
            <span className="text-[10px] text-stone-400">
              / {(config?.dailyRequestLimit ?? 1000)} حد
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Environment Settings & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Environment Security Thresholds (Safe: No API secrets) */}
        <div className="lg:col-span-5 bg-stone-900/70 border border-stone-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-stone-200 border-b border-stone-800 pb-3">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-bold">حدود وإعدادات الحماية النشطة (Environment)</h4>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950/60 border border-stone-800">
              <span className="text-stone-300">حد الطلبات في النافذة الزمنية:</span>
              <span className="font-mono font-bold text-white bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-500/30">
                {config?.rateLimitPerWindow ?? 30} طلب / {config?.rateLimitWindowSeconds ?? 60} ثانية
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950/60 border border-stone-800">
              <span className="text-stone-300">الحد الأقصى اليومي للطلبات:</span>
              <span className="font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/30">
                {(config?.dailyRequestLimit ?? 1000).toLocaleString()} طلب/يوم
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950/60 border border-stone-800">
              <span className="text-stone-300">ميزانية التوكنات اليومية:</span>
              <span className="font-mono font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/30">
                {(config?.dailyTokenBudget ?? 500000).toLocaleString()} توكن
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950/60 border border-stone-800">
              <span className="text-stone-300">منع التكرار السريع (Suppression):</span>
              <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                {config?.duplicateSuppressionSeconds ?? 20} ثانية
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950/60 border border-stone-800">
              <span className="text-stone-300">الحد الأقصى لأحرف المصدر الخارجي:</span>
              <span className="font-mono font-bold text-stone-200 bg-white/5 px-2 py-0.5 rounded-md border border-stone-700">
                {(config?.externalEvidenceMaxChars ?? 12000).toLocaleString()} حرف
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950/60 border border-stone-800">
              <span className="text-stone-300">حالة النشر التلقائي (Auto-Publish):</span>
              <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                معطّل صارماً (False - Human-in-the-Loop)
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-2 text-[11px] text-stone-400">
            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>ضمان الأمان:</strong> لا يتم عرض أي مفاتيح سرية (API Keys) أو رموز اعتماد في واجهة المستخدم، وتتم كافة التحققات الحاكمة على جانب الخادم حصراً.
            </p>
          </div>
        </div>

        {/* Security & Injection Simulator */}
        <div className="lg:col-span-7 bg-stone-900/70 border border-stone-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-stone-200 border-b border-stone-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold">محاكي اختبار الحماية وبصمة الاستفسار (Security Simulator)</h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-stone-300 mb-1">
                نص الاستفسار أو المحتوى الخارجي المراد اختباره:
              </label>
              <textarea
                value={simQuestion}
                onChange={e => setSimQuestion(e.target.value)}
                placeholder="مثال: كم رسوم تجديد جواز السفر؟ أو إدخال نص خارجي يحتوي عبارات مشبوهة..."
                rows={3}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simInjection}
                  onChange={e => setSimInjection(e.target.checked)}
                  className="rounded border-stone-700 text-indigo-600 focus:ring-0"
                />
                <span>محاكاة حقن تعليمات مشبوهة (Inject "ignore previous instructions")</span>
              </label>

              <button
                onClick={handleSimulate}
                disabled={simLoading || !simQuestion.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {simLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                <span>فحص وتوليد البصمة</span>
              </button>
            </div>

            {/* Simulation Result */}
            {simResult && (
              <div className="mt-3 p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2.5 text-xs animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">قرار الحماية:</span>
                  {simResult.decision?.allowed ? (
                    <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      مسموح (Allowed)
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold inline-flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      محظور ({simResult.decision?.reason})
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-400">بصمة الطلب (SHA-256 Fingerprint):</span>
                  <span className="font-mono text-[10px] text-stone-300 bg-white/5 px-2 py-0.5 rounded border border-stone-800">
                    {simResult.fingerprint?.slice(0, 18)}...
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-400">التوكنات التقديرية:</span>
                  <span className="font-mono text-cyan-300 font-bold">{simResult.estimatedTokens} توكن</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-400">حالة حقن التعليمات في المحتوى:</span>
                  {simResult.sanitized?.flagged ? (
                    <span className="text-rose-400 font-bold bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                      ⚠️ تم كشف محاولة حقن ({simResult.sanitized?.patternsFound?.length} نمط)
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold">✓ نظيف تماماً</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security Events Table & Filters */}
      <div className="bg-stone-900/70 border border-stone-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">سجل أحداث الحماية والاستهلاك (Security Events Log)</h4>
            <span className="text-xs text-stone-400 font-mono">({filteredEvents.length} حدث)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="بحث بالبصمة أو السبب..."
                className="w-48 bg-stone-950 border border-stone-700 rounded-xl px-2.5 py-1 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-indigo-500 pr-7"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute right-2 top-2" />
            </div>

            {/* Severity Filter */}
            <select
              value={filterSeverity}
              onChange={e => setFilterSeverity(e.target.value as any)}
              className="bg-stone-950 border border-stone-700 rounded-xl px-2.5 py-1 text-xs text-stone-200 focus:outline-none"
            >
              <option value="all">كافة المستويات</option>
              <option value="critical">حرج (Critical)</option>
              <option value="warning">تحذير (Warning)</option>
              <option value="info">سليم (Info)</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="bg-stone-950 border border-stone-700 rounded-xl px-2.5 py-1 text-xs text-stone-200 focus:outline-none"
            >
              <option value="all">كافة العمليات</option>
              <option value="allowed">الطلبات المسموحة</option>
              <option value="blocked">الطلبات المرفوضة</option>
              <option value="injection">محاولات الحقن</option>
            </select>
          </div>
        </div>

        {/* Table / List */}
        {loading ? (
          <div className="p-8 text-center text-stone-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>جاري تحميل سجلات الحماية...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-xs">
            لا توجد أحداث حماية مطابقة للمرشحات الحالية.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 text-[11px]">
                  <th className="py-2.5 px-3">النوع / القرار</th>
                  <th className="py-2.5 px-3">المستوى</th>
                  <th className="py-2.5 px-3">بصمة الطلب (Fingerprint)</th>
                  <th className="py-2.5 px-3">التفاصيل والأسباب</th>
                  <th className="py-2.5 px-3">التوقيت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-sans">
                {filteredEvents.map((ev, idx) => {
                  const fpShort = ev.fingerprint ? `${ev.fingerprint.slice(0, 14)}...` : '—';
                  const details = ev.details_json || {};
                  const isCopied = copiedFp === ev.fingerprint;

                  return (
                    <tr key={ev.id || idx} className="hover:bg-stone-800/40 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-stone-200">
                          {getEventNameAr(ev.event_type)}
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          {ev.event_type}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {getSeverityBadge(ev.severity)}
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {ev.fingerprint ? (
                          <div className="flex items-center gap-1.5 font-mono text-[10px] text-stone-300 bg-stone-950 px-2 py-1 rounded-md border border-stone-800 w-fit">
                            <span>{fpShort}</span>
                            <button
                              onClick={() => handleCopy(ev.fingerprint!)}
                              title="نسخ البصمة كاملة"
                              className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-stone-600">—</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-stone-300">
                        {details.reason ? (
                          <span className="text-amber-300 font-medium">السبب: {String(details.reason)}</span>
                        ) : details.patternsFound ? (
                          <span className="text-rose-300 font-medium">أنماط محظورة: {(details.patternsFound as any).length}</span>
                        ) : (
                          <span className="text-stone-400">توكنات: {details.estimatedTokens ?? '—'}</span>
                        )}
                        {details.retryAfterSeconds ? (
                          <span className="text-stone-400 text-[10px] mr-2">(إعادة بعد: {details.retryAfterSeconds}ث)</span>
                        ) : null}
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap text-stone-400 text-[11px] font-mono">
                        {ev.created_at ? new Date(ev.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'الآن'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
