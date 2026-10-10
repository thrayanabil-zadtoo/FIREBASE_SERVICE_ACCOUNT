export type CapacityCostSeverity = 'info' | 'warning' | 'critical';
export type BudgetStatus = 'healthy' | 'warning' | 'critical';

export interface CapacityCostSummary {
  requests: number;
  successfulRequests?: number;
  failedRequests?: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens?: number;
  estimatedCost: number;
  budgetAmount?: number;
  budgetSpent?: number;
  budgetUsedPercent?: number;
  budgetStatus: BudgetStatus;
  capacityUtilization?: number;
  forecastCost?: number;
  openAlertsCount?: number;
  correlationId?: string;
}

export interface BudgetPolicy {
  id: string | number;
  name: string;
  environment: string;
  period: 'daily' | 'monthly';
  budgetAmount?: number;
  budget_amount?: number;
  warningPercent?: number;
  warning_percent?: number;
  criticalPercent?: number;
  critical_percent?: number;
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CapacityPolicy {
  id: string | number;
  name: string;
  environment: string;
  metric: string;
  operator: 'lte' | 'gte';
  threshold: number;
  windowMinutes?: number;
  window_minutes?: number;
  enabled: boolean;
  created_at?: string;
}

export interface CapacityCostAlert {
  id: string | number;
  type: string;
  severity: CapacityCostSeverity;
  status: 'open' | 'acknowledged' | 'resolved';
  environment: string;
  message: string;
  observed_value?: number;
  threshold?: number;
  correlation_id?: string;
  acknowledged_by?: string | null;
  acknowledged_at?: string | null;
  created_at: string;
}

export interface CapacityCostForecast {
  id: string | number;
  environment: string;
  period: string;
  observed_cost: number;
  forecast_cost: number;
  forecast_method: string;
  confidence: 'limited' | 'moderate' | 'high' | 'insufficient';
  created_at: string;
}

export interface CapacityCostAuditItem {
  id: string | number;
  action: string;
  actor: string;
  policy_id?: number | null;
  alert_id?: number | null;
  correlation_id?: string;
  reason: string;
  created_at: string;
}

export interface CapacityCostMetricItem {
  id: string | number;
  environment: string;
  provider: string;
  model: string;
  window_start: string;
  window_end: string;
  requests: number;
  successful_requests: number;
  failed_requests: number;
  input_tokens: number;
  output_tokens: number;
  estimated_cost: number;
  created_at: string;
}

export interface CapacityCostGovernance {
  autoRemediation: false;
  autoRollback: false;
  autoDeploy: false;
  autoScaling: false;
  humanApprovalRequired: true;
}
