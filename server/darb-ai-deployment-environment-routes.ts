import type { Express, Request, Response } from "express";
import {
  ENVIRONMENTS,
  createDeploymentCorrelationId,
  buildPreflightChecks,
  deploymentChecklist,
  canDeploy,
  snapshotHash,
  requiresHumanApproval,
  type DeploymentStatus
} from "./darb-ai-deployment-environment-manager";

interface EnvironmentRow {
  id: number;
  environment_key: string;
  display_name: string;
  protected: boolean;
  active_version_id: number | null;
  config_snapshot_json?: any;
  created_at?: string;
  updated_at?: string;
}

interface DeploymentJobRow {
  id: number;
  environment_id: number;
  version_id: number;
  source_environment_id: number | null;
  status: DeploymentStatus;
  correlation_id: string;
  preflight_json: any;
  checklist_json: any;
  requested_by: number | null;
  approved_by: number | null;
  requested_at: string;
  approved_at: string | null;
  deployed_at: string | null;
  rollback_of_job_id: number | null;
  reason: string;
}

interface DeploymentAuditRow {
  id: number;
  job_id: number | null;
  environment_id: number | null;
  version_id: number | null;
  action: string;
  actor_id: number | null;
  from_status: string | null;
  to_status: string | null;
  reason: string;
  details_json: any;
  created_at: string;
}

// In-memory fallback stores
const memEnvironments: EnvironmentRow[] = [
  {
    id: 1,
    environment_key: "development",
    display_name: "Development",
    protected: false,
    active_version_id: 1,
    config_snapshot_json: { mode: "dev", autoHotReload: true },
    created_at: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    environment_key: "staging",
    display_name: "Staging",
    protected: true,
    active_version_id: 1,
    config_snapshot_json: { mode: "staging", releaseGateProtected: true },
    created_at: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    environment_key: "production",
    display_name: "Production",
    protected: true,
    active_version_id: 1,
    config_snapshot_json: { mode: "production", strictHumanApproval: true },
    created_at: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const memJobs: DeploymentJobRow[] = [
  {
    id: 1,
    environment_id: 3,
    version_id: 1,
    source_environment_id: 2,
    status: "deployed",
    correlation_id: "dep_init_baseline_v124",
    preflight_json: {
      passed: true,
      checks: [
        { key: "release_gate", status: "pass", expected: "pass", actual: "pass" },
        { key: "version_status", status: "pass", expected: "candidate|approved|active", actual: "active" },
        { key: "environment_path", status: "pass", expected: "staging -> production", actual: "staging -> production" },
        { key: "config_consistency", status: "pass", expected: "consistent", actual: "consistent" }
      ]
    },
    checklist_json: {
      releaseGateVerified: true,
      versionVerified: true,
      snapshotVerified: true,
      preflightPassed: true,
      humanApproval: true,
      rollbackPlanConfirmed: true
    },
    requested_by: 99,
    approved_by: 99,
    requested_at: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
    approved_at: new Date(Date.now() - 3600 * 1000 * 19).toISOString(),
    deployed_at: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
    rollback_of_job_id: null,
    reason: "نشر الإصدار الأساسي المعتمد DARB AI V1.24 في بيئة الإنتاج"
  }
];

const memAudits: DeploymentAuditRow[] = [
  {
    id: 1,
    job_id: 1,
    environment_id: 3,
    version_id: 1,
    action: "deploy",
    actor_id: 99,
    from_status: "approved",
    to_status: "deployed",
    reason: "نشر الإصدار الأساسي المعتمد DARB AI V1.24 في بيئة الإنتاج",
    details_json: { autoDeploy: false, correlationId: "dep_init_baseline_v124" },
    created_at: new Date(Date.now() - 3600 * 1000 * 18).toISOString()
  }
];

let nextJobId = 2;
let nextAuditId = 2;

export function registerDarbAIDeploymentEnvironmentRoutes(app: Express, poolOrOpts?: any) {
  const pool = poolOrOpts?.query ? poolOrOpts : poolOrOpts?.pool;

  const q = async (sql: string, params: any[] = []) => {
    if (!pool?.query) {
      throw new Error("NO_POOL");
    }
    return pool.query(sql, params);
  };

  // Safe table bootstrap if pool is available
  if (pool?.query) {
    (async () => {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS ai_deployment_environments (
            id BIGSERIAL PRIMARY KEY,
            environment_key TEXT NOT NULL UNIQUE,
            display_name TEXT NOT NULL,
            protected BOOLEAN NOT NULL DEFAULT FALSE,
            active_version_id BIGINT,
            config_snapshot_json JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS ai_deployment_jobs (
            id BIGSERIAL PRIMARY KEY,
            environment_id BIGINT,
            version_id BIGINT,
            source_environment_id BIGINT,
            status TEXT NOT NULL DEFAULT 'pending',
            correlation_id TEXT,
            preflight_json JSONB NOT NULL DEFAULT '{}'::jsonb,
            checklist_json JSONB NOT NULL DEFAULT '{}'::jsonb,
            requested_by BIGINT,
            approved_by BIGINT,
            requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            approved_at TIMESTAMPTZ,
            deployed_at TIMESTAMPTZ,
            rollback_of_job_id BIGINT,
            reason TEXT
          );

          CREATE TABLE IF NOT EXISTS ai_deployment_audit (
            id BIGSERIAL PRIMARY KEY,
            job_id BIGINT,
            environment_id BIGINT,
            version_id BIGINT,
            action TEXT NOT NULL,
            actor_id BIGINT,
            from_status TEXT,
            to_status TEXT,
            reason TEXT,
            details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS ai_environment_checks (
            id BIGSERIAL PRIMARY KEY,
            job_id BIGINT,
            check_key TEXT NOT NULL,
            status TEXT NOT NULL,
            expected TEXT,
            actual TEXT,
            details TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          INSERT INTO ai_deployment_environments
          (environment_key, display_name, protected, active_version_id)
          VALUES
          ('development', 'Development', FALSE, 1),
          ('staging', 'Staging', TRUE, 1),
          ('production', 'Production', TRUE, 1)
          ON CONFLICT (environment_key) DO NOTHING;
        `);
      } catch (err) {
        console.warn("[V1.26] DB bootstrap warning:", err);
      }
    })();
  }

  /**
   * GET /api/admin/ai/deployments/environments
   */
  app.get("/api/admin/ai/deployments/environments", async (_req: Request, res: Response) => {
    try {
      const result = await q(
        `SELECT * FROM ai_deployment_environments ORDER BY id ASC`
      );
      res.json({ ok: true, environments: result.rows ?? [], mode: "postgres" });
    } catch {
      res.json({
        ok: true,
        environments: memEnvironments,
        mode: "memory"
      });
    }
  });

  /**
   * GET /api/admin/ai/deployments/jobs
   */
  app.get("/api/admin/ai/deployments/jobs", async (_req: Request, res: Response) => {
    try {
      const result = await q(
        `SELECT j.*, e.environment_key, e.display_name as environment_name
         FROM ai_deployment_jobs j
         LEFT JOIN ai_deployment_environments e ON e.id = j.environment_id
         ORDER BY j.requested_at DESC LIMIT 200`
      );
      res.json({ ok: true, jobs: result.rows ?? [], mode: "postgres" });
    } catch {
      const sorted = [...memJobs].sort(
        (a, b) => new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()
      );
      const enhanced = sorted.map((j) => {
        const env = memEnvironments.find((e) => e.id === j.environment_id);
        return {
          ...j,
          environment_key: env?.environment_key || "unknown",
          environment_name: env?.display_name || "Unknown"
        };
      });
      res.json({ ok: true, jobs: enhanced, mode: "memory" });
    }
  });

  /**
   * GET /api/admin/ai/deployments/audit
   */
  app.get("/api/admin/ai/deployments/audit", async (_req: Request, res: Response) => {
    try {
      const result = await q(
        `SELECT a.*, e.environment_key
         FROM ai_deployment_audit a
         LEFT JOIN ai_deployment_environments e ON e.id = a.environment_id
         ORDER BY a.created_at DESC LIMIT 300`
      );
      res.json({ ok: true, audit: result.rows ?? [], mode: "postgres" });
    } catch {
      const sorted = [...memAudits].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const enhanced = sorted.map((a) => {
        const env = memEnvironments.find((e) => e.id === a.environment_id);
        return {
          ...a,
          environment_key: env?.environment_key || "unknown"
        };
      });
      res.json({ ok: true, audit: enhanced, mode: "memory" });
    }
  });

  /**
   * POST /api/admin/ai/deployments/preflight
   */
  app.post("/api/admin/ai/deployments/preflight", async (req: Request, res: Response) => {
    const targetEnvironment = String(req.body?.targetEnvironment ?? "production");
    const sourceEnvironment = req.body?.sourceEnvironment ? String(req.body.sourceEnvironment) : undefined;
    const releaseGateStatus = String(req.body?.releaseGateStatus ?? "review");
    const versionStatus = String(req.body?.versionStatus ?? "candidate");
    const configMatch = req.body?.configMatch !== undefined ? Boolean(req.body.configMatch) : true;

    const result = buildPreflightChecks({
      releaseGateStatus,
      versionStatus,
      sourceEnvironment,
      targetEnvironment,
      configMatch,
    });

    const isProtected = requiresHumanApproval(targetEnvironment);

    res.json({
      ok: true,
      targetEnvironment,
      sourceEnvironment,
      ...result,
      humanApprovalRequired: isProtected,
      autoDeploy: false,
      governanceNotice: "Auto Deploy is strictly disabled. Manual human verification required."
    });
  });

  /**
   * POST /api/admin/ai/deployments/jobs
   */
  app.post("/api/admin/ai/deployments/jobs", async (req: Request, res: Response) => {
    const target = String(req.body?.targetEnvironment ?? "");
    const versionId = Number(req.body?.versionId);
    const sourceEnvironment = String(req.body?.sourceEnvironment ?? "development");
    const actorId = req.body?.actorId ? Number(req.body.actorId) : 99;
    const reason = String(req.body?.reason ?? "").trim();
    const releaseGateStatus = String(req.body?.releaseGateStatus ?? "pass");
    const versionStatus = String(req.body?.versionStatus ?? "candidate");

    if (!ENVIRONMENTS.includes(target as any) || !versionId) {
      return res.status(400).json({
        ok: false,
        error: "targetEnvironment_and_versionId_are_required"
      });
    }

    const preflight = buildPreflightChecks({
      releaseGateStatus,
      versionStatus,
      sourceEnvironment,
      targetEnvironment: target,
      configMatch: true
    });

    const correlationId = createDeploymentCorrelationId();
    const checklist = deploymentChecklist(target);
    const initialStatus: DeploymentStatus = preflight.passed ? "preflight_passed" : "pending";

    try {
      const result = await q(
        `INSERT INTO ai_deployment_jobs
         (environment_id, version_id, source_environment_id, status, correlation_id, preflight_json, checklist_json, requested_by, reason)
         SELECT e.id, $1, se.id, $2, $3, $4, $5, $6, $7
         FROM ai_deployment_environments e
         LEFT JOIN ai_deployment_environments se ON se.environment_key = $8
         WHERE e.environment_key = $9
         RETURNING *`,
        [
          versionId,
          initialStatus,
          correlationId,
          JSON.stringify(preflight),
          JSON.stringify(checklist),
          actorId,
          reason,
          sourceEnvironment,
          target
        ]
      );

      const job = result.rows?.[0] ?? null;

      if (job?.id) {
        await q(
          `INSERT INTO ai_deployment_audit
           (job_id, environment_id, version_id, action, actor_id, from_status, to_status, reason, details_json)
           VALUES ($1, $2, $3, 'create', $4, NULL, $5, $6, $7)`,
          [
            job.id,
            job.environment_id,
            versionId,
            actorId,
            initialStatus,
            reason,
            JSON.stringify({ autoDeploy: false, correlationId, preflightPassed: preflight.passed })
          ]
        );
      }

      res.json({
        ok: true,
        job,
        correlationId,
        autoDeploy: false,
        humanApprovalRequired: requiresHumanApproval(target),
        mode: "postgres"
      });
    } catch {
      // Memory fallback
      const targetEnv = memEnvironments.find((e) => e.environment_key === target) || memEnvironments[0];
      const sourceEnv = memEnvironments.find((e) => e.environment_key === sourceEnvironment);

      const newJob: DeploymentJobRow = {
        id: nextJobId++,
        environment_id: targetEnv.id,
        version_id: versionId,
        source_environment_id: sourceEnv ? sourceEnv.id : null,
        status: initialStatus,
        correlation_id: correlationId,
        preflight_json: preflight,
        checklist_json: checklist,
        requested_by: actorId,
        approved_by: null,
        requested_at: new Date().toISOString(),
        approved_at: null,
        deployed_at: null,
        rollback_of_job_id: null,
        reason
      };

      memJobs.push(newJob);

      memAudits.push({
        id: nextAuditId++,
        job_id: newJob.id,
        environment_id: targetEnv.id,
        version_id: versionId,
        action: "create",
        actor_id: actorId,
        from_status: null,
        to_status: initialStatus,
        reason,
        details_json: { autoDeploy: false, correlationId, preflightPassed: preflight.passed },
        created_at: new Date().toISOString()
      });

      res.json({
        ok: true,
        mode: "memory",
        job: {
          ...newJob,
          environment_key: targetEnv.environment_key,
          environment_name: targetEnv.display_name
        },
        correlationId,
        autoDeploy: false,
        humanApprovalRequired: requiresHumanApproval(target)
      });
    }
  });

  /**
   * POST /api/admin/ai/deployments/jobs/:id/approve
   */
  app.post("/api/admin/ai/deployments/jobs/:id/approve", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const actorId = req.body?.actorId ? Number(req.body.actorId) : 99;
    const reason = String(req.body?.reason ?? "").trim();

    if (!id) {
      return res.status(400).json({ ok: false, error: "invalid_job_id" });
    }

    try {
      const result = await q(
        `UPDATE ai_deployment_jobs
         SET status='approved', approved_by=$1, approved_at=NOW()
         WHERE id=$2 AND status IN ('awaiting_approval', 'preflight_passed', 'pending')
         RETURNING *`,
        [actorId, id]
      );

      const job = result.rows?.[0];
      if (!job) {
        return res.status(409).json({
          ok: false,
          error: "job_not_ready_for_approval"
        });
      }

      await q(
        `INSERT INTO ai_deployment_audit
         (job_id, environment_id, version_id, action, actor_id, from_status, to_status, reason, details_json)
         VALUES ($1, $2, $3, 'approve', $4, $5, 'approved', $6, $7)`,
        [
          id,
          job.environment_id,
          job.version_id,
          actorId,
          job.status,
          reason || "موافقة بشرية صريحة للنشر",
          JSON.stringify({ autoDeploy: false, approvedBy: actorId })
        ]
      );

      res.json({
        ok: true,
        job,
        message: "تم تسجيل الموافقة البشرية الصريحة فقط. لم يتم النشر تلقائيًا (Auto Deploy Disabled).",
        mode: "postgres"
      });
    } catch {
      // Memory fallback
      const job = memJobs.find((j) => j.id === id);
      if (!job) {
        return res.status(404).json({ ok: false, error: "job_not_found" });
      }

      const prevStatus = job.status;
      job.status = "approved";
      job.approved_by = actorId;
      job.approved_at = new Date().toISOString();

      memAudits.push({
        id: nextAuditId++,
        job_id: id,
        environment_id: job.environment_id,
        version_id: job.version_id,
        action: "approve",
        actor_id: actorId,
        from_status: prevStatus,
        to_status: "approved",
        reason: reason || "موافقة بشرية صريحة للنشر",
        details_json: { autoDeploy: false, approvedBy: actorId },
        created_at: new Date().toISOString()
      });

      res.json({
        ok: true,
        mode: "memory",
        job,
        message: "تم تسجيل الموافقة البشرية الصريحة فقط. لم يتم النشر تلقائيًا (Auto Deploy Disabled)."
      });
    }
  });

  /**
   * POST /api/admin/ai/deployments/jobs/:id/deploy
   */
  app.post("/api/admin/ai/deployments/jobs/:id/deploy", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const actorId = req.body?.actorId ? Number(req.body.actorId) : 99;
    const reason = String(req.body?.reason ?? "").trim();

    if (!id) {
      return res.status(400).json({ ok: false, error: "invalid_job_id" });
    }

    try {
      const jobResult = await q(
        `SELECT j.*, e.environment_key, e.protected
         FROM ai_deployment_jobs j
         LEFT JOIN ai_deployment_environments e ON e.id = j.environment_id
         WHERE j.id = $1`,
        [id]
      );
      const job = jobResult.rows?.[0];

      if (!job) {
        return res.status(404).json({ ok: false, error: "job_not_found" });
      }

      if (requiresHumanApproval(job.environment_key) && job.status !== "approved") {
        return res.status(409).json({
          ok: false,
          error: "human_approval_required_before_deploy",
          message: "البيئة محمية؛ تتطلب موافقة بشرية صريحة (Human Approval) قبل تنفيذ النشر الفعلي."
        });
      }

      const prevStatus = job.status;
      await q(
        `UPDATE ai_deployment_jobs
         SET status='deployed', deployed_at=NOW()
         WHERE id=$1`,
        [id]
      );

      await q(
        `UPDATE ai_deployment_environments
         SET active_version_id=$1, updated_at=NOW()
         WHERE id=$2`,
        [job.version_id, job.environment_id]
      );

      await q(
        `INSERT INTO ai_deployment_audit
         (job_id, environment_id, version_id, action, actor_id, from_status, to_status, reason, details_json)
         VALUES ($1, $2, $3, 'deploy', $4, $5, 'deployed', $6, $7)`,
        [
          id,
          job.environment_id,
          job.version_id,
          actorId,
          prevStatus,
          reason || "تنفيذ النشر اليدوي المعتمد",
          JSON.stringify({ autoDeploy: false, correlationId: job.correlation_id })
        ]
      );

      res.json({
        ok: true,
        status: "deployed",
        jobId: id,
        versionId: job.version_id,
        environment: job.environment_key,
        autoDeploy: false,
        mode: "postgres"
      });
    } catch {
      // Memory fallback
      const job = memJobs.find((j) => j.id === id);
      if (!job) {
        return res.status(404).json({ ok: false, error: "job_not_found" });
      }

      const env = memEnvironments.find((e) => e.id === job.environment_id);
      if (env && requiresHumanApproval(env.environment_key) && job.status !== "approved") {
        return res.status(409).json({
          ok: false,
          error: "human_approval_required_before_deploy",
          message: "البيئة محمية؛ تتطلب موافقة بشرية صريحة (Human Approval) قبل تنفيذ النشر الفعلي."
        });
      }

      const prevStatus = job.status;
      job.status = "deployed";
      job.deployed_at = new Date().toISOString();

      if (env) {
        env.active_version_id = job.version_id;
        env.updated_at = new Date().toISOString();
      }

      memAudits.push({
        id: nextAuditId++,
        job_id: id,
        environment_id: job.environment_id,
        version_id: job.version_id,
        action: "deploy",
        actor_id: actorId,
        from_status: prevStatus,
        to_status: "deployed",
        reason: reason || "تنفيذ النشر اليدوي المعتمد",
        details_json: { autoDeploy: false, correlationId: job.correlation_id },
        created_at: new Date().toISOString()
      });

      res.json({
        ok: true,
        mode: "memory",
        status: "deployed",
        jobId: id,
        versionId: job.version_id,
        environment: env?.environment_key || "unknown",
        autoDeploy: false
      });
    }
  });

  /**
   * POST /api/admin/ai/deployments/jobs/:id/rollback
   */
  app.post("/api/admin/ai/deployments/jobs/:id/rollback", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const targetVersionId = Number(req.body?.targetVersionId);
    const actorId = req.body?.actorId ? Number(req.body.actorId) : 99;
    const reason = String(req.body?.reason ?? "").trim();

    if (!id || !targetVersionId || !reason) {
      return res.status(400).json({
        ok: false,
        error: "job_targetVersionId_and_reason_are_required",
        message: "سبب التراجع والنسخة المستهدفة إلزاميان بموجب ضوابط الحوكمة."
      });
    }

    try {
      const jobResult = await q(`SELECT * FROM ai_deployment_jobs WHERE id=$1`, [id]);
      const job = jobResult.rows?.[0];

      if (!job) {
        return res.status(404).json({ ok: false, error: "job_not_found" });
      }

      await q(
        `UPDATE ai_deployment_environments
         SET active_version_id=$1, updated_at=NOW()
         WHERE id=$2`,
        [targetVersionId, job.environment_id]
      );

      const rollbackCorrelation = createDeploymentCorrelationId();
      const rollbackResult = await q(
        `INSERT INTO ai_deployment_jobs
         (environment_id, version_id, status, correlation_id, requested_by, approved_by, deployed_at, rollback_of_job_id, reason)
         VALUES ($1, $2, 'deployed', $3, $4, $4, NOW(), $5, $6)
         RETURNING *`,
        [
          job.environment_id,
          targetVersionId,
          rollbackCorrelation,
          actorId,
          id,
          reason
        ]
      );

      await q(`UPDATE ai_deployment_jobs SET status='rolled_back' WHERE id=$1`, [id]);

      await q(
        `INSERT INTO ai_deployment_audit
         (job_id, environment_id, version_id, action, actor_id, from_status, to_status, reason, details_json)
         VALUES ($1, $2, $3, 'rollback', $4, $5, 'rolled_back', $6, $7)`,
        [
          id,
          job.environment_id,
          targetVersionId,
          actorId,
          job.status,
          reason,
          JSON.stringify({
            autoDeploy: false,
            targetVersionId,
            rollbackJobId: rollbackResult.rows?.[0]?.id ?? null,
            correlationId: rollbackCorrelation
          })
        ]
      );

      res.json({
        ok: true,
        action: "rollback",
        jobId: id,
        targetVersionId,
        rollbackJobId: rollbackResult.rows?.[0]?.id ?? null,
        autoDeploy: false,
        mode: "postgres"
      });
    } catch {
      // Memory fallback
      const job = memJobs.find((j) => j.id === id);
      if (!job) {
        return res.status(404).json({ ok: false, error: "job_not_found" });
      }

      const env = memEnvironments.find((e) => e.id === job.environment_id);
      if (env) {
        env.active_version_id = targetVersionId;
        env.updated_at = new Date().toISOString();
      }

      const prevStatus = job.status;
      job.status = "rolled_back";

      const rollbackCorrelation = createDeploymentCorrelationId();
      const rollbackJob: DeploymentJobRow = {
        id: nextJobId++,
        environment_id: job.environment_id,
        version_id: targetVersionId,
        source_environment_id: null,
        status: "deployed",
        correlation_id: rollbackCorrelation,
        preflight_json: { rollback: true, verified: true },
        checklist_json: { rollbackConfirmed: true, humanApproval: true },
        requested_by: actorId,
        approved_by: actorId,
        requested_at: new Date().toISOString(),
        approved_at: new Date().toISOString(),
        deployed_at: new Date().toISOString(),
        rollback_of_job_id: id,
        reason
      };
      memJobs.push(rollbackJob);

      memAudits.push({
        id: nextAuditId++,
        job_id: id,
        environment_id: job.environment_id,
        version_id: targetVersionId,
        action: "rollback",
        actor_id: actorId,
        from_status: prevStatus,
        to_status: "rolled_back",
        reason,
        details_json: {
          autoDeploy: false,
          targetVersionId,
          rollbackJobId: rollbackJob.id,
          correlationId: rollbackCorrelation
        },
        created_at: new Date().toISOString()
      });

      res.json({
        ok: true,
        mode: "memory",
        action: "rollback",
        jobId: id,
        targetVersionId,
        rollbackJobId: rollbackJob.id,
        autoDeploy: false
      });
    }
  });

  /**
   * POST /api/admin/ai/deployments/config-hash
   */
  app.post("/api/admin/ai/deployments/config-hash", async (req: Request, res: Response) => {
    res.json({
      ok: true,
      algorithm: "sha256",
      checksum: snapshotHash(req.body?.snapshot ?? {})
    });
  });
}
