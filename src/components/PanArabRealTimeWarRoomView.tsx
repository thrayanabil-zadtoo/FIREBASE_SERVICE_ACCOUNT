import React, { useState, useEffect } from 'react';
import {
  Radio,
  Anchor,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ShieldAlert,
  Globe2,
  Clock,
  Compass,
  Ship,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  Sliders,
  Printer,
  Zap,
  Activity
} from 'lucide-react';
import {
  PanArabMaritimeChokepoint,
  PanArabLiveCommodityQuote,
  PanArabSupplyChainAlert
} from '../types/country-profile';
import { fetchApi } from '../api';

interface PanArabRealTimeWarRoomViewProps {
  onSelectCountry?: (countryCode: string) => void;
  onConsultAI?: (prompt: string) => void;
}

export const PanArabRealTimeWarRoomView: React.FC<PanArabRealTimeWarRoomViewProps> = ({
  onSelectCountry,
  onConsultAI
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chokepoints' | 'commodities' | 'alerts'>('chokepoints');
  const [chokepoints, setChokepoints] = useState<PanArabMaritimeChokepoint[]>([]);
  const [commodities, setCommodities] = useState<PanArabLiveCommodityQuote[]>([]);
  const [alerts, setAlerts] = useState<PanArabSupplyChainAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('الآن');
  const [commodityFilter, setCommodityFilter] = useState<string>('all');

  const loadWarRoomData = async () => {
    setLoading(true);
    try {
      const [resChoke, resComm, resAlerts] = await Promise.all([
        fetchApi<{ ok: boolean; data: PanArabMaritimeChokepoint[] }>('/api/countries/analytics/war-room/chokepoints'),
        fetchApi<{ ok: boolean; data: PanArabLiveCommodityQuote[] }>('/api/countries/analytics/war-room/commodities'),
        fetchApi<{ ok: boolean; data: PanArabSupplyChainAlert[] }>('/api/countries/analytics/war-room/alerts')
      ]);

      if (resChoke?.data) setChokepoints(resChoke.data);
      if (resComm?.data) setCommodities(resComm.data);
      if (resAlerts?.data) setAlerts(resAlerts.data);

      const d = new Date();
      setLastRefreshedTime(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`);
    } catch (err) {
      console.error('Failed to load war room data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarRoomData();
    const interval = setInterval(loadWarRoomData, 45000);
    return () => clearInterval(interval);
  }, []);

  const filteredCommodities = commodityFilter === 'all'
    ? commodities
    : commodities.filter(c => c.category === commodityFilter);

  return (
    <div id="pan-arab-real-time-war-room-view" className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#061523] via-[#0b243b] to-[#04121e] border border-cyan-500/30 p-6 md:p-8 text-white shadow-2xl">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>المرحلة الحادية عشرة: غرفة العمليات الحية وأرصاد التجارة والملاحة العربية</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
              <span>رادار الممرات البحرية وسلاسل الإمداد اللحظية</span>
              <Activity className="w-6 h-6 text-cyan-400" />
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              مركز الرصد واليقظة الاستراتيجية: تتبع تدفقات المضائق والممرات الحاكمة (هرمز، باب المندب، قناة السويس، جبل طارق)، نبض أسعار السلع الاستراتيجية اللحظية، وتنبيهات سلاسل الإمداد والموانئ البرية والبحرية.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={loadWarRoomData}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-2 border border-white/10 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>تحديث البث ({lastRefreshedTime})</span>
            </button>

            <button
              onClick={() => onConsultAI?.('قدم لي تقريراً تحليلياً استراتيجياً شاملاً عن أمن الممرات الملاحية العربية وتأثير تقلبات أسعار السلع على الموازنات الوطنية')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-[#1bb49e] text-[#071a2b] font-black text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>تقرير اليقظة الاستراتيجية بالذكاء الاصطناعي</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="mt-8 flex items-center gap-2 border-b border-white/10 pb-1 overflow-x-auto scrollbar-none">
          <button
            id="warroom-tab-chokepoints"
            onClick={() => setActiveSubTab('chokepoints')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'chokepoints'
                ? 'bg-cyan-500 text-[#071a2b] shadow-md font-black'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <Ship className="w-4 h-4" />
            <span>رادار المضائق والممرات الملاحية الأربعة ({chokepoints.length})</span>
          </button>

          <button
            id="warroom-tab-commodities"
            onClick={() => setActiveSubTab('commodities')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'commodities'
                ? 'bg-cyan-500 text-[#071a2b] shadow-md font-black'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>بورصة السلع الاستراتيجية الحية ({commodities.length})</span>
          </button>

          <button
            id="warroom-tab-alerts"
            onClick={() => setActiveSubTab('alerts')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'alerts'
                ? 'bg-cyan-500 text-[#071a2b] shadow-md font-black'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>تنبيهات سلاسل الإمداد اللحظية ({alerts.length})</span>
          </button>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* 1. MARITIME CHOKEPOINTS RADAR                                          */}
      {/* ====================================================================== */}
      {activeSubTab === 'chokepoints' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chokepoints.map((c) => (
              <div
                key={c.chokepoint_id}
                id={`chokepoint-card-${c.chokepoint_id}`}
                className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        {c.controlling_arab_states.map(st => (
                          <span
                            key={st.country_code}
                            onClick={() => onSelectCountry?.(st.country_code)}
                            className="cursor-pointer hover:scale-110 transition-transform text-lg"
                            title={st.name_ar}
                          >
                            {st.flag}
                          </span>
                        ))}
                        <span className="text-[10px] text-stone-400 font-bold mr-1">
                          {c.controlling_arab_states.map(s => s.name_ar).join(' • ')}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-stone-900 dark:text-white">
                        {c.name_ar}
                      </h4>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap flex items-center gap-1.5 ${
                        c.status_color === 'emerald'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : c.status_color === 'amber'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        c.status_color === 'emerald' ? 'bg-emerald-500' : c.status_color === 'amber' ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      <span>{c.status}</span>
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {c.strategic_role_ar}
                  </p>

                  {/* Operational Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center p-3 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-100 dark:border-stone-800">
                    <div>
                      <span className="text-[10px] text-stone-400 block">العبور اليومي:</span>
                      <span className="text-xs font-black text-stone-900 dark:text-white">{c.daily_transit_vessels} سفينة</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">تدفق النفط:</span>
                      <span className="text-xs font-black text-amber-500">{c.daily_crude_barrels_million}M برميل</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">حصة التجارة العالمية:</span>
                      <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">{c.global_trade_share_pct}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">متوسط زمن التأخير:</span>
                      <span className="text-xs font-black text-stone-700 dark:text-stone-300">{c.current_transit_delay_hours} ساعة</span>
                    </div>
                  </div>

                  {/* Primary Alternative Route */}
                  <div className="p-2.5 rounded-lg bg-stone-100 dark:bg-stone-800/80 text-[11px] space-y-1">
                    <span className="text-stone-500 font-extrabold block">المسار البديل الموصى به للطوارئ:</span>
                    <span className="text-stone-800 dark:text-stone-200 font-medium">{c.primary_alternative_route_ar}</span>
                  </div>

                  {c.live_incident_alert_ar && (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{c.live_incident_alert_ar}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 font-mono">ID: {c.chokepoint_id}</span>
                  <button
                    onClick={() => onConsultAI?.(`قدم لي تحليلاً عسكرياً ولوجستياً كاملاً لحركة الملاحة عبر: ${c.name_ar} والمسارات البديلة`)}
                    className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>استشارة غرفة العمليات</span>
                    <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 2. STRATEGIC COMMODITIES LIVE RADAR                                    */}
      {/* ====================================================================== */}
      {activeSubTab === 'commodities' && (
        <div className="space-y-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
            <span className="text-stone-400 text-[11px] ml-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>التصنيف:</span>
            </span>
            {['all', 'طاقة ومحروقات', 'أمن غذائي ومحاصيل', 'معادن ومواد بناء', 'أسمدة وكيماويات'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCommodityFilter(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  commodityFilter === cat
                    ? 'bg-cyan-500 text-[#071a2b] font-black shadow-sm'
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                }`}
              >
                {cat === 'all' ? 'كافة السلع الاستراتيجية' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommodities.map((comm) => (
              <div
                key={comm.commodity_key}
                id={`commodity-card-${comm.commodity_key}`}
                className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 font-bold block">{comm.category}</span>
                      <h4 className="text-sm font-extrabold text-stone-900 dark:text-white">
                        {comm.commodity_name_ar}
                      </h4>
                    </div>

                    <div className="text-left font-mono">
                      <div className="text-base font-black text-stone-900 dark:text-white">
                        ${comm.spot_price_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div
                        className={`text-[11px] font-bold flex items-center justify-end gap-0.5 ${
                          comm.is_positive_change ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {comm.is_positive_change ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{comm.change_24h_pct > 0 ? `+${comm.change_24h_pct}%` : `${comm.change_24h_pct}%`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-stone-500 space-y-1 py-1.5 border-y border-stone-100 dark:border-stone-800">
                    <div className="flex justify-between">
                      <span className="text-stone-400">الوحدة القياسية:</span>
                      <span className="font-bold text-stone-700 dark:text-stone-300">{comm.unit_ar}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">سوق التسعير المرجعي:</span>
                      <span className="font-bold text-stone-700 dark:text-stone-300">{comm.benchmark_market_ar}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">المصدّر العربي الرائد:</span>
                      <span className="font-bold text-cyan-600 dark:text-cyan-400">{comm.leading_arab_exporter_ar}</span>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-stone-50 dark:bg-stone-950/60 text-[10px] text-stone-600 dark:text-stone-400 leading-relaxed">
                    <strong className="text-stone-700 dark:text-stone-300 block mb-0.5">حالة المخزون والاحتياطي:</strong>
                    {comm.strategic_reserve_status_ar}
                  </div>
                </div>

                <button
                  onClick={() => onConsultAI?.(`قدم تحليلاً دقيقاً لاتجاه أسعار ${comm.commodity_name_ar} وتأثيرها على خطط التصدير والاستيراد العربية`)}
                  className="w-full py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-cyan-500 hover:text-[#071a2b] text-stone-700 dark:text-stone-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>تنبؤ سعري وسيناريوهات التحوط</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 3. SUPPLY CHAIN & MARITIME LIVE ALERTS                                 */}
      {/* ====================================================================== */}
      {activeSubTab === 'alerts' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {alerts.map((a) => (
              <div
                key={a.alert_id}
                id={`alert-row-${a.alert_id}`}
                className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        a.severity.includes('Critical')
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200'
                          : a.severity.includes('High')
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200'
                      }`}
                    >
                      {a.severity}
                    </span>
                    <span className="text-xs font-bold text-stone-400">
                      {a.corridor_name_ar}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-stone-400 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{a.timestamp_ar}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-stone-900 dark:text-white mb-1">
                    {a.alert_title_ar}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {a.description_ar}
                  </p>
                </div>

                {/* Impacted ports */}
                <div className="flex flex-wrap items-center gap-1 text-[11px]">
                  <span className="text-stone-400 font-bold ml-1">المنافذ والموانئ المتأثرة:</span>
                  {a.impacted_ports_or_borders.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                {/* Recommended action */}
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-stone-800 dark:text-stone-200 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-cyan-700 dark:text-cyan-300 mb-0.5">الإجراء اللوجستي والبديل الفوري:</strong>
                    <span>{a.recommended_alternative_action_ar}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
