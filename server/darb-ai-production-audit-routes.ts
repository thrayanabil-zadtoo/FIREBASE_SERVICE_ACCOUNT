import { Express, Request, Response } from "express";
import { DarbAIProductionAuditManager } from "./darb-ai-production-audit-manager";

export function registerDarbAIProductionAuditRoutes(
  app: Express,
  options: {
    pool?: any;
    isAdmin?: (req: Request) => boolean | Promise<boolean>;
  }
) {
  const manager = new DarbAIProductionAuditManager(options.pool);

  // Helper check for admin authorization
  const checkAdmin = async (req: Request, res: Response): Promise<boolean> => {
    if (options.isAdmin) {
      const allowed = await Promise.resolve(options.isAdmin(req));
      if (!allowed) {
        res.status(403).json({
          ok: false,
          error: "صلاحية المشرف (Admin) مطلوبة للوصول لهذا الإجراء التشغيلي الحرج",
          correlationId: manager.generateCorrelationId("AUTH-DENIED")
        });
        return false;
      }
    }
    return true;
  };

  // 1. GET /api/admin/ai/production-audit/summary
  app.get("/api/admin/ai/production-audit/summary", async (req: Request, res: Response) => {
    if (!(await checkAdmin(req, res))) return;
    const env = (req.query.environment as string) || "production";
    const summary = manager.getSummary(env);
    res.json({
      ok: true,
      summary,
      correlationId: summary.correlationId,
      timestamp: new Date().toISOString()
    });
  });

  // 2. GET /api/admin/ai/production-audit/checklist
  app.get("/api/admin/ai/production-audit/checklist", async (req: Request, res: Response) => {
    if (!(await checkAdmin(req, res))) return;
    const items = manager.getChecklist();
    res.json({
      ok: true,
      items,
      total: items.length,
      correlationId: manager.generateCorrelationId("AUDIT-CHK")
    });
  });

  // 3. GET /api/admin/ai/production-audit/routes-matrix
  app.get("/api/admin/ai/production-audit/routes-matrix", async (req: Request, res: Response) => {
    if (!(await checkAdmin(req, res))) return;
    const routes = manager.getRoutesMatrix();
    res.json({
      ok: true,
      routes,
      total: routes.length,
      correlationId: manager.generateCorrelationId("AUDIT-RTS")
    });
  });

  // 4. GET /api/admin/ai/production-audit/smoke-tests
  app.get("/api/admin/ai/production-audit/smoke-tests", async (req: Request, res: Response) => {
    if (!(await checkAdmin(req, res))) return;
    const tests = manager.getSmokeTests();
    res.json({
      ok: true,
      tests,
      total: tests.length,
      correlationId: manager.generateCorrelationId("AUDIT-SMK")
    });
  });

  // 5. GET /api/admin/ai/production-audit/signoffs
  app.get("/api/admin/ai/production-audit/signoffs", async (req: Request, res: Response) => {
    if (!(await checkAdmin(req, res))) return;
    try {
      const signoffs = await manager.getSignoffs();
      res.json({
        ok: true,
        signoffs,
        correlationId: manager.generateCorrelationId("AUDIT-SGN")
      });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e.message || "Failed to load signoffs" });
    }
  });

  // 6. POST /api/admin/ai/production-audit/signoffs (Record Final Production Sign-off)
  app.post("/api/admin/ai/production-audit/signoffs", async (req: Request, res: Response) => {
    if (!(await checkAdmin(req, res))) return;
    const { version, environment, decision, actor, reason, gateResults, criticalFindings } = req.body;

    if (!actor || typeof actor !== "string" || !actor.trim()) {
      return res.status(400).json({
        ok: false,
        error: "حقل اسم المسؤول المعتمد (actor) إلزامي لتوقيع وثيقة الاعتماد النهائي.",
        correlationId: manager.generateCorrelationId("SGN-VAL-ERR")
      });
    }

    if (!reason || typeof reason !== "string" || !reason.trim()) {
      return res.status(400).json({
        ok: false,
        error: "حقل المبرر التشغيلي والملاحظات (reason) إلزامي لتوثيق القرار النهائي.",
        correlationId: manager.generateCorrelationId("SGN-VAL-ERR")
      });
    }

    const validDecisions = ["APPROVED", "REVIEW_REQUIRED", "BLOCKED"];
    if (!decision || !validDecisions.includes(decision)) {
      return res.status(400).json({
        ok: false,
        error: "قرار الاعتماد غير صالح. يجب أن يكون APPROVED أو REVIEW_REQUIRED أو BLOCKED.",
        correlationId: manager.generateCorrelationId("SGN-VAL-ERR")
      });
    }

    try {
      const record = await manager.recordSignoff({
        version: version || "V1.30",
        environment: environment || "production",
        decision,
        actor: actor.trim(),
        reason: reason.trim(),
        gateResults,
        criticalFindings
      });

      res.status(201).json({
        ok: true,
        signoff: record,
        notice: "تم تسجيل وتوثيق وثيقة الاعتماد النهائي بنجاح.",
        correlationId: record.correlationId
      });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e.message || "Failed to record signoff" });
    }
  });

  // 7. GET /api/admin/ai/production-audit/governance-gate
  app.get("/api/admin/ai/production-audit/governance-gate", async (req: Request, res: Response) => {
    if (!(await checkAdmin(req, res))) return;
    res.json({
      ok: true,
      governance: DarbAIProductionAuditManager.GOVERNANCE_FLAGS,
      mandatoryPolicies: {
        autoRemediation: "OFF",
        autoRollback: "OFF",
        autoDeploy: "OFF",
        autoScaling: "OFF",
        autoOptimizationApply: "OFF",
        humanApproval: "REQUIRED",
        secretsExposedToFrontend: "NONE",
        secretsExposedToLogs: "NONE"
      },
      correlationId: manager.generateCorrelationId("GOV-GATE")
    });
  });
}
