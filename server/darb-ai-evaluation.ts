export type EvalCase = {
  id: number;
  question: string;
  expectedRoute?: string;
  expectedSource?: string;
  expectedMinConfidence?: string;
};

export type EvalObservation = {
  route?: string;
  source?: string;
  confidence?: string;
  latencyMs?: number;
  estimatedTokens?: number;
  answer?: string;
  sourcesCount?: number;
  conflictsCount?: number;
};

const confidenceRank: Record<string, number> = {
  insufficient: 0,
  limited: 1,
  supported: 2,
  conflicted: 1
};

export function evaluateCase(
  c: EvalCase,
  o: EvalObservation
) {
  const checks: Record<string, boolean> = {};
  if (c.expectedRoute) checks.route = o.route === c.expectedRoute;
  if (c.expectedSource) checks.source = o.source === c.expectedSource;
  if (c.expectedMinConfidence) {
    checks.confidence =
      (confidenceRank[o.confidence ?? "insufficient"] ?? -1) >=
      (confidenceRank[c.expectedMinConfidence] ?? 99);
  }

  const values = Object.values(checks);
  return {
    passed: values.length === 0 ? true : values.every(Boolean),
    checks
  };
}

export function summarize(results: Array<{ passed: boolean; latencyMs?: number }>) {
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;
  const latency = results
    .map(r => Number(r.latencyMs))
    .filter(Number.isFinite);

  return {
    total,
    passed,
    failed,
    passRate: total ? passed / total : 0,
    avgLatencyMs: latency.length
      ? latency.reduce((a, b) => a + b, 0) / latency.length
      : 0
  };
}
