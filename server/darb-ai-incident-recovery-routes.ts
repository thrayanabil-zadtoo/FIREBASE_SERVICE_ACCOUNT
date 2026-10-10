import type { Express, Request, Response } from "express";
import {
  GOVERNANCE,
  createIncidentCorrelationId,
  calculateMtta,
  calculateMttr,
  canExecuteRecovery,
  validateClosure,
  buildRecoveryPlan,
  IncidentStatus,
  IncidentSeverity
} from "./darb-ai-incident-recovery-manager";

interface InMemIncident {
  id: number;
  incident_key: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  environment: string;
  owner: string | null;
  alert_id: number | null;
  correlation_id: string;
  slo_policy_id: number | null;
  active_version_id: number | null;
  detected_at: string;
  acknowledged_at: string | null;
  mitigated_at: string | null;
  resolved_at: string | null;
  closed_at: string | null;
  root_cause: string | null;
  remediation_actions: string | null;
  created_at: string;
  updated_at: string;
}

interface InMemIncidentEvent {
  id: number;
  incident_id: number;
  event_type: string;
  actor: string;
  note: string;
  correlation_id: string;
  created_at: string;
}

interface InMemRecoveryPlan {
  id: number;
  incident_id: number;
  title: string;
  steps_json: Array<{ order: number; description: string; executionMode: "human_approved" }>;
  risk_level: "low" | "medium" | "high";
  status: "draft" | "pending_approval" | "approved" | "executed" | "cancelled";
  approval_required: boolean;
  approved_by: string | null;
  approved_at: string | null;
  executed_by: string | null;
  executed_at: string | null;
  execution_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface InMemIncidentAudit {
  id: number;
  incident_id: number | null;
  recovery_plan_id: number | null;
  action: string;
  actor: string;
  reason: string;
  correlation_id: string;
  created_at: string;
}

interface InMemPostIncidentReview {
  id: number;
  incident_id: number;
  summary: string;
  root_cause: string;
  contributing_factors: string;
  remediation_actions: string;
  prevention_actions: string;
  owner: string;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

// Initial In-Memory State for DARB AI Incident & Recovery
const inMemoryIncidents: InMemIncident[] = [
  {
    id: 1,
    incident_key: "INC-2026-001",
    title: "ارتفاع زمن استجابة الاستدلال (P95 Latency Spike) في بيئة الإنتاج",
    severity: "warning",
    status: "investigating",
    environment: "production",
    owner: "فريق الموثوقية والذكاء الاصطناعي (SRE)",
    alert_id: 1,
    correlation_id: "INC-1789804001-A9F21B",
    slo_policy_id: 2,
    active_version_id: 1,
    detected_at: new Date(Date.now() - 45 * 60000).toISOString(),
    acknowledged_at: new Date(Date.now() - 38 * 60000).toISOString(),
    mitigated_at: null,
    resolved_at: null,
    closed_at: null,
    root_cause: null,
    remediation_actions: null,
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 38 * 60000).toISOString(),
  },
  {
    id: 2,
    incident_key: "INC-2026-002",
    title: "تذبذب مؤقت في معدل استجابة مزود الذكاء الاصطناعي الخارجي",
    severity: "info",
    status: "closed",
    environment: "production",
    owner: "مهندس المنصة",
    alert_id: 2,
    correlation_id: "INC-1789804002-C7E412",
    slo_policy_id: 3,
    active_version_id: 1,
    detected_at: new Date(Date.now() - 180 * 60000).toISOString(),
    acknowledged_at: new Date(Date.now() - 170 * 60000).toISOString(),
    mitigated_at: new Date(Date.now() - 130 * 60000).toISOString(),
    resolved_at: new Date(Date.now() - 100 * 60000).toISOString(),
    closed_at: new Date(Date.now() - 80 * 60000).toISOString(),
    root_cause: "تأخر مؤقت في خوادم بوابة الاستدلال لخدمة النماذج الخارجية.",
    remediation_actions: "تمت زيادة فترات مهلة إعادة المحاولة (Exponential Backoff) وتفعيل التخزين المؤقت للردود المتكررة.",
    created_at: new Date(Date.now() - 180 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 80 * 60000).toISOString(),
  }
];

const inMemoryEvents: InMemIncidentEvent[] = [
  {
    id: 1,
    incident_id: 1,
    event_type: "detected",
    actor: "نظام المراقبة والرصد DARB AI SLO",
    note: "تم رصد تجاوز حد زمن الاستجابة P95 (3,120ms > 3,000ms).",
    correlation_id: "INC-1789804001-A9F21B",
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: 2,
    incident_id: 1,
    event_type: "acknowledged",
    actor: "م. طارق الحارثي (SRE)",
    note: "تم استلام الحادث والبدء في تشخيص خط أنابيب البحث وتوسيع الذاكرة التخزينية.",
    correlation_id: "INC-1789804001-A9F21B",
    created_at: new Date(Date.now() - 38 * 60000).toISOString(),
  },
  {
    id: 3,
    incident_id: 2,
    event_type: "closed",
    actor: "مدير العمليات السحابية",
    note: "إغلاق الحادث بعد التحقق من استقرار الخدمة لـ 60 دقيقة وتوثيق الـ RCA.",
    correlation_id: "INC-1789804002-C7E412",
    created_at: new Date(Date.now() - 80 * 60000).toISOString(),
  }
];

const inMemoryRecoveryPlans: InMemRecoveryPlan[] = [
  {
    id: 1,
    incident_id: 1,
    title: "خطة التعافي: تنشيط التخزين المؤقت وتخفيف حمل استعلامات RAG",
    steps_json: [
      { order: 1, description: "التحقق من حالة حمولة خوادم التضمين والمتجهات المعرفية", executionMode: "human_approved" },
      { order: 2, description: "توسيع مهلة الاسترجاع المؤقتة من 3000ms إلى 4500ms كإجراء تخفيفي", executionMode: "human_approved" },
      { order: 3, description: "مراقبة منحنى P95 لمدة 15 دقيقة للتأكد من انخفاضه لأقل من 2000ms", executionMode: "human_approved" }
    ],
    risk_level: "medium",
    status: "approved",
    approval_required: true,
    approved_by: "م. أنس المنصور (Tech Lead)",
    approved_at: new Date(Date.now() - 25 * 60000).toISOString(),
    executed_by: null,
    executed_at: null,
    execution_notes: null,
    created_at: new Date(Date.now() - 35 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 25 * 60000).toISOString(),
  }
];

const inMemoryAudit: InMemIncidentAudit[] = [
  {
    id: 1,
    incident_id: 1,
    recovery_plan_id: null,
    action: "create_incident",
    actor: "نظام الرصد الذاتي DARB AI",
    reason: "رصد تجاوز مؤشر SLO لزمن الاستجابة في بيئة الإنتاج",
    correlation_id: "INC-1789804001-A9F21B",
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: 2,
    incident_id: 1,
    recovery_plan_id: 1,
    action: "approve_recovery_plan",
    actor: "م. أنس المنصور",
    reason: "موافقة صريحة على خطة التخفيف المؤقتة بعد فحص المخاطر",
    correlation_id: "INC-1789804001-A9F21B",
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: 3,
    incident_id: 2,
    recovery_plan_id: null,
    action: "close_incident",
    actor: "مدير العمليات السحابية",
    reason: "استيفاء شروط الإغلاق المعتمدة وتوثيق التحليل الجذري",
    correlation_id: "INC-1789804002-C7E412",
    created_at: new Date(Date.now() - 80 * 60000).toISOString(),
  }
];

const inMemoryReviews: InMemPostIncidentReview[] = [
  {
    id: 1,
    incident_id: 2,
    summary: "مراجعة حادث تذبذب استجابة مزود الذكاء الاصطناعي في 20 سبتمبر 2026.",
    root_cause: "ازدحام مؤقت في شبكة الربط الخارجية ومعدل طلبات متزامن أعلى من المتوقع.",
    contributing_factors: "غياب استراتيجية تخزين مؤقت للأسئلة الشائعة ذات الاستجابات المتطابقة.",
    remediation_actions: "تفعيل التخزين المؤقت الذكي وضبط سياسات إعادة المحاولة التلقائية.",
    prevention_actions: "إضافة اختبارات إجهاد دورية في بيئة Staging قبل الترقية للإصدارات الجديدة.",
    owner: "م. طارق الحارثي",
    approved_by: "مدير الجودة والحوكمة",
    approved_at: new Date(Date.now() - 75 * 60000).toISOString(),
    created_at: new Date(Date.now() - 80 * 60000).toISOString(),
  }
];

let nextIncidentId = 10;
let nextEventId = 10;
let nextPlanId = 10;
let nextAuditId = 10;
let nextReviewId = 10;

export function registerDarbAiIncidentRecoveryRoutes(app: Express, poolOrOpts?: any) {
  const pool = poolOrOpts?.query ? poolOrOpts : poolOrOpts?.pool;
  const isPostgres = Boolean(pool && typeof pool.query === "function");

  const q = async (sql: string, params: any[] = []) => {
    if (!isPostgres) return { rows: [] };
    return pool.query(sql, params);
  };

  // Bootstrap PostgreSQL tables if connected
  if (isPostgres) {
    (async () => {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS ai_incidents (
            id BIGSERIAL PRIMARY KEY,
            incident_key VARCHAR(120) UNIQUE NOT NULL,
            title TEXT NOT NULL,
            severity VARCHAR(20) NOT NULL DEFAULT 'warning',
            status VARCHAR(30) NOT NULL DEFAULT 'detected',
            environment VARCHAR(30) NOT NULL DEFAULT 'production',
            owner VARCHAR(160),
            alert_id BIGINT,
            correlation_id VARCHAR(120),
            slo_policy_id BIGINT,
            active_version_id BIGINT,
            detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            acknowledged_at TIMESTAMPTZ,
            mitigated_at TIMESTAMPTZ,
            resolved_at TIMESTAMPTZ,
            closed_at TIMESTAMPTZ,
            root_cause TEXT,
            remediation_actions TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS ai_incident_events (
            id BIGSERIAL PRIMARY KEY,
            incident_id BIGINT NOT NULL,
            event_type VARCHAR(50) NOT NULL,
            actor VARCHAR(160),
            note TEXT,
            correlation_id VARCHAR(120),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS ai_recovery_plans (
            id BIGSERIAL PRIMARY KEY,
            incident_id BIGINT NOT NULL,
            title TEXT NOT NULL,
            steps_json JSONB NOT NULL DEFAULT '[]'::jsonb,
            risk_level VARCHAR(20) NOT NULL DEFAULT 'medium',
            status VARCHAR(30) NOT NULL DEFAULT 'draft',
            approval_required BOOLEAN NOT NULL DEFAULT TRUE,
            approved_by VARCHAR(160),
            approved_at TIMESTAMPTZ,
            executed_by VARCHAR(160),
            executed_at TIMESTAMPTZ,
            execution_notes TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS ai_incident_audit (
            id BIGSERIAL PRIMARY KEY,
            incident_id BIGINT,
            recovery_plan_id BIGINT,
            action VARCHAR(80) NOT NULL,
            actor VARCHAR(160),
            reason TEXT,
            correlation_id VARCHAR(120),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS ai_post_incident_reviews (
            id BIGSERIAL PRIMARY KEY,
            incident_id BIGINT NOT NULL,
            summary TEXT,
            root_cause TEXT,
            contributing_factors TEXT,
            remediation_actions TEXT,
            prevention_actions TEXT,
            owner VARCHAR(160),
            approved_by VARCHAR(160),
            approved_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
        `);
        console.log("[DARB AI] Incident & Recovery V1.28 database tables initialized successfully.");
      } catch (err) {
        console.error("[DARB AI] Incident Recovery tables init warning (fallback to memory):", err);
      }
    })();
  }

  // Helper: map incident to include computed MTTA and MTTR in ms
  function formatIncident(inc: any) {
    const detected = inc.detected_at ? new Date(inc.detected_at) : new Date();
    const ack = inc.acknowledged_at ? new Date(inc.acknowledged_at) : null;
    const res = inc.resolved_at ? new Date(inc.resolved_at) : null;

    return {
      ...inc,
      mttaMs: calculateMtta(detected, ack),
      mttrMs: calculateMttr(detected, res),
    };
  }

  // 1. GET /api/admin/ai/incident-recovery/incidents
  app.get("/api/admin/ai/incident-recovery/incidents", async (req: Request, res: Response) => {
    try {
      const { environment, status, severity } = req.query;

      if (isPostgres) {
        let query = "SELECT * FROM ai_incidents WHERE 1=1";
        const params: any[] = [];

        if (environment && environment !== "all") {
          params.push(environment);
          query += ` AND environment = $${params.length}`;
        }
        if (status && status !== "all") {
          params.push(status);
          query += ` AND status = $${params.length}`;
        }
        if (severity && severity !== "all") {
          params.push(severity);
          query += ` AND severity = $${params.length}`;
        }
        query += " ORDER BY id DESC";

        const result = await q(query, params);
        const items = result.rows.map(formatIncident);
        return res.json({ ok: true, governance: GOVERNANCE, items, mode: "postgres" });
      }

      // Memory filter
      let items = [...inMemoryIncidents];
      if (environment && environment !== "all") {
        items = items.filter((i) => i.environment === environment);
      }
      if (status && status !== "all") {
        items = items.filter((i) => i.status === status);
      }
      if (severity && severity !== "all") {
        items = items.filter((i) => i.severity === severity);
      }

      items.sort((a, b) => b.id - a.id);
      return res.json({
        ok: true,
        governance: GOVERNANCE,
        items: items.map(formatIncident),
        mode: "memory"
      });
    } catch (err: any) {
      console.error("Error listing incidents:", err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 2. POST /api/admin/ai/incident-recovery/incidents
  app.post("/api/admin/ai/incident-recovery/incidents", async (req: Request, res: Response) => {
    try {
      const {
        title,
        severity = "warning",
        environment = "production",
        owner = "فريق الاستجابة السريعة",
        correlationId,
        alert_id = null,
        slo_policy_id = null,
        active_version_id = 1,
        note
      } = req.body || {};

      if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ ok: false, error: "عنوان الحادث إلزامي" });
      }

      const corrId = correlationId || createIncidentCorrelationId("INC");
      const incidentKey = `INC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
      const nowIso = new Date().toISOString();

      if (isPostgres) {
        const insertRes = await q(
          `INSERT INTO ai_incidents (
            incident_key, title, severity, status, environment, owner, alert_id,
            correlation_id, slo_policy_id, active_version_id, detected_at, created_at, updated_at
          ) VALUES ($1, $2, $3, 'detected', $4, $5, $6, $7, $8, $9, NOW(), NOW(), NOW())
          RETURNING *`,
          [
            incidentKey,
            title.trim(),
            severity,
            environment,
            owner,
            alert_id ? Number(alert_id) : null,
            corrId,
            slo_policy_id ? Number(slo_policy_id) : null,
            active_version_id ? Number(active_version_id) : null,
          ]
        );

        const newInc = insertRes.rows[0];

        // Event
        await q(
          `INSERT INTO ai_incident_events (incident_id, event_type, actor, note, correlation_id, created_at)
           VALUES ($1, 'detected', $2, $3, $4, NOW())`,
          [newInc.id, owner, note || "تم تسجيل الحادث ورصده", corrId]
        );

        // Audit
        await q(
          `INSERT INTO ai_incident_audit (incident_id, action, actor, reason, correlation_id, created_at)
           VALUES ($1, 'create_incident', $2, $3, $4, NOW())`,
          [newInc.id, owner, "تسجيل حادث جديد يدوياً أو عبر إشعار نظام المراقبة", corrId]
        );

        return res.status(201).json({
          ok: true,
          incident: formatIncident(newInc),
          governance: GOVERNANCE,
          mode: "postgres"
        });
      }

      const newInc: InMemIncident = {
        id: ++nextIncidentId,
        incident_key: incidentKey,
        title: title.trim(),
        severity,
        status: "detected",
        environment,
        owner,
        alert_id: alert_id ? Number(alert_id) : null,
        correlation_id: corrId,
        slo_policy_id: slo_policy_id ? Number(slo_policy_id) : null,
        active_version_id: active_version_id ? Number(active_version_id) : 1,
        detected_at: nowIso,
        acknowledged_at: null,
        mitigated_at: null,
        resolved_at: null,
        closed_at: null,
        root_cause: null,
        remediation_actions: null,
        created_at: nowIso,
        updated_at: nowIso,
      };

      inMemoryIncidents.unshift(newInc);

      inMemoryEvents.unshift({
        id: ++nextEventId,
        incident_id: newInc.id,
        event_type: "detected",
        actor: owner,
        note: note || "تم تسجيل الحادث ورصده وتعيين الحالة الأولى detected",
        correlation_id: corrId,
        created_at: nowIso,
      });

      inMemoryAudit.unshift({
        id: ++nextAuditId,
        incident_id: newInc.id,
        recovery_plan_id: null,
        action: "create_incident",
        actor: owner,
        reason: "تسجيل حادث جديد يدوياً أو عبر إشعار نظام المراقبة",
        correlation_id: corrId,
        created_at: nowIso,
      });

      return res.status(201).json({
        ok: true,
        incident: formatIncident(newInc),
        governance: GOVERNANCE,
        mode: "memory"
      });
    } catch (err: any) {
      console.error("Error creating incident:", err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 3. GET /api/admin/ai/incident-recovery/incidents/:id
  app.get("/api/admin/ai/incident-recovery/incidents/:id", async (req: Request, res: Response) => {
    try {
      const incidentId = Number(req.params.id);

      if (isPostgres) {
        const incRes = await q("SELECT * FROM ai_incidents WHERE id = $1", [incidentId]);
        if (incRes.rows.length === 0) {
          return res.status(404).json({ ok: false, error: "الحادث غير موجود" });
        }
        const eventsRes = await q("SELECT * FROM ai_incident_events WHERE incident_id = $1 ORDER BY id ASC", [incidentId]);
        const plansRes = await q("SELECT * FROM ai_recovery_plans WHERE incident_id = $1 ORDER BY id DESC", [incidentId]);

        return res.json({
          ok: true,
          incident: formatIncident(incRes.rows[0]),
          events: eventsRes.rows,
          recoveryPlans: plansRes.rows,
          governance: GOVERNANCE,
          mode: "postgres"
        });
      }

      const inc = inMemoryIncidents.find((i) => i.id === incidentId);
      if (!inc) {
        return res.status(404).json({ ok: false, error: "الحادث غير موجود" });
      }

      const events = inMemoryEvents.filter((e) => e.incident_id === incidentId);
      const recoveryPlans = inMemoryRecoveryPlans.filter((p) => p.incident_id === incidentId);

      return res.json({
        ok: true,
        incident: formatIncident(inc),
        events,
        recoveryPlans,
        governance: GOVERNANCE,
        mode: "memory"
      });
    } catch (err: any) {
      console.error("Error fetching incident:", err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 4. GET /api/admin/ai/incident-recovery/incidents/:id/events
  app.get("/api/admin/ai/incident-recovery/incidents/:id/events", async (req: Request, res: Response) => {
    try {
      const incidentId = Number(req.params.id);

      if (isPostgres) {
        const eventsRes = await q("SELECT * FROM ai_incident_events WHERE incident_id = $1 ORDER BY id ASC", [incidentId]);
        return res.json({ ok: true, items: eventsRes.rows, mode: "postgres" });
      }

      const items = inMemoryEvents.filter((e) => e.incident_id === incidentId);
      return res.json({ ok: true, items, mode: "memory" });
    } catch (err: any) {
      console.error("Error getting incident events:", err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 5. POST /api/admin/ai/incident-recovery/incidents/:id/transition
  app.post("/api/admin/ai/incident-recovery/incidents/:id/transition", async (req: Request, res: Response) => {
    try {
      const incidentId = Number(req.params.id);
      const { status, actor = "مشرف النظام", note, reason = "تحديث مسار معالجة الحادث" } = req.body || {};

      if (!status || !["detected", "investigating", "mitigating", "resolved"].includes(status)) {
        return res.status(400).json({
          ok: false,
          error: "حالة الانتقال غير صالحة. اختر: detected, investigating, mitigating, resolved. (للإغلاق استخدم نقطة النهاية /close)"
        });
      }

      const nowIso = new Date().toISOString();

      if (isPostgres) {
        const incRes = await q("SELECT * FROM ai_incidents WHERE id = $1", [incidentId]);
        if (incRes.rows.length === 0) {
          return res.status(404).json({ ok: false, error: "الحادث غير موجود" });
        }

        const current = incRes.rows[0];
        let ackAt = current.acknowledged_at;
        let mitAt = current.mitigated_at;
        let resAt = current.resolved_at;

        if (status === "investigating" && !ackAt) ackAt = nowIso;
        if (status === "mitigating" && !mitAt) mitAt = nowIso;
        if (status === "resolved" && !resAt) resAt = nowIso;

        const updateRes = await q(
          `UPDATE ai_incidents
           SET status = $1, acknowledged_at = $2, mitigated_at = $3, resolved_at = $4, updated_at = NOW()
           WHERE id = $5
           RETURNING *`,
          [status, ackAt, mitAt, resAt, incidentId]
        );

        const updatedInc = updateRes.rows[0];

        // Event
        await q(
          `INSERT INTO ai_incident_events (incident_id, event_type, actor, note, correlation_id, created_at)
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [incidentId, status, actor, note || `تم تغيير حالة الحادث إلى ${status}`, updatedInc.correlation_id]
        );

        // Audit
        await q(
          `INSERT INTO ai_incident_audit (incident_id, action, actor, reason, correlation_id, created_at)
           VALUES ($1, 'transition_status', $2, $3, $4, NOW())`,
          [incidentId, actor, reason, updatedInc.correlation_id]
        );

        return res.json({
          ok: true,
          requestedStatus: status,
          incident: formatIncident(updatedInc),
          humanApprovalRequired: true,
          mode: "postgres"
        });
      }

      const inc = inMemoryIncidents.find((i) => i.id === incidentId);
      if (!inc) {
        return res.status(404).json({ ok: false, error: "الحادث غير موجود" });
      }

      inc.status = status as IncidentStatus;
      inc.updated_at = nowIso;
      if (status === "investigating" && !inc.acknowledged_at) inc.acknowledged_at = nowIso;
      if (status === "mitigating" && !inc.mitigated_at) inc.mitigated_at = nowIso;
      if (status === "resolved" && !inc.resolved_at) inc.resolved_at = nowIso;

      inMemoryEvents.push({
        id: ++nextEventId,
        incident_id: incidentId,
        event_type: status,
        actor,
        note: note || `تم تغيير حالة الحادث إلى ${status}`,
        correlation_id: inc.correlation_id,
        created_at: nowIso,
      });

      inMemoryAudit.push({
        id: ++nextAuditId,
        incident_id: incidentId,
        recovery_plan_id: null,
        action: "transition_status",
        actor,
        reason,
        correlation_id: inc.correlation_id,
        created_at: nowIso,
      });

      return res.json({
        ok: true,
        requestedStatus: status,
        incident: formatIncident(inc),
        humanApprovalRequired: true,
        mode: "memory"
      });
    } catch (err: any) {
      console.error("Error transitioning incident:", err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 6. POST /api/admin/ai/incident-recovery/incidents/:id/close (Closure Gate: requires rootCause & remediationActions)
  app.post("/api/admin/ai/incident-recovery/incidents/:id/close", async (req: Request, res: Response) => {
    try {
      const incidentId = Number(req.params.id);
      const {
        rootCause,
        remediationActions,
        actor = "مسؤول الحوكمة والموثوقية",
        reason = "اعتماد إغلاق الحادث بعد استيفاء التحليل الجذري"
      } = req.body || {};

      const validation = validateClosure({ rootCause, remediationActions });
      if (!validation.ok) {
        return res.status(400).json({
          ok: false,
          error: "إغلاق الحادث يتطلب إلزامياً توثيق كل من السبب الجذري (RCA) وخطة الإجراءات التصحيحية المتبعة.",
          ...validation
        });
      }

      const nowIso = new Date().toISOString();

      if (isPostgres) {
        const incRes = await q("SELECT * FROM ai_incidents WHERE id = $1", [incidentId]);
        if (incRes.rows.length === 0) {
          return res.status(404).json({ ok: false, error: "الحادث غير موجود" });
        }

        const current = incRes.rows[0];
        const resAt = current.resolved_at || nowIso;

        const updateRes = await q(
          `UPDATE ai_incidents
           SET status = 'closed', closed_at = NOW(), resolved_at = $1, root_cause = $2, remediation_actions = $3, updated_at = NOW()
           WHERE id = $4
           RETURNING *`,
          [resAt, rootCause.trim(), remediationActions.trim(), incidentId]
        );

        const updatedInc = updateRes.rows[0];

        // Event
        await q(
          `INSERT INTO ai_incident_events (incident_id, event_type, actor, note, correlation_id, created_at)
           VALUES ($1, 'closed', $2, $3, $4, NOW())`,
          [
            incidentId,
            actor,
            `تم إغلاق الحادث رسمياً واعتماد بوابة الإغلاق: RCA & Remediation`,
            updatedInc.correlation_id
          ]
        );

        // Audit
        await q(
          `INSERT INTO ai_incident_audit (incident_id, action, actor, reason, correlation_id, created_at)
           VALUES ($1, 'close_incident', $2, $3, $4, NOW())`,
          [incidentId, actor, reason, updatedInc.correlation_id]
        );

        return res.json({
          ok: true,
          status: "closed",
          incident: formatIncident(updatedInc),
          governance: GOVERNANCE,
          mode: "postgres"
        });
      }

      const inc = inMemoryIncidents.find((i) => i.id === incidentId);
      if (!inc) {
        return res.status(404).json({ ok: false, error: "الحادث غير موجود" });
      }

      inc.status = "closed";
      if (!inc.resolved_at) inc.resolved_at = nowIso;
      inc.closed_at = nowIso;
      inc.root_cause = rootCause.trim();
      inc.remediation_actions = remediationActions.trim();
      inc.updated_at = nowIso;

      inMemoryEvents.push({
        id: ++nextEventId,
        incident_id: incidentId,
        event_type: "closed",
        actor,
        note: `تم إغلاق الحادث رسمياً واعتماد بوابة الإغلاق: RCA & Remediation`,
        correlation_id: inc.correlation_id,
        created_at: nowIso,
      });

      inMemoryAudit.push({
        id: ++nextAuditId,
        incident_id: incidentId,
        recovery_plan_id: null,
        action: "close_incident",
        actor,
        reason,
        correlation_id: inc.correlation_id,
        created_at: nowIso,
      });

      return res.json({
        ok: true,
        status: "closed",
        incident: formatIncident(inc),
        governance: GOVERNANCE,
        mode: "memory"
      });
    } catch (err: any) {
      console.error("Error closing incident:", err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 7. GET /api/admin/ai/incident-recovery/recovery-plans
  app.get("/api/admin/ai/incident-recovery/recovery-plans", async (req: Request, res: Response) => {
    try {
      const { incident_id } = req.query;

      if (isPostgres) {
        let query = "SELECT * FROM ai_recovery_plans";
        const params: any[] = [];
        if (incident_id) {
          params.push(Number(incident_id));
          query += " WHERE incident_id = $1";
        }
        query += " ORDER BY id DESC";

        const result = await q(query, params);
        return res.json({ ok: true, items: result.rows, mode: "postgres" });
      }

      let items = [...inMemoryRecoveryPlans];
      if (incident_id) {
        items = items.filter((p) => p.incident_id === Number(incident_id));
      }
      items.sort((a, b) => b.id - a.id);
      return res.json({ ok: true, items, mode: "memory" });
    } catch (err: any) {
      console.error("Error listing recovery plans:", err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 8. POST /api/admin/ai/incident-recovery/incidents/:id/recovery-plans
  app.post("/api/admin/ai/incident-recovery/incidents/:id/recovery-plans", async (req: Request, res: Response) => {
    try {
      const incidentId = Number(req.params.id);
      const { title, steps = [], riskLevel = "medium", author = "مهندس العمليات" } = req.body || {};

      const stringSteps: string[] = Array.isArray(steps)
        ? steps.map((s: any) => (typeof s === "string" ? s : s.description || ""))
        : ["التحقق من حالة الحادث", "تطبيق خطوات التخفيف المعتمدة"];

      const planStructure = buildRecoveryPlan(title || "خطة تعافٍ تشغيلية", stringSteps);

      if (isPostgres) {
        const insertRes = await q(
          `INSERT INTO ai_recovery_plans (
            incident_id, title, steps_json, risk_level, status, approval_required, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, 'draft', true, NOW(), NOW())
          RETURNING *`,
          [incidentId, planStructure.title, JSON.stringify(planStructure.steps), riskLevel]
        );

        const newPlan = insertRes.rows[0];

        // Audit
        await q(
          `INSERT INTO ai_incident_audit (incident_id, recovery_plan_id, action, actor, reason, correlation_id, created_at)
           VALUES ($1, $2, 'create_recovery_plan', $3, 'صياغة مسودة خطة تعافٍ جديدة تتطلب موافقة بشرية صريحة', (SELECT correlation_id FROM ai_incidents WHERE id = $1), NOW())`,
          [incidentId, newPlan.id, author]
        );

        return res.status(201).json({
          ok: true,
          plan: newPlan,
          governance: GOVERNANCE,
          mode: "postgres"
        });
      }

      const newPlan: InMemRecoveryPlan = {
        id: ++nextPlanId,
        incident_id: incidentId,
        title: planStructure.title,
        steps_json: planStructure.steps,
        risk_level: riskLevel,
        status: "draft",
        approval_required: true,
        approved_by: null,
        approved_at: null,
        executed_by: null,
        executed_at: null,
        execution_notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      inMemoryRecoveryPlans.unshift(newPlan);

      const inc = inMemoryIncidents.find((i) => i.id === incidentId);

      inMemoryAudit.unshift({
        id: ++nextAuditId,
        incident_id: incidentId,
        recovery_plan_id: newPlan.id,
        action: "create_recovery_plan",
        actor: author,
        reason: "صياغة مسودة خطة تعافٍ جديدة تتطلب موافقة بشرية صريحة",
        correlation_id: inc?.correlation_id || "INC-LOCAL",
        created_at: new Date().toISOString(),
      });

      return res.status(201).json({
        ok: true,
        plan: newPlan,
        governance: GOVERNANCE,
        mode: "memory"
      });
    } catch (err: any) {
      console.error("Error creating recovery plan:", err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 9. POST /api/admin/ai/incident-recovery/recovery-plans/:id/approve
  app.post("/api/admin/ai/incident-recovery/recovery-plans/:id/approve", async (req: Request, res: Response) => {
    try {
      const planId = Number(req.params.id);
      const { approvedBy, reason = "اعتماد خطة التعافي بعد التدقيق الفني" } = req.body || {};

      if (!approvedBy || typeof approvedBy !== "string" || !approvedBy.trim()) {
        return res.status(400).json({
          ok: false,
          error: "اسم المسؤول المعتمد إلزامي (Human Approver is required)"
        });
      }

      const nowIso = new Date().toISOString();

      if (isPostgres) {
        const planRes = await q("SELECT * FROM ai_recovery_plans WHERE id = $1", [planId]);
        if (planRes.rows.length === 0) {
          return res.status(404).json({ ok: false, error: "خطة التعافي غير موجودة" });
        }

        const updateRes = await q(
          `UPDATE ai_recovery_plans
           SET status = 'approved', approved_by = $1, approved_at = NOW(), updated_at = NOW()
           WHERE id = $2
           RETURNING *`,
          [approvedBy.trim(), planId]
        );

        const updatedPlan = updateRes.rows[0];

        // Audit
        await q(
          `INSERT INTO ai_incident_audit (incident_id, recovery_plan_id, action, actor, reason, correlation_id, created_at)
           VALUES ($1, $2, 'approve_recovery_plan', $3, $4, (SELECT correlation_id FROM ai_incidents WHERE id = $1), NOW())`,
          [updatedPlan.incident_id, planId, approvedBy.trim(), reason]
        );

        return res.json({
          ok: true,
          status: "approved",
          approvedBy: approvedBy.trim(),
          plan: updatedPlan,
          mode: "postgres"
        });
      }

      const plan = inMemoryRecoveryPlans.find((p) => p.id === planId);
      if (!plan) {
        return res.status(404).json({ ok: false, error: "خطة التعافي غير موجودة" });
      }

      plan.status = "approved";
      plan.approved_by = approvedBy.trim();
      plan.approved_at = nowIso;
      plan.updated_at = nowIso;

      const inc = inMemoryIncidents.find((i) => i.id === plan.incident_id);

      inMemoryAudit.unshift({
        id: ++nextAuditId,
        incident_id: plan.incident_id,
        recovery_plan_id: plan.id,
        action: "approve_recovery_plan",
        actor: approvedBy.trim(),
        reason,
        correlation_id: inc?.correlation_id || "INC-LOCAL",
        created_at: nowIso,
      });

      return res.json({
        ok: true,
        status: "approved",
        approvedBy: approvedBy.trim(),
        plan,
        mode: "memory"
      });
    } catch (err: any) {
      console.error("Error approving recovery plan:", err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 10. POST /api/admin/ai/incident-recovery/recovery-plans/:id/execute
  app.post("/api/admin/ai/incident-recovery/recovery-plans/:id/execute", async (req: Request, res: Response) => {
    try {
      const planId = Number(req.params.id);
      const { executedBy, notes, reason = "بدء التنفيذ البشري لخطوات التعافي المعتمدة" } = req.body || {};

      if (isPostgres) {
        const planRes = await q("SELECT * FROM ai_recovery_plans WHERE id = $1", [planId]);
        if (planRes.rows.length === 0) {
          return res.status(404).json({ ok: false, error: "خطة التعافي غير موجودة" });
        }

        const plan = planRes.rows[0];

        const canExec = canExecuteRecovery({
          status: plan.status,
          approvalRequired: plan.approval_required,
          approvedBy: plan.approved_by,
        });

        if (!canExec) {
          return res.status(403).json({
            ok: false,
            error: "حظر تنفيذ خطة التعافي: يجب أن تكون الخطة معتمدة صراحة بواسطة مسؤول بشري، ومعطل أي تنفيذ تلقائي (Auto-execution disabled).",
            governance: GOVERNANCE,
          });
        }

        const executor = executedBy || plan.approved_by || "مشغل العمليات";

        const updateRes = await q(
          `UPDATE ai_recovery_plans
           SET status = 'executed', executed_by = $1, executed_at = NOW(), execution_notes = $2, updated_at = NOW()
           WHERE id = $3
           RETURNING *`,
          [executor, notes || "تم تنفيذ الخطوات يدوياً ومراجعة النتائج", planId]
        );

        const executedPlan = updateRes.rows[0];

        // Event on incident
        await q(
          `INSERT INTO ai_incident_events (incident_id, event_type, actor, note, correlation_id, created_at)
           VALUES ($1, 'recovery_executed', $2, $3, (SELECT correlation_id FROM ai_incidents WHERE id = $1), NOW())`,
          [
            executedPlan.incident_id,
            executor,
            `تم تنفيذ خطة التعافي #${planId} بنجاح: ${executedPlan.title}`
          ]
        );

        // Audit
        await q(
          `INSERT INTO ai_incident_audit (incident_id, recovery_plan_id, action, actor, reason, correlation_id, created_at)
           VALUES ($1, $2, 'execute_recovery_plan', $3, $4, (SELECT correlation_id FROM ai_incidents WHERE id = $1), NOW())`,
          [executedPlan.incident_id, planId, executor, reason]
        );

        return res.json({
          ok: true,
          status: "executed",
          executedBy: executor,
          plan: executedPlan,
          mode: "postgres"
        });
      }

      const plan = inMemoryRecoveryPlans.find((p) => p.id === planId);
      if (!plan) {
        return res.status(404).json({ ok: false, error: "خطة التعافي غير موجودة" });
      }

      const canExec = canExecuteRecovery({
        status: plan.status,
        approvalRequired: plan.approval_required,
        approvedBy: plan.approved_by,
      });

      if (!canExec) {
        return res.status(403).json({
          ok: false,
          error: "حظر تنفيذ خطة التعافي: يجب أن تكون الخطة معتمدة صراحة بواسطة مسؤول بشري، ومعطل أي تنفيذ تلقائي (Auto-execution disabled).",
          governance: GOVERNANCE,
        });
      }

      const executor = executedBy || plan.approved_by || "مشغل العمليات";
      const nowIso = new Date().toISOString();

      plan.status = "executed";
      plan.executed_by = executor;
      plan.executed_at = nowIso;
      plan.execution_notes = notes || "تم تنفيذ الخطوات يدوياً ومراجعة النتائج";
      plan.updated_at = nowIso;

      const inc = inMemoryIncidents.find((i) => i.id === plan.incident_id);

      inMemoryEvents.push({
        id: ++nextEventId,
        incident_id: plan.incident_id,
        event_type: "recovery_executed",
        actor: executor,
        note: `تم تنفيذ خطة التعافي #${planId} بنجاح: ${plan.title}`,
        correlation_id: inc?.correlation_id || "INC-LOCAL",
        created_at: nowIso,
      });

      inMemoryAudit.unshift({
        id: ++nextAuditId,
        incident_id: plan.incident_id,
        recovery_plan_id: plan.id,
        action: "execute_recovery_plan",
        actor: executor,
        reason,
        correlation_id: inc?.correlation_id || "INC-LOCAL",
        created_at: nowIso,
      });

      return res.json({
        ok: true,
        status: "executed",
        executedBy: executor,
        plan,
        mode: "memory"
      });
    } catch (err: any) {
      console.error("Error executing recovery plan:", err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 11. GET /api/admin/ai/incident-recovery/reviews
  app.get("/api/admin/ai/incident-recovery/reviews", async (req: Request, res: Response) => {
    try {
      const { incident_id } = req.query;

      if (isPostgres) {
        let query = "SELECT * FROM ai_post_incident_reviews";
        const params: any[] = [];
        if (incident_id) {
          params.push(Number(incident_id));
          query += " WHERE incident_id = $1";
        }
        query += " ORDER BY id DESC";

        const result = await q(query, params);
        return res.json({ ok: true, items: result.rows, mode: "postgres" });
      }

      let items = [...inMemoryReviews];
      if (incident_id) {
        items = items.filter((r) => r.incident_id === Number(incident_id));
      }
      items.sort((a, b) => b.id - a.id);
      return res.json({ ok: true, items, mode: "memory" });
    } catch (err: any) {
      console.error("Error listing reviews:", err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 12. POST /api/admin/ai/incident-recovery/incidents/:id/reviews
  app.post("/api/admin/ai/incident-recovery/incidents/:id/reviews", async (req: Request, res: Response) => {
    try {
      const incidentId = Number(req.params.id);
      const {
        summary = "",
        root_cause = "",
        contributing_factors = "",
        remediation_actions = "",
        prevention_actions = "",
        owner = "مهندس الموثوقية",
        approved_by = null,
      } = req.body || {};

      if (isPostgres) {
        const insertRes = await q(
          `INSERT INTO ai_post_incident_reviews (
            incident_id, summary, root_cause, contributing_factors,
            remediation_actions, prevention_actions, owner, approved_by, approved_at, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CASE WHEN $8::text IS NOT NULL THEN NOW() ELSE NULL END, NOW())
          RETURNING *`,
          [
            incidentId,
            summary.trim(),
            root_cause.trim(),
            contributing_factors.trim(),
            remediation_actions.trim(),
            prevention_actions.trim(),
            owner.trim(),
            approved_by ? String(approved_by).trim() : null
          ]
        );

        const newReview = insertRes.rows[0];

        // Audit
        await q(
          `INSERT INTO ai_incident_audit (incident_id, action, actor, reason, correlation_id, created_at)
           VALUES ($1, 'create_post_incident_review', $2, 'توثيق تقرير المراجعة اللاحقة للحادث (PIR)', (SELECT correlation_id FROM ai_incidents WHERE id = $1), NOW())`,
          [incidentId, owner]
        );

        return res.status(201).json({
          ok: true,
          review: newReview,
          governance: GOVERNANCE,
          mode: "postgres"
        });
      }

      const newReview: InMemPostIncidentReview = {
        id: ++nextReviewId,
        incident_id: incidentId,
        summary: summary.trim(),
        root_cause: root_cause.trim(),
        contributing_factors: contributing_factors.trim(),
        remediation_actions: remediation_actions.trim(),
        prevention_actions: prevention_actions.trim(),
        owner: owner.trim(),
        approved_by: approved_by ? String(approved_by).trim() : null,
        approved_at: approved_by ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
      };

      inMemoryReviews.unshift(newReview);

      const inc = inMemoryIncidents.find((i) => i.id === incidentId);

      inMemoryAudit.unshift({
        id: ++nextAuditId,
        incident_id: incidentId,
        recovery_plan_id: null,
        action: "create_post_incident_review",
        actor: owner,
        reason: "توثيق تقرير المراجعة اللاحقة للحادث (PIR)",
        correlation_id: inc?.correlation_id || "INC-LOCAL",
        created_at: new Date().toISOString(),
      });

      return res.status(201).json({
        ok: true,
        review: newReview,
        governance: GOVERNANCE,
        mode: "memory"
      });
    } catch (err: any) {
      console.error("Error creating post-incident review:", err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 13. GET /api/admin/ai/incident-recovery/summary
  app.get("/api/admin/ai/incident-recovery/summary", async (req: Request, res: Response) => {
    try {
      const { environment = "all" } = req.query;

      let incidents: InMemIncident[] = [];
      let plans: InMemRecoveryPlan[] = [];

      if (isPostgres) {
        let query = "SELECT * FROM ai_incidents WHERE 1=1";
        const params: any[] = [];
        if (environment && environment !== "all") {
          params.push(environment);
          query += " AND environment = $1";
        }
        const incRes = await q(query, params);
        incidents = incRes.rows;

        const plansRes = await q("SELECT * FROM ai_recovery_plans");
        plans = plansRes.rows;
      } else {
        incidents = [...inMemoryIncidents];
        if (environment && environment !== "all") {
          incidents = incidents.filter((i) => i.environment === environment);
        }
        plans = [...inMemoryRecoveryPlans];
      }

      const total = incidents.length;
      const countsByStatus: Record<string, number> = {
        detected: 0,
        investigating: 0,
        mitigating: 0,
        resolved: 0,
        closed: 0,
      };

      let mttaSumMs = 0;
      let mttaCount = 0;
      let mttrSumMs = 0;
      let mttrCount = 0;

      for (const inc of incidents) {
        countsByStatus[inc.status] = (countsByStatus[inc.status] || 0) + 1;
        const det = new Date(inc.detected_at);
        if (inc.acknowledged_at) {
          const mtta = calculateMtta(det, new Date(inc.acknowledged_at));
          if (mtta !== null) {
            mttaSumMs += mtta;
            mttaCount++;
          }
        }
        if (inc.resolved_at) {
          const mttr = calculateMttr(det, new Date(inc.resolved_at));
          if (mttr !== null) {
            mttrSumMs += mttr;
            mttrCount++;
          }
        }
      }

      const pendingApprovalPlans = plans.filter((p) => p.status === "draft" || p.status === "pending_approval").length;

      return res.json({
        ok: true,
        environment,
        summary: {
          totalIncidents: total,
          openCount: (countsByStatus.detected || 0) + (countsByStatus.investigating || 0) + (countsByStatus.mitigating || 0),
          countsByStatus,
          avgMttaMinutes: mttaCount > 0 ? Math.round((mttaSumMs / mttaCount / 60000) * 10) / 10 : 0,
          avgMttrMinutes: mttrCount > 0 ? Math.round((mttrSumMs / mttrCount / 60000) * 10) / 10 : 0,
          pendingApprovalPlansCount: pendingApprovalPlans,
        },
        governance: GOVERNANCE,
        mode: isPostgres ? "postgres" : "memory"
      });
    } catch (err: any) {
      console.error("Error generating incident summary:", err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 14. GET /api/admin/ai/incident-recovery/audit
  app.get("/api/admin/ai/incident-recovery/audit", async (req: Request, res: Response) => {
    try {
      if (isPostgres) {
        const auditRes = await q("SELECT * FROM ai_incident_audit ORDER BY id DESC LIMIT 100");
        return res.json({ ok: true, items: auditRes.rows, mode: "postgres" });
      }

      return res.json({ ok: true, items: inMemoryAudit.slice(0, 100), mode: "memory" });
    } catch (err: any) {
      console.error("Error fetching audit logs:", err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  });
}
