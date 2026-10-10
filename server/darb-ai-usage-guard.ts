export type UsageWindow = {
  requestCount: number;
  estimatedTokens: number;
  windowStartedAt?: string | Date;
};

export function withinBudget(
  usage: UsageWindow,
  maxRequests: number,
  maxTokens: number
): boolean {
  return usage.requestCount < maxRequests && usage.estimatedTokens < maxTokens;
}

export function estimateTokens(text: string): number {
  const s = String(text ?? "");
  // تقدير محافظ بسيط (متوسط 4 أحرف لكل توكن للإنجليزية، وحرفين إلى 3 للعربية)
  // وليس بديلاً عن عدّاد مزود النموذج الفعلي.
  return Math.max(1, Math.ceil(s.length / 3.5));
}
