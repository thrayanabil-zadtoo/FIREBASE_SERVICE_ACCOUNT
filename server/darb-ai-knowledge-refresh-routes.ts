/**
 * DARB AI V1.22 — AI Knowledge Quality & Refresh Manager Routes
 * 
 * Cumulative, standalone patch over V1.21:
 * - Freshness Classification: fresh (<30d), aging (30-90d), stale (>=90d)
 * - Refresh Queue detection and priority ordering
 * - Update Candidates with evidence, sources, and confidence level
 * - Human-in-the-Loop review: Pending, Approved, Rejected (No auto-publish)
 * - Comprehensive Audit Trail
 * - Resilient dual-mode: PostgreSQL pool with rich in-memory fallback
 */

import type { Express, Request, Response } from "express";
import {
  freshnessStatus,
  priorityForFreshness,
  buildRefreshReason,
  normalizeCandidate,
  canPublish,
  FreshnessStatus,
  Priority
} from "./darb-ai-knowledge-refresh";

export interface RefreshQueueRow {
  id: number;
  knowledge_id: number | null;
  title: string;
  country: string | null;
  city: string | null;
  reason: string;
  freshness_status: FreshnessStatus;
  priority: Priority;
  source_url: string | null;
  detected_at: string;
  status: string;
  age_days: number;
}

export interface CandidateRow {
  id: number;
  refresh_id: number | null;
  knowledge_id: number | null;
  old_content: string;
  proposed_content: string;
  sources_json: any[];
  confidence_level: string;
  review_status: "pending" | "approved" | "rejected";
  reviewer_id: number | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface AuditRow {
  id: number;
  action: string;
  refresh_id: number | null;
  candidate_id: number | null;
  actor_id: number | null;
  actor_name?: string;
  details_json: any;
  created_at: string;
}

// In-memory persistent demo state when database is not connected
const memQueue: RefreshQueueRow[] = [
  {
    id: 1,
    knowledge_id: 101,
    title: "رسوم تجديد إقامة العمل والمقابل المالي للعمالة الوافدة في السعودية",
    country: "SA",
    city: "الرياض",
    reason: "المعلومة قديمة منذ 105 يومًا وتحتاج مراجعة مع القرارات المالية الجديدة",
    freshness_status: "stale",
    priority: "high",
    source_url: "https://www.absher.sa/portal/landing.html",
    detected_at: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString(),
    status: "pending",
    age_days: 105
  },
  {
    id: 2,
    knowledge_id: 102,
    title: "إجراءات تصديق الشهادات الجامعية لمعادلة المؤهل في الإمارات",
    country: "AE",
    city: "أبوظبي",
    reason: "المعلومة تقترب من حد التحديث (45 يومًا) مع تحديث منصة وزارة التربية",
    freshness_status: "aging",
    priority: "normal",
    source_url: "https://www.moe.gov.ae/ar/services/pages/certificate-equalization.aspx",
    detected_at: new Date(Date.now() - 3600 * 1000 * 24 * 4).toISOString(),
    status: "pending",
    age_days: 45
  },
  {
    id: 3,
    knowledge_id: 103,
    title: "شروط الإقامة الذهبية لفئة رواد الأعمال والمستثمرين في دبي",
    country: "AE",
    city: "دبي",
    reason: "المعلومة قديمة منذ 120 يومًا وتوجد لوائح محدثة لمتطلبات رأس المال",
    freshness_status: "stale",
    priority: "critical",
    source_url: "https://gdrfad.gov.ae/ar/services/golden-residency",
    detected_at: new Date(Date.now() - 3600 * 1000 * 24 * 1).toISOString(),
    status: "pending",
    age_days: 120
  },
  {
    id: 4,
    knowledge_id: 104,
    title: "إصدار وتجديد رخصة القيادة المهنية للمقيمين في قطر",
    country: "QA",
    city: "الدوحة",
    reason: "المعلومة تقترب من حد التحديث (38 يومًا) عبر تطبيق مطراش2",
    freshness_status: "aging",
    priority: "normal",
    source_url: "https://portal.moi.gov.qa",
    detected_at: new Date(Date.now() - 3600 * 1000 * 24 * 5).toISOString(),
    status: "pending",
    age_days: 38
  },
  {
    id: 5,
    knowledge_id: 105,
    title: "خطوات توثيق عقود الإيجار السكني في منصة إيجار بالرياض",
    country: "SA",
    city: "الرياض",
    reason: "محدثة مؤخراً قبل 12 يومًا - ضمن النطاق الآمن",
    freshness_status: "fresh",
    priority: "low",
    source_url: "https://www.ejar.sa",
    detected_at: new Date(Date.now() - 3600 * 1000 * 24 * 12).toISOString(),
    status: "resolved",
    age_days: 12
  }
];

const memCandidates: CandidateRow[] = [
  {
    id: 1,
    refresh_id: 1,
    knowledge_id: 101,
    old_content: "رسوم تجديد الإقامة للمقيم العامل 650 ريال سنوياً مع المقابل المالي القديم وفق جدول 2024.",
    proposed_content: "تجديد رخصة الإقامة للعامل المهني 650 ريالاً، بالإضافة إلى سداد المقابل المالي المعتمد عن طريق منصة سداد أو أبشر أعمال، مع سريان التأمين الصحي المعتمد وربطه بمنصة مجلس الضمان الصحي الإلكترونية.",
    sources_json: [
      { name: "منصة أبشر أفراد وأعمال", url: "https://absher.sa", verified: true },
      { name: "مجلس الضمان الصحي", url: "https://cchi.gov.sa", verified: true }
    ],
    confidence_level: "supported",
    review_status: "pending",
    reviewer_id: null,
    reviewed_at: null,
    created_at: new Date(Date.now() - 3600 * 1000 * 18).toISOString()
  },
  {
    id: 2,
    refresh_id: 3,
    knowledge_id: 103,
    old_content: "التقديم على الإقامة الذهبية للمستثمر يتطلب إيداعاً مصرفياً قدره 2 مليون درهم مع متطلبات أوراق سابقة.",
    proposed_content: "تمنح الإقامة الذهبية للمستثمر العقاري عند تملك عقار أو أكثر بقيمة إجمالية لا تقل عن مليوني درهم (سواء نقداً أو بقرض من بنك محلي معتمد)، مع إمكانية شمل الزوجة والأبناء.",
    sources_json: [
      { name: "البوابة الرسمية لحكومة الإمارات", url: "https://u.ae", verified: true },
      { name: "إدارة الإقامة وشؤون الأجانب بدبي", url: "https://gdrfad.gov.ae", verified: true }
    ],
    confidence_level: "supported",
    review_status: "approved",
    reviewer_id: 99,
    reviewed_at: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
    created_at: new Date(Date.now() - 3600 * 1000 * 30).toISOString()
  }
];

const memAudit: AuditRow[] = [
  {
    id: 1,
    action: "detect_queue_batch",
    refresh_id: null,
    candidate_id: null,
    actor_id: 1,
    actor_name: "مدير النظام الآلي (Scheduler)",
    details_json: { items_checked: 24, aging_found: 2, stale_found: 2 },
    created_at: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString()
  },
  {
    id: 2,
    action: "create_candidate",
    refresh_id: 1,
    candidate_id: 1,
    actor_id: 2,
    actor_name: "مشرف المعرفة",
    details_json: { confidence: "supported", sources_count: 2 },
    created_at: new Date(Date.now() - 3600 * 1000 * 18).toISOString()
  },
  {
    id: 3,
    action: "review_approved",
    refresh_id: 3,
    candidate_id: 2,
    actor_id: 99,
    actor_name: "المشرف العام (Admin)",
    details_json: { canPublish: true, note: "تم التحقق ومطابقة اللائحة العقارية المحدثة بدقة." },
    created_at: new Date(Date.now() - 3600 * 1000 * 6).toISOString()
  }
];

export function registerDarbAIKnowledgeRefreshRoutes(app: Express, poolOrOpts?: any) {
  const pool = poolOrOpts?.query ? poolOrOpts : poolOrOpts?.pool;

  const q = async (sql: string, params: any[] = []) => {
    if (!pool?.query) {
      throw new Error("NO_POOL");
    }
    return pool.query(sql, params);
  };

  /**
   * GET /api/admin/ai/knowledge-refresh/summary
   */
  app.get("/api/admin/ai/knowledge-refresh/summary", async (_req: Request, res: Response) => {
    try {
      const result = await q(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status='pending')::int AS pending,
          COUNT(*) FILTER (WHERE priority IN ('high','critical'))::int AS high_priority,
          COUNT(*) FILTER (WHERE freshness_status='fresh')::int AS fresh_count,
          COUNT(*) FILTER (WHERE freshness_status='aging')::int AS aging_count,
          COUNT(*) FILTER (WHERE freshness_status='stale')::int AS stale_count
        FROM ai_knowledge_refresh_queue
      `);
      const row = result.rows?.[0] || {};
      return res.json({
        ok: true,
        summary: {
          total: row.total ?? 0,
          pending: row.pending ?? 0,
          high_priority: row.high_priority ?? 0,
          fresh: row.fresh_count ?? 0,
          aging: row.aging_count ?? 0,
          stale: row.stale_count ?? 0,
          pending_reviews: 0
        },
        mode: "postgres"
      });
    } catch {
      // Memory fallback
      const total = memQueue.length;
      const pending = memQueue.filter(x => x.status === "pending").length;
      const high_priority = memQueue.filter(x => ["high", "critical"].includes(x.priority)).length;
      const fresh = memQueue.filter(x => x.freshness_status === "fresh").length;
      const aging = memQueue.filter(x => x.freshness_status === "aging").length;
      const stale = memQueue.filter(x => x.freshness_status === "stale").length;
      const pending_reviews = memCandidates.filter(c => c.review_status === "pending").length;

      return res.json({
        ok: true,
        summary: {
          total,
          pending,
          high_priority,
          fresh,
          aging,
          stale,
          pending_reviews
        },
        mode: "memory"
      });
    }
  });

  /**
   * GET /api/admin/ai/knowledge-refresh/queue
   */
  app.get("/api/admin/ai/knowledge-refresh/queue", async (req: Request, res: Response) => {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const filterStatus = req.query.status as string | undefined;

    try {
      let querySql = `
        SELECT * FROM ai_knowledge_refresh_queue
      `;
      const params: any[] = [];
      if (filterStatus && filterStatus !== "all") {
        querySql += ` WHERE status = $1`;
        params.push(filterStatus);
      }
      querySql += ` ORDER BY
        CASE priority WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END,
        detected_at ASC LIMIT $${params.length + 1}`;
      params.push(limit);

      const result = await q(querySql, params);
      return res.json({ ok: true, items: result.rows ?? [], mode: "postgres" });
    } catch {
      let items = [...memQueue];
      if (filterStatus && filterStatus !== "all") {
        items = items.filter(x => x.status === filterStatus);
      }
      items.sort((a, b) => {
        const pOrder: Record<string, number> = { critical: 0, high: 1, normal: 2, low: 3 };
        return (pOrder[a.priority] ?? 2) - (pOrder[b.priority] ?? 2);
      });
      return res.json({ ok: true, items: items.slice(0, limit), mode: "memory" });
    }
  });

  /**
   * POST /api/admin/ai/knowledge-refresh/detect
   * Scan items or add simulated sample scan items to refresh queue
   */
  app.post("/api/admin/ai/knowledge-refresh/detect", async (req: Request, res: Response) => {
    let items = Array.isArray(req.body?.items) ? req.body.items : [];

    // If empty payload, perform intelligent scan of default items
    if (items.length === 0) {
      items = [
        {
          knowledgeId: 106,
          title: "شروط استقدام العمالة المنزلية والرسوم الحكومية في الكويت",
          country: "KW",
          city: "مدينة الكويت",
          ageDays: 95,
          sourceUrl: "https://e.gov.kw"
        },
        {
          knowledgeId: 107,
          title: "بوابة تراخيص العمل والمستندات المطلوبة في سلطنة عمان",
          country: "OM",
          city: "مسقط",
          ageDays: 42,
          sourceUrl: "https://www.mol.gov.om"
        }
      ];
    }

    const output: any[] = [];

    for (const item of items) {
      const ageDays = Math.max(0, Number(item.ageDays) || 0);
      const status = freshnessStatus(ageDays);
      if (status === "fresh" && !req.body?.includeFresh) continue;

      const row = {
        knowledge_id: item.knowledgeId ?? null,
        title: String(item.title ?? "Untitled"),
        country: item.country ?? null,
        city: item.city ?? null,
        reason: buildRefreshReason(status, ageDays),
        freshness_status: status,
        priority: priorityForFreshness(status),
        source_url: item.sourceUrl ?? null,
        detected_at: new Date().toISOString(),
        status: "pending",
        age_days: ageDays
      };

      try {
        const insertRes = await q(
          `INSERT INTO ai_knowledge_refresh_queue
          (knowledge_id, title, country, city, reason, freshness_status, priority, source_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [row.knowledge_id, row.title, row.country, row.city, row.reason, row.freshness_status, row.priority, row.source_url]
        );
        output.push(insertRes.rows?.[0] || row);
      } catch {
        // Fallback in-memory
        const newId = (memQueue[memQueue.length - 1]?.id || 0) + 1;
        const memoryRow: RefreshQueueRow = { id: newId, ...row };
        memQueue.unshift(memoryRow);
        output.push(memoryRow);
      }
    }

    // Record audit event
    const auditEntry: AuditRow = {
      id: memAudit.length + 1,
      action: "detect_refresh_scan",
      refresh_id: null,
      candidate_id: null,
      actor_id: req.body?.actorId || 1,
      actor_name: "فاحص دورة حياة المعرفة",
      details_json: { detected_count: output.length },
      created_at: new Date().toISOString()
    };

    try {
      await q(
        `INSERT INTO ai_knowledge_refresh_audit (action, actor_id, details_json) VALUES ($1, $2, $3)`,
        [auditEntry.action, auditEntry.actor_id, JSON.stringify(auditEntry.details_json)]
      );
    } catch {
      memAudit.unshift(auditEntry);
    }

    return res.json({ ok: true, detected: output.length, items: output });
  });

  /**
   * GET /api/admin/ai/knowledge-refresh/candidates
   */
  app.get("/api/admin/ai/knowledge-refresh/candidates", async (req: Request, res: Response) => {
    const statusFilter = req.query.status as string | undefined;

    try {
      let querySql = `SELECT * FROM ai_knowledge_update_candidates`;
      const params: any[] = [];
      if (statusFilter && statusFilter !== "all") {
        querySql += ` WHERE review_status = $1`;
        params.push(statusFilter);
      }
      querySql += ` ORDER BY created_at DESC LIMIT 200`;

      const result = await q(querySql, params);
      return res.json({ ok: true, items: result.rows ?? [], mode: "postgres" });
    } catch {
      let candidates = [...memCandidates];
      if (statusFilter && statusFilter !== "all") {
        candidates = candidates.filter(c => c.review_status === statusFilter);
      }
      return res.json({ ok: true, items: candidates, mode: "memory" });
    }
  });

  /**
   * POST /api/admin/ai/knowledge-refresh/candidates
   */
  app.post("/api/admin/ai/knowledge-refresh/candidates", async (req: Request, res: Response) => {
    if (!req.body?.proposedContent?.trim()) {
      return res.status(400).json({ ok: false, error: "proposedContent is required" });
    }

    const candidate = normalizeCandidate(req.body);
    const refreshId = req.body.refreshId ? Number(req.body.refreshId) : null;

    try {
      const result = await q(
        `INSERT INTO ai_knowledge_update_candidates
        (refresh_id, knowledge_id, old_content, proposed_content, sources_json, confidence_level)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          refreshId,
          candidate.knowledge_id,
          candidate.old_content,
          candidate.proposed_content,
          JSON.stringify(candidate.sources_json),
          candidate.confidence_level
        ]
      );
      const inserted = result.rows?.[0] ?? candidate;

      // Update refresh queue item status if associated
      if (refreshId) {
        await q(`UPDATE ai_knowledge_refresh_queue SET status='candidate_created' WHERE id=$1`, [refreshId]);
      }

      await q(
        `INSERT INTO ai_knowledge_refresh_audit (action, refresh_id, candidate_id, actor_id, details_json)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          "create_candidate",
          refreshId,
          inserted.id ?? null,
          req.body.actorId ?? 1,
          JSON.stringify({ confidence: candidate.confidence_level })
        ]
      );

      return res.json({ ok: true, candidate: inserted, mode: "postgres" });
    } catch {
      // Memory fallback
      const newId = (memCandidates[0]?.id || 0) + 1;
      const memRow: CandidateRow = {
        id: newId,
        refresh_id: refreshId,
        knowledge_id: candidate.knowledge_id,
        old_content: candidate.old_content,
        proposed_content: candidate.proposed_content,
        sources_json: candidate.sources_json,
        confidence_level: candidate.confidence_level,
        review_status: "pending",
        reviewer_id: null,
        reviewed_at: null,
        created_at: new Date().toISOString()
      };
      memCandidates.unshift(memRow);

      if (refreshId) {
        const qItem = memQueue.find(q => q.id === refreshId);
        if (qItem) qItem.status = "candidate_created";
      }

      const auditRow: AuditRow = {
        id: memAudit.length + 1,
        action: "create_candidate",
        refresh_id: refreshId,
        candidate_id: newId,
        actor_id: req.body.actorId ?? 1,
        actor_name: "مشرف المعرفة",
        details_json: { confidence: candidate.confidence_level },
        created_at: new Date().toISOString()
      };
      memAudit.unshift(auditRow);

      return res.json({ ok: true, candidate: memRow, mode: "memory" });
    }
  });

  /**
   * POST /api/admin/ai/knowledge-refresh/review
   * Strictly human approval or rejection (Auto Publish = false enforced)
   */
  app.post("/api/admin/ai/knowledge-refresh/review", async (req: Request, res: Response) => {
    const id = Number(req.body?.candidateId);
    const status = String(req.body?.reviewStatus ?? "pending");
    const reviewerId = req.body?.reviewerId ? Number(req.body.reviewerId) : 99;
    const reviewerName = req.body?.reviewerName || "مشرف الجودة";
    const note = req.body?.note || "";

    if (!id || !["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ ok: false, error: "Invalid review request: candidateId and reviewStatus required" });
    }

    const publishable = canPublish(status);

    try {
      await q(
        `UPDATE ai_knowledge_update_candidates
         SET review_status=$1, reviewer_id=$2, reviewed_at=NOW() WHERE id=$3`,
        [status, reviewerId, id]
      );

      await q(
        `INSERT INTO ai_knowledge_refresh_audit
         (action, candidate_id, actor_id, details_json) VALUES ($1, $2, $3, $4)`,
        [
          `review_${status}`,
          id,
          reviewerId,
          JSON.stringify({ canPublish: publishable, note })
        ]
      );

      return res.json({
        ok: true,
        candidateId: id,
        reviewStatus: status,
        publishable,
        mode: "postgres"
      });
    } catch {
      // Memory fallback
      const cand = memCandidates.find(c => c.id === id);
      if (cand) {
        cand.review_status = status as any;
        cand.reviewer_id = reviewerId;
        cand.reviewed_at = new Date().toISOString();
      }

      const auditRow: AuditRow = {
        id: memAudit.length + 1,
        action: `review_${status}`,
        refresh_id: cand?.refresh_id ?? null,
        candidate_id: id,
        actor_id: reviewerId,
        actor_name: reviewerName,
        details_json: { canPublish: publishable, note },
        created_at: new Date().toISOString()
      };
      memAudit.unshift(auditRow);

      return res.json({
        ok: true,
        candidateId: id,
        reviewStatus: status,
        publishable,
        mode: "memory"
      });
    }
  });

  /**
   * GET /api/admin/ai/knowledge-refresh/audit
   */
  app.get("/api/admin/ai/knowledge-refresh/audit", async (req: Request, res: Response) => {
    const limit = Math.min(Number(req.query.limit) || 100, 200);

    try {
      const result = await q(
        `SELECT * FROM ai_knowledge_refresh_audit ORDER BY created_at DESC LIMIT $1`,
        [limit]
      );
      return res.json({ ok: true, items: result.rows ?? [], mode: "postgres" });
    } catch {
      return res.json({ ok: true, items: memAudit.slice(0, limit), mode: "memory" });
    }
  });
}
