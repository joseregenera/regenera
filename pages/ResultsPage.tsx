import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Download, ArrowLeft, Share2 } from 'lucide-react';
import { Button, Card, Badge } from '../components/ui';
import { Facility, BenchmarkResult } from '../types';
import { getFacilities, calculateBenchmark } from '../services/storageService';

export const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [result, setResult] = useState<BenchmarkResult | null>(null);

  useEffect(() => {
    if (id) {
      const facilities = getFacilities();
      const found = facilities.find(f => f.id === id);
      if (found) {
        setFacility(found);
        setResult(calculateBenchmark(found));
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, navigate]);

  if (!facility || !result) return <div>Loading...</div>;

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Energy Benchmark Summary", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Facility Category: ${facility.category}`, 20, 40);
    doc.text(`Area: ${facility.areaM2} m2`, 20, 50);
    doc.text(`Year: ${result.year}`, 20, 60);

    doc.setFillColor(240, 240, 240);
    doc.rect(20, 70, 170, 40, 'F');
    
    doc.setFontSize(14);
    doc.text("Your EUI", 30, 85);
    doc.setFontSize(24);
    doc.setTextColor(0, 100, 200);
    doc.text(`${Math.round(result.eui)}`, 30, 100);
    doc.setFontSize(10);
    doc.text("kWh/m2/yr", 60, 100);

    doc.setTextColor(0, 0, 0);
    if (result.isSufficientData) {
        doc.setFontSize(14);
        doc.text("Category Benchmark", 100, 85);
        doc.text(`Median: ${result.categoryMedianEui}`, 100, 100);
        doc.text(`Percentile: Top ${100 - (result.percentile || 0)}%`, 100, 110);
    } else {
        doc.text("Insufficient data for benchmark comparison.", 100, 90);
    }

    doc.save("energy-benchmark.pdf");
  };

  const chartData = result.isSufficientData ? [
    { name: 'Your Building', eui: Math.round(result.eui), fill: '#0ea5e9' },
    { name: 'Market Median', eui: result.categoryMedianEui, fill: '#94a3b8' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="pl-0 hover:bg-transparent">
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={downloadPDF}>
            <Download size={16} className="mr-2" /> Download Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Badge variant="gray">{facility.category}</Badge>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">{facility.internalLabel || 'Facility Results'}</h1>
                <p className="text-gray-500">Based on data from {result.year}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Performance Score</p>
                {result.isSufficientData ? (
                  <div className="mt-1">
                    <span className="text-4xl font-extrabold text-brand-600">{100 - (result.percentile || 0)}</span>
                    <span className="text-gray-400 text-sm">/100</span>
                    <p className="text-xs text-gray-500 mt-1">Percentile Rank (Higher is better)</p>
                  </div>
                ) : (
                   <span className="text-gray-400 text-sm italic">Pending data...</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Your EUI</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">{Math.round(result.eui)}</span>
                  <span className="text-sm text-gray-500">kWh/m²/yr</span>
                </div>
                {result.isSufficientData && (
                  <p className={`text-sm mt-2 ${result.eui < (result.categoryMedianEui || 0) ? 'text-green-600' : 'text-orange-500'}`}>
                    {result.eui < (result.categoryMedianEui || 0) 
                      ? `${Math.round(((result.categoryMedianEui! - result.eui) / result.categoryMedianEui!) * 100)}% better than median` 
                      : `${Math.round(((result.eui - result.categoryMedianEui!) / result.categoryMedianEui!) * 100)}% higher than median`
                    }
                  </p>
                )}
              </div>
              
              {result.annualCost > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Cost Intensity</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">${result.costIntensity.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">/m²/yr</span>
                  </div>
                   <p className="text-sm mt-2 text-gray-400">
                    Total: ${result.annualCost.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {result.isSufficientData ? (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Benchmark Comparison</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" unit=" EUI" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="eui" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Comparing against {result.sampleSize} other {facility.category} buildings in Panama.
              </p>
            </Card>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
              <h3 className="text-brand-800 font-medium">More data needed</h3>
              <p className="text-brand-600 text-sm mt-2">
                We need more {facility.category} submissions to calculate a reliable benchmark. 
                Your contribution helps build this baseline! Check back soon.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-6 bg-brand-900 text-white border-none">
             <h3 className="font-bold text-lg mb-2">Regenera Verified</h3>
             <p className="text-brand-100 text-sm mb-4">
               This facility data is now part of the Panama Energy Baseline.
             </p>
             <div className="text-xs text-brand-300">
               <p>Dataset ID: {facility.id.split('-')[0]}</p>
               <p>Privacy: Anonymized</p>
             </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">Understanding EUI</h3>
            <p className="text-sm text-gray-600 space-y-2">
              <strong>Energy Use Intensity (EUI)</strong> is your building's energy fingerprint. 
              Lower is generally better.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-500 list-disc list-inside">
               <li>Panama Office Median: ~180</li>
               <li>Panama Hotel Median: ~300</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
