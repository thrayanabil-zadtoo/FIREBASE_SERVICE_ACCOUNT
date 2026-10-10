// DARB V1.14 — source grounding utilities.

export type GroundedSource = {
  id: string;
  title: string;
  url?: string;
  source: string;
  trust?: string;
  searchedAt?: string;
  cached?: boolean;
};

export function makeSourceId(source: {
  title?: string; url?: string; source?: string;
}, index: number): string {
  const raw = `${source.url || ""}|${source.source || ""}|${source.title || ""}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
  return `src_${Math.abs(hash)}_${index}`;
}

export function normalizeSources(items: any[], max = 5): GroundedSource[] {
  const out: GroundedSource[] = [];
  const seen = new Set<string>();

  for (const [index, item] of items.slice(0, 20).entries()) {
    if (!item || typeof item.title !== "string") continue;
    const url = typeof item.url === "string" ? item.url : undefined;
    if (url && !/^https?:\/\//i.test(url)) continue;

    const id = makeSourceId(item, index);
    if (seen.has(id)) continue;
    seen.add(id);

    out.push({
      id,
      title: item.title.trim(),
      url,
      source: String(item.source || item.domain || url || "DARB"),
      trust: item.trust,
      searchedAt: item.searchedAt,
      cached: Boolean(item.cached)
    });

    if (out.length >= max) break;
  }
  return out;
}
