import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Upload, AlertCircle } from 'lucide-react';
import { Button, Card, Input, Select } from '../components/ui';
import { BuildingCategory, Facility, MonthlyData, User } from '../types';
import { CATEGORIES_LIST, MONTH_NAMES } from '../constants';
import { saveFacility } from '../services/storageService';

interface WizardProps {
  user: User;
}

export const Wizard: React.FC<WizardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [internalLabel, setInternalLabel] = useState('');
  const [category, setCategory] = useState<BuildingCategory | ''>('');
  const [area, setArea] = useState('');
  
  // Initialize with empty monthly data
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(
    MONTH_NAMES.map((_, i) => ({ month: i + 1, year: new Date().getFullYear() - 1, kwh: 0, cost: undefined }))
  );

  const handleMonthlyChange = (index: number, field: 'kwh' | 'cost', value: string) => {
    const newData = [...monthlyData];
    const val = value === '' ? 0 : parseFloat(value);
    
    if (field === 'kwh') newData[index].kwh = val;
    if (field === 'cost') newData[index].cost = value === '' ? undefined : val;
    
    setMonthlyData(newData);
  };

  const validateStep1 = () => {
    return category && area && parseFloat(area) > 0;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const facility: Facility = {
        id: crypto.randomUUID(),
        userId: user.id,
        internalLabel: internalLabel || undefined,
        category: category as BuildingCategory,
        areaM2: parseFloat(area),
        createdAt: new Date().toISOString(),
        data: monthlyData
      };

      await saveFacility(facility);
      navigate(`/facility/${facility.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock CSV Parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, parse CSV. Here, we'll just fill with dummy data for UX demo.
    const dummy = monthlyData.map(m => ({ ...m, kwh: Math.floor(Math.random() * 5000) + 1000 }));
    setMonthlyData(dummy);
    alert("Mock CSV parsed: Data populated with random values for demonstration.");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Facility</h1>
        <div className="mt-4 flex items-center">
          <div className={`flex items-center ${step >= 1 ? 'text-brand-600' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-brand-600 bg-brand-50' : 'border-gray-300'}`}>1</span>
            <span className="ml-2 font-medium">Basics</span>
          </div>
          <div className="w-12 h-px bg-gray-300 mx-4"></div>
          <div className={`flex items-center ${step >= 2 ? 'text-brand-600' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-brand-600 bg-brand-50' : 'border-gray-300'}`}>2</span>
            <span className="ml-2 font-medium">Energy Data</span>
          </div>
          <div className="w-12 h-px bg-gray-300 mx-4"></div>
          <div className={`flex items-center ${step >= 3 ? 'text-brand-600' : 'text-gray-400'}`}>
             <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-brand-600 bg-brand-50' : 'border-gray-300'}`}>3</span>
             <span className="ml-2 font-medium">Review</span>
          </div>
        </div>
      </div>

      <Card className="p-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Facility Information</h3>
              <p className="text-sm text-gray-500">This information is used to categorize your building. The internal label is private.</p>
            </div>
            
            <Input 
              label="Internal Label (Optional)" 
              placeholder="e.g. Building A, Main HQ" 
              value={internalLabel}
              onChange={(e) => setInternalLabel(e.target.value)}
            />
            
            <Select
              label="Facility Category *"
              value={category}
              onChange={(e) => setCategory(e.target.value as BuildingCategory)}
              options={CATEGORIES_LIST.map(c => ({ value: c, label: c }))}
            />

            <Input 
              label="Gross Floor Area (m²) *" 
              type="number"
              placeholder="e.g. 1500" 
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!validateStep1()}>
                Next Step <ChevronRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
             <div className="flex justify-between items-start">
               <div>
                <h3 className="text-lg font-medium text-gray-900">Energy Consumption</h3>
                <p className="text-sm text-gray-500">Enter electricity usage for the last 12 months.</p>
               </div>
               <div className="relative overflow-hidden inline-block">
                  <Button variant="outline" className="relative">
                    <Upload size={16} className="mr-2" /> Upload CSV
                    <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </Button>
               </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md flex items-start">
               <AlertCircle className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" size={18} />
               <p className="text-sm text-blue-700">
                 <strong>Privacy Note:</strong> Your monthly data is stored securely and only used to compute your annual EUI. It is never shared raw.
               </p>
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-50 border-b p-2 text-xs font-semibold text-gray-500 uppercase">
                <div className="col-span-4 pl-2">Month</div>
                <div className="col-span-4">kWh *</div>
                <div className="col-span-4">Cost ($) <span className="text-gray-400 normal-case font-normal">(Optional)</span></div>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {monthlyData.map((data, idx) => (
                  <div key={idx} className="grid grid-cols-12 border-b last:border-0 p-2 items-center hover:bg-gray-50">
                    <div className="col-span-4 pl-2 text-sm font-medium text-gray-700">
                      {MONTH_NAMES[data.month - 1]}
                    </div>
                    <div className="col-span-4 pr-2">
                       <input 
                         type="number" 
                         className="w-full border-gray-300 rounded-md text-sm py-1 px-2 focus:ring-brand-500 focus:border-brand-500 border"
                         value={data.kwh || ''}
                         onChange={(e) => handleMonthlyChange(idx, 'kwh', e.target.value)}
                         placeholder="0"
                       />
                    </div>
                    <div className="col-span-4">
                       <input 
                         type="number" 
                         className="w-full border-gray-300 rounded-md text-sm py-1 px-2 focus:ring-brand-500 focus:border-brand-500 border"
                         value={data.cost || ''}
                         onChange={(e) => handleMonthlyChange(idx, 'cost', e.target.value)}
                         placeholder="Optional"
                       />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft size={16} className="mr-2" /> Back
              </Button>
              <Button onClick={() => setStep(3)}>
                Review <ChevronRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Review & Submit</h3>
            
            <div className="bg-gray-50 p-4 rounded-md space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block">Category</span>
                  <span className="font-medium">{category}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Area</span>
                  <span className="font-medium">{area} m²</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Total Annual kWh</span>
                  <span className="font-medium text-brand-600">{monthlyData.reduce((a, b) => a + b.kwh, 0).toLocaleString()} kWh</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Calculated EUI</span>
                  <span className="font-medium text-brand-600">{(monthlyData.reduce((a, b) => a + b.kwh, 0) / parseFloat(area)).toFixed(1)} kWh/m²</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              By submitting, you agree to add this anonymous data to the national dataset managed by Regenera.
            </p>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ChevronLeft size={16} className="mr-2" /> Back
              </Button>
              <Button onClick={handleSubmit} isLoading={isLoading}>
                Submit Facility
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
