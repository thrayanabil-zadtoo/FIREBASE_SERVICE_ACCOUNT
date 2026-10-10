export type CircuitState = "closed" | "open" | "half_open";

export type ResilienceEvent = {
  id?: number;
  correlation_id?: string;
  component: string;
  event_type: string;
  status: string;
  duration_ms?: number | null;
  details_json?: Record<string, unknown>;
  created_at?: string;
};

export type AIHealth = {
  ok: boolean;
  service: string;
  version: string;
  correlationId: string;
  timestamp?: string;
};

export type AIReadiness = {
  ready: boolean;
  database: "postgres" | "memory" | "degraded";
  humanInTheLoop: boolean;
  autoPublish: boolean;
  timestamp?: string;
};

export type ProviderHealthItem = {
  providerKey: string;
  state: CircuitState;
  isCallAllowed: boolean;
  failureCount: number;
  successCount: number;
  cooldownRemainingMs: number;
};
