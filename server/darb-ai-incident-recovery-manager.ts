export const INCIDENT_STATUSES = ['detected', 'investigating', 'mitigating', 'resolved', 'closed'] as const;
export type IncidentStatus = typeof INCIDENT_STATUSES[number];

export const INCIDENT_SEVERITIES = ['info', 'warning', 'critical'] as const;
export type IncidentSeverity = typeof INCIDENT_SEVERITIES[number];

export const GOVERNANCE = {
  autoRemediation: false,
  autoRollback: false,
  autoDeploy: false,
  humanApprovalRequired: true,
};

export function createIncidentCorrelationId(prefix = 'INC'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

export function calculateMtta(detectedAt: Date, acknowledgedAt?: Date | null): number | null {
  return acknowledgedAt ? Math.max(0, acknowledgedAt.getTime() - detectedAt.getTime()) : null;
}

export function calculateMttr(detectedAt: Date, resolvedAt?: Date | null): number | null {
  return resolvedAt ? Math.max(0, resolvedAt.getTime() - detectedAt.getTime()) : null;
}

export function canExecuteRecovery(plan: { status: string; approvalRequired?: boolean; approvedBy?: string | null }): boolean {
  if (GOVERNANCE.autoRemediation || GOVERNANCE.autoRollback || GOVERNANCE.autoDeploy) return false;
  return plan.status === 'approved' && (plan.approvalRequired === false || !!plan.approvedBy);
}

export function validateClosure(input: { rootCause?: string; remediationActions?: string }): {
  ok: boolean;
  rootCauseRequired: boolean;
  remediationActionsRequired: boolean;
} {
  const a = !!input.rootCause?.trim();
  const b = !!input.remediationActions?.trim();
  return { ok: a && b, rootCauseRequired: !a, remediationActionsRequired: !b };
}

export function buildRecoveryPlan(title: string, steps: string[]) {
  return {
    title,
    steps: steps.map((description, i) => ({
      order: i + 1,
      description,
      executionMode: 'human_approved' as const,
    })),
    approvalRequired: true as const,
    status: 'draft' as const,
  };
}
