export type GateStatus = "pass" | "review" | "blocked";

export interface RegressionThresholds {
  minPassRateDrop: number;
  maxLatencyIncreaseRatio: number;
  maxTokenIncreaseRatio: number;
}

export function defaultThresholds(): RegressionThresholds {
  return {
    minPassRateDrop: 0.02,
    maxLatencyIncreaseRatio: 0.25,
    maxTokenIncreaseRatio: 0.25
  };
}

export function compareRuns(
  baseline: { passRate: number; avgLatencyMs: number; avgTokens: number },
  current: { passRate: number; avgLatencyMs: number; avgTokens: number },
  thresholds: RegressionThresholds = defaultThresholds()
) {
  const deltaPassRate = current.passRate - baseline.passRate;
  const deltaLatencyMs = current.avgLatencyMs - baseline.avgLatencyMs;
  const deltaTokens = current.avgTokens - baseline.avgTokens;

  const latencyRatio = baseline.avgLatencyMs > 0
    ? deltaLatencyMs / baseline.avgLatencyMs
    : 0;

  const tokenRatio = baseline.avgTokens > 0
    ? deltaTokens / baseline.avgTokens
    : 0;

  const passRateRegression = deltaPassRate <= -Math.abs(thresholds.minPassRateDrop);
  const latencyRegression = latencyRatio >= thresholds.maxLatencyIncreaseRatio;
  const tokenRegression = tokenRatio >= thresholds.maxTokenIncreaseRatio;

  const regressionDetected =
    passRateRegression || latencyRegression || tokenRegression;

  let gateStatus: GateStatus = "pass";
  if (regressionDetected) gateStatus = "blocked";
  else if (deltaPassRate < 0 || latencyRatio > 0 || tokenRatio > 0) gateStatus = "review";

  return {
    deltaPassRate,
    deltaLatencyMs,
    deltaTokens,
    latencyRatio,
    tokenRatio,
    passRateRegression,
    latencyRegression,
    tokenRegression,
    regressionDetected,
    gateStatus
  };
}

export function evaluateReleaseGate(
  comparison: ReturnType<typeof compareRuns>,
  reviewerDecision?: "approve" | "reject" | "review"
): GateStatus {
  if (reviewerDecision === "approve") return "pass";
  if (reviewerDecision === "reject") return "blocked";
  return comparison.gateStatus;
}

export function buildDecisionReason(result: ReturnType<typeof compareRuns>): string {
  const reasons: string[] = [];
  if (result.passRateRegression) reasons.push("انخفاض معدل النجاح تجاوز الحد المسموح");
  if (result.latencyRegression) reasons.push("ارتفاع زمن الاستجابة تجاوز الحد المسموح");
  if (result.tokenRegression) reasons.push("ارتفاع استهلاك الرموز تجاوز الحد المسموح");
  if (!reasons.length && result.gateStatus === "review") {
    reasons.push("يوجد تغير يستحق المراجعة البشرية");
  }
  if (!reasons.length) reasons.push("لم يتم اكتشاف تراجع يتجاوز الحدود");
  return reasons.join("؛ ");
}
