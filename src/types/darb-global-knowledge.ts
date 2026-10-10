export type KnowledgeCategory =
  | "country"
  | "exchange_rate"
  | "housing"
  | "hotels"
  | "restaurants"
  | "hospitals"
  | "emergency"
  | "telecom"
  | "transport"
  | "jobs"
  | "marriage_cost"
  | "visa"
  | "residency"
  | "tourism"
  | "education"
  | "shopping"
  | "laws_customs"
  | "safety"
  | "natural_risks";

export interface DarbKnowledgeCountry {
  country_id: string; // e.g. 'EG', 'SA', 'AE', 'PS'
  country_name_ar: string;
  country_name_en: string;
  capital: string;
  currency: string;
  timezone: string;
  flag?: string;
  status: "active" | "review" | "draft";
  source_document?: string;
  verified_at?: string;
  facts_count?: number;
  freshness_summary?: {
    fresh: number;
    aging: number;
    stale: number;
  };
}

export interface DarbKnowledgeSource {
  source_id: number | string;
  country_id?: string;
  source_name: string;
  source_url: string;
  source_type: "official" | "embassy" | "ministry" | "verified_partner" | "editorial";
  trust_level: "trusted" | "standard" | "caution";
  verified_at?: string;
  expires_at?: string;
  status: "active" | "deprecated";
}

export interface DarbKnowledgeFact {
  factId: string;
  countryId: string;
  category: KnowledgeCategory;
  subject: string;
  value: unknown;
  currency?: string;
  sourceId?: string;
  sourceName?: string;
  sourceUrl?: string;
  sourceDocument?: string;
  verifiedAt?: string;
  freshnessStatus: "fresh" | "aging" | "stale" | "unknown";
  confidenceLevel: "high" | "medium" | "limited";
  publicationStatus: "published" | "pending_review" | "draft";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DarbKnowledgeRefreshItem {
  refreshId: number | string;
  factId: string;
  countryId?: string;
  category?: KnowledgeCategory;
  subject?: string;
  priority: "urgent" | "high" | "normal" | "low";
  reason: string;
  requestedBy: string;
  status: "pending" | "reviewed" | "dismissed";
  correlationId?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface DarbKnowledgeOverviewStats {
  totalCountries: number;
  totalFacts: number;
  publishedCount: number;
  pendingReviewCount: number;
  draftCount: number;
  freshCount: number;
  agingCount: number;
  staleCount: number;
  refreshQueueCount: number;
  autoPublish: boolean;
  humanReviewRequired: boolean;
  categoriesCount: number;
  sourcesCount: number;
  verificationQueueCount?: number;
  verificationQueuePending?: number;
  verificationQueueVerified?: number;
  referenceRatesCount?: number;
  editorialHotelRangesCount?: number;
}

// DARB GKE V1.1 Types
export interface DarbKnowledgeVerificationItem {
  id: number | string;
  fact_key: string;
  record_key?: string;
  country_code: string;
  country_name_ar?: string;
  axis_id?: number | string;
  axis: string;
  proposed_value?: string;
  reviewed_value?: string;
  source_url?: string;
  source_version?: string;
  source_file?: string;
  source_line_start?: number;
  source_line_end?: number;
  source_fingerprint?: string;
  data_class?: "supplemental" | "structural_proposal";
  live_data?: boolean;
  verification_status: "pending" | "verified" | "rejected";
  confidence: "high" | "medium" | "limited";
  verified_at?: string;
  reviewer_id?: string;
  review_reason?: string;
  created_at?: string;
  reviewed_at?: string;
}

export interface DarbKnowledgeReferenceExchangeRate {
  country_code: string;
  country_name_ar?: string;
  currency: string;
  usd_rate: number | string;
  rate_type: string;
  reference_date: string;
  publication_status: string;
  is_live: boolean;
  disclaimer: string;
}

export interface DarbKnowledgeEditorialHotelRange {
  country_code: string;
  country_name_ar?: string;
  range_usd_low_mid_high: string;
  source_type: string;
  publication_status: string;
  source_date: string;
  is_live: boolean;
  disclaimer: string;
}

export interface DarbKnowledgeSeedBatch {
  id: number | string;
  batch_name: string;
  source_name: string;
  source_version: string;
  imported_at: string;
  status: "pending_review" | "verified" | "rejected";
  auto_publish: boolean;
  total_items: number;
  reviewer_id?: string;
  review_reason?: string;
}

export interface DarbSupplementalFactItem {
  id: number;
  record_key: string;
  scope: "YE" | "ARAB" | string;
  country_code: string;
  country_name?: string;
  country_name_ar: string;
  axis: string;
  category?: string;
  subject?: string;
  fact_key: string;
  title_ar?: string;
  value?: any;
  proposed_value: string;
  reviewed_value?: string;
  source_file: string;
  source_name?: string;
  source_lines?: string;
  source_line_start: number;
  source_line_end: number;
  source_fingerprint: string;
  confidence: "high" | "medium" | "limited";
  proposed_confidence?: "high" | "medium" | "limited";
  status: "pending_review" | "verified" | "rejected";
  verification_status: "pending_review" | "verified" | "rejected";
  auto_publish: boolean;
  data_class: "supplemental" | "structural_proposal";
  live_data: boolean;
  notes?: string;
  reviewer_id?: string;
  review_reason?: string;
  source_url?: string;
  reviewed_at?: string;
}

export interface DarbSupplementalMetadata {
  title: string;
  source_file: string;
  sha256: string;
  lines_total: number;
  records_prepared: number;
  scope: string[];
  governance: {
    auto_publish: boolean;
    human_review_required: boolean;
    reference_data_non_live: boolean;
  };
  topics: string[];
  facts: DarbSupplementalFactItem[];
  schema_proposal: {
    title: string;
    source_lines: string;
    note: string;
    fields: Array<{ field_num: number; name_ar: string; description: string }>;
  };
}

