import { useState, useRef, type FormEvent } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { User } from '../types';
import { fetchApi } from '../api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Google sign in state
  const [googleEmail, setGoogleEmail] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);
  
  // Previous account management
  const [previousEmail, setPreviousEmail] = useState<string>(() => {
    return localStorage.getItem('darb_last_google_email') || 'thrayanabil@gmail.com';
  });
  const [showPreviousAccount, setShowPreviousAccount] = useState<boolean>(() => {
    return localStorage.getItem('darb_dismiss_prev_account') !== 'true';
  });
  
  // Admin password gate state
  const [showAdminGate, setShowAdminGate] = useState(false);
  const [adminEmail, setAdminEmail] = useState('thrayanabil@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');

  if (!isOpen) return null;

  // Clear previous account to switch to another
  const handleRemovePreviousAccount = () => {
    setShowPreviousAccount(false);
    localStorage.setItem('darb_dismiss_prev_account', 'true');
    setGoogleEmail('');
    setTimeout(() => {
      emailInputRef.current?.focus();
    }, 100);
  };

  // Restore previous account suggestion
  const handleRestorePreviousAccount = () => {
    setShowPreviousAccount(true);
    localStorage.removeItem('darb_dismiss_prev_account');
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async (overrideEmail?: string) => {
    const targetEmail = (overrideEmail || googleEmail).trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@')) {
      setError('يرجى كتابة عنوان بريد Google صالح يحتوي على @');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const isSupervisor = targetEmail === 'thrayanabil@gmail.com';
    const computedName = isSupervisor 
      ? 'ثريا نبيل (المشرف العام)' 
      : targetEmail.split('@')[0];

    try {
      const res = await fetchApi<{ ok: boolean; user: User; message?: string }>('/auth/google-login', {
        method: 'POST',
        body: JSON.stringify({
          email: targetEmail,
          name: computedName,
        }),
      });

      if (res.ok && res.user) {
        // Save as last successful Google email
        localStorage.setItem('darb_last_google_email', targetEmail);
        localStorage.removeItem('darb_dismiss_prev_account');
        setPreviousEmail(targetEmail);
        
        setSuccessMsg(res.message || 'تم تسجيل الدخول بنجاح عبر حساب Google');
        setTimeout(() => {
          onLoginSuccess(res.user);
          onClose();
        }, 600);
      } else {
        setError(res.error || 'تعذر استكمال الدخول عبر Google');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  // Handle Admin Verification Gate
  const handleAdminVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      setError('يرجى إدخال اسم مستخدم وكلمة مرور المشرف');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetchApi<{ ok: boolean; user: User; message?: string }>('/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify({
          email: adminEmail.trim(),
          password: adminPassword,
        }),
      });

      if (res.ok && res.user) {
        setSuccessMsg(res.message || 'تم التحقق بنجاح وتفعيل صلاحية المشرف العام');
        setTimeout(() => {
          onLoginSuccess(res.user);
          onClose();
        }, 600);
      } else {
        setError(res.error || 'بيانات اعتماد المشرف غير صحيحة');
      }
    } catch (err: any) {
      setError(err.message || 'تعذر التحقق من المشرف');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-5 space-y-3.5 shadow-2xl animate-fadeIn relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 p-1.5 rounded-full transition-colors cursor-pointer"
          title="إغلاق النافذة"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Compact Header */}
        <div className="text-center space-y-1 pt-0.5">
          <div className="inline-flex items-center justify-center w-9 h-9 bg-emerald-50 rounded-xl border border-emerald-100 mb-0.5 text-[#1bb49e]">
            <UserCheck className="w-4.5 h-4.5" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
            تسجيل دخول الأعضاء
          </h2>
          <p className="text-[11px] text-stone-500 leading-tight max-w-xs mx-auto">
            منصة دَرْب • نظام التوثيق الموحد عبر Google
          </p>
        </div>

        {/* Compact Google Only Notice */}
        <div className="bg-blue-50/80 border border-blue-200/70 rounded-xl p-2.5 flex items-center gap-2.5">
          <div className="w-4.5 h-4.5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
            G
          </div>
          <div className="text-[11px] text-blue-900 leading-snug">
            <span className="font-bold">الدخول والتسجيل عبر Google فقط </span>
            (حصرياً عبر حسابات Google المعتمدة)
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-[11px] p-2.5 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] p-2.5 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Google Accounts Section */}
        <div className="space-y-2.5">
          {/* Previous / Saved Account with prominent (X) button to remove/switch */}
          {showPreviousAccount && previousEmail && (
            <div className="p-2 sm:p-2.5 bg-stone-50 hover:bg-stone-100/90 border border-stone-200 rounded-xl transition-all flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleGoogleSignIn(previousEmail)}
                disabled={loading}
                className="flex items-center gap-2.5 flex-1 min-w-0 text-right group cursor-pointer"
                title={`المتابعة بحساب ${previousEmail}`}
              >
                <div className="w-7 h-7 rounded-full bg-white border border-stone-200 shadow-2xs flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.14z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.09-6.68-4.91H1.21v3.15C3.25 21.46 7.34 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.21C.44 8.09 0 9.99 0 12s.44 3.91 1.21 5.44l4.11-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.54 1.21 6.56l4.11 3.15c.94-2.82 3.58-4.96 6.68-4.96z"/>
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-stone-800 truncate" dir="ltr">
                      {previousEmail}
                    </span>
                    {previousEmail === 'thrayanabil@gmail.com' ? (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md font-bold">
                        المشرف العام
                      </span>
                    ) : (
                      <span className="text-[9px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded-md font-medium">
                        حساب سابق
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-500">انقر للمتابعة السريعة بهذا الحساب</div>
                </div>
              </button>

              {/* [X] Clear Previous Account Button */}
              <button
                type="button"
                onClick={handleRemovePreviousAccount}
                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                title="إزالة الحساب السابق والدخول بحساب آخر (Clear)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* If previous account was removed, option to restore */}
          {!showPreviousAccount && previousEmail && (
            <div className="flex items-center justify-between text-[10px] text-stone-500 px-1">
              <span>تم إخفاء الحساب السابق. أدخل بريدك بالأسفل:</span>
              <button
                type="button"
                onClick={handleRestorePreviousAccount}
                className="inline-flex items-center gap-1 text-[#1bb49e] hover:underline cursor-pointer font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>إظهار {previousEmail.split('@')[0]}</span>
              </button>
            </div>
          )}

          {/* Any Google Account Input Field with Clear (X) inside */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-[11px] font-bold text-stone-700">
              {showPreviousAccount ? 'أو الدخول بحساب Google آخر:' : 'أدخل بريد Google للدخول:'}
            </label>
            <div className="flex gap-1.5">
              <div className="relative flex-1">
                <input
                  ref={emailInputRef}
                  type="email"
                  dir="ltr"
                  placeholder="name@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleGoogleSignIn();
                    }
                  }}
                  className="w-full pl-3 pr-7 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#1bb49e] focus:ring-1 focus:ring-[#1bb49e]/30 font-sans"
                />
                {/* Clear (X) button inside the input */}
                {googleEmail && (
                  <button
                    type="button"
                    onClick={() => {
                      setGoogleEmail('');
                      emailInputRef.current?.focus();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-rose-600 rounded-full hover:bg-stone-100 cursor-pointer"
                    title="مسح البريد المكتوب"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => handleGoogleSignIn()}
                disabled={loading}
                className="px-3.5 py-2 bg-[#1bb49e] hover:bg-[#169b88] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                {loading ? '...' : 'دخول Google'}
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Admin Gate (Compact) */}
        <div className="pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={() => setShowAdminGate(!showAdminGate)}
            className="w-full flex items-center justify-between text-[11px] font-semibold text-stone-500 hover:text-stone-800 transition-colors py-0.5 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
              <span>التحقق بكلمة مرور المشرف العام</span>
            </span>
            <span>{showAdminGate ? '▲ إخفاء' : '▼ فتح'}</span>
          </button>

          {showAdminGate && (
            <form onSubmit={handleAdminVerify} className="mt-2.5 bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-800">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>تسجيل دخول المشرف المعتمد (DARB Admin)</span>
              </div>
              
              <div>
                <label className="block text-[10px] text-stone-600 font-medium mb-0.5">
                  البريد الإلكتروني للمشرف:
                </label>
                <div className="relative">
                  <input
                    type="email"
                    dir="ltr"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full pl-2.5 pr-7 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:border-indigo-500 font-mono"
                    placeholder="thrayanabil@gmail.com"
                    required
                  />
                  {adminEmail && (
                    <button
                      type="button"
                      onClick={() => setAdminEmail('')}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-rose-600 rounded-full cursor-pointer"
                      title="مسح البريد"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-stone-600 font-medium mb-0.5">
                  كلمة المرور:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    dir="ltr"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-2.5 pr-7 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:border-indigo-500 font-mono"
                    placeholder="••••••••"
                    required
                  />
                  {adminPassword && (
                    <button
                      type="button"
                      onClick={() => setAdminPassword('')}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-rose-600 rounded-full cursor-pointer"
                      title="مسح كلمة المرور"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-[#071a2b] hover:bg-[#0d2a45] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3 h-3 text-indigo-300" />
                <span>{loading ? 'جاري التحقق...' : 'دخول لوحة تحكم المشرف'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Compact Footer */}
        <div className="text-center pt-1 text-[10px] text-stone-400">
          منصة دَرْب الموحدة • نظام التحقق والمشرفين المحمي
        </div>

      </div>
    </div>
  );
}
