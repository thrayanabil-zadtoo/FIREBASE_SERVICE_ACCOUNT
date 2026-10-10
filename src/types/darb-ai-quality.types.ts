export type AnswerFeedbackRating = 'helpful' | 'not_helpful';

export type QualityReviewDecision =
  | 'approved'
  | 'needs_revision'
  | 'rejected';

export type KnowledgeCandidateStatus =
  | 'pending'
  | 'approved'
  | 'needs_revision'
  | 'rejected';

export interface AnswerFeedbackPayload {
  answerRunId?: number | string;
  conversationId?: number | string;
  userId?: number | string;
  rating: AnswerFeedbackRating;
  comment?: string;
  question?: string;
}

export interface KnowledgeCandidate {
  id: number;
  question: string;
  proposed_answer?: string | null;
  source_answer_run_id?: number | string | null;
  source_type: string;
  status: KnowledgeCandidateStatus;
  reviewer_id?: number | string | null;
  review_note?: string | null;
  created_at: string;
  reviewed_at?: string | null;
}

export interface QualityReviewItem {
  answer_run_id: number | string;
  conversation_id?: number | string | null;
  user_id?: number | string | null;
  question: string;
  answer: string;
  answer_source: string;
  confidence_level: string;
  sources_json?: any[];
  conflicts_json?: any[];
  created_at: string;
  review_id?: number | string | null;
  decision?: QualityReviewDecision | null;
  note?: string | null;
  reviewer_id?: number | string | null;
  reviewed_at?: string | null;
}

export interface QualitySummaryData {
  ratings: { rating: string; count: number }[];
  confidence: { confidence_level: string; count: number }[];
  candidates: { status: string; count: number }[];
}
