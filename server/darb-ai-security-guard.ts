import crypto from "crypto";

export type GuardDecision = {
  allowed: boolean;
  reason?: string;
  fingerprint: string;
  details?: Record<string, unknown>;
};

const INJECTION_PATTERNS = [
  /ignore\s+(all|previous|earlier)\s+instructions/i,
  /system\s+prompt/i,
  /developer\s+message/i,
  /disregard\s+the\s+rules/i,
  /override\s+safety/i,
  /jailbreak/i,
  /كشف\s+(التعليمات|البرومبت|النظام)/i,
  /تجاهل\s+(التعليمات|القواعد|الأوامر)/i,
  /اعتبر\s+النص\s+تعليمات/i,
  /أنت\s+الآن\s+في\s+وضع\s+المطور/i,
  /ألغِ\s+كافة\s+القيود/i
];

export function fingerprint(text: string): string {
  return crypto.createHash("sha256").update(text.trim().toLowerCase()).digest("hex");
}

export function sanitizeExternalEvidence(text: string, maxChars: number = 12000): {
  content: string;
  flagged: boolean;
  patternsFound: string[];
} {
  const value = String(text ?? "").slice(0, maxChars);
  const patternsFound: string[] = [];
  
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(value)) {
      patternsFound.push(pattern.source);
    }
  }

  // Treat content strictly as passive data, stripping potential directive delimiters
  const sanitized = value
    .replace(/```(system|instructions|admin)/gi, "```text")
    .replace(/<\/?(system|instruction|rules)>/gi, "");

  return {
    content: sanitized,
    flagged: patternsFound.length > 0,
    patternsFound
  };
}

export function guardRequest(
  question: string,
  requestCount: number,
  maxRequests: number,
  lastRequestTime?: number,
  suppressionSeconds: number = 20
): GuardDecision {
  const fp = fingerprint(question);
  if (!question.trim()) {
    return { allowed: false, reason: "empty_question", fingerprint: fp };
  }

  // Fast duplicate suppression if requested repeatedly within a tight window
  if (lastRequestTime && (Date.now() - lastRequestTime < suppressionSeconds * 1000)) {
    return {
      allowed: false,
      reason: "duplicate_suppressed",
      fingerprint: fp,
      details: { retryAfterSeconds: Math.ceil((suppressionSeconds * 1000 - (Date.now() - lastRequestTime)) / 1000) }
    };
  }

  // Rate limit
  if (requestCount >= maxRequests) {
    return { 
      allowed: false, 
      reason: "rate_limit", 
      fingerprint: fp,
      details: { currentCount: requestCount, maxAllowed: maxRequests }
    };
  }

  return { allowed: true, fingerprint: fp };
}
