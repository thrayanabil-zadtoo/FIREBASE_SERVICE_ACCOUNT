export interface ProductionAuditCheckItem {
  id: string;
  number: string;
  domain: string;
  test: string;
  status: "PASS" | "REVIEW" | "BLOCKED" | "PENDING";
  critical: boolean;
  details?: string;
  verificationMethod?: string;
}

export interface ProductionAuditGovernanceFlags {
  autoRemediation: boolean;
  autoRollback: boolean;
  autoDeploy: boolean;
  autoScaling: boolean;
  autoOptimizationApply: boolean;
  humanApprovalRequired: boolean;
}

export interface ProductionAuditSummary {
  overallStatus: "PASS" | "REVIEW" | "BLOCKED";
  passCount: number;
  totalChecks: number;
  governance: ProductionAuditGovernanceFlags;
  version: string;
  environment: string;
  correlationId: string;
  lastAuditTimestamp: string;
  items: ProductionAuditCheckItem[];
}

export interface RouteAuditItem {
  route: string;
  category: "AI Core" | "Admin AI";
  methods: string[];
  authRequired: boolean;
  adminOnly: boolean;
  correlationIdTracked: boolean;
  secretsProtected: boolean;
  status: "VERIFIED" | "NEEDS_ATTENTION";
  details?: string;
}

export interface SmokeTestItem {
  id: number;
  title: string;
  scenario: string;
  expected: string[];
  status: "PASS" | "REVIEW" | "BLOCKED" | "PENDING";
  automated: boolean;
  runDetails?: string;
}

export interface ProductionSignoffRecord {
  id: number | string;
  version: string;
  environment: string;
  decision: "APPROVED" | "REVIEW_REQUIRED" | "BLOCKED";
  actor: string;
  reason: string;
  gateResults: Record<string, "PASS" | "FAIL">;
  criticalFindings: string[];
  correlationId: string;
  createdAt: string;
}
