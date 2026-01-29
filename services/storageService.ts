
import { Facility, User, BenchmarkResult, MonthlyData, BuildingCategory } from '../types';
import { SAMPLE_THRESHOLD_N, MOCK_BASELINE_STATS } from '../constants';

const STORAGE_KEYS = {
  USER: 'peb_user',
  FACILITIES: 'peb_facilities',
};

// Mock Auth
export const loginUser = async (email: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const user: User = {
    id: 'u_' + Math.random().toString(36).substr(2, 9),
    email,
    name: email.split('@')[0],
    // Removed unnecessary 'as any' casting as User.role is now correctly typed
    role: email.includes('admin') ? 'ADMIN' : 'USER'
  };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  return user;
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const getCurrentUser = (): User | null => {
  const u = localStorage.getItem(STORAGE_KEYS.USER);
  return u ? JSON.parse(u) : null;
};

// Facilities
export const saveFacility = async (facility: Facility): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const facilities = getFacilities();
  const existingIndex = facilities.findIndex(f => f.id === facility.id);
  if (existingIndex >= 0) {
    facilities[existingIndex] = facility;
  } else {
    facilities.push(facility);
  }
  localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(facilities));
};

export const getFacilities = (): Facility[] => {
  const raw = localStorage.getItem(STORAGE_KEYS.FACILITIES);
  return raw ? JSON.parse(raw) : [];
};

export const getUserFacilities = (userId: string): Facility[] => {
  return getFacilities().filter(f => f.userId === userId);
};

export const deleteFacility = (id: string) => {
  const facilities = getFacilities().filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(facilities));
};

// Computation Logic
export const calculateBenchmark = (facility: Facility): BenchmarkResult => {
  const year = new Date().getFullYear() - 1; // Last complete year assumption
  
  // Sums
  // Added safety check for facility.data existence before reducing
  const annualKwh = (facility.data || []).reduce((acc, curr) => acc + curr.kwh, 0);
  const annualCost = (facility.data || []).reduce((acc, curr) => acc + (curr.cost || 0), 0);
  
  const eui = annualKwh / facility.areaM2;
  const costIntensity = annualCost > 0 ? annualCost / facility.areaM2 : 0;

  // Get Mock Market Stats for this category
  const marketStat = MOCK_BASELINE_STATS.find(s => s.category === facility.category);
  
  // In a real app, we would query the actual DB of all facilities to compute this dynamically.
  // Here we use the mock stats + the user's data to simulate the "Live" nature.
  
  let percentile = 0;
  let sampleSize = 0;
  let isSufficientData = false;
  let categoryMedianEui = 0;

  if (marketStat) {
    sampleSize = marketStat.count;
    categoryMedianEui = marketStat.medianEui;
    isSufficientData = sampleSize >= SAMPLE_THRESHOLD_N;

    // Simple mock percentile logic based on normal distribution assumption around median
    if (isSufficientData) {
        // Lower EUI is better (higher percentile rank in terms of performance, but usually percentile means "better than X%")
        // Standard Energy Star way: 1-100, where 100 is best. 
        // Simple mathematical percentile: Where does this EUI fall in the distribution?
        // Let's assume P50 = median. 
        // If user EUI < median, they are performing better than 50%.
        const diff = marketStat.medianEui - eui;
        // Mock calculation for demo visuals
        let p = 50 + (diff / marketStat.medianEui) * 50; 
        p = Math.max(1, Math.min(99, p)); // Clamp 1-99
        percentile = Math.round(p);
    }
  }

  return {
    facilityId: facility.id,
    year,
    annualKwh,
    annualCost,
    eui,
    costIntensity,
    categoryMedianEui,
    percentile,
    sampleSize,
    isSufficientData
  };
};
