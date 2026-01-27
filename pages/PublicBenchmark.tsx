import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card } from '../components/ui';
import { MOCK_BASELINE_STATS, SAMPLE_THRESHOLD_N } from '../constants';

export const PublicBenchmark: React.FC = () => {
  // Filter stats to only show those with sufficient data
  const data = MOCK_BASELINE_STATS.filter(s => s.count >= SAMPLE_THRESHOLD_N);
  const insufficient = MOCK_BASELINE_STATS.filter(s => s.count < SAMPLE_THRESHOLD_N);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-brand-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h1 className="text-3xl font-extrabold text-white">National Baseline Dashboard</h1>
           <p className="mt-2 text-brand-200">Aggregated energy performance data for Panama.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
         <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="p-6 flex flex-col items-center justify-center text-center">
               <span className="text-4xl font-bold text-brand-600">{MOCK_BASELINE_STATS.reduce((a,b) => a + b.count, 0)}</span>
               <span className="text-sm text-gray-500 uppercase tracking-wide mt-1">Buildings Benchmarked</span>
            </Card>
            <Card className="p-6 flex flex-col items-center justify-center text-center">
               <span className="text-4xl font-bold text-brand-600">8</span>
               <span className="text-sm text-gray-500 uppercase tracking-wide mt-1">Categories Tracked</span>
            </Card>
            <Card className="p-6 flex flex-col items-center justify-center text-center">
               <span className="text-4xl font-bold text-brand-600">2023</span>
               <span className="text-sm text-gray-500 uppercase tracking-wide mt-1">Baseline Year</span>
            </Card>
         </div>

         <div className="space-y-8 pb-12">
            <Card className="p-8">
               <h2 className="text-xl font-bold text-gray-900 mb-2">Median EUI by Category</h2>
               <p className="text-sm text-gray-500 mb-6">Energy Use Intensity (kWh/m²/year). Lower is more efficient.</p>
               
               <div className="h-80 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="category" tick={{fontSize: 12}} interval={0} />
                     <YAxis />
                     <Tooltip 
                       contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                       cursor={{fill: '#f1f5f9'}}
                     />
                     <Bar dataKey="medianEui" fill="#0ea5e9" name="Median EUI" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </Card>

            {insufficient.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                 <h3 className="text-lg font-medium text-gray-900 mb-3">Emerging Categories</h3>
                 <p className="text-sm text-gray-500 mb-4">The following categories are collecting data but have not yet reached the privacy threshold ({SAMPLE_THRESHOLD_N} buildings) to display aggregate benchmarks.</p>
                 <div className="flex flex-wrap gap-2">
                    {insufficient.map(c => (
                       <span key={c.category} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          {c.category}
                       </span>
                    ))}
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};
