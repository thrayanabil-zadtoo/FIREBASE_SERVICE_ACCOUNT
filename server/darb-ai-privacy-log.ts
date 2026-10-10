const SECRET_KEYS = /authorization|cookie|api[-_]?key|token|secret|password/i;

export function redactForLog(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    return value
      .replace(/Bearer\s+[A-Za-z0-9._~+\/-]+/gi, "Bearer [REDACTED]")
      .replace(/(api[-_]?key|token|secret|password)=([^&\s]+)/gi, "$1=[REDACTED]");
  }
  if (Array.isArray(value)) return value.map(redactForLog);
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = SECRET_KEYS.test(key) ? "[REDACTED]" : redactForLog(val);
    }
    return out;
  }
  return value;
}

export function safeLogPayload(payload: Record<string, unknown>) {
  return redactForLog(payload);
}
