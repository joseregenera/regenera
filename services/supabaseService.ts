import supabase from '../lib/supabaseClient';
import { BenchmarkResult, BuildingCategory } from '../types';

/**
 * Saves a facility submission to Supabase.
 * Strictly adheres to the schema: facility_type, area_m2, monthly_kwh, annual_kwh, eui, country, internal_label.
 */
export const saveFacility = async (facilityData: {
  category: BuildingCategory;
  areaM2: number;
  monthly_kwh: number[];
  internalLabel?: string;
  notes?: string;
}) => {
  const annual_kwh = facilityData.monthly_kwh.reduce((a, b) => a + b, 0);
  const eui = annual_kwh / (facilityData.areaM2 || 1);

  const payload = {
    facility_type: facilityData.category,
    area_m2: facilityData.areaM2,
    monthly_kwh: facilityData.monthly_kwh,
    annual_kwh,
    eui,
    internal_label: facilityData.internalLabel,
    notes: facilityData.notes,
    country: 'Panama'
  };

  const { data, error } = await supabase
    .from('facility_energy_submissions')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  
  // Store the submission ID locally to track "My Portfolio" without accounts
  const localIds = JSON.parse(localStorage.getItem('peb_submission_ids') || '[]');
  localStorage.setItem('peb_submission_ids', JSON.stringify([...localIds, data.id]));
  
  return data;
};

/**
 * Retrieves facilities based on the IDs stored in local storage.
 */
export const getMyFacilities = async () => {
  const localIds = JSON.parse(localStorage.getItem('peb_submission_ids') || '[]');
  if (localIds.length === 0) return [];

  const { data, error } = await supabase
    .from('facility_energy_submissions')
    .select('*')
    .in('id', localIds);

  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    internalLabel: row.internal_label,
    category: row.facility_type,
    areaM2: row.area_m2,
    createdAt: row.created_at,
    annual_kwh: row.annual_kwh,
    eui: row.eui
  }));
};

export const deleteFacility = async (id: string) => {
  const { error } = await supabase
    .from('facility_energy_submissions')
    .delete()
    .eq('id', id);
  
  if (!error) {
    const localIds = JSON.parse(localStorage.getItem('peb_submission_ids') || '[]');
    localStorage.setItem('peb_submission_ids', JSON.stringify(localIds.filter((lid: string) => lid !== id)));
  }
};

/**
 * Computes benchmark statistics from the actual Supabase dataset.
 */
export const getBenchmarkStats = async (facilityType: string, userEui: number): Promise<BenchmarkResult> => {
  const { data: peers, error } = await supabase
    .from('facility_energy_submissions')
    .select('eui')
    .eq('facility_type', facilityType);

  if (error) throw error;

  const euis = peers.map(p => Number(p.eui)).sort((a, b) => a - b);
  const sampleSize = euis.length;
  
  // Median
  let categoryMedianEui = 0;
  if (sampleSize > 0) {
    const mid = Math.floor(sampleSize / 2);
    categoryMedianEui = sampleSize % 2 !== 0 ? euis[mid] : (euis[mid - 1] + euis[mid]) / 2;
  }

  // Percentile (Lower EUI is better, so rank-based percentile where 100 is most efficient)
  // Percentile = (Number of peers with higher EUI / Total) * 100
  const higherThan = euis.filter(e => e > userEui).length;
  const percentile = sampleSize > 0 ? Math.round((higherThan / sampleSize) * 100) : 0;

  return {
    facilityId: '',
    year: 2023,
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
  const { data, error } = await supabase
    .from('facility_energy_submissions')
    .select('facility_type, eui');

  if (error) throw error;

  const groups = data.reduce((acc, curr) => {
    if (!acc[curr.facility_type]) acc[curr.facility_type] = [];
    acc[curr.facility_type].push(Number(curr.eui));
    return acc;
  }, {} as Record<string, number[]>);

  return (Object.entries(groups) as [string, number[]][]).map(([category, euis]) => {
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