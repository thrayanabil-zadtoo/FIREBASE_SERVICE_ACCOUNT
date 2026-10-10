import React, { useState, useEffect } from 'react';
import {
  Calendar,
  TrendingUp,
  ShieldCheck,
  Plus,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Sliders,
  FileText,
  AlertTriangle,
  Info,
  RefreshCw,
  Printer
} from 'lucide-react';
import {
  AnnualCountryUpdate,
  AnnualSimulationProjection
} from '../types/country-profile';
import { fetchApi } from '../api';

interface PanArabAnnualManagerViewProps {
  onOpenAIWithPrompt?: (prompt: string) => void;
  onSelectCountryProfile?: (countryCode: string) => void;
}

export default function PanArabAnnualManagerView({
  onOpenAIWithPrompt,
  onSelectCountryProfile
}: PanArabAnnualManagerViewProps) {
  // Annual Registry State
  const [updates, setUpdates] = useState<AnnualCountryUpdate[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [filterYear, setFilterYear] = useState<number | 'all'>(2025);

  // New Update Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    country_code: 'EG',
    year: 2026,
    population_estimate: '107.5 مليون نسمة',
    nominal_gdp_usd: '415 مليار $',
    growth_rate_pct: '4.7%',
    primary_source: 'تحديث بيانات وزارة التخطيط وصندوق النقد الدولي 2026',
    governance_audit_note: 'تمت مراجعة المؤشرات وتدقيقها وفق المعايير الإحصائية الرسمية'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Simulation & Future Projections State
  const [simYear, setSimYear] = useState<number>(2027);
  const [simulation, setSimulation] = useState<AnnualSimulationProjection | null>(null);
  const [loadingSim, setLoadingSim] = useState(false);
  const [simScenario, setSimScenario] = useState<'conservative' | 'baseline' | 'optimistic'>('baseline');

  useEffect(() => {
    loadAnnualUpdates();
  }, [filterYear]);

  useEffect(() => {
    loadSimulation(simYear);
  }, [simYear]);

  const loadAnnualUpdates = async () => {
    try {
      setLoadingUpdates(true);
      const url = filterYear === 'all'
        ? '/countries/analytics/annual-updates'
        : `/countries/analytics/annual-updates?year=${filterYear}`;
      const res = await fetchApi<AnnualCountryUpdate[]>(url);
      if (res.ok && (res as any).data) {
        setUpdates((res as any).data);
      }
    } catch {
      // fallback
    } finally {
      setLoadingUpdates(false);
    }
  };

  const loadSimulation = async (year: number) => {
    try {
      setLoadingSim(true);
      const res = await fetchApi<AnnualSimulationProjection>(`/countries/analytics/simulation-projections?year=${year}`);
      if (res.ok && (res as any).data) {
        setSimulation((res as any).data);
      }
    } catch {
      // fallback
    } finally {
      setLoadingSim(false);
    }
  };

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetchApi<any>('/countries/analytics/annual-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowAddForm(false);
        }, 1500);
        loadAnnualUpdates();
      }
    } catch {
      // fallback
    } finally {
      setSubmitting(false);
    }
  };

  // Quick printable report trigger
  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div id="darb-annual-governance" className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Calendar className="w-3.5 h-3.5" />
              <span>المرحلة الثالثة: حوكمة التحديثات السنوية ومحاكي التوقعات 2025 - 2030</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              إدارة المؤشرات السنوية ومحاكي الاقتصاد العربي
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
              تطبيق مبدأ الحوكمة المرنة لتحديث معدلات النمو، السكان، والناتج المحلي سنوياً بصورة مستقلة دون المساس بالبنية التاريخية الثابتة للدول.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل تحديث سنوي جديد</span>
            </button>
            <button
              onClick={handlePrintDossier}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة الملف السنوي</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: SIMULATION ENGINE (2025 - 2030) */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold text-gray-900">محاكي آفاق الاقتصاد والنمو العربي المستقبلي</h3>
            </div>
            <p className="text-xs text-gray-500">
              توقعات نموذجية تجميعية للمنطقة العربية مبنية على سيناريوهات التنويع الاقتصادي والإصلاحات الهيكلية.
            </p>
          </div>

          {/* Year selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600">سنة الاستشراف:</span>
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              {[2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSimYear(yr)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    simYear === yr
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loadingSim ? (
          <div className="py-8 text-center">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs text-gray-500">جاري احتساب سيناريو عام {simYear}...</span>
          </div>
        ) : simulation ? (
          <div className="space-y-5">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                <span className="text-xs text-indigo-700 font-semibold block">الناتج المحلي العربي الإجمالي التقديري:</span>
                <div className="text-2xl font-black text-indigo-950">
                  {simulation.projected_total_gdp_trillion_usd} ترليون $
                </div>
                <span className="text-[11px] text-indigo-600 block">
                  مقارنة بنحو 3.65 ترليون في 2025
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                <span className="text-xs text-emerald-700 font-semibold block">إجمالي عدد السكان المتوقع:</span>
                <div className="text-2xl font-black text-emerald-950">
                  {simulation.projected_population_total_million} مليون نسمة
                </div>
                <span className="text-[11px] text-emerald-600 block">
                  معدل نمو ديموغرافي مستقر
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1">
                <span className="text-xs text-amber-700 font-semibold block">معدل النمو الحقيقي المرجح:</span>
                <div className="text-2xl font-black text-amber-950">
                  +{simulation.projected_average_growth_rate_pct}%
                </div>
                <span className="text-[11px] text-amber-600 block">
                  بدفع من الأنشطة والخدمات غير النفطية
                </span>
              </div>
            </div>

            {/* Strategic Notes & Diversification Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
                <span className="text-xs font-bold text-gray-800 block">
                  القطاعات الأكثر نمواً ومساهمة في الناتج لعام {simYear}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {simulation.key_growth_drivers.map((driver, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs text-gray-800 font-medium"
                    >
                      ✓ {driver}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
                <span className="text-xs font-bold text-gray-800 block">ملاحظات التوازن المالي ومخاطر السلع:</span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {simulation.strategic_notes}
                </p>
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                onClick={() => onOpenAIWithPrompt?.(`قم بإعداد تقرير استشرافي مفصل عن الاقتصاد العربي لعام ${simYear} مع تحليل فرص الاستثمار المشترك وسيناريوهات أسعار الطاقة والتحول الرقمي`)}
                className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-indigo-200"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>إعداد تقرير استشرافي متكامل عبر الذكاء الاصطناعي</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* FORM: Add / Update Annual Indicators Modal */}
      {showAddForm && (
        <form onSubmit={handleSubmitUpdate} className="bg-white rounded-2xl p-6 border-2 border-emerald-500 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>تسجيل مؤشرات سنوية جديدة لدولة عربية (2025 - 2026)</span>
            </h4>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              إلغاء
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">رمز الدولة:</label>
              <select
                value={formData.country_code}
                onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium"
              >
                <option value="EG">مصر (EG)</option>
                <option value="SA">السعودية (SA)</option>
                <option value="AE">الإمارات (AE)</option>
                <option value="MA">المغرب (MA)</option>
                <option value="DZ">الجزائر (DZ)</option>
                <option value="IQ">العراق (IQ)</option>
                <option value="QA">قطر (QA)</option>
                <option value="KW">الكويت (KW)</option>
                <option value="OM">عُمان (OM)</option>
                <option value="JO">الأردن (JO)</option>
                <option value="TN">تونس (TN)</option>
                <option value="BH">البحرين (BH)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">السنة الإحصائية:</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2026 })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">تقدير السكان:</label>
              <input
                type="text"
                value={formData.population_estimate}
                onChange={(e) => setFormData({ ...formData, population_estimate: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">الناتج المحلي الاسمي ($):</label>
              <input
                type="text"
                value={formData.nominal_gdp_usd}
                onChange={(e) => setFormData({ ...formData, nominal_gdp_usd: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">معدل النمو السنوي:</label>
              <input
                type="text"
                value={formData.growth_rate_pct}
                onChange={(e) => setFormData({ ...formData, growth_rate_pct: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">المصدر الإحصائي المعتمد:</label>
              <input
                type="text"
                value={formData.primary_source}
                onChange={(e) => setFormData({ ...formData, primary_source: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">ملاحظة التدقيق والحوكمة:</label>
            <input
              type="text"
              value={formData.governance_audit_note}
              onChange={(e) => setFormData({ ...formData, governance_audit_note: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-gray-500">
              {submitSuccess && (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  تم تسجيل المؤشر السنوي بنجاح وتحديث السجل!
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? 'جاري الحفظ...' : 'حفظ المؤشر وتحديث المنظومة'}
            </button>
          </div>
        </form>
      )}

      {/* SECTION 2: ANNUAL INDICATORS REGISTRY */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>سجل المؤشرات السنوية المحدثة للدول العربية</span>
            </h3>
            <p className="text-xs text-gray-500">
              سجل تدقيق رسمي يتيح تحديث إحصاءات أي دولة مع توثيق المصدر وتاريخ المراجعة.
            </p>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-gray-500">تصفية حسب السنة:</span>
            {([2025, 2026, 'all'] as const).map((yr) => (
              <button
                key={String(yr)}
                onClick={() => setFilterYear(yr)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterYear === yr
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {yr === 'all' ? 'كافة السنوات' : yr}
              </button>
            ))}
          </div>
        </div>

        {loadingUpdates ? (
          <div className="py-8 text-center">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs text-gray-500">جاري تحميل سجل المؤشرات...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                  <th className="py-3 px-3 font-bold">الدولة</th>
                  <th className="py-3 px-3 font-bold">السنة</th>
                  <th className="py-3 px-3 font-bold">السكان المحدث</th>
                  <th className="py-3 px-3 font-bold">الناتج الاسمي</th>
                  <th className="py-3 px-3 font-bold">معدل النمو</th>
                  <th className="py-3 px-3 font-bold">المصدر الرسمي والتدقيق</th>
                  <th className="py-3 px-3 font-bold">تاريخ التحديث</th>
                  <th className="py-3 px-3 font-bold text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {updates.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-gray-900 flex items-center gap-2">
                      <span className="text-base">{item.flag}</span>
                      <span>{item.country_name_ar}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                      {item.year}
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-800">
                      {item.population_estimate}
                    </td>
                    <td className="py-3 px-3 font-medium text-emerald-800">
                      {item.nominal_gdp_usd}
                    </td>
                    <td className="py-3 px-3 font-bold text-indigo-900">
                      {item.growth_rate_pct}
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <div className="text-gray-900 font-semibold truncate" title={item.primary_source}>
                        {item.primary_source}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate" title={item.governance_audit_note}>
                        {item.governance_audit_note}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-500 text-[11px]">
                      {item.updated_at}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onSelectCountryProfile?.(item.country_code)}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[11px] font-semibold transition-colors"
                      >
                        الملف الكامل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
