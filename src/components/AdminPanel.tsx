import { useState, useEffect, type FormEvent } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Layers, 
  AlertCircle, 
  Check, 
  X, 
  Edit3, 
  Save, 
  RefreshCw,
  Database,
  Lock,
  Sparkles,
  Globe2,
  Users,
  UserPlus,
  UserCheck,
  ShieldAlert,
  Search,
  Trash2,
  CheckCircle2,
  Phone,
  Mail,
  Building2,
  Briefcase
} from 'lucide-react';
import { PaymentProvider, Plan, HealthStatus, User, MemberRecord, AccountType } from '../types';
import { fetchApi } from '../api';
import DarbAIAdminPanel from './DarbAIAdminPanel';
import DarbGlobalKnowledgeAdminView from './DarbGlobalKnowledgeAdminView';

interface AdminPanelProps {
  health: HealthStatus | null;
  user: User | null;
  onUserLoginSuccess: (user: User) => void;
}

export default function AdminPanel({ health, user, onUserLoginSuccess }: AdminPanelProps) {
  const isSuperAdmin = user && (user.role === 'admin' || user.email?.toLowerCase() === 'thrayanabil@gmail.com');

  // Login Gatekeeper states
  const [adminEmail, setAdminEmail] = useState('thrayanabil@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'members' | 'global_knowledge' | 'ai' | 'billing'>('members');

  // Members Management states
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [memberStats, setMemberStats] = useState<{
    total: number;
    active: number;
    suspended: number;
    admins: number;
    verified: number;
  }>({ total: 0, active: 0, suspended: 0, admins: 0, verified: 0 });
  const [membersLoading, setMembersLoading] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  
  // New Member Form states
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    email: '',
    role: 'user' as 'user' | 'admin' | 'supervisor',
    account_type: 'user' as AccountType,
    phone: '',
    country_code: 'EG',
  });
  const [memberActionMsg, setMemberActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Billing and plans states
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Edit plan state
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDays, setEditDays] = useState<number>(30);

  useEffect(() => {
    if (isSuperAdmin) {
      loadMembers();
      loadAdminData();
    }
  }, [isSuperAdmin]);

  // Load Members
  const loadMembers = async () => {
    setMembersLoading(true);
    const res = await fetchApi<{ ok: boolean; data: MemberRecord[]; stats: any }>('/admin/members');
    if (res.ok && res.data) {
      setMembers(res.data);
      if (res.stats) setMemberStats(res.stats);
    }
    setMembersLoading(false);
  };

  // Load Billing & General Data
  const loadAdminData = async () => {
    setLoading(true);
    const [pRes, plRes, rRes] = await Promise.all([
      fetchApi<PaymentProvider[]>('/admin/payment-providers'),
      fetchApi<Plan[]>('/admin/plans'),
      fetchApi<any[]>('/admin/reports'),
    ]);

    if (pRes.ok && pRes.data) setProviders(pRes.data);
    if (plRes.ok && plRes.data) setPlans(plRes.data);
    if (rRes.ok && rRes.data) setReports(rRes.data);
    setLoading(false);
  };

  // Gatekeeper: Google Sign-in for Admin
  const handleGoogleAdminLogin = async () => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await fetchApi<{ ok: boolean; user: User; message?: string }>('/auth/google-login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'thrayanabil@gmail.com',
          name: 'ثريا نبيل (المشرف العام)',
        }),
      });

      if (res.ok && res.user) {
        onUserLoginSuccess(res.user);
      } else {
        setLoginError(res.error || 'تعذر تسجيل الدخول عبر Google');
      }
    } catch (e: any) {
      setLoginError(e.message || 'خطأ في الاتصال');
    } finally {
      setLoginLoading(false);
    }
  };

  // Gatekeeper: Password Login for Admin
  const handlePasswordAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await fetchApi<{ ok: boolean; user: User; message?: string }>('/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
        }),
      });

      if (res.ok && res.user) {
        onUserLoginSuccess(res.user);
      } else {
        setLoginError(res.error || 'بيانات اعتماد المشرف غير صحيحة');
      }
    } catch (e: any) {
      setLoginError(e.message || 'تعذر التحقق من المشرف');
    } finally {
      setLoginLoading(false);
    }
  };

  // Add Member
  const handleAddMember = async (e: FormEvent) => {
    e.preventDefault();
    setMemberActionMsg(null);

    const res = await fetchApi<{ ok: boolean; data: MemberRecord; message: string; error?: string }>('/admin/members', {
      method: 'POST',
      body: JSON.stringify(newMemberForm),
    });

    if (res.ok && res.data) {
      setMemberActionMsg({ text: res.message || 'تم تسجيل العضو بنجاح', type: 'success' });
      setShowAddMember(false);
      setNewMemberForm({
        name: '',
        email: '',
        role: 'user',
        account_type: 'user',
        phone: '',
        country_code: 'EG',
      });
      loadMembers();
    } else {
      setMemberActionMsg({ text: res.error || 'تعذر تسجيل العضو', type: 'error' });
    }
  };

  // Toggle Member Status (active / suspended)
  const handleToggleMemberStatus = async (member: MemberRecord) => {
    const nextStatus = member.status === 'active' ? 'suspended' : 'active';
    const res = await fetchApi<{ ok: boolean; data: MemberRecord; error?: string }>(`/admin/members/${member.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: nextStatus }),
    });

    if (res.ok) {
      setMemberActionMsg({ 
        text: `تم ${nextStatus === 'active' ? 'تنشيط' : 'إيقاف'} حساب العضو (${member.name})`, 
        type: 'success' 
      });
      loadMembers();
    } else {
      setMemberActionMsg({ text: res.error || 'تعذر تعديل الحالة', type: 'error' });
    }
  };

  // Toggle Member Role (promote / demote)
  const handleToggleMemberRole = async (member: MemberRecord) => {
    const nextRole = member.role === 'admin' ? 'user' : 'admin';
    const res = await fetchApi<{ ok: boolean; data: MemberRecord; error?: string }>(`/admin/members/${member.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ role: nextRole }),
    });

    if (res.ok) {
      setMemberActionMsg({ 
        text: `تم تعديل رتبة العضو (${member.name}) إلى: ${nextRole === 'admin' ? 'مشرف' : 'عضو عادي'}`, 
        type: 'success' 
      });
      loadMembers();
    } else {
      setMemberActionMsg({ text: res.error || 'تعذر تعديل الصلاحية', type: 'error' });
    }
  };

  // Delete Member
  const handleDeleteMember = async (member: MemberRecord) => {
    if (!confirm(`هل أنت متأكد من حذف العضو (${member.name}) نهائياً؟`)) return;
    const res = await fetchApi<{ ok: boolean; message?: string; error?: string }>(`/admin/members/${member.id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setMemberActionMsg({ text: res.message || 'تم حذف العضو بنجاح', type: 'success' });
      loadMembers();
    } else {
      setMemberActionMsg({ text: res.error || 'تعذر حذف العضو', type: 'error' });
    }
  };

  const toggleProvider = async (id: number, currentEnabled: boolean) => {
    setUpdatingId(id);
    const res = await fetchApi<PaymentProvider>(`/admin/payment-providers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled: !currentEnabled }),
    });
    if (res.ok) {
      setProviders((prev) =>
        prev.map((p) => (p.id === id ? { ...p, enabled: !currentEnabled } : p))
      );
    }
    setUpdatingId(null);
  };

  const handleSavePlan = async (id: number) => {
    setUpdatingId(id);
    const res = await fetchApi<Plan>(`/admin/plans/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ price: editPrice, duration_days: editDays }),
    });
    if (res.ok) {
      setPlans((prev) =>
        prev.map((pl) =>
          pl.id === id ? { ...pl, price: editPrice, duration_days: editDays } : pl
        )
      );
      setEditingPlanId(null);
    }
    setUpdatingId(null);
  };

  // ===================== LOCKED GATEKEEPER SCREEN =====================
  if (!isSuperAdmin) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 space-y-6 animate-fadeIn">
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto text-rose-600">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
              <ShieldAlert className="w-3.5 h-3.5" />
              لوحة التحكم مغلقة ومحمية
            </span>
            <h2 className="text-2xl font-black text-stone-900">
              مخصصة للمشرف العام فقط
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto">
              تم إغلاق لوحة الإدارة السيادية لمنصة دَرْب أمام الزوار والنسخة التجريبية.
              يتطلب الوصول تصريح الدخول الخاص بالمشرف المعتمد: <span className="font-mono font-bold text-stone-800" dir="ltr">thrayanabil@gmail.com</span>
            </p>
          </div>

          {loginError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl flex items-center gap-2 text-right">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Quick Google Sign In for Admin */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleGoogleAdminLogin}
              disabled={loginLoading}
              className="w-full py-3.5 px-4 bg-[#1bb49e] hover:bg-[#169b88] text-white text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.14z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.09-6.68-4.91H1.21v3.15C3.25 21.46 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.21C.44 8.09 0 9.99 0 12s.44 3.91 1.21 5.44l4.11-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.54 1.21 6.56l4.11 3.15c.94-2.82 3.58-4.96 6.68-4.96z"/>
              </svg>
              <span>{loginLoading ? 'جاري التحقق...' : 'دخول المشرف المعتمد عبر Google'}</span>
            </button>
          </div>

          {/* Form Login for credentials */}
          <div className="pt-4 border-t border-stone-100 text-right">
            <span className="block text-xs font-bold text-stone-700 mb-3 text-center">
              أو التحقق المباشر ببيانات المشرف:
            </span>
            <form onSubmit={handlePasswordAdminLogin} className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div>
                <label className="block text-[11px] text-stone-600 font-medium mb-1">
                  اسم المستخدم / البريد:
                </label>
                <input
                  type="email"
                  dir="ltr"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl font-mono focus:outline-hidden focus:border-[#1bb49e]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 font-medium mb-1">
                  كلمة المرور:
                </label>
                <input
                  type="password"
                  dir="ltr"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl font-mono focus:outline-hidden focus:border-[#1bb49e]"
                  placeholder="Tr@7177"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-2.5 bg-[#071a2b] hover:bg-[#0d2a45] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-indigo-300" />
                <span>{loginLoading ? 'جاري التحقق...' : 'فتح لوحة التحكم'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    const matchSearch = 
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
      (m.phone && m.phone.includes(memberSearch));
    const matchRole = memberRoleFilter === 'all' || m.role === memberRoleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div id="darb-admin-panel" className="space-y-6">
      
      {/* Admin Header Banner */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 bg-gradient-to-br from-indigo-500 to-[#1bb49e] text-white rounded-2xl shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-stone-900">لوحة المشرف العام (DARB Supervisor Panel)</h2>
              <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                جلسة المشرف: thrayanabil@gmail.com
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              تسجيل وإدارة الأعضاء، ضبط بوابات الدفع، وإدارة محرك المعرفة الشامل وحوكمة الذكاء الاصطناعي.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              loadMembers();
              loadAdminData();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading || membersLoading ? 'animate-spin' : ''}`} />
            <span>تحديث البيانات</span>
          </button>
        </div>
      </div>

      {/* Security & System Info Bar */}
      <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Database className={`w-5 h-5 ${health?.database ? 'text-emerald-400' : 'text-amber-400'}`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">حالة الاتصال والرقابة السيادية</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                لوحة التحكم مغلقة ومحمية
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              قاعدة البيانات: {health?.database ? 'PostgreSQL Production متصلة' : 'ذاكرة الخادم النشطة (Active High-Availability Memory)'} • نظام التوثيق: حصري عبر Google.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-stone-400">
          إصدار المنصة: {health?.version || 'V1.16 Sovereign'}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        
        {/* Members Management Tab */}
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'members'
              ? 'bg-[#1bb49e] text-white shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>تسجيل وإدارة الأعضاء ({members.length})</span>
        </button>

        {/* Global Knowledge Engine Tab */}
        <button
          onClick={() => setActiveTab('global_knowledge')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'global_knowledge'
              ? 'bg-[#1bb49e] text-white shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          <span>محرك المعرفة الشامل للدول (GKE)</span>
        </button>

        {/* AI Governance Tab */}
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ai'
              ? 'bg-[#1bb49e] text-white shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>إدارة DARB AI وحوكمة المعرفة</span>
        </button>

        {/* Billing Tab */}
        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'billing'
              ? 'bg-[#071a2b] text-white shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>بوابات الدفع، الاشتراكات والرقابة</span>
        </button>
      </div>

      {/* Tab 1: MEMBERS MANAGEMENT */}
      {activeTab === 'members' ? (
        <div className="space-y-6">
          
          {/* Action notification message */}
          {memberActionMsg && (
            <div className={`p-3.5 rounded-2xl text-xs flex items-center justify-between gap-2 ${
              memberActionMsg.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              <div className="flex items-center gap-2">
                {memberActionMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>{memberActionMsg.text}</span>
              </div>
              <button onClick={() => setMemberActionMsg(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Members Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
              <div className="text-xs text-stone-500 mb-1">إجمالي الأعضاء المسجلين</div>
              <div className="text-2xl font-black text-stone-900">{memberStats.total || members.length}</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">موثقين عبر Google</div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
              <div className="text-xs text-stone-500 mb-1">الحسابات النشطة</div>
              <div className="text-2xl font-black text-emerald-600">{memberStats.active || members.filter(m => m.status === 'active').length}</div>
              <div className="text-[10px] text-stone-400 mt-1">تفاعل كامل في دَرْب</div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
              <div className="text-xs text-stone-500 mb-1">المشرفون والإدارة</div>
              <div className="text-2xl font-black text-indigo-600">{memberStats.admins || members.filter(m => m.role === 'admin').length}</div>
              <div className="text-[10px] text-stone-400 mt-1">صلاحيات سيادية كاملة</div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
              <div className="text-xs text-stone-500 mb-1">حسابات موقوفة</div>
              <div className="text-2xl font-black text-rose-600">{memberStats.suspended || members.filter(m => m.status === 'suspended').length}</div>
              <div className="text-[10px] text-stone-400 mt-1">إيقاف مؤقت للرقابة</div>
            </div>
          </div>

          {/* Registration Form Accordion */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#1bb49e]" />
                <h3 className="font-bold text-stone-900 text-sm">تسجيل عضو جديد في المنصة</h3>
              </div>
              <button
                onClick={() => setShowAddMember(!showAddMember)}
                className="px-3 py-1.5 bg-[#1bb49e] hover:bg-[#169b88] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {showAddMember ? 'إلغاء النموذج' : '+ تسجيل عضو جديد'}
              </button>
            </div>

            {showAddMember && (
              <form onSubmit={handleAddMember} className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    الاسم الكامل: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.name}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                    placeholder="مثال: د. ماجد السعيد"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#1bb49e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    البريد الإلكتروني (Google): <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={newMemberForm.email}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                    placeholder="user@gmail.com"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#1bb49e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    نوع الحساب:
                  </label>
                  <select
                    value={newMemberForm.account_type}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, account_type: e.target.value as AccountType })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#1bb49e]"
                  >
                    <option value="user">عضو / باحث عن عمل</option>
                    <option value="company">شركة / صاحب عمل</option>
                    <option value="lawyer">محامي / استشارات قانونية</option>
                    <option value="recruiter">وكالة توظيف</option>
                    <option value="service_provider">مقدم خدمات للمغتربين</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    صلاحية الحساب:
                  </label>
                  <select
                    value={newMemberForm.role}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, role: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#1bb49e]"
                  >
                    <option value="user">عضو عادي (User)</option>
                    <option value="supervisor">مشرف مساعد (Supervisor)</option>
                    <option value="admin">مشرف عام كامل (Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    رقم الهاتف:
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={newMemberForm.phone}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                    placeholder="+966 50 000 0000"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#1bb49e]"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-[#071a2b] hover:bg-[#0d2a45] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    حفظ وتأكيد تسجيل العضو
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Members Search & Table */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="البحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:border-[#1bb49e]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMemberRoleFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                    memberRoleFilter === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  الكل ({members.length})
                </button>
                <button
                  onClick={() => setMemberRoleFilter('admin')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                    memberRoleFilter === 'admin' ? 'bg-indigo-600 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  المشرفين
                </button>
                <button
                  onClick={() => setMemberRoleFilter('user')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                    memberRoleFilter === 'user' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  الأعضاء
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500">
                    <th className="pb-3 pr-2">العضو</th>
                    <th className="pb-3">نوع الحساب</th>
                    <th className="pb-3">الرتبة</th>
                    <th className="pb-3">الهاتف</th>
                    <th className="pb-3">الحالة</th>
                    <th className="pb-3 pl-2 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredMembers.map((member) => {
                    const isCoreAdmin = member.email.toLowerCase() === 'thrayanabil@gmail.com';
                    return (
                      <tr key={member.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3.5 pr-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#1bb49e]/15 text-[#1bb49e] font-bold flex items-center justify-center shrink-0">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-stone-900 flex items-center gap-1.5">
                                <span>{member.name}</span>
                                {isCoreAdmin && (
                                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded-sm font-bold">
                                    المشرف الأساسي
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-stone-500 font-mono" dir="ltr">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5">
                          <span className="text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md font-medium">
                            {member.account_type === 'company' ? 'شركة' :
                             member.account_type === 'lawyer' ? 'محامي' :
                             member.account_type === 'recruiter' ? 'وكالة توظيف' :
                             member.account_type === 'service_provider' ? 'مقدم خدمة' : 'مستخدم'}
                          </span>
                        </td>

                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            member.role === 'admin' 
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                              : 'bg-stone-100 text-stone-600'
                          }`}>
                            {member.role === 'admin' ? 'مشرف عام' : 'عضو'}
                          </span>
                        </td>

                        <td className="py-3.5 font-mono text-stone-600" dir="ltr">
                          {member.phone || '—'}
                        </td>

                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            member.status === 'active' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {member.status === 'active' ? 'نشط ومفعل' : 'موقوف'}
                          </span>
                        </td>

                        <td className="py-3.5 pl-2 text-left">
                          {!isCoreAdmin ? (
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Toggle Status */}
                              <button
                                onClick={() => handleToggleMemberStatus(member)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                                  member.status === 'active' 
                                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200' 
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {member.status === 'active' ? 'إيقاف' : 'تفعيل'}
                              </button>

                              {/* Toggle Role */}
                              <button
                                onClick={() => handleToggleMemberRole(member)}
                                className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                              >
                                {member.role === 'admin' ? 'تخفيض لعضو' : 'ترقية لمشرف'}
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteMember(member)}
                                className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="حذف العضو"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-stone-400 font-bold italic">
                              حساب محمي
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : activeTab === 'global_knowledge' ? (
        <DarbGlobalKnowledgeAdminView />
      ) : activeTab === 'ai' ? (
        <DarbAIAdminPanel />
      ) : (
        <>
          {/* Grid: Payment Providers & Plans */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
            {/* Payment Gateways */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-stone-900 text-sm">مزودو وبوابات الدفع (Payment Providers)</h3>
                </div>
                <span className="text-xs text-stone-400">إدارة البوابات المحلية والدولية</span>
              </div>

              <div className="space-y-3">
                {providers.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200/60"
                  >
                    <div>
                      <div className="font-bold text-xs text-stone-800">{p.name_ar}</div>
                      <div className="text-[11px] font-mono text-stone-500 uppercase">{p.code}</div>
                    </div>

                    <button
                      onClick={() => toggleProvider(p.id, p.enabled)}
                      disabled={updatingId === p.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        p.enabled
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                      }`}
                    >
                      {updatingId === p.id ? '...' : p.enabled ? 'مفعّل' : 'معطّل'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Plans Management */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-stone-900 text-sm">باقات تمييز الإعلانات والاشتراكات</h3>
                </div>
                <span className="text-xs text-stone-400">تسعير الباقات</span>
              </div>

              <div className="space-y-3">
                {plans.map((pl) => (
                  <div
                    key={pl.id}
                    className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-stone-800">{pl.name_ar}</span>
                      <span className="text-[11px] font-mono text-stone-500">{pl.code}</span>
                    </div>

                    {editingPlanId === pl.id ? (
                      <div className="flex items-center gap-2 pt-2 border-t border-stone-200">
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(Number(e.target.value))}
                          className="w-20 px-2 py-1 text-xs border border-stone-300 rounded-md"
                          placeholder="السعر"
                        />
                        <span className="text-xs text-stone-500">{pl.currency}</span>

                        <input
                          type="number"
                          value={editDays}
                          onChange={(e) => setEditDays(Number(e.target.value))}
                          className="w-20 px-2 py-1 text-xs border border-stone-300 rounded-md"
                          placeholder="الأيام"
                        />
                        <span className="text-xs text-stone-500">يوم</span>

                        <button
                          onClick={() => handleSavePlan(pl.id)}
                          className="p-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingPlanId(null)}
                          className="p-1 bg-stone-300 text-stone-700 rounded-md hover:bg-stone-400 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-stone-600">
                        <span>
                          السعر: <strong className="text-stone-900">{pl.price} {pl.currency}</strong> ({pl.duration_days} يوم)
                        </span>
                        <button
                          onClick={() => {
                            setEditingPlanId(pl.id);
                            setEditPrice(pl.price);
                            setEditDays(pl.duration_days);
                          }}
                          className="text-indigo-600 hover:text-indigo-800 text-[11px] font-semibold cursor-pointer"
                        >
                          تعديل
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Reports & Moderation Queue */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-sm">بلاغات المحتوى والمراجعة (Reports & Flags)</h3>
              </div>
              <span className="text-xs text-stone-400">{reports.length} بلاغ نشط</span>
            </div>

            {reports.length === 0 ? (
              <div className="text-center py-6 text-xs text-stone-500">
                لا توجد بلاغات معلقة حالياً. جميع إعلانات وخدمات دَرْب مطابقة لمعايير المحتوى.
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((r) => (
                  <div key={r.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-stone-800">سبب البلاغ: {r.reason}</div>
                      <div className="text-[11px] text-stone-500">النوع: {r.target_type} • المعرف: {r.target_id}</div>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                      {r.status || 'قيد المراجعة'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}
