import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, ArrowLeft, Building } from 'lucide-react';
import { Button, Card, Badge } from '../components/ui';
import { Facility, BenchmarkResult } from '../types';
import { supabase } from '../lib/supabaseClient';
import { getBenchmarkStats } from '../services/supabaseService';

export const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [facility, setFacility] = useState<any>(null);
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('facility_energy_submissions')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setFacility(data);
        
        const stats = await getBenchmarkStats(data.facility_type, data.eui);
        setResult(stats);
      } catch (e) {
        console.error(e);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  if (loading || !facility || !result) return <div className="p-20 text-center text-gray-400">Computing real-time baseline...</div>;

  const chartData = [
    { name: 'Your Building', value: Math.round(facility.eui), fill: '#0D362B' },
    { name: 'Sector Median', value: Math.round(result.categoryMedianEui || 0), fill: '#DCAD45' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-10">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}><ArrowLeft size={16} className="mr-2"/> Portfolio</Button>
        <div className="flex gap-4">
           <Badge variant={result.percentile > 75 ? 'success' : result.percentile > 40 ? 'warning' : 'gray'}>
             Top {100 - result.percentile}% of Sector
           </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           <Card className="p-10 border-none shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                 <Building size={120} />
              </div>
              
              <div className="relative z-10">
                 <span className="text-xs font-black text-brand-accent uppercase tracking-widest">{facility.facility_type}</span>
                 <h1 className="text-4xl font-black text-brand-500 mt-2">{facility.internal_label || "Facility Report"}</h1>
                 
                 <div className="grid grid-cols-2 gap-12 mt-12 pt-12 border-t border-gray-100">
                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Calculated EUI</p>
                       <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-black text-brand-500">{Math.round(facility.eui)}</span>
                          <span className="text-sm text-gray-400 font-bold">kWh/m²/yr</span>
                       </div>
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Annual Consumption</p>
                       <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-brand-secondary">{Number(facility.annual_kwh).toLocaleString()}</span>
                          <span className="text-sm text-gray-400 font-bold">kWh</span>
                       </div>
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="p-8 border-none shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-8">Performance vs. National Median</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 40 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontWeight: 'bold', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-gray-400 font-medium mt-4 uppercase tracking-wider">
                Comparing against {result.sampleSize} certified records in the {facility.facility_type} sector.
              </p>
           </Card>
        </div>

        <div className="space-y-6">
           <div className="bg-brand-500 rounded-2xl p-8 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-4">Baseline Insights</h3>
              <p className="text-brand-100 text-sm leading-relaxed mb-6">
                Your facility is performing {facility.eui < result.categoryMedianEui ? 'better' : 'higher'} than the national median of {Math.round(result.categoryMedianEui)}.
              </p>
              <div className="space-y-4">
                 <div className="bg-white/10 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-brand-accent uppercase block mb-1">Sector Median</span>
                    <span className="text-xl font-bold">{Math.round(result.categoryMedianEui)} <span className="text-xs font-normal opacity-70">kWh/m²</span></span>
                 </div>
                 <div className="bg-white/10 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-brand-accent uppercase block mb-1">Percentile Rank</span>
                    <span className="text-xl font-bold">{result.percentile}th</span>
                 </div>
              </div>
           </div>
           
           <Button className="w-full py-4 text-brand-accent bg-transparent border-2 border-brand-accent hover:bg-brand-accent hover:text-brand-500">
             <Download size={18} className="mr-2"/> Generate PDF Report
           </Button>
        </div>
      </div>
    </div>
  );
};