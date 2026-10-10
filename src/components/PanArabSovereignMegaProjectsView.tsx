import React, { useState, useEffect } from 'react';
import {
  Building2,
  Coins,
  Sparkles,
  ExternalLink,
  Layers,
  Search,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Compass,
  Briefcase,
  Globe2,
  Zap,
  HardHat,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import {
  PanArabSovereignFund,
  PanArabMegaProject
} from '../types/country-profile';
import { fetchApi } from '../api';

interface PanArabSovereignMegaProjectsViewProps {
  onOpenAIWithPrompt?: (prompt: string) => void;
  onSelectCountryProfile?: (countryCode: string) => void;
}

export default function PanArabSovereignMegaProjectsView({
  onOpenAIWithPrompt,
  onSelectCountryProfile
}: PanArabSovereignMegaProjectsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'sovereign_funds' | 'mega_projects'>('sovereign_funds');

  // Data states
  const [funds, setFunds] = useState<PanArabSovereignFund[]>([]);
  const [megaProjects, setMegaProjects] = useState<PanArabMegaProject[]>([]);
  const [totalAum, setTotalAum] = useState(0);
  const [totalProjectsCost, setTotalProjectsCost] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [fundSearch, setFundSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [projectSectorFilter, setProjectSectorFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fundsRes, projectsRes] = await Promise.all([
        fetchApi<any>('/api/countries/analytics/sovereign-wealth'),
        fetchApi<any>('/api/countries/analytics/mega-projects')
      ]);

      if (fundsRes.ok && fundsRes.data) {
        setFunds(fundsRes.data);
        setTotalAum(fundsRes.total_aum_billion_usd || 0);
      }
      if (projectsRes.ok && projectsRes.data) {
        setMegaProjects(projectsRes.data);
        setTotalProjectsCost(projectsRes.total_estimated_cost_billion_usd || 0);
        setTotalJobs(projectsRes.total_jobs_target || 0);
      }
    } catch (err) {
      console.error('Failed to load sovereign & mega projects data', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFunds = funds.filter(f =>
    f.name_ar.toLowerCase().includes(fundSearch.toLowerCase()) ||
    f.name_en.toLowerCase().includes(fundSearch.toLowerCase()) ||
    f.country_name_ar.toLowerCase().includes(fundSearch.toLowerCase()) ||
    f.mandate_ar.toLowerCase().includes(fundSearch.toLowerCase())
  );

  const filteredProjects = megaProjects.filter(p => {
    const matchesSearch =
      p.name_ar.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.name_en.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.country_name_ar.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.description_ar.toLowerCase().includes(projectSearch.toLowerCase());

    const matchesSector = projectSectorFilter === 'all' || p.sector === projectSectorFilter;
    return matchesSearch && matchesSector;
  });

  return (
    <div id="pan-arab-sovereign-mega-projects-view" className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-[#071a2b] text-white border border-stone-800 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-[#1bb49e]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#1bb49e]/20 text-[#8be4d4] text-[11px] font-bold mb-3 border border-[#1bb49e]/30">
              <Coins className="w-3.5 h-3.5" />
              <span>المرحلة السادسة: الثروة السيادية والمشاريع التريليونية 2030</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">مرصد صناديق الثروة السيادية والمشاريع الكبرى العربية</h2>
            <p className="text-xs text-stone-300 max-w-2xl mt-1 leading-relaxed">
              تتبع محافظ صناديق الثروة السيادية العربية (PIF، ADIA، KIA، QIA، مبادلة، OIA، صندوق مصر السيادي، CDG)، وتطور المشاريع التريليونية الكبرى (نيوم، العاصمة الإدارية، رأس الحكمة، طنجة-تك، الدقم) ومستهدفات الوظائف واستثمارات المستقبل.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onOpenAIWithPrompt) {
                  onOpenAIWithPrompt(
                    'قدم لي تقريراً استراتيجياً معمقاً حول دور صناديق الثروة السيادية العربية والمشاريع الكبرى (Giga-projects) في إعادة تشكيل الاقتصاد الإقليمي بحلول 2030، وأبرز الفرص المتاحة للمستثمرين الدوليين والشركات الإقليمية.'
                  );
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1bb49e] to-teal-500 text-[#071a2b] font-bold text-xs shadow-xs hover:brightness-105 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>تحليل استراتيجي للصناديق مع AI</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('sovereign_funds')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'sovereign_funds'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-xs'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>صناديق الثروة السيادية العربية (${(totalAum / 1000).toFixed(2)} تريليون)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('mega_projects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'mega_projects'
                ? 'bg-[#1bb49e] text-[#071a2b] shadow-xs'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>مرصد المشاريع الكبرى 2030 (${totalProjectsCost} مليار)</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SUBTAB 1: SOVEREIGN WEALTH FUNDS DIRECTORY                            */}
      {/* ===================================================================== */}
      {activeSubTab === 'sovereign_funds' && (
        <div className="space-y-6">
          {/* Summary KPIs Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs text-stone-500 font-semibold block">إجمالي الأصول المدارة (AUM):</span>
              <div className="text-2xl font-extrabold text-stone-900 mt-1 flex items-baseline gap-1">
                <span>${totalAum.toLocaleString()}</span>
                <span className="text-xs text-[#1bb49e] font-bold">مليار دولار</span>
              </div>
              <span className="text-[11px] text-stone-400 mt-0.5 block">توازي أكثر من 3.8 تريليون دولار أمريكي</span>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs text-stone-500 font-semibold block">عدد الصناديق المرصودة:</span>
              <div className="text-2xl font-extrabold text-[#071a2b] mt-1">
                {funds.length} صناديق كبرى
              </div>
              <span className="text-[11px] text-stone-400 mt-0.5 block">تغطي الخليج والمشرق والمغرب العربي</span>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs text-stone-500 font-semibold block">التركيز الاستثماري المعاصر:</span>
              <div className="text-sm font-bold text-emerald-800 mt-1">
                الذكاء الاصطناعي، الطاقة النظيفة، والتصنيع المتقدم
              </div>
              <span className="text-[11px] text-stone-400 mt-0.5 block">إعادة توجيه الفوائض لتنويع مصادر الدخل</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث باسم الصندوق، الدولة، أو مجالات الاستثمار..."
                value={fundSearch}
                onChange={(e) => setFundSearch(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-10 pl-4 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-[#1bb49e] transition-all"
              />
            </div>
            <span className="text-xs font-bold text-stone-600 shrink-0">
              {filteredFunds.length} صندوق
            </span>
          </div>

          {/* Funds Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFunds.map((fund) => (
              <div
                key={fund.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:border-[#1bb49e] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{fund.flag}</span>
                      <div>
                        <h3 className="text-sm font-bold text-stone-900 leading-tight">{fund.name_ar}</h3>
                        <span className="text-[10px] text-stone-400 font-mono block">{fund.name_en}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                      ${fund.aum_billion_usd}B
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>الدولة: <strong className="text-stone-800">{fund.country_name_ar}</strong></span>
                    <span>سنة التأسيس: <strong className="font-mono text-stone-800">{fund.established_year}</strong></span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                    {fund.mandate_ar}
                  </p>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">قطاعات التركيز:</span>
                    <div className="flex flex-wrap gap-1">
                      {fund.key_focus_areas.map((area, i) => (
                        <span key={i} className="text-[10px] bg-teal-50/70 text-[#071a2b] font-medium px-2 py-0.5 rounded-md border border-teal-200/50">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">أبرز الاستثمارات والأصول:</span>
                    <ul className="text-[11px] text-stone-700 space-y-0.5 list-disc list-inside">
                      {fund.notable_investments.slice(0, 3).map((inv, i) => (
                        <li key={i}>{inv}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <a
                    href={fund.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#1bb49e] hover:underline flex items-center gap-1"
                  >
                    <span>البوابة الرسمية</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => {
                      if (onOpenAIWithPrompt) {
                        onOpenAIWithPrompt(
                          `قدم لي تحليلاً تفصيلياً لمحفظة استثمارات ${fund.name_ar} (${fund.name_en}) في ${fund.country_name_ar}، وأبرز استثماراتها العالمية والمحلية واستراتيجيتها المستقبلية.`
                        );
                      }
                    }}
                    className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#1bb49e]" />
                    <span>تحليل الصندوق</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUBTAB 2: GIGA & MEGA-PROJECTS TRACKER 2030                           */}
      {/* ===================================================================== */}
      {activeSubTab === 'mega_projects' && (
        <div className="space-y-6">
          {/* Summary KPIs Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs text-stone-500 font-semibold block">إجمالي الإنفاق الرأسمالي المقدر:</span>
              <div className="text-2xl font-extrabold text-stone-900 mt-1 flex items-baseline gap-1">
                <span>${totalProjectsCost.toLocaleString()}</span>
                <span className="text-xs text-[#1bb49e] font-bold">مليار دولار</span>
              </div>
              <span className="text-[11px] text-stone-400 mt-0.5 block">استثمارات حكومية وسيادية وشراكات دولية</span>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs text-stone-500 font-semibold block">فرص العمل المستهدفة:</span>
              <div className="text-2xl font-extrabold text-stone-900 mt-1 flex items-baseline gap-1">
                <span>{(totalJobs / 1000000).toFixed(1)}</span>
                <span className="text-xs text-purple-700 font-bold">مليون وظيفة مباشرة وغير مباشرة</span>
              </div>
              <span className="text-[11px] text-stone-400 mt-0.5 block">تعزز توظيف الكفاءات الوطنية والعربية</span>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs text-stone-500 font-semibold block">أفق الإنجاز الأكبر:</span>
              <div className="text-2xl font-extrabold text-emerald-800 mt-1">
                2026 - 2030
              </div>
              <span className="text-[11px] text-stone-400 mt-0.5 block">متوافق مع مستهدفات رؤى 2030 الوطنية</span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث باسم المشروع، الدولة، أو المعالم الرئيسية..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-10 pl-4 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-[#1bb49e] transition-all"
              />
            </div>

            {/* Sector filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
              {[
                { key: 'all', label: 'كافة القطاعات' },
                { key: 'smart_cities', label: 'المدن الذكية' },
                { key: 'tourism_entertainment', label: 'السياحة والترفيه' },
                { key: 'clean_energy', label: 'الطاقة النظيفة' },
                { key: 'infrastructure_logistics', label: 'الموانئ واللوجستيات' },
                { key: 'industrial_defense', label: 'الصناعة والتكنولوجيا' }
              ].map((sec) => (
                <button
                  key={sec.key}
                  onClick={() => setProjectSectorFilter(sec.key)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer text-[11px] ${
                    projectSectorFilter === sec.key
                      ? 'bg-[#071a2b] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mega-Projects Cards */}
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:border-[#1bb49e] transition-all flex flex-col md:flex-row md:items-start justify-between gap-5"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-2xl">{project.flag}</span>
                    <h3 className="text-base font-bold text-stone-900">{project.name_ar}</h3>
                    <span className="text-xs text-stone-400 font-mono">({project.name_en})</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1bb49e]/15 text-[#071a2b]">
                      سنة الإنجاز المستهدفة: {project.target_completion_year}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">{project.description_ar}</p>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs space-y-1">
                    <span className="font-bold text-stone-800 block">المرحلة الراهنة والوضع الميداني:</span>
                    <span className="text-stone-600 leading-relaxed block">{project.current_phase_ar}</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">أبرز المحطات والإنجازات الميدانية:</span>
                    <div className="flex flex-wrap gap-2">
                      {project.key_milestones.map((m, idx) => (
                        <span key={idx} className="text-[11px] bg-white border border-stone-200 px-2.5 py-1 rounded-lg text-stone-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{m}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 border-t md:border-t-0 md:border-r md:pr-5 pt-3 md:pt-0 border-stone-100 flex md:flex-col justify-between items-center md:items-end gap-3 min-w-[170px]">
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">الميزانية التقديرية:</span>
                    <span className="text-xl font-extrabold text-stone-900">${project.estimated_cost_billion_usd}B</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">الوظائف المستهدفة:</span>
                    <span className="text-xs font-extrabold text-purple-800 font-mono">
                      {project.jobs_target.toLocaleString()} وظيفة
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (onOpenAIWithPrompt) {
                        onOpenAIWithPrompt(
                          `قدم لي دراسة استشارية شاملة لمشروع ${project.name_ar} في ${project.country_name_ar}: التكلفة التقديرية ($${project.estimated_cost_billion_usd}B)، العائد الاقتصادي، وفرص الشراكة بين القطاعين العام والخاص.`
                        );
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#071a2b] hover:bg-stone-800 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#8be4d4]" />
                    <span>دراسة المشروع</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
