import type { Express, Request, Response } from "express";
import {
  CAPACITY_COST_GOVERNANCE,
  budgetStatus,
  estimateCost,
  forecastRollingAverage,
  capacityStatus,
  createCapacityCostCorrelationId,
  canChangeCapacity
} from "./darb-ai-capacity-cost-manager";

interface MetricRecord {
  id: number;
  environment: string;
  provider: string;
  model: string;
  window_start: string;
  window_end: string;
  requests: number;
  successful_requests: number;
  failed_requests: number;
  input_tokens: number;
  output_tokens: number;
  estimated_cost: number;
  created_at: string;
}

interface BudgetPolicyRecord {
  id: number | string;
  name: string;
  environment: string;
  period: "daily" | "monthly";
  budget_amount: number;
  warning_percent: number;
  critical_percent: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface CapacityPolicyRecord {
  id: number | string;
  name: string;
  environment: string;
  metric: string;
  operator: "lte" | "gte";
  threshold: number;
  window_minutes: number;
  enabled: boolean;
  created_at: string;
}

interface AlertRecord {
  id: number;
  type: string;
  severity: "info" | "warning" | "critical";
  status: "open" | "acknowledged" | "resolved";
  environment: string;
  message: string;
  observed_value: number;
  threshold: number;
  correlation_id: string;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
  created_at: string;
}

interface ForecastRecord {
  id: number;
  environment: string;
  period: string;
  observed_cost: number;
  forecast_cost: number;
  forecast_method: string;
  confidence: string;
  created_at: string;
}

interface AuditRecord {
  id: number;
  action: string;
  actor: string;
  policy_id: number | null;
  alert_id: number | null;
  correlation_id: string;
  reason: string;
  created_at: string;
}

// In-Memory Fallback Seed State
let inMemMetrics: MetricRecord[] = [
  {
    id: 1,
    environment: "production",
    provider: "Google Cloud Vertex / Gemini",
    model: "gemini-2.5-flash",
    window_start: new Date(Date.now() - 3600000 * 24).toISOString(),
    window_end: new Date().toISOString(),
    requests: 1420,
    successful_requests: 1408,
    failed_requests: 12,
    input_tokens: 842000,
    output_tokens: 284000,
    estimated_cost: 0.285,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 2,
    environment: "production",
    provider: "Google Cloud Vertex / Gemini",
    model: "gemini-2.5-pro",
    window_start: new Date(Date.now() - 3600000 * 48).toISOString(),
    window_end: new Date(Date.now() - 3600000 * 24).toISOString(),
    requests: 680,
    successful_requests: 676,
    failed_requests: 4,
    input_tokens: 1250000,
    output_tokens: 430000,
    estimated_cost: 1.84,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 3,
    environment: "staging",
    provider: "Google Cloud Vertex / Gemini",
    model: "gemini-2.5-flash",
    window_start: new Date(Date.now() - 3600000 * 24).toISOString(),
    window_end: new Date().toISOString(),
    requests: 310,
    successful_requests: 308,
    failed_requests: 2,
    input_tokens: 195000,
    output_tokens: 68000,
    estimated_cost: 0.065,
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  }
];

let inMemBudgets: BudgetPolicyRecord[] = [
  {
    id: 1,
    name: "ميزانية الاستهلاك الشهري لبيئة الإنتاج",
    environment: "production",
    period: "monthly",
    budget_amount: 150.0,
    warning_percent: 80,
    critical_percent: 100,
    enabled: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "سقف الإنفاق اليومي لبيئة التجهيز والاختبار",
    environment: "staging",
    period: "daily",
    budget_amount: 15.0,
    warning_percent: 75,
    critical_percent: 95,
    enabled: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

let inMemCapacityPolicies: CapacityPolicyRecord[] = [
  {
    id: 1,
    name: "سقف الرموز لكل دقيقة (Tokens Per Minute - TPM)",
    environment: "production",
    metric: "tokens_per_minute",
    operator: "lte",
    threshold: 150000,
    window_minutes: 1,
    enabled: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  },
  {
    id: 2,
    name: "سقف الطلبات المتزامنة في الدقيقة (RPM)",
    environment: "production",
    metric: "requests_per_minute",
    operator: "lte",
    threshold: 240,
    window_minutes: 1,
    enabled: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  },
  {
    id: 3,
    name: "الحد الأقصى لزمن استجابة النموذج (P95 Latency)",
    environment: "production",
    metric: "p95_latency_ms",
    operator: "lte",
    threshold: 3000,
    window_minutes: 5,
    enabled: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  }
];

let inMemAlerts: AlertRecord[] = [
  {
    id: 1,
    type: "budget_threshold",
    severity: "warning",
    status: "open",
    environment: "production",
    message: "تجاوز استهلاك الميزانية الشهرية لبيئة الإنتاج نسبة 82% من السقف المعتمد ($123.40 / $150.00).",
    observed_value: 82.26,
    threshold: 80.0,
    correlation_id: "COST-ALR-9481",
    acknowledged_by: null,
    acknowledged_at: null,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 2,
    type: "token_spike",
    severity: "info",
    status: "acknowledged",
    environment: "production",
    message: "رصد ذروة استهلاك رموز (Token Spike) بمعدل 112,000 رمز/د أثناء تشغيل معالجة استخراج المستندات.",
    observed_value: 112000,
    threshold: 150000,
    correlation_id: "COST-ALR-8832",
    acknowledged_by: "م. طارق العتيبي (FinOps Lead)",
    acknowledged_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
  }
];

let inMemForecasts: ForecastRecord[] = [
  {
    id: 1,
    environment: "production",
    period: "monthly",
    observed_cost: 123.40,
    forecast_cost: 141.85,
    forecast_method: "rolling_average",
    confidence: "moderate",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 2,
    environment: "staging",
    period: "daily",
    observed_cost: 4.80,
    forecast_cost: 5.25,
    forecast_method: "rolling_average",
    confidence: "limited",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  }
];

let inMemAudits: AuditRecord[] = [
  {
    id: 1,
    action: "POLICY_INITIALIZED",
    actor: "مدير حوكمة التكاليف والعمليات SRE",
    policy_id: 1,
    alert_id: null,
    correlation_id: "COST-INIT-001",
    reason: "اعتماد سياسة سقف الإنفاق الشهري ومحددات القدرة الاستيعابية V1.29",
    created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  },
  {
    id: 2,
    action: "ALERT_ACKNOWLEDGED",
    actor: "م. طارق العتيبي (FinOps Lead)",
    policy_id: null,
    alert_id: 2,
    correlation_id: "COST-ALR-8832",
    reason: "مراجعة الذروة والتأكد من أنها ضمن العمليات الطبيعية المجدولة",
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  }
];

export function registerDarbAiCapacityCostRoutes(
  app: Express,
  options?: { pool?: any; isAdmin?: (req: Request) => boolean | Promise<boolean> }
) {
  const pool = options?.pool;

  // Helper query runner
  const queryDb = async (sql: string, params: any[] = []) => {
    if (!pool) return null;
    try {
      const res = await pool.query(sql, params);
      return res.rows;
    } catch (err) {
      // Table might not be migrated yet or DB not ready
      return null;
    }
  };

  // Helper to log audit
  const logAudit = async (data: {
    action: string;
    actor: string;
    policy_id?: number | null;
    alert_id?: number | null;
    correlation_id: string;
    reason: string;
  }) => {
    const dbRes = await queryDb(
      `INSERT INTO ai_capacity_cost_audit (action, actor, policy_id, alert_id, correlation_id, reason)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        data.action,
        data.actor,
        data.policy_id || null,
        data.alert_id || null,
        data.correlation_id,
        data.reason,
      ]
    );

    if (!dbRes) {
      inMemAudits.unshift({
        id: inMemAudits.length + 1,
        action: data.action,
        actor: data.actor,
        policy_id: data.policy_id || null,
        alert_id: data.alert_id || null,
        correlation_id: data.correlation_id,
        reason: data.reason,
        created_at: new Date().toISOString(),
      });
    }
  };

  // 1. GET /api/admin/ai/capacity-cost/summary
  app.get("/api/admin/ai/capacity-cost/summary", async (req: Request, res: Response) => {
    try {
      const env = (req.query.environment as string) || "all";
      const correlationId = createCapacityCostCorrelationId();

      // Aggregate metrics
      let filteredMetrics = inMemMetrics;
      let filteredBudgets = inMemBudgets;
      let filteredAlerts = inMemAlerts;

      const dbMetrics = await queryDb("SELECT * FROM ai_capacity_cost_metrics ORDER BY id DESC LIMIT 100");
      if (dbMetrics) filteredMetrics = dbMetrics;

      const dbBudgets = await queryDb("SELECT * FROM ai_cost_budget_policies WHERE enabled=true");
      if (dbBudgets) filteredBudgets = dbBudgets;

      const dbAlerts = await queryDb("SELECT * FROM ai_capacity_cost_alerts ORDER BY id DESC");
      if (dbAlerts) filteredAlerts = dbAlerts;

      if (env !== "all") {
        filteredMetrics = filteredMetrics.filter((m) => m.environment === env);
        filteredBudgets = filteredBudgets.filter((b) => b.environment === env);
        filteredAlerts = filteredAlerts.filter((a) => a.environment === env);
      }

      const totalRequests = filteredMetrics.reduce((acc, m) => acc + Number(m.requests || 0), 0);
      const successfulRequests = filteredMetrics.reduce((acc, m) => acc + Number(m.successful_requests || 0), 0);
      const failedRequests = filteredMetrics.reduce((acc, m) => acc + Number(m.failed_requests || 0), 0);
      const inputTokens = filteredMetrics.reduce((acc, m) => acc + Number(m.input_tokens || 0), 0);
      const outputTokens = filteredMetrics.reduce((acc, m) => acc + Number(m.output_tokens || 0), 0);
      const totalTokens = inputTokens + outputTokens;
      const estimatedCost = filteredMetrics.reduce((acc, m) => acc + Number(m.estimated_cost || 0), 0);

      // Primary budget evaluation
      const primaryBudget = filteredBudgets[0] || {
        budget_amount: 150,
        warning_percent: 80,
        critical_percent: 100,
      };

      const budgetEvaluation = budgetStatus(
        estimatedCost,
        Number(primaryBudget.budget_amount || 150),
        Number(primaryBudget.warning_percent || 80),
        Number(primaryBudget.critical_percent || 100)
      );

      // Forecast
      const forecastCost = Number((estimatedCost * 1.15).toFixed(2));
      const capacityUtilization = Math.min(100, Math.round((totalTokens / 2000000) * 100));
      const openAlertsCount = filteredAlerts.filter((a) => a.status === "open").length;

      res.json({
        ok: true,
        governance: CAPACITY_COST_GOVERNANCE,
        correlationId,
        environment: env,
        summary: {
          requests: totalRequests,
          successfulRequests,
          failedRequests,
          inputTokens,
          outputTokens,
          totalTokens,
          estimatedCost: Number(estimatedCost.toFixed(4)),
          budgetAmount: Number(primaryBudget.budget_amount || 150),
          budgetSpent: Number(estimatedCost.toFixed(4)),
          budgetUsedPercent: Number(budgetEvaluation.percent.toFixed(1)),
          budgetStatus: budgetEvaluation.status,
          capacityUtilization,
          forecastCost,
          openAlertsCount,
        },
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || "فشل احتساب ملخص القدرة والتكلفة" });
    }
  });

  // 2. GET /api/admin/ai/capacity-cost/metrics
  app.get("/api/admin/ai/capacity-cost/metrics", async (req: Request, res: Response) => {
    try {
      const env = (req.query.environment as string) || "all";
      const dbRes = await queryDb("SELECT * FROM ai_capacity_cost_metrics ORDER BY id DESC LIMIT 100");
      let items = dbRes || inMemMetrics;

      if (env !== "all") {
        items = items.filter((m) => m.environment === env);
      }

      res.json({ ok: true, items });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 3. POST /api/admin/ai/capacity-cost/metrics
  app.post("/api/admin/ai/capacity-cost/metrics", async (req: Request, res: Response) => {
    try {
      const b = req.body || {};
      const env = b.environment || "production";
      const provider = b.provider || "Google Cloud Vertex / Gemini";
      const model = b.model || "gemini-2.5-flash";
      const requests = Number(b.requests || 0);
      const successfulRequests = Number(b.successfulRequests ?? requests);
      const failedRequests = Number(b.failedRequests || 0);
      const inputTokens = Number(b.inputTokens || 0);
      const outputTokens = Number(b.outputTokens || 0);
      const inputPricePer1k = Number(b.inputPricePer1k ?? 0.00015);
      const outputPricePer1k = Number(b.outputPricePer1k ?? 0.0006);

      const calculatedCost = estimateCost(inputTokens, outputTokens, inputPricePer1k, outputPricePer1k);

      const dbRes = await queryDb(
        `INSERT INTO ai_capacity_cost_metrics (
          environment, provider, model, window_start, window_end,
          requests, successful_requests, failed_requests,
          input_tokens, output_tokens, estimated_cost
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [
          env,
          provider,
          model,
          b.windowStart || new Date(Date.now() - 3600000).toISOString(),
          b.windowEnd || new Date().toISOString(),
          requests,
          successfulRequests,
          failedRequests,
          inputTokens,
          outputTokens,
          calculatedCost,
        ]
      );

      let item;
      if (dbRes && dbRes[0]) {
        item = dbRes[0];
      } else {
        item = {
          id: inMemMetrics.length + 1,
          environment: env,
          provider,
          model,
          window_start: b.windowStart || new Date(Date.now() - 3600000).toISOString(),
          window_end: b.windowEnd || new Date().toISOString(),
          requests,
          successful_requests: successfulRequests,
          failed_requests: failedRequests,
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          estimated_cost: calculatedCost,
          created_at: new Date().toISOString(),
        };
        inMemMetrics.unshift(item);
      }

      res.status(201).json({ ok: true, item, estimatedCost: calculatedCost });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 4. GET /api/admin/ai/capacity-cost/budgets
  app.get("/api/admin/ai/capacity-cost/budgets", async (req: Request, res: Response) => {
    try {
      const env = (req.query.environment as string) || "all";
      const dbRes = await queryDb("SELECT * FROM ai_cost_budget_policies ORDER BY id ASC");
      let items = dbRes || inMemBudgets;

      if (env !== "all") {
        items = items.filter((b) => b.environment === env);
      }

      res.json({ ok: true, items });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 5. POST /api/admin/ai/capacity-cost/budgets
  app.post("/api/admin/ai/capacity-cost/budgets", async (req: Request, res: Response) => {
    try {
      const b = req.body || {};
      const { name, environment, period, budgetAmount, warningPercent, criticalPercent, actor, reason } = b;

      if (!name || !budgetAmount) {
        return res.status(400).json({ ok: false, error: "اسم السياسة والميزانية المحددة إلزاميان" });
      }

      if (!actor || !reason) {
        return res.status(400).json({
          ok: false,
          error: "وفق معايير الحوكمة V1.29، يجب تحديد المسؤول (actor) والمبرر (reason) لتعديل أو إنشاء سياسات الميزانية.",
        });
      }

      const correlationId = createCapacityCostCorrelationId("BUDGET");
      const amt = Number(budgetAmount);
      const wp = Number(warningPercent || 80);
      const cp = Number(criticalPercent || 100);
      const env = environment || "production";
      const prd = period === "daily" ? "daily" : "monthly";

      const dbRes = await queryDb(
        `INSERT INTO ai_cost_budget_policies (name, environment, period, budget_amount, warning_percent, critical_percent, enabled)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, env, prd, amt, wp, cp, true]
      );

      let item;
      if (dbRes && dbRes[0]) {
        item = dbRes[0];
      } else {
        item = {
          id: inMemBudgets.length + 1,
          name,
          environment: env,
          period: prd,
          budget_amount: amt,
          warning_percent: wp,
          critical_percent: cp,
          enabled: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        inMemBudgets.unshift(item);
      }

      await logAudit({
        action: "BUDGET_POLICY_CREATED",
        actor,
        policy_id: Number(item.id),
        correlation_id: correlationId,
        reason: `${reason} [الميزانية: $${amt}, تحذيري: ${wp}%, حرج: ${cp}%]`,
      });

      res.status(201).json({ ok: true, item, correlationId });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 6. POST /api/admin/ai/capacity-cost/budgets/evaluate
  app.post("/api/admin/ai/capacity-cost/budgets/evaluate", async (req: Request, res: Response) => {
    const b = req.body || {};
    const spent = Number(b.spent || 0);
    const budget = Number(b.budget || 0);
    const warningPercent = Number(b.warningPercent ?? 80);
    const criticalPercent = Number(b.criticalPercent ?? 100);

    const result = budgetStatus(spent, budget, warningPercent, criticalPercent);
    res.json({
      ok: true,
      correlationId: createCapacityCostCorrelationId("EVAL-BUDGET"),
      result,
    });
  });

  // 7. GET /api/admin/ai/capacity-cost/capacity
  app.get("/api/admin/ai/capacity-cost/capacity", async (req: Request, res: Response) => {
    try {
      const env = (req.query.environment as string) || "all";
      const dbRes = await queryDb("SELECT * FROM ai_capacity_policies ORDER BY id ASC");
      let items = dbRes || inMemCapacityPolicies;

      if (env !== "all") {
        items = items.filter((c) => c.environment === env);
      }

      res.json({ ok: true, items });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 8. POST /api/admin/ai/capacity-cost/capacity
  app.post("/api/admin/ai/capacity-cost/capacity", async (req: Request, res: Response) => {
    try {
      const b = req.body || {};
      const { name, environment, metric, operator, threshold, windowMinutes, actor, approvedBy, reason } = b;

      if (!name || !threshold) {
        return res.status(400).json({ ok: false, error: "اسم السياسة والقيمة الحدية إلزاميان" });
      }

      if (!canChangeCapacity(actor, CAPACITY_COST_GOVERNANCE.humanApprovalRequired, approvedBy || actor)) {
        return res.status(400).json({
          ok: false,
          error: "تعديل سياسات القدرة الاستيعابية يتطلب توثيق المسؤول والاعتماد البشري الصريح.",
        });
      }

      const correlationId = createCapacityCostCorrelationId("CAPACITY");
      const env = environment || "production";
      const m = metric || "requests_per_minute";
      const op = operator === "gte" ? "gte" : "lte";
      const th = Number(threshold);
      const wm = Number(windowMinutes || 1);

      const dbRes = await queryDb(
        `INSERT INTO ai_capacity_policies (name, environment, metric, operator, threshold, window_minutes, enabled)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, env, m, op, th, wm, true]
      );

      let item;
      if (dbRes && dbRes[0]) {
        item = dbRes[0];
      } else {
        item = {
          id: inMemCapacityPolicies.length + 1,
          name,
          environment: env,
          metric: m,
          operator: op,
          threshold: th,
          window_minutes: wm,
          enabled: true,
          created_at: new Date().toISOString(),
        };
        inMemCapacityPolicies.unshift(item);
      }

      await logAudit({
        action: "CAPACITY_POLICY_CREATED",
        actor,
        policy_id: Number(item.id),
        correlation_id: correlationId,
        reason: `${reason || "إنشاء سياسة سعة استيعابية"} [المقياس: ${m}, الشرط: ${op} ${th}]`,
      });

      res.status(201).json({ ok: true, item, correlationId });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 9. POST /api/admin/ai/capacity-cost/capacity/evaluate
  app.post("/api/admin/ai/capacity-cost/capacity/evaluate", async (req: Request, res: Response) => {
    const b = req.body || {};
    const observed = Number(b.observed || 0);
    const threshold = Number(b.threshold || 0);
    const operator = b.operator === "gte" ? "gte" : "lte";

    const result = capacityStatus(observed, threshold, operator);
    res.json({
      ok: true,
      correlationId: createCapacityCostCorrelationId("EVAL-CAP"),
      result,
    });
  });

  // 10. GET /api/admin/ai/capacity-cost/alerts
  app.get("/api/admin/ai/capacity-cost/alerts", async (req: Request, res: Response) => {
    try {
      const env = (req.query.environment as string) || "all";
      const dbRes = await queryDb("SELECT * FROM ai_capacity_cost_alerts ORDER BY id DESC LIMIT 100");
      let items = dbRes || inMemAlerts;

      if (env !== "all") {
        items = items.filter((a) => a.environment === env);
      }

      res.json({ ok: true, items });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 11. POST /api/admin/ai/capacity-cost/alerts/:id/acknowledge
  app.post("/api/admin/ai/capacity-cost/alerts/:id/acknowledge", async (req: Request, res: Response) => {
    try {
      const alertId = req.params.id;
      const b = req.body || {};
      const actor = b.actor?.trim();
      const reason = b.reason?.trim() || "إشعار استلام ومراجعة التنبيه التشغيلي للتكلفة والسعة";

      if (!actor) {
        return res.status(400).json({ ok: false, error: "اسم المسؤول (actor) إلزامي لاعتماد التنبيه." });
      }

      const correlationId = createCapacityCostCorrelationId("ACK");

      const dbRes = await queryDb(
        `UPDATE ai_capacity_cost_alerts
         SET status = 'acknowledged', acknowledged_by = $1, acknowledged_at = NOW()
         WHERE id = $2 RETURNING *`,
        [actor, alertId]
      );

      let updatedItem;
      if (dbRes && dbRes[0]) {
        updatedItem = dbRes[0];
      } else {
        const found = inMemAlerts.find((a) => String(a.id) === String(alertId));
        if (found) {
          found.status = "acknowledged";
          found.acknowledged_by = actor;
          found.acknowledged_at = new Date().toISOString();
          updatedItem = found;
        }
      }

      await logAudit({
        action: "ALERT_ACKNOWLEDGED",
        actor,
        alert_id: Number(alertId),
        correlation_id: correlationId,
        reason,
      });

      res.json({
        ok: true,
        status: "acknowledged",
        actor,
        correlationId,
        item: updatedItem,
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 12. GET /api/admin/ai/capacity-cost/forecasts
  app.get("/api/admin/ai/capacity-cost/forecasts", async (req: Request, res: Response) => {
    try {
      const env = (req.query.environment as string) || "all";
      const dbRes = await queryDb("SELECT * FROM ai_cost_forecasts ORDER BY id DESC LIMIT 50");
      let items = dbRes || inMemForecasts;

      if (env !== "all") {
        items = items.filter((f) => f.environment === env);
      }

      res.json({ ok: true, items });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 13. POST /api/admin/ai/capacity-cost/forecasts
  app.post("/api/admin/ai/capacity-cost/forecasts", async (req: Request, res: Response) => {
    try {
      const b = req.body || {};
      const values = Array.isArray(b.values) ? b.values.map(Number) : [110, 125, 138, 142];
      const periods = Number(b.periods || 3);
      const forecastResult = forecastRollingAverage(values, periods);

      const env = b.environment || "production";
      const period = b.period || "monthly";
      const observedCost = values.length ? values[values.length - 1] : 0;

      const dbRes = await queryDb(
        `INSERT INTO ai_cost_forecasts (environment, period, observed_cost, forecast_cost, forecast_method, confidence)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [env, period, observedCost, forecastResult.forecast, "rolling_average", forecastResult.confidence]
      );

      let item;
      if (dbRes && dbRes[0]) {
        item = dbRes[0];
      } else {
        item = {
          id: inMemForecasts.length + 1,
          environment: env,
          period,
          observed_cost: observedCost,
          forecast_cost: Number(forecastResult.forecast.toFixed(2)),
          forecast_method: "rolling_average",
          confidence: forecastResult.confidence,
          created_at: new Date().toISOString(),
        };
        inMemForecasts.unshift(item);
      }

      res.status(201).json({
        ok: true,
        forecast: forecastResult,
        item,
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // 14. POST /api/admin/ai/capacity-cost/cost-estimate
  app.post("/api/admin/ai/capacity-cost/cost-estimate", async (req: Request, res: Response) => {
    const b = req.body || {};
    const inputTokens = Number(b.inputTokens || 0);
    const outputTokens = Number(b.outputTokens || 0);
    const inputPricePer1k = Number(b.inputPricePer1k ?? 0.00015);
    const outputPricePer1k = Number(b.outputPricePer1k ?? 0.0006);

    const cost = estimateCost(inputTokens, outputTokens, inputPricePer1k, outputPricePer1k);
    res.json({
      ok: true,
      estimatedCost: Number(cost.toFixed(6)),
      inputTokens,
      outputTokens,
    });
  });

  // 15. GET /api/admin/ai/capacity-cost/audit
  app.get("/api/admin/ai/capacity-cost/audit", async (_req: Request, res: Response) => {
    try {
      const dbRes = await queryDb("SELECT * FROM ai_capacity_cost_audit ORDER BY id DESC LIMIT 100");
      const items = dbRes || inMemAudits;
      res.json({ ok: true, items });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });
}
