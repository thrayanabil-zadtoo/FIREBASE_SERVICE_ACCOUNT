export type OptimizationDecision = 'approve' | 'reject' | 'defer';

export type OptimizationStatus =
  | 'pending_review'
  | 'approved_for_manual_action'
  | 'rejected'
  | 'deferred';

export interface OptimizationRecommendation {
  id: string | number;
  environment: string;
  category: string;
  title: string;
  description: string;
  estimatedSavings: number;
  estimatedSavingsPercent: number;
  riskLevel: 'low' | 'medium' | 'high';
  status: OptimizationStatus;
  correlationId?: string;
  evidenceMetrics?: {
    currentTpm?: number;
    potentialTpm?: number;
    tokenReduction?: number;
    latencyImpactMs?: number;
    observedModel?: string;
    alternativeModel?: string;
    cacheHitRatioPotential?: number;
    notes?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface OptimizationGovernance {
  autoRemediation: false;
  autoRollback: false;
  autoDeploy: false;
  autoScaling: false;
  autoOptimizationApply: false;
  humanApprovalRequired: true;
}

export interface OptimizationReviewRecord {
  id: string | number;
  recommendationId: string | number;
  decision: OptimizationDecision;
  actor: string;
  reason: string;
  correlationId?: string;
  createdAt: string;
}

export interface OptimizationSnapshot {
  id: string | number;
  environment: string;
  provider: string;
  model: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  efficiencyScore: number;
  createdAt: string;
}

export interface OptimizationAuditRecord {
  id: string | number;
  action: string;
  actor?: string;
  recommendationId?: string | number;
  correlationId?: string;
  reason?: string;
  createdAt: string;
}

export interface OptimizationSummary {
  pendingReviews: number;
  approvedForManualAction: number;
  rejected: number;
  deferred: number;
  totalRecommendations: number;
  estimatedSavings: number;
  estimatedSavingsPercent: number;
  overallEfficiencyScore: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalRequests: number;
  currentMonthSpend: number;
  burnRate: number;
}
