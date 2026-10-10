// DARB V1.14 route contract and Answer Engine handler.
// Wire this into the existing DARB AI server.
// It synthesizes answers strictly grounded on DARB knowledge and/or approved web search results.

import type { Express, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { assessEvidence, buildEvidencePrompt, maxChars, AnswerSource } from "./darb-ai-answer-engine";
import { normalizeSources, GroundedSource } from "./darb-ai-source-grounding";
import { detectPotentialConflicts } from "./darb-ai-conflict-detector";
import { DarbGlobalKnowledgeEngine } from "./darb-global-knowledge-engine";
import { DarbAiDataConnector } from "./darb-ai-data-connector";
import { isQuestionAboutIsrael, PALESTINE_SOVEREIGNTY_ANSWER } from "./darb-ai-palestine-sovereignty";

export interface DarbAnswerRunRecord {
  id: number | string;
  conversation_id: string | null;
  user_id: string | null;
  question: string;
  answer: string;
  answer_source: "knowledge" | "web" | "mixed";
  confidence_level: "supported" | "limited" | "conflicted" | "insufficient";
  created_at: string;
  sources_json: GroundedSource[];
  conflicts_json: string[];
}

export const memAnswerRuns: DarbAnswerRunRecord[] = [];
let runCounter = 1;

export function buildDarbAnswerPayload(input: {
  question: string;
  knowledge: Array<any>;
  webResults?: Array<any>;
}) {
  const knowledge = input.knowledge || [];
  const web = input.webResults || [];
  const maxSources = Number(process.env.AI_ANSWER_MAX_SOURCES || 5);
  
  // Format knowledge items to source items if needed
  const formattedKnowledge = knowledge.map((k, idx) => ({
    title: k.title || `معلومات دَرْب #${idx + 1}`,
    snippet: k.snippet || k.content || "",
    source: k.source || "قاعدة معرفة دَرْب",
    trust: "trusted",
    url: k.url,
  }));

  const formattedWeb = web.map((w) => ({
    title: w.title,
    snippet: w.snippet || "",
    source: w.source || w.domain || "بحث خارجي",
    trust: w.trust || "standard",
    url: w.url,
    searchedAt: w.searchedAt,
    cached: w.cached,
  }));

  const combined = [...formattedKnowledge, ...formattedWeb];
  const sources = normalizeSources(combined, maxSources);

  const conflicts = detectPotentialConflicts(
    sources.map((s) => ({
      title: s.title,
      snippet:
        formattedKnowledge.find((k) => k.title === s.title)?.snippet ||
        formattedWeb.find((w) => w.title === s.title)?.snippet ||
        "",
      source: s.source,
    }))
  );

  const confidenceLevel = assessEvidence(formattedKnowledge.length, formattedWeb, conflicts);
  const answerSource: "web" | "mixed" | "knowledge" =
    formattedKnowledge.length && formattedWeb.length
      ? "mixed"
      : formattedWeb.length
      ? "web"
      : "knowledge";

  return {
    question: input.question,
    confidenceLevel,
    answerSource,
    sources,
    conflicts,
    evidencePrompt: buildEvidencePrompt(
      input.question,
      sources.map((s) => ({
        title: s.title,
        url: s.url,
        source: s.source,
        snippet:
          formattedKnowledge.find((k) => k.title === s.title)?.snippet ||
          formattedWeb.find((w) => w.title === s.title)?.snippet ||
          "",
        trust: (s.trust as any) || "standard",
        searchedAt: s.searchedAt,
        cached: s.cached,
      }))
    ),
  };
}

export async function synthesizeGroundedAnswer(payload: {
  question: string;
  confidenceLevel: "supported" | "limited" | "conflicted" | "insufficient";
  answerSource: "knowledge" | "web" | "mixed";
  sources: GroundedSource[];
  conflicts: string[];
  evidencePrompt: string;
  followUpContext?: {
    lastQuestion?: string;
    lastAnswer?: string;
  };
}): Promise<string> {
  // Sovereign Palestine mandate: Absolute refusal of Israel
  if (isQuestionAboutIsrael(payload.question)) {
    return PALESTINE_SOVEREIGNTY_ANSWER;
  }

  // Insufficient evidence rule: do not hallucinate
  if (payload.confidenceLevel === "insufficient" || payload.sources.length === 0) {
    return "لا أملك معلومات كافية لإعطاء إجابة موثوقة على هذا السؤال.";
  }

  // Attempt generation with Gemini if key is provided
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      let contextInstruction = "";
      if (payload.followUpContext?.lastQuestion) {
        contextInstruction = `\nسياق السؤال السابق للمستخدم: "${payload.followUpContext.lastQuestion}"\nإجابة دَرْب السابقة: "${payload.followUpContext.lastAnswer?.slice(0, 300)}"\nاربط السؤال الحالي بهذا السياق بدقة.\n`;
      }

      let conflictInstruction = "";
      if (payload.conflicts.length > 0) {
        conflictInstruction = `\nتنبيه مهم: توجد تباينات أو أرقام مختلفة بين المصادر (${payload.conflicts.join("، ")}). اذكر هذا التباين بوضوح في ردك ونبّه المستخدم لمراجعة المصدر الرسمي.\n`;
      }

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: `${payload.evidencePrompt}
${contextInstruction}
${conflictInstruction}

اكتب إجابة موثوقة ومباشرة وذكية باللغة العربية بناءً على جوهر السؤال والأدلة المتاحة. أجب عن المطلوب تحديداً في أول جملة دون حشو أو استعراض بيانات غير مطلوبة.`,
          });

          const text = response.text?.trim();
          if (text) {
            return text.slice(0, maxChars());
          }
          break;
        } catch (geminiErr: any) {
          const isTransient = geminiErr?.status === 503 || geminiErr?.status === 429 || 
            String(geminiErr).includes('high demand') || String(geminiErr).includes('UNAVAILABLE');
          if (attempt < 3 && isTransient) {
            await new Promise(r => setTimeout(r, 600 * attempt));
            continue;
          }
          console.warn(`[DARB AI Answer Engine] Gemini synthesis attempt ${attempt} warning:`, geminiErr?.message || geminiErr);
          break;
        }
      }
    } catch (err) {
      console.warn("[DARB AI Answer Engine] Gemini setup error:", err);
    }
  }

  // Fallback direct synthesis strictly from evidence
  const lines: string[] = [];
  if (payload.conflicts.length > 0) {
    lines.push("⚠️ تنبيه: توجد معلومات مختلفة بين بعض المصادر. لم يتم ترجيح مصدر تلقائياً.");
  }

  // Check if we can produce a direct smart answer from question & sources
  const qLower = payload.question.toLowerCase();
  const targetedSource = payload.sources[0];
  if (targetedSource) {
    if (qLower.includes('عاصمة') || qLower.includes('العاصمة')) {
      if (targetedSource.title.includes('فلسطين') || qLower.includes('فلسطين')) {
        return "عاصمة **دولة فلسطين** الرسمية والتاريخية هي **القدس الشريف** 🇵🇸 (مع استضافة المقرات الحكومية مؤقتاً في مدينة رام الله).";
      }
    }
    lines.push(`بناءً على معلومات دَرْب المعتمدة حول الموضوع (${payload.sources.length} مصادر):`);
    payload.sources.slice(0, 3).forEach((s) => {
      lines.push(`• **${s.title}** (${s.source})`);
    });
  } else {
    lines.push(`بناءً على الأدلة والوثائق المتاحة (${payload.sources.length} مصادر):`);
    payload.sources.forEach((s) => {
      lines.push(`• **${s.title}** (${s.source}): مصدر موثق.`);
    });
  }

  if (payload.confidenceLevel === "limited") {
    lines.push("\nملاحظة: البيانات المتاحة حول هذا الموضوع محدودة، يُنصح بمراجعة الرابط المرفق للتفاصيل الكاملة.");
  }

  return lines.join("\n\n").slice(0, maxChars());
}

export function registerDarbAIAnswerRoutes(app: Express, pool: any) {
  // POST /api/ai/answer - Synthesize grounded answer
  app.post("/api/ai/answer", async (req: Request, res: Response) => {
    try {
      const question = String(req.body?.question || req.body?.message || "").trim();
      if (!question) {
        return res.status(400).json({ ok: false, error: "السؤال مطلوب لتوليد الإجابة" });
      }

      // Sovereign Palestine mandate: Return fixed stance immediately
      if (isQuestionAboutIsrael(question)) {
        return res.json({
          ok: true,
          answer: PALESTINE_SOVEREIGNTY_ANSWER,
          confidenceLevel: "supported",
          answerSource: "knowledge",
          sources: [
            {
              id: "palestine_sovereignty",
              title: "الموقف السيادي المعتمد لدولة فلسطين",
              source: "منصة دَرْب",
              trust: "trusted",
            },
          ],
          conflicts: [],
          runId: `run_${Date.now()}`,
        });
      }

      const conversationId = req.body?.conversationId || req.body?.conversation_id || null;
      const userId = (req as any).user?.id || req.body?.userId || "guest";
      let knowledge = Array.isArray(req.body?.knowledge) ? req.body.knowledge : [];
      const webResults = Array.isArray(req.body?.webResults) ? req.body.webResults : [];
      const followUpContext = req.body?.followUpContext;

      // Knowledge-First: Load from DarbAiDataConnector (All 22 Countries, 12 Integration Phases, GKE Verified Facts)
      if (knowledge.length === 0) {
        const siteItems = DarbAiDataConnector.searchAllSiteData(question, 8);
        if (siteItems.length > 0) {
          knowledge = siteItems.map(item => ({
            title: item.title,
            content: item.snippet,
            source: item.source,
            url: item.url || "https://darb.platform",
            trust: 'trusted',
          }));
        } else {
          const gkeResult = DarbGlobalKnowledgeEngine.searchFacts({ query: question, limit: 5 });
          if (gkeResult.items.length > 0) {
            knowledge = gkeResult.items.map(f => ({
              title: `${f.subject} (${f.countryId})`,
              content: typeof f.value === 'object' 
                ? Object.entries(f.value).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ') 
                : String(f.value),
              source: `${f.sourceName || 'دليل دَرْب المطور'} [تحقق: ${f.verifiedAt ? f.verifiedAt.split('T')[0] : 'حديث'}]`,
              url: f.sourceUrl,
              trust: 'trusted',
            }));
          }
        }
      }

      const payload = buildDarbAnswerPayload({
        question,
        knowledge,
        webResults,
      });

      const answer = await synthesizeGroundedAnswer({
        ...payload,
        followUpContext,
      });

      // Persist to ai_answer_runs
      let runRecord: DarbAnswerRunRecord = {
        id: Date.now(),
        conversation_id: conversationId ? String(conversationId) : null,
        user_id: String(userId),
        question,
        answer,
        answer_source: payload.answerSource,
        confidence_level: payload.confidenceLevel,
        created_at: new Date().toISOString(),
        sources_json: payload.sources,
        conflicts_json: payload.conflicts,
      };

      if (pool) {
        try {
          const rows = await pool.query(
            `INSERT INTO ai_answer_runs
             (conversation_id, user_id, question, answer, answer_source, confidence_level, sources_json, conflicts_json)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [
              conversationId ? (isNaN(Number(conversationId)) ? null : Number(conversationId)) : null,
              userId ? (isNaN(Number(userId)) ? null : Number(userId)) : null,
              question,
              answer,
              payload.answerSource,
              payload.confidenceLevel,
              JSON.stringify(payload.sources),
              JSON.stringify(payload.conflicts),
            ]
          );
          if (rows.rows?.[0]) {
            runRecord = rows.rows[0];
          }
        } catch (dbErr) {
          console.warn("[DARB AI Answer Engine] DB persist warning:", dbErr);
        }
      }

      memAnswerRuns.unshift({
        ...runRecord,
        id: runCounter++,
      });
      if (memAnswerRuns.length > 200) memAnswerRuns.pop();

      return res.json({
        ok: true,
        data: {
          id: runRecord.id,
          question,
          answer,
          answerSource: payload.answerSource,
          confidenceLevel: payload.confidenceLevel,
          sources: payload.sources,
          conflicts: payload.conflicts,
          conversationId,
        },
      });
    } catch (err: any) {
      console.error("[DARB AI Answer Engine] Error:", err);
      return res.status(500).json({ ok: false, error: err.message || "حدث خطأ أثناء معالجة الإجابة" });
    }
  });

  // GET /api/admin/ai/answer-runs - Inspect Answer Engine runs
  app.get("/api/admin/ai/answer-runs", async (req: Request, res: Response) => {
    if (pool) {
      try {
        const rows = await pool.query(
          `SELECT * FROM ai_answer_runs ORDER BY created_at DESC LIMIT 50`
        );
        return res.json({ ok: true, data: rows.rows || [] });
      } catch (err) {
        console.warn("[DARB AI Answer Engine] DB Query warning:", err);
      }
    }
    return res.json({ ok: true, data: memAnswerRuns.slice(0, 50) });
  });
}
