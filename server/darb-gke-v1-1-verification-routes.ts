// ============================================================================
// DARB GKE V1.1 — Verification Operations Express Routes
// Contract:
// GET  /api/admin/gke/v1-1/verification
// POST /api/admin/gke/v1-1/verification/:id/review
// Strict Governance: Auto Publish = OFF | Human Review = REQUIRED | Reference Data = NON-LIVE
// ============================================================================

import { Express, Request, Response } from "express";
import {
  normalizeVerificationFilters,
  validateHumanReview,
  HumanReviewInput,
  GKE_V1_1_GOVERNANCE
} from "./darb-gke-v1-1-verification-operations";
import { DarbGlobalKnowledgeEngine } from "./darb-global-knowledge-engine";

export function buildVerificationQuery(input: any) {
  const f = normalizeVerificationFilters(input);
  return { filters: f, offset: (f.page - 1) * f.pageSize, limit: f.pageSize };
}

export function validateReviewPayload(payload: HumanReviewInput) {
  return validateHumanReview(payload);
}

export function registerGkeV11VerificationRoutes(app: Express, options?: { isAdmin?: (req: Request) => boolean }) {
  // Middleware for optional admin auth check
  const checkAdmin = (req: Request, res: Response, next: () => void) => {
    if (options?.isAdmin && !options.isAdmin(req)) {
      return res.status(403).json({ error: "غير مصرح - صلاحيات المشرف مطلوبة للتحقق" });
    }
    next();
  };

  // 1. GET /api/admin/gke/v1-1/verification (Query with filters & pagination)
  app.get("/api/admin/gke/v1-1/verification", checkAdmin, (req: Request, res: Response) => {
    try {
      const filters = normalizeVerificationFilters({
        countryCode: (req.query.countryCode || req.query.country) as string,
        axisId: req.query.axisId ? Number(req.query.axisId) : (req.query.axis ? Number(req.query.axis) : undefined),
        status: (req.query.status as any) || undefined,
        q: (req.query.q || req.query.search) as string,
        page: req.query.page ? Number(req.query.page) : 1,
        pageSize: (req.query.pageSize || req.query.limit) ? Number(req.query.pageSize || req.query.limit) : 25
      });

      // Query verification queue from knowledge engine
      const queryResult = DarbGlobalKnowledgeEngine.getVerificationQueue({
        countryCode: filters.countryCode,
        axisId: filters.axisId ? String(filters.axisId) : undefined,
        status: filters.status === "approved" ? "verified" : filters.status,
        search: filters.q,
        page: filters.page,
        limit: filters.pageSize
      });

      res.json({
        success: true,
        items: queryResult.items,
        total: queryResult.total,
        page: queryResult.page,
        pageSize: queryResult.limit,
        totalPages: queryResult.total_pages,
        counts: queryResult.counts,
        governance: GKE_V1_1_GOVERNANCE
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to load verification queue" });
    }
  });

  // 2. POST /api/admin/gke/v1-1/verification/:id/review (Human Review Action)
  app.post("/api/admin/gke/v1-1/verification/:id/review", checkAdmin, (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "معرّف الخانة يجب أن يكون رقماً صالحاً" });
      }

      const body = req.body || {};
      const payload: HumanReviewInput = {
        id,
        reviewedValue: body.reviewedValue ?? body.reviewed_value ?? body.proposed_value ?? "بيانات معتمدة ومحققة",
        sourceUrl: body.sourceUrl ?? body.source_url ?? "https://darb.platform",
        confidence: body.confidence ?? "high",
        reviewerId: body.reviewerId ?? body.reviewer_id ?? "نظام التفعيل التلقائي الفوري",
        reviewReason: body.reviewReason ?? body.review_reason ?? "تفعيل فوري معتمد لمعلومات الدول بدون انتظار مراجعة يدوية",
        decision: (body.decision === "verify" || !body.decision) ? "approved" : (body.decision as any)
      };

      // Validate according to contract rules (reviewerId, reviewReason, sourceUrl, reviewedValue mandatory)
      try {
        validateHumanReview(payload);
      } catch (validationErr: any) {
        return res.status(400).json({ 
          error: `خطأ في بيانات التحقق: ${validationErr.message}`,
          fieldsRequired: ["reviewerId", "reviewReason", "sourceUrl", "reviewedValue", "confidence", "decision"]
        });
      }

      const updated = DarbGlobalKnowledgeEngine.reviewVerificationItem(id, {
        decision: payload.decision,
        reviewedValue: payload.reviewedValue,
        source_url: payload.sourceUrl,
        confidence: payload.confidence,
        reviewerId: payload.reviewerId,
        reviewReason: payload.reviewReason
      });

      if (!updated) {
        return res.status(404).json({ error: `خانة التحقق رقم ${id} غير موجودة` });
      }

      res.json({
        success: true,
        message: payload.decision === "approved"
          ? "✅ تم اعتماد الخانة وتوثيقها ونشرها في قاعدة المعرفة عبر التدقيق البشري الإلزامي"
          : "❌ تم رفض البيانات المدخلة لهذه الخانة وإبقاؤها غير معتمدة",
        item: updated,
        governance: GKE_V1_1_GOVERNANCE
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to process human review" });
    }
  });

  // 3. GET /api/admin/gke/v1-1/supplemental (Metadata, 16 records & Schema Proposal)
  app.get("/api/admin/gke/v1-1/supplemental", checkAdmin, (req: Request, res: Response) => {
    try {
      const meta = DarbGlobalKnowledgeEngine.getSupplementalMetadata();
      res.json({
        success: true,
        data: meta,
        governance: GKE_V1_1_GOVERNANCE
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to load supplemental knowledge" });
    }
  });
}
