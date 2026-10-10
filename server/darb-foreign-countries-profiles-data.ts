import { CountryProfile } from '../src/types/country-profile';
import { EUROPE_PROFILES } from './darb-foreign-profiles-europe';
import { GLOBAL_REST_PROFILES } from './darb-foreign-profiles-global';
import { WAVE2_FOREIGN_PROFILES } from './darb-foreign-profiles-wave2';

export const COMPREHENSIVE_FOREIGN_COUNTRIES_PROFILES: Record<string, CountryProfile> = {
  ...EUROPE_PROFILES,
  ...GLOBAL_REST_PROFILES,
  ...WAVE2_FOREIGN_PROFILES
};

export const FOREIGN_COUNTRIES_LIST = Object.values(COMPREHENSIVE_FOREIGN_COUNTRIES_PROFILES).map((p) => ({
  code: p.country_code,
  name_ar: p.name_ar,
  name_en: p.name_en,
  description_ar: p.description_ar,
  active: true,
  continent: ['TR', 'GB', 'DE', 'FR', 'IT', 'ES', 'CH', 'AT', 'NL', 'GE', 'BA', 'CZ', 'HU', 'GR', 'PT', 'RU', 'NO'].includes(p.country_code)
    ? 'EUROPE'
    : ['US', 'CA', 'BR'].includes(p.country_code)
    ? 'AMERICAS'
    : ['MY', 'TH', 'ID', 'SG', 'JP', 'KR', 'CN', 'AU', 'MV', 'AZ', 'UZ', 'LK', 'KZ', 'VN', 'NZ'].includes(p.country_code)
    ? 'ASIA'
    : 'AFRICA'
}));
