
export enum BuildingCategory {
  OFFICE = 'Office',
  RETAIL = 'Retail',
  HOTEL = 'Hotel',
  HOSPITAL = 'Hospital',
  SCHOOL = 'School',
  WAREHOUSE = 'Warehouse',
  RESIDENTIAL_MULTI = 'Residential (Multi-family)',
  OTHER = 'Other'
}

/**
 * User interface for application authentication.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

export interface MonthlyData {
  month: number; // 1-12
  year: number;
  kwh: number;
  // Added optional cost property used in calculateBenchmark
  cost?: number;
}

export interface Facility {
  id: string;
  // Added optional userId for filtering user-specific facilities
  userId?: string;
  internalLabel?: string;
  category: BuildingCategory;
  areaM2: number;
  createdAt: string;
  annual_kwh: number;
  eui: number;
  // Added optional data property for monthly consumption history
  data?: MonthlyData[];
}

export interface BenchmarkResult {
  facilityId: string;
  year: number;
  annualKwh: number;
  annualCost: number;
  eui: number; // kWh/m2/year
  costIntensity: number; // USD/m2/year
  categoryMedianEui?: number;
  percentile?: number; // 0-100, lower is better
  sampleSize: number;
  isSufficientData: boolean;
}

export interface CategoryStats {
  category: BuildingCategory;
  count: number;
  medianEui: number;
  p25Eui: number;
  p75Eui: number;
}
