import crypto from "crypto";

export type CircuitState = "closed" | "open" | "half_open";

export type ProviderHealth = {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  cooldownUntil?: number;
};

export function createCorrelationId(): string {
  return crypto.randomUUID();
}

export function shouldRetry(status?: number, attempt = 0, maxRetries = 2): boolean {
  if (attempt >= maxRetries) return false;
  if (status === undefined) return true;
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

export function backoffMs(attempt: number, base = 400, max = 5000): number {
  return Math.min(max, base * Math.pow(2, Math.max(0, attempt)));
}

export function canCallProvider(
  health: ProviderHealth,
  now = Date.now()
): boolean {
  if (health.state === "closed") return true;
  if (health.state === "open") {
    return !!health.cooldownUntil && now >= health.cooldownUntil;
  }
  return true;
}

export function recordFailure(
  health: ProviderHealth,
  threshold = 5,
  cooldownMs = 30000,
  now = Date.now()
): ProviderHealth {
  const failures = health.failureCount + 1;
  if (failures >= threshold) {
    return {
      ...health,
      failureCount: failures,
      state: "open",
      cooldownUntil: now + cooldownMs
    };
  }
  return { ...health, failureCount: failures };
}

export function recordSuccess(health: ProviderHealth): ProviderHealth {
  return {
    ...health,
    state: "closed",
    failureCount: 0,
    successCount: health.successCount + 1,
    cooldownUntil: undefined
  };
}
