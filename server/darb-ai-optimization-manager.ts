export const OPTIMIZATION_GOVERNANCE = {
  autoRemediation: false,
  autoRollback: false,
  autoDeploy: false,
  autoScaling: false,
  autoOptimizationApply: false,
  humanApprovalRequired: true
};

export function createOptimizationCorrelationId(prefix = 'OPT') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

export function efficiencyScore(
  requests: number,
  inputTokens: number,
  outputTokens: number,
  cost: number
) {
  if (requests <= 0) return 0;
  const tokensPerRequest = (inputTokens + outputTokens) / requests;
  const costPerRequest = cost / requests;
  if (tokensPerRequest <= 0 || costPerRequest < 0) return 0;
  return Number((1 / (1 + tokensPerRequest / 1000 + costPerRequest * 100)).toFixed(4));
}

export function savingsEstimate(currentCost: number, targetPercent: number) {
  const pct = Math.max(0, Math.min(100, targetPercent));
  return {
    percent: pct,
    amount: Number(((currentCost * pct) / 100).toFixed(8))
  };
}

export function burnRate(spent: number, elapsedPercent: number) {
  if (elapsedPercent <= 0) return 0;
  return Number(((spent / elapsedPercent) * 100).toFixed(4));
}

export function reviewDecisionAllowed(
  actor?: string,
  reason?: string
) {
  return Boolean(actor?.trim() && reason?.trim());
}

export function recommendationStatus(decision: 'approve' | 'reject' | 'defer') {
  if (decision === 'approve') return 'approved_for_manual_action';
  if (decision === 'reject') return 'rejected';
  return 'deferred';
}
