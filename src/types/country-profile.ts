export interface CountryLandmark {
  name_ar: string;
  type: string;
  description_ar: string;
}

export interface CountryOuting {
  id: string;
  name_ar: string;
  city_name: string;
  category: 'parks' | 'promenades' | 'historical' | 'culture_museums' | 'entertainment' | 'markets_food' | 'nature_beaches';
  category_label: string;
  description_ar: string;
  highlights?: string[];
  image_url: string;
  opening_hours: {
    days_ar: string;
    hours_ar: string;
    notes_ar?: string;
  };
  entry_tickets: {
    citizen_price_ar: string;
    foreigner_tourist_price_ar: string;
    free_entry?: boolean;
    ticket_notes_ar?: string;
  };
  best_time_to_visit?: string;
  location_address?: string;
  metro_or_transport_tip?: string;
  family_friendly: boolean;
  facilities?: string[];
}

export interface CountryVisitingSeason {
  season: string;
  months: string;
  climate_description: string;
  travel_advisory_note: string;
}

export interface CountryAirport {
  name_ar: string;
  code: string;
  city: string;
  international: boolean;
}

export interface CountrySeaport {
  name_ar: string;
  city: string;
}

export interface CountrySecurityAlert {
  level: 'normal' | 'advisory' | 'warning';
  text_ar: string;
  source: string;
  verified_at: string;
}

export interface ProvinceCityItem {
  id?: number;
  name_ar: string;
  name_en?: string;
  is_capital?: boolean;
  population_approx?: string;
  description_ar: string;
  cost_index?: number;
  safety_score?: number;
  internet_score?: number;
  famous_industries?: string[];
  famous_landmarks?: string[];
}

export interface CountryProvinceDetail {
  id: string;
  country_code: string;
  province_name_ar: string;
  province_name_en: string;
  type_label_ar: string; // 'منطقة إدارية' | 'محافظة' | 'إمارة' | 'ولاية' | 'جهة' | 'مقاطعة' | 'إقليم' | 'ولاية فيدرالية'
  administrative_capital_ar: string;
  area_km2: number | string;
  population_approx: string;
  geographic_location_ar: string;
  economic_specialization_ar: string;
  famous_landmarks_ar: string[];
  cities_count: number;
  key_cities: ProvinceCityItem[];
}

export interface CountryProfile {
  country_code: string;
  name_ar: string;
  name_en: string;
  capital: string;
  flag: string;
  currency: string;
  currency_symbol: string;
  language: string;
  population: string;
  area_sq_km: string;
  location: string;
  borders: string[];
  seas_and_oceans: string[];
  islands_and_straits?: string[];
  provinces_count: number;
  provinces_label: string;
  provinces_detailed?: CountryProvinceDetail[];
  timezone: string;
  calling_code: string;
  domain_tld: string;
  description_ar: string;

  // Geography & Nature
  terrain: string;
  climate: string;
  natural_resources: string[];

  // Cities
  capital_city: string;
  cities: Array<{
    id: number;
    country_code: string;
    name_ar: string;
    name_en?: string;
    region_name?: string;
    description_ar?: string;
    cost_index?: number;
    internet_score?: number;
    safety_score?: number;
    weather_score?: number;
  }>;

  // Tourism & Travel
  landmarks: CountryLandmark[];
  outings?: CountryOuting[];
  visiting_seasons: CountryVisitingSeason[];
  airports: CountryAirport[];
  seaports: CountrySeaport[];
  travel_security_alert?: CountrySecurityAlert;

  // Economy (Reference Data)
  gdp_reference: string;
  growth_rate_reference: string;
  economic_sectors: string[];
  measurement_year: number | string;
  economic_data_class: 'reference_indicator';
  economic_disclaimer: string;

  // Governance & Provenance
  source_document: string;
  source_file?: string;
  source_fingerprint?: string;
  verified_at?: string;
  reviewer_id?: string;
  confidence?: 'high' | 'medium' | 'limited' | number;
  freshness_status?: 'fresh' | 'aging' | 'stale';
  auto_publish?: boolean;
  publication_status?: 'published' | 'pending_review';

  // Associated Platform Data
  jobs_count?: number;
  services_count?: number;
  recent_jobs?: Array<any>;
  recent_services?: Array<any>;
  gke_facts_count?: number;
}

export interface ArabRegion {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  countries_count: number;
  countries_codes: string[];
  total_area_approx: string;
  countries: Array<{
    country_code: string;
    name_ar: string;
    name_en: string;
    flag: string;
    capital: string;
    area_sq_km: string;
    population: string;
  }>;
  key_features: string[];
}

export interface MacroeconomicOverview {
  total_nominal_gdp_usd: string;
  average_growth_rate: string;
  source_agency: string;
  governance_advisory: string;
  critical_volatility_warning: string;
  gulf_diversification_trends: string;
  categories: {
    oil_and_gas: {
      title_ar: string;
      description_ar: string;
      countries: string[];
    };
    diversified: {
      title_ar: string;
      description_ar: string;
      countries: string[];
    };
    agriculture_mining_services: {
      title_ar: string;
      description_ar: string;
      countries: string[];
    };
  };
  growth_sample_2025: Array<{
    country_code: string;
    name_ar: string;
    flag: string;
    growth_rate: string;
    category: string;
    governance_note?: string;
  }>;
}

export interface CountryRankingItem {
  rank: number;
  country_code: string;
  name_ar: string;
  flag: string;
  numeric_value: number;
  display_value: string;
  unit: string;
  secondary_note?: string;
}

export interface CountryComparisonResult {
  countries: CountryProfile[];
  metrics: {
    area_comparison: Array<{ country_code: string; name_ar: string; flag: string; area: string; numeric_km2: number }>;
    population_comparison: Array<{ country_code: string; name_ar: string; flag: string; population: string }>;
    economy_comparison: Array<{ country_code: string; name_ar: string; flag: string; gdp: string; growth: string; classification: string }>;
    quality_of_life: Array<{ country_code: string; name_ar: string; flag: string; avg_safety: number; avg_internet: number; avg_cost: number }>;
    currency_and_time: Array<{ country_code: string; name_ar: string; flag: string; currency: string; timezone: string; calling_code: string }>;
    seasons: Array<{ country_code: string; name_ar: string; flag: string; best_season: string; best_months: string; advisory: string }>;
  };
  ai_comparison_prompts: string[];
}

// Phase 3: Geospatial Atlas & Spatial Data
export interface StrategicStrait {
  id: string;
  name_ar: string;
  name_en: string;
  associated_countries: string[];
  description_ar: string;
  global_significance_ar: string;
  coordinates: { lat: number; lng: number };
}

export interface StrategicMaritimePort {
  name_ar: string;
  country_code: string;
  country_name_ar: string;
  city: string;
  water_body: string;
  annual_capacity_teu?: string;
  strategic_note: string;
  coordinates: { lat: number; lng: number };
}

export interface StrategicAirportHub {
  iata: string;
  name_ar: string;
  country_code: string;
  city: string;
  annual_passengers_million?: string;
  hub_airlines: string[];
  coordinates: { lat: number; lng: number };
}

export interface PanArabGeospatialAtlas {
  countries_geo: Array<{
    country_code: string;
    name_ar: string;
    name_en: string;
    capital: string;
    flag: string;
    region_id: string;
    coordinates: { lat: number; lng: number };
    area_sq_km: number;
    population_display: string;
    gdp_reference: string;
    calling_code: string;
    currency_symbol: string;
  }>;
  straits: StrategicStrait[];
  seaports: StrategicMaritimePort[];
  airports: StrategicAirportHub[];
}

// Phase 3: Currency & Living Budget
export interface PanArabCurrencyRate {
  currency_code: string;
  currency_symbol: string;
  name_ar: string;
  country_code: string;
  rate_to_usd: number; // 1 USD = X Local Currency
  last_updated: string;
}

export interface PanArabLivingBudgetCalculation {
  origin_country: { country_code: string; name_ar: string; flag: string; currency_symbol: string };
  destination_country: { country_code: string; name_ar: string; flag: string; currency_symbol: string };
  duration_days: number;
  travelers_count: number;
  lifestyle: 'budget' | 'moderate' | 'family' | 'luxury';
  breakdown_destination_currency: {
    accommodation: number;
    food_and_dining: number;
    transportation: number;
    telecom_and_connectivity: number;
    contingency_and_activities: number;
    total: number;
  };
  breakdown_origin_currency: {
    total: number;
  };
  breakdown_usd: {
    total: number;
  };
  exchange_rate_direct: number; // 1 Origin Currency = X Destination Currency
  cost_index_comparison: {
    origin_index: number;
    destination_index: number;
    cost_difference_pct: number; // e.g. +15% more expensive or -20% cheaper
  };
  practical_travel_advice: string[];
}

// Phase 3: Annual Data Updating & Projections
export interface AnnualCountryUpdate {
  country_code: string;
  country_name_ar: string;
  flag: string;
  year: number;
  population_estimate: string;
  nominal_gdp_usd: string;
  growth_rate_pct: string;
  primary_source: string;
  governance_audit_note: string;
  updated_at: string;
}

export interface AnnualSimulationProjection {
  target_year: number;
  projected_total_population_million: number;
  projected_total_gdp_trillion_usd: number;
  assumed_avg_growth_rate_pct: number;
  leading_growth_countries: Array<{ country_code: string; name_ar: string; flag: string; projected_growth: string }>;
  diversification_index_forecast: string;
}

// Phase 4: Pan-Arab Mobility, Visas & Residencies
export type VisaCategoryType = 'visa_free' | 'gcc_national' | 'evisa' | 'visa_on_arrival' | 'embassy_visa';

export interface PanArabResidencyPathway {
  id: string;
  title_ar: string;
  category: 'golden' | 'investor' | 'digital_nomad' | 'skilled' | 'retirement';
  validity_years: string;
  minimum_requirements_ar: string;
  processing_portal: string;
  perks_ar: string[];
}

export interface PanArabVisaSimulatorResult {
  origin_country: {
    country_code: string;
    name_ar: string;
    flag: string;
  };
  destination_country: {
    country_code: string;
    name_ar: string;
    flag: string;
    capital: string;
  };
  visa_category: VisaCategoryType;
  visa_category_label_ar: string;
  max_stay_days: number;
  estimated_fee_usd: number;
  passport_validity_months: number;
  official_portal_name: string;
  official_portal_url: string;
  special_waivers_and_notes: string[];
  residencies_available: PanArabResidencyPathway[];
}

// Phase 4: Free Zones & Special Economic Zones
export interface PanArabFreeZone {
  id: string;
  name_ar: string;
  name_en: string;
  country_code: string;
  country_name_ar: string;
  city: string;
  established_year: number;
  primary_sectors: string[];
  tax_incentives: string[];
  foreign_ownership_pct: number;
  customs_duty_ar: string;
  strategic_features_ar: string;
  coordinates: { lat: number; lng: number };
  website_url?: string;
}

// Phase 4: Pan-Arab Unified Emergency Hotlines
export interface PanArabEmergencyDirectoryItem {
  country_code: string;
  country_name_ar: string;
  flag: string;
  unified_emergency: string;
  police: string;
  ambulance: string;
  civil_defense: string;
  tourist_police?: string;
  traffic_police?: string;
  advisories_and_legal_tips: string[];
}

// Phase 4: Smart Executive Country Dossier
export interface CountryExecutiveDossier {
  country: {
    country_code: string;
    name_ar: string;
    name_en: string;
    flag: string;
    capital: string;
    currency: string;
    currency_symbol: string;
    population: string;
    area_sq_km: string;
    calling_code: string;
    timezone: string;
    domain_tld: string;
  };
  economic_summary: {
    nominal_gdp: string;
    growth_rate: string;
    classification: string;
    key_sectors: string[];
  };
  geopolitical_hubs: {
    straits_count: number;
    seaports: string[];
    airports: string[];
  };
  mobility_overview: {
    visa_types_available: string[];
    official_visa_portal: string;
    golden_visas: boolean;
  };
  free_zones_count: number;
  top_free_zones: string[];
  emergency_numbers: {
    unified: string;
    police: string;
    ambulance: string;
  };
  key_cities_count: number;
  tourism_highlights: string[];
  generated_at: string;
  dossier_fingerprint: string;
}

// ============================================================================
// PHASE 5: TRADE, LOGISTICS, LABOR MARKET & RELOCATION
// ============================================================================

export interface PanArabTradeAgreement {
  id: string;
  name_ar: string;
  name_en: string;
  type: 'multilateral' | 'regional' | 'bilateral';
  member_countries: string[];
  summary_ar: string;
  customs_benefits_ar: string;
  rules_of_origin_pct: number; // e.g. 40%
  official_body_ar: string;
}

export interface PanArabTransitCorridor {
  id: string;
  name_ar: string;
  corridor_type: 'land_border' | 'maritime_ferry' | 'railway_corridor';
  country_a: string;
  country_b: string;
  border_crossing_name_ar: string;
  status_ar: string;
  avg_clearance_hours: string;
  primary_cargo_types: string[];
  operational_notes_ar: string;
}

export interface PanArabLaborSectorDemand {
  id: string;
  title_ar: string;
  category: 'technology' | 'engineering' | 'energy' | 'healthcare' | 'logistics' | 'finance_business';
  top_hiring_countries: string[];
  demand_level: 'very_high' | 'high' | 'growing';
  growth_rate_forecast: string;
  typical_roles: string[];
  required_skills: string[];
  notes_ar: string;
}

export interface PanArabSalaryBenchmark {
  role_title_ar: string;
  category: string;
  salaries_by_country: Record<string, {
    junior_usd: number;
    mid_usd: number;
    senior_usd: number;
    executive_usd: number;
    local_currency_code: string;
    fx_rate_to_usd: number;
  }>;
}

export interface PanArabAttestationGuide {
  country_code: string;
  country_name_ar: string;
  flag: string;
  responsible_authority_ar: string;
  portal_url: string;
  stages: Array<{
    step_num: number;
    title_ar: string;
    description_ar: string;
    estimated_days: string;
    approx_fee_usd: string;
  }>;
  healthcare_specific_notes_ar?: string;
  engineering_specific_notes_ar?: string;
}

export interface PanArabRelocationStep {
  id: string;
  phase_key: 'prep_60' | 'prep_30' | 'arrival_30' | 'settling_90';
  phase_title_ar: string;
  title_ar: string;
  description_ar: string;
  category: 'legal_visas' | 'finance_banking' | 'housing_logistics' | 'family_healthcare';
  priority: 'critical' | 'recommended' | 'optional';
  days_range: string;
}

export interface PanArabRelocationComparisonResult {
  candidate_countries: Array<{
    code: string;
    name_ar: string;
    flag: string;
    capital: string;
    currency: string;
    currency_symbol: string;
    monthly_budget_family_usd: number;
    avg_salary_mid_usd: number;
    viability_ratio: number;
    ease_of_business_index: number; // 0 to 100
    free_zones_count: number;
    healthcare_readiness: string;
    golden_visa_available: boolean;
  }>;
  common_steps: PanArabRelocationStep[];
  ai_recommendation_prompt: string;
}

// ============================================================================
// PHASE 6: SOVEREIGN WEALTH, MEGA-PROJECTS, CLIMATE/ENERGY & DIGITAL AI MATRIX
// ============================================================================

export interface PanArabSovereignFund {
  id: string;
  name_ar: string;
  name_en: string;
  country_code: string;
  country_name_ar: string;
  flag: string;
  aum_billion_usd: number;
  established_year: number;
  mandate_ar: string;
  key_focus_areas: string[];
  notable_investments: string[];
  website: string;
}

export interface PanArabMegaProject {
  id: string;
  name_ar: string;
  name_en: string;
  country_code: string;
  country_name_ar: string;
  flag: string;
  sector: 'smart_cities' | 'tourism_entertainment' | 'infrastructure_logistics' | 'clean_energy' | 'industrial_defense';
  estimated_cost_billion_usd: number;
  target_completion_year: number;
  current_phase_ar: string;
  description_ar: string;
  key_milestones: string[];
  jobs_target: number;
}

export interface PanArabClimateEnergyProfile {
  country_code: string;
  country_name_ar: string;
  flag: string;
  net_zero_target_year: number;
  solar_capacity_mw: number;
  wind_capacity_mw: number;
  green_hydrogen_projects_count: number;
  desalination_capacity_m3_day: string;
  water_stress_level_ar: string;
  food_security_index: number; // 0 to 100
  flagship_projects: string[];
}

export interface PanArabDigitalReadiness {
  country_code: string;
  country_name_ar: string;
  flag: string;
  ai_readiness_index: number; // 0 to 100
  digital_gov_rank_arab: number;
  submarine_cables_count: number;
  sovereign_cloud_ai_initiatives: string[];
  five_g_coverage_pct: number;
}

export interface PanArabDecisionSimulationRequest {
  country_code: string;
  sector: string;
  capital_usd: number;
  risk_tolerance: 'conservative' | 'balanced' | 'aggressive';
}

export interface PanArabDecisionSimulationResponse {
  country_code: string;
  country_name_ar: string;
  flag: string;
  sector_ar: string;
  viability_score: number; // 0 to 100
  projected_roi_pct: string;
  regulatory_clarity_score: number; // 0 to 100
  key_incentives: string[];
  primary_risks: string[];
  sovereign_fund_co_investment_possible: boolean;
  recommended_free_zone: string;
  ai_executive_summary: string;
}

// ============================================================================
// PHASE 8: INDUSTRIAL PARTNERSHIP, CO-INVESTMENT DEALS, FOOD SECURITY & GAFTA RULES OF ORIGIN
// ============================================================================

export interface PanArabIndustrialProject {
  id: string;
  project_name_ar: string;
  sector_ar: string;
  participating_countries: { country_code: string; name_ar: string; flag: string; role_ar: string }[];
  investment_value_usd_million: number;
  expected_annual_output_ar: string;
  value_chain_synergy_ar: string;
  status_ar: 'قيد الإنشاء والتشييد' | 'مرحلة دراسات الجدوى والإغلاق المالي' | 'مرحلة التشغيل التجريبي' | 'قيد التوسعة الاستراتيجية';
  jobs_created: number;
  strategic_impact_ar: string;
}

export interface PanArabCoInvestmentDeal {
  id: string;
  deal_title_ar: string;
  sector_ar: string;
  host_countries: { country_code: string; name_ar: string; flag: string }[];
  target_ticket_size_usd_million: number;
  minimum_check_size_usd_million: number;
  projected_irr_pct: number;
  sovereign_co_investors: string[];
  regulatory_incentives_ar: string[];
  deal_stage: 'مرحلة الاكتتاب المغلق' | 'مرحلة الفحص النافي للجهالة (DD)' | 'مرحلة طرح الأسهم والتمويل المشترك';
  overview_ar: string;
}

export interface PanArabFoodSecurityCommodity {
  commodity_key: string;
  commodity_name_ar: string;
  icon_type: string;
  pan_arab_annual_consumption_million_tons: number;
  pan_arab_self_sufficiency_pct: number;
  average_strategic_reserve_months: number;
  leading_producing_countries: { country_code: string; name_ar: string; flag: string; share_pct: number }[];
  strategic_joint_initiatives: string[];
  risk_status: 'آمن ومستقر' | 'استقرار حرج يتطلب تحوط' | 'فجوة استيرادية مرتفعة';
}

export interface PanArabRulesOfOriginInput {
  product_name_ar: string;
  hs_code?: string;
  exporting_country: string;
  importing_country: string;
  ex_works_price_usd: number;
  arab_origin_materials_cost_usd: number;
  direct_local_labor_cost_usd: number;
  factory_overhead_cost_usd: number;
  non_arab_imported_materials_cost_usd: number;
}

export interface PanArabRulesOfOriginResult {
  product_name_ar: string;
  exporting_country_ar: string;
  importing_country_ar: string;
  ex_works_price_usd: number;
  total_arab_value_added_usd: number;
  arab_value_added_percentage: number;
  gafta_threshold_required_pct: number;
  is_gafta_compliant: boolean;
  tariff_exemption_verdict_ar: string;
  estimated_duty_savings_usd: number;
  standard_customs_duty_without_gafta_pct: number;
  required_certificates_ar: string[];
  regulatory_advisory_note_ar: string;
}


export interface PanArabGeopoliticalRisk {
  country_code: string;
  country_name_ar: string;
  flag: string;
  overall_safety_index: number; // 0 to 100 (higher = safer)
  risk_level_ar: 'مستقر وآمن جداً' | 'مستقر مع مخاطر طفيفة' | 'معتدل المخاطر' | 'مرتفع المخاطر' | 'حرج';
  political_stability_score: number; // 0 to 100
  sanctions_exposure_level: 'معدوم' | 'منخفض' | 'متوسط' | 'مرتفع';
  currency_volatility_rating: 'مستقر وثابت (ربط مباشر)' | 'تذبذب مدار ومرن' | 'تذبذب وتضخم مرتفع';
  cybersecurity_resilience_rank: number;
  primary_geopolitical_threats: string[];
  hedging_mitigation_strategies: string[];
}

export interface PanArabRouteContingency {
  id: string;
  primary_chokepoint_or_corridor: string;
  risk_scenario: string;
  alternative_route_name_ar: string;
  transit_time_impact_days: string;
  cost_impact_pct: string;
  capacity_readiness: 'جاهز وفوري' | 'قيد التطوير والتوسعة' | 'محدود السعة';
  strategic_description_ar: string;
  participating_countries: { country_code: string; name_ar: string; flag: string }[];
}

export interface PanArabGlobalCompetitiveness {
  country_code: string;
  country_name_ar: string;
  flag: string;
  global_competitiveness_rank: number;
  global_innovation_index_rank: number;
  global_cybersecurity_index_tier: string;
  logistics_performance_index_rank: number;
  soft_power_rank: number;
  fdi_confidence_index_rank: number;
  strategic_edge_ar: string;
}

export interface PanArabExecutiveBriefingRequest {
  recipient_title?: string;
  selected_countries?: string[];
  focus_domains?: string[];
  urgency_level?: 'routine' | 'strategic' | 'urgent_crisis';
  custom_notes?: string;
}

export interface PanArabExecutiveBriefingResponse {
  document_id: string;
  timestamp_formatted: string;
  recipient_title: string;
  classification_level: string;
  executive_summary_ar: string;
  strategic_takeaways: string[];
  country_assessments: {
    country_code: string;
    country_name_ar: string;
    flag: string;
    risk_level_ar: string;
    investment_outlook_ar: string;
    critical_alert_ar?: string;
  }[];
  swot_analysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommended_action_roadmap: {
    timeline_ar: string;
    action_title_ar: string;
    details_ar: string;
    owner_stakeholders_ar: string;
  }[];
  darb_synthesis_statement: string;
}

// ============================================================================
// PHASE 9: DIGITAL PASSPORT, B2B MATCHMAKING & STRATEGY CO-PILOT
// ============================================================================

export interface PanArabDigitalPassport {
  passport_id: string;
  holder_name: string;
  credential_tier: 'مستثمر استراتيجي سيادي' | 'رائد أعمال واقتصاد رقمي' | 'كفاءة مهنية ومهارات متقدمة' | 'تاجر ومورّد إقليمي';
  primary_citizenship: string;
  target_operating_countries: string[];
  issue_date: string;
  valid_until: string;
  verified_privileges: {
    code: string;
    title_ar: string;
    description_ar: string;
    authority_ar: string;
    is_active: boolean;
  }[];
  compliance_rating: number;
  digital_seal_hash: string;
  qr_payload: string;
}

export interface PanArabMatchmakerListing {
  id: string;
  entity_name_ar: string;
  country_code: string;
  country_name_ar: string;
  flag: string;
  sector_ar: string;
  partnership_type: 'طلب رأس مال وشريك استثماري' | 'توريد وتوزيع إقليمي' | 'شراكة تقنية وتوطين صناعي' | 'استحواذ واندماج مشترك';
  ticket_size_usd: number;
  value_proposition_ar: string;
  gafta_certified: boolean;
  looking_for_ar: string;
  target_partner_countries: string[];
  contact_channel_ar: string;
}

export interface PanArabStrategyCopilotRequest {
  user_query: string;
  context_country?: string;
  user_role?: 'investor' | 'entrepreneur' | 'expat_professional' | 'trader';
}

export interface PanArabStrategyCopilotResponse {
  answer_markdown: string;
  strategic_recommendations: string[];
  relevant_country_codes: string[];
  relevant_tools: { title_ar: string; tab_id: string; subtab_id?: string }[];
  confidence_score: number;
}

// ============================================================================
// PHASE 10: POWER GRID, DIGITAL CURRENCIES (CBDC) & SOVEREIGN IMPACT SIMULATOR
// ============================================================================

export interface PanArabPowerGridProject {
  project_id: string;
  project_name_ar: string;
  participating_countries: { country_code: string; name_ar: string; flag: string }[];
  voltage_kv: number;
  transmission_capacity_mw: number;
  technology_type: 'تيار مستمر فائق الجهد (HVDC)' | 'ربط تيار متردد متزامن (AC)' | 'كابلات بحرية متعددة الدوائر';
  total_investment_usd_million: number;
  status_ar: 'قيد التشغيل والتبادل التجاري' | 'قيد التنفيذ الإنشائي المتقدم' | 'مرحلة الربط التوسعي والتجارب التشغيلية';
  peak_offset_benefit_ar: string;
  clean_energy_share_pct: number;
  key_substations_ar: string[];
}

export interface PanArabDigitalSettlementChannel {
  system_id: string;
  system_name_ar: string;
  operator_ar: string;
  governance_model: string;
  supported_currencies: string[];
  average_settlement_speed_seconds: number;
  cost_saving_vs_swift_pct: number;
  daily_volume_usd_million: number;
  participating_central_banks: string[];
  use_cases_ar: string[];
}

export interface PanArabSovereignImpactInput {
  origin_country: string;
  partner_countries: string[];
  sector: string;
  investment_ticket_usd: number;
  annual_trade_volume_usd: number;
  utilize_gafta_exemption: boolean;
  utilize_free_zones: boolean;
  utilize_digital_settlement: boolean;
  utilize_power_grid_benefits: boolean;
}

export interface PanArabSovereignImpactResult {
  origin_country_ar: string;
  partner_countries_ar: string[];
  sector_ar: string;
  total_investment_usd: number;
  annual_trade_volume_usd: number;
  customs_savings_usd: number;
  tax_incentive_savings_usd: number;
  digital_settlement_savings_usd: number;
  energy_grid_savings_usd: number;
  total_annual_cost_savings_usd: number;
  projected_5yr_roi_pct: number;
  net_5yr_economic_value_usd: number;
  direct_jobs_created: number;
  strategic_synergy_grade: 'AAA+ تكامل سيادي فائق' | 'AA+ شراكة استراتيجية كبرى' | 'A تكامل عالي الجدوى';
  strategic_takeaway_ar: string;
}

// ============================================================================
// PHASE 11: REAL-TIME WAR ROOM, MARITIME CHOKEPOINT TRACKER & COMMODITY RADAR
// ============================================================================

export interface PanArabMaritimeChokepoint {
  chokepoint_id: string;
  name_ar: string;
  strategic_role_ar: string;
  daily_transit_vessels: number;
  daily_crude_barrels_million: number;
  global_trade_share_pct: number;
  status: 'انسياب طبيعي وآمن' | 'حالة ترقب وإجراءات أمنية مشددة' | 'ازدحام ملاحي أو تحويل مسارات جزئي';
  status_color: 'emerald' | 'amber' | 'rose';
  current_transit_delay_hours: number;
  primary_alternative_route_ar: string;
  controlling_arab_states: { country_code: string; name_ar: string; flag: string }[];
  live_incident_alert_ar?: string;
}

export interface PanArabLiveCommodityQuote {
  commodity_key: string;
  commodity_name_ar: string;
  category: 'طاقة ومحروقات' | 'أمن غذائي ومحاصيل' | 'معادن ومواد بناء' | 'أسمدة وكيماويات';
  spot_price_usd: number;
  unit_ar: string;
  change_24h_pct: number;
  is_positive_change: boolean;
  benchmark_market_ar: string;
  leading_arab_exporter_ar: string;
  strategic_reserve_status_ar: string;
}

export interface PanArabSupplyChainAlert {
  alert_id: string;
  timestamp_ar: string;
  severity: 'حرج للغاية (Critical)' | 'تنبيه استراتيجي (High)' | 'إشعار تشغيلي (Informational)';
  corridor_name_ar: string;
  alert_title_ar: string;
  description_ar: string;
  impacted_ports_or_borders: string[];
  recommended_alternative_action_ar: string;
}

// ============================================================================
// PHASE 12: MINISTERIAL COMMAND HUB, CUSTOMS VERIFICATION & TREATY DRAFTER
// ============================================================================

export interface PanArabInstitutionalEntity {
  agency_id: string;
  country_code: string;
  country_name_ar: string;
  flag: string;
  agency_name_ar: string;
  agency_type: 'وزارة استثمار وتجارة' | 'هيئة تشجيع استثمار سيادية' | 'سلطة جمارك ومنافذ حدودية' | 'صندوق سيادي تنموي';
  jurisdiction_scope_ar: string;
  fast_track_services_ar: string[];
  key_incentives_summary_ar: string;
  focal_point_office_ar: string;
  bilateral_agreements_count: number;
}

export interface PanArabCustomsVerificationRequest {
  credential_id: string;
  credential_type: 'gafta_origin' | 'digital_passport' | 'sez_tax_exemption' | 'food_safety_phytosanitary';
  origin_country: string;
  destination_country: string;
  goods_hs_code?: string;
}

export interface PanArabCustomsVerificationResult {
  is_valid: boolean;
  credential_id: string;
  credential_type_ar: string;
  status_ar: 'معتمد وموثق رقمياً (Verified)' | 'قيد الفحص المخبري والجماركي' | 'منتهي الصلاحية أو غير مطابق';
  verification_timestamp: string;
  issuing_authority_ar: string;
  origin_country_ar: string;
  destination_country_ar: string;
  verified_privileges_ar: string[];
  exemption_rate_pct: number;
  digital_seal_hash: string;
  border_clearance_lane: 'المسار الأخضر الفوري (Green Lane)' | 'المسار الأصفر (تدقيق مستندي)' | 'المسار الأحمر (تفتيش دقيق)';
}

export interface PanArabTreatyDraftRequest {
  party_a_country: string;
  party_b_country: string;
  treaty_type: 'bilateral_investment_protection' | 'double_taxation_avoidance' | 'industrial_synergy_partnership' | 'joint_food_security_compact' | 'green_hydrogen_energy_treaty';
  designated_sectors?: string[];
  arbitration_center?: string;
}

export interface PanArabTreatyArticle {
  article_number: number;
  title_ar: string;
  content_ar: string;
}

export interface PanArabTreatyDraftResponse {
  treaty_id: string;
  treaty_title_ar: string;
  treaty_type_ar: string;
  party_a_name_ar: string;
  party_b_name_ar: string;
  legal_preamble_ar: string;
  articles: PanArabTreatyArticle[];
  arbitration_forum_ar: string;
  execution_date_ar: string;
  official_seal_text_ar: string;
}

// ============================================================================
// PHASE 13: STRATEGIC FOOD & WATER SECURITY, RESILIENCE & 2035 SCENARIOS
// ============================================================================

export interface PanArabStrategicReserveItem {
  commodity_key: string;
  name_ar: string;
  category: 'حبوب ومحاصيل أساسية' | 'زيوت وسكر' | 'ثروة حيوانية وألبان' | 'أسمدة زراعية';
  total_arab_reserve_months: number;
  total_arab_stock_million_tons: number;
  top_arab_producers: { country_code: string; name_ar: string; share_pct: number; annual_production_m_tons: number }[];
  strategic_silos_capacity_m_tons: number;
  emergency_share_protocol_ar: string;
  vulnerability_level: 'منخفض (آمن ومستقر)' | 'متوسط (يتطلب يقظة وتنويع)' | 'حرج (اعتماد على الاستيراد)';
  vulnerability_color: 'emerald' | 'amber' | 'rose';
}

export interface PanArabWaterDesalinationNode {
  node_id: string;
  country_code: string;
  country_name_ar: string;
  flag: string;
  daily_desalination_capacity_m3: number;
  renewable_energy_share_pct: number;
  shared_groundwater_basin_ar: string;
  per_capita_water_annual_m3: number;
  treated_sewage_reuse_pct: number;
  mega_water_projects_ar: string[];
}

export interface PanArabGeopoliticalScenario {
  scenario_id: string;
  scenario_title_ar: string;
  threat_level: 'حرج للغاية (Extreme)' | 'عالي المخاطر (High Alert)' | 'تحول استراتيجي (Strategic Shift)';
  affected_chokepoints: string[];
  disruption_impact_summary_ar: string;
  alternative_corridors: {
    corridor_name_ar: string;
    route_path_ar: string;
    throughput_capacity_ar: string;
    readiness_pct: number;
    key_operating_states: string[];
  }[];
  contingency_action_steps_ar: string[];
}

export interface PanArabStressTestResult {
  country_code: string;
  country_name_ar: string;
  shock_type: string;
  shock_magnitude: string;
  overall_resilience_score: number; // 0 - 100
  buffer_duration_months: number;
  fiscal_impact_pct_gdp: number;
  food_security_status: string;
  energy_balance_status: string;
  currency_pressure_level: 'منخفض' | 'متوسط' | 'مرتفع';
  recommended_brotherly_synergies: string[];
  emergency_mitigation_plan_ar: string[];
}

// ============================================================================
// PHASE 14: SOVEREIGN WEALTH CO-INVESTMENT, MEGAPROJECT SYNDICATION & STRATEGIC OPPORTUNITIES BANK 2030-2045
// ============================================================================

export interface PanArabConsortiumSovereignFund {
  fund_id: string;
  fund_name_ar: string;
  fund_name_en: string;
  country_code: string;
  country_name_ar: string;
  flag: string;
  aum_billion_usd: number;
  established_year: number;
  headquarters_city: string;
  co_investment_allocation_pct: number;
  strategic_sectors_ar: string[];
  active_syndicates_count: number;
  sovereign_credit_rating: string;
  investment_philosophy_ar: string;
}

export interface PanArabMegaprojectSyndicate {
  syndicate_id: string;
  project_name_ar: string;
  host_country_code: string;
  host_country_name_ar: string;
  flag: string;
  total_capex_billion_usd: number;
  syndicated_funding_target_usd: number;
  committed_funding_usd: number;
  participating_funds: {
    fund_name_ar: string;
    country_code: string;
    equity_share_pct: number;
    contribution_billion_usd: number;
  }[];
  sector: 'طاقة متجددة وهيدروجين أخضر' | 'مدن ذكية ومجمعات لوجستية' | 'بنية تحتية وموانئ استراتيجية' | 'أشباه موصلات ومراكز ذكاء اصطناعي' | 'أمن غذائي واستصلاح أراضي';
  target_irr_pct: number;
  completion_year: number;
  progress_pct: number;
  jobs_created: number;
  status_ar: 'اكتمل الإغلاق المالي' | 'قيد الطرح المشترك' | 'قيد التنفيذ الإنشائي' | 'مرحلة التشغيل المبكر';
  key_contractors_ar: string[];
  sovereign_guarantee_ar: string;
  esg_rating: string;
}

export interface PanArabStrategicOpportunity {
  opp_id: string;
  title_ar: string;
  target_sector_ar: string;
  location_countries: { country_code: string; name_ar: string; flag: string }[];
  minimum_ticket_million_usd: number;
  expected_annual_return_pct: string;
  risk_profile: 'محافظ ومضمون سيادياً' | 'متوازن ومدر للدخل' | 'نمو تحويلي استراتيجي';
  incentive_package_ar: string;
  local_content_requirement_pct: number;
  shariah_compliant: boolean;
  sovereign_backing_level: string;
  readiness_status_ar: string;
}

export interface PanArabPortfolioSimulationRequest {
  capital_million_usd: number;
  risk_profile: 'conservative' | 'balanced' | 'aggressive';
  target_sectors: string[];
  preferred_region: 'all' | 'gcc' | 'north_africa' | 'levant';
}

export interface PanArabPortfolioSimulationResult {
  capital_million_usd: number;
  risk_profile_ar: string;
  projected_irr_pct: number;
  annual_cash_yield_million_usd: number;
  national_gdp_multiplier: number;
  jobs_created_estimate: number;
  sovereign_guarantee_coverage_pct: number;
  allocated_assets: {
    asset_name_ar: string;
    sector_ar: string;
    country_code: string;
    country_name_ar: string;
    flag: string;
    allocation_pct: number;
    ticket_million_usd: number;
    expected_irr_pct: number;
  }[];
  strategic_recommendations_ar: string[];
  risk_mitigation_covenants_ar: string[];
}

export interface PanArabGreenSukukTermSheet {
  sukuk_id: string;
  issuance_title_ar: string;
  issuer_name_ar: string;
  host_countries_ar: string[];
  currency: string;
  target_volume_million_usd: number;
  coupon_profit_rate_pct: number;
  tenor_years: number;
  shariah_structure_ar: string;
  green_framework_ar: string;
  co_guarantors_ar: string[];
  governing_law_ar: string;
  arbitration_center_ar: string;
  digital_cryptoseal_sha256: string;
  issuance_date: string;
  use_of_proceeds_ar: string[];
}

// ============================================================================
// PHASE 15: SOVEREIGN DIGITAL TECH, CYBER SHIELD, SUPERCOMPUTING & SPACE 2030-2045
// ============================================================================

export interface PanArabSovereignAiModel {
  model_id: string;
  model_name_ar: string;
  developer_entity_ar: string;
  host_country_code: string;
  country_name_ar: string;
  flag: string;
  parameter_count_billion: number;
  primary_language_ar: string;
  open_weight_license: boolean;
  use_cases_ar: string[];
  benchmark_arabic_score_pct: number;
  datacenter_location_ar: string;
  release_year: number;
}

export interface PanArabSupercomputerCluster {
  cluster_id: string;
  cluster_name_ar: string;
  host_country_code: string;
  country_name_ar: string;
  flag: string;
  peak_performance_petaflops: number;
  gpu_architecture_ar: string;
  total_accelerators_count: number;
  renewable_powered_pct: number;
  carbon_pue_index: number;
  strategic_missions_ar: string[];
  operator_entity_ar: string;
}

export interface PanArabCyberShieldThreat {
  threat_id: string;
  threat_category: 'هجمات فدية ومنشآت نفطية' | 'تجسس استخباراتي متقدم APT' | 'استهداف شبكات الكهرباء والمياه' | 'هجمات تعطيل خدمة ضد المصارف' | 'اختراق سلاسل إمداد البرمجيات';
  severity: 'حرج للغاية (Critical)' | 'عالي الخطورة (High)' | 'متوسط (Medium)';
  origin_fingerprint_ar: string;
  targeted_sectors_ar: string[];
  incident_summary_ar: string;
  cert_countermeasures_ar: string[];
  status_ar: 'تم التحوط والصد' | 'مراقبة استباقية نشطة' | 'إنذار مبكر ومناعة سيبرانية';
  detected_timestamp: string;
}

export interface PanArabSatelliteAsset {
  satellite_id: string;
  name_ar: string;
  launch_year: number;
  orbit_type_ar: string;
  operator_agency_ar: string;
  countries_involved: { country_code: string; name_ar: string; flag: string }[];
  primary_mission_ar: string;
  resolution_meters: number;
  data_sovereignty_ar: string;
  status_ar: 'نشط في المدار' | 'قيد الإطلاق والتجهيز' | 'تحديث الأنظمة الفضائية';
}

export interface PanArabCyberReadinessSimulationRequest {
  country_code: string;
  attack_vector: 'scada_power_grid' | 'swift_banking_ddos' | 'critical_port_ransomware' | 'satellite_gps_spoofing';
  defense_investment_level: 'standard' | 'fortified' | 'quantum_hardened';
}

export interface PanArabCyberReadinessSimulationResult {
  country_code: string;
  country_name_ar: string;
  flag: string;
  attack_vector_ar: string;
  defense_level_ar: string;
  resilience_score: number; // 0 - 100
  recovery_time_hours: number;
  estimated_economic_loss_saved_million_usd: number;
  post_quantum_readiness_pct: number;
  critical_infrastructure_survival_pct: number;
  contingency_playbook_steps_ar: string[];
  pan_arab_mutual_defense_support_ar: string[];
}

