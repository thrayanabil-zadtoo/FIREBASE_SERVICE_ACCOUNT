import type { Express, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { classifyWebSource, TrustLevel } from "./darb-ai-web-search-trust";
import { searchQueryHash, cacheTtlSeconds, maxWebResults } from "./darb-ai-web-search-cache";
import { isQuestionAboutIsrael, PALESTINE_SOVEREIGNTY_ANSWER } from "./darb-ai-palestine-sovereignty";

export type DarbWebResult = {
  title: string;
  url: string;
  snippet?: string;
  source?: string;
  trust?: TrustLevel;
  searchedAt?: string;
  cached?: boolean;
};

// In-memory fallback for search history if DB is offline
const memWebSearches: Array<{
  id: number;
  conversation_id: string | null;
  user_id: string | null;
  query: string;
  provider: string;
  searched_at: string;
  result_count: number;
  results_json: any;
}> = [];
let webSearchCounter = 1;

// In-memory fallback for search cache if DB is offline
const memSearchCache = new Map<
  string,
  {
    query: string;
    provider: string;
    searchedAt: string;
    expiresAt: number;
    results: DarbWebResult[];
  }
>();

function normalizeResults(payload: any): DarbWebResult[] {
  const raw =
    Array.isArray(payload?.results) ? payload.results :
    Array.isArray(payload?.items) ? payload.items :
    Array.isArray(payload?.web) ? payload.web : [];

  return raw.map((r: any) => ({
    title: String(r?.title ?? r?.name ?? "").trim(),
    url: String(r?.url ?? r?.link ?? "").trim(),
    snippet: String(r?.snippet ?? r?.description ?? r?.text ?? "").trim(),
    source: String(r?.source ?? r?.domain ?? "").trim() || (r?.url ? new URL(r.url).hostname : ""),
  }))
  .filter((r: DarbWebResult) => {
    if (!r.title || !/^https?:\/\//i.test(r.url)) return false;
    // Reject any Zionist/Israeli domains or results
    const combined = `${r.title} ${r.snippet} ${r.url} ${r.source}`.toLowerCase();
    if (/\.il(\/|$)|israel|اسرائيل|إسرائيل/.test(combined)) return false;
    return true;
  })
  .slice(0, 15);
}

async function performWebSearch(query: string): Promise<DarbWebResult[]> {
  if (isQuestionAboutIsrael(query)) {
    return [];
  }

  const baseUrl = process.env.WEB_SEARCH_BASE_URL;
  const apiKey = process.env.WEB_SEARCH_API_KEY || "";
  const engine = process.env.WEB_SEARCH_ENGINE || "generic";

  // 1. Primary: If user configured a dedicated Web Search Provider endpoint
  if (baseUrl) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({ query, engine, limit: 10 }),
        signal: controller.signal,
      });

      if (response.ok) {
        const normalized = normalizeResults(await response.json());
        if (normalized.length > 0) return normalized;
      }
    } catch (err) {
      console.warn("[DARB AI web search] Primary provider warning:", err);
    } finally {
      clearTimeout(timeout);
    }
  }

  // 2. Gemini Grounding / Google Search if GEMINI_API_KEY is available
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
      const resp = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `ابحث في الإنترنت عن: "${query}". استخرج أهم 3 إلى 6 مصادر رسمية أو موثوقة بروابطها الحقيقية ومعلومات ملخصة للمغتربين أو المسافرين.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const results: DarbWebResult[] = [];
      const candidates = resp.candidates || [];
      const grounding = candidates[0]?.groundingMetadata;

      // Extract grounded search chunks
      if (grounding?.groundingChunks && Array.isArray(grounding.groundingChunks)) {
        for (const chunk of grounding.groundingChunks) {
          if (chunk.web?.uri && chunk.web?.title) {
            let domain = "";
            try { domain = new URL(chunk.web.uri).hostname; } catch {}
            results.push({
              title: chunk.web.title,
              url: chunk.web.uri,
              snippet: resp.text?.slice(0, 220) || "مصدر رسمي موثق عبر البحث في الإنترنت.",
              source: domain || "بحث الإنترنت الموثق",
            });
          }
        }
      }

      if (results.length > 0) {
        const seen = new Set<string>();
        const deduped: DarbWebResult[] = [];
        for (const r of results) {
          if (!seen.has(r.url)) {
            seen.add(r.url);
            deduped.push(r);
          }
        }
        return deduped.slice(0, 6);
      }
    } catch (err) {
      console.warn("[DARB AI web search] Gemini grounding fallback warning:", err);
    }
  }

  // 3. Smart Expat & Government Knowledge Portal Search Fallback
  const qClean = query.toLowerCase();
  const curatedResults: DarbWebResult[] = [];

  if (qClean.includes("سعود") || qClean.includes("رياض") || qClean.includes("جدة") || qClean.includes("إقامة") || qClean.includes("أبشر") || qClean.includes("فيزا")) {
    curatedResults.push({
      title: "منصة أبشر - خدمات الجوازات والتأشيرات والوافدين",
      url: "https://www.absher.sa",
      snippet: "البوابة الإلكترونية الرسمية لخدمات الإقامة وتأشيرات الخروج والعودة وتجديد الجوازات ورخص القيادة في المملكة العربية السعودية.",
      source: "absher.sa",
    });
    curatedResults.push({
      title: "منصة قوى (Qiwa) - عقود العمل والتوثيق للمغتربين",
      url: "https://www.qiwa.sa",
      snippet: "المنصة الموحدة لوزارة الموارد البشرية والتنمية الاجتماعية لإدارة عقود العمل وتغيير المهنة ونقل الخدمات.",
      source: "qiwa.sa",
    });
    curatedResults.push({
      title: "وزارة الخارجية السعودية - التأشيرات الإلكترونية",
      url: "https://visa.mofa.gov.sa",
      snippet: "الاستعلام عن طلبات تأشيرات العمل والزيارة العائلية وتصديق الوثائق الرسمية والشهادات الدراسية.",
      source: "visa.mofa.gov.sa",
    });
  } else if (qClean.includes("مصر") || qClean.includes("قاهر") || qClean.includes("تصديق") || qClean.includes("جواز") || qClean.includes("تجنيد")) {
    curatedResults.push({
      title: "بوابة مصر الرقمية - خدمات التوثيق والأحوال المدنية",
      url: "https://digital.gov.eg",
      snippet: "الخدمات الحكومية الإلكترونية للمواطنين بالداخل والخارج، تشمل توثيق التوكيلات، تجديد البطاقات، وتصديق المستندات.",
      source: "digital.gov.eg",
    });
    curatedResults.push({
      title: "وزارة الخارجية المصرية - تصديقات القنصلية والمغتربين",
      url: "https://www.mfa.gov.eg",
      snippet: "دليل مكاتب التصديقات وإجراءات تجديد وثائق السفر وتصديق شهادات الميلاد والمؤهلات الدراسية للمغتربين.",
      source: "mfa.gov.eg",
    });
  } else if (qClean.includes("إمارات") || qClean.includes("دبي") || qClean.includes("أبوظبي")) {
    curatedResults.push({
      title: "الهيئة الاتحادية للهوية والجنسية والجمارك وأمن المنافذ - الإمارات",
      url: "https://icp.gov.ae",
      snippet: "خدمات تصاريح الإقامة، التأشيرة الخضراء، تأشيرة العمل، والإقامة الذهبية وخدمات الهوية الوطنية.",
      source: "icp.gov.ae",
    });
    curatedResults.push({
      title: "البوابة الرسمية لحكومة دولة الإمارات العربية المتحدة",
      url: "https://u.ae",
      snippet: "دليل شامل للمقيمين والمغتربين حول العمل، السكن، التعليم، والتأمين الصحي في مختلف الإمارات.",
      source: "u.ae",
    });
  } else {
    curatedResults.push({
      title: `نتائج البحث المعتمدة عن: ${query}`,
      url: "https://www.google.com/search?q=" + encodeURIComponent(query),
      snippet: `نتائج ومصادر إلكترونية حول "${query}" موجهة للمغتربين والمسافرين والخدمات الحكومية المعتمدة.`,
      source: "بوابة البحث المعتمدة",
    });
    curatedResults.push({
      title: "المنظمة الدولية للهجرة (IOM) - بوابات المهاجرين والمغتربين",
      url: "https://www.iom.int",
      snippet: "معلومات وإرشادات موثوقة حول لوائح السفر، حقوق العمالة المهاجرة، وخدمات المسافرين في الشرق الأوسط.",
      source: "iom.int",
    });
  }

  return curatedResults;
}

export function registerDarbAIWebSearchRoutes(app: Express, db?: any) {
  app.post("/api/ai/web-search", async (req: Request, res: Response) => {
    try {
      const query = String(req.body?.query ?? "").trim();
      const consent = req.body?.consent === true;
      const conversationId = req.body?.conversationId ? String(req.body.conversationId) : null;
      const userId = req.body?.userId ? String(req.body.userId) : null;

      if (!query) {
        return res.status(400).json({ ok: false, error: "QUERY_REQUIRED" });
      }

      // Sovereign stance: Never perform search on Israel, return mandated sovereign stance
      if (isQuestionAboutIsrael(query)) {
        return res.json({
          ok: true,
          source: "knowledge",
          query,
          searchedAt: new Date().toISOString(),
          cached: false,
          resultCount: 0,
          results: [],
          answer: PALESTINE_SOVEREIGNTY_ANSWER,
          message: PALESTINE_SOVEREIGNTY_ANSWER,
        });
      }

      if (!consent) {
        return res.status(403).json({
          ok: false,
          error: "WEB_SEARCH_CONSENT_REQUIRED",
          message:
            "المعلومات المتوفرة في دَرْب غير كافية. هل تريدني أن أبحث في الإنترنت؟",
        });
      }

      const qHash = searchQueryHash(query);
      const ttlSec = cacheTtlSeconds();
      const maxResults = maxWebResults();

      // 1. Check Cache first (DB or Memory)
      let cachedResults: DarbWebResult[] | null = null;
      let cachedSearchedAt: string | null = null;

      if (db?.query) {
        try {
          const cacheRow = await db.query(
            `SELECT results_json, searched_at FROM ai_web_search_cache 
             WHERE query_hash = $1 AND expires_at > NOW() 
             ORDER BY searched_at DESC LIMIT 1`,
            [qHash]
          );
          if (cacheRow?.rows?.length > 0) {
            const rawResults = cacheRow.rows[0].results_json;
            cachedResults = Array.isArray(rawResults) ? rawResults : (typeof rawResults === 'string' ? JSON.parse(rawResults) : []);
            cachedSearchedAt = new Date(cacheRow.rows[0].searched_at).toISOString();
          }
        } catch (dbCacheErr) {
          console.warn("[DARB AI search cache] DB cache check warning:", dbCacheErr);
        }
      }

      // Memory cache check if no DB cache hit
      if (!cachedResults) {
        const memEntry = memSearchCache.get(qHash);
        if (memEntry && memEntry.expiresAt > Date.now()) {
          cachedResults = memEntry.results;
          cachedSearchedAt = memEntry.searchedAt;
        }
      }

      if (cachedResults && cachedResults.length > 0 && cachedSearchedAt) {
        return res.json({
          ok: true,
          source: "web",
          query,
          searchedAt: cachedSearchedAt,
          cached: true,
          resultCount: cachedResults.length,
          results: cachedResults.slice(0, maxResults).map((r) => ({
            ...r,
            cached: true,
            searchedAt: cachedSearchedAt!,
          })),
        });
      }

      // 2. Perform live search on cache miss
      const rawResults = await performWebSearch(query);
      const searchedAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + ttlSec * 1000).toISOString();
      const provider = process.env.WEB_SEARCH_ENGINE || (process.env.WEB_SEARCH_BASE_URL ? "custom" : "gemini-google-grounding");

      // V1.13: Classify trust level for each result
      const results: DarbWebResult[] = rawResults.slice(0, maxResults).map((r) => ({
        ...r,
        trust: classifyWebSource(r.url),
        searchedAt,
        cached: false,
      }));

      // 3. Save to DB Cache & History
      if (db?.query) {
        try {
          // Upsert cache
          await db.query(
            `INSERT INTO ai_web_search_cache
             (query_hash, query, provider, searched_at, expires_at, results_json)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (query_hash) DO UPDATE SET
               searched_at = EXCLUDED.searched_at,
               expires_at = EXCLUDED.expires_at,
               results_json = EXCLUDED.results_json`,
            [qHash, query, provider, searchedAt, expiresAt, JSON.stringify(results)]
          );

          // Insert into historical search log
          await db.query(
            `INSERT INTO ai_web_searches
             (conversation_id, user_id, query, provider, searched_at, result_count, results_json)
             VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [
              conversationId,
              userId,
              query,
              provider,
              searchedAt,
              results.length,
              JSON.stringify(results),
            ]
          );
        } catch (dbErr) {
          console.warn("[DARB AI web search] DB persist warning:", dbErr);
        }
      }

      // Save to memory cache & log
      memSearchCache.set(qHash, {
        query,
        provider,
        searchedAt,
        expiresAt: Date.now() + ttlSec * 1000,
        results,
      });

      memWebSearches.push({
        id: webSearchCounter++,
        conversation_id: conversationId,
        user_id: userId,
        query,
        provider,
        searched_at: searchedAt,
        result_count: results.length,
        results_json: results,
      });

      return res.json({
        ok: true,
        source: "web",
        query,
        searchedAt,
        cached: false,
        resultCount: results.length,
        results,
      });
    } catch (error) {
      console.error("[DARB AI web search]", error);
      return res.status(502).json({
        ok: false,
        error: "WEB_SEARCH_FAILED",
        message: "تعذر إجراء البحث الخارجي حالياً. جرّب مرة أخرى.",
      });
    }
  });

  // Admin/History inspection endpoint
  app.get("/api/admin/ai/web-searches", async (_req: Request, res: Response) => {
    if (db?.query) {
      try {
        const rows = await db.query(
          "SELECT * FROM ai_web_searches ORDER BY searched_at DESC LIMIT 50"
        );
        if (rows?.rows) {
          return res.json({ ok: true, data: rows.rows });
        }
      } catch (err) {
        console.warn("[DARB AI web search] Query warning:", err);
      }
    }
    return res.json({ ok: true, data: memWebSearches.slice(-50).reverse() });
  });

  // Admin Cache Inspection endpoint
  app.get("/api/admin/ai/web-search-cache", async (_req: Request, res: Response) => {
    if (db?.query) {
      try {
        const rows = await db.query(
          "SELECT id, query_hash, query, provider, searched_at, expires_at FROM ai_web_search_cache ORDER BY searched_at DESC LIMIT 50"
        );
        if (rows?.rows) {
          return res.json({ ok: true, data: rows.rows });
        }
      } catch (err) {
        console.warn("[DARB AI search cache] Query warning:", err);
      }
    }
    const memList = Array.from(memSearchCache.entries()).map(([hash, val]) => ({
      query_hash: hash,
      query: val.query,
      provider: val.provider,
      searched_at: val.searchedAt,
      expires_at: new Date(val.expiresAt).toISOString(),
    }));
    return res.json({ ok: true, data: memList });
  });
}
