import { useState, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  ChevronLeft, 
  Search, 
  Layers, 
  Globe2,
  Building2,
  CheckCircle2,
  Plane,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Palmtree
} from 'lucide-react';
import { Country } from '../types';
import { ARAB_COUNTRIES_IMAGERY, CountryImagery, getCountryImagery, ALL_COUNTRIES_IMAGERY } from '../data/arab-countries-imagery';
import { SovereignEmptyState } from './SovereignVisuals';

interface HomeCountriesShowcaseProps {
  countries: Country[];
  onSelectCountry: (code: string) => void;
  onOpenAIWithPrompt: (prompt: string) => void;
  onExploreAll: () => void;
  onOpenTravelerSuite?: () => void;
}

type ScopeFilter = 'ALL' | 'ARAB' | 'EUROPE' | 'AMERICAS' | 'ASIA' | 'AFRICA';
type ArabRegionFilter = 'ALL' | 'GULF' | 'MASHREQ' | 'MAGHREB' | 'NILE' | 'HORN';
type SmartFeatureFilter = 'ALL' | 'VISA_EASY' | 'SCHENGEN' | 'STUDY' | 'TOURISM' | 'BUSINESS';

export default function HomeCountriesShowcase({
  countries,
  onSelectCountry,
  onOpenAIWithPrompt,
  onExploreAll,
  onOpenTravelerSuite,
}: HomeCountriesShowcaseProps) {
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>('ALL');
  const [arabRegion, setArabRegion] = useState<ArabRegionFilter>('ALL');
  const [smartFilter, setSmartFilter] = useState<SmartFeatureFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCards, setShowAllCards] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Merge API countries with rich imagery metadata
  const enrichedCountries = useMemo(() => {
    // If countries prop has items, use it, else fallback to all entries
    const list = countries.length > 0
      ? countries.map(c => {
          const img = getCountryImagery(c.code);
          const isArab = !!ARAB_COUNTRIES_IMAGERY[c.code];
          return {
            code: c.code,
            name_ar: c.name_ar || img.name_ar,
            name_en: c.name_en || img.name_en,
            description_ar: c.description_ar || img.tag_ar,
            is_arab: isArab,
            continent: isArab ? 'ARAB' : (img.continent || 'EUROPE'),
            imagery: img
          };
        })
      : Object.values(ALL_COUNTRIES_IMAGERY).map(img => {
          const isArab = !!ARAB_COUNTRIES_IMAGERY[img.country_code];
          return {
            code: img.country_code,
            name_ar: img.name_ar,
            name_en: img.name_en,
            description_ar: img.tag_ar,
            is_arab: isArab,
            continent: isArab ? 'ARAB' : (img.continent || 'EUROPE'),
            imagery: img
          };
        });

    return list;
  }, [countries]);

  const arabRegionFilterMap: Record<ArabRegionFilter, { label: string; filterFn: (code: string) => boolean }> = {
    ALL: { label: 'كل الـ 22 دولة', filterFn: () => true },
    GULF: { label: 'الخليج العربي', filterFn: (c) => ['SA', 'AE', 'QA', 'KW', 'BH', 'OM'].includes(c) },
    MASHREQ: { label: 'المشرق العربي', filterFn: (c) => ['PS', 'JO', 'LB', 'IQ', 'SY'].includes(c) },
    MAGHREB: { label: 'المغرب العربي', filterFn: (c) => ['MA', 'DZ', 'TN', 'LY', 'MR'].includes(c) },
    NILE: { label: 'وادي النيل والجزيرة', filterFn: (c) => ['EG', 'SD', 'YE'].includes(c) },
    HORN: { label: 'القرن والمحيط', filterFn: (c) => ['SO', 'DJ', 'KM'].includes(c) }
  };

  const filteredCountries = useMemo(() => {
    return enrichedCountries.filter(c => {
      // 1. Scope filter (Continent / Arab)
      if (scopeFilter === 'ARAB' && !c.is_arab) return false;
      if (scopeFilter === 'EUROPE' && (c.is_arab || c.continent !== 'EUROPE')) return false;
      if (scopeFilter === 'AMERICAS' && (c.is_arab || c.continent !== 'AMERICAS')) return false;
      if (scopeFilter === 'ASIA' && (c.is_arab || c.continent !== 'ASIA')) return false;
      if (scopeFilter === 'AFRICA' && (c.is_arab || c.continent !== 'AFRICA')) return false;

      // 2. Arab sub-region filter
      if (scopeFilter === 'ARAB' && arabRegion !== 'ALL') {
        if (!arabRegionFilterMap[arabRegion].filterFn(c.code)) return false;
      }

      // 3. Smart feature filter
      const img = c.imagery;
      if (smartFilter === 'VISA_EASY') {
        const isEasy = c.is_arab || img.visa_free_or_easy;
        if (!isEasy) return false;
      }
      if (smartFilter === 'SCHENGEN' && !img.schengen) return false;
      if (smartFilter === 'STUDY' && !img.study_hub) return false;
      if (smartFilter === 'TOURISM' && !img.tourism_hub) return false;
      if (smartFilter === 'BUSINESS' && !img.business_hub) return false;

      // 4. Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        c.name_ar.toLowerCase().includes(q) ||
        (c.name_en && c.name_en.toLowerCase().includes(q)) ||
        c.code.toLowerCase().includes(q) ||
        (img.capital_ar && img.capital_ar.toLowerCase().includes(q)) ||
        (img.landmark_name_ar && img.landmark_name_ar.toLowerCase().includes(q)) ||
        (img.region_ar && img.region_ar.toLowerCase().includes(q))
      );
    });
  }, [enrichedCountries, scopeFilter, arabRegion, smartFilter, searchQuery]);

  const displayedCountries = useMemo(() => {
    if (showAllCards || searchQuery.trim() || scopeFilter !== 'ALL' || smartFilter !== 'ALL') {
      return filteredCountries;
    }
    return filteredCountries.slice(0, 8);
  }, [filteredCountries, showAllCards, searchQuery, scopeFilter, smartFilter]);

  const handleImageError = (code: string) => {
    setImageErrors(prev => ({ ...prev, [code]: true }));
  };

  const getScopeCount = (scope: ScopeFilter) => {
    if (scope === 'ALL') return enrichedCountries.length;
    if (scope === 'ARAB') return enrichedCountries.filter(c => c.is_arab).length;
    return enrichedCountries.filter(c => !c.is_arab && c.continent === scope).length;
  };

  return (
    <section id="darb-home-destinations" className="space-y-6">
      
      {/* Section Header */}
      <div className="bg-gradient-to-r from-[#071a2b] via-[#0d2a42] to-[#071a2b] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-stone-800 relative overflow-hidden">
        {/* Subtle decorative background blur */}
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-[#1bb49e]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1bb49e]/20 text-[#8be4d4] border border-[#1bb49e]/30">
                <Globe2 className="w-3.5 h-3.5" />
                <span>دليل الوجهات العربية والعالمية المصوّر</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/10 text-stone-300">
                {enrichedCountries.length} دولة ووجهة عالمية
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-500/20 text-emerald-300 font-bold">
                22 دولة عربية + {enrichedCountries.filter(c => !c.is_arab).length} وجهة دولية
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              استكشف دول العالم بمعالمها، مدنها، وفرصها
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              دليل متكامل يربط العالم العربي بأبرز الوجهات العالمية في أوروبا، أمريكا، آسيا وإفريقيا: التأشيرات، المعالم، المعيشة، والفرص.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowAllCards(!showAllCards)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                showAllCards
                  ? 'bg-[#1bb49e] text-white shadow-emerald-900/30'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Layers className="w-4 h-4 text-[#8be4d4]" />
              <span>{showAllCards ? 'عرض مصغّر' : `عرض جميع الدول كاملة (${enrichedCountries.length}) ✦`}</span>
            </button>

            <button
              onClick={onExploreAll}
              className="px-4 py-2.5 rounded-xl bg-white text-[#071a2b] hover:bg-stone-100 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>المرصد والمقارنة الشاملة</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary Scope Tabs (Continents & Arab) */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => { setScopeFilter('ALL'); setArabRegion('ALL'); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                scopeFilter === 'ALL'
                  ? 'bg-[#1bb49e] text-white shadow-xs'
                  : 'bg-white/10 text-stone-300 hover:text-white hover:bg-white/15'
              }`}
            >
              <span>🌍 جميع الوجهات</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${scopeFilter === 'ALL' ? 'bg-black/20 text-white' : 'bg-black/30 text-stone-400'}`}>
                {getScopeCount('ALL')}
              </span>
            </button>

            <button
              onClick={() => setScopeFilter('ARAB')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                scopeFilter === 'ARAB'
                  ? 'bg-[#1bb49e] text-white shadow-xs'
                  : 'bg-white/10 text-stone-300 hover:text-white hover:bg-white/15'
              }`}
            >
              <span>🏛️ الدول العربية</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${scopeFilter === 'ARAB' ? 'bg-black/20 text-white' : 'bg-black/30 text-stone-400'}`}>
                {getScopeCount('ARAB')}
              </span>
            </button>

            <button
              onClick={() => { setScopeFilter('EUROPE'); setArabRegion('ALL'); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                scopeFilter === 'EUROPE'
                  ? 'bg-[#1bb49e] text-white shadow-xs'
                  : 'bg-white/10 text-stone-300 hover:text-white hover:bg-white/15'
              }`}
            >
              <span>🏰 أوروبا</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${scopeFilter === 'EUROPE' ? 'bg-black/20 text-white' : 'bg-black/30 text-stone-400'}`}>
                {getScopeCount('EUROPE')}
              </span>
            </button>

            <button
              onClick={() => { setScopeFilter('AMERICAS'); setArabRegion('ALL'); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                scopeFilter === 'AMERICAS'
                  ? 'bg-[#1bb49e] text-white shadow-xs'
                  : 'bg-white/10 text-stone-300 hover:text-white hover:bg-white/15'
              }`}
            >
              <span>🗽 الأمريكتان</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${scopeFilter === 'AMERICAS' ? 'bg-black/20 text-white' : 'bg-black/30 text-stone-400'}`}>
                {getScopeCount('AMERICAS')}
              </span>
            </button>

            <button
              onClick={() => { setScopeFilter('ASIA'); setArabRegion('ALL'); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                scopeFilter === 'ASIA'
                  ? 'bg-[#1bb49e] text-white shadow-xs'
                  : 'bg-white/10 text-stone-300 hover:text-white hover:bg-white/15'
              }`}
            >
              <span>⛩️ آسيا والمحيط</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${scopeFilter === 'ASIA' ? 'bg-black/20 text-white' : 'bg-black/30 text-stone-400'}`}>
                {getScopeCount('ASIA')}
              </span>
            </button>

            <button
              onClick={() => { setScopeFilter('AFRICA'); setArabRegion('ALL'); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                scopeFilter === 'AFRICA'
                  ? 'bg-[#1bb49e] text-white shadow-xs'
                  : 'bg-white/10 text-stone-300 hover:text-white hover:bg-white/15'
              }`}
            >
              <span>🦁 إفريقيا والعالم</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${scopeFilter === 'AFRICA' ? 'bg-black/20 text-white' : 'bg-black/30 text-stone-400'}`}>
                {getScopeCount('AFRICA')}
              </span>
            </button>
          </div>

          {/* Sub-region Tabs for Arab World */}
          {scopeFilter === 'ARAB' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-white/5 pt-2">
              <span className="text-[11px] text-stone-400 font-bold ml-2 shrink-0">أقاليم الوطن العربي:</span>
              {(Object.keys(arabRegionFilterMap) as ArabRegionFilter[]).map((regKey) => {
                const info = arabRegionFilterMap[regKey];
                const isActive = arabRegion === regKey;
                return (
                  <button
                    key={regKey}
                    onClick={() => setArabRegion(regKey)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                        : 'bg-white/5 text-stone-400 hover:text-white'
                    }`}
                  >
                    {info.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Smart Category Filters and Search Row */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2">
            
            {/* Smart Feature Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSmartFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  smartFilter === 'ALL'
                    ? 'bg-white text-[#071a2b]'
                    : 'bg-white/10 text-stone-300 hover:bg-white/15'
                }`}
              >
                الكل
              </button>

              <button
                onClick={() => setSmartFilter('VISA_EASY')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  smartFilter === 'VISA_EASY'
                    ? 'bg-emerald-400 text-[#071a2b]'
                    : 'bg-white/10 text-stone-300 hover:bg-white/15'
                }`}
              >
                <Plane className="w-3 h-3" />
                <span>بدون فيزا / تأشيرة إلكترونية</span>
              </button>

              <button
                onClick={() => setSmartFilter('SCHENGEN')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  smartFilter === 'SCHENGEN'
                    ? 'bg-blue-400 text-[#071a2b]'
                    : 'bg-white/10 text-stone-300 hover:bg-white/15'
                }`}
              >
                <span>🇪🇺 منطقة شنغن</span>
              </button>

              <button
                onClick={() => setSmartFilter('STUDY')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  smartFilter === 'STUDY'
                    ? 'bg-amber-400 text-[#071a2b]'
                    : 'bg-white/10 text-stone-300 hover:bg-white/15'
                }`}
              >
                <GraduationCap className="w-3 h-3" />
                <span>دراسة وابتعاث</span>
              </button>

              <button
                onClick={() => setSmartFilter('TOURISM')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  smartFilter === 'TOURISM'
                    ? 'bg-teal-400 text-[#071a2b]'
                    : 'bg-white/10 text-stone-300 hover:bg-white/15'
                }`}
              >
                <Palmtree className="w-3 h-3" />
                <span>سياحة وعائلات</span>
              </button>

              <button
                onClick={() => setSmartFilter('BUSINESS')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  smartFilter === 'BUSINESS'
                    ? 'bg-purple-400 text-[#071a2b]'
                    : 'bg-white/10 text-stone-300 hover:bg-white/15'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                <span>استثمار وأعمال</span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="ابحث عن دولة، عاصمة، أو معلم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder:text-stone-400 focus:outline-hidden focus:border-[#8be4d4] focus:bg-white/15 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-white"
                >
                  مسح
                </button>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Traveler & Expat Suite Quick Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-xl font-bold">
            🧳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-stone-900">حقيبة وأدوات المسافر والمقيم التفاعلية</h4>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">جديد V2.0</span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              فاحص التأشيرات الفوري للمواطنين العرب، دليل بطاقات المترو، مرشد الحلال والقبلة، محوّل العملات وميزانية السفر، ومخطط الحقيبة وجواز الطوارئ.
            </p>
          </div>
        </div>

        {onOpenTravelerSuite && (
          <button
            onClick={onOpenTravelerSuite}
            className="self-start sm:self-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span>فتح حقيبة الأدوات</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Countries Cards Grid */}
      {displayedCountries.length === 0 ? (
        <SovereignEmptyState
          title={
            /إسرائيل|اسرائيل|israel|الكيان\s*الصهيوني|تل\s*أبيب/i.test(searchQuery)
              ? "لا وجود لشيء يسمى دولة إسرائيل"
              : "لا توجد وجهات مطابقة"
          }
          description={
            /إسرائيل|اسرائيل|israel|الكيان\s*الصهيوني|تل\s*أبيب/i.test(searchQuery)
              ? "لا وجود لشيء يسمى دوله اسرائيل فهي اساسا مغتصبه لحق الفلسطينيين فلا نعترف بها ولا لوجودها اساس وكل شيء زائل باذن الله."
              : "لم نتمكن من العثور على وجهات تتطابق مع بحثك. يمكنك تجربة كلمات أخرى أو إعادة ضبط عوامل التصفية."
          }
          actionText={
            /إسرائيل|اسرائيل|israel|الكيان\s*الصهيوني|تل\s*أبيب/i.test(searchQuery)
              ? "استعراض دولة فلسطين 🇵🇸"
              : "إعادة ضبط التصفية"
          }
          onAction={() => {
            if (/إسرائيل|اسرائيل|israel|الكيان\s*الصهيوني|تل\s*أبيب/i.test(searchQuery)) {
              setSearchQuery('');
              onSelectCountry('PS');
            } else {
              setSearchQuery('');
              setScopeFilter('ALL');
              setArabRegion('ALL');
              setSmartFilter('ALL');
            }
          }}
          icon={/إسرائيل|اسرائيل|israel|الكيان\s*الصهيوني|تل\s*أبيب/i.test(searchQuery) ? "shield" : "search"}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayedCountries.map((c) => {
          const img = c.imagery;
          const hasError = imageErrors[c.code];

          return (
            <div
              key={c.code}
              id={`country-card-${c.code}`}
              className="group bg-white rounded-2xl border border-stone-200/90 hover:border-[#1bb49e] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Visual Image Container with Landmark Badge */}
                <div 
                  onClick={() => onSelectCountry(c.code)}
                  className="relative h-44 w-full bg-stone-900 overflow-hidden cursor-pointer"
                >
                  {!hasError ? (
                    <img
                      src={img.image_url}
                      alt={`${c.name_ar} - ${img.landmark_name_ar}`}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(c.code)}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#071a2b] via-[#10344d] to-[#071a2b] flex flex-col items-center justify-center p-4 text-center">
                      <span className="text-4xl mb-1">{img.flag}</span>
                      <span className="text-xs font-bold text-white">{c.name_ar}</span>
                      <span className="text-[10px] text-[#8be4d4]">{img.landmark_name_ar}</span>
                    </div>
                  )}

                  {/* Top Overlay Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 shadow-xs">
                      <span className="text-base leading-none">{img.flag}</span>
                      <span>{c.name_ar}</span>
                    </span>

                    <div className="flex items-center gap-1">
                      {img.schengen && (
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-blue-600/90 backdrop-blur-md text-white shadow-xs">
                          شنغن
                        </span>
                      )}
                      {c.is_arab && (
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-700/90 backdrop-blur-md text-white shadow-xs">
                          عربي
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/90 backdrop-blur-md text-[#071a2b] shadow-xs inline-flex items-center gap-1">
                        <span className="text-xs select-none">{img.flag}</span>
                        <span>{c.code}</span>
                      </span>
                    </div>
                  </div>

                  {/* Bottom Gradient with Landmark Name */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 pt-8 flex items-end justify-between pointer-events-none">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-medium text-emerald-300 block line-clamp-1">
                        🏛️ {img.landmark_name_ar}
                      </span>
                      <span className="text-[10px] text-stone-300 block font-normal">
                        العاصمة: {img.capital_ar} • {img.region_ar}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 
                      onClick={() => onSelectCountry(c.code)}
                      className="text-base font-extrabold text-stone-900 group-hover:text-[#1bb49e] transition-colors cursor-pointer"
                    >
                      {c.name_ar}
                    </h3>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {c.name_en}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {c.description_ar || img.tag_ar}
                  </p>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="p-4 pt-0 space-y-2">
                <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectCountry(c.code)}
                    className="flex-1 py-2 px-3 rounded-xl bg-stone-100 hover:bg-[#1bb49e] text-stone-700 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title={`عرض دليل وموسوعة ${c.name_ar} والمدن`}
                  >
                    <span>دليل الدولة والمدن</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenAIWithPrompt(`ما هي شروط السفر والتأشيرة وتكلفة المعيشة وأفضل المعالم للمسافر العربي في ${c.name_ar}؟`)}
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1bb49e] hover:text-[#169b88] transition-colors cursor-pointer"
                    title={`استشر الذكاء الاصطناعي عن ${c.name_ar}`}
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
      )}

      {/* Bottom Counter and View Toggle */}
      {displayedCountries.length < filteredCountries.length && !showAllCards && (
        <div className="text-center pt-2">
          <button
            onClick={() => setShowAllCards(true)}
            className="px-6 py-3 rounded-2xl bg-white border border-stone-200 hover:border-[#1bb49e] text-stone-800 hover:text-[#1bb49e] text-xs font-bold shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#1bb49e]" />
            <span>عرض بقية الوجهات ({filteredCountries.length - displayedCountries.length} دولة إضافية)</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Empty State */}
      {displayedCountries.length === 0 && (
        <SovereignEmptyState
          title="لا توجد دول أو وجهات مطابقة لبحثك"
          description="جرب البحث بكلمة أخرى، أو اختيار قارة أو تصنيف مختلف لإظهار الوجهات المتاحة."
          actionText="إعادة تعيين البحث والتصفيات"
          onAction={() => {
            setScopeFilter('ALL');
            setArabRegion('ALL');
            setSmartFilter('ALL');
            setSearchQuery('');
          }}
          icon="globe"
        />
      )}

    </section>
  );
}
