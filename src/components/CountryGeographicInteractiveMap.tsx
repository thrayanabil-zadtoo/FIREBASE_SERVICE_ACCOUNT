import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Crown, 
  Waves, 
  Maximize2, 
  Minimize2, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Globe2, 
  ChevronLeft, 
  X,
  Building2,
  Navigation
} from 'lucide-react';
import { 
  CountryMapProfile, 
  GeoCityPoint, 
  GeoNeighbor, 
  getCountryMapDetails 
} from '../data/country-geography-map-data';

interface CountryGeographicInteractiveMapProps {
  countryCode: string;
  profile?: any;
  onSelectCity?: (city: any) => void;
  onSelectNeighborCountry?: (countryCode: string) => void;
}

export default function CountryGeographicInteractiveMap({
  countryCode,
  profile,
  onSelectCity,
  onSelectNeighborCountry
}: CountryGeographicInteractiveMapProps) {
  const mapData: CountryMapProfile = useMemo(() => {
    return getCountryMapDetails(countryCode, profile);
  }, [countryCode, profile]);

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeLayer, setActiveLayer] = useState<'all' | 'cities' | 'neighbors' | 'water'>('all');
  const [selectedCity, setSelectedCity] = useState<GeoCityPoint | null>(null);
  const [selectedNeighbor, setSelectedNeighbor] = useState<GeoNeighbor | null>(null);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // SVG dimensions
  const svgWidth = 920;
  const svgHeight = 560;

  // Compute projection box
  const bounds = mapData.bounds;
  const latSpan = Math.max(1.5, bounds.max_lat - bounds.min_lat);
  const lngSpan = Math.max(1.8, bounds.max_lng - bounds.min_lng);

  // Projection math: converts lat/lng to canvas x/y
  const projectCoords = (lat: number, lng: number) => {
    // Relative position inside country box (with 18% margin for neighbors & seas)
    const marginX = 140;
    const marginY = 90;
    const usableW = svgWidth - marginX * 2;
    const usableH = svgHeight - marginY * 2;

    const normX = (lng - bounds.min_lng) / lngSpan;
    const normY = (bounds.max_lat - lat) / latSpan; // inverted for SVG coordinates

    const baseCenterX = marginX + normX * usableW;
    const baseCenterY = marginY + normY * usableH;

    // Apply zoom and pan
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;

    const x = centerX + (baseCenterX - centerX) * zoomLevel + panOffset.x;
    const y = centerY + (baseCenterY - centerY) * zoomLevel + panOffset.y;

    return { x, y };
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(2.5, prev + 0.25));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(0.75, prev - 0.25));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedCity(null);
    setSelectedNeighbor(null);
    setCitySearchQuery('');
  };

  // Filter cities by search
  const filteredCities = useMemo(() => {
    if (!citySearchQuery.trim()) return mapData.cities;
    const q = citySearchQuery.toLowerCase();
    return mapData.cities.filter(c => 
      c.name_ar.toLowerCase().includes(q) || 
      (c.name_en && c.name_en.toLowerCase().includes(q)) ||
      (c.region_name && c.region_name.toLowerCase().includes(q))
    );
  }, [mapData.cities, citySearchQuery]);

  // Center coordinates on canvas
  const centerPoint = projectCoords(mapData.center.lat, mapData.center.lng);

  return (
    <div 
      id={`interactive-map-${countryCode}`}
      className={`relative bg-gradient-to-br from-[#071a2b] via-[#0c2236] to-[#081827] text-white rounded-3xl border border-stone-700/70 shadow-2xl overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl flex flex-col' : 'w-full'
      }`}
    >
      {/* Top Header Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-white/5 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#1bb49e]/20 text-[#8be4d4] border border-[#1bb49e]/30 shadow-inner">
            <Compass className="w-5 h-5 text-[#1bb49e]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl select-none">{mapData.flag}</span>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                خريطة {mapData.name_ar} الجغرافية والمدن المجاورة
              </h3>
              <span className="text-[11px] font-mono font-bold bg-white/10 text-emerald-300 px-2 py-0.5 rounded-md border border-white/15">
                {mapData.country_code}
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              العاصمة: <strong className="text-amber-300 font-bold">{mapData.capital}</strong> • {mapData.cities.length} مدن ومحافظات موثقة • {mapData.neighbors.length} دول مجاورة
            </p>
          </div>
        </div>

        {/* Action Buttons & Layer Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer toggles */}
          <div className="bg-black/30 p-1 rounded-xl border border-white/10 flex items-center gap-1 text-[11px] font-bold">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeLayer === 'all' ? 'bg-[#1bb49e] text-white shadow-xs' : 'text-stone-300 hover:text-white'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setActiveLayer('cities')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeLayer === 'cities' ? 'bg-[#1bb49e] text-white shadow-xs' : 'text-stone-300 hover:text-white'
              }`}
            >
              المدن فقط
            </button>
            <button
              onClick={() => setActiveLayer('neighbors')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeLayer === 'neighbors' ? 'bg-[#1bb49e] text-white shadow-xs' : 'text-stone-300 hover:text-white'
              }`}
            >
              الدول المجاورة
            </button>
            <button
              onClick={() => setActiveLayer('water')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeLayer === 'water' ? 'bg-[#1bb49e] text-white shadow-xs' : 'text-stone-300 hover:text-white'
              }`}
            >
              البحار والمياه
            </button>
          </div>

          {/* Zoom & Fullscreen buttons */}
          <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-white/15 rounded-lg text-stone-300 hover:text-white transition-all cursor-pointer"
              title="تكبير الخريطة"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-white/15 rounded-lg text-stone-300 hover:text-white transition-all cursor-pointer"
              title="تصغير الخريطة"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-white/15 rounded-lg text-stone-300 hover:text-white transition-all cursor-pointer"
              title="إعادة ضبط الموقع والتكبير"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 hover:bg-white/15 rounded-lg text-stone-300 hover:text-white transition-all cursor-pointer"
              title={isFullscreen ? "تصغير للشاشة العادية" : "ملء الشاشة"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Quick City Search Bar in Map */}
      <div className="px-5 py-2.5 bg-black/20 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="البحث عن مدينة على الخريطة..."
            value={citySearchQuery}
            onChange={(e) => setCitySearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/15 rounded-xl pr-8 pl-3 py-1.5 text-xs text-white placeholder-stone-400 focus:outline-hidden focus:border-[#1bb49e]"
          />
          {citySearchQuery && (
            <button 
              onClick={() => setCitySearchQuery('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-300">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-200 inline-block animate-pulse" />
            <span>العاصمة الوطنية ({mapData.capital})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#1bb49e] border border-white inline-block" />
            <span>حواضر ومدن الدولة</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-stone-700 border border-stone-500 inline-block" />
            <span>الدول المجاورة</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-sky-600/60 border border-sky-400 inline-block" />
            <span>المنافذ البحرية</span>
          </span>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className={`relative overflow-hidden ${isFullscreen ? 'flex-1 h-full' : 'h-[460px] sm:h-[540px]'}`}>
        
        {/* Background Grid & Sea Ripple Patterns */}
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full select-none cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'none' }}
        >
          <defs>
            {/* Country Gradient */}
            <radialGradient id={`countryGrad-${countryCode}`} cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#1bb49e" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#0d2a45" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#071a2b" stopOpacity="0.8" />
            </radialGradient>

            {/* Sea Pattern */}
            <pattern id="seaPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 0 30 Q 15 25 30 30 T 60 30" fill="none" stroke="#0ea5e9" strokeWidth="0.8" strokeOpacity="0.15" />
              <path d="M 0 45 Q 15 40 30 45 T 60 45" fill="none" stroke="#0ea5e9" strokeWidth="0.5" strokeOpacity="0.1" />
            </pattern>

            {/* Glow Filter for Capital */}
            <filter id="glowCapital" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sea / Ocean Background */}
          <rect width={svgWidth} height={svgHeight} fill="#051524" />
          <rect width={svgWidth} height={svgHeight} fill="url(#seaPattern)" />

          {/* Decorative Compass Rose in Corner */}
          <g transform="translate(70, 70)" opacity="0.45">
            <circle r="36" fill="none" stroke="#1bb49e" strokeWidth="1" strokeDasharray="3,3" />
            <path d="M 0 -34 L 5 -8 L 0 0 L -5 -8 Z" fill="#1bb49e" />
            <path d="M 0 34 L 5 8 L 0 0 L -5 8 Z" fill="#0d2a45" stroke="#1bb49e" strokeWidth="0.5" />
            <path d="M 34 0 L 8 5 L 0 0 L 8 -5 Z" fill="#0d2a45" stroke="#1bb49e" strokeWidth="0.5" />
            <path d="M -34 0 L -8 5 L 0 0 L -8 -5 Z" fill="#0d2a45" stroke="#1bb49e" strokeWidth="0.5" />
            <text x="0" y="-40" textAnchor="middle" fill="#8be4d4" fontSize="10" fontWeight="bold">شمال</text>
            <text x="44" y="4" textAnchor="start" fill="#8be4d4" fontSize="9">شرق</text>
            <text x="-44" y="4" textAnchor="end" fill="#8be4d4" fontSize="9">غرب</text>
            <text x="0" y="48" textAnchor="middle" fill="#8be4d4" fontSize="9">جنوب</text>
          </g>

          {/* Country Territory Vector Zone */}
          <g>
            {/* Country Central Halo / Ellipse Zone based on bounds */}
            {(() => {
              const pMin = projectCoords(bounds.min_lat, bounds.min_lng);
              const pMax = projectCoords(bounds.max_lat, bounds.max_lng);
              const width = Math.abs(pMax.x - pMin.x);
              const height = Math.abs(pMin.y - pMax.y);
              const cx = (pMin.x + pMax.x) / 2;
              const cy = (pMin.y + pMax.y) / 2;
              const rx = Math.max(120, width * 0.52);
              const ry = Math.max(90, height * 0.52);

              return (
                <g>
                  {/* Country Core Background Shading */}
                  <ellipse 
                    cx={cx} 
                    cy={cy} 
                    rx={rx + 16} 
                    ry={ry + 16} 
                    fill="none" 
                    stroke={mapData.palette.border_color} 
                    strokeWidth="2.5" 
                    strokeDasharray="6,4"
                    opacity="0.6"
                  />
                  <ellipse 
                    cx={cx} 
                    cy={cy} 
                    rx={rx} 
                    ry={ry} 
                    fill={`url(#countryGrad-${countryCode})`} 
                    stroke={mapData.palette.primary} 
                    strokeWidth="3"
                    className="transition-all duration-300"
                  />

                  {/* Water / Sea Coastal Labels */}
                  {(activeLayer === 'all' || activeLayer === 'water') && mapData.water_bodies.map((w, idx) => {
                    const rad = (w.angle_deg * Math.PI) / 180;
                    const wx = cx + Math.cos(rad) * (rx + 50);
                    const wy = cy - Math.sin(rad) * (ry + 35);
                    return (
                      <g key={idx} className="cursor-default select-none pointer-events-none">
                        <circle cx={wx} cy={wy} r="18" fill="#0284c7" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="0.8" />
                        <text
                          x={wx}
                          y={wy - 5}
                          textAnchor="middle"
                          fill="#7dd3fc"
                          fontSize="10"
                          fontWeight="bold"
                          className="drop-shadow-md"
                        >
                          🌊 {w.name_ar}
                        </text>
                        <text
                          x={wx}
                          y={wy + 8}
                          textAnchor="middle"
                          fill="#38bdf8"
                          fontSize="9"
                          opacity="0.85"
                        >
                          ({w.direction_ar})
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })()}

            {/* Connecting Lines between Capital and Major Cities */}
            {activeLayer !== 'neighbors' && mapData.cities.map((city, idx) => {
              if (city.is_capital) return null;
              const cp = projectCoords(city.lat, city.lng);
              return (
                <line
                  key={`line-${idx}`}
                  x1={centerPoint.x}
                  y1={centerPoint.y}
                  x2={cp.x}
                  y2={cp.y}
                  stroke="#1bb49e"
                  strokeWidth="0.8"
                  strokeDasharray="4,4"
                  strokeOpacity="0.3"
                />
              );
            })}

            {/* City Markers and Badges */}
            {activeLayer !== 'neighbors' && filteredCities.map((city, idx) => {
              const pt = projectCoords(city.lat, city.lng);
              const isSelected = selectedCity?.name_ar === city.name_ar;

              if (city.is_capital) {
                return (
                  <g 
                    key={`capital-${idx}`}
                    onClick={() => {
                      setSelectedCity(city);
                      setSelectedNeighbor(null);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Glowing radar pulses */}
                    <circle cx={pt.x} cy={pt.y} r="28" fill="#fbbf24" fillOpacity="0.12" className="animate-ping" />
                    <circle cx={pt.x} cy={pt.y} r="18" fill="#fbbf24" fillOpacity="0.25" stroke="#fbbf24" strokeWidth="1.5" />
                    <circle cx={pt.x} cy={pt.y} r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" filter="url(#glowCapital)" />
                    
                    {/* Capital Crown Star Icon */}
                    <text x={pt.x} y={pt.y + 4} textAnchor="middle" fontSize="12" fill="#ffffff">👑</text>

                    {/* Capital Label Badge */}
                    <g transform={`translate(${pt.x}, ${pt.y - 24})`}>
                      <rect 
                        x="-70" 
                        y="-14" 
                        width="140" 
                        height="26" 
                        rx="8" 
                        fill="#071a2b" 
                        stroke="#fbbf24" 
                        strokeWidth="1.5"
                        className="filter drop-shadow-lg"
                      />
                      <text x="0" y="4" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="900">
                        ⭐ {city.name_ar} (العاصمة)
                      </text>
                    </g>
                  </g>
                );
              }

              return (
                <g 
                  key={`city-${idx}`}
                  onClick={() => {
                    setSelectedCity(city);
                    setSelectedNeighbor(null);
                  }}
                  className="cursor-pointer group"
                >
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r={isSelected ? "9" : "6"} 
                    fill={isSelected ? "#34d399" : "#1bb49e"} 
                    stroke="#ffffff" 
                    strokeWidth={isSelected ? "2.5" : "1.8"}
                    className="transition-all duration-200 group-hover:scale-125"
                  />

                  {/* City Name Label */}
                  <g transform={`translate(${pt.x}, ${pt.y + 16})`}>
                    <rect 
                      x="-38" 
                      y="-10" 
                      width="76" 
                      height="18" 
                      rx="6" 
                      fill="rgba(7, 26, 43, 0.85)" 
                      stroke={isSelected ? "#1bb49e" : "rgba(255,255,255,0.2)"} 
                      strokeWidth={isSelected ? "1.5" : "0.8"}
                    />
                    <text 
                      x="0" 
                      y="3" 
                      textAnchor="middle" 
                      fill={isSelected ? "#34d399" : "#e2e8f0"} 
                      fontSize="9.5" 
                      fontWeight="bold"
                    >
                      {city.name_ar}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* Surrounding Neighboring Countries (Accurately Placed Around Perimeter) */}
          {(activeLayer === 'all' || activeLayer === 'neighbors') && mapData.neighbors.map((neighbor, idx) => {
            // Position around perimeter based on angle_deg
            const rad = (neighbor.angle_deg * Math.PI) / 180;
            const dist = 240 * zoomLevel;
            const nx = centerPoint.x + Math.cos(rad) * dist;
            const ny = centerPoint.y - Math.sin(rad) * dist;

            const isSelected = selectedNeighbor?.name_ar === neighbor.name_ar;

            return (
              <g 
                key={`neighbor-${idx}`}
                onClick={() => {
                  setSelectedNeighbor(neighbor);
                  setSelectedCity(null);
                }}
                className="cursor-pointer group"
              >
                {/* Border Direction Line from Country */}
                <line
                  x1={centerPoint.x}
                  y1={centerPoint.y}
                  x2={nx}
                  y2={ny}
                  stroke="#64748b"
                  strokeWidth="1.2"
                  strokeDasharray="3,3"
                  strokeOpacity="0.45"
                />

                {/* Neighbor Node Card in SVG */}
                <g transform={`translate(${nx}, ${ny})`}>
                  <rect 
                    x="-75" 
                    y="-22" 
                    width="150" 
                    height="44" 
                    rx="12" 
                    fill={isSelected ? "#0d2a45" : "#111c2a"} 
                    stroke={isSelected ? "#1bb49e" : "#334155"} 
                    strokeWidth={isSelected ? "2" : "1"}
                    className="filter drop-shadow-md group-hover:stroke-[#1bb49e] transition-all"
                  />
                  <text x="0" y="-4" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                    {neighbor.flag} {neighbor.name_ar.split(' ')[0]} {neighbor.name_ar.split(' ')[1] || ''}
                  </text>
                  <text x="0" y="12" textAnchor="middle" fill="#8be4d4" fontSize="9" fontWeight="medium">
                    📍 {neighbor.direction_ar}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Selected City Popover Card */}
        {selectedCity && (
          <div className="absolute bottom-4 right-4 max-w-sm w-full bg-[#071a2b]/95 backdrop-blur-md p-4 rounded-2xl border border-[#1bb49e]/50 shadow-2xl space-y-3 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#1bb49e]/20 text-[#8be4d4]">
                  {selectedCity.is_capital ? <Crown className="w-4 h-4 text-amber-400" /> : <MapPin className="w-4 h-4" />}
                </span>
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <span>{selectedCity.name_ar}</span>
                    {selectedCity.name_en && (
                      <span className="text-[10px] font-mono text-stone-400">({selectedCity.name_en})</span>
                    )}
                  </h4>
                  <p className="text-[11px] text-[#8be4d4]">
                    {selectedCity.is_capital ? 'العاصمة الوطنية الرسمية' : selectedCity.region_name || 'مدينة معتمدة'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCity(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-white/10">
              <div className="bg-white/5 p-2 rounded-xl">
                <span className="text-stone-400 block text-[10px]">الموقع الجغرافي</span>
                <span className="font-mono text-white text-[10px]">{selectedCity.lat.toFixed(2)}° N, {selectedCity.lng.toFixed(2)}° E</span>
              </div>
              {selectedCity.population_approx && (
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-stone-400 block text-[10px]">السكان التقريبي</span>
                  <span className="font-bold text-emerald-300">{selectedCity.population_approx}</span>
                </div>
              )}
            </div>

            {onSelectCity && (
              <button
                onClick={() => onSelectCity(selectedCity)}
                className="w-full py-2 bg-[#1bb49e] hover:bg-[#169b88] text-[#071a2b] font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>استعراض بيانات ومرافق {selectedCity.name_ar}</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Selected Neighbor Country Popover Card */}
        {selectedNeighbor && (
          <div className="absolute bottom-4 left-4 max-w-sm w-full bg-[#071a2b]/95 backdrop-blur-md p-4 rounded-2xl border border-stone-600/70 shadow-2xl space-y-3 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl select-none">{selectedNeighbor.flag}</span>
                <div>
                  <h4 className="font-extrabold text-sm text-white">
                    {selectedNeighbor.name_ar}
                  </h4>
                  <p className="text-[11px] text-emerald-300">
                    دولة مجاورة لـ {mapData.name_ar} ({selectedNeighbor.direction_ar})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedNeighbor(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              طبيعة الحدود: <strong>{selectedNeighbor.border_type === 'land' ? 'حدود برية مباشرة' : 'جوار بحري وممر مائي'}</strong>، تقع على الجهة {selectedNeighbor.direction_ar}.
            </p>

            {onSelectNeighborCountry && selectedNeighbor.code && (
              <button
                onClick={() => onSelectNeighborCountry(selectedNeighbor.code!)}
                className="w-full py-2 bg-white/15 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>الانتقال لدليل {selectedNeighbor.name_ar}</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

      </div>

      {/* Bottom Summary Bar */}
      <div className="px-5 py-3 bg-white/5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-300">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-[#1bb49e]" />
          <span>
            الرقعة الجغرافية المعتمدة: خط عرض <strong>{bounds.min_lat.toFixed(1)}° – {bounds.max_lat.toFixed(1)}°</strong> • خط طول <strong>{bounds.min_lng.toFixed(1)}° – {bounds.max_lng.toFixed(1)}°</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>مطابقة للمعاير الجغرافية والسيادية لدليل دَرْب المعتمد</span>
        </div>
      </div>

    </div>
  );
}
