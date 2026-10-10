export type IncidentSeverity = "info" | "warning" | "critical";

export type IncidentStatus = "detected" | "investigating" | "mitigating" | "resolved" | "closed";

export interface Incident {
  id: number | string;
  incident_key?: string;
  incidentKey?: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  environment: string;
  owner?: string | null;
  alert_id?: number | null;
  correlation_id?: string;
  correlationId?: string;
  slo_policy_id?: number | null;
  active_version_id?: number | null;
  detected_at?: string;
  acknowledged_at?: string | null;
  mitigated_at?: string | null;
  resolved_at?: string | null;
  closed_at?: string | null;
  root_cause?: string | null;
  rootCause?: string;
  remediation_actions?: string | null;
  remediationActions?: string;
  mttaMs?: number | null;
  mttrMs?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface RecoveryPlanStep {
  order: number;
  description: string;
  executionMode: "human_approved";
}

export interface RecoveryPlan {
  id: number | string;
  incident_id?: number;
  incidentId?: string | number;
  title: string;
  steps?: RecoveryPlanStep[];
  steps_json?: RecoveryPlanStep[];
  risk_level?: "low" | "medium" | "high";
  riskLevel?: "low" | "medium" | "high";
  status: "draft" | "pending_approval" | "approved" | "executed" | "cancelled";
  approval_required?: boolean;
  approvalRequired?: boolean;
  approved_by?: string | null;
  approvedBy?: string;
  approved_at?: string | null;
  executed_by?: string | null;
  executedBy?: string;
  executed_at?: string | null;
  execution_notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface IncidentEvent {
  id: number;
  incident_id: number;
  event_type: string;
  actor: string;
  note: string;
  correlation_id: string;
  created_at: string;
}

export interface PostIncidentReview {
  id: number;
  incident_id: number;
  summary: string;
  root_cause: string;
  contributing_factors: string;
  remediation_actions: string;
  prevention_actions: string;
  owner: string;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

export interface IncidentAudit {
  id: number;
  incident_id: number | null;
  recovery_plan_id: number | null;
  action: string;
  actor: string;
  reason: string;
  correlation_id: string;
  created_at: string;
}

export interface IncidentSummaryData {
  totalIncidents: number;
  openCount: number;
  countsByStatus: Record<string, number>;
  avgMttaMinutes: number;
  avgMttrMinutes: number;
  pendingApprovalPlansCount: number;
}
