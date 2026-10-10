// DARB V1.13 helper — source trust classification.
// This is intentionally conservative: "trusted" means the hostname matched
// an explicitly configured allow-list; it does not guarantee that a page is current.

export type TrustLevel = "trusted" | "standard" | "unknown";

function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, "").trim();
}

export function classifyWebSource(
  url: string,
  trustedDomains = (process.env.WEB_SEARCH_TRUSTED_DOMAINS || "gov.eg,gov.sa,gov.ae,gov.qa,gov.kw,gov.bh,gov.om,gov.jo,gov.ps,absher.sa,qiwa.sa,mofa.gov.sa,digital.gov.eg,mfa.gov.eg,icp.gov.ae,u.ae").split(",").map(s => s.trim()).filter(Boolean)
): TrustLevel {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") return "unknown";
    const host = normalizeHost(u.hostname);
    const trusted = trustedDomains.some(d => {
      const x = normalizeHost(d);
      return host === x || host.endsWith("." + x);
    });
    return trusted ? "trusted" : "standard";
  } catch {
    return "unknown";
  }
}
