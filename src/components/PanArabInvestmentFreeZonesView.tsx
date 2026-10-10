import React, { useState, useEffect } from 'react';
import {
  Building2,
  TrendingUp,
  Globe2,
  Sparkles,
  ExternalLink,
  Printer,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Search,
  Filter,
  DollarSign,
  PieChart,
  Anchor,
  Plane,
  Compass,
  ArrowUpRight,
  Download,
  Share2,
  Info
} from 'lucide-react';
import {
  PanArabFreeZone,
  CountryExecutiveDossier
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

const SECTORS_FILTER_LIST = [
  { id: 'all', label: 'كافة القطاعات' },
  { id: 'logistics', label: 'اللوجستيات والموانئ' },
  { id: 'tech', label: 'التكنولوجيا والذكاء الاصطناعي' },
  { id: 'automotive', label: 'السيارات والتصنيع المتقدم' },
  { id: 'energy', label: 'الهيدروجين والطاقة النظيفة' },
  { id: 'finance', label: 'التمويل والمصارف' }
];

interface PanArabInvestmentFreeZonesViewProps {
  onOpenAIWithPrompt?: (prompt: string) => void;
  onSelectCountryProfile?: (countryCode: string) => void;
}

export default function PanArabInvestmentFreeZonesView({
  onOpenAIWithPrompt,
  onSelectCountryProfile
}: PanArabInvestmentFreeZonesViewProps) {
  const [subTab, setSubTab] = useState<'free_zones' | 'dossier'>('free_zones');

  // Free Zones State
  const [freeZones, setFreeZones] = useState<PanArabFreeZone[]>([]);
  const [loadingZones, setLoadingZones] = useState(false);
  const [countryFilter, setCountryFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Dossier State
  const [dossierCountry, setDossierCountry] = useState('SA');
  const [dossierData, setDossierData] = useState<CountryExecutiveDossier | null>(null);
  const [loadingDossier, setLoadingDossier] = useState(false);
  const [copiedFingerprint, setCopiedFingerprint] = useState(false);

  // Load Free Zones
  useEffect(() => {
    loadFreeZones();
  }, [countryFilter, sectorFilter]);

  // Load Dossier
  useEffect(() => {
    if (subTab === 'dossier') {
      loadExecutiveDossier(dossierCountry);
    }
  }, [subTab, dossierCountry]);

  const loadFreeZones = async () => {
    setLoadingZones(true);
    try {
      let url = '/countries/analytics/free-zones?';
      if (countryFilter !== 'all') url += `country=${countryFilter}&`;
      if (sectorFilter !== 'all') url += `sector=${encodeURIComponent(sectorFilter)}&`;

      const res = await fetchApi<{ total_count: number; data: PanArabFreeZone[] }>(url);
      if (res.ok && res.data) {
        setFreeZones((res as any).data || []);
      }
    } catch (err) {
      console.error('Error fetching free zones:', err);
    } finally {
      setLoadingZones(false);
    }
  };

  const loadExecutiveDossier = async (code: string) => {
    setLoadingDossier(true);
    try {
      const res = await fetchApi<CountryExecutiveDossier>(`/countries/analytics/dossier/${code}`);
      if (res.ok && res.data) {
        setDossierData(res.data);
      }
    } catch (err) {
      console.error('Error fetching executive dossier:', err);
    } finally {
      setLoadingDossier(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyDossierFingerprint = () => {
    if (dossierData && navigator.clipboard) {
      navigator.clipboard.writeText(dossierData.dossier_fingerprint);
      setCopiedFingerprint(true);
      setTimeout(() => setCopiedFingerprint(false), 2000);
    }
  };

  // Filter free zones by search query
  const filteredZones = freeZones.filter((fz) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      fz.name_ar.toLowerCase().includes(q) ||
      fz.name_en.toLowerCase().includes(q) ||
      fz.city.toLowerCase().includes(q) ||
      fz.country_name_ar.toLowerCase().includes(q) ||
      fz.primary_sectors.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8" dir="rtl">
      {/* View Header */}
      <div className="bg-[#071a2b] rounded-2xl p-6 sm:p-8 text-white border border-white/10 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#1bb49e]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1bb49e]/20 text-[#1bb49e] text-xs font-bold border border-[#1bb49e]/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>المرحلة الرابعة: المناطق الاقتصادية الحرة والملفات التنفيذية الشاملة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              أطلس الاستثمار والمناطق الحرة العربية والمولّد التنفيذي
            </h2>
            <p className="text-stone-300 text-sm max-w-3xl leading-relaxed">
              دليل متقدم لأكثر من 20 منطقة اقتصادية خاصة وحرة رائدة في الوطن العربي، حوافز الضرائب،
              الملكية الأجنبية 100%، مع أداة استخراج الملف التنفيذي الموحد لأي دولة عربية للطباعة
              والتصدير.
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex bg-white/10 p-1.5 rounded-xl border border-white/10 self-start md:self-auto shrink-0">
            <button
              id="subtab-investment-freezones"
              onClick={() => setSubTab('free_zones')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                subTab === 'free_zones'
                  ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>أطلس المناطق الحرة</span>
            </button>
            <button
              id="subtab-investment-dossier"
              onClick={() => setSubTab('dossier')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                subTab === 'dossier'
                  ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>الملف التنفيذي الشامل</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: FREE ZONES & INVESTMENT ATLAS                                    */}
      {/* ========================================================================= */}
      {subTab === 'free_zones' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-freezone-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن منطقة حرة، مدينة، قطاع، أو حافز ضريبي..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-9 pl-4 py-2.5 text-xs text-[#071a2b] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1bb49e]"
                />
              </div>

              {/* Country Filter dropdown */}
              <div className="w-full md:w-64">
                <select
                  id="select-freezone-country"
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-xs font-bold text-[#071a2b] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1bb49e]"
                >
                  <option value="all">كافة الدول العربية</option>
                  {ARAB_COUNTRIES_LIST.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Sector Tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-stone-400 shrink-0 ml-2">تصنيف القطاع:</span>
              {SECTORS_FILTER_LIST.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setSectorFilter(sec.id === 'all' ? 'all' : sec.label)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    (sectorFilter === 'all' && sec.id === 'all') || sectorFilter === sec.label
                      ? 'bg-[#071a2b] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Free Zones Grid */}
          {loadingZones ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-sm">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#1bb49e] border-t-transparent mb-3" />
              <p className="text-stone-500 font-bold text-sm">جاري جلب أطلس المناطق الحرة والاقتصادية...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredZones.map((fz) => (
                <div
                  key={fz.id}
                  className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#1bb49e] transition-all group"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#1bb49e]/15 text-[#071a2b]">
                            {fz.country_name_ar}
                          </span>
                          <span className="text-[11px] font-bold text-stone-400">
                            {fz.city} • تأسست {fz.established_year}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-base text-[#071a2b] group-hover:text-[#1bb49e] transition-colors">
                          {fz.name_ar}
                        </h4>
                        <div className="text-[11px] text-stone-400 font-sans">{fz.name_en}</div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-[#071a2b] shrink-0">
                        <Building2 className="w-5 h-5 text-[#1bb49e]" />
                      </div>
                    </div>

                    {/* Incentives Badges */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-center">
                        <div className="text-[10px] text-emerald-700 font-bold">الملكية الأجنبية</div>
                        <div className="text-sm font-black text-emerald-900">{fz.foreign_ownership_pct}%</div>
                      </div>
                      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-2.5 text-center">
                        <div className="text-[10px] text-cyan-700 font-bold">الرسوم الجمركية</div>
                        <div className="text-xs font-black text-cyan-900 truncate">0% للترانزيت</div>
                      </div>
                    </div>

                    {/* Strategic Features */}
                    <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                      {fz.strategic_features_ar}
                    </p>

                    {/* Targeted Sectors */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-stone-500">القطاعات المستهدفة:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {fz.primary_sectors.map((sec, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-stone-100 text-stone-700"
                          >
                            {sec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tax Incentives */}
                    <div className="space-y-1 pt-1">
                      <div className="text-[11px] font-bold text-stone-500">الحوافز والضمانات:</div>
                      {fz.tax_incentives.slice(0, 2).map((inc, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-stone-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1bb49e] shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                    {fz.website_url && (
                      <a
                        href={fz.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-extrabold text-[#071a2b] hover:text-[#1bb49e] flex items-center gap-1"
                      >
                        <span>البوابة الرسمية</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {onOpenAIWithPrompt && (
                      <button
                        onClick={() =>
                          onOpenAIWithPrompt(
                            `أريد دراسة متطلبات تأسيس شركة أو نشاط تجاري في ${fz.name_ar} في ${fz.country_name_ar}. ما هي الخطوات العملية، رأس المال الأدنى، الحوافز الضريبية، والقطاعات الأكثر ربحية لعام 2025/2026؟`
                          )
                        }
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#1bb49e] hover:text-[#071a2b] text-[11px] font-extrabold text-[#071a2b] transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#1bb49e]" />
                        <span>استشارة DARB AI</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: SMART EXECUTIVE COUNTRY DOSSIER                                   */}
      {/* ========================================================================= */}
      {subTab === 'dossier' && (
        <div className="space-y-6">
          {/* Country Switcher & Print Toolbar */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-stone-600 shrink-0">اختر الدولة لإصدار الملف:</label>
              <select
                id="select-dossier-country"
                value={dossierCountry}
                onChange={(e) => setDossierCountry(e.target.value)}
                className="bg-stone-50 border border-stone-200 text-xs font-bold text-[#071a2b] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1bb49e]"
              >
                {ARAB_COUNTRIES_LIST.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-print-executive-dossier"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#071a2b] font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الملف التنفيذي (PDF)</span>
              </button>

              {onOpenAIWithPrompt && dossierData && (
                <button
                  id="btn-ai-dossier-analysis"
                  onClick={() =>
                    onOpenAIWithPrompt(
                      `قم بصياغة ملخص تنفيذي ودراسة استراتيجية شاملة لدولة ${dossierData.country.name_ar} استناداً إلى ناتجها الاسمي البالغ ${dossierData.economic_summary.nominal_gdp}، نموها السنوي ${dossierData.economic_summary.growth_rate}، ومناطقها الحرة وممراتها الجيوسياسية. ما هي أبرز التوصيات الاستثمارية؟`
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-[#071a2b] hover:bg-[#1bb49e] hover:text-[#071a2b] text-white font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-[#1bb49e]" />
                  <span>تحليل استراتيجي عبر DARB AI</span>
                </button>
              )}
            </div>
          </div>

          {/* Dossier Document Container (Optimized for Screen and Print) */}
          {loadingDossier ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-sm">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#1bb49e] border-t-transparent mb-3" />
              <p className="text-stone-500 font-bold text-sm">جاري تجميع الملف التنفيذي الشامل...</p>
            </div>
          ) : dossierData ? (
            <div
              id="executive-country-dossier-print"
              className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm space-y-8 print:p-0 print:border-none print:shadow-none"
            >
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{dossierData.country.flag}</span>
                  <div>
                    <div className="text-xs font-bold text-stone-400">
                      وثيقة دَرْب التنفيذية الرسمية • منظومة الدول العربية
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#071a2b]">
                      الملف التنفيذي الشامل: {dossierData.country.name_ar}
                    </h3>
                    <div className="text-xs text-stone-500 font-mono mt-0.5">
                      {dossierData.country.name_en} • كود الدولة ISO: {dossierData.country.country_code}
                    </div>
                  </div>
                </div>

                <div className="text-left bg-stone-50 p-3 rounded-2xl border border-stone-200 shrink-0">
                  <div className="text-[10px] font-bold text-stone-400">بصمة التوثيق والتدقيق</div>
                  <div
                    onClick={handleCopyDossierFingerprint}
                    className="text-xs font-mono font-bold text-[#071a2b] cursor-pointer hover:text-[#1bb49e] flex items-center gap-1"
                    title="انقر لنسخ البصمة"
                  >
                    <span>{dossierData.dossier_fingerprint}</span>
                    {copiedFingerprint && <span className="text-emerald-600 text-[10px]">(تم النسخ)</span>}
                  </div>
                  <div className="text-[10px] text-stone-400">
                    تاريخ الإصدار: {new Date(dossierData.generated_at).toLocaleDateString('ar-EG')}
                  </div>
                </div>
              </div>

              {/* Section 1: Sovereign & Demographic Identifiers */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-[#071a2b] flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-[#1bb49e]" />
                  <span>المعطيات السيادية والديموغرافية الأساسية</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                    <span className="text-stone-400 block mb-1">العاصمة الإدارية</span>
                    <span className="font-extrabold text-[#071a2b] text-sm">{dossierData.country.capital}</span>
                  </div>
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                    <span className="text-stone-400 block mb-1">السكان المقدر 2025</span>
                    <span className="font-extrabold text-[#071a2b] text-sm">{dossierData.country.population}</span>
                  </div>
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                    <span className="text-stone-400 block mb-1">المساحة الجغرافية</span>
                    <span className="font-extrabold text-[#071a2b] text-sm">{dossierData.country.area_sq_km}</span>
                  </div>
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                    <span className="text-stone-400 block mb-1">العملة ورمز الصرف</span>
                    <span className="font-extrabold text-[#071a2b] text-sm">
                      {dossierData.country.currency} ({dossierData.country.currency_symbol})
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Macroeconomic & Sectoral Indicators */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-[#071a2b] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#1bb49e]" />
                  <span>المؤشرات الاقتصادية الكلية والقطاعات القيادية</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                    <span className="text-stone-400 block mb-1">الناتج المحلي الإجمالي الاسمي</span>
                    <span className="font-black text-lg text-[#071a2b]">
                      {dossierData.economic_summary.nominal_gdp}
                    </span>
                  </div>
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                    <span className="text-stone-400 block mb-1">معدل النمو المتوقع</span>
                    <span className="font-black text-lg text-emerald-700">
                      {dossierData.economic_summary.growth_rate}
                    </span>
                  </div>
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                    <span className="text-stone-400 block mb-1">التصنيف الهيكلي للاقتصاد</span>
                    <span className="font-extrabold text-sm text-[#071a2b]">
                      {dossierData.economic_summary.classification}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-bold text-stone-500">أهم القطاعات الإنتاجية:</span>
                  {dossierData.economic_summary.key_sectors.map((sec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-[#1bb49e]/15 text-[#071a2b]"
                    >
                      {sec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Section 3: Geopolitical Infrastructure (Ports, Airports, Straits) */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-[#071a2b] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#1bb49e]" />
                  <span>البنية اللوجستية والموانئ والمطارات والممرات الاستراتيجية</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#071a2b]">
                      <Anchor className="w-4 h-4 text-[#1bb49e]" />
                      <span>الموانئ البحرية التجارية الرئيسية:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {dossierData.geopolitical_hubs.seaports.length > 0 ? (
                        dossierData.geopolitical_hubs.seaports.map((port, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700">
                            {port}
                          </span>
                        ))
                      ) : (
                        <span className="text-stone-400">موانئ ومنافذ قيد التوثيق</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#071a2b]">
                      <Plane className="w-4 h-4 text-[#1bb49e]" />
                      <span>محاور الطيران والمطارات الدولية:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {dossierData.geopolitical_hubs.airports.length > 0 ? (
                        dossierData.geopolitical_hubs.airports.map((airport, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700">
                            {airport}
                          </span>
                        ))
                      ) : (
                        <span className="text-stone-400">مطارات دولية معتمدة</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Mobility, Visas & Free Zones */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-[#071a2b] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#1bb49e]" />
                  <span>المناطق الاقتصادية الخاصة وسياسات التأشيرات</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-2">
                    <span className="text-stone-400 block">المناطق الاقتصادية والحرة المعتمدة</span>
                    <div className="text-base font-black text-[#071a2b]">
                      {dossierData.free_zones_count} مناطق حرة نشطة
                    </div>
                    <div className="text-stone-600 space-y-1">
                      {dossierData.top_free_zones.length > 0 ? (
                        dossierData.top_free_zones.map((fz, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1bb49e]" />
                            <span>{fz}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-stone-400">مناطق تنموية عامة ومشاريع استثمارية قائمة</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-2">
                    <span className="text-stone-400 block">منظومة التأشيرات والإقامات</span>
                    <div className="text-base font-black text-[#071a2b]">
                      {dossierData.mobility_overview.golden_visas
                        ? 'تتيح مسارات الإقامة الذهبية والمستثمرين'
                        : 'تأشيرات عمل وسياحة إلكترونية'}
                    </div>
                    <div className="text-stone-600">
                      البوابة المعتمدة: <span className="font-mono">{dossierData.mobility_overview.official_visa_portal}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Emergency & Safety Directory */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-rose-800 block mb-0.5">خطوط الطوارئ والاتصال القنصلي السريع</span>
                  <span className="text-stone-600">
                    الرقم الموحد: <strong className="text-rose-700">{dossierData.emergency_numbers.unified}</strong> • الشرطة:{' '}
                    {dossierData.emergency_numbers.police} • الإسعاف: {dossierData.emergency_numbers.ambulance}
                  </span>
                </div>
                <div className="text-[11px] text-stone-400">محدث وفق سجلات منظومة دَرْب 2025/2026</div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
