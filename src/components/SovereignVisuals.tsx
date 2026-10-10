import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Sparkles, 
  Search, 
  ArrowRight, 
  ChevronLeft,
  CheckCircle2,
  Building2,
  Globe2,
  Layers
} from 'lucide-react';

/* =========================================================================
   1. SOVEREIGN KPI CARD WITH SPARKLINE
   ========================================================================= */

interface SovereignKpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  sparklineData?: number[];
  color?: 'emerald' | 'cyan' | 'amber' | 'indigo' | 'purple';
  onClick?: () => void;
}

export function SovereignKpiCard({
  title,
  value,
  subtitle,
  change,
  trend = 'neutral',
  icon,
  sparklineData = [25, 30, 28, 35, 32, 40, 48, 45, 52, 60],
  color = 'emerald',
  onClick
}: SovereignKpiCardProps) {
  // Color palette styles
  const colorMap = {
    emerald: {
      accent: '#10b981',
      accentBg: 'rgba(16, 185, 129, 0.1)',
      border: 'border-emerald-500/20',
      gradient: 'from-emerald-500/20 to-transparent',
      text: 'text-emerald-400'
    },
    cyan: {
      accent: '#06b6d4',
      accentBg: 'rgba(6, 182, 212, 0.1)',
      border: 'border-cyan-500/20',
      gradient: 'from-cyan-500/20 to-transparent',
      text: 'text-cyan-400'
    },
    amber: {
      accent: '#f59e0b',
      accentBg: 'rgba(245, 158, 11, 0.1)',
      border: 'border-amber-500/20',
      gradient: 'from-amber-500/20 to-transparent',
      text: 'text-amber-400'
    },
    indigo: {
      accent: '#6366f1',
      accentBg: 'rgba(99, 102, 241, 0.1)',
      border: 'border-indigo-500/20',
      gradient: 'from-indigo-500/20 to-transparent',
      text: 'text-indigo-400'
    },
    purple: {
      accent: '#a855f7',
      accentBg: 'rgba(168, 85, 247, 0.1)',
      border: 'border-purple-500/20',
      gradient: 'from-purple-500/20 to-transparent',
      text: 'text-purple-400'
    }
  }[color];

  // SVG Sparkline path generator
  const width = 120;
  const height = 36;
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const range = maxVal - minVal || 1;

  const points = sparklineData.map((d, i) => {
    const x = (i / (sparklineData.length - 1)) * width;
    const y = height - ((d - minVal) / range) * (height - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-white border border-stone-200/90 hover:border-[#1bb49e] p-5 shadow-xs hover:shadow-xl transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      }`}
    >
      {/* Subtle top atmospheric glow line */}
      <div 
        className="absolute inset-x-0 top-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${colorMap.accent}, transparent)` }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1">
          <p className="text-xs font-semibold text-stone-500 line-clamp-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-stone-900 font-mono tracking-tight tabular-nums">
              {value}
            </span>
            {change && (
              <span
                className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded font-mono ${
                  trend === 'up'
                    ? 'text-emerald-700 bg-emerald-50'
                    : trend === 'down'
                    ? 'text-rose-700 bg-rose-50'
                    : 'text-stone-600 bg-stone-100'
                }`}
              >
                {trend === 'up' && <TrendingUp className="w-3 h-3" />}
                {trend === 'down' && <TrendingDown className="w-3 h-3" />}
                {trend === 'neutral' && <Minus className="w-3 h-3" />}
                <span>{change}</span>
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">{subtitle}</p>
          )}
        </div>

        {icon && (
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
            style={{ backgroundColor: colorMap.accentBg, color: colorMap.accent }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* SVG Sparkline at bottom */}
      <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
        <span className="text-[10px] text-stone-400 font-medium">الاتجاه والمؤشر</span>
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-24 h-7 overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`spark-grad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorMap.accent} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colorMap.accent} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#spark-grad-${color})`} />
          <path 
            d={pathD} 
            fill="none" 
            stroke={colorMap.accent} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>
    </div>
  );
}

/* =========================================================================
   2. SOVEREIGN SKELETON LOADER
   ========================================================================= */

interface SovereignSkeletonLoaderProps {
  mode?: 'cards' | 'dashboard' | 'list' | 'country_page';
  count?: number;
}

export function SovereignSkeletonLoader({
  mode = 'cards',
  count = 4
}: SovereignSkeletonLoaderProps) {
  if (mode === 'country_page') {
    return (
      <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="جاري تحميل الصفحة">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-9 w-44 bg-stone-200 rounded-xl" />
          <div className="flex gap-2">
            <div className="h-8 w-24 bg-stone-200 rounded-lg" />
            <div className="h-8 w-32 bg-stone-200 rounded-lg" />
          </div>
        </div>

        {/* Hero banner skeleton */}
        <div className="h-64 sm:h-72 w-full rounded-3xl bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          <div className="p-8 space-y-4 max-w-md">
            <div className="h-8 w-16 bg-stone-400/40 rounded-lg" />
            <div className="h-10 w-48 bg-stone-400/50 rounded-xl" />
            <div className="h-4 w-72 bg-stone-400/30 rounded" />
            <div className="h-4 w-56 bg-stone-400/30 rounded" />
          </div>
        </div>

        {/* 4 KPI cards skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white border border-stone-200 rounded-2xl p-4 space-y-2">
              <div className="h-3 w-20 bg-stone-200 rounded" />
              <div className="h-7 w-28 bg-stone-300 rounded" />
              <div className="h-3 w-36 bg-stone-100 rounded" />
            </div>
          ))}
        </div>

        {/* Tab row & content skeleton */}
        <div className="space-y-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-24 bg-stone-200 rounded-xl" />
            ))}
          </div>
          <div className="h-80 bg-white border border-stone-200 rounded-3xl p-6" />
        </div>
      </div>
    );
  }

  if (mode === 'dashboard') {
    return (
      <div className="space-y-6 animate-pulse" aria-busy="true">
        <div className="h-48 rounded-3xl bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white border border-stone-200 rounded-2xl p-4" />
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'list') {
    return (
      <div className="space-y-3 animate-pulse" aria-busy="true">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-20 bg-white border border-stone-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-stone-200" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-stone-200 rounded" />
                <div className="h-3 w-48 bg-stone-100 rounded" />
              </div>
            </div>
            <div className="h-8 w-20 bg-stone-200 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  // Default: cards grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col justify-between h-[360px]">
          <div className="h-44 bg-stone-200 relative">
            <div className="absolute top-3 inset-x-3 flex justify-between">
              <div className="h-6 w-20 bg-stone-300/60 rounded-lg" />
              <div className="h-6 w-12 bg-stone-300/60 rounded-lg" />
            </div>
          </div>
          <div className="p-4 space-y-3 flex-1">
            <div className="h-5 w-3/4 bg-stone-200 rounded" />
            <div className="h-3 w-full bg-stone-100 rounded" />
            <div className="h-3 w-2/3 bg-stone-100 rounded" />
          </div>
          <div className="p-4 pt-0">
            <div className="h-9 w-full bg-stone-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================================
   3. SOVEREIGN EMPTY STATE
   ========================================================================= */

interface SovereignEmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  icon?: 'search' | 'globe' | 'shield' | 'layers';
}

export function SovereignEmptyState({
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  icon = 'search'
}: SovereignEmptyStateProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-stone-200/90 p-8 sm:p-12 text-center max-w-xl mx-auto my-8 shadow-xs">
      {/* Decorative ambient background ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* SVG Icon Badge */}
      <div className="relative w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#071a2b] to-[#0f354f] text-[#8be4d4] flex items-center justify-center shadow-md">
        {icon === 'search' && <Search className="w-8 h-8" />}
        {icon === 'globe' && <Globe2 className="w-8 h-8" />}
        {icon === 'shield' && <Building2 className="w-8 h-8" />}
        {icon === 'layers' && <Layers className="w-8 h-8" />}
      </div>

      <h3 className="text-lg font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-md mx-auto mb-6">
        {description}
      </p>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="px-5 py-2.5 rounded-xl bg-[#1bb49e] hover:bg-[#169b88] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-2"
          >
            <span>{actionText}</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {secondaryActionText && onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   4. SOVEREIGN COMPARISON MATRIX (Between 2 Countries/Cities)
   ========================================================================= */

interface ComparisonMetric {
  label: string;
  unit?: string;
  valA: number | string;
  valB: number | string;
  valANumeric?: number;
  valBNumeric?: number;
  higherIsBetter?: boolean;
}

interface SovereignComparisonMatrixProps {
  nameA: string;
  flagA: string;
  nameB: string;
  flagB: string;
  metrics: ComparisonMetric[];
}

export function SovereignComparisonMatrix({
  nameA,
  flagA,
  nameB,
  flagB,
  metrics
}: SovereignComparisonMatrixProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs">
      {/* Header comparison banner */}
      <div className="bg-gradient-to-r from-[#071a2b] via-[#0b2b41] to-[#071d2c] p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{flagA}</span>
          <div>
            <h4 className="text-base font-bold text-white">{nameA}</h4>
            <span className="text-[11px] text-[#8be4d4]">الطرف الأول</span>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-stone-300 border border-white/10">
          مقارنة المؤشرات
        </div>

        <div className="flex items-center gap-3 text-left">
          <div>
            <h4 className="text-base font-bold text-white">{nameB}</h4>
            <span className="text-[11px] text-[#8be4d4]">الطرف الثاني</span>
          </div>
          <span className="text-3xl">{flagB}</span>
        </div>
      </div>

      {/* Metrics rows */}
      <div className="divide-y divide-stone-100">
        {metrics.map((m, idx) => {
          const numA = m.valANumeric ?? (typeof m.valA === 'number' ? m.valA : 50);
          const numB = m.valBNumeric ?? (typeof m.valB === 'number' ? m.valB : 50);
          const total = numA + numB || 100;
          const pctA = Math.round((numA / total) * 100);
          const pctB = 100 - pctA;

          return (
            <div key={idx} className="p-4 sm:p-5 hover:bg-stone-50/60 transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="font-mono text-stone-900 tabular-nums">
                  {m.valA} {m.unit || ''}
                </span>
                <span className="text-stone-500 font-bold">{m.label}</span>
                <span className="font-mono text-stone-900 tabular-nums">
                  {m.valB} {m.unit || ''}
                </span>
              </div>

              {/* Visual comparative bar */}
              <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden flex">
                <div 
                  className="h-full bg-[#1bb49e] transition-all duration-500" 
                  style={{ width: `${pctA}%` }} 
                  title={`${nameA}: ${pctA}%`}
                />
                <div 
                  className="h-full bg-stone-300 transition-all duration-500" 
                  style={{ width: `${pctB}%` }} 
                  title={`${nameB}: ${pctB}%`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   5. SOVEREIGN MAP DIVISION BADGE
   ========================================================================= */

interface SovereignMapDivisionBadgeProps {
  name: string;
  centerCity: string;
  population?: string;
  nature: 'coastal' | 'desert' | 'metropolitan' | 'agricultural' | 'mountainous';
  density: 'high' | 'medium' | 'low';
  onClick?: () => void;
}

export function SovereignMapDivisionBadge({
  name,
  centerCity,
  population,
  nature,
  density,
  onClick
}: SovereignMapDivisionBadgeProps) {
  const natureLabels = {
    coastal: { label: 'ساحلية / موانئ', icon: '🌊', bg: 'bg-blue-50 text-blue-700' },
    desert: { label: 'صحراوية / طاقة', icon: '🏜️', bg: 'bg-amber-50 text-amber-700' },
    metropolitan: { label: 'عاصمة / أعمال', icon: '🏙️', bg: 'bg-emerald-50 text-emerald-700' },
    agricultural: { label: 'زراعية / خضراء', icon: '🌿', bg: 'bg-green-50 text-green-700' },
    mountainous: { label: 'جبلية / سياحية', icon: '⛰️', bg: 'bg-purple-50 text-purple-700' }
  }[nature];

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-stone-200 rounded-2xl p-4 hover:border-[#1bb49e] hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h5 className="font-extrabold text-stone-900 text-sm">{name}</h5>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${natureLabels.bg}`}>
          {natureLabels.icon} {natureLabels.label}
        </span>
      </div>
      <div className="text-xs text-stone-500 space-y-1">
        <p>المركز الإداري: <span className="text-stone-800 font-semibold">{centerCity}</span></p>
        {population && (
          <p className="font-mono text-[11px] tabular-nums text-stone-400">
            السكان: {population}
          </p>
        )}
      </div>
    </div>
  );
}
