import type { Express, Request, Response } from "express";
import {
  snapshotChecksum,
  canTransition,
  releaseGateAllowsCandidate,
  releaseGateAllowsActivation,
  buildVersionMetadata,
  buildAuditDetails,
  type ReleaseStatus,
} from "./darb-ai-release-version-manager";

interface VersionRow {
  id: number;
  version_label: string;
  status: ReleaseStatus;
  release_gate_id: number | null;
  parent_version_id: number | null;
  config_snapshot_json: any;
  metadata_json: any;
  created_by: number | null;
  approved_by: number | null;
  approved_at: string | null;
  activated_at: string | null;
  retired_at: string | null;
  created_at: string;
}

interface SnapshotRow {
  id: number;
  version_id: number;
  snapshot_type: string;
  snapshot_json: any;
  checksum: string;
  created_at: string;
}

interface AuditRow {
  id: number;
  version_id: number;
  action: string;
  actor_id: number | null;
  from_status: string | null;
  to_status: string | null;
  reason: string;
  details_json: any;
  created_at: string;
}

// Memory fallback store
const initialConfigSnapshotV124 = {
  version: "1.24",
  orchestrator: { enabled: true, mode: "hybrid_rag" },
  search: { trustedOnly: true, maxResults: 10 },
  knowledgeGovernance: { autoPublish: false, requireHumanApproval: true },
  evaluationGate: { minPassRateDrop: 0.02, maxLatencyRatio: 0.25 }
};

const initialChecksumV124 = snapshotChecksum(initialConfigSnapshotV124);

const memVersions: VersionRow[] = [
  {
    id: 1,
    version_label: "DARB AI V1.24 — Release Gate Standard",
    status: "active",
    release_gate_id: 1,
    parent_version_id: null,
    config_snapshot_json: initialConfigSnapshotV124,
    metadata_json: {
      description: "النسخة المعتمدة والمستقرة لمحرك DARB AI مع بوابة فحص التراجع V1.24",
      gateStatus: "pass",
      autoPublish: false,
      checksum: initialChecksumV124
    },
    created_by: 99,
    approved_by: 99,
    approved_at: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
    activated_at: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
    retired_at: null,
    created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString()
  },
  {
    id: 2,
    version_label: "DARB AI V1.25 — Candidate Build RC1",
    status: "candidate",
    release_gate_id: 2,
    parent_version_id: 1,
    config_snapshot_json: {
      ...initialConfigSnapshotV124,
      version: "1.25",
      releaseManager: { enabled: true, manualRollback: true }
    },
    metadata_json: {
      description: "نسخة مرشحة جديدة تتضمن إدارة الإصدارات والتراجع اليدوي الآمن",
      gateStatus: "pass",
      autoPublish: false
    },
    created_by: 99,
    approved_by: null,
    approved_at: null,
    activated_at: null,
    retired_at: null,
    created_at: new Date(Date.now() - 3600 * 1000 * 6).toISOString()
  }
];

const memSnapshots: SnapshotRow[] = [
  {
    id: 1,
    version_id: 1,
    snapshot_type: "config",
    snapshot_json: initialConfigSnapshotV124,
    checksum: initialChecksumV124,
    created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString()
  }
];

const memAudits: AuditRow[] = [
  {
    id: 1,
    version_id: 1,
    action: "activate",
    actor_id: 99,
    from_status: "approved",
    to_status: "active",
    reason: "تفعيل الإصدار المعتمد V1.24 بعد اجتياز بوابة التقييم والجودة",
    details_json: { action: "activate", autoPublish: false },
    created_at: new Date(Date.now() - 3600 * 1000 * 18).toISOString()
  }
];

let memActiveVersionId = 1;

export function registerDarbAIReleaseVersionRoutes(app: Express, poolOrOpts?: any) {
  const pool = poolOrOpts?.query ? poolOrOpts : poolOrOpts?.pool;

  const q = async (sql: string, params: any[] = []) => {
    if (!pool?.query) {
      throw new Error("NO_POOL");
    }
    return pool.query(sql, params);
  };

  /**
   * GET /api/admin/ai/releases/versions
   */
  app.get("/api/admin/ai/releases/versions", async (_req: Request, res: Response) => {
    try {
      const result = await q(
        `SELECT v.*, s.checksum as latest_checksum
         FROM ai_release_versions v
         LEFT JOIN LATERAL (
           SELECT checksum FROM ai_release_version_snapshots s 
           WHERE s.version_id = v.id 
           ORDER BY s.created_at DESC LIMIT 1
         ) s ON true
         ORDER BY v.created_at DESC LIMIT 200`
      );
      res.json({ ok: true, versions: result.rows ?? [], mode: "postgres" });
    } catch {
      // Memory fallback: attach checksums
      const list = memVersions.map((v) => {
        const snap = memSnapshots.find((s) => s.version_id === v.id);
        return {
          ...v,
          latest_checksum: snap?.checksum ?? snapshotChecksum(v.config_snapshot_json)
        };
      });
      res.json({ ok: true, versions: list, mode: "memory" });
    }
  });

  /**
   * GET /api/admin/ai/releases/active
   */
  app.get("/api/admin/ai/releases/active", async (_req: Request, res: Response) => {
    try {
      const result = await q(
        `SELECT p.*, v.version_label, v.status, v.release_gate_id, v.parent_version_id,
                v.activated_at, s.checksum as active_checksum
         FROM ai_release_active_pointer p
         LEFT JOIN ai_release_versions v ON v.id=p.active_version_id
         LEFT JOIN LATERAL (
           SELECT checksum FROM ai_release_version_snapshots s 
           WHERE s.version_id = v.id 
           ORDER BY s.created_at DESC LIMIT 1
         ) s ON true
         WHERE p.id=1`
      );
      res.json({ ok: true, active: result.rows?.[0] ?? null, mode: "postgres" });
    } catch {
      const activeV = memVersions.find((v) => v.id === memActiveVersionId) || memVersions[0] || null;
      const snap = activeV ? memSnapshots.find((s) => s.version_id === activeV.id) : null;
      res.json({
        ok: true,
        active: activeV
          ? {
              id: 1,
              active_version_id: activeV.id,
              version_label: activeV.version_label,
              status: activeV.status,
              release_gate_id: activeV.release_gate_id,
              parent_version_id: activeV.parent_version_id,
              activated_at: activeV.activated_at,
              active_checksum: snap?.checksum ?? snapshotChecksum(activeV.config_snapshot_json),
              updated_at: activeV.activated_at || activeV.created_at
            }
          : null,
        mode: "memory"
      });
    }
  });

  /**
   * POST /api/admin/ai/releases/versions
   */
  app.post("/api/admin/ai/releases/versions", async (req: Request, res: Response) => {
    const label = String(req.body?.versionLabel ?? "").trim();
    if (!label) {
      return res.status(400).json({ ok: false, error: "versionLabel_is_required" });
    }

    const metadata = buildVersionMetadata(req.body);
    const configSnapshot = req.body?.configSnapshot ?? {
      version: label,
      created_at: new Date().toISOString(),
      governance: { autoPublish: false }
    };
    const checksum = snapshotChecksum(configSnapshot);

    try {
      const result = await q(
        `INSERT INTO ai_release_versions
         (version_label,status,release_gate_id,parent_version_id,config_snapshot_json,metadata_json,created_by)
         VALUES ($1,'draft',$2,$3,$4,$5,$6)
         RETURNING *`,
        [
          label,
          req.body?.releaseGateId ?? null,
          req.body?.parentVersionId ?? null,
          JSON.stringify(configSnapshot),
          JSON.stringify(metadata),
          req.body?.actorId ?? 99,
        ]
      );

      const version = result.rows?.[0] ?? null;

      if (version?.id) {
        await q(
          `INSERT INTO ai_release_version_snapshots
           (version_id,snapshot_type,snapshot_json,checksum)
           VALUES ($1,'config',$2,$3)`,
          [version.id, JSON.stringify(configSnapshot), checksum]
        );

        await q(
          `INSERT INTO ai_release_version_audit
           (version_id,action,actor_id,to_status,reason,details_json)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [
            version.id,
            "create",
            req.body?.actorId ?? 99,
            "draft",
            req.body?.reason ?? "إنشاء مسودة إصدار جديد",
            JSON.stringify(buildAuditDetails("create", req.body?.reason)),
          ]
        );
      }

      res.json({ ok: true, version, checksum, autoPublish: false, mode: "postgres" });
    } catch {
      const newId = (memVersions[0]?.id || 0) + 1;
      const memV: VersionRow = {
        id: newId,
        version_label: label,
        status: "draft",
        release_gate_id: req.body?.releaseGateId ?? null,
        parent_version_id: req.body?.parentVersionId ?? null,
        config_snapshot_json: configSnapshot,
        metadata_json: metadata,
        created_by: req.body?.actorId ?? 99,
        approved_by: null,
        approved_at: null,
        activated_at: null,
        retired_at: null,
        created_at: new Date().toISOString()
      };
      memVersions.unshift(memV);

      memSnapshots.unshift({
        id: (memSnapshots[0]?.id || 0) + 1,
        version_id: newId,
        snapshot_type: "config",
        snapshot_json: configSnapshot,
        checksum,
        created_at: new Date().toISOString()
      });

      memAudits.unshift({
        id: (memAudits[0]?.id || 0) + 1,
        version_id: newId,
        action: "create",
        actor_id: req.body?.actorId ?? 99,
        from_status: null,
        to_status: "draft",
        reason: req.body?.reason ?? "إنشاء مسودة إصدار جديد",
        details_json: buildAuditDetails("create"),
        created_at: new Date().toISOString()
      });

      res.json({
        ok: true,
        mode: "memory",
        version: {
          ...memV,
          latest_checksum: checksum
        },
        checksum,
        autoPublish: false,
      });
    }
  });

  /**
   * POST /api/admin/ai/releases/versions/:id/snapshot
   */
  app.post("/api/admin/ai/releases/versions/:id/snapshot", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const snapshot = req.body?.snapshot ?? {};

    if (!id) {
      return res.status(400).json({ ok: false, error: "invalid_version_id" });
    }

    const checksum = snapshotChecksum(snapshot);

    try {
      const result = await q(
        `INSERT INTO ai_release_version_snapshots
         (version_id,snapshot_type,snapshot_json,checksum)
         VALUES ($1,$2,$3,$4)
         RETURNING *`,
        [
          id,
          req.body?.snapshotType ?? "config",
          JSON.stringify(snapshot),
          checksum,
        ]
      );

      res.json({
        ok: true,
        snapshot: result.rows?.[0] ?? null,
        checksum,
        mode: "postgres"
      });
    } catch {
      memSnapshots.unshift({
        id: (memSnapshots[0]?.id || 0) + 1,
        version_id: id,
        snapshot_type: req.body?.snapshotType ?? "config",
        snapshot_json: snapshot,
        checksum,
        created_at: new Date().toISOString()
      });

      res.json({ ok: true, mode: "memory", checksum });
    }
  });

  /**
   * POST /api/admin/ai/releases/versions/:id/transition
   */
  app.post("/api/admin/ai/releases/versions/:id/transition", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const toStatus = String(req.body?.toStatus ?? "") as ReleaseStatus;
    const reason = String(req.body?.reason ?? "");
    const actorId = req.body?.actorId ?? 99;

    if (!id || !toStatus) {
      return res.status(400).json({ ok: false, error: "invalid_transition_request" });
    }

    try {
      const current = await q(
        `SELECT * FROM ai_release_versions WHERE id=$1`,
        [id]
      );
      const version = current.rows?.[0];

      if (!version) {
        return res.status(404).json({ ok: false, error: "version_not_found" });
      }

      const fromStatus = String(version.status) as ReleaseStatus;

      if (!canTransition(fromStatus, toStatus)) {
        return res.status(409).json({
          ok: false,
          error: "transition_not_allowed",
          fromStatus,
          toStatus,
        });
      }

      if (toStatus === "candidate" && version.release_gate_id) {
        const gate = await q(
          `SELECT status FROM ai_release_gates WHERE id=$1`,
          [version.release_gate_id]
        );
        const gateStatus = String(gate.rows?.[0]?.status ?? "review");

        if (!releaseGateAllowsCandidate(gateStatus)) {
          return res.status(409).json({
            ok: false,
            error: "release_gate_does_not_allow_candidate",
            gateStatus,
          });
        }
      }

      if (toStatus === "active" && version.release_gate_id) {
        const gate = await q(
          `SELECT status FROM ai_release_gates WHERE id=$1`,
          [version.release_gate_id]
        );
        const gateStatus = String(gate.rows?.[0]?.status ?? "review");

        if (!releaseGateAllowsActivation(gateStatus)) {
          return res.status(409).json({
            ok: false,
            error: "activation_requires_pass_gate",
            gateStatus,
          });
        }
      }

      const result = await q(
        `UPDATE ai_release_versions
         SET status=$1,
             approved_by=CASE WHEN $1='approved' THEN $2 ELSE approved_by END,
             approved_at=CASE WHEN $1='approved' THEN NOW() ELSE approved_at END,
             activated_at=CASE WHEN $1='active' THEN NOW() ELSE activated_at END,
             retired_at=CASE WHEN $1='retired' THEN NOW() ELSE retired_at END
         WHERE id=$3
         RETURNING *`,
        [toStatus, actorId, id]
      );

      await q(
        `INSERT INTO ai_release_version_audit
         (version_id,action,actor_id,from_status,to_status,reason,details_json)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          id,
          `transition_${toStatus}`,
          actorId,
          fromStatus,
          toStatus,
          reason,
          JSON.stringify(buildAuditDetails(`transition_${toStatus}`, reason)),
        ]
      );

      res.json({
        ok: true,
        version: result.rows?.[0] ?? null,
        autoPublish: false,
        mode: "postgres"
      });
    } catch {
      // Memory fallback
      const idx = memVersions.findIndex((v) => v.id === id);
      if (idx === -1) {
        return res.status(404).json({ ok: false, error: "version_not_found" });
      }

      const version = memVersions[idx];
      const fromStatus = version.status;

      if (!canTransition(fromStatus, toStatus)) {
        return res.status(409).json({
          ok: false,
          error: "transition_not_allowed",
          fromStatus,
          toStatus,
        });
      }

      version.status = toStatus;
      if (toStatus === "approved") {
        version.approved_by = actorId;
        version.approved_at = new Date().toISOString();
      } else if (toStatus === "active") {
        version.activated_at = new Date().toISOString();
        memActiveVersionId = version.id;
      } else if (toStatus === "retired") {
        version.retired_at = new Date().toISOString();
      }

      memAudits.unshift({
        id: (memAudits[0]?.id || 0) + 1,
        version_id: id,
        action: `transition_${toStatus}`,
        actor_id: actorId,
        from_status: fromStatus,
        to_status: toStatus,
        reason,
        details_json: buildAuditDetails(`transition_${toStatus}`, reason),
        created_at: new Date().toISOString()
      });

      res.json({
        ok: true,
        mode: "memory",
        version,
        autoPublish: false
      });
    }
  });

  /**
   * POST /api/admin/ai/releases/versions/:id/activate
   */
  app.post("/api/admin/ai/releases/versions/:id/activate", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const actorId = req.body?.actorId ?? 99;
    const reason = String(req.body?.reason ?? "");

    try {
      const versionResult = await q(
        `SELECT * FROM ai_release_versions WHERE id=$1`,
        [id]
      );
      const version = versionResult.rows?.[0];

      if (!version) {
        return res.status(404).json({ ok: false, error: "version_not_found" });
      }

      if (version.release_gate_id) {
        const gate = await q(
          `SELECT status FROM ai_release_gates WHERE id=$1`,
          [version.release_gate_id]
        );
        const gateStatus = String(gate.rows?.[0]?.status ?? "review");

        if (!releaseGateAllowsActivation(gateStatus)) {
          return res.status(409).json({
            ok: false,
            error: "activation_requires_pass_gate",
            gateStatus,
          });
        }
      }

      await q(
        `UPDATE ai_release_versions
         SET status='retired', retired_at=NOW()
         WHERE status='active' AND id<>$1`,
        [id]
      );

      await q(
        `UPDATE ai_release_versions
         SET status='active', activated_at=NOW(), approved_by=$2, approved_at=NOW()
         WHERE id=$1`,
        [id, actorId]
      );

      await q(
        `UPDATE ai_release_active_pointer
         SET active_version_id=$1, updated_by=$2, updated_at=NOW()
         WHERE id=1`,
        [id, actorId]
      );

      await q(
        `INSERT INTO ai_release_version_audit
         (version_id,action,actor_id,from_status,to_status,reason,details_json)
         VALUES ($1,'activate',$2,$3,'active',$4,$5)`,
        [
          id,
          actorId,
          version.status,
          reason,
          JSON.stringify(buildAuditDetails("activate", reason)),
        ]
      );

      res.json({
        ok: true,
        activeVersionId: id,
        autoPublish: false,
        message: "تم تفعيل نسخة AI بعد قرار بشري صريح",
        mode: "postgres"
      });
    } catch {
      // Memory fallback
      const target = memVersions.find((v) => v.id === id);
      if (!target) {
        return res.status(404).json({ ok: false, error: "version_not_found" });
      }

      const prevActive = memVersions.find((v) => v.id === memActiveVersionId);
      if (prevActive && prevActive.id !== id) {
        prevActive.status = "retired";
        prevActive.retired_at = new Date().toISOString();
      }

      const fromStatus = target.status;
      target.status = "active";
      target.approved_by = actorId;
      target.approved_at = new Date().toISOString();
      target.activated_at = new Date().toISOString();
      memActiveVersionId = id;

      memAudits.unshift({
        id: (memAudits[0]?.id || 0) + 1,
        version_id: id,
        action: "activate",
        actor_id: actorId,
        from_status: fromStatus,
        to_status: "active",
        reason,
        details_json: buildAuditDetails("activate", reason),
        created_at: new Date().toISOString()
      });

      res.json({
        ok: true,
        mode: "memory",
        activeVersionId: id,
        autoPublish: false,
        message: "تم تفعيل نسخة AI بعد قرار بشري صريح",
      });
    }
  });

  /**
   * POST /api/admin/ai/releases/versions/:id/rollback
   */
  app.post("/api/admin/ai/releases/versions/:id/rollback", async (req: Request, res: Response) => {
    const targetId = Number(req.body?.targetVersionId);
    const actorId = req.body?.actorId ?? 99;
    const reason = String(req.body?.reason ?? "");

    if (!targetId) {
      return res.status(400).json({
        ok: false,
        error: "targetVersionId_is_required",
      });
    }

    try {
      const target = await q(
        `SELECT * FROM ai_release_versions WHERE id=$1`,
        [targetId]
      );

      if (!target.rows?.[0]) {
        return res.status(404).json({
          ok: false,
          error: "target_version_not_found",
        });
      }

      const targetVersion = target.rows[0];

      if (targetVersion.release_gate_id) {
        const gate = await q(
          `SELECT status FROM ai_release_gates WHERE id=$1`,
          [targetVersion.release_gate_id]
        );
        const gateStatus = String(gate.rows?.[0]?.status ?? "review");

        if (!releaseGateAllowsActivation(gateStatus)) {
          return res.status(409).json({
            ok: false,
            error: "rollback_target_requires_pass_gate",
            gateStatus,
          });
        }
      }

      await q(
        `UPDATE ai_release_versions
         SET status='retired', retired_at=NOW()
         WHERE status='active' AND id<>$1`,
        [targetId]
      );

      await q(
        `UPDATE ai_release_versions
         SET status='active', activated_at=NOW()
         WHERE id=$1`,
        [targetId]
      );

      await q(
        `UPDATE ai_release_active_pointer
         SET active_version_id=$1, updated_by=$2, updated_at=NOW()
         WHERE id=1`,
        [targetId, actorId]
      );

      await q(
        `INSERT INTO ai_release_version_audit
         (version_id,action,actor_id,to_status,reason,details_json)
         VALUES ($1,'rollback',$2,'active',$3,$4)`,
        [
          targetId,
          actorId,
          reason,
          JSON.stringify(buildAuditDetails("rollback", reason, {
            targetVersionId: targetId,
          })),
        ]
      );

      res.json({
        ok: true,
        activeVersionId: targetId,
        action: "rollback",
        autoPublish: false,
        mode: "postgres"
      });
    } catch {
      const target = memVersions.find((v) => v.id === targetId);
      if (!target) {
        return res.status(404).json({ ok: false, error: "target_version_not_found" });
      }

      const prevActive = memVersions.find((v) => v.id === memActiveVersionId);
      if (prevActive && prevActive.id !== targetId) {
        prevActive.status = "retired";
        prevActive.retired_at = new Date().toISOString();
      }

      target.status = "active";
      target.activated_at = new Date().toISOString();
      memActiveVersionId = targetId;

      memAudits.unshift({
        id: (memAudits[0]?.id || 0) + 1,
        version_id: targetId,
        action: "rollback",
        actor_id: actorId,
        from_status: "retired",
        to_status: "active",
        reason,
        details_json: buildAuditDetails("rollback", reason, { targetVersionId: targetId }),
        created_at: new Date().toISOString()
      });

      res.json({
        ok: true,
        mode: "memory",
        activeVersionId: targetId,
        action: "rollback",
        autoPublish: false,
      });
    }
  });

  /**
   * GET /api/admin/ai/releases/audit
   */
  app.get("/api/admin/ai/releases/audit", async (_req: Request, res: Response) => {
    try {
      const result = await q(
        `SELECT * FROM ai_release_version_audit
         ORDER BY created_at DESC LIMIT 200`
      );
      res.json({ ok: true, audit: result.rows ?? [], mode: "postgres" });
    } catch {
      res.json({ ok: true, audit: memAudits, mode: "memory" });
    }
  });
}
