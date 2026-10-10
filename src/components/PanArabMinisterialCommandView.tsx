import React, { useState, useEffect } from 'react';
import {
  Landmark,
  ShieldCheck,
  FileText,
  Building2,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Printer,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Stamp,
  Award,
  Download,
  Search,
  Scale,
  ArrowRightLeft,
  FileCheck2,
  Globe2,
  Lock,
  RefreshCw,
  Zap
} from 'lucide-react';
import {
  PanArabInstitutionalEntity,
  PanArabCustomsVerificationResult,
  PanArabTreatyDraftResponse
} from '../types/country-profile';
import { fetchApi } from '../api';

interface PanArabMinisterialCommandViewProps {
  onSelectCountry?: (countryCode: string) => void;
  onConsultAI?: (prompt: string) => void;
}

export const PanArabMinisterialCommandView: React.FC<PanArabMinisterialCommandViewProps> = ({
  onSelectCountry,
  onConsultAI
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'agencies' | 'verification' | 'treaty_drafter'>('agencies');
  const [agencies, setAgencies] = useState<PanArabInstitutionalEntity[]>([]);
  const [loadingAgencies, setLoadingAgencies] = useState<boolean>(true);

  // Verification state
  const [credentialId, setCredentialId] = useState<string>('GAFTA-2026-SA-EG-9981');
  const [credentialType, setCredentialType] = useState<any>('gafta_origin');
  const [verifOrigin, setVerifOrigin] = useState<string>('SA');
  const [verifDest, setVerifDest] = useState<string>('EG');
  const [verificationResult, setVerificationResult] = useState<PanArabCustomsVerificationResult | null>(null);
  const [verifying, setVerifying] = useState<boolean>(false);

  // Treaty Drafter state
  const [treatyPartyA, setTreatyPartyA] = useState<string>('SA');
  const [treatyPartyB, setTreatyPartyB] = useState<string>('EG');
  const [treatyType, setTreatyType] = useState<any>('industrial_synergy_partnership');
  const [treatyDraft, setTreatyDraft] = useState<PanArabTreatyDraftResponse | null>(null);
  const [drafting, setDrafting] = useState<boolean>(false);

  // Load Agencies
  useEffect(() => {
    const loadAgencies = async () => {
      setLoadingAgencies(true);
      try {
        const res = await fetchApi<{ ok: boolean; data: PanArabInstitutionalEntity[] }>('/api/countries/analytics/ministerial/agencies');
        if (res?.data) {
          setAgencies(res.data);
        }
      } catch (err) {
        console.error('Failed to load agencies', err);
      } finally {
        setLoadingAgencies(false);
      }
    };
    loadAgencies();
  }, []);

  // Handle Verify
  const handleVerifyCredential = async () => {
    setVerifying(true);
    try {
      const res = await fetchApi<{ ok: boolean; data: PanArabCustomsVerificationResult }>('/api/countries/analytics/ministerial/verify-credential', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential_id: credentialId,
          credential_type: credentialType,
          origin_country: verifOrigin,
          destination_country: verifDest
        })
      });
      if (res?.data) {
        setVerificationResult(res.data);
      }
    } catch (err) {
      console.error('Failed to verify credential', err);
    } finally {
      setVerifying(false);
    }
  };

  // Run initial verification once
  useEffect(() => {
    handleVerifyCredential();
  }, []);

  // Handle Treaty Draft
  const handleGenerateTreaty = async () => {
    setDrafting(true);
    try {
      const res = await fetchApi<{ ok: boolean; data: PanArabTreatyDraftResponse }>('/api/countries/analytics/ministerial/treaty-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          party_a_country: treatyPartyA,
          party_b_country: treatyPartyB,
          treaty_type: treatyType
        })
      });
      if (res?.data) {
        setTreatyDraft(res.data);
      }
    } catch (err) {
      console.error('Failed to draft treaty', err);
    } finally {
      setDrafting(false);
    }
  };

  // Run initial treaty draft once
  useEffect(() => {
    handleGenerateTreaty();
  }, []);

  const arabCountriesList = [
    { code: 'SA', name: 'المملكة العربية السعودية', flag: '🇸🇦' },
    { code: 'EG', name: 'جمهورية مصر العربية', flag: '🇪🇬' },
    { code: 'AE', name: 'الإمارات العربية المتحدة', flag: '🇦🇪' },
    { code: 'MA', name: 'المملكة المغربية', flag: '🇲🇦' },
    { code: 'JO', name: 'المملكة الأردنية الهاشمية', flag: '🇯🇴' },
    { code: 'QA', name: 'دولة قطر', flag: '🇶🇦' },
    { code: 'KW', name: 'دولة الكويت', flag: '🇰🇼' },
    { code: 'OM', name: 'سلطنة عُمان', flag: '🇴🇲' },
    { code: 'BH', name: 'مملكة البحرين', flag: '🇧🇭' },
    { code: 'DZ', name: 'الجمهورية الجزائرية', flag: '🇩🇿' },
    { code: 'IQ', name: 'جمهورية العراق', flag: '🇮🇶' },
    { code: 'TN', name: 'الجمهورية التونسية', flag: '🇹🇳' }
  ];

  return (
    <div id="pan-arab-ministerial-command-view" className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1e30] via-[#102d4a] to-[#0a1827] border border-amber-500/30 p-6 md:p-8 text-white shadow-2xl">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
              <Landmark className="w-3.5 h-3.5" />
              <span>المرحلة الثانية عشرة: الحقيبة الوزارية والمؤسسية للدول والجامعة العربية</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
              <span>البوابة السيادية للوفود وهيئات الاستثمار والمنافذ</span>
              <Stamp className="w-6 h-6 text-amber-400" />
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              منصة العمليات المشتركة للهيئات السيادية: دليل الوزارات وهيئات الاستثمار، بوابة المصادقة الجمركية الرقمية عبر المنافذ (Digital Customs Seal)، ومولّد المعاهدات والاتفاقيات الاقتصادية الثنائية الذكي.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-2 border border-white/10 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة الملف الوزاري</span>
            </button>

            <button
              onClick={() => onConsultAI?.('قدم لي مسودة مذكرة إحاطة وزارية مشتركة لمؤتمر وزراء الاقتصاد والاستثمار العرب بشأن تعزيز سلاسل التوريد وتوحيد المعايير')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#1bb49e] text-[#071a2b] font-black text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>إحاطة وزارية بالذكاء الاصطناعي</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="mt-8 flex items-center gap-2 border-b border-white/10 pb-1 overflow-x-auto scrollbar-none">
          <button
            id="min-tab-agencies"
            onClick={() => setActiveSubTab('agencies')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'agencies'
                ? 'bg-amber-500 text-[#071a2b] shadow-md font-black'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>دليل الهيئات والوزارات الاستثمارية ({agencies.length})</span>
          </button>

          <button
            id="min-tab-verification"
            onClick={() => setActiveSubTab('verification')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'verification'
                ? 'bg-amber-500 text-[#071a2b] shadow-md font-black'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>بوابة المصادقة الجمركية وتدقيق الأختام</span>
          </button>

          <button
            id="min-tab-treaty-drafter"
            onClick={() => setActiveSubTab('treaty_drafter')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'treaty_drafter'
                ? 'bg-amber-500 text-[#071a2b] shadow-md font-black'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>محرر المعاهدات والاتفاقيات الثنائية الذكي</span>
          </button>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* 1. SOVEREIGN AGENCIES & MINISTRIES DIRECTORY                           */}
      {/* ====================================================================== */}
      {activeSubTab === 'agencies' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agencies.map((agency) => (
              <div
                key={agency.agency_id}
                id={`agency-card-${agency.agency_id}`}
                className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        onClick={() => onSelectCountry?.(agency.country_code)}
                        className="text-2xl cursor-pointer hover:scale-110 transition-transform"
                        title={agency.country_name_ar}
                      >
                        {agency.flag}
                      </span>
                      <div>
                        <h4 className="text-sm font-extrabold text-stone-900 dark:text-white">
                          {agency.agency_name_ar}
                        </h4>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                          {agency.agency_type}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-bold text-stone-600 dark:text-stone-300 whitespace-nowrap">
                      {agency.bilateral_agreements_count} معاهدة نافذة
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {agency.jurisdiction_scope_ar}
                  </p>

                  {/* Fast-track services */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-100 dark:border-stone-800">
                    <span className="text-[11px] font-extrabold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>خدمات المسار السريع للمستثمرين والشركات:</span>
                    </span>
                    <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-400">
                      {agency.fast_track_services_ar.map((srv, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{srv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key incentives */}
                  <div className="text-[11px] text-stone-500 space-y-0.5">
                    <strong className="text-stone-700 dark:text-stone-300 block">حزمة الحوافز السيادية:</strong>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      {agency.key_incentives_summary_ar}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 font-medium">
                    {agency.focal_point_office_ar}
                  </span>
                  <button
                    onClick={() => onConsultAI?.(`قدم دليلاً شاملاً لكيفية التقدم للحصول على حوافز وتراخيص الاستثمار الفورية من: ${agency.agency_name_ar}`)}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>طلب استشارة تأسيس</span>
                    <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 2. CROSS-BORDER CUSTOMS & CREDENTIAL VERIFICATION                      */}
      {/* ====================================================================== */}
      {activeSubTab === 'verification' && (
        <div className="space-y-6">
          {/* Controls Box */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-amber-500" />
              <span>نافذة التدقيق والمطابقة للمنافذ الجمركية البرية والبحرية والجوية</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-500 block mb-1">رقم الوثيقة / الشهادة / الجواز:</label>
                <input
                  type="text"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="مثال: GAFTA-2026-SA-EG-9981"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-500 block mb-1">نوع الوثيقة الجمركية:</label>
                <select
                  value={credentialType}
                  onChange={(e) => setCredentialType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs"
                >
                  <option value="gafta_origin">شهادة المنشأ العربية (GAFTA 0%)</option>
                  <option value="digital_passport">جواز سفر المستثمر الرقمي (DARB VIP)</option>
                  <option value="sez_tax_exemption">شهادة إعفاء المناطق الاقتصادية (SEZ)</option>
                  <option value="food_safety_phytosanitary">شهادة السلامة الغذائية والحجر الموحد</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-500 block mb-1">دولة الإصدار / المنشأ:</label>
                <select
                  value={verifOrigin}
                  onChange={(e) => setVerifOrigin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs"
                >
                  {arabCountriesList.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-500 block mb-1">دولة المقصد / المنفذ المستلم:</label>
                <select
                  value={verifDest}
                  onChange={(e) => setVerifDest(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs"
                >
                  {arabCountriesList.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={handleVerifyCredential}
                disabled={verifying}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#1bb49e] text-[#071a2b] font-black text-xs hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <ShieldCheck className={`w-4 h-4 ${verifying ? 'animate-spin' : ''}`} />
                <span>تدقيق الوثيقة والمطابقة الفورية</span>
              </button>
            </div>
          </div>

          {/* Verification Result Card */}
          {verificationResult && (
            <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${
                        verificationResult.is_valid
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{verificationResult.status_ar}</span>
                    </span>

                    <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300 text-xs font-extrabold border border-cyan-200">
                      {verificationResult.border_clearance_lane}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-stone-900 dark:text-white">
                    {verificationResult.credential_type_ar}
                  </h4>
                  <span className="text-xs text-stone-400 font-mono">
                    ID: {verificationResult.credential_id}
                  </span>
                </div>

                <div className="text-left font-mono text-xs text-stone-400">
                  <span className="block font-bold text-stone-700 dark:text-stone-300">الختم الرقمي المشفر (Digital Seal):</span>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono bg-stone-50 dark:bg-stone-950/60 px-2 py-1 rounded border border-stone-200 dark:border-stone-800 inline-block mt-0.5">
                    {verificationResult.digital_seal_hash}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-100 dark:border-stone-800 text-xs">
                <div>
                  <span className="text-stone-400 block mb-0.5">جهة الإصدار والمصادقة:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{verificationResult.issuing_authority_ar}</span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5">مسار الشحنة / العبور:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    من: {verificationResult.origin_country_ar} ⬅️ إلى: {verificationResult.destination_country_ar}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5">نسبة الإعفاء الجمركي المعتمدة:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {verificationResult.exemption_rate_pct}% إعفاء تام (تعرفة صفرية)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-extrabold text-stone-900 dark:text-white block">
                  الامتيازات والصلاحيات الممنوحة آلياً عند المنفذ:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {verificationResult.verified_privileges_ar.map((priv, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 font-medium flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{priv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة بطاقة الفسح الجمركي المعتمدة</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================== */}
      {/* 3. BILATERAL ECONOMIC TREATY & MOU DRAFTER                             */}
      {/* ====================================================================== */}
      {activeSubTab === 'treaty_drafter' && (
        <div className="space-y-6">
          {/* Controls Box */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-500" />
              <span>توليد وصياغة المعاهدات ومذكرات التفاهم الثنائية الرسمية</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-500 block mb-1">الطرف الأول (الحكومة أ):</label>
                <select
                  value={treatyPartyA}
                  onChange={(e) => setTreatyPartyA(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-bold"
                >
                  {arabCountriesList.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-500 block mb-1">الطرف الثاني (الحكومة ب):</label>
                <select
                  value={treatyPartyB}
                  onChange={(e) => setTreatyPartyB(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs font-bold"
                >
                  {arabCountriesList.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-500 block mb-1">نوع المعاهدة أو الاتفاقية:</label>
                <select
                  value={treatyType}
                  onChange={(e) => setTreatyType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs"
                >
                  <option value="industrial_synergy_partnership">اتفاقية شراكة صناعية وتكامل إنتاجي</option>
                  <option value="bilateral_investment_protection">معاهدة حماية وتشجيع الاستثمار المتبادل (BIT)</option>
                  <option value="double_taxation_avoidance">اتفاقية تجنب الازدواج الضريبي (DTAA)</option>
                  <option value="joint_food_security_compact">ميثاق أمن غذائي وصوامع تخزين إقليمية</option>
                  <option value="green_hydrogen_energy_treaty">معاهدة الربط الكهربائي والهيدروجين الأخضر</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={handleGenerateTreaty}
                disabled={drafting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#1bb49e] text-[#071a2b] font-black text-xs hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <FileCheck2 className={`w-4 h-4 ${drafting ? 'animate-spin' : ''}`} />
                <span>صياغة مسودة المعاهدة القانونية</span>
              </button>
            </div>
          </div>

          {/* Treaty Output Document */}
          {treatyDraft && (
            <div className="rounded-2xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 p-6 md:p-8 shadow-xl space-y-6">
              {/* Official Header */}
              <div className="text-center space-y-2 border-b-2 border-stone-200 dark:border-stone-700 pb-6">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 mb-1">
                  <Landmark className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-stone-400 block tracking-widest font-mono">
                  {treatyDraft.treaty_id}
                </span>
                <h3 className="text-lg md:text-xl font-black text-stone-900 dark:text-white max-w-3xl mx-auto leading-relaxed">
                  {treatyDraft.treaty_title_ar}
                </h3>
                <div className="flex items-center justify-center gap-3 text-xs font-extrabold text-stone-600 dark:text-stone-300">
                  <span>{treatyDraft.party_a_name_ar}</span>
                  <span className="text-amber-500 font-bold">🤝</span>
                  <span>{treatyDraft.party_b_name_ar}</span>
                </div>
              </div>

              {/* Legal Preamble */}
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
                <strong className="block font-bold text-stone-900 dark:text-white mb-1">الديباجة القانونية:</strong>
                {treatyDraft.legal_preamble_ar}
              </div>

              {/* Numbered Articles */}
              <div className="space-y-4">
                {treatyDraft.articles.map((art) => (
                  <div
                    key={art.article_number}
                    className="p-4 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1.5"
                  >
                    <h5 className="text-xs font-black text-amber-600 dark:text-amber-400">
                      {art.title_ar}
                    </h5>
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                      {art.content_ar}
                    </p>
                  </div>
                ))}
              </div>

              {/* Execution & Seal Block */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-right">
                  <span className="text-[11px] text-stone-500 block">مركز التحكيم وفض المنازعات المعتمد:</span>
                  <span className="text-xs font-bold text-stone-900 dark:text-white">{treatyDraft.arbitration_forum_ar}</span>
                  <span className="text-[10px] text-stone-400 block">حررت في: {treatyDraft.execution_date_ar}</span>
                </div>

                <div className="text-center p-3 rounded-lg bg-white dark:bg-stone-800 border border-amber-500/40 shadow-sm">
                  <Stamp className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 block">
                    {treatyDraft.official_seal_text_ar}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between flex-wrap gap-2">
                <button
                  onClick={() => onConsultAI?.(`قدم مراجعة قانونية ودبلوماسية مفصلة لنصوص وبنود هذه المعاهدة: ${treatyDraft.treaty_title_ar}`)}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تدقيق قانوني بالذكاء الاصطناعي</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#1bb49e] text-[#071a2b] font-black text-xs hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة وتصدير المعاهدة كـ PDF رسمي</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
