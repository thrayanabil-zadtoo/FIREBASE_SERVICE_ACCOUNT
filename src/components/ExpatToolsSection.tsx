import React, { useState } from 'react';
import { 
  CheckSquare, 
  Calculator, 
  Bot, 
  Bell, 
  Sparkles, 
  ArrowLeftRight, 
  Home, 
  Utensils, 
  Car, 
  Wifi, 
  FileText, 
  CheckCircle2, 
  Send,
  ExternalLink,
  ShieldCheck,
  Plane,
  Train,
  Moon,
  Coins,
  Luggage,
  ShieldAlert,
  Scale
} from 'lucide-react';
import { Country } from '../types';
import { fetchApi } from '../api';
import TravelerInteractiveSuite from './TravelerInteractiveSuite';

interface ExpatToolsSectionProps {
  countries: Country[];
  onNavigateToCountry?: (countryCode: string) => void;
  defaultSubTab?: 'visa' | 'transit' | 'halal' | 'budget' | 'packing' | 'emergency' | 'comparator' | 'checklist' | 'calculator' | 'ai' | 'alerts';
}

export default function ExpatToolsSection({ countries, onNavigateToCountry, defaultSubTab = 'visa' }: ExpatToolsSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'visa' | 'transit' | 'halal' | 'budget' | 'packing' | 'emergency' | 'comparator' | 'checklist' | 'calculator' | 'ai' | 'alerts'>(defaultSubTab);

  // Moving Checklist State
  const initialTasks = [
    { id: 1, title: 'استخراج جواز سفر ساري المفعول (أكثر من 6 أشهر)', category: 'الأوراق والمستندات', completed: true },
    { id: 2, title: 'تصديق الشهادات والوثائق من وزارة التعليم والخارجية', category: 'الأوراق والمستندات', completed: true },
    { id: 3, title: 'الفحص الطبي المعتمد للسفر وتطعيمات الوجهة', category: 'الفحص والإجراءات', completed: false },
    { id: 4, title: 'ترجمة العقود والوثائق الشخصية للإنجليزية عند الحاجة', category: 'الأوراق والمستندات', completed: false },
    { id: 5, title: 'البحث عن سكن مبدئي أو فندق للأيام الأولى', category: 'السكن والاستقرار', completed: false },
    { id: 6, title: 'شراء شريحة اتصال محلية فور الوصول للمطار', category: 'الاتصالات والمال', completed: false },
    { id: 7, title: 'فتح حساب بنكي وإصدار بطاقة إقامة أو بطاقة ضريبية', category: 'الاتصالات والمال', completed: false },
    { id: 8, title: 'الاشتراك في التأمين الصحي المحلي المناسب للوافد', category: 'الفحص والإجراءات', completed: false },
  ];
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  // Cost Calculator State
  const [fromCity, setFromCity] = useState('غزة');
  const [toCity, setToCity] = useState('القاهرة');
  const [familySize, setFamilySize] = useState<'single' | 'couple' | 'family'>('single');

  // Multiplier based on destination and family size
  const getEstimatedCosts = () => {
    const baseRent = toCity === 'القاهرة' ? 220 : toCity === 'الرياض' ? 650 : toCity === 'دبي' ? 1100 : 350;
    const baseFood = toCity === 'القاهرة' ? 140 : toCity === 'الرياض' ? 300 : toCity === 'دبي' ? 450 : 200;
    const baseTransport = toCity === 'القاهرة' ? 45 : toCity === 'الرياض' ? 120 : toCity === 'دبي' ? 160 : 70;
    const baseInternet = toCity === 'القاهرة' ? 20 : toCity === 'الرياض' ? 55 : toCity === 'دبي' ? 75 : 35;
    
    const factor = familySize === 'single' ? 1 : familySize === 'couple' ? 1.6 : 2.4;
    return {
      rent: Math.round(baseRent * factor),
      food: Math.round(baseFood * factor),
      transport: Math.round(baseTransport * factor),
      internet: Math.round(baseInternet),
      total: Math.round((baseRent + baseFood + baseTransport) * factor + baseInternet),
    };
  };

  const costs = getEstimatedCosts();

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'assistant' | 'user'; text: string; queryContext?: string }>>([
    {
      role: 'assistant',
      text: 'أهلاً بك في مساعد دَرْب الذكي للمغتربين! أسأل أولاً داخل معلومات دَرْب (الدول، المدن، الوظائف، والخدمات). وإذا لم تكن المعلومات كافية، أقترح عليك فوراً البحث في الإنترنت للحصول على تفاصيل أحدث.',
    },
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAiSend = (queryText?: string) => {
    const textToSend = queryText || aiPrompt;
    if (!textToSend.trim()) return;

    const newMsgs = [...messages, { role: 'user' as const, text: textToSend }];
    setMessages(newMsgs);
    setAiPrompt('');
    setAiLoading(true);

    setTimeout(() => {
      let answer = '';
      if (textToSend.includes('شهادة') || textToSend.includes('تصديق')) {
        answer = 'لتصديق الشهادات: 1) تصديق الشهادة من الجامعة المعنية أولاً، 2) ختم وزارة التعليم العالي والبحث العلمي، 3) ختم وزارة الخارجية في بلد الإصدار، 4) تصديق قنصلية أو سفارة بلد المقصد. ننصح بعمل 3 نسخ طبق الأصل مصدقة قبل السفر.';
      } else if (textToSend.includes('سكن') || textToSend.includes('القاهرة')) {
        answer = 'في القاهرة: للمغتربين والعائلات، يُفضل البحث في مناطق مثل (المعادي، التجمع الخامس، الشيخ زايد، الدقي، مدينة نصر). تأكد من كتابة عقد إيجار موثق بالشهر العقاري، ودفع عدادات الخدمات (الكهرباء والمياه) ومطابقة الهوية مع المالك.';
      } else if (textToSend.includes('فيزا') || textToSend.includes('إقامة') || textToSend.includes('الخليج')) {
        answer = 'الإقامات والعمل في دول الخليج تتطلب عادة عقد عمل مصدق، كشف طبي (جامكا)، وبصمة وتأمين طبي معتمد. وفرنا في دَرْب دليلاً مخصصاً لكل دولة يمكنك تصفحه عبر تبويب "اكتشف الدول".';
      } else {
        answer = `إجابة ذكية حول "${textToSend}": سأبدأ أولاً بمعلومات دَرْب المتاحة عن الدول والمدن والوظائف والخدمات. يفضل التأكد من توافق المستندات مع اشتراطات الدولة المستقبلة. إذا كنت بحاجة لمعلومات أوسع، يمكنك البحث عبر الإنترنت مباشرة.`;
      }

      setMessages([...newMsgs, { role: 'assistant', text: answer, queryContext: textToSend }]);
      setAiLoading(false);
    }, 600);
  };

  // Job Alert State
  const [alertKeyword, setAlertKeyword] = useState('');
  const [alertChannel, setAlertChannel] = useState('email');
  const [alertTarget, setAlertTarget] = useState('');
  const [alertSubmitted, setAlertSubmitted] = useState(false);
  const [alertSaving, setAlertSaving] = useState(false);

  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTarget) return;

    setAlertSaving(true);
    await fetchApi('/job-alerts', {
      method: 'POST',
      body: JSON.stringify({
        keyword: alertKeyword || 'جميع الوظائف',
        channel: alertChannel,
      }),
    });
    setAlertSaving(false);
    setAlertSubmitted(true);
    setTimeout(() => setAlertSubmitted(false), 5000);
  };

  return (
    <div id="darb-expat-tools-module" className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-[#071a2b] via-[#09293e] to-[#071d2c] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#16344d] text-[#8be4d4] border border-[#1bb49e]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#46d0bc]" />
            <span>حقيبة وأدوات المسافر والمقيم التفاعلية • Expat & Traveler Suite</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            حقيبة وأدوات المسافر والمغترب الذكية
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            منظومة متكاملة لفحص متطلبات التأشيرة المباشرة حسب الجواز العربي، دليل بطاقات المترو والقطارات السريعة، دليل الحلال والمساجد، محول العملات وميزانية السفر، ومخطط حقيبة السفر وجواز الطوارئ.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex flex-wrap gap-1.5 bg-[#05131f] p-1.5 rounded-2xl border border-white/10">
          {[
            { id: 'visa', label: 'فاحص التأشيرات', icon: Plane },
            { id: 'transit', label: 'المترو والقطارات', icon: Train },
            { id: 'halal', label: 'الحلال والمساجد', icon: Moon },
            { id: 'budget', label: 'العملات والميزانية', icon: Coins },
            { id: 'packing', label: 'مخطط الحقيبة', icon: Luggage },
            { id: 'emergency', label: 'جواز الطوارئ', icon: ShieldAlert },
            { id: 'comparator', label: 'مقارن الوجهات', icon: Scale },
            { id: 'checklist', label: 'قائمة الانتقال', icon: CheckSquare },
            { id: 'calculator', label: 'حاسبة المعيشة', icon: Calculator },
            { id: 'ai', label: 'مساعد دَرْب', icon: Bot },
            { id: 'alerts', label: 'تنبيهات الفرص', icon: Bell },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`btn-tool-tab-${tab.id}`}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#1bb49e] text-white shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Suite Tabs (Visa, Transit, Halal, Budget, Packing, Emergency, Comparator) */}
      {(activeSubTab === 'visa' || activeSubTab === 'transit' || activeSubTab === 'halal' || activeSubTab === 'budget' || activeSubTab === 'packing' || activeSubTab === 'emergency' || activeSubTab === 'comparator') && (
        <TravelerInteractiveSuite 
          initialActiveModule={activeSubTab} 
          onNavigateToCountry={onNavigateToCountry}
        />
      )}

      {/* Tab 1: Moving Checklist */}
      {activeSubTab === 'checklist' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-[#1bb49e]" />
                <span>قائمة مهام الانتقال والسفر (Relocation Checklist)</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                تأكد من إتمام هذه الخطوات الأساسية لتجنب أي عوائق في المطار أو أثناء المعاملات في بلدك الجديد.
              </p>
            </div>

            {/* Progress Display */}
            <div className="flex items-center gap-3 bg-stone-50 px-4 py-2.5 rounded-2xl border border-stone-200">
              <div className="w-24 bg-stone-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#1bb49e] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-bold text-stone-800 font-mono">
                {progressPercent}% مكتمل
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map(task => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                  task.completed
                    ? 'bg-emerald-50/50 border-emerald-200/80 text-stone-800'
                    : 'bg-white border-stone-200 hover:border-[#1bb49e]/50 text-stone-700'
                }`}
              >
                <div className="mt-0.5">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-[#1bb49e] focus:ring-[#1bb49e] cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    task.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {task.category}
                  </span>
                  <p className={`text-sm font-medium leading-relaxed ${task.completed ? 'line-through text-stone-400' : ''}`}>
                    {task.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#071a2b] text-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#46d0bc]" />
              <span>يتم حفظ تقدمك تلقائياً في متصفحك ويمكنك الرجوع إليه لاحقاً.</span>
            </div>
            <button
              onClick={() => setTasks(initialTasks)}
              className="text-stone-300 hover:text-white underline cursor-pointer"
            >
              إعادة ضبط القائمة
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Cost of Living Calculator */}
      {activeSubTab === 'calculator' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#1bb49e]" />
              <span>حاسبة تكلفة المعيشة التقديرية (Cost of Living Calculator)</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              قارن بين نفقات السكن، الغذاء، والمواصلات الأساسية بين وجهتك الحالية والمدينة التي تنوي الانتقال إليها.
            </p>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-50 p-5 rounded-2xl border border-stone-200">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">مدينة الانطلاق (من)</label>
              <input
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1bb49e]"
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-bold text-stone-700 mb-1.5">مدينة الوصول (إلى)</label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1bb49e]"
              >
                <option value="القاهرة">القاهرة (مصر)</option>
                <option value="الرياض">الرياض (السعودية)</option>
                <option value="دبي">دبي (الإمارات)</option>
                <option value="عَمّان">عَمّان (الأردن)</option>
                <option value="الدوحة">الدوحة (قطر)</option>
                <option value="الدار البيضاء">الدار البيضاء (المغرب)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">حجم المعيشة</label>
              <select
                value={familySize}
                onChange={(e) => setFamilySize(e.target.value as any)}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1bb49e]"
              >
                <option value="single">فرد واحد (مستقل)</option>
                <option value="couple">زوجين (شخصان)</option>
                <option value="family">عائلة (4 أفراد)</option>
              </select>
            </div>
          </div>

          {/* Results Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-stone-500 text-xs font-bold">
                <Home className="w-4 h-4 text-[#1bb49e]" />
                <span>إيجار السكن الشهري</span>
              </div>
              <p className="text-2xl font-black text-stone-900 font-mono">
                ~${costs.rent} <span className="text-xs font-normal text-stone-500">/ شهر</span>
              </p>
              <p className="text-[11px] text-stone-400">شقة متوسطة في حي مناسب للوافدين</p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-stone-500 text-xs font-bold">
                <Utensils className="w-4 h-4 text-[#1bb49e]" />
                <span>الطعام والمواد التموينية</span>
              </div>
              <p className="text-2xl font-black text-stone-900 font-mono">
                ~${costs.food} <span className="text-xs font-normal text-stone-500">/ شهر</span>
              </p>
              <p className="text-[11px] text-stone-400">تسوق منزلي وغذاء يومي متوازن</p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-stone-500 text-xs font-bold">
                <Car className="w-4 h-4 text-[#1bb49e]" />
                <span>المواصلات والتنقل</span>
              </div>
              <p className="text-2xl font-black text-stone-900 font-mono">
                ~${costs.transport} <span className="text-xs font-normal text-stone-500">/ شهر</span>
              </p>
              <p className="text-[11px] text-stone-400">مواصلات عامة، مترو وتطبيقات النقل</p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-stone-500 text-xs font-bold">
                <Wifi className="w-4 h-4 text-[#1bb49e]" />
                <span>الإنترنت والاتصالات</span>
              </div>
              <p className="text-2xl font-black text-stone-900 font-mono">
                ~${costs.internet} <span className="text-xs font-normal text-stone-500">/ شهر</span>
              </p>
              <p className="text-[11px] text-stone-400">إنترنت منزلي فايبر وشريحة اتصال</p>
            </div>
          </div>

          {/* Total Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#071a2b] to-[#12364e] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#8be4d4] font-semibold">إجمالي الميزانية التقديرية شهرياً</span>
              <h3 className="text-xl font-bold mt-1">
                من {fromCity} إلى {toCity}
              </h3>
            </div>
            <div className="text-left">
              <span className="text-3xl font-black text-[#46d0bc] font-mono">
                ~${costs.total}
              </span>
              <span className="text-xs text-stone-300 block font-sans">
                دولار أمريكي شهرياً (تقريبي)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: DARB AI Assistant */}
      {activeSubTab === 'ai' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1bb49e]/10 text-[#169b88] mb-2">
                <Bot className="w-3.5 h-3.5" />
                <span>دَرْب AI • المساعد الذكي</span>
              </div>
              <h2 className="text-xl font-bold text-stone-900">
                مساعد دَرْب الذكي للمغتربين
              </h2>
              <p className="text-xs text-stone-500">
                واجهة استشارية فورية تفهم استفسارات السفر، إجراءات التأشيرات، وقوانين الإقامة والعمل في الدول العربية.
              </p>
            </div>

            <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-stone-100 text-stone-600 border border-stone-200 self-start">
              <span>جاهز للربط مع LLM</span>
            </div>
          </div>

          {/* Suggested Prompts */}
          <div className="flex flex-wrap gap-2">
            {[
              'ما هي خطوات تصديق الشهادة للعمل في السعودية؟',
              'أفضل مناطق السكن العائلية الهادئة في القاهرة؟',
              'ما تكلفة المعيشة التقريبية لأسرة في الرياض؟',
              'كيفية استئجار مساحة عمل في رام الله؟',
            ].map(p => (
              <button
                key={p}
                onClick={() => handleAiSend(p)}
                className="text-xs bg-stone-100 hover:bg-[#1bb49e]/10 hover:text-[#169b88] text-stone-700 px-3 py-1.5 rounded-full border border-stone-200 transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="space-y-4 max-h-[380px] overflow-y-auto p-4 rounded-2xl bg-stone-50 border border-stone-200">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-sm leading-relaxed ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-[#071a2b] text-[#8be4d4] flex items-center justify-center shrink-0 text-xs font-bold">
                    دَرْب
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl max-w-xl ${
                    m.role === 'user'
                      ? 'bg-[#1bb49e] text-white rounded-tl-none font-medium'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-tr-none shadow-xs space-y-2'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.role === 'assistant' && m.queryContext && (
                    <div className="pt-2 border-t border-stone-100 mt-2">
                      <button
                        onClick={() => window.open('https://www.google.com/search?q=' + encodeURIComponent(m.queryContext!), '_blank')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-stone-700 bg-stone-100 hover:bg-[#1bb49e]/10 hover:text-[#169b88] transition-colors cursor-pointer"
                      >
                        <span>🔎 إذا لم تكفِ الإجابة — ابحث في الإنترنت</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="flex gap-2 items-center text-xs text-stone-500 p-2">
                <div className="w-4 h-4 border-2 border-[#1bb49e] border-t-transparent rounded-full animate-spin" />
                <span>دَرْب AI يحلل السؤال ويبحث في أدلة الدول...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="flex gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
              placeholder="اكتب استفسارك هنا (مثال: متطلبات تأشيرة العمل، أرخص وسائل النقل، الأحياء السكنية...)"
              className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1bb49e]"
            />
            <button
              id="btn-ai-send"
              onClick={() => handleAiSend()}
              className="px-6 py-3 rounded-2xl bg-[#1bb49e] hover:bg-[#169b88] text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>إرسال</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Job Alerts */}
      {activeSubTab === 'alerts' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#1bb49e]" />
              <span>خدمة تنبيهات الوظائف والفرص الجديدة</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              لا تفوت أي فرصة عمل تناسب تخصصك، استلم إشعاراً فورياً على بريدك الإلكتروني أو تيليجرام بمجرد نشر وظيفة تطابق اهتماماتك.
            </p>
          </div>

          {alertSubmitted && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">تم تفعيل التنبيه بنجاح!</p>
                <p className="text-xs text-emerald-700 mt-0.5">ستصلك إشعارات بالفرص الجديدة التي تطابق مجالك فور نشرها من قبل الشركات.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleAlertSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">الكلمة المفتاحية / المسمى الوظيفي</label>
              <input
                type="text"
                value={alertKeyword}
                onChange={(e) => setAlertKeyword(e.target.value)}
                placeholder="مثال: مطور برمجيات، محاسب، مدرس، مهندس مدني..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1bb49e]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">قناة الإشعار المفضلة</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAlertChannel('email')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    alertChannel === 'email'
                      ? 'bg-[#1bb49e]/10 border-[#1bb49e] text-[#169b88]'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  <span>✉ البريد الإلكتروني</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAlertChannel('telegram')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    alertChannel === 'telegram'
                      ? 'bg-[#1bb49e]/10 border-[#1bb49e] text-[#169b88]'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  <span>✈ تيليجرام (Telegram)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {alertChannel === 'email' ? 'عنوان البريد الإلكتروني *' : 'معرف تيليجرام (@username) *'}
              </label>
              <input
                type="text"
                required
                value={alertTarget}
                onChange={(e) => setAlertTarget(e.target.value)}
                placeholder={alertChannel === 'email' ? 'name@domain.com' : '@myusername'}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1bb49e]"
              />
            </div>

            <button
              id="btn-save-job-alert"
              type="submit"
              disabled={alertSaving}
              className="px-6 py-3 rounded-xl bg-[#1bb49e] hover:bg-[#169b88] text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Bell className="w-4 h-4" />
              <span>{alertSaving ? 'جاري التفعيل...' : 'تفعيل التنبيه المجاني'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
