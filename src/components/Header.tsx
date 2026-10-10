import { useState } from 'react';
import { 
  Globe2, 
  Briefcase, 
  Compass, 
  Megaphone, 
  ShieldCheck, 
  Database, 
  LogIn, 
  LogOut, 
  User as UserIcon,
  UserCircle,
  Download,
  Menu,
  X,
  MessageSquare,
  Wrench,
  Scale
} from 'lucide-react';
import { HealthStatus, User } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  health: HealthStatus | null;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  health,
  user,
  onLogin,
  onLogout
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSuperAdmin = Boolean(
    user && (user.role === 'admin' || user.email?.toLowerCase() === 'thrayanabil@gmail.com')
  );

  const baseNavItems = [
    { id: 'home', label: 'الرئيسية', icon: Globe2 },
    { id: 'countries', label: 'اكتشف الدول والمدن', icon: Compass },
    { id: 'pan_arab_intel', label: 'المرصد الإقليمي والمقارنة', icon: Scale },
    { id: 'global_knowledge', label: 'دليل المعرفة للدول', icon: Globe2 },
    { id: 'jobs', label: 'الوظائف', icon: Briefcase },
    { id: 'services', label: 'خدمات المغتربين', icon: Compass },
    { id: 'ads', label: 'الإعلانات', icon: Megaphone },
    { id: 'community', label: 'مجتمع دَرْب', icon: MessageSquare },
    { id: 'tools', label: 'حقيبة وأدوات السفر', icon: Wrench },
    { id: 'account', label: 'حسابي', icon: UserCircle },
  ];

  // Admin tab is strictly closed to public & trial visitors and only visible to authorized admin
  const navItems = isSuperAdmin
    ? [...baseNavItems, { id: 'admin', label: 'لوحة المشرف', icon: ShieldCheck }]
    : baseNavItems;

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header id="darb-main-header" className="sticky top-0 z-50 bg-[#071a2b]/95 backdrop-blur-md text-white border-b border-stone-800/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Mobile Menu Toggle Button (☰) */}
          <div className="flex items-center lg:hidden">
            <button
              id="btn-mobile-menu"
              aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center text-stone-200 hover:text-[#8be4d4] hover:bg-[#16344d] rounded-xl transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#8be4d4]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div 
            id="darb-brand-logo" 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer select-none group py-1"
          >
            <img 
              src="/darb-logo.svg" 
              alt="دَرْب" 
              className="h-10 sm:h-12 w-auto object-contain group-hover:scale-[1.02] transition-transform filter drop-shadow" 
            />
            <div className="hidden xl:flex flex-col text-right leading-none border-r border-stone-700/80 pr-3">
              <span className="text-[13px] font-black tracking-tight text-white">دَرْب</span>
              <span className="text-[10px] text-[#8be4d4] font-medium mt-0.5">طريقك لفرصتك القادمة</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="darb-desktop-nav" className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#16344d] text-[#8be4d4] shadow-xs'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions & Account (Desktop + Mobile Compact) */}
          <div className="flex items-center gap-2">
            {/* Direct Full Project ZIP Download Button */}
            <a
              href="/api/download-project"
              download="DARB_ZADTOO_FULL_PROJECT.zip"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-[#16344d] hover:bg-[#1e4668] text-[#8be4d4] border border-[#1bb49e]/40 transition-all shadow-xs cursor-pointer"
              title="تحميل الموقع بالكامل مضغوطاً (كود، تصميم، وقواعد بيانات)"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">تحميل الموقع (ZIP)</span>
              <span className="sm:hidden">ZIP</span>
            </a>

            {/* User Session / Login */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-r border-stone-800">
                <button
                  onClick={() => handleNavClick('account')}
                  className="flex items-center gap-1.5 text-xs text-stone-200 hover:text-[#8be4d4] transition-colors cursor-pointer"
                  title="الانتقال إلى ملف حسابي"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#8be4d4]" />
                  <span className="max-w-[80px] sm:max-w-[120px] truncate font-medium">{user.name || user.email}</span>
                  {isSuperAdmin && (
                    <span className="text-[10px] font-bold bg-[#1bb49e]/20 text-[#8be4d4] border border-[#1bb49e]/40 px-2 py-0.5 rounded-full">
                      المشرف
                    </span>
                  )}
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="btn-google-login"
                onClick={onLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-[#1bb49e] hover:bg-[#169b88] text-white transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 shrink-0 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.14z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.09-6.68-4.91H1.21v3.15C3.25 21.46 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.21C.44 8.09 0 9.99 0 12s.44 3.91 1.21 5.44l4.11-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.54 1.21 6.56l4.11 3.15c.94-2.82 3.58-4.96 6.68-4.96z"/>
                </svg>
                <span>دخول عبر Google</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-800 bg-[#071a2b] px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-[#16344d] text-[#8be4d4]' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-stone-800 flex items-center justify-end">
            {user ? (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1 text-xs text-rose-400"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج</span>
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1bb49e] text-white"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>دخول</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
