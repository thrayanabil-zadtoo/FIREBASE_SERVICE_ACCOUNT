import { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Wifi, 
  Shield, 
  Coins, 
  SunMedium, 
  ChevronLeft, 
  Building2,
  BookOpen,
  Globe2,
  Scale,
  Sparkles,
  Landmark,
  Briefcase,
  ShieldCheck,
  Footprints,
  Ticket,
  Clock
} from 'lucide-react';
import { Country, City } from '../types';
import { fetchApi } from '../api';
import PanArabIntelligenceView from './PanArabIntelligenceView';
import { getCountryImagery } from '../data/arab-countries-imagery';
import { getCountryOutings } from '../data/darb-country-outings-data';
import { getProvincesByCountryCode } from '../data/darb-country-provinces-data';
import { SovereignSkeletonLoader, SovereignEmptyState } from './SovereignVisuals';

interface CountrySummaryItem {
  country_code: string;
  name_ar: string;
  name_en: string;
  capital: string;
  flag: string;
  currency: string;
  currency_symbol: string;
  cities_count: number;
}

interface CountryCityExplorerProps {
  countries: Country[];
  onSelectCity?: (city: City) => void;
  onViewCountryProfile?: (countryCode: string) => void;
  onOpenAIWithPrompt?: (prompt: string) => void;
  initialCountryCode?: string;
  initialMode?: 'cities' | 'intelligence';
}

export default function CountryCityExplorer({
  countries,
  onSelectCity,
  onViewCountryProfile,
  onOpenAIWithPrompt,
  initialCountryCode,
  initialMode = 'cities',
}: CountryCityExplorerProps) {
  const [viewMode, setViewMode] = useState<'cities' | 'intelligence'>(initialMode);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(initialCountryCode || 'EG');
  const [countrySummaries, setCountrySummaries] = useState<CountrySummaryItem[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [selectedCityModal, setSelectedCityModal] = useState<City | null>(null);
  const [scopeFilter, setScopeFilter] = useState<'ALL' | 'ARAB' | 'EUROPE' | 'AMERICAS' | 'ASIA' | 'AFRICA'>('ALL');

  useEffect(() => {
    loadSummaries();
  }, []);

  const loadSummaries = async () => {
    try {
      const res = await fetchApi<CountrySummaryItem[]>('/countries/profiles/summary');
      if (res.ok && (res as any).data) {
        setCountrySummaries((res as any).data);
      }
    } catch {
      // fallback to props
    }
  };

  useEffect(() => {
    if (selectedCountryCode) {
      loadCities(selectedCountryCode);
    }
  }, [selectedCountryCode]);

  const loadCities = async (code: string) => {
    setLoadingCities(true);
    const res = await fetchApi<City[]>(`/cities/${code}`);
    if (res.ok && res.data) {
      setCities(res.data);
    }
    setLoadingCities(false);
  };

  const currentSummary = countrySummaries.find((c) => c.country_code === selectedCountryCode);
  const currentCountry = countries.find((c) => c.code === selectedCountryCode);

  const isArabCode = (code: string) => {
    return ['EG', 'SA', 'AE', 'QA', 'KW', 'JO', 'PS', 'BH', 'OM', 'LB', 'IQ', 'SY', 'YE', 'MA', 'DZ', 'TN', 'LY', 'SD', 'SO', 'DJ', 'MR', 'KM'].includes(code);
  };

  const getCodeContinent = (code: string) => {
    if (isArabCode(code)) return 'ARAB';
    if (['TR', 'GB', 'DE', 'FR', 'IT', 'ES', 'CH', 'AT', 'NL', 'GE', 'BA'].includes(code)) return 'EUROPE';
    if (['US', 'CA', 'BR'].includes(code)) return 'AMERICAS';
    if (['MY', 'TH', 'ID', 'SG', 'JP', 'KR', 'CN', 'AU'].includes(code)) return 'ASIA';
    return 'AFRICA';
  };

  const rawList = countrySummaries.length > 0
    ? countrySummaries.map((s) => ({
        code: s.country_code,
        name_ar: s.name_ar,
        name_en: s.name_en,
        flag: s.flag,
        cities_count: s.cities_count,
        continent: getCodeContinent(s.country_code)
      }))
    : countries.map((c) => ({
        code: c.code,
        name_ar: c.name_ar,
        name_en: c.name_en,
        flag: c.code === 'EG' ? '🇪🇬' : (c.code === 'PS' ? '🇵🇸' : '🌐'),
        cities_count: 0,
        continent: getCodeContinent(c.code)
      }));

  const displayList = rawList.filter((item) => {
    if (scopeFilter === 'ALL') return true;
    return item.continent === scopeFilter;
  });

  const filteredCities = cities.filter((city) => {
    if (!citySearch) return true;
    const q = citySearch.toLowerCase();
    return (
      city.name_ar?.toLowerCase().includes(q) ||
      city.name_en?.toLowerCase().includes(q) ||
      city.region_name?.toLowerCase().includes(q) ||
      city.description_ar?.toLowerCase().includes(q)
    );
  });

  return (
    <div id="country-city-explorer" className="space-y-6">
      
      {/* Top Mode Toggle: Cities vs Pan-Arab Intelligence (Phase 2) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            id="btn-mode-cities"
            onClick={() => setViewMode('cities')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              viewMode === 'cities'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Compass className="w-4 h-4 text-[#1bb49e]" />
            <span>دليل المدن والمحافظات</span>
          </button>

          <button
            id="btn-mode-intelligence"
            onClick={() => setViewMode('intelligence')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              viewMode === 'intelligence'
                ? 'bg-[#071a2b] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Scale className="w-4 h-4 text-[#1bb49e]" />
            <span>المرصد الإقليمي والمقارنة الشاملة (المرحلة الثانية)</span>
            <span className="text-[10px] bg-[#1bb49e] text-[#071a2b] px-1.5 py-0.2 rounded-full font-black">
              2025
            </span>
          </button>
        </div>

        <span className="text-[11px] font-semibold text-stone-500 px-3 hidden sm:inline-block">
          22 دولة عربية • 5 أقاليم • مقارنة مباشرة ومؤشرات 2025
        </span>
      </div>

      {/* RENDER VIEW ACCORDING TO MODE */}
      {viewMode === 'intelligence' ? (
        <PanArabIntelligenceView
          onSelectCountryProfile={onViewCountryProfile}
          onOpenAIWithPrompt={onOpenAIWithPrompt}
          onBackToCities={() => setViewMode('cities')}
        />
      ) : (
        <>
          {/* Country Selector Header */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-stone-900">
              <Compass className="w-5 h-5 text-[#1bb49e]" />
              <h2 className="text-lg font-bold">دليل الدول والمدن</h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              اختر الدولة لاستعراض المدن والخصائص المعيشية والخدمات المتاحة فيها.
            </p>
          </div>

          {/* Continent Filter & Country Badges */}
          <div className="flex flex-col gap-2 max-w-full">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setScopeFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  scopeFilter === 'ALL'
                    ? 'bg-[#1bb49e] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🌍 جميع الوجهات ({rawList.length})
              </button>
              <button
                onClick={() => setScopeFilter('ARAB')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  scopeFilter === 'ARAB'
                    ? 'bg-[#1bb49e] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🏛️ الدول العربية ({rawList.filter(c => c.continent === 'ARAB').length})
              </button>
              <button
                onClick={() => setScopeFilter('EUROPE')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  scopeFilter === 'EUROPE'
                    ? 'bg-[#1bb49e] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🏰 أوروبا ({rawList.filter(c => c.continent === 'EUROPE').length})
              </button>
              <button
                onClick={() => setScopeFilter('AMERICAS')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  scopeFilter === 'AMERICAS'
                    ? 'bg-[#1bb49e] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🗽 الأمريكتان ({rawList.filter(c => c.continent === 'AMERICAS').length})
              </button>
              <button
                onClick={() => setScopeFilter('ASIA')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  scopeFilter === 'ASIA'
                    ? 'bg-[#1bb49e] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                ⛩️ آسيا ({rawList.filter(c => c.continent === 'ASIA').length})
              </button>
              <button
                onClick={() => setScopeFilter('AFRICA')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  scopeFilter === 'AFRICA'
                    ? 'bg-[#1bb49e] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🦁 إفريقيا والعالم ({rawList.filter(c => c.continent === 'AFRICA').length})
              </button>
            </div>

            {/* Country Badges */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
              {displayList.map((c) => {
                const isSelected = selectedCountryCode === c.code;
                return (
                  <button
                    key={c.code}
                    id={`country-pill-${c.code}`}
                    onClick={() => setSelectedCountryCode(c.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#071a2b] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span className="text-sm">{c.flag}</span>
                    <span>{c.name_ar}</span>
                    {c.cities_count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'}`}>
                        {c.cities_count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Country Banner with Authentic Photo */}
        {currentCountry && (() => {
          const img = getCountryImagery(selectedCountryCode);
          return (
            <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col md:flex-row items-stretch gap-4 bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 overflow-hidden">
              {/* Country Landmark Thumbnail */}
              <div className="w-full md:w-48 h-32 md:h-auto shrink-0 relative rounded-xl overflow-hidden bg-stone-900 border border-stone-200 shadow-xs">
                <img
                  src={img.image_url}
                  alt={`${currentCountry.name_ar} - ${img.landmark_name_ar}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-2">
                  <span className="text-[10px] text-white font-medium line-clamp-1">
                    🏛️ {img.landmark_name_ar}
                  </span>
                </div>
              </div>

              {/* Country Info */}
              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-2xl">{img.flag}</span>
                    <span className="font-extrabold text-stone-900 text-lg">{currentCountry.name_ar}</span>
                    <span className="text-xs text-stone-700 font-mono bg-white px-2 py-0.5 rounded-lg border border-stone-200 inline-flex items-center gap-1 shadow-2xs font-semibold">
                      <span className="text-sm select-none">{img.flag}</span>
                      <span>رمز الدولة:</span>
                      <strong className="text-stone-900">{currentCountry.code}</strong>
                    </span>
                    <span className="text-[11px] font-semibold text-[#1bb49e] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      العاصمة: {img.capital_ar || currentSummary?.capital} • {img.region_ar}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1.5 max-w-2xl leading-relaxed">
                    {currentCountry.description_ar || img.tag_ar}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {onViewCountryProfile && (
                    <button
                      id={`btn-view-profile-${selectedCountryCode}`}
                      onClick={() => onViewCountryProfile(selectedCountryCode)}
                      className="px-4 py-2 rounded-xl bg-[#071a2b] hover:bg-[#0d2a45] text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#8be4d4]" />
                      <span>الصفحة الموسوعية للدولة (V1.1)</span>
                    </button>
                  )}

                  {onViewCountryProfile && (
                    <button
                      onClick={() => onViewCountryProfile(selectedCountryCode)}
                      className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-[#8be4d4] text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer border border-[#1bb49e]/30"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#1bb49e]" />
                      <span>الولايات والمحافظات ({getProvincesByCountryCode(selectedCountryCode).length})</span>
                    </button>
                  )}

                  {onViewCountryProfile && (
                    <button
                      onClick={() => onViewCountryProfile(selectedCountryCode)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Footprints className="w-3.5 h-3.5 text-emerald-200" />
                      <span>خروجات وفسح الدولة ({getCountryOutings(selectedCountryCode).length})</span>
                    </button>
                  )}

                  {onOpenAIWithPrompt && (
                    <button
                      onClick={() => onOpenAIWithPrompt(`ما هي أهم مميزات السكن والمعيشة وفرص العمل في ${currentCountry.name_ar}؟`)}
                      className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1bb49e] hover:text-[#169b88] text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>اسأل DARB AI</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Cities Search Filter */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-stone-400" />
          <span className="text-sm font-bold text-stone-900">
            المدن المتاحة ({filteredCities.length})
          </span>
        </div>
        <div className="w-64">
          <input
            type="text"
            placeholder="تصفية حسب اسم المدينة أو المنطقة..."
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:border-[#1bb49e]"
          />
        </div>
      </div>

      {/* Cities Grid */}
      {loadingCities ? (
        <div className="py-4">
          <SovereignSkeletonLoader mode="cards" count={3} />
        </div>
      ) : filteredCities.length === 0 ? (
        <SovereignEmptyState
          title={
            /إسرائيل|اسرائيل|israel|الكيان\s*الصهيوني|تل\s*أبيب/i.test(citySearch)
              ? "لا وجود لشيء يسمى دولة إسرائيل"
              : "لم يتم العثور على مدن مطابقة"
          }
          description={
            /إسرائيل|اسرائيل|israel|الكيان\s*الصهيوني|تل\s*أبيب/i.test(citySearch)
              ? "لا وجود لشيء يسمى دوله اسرائيل فهي اساسا مغتصبه لحق الفلسطينيين فلا نعترف بها ولا لوجودها اساس وكل شيء زائل باذن الله."
              : "جرب كتابة اسم مدينة آخر أو مسح كلمة البحث لإظهار جميع المدن المعتمدة."
          }
          actionText={
            /إسرائيل|اسرائيل|israel|الكيان\s*الصهيوني|تل\s*أبيب/i.test(citySearch)
              ? "استعراض مدن دولة فلسطين 🇵🇸"
              : "مسح البحث"
          }
          onAction={() => {
            setCitySearch('');
            if (/إسرائيل|اسرائيل|israel|الكيان\s*الصهيوني|تل\s*أبيب/i.test(citySearch)) {
              setSelectedCountryCode('PS');
            }
          }}
          icon={/إسرائيل|اسرائيل|israel|الكيان\s*الصهيوني|تل\s*أبيب/i.test(citySearch) ? "shield" : "search"}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCities.map((city) => (
            <div
              key={city.id}
              id={`city-card-${city.id}`}
              className="bg-white border border-stone-200 hover:border-[#1bb49e]/60 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#1bb49e] block">
                      {city.region_name || 'المنطقة'}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900">{city.name_ar}</h3>
                    {city.name_en && (
                      <span className="text-xs text-stone-400 font-mono">{city.name_en}</span>
                    )}
                  </div>
                  <span className="p-2 bg-stone-100 text-stone-600 rounded-xl">
                    <MapPin className="w-4 h-4" />
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                  {city.description_ar || 'مركز حضري متميز تتوفر فيه فرص عمل وخدمات استشارية وسكن.'}
                </p>

                {/* Highlights (Area, Industries, Landmarks) */}
                <div className="space-y-1.5 pt-1 text-[11px]">
                  {city.area_km2 && (
                    <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                      <Compass className="w-3.5 h-3.5 text-[#1bb49e] shrink-0" />
                      <span>المساحة: <strong>{city.area_km2.toLocaleString('ar-EG')} كم²</strong> {city.population_approx ? `• ${city.population_approx}` : ''}</span>
                    </div>
                  )}
                  {city.famous_industries && city.famous_industries.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {city.famous_industries.slice(0, 2).map((ind, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                          💼 {ind}
                        </span>
                      ))}
                    </div>
                  )}
                  {city.famous_landmarks && city.famous_landmarks.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {city.famous_landmarks.slice(0, 2).map((lm, i) => (
                        <span key={i} className="bg-stone-100 text-stone-700 border border-stone-200 px-2 py-0.5 rounded-md text-[10px]">
                          🏛️ {lm}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* City Quality Indicators */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px] text-stone-600">
                  <div className="flex items-center gap-1.5 bg-stone-50 p-1.5 rounded-lg">
                    <Shield className="w-3.5 h-3.5 text-indigo-500" />
                    <span>الأمان: <strong>{city.safety_score || 75}%</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-stone-50 p-1.5 rounded-lg">
                    <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                    <span>الإنترنت: <strong>{city.internet_score || 80}%</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-stone-50 p-1.5 rounded-lg">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    <span>تكلفة المعيشة: <strong>{city.cost_index || 50}/100</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-stone-50 p-1.5 rounded-lg">
                    <SunMedium className="w-3.5 h-3.5 text-orange-500" />
                    <span>المناخ: <strong>{city.weather_score || 85}%</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedCityModal(city)}
                  className="text-stone-500 hover:text-stone-800 font-semibold cursor-pointer"
                >
                  دليل وتراث المدينة
                </button>
                {onSelectCity && (
                  <button
                    onClick={() => onSelectCity(city)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1bb49e] hover:text-[#169b88] transition-colors cursor-pointer"
                  >
                    <span>استعراض الفرص والخدمات</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
        </>
      )}

      {/* Encyclopedic City Detail Modal */}
      {selectedCityModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-fadeIn my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1bb49e] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {selectedCityModal.region_name || 'المنطقة الحضرية'}
                  </span>
                  {selectedCityModal.area_km2 && (
                    <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                      📐 {selectedCityModal.area_km2.toLocaleString('ar-EG')} كم²
                    </span>
                  )}
                  {selectedCityModal.population_approx && (
                    <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full">
                      👥 {selectedCityModal.population_approx}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
                  <span>{selectedCityModal.name_ar}</span>
                  {selectedCityModal.name_en && (
                    <span className="text-sm text-stone-400 font-mono font-normal">({selectedCityModal.name_en})</span>
                  )}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCityModal(null)}
                className="text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 p-2 rounded-full text-sm font-bold transition-colors cursor-pointer"
                title="إغلاق"
              >
                ✕
              </button>
            </div>

            {/* City Overview Description */}
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-100">
              {selectedCityModal.description_ar}
            </p>

            {/* Rich Detailed Grid: 4 Core Axes Requested by User */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 1. المساحة والجغرافيا */}
              <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <Compass className="w-4 h-4 text-[#1bb49e]" />
                  <span>المساحة والطبيعة الجغرافية</span>
                </div>
                <div className="text-xs text-stone-700 space-y-1.5 leading-relaxed">
                  {selectedCityModal.area_description_ar && (
                    <p>{selectedCityModal.area_description_ar}</p>
                  )}
                  <div className="pt-1 flex flex-wrap gap-2 text-[11px]">
                    {selectedCityModal.area_km2 && (
                      <span className="bg-white text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold">
                        المساحة: {selectedCityModal.area_km2.toLocaleString('ar-EG')} كم²
                      </span>
                    )}
                    {selectedCityModal.population_approx && (
                      <span className="bg-white text-stone-700 px-2 py-0.5 rounded-md border border-stone-200 font-medium">
                        التقدير السكاني: {selectedCityModal.population_approx}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. العادات والتقاليد */}
              <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>العادات والتقاليد وأسلوب المعيشة</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {selectedCityModal.customs_and_traditions_ar || 'تتميز المدينة بكرم الضيافة العربي والتكافل الاجتماعي والمناسبات والمواسم الشعبية الخاصة.'}
                </p>
              </div>

              {/* 3. الإنتاج والعمل والصناعات */}
              <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>الإنتاج وسوق العمل والصناعات الشهيرة</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {selectedCityModal.production_and_work_ar || 'مركز نشط في التجارة والخدمات والحرف التخصصية وتوفير بيئة ملائمة للوظائف والاستثمار.'}
                </p>
                {selectedCityModal.famous_industries && selectedCityModal.famous_industries.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedCityModal.famous_industries.map((ind, i) => (
                      <span key={i} className="bg-white text-blue-800 px-2 py-0.5 rounded-lg border border-blue-200 text-[10px] font-semibold">
                        💼 {ind}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. العمران الأثري وأهم المعالم */}
              <div className="bg-purple-50/40 border border-purple-100 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                  <Landmark className="w-4 h-4 text-purple-600" />
                  <span>العمران الأثري وأهم المعالم التاريخية</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {selectedCityModal.historic_architecture_ar || 'تضم المدينة شواهد أثرية وصروحاً معمارية تجمع بين عبق التاريخ ورونق التطور الحضري.'}
                </p>
                {selectedCityModal.famous_landmarks && selectedCityModal.famous_landmarks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedCityModal.famous_landmarks.map((lm, i) => (
                      <span key={i} className="bg-white text-purple-800 px-2 py-0.5 rounded-lg border border-purple-200 text-[10px] font-semibold">
                        🏛️ {lm}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. خروجات وفسح مميزة في المدينة */}
              {(() => {
                const cityOutings = selectedCountryCode
                  ? getCountryOutings(selectedCountryCode).filter(
                      (o) => o.city_name === selectedCityModal.name_ar || selectedCityModal.name_ar.includes(o.city_name)
                    )
                  : [];
                if (cityOutings.length === 0) return null;
                return (
                  <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                        <Footprints className="w-4 h-4 text-emerald-600" />
                        <span>خروجات وفسح وأماكن عامة في {selectedCityModal.name_ar} ({cityOutings.length})</span>
                      </div>
                      {onViewCountryProfile && selectedCountryCode && (
                        <button
                          onClick={() => {
                            setSelectedCityModal(null);
                            onViewCountryProfile(selectedCountryCode);
                          }}
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer flex items-center gap-0.5"
                        >
                          <span>عرض كل الفسح</span>
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {cityOutings.map((co) => (
                        <div
                          key={co.id}
                          className="bg-white border border-emerald-100 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between"
                        >
                          <div className="relative h-28 overflow-hidden">
                            <img
                              src={co.image_url}
                              alt={co.name_ar}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                            <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-md">
                              {co.category_label}
                            </div>
                          </div>
                          <div className="p-3 space-y-2 text-xs">
                            <h5 className="font-bold text-stone-900 line-clamp-1">{co.name_ar}</h5>
                            <div className="text-[11px] space-y-1 text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-100">
                              <div className="flex items-center justify-between text-emerald-800 font-semibold">
                                <span>🇪🇬 المواطن:</span>
                                <span>{co.entry_tickets.citizen_price_ar}</span>
                              </div>
                              <div className="flex items-center justify-between text-sky-800 font-semibold">
                                <span>🌍 الزائر:</span>
                                <span>{co.entry_tickets.foreigner_tourist_price_ar}</span>
                              </div>
                              <div className="flex items-center justify-between text-stone-500 text-[10px] pt-1 border-t border-stone-200">
                                <span>🕒 المواعيد:</span>
                                <span>{co.opening_hours.hours_ar}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* Quality Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>مستوى الأمان: <strong>{selectedCityModal.safety_score}%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-emerald-500" />
                <span>سرعة الإنترنت: <strong>{selectedCityModal.internet_score}%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>مؤشر المعيشة: <strong>{selectedCityModal.cost_index}/100</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <SunMedium className="w-4 h-4 text-orange-500" />
                <span>ملاءمة المناخ: <strong>{selectedCityModal.weather_score}%</strong></span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              {onSelectCity && (
                <button
                  onClick={() => {
                    const c = selectedCityModal;
                    setSelectedCityModal(null);
                    onSelectCity(c);
                  }}
                  className="flex-1 py-2.5 px-4 bg-[#1bb49e] hover:bg-[#169b88] text-white text-xs font-bold rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>استعراض وظائف وخدمات {selectedCityModal.name_ar}</span>
                </button>
              )}
              {onOpenAIWithPrompt && (
                <button
                  onClick={() => {
                    const c = selectedCityModal;
                    setSelectedCityModal(null);
                    onOpenAIWithPrompt(`حدثني بالتفصيل عن الحياة والعمل والعادات والمناخ وتكلفة المعيشة في مدينة ${c.name_ar}`);
                  }}
                  className="py-2.5 px-4 bg-[#071a2b] hover:bg-[#0d2a45] text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>استفسر عبر DARB AI</span>
                </button>
              )}
              <button
                onClick={() => setSelectedCityModal(null)}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
