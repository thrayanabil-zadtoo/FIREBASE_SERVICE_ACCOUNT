import React, { useState, useEffect } from 'react';
import {
  Truck,
  Ship,
  Globe2,
  FileCheck,
  ArrowRightLeft,
  ShieldCheck,
  Sparkles,
  Clock,
  Layers,
  Search,
  ExternalLink,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  PanArabTradeAgreement,
  PanArabTransitCorridor
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
  { code: 'JO', name: 'الأردن', flag: '🇯🇴' },
  { code: 'MA', name: 'المغرب', flag: '🇲🇦' },
  { code: 'DZ', name: 'الجزائر', flag: '🇩🇿' },
  { code: 'TN', name: 'تونس', flag: '🇹🇳' },
  { code: 'IQ', name: 'العراق', flag: '🇮🇶' },
  { code: 'LY', name: 'ليبيا', flag: '🇱🇾' },
  { code: 'SD', name: 'السودان', flag: '🇸🇩' },
  { code: 'YE', name: 'اليمن', flag: '🇾🇪' },
  { code: 'SY', name: 'سوريا', flag: '🇸🇾' },
  { code: 'LB', name: 'لبنان', flag: '🇱🇧' },
  { code: 'MR', name: 'موريتانيا', flag: '🇲🇷' },
  { code: 'SO', name: 'الصومال', flag: '🇸🇴' },
  { code: 'DJ', name: 'جيبوتي', flag: '🇩🇯' },
  { code: 'KM', name: 'جزر القمر', flag: '🇰🇲' },
  { code: 'PS', name: 'فلسطين', flag: '🇵🇸' }
];

interface PanArabTradeSupplyChainViewProps {
  onOpenAIWithPrompt?: (prompt: string) => void;
  onSelectCountryProfile?: (countryCode: string) => void;
}

export default function PanArabTradeSupplyChainView({
  onOpenAIWithPrompt,
  onSelectCountryProfile
}: PanArabTradeSupplyChainViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'bilateral' | 'agreements' | 'corridors'>('bilateral');

  // Bilateral evaluator state
  const [countryA, setCountryA] = useState('SA');
  const [countryB, setCountryB] = useState('EG');
  const [bilateralData, setBilateralData] = useState<any>(null);
  const [evalLoading, setEvalLoading] = useState(false);

  // All agreements
  const [agreements, setAgreements] = useState<PanArabTradeAgreement[]>([]);
  const [corridors, setCorridors] = useState<PanArabTransitCorridor[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Filters
  const [agreementSearch, setAgreementSearch] = useState('');
  const [corridorSearch, setCorridorSearch] = useState('');

  useEffect(() => {
    loadAllTradeData();
  }, []);

  useEffect(() => {
    loadBilateralEvaluation();
  }, [countryA, countryB]);

  const loadAllTradeData = async () => {
    setLoadingData(true);
    try {
      const [agrRes, corRes] = await Promise.all([
        fetchApi<any>('/api/countries/trade/agreements'),
        fetchApi<any>('/api/countries/trade/transit-corridors')
      ]);
      if (agrRes.ok && agrRes.data) {
        setAgreements(agrRes.data);
      }
      if (corRes.ok && corRes.data) {
        setCorridors(corRes.data);
      }
    } catch (err) {
      console.error('Failed to load trade data', err);
    } finally {
      setLoadingData(false);
    }
  };

  const loadBilateralEvaluation = async () => {
    setEvalLoading(true);
    try {
      const res = await fetchApi<any>(`/api/countries/trade/bilateral-eval?countryA=${countryA}&countryB=${countryB}`);
      if (res.ok && res.data) {
        setBilateralData(res.data);
      }
    } catch (err) {
      console.error('Failed to evaluate trade', err);
    } finally {
      setEvalLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = countryA;
    setCountryA(countryB);
    setCountryB(temp);
  };

  const filteredAgreements = agreements.filter(a =>
    a.name_ar.toLowerCase().includes(agreementSearch.toLowerCase()) ||
    a.summary_ar.toLowerCase().includes(agreementSearch.toLowerCase()) ||
    a.customs_benefits_ar.toLowerCase().includes(agreementSearch.toLowerCase())
  );

  const filteredCorridors = corridors.filter(c =>
    c.name_ar.toLowerCase().includes(corridorSearch.toLowerCase()) ||
    c.border_crossing_name_ar.toLowerCase().includes(corridorSearch.toLowerCase()) ||
    c.primary_cargo_types.some(p => p.toLowerCase().includes(corridorSearch.toLowerCase()))
  );

  return (
    <div id="pan-arab-trade-supply-chain-view" className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-[#071a2b] text-white border border-stone-800 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-[#1bb49e]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#1bb49e]/20 text-[#8be4d4] text-[11px] font-bold mb-3 border border-[#1bb49e]/30">
              <Truck className="w-3.5 h-3.5" />
              <span>المرحلة الخامسة: التجارة البينية وسلاسل الإمداد العربية</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">مرصد التجارة البينية والمنافذ الجمركية وسلاسل الإمداد</h2>
            <p className="text-xs text-stone-300 max-w-2xl mt-1 leading-relaxed">
              تقييم فوري للاتفاقيات التجارية الثنائية والإقليمية (منطقة التجارة الحرة العربية الكبرى GAFTA، الاتحاد الجمركي الخليجي، اتفاقية أغادير)، والمنافذ والمعابر البرية والبحرية مع نسب الإعفاء وقواعد المنشأ.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onOpenAIWithPrompt) {
                  onOpenAIWithPrompt(
                    'قدم لي تحليلاً شاملاً لحركة التجارة البينية العربية والفرص الاستثمارية في سلاسل الإمداد والمنافذ الجمركية بين دول المشرق والمغرب والخليج.'
                  );
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1bb49e] to-teal-500 text-[#071a2b] font-bold text-xs shadow-xs hover:brightness-105 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>تحليل استراتيجي للتجارة مع AI</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('bilateral')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'bilateral'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-xs'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>مقيّم التجارة البينية التفاعلي (Bilateral Evaluator)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('agreements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'agreements'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-xs'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>الاتفاقيات والاتحادات الجمركية ({agreements.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('corridors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'corridors'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-xs'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>المنافذ والمعابر البرية والبحرية ({corridors.length})</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SUBTAB 1: BILATERAL TRADE EVALUATOR                                    */}
      {/* ===================================================================== */}
      {activeSubTab === 'bilateral' && (
        <div className="space-y-6">
          {/* Country Selection Header */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-[#1bb49e]" />
              <span>حدد دولتي التبادل التجاري لتقييم الرسوم والمعابر الجمركية</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
              {/* Origin Country */}
              <div className="md:col-span-5 space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">دولة التصدير / المنشأ:</label>
                <select
                  value={countryA}
                  onChange={(e) => setCountryA(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-semibold focus:outline-hidden focus:border-[#1bb49e] transition-all cursor-pointer"
                >
                  {ARAB_COUNTRIES_LIST.map((c) => (
                    <option key={`a-${c.code}`} value={c.code} disabled={c.code === countryB}>
                      {c.flag} {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex justify-center py-2 md:py-0">
                <button
                  type="button"
                  onClick={handleSwap}
                  title="عكس دولتي التبادل"
                  className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-[#1bb49e]/20 hover:text-[#071a2b] border border-stone-200 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                >
                  <ArrowRightLeft className="w-4 h-4 text-stone-600" />
                </button>
              </div>

              {/* Destination Country */}
              <div className="md:col-span-5 space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">دولة الاستيراد / المقصد:</label>
                <select
                  value={countryB}
                  onChange={(e) => setCountryB(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-semibold focus:outline-hidden focus:border-[#1bb49e] transition-all cursor-pointer"
                >
                  {ARAB_COUNTRIES_LIST.map((c) => (
                    <option key={`b-${c.code}`} value={c.code} disabled={c.code === countryA}>
                      {c.flag} {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Evaluation Results Card */}
          {evalLoading ? (
            <div className="py-16 text-center bg-white border border-stone-200 rounded-2xl">
              <div className="w-10 h-10 border-3 border-[#1bb49e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-stone-500 font-semibold">جاري مطابقة الاتفاقيات والمعابر الجمركية البينية...</p>
            </div>
          ) : bilateralData ? (
            <div className="space-y-6">
              {/* Tariff Status Banner */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 border border-emerald-200 rounded-2xl p-5 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900 mb-1">
                        <span>{bilateralData.country_a.flag} {bilateralData.country_a.name_ar}</span>
                        <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{bilateralData.country_b.flag} {bilateralData.country_b.name_ar}</span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 leading-snug">
                        {bilateralData.tariff_summary}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1">
                        <strong>قاعدة المنشأ المعتمدة:</strong> {bilateralData.rules_of_origin}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onOpenAIWithPrompt && bilateralData.ai_trade_prompt) {
                        onOpenAIWithPrompt(bilateralData.ai_trade_prompt);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#071a2b] hover:bg-stone-800 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap self-start md:self-auto"
                  >
                    <Sparkles className="w-4 h-4 text-[#8be4d4]" />
                    <span>دراسة سلاسل الإمداد للبلدين</span>
                  </button>
                </div>
              </div>

              {/* Mutual Agreements Cards */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
                <h4 className="text-xs font-extrabold text-stone-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-[#1bb49e]" />
                  <span>الاتفاقيات التجارية المشتركة الحاكمة ({bilateralData.mutual_agreements?.length || 0})</span>
                </h4>

                {bilateralData.mutual_agreements?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bilateralData.mutual_agreements.map((agr: PanArabTradeAgreement) => (
                      <div key={agr.id} className="border border-stone-200 rounded-xl p-4 bg-stone-50/70 hover:bg-white hover:border-[#1bb49e]/40 transition-all space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-bold text-stone-900">{agr.name_ar}</h5>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1bb49e]/15 text-[#071a2b] shrink-0">
                            منشأ {agr.rules_of_origin_pct}%
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">{agr.summary_ar}</p>
                        <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between text-[11px]">
                          <span className="text-stone-500 font-medium">الهيئة المشرفة:</span>
                          <span className="font-bold text-stone-800">{agr.official_body_ar}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-stone-500 bg-stone-50 rounded-xl">
                    لا توجد اتفاقية تجارية ثنائية حصرية مباشرة مسجلة، وتخضع التبادلات لقواعد منظمة التجارة العالمية وقوانين التخليص القياسية.
                  </div>
                )}
              </div>

              {/* Connecting Corridors & Crossings */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
                <h4 className="text-xs font-extrabold text-stone-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#1bb49e]" />
                  <span>المنافذ والمعابر المباشرة بين البلدين ({bilateralData.connecting_corridors?.length || 0})</span>
                </h4>

                {bilateralData.connecting_corridors?.length > 0 ? (
                  <div className="space-y-3">
                    {bilateralData.connecting_corridors.map((c: PanArabTransitCorridor) => (
                      <div key={c.id} className="border border-stone-200 rounded-xl p-4 bg-white hover:border-[#1bb49e] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-900">{c.name_ar}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                              {c.status_ar}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600">{c.operational_notes_ar}</p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {c.primary_cargo_types.map((cargo, idx) => (
                              <span key={idx} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200">
                                {cargo}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-right shrink-0 border-t md:border-t-0 md:border-r md:pr-4 pt-2 md:pt-0 border-stone-100">
                          <span className="text-[10px] text-stone-400 block">زمن التخليص التقديري:</span>
                          <span className="text-xs font-extrabold text-stone-800 flex items-center gap-1 justify-end">
                            <Clock className="w-3.5 h-3.5 text-[#1bb49e]" />
                            {c.avg_clearance_hours}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-stone-500 bg-stone-50 rounded-xl">
                    لا يوجد معبر حدودي بري مباشر بين البلدين. يتم التبادل عبر الموانئ البحرية المعتمدة (مثل موانئ البحر الأحمر والمتوسط والخليج) أو رحلات الشحن الجوي والترانزيت عبر الدول المجاورة.
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUBTAB 2: TRADE AGREEMENTS & GAFTA EXPLORER                           */}
      {/* ===================================================================== */}
      {activeSubTab === 'agreements' && (
        <div className="space-y-5">
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث في الاتفاقيات، الاتحادات الجمركية، والامتيازات..."
                value={agreementSearch}
                onChange={(e) => setAgreementSearch(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-10 pl-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-[#1bb49e] transition-all"
              />
            </div>
            <div className="text-xs font-bold text-stone-600 shrink-0">
              {filteredAgreements.length} اتفاقية معتمدة
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAgreements.map((agr) => (
              <div key={agr.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:border-[#1bb49e]/50 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1bb49e]/15 text-[#071a2b]">
                      {agr.type === 'multilateral' ? 'اتفاقية متعددة الأطراف' : agr.type === 'regional' ? 'اتحاد / تكتل إقليمي' : 'شراكة ثنائية'}
                    </span>
                    <span className="text-[10px] font-extrabold text-stone-500 font-mono">
                      Origin: {agr.rules_of_origin_pct}%
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900">{agr.name_ar}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{agr.summary_ar}</p>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs">
                    <span className="font-bold text-emerald-800 block mb-1">المزايا الجمركية:</span>
                    <span className="text-stone-700">{agr.customs_benefits_ar}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>الدول الأعضاء: {agr.member_countries.length} دولة</span>
                  <span className="font-semibold text-stone-700">{agr.official_body_ar}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUBTAB 3: CORRIDORS & CROSSINGS DIRECTORY                            */}
      {/* ===================================================================== */}
      {activeSubTab === 'corridors' && (
        <div className="space-y-5">
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث بالاسم، المعبر، أو نوع الشحنة (ألمنيوم، بتروكيماويات، أغذية)..."
                value={corridorSearch}
                onChange={(e) => setCorridorSearch(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-10 pl-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-[#1bb49e] transition-all"
              />
            </div>
            <div className="text-xs font-bold text-stone-600 shrink-0">
              {filteredCorridors.length} معبر وشريان استراتيجي
            </div>
          </div>

          <div className="space-y-3.5">
            {filteredCorridors.map((c) => (
              <div key={c.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:border-[#1bb49e] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#071a2b] text-white flex items-center justify-center shrink-0">
                      {c.corridor_type === 'maritime_ferry' ? <Ship className="w-4 h-4 text-[#8be4d4]" /> : <Truck className="w-4 h-4 text-[#8be4d4]" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{c.name_ar}</h4>
                      <span className="text-[11px] text-stone-500">{c.border_crossing_name_ar}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed pr-10.5">{c.operational_notes_ar}</p>

                  <div className="flex flex-wrap gap-1.5 pr-10.5 pt-1">
                    {c.primary_cargo_types.map((type, i) => (
                      <span key={i} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200 font-medium">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right shrink-0 border-t md:border-t-0 md:border-r md:pr-5 pt-3 md:pt-0 border-stone-100 flex md:flex-col justify-between md:justify-center items-center md:items-end">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 mb-1">
                    {c.status_ar}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">معدل التخليص:</span>
                    <span className="text-xs font-extrabold text-stone-800 flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5 text-[#1bb49e]" />
                      {c.avg_clearance_hours}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
