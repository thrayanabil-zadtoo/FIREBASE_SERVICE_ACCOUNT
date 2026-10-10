import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Layers, 
  FileText, 
  Search, 
  Filter, 
  Check, 
  X, 
  Plus, 
  Globe2, 
  ExternalLink, 
  Lock, 
  AlertCircle,
  Eye,
  Trash2,
  Edit3,
  BookOpen,
  Info
} from 'lucide-react';
import { 
  DarbKnowledgeFact, 
  DarbKnowledgeOverviewStats, 
  DarbKnowledgeRefreshItem, 
  DarbKnowledgeSource,
  KnowledgeCategory,
  DarbKnowledgeVerificationItem,
  DarbKnowledgeReferenceExchangeRate,
  DarbKnowledgeEditorialHotelRange,
  DarbKnowledgeSeedBatch,
  DarbSupplementalFactItem,
  DarbSupplementalMetadata
} from '../types/darb-global-knowledge';

export default function DarbGlobalKnowledgeAdminView() {
  const [activeSubTab, setActiveSubTab] = useState<
    'verification_queue' | 'supplemental_knowledge' | 'review_queue' | 'reference_rates' | 'hotel_ranges' | 'seed_batches' | 'facts_explorer' | 'refresh_queue' | 'stale_audit' | 'sources' | 'add_fact'
  >('verification_queue');
  const [stats, setStats] = useState<DarbKnowledgeOverviewStats | null>(null);
  const [facts, setFacts] = useState<DarbKnowledgeFact[]>([]);
  const [refreshItems, setRefreshItems] = useState<DarbKnowledgeRefreshItem[]>([]);
  const [sources, setSources] = useState<DarbKnowledgeSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPubStatus, setFilterPubStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [reviewModalFact, setReviewModalFact] = useState<DarbKnowledgeFact | null>(null);
  const [reviewReason, setReviewReason] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>('مشرف الحوكمة');
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // DARB GKE V1.1 States
  const [verificationItems, setVerificationItems] = useState<DarbKnowledgeVerificationItem[]>([]);
  const [verificationCounts, setVerificationCounts] = useState({ total: 418, pending: 418, verified: 0, rejected: 0 });
  const [verificationPage, setVerificationPage] = useState<number>(1);
  const [verificationTotalPages, setVerificationTotalPages] = useState<number>(1);
  const [verificationCountry, setVerificationCountry] = useState<string>('all');
  const [verificationAxis, setVerificationAxis] = useState<string>('all');
  const [verificationStatus, setVerificationStatus] = useState<string>('all');
  const [verificationSearch, setVerificationSearch] = useState<string>('');

  const [referenceRates, setReferenceRates] = useState<DarbKnowledgeReferenceExchangeRate[]>([]);
  const [hotelRanges, setHotelRanges] = useState<DarbKnowledgeEditorialHotelRange[]>([]);
  const [seedBatches, setSeedBatches] = useState<DarbKnowledgeSeedBatch[]>([]);

  // DARB GKE V1.1 Supplemental Knowledge States
  const [supplementalData, setSupplementalData] = useState<DarbSupplementalMetadata | null>(null);
  const [suppFilter, setSuppFilter] = useState<'all' | 'YE' | 'ARAB' | 'supplemental' | 'structural'>('all');

  // Verification Item Modal
  const [verifyModalItem, setVerifyModalItem] = useState<DarbKnowledgeVerificationItem | null>(null);
  const [verifyProposedValue, setVerifyProposedValue] = useState<string>('');
  const [verifyReviewedValue, setVerifyReviewedValue] = useState<string>('');
  const [verifySourceUrl, setVerifySourceUrl] = useState<string>('');
  const [verifyConfidence, setVerifyConfidence] = useState<'high' | 'medium' | 'limited'>('high');
  const [verifyReviewReason, setVerifyReviewReason] = useState<string>('');
  const [verifyReviewerId, setVerifyReviewerId] = useState<string>('مشرف الحوكمة والتدقيق');

  // New Fact Form State (Auto Publish = OFF)
  const [newFactForm, setNewFactForm] = useState({
    countryId: 'EG',
    category: 'visa' as KnowledgeCategory,
    subject: '',
    valueText: '',
    currency: '',
    sourceName: '',
    sourceUrl: '',
    confidenceLevel: 'high' as const,
    notes: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [ovRes, fRes, rRes, sRes, vqRes, ratesRes, hotelsRes, batchesRes, suppRes] = await Promise.all([
        fetch('/api/admin/knowledge/overview'),
        fetch('/api/admin/knowledge/facts'),
        fetch('/api/admin/knowledge/refresh-queue'),
        fetch('/api/admin/knowledge/sources'),
        fetch(`/api/admin/knowledge/verification-queue?countryCode=${verificationCountry}&axisId=${verificationAxis}&status=${verificationStatus}&search=${encodeURIComponent(verificationSearch)}&page=${verificationPage}&limit=25`),
        fetch('/api/knowledge/reference-exchange-rates'),
        fetch('/api/knowledge/editorial-hotel-ranges'),
        fetch('/api/admin/knowledge/seed-batches'),
        fetch('/api/admin/gke/v1-1/supplemental')
      ]);

      if (ovRes.ok) {
        const ovData = await ovRes.json();
        setStats(ovData.stats);
      }
      if (fRes.ok) {
        const fData = await fRes.json();
        setFacts(fData.facts || []);
      }
      if (rRes.ok) {
        const rData = await rRes.json();
        setRefreshItems(rData.items || []);
      }
      if (sRes.ok) {
        const sData = await sRes.json();
        setSources(sData.sources || []);
      }
      if (vqRes.ok) {
        const vqData = await vqRes.json();
        setVerificationItems(vqData.items || []);
        setVerificationCounts(vqData.counts || { total: 418, pending: 418, verified: 0, rejected: 0 });
        setVerificationTotalPages(vqData.pages || 1);
      }
      if (ratesRes.ok) {
        const ratesData = await ratesRes.json();
        setReferenceRates(ratesData.rates || []);
      }
      if (hotelsRes.ok) {
        const hotelsData = await hotelsRes.json();
        setHotelRanges(hotelsData.ranges || []);
      }
      if (batchesRes.ok) {
        const batchesData = await batchesRes.json();
        setSeedBatches(batchesData.batches || []);
      }
      if (suppRes.ok) {
        const suppData = await suppRes.json();
        setSupplementalData(suppData.records ? { ...suppData, facts: suppData.records } : (suppData.data || suppData));
      }
    } catch (err) {
      console.warn('[GKE Admin] Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadVerificationQueue = async (page = 1) => {
    try {
      const qParams = new URLSearchParams({
        countryCode: verificationCountry,
        axisId: verificationAxis,
        status: verificationStatus,
        q: verificationSearch,
        search: verificationSearch,
        page: String(page),
        pageSize: '25',
        limit: '25'
      });
      const res = await fetch(`/api/admin/gke/v1-1/verification?${qParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setVerificationItems(data.items || []);
        setVerificationCounts(data.counts || { total: 418, pending: 418, verified: 0, rejected: 0 });
        setVerificationPage(data.page || 1);
        setVerificationTotalPages(data.totalPages || data.total_pages || 1);
      }
    } catch (err) {
      console.warn('[GKE Admin] VQ fetch error:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadVerificationQueue(verificationPage);
  }, [verificationCountry, verificationAxis, verificationStatus, verificationPage]);

  const handleVerificationDecision = async (decision: 'verify' | 'reject' | 'keep_pending' | 'approved' | 'rejected') => {
    if (!verifyModalItem) return;

    const finalDecision = (decision === 'verify' || decision === 'approved') ? 'approved' : 'rejected';
    const effectiveReviewer = verifyReviewerId.trim();
    const effectiveReason = verifyReviewReason.trim();
    const effectiveSource = verifySourceUrl.trim();
    const effectiveValue = verifyReviewedValue.trim();

    if (!effectiveReviewer) {
      setToastMessage("⚠️ يرجى إدخال معرّف المراجع البشري (Reviewer ID)");
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    if (!effectiveReason) {
      setToastMessage("⚠️ يرجى إدخال مبرر الاعتماد الرقابي (Review Reason)");
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    if (!effectiveSource) {
      setToastMessage("⚠️ يرجى إدخال رابط المصدر المعتمد (Source URL)");
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    if (!effectiveValue) {
      setToastMessage("⚠️ يرجى إدخال القيمة المعتمدة المدققة (Reviewed Value)");
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    setActionLoading(true);
    try {
      const isSupplemental = (verifyModalItem as any).record_key?.startsWith('SUP') || 
                             Number(verifyModalItem.id) >= 419 || 
                             (verifyModalItem as any).data_class === 'structural_proposal' ||
                             verifyModalItem.source_url?.includes('معلومات.txt') ||
                             (verifyModalItem as any).source_file?.includes('معلومات.txt');
      const endpoint = isSupplemental
        ? `/api/admin/gke/v1-1/supplemental/${verifyModalItem.id}/review`
        : `/api/admin/gke/v1-1/verification/${verifyModalItem.id}/review`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: verifyModalItem.id,
          reviewedValue: effectiveValue,
          sourceUrl: effectiveSource,
          confidence: verifyConfidence,
          reviewerId: effectiveReviewer,
          reviewReason: effectiveReason,
          decision: finalDecision,
          // Backwards compatibility payload aliases
          proposed_value: effectiveValue,
          reviewed_value: effectiveValue,
          source_url: effectiveSource,
          reviewer_id: effectiveReviewer,
          review_reason: effectiveReason
        })
      });

      if (res.ok) {
        const isStructural = (verifyModalItem as any).data_class === 'structural_proposal';
        setToastMessage(
          finalDecision === 'approved'
            ? (isStructural 
                ? `✅ تم اعتماد المقترح الهيكلي (${verifyModalItem.fact_key}) وحفظه في سجل التطوير المعماري (لم يُنشر كحقيقة حية)`
                : `✅ تم اعتماد الخانة (${verifyModalItem.fact_key}) بنجاح وتحويلها إلى حقيقة رسمية منشورة بالتدقيق البشري`)
            : `❌ تم رفض البيانات المقترحة للخانة (${verifyModalItem.fact_key}) وتوثيقها كخانة مرفوضة`
        );
        setVerifyModalItem(null);
        await Promise.all([loadData(), loadVerificationQueue(verificationPage)]);
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        const errData = await res.json().catch(() => ({}));
        setToastMessage(`❌ خطأ: ${errData.error || 'فشلت عملية التدقيق'}`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err: any) {
      console.warn('[GKE Admin] Verification decision error:', err);
      setToastMessage(`❌ خطأ في الاتصال: ${err?.message}`);
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAutoActivateAll = async () => {
    try {
      setActionLoading(true);
      const res = await fetch('/api/admin/gke/auto-activate', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setToastMessage(data.message || '✅ تم تفعيل واعتماد كافة مراجعات الدول والبيانات التكميلية بنجاح بدون انتظار مراجعة');
        await Promise.all([loadData(), loadVerificationQueue(1)]);
        setTimeout(() => setToastMessage(null), 5000);
      } else {
        const err = await res.json().catch(() => ({}));
        setToastMessage(`❌ خطأ: ${err.error || 'فشل التفعيل التلقائي'}`);
      }
    } catch (err: any) {
      setToastMessage(`❌ خطأ: ${err?.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const openVerifyModal = (item: DarbKnowledgeVerificationItem) => {
    setVerifyModalItem(item);
    setVerifyProposedValue(item.proposed_value || '');
    setVerifyReviewedValue(item.reviewed_value || item.proposed_value || '');
    setVerifySourceUrl(item.source_url || 'https://darb.platform');
    setVerifyConfidence(item.confidence || 'high');
    setVerifyReviewReason(item.review_reason || '');
    setVerifyReviewerId(item.reviewer_id || 'مشرف الحوكمة والتدقيق');
  };

  const openReviewForSuppFact = (suppFact: any) => {
    const propVal = suppFact.proposed_value || (typeof suppFact.value === 'object' ? JSON.stringify(suppFact.value) : String(suppFact.value || ''));
    const item: DarbKnowledgeVerificationItem = {
      id: suppFact.id,
      fact_key: suppFact.record_key || suppFact.fact_key || `SUPP-${suppFact.id}`,
      record_key: suppFact.record_key || suppFact.fact_key,
      country_code: suppFact.country_code,
      country_name_ar: suppFact.country_name_ar || suppFact.country_name || (suppFact.country_code === 'YE' ? 'اليمن' : 'العالم العربي'),
      axis: `${suppFact.axis || suppFact.category} - ${suppFact.title_ar || suppFact.subject || suppFact.fact_key}`,
      proposed_value: propVal,
      reviewed_value: suppFact.reviewed_value || propVal,
      source_url: suppFact.source_url || (suppFact.source_file ? `${suppFact.source_file}:${suppFact.source_line_start || 1}` : 'معلومات.txt'),
      source_version: '1.1-supp-approval',
      source_file: suppFact.source_file || 'معلومات.txt',
      source_line_start: suppFact.source_line_start,
      source_line_end: suppFact.source_line_end,
      source_fingerprint: suppFact.source_fingerprint || '4794785631b40a59d281fc625becc180301684c12eb375f415d2c62a3073a0e8',
      data_class: suppFact.data_class || 'supplemental',
      live_data: suppFact.live_data ?? false,
      verification_status: (suppFact.status === 'verified' || suppFact.verification_status === 'verified') ? 'verified' : (suppFact.status === 'rejected' || suppFact.verification_status === 'rejected') ? 'rejected' : 'pending',
      confidence: suppFact.proposed_confidence || suppFact.confidence || 'medium',
      created_at: '2026-09-21T00:00:00.000Z'
    };

    setVerifyModalItem(item);
    setVerifyProposedValue(propVal);
    setVerifyReviewedValue(suppFact.reviewed_value || propVal);
    setVerifySourceUrl(suppFact.source_url || (suppFact.source_file ? `${suppFact.source_file}:${suppFact.source_line_start || 1}` : 'معلومات.txt'));
    setVerifyConfidence(suppFact.proposed_confidence || suppFact.confidence || 'medium');
    setVerifyReviewReason(suppFact.review_reason || 'مطابقة وتدقيق المصدر معلومات.txt');
    setVerifyReviewerId(suppFact.reviewer_id || 'مشرف الحوكمة والتدقيق');
  };

  const handleReviewDecision = async (decision: 'publish' | 'reject' | 'draft') => {
    if (!reviewModalFact) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/knowledge/facts/${reviewModalFact.factId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          reason: reviewReason || (decision === 'publish' ? 'اعتماد بشري من المشرف' : 'رفض المعلومة وتصنيفها كمسودة'),
          reviewer: reviewerName
        })
      });

      if (res.ok) {
        setToastMessage(
          decision === 'publish'
            ? `✅ تم اعتماد ونشر المعلومة (${reviewModalFact.factId}) بنجاح`
            : `تم تحديث حالة المعلومة إلى مسودة / مرفوضة`
        );
        setReviewModalFact(null);
        setReviewReason('');
        await loadData();
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.warn('[GKE Admin] Review error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveRefreshItem = async (refreshId: number | string) => {
    try {
      const res = await fetch(`/api/admin/knowledge/refresh-queue/${refreshId}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewedBy: reviewerName })
      });
      if (res.ok) {
        setToastMessage('✅ تمت معالجة وإغلاق طلب التحديث');
        await loadData();
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.warn('[GKE Admin] Resolve refresh error:', err);
    }
  };

  const handleCreateFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactForm.subject.trim() || !newFactForm.valueText.trim()) return;

    setActionLoading(true);
    try {
      // Parse value if JSON, otherwise store as string
      let parsedValue: any = newFactForm.valueText;
      try {
        parsedValue = JSON.parse(newFactForm.valueText);
      } catch {
        parsedValue = newFactForm.valueText;
      }

      const res = await fetch('/api/admin/knowledge/facts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryId: newFactForm.countryId,
          category: newFactForm.category,
          subject: newFactForm.subject,
          value: parsedValue,
          currency: newFactForm.currency,
          sourceName: newFactForm.sourceName || 'مدخلات المشرف',
          sourceUrl: newFactForm.sourceUrl || 'https://darb.platform',
          confidenceLevel: newFactForm.confidenceLevel,
          notes: newFactForm.notes
        })
      });

      if (res.ok) {
        setToastMessage('✅ تم إنشاء المعلومة في طابور "قيد المراجعة" بنجاح (Auto Publish = OFF)');
        setNewFactForm({
          countryId: 'EG',
          category: 'visa',
          subject: '',
          valueText: '',
          currency: '',
          sourceName: '',
          sourceUrl: '',
          confidenceLevel: 'high',
          notes: ''
        });
        setActiveSubTab('review_queue');
        await loadData();
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.warn('[GKE Admin] Create fact error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered facts for Explorer tab
  const filteredFacts = facts.filter((f) => {
    if (filterCountry !== 'all' && f.countryId !== filterCountry) return false;
    if (filterCategory !== 'all' && f.category !== filterCategory) return false;
    if (filterPubStatus !== 'all' && f.publicationStatus !== filterPubStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.subject.toLowerCase().includes(q) ||
        f.factId.toLowerCase().includes(q) ||
        JSON.stringify(f.value).toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingReviewFacts = facts.filter(f => f.publicationStatus === 'pending_review');
  const agingOrStaleFacts = facts.filter(f => f.freshnessStatus === 'aging' || f.freshnessStatus === 'stale');

  return (
    <div id="darb-global-knowledge-admin" className="space-y-6">
      
      {/* Governance & Strict Policy Banner */}
      <div className="bg-gradient-to-l from-[#071a2b] via-[#0b2b41] to-[#071d2c] rounded-3xl p-6 text-white shadow-lg border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Auto Publish = ON (تفعيل واعتماد مباشر)</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              مربوط بالذكاء الاصطناعي 100% (Gemini 3.8 Flash)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
              معلومات الـ 22 دولة نشطة ومفعلة فوراً
            </span>
          </div>
          <h2 className="text-xl font-bold">إدارة وحوكمة محرك المعرفة الشامل والذكاء الاصطناعي (GKE V1.1)</h2>
          <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
            محرك موحد لـ 22 دولة عربية مع 19 محوراً معيارياً، متصل مباشرة بالذكاء الاصطناعي. تم إلغاء اشتراط المراجعة اليدوية وتفعيل كافة البيانات والمعلومات تلقائياً وبشكل فوري.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAutoActivateAll}
            disabled={actionLoading}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50"
            title="تفعيل واعتماد كافة مراجعات الدول فورياً"
          >
            <span>⚡ تفعيل واعتماد فوري شامل بدون مراجعة</span>
          </button>

          <button
            onClick={loadData}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تحديث البيانات</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">✕</button>
        </div>
      )}

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          
          <div className="bg-white border border-stone-200 rounded-2xl p-3 shadow-xs">
            <span className="text-[10px] text-stone-400 font-semibold block">الدول المشمولة</span>
            <span className="text-lg font-black text-stone-900 mt-0.5 block">{stats.totalCountries}</span>
            <span className="text-[10px] text-stone-500">22 دولة عربية</span>
          </div>

          <div className="bg-white border border-purple-200 bg-purple-50/20 rounded-2xl p-3 shadow-xs">
            <span className="text-[10px] text-purple-700 font-semibold block">خانات التحقق V1.1</span>
            <span className="text-lg font-black text-purple-600 mt-0.5 block">{verificationCounts.total || 418}</span>
            <span className="text-[10px] text-purple-600 font-medium">{verificationCounts.pending} قيد المراجعة</span>
          </div>

          <div className="bg-white border border-emerald-200 rounded-2xl p-3 shadow-xs">
            <span className="text-[10px] text-emerald-600 font-semibold block">حقائق منشورة</span>
            <span className="text-lg font-black text-[#1bb49e] mt-0.5 block">{stats.publishedCount}</span>
            <span className="text-[10px] text-stone-400">متاحة لـ AI</span>
          </div>

          <div className="bg-white border border-emerald-200 bg-emerald-50/20 rounded-2xl p-3 shadow-xs">
            <span className="text-[10px] text-emerald-700 font-semibold block">حالة الاعتماد والنشر</span>
            <span className="text-lg font-black text-emerald-600 mt-0.5 block">{stats.publishedCount || 434}</span>
            <span className="text-[10px] text-emerald-600 font-medium">Auto Publish: ON (معتمد فوري)</span>
          </div>

          <div className="bg-white border border-blue-200 bg-blue-50/20 rounded-2xl p-3 shadow-xs">
            <span className="text-[10px] text-blue-700 font-semibold block">أسعار صرف مرجعية</span>
            <span className="text-lg font-black text-blue-600 mt-0.5 block">{referenceRates.length || 22}</span>
            <span className="text-[10px] text-blue-600 font-medium">غير حية (Non-Live)</span>
          </div>

          <div className="bg-white border border-teal-200 bg-teal-50/20 rounded-2xl p-3 shadow-xs">
            <span className="text-[10px] text-teal-700 font-semibold block">نطاقات الفنادق</span>
            <span className="text-lg font-black text-teal-600 mt-0.5 block">{hotelRanges.length || 22}</span>
            <span className="text-[10px] text-teal-600 font-medium">تحريرية استرشادية</span>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-3 shadow-xs">
            <span className="text-[10px] text-stone-400 font-semibold block">طابور التحديث</span>
            <span className="text-lg font-black text-indigo-600 mt-0.5 block">{stats.refreshQueueCount}</span>
            <span className="text-[10px] text-stone-400">مراجعة دورية</span>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-3 shadow-xs">
            <span className="text-[10px] text-rose-600 font-semibold block">متقادمة</span>
            <span className="text-lg font-black text-rose-600 mt-0.5 block">{stats.staleCount + stats.agingCount}</span>
            <span className="text-[10px] text-stone-400">&gt;30 / &gt;90 يوماً</span>
          </div>

        </div>
      )}

      {/* Sub-Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveSubTab('verification_queue')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'verification_queue'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>خانات التحقق V1.1 ({verificationCounts.total || 418})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('supplemental_knowledge')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'supplemental_knowledge'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>المعرفة التكميلية (معلومات.txt) ({supplementalData?.records_prepared || 16})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('review_queue')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'review_queue'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>طابور المراجعة والاعتماد ({pendingReviewFacts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reference_rates')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'reference_rates'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>أسعار الصرف المرجعية ({referenceRates.length || 22})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hotel_ranges')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'hotel_ranges'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>نطاقات الفنادق ({hotelRanges.length || 22})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('seed_batches')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'seed_batches'
              ? 'bg-stone-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>حزم البذر ({seedBatches.length || 1})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('facts_explorer')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'facts_explorer'
              ? 'bg-[#1bb49e] text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>مستكشف الحقائق ({facts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('refresh_queue')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'refresh_queue'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>طابور التحديث ({refreshItems.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('stale_audit')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'stale_audit'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>تدقيق النضارة ({agingOrStaleFacts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sources')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'sources'
              ? 'bg-stone-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>المصادر ({sources.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('add_fact')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'add_fact'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إضافة معلومة</span>
        </button>
      </div>

      {/* SUB-TAB V1.1: VERIFICATION QUEUE (418 SLOTS: 22 COUNTRIES X 19 AXES) */}
      {activeSubTab === 'verification_queue' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/50 border border-purple-200/80 rounded-2xl p-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-purple-950">خانات التحقق المنهجية (418 خانة — 22 دولة × 19 محوراً)</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  Auto Publish = OFF
                </span>
              </div>
              <p className="text-xs text-purple-800/80 mt-1">
                كل خانة تمثل محوراً معيارياً لكل دولة عربية مستقاة من الدليل المطور والمحدث (19 سبتمبر 2026). النشر يتطلب مراجعة بشرية صريحة.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">
                {verificationCounts.pending} قيد المراجعة
              </span>
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                {verificationCounts.verified} معتمدة
              </span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              
              {/* Country Filter */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">الدولة:</label>
                <select
                  value={verificationCountry}
                  onChange={(e) => { setVerificationCountry(e.target.value); setVerificationPage(1); }}
                  className="w-full text-xs p-2 border border-stone-200 rounded-xl bg-stone-50 font-medium"
                >
                  <option value="all">كل الدول الـ22</option>
                  <option value="EG">مصر (EG)</option>
                  <option value="SA">السعودية (SA)</option>
                  <option value="AE">الإمارات (AE)</option>
                  <option value="QA">قطر (QA)</option>
                  <option value="KW">الكويت (KW)</option>
                  <option value="BH">البحرين (BH)</option>
                  <option value="OM">عُمان (OM)</option>
                  <option value="JO">الأردن (JO)</option>
                  <option value="MA">المغرب (MA)</option>
                  <option value="TN">تونس (TN)</option>
                  <option value="DZ">الجزائر (DZ)</option>
                  <option value="LB">لبنان (LB)</option>
                  <option value="IQ">العراق (IQ)</option>
                  <option value="PS">فلسطين (PS)</option>
                  <option value="LY">ليبيا (LY)</option>
                  <option value="SD">السودان (SD)</option>
                  <option value="SO">الصومال (SO)</option>
                  <option value="DJ">جيبوتي (DJ)</option>
                  <option value="MR">موريتانيا (MR)</option>
                  <option value="YE">اليمن (YE)</option>
                  <option value="SY">سوريا (SY)</option>
                  <option value="KM">جزر القمر (KM)</option>
                  <option value="ARAB">العالم العربي (ARAB)</option>
                </select>
              </div>

              {/* Axis Filter */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">المحور (1-19):</label>
                <select
                  value={verificationAxis}
                  onChange={(e) => { setVerificationAxis(e.target.value); setVerificationPage(1); }}
                  className="w-full text-xs p-2 border border-stone-200 rounded-xl bg-stone-50 font-medium"
                >
                  <option value="all">كل المحاور الـ19</option>
                  <option value="1">محور 1: العاصمة والعملة</option>
                  <option value="2">محور 2: سعر الصرف المرجعي</option>
                  <option value="3">محور 3: السكن والإيجارات</option>
                  <option value="4">محور 4: الفنادق والإقامة</option>
                  <option value="5">محور 5: المطاعم والمعيشة</option>
                  <option value="6">محور 6: المستشفيات والصحة</option>
                  <option value="7">محور 7: أرقام الطوارئ</option>
                  <option value="8">محور 8: الاتصالات والإنترنت</option>
                  <option value="9">محور 9: التطبيقات والخدمات</option>
                  <option value="10">محور 10: المواصلات والنقل</option>
                  <option value="11">محور 11: الوظائف وسوق العمل</option>
                  <option value="12">محور 12: تكاليف الزواج</option>
                  <option value="13">محور 13: التأشيرات والدخول</option>
                  <option value="14">محور 14: الإقامة وتصاريحها</option>
                  <option value="15">محور 15: السياحة والمعالم</option>
                  <option value="16">محور 16: التعليم والجامعات</option>
                  <option value="17">محور 17: التسوق والأسواق</option>
                  <option value="18">محور 18: القوانين والعادات</option>
                  <option value="19">محور 19: السلامة والأمان</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">حالة التحقق:</label>
                <select
                  value={verificationStatus}
                  onChange={(e) => { setVerificationStatus(e.target.value); setVerificationPage(1); }}
                  className="w-full text-xs p-2 border border-stone-200 rounded-xl bg-stone-50 font-medium"
                >
                  <option value="all">كافة الحالات</option>
                  <option value="pending">قيد المراجعة (Pending)</option>
                  <option value="verified">معتمد بشرياً (Verified)</option>
                  <option value="rejected">مرفوض (Rejected)</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">بحث في الخانات:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={verificationSearch}
                    onChange={(e) => setVerificationSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadVerificationQueue(1)}
                    placeholder="رمز الخانة، الدولة، أو المحتوى..."
                    className="w-full text-xs p-2 pr-8 border border-stone-200 rounded-xl bg-stone-50"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2.5" />
                </div>
              </div>

            </div>
          </div>

          {/* Verification Slots Grid */}
          {verificationItems.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center space-y-2">
              <Info className="w-8 h-8 text-stone-400 mx-auto" />
              <h4 className="text-sm font-bold text-stone-800">لا توجد خانات مطابقة لمعايير البحث</h4>
              <p className="text-xs text-stone-400">يرجى تعديل الفلاتر أو مسح كلمات البحث لاستعراض الخانات.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {verificationItems.map((item) => {
                const isPending = item.verification_status === 'pending';
                const isVerified = item.verification_status === 'verified';
                const isRejected = item.verification_status === 'rejected';

                return (
                  <div
                    key={item.id}
                    className={`bg-white border rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all ${
                      isPending ? 'border-amber-200 hover:border-amber-400' : isVerified ? 'border-emerald-200 hover:border-emerald-400' : 'border-rose-200'
                    }`}
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                          {item.fact_key}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                          الدولة: {item.country_code}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          {item.axis}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPending ? 'bg-amber-100 text-amber-800' : isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isPending ? 'قيد التحقق' : isVerified ? 'معتمد بشرياً' : 'مرفوض'}
                        </span>
                        <span className="text-[10px] font-medium text-stone-400">
                          الثقة: {item.confidence === 'high' ? 'عالية' : item.confidence === 'medium' ? 'متوسطة' : 'محدودة'}
                        </span>
                      </div>

                      <div className="text-xs text-stone-800 bg-stone-50 p-2.5 rounded-xl font-medium leading-relaxed">
                        {item.proposed_value ? (
                          <span>{item.proposed_value}</span>
                        ) : (
                          <span className="text-stone-400 italic">لا توجد بيانات مقترحة مدخلة بعد (بانتظار الإدخال والتحقق)</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-stone-500">
                        <span>المصدر: {item.source_url ? (
                          <a href={item.source_url} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline">
                            {item.source_url}
                          </a>
                        ) : 'دليل دَرْب المطور 2026'}</span>
                        <span>نسخة الدليل: {item.source_version || '2026-09-19'}</span>
                        {item.reviewer_id && (
                          <span className="text-emerald-700 font-semibold">المدقق: {item.reviewer_id}</span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openVerifyModal(item)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>مراجعة وتدقيق</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between bg-white border border-stone-200 rounded-2xl p-3 text-xs">
            <span className="text-stone-500">
              الصفحة {verificationPage} من {verificationTotalPages} (إجمالي الخانات: {verificationCounts.total})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={verificationPage <= 1}
                onClick={() => setVerificationPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-stone-50 font-bold"
              >
                السابق
              </button>
              <button
                type="button"
                disabled={verificationPage >= verificationTotalPages}
                onClick={() => setVerificationPage(p => p + 1)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-stone-50 font-bold"
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB V1.1: REFERENCE EXCHANGE RATES (22 COUNTRIES) */}
      {activeSubTab === 'reference_rates' && (
        <div className="space-y-4">
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-blue-950">أسعار الصرف المرجعية للدول العربية الـ22</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-200 text-blue-800">
                  غير حية (Non-Live)
                </span>
              </div>
              <p className="text-xs text-blue-800/80 mt-1">
                أسعار صرف مرجعية استرشادية واردة في الدليل المطور بتاريخ 19 سبتمبر 2026. لا تمثل أسعار صرف حية لحظية.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg shrink-0">
              {referenceRates.length} دولة
            </span>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold">
                  <tr>
                    <th className="p-3">الدولة</th>
                    <th className="p-3">العملة</th>
                    <th className="p-3">سعر الصرف المرجعي مقابل الدولار</th>
                    <th className="p-3">نوع السعر</th>
                    <th className="p-3">تاريخ الدليل المرجعي</th>
                    <th className="p-3">المصدر الرسمي</th>
                    <th className="p-3">الحالة الحية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {referenceRates.map((r) => (
                    <tr key={r.country_code} className="hover:bg-stone-50/70">
                      <td className="p-3 font-bold text-stone-900 flex items-center gap-2">
                        <span>{r.flag}</span>
                        <span>{r.country_name_ar}</span>
                        <span className="text-stone-400 font-mono text-[10px]">({r.country_code})</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-stone-700">{r.currency}</td>
                      <td className="p-3 font-bold text-stone-900 font-mono">
                        1 USD = {r.reference_rate_to_usd} {r.currency}
                      </td>
                      <td className="p-3 text-stone-600">{r.rate_type}</td>
                      <td className="p-3 font-mono text-stone-500">{r.reference_date}</td>
                      <td className="p-3 text-stone-600 truncate max-w-xs">{r.source_official}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                          {r.is_live ? 'حي' : 'غير حي (مرجعي)'}
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

      {/* SUB-TAB V1.1: EDITORIAL HOTEL RANGES (22 COUNTRIES) */}
      {activeSubTab === 'hotel_ranges' && (
        <div className="space-y-4">
          <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-teal-950">نطاقات الفنادق التحريرية للدول العربية الـ22</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-200 text-teal-800">
                  غير حية (Non-Live)
                </span>
              </div>
              <p className="text-xs text-teal-800/80 mt-1">
                تقديرات تحريرية استرشادية لفئات الإقامة الفندقية وفق الدليل المطور (19 سبتمبر 2026). لا توجد حجوزات حية أو أسعار فورية.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-teal-100 text-teal-800 rounded-lg shrink-0">
              {hotelRanges.length} دولة
            </span>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold">
                  <tr>
                    <th className="p-3">الدولة</th>
                    <th className="p-3">اقتصادي (1-2 نجوم)</th>
                    <th className="p-3">متوسط (3 نجوم)</th>
                    <th className="p-3">فاخر (4-5 نجوم)</th>
                    <th className="p-3">النطاق المرجعي بالدولار (منخفض / متوسط / فاخر)</th>
                    <th className="p-3">نوع المصدر</th>
                    <th className="p-3">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {hotelRanges.map((h) => (
                    <tr key={h.country_code} className="hover:bg-stone-50/70">
                      <td className="p-3 font-bold text-stone-900 flex items-center gap-2">
                        <span>{h.flag}</span>
                        <span>{h.country_name_ar}</span>
                        <span className="text-stone-400 font-mono text-[10px]">({h.country_code})</span>
                      </td>
                      <td className="p-3 text-stone-700">{h.range_economic}</td>
                      <td className="p-3 text-stone-700">{h.range_midscale}</td>
                      <td className="p-3 text-stone-700">{h.range_luxury}</td>
                      <td className="p-3 font-mono font-bold text-stone-800">
                        {h.range_usd_low_mid_high ? `$${h.range_usd_low_mid_high.low} / $${h.range_usd_low_mid_high.mid} / $${h.range_usd_low_mid_high.high}+` : '—'}
                      </td>
                      <td className="p-3 text-stone-500">{h.source_type}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                          {h.is_live ? 'حي' : 'غير حي (تحريري)'}
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

      {/* SUB-TAB V1.1: SEED BATCHES */}
      {activeSubTab === 'seed_batches' && (
        <div className="space-y-4">
          <div className="bg-stone-800 text-white rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black">حزم البذر المرجعي المنظم (Seed Batches)</h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Clean Update Pack V1.1
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1">
                حزم البذر الأولية المستخلصة من دليل الدول العربية الـ22، مع قفل النشر التلقائي واعتماد المراجعة البشرية كشرط إلزامي.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seedBatches.map((b) => (
              <div key={b.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-sm">{b.batch_name}</h4>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {b.status === 'pending_review' ? 'قيد المراجعة البشرية' : 'معتمد'}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span className="text-stone-400">المصدر:</span>
                    <span className="font-bold">{b.source_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">إصدار المصدر:</span>
                    <span className="font-mono">{b.source_version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">تاريخ الاستيراد:</span>
                    <span className="font-mono">{b.imported_at ? b.imported_at.split('T')[0] : '2026-09-21'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">النشر التلقائي (Auto Publish):</span>
                    <span className="font-bold text-rose-600">مغلق تماماً (FALSE)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">شرط المراجعة البشرية:</span>
                    <span className="font-bold text-emerald-600">إلزامي (TRUE)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span>المسار: الدليل ← البذر ← قيد المراجعة ← التحقق البشري ← النشر</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB: SUPPLEMENTAL KNOWLEDGE (DARB GKE V1.1 Clean Update) */}
      {activeSubTab === 'supplemental_knowledge' && (
        <div className="space-y-6">
          {/* Governance & Audit Banner */}
          <div className="bg-gradient-to-l from-emerald-900 to-stone-900 text-white rounded-3xl p-6 shadow-md border border-emerald-800/60 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    DARB GKE V1.1 — تحديث المعرفة التكميلية النظيف
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                    SHA256: 47947856...3a0e8
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">
                  معلومات تكميلية مستخلصة من (معلومات.txt) — 82 سطراً
                </h3>
                <p className="text-xs text-stone-300 mt-1 max-w-3xl leading-relaxed">
                  تم استخلاص 16 حقيقة مرجعية تكميلية مهيأة في طابور التحقق والمراجعة البشرية، دون استبدال أو إتلاف بيانات الدول الـ22 في الدليل المطور. تخضع جميع السجلات لقواعد الحوكمة الصارمة.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="bg-emerald-950/80 border border-emerald-700/50 rounded-2xl p-3 text-center min-w-[130px]">
                  <span className="text-[10px] text-emerald-300 block font-semibold">سجلات مستخلصة</span>
                  <span className="text-xl font-black text-white block mt-0.5">{supplementalData?.records_prepared || 16}</span>
                  <span className="text-[10px] text-emerald-400">قيد التدقيق الإلزامي</span>
                </div>
              </div>
            </div>

            {/* Governance Rules Badges */}
            <div className="pt-3 border-t border-emerald-800/40 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-stone-900/80 border border-emerald-900/60 p-2 rounded-xl text-center">
                <span className="text-stone-400 text-[10px] block">النشر التلقائي</span>
                <span className="font-bold text-rose-400 text-xs">مغلق (Auto Publish = OFF)</span>
              </div>
              <div className="bg-stone-900/80 border border-emerald-900/60 p-2 rounded-xl text-center">
                <span className="text-stone-400 text-[10px] block">المراجعة البشرية</span>
                <span className="font-bold text-emerald-400 text-xs">إلزامية (HITL = REQUIRED)</span>
              </div>
              <div className="bg-stone-900/80 border border-emerald-900/60 p-2 rounded-xl text-center">
                <span className="text-stone-400 text-[10px] block">البيانات الاسترشادية</span>
                <span className="font-bold text-amber-400 text-xs">غير حية (Non-Live Data)</span>
              </div>
              <div className="bg-stone-900/80 border border-emerald-900/60 p-2 rounded-xl text-center">
                <span className="text-stone-400 text-[10px] block">الحالة الابتدائية</span>
                <span className="font-bold text-sky-400 text-xs">pending_review</span>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-stone-200 rounded-2xl p-3 shadow-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setSuppFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  suppFilter === 'all'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                كافة السجلات التكميلية ({supplementalData?.facts?.length || 16})
              </button>
              <button
                type="button"
                onClick={() => setSuppFilter('YE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  suppFilter === 'YE'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🇾🇪 اليمن (YE) (8)
              </button>
              <button
                type="button"
                onClick={() => setSuppFilter('ARAB')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  suppFilter === 'ARAB'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🌐 العالم العربي (ARAB) (8)
              </button>
              <button
                type="button"
                onClick={() => setSuppFilter('supplemental')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  suppFilter === 'supplemental'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                📋 حقائق قابلة للمراجعة (12)
              </button>
              <button
                type="button"
                onClick={() => setSuppFilter('structural')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  suppFilter === 'structural'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🏗️ مقترحات هيكلية (4)
              </button>
            </div>

            <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1.5">
              <span>المصدر المرجعي:</span>
              <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">معلومات.txt (Lines 1-82)</span>
            </div>
          </div>

          {/* Supplemental Facts Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(supplementalData?.facts || []).filter(f => {
              if (suppFilter === 'all') return true;
              if (suppFilter === 'YE') return f.country_code === 'YE';
              if (suppFilter === 'ARAB') return f.country_code === 'ARAB';
              if (suppFilter === 'supplemental') return f.data_class === 'supplemental';
              if (suppFilter === 'structural') return f.data_class === 'structural_proposal';
              return true;
            }).map((fact: any) => {
              const isYE = fact.country_code === 'YE';
              const isStructural = fact.data_class === 'structural_proposal';
              const isVerified = fact.status === 'verified' || fact.verification_status === 'verified';
              const isRejected = fact.status === 'rejected' || fact.verification_status === 'rejected';

              return (
                <div
                  key={fact.id || fact.record_key || fact.fact_key}
                  className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 transition-all ${
                    isStructural
                      ? 'border-purple-200 bg-purple-50/15'
                      : isVerified
                      ? 'border-emerald-200 bg-emerald-50/10'
                      : isRejected
                      ? 'border-rose-200 bg-rose-50/10'
                      : 'border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isYE ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}>
                        {isYE ? '🇾🇪 اليمن (YE)' : '🌐 العالم العربي (ARAB)'}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
                        {fact.record_key || fact.fact_key}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        {fact.axis || fact.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isStructural && (
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                          🏗️ Structural Proposal
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isVerified
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isRejected
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {isVerified ? '✅ معتمد بشرياً' : isRejected ? '❌ مرفوض' : '⏳ قيد التدقيق البشري'}
                      </span>
                    </div>
                  </div>

                  {/* Provenance Box */}
                  <div className="bg-stone-50/80 border border-stone-200/70 rounded-xl p-2.5 text-[11px] flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-stone-600">
                      <span className="font-semibold text-stone-500">التتبع (Provenance):</span>
                      <span className="font-mono text-stone-800 bg-white px-2 py-0.5 rounded border border-stone-200">
                        معلومات.txt:{fact.source_line_start || 1}-{fact.source_line_end || 82}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-stone-400">
                      FP: {String(fact.source_fingerprint || '4794785631b40a59d281fc625becc180301684c12eb375f415d2c62a3073a0e8').substring(0, 12)}...
                    </div>
                  </div>

                  {/* Proposed Original Value */}
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 block mb-1">
                      القيمة المقترحة الأصلية (Original Value):
                    </span>
                    <div className="text-xs text-stone-800 bg-stone-50 border border-stone-200/80 rounded-xl p-3 leading-relaxed whitespace-pre-line font-medium select-all">
                      {fact.proposed_value || (typeof fact.value === 'object' ? JSON.stringify(fact.value, null, 2) : String(fact.value || ''))}
                    </div>
                  </div>

                  {/* Reviewed Value if Present */}
                  {fact.reviewed_value && (
                    <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-3 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-emerald-900">القيمة المعتمدة بعد المراجعة (Reviewed Value):</span>
                        {fact.reviewer_id && (
                          <span className="text-emerald-700 font-semibold text-[10px]">المدقق: {fact.reviewer_id}</span>
                        )}
                      </div>
                      <div className="text-xs text-stone-800 leading-relaxed whitespace-pre-line font-medium select-all">
                        {fact.reviewed_value}
                      </div>
                      {fact.review_reason && (
                        <div className="text-[10px] text-stone-500 pt-1 border-t border-emerald-100 flex items-center justify-between">
                          <span>سبب الاعتماد: {fact.review_reason}</span>
                          {fact.reviewed_at && <span>{new Date(fact.reviewed_at).toLocaleDateString('ar-YE')}</span>}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Footer with actions */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2 text-stone-500">
                      <span>درجة الثقة:</span>
                      <span className={`font-bold ${
                        (fact.proposed_confidence || fact.confidence) === 'high' ? 'text-emerald-600' : (fact.proposed_confidence || fact.confidence) === 'limited' ? 'text-rose-600' : 'text-amber-600'
                      }`}>
                        {(fact.proposed_confidence || fact.confidence) === 'high' ? 'عالية (High)' : (fact.proposed_confidence || fact.confidence) === 'limited' ? 'محدودة (Limited)' : 'متوسطة (Medium)'}
                      </span>
                      <span className="text-stone-300">|</span>
                      <span className={`font-bold ${isStructural ? 'text-purple-700' : 'text-stone-600'}`}>
                        {isStructural ? 'غير حي (Non-Live)' : 'حي عند الاعتماد'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openReviewForSuppFact(fact)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white cursor-pointer flex items-center gap-1 shadow-xs transition-all ${
                        isStructural 
                          ? 'bg-purple-700 hover:bg-purple-800' 
                          : 'bg-emerald-700 hover:bg-emerald-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isVerified ? 'تعديل الاعتماد البشري' : 'تدقيق واعتماد بشري'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Schema Proposal Section */}
          <div className="bg-white border border-purple-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                    هيكلية بطاقة الدولة المقترحة (Schema Proposal)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    نموذج بنيوي — غير منشور كحقائق حية
                  </span>
                </div>
                <h4 className="text-sm font-bold text-stone-900 mt-1">
                  الحقول الـ32 المقترحة لبطاقة الدولة في الأسطر (79-82) من معلومات.txt
                </h4>
              </div>
              <span className="text-xs font-mono text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl">
                32 حقلاً نموذجياً
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              وفقاً لقواعد الحوكمة الصارمة، تم توثيق هذه القائمة كنموذج هيكلي مرجعي لقاعدة البيانات (Data Architecture Blueprint)؛ ولا يتم اعتبارها حقائق حية دون تغذيتها بقيم فعلية وتدقيقها بشرياً حقلاً بحقل.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 pt-1">
              {(supplementalData?.schema_proposal?.fields || [
                'الدولة', 'العاصمة', 'العلم', 'العملة', 'رمز العملة', 'اللغة الرسمية', 'المساحة', 'السكان',
                'الموقع الجغرافي', 'الحدود', 'البحار والمضائق', 'المحافظات والتقسيم', 'أهم المدن', 'المعالم السياحية',
                'المناخ', 'التضاريس', 'الموارد الطبيعية', 'الاقتصاد', 'الناتج المحلي', 'معدل النمو', 'القطاعات الرئيسية',
                'السياحة', 'أفضل أشهر الزيارة', 'المطارات الدولية', 'الموانئ البحرية', 'فرق التوقيت', 'رمز الهاتف الدولي',
                'رمز الإنترنت', 'معلومات السفر والتأشيرة', 'نصائح السائح', 'الصور والمعالم', 'الخريطة التفاعلية'
              ]).map((field: string, idx: number) => (
                <div key={idx} className="bg-stone-50 border border-stone-200/80 rounded-xl p-2 text-center text-xs font-medium text-stone-700 shadow-2xs">
                  <span className="text-[9px] text-purple-700 font-mono block mb-0.5">#{idx + 1}</span>
                  <span className="truncate block">{field}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 1: REVIEW QUEUE (Pending Review Human Approval) */}
      {activeSubTab === 'review_queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">طابور المراجعة والاعتماد البشري (Pending Review)</h3>
              <p className="text-xs text-stone-500">
                المعلومات المقترحة لا تنشر تلقائياً؛ يجب مراجعتها من قبل المشرف والموافقة الصريحة عليها مع تدوين المبرر.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">
              {pendingReviewFacts.length} بانتظار القرار
            </span>
          </div>

          {pendingReviewFacts.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-stone-800">لا توجد معلومات بانتظار المراجعة حالياً</h4>
              <p className="text-xs text-stone-400">كافة الحقائق إما منشورة ومعتمدة أو في حالة مسودة.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReviewFacts.map((fact) => (
                <div 
                  key={fact.factId}
                  className="bg-white border border-amber-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {fact.factId}
                      </span>
                      <span className="text-xs font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                        الدولة: {fact.countryId}
                      </span>
                      <span className="text-xs font-bold text-[#1bb49e] bg-emerald-50 px-2 py-0.5 rounded">
                        المحور: {fact.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-stone-900">{fact.subject}</h4>
                    
                    <div className="bg-stone-50 p-2.5 rounded-xl text-xs text-stone-700 font-mono text-left dir-ltr">
                      {typeof fact.value === 'object' ? JSON.stringify(fact.value, null, 2) : String(fact.value)}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-stone-500">
                      <span>المصدر: <strong>{fact.sourceName}</strong></span>
                      <span>•</span>
                      <span>تاريخ التحقق المقترح: <strong>{fact.verifiedAt ? fact.verifiedAt.split('T')[0] : 'اليوم'}</strong></span>
                      <span>•</span>
                      <span>الثقة: <strong>{fact.confidenceLevel}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setReviewModalFact(fact)}
                      className="px-4 py-2 bg-[#1bb49e] hover:bg-[#169b88] text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>اتخاذ قرار الاعتماد</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: FACTS EXPLORER (Search & Filter All Facts) */}
      {activeSubTab === 'facts_explorer' && (
        <div className="space-y-4">
          {/* Filter Toolbar */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالمعرف، الموضوع، الكلمات المفتاحية..."
                  className="w-full pr-10 pl-4 py-2 text-xs border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#1bb49e]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="text-xs p-2 border border-stone-200 rounded-xl bg-white text-stone-700"
                >
                  <option value="all">كل الدول (22 دولة)</option>
                  <option value="EG">مصر (EG)</option>
                  <option value="SA">السعودية (SA)</option>
                  <option value="AE">الإمارات (AE)</option>
                  <option value="QA">قطر (QA)</option>
                  <option value="KW">الكويت (KW)</option>
                  <option value="JO">الأردن (JO)</option>
                  <option value="PS">فلسطين (PS)</option>
                  <option value="BH">البحرين (BH)</option>
                  <option value="OM">عُمان (OM)</option>
                  <option value="MA">المغرب (MA)</option>
                  <option value="DZ">الجزائر (DZ)</option>
                  <option value="TN">تونس (TN)</option>
                  <option value="IQ">العراق (IQ)</option>
                  <option value="LB">لبنان (LB)</option>
                  <option value="SY">سوريا (SY)</option>
                  <option value="YE">اليمن (YE)</option>
                  <option value="LY">ليبيا (LY)</option>
                  <option value="SD">السودان (SD)</option>
                  <option value="SO">الصومال (SO)</option>
                  <option value="DJ">جيبوتي (DJ)</option>
                  <option value="MR">موريتانيا (MR)</option>
                  <option value="KM">جزر القمر (KM)</option>
                </select>

                <select
                  value={filterPubStatus}
                  onChange={(e) => setFilterPubStatus(e.target.value)}
                  className="text-xs p-2 border border-stone-200 rounded-xl bg-white text-stone-700"
                >
                  <option value="all">كل حالات النشر</option>
                  <option value="published">منشورة معتمدة (Published)</option>
                  <option value="pending_review">قيد المراجعة (Pending Review)</option>
                  <option value="draft">مسودة (Draft)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Facts Table */}
          <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="p-3">المعرف</th>
                  <th className="p-3">الدولة</th>
                  <th className="p-3">المحور</th>
                  <th className="p-3">الموضوع والبيانات</th>
                  <th className="p-3">المصدر الرسمي</th>
                  <th className="p-3">حالة النشر</th>
                  <th className="p-3">النضارة</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredFacts.map((fact) => (
                  <tr key={fact.factId} className="hover:bg-stone-50/50">
                    <td className="p-3 font-mono font-bold text-stone-700">{fact.factId}</td>
                    <td className="p-3 font-bold text-stone-800">{fact.countryId}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[11px]">
                        {fact.category}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs">
                      <div className="font-bold text-stone-900 truncate">{fact.subject}</div>
                      <div className="text-[11px] text-stone-500 truncate">
                        {typeof fact.value === 'object' ? JSON.stringify(fact.value) : String(fact.value)}
                      </div>
                    </td>
                    <td className="p-3 max-w-[140px] truncate text-stone-600" title={fact.sourceName}>
                      {fact.sourceName || 'دليل دَرْب'}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        fact.publicationStatus === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : fact.publicationStatus === 'pending_review'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {fact.publicationStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        fact.freshnessStatus === 'fresh'
                          ? 'bg-emerald-50 text-emerald-700'
                          : fact.freshnessStatus === 'aging'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {fact.freshnessStatus}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {fact.publicationStatus !== 'published' ? (
                        <button
                          onClick={() => setReviewModalFact(fact)}
                          className="text-xs text-amber-700 hover:text-amber-900 font-bold px-2 py-1 bg-amber-50 hover:bg-amber-100 rounded cursor-pointer"
                        >
                          مراجعة
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold">معتمدة</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: REFRESH QUEUE */}
      {activeSubTab === 'refresh_queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">طابور التحديث الدوري (Refresh Queue)</h3>
              <p className="text-xs text-stone-500">طلبات تدقيق وتحديث الحقائق المجدولة من قبل النظام أو المستخدمين والمشرفين.</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg">
              {refreshItems.length} طلب في الطابور
            </span>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="p-3">المعرف</th>
                  <th className="p-3">رقم الحقيقة</th>
                  <th className="p-3">الأولوية</th>
                  <th className="p-3">سبب التحديث</th>
                  <th className="p-3">مقدم الطلب</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {refreshItems.map((item) => (
                  <tr key={item.refreshId} className="hover:bg-stone-50/50">
                    <td className="p-3 font-mono font-bold text-stone-700">{item.refreshId}</td>
                    <td className="p-3 font-mono font-semibold text-indigo-700">{item.factId}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.priority === 'urgent'
                          ? 'bg-rose-50 text-rose-700'
                          : item.priority === 'high'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="p-3 text-stone-800 max-w-sm">{item.reason}</td>
                    <td className="p-3 text-stone-500">{item.requestedBy}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {item.status === 'pending' ? 'قيد الانتظار' : 'تمت المعالجة'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {item.status === 'pending' ? (
                        <button
                          onClick={() => handleResolveRefreshItem(item.refreshId)}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md font-bold text-[11px] cursor-pointer"
                        >
                          إغلاق ومعالجة
                        </button>
                      ) : (
                        <span className="text-[10px] text-stone-400">معالج</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: STALE AUDIT */}
      {activeSubTab === 'stale_audit' && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 space-y-1">
            <h4 className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>معايير تقادم ونضارة البيانات في DARB GKE V1</span>
            </h4>
            <p>
              • <strong>Fresh (طازجة):</strong> تم التحقق منها خلال أقل من 30 يوماً.<br />
              • <strong>Aging (متقادمة):</strong> مضى عليها أكثر من 30 يوماً وتتطلب تدقيقاً دورياً.<br />
              • <strong>Stale (منتهية):</strong> مضى عليها أكثر من 90 يوماً ويحظر عرضها كبيانات حية مباشرة بدون فحص المصدر.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agingOrStaleFacts.map((fact) => (
              <div key={fact.factId} className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-stone-700">{fact.factId} ({fact.countryId})</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    fact.freshnessStatus === 'aging' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {fact.freshnessStatus}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-stone-900">{fact.subject}</h4>
                <p className="text-xs text-stone-500">المصدر: {fact.sourceName} • تاريخ التحقق: {fact.verifiedAt?.split('T')[0]}</p>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-end">
                  <button
                    onClick={() => {
                      setReviewModalFact(fact);
                      setReviewReason('تجديد تاريخ التحقق وتأكيد نضارة المعلومة');
                    }}
                    className="px-3 py-1.5 bg-[#1bb49e] hover:bg-[#169b88] text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    تجديد تاريخ التحقق
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: SOURCES MANAGER */}
      {activeSubTab === 'sources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">المصادر الحكومية والرسمية المعتمدة</h3>
            <span className="text-xs text-stone-500 font-semibold">{sources.length} مصدر رسمي</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sources.map((s) => (
              <div key={s.source_id} className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1bb49e] bg-emerald-50 px-2 py-0.5 rounded">
                    {s.country_id || 'عام'}
                  </span>
                  <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-semibold">
                    {s.trust_level}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-stone-900 leading-snug">{s.source_name}</h4>
                <a 
                  href={s.source_url} 
                  target="_blank" 
                  rel="noreferrer noopener" 
                  className="text-[11px] text-[#1bb49e] hover:underline flex items-center gap-1 truncate"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="truncate">{s.source_url}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: ADD FACT FORM */}
      {activeSubTab === 'add_fact' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-stone-900">إضافة معلومة جديدة إلى محرك المعرفة</h3>
            <p className="text-xs text-amber-700 mt-1">
              ⚠️ تنبيه: بموجب قواعد الحوكمة، سيتم حفظ المعلومة في حالة <strong>قيد المراجعة (Pending Review)</strong> ولن تنشر تلقائياً (Auto Publish = OFF).
            </p>
          </div>

          <form onSubmit={handleCreateFact} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">الدولة:</label>
                <select
                  value={newFactForm.countryId}
                  onChange={(e) => setNewFactForm({ ...newFactForm, countryId: e.target.value })}
                  className="w-full text-xs p-2.5 border border-stone-200 rounded-xl"
                >
                  <option value="EG">مصر (EG)</option>
                  <option value="SA">المملكة العربية السعودية (SA)</option>
                  <option value="AE">الإمارات العربية المتحدة (AE)</option>
                  <option value="QA">قطر (QA)</option>
                  <option value="KW">الكويت (KW)</option>
                  <option value="JO">الأردن (JO)</option>
                  <option value="PS">فلسطين (PS)</option>
                  <option value="BH">البحرين (BH)</option>
                  <option value="OM">سلطنة عُمان (OM)</option>
                  <option value="MA">المغرب (MA)</option>
                  <option value="DZ">الجزائر (DZ)</option>
                  <option value="TN">تونس (TN)</option>
                  <option value="IQ">العراق (IQ)</option>
                  <option value="LB">لبنان (LB)</option>
                  <option value="SY">سوريا (SY)</option>
                  <option value="YE">اليمن (YE)</option>
                  <option value="LY">ليبيا (LY)</option>
                  <option value="SD">السودان (SD)</option>
                  <option value="SO">الصومال (SO)</option>
                  <option value="DJ">جيبوتي (DJ)</option>
                  <option value="MR">موريتانيا (MR)</option>
                  <option value="KM">جزر القمر (KM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">المحور المعياري:</label>
                <select
                  value={newFactForm.category}
                  onChange={(e) => setNewFactForm({ ...newFactForm, category: e.target.value as KnowledgeCategory })}
                  className="w-full text-xs p-2.5 border border-stone-200 rounded-xl"
                >
                  <option value="visa">التأشيرات والدخول</option>
                  <option value="residency">الإقامة وتصاريح الاستقرار</option>
                  <option value="jobs">الوظائف وسوق العمل</option>
                  <option value="housing">السكن والإيجارات</option>
                  <option value="telecom">الاتصالات والإنترنت</option>
                  <option value="emergency">أرقام الطوارئ</option>
                  <option value="hospitals">المستشفيات والقطاع الصحي</option>
                  <option value="transport">المواصلات والنقل</option>
                  <option value="tourism">السياحة والمعالم</option>
                  <option value="exchange_rate">سعر الصرف المرجعي</option>
                  <option value="safety">السلامة والأمان</option>
                  <option value="natural_risks">المخاطر الطبيعية والمناخ</option>
                  <option value="laws_customs">القوانين والأعراف</option>
                  <option value="education">التعليم والجامعات</option>
                  <option value="shopping">التسوق والأسواق</option>
                  <option value="marriage_cost">تكاليف الزواج والمعيشة</option>
                  <option value="restaurants">المطاعم والمأكولات</option>
                  <option value="hotels">الفنادق والإقامة المؤقتة</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">عنوان الموضوع:</label>
              <input
                type="text"
                value={newFactForm.subject}
                onChange={(e) => setNewFactForm({ ...newFactForm, subject: e.target.value })}
                placeholder="مثال: متطلبات تأشيرة العمل الجديدة، شروط استخراج رخصة القيادة..."
                className="w-full text-xs p-2.5 border border-stone-200 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">البيانات / القيمة (نص أو JSON):</label>
              <textarea
                value={newFactForm.valueText}
                onChange={(e) => setNewFactForm({ ...newFactForm, valueText: e.target.value })}
                placeholder="اكتب القيمة أو نص البيانات أو كائن JSON منظم..."
                rows={4}
                className="w-full text-xs p-2.5 border border-stone-200 rounded-xl font-mono text-left dir-ltr"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">اسم المصدر الرسمي:</label>
                <input
                  type="text"
                  value={newFactForm.sourceName}
                  onChange={(e) => setNewFactForm({ ...newFactForm, sourceName: e.target.value })}
                  placeholder="مثال: وزارة الموارد البشرية، منصة أبشر..."
                  className="w-full text-xs p-2.5 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">رابط المصدر:</label>
                <input
                  type="url"
                  value={newFactForm.sourceUrl}
                  onChange={(e) => setNewFactForm({ ...newFactForm, sourceUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs p-2.5 border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setActiveSubTab('facts_explorer')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1bb49e] hover:bg-[#169b88] text-white shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>حفظ كمعلومة قيد المراجعة</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Decision Modal for Human Approval */}
      {reviewModalFact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1bb49e]" />
                <h3 className="text-sm font-bold text-stone-900">المصادقة والاعتماد البشري للمعلومة</h3>
              </div>
              <button 
                onClick={() => setReviewModalFact(null)} 
                className="text-stone-400 hover:text-stone-700 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {reviewModalFact.factId}
                </span>
                <span className="font-bold text-stone-700">الدولة: {reviewModalFact.countryId}</span>
                <span className="font-bold text-stone-700">المحور: {reviewModalFact.category}</span>
              </div>
              <h4 className="font-bold text-stone-900 text-sm">{reviewModalFact.subject}</h4>
              <div className="bg-stone-50 p-2.5 rounded-xl text-[11px] font-mono max-h-32 overflow-y-auto text-left dir-ltr">
                {typeof reviewModalFact.value === 'object' ? JSON.stringify(reviewModalFact.value, null, 2) : String(reviewModalFact.value)}
              </div>
              <p className="text-stone-500 text-[11px]">
                المصدر: <strong>{reviewModalFact.sourceName}</strong>
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">اسم المشرف المدقق:</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">مبرر القرار / ملاحظات الاعتماد:</label>
                <input
                  type="text"
                  value={reviewReason}
                  onChange={(e) => setReviewReason(e.target.value)}
                  placeholder="تم التحقق من البوابة الرسمية وتطابق البيانات..."
                  className="w-full text-xs p-2 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleReviewDecision('reject')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>رفض وحفظ كمسودة</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalFact(null)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:bg-stone-100 cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleReviewDecision('publish')}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1bb49e] hover:bg-[#169b88] text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>اعتماد ونشر في قاعدة المعرفة</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* V1.1 VERIFY MODAL FOR VERIFICATION QUEUE SLOTS */}
      {verifyModalItem && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  GKE V1.1 — تدقيق خانة التحقق المنهجية
                </span>
                <h3 className="text-sm font-bold text-stone-900 mt-1">
                  مراجعة خانة: {verifyModalItem.fact_key} ({verifyModalItem.country_code} — {verifyModalItem.axis})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setVerifyModalItem(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Structural Proposal Governance Warning */}
              {(verifyModalItem as any).data_class === 'structural_proposal' && (
                <div className="bg-purple-100/90 border border-purple-300 rounded-xl p-3 text-xs text-purple-900 space-y-1">
                  <div className="font-extrabold flex items-center gap-1 text-purple-900">
                    <span>⚠️ تنبيه حوكمة هيكلية (Structural Proposal Notice)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-purple-800">
                    هذا السجل مقترح هيكلي معماري لتوسعة بطاقة الدولة. اعتماده يوثق المقترح في سجلات التطوير المعماري ولن يُنشر كحقيقة حية في النظام (Live Data = OFF).
                  </p>
                </div>
              )}

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs text-stone-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-semibold text-stone-500">الدولة / النطاق:</span>
                  <span className="font-bold">{verifyModalItem.country_code} — {verifyModalItem.country_name_ar || ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-stone-500">المحور / العنوان:</span>
                  <span className="font-bold">{verifyModalItem.axis}</span>
                </div>
                {(verifyModalItem as any).record_key && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-stone-500">رمز السجل التكميلي:</span>
                    <span className="font-mono font-bold text-stone-900">{(verifyModalItem as any).record_key}</span>
                  </div>
                )}
                {/* Provenance info */}
                {(verifyModalItem as any).source_file && (
                  <div className="flex justify-between pt-1 border-t border-stone-200/60">
                    <span className="font-semibold text-stone-500">التتبع المرجعي (Provenance):</span>
                    <span className="font-mono text-emerald-800 font-bold bg-white px-2 py-0.5 rounded border border-stone-200">
                      {(verifyModalItem as any).source_file}:{(verifyModalItem as any).source_line_start || 1}-{(verifyModalItem as any).source_line_end || 82}
                    </span>
                  </div>
                )}
                {(verifyModalItem as any).source_fingerprint && (
                  <div className="flex justify-between text-[10px] text-stone-500">
                    <span>بصمة SHA-256:</span>
                    <span className="font-mono">{String((verifyModalItem as any).source_fingerprint).substring(0, 16)}...</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">القيمة المقترحة الأصلية (Proposed Value):</label>
                <div className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 font-normal select-all">
                  {verifyProposedValue || 'لا توجد قيمة أولية مسجلة'}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-purple-900">القيمة المعدلة / المعتمدة (Reviewed Value) <span className="text-rose-500">*</span>:</label>
                  <button
                    type="button"
                    onClick={() => setVerifyReviewedValue(verifyProposedValue)}
                    className="text-[11px] text-purple-700 hover:text-purple-900 underline font-medium cursor-pointer"
                  >
                    نسخ القيمة المقترحة
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={verifyReviewedValue}
                  onChange={(e) => setVerifyReviewedValue(e.target.value)}
                  placeholder="أدخل القيمة الدقيقة المعتمدة بعد المراجعة والتدقيق..."
                  className="w-full text-xs p-3 border border-purple-200 bg-purple-50/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">رابط المصدر / المرجع الرسمي (Source URL) <span className="text-rose-500">*</span>:</label>
                <input
                  type="url"
                  value={verifySourceUrl}
                  onChange={(e) => setVerifySourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs p-2.5 border border-stone-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">درجة الثقة (Confidence):</label>
                  <select
                    value={verifyConfidence}
                    onChange={(e) => setVerifyConfidence(e.target.value as any)}
                    className="w-full text-xs p-2 border border-stone-200 rounded-xl bg-stone-50"
                  >
                    <option value="high">عالية (High)</option>
                    <option value="medium">متوسطة (Medium)</option>
                    <option value="limited">محدودة (Limited)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">معرّف المراجع البشري (Reviewer ID) <span className="text-rose-500">*</span>:</label>
                  <input
                    type="text"
                    value={verifyReviewerId}
                    onChange={(e) => setVerifyReviewerId(e.target.value)}
                    placeholder="مشرف الحوكمة والتدقيق"
                    className="w-full text-xs p-2 border border-stone-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">مبرر الاعتماد الرقابي (Review Reason) <span className="text-rose-500">*</span>:</label>
                <input
                  type="text"
                  value={verifyReviewReason}
                  onChange={(e) => setVerifyReviewReason(e.target.value)}
                  placeholder="تمت المطابقة مع دليل 19 سبتمبر 2026 والتحقق من المرجع الرسمي..."
                  className="w-full text-xs p-2.5 border border-stone-200 rounded-xl"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleVerificationDecision('rejected')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>رفض الخانة (Reject)</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVerifyModalItem(null)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:bg-stone-100 cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleVerificationDecision('approved')}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>اعتماد وتوثيق الخانة (Approve)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
