/**
 * DARB V1.15 — AI Quality & Knowledge Governance
 * Converts an unanswered question or feedback into a review candidate.
 * It intentionally does NOT publish to the knowledge base automatically.
 */
export function buildKnowledgeCandidate(input: {
  question: string;
  proposedAnswer?: string;
  answerRunId?: number | string;
  sourceType?: 'unanswered' | 'low_rating' | 'admin';
}) {
  return {
    question: String(input.question || '').trim(),
    proposed_answer: input.proposedAnswer?.trim() || null,
    source_answer_run_id: input.answerRunId ?? null,
    source_type: input.sourceType || 'unanswered',
    status: 'pending' as const,
  };
}
