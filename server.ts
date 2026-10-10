import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { registerDarbAIRoutes, loadKnowledge } from './server/register-darb-ai-routes';
import { registerDarbAIAdminRoutes } from './server/darb-ai-admin-routes';
import { registerDarbAIWebSearchRoutes } from './server/darb-ai-web-search-routes';
import { registerDarbAIAnswerRoutes } from './server/darb-ai-answer-routes';
import { registerDarbAIQualityRoutes } from './server/darb-ai-quality-routes';
import { registerDarbAIMonitoringRoutes } from './server/darb-ai-monitoring-routes';
import { registerDarbAILearningRoutes } from './server/darb-ai-learning-routes';
import { registerDarbAIOrchestratorRoutes } from './server/darb-ai-orchestrator-routes';
import { registerDarbAISecurityRoutes } from './server/darb-ai-security-routes';
import { registerDarbAIResilienceRoutes } from './server/darb-ai-resilience-routes';
import { registerDarbAIEvaluationRoutes } from './server/darb-ai-evaluation-routes';
import { registerDarbAIKnowledgeRefreshRoutes } from './server/darb-ai-knowledge-refresh-routes';
import { registerDarbAIEvaluationRunnerRoutes } from './server/darb-ai-evaluation-runner-routes';
import { registerDarbAIRegressionGateRoutes } from './server/darb-ai-regression-gate-routes';
import { registerDarbAIReleaseVersionRoutes } from './server/darb-ai-release-version-routes';
import { registerDarbAIDeploymentEnvironmentRoutes } from './server/darb-ai-deployment-environment-routes';
import { registerDarbAIObservabilitySloRoutes } from './server/darb-ai-observability-slo-routes';
import { registerDarbAiIncidentRecoveryRoutes } from './server/darb-ai-incident-recovery-routes';
import { registerDarbAiCapacityCostRoutes } from './server/darb-ai-capacity-cost-routes';
import { registerDarbAiOptimizationRoutes } from './server/darb-ai-optimization-routes';
import { registerDarbAIProductionAuditRoutes } from './server/darb-ai-production-audit-routes';
import { registerDarbGlobalKnowledgeRoutes } from './server/darb-global-knowledge-routes';
import { DarbGlobalKnowledgeEngine } from './server/darb-global-knowledge-engine';
import { registerCountryProfileRoutes } from './server/darb-country-profile-routes';
import { ALL_ARAB_CITIES, ALL_CITIES } from './server/darb-all-cities';
import { FOREIGN_COUNTRIES_LIST } from './server/darb-foreign-countries-profiles-data';

dotenv.config();

// Derive directory name safely in both ESM and CJS bundle
const currentDir = typeof __dirname !== 'undefined' 
  ? __dirname 
  : (import.meta?.url ? path.dirname(fileURLToPath(import.meta.url)) : process.cwd());
const PORT = 3000;

// Database connection pool (PostgreSQL)
const pool = process.env.DATABASE_URL
  ? new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    })
  : null;

// Initial rich seed data for Darb platform
const demoData = {
  countries: [
    { code: 'EG', name_ar: 'مصر', name_en: 'Egypt', description_ar: 'نقطة البداية في دَرْب: المدن والوظائف والخدمات للمغتربين والوافدين.', active: true },
    { code: 'SA', name_ar: 'السعودية', name_en: 'Saudi Arabia', description_ar: 'دليل المدن والوظائف والخدمات للمغتربين وفرص رؤية 2030.', active: true },
    { code: 'AE', name_ar: 'الإمارات العربية المتحدة', name_en: 'United Arab Emirates', description_ar: 'دليل المدن والوظائف والخدمات للمغتربين ومراكز الأعمال والتقنية.', active: true },
    { code: 'QA', name_ar: 'قطر', name_en: 'Qatar', description_ar: 'دليل المدن والوظائف والخدمات للمغتربين في الدوحة ومختلف القطاعات.', active: true },
    { code: 'KW', name_ar: 'الكويت', name_en: 'Kuwait', description_ar: 'دليل المدن والوظائف والخدمات وتأسيس الأعمال.', active: true },
    { code: 'JO', name_ar: 'الأردن', name_en: 'Jordan', description_ar: 'دليل المدن والوظائف والخدمات للمغتربين والتعليم والاستقرار في عمّان.', active: true },
    { code: 'PS', name_ar: 'فلسطين', name_en: 'Palestine', description_ar: 'فلسطين: مدينة غزة ومدن الضفة الغربية، للوظائف والخدمات والإعلانات.', active: true },
    { code: 'BH', name_ar: 'البحرين', name_en: 'Bahrain', description_ar: 'دليل المدن والوظائف والخدمات والفرص المالية والاستثمارية.', active: true },
    { code: 'OM', name_ar: 'عُمان', name_en: 'Oman', description_ar: 'دليل المدن والوظائف والخدمات للمغتربين وحياة العمل المستقرة.', active: true },
    { code: 'LB', name_ar: 'لبنان', name_en: 'Lebanon', description_ar: 'دليل المدن والخدمات المهنية والعمل عن بُعد والمبادرات.', active: true },
    { code: 'IQ', name_ar: 'العراق', name_en: 'Iraq', description_ar: 'دليل المدن والوظائف ومشاريع الإعمار والبنية التحتية والخدمات.', active: true },
    { code: 'SY', name_ar: 'سوريا', name_en: 'Syria', description_ar: 'دليل المدن والخدمات والفرص التجارية والمهنية والاجتماعية.', active: true },
    { code: 'YE', name_ar: 'اليمن', name_en: 'Yemen', description_ar: 'دليل المدن والخدمات والوظائف والمبادرات المجتمعية.', active: true },
    { code: 'MA', name_ar: 'المغرب', name_en: 'Morocco', description_ar: 'دليل المدن والوظائف والخدمات للمغتربين وريادة الأعمال.', active: true },
    { code: 'DZ', name_ar: 'الجزائر', name_en: 'Algeria', description_ar: 'دليل المدن والوظائف والخدمات الصناعية والتجارية.', active: true },
    { code: 'TN', name_ar: 'تونس', name_en: 'Tunisia', description_ar: 'دليل المدن والوظائف والخدمات التقنية والسياحية.', active: true },
    { code: 'LY', name_ar: 'ليبيا', name_en: 'Libya', description_ar: 'دليل المدن والوظائف وخدمات الإعمار والتجارة العامة.', active: true },
    { code: 'SD', name_ar: 'السودان', name_en: 'Sudan', description_ar: 'دليل المدن والخدمات وفرص العمل والروابط المجتمعية للمغتربين.', active: true },
    { code: 'SO', name_ar: 'الصومال', name_en: 'Somalia', description_ar: 'دليل المدن والوظائف والتجارة والخدمات البحرية والاستثمارية.', active: true },
    { code: 'DJ', name_ar: 'جيبوتي', name_en: 'Djibouti', description_ar: 'دليل المدن والوظائف والخدمات اللوجستية والموانئ.', active: true },
    { code: 'MR', name_ar: 'موريتانيا', name_en: 'Mauritania', description_ar: 'دليل المدن والوظائف وخدمات التعدين والصيد والأعمال.', active: true },
    { code: 'KM', name_ar: 'جزر القمر', name_en: 'Comoros', description_ar: 'دليل المدن والخدمات والفرص السياحية والبيئية والتجارية.', active: true },
    ...FOREIGN_COUNTRIES_LIST
  ],
  cities: ALL_CITIES,
  jobs: [
    {
      id: 1,
      title: 'مطور برمجيات Full-Stack عن بُعد',
      company_name: 'شركة درب التقنية',
      city_name: 'رام الله والبيرة',
      country_code: 'PS',
      salary_min: 2500,
      salary_max: 4000,
      currency: 'USD',
      description: 'مطلوب مطور واجهات React وNode.js بخبرة 3 سنوات للعمل ضمن فريق منتجات منصة درب.',
      featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'مستشار توظيف وإدارة شؤون الوافدين',
      company_name: 'المجموعة الدولية للاستشارات',
      city_name: 'القاهرة',
      country_code: 'EG',
      salary_min: 15000,
      salary_max: 22000,
      currency: 'EGP',
      description: 'متابعة إجراءات الإقامة، وتصاريح العمل، ومساعدة الوافدين الجدد في الاستقرار السلس.',
      featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'مدير عمليات لوجستية وسلاسل إمداد',
      company_name: 'أفق للنقل السريع',
      city_name: 'جدة',
      country_code: 'SA',
      salary_min: 9000,
      salary_max: 14000,
      currency: 'SAR',
      description: 'إدارة وتنسيق الشحنات والتوزيع والتعامل مع الموانئ والجمارك.',
      featured: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      title: 'مترجم قانوني معتمد ومسؤول توثيق',
      company_name: 'دار العدالة للاستشارات',
      city_name: 'دبي',
      country_code: 'AE',
      salary_min: 8000,
      salary_max: 12000,
      currency: 'AED',
      description: 'ترجمة العقود القانونية وتصديق الشهادات والوثائق الحكومية للسفارات والوزارات.',
      featured: true,
      created_at: new Date().toISOString(),
    },
  ],
  services: [
    {
      id: 1,
      name_ar: 'استشارات قانونية وتصاريح الإقامة وتأسيس الشركات',
      category: 'قانون واستشارات',
      city_name: 'القاهرة',
      country_code: 'EG',
      description_ar: 'فريق محامين متخصص في إجراءات الإقامة والجنسية، استخراج السجلات التجارية، وتوثيق العقود للوافدين.',
      featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name_ar: 'خدمات الإسكان والبحث عن شقق مفروشة آمنة',
      category: 'عقارات وسكن',
      city_name: 'رام الله والبيرة',
      country_code: 'PS',
      description_ar: 'تأمين شقق سكنية ومكاتب عمل مفروشة ومجهزة بالإنترنت السريع مع عقود موثقة وضمان.',
      featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      name_ar: 'تصديق الشهادات الجامعية والمعادلات المهنية',
      category: 'تعليم وتصديقات',
      city_name: 'الرياض',
      country_code: 'SA',
      description_ar: 'مساعدة المغتربين والطلاب في إنهاء تصديقات الخارجية وسفارات الدول المعنية خلال وقت قياسي.',
      featured: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      name_ar: 'دعم تقني وتجهيز مساحات العمل عن بعد للفرق الناشئة',
      category: 'تقنية وأعمال',
      city_name: 'مدينة غزة',
      country_code: 'PS',
      description_ar: 'توفير بنية طاقة بديلة ومولدات وإنترنت للمبرمجين والمصممين المستقلين ومساعدتهم في تسليم مشاريعهم العالمية.',
      featured: true,
      created_at: new Date().toISOString(),
    },
  ],
  ads: [
    {
      id: 1,
      title: 'خصم 20% على خدمات الترجمة المعتمدة للوافدين',
      category: 'عروض حصرية',
      plan: 'featured',
      views: 1420,
      clicks: 312,
      description: 'احصل على خصم خاص عند ترجمة المستندات وشهادات الميلاد والخبرات عبر منصة دَرْب.',
      status: 'published',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'مساحات عمل مشتركة وباقات إنترنت عالية السرعة للمستقلين',
      category: 'مساحات عمل',
      plan: 'pro',
      views: 980,
      clicks: 195,
      description: 'احجز مكتبك اليوم واستمتع ببيئة عمل احترافية مع مشروبات مجانية وخصومات شهرية.',
      status: 'published',
      created_at: new Date().toISOString(),
    },
  ],
  paymentProviders: [
    { id: 1, code: 'provider_1', name_ar: 'بوابة دفع إلكتروني (فيزا / ماستركارد)', enabled: true },
    { id: 2, code: 'bank_transfer', name_ar: 'تحويل بنكي مباشر', enabled: true },
    { id: 3, code: 'fawry_wallets', name_ar: 'محافظ إلكترونية / فوري', enabled: false },
    { id: 4, code: 'mediator', name_ar: 'وسيط دفع دولي', enabled: false },
  ],
  plans: [
    { id: 1, code: 'free', name_ar: 'الباقة المجانية', price: 0, currency: 'USD', duration_days: 30, active: true },
    { id: 2, code: 'featured', name_ar: 'باقة الإعلان المميز', price: 15, currency: 'USD', duration_days: 30, active: true },
    { id: 3, code: 'pro', name_ar: 'باقة الشركات والتوظيف الاحترافية', price: 45, currency: 'USD', duration_days: 30, active: true },
  ],
  reports: [
    { id: 1, target_type: 'job', target_id: 2, reason: 'استفسار عن دوام الوظيفة', status: 'closed', created_at: new Date().toISOString() },
  ],
  questions: [
    {
      id: 1,
      title: 'ما هي أفضل مناطق السكن للعائلات والوافدين الجدد في القاهرة؟',
      body: 'نبحث عن منطقة آمنة وقريبة من الخدمات والمواصلات والمدارس، مع توفر إنترنت مستقر ومراكز تسوق.',
      country_name: 'مصر',
      city_name: 'القاهرة',
      status: 'published',
      views: 420,
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 2,
      title: 'خطوات وإجراءات تصديق الشهادات الجامعية للعمل في السعودية والخليج؟',
      body: 'ما هي الأوراق المطلوبة لتصديق الشهادة من وزارة الخارجية والقنصلية لمهنة مهندس برمجيات؟',
      country_name: 'السعودية',
      city_name: 'الرياض',
      status: 'published',
      views: 615,
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
    {
      id: 3,
      title: 'كيفية استئجار مساحة عمل مشتركة (Co-working) في رام الله ونابلس؟',
      body: 'أعمل عن بعد وأحتاج لمساحة عمل مجهزة بإنترنت فايبر وسرعة عالية في الضفة الغربية.',
      country_name: 'فلسطين',
      city_name: 'رام الله',
      status: 'published',
      views: 290,
      created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    }
  ],
  reviews: [
    {
      id: 1,
      service_id: 1,
      rating: 5,
      comment: 'خدمة قانونية ممتازة ودقيقة جداً في إنجاز عقود العمل والتصاديق الرسمية.',
      status: 'published',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      service_id: 2,
      rating: 5,
      comment: 'تجربة ممتازة في توفير سكن مفروش بالقاهرة بدون عمولات مبالغ فيها.',
      status: 'published',
      created_at: new Date().toISOString(),
    }
  ],
  jobAlerts: [
    { id: 1, keyword: 'مطور واجهات', channel: 'email', active: true, created_at: new Date().toISOString() }
  ],
};

// Database query helper
async function queryDb(sql: string, params: any[] = []): Promise<any[] | null> {
  if (!pool) return null;
  try {
    const res = await pool.query(sql, params);
    return res.rows;
  } catch (err) {
    console.error('Database query error:', err);
    return null;
  }
}

// JWT Helper
function signToken(user: { id: string | number; email: string; role: string }) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.SESSION_SECRET || 'darb-secret-session-key-dev',
    { expiresIn: '7d' }
  );
}

// Auth Middleware
function requireAuth(req: any, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.darb_session || req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ ok: false, error: 'غير مسجل الدخول' });
    }
    req.user = jwt.verify(token, process.env.SESSION_SECRET || 'darb-secret-session-key-dev');
    next();
  } catch {
    return res.status(401).json({ ok: false, error: 'جلسة غير صالحة أو منتهية' });
  }
}

// Super Administrator Credentials & Access Control Policy
const SUPER_ADMIN_EMAIL = 'thrayanabil@gmail.com';
const SUPER_ADMIN_PASS = 'Tr@7177';

// Registered Members Store (In-Memory + DB Sync)
const registeredMembers: any[] = [
  {
    id: 'admin-thraya',
    email: 'thrayanabil@gmail.com',
    name: 'ثريا نبيل (المشرف العام)',
    avatar_url: '',
    role: 'admin',
    account_type: 'user',
    country_code: 'EG',
    phone: '+20 100 000 7177',
    status: 'active',
    is_verified: true,
    registered_via: 'google',
    created_at: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
  },
  {
    id: 'user-101',
    email: 'ahmed.mansour@gmail.com',
    name: 'أحمد منصور',
    avatar_url: '',
    role: 'user',
    account_type: 'user',
    country_code: 'EG',
    phone: '+20 101 234 5678',
    status: 'active',
    is_verified: true,
    registered_via: 'google',
    created_at: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
  },
  {
    id: 'comp-102',
    email: 'careers@arabtech.com',
    name: 'شركة التقنية العربية المحدودة',
    avatar_url: '',
    role: 'user',
    account_type: 'company',
    country_code: 'AE',
    phone: '+971 4 333 4455',
    status: 'active',
    is_verified: true,
    registered_via: 'google',
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
  },
  {
    id: 'law-103',
    email: 'legal.riad@law-consult.sa',
    name: 'المحامي رياض بن سالم',
    avatar_url: '',
    role: 'user',
    account_type: 'lawyer',
    country_code: 'SA',
    phone: '+966 11 222 3344',
    status: 'active',
    is_verified: true,
    registered_via: 'google',
    created_at: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
  },
  {
    id: 'rec-104',
    email: 'talent@gulfcareers.qa',
    name: 'وكالة الخليج للتوظيف والفرص',
    avatar_url: '',
    role: 'user',
    account_type: 'recruiter',
    country_code: 'QA',
    phone: '+974 44 55 6677',
    status: 'active',
    is_verified: true,
    registered_via: 'google',
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
  {
    id: 'serv-105',
    email: 'contact@darb-relocation.eg',
    name: 'مكتب النيل لخدمات الإقامة والترجمة',
    avatar_url: '',
    role: 'user',
    account_type: 'service_provider',
    country_code: 'EG',
    phone: '+20 102 999 8877',
    status: 'active',
    is_verified: true,
    registered_via: 'google',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  }
];

// Admin Middleware - Strict lock for authorized admin only
function requireAdmin(req: any, res: Response, next: NextFunction) {
  const user = req.user;
  const isSuperAdmin = user && (user.role === 'admin' || user.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
  if (!isSuperAdmin) {
    return res.status(403).json({ 
      ok: false, 
      error: 'لوحة التحكم مغلقة ومحمية: الوصول مقتصر حصراً على المشرف المعتمد (thrayanabil@gmail.com)' 
    });
  }
  next();
}

// Optional Auth Middleware (for guests & logged-in users)
function optionalAuth(req: any, _res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.darb_session || req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      req.user = jwt.verify(token, process.env.SESSION_SECRET || 'darb-secret-session-key-dev');
    }
  } catch {}
  next();
}

async function startServer() {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());

  const authSessions = new Map<string, number>();

  // ===================== API ROUTES =====================

  // Health Check
  app.get('/api/health', async (_req: Request, res: Response) => {
    let dbConnected = false;
    if (pool) {
      try {
        const rows = await queryDb('SELECT 1 as ok');
        dbConnected = !!rows && rows.length > 0;
      } catch {
        dbConnected = false;
      }
    }
    res.json({
      ok: true,
      database: dbConnected,
      mode: dbConnected ? 'PostgreSQL Production' : 'Memory / Demo Mode',
      version: 'DARB Full V1.15 — AI Quality Governance',
      default_country: 'EG',
      logo: '/darb-logo.svg',
      hero_image: '/darb-hero-clean.png',
      timestamp: new Date().toISOString(),
    });
  });

  // Overview Stats
  app.get('/api/stats', async (_req: Request, res: Response) => {
    res.json({
      ok: true,
      data: {
        countries_count: demoData.countries.length,
        cities_count: demoData.cities.length,
        jobs_count: demoData.jobs.length,
        services_count: demoData.services.length,
        ads_count: demoData.ads.length,
      },
    });
  });

  // Countries (Egypt first, then rest of countries)
  app.get('/api/countries', async (_req: Request, res: Response) => {
    const dbCountries = await queryDb(
      "SELECT * FROM countries WHERE active=true ORDER BY CASE WHEN code='EG' THEN 0 ELSE 1 END, name_ar"
    );
    const sortedDemo = [...demoData.countries].sort((a, b) => {
      if (a.code === 'EG') return -1;
      if (b.code === 'EG') return 1;
      return a.name_ar.localeCompare(b.name_ar, 'ar');
    });
    res.json({ ok: true, data: dbCountries || sortedDemo });
  });

  // Cities by country code
  app.get('/api/cities/:country', async (req: Request, res: Response) => {
    const code = req.params.country?.toUpperCase();
    const dbCities = await queryDb(
      `SELECT c.*, r.name_ar as region_name 
       FROM cities c 
       LEFT JOIN regions r ON r.id=c.region_id 
       JOIN countries co ON co.id=c.country_id 
       WHERE co.code=$1 AND c.active=true 
       ORDER BY c.name_ar`,
      [code]
    );
    if (dbCities && dbCities.length > 0) {
      return res.json({ ok: true, data: dbCities });
    }
    const filtered = demoData.cities.filter((c) => c.country_code === code);
    res.json({ ok: true, data: filtered });
  });

  // All Cities
  app.get('/api/cities', async (_req: Request, res: Response) => {
    const dbCities = await queryDb(
      `SELECT c.*, r.name_ar as region_name, co.name_ar as country_name, co.code as country_code 
       FROM cities c 
       LEFT JOIN regions r ON r.id=c.region_id 
       LEFT JOIN countries co ON co.id=c.country_id 
       WHERE c.active=true 
       ORDER BY c.name_ar`
    );
    res.json({ ok: true, data: dbCities || demoData.cities });
  });

  // Jobs
  app.get('/api/jobs', async (req: Request, res: Response) => {
    const { country, search } = req.query;
    const dbJobs = await queryDb(
      `SELECT j.*, co.name_ar as company_name, ci.name_ar as city_name 
       FROM jobs j 
       LEFT JOIN companies co ON co.id=j.company_id 
       LEFT JOIN cities ci ON ci.id=j.city_id 
       WHERE j.active=true 
       ORDER BY j.featured_until DESC NULLS LAST, j.created_at DESC`
    );

    let jobs = dbJobs || demoData.jobs;
    if (country) {
      jobs = jobs.filter((j: any) => j.country_code === country);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      jobs = jobs.filter(
        (j: any) =>
          j.title?.toLowerCase().includes(q) ||
          j.description?.toLowerCase().includes(q) ||
          j.company_name?.toLowerCase().includes(q) ||
          j.city_name?.toLowerCase().includes(q)
      );
    }
    res.json({ ok: true, data: jobs });
  });

  // Global in-memory demo user state for session persistence
  const currentDemoUser = {
    id: 'demo-user-1',
    email: 'user@darb.platform',
    name: 'مستخدم دَرْب',
    avatar_url: '',
    role: 'user' as 'user' | 'admin',
    phone: '+20 100 000 0000',
    bio: 'مغترب وباحث عن فرص عمل واستقرار عبر منصة دَرْب.',
    account_type: 'user',
    is_verified: true,
  };

  // Post Job (V1.7 Core)
  app.post('/api/jobs', async (req: Request, res: Response) => {
    const { 
      title, 
      description, 
      company_name, 
      city_name, 
      country_code, 
      country_id,
      city_id,
      salary_min, 
      salary_max, 
      currency 
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ ok: false, error: 'عنوان الوصف الوظيفي والتفاصيل مطلوبان' });
    }

    // Insert into DB if available
    let dbJob = null;
    try {
      dbJob = await queryDb(
        `INSERT INTO jobs(title, description, salary_min, salary_max, currency, active)
         VALUES($1, $2, $3, $4, $5, true)
         RETURNING *`,
        [title, description, salary_min ? Number(salary_min) : null, salary_max ? Number(salary_max) : null, currency || 'USD']
      );
    } catch {}

    const newJob = {
      id: dbJob?.[0]?.id || Date.now(),
      title,
      description,
      company_name: company_name || 'شركة معلنة في دَرْب',
      city_name: city_name || 'كل المدن',
      country_code: country_code || (country_id ? String(country_id) : 'EG'),
      country_id,
      city_id,
      salary_min: salary_min ? Number(salary_min) : null,
      salary_max: salary_max ? Number(salary_max) : null,
      currency: currency || 'USD',
      featured: false,
      created_at: new Date().toISOString(),
    };

    demoData.jobs.unshift(newJob);
    res.json({ ok: true, data: newJob, message: 'تم إرسال الوظيفة للمراجعة والنشر بنجاح' });
  });

  // Services
  app.get('/api/services', async (req: Request, res: Response) => {
    const { category, search } = req.query;
    const dbServices = await queryDb(
      `SELECT s.*, ci.name_ar as city_name 
       FROM services s 
       LEFT JOIN cities ci ON ci.id=s.city_id 
       WHERE s.active=true 
       ORDER BY s.featured_until DESC NULLS LAST, s.created_at DESC`
    );

    let services = dbServices || demoData.services;
    if (category) {
      services = services.filter((s: any) => s.category === category);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      services = services.filter(
        (s: any) =>
          s.name_ar?.toLowerCase().includes(q) ||
          s.description_ar?.toLowerCase().includes(q) ||
          s.city_name?.toLowerCase().includes(q)
      );
    }
    res.json({ ok: true, data: services });
  });

  // Post Service (V1.7 Core)
  app.post('/api/services', async (req: Request, res: Response) => {
    const { 
      name_ar, 
      title, 
      description_ar, 
      description, 
      category, 
      city_name, 
      country_code,
      country_id,
      city_id 
    } = req.body;

    const actualName = name_ar || title;
    const actualDesc = description_ar || description;

    if (!actualName || !actualDesc) {
      return res.status(400).json({ ok: false, error: 'اسم الخدمة وتفاصيلها مطلوبة' });
    }

    // Insert into DB if available
    let dbService = null;
    try {
      dbService = await queryDb(
        `INSERT INTO services(name_ar, description_ar, category, active)
         VALUES($1, $2, $3, true)
         RETURNING *`,
        [actualName, actualDesc, category || 'خدمات عامة']
      );
    } catch {}

    const newService = {
      id: dbService?.[0]?.id || Date.now(),
      name_ar: actualName,
      description_ar: actualDesc,
      category: category || 'خدمات عامة',
      city_name: city_name || 'كل المدن',
      country_code: country_code || (country_id ? String(country_id) : 'EG'),
      country_id,
      city_id,
      featured: false,
      created_at: new Date().toISOString(),
    };

    demoData.services.unshift(newService);
    res.json({ ok: true, data: newService, message: 'تم إرسال الخدمة للمراجعة والنشر بنجاح' });
  });

  // Ads
  app.get('/api/ads', async (_req: Request, res: Response) => {
    const dbAds = await queryDb("SELECT * FROM ads WHERE status='published' ORDER BY ends_at DESC NULLS LAST, created_at DESC");
    res.json({ ok: true, data: dbAds || demoData.ads });
  });

  // Post Ad (V1.7 Core: Free, Featured, Pro)
  app.post('/api/ads', async (req: Request, res: Response) => {
    const { 
      title, 
      description, 
      category, 
      plan = 'free',
      country_id,
      city_id,
      country_code,
      city_name 
    } = req.body;

    if (!title) {
      return res.status(400).json({ ok: false, error: 'عنوان الإعلان مطلوب' });
    }

    // Insert into DB if available
    let dbAd = null;
    try {
      dbAd = await queryDb(
        `INSERT INTO ads(title, description, category, plan, status)
         VALUES($1, $2, $3, $4, 'published')
         RETURNING *`,
        [title, description || null, category || 'عام', plan]
      );
    } catch {}

    const newAd = {
      id: dbAd?.[0]?.id || Date.now(),
      title,
      description: description || '',
      category: category || 'عام',
      plan, // 'free' | 'featured' | 'pro'
      country_id,
      city_id,
      country_code: country_code || (country_id ? String(country_id) : 'EG'),
      city_name: city_name || 'كل المدن',
      status: 'published',
      views: 1,
      clicks: 0,
      created_at: new Date().toISOString(),
    };

    demoData.ads.unshift(newAd);
    res.json({ ok: true, data: newAd, message: 'تم نشر الإعلان بنجاح في منصة دَرْب' });
  });

  // Google OAuth flow
  app.get('/auth/google', (_req: Request, res: Response) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REDIRECT_URI) {
      // Demo login option when Google OAuth credentials are not yet configured
      res.cookie('darb_session', signToken(currentDemoUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 864e5,
      });
      return res.redirect('/?login=success');
    }

    const state = crypto.randomBytes(24).toString('hex');
    authSessions.set(state, Date.now());

    const u = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    u.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID);
    u.searchParams.set('redirect_uri', process.env.GOOGLE_REDIRECT_URI);
    u.searchParams.set('response_type', 'code');
    u.searchParams.set('scope', 'openid email profile');
    u.searchParams.set('state', state);
    res.redirect(u.toString());
  });

  app.get('/auth/google/callback', async (req: Request, res: Response) => {
    try {
      const { code, state } = req.query;
      if (!code || !state || !authSessions.has(state as string)) {
        return res.status(400).send('طلب تسجيل غير صالح');
      }
      authSessions.delete(state as string);

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: code as string,
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          redirect_uri: process.env.GOOGLE_REDIRECT_URI || '',
          grant_type: 'authorization_code',
        }),
      });

      const tok: any = await tokenRes.json();
      if (!tok.id_token) return res.status(401).send('تعذر التحقق من Google');

      const info = JSON.parse(Buffer.from(tok.id_token.split('.')[1], 'base64url').toString());
      if (!info.email_verified) return res.status(403).send('البريد غير موثق في Google');

      const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((x) => x.trim().toLowerCase());
      const role = adminEmails.includes(info.email.toLowerCase()) ? 'admin' : 'user';

      let dbUser: any = null;
      try {
        const rows = await queryDb('SELECT * FROM users WHERE google_sub=$1', [info.sub]);
        if (rows && rows.length > 0) {
          dbUser = rows[0];
        } else {
          const inserted = await queryDb(
            `INSERT INTO users(email, name, avatar_url, google_sub, role, is_verified, account_type) 
             VALUES($1, $2, $3, $4, $5, true, 'user') 
             RETURNING *`,
            [info.email, info.name || info.email, info.picture || null, info.sub, role]
          );
          dbUser = inserted?.[0];
        }
      } catch {}

      const user = dbUser || {
        id: info.sub,
        email: info.email,
        name: info.name || info.email,
        avatar_url: info.picture || null,
        role,
        account_type: 'user',
        is_verified: true,
      };

      currentDemoUser.id = user.id;
      currentDemoUser.email = user.email;
      currentDemoUser.name = user.name;
      currentDemoUser.avatar_url = user.avatar_url;
      currentDemoUser.role = user.role;

      res.cookie('darb_session', signToken(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 864e5,
      });

      res.redirect(process.env.APP_URL || '/');
    } catch (e: any) {
      res.status(500).send('خطأ في تسجيل Google: ' + e.message);
    }
  });

  app.post('/api/auth/logout', (_req: Request, res: Response) => {
    res.clearCookie('darb_session');
    res.json({ ok: true });
  });

  // Google Single Sign-On / Member Registration endpoint (Login ONLY through Google)
  app.post('/api/auth/google-login', async (req: Request, res: Response) => {
    try {
      const { email, name, avatar_url } = req.body;
      if (!email) {
        return res.status(400).json({ ok: false, error: 'البريد الإلكتروني لحساب Google مطلوب' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const isSuperAdmin = normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase();
      const role = isSuperAdmin ? 'admin' : 'user';

      // Find or create member in registeredMembers
      let member = registeredMembers.find((m) => m.email.toLowerCase() === normalizedEmail);
      if (!member) {
        member = {
          id: 'user-' + Date.now(),
          email: normalizedEmail,
          name: name || (isSuperAdmin ? 'ثريا نبيل (المشرف العام)' : normalizedEmail.split('@')[0]),
          avatar_url: avatar_url || '',
          role: role,
          account_type: 'user',
          country_code: 'EG',
          phone: isSuperAdmin ? '+20 100 000 7177' : '',
          status: 'active',
          is_verified: true,
          registered_via: 'google',
          created_at: new Date().toISOString(),
        };
        registeredMembers.unshift(member);
      } else if (isSuperAdmin) {
        member.role = 'admin';
      }

      const userObj = {
        id: member.id,
        email: member.email,
        name: member.name,
        role: member.role,
        account_type: member.account_type,
        avatar_url: member.avatar_url,
        phone: member.phone,
        is_verified: member.is_verified,
      };

      res.cookie('darb_session', signToken(userObj), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 864e5,
      });

      res.json({
        ok: true,
        success: true,
        user: userObj,
        message: isSuperAdmin 
          ? 'مرحباً بكِ في لوحة الإدارة العليا لمنصة دَرْب' 
          : 'تم تسجيل الدخول بنجاح عبر حساب Google المعتمد',
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: 'تعذر تسجيل الدخول عبر Google: ' + err.message });
    }
  });

  // Admin Verification Gate (thrayanabil@gmail.com / Tr@7177)
  app.post('/api/auth/admin-login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const normalizedEmail = (email || '').trim().toLowerCase();

      if (normalizedEmail !== SUPER_ADMIN_EMAIL.toLowerCase() || password !== SUPER_ADMIN_PASS) {
        return res.status(401).json({
          ok: false,
          error: 'بيانات اعتماد المشرف غير صحيحة. تم حظر الدخول للوحة التحكم.',
        });
      }

      const adminMember = registeredMembers.find((m) => m.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) || {
        id: 'admin-thraya',
        email: SUPER_ADMIN_EMAIL,
        name: 'ثريا نبيل (المشرف العام)',
        role: 'admin',
        account_type: 'user',
        status: 'active',
        is_verified: true,
      };

      const userObj = {
        id: adminMember.id,
        email: adminMember.email,
        name: adminMember.name,
        role: 'admin' as const,
        account_type: 'user' as const,
        is_verified: true,
      };

      res.cookie('darb_session', signToken(userObj), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 864e5,
      });

      res.json({
        ok: true,
        success: true,
        user: userObj,
        message: 'تم التحقق بنجاح والفتح الفوري لصلاحيات المشرف العام الكاملة.',
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // V1.7 Core: Get Current User Profile
  app.get('/api/me', async (req: Request, res: Response) => {
    try {
      const token = req.cookies?.darb_session || req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.json({ ok: true, user: null });
      }
      const decoded = jwt.verify(token, process.env.SESSION_SECRET || 'darb-secret-session-key-dev') as any;
      const sub = decoded.id || decoded.sub;

      let dbUser: any = null;
      if (sub) {
        try {
          const rows = await queryDb(
            'SELECT id, email, name, avatar_url, role, phone, bio, account_type, country_id, city_id, is_verified FROM users WHERE id=$1',
            [sub]
          );
          if (rows && rows.length > 0) dbUser = rows[0];
        } catch {}
      }

      let mergedUser = dbUser || { ...decoded };
      const normalizedEmail = (mergedUser.email || decoded.email || '').toLowerCase();
      
      // Check in registeredMembers
      const foundMember = registeredMembers.find((m) => m.email.toLowerCase() === normalizedEmail);
      if (foundMember) {
        mergedUser = { ...mergedUser, ...foundMember };
      }

      if (normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
        mergedUser.role = 'admin';
        mergedUser.email = SUPER_ADMIN_EMAIL;
        mergedUser.is_verified = true;
      }

      res.json({ ok: true, user: mergedUser });
    } catch {
      res.json({ ok: true, user: null });
    }
  });

  // V1.7 Core: Update User Profile (PATCH /api/me)
  app.patch('/api/me', async (req: Request, res: Response) => {
    const { name, phone, bio, account_type } = req.body;

    let sub: string | null = null;
    try {
      const token = req.cookies?.darb_session || req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET || 'darb-secret-session-key-dev') as any;
        sub = decoded.id || decoded.sub;
      }
    } catch {}

    let dbUpdated: any = null;
    if (sub) {
      try {
        const rows = await queryDb(
          `UPDATE users 
           SET name=COALESCE($1, name), 
               phone=$2, 
               bio=$3, 
               account_type=COALESCE($4, account_type), 
               updated_at=NOW() 
           WHERE id=$5 
           RETURNING id, email, name, avatar_url, role, phone, bio, account_type, country_id, city_id, is_verified`,
          [name, phone || null, bio || null, account_type || 'user', sub]
        );
        if (rows && rows.length > 0) dbUpdated = rows[0];
      } catch {}
    }

    if (name !== undefined) currentDemoUser.name = name;
    if (phone !== undefined) currentDemoUser.phone = phone;
    if (bio !== undefined) currentDemoUser.bio = bio;
    if (account_type !== undefined) currentDemoUser.account_type = account_type;

    const finalUser = dbUpdated || {
      ...currentDemoUser,
      ...(sub ? { id: sub } : {}),
    };

    res.json({
      ok: true,
      user: finalUser,
      message: 'تم حفظ الملف الشخصي بنجاح',
    });
  });

  // Community Questions (Ask a Local)
  app.get('/api/community/questions', async (_req: Request, res: Response) => {
    const dbQuestions = await queryDb(
      `SELECT q.*, co.name_ar as country_name, ci.name_ar as city_name 
       FROM community_questions q 
       LEFT JOIN countries co ON co.id=q.country_id 
       LEFT JOIN cities ci ON ci.id=q.city_id 
       WHERE q.status='published' 
       ORDER BY q.created_at DESC LIMIT 50`
    );
    res.json({ ok: true, data: dbQuestions || demoData.questions });
  });

  app.post('/api/community/questions', async (req: Request, res: Response) => {
    const { title, body, country_name, city_name } = req.body;
    if (!title || !body) {
      return res.status(400).json({ ok: false, error: 'السؤال وتفاصيله مطلوبان' });
    }

    const newQuestion = {
      id: Date.now(),
      title,
      body,
      country_name: country_name || 'عام',
      city_name: city_name || 'كل المدن',
      status: 'published',
      views: 1,
      created_at: new Date().toISOString(),
    };

    demoData.questions.unshift(newQuestion);
    res.json({ ok: true, data: newQuestion, message: 'تم نشر السؤال في مجتمع دَرْب' });
  });

  // Service Reviews
  app.get('/api/reviews', async (_req: Request, res: Response) => {
    const dbReviews = await queryDb("SELECT * FROM service_reviews WHERE status='published' ORDER BY created_at DESC LIMIT 50");
    res.json({ ok: true, data: dbReviews || demoData.reviews });
  });

  app.post('/api/reviews', async (req: Request, res: Response) => {
    const { service_id, rating, comment } = req.body;
    if (!service_id || !rating) {
      return res.status(400).json({ ok: false, error: 'الخدمة والتقييم مطلوبان' });
    }

    const newReview = {
      id: Date.now(),
      service_id: Number(service_id),
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment: comment || '',
      status: 'published',
      created_at: new Date().toISOString(),
    };

    demoData.reviews.unshift(newReview);
    res.json({ ok: true, data: newReview, message: 'تمت إضافة المراجعة بنجاح' });
  });

  // Job Alerts
  app.get('/api/alerts/types', (_req: Request, res: Response) => {
    res.json({
      ok: true,
      data: [
        { code: 'email', name_ar: 'البريد الإلكتروني' },
        { code: 'telegram', name_ar: 'تيليجرام' },
      ],
    });
  });

  app.post('/api/job-alerts', async (req: Request, res: Response) => {
    const { keyword, channel = 'email' } = req.body;
    const newAlert = {
      id: Date.now(),
      keyword: keyword || 'جميع الوظائف',
      channel,
      active: true,
      created_at: new Date().toISOString(),
    };
    demoData.jobAlerts.unshift(newAlert);
    res.json({ ok: true, data: newAlert, message: 'تم تفعيل تنبيه الوظائف بنجاح' });
  });

  // ===================== ADMIN MEMBERS MANAGEMENT (Strictly Protected) =====================
  app.get('/api/admin/members', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
    res.json({
      ok: true,
      data: registeredMembers,
      stats: {
        total: registeredMembers.length,
        active: registeredMembers.filter((m) => m.status === 'active').length,
        suspended: registeredMembers.filter((m) => m.status === 'suspended').length,
        admins: registeredMembers.filter((m) => m.role === 'admin' || m.role === 'supervisor').length,
        verified: registeredMembers.filter((m) => m.is_verified).length,
      }
    });
  });

  app.post('/api/admin/members', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    const { name, email, role = 'user', account_type = 'user', phone, country_code } = req.body;
    if (!name || !email) {
      return res.status(400).json({ ok: false, error: 'الاسم الكامل والبريد الإلكتروني مطلوبان' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = registeredMembers.find((m) => m.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(409).json({ ok: false, error: 'هذا البريد الإلكتروني مسجل بالفعل كعضو في المنصة' });
    }

    const newMember = {
      id: 'member-' + Date.now(),
      email: normalizedEmail,
      name: name.trim(),
      avatar_url: '',
      role: role || 'user',
      account_type: account_type || 'user',
      country_code: country_code || 'EG',
      phone: phone || '',
      status: 'active',
      is_verified: true,
      registered_via: 'admin_invite',
      created_at: new Date().toISOString(),
    };

    registeredMembers.unshift(newMember);
    res.json({
      ok: true,
      data: newMember,
      message: `تم تسجيل وتفعيل حساب العضو (${newMember.name}) بنجاح`,
    });
  });

  app.patch('/api/admin/members/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    const id = req.params.id;
    const { status, role, is_verified, account_type } = req.body;

    const member = registeredMembers.find((m) => String(m.id) === String(id));
    if (!member) {
      return res.status(404).json({ ok: false, error: 'العضو غير موجود' });
    }

    if (member.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      if (status === 'suspended' || role === 'user') {
        return res.status(400).json({ ok: false, error: 'لا يمكن إيقاف أو تخفيض رتبة المشرف العام الأساسي' });
      }
    }

    if (status !== undefined) member.status = status;
    if (role !== undefined) member.role = role;
    if (is_verified !== undefined) member.is_verified = !!is_verified;
    if (account_type !== undefined) member.account_type = account_type;

    res.json({ ok: true, data: member, message: 'تم تحديث بيانات العضو بنجاح' });
  });

  app.delete('/api/admin/members/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    const id = req.params.id;
    const idx = registeredMembers.findIndex((m) => String(m.id) === String(id));
    if (idx === -1) {
      return res.status(404).json({ ok: false, error: 'العضو غير موجود' });
    }

    if (registeredMembers[idx].email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return res.status(400).json({ ok: false, error: 'محظور تماماً حذف حساب المشرف العام' });
    }

    const removed = registeredMembers.splice(idx, 1)[0];
    res.json({ ok: true, message: `تم حذف العضو ${removed.name} بنجاح` });
  });

  // Admin APIs: Community Moderation (Locked for Public/Trial)
  app.get('/api/admin/community', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
    const dbQuestions = await queryDb('SELECT * FROM community_questions ORDER BY created_at DESC LIMIT 100');
    const dbReviews = await queryDb('SELECT * FROM service_reviews ORDER BY created_at DESC LIMIT 100');
    res.json({
      ok: true,
      questions: dbQuestions || demoData.questions,
      reviews: dbReviews || demoData.reviews,
    });
  });

  // Admin APIs: Payment Providers (Locked for Public/Trial)
  app.get('/api/admin/payment-providers', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
    const dbProviders = await queryDb('SELECT id, code, name_ar, enabled FROM payment_providers ORDER BY id');
    res.json({ ok: true, data: dbProviders || demoData.paymentProviders });
  });

  app.patch('/api/admin/payment-providers/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { enabled } = req.body;
    const provider = demoData.paymentProviders.find((p) => p.id === id);
    if (provider) {
      provider.enabled = !!enabled;
    }
    await queryDb('UPDATE payment_providers SET enabled=$1 WHERE id=$2', [!!enabled, id]);
    res.json({ ok: true, data: provider, message: 'تم تحديث حالة مزود الدفع' });
  });

  // Admin APIs: Plans (Locked for Public/Trial)
  app.get('/api/admin/plans', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
    const dbPlans = await queryDb('SELECT * FROM plans ORDER BY id');
    res.json({ ok: true, data: dbPlans || demoData.plans });
  });

  app.patch('/api/admin/plans/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { price, active, duration_days } = req.body;
    const plan = demoData.plans.find((p) => p.id === id);
    if (plan) {
      if (price !== undefined) plan.price = Number(price);
      if (active !== undefined) plan.active = !!active;
      if (duration_days !== undefined) plan.duration_days = Number(duration_days);
    }
    await queryDb(
      'UPDATE plans SET price=COALESCE($1, price), active=COALESCE($2, active), duration_days=COALESCE($3, duration_days) WHERE id=$4',
      [price, active, duration_days, id]
    );
    res.json({ ok: true, data: plan, message: 'تم تحديث الباقة بنجاح' });
  });

  // Admin APIs: Reports (Locked for Public/Trial)
  app.get('/api/admin/reports', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
    const dbReports = await queryDb('SELECT * FROM reports ORDER BY created_at DESC LIMIT 100');
    res.json({ ok: true, data: dbReports || demoData.reports });
  });

  // ===================== DARB AI V1.10 CORE & V1.11 ADMIN ENGINE =====================
  registerDarbAIRoutes(app, {
    pool,
    auth: requireAuth,
    optionalAuth,
  });

  const checkIsAdmin = async (req: Request): Promise<boolean> => {
    const customReq = req as any;
    if (customReq.user?.role === 'admin' || customReq.user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) return true;
    const token = customReq.cookies?.darb_session || customReq.headers?.authorization?.replace('Bearer ', '');
    if (!token) {
      return false; // STRICT LOCK: Public and trial visitors are blocked
    }
    try {
      const decoded: any = jwt.verify(token, process.env.SESSION_SECRET || 'darb-secret-session-key-dev');
      return decoded?.role === 'admin' || decoded?.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
    } catch {
      return false; // STRICT LOCK
    }
  };

  registerDarbAIAdminRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB AI V1.12 & V1.13 WEB SEARCH =====================
  registerDarbAIWebSearchRoutes(app, pool);

  // ===================== DARB AI V1.14 ANSWER ENGINE =====================
  registerDarbAIAnswerRoutes(app, pool);

  // ===================== DARB AI V1.15 QUALITY GOVERNANCE =====================
  registerDarbAIQualityRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB AI V1.16 MONITORING & FRESHNESS =====================
  registerDarbAIMonitoringRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB AI V1.17 AI LEARNING & KNOWLEDGE EVOLUTION =====================
  registerDarbAILearningRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB AI V1.18 AI ORCHESTRATOR =====================
  registerDarbAIOrchestratorRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB AI V1.19 AI SECURITY & COST GUARD =====================
  registerDarbAISecurityRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB AI V1.20 AI PRODUCTION RESILIENCE & PRIVACY GUARD =====================
  registerDarbAIResilienceRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB AI V1.21 AI EVALUATION & AUTOMATED TEST LAB =====================
  registerDarbAIEvaluationRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB AI V1.22 AI KNOWLEDGE QUALITY & REFRESH MANAGER =====================
  registerDarbAIKnowledgeRefreshRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB AI V1.23 AI EVALUATION INTEGRATED RUNNER =====================
  registerDarbAIEvaluationRunnerRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB AI V1.24 AI REGRESSION & RELEASE GATE =====================
  registerDarbAIRegressionGateRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB AI V1.25 AI RELEASE & VERSION MANAGER =====================
  registerDarbAIReleaseVersionRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB AI V1.26 AI DEPLOYMENT & ENVIRONMENT MANAGER =====================
  registerDarbAIDeploymentEnvironmentRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB AI V1.27 AI OBSERVABILITY & SLO MANAGER =====================
  registerDarbAIObservabilitySloRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB AI V1.28 AI INCIDENT & RECOVERY MANAGER =====================
  registerDarbAiIncidentRecoveryRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB AI V1.29 AI CAPACITY & COST GOVERNANCE =====================
  registerDarbAiCapacityCostRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB AI V1.30 AI OPTIMIZATION GOVERNANCE =====================
  registerDarbAiOptimizationRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB AI V1.30 FINAL PRODUCTION AUDIT PACK =====================
  registerDarbAIProductionAuditRoutes(app, {
    pool,
    isAdmin: checkIsAdmin,
  });

  // ===================== DARB GLOBAL KNOWLEDGE ENGINE V1 & V1.1 =====================
  registerDarbGlobalKnowledgeRoutes(app);
  registerCountryProfileRoutes(app, demoData, queryDb);
  if (pool) {
    DarbGlobalKnowledgeEngine.initDatabase(pool).then(res => {
      console.log(`[DARB GKE V1.1] Database sync: ${res.message}`);
    }).catch(err => {
      console.warn(`[DARB GKE V1.1] Database sync warning:`, err?.message);
    });
  }

  // GET /api/ai/knowledge
  app.get('/api/ai/knowledge', async (_req: Request, res: Response) => {
    const dbKnowledge = await queryDb('SELECT * FROM ai_knowledge WHERE status=$1', ['published']);
    const localEntries = loadKnowledge();
    res.json({
      ok: true,
      version: '1.12',
      data: dbKnowledge && dbKnowledge.length > 0 ? dbKnowledge : localEntries,
    });
  });

  // GET /api/download-project — Download Full Project Archive (Code, Design & Databases)
  app.get('/api/download-project', (_req: Request, res: Response) => {
    const zipPath = path.join(process.cwd(), 'public', 'DARB_ZADTOO_FULL_PROJECT.zip');
    if (fs.existsSync(zipPath)) {
      return res.download(zipPath, 'DARB_ZADTOO_FULL_PROJECT.zip');
    }
    const distZipPath = path.join(process.cwd(), 'dist', 'DARB_ZADTOO_FULL_PROJECT.zip');
    if (fs.existsSync(distZipPath)) {
      return res.download(distZipPath, 'DARB_ZADTOO_FULL_PROJECT.zip');
    }
    return res.status(404).json({ ok: false, error: 'ملف الأرشيف غير موجود حالياً' });
  });

  // ===================== VITE & STATIC HANDLING =====================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DARB] Server is running on port ${PORT}`);
  });
}

startServer();
