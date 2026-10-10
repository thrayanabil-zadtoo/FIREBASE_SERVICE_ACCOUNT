import React, { useState } from 'react';
import {
  Cpu,
  ShieldAlert,
  Satellite,
  Sparkles,
  Bot,
  Zap,
  Globe2,
  Lock,
  ChevronRight,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Compass,
  ArrowRightLeft,
  KeyRound,
  Download,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import {
  PanArabSovereignAiModel,
  PanArabSupercomputerCluster,
  PanArabCyberShieldThreat,
  PanArabSatelliteAsset,
  PanArabCyberReadinessSimulationResult
} from '../types/country-profile';
import {
  SOVEREIGN_AI_MODELS,
  SUPERCOMPUTER_CLUSTERS,
  CYBER_SHIELD_INCIDENTS,
  PAN_ARAB_SATELLITES,
  runCyberReadinessSimulation
} from '../data/pan-arab-phase15-data';

interface PanArabPhase15TechSovereigntyViewProps {
  onSelectCountry?: (countryCode: string) => void;
  onConsultAI?: (prompt: string) => void;
}

export const PanArabPhase15TechSovereigntyView: React.FC<PanArabPhase15TechSovereigntyViewProps> = ({
  onSelectCountry,
  onConsultAI
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ai_models' | 'supercomputing' | 'cyber_shield' | 'satellites' | 'cyber_simulator'>('ai_models');

  // AI Models State
  const [selectedModel, setSelectedModel] = useState<PanArabSovereignAiModel>(SOVEREIGN_AI_MODELS[0]);

  // Supercomputing State
  const [selectedCluster, setSelectedCluster] = useState<PanArabSupercomputerCluster>(SUPERCOMPUTER_CLUSTERS[0]);

  // Cyber Threats State
  const [selectedThreat, setSelectedThreat] = useState<PanArabCyberShieldThreat>(CYBER_SHIELD_INCIDENTS[0]);

  // Satellites State
  const [selectedSatellite, setSelectedSatellite] = useState<PanArabSatelliteAsset>(PAN_ARAB_SATELLITES[0]);

  // Cyber Simulator State
  const [simCountry, setSimCountry] = useState<string>('SA');
  const [simAttackVector, setSimAttackVector] = useState<'scada_power_grid' | 'swift_banking_ddos' | 'critical_port_ransomware' | 'satellite_gps_spoofing'>('scada_power_grid');
  const [simDefenseLevel, setSimDefenseLevel] = useState<'standard' | 'fortified' | 'quantum_hardened'>('fortified');
  const [simResult, setSimResult] = useState<PanArabCyberReadinessSimulationResult>(() =>
    runCyberReadinessSimulation({ country_code: 'SA', attack_vector: 'scada_power_grid', defense_investment_level: 'fortified' })
  );
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = runCyberReadinessSimulation({
        country_code: simCountry,
        attack_vector: simAttackVector,
        defense_investment_level: simDefenseLevel
      });
      setSimResult(res);
      setIsSimulating(false);
    }, 350);
  };

  return (
    <div id="pan-arab-phase15-container" className="space-y-6 animate-fadeIn text-right" dir="rtl">
      
      {/* Sovereign Header Card */}
      <div className="bg-gradient-to-br from-[#051525] via-[#092238] to-[#04111d] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-full text-xs font-black tracking-wide inline-flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                المرحلة 15 • السيادة الرقمية والحوسبة الفائقة والدفاع السيبراني والفضائي
              </span>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-3 py-1 rounded-full text-xs font-bold">
                أمن قومي تقني 2030-2045
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              الذكاء الاصطناعي السيادي، الحوسبة الكمية، درع الأمن السيبراني والأقمار الاصطناعية
            </h1>
            <p className="text-stone-300 text-sm leading-relaxed">
              منظومة السيادة التقنية العربية المشتركة: بناء وتشغيل النماذج اللغوية الوطنية (Falcon، ALLAM، Jais، Fanar)، مراكز الحوسبة الفائقة (Shaheen III، Condor Galaxy)، شبكة الدفاع والاستجابة لطوارئ الحاسب (CERT)، والأقمار الاصطناعية العربية لرصد الأرض والمناخ والاتصالات المشفرة.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onConsultAI?.('قدم لي تقريراً تحليلياً شاملاً حول السيادة التكنولوجية العربية، نماذج الذكاء الاصطناعي الوطنية، وجاهزية الدول العربية للتشفير المقاوم للحوسبة الكمية (Post-Quantum Cryptography)')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#071a2b] font-black text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>استشارة DARB AI التقنية السيادية</span>
            </button>
          </div>
        </div>

        {/* Global Key Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              نماذج الذكاء الاصطناعي السيادية
            </div>
            <div className="text-lg font-black text-cyan-300 mt-1">
              6 نماذج وطنية
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">أوزان ومعالجات مفتوحة وسيادية</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              قدرات الحوسبة الفائقة
            </div>
            <div className="text-lg font-black text-indigo-300 mt-1">
              4.1+ Exaflops
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">مجمعات كوندور وشاعين 3</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              المناعة السيبرانية للبنى الحرجة
            </div>
            <div className="text-lg font-black text-emerald-400 mt-1">
              99.2% حماية SCADA
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">عزل فيزيائي وتشفير وطني</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5 text-amber-400" />
              الأقمار الاصطناعية المدارية
            </div>
            <div className="text-lg font-black text-amber-300 mt-1">
              القمر العربي 813
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">رصد الموارد وحياد الكربون</div>
          </div>
        </div>

        {/* Phase 15 Sub-Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto mt-6 pt-4 border-t border-white/10 scrollbar-none">
          <button
            onClick={() => setActiveSubTab('ai_models')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'ai_models'
                ? 'bg-cyan-400 text-[#071a2b] shadow-md shadow-cyan-400/30'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>نماذج الذكاء الاصطناعي السيادية (Sovereign LLMs)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('supercomputing')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'supercomputing'
                ? 'bg-cyan-400 text-[#071a2b] shadow-md shadow-cyan-400/30'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>الحواسيب الفائقة ومجمعات السيليكون (Supercomputers)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('cyber_shield')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'cyber_shield'
                ? 'bg-cyan-400 text-[#071a2b] shadow-md shadow-cyan-400/30'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>درع الأمن السيبراني ورادار الهجمات (Cyber Shield)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('satellites')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'satellites'
                ? 'bg-cyan-400 text-[#071a2b] shadow-md shadow-cyan-400/30'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Satellite className="w-4 h-4" />
            <span>مرصد الفضاء والأقمار الاصطناعية (Space Tech)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('cyber_simulator')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'cyber_simulator'
                ? 'bg-cyan-400 text-[#071a2b] shadow-md shadow-cyan-400/30'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>محاكي التشفير المقاوم للكم وحماية البنى التحتية</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: SOVEREIGN AI MODELS                                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'ai_models' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Models List */}
          <div className="lg:col-span-5 space-y-3 max-h-[720px] overflow-y-auto pr-1">
            {SOVEREIGN_AI_MODELS.map(model => {
              const isSelected = selectedModel.model_id === model.model_id;
              return (
                <div
                  key={model.model_id}
                  onClick={() => setSelectedModel(model)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#071a2b] to-[#0c2a42] text-white border-cyan-400 shadow-md ring-2 ring-cyan-400/30'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-cyan-400/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{model.flag}</span>
                      <div>
                        <h4 className="text-sm font-black leading-snug">{model.model_name_ar}</h4>
                        <span className={`text-[11px] font-semibold ${isSelected ? 'text-cyan-300' : 'text-stone-500 dark:text-stone-400'}`}>
                          {model.developer_entity_ar}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-lg">
                      {model.parameter_count_billion}B
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className={isSelected ? 'text-stone-300' : 'text-stone-500'}>
                      دقة اللغة العربية: <strong className="text-emerald-400">{model.benchmark_arabic_score_pct}%</strong>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      model.open_weight_license
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {model.open_weight_license ? 'أوزان مفتوحة (Open)' : 'سيادي مخصص (Sovereign)'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Model Card */}
          <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedModel.flag}</span>
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">{selectedModel.model_name_ar}</h3>
                  <div className="text-xs text-stone-500 font-semibold">{selectedModel.developer_entity_ar} • إطلاق عام {selectedModel.release_year}</div>
                </div>
              </div>

              <button
                onClick={() => onConsultAI?.(`قدم لي تحليلاً تقنياً للنموذج اللغوي العربي "${selectedModel.model_name_ar}" وعدد معاملاته ${selectedModel.parameter_count_billion} مليار، ومقارنته بالنماذج العالمية من حيث استيعاب السياق والتشريعات المحلية`)}
                className="px-4 py-2 rounded-xl bg-[#071a2b] hover:bg-[#0c2a42] text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>تحليل المعمارية عبر AI</span>
              </button>
            </div>

            {/* Key Numbers */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-center">
                <div className="text-[10px] text-stone-500 font-bold">حجم المعلمات (Parameters)</div>
                <div className="text-xl font-black text-cyan-600 dark:text-cyan-400 mt-1">{selectedModel.parameter_count_billion} مليار</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-center">
                <div className="text-[10px] text-stone-500 font-bold">دقة الاختبارات المعيارية</div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{selectedModel.benchmark_arabic_score_pct}%</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-center">
                <div className="text-[10px] text-stone-500 font-bold">اللغات المدعومة</div>
                <div className="text-xs font-black text-stone-800 dark:text-stone-200 mt-2 line-clamp-1">{selectedModel.primary_language_ar}</div>
              </div>
            </div>

            {/* Datacenter Location */}
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-3">
              <Server className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <div>
                <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400">مركز الاستضافة ومقر الخوادم:</div>
                <div className="text-xs font-black text-cyan-900 dark:text-cyan-200">{selectedModel.datacenter_location_ar}</div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="space-y-2">
              <div className="text-xs font-black text-stone-800 dark:text-stone-200">مجالات الاستخدام السيادي والتطبيقي:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedModel.use_cases_ar.map((uc, i) => (
                  <div key={i} className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{uc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: SUPERCOMPUTERS                                                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'supercomputing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            {SUPERCOMPUTER_CLUSTERS.map(cluster => {
              const isSelected = selectedCluster.cluster_id === cluster.cluster_id;
              return (
                <div
                  key={cluster.cluster_id}
                  onClick={() => setSelectedCluster(cluster)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#071a2b] to-[#0c2a42] text-white border-cyan-400 shadow-md ring-2 ring-cyan-400/30'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-cyan-400/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cluster.flag}</span>
                      <div>
                        <h4 className="text-sm font-black">{cluster.cluster_name_ar}</h4>
                        <span className={`text-[11px] font-semibold ${isSelected ? 'text-cyan-300' : 'text-stone-500 dark:text-stone-400'}`}>
                          {cluster.country_name_ar}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-xl">
                      {cluster.peak_performance_petaflops} PFLOPS
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className={isSelected ? 'text-stone-300' : 'text-stone-500'}>
                      طاقة متجددة: <strong>{cluster.renewable_powered_pct}%</strong>
                    </span>
                    <span className="text-emerald-400 font-bold">كفاءة PUE: {cluster.carbon_pue_index}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedCluster.flag}</span>
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">{selectedCluster.cluster_name_ar}</h3>
                  <div className="text-xs text-stone-500 font-semibold">{selectedCluster.operator_entity_ar}</div>
                </div>
              </div>
            </div>

            {/* Architecture Details */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1">
              <div className="text-[11px] font-bold text-stone-500">معمارية المعالجات وتسريع الذكاء الاصطناعي:</div>
              <div className="text-xs font-black text-stone-800 dark:text-stone-200">{selectedCluster.gpu_architecture_ar}</div>
            </div>

            {/* Strategic Missions */}
            <div className="space-y-2">
              <div className="text-xs font-black text-stone-800 dark:text-stone-200">المهام البحثية والتطبيقية الكبرى:</div>
              <div className="space-y-2">
                {selectedCluster.strategic_missions_ar.map((mission, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{mission}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: CYBER SHIELD & THREAT RADAR                                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'cyber_shield' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CYBER_SHIELD_INCIDENTS.map(inc => {
              const isSelected = selectedThreat.threat_id === inc.threat_id;
              return (
                <div
                  key={inc.threat_id}
                  onClick={() => setSelectedThreat(inc)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#071a2b] to-[#0c2a42] text-white border-cyan-400 shadow-xl ring-2 ring-cyan-400/40'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-cyan-400/40 shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {inc.severity}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">{inc.detected_timestamp}</span>
                    </div>

                    <h4 className="text-sm font-black leading-snug">{inc.threat_category}</h4>
                    <p className={`text-xs line-clamp-3 leading-relaxed ${isSelected ? 'text-stone-300' : 'text-stone-600 dark:text-stone-400'}`}>
                      {inc.incident_summary_ar}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400">{inc.status_ar}</span>
                    <span className="text-[10px] text-stone-500">منظومة CERT العربية</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Threat Detailed Action Plan */}
          <div className="bg-[#071a2b] border border-cyan-400/30 rounded-3xl p-6 text-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-cyan-300 bg-cyan-400/20 px-3 py-1 rounded-full">
                  تحليل استخباراتي سيبراني مفصل
                </span>
                <h3 className="text-lg font-black mt-2 text-white">{selectedThreat.threat_category}</h3>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-[11px] text-stone-400 font-bold">بصمة التهديد ومصدر الهجمة:</div>
              <p className="text-xs text-stone-200">{selectedThreat.origin_fingerprint_ar}</p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black text-cyan-300">التدابير المضادة والإجراءات الوقائية المنفذة عبر CERT:</div>
              <div className="space-y-2">
                {selectedThreat.cert_countermeasures_ar.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-stone-300 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: SATELLITES & SPACE ASSETS                                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'satellites' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            {PAN_ARAB_SATELLITES.map(sat => {
              const isSelected = selectedSatellite.satellite_id === sat.satellite_id;
              return (
                <div
                  key={sat.satellite_id}
                  onClick={() => setSelectedSatellite(sat)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#071a2b] to-[#0c2a42] text-white border-cyan-400 shadow-md ring-2 ring-cyan-400/30'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-cyan-400/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-black">{sat.name_ar}</h4>
                      <span className={`text-[11px] font-semibold ${isSelected ? 'text-cyan-300' : 'text-stone-500 dark:text-stone-400'}`}>
                        {sat.operator_agency_ar}
                      </span>
                    </div>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                      {sat.status_ar}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className={isSelected ? 'text-stone-300' : 'text-stone-500'}>
                      دقة التصوير: <strong className="text-cyan-400">{sat.resolution_meters}م</strong>
                    </span>
                    <span className="text-amber-400 font-bold">{sat.orbit_type_ar.split('(')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">{selectedSatellite.name_ar}</h3>
                <div className="text-xs text-stone-500 font-semibold">{selectedSatellite.operator_agency_ar} • إطلاق عام {selectedSatellite.launch_year}</div>
              </div>

              <div className="flex items-center gap-1.5">
                {selectedSatellite.countries_involved.map((c, i) => (
                  <span key={i} title={c.name_ar} className="text-2xl">{c.flag}</span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-1">
              <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400">المهمة الاستراتيجية الأساسية:</div>
              <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 leading-relaxed">
                {selectedSatellite.primary_mission_ar}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400">السيادة على البيانات وحرية الوصول:</div>
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 leading-relaxed">
                {selectedSatellite.data_sovereignty_ar}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 5: CYBER RESILIENCE & POST-QUANTUM SIMULATOR                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'cyber_simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-cyan-500" />
              <span>محددات محاكاة التهديد والاستجابة:</span>
            </h3>

            {/* Country Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">الدولة المستهدفة بالمحاكاة:</label>
              <select
                value={simCountry}
                onChange={e => setSimCountry(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 cursor-pointer"
              >
                <option value="SA">🇸🇦 المملكة العربية السعودية</option>
                <option value="AE">🇦🇪 الإمارات العربية المتحدة</option>
                <option value="EG">🇪🇬 جمهورية مصر العربية</option>
                <option value="MA">🇲🇦 المملكة المغربية</option>
              </select>
            </div>

            {/* Attack Vector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">ناقل الهجوم السيبراني المفترض:</label>
              <select
                value={simAttackVector}
                onChange={e => setSimAttackVector(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 cursor-pointer"
              >
                <option value="scada_power_grid">⚡ اختراق أنظمة SCADA وشبكة الكهرباء</option>
                <option value="swift_banking_ddos">💳 هجوم DDoS مكثف ضد البنوك والمقاصة</option>
                <option value="critical_port_ransomware">🚢 برمجيات فدية ضد رافعات الموانئ اللوجستية</option>
                <option value="satellite_gps_spoofing">🛰️ تشويش ملاحي وتضليل إشارات GPS بالمضائق</option>
              </select>
            </div>

            {/* Defense Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">مستوى التحصين السيادي المطبق:</label>
              <div className="space-y-2">
                {[
                  { id: 'standard', title: 'دفاع تجاري قياسي (Standard)' },
                  { id: 'fortified', title: 'دفاع مؤسسي محصن (Fortified - موصى به)' },
                  { id: 'quantum_hardened', title: 'مقاوم للحوسبة الكمية (Post-Quantum Hardened)' }
                ].map(d => (
                  <div
                    key={d.id}
                    onClick={() => setSimDefenseLevel(d.id as any)}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      simDefenseLevel === d.id
                        ? 'bg-cyan-500/10 border-cyan-500 text-stone-900 dark:text-stone-100 font-black'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{d.title}</span>
                      {simDefenseLevel === d.id && <CheckCircle2 className="w-4 h-4 text-cyan-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-500 text-[#071a2b] font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {isSimulating ? (
                <span>جارٍ محاكاة ردع الهجمة واختبار المناعة...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تنفيذ محاكاة الصمود السيبراني والردع</span>
                </>
              )}
            </button>
          </div>

          {/* Simulation Output */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#071a2b] to-[#0c2a42] text-white border border-cyan-400/30">
                <div className="text-[10px] text-stone-300 font-bold">مؤشر المناعة السيادية</div>
                <div className="text-xl font-black text-emerald-400 mt-1">{simResult.resilience_score}/100</div>
              </div>

              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#071a2b] to-[#0c2a42] text-white border border-cyan-400/30">
                <div className="text-[10px] text-stone-300 font-bold">زمن التعافي التام</div>
                <div className="text-xl font-black text-cyan-300 mt-1">{simResult.recovery_time_hours} ساعة</div>
              </div>

              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#071a2b] to-[#0c2a42] text-white border border-cyan-400/30">
                <div className="text-[10px] text-stone-300 font-bold">خسائر تم تفاديها</div>
                <div className="text-xl font-black text-amber-300 mt-1">${simResult.estimated_economic_loss_saved_million_usd}M</div>
              </div>

              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#071a2b] to-[#0c2a42] text-white border border-cyan-400/30">
                <div className="text-[10px] text-stone-300 font-bold">جاهزية التشفير الكمي</div>
                <div className="text-xl font-black text-indigo-300 mt-1">{simResult.post_quantum_readiness_pct}%</div>
              </div>
            </div>

            {/* Playbook Steps */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-500" />
                <span>دليل إجراءات الصمود السيبراني الفوري (Incident Playbook):</span>
              </h4>
              <div className="space-y-2">
                {simResult.contingency_playbook_steps_ar.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-[10px] font-black shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mutual Arab Defense Support */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>إسناد الدفاع السيبراني والفضائي العربي المشترك:</span>
              </h4>
              <div className="space-y-2">
                {simResult.pan_arab_mutual_defense_support_ar.map((sup, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{sup}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
