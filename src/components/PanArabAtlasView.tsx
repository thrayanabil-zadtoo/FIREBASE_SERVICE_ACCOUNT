import React, { useState, useEffect } from 'react';
import {
  Compass,
  Anchor,
  Plane,
  Layers,
  MapPin,
  ExternalLink,
  Scale,
  Sparkles,
  Info,
  ShieldCheck,
  Search,
  Maximize2
} from 'lucide-react';
import {
  PanArabGeospatialAtlas,
  StrategicStrait,
  StrategicMaritimePort,
  StrategicAirportHub
} from '../types/country-profile';
import { fetchApi } from '../api';

interface PanArabAtlasViewProps {
  onSelectCountryProfile?: (countryCode: string) => void;
  onOpenAIWithPrompt?: (prompt: string) => void;
  onCompareCountry?: (countryCode: string) => void;
}

export default function PanArabAtlasView({
  onSelectCountryProfile,
  onOpenAIWithPrompt,
  onCompareCountry
}: PanArabAtlasViewProps) {
  const [atlasData, setAtlasData] = useState<PanArabGeospatialAtlas | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLayer, setActiveLayer] = useState<'all' | 'regions' | 'straits' | 'ports' | 'airports'>('all');
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'country' | 'strait' | 'port' | 'airport';
    data: any;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAtlasData();
  }, []);

  const loadAtlasData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi<PanArabGeospatialAtlas>('/countries/geospatial/atlas');
      if (res.ok && (res as any).data) {
        setAtlasData((res as any).data);
        // Default selection: Egypt or Saudi Arabia
        const eg = (res as any).data.countries_geo?.find((c: any) => c.country_code === 'EG');
        if (eg) {
          setSelectedEntity({ type: 'country', data: eg });
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  // Geographic Projection Math
  // Longitude: -18 (Mauritania/Morocco) to 60 (Oman) => total range 78
  // Latitude: -13 (Comoros) to 38 (Syria/Iraq) => total range 51
  const mapWidth = 900;
  const mapHeight = 520;
  const minLng = -18;
  const maxLng = 60;
  const minLat = -13;
  const maxLat = 38;

  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * mapWidth;
    const y = ((maxLat - lat) / (maxLat - minLat)) * mapHeight;
    return { x: Math.max(30, Math.min(mapWidth - 30, x)), y: Math.max(30, Math.min(mapHeight - 30, y)) };
  };

  // Region color dictionary
  const regionColors: Record<string, { bg: string; stroke: string; label: string; text: string }> = {
    north_africa: { bg: 'bg-emerald-500/20', stroke: '#10b981', label: 'شمال أفريقيا', text: 'text-emerald-700' },
    nile_horn_africa: { bg: 'bg-amber-500/20', stroke: '#f59e0b', label: 'وادي النيل والقرن', text: 'text-amber-700' },
    levant: { bg: 'bg-sky-500/20', stroke: '#0ea5e9', label: 'بلاد الشام', text: 'text-sky-700' },
    iraq_gulf: { bg: 'bg-indigo-500/20', stroke: '#6366f1', label: 'العراق والخليج', text: 'text-indigo-700' },
    south_arabia: { bg: 'bg-rose-500/20', stroke: '#f43f5e', label: 'جنوب الجزيرة', text: 'text-rose-700' },
    arab_world: { bg: 'bg-gray-500/20', stroke: '#64748b', label: 'الوطن العربي', text: 'text-gray-700' }
  };

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-medium">جاري تحميل أطلس الخرائط والبيانات الجغرافية العربية 2025...</p>
      </div>
    );
  }

  if (!atlasData) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
        <p className="text-gray-600">تعذر تحميل بيانات الأطلس الجغرافي حالياً.</p>
        <button
          onClick={loadAtlasData}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const filteredCountries = searchQuery
    ? atlasData.countries_geo.filter((c) =>
        c.name_ar.includes(searchQuery) ||
        c.capital.includes(searchQuery) ||
        c.country_code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : atlasData.countries_geo;

  return (
    <div id="darb-pan-arab-atlas" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Compass className="w-3.5 h-3.5" />
              <span>المرحلة الثالثة: الأطلس الجغرافي والربط المكاني 2025</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              أطلس الوطن العربي والممرات الاستراتيجية
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
              استكشف الموقع الجغرافي والممرات المائية السيادية (قناة السويس، مضيق هرمز، باب المندب، جبل طارق) وأبرز الموانئ ومحاور الطيران الدولية عبر الأقاليم العربية الـ5.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAIWithPrompt?.('اشرح لي الأهمية الجيوسياسية للمضايق والممرات المائية العربية الـ 4 وتأثيرها على حركة التجارة العالمية')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>تحليل جيوسياسي بالذكاء الاصطناعي</span>
            </button>
          </div>
        </div>

        {/* Layer Filters & Search */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 ml-1">طبقات العرض:</span>
            {[
              { id: 'all', label: 'كافة الطبقات', icon: Layers },
              { id: 'regions', label: 'الأقاليم الـ 5', icon: Compass },
              { id: 'straits', label: 'المضايق والممرات (5)', icon: Anchor },
              { id: 'ports', label: 'الموانئ البحرية (12)', icon: Anchor },
              { id: 'airports', label: 'المطارات المحورية (12)', icon: Plane }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeLayer === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveLayer(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative min-w-[200px] w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن دولة أو عاصمة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/90 text-slate-100 placeholder-slate-400 text-xs rounded-lg pr-8 pl-3 py-1.5 border border-slate-700 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map (SVG) + Entity Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl p-4 md:p-6 border border-slate-800 shadow-md relative overflow-hidden">
          {/* Map Top Indicators */}
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>22 دولة عربية متصلة مكانياً</span>
              </span>
              <span className="hidden sm:inline-block">•</span>
              <span className="hidden sm:inline-block">المساحة الإجمالية: 13.1 مليون كم²</span>
            </div>
            <span className="text-[11px] text-slate-500">إسقاط جغرافي مرجعي متناسب</span>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full aspect-[900/520] bg-slate-900/80 rounded-xl border border-slate-800/80 overflow-hidden select-none">
            {/* Background Map Grids & Maritime Texture */}
            <svg
              viewBox={`0 0 ${mapWidth} ${mapHeight}`}
              className="w-full h-full"
              style={{ background: 'radial-gradient(circle at 60% 40%, #0f172a, #020617)' }}
            >
              {/* Latitude / Longitude lines */}
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.4" />
                </pattern>
                {/* Glow filter for active pins */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Water Bodies Labels */}
              <text x="110" y="70" fill="#475569" fontSize="11" fontWeight="bold" letterSpacing="1">البحر الأبيض المتوسط</text>
              <text x="50" y="320" fill="#334155" fontSize="11" fontWeight="bold">المحيط الأطلسي</text>
              <text x="500" y="320" fill="#475569" fontSize="10" fontWeight="bold">البحر الأحمر</text>
              <text x="730" y="210" fill="#475569" fontSize="10" fontWeight="bold">الخليج العربي</text>
              <text x="690" y="440" fill="#334155" fontSize="11" fontWeight="bold">بحر العرب والمحيط الهندي</text>

              {/* Maritime Connection Lines between Straits */}
              {atlasData.straits.map((strait, idx) => {
                const p = projectCoords(strait.coordinates.lat, strait.coordinates.lng);
                return (
                  <circle
                    key={`strait-orbit-${strait.id}`}
                    cx={p.x}
                    cy={p.y}
                    r={idx === 0 ? 18 : 14}
                    fill="none"
                    stroke="#059669"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    className="animate-spin origin-center"
                    style={{ animationDuration: `${10 + idx * 2}s` }}
                  />
                );
              })}

              {/* 1. Country Node Pins */}
              {filteredCountries.map((c) => {
                const pos = projectCoords(c.coordinates.lat, c.coordinates.lng);
                const isSelected = selectedEntity?.type === 'country' && selectedEntity.data.country_code === c.country_code;
                const regColor = regionColors[c.region_id] || regionColors.arab_world;

                return (
                  <g
                    key={c.country_code}
                    className="cursor-pointer transition-transform duration-200 hover:scale-110"
                    onClick={() => setSelectedEntity({ type: 'country', data: c })}
                  >
                    {/* Outer pulse if selected */}
                    {isSelected && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="22"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        className="animate-spin origin-center"
                        style={{ animationDuration: '6s' }}
                      />
                    )}

                    {/* Node Background */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? 16 : 13}
                      fill={isSelected ? '#059669' : '#1e293b'}
                      stroke={isSelected ? '#34d399' : regColor.stroke}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      filter={isSelected ? 'url(#glow)' : undefined}
                    />

                    {/* Flag Emoji in Pin */}
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fontSize={isSelected ? '12' : '10'}
                      className="pointer-events-none"
                    >
                      {c.flag}
                    </text>

                    {/* Country Name Label below */}
                    <text
                      x={pos.x}
                      y={pos.y + 24}
                      textAnchor="middle"
                      fill={isSelected ? '#34d399' : '#cbd5e1'}
                      fontSize="9.5"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="pointer-events-none font-sans"
                    >
                      {c.name_ar}
                    </text>
                  </g>
                );
              })}

              {/* 2. Strategic Straits Layer */}
              {(activeLayer === 'all' || activeLayer === 'straits') &&
                atlasData.straits.map((strait) => {
                  const pos = projectCoords(strait.coordinates.lat, strait.coordinates.lng);
                  const isSelected = selectedEntity?.type === 'strait' && selectedEntity.data.id === strait.id;

                  return (
                    <g
                      key={strait.id}
                      className="cursor-pointer transition-transform duration-150 hover:scale-125"
                      onClick={() => setSelectedEntity({ type: 'strait', data: strait })}
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="10"
                        fill="#0284c7"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        filter="url(#glow)"
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 3.5}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#ffffff"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        ⚓
                      </text>
                      <text
                        x={pos.x}
                        y={pos.y - 12}
                        textAnchor="middle"
                        fill="#7dd3fc"
                        fontSize="9"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {strait.name_ar}
                      </text>
                    </g>
                  );
                })}

              {/* 3. Strategic Seaports Layer */}
              {(activeLayer === 'all' || activeLayer === 'ports') &&
                atlasData.seaports.map((port, idx) => {
                  const pos = projectCoords(port.coordinates.lat, port.coordinates.lng);
                  const isSelected = selectedEntity?.type === 'port' && selectedEntity.data.name_ar === port.name_ar;

                  return (
                    <g
                      key={`port-${idx}`}
                      className="cursor-pointer transition-transform duration-150 hover:scale-125"
                      onClick={() => setSelectedEntity({ type: 'port', data: port })}
                    >
                      <rect
                        x={pos.x - 6}
                        y={pos.y - 6}
                        width="12"
                        height="12"
                        rx="2"
                        fill={isSelected ? '#f59e0b' : '#334155'}
                        stroke={isSelected ? '#fbbf24' : '#94a3b8'}
                        strokeWidth="1.5"
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 3}
                        textAnchor="middle"
                        fontSize="8"
                        fill="#ffffff"
                        className="pointer-events-none"
                      >
                        🚢
                      </text>
                    </g>
                  );
                })}

              {/* 4. Strategic Airports Hubs Layer */}
              {(activeLayer === 'all' || activeLayer === 'airports') &&
                atlasData.airports.map((airport) => {
                  const pos = projectCoords(airport.coordinates.lat, airport.coordinates.lng);
                  const isSelected = selectedEntity?.type === 'airport' && selectedEntity.data.iata === airport.iata;

                  return (
                    <g
                      key={`airport-${airport.iata}`}
                      className="cursor-pointer transition-transform duration-150 hover:scale-125"
                      onClick={() => setSelectedEntity({ type: 'airport', data: airport })}
                    >
                      <polygon
                        points={`${pos.x},${pos.y - 8} ${pos.x + 7},${pos.y + 5} ${pos.x - 7},${pos.y + 5}`}
                        fill={isSelected ? '#8b5cf6' : '#475569'}
                        stroke={isSelected ? '#c084fc' : '#cbd5e1'}
                        strokeWidth="1.5"
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 16}
                        textAnchor="middle"
                        fill={isSelected ? '#c084fc' : '#94a3b8'}
                        fontSize="8"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {airport.iata}
                      </text>
                    </g>
                  );
                })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-800 border border-emerald-400 inline-block" />
                <span>دولة عربية (22)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" />
                <span>مضيق وممر مائي (5)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
                <span>ميناء استراتيجي (12)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-purple-500 inline-block rotate-45" />
                <span>محور طيران IATA (12)</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-400">انقر على أي عنصر للاستعراض التفصيلي</span>
          </div>
        </div>

        {/* Entity Inspector Panel */}
        <div className="lg:col-span-4 space-y-4">
          {selectedEntity ? (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
              {/* Type Badge */}
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  selectedEntity.type === 'country'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : selectedEntity.type === 'strait'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : selectedEntity.type === 'port'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                }`}>
                  {selectedEntity.type === 'country' && 'بطاقة دولة سيادية'}
                  {selectedEntity.type === 'strait' && 'ممر ومضيق بحري استراتيجي'}
                  {selectedEntity.type === 'port' && 'ميناء بحري تجاري ولوجستي'}
                  {selectedEntity.type === 'airport' && 'محور طيران ونقل جوي دولي'}
                </span>

                <button
                  onClick={() => setSelectedEntity(null)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  إغلاق
                </button>
              </div>

              {/* Content depending on Entity */}
              {selectedEntity.type === 'country' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl shadow-sm rounded-lg p-1 bg-gray-50 border border-gray-100">
                      {selectedEntity.data.flag}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedEntity.data.name_ar}</h3>
                      <p className="text-xs text-gray-500">{selectedEntity.data.name_en} • العاصمة: {selectedEntity.data.capital}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-gray-500 block">المساحة:</span>
                      <span className="font-bold text-gray-800">{selectedEntity.data.area_sq_km.toLocaleString('ar-EG')} كم²</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-gray-500 block">السكان (2025):</span>
                      <span className="font-bold text-gray-800">{selectedEntity.data.population_display}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-gray-500 block">الناتج الاسمي:</span>
                      <span className="font-bold text-gray-800">{selectedEntity.data.gdp_reference}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-gray-500 block">مفتاح الهاتف والعملة:</span>
                      <span className="font-bold text-gray-800">{selectedEntity.data.calling_code} ({selectedEntity.data.currency_symbol})</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => onSelectCountryProfile?.(selectedEntity.data.country_code)}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>فتح الملف الشامل لـ {selectedEntity.data.name_ar}</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onCompareCountry?.(selectedEntity.data.country_code)}
                        className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Scale className="w-3.5 h-3.5 text-gray-600" />
                        <span>إضافة للمقارنة</span>
                      </button>

                      <button
                        onClick={() => onOpenAIWithPrompt?.(`أعطني تحليلاً اقتصادياً وجغرافياً سريعاً عن ${selectedEntity.data.name_ar} والقطاعات الواعدة فيها لعام 2025`)}
                        className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-emerald-200"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>تحليل ذكي</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedEntity.type === 'strait' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedEntity.data.name_ar}</h3>
                    <p className="text-xs text-sky-600 font-medium">{selectedEntity.data.name_en}</p>
                  </div>

                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-900 leading-relaxed">
                    <p className="font-semibold mb-1">الأهمية الاستراتيجية العالمية:</p>
                    <p>{selectedEntity.data.global_significance_ar}</p>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {selectedEntity.data.description_ar}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => onOpenAIWithPrompt?.(`ما هو الدور الجيوسياسي لـ ${selectedEntity.data.name_ar} في أمن الطاقة والتجارة العالمية وتأثيره على الدول العربية المطلة عليه؟`)}
                      className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>دراسة أمنية ولوجستية بالذكاء الاصطناعي</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedEntity.type === 'port' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedEntity.data.name_ar}</h3>
                    <p className="text-xs text-amber-700 font-medium">{selectedEntity.data.country_name_ar} • {selectedEntity.data.city}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-gray-500 block">المسطح المائي:</span>
                      <span className="font-bold text-gray-800">{selectedEntity.data.water_body}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-gray-500 block">القدرة الاستيعابية:</span>
                      <span className="font-bold text-amber-700">{selectedEntity.data.annual_capacity_teu || 'محور رئيسي'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {selectedEntity.data.strategic_note}
                  </p>

                  <button
                    onClick={() => onOpenAIWithPrompt?.(`كيف ينافس ${selectedEntity.data.name_ar} الموانئ العالمية وما هي خطوط الشحن والربط اللوجستي المرتبطة به؟`)}
                    className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>تحليل السلاسل اللوجستية</span>
                  </button>
                </div>
              )}

              {selectedEntity.type === 'airport' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{selectedEntity.data.name_ar}</h3>
                      <p className="text-xs text-purple-700 font-medium">{selectedEntity.data.city} ({selectedEntity.data.country_code})</p>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 font-mono font-bold rounded-lg text-sm border border-purple-200">
                      {selectedEntity.data.iata}
                    </span>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs">
                    <span className="text-purple-800 block font-semibold mb-1">حجم حركة المسافرين السنوية:</span>
                    <span className="text-base font-bold text-purple-950">{selectedEntity.data.annual_passengers_million}</span>
                  </div>

                  <div className="text-xs space-y-1">
                    <span className="text-gray-500 font-medium block">شركات الطيران الوطنية والمحورية:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEntity.data.hub_airlines.map((airline: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-[11px] border border-gray-200">
                          {airline}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenAIWithPrompt?.(`ما هي أفضل رحلات الترانزيت وشبكة الوجهات المتاحة عبر ${selectedEntity.data.name_ar} (${selectedEntity.data.iata})؟`)}
                    className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>دليل الترانزيت والسفر عبر المطار</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center py-10 space-y-3">
              <Compass className="w-10 h-10 text-gray-300 mx-auto" />
              <h4 className="text-sm font-bold text-gray-800">اختر عنصراً من الخريطة</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                انقر على أي دولة أو مضيق أو ميناء بحري أو مطار دولي لعرض بطاقة الإحصاءات الرسمية والتحليل المكاني.
              </p>
            </div>
          )}

          {/* Strategic Choke Points Quick Cards */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Anchor className="w-3.5 h-3.5 text-sky-600" />
              <span>المضايق والممرات المائية الخمسة الكبرى:</span>
            </h4>
            <div className="space-y-1.5">
              {atlasData.straits.map((strait) => (
                <button
                  key={strait.id}
                  onClick={() => setSelectedEntity({ type: 'strait', data: strait })}
                  className="w-full text-right p-2.5 rounded-xl bg-white hover:bg-sky-50/70 border border-slate-200/80 transition-all flex items-center justify-between group"
                >
                  <div>
                    <span className="text-xs font-bold text-gray-800 group-hover:text-sky-700 block">{strait.name_ar}</span>
                    <span className="text-[10px] text-gray-500">{strait.name_en}</span>
                  </div>
                  <span className="text-[11px] text-sky-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    عرض ←
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
