import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Compass,
  Sparkles,
  Plane,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  ExternalLink,
  ArrowRightLeft,
  CheckCircle2,
  FileText,
  Clock,
  Coins,
  Globe2,
  PhoneCall,
  Landmark,
  Award,
  Laptop,
  Briefcase,
  Search,
  Building2,
  HelpCircle
} from 'lucide-react';
import {
  PanArabVisaSimulatorResult,
  PanArabEmergencyDirectoryItem,
  PanArabResidencyPathway
} from '../types/country-profile';
import { fetchApi } from '../api';

const ARAB_COUNTRIES_LIST = [
  { code: 'SA', name: 'السعودية', flag: '🇸🇦' },
  { code: 'AE', name: 'الإمارات', flag: '🇦🇪' },
  { code: 'EG', name: 'مصر', flag: '🇪🇬' },
  { code: 'QA', name: 'قطر', flag: '🇶🇦' },
  { code: 'KW', name: 'الكويت', flag: '🇰🇼' },
  { code: 'OM', name: 'عُمان', flag: '🇴🇲' },
  { code: 'BH', name: 'البحرين', flag: '🇧🇭' },
  { code: 'MA', name: 'المغرب', flag: '🇲🇦' },
  { code: 'JO', name: 'الأردن', flag: '🇯🇴' },
  { code: 'DZ', name: 'الجزائر', flag: '🇩🇿' },
  { code: 'TN', name: 'تونس', flag: '🇹🇳' },
  { code: 'IQ', name: 'العراق', flag: '🇮🇶' },
  { code: 'LB', name: 'لبنان', flag: '🇱🇧' },
  { code: 'SD', name: 'السودان', flag: '🇸🇩' },
  { code: 'SY', name: 'سوريا', flag: '🇸🇾' },
  { code: 'YE', name: 'اليمن', flag: '🇾🇪' },
  { code: 'LY', name: 'ليبيا', flag: '🇱🇾' },
  { code: 'MR', name: 'موريتانيا', flag: '🇲🇷' },
  { code: 'SO', name: 'الصومال', flag: '🇸🇴' },
  { code: 'DJ', name: 'جيبوتي', flag: '🇩🇯' },
  { code: 'KM', name: 'جزر القمر', flag: '🇰🇲' },
  { code: 'PS', name: 'فلسطين', flag: '🇵🇸' }
];

interface PanArabMobilityViewProps {
  onOpenAIWithPrompt?: (prompt: string) => void;
  onSelectCountryProfile?: (countryCode: string) => void;
}

export default function PanArabMobilityView({
  onOpenAIWithPrompt,
  onSelectCountryProfile
}: PanArabMobilityViewProps) {
  const [subTab, setSubTab] = useState<'simulator' | 'emergency'>('simulator');

  // Simulator State
  const [originCountry, setOriginCountry] = useState('EG');
  const [destCountry, setDestCountry] = useState('SA');
  const [visaData, setVisaData] = useState<PanArabVisaSimulatorResult | null>(null);
  const [loadingVisa, setLoadingVisa] = useState(false);

  // Emergency Directory State
  const [emergencyList, setEmergencyList] = useState<PanArabEmergencyDirectoryItem[]>([]);
  const [selectedEmergencyCountry, setSelectedEmergencyCountry] = useState<string>('all');
  const [searchEmergency, setSearchEmergency] = useState<string>('');
  const [loadingEmergency, setLoadingEmergency] = useState(false);

  // Load Visa Evaluation
  useEffect(() => {
    loadVisaPolicy(originCountry, destCountry);
  }, [originCountry, destCountry]);

  // Load Emergency Directory
  useEffect(() => {
    loadEmergencyData();
  }, []);

  const loadVisaPolicy = async (orig: string, dest: string) => {
    setLoadingVisa(true);
    try {
      const res = await fetchApi<PanArabVisaSimulatorResult>(
        `/countries/analytics/visa-policy?origin=${orig}&destination=${dest}`
      );
      if (res.ok && res.data) {
        setVisaData(res.data);
      }
    } catch (err) {
      console.error('Error fetching visa policy:', err);
    } finally {
      setLoadingVisa(false);
    }
  };

  const loadEmergencyData = async () => {
    setLoadingEmergency(true);
    try {
      const res = await fetchApi<PanArabEmergencyDirectoryItem[]>(
        '/countries/analytics/emergency-directory'
      );
      if (res.ok && res.data) {
        setEmergencyList(res.data);
      }
    } catch (err) {
      console.error('Error fetching emergency data:', err);
    } finally {
      setLoadingEmergency(false);
    }
  };

  const handleSwap = () => {
    const temp = originCountry;
    setOriginCountry(destCountry);
    setDestCountry(temp);
  };

  // Filter emergency items
  const filteredEmergencyList = emergencyList.filter((item) => {
    if (selectedEmergencyCountry !== 'all' && item.country_code !== selectedEmergencyCountry) {
      return false;
    }
    if (!searchEmergency.trim()) return true;
    const q = searchEmergency.toLowerCase();
    return (
      item.country_name_ar.toLowerCase().includes(q) ||
      item.police.toLowerCase().includes(q) ||
      item.unified_emergency.toLowerCase().includes(q) ||
      item.advisories_and_legal_tips.some((tip) => tip.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8" dir="rtl">
      {/* View Header */}
      <div className="bg-[#0b2239] rounded-2xl p-6 sm:p-8 text-white border border-white/10 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1bb49e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1bb49e]/20 text-[#1bb49e] text-xs font-bold border border-[#1bb49e]/30">
              <Compass className="w-3.5 h-3.5" />
              <span>المرحلة الرابعة: مصفوفة التأشيرات والتنقل وحالات الطوارئ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              محاكي التنقل والتأشيرات ودليل الطوارئ العربي الموحد
            </h2>
            <p className="text-stone-300 text-sm max-w-3xl leading-relaxed">
              تحليل فوري لسياسات التأشيرات والإعفاءات المتبادلة بين الدول العربية الـ 22، استكشاف برامج
              الإقامة الذهبية وتأشيرات العمل عن بُعد، مع دليل متكامل لأرقام الطوارئ والامتثال القانوني.
            </p>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex bg-white/10 p-1.5 rounded-xl border border-white/10 self-start md:self-auto shrink-0">
            <button
              id="subtab-mobility-simulator"
              onClick={() => setSubTab('simulator')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                subTab === 'simulator'
                  ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>محاكي التأشيرات والإقامات</span>
            </button>
            <button
              id="subtab-mobility-emergency"
              onClick={() => setSubTab('emergency')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                subTab === 'emergency'
                  ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>دليل الطوارئ والسلامة</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: VISA & MOBILITY SIMULATOR                                        */}
      {/* ========================================================================= */}
      {subTab === 'simulator' && (
        <div className="space-y-6">
          {/* Country Selector Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
            <h3 className="text-base font-extrabold text-[#071a2b] mb-4 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-[#1bb49e]" />
              <span>حدد جنسية جواز السفر ودولة الوجهة العربية</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              {/* Origin Passport */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-600 block">
                  جنسية جواز السفر (دولة الأصل)
                </label>
                <div className="relative">
                  <select
                    id="select-visa-origin"
                    value={originCountry}
                    onChange={(e) => setOriginCountry(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 text-[#071a2b] font-bold text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1bb49e]"
                  >
                    {ARAB_COUNTRIES_LIST.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center md:col-span-1 pt-4 md:pt-0">
                <button
                  id="btn-swap-visa-countries"
                  onClick={handleSwap}
                  className="p-3 bg-stone-100 hover:bg-[#1bb49e] hover:text-[#071a2b] text-stone-600 rounded-xl transition-all border border-stone-200 shadow-sm cursor-pointer"
                  title="عكس اتجاه السفر"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Destination Country */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-600 block">
                  دولة الوجهة العربية المستهدفة
                </label>
                <div className="relative">
                  <select
                    id="select-visa-dest"
                    value={destCountry}
                    onChange={(e) => setDestCountry(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 text-[#071a2b] font-bold text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1bb49e]"
                  >
                    {ARAB_COUNTRIES_LIST.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Result Card */}
          {loadingVisa ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-sm">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#1bb49e] border-t-transparent mb-3" />
              <p className="text-stone-500 font-bold text-sm">جاري مراجعة اتفاقيات الدخول وسياسات التأشيرات...</p>
            </div>
          ) : visaData ? (
            <div className="space-y-6">
              {/* Category Banner */}
              <div
                className={`rounded-2xl p-6 border shadow-sm ${
                  visaData.visa_category === 'gcc_national'
                    ? 'bg-emerald-50 border-emerald-300'
                    : visaData.visa_category === 'visa_free'
                    ? 'bg-teal-50 border-teal-300'
                    : visaData.visa_category === 'evisa'
                    ? 'bg-cyan-50 border-cyan-300'
                    : visaData.visa_category === 'visa_on_arrival'
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-stone-50 border-stone-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        visaData.visa_category === 'gcc_national' || visaData.visa_category === 'visa_free'
                          ? 'bg-emerald-600 text-white'
                          : visaData.visa_category === 'evisa'
                          ? 'bg-cyan-700 text-white'
                          : visaData.visa_category === 'visa_on_arrival'
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-700 text-white'
                      }`}
                    >
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-500 mb-1">تصنيف الدخول المعتمد</div>
                      <h4 className="text-xl font-black text-[#071a2b]">
                        {visaData.visa_category_label_ar}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1">
                        السفر من {visaData.origin_country.flag} {visaData.origin_country.name_ar} إلى{' '}
                        {visaData.destination_country.flag} {visaData.destination_country.name_ar}
                      </p>
                    </div>
                  </div>

                  {visaData.official_portal_url && visaData.official_portal_url !== '#' && (
                    <a
                      id="btn-official-visa-portal"
                      href={visaData.official_portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#071a2b] hover:bg-[#1bb49e] hover:text-[#071a2b] text-white text-xs font-bold transition-all shadow-sm shrink-0"
                    >
                      <span>التقديم عبر {visaData.official_portal_name}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* 4 Key Policy Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-bold">
                    <Clock className="w-3.5 h-3.5 text-[#1bb49e]" />
                    <span>أقصى مدة إقامة سياحية</span>
                  </div>
                  <div className="text-xl font-black text-[#071a2b]">
                    {visaData.max_stay_days === 365 ? 'إقامة مفتوحة / سنوية' : `${visaData.max_stay_days} يوماً`}
                  </div>
                  <div className="text-[11px] text-stone-400">قابلة للتمديد وفق الشروط</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-bold">
                    <Coins className="w-3.5 h-3.5 text-[#1bb49e]" />
                    <span>الرسوم الحكومية التقديرية</span>
                  </div>
                  <div className="text-xl font-black text-[#071a2b]">
                    {visaData.estimated_fee_usd === 0 ? 'معفى مجاناً' : `~ $${visaData.estimated_fee_usd}`}
                  </div>
                  <div className="text-[11px] text-stone-400">حسب نوع وسرعة المعالجة</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-bold">
                    <FileText className="w-3.5 h-3.5 text-[#1bb49e]" />
                    <span>صلاحية جواز السفر</span>
                  </div>
                  <div className="text-xl font-black text-[#071a2b]">
                    {visaData.passport_validity_months} أشهر كحد أدنى
                  </div>
                  <div className="text-[11px] text-stone-400">قبل تاريخ السفر المحدد</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-bold">
                    <Building2 className="w-3.5 h-3.5 text-[#1bb49e]" />
                    <span>مسارات الإقامة المميزة</span>
                  </div>
                  <div className="text-xl font-black text-[#071a2b]">
                    {visaData.residencies_available.length > 0
                      ? `${visaData.residencies_available.length} مسارات معتمدة`
                      : 'إقامات العمل والزيارة'}
                  </div>
                  <div className="text-[11px] text-stone-400">مستثمر، ذهبية، وبدو رقميون</div>
                </div>
              </div>

              {/* Special Waivers and Notes */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
                <h4 className="text-sm font-extrabold text-[#071a2b] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#1bb49e]" />
                  <span>تسهيلات الاستثناء والتعليمات التنفيذية</span>
                </h4>
                <div className="space-y-2">
                  {visaData.special_waivers_and_notes.map((note, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Golden Visas & Residency Pathways (if available) */}
              {visaData.residencies_available.length > 0 && (
                <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-[#071a2b] flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>
                        مسارات الإقامة المميزة والذهبية المتاحة في {visaData.destination_country.flag}{' '}
                        {visaData.destination_country.name_ar}
                      </span>
                    </h4>
                    <span className="text-xs font-bold text-stone-500">
                      فرص الاستقرار والعمل الحر 2025/2026
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {visaData.residencies_available.map((res) => (
                      <div
                        key={res.id}
                        className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs space-y-3 hover:border-[#1bb49e] transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              res.category === 'golden'
                                ? 'bg-amber-100 text-amber-800'
                                : res.category === 'digital_nomad'
                                ? 'bg-cyan-100 text-cyan-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {res.category === 'golden'
                              ? 'إقامة ذهبية'
                              : res.category === 'digital_nomad'
                              ? 'عمل عن بُعد'
                              : 'استثمار'}
                          </span>
                          <span className="text-[11px] font-bold text-stone-400">{res.validity_years}</span>
                        </div>

                        <div>
                          <h5 className="font-extrabold text-sm text-[#071a2b]">{res.title_ar}</h5>
                          <p className="text-xs text-stone-600 mt-1 leading-relaxed line-clamp-3">
                            {res.minimum_requirements_ar}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-100 space-y-1">
                          <div className="text-[11px] font-bold text-stone-500">أبرز المزايا:</div>
                          {res.perks_ar.slice(0, 2).map((perk, i) => (
                            <div key={i} className="text-[11px] text-stone-600 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1bb49e]" />
                              <span className="truncate">{perk}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 text-[10px] text-stone-400 font-mono">
                          البوابة: {res.processing_portal}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions & AI Help */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2">
                  {onSelectCountryProfile && (
                    <button
                      onClick={() => onSelectCountryProfile(destCountry)}
                      className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold text-xs transition-all cursor-pointer"
                    >
                      استكشاف الملف التعريفي الشامل لـ {visaData.destination_country.name_ar}
                    </button>
                  )}
                </div>

                {onOpenAIWithPrompt && (
                  <button
                    id="btn-ai-visa-consult"
                    onClick={() =>
                      onOpenAIWithPrompt(
                        `أنا مواطن من ${visaData.origin_country.name_ar} وأرغب في السفر أو الانتقال للعمل والاستثمار في ${visaData.destination_country.name_ar}. ما هي أحدث شروط التأشيرات، الأوراق المطلوبة، تكلفة المعيشة المتوقعة، وأفضل مسارات الإقامة المتاحة لي لعام 2025/2026؟`
                      )
                    }
                    className="px-5 py-2.5 rounded-xl bg-[#0b2239] hover:bg-[#1bb49e] hover:text-[#071a2b] text-white font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-[#1bb49e]" />
                    <span>استشارة مستشار السفر الذكي DARB AI</span>
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: PAN-ARAB EMERGENCY & CONSULAR DIRECTORY                           */}
      {/* ========================================================================= */}
      {subTab === 'emergency' && (
        <div className="space-y-6">
          {/* Controls: Search and Filter */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-[#071a2b] flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-rose-600" />
                  <span>دليل خطوط الطوارئ والشرطة والإسعاف في الدول العربية الـ 22</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  أرقام الطوارئ المعتمدة رسمياً، إدارات شرطة السياحة، وإرشادات السلامة القانونية لحماية
                  الزوار والمغتربين.
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-emergency-search"
                  type="text"
                  value={searchEmergency}
                  onChange={(e) => setSearchEmergency(e.target.value)}
                  placeholder="ابحث بالدولة، الرقم، أو النصيحة..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-9 pl-4 py-2 text-xs text-[#071a2b] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1bb49e]"
                />
              </div>
            </div>

            {/* Quick Country Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedEmergencyCountry('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedEmergencyCountry === 'all'
                    ? 'bg-[#071a2b] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                جميع الدول الـ 22
              </button>
              {ARAB_COUNTRIES_LIST.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedEmergencyCountry(c.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                    selectedEmergencyCountry === c.code
                      ? 'bg-[#1bb49e] text-[#071a2b] shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Directory Cards */}
          {loadingEmergency ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-sm">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#1bb49e] border-t-transparent mb-3" />
              <p className="text-stone-500 font-bold text-sm">جاري تحميل سجلات الطوارئ الرسمية...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredEmergencyList.map((item) => (
                <div
                  key={item.country_code}
                  className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4 hover:border-rose-300 transition-all"
                >
                  {/* Country Header & Unified Number */}
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.flag}</span>
                      <div>
                        <h4 className="font-extrabold text-sm text-[#071a2b]">{item.country_name_ar}</h4>
                        <span className="text-[10px] text-stone-400 font-mono">كود: {item.country_code}</span>
                      </div>
                    </div>

                    <div className="text-left bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl">
                      <div className="text-[10px] font-bold text-rose-600">الطوارئ الموحد</div>
                      <div className="text-lg font-black text-rose-700 tracking-wider">
                        {item.unified_emergency}
                      </div>
                    </div>
                  </div>

                  {/* Hotlines Grid */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                      <span className="text-stone-500 font-bold">الشرطة والنجدة:</span>
                      <span className="font-extrabold text-[#071a2b] text-left" dir="ltr">
                        {item.police}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                      <span className="text-stone-500 font-bold">الإسعاف والطوارئ الطبية:</span>
                      <span className="font-extrabold text-rose-700 text-left" dir="ltr">
                        {item.ambulance}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                      <span className="text-stone-500 font-bold">الدفاع المدني والمطافئ:</span>
                      <span className="font-extrabold text-amber-700 text-left" dir="ltr">
                        {item.civil_defense}
                      </span>
                    </div>

                    {item.tourist_police && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-teal-50">
                        <span className="text-teal-700 font-bold">شرطة السياحة / الزوار:</span>
                        <span className="font-extrabold text-teal-900 text-left" dir="ltr">
                          {item.tourist_police}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Legal and Safety Advisories */}
                  {item.advisories_and_legal_tips.length > 0 && (
                    <div className="pt-2 border-t border-stone-100 space-y-1.5">
                      <div className="text-[11px] font-bold text-stone-600 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        <span>نصائح السلامة والأنظمة:</span>
                      </div>
                      <div className="space-y-1">
                        {item.advisories_and_legal_tips.map((tip, i) => (
                          <div
                            key={i}
                            className="text-[11px] text-stone-600 leading-relaxed bg-stone-50 p-2 rounded-lg"
                          >
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Profile Link */}
                  {onSelectCountryProfile && (
                    <button
                      onClick={() => onSelectCountryProfile(item.country_code)}
                      className="w-full py-2 rounded-xl text-center text-xs font-bold text-stone-600 hover:text-[#071a2b] hover:bg-stone-100 transition-all cursor-pointer"
                    >
                      عرض الملف الكامل لـ {item.country_name_ar} ←
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
