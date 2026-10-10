import fs from 'fs';
import path from 'path';
import type { Express, Request, Response, NextFunction } from 'express';

const knowledgePath = path.join(process.cwd(), 'data', 'darb_knowledge.json');

export interface AdminKnowledgeItem {
  id: string | number;
  slug: string;
  title: string;
  content: string;
  country_code?: string | null;
  city_name?: string | null;
  status?: string;
  updated_at?: string;
}

export interface UnansweredQuestionItem {
  id?: number | string;
  user_id?: string | null;
  question: string;
  occurrences?: number;
  last_seen?: string;
  created_at?: string;
}

// In-memory store for Demo / Offline database mode
let memKnowledge: AdminKnowledgeItem[] = [];
let memUnanswered: { id: number; user_id: string | null; question: string; created_at: string }[] = [];
let unansweredCounter = 1;

function initMemKnowledge() {
  if (memKnowledge.length > 0) return;
  try {
    if (fs.existsSync(knowledgePath)) {
      const parsed = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
      const entries = parsed.entries || [];
      memKnowledge = entries.map((e: any, idx: number) => ({
        id: e.id || `kn_${idx + 1}`,
        slug: e.slug || e.id || `knowledge-${idx + 1}`,
        title: e.title,
        content: e.content,
        country_code: e.country_code || null,
        city_name: e.city_name || null,
        status: e.status || 'published',
        updated_at: new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.warn('[DARB AI ADMIN] Knowledge init notice:', err);
  }
}

export function getInMemoryKnowledge(): AdminKnowledgeItem[] {
  initMemKnowledge();
  return memKnowledge;
}

export async function recordUnansweredQuestion(
  pool: any,
  question: string,
  userId?: string | null
): Promise<void> {
  const cleanQ = String(question || '').trim();
  if (!cleanQ) return;

  if (pool) {
    try {
      await pool.query(
        'INSERT INTO ai_unanswered_questions(user_id, question) VALUES($1, $2)',
        [userId && userId !== 'guest' ? userId : null, cleanQ]
      );
      return;
    } catch (err) {
      console.warn('[DARB AI ADMIN] DB unanswered question record warning:', err);
    }
  }

  // In-memory fallback
  memUnanswered.push({
    id: unansweredCounter++,
    user_id: userId || null,
    question: cleanQ,
    created_at: new Date().toISOString(),
  });
}

export function registerDarbAIAdminRoutes(
  app: Express,
  {
    pool,
    isAdmin,
  }: {
    pool: any;
    isAdmin: (req: Request) => boolean | Promise<boolean>;
  }
) {
  initMemKnowledge();

  const admin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorized = await isAdmin(req);
      if (!authorized) {
        return res.status(403).json({ ok: false, error: 'المشرف فقط' });
      }
      next();
    } catch (e) {
      res.status(500).json({ ok: false, error: 'تعذر التحقق من الصلاحيات' });
    }
  };

  const q = async (sql: string, p: any[] = []): Promise<any[] | null> => {
    if (pool) {
      try {
        const res = await pool.query(sql, p);
        return res.rows;
      } catch (err) {
        console.warn('[DARB AI ADMIN] Query warning:', err);
        return null;
      }
    }
    return null;
  };

  // GET /api/admin/ai/knowledge
  app.get('/api/admin/ai/knowledge', admin, async (_req: Request, res: Response) => {
    if (pool) {
      const rows = await q(
        'SELECT id, slug, title, content, country_code, city_name, status, updated_at FROM ai_knowledge ORDER BY updated_at DESC'
      );
      if (rows && rows.length > 0) {
        return res.json({ ok: true, data: rows });
      }
    }
    // In-memory fallback
    res.json({ ok: true, data: memKnowledge });
  });

  // POST /api/admin/ai/knowledge
  app.post('/api/admin/ai/knowledge', admin, async (req: Request, res: Response) => {
    const b = req.body || {};
    if (!b.slug || !b.title || !b.content) {
      return res.status(400).json({ ok: false, error: 'الحقول الأساسية مطلوبة' });
    }

    const slug = String(b.slug).trim();
    const title = String(b.title).trim();
    const content = String(b.content).trim();
    const country_code = b.country_code ? String(b.country_code).trim() : null;
    const city_name = b.city_name ? String(b.city_name).trim() : null;
    const status = b.status || 'published';

    if (pool) {
      const rows = await q(
        `INSERT INTO ai_knowledge(slug, title, content, country_code, city_name, status)
         VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        [slug, title, content, country_code, city_name, status]
      );
      if (rows?.[0]) {
        return res.status(201).json({ ok: true, data: rows[0] });
      }
    }

    // In-memory fallback
    const newItem: AdminKnowledgeItem = {
      id: 'kn_' + Date.now(),
      slug,
      title,
      content,
      country_code,
      city_name,
      status,
      updated_at: new Date().toISOString(),
    };
    memKnowledge.unshift(newItem);

    // Also persist into JSON file if possible so server restart retains it
    try {
      const parsed = fs.existsSync(knowledgePath)
        ? JSON.parse(fs.readFileSync(knowledgePath, 'utf8'))
        : { version: '1.11', entries: [] };
      parsed.entries = parsed.entries || [];
      parsed.entries.unshift({
        id: slug,
        slug,
        title,
        content,
        country_code,
        city_name,
        status,
      });
      parsed.version = '1.11';
      fs.writeFileSync(knowledgePath, JSON.stringify(parsed, null, 2), 'utf8');
    } catch (err) {
      console.warn('[DARB AI ADMIN] JSON sync warning:', err);
    }

    res.status(201).json({ ok: true, data: newItem });
  });

  // PATCH /api/admin/ai/knowledge/:id
  app.patch('/api/admin/ai/knowledge/:id', admin, async (req: Request, res: Response) => {
    const b = req.body || {};
    const id = req.params.id;

    if (pool) {
      const rows = await q(
        `UPDATE ai_knowledge SET
           title = COALESCE($2, title),
           content = COALESCE($3, content),
           country_code = COALESCE($4, country_code),
           city_name = COALESCE($5, city_name),
           status = COALESCE($6, status),
           updated_at = now()
         WHERE id = $1 RETURNING *`,
        [id, b.title, b.content, b.country_code, b.city_name, b.status]
      );
      if (rows?.[0]) {
        return res.json({ ok: true, data: rows[0] });
      }
    }

    // In-memory fallback
    const idx = memKnowledge.findIndex(x => String(x.id) === String(id) || x.slug === id);
    if (idx === -1) {
      return res.status(404).json({ ok: false, error: 'المعلومة غير موجودة' });
    }

    const item = memKnowledge[idx];
    if (b.title !== undefined) item.title = b.title;
    if (b.content !== undefined) item.content = b.content;
    if (b.country_code !== undefined) item.country_code = b.country_code;
    if (b.city_name !== undefined) item.city_name = b.city_name;
    if (b.status !== undefined) item.status = b.status;
    item.updated_at = new Date().toISOString();

    res.json({ ok: true, data: item });
  });

  // DELETE /api/admin/ai/knowledge/:id
  app.delete('/api/admin/ai/knowledge/:id', admin, async (req: Request, res: Response) => {
    const id = req.params.id;

    if (pool) {
      await q('DELETE FROM ai_knowledge WHERE id=$1', [id]);
    }

    memKnowledge = memKnowledge.filter(x => String(x.id) !== String(id) && x.slug !== id);

    // Also remove from local json if found
    try {
      if (fs.existsSync(knowledgePath)) {
        const parsed = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
        if (parsed.entries) {
          parsed.entries = parsed.entries.filter((e: any) => String(e.id) !== String(id) && e.slug !== id);
          fs.writeFileSync(knowledgePath, JSON.stringify(parsed, null, 2), 'utf8');
        }
      }
    } catch {}

    res.json({ ok: true });
  });

  // GET /api/admin/ai/unanswered
  app.get('/api/admin/ai/unanswered', admin, async (_req: Request, res: Response) => {
    if (pool) {
      const rows = await q(
        `SELECT question, count(*)::int AS occurrences, max(created_at) AS last_seen
         FROM ai_unanswered_questions
         GROUP BY question
         ORDER BY last_seen DESC`
      );
      if (rows) {
        return res.json({ ok: true, data: rows });
      }
    }

    // In-memory grouping
    const map = new Map<string, { occurrences: number; last_seen: string }>();
    for (const item of memUnanswered) {
      const existing = map.get(item.question);
      if (existing) {
        existing.occurrences++;
        if (item.created_at > existing.last_seen) {
          existing.last_seen = item.created_at;
        }
      } else {
        map.set(item.question, { occurrences: 1, last_seen: item.created_at });
      }
    }

    const aggregated = Array.from(map.entries())
      .map(([question, stats]) => ({
        question,
        occurrences: stats.occurrences,
        last_seen: stats.last_seen,
      }))
      .sort((a, b) => (b.last_seen > a.last_seen ? 1 : -1));

    res.json({ ok: true, data: aggregated });
  });
}
