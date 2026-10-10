import type { Express } from "express";
import {
  buildDefaultSloPolicies,
  buildHealthSummary,
  createObservabilityCorrelationId,
  evaluateSlo,
  alertSeverity
} from "./darb-ai-observability-slo-manager";

interface InMemMetric {
  id: number;
  environment: string;
  version_id: number | null;
  metric_key: string;
  metric_value: number;
  unit: string | null;
  labels_json: any;
  created_at: string;
}

interface InMemAlert {
  id: number;
  environment: string;
  version_id: number | null;
  metric_key: string;
  severity: "info" | "warning" | "critical";
  status: "open" | "acknowledged" | "resolved";
  observed_value: number;
  threshold: number;
  message: string;
  correlation_id: string;
  opened_at: string;
  acknowledged_at: string | null;
  resolved_at: string | null;
  acknowledged_by: number | null;
  resolved_by: number | null;
}

interface InMemIncident {
  id: number;
  environment: string;
  version_id: number | null;
  alert_id: number | null;
  status: "open" | "resolved";
  severity: string;
  title: string;
  summary: string;
  root_cause: string | null;
  remediation: string | null;
  opened_by: number | null;
  resolved_by: number | null;
  opened_at: string;
  resolved_at: string | null;
}

interface InMemAudit {
  id: number;
  action: string;
  actor_id: number | null;
  environment: string | null;
  version_id: number | null;
  alert_id: number | null;
  incident_id: number | null;
  reason: string;
  details_json: any;
  created_at: string;
}

// In-Memory state for development / fallback
const inMemoryMetrics: InMemMetric[] = [
  {
    id: 1,
    environment: "production",
    version_id: 1,
    metric_key: "error_rate",
    metric_value: 0.018,
    unit: "ratio",
    labels_json: { route: "chat_rag" },
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 2,
    environment: "production",
    version_id: 1,
    metric_key: "p95_latency_ms",
    metric_value: 1840,
    unit: "ms",
    labels_json: { tier: "inference" },
    created_at: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: 3,
    environment: "production",
    version_id: 1,
    metric_key: "provider_failure_rate",
    metric_value: 0.02,
    unit: "ratio",
    labels_json: { provider: "gemini-flash" },
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 4,
    environment: "production",
    version_id: 1,
    metric_key: "answer_helpful_rate",
    metric_value: 0.94,
    unit: "ratio",
    labels_json: { feedback_type: "thumbs" },
    created_at: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: 5,
    environment: "staging",
    version_id: 1,
    metric_key: "error_rate",
    metric_value: 0.035,
    unit: "ratio",
    labels_json: { route: "rag_eval" },
    created_at: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: 6,
    environment: "staging",
    version_id: 1,
    metric_key: "p95_latency_ms",
    metric_value: 2250,
    unit: "ms",
    labels_json: { tier: "inference" },
    created_at: new Date(Date.now() - 18 * 60000).toISOString(),
  },
  {
    id: 7,
    environment: "staging",
    version_id: 1,
    metric_key: "provider_failure_rate",
    metric_value: 0.04,
    unit: "ratio",
    labels_json: { provider: "gemini-flash" },
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 8,
    environment: "staging",
    version_id: 1,
    metric_key: "answer_helpful_rate",
    metric_value: 0.89,
    unit: "ratio",
    labels_json: { feedback_type: "thumbs" },
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 9,
    environment: "development",
    version_id: 1,
    metric_key: "error_rate",
    metric_value: 0.062,
    unit: "ratio",
    labels_json: { route: "dev_sandbox" },
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: 10,
    environment: "development",
    version_id: 1,
    metric_key: "p95_latency_ms",
    metric_value: 3120,
    unit: "ms",
    labels_json: { tier: "inference" },
    created_at: new Date(Date.now() - 22 * 60000).toISOString(),
  },
  {
    id: 11,
    environment: "development",
    version_id: 1,
    metric_key: "provider_failure_rate",
    metric_value: 0.08,
    unit: "ratio",
    labels_json: { provider: "gemini-flash" },
    created_at: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: 12,
    environment: "development",
    version_id: 1,
    metric_key: "answer_helpful_rate",
    metric_value: 0.82,
    unit: "ratio",
    labels_json: { feedback_type: "thumbs" },
    created_at: new Date(Date.now() - 18 * 60000).toISOString(),
  },
];

const inMemoryAlerts: InMemAlert[] = [
  {
    id: 1,
    environment: "development",
    version_id: 1,
    metric_key: "p95_latency_ms",
    severity: "warning",
    status: "open",
    observed_value: 3120,
    threshold: 3000,
    message: "تجاوز طفيف لزمن استجابة P95 في بيئة التطوير (3120ms > 3000ms)",
    correlation_id: "obs_alert_1789804001",
    opened_at: new Date(Date.now() - 22 * 60000).toISOString(),
    acknowledged_at: null,
    resolved_at: null,
    acknowledged_by: null,
    resolved_by: null,
  },
  {
    id: 2,
    environment: "production",
    version_id: 1,
    metric_key: "error_rate",
    severity: "info",
    status: "resolved",
    observed_value: 0.048,
    threshold: 0.05,
    message: "استقرار معدل الأخطاء التشغيلية ضمن النطاق الآمن 1.8%",
    correlation_id: "obs_alert_1789804002",
    opened_at: new Date(Date.now() - 120 * 60000).toISOString(),
    acknowledged_at: new Date(Date.now() - 100 * 60000).toISOString(),
    resolved_at: new Date(Date.now() - 60 * 60000).toISOString(),
    acknowledged_by: 99,
    resolved_by: 99,
  },
];

const inMemoryIncidents: InMemIncident[] = [
  {
    id: 1,
    environment: "development",
    version_id: 1,
    alert_id: 1,
    status: "open",
    severity: "low",
    title: "ارتفاع طفيف في زمن الاستجابة في بيئة التطوير",
    summary: "تحليل مؤشرات P95 أثناء إجراء فحص الأحمال التجريبي في Development.",
    root_cause: null,
    remediation: null,
    opened_by: 99,
    resolved_by: null,
    opened_at: new Date(Date.now() - 20 * 60000).toISOString(),
    resolved_at: null,
  },
];

const inMemoryAudit: InMemAudit[] = [
  {
    id: 1,
    action: "init_observability",
    actor_id: 99,
    environment: "production",
    version_id: 1,
    alert_id: null,
    incident_id: null,
    reason: "بدء تفعيل طبقة المراقبة الموحدة DARB AI V1.27 مع سياسات SLO",
    details_json: { autoRemediation: false, autoDeploy: false, autoRollback: false },
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 2,
    action: "resolve_alert",
    actor_id: 99,
    environment: "production",
    version_id: 1,
    alert_id: 2,
    incident_id: null,
    reason: "تأكيد عودة مؤشر الأخطاء للنطاق الطبيعي 1.8%",
    details_json: { autoRemediation: false },
    created_at: new Date(Date.now() - 60 * 60000).toISOString(),
  },
];

let nextMetricId = 20;
let nextAlertId = 10;
let nextIncidentId = 10;
let nextAuditId = 10;

export function registerDarbAIObservabilitySloRoutes(app: Express, poolOrOpts?: any) {
  const pool = poolOrOpts?.query ? poolOrOpts : poolOrOpts?.pool;
  const isPostgres = Boolean(pool && typeof pool.query === "function");

  const q = async (sql: string, params: any[] = []) => {
    if (!isPostgres) return { rows: [] };
    return pool.query(sql, params);
  };

  // Auto-bootstrap tables if postgres is connected
  if (isPostgres) {
    (async () => {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS ai_observability_metrics (
            id BIGSERIAL PRIMARY KEY,
            environment TEXT NOT NULL,
            version_id BIGINT,
            metric_key TEXT NOT NULL,
            metric_value NUMERIC,
            unit TEXT,
            window_start TIMESTAMPTZ,
            window_end TIMESTAMPTZ,
            labels_json JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          CREATE INDEX IF NOT EXISTS idx_ai_obs_metrics_lookup
            ON ai_observability_metrics(environment, metric_key, created_at);

          CREATE TABLE IF NOT EXISTS ai_slo_policies (
            id BIGSERIAL PRIMARY KEY,
            environment TEXT NOT NULL,
            metric_key TEXT NOT NULL,
            target NUMERIC NOT NULL,
            comparison TEXT NOT NULL DEFAULT 'lte',
            window_minutes INTEGER NOT NULL DEFAULT 60,
            enabled BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS ai_observability_alerts (
            id BIGSERIAL PRIMARY KEY,
            environment TEXT NOT NULL,
            version_id BIGINT,
            metric_key TEXT NOT NULL,
            severity TEXT NOT NULL DEFAULT 'warning',
            status TEXT NOT NULL DEFAULT 'open',
            observed_value NUMERIC,
            threshold NUMERIC,
            message TEXT,
            correlation_id TEXT,
            opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            acknowledged_at TIMESTAMPTZ,
            resolved_at TIMESTAMPTZ,
            acknowledged_by BIGINT,
            resolved_by BIGINT
          );

          CREATE INDEX IF NOT EXISTS idx_ai_obs_alerts_status
            ON ai_observability_alerts(status, opened_at);

          CREATE TABLE IF NOT EXISTS ai_observability_incidents (
            id BIGSERIAL PRIMARY KEY,
            environment TEXT NOT NULL,
            version_id BIGINT,
            alert_id BIGINT,
            status TEXT NOT NULL DEFAULT 'open',
            severity TEXT NOT NULL DEFAULT 'medium',
            title TEXT NOT NULL,
            summary TEXT,
            root_cause TEXT,
            remediation TEXT,
            opened_by BIGINT,
            resolved_by BIGINT,
            opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            resolved_at TIMESTAMPTZ
          );

          CREATE TABLE IF NOT EXISTS ai_observability_audit (
            id BIGSERIAL PRIMARY KEY,
            action TEXT NOT NULL,
            actor_id BIGINT,
            environment TEXT,
            version_id BIGINT,
            alert_id BIGINT,
            incident_id BIGINT,
            reason TEXT,
            details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
        `);
      } catch (err) {
        console.warn("[DarbAIObservability] Postgres bootstrap warning, falling back to memory:", err);
      }
    })();
  }

  // 1. GET /api/admin/ai/observability/summary
  app.get("/api/admin/ai/observability/summary", async (req, res) => {
    const environment = String(req.query.environment ?? "production");
    try {
      if (isPostgres) {
        const result = await q(
          `SELECT metric_key, AVG(metric_value) AS metric_value
           FROM ai_observability_metrics
           WHERE environment=$1
             AND created_at > NOW() - INTERVAL '60 minutes'
           GROUP BY metric_key`,
          [environment]
        );
        if (result.rows && result.rows.length > 0) {
          const metrics = Object.fromEntries(
            result.rows.map((r: any) => [r.metric_key, Number(r.metric_value)])
          );
          return res.json({
            ok: true,
            environment,
            ...buildHealthSummary(metrics),
            autoRemediation: false,
            mode: "postgres",
          });
        }
      }
      // Memory fallback
      const envMetrics = inMemoryMetrics.filter((m) => m.environment === environment);
      const metrics: Record<string, number> = {};
      for (const m of envMetrics) {
        metrics[m.metric_key] = m.metric_value;
      }
      res.json({
        ok: true,
        environment,
        ...buildHealthSummary(metrics),
        autoRemediation: false,
        mode: "memory",
      });
    } catch {
      res.json({
        ok: true,
        mode: "memory",
        environment,
        ...buildHealthSummary({}),
        autoRemediation: false,
      });
    }
  });

  // 2. GET /api/admin/ai/observability/metrics
  app.get("/api/admin/ai/observability/metrics", async (req, res) => {
    const environment = String(req.query.environment ?? "production");
    try {
      if (isPostgres) {
        const result = await q(
          `SELECT * FROM ai_observability_metrics
           WHERE environment=$1 ORDER BY created_at DESC LIMIT 500`,
          [environment]
        );
        if (result.rows && result.rows.length > 0) {
          return res.json({ ok: true, metrics: result.rows, mode: "postgres" });
        }
      }
      const filtered = inMemoryMetrics.filter((m) => m.environment === environment);
      res.json({ ok: true, metrics: filtered, mode: "memory" });
    } catch {
      res.json({ ok: true, metrics: [], mode: "memory" });
    }
  });

  // 3. POST /api/admin/ai/observability/metrics
  app.post("/api/admin/ai/observability/metrics", async (req, res) => {
    const env = req.body?.environment ?? "production";
    const metricKey = req.body?.metricKey;
    const metricValue = Number(req.body?.metricValue ?? 0);
    const unit = req.body?.unit ?? null;
    const versionId = req.body?.versionId ?? null;
    const labels = req.body?.labels ?? {};

    try {
      if (isPostgres) {
        const result = await q(
          `INSERT INTO ai_observability_metrics
           (environment,version_id,metric_key,metric_value,unit,labels_json)
           VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
          [env, versionId, metricKey, metricValue, unit, JSON.stringify(labels)]
        );
        if (result.rows?.[0]) {
          return res.json({ ok: true, metric: result.rows[0], mode: "postgres" });
        }
      }
      const newM: InMemMetric = {
        id: ++nextMetricId,
        environment: env,
        version_id: versionId,
        metric_key: metricKey,
        metric_value: metricValue,
        unit,
        labels_json: labels,
        created_at: new Date().toISOString(),
      };
      inMemoryMetrics.unshift(newM);
      res.json({ ok: true, mode: "memory", metric: newM });
    } catch {
      res.json({ ok: true, mode: "memory", metric: req.body ?? {} });
    }
  });

  // 4. GET /api/admin/ai/observability/slo
  app.get("/api/admin/ai/observability/slo", async (_req, res) => {
    try {
      if (isPostgres) {
        const result = await q(
          `SELECT * FROM ai_slo_policies ORDER BY environment, metric_key`
        );
        if (result.rows && result.rows.length > 0) {
          return res.json({ ok: true, policies: result.rows, mode: "postgres" });
        }
      }
      res.json({ ok: true, policies: buildDefaultSloPolicies(), mode: "memory" });
    } catch {
      res.json({ ok: true, policies: buildDefaultSloPolicies(), mode: "memory" });
    }
  });

  // 5. POST /api/admin/ai/observability/slo/evaluate
  app.post("/api/admin/ai/observability/slo/evaluate", async (req, res) => {
    const value = Number(req.body?.value);
    const target = Number(req.body?.target);
    const comparison = req.body?.comparison === "gte" ? "gte" : "lte";
    const evaluation = evaluateSlo(value, target, comparison);
    const correlationId = createObservabilityCorrelationId();
    res.json({
      ok: true,
      ...evaluation,
      correlationId,
      autoRemediation: false,
      governanceNotice: "Auto remediation, auto deploy, and auto rollback are strictly disabled. Human action required.",
    });
  });

  // 6. GET /api/admin/ai/observability/alerts
  app.get("/api/admin/ai/observability/alerts", async (req, res) => {
    const status = String(req.query.status ?? "open");
    const environment = req.query.environment ? String(req.query.environment) : null;
    try {
      if (isPostgres) {
        let sql = `SELECT * FROM ai_observability_alerts WHERE status=$1`;
        const params: any[] = [status];
        if (environment) {
          sql += ` AND environment=$2`;
          params.push(environment);
        }
        sql += ` ORDER BY opened_at DESC LIMIT 300`;
        const result = await q(sql, params);
        if (result.rows && result.rows.length > 0) {
          return res.json({ ok: true, alerts: result.rows, mode: "postgres" });
        }
      }
      const filtered = inMemoryAlerts.filter(
        (a) => (status === "all" || a.status === status) && (!environment || a.environment === environment)
      );
      res.json({ ok: true, alerts: filtered, mode: "memory" });
    } catch {
      res.json({ ok: true, alerts: [], mode: "memory" });
    }
  });

  // 7. POST /api/admin/ai/observability/alerts/:id/acknowledge
  app.post("/api/admin/ai/observability/alerts/:id/acknowledge", async (req, res) => {
    const id = Number(req.params.id);
    const actorId = req.body?.actorId ?? 99;
    const reason = req.body?.reason ?? "Human acknowledgement verified";
    try {
      if (isPostgres) {
        await q(
          `UPDATE ai_observability_alerts
           SET status='acknowledged', acknowledged_at=NOW(), acknowledged_by=$1
           WHERE id=$2`,
          [actorId, id]
        );
        await q(
          `INSERT INTO ai_observability_audit
           (action,actor_id,alert_id,reason,details_json)
           VALUES ('acknowledge_alert',$1,$2,$3,$4)`,
          [actorId, id, reason, JSON.stringify({ autoRemediation: false })]
        );
        return res.json({ ok: true, alertId: id, mode: "postgres" });
      }
      const alert = inMemoryAlerts.find((a) => a.id === id);
      if (alert) {
        alert.status = "acknowledged";
        alert.acknowledged_at = new Date().toISOString();
        alert.acknowledged_by = actorId;
      }
      inMemoryAudit.unshift({
        id: ++nextAuditId,
        action: "acknowledge_alert",
        actor_id: actorId,
        environment: alert?.environment ?? "production",
        version_id: alert?.version_id ?? 1,
        alert_id: id,
        incident_id: null,
        reason,
        details_json: { autoRemediation: false },
        created_at: new Date().toISOString(),
      });
      res.json({ ok: true, mode: "memory", alertId: id });
    } catch {
      res.json({ ok: true, mode: "memory", alertId: id });
    }
  });

  // 8. GET /api/admin/ai/observability/incidents
  app.get("/api/admin/ai/observability/incidents", async (_req, res) => {
    try {
      if (isPostgres) {
        const result = await q(
          `SELECT * FROM ai_observability_incidents
           ORDER BY opened_at DESC LIMIT 200`
        );
        if (result.rows && result.rows.length > 0) {
          return res.json({ ok: true, incidents: result.rows, mode: "postgres" });
        }
      }
      res.json({ ok: true, incidents: inMemoryIncidents, mode: "memory" });
    } catch {
      res.json({ ok: true, incidents: [], mode: "memory" });
    }
  });

  // 9. POST /api/admin/ai/observability/incidents
  app.post("/api/admin/ai/observability/incidents", async (req, res) => {
    const env = req.body?.environment ?? "production";
    const versionId = req.body?.versionId ?? null;
    const alertId = req.body?.alertId ?? null;
    const severity = req.body?.severity ?? "medium";
    const title = req.body?.title ?? "DARB AI Incident";
    const summary = req.body?.summary ?? "";
    const actorId = req.body?.actorId ?? 99;

    try {
      if (isPostgres) {
        const result = await q(
          `INSERT INTO ai_observability_incidents
           (environment,version_id,alert_id,severity,title,summary,opened_by)
           VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
          [env, versionId, alertId, severity, title, summary, actorId]
        );
        if (result.rows?.[0]) {
          return res.json({ ok: true, incident: result.rows[0], mode: "postgres" });
        }
      }
      const newInc: InMemIncident = {
        id: ++nextIncidentId,
        environment: env,
        version_id: versionId,
        alert_id: alertId,
        status: "open",
        severity,
        title,
        summary,
        root_cause: null,
        remediation: null,
        opened_by: actorId,
        resolved_by: null,
        opened_at: new Date().toISOString(),
        resolved_at: null,
      };
      inMemoryIncidents.unshift(newInc);
      inMemoryAudit.unshift({
        id: ++nextAuditId,
        action: "create_incident",
        actor_id: actorId,
        environment: env,
        version_id: versionId,
        alert_id: alertId,
        incident_id: newInc.id,
        reason: title,
        details_json: { autoRemediation: false, summary },
        created_at: new Date().toISOString(),
      });
      res.json({ ok: true, mode: "memory", incident: newInc });
    } catch {
      res.json({ ok: true, mode: "memory", incident: req.body ?? {} });
    }
  });

  // 10. POST /api/admin/ai/observability/incidents/:id/resolve
  app.post("/api/admin/ai/observability/incidents/:id/resolve", async (req, res) => {
    const id = Number(req.params.id);
    const actorId = req.body?.actorId ?? 99;
    const rootCause = req.body?.rootCause ?? "";
    const remediation = req.body?.remediation ?? "";
    const reason = req.body?.reason ?? "Human resolved incident with documented root cause and remediation";

    try {
      if (isPostgres) {
        await q(
          `UPDATE ai_observability_incidents
           SET status='resolved', resolved_at=NOW(), resolved_by=$1,
               root_cause=$2, remediation=$3
           WHERE id=$4`,
          [actorId, rootCause, remediation, id]
        );
        await q(
          `INSERT INTO ai_observability_audit
           (action,actor_id,incident_id,reason,details_json)
           VALUES ('resolve_incident',$1,$2,$3,$4)`,
          [actorId, id, reason, JSON.stringify({ autoRemediation: false, rootCause, remediation })]
        );
        return res.json({ ok: true, incidentId: id, mode: "postgres" });
      }
      const inc = inMemoryIncidents.find((i) => i.id === id);
      if (inc) {
        inc.status = "resolved";
        inc.resolved_at = new Date().toISOString();
        inc.resolved_by = actorId;
        inc.root_cause = rootCause;
        inc.remediation = remediation;
      }
      inMemoryAudit.unshift({
        id: ++nextAuditId,
        action: "resolve_incident",
        actor_id: actorId,
        environment: inc?.environment ?? "production",
        version_id: inc?.version_id ?? 1,
        alert_id: inc?.alert_id ?? null,
        incident_id: id,
        reason,
        details_json: { autoRemediation: false, rootCause, remediation },
        created_at: new Date().toISOString(),
      });
      res.json({ ok: true, mode: "memory", incidentId: id });
    } catch {
      res.json({ ok: true, mode: "memory", incidentId: id });
    }
  });

  // 11. GET /api/admin/ai/observability/audit
  app.get("/api/admin/ai/observability/audit", async (req, res) => {
    const environment = req.query.environment ? String(req.query.environment) : null;
    try {
      if (isPostgres) {
        let sql = `SELECT * FROM ai_observability_audit`;
        const params: any[] = [];
        if (environment) {
          sql += ` WHERE environment=$1`;
          params.push(environment);
        }
        sql += ` ORDER BY created_at DESC LIMIT 300`;
        const result = await q(sql, params);
        if (result.rows && result.rows.length > 0) {
          return res.json({ ok: true, audit: result.rows, mode: "postgres" });
        }
      }
      const filtered = environment
        ? inMemoryAudit.filter((a) => !a.environment || a.environment === environment)
        : inMemoryAudit;
      res.json({ ok: true, audit: filtered, mode: "memory" });
    } catch {
      res.json({ ok: true, audit: [], mode: "memory" });
    }
  });
}
