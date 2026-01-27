import React from 'react';
import { ShieldCheck, Database, EyeOff, Lock } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <ShieldCheck className="mx-auto h-12 w-12 text-brand-600" />
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Data Use & Privacy</h1>
          <p className="mt-2 text-lg text-gray-500">Our commitment to anonymity and trust.</p>
        </div>

        <div className="prose prose-blue mx-auto space-y-12">
          
          <div className="flex gap-6">
            <div className="flex-shrink-0">
               <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                  <Database size={20} />
               </div>
            </div>
            <div>
               <h3 className="text-lg font-bold text-gray-900">Regenera Ownership</h3>
               <p className="mt-2 text-gray-600">
                 The dataset built by this platform is owned and stewarded by Regenera. We act as the independent third party to ensure data integrity. 
                 Aggregated findings are published in the Annual APAFAM Energy Baseline Report.
               </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0">
               <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                  <EyeOff size={20} />
               </div>
            </div>
            <div>
               <h3 className="text-lg font-bold text-gray-900">Strict Anonymity</h3>
               <p className="mt-2 text-gray-600">
                 We do not require facility names or addresses. We only collect the minimal attributes needed for normalization (Category, Area). 
                 Internal labels you provide are encrypted and never shown in public datasets.
               </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0">
               <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                  <Lock size={20} />
               </div>
            </div>
            <div>
               <h3 className="text-lg font-bold text-gray-900">Threshold Protection</h3>
               <p className="mt-2 text-gray-600">
                 Public benchmarks are only displayed when a category reaches a minimum sample size (N=10). This prevents reverse-engineering of data points for unique buildings in Panama.
               </p>
            </div>
          </div>

          <div className="border-t pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Data Deletion</h3>
            <p className="text-gray-600 mb-4">
              You retain the right to remove your facility from the active dataset at any time via your dashboard. 
              Removal will exclude your data from future aggregate calculations.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
