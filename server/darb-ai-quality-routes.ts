/**
 * DARB V1.15 — AI Quality & Knowledge Governance Routes
 * Implements feedback, answer quality reviews, quality summaries, and knowledge candidate governance.
 * Additive and backward-compatible with V1.10 - V1.14.
 */

import type { Express, Request, Response, NextFunction } from 'express';
import { memAnswerRuns } from './darb-ai-answer-routes';
import { buildKnowledgeCandidate } from './darb-ai-quality-candidate';

export interface AnswerFeedbackRecord {
  id: number | string;
  answer_run_id: number | string | null;
  conversation_id: number | string | null;
  user_id: number | string | null;
  rating: 'helpful' | 'not_helpful';
  comment: string | null;
  created_at: string;
}

export interface QualityReviewRecord {
  id: number | string;
  answer_run_id: number | string;
  reviewer_id: number | string | null;
  decision: 'approved' | 'needs_revision' | 'rejected';
  note: string | null;
  created_at: string;
}

export interface KnowledgeCandidateRecord {
  id: number;
  question: string;
  proposed_answer: string | null;
  source_answer_run_id: number | string | null;
  source_type: string;
  status: 'pending' | 'approved' | 'needs_revision' | 'rejected';
  reviewer_id: number | string | null;
  review_note: string | null;
  created_at: string;
  reviewed_at: string | null;
}

// In-memory fallback stores for Demo / Preview mode
export const memFeedbacks: AnswerFeedbackRecord[] = [
  {
    id: 1,
    answer_run_id: 1,
    conversation_id: 101,
    user_id: null,
    rating: 'helpful',
    comment: 'إجابة واضحة ومباشرة مع روابط المصادر الرسمية.',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 2,
    answer_run_id: 2,
    conversation_id: 102,
    user_id: null,
    rating: 'not_helpful',
    comment: 'لم تتضمن الإجابة تفاصيل رسوم التجديد لعام 2026 بدقة.',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export const memReviews: QualityReviewRecord[] = [
  {
    id: 1,
    answer_run_id: 1,
    reviewer_id: 1,
    decision: 'approved',
    note: 'المصادر والخطوات مطابقة للدليل القنصلي الرسمي.',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

export const memCandidates: KnowledgeCandidateRecord[] = [
  {
    id: 1,
    question: 'ما هي متطلبات تصديق شهادة الميلاد المصرية من القنصلية بالرياض؟',
    proposed_answer: 'أصل شهادة الميلاد المميكنة مصدقة من الخارجية المصرية، صورة جواز سفر الأب والأم، سداد الرسوم القنصلية وحجز موعد عبر منصة مواعيد القنصلية.',
    source_answer_run_id: 2,
    source_type: 'unanswered',
    status: 'pending',
    reviewer_id: null,
    review_note: null,
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    reviewed_at: null,
  },
  {
    id: 2,
    question: 'كيفية تحويل الإقامة عند تغيير جهة العمل في منصة قوى؟',
    proposed_answer: 'قبول العرض الوظيفي على منصة قوى، موافقة صاحب العمل الجديد، إكمال مدة الإشعار النظامية، وسداد رسوم نقل الخدمة عبر سداد.',
    source_answer_run_id: null,
    source_type: 'admin',
    status: 'approved',
    reviewer_id: 1,
    review_note: 'تم التحقق من خطوات منصة قوى لعام 2026.',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    reviewed_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

let feedbackCounter = 3;
let reviewCounter = 2;
let candidateCounter = 3;

export function registerDarbAIQualityRoutes(
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

  // 1. POST /api/ai/answer-feedback
  app.post('/api/ai/answer-feedback', async (req: Request, res: Response) => {
    try {
      const { answerRunId, conversationId, userId, rating, comment } = req.body || {};
      if (!rating || !['helpful', 'not_helpful'].includes(rating)) {
        return res.status(400).json({ ok: false, error: 'invalid_rating' });
      }

      let insertedId: number | string = feedbackCounter++;
      let createdAt = new Date().toISOString();

      if (pool) {
        try {
          const result = await pool.query(
            `INSERT INTO ai_answer_feedback
              (answer_run_id, conversation_id, user_id, rating, comment)
             VALUES ($1,$2,$3,$4,$5)
             RETURNING id, created_at`,
            [
              answerRunId ? (isNaN(Number(answerRunId)) ? null : Number(answerRunId)) : null,
              conversationId ? (isNaN(Number(conversationId)) ? null : Number(conversationId)) : null,
              userId ? (isNaN(Number(userId)) ? null : Number(userId)) : null,
              rating,
              comment ? String(comment).slice(0, 1000) : null,
            ]
          );
          if (result.rows?.[0]) {
            insertedId = result.rows[0].id;
            createdAt = result.rows[0].created_at;
          }
        } catch (dbErr) {
          console.warn('[DARB V1.15] DB feedback warning, saving to memory fallback:', dbErr);
        }
      }

      const record: AnswerFeedbackRecord = {
        id: insertedId,
        answer_run_id: answerRunId ?? null,
        conversation_id: conversationId ?? null,
        user_id: userId ?? null,
        rating,
        comment: comment ?? null,
        created_at: createdAt,
      };

      memFeedbacks.unshift(record);
      if (memFeedbacks.length > 500) memFeedbacks.pop();

      // If rating is 'not_helpful', auto-generate a knowledge candidate in pending review if question exists
      if (rating === 'not_helpful' && req.body?.question) {
        const candidate = buildKnowledgeCandidate({
          question: req.body.question,
          proposedAnswer: comment ? `ملاحظة المستخدم: ${comment}` : undefined,
          answerRunId: answerRunId,
          sourceType: 'low_rating',
        });
        memCandidates.unshift({
          id: candidateCounter++,
          ...candidate,
          reviewer_id: null,
          review_note: null,
          created_at: new Date().toISOString(),
          reviewed_at: null,
        });
      }

      return res.json({ ok: true, feedback: record });
    } catch (e: any) {
      console.error('[DARB V1.15] feedback error:', e);
      return res.status(500).json({ ok: false, error: 'feedback_failed' });
    }
  });

  // 2. GET /api/admin/ai/quality-summary
  app.get('/api/admin/ai/quality-summary', adminOnly, async (_req: Request, res: Response) => {
    try {
      if (pool) {
        try {
          const [ratingsRes, runsRes, candidatesRes] = await Promise.all([
            pool.query(`SELECT rating, COUNT(*)::int AS count
                        FROM ai_answer_feedback GROUP BY rating ORDER BY rating`),
            pool.query(`SELECT confidence_level, COUNT(*)::int AS count
                        FROM ai_answer_runs GROUP BY confidence_level ORDER BY confidence_level`),
            pool.query(`SELECT status, COUNT(*)::int AS count
                        FROM ai_knowledge_candidates GROUP BY status ORDER BY status`),
          ]);
          return res.json({
            ok: true,
            ratings: ratingsRes.rows || [],
            confidence: runsRes.rows || [],
            candidates: candidatesRes.rows || [],
          });
        } catch (dbErr) {
          console.warn('[DARB V1.15] DB summary warning, computing from memory fallback:', dbErr);
        }
      }

      // Memory aggregation fallback
      const ratingCounts: Record<string, number> = { helpful: 0, not_helpful: 0 };
      for (const fb of memFeedbacks) {
        ratingCounts[fb.rating] = (ratingCounts[fb.rating] || 0) + 1;
      }

      const confCounts: Record<string, number> = { supported: 0, limited: 0, conflicted: 0, insufficient: 0 };
      for (const r of memAnswerRuns) {
        const c = r.confidence_level || 'supported';
        confCounts[c] = (confCounts[c] || 0) + 1;
      }

      const candCounts: Record<string, number> = { pending: 0, approved: 0, needs_revision: 0, rejected: 0 };
      for (const c of memCandidates) {
        candCounts[c.status] = (candCounts[c.status] || 0) + 1;
      }

      return res.json({
        ok: true,
        ratings: Object.entries(ratingCounts).map(([rating, count]) => ({ rating, count })),
        confidence: Object.entries(confCounts).map(([confidence_level, count]) => ({ confidence_level, count })),
        candidates: Object.entries(candCounts).map(([status, count]) => ({ status, count })),
      });
    } catch (e: any) {
      console.error('[DARB V1.15] summary error:', e);
      return res.status(500).json({ ok: false, error: 'quality_summary_failed' });
    }
  });

  // 3. GET /api/admin/ai/quality-reviews
  app.get('/api/admin/ai/quality-reviews', adminOnly, async (req: Request, res: Response) => {
    try {
      const limit = Math.min(Number(req.query.limit || 50), 200);

      if (pool) {
        try {
          const result = await pool.query(
            `SELECT a.id as answer_run_id, a.conversation_id, a.user_id, a.question, a.answer,
                    a.answer_source, a.confidence_level, a.sources_json, a.conflicts_json, a.created_at,
                    r.id as review_id, r.decision, r.note, r.reviewer_id, r.created_at as reviewed_at
             FROM ai_answer_runs a
             LEFT JOIN ai_quality_reviews r ON r.answer_run_id = a.id
             ORDER BY a.created_at DESC LIMIT $1`,
            [limit]
          );
          if (result.rows && result.rows.length > 0) {
            return res.json({ ok: true, items: result.rows });
          }
        } catch (dbErr) {
          console.warn('[DARB V1.15] DB quality reviews warning, using memory fallback:', dbErr);
        }
      }

      // Memory fallback: join memAnswerRuns and memReviews
      const reviewMap = new Map<string, QualityReviewRecord>();
      for (const rev of memReviews) {
        reviewMap.set(String(rev.answer_run_id), rev);
      }

      const items = memAnswerRuns.slice(0, limit).map((a) => {
        const rev = reviewMap.get(String(a.id));
        return {
          answer_run_id: a.id,
          conversation_id: a.conversation_id,
          user_id: a.user_id,
          question: a.question,
          answer: a.answer,
          answer_source: a.answer_source,
          confidence_level: a.confidence_level,
          sources_json: a.sources_json,
          conflicts_json: a.conflicts_json,
          created_at: a.created_at,
          review_id: rev?.id || null,
          decision: rev?.decision || null,
          note: rev?.note || null,
          reviewer_id: rev?.reviewer_id || null,
          reviewed_at: rev?.created_at || null,
        };
      });

      return res.json({ ok: true, items });
    } catch (e: any) {
      console.error('[DARB V1.15] quality-reviews error:', e);
      return res.status(500).json({ ok: false, error: 'quality_reviews_failed' });
    }
  });

  // 4. POST /api/admin/ai/quality-reviews
  app.post('/api/admin/ai/quality-reviews', adminOnly, async (req: Request, res: Response) => {
    try {
      const { answerRunId, reviewerId, decision, note } = req.body || {};
      if (!answerRunId || !['approved', 'needs_revision', 'rejected'].includes(decision)) {
        return res.status(400).json({ ok: false, error: 'invalid_review' });
      }

      let insertedReview: QualityReviewRecord = {
        id: reviewCounter++,
        answer_run_id: answerRunId,
        reviewer_id: reviewerId ?? (req as any).user?.id ?? 1,
        decision,
        note: note ? String(note).slice(0, 1000) : null,
        created_at: new Date().toISOString(),
      };

      if (pool) {
        try {
          const result = await pool.query(
            `INSERT INTO ai_quality_reviews
              (answer_run_id, reviewer_id, decision, note)
             VALUES ($1,$2,$3,$4)
             RETURNING *`,
            [
              isNaN(Number(answerRunId)) ? null : Number(answerRunId),
              reviewerId ?? (req as any).user?.id ?? null,
              decision,
              note ?? null,
            ]
          );
          if (result.rows?.[0]) {
            insertedReview = result.rows[0];
          }
        } catch (dbErr) {
          console.warn('[DARB V1.15] DB quality review insert warning:', dbErr);
        }
      }

      // Update or add in memory
      const existingIdx = memReviews.findIndex((r) => String(r.answer_run_id) === String(answerRunId));
      if (existingIdx >= 0) {
        memReviews[existingIdx] = insertedReview;
      } else {
        memReviews.unshift(insertedReview);
      }

      return res.json({ ok: true, review: insertedReview });
    } catch (e: any) {
      console.error('[DARB V1.15] review create error:', e);
      return res.status(500).json({ ok: false, error: 'review_failed' });
    }
  });

  // 5. GET /api/admin/ai/knowledge-candidates
  app.get('/api/admin/ai/knowledge-candidates', adminOnly, async (req: Request, res: Response) => {
    try {
      const status = req.query.status ? String(req.query.status) : 'pending';

      if (pool) {
        try {
          const query = status === 'all'
            ? `SELECT * FROM ai_knowledge_candidates ORDER BY created_at DESC LIMIT 200`
            : `SELECT * FROM ai_knowledge_candidates WHERE status = $1 ORDER BY created_at DESC LIMIT 200`;
          const params = status === 'all' ? [] : [status];
          const result = await pool.query(query, params);
          if (result.rows) {
            return res.json({ ok: true, items: result.rows });
          }
        } catch (dbErr) {
          console.warn('[DARB V1.15] DB candidates warning, using memory fallback:', dbErr);
        }
      }

      const filtered = status === 'all'
        ? memCandidates
        : memCandidates.filter((c) => c.status === status);

      return res.json({ ok: true, items: filtered });
    } catch (e: any) {
      console.error('[DARB V1.15] candidates error:', e);
      return res.status(500).json({ ok: false, error: 'candidates_failed' });
    }
  });

  // 6. POST /api/admin/ai/knowledge-candidates
  app.post('/api/admin/ai/knowledge-candidates', adminOnly, async (req: Request, res: Response) => {
    try {
      const { question, proposedAnswer, sourceAnswerRunId, sourceType } = req.body || {};
      if (!question || !String(question).trim()) {
        return res.status(400).json({ ok: false, error: 'question_required' });
      }

      const candidateData = buildKnowledgeCandidate({
        question,
        proposedAnswer,
        answerRunId: sourceAnswerRunId,
        sourceType: sourceType || 'unanswered',
      });

      let insertedCandidate: KnowledgeCandidateRecord = {
        id: candidateCounter++,
        ...candidateData,
        reviewer_id: null,
        review_note: null,
        created_at: new Date().toISOString(),
        reviewed_at: null,
      };

      if (pool) {
        try {
          const result = await pool.query(
            `INSERT INTO ai_knowledge_candidates
              (question, proposed_answer, source_answer_run_id, source_type, status)
             VALUES ($1,$2,$3,$4,'pending') RETURNING *`,
            [
              candidateData.question,
              candidateData.proposed_answer,
              candidateData.source_answer_run_id ? Number(candidateData.source_answer_run_id) : null,
              candidateData.source_type,
            ]
          );
          if (result.rows?.[0]) {
            insertedCandidate = result.rows[0];
          }
        } catch (dbErr) {
          console.warn('[DARB V1.15] DB candidate create warning:', dbErr);
        }
      }

      memCandidates.unshift(insertedCandidate);
      return res.json({ ok: true, candidate: insertedCandidate });
    } catch (e: any) {
      console.error('[DARB V1.15] candidate create error:', e);
      return res.status(500).json({ ok: false, error: 'candidate_create_failed' });
    }
  });

  // 7. PATCH /api/admin/ai/knowledge-candidates/:id
  app.patch('/api/admin/ai/knowledge-candidates/:id', adminOnly, async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { status, reviewNote, publishToKnowledge } = req.body || {};
      if (!status || !['approved', 'rejected', 'needs_revision', 'pending'].includes(status)) {
        return res.status(400).json({ ok: false, error: 'invalid_status' });
      }

      let updatedCandidate: KnowledgeCandidateRecord | null = null;

      if (pool) {
        try {
          const result = await pool.query(
            `UPDATE ai_knowledge_candidates
             SET status=$1, review_note=$2, reviewer_id=$3, reviewed_at=NOW()
             WHERE id=$4 RETURNING *`,
            [status, reviewNote ?? null, (req as any).user?.id ?? null, id]
          );
          if (result.rows?.[0]) {
            updatedCandidate = result.rows[0];
          }
        } catch (dbErr) {
          console.warn('[DARB V1.15] DB candidate update warning:', dbErr);
        }
      }

      const memIdx = memCandidates.findIndex((c) => c.id === id);
      if (memIdx >= 0) {
        memCandidates[memIdx] = {
          ...memCandidates[memIdx],
          status,
          review_note: reviewNote ?? memCandidates[memIdx].review_note,
          reviewer_id: (req as any).user?.id ?? 1,
          reviewed_at: new Date().toISOString(),
        };
        if (!updatedCandidate) {
          updatedCandidate = memCandidates[memIdx];
        }
      }

      if (!updatedCandidate) {
        return res.status(404).json({ ok: false, error: 'candidate_not_found' });
      }

      // Explicit human-approved publishing to ai_knowledge base (only if explicitly approved & requested)
      if (status === 'approved' && publishToKnowledge && updatedCandidate.proposed_answer) {
        try {
          const slug = `kn_cand_${updatedCandidate.id}_${Date.now()}`;
          if (pool) {
            await pool.query(
              `INSERT INTO ai_knowledge (slug, title, content, status)
               VALUES ($1, $2, $3, 'published')`,
              [slug, updatedCandidate.question, updatedCandidate.proposed_answer]
            );
          }
        } catch (pubErr) {
          console.warn('[DARB V1.15] Candidate publishing warning:', pubErr);
        }
      }

      return res.json({ ok: true, candidate: updatedCandidate });
    } catch (e: any) {
      console.error('[DARB V1.15] candidate update error:', e);
      return res.status(500).json({ ok: false, error: 'candidate_update_failed' });
    }
  });
}
