import React, { useState, useEffect } from 'react';
import {
  Coins,
  Calculator,
  ArrowRightLeft,
  Sparkles,
  TrendingUp,
  Info,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  CreditCard,
  Building,
  Utensils,
  Car,
  Wifi,
  DollarSign,
  Share2,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import {
  PanArabCurrencyRate,
  PanArabLivingBudgetCalculation
} from '../types/country-profile';
import { fetchApi } from '../api';

interface PanArabBudgetCalculatorProps {
  onOpenAIWithPrompt?: (prompt: string) => void;
  onSelectCountryProfile?: (countryCode: string) => void;
}

export default function PanArabBudgetCalculator({
  onOpenAIWithPrompt,
  onSelectCountryProfile
}: PanArabBudgetCalculatorProps) {
  // Currencies State
  const [currencies, setCurrencies] = useState<PanArabCurrencyRate[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);

  // Currency Converter Tab
  const [convertAmount, setConvertAmount] = useState<number>(1000);
  const [convertFrom, setConvertFrom] = useState<string>('SAR');
  const [convertTo, setConvertTo] = useState<string>('EGP');

  // Budget Calculator Tab
  const [originCountry, setOriginCountry] = useState<string>('EG');
  const [destCountry, setDestCountry] = useState<string>('SA');
  const [durationDays, setDurationDays] = useState<number>(7);
  const [travelersCount, setTravelersCount] = useState<number>(1);
  const [lifestyle, setLifestyle] = useState<'budget' | 'moderate' | 'family' | 'luxury'>('moderate');
  const [budgetResult, setBudgetResult] = useState<PanArabLivingBudgetCalculation | null>(null);
  const [calculating, setCalculating] = useState(false);

  // Active Tool Sub-Tab
  const [activeTool, setActiveTool] = useState<'budget' | 'converter'>('budget');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    loadCurrencies();
    // Parse deep-link query parameters
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tool') === 'converter' || params.get('subtab') === 'converter') {
        setActiveTool('converter');
      }
      if (params.get('from')) {
        setConvertFrom(params.get('from')!.toUpperCase());
      }
      if (params.get('to')) {
        setConvertTo(params.get('to')!.toUpperCase());
      }
      if (params.get('amount')) {
        const parsed = parseFloat(params.get('amount')!);
        if (!isNaN(parsed) && parsed > 0) setConvertAmount(parsed);
      }
    } catch (e) {
      console.warn('URL param parse note:', e);
    }
  }, []);

  const handleCopyDirectConversionLink = () => {
    const origin = window.location.origin;
    const directUrl = `${origin}/?tab=pan_arab_intel&subtab=budget&tool=converter&from=${convertFrom}&to=${convertTo}&amount=${convertAmount}`;
    navigator.clipboard.writeText(directUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  const loadCurrencies = async () => {
    try {
      setLoadingCurrencies(true);
      const res = await fetchApi<PanArabCurrencyRate[]>('/countries/calculator/currencies');
      if (res.ok && (res as any).data) {
        setCurrencies((res as any).data);
      }
    } catch {
      // fallback
    } finally {
      setLoadingCurrencies(false);
    }
  };

  // Run Budget Calculation
  const handleCalculateBudget = async () => {
    try {
      setCalculating(true);
      const res = await fetchApi<PanArabLivingBudgetCalculation>('/countries/calculator/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin_country_code: originCountry,
          destination_country_code: destCountry,
          duration_days: durationDays,
          travelers_count: travelersCount,
          lifestyle
        })
      });

      if (res.ok && (res as any).data) {
        setBudgetResult((res as any).data);
      }
    } catch {
      // Fallback
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    handleCalculateBudget();
  }, [originCountry, destCountry, durationDays, travelersCount, lifestyle]);

  // Currency Converter Calculation
  const fromRate = currencies.find((c) => c.currency_code === convertFrom)?.rate_to_usd || 1;
  const toRate = currencies.find((c) => c.currency_code === convertTo)?.rate_to_usd || 1;
  const convertedValue = ((convertAmount / fromRate) * toRate).toFixed(2);
  const directExchangeRate = (toRate / fromRate).toFixed(4);

  // Swap currencies
  const handleSwapCurrencies = () => {
    const temp = convertFrom;
    setConvertFrom(convertTo);
    setConvertTo(temp);
  };

  // Swap Budget Countries
  const handleSwapCountries = () => {
    const temp = originCountry;
    setOriginCountry(destCountry);
    setDestCountry(temp);
  };

  return (
    <div id="darb-budget-calculator" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-l from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-sm border border-emerald-800/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-semibold border border-emerald-400/30">
              <Coins className="w-3.5 h-3.5" />
              <span>المرحلة الثالثة: محرك المعيشة وحاسبة الميزانيات والعملات</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              حاسبة تكلفة المعيشة والسفر ومحول العملات العربية
            </h2>
            <p className="text-emerald-100/80 text-sm md:text-base max-w-3xl leading-relaxed">
              احسب الميزانية التقديرية بدقة بين أي دولتين عربيتين وفق نمط المعيشة، مع محول عملات لحظي لكافة العملات الـ 22 ومقارنة مباشرة لفروق الأسعار والقوة الشرائية.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAIWithPrompt?.(`أريد خطة مالية وميزانية تفصيلية لانتقال أو سفر عائلي لمدة ${durationDays} أيام من ${budgetResult?.origin_country.name_ar || 'مصر'} إلى ${budgetResult?.destination_country.name_ar || 'السعودية'} مع توزيع الرواتب والمصاريف`)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>تخطيط مالي مخصص بالذكاء الاصطناعي</span>
            </button>
          </div>
        </div>

        {/* Tool Switcher */}
        <div className="mt-6 pt-5 border-t border-emerald-800/80 flex items-center gap-2">
          <button
            onClick={() => setActiveTool('budget')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTool === 'budget'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-950'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>حاسبة ميزانية السفر والمعيشة التقديرية</span>
          </button>
          <button
            onClick={() => setActiveTool('converter')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTool === 'converter'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-950'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>محول العملات العربية الـ 22 المباشر</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: LIVING & TRAVEL BUDGET CALCULATOR */}
      {activeTool === 'budget' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>معايير محاكاة الميزانية</span>
            </h3>

            {/* Country Origin & Destination */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                  دولة الانطلاق / الإقامة الحالية:
                </label>
                <select
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {currencies.map((c) => (
                    <option key={`origin-${c.country_code}`} value={c.country_code}>
                      {c.name_ar} ({c.currency_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center -my-1">
                <button
                  onClick={handleSwapCountries}
                  title="تبديل الدولتين"
                  className="p-1.5 rounded-full bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 border border-gray-200 transition-colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                  دولة الوجهة / السفر أو الاستقرار:
                </label>
                <select
                  value={destCountry}
                  onChange={(e) => setDestCountry(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {currencies.map((c) => (
                    <option key={`dest-${c.country_code}`} value={c.country_code}>
                      {c.name_ar} ({c.currency_code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration and Travelers */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  المدة (بالأيام):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-gray-500">يوم</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  عدد الأفراد:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={travelersCount}
                    onChange={(e) => setTravelersCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-gray-500">فرد</span>
                </div>
              </div>
            </div>

            {/* Quick Presets for Duration */}
            <div className="flex items-center gap-1.5 pt-1">
              {[
                { label: 'أسبوع (7)', days: 7 },
                { label: 'أسبوعان (14)', days: 14 },
                { label: 'شهر (30)', days: 30 }
              ].map((p) => (
                <button
                  key={p.days}
                  onClick={() => setDurationDays(p.days)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                    durationDays === p.days
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Lifestyle Tier */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-gray-600 block mb-2">
                نمط المعيشة والإنفاق:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'budget', label: 'اقتصادي / شبابي', desc: 'نزل ومواصلات عامة' },
                  { id: 'moderate', label: 'متوسط / قياسي', desc: 'فنادق 3-4 نجوم وتكسي' },
                  { id: 'family', label: 'عائلي مريح', desc: 'أجنحة وسيارة خاصة' },
                  { id: 'luxury', label: 'فاخر وممتاز', desc: '5 نجوم وسيارات فاخرة' }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setLifestyle(tier.id as any)}
                    className={`p-2.5 rounded-xl text-right border transition-all ${
                      lifestyle === tier.id
                        ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-500'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="block text-xs font-bold">{tier.label}</span>
                    <span className="block text-[10px] text-gray-500">{tier.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>
                تعتمد الحسابات على مؤشرات أسعار الغرف الفندقية الحضرية، الوجبات، شرائح الاتصالات، والمواصلات المعتمدة لعام 2025/2026.
              </span>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-8 space-y-5">
            {calculating ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
                <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-gray-500">جاري احتساب الميزانية التقديرية ومقارنة القوة الشرائية...</p>
              </div>
            ) : budgetResult ? (
              <>
                {/* Total Summary Cards */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/50 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{budgetResult.destination_country.flag}</span>
                      <div>
                        <span className="text-xs text-emerald-100 block">الميزانية التقديرية الإجمالية في {budgetResult.destination_country.name_ar}</span>
                        <div className="text-3xl font-black tracking-tight">
                          {budgetResult.breakdown_destination_currency.total.toLocaleString('ar-EG')}{' '}
                          <span className="text-lg font-bold text-emerald-200">{budgetResult.destination_country.currency_symbol}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right bg-emerald-800/40 p-3 rounded-xl border border-emerald-400/20">
                      <span className="text-[11px] text-emerald-200 block">ما يعادلها بعملة الانطلاق:</span>
                      <span className="text-lg font-bold font-mono">
                        {budgetResult.breakdown_origin_currency.total.toLocaleString('ar-EG')}{' '}
                        <span className="text-xs font-sans text-emerald-100">{budgetResult.origin_country.currency_symbol}</span>
                      </span>
                      <span className="block text-[10px] text-emerald-300">
                        (~{budgetResult.breakdown_usd.total.toLocaleString()} $ دولار أمريكي)
                      </span>
                    </div>
                  </div>

                  {/* Relative Cost Index Comparison */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-200" />
                      <span>
                        فارق تكلفة المعيشة:{' '}
                        <strong className="text-white font-bold">
                          {budgetResult.cost_index_comparison.cost_difference_pct > 0
                            ? `أعلى بنحو +${budgetResult.cost_index_comparison.cost_difference_pct}%`
                            : budgetResult.cost_index_comparison.cost_difference_pct < 0
                            ? `أقل بنحو ${budgetResult.cost_index_comparison.cost_difference_pct}%`
                            : 'متقاربة جداً'}
                        </strong>{' '}
                        مقارنة بـ {budgetResult.origin_country.name_ar}.
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-100 bg-emerald-800/50 px-2.5 py-1 rounded-lg">
                      1 {budgetResult.origin_country.currency_symbol} = {budgetResult.exchange_rate_direct}{' '}
                      {budgetResult.destination_country.currency_symbol}
                    </span>
                  </div>
                </div>

                {/* Breakdown Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    {
                      title: 'السكن والإقامة',
                      amount: budgetResult.breakdown_destination_currency.accommodation,
                      icon: Building,
                      color: 'text-sky-600',
                      bg: 'bg-sky-50',
                      border: 'border-sky-100'
                    },
                    {
                      title: 'الوجبات والمطاعم',
                      amount: budgetResult.breakdown_destination_currency.food_and_dining,
                      icon: Utensils,
                      color: 'text-amber-600',
                      bg: 'bg-amber-50',
                      border: 'border-amber-100'
                    },
                    {
                      title: 'التنقل والمواصلات',
                      amount: budgetResult.breakdown_destination_currency.transportation,
                      icon: Car,
                      color: 'text-indigo-600',
                      bg: 'bg-indigo-50',
                      border: 'border-indigo-100'
                    },
                    {
                      title: 'الاتصالات والإنترنت',
                      amount: budgetResult.breakdown_destination_currency.telecom_and_connectivity,
                      icon: Wifi,
                      color: 'text-purple-600',
                      bg: 'bg-purple-50',
                      border: 'border-purple-100'
                    },
                    {
                      title: 'الأنشطة والطوارئ',
                      amount: budgetResult.breakdown_destination_currency.contingency_and_activities,
                      icon: DollarSign,
                      color: 'text-emerald-600',
                      bg: 'bg-emerald-50',
                      border: 'border-emerald-100'
                    }
                  ].map((cat, idx) => {
                    const Icon = cat.icon;
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl ${cat.bg} border ${cat.border} shadow-2xs space-y-2`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-gray-600">{cat.title}</span>
                          <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                        </div>
                        <div className="text-base font-bold text-gray-900">
                          {cat.amount.toLocaleString('ar-EG')}{' '}
                          <span className="text-xs font-normal text-gray-500">
                            {budgetResult.destination_country.currency_symbol}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Practical Advice & Governance Advisory */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>إرشادات ونصائح الصرف والمدفوعات في {budgetResult.destination_country.name_ar}:</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    {budgetResult.practical_travel_advice.map((adv, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* VIEW 2: FULL 22 ARAB CURRENCIES CONVERTER */}
      {activeTool === 'converter' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="text-lg font-bold text-gray-900 text-center">محول العملات العربية المباشر</h3>
            <p className="text-xs text-gray-500 text-center">
              أسعار صرف مرجعية معتمدة لعام 2025 لجميع العملات العربية الـ 22 مقابل الدولار والعملات البينية.
            </p>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
              {/* Amount Input */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">المبلغ المطلوب تحويله:</label>
                <input
                  type="number"
                  min={1}
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* From & To Currencies */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 block mb-1">من عملة:</label>
                  <select
                    value={convertFrom}
                    onChange={(e) => setConvertFrom(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium text-gray-900"
                  >
                    {currencies.map((c) => (
                      <option key={`from-${c.currency_code}`} value={c.currency_code}>
                        {c.name_ar} ({c.currency_code} - {c.currency_symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center sm:col-span-1 pt-3">
                  <button
                    onClick={handleSwapCurrencies}
                    className="p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 block mb-1">إلى عملة:</label>
                  <select
                    value={convertTo}
                    onChange={(e) => setConvertTo(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium text-gray-900"
                  >
                    {currencies.map((c) => (
                      <option key={`to-${c.currency_code}`} value={c.currency_code}>
                        {c.name_ar} ({c.currency_code} - {c.currency_symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result Box */}
              <div className="p-4 bg-emerald-600 text-white rounded-xl text-center space-y-2 shadow-xs">
                <span className="text-xs text-emerald-100 block">المبلغ المحول:</span>
                <div className="text-3xl font-black">
                  {parseFloat(convertedValue).toLocaleString('ar-EG')}{' '}
                  <span className="text-sm font-medium text-emerald-200">
                    {currencies.find((c) => c.currency_code === convertTo)?.currency_symbol}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-200 block">
                  1 {currencies.find((c) => c.currency_code === convertFrom)?.currency_symbol} = {directExchangeRate}{' '}
                  {currencies.find((c) => c.currency_code === convertTo)?.currency_symbol}
                </span>

                {/* Direct Link Action */}
                <div className="pt-2 border-t border-emerald-500/50 flex items-center justify-center gap-2">
                  <button
                    id="btn-copy-direct-conversion-link"
                    onClick={handleCopyDirectConversionLink}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm border border-emerald-400/30"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-200" />
                        <span>تم نسخ رابط التحويل المباشر!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-emerald-200" />
                        <span>نسخ رابط التحويل المباشر</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Remittance & Bank Transfer Platforms */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3 text-right">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-[#1bb49e]" />
                  <span>قنوات التحويل المالي والمدفوعات المباشرة بين الدول العربية:</span>
                </span>
                <span className="text-[10px] text-stone-500">تحويل فوري / لحظي</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-stone-900 block text-xs">نظام آفاق (AFAQ - GCC RTGS)</strong>
                    <span className="text-[11px] text-stone-500">التحويل الخليجي الفوري المباشر بالريال والدرهم والدينار عبر البنوك المركزية الخليجية.</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-stone-900 block text-xs">شبكة إنستاباي (InstaPay Egypt)</strong>
                    <span className="text-[11px] text-stone-500">التحويل اللحظي لحسابات وبطاقات ميزة والبنوك المصرية من الخارج بدون تأخير.</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-stone-900 block text-xs">تحويل الراجحي / بنك البلاد (إنجاز)</strong>
                    <span className="text-[11px] text-stone-500">قنوات إيداع نقدي وبنكي مباشر للمغتربين بالخليج إلى مصر والأردن والمغرب.</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-stone-200 flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-stone-900 block text-xs">ويسترن يونيون وموني جرام الدولية</strong>
                    <span className="text-[11px] text-stone-500">استلام نقدي فوري بالدولار أو العملة المحلية عبر آلاف الفروع في 22 دولة.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full 22 Currencies Reference Rates Table */}
          <div className="space-y-3 pt-4">
            <h4 className="text-xs font-bold text-gray-700">جدول أسعار صرف العملات الـ 22 المرجعية مقابل الدولار الأمريكي (USD):</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {currencies.map((curr) => (
                <div
                  key={curr.currency_code}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">{curr.name_ar}</span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {curr.currency_code} ({curr.currency_symbol})
                    </span>
                  </div>
                  <div className="text-left font-mono text-xs font-bold text-emerald-800">
                    {curr.rate_to_usd} / $
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
