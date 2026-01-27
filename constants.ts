import { BuildingCategory, CategoryStats } from './types';

// Minimum sample size to show detailed benchmarks
export const SAMPLE_THRESHOLD_N = 5; // Low for MVP demo purposes, usually 10+

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CATEGORIES_LIST = [
  BuildingCategory.OFFICE,
  BuildingCategory.RETAIL,
  BuildingCategory.HOTEL,
  BuildingCategory.HOSPITAL,
  BuildingCategory.SCHOOL,
  BuildingCategory.WAREHOUSE,
  BuildingCategory.RESIDENTIAL_MULTI,
  BuildingCategory.OTHER
];

// Seed data for public benchmark visualization (Simulated National Baseline)
export const MOCK_BASELINE_STATS: CategoryStats[] = [
  { category: BuildingCategory.OFFICE, count: 45, medianEui: 180, p25Eui: 140, p75Eui: 230 },
  { category: BuildingCategory.RETAIL, count: 32, medianEui: 250, p25Eui: 200, p75Eui: 310 },
  { category: BuildingCategory.HOTEL, count: 12, medianEui: 300, p25Eui: 260, p75Eui: 350 },
  { category: BuildingCategory.HOSPITAL, count: 8, medianEui: 400, p25Eui: 350, p75Eui: 480 },
  { category: BuildingCategory.SCHOOL, count: 20, medianEui: 120, p25Eui: 90, p75Eui: 150 },
  { category: BuildingCategory.WAREHOUSE, count: 15, medianEui: 60, p25Eui: 40, p75Eui: 90 },
  { category: BuildingCategory.RESIDENTIAL_MULTI, count: 4, medianEui: 110, p25Eui: 90, p75Eui: 140 }, // Under threshold example
  { category: BuildingCategory.OTHER, count: 2, medianEui: 150, p25Eui: 100, p75Eui: 200 },
];
