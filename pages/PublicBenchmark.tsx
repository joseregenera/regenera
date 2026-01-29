import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../components/ui';
import { getPublicAggregates } from '../services/supabaseService';

export const PublicBenchmark: React.FC = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPublicAggregates();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalBuildings = stats.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-brand-500 py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
           <h1 className="text-4xl font-black text-white mb-4">National Baseline Dashboard</h1>
           <p className="text-brand-100 text-lg">Real-time aggregated performance benchmarks for Panama's building stock.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 pb-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Verified Records', val: totalBuildings, color: 'brand-500' },
              { label: 'Active Sectors', val: stats.length, color: 'brand-accent' },
              { label: 'Baseline Year', val: '2023-24', color: 'brand-secondary' }
            ].map(stat => (
              <Card key={stat.label} className="p-8 text-center border-none shadow-xl">
                 <span className={`text-4xl font-black text-${stat.color}`}>{stat.val}</span>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{stat.label}</p>
              </Card>
            ))}
         </div>

         <Card className="p-10 border-none shadow-2xl">
            <div className="mb-10">
               <h2 className="text-2xl font-black text-brand-500">Median Energy Use Intensity (EUI)</h2>
               <p className="text-gray-500 text-sm mt-1">Comparing median annual kWh/m² across various sectors in Panama.</p>
            </div>
            
            <div className="h-[450px] w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center text-gray-300 font-bold italic">Gathering sector data...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats} margin={{ bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="category" 
                      tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} 
                      angle={-45} 
                      textAnchor="end" 
                    />
                    <YAxis tick={{fontSize: 10, fill: '#64748b'}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="medianEui" fill="#0D362B" radius={[6, 6, 0, 0]} barSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
         </Card>
      </div>
    </div>
  );
};