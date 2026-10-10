/**
 * DARB AI V1.22 — AI Knowledge Quality & Refresh Manager Frontend Types
 */

export type FreshnessStatus = "fresh" | "aging" | "stale";
export type RefreshPriority = "low" | "normal" | "high" | "critical";
export type ReviewStatus = "pending" | "approved" | "rejected";

export interface RefreshItem {
  id?: number;
  knowledge_id?: number | null;
  title: string;
  country?: string | null;
  city?: string | null;
  reason: string;
  freshness_status: FreshnessStatus;
  priority: RefreshPriority;
  source_url?: string | null;
  detected_at?: string;
  status?: string;
  age_days?: number;
}

export interface KnowledgeUpdateCandidate {
  id?: number;
  refresh_id?: number | null;
  knowledge_id?: number | null;
  old_content?: string;
  proposed_content: string;
  sources_json: Array<{ name?: string; url?: string; verified?: boolean } | any>;
  confidence_level: string;
  review_status: ReviewStatus;
  reviewer_id?: number | null;
  reviewed_at?: string | null;
  created_at?: string;
}

export interface RefreshAuditItem {
  id?: number;
  action: string;
  refresh_id?: number | null;
  candidate_id?: number | null;
  actor_id?: number | null;
  actor_name?: string;
  details_json?: any;
  created_at: string;
}

export interface RefreshSummaryData {
  total: number;
  pending: number;
  high_priority: number;
  fresh: number;
  aging: number;
  stale: number;
  pending_reviews: number;
}
