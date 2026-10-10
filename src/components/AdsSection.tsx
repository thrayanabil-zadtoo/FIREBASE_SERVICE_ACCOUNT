import { useState, type FormEvent } from 'react';
import { 
  Megaphone, 
  Eye, 
  MousePointerClick, 
  Plus, 
  Sparkles, 
  Check, 
  X,
  Calendar,
  Layers
} from 'lucide-react';
import { Ad, Plan } from '../types';
import { fetchApi } from '../api';

interface AdsSectionProps {
  ads: Ad[];
  plans: Plan[];
  onAdAdded: (ad: Ad) => void;
  onSelectAd: (ad: Ad) => void;
}

export default function AdsSection({
  ads,
  plans,
  onAdAdded,
  onSelectAd,
}: AdsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('عروض حصرية');
  const [plan, setPlan] = useState('featured');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    const res = await fetchApi<Ad>('/ads', {
      method: 'POST',
      body: JSON.stringify({
        title,
        category,
        plan,
        description,
      }),
    });

    if (res.ok && res.data) {
      onAdAdded(res.data);
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
    }
    setSubmitting(false);
  };

  return (
    <div id="darb-ads-section" className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#1bb49e]" />
            <h2 className="text-lg font-bold text-stone-900">سوق الإعلانات والترويج التجاري</h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            أبرز عروض الخدمات، وتجهيزات المكاتب، وتخفيضات الوافدين والمغتربين.
          </p>
        </div>

        <button
          id="btn-add-ad-modal"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1bb49e] hover:bg-[#169b88] text-white shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة إعلان مميز</span>
        </button>
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ads.map((ad) => (
          <div
            key={ad.id}
            id={`ad-card-${ad.id}`}
            className="bg-white border border-stone-200 hover:border-[#1bb49e]/60 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md">
                    {ad.category || 'إعلان'}
                  </span>
                  {ad.plan === 'featured' && (
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      مميز
                    </span>
                  )}
                  {ad.plan === 'pro' && (
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                      احترافي (PRO)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-stone-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {ad.views || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MousePointerClick className="w-3.5 h-3.5" />
                    {ad.clicks || 0}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-stone-900">{ad.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                {ad.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                نشط حالياً
              </span>
              <button
                onClick={() => onSelectAd(ad)}
                className="px-3 py-1.5 text-xs font-bold text-[#1bb49e] hover:bg-[#1bb49e]/10 rounded-lg transition-colors cursor-pointer"
              >
                عرض تفاصيل الإعلان
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Available Advertising Plans */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 mt-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#8be4d4] uppercase tracking-wider font-mono">
            باقات الترويج والإعلانات المعتمدة في دَرْب
          </span>
          <h3 className="text-xl sm:text-2xl font-bold">اختر الباقة المناسبة لتنمية أعمالك</h3>
          <p className="text-xs text-stone-400">
            يمكن تفعيل/تعطيل بوابات الدفع والباقات مباشرة من لوحة الإدارة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div
              key={p.code}
              className={`rounded-2xl p-5 flex flex-col justify-between border ${
                p.code === 'featured'
                  ? 'bg-gradient-to-b from-[#0d2a42] to-[#16344d] border-[#20b8a6]'
                  : 'bg-stone-800/80 border-stone-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-white">{p.name_ar}</h4>
                  {p.code === 'featured' && (
                    <span className="text-[10px] font-bold bg-[#1bb49e] text-white px-2 py-0.5 rounded-full">
                      الأكثر طلباً
                    </span>
                  )}
                </div>

                <div className="text-2xl font-black text-[#8be4d4]">
                  ${p.price}{' '}
                  <span className="text-xs font-normal text-stone-400">/ {p.duration_days} يوم</span>
                </div>

                <ul className="text-xs text-stone-300 space-y-1.5 pt-2 border-t border-stone-700">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#20b8a6]" />
                    <span>ظهور في قائمة الإعلانات</span>
                  </li>
                  {p.code !== 'free' && (
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#20b8a6]" />
                      <span>أولوية متقدمة في نتائج البحث</span>
                    </li>
                  )}
                  {p.code === 'pro' && (
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#20b8a6]" />
                      <span>شارة التوثيق والبانر الرئيسي</span>
                    </li>
                  )}
                </ul>
              </div>

              <button
                onClick={() => {
                  setPlan(p.code);
                  setIsModalOpen(true);
                }}
                className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  p.code === 'featured'
                    ? 'bg-[#1bb49e] hover:bg-[#169b88] text-white'
                    : 'bg-stone-700 hover:bg-stone-600 text-white'
                }`}
              >
                اختر هذه الباقة
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Ad Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">نشر إعلان جديد</h3>
                  <p className="text-xs text-stone-500">اختر تفاصيل الإعلان والباقة الترويجية</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">عنوان الإعلان *</label>
                <input
                  required
                  type="text"
                  placeholder="مثال: خصم 20% على خدمات الترجمة والاستشارات"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-[#1bb49e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">التصنيف</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-[#1bb49e]"
                  >
                    <option value="عروض حصرية">عروض حصرية</option>
                    <option value="مساحات عمل">مساحات عمل</option>
                    <option value="تأشيرات وإقامة">تأشيرات وإقامة</option>
                    <option value="شحن وجمارك">شحن وجمارك</option>
                    <option value="دورات وتأهيل">دورات وتأهيل</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">نوع الباقة</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-[#1bb49e]"
                  >
                    <option value="free">مجاني (30 يوم)</option>
                    <option value="featured">مميز ($15)</option>
                    <option value="pro">احترافي PRO ($45)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">نص ومحتوى الإعلان</label>
                <textarea
                  rows={4}
                  placeholder="شرح العرض وطريقة الاستفادة والاتصال..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-[#1bb49e]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1bb49e] hover:bg-[#169b88] text-white transition-colors cursor-pointer"
                >
                  {submitting ? 'جاري الحفظ...' : 'نشر الإعلان'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
