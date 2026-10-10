import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Train, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  Search, 
  CreditCard, 
  Smartphone, 
  Sparkles,
  Utensils,
  Moon,
  Clock,
  ArrowRight,
  ArrowLeftRight,
  Calculator,
  Coins,
  Luggage,
  PhoneCall,
  ShieldAlert,
  Zap,
  CheckSquare,
  Square,
  RotateCcw,
  Volume2,
  Maximize2,
  Minimize2,
  Calendar,
  AlertTriangle,
  Info
} from 'lucide-react';
import { ARAB_PASSPORTS, VISA_INTELLIGENCE, getVisaRuleForPair } from '../data/visa-rules-data';
import { TRANSIT_SYSTEMS_DATA, TransitSystem } from '../data/transit-rail-data';
import { HALAL_PRAYER_DATA } from '../data/halal-prayer-data';
import { FOREIGN_COUNTRIES_IMAGERY } from '../data/foreign-countries-imagery';
import { ALL_CURRENCIES, COUNTRY_BUDGET_PROFILES, CurrencyRate, CountryBudgetProfile } from '../data/currency-budget-data';
import { SMART_PACKING_ITEMS, ELECTRICAL_PLUG_DATABASE, CURATED_ITINERARIES, PackingItem } from '../data/travel-packing-itinerary-data';
import { EMERGENCY_CONTACTS_DATA, MULTILINGUAL_SOS_CARDS } from '../data/travel-emergency-data';

export interface TravelerInteractiveSuiteProps {
  initialActiveModule?: 'visa' | 'transit' | 'halal' | 'budget' | 'packing' | 'emergency' | 'comparator';
  initialCountryCode?: string;
  onNavigateToCountry?: (countryCode: string) => void;
}

export default function TravelerInteractiveSuite({
  initialActiveModule = 'visa',
  initialCountryCode,
  onNavigateToCountry
}: TravelerInteractiveSuiteProps) {
  const [activeModule, setActiveModule] = useState<'visa' | 'transit' | 'halal' | 'budget' | 'packing' | 'emergency' | 'comparator'>(initialActiveModule);

  // Sync with prop changes
  useEffect(() => {
    setActiveModule(initialActiveModule);
  }, [initialActiveModule]);

  // Sync with initialCountryCode if provided
  useEffect(() => {
    if (initialCountryCode) {
      const code = initialCountryCode.toUpperCase();
      setSelectedDestination(code);
      setSelectedHalalCountry(code);
      setSelectedBudgetCountry(code);
      setSelectedPackingCountry(code);
      setSelectedEmergencyCountry(code);
      setCompareCountryA(code);
    }
  }, [initialCountryCode]);

  // 1. Visa Checker State
  const [selectedPassport, setSelectedPassport] = useState<string>('SA'); // Default Saudi Arabia
  const [selectedDestination, setSelectedDestination] = useState<string>(initialCountryCode?.toUpperCase() || 'GB'); // Default United Kingdom
  const [destinationSearch, setDestinationSearch] = useState<string>('');

  // 2. Transit Guide State
  const [selectedTransitCityId, setSelectedTransitCityId] = useState<string>('istanbul');
  const [transitSearch, setTransitSearch] = useState<string>('');

  // 3. Halal Guide State
  const [selectedHalalCountry, setSelectedHalalCountry] = useState<string>(initialCountryCode?.toUpperCase() || 'GB');

  // 4. Budget & Currency State
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [fromCurrencyCode, setFromCurrencyCode] = useState<string>('SAR');
  const [toCurrencyCode, setToCurrencyCode] = useState<string>('GBP');
  const [selectedBudgetCountry, setSelectedBudgetCountry] = useState<string>(initialCountryCode?.toUpperCase() || 'GB');
  const [travelStyle, setTravelStyle] = useState<'backpacker' | 'moderate' | 'luxury'>('moderate');
  const [tripDays, setTripDays] = useState<number>(7);
  const [travelerCount, setTravelerCount] = useState<number>(2);

  // 5. Packing & Itinerary State
  const [selectedPackingCountry, setSelectedPackingCountry] = useState<string>(initialCountryCode?.toUpperCase() || 'GB');
  const [packingSeasonFilter, setPackingSeasonFilter] = useState<'all' | 'summer' | 'winter' | 'rain' | 'beach'>('all');
  const [packingTypeFilter, setPackingTypeFilter] = useState<'all' | 'leisure' | 'family' | 'business'>('all');
  const [checkedItemIds, setCheckedItemIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('darb_packing_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 6. Emergency & SOS State
  const [selectedEmergencyCountry, setSelectedEmergencyCountry] = useState<string>(initialCountryCode?.toUpperCase() || 'GB');
  const [sosLanguage, setSosLanguage] = useState<'en' | 'fr' | 'tr' | 'ja' | 'ru' | 'es'>('en');
  const [selectedSosCardId, setSelectedSosCardId] = useState<string>('sos-medical');
  const [isSosFullScreen, setIsSosFullScreen] = useState<boolean>(false);

  // 7. Destination Comparator State
  const [compareCountryA, setCompareCountryA] = useState<string>(initialCountryCode?.toUpperCase() || 'GB');
  const [compareCountryB, setCompareCountryB] = useState<string>('TR');
  const [compareDurationDays, setCompareDurationDays] = useState<number>(7);
  const [compareTravelers, setCompareTravelers] = useState<number>(2);
  const [compareFlightEstimateUSD, setCompareFlightEstimateUSD] = useState<number>(450);
  const [compareStyle, setCompareStyle] = useState<'backpacker' | 'moderate' | 'luxury'>('moderate');

  // Destinations list combining Arab and Foreign countries
  const allDestinations = Object.values(FOREIGN_COUNTRIES_IMAGERY);
  const filteredDestinations = allDestinations.filter(d => 
    d.name_ar.includes(destinationSearch) || 
    d.name_en.toLowerCase().includes(destinationSearch.toLowerCase()) ||
    d.capital_ar.includes(destinationSearch)
  );

  const activePassportData = ARAB_PASSPORTS.find(p => p.code === selectedPassport) || ARAB_PASSPORTS[0];
  const activeDestData = FOREIGN_COUNTRIES_IMAGERY[selectedDestination] || FOREIGN_COUNTRIES_IMAGERY['GB'];
  const currentVisaRule = getVisaRuleForPair(selectedPassport, selectedDestination);

  // Transit active data
  const filteredTransitSystems = TRANSIT_SYSTEMS_DATA.filter(t => 
    t.city_ar.includes(transitSearch) || 
    t.city_en.toLowerCase().includes(transitSearch.toLowerCase()) ||
    t.country_name_ar.includes(transitSearch)
  );
  const activeTransitSystem = TRANSIT_SYSTEMS_DATA.find(t => t.id === selectedTransitCityId) || TRANSIT_SYSTEMS_DATA[0];

  // Halal active data
  const availableHalalCountries = Object.keys(HALAL_PRAYER_DATA);
  const activeHalalData = HALAL_PRAYER_DATA[selectedHalalCountry] || HALAL_PRAYER_DATA['GB'];

  // Currency Converter Calculations
  const fromCurrency = ALL_CURRENCIES.find(c => c.code === fromCurrencyCode) || ALL_CURRENCIES[0];
  const toCurrency = ALL_CURRENCIES.find(c => c.code === toCurrencyCode) || ALL_CURRENCIES[1];

  const convertCurrency = (amount: number, from: CurrencyRate, to: CurrencyRate) => {
    // Convert to USD base first
    const usdAmount = amount / from.rateToUSD;
    return usdAmount * to.rateToUSD;
  };

  const convertedResult = convertCurrency(calcAmount, fromCurrency, toCurrency);
  const oneUnitConverted = convertCurrency(1, fromCurrency, toCurrency);
  const inverseUnitConverted = convertCurrency(1, toCurrency, fromCurrency);

  const handleSwapCurrencies = () => {
    const temp = fromCurrencyCode;
    setFromCurrencyCode(toCurrencyCode);
    setToCurrencyCode(temp);
  };

  // Budget Profile Calculations
  const activeBudgetProfile = COUNTRY_BUDGET_PROFILES[selectedBudgetCountry] || COUNTRY_BUDGET_PROFILES['GB'];
  const activeDailyCostsUSD = activeBudgetProfile.budget_daily_usd[travelStyle];
  const totalTripCostUSD = activeDailyCostsUSD.total * tripDays * (travelStyle === 'luxury' ? travelerCount : Math.max(1, travelerCount * 0.8));

  // Find target currency for budget country
  const budgetLocalCurrency = ALL_CURRENCIES.find(c => c.code === activeBudgetProfile.currency_code) || ALL_CURRENCIES[0];
  const totalTripCostLocal = totalTripCostUSD * budgetLocalCurrency.rateToUSD;

  // Packing Checklist handlers
  const toggleCheckItem = (id: string) => {
    const updated = { ...checkedItemIds, [id]: !checkedItemIds[id] };
    setCheckedItemIds(updated);
    try {
      localStorage.setItem('darb_packing_checklist', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const resetChecklist = () => {
    setCheckedItemIds({});
    try {
      localStorage.removeItem('darb_packing_checklist');
    } catch (e) {
      console.warn(e);
    }
  };

  const checkAllItems = (items: PackingItem[]) => {
    const updated: Record<string, boolean> = { ...checkedItemIds };
    items.forEach(it => { updated[it.id] = true; });
    setCheckedItemIds(updated);
    try {
      localStorage.setItem('darb_packing_checklist', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  // Filtered packing items
  const filteredPackingItems = SMART_PACKING_ITEMS.filter(it => {
    const seasonMatch = packingSeasonFilter === 'all' || !it.seasons || it.seasons.includes('all') || it.seasons.includes(packingSeasonFilter);
    const typeMatch = packingTypeFilter === 'all' || !it.tripTypes || it.tripTypes.includes('all') || it.tripTypes.includes(packingTypeFilter);
    return seasonMatch && typeMatch;
  });

  const checkedCount = filteredPackingItems.filter(it => checkedItemIds[it.id]).length;
  const packingProgressPercent = filteredPackingItems.length > 0 
    ? Math.round((checkedCount / filteredPackingItems.length) * 100)
    : 0;

  // Electrical Plug Data
  const activePlugData = ELECTRICAL_PLUG_DATABASE[selectedPackingCountry] || ELECTRICAL_PLUG_DATABASE['GB'];

  // Curated Itinerary
  const activeItinerary = CURATED_ITINERARIES.find(i => i.destination_code === selectedPackingCountry) || CURATED_ITINERARIES[0];

  // Emergency & SOS Data
  const activeEmergencyData = EMERGENCY_CONTACTS_DATA[selectedEmergencyCountry] || EMERGENCY_CONTACTS_DATA['GB'];
  const activeSosCard = MULTILINGUAL_SOS_CARDS.find(c => c.id === selectedSosCardId) || MULTILINGUAL_SOS_CARDS[0];

  return (
    <div className="space-y-8">
      {/* Module Selector Header */}
      <div className="bg-gradient-to-r from-[#071a2b] via-[#0f2e48] to-[#071a2b] p-6 rounded-2xl border border-stone-700 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>المرحلة الثالثة الموسعة • حقيبة وأدوات المسافر والمقيم التفاعلية المتكاملة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              منظومة أدوات السفر والعيش الذكية عالمياً
            </h2>
            <p className="text-stone-300 text-sm mt-1 max-w-2xl">
              منصة فورية متكاملة تضم فاحص التأشيرات، دليل المترو والقطارات، مرشد الحلال والقبلة، محوّل العملات وميزانية السفر، ومخطط حقيبة السفر وجواز الطوارئ والسفارات.
            </p>
          </div>

          {/* Module Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#061422] p-1.5 rounded-xl border border-stone-800">
            {[
              { id: 'visa', label: 'فاحص التأشيرات', icon: '🛂' },
              { id: 'transit', label: 'المترو والقطارات', icon: '🚆' },
              { id: 'halal', label: 'الحلال والمساجد', icon: '🕌' },
              { id: 'budget', label: 'العملات والميزانية', icon: '💰' },
              { id: 'packing', label: 'مخطط الحقيبة والرحلة', icon: '🧳' },
              { id: 'emergency', label: 'جواز الطوارئ وSOS', icon: '🚨' },
              { id: 'comparator', label: 'مقارن الوجهات والمواسم', icon: '⚖️' },
            ].map(mod => {
              const active = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <span>{mod.icon}</span>
                  <span>{mod.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODULE 1: SMART VISA CHECKER                                              */}
      {/* ========================================================================= */}
      {activeModule === 'visa' && (
        <div className="space-y-6">
          {/* Controls: Passport Selector & Destination Selector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Passport Selector Card */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                  الخطوة الأولى
                </span>
                <span className="text-xs text-stone-500">الجوازات العربية المعتمدة</span>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-800 mb-2">
                  اختر جنسية جواز السفر الخاص بك:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[360px] overflow-y-auto pr-1">
                  {ARAB_PASSPORTS.map(p => (
                    <button
                      key={p.code}
                      onClick={() => setSelectedPassport(p.code)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-right transition-all cursor-pointer ${
                        selectedPassport === p.code
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold ring-2 ring-emerald-500/20 shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.flag}</span>
                        <div>
                          <div className="text-xs sm:text-sm font-bold leading-tight">{p.name_ar}</div>
                          <div className="text-[11px] text-stone-500 font-normal">مواطن {p.nationality_ar}</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded text-stone-500">
                        {p.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Destination Selector Card */}
            <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                  الخطوة الثانية
                </span>
                <span className="text-xs text-stone-500">اختر وجهتك (60 دولة عربية وأجنبية)</span>
              </div>

              {/* Destination Search & Popular Shortcuts */}
              <div>
                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    placeholder="ابحث عن دولة الوجهة (مثل: بريطانيا، تركيا، المالديف، فرنسا، تايلاند، اليابان)..."
                    value={destinationSearch}
                    onChange={(e) => setDestinationSearch(e.target.value)}
                    className="w-full pr-10 pl-4 py-2.5 text-xs sm:text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>

                {/* Popular Destinations Quick Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  <span className="text-xs text-stone-500 font-medium">الأكثر زيارة:</span>
                  {[
                    { code: 'GB', name: 'بريطانيا 🇬🇧' },
                    { code: 'TR', name: 'تركيا 🇹🇷' },
                    { code: 'MV', name: 'المالديف 🇲🇻' },
                    { code: 'AZ', name: 'أذربيجان 🇦🇿' },
                    { code: 'FR', name: 'فرنسا 🇫🇷' },
                    { code: 'DE', name: 'ألمانيا 🇩🇪' },
                    { code: 'CH', name: 'سويسرا 🇨🇭' },
                    { code: 'MY', name: 'ماليزيا 🇲🇾' },
                    { code: 'TH', name: 'تايلاند 🇹🇭' },
                    { code: 'JP', name: 'اليابان 🇯🇵' },
                    { code: 'US', name: 'أمريكا 🇺🇸' },
                  ].map(quick => (
                    <button
                      key={quick.code}
                      onClick={() => setSelectedDestination(quick.code)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        selectedDestination === quick.code
                          ? 'bg-stone-900 text-white border-stone-900 font-bold'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {quick.name}
                    </button>
                  ))}
                </div>

                {/* Destinations Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {filteredDestinations.map(d => (
                    <button
                      key={d.country_code}
                      onClick={() => setSelectedDestination(d.country_code)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                        selectedDestination === d.country_code
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <span className="text-xl">{d.flag}</span>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate leading-tight">{d.name_ar}</div>
                        <div className="text-[10px] text-stone-400 truncate">{d.capital_ar}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visa Intelligence Result Banner */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-md overflow-hidden">
            <div className={`p-6 sm:p-8 text-white ${
              currentVisaRule.status === 'visa_free' ? 'bg-gradient-to-l from-emerald-800 to-teal-900' :
              currentVisaRule.status === 'voa' ? 'bg-gradient-to-l from-cyan-800 to-sky-950' :
              currentVisaRule.status === 'evisa' ? 'bg-gradient-to-l from-amber-700 to-orange-900' :
              'bg-gradient-to-l from-stone-800 to-stone-900'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activePassportData.flag}</span>
                    <ArrowRight className="w-5 h-5 text-white/60" />
                    <span className="text-3xl">{activeDestData.flag}</span>
                    <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                      نتيجة الفحص الفوري
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {activePassportData.name_ar} ⬅️ {activeDestData.name_ar}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-bold text-white bg-black/30 px-3 py-1 rounded-lg">
                      نوع التأشيرة: {currentVisaRule.status_ar}
                    </span>
                    <span className="text-white/80">•</span>
                    <span className="text-white/90">
                      مدة الإقامة المسموحة: <strong>{currentVisaRule.duration_ar}</strong>
                    </span>
                    <span className="text-white/80">•</span>
                    <span className="text-white/90">
                      الرسوم التقديرية: <strong>{currentVisaRule.cost_estimate_ar}</strong>
                    </span>
                  </div>
                </div>

                {/* Action button if official portal is available */}
                {currentVisaRule.official_portal && (
                  <a
                    href={currentVisaRule.official_portal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start md:self-center flex items-center gap-2 bg-white text-stone-900 px-5 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-stone-100 transition-all cursor-pointer shrink-0"
                  >
                    <span>{currentVisaRule.official_portal_title || 'البوابة الرسمية المعتمدة'}</span>
                    <ExternalLink className="w-4 h-4 text-emerald-600" />
                  </a>
                )}
              </div>
            </div>

            {/* Detailed Requirements & Instructions Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Requirements list */}
                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>المستندات والمتطلبات الإلزامية:</span>
                  </h4>
                  <ul className="space-y-2">
                    {currentVisaRule.required_docs.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Important Notes & Warnings */}
                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>إرشادات وتنبيهات هامة للمسافر:</span>
                  </h4>
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-950 space-y-2 leading-relaxed">
                    <p>{currentVisaRule.advisory_tips.join(' • ')}</p>
                    <div className="pt-2 border-t border-amber-200/60 text-xs text-amber-900 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>زمن المعالجة المعتاد: <strong>{currentVisaRule.processing_time_ar}</strong></span>
                    </div>
                  </div>

                  {/* Link to destination country in DARB */}
                  {onNavigateToCountry && (
                    <button
                      onClick={() => onNavigateToCountry(selectedDestination)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
                    >
                      <span>استكشف دليل مدينة ومعالم {activeDestData.name_ar} في دَرْب</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 2: TRANSIT, METRO & HIGH-SPEED RAIL GUIDE                          */}
      {/* ========================================================================= */}
      {activeModule === 'transit' && (
        <div className="space-y-6">
          {/* Search & City Selector Bar */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  دليل المترو والقطارات وبطاقات المواصلات الذكية عالمياً
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  اختر المدينة لعرض تفاصيل البطاقة الذكية، التطبيقات الرسمية، أسعار التذاكر، ونصائح توفير ميزانية التنقل.
                </p>
              </div>

              {/* Transit Search Input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="ابحث بالمدينة أو الدولة..."
                  value={transitSearch}
                  onChange={(e) => setTransitSearch(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            {/* City Selector Pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
              {filteredTransitSystems.map(sys => (
                <button
                  key={sys.id}
                  onClick={() => setSelectedTransitCityId(sys.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm border transition-all cursor-pointer ${
                    selectedTransitCityId === sys.id
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  <span>{sys.card_image_badge.split(' ')[0]}</span>
                  <span>{sys.city_ar}</span>
                  <span className="text-[11px] opacity-80">({sys.card_name_ar})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Transit Details Card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-md overflow-hidden">
            {/* City Transit Hero Header */}
            <div className="bg-gradient-to-l from-[#0c2a44] to-[#081a2b] text-white p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{activeTransitSystem.card_image_badge}</span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                      {activeTransitSystem.country_name_ar}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    شبكة مواصلات {activeTransitSystem.city_ar} ({activeTransitSystem.city_en})
                  </h3>
                  <div className="text-xs sm:text-sm text-stone-300 flex items-center gap-3">
                    <span>البطاقة الذكية الرسمية: <strong className="text-white underline">{activeTransitSystem.card_name_ar}</strong></span>
                    <span>•</span>
                    <span>الدفع اللاتلامسي بالبطاقة البنكية: <strong className={activeTransitSystem.contactless_supported ? 'text-emerald-400' : 'text-amber-400'}>
                      {activeTransitSystem.contactless_supported ? 'مدعوم ومتاح ✅' : 'يلزم شراء البطاقة المحلية ⚠️'}
                    </strong></span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-left shrink-0">
                  <div className="text-xs text-stone-300">تكلفة وشراء البطاقة:</div>
                  <div className="text-base sm:text-lg font-black text-emerald-400 font-mono mt-0.5">
                    {activeTransitSystem.deposit_or_cost_ar}
                  </div>
                  {activeTransitSystem.tourist_passes[0] && (
                    <div className="text-[11px] text-stone-300 mt-1">
                      {activeTransitSystem.tourist_passes[0].name_ar}: {activeTransitSystem.tourist_passes[0].price_ar}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Transit Specs & Practical Tips Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Row 1: Smart Card Purchasing & Mobile Apps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Where to buy & recharge */}
                <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 space-y-3">
                  <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>أين تشتري وتشحن بطاقة ({activeTransitSystem.card_name_ar})؟</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {activeTransitSystem.how_to_buy_ar}
                  </p>
                </div>

                {/* Official Apps & Airport Link */}
                <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 space-y-3">
                  <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>التطبيقات الرسمية والربط بالمطار:</span>
                  </h4>
                  <div className="space-y-2 text-xs sm:text-sm text-stone-700">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">تطبيق الهاتف المعتمد:</span>
                      <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded text-xs font-semibold">
                        {activeTransitSystem.mobile_app_name}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-stone-900">إرشادات التطبيق: </span>
                      <span>{activeTransitSystem.mobile_app_note}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Transit Systems Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                  <Train className="w-4 h-4 text-emerald-600" />
                  <span>البطاقات السياحية وعروض التوفير في {activeTransitSystem.city_ar}:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {activeTransitSystem.tourist_passes.map((pass, idx) => (
                    <div key={idx} className="bg-white border border-stone-200 p-3.5 rounded-xl shadow-xs space-y-1">
                      <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>{pass.name_ar}</span>
                      </div>
                      <div className="text-xs font-semibold text-stone-900">{pass.price_ar}</div>
                      <div className="text-[11px] text-stone-500 leading-relaxed">{pass.benefit_ar}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* High-Speed Rail & Expat Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-stone-100">
                {activeTransitSystem.high_speed_trains && (
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs sm:text-sm text-blue-950 space-y-1.5">
                    <div className="font-bold flex items-center gap-2">
                      <Train className="w-4 h-4 text-blue-700" />
                      <span>{activeTransitSystem.high_speed_trains.name_ar} ({activeTransitSystem.high_speed_trains.operator})</span>
                    </div>
                    <div><strong>الربط بين المدن:</strong> {activeTransitSystem.high_speed_trains.routes_summary}</div>
                    <div className="text-xs text-blue-800">{activeTransitSystem.high_speed_trains.booking_advice}</div>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-1.5">
                  <div className="font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>نصائح وتوجيهات دَرْب للتنقل:</span>
                  </div>
                  <ul className="text-xs leading-relaxed list-disc list-inside space-y-1">
                    {activeTransitSystem.insider_tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 3: HALAL DINING, MOSQUES & PRAYER GUIDE                            */}
      {/* ========================================================================= */}
      {activeModule === 'halal' && (
        <div className="space-y-6">
          {/* Country Selector for Halal */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                دليل المطاعم الحلال والمساجد ومواقيت الصلاة للمسافر المسلم
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                اختر الدولة لاستعراض أشهر المساجد التاريخية ومصليات المطارات، الأحياء الغنية بالمطاعم الحلال، وهيئات الاعتماد الموثوقة.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
              {availableHalalCountries.map(code => {
                const hData = HALAL_PRAYER_DATA[code];
                return (
                  <button
                    key={code}
                    onClick={() => setSelectedHalalCountry(code)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm border transition-all cursor-pointer ${
                      selectedHalalCountry === code
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    <span>{hData.flag}</span>
                    <span>{hData.country_name_ar}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Halal Details Card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-6 sm:p-8 space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-2xl font-black text-stone-900">
                  <span>{activeHalalData.flag}</span>
                  <span>{activeHalalData.country_name_ar}</span>
                </div>
                <div className="text-xs text-stone-600 max-w-xl leading-relaxed">
                  {activeHalalData.halal_status_summary_ar}
                </div>
              </div>

              {/* Qibla Direction pill */}
              <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl text-xs text-emerald-950 flex items-center gap-2 shrink-0">
                <Compass className="w-5 h-5 text-emerald-700" />
                <div>
                  <div className="font-bold">اتجاه القبلة:</div>
                  <div className="text-[11px] text-emerald-800">{activeHalalData.prayer_advisory.qibla_direction_summary}</div>
                </div>
              </div>
            </div>

            {/* Mosques & Prayer Spaces */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Moon className="w-4 h-4 text-emerald-600" />
                <span>أبرز المساجد والمراكز الإسلامية:</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeHalalData.iconic_mosques.map((mosque, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-emerald-700">{mosque.city_ar}</div>
                      <h5 className="font-bold text-stone-900 text-sm">{mosque.name_ar} ({mosque.name_local})</h5>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{mosque.nearest_metro_or_transit}</p>
                    </div>
                    <div className="text-[11px] bg-white border border-stone-200 p-2 rounded-lg text-stone-500 mt-2">
                      💡 {mosque.historical_note_ar}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Halal-friendly Neighborhoods */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <h4 className="text-sm sm:text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-600" />
                <span>أشهر الأحياء والشوارع المعروفة بالمطاعم الحلال:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeHalalData.halal_friendly_districts.map((district, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
                    <div className="text-xs font-bold text-emerald-800">{district.city_ar}</div>
                    <div className="text-xs font-extrabold text-stone-900">{district.neighborhood_ar}</div>
                    <p className="text-xs text-stone-600 leading-relaxed">{district.highlights_ar}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certification bodies & Supermarkets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>هيئات اعتماد الحلال الرسمية والموثوقة:</span>
                </div>
                <ul className="text-xs text-stone-700 space-y-1 list-disc list-inside">
                  {activeHalalData.halal_certification_bodies.map((body, idx) => (
                    <li key={idx} className="leading-relaxed">{body}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-600" />
                  <span>السوبرماركت والمتاجر التي توفر منتجات حلال:</span>
                </div>
                <ul className="text-xs text-stone-700 space-y-1 list-disc list-inside">
                  {activeHalalData.supermarket_halal_chains.map((chain, idx) => (
                    <li key={idx} className="leading-relaxed">{chain}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Airport Prayer Rooms & High-latitude note */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs text-blue-950">
              <div className="font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-700" />
                <span>مصليات المطارات الدولية وتواقيت الصلاة:</span>
              </div>
              <div>
                <strong>مصليات المطارات المعتمدة:</strong> {activeHalalData.prayer_advisory.airport_prayer_rooms.join(' • ')}
              </div>
              {activeHalalData.prayer_advisory.high_latitude_note && (
                <div className="pt-1 text-blue-900">
                  ⚠️ <strong>تنبيه خطوط العرض العليا:</strong> {activeHalalData.prayer_advisory.high_latitude_note}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 4: CURRENCY CONVERTER, DAILY BUDGET & TIPPING CUSTOMS             */}
      {/* ========================================================================= */}
      {activeModule === 'budget' && (
        <div className="space-y-6">
          {/* Sub-grid: Live Currency Converter & Daily Budget Estimator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Currency Converter Card */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-stone-900 text-base">محول العملات المباشر (22 عملة عربية وعالمية)</h3>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                  أسعار مرجعية فورية
                </span>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">المبلغ المراد تحويله:</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Math.max(1, Number(e.target.value) || 0))}
                    className="w-full text-xl font-bold font-mono px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <span className="absolute left-4 top-3.5 text-stone-400 font-bold text-sm">
                    {fromCurrency.symbol}
                  </span>
                </div>
              </div>

              {/* From & To Selectors with Swap */}
              <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
                {/* From currency */}
                <div className="sm:col-span-5 space-y-1">
                  <label className="block text-xs font-bold text-stone-600">من عملة:</label>
                  <select
                    value={fromCurrencyCode}
                    onChange={(e) => setFromCurrencyCode(e.target.value)}
                    className="w-full py-2.5 px-3 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold bg-stone-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <optgroup label="عملات الخليج العربي">
                      {ALL_CURRENCIES.filter(c => c.category === 'gcc').map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name_ar}</option>
                      ))}
                    </optgroup>
                    <optgroup label="بقية الدول العربية">
                      {ALL_CURRENCIES.filter(c => c.category === 'arab_africa' || c.category === 'arab_levant').map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name_ar}</option>
                      ))}
                    </optgroup>
                    <optgroup label="العملات العالمية">
                      {ALL_CURRENCIES.filter(c => !c.isArab).map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name_ar}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Swap button */}
                <div className="sm:col-span-1 flex justify-center pt-4 sm:pt-5">
                  <button
                    onClick={handleSwapCurrencies}
                    className="w-10 h-10 rounded-full bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-600 flex items-center justify-center transition-all cursor-pointer border border-stone-200"
                    title="تبديل العملات"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>

                {/* To currency */}
                <div className="sm:col-span-5 space-y-1">
                  <label className="block text-xs font-bold text-stone-600">إلى عملة:</label>
                  <select
                    value={toCurrencyCode}
                    onChange={(e) => setToCurrencyCode(e.target.value)}
                    className="w-full py-2.5 px-3 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold bg-stone-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <optgroup label="العملات العالمية والوجهات السياحية">
                      {ALL_CURRENCIES.filter(c => !c.isArab).map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name_ar}</option>
                      ))}
                    </optgroup>
                    <optgroup label="عملات الخليج العربي">
                      {ALL_CURRENCIES.filter(c => c.category === 'gcc').map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name_ar}</option>
                      ))}
                    </optgroup>
                    <optgroup label="بقية الدول العربية">
                      {ALL_CURRENCIES.filter(c => c.category === 'arab_africa' || c.category === 'arab_levant').map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name_ar}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Conversion Result Display */}
              <div className="bg-gradient-to-l from-emerald-900 to-[#0c2a44] text-white p-5 rounded-xl space-y-3">
                <div className="text-xs text-emerald-200">النتيجة المحسوبة فورياً:</div>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl sm:text-3xl font-black font-mono">
                    {convertedResult.toLocaleString('en-US', { maximumFractionDigits: 2 })} {toCurrency.symbol}
                  </div>
                  <div className="text-xs text-stone-300">
                    {calcAmount} {fromCurrency.symbol}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex flex-wrap justify-between text-xs text-stone-300">
                  <span>1 {fromCurrency.code} = {oneUnitConverted.toFixed(4)} {toCurrency.code}</span>
                  <span>1 {toCurrency.code} = {inverseUnitConverted.toFixed(4)} {fromCurrency.code}</span>
                </div>
              </div>
            </div>

            {/* Travel Daily Budget Estimator */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-stone-900 text-base">مقدّر ميزانية ومصروف الرحلة الذكي</h3>
                </div>
                <span className="text-xs text-stone-500">حسب النمط وعدد الأيام</span>
              </div>

              {/* Destination Country selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">اختر وجهة السفر:</label>
                <select
                  value={selectedBudgetCountry}
                  onChange={(e) => setSelectedBudgetCountry(e.target.value)}
                  className="w-full py-2.5 px-3 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold bg-stone-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  {Object.values(COUNTRY_BUDGET_PROFILES).map(p => (
                    <option key={p.country_code} value={p.country_code}>
                      {p.country_name_ar} ({p.currency_name_ar} {p.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Travel Style Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">نمط ومستوى السفر:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'backpacker', label: 'اقتصادي / شبابي', icon: '🎒' },
                    { id: 'moderate', label: 'متوسط / عائلي', icon: '🏨' },
                    { id: 'luxury', label: 'فاخر / منتجعات', icon: '✨' },
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setTravelStyle(s.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        travelStyle === s.id
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      <div className="text-lg">{s.icon}</div>
                      <div className="text-xs mt-1 leading-tight">{s.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Days & Travelers Sliders */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                    <span>عدد الأيام:</span>
                    <span className="text-emerald-700 font-mono">{tripDays} أيام</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={tripDays}
                    onChange={(e) => setTripDays(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                    <span>عدد المسافرين:</span>
                    <span className="text-emerald-700 font-mono">{travelerCount} أفراد</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={travelerCount}
                    onChange={(e) => setTravelerCount(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Total Estimated Cost Banner */}
              <div className="p-4 rounded-xl bg-stone-900 text-white flex items-center justify-between">
                <div>
                  <div className="text-xs text-stone-400">إجمالي الميزانية التقديرية للرحلة:</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-0.5">
                    ~${Math.round(totalTripCostUSD).toLocaleString()} USD
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs text-stone-400">بالعملة المحلية:</div>
                  <div className="text-sm sm:text-base font-bold text-white font-mono">
                    ~{Math.round(totalTripCostLocal).toLocaleString()} {activeBudgetProfile.symbol}
                  </div>
                </div>
              </div>

              {/* Breakdown by Category */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-stone-500">السكن يومياً</div>
                  <div className="font-bold text-stone-900 mt-1">${activeDailyCostsUSD.lodging}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-stone-500">الطعام يومياً</div>
                  <div className="font-bold text-stone-900 mt-1">${activeDailyCostsUSD.food}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-stone-500">التنقل يومياً</div>
                  <div className="font-bold text-stone-900 mt-1">${activeDailyCostsUSD.transport}</div>
                </div>
              </div>

            </div>

          </div>

          {/* Full-width Card: Tipping Customs & Payment Habits */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>دليل الإكراميات (البقشيش) وعادات الدفع في {activeBudgetProfile.country_name_ar}</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  تفادي الإحراج والعمولات الخفية ومعرفة متى يكون البقشيش متوقعاً أو ممنوعاً.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                  activeBudgetProfile.tipping_score === 'discouraged' ? 'bg-red-100 text-red-800' :
                  activeBudgetProfile.tipping_score === 'mandatory' ? 'bg-amber-100 text-amber-900' :
                  activeBudgetProfile.tipping_score === 'customary' ? 'bg-blue-100 text-blue-900' :
                  'bg-emerald-100 text-emerald-900'
                }`}>
                  {activeBudgetProfile.tipping_score === 'discouraged' ? '⚠️ غير محبذ / ممنوع' :
                   activeBudgetProfile.tipping_score === 'mandatory' ? '📌 إلزامي في الفاتورة' :
                   activeBudgetProfile.tipping_score === 'customary' ? '👍 متعارف عليه ومحبذ' :
                   '✨ اختياري تماماً'}
                </span>
                <span className="text-xs bg-stone-100 text-stone-700 px-3 py-1 rounded-full font-bold">
                  {activeBudgetProfile.cash_vs_card_ratio}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-1.5 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>ثقافة البقشيش والإكرامية:</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {activeBudgetProfile.tipping_customs_ar}
                </p>
              </div>

              <div className="space-y-1.5 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>طرق الدفع المفضلة (كاش أم بطاقات):</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {activeBudgetProfile.payment_method_advice_ar}
                </p>
              </div>

              <div className="space-y-1.5 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span>نصائح الصرافات وتفادي فخاخ التحويل DCC:</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {activeBudgetProfile.atms_and_cards_tip_ar}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 5: SMART PACKING CHECKLIST & ITINERARY PLANNER                     */}
      {/* ========================================================================= */}
      {activeModule === 'packing' && (
        <div className="space-y-6">
          {/* Controls: Country, Season, Trip Type */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                  <Luggage className="w-5 h-5 text-emerald-600" />
                  <span>مخطط حقيبة السفر التفاعلي وخط سير الرحلة (Itinerary & Packing)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  قائمة مهام تفاعلية مخصصة حسب حالة الطقس ونوع الرحلة مع دليل مقابس الكهرباء وبرامج الرحلات النموذجية.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3 bg-stone-50 px-4 py-2 rounded-xl border border-stone-200 shrink-0">
                <div className="w-24 bg-stone-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${packingProgressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-stone-800 font-mono">
                  {checkedCount} من {filteredPackingItems.length} ({packingProgressPercent}%)
                </span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-stone-100">
              {/* Country selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">اختر وجهتك:</label>
                <select
                  value={selectedPackingCountry}
                  onChange={(e) => setSelectedPackingCountry(e.target.value)}
                  className="w-full py-2 px-3 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold bg-stone-50 focus:outline-none"
                >
                  <option value="GB">المملكة المتحدة (لندن) 🇬🇧</option>
                  <option value="TR">تركيا (إسطنبول) 🇹🇷</option>
                  <option value="MV">المالديف 🇲🇻</option>
                  <option value="FR">فرنسا (باريس) 🇫🇷</option>
                  <option value="CH">سويسرا 🇨🇭</option>
                  <option value="JP">اليابان (طوكيو) 🇯🇵</option>
                  <option value="AZ">أذربيجان (باكو) 🇦🇿</option>
                  <option value="SA">السعودية (الرياض/العلا) 🇸🇦</option>
                  <option value="AE">الإمارات (دبي) 🇦🇪</option>
                  <option value="MY">ماليزيا 🇲🇾</option>
                  <option value="TH">تايلاند 🇹🇭</option>
                </select>
              </div>

              {/* Season / Weather Filter */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">المناخ والطقس المتوقع:</label>
                <select
                  value={packingSeasonFilter}
                  onChange={(e) => setPackingSeasonFilter(e.target.value as any)}
                  className="w-full py-2 px-3 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold bg-stone-50 focus:outline-none"
                >
                  <option value="all">جميع الفصول والأجواء 🌤️</option>
                  <option value="summer">صيف معتدل أو حار ☀️</option>
                  <option value="winter">شتاء بارد وثلوج ❄️</option>
                  <option value="rain">أجواء ممطرة ورياح 🌧️</option>
                  <option value="beach">شواطئ واستجمام بحري 🏖️</option>
                </select>
              </div>

              {/* Trip Type Filter */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">نوع الرحلة:</label>
                <select
                  value={packingTypeFilter}
                  onChange={(e) => setPackingTypeFilter(e.target.value as any)}
                  className="w-full py-2 px-3 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold bg-stone-50 focus:outline-none"
                >
                  <option value="all">كل أنواع الرحلات ✈️</option>
                  <option value="leisure">سياحة واستجمام 🏖️</option>
                  <option value="family">عائلية مع أطفال 👨‍👩‍👧‍👦</option>
                  <option value="business">أعمال ومؤتمرات 💼</option>
                </select>
              </div>
            </div>

            {/* Quick Actions for checklist */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-stone-500">
                يتم حفظ العناصر المحددة تلقائياً على جهازك.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => checkAllItems(filteredPackingItems)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                >
                  تحديد الكل
                </button>
                <button
                  onClick={resetChecklist}
                  className="text-xs font-bold text-stone-600 hover:text-stone-800 bg-stone-100 px-3 py-1.5 rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>إعادة الضبط</span>
                </button>
              </div>
            </div>
          </div>

          {/* Checklist Items Grid */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>محتويات الحقيبة المقترحة للرحلة:</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPackingItems.map(item => {
                const isChecked = Boolean(checkedItemIds[item.id]);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheckItem(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-300 text-stone-600'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 text-emerald-600 focus:outline-none"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 fill-emerald-100 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-stone-400" />
                      )}
                    </button>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isChecked ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                          {item.title_ar}
                        </span>
                        <span className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded text-stone-500 shrink-0">
                          {item.category_ar}
                        </span>
                      </div>
                      {item.tip_ar && (
                        <p className="text-[11px] text-stone-500 leading-relaxed">
                          💡 {item.tip_ar}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Electrical Plugs & Voltage Advisory */}
          <div className="bg-gradient-to-l from-stone-900 to-[#0e273c] text-white p-6 sm:p-8 rounded-2xl border border-stone-800 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-stone-700 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h4 className="text-base font-extrabold text-white">
                  دليل مقابس الكهرباء والجهد الكهربائي في {activePlugData.country_name_ar}
                </h4>
              </div>
              <span className="text-xs bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                {activePlugData.voltage} • {activePlugData.frequency}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-stone-400">أنواع المقابس الجدارية:</div>
                <div className="text-emerald-400 font-bold text-sm">{activePlugData.plug_types.join(' • ')}</div>
                <div className="text-stone-300 text-[11px] mt-1">{activePlugData.plug_images_desc}</div>
              </div>

              <div className="md:col-span-2 p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-stone-400">هل تحتاج لمحول كهربائي للمسافر العربي؟</div>
                <p className="text-stone-200 leading-relaxed text-xs">
                  {activePlugData.adapter_needed_for_arab_traveler}
                </p>
              </div>
            </div>
          </div>

          {/* Curated Sample Day-by-Day Itinerary */}
          {activeItinerary && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full w-fit mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>برنامج مقترح لمدة {activeItinerary.duration_days} أيام</span>
                  </div>
                  <h4 className="text-lg font-black text-stone-900">
                    خط سير الرحلة النموذجي: {activeItinerary.destination_name_ar}
                  </h4>
                  <p className="text-xs text-stone-500">
                    النمط: {activeItinerary.trip_style_ar} • أفضل وقت للزيارة: {activeItinerary.best_season_ar}
                  </p>
                </div>
              </div>

              {/* Days Timeline */}
              <div className="space-y-4">
                {activeItinerary.days.map(d => (
                  <div key={d.day_number} className="border border-stone-200 rounded-xl p-4 sm:p-5 bg-stone-50/60 space-y-3">
                    <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                      <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center font-mono">
                        {d.day_number}
                      </span>
                      <h5 className="font-extrabold text-stone-900 text-sm">{d.title_ar}</h5>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                        <span className="font-bold text-amber-700 block">🌅 الفترة الصباحية:</span>
                        <p className="text-stone-700 leading-relaxed">{d.morning_ar}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                        <span className="font-bold text-blue-700 block">☀️ فترة بعد الظهر:</span>
                        <p className="text-stone-700 leading-relaxed">{d.afternoon_ar}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                        <span className="font-bold text-indigo-700 block">🌙 الفترة المسائية:</span>
                        <p className="text-stone-700 leading-relaxed">{d.evening_ar}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs border-t border-stone-200">
                      <div className="text-stone-600 flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                        <span><strong>مطعم حلال مقترح:</strong> {d.halal_food_tip_ar}</span>
                      </div>
                      <div className="text-stone-600 flex items-center gap-1.5">
                        <Train className="w-3.5 h-3.5 text-blue-600" />
                        <span><strong>نصيحة التنقل:</strong> {d.transport_tip_ar}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 6: EMERGENCY PASSPORT, EMBASSIES & MULTILINGUAL SOS FLASHCARDS      */}
      {/* ========================================================================= */}
      {activeModule === 'emergency' && (
        <div className="space-y-6">
          {/* Country Selector for Emergency */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  <span>جواز الطوارئ، السفارات العربية وبطاقات SOS متعددة اللغات</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  أرقام الطوارئ المعتمدة، خطوط السفارات الساخنة على مدار 24 ساعة، الأدوية المحظورة، وبطاقات التخاطب السريع.
                </p>
              </div>

              {/* Country Selector */}
              <div className="w-full sm:w-64">
                <select
                  value={selectedEmergencyCountry}
                  onChange={(e) => setSelectedEmergencyCountry(e.target.value)}
                  className="w-full py-2.5 px-3 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold bg-stone-50 focus:outline-none"
                >
                  {Object.values(EMERGENCY_CONTACTS_DATA).map(c => (
                    <option key={c.country_code} value={c.country_code}>
                      {c.country_name_ar}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Emergency Numbers Display */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100">
              <a
                href={`tel:${activeEmergencyData.general_emergency.split(' ')[0]}`}
                className="p-3.5 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 transition-all text-center block"
              >
                <div className="text-xs text-red-700 font-bold">الطوارئ العامة</div>
                <div className="text-xl font-black text-red-800 font-mono mt-1">
                  {activeEmergencyData.general_emergency}
                </div>
              </a>

              <a
                href={`tel:${activeEmergencyData.police.split(' ')[0]}`}
                className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all text-center block"
              >
                <div className="text-xs text-blue-700 font-bold">الشرطة المحلية</div>
                <div className="text-xl font-black text-blue-800 font-mono mt-1">
                  {activeEmergencyData.police}
                </div>
              </a>

              <a
                href={`tel:${activeEmergencyData.ambulance.split(' ')[0]}`}
                className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all text-center block"
              >
                <div className="text-xs text-emerald-700 font-bold">الإسعاف الطبي</div>
                <div className="text-xl font-black text-emerald-800 font-mono mt-1">
                  {activeEmergencyData.ambulance}
                </div>
              </a>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-center">
                <div className="text-xs text-stone-600 font-bold">شرطة السياحة</div>
                <div className="text-xs font-bold text-stone-900 mt-2 line-clamp-1">
                  {activeEmergencyData.tourist_police || 'متوفر عبر 112'}
                </div>
              </div>
            </div>
          </div>

          {/* Arab Embassies Hotlines */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h4 className="text-sm sm:text-base font-extrabold text-stone-900 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>البعثات الدبلوماسية والخطوط الساخنة للطوارئ 24/7 للمواطنين العرب:</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeEmergencyData.arab_embassies.map((emb, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-stone-900">
                      <span className="text-lg">{emb.flag}</span>
                      <span>{emb.country_name_ar}</span>
                    </div>
                  </div>

                  <div className="text-xs text-stone-600">
                    العنوان: {emb.address_ar}
                  </div>

                  <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
                    <a
                      href={`tel:${emb.emergency_hotline}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>طوارئ 24 ساعة: {emb.emergency_hotline}</span>
                    </a>
                    <span className="text-[11px] text-stone-500 font-mono">هاتف: {emb.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prohibited Medications & Health Rules */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 sm:p-8 space-y-4 text-amber-950">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <h4 className="text-base font-extrabold text-amber-950">
                قوانين الصحة والأدوية المحظورة في مطارات {activeEmergencyData.country_name_ar}
              </h4>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-amber-900">
              {activeEmergencyData.health_and_insurance_rules_ar}
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold block text-amber-950">
                ⚠️ الأدوية والعقاقير الخاضعة للرقابة الصارمة أو الحظر:
              </span>
              <ul className="space-y-1 text-xs text-amber-900 list-disc list-inside">
                {activeEmergencyData.restricted_medications_ar.map((med, idx) => (
                  <li key={idx} className="leading-relaxed">{med}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Multilingual SOS Flashcards */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <h4 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span>بطاقات التخاطب السريع في الحالات الطارئة (SOS Flashcards)</span>
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  اعرض شاشة هاتفك مباشرة لسائق التاكسي أو الطبيب أو رجل الشرطة باللغة المحلية.
                </p>
              </div>

              {/* Language Selector */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { code: 'en', label: 'الإنجليزية 🇬🇧' },
                  { code: 'fr', label: 'الفرنسية 🇫🇷' },
                  { code: 'tr', label: 'التركية 🇹🇷' },
                  { code: 'ja', label: 'اليابانية 🇯🇵' },
                  { code: 'ru', label: 'الروسية 🇷🇺' },
                  { code: 'es', label: 'الإسبانية 🇪🇸' },
                ].map(l => (
                  <button
                    key={l.code}
                    onClick={() => setSosLanguage(l.code as any)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      sosLanguage === l.code
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Phrase Pills */}
            <div className="flex flex-wrap gap-2">
              {MULTILINGUAL_SOS_CARDS.map(card => (
                <button
                  key={card.id}
                  onClick={() => setSelectedSosCardId(card.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedSosCardId === card.id
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  <span>{card.icon}</span>
                  <span className="truncate max-w-[200px]">{card.phrase_ar}</span>
                </button>
              ))}
            </div>

            {/* Active Flashcard Display (Large for mobile visibility) */}
            <div className={`rounded-2xl p-6 sm:p-8 border-2 transition-all space-y-4 ${
              isSosFullScreen 
                ? 'fixed inset-4 z-50 bg-stone-900 text-white flex flex-col justify-center shadow-2xl overflow-y-auto' 
                : 'bg-stone-900 text-white border-stone-800'
            }`}>
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeSosCard.icon}</span>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    بطاقة طوارئ فورية • Emergency Flashcard
                  </span>
                </div>

                <button
                  onClick={() => setIsSosFullScreen(!isSosFullScreen)}
                  className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {isSosFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{isSosFullScreen ? 'تصغير' : 'تكبير الشاشة للرؤية'}</span>
                </button>
              </div>

              {/* Foreign Language Translation (Huge & High Contrast) */}
              <div className="py-4 text-center space-y-2">
                <div className="text-xl sm:text-3xl font-black text-amber-300 leading-snug font-sans tracking-wide">
                  {activeSosCard.translations[sosLanguage] || activeSosCard.translations.en}
                </div>
              </div>

              {/* Arabic Original for Traveler Reference */}
              <div className="pt-4 border-t border-stone-800 text-stone-300 text-center text-xs sm:text-sm">
                المعنى بالعربية: {activeSosCard.phrase_ar}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 7: SMART MULTI-DESTINATION COMPARATOR & TRIP COST PLANNER           */}
      {/* ========================================================================= */}
      {activeModule === 'comparator' && (() => {
        const destA = FOREIGN_COUNTRIES_IMAGERY[compareCountryA] || FOREIGN_COUNTRIES_IMAGERY['GB'];
        const destB = FOREIGN_COUNTRIES_IMAGERY[compareCountryB] || FOREIGN_COUNTRIES_IMAGERY['TR'];
        const visaA = getVisaRuleForPair(selectedPassport, compareCountryA);
        const visaB = getVisaRuleForPair(selectedPassport, compareCountryB);
        const budgetA = COUNTRY_BUDGET_PROFILES[compareCountryA] || COUNTRY_BUDGET_PROFILES['GB'];
        const budgetB = COUNTRY_BUDGET_PROFILES[compareCountryB] || COUNTRY_BUDGET_PROFILES['TR'];
        const plugA = ELECTRICAL_PLUG_DATABASE[compareCountryA];
        const plugB = ELECTRICAL_PLUG_DATABASE[compareCountryB];
        const halalA = HALAL_PRAYER_DATA[compareCountryA];
        const halalB = HALAL_PRAYER_DATA[compareCountryB];

        // Cost estimation:
        const dailyA = budgetA.budget_daily_usd[compareStyle].total;
        const dailyB = budgetB.budget_daily_usd[compareStyle].total;
        const livingCostA = Math.round(dailyA * compareDurationDays * (compareStyle === 'luxury' ? compareTravelers : Math.max(1, compareTravelers * 0.8)));
        const livingCostB = Math.round(dailyB * compareDurationDays * (compareStyle === 'luxury' ? compareTravelers : Math.max(1, compareTravelers * 0.8)));
        const totalFlightsA = compareFlightEstimateUSD * compareTravelers;
        const totalFlightsB = Math.round(compareFlightEstimateUSD * (['TR', 'AE', 'EG', 'JO'].includes(compareCountryB) ? 0.75 : 1.15)) * compareTravelers;
        const totalTripA = Math.round(livingCostA + totalFlightsA);
        const totalTripB = Math.round(livingCostB + totalFlightsB);

        // In user home currency (selectedPassport)
        const passportProfile = COUNTRY_BUDGET_PROFILES[selectedPassport] || COUNTRY_BUDGET_PROFILES['SA'];
        const homeCurrency = ALL_CURRENCIES.find(c => c.code === passportProfile.currency_code) || ALL_CURRENCIES[0];
        const totalTripAHome = Math.round(totalTripA * homeCurrency.rateToUSD);
        const totalTripBHome = Math.round(totalTripB * homeCurrency.rateToUSD);

        const diffUSD = Math.abs(totalTripA - totalTripB);
        const cheaperDest = totalTripA < totalTripB ? destA : destB;
        const moreExpDest = totalTripA < totalTripB ? destB : destA;

        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Header & Passport Context */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚖️</span>
                    <h3 className="text-xl font-black text-stone-900">
                      مقارن الوجهات والمواسم ومخطط ميزانية السفر الذكي
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-500">
                    قارن بين أي وجهتين عالميتين أو عربيتين وجهاً لوجه: متطلبات التأشيرة لجوازك، تكلفة المعيشة اليومية، التوافق الكهربائي، توفر الحلال، ومخطط الميزانية التقديري الشامل.
                  </p>
                </div>

                {/* Passport Switcher */}
                <div className="flex items-center gap-2 bg-stone-50 px-4 py-2.5 rounded-2xl border border-stone-200">
                  <span className="text-xs font-bold text-stone-600">جواز سفرك:</span>
                  <select
                    value={selectedPassport}
                    onChange={(e) => setSelectedPassport(e.target.value)}
                    className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800 focus:outline-hidden focus:border-[#1bb49e] cursor-pointer"
                  >
                    {ARAB_PASSPORTS.map(p => (
                      <option key={p.code} value={p.code}>
                        {p.flag} {p.name_ar}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destination Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Destination A */}
                <div className="bg-stone-50 border-2 border-emerald-500/40 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      الوجهة الأولى (A)
                    </span>
                    <span className="text-2xl">{destA.flag}</span>
                  </div>
                  <select
                    value={compareCountryA}
                    onChange={(e) => setCompareCountryA(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold text-stone-800 focus:outline-hidden focus:border-[#1bb49e] cursor-pointer"
                  >
                    {allDestinations.map(d => (
                      <option key={d.country_code} value={d.country_code}>
                        {d.flag} {d.name_ar} ({d.name_en})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-stone-500 line-clamp-2">{destA.tag_ar || destA.landmark_name_ar}</p>
                </div>

                {/* Destination B */}
                <div className="bg-stone-50 border-2 border-indigo-500/40 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                      الوجهة الثانية (B)
                    </span>
                    <span className="text-2xl">{destB.flag}</span>
                  </div>
                  <select
                    value={compareCountryB}
                    onChange={(e) => setCompareCountryB(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold text-stone-800 focus:outline-hidden focus:border-[#1bb49e] cursor-pointer"
                  >
                    {allDestinations.map(d => (
                      <option key={d.country_code} value={d.country_code}>
                        {d.flag} {d.name_ar} ({d.name_en})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-stone-500 line-clamp-2">{destB.tag_ar || destB.landmark_name_ar}</p>
                </div>
              </div>
            </div>

            {/* Side-by-Side Comparison Table Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card A */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                  <span className="text-3xl">{destA.flag}</span>
                  <div>
                    <h4 className="text-lg font-black text-stone-900">{destA.name_ar}</h4>
                    <span className="text-xs text-stone-400 font-mono">العاصمة: {destA.capital_ar}</span>
                  </div>
                </div>

                {/* Axis 1: Visa for active passport */}
                <div className="space-y-1.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-600">🛂 التأشيرة لـ ({activePassportData.name_ar}):</span>
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                      visaA.status === 'visa_free' ? 'bg-emerald-100 text-emerald-800' :
                      visaA.status === 'evisa' ? 'bg-blue-100 text-blue-800' :
                      visaA.status === 'voa' ? 'bg-purple-100 text-purple-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {visaA.status_ar}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-500 pt-1">
                    <span>الإقامة: <strong>{visaA.duration_ar}</strong></span>
                    <span>الرسوم: <strong>{visaA.cost_estimate_ar}</strong></span>
                  </div>
                </div>

                {/* Axis 2: Daily Budget Breakdown */}
                <div className="space-y-2 bg-stone-50 p-3.5 rounded-2xl border border-stone-100 text-xs">
                  <div className="flex justify-between font-bold text-stone-700">
                    <span>💰 الصرف اليومي ({compareStyle === 'backpacker' ? 'اقتصادي' : compareStyle === 'moderate' ? 'متوسط' : 'فاخر'}):</span>
                    <span className="font-mono text-[#071a2b] font-black">${dailyA} / يوم</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-center text-stone-500 pt-1">
                    <div className="bg-white p-2 rounded-xl border border-stone-100">
                      <span className="block text-[9px] text-stone-400">سكن وإقامة</span>
                      <strong className="font-mono text-stone-800">${budgetA.budget_daily_usd[compareStyle].lodging}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-stone-100">
                      <span className="block text-[9px] text-stone-400">وجبات وطعام</span>
                      <strong className="font-mono text-stone-800">${budgetA.budget_daily_usd[compareStyle].food}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-stone-100">
                      <span className="block text-[9px] text-stone-400">تنقل ومواصلات</span>
                      <strong className="font-mono text-stone-800">${budgetA.budget_daily_usd[compareStyle].transport}</strong>
                    </div>
                  </div>
                </div>

                {/* Axis 3: Plugs & Voltage */}
                <div className="space-y-1.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-100 text-xs">
                  <div className="flex justify-between items-center font-bold text-stone-700">
                    <span>🔌 المقابس والكهرباء:</span>
                    <span className="font-mono font-bold text-stone-800">
                      {plugA ? plugA.plug_types.join(' • ') : 'Type G / C'} ({plugA ? plugA.voltage : '220V'})
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    {plugA ? plugA.adapter_needed_for_arab_traveler : 'تأكد من إحضار محول كهرباء دولي ثلاثي/ثنائي.'}
                  </p>
                </div>

                {/* Axis 4: Halal & Prayer */}
                <div className="space-y-1.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-100 text-xs">
                  <div className="flex justify-between items-center font-bold text-stone-700">
                    <span>🕌 توفر الحلال والمساجد:</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      {halalA ? `${halalA.iconic_mosques.length} مساجد كبرى` : 'متوفرة'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    {halalA ? halalA.halal_status_summary_ar : 'تتوفر خيارات حلال في المدن الكبرى والمناطق السياحية.'}
                  </p>
                </div>
              </div>

              {/* Card B */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                  <span className="text-3xl">{destB.flag}</span>
                  <div>
                    <h4 className="text-lg font-black text-stone-900">{destB.name_ar}</h4>
                    <span className="text-xs text-stone-400 font-mono">العاصمة: {destB.capital_ar}</span>
                  </div>
                </div>

                {/* Axis 1: Visa for active passport */}
                <div className="space-y-1.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-600">🛂 التأشيرة لـ ({activePassportData.name_ar}):</span>
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                      visaB.status === 'visa_free' ? 'bg-emerald-100 text-emerald-800' :
                      visaB.status === 'evisa' ? 'bg-blue-100 text-blue-800' :
                      visaB.status === 'voa' ? 'bg-purple-100 text-purple-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {visaB.status_ar}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-500 pt-1">
                    <span>الإقامة: <strong>{visaB.duration_ar}</strong></span>
                    <span>الرسوم: <strong>{visaB.cost_estimate_ar}</strong></span>
                  </div>
                </div>

                {/* Axis 2: Daily Budget Breakdown */}
                <div className="space-y-2 bg-stone-50 p-3.5 rounded-2xl border border-stone-100 text-xs">
                  <div className="flex justify-between font-bold text-stone-700">
                    <span>💰 الصرف اليومي ({compareStyle === 'backpacker' ? 'اقتصادي' : compareStyle === 'moderate' ? 'متوسط' : 'فاخر'}):</span>
                    <span className="font-mono text-[#071a2b] font-black">${dailyB} / يوم</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-center text-stone-500 pt-1">
                    <div className="bg-white p-2 rounded-xl border border-stone-100">
                      <span className="block text-[9px] text-stone-400">سكن وإقامة</span>
                      <strong className="font-mono text-stone-800">${budgetB.budget_daily_usd[compareStyle].lodging}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-stone-100">
                      <span className="block text-[9px] text-stone-400">وجبات وطعام</span>
                      <strong className="font-mono text-stone-800">${budgetB.budget_daily_usd[compareStyle].food}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-stone-100">
                      <span className="block text-[9px] text-stone-400">تنقل ومواصلات</span>
                      <strong className="font-mono text-stone-800">${budgetB.budget_daily_usd[compareStyle].transport}</strong>
                    </div>
                  </div>
                </div>

                {/* Axis 3: Plugs & Voltage */}
                <div className="space-y-1.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-100 text-xs">
                  <div className="flex justify-between items-center font-bold text-stone-700">
                    <span>🔌 المقابس والكهرباء:</span>
                    <span className="font-mono font-bold text-stone-800">
                      {plugB ? plugB.plug_types.join(' • ') : 'Type G / C'} ({plugB ? plugB.voltage : '220V'})
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    {plugB ? plugB.adapter_needed_for_arab_traveler : 'تأكد من إحضار محول كهرباء دولي ثلاثي/ثنائي.'}
                  </p>
                </div>

                {/* Axis 4: Halal & Prayer */}
                <div className="space-y-1.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-100 text-xs">
                  <div className="flex justify-between items-center font-bold text-stone-700">
                    <span>🕌 توفر الحلال والمساجد:</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      {halalB ? `${halalB.iconic_mosques.length} مساجد كبرى` : 'متوفرة'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    {halalB ? halalB.halal_status_summary_ar : 'تتوفر خيارات حلال في المدن الكبرى والمناطق السياحية.'}
                  </p>
                </div>
              </div>

            </div>

            {/* Total Trip Cost Comparison Engine */}
            <div className="bg-gradient-to-br from-[#071a2b] via-[#0d2a45] to-[#071a2b] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-700">
                <div>
                  <h4 className="text-lg font-black flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#1bb49e]" />
                    <span>مخطط وحاسبة تكلفة الرحلة الشاملة (المقارنة المالية التقديرية)</span>
                  </h4>
                  <p className="text-xs text-stone-300 mt-1">
                    شاملة الطيران والسكن والطعام والمواصلات والأنشطة لكامل مدة الرحلة وعدد المسافرين
                  </p>
                </div>

                {/* Travel Style Selector */}
                <div className="flex bg-[#05131f] p-1 rounded-xl border border-white/10 text-xs font-bold">
                  {(['backpacker', 'moderate', 'luxury'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setCompareStyle(s)}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        compareStyle === s ? 'bg-[#1bb49e] text-[#071a2b] shadow-xs' : 'text-stone-300 hover:text-white'
                      }`}
                    >
                      {s === 'backpacker' ? 'اقتصادي' : s === 'moderate' ? 'متوسط' : 'فاخر'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
                {/* Duration */}
                <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="flex justify-between">
                    <span className="text-stone-300 font-bold">مدة الإقامة:</span>
                    <span className="font-mono text-emerald-400 font-black">{compareDurationDays} أيام</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    value={compareDurationDays}
                    onChange={(e) => setCompareDurationDays(parseInt(e.target.value))}
                    className="w-full accent-[#1bb49e] cursor-pointer"
                  />
                </div>

                {/* Travelers */}
                <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="flex justify-between">
                    <span className="text-stone-300 font-bold">عدد المسافرين:</span>
                    <span className="font-mono text-emerald-400 font-black">{compareTravelers} أشخاص</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={compareTravelers}
                    onChange={(e) => setCompareTravelers(parseInt(e.target.value))}
                    className="w-full accent-[#1bb49e] cursor-pointer"
                  />
                </div>

                {/* Flight Estimate */}
                <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="flex justify-between">
                    <span className="text-stone-300 font-bold">تذكرة الطيران للفرد:</span>
                    <span className="font-mono text-emerald-400 font-black">${compareFlightEstimateUSD}</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="1500"
                    step="50"
                    value={compareFlightEstimateUSD}
                    onChange={(e) => setCompareFlightEstimateUSD(parseInt(e.target.value))}
                    className="w-full accent-[#1bb49e] cursor-pointer"
                  />
                </div>
              </div>

              {/* Total Summary Cards Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="bg-white/10 border border-white/15 rounded-2xl p-5 text-center space-y-2">
                  <span className="text-sm font-bold text-stone-200 block">
                    إجمالي رحلة {destA.flag} {destA.name_ar}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                    ${totalTripA.toLocaleString()}
                  </div>
                  <div className="text-xs text-stone-300 font-mono">
                    ما يعادل تقريباً: <strong className="text-white">{totalTripAHome.toLocaleString()} {homeCurrency.symbol}</strong> ({homeCurrency.code})
                  </div>
                  <div className="text-[11px] text-stone-400 pt-1">
                    طيران: ${totalFlightsA.toLocaleString()} • إقامة ومصاريف: ${livingCostA.toLocaleString()}
                  </div>
                </div>

                <div className="bg-white/10 border border-white/15 rounded-2xl p-5 text-center space-y-2">
                  <span className="text-sm font-bold text-stone-200 block">
                    إجمالي رحلة {destB.flag} {destB.name_ar}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
                    ${totalTripB.toLocaleString()}
                  </div>
                  <div className="text-xs text-stone-300 font-mono">
                    ما يعادل تقريباً: <strong className="text-white">{totalTripBHome.toLocaleString()} {homeCurrency.symbol}</strong> ({homeCurrency.code})
                  </div>
                  <div className="text-[11px] text-stone-400 pt-1">
                    طيران: ${totalFlightsB.toLocaleString()} • إقامة ومصاريف: ${livingCostB.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Savings Conclusion Callout */}
              <div className="bg-[#1bb49e]/20 border border-[#1bb49e]/40 rounded-2xl p-4 text-center text-xs sm:text-sm text-stone-200">
                💡 <strong>النتيجة المقارنة:</strong> السفر إلى <strong>{cheaperDest.name_ar}</strong> يوفر لك قرابة <strong>${diffUSD.toLocaleString()}</strong> (ما يعادل <strong>{(diffUSD * homeCurrency.rateToUSD).toLocaleString()} {homeCurrency.symbol}</strong>) مقارنة بالسفر إلى <strong>{moreExpDest.name_ar}</strong> لنفس المدة وعدد المسافرين.
              </div>
            </div>

          </div>
        );
      })()}

    </div>
  );
}

