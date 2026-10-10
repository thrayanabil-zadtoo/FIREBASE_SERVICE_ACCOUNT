export const CAPACITY_COST_GOVERNANCE = {
  autoRemediation: false,
  autoRollback: false,
  autoDeploy: false,
  autoScaling: false,
  humanApprovalRequired: true
};

export const ALERT_SEVERITIES = ['info', 'warning', 'critical'] as const;

export function createCapacityCostCorrelationId(prefix = 'COST') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

export function budgetStatus(
  spent: number,
  budget: number,
  warningPercent = 80,
  criticalPercent = 100
) {
  if (budget <= 0) return { status: 'critical', percent: 100 };
  const percent = (spent / budget) * 100;
  const status =
    percent >= criticalPercent ? 'critical' :
    percent >= warningPercent ? 'warning' : 'healthy';
  return { status, percent };
}

export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  inputPricePer1k: number,
  outputPricePer1k: number
) {
  return (inputTokens / 1000) * inputPricePer1k +
         (outputTokens / 1000) * outputPricePer1k;
}

export function forecastRollingAverage(values: number[], periods = 3) {
  if (!values.length) return { forecast: 0, confidence: 'insufficient' };
  const slice = values.slice(-Math.max(1, periods));
  const forecast = slice.reduce((a, b) => a + b, 0) / slice.length;
  return {
    forecast,
    confidence: values.length >= periods ? 'moderate' : 'limited'
  };
}

export function capacityStatus(
  observed: number,
  threshold: number,
  operator: 'lte' | 'gte'
) {
  const ok = operator === 'lte' ? observed <= threshold : observed >= threshold;
  return { ok, observed, threshold, operator };
}

export function canChangeCapacity(
  actor?: string,
  approvalRequired = true,
  approvedBy?: string
) {
  if (!actor) return false;
  if (approvalRequired && !approvedBy) return false;
  return true;
}
