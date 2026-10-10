import crypto from "crypto";

export const OBS_ENVIRONMENTS = ["development", "staging", "production"] as const;

export function createObservabilityCorrelationId(): string {
  return `obs_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;
}

export function evaluateSlo(
  value: number,
  target: number,
  comparison: "lte" | "gte" = "lte"
): { ok: boolean; breached: boolean } {
  const ok = comparison === "gte" ? value >= target : value <= target;
  return { ok, breached: !ok };
}

export function alertSeverity(
  breached: boolean,
  ratio: number
): "info" | "warning" | "critical" {
  if (!breached) return "info";
  if (ratio >= 2) return "critical";
  return "warning";
}

export function buildDefaultSloPolicies() {
  return [
    { metricKey: "error_rate", target: 0.05, comparison: "lte", windowMinutes: 60 },
    { metricKey: "p95_latency_ms", target: 3000, comparison: "lte", windowMinutes: 60 },
    { metricKey: "provider_failure_rate", target: 0.10, comparison: "lte", windowMinutes: 60 },
    { metricKey: "answer_helpful_rate", target: 0.80, comparison: "gte", windowMinutes: 1440 },
  ];
}

export function buildHealthSummary(metrics: Record<string, number>) {
  const errorRate = Number(metrics.error_rate ?? 0);
  const p95 = Number(metrics.p95_latency_ms ?? 0);
  const providerFailure = Number(metrics.provider_failure_rate ?? 0);

  return {
    status:
      errorRate > 0.10 || providerFailure > 0.20 || p95 > 6000
        ? "critical"
        : errorRate > 0.05 || providerFailure > 0.10 || p95 > 3000
          ? "degraded"
          : "healthy",
    metrics,
  };
}

export function canAutoRemediate(): false {
  return false;
}
