import React, { useState, useEffect } from 'react';
import {
  Award,
  QrCode,
  ShieldCheck,
  Building2,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  Sparkles,
  Send,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Sliders,
  DollarSign,
  TrendingUp,
  FileText
} from 'lucide-react';
import {
  PanArabDigitalPassport,
  PanArabMatchmakerListing,
  PanArabStrategyCopilotResponse
} from '../types/country-profile';
import { fetchApi } from '../api';

interface PanArabDigitalPassportViewProps {
  onNavigateTab?: (tabId: string, subtabId?: string) => void;
  onSelectCountry?: (countryCode: string) => void;
}

export const PanArabDigitalPassportView: React.FC<PanArabDigitalPassportViewProps> = ({
  onNavigateTab,
  onSelectCountry
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'passport' | 'matchmaker' | 'copilot'>('passport');

  // Digital Passport Customizer State
  const [holderName, setHolderName] = useState<string>('د. طارق السعيد');
  const [credentialTier, setCredentialTier] = useState<'مستثمر استراتيجي سيادي' | 'رائد أعمال واقتصاد رقمي' | 'كفاءة مهنية ومهارات متقدمة' | 'تاجر ومورّد إقليمي'>('مستثمر استراتيجي سيادي');
  const [originCountry, setOriginCountry] = useState<string>('SA');
  const [targetCountries, setTargetCountries] = useState<string[]>(['EG', 'AE', 'JO', 'MA']);
  const [passportData, setPassportData] = useState<PanArabDigitalPassport | null>(null);
  const [loadingPassport, setLoadingPassport] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // B2B Matchmaker State
  const [listings, setListings] = useState<PanArabMatchmakerListing[]>([]);
  const [matchSector, setMatchSector] = useState<string>('الرعاية الصحية');
  const [matchCountry, setMatchCountry] = useState<string>('SA');
  const [matchPartnershipType, setMatchPartnershipType] = useState<string>('توريد وتوزيع إقليمي');
  const [matchBudget, setMatchBudget] = useState<number>(10000000);
  const [matchedResults, setMatchedResults] = useState<(PanArabMatchmakerListing & { match_score_pct?: number; synergy_summary_ar?: string })[]>([]);
  const [matching, setMatching] = useState<boolean>(false);
  const [loadingListings, setLoadingListings] = useState<boolean>(true);
  const [selectedListingModal, setSelectedListingModal] = useState<PanArabMatchmakerListing | null>(null);

  // Strategy Co-Pilot State
  const [queryInput, setQueryInput] = useState<string>('');
  const [copilotResponse, setCopilotResponse] = useState<PanArabStrategyCopilotResponse | null>(null);
  const [askingCopilot, setAskingCopilot] = useState<boolean>(false);

  const QUICK_PROMPTS = [
    {
      title: 'كيف أحصل على إعفاء جمركي كامل (GAFTA) لشحنة صناعية؟',
      query: 'كيف أحصل على إعفاء جمركي 0% بموجب اتفاقية جافتا وما هي حسابات القيمة المضافة؟'
    },
    {
      title: 'مقارنة تأسيس مقر إقليمي (RHQ) بالسعودية مقابل دبي',
      query: 'ما هي الفروق الضريبية والتنظيمية بين تأسيس مقر إقليمي في الرياض والمناطق الحرة في الإمارات؟'
    },
    {
      title: 'أفضل قنوات التحويل المالي المباشر للمغتربين',
      query: 'ما هي أسرع وأقل قنوات التحويل المالي رسوماً بين دول الخليج ومصر والأردن والمغرب؟'
    },
    {
      title: 'تأسيس شراكة تصنيع وتوريد دوائي أو زراعي بين الدول العربية',
      query: 'ما هي حوافز الشراكة الصناعية التكاملية في قطاعي الأدوية والزراعة المتقدمة؟'
    }
  ];

  // Fetch initial Passport template
  const loadPassport = async () => {
    setLoadingPassport(true);
    try {
      const targetsStr = targetCountries.join(',');
      const res = await fetchApi<{ ok: boolean; data: PanArabDigitalPassport }>(
        `/api/countries/analytics/digital-passport/template?tier=${encodeURIComponent(credentialTier)}&name=${encodeURIComponent(holderName)}&origin=${originCountry}&targets=${targetsStr}`
      );
      if (res?.data) {
        setPassportData(res.data);
      }
    } catch (e) {
      console.error('Failed to load digital passport template', e);
    } finally {
      setLoadingPassport(false);
    }
  };

  // Fetch B2B Matchmaker Directory
  const loadListings = async () => {
    setLoadingListings(true);
    try {
      const res = await fetchApi<{ ok: boolean; data: PanArabMatchmakerListing[] }>('/api/countries/analytics/b2b-matchmaker/listings');
      if (res?.data) {
        setListings(res.data);
        setMatchedResults(res.data);
      }
    } catch (e) {
      console.error('Failed to load matchmaker listings', e);
    } finally {
      setLoadingListings(false);
    }
  };

  useEffect(() => {
    loadPassport();
    loadListings();
  }, []);

  const handleUpdatePassport = () => {
    loadPassport();
  };

  const handleRunMatch = async () => {
    setMatching(true);
    try {
      const res = await fetchApi<{ ok: boolean; data: any[] }>('/api/countries/analytics/b2b-matchmaker/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant_sector: matchSector,
          applicant_country: matchCountry,
          desired_partnership_type: matchPartnershipType,
          investment_budget_usd: matchBudget
        })
      });
      if (res?.data) {
        setMatchedResults(res.data);
      }
    } catch (e) {
      console.error('Failed to compute matches', e);
    } finally {
      setMatching(false);
    }
  };

  const handleAskCopilot = async (text: string) => {
    const q = text || queryInput;
    if (!q.trim()) return;
    setAskingCopilot(true);
    try {
      const res = await fetchApi<{ ok: boolean; data: PanArabStrategyCopilotResponse }>('/api/countries/analytics/strategy-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_query: q,
          context_country: originCountry,
          user_role: 'investor'
        })
      });
      if (res?.data) {
        setCopilotResponse(res.data);
      }
    } catch (e) {
      console.error('Failed to ask strategy copilot', e);
    } finally {
      setAskingCopilot(false);
    }
  };

  const handleCopyPassportLink = () => {
    if (!passportData) return;
    const url = `${window.location.origin}/?tab=pan_arab_intel&subtab=passport&id=${passportData.passport_id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  const toggleTargetCountry = (code: string) => {
    if (targetCountries.includes(code)) {
      if (targetCountries.length > 1) {
        setTargetCountries(targetCountries.filter(c => c !== code));
      }
    } else {
      setTargetCountries([...targetCountries, code]);
    }
  };

  return (
    <div id="pan-arab-digital-passport-view" className="space-y-6">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#061526] via-[#0b243d] to-[#081b2e] border border-[#1bb49e]/30 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#1bb49e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1bb49e]/20 border border-[#1bb49e]/40 text-[#1bb49e] text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>المرحلة التاسعة: بطاقة المستثمر والمغترب الرقمية والمطابقة البينية B2B</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              جواز سفر دَرْب الرقمي الموحد والمطابقة الذكية ومستشار القرار
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              الهوية الرقمية الاستثمارية العربية الموحدة ذات الامتيازات المعفاة جمركياً وضريبياً، محرك التوفيق والمطابقة بين الشركات العربية الباحثة عن شركاء، والمستشار الاستراتيجي الذكي لقرارات التوسع الإقليمي.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveSubTab('copilot')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1bb49e] to-[#159482] text-[#071a2b] font-extrabold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>تشغيل مستشار القرار الذكي</span>
            </button>
          </div>
        </div>

        {/* Phase 9 Sub-Tabs */}
        <div className="mt-8 flex items-center gap-2 border-b border-white/10 pb-1 overflow-x-auto scrollbar-none">
          <button
            id="subtab-passport"
            onClick={() => setActiveSubTab('passport')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'passport'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-md'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>جواز سفر المستثمر والمغترب الرقمي</span>
          </button>

          <button
            id="subtab-matchmaker"
            onClick={() => setActiveSubTab('matchmaker')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'matchmaker'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-md'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>محرك المطابقة الاستثمارية البينية B2B ({listings.length})</span>
          </button>

          <button
            id="subtab-copilot"
            onClick={() => setActiveSubTab('copilot')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'copilot'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-md'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>المستشار الاستراتيجي المباشر (DARB Co-Pilot)</span>
          </button>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* 1. DIGITAL PASSPORT CREDENTIAL & VERIFICATION SUITE */}
      {/* ====================================================================== */}
      {activeSubTab === 'passport' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Customizer Controls (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="font-extrabold text-stone-900 dark:text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#1bb49e]" />
                <span>تخصيص بيانات وتصنيف الجواز الرقمي</span>
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-500 font-bold mb-1">اسم حامل الوثيقة / المؤسسة</label>
                <input
                  type="text"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-stone-500 font-bold mb-1">فئة الاعتماد والامتيازات</label>
                <select
                  value={credentialTier}
                  onChange={(e: any) => setCredentialTier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-bold"
                >
                  <option value="مستثمر استراتيجي سيادي">مستثمر استراتيجي سيادي (Sovereign Tier)</option>
                  <option value="رائد أعمال واقتصاد رقمي">رائد أعمال واقتصاد رقمي (Tech / Founder Tier)</option>
                  <option value="كفاءة مهنية ومهارات متقدمة">كفاءة مهنية ومهارات متقدمة (Expat Pro Tier)</option>
                  <option value="تاجر ومورّد إقليمي">تاجر ومورّد إقليمي (Pan-Arab Trader Tier)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-500 font-bold mb-1">بلد التأسيس أو الجنسية الأساسية</label>
                <select
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-bold"
                >
                  <option value="SA">🇸🇦 المملكة العربية السعودية</option>
                  <option value="AE">🇦🇪 الإمارات العربية المتحدة</option>
                  <option value="EG">🇪🇬 جمهورية مصر العربية</option>
                  <option value="MA">🇲🇦 المملكة المغربية</option>
                  <option value="JO">🇯🇴 المملكة الأردنية الهاشمية</option>
                  <option value="OM">🇴🇲 سلطنة عُمان</option>
                  <option value="QA">🇶🇦 دولة قطر</option>
                  <option value="KW">🇰🇼 دولة الكويت</option>
                  <option value="BH">🇧🇭 مملكة البحرين</option>
                  <option value="TN">🇹🇳 الجمهورية التونسية</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-500 font-bold mb-1.5">
                  الدول المستهدفة للنشاط والامتيازات (اختر متعدد):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { code: 'EG', flag: '🇪🇬', name: 'مصر' },
                    { code: 'SA', flag: '🇸🇦', name: 'السعودية' },
                    { code: 'AE', flag: '🇦🇪', name: 'الإمارات' },
                    { code: 'JO', flag: '🇯🇴', name: 'الأردن' },
                    { code: 'MA', flag: '🇲🇦', name: 'المغرب' },
                    { code: 'OM', flag: '🇴🇲', name: 'عُمان' },
                    { code: 'QA', flag: '🇶🇦', name: 'قطر' },
                    { code: 'KW', flag: '🇰🇼', name: 'الكويت' },
                    { code: 'BH', flag: '🇧🇭', name: 'البحرين' }
                  ].map(c => {
                    const isSelected = targetCountries.includes(c.code);
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => toggleTargetCountry(c.code)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                          isSelected
                            ? 'bg-[#1bb49e]/15 border-[#1bb49e] text-[#1bb49e]'
                            : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500'
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                id="btn-update-passport"
                onClick={handleUpdatePassport}
                disabled={loadingPassport}
                className="w-full py-2.5 rounded-xl bg-[#1bb49e] text-[#071a2b] font-black text-xs hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                {loadingPassport ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري التحديث والتشفير...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>تحديث واعتماد البطاقة الرقمية</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Luxury Credential Card Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {passportData ? (
              <div className="space-y-4">
                {/* Visual Card */}
                <div
                  id="darb-credential-card-print"
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#071d32] via-[#0d2e4d] to-[#081a2b] border-2 border-[#1bb49e]/60 p-6 md:p-8 text-white shadow-2xl space-y-6"
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#1bb49e]/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black tracking-widest text-[#1bb49e]">دَرْب</span>
                        <span className="text-xs text-stone-400 font-mono">PAN-ARAB PASSPORT</span>
                      </div>
                      <h4 className="text-lg font-black text-white">{passportData.holder_name}</h4>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#1bb49e]/20 text-[#1bb49e] text-[11px] font-extrabold border border-[#1bb49e]/40">
                        {passportData.credential_tier}
                      </span>
                    </div>

                    <div className="text-left font-mono text-xs space-y-0.5">
                      <div className="text-[10px] text-stone-400">رقم الوثيقة المعتمد</div>
                      <div className="text-[#1bb49e] font-extrabold text-sm">{passportData.passport_id}</div>
                      <div className="text-[10px] text-stone-400">صالح حتى: {passportData.valid_until}</div>
                    </div>
                  </div>

                  {/* Body: QR & Key Attributes */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center relative z-10">
                    {/* QR Code Container */}
                    <div className="sm:col-span-4 p-3 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center text-stone-900 text-center">
                      <QrCode className="w-24 h-24 text-stone-900" />
                      <span className="text-[9px] font-extrabold tracking-widest text-stone-500 mt-1 uppercase">
                        VERIFIED BY DARB
                      </span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="sm:col-span-8 space-y-2.5 text-xs">
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-stone-400">الدولة الأساسية:</span>
                        <span className="font-bold text-white">{passportData.primary_citizenship}</span>
                      </div>

                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-stone-400">نطاق العمليات المستهدف:</span>
                        <span className="font-bold text-[#1bb49e]">
                          {passportData.target_operating_countries.join(' • ')}
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-stone-400">معدل الامتثال والتحقق:</span>
                        <span className="font-black text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{passportData.compliance_rating}% (معتمد وموثق)</span>
                        </span>
                      </div>

                      <div className="text-[10px] font-mono text-stone-400 truncate">
                        البصمة الرقمية: {passportData.digital_seal_hash}
                      </div>
                    </div>
                  </div>

                  {/* Privileges Included */}
                  <div className="relative z-10 space-y-2 pt-2 border-t border-white/10">
                    <div className="text-[11px] font-extrabold text-stone-300 uppercase tracking-wider">
                      الامتيازات الممنوحة المعتمدة:
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 text-xs">
                      {passportData.verified_privileges.map((priv) => (
                        <div key={priv.code} className="flex items-start gap-2 bg-white/5 p-2 rounded-lg text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1bb49e] shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-white block">{priv.title_ar}</strong>
                            <span className="text-stone-400">{priv.description_ar}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <button
                    id="btn-copy-passport-link"
                    onClick={handleCopyPassportLink}
                    className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-all cursor-pointer flex items-center gap-2 border border-stone-200 dark:border-stone-700"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>تم نسخ رابط التحقق المباشر!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ رابط التحقق المباشر</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-[#1bb49e] text-[#071a2b] text-xs font-black hover:brightness-110 transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة وتصدير البطاقة (Print / PDF)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-stone-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-[#1bb49e]" />
                <p className="text-xs">جاري إصدار البطاقة الرقمية...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 2. B2B PAN-ARAB MATCHMAKING & CORPORATE PARTNERS DIRECTORY */}
      {/* ====================================================================== */}
      {activeSubTab === 'matchmaker' && (
        <div className="space-y-6">
          {/* Smart Matchmaker Engine Filter Form */}
          <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="font-extrabold text-stone-900 dark:text-white text-sm flex items-center gap-2">
                <Search className="w-4 h-4 text-[#1bb49e]" />
                <span>محرك المطابقة والتوفيق الاستثماري والصناعي B2B</span>
              </h3>
              <span className="text-xs text-stone-500">خوارزمية ذكية لاحتساب التوافق والتكامل</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-stone-500 font-bold mb-1">قطاع عمل شركتك</label>
                <select
                  value={matchSector}
                  onChange={(e) => setMatchSector(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-bold"
                >
                  <option value="الرعاية الصحية">الصناعات الطبية والرعاية الصحية</option>
                  <option value="الزراعية">التكنولوجيا الزراعية والأمن الغذائي</option>
                  <option value="اللوجستيات">النقل واللوجستيات وسلاسل الإمداد</option>
                  <option value="المالية">التكنولوجيا المالية والاقتصاد الرقمي</option>
                  <option value="الطاقة">الطاقة النظيفة والتصنيع الأخضر</option>
                  <option value="البتروكيماويات">الصناعات البتروكيماوية والتحويلية</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-500 font-bold mb-1">دولتك الحالية</label>
                <select
                  value={matchCountry}
                  onChange={(e) => setMatchCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-bold"
                >
                  <option value="SA">🇸🇦 السعودية</option>
                  <option value="EG">🇪🇬 مصر</option>
                  <option value="AE">🇦🇪 الإمارات</option>
                  <option value="JO">🇯🇴 الأردن</option>
                  <option value="MA">🇲🇦 المغرب</option>
                  <option value="BH">🇧🇭 البحرين</option>
                  <option value="OM">🇴🇲 عُمان</option>
                  <option value="KW">🇰🇼 الكويت</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-500 font-bold mb-1">نوع الشراكة المستهدفة</label>
                <select
                  value={matchPartnershipType}
                  onChange={(e) => setMatchPartnershipType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-bold"
                >
                  <option value="توريد وتوزيع إقليمي">توريد وتوزيع إقليمي</option>
                  <option value="طلب رأس مال وشريك استثماري">طلب رأس مال وشريك استثماري</option>
                  <option value="شراكة تقنية وتوطين صناعي">شراكة تقنية وتوطين صناعي</option>
                  <option value="استحواذ واندماج مشترك">استحواذ واندماج مشترك</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-500 font-bold mb-1">حجم التمويل / الاستثمار المتوقع ($)</label>
                <input
                  type="number"
                  value={matchBudget}
                  onChange={(e) => setMatchBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                id="btn-run-matchmaker"
                onClick={handleRunMatch}
                disabled={matching}
                className="px-5 py-2.5 rounded-xl bg-[#1bb49e] text-[#071a2b] font-black text-xs hover:brightness-110 transition-all cursor-pointer flex items-center gap-2 shadow-md"
              >
                {matching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري احتساب التوافق والمطابقة...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>تشغيل المطابقة وإيجاد الشركاء المتوافقين</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {matchedResults.map((item) => (
              <div
                key={item.id}
                id={`match-card-${item.id}`}
                className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm hover:border-[#1bb49e]/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg leading-none">{item.flag}</span>
                        <span className="font-bold text-xs text-stone-500">{item.country_name_ar}</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                          {item.sector_ar}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-stone-900 dark:text-white leading-snug">
                        {item.entity_name_ar}
                      </h4>
                    </div>

                    {item.match_score_pct ? (
                      <div className="text-left shrink-0">
                        <div className="text-[10px] text-stone-400">نسبة التوافق</div>
                        <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                          {item.match_score_pct}%
                        </div>
                      </div>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-bold">
                        {item.partnership_type}
                      </span>
                    )}
                  </div>

                  {/* Value Proposition */}
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {item.value_proposition_ar}
                  </p>

                  {/* Synergy Rationale if matched */}
                  {item.synergy_summary_ar && (
                    <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50 text-xs text-emerald-900 dark:text-emerald-200 space-y-0.5">
                      <div className="font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>تحليل التوافق التكاملي:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{item.synergy_summary_ar}</p>
                    </div>
                  )}

                  {/* Looking For */}
                  <div className="space-y-1 text-xs">
                    <div className="font-extrabold text-stone-700 dark:text-stone-300">المطلوب من الشريك:</div>
                    <p className="text-stone-600 dark:text-stone-400 text-xs">{item.looking_for_ar}</p>
                  </div>

                  {/* Target Partner Countries */}
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <span className="text-stone-400 font-semibold text-[11px]">الدول المستهدفة:</span>
                    {item.target_partner_countries.map(code => (
                      <span
                        key={code}
                        onClick={() => onSelectCountry?.(code)}
                        className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-bold cursor-pointer hover:bg-[#1bb49e]/20"
                      >
                        {code}
                      </span>
                    ))}
                    {item.gafta_certified && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-black">
                        مطابق لـ GAFTA (0% جمارك)
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Ticket & Contact */}
                <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-stone-400">حجم الاستثمار / الصفقة</div>
                    <div className="text-base font-black text-stone-900 dark:text-white">
                      ${(item.ticket_size_usd / 1000000).toFixed(1)}M
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedListingModal(item)}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#1bb49e] hover:text-[#071a2b] text-stone-800 dark:text-stone-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>طلب التواصل والربط المباشر</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 3. STRATEGY CO-PILOT DIRECT DECISION ADVISORY */}
      {/* ====================================================================== */}
      {activeSubTab === 'copilot' && (
        <div className="space-y-6">
          {/* Quick Prompts Bar */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-stone-500">محاور استشارية مقترحة سريعة:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {QUICK_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQueryInput(p.query);
                    handleAskCopilot(p.query);
                  }}
                  className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-[#1bb49e] text-right transition-all cursor-pointer shadow-xs space-y-1"
                >
                  <div className="font-bold text-xs text-stone-900 dark:text-white truncate">{p.title}</div>
                  <div className="text-[10px] text-[#1bb49e] font-extrabold flex items-center gap-1">
                    <span>تشغيل التحليل الفوري</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chat Input */}
          <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 shadow-sm flex items-center gap-2">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAskCopilot(queryInput);
              }}
              placeholder="اطرح أي استفسار استثماري أو ضريبي أو لوجستي عابر للحدود العربية..."
              className="flex-1 bg-transparent border-none text-xs md:text-sm text-stone-900 dark:text-white focus:outline-none px-2"
            />
            <button
              id="btn-ask-copilot-submit"
              onClick={() => handleAskCopilot(queryInput)}
              disabled={askingCopilot}
              className="px-4 py-2 rounded-xl bg-[#1bb49e] text-[#071a2b] font-black text-xs hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              {askingCopilot ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>استشارة Co-Pilot</span>
            </button>
          </div>

          {/* Response Container */}
          {copilotResponse && (
            <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1bb49e]/15 text-[#1bb49e] flex items-center justify-center font-black text-xs">
                    DARB
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-stone-900 dark:text-white">
                      مخرجات التحليل الاستراتيجي التكاملي
                    </h4>
                    <span className="text-[10px] text-stone-400">
                      نسبة الثقة المعيارية: {copilotResponse.confidence_score}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {copilotResponse.relevant_country_codes.map(c => (
                    <span
                      key={c}
                      onClick={() => onSelectCountry?.(c)}
                      className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-black cursor-pointer hover:bg-[#1bb49e]/20"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Markdown Content */}
              <div className="prose prose-stone dark:prose-invert max-w-none text-xs md:text-sm leading-relaxed whitespace-pre-line text-stone-700 dark:text-stone-300">
                {copilotResponse.answer_markdown}
              </div>

              {/* Action Recommendations */}
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="text-xs font-extrabold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1bb49e]" />
                  <span>خطة العمل والتوصيات التنفيذية المباشرة:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                  {copilotResponse.strategic_recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#1bb49e] font-black">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deep Link Quick Jump Buttons to other DARB tools */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-stone-500">أدوات دَرْب ذات الصلة بالموضوع:</div>
                <div className="flex flex-wrap gap-2">
                  {copilotResponse.relevant_tools.map((tool, idx) => (
                    <button
                      key={idx}
                      onClick={() => onNavigateTab?.(tool.tab_id, tool.subtab_id)}
                      className="px-3 py-1.5 rounded-lg bg-[#1bb49e]/10 hover:bg-[#1bb49e]/20 text-[#1bb49e] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-[#1bb49e]/30"
                    >
                      <span>{tool.title_ar}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Listing Detail & Inquiry Modal */}
      {selectedListingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-lg w-full p-6 space-y-4 border border-stone-200 dark:border-stone-800 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-stone-500 font-bold">{selectedListingModal.country_name_ar}</span>
                <h3 className="text-lg font-extrabold text-stone-900 dark:text-white">
                  {selectedListingModal.entity_name_ar}
                </h3>
              </div>
              <button
                onClick={() => setSelectedListingModal(null)}
                className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-600 dark:text-stone-400">
              <div className="p-3 bg-stone-50 dark:bg-stone-950/60 rounded-xl space-y-1">
                <div className="font-bold text-stone-800 dark:text-stone-200">نبذة العرض والشراكة:</div>
                <p>{selectedListingModal.value_proposition_ar}</p>
              </div>

              <div className="flex justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                <span>حجم الصفقة المستهدف:</span>
                <span className="font-black text-stone-900 dark:text-white">
                  ${(selectedListingModal.ticket_size_usd / 1000000).toFixed(1)} مليون دولار
                </span>
              </div>

              <div className="flex justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                <span>قناة الربط والتنسيق المباشر:</span>
                <span className="font-mono text-[#1bb49e] font-bold">{selectedListingModal.contact_channel_ar}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedListingModal(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold"
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedListingModal.contact_channel_ar);
                  alert('تم نسخ قناة التواصل والربط المباشر!');
                  setSelectedListingModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#1bb49e] text-[#071a2b] text-xs font-black"
              >
                نسخ قناة التواصل المباشر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
