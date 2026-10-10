/**
 * DARB AI V1.24 — AI Regression & Release Gate Types
 */

export type GateStatus = "pass" | "review" | "blocked";

export interface RegressionThresholds {
  minPassRateDrop: number;
  maxLatencyIncreaseRatio: number;
  maxTokenIncreaseRatio: number;
}

export interface RegressionComparisonV24 {
  deltaPassRate: number;
  deltaLatencyMs: number;
  deltaTokens: number;
  latencyRatio: number;
  tokenRatio: number;
  passRateRegression: boolean;
  latencyRegression: boolean;
  tokenRegression: boolean;
  regressionDetected: boolean;
  gateStatus: GateStatus;
}

export type RegressionComparison = RegressionComparisonV24;

export interface ReleaseGate {
  id?: number;
  regression_run_id?: number | null;
  release_label: string;
  status: GateStatus;
  threshold_json?: any;
  decision_reason?: string;
  reviewer_id?: number | null;
  decided_at?: string | null;
  created_at?: string;
}

export interface RegressionRun {
  id?: number;
  baseline_job_id?: number | null;
  current_job_id?: number | null;
  baseline_pass_rate: number;
  current_pass_rate: number;
  baseline_latency_ms: number;
  current_latency_ms: number;
  baseline_tokens: number;
  current_tokens: number;
  delta_pass_rate: number;
  delta_latency_ms: number;
  delta_tokens: number;
  regression_detected: boolean;
  gate_status: GateStatus;
  details_json?: any;
  created_at?: string;
}
