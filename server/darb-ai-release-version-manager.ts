import crypto from "crypto";

export type ReleaseStatus =
  | "draft"
  | "candidate"
  | "approved"
  | "active"
  | "retired"
  | "rollback";

export function snapshotChecksum(snapshot: unknown): string {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(snapshot ?? {}))
    .digest("hex");
}

export function canTransition(from: ReleaseStatus, to: ReleaseStatus): boolean {
  const allowed: Record<ReleaseStatus, ReleaseStatus[]> = {
    draft: ["candidate"],
    candidate: ["approved", "draft"],
    approved: ["active", "candidate"],
    active: ["retired", "rollback"],
    retired: ["candidate", "rollback"],
    rollback: ["candidate", "active"],
  };
  return allowed[from]?.includes(to) ?? false;
}

export function releaseGateAllowsCandidate(gateStatus: string): boolean {
  return gateStatus === "pass" || gateStatus === "review";
}

export function releaseGateAllowsActivation(gateStatus: string): boolean {
  return gateStatus === "pass";
}

export function buildVersionMetadata(input: any) {
  return {
    releaseLabel: String(input.releaseLabel ?? "DARB AI"),
    description: String(input.description ?? ""),
    gateStatus: String(input.gateStatus ?? "review"),
    autoPublish: false,
    knowledgeWrite: false,
    createdAt: new Date().toISOString(),
  };
}

export function buildAuditDetails(
  action: string,
  reason?: string,
  extra: Record<string, unknown> = {}
) {
  return {
    action,
    reason: reason ?? "",
    autoPublish: false,
    ...extra,
  };
}
