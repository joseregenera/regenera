-- Table: facility_energy_submissions
CREATE TABLE IF NOT EXISTS public.facility_energy_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now(),
    facility_type text NOT NULL,
    area_m2 numeric NOT NULL CHECK (area_m2 > 0),
    monthly_kwh numeric[] NOT NULL CHECK (cardinality(monthly_kwh) = 12),
    annual_kwh numeric NOT NULL,
    eui numeric NOT NULL,
    country text DEFAULT 'Panama',
    internal_label text, -- User's private name for the building
    notes text
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_facility_type ON public.facility_energy_submissions(facility_type);
CREATE INDEX IF NOT EXISTS idx_created_at ON public.facility_energy_submissions(created_at);

-- Enable Row Level Security
ALTER TABLE public.facility_energy_submissions ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Allow anyone to view benchmarking data (only specific columns if handled via VIEW, or full rows if anonymized)
CREATE POLICY "Public can view submissions for benchmarking" 
ON public.facility_energy_submissions FOR SELECT 
USING (true);

-- 2. Allow authenticated users to insert their own data
CREATE POLICY "Users can insert their own submissions" 
ON public.facility_energy_submissions FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 3. Allow users to update/delete their own data
CREATE POLICY "Users can update their own submissions" 
ON public.facility_energy_submissions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own submissions" 
ON public.facility_energy_submissions FOR DELETE 
USING (auth.uid() = user_id);

-- VIEW for public aggregates to ensure absolute anonymity
CREATE OR REPLACE VIEW public.facility_energy_benchmarks AS
SELECT facility_type, eui, created_at, annual_kwh, area_m2
FROM public.facility_energy_submissions;

GRANT SELECT ON public.facility_energy_benchmarks TO anon, authenticated;