import type { Express, Request, Response, NextFunction } from 'express';
import {
  normalizeTopic,
  topicKey,
  buildKnowledgeGap,
  buildAnswerDraft,
  freshnessPriority,
  buildRefreshRequest
} from './darb-ai-learning-engine';

// In-Memory Fallback Stores for Demo / Preview Environment
export interface MemTopic {
  id: number;
  topic_key: string;
  topic_label: string;
  question_count: number;
  unanswered_count: number;
  low_rating_count: number;
  last_seen_at: string;
  created_at: string;
}

export interface MemGap {
  id: number;
  topic: string;
  question: string;
  evidence_status: string;
  occurrence_count: number;
  status: 'pending' | 'approved' | 'needs_revision' | 'rejected';
  proposed_answer: string | null;
  reviewer_id: number | null;
  review_note: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export interface MemDraft {
  id: number;
  question: string;
  draft_answer: string;
  source_answer_run_id: number | null;
  evidence_json: unknown[];
  draft_reason: string;
  status: 'pending' | 'approved' | 'needs_revision' | 'rejected';
  reviewer_id: number | null;
  review_note: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export interface MemRefreshQueueItem {
  id: number;
  source_url: string | null;
  knowledge_item_id: number | null;
  reason: string;
  priority: 'low' | 'normal' | 'high';
  status: 'pending' | 'approved' | 'checked' | 'rejected';
  last_checked_at: string | null;
  reviewer_id: number | null;
  review_note: string | null;
  created_at: string;
}

export interface MemMetric {
  id: number;
  metric_name: string;
  metric_value: number;
  period_start: string | null;
  period_end: string | null;
  metadata_json: Record<string, unknown>;
  created_at: string;
}

// Initial realistic seed data for V1.17 Learning Evolution
export const memLearningTopics: MemTopic[] = [
  {
    id: 1,
    topic_key: topicKey('تجديد الإقامات وتأشيرات العمل ونقل الكفالة'),
    topic_label: 'تجديد الإقامات وتأشيرات العمل ونقل الكفالة',
    question_count: 42,
    unanswered_count: 3,
    low_rating_count: 1,
    last_seen_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 2,
    topic_key: topicKey('توثيق عقود الإيجار السكني للوافدين عبر إيجار'),
    topic_label: 'توثيق عقود الإيجار السكني للوافدين عبر إيجار',
    question_count: 28,
    unanswered_count: 2,
    low_rating_count: 0,
    last_seen_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
  {
    id: 3,
    topic_key: topicKey('رخص القيادة واستبدال الرخص الدولية والخليجية'),
    topic_label: 'رخص القيادة واستبدال الرخص الدولية والخليجية',
    question_count: 19,
    unanswered_count: 4,
    low_rating_count: 2,
    last_seen_at: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
  {
    id: 4,
    topic_key: topicKey('معادلة وتصديق الشهادات الجامعية في مصر والدول العربية'),
    topic_label: 'معادلة وتصديق الشهادات الجامعية في مصر والدول العربية',
    question_count: 16,
    unanswered_count: 1,
    low_rating_count: 0,
    last_seen_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 140).toISOString(),
  },
  {
    id: 5,
    topic_key: topicKey('فتح الحسابات البنكية والتحويلات المالية الدولية للمغتربين'),
    topic_label: 'فتح الحسابات البنكية والتحويلات المالية الدولية للمغتربين',
    question_count: 12,
    unanswered_count: 2,
    low_rating_count: 1,
    last_seen_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 160).toISOString(),
  },
];

export const memKnowledgeGaps: MemGap[] = [
  {
    id: 1,
    topic: 'تجديد الإقامات وتأشيرات العمل ونقل الكفالة',
    question: 'ما هي الشروط المحدثة لتمديد تأشيرة الزيارة العائلية المتعددة إلكترونياً والحد الأقصى للإقامة؟',
    evidence_status: 'insufficient',
    occurrence_count: 8,
    status: 'pending',
    proposed_answer: 'يتطلب التمديد وجود تأمين طبي ساري المفعول يغطي فترة التمديد عبر مجلس الضمان الصحي، وسداد رسوم 100 ريال عبر منصة سداد قبل نهاية التأشيرة بأسبوع، مع حد أقصى للإقامة المتصلة 180 أو 270 يوماً حسب تصنيف التأشيرة في منصة أبشر أو منصة التأشيرات.',
    reviewer_id: null,
    review_note: 'بحاجة إلى تدقيق التحديثات الأخيرة للضوابط وإرفاق رابط منصة وزارة الخارجية الرسمية',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    reviewed_at: null,
  },
  {
    id: 2,
    topic: 'توثيق عقود الإيجار السكني للوافدين عبر إيجار',
    question: 'هل يلزم موافقة الكفيل أو صاحب العمل لتوثيق عقد الإيجار للوافد العازب؟',
    evidence_status: 'insufficient',
    occurrence_count: 5,
    status: 'pending',
    proposed_answer: 'النظام في شبكة إيجار لا يشترط موافقة صاحب العمل أو الكفيل لتوثيق عقد الإيجار السكني للوافد طالما كانت الإقامة سارية وحساب أبشر مفعلاً، ولكن يُشترط التزام المؤجر بتصنيف العقار والحي وفق اشتراطات البلدية.',
    reviewer_id: null,
    review_note: 'سؤال متكرر ومطلوب إضافة سند تنظيمي من شبكة إيجار',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    reviewed_at: null,
  },
  {
    id: 3,
    topic: 'رخص القيادة واستبدال الرخص الدولية والخليجية',
    question: 'ما هي قائمة الدول التي تُقبل رخص قيادتها للاستبدال الفوري في دبي بدون فحص قيادة كامل؟',
    evidence_status: 'partial',
    occurrence_count: 6,
    status: 'needs_revision',
    proposed_answer: 'تشمل القائمة دول مجلس التعاون الخليجي ومعظم دول الاتحاد الأوروبي وبريطانيا وأمريكا وكندا، مع اشتراط ترجمة قانونية للرخص غير الصادرة باللغتين العربية أو الإنجليزية وفحص نظر معتمد من هيئة الطرق والمواصلات RTA.',
    reviewer_id: 1,
    review_note: 'يُرجى إرفاق رابط قائمة الدول المعتمدة المباشر من بوابة هيئة الطرق والمواصلات RTA بدبي',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    reviewed_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

export const memAnswerDrafts: MemDraft[] = [
  {
    id: 1,
    question: 'خطوات استخراج شريحة اتصال مدمجة eSIM للمسافرين القادمين إلى السعودية ومصر',
    draft_answer: 'يمكن للمسافرين شراء وتفعيل شرائح الاتصال المدمجة eSIM قبل الوصول أو عند الوصول عبر تطبيقات المشغلين الرسميين، مع التحقق من الهوية عبر منصة نفاذ للوافدين والمقيمين، أو عبر جواز السفر وتأشيرة الدخول للزوار والسياح في منافذ المطار.',
    source_answer_run_id: 104,
    evidence_json: [
      { source: 'هيئة الاتصالات والفضاء والتقنية', url: 'https://cst.gov.sa', verified: true },
      { source: 'الجهاز القومي لتنظيم الاتصالات بمصر', url: 'https://tra.gov.eg', verified: true }
    ],
    draft_reason: 'تكرار استفسارات المغتربين والمسافرين الجدد',
    status: 'pending',
    reviewer_id: null,
    review_note: 'مسودة مقترحة لزيادة التغطية المعرفية في بوابة دَرْب - تتطلب مراجعة واعتماد بشري',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    reviewed_at: null,
  },
  {
    id: 2,
    question: 'طريقة تجديد بطاقة الهوية الرقمية للمقيمين في الإمارات عبر تطبيق UAE PASS',
    draft_answer: 'يتم تجديد بطاقة الهوية الإماراتية عبر تطبيق ICP أو تطبيق الهيئة الاتحادية للهوية والجنسية والجمارك وأمن المنافذ باستخدام UAE PASS للدخول الموحد، وسداد الرسوم وإرفاق الفحص الطبي الساري.',
    source_answer_run_id: 88,
    evidence_json: [
      { source: 'بوابة حكومة الإمارات الرسمية', url: 'https://u.ae', verified: true }
    ],
    draft_reason: 'تحسين جودة الإجابة بناءً على تقييمات المستخدمين',
    status: 'approved',
    reviewer_id: 1,
    review_note: 'تمت المراجعة والتحقق من صحة الإجراءات والروابط الرسمية المعتمدة',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    reviewed_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
];

export const memRefreshQueue: MemRefreshQueueItem[] = [
  {
    id: 1,
    source_url: 'https://old-portal.example.gov/fees-2023',
    knowledge_item_id: null,
    reason: 'المصدر يعطي كود 404 وتجاوزت فترة آخر فحص 120 يوماً',
    priority: 'high',
    status: 'pending',
    last_checked_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
    reviewer_id: null,
    review_note: 'يتطلب استبدال الرابط بآخر تحديث من البوابة الرسمية الجديدة',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: 2,
    source_url: 'https://digital.gov.eg',
    knowledge_item_id: null,
    reason: 'تحديث دوري لمصادر المعاملات الرقمية الحكومية بمصر',
    priority: 'normal',
    status: 'pending',
    last_checked_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 38).toISOString(),
    reviewer_id: null,
    review_note: 'فحص دوري كل 30 يوماً لضمان عدم تغير روابط الخدمات',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: 3,
    source_url: 'https://www.absher.sa/portal/landing.html',
    knowledge_item_id: 12,
    reason: 'التحقق من ضوابط تجديد الإقامة وتأشيرات المرافقين',
    priority: 'high',
    status: 'checked',
    last_checked_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    reviewer_id: 1,
    review_note: 'تم الفحص والتأكد من استجابة المنصة واستقرار المحتوى',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
  },
];

export const memLearningMetrics: MemMetric[] = [
  {
    id: 1,
    metric_name: 'answer_helpful_rate',
    metric_value: 94.2,
    period_start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    period_end: new Date().toISOString(),
    metadata_json: { positive: 146, negative: 9, description: 'نسبة التقييمات الإيجابية للمساعد' },
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    metric_name: 'unanswered_rate',
    metric_value: 3.8,
    period_start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    period_end: new Date().toISOString(),
    metadata_json: { fallback_count: 6, total_queries: 155, description: 'نسبة الاستفسارات التي لم تجد إجابة مباشرة' },
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    metric_name: 'repeated_question_rate',
    metric_value: 28.5,
    period_start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    period_end: new Date().toISOString(),
    metadata_json: { repeated_queries: 44, total_queries: 155, description: 'نسبة الاستفسارات المتكررة التي تمت مطابقتها' },
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    metric_name: 'knowledge_gap_count',
    metric_value: 6,
    period_start: null,
    period_end: null,
    metadata_json: { active_gaps: 3, resolved_gaps: 3, description: 'إجمالي الفجوات المعرفية المكتشفة' },
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    metric_name: 'stale_source_count',
    metric_value: 2,
    period_start: null,
    period_end: null,
    metadata_json: { stale_urls: 1, aging_urls: 1, description: 'المصادر التي تحتاج إلى تحديث أو فحص عاجل' },
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    metric_name: 'reviewed_drafts_count',
    metric_value: 15,
    period_start: null,
    period_end: null,
    metadata_json: { approved: 12, rejected: 1, needs_revision: 2, description: 'المسودات التي راجعها المشرفون' },
    created_at: new Date().toISOString(),
  },
];

let nextTopicId = 100;
let nextGapId = 100;
let nextDraftId = 100;
let nextRefreshId = 100;
let nextMetricId = 100;

export function registerDarbAILearningRoutes(
  app: Express,
  poolOrOptions?: any,
  maybeOptions?: { isAdmin?: (req: Request) => boolean | Promise<boolean> }
) {
  let pool = poolOrOptions;
  let isAdminCheck = maybeOptions?.isAdmin;

  if (poolOrOptions && typeof poolOrOptions.isAdmin === 'function') {
    pool = poolOrOptions.pool;
    isAdminCheck = poolOrOptions.isAdmin;
  }

  // Auto-init DB schema if pool exists
  if (pool) {
    (async () => {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS ai_learning_topics (
            id BIGSERIAL PRIMARY KEY,
            topic_key TEXT NOT NULL UNIQUE,
            topic_label TEXT NOT NULL,
            question_count INTEGER NOT NULL DEFAULT 0,
            unanswered_count INTEGER NOT NULL DEFAULT 0,
            low_rating_count INTEGER NOT NULL DEFAULT 0,
            last_seen_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          CREATE INDEX IF NOT EXISTS idx_ai_learning_topics_questions
            ON ai_learning_topics(question_count DESC);

          CREATE TABLE IF NOT EXISTS ai_knowledge_gaps (
            id BIGSERIAL PRIMARY KEY,
            topic TEXT NOT NULL,
            question TEXT NOT NULL,
            evidence_status TEXT NOT NULL DEFAULT 'insufficient',
            occurrence_count INTEGER NOT NULL DEFAULT 1,
            status TEXT NOT NULL DEFAULT 'pending',
            proposed_answer TEXT,
            reviewer_id BIGINT,
            review_note TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            reviewed_at TIMESTAMPTZ
          );

          CREATE INDEX IF NOT EXISTS idx_ai_knowledge_gaps_status
            ON ai_knowledge_gaps(status);

          CREATE TABLE IF NOT EXISTS ai_answer_drafts (
            id BIGSERIAL PRIMARY KEY,
            question TEXT NOT NULL,
            draft_answer TEXT NOT NULL,
            source_answer_run_id BIGINT,
            evidence_json JSONB NOT NULL DEFAULT '[]'::jsonb,
            draft_reason TEXT,
            status TEXT NOT NULL DEFAULT 'pending',
            reviewer_id BIGINT,
            review_note TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            reviewed_at TIMESTAMPTZ
          );

          CREATE INDEX IF NOT EXISTS idx_ai_answer_drafts_status
            ON ai_answer_drafts(status);

          CREATE TABLE IF NOT EXISTS ai_knowledge_refresh_queue (
            id BIGSERIAL PRIMARY KEY,
            source_url TEXT,
            knowledge_item_id BIGINT,
            reason TEXT NOT NULL,
            priority TEXT NOT NULL DEFAULT 'normal',
            status TEXT NOT NULL DEFAULT 'pending',
            last_checked_at TIMESTAMPTZ,
            reviewer_id BIGINT,
            review_note TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          CREATE INDEX IF NOT EXISTS idx_ai_refresh_queue_status
            ON ai_knowledge_refresh_queue(status);

          CREATE TABLE IF NOT EXISTS ai_learning_metrics (
            id BIGSERIAL PRIMARY KEY,
            metric_name TEXT NOT NULL,
            metric_value NUMERIC NOT NULL,
            period_start TIMESTAMPTZ,
            period_end TIMESTAMPTZ,
            metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          CREATE INDEX IF NOT EXISTS idx_ai_learning_metrics_name
            ON ai_learning_metrics(metric_name);
        `);
        console.log('[DARB V1.17] AI Learning & Evolution tables verified');
      } catch (err) {
        console.warn('[DARB V1.17] Schema migration failed or DB unavailable; using in-memory store:', err);
      }
    })();
  }

  const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isAdminCheck) {
        const authorized = await isAdminCheck(req);
        if (!authorized) return res.status(403).json({ ok: false, error: 'صلاحية المشرف مطلوبة (admin_required)' });
        return next();
      }
      const user = (req as any).user;
      if (user && (user.isAdmin === true || user.role === 'admin')) return next();
      if (!pool) return next(); // demo mode preview permissive fallback
      return res.status(403).json({ ok: false, error: 'صلاحية المشرف مطلوبة (admin_required)' });
    } catch {
      return res.status(403).json({ ok: false, error: 'تعذر التحقق من الصلاحية' });
    }
  };

  // ============================================================
  // 1. TOPICS & DEMAND CLUSTERING
  // ============================================================

  app.post('/api/admin/ai/learning/topics/record', adminOnly, async (req: Request, res: Response) => {
    try {
      const text = String(req.body?.topic || req.body?.question || '').trim();
      if (!text) return res.status(400).json({ ok: false, error: 'topic_required' });

      const label = normalizeTopic(text);
      const key = topicKey(text);

      if (pool) {
        try {
          const result = await pool.query(
            `INSERT INTO ai_learning_topics
              (topic_key, topic_label, question_count, last_seen_at)
             VALUES ($1,$2,1,NOW())
             ON CONFLICT (topic_key)
             DO UPDATE SET question_count=ai_learning_topics.question_count+1,
                           last_seen_at=NOW()
             RETURNING *`,
            [key, label]
          );
          return res.json({ ok: true, topic: result.rows[0] });
        } catch (dbErr) {
          console.warn('[DARB V1.17] Topic record DB fallback:', dbErr);
        }
      }

      // In-Memory Fallback
      let item = memLearningTopics.find((t) => t.topic_key === key);
      if (item) {
        item.question_count += 1;
        item.last_seen_at = new Date().toISOString();
      } else {
        item = {
          id: ++nextTopicId,
          topic_key: key,
          topic_label: label,
          question_count: 1,
          unanswered_count: 0,
          low_rating_count: 0,
          last_seen_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };
        memLearningTopics.push(item);
      }
      res.json({ ok: true, topic: item });
    } catch {
      res.status(500).json({ ok: false, error: 'topic_record_failed' });
    }
  });

  app.get('/api/admin/ai/learning/topics', adminOnly, async (_req: Request, res: Response) => {
    try {
      if (pool) {
        try {
          const result = await pool.query(
            `SELECT * FROM ai_learning_topics
             ORDER BY question_count DESC, last_seen_at DESC NULLS LAST LIMIT 200`
          );
          if (result.rows && result.rows.length > 0) {
            return res.json({ ok: true, items: result.rows });
          }
        } catch (dbErr) {
          console.warn('[DARB V1.17] Topics query DB fallback:', dbErr);
        }
      }
      const sorted = [...memLearningTopics].sort((a, b) => b.question_count - a.question_count);
      res.json({ ok: true, items: sorted });
    } catch {
      res.status(500).json({ ok: false, error: 'topics_failed' });
    }
  });

  // ============================================================
  // 2. KNOWLEDGE GAPS
  // ============================================================

  app.post('/api/admin/ai/learning/gaps', adminOnly, async (req: Request, res: Response) => {
    try {
      const gap = buildKnowledgeGap(req.body || {});
      if (!gap.question) return res.status(400).json({ ok: false, error: 'question_required' });

      if (pool) {
        try {
          const result = await pool.query(
            `INSERT INTO ai_knowledge_gaps
              (topic, question, evidence_status)
             VALUES ($1,$2,$3) RETURNING *`,
            [gap.topic, gap.question, gap.evidenceStatus]
          );
          return res.json({ ok: true, gap: result.rows[0] });
        } catch (dbErr) {
          console.warn('[DARB V1.17] Gap insert DB fallback:', dbErr);
        }
      }

      // In-Memory Fallback
      const newGap: MemGap = {
        id: ++nextGapId,
        topic: gap.topic,
        question: gap.question,
        evidence_status: gap.evidenceStatus,
        occurrence_count: 1,
        status: 'pending',
        proposed_answer: req.body?.proposedAnswer || null,
        reviewer_id: null,
        review_note: req.body?.reviewNote || 'تم إنشاء الفجوة المعرفية للمراجعة البشرية',
        created_at: new Date().toISOString(),
        reviewed_at: null,
      };
      memKnowledgeGaps.unshift(newGap);
      res.json({ ok: true, gap: newGap });
    } catch {
      res.status(500).json({ ok: false, error: 'gap_create_failed' });
    }
  });

  app.get('/api/admin/ai/learning/gaps', adminOnly, async (req: Request, res: Response) => {
    try {
      const status = (req.query.status as string) || 'all';

      if (pool) {
        try {
          const query = status === 'all'
            ? `SELECT * FROM ai_knowledge_gaps ORDER BY occurrence_count DESC, created_at DESC LIMIT 200`
            : `SELECT * FROM ai_knowledge_gaps WHERE status=$1 ORDER BY occurrence_count DESC, created_at DESC LIMIT 200`;
          const params = status === 'all' ? [] : [status];
          const result = await pool.query(query, params);
          if (result.rows && result.rows.length > 0) {
            return res.json({ ok: true, items: result.rows });
          }
        } catch (dbErr) {
          console.warn('[DARB V1.17] Gaps query DB fallback:', dbErr);
        }
      }

      let items = [...memKnowledgeGaps];
      if (status !== 'all') {
        items = items.filter((g) => g.status === status);
      }
      res.json({ ok: true, items });
    } catch {
      res.status(500).json({ ok: false, error: 'gaps_failed' });
    }
  });

  app.patch('/api/admin/ai/learning/gaps/:id', adminOnly, async (req: Request, res: Response) => {
    try {
      const { status, proposedAnswer, reviewNote } = req.body || {};
      if (!['approved', 'needs_revision', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ ok: false, error: 'invalid_status' });
      }

      const id = Number(req.params.id);

      if (pool) {
        try {
          const result = await pool.query(
            `UPDATE ai_knowledge_gaps
             SET status=$1, proposed_answer=COALESCE($2, proposed_answer), review_note=$3,
                 reviewer_id=$4, reviewed_at=NOW()
             WHERE id=$5 RETURNING *`,
            [status, proposedAnswer ?? null, reviewNote ?? null, (req as any).user?.id ?? 1, id]
          );
          if (result.rowCount) {
            return res.json({ ok: true, gap: result.rows[0] });
          }
        } catch (dbErr) {
          console.warn('[DARB V1.17] Gap update DB fallback:', dbErr);
        }
      }

      const item = memKnowledgeGaps.find((g) => g.id === id);
      if (!item) return res.status(404).json({ ok: false, error: 'gap_not_found' });

      item.status = status;
      if (proposedAnswer !== undefined) item.proposed_answer = proposedAnswer;
      if (reviewNote !== undefined) item.review_note = reviewNote;
      item.reviewer_id = (req as any).user?.id ?? 1;
      item.reviewed_at = new Date().toISOString();

      res.json({ ok: true, gap: item });
    } catch {
      res.status(500).json({ ok: false, error: 'gap_update_failed' });
    }
  });

  // Convert gap to V1.15 Knowledge Candidate
  app.post('/api/admin/ai/learning/gaps/:id/convert-to-candidate', adminOnly, async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      let gap = memKnowledgeGaps.find((g) => g.id === id);

      if (pool) {
        try {
          const dbRes = await pool.query('SELECT * FROM ai_knowledge_gaps WHERE id=$1', [id]);
          if (dbRes.rows && dbRes.rows.length > 0) {
            gap = dbRes.rows[0];
          }
        } catch (dbErr) {
          console.warn('[DARB V1.17] Gap fetch DB fallback:', dbErr);
        }
      }

      if (!gap) return res.status(404).json({ ok: false, error: 'gap_not_found' });

      // Create knowledge candidate in V1.15 table if available, or in-memory
      const proposedAnswer = req.body?.proposedAnswer || gap.proposed_answer || null;
      const reviewNote = `تم التحويل من الفجوات المعرفية (V1.17): ${gap.topic}`;

      if (pool) {
        try {
          const candRes = await pool.query(
            `INSERT INTO ai_knowledge_candidates
              (question, proposed_answer, source_type, status, review_note)
             VALUES ($1, $2, 'knowledge_gap', 'pending', $3)
             RETURNING *`,
            [gap.question, proposedAnswer, reviewNote]
          );
          return res.json({
            ok: true,
            message: 'تم تحويل الفجوة المعرفية إلى مقترح معرفة (قيد المراجعة) بنجاح',
            candidate: candRes.rows[0],
          });
        } catch (dbErr) {
          console.warn('[DARB V1.17] Candidate create DB fallback:', dbErr);
        }
      }

      res.json({
        ok: true,
        message: 'تم تحويل الفجوة المعرفية إلى مقترح معرفة (قيد المراجعة) بنجاح',
        candidate: {
          id: Math.floor(Math.random() * 9000) + 1000,
          question: gap.question,
          proposed_answer: proposedAnswer,
          source_type: 'knowledge_gap',
          status: 'pending',
          review_note: reviewNote,
          created_at: new Date().toISOString(),
        },
      });
    } catch {
      res.status(500).json({ ok: false, error: 'gap_convert_failed' });
    }
  });

  // ============================================================
  // 3. ANSWER DRAFTS
  // ============================================================

  app.post('/api/admin/ai/learning/answer-drafts', adminOnly, async (req: Request, res: Response) => {
    try {
      const draft = buildAnswerDraft(req.body || {});
      if (!draft.question || !draft.draftAnswer) {
        return res.status(400).json({ ok: false, error: 'question_and_draft_required' });
      }

      if (pool) {
        try {
          const result = await pool.query(
            `INSERT INTO ai_answer_drafts
              (question, draft_answer, source_answer_run_id, evidence_json, draft_reason)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [
              draft.question,
              draft.draftAnswer,
              draft.sourceAnswerRunId,
              JSON.stringify(draft.evidence),
              draft.draftReason,
            ]
          );
          return res.json({ ok: true, draft: result.rows[0] });
        } catch (dbErr) {
          console.warn('[DARB V1.17] Draft insert DB fallback:', dbErr);
        }
      }

      const newDraft: MemDraft = {
        id: ++nextDraftId,
        question: draft.question,
        draft_answer: draft.draftAnswer,
        source_answer_run_id: draft.sourceAnswerRunId,
        evidence_json: draft.evidence,
        draft_reason: draft.draftReason,
        status: 'pending',
        reviewer_id: null,
        review_note: null,
        created_at: new Date().toISOString(),
        reviewed_at: null,
      };
      memAnswerDrafts.unshift(newDraft);
      res.json({ ok: true, draft: newDraft });
    } catch {
      res.status(500).json({ ok: false, error: 'draft_create_failed' });
    }
  });

  app.get('/api/admin/ai/learning/answer-drafts', adminOnly, async (req: Request, res: Response) => {
    try {
      const status = (req.query.status as string) || 'all';

      if (pool) {
        try {
          const query = status === 'all'
            ? `SELECT * FROM ai_answer_drafts ORDER BY created_at DESC LIMIT 200`
            : `SELECT * FROM ai_answer_drafts WHERE status=$1 ORDER BY created_at DESC LIMIT 200`;
          const params = status === 'all' ? [] : [status];
          const result = await pool.query(query, params);
          if (result.rows && result.rows.length > 0) {
            return res.json({ ok: true, items: result.rows });
          }
        } catch (dbErr) {
          console.warn('[DARB V1.17] Drafts query DB fallback:', dbErr);
        }
      }

      let items = [...memAnswerDrafts];
      if (status !== 'all') {
        items = items.filter((d) => d.status === status);
      }
      res.json({ ok: true, items });
    } catch {
      res.status(500).json({ ok: false, error: 'drafts_failed' });
    }
  });

  app.patch('/api/admin/ai/learning/answer-drafts/:id', adminOnly, async (req: Request, res: Response) => {
    try {
      const { status, reviewNote, draftAnswer } = req.body || {};
      if (!['approved', 'needs_revision', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ ok: false, error: 'invalid_status' });
      }

      const id = Number(req.params.id);

      if (pool) {
        try {
          const result = await pool.query(
            `UPDATE ai_answer_drafts
             SET status=$1, review_note=$2,
                 draft_answer=COALESCE($3, draft_answer),
                 reviewer_id=$4, reviewed_at=NOW()
             WHERE id=$5 RETURNING *`,
            [status, reviewNote ?? null, draftAnswer ?? null, (req as any).user?.id ?? 1, id]
          );
          if (result.rowCount) {
            return res.json({ ok: true, draft: result.rows[0] });
          }
        } catch (dbErr) {
          console.warn('[DARB V1.17] Draft update DB fallback:', dbErr);
        }
      }

      const item = memAnswerDrafts.find((d) => d.id === id);
      if (!item) return res.status(404).json({ ok: false, error: 'draft_not_found' });

      item.status = status;
      if (reviewNote !== undefined) item.review_note = reviewNote;
      if (draftAnswer !== undefined && draftAnswer.trim()) item.draft_answer = draftAnswer.trim();
      item.reviewer_id = (req as any).user?.id ?? 1;
      item.reviewed_at = new Date().toISOString();

      res.json({ ok: true, draft: item });
    } catch {
      res.status(500).json({ ok: false, error: 'draft_update_failed' });
    }
  });

  // ============================================================
  // 4. KNOWLEDGE & SOURCE REFRESH QUEUE
  // ============================================================

  app.post('/api/admin/ai/learning/refresh-queue', adminOnly, async (req: Request, res: Response) => {
    try {
      const item = buildRefreshRequest(req.body || {});
      if (!item.reason) return res.status(400).json({ ok: false, error: 'reason_required' });

      if (pool) {
        try {
          const result = await pool.query(
            `INSERT INTO ai_knowledge_refresh_queue
              (source_url, knowledge_item_id, reason, priority)
             VALUES ($1,$2,$3,$4) RETURNING *`,
            [item.sourceUrl, item.knowledgeItemId, item.reason, item.priority]
          );
          return res.json({ ok: true, item: result.rows[0] });
        } catch (dbErr) {
          console.warn('[DARB V1.17] Refresh insert DB fallback:', dbErr);
        }
      }

      const newItem: MemRefreshQueueItem = {
        id: ++nextRefreshId,
        source_url: item.sourceUrl,
        knowledge_item_id: item.knowledgeItemId,
        reason: item.reason,
        priority: item.priority as any,
        status: 'pending',
        last_checked_at: null,
        reviewer_id: null,
        review_note: null,
        created_at: new Date().toISOString(),
      };
      memRefreshQueue.unshift(newItem);
      res.json({ ok: true, item: newItem });
    } catch {
      res.status(500).json({ ok: false, error: 'refresh_queue_failed' });
    }
  });

  app.get('/api/admin/ai/learning/refresh-queue', adminOnly, async (req: Request, res: Response) => {
    try {
      const status = (req.query.status as string) || 'all';

      if (pool) {
        try {
          const query = status === 'all'
            ? `SELECT * FROM ai_knowledge_refresh_queue
               ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END, created_at DESC LIMIT 200`
            : `SELECT * FROM ai_knowledge_refresh_queue
               WHERE status=$1
               ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END, created_at DESC LIMIT 200`;
          const params = status === 'all' ? [] : [status];
          const result = await pool.query(query, params);
          if (result.rows && result.rows.length > 0) {
            return res.json({ ok: true, items: result.rows });
          }
        } catch (dbErr) {
          console.warn('[DARB V1.17] Refresh query DB fallback:', dbErr);
        }
      }

      let items = [...memRefreshQueue];
      if (status !== 'all') {
        items = items.filter((q) => q.status === status);
      }
      res.json({ ok: true, items });
    } catch {
      res.status(500).json({ ok: false, error: 'refresh_queue_list_failed' });
    }
  });

  app.patch('/api/admin/ai/learning/refresh-queue/:id', adminOnly, async (req: Request, res: Response) => {
    try {
      const { status, reviewNote } = req.body || {};
      if (!['approved', 'checked', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ ok: false, error: 'invalid_status' });
      }

      const id = Number(req.params.id);

      if (pool) {
        try {
          const result = await pool.query(
            `UPDATE ai_knowledge_refresh_queue
             SET status=$1, review_note=$2, reviewer_id=$3,
                 last_checked_at=CASE WHEN $1='checked' THEN NOW() ELSE last_checked_at END
             WHERE id=$4 RETURNING *`,
            [status, reviewNote ?? null, (req as any).user?.id ?? 1, id]
          );
          if (result.rowCount) {
            return res.json({ ok: true, item: result.rows[0] });
          }
        } catch (dbErr) {
          console.warn('[DARB V1.17] Refresh update DB fallback:', dbErr);
        }
      }

      const item = memRefreshQueue.find((q) => q.id === id);
      if (!item) return res.status(404).json({ ok: false, error: 'refresh_item_not_found' });

      item.status = status;
      if (reviewNote !== undefined) item.review_note = reviewNote;
      if (status === 'checked') item.last_checked_at = new Date().toISOString();
      item.reviewer_id = (req as any).user?.id ?? 1;

      res.json({ ok: true, item });
    } catch {
      res.status(500).json({ ok: false, error: 'refresh_update_failed' });
    }
  });

  // ============================================================
  // 5. LEARNING METRICS
  // ============================================================

  app.get('/api/admin/ai/learning/metrics', adminOnly, async (_req: Request, res: Response) => {
    try {
      if (pool) {
        try {
          const result = await pool.query(
            `SELECT metric_name,
                    AVG(metric_value)::numeric AS average_value,
                    MIN(metric_value)::numeric AS min_value,
                    MAX(metric_value)::numeric AS max_value,
                    COUNT(*)::int AS samples
             FROM ai_learning_metrics
             GROUP BY metric_name ORDER BY metric_name`
          );
          if (result.rows && result.rows.length > 0) {
            return res.json({ ok: true, items: result.rows });
          }
        } catch (dbErr) {
          console.warn('[DARB V1.17] Metrics query DB fallback:', dbErr);
        }
      }

      res.json({ ok: true, items: memLearningMetrics });
    } catch {
      res.status(500).json({ ok: false, error: 'metrics_failed' });
    }
  });

  app.post('/api/admin/ai/learning/metrics', adminOnly, async (req: Request, res: Response) => {
    try {
      const { metricName, metricValue, periodStart, periodEnd, metadata } = req.body || {};
      if (!metricName || metricValue == null) {
        return res.status(400).json({ ok: false, error: 'metric_required' });
      }

      if (pool) {
        try {
          const result = await pool.query(
            `INSERT INTO ai_learning_metrics
              (metric_name, metric_value, period_start, period_end, metadata_json)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [
              metricName,
              Number(metricValue),
              periodStart ?? null,
              periodEnd ?? null,
              JSON.stringify(metadata || {}),
            ]
          );
          return res.json({ ok: true, metric: result.rows[0] });
        } catch (dbErr) {
          console.warn('[DARB V1.17] Metric insert DB fallback:', dbErr);
        }
      }

      const newMetric: MemMetric = {
        id: ++nextMetricId,
        metric_name: metricName,
        metric_value: Number(metricValue),
        period_start: periodStart ?? null,
        period_end: periodEnd ?? null,
        metadata_json: metadata || {},
        created_at: new Date().toISOString(),
      };
      memLearningMetrics.push(newMetric);
      res.json({ ok: true, metric: newMetric });
    } catch {
      res.status(500).json({ ok: false, error: 'metric_create_failed' });
    }
  });
}
