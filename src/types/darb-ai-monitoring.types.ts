export type MonitorSeverity = 'info' | 'warning' | 'critical';

export interface MonitoringEvent {
  id: number;
  event_type: string;
  severity: MonitorSeverity;
  question?: string | null;
  answer_run_id?: number | null;
  source_url?: string | null;
  metadata_json: Record<string, any>;
  created_at: string;
}

export interface RepeatedQuestion {
  id?: number;
  signature?: string;
  normalized_question: string;
  hit_count: number;
  last_seen_at: string;
  first_seen_at?: string;
}

export interface SourceHealth {
  id?: number;
  source_url: string;
  domain?: string | null;
  last_checked_at?: string | null;
  http_status?: number | null;
  is_reachable?: boolean | null;
  observed_at?: string | null;
  metadata_json?: Record<string, any>;
  freshness?: 'fresh' | 'aging' | 'stale' | 'unknown';
}

export interface MonitoringSummaryData {
  ok: boolean;
  events: Array<{ event_type: string; severity: MonitorSeverity; count: number }>;
  repeatedQuestions: RepeatedQuestion[];
  sources: SourceHealth[];
  metrics?: {
    totalEvents: number;
    warningEvents: number;
    repeatedCount: number;
    unreachableSources: number;
    staleSources: number;
  };
}
