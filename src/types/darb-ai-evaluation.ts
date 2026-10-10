export type EvalCase = {
  id: number;
  suite_id?: number;
  question: string;
  expectedRoute?: string;
  expected_route?: string;
  expectedSource?: string;
  expected_source?: string;
  expectedMinConfidence?: string;
  expected_min_confidence?: string;
  tags_json?: string[];
  created_at?: string;
};

export type EvalResult = {
  id?: number;
  run_id?: number;
  caseId?: number;
  case_id?: number;
  question?: string;
  passed: boolean;
  checks?: Record<string, boolean>;
  checks_json?: Record<string, boolean>;
  expected_route?: string;
  routeActual?: string;
  route_actual?: string;
  expected_source?: string;
  sourceActual?: string;
  source_actual?: string;
  expected_min_confidence?: string;
  confidenceActual?: string;
  confidence_actual?: string;
  latencyMs?: number;
  latency_ms?: number;
  estimatedTokens?: number;
  estimated_tokens?: number;
  answerExcerpt?: string;
  answer_excerpt?: string;
};

export type EvalRun = {
  id: number;
  suite_id?: number;
  suite_name?: string;
  run_label?: string;
  status: string;
  total?: number;
  total_cases?: number;
  passed?: number;
  passed_cases?: number;
  failed?: number;
  failed_cases?: number;
  passRate?: number;
  pass_rate?: number;
  avgLatencyMs?: number;
  avg_latency_ms?: number;
  estimatedTokens?: number;
  estimated_tokens?: number;
  created_at?: string;
  results?: EvalResult[];
};

export type EvalSuite = {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  cases_count?: number;
  created_at: string;
};

export type RegressionComparison = {
  baseline: {
    id: number;
    label: string;
    passRate: number;
    avgLatencyMs: number;
    tokens: number;
  };
  current: {
    id: number;
    label: string;
    passRate: number;
    avgLatencyMs: number;
    tokens: number;
  };
  deltaPassRate: number;
  deltaLatencyMs: number;
  deltaTokens: number;
  regressedCount: number;
  improvedCount: number;
  regressedCases: Array<{ caseId: number; reason: string }>;
  improvedCases: Array<{ caseId: number; reason: string }>;
  verdict: string;
};
