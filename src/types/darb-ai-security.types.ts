export type SecurityEvent = {
  id?: number;
  user_id?: string | number | null;
  conversation_id?: string | number | null;
  event_type: string;
  severity: "info" | "warning" | "critical";
  fingerprint?: string;
  details_json?: Record<string, unknown>;
  created_at?: string;
};

export type GuardDecision = {
  allowed: boolean;
  reason?: string;
  fingerprint: string;
  estimatedTokens?: number;
  windowStatus?: {
    currentRequests: number;
    maxPerWindow: number;
    windowSeconds: number;
  };
  dailyStatus?: {
    currentRequests: number;
    currentTokens: number;
    dailyReqLimit: number;
    dailyTokenLimit: number;
  };
};

export type SanitizedEvidence = {
  content: string;
  flagged: boolean;
  patternsFound?: string[];
};

export type SecurityStats = {
  totalAllowed: number;
  totalBlocked: number;
  injectionAttempts: number;
  todayRequests: number;
  todayTokens: number;
};

export type SecurityConfig = {
  rateLimitPerWindow: number;
  rateLimitWindowSeconds: number;
  dailyRequestLimit: number;
  dailyTokenBudget: number;
  requestTimeoutMs: number;
  duplicateSuppressionSeconds: number;
  externalEvidenceMaxChars: number;
  securityGuardEnabled: boolean;
  securityLogEnabled: boolean;
  autoPublish: boolean;
};
