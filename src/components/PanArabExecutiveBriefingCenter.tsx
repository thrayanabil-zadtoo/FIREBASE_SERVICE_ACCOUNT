import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Zap,
  Shield,
  Layers,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight,
  Send,
  Download,
  AlertCircle
} from 'lucide-react';
import {
  PanArabExecutiveBriefingRequest,
  PanArabExecutiveBriefingResponse
} from '../types/country-profile';

interface PanArabExecutiveBriefingCenterProps {
  onConsultAI?: (query: string) => void;
}

const AVAILABLE_COUNTRIES = [
  { code: 'SA', name_ar: 'المملكة العربية السعودية', flag: '🇸🇦' },
  { code: 'AE', name_ar: 'دولة الإمارات العربية المتحدة', flag: '🇦🇪' },
  { code: 'QA', name_ar: 'دولة قطر', flag: '🇶🇦' },
  { code: 'OM', name_ar: 'سلطنة عُمان', flag: '🇴🇲' },
  { code: 'KW', name_ar: 'دولة الكويت', flag: '🇰🇼' },
  { code: 'BH', name_ar: 'مملكة البحرين', flag: '🇧🇭' },
  { code: 'EG', name_ar: 'جمهورية مصر العربية', flag: '🇪🇬' },
  { code: 'MA', name_ar: 'المملكة المغربية', flag: '🇲🇦' },
  { code: 'JO', name_ar: 'المملكة الأردنية الهاشمية', flag: '🇯🇴' },
  { code: 'DZ', name_ar: 'الجمهورية الجزائرية الديمقراطية الشعبية', flag: '🇩🇿' },
  { code: 'IQ', name_ar: 'جمهورية العراق', flag: '🇮🇶' }
];

const DOMAINS_LIST = [
  { id: 'sovereign_investment', label: 'الاستثمار السيادي والصناديق التريليونية' },
  { id: 'geopolitical_risk', label: 'المخاطر الجيوسياسية ونقاط الاختناق' },
  { id: 'supply_chains', label: 'الممرات اللوجستية والتحوط في سلاسل الإمداد' },
  { id: 'digital_ai', label: 'السيادة الرقمية ومراكز الذكاء الاصطناعي' },
  { id: 'energy_transition', label: 'الهيدروجين الأخضر وتحول الطاقة' }
];

export const PanArabExecutiveBriefingCenter: React.FC<PanArabExecutiveBriefingCenterProps> = ({
  onConsultAI
}) => {
  const [recipientTitle, setRecipientTitle] = useState<string>('معالي الوزير / سعادة رئيس مجلس الإدارة التنفيذي');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['SA', 'AE', 'EG', 'MA']);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([
    'sovereign_investment',
    'geopolitical_risk',
    'supply_chains'
  ]);
  const [urgencyLevel, setUrgencyLevel] = useState<'routine' | 'strategic' | 'urgent_crisis'>('strategic');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [briefing, setBriefing] = useState<PanArabExecutiveBriefingResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const toggleCountry = (code: string) => {
    if (selectedCountries.includes(code)) {
      if (selectedCountries.length > 1) {
        setSelectedCountries(selectedCountries.filter((c) => c !== code));
      }
    } else {
      setSelectedCountries([...selectedCountries, code]);
    }
  };

  const toggleDomain = (id: string) => {
    if (selectedDomains.includes(id)) {
      if (selectedDomains.length > 1) {
        setSelectedDomains(selectedDomains.filter((d) => d !== id));
      }
    } else {
      setSelectedDomains([...selectedDomains, id]);
    }
  };

  const generateBriefing = async () => {
    setLoading(true);
    try {
      const payload: PanArabExecutiveBriefingRequest = {
        recipient_title: recipientTitle,
        selected_countries: selectedCountries,
        focus_domains: selectedDomains,
        urgency_level: urgencyLevel,
        custom_notes: customNotes
      };

      const res = await fetch('/api/countries/analytics/generate-executive-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.ok && data.data) {
        setBriefing(data.data);
      }
    } catch (err) {
      console.error('Failed to generate briefing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!briefing) return;
    const text = `
=== ${briefing.classification_level} ===
كود الوثيقة: ${briefing.document_id}
التاريخ: ${briefing.timestamp_formatted}
الموجّه إليه: ${briefing.recipient_title}

[الموجز التنفيذي]
${briefing.executive_summary_ar}

[أبرز النتائج الاستراتيجية]
${briefing.strategic_takeaways.map((t, i) => `${i + 1}. ${t}`).join('\n')}

[تحليل SWOT الاستراتيجي]
- نقاط القوة:
${briefing.swot_analysis.strengths.map((s) => `  * ${s}`).join('\n')}
- الفرص:
${briefing.swot_analysis.opportunities.map((o) => `  * ${o}`).join('\n')}
- التهديدات:
${briefing.swot_analysis.threats.map((th) => `  * ${th}`).join('\n')}

[خارطة الطريق الموصى بها]
${briefing.recommended_action_roadmap.map((r) => `* [${r.timeline_ar}] ${r.action_title_ar}: ${r.details_ar}`).join('\n')}

${briefing.darb_synthesis_statement}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="darb-executive-briefing-center" className="space-y-6 text-slate-800 dark:text-slate-100" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 rounded-2xl p-6 shadow-xl relative overflow-hidden text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <FileText className="w-3.5 h-3.5" />
              <span>المرحلة السابعة: مركز مذكرات الإحاطة الاستراتيجية الوزارية</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              منظومة إعداد مذكرات الإحاطة التنفيذية والمؤسسية
            </h2>
            <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
              توليد وثائق استراتيجية رسمية وموجزة لمتخذي القرار، الوزراء، ورؤساء مجالس الإدارة تشمل تحليلات SWOT المعيارية، تقييمات المخاطر، وخارطة طريق زمنية للتنفيذ مع إمكانية التصدير والطباعة.
            </p>
          </div>

          {briefing && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 text-xs font-semibold rounded-xl flex items-center gap-2 transition shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة / حفظ PDF</span>
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition shadow-lg shadow-indigo-600/30"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ بنجاح' : 'نسخ المذكرة'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Generator Controls Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>تخصيص معطيات مذكرة الإحاطة الرسمية</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Recipient */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              الصفة الرسمية للموجّه إليه:
            </label>
            <input
              type="text"
              value={recipientTitle}
              onChange={(e) => setRecipientTitle(e.target.value)}
              placeholder="مثال: معالي وزير التجارة والاستثمار"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs md:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Urgency */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              درجة التصنيف والأولوية:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUrgencyLevel('strategic')}
                className={`py-2 text-xs font-semibold rounded-xl border transition ${
                  urgencyLevel === 'strategic'
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-400 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                استراتيجي تنفيذي
              </button>
              <button
                type="button"
                onClick={() => setUrgencyLevel('urgent_crisis')}
                className={`py-2 text-xs font-semibold rounded-xl border transition ${
                  urgencyLevel === 'urgent_crisis'
                    ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-400 text-rose-700 dark:text-rose-300 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                سري للغاية وعاجل
              </button>
              <button
                type="button"
                onClick={() => setUrgencyLevel('routine')}
                className={`py-2 text-xs font-semibold rounded-xl border transition ${
                  urgencyLevel === 'routine'
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 text-emerald-700 dark:text-emerald-300 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                إحاطة دورية
              </button>
            </div>
          </div>
        </div>

        {/* Selected Countries */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>الدول العربية المشمولة في نطاق المذكرة:</span>
            <span className="text-[11px] text-slate-500 font-normal">
              تم تحديد ({selectedCountries.length}) دول
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_COUNTRIES.map((c) => {
              const isSelected = selectedCountries.includes(c.code);
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => toggleCountry(c.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.name_ar}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Focus Domains */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            محاور التركيز الاستراتيجي:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {DOMAINS_LIST.map((domain) => {
              const isSelected = selectedDomains.includes(domain.id);
              return (
                <div
                  key={domain.id}
                  onClick={() => toggleDomain(domain.id)}
                  className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-600 text-indigo-900 dark:text-indigo-200'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>{domain.label}</span>
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            onClick={generateBriefing}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 hover:from-indigo-500 hover:to-slate-800 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
          >
            <FileText className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'جارٍ صياغة المذكرة الاستراتيجية...' : 'توليد مذكرة الإحاطة الوزارية والتنفيذية'}</span>
          </button>
        </div>
      </div>

      {/* Generated Dossier Preview (Printable Section) */}
      {briefing && (
        <div
          id="official-briefing-dossier"
          className="bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl space-y-8 print:p-0 print:border-none print:shadow-none"
        >
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-800 dark:border-slate-700 pb-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black tracking-widest text-slate-400 uppercase">
                  DARB INTELLIGENCE MEMORANDUM // مرصد دارب للدراسات الاستراتيجية
                </div>
                <h1 className="text-xl md:text-2xl font-black text-slate-950 dark:text-white mt-1">
                  مذكرة إحاطة استراتيجية رسمية
                </h1>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                  الموجّه إليه: <strong className="text-slate-900 dark:text-slate-200">{briefing.recipient_title}</strong>
                </div>
              </div>

              <div className="text-right md:text-left space-y-1">
                <div className="inline-block px-3 py-1 rounded-md text-xs font-black bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800">
                  {briefing.classification_level}
                </div>
                <div className="text-[11px] font-mono text-slate-500">رقم الوثيقة: {briefing.document_id}</div>
                <div className="text-[11px] font-medium text-slate-500">{briefing.timestamp_formatted}</div>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>أولاً: الموجز التنفيذي ومسوغات الإحاطة</span>
            </h4>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-serif">
              {briefing.executive_summary_ar}
            </p>
          </div>

          {/* Section 2: Key Takeaways */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>ثانياً: النتائج والخلاصات الاستراتيجية الرفيعة</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {briefing.strategic_takeaways.map((takeaway, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{takeaway}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Country Risk & Investment Matrix */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>ثالثاً: مصفوفة تقييم الدول المشمولة ومؤشرات الثقة</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {briefing.country_assessments.map((ca) => (
                <div
                  key={ca.country_code}
                  className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                    <span className="text-lg">{ca.flag}</span>
                    <span>{ca.country_name_ar}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">تقييم المخاطر:</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{ca.risk_level_ar}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">آفاق الاستثمار:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{ca.investment_outlook_ar}</span>
                  </div>
                  {ca.critical_alert_ar && (
                    <div className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded border border-amber-200 dark:border-amber-900/50">
                      تنبيه: {ca.critical_alert_ar}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: SWOT Analysis */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>رابعاً: التحليل الرباعي الاستراتيجي الشامل (SWOT Analysis)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4">
                <h5 className="font-bold text-xs text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>نقاط القوة التنافسية (Strengths)</span>
                </h5>
                <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  {briefing.swot_analysis.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4">
                <h5 className="font-bold text-xs text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>نقاط الضعف والتحديات البنيوية (Weaknesses)</span>
                </h5>
                <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  {briefing.swot_analysis.weaknesses.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-4">
                <h5 className="font-bold text-xs text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>الفرص الاستثمارية والشراكات (Opportunities)</span>
                </h5>
                <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  {briefing.swot_analysis.opportunities.map((o, idx) => (
                    <li key={idx}>{o}</li>
                  ))}
                </ul>
              </div>

              {/* Threats */}
              <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50 rounded-2xl p-4">
                <h5 className="font-bold text-xs text-rose-800 dark:text-rose-300 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>التهديدات الجيوسياسية ومخاطر السوق (Threats)</span>
                </h5>
                <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  {briefing.swot_analysis.threats.map((th, idx) => (
                    <li key={idx}>{th}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5: Recommended Action Roadmap */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>خامساً: خارطة طريق التدخل التنفيذي والتحوط الزمني</span>
            </h4>
            <div className="space-y-3">
              {briefing.recommended_action_roadmap.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-700 dark:text-indigo-400">
                      {step.timeline_ar} — {step.action_title_ar}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      المسؤولية: {step.owner_stakeholders_ar}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed pr-2">
                    {step.details_ar}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Synthesis & Seal */}
          <div className="pt-6 border-t-2 border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-slate-600 dark:text-slate-400">
            <div className="space-y-1 max-w-2xl font-serif">
              <strong className="text-slate-900 dark:text-white block font-sans">
                اعتماد مرصد دارب للدراسات الاستراتيجية:
              </strong>
              <p className="leading-relaxed">{briefing.darb_synthesis_statement}</p>
            </div>

            <div className="text-center border-2 border-dashed border-slate-300 dark:border-slate-700 px-6 py-4 rounded-2xl shrink-0">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">ختم الاعتماد الرقمي</div>
              <div className="font-mono text-[10px] text-slate-400 mt-1">DARB-VERIFIED-AUTH</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">✓ موثق ومعتمد رسمياً</div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="print:hidden pt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة المذكرة / تصدير PDF</span>
            </button>

            {onConsultAI && (
              <button
                onClick={() =>
                  onConsultAI(
                    `قم بإجراء مناقشة استشارية معمقة حول مذكرة الإحاطة رقم (${briefing.document_id})، والموجهة إلى (${briefing.recipient_title})، مع اقتراح أسئلة استجوابية وإجراءات وقائية فورية.`
                  )
                }
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>جلسة إحاطة افتراضية عبر الذكاء الاصطناعي</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
