import { GULF_CITIES, CityRecord } from './cities-data-gulf';
import { MASHREQ_CITIES } from './cities-data-mashreq';
import { MAGHREB_CITIES } from './cities-data-maghreb';
import { NILE_HORN_CITIES } from './cities-data-nile-horn';
import { FOREIGN_CITIES } from './cities-data-foreign';
import { FOREIGN_CITIES_WAVE2 } from './cities-data-foreign-wave2';

export type { CityRecord };

export const ALL_ARAB_CITIES: CityRecord[] = [
  ...GULF_CITIES,
  ...MASHREQ_CITIES,
  ...MAGHREB_CITIES,
  ...NILE_HORN_CITIES
];

export const ALL_CITIES: CityRecord[] = [
  ...ALL_ARAB_CITIES,
  ...FOREIGN_CITIES,
  ...FOREIGN_CITIES_WAVE2
];

export function getCitiesByCountryCode(countryCode: string): CityRecord[] {
  const upper = countryCode?.toUpperCase();
  return ALL_CITIES.filter((c) => c.country_code === upper);
}

export function getCityById(id: number): CityRecord | undefined {
  return ALL_CITIES.find((c) => c.id === id);
}
