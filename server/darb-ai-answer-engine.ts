// DARB V1.14 — deterministic answer assembly layer.
// It does NOT invent facts. The project's existing AI provider may be used
// for wording, but the evidence payload must remain attached to the answer.

export type AnswerSource = {
  id?: string;
  title: string;
  url?: string;
  source?: string;
  snippet?: string;
  trust?: "trusted" | "standard" | "unknown";
  searchedAt?: string;
  cached?: boolean;
};

export type AnswerRun = {
  question: string;
  answer: string;
  answerSource: "knowledge" | "web" | "mixed";
  confidenceLevel: "supported" | "limited" | "conflicted" | "insufficient";
  sources: AnswerSource[];
  conflicts: string[];
};

export const maxChars = () => {
  const n = Number(process.env.AI_ANSWER_MAX_ANSWER_CHARS || 4000);
  return Number.isFinite(n) ? Math.min(Math.max(Math.floor(n), 500), 10000) : 4000;
};

export function buildEvidencePrompt(question: string, evidence: AnswerSource[]): string {
  return [
    "You are DARB AI, the intelligent assistant for Arab expatriates, immigrants, and job seekers.",
    "Answer in Arabic clearly, politely, and informatively.",
    "Answer ONLY from the supplied evidence.",
    "Do not invent missing facts or regulations.",
    "If evidence is insufficient, say that clearly.",
    "If sources conflict, explicitly mention the conflict and advise checking the official authority.",
    `Keep the answer under ${maxChars()} characters.`,
    "",
    `QUESTION:\n${question}`,
    "",
    "EVIDENCE:",
    ...evidence.map((e, i) =>
      `[${i + 1}] ${e.title}\nSOURCE: ${e.source || e.url || "unknown"}\nURL: ${e.url || ""}\nTEXT: ${e.snippet || ""}`
    )
  ].join("\n");
}

export function assessEvidence(
  knowledgeCount: number,
  webSources: AnswerSource[],
  conflicts: string[] = []
): AnswerRun["confidenceLevel"] {
  const total = knowledgeCount + webSources.length;
  if (conflicts.length) return "conflicted";
  if (total === 0) return "insufficient";
  if (total < Number(process.env.AI_ANSWER_MIN_SUPPORT || 1)) return "insufficient";
  if (total === 1) return "limited";
  return "supported";
}
