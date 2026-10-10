import crypto from 'node:crypto';

export function normalizeTopic(text: string) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/[؟?!.,،؛:]/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 180);
}

export function topicKey(text: string) {
  return crypto.createHash('sha256').update(normalizeTopic(text)).digest('hex');
}

export function buildKnowledgeGap(input: {
  topic: string;
  question: string;
  evidenceStatus?: string;
}) {
  return {
    topic: normalizeTopic(input.topic || input.question),
    question: String(input.question || '').trim(),
    evidenceStatus: input.evidenceStatus || 'insufficient',
    status: 'pending'
  };
}

export function buildAnswerDraft(input: {
  question: string;
  evidence: unknown[];
  draftAnswer: string;
  sourceAnswerRunId?: number;
  reason?: string;
}) {
  return {
    question: String(input.question || '').trim(),
    draftAnswer: String(input.draftAnswer || '').trim(),
    sourceAnswerRunId: input.sourceAnswerRunId ?? null,
    evidence: Array.isArray(input.evidence) ? input.evidence : [],
    draftReason: input.reason || 'quality_improvement',
    status: 'pending'
  };
}

export function freshnessPriority(ageDays: number | null | undefined) {
  if (ageDays == null || !Number.isFinite(ageDays)) return 'normal';
  if (ageDays > 180) return 'high';
  if (ageDays > 90) return 'normal';
  return 'low';
}

export function buildRefreshRequest(input: {
  sourceUrl?: string;
  knowledgeItemId?: number;
  reason: string;
  priority?: 'low' | 'normal' | 'high';
}) {
  return {
    sourceUrl: input.sourceUrl || null,
    knowledgeItemId: input.knowledgeItemId ?? null,
    reason: input.reason,
    priority: input.priority || 'normal',
    status: 'pending'
  };
}
