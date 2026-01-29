
import { supabase } from '../lib/supabaseClient';
import { Facility, User, BenchmarkResult, MonthlyData, BuildingCategory } from '../types';

export const loginUser = async (email: string) => {
  // For MVP/Demo, we use magic links or simple OTP. 
  // User explicitly asked for Admin/User functionality.
  // Using 'as any' to bypass error: Property 'signInWithOtp' does not exist on type 'SupabaseAuthClient'
  const { data, error } = await (supabase.auth as any).signInWithOtp({ email });
  if (error) throw error;
  return data;
};

export const logoutUser = async () => {
  // Using 'as any' to bypass error: Property 'signOut' does not exist on type 'SupabaseAuthClient'
  await (supabase.auth as any).signOut();
};

export const getCurrentUser = async (): Promise<User | null> => {
  // Using 'as any' to bypass error: Property 'getUser' does not exist on type 'SupabaseAuthClient'
  const { data: { user } } = await (supabase.auth as any).getUser();
  if (!user) return null;
  return {
    id: user.id,
    email: user.email || '',
    name: user.email?.split('@')[0] || 'User',
    role: 'USER' as any // Roles can be managed via a public.profiles table in a full app
  };
};

export const saveFacility = async (facilityData: Partial<Facility> & { monthly_kwh: number[] }) => {
  // Using 'as any' to bypass error: Property 'getUser' does not exist on type 'SupabaseAuthClient'
  const { data: { user } } = await (supabase.auth as any).getUser();
  
  const annual_kwh = facilityData.monthly_kwh.reduce((a, b) => a + b, 0);
  const eui = annual_kwh / (facilityData.areaM2 || 1);

  const payload = {
    user_id: user?.id,
    facility_type: facilityData.category,
    area_m2: facilityData.areaM2,
    monthly_kwh: facilityData.monthly_kwh,
    annual_kwh,
    eui,
    internal_label: facilityData.internalLabel,
    country: 'Panama'
  };

  const { data, error } = await supabase
    .from('facility_energy_submissions')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserFacilities = async () => {
  // Using 'as any' to bypass error: Property 'getUser' does not exist on type 'SupabaseAuthClient'
  const { data: { user } } = await (supabase.auth as any).getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('facility_energy_submissions')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    userId: row.user_id,
    internalLabel: row.internal_label,
    category: row.facility_type,
    areaM2: row.area_m2,
    createdAt: row.created_at,
    data: row.monthly_kwh.map((kwh: number, i: number) => ({ month: i + 1, year: 2023, kwh }))
  }));
};

export const deleteFacility = async (id: string) => {
  const { error } = await supabase
    .from('facility_energy_submissions')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

export const getBenchmarkStats = async (facilityType: string, userEui: number): Promise<BenchmarkResult> => {
  // Fetch peer data for the same sector
  const { data: peers, error } = await supabase
    .from('facility_energy_submissions')
    .select('eui')
    .eq('facility_type', facilityType);

  if (error) throw error;

  const euis = peers.map(p => Number(p.eui)).sort((a, b) => a - b);
  const sampleSize = euis.length;
  
  // Median
  const mid = Math.floor(sampleSize / 2);
  const categoryMedianEui = sampleSize % 2 !== 0 ? euis[mid] : (euis[mid - 1] + euis[mid]) / 2;

  // Percentile (Lower EUI is better)
  // Rank is how many peers have a WORSE (higher) EUI than you
  const betterThan = euis.filter(e => e > userEui).length;
  const percentile = sampleSize > 0 ? Math.round((betterThan / sampleSize) * 100) : 0;

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
    isSufficientData: sampleSize >= 3 // Adjusted threshold for live data
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

  // Cast Object.entries result to resolve 'unknown' type inference on euis
  return (Object.entries(groups) as [string, number[]][]).map(([category, euis]) => {
    euis.sort((a, b) => a - b);
    const mid = Math.floor(euis.length / 2);
    const median = euis.length % 2 !== 0 ? euis[mid] : (euis[mid - 1] + euis[mid]) / 2;
    return {
      category: category as any,
      count: euis.length,
      medianEui: Math.round(median),
      p25Eui: euis[Math.floor(euis.length * 0.25)],
      p75Eui: euis[Math.floor(euis.length * 0.75)]
    };
  });
};
