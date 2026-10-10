export interface Country {
  id: number;
  code: string;
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  active: boolean;
}

export interface City {
  id: number;
  country_code: string;
  name_ar: string;
  name_en?: string;
  region_name?: string;
  description_ar?: string;
  area_km2?: number | string;
  area_description_ar?: string;
  population_approx?: string;
  customs_and_traditions_ar?: string;
  production_and_work_ar?: string;
  famous_industries?: string[];
  historic_architecture_ar?: string;
  famous_landmarks?: string[];
  cost_index?: number;
  internet_score?: number;
  safety_score?: number;
  weather_score?: number;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  company_name: string;
  city_name?: string;
  country_code?: string;
  country_id?: number | string;
  city_id?: number | string;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  featured?: boolean;
  created_at?: string;
}

export interface Service {
  id: number;
  name_ar: string;
  description_ar: string;
  category: string;
  city_name?: string;
  country_code?: string;
  country_id?: number | string;
  city_id?: number | string;
  featured?: boolean;
  created_at?: string;
}

export interface Ad {
  id: number;
  title: string;
  description: string;
  category: string;
  country_id?: number | string;
  city_id?: number | string;
  plan: string;
  status: string;
  views?: number;
  clicks?: number;
  created_at?: string;
}

export interface PaymentProvider {
  id: number;
  code: string;
  name_ar: string;
  enabled: boolean;
}

export interface Plan {
  id: number;
  code: string;
  name_ar: string;
  price: number;
  currency: string;
  duration_days: number;
  active: boolean;
}

export type AccountType = 'user' | 'company' | 'lawyer' | 'recruiter' | 'service_provider';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: 'admin' | 'user';
  phone?: string;
  bio?: string;
  account_type?: AccountType;
  country_id?: number | string;
  city_id?: number | string;
  is_verified?: boolean;
}

export interface MemberRecord {
  id: string | number;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'admin' | 'supervisor' | 'user';
  account_type: AccountType;
  country_code?: string;
  phone?: string;
  status: 'active' | 'suspended';
  is_verified: boolean;
  registered_via: 'google' | 'admin_invite';
  created_at: string;
}

export interface UserProfile {
  id: string;
  job_title?: string;
  skills?: string;
  preferred_country_id?: number;
  preferred_city_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface HealthStatus {
  ok: boolean;
  database: boolean;
  mode: string;
  version: string;
}

export interface Question {
  id: number;
  title: string;
  body: string;
  country_name?: string;
  city_name?: string;
  status: string;
  views?: number;
  created_at?: string;
}

export interface Review {
  id: number;
  service_id: number;
  rating: number;
  comment?: string;
  status: string;
  created_at?: string;
}

export interface JobAlert {
  id: number;
  keyword?: string;
  channel: string;
  active: boolean;
  created_at?: string;
}

export * from './types/darb-ai-web-result.types';
export * from './types/darb-ai-evaluation';
export * from './types/darb-ai-knowledge-refresh';
export * from './types/darb-ai-evaluation-runner';
export {
  type GateStatus,
  type RegressionThresholds,
  type RegressionComparisonV24,
  type ReleaseGate,
  type RegressionRun
} from './types/darb-ai-regression-gate';
export * from './types/darb-ai-release-version';
export * from './types/darb-gke-v1-1-verification';
export * from './types/country-profile';

