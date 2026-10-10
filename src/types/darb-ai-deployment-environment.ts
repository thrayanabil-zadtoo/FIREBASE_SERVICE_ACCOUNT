export type DeploymentStatus =
  | "pending"
  | "preflight_passed"
  | "awaiting_approval"
  | "approved"
  | "deployed"
  | "rejected"
  | "rolled_back"
  | "failed";

export interface DeploymentEnvironment {
  id?: number;
  environment_key: "development" | "staging" | "production";
  display_name: string;
  protected: boolean;
  active_version_id?: number | null;
  config_snapshot_json?: Record<string, unknown>;
  updated_at?: string;
  created_at?: string;
}

export interface DeploymentJob {
  id?: number;
  environment_id?: number;
  version_id?: number;
  source_environment_id?: number | null;
  status: DeploymentStatus;
  correlation_id?: string;
  preflight_json?: {
    passed?: boolean;
    checks?: EnvironmentCheck[];
    [key: string]: any;
  };
  checklist_json?: {
    releaseGateVerified?: boolean;
    versionVerified?: boolean;
    snapshotVerified?: boolean;
    preflightPassed?: boolean;
    humanApproval?: boolean;
    rollbackPlanConfirmed?: boolean;
    [key: string]: any;
  };
  requested_by?: number | null;
  approved_by?: number | null;
  requested_at?: string;
  approved_at?: string | null;
  deployed_at?: string | null;
  rollback_of_job_id?: number | null;
  reason?: string;
  environment_key?: string;
  environment_name?: string;
}

export interface EnvironmentCheck {
  key: string;
  status: "pass" | "fail";
  expected?: string;
  actual?: string;
  details?: string;
}

export interface DeploymentAudit {
  id?: number;
  job_id?: number | null;
  environment_id?: number | null;
  version_id?: number | null;
  action: string;
  actor_id?: number | null;
  from_status?: string | null;
  to_status?: string | null;
  reason?: string;
  details_json?: Record<string, unknown>;
  created_at?: string;
  environment_key?: string;
}

export interface PreflightResponse {
  ok: boolean;
  targetEnvironment: string;
  sourceEnvironment?: string;
  passed: boolean;
  checks: EnvironmentCheck[];
  humanApprovalRequired: boolean;
  autoDeploy: boolean;
  governanceNotice?: string;
}
