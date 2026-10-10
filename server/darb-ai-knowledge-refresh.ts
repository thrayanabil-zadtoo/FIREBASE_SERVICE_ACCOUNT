import crypto from "crypto";

export type FreshnessStatus = "fresh" | "aging" | "stale";
export type Priority = "low" | "normal" | "high" | "critical";

export function freshnessStatus(ageDays: number, agingDays = 30, staleDays = 90): FreshnessStatus {
  if (ageDays >= staleDays) return "stale";
  if (ageDays >= agingDays) return "aging";
  return "fresh";
}

export function priorityForFreshness(status: FreshnessStatus): Priority {
  if (status === "stale") return "high";
  if (status === "aging") return "normal";
  return "low";
}

export function buildRefreshReason(status: FreshnessStatus, ageDays: number): string {
  if (status === "stale") return `المعلومة قديمة منذ ${ageDays} يومًا وتحتاج مراجعة`;
  if (status === "aging") return `المعلومة تقترب من حد التحديث (${ageDays} يومًا)`;
  return "لا توجد حاجة عاجلة للتحديث";
}

export function candidateFingerprint(knowledgeId: number | null, proposedContent: string): string {
  return crypto.createHash("sha256")
    .update(`${knowledgeId ?? "none"}:${proposedContent.trim()}`)
    .digest("hex");
}

export function canPublish(reviewStatus: string): boolean {
  return reviewStatus === "approved";
}

export function normalizeCandidate(input: {
  knowledgeId?: number | null;
  oldContent?: string;
  proposedContent: string;
  sources?: unknown[];
  confidence?: string;
}) {
  return {
    knowledge_id: input.knowledgeId ?? null,
    old_content: input.oldContent ?? "",
    proposed_content: input.proposedContent.trim(),
    sources_json: Array.isArray(input.sources) ? input.sources : [],
    confidence_level: input.confidence ?? "limited",
    review_status: "pending",
    fingerprint: candidateFingerprint(input.knowledgeId ?? null, input.proposedContent),
  };
}
