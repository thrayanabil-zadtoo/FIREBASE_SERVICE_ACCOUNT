-- DARB GKE V1.1 Verification Operations Patch
ALTER TABLE IF EXISTS darb_knowledge_verification_queue
  ADD COLUMN IF NOT EXISTS reviewed_value TEXT;
CREATE INDEX IF NOT EXISTS idx_darb_gke_verify_reviewed_at
ON darb_knowledge_verification_queue(reviewed_at);
-- No automatic publication is introduced.
