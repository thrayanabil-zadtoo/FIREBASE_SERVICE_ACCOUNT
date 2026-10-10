// ============================================================================
// DARB Global Knowledge Engine V1 — API Routes
// Clean Update مبني على الدليل المطور للدول العربية الـ22
// ============================================================================

import { Express, Request, Response } from "express";
import { 
  DarbGlobalKnowledgeEngine, 
  memoryKnowledgeFacts,
  memoryKnowledgeSources,
  memoryRefreshQueue,
  assessFreshness,
  KnowledgeCategory
} from "./darb-global-knowledge-engine";
import { registerGkeV11VerificationRoutes } from "./darb-gke-v1-1-verification-routes";
import { registerDarbSupplementalRoutes } from "./darb-gke-v1-1-supplemental-routes";

export const KNOWLEDGE_CATEGORIES_INFO: Array<{ id: KnowledgeCategory; name_ar: string; name_en: string; description: string }> = [
  { id: "country", name_ar: "بيانات الدولة والعاصمة", name_en: "Country Identity", description: "العاصمة، المساحة، العملة الرسمية، المنطقة الزمنية، والمفتاح الهاتفي" },
  { id: "visa", name_ar: "التأشيرات والدخول", name_en: "Visa & Entry", description: "شروط تأشيرات السياحة، الزيارة، وتأشيرات العمل الرسمية" },
  { id: "residency", name_ar: "الإقامة وتصاريح الاستقرار", name_en: "Residency & Permits", description: "الإقامات النظامية، الذهبية، المميزة، ونظام الكفالة والتحويل" },
  { id: "jobs", name_ar: "الوظائف وسوق العمل", name_en: "Jobs & Labor", description: "أنظمة العمل، منصات التوظيف الرسمية، الحد الأدنى للأجور وحماية الأجور" },
  { id: "housing", name_ar: "السكن والإيجارات", name_en: "Housing & Rentals", description: "نطاقات الإيجار الاسترشادية، منصات توثيق العقود، والتأمين" },
  { id: "emergency", name_ar: "أرقام الطوارئ", name_en: "Emergency Contacts", description: "الشرطة، الإسعاف، الدفاع المدني، الحوادث، وشرطة السياحة" },
  { id: "telecom", name_ar: "الاتصالات والإنترنت", name_en: "Telecom & Internet", description: "شركات الاتصالات المعتمدة، تغطية 5G، وشروط استخراج الشرائح" },
  { id: "hospitals", name_ar: "الرعاية الصحية والمستشفيات", name_en: "Healthcare & Hospitals", description: "المستشفيات المعتمدة، منظومة التأمين الصحي، والصيدليات" },
  { id: "transport", name_ar: "المواصلات والنقل", name_en: "Transport & Transit", description: "المترو، الحافلات، تطبيقات حجز المركبات، ورخص القيادة" },
  { id: "tourism", name_ar: "السياحة والمعالم", name_en: "Tourism & Attractions", description: "أبرز المعالم التاريخية، مواسم الزيارة، والتراث الثقافي" },
  { id: "exchange_rate", name_ar: "سعر الصرف المرجعي", name_en: "Exchange Rate (Reference)", description: "سعر الصرف المرجعي الاسترشادي (غير حي - يخضع للمراجعة)" },
  { id: "safety", name_ar: "السلامة والأمان", name_en: "Safety & Security", description: "مؤشرات الأمان، إرشادات التجوال، والشرطة السياحية" },
  { id: "natural_risks", name_ar: "المخاطر الطبيعية والمناخ", name_en: "Natural & Climate Risks", description: "حرارة الصيف، العواصف الغبارية، ومواسم السيول" },
  { id: "laws_customs", name_ar: "القوانين والأعراف المحلية", name_en: "Laws & Customs", description: "الآداب العامة، عطلة نهاية الأسبوع الرسمية، والتشريعات الخاصة" },
  { id: "education", name_ar: "التعليم والجامعات", name_en: "Education", description: "المدارس الدولية، الجامعات المعتمدة، وإجراءات معادلة الشهادات" },
  { id: "shopping", name_ar: "التسوق والأسواق", name_en: "Shopping & Markets", description: "الأسواق التراثية والمجمعات التجارية المعاصرة وضريبة القيمة المضافة" },
  { id: "marriage_cost", name_ar: "تكاليف الزواج والمعيشة", name_en: "Living & Marriage Cost", description: "تقديرات استرشادية لنمط المعيشة وتكاليف التأسيس" },
  { id: "restaurants", name_ar: "المطاعم والمأكولات", name_en: "Dining & Restaurants", description: "المطابخ التقليدية، متوسط أسعار الوجبات، وثقافة الإكرامية" },
  { id: "hotels", name_ar: "الفنادق والإقامة المؤقتة", name_en: "Hotels & Lodging", description: "نطاقات أسعار الإقامة الفندقية الاسترشادية حسب الفئات" },
];

export function registerDarbGlobalKnowledgeRoutes(app: Express) {
  console.log("[DARB GKE V1] Registering Global Knowledge Engine Routes...");

  // --------------------------------------------------------------------------
  // PUBLIC CLIENT ENDPOINTS
  // --------------------------------------------------------------------------

  // 1. List all 22 countries with summary facts counters & freshness
  app.get("/api/knowledge/countries", (req: Request, res: Response) => {
    try {
      const countries = DarbGlobalKnowledgeEngine.getCountries();
      res.json({
        success: true,
        total: countries.length,
        data: countries,
        metadata: {
          engine_version: "DARB_Global_Knowledge_Engine_V1",
          freshness_policy: "30_days_aging_90_days_stale",
          auto_publish: false,
          non_live_disclaimer: "الأسعار المرجعية ونطاقات التكلفة استرشادية وليست بيانات حية فورية."
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch knowledge countries" });
    }
  });

  // 2. Get single country details with published facts & sources
  app.get("/api/knowledge/countries/:countryId", (req: Request, res: Response) => {
    try {
      const { countryId } = req.params;
      const country = DarbGlobalKnowledgeEngine.getCountry(countryId);
      if (!country) {
        return res.status(404).json({ error: `Country '${countryId}' not found in knowledge registry` });
      }

      // Group facts by category for easy structured rendering
      const factsByCategory: Record<string, any[]> = {};
      for (const fact of country.facts) {
        if (!factsByCategory[fact.category]) {
          factsByCategory[fact.category] = [];
        }
        factsByCategory[fact.category].push(fact);
      }

      res.json({
        success: true,
        country: {
          country_id: country.country_id,
          country_name_ar: country.country_name_ar,
          country_name_en: country.country_name_en,
          capital: country.capital,
          currency: country.currency,
          timezone: country.timezone,
          flag: country.flag,
          status: country.status,
          source_document: country.source_document,
          verified_at: country.verified_at
        },
        facts: country.facts,
        factsByCategory,
        sources: country.sources,
        total_facts: country.facts.length
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch country knowledge" });
    }
  });

  // 3. Get all standardized categories
  app.get("/api/knowledge/categories", (req: Request, res: Response) => {
    res.json({
      success: true,
      count: KNOWLEDGE_CATEGORIES_INFO.length,
      categories: KNOWLEDGE_CATEGORIES_INFO
    });
  });

  // 4. Search published facts (Strictly returns published facts with provenance)
  app.get("/api/knowledge/search", (req: Request, res: Response) => {
    try {
      const { countryId, category, subject, query, limit } = req.query;
      const result = DarbGlobalKnowledgeEngine.searchFacts({
        countryId: countryId as string,
        category: category as string,
        subject: subject as string,
        query: query as string,
        limit: limit ? Number(limit) : undefined,
        includePending: false
      });

      res.json({
        success: true,
        total: result.total,
        count: result.items.length,
        items: result.items,
        insufficientEvidence: result.insufficientEvidence,
        requiresWebConsent: result.requiresWebConsent,
        metadata: {
          engine: "DARB_Global_Knowledge_Engine_V1",
          knowledge_first: true,
          notice: result.insufficientEvidence 
            ? "لا توجد أدلة معتمدة كافية في قاعدة المعرفة للمطابقة المباشرة؛ يلزم الحصول على موافقة البحث الخارجي."
            : undefined
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Knowledge search failed" });
    }
  });

  // 5. Get single fact details
  app.get("/api/knowledge/facts/:factId", (req: Request, res: Response) => {
    try {
      const { factId } = req.params;
      const fact = memoryKnowledgeFacts.get(factId);
      if (!fact) {
        return res.status(404).json({ error: `Fact '${factId}' not found` });
      }
      res.json({
        success: true,
        fact: {
          ...fact,
          freshnessStatus: assessFreshness(fact.verifiedAt)
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. User Request to Refresh a fact
  app.post("/api/knowledge/facts/:factId/refresh-request", (req: Request, res: Response) => {
    try {
      const { factId } = req.params;
      const { reason, requestedBy, priority } = req.body || {};
      const fact = memoryKnowledgeFacts.get(factId);
      if (!fact) {
        return res.status(404).json({ error: `Fact '${factId}' not found` });
      }

      const item = DarbGlobalKnowledgeEngine.requestRefresh(
        factId,
        reason || "طلب تحديث ومراجعة من مستخدم المنصة",
        requestedBy || "مستخدم منصة دَرْب",
        priority || "normal"
      );

      res.json({
        success: true,
        message: "تم إدراج طلب التحديث بنجاح في طابور المراجعة والتحقق البشري",
        refreshItem: item
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --------------------------------------------------------------------------
  // ADMIN & GOVERNANCE ENDPOINTS (/api/admin/knowledge/...)
  // --------------------------------------------------------------------------

  // Admin Overview Stats
  app.get("/api/admin/knowledge/overview", (req: Request, res: Response) => {
    try {
      const stats = DarbGlobalKnowledgeEngine.getOverviewStats();
      res.json({
        success: true,
        stats
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin Filter Facts (Supports all statuses)
  app.get("/api/admin/knowledge/facts", (req: Request, res: Response) => {
    try {
      const { countryId, category, publicationStatus, freshnessStatus, query } = req.query;
      let list = Array.from(memoryKnowledgeFacts.values()).map(f => ({
        ...f,
        freshnessStatus: assessFreshness(f.verifiedAt)
      }));

      if (countryId && countryId !== "all") {
        list = list.filter(f => f.countryId === (countryId as string).toUpperCase());
      }
      if (category && category !== "all") {
        list = list.filter(f => f.category === category);
      }
      if (publicationStatus && publicationStatus !== "all") {
        list = list.filter(f => f.publicationStatus === publicationStatus);
      }
      if (freshnessStatus && freshnessStatus !== "all") {
        list = list.filter(f => f.freshnessStatus === freshnessStatus);
      }
      if (query) {
        const q = (query as string).toLowerCase();
        list = list.filter(f =>
          f.subject.toLowerCase().includes(q) ||
          f.factId.toLowerCase().includes(q) ||
          JSON.stringify(f.value).toLowerCase().includes(q)
        );
      }

      res.json({
        success: true,
        count: list.length,
        facts: list
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin: Create new fact (Defaults to pending_review)
  app.post("/api/admin/knowledge/facts", (req: Request, res: Response) => {
    try {
      const { countryId, category, subject, value, currency, sourceName, sourceUrl, confidenceLevel, notes } = req.body || {};
      if (!countryId || !category || !subject || value === undefined) {
        return res.status(400).json({ error: "Missing required fields: countryId, category, subject, value" });
      }

      const fact = DarbGlobalKnowledgeEngine.createFact({
        countryId,
        category,
        subject,
        value,
        currency,
        sourceName,
        sourceUrl,
        confidenceLevel,
        notes
      });

      res.status(201).json({
        success: true,
        message: "تم إنشاء المعلومة بنجاح في حالة 'قيد المراجعة' (Auto Publish = OFF)",
        fact
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin: Human Review Approval or Rejection
  app.post("/api/admin/knowledge/facts/:factId/review", (req: Request, res: Response) => {
    try {
      const { factId } = req.params;
      const { decision, reason, reviewer } = req.body || {};

      if (!decision || !["publish", "reject", "draft"].includes(decision)) {
        return res.status(400).json({ error: "Decision must be 'publish', 'reject', or 'draft'" });
      }

      const updated = DarbGlobalKnowledgeEngine.reviewFact(
        factId,
        decision,
        reviewer || "مشرف النظام",
        reason || "تمت المراجعة البشرية والاعتماد"
      );

      if (!updated) {
        return res.status(404).json({ error: `Fact '${factId}' not found` });
      }

      res.json({
        success: true,
        message: decision === "publish" 
          ? "✅ تم اعتماد المعلومة ونشرها في قاعدة المعرفة بنجاح" 
          : "تم تحديث حالة المعلومة إلى مسودة / مرفوضة",
        fact: updated
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin: Update fact content
  app.patch("/api/admin/knowledge/facts/:factId", (req: Request, res: Response) => {
    try {
      const { factId } = req.params;
      const fact = memoryKnowledgeFacts.get(factId);
      if (!fact) {
        return res.status(404).json({ error: `Fact '${factId}' not found` });
      }

      const { subject, value, currency, sourceName, sourceUrl, confidenceLevel, notes, verifiedAt } = req.body || {};
      if (subject !== undefined) fact.subject = subject;
      if (value !== undefined) fact.value = value;
      if (currency !== undefined) fact.currency = currency;
      if (sourceName !== undefined) fact.sourceName = sourceName;
      if (sourceUrl !== undefined) fact.sourceUrl = sourceUrl;
      if (confidenceLevel !== undefined) fact.confidenceLevel = confidenceLevel;
      if (notes !== undefined) fact.notes = notes;
      if (verifiedAt !== undefined) {
        fact.verifiedAt = verifiedAt;
        fact.freshnessStatus = assessFreshness(verifiedAt);
      }
      fact.updatedAt = new Date().toISOString();

      memoryKnowledgeFacts.set(factId, fact);
      res.json({
        success: true,
        message: "تم تعديل المعلومة بنجاح",
        fact
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin: Delete fact
  app.delete("/api/admin/knowledge/facts/:factId", (req: Request, res: Response) => {
    try {
      const { factId } = req.params;
      if (!memoryKnowledgeFacts.has(factId)) {
        return res.status(404).json({ error: `Fact '${factId}' not found` });
      }
      memoryKnowledgeFacts.delete(factId);
      res.json({
        success: true,
        message: `Fact '${factId}' has been deleted`
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin: Refresh Queue list & resolve
  app.get("/api/admin/knowledge/refresh-queue", (req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        count: memoryRefreshQueue.length,
        items: memoryRefreshQueue
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/admin/knowledge/refresh-queue/:refreshId/resolve", (req: Request, res: Response) => {
    try {
      const { refreshId } = req.params;
      const { reviewedBy } = req.body || {};
      const resolved = DarbGlobalKnowledgeEngine.resolveRefreshItem(refreshId, reviewedBy || "مشرف النظام");
      if (!resolved) {
        return res.status(404).json({ error: `Refresh item '${refreshId}' not found` });
      }
      res.json({
        success: true,
        message: "تم إنهاء ومعالجة طلب التحديث بنجاح",
        item: resolved
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin: Stale Facts Audit
  app.get("/api/admin/knowledge/stale-audit", (req: Request, res: Response) => {
    try {
      const facts = Array.from(memoryKnowledgeFacts.values()).map(f => ({
        ...f,
        freshnessStatus: assessFreshness(f.verifiedAt)
      }));

      const agingFacts = facts.filter(f => f.freshnessStatus === "aging");
      const staleFacts = facts.filter(f => f.freshnessStatus === "stale");

      res.json({
        success: true,
        aging_count: agingFacts.length,
        stale_count: staleFacts.length,
        aging_facts: agingFacts,
        stale_facts: staleFacts,
        audit_note: "الحقائق التي مضى عليها أكثر من 30 يوماً تصنف كـ Aging، وأكثر من 90 يوماً كـ Stale وتتطلب مراجعة بشرية."
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin: Sources
  app.get("/api/admin/knowledge/sources", (req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        sources: Array.from(memoryKnowledgeSources.values())
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/knowledge/sources", (req: Request, res: Response) => {
    try {
      const { country_id, source_name, source_url, source_type, trust_level } = req.body || {};
      if (!source_name || !source_url) {
        return res.status(400).json({ error: "source_name and source_url are required" });
      }
      const newSource = {
        source_id: memoryKnowledgeSources.size + 1,
        country_id: (country_id || "ALL").toUpperCase(),
        source_name,
        source_url,
        source_type: source_type || "official",
        trust_level: trust_level || "standard",
        status: "active" as const
      };
      memoryKnowledgeSources.set(newSource.source_id, newSource);
      res.status(201).json({
        success: true,
        source: newSource
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================================================
  // DARB GKE V1.1 POPULATE & VERIFY ROUTES
  // ==========================================================================

  // 1. Reference Exchange Rates (Tagged is_live: false, non-live disclaimer)
  app.get("/api/knowledge/reference-exchange-rates", (req: Request, res: Response) => {
    try {
      const countryCode = req.query.countryCode as string | undefined;
      const rates = DarbGlobalKnowledgeEngine.getReferenceExchangeRates(countryCode);
      res.json({
        success: true,
        total: rates.length,
        is_live: false,
        disclaimer: "سعر صرف مرجعي استرشادي من دليل 19 سبتمبر 2026 (غير حي - يخضع للمراجعة والتغير الدوري).",
        rates
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. Editorial Hotel Ranges (Tagged is_live: false, non-live disclaimer)
  app.get("/api/knowledge/editorial-hotel-ranges", (req: Request, res: Response) => {
    try {
      const countryCode = req.query.countryCode as string | undefined;
      const ranges = DarbGlobalKnowledgeEngine.getEditorialHotelRanges(countryCode);
      res.json({
        success: true,
        total: ranges.length,
        is_live: false,
        disclaimer: "نطاقات أسعار فندقية استرشادية من دليل 19 سبتمبر 2026 (غير حية - تخضع للتغيرات والمواسم).",
        ranges
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Admin: Verification Queue (418 Slots - 22 Countries x 19 Axes)
  app.get("/api/admin/knowledge/verification-queue", (req: Request, res: Response) => {
    try {
      const { countryCode, axisId, status, search, page, limit } = req.query;
      const result = DarbGlobalKnowledgeEngine.getVerificationQueue({
        countryCode: countryCode as string,
        axisId: axisId as string,
        status: status as string,
        search: search as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 50
      });

      res.json({
        success: true,
        ...result,
        governance_policy: {
          auto_publish: false,
          require_human_review: true,
          total_slots: 418,
          rule: "لا يتم نقل أي خانة إلى حقائق المعرفة المنشورة إلا بعد التحقق البشري الصريح."
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 4. Admin: Get Single Verification Queue Item
  app.get("/api/admin/knowledge/verification-queue/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const item = DarbGlobalKnowledgeEngine.getVerificationQueueItem(id);
      if (!item) {
        return res.status(404).json({ error: `Verification queue slot '${id}' not found` });
      }
      res.json({ success: true, item });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Admin: Human Review on Verification Queue Slot (Auto Publish = OFF)
  app.patch("/api/admin/knowledge/verification-queue/:id/review", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { decision, proposed_value, source_url, confidence, reviewer_id, review_reason } = req.body || {};

      if (!decision || !["verify", "reject", "keep_pending"].includes(decision)) {
        return res.status(400).json({ error: "Decision must be 'verify', 'reject', or 'keep_pending'" });
      }

      if (!reviewer_id || !review_reason) {
        return res.status(400).json({ error: "reviewer_id and review_reason are required for audit trail" });
      }

      const updated = DarbGlobalKnowledgeEngine.reviewVerificationItem(id, {
        decision,
        proposed_value,
        source_url,
        confidence,
        reviewer_id,
        review_reason
      });

      if (!updated) {
        return res.status(404).json({ error: `Verification item '${id}' not found` });
      }

      res.json({
        success: true,
        message: decision === "verify" 
          ? "✅ تم اعتماد الخانة بنجاح وتحويلها إلى حقيقة منشورة في قاعدة المعرفة (Human Review Approved)"
          : decision === "reject"
          ? "❌ تم رفض البيانات المقترحة لهذه الخانة"
          : "تم حفظ الخانة قيد المراجعة",
        item: updated
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. Admin: Seed Batches
  app.get("/api/admin/knowledge/seed-batches", (req: Request, res: Response) => {
    try {
      const batches = DarbGlobalKnowledgeEngine.getSeedBatches();
      res.json({
        success: true,
        batches
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 7. GKE V1.1 Verification Operations Clean Update Routes:
  // GET  /api/admin/gke/v1-1/verification
  // POST /api/admin/gke/v1-1/verification/:id/review
  registerGkeV11VerificationRoutes(app);

  // 8. GKE V1.1 Supplemental Knowledge Approval Routes:
  // GET  /api/admin/gke/v1-1/supplemental
  // POST /api/admin/gke/v1-1/supplemental/:id/review
  registerDarbSupplementalRoutes(app);
}
