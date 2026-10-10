export type ReleaseStatus =
  | "draft"
  | "candidate"
  | "approved"
  | "active"
  | "retired"
  | "rollback";

export interface AIReleaseVersion {
  id?: number;
  version_label: string;
  status: ReleaseStatus;
  release_gate_id?: number | null;
  parent_version_id?: number | null;
  config_snapshot_json?: Record<string, unknown>;
  metadata_json?: Record<string, unknown>;
  created_by?: number | null;
  approved_by?: number | null;
  approved_at?: string | null;
  activated_at?: string | null;
  retired_at?: string | null;
  latest_checksum?: string;
  created_at?: string;
}

export interface AIReleaseSnapshot {
  id?: number;
  version_id?: number;
  snapshot_type: string;
  snapshot_json: Record<string, unknown>;
  checksum: string;
  created_at?: string;
}

export interface AIReleaseAudit {
  id?: number;
  version_id?: number;
  action: string;
  actor_id?: number | null;
  from_status?: string | null;
  to_status?: string | null;
  reason?: string;
  details_json?: Record<string, unknown>;
  created_at?: string;
}

export interface AIReleaseActivePointer {
  id: number;
  active_version_id: number;
  version_label?: string;
  status?: ReleaseStatus;
  release_gate_id?: number | null;
  parent_version_id?: number | null;
  activated_at?: string | null;
  active_checksum?: string;
  updated_at?: string;
}
