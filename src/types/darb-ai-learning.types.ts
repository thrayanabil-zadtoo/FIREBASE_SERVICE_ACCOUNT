export type LearningStatus =
  | 'pending'
  | 'approved'
  | 'needs_revision'
  | 'rejected';

export interface LearningTopic {
  id: number;
  topic_key: string;
  topic_label: string;
  question_count: number;
  unanswered_count: number;
  low_rating_count: number;
  last_seen_at?: string | null;
  created_at?: string;
}

export interface KnowledgeGap {
  id: number;
  topic: string;
  question: string;
  evidence_status: string;
  occurrence_count: number;
  status: LearningStatus;
  proposed_answer?: string | null;
  reviewer_id?: number | null;
  review_note?: string | null;
  created_at?: string;
  reviewed_at?: string | null;
}

export interface AnswerDraft {
  id: number;
  question: string;
  draft_answer: string;
  source_answer_run_id?: number | null;
  evidence_json: unknown[];
  draft_reason?: string;
  status: LearningStatus;
  reviewer_id?: number | null;
  review_note?: string | null;
  created_at?: string;
  reviewed_at?: string | null;
}

export interface RefreshQueueItem {
  id: number;
  source_url?: string | null;
  knowledge_item_id?: number | null;
  reason: string;
  priority: 'low' | 'normal' | 'high';
  status: string;
  last_checked_at?: string | null;
  reviewer_id?: number | null;
  review_note?: string | null;
  created_at?: string;
}

export interface LearningMetric {
  metric_name: string;
  average_value?: number | string;
  min_value?: number | string;
  max_value?: number | string;
  samples?: number;
  metric_value?: number;
  created_at?: string;
}
