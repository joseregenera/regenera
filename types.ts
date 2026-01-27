export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  APAFAM_MEMBER = 'APAFAM_MEMBER'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

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

export interface MonthlyData {
  month: number; // 1-12
  year: number;
  kwh: number;
  cost?: number;
}

export interface Facility {
  id: string;
  userId: string;
  internalLabel?: string; // Private
  category: BuildingCategory;
  areaM2: number;
  createdAt: string;
  data: MonthlyData[];
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
