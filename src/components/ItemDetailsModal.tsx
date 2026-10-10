import { X, MapPin, Building2, Banknote, Calendar, CheckCircle2, Phone, Mail, Share2 } from 'lucide-react';
import { Job, Service, Ad } from '../types';

interface ItemDetailsModalProps {
  item: { type: 'job' | 'service' | 'ad'; data: Job | Service | Ad } | null;
  onClose: () => void;
}

export default function ItemDetailsModal({ item, onClose }: ItemDetailsModalProps) {
  if (!item) return null;

  const { type, data } = item;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              {type === 'job' ? 'فرصة عمل' : type === 'service' ? 'خدمة للمغتربين' : 'إعلان مميز'}
            </span>
            <h3 className="font-bold text-stone-900 text-lg mt-1.5">
              {(data as any).title || (data as any).name_ar}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 text-xs text-stone-700">
          
          {/* Job Specific Details */}
          {type === 'job' && (() => {
            const j = data as Job;
            return (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <Building2 className="w-4 h-4 text-[#1bb49e]" />
                    <span className="font-semibold">{j.company_name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <MapPin className="w-4 h-4 text-[#1bb49e]" />
                    <span>{j.city_name || 'كل المدن'}</span>
                  </div>
                  {(j.salary_min || j.salary_max) && (
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <Banknote className="w-4 h-4" />
                      <span>
                        {j.salary_min} - {j.salary_max} {j.currency}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <strong className="block text-stone-900">الوصف ومتطلبات الوظيفة:</strong>
                  <p className="leading-relaxed whitespace-pre-line text-stone-600">
                    {j.description}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Service Specific Details */}
          {type === 'service' && (() => {
            const s = data as Service;
            return (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <MapPin className="w-4 h-4 text-[#1bb49e]" />
                    <span>{s.city_name || 'خدمة متعددة المدن'}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium">
                    {s.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <strong className="block text-stone-900">تفاصيل الخدمة:</strong>
                  <p className="leading-relaxed whitespace-pre-line text-stone-600">
                    {s.description_ar}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Ad Specific Details */}
          {type === 'ad' && (() => {
            const a = data as Ad;
            return (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-medium">
                    التصنيف: {a.category}
                  </span>
                  <span className="text-stone-500 font-mono">
                    الباقة: {a.plan}
                  </span>
                </div>

                <div className="space-y-1">
                  <strong className="block text-stone-900">محتوى الإعلان:</strong>
                  <p className="leading-relaxed whitespace-pre-line text-stone-600">
                    {a.description}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Trust Guarantee */}
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center gap-2 text-[11px] text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>معتمد ومسجل ضمن شبكة دَرْب لمساعدة المغتربين والباحثين عن فرص.</span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 cursor-pointer"
          >
            إغلاق
          </button>
          <button
            onClick={() => {
              alert('شكراً لاهتمامك! تم إرسال طلبك وسيتم التواصل معك مباشرة.');
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1bb49e] hover:bg-[#169b88] text-white transition-colors cursor-pointer"
          >
            {type === 'job' ? 'تقديم على الوظيفة' : type === 'service' ? 'طلب استشارة' : 'التواصل مع المعلن'}
          </button>
        </div>

      </div>
    </div>
  );
}
