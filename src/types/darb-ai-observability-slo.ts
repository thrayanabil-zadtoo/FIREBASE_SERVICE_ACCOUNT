export type ObservabilityHealth = "healthy" | "degraded" | "critical";
export type AlertSeverity = "info" | "warning" | "critical";
export type AlertStatus = "open" | "acknowledged" | "resolved";

export interface ObservabilitySummary {
  environment: string;
  status: ObservabilityHealth;
  metrics: Record<string, number>;
  autoRemediation: false;
}

export interface SloPolicy {
  id?: number;
  environment: string;
  metric_key: string;
  target: number;
  comparison: "lte" | "gte";
  window_minutes: number;
  enabled: boolean;
}

export interface ObservabilityAlert {
  id?: number;
  environment: string;
  version_id?: number | null;
  metric_key: string;
  severity: AlertSeverity;
  status: AlertStatus;
  observed_value?: number;
  threshold?: number;
  message?: string;
  correlation_id?: string;
}

export interface ObservabilityIncident {
  id?: number;
  environment: string;
  version_id?: number | null;
  alert_id?: number | null;
  status: "open" | "resolved";
  severity: string;
  title: string;
  summary?: string;
  root_cause?: string;
  remediation?: string;
}
