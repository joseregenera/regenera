# Panama Energy Baseline

A public platform for benchmarking building energy performance in Panama.

## Deployment Instructions

### 1. Supabase Setup
- Create a new project in Supabase.
- Run the contents of `supabase.sql` in the SQL Editor to create the `facility_energy_submissions` table and `facility_energy_benchmarks` view.

### 2. Vercel Configuration
- Go to your Vercel Project Settings > Environment Variables.
- Add the following variables (matching the values from your Supabase Project Settings > API):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Redeploy the application.

## Local Development
1. Copy `.env.example` to `.env`.
2. Fill in your Supabase credentials.
3. Run `npm install` and `npm run dev`.