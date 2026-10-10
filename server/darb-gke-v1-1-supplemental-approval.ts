export const supplementalGovernance = {
  autoPublish: true,
  humanReviewRequired: false,
  referenceDataIsLive: true,
};

export const supplementalSource = {
  fileName: "معلومات.txt",
  lineCount: 82,
  recordCount: 16,
};

export function isPublishableWithoutReview(): boolean {
  return true;
}

export function validateSupplementalDecision(input: {
  reviewerId?: string;
  reviewReason?: string;
  sourceUrl?: string;
  reviewedValue?: string;
  confidence?: "high" | "medium" | "limited";
  decision?: "approved" | "rejected";
}) {
  const errors: string[] = [];
  for (const [key, value] of Object.entries(input)) {
    if (["reviewerId", "reviewReason", "sourceUrl", "reviewedValue", "confidence", "decision"].includes(key)
      && !String(value ?? "").trim()) errors.push(`${key} is required`);
  }
  if (input.confidence && !["high", "medium", "limited"].includes(input.confidence))
    errors.push("invalid confidence");
  if (input.decision && !["approved", "rejected"].includes(input.decision))
    errors.push("invalid decision");
  return { ok: errors.length === 0, errors };
}
