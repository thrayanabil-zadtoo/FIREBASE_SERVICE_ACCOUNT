import { useState, useEffect, type FormEvent } from 'react';
import { 
  User, 
  AccountType, 
  Country 
} from '../types';
import { fetchApi } from '../api';
import { 
  UserCircle, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Briefcase, 
  Scale, 
  Users, 
  Wrench, 
  Phone, 
  Mail, 
  FileText, 
  LogIn, 
  Save, 
  ShieldCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface AccountSectionProps {
  user: User | null;
  onUserUpdated: (updatedUser: User) => void;
  onLogin: () => void;
  countries: Country[];
}

const ACCOUNT_TYPE_LABELS: Record<AccountType, { label: string; icon: any; desc: string }> = {
  user: {
    label: 'مغترب / باحث عن عمل',
    icon: UserCircle,
    desc: 'للباحثين عن وظائف، سكن، ومعلومات الاستقرار في بلدهم القادم.'
  },
  company: {
    label: 'شركة / صاحب عمل',
    icon: Building2,
    desc: 'لنشر الوظائف المعتمدة وجذب الكفاءات العربية.'
  },
  lawyer: {
    label: 'محامٍ / مكتب قانوني',
    icon: Scale,
    desc: 'لتقديم استشارات الإقامة وتأشيرات العمل والعقود الرسمية.'
  },
  recruiter: {
    label: 'شركة توظيف',
    icon: Users,
    desc: 'لإدارة عروض التوظيف والفرص الوظيفية الدولية.'
  },
  service_provider: {
    label: 'مقدم خدمة للمغتربين',
    icon: Wrench,
    desc: 'عقارات، ترجمة محلفة، استقبال وتوصيل، استشارات تجارية.'
  }
};

export default function AccountSection({
  user,
  onUserUpdated,
  onLogin,
  countries: _countries
}: AccountSectionProps) {
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    account_type: (user?.account_type as AccountType) || 'user',
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        account_type: (user.account_type as AccountType) || 'user',
      });
    }
  }, [user]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    const res = await fetchApi<{ user: User; message?: string }>('/me', {
      method: 'PATCH',
      body: JSON.stringify(form),
    });

    if (res.ok && res.user) {
      onUserUpdated(res.user);
      setSaveSuccess(res.message || 'تم حفظ الملف الشخصي بنجاح.');
      setTimeout(() => setSaveSuccess(null), 4000);
    } else {
      setSaveError(res.error || 'تعذر حفظ البيانات، يرجى المحاولة مرة أخرى.');
    }
    setSaving(false);
  };

  return (
    <div id="darb-account-section" className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1bb49e] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>DARB V1.7 • ملف الحساب والأنشطة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            ملف الحساب الشخصي
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            أكمل ملفك لتسهيل نشر الوظائف والخدمات والإعلانات والتفاعل مع مجتمع دَرْب.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>جلسة نشطة</span>
            </span>
          ) : (
            <button
              onClick={onLogin}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#1bb49e] hover:bg-[#169b88] text-white shadow-xs transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>سجل عبر Google للبدء</span>
            </button>
          )}
        </div>
      </div>

      {user ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Profile Card */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col items-center text-center space-y-4">
            <div className="relative">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name || user.email}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#e3f5f2]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#071a2b] to-[#1bb49e] text-white text-3xl font-black flex items-center justify-center border-4 border-[#e3f5f2]">
                  {(user.name || user.email || 'د').slice(0, 1)}
                </div>
              )}
              {user.role === 'admin' && (
                <span 
                  title="مشرف المنصة"
                  className="absolute bottom-0 right-0 p-1.5 bg-[#071a2b] text-[#8be4d4] rounded-full border-2 border-white shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4" />
                </span>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-stone-900">{user.name || 'عضو دَرْب'}</h2>
              <p className="text-xs text-stone-500 font-mono mt-0.5">{user.email}</p>
            </div>

            <div className="w-full pt-4 border-t border-stone-100 space-y-2 text-right text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span className="text-stone-400">نوع الحساب:</span>
                <span className="font-bold text-[#1bb49e]">
                  {ACCOUNT_TYPE_LABELS[form.account_type]?.label || 'مغترب'}
                </span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span className="text-stone-400">الصلاحية:</span>
                <span className="font-medium">
                  {user.role === 'admin' ? 'مشرف المنصة (Admin)' : 'مستخدم منصة (User)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span className="text-stone-400">التوثيق:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>موثق مع Google</span>
                </span>
              </div>
            </div>

            {/* Account Type Description Card */}
            <div className="w-full bg-[#f6f8fb] border border-stone-200/80 rounded-2xl p-3 text-right">
              <span className="text-[11px] font-bold text-stone-700 block mb-1">
                صلاحيات {ACCOUNT_TYPE_LABELS[form.account_type]?.label}:
              </span>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                {ACCOUNT_TYPE_LABELS[form.account_type]?.desc}
              </p>
            </div>
          </div>

          {/* Right Column: Edit Form */}
          <div className="md:col-span-2 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 mb-4 pb-3 border-b border-stone-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1bb49e]" />
              <span>تعديل بيانات الحساب والملف الشخصي</span>
            </h3>

            {saveSuccess && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveSuccess}</span>
              </div>
            )}

            {saveError && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  الاسم الكامل أو اسم الكيان
                </label>
                <div className="relative">
                  <UserCircle className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="مثال: أحمد مصطفى أو شركة الأفق للاستشارات"
                    className="w-full pr-9 pl-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#1bb49e] focus:border-[#1bb49e] outline-hidden text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    رقم الهاتف / واتساب للتواصل
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="مثال: +20 100 123 4567"
                      className="w-full pr-9 pl-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#1bb49e] focus:border-[#1bb49e] outline-hidden text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    نوع الحساب (Account Type)
                  </label>
                  <select
                    value={form.account_type}
                    onChange={(e) => setForm({ ...form, account_type: e.target.value as AccountType })}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#1bb49e] focus:border-[#1bb49e] outline-hidden text-stone-900 cursor-pointer"
                  >
                    <option value="user">مغترب / باحث عن عمل</option>
                    <option value="company">شركة / صاحب عمل</option>
                    <option value="lawyer">محامٍ / مكتب قانوني</option>
                    <option value="recruiter">شركة توظيف</option>
                    <option value="service_provider">مقدم خدمة للمغتربين</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  نبذة تعريفية (Bio)
                </label>
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="اكتب نبذة مختصرة عن مؤهلاتك، مجالات خبرتك، أو الخدمات التي تقدمها للمغتربين..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#1bb49e] focus:border-[#1bb49e] outline-hidden text-stone-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  🔒 ترتبط التعديلات مباشرة بحسابك وجلسة عملك في دَرْب.
                </span>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1bb49e] hover:bg-[#169b88] text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'جاري الحفظ...' : 'حفظ الملف الشخصي'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Not logged in State */
        <div className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-12 shadow-xs text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[#e3f5f2] text-[#1bb49e] flex items-center justify-center mx-auto">
            <LogIn className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              ابدأ بتسجيل الدخول بواسطة Google
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
              بعد تسجيل الدخول يمكنك إنشاء ملفك الشخصي، واختيار نوع الحساب (مغترب، شركة، محامٍ، شركة توظيف، أو مقدم خدمة)، ونشر الوظائف والإعلانات والخدمات.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onLogin}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-[#1bb49e] hover:bg-[#169b88] text-white shadow-md transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول بواسطة Google</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
