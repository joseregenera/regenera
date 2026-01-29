import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Lock, FileText, Zap } from 'lucide-react';
import { Button } from '../components/ui';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-brand-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-10"
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
            alt="Panama Skyline"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900 to-brand-800 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Panama Building Energy <br/> <span className="text-brand-400">Baseline</span>
          </h1>
          <p className="mt-6 text-xl text-brand-100 max-w-3xl">
            The first public, anonymized platform to benchmark your facility's energy performance against national peers. 
            Join the movement towards a more efficient Panama.
          </p>
          <div className="mt-10 flex gap-4">
            <Button onClick={() => navigate('/add-facility')} className="px-8 py-3 text-base">
              Start Benchmarking
            </Button>
            <Button onClick={() => navigate('/public-benchmark')} variant="secondary" className="px-8 py-3 text-base">
              View Public Data
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-brand-600 tracking-wide uppercase">How it works</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">Simple, Secure, Insightful</p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              We've removed the friction. Get your EUI (Energy Use Intensity) in minutes.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Zap,
                title: '1. Input Data',
                desc: 'Enter basic facility info and 12 months of consumption data. No lengthy forms.'
              },
              {
                icon: Lock,
                title: '2. Anonymized',
                desc: 'Your data is strictly confidential. No addresses or names are public. Ever.'
              },
              {
                icon: BarChart2,
                title: '3. Compare',
                desc: 'Instantly see how you rank against similar buildings in Panama.'
              },
              {
                icon: FileText,
                title: '4. Report',
                desc: 'Download a PDF summary for your stakeholders and contribute to the National Report.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="h-12 w-12 rounded-md bg-brand-500 flex items-center justify-center text-white mb-4">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-gray-400 tracking-wider uppercase">In Partnership With</p>
          <div className="mt-6 flex justify-center items-center gap-12 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
             <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <span className="font-bold text-gray-400">R</span>
                </div>
                <span className="font-bold text-gray-800">Regenera</span>
             </div>
             <div className="h-12 w-px bg-gray-200"></div>
             <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <span className="font-serif font-bold text-gray-400">A</span>
                </div>
                <span className="font-serif font-bold text-gray-800">APAFAM</span>
             </div>
          </div>
          <p className="mt-8 text-sm text-gray-500 max-w-2xl mx-auto">
            Regenera acts as the data steward, ensuring privacy and technical accuracy. APAFAM promotes the initiative to establish the first robust energy baseline for Panama.
          </p>
        </div>
      </div>
    </div>
  );
};
