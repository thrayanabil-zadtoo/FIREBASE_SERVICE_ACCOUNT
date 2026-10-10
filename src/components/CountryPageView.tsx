import { useState, useEffect, useMemo } from 'react';
import { 
  CountryProfile, 
  CountryLandmark, 
  CountryOuting,
  CountryVisitingSeason, 
  CountryAirport, 
  CountrySeaport,
  CountryProvinceDetail
} from '../types/country-profile';
import { getProvincesByCountryCode } from '../data/darb-country-provinces-data';
import { fetchApi } from '../api';
import { 
  Building2, 
  Globe2, 
  MapPin, 
  Compass, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  Briefcase, 
  Coins, 
  SunMedium, 
  Wifi, 
  Plane, 
  Anchor, 
  FileText, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  Landmark, 
  Phone, 
  Calendar, 
  UserCheck, 
  HelpCircle,
  Share2,
  ArrowRight,
  Scale,
  Footprints,
  Ticket,
  TreePine,
  Utensils,
  CreditCard,
  Camera,
  Map as MapIcon
} from 'lucide-react';
import { getCountryImagery } from '../data/arab-countries-imagery';
import { getCountryOutings } from '../data/darb-country-outings-data';
import TravelerInteractiveSuite from './TravelerInteractiveSuite';
import CountryGeographicInteractiveMap from './CountryGeographicInteractiveMap';
import { 
  SovereignKpiCard, 
  SovereignSkeletonLoader, 
  SovereignEmptyState,
  SovereignMapDivisionBadge
} from './SovereignVisuals';

interface CountryPageViewProps {
  countryCode: string;
  onBack: () => void;
  onSelectCity?: (city: any) => void;
  onOpenAIWithPrompt?: (prompt: string) => void;
  onOpenPanArabIntelligence?: () => void;
  onOpenTravelerTools?: (countryCode: string) => void;
  onSelectJob?: (job: any) => void;
  onSelectService?: (service: any) => void;
}

export default function CountryPageView({
  countryCode,
  onBack,
  onSelectCity,
  onOpenAIWithPrompt,
  onOpenPanArabIntelligence,
  onOpenTravelerTools,
  onSelectJob,
  onSelectService,
}: CountryPageViewProps) {
  const [activeCountryCode, setActiveCountryCode] = useState<string>(countryCode);
  const [profile, setProfile] = useState<CountryProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'geography' | 'map' | 'cities' | 'outings' | 'traveler_suite' | 'tourism' | 'economy' | 'services' | 'provenance'>('overview');
  const [inCountrySearch, setInCountrySearch] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedCityDetail, setSelectedCityDetail] = useState<any | null>(null);
  const [selectedOutingCategory, setSelectedOutingCategory] = useState<string>('all');
  const [selectedOutingCity, setSelectedOutingCity] = useState<string>('all');
  const [citiesViewMode, setCitiesViewMode] = useState<'provinces' | 'cities_grid'>('provinces');
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<string>('all');
  const [selectedProvinceDetail, setSelectedProvinceDetail] = useState<CountryProvinceDetail | null>(null);

  useEffect(() => {
    setActiveCountryCode(countryCode);
  }, [countryCode]);

  useEffect(() => {
    loadProfile(activeCountryCode);
  }, [activeCountryCode]);

  const loadProfile = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi<CountryProfile>(`/countries/${code}/profile`);
      if (res.ok && (res as any).data) {
        setProfile((res as any).data);
      } else {
        setError('تعذر تحميل بيانات الدولة الموسوعية.');
      }
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء تحميل بيانات الدولة');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Provinces List calculation
  const provincesList: CountryProvinceDetail[] = useMemo(() => {
    if (profile?.provinces_detailed && profile.provinces_detailed.length > 0) {
      return profile.provinces_detailed;
    }
    if ((profile as any)?.provinces && (profile as any).provinces.length > 0) {
      return (profile as any).provinces;
    }
    return getProvincesByCountryCode(countryCode);
  }, [profile, countryCode]);

  // In-country search filter
  const filteredCities = useMemo(() => {
    if (!profile) return [];
    let list = profile.cities;
    if (selectedProvinceFilter !== 'all') {
      const prov = provincesList.find(p => p.id === selectedProvinceFilter);
      if (prov) {
        const cityNames = prov.key_cities.map(k => k.name_ar.toLowerCase());
        list = list.filter(c => 
          c.region_name?.toLowerCase().includes(prov.province_name_ar.toLowerCase()) || 
          cityNames.some(cn => c.name_ar.toLowerCase().includes(cn) || cn.includes(c.name_ar.toLowerCase()))
        );
      }
    }
    if (!inCountrySearch.trim()) return list;
    const q = inCountrySearch.toLowerCase();
    return list.filter(c => 
      c.name_ar.toLowerCase().includes(q) ||
      (c.name_en && c.name_en.toLowerCase().includes(q)) ||
      (c.region_name && c.region_name.toLowerCase().includes(q)) ||
      (c.description_ar && c.description_ar.toLowerCase().includes(q))
    );
  }, [profile, inCountrySearch, selectedProvinceFilter, provincesList]);

  const filteredLandmarks = useMemo(() => {
    if (!profile) return [];
    if (!inCountrySearch.trim()) return profile.landmarks;
    const q = inCountrySearch.toLowerCase();
    return profile.landmarks.filter(l => 
      l.name_ar.toLowerCase().includes(q) ||
      l.type.toLowerCase().includes(q) ||
      l.description_ar.toLowerCase().includes(q)
    );
  }, [profile, inCountrySearch]);

  const filteredFacts = useMemo(() => {
    if (!profile || !(profile as any).gke_facts) return [];
    if (!inCountrySearch.trim()) return (profile as any).gke_facts;
    const q = inCountrySearch.toLowerCase();
    return (profile as any).gke_facts.filter((f: any) => 
      f.axis_name_ar?.toLowerCase().includes(q) ||
      f.fact_key?.toLowerCase().includes(q) ||
      f.fact_value?.toLowerCase().includes(q)
    );
  }, [profile, inCountrySearch]);

  const allOutings = useMemo<CountryOuting[]>(() => {
    if (profile?.outings && profile.outings.length > 0) {
      return profile.outings;
    }
    return getCountryOutings(countryCode);
  }, [profile, countryCode]);

  const outingCities = useMemo(() => {
    const set = new Set<string>();
    allOutings.forEach(o => {
      if (o.city_name) set.add(o.city_name);
    });
    return Array.from(set);
  }, [allOutings]);

  const filteredOutings = useMemo(() => {
    return allOutings.filter(o => {
      if (selectedOutingCategory !== 'all' && o.category !== selectedOutingCategory) {
        return false;
      }
      if (selectedOutingCity !== 'all' && o.city_name !== selectedOutingCity) {
        return false;
      }
      if (inCountrySearch.trim()) {
        const q = inCountrySearch.toLowerCase();
        const matchName = o.name_ar.toLowerCase().includes(q);
        const matchCity = o.city_name.toLowerCase().includes(q);
        const matchDesc = o.description_ar.toLowerCase().includes(q);
        const matchCat = o.category_label.toLowerCase().includes(q);
        return matchName || matchCity || matchDesc || matchCat;
      }
      return true;
    });
  }, [allOutings, selectedOutingCategory, selectedOutingCity, inCountrySearch]);

  if (loading) {
    return (
      <div id="country-page-loading" className="py-6">
        <SovereignSkeletonLoader mode="country_page" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div id="country-page-error" className="py-12">
        <SovereignEmptyState
          title="تعذر عرض صفحة الدولة"
          description={error || 'لم يتم العثور على سجل لهذه الدولة في قاعدة بيانات دَرْب المعتمدة'}
          actionText="العودة لدليل الدول والمدن"
          onAction={onBack}
          icon="globe"
        />
      </div>
    );
  }

  return (
    <div id={`country-page-${profile.country_code}`} className="space-y-8 animate-fadeIn">
      
      {/* Top Breadcrumb & Back Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          id="country-page-back-btn"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-700 bg-white border border-stone-200 hover:border-[#1bb49e] hover:text-[#1bb49e] px-4 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
          <span>العودة لدليل الدول والمدن</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg border border-stone-200 inline-flex items-center gap-1.5 shadow-2xs font-semibold">
            <span className="text-sm select-none leading-none">{profile.flag}</span>
            <span>رمز الدولة:</span>
            <strong className="font-mono text-stone-900">{profile.country_code}</strong>
          </span>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>بيانات موثقة (V1.1)</span>
          </span>
          {onOpenPanArabIntelligence && (
            <button
              id="country-page-open-intel-btn"
              onClick={onOpenPanArabIntelligence}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#071a2b] bg-[#1bb49e] hover:bg-[#169683] px-3 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>مقارنة في المرصد الإقليمي</span>
            </button>
          )}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 bg-white border border-stone-200 hover:border-stone-300 px-3 py-1 rounded-lg transition-all"
            title="مشاركة الرابط"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-500" />
            <span>{copiedLink ? 'تم نسخ الرابط!' : 'مشاركة'}</span>
          </button>
        </div>
      </div>

      {/* Sovereign Hero Card */}
      {(() => {
        const countryImg = getCountryImagery(profile.country_code);
        return (
          <section 
            id="country-sovereign-hero" 
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071a2b] via-[#0d2a45] to-[#081e31] text-white p-6 sm:p-10 shadow-xl border border-stone-800"
          >
            {/* Background Country Photo with Subtle Gradient Blend */}
            <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
              <img
                src={countryImg.image_url}
                alt={countryImg.landmark_name_ar}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#071a2b] via-[#071a2b]/85 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              
              {/* Main Titles */}
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-4xl sm:text-5xl drop-shadow-md select-none">{profile.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        {profile.name_ar}
                      </h1>
                      <span className="text-xs font-mono text-stone-400 bg-white/10 px-2 py-0.5 rounded">
                        {profile.name_en}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <p className="text-xs font-semibold text-[#8be4d4]">
                        العاصمة: {profile.capital} • {profile.provinces_count} {profile.provinces_label}
                      </p>
                      <span className="text-[11px] text-stone-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                        🏛️ {countryImg.landmark_name_ar}
                      </span>
                    </div>
                  </div>
                </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              {profile.description_ar}
            </p>

            {/* Quick Contextual Actions */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={() => onOpenAIWithPrompt?.(`قدم لي دليلاً شاملاً عن الحياة والعمل والإقامة في ${profile.name_ar}`)}
                className="px-4 py-2.5 rounded-xl bg-[#1bb49e] hover:bg-[#169b88] text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-100" />
                <span>استشر DARB AI حول {profile.name_ar}</span>
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className="px-4 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-stone-900 font-extrabold text-xs border border-sky-300 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Compass className="w-4 h-4 text-stone-900" />
                <span>خريطة الدولة والمدن المجاورة 🗺️</span>
              </button>
              <button
                onClick={() => setActiveTab('cities')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 font-semibold text-xs border border-white/15 transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#8be4d4]" />
                <span>استعراض المدن والمحافظات ({profile.cities.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('traveler_suite')}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-extrabold text-xs border border-amber-300 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Compass className="w-4 h-4 text-stone-900" />
                <span>حقيبة وأدوات المسافر الذكية</span>
              </button>
            </div>
          </div>

          {/* Sovereign Data Matrix Box */}
          <div className="w-full lg:w-80 shrink-0 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4.5 space-y-3 text-xs">
            <div className="text-[11px] font-bold text-[#8be4d4] flex items-center justify-between border-b border-white/15 pb-2">
              <span className="flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5 text-[#1bb49e]" />
                المعطيات السيادية والعملة
              </span>
              <span className="font-mono text-stone-300">{profile.calling_code}</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-[11px]">
              <div>
                <span className="text-stone-400 block text-[10px]">العملة الرسمية</span>
                <span className="font-bold text-white">{profile.currency} ({profile.currency_symbol})</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">اللغة المعتمدة</span>
                <span className="font-bold text-white">{profile.language}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">المساحة الإجمالية</span>
                <span className="font-bold text-white">{profile.area_sq_km}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">التوقيت الرسمي</span>
                <span className="font-bold text-white">{profile.timezone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-stone-400 block text-[10px]">السكان الموثق</span>
                <span className="font-bold text-white">{profile.population}</span>
              </div>
              <div className="col-span-2">
                <span className="text-stone-400 block text-[10px]">النطاق الإلكتروني</span>
                <span className="font-mono text-[#8be4d4] font-semibold">{profile.domain_tld}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Security Alert Strip if Advisory / Warning */}
        {profile.travel_security_alert && profile.travel_security_alert.level !== 'normal' && (
          <div className="mt-6 pt-4 border-t border-white/10 flex items-start sm:items-center gap-2.5 text-xs bg-amber-500/15 border border-amber-500/30 text-amber-200 px-4 py-2.5 rounded-xl">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
              <span><strong>تنبيه السفر والإقامة:</strong> {profile.travel_security_alert.text_ar}</span>
              <span className="text-amber-300 font-mono text-[10px] shrink-0">المصدر: {profile.travel_security_alert.source}</span>
            </div>
          </div>
        )}
          </section>
        );
      })()}

      {/* In-Country Universal Search Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`بحث داخل محتوى ${profile.name_ar} (المدن، المعالم، المعرفة، الوظائف، الخدمات)...`}
            value={inCountrySearch}
            onChange={(e) => setInCountrySearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-10 pl-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-[#1bb49e] focus:bg-white transition-all"
          />
        </div>
        {inCountrySearch && (
          <button
            onClick={() => setInCountrySearch('')}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 px-2 py-1 shrink-0"
          >
            مسح التصفية
          </button>
        )}
        <div className="flex items-center gap-2 text-xs text-stone-500 shrink-0">
          <Layers className="w-4 h-4 text-[#1bb49e]" />
          <span>{filteredCities.length} مدينة • {filteredLandmarks.length} معالم</span>
        </div>
      </div>

      {/* Encyclopedic Sections Navigation Tabs */}
      <div className="border-b border-stone-200 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#071a2b] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>الهوية ونظرة عامة</span>
        </button>

        <button
          onClick={() => setActiveTab('geography')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'geography'
              ? 'bg-[#071a2b] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>الجغرافيا والتضاريس</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'map'
              ? 'bg-[#1bb49e] text-white shadow-xs font-black'
              : 'text-stone-700 hover:text-stone-900 hover:bg-emerald-50 text-emerald-950 font-bold'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>خريطة الدولة والمدن المجاورة</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'map' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
          }`}>
            ملونة 🗺️
          </span>
        </button>

        <button
          onClick={() => setActiveTab('cities')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'cities'
              ? 'bg-[#071a2b] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>الولايات والمدن ({provincesList.length > 0 ? `${provincesList.length} ${profile.provinces_label} • ` : ''}{profile.cities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('outings')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'outings'
              ? 'bg-[#1bb49e] text-white shadow-xs font-black'
              : 'text-stone-700 hover:text-stone-900 hover:bg-emerald-50 text-emerald-950 font-bold'
          }`}
        >
          <Footprints className="w-4 h-4 text-emerald-600" />
          <span>خروجات وفسح وأماكن عامة</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
            activeTab === 'outings' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {allOutings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('traveler_suite')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'traveler_suite'
              ? 'bg-amber-400 text-stone-900 shadow-md font-black'
              : 'text-amber-900 bg-amber-50/80 border border-amber-200/80 hover:bg-amber-100 font-bold'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-600" />
          <span>حقيبة المسافر الذكية والتأشيرات</span>
          <span className="bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded text-[10px] font-black">7 أدوات</span>
        </button>

        <button
          onClick={() => setActiveTab('tourism')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'tourism'
              ? 'bg-[#071a2b] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Plane className="w-4 h-4" />
          <span>السياحة والمواسم والموانئ</span>
        </button>

        <button
          onClick={() => setActiveTab('economy')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'economy'
              ? 'bg-[#071a2b] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>الاقتصاد ومؤشرات النمو</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'services'
              ? 'bg-[#071a2b] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>الوظائف والخدمات المتاحة ({profile.jobs_count + profile.services_count})</span>
        </button>

        <button
          onClick={() => setActiveTab('provenance')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'provenance'
              ? 'bg-[#071a2b] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>التوثيق والحوكمة ({profile.confidence})</span>
        </button>
      </div>

      {/* TAB CONTENT 1: OVERVIEW & SOVEREIGN IDENTITY */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Sovereign Key Performance Indicators (KPIs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SovereignKpiCard
              title="السكان الموثق رسميًا"
              value={profile.population}
              subtitle="إحصاءات رسمية معتمدة"
              change="مؤشر سكاني"
              trend="up"
              color="emerald"
              icon={<Globe2 className="w-5 h-5" />}
              sparklineData={[30, 32, 35, 38, 42, 45, 48, 52, 55, 60]}
            />
            <SovereignKpiCard
              title="المساحة الجغرافية"
              value={profile.area_sq_km}
              subtitle="إجمالي الرقعة الوطنية"
              change="استعراض الخريطة 🗺️"
              trend="neutral"
              color="cyan"
              icon={<Compass className="w-5 h-5" />}
              sparklineData={[50, 50, 50, 50, 50, 50, 50, 50, 50, 50]}
              onClick={() => setActiveTab('map')}
            />
            <SovereignKpiCard
              title="التقسيم الإداري"
              value={`${profile.provinces_count} ${profile.provinces_label}`}
              subtitle={`${profile.cities.length} مدينة موثقة في دَرْب`}
              change={`${profile.cities.length} مدينة`}
              trend="up"
              color="indigo"
              icon={<Building2 className="w-5 h-5" />}
              sparklineData={[10, 15, 20, 25, 30, 35, 40, 45, 50, 55]}
              onClick={() => setActiveTab('cities')}
            />
            <SovereignKpiCard
              title="العملة الرسمية"
              value={`${profile.currency_symbol} ${profile.currency}`}
              subtitle={`رمز الاتصال الدولي: ${profile.calling_code}`}
              change={profile.domain_tld}
              trend="neutral"
              color="amber"
              icon={<Coins className="w-5 h-5" />}
              sparklineData={[40, 42, 41, 44, 43, 46, 45, 48, 47, 50]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Identity Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-stone-900">
                <Landmark className="w-4 h-4 text-[#1bb49e]" />
                <h3 className="font-bold text-sm">الهوية السيادية واللغة</h3>
              </div>
              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex justify-between pb-2 border-b border-stone-100">
                  <span className="text-stone-400">الاسم الرسمي:</span>
                  <span className="font-bold text-stone-900 text-left">{profile.name_ar}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-stone-100">
                  <span className="text-stone-400">الاسم بالإنجليزية:</span>
                  <span className="font-bold font-mono text-stone-900">{profile.name_en}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-stone-100">
                  <span className="text-stone-400">العاصمة:</span>
                  <span className="font-bold text-stone-900">{profile.capital}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-stone-100">
                  <span className="text-stone-400">اللغة الرسمية:</span>
                  <span className="font-bold text-stone-900">{profile.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">التقسيم الإداري:</span>
                  <span className="font-bold text-stone-900">{profile.provinces_count} {profile.provinces_label}</span>
                </div>
              </div>
            </div>

            {/* Currency & Communications */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-stone-900">
                <Coins className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm">العملة والاتصالات والنطاق</h3>
              </div>
              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex justify-between pb-2 border-b border-stone-100">
                  <span className="text-stone-400">العملة:</span>
                  <span className="font-bold text-stone-900">{profile.currency}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-stone-100">
                  <span className="text-stone-400">رمز العملة:</span>
                  <span className="font-mono font-bold text-stone-900">{profile.currency_symbol}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-stone-100">
                  <span className="text-stone-400">رمز الاتصال الدولي:</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{profile.calling_code}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-stone-100">
                  <span className="text-stone-400">نطاق الإنترنت:</span>
                  <span className="font-mono font-bold text-indigo-700">{profile.domain_tld}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">المنطقة الزمنية:</span>
                  <span className="font-mono font-bold text-stone-900">{profile.timezone}</span>
                </div>
              </div>
            </div>

            {/* Demographics & Space */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-stone-900">
                <Globe2 className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-sm">السكان والمساحة والموقع</h3>
              </div>
              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex justify-between pb-2 border-b border-stone-100">
                  <span className="text-stone-400">المساحة:</span>
                  <span className="font-bold text-stone-900">{profile.area_sq_km}</span>
                </div>
                <div className="pb-2 border-b border-stone-100 space-y-1">
                  <span className="text-stone-400 block">السكان والتوثيق الإحصائي:</span>
                  <span className="font-bold text-stone-900 block leading-relaxed">{profile.population}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-stone-400 block">الموقع الجغرافي العام:</span>
                  <span className="text-stone-800 block text-[11px] leading-relaxed">{profile.location}</span>
                </div>
                <button
                  onClick={() => setActiveTab('map')}
                  className="w-full mt-3 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-[#1bb49e] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-emerald-200 cursor-pointer shadow-2xs"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>فتح خريطة {profile.name_ar} والمدن المجاورة 🗺️</span>
                </button>
              </div>
            </div>

          </div>

          {/* Quick AI Questions for this Country */}
          <div className="bg-gradient-to-l from-emerald-50/70 via-stone-50 to-white border border-emerald-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-900">
                <Sparkles className="w-4 h-4 text-[#1bb49e]" />
                <h4 className="font-bold text-xs sm:text-sm">أسئلة شائعة يجيب عنها DARB AI مباشرة حول {profile.name_ar}</h4>
              </div>
              <span className="text-[10px] text-stone-500">مبني على محرك المعرفة الموثق GKE V1.1</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => onOpenAIWithPrompt?.(`ما هي أنواع الإقامات وتأشيرات العمل الرسمية للمغتربين في ${profile.name_ar}؟`)}
                className="text-right p-3 bg-white border border-stone-200 hover:border-[#1bb49e] rounded-xl text-xs text-stone-800 font-semibold hover:shadow-xs transition-all flex items-start justify-between cursor-pointer"
              >
                <span>شروط وتأشيرات الإقامة والعمل</span>
                <ChevronLeft className="w-3.5 h-3.5 text-stone-400 shrink-0 mr-1 mt-0.5" />
              </button>

              <button
                onClick={() => onOpenAIWithPrompt?.(`ما هو متوسط تكلفة المعيشة والسكن وأفضل المدن للمغتربين في ${profile.name_ar}؟`)}
                className="text-right p-3 bg-white border border-stone-200 hover:border-[#1bb49e] rounded-xl text-xs text-stone-800 font-semibold hover:shadow-xs transition-all flex items-start justify-between cursor-pointer"
              >
                <span>تكاليف المعيشة ونطاق السكن</span>
                <ChevronLeft className="w-3.5 h-3.5 text-stone-400 shrink-0 mr-1 mt-0.5" />
              </button>

              <button
                onClick={() => onOpenAIWithPrompt?.(`ما هي الضوابط والقوانين الجمركية ومواسم السفر المعتمدة في ${profile.name_ar}؟`)}
                className="text-right p-3 bg-white border border-stone-200 hover:border-[#1bb49e] rounded-xl text-xs text-stone-800 font-semibold hover:shadow-xs transition-all flex items-start justify-between cursor-pointer"
              >
                <span>القوانين والمواسم والتنبيهات</span>
                <ChevronLeft className="w-3.5 h-3.5 text-stone-400 shrink-0 mr-1 mt-0.5" />
              </button>
            </div>
          </div>

          {/* Featured Outings & Leisure Showcase */}
          {allOutings && allOutings.length > 0 && (
            <div className="bg-gradient-to-br from-emerald-950 via-[#071a2b] to-stone-900 rounded-3xl p-6 text-white space-y-4 shadow-xl border border-emerald-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-500/20 text-[#8be4d4]">
                      <Footprints className="w-4 h-4" />
                    </span>
                    <h3 className="font-black text-sm sm:text-base text-white">
                      أبرز الخروجات والفسح والأماكن العامة في {profile.name_ar}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-300">
                    استكشف الحدائق، الكورنيش، المتاحف والأسواق مع تعرفة الدخول الموثقة للمواطن والزائر ومواعيد العمل.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('outings')}
                  className="px-4 py-2 bg-[#1bb49e] hover:bg-[#169b88] text-white font-bold text-xs rounded-xl shadow-md transition-all self-start sm:self-center flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>استعراض كل الأماكن ({allOutings.length})</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                {allOutings.slice(0, 3).map((outing) => (
                  <div
                    key={outing.id}
                    onClick={() => setActiveTab('outings')}
                    className="group bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-emerald-400/50 rounded-2xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={outing.image_url}
                        alt={outing.name_ar}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-[10px] text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-white/10">
                        {outing.category_label}
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 left-2.5 flex items-center justify-between text-white text-xs">
                        <span className="font-bold line-clamp-1">{outing.name_ar}</span>
                        <span className="text-[10px] font-semibold text-emerald-300 bg-black/50 px-2 py-0.5 rounded shrink-0 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          {outing.city_name}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 space-y-2.5 text-xs">
                      <p className="text-stone-300 text-[11px] line-clamp-2 leading-relaxed">
                        {outing.description_ar}
                      </p>
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1 text-emerald-300 font-semibold">
                          <Ticket className="w-3.5 h-3.5" />
                          <span>المواطن: {outing.entry_tickets.citizen_price_ar.split(' ')[0]} {outing.entry_tickets.citizen_price_ar.split(' ')[1] || ''}</span>
                        </div>
                        <div className="text-stone-300 font-medium text-[10px]">
                          🌍 الزائر: {outing.entry_tickets.foreigner_tourist_price_ar.split('(')[0]}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: DEDICATED GEOGRAPHIC INTERACTIVE MAP */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <CountryGeographicInteractiveMap
            countryCode={profile.country_code}
            profile={profile}
            onSelectCity={onSelectCity}
            onSelectNeighborCountry={(code) => {
              setActiveCountryCode(code);
            }}
          />
        </div>
      )}

      {/* TAB CONTENT 2: GEOGRAPHY & NATURE */}
      {activeTab === 'geography' && (
        <div className="space-y-6">
          {/* Prominent Colorful Interactive Map */}
          <CountryGeographicInteractiveMap
            countryCode={profile.country_code}
            profile={profile}
            onSelectCity={onSelectCity}
            onSelectNeighborCountry={(code) => {
              setActiveCountryCode(code);
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Terrain & Land */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-stone-900">
                <Compass className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm">التضاريس والمناخ</h3>
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-stone-700">
                <div>
                  <span className="font-semibold text-stone-900 block mb-1">طبيعة التضاريس والسطح:</span>
                  <p className="bg-stone-50 p-3 rounded-xl border border-stone-100">{profile.terrain}</p>
                </div>
                <div>
                  <span className="font-semibold text-stone-900 block mb-1">المناخ والفصول الجوية:</span>
                  <p className="bg-stone-50 p-3 rounded-xl border border-stone-100">{profile.climate}</p>
                </div>
              </div>
            </div>

            {/* Borders & Seas */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-stone-900">
                <Globe2 className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm">الحدود والبحار والمضايق</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-stone-900 block mb-1.5">الحدود البرية والجوار:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.borders.map((b, i) => (
                      <span key={i} className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-lg border border-stone-200 font-medium">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-stone-900 block mb-1.5">البحار والمحيطات والشواطئ:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.seas_and_oceans.map((s, i) => (
                      <span key={i} className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {profile.islands_and_straits && profile.islands_and_straits.length > 0 && (
                  <div>
                    <span className="font-semibold text-stone-900 block mb-1.5">الجزر والمضايق والممرات الملاحية:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.islands_and_straits.map((item, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Natural Resources */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>الموارد الطبيعية والثروات</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.natural_resources.map((res, i) => (
                <span key={i} className="bg-amber-50/80 border border-amber-200 text-amber-900 font-semibold text-xs px-3 py-1.5 rounded-xl">
                  {res}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: CITIES & PROVINCES / STATES */}
      {activeTab === 'cities' && (
        <div className="space-y-6">
          {/* Header & Sub-View Switcher Bar */}
          <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-[#071a2b] text-white rounded-3xl p-6 shadow-md border border-stone-700/50 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1bb49e]/20 text-[#8be4d4] text-xs font-bold border border-[#1bb49e]/30">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>الأطلس الإداري والحضري الشامل • {profile.name_ar}</span>
                </div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>التقسيم الإداري، الولايات والمحافظات والمدن</span>
                  <span className="text-xs font-normal text-stone-400 bg-white/10 px-2.5 py-1 rounded-lg">
                    {provincesList.length > 0 ? `${provincesList.length} ${profile.provinces_label}` : `${profile.provinces_count} ${profile.provinces_label}`} • {profile.cities.length} مدينة
                  </span>
                </h3>
                <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
                  تصفح شامل لكافة الولايات والمحافظات، العواصم الإدارية، التخصص الاقتصادي، والمعالم والمدن التابعة لكل ولاية، مع مؤشرات الأمان والإنترنت وجودة المعيشة.
                </p>
              </div>

              {/* View Switcher Buttons */}
              <div className="flex items-center bg-stone-950/60 p-1.5 rounded-2xl border border-white/10 shrink-0 gap-1">
                <button
                  onClick={() => setCitiesViewMode('provinces')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    citiesViewMode === 'provinces'
                      ? 'bg-[#1bb49e] text-white shadow-md'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>عرض {profile.provinces_label} ({provincesList.length || profile.provinces_count})</span>
                </button>
                <button
                  onClick={() => setCitiesViewMode('cities_grid')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    citiesViewMode === 'cities_grid'
                      ? 'bg-[#1bb49e] text-white shadow-md'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>كافة المدن ({filteredCities.length})</span>
                </button>
              </div>
            </div>

            {/* Quick Filter Bar for Provinces */}
            {provincesList.length > 0 && (
              <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-stone-400 text-[11px] font-semibold">تصفية سريعة حسب {profile.provinces_label}:</span>
                <button
                  onClick={() => setSelectedProvinceFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedProvinceFilter === 'all'
                      ? 'bg-[#8be4d4] text-stone-950'
                      : 'bg-white/10 text-stone-300 hover:bg-white/20'
                  }`}
                >
                  الكل ({provincesList.length})
                </button>
                {provincesList.slice(0, 8).map(prov => (
                  <button
                    key={prov.id}
                    onClick={() => setSelectedProvinceFilter(prov.id === selectedProvinceFilter ? 'all' : prov.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                      selectedProvinceFilter === prov.id
                        ? 'bg-[#8be4d4] text-stone-950 font-bold'
                        : 'bg-white/10 text-stone-300 hover:bg-white/20'
                    }`}
                  >
                    {prov.province_name_ar}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* VIEW MODE 1: PROVINCES & STATES DEEP CARDS */}
          {citiesViewMode === 'provinces' && (
            <div className="space-y-5">
              {provincesList.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center text-stone-500">
                  <p className="text-sm">يجري تحديث تفاصيل المحافظات الإدارية المباشرة لهذه الدولة.</p>
                  <button
                    onClick={() => setCitiesViewMode('cities_grid')}
                    className="mt-3 px-4 py-2 bg-[#1bb49e] text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    الانتقال لاستعراض كافة المدن ({profile.cities.length})
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {(selectedProvinceFilter === 'all' 
                    ? provincesList 
                    : provincesList.filter(p => p.id === selectedProvinceFilter)
                  ).map((prov) => (
                    <div
                      key={prov.id}
                      className="bg-white border border-stone-200 hover:border-[#1bb49e] rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3.5">
                        {/* Province Title & Badges */}
                        <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {prov.type_label_ar}
                              </span>
                              <span className="text-xs text-stone-400 font-mono">{prov.province_name_en}</span>
                            </div>
                            <h4 className="text-lg font-black text-stone-900 mt-1">{prov.province_name_ar}</h4>
                            <p className="text-xs text-[#1bb49e] font-bold flex items-center gap-1 mt-0.5">
                              <Landmark className="w-3.5 h-3.5" />
                              <span>العاصمة الإدارية: <strong>{prov.administrative_capital_ar}</strong></span>
                            </p>
                          </div>

                          <div className="text-left shrink-0">
                            <span className="text-[11px] font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200 block">
                              👥 {prov.population_approx}
                            </span>
                            {prov.area_km2 && (
                              <span className="text-[10px] text-stone-500 block mt-1">
                                المساحة: {typeof prov.area_km2 === 'number' ? prov.area_km2.toLocaleString('ar-EG') : prov.area_km2} كم²
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Geographic & Economic Profile */}
                        <div className="space-y-2 text-xs">
                          {prov.geographic_location_ar && (
                            <div className="bg-stone-50 rounded-xl p-2.5 text-stone-600 leading-relaxed border border-stone-150">
                              <span className="font-bold text-stone-900 block text-[11px] mb-0.5 flex items-center gap-1">
                                <Compass className="w-3.5 h-3.5 text-[#1bb49e]" />
                                الموقع الجغرافي والبيئة:
                              </span>
                              {prov.geographic_location_ar}
                            </div>
                          )}

                          {prov.economic_specialization_ar && (
                            <div className="bg-emerald-50/70 rounded-xl p-2.5 text-emerald-950 leading-relaxed border border-emerald-200/50">
                              <span className="font-bold text-emerald-900 block text-[11px] mb-0.5 flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                التخصص والعمود الفقري الاقتصادي:
                              </span>
                              {prov.economic_specialization_ar}
                            </div>
                          )}
                        </div>

                        {/* Landmarks */}
                        {prov.famous_landmarks_ar && prov.famous_landmarks_ar.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-stone-600 block">أبرز المعالم والرموز:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {prov.famous_landmarks_ar.map((lm, idx) => (
                                <span key={idx} className="bg-stone-100 text-stone-700 text-[10px] px-2 py-0.5 rounded-md border border-stone-200">
                                  🏛️ {lm}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Key Cities under this Province */}
                        <div className="space-y-2 pt-2 border-t border-stone-100">
                          <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#1bb49e]" />
                              المدن والمراكز الحضرية التابعة ({prov.key_cities?.length || 0}):
                            </span>
                          </div>

                          <div className="space-y-2">
                            {prov.key_cities?.map((city, cIdx) => (
                              <div
                                key={cIdx}
                                className="bg-white border border-stone-200 hover:border-emerald-400 rounded-xl p-3 shadow-2xs space-y-1.5 transition-all"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-sm font-bold text-stone-900">{city.name_ar}</h5>
                                    {city.name_en && (
                                      <span className="text-[10px] text-stone-400 font-mono">{city.name_en}</span>
                                    )}
                                    {city.is_capital && (
                                      <span className="text-[9px] bg-amber-100 text-amber-900 font-black px-1.5 py-0.5 rounded border border-amber-200">
                                        العاصمة
                                      </span>
                                    )}
                                  </div>
                                  {city.population_approx && (
                                    <span className="text-[10px] text-stone-500 font-semibold">
                                      {city.population_approx}
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-stone-600 leading-relaxed">
                                  {city.description_ar}
                                </p>

                                {/* Mini Indicators */}
                                <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-stone-600">
                                  {city.cost_index !== undefined && (
                                    <span className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                                      <Coins className="w-3 h-3 text-amber-600" />
                                      المعيشة: {city.cost_index}/100
                                    </span>
                                  )}
                                  {city.safety_score !== undefined && (
                                    <span className="bg-indigo-50 text-indigo-800 px-1.5 py-0.5 rounded border border-indigo-200 flex items-center gap-1">
                                      <ShieldCheck className="w-3 h-3 text-indigo-600" />
                                      الأمان: {city.safety_score}%
                                    </span>
                                  )}
                                  {city.internet_score !== undefined && (
                                    <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                                      <Wifi className="w-3 h-3 text-emerald-600" />
                                      الإنترنت: {city.internet_score}%
                                    </span>
                                  )}
                                </div>

                                {/* City Industries */}
                                {city.famous_industries && city.famous_industries.length > 0 && (
                                  <div className="flex flex-wrap gap-1 pt-1">
                                    {city.famous_industries.map((ind, i) => (
                                      <span key={i} className="text-[9px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded">
                                        💼 {ind}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                        <button
                          onClick={() => setSelectedProvinceDetail(prov)}
                          className="font-bold text-stone-700 hover:text-stone-900 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>عرض بطاقة {prov.type_label_ar} الكاملة</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenAIWithPrompt?.(`قدم لي تحليلاً اقتصادياً واستثمارياً وسياحياً معمقاً حول ${prov.province_name_ar} في ${profile.name_ar} وعاصمتها ${prov.administrative_capital_ar}`)}
                          className="text-[11px] font-bold text-[#1bb49e] hover:text-[#169b88] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#1bb49e]" />
                          <span>استشر AI</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE 2: CITIES GRID */}
          {citiesViewMode === 'cities_grid' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-stone-900">المدن والمراكز الحضرية ({filteredCities.length})</h4>
                  <p className="text-xs text-stone-500">مؤشرات الأمان والإنترنت وجودة الحياة ومستوى تكلفة المعيشة</p>
                </div>
                {profile.capital_city && (
                  <span className="text-xs bg-stone-100 text-stone-800 font-bold px-3 py-1 rounded-lg border border-stone-200">
                    العاصمة: {profile.capital_city}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCities.map((city) => (
                  <div
                    key={city.id}
                    id={`city-card-exp-${city.id}`}
                    className="bg-white border border-stone-200 hover:border-[#1bb49e] rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[11px] font-semibold text-[#1bb49e] block">
                            {city.region_name || 'المنطقة الحضرية'}
                          </span>
                          <h4 className="text-base font-bold text-stone-900">{city.name_ar}</h4>
                          {city.name_en && (
                            <span className="text-xs text-stone-400 font-mono">{city.name_en}</span>
                          )}
                        </div>
                        <span className="p-2 bg-stone-50 text-stone-600 rounded-xl">
                          <MapPin className="w-4 h-4 text-[#1bb49e]" />
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                        {city.description_ar || 'مركز حضري متكامل لخدمات المغتربين وفرص الاستقرار والعمل.'}
                      </p>

                      {/* Highlights (Area, Industries, Landmarks) */}
                      <div className="space-y-1.5 pt-1 text-[11px]">
                        {city.area_km2 && (
                          <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                            <Compass className="w-3.5 h-3.5 text-[#1bb49e] shrink-0" />
                            <span>المساحة: <strong>{city.area_km2.toLocaleString('ar-EG')} كم²</strong> {city.population_approx ? `• السكان: ${city.population_approx}` : ''}</span>
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

                      {/* Quality indicators */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px] text-stone-600">
                        <div className="flex items-center gap-1.5 bg-stone-50 p-1.5 rounded-lg">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                          <span>الأمان: <strong>{city.safety_score || 75}%</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-stone-50 p-1.5 rounded-lg">
                          <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                          <span>الإنترنت: <strong>{city.internet_score || 80}%</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-stone-50 p-1.5 rounded-lg">
                          <Coins className="w-3.5 h-3.5 text-amber-500" />
                          <span>المعيشة: <strong>{city.cost_index || 50}/100</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-stone-50 p-1.5 rounded-lg">
                          <SunMedium className="w-3.5 h-3.5 text-orange-500" />
                          <span>المناخ: <strong>{city.weather_score || 85}%</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setSelectedCityDetail(city)}
                        className="text-stone-500 hover:text-stone-800 font-semibold cursor-pointer"
                      >
                        تفاصيل المدينة
                      </button>
                      {onSelectCity && (
                        <button
                          onClick={() => onSelectCity(city)}
                          className="font-bold text-[#1bb49e] hover:text-[#169b88] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>تصفح الفرص</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODAL: PROVINCE DEEP DOSSIER */}
          {selectedProvinceDetail && (
            <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-start justify-between border-b border-stone-150 pb-4">
                  <div>
                    <span className="text-xs font-bold text-[#1bb49e] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {selectedProvinceDetail.type_label_ar} • {profile.name_ar}
                    </span>
                    <h3 className="text-2xl font-black text-stone-900 mt-1">{selectedProvinceDetail.province_name_ar}</h3>
                    <p className="text-xs text-stone-400 font-mono">{selectedProvinceDetail.province_name_en}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProvinceDetail(null)}
                    className="p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-150">
                    <span className="text-stone-400 text-[10px] block">العاصمة الإدارية</span>
                    <strong className="text-stone-900 font-black text-sm">{selectedProvinceDetail.administrative_capital_ar}</strong>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-150">
                    <span className="text-stone-400 text-[10px] block">تعداد السكان</span>
                    <strong className="text-stone-900 font-black text-sm">{selectedProvinceDetail.population_approx}</strong>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-150">
                    <span className="text-stone-400 text-[10px] block">المساحة الإجمالية</span>
                    <strong className="text-stone-900 font-black text-sm">
                      {typeof selectedProvinceDetail.area_km2 === 'number' ? selectedProvinceDetail.area_km2.toLocaleString('ar-EG') : selectedProvinceDetail.area_km2} كم²
                    </strong>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-900 block text-xs mb-1">الموقع الجغرافي والحدود الطبيعية:</span>
                    <p>{selectedProvinceDetail.geographic_location_ar}</p>
                  </div>

                  <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200 text-emerald-950">
                    <span className="font-bold text-emerald-900 block text-xs mb-1">التخصص والركائز الاقتصادية والصناعية:</span>
                    <p>{selectedProvinceDetail.economic_specialization_ar}</p>
                  </div>

                  {selectedProvinceDetail.famous_landmarks_ar?.length > 0 && (
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-150">
                      <span className="font-bold text-stone-900 block text-xs mb-1.5">أبرز المعالم والرموز:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProvinceDetail.famous_landmarks_ar.map((lm, i) => (
                          <span key={i} className="bg-white text-stone-800 text-[11px] px-2.5 py-1 rounded-lg border border-stone-200 font-semibold shadow-2xs">
                            🏛️ {lm}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProvinceDetail.key_cities?.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="font-bold text-stone-900 block text-xs">المدن والمراكز الحضرية التابعة:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedProvinceDetail.key_cities.map((city, idx) => (
                          <div key={idx} className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-[11px] space-y-1">
                            <div className="flex items-center justify-between font-bold text-stone-900">
                              <span>{city.name_ar}</span>
                              {city.is_capital && (
                                <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">عاصمة</span>
                              )}
                            </div>
                            <p className="text-[10px] text-stone-600 line-clamp-2">{city.description_ar}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-150 flex items-center justify-between">
                  <button
                    onClick={() => {
                      onOpenAIWithPrompt?.(`قدم لي تحليلاً اقتصادياً واستثمارياً ومعيشياً شاملاً عن ${selectedProvinceDetail.province_name_ar} في ${profile.name_ar}`);
                      setSelectedProvinceDetail(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#1bb49e] hover:bg-[#169b88] text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-100" />
                    <span>استشر DARB AI حول هذه {selectedProvinceDetail.type_label_ar}</span>
                  </button>
                  <button
                    onClick={() => setSelectedProvinceDetail(null)}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: OUTINGS, LEISURE & PUBLIC SPACES */}
      {activeTab === 'outings' && (
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-l from-[#071a2b] via-[#0d2a45] to-[#082035] text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-500/20 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-[#8be4d4] text-xs font-bold border border-emerald-500/30">
                  <Footprints className="w-3.5 h-3.5" />
                  <span>دليل الفسح والترفيه الشامل • {profile.name_ar}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  أجمل الخروجات والفسح والأماكن العامة في {profile.name_ar}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed">
                  استكشف تفاصيل الأماكن العامة والحدائق والكورنيش والمعالم التاريخية والأسواق الشعبية؛ متضمنة مواعيد الدخول الرسمية، تعرفة التذاكر للمواطن والزائر غير المقيم، وأقرب محطات النقل والمترو.
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 text-center">
                  <span className="text-[10px] text-stone-300 block">إجمالي الوجهات</span>
                  <span className="text-base font-black text-[#8be4d4]">{allOutings.length} أماكن</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 text-center">
                  <span className="text-[10px] text-stone-300 block">المدن المشمولة</span>
                  <span className="text-base font-black text-emerald-300">{outingCities.length} مدن</span>
                </div>
              </div>
            </div>

            {/* Quick Guarantees Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2 text-stone-200">
                <Ticket className="w-4 h-4 text-[#8be4d4] shrink-0" />
                <span>تعرفة دخول موثقة للمواطن والزائر غير المقيم</span>
              </div>
              <div className="flex items-center gap-2 text-stone-200">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>مواعيد العمل الرسمية والعطلات والمناسبات</span>
              </div>
              <div className="flex items-center gap-2 text-stone-200">
                <Compass className="w-4 h-4 text-sky-400 shrink-0" />
                <span>إرشادات أقرب محطات المترو ووسائل النقل الذكي</span>
              </div>
            </div>
          </div>

          {/* Filter Toolbar: Categories & Cities */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3.5 shadow-2xs">
            
            {/* Category Chips */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
                <span>تصفية حسب نوع الخروجة:</span>
                <span className="text-[11px] font-mono">{filteredOutings.length} نتيجة</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  { id: 'all', label: 'الكل', count: allOutings.length, icon: Sparkles },
                  { id: 'parks', label: '🌳 حدائق ومنتزهات', count: allOutings.filter(o => o.category === 'parks').length },
                  { id: 'promenades', label: '🚶 ممشى وكورنيش', count: allOutings.filter(o => o.category === 'promenades').length },
                  { id: 'historical', label: '🏛️ معالم تاريخية وتراثية', count: allOutings.filter(o => o.category === 'historical').length },
                  { id: 'culture_museums', label: '🎭 ثقافة ومتاحف', count: allOutings.filter(o => o.category === 'culture_museums').length },
                  { id: 'entertainment', label: '🎡 أماكن ترفيهية', count: allOutings.filter(o => o.category === 'entertainment').length },
                  { id: 'markets_food', label: '🍢 أسواق ومطاعم شعبية', count: allOutings.filter(o => o.category === 'markets_food').length },
                  { id: 'nature_beaches', label: '🏖️ شواطئ وطبيعة', count: allOutings.filter(o => o.category === 'nature_beaches').length },
                ].filter(cat => cat.id === 'all' || cat.count > 0).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedOutingCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                      selectedOutingCategory === cat.id
                        ? 'bg-[#1bb49e] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedOutingCategory === cat.id ? 'bg-white/25 text-white' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* City Filter Chips if more than 1 city */}
            {outingCities.length > 1 && (
              <div className="pt-2 border-t border-stone-100 flex items-center gap-2 overflow-x-auto text-xs">
                <span className="text-stone-500 font-semibold text-xs shrink-0 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1bb49e]" />
                  <span>المدينة:</span>
                </span>
                <button
                  onClick={() => setSelectedOutingCity('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    selectedOutingCity === 'all'
                      ? 'bg-stone-800 text-white font-bold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  جميع المدن
                </button>
                {outingCities.map((cityName) => (
                  <button
                    key={cityName}
                    onClick={() => setSelectedOutingCity(cityName)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      selectedOutingCity === cityName
                        ? 'bg-[#071a2b] text-white font-bold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cityName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Outings Cards Grid */}
          {filteredOutings.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center space-y-3">
              <Footprints className="w-10 h-10 text-stone-300 mx-auto" />
              <h4 className="text-sm font-bold text-stone-800">لا توجد خروجات مطابقة للتصفية الحالية</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                جرب تغيير التصنيف المختار أو مسح نص البحث في أعلى الصفحة لاستعراض الأماكن الأخرى.
              </p>
              <button
                onClick={() => {
                  setSelectedOutingCategory('all');
                  setSelectedOutingCity('all');
                  setInCountrySearch('');
                }}
                className="px-4 py-2 bg-[#1bb49e] text-white text-xs font-bold rounded-xl hover:bg-[#169b88] transition-all cursor-pointer"
              >
                إعادة ضبط عوامل التصفية
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredOutings.map((outing) => (
                <div
                  key={outing.id}
                  className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Container with Badges */}
                    <div className="relative h-60 w-full overflow-hidden bg-stone-100">
                      <img
                        src={outing.image_url}
                        alt={outing.name_ar}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/15" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3.5 right-3.5 left-3.5 flex items-center justify-between gap-2">
                        <span className="bg-black/60 backdrop-blur-md text-[#8be4d4] border border-white/15 px-3 py-1 rounded-full text-xs font-bold shadow-md">
                          {outing.category_label}
                        </span>
                        {outing.family_friendly && (
                          <span className="bg-emerald-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1">
                            <span>👨‍👩‍👧‍👦 مناسب للعائلات</span>
                          </span>
                        )}
                      </div>

                      {/* Bottom Info in Image */}
                      <div className="absolute bottom-3.5 right-3.5 left-3.5 text-white space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#8be4d4]" />
                            {outing.city_name}
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-black text-white drop-shadow-sm">
                          {outing.name_ar}
                        </h4>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 sm:p-6 space-y-4">
                      
                      {/* Description */}
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                        {outing.description_ar}
                      </p>

                      {/* Highlights */}
                      {outing.highlights && outing.highlights.length > 0 && (
                        <div className="bg-stone-50 border border-stone-150 rounded-2xl p-3.5 space-y-2">
                          <span className="text-[11px] font-bold text-stone-900 block">✨ أبرز ما يميز المكان والأنشطة:</span>
                          <ul className="space-y-1.5 text-xs text-stone-600">
                            {outing.highlights.map((h, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#1bb49e] shrink-0 mt-0.5" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* PRICING COMPARISON MATRIX (Citizen vs Foreign Tourist) */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-900 flex items-center gap-1.5">
                            <Ticket className="w-4 h-4 text-emerald-600" />
                            <span>تعرفة الدخول والتذاكر الرسمية</span>
                          </span>
                          <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                            محدثة ومعتمدة
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          
                          {/* Citizen Price Card */}
                          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/80 rounded-2xl p-3.5 space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                                <span>المواطن والمقيم</span>
                              </span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                                تعرفة مخفضة
                              </span>
                            </div>
                            <div className="text-sm font-black text-emerald-950">
                              {outing.entry_tickets.citizen_price_ar}
                            </div>
                          </div>

                          {/* Foreign Tourist Price Card */}
                          <div className="bg-gradient-to-br from-sky-50 to-indigo-50/40 border border-sky-200/80 rounded-2xl p-3.5 space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-sky-900 flex items-center gap-1">
                                <Globe2 className="w-3.5 h-3.5 text-sky-700" />
                                <span>الزائر غير المقيم (السياح)</span>
                              </span>
                              <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded">
                                السائح الدولي
                              </span>
                            </div>
                            <div className="text-sm font-black text-sky-950">
                              {outing.entry_tickets.foreigner_tourist_price_ar}
                            </div>
                          </div>

                        </div>

                        {/* Ticket Notes */}
                        {outing.entry_tickets.ticket_notes_ar && (
                          <p className="text-[11px] text-stone-500 bg-stone-50 p-2 rounded-xl border border-stone-150 leading-relaxed">
                            💡 <strong>ملاحظة التذاكر:</strong> {outing.entry_tickets.ticket_notes_ar}
                          </p>
                        )}
                      </div>

                      {/* OPENING HOURS & SCHEDULES */}
                      <div className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-3.5 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>مواعيد الدخول للاماكن العامة وأيام العمل:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-800">
                          <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
                            <span className="text-stone-400 block text-[10px]">أيام العمل:</span>
                            <span className="font-semibold">{outing.opening_hours.days_ar}</span>
                          </div>
                          <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
                            <span className="text-stone-400 block text-[10px]">ساعات الدخول:</span>
                            <span className="font-semibold text-emerald-800">{outing.opening_hours.hours_ar}</span>
                          </div>
                        </div>
                        {outing.opening_hours.notes_ar && (
                          <p className="text-[11px] text-amber-900 leading-relaxed">
                            ℹ️ {outing.opening_hours.notes_ar}
                          </p>
                        )}
                      </div>

                      {/* Location, Metro & Best Time */}
                      <div className="space-y-2 text-xs">
                        {outing.location_address && (
                          <div className="flex items-start gap-2 text-stone-600">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                            <span><strong>العنوان:</strong> {outing.location_address}</span>
                          </div>
                        )}
                        {outing.metro_or_transport_tip && (
                          <div className="flex items-start gap-2 text-stone-600">
                            <Compass className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                            <span><strong>المواصلات والمترو:</strong> {outing.metro_or_transport_tip}</span>
                          </div>
                        )}
                        {outing.best_time_to_visit && (
                          <div className="flex items-start gap-2 text-stone-600">
                            <SunMedium className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                            <span><strong>أفضل وقت للزيارة:</strong> {outing.best_time_to_visit}</span>
                          </div>
                        )}
                      </div>

                      {/* Facilities Chips */}
                      {outing.facilities && outing.facilities.length > 0 && (
                        <div className="pt-2 border-t border-stone-100">
                          <div className="flex flex-wrap gap-1.5">
                            {outing.facilities.map((fac, i) => (
                              <span key={i} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-lg border border-stone-200">
                                ✓ {fac}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-100 flex flex-wrap gap-2.5">
                    <button
                      onClick={() => onOpenAIWithPrompt?.(`قدم لي برنامجاً مفصلاً لقضاء يوم ممتع في "${outing.name_ar}" بمدينة ${outing.city_name} (${profile.name_ar}) مع ترشيح أفضل المطاعم والأنشطة القريبة وتفاصيل الانتقال.`)}
                      className="flex-1 py-2.5 px-4 bg-[#1bb49e] hover:bg-[#169b88] text-white text-xs font-bold rounded-xl transition-all shadow-xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-100" />
                      <span>اسأل DARB AI عن خطة الخروجة</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        const shareText = `${outing.name_ar} - ${outing.city_name} (${profile.name_ar})\nسعر المواطن: ${outing.entry_tickets.citizen_price_ar}\nسعر الزائر: ${outing.entry_tickets.foreigner_tourist_price_ar}\nالمواعيد: ${outing.opening_hours.hours_ar}\nالعنوان: ${outing.location_address || ''}`;
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(shareText);
                          alert('تم نسخ تفاصيل الخروجة بنجاح إلى الحافظة!');
                        }
                      }}
                      className="px-3.5 py-2.5 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      title="نسخ تفاصيل الخروجة"
                    >
                      <Share2 className="w-3.5 h-3.5 text-stone-500" />
                      <span>مشاركة</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT: TRAVELER SUITE & VISA CHECKER */}
      {activeTab === 'traveler_suite' && (
        <div className="space-y-6 animate-fadeIn">
          <TravelerInteractiveSuite 
            initialCountryCode={profile.country_code}
          />
        </div>
      )}

      {/* TAB CONTENT 4: TOURISM, SEASONS & TRANSPORT */}
      {activeTab === 'tourism' && (
        <div className="space-y-6">
          
          {/* Visiting Seasons & Strict Non-Live Disclaimer */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-900">
                <Calendar className="w-4 h-4 text-orange-600" />
                <h3 className="font-bold text-sm">مواسم الزيارة المرجعية (Reference Data)</h3>
              </div>
              <span className="text-[10px] font-bold text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                قاعدة حوكمة: لا توصية سفر تلقائية
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.visiting_seasons.map((season, idx) => (
                <div key={idx} className="bg-white border border-stone-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900">{season.season}</span>
                    <span className="font-mono text-[11px] text-[#1bb49e] font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      {season.months}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">{season.climate_description}</p>
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 leading-relaxed">
                    ⚠️ {season.travel_advisory_note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Landmarks Grid */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#1bb49e]" />
              <span>أهم المعالم والمواقع التاريخية ({filteredLandmarks.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredLandmarks.map((lm, idx) => (
                <div key={idx} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-2 shadow-2xs">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {lm.type}
                  </span>
                  <h4 className="text-sm font-bold text-stone-900">{lm.name_ar}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{lm.description_ar}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Airports and Ports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Airports */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-stone-900">
                <Plane className="w-4 h-4 text-sky-600" />
                <h4 className="font-bold text-xs sm:text-sm">المطارات الدولية والرئيسية</h4>
              </div>
              <div className="space-y-2">
                {profile.airports.map((ap, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-stone-900 block">{ap.name_ar}</span>
                      <span className="text-[10px] text-stone-500">{ap.city}</span>
                    </div>
                    <span className="font-mono font-bold text-stone-700 bg-white px-2 py-0.5 rounded border border-stone-200">
                      {ap.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ports */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-stone-900">
                <Anchor className="w-4 h-4 text-teal-600" />
                <h4 className="font-bold text-xs sm:text-sm">الموانئ والمنافذ البحرية</h4>
              </div>
              <div className="space-y-2">
                {profile.seaports.map((port, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-stone-900 block">{port.name_ar}</span>
                      <span className="text-[10px] text-stone-500">{port.city}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      منفذ بحري
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT 5: ECONOMY & GROWTH INDICATORS */}
      {activeTab === 'economy' && (
        <div className="space-y-6">
          
          {/* Economic Governance Disclaimer Banner */}
          <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 space-y-1.5">
            <div className="font-extrabold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>حوكمة المؤشرات الاقتصادية (Reference Indicators Disclaimer)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              {profile.economic_disclaimer}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-2">
              <span className="text-[11px] text-stone-400 font-medium">الناتج المحلي الإجمالي المرجعي (GDP)</span>
              <h4 className="text-xl font-extrabold text-stone-900">{profile.gdp_reference}</h4>
              <span className="inline-block text-[10px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                سنة القياس: {profile.measurement_year}
              </span>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-2">
              <span className="text-[11px] text-stone-400 font-medium">معدل النمو الاقتصادي المرجعي</span>
              <h4 className="text-xl font-extrabold text-emerald-700">{profile.growth_rate_reference}</h4>
              <span className="inline-block text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                مؤشر مرجعي يخضع لتقلبات السوق
              </span>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-2">
              <span className="text-[11px] text-stone-400 font-medium">تصنيف البيانات في النظام</span>
              <h4 className="text-base font-bold text-stone-900">مؤشر استرشادي مرجعي</h4>
              <span className="inline-block text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                data_class: {profile.economic_data_class}
              </span>
            </div>

          </div>

          {/* Key Sectors */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>القطاعات الاقتصادية الرئيسية وفرص الاستثمار</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {profile.economic_sectors.map((sector, i) => (
                <div key={i} className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-semibold text-stone-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1bb49e] shrink-0" />
                  <span>{sector}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: JOBS & EXPAT SERVICES */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">الفرص والخدمات المرتبطة بـ {profile.name_ar}</h3>
              <p className="text-xs text-stone-500">وظائف شاغرة، مكاتب محاماة، استشارات إقامة، وسكن معتمد</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recent Jobs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#1bb49e]" />
                  <span>الوظائف الشاغرة ({profile.jobs_count})</span>
                </h4>
              </div>

              {profile.recent_jobs && profile.recent_jobs.length > 0 ? (
                <div className="space-y-2.5">
                  {profile.recent_jobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => onSelectJob?.(job)}
                      className="bg-white border border-stone-200 hover:border-[#1bb49e] p-4 rounded-xl shadow-2xs cursor-pointer transition-all flex items-start justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#1bb49e] bg-emerald-50 px-2 py-0.5 rounded">
                          {job.city_name || 'كل المدن'}
                        </span>
                        <h5 className="font-bold text-stone-900 text-xs">{job.title}</h5>
                        <p className="text-[11px] text-stone-500">{job.company_name}</p>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-stone-400 mt-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-8 text-center text-xs text-stone-500">
                  لا توجد وظائف معلنة حالياً لهذه الدولة.
                </div>
              )}
            </div>

            {/* Recent Services */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>خدمات المغتربين والوافدين ({profile.services_count})</span>
                </h4>
              </div>

              {profile.recent_services && profile.recent_services.length > 0 ? (
                <div className="space-y-2.5">
                  {profile.recent_services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => onSelectService?.(service)}
                      className="bg-white border border-stone-200 hover:border-[#1bb49e] p-4 rounded-xl shadow-2xs cursor-pointer transition-all flex items-start justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {service.category}
                        </span>
                        <h5 className="font-bold text-stone-900 text-xs">{service.name_ar}</h5>
                        <p className="text-[11px] text-stone-500 line-clamp-1">{service.description_ar}</p>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-stone-400 mt-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-8 text-center text-xs text-stone-500">
                  لا توجد خدمات مضافة حالياً لهذه الدولة.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT 7: PROVENANCE & GOVERNANCE */}
      {activeTab === 'provenance' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-900">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-sm">سجل الإسناد والحوكمة المعرفية (Provenance Registry)</h3>
                  <p className="text-xs text-stone-500">تتبع مصداقية مصادر بيانات الدولة وفق معايير DARB GKE V1.1</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                الثقة: {profile.confidence.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="bg-stone-50 p-4 rounded-xl space-y-2 border border-stone-100">
                <div className="flex justify-between">
                  <span className="text-stone-500">المستند المصدر المعتمد:</span>
                  <span className="font-bold text-stone-900">{profile.source_document}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">تاريخ آخر تدقيق واعتماد:</span>
                  <span className="font-mono font-bold text-stone-900">{new Date(profile.verified_at).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">معرّف المراجع البشري:</span>
                  <span className="font-mono text-stone-700">{profile.reviewer_id || 'darb_editorial_lead'}</span>
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl space-y-2 border border-stone-100">
                <div className="flex justify-between">
                  <span className="text-stone-500">سياسة النشر التلقائي (Auto Publish):</span>
                  <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">OFF (معطل حوكمياً)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">حالة الطراوة (Freshness):</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{profile.freshness_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">الحالة في النظام:</span>
                  <span className="font-mono font-bold text-stone-900">{profile.publication_status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Associated GKE Facts Accordion / List */}
          {(profile as any).gke_facts && (profile as any).gke_facts.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-900">
                  <FileText className="w-4 h-4 text-[#1bb49e]" />
                  <h4 className="font-bold text-xs sm:text-sm">الحقائق المنشورة في محرك المعرفة GKE ({filteredFacts.length})</h4>
                </div>
              </div>

              <div className="space-y-3">
                {filteredFacts.map((fact: any) => (
                  <div key={fact.id} className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{fact.axis_name_ar || fact.axis} — {fact.fact_key}</span>
                      <span className="text-[10px] font-mono text-emerald-800 bg-white px-2 py-0.5 rounded border border-stone-200">
                        {fact.confidence} confidence
                      </span>
                    </div>
                    <p className="text-stone-700 leading-relaxed text-[11px]">{fact.fact_value}</p>
                    <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-200/50 flex justify-between">
                      <span>المصدر: {fact.source_document || 'الدليل المطور'}</span>
                      <span className="font-mono">{fact.freshness_status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* City Detail Modal if selected */}
      {selectedCityDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-fadeIn my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1bb49e] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {selectedCityDetail.region_name || 'المنطقة الحضرية'}
                  </span>
                  {selectedCityDetail.area_km2 && (
                    <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                      📐 {selectedCityDetail.area_km2.toLocaleString('ar-EG')} كم²
                    </span>
                  )}
                  {selectedCityDetail.population_approx && (
                    <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full">
                      👥 {selectedCityDetail.population_approx}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
                  <span>{selectedCityDetail.name_ar}</span>
                  {selectedCityDetail.name_en && (
                    <span className="text-sm text-stone-400 font-mono font-normal">({selectedCityDetail.name_en})</span>
                  )}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCityDetail(null)}
                className="text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 p-2 rounded-full text-sm font-bold transition-colors cursor-pointer"
                title="إغلاق"
              >
                ✕
              </button>
            </div>

            {/* City Overview Description */}
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-100">
              {selectedCityDetail.description_ar}
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
                  {selectedCityDetail.area_description_ar && (
                    <p>{selectedCityDetail.area_description_ar}</p>
                  )}
                  <div className="pt-1 flex flex-wrap gap-2 text-[11px]">
                    {selectedCityDetail.area_km2 && (
                      <span className="bg-white text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold">
                        المساحة الإجمالية: {selectedCityDetail.area_km2.toLocaleString('ar-EG')} كم²
                      </span>
                    )}
                    {selectedCityDetail.population_approx && (
                      <span className="bg-white text-stone-700 px-2 py-0.5 rounded-md border border-stone-200 font-medium">
                        التقدير السكاني: {selectedCityDetail.population_approx}
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
                  {selectedCityDetail.customs_and_traditions_ar || 'تتميز المدينة بكرم الضيافة العربي والتكافل الاجتماعي والمناسبات والمواسم الشعبية الخاصة.'}
                </p>
              </div>

              {/* 3. الإنتاج والعمل والصناعات */}
              <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>الإنتاج وسوق العمل والصناعات الشهيرة</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {selectedCityDetail.production_and_work_ar || 'مركز نشط في التجارة والخدمات والحرف التخصصية وتوفير بيئة ملائمة للوظائف والاستثمار.'}
                </p>
                {selectedCityDetail.famous_industries && selectedCityDetail.famous_industries.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedCityDetail.famous_industries.map((ind, i) => (
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
                  {selectedCityDetail.historic_architecture_ar || 'تضم المدينة شواهد أثرية وصروحاً معمارية تجمع بين عبق التاريخ ورونق التطور الحضري.'}
                </p>
                {selectedCityDetail.famous_landmarks && selectedCityDetail.famous_landmarks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedCityDetail.famous_landmarks.map((lm, i) => (
                      <span key={i} className="bg-white text-purple-800 px-2 py-0.5 rounded-lg border border-purple-200 text-[10px] font-semibold">
                        🏛️ {lm}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Quality Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>مستوى الأمان: <strong>{selectedCityDetail.safety_score}%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-emerald-500" />
                <span>سرعة الإنترنت: <strong>{selectedCityDetail.internet_score}%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>مؤشر المعيشة: <strong>{selectedCityDetail.cost_index}/100</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <SunMedium className="w-4 h-4 text-orange-500" />
                <span>ملاءمة المناخ: <strong>{selectedCityDetail.weather_score}%</strong></span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              {onSelectCity && (
                <button
                  onClick={() => {
                    const c = selectedCityDetail;
                    setSelectedCityDetail(null);
                    onSelectCity(c);
                  }}
                  className="flex-1 py-2.5 px-4 bg-[#1bb49e] hover:bg-[#169b88] text-white text-xs font-bold rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>استعراض وظائف وخدمات {selectedCityDetail.name_ar}</span>
                </button>
              )}
              {onOpenAIWithPrompt && (
                <button
                  onClick={() => {
                    const c = selectedCityDetail;
                    setSelectedCityDetail(null);
                    onOpenAIWithPrompt(`حدثني بالتفصيل عن الحياة والعمل والعادات والمناخ وتكلفة المعيشة في مدينة ${c.name_ar}`);
                  }}
                  className="py-2.5 px-4 bg-[#071a2b] hover:bg-[#0d2a45] text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>استفسر عبر DARB AI</span>
                </button>
              )}
              <button
                onClick={() => setSelectedCityDetail(null)}
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
