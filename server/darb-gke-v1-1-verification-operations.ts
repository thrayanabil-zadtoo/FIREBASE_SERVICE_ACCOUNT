export type VerificationStatus = "pending" | "approved" | "rejected";
export type Confidence = "high" | "medium" | "limited";

export interface VerificationFilters {
  countryCode?: string; axisId?: number; status?: VerificationStatus;
  q?: string; page?: number; pageSize?: number;
}
export interface HumanReviewInput {
  id: number; reviewedValue: string; sourceUrl: string;
  confidence: Confidence; reviewerId: string; reviewReason: string;
  decision: "approved" | "rejected";
}
export function normalizeVerificationFilters(input: VerificationFilters = {}) {
  const page = Math.max(1, Number(input.page || 1));
  const pageSize = Math.min(100, Math.max(10, Number(input.pageSize || 25)));
  return {countryCode: input.countryCode?.trim() || undefined,
    axisId: input.axisId ? Number(input.axisId) : undefined,
    status: input.status, q: input.q?.trim() || undefined, page, pageSize};
}
export function validateHumanReview(input: HumanReviewInput) {
  if (!input.reviewerId?.trim()) throw new Error("reviewerId is required");
  if (!input.reviewReason?.trim()) throw new Error("reviewReason is required");
  if (!input.sourceUrl?.trim()) throw new Error("sourceUrl is required");
  if (!input.reviewedValue?.trim()) throw new Error("reviewedValue is required");
  if (!["high","medium","limited"].includes(input.confidence)) throw new Error("invalid confidence");
  if (!["approved","rejected"].includes(input.decision)) throw new Error("invalid decision");
  return true;
}
export const GKE_V1_1_GOVERNANCE = {
  autoPublish: true, humanReviewRequired: false, referenceDataIsLive: true
} as const;
