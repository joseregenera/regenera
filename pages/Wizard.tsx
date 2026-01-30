import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, AlertCircle, Settings } from 'lucide-react';
import { Button, Card, Input, Select } from '../components/ui';
import { BuildingCategory } from '../types';
import { CATEGORIES_LIST, MONTH_NAMES } from '../constants';
import { saveFacility } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export const Wizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [internalLabel, setInternalLabel] = useState('');
  const [category, setCategory] = useState<BuildingCategory | ''>('');
  const [area, setArea] = useState('');
  
  const [monthlyKwh, setMonthlyKwh] = useState<string[]>(new Array(12).fill(''));

  const handleKwhChange = (index: number, value: string) => {
    const newData = [...monthlyKwh];
    newData[index] = value;
    setMonthlyKwh(newData);
  };

  const validateStep1 = () => {
    return category && area && parseFloat(area) > 0;
  };

  const validateStep2 = () => {
    return monthlyKwh.every(val => val !== '' && !isNaN(parseFloat(val)) && parseFloat(val) >= 0);
  };

  const handleSubmit = async () => {
    if (!isSupabaseConfigured) {
      setError("System misconfigured: Missing environment variables.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const numericKwh = monthlyKwh.map(v => parseFloat(v));
      const result = await saveFacility({
        internalLabel,
        category: category as BuildingCategory,
        areaM2: parseFloat(area),
        monthly_kwh: numericKwh
      });

      navigate(`/facility/${result.id}`);
    } catch (e: any) {
      setError(e.message || "Failed to save submission");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <Card className="p-12 border-red-200 bg-red-50 text-center">
          <Settings className="mx-auto h-16 w-16 text-red-600 mb-6 animate-pulse" />
          <h2 className="text-2xl font-black text-red-800 mb-4">System Configuration Error</h2>
          <p className="text-red-700 max-w-lg mx-auto mb-8 font-medium">
            Missing <strong>VITE_SUPABASE_URL</strong> or <strong>VITE_SUPABASE_ANON_KEY</strong>. 
            Please configure these variables in Vercel and redeploy the application to enable benchmarks.
          </p>
          <div className="flex justify-center gap-4">
             <Button variant="outline" onClick={() => navigate('/')}>Return Home</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900">Benchmark Your Facility</h1>
        <p className="text-gray-500 mt-2">Submit your data anonymously to join the national baseline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
           {[
             { n: 1, t: 'Facility Basics' },
             { n: 2, t: 'Energy Consumption' },
             { n: 3, t: 'Confirm & Submit' }
           ].map(s => (
             <div key={s.n} className={`flex items-center gap-3 p-4 rounded-lg transition-all ${step === s.n ? 'bg-brand-50 border-l-4 border-brand-500' : 'bg-white text-gray-400'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === s.n ? 'bg-brand-500 text-white' : 'bg-gray-100'}`}>{s.n}</span>
                <span className="font-bold text-sm">{s.t}</span>
             </div>
           ))}
        </div>

        <Card className="md:col-span-2 p-8 border-none shadow-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle size={20}/> {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <Input label="Building Reference (Stored locally on your device)" placeholder="e.g. Panama HQ" value={internalLabel} onChange={e => setInternalLabel(e.target.value)} />
              <Select label="Sector Type *" value={category} onChange={e => setCategory(e.target.value as any)} options={CATEGORIES_LIST.map(c => ({ value: c, label: c }))} />
              <Input label="Gross Floor Area (m²) *" type="number" placeholder="0.00" value={area} onChange={e => setArea(e.target.value)} />
              <div className="flex justify-end pt-4"><Button onClick={() => setStep(2)} disabled={!validateStep1()}>Continue <ChevronRight size={16}/></Button></div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="bg-brand-50 p-4 rounded-lg flex gap-3">
                 <AlertCircle className="text-brand-500 flex-shrink-0" size={20}/>
                 <p className="text-xs text-brand-700 font-medium">Please provide the actual monthly kWh for the last 12-month period. All values must be numbers ≥ 0.</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {MONTH_NAMES.map((m, i) => (
                  <div key={m}>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">{m}</label>
                    <input 
                      type="number"
                      className="w-full border-gray-200 rounded-md p-2 text-sm focus:ring-brand-500 focus:border-brand-500 border"
                      placeholder="kWh"
                      value={monthlyKwh[i]}
                      onChange={e => handleKwhChange(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={() => setStep(1)}><ChevronLeft size={16}/> Back</Button>
                <Button onClick={() => setStep(3)} disabled={!validateStep2()}>Next Step <ChevronRight size={16}/></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
               <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">Review Submission</h3>
                  <p className="text-sm text-gray-500 mt-1">This data will be anonymized into the public baseline.</p>
               </div>
               
               <div className="bg-gray-50 rounded-xl p-6 grid grid-cols-2 gap-y-6">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Sector</span>
                    <span className="font-bold text-brand-500">{category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Total Area</span>
                    <span className="font-bold text-brand-500">{area} m²</span>
                  </div>
                  <div className="col-span-2 border-t pt-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Annual Consumption</span>
                    <span className="text-2xl font-black text-brand-500">{monthlyKwh.reduce((a,b) => a + (parseFloat(b)||0), 0).toLocaleString()} <span className="text-sm font-normal">kWh/year</span></span>
                  </div>
               </div>

               <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}><ChevronLeft size={16}/> Back</Button>
                <Button onClick={handleSubmit} isLoading={isLoading}>Submit Benchmark</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};