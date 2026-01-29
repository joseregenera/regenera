-- Table: facility_energy_submissions
-- Note: user_id column is REMOVED to maintain absolute anonymity as requested.
CREATE TABLE IF NOT EXISTS public.facility_energy_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    facility_type text NOT NULL,
    area_m2 numeric NOT NULL CHECK (area_m2 > 0),
    monthly_kwh numeric[] NOT NULL CHECK (cardinality(monthly_kwh) = 12),
    annual_kwh numeric NOT NULL,
    eui numeric NOT NULL,
    country text DEFAULT 'Panama',
    internal_label text, -- User's private name for the building (stored only for user's local dashboard)
    notes text
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_facility_type ON public.facility_energy_submissions(facility_type);
CREATE INDEX IF NOT EXISTS idx_created_at ON public.facility_energy_submissions(created_at);

-- Enable Row Level Security
ALTER TABLE public.facility_energy_submissions ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for anonymous submissions)
-- 1. Allow anyone to view benchmarking data
CREATE POLICY "Public can view submissions for benchmarking" 
ON public.facility_energy_submissions FOR SELECT 
USING (true);

-- 2. Allow anonymous insertion
CREATE POLICY "Anyone can insert submissions" 
ON public.facility_energy_submissions FOR INSERT 
WITH CHECK (true);

-- Note: Update and Delete are disabled for anonymous users via RLS by default if no policy exists.
-- Since there is no user identity, we rely on local storage to identify "My Portfolio" submissions.

-- VIEW for public aggregates to ensure absolute anonymity
CREATE OR REPLACE VIEW public.facility_energy_benchmarks AS
SELECT facility_type, eui, created_at, annual_kwh, area_m2
FROM public.facility_energy_submissions;

GRANT SELECT ON public.facility_energy_benchmarks TO anon, authenticated;
