import { useState, useEffect } from 'react';
import { 
  Country, 
  City, 
  Job, 
  Service, 
  Ad, 
  Plan, 
  HealthStatus, 
  User 
} from './types';
import { fetchApi } from './api';
import Header from './components/Header';
import Hero from './components/Hero';
import CountryCityExplorer from './components/CountryCityExplorer';
import JobsSection from './components/JobsSection';
import ServicesSection from './components/ServicesSection';
import AdsSection from './components/AdsSection';
import AdminPanel from './components/AdminPanel';
import CommunitySection from './components/CommunitySection';
import ExpatToolsSection from './components/ExpatToolsSection';
import AccountSection from './components/AccountSection';
import ItemDetailsModal from './components/ItemDetailsModal';
import DarbAIWidget from './components/DarbAIWidget';
import DarbGlobalKnowledgeExplorer from './components/DarbGlobalKnowledgeExplorer';
import CountryPageView from './components/CountryPageView';
import PanArabIntelligenceView from './components/PanArabIntelligenceView';
import HomeCountriesShowcase from './components/HomeCountriesShowcase';
import AuthModal from './components/AuthModal';
import { SovereignSkeletonLoader } from './components/SovereignVisuals';
import { 
  Compass, 
  Briefcase, 
  Star, 
  ChevronLeft, 
  CheckCircle2, 
  ShieldCheck,
  Building2,
  PhoneCall,
  Mail,
  Sparkles,
  MessageSquare,
  Wrench
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [countries, setCountries] = useState<Country[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Modals state
  const [selectedItem, setSelectedItem] = useState<{
    type: 'job' | 'service' | 'ad';
    data: Job | Service | Ad;
  } | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [aiPrefilledPrompt, setAiPrefilledPrompt] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
    // Parse URL query parameters for deep linking
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const countryParam = params.get('country');
      if (tabParam) {
        if (['budget', 'converter', 'pan_arab', 'intel', 'pan_arab_intel'].includes(tabParam)) {
          setActiveTab('pan_arab_intel');
        } else {
          setActiveTab(tabParam);
        }
      }
      if (countryParam) {
        setSelectedCountryCode(countryParam.toUpperCase());
      }
    } catch (e) {
      console.warn('URL params error:', e);
    }

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.log('SW registration note:', err));
    }
  }, []);

  // Dynamic SEO & Title Management for DARB.ZADTOO.COM
  useEffect(() => {
    let title = 'دَرْب | المنظومة العربية الموحدة للتكامل الاقتصادي والتنقل الذكي';
    let desc = 'منظومة دَرْب الشاملة (DARB.ZADTOO.COM): البوابة العربية الموحدة للتكامل الاقتصادي، خرائط الدول التفاعلية، فرص العمل، والخدمات.';

    if (selectedCountryCode) {
      const countryObj = countries.find((c) => c.code === selectedCountryCode);
      const countryName = countryObj ? countryObj.name_ar : selectedCountryCode;
      title = `${countryName} | خريطة الدولة والمدن والوظائف والخدمات - دَرْب`;
      desc = `استكشف خريطة ${countryName} التفاعلية، مدنها، فرص العمل والوظائف المتاحة، والخدمات الموثوقة للمغتربين على منصة دَرْب (DARB.ZADTOO.COM).`;
    } else {
      switch (activeTab) {
        case 'pan_arab_intel':
          title = 'غرفة العمليات والملاحة والذكاء السيادي العربي | دَرْب';
          desc = 'مؤشرات التنافسية، الحقيبة الوزارية، غرفة العمليات والملاحة، وشبكات الطاقة على منصة دَرْب.';
          break;
        case 'jobs':
          title = 'فرص العمل والوظائف في الدول العربية | دَرْب';
          desc = 'تصفح أحدث الوظائف وفرص العمل المتاحة في مختلف الدول العربية للمغتربين والمهنيين على دَرْب.';
          break;
        case 'services':
          title = 'الخدمات والاستشارات القانونية والتنقل | دَرْب';
          desc = 'دليل الخدمات والاستشارات القانونية وتأسيس الأعمال والسكن في الدول العربية على دَرْب.';
          break;
        case 'community':
          title = 'ملتقى ومجتمع المغتربين والوافدين | دَرْب';
          desc = 'شارك تجاربك واستفساراتك وتواصل مع الجاليات والمغتربين في مختلف الدول عبر دَرْب.';
          break;
        case 'expat_tools':
          title = 'أدوات المغترب وحاسبة تكاليف المعيشة وتحويل العملات | دَرْب';
          desc = 'أدوات ذكية لحساب الميزانية وتكاليف المعيشة ومقارنة العملات في الدول العربية.';
          break;
        case 'knowledge':
          title = 'محرك المعرفة الشامل والذكاء الاصطناعي العربي | دَرْب';
          desc = 'محرك المعرفة الموثوق لإجراءات السفر والإقامة والأنظمة الحكومية العربية.';
          break;
      }
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);
  }, [activeTab, selectedCountryCode, countries]);

  const loadAllData = async () => {
    setLoading(true);
    const [cRes, jRes, sRes, aRes, pRes, hRes, mRes] = await Promise.all([
      fetchApi<Country[]>('/countries'),
      fetchApi<Job[]>('/jobs'),
      fetchApi<Service[]>('/services'),
      fetchApi<Ad[]>('/ads'),
      fetchApi<Plan[]>('/admin/plans'),
      fetchApi<HealthStatus>('/health'),
      fetchApi<{ user: User | null }>('/me'),
    ]);

    if (cRes.ok && cRes.data) setCountries(cRes.data);
    if (jRes.ok && jRes.data) setJobs(jRes.data);
    if (sRes.ok && sRes.data) setServices(sRes.data);
    if (aRes.ok && aRes.data) setAds(aRes.data);
    if (pRes.ok && pRes.data) setPlans(pRes.data);
    if (hRes.ok) setHealth(hRes as any);
    if (mRes.ok && mRes.user) setUser(mRes.user);

    setLoading(false);
  };

  const handleLogin = () => {
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await fetchApi('/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const handleHeroSearch = (term: string) => {
    setActiveTab('jobs');
  };

  return (
    <div id="darb-root-app" className="min-h-screen bg-[#f6f8fb] text-[#102235] flex flex-col font-sans selection:bg-[#1bb49e]/20 selection:text-[#071a2b] overflow-x-hidden">
      
      {/* Main Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        health={health}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main id="darb-page-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {loading ? (
          <div className="py-6 space-y-4">
            <SovereignSkeletonLoader mode="dashboard" />
          </div>
        ) : (
          <>
            {/* TAB: HOME */}
            {activeTab === 'home' && (
              <div className="space-y-10">
                {/* Hero section */}
                <Hero onSearch={handleHeroSearch} onNavigate={setActiveTab} />

                {/* 22 Arab Countries Visual Showcase with Authentic Imagery */}
                <HomeCountriesShowcase
                  countries={countries}
                  onSelectCountry={(code) => {
                    setSelectedCountryCode(code);
                    setActiveTab('countries');
                  }}
                  onOpenAIWithPrompt={(prompt) => setAiPrefilledPrompt(prompt)}
                  onExploreAll={() => setActiveTab('countries')}
                  onOpenTravelerSuite={() => setActiveTab('tools')}
                />

                {/* Featured Jobs */}
                <section id="darb-home-jobs" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-stone-900">أحدث الوظائف وفرص العمل</h2>
                      <p className="text-xs text-stone-500">فرص عمل في شركات رائدة وعن بُعد للمغتربين</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('jobs')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1bb49e] hover:text-[#169b88] cursor-pointer"
                    >
                      <span>عرض كل الوظائف ({jobs.length})</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {jobs.slice(0, 3).map((job) => (
                      <div
                        key={job.id}
                        onClick={() => setSelectedItem({ type: 'job', data: job })}
                        className="bg-white border border-stone-200 hover:border-[#1bb49e] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#1bb49e] bg-emerald-50 px-2 py-0.5 rounded">
                              {job.city_name || 'كل المدن'}
                            </span>
                            {job.featured && (
                              <span className="text-[10px] text-amber-600 flex items-center gap-0.5 font-bold">
                                <Star className="w-3 h-3 fill-amber-500" />
                                مميزة
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-stone-900 text-sm leading-snug">{job.title}</h3>
                          <p className="text-xs text-stone-500 line-clamp-2">{job.description}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                          <span className="text-stone-400 font-medium">{job.company_name}</span>
                          <span className="text-[#1bb49e] font-bold">تفاصيل</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Expatriate Services Highlights */}
                <section id="darb-home-services" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-stone-900">خدمات المغتربين والوافدين</h2>
                      <p className="text-xs text-stone-500">مكاتب محاماة، استشارات إقامة، وسكن معتمد</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('services')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1bb49e] hover:text-[#169b88] cursor-pointer"
                    >
                      <span>تصفح كل الخدمات ({services.length})</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {services.slice(0, 3).map((service) => (
                      <div
                        key={service.id}
                        onClick={() => setSelectedItem({ type: 'service', data: service })}
                        className="bg-white border border-stone-200 hover:border-[#1bb49e] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {service.category}
                          </span>
                          <h3 className="font-bold text-stone-900 text-sm leading-snug">{service.name_ar}</h3>
                          <p className="text-xs text-stone-500 line-clamp-2">{service.description_ar}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                          <span className="text-stone-400">{service.city_name || 'خدمة متعددة المدن'}</span>
                          <span className="text-[#1bb49e] font-bold">طلب الخدمة</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* V1.3 Feature Band: ماذا بعد الوصول؟ */}
                <section className="bg-gradient-to-l from-[#071a2b] via-[#0b2b41] to-[#071d2c] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#16344d] text-[#8be4d4] border border-[#1bb49e]/40">
                      <Sparkles className="w-3.5 h-3.5 text-[#46d0bc]" />
                      <span>ماذا بعد الوصول؟ • الاستقرار في بلدك الجديد</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold">
                      دَرْب لا يكتفي بإرشادك قبل السفر
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                      نرافقك خطوة بخطوة في إجراءات الاستقرار، السكن، العمل، والتكاليف المعيشية من خلال أدوات المغترب ومجتمع "اسأل أهل البلد".
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5 shrink-0">
                    <button
                      onClick={() => setActiveTab('tools')}
                      className="px-4 py-2.5 rounded-xl bg-[#1bb49e] hover:bg-[#169b88] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>أدوات المغترب (حاسبة + قائمة)</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('community')}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-[#8be4d4]" />
                      <span>مجتمع دَرْب (اسأل أهل البلد)</span>
                    </button>
                  </div>
                </section>
              </div>
            )}

            {/* TAB: GLOBAL KNOWLEDGE ENGINE (GKE V1) */}
            {activeTab === 'global_knowledge' && (
              <DarbGlobalKnowledgeExplorer />
            )}

            {/* TAB: PAN-ARAB INTELLIGENCE & COMPARATOR (PHASE 2) */}
            {activeTab === 'pan_arab_intel' && (
              <PanArabIntelligenceView
                onSelectCountryProfile={(code) => {
                  setSelectedCountryCode(code);
                  setActiveTab('countries');
                }}
                onOpenAIWithPrompt={(prompt) => setAiPrefilledPrompt(prompt)}
                onBackToCities={() => setActiveTab('countries')}
              />
            )}

            {/* TAB: COUNTRIES & CITIES */}
            {activeTab === 'countries' && (
              selectedCountryCode ? (
                <CountryPageView
                  countryCode={selectedCountryCode}
                  onBack={() => setSelectedCountryCode(null)}
                  onSelectCity={(_city) => {
                    setActiveTab('jobs');
                  }}
                  onOpenAIWithPrompt={(prompt) => setAiPrefilledPrompt(prompt)}
                  onOpenPanArabIntelligence={() => {
                    setSelectedCountryCode(null);
                    setActiveTab('pan_arab_intel');
                  }}
                  onOpenTravelerTools={(code) => {
                    setSelectedCountryCode(code);
                    setActiveTab('tools');
                  }}
                  onSelectJob={(j) => setSelectedItem({ type: 'job', data: j })}
                  onSelectService={(s) => setSelectedItem({ type: 'service', data: s })}
                />
              ) : (
                <CountryCityExplorer 
                  countries={countries} 
                  onViewCountryProfile={(code) => setSelectedCountryCode(code)}
                  onOpenAIWithPrompt={(prompt) => setAiPrefilledPrompt(prompt)}
                />
              )
            )}

            {/* TAB: JOBS */}
            {activeTab === 'jobs' && (
              <JobsSection
                jobs={jobs}
                countries={countries}
                onJobAdded={(newJob) => setJobs([newJob, ...jobs])}
                onSelectJob={(j) => setSelectedItem({ type: 'job', data: j })}
              />
            )}

            {/* TAB: SERVICES */}
            {activeTab === 'services' && (
              <ServicesSection
                services={services}
                countries={countries}
                onServiceAdded={(newService) => setServices([newService, ...services])}
                onSelectService={(s) => setSelectedItem({ type: 'service', data: s })}
              />
            )}

            {/* TAB: ADS */}
            {activeTab === 'ads' && (
              <AdsSection
                ads={ads}
                plans={plans}
                onAdAdded={(newAd) => setAds([newAd, ...ads])}
                onSelectAd={(a) => setSelectedItem({ type: 'ad', data: a })}
              />
            )}

            {/* TAB: COMMUNITY (V1.3) */}
            {activeTab === 'community' && (
              <CommunitySection
                countries={countries}
                services={services}
              />
            )}

            {/* TAB: EXPAT TOOLS & TRAVELER SUITE */}
            {activeTab === 'tools' && (
              <ExpatToolsSection
                countries={countries}
                onNavigateToCountry={(code) => setSelectedCountryCode(code)}
              />
            )}

            {/* TAB: ACCOUNT PROFILE (V1.7 Core) */}
            {activeTab === 'account' && (
              <AccountSection
                user={user}
                onUserUpdated={(updated) => setUser(updated)}
                onLogin={handleLogin}
                countries={countries}
              />
            )}

            {/* TAB: ADMIN */}
            {activeTab === 'admin' && (
              <AdminPanel 
                health={health} 
                user={user}
                onUserLoginSuccess={(loggedInUser) => {
                  setUser(loggedInUser);
                }}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer id="darb-footer" className="bg-[#071a2b] text-stone-300 border-t border-stone-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-3">
              <img 
                src="/darb-logo.svg" 
                alt="دَرْب" 
                className="h-10 w-auto max-w-[170px] object-contain"
              />
              <div className="border-r border-stone-700 pr-3 mr-1">
                <span className="text-xs text-stone-400 block font-normal">لا تسافر وحدك. دَرْب معك.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-300">
              <button onClick={() => setActiveTab('home')} className="hover:text-white cursor-pointer">الرئيسية</button>
              <button onClick={() => setActiveTab('countries')} className="hover:text-white cursor-pointer">22 دولة عربية والمدن</button>
              <button onClick={() => setActiveTab('jobs')} className="hover:text-white cursor-pointer">الوظائف</button>
              <button onClick={() => setActiveTab('services')} className="hover:text-white cursor-pointer">الخدمات</button>
              <button onClick={() => setActiveTab('community')} className="hover:text-[#8be4d4] cursor-pointer">مجتمع دَرْب</button>
              <button onClick={() => setActiveTab('tools')} className="hover:text-[#8be4d4] cursor-pointer">حقيبة وأدوات المسافر</button>
              <button onClick={() => setActiveTab('account')} className="hover:text-[#8be4d4] cursor-pointer">حسابي</button>
            </div>

            <div className="text-xs text-stone-500 font-mono">
              © 2026 DARB Full V1.9 — DARB AI Engine • All Rights Reserved
            </div>

          </div>
        </div>
      </footer>

      {/* Modals */}
      <ItemDetailsModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* Google Login & Member Registration Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
        }}
      />

      {/* Floating DARB AI Widget */}
      <DarbAIWidget 
        user={user} 
        externalPrompt={aiPrefilledPrompt}
        onClearExternalPrompt={() => setAiPrefilledPrompt(null)}
      />

    </div>
  );
}
