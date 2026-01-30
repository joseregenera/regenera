import supabase, { isSupabaseConfigured } from '../lib/supabaseClient';
import { BenchmarkResult, BuildingCategory } from '../types';

/**
 * Saves a facility submission to Supabase.
 * Schema: facility_type, area_m2, monthly_kwh, annual_kwh, eui, country, internal_label, notes.
 */
export const saveFacility = async (facilityData: {
  category: BuildingCategory;
  areaM2: number;
  monthly_kwh: number[];
  internalLabel?: string;
  notes?: string;
}) => {
  if (!isSupabaseConfigured) {
    throw new Error("Application is not connected to a database. Please check environment variables.");
  }

  const annual_kwh = facilityData.monthly_kwh.reduce((a, b) => a + b, 0);
  const eui = annual_kwh / (facilityData.areaM2 || 1);

  // Exact payload matching the Supabase table schema
  const payload = {
    facility_type: facilityData.category,
    area_m2: facilityData.areaM2,
    monthly_kwh: facilityData.monthly_kwh,
    annual_kwh,
    eui,
    internal_label: facilityData.internalLabel || null,
    notes: facilityData.notes || null,
    country: 'Panama'
  };

  const { data, error } = await supabase
    .from('facility_energy_submissions')
    .insert([payload])
    .select('id, created_at, facility_type, area_m2, annual_kwh, eui, internal_label')
    .single();

  if (error) {
    console.error("Supabase Insert Error:", error.message);
    throw new Error(error.message);
  }
  
  // Store the submission ID locally to track "My Portfolio" without accounts
  const localIdsString = localStorage.getItem('peb_submission_ids');
  const localIds = localIdsString ? JSON.parse(localIdsString) : [];
  localStorage.setItem('peb_submission_ids', JSON.stringify([...localIds, data.id]));
  
  return data;
};

/**
 * Retrieves facilities based on the IDs stored in local storage.
 */
export const getMyFacilities = async () => {
  if (!isSupabaseConfigured) return [];

  const localIdsString = localStorage.getItem('peb_submission_ids');
  const localIds = localIdsString ? JSON.parse(localIdsString) : [];
  if (localIds.length === 0) return [];

  const { data, error } = await supabase
    .from('facility_energy_submissions')
    .select('id, created_at, facility_type, area_m2, annual_kwh, eui, internal_label')
    .in('id', localIds);

  if (error) throw error;
  return (data || []).map(row => ({
    id: row.id,
    internalLabel: row.internal_label,
    category: row.facility_type as BuildingCategory,
    areaM2: row.area_m2,
    createdAt: row.created_at,
    annual_kwh: row.annual_kwh,
    eui: row.eui
  }));
};

export const deleteFacility = async (id: string) => {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('facility_energy_submissions')
    .delete()
    .eq('id', id);
  
  if (!error) {
    const localIdsString = localStorage.getItem('peb_submission_ids');
    const localIds = localIdsString ? JSON.parse(localIdsString) : [];
    localStorage.setItem('peb_submission_ids', JSON.stringify(localIds.filter((lid: string) => lid !== id)));
  }
};

/**
 * Computes benchmark statistics from the actual Supabase dataset.
 */
export const getBenchmarkStats = async (facilityType: string, userEui: number): Promise<BenchmarkResult> => {
  if (!isSupabaseConfigured) {
    throw new Error("Benchmarking unavailable: Database connection missing.");
  }

  const { data: peers, error } = await supabase
    .from('facility_energy_submissions')
    .select('eui')
    .eq('facility_type', facilityType);

  if (error) throw error;

  const euis = peers ? peers.map(p => Number(p.eui)).sort((a, b) => a - b) : [];
  const sampleSize = euis.length;
  
  let categoryMedianEui = 0;
  if (sampleSize > 0) {
    const mid = Math.floor(sampleSize / 2);
    categoryMedianEui = sampleSize % 2 !== 0 ? euis[mid] : (euis[mid - 1] + euis[mid]) / 2;
  }

  const higherThan = euis.filter(e => e > userEui).length;
  const percentile = sampleSize > 0 ? Math.round((higherThan / sampleSize) * 100) : 0;

  return {
    facilityId: '',
    year: 2024,
    annualKwh: 0, 
    annualCost: 0,
    eui: userEui,
    costIntensity: 0,
    categoryMedianEui: categoryMedianEui || 0,
    percentile,
    sampleSize,
    isSufficientData: sampleSize >= 3
  };
};

export const getPublicAggregates = async () => {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('facility_energy_submissions')
    .select('facility_type, eui');

  if (error) throw error;
  if (!data || data.length === 0) return [];

  const groups = data.reduce((acc, curr) => {
    if (!acc[curr.facility_type]) acc[curr.facility_type] = [];
    acc[curr.facility_type].push(Number(curr.eui));
    return acc;
  }, {} as Record<string, number[]>);

  return Object.entries(groups).map(([category, euis]) => {
    euis.sort((a, b) => a - b);
    const mid = Math.floor(euis.length / 2);
    const median = euis.length % 2 !== 0 ? euis[mid] : (euis[mid - 1] + euis[mid]) / 2;
    return {
      category: category as any,
      count: euis.length,
      medianEui: Math.round(median),
      p25Eui: euis[Math.floor(euis.length * 0.25)] || 0,
      p75Eui: euis[Math.floor(euis.length * 0.75)] || 0
    };
  });
};