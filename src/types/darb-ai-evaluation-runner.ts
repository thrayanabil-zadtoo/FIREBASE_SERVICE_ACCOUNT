/**
 * DARB AI V1.23 — AI Evaluation Integrated Runner Types
 */

export type RunnerMode = "dry_run" | "integration";
export type JobStatus = "queued" | "running" | "completed" | "failed";

export interface EvaluationJob {
  id?: number;
  suite_id?: number | null;
  correlation_id: string;
  mode: RunnerMode;
  status: JobStatus;
  total_cases: number;
  completed_cases: number;
  failed_cases: number;
  started_at?: string;
  finished_at?: string;
  created_at?: string;
  metadata_json?: any;
}

export interface CaseExecution {
  id?: number;
  job_id?: number;
  caseId?: number | null;
  case_id?: number | null;
  caseTitle?: string;
  case_title?: string;
  passed: boolean;
  routeOk: boolean;
  sourceOk: boolean;
  confidenceOk: boolean;
  evidenceOk: boolean;
  citationsOk: boolean;
  latencyMs: number;
  latency_ms?: number;
  tokens: number;
  route?: string | null;
  route_actual?: string | null;
  route_expected?: string | null;
  source?: string | null;
  source_actual?: string | null;
  source_expected?: string | null;
  confidence?: string | null;
  confidence_actual?: string | null;
  confidence_expected?: string | null;
  errorCode?: string | null;
  error_code?: string | null;
  errorReason?: string | null;
  error_reason?: string | null;
  observation?: any;
  observation_json?: any;
}

export interface RunnerSummary {
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  avgLatencyMs: number;
  avgTokens: number;
}
