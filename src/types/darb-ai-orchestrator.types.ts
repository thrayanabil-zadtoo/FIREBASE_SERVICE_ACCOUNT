export type OrchestrationRoute = 'knowledge_only' | 'knowledge_then_web';
export type OrchestrationStatus = 'needs_consent' | 'insufficient_evidence' | 'completed';

export interface OrchestrationRun {
  id: number;
  conversation_id?: string | number | null;
  user_id?: string | number | null;
  question: string;
  route: OrchestrationRoute | string;
  consent_web_search: boolean;
  knowledge_count: number;
  web_count: number;
  confidence_level?: string | null;
  final_answer?: string | null;
  status: OrchestrationStatus;
  created_at: string;
  metadata_json?: Record<string, any>;
}

export interface OrchestrationStep {
  id: number;
  run_id: number;
  step_name: string;
  status: string;
  duration_ms?: number | null;
  input_count?: number | null;
  output_count?: number | null;
  metadata_json?: Record<string, any>;
  created_at: string;
}

export interface OrchestrationDecision {
  id: number;
  run_id: number;
  decision_type: string;
  decision_value: string;
  reason?: string | null;
  created_at: string;
}

export interface OrchestrationEvidenceItem {
  id?: string;
  title?: string;
  url?: string;
  snippet?: string;
  source?: string;
  trust?: string;
  freshness?: string;
  badge?: string;
  position?: number;
}
