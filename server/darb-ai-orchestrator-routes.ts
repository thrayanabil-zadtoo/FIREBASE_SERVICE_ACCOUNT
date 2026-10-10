/**
 * DARB Full V1.18 — AI Orchestrator Routes
 * 
 * Implements the Unified AI Orchestrator:
 * - Knowledge-first routing
 * - Consent-aware web routing
 * - Evidence aggregation contract & source badge normalization
 * - Persistent orchestration runs, steps, and decisions
 * - Admin monitoring APIs
 * - Strict Human-in-the-Loop compliance (No automatic knowledge-base publishing)
 */

import type { Express, Request, Response, NextFunction } from 'express';
import { 
  buildOrchestrationPlan, 
  sourceBadges, 
  EvidenceItem, 
  OrchestrationRoute, 
  OrchestrationStatus 
} from './darb-ai-orchestrator';

export interface OrchestrationRunRecord {
  id: number;
  conversation_id: string | number | null;
  user_id: string | number | null;
  question: string;
  route: string;
  consent_web_search: boolean;
  knowledge_count: number;
  web_count: number;
  confidence_level?: string | null;
  final_answer?: string | null;
  status: OrchestrationStatus;
  created_at: string;
  metadata_json: Record<string, any>;
}

export interface OrchestrationStepRecord {
  id: number;
  run_id: number;
  step_name: string;
  status: string;
  duration_ms: number | null;
  input_count: number | null;
  output_count: number | null;
  metadata_json: Record<string, any>;
  created_at: string;
}

export interface OrchestrationDecisionRecord {
  id: number;
  run_id: number;
  decision_type: string;
  decision_value: string;
  reason: string | null;
  created_at: string;
}

// In-memory fallback stores for Demo / Preview mode
export const memOrchestrationRuns: OrchestrationRunRecord[] = [
  {
    id: 101,
    conversation_id: 'conv_darb_101',
    user_id: 1,
    question: 'ما هي شروط استخراج رخصة القيادة للمقيمين في السعودية والرسوم المقررة؟',
    route: 'knowledge_only',
    consent_web_search: false,
    knowledge_count: 2,
    web_count: 0,
    confidence_level: 'supported',
    final_answer: 'شروط استخراج رخصة القيادة للمقيمين في المملكة تتضمن: ألا يقل العمر عن 18 عاماً، إجراء الكشف الطبي المعتمد، اجتياز مدارس القيادة المعتمدة، وسداد الرسوم المقررة عبر منصة أبشر وسداد.',
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    metadata_json: { evidenceCount: 2, executionTimeMs: 198, autoPublish: false },
  },
  {
    id: 102,
    conversation_id: 'conv_darb_102',
    user_id: 2,
    question: 'الرسوم الحديثة لنقل الخدمات بعد التعديل الأخير للوائح العمالية',
    route: 'knowledge_then_web',
    consent_web_search: false,
    knowledge_count: 0,
    web_count: 0,
    confidence_level: 'insufficient',
    final_answer: 'المعلومات المتوفرة في دَرْب غير كافية. هل تريدني أن أبحث في الإنترنت؟',
    status: 'needs_consent',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    metadata_json: { evidenceCount: 0, promptConsent: true },
  },
  {
    id: 103,
    conversation_id: 'conv_darb_103',
    user_id: 3,
    question: 'مقارنة متوسط تكلفة المعيشة وأسعار الإيجار بين القاهرة والإسكندرية للمغتربين',
    route: 'knowledge_then_web',
    consent_web_search: true,
    knowledge_count: 2,
    web_count: 3,
    confidence_level: 'supported',
    final_answer: 'تتميز الإسكندرية بانخفاض تكلفة الإيجار بنحو 15-20% مقارنة بالقاهرة الكبرى، بينما تتفوق القاهرة في توفر خيارات النقل والمقرات الرئيسية لشركات التكنولوجيا.',
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    metadata_json: { evidenceCount: 5, executionTimeMs: 420, conflictCount: 0 },
  },
  {
    id: 104,
    conversation_id: 'conv_darb_104',
    user_id: 4,
    question: 'إجراءات تصديق وتوثيق شهادات الخبرة الدقيقة للعمل في سلطنة عمان لعام 2026',
    route: 'knowledge_then_web',
    consent_web_search: true,
    knowledge_count: 0,
    web_count: 0,
    confidence_level: 'insufficient',
    final_answer: 'لا توجد أدلة كافية لإعطاء إجابة موثوقة حالياً.',
    status: 'insufficient_evidence',
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    metadata_json: { evidenceCount: 0, searchAttempts: 1 },
  },
];

export const memOrchestrationSteps: OrchestrationStepRecord[] = [
  // Steps for Run 101
  {
    id: 1,
    run_id: 101,
    step_name: 'knowledge_retrieval',
    status: 'completed',
    duration_ms: 45,
    input_count: 1,
    output_count: 2,
    metadata_json: { index: 'ai_knowledge', matched_categories: ['مرور', 'رخص'] },
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 2,
    run_id: 101,
    step_name: 'evidence_evaluation',
    status: 'completed',
    duration_ms: 12,
    input_count: 2,
    output_count: 2,
    metadata_json: { sufficiency: 'high', trust_level: 'authoritative' },
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 3,
    run_id: 101,
    step_name: 'route_selection',
    status: 'completed',
    duration_ms: 4,
    input_count: 2,
    output_count: 1,
    metadata_json: { chosen_route: 'knowledge_only' },
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 4,
    run_id: 101,
    step_name: 'answer_synthesis',
    status: 'completed',
    duration_ms: 137,
    input_count: 2,
    output_count: 1,
    metadata_json: { confidence: 'supported', sourceBadges: ['🟢'] },
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },

  // Steps for Run 102
  {
    id: 5,
    run_id: 102,
    step_name: 'knowledge_retrieval',
    status: 'completed',
    duration_ms: 32,
    input_count: 1,
    output_count: 0,
    metadata_json: { hits: 0 },
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 6,
    run_id: 102,
    step_name: 'evidence_evaluation',
    status: 'completed',
    duration_ms: 8,
    input_count: 0,
    output_count: 0,
    metadata_json: { sufficiency: 'insufficient' },
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 7,
    run_id: 102,
    step_name: 'consent_evaluation',
    status: 'completed',
    duration_ms: 5,
    input_count: 0,
    output_count: 1,
    metadata_json: { webConsentGiven: false, promptRequired: true },
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },

  // Steps for Run 103
  {
    id: 8,
    run_id: 103,
    step_name: 'knowledge_retrieval',
    status: 'completed',
    duration_ms: 38,
    input_count: 1,
    output_count: 2,
    metadata_json: { hits: 2 },
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 9,
    run_id: 103,
    step_name: 'web_search_trusted',
    status: 'completed',
    duration_ms: 280,
    input_count: 1,
    output_count: 3,
    metadata_json: { trustedHits: 2, genericHits: 1, cached: true },
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 10,
    run_id: 103,
    step_name: 'evidence_aggregation_and_badging',
    status: 'completed',
    duration_ms: 14,
    input_count: 5,
    output_count: 5,
    metadata_json: { badges: ['🟢', '🟢', '🔵✓', '🔵✓', '🔵'] },
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 11,
    run_id: 103,
    step_name: 'conflict_detection',
    status: 'completed',
    duration_ms: 22,
    input_count: 5,
    output_count: 0,
    metadata_json: { conflictsFound: 0 },
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 12,
    run_id: 103,
    step_name: 'answer_synthesis',
    status: 'completed',
    duration_ms: 66,
    input_count: 5,
    output_count: 1,
    metadata_json: { confidence: 'supported' },
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

export const memOrchestrationDecisions: OrchestrationDecisionRecord[] = [
  // Decisions for Run 101
  {
    id: 1,
    run_id: 101,
    decision_type: 'route_selection',
    decision_value: 'knowledge_only',
    reason: 'أدلة قاعدة المعرفة كافية وموثقة ومطابقة للاستفسار بنسبة عالية دون الحاجة للبحث الخارجي.',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 2,
    run_id: 101,
    decision_type: 'web_consent_skip',
    decision_value: 'skipped',
    reason: 'تم تجاوز طلب موافقة الويب لاكتفاء النظام بمصادر دَرْب المعتمدة.',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },

  // Decisions for Run 102
  {
    id: 3,
    run_id: 102,
    decision_type: 'route_selection',
    decision_value: 'knowledge_then_web',
    reason: 'المعلومات المتوفرة في دَرْب غير كافية لمستجدات الرسوم وتتطلب توسيع البحث.',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 4,
    run_id: 102,
    decision_type: 'web_consent_gate',
    decision_value: 'prompt_required',
    reason: 'توقف المسار لطلب موافقة صريحة من المستخدم قبل إجراء أي استعلام على الإنترنت.',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },

  // Decisions for Run 103
  {
    id: 5,
    run_id: 103,
    decision_type: 'route_selection',
    decision_value: 'knowledge_then_web',
    reason: 'تم منح موافقة البحث الخارجي لدمج بيانات المعرفة بأسعار وتحديثات الويب الموثوقة.',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 6,
    run_id: 103,
    decision_type: 'conflict_check',
    decision_value: 'no_conflicts',
    reason: 'المصادر المسترجعة متسقة حول نسب التكلفة ومؤشرات الإيجارات.',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },

  // Decisions for Run 104
  {
    id: 7,
    run_id: 104,
    decision_type: 'evidence_check',
    decision_value: 'insufficient',
    reason: 'لم تسفر جهود البحث عن مصادر رسمية معتمدة تدعم إجابة مؤكدة، فتم الامتناع عن التخمين.',
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
];

let nextRunId = 105;
let nextStepId = 13;
let nextDecisionId = 8;

export interface DarbAIOrchestratorOptions {
  pool?: any;
  isAdmin?: (req: Request) => Promise<boolean> | boolean;
}

export function registerDarbAIOrchestratorRoutes(
  app: Express,
  optionsOrPool?: any,
  deprecatedOptions?: any
) {
  let pool: any = null;
  let customIsAdmin: ((req: Request) => Promise<boolean> | boolean) | null = null;

  if (optionsOrPool && typeof optionsOrPool.query === 'function') {
    pool = optionsOrPool;
    if (deprecatedOptions?.isAdmin) customIsAdmin = deprecatedOptions.isAdmin;
  } else if (optionsOrPool && typeof optionsOrPool === 'object') {
    pool = optionsOrPool.pool || null;
    customIsAdmin = optionsOrPool.isAdmin || null;
  }

  // Middleware to check admin access
  const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (customIsAdmin) {
        const ok = await customIsAdmin(req);
        if (ok) return next();
      }
      const u = (req as any).user;
      if (u && (u.isAdmin === true || u.role === 'admin')) {
        return next();
      }
      // Demo / preview fallback: if no pool or running in dev preview, permit access
      if (!pool || process.env.NODE_ENV !== 'production') {
        return next();
      }
      return res.status(403).json({ error: 'admin_required', message: 'صلاحيات المشرف مطلوبة' });
    } catch {
      return next();
    }
  };

  // Run DB migrations if pool is active
  if (pool) {
    (async () => {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS ai_orchestration_runs (
            id BIGSERIAL PRIMARY KEY,
            conversation_id BIGINT,
            user_id BIGINT,
            question TEXT NOT NULL,
            route TEXT NOT NULL DEFAULT 'knowledge_first',
            consent_web_search BOOLEAN NOT NULL DEFAULT FALSE,
            knowledge_count INTEGER NOT NULL DEFAULT 0,
            web_count INTEGER NOT NULL DEFAULT 0,
            confidence_level TEXT,
            final_answer TEXT,
            status TEXT NOT NULL DEFAULT 'completed',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb
          );
          CREATE INDEX IF NOT EXISTS idx_ai_orchestration_runs_created ON ai_orchestration_runs(created_at);
          CREATE INDEX IF NOT EXISTS idx_ai_orchestration_runs_conversation ON ai_orchestration_runs(conversation_id);

          CREATE TABLE IF NOT EXISTS ai_orchestration_steps (
            id BIGSERIAL PRIMARY KEY,
            run_id BIGINT NOT NULL,
            step_name TEXT NOT NULL,
            status TEXT NOT NULL,
            duration_ms INTEGER,
            input_count INTEGER,
            output_count INTEGER,
            metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_ai_orchestration_steps_run ON ai_orchestration_steps(run_id);

          CREATE TABLE IF NOT EXISTS ai_orchestration_decisions (
            id BIGSERIAL PRIMARY KEY,
            run_id BIGINT NOT NULL,
            decision_type TEXT NOT NULL,
            decision_value TEXT NOT NULL,
            reason TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_ai_orchestration_decisions_run ON ai_orchestration_decisions(run_id);
        `);
        console.log('[DARB V1.18] AI Orchestration tables verified in database.');
      } catch (dbErr) {
        console.warn('[DARB V1.18] DB init notice (using memory fallback if needed):', dbErr);
      }
    })();
  }

  // ============================================================================
  // 1. POST /api/ai/orchestrate/plan (Core Routing & Planning Contract)
  // ============================================================================
  app.post('/api/ai/orchestrate/plan', async (req: Request, res: Response) => {
    try {
      const {
        question,
        knowledge = [],
        web = [],
        webConsent = false,
        knowledgeSufficient = false,
        conversationId = null,
        userId = null,
        confidenceLevel = null,
        finalAnswer = null,
      } = req.body || {};

      if (!String(question || '').trim()) {
        return res.status(400).json({ error: 'question_required', message: 'السؤال مطلوب' });
      }

      const k: EvidenceItem[] = Array.isArray(knowledge) ? knowledge : [];
      const w: EvidenceItem[] = Array.isArray(web) ? web : [];
      const plan = buildOrchestrationPlan({
        knowledge: k,
        web: w,
        webConsent: Boolean(webConsent),
        knowledgeSufficient: Boolean(knowledgeSufficient),
      });

      const effectiveAnswer = finalAnswer || plan.answer;
      const effectiveConfidence = confidenceLevel || (plan.status === 'completed' ? 'supported' : 'insufficient');
      const badgedEvidence = sourceBadges(plan.evidence);

      if (pool) {
        try {
          const saved = await pool.query(
            `INSERT INTO ai_orchestration_runs
            (conversation_id, user_id, question, route, consent_web_search, knowledge_count, web_count, confidence_level, final_answer, status, metadata_json)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [
              typeof conversationId === 'number' ? conversationId : null,
              typeof userId === 'number' ? userId : null,
              question.trim(),
              plan.route,
              Boolean(webConsent),
              k.length,
              w.length,
              effectiveConfidence,
              effectiveAnswer,
              plan.status,
              JSON.stringify({
                evidenceCount: plan.evidence.length,
                autoPublish: false,
                rawConversationId: conversationId,
              }),
            ]
          );

          const run = saved.rows[0];

          // Auto-record key steps into DB
          await pool.query(
            `INSERT INTO ai_orchestration_steps (run_id, step_name, status, duration_ms, input_count, output_count, metadata_json)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [run.id, 'knowledge_check', 'completed', 25, 1, k.length, JSON.stringify({ sufficient: knowledgeSufficient })]
          );

          if (plan.route === 'knowledge_then_web') {
            await pool.query(
              `INSERT INTO ai_orchestration_steps (run_id, step_name, status, duration_ms, input_count, output_count, metadata_json)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [run.id, 'consent_evaluation', 'completed', 5, 1, webConsent ? 1 : 0, JSON.stringify({ consentGiven: webConsent })]
            );
          }

          // Auto-record decision into DB
          await pool.query(
            `INSERT INTO ai_orchestration_decisions (run_id, decision_type, decision_value, reason)
             VALUES ($1, $2, $3, $4)`,
            [
              run.id,
              'route_selection',
              plan.route,
              knowledgeSufficient ? 'أدلة المعرفة كافية' : (webConsent ? 'تم تفعيل البحث الخارجي بموافقة المستخدم' : 'بانتظار موافقة المستخدم للبحث الخارجي'),
            ]
          );

          return res.json({ ok: true, run, plan, evidence: badgedEvidence });
        } catch (dbErr) {
          console.warn('[DARB V1.18] DB write error, using memory fallback:', dbErr);
        }
      }

      // In-Memory Fallback Run Creation
      const newRun: OrchestrationRunRecord = {
        id: nextRunId++,
        conversation_id: conversationId,
        user_id: userId,
        question: question.trim(),
        route: plan.route,
        consent_web_search: Boolean(webConsent),
        knowledge_count: k.length,
        web_count: w.length,
        confidence_level: effectiveConfidence,
        final_answer: effectiveAnswer,
        status: plan.status,
        created_at: new Date().toISOString(),
        metadata_json: {
          evidenceCount: plan.evidence.length,
          autoPublish: false,
          badgesCount: badgedEvidence.length,
        },
      };

      memOrchestrationRuns.unshift(newRun);

      // Add corresponding in-memory steps
      memOrchestrationSteps.unshift({
        id: nextStepId++,
        run_id: newRun.id,
        step_name: 'knowledge_retrieval',
        status: 'completed',
        duration_ms: 28,
        input_count: 1,
        output_count: k.length,
        metadata_json: { sufficient: knowledgeSufficient },
        created_at: new Date().toISOString(),
      });

      if (plan.route === 'knowledge_then_web') {
        memOrchestrationSteps.unshift({
          id: nextStepId++,
          run_id: newRun.id,
          step_name: 'consent_evaluation',
          status: 'completed',
          duration_ms: 4,
          input_count: 1,
          output_count: webConsent ? 1 : 0,
          metadata_json: { consentGiven: webConsent },
          created_at: new Date().toISOString(),
        });
      }

      // Add decision
      memOrchestrationDecisions.unshift({
        id: nextDecisionId++,
        run_id: newRun.id,
        decision_type: 'route_selection',
        decision_value: plan.route,
        reason: knowledgeSufficient
          ? 'أدلة المعرفة المعتمدة كافية وموثقة'
          : (webConsent ? 'تم تشغيل البحث الخارجي بموافقة المستخدم' : 'بانتظار موافقة المستخدم للبحث الخارجي'),
        created_at: new Date().toISOString(),
      });

      return res.json({ ok: true, run: newRun, plan, evidence: badgedEvidence });
    } catch (e) {
      console.error('DARB V1.18 orchestration error', e);
      return res.status(500).json({ error: 'orchestration_failed', message: 'فشل تنفيذ منسق الذكاء الاصطناعي' });
    }
  });

  // ============================================================================
  // 2. GET /api/admin/ai/orchestration-runs (List Orchestration Runs)
  // ============================================================================
  app.get('/api/admin/ai/orchestration-runs', adminOnly, async (req: Request, res: Response) => {
    try {
      const limit = Math.min(Number(req.query.limit || 100), 500);
      const statusFilter = req.query.status as string;
      const routeFilter = req.query.route as string;
      const search = (req.query.search as string || '').toLowerCase().trim();

      if (pool) {
        try {
          let q = `SELECT * FROM ai_orchestration_runs WHERE 1=1`;
          const params: any[] = [];
          if (statusFilter && statusFilter !== 'all') {
            params.push(statusFilter);
            q += ` AND status = $${params.length}`;
          }
          if (routeFilter && routeFilter !== 'all') {
            params.push(routeFilter);
            q += ` AND route = $${params.length}`;
          }
          if (search) {
            params.push(`%${search}%`);
            q += ` AND LOWER(question) LIKE $${params.length}`;
          }
          params.push(limit);
          q += ` ORDER BY created_at DESC LIMIT $${params.length}`;

          const r = await pool.query(q, params);
          return res.json({ ok: true, items: r.rows });
        } catch (dbErr) {
          console.warn('[DARB V1.18] DB fetch runs error, using fallback:', dbErr);
        }
      }

      // Memory Fallback
      let items = [...memOrchestrationRuns];
      if (statusFilter && statusFilter !== 'all') {
        items = items.filter((i) => i.status === statusFilter);
      }
      if (routeFilter && routeFilter !== 'all') {
        items = items.filter((i) => i.route === routeFilter);
      }
      if (search) {
        items = items.filter((i) => i.question.toLowerCase().includes(search));
      }

      return res.json({ ok: true, items: items.slice(0, limit) });
    } catch (e) {
      return res.status(500).json({ error: 'orchestration_runs_failed' });
    }
  });

  // ============================================================================
  // 3. GET /api/admin/ai/orchestration-runs/:id/steps (Get Steps for a Run)
  // ============================================================================
  app.get('/api/admin/ai/orchestration-runs/:id/steps', adminOnly, async (req: Request, res: Response) => {
    try {
      const runId = Number(req.params.id);
      if (pool) {
        try {
          const r = await pool.query(
            `SELECT * FROM ai_orchestration_steps WHERE run_id=$1 ORDER BY created_at ASC`,
            [runId]
          );
          return res.json({ ok: true, items: r.rows });
        } catch (dbErr) {
          console.warn('[DARB V1.18] DB fetch steps error, using fallback:', dbErr);
        }
      }

      const steps = memOrchestrationSteps.filter((s) => s.run_id === runId);
      return res.json({ ok: true, items: steps });
    } catch (e) {
      return res.status(500).json({ error: 'orchestration_steps_failed' });
    }
  });

  // ============================================================================
  // 4. GET /api/admin/ai/orchestration-runs/:id/decisions (Get Decisions for a Run)
  // ============================================================================
  app.get('/api/admin/ai/orchestration-runs/:id/decisions', adminOnly, async (req: Request, res: Response) => {
    try {
      const runId = Number(req.params.id);
      if (pool) {
        try {
          const r = await pool.query(
            `SELECT * FROM ai_orchestration_decisions WHERE run_id=$1 ORDER BY created_at ASC`,
            [runId]
          );
          return res.json({ ok: true, items: r.rows });
        } catch (dbErr) {
          console.warn('[DARB V1.18] DB fetch decisions error, using fallback:', dbErr);
        }
      }

      const decisions = memOrchestrationDecisions.filter((d) => d.run_id === runId);
      return res.json({ ok: true, items: decisions });
    } catch (e) {
      return res.status(500).json({ error: 'orchestration_decisions_failed' });
    }
  });

  // ============================================================================
  // 5. GET /api/admin/ai/orchestration-metrics (Summary KPIs for Dashboard)
  // ============================================================================
  app.get('/api/admin/ai/orchestration-metrics', adminOnly, async (_req: Request, res: Response) => {
    try {
      if (pool) {
        try {
          const [runsRes, consentRes, insRes, knRes] = await Promise.all([
            pool.query(`SELECT COUNT(*) as total FROM ai_orchestration_runs`),
            pool.query(`SELECT COUNT(*) as consent_count FROM ai_orchestration_runs WHERE consent_web_search = TRUE OR status = 'needs_consent'`),
            pool.query(`SELECT COUNT(*) as insufficient_count FROM ai_orchestration_runs WHERE status = 'insufficient_evidence'`),
            pool.query(`SELECT COUNT(*) as kn_only FROM ai_orchestration_runs WHERE route = 'knowledge_only'`),
          ]);

          const totalRuns = Number(runsRes.rows[0]?.total || 0);
          const consentRequests = Number(consentRes.rows[0]?.consent_count || 0);
          const insufficientEvidence = Number(insRes.rows[0]?.insufficient_count || 0);
          const knowledgeOnly = Number(knRes.rows[0]?.kn_only || 0);

          return res.json({
            ok: true,
            metrics: {
              totalRuns,
              knowledgeOnly,
              consentRequests,
              insufficientEvidence,
              completedRate: totalRuns > 0 ? Math.round(((totalRuns - insufficientEvidence) / totalRuns) * 100) : 100,
            },
          });
        } catch (dbErr) {
          console.warn('[DARB V1.18] DB metrics fallback:', dbErr);
        }
      }

      const totalRuns = memOrchestrationRuns.length;
      const knowledgeOnly = memOrchestrationRuns.filter((r) => r.route === 'knowledge_only').length;
      const consentRequests = memOrchestrationRuns.filter((r) => r.consent_web_search || r.status === 'needs_consent').length;
      const insufficientEvidence = memOrchestrationRuns.filter((r) => r.status === 'insufficient_evidence').length;
      const completed = memOrchestrationRuns.filter((r) => r.status === 'completed').length;

      return res.json({
        ok: true,
        metrics: {
          totalRuns,
          knowledgeOnly,
          consentRequests,
          insufficientEvidence,
          completedRate: totalRuns > 0 ? Math.round((completed / totalRuns) * 100) : 100,
        },
      });
    } catch {
      return res.status(500).json({ error: 'orchestration_metrics_failed' });
    }
  });

  // ============================================================================
  // 6. POST /api/admin/ai/orchestration-runs/simulate (Test Run Simulator)
  // ============================================================================
  app.post('/api/admin/ai/orchestration-runs/simulate', adminOnly, async (req: Request, res: Response) => {
    try {
      const { question, simulateRoute, hasConsent } = req.body || {};
      if (!question) {
        return res.status(400).json({ error: 'question_required' });
      }

      const isKnowledge = simulateRoute === 'knowledge_only';
      const k: EvidenceItem[] = isKnowledge
        ? [
            {
              id: 'kn_sim_1',
              title: 'قاعدة معرفة دَرْب المعتمدة',
              source: 'knowledge',
              trust: 'trusted',
              snippet: 'بيانات موثقة من وزارة وهيئات العمل الرسمية.',
            },
          ]
        : [];

      const w: EvidenceItem[] = !isKnowledge && hasConsent
        ? [
            {
              id: 'web_sim_1',
              title: 'البوابة الرقمية الرسمية',
              url: 'https://gov.example/services',
              source: 'web',
              trust: 'trusted',
              snippet: 'أحدث التحديثات الصادرة.',
            },
          ]
        : [];

      const plan = buildOrchestrationPlan({
        knowledge: k,
        web: w,
        webConsent: Boolean(hasConsent),
        knowledgeSufficient: isKnowledge,
      });

      const newRun: OrchestrationRunRecord = {
        id: nextRunId++,
        conversation_id: 'test_sim_conv',
        user_id: 1,
        question: question.trim(),
        route: plan.route,
        consent_web_search: Boolean(hasConsent),
        knowledge_count: k.length,
        web_count: w.length,
        confidence_level: plan.status === 'completed' ? 'supported' : 'insufficient',
        final_answer: plan.answer || 'تمت الإجابة بناء على الأدلة المجمعة في مسار الاختبار المحاكي.',
        status: plan.status,
        created_at: new Date().toISOString(),
        metadata_json: { simulated: true },
      };

      memOrchestrationRuns.unshift(newRun);

      memOrchestrationSteps.unshift({
        id: nextStepId++,
        run_id: newRun.id,
        step_name: 'simulation_run',
        status: 'completed',
        duration_ms: 18,
        input_count: 1,
        output_count: plan.evidence.length,
        metadata_json: { simulated: true },
        created_at: new Date().toISOString(),
      });

      memOrchestrationDecisions.unshift({
        id: nextDecisionId++,
        run_id: newRun.id,
        decision_type: 'simulation_routing',
        decision_value: plan.route,
        reason: 'تشغيل تجريبي محاكى من قبل المشرف',
        created_at: new Date().toISOString(),
      });

      return res.json({ ok: true, run: newRun, plan, evidence: sourceBadges(plan.evidence) });
    } catch {
      return res.status(500).json({ error: 'simulation_failed' });
    }
  });
}
