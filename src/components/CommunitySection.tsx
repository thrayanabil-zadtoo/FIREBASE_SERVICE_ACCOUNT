import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Globe2, 
  MapPin, 
  Eye, 
  Clock, 
  ShieldCheck, 
  Star, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Question, Review, Service, Country } from '../types';
import { fetchApi } from '../api';

interface CommunitySectionProps {
  countries: Country[];
  services: Service[];
}

export default function CommunitySection({ countries, services }: CommunitySectionProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  
  // Ask Question Form
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [questionCountry, setQuestionCountry] = useState('مصر');
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [questionSuccess, setQuestionSuccess] = useState(false);

  // Add Review Form
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number>(services[0]?.id || 1);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    setLoading(true);
    const [qRes, rRes] = await Promise.all([
      fetchApi<Question[]>('/community/questions'),
      fetchApi<Review[]>('/reviews'),
    ]);
    if (qRes.ok && qRes.data) setQuestions(qRes.data);
    if (rRes.ok && rRes.data) setReviews(rRes.data);
    setLoading(false);
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setSubmittingQuestion(true);
    const res = await fetchApi<Question>('/community/questions', {
      method: 'POST',
      body: JSON.stringify({
        title,
        body,
        country_name: questionCountry,
      }),
    });

    setSubmittingQuestion(false);
    if (res.ok && res.data) {
      setQuestions([res.data, ...questions]);
      setTitle('');
      setBody('');
      setQuestionSuccess(true);
      setTimeout(() => setQuestionSuccess(false), 5000);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    const res = await fetchApi<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify({
        service_id: selectedServiceId,
        rating,
        comment: reviewComment,
      }),
    });

    setSubmittingReview(false);
    if (res.ok && res.data) {
      setReviews([res.data, ...reviews]);
      setReviewComment('');
      setReviewSuccess(true);
      setTimeout(() => {
        setReviewSuccess(false);
        setShowReviewModal(false);
      }, 2000);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || q.country_name === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div id="darb-community-module" className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-[#071a2b] via-[#0c2c44] to-[#082337] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#16344d] text-[#8be4d4] border border-[#1bb49e]/40">
            <MessageSquare className="w-3.5 h-3.5 text-[#46d0bc]" />
            <span>اسأل أهل البلد • Ask a Local</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            مجتمع دَرْب للوافدين والمغتربين
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            تجارب حقيقية، إجابات من أهل البلد والوافدين السابقين عن السكن، المعيشة، المعاملات الرسمية، وفرص العمل في مختلف الدول العربية.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            id="btn-open-review-modal"
            onClick={() => setShowReviewModal(true)}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Star className="w-4 h-4 text-amber-400" />
            <span>كتابة تقييم خدمة</span>
          </button>
          <a
            href="#ask-form"
            className="px-6 py-3 rounded-xl bg-[#1bb49e] hover:bg-[#169b88] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>طرح استفسار جديد</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Ask Form + Questions Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Ask a Question Card */}
        <div className="lg:col-span-4 space-y-6">
          <div id="ask-form" className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
              <MessageSquare className="w-5 h-5 text-[#1bb49e]" />
              <h2 className="text-lg font-bold text-stone-900">اطرح سؤالك على المجتمع</h2>
            </div>

            {questionSuccess && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">تم إرسال السؤال بنجاح!</p>
                  <p className="text-xs text-emerald-700 mt-0.5">سؤالك منشور الآن في المجتمع وسيتلقى إجابات من أهل البلد والمغتربين.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  الدولة المعنية
                </label>
                <select
                  id="question-country-select"
                  value={questionCountry}
                  onChange={(e) => setQuestionCountry(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1bb49e]"
                >
                  <option value="عام">كل الدول / استفسار عام</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.name_ar}>
                      {c.name_ar}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  عنوان السؤال بإيجاز *
                </label>
                <input
                  id="question-title-input"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: ما أفضل منطقة سكن عائلية قريبة من المترو في القاهرة؟"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1bb49e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  تفاصيل السؤال والسياق *
                </label>
                <textarea
                  id="question-body-input"
                  rows={4}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="وضح ميزانيتك، نوع السكن أو طبيعة المعاملة والمدينة المحددة..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1bb49e] resize-none"
                />
              </div>

              <button
                id="btn-submit-question"
                type="submit"
                disabled={submittingQuestion}
                className="w-full py-3 rounded-xl bg-[#1bb49e] hover:bg-[#169b88] text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submittingQuestion ? 'جاري النشر...' : 'نشر السؤال في دَرْب'}</span>
              </button>
            </form>
          </div>

          {/* Safety and Moderation Notice */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs text-stone-600 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#1bb49e] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>نظام أمان موثوق:</strong> تخضع كافة الأسئلة والمراجعات في مجتمع دَرْب للرقابة الآلية والمراجعة لمنع التضليل والمعلومات غير الدقيقة، حفاظاً على سلامة المغتربين.
            </p>
          </div>

          {/* Recent Service Reviews */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>أحدث تقييمات الخدمات</span>
              </h3>
              <span className="text-xs text-stone-500 font-mono">
                {reviews.length} تقييم
              </span>
            </div>

            <div className="space-y-3">
              {reviews.slice(0, 3).map((r) => (
                <div key={r.id} className="p-3 rounded-2xl bg-stone-50 border border-stone-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      {Array.from({ length: r.rating }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-stone-400 text-[10px]">موثق</span>
                  </div>
                  <p className="text-stone-700 font-medium leading-relaxed">
                    "{r.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Questions Feed & Filters */}
        <div className="lg:col-span-8 space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-questions-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في أسئلة المجتمع وتجارب المغتربين..."
                className="w-full pr-9 pl-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1bb49e]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Globe2 className="w-4 h-4 text-stone-400 shrink-0" />
              <select
                id="filter-questions-country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1bb49e] w-full sm:w-auto font-medium"
              >
                <option value="all">جميع الدول</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name_ar}>
                    {c.name_ar}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions List */}
          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center text-stone-400 border border-stone-200">
              <div className="w-8 h-8 border-2 border-[#1bb49e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs">جاري تحميل استفسارات مجتمع دَرْب...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-stone-500 border border-stone-200 space-y-3">
              <MessageSquare className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="font-bold text-sm">لا توجد أسئلة تطابق بحثك حالياً.</p>
              <p className="text-xs text-stone-400">كن أول من يطرح استفساراً في هذه الوجهة!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((q) => (
                <article
                  key={q.id}
                  id={`community-question-${q.id}`}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 hover:border-[#1bb49e]/40 transition-all space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#1bb49e]/10 text-[#169b88] font-bold text-xs">
                        {q.country_name || 'استفسار عام'}
                      </span>
                      {q.city_name && q.city_name !== 'كل المدن' && (
                        <span className="flex items-center gap-1 text-xs text-stone-500 font-medium">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {q.city_name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {q.views || 1} مشاهدة
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        منشور حديثاً
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                    {q.title}
                  </h3>

                  <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                    {q.body}
                  </p>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>باب الإجابات وتجارب الوافدين مفتوح</span>
                    </div>
                    <button
                      onClick={() => alert('تم تسجيل رغبتك في الإجابة، سيتم تفعيل التعليق المباشر قريباً.')}
                      className="text-xs font-bold text-[#1bb49e] hover:text-[#169b88] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>أضف تجربتك أو إجابتك ←</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>تقييم خدمة من خدمات دَرْب</span>
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {reviewSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold">شكراً لمشاركتك!</p>
                <p className="text-xs text-emerald-700">تم حفظ تقييمك لمساعدة الوافدين الآخرين في اتخاذ القرار.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">الخدمة المراد تقييمها</label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1bb49e]"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name_ar} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">التقييم من 1 إلى 5 نجوم</label>
                  <div className="flex items-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="cursor-pointer p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">رأيك وتعليقك التفصيلي *</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="ما مدى مصداقية وسرعة الخدمة وجودة التعامل؟"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1bb49e] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-medium cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2 rounded-xl bg-[#1bb49e] hover:bg-[#169b88] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {submittingReview ? 'جاري الإرسال...' : 'نشر التقييم'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
