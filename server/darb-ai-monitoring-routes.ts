/**
 * DARB V1.16 — AI Monitoring & Freshness Routes
 * Implements continuous quality monitoring:
 * - Repeated questions tracking & SHA-256 signatures
 * - Source health tracking & freshness classification
 * - AI monitoring events & alert bus
 * - Integration with V1.15 Knowledge Governance & Feedback
 * - Strict Human-in-the-Loop compliance (No automatic publishing to the knowledge base)
 */

import type { Express, Request, Response, NextFunction } from 'express';
import { 
  normalizeQuestion, 
  questionSignature, 
  classifyFreshness, 
  buildMonitoringEvent 
} from './darb-ai-monitoring';
import { memCandidates } from './darb-ai-quality-routes';

export interface QuestionSignatureRecord {
  id?: number;
  signature: string;
  normalized_question: string;
  hit_count: number;
  last_seen_at: string;
  first_seen_at: string;
}

export interface SourceHealthRecord {
  id?: number;
  source_url: string;
  domain: string | null;
  last_checked_at: string | null;
  http_status: number | null;
  is_reachable: boolean | null;
  observed_at: string;
  metadata_json: Record<string, any>;
  freshness?: 'fresh' | 'aging' | 'stale' | 'unknown';
}

export interface MonitoringEventRecord {
  id: number;
  event_type: string;
  severity: 'info' | 'warning' | 'critical';
  question: string | null;
  answer_run_id: number | string | null;
  source_url: string | null;
  metadata_json: Record<string, any>;
  created_at: string;
}

// In-memory fallback stores for Demo / Preview mode
export const memQuestionSignatures: Map<string, QuestionSignatureRecord> = new Map([
  [
    questionSignature('كيفية تجديد إقامة المرافقين في السعودية والرسوم المقررة'),
    {
      id: 1,
      signature: questionSignature('كيفية تجديد إقامة المرافقين في السعودية والرسوم المقررة'),
      normalized_question: normalizeQuestion('كيفية تجديد إقامة المرافقين في السعودية والرسوم المقررة'),
      hit_count: 14,
      last_seen_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      first_seen_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ],
  [
    questionSignature('خطوات توثيق عقد الإيجار عبر منصة إيجار للوافدين'),
    {
      id: 2,
      signature: questionSignature('خطوات توثيق عقد الإيجار عبر منصة إيجار للوافدين'),
      normalized_question: normalizeQuestion('خطوات توثيق عقد الإيجار عبر منصة إيجار للوافدين'),
      hit_count: 9,
      last_seen_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      first_seen_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ],
  [
    questionSignature('شروط استخراج رخصة القيادة في دبي للمقيمين الجدد'),
    {
      id: 3,
      signature: questionSignature('شروط استخراج رخصة القيادة في دبي للمقيمين الجدد'),
      normalized_question: normalizeQuestion('شروط استخراج رخصة القيادة في دبي للمقيمين الجدد'),
      hit_count: 7,
      last_seen_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      first_seen_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    },
  ],
  [
    questionSignature('طريقة معادلة وتصديق الشهادات الجامعية في القاهرة'),
    {
      id: 4,
      signature: questionSignature('طريقة معادلة وتصديق الشهادات الجامعية في القاهرة'),
      normalized_question: normalizeQuestion('طريقة معادلة وتصديق الشهادات الجامعية في القاهرة'),
      hit_count: 6,
      last_seen_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      first_seen_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
  ],
  [
    questionSignature('إجراءات نقل الكفالة في منصة قوى والمدة النظامية'),
    {
      id: 5,
      signature: questionSignature('إجراءات نقل الكفالة في منصة قوى والمدة النظامية'),
      normalized_question: normalizeQuestion('إجراءات نقل الكفالة في منصة قوى والمدة النظامية'),
      hit_count: 4,
      last_seen_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      first_seen_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    },
  ],
]);

export const memSourceHealth: Map<string, SourceHealthRecord> = new Map([
  [
    'https://www.absher.sa/portal/landing.html',
    {
      id: 1,
      source_url: 'https://www.absher.sa/portal/landing.html',
      domain: 'absher.sa',
      last_checked_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      http_status: 200,
      is_reachable: true,
      observed_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      metadata_json: { responseTimeMs: 240, trustTier: 'official_gov' },
    },
  ],
  [
    'https://qiwa.sa/ar',
    {
      id: 2,
      source_url: 'https://qiwa.sa/ar',
      domain: 'qiwa.sa',
      last_checked_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      http_status: 200,
      is_reachable: true,
      observed_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      metadata_json: { responseTimeMs: 310, trustTier: 'official_gov' },
    },
  ],
  [
    'https://u.ae/ar-ae/information-and-services/visa-and-emirates-id',
    {
      id: 3,
      source_url: 'https://u.ae/ar-ae/information-and-services/visa-and-emirates-id',
      domain: 'u.ae',
      last_checked_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      http_status: 200,
      is_reachable: true,
      observed_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      metadata_json: { responseTimeMs: 185, trustTier: 'official_gov' },
    },
  ],
  [
    'https://digital.gov.eg',
    {
      id: 4,
      source_url: 'https://digital.gov.eg',
      domain: 'digital.gov.eg',
      last_checked_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 38).toISOString(),
      http_status: 200,
      is_reachable: true,
      observed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 38).toISOString(),
      metadata_json: { responseTimeMs: 420, trustTier: 'official_gov' },
    },
  ],
  [
    'https://old-portal.example.gov/fees-2023',
    {
      id: 5,
      source_url: 'https://old-portal.example.gov/fees-2023',
      domain: 'old-portal.example.gov',
      last_checked_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
      http_status: 404,
      is_reachable: false,
      observed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
      metadata_json: { error: 'Not Found', trustTier: 'legacy' },
    },
  ],
  [
    'https://portal.chamber.sa',
    {
      id: 6,
      source_url: 'https://portal.chamber.sa',
      domain: 'chamber.sa',
      last_checked_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      http_status: 200,
      is_reachable: true,
      observed_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      metadata_json: { responseTimeMs: 195, trustTier: 'semi_gov' },
    },
  ],
]);

let eventCounter = 1;
export const memMonitorEvents: MonitoringEventRecord[] = [
  {
    id: eventCounter++,
    event_type: 'repeated_question',
    severity: 'warning',
    question: 'كيفية تجديد إقامة المرافقين في السعودية والرسوم المقررة',
    answer_run_id: null,
    source_url: null,
    metadata_json: { hitCount: 14, threshold: 5, actionSuggested: 'review_as_knowledge_candidate' },
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: eventCounter++,
    event_type: 'stale_source',
    severity: 'warning',
    question: null,
    answer_run_id: null,
    source_url: 'https://digital.gov.eg',
    metadata_json: { daysSinceCheck: 38, maxAgeDays: 30, freshness: 'aging' },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: eventCounter++,
    event_type: 'unreachable_source',
    severity: 'critical',
    question: null,
    answer_run_id: null,
    source_url: 'https://old-portal.example.gov/fees-2023',
    metadata_json: { httpStatus: 404, freshness: 'stale', domain: 'old-portal.example.gov' },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  },
  {
    id: eventCounter++,
    event_type: 'conflicting_sources',
    severity: 'warning',
    question: 'رسوم تجديد الإقامة وتأشيرة الخروج والعودة',
    answer_run_id: 2,
    source_url: null,
    metadata_json: { conflicts: ['اختلاف في شروط الإعفاء بين اللائحة القديمة وتحديثات 2026'] },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: eventCounter++,
    event_type: 'repeated_question',
    severity: 'warning',
    question: 'خطوات توثيق عقد الإيجار عبر منصة إيجار للوافدين',
    answer_run_id: null,
    source_url: null,
    metadata_json: { hitCount: 9, threshold: 5 },
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];

export function registerDarbAIMonitoringRoutes(
  app: Express,
  poolOrOptions?: any,
  maybeOptions?: { isAdmin?: (req: Request) => boolean | Promise<boolean> }
) {
  let pool = poolOrOptions;
  let isAdminCheck = maybeOptions?.isAdmin;

  if (poolOrOptions && typeof poolOrOptions.isAdmin === 'function') {
    pool = poolOrOptions.pool;
    isAdminCheck = poolOrOptions.isAdmin;
  }

  // Auto-init DB schema if pool exists
  if (pool) {
    (async () => {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS ai_monitor_events (
            id BIGSERIAL PRIMARY KEY,
            event_type TEXT NOT NULL,
            severity TEXT NOT NULL DEFAULT 'info',
            question TEXT,
            answer_run_id BIGINT,
            source_url TEXT,
            metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          CREATE INDEX IF NOT EXISTS idx_ai_monitor_events_type ON ai_monitor_events(event_type);
          CREATE INDEX IF NOT EXISTS idx_ai_monitor_events_created ON ai_monitor_events(created_at);

          CREATE TABLE IF NOT EXISTS ai_question_signatures (
            id BIGSERIAL PRIMARY KEY,
            signature TEXT NOT NULL UNIQUE,
            normalized_question TEXT NOT NULL,
            hit_count INTEGER NOT NULL DEFAULT 1,
            last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          CREATE INDEX IF NOT EXISTS idx_ai_question_signatures_hits ON ai_question_signatures(hit_count DESC);

          CREATE TABLE IF NOT EXISTS ai_source_health (
            id BIGSERIAL PRIMARY KEY,
            source_url TEXT NOT NULL UNIQUE,
            domain TEXT,
            last_checked_at TIMESTAMPTZ,
            http_status INTEGER,
            is_reachable BOOLEAN,
            observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb
          );

          CREATE INDEX IF NOT EXISTS idx_ai_source_health_checked ON ai_source_health(last_checked_at);
        `);
      } catch (err) {
        console.warn('[DARB V1.16] Monitoring DB init notice (using memory fallback if needed):', err);
      }
    })();
  }

  const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isAdminCheck) {
        const authorized = await isAdminCheck(req);
        if (!authorized) return res.status(403).json({ ok: false, error: 'صلاحية المشرف مطلوبة (admin_required)' });
        return next();
      }
      const user = (req as any).user;
      if (user && (user.isAdmin === true || user.role === 'admin')) return next();
      if (!pool) return next(); // demo mode preview permissive fallback
      return res.status(403).json({ ok: false, error: 'صلاحية المشرف مطلوبة (admin_required)' });
    } catch {
      return res.status(403).json({ ok: false, error: 'تعذر التحقق من الصلاحية' });
    }
  };

  // ==========================================
  // 1. POST /api/ai/monitor/question
  // Tracks question frequency & raises warnings for repeated questions
  // ==========================================
  app.post('/api/ai/monitor/question', async (req: Request, res: Response) => {
    try {
      const question = String(req.body?.question || '').trim();
      if (!question) return res.status(400).json({ ok: false, error: 'question_required' });

      const normalized = normalizeQuestion(question);
      const signature = questionSignature(question);
      const threshold = Number(process.env.AI_MONITOR_REPEATED_THRESHOLD || 5);

      let hitCount = 1;
      let lastSeenAt = new Date().toISOString();

      if (pool) {
        try {
          const result = await pool.query(
            `INSERT INTO ai_question_signatures
              (signature, normalized_question)
             VALUES ($1,$2)
             ON CONFLICT (signature)
             DO UPDATE SET hit_count = ai_question_signatures.hit_count + 1,
                           last_seen_at = NOW()
             RETURNING *`,
            [signature, normalized]
          );

          const row = result.rows[0];
          hitCount = row.hit_count;
          lastSeenAt = row.last_seen_at;

          if (hitCount >= threshold) {
            const event = buildMonitoringEvent({
              eventType: 'repeated_question',
              severity: 'warning',
              question,
              metadata: { hitCount, threshold, normalized },
            });
            await pool.query(
              `INSERT INTO ai_monitor_events
               (event_type, severity, question, metadata_json)
               VALUES ($1,$2,$3,$4)`,
              [event.eventType, event.severity, event.question, JSON.stringify(event.metadata)]
            );
          }
        } catch (dbErr) {
          console.warn('[DARB V1.16] DB monitor question fallback to memory:', dbErr);
        }
      }

      // Memory fallback
      const existing = memQuestionSignatures.get(signature);
      if (existing) {
        existing.hit_count += 1;
        existing.last_seen_at = lastSeenAt;
        hitCount = existing.hit_count;
      } else {
        memQuestionSignatures.set(signature, {
          id: memQuestionSignatures.size + 1,
          signature,
          normalized_question: normalized,
          hit_count: 1,
          last_seen_at: lastSeenAt,
          first_seen_at: lastSeenAt,
        });
        hitCount = 1;
      }

      if (hitCount >= threshold) {
        const isAlreadyLogged = memMonitorEvents.some(
          (e) => e.event_type === 'repeated_question' && e.question === question && (Date.now() - new Date(e.created_at).getTime() < 3600000)
        );
        if (!isAlreadyLogged) {
          memMonitorEvents.unshift({
            id: eventCounter++,
            event_type: 'repeated_question',
            severity: 'warning',
            question,
            answer_run_id: null,
            source_url: null,
            metadata_json: { hitCount, threshold, normalized },
            created_at: new Date().toISOString(),
          });
        }
      }

      res.json({ ok: true, signature, hitCount, normalized });
    } catch (e) {
      console.error('DARB V1.16 monitor question error', e);
      res.status(500).json({ ok: false, error: 'monitor_question_failed' });
    }
  });

  // ==========================================
  // 2. GET /api/admin/ai/monitoring-summary
  // Complete overview of monitor events, repeated questions, and source health
  // ==========================================
  app.get('/api/admin/ai/monitoring-summary', adminOnly, async (_req: Request, res: Response) => {
    try {
      const maxAgeDays = Number(process.env.AI_MONITOR_SOURCE_MAX_AGE_DAYS || 30);
      let events: Array<{ event_type: string; severity: any; count: number }> = [];
      let repeatedQuestions: any[] = [];
      let sources: any[] = [];

      if (pool) {
        try {
          const [eventsRes, repeatedRes, sourcesRes] = await Promise.all([
            pool.query(`SELECT event_type, severity, COUNT(*)::int AS count
                        FROM ai_monitor_events
                        GROUP BY event_type, severity
                        ORDER BY count DESC`),
            pool.query(`SELECT normalized_question, hit_count, last_seen_at
                        FROM ai_question_signatures
                        WHERE hit_count >= 2
                        ORDER BY hit_count DESC LIMIT 50`),
            pool.query(`SELECT source_url, domain, last_checked_at,
                               http_status, is_reachable
                        FROM ai_source_health
                        ORDER BY last_checked_at DESC NULLS LAST LIMIT 100`),
          ]);
          events = eventsRes.rows;
          repeatedQuestions = repeatedRes.rows;
          sources = sourcesRes.rows;
        } catch (dbErr) {
          console.warn('[DARB V1.16] Summary DB fallback to memory:', dbErr);
        }
      }

      if (events.length === 0 && repeatedQuestions.length === 0) {
        // Fallback from memory
        const eventMap = new Map<string, { event_type: string; severity: any; count: number }>();
        memMonitorEvents.forEach((ev) => {
          const key = `${ev.event_type}_${ev.severity}`;
          const cur = eventMap.get(key) || { event_type: ev.event_type, severity: ev.severity, count: 0 };
          cur.count += 1;
          eventMap.set(key, cur);
        });
        events = Array.from(eventMap.values());

        repeatedQuestions = Array.from(memQuestionSignatures.values())
          .filter((q) => q.hit_count >= 2)
          .sort((a, b) => b.hit_count - a.hit_count);

        sources = Array.from(memSourceHealth.values());
      }

      // Enhance sources with calculated freshness
      const enhancedSources = sources.map((s) => ({
        ...s,
        freshness: classifyFreshness(s.last_checked_at, maxAgeDays),
      }));

      // Calculate summary metrics
      const totalEvents = events.reduce((acc, curr) => acc + curr.count, 0);
      const warningEvents = events
        .filter((e) => e.severity === 'warning' || e.severity === 'critical')
        .reduce((acc, curr) => acc + curr.count, 0);
      const unreachableSources = enhancedSources.filter((s) => s.is_reachable === false).length;
      const staleSources = enhancedSources.filter((s) => s.freshness === 'stale').length;

      res.json({
        ok: true,
        events,
        repeatedQuestions,
        sources: enhancedSources,
        metrics: {
          totalEvents,
          warningEvents,
          repeatedCount: repeatedQuestions.length,
          unreachableSources,
          staleSources,
        },
      });
    } catch (e) {
      console.error('[DARB V1.16] monitoring_summary_failed:', e);
      res.status(500).json({ ok: false, error: 'monitoring_summary_failed' });
    }
  });

  // ==========================================
  // 3. GET /api/admin/ai/monitoring-events
  // Retrieve list of monitor events
  // ==========================================
  app.get('/api/admin/ai/monitoring-events', adminOnly, async (req: Request, res: Response) => {
    try {
      const limit = Math.min(Number(req.query.limit || 100), 500);
      const severityFilter = req.query.severity ? String(req.query.severity) : null;
      const typeFilter = req.query.type ? String(req.query.type) : null;

      if (pool) {
        try {
          let queryStr = `SELECT * FROM ai_monitor_events WHERE 1=1`;
          const params: any[] = [];
          if (severityFilter) {
            params.push(severityFilter);
            queryStr += ` AND severity = $${params.length}`;
          }
          if (typeFilter) {
            params.push(typeFilter);
            queryStr += ` AND event_type = $${params.length}`;
          }
          params.push(limit);
          queryStr += ` ORDER BY created_at DESC LIMIT $${params.length}`;

          const result = await pool.query(queryStr, params);
          return res.json({ ok: true, items: result.rows });
        } catch (dbErr) {
          console.warn('[DARB V1.16] Events DB fallback to memory:', dbErr);
        }
      }

      let filtered = [...memMonitorEvents];
      if (severityFilter) {
        filtered = filtered.filter((e) => e.severity === severityFilter);
      }
      if (typeFilter) {
        filtered = filtered.filter((e) => e.event_type === typeFilter);
      }

      res.json({ ok: true, items: filtered.slice(0, limit) });
    } catch (e) {
      console.error('[DARB V1.16] monitoring_events_failed:', e);
      res.status(500).json({ ok: false, error: 'monitoring_events_failed' });
    }
  });

  // ==========================================
  // 4. POST /api/admin/ai/monitoring-events
  // Manually or systematically log an event
  // ==========================================
  app.post('/api/admin/ai/monitoring-events', adminOnly, async (req: Request, res: Response) => {
    try {
      const { eventType, severity, question, answerRunId, sourceUrl, metadata } = req.body || {};
      if (!eventType) return res.status(400).json({ ok: false, error: 'event_type_required' });

      const newEvent = buildMonitoringEvent({
        eventType,
        severity,
        question,
        answerRunId,
        sourceUrl,
        metadata,
      });

      let insertedId = eventCounter++;
      let createdAt = new Date().toISOString();

      if (pool) {
        try {
          const result = await pool.query(
            `INSERT INTO ai_monitor_events
              (event_type, severity, question, answer_run_id, source_url, metadata_json)
             VALUES ($1,$2,$3,$4,$5,$6)
             RETURNING id, created_at`,
            [
              newEvent.eventType,
              newEvent.severity,
              newEvent.question,
              newEvent.answerRunId ? Number(newEvent.answerRunId) : null,
              newEvent.sourceUrl,
              JSON.stringify(newEvent.metadata),
            ]
          );
          if (result.rows?.[0]) {
            insertedId = result.rows[0].id;
            createdAt = result.rows[0].created_at;
          }
        } catch (dbErr) {
          console.warn('[DARB V1.16] Events insert DB fallback to memory:', dbErr);
        }
      }

      const rec: MonitoringEventRecord = {
        id: insertedId,
        event_type: newEvent.eventType,
        severity: newEvent.severity,
        question: newEvent.question,
        answer_run_id: newEvent.answerRunId,
        source_url: newEvent.sourceUrl,
        metadata_json: newEvent.metadata,
        created_at: createdAt,
      };

      memMonitorEvents.unshift(rec);
      res.json({ ok: true, event: rec });
    } catch (e) {
      console.error('[DARB V1.16] create_event_failed:', e);
      res.status(500).json({ ok: false, error: 'create_event_failed' });
    }
  });

  // ==========================================
  // 5. POST /api/admin/ai/source-health
  // Update or insert source health record
  // ==========================================
  app.post('/api/admin/ai/source-health', adminOnly, async (req: Request, res: Response) => {
    try {
      const { sourceUrl, domain, httpStatus, isReachable, metadata } = req.body || {};
      if (!sourceUrl) return res.status(400).json({ ok: false, error: 'source_url_required' });

      let parsedDomain = domain;
      if (!parsedDomain) {
        try {
          parsedDomain = new URL(sourceUrl).hostname;
        } catch {}
      }

      let insertedSource: any = null;

      if (pool) {
        try {
          const result = await pool.query(
            `INSERT INTO ai_source_health
              (source_url, domain, last_checked_at, http_status, is_reachable, metadata_json)
             VALUES ($1,$2,NOW(),$3,$4,$5)
             ON CONFLICT (source_url)
             DO UPDATE SET domain=$2, last_checked_at=NOW(),
                           http_status=$3, is_reachable=$4, metadata_json=$5
             RETURNING *`,
            [sourceUrl, parsedDomain || null, httpStatus ?? null, isReachable ?? null, JSON.stringify(metadata || {})]
          );
          insertedSource = result.rows[0];
        } catch (dbErr) {
          console.warn('[DARB V1.16] source health DB fallback to memory:', dbErr);
        }
      }

      const now = new Date().toISOString();
      const existing = memSourceHealth.get(sourceUrl);
      const record: SourceHealthRecord = {
        id: existing?.id || memSourceHealth.size + 1,
        source_url: sourceUrl,
        domain: parsedDomain || null,
        last_checked_at: now,
        http_status: httpStatus ?? 200,
        is_reachable: isReachable !== undefined ? Boolean(isReachable) : true,
        observed_at: now,
        metadata_json: metadata || {},
        freshness: classifyFreshness(now),
      };

      memSourceHealth.set(sourceUrl, record);

      res.json({ ok: true, source: insertedSource || record });
    } catch (e) {
      console.error('[DARB V1.16] source_health_failed:', e);
      res.status(500).json({ ok: false, error: 'source_health_failed' });
    }
  });

  // ==========================================
  // 6. POST /api/admin/ai/check-source
  // Active health verification test for a source URL
  // ==========================================
  app.post('/api/admin/ai/check-source', adminOnly, async (req: Request, res: Response) => {
    try {
      const sourceUrl = String(req.body?.sourceUrl || '').trim();
      if (!sourceUrl) return res.status(400).json({ ok: false, error: 'source_url_required' });

      let domain = '';
      try {
        domain = new URL(sourceUrl).hostname;
      } catch {
        return res.status(400).json({ ok: false, error: 'invalid_url_format' });
      }

      let httpStatus = 200;
      let isReachable = true;
      let responseTimeMs = 150;
      const startTime = Date.now();

      // Perform a lightweight HTTP HEAD / GET test with timeout
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const testRes = await fetch(sourceUrl, {
          method: 'HEAD',
          signal: controller.signal,
          headers: { 'User-Agent': 'DARB-AI-Freshness-Monitor/1.16' },
        }).catch(async () => {
          // If HEAD fails, try GET
          return await fetch(sourceUrl, {
            method: 'GET',
            signal: controller.signal,
            headers: { 'User-Agent': 'DARB-AI-Freshness-Monitor/1.16' },
          });
        });

        clearTimeout(timeoutId);
        httpStatus = testRes.status;
        isReachable = testRes.ok;
        responseTimeMs = Date.now() - startTime;
      } catch (fetchErr: any) {
        isReachable = false;
        httpStatus = fetchErr.name === 'AbortError' ? 504 : 0;
        responseTimeMs = Date.now() - startTime;
      }

      const now = new Date().toISOString();
      const freshness = isReachable ? 'fresh' : 'stale';

      // Record check in memory
      const existing = memSourceHealth.get(sourceUrl);
      const updatedRecord: SourceHealthRecord = {
        id: existing?.id || memSourceHealth.size + 1,
        source_url: sourceUrl,
        domain,
        last_checked_at: now,
        http_status: httpStatus,
        is_reachable: isReachable,
        observed_at: now,
        metadata_json: { responseTimeMs, checkedBy: (req as any).user?.email || 'admin' },
        freshness,
      };
      memSourceHealth.set(sourceUrl, updatedRecord);

      // If unreachable, log a critical monitoring event
      if (!isReachable) {
        memMonitorEvents.unshift({
          id: eventCounter++,
          event_type: 'unreachable_source',
          severity: 'critical',
          question: null,
          answer_run_id: null,
          source_url: sourceUrl,
          metadata_json: { httpStatus, domain, checkedAt: now },
          created_at: now,
        });
      }

      // Persist to Postgres if available
      if (pool) {
        try {
          await pool.query(
            `INSERT INTO ai_source_health
              (source_url, domain, last_checked_at, http_status, is_reachable, metadata_json)
             VALUES ($1,$2,NOW(),$3,$4,$5)
             ON CONFLICT (source_url)
             DO UPDATE SET domain=$2, last_checked_at=NOW(),
                           http_status=$3, is_reachable=$4, metadata_json=$5`,
            [sourceUrl, domain, httpStatus, isReachable, JSON.stringify(updatedRecord.metadata_json)]
          );
        } catch (dbErr) {
          console.warn('[DARB V1.16] check source DB save fallback to memory:', dbErr);
        }
      }

      res.json({
        ok: true,
        source: updatedRecord,
        responseTimeMs,
        freshness,
      });
    } catch (e) {
      console.error('[DARB V1.16] check_source_failed:', e);
      res.status(500).json({ ok: false, error: 'check_source_failed' });
    }
  });

  // ==========================================
  // 7. POST /api/admin/ai/convert-repeated-to-candidate
  // Connects monitoring directly into V1.15 Knowledge Governance
  // (Strict Human-in-the-loop: leaves status as 'pending' for review)
  // ==========================================
  app.post('/api/admin/ai/convert-repeated-to-candidate', adminOnly, async (req: Request, res: Response) => {
    try {
      const { question, proposedAnswer } = req.body || {};
      if (!question) return res.status(400).json({ ok: false, error: 'question_required' });

      // Build knowledge candidate in 'pending' status
      const candidateData = {
        id: memCandidates.length + 1,
        question: String(question).trim(),
        proposed_answer: proposedAnswer ? String(proposedAnswer).trim() : null,
        source_answer_run_id: null,
        source_type: 'repeated_question',
        status: 'pending' as const,
        reviewer_id: null,
        review_note: 'تم التحويل تلقائياً من قائمة الأسئلة المتكررة للمراجعة والاعتماد البشري',
        created_at: new Date().toISOString(),
        reviewed_at: null,
      };

      if (pool) {
        try {
          const result = await pool.query(
            `INSERT INTO ai_knowledge_candidates
              (question, proposed_answer, source_type, status, review_note)
             VALUES ($1,$2,$3,'pending',$4) RETURNING *`,
            [candidateData.question, candidateData.proposed_answer, 'repeated_question', candidateData.review_note]
          );
          if (result.rows?.[0]) {
            candidateData.id = result.rows[0].id;
          }
        } catch (dbErr) {
          console.warn('[DARB V1.16] candidate DB fallback to memory:', dbErr);
        }
      }

      memCandidates.unshift(candidateData);

      // Log event that candidate was prepared
      memMonitorEvents.unshift({
        id: eventCounter++,
        event_type: 'candidate_created',
        severity: 'info',
        question: candidateData.question,
        answer_run_id: null,
        source_url: null,
        metadata_json: { candidateId: candidateData.id, origin: 'repeated_question' },
        created_at: new Date().toISOString(),
      });

      res.json({
        ok: true,
        message: 'تم تحويل السؤال المتكرر إلى مقترح معرفة (قيد المراجعة) بنجاح',
        candidate: candidateData,
      });
    } catch (e) {
      console.error('[DARB V1.16] convert_repeated_failed:', e);
      res.status(500).json({ ok: false, error: 'convert_repeated_failed' });
    }
  });
}
