export type GKEVerificationStatus = "pending" | "approved" | "rejected";
export type GKEConfidence = "high" | "medium" | "limited";

export interface GKEVerificationItem {
  id: number;
  fact_key: string;
  country_code: string;
  country_name_ar?: string;
  axis_id?: number;
  axis: string;
  proposed_value?: string;
  reviewed_value?: string;
  source_url?: string;
  source_version?: string;
  verification_status: GKEVerificationStatus | "verified";
  confidence: GKEConfidence;
  verified_at?: string;
  reviewer_id?: string;
  review_reason?: string;
  created_at: string;
  reviewed_at?: string;
}

export interface GKEVerificationFilters {
  countryCode?: string;
  axisId?: number;
  status?: GKEVerificationStatus;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface GKEHumanReviewPayload {
  id: number;
  reviewedValue: string;
  sourceUrl: string;
  confidence: GKEConfidence;
  reviewerId: string;
  reviewReason: string;
  decision: "approved" | "rejected";
}
