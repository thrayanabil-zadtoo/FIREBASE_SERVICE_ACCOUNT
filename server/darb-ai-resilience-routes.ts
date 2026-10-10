import { Request, Response } from "express";
import {
  createCorrelationId,
  shouldRetry,
  backoffMs,
  ProviderHealth,
  recordFailure,
  recordSuccess,
  canCallProvider
} from "./darb-ai-resilience";
import { redactForLog } from "./darb-ai-privacy-log";

export interface ResilienceRouteOptions {
  pool?: any;
  isAdmin?: (req: Request) => Promise<boolean> | boolean;
}

export function registerDarbAIResilienceRoutes(app: any, optionsOrPool?: any) {
  let pool: any = undefined;
  let isAdmin: ((req: Request) => Promise<boolean> | boolean) | undefined = undefined;

  if (optionsOrPool && typeof optionsOrPool.query === "function") {
    pool = optionsOrPool;
  } else if (optionsOrPool && typeof optionsOrPool === "object") {
    pool = optionsOrPool.pool;
    isAdmin = optionsOrPool.isAdmin;
  }

  const memoryEvents: any[] = [];

  // In-memory provider state trackers
  const providerHealthState: Record<string, ProviderHealth> = {
    web_search_provider: {
      state: "closed",
      failureCount: 0,
      successCount: 142,
    },
    gemini_model_provider: {
      state: "closed",
      failureCount: 0,
      successCount: 238,
    }
  };

  // Ensure DB tables on start if pool exists
  if (pool) {
    (async () => {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS ai_resilience_events (
            id BIGSERIAL PRIMARY KEY,
            correlation_id TEXT,
            component TEXT NOT NULL,
            event_type TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'info',
            duration_ms INTEGER,
            details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_ai_resilience_events_created
            ON ai_resilience_events(created_at);
          CREATE INDEX IF NOT EXISTS idx_ai_resilience_events_component
            ON ai_resilience_events(component);

          CREATE TABLE IF NOT EXISTS ai_provider_health (
            provider_key TEXT PRIMARY KEY,
            state TEXT NOT NULL DEFAULT 'closed',
            failure_count INTEGER NOT NULL DEFAULT 0,
            success_count INTEGER NOT NULL DEFAULT 0,
            last_failure_at TIMESTAMPTZ,
            last_success_at TIMESTAMPTZ,
            cooldown_until TIMESTAMPTZ,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
        `);
      } catch (err) {
        console.warn("[DARB AI V1.20] Resilience table initialization note:", err);
      }
    })();
  }

  async function record(event: any) {
    const safe: any = redactForLog(event);
    try {
      if (pool) {
        await pool.query(
          `INSERT INTO ai_resilience_events
           (correlation_id,component,event_type,status,duration_ms,details_json)
           VALUES($1,$2,$3,$4,$5,$6)`,
          [
            safe.correlation_id ?? null,
            safe.component ?? "unknown",
            safe.event_type ?? "event",
            safe.status ?? "info",
            safe.duration_ms ?? null,
            safe.details_json ?? {}
          ]
        );
        return;
      }
    } catch {
      // fallback to memory
    }
    const memEntry = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      ...safe,
      created_at: new Date().toISOString()
    };
    memoryEvents.push(memEntry);
    if (memoryEvents.length > 500) memoryEvents.shift();
  }

  // 1. Health check (Public / Internal)
  app.get("/api/ai/health", async (_req: Request, res: Response) => {
    res.json({
      ok: true,
      service: "darb-ai",
      version: "V1.20",
      correlationId: createCorrelationId(),
      timestamp: new Date().toISOString()
    });
  });

  // 2. Readiness check (Public / Internal)
  app.get("/api/ai/readiness", async (_req: Request, res: Response) => {
    let database = "memory";
    try {
      if (pool) {
        await pool.query("SELECT 1");
        database = "postgres";
      }
    } catch {
      database = "degraded";
    }
    const ready = database !== "degraded";
    res.status(ready ? 200 : 503).json({
      ready,
      database,
      humanInTheLoop: true,
      autoPublish: false,
      timestamp: new Date().toISOString()
    });
  });

  // 3. Retry plan calculation (Safe Exponential Backoff)
  app.post("/api/ai/resilience/retry-plan", async (req: Request, res: Response) => {
    const attempt = Number(req.body?.attempt ?? 0);
    const status = req.body?.status == null ? undefined : Number(req.body.status);
    const maxRetries = Number(process.env.AI_MAX_RETRIES ?? 2);
    const retry = shouldRetry(status, attempt, maxRetries);
    const waitMs = retry ? backoffMs(attempt) : 0;
    const correlationId = req.body?.correlationId || createCorrelationId();
    const component = req.body?.component || "retry_guard";

    const plan = {
      retry,
      attempt,
      maxRetries,
      waitMs,
      correlationId
    };

    await record({
      correlation_id: plan.correlationId,
      component,
      event_type: retry ? "retry_scheduled" : "retry_stopped",
      status: retry ? "warning" : "info",
      duration_ms: waitMs,
      details_json: redactForLog(plan)
    });

    res.json(plan);
  });

  // 4. Admin Resilience Events (Admin View with Privacy Redaction)
  app.get("/api/admin/ai/resilience-events", async (req: Request, res: Response) => {
    if (isAdmin && !(await isAdmin(req))) {
      return res.status(403).json({ ok: false, error: "غير مصرح للوصول" });
    }

    try {
      if (pool) {
        const r = await pool.query(
          `SELECT id,correlation_id,component,event_type,status,duration_ms,details_json,created_at
           FROM ai_resilience_events ORDER BY created_at DESC LIMIT 200`
        );
        return res.json({ ok: true, events: r.rows.map((row: any) => redactForLog(row)) });
      }
    } catch {}

    res.json({ ok: true, events: memoryEvents.slice().reverse().map((e) => redactForLog(e)) });
  });

  // 5. Admin Provider Health & Circuit States
  app.get("/api/admin/ai/resilience-providers", async (req: Request, res: Response) => {
    if (isAdmin && !(await isAdmin(req))) {
      return res.status(403).json({ ok: false, error: "غير مصرح للوصول" });
    }

    const now = Date.now();
    const providers = Object.entries(providerHealthState).map(([key, health]) => {
      const isCallAllowed = canCallProvider(health, now);
      return {
        providerKey: key,
        state: health.state,
        isCallAllowed,
        failureCount: health.failureCount,
        successCount: health.successCount,
        cooldownRemainingMs: health.cooldownUntil && health.cooldownUntil > now ? health.cooldownUntil - now : 0
      };
    });

    res.json({
      ok: true,
      providers,
      circuitThreshold: Number(process.env.AI_CIRCUIT_FAILURE_THRESHOLD ?? 5),
      cooldownDurationMs: Number(process.env.AI_CIRCUIT_COOLDOWN_MS ?? 30000)
    });
  });

  // 6. Admin Reset Circuit Breaker
  app.post("/api/admin/ai/resilience/reset-circuit", async (req: Request, res: Response) => {
    if (isAdmin && !(await isAdmin(req))) {
      return res.status(403).json({ ok: false, error: "غير مصرح للوصول" });
    }

    const { providerKey } = req.body || {};
    if (providerKey && providerHealthState[providerKey]) {
      providerHealthState[providerKey] = recordSuccess(providerHealthState[providerKey]);
      await record({
        correlation_id: createCorrelationId(),
        component: "circuit_breaker",
        event_type: "manual_circuit_reset",
        status: "info",
        details_json: { providerKey, resetBy: "admin" }
      });
      return res.json({ ok: true, message: `تمت إعادة تهيئة قاطع الدائرة للمزود ${providerKey}` });
    }

    // Reset all
    Object.keys(providerHealthState).forEach((key) => {
      providerHealthState[key] = recordSuccess(providerHealthState[key]);
    });

    await record({
      correlation_id: createCorrelationId(),
      component: "circuit_breaker",
      event_type: "manual_circuit_reset_all",
      status: "info",
      details_json: { resetBy: "admin" }
    });

    res.json({ ok: true, message: "تمت إعادة تهيئة قواطع الدائرة لجميع المزودين بنجاح." });
  });

  // 7. Admin Simulate Event (For Testing & Validation)
  app.post("/api/admin/ai/resilience/simulate-event", async (req: Request, res: Response) => {
    if (isAdmin && !(await isAdmin(req))) {
      return res.status(403).json({ ok: false, error: "غير مصرح للوصول" });
    }

    const { type, providerKey = "web_search_provider" } = req.body || {};
    const correlationId = createCorrelationId();

    if (type === "circuit_failure") {
      const current = providerHealthState[providerKey] || { state: "closed", failureCount: 0, successCount: 0 };
      const threshold = Number(process.env.AI_CIRCUIT_FAILURE_THRESHOLD ?? 5);
      const cooldown = Number(process.env.AI_CIRCUIT_COOLDOWN_MS ?? 30000);
      const updated = recordFailure(current, threshold, cooldown);
      providerHealthState[providerKey] = updated;

      await record({
        correlation_id: correlationId,
        component: providerKey,
        event_type: updated.state === "open" ? "circuit_breaker_opened" : "provider_request_failed",
        status: updated.state === "open" ? "critical" : "warning",
        duration_ms: 120,
        details_json: {
          simulated: true,
          failureCount: updated.failureCount,
          state: updated.state,
          cooldownUntil: updated.cooldownUntil
        }
      });

      return res.json({
        ok: true,
        correlationId,
        providerKey,
        state: updated.state,
        failureCount: updated.failureCount
      });
    }

    if (type === "retry_simulation") {
      const plan = {
        retry: true,
        attempt: 1,
        maxRetries: 2,
        waitMs: backoffMs(1),
        correlationId
      };
      await record({
        correlation_id: correlationId,
        component: "retry_guard",
        event_type: "simulated_retry_backoff",
        status: "info",
        duration_ms: plan.waitMs,
        details_json: plan
      });
      return res.json({ ok: true, plan });
    }

    // Default simulation ping
    await record({
      correlation_id: correlationId,
      component: "health_monitor",
      event_type: "simulated_heartbeat",
      status: "info",
      duration_ms: 15,
      details_json: { test: true, environment: "production_resilience" }
    });

    res.json({ ok: true, correlationId, message: "تم تسجيل الحدث التجريبي بنجاح" });
  });
}
