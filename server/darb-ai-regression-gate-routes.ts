/**
 * DARB AI V1.24 — AI Regression & Release Gate Routes
 * 
 * Standalone, cumulative patch over V1.23 / V1.22 / V1.21:
 * - Baseline / Current Run comparison
 * - Regression detection for Pass Rate, Latency, and Tokens
 * - Route/source/confidence/evidence/citations evaluation
 * - Configurable thresholds (minPassRateDrop, maxLatencyIncreaseRatio, maxTokenIncreaseRatio)
 * - Gate Status: PASS, REVIEW, BLOCKED
 * - Release Gate creation and human decision audit trail
 * - Strict Governance: Auto Publish = false (Zero knowledge write in Live)
 * - Dual-mode: PostgreSQL pool with resilient in-memory fallback
 */

import type { Express, Request, Response } from "express";
import {
  compareRuns,
  defaultThresholds,
  evaluateReleaseGate,
  buildDecisionReason,
  GateStatus,
  RegressionThresholds
} from "./darb-ai-regression-gate";

interface RegressionRunRow {
  id: number;
  baseline_job_id: number | null;
  current_job_id: number | null;
  baseline_pass_rate: number;
  current_pass_rate: number;
  baseline_latency_ms: number;
  current_latency_ms: number;
  baseline_tokens: number;
  current_tokens: number;
  delta_pass_rate: number;
  delta_latency_ms: number;
  delta_tokens: number;
  regression_detected: boolean;
  gate_status: GateStatus;
  details_json: any;
  created_at: string;
}

interface ReleaseGateRow {
  id: number;
  regression_run_id: number | null;
  release_label: string;
  status: GateStatus;
  threshold_json: any;
  decision_reason: string | null;
  reviewer_id: number | null;
  decided_at: string | null;
  created_at: string;
}

// In-memory fallback state with initial realistic history
const memRegressionRuns: RegressionRunRow[] = [
  {
    id: 1,
    baseline_job_id: 1,
    current_job_id: 2,
    baseline_pass_rate: 0.85,
    current_pass_rate: 0.88,
    baseline_latency_ms: 320,
    current_latency_ms: 295,
    baseline_tokens: 410,
    current_tokens: 390,
    delta_pass_rate: 0.03,
    delta_latency_ms: -25,
    delta_tokens: -20,
    regression_detected: false,
    gate_status: "pass",
    details_json: {
      thresholds: defaultThresholds(),
      reason: "تحسن في معدل النجاح وزمن الاستجابة واستهلاك الرموز دون تراجع."
    },
    created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString()
  }
];

const memReleaseGates: ReleaseGateRow[] = [
  {
    id: 1,
    regression_run_id: 1,
    release_label: "DARB AI Release candidate v1.23-rc1",
    status: "pass",
    threshold_json: defaultThresholds(),
    decision_reason: "اجتياز كامل بوابة الاختبارات المرجعية والتكاملية بدون تراجع.",
    reviewer_id: 99,
    decided_at: new Date(Date.now() - 3600 * 1000 * 23).toISOString(),
    created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString()
  }
];

export function registerDarbAIRegressionGateRoutes(app: Express, poolOrOpts?: any) {
  const pool = poolOrOpts?.query ? poolOrOpts : poolOrOpts?.pool;

  const q = async (sql: string, params: any[] = []) => {
    if (!pool?.query) {
      throw new Error("NO_POOL");
    }
    return pool.query(sql, params);
  };

  /**
   * POST /api/admin/ai/regression/compare
   * Compares baseline run with current run against thresholds
   */
  app.post("/api/admin/ai/regression/compare", async (req: Request, res: Response) => {
    const baseline = req.body?.baseline;
    const current = req.body?.current;

    if (!baseline || !current) {
      return res.status(400).json({
        ok: false,
        error: "baseline_and_current_are_required"
      });
    }

    const thresholds: RegressionThresholds = {
      ...defaultThresholds(),
      ...(req.body?.thresholds ?? {})
    };

    const comparison = compareRuns(baseline, current, thresholds);
    const reason = buildDecisionReason(comparison);

    const detailsJson = {
      thresholds,
      comparison,
      reason,
      routeComparison: req.body?.routeComparison ?? null,
      autoPublish: false
    };

    try {
      const result = await q(
        `INSERT INTO ai_regression_runs
        (baseline_job_id,current_job_id,baseline_pass_rate,current_pass_rate,
         baseline_latency_ms,current_latency_ms,baseline_tokens,current_tokens,
         delta_pass_rate,delta_latency_ms,delta_tokens,regression_detected,
         gate_status,details_json)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        RETURNING *`,
        [
          req.body?.baselineJobId ?? null,
          req.body?.currentJobId ?? null,
          baseline.passRate,
          current.passRate,
          baseline.avgLatencyMs,
          current.avgLatencyMs,
          baseline.avgTokens,
          current.avgTokens,
          comparison.deltaPassRate,
          comparison.deltaLatencyMs,
          comparison.deltaTokens,
          comparison.regressionDetected,
          comparison.gateStatus,
          JSON.stringify(detailsJson)
        ]
      );

      return res.json({
        ok: true,
        comparisonId: result.rows?.[0]?.id ?? null,
        thresholds,
        comparison,
        reason,
        mode: "postgres"
      });
    } catch {
      const newRunId = (memRegressionRuns[0]?.id || 0) + 1;
      const memRun: RegressionRunRow = {
        id: newRunId,
        baseline_job_id: req.body?.baselineJobId ?? null,
        current_job_id: req.body?.currentJobId ?? null,
        baseline_pass_rate: baseline.passRate,
        current_pass_rate: current.passRate,
        baseline_latency_ms: baseline.avgLatencyMs,
        current_latency_ms: current.avgLatencyMs,
        baseline_tokens: baseline.avgTokens,
        current_tokens: current.avgTokens,
        delta_pass_rate: comparison.deltaPassRate,
        delta_latency_ms: comparison.deltaLatencyMs,
        delta_tokens: comparison.deltaTokens,
        regression_detected: comparison.regressionDetected,
        gate_status: comparison.gateStatus,
        details_json: detailsJson,
        created_at: new Date().toISOString()
      };
      memRegressionRuns.unshift(memRun);

      return res.json({
        ok: true,
        mode: "memory",
        comparisonId: newRunId,
        thresholds,
        comparison,
        reason
      });
    }
  });

  /**
   * POST /api/admin/ai/regression/release-gate
   * Evaluates or updates a release gate decision (approve / reject / review)
   */
  app.post("/api/admin/ai/regression/release-gate", async (req: Request, res: Response) => {
    const comparison = req.body?.comparison;
    if (!comparison) {
      return res.status(400).json({
        ok: false,
        error: "comparison_is_required"
      });
    }

    const status = evaluateReleaseGate(
      comparison,
      req.body?.reviewerDecision
    );

    const reason =
      req.body?.decisionReason || buildDecisionReason(comparison);

    try {
      const result = await q(
        `INSERT INTO ai_release_gates
        (regression_run_id,release_label,status,threshold_json,decision_reason,
         reviewer_id,decided_at)
        VALUES ($1,$2,$3,$4,$5,$6,
          CASE WHEN $3 IN ('pass','blocked') THEN NOW() ELSE NULL END)
        RETURNING *`,
        [
          req.body?.regressionRunId ?? null,
          req.body?.releaseLabel ?? "DARB AI Release Gate",
          status,
          JSON.stringify(req.body?.thresholds ?? defaultThresholds()),
          reason,
          req.body?.reviewerId ?? 99
        ]
      );

      // Audit entry if available
      try {
        if (result.rows?.[0]?.id) {
          await q(
            `INSERT INTO ai_release_gate_audit(gate_id,action,actor_id,details_json)
             VALUES($1,$2,$3,$4)`,
            [
              result.rows[0].id,
              `release_gate_${status}`,
              req.body?.reviewerId ?? 99,
              JSON.stringify({ status, reason, autoPublish: false })
            ]
          );
        }
      } catch {
        // audit table optional
      }

      return res.json({
        ok: true,
        gateId: result.rows?.[0]?.id ?? null,
        status,
        reason,
        autoPublish: false,
        mode: "postgres"
      });
    } catch {
      const newGateId = (memReleaseGates[0]?.id || 0) + 1;
      const memGate: ReleaseGateRow = {
        id: newGateId,
        regression_run_id: req.body?.regressionRunId ?? null,
        release_label: req.body?.releaseLabel ?? "DARB AI Release Gate",
        status,
        threshold_json: req.body?.thresholds ?? defaultThresholds(),
        decision_reason: reason,
        reviewer_id: req.body?.reviewerId ?? 99,
        decided_at: ["pass", "blocked"].includes(status) ? new Date().toISOString() : null,
        created_at: new Date().toISOString()
      };
      memReleaseGates.unshift(memGate);

      return res.json({
        ok: true,
        gateId: newGateId,
        status,
        reason,
        autoPublish: false,
        mode: "memory"
      });
    }
  });

  /**
   * GET /api/admin/ai/regression/runs
   */
  app.get("/api/admin/ai/regression/runs", async (_req: Request, res: Response) => {
    try {
      const result = await q(
        `SELECT * FROM ai_regression_runs
         ORDER BY created_at DESC LIMIT 100`
      );
      return res.json({ ok: true, runs: result.rows ?? [], mode: "postgres" });
    } catch {
      return res.json({ ok: true, runs: memRegressionRuns, mode: "memory" });
    }
  });

  /**
   * GET /api/admin/ai/regression/release-gates
   */
  app.get("/api/admin/ai/regression/release-gates", async (_req: Request, res: Response) => {
    try {
      const result = await q(
        `SELECT * FROM ai_release_gates
         ORDER BY created_at DESC LIMIT 100`
      );
      return res.json({ ok: true, gates: result.rows ?? [], mode: "postgres" });
    } catch {
      return res.json({ ok: true, gates: memReleaseGates, mode: "memory" });
    }
  });
}
