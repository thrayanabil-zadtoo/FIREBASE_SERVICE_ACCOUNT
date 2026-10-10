import { useState, type FormEvent } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Building2, 
  Banknote, 
  Plus, 
  Star, 
  Search, 
  X,
  CheckCircle2, 
  Calendar
} from 'lucide-react';
import { Job, Country } from '../types';
import { fetchApi } from '../api';

interface JobsSectionProps {
  jobs: Job[];
  countries: Country[];
  onJobAdded: (job: Job) => void;
  onSelectJob: (job: Job) => void;
}

export default function JobsSection({
  jobs,
  countries,
  onJobAdded,
  onSelectJob,
}: JobsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cityName, setCityName] = useState('');
  const [countryCode, setCountryCode] = useState('PS');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');

  const filteredJobs = jobs.filter((job) => {
    if (selectedCountry !== 'ALL' && job.country_code !== selectedCountry) {
      return false;
    }
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q) ||
      job.company_name?.toLowerCase().includes(q) ||
      job.city_name?.toLowerCase().includes(q)
    );
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    const res = await fetchApi<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify({
        title,
        company_name: companyName,
        city_name: cityName,
        country_code: countryCode,
        salary_min: salaryMin ? Number(salaryMin) : undefined,
        salary_max: salaryMax ? Number(salaryMax) : undefined,
        currency,
        description,
      }),
    });

    if (res.ok && res.data) {
      onJobAdded(res.data);
      setIsModalOpen(false);
      // Reset form
      setTitle('');
      setCompanyName('');
      setCityName('');
      setDescription('');
      setSalaryMin('');
      setSalaryMax('');
    }
    setSubmitting(false);
  };

  return (
    <div id="darb-jobs-section" className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#1bb49e]" />
            <h2 className="text-lg font-bold text-stone-900">سوق الوظائف والفرص للمغتربين</h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            فرص عمل معتمدة للشركات والعمل عن بُعد في فلسطين، مصر، ودول الخليج.
          </p>
        </div>

        <button
          id="btn-add-job-modal"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1bb49e] hover:bg-[#169b88] text-white shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>نشر فرصة عمل جديدة</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="ابحث عن وظيفة، شركة، مسمى..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl pr-9 pl-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-[#1bb49e]"
          />
        </div>

        {/* Country Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1">
          <button
            onClick={() => setSelectedCountry('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer ${
              selectedCountry === 'ALL'
                ? 'bg-stone-900 text-white font-bold'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            جميع الدول ({jobs.length})
          </button>
          {countries.slice(0, 5).map((c) => (
            <button
              key={c.code}
              onClick={() => setSelectedCountry(c.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap cursor-pointer ${
                selectedCountry === c.code
                  ? 'bg-stone-900 text-white font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {c.name_ar}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500 text-sm">
          لا توجد وظائف مطابقة لمعايير البحث الحالية. يمكنك نشر وظيفة جديدة الآن!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              id={`job-card-${job.id}`}
              className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                job.featured ? 'border-amber-300 ring-1 ring-amber-200/60' : 'border-stone-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {job.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full mb-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        وظيفة مميزة
                      </span>
                    )}
                    <h3 className="text-base font-bold text-stone-900 leading-snug">{job.title}</h3>
                  </div>
                  <span className="p-2 bg-stone-100 text-stone-600 rounded-xl">
                    <Briefcase className="w-4 h-4" />
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-stone-500">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-stone-400" />
                    <span>{job.company_name || 'شركة معلنة'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{job.city_name || 'كل المدن'}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {job.description}
                </p>

                {/* Salary Info */}
                {(job.salary_min || job.salary_max) && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                    <Banknote className="w-4 h-4" />
                    <span>
                      {job.salary_min ? job.salary_min.toLocaleString() : ''}
                      {job.salary_max ? ` - ${job.salary_max.toLocaleString()}` : ''}{' '}
                      {job.currency || 'USD'}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  منشور حديثاً
                </span>
                <button
                  id={`btn-view-job-${job.id}`}
                  onClick={() => onSelectJob(job)}
                  className="px-3 py-1.5 text-xs font-bold bg-stone-100 hover:bg-[#1bb49e] hover:text-white rounded-lg transition-colors cursor-pointer text-stone-700"
                >
                  التفاصيل والتقديم
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">نشر فرصة عمل في دَرْب</h3>
                  <p className="text-xs text-stone-500">ستصل الوظيفة لآلاف الباحثين عن عمل والمغتربين</p>
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
                <label className="block text-xs font-bold text-stone-700 mb-1">المسمى الوظيفي *</label>
                <input
                  required
                  type="text"
                  placeholder="مثال: مطور برمجيات، محاسب، مترجم..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-[#1bb49e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">اسم الشركة</label>
                  <input
                    type="text"
                    placeholder="اسم المؤسسة أو جهة العمل"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-[#1bb49e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">الدولة</label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-[#1bb49e]"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name_ar}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">المدينة</label>
                  <input
                    type="text"
                    placeholder="رام الله، غزة، القاهرة..."
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-[#1bb49e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">الحد الأدنى للراتب</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-[#1bb49e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">العملة</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-[#1bb49e]"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EGP">EGP (جنيه)</option>
                    <option value="SAR">SAR (ريال)</option>
                    <option value="AED">AED (درهم)</option>
                    <option value="JOD">JOD (دينار أردني)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">تفاصيل ومتطلبات الوظيفة *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="المسؤوليات، سنوات الخبرة، طريقة التواصل وإرسال السيرة الذاتية..."
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
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1bb49e] hover:bg-[#169b88] text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {submitting ? 'جاري النشر...' : 'نشر الوظيفة الآن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
