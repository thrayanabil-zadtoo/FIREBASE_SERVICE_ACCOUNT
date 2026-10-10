import { useState, type FormEvent } from 'react';
import { 
  Compass, 
  MapPin, 
  Tag, 
  Plus, 
  Star, 
  Search, 
  X, 
  CheckCircle2, 
  ShieldCheck,
  Building,
  GraduationCap,
  Scale,
  Laptop
} from 'lucide-react';
import { Service, Country } from '../types';
import { fetchApi } from '../api';

interface ServicesSectionProps {
  services: Service[];
  countries: Country[];
  onServiceAdded: (service: Service) => void;
  onSelectService: (service: Service) => void;
}

export default function ServicesSection({
  services,
  countries,
  onServiceAdded,
  onSelectService,
}: ServicesSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [nameAr, setNameAr] = useState('');
  const [category, setCategory] = useState('قانون واستشارات');
  const [cityName, setCityName] = useState('');
  const [countryCode, setCountryCode] = useState('PS');
  const [descriptionAr, setDescriptionAr] = useState('');

  const categories = [
    { id: 'ALL', label: 'جميع الخدمات', icon: Compass },
    { id: 'قانون واستشارات', label: 'قانون واستشارات', icon: Scale },
    { id: 'عقارات وسكن', label: 'عقارات وسكن', icon: Building },
    { id: 'تعليم وتصديقات', label: 'تعليم وتصديقات', icon: GraduationCap },
    { id: 'تقنية وأعمال', label: 'تقنية وأعمال', icon: Laptop },
  ];

  const filteredServices = services.filter((s) => {
    if (selectedCategory !== 'ALL' && s.category !== selectedCategory) {
      return false;
    }
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      s.name_ar.toLowerCase().includes(q) ||
      s.description_ar.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q) ||
      s.city_name?.toLowerCase().includes(q)
    );
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !descriptionAr.trim()) return;

    setSubmitting(true);
    const res = await fetchApi<Service>('/services', {
      method: 'POST',
      body: JSON.stringify({
        name_ar: nameAr,
        category,
        city_name: cityName,
        country_code: countryCode,
        description_ar: descriptionAr,
      }),
    });

    if (res.ok && res.data) {
      onServiceAdded(res.data);
      setIsModalOpen(false);
      setNameAr('');
      setCityName('');
      setDescriptionAr('');
    }
    setSubmitting(false);
  };

  return (
    <div id="darb-services-section" className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#1bb49e]" />
            <h2 className="text-lg font-bold text-stone-900">دليل الخدمات واستشارات المغتربين</h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            محامون معتمدون، خدمات إقامة وتأشيرات، مكاتب عقارية، ومساحات عمل للمستقلين.
          </p>
        </div>

        <button
          id="btn-add-service-modal"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1bb49e] hover:bg-[#169b88] text-white shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة خدمة جديدة</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#071a2b] text-white font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="ابحث في الخدمات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl pr-9 pl-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-[#1bb49e]"
          />
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500 text-sm">
          لم يتم العثور على خدمات في هذا التصنيف. يمكنك إضافة أول خدمة الآن!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                service.featured ? 'border-emerald-300 ring-1 ring-emerald-200/60' : 'border-stone-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1bb49e] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md mb-1">
                      <Tag className="w-3 h-3" />
                      {service.category}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 leading-snug">{service.name_ar}</h3>
                  </div>
                  <span className="p-2 bg-stone-100 text-stone-600 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{service.city_name || 'خدمة متعددة المدن'}</span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {service.description_ar}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  مقدم خدمة موثق
                </span>
                <button
                  onClick={() => onSelectService(service)}
                  className="px-3 py-1.5 text-xs font-bold bg-[#1bb49e]/10 hover:bg-[#1bb49e] text-[#117d6e] hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  طلب الخدمة / تفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">إضافة خدمة جديدة في دَرْب</h3>
                  <p className="text-xs text-stone-500">سجل خدمتك ليراها المغتربون والوافدون وأصحاب الأعمال</p>
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
                <label className="block text-xs font-bold text-stone-700 mb-1">اسم الخدمة أو المكتب *</label>
                <input
                  required
                  type="text"
                  placeholder="مثال: مكتب العدالة للاستشارات وتصاريح الإقامة"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
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
                    <option value="قانون واستشارات">قانون واستشارات</option>
                    <option value="عقارات وسكن">عقارات وسكن</option>
                    <option value="تعليم وتصديقات">تعليم وتصديقات</option>
                    <option value="تقنية وأعمال">تقنية وأعمال</option>
                    <option value="شحن ولوجستيات">شحن ولوجستيات</option>
                  </select>
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

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">المدينة أو النطاق</label>
                <input
                  type="text"
                  placeholder="رام الله، القاهرة، غزة، جدة..."
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-[#1bb49e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">شرح مفصل عن الخدمة وكيفية الاستفادة *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="الخدمات المقدمة، أوقات العمل، المستندات المطلوبة، وأرقام أو بريد التواصل..."
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
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
                  {submitting ? 'جاري الإضافة...' : 'حفظ وإدراج الخدمة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
