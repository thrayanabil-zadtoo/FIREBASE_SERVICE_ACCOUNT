import fs from 'fs';
import path from 'path';
import type { Express, Request, Response, NextFunction } from 'express';
import { GoogleGenAI } from '@google/genai';
import { recordUnansweredQuestion } from './darb-ai-admin-routes';
import { DarbAiDataConnector, AISiteEvidenceItem, ALL_PROFILES_MAP } from './darb-ai-data-connector';
import { DarbGlobalKnowledgeEngine } from './darb-global-knowledge-engine';
import { COUNTRY_PROVINCES_REGISTRY } from '../src/data/darb-country-provinces-data';
import { isQuestionAboutIsrael, PALESTINE_SOVEREIGNTY_ANSWER } from './darb-ai-palestine-sovereignty';

const knowledgePath = path.join(process.cwd(), 'data', 'darb_knowledge.json');

interface KnowledgeEntry {
  id?: string;
  slug?: string;
  title: string;
  content: string;
}

export function loadKnowledge(): KnowledgeEntry[] {
  try {
    if (fs.existsSync(knowledgePath)) {
      const parsed = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
      return parsed.entries || [];
    }
  } catch (err) {
    console.warn('[DARB AI] Knowledge file load warning:', err);
  }
  return [];
}

function score(q: string, text: string): number {
  const words = q.toLowerCase().split(/\s+/).filter(x => x.length > 2);
  const hay = text.toLowerCase();
  return words.reduce((n, w) => n + (hay.includes(w) ? 1 : 0), 0);
}

export function localAnswer(question: string, entries: KnowledgeEntry[]): string | null {
  const ranked = entries
    .map(e => ({ e, s: score(question, `${e.title} ${e.content}`) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3);
  if (!ranked.length) return null;
  return ranked.map(x => `**${x.e.title}**\n${x.e.content}`).join('\n\n');
}

/**
 * Intelligent deterministic fallback when model is temporarily unreachable
 * Provides laser-focused, direct answers to specific questions (capital, currency, population, etc.)
 */
export function synthesizeSmartDirectFallback(
  question: string,
  siteEvidence?: AISiteEvidenceItem[]
): string | null {
  if (isQuestionAboutIsrael(question)) {
    return PALESTINE_SOVEREIGNTY_ANSWER;
  }

  const q = question.trim().toLowerCase();

  // Find targeted country in evidence or profiles
  let targetedCountryCode: string | null = null;
  if (siteEvidence && siteEvidence.length > 0) {
    const countryItem = siteEvidence.find(e => e.country_code);
    if (countryItem?.country_code) {
      targetedCountryCode = countryItem.country_code;
    }
  }

  // Fallback keyword detection for target country
  if (!targetedCountryCode) {
    const keywords: Record<string, string> = {
      'فلسطين': 'PS', 'القدس': 'PS', 'غزة': 'PS', 'رام الله': 'PS',
      'مصر': 'EG', 'القاهرة': 'EG', 'الإسكندرية': 'EG',
      'السعودية': 'SA', 'الرياض': 'SA', 'جدة': 'SA',
      'الإمارات': 'AE', 'الامارات': 'AE', 'أبوظبي': 'AE', 'دبي': 'AE',
      'عمان': 'OM', 'عُمان': 'OM', 'مسقط': 'OM',
      'قطر': 'QA', 'الدوحة': 'QA',
      'الكويت': 'KW',
      'البحرين': 'BH', 'المنامة': 'BH',
      'الأردن': 'JO', 'الاردن': 'JO',
      'العراق': 'IQ', 'بغداد': 'IQ',
      'سوريا': 'SY', 'دمشق': 'SY',
      'لبنان': 'LB', 'بيروت': 'LB',
      'اليمن': 'YE', 'صنعاء': 'YE', 'عدن': 'YE',
      'المغرب': 'MA', 'الرباط': 'MA',
      'الجزائر': 'DZ',
      'تونس': 'TN',
      'ليبيا': 'LY', 'طرابلس': 'LY',
      'السودان': 'SD', 'الخرطوم': 'SD',
      'موريتانيا': 'MR', 'نواكشوط': 'MR',
      'الصومال': 'SO', 'مقديشو': 'SO',
      'جيبوتي': 'DJ',
      'جزر القمر': 'KM',
      'ألمانيا': 'DE', 'المانيا': 'DE', 'برلين': 'DE',
      'فرنسا': 'FR', 'باريس': 'FR',
      'بريطانيا': 'GB', 'لندن': 'GB',
      'أمريكا': 'US', 'واشنطن': 'US',
      'تركيا': 'TR', 'أنقرة': 'TR', 'إسطنبول': 'TR',
      'إيطاليا': 'IT', 'روما': 'IT',
      'إسبانيا': 'ES', 'مدريد': 'ES',
      'اليابان': 'JP', 'طوكيو': 'JP',
      'الصين': 'CN', 'بكين': 'CN',
      'روسيا': 'RU', 'موسكو': 'RU'
    };
    for (const [kw, code] of Object.entries(keywords)) {
      if (q.includes(kw.toLowerCase())) {
        targetedCountryCode = code;
        break;
      }
    }
  }

  const p = targetedCountryCode ? (ALL_PROFILES_MAP as any)[targetedCountryCode] : null;

  if (p) {
    // 1. Capital Question
    if (q.includes('عاصمة') || q.includes('العاصمة')) {
      if (p.country_code === 'PS') {
        return `عاصمة **دولة فلسطين** الرسمية والتاريخية هي **القدس الشريف** 🇵🇸.\n\n*(ملاحظة إدارية: تتخذ المؤسسات الحكومية والوزارات التابعة للسلطة الوطنية الفلسطينية حالياً من مدينة **رام الله** مقراً إدارياً مؤقتاً لتسيير الأعمال الرسمية)*.`;
      }
      return `عاصمة **${p.name_ar}** هي مدينة **${p.capital}** ${p.flag}.`;
    }

    // 2. Currency Question
    if (q.includes('عملة') || q.includes('العملة') || q.includes('دينار') || q.includes('ريال') || q.includes('شيكل') || q.includes('جنيه') || q.includes('درهم')) {
      return `العملة الرسمية المعتمدة في **${p.name_ar}** ${p.flag} هي:\n**${p.currency}** (الرمز الدولي: \`${p.currency_symbol}\`).`;
    }

    // 3. Population Question
    if (q.includes('سكان') || q.includes('السكان') || q.includes('نسمة') || q.includes('تعداد')) {
      return `يبلغ عدد سكان **${p.name_ar}** ${p.flag} نحو **${p.population}** وفق الإحصاءات الرسمية المعتمدة.`;
    }

    // 4. Area Question
    if (q.includes('مساحة') || q.includes('المساحة') || q.includes('كيلومتر') || q.includes('كم²')) {
      return `تبلغ المساحة الجغرافية لدولة **${p.name_ar}** ${p.flag} حوالي **${p.area_sq_km}**.`;
    }

    // 5. Calling Code Question
    if (q.includes('مفتاح') || q.includes('رمز الاتصال') || q.includes('كود') || q.includes('هاتف')) {
      return `مفتاح الاتصال الدولي لدولة **${p.name_ar}** ${p.flag} هو **${p.calling_code}**، والنطاق الإلكتروني المعتمد هو \`${p.domain_tld}\`.`;
    }

    // 6. Timezone Question
    if (q.includes('توقيت') || q.includes('الساعة') || q.includes('فارق التوقيت')) {
      return `التوقيت القياسي في **${p.name_ar}** ${p.flag} هو **${p.timezone}**.`;
    }

    // 7. Provinces & Cities Question
    if (q.includes('محافظ') || q.includes('ولاي') || q.includes('مدن') || q.includes('أقاليم') || q.includes('تقسيم إداري')) {
      const provs = (COUNTRY_PROVINCES_REGISTRY as any)[p.country_code];
      if (provs && provs.length > 0) {
        const provSample = provs.slice(0, 8).map((pr: any) => 
          `• **${pr.province_name_ar}** (عاصمتها: ${pr.administrative_capital_ar} | أهم مدنها: ${(pr.key_cities || []).map((c: any) => c.name_ar).join('، ')})`
        ).join('\n');
        return `تتألف **${p.name_ar}** ${p.flag} إدارياً من **${provs.length} ${p.provinces_label}**:\n\n${provSample}${provs.length > 8 ? `\n\n*(يمكنك استعراض كافة المحافظات الـ ${provs.length} في قسم أطلس الدول)*` : ''}`;
      }
    }

    // 8. Airports and Seaports
    if (q.includes('مطار') || q.includes('مطارات') || q.includes('ميناء') || q.includes('موانئ')) {
      const airports = (p.airports || []).map((a: any) => a.name_ar).join('، ');
      const seaports = (p.seaports || []).map((s: any) => s.name_ar).join('، ');
      return `المنافذ الجوية والبحرية في **${p.name_ar}** ${p.flag}:\n\n` +
        `• **المطارات الدولية**: ${airports || 'مطار رئيسي معتمد'}\n` +
        `• **الموانئ والمرافئ**: ${seaports || 'لا توجد موانئ بحرية مباشرة'}`;
    }

    // 9. Economy and GDP
    if (q.includes('اقتصاد') || q.includes('ناتج') || q.includes('gdp') || q.includes('نمو') || q.includes('استثمار')) {
      return `الملف الاقتصادي الموجز لدولة **${p.name_ar}** ${p.flag}:\n\n` +
        `• **الناتج المحلي الإجمالي (المرجعي)**: ${p.gdp_reference}\n` +
        `• **معدل النمو السنوي**: ${p.growth_rate_reference}\n` +
        `• **أبرز القطاعات الاقتصادية**: ${(p.economic_sectors || []).join('، ')}\n` +
        `• **الموارد الطبيعية**: ${(p.natural_resources || []).join('، ')}`;
    }

    // 10. Comprehensive single-country overview (ONLY if explicitly asked)
    if (q.includes('ملف شامل') || q.includes('تقرير') || q.includes('نبذة شاملة') || q.includes('كل شيء عن')) {
      return [
        `### الملف التعريفي لدولة ${p.name_ar} ${p.flag}`,
        `• **العاصمة**: ${p.capital} | **العملة**: ${p.currency} (\`${p.currency_symbol}\`)`,
        `• **السكان**: ${p.population} | **المساحة**: ${p.area_sq_km} | **التوقيت**: ${p.timezone}`,
        `• **رمز الاتصال**: ${p.calling_code} | **الموقع**: ${p.location}`,
        `• **الناتج المحلي**: ${p.gdp_reference} | **النمو**: ${p.growth_rate_reference}`,
        `• **القطاعات الأساسية**: ${(p.economic_sectors || []).slice(0, 4).join('، ')}`,
        `• **المنافذ**: ${(p.airports || []).slice(0, 2).map((a: any) => a.name_ar).join('، ')}`
      ].join('\n');
    }
  }

  // 11. Strategic Phase lookup if question relates to a phase topic
  if (siteEvidence && siteEvidence.length > 0) {
    const phaseItem = siteEvidence.find(e => e.category === 'sovereign_phase');
    if (phaseItem) {
      return `**${phaseItem.title}**\n\n${phaseItem.snippet}`;
    }
    const gkeItem = siteEvidence.find(e => e.category === 'gke_fact');
    if (gkeItem) {
      return `**${gkeItem.title}**:\n${gkeItem.snippet}`;
    }
  }

  return null;
}

export async function modelAnswer(
  question: string,
  history: any[],
  context: string,
  siteEvidence?: AISiteEvidenceItem[]
): Promise<string | null> {
  if (isQuestionAboutIsrael(question)) {
    return PALESTINE_SOVEREIGNTY_ANSWER;
  }

  // 1. Primary: Use modern Google GenAI SDK with retry logic
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

      const historyFormatted = (history || []).slice(-6).map(x => 
        `${x.role === 'assistant' ? 'المساعد' : 'المستخدم'}: ${String(x.text || x.content || '')}`
      ).join('\n');

      const evidenceFormatted = (siteEvidence && siteEvidence.length > 0)
        ? siteEvidence.map((e, idx) => `[مصدر ${idx + 1}] ${e.title}\nالجهة/المرحلة: ${e.source}\nالبيانات: ${e.snippet}\n`).join('\n')
        : context;

      const systemPrompt = `أنت DARB AI، المساعد الذكي السيادي والمرجعي لمنصة دَرْب للدول العربية الـ22 وكافة دول العالم.

القواعد الصارمة للإجابة:
1. الموقف السيادي الثابت: إذا سُئلت عن "إسرائيل" أو "اسرائيل" أو "Israel" أو ما يتصل بها، فالإجابة الوحيدة والإلزامية والصارمة هي:
"${PALESTINE_SOVEREIGNTY_ANSWER}"
2. المباشرة الفورية أولاً: ابدأ ردك بالإجابة المباشرة والواضحة في الجملة الأولى دون مقدمات طويلة ولا حشو غير مطلوب.
   - مثال 1: عند السؤال "ما هي عاصمة فلسطين"، الإجابة تبدأ فوراً: "عاصمة دولة فلسطين الرسمية والأبدية هي **القدس الشريف** 🇵🇸 (وتتخذ المؤسسات الحكومية والوزارات حالياً من مدينة رام الله مقراً إدارياً مؤقتاً لتسيير الأعمال)."
   - مثال 2: عند السؤال عن عملة، اذكر اسم العملة ورمزها وسعر الصرف التقديري مباشرة.
   - مثال 3: عند السؤال عن عدد سكان أو مساحة، اذكر الرقم بدقة أولاً.
3. التركيز على الدولة أو الموضوع المطلوب فقط: لا تسرد ملفات تعريفية كاملة أو بيانات جغرافية أو اقتصادية غير مطلوبة، وتجنب ذكر دول أخرى لم يسأل عنها المستخدم إطلاقاً إلا إذا كان السؤال مقارنة صريحة.
4. التنسيق الأنيق: استخدم علامات Markdown الأنيقة والخط العريض للمعلومة الجوهرية والأعلام الوطنية المناسبة.
5. الشمولية عند الطلب فقط: إذا طلب المستخدم "ملفاً شاملاً" أو "دليلاً كاملاً"، زوّده بتقرير متكامل ومقسّم إلى نقاط محددة.`;

      const promptContent = `${systemPrompt}

قاعدة البيانات والأدلة المستخرجة من منصة دَرْب:
${evidenceFormatted}

${historyFormatted ? `سجل الحوار السابق:\n${historyFormatted}\n` : ''}
سؤال المستخدم:
${question}

الإجابة المباشرة والذكية:`;

      // Retry up to 3 times in case of transient 503 high demand spikes
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: promptContent,
          });

          const text = response.text?.trim();
          if (text) return text;
          break;
        } catch (genErr: any) {
          const isTransient = genErr?.status === 503 || genErr?.status === 429 || 
            String(genErr).includes('high demand') || String(genErr).includes('UNAVAILABLE');
          if (attempt < 3 && isTransient) {
            await new Promise(r => setTimeout(r, 600 * attempt));
            continue;
          }
          console.warn(`[DARB AI] Gemini synthesis attempt ${attempt} notice:`, genErr?.message || genErr);
          break;
        }
      }
    } catch (err) {
      console.warn('[DARB AI] Gemini setup notice:', err);
    }
  }

  // 2. Secondary: Compatible external OpenAI-format endpoint if configured
  const endpoint = process.env.AI_BASE_URL;
  const key = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (endpoint && key && model) {
    try {
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'أنت DARB AI، مساعد منصة دَرْب للمغتربين والمسافرين والتكامل العربي. أجب بدقة ومباشرة على صلب السؤال دون حشو أو سرد بيانات غير مطلوبة.',
            },
            { role: 'system', content: `سياق دَرْب المتصل:\n${context}` },
            ...((history || []).slice(-8).map(x => ({
              role: x.role === 'assistant' ? 'assistant' : 'user',
              content: String(x.text || x.content || ''),
            }))),
            { role: 'user', content: question },
          ],
        }),
      });
      if (r.ok) {
        const d: any = await r.json();
        const content = d?.choices?.[0]?.message?.content || d?.output_text;
        if (content) return content;
      }
    } catch (err) {
      console.warn('[DARB AI] External model request notice:', err);
    }
  }

  // 3. Smart Direct Fallback synthesizer: Never dump raw dumps of 3 countries!
  const directFallback = synthesizeSmartDirectFallback(question, siteEvidence);
  if (directFallback) {
    return directFallback;
  }

  return null;
}

// In-memory fallback stores for Demo / Offline database mode
interface MemConv {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface MemMsg {
  id: number;
  conversation_id: string;
  role: 'user' | 'assistant';
  text: string;
  source: string;
  created_at: string;
}

const memConversations = new Map<string, MemConv>();
const memMessages: MemMsg[] = [];
let msgCounter = 1;

export function registerDarbAIRoutes(
  app: Express,
  { pool, auth, optionalAuth }: { pool: any; auth?: any; optionalAuth?: any }
) {
  const q = async (sql: string, params: any[] = []): Promise<any[] | null> => {
    if (pool) {
      try {
        const res = await pool.query(sql, params);
        return res.rows;
      } catch (err) {
        console.warn('[DARB AI] DB Query warning:', err);
        return null;
      }
    }
    return null;
  };

  const ensureAuth = auth || ((req: Request, res: Response, next: NextFunction) => {
    if ((req as any).user) return next();
    return res.status(401).json({ ok: false, error: 'غير مصرح' });
  });

  const softAuth = optionalAuth || ((req: Request, _res: Response, next: NextFunction) => {
    next();
  });

  // GET /api/ai/conversations
  app.get('/api/ai/conversations', softAuth, async (req: Request, res: Response) => {
    const userId = String((req as any).user?.id || (req as any).user?.sub || 'guest');
    if (pool) {
      const rows = await q(
        'SELECT id, title, created_at, updated_at FROM ai_conversations WHERE user_id=$1 ORDER BY updated_at DESC',
        [userId]
      );
      return res.json({ ok: true, data: rows || [] });
    }

    // In-memory fallback
    const userConvs = Array.from(memConversations.values())
      .filter(c => c.user_id === userId)
      .sort((a, b) => (b.updated_at > a.updated_at ? 1 : -1));
    return res.json({ ok: true, data: userConvs });
  });

  // POST /api/ai/conversations
  app.post('/api/ai/conversations', softAuth, async (req: Request, res: Response) => {
    const userId = String((req as any).user?.id || (req as any).user?.sub || 'guest');
    const title = String(req.body?.title || 'محادثة جديدة').slice(0, 160);

    if (pool) {
      const rows = await q(
        'INSERT INTO ai_conversations(user_id, title) VALUES($1, $2) RETURNING id, title, created_at, updated_at',
        [userId, title]
      );
      return res.status(201).json({ ok: true, data: rows?.[0] || null });
    }

    const newId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const conv: MemConv = {
      id: newId,
      user_id: userId,
      title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memConversations.set(newId, conv);
    return res.status(201).json({ ok: true, data: conv });
  });

  // GET /api/ai/conversations/:id
  app.get('/api/ai/conversations/:id', softAuth, async (req: Request, res: Response) => {
    const userId = String((req as any).user?.id || (req as any).user?.sub || 'guest');
    const convId = req.params.id;

    if (pool) {
      const rows = await q(
        'SELECT id, title, created_at, updated_at FROM ai_conversations WHERE id=$1 AND user_id=$2',
        [convId, userId]
      );
      if (!rows?.[0]) return res.status(404).json({ ok: false, error: 'المحادثة غير موجودة' });
      const messages = await q(
        'SELECT id, role, text, source, created_at FROM ai_messages WHERE conversation_id=$1 ORDER BY id ASC',
        [convId]
      );
      return res.json({ ok: true, data: { ...rows[0], messages: messages || [] } });
    }

    const conv = memConversations.get(convId);
    if (!conv) return res.status(404).json({ ok: false, error: 'المحادثة غير موجودة' });
    const msgs = memMessages.filter(m => m.conversation_id === convId);
    return res.json({ ok: true, data: { ...conv, messages: msgs } });
  });

  // DELETE /api/ai/conversations/:id
  app.delete('/api/ai/conversations/:id', softAuth, async (req: Request, res: Response) => {
    const userId = String((req as any).user?.id || (req as any).user?.sub || 'guest');
    const convId = req.params.id;

    if (pool) {
      await q('DELETE FROM ai_messages WHERE conversation_id=$1', [convId]);
      await q('DELETE FROM ai_conversations WHERE id=$1 AND user_id=$2', [convId, userId]);
      return res.json({ ok: true });
    }

    memConversations.delete(convId);
    for (let i = memMessages.length - 1; i >= 0; i--) {
      if (memMessages[i].conversation_id === convId) memMessages.splice(i, 1);
    }
    return res.json({ ok: true });
  });

  // POST /api/ai/chat
  app.post('/api/ai/chat', softAuth, async (req: Request, res: Response) => {
    const question = String(req.body?.message || req.body?.question || '').trim();
    if (!question) return res.status(400).json({ ok: false, error: 'السؤال مطلوب' });

    const userId = String((req as any).user?.id || (req as any).user?.sub || 'guest');
    let conversationId = req.body?.conversationId || req.body?.conversation_id;

    if (!conversationId) {
      if (pool) {
        const c = await q('INSERT INTO ai_conversations(user_id, title) VALUES($1, $2) RETURNING id', [
          userId,
          question.slice(0, 160),
        ]);
        conversationId = c?.[0]?.id;
      } else {
        conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        memConversations.set(conversationId, {
          id: conversationId,
          user_id: userId,
          title: question.slice(0, 160),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    // Sovereign stance: Direct mandated answer when asked about Israel
    if (isQuestionAboutIsrael(question)) {
      const answer = PALESTINE_SOVEREIGNTY_ANSWER;
      const source = 'darb';

      if (pool && conversationId) {
        try {
          await q(
            "INSERT INTO ai_messages(conversation_id, role, text, source) VALUES($1, 'user', $2, 'user'), ($1, 'assistant', $3, $4)",
            [conversationId, question, answer, source]
          );
          await q('UPDATE ai_conversations SET updated_at=now() WHERE id=$1', [conversationId]);
        } catch (err) {
          console.warn('[DARB AI] Message persistence warning:', err);
        }
      } else if (conversationId) {
        memMessages.push({
          id: msgCounter++,
          conversation_id: String(conversationId),
          role: 'user',
          text: question,
          source: 'user',
          created_at: new Date().toISOString(),
        });
        memMessages.push({
          id: msgCounter++,
          conversation_id: String(conversationId),
          role: 'assistant',
          text: answer,
          source,
          created_at: new Date().toISOString(),
        });
        const conv = memConversations.get(String(conversationId));
        if (conv) conv.updated_at = new Date().toISOString();
      }

      return res.json({
        ok: true,
        conversationId,
        conversation_id: conversationId,
        answer,
        source,
        title: question.length > 38 ? question.slice(0, 38) + '…' : question,
      });
    }

    const entries = loadKnowledge();
    const context = entries.map(e => `${e.title}: ${e.content}`).join('\n');
    
    // 1. Search ALL site data (22 Countries, 12 Integration Phases, GKE Verified Facts)
    const siteEvidence = DarbAiDataConnector.searchAllSiteData(question, 8);
    const enrichedContext = [
      context,
      ...siteEvidence.map(e => `[${e.title}] ${e.snippet}`)
    ].join('\n\n');

    let answer: string | null = null;
    let source = 'darb';

    // 2. Synthesize using Google Gemini (gemini-3.8-flash) or external model with complete site grounding
    if (process.env.GEMINI_API_KEY || process.env.AI_BASE_URL) {
      answer = await modelAnswer(question, req.body?.history, enrichedContext, siteEvidence);
      if (answer) {
        source = 'darb';
      }
    }

    // 3. If model returned no answer or wasn't configured, use smart direct fallback
    if (!answer) {
      answer = synthesizeSmartDirectFallback(question, siteEvidence);
      if (answer) {
        source = 'darb';
      } else {
        answer = localAnswer(question, entries);
      }
    }

    // Domain heuristic answers if no direct score match
    if (!answer) {
      const qLower = question.toLowerCase();
      if (/وظيف|عمل|وظائف|رواتب|توظيف|مهن/.test(qLower)) {
        answer = 'داخل دَرْب يمكنك تصفح الوظائف المتاحة حسب الدولة والمدينة والمجال، ومقارنة الرواتب ومستويات المعيشة. تصفح قسم «الوظائف» لاكتشاف الفرص المناسبة لك في كافة الدول العربية.';
        source = 'darb';
      } else if (/محام|قانون|تصديق|توثيق|عقد|سفارة|أوراق|معاملات/.test(qLower)) {
        answer = 'قسم «خدمات المغتربين» في دَرْب يربطك بالمحامين المعتمدين والمكاتب القانونية وخدمات تصديق الشهادات والترجمة المعتمدة للمستندات الرسمية.';
        source = 'darb';
      } else if (/فلسطين|غزة|ضفة|رام الله|القدس|نابلس|الخليل/.test(qLower)) {
        answer = 'تحظى دولة فلسطين في دَرْب ببيانات شاملة تشمل مدينة غزة ومحافظات الضفة الغربية (القدس، رام الله، نابلس، الخليل)، مع أدلة الخدمات وفرص العمل ومجتمع المغتربين.';
        source = 'darb';
      } else if (/مصر|القاهرة|اسكندرية|الإسكندرية|جيزة|منصورة|أسوان/.test(qLower)) {
        answer = 'مصر هي الدولة الافتراضية ونقطة الانطلاق في منصة دَرْب، مع دليل موسع لأهم المدن وتكاليف المعيشة وخطط الإقامة والخدمات.';
        source = 'darb';
      } else if (/سعودية|رياض|جدة|دمام|إمارات|دبي|أبوظبي|قطر|دوحة|كويت|بحرين|عمان|مسقط/.test(qLower)) {
        answer = 'توفر دَرْب دليلاً تفصيلياً لعواصم ومدن دول الخليج، متضمناً مؤشرات المعيشة وسرعات الإنترنت ومتطلبات الإقامة وبطاقات الهوية وخدمات المغتربين.';
        source = 'darb';
      } else if (/سكن|إيجار|شقة|معيشة|تكلفة|تكاليف|مصاريف/.test(qLower)) {
        answer = 'تتضمن دَرْب أداة «حاسبة تكاليف المعيشة» في قسم «أدوات المغترب»، لحساب متوسط الإيجار، الطعام، والمواصلات في كل دولة ومدينة عربية بحسب نمط معيشتك.';
        source = 'darb';
      }
    }

    // Fallback friendly message
    if (!answer) {
      answer = 'لم أجد إجابة كافية في معلومات دَرْب حالياً. يمكنك الضغط على «🔎 ابحث في الإنترنت» للتوسع، أو طرح السؤال بصيغة أكثر تحديداً.';
      source = 'darb';
      // Record unanswered question for Admin Knowledge improvement
      await recordUnansweredQuestion(pool, question, userId);
    }

    // Store in DB if available
    if (pool && conversationId) {
      try {
        await q(
          "INSERT INTO ai_messages(conversation_id, role, text, source) VALUES($1, 'user', $2, 'user'), ($1, 'assistant', $3, $4)",
          [conversationId, question, answer, source]
        );
        await q('UPDATE ai_conversations SET updated_at=now() WHERE id=$1', [conversationId]);
      } catch (err) {
        console.warn('[DARB AI] Message persistence warning:', err);
      }
    } else if (conversationId) {
      memMessages.push({
        id: msgCounter++,
        conversation_id: String(conversationId),
        role: 'user',
        text: question,
        source: 'user',
        created_at: new Date().toISOString(),
      });
      memMessages.push({
        id: msgCounter++,
        conversation_id: String(conversationId),
        role: 'assistant',
        text: answer,
        source,
        created_at: new Date().toISOString(),
      });
      const conv = memConversations.get(String(conversationId));
      if (conv) conv.updated_at = new Date().toISOString();
    }

    res.json({
      ok: true,
      conversationId,
      conversation_id: conversationId,
      answer,
      source,
      title: question.length > 38 ? question.slice(0, 38) + '…' : question,
    });
  });

  // GET /api/ai/connected-data - Report of 100% connected site data to AI
  app.get('/api/ai/connected-data', softAuth, (_req: Request, res: Response) => {
    try {
      const stats = DarbAiDataConnector.getAIConnectedDataStats();
      res.json({ ok: true, data: stats });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err?.message || 'Failed to get connected data' });
    }
  });

  // POST /api/admin/gke/auto-activate - Auto-approve and activate all pending reviews immediately
  app.post('/api/admin/gke/auto-activate', softAuth, (_req: Request, res: Response) => {
    try {
      const result = DarbGlobalKnowledgeEngine.autoApproveAllPending();
      res.json({
        ok: true,
        message: 'تم تفعيل واعتماد كافة مراجعات الدول والمؤشرات التكميلية بنجاح بدون انتظار مراجعة يدوية',
        data: result
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err?.message || 'Failed to auto-activate' });
    }
  });
}
