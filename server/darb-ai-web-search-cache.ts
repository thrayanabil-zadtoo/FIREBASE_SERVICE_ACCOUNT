// DARB V1.13 cache policy helper.
// The actual DB calls should use the project's existing PostgreSQL/db abstraction.

import crypto from "node:crypto";

export function searchQueryHash(query: string): string {
  return crypto.createHash("sha256")
    .update(query.trim().toLowerCase(), "utf8")
    .digest("hex");
}

export function cacheTtlSeconds(): number {
  const n = Number(process.env.WEB_SEARCH_CACHE_TTL_SECONDS || 900);
  return Number.isFinite(n) && n > 0 ? Math.min(n, 86400) : 900;
}

export function maxWebResults(): number {
  const n = Number(process.env.WEB_SEARCH_MAX_RESULTS || 10);
  return Number.isFinite(n) && n > 0 ? Math.min(Math.floor(n), 20) : 10;
}
