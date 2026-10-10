import type { Express, Request, Response } from 'express';
import express from 'express';
import {
  OPTIMIZATION_GOVERNANCE,
  createOptimizationCorrelationId,
  efficiencyScore,
  savingsEstimate,
  burnRate,
  reviewDecisionAllowed,
  recommendationStatus
} from './darb-ai-optimization-manager';

export interface OptimizationRecommendationRecord {
  id: number | string;
  environment: string;
  category: string;
  title: string;
  description: string;
  estimated_savings: number;
  estimated_savings_percent: number;
  risk_level: 'low' | 'medium' | 'high';
  status: 'pending_review' | 'approved_for_manual_action' | 'rejected' | 'deferred';
  correlation_id: string;
  evidence_metrics?: any;
  created_at: string;
  updated_at: string;
}

export interface OptimizationReviewRecord {
  id: number | string;
  recommendation_id: number | string;
  decision: 'approve' | 'reject' | 'defer';
  actor: string;
  reason: string;
  correlation_id: string;
  created_at: string;
}

export interface OptimizationSnapshotRecord {
  id: number | string;
  environment: string;
  provider: string;
  model: string;
  requests: number;
  input_tokens: number;
  output_tokens: number;
  estimated_cost: number;
  efficiency_score: number;
  created_at: string;
}

export interface OptimizationAuditRecord {
  id: number | string;
  action: string;
  actor: string;
  recommendation_id?: number | string | null;
  correlation_id: string;
  reason?: string;
  created_at: string;
}

// In-Memory Seed Data Fallback
const memoryRecommendations: OptimizationRecommendationRecord[] = [
  {
    id: 1,
    environment: 'production',
    category: 'prompt_caching',
    title: 'تفعيل التخزين المؤقت للسياق (Context Caching) لدليل التأشيرات واللوائح',
    description: 'إعادة استخدام التضمينات والسياق النظامي الثابت المكرر في استعلامات الهجرة وتأشيرات الإقامة، مما يوفر 65% من تكاليف قراءة الرموز المتكررة.',
    estimated_savings: 0.85,
    estimated_savings_percent: 32.5,
    risk_level: 'low',
    status: 'pending_review',
    correlation_id: 'OPT-INIT-001',
    evidence_metrics: {
      currentTpm: 120000,
      potentialTpm: 54000,
      tokenReduction: 1250000,
      latencyImpactMs: -350,
      observedModel: 'gemini-1.5-flash',
      cacheHitRatioPotential: 0.72,
      notes: 'السياق الثابت للأنظمة يمثل 1,800 رمز في كل طلب.'
    },
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 2,
    environment: 'production',
    category: 'model_rightsizing',
    title: 'تخفيض فئة النموذج لاستعلامات التحقق البسيطة وتحديد الحالات',
    description: 'توجيه استعلامات التصنيف وتحديث الحالة وحساب رسوم المغتربين البسيطة إلى نموذج أخف كفاءة بدلاً من النموذج الشامل.',
    estimated_savings: 0.55,
    estimated_savings_percent: 21.0,
    risk_level: 'low',
    status: 'approved_for_manual_action',
    correlation_id: 'OPT-INIT-002',
    evidence_metrics: {
      currentTpm: 45000,
      potentialTpm: 22000,
      tokenReduction: 480000,
      latencyImpactMs: -180,
      observedModel: 'gemini-1.5-pro',
      alternativeModel: 'gemini-1.5-flash',
      notes: '78% من استفسارات الحالة لا تحتاج إلى تفكير عميق.'
    },
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 3,
    environment: 'staging',
    category: 'context_compression',
    title: 'ضغط وتلخيص سجل المحادثة قبل التمرير لوكيل التوجيه',
    description: 'قص رسائل المحادثة الأقدم من 6 تفاعلات وتمرير ملخص مدمج لتقليل رموز الإدخال (Input Tokens) بنسبة 40%.',
    estimated_savings: 0.38,
    estimated_savings_percent: 14.5,
    risk_level: 'medium',
    status: 'pending_review',
    correlation_id: 'OPT-INIT-003',
    evidence_metrics: {
      currentTpm: 32000,
      potentialTpm: 19000,
      tokenReduction: 320000,
      latencyImpactMs: -120,
      observedModel: 'gemini-1.5-flash',
      notes: 'المحادثات الطويلة تتراكم فيها رموز التوجيه غير الضرورية.'
    },
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 4,
    environment: 'production',
    category: 'batching',
    title: 'تجميع مهام التقييم وتحليل جودة المعرفة في دفعات مسائية (Batch API)',
    description: 'تنفيذ مجموعات اختبارات الانحدار ومراجعة مصادر المعرفة المجدولة في غير ساعات الذروة عبر واجهة Batch API بتخفيض 50% على التسعيرة.',
    estimated_savings: 0.42,
    estimated_savings_percent: 16.0,
    risk_level: 'low',
    status: 'pending_review',
    correlation_id: 'OPT-INIT-004',
    evidence_metrics: {
      currentTpm: 60000,
      potentialTpm: 30000,
      tokenReduction: 850000,
      latencyImpactMs: 0,
      observedModel: 'gemini-1.5-flash',
      notes: 'وظائف التقييم غير فورية وتتحمل جدولة دفعات ليلية.'
    },
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

const memoryReviews: OptimizationReviewRecord[] = [
  {
    id: 1,
    recommendation_id: 2,
    decision: 'approve',
    actor: 'admin@darb.app',
    reason: 'تم اختبار التحويل لنموذج flash وتبين الحفاظ على دقة 99.4% مع انخفاض ملحوظ في التكلفة والزمن.',
    correlation_id: 'OPT-REV-001',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

const memorySnapshots: OptimizationSnapshotRecord[] = [
  {
    id: 1,
    environment: 'production',
    provider: 'google',
    model: 'gemini-1.5-flash',
    requests: 2150,
    input_tokens: 1840000,
    output_tokens: 610000,
    estimated_cost: 1.48,
    efficiency_score: 0.412,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 2,
    environment: 'production',
    provider: 'google',
    model: 'gemini-1.5-pro',
    requests: 260,
    input_tokens: 447000,
    output_tokens: 172000,
    estimated_cost: 0.71,
    efficiency_score: 0.185,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 3,
    environment: 'staging',
    provider: 'google',
    model: 'gemini-1.5-flash',
    requests: 380,
    input_tokens: 310000,
    output_tokens: 95000,
    estimated_cost: 0.22,
    efficiency_score: 0.448,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

const memoryAudit: OptimizationAuditRecord[] = [
  {
    id: 1,
    action: 'recommendation_created',
    actor: 'system_optimizer',
    recommendation_id: 1,
    correlation_id: 'OPT-INIT-001',
    reason: 'تحليل الاستهلاك رصد تكرار السياق الثابت بنسبة 72%.',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 2,
    action: 'recommendation_created',
    actor: 'system_optimizer',
    recommendation_id: 2,
    correlation_id: 'OPT-INIT-002',
    reason: 'تم رصد استخدام نموذج شامل لمهام استعلام بسيطة.',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 3,
    action: 'human_review_approval',
    actor: 'admin@darb.app',
    recommendation_id: 2,
    correlation_id: 'OPT-REV-001',
    reason: 'موافقة المسؤول على البدء بالتعديل اليدوي لاختبار النموذج.',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

export function registerDarbAiOptimizationRoutes(
  app: Express,
  options?: { pool?: any; isAdmin?: (req: Request) => boolean | Promise<boolean> }
) {
  const router = express.Router();
  const pool = options?.pool;

  // DB Query Helper
  const queryDb = async (sql: string, params: any[] = []) => {
    if (!pool) return null;
    try {
      const res = await pool.query(sql, params);
      return res.rows;
    } catch (err) {
      return null;
    }
  };

  const initTables = async () => {
    if (!pool) return;
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS ai_optimization_recommendations (
          id BIGSERIAL PRIMARY KEY,
          environment VARCHAR(30) NOT NULL DEFAULT 'production',
          category VARCHAR(50) NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          estimated_savings NUMERIC(18,8) NOT NULL DEFAULT 0,
          estimated_savings_percent NUMERIC(8,3) NOT NULL DEFAULT 0,
          risk_level VARCHAR(20) NOT NULL DEFAULT 'medium',
          status VARCHAR(30) NOT NULL DEFAULT 'pending_review',
          correlation_id VARCHAR(120),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS ai_optimization_reviews (
          id BIGSERIAL PRIMARY KEY,
          recommendation_id BIGINT NOT NULL,
          decision VARCHAR(30) NOT NULL,
          actor VARCHAR(160) NOT NULL,
          reason TEXT NOT NULL,
          correlation_id VARCHAR(120),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS ai_optimization_snapshots (
          id BIGSERIAL PRIMARY KEY,
          environment VARCHAR(30) NOT NULL,
          provider VARCHAR(120),
          model VARCHAR(160),
          requests BIGINT NOT NULL DEFAULT 0,
          input_tokens BIGINT NOT NULL DEFAULT 0,
          output_tokens BIGINT NOT NULL DEFAULT 0,
          estimated_cost NUMERIC(18,8) NOT NULL DEFAULT 0,
          efficiency_score NUMERIC(8,3),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS ai_optimization_audit (
          id BIGSERIAL PRIMARY KEY,
          action VARCHAR(80) NOT NULL,
          actor VARCHAR(160),
          recommendation_id BIGINT,
          correlation_id VARCHAR(120),
          reason TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
    } catch (e) {
      console.warn('[DarbAIOptimization] Table init skipped or failed:', (e as any)?.message);
    }
  };

  initTables().catch(() => {});

  // Auth Middleware
  const requireAdmin = async (req: Request, res: Response, next: () => void) => {
    if (options?.isAdmin) {
      const allowed = await options.isAdmin(req);
      if (!allowed) {
        return res.status(403).json({
          ok: false,
          error: 'Forbidden: Admin authorization required for AI optimization governance.'
        });
      }
    }
    next();
  };

  // 1. GET /summary
  router.get('/summary', async (req, res) => {
    const correlationId = createOptimizationCorrelationId('OPT-SUM');
    const env = (req.query.environment as string) || 'all';

    let recs: OptimizationRecommendationRecord[] = memoryRecommendations;
    const dbRecs = await queryDb('SELECT * FROM ai_optimization_recommendations ORDER BY id DESC');
    if (dbRecs && dbRecs.length > 0) {
      recs = dbRecs;
    }

    if (env !== 'all') {
      recs = recs.filter((r) => r.environment === env);
    }

    const pending = recs.filter((r) => r.status === 'pending_review').length;
    const approved = recs.filter((r) => r.status === 'approved_for_manual_action').length;
    const rejected = recs.filter((r) => r.status === 'rejected').length;
    const deferred = recs.filter((r) => r.status === 'deferred').length;

    const totalSavings = Number(
      recs.reduce((acc, r) => acc + Number(r.estimated_savings || 0), 0).toFixed(4)
    );
    const avgSavingsPercent = recs.length
      ? Number(
          (
            recs.reduce((acc, r) => acc + Number(r.estimated_savings_percent || 0), 0) /
            recs.length
          ).toFixed(2)
        )
      : 0;

    // Snapshot aggregations
    let snapshots: OptimizationSnapshotRecord[] = memorySnapshots;
    const dbSnaps = await queryDb('SELECT * FROM ai_optimization_snapshots ORDER BY id DESC');
    if (dbSnaps && dbSnaps.length > 0) {
      snapshots = dbSnaps;
    }

    const totalReqs = snapshots.reduce((acc, s) => acc + Number(s.requests || 0), 0);
    const totalInTokens = snapshots.reduce((acc, s) => acc + Number(s.input_tokens || 0), 0);
    const totalOutTokens = snapshots.reduce((acc, s) => acc + Number(s.output_tokens || 0), 0);
    const totalCost = Number(
      snapshots.reduce((acc, s) => acc + Number(s.estimated_cost || 0), 0).toFixed(4)
    );

    const overallScore = efficiencyScore(totalReqs, totalInTokens, totalOutTokens, totalCost);
    // Calculated month burn-rate (e.g. 20 days elapsed out of 30)
    const elapsedPercent = 66.6;
    const currentBurnRate = burnRate(totalCost, elapsedPercent);

    res.json({
      ok: true,
      governance: OPTIMIZATION_GOVERNANCE,
      correlationId,
      summary: {
        pendingReviews: pending,
        approvedForManualAction: approved,
        rejected,
        deferred,
        totalRecommendations: recs.length,
        estimatedSavings: totalSavings,
        estimatedSavingsPercent: avgSavingsPercent,
        overallEfficiencyScore: overallScore,
        totalInputTokens: totalInTokens,
        totalOutputTokens: totalOutTokens,
        totalRequests: totalReqs,
        currentMonthSpend: totalCost,
        burnRate: currentBurnRate
      }
    });
  });

  // 2. GET /recommendations
  router.get('/recommendations', async (req, res) => {
    const env = (req.query.environment as string) || 'all';
    const status = req.query.status as string;
    const category = req.query.category as string;

    let items: OptimizationRecommendationRecord[] = memoryRecommendations;
    const dbRecs = await queryDb('SELECT * FROM ai_optimization_recommendations ORDER BY id DESC');
    if (dbRecs && dbRecs.length > 0) {
      items = dbRecs;
    }

    if (env !== 'all') {
      items = items.filter((i) => i.environment === env);
    }
    if (status && status !== 'all') {
      items = items.filter((i) => i.status === status);
    }
    if (category && category !== 'all') {
      items = items.filter((i) => i.category === category);
    }

    res.json({
      ok: true,
      governance: OPTIMIZATION_GOVERNANCE,
      items: items.map((r) => ({
        id: r.id,
        environment: r.environment,
        category: r.category,
        title: r.title,
        description: r.description,
        estimatedSavings: Number(r.estimated_savings),
        estimatedSavingsPercent: Number(r.estimated_savings_percent),
        riskLevel: r.risk_level,
        status: r.status,
        correlationId: r.correlation_id,
        evidenceMetrics: r.evidence_metrics,
        createdAt: r.created_at,
        updatedAt: r.updated_at
      }))
    });
  });

  // 3. POST /recommendations
  router.post('/recommendations', requireAdmin, async (req, res) => {
    const b = req.body || {};
    const correlationId = createOptimizationCorrelationId('OPT-REC');

    const environment = b.environment || 'production';
    const category = b.category || 'cost';
    const title = b.title || 'Optimization recommendation';
    const description = b.description || '';
    const estimatedSavings = Number(b.estimatedSavings || b.estimated_savings || 0);
    const estimatedSavingsPercent = Number(b.estimatedSavingsPercent || b.estimated_savings_percent || 10);
    const riskLevel = ['low', 'medium', 'high'].includes(b.riskLevel) ? b.riskLevel : 'low';
    const evidenceMetrics = b.evidenceMetrics || b.evidence_metrics || {};

    const newRec: OptimizationRecommendationRecord = {
      id: memoryRecommendations.length + 1,
      environment,
      category,
      title,
      description,
      estimated_savings: estimatedSavings,
      estimated_savings_percent: estimatedSavingsPercent,
      risk_level: riskLevel,
      status: 'pending_review',
      correlation_id: correlationId,
      evidence_metrics: evidenceMetrics,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const dbInsert = await queryDb(
      `INSERT INTO ai_optimization_recommendations
       (environment, category, title, description, estimated_savings, estimated_savings_percent, risk_level, status, correlation_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending_review', $8, NOW(), NOW())
       RETURNING *`,
      [
        environment,
        category,
        title,
        description,
        estimatedSavings,
        estimatedSavingsPercent,
        riskLevel,
        correlationId
      ]
    );

    if (dbInsert && dbInsert.length > 0) {
      newRec.id = dbInsert[0].id;
    } else {
      memoryRecommendations.unshift(newRec);
    }

    // Add audit entry
    await queryDb(
      `INSERT INTO ai_optimization_audit (action, actor, recommendation_id, correlation_id, reason, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      ['recommendation_created', b.actor || 'manual_entry', newRec.id, correlationId, title]
    );
    memoryAudit.unshift({
      id: memoryAudit.length + 1,
      action: 'recommendation_created',
      actor: b.actor || 'manual_entry',
      recommendation_id: newRec.id,
      correlation_id: correlationId,
      reason: title,
      created_at: new Date().toISOString()
    });

    res.status(201).json({
      ok: true,
      governance: OPTIMIZATION_GOVERNANCE,
      recommendation: {
        id: newRec.id,
        environment: newRec.environment,
        category: newRec.category,
        title: newRec.title,
        description: newRec.description,
        estimatedSavings: newRec.estimated_savings,
        estimatedSavingsPercent: newRec.estimated_savings_percent,
        riskLevel: newRec.risk_level,
        status: newRec.status,
        correlationId: newRec.correlation_id,
        evidenceMetrics: newRec.evidence_metrics
      }
    });
  });

  // 4. POST /recommendations/:id/review
  router.post('/recommendations/:id/review', requireAdmin, async (req, res) => {
    const b = req.body || {};
    const recId = req.params.id;

    if (!reviewDecisionAllowed(b.actor, b.reason)) {
      return res.status(400).json({
        ok: false,
        error: 'actor and reason are required for human review approval'
      });
    }

    const decision: 'approve' | 'reject' | 'defer' = ['approve', 'reject', 'defer'].includes(b.decision)
      ? b.decision
      : 'defer';

    const newStatus = recommendationStatus(decision);
    const correlationId = createOptimizationCorrelationId('OPT-REV');

    // Update in DB or memory
    const updatedDb = await queryDb(
      `UPDATE ai_optimization_recommendations
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [newStatus, recId]
    );

    const memTarget = memoryRecommendations.find((r) => String(r.id) === String(recId));
    if (memTarget) {
      memTarget.status = newStatus;
      memTarget.updated_at = new Date().toISOString();
    }

    // Insert Review
    await queryDb(
      `INSERT INTO ai_optimization_reviews (recommendation_id, decision, actor, reason, correlation_id, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [recId, decision, b.actor, b.reason, correlationId]
    );
    memoryReviews.unshift({
      id: memoryReviews.length + 1,
      recommendation_id: recId,
      decision,
      actor: b.actor,
      reason: b.reason,
      correlation_id: correlationId,
      created_at: new Date().toISOString()
    });

    // Insert Audit
    await queryDb(
      `INSERT INTO ai_optimization_audit (action, actor, recommendation_id, correlation_id, reason, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [`recommendation_${decision}`, b.actor, recId, correlationId, b.reason]
    );
    memoryAudit.unshift({
      id: memoryAudit.length + 1,
      action: `recommendation_${decision}`,
      actor: b.actor,
      recommendation_id: recId,
      correlation_id: correlationId,
      reason: b.reason,
      created_at: new Date().toISOString()
    });

    res.json({
      ok: true,
      governance: OPTIMIZATION_GOVERNANCE,
      status: newStatus,
      actor: b.actor,
      reason: b.reason,
      correlationId,
      notice: 'Approved recommendation authorizes separate manual action only. No automated execution performed.'
    });
  });

  // 5. POST /efficiency/evaluate
  router.post('/efficiency/evaluate', async (req, res) => {
    const b = req.body || {};
    const score = efficiencyScore(
      Number(b.requests || 0),
      Number(b.inputTokens || 0),
      Number(b.outputTokens || 0),
      Number(b.cost || 0)
    );
    res.json({
      ok: true,
      score,
      correlationId: createOptimizationCorrelationId('OPT-EFF')
    });
  });

  // 6. POST /savings/estimate
  router.post('/savings/estimate', async (req, res) => {
    const b = req.body || {};
    const result = savingsEstimate(
      Number(b.currentCost || 0),
      Number(b.targetPercent || 0)
    );
    res.json({
      ok: true,
      result,
      correlationId: createOptimizationCorrelationId('OPT-SAV')
    });
  });

  // 7. POST /burn-rate
  router.post('/burn-rate', async (req, res) => {
    const b = req.body || {};
    const rate = burnRate(
      Number(b.spent || 0),
      Number(b.elapsedPercent || 0)
    );
    res.json({
      ok: true,
      burnRate: rate,
      correlationId: createOptimizationCorrelationId('OPT-BRN')
    });
  });

  // 8. GET /snapshots
  router.get('/snapshots', async (req, res) => {
    const env = (req.query.environment as string) || 'all';

    let snapshots: OptimizationSnapshotRecord[] = memorySnapshots;
    const dbSnaps = await queryDb('SELECT * FROM ai_optimization_snapshots ORDER BY id DESC');
    if (dbSnaps && dbSnaps.length > 0) {
      snapshots = dbSnaps;
    }

    if (env !== 'all') {
      snapshots = snapshots.filter((s) => s.environment === env);
    }

    res.json({
      ok: true,
      governance: OPTIMIZATION_GOVERNANCE,
      items: snapshots.map((s) => ({
        id: s.id,
        environment: s.environment,
        provider: s.provider,
        model: s.model,
        requests: Number(s.requests),
        inputTokens: Number(s.input_tokens),
        outputTokens: Number(s.output_tokens),
        estimatedCost: Number(s.estimated_cost),
        efficiencyScore: Number(s.efficiency_score),
        createdAt: s.created_at
      }))
    });
  });

  // 9. GET /audit
  router.get('/audit', async (_req, res) => {
    let auditList: OptimizationAuditRecord[] = memoryAudit;
    const dbAudit = await queryDb('SELECT * FROM ai_optimization_audit ORDER BY id DESC LIMIT 100');
    if (dbAudit && dbAudit.length > 0) {
      auditList = dbAudit;
    }

    res.json({
      ok: true,
      governance: OPTIMIZATION_GOVERNANCE,
      items: auditList.map((a) => ({
        id: a.id,
        action: a.action,
        actor: a.actor,
        recommendationId: a.recommendation_id,
        correlationId: a.correlation_id,
        reason: a.reason,
        createdAt: a.created_at
      }))
    });
  });

  // 10. GET /reviews
  router.get('/reviews', async (_req, res) => {
    let reviewList: OptimizationReviewRecord[] = memoryReviews;
    const dbReviews = await queryDb('SELECT * FROM ai_optimization_reviews ORDER BY id DESC LIMIT 100');
    if (dbReviews && dbReviews.length > 0) {
      reviewList = dbReviews;
    }

    res.json({
      ok: true,
      governance: OPTIMIZATION_GOVERNANCE,
      items: reviewList.map((r) => ({
        id: r.id,
        recommendationId: r.recommendation_id,
        decision: r.decision,
        actor: r.actor,
        reason: r.reason,
        correlationId: r.correlation_id,
        createdAt: r.created_at
      }))
    });
  });

  app.use('/api/admin/ai/optimization', router);
}
