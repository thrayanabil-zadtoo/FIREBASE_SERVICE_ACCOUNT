import React, { useState, useEffect } from 'react';
import {
  Globe2,
  TrendingUp,
  BarChart3,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  ArrowUpDown,
  Building2,
  Sparkles,
  ChevronLeft,
  Info,
  Check,
  Plus,
  X,
  MapPin,
  Wifi,
  Coins,
  Shield,
  Plane,
  Scale,
  Compass,
  Calculator,
  FileText,
  Truck,
  Briefcase,
  Zap,
  ShieldAlert,
  Activity,
  Landmark,
  Factory,
  Award
} from 'lucide-react';
import { ArabRegion, MacroeconomicOverview, CountryRankingItem, CountryComparisonResult } from '../types/country-profile';
import { fetchApi } from '../api';
import PanArabAtlasView from './PanArabAtlasView';
import PanArabBudgetCalculator from './PanArabBudgetCalculator';
import PanArabAnnualManagerView from './PanArabAnnualManagerView';
import PanArabMobilityView from './PanArabMobilityView';
import PanArabInvestmentFreeZonesView from './PanArabInvestmentFreeZonesView';
import PanArabTradeSupplyChainView from './PanArabTradeSupplyChainView';
import PanArabLaborRelocationView from './PanArabLaborRelocationView';
import PanArabSovereignMegaProjectsView from './PanArabSovereignMegaProjectsView';
import PanArabClimateDigitalView from './PanArabClimateDigitalView';
import { PanArabRiskCompetitivenessView } from './PanArabRiskCompetitivenessView';
import { PanArabExecutiveBriefingCenter } from './PanArabExecutiveBriefingCenter';
import { PanArabCommonMarketView } from './PanArabCommonMarketView';
import { PanArabDigitalPassportView } from './PanArabDigitalPassportView';
import { PanArabSovereignIntegrationView } from './PanArabSovereignIntegrationView';
import { PanArabRealTimeWarRoomView } from './PanArabRealTimeWarRoomView';
import { PanArabMinisterialCommandView } from './PanArabMinisterialCommandView';
import { PanArabPhase13ResilienceView } from './PanArabPhase13ResilienceView';
import { PanArabPhase14SovereignFundView } from './PanArabPhase14SovereignFundView';
import { PanArabPhase15TechSovereigntyView } from './PanArabPhase15TechSovereigntyView';
import { Wheat, Cpu } from 'lucide-react';

interface PanArabIntelligenceViewProps {
  onSelectCountryProfile?: (countryCode: string) => void;
  onOpenAIWithPrompt?: (prompt: string) => void;
  onBackToCities?: () => void;
}

export default function PanArabIntelligenceView({
  onSelectCountryProfile,
  onOpenAIWithPrompt,
  onBackToCities
}: PanArabIntelligenceViewProps) {
  // Navigation Tabs for Phases 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 & 15
  const [activeTab, setActiveTab] = useState<'atlas' | 'tech_sovereignty' | 'sovereign_co_investment' | 'resilience_2035' | 'ministerial' | 'war_room' | 'sovereign_integration' | 'passport' | 'common_market' | 'risk' | 'briefing' | 'trade' | 'labor' | 'mobility' | 'free_zones' | 'sovereign' | 'climate_digital' | 'budget' | 'annual' | 'comparator' | 'regions' | 'macro' | 'areas' | 'seasons'>('atlas');

  // Comparator State
  const [availableSummaries, setAvailableSummaries] = useState<any[]>([]);
  const [selectedCodesForCompare, setSelectedCodesForCompare] = useState<string[]>(['EG', 'SA', 'MA']);
  const [comparisonData, setComparisonData] = useState<CountryComparisonResult | null>(null);
  const [loadingCompare, setLoadingCompare] = useState(false);

  // Regions State
  const [regions, setRegions] = useState<ArabRegion[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('north_africa');
  const [loadingRegions, setLoadingRegions] = useState(false);

  // Macroeconomics State
  const [macroData, setMacroData] = useState<MacroeconomicOverview | null>(null);
  const [loadingMacro, setLoadingMacro] = useState(false);

  // Rankings & Areas State
  const [rankingsData, setRankingsData] = useState<{
    area_rankings: CountryRankingItem[];
    largest_10: CountryRankingItem[];
    smallest_7: CountryRankingItem[];
    total_arab_area_km2: number;
    total_arab_area_display: string;
  } | null>(null);
  const [loadingRankings, setLoadingRankings] = useState(false);

  // Seasons State
  const [seasonsMatrix, setSeasonsMatrix] = useState<any[]>([]);
  const [loadingSeasons, setLoadingSeasons] = useState(false);
  const [seasonFilter, setSeasonFilter] = useState<string>('all');

  // Load baseline summaries and check deep link parameters
  useEffect(() => {
    loadSummaries();
    try {
      const params = new URLSearchParams(window.location.search);
      const subtabParam = params.get('subtab') || params.get('sub');
      const toolParam = params.get('tool');
      if (toolParam === 'converter' || subtabParam === 'budget' || subtabParam === 'converter') {
        setActiveTab('budget');
      } else if (subtabParam === 'passport' || subtabParam === 'matchmaker' || subtabParam === 'copilot') {
        setActiveTab('passport');
      } else if (subtabParam === 'sovereign_integration' || subtabParam === 'grid' || subtabParam === 'settlement' || subtabParam === 'impact') {
        setActiveTab('sovereign_integration');
      } else if (subtabParam === 'war_room' || subtabParam === 'radar' || subtabParam === 'chokepoints' || subtabParam === 'maritime') {
        setActiveTab('war_room');
      } else if (subtabParam === 'ministerial' || subtabParam === 'agencies' || subtabParam === 'treaty' || subtabParam === 'verification') {
        setActiveTab('ministerial');
      } else if (subtabParam === 'tech_sovereignty' || subtabParam === 'ai_models' || subtabParam === 'cyber' || subtabParam === 'satellites' || subtabParam === 'phase15') {
        setActiveTab('tech_sovereignty');
      } else if (subtabParam === 'sovereign_co_investment' || subtabParam === 'funds' || subtabParam === 'syndicate' || subtabParam === 'sukuk' || subtabParam === 'phase14') {
        setActiveTab('sovereign_co_investment');
      } else if (subtabParam && ['atlas', 'tech_sovereignty', 'sovereign_co_investment', 'resilience_2035', 'ministerial', 'war_room', 'sovereign_integration', 'passport', 'common_market', 'risk', 'briefing', 'trade', 'labor', 'mobility', 'free_zones', 'sovereign', 'climate_digital', 'budget', 'annual', 'comparator', 'regions', 'macro', 'areas', 'seasons'].includes(subtabParam)) {
        setActiveTab(subtabParam as any);
      }
    } catch (e) {
      console.warn('URL subtab parse note:', e);
    }
  }, []);

  const loadSummaries = async () => {
    try {
      const res = await fetchApi<any[]>('/countries/profiles/summary');
      if (res.ok && (res as any).data) {
        setAvailableSummaries((res as any).data);
      }
    } catch {
      // fallback
    }
  };

  // Run comparison when codes change
  useEffect(() => {
    if (selectedCodesForCompare.length >= 2) {
      runComparison(selectedCodesForCompare);
    }
  }, [selectedCodesForCompare]);

  const runComparison = async (codes: string[]) => {
    setLoadingCompare(true);
    try {
      const res = await fetch('/api/countries/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country_codes: codes })
      });
      const data = await res.json();
      if (data.ok && data.data) {
        setComparisonData(data.data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingCompare(false);
    }
  };

  // Lazy load tab data
  useEffect(() => {
    if (activeTab === 'regions' && regions.length === 0) {
      loadRegions();
    } else if (activeTab === 'macro' && !macroData) {
      loadMacro();
    } else if (activeTab === 'areas' && !rankingsData) {
      loadRankings();
    } else if (activeTab === 'seasons' && seasonsMatrix.length === 0) {
      loadSeasons();
    }
  }, [activeTab]);

  const loadRegions = async () => {
    setLoadingRegions(true);
    try {
      const res = await fetch('/api/countries/analytics/regions');
      const data = await res.json();
      if (data.ok && data.data) {
        setRegions(data.data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingRegions(false);
    }
  };

  const loadMacro = async () => {
    setLoadingMacro(true);
    try {
      const res = await fetch('/api/countries/analytics/macroeconomics');
      const data = await res.json();
      if (data.ok && data.data) {
        setMacroData(data.data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingMacro(false);
    }
  };

  const loadRankings = async () => {
    setLoadingRankings(true);
    try {
      const res = await fetch('/api/countries/analytics/rankings');
      const data = await res.json();
      if (data.ok && data.data) {
        setRankingsData(data.data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingRankings(false);
    }
  };

  const loadSeasons = async () => {
    setLoadingSeasons(true);
    try {
      const res = await fetch('/api/countries/analytics/tourism-seasons');
      const data = await res.json();
      if (data.ok && data.data) {
        setSeasonsMatrix(data.data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingSeasons(false);
    }
  };

  const toggleCompareCountry = (code: string) => {
    if (selectedCodesForCompare.includes(code)) {
      if (selectedCodesForCompare.length > 2) {
        setSelectedCodesForCompare(selectedCodesForCompare.filter((c) => c !== code));
      }
    } else {
      if (selectedCodesForCompare.length < 4) {
        setSelectedCodesForCompare([...selectedCodesForCompare, code]);
      } else {
        // replace last
        setSelectedCodesForCompare([...selectedCodesForCompare.slice(1), code]);
      }
    }
  };

  const activeRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  return (
    <div id="pan-arab-intelligence-view" className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-l from-[#071a2b] via-[#0b2840] to-[#071a2b] border border-[#1bb49e]/30 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1bb49e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#1bb49e]/20 text-[#8be4d4] border border-[#1bb49e]/40 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" />
                المرحلة الثانية • المنظومة التحليلية الإقليمية الموحدة
              </span>
              <span className="text-[11px] font-semibold text-stone-300">
                22 دولة عربية • 5 أقاليم جغرافية
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              مرصد التحليل الإقليمي والمقارنة الشاملة للدول العربية
            </h1>
            <p className="text-sm text-stone-300 max-w-3xl leading-relaxed">
              محرك تحليلي متقدم يربط الجغرافيا والمؤشرات الاقتصادية 2025 ومقارنة المعيشة والمساحات ومواسم السفر، مع الالتزام الصارم بضوابط الحوكمة وفصل البيانات المرجعية عن التوصيات التلقائية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onBackToCities && (
              <button
                id="btn-back-to-cities-from-intel"
                onClick={onBackToCities}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4 rotate-180" />
                <span>العودة لدليل المدن</span>
              </button>
            )}
            <button
              id="btn-intel-ai-ask"
              onClick={() => onOpenAIWithPrompt?.('قدم لي تقريراً تحليلياً مقارناً بين الأقاليم العربية الخمسة من حيث النمو الاقتصادي، تنوع الموارد، وفرص العمل للمغتربين')}
              className="px-4 py-2.5 rounded-xl bg-[#1bb49e] hover:bg-[#169683] text-[#071a2b] text-xs font-extrabold transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>تحليل ذكي فوري عبر DARB AI</span>
            </button>
          </div>
        </div>

        {/* Phases 2 & 3 Sub-Nav Tabs */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            id="tab-intel-atlas"
            onClick={() => setActiveTab('atlas')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'atlas'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>الأطلس والممرات الاستراتيجية (المرحلة 3)</span>
          </button>

          <button
            id="tab-intel-war-room"
            onClick={() => setActiveTab('war_room')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'war_room'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>غرفة العمليات ورادار الملاحة (المرحلة 11)</span>
          </button>

          <button
            id="tab-intel-tech-sovereignty"
            onClick={() => setActiveTab('tech_sovereignty')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'tech_sovereignty'
                ? 'bg-cyan-400 text-[#071a2b] shadow-md font-black ring-2 ring-cyan-300/40'
                : 'bg-white/5 text-cyan-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>الذكاء الاصطناعي السيادي والدفاع السيبراني والفضائي (المرحلة 15)</span>
            <span className="bg-cyan-500/20 text-cyan-200 px-1.5 py-0.5 rounded text-[9px] font-black">جديد</span>
          </button>

          <button
            id="tab-intel-sovereign-co-investment"
            onClick={() => setActiveTab('sovereign_co_investment')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'sovereign_co_investment'
                ? 'bg-emerald-400 text-[#071a2b] shadow-md font-black ring-2 ring-emerald-300/40'
                : 'bg-white/5 text-emerald-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span>تحالف الصناديق والمشاريع الكبرى (المرحلة 14)</span>
          </button>

          <button
            id="tab-intel-resilience"
            onClick={() => setActiveTab('resilience_2035')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'resilience_2035'
                ? 'bg-amber-400 text-[#071a2b] shadow-md font-black ring-2 ring-amber-300/40'
                : 'bg-white/5 text-amber-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Wheat className="w-3.5 h-3.5 text-amber-400" />
            <span>الأمن الغذائي والمائي وسيناريوهات 2035 (المرحلة 13)</span>
          </button>

          <button
            id="tab-intel-ministerial"
            onClick={() => setActiveTab('ministerial')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'ministerial'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>الحقيبة الوزارية والمصادقة (المرحلة 12)</span>
          </button>

          <button
            id="tab-intel-sovereign-integration"
            onClick={() => setActiveTab('sovereign_integration')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'sovereign_integration'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>الربط الكهربائي والتسوية السيادية (المرحلة 10)</span>
          </button>

          <button
            id="tab-intel-passport"
            onClick={() => setActiveTab('passport')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'passport'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>الجواز الرقمي والمطابقة B2B (المرحلة 9)</span>
          </button>

          <button
            id="tab-intel-common-market"
            onClick={() => setActiveTab('common_market')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'common_market'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>السوق والتكامل الصناعي (المرحلة 8)</span>
          </button>

          <button
            id="tab-intel-risk"
            onClick={() => setActiveTab('risk')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'risk'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>إدارة المخاطر والتنافسية (المرحلة 7)</span>
          </button>

          <button
            id="tab-intel-briefing"
            onClick={() => setActiveTab('briefing')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'briefing'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>مركز المذكرات التنفيذية (المرحلة 7)</span>
          </button>

          <button
            id="tab-intel-trade"
            onClick={() => setActiveTab('trade')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'trade'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>التجارة وسلاسل الإمداد (المرحلة 5)</span>
          </button>

          <button
            id="tab-intel-labor"
            onClick={() => setActiveTab('labor')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'labor'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>سوق العمل ومخطط الانتقال (المرحلة 5)</span>
          </button>

          <button
            id="tab-intel-mobility"
            onClick={() => setActiveTab('mobility')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'mobility'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>محاكي التأشيرات والطوارئ (المرحلة 4)</span>
          </button>

          <button
            id="tab-intel-free-zones"
            onClick={() => setActiveTab('free_zones')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'free_zones'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>المناطق الحرة والملف التنفيذي (المرحلة 4)</span>
          </button>

          <button
            id="tab-intel-sovereign"
            onClick={() => setActiveTab('sovereign')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'sovereign'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>الثروة السيادية والمشاريع الكبرى (المرحلة 6)</span>
          </button>

          <button
            id="tab-intel-climate-digital"
            onClick={() => setActiveTab('climate_digital')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'climate_digital'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>الاستدامة والذكاء الاصطناعي ومحاكي الاستثمار (المرحلة 6)</span>
          </button>

          <button
            id="tab-intel-budget"
            onClick={() => setActiveTab('budget')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'budget'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>حاسبة المعيشة ومحول العملات (المرحلة 3)</span>
          </button>

          <button
            id="tab-intel-annual"
            onClick={() => setActiveTab('annual')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'annual'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>حوكمة المؤشرات ومحاكي 2030 (المرحلة 3)</span>
          </button>

          <button
            id="tab-intel-comparator"
            onClick={() => setActiveTab('comparator')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'comparator'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>أداة المقارنة المباشرة (Side-by-Side)</span>
          </button>

          <button
            id="tab-intel-regions"
            onClick={() => setActiveTab('regions')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'regions'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>الأقاليم الجغرافية الـ5</span>
          </button>

          <button
            id="tab-intel-macro"
            onClick={() => setActiveTab('macro')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'macro'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>مرصد الاقتصاد العربي 2025</span>
          </button>

          <button
            id="tab-intel-areas"
            onClick={() => setActiveTab('areas')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'areas'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>ترتيب ومقارنة المساحات</span>
          </button>

          <button
            id="tab-intel-seasons"
            onClick={() => setActiveTab('seasons')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'seasons'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-sm'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>مصفوفة السياحة والمواسم</span>
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* PHASE 3, 4 & 5 TABS: ATLAS, TRADE, LABOR, MOBILITY, FREE ZONES    */}
      {/* ================================================================= */}
      {activeTab === 'atlas' && (
        <PanArabAtlasView
          onSelectCountryProfile={onSelectCountryProfile}
          onOpenAIWithPrompt={onOpenAIWithPrompt}
          onCompareCountry={(code) => {
            if (!selectedCodesForCompare.includes(code)) {
              setSelectedCodesForCompare([...selectedCodesForCompare, code]);
            }
            setActiveTab('comparator');
          }}
        />
      )}

      {/* PHASE 15: SOVEREIGN DIGITAL TECH, CYBER SHIELD, SUPERCOMPUTING & SPACE 2030-2045 */}
      {activeTab === 'tech_sovereignty' && (
        <PanArabPhase15TechSovereigntyView
          onSelectCountry={onSelectCountryProfile}
          onConsultAI={(prompt) => onOpenAIWithPrompt?.(prompt)}
        />
      )}

      {/* PHASE 14: SOVEREIGN WEALTH CO-INVESTMENT, MEGAPROJECT SYNDICATION & STRATEGIC OPPORTUNITIES BANK 2030-2045 */}
      {activeTab === 'sovereign_co_investment' && (
        <PanArabPhase14SovereignFundView
          onSelectCountry={onSelectCountryProfile}
          onConsultAI={(prompt) => onOpenAIWithPrompt?.(prompt)}
        />
      )}

      {/* PHASE 13: STRATEGIC FOOD & WATER SECURITY, RESILIENCE & 2035 SCENARIOS */}
      {activeTab === 'resilience_2035' && (
        <PanArabPhase13ResilienceView
          onSelectCountry={onSelectCountryProfile}
          onConsultAI={(prompt) => onOpenAIWithPrompt?.(prompt)}
        />
      )}

      {/* PHASE 12: MINISTERIAL COMMAND HUB, CUSTOMS VERIFICATION & TREATY DRAFTER */}
      {activeTab === 'ministerial' && (
        <PanArabMinisterialCommandView
          onSelectCountry={onSelectCountryProfile}
          onConsultAI={(prompt) => onOpenAIWithPrompt?.(prompt)}
        />
      )}

      {/* PHASE 11: REAL-TIME WAR ROOM & MARITIME RADAR */}
      {activeTab === 'war_room' && (
        <PanArabRealTimeWarRoomView
          onSelectCountry={onSelectCountryProfile}
          onConsultAI={(prompt) => onOpenAIWithPrompt?.(prompt)}
        />
      )}

      {/* PHASE 10: SOVEREIGN INTEGRATION, POWER GRID, CBDC & IMPACT SIMULATOR */}
      {activeTab === 'sovereign_integration' && (
        <PanArabSovereignIntegrationView
          onSelectCountry={onSelectCountryProfile}
          onConsultAI={(prompt) => onOpenAIWithPrompt?.(prompt)}
        />
      )}

      {/* PHASE 9: PAN-ARAB DIGITAL PASSPORT, B2B MATCHMAKER & STRATEGY CO-PILOT */}
      {activeTab === 'passport' && (
        <PanArabDigitalPassportView
          onNavigateTab={(tabId, subtabId) => {
            if (['atlas', 'passport', 'common_market', 'risk', 'briefing', 'trade', 'labor', 'mobility', 'free_zones', 'sovereign', 'climate_digital', 'budget', 'annual', 'comparator', 'regions', 'macro', 'areas', 'seasons'].includes(tabId)) {
              setActiveTab(tabId as any);
            }
          }}
          onSelectCountry={onSelectCountryProfile}
        />
      )}

      {/* PHASE 8: INTEGRATED INDUSTRIAL PARTNERSHIP, DEALS PIPELINE & GAFTA RULES OF ORIGIN */}
      {activeTab === 'common_market' && (
        <PanArabCommonMarketView
          onConsultAI={(prompt) => onOpenAIWithPrompt?.(prompt)}
          onSelectCountry={(countryCode) => onSelectCountryProfile?.(countryCode)}
        />
      )}

      {/* PHASE 7: GEOPOLITICAL RISK, ROUTING CONTINGENCY & COMPETITIVENESS */}
      {activeTab === 'risk' && (
        <PanArabRiskCompetitivenessView
          onConsultAI={(prompt) => onOpenAIWithPrompt?.(prompt)}
        />
      )}

      {/* PHASE 7: MINISTERIAL & C-SUITE EXECUTIVE BRIEFING CENTER */}
      {activeTab === 'briefing' && (
        <PanArabExecutiveBriefingCenter
          onConsultAI={(prompt) => onOpenAIWithPrompt?.(prompt)}
        />
      )}

      {activeTab === 'trade' && (
        <PanArabTradeSupplyChainView
          onOpenAIWithPrompt={onOpenAIWithPrompt}
          onSelectCountryProfile={onSelectCountryProfile}
        />
      )}

      {activeTab === 'labor' && (
        <PanArabLaborRelocationView
          onOpenAIWithPrompt={onOpenAIWithPrompt}
          onSelectCountryProfile={onSelectCountryProfile}
        />
      )}

      {activeTab === 'mobility' && (
        <PanArabMobilityView
          onOpenAIWithPrompt={onOpenAIWithPrompt}
          onSelectCountryProfile={onSelectCountryProfile}
        />
      )}

      {activeTab === 'free_zones' && (
        <PanArabInvestmentFreeZonesView
          onOpenAIWithPrompt={onOpenAIWithPrompt}
          onSelectCountryProfile={onSelectCountryProfile}
        />
      )}

      {activeTab === 'sovereign' && (
        <PanArabSovereignMegaProjectsView
          onOpenAIWithPrompt={onOpenAIWithPrompt}
          onSelectCountryProfile={onSelectCountryProfile}
        />
      )}

      {activeTab === 'climate_digital' && (
        <PanArabClimateDigitalView
          onOpenAIWithPrompt={onOpenAIWithPrompt}
          onSelectCountryProfile={onSelectCountryProfile}
        />
      )}

      {activeTab === 'budget' && (
        <PanArabBudgetCalculator
          onOpenAIWithPrompt={onOpenAIWithPrompt}
          onSelectCountryProfile={onSelectCountryProfile}
        />
      )}

      {activeTab === 'annual' && (
        <PanArabAnnualManagerView
          onOpenAIWithPrompt={onOpenAIWithPrompt}
          onSelectCountryProfile={onSelectCountryProfile}
        />
      )}

      {/* ================================================================= */}
      {/* TAB 1: COMPARATOR (أداة المقارنة المباشرة)                          */}
      {/* ================================================================= */}
      {activeTab === 'comparator' && (
        <div id="comparator-section" className="space-y-6">
          {/* Country Selection Header */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#1bb49e]" />
                  <span>تحديد الدول للمقارنة المباشرة (اختر بين دولتين إلى 4 دول)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  اختر من شبكة الدول أو استخدم النماذج السريعة المُعدة مسبقاً لمقارنة الأبعاد الاقتصادية، المعيشية، والجغرافية.
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-stone-400">نماذج سريعة:</span>
                <button
                  onClick={() => setSelectedCodesForCompare(['EG', 'SA', 'MA'])}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                >
                  🇪🇬 🇸🇦 🇲🇦 مصر، السعودية، المغرب
                </button>
                <button
                  onClick={() => setSelectedCodesForCompare(['SA', 'AE', 'QA'])}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                >
                  🇸🇦 🇦🇪 🇶🇦 ثلاثي الخليج
                </button>
                <button
                  onClick={() => setSelectedCodesForCompare(['PS', 'JO', 'LB'])}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                >
                  🇵🇸 🇯🇴 🇱🇧 بلاد الشام
                </button>
                <button
                  onClick={() => setSelectedCodesForCompare(['DZ', 'SD', 'LY'])}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                >
                  🇩🇿 🇸🇩 🇱🇾 عمالقة المساحة
                </button>
              </div>
            </div>

            {/* Country Selector Chips */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap gap-1.5">
              {availableSummaries.map((c) => {
                const isSelected = selectedCodesForCompare.includes(c.country_code);
                return (
                  <button
                    key={c.country_code}
                    id={`compare-chip-${c.country_code}`}
                    onClick={() => toggleCompareCountry(c.country_code)}
                    className={`px-2.5 py-1.2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#071a2b] text-white shadow-xs ring-2 ring-[#1bb49e]'
                        : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name_ar}</span>
                    {isSelected && <Check className="w-3 h-3 text-[#1bb49e]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side-by-Side Comparison Table */}
          {loadingCompare ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500 text-sm">
              جاري تجهيز ومواءمة البيانات المقارنة للمرحلة الثانية...
            </div>
          ) : comparisonData ? (
            <div className="space-y-6">
              {/* Matrix Table */}
              <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="p-4 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#1bb49e]" />
                    <span className="text-sm font-bold text-stone-900">مصفوفة المقارنة المباشرة المعيارية</span>
                  </div>
                  <span className="text-xs text-stone-500 font-semibold">
                    {comparisonData.countries.length} دول تحت الفحص
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-100/70">
                        <th className="p-3 font-bold text-stone-700 w-44">المعيار التحليلي</th>
                        {comparisonData.countries.map((c) => (
                          <th key={c.country_code} className="p-3 font-extrabold text-stone-900 min-w-[200px]">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{c.flag}</span>
                              <div>
                                <div className="text-sm font-bold">{c.name_ar}</div>
                                <div className="text-[11px] font-mono text-stone-500">{c.name_en}</div>
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800">
                      {/* العاصمة والعملة */}
                      <tr>
                        <td className="p-3 font-bold bg-stone-50/50 text-stone-700">العاصمة والسيادة</td>
                        {comparisonData.countries.map((c) => (
                          <td key={c.country_code} className="p-3 font-semibold">
                            <div>العاصمة: <span className="text-[#071a2b] font-bold">{c.capital}</span></div>
                            <div className="text-stone-500 text-[11px] mt-0.5">التقسيم: {c.provinces_count} {c.provinces_label}</div>
                          </td>
                        ))}
                      </tr>

                      {/* العملة ومفتاح الاتصال */}
                      <tr>
                        <td className="p-3 font-bold bg-stone-50/50 text-stone-700">العملة والاتصال</td>
                        {comparisonData.countries.map((c) => (
                          <td key={c.country_code} className="p-3 font-semibold">
                            <div className="text-[#1bb49e] font-bold">{c.currency} ({c.currency_symbol})</div>
                            <div className="text-stone-500 text-[11px] mt-0.5 font-mono dir-ltr inline-block">
                              {c.calling_code} • {c.domain_tld}
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* المساحة والترتيب */}
                      <tr>
                        <td className="p-3 font-bold bg-stone-50/50 text-stone-700">المساحة الجغرافية</td>
                        {comparisonData.metrics.area_comparison.map((item) => (
                          <td key={item.country_code} className="p-3">
                            <span className="font-extrabold text-stone-900">{item.area}</span>
                            <div className="text-stone-400 text-[10px] mt-0.5 font-mono">
                              {item.numeric_km2.toLocaleString('en-US')} km²
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* السكان */}
                      <tr>
                        <td className="p-3 font-bold bg-stone-50/50 text-stone-700">السكان والقياس</td>
                        {comparisonData.metrics.population_comparison.map((item) => (
                          <td key={item.country_code} className="p-3 font-medium text-stone-700 leading-tight">
                            {item.population}
                          </td>
                        ))}
                      </tr>

                      {/* تصنيف الاقتصاد 2025 */}
                      <tr>
                        <td className="p-3 font-bold bg-stone-50/50 text-stone-700">الهيكل الاقتصادي</td>
                        {comparisonData.metrics.economy_comparison.map((item) => (
                          <td key={item.country_code} className="p-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                              item.classification === 'oil_and_gas'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : item.classification === 'diversified'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-blue-100 text-blue-900 border border-blue-300'
                            }`}>
                              {item.classification === 'oil_and_gas'
                                ? 'اقتصاد نفط وغاز'
                                : item.classification === 'diversified'
                                ? 'اقتصاد متنوع'
                                : 'اقتصاد زراعي وتعدين وخدمات'}
                            </span>
                            <div className="text-[11px] text-stone-600 mt-1 font-semibold">
                              النمو 2025: <span className="text-[#071a2b] font-bold">{item.growth}</span>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* مؤشرات جودة المعيشة */}
                      <tr>
                        <td className="p-3 font-bold bg-stone-50/50 text-stone-700">مؤشرات المعيشة الحضرية</td>
                        {comparisonData.metrics.quality_of_life.map((item) => (
                          <td key={item.country_code} className="p-3 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-stone-500">الأمان الحضري:</span>
                              <span className="font-bold text-emerald-600">{item.avg_safety}/100</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-stone-500">جودة الإنترنت:</span>
                              <span className="font-bold text-blue-600">{item.avg_internet}/100</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-stone-500">مؤشر التكلفة:</span>
                              <span className="font-bold text-amber-600">{item.avg_cost}/100</span>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* أفضل أشهر الزيارة */}
                      <tr>
                        <td className="p-3 font-bold bg-stone-50/50 text-stone-700">المواسم والسياحة</td>
                        {comparisonData.metrics.seasons.map((item) => (
                          <td key={item.country_code} className="p-3">
                            <div className="font-bold text-stone-800">{item.best_season}</div>
                            <div className="text-xs text-stone-500 font-semibold">{item.best_months}</div>
                            <div className="mt-1 text-[10px] text-stone-500 bg-stone-50 p-1.5 rounded border border-stone-100">
                              {item.advisory}
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* إجراءات سريعة */}
                      <tr className="bg-stone-50/60">
                        <td className="p-3 font-bold text-stone-700">إجراءات</td>
                        {comparisonData.countries.map((c) => (
                          <td key={c.country_code} className="p-3">
                            <button
                              id={`btn-open-profile-from-compare-${c.country_code}`}
                              onClick={() => onSelectCountryProfile?.(c.country_code)}
                              className="px-3 py-1.5 rounded-lg bg-[#071a2b] hover:bg-[#1bb49e] hover:text-[#071a2b] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full"
                            >
                              <span>استعراض ملف الدولة</span>
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Comparison Questions Panel */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/80 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-stone-900 mb-3">
                  <Sparkles className="w-4 h-4 text-[#1bb49e]" />
                  <h4 className="text-sm font-bold">أسئلة تحليلية جاهزة عبر مساعد DARB AI الذكي</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {comparisonData.ai_comparison_prompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      id={`btn-compare-prompt-${idx}`}
                      onClick={() => onOpenAIWithPrompt?.(prompt)}
                      className="text-right p-3 rounded-xl bg-white border border-stone-200/80 hover:border-[#1bb49e] hover:shadow-xs transition-all text-xs font-semibold text-stone-800 flex items-center justify-between cursor-pointer"
                    >
                      <span className="leading-relaxed">{prompt}</span>
                      <ChevronLeft className="w-3.5 h-3.5 text-[#1bb49e] shrink-0 mr-2" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 2: THE 5 ARAB REGIONS (الأقاليم الجغرافية الـ5)                 */}
      {/* ================================================================= */}
      {activeTab === 'regions' && (
        <div id="regions-section" className="space-y-6">
          {/* Region Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {regions.map((reg) => {
              const isSelected = reg.id === selectedRegionId;
              return (
                <div
                  key={reg.id}
                  id={`region-card-${reg.id}`}
                  onClick={() => setSelectedRegionId(reg.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#071a2b] text-white border-[#1bb49e] shadow-md'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1bb49e]">إقليم</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'}`}>
                        {reg.countries_count} دول
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold mt-1">{reg.name_ar}</h4>
                    <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                      {reg.description_ar}
                    </p>
                  </div>
                  <div className={`mt-3 pt-2 text-[11px] font-mono border-t ${isSelected ? 'border-white/10 text-stone-400' : 'border-stone-100 text-stone-500'}`}>
                    المساحة: {reg.total_area_approx}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Region Deep Dive */}
          {activeRegion && (
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-[#1bb49e] border border-emerald-200">
                      دراسة إقليمية تفصيلية
                    </span>
                    <h3 className="text-xl font-extrabold text-stone-900">{activeRegion.name_ar}</h3>
                    <span className="text-xs font-mono text-stone-400">({activeRegion.name_en})</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 max-w-3xl leading-relaxed">
                    {activeRegion.description_ar}
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-stone-50 px-4 py-2.5 rounded-2xl border border-stone-200 shrink-0">
                  <div className="text-center px-2">
                    <div className="text-xs font-bold text-stone-500">الدول</div>
                    <div className="text-base font-extrabold text-[#071a2b]">{activeRegion.countries_count}</div>
                  </div>
                  <div className="w-px h-8 bg-stone-200" />
                  <div className="text-center px-2">
                    <div className="text-xs font-bold text-stone-500">المساحة المقدرة</div>
                    <div className="text-xs font-extrabold text-[#1bb49e]">{activeRegion.total_area_approx}</div>
                  </div>
                </div>
              </div>

              {/* Region Features */}
              <div>
                <h4 className="text-xs font-bold text-stone-500 mb-2">أبرز الخصائص الاستراتيجية والتضاريسية للإقليم:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {activeRegion.key_features.map((feat, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1bb49e] mt-1.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Countries in this Region */}
              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center justify-between">
                  <span>الدول الأعضاء في {activeRegion.name_ar}</span>
                  <span className="text-xs text-stone-500 font-normal">اضغط على أي دولة لفتح صفحتها الموسوعية</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {activeRegion.countries.map((c) => (
                    <div
                      key={c.country_code}
                      id={`region-country-card-${c.country_code}`}
                      onClick={() => onSelectCountryProfile?.(c.country_code)}
                      className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#1bb49e] hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{c.flag}</span>
                        <div>
                          <div className="font-extrabold text-sm text-stone-900 group-hover:text-[#1bb49e] transition-colors">
                            {c.name_ar}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            العاصمة: <span className="font-bold text-stone-700">{c.capital}</span>
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                            المساحة: {c.area_sq_km}
                          </div>
                        </div>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-stone-300 group-hover:text-[#1bb49e] group-hover:-translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 3: MACROECONOMIC INTELLIGENCE 2025 (مرصد الاقتصاد العربي)       */}
      {/* ================================================================= */}
      {activeTab === 'macro' && (
        <div id="macro-section" className="space-y-6">
          {loadingMacro ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500 text-sm">
              جاري جلب معطيات مرصد الاقتصاد العربي 2025...
            </div>
          ) : macroData ? (
            <div className="space-y-6">
              {/* Macro Indicators Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-white to-stone-50 border border-stone-200 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
                    <span>إجمالي الناتج الاسمي العربي المجمع</span>
                    <Coins className="w-4 h-4 text-[#1bb49e]" />
                  </div>
                  <div className="text-2xl font-black text-stone-900 mt-2">
                    3.8 تريليون $
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    بحسب بيانات البنك الدولي وصندوق النقد لعام 2025.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-white to-stone-50 border border-stone-200 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
                    <span>متوسط معدل النمو الاقتصادي العربي</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-emerald-600 mt-2">
                    {macroData.average_growth_rate}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    معدل سنوي مركب مرجعي لاقتصادات المنطقة في 2025.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-white to-stone-50 border border-stone-200 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
                    <span>مصدر التوثيق والحوكمة</span>
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-sm font-bold text-stone-900 mt-2">
                    {macroData.source_agency}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    بيانات مرجعية للأغراض الاسترشادية والتخطيطية.
                  </p>
                </div>
              </div>

              {/* CRITICAL GOVERNANCE ALERT (LIBYA & VOLATILITY WARNING) */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-5 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-amber-950">
                      ضابط حوكمة مالي حاسم: عدم الاعتماد على معدل النمو الفردي فقط
                    </h4>
                    <p className="text-xs text-amber-900 leading-relaxed font-medium">
                      {macroData.critical_volatility_warning}
                    </p>
                  </div>
                </div>
              </div>

              {/* Three Economic Categories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Oil & Gas */}
                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                      التصنيف الأول
                    </span>
                    <h4 className="text-base font-extrabold text-stone-900 mt-2">
                      {macroData.categories.oil_and_gas.title_ar}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {macroData.categories.oil_and_gas.description_ar}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap gap-1">
                    {macroData.categories.oil_and_gas.countries.map((c, i) => (
                      <span key={i} className="text-[11px] font-bold bg-stone-100 text-stone-800 px-2 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. Diversified */}
                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      التصنيف الثاني
                    </span>
                    <h4 className="text-base font-extrabold text-stone-900 mt-2">
                      {macroData.categories.diversified.title_ar}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {macroData.categories.diversified.description_ar}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap gap-1">
                    {macroData.categories.diversified.countries.map((c, i) => (
                      <span key={i} className="text-[11px] font-bold bg-stone-100 text-stone-800 px-2 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Agriculture / Mining / Services */}
                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      التصنيف الثالث
                    </span>
                    <h4 className="text-base font-extrabold text-stone-900 mt-2">
                      {macroData.categories.agriculture_mining_services.title_ar}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {macroData.categories.agriculture_mining_services.description_ar}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap gap-1">
                    {macroData.categories.agriculture_mining_services.countries.map((c, i) => (
                      <span key={i} className="text-[11px] font-bold bg-stone-100 text-stone-800 px-2 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gulf Diversification Trends */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-2">
                <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#1bb49e]" />
                  <span>مسارات تحول الاقتصادات الخليجية نحو القطاعات غير النفطية</span>
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {macroData.gulf_diversification_trends}
                </p>
              </div>

              {/* Sample Growth Table 2025 */}
              <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-900">عينة أرقام النمو المرجعية 2025 في العالم العربي</span>
                  <span className="text-xs text-stone-500">المصادر الدولية 2025</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-stone-100/70 border-b border-stone-200">
                        <th className="p-3 font-bold text-stone-700">الدولة</th>
                        <th className="p-3 font-bold text-stone-700">معدل النمو المرجعي 2025</th>
                        <th className="p-3 font-bold text-stone-700">طبيعة القطاع الحاكم</th>
                        <th className="p-3 font-bold text-stone-700">ملاحظة الحوكمة التحليلية</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {macroData.growth_sample_2025.map((row) => (
                        <tr key={row.country_code} className="hover:bg-stone-50/50">
                          <td className="p-3 font-bold text-stone-900 flex items-center gap-2">
                            <span>{row.flag}</span>
                            <span>{row.name_ar}</span>
                          </td>
                          <td className="p-3 font-extrabold text-[#1bb49e] font-mono">{row.growth_rate}</td>
                          <td className="p-3 text-stone-700 font-medium">{row.category}</td>
                          <td className="p-3 text-stone-500 text-[11px]">
                            {row.governance_note || 'مؤشر مرجعي قياسي معتمد'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 4: AREA RANKINGS & COMPARISON (مقارنة وترتيب المساحات)          */}
      {/* ================================================================= */}
      {activeTab === 'areas' && (
        <div id="areas-section" className="space-y-6">
          {loadingRankings ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500 text-sm">
              جاري حساب الترتيب الرياضي للمساحات الجغرافية...
            </div>
          ) : rankingsData ? (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="bg-gradient-to-r from-stone-900 to-[#071a2b] text-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-[#1bb49e]">المساحة الإجمالية للعالم العربي</div>
                  <div className="text-2xl md:text-3xl font-black mt-1">
                    {rankingsData.total_arab_area_display}
                  </div>
                  <p className="text-xs text-stone-300 mt-1 max-w-xl">
                    يمتد الوطن العربي على مساحة شاسعة تناهز 13.1 مليون كم² تربط بين قارتي آسيا وأفريقيا وتطل على 3 بحار ومحيطين.
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10 shrink-0">
                  <div className="text-center px-2">
                    <div className="text-[11px] text-stone-300">أكبر دولة</div>
                    <div className="text-sm font-extrabold text-[#8be4d4]">🇩🇿 الجزائر</div>
                  </div>
                  <div className="w-px h-7 bg-white/20" />
                  <div className="text-center px-2">
                    <div className="text-[11px] text-stone-300">أصغر دولة</div>
                    <div className="text-sm font-extrabold text-[#8be4d4]">🇧🇭 البحرين</div>
                  </div>
                </div>
              </div>

              {/* Largest 10 and Smallest 7 Comparison Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Largest 10 */}
                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#1bb49e]" />
                      <span>أكبر 10 دول عربية مساحة (تنازلياً)</span>
                    </h4>
                    <span className="text-xs text-stone-400 font-semibold">كم²</span>
                  </div>

                  <div className="space-y-2.5">
                    {rankingsData.largest_10.map((item) => {
                      const pctOfLargest = Math.round((item.numeric_value / 2381741) * 100);
                      return (
                        <div
                          key={item.country_code}
                          id={`area-item-${item.country_code}`}
                          onClick={() => onSelectCountryProfile?.(item.country_code)}
                          className="p-2.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all cursor-pointer"
                        >
                          <div className="flex items-center justify-between text-xs mb-1">
                            <div className="flex items-center gap-2 font-bold text-stone-900">
                              <span className="w-5 text-center text-stone-400 font-mono">#{item.rank}</span>
                              <span className="text-base">{item.flag}</span>
                              <span>{item.name_ar}</span>
                            </div>
                            <span className="font-extrabold text-stone-800 font-mono">{item.display_value}</span>
                          </div>
                          {/* Visual Bar */}
                          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-l from-[#1bb49e] to-[#071a2b] h-full rounded-full transition-all duration-500"
                              style={{ width: `${pctOfLargest}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Smallest 7 */}
                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-amber-600" />
                      <span>أصغر الدول العربية مساحة (تصاعدياً)</span>
                    </h4>
                    <span className="text-xs text-stone-400 font-semibold">كم²</span>
                  </div>

                  <div className="space-y-2.5">
                    {rankingsData.smallest_7.map((item, idx) => (
                      <div
                        key={item.country_code}
                        id={`area-small-${item.country_code}`}
                        onClick={() => onSelectCountryProfile?.(item.country_code)}
                        className="p-2.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-2 font-bold text-stone-900">
                            <span className="w-5 text-center text-amber-600 font-mono">#{idx + 1}</span>
                            <span className="text-base">{item.flag}</span>
                            <span>{item.name_ar}</span>
                          </div>
                          <span className="font-extrabold text-stone-800 font-mono">{item.display_value}</span>
                        </div>
                        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-l from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(5, (item.numeric_value / 83600) * 100))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 5: TOURISM SEASONS & SAFETY MATRIX (مصفوفة السياحة والأمان)    */}
      {/* ================================================================= */}
      {activeTab === 'seasons' && (
        <div id="seasons-section" className="space-y-6">
          {/* Governance Notice */}
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <span className="font-bold">تنبيه حوكمة السفر: </span>
              <span>
                الوضع الأمني والسياسي الحالي قد يجعل المناخ وحده غير كافٍ لتحديد صلاحية السفر في بعض الوجهات. المعلومات المعروضة هي توثيق مناخي وجغرافي استرشادي وليست توصية سفر رسمية؛ يلزم دائماً مراجعة السفارات وإرشادات الطيران المعتمدة قبل السفر.
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSeasonFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                seasonFilter === 'all' ? 'bg-[#071a2b] text-white' : 'bg-white border border-stone-200 text-stone-700'
              }`}
            >
              جميع الدول (22)
            </button>
            <button
              onClick={() => setSeasonFilter('winter_spring')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                seasonFilter === 'winter_spring' ? 'bg-[#071a2b] text-white' : 'bg-white border border-stone-200 text-stone-700'
              }`}
            >
              مواسم الشتاء والربيع (أكتوبر – أبريل)
            </button>
            <button
              onClick={() => setSeasonFilter('summer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                seasonFilter === 'summer' ? 'bg-[#071a2b] text-white' : 'bg-white border border-stone-200 text-stone-700'
              }`}
            >
              مواسم الصيف والخريف
            </button>
          </div>

          {/* Seasons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seasonsMatrix.map((item) => (
              <div
                key={item.country_code}
                id={`season-card-${item.country_code}`}
                onClick={() => onSelectCountryProfile?.(item.country_code)}
                className="bg-white border border-stone-200 hover:border-[#1bb49e] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.flag}</span>
                      <div>
                        <h4 className="font-extrabold text-sm text-stone-900">{item.name_ar}</h4>
                        <span className="text-[11px] text-stone-500">{item.capital}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.security_alert?.level === 'warning'
                        ? 'bg-red-100 text-red-800'
                        : item.security_alert?.level === 'advisory'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.security_alert?.level === 'warning'
                        ? 'قيود أمنية'
                        : item.security_alert?.level === 'advisory'
                        ? 'استرشادي بحذر'
                        : 'مستقر اعتيادياً'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                      <Calendar className="w-3.5 h-3.5 text-[#1bb49e]" />
                      <span>الموسم المفضل: {item.season_name}</span>
                    </div>
                    <div className="text-xs font-semibold text-[#1bb49e] bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                      أشهر الزيارة المناخية: {item.months}
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {item.climate_summary}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-semibold">
                  <span>فتح الملف الموسوعي</span>
                  <ChevronLeft className="w-3.5 h-3.5 text-[#1bb49e]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
