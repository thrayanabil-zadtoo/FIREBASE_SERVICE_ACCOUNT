import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Search, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw, 
  FileText, 
  Filter, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  PhoneCall, 
  Building2, 
  Plane, 
  Briefcase, 
  Home, 
  Wifi, 
  HeartPulse, 
  Compass, 
  DollarSign, 
  BookOpen, 
  Send
} from 'lucide-react';
import { 
  DarbKnowledgeCountry, 
  DarbKnowledgeFact, 
  KnowledgeCategory 
} from '../types/darb-global-knowledge';

interface CategoryInfo {
  id: KnowledgeCategory;
  name_ar: string;
  name_en: string;
  description: string;
}

export default function DarbGlobalKnowledgeExplorer() {
  const [countries, setCountries] = useState<DarbKnowledgeCountry[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>('EG');
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [facts, setFacts] = useState<DarbKnowledgeFact[]>([]);
  const [countryDetails, setCountryDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshModalFact, setRefreshModalFact] = useState<DarbKnowledgeFact | null>(null);
  const [refreshReason, setRefreshReason] = useState<string>('');
  const [refreshSubmitting, setRefreshSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load countries and categories
  useEffect(() => {
    async function loadMeta() {
      try {
        const [cRes, catRes] = await Promise.all([
          fetch('/api/knowledge/countries'),
          fetch('/api/knowledge/categories')
        ]);
        if (cRes.ok) {
          const cData = await cRes.json();
          setCountries(cData.data || []);
        }
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }
      } catch (err) {
        console.warn('[GKE Explorer] Meta load error:', err);
      }
    }
    loadMeta();
  }, []);

  // Load selected country details and facts
  useEffect(() => {
    if (!selectedCountryId) return;
    async function loadCountryFacts() {
      setLoading(true);
      try {
        const res = await fetch(`/api/knowledge/countries/${selectedCountryId}`);
        if (res.ok) {
          const data = await res.json();
          setCountryDetails(data.country);
          setFacts(data.facts || []);
        }
      } catch (err) {
        console.warn('[GKE Explorer] Facts load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCountryFacts();
  }, [selectedCountryId]);

  // Filter facts based on category and search query
  const filteredFacts = facts.filter((f) => {
    if (selectedCategory !== 'all' && f.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const subjectMatch = f.subject.toLowerCase().includes(q);
      const valMatch = JSON.stringify(f.value).toLowerCase().includes(q);
      const sourceMatch = (f.sourceName || '').toLowerCase().includes(q);
      return subjectMatch || valMatch || sourceMatch;
    }
    return true;
  });

  const handleRequestRefresh = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refreshModalFact) return;
    setRefreshSubmitting(true);
    try {
      const res = await fetch(`/api/knowledge/facts/${refreshModalFact.factId}/refresh-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: refreshReason || 'طلب مراجعة وتحديث دوري من المستخدم',
          requestedBy: 'مستخدم المنصة',
          priority: 'normal'
        })
      });
      if (res.ok) {
        setToastMessage('✅ تم إدراج طلب التحديث بنجاح في طابور المراجعة والتحقق البشري');
        setRefreshModalFact(null);
        setRefreshReason('');
        setTimeout(() => setToastMessage(null), 5000);
      }
    } catch (err) {
      console.warn('[GKE] Refresh request error:', err);
    } finally {
      setRefreshSubmitting(false);
    }
  };

  const currentCountryObj = countries.find(c => c.country_id === selectedCountryId);

  return (
    <div id="darb-global-knowledge-explorer" className="space-y-6">
      
      {/* Engine Banner */}
      <div className="bg-gradient-to-l from-[#071a2b] via-[#0b2b41] to-[#071d2c] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#16344d] text-[#8be4d4] border border-[#1bb49e]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#46d0bc]" />
            <span>محرك المعرفة الشامل للدول العربية (Global Knowledge Engine V1)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            دليل المعرفة المنظم والموثق لـ 22 دولة عربية
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            بيانات موثوقة من المصادر الرسمية والوزارات مع إثبات المصدر وتاريخ التحقق وشارات النضارة الزمنية. لا اختلاق للبيانات المرجعية (Auto Publish = OFF).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] text-stone-300 block">الدول المشمولة</span>
            <span className="text-xl font-black text-[#8be4d4]">22 دولة</span>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] text-stone-300 block">محاور موحدة</span>
            <span className="text-xl font-black text-amber-400">19 محوراً</span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-fadeIn">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">✕</button>
        </div>
      )}

      {/* Country Selector Carousel / Grid */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-[#1bb49e]" />
            <h3 className="text-sm font-bold text-stone-900">اختر الدولة العربية للاستكشاف</h3>
          </div>
          <span className="text-[11px] text-stone-400 font-medium">({countries.length} دولة نشطة)</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-300">
          {countries.map((c) => {
            const isSelected = c.country_id === selectedCountryId;
            return (
              <button
                key={c.country_id}
                onClick={() => {
                  setSelectedCountryId(c.country_id);
                  setSelectedCategory('all');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-[#1bb49e] text-white border-[#1bb49e] shadow-xs scale-[1.02]'
                    : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                }`}
              >
                <span className="text-base">{c.flag || '🏳️'}</span>
                <span>{c.country_name_ar}</span>
                {c.facts_count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {c.facts_count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Country Identity Header */}
      {countryDetails && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-2 bg-stone-50 rounded-2xl border border-stone-100">
              {currentCountryObj?.flag || '🏳️'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-900">{countryDetails.country_name_ar}</h2>
                <span className="text-xs font-mono text-stone-400">({countryDetails.country_id})</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  {countryDetails.status === 'active' ? 'دليل موثق' : countryDetails.status}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {countryDetails.country_name_en} • العاصمة: <strong className="text-stone-800">{countryDetails.capital}</strong> • العملة: <strong className="text-stone-800">{countryDetails.currency}</strong> • التوقيت: <strong className="text-stone-800">{countryDetails.timezone}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="text-right">
              <span className="text-[10px] text-stone-400 block">آخر تحقق رسمي</span>
              <span className="text-xs font-bold text-stone-700">
                {countryDetails.verified_at ? countryDetails.verified_at.split('T')[0] : 'محدث'}
              </span>
            </div>
            <div className="h-6 w-px bg-stone-200 mx-1" />
            <div className="text-right">
              <span className="text-[10px] text-stone-400 block">إجمالي الحقائق المعتمدة</span>
              <span className="text-xs font-bold text-[#1bb49e]">{facts.length} محور</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في شروط التأشيرة، السكن، العمل، أرقام الطوارئ، الرعاية الصحية..."
              className="w-full pr-10 pl-4 py-2 text-xs border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#1bb49e] bg-stone-50/50"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-stone-500 hover:text-stone-800 px-2 py-1 cursor-pointer"
            >
              مسح البحث
            </button>
          )}
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-stone-300">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            جميع المحاور ({facts.length})
          </button>
          {categories.map((cat) => {
            const count = facts.filter(f => f.category === cat.id).length;
            const isCatSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isCatSelected
                    ? 'bg-[#1bb49e] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{cat.name_ar}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isCatSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Facts Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="w-8 h-8 border-3 border-[#1bb49e] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-stone-500">جاري تحميل المعرفة المنظمة للدولة...</p>
        </div>
      ) : filteredFacts.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center space-y-3">
          <Info className="w-8 h-8 text-stone-400 mx-auto" />
          <h4 className="text-sm font-bold text-stone-800">لا توجد حقائق مطابقة لمعايير البحث في هذه الدولة</h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            يمكنك مسح كلمات البحث أو اختيار محور آخر لاستعراض البيانات المعتمدة رسمياً.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFacts.map((fact) => {
            const categoryMeta = categories.find(c => c.id === fact.category);
            const isFresh = fact.freshnessStatus === 'fresh';
            const isAging = fact.freshnessStatus === 'aging';
            const isStale = fact.freshnessStatus === 'stale';

            return (
              <div
                key={fact.factId}
                id={`fact-card-${fact.factId}`}
                className="bg-white border border-stone-200 hover:border-[#1bb49e] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  
                  {/* Card Header: Category & Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-[#1bb49e] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {categoryMeta?.name_ar || fact.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Freshness Badge */}
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${
                        isFresh 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : isAging 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        <Clock className="w-2.5 h-2.5" />
                        <span>{isFresh ? 'طازج / حديث' : isAging ? 'متقادم' : 'منتهي الصلاحية'}</span>
                      </span>

                      {/* Confidence Badge */}
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-semibold">
                        ثقة: {fact.confidenceLevel === 'high' ? 'عالية' : fact.confidenceLevel === 'medium' ? 'متوسطة' : 'محدودة'}
                      </span>
                    </div>
                  </div>

                  {/* Fact Subject Title */}
                  <h3 className="font-bold text-stone-900 text-sm leading-snug">
                    {fact.subject}
                  </h3>

                  {/* Fact Content Render */}
                  <div className="bg-stone-50/70 border border-stone-100 rounded-xl p-3 text-xs text-stone-700 space-y-1.5 leading-relaxed">
                    {typeof fact.value === 'object' && fact.value !== null ? (
                      <div className="space-y-1.5">
                        {Object.entries(fact.value).map(([key, val]) => (
                          <div key={key} className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 border-b border-stone-200/50 pb-1 last:border-0 last:pb-0">
                            <span className="text-stone-500 font-medium text-[11px] shrink-0 sm:max-w-[140px]">
                              {key}:
                            </span>
                            <span className="font-semibold text-stone-800 text-left sm:text-right">
                              {Array.isArray(val) ? val.join('، ') : String(val)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-stone-800 font-medium">{String(fact.value)}</p>
                    )}
                  </div>

                  {/* Disclaimer for exchange rates or housing */}
                  {(fact.category === 'exchange_rate' || fact.category === 'housing' || fact.category === 'hotels') && (
                    <div className="flex items-start gap-1.5 text-[10px] text-amber-700 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>الأرقام استرشادية مرجعية وليست أسعار حية فورية، تخضع للمراجعة والتقلبات السوقية.</span>
                    </div>
                  )}

                </div>

                {/* Card Footer: Source Provenance & Refresh Request */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1bb49e]" />
                    <span className="truncate max-w-[160px] sm:max-w-[200px]" title={fact.sourceName || ''}>
                      {fact.sourceName || 'دليل دَرْب المطور'}
                    </span>
                    {fact.sourceUrl && (
                      <a 
                        href={fact.sourceUrl} 
                        target="_blank" 
                        rel="noreferrer noopener" 
                        className="text-[#1bb49e] hover:underline"
                        title="زيارة المصدر المعتمد"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-400">
                      {fact.verifiedAt ? fact.verifiedAt.split('T')[0] : ''}
                    </span>
                    <button
                      onClick={() => setRefreshModalFact(fact)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500 hover:text-[#1bb49e] p-1 rounded-md hover:bg-stone-100 cursor-pointer transition-colors"
                      title="طلب تدقيق أو تحديث هذه المعلومة"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>تحديث</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Request Fact Refresh */}
      {refreshModalFact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl border border-stone-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#1bb49e]" />
                <h3 className="text-sm font-bold text-stone-900">طلب تدقيق وتحديث معلومة</h3>
              </div>
              <button 
                onClick={() => setRefreshModalFact(null)} 
                className="text-stone-400 hover:text-stone-700 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[10px] text-stone-400 block font-mono">رقم المعلومة: {refreshModalFact.factId}</span>
              <p className="font-bold text-stone-800">{refreshModalFact.subject}</p>
              <p className="text-stone-500 text-[11px]">
                سيتم إدراج هذا الطلب في طابور المراجعة والتحقق البشري لتدقيق البيانات من مصادرها الرسمية وتحديث تاريخ التحقق. (Auto Publish = OFF).
              </p>
            </div>

            <form onSubmit={handleRequestRefresh} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  سبب طلب التحديث أو الملاحظات:
                </label>
                <textarea
                  value={refreshReason}
                  onChange={(e) => setRefreshReason(e.target.value)}
                  placeholder="مثال: تغير رقم الطوارئ، أو تغير في رسوم التأشيرة في التحديث الأخير..."
                  rows={3}
                  className="w-full text-xs p-3 border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#1bb49e]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRefreshModalFact(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={refreshSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1bb49e] hover:bg-[#169b88] text-white shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {refreshSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>إرسال لطابور المراجعة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
