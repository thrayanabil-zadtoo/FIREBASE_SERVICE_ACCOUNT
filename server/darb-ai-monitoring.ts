import crypto from 'node:crypto';

export function normalizeQuestion(question: string) {
  return String(question || '')
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/[؟?!.,،؛:]/g, ' ')
    .replace(/\s+/g, ' ');
}

export function questionSignature(question: string) {
  return crypto.createHash('sha256')
    .update(normalizeQuestion(question))
    .digest('hex');
}

export function classifyFreshness(dateValue: string | Date | null | undefined, maxAgeDays = 30): 'fresh' | 'aging' | 'stale' | 'unknown' {
  if (!dateValue) return 'unknown';
  const t = new Date(dateValue).getTime();
  if (!Number.isFinite(t)) return 'unknown';
  const ageDays = (Date.now() - t) / 86400000;
  if (ageDays <= maxAgeDays) return 'fresh';
  if (ageDays <= maxAgeDays * 3) return 'aging';
  return 'stale';
}

export function buildMonitoringEvent(input: {
  eventType: string;
  severity?: 'info' | 'warning' | 'critical';
  question?: string;
  answerRunId?: number | string | null;
  sourceUrl?: string | null;
  metadata?: Record<string, unknown>;
}) {
  return {
    eventType: input.eventType,
    severity: input.severity || 'info',
    question: input.question || null,
    answerRunId: input.answerRunId ?? null,
    sourceUrl: input.sourceUrl || null,
    metadata: input.metadata || {},
  };
}
