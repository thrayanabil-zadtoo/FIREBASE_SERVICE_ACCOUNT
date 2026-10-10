import crypto from "crypto";

export type DeploymentStatus =
  | "pending"
  | "preflight_passed"
  | "awaiting_approval"
  | "approved"
  | "deployed"
  | "rejected"
  | "rolled_back"
  | "failed";

export const ENVIRONMENTS = ["development", "staging", "production"] as const;

export function createDeploymentCorrelationId(): string {
  return `dep_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;
}

export function isProtectedEnvironment(environment: string): boolean {
  return environment === "staging" || environment === "production";
}

export function requiresHumanApproval(environment: string): boolean {
  return environment === "production" || environment === "staging";
}

export function canDeploy(
  environment: string,
  releaseGateStatus: string,
  versionStatus: string
): { ok: boolean; reason?: string } {
  if (!ENVIRONMENTS.includes(environment as any)) {
    return { ok: false, reason: "unknown_environment" };
  }

  if (environment !== "development" && releaseGateStatus !== "pass") {
    return { ok: false, reason: "release_gate_must_be_pass" };
  }

  if (!["candidate", "approved", "active"].includes(versionStatus)) {
    return { ok: false, reason: "version_not_deployable" };
  }

  return { ok: true };
}

export function buildPreflightChecks(input: {
  releaseGateStatus: string;
  versionStatus: string;
  sourceEnvironment?: string;
  targetEnvironment: string;
  configMatch?: boolean;
}) {
  const checks = [
    {
      key: "release_gate",
      status: input.targetEnvironment === "development" || input.releaseGateStatus === "pass"
        ? "pass" : "fail",
      expected: "pass",
      actual: input.releaseGateStatus,
    },
    {
      key: "version_status",
      status: ["candidate", "approved", "active"].includes(input.versionStatus)
        ? "pass" : "fail",
      expected: "candidate|approved|active",
      actual: input.versionStatus,
    },
    {
      key: "environment_path",
      status: input.sourceEnvironment !== input.targetEnvironment ? "pass" : "fail",
      expected: "source != target",
      actual: `${input.sourceEnvironment ?? "none"} -> ${input.targetEnvironment}`,
    },
    {
      key: "config_consistency",
      status: input.configMatch === false ? "fail" : "pass",
      expected: "consistent",
      actual: input.configMatch === false ? "different" : "consistent",
    },
  ];

  return {
    passed: checks.every((c) => c.status === "pass"),
    checks,
  };
}

export function deploymentChecklist(environment: string) {
  return {
    releaseGateVerified: false,
    versionVerified: false,
    snapshotVerified: false,
    preflightPassed: false,
    humanApproval: requiresHumanApproval(environment) ? false : true,
    rollbackPlanConfirmed: false,
  };
}

export function snapshotHash(snapshot: unknown): string {
  return crypto.createHash("sha256")
    .update(JSON.stringify(snapshot ?? {}))
    .digest("hex");
}
