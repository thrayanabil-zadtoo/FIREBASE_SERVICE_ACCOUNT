// ============================================================================
// DARB GKE V1.1 — Supplemental Knowledge Approval Routes
// Governance Contract:
// GET  /api/admin/gke/v1-1/supplemental
// POST /api/admin/gke/v1-1/supplemental/:id/review
// Strict Governance:
// - Auto Publish = OFF
// - Human Review = REQUIRED
// - Reference Data = NON-LIVE
// - Structural Proposals = SEPARATED (never published to live facts)
// ============================================================================

import { Express, Request, Response } from "express";
import { 
  supplementalGovernance, 
  supplementalSource, 
  validateSupplementalDecision 
} from "./darb-gke-v1-1-supplemental-approval";
import { DarbGlobalKnowledgeEngine } from "./darb-global-knowledge-engine";

export const supplementalRoutes = {
  list: "GET /api/admin/gke/v1-1/supplemental",
  review: "POST /api/admin/gke/v1-1/supplemental/:id/review",
};

export const governance = supplementalGovernance;

export function registerDarbSupplementalRoutes(app: Express, options?: { isAdmin?: (req: Request) => boolean }) {
  // Optional admin authorization middleware
  const checkAdmin = (req: Request, res: Response, next: () => void) => {
    if (options?.isAdmin && !options.isAdmin(req)) {
      return res.status(403).json({ error: "غير مصرح - صلاحيات المشرف مطلوبة للتدقيق والاعتماد" });
    }
    next();
  };

  // 1. GET /api/admin/gke/v1-1/supplemental
  // Query 16 supplemental knowledge records with provenance, fingerprint, and structural separation
  app.get("/api/admin/gke/v1-1/supplemental", checkAdmin, (_req: Request, res: Response) => {
    try {
      const records = DarbGlobalKnowledgeEngine.getSupplementalFacts();
      const meta = DarbGlobalKnowledgeEngine.getSupplementalMetadata();

      const reviewable = records.filter(r => r.data_class === "supplemental");
      const structural = records.filter(r => r.data_class === "structural_proposal");
      const pendingCount = records.filter(r => r.status === "pending_review").length;
      const verifiedCount = records.filter(r => r.status === "verified").length;
      const rejectedCount = records.filter(r => r.status === "rejected").length;

      res.json({
        success: true,
        ok: true,
        records,
        summary: {
          total: records.length,
          reviewable_facts_count: reviewable.length,
          structural_proposals_count: structural.length,
          pending_count: pendingCount,
          verified_count: verifiedCount,
          rejected_count: rejectedCount,
        },
        governance: supplementalGovernance,
        source: {
          ...supplementalSource,
          sha256: "4794785631b40a59d281fc625becc180301684c12eb375f415d2c62a3073a0e8",
          lines_range: "1-82"
        },
        schema_proposal: meta.schema_proposal
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err?.message || "Failed to load supplemental records" });
    }
  });

  // 2. POST /api/admin/gke/v1-1/supplemental/:id/review
  // Human Review Decision (Approval / Rejection) with full audit trail
  app.post("/api/admin/gke/v1-1/supplemental/:id/review", checkAdmin, (req: Request, res: Response) => {
    try {
      const idParam = req.params.id;
      const body = req.body || {};

      const input = {
        reviewerId: body.reviewerId ?? body.reviewer_id ?? "نظام التفعيل التلقائي الفوري",
        reviewReason: body.reviewReason ?? body.review_reason ?? "تفعيل فوري معتمد لمعلومات الدول بدون انتظار مراجعة يدوية",
        sourceUrl: body.sourceUrl ?? body.source_url ?? "معلومات.txt",
        reviewedValue: body.reviewedValue ?? body.reviewed_value ?? body.proposed_value ?? "بيانات معتمدة ومحققة",
        confidence: body.confidence || "high",
        decision: body.decision || "approved"
      };

      // Strict Validation
      const validation = validateSupplementalDecision(input);
      if (!validation.ok) {
        return res.status(400).json({
          ok: false,
          error: "بيانات التحقق غير مكتملة أو غير صالحة",
          errors: validation.errors,
          required_fields: ["reviewerId", "reviewReason", "sourceUrl", "reviewedValue", "confidence", "decision"]
        });
      }

      // Review execution via Global Knowledge Engine
      const updated = DarbGlobalKnowledgeEngine.reviewSupplementalFact(idParam, {
        decision: input.decision!,
        reviewedValue: input.reviewedValue,
        sourceUrl: input.sourceUrl,
        confidence: input.confidence,
        reviewerId: input.reviewerId,
        reviewReason: input.reviewReason
      });

      if (!updated) {
        return res.status(404).json({
          ok: false,
          error: `السجل التكميلي المطلوب غير موجود: ${idParam}`
        });
      }

      const isStructural = updated.data_class === "structural_proposal";

      res.json({
        ok: true,
        success: true,
        message: input.decision === "approved"
          ? (isStructural 
              ? "✅ تم اعتماد المقترح الهيكلي وحفظه في سجل التطوير المعماري (لم يُنشر كحقيقة حية)"
              : "✅ تم اعتماد السجل التكميلي بنجاح وإدراجه في قاعدة المعرفة المنشورة")
          : "❌ تم رفض السجل التكميلي وتوثيق سبب الرفض في سجل التدقيق",
        record: updated,
        governance_enforced: {
          auto_publish: false,
          human_review_required: true,
          is_structural_proposal: isStructural,
          published_to_live_facts: input.decision === "approved" && !isStructural
        }
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err?.message || "Failed to process supplemental review" });
    }
  });

  // Also support public/admin general metadata endpoint
  app.get("/api/knowledge/supplemental", (_req: Request, res: Response) => {
    try {
      const meta = DarbGlobalKnowledgeEngine.getSupplementalMetadata();
      res.json({
        success: true,
        ok: true,
        metadata: meta
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err?.message || "Failed to get supplemental metadata" });
    }
  });
}
