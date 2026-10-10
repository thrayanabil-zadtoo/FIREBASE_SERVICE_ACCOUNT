import { useState, type FormEvent } from 'react';
import { Search, Sparkles, Plane, Globe2, ShieldCheck, Users } from 'lucide-react';

interface HeroProps {
  onSearch: (term: string) => void;
  onNavigate: (tab: string) => void;
}

export default function Hero({ onSearch, onNavigate }: HeroProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const quickLinks = [
    {
      tab: 'countries',
      icon: '🌍',
      title: 'دليل الدول والمدن',
      subtitle: 'العالم العربي وأبرز الوجهات الدولية',
    },
    {
      tab: 'pan_arab_intel',
      icon: '⚖️',
      title: 'المرصد الإقليمي 2025',
      subtitle: 'المقارنة الشاملة والأقاليم الـ5',
    },
    {
      tab: 'jobs',
      icon: '💼',
      title: 'ابحث عن وظيفة',
      subtitle: 'فرص عمل حقيقية وعن بُعد',
    },
    {
      tab: 'services',
      icon: '🧭',
      title: 'خدمات المغتربين',
      subtitle: 'محامون، عقارات، وتصاديق',
    },
    {
      tab: 'tools',
      icon: '🧰',
      title: 'أدوات المغترب',
      subtitle: 'حاسبة المعيشة وقائمة المهام',
    },
  ];

  return (
    <section id="darb-hero-section" className="space-y-6 mt-1 sm:mt-2">
      {/* Main Banner — DARB V1.6 Clean Hero (Calibrated for Desktop, Tablet, & Mobile) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl min-h-[560px] sm:min-h-[520px] lg:min-h-[550px] text-white shadow-2xl border border-stone-800 flex flex-col justify-between p-4 sm:p-7 lg:p-10">
        
        {/* Full-width Panoramic Background with clean scene (no baked-in menus or search) */}
        <div 
          className="absolute inset-0 bg-cover bg-[position:62%_15%] sm:bg-[position:52%_32%] lg:bg-[position:48%_38%] bg-no-repeat transition-all duration-500 scale-[1.01]"
          style={{ backgroundImage: "url('/darb-hero-clean.png')" }}
          role="img"
          aria-label="مشهد سينمائي نظيف: مسافر بالحقيبة يتجه نحو المدينة وطائرة تحلق وخريطة العالم"
        />

        {/* Calibrated V1.6 Clean Overlay:
            - Desktop: Left/Center (Traveler 🚶 + Bag + City 🌆 + Airplane ✈️ + Map 🗺️): ultra-clear (opacity 6%-15%), while the right side (Arabic text & search) has a smooth dark gradient for optimal contrast.
            - Mobile: Top area is low opacity to show airplane and traveler, then smoothly transitions to deep dark navy for readability.
        */}
        <div className="absolute inset-0 hidden md:block bg-[linear-gradient(90deg,rgba(3,19,31,0.06)_0%,rgba(5,29,45,0.12)_35%,rgba(4,22,37,0.65)_68%,rgba(4,20,33,0.88)_100%)] pointer-events-none" />
        <div className="absolute inset-0 md:hidden bg-[linear-gradient(180deg,rgba(4,20,33,0.04)_0%,rgba(4,20,33,0.18)_34%,rgba(4,20,33,0.78)_65%,rgba(4,20,33,0.96)_100%)] pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#071a2b]/85 text-[#8be4d4] border border-[#1bb49e]/40 backdrop-blur-md shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#46d0bc] shrink-0" />
            <span className="truncate">بوابة المغتربين والباحثين عن آفاق جديدة</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold bg-[#071a2b]/80 backdrop-blur-md text-stone-200 border border-white/10 px-3 py-1 rounded-full">
              22 دولة عربية • آلاف الفرص
            </span>
          </div>
        </div>

        {/* Main Content (Headline, Subtitle, Search) - With calibrated top clearance for the clean scene */}
        <div className="relative z-10 max-w-xl lg:max-w-2xl my-auto pt-[170px] sm:pt-4 md:pt-2 pb-4 sm:pb-5 space-y-3.5 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] drop-shadow-md">
            بلدك القادم <br />
            <em className="not-italic text-[#46d0bc] filter drop-shadow-sm">يبدأ من هنا</em>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-stone-100 max-w-lg leading-relaxed drop-shadow-sm font-normal">
            اكتشف الدول والمدن، اعثر على الوظائف، واحصل على الخدمات التي تحتاجها في طريقك إلى حياة وفرصة جديدة.
          </p>

          {/* Search Box - Form stacks vertically on mobile, horizontal on tablet/desktop */}
          <form onSubmit={handleSearchSubmit} className="mt-2 sm:mt-3 flex flex-col sm:flex-row gap-2 max-w-xl bg-white p-2 sm:p-2.5 rounded-2xl shadow-2xl border border-white/20">
            <div className="relative flex-1 flex items-center pr-3 py-0.5">
              <Search className="w-5 h-5 text-stone-400 ml-2 shrink-0" />
              <input
                id="hero-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ماذا تبحث عنه؟ محامي، وظيفة، مدينة، إقامة..."
                className="w-full bg-transparent text-stone-900 placeholder-stone-400 text-sm focus:outline-hidden py-2"
              />
            </div>
            <button
              id="btn-hero-search"
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1bb49e] hover:bg-[#169b88] text-white font-bold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-sm shrink-0"
            >
              <span>⌕ ابحث في دَرْب</span>
            </button>
          </form>

          {/* Clean Trust Indicators with typographic separators */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2.5 text-xs sm:text-sm text-[#e3f5f2] border-t border-white/15 font-medium">
            <span className="flex items-center gap-1.5">
              <Plane className="w-4 h-4 text-[#46d0bc] shrink-0" />
              فرص عمل
            </span>
            <span className="text-stone-400" aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-[#46d0bc] shrink-0" />
              22 دولة ومدن عربية
            </span>
            <span className="text-stone-400" aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#46d0bc] shrink-0" />
              خدمات موثوقة
            </span>
            <span className="text-stone-400" aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#46d0bc] shrink-0" />
              مجتمع داعم
            </span>
          </div>
        </div>

        {/* Bottom Hero Caption Plate */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-3 border-t border-white/15">
          <div className="flex items-center gap-2.5">
            <img 
              src="/darb-logo.svg" 
              alt="شعار دَرْب الرسمي" 
              className="h-7 sm:h-8 w-auto object-contain filter drop-shadow" 
            />
            <span className="text-xs text-stone-200 font-medium">
              طريقك إلى بلدك وفرصتك القادمة — لا تسافر وحدك.
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#8be4d4] bg-[#071a2b]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <span>22 دولة عربية</span>
            <span>•</span>
            <span>بيانات موثوقة ومحدثة</span>
          </div>
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div id="darb-quick-links" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {quickLinks.map((link) => (
          <div
            key={link.tab}
            id={`quick-link-${link.tab}`}
            onClick={() => onNavigate(link.tab)}
            className="group bg-white hover:bg-stone-50/80 border border-stone-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">
              {link.icon}
            </div>
            <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#1bb49e] transition-colors">
              {link.title}
            </h3>
            <p className="text-xs text-stone-500 mt-1 line-clamp-1">
              {link.subtitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
