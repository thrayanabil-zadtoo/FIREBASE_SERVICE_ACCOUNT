-- DARB GKE V1.1 Supplemental Approval Update
-- Safe/idempotent migration contract
ALTER TABLE darb_knowledge_verification_queue
  ADD COLUMN IF NOT EXISTS source_file TEXT;
ALTER TABLE darb_knowledge_verification_queue
  ADD COLUMN IF NOT EXISTS source_line_start INTEGER;
ALTER TABLE darb_knowledge_verification_queue
  ADD COLUMN IF NOT EXISTS source_line_end INTEGER;
ALTER TABLE darb_knowledge_verification_queue
  ADD COLUMN IF NOT EXISTS source_fingerprint TEXT;
ALTER TABLE darb_knowledge_verification_queue
  ADD COLUMN IF NOT EXISTS data_class TEXT DEFAULT 'supplemental';
ALTER TABLE darb_knowledge_verification_queue
  ADD COLUMN IF NOT EXISTS live_data BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_gke_verification_source_file
  ON darb_knowledge_verification_queue(source_file);
CREATE INDEX IF NOT EXISTS idx_gke_verification_source_fingerprint
  ON darb_knowledge_verification_queue(source_fingerprint);
