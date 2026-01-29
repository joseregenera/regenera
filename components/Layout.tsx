import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode; user: any; setUser: any }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-6 cursor-pointer" onClick={() => navigate('/')}>
               <img 
                 src="/regenera-logo.svg" 
                 alt="Regenera Logo" 
                 className="h-10 w-auto" 
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                   const parent = e.currentTarget.parentElement;
                   if (parent) {
                     const fallback = document.createElement('div');
                     fallback.className = "h-10 w-10 bg-brand-500 rounded flex items-center justify-center text-white font-bold";
                     fallback.innerText = "R";
                     parent.prepend(fallback);
                   }
                 }}
               />
               <div className="hidden md:block h-8 w-px bg-gray-200"></div>
               <div className="hidden md:flex flex-col">
                  <span className="text-xs font-bold text-brand-500 tracking-widest uppercase">Panama Energy</span>
                  <span className="text-[10px] text-gray-400 font-medium">BASELINE INITIATIVE</span>
               </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/public-benchmark" className={`text-sm font-semibold transition-colors ${isActive('/public-benchmark') ? 'text-brand-500' : 'text-gray-500 hover:text-brand-500'}`}>
                Public Baseline
              </Link>
              <Link to="/dashboard" className={`text-sm font-semibold transition-colors ${isActive('/dashboard') ? 'text-brand-500' : 'text-gray-500 hover:text-brand-500'}`}>
                My Portfolio
              </Link>
              <Link to="/add-facility" className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-sm transition-all">
                Add Submission
              </Link>
            </div>

            <div className="flex items-center md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-500">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-4">
              <Link to="/public-benchmark" className="block text-gray-600 font-semibold" onClick={() => setIsMenuOpen(false)}>Public Baseline</Link>
              <Link to="/dashboard" className="block text-gray-600 font-semibold" onClick={() => setIsMenuOpen(false)}>My Portfolio</Link>
              <Link to="/add-facility" className="block text-brand-500 font-bold" onClick={() => setIsMenuOpen(false)}>Add Submission</Link>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-brand-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div>
              <img src="/regenera-logo.svg" alt="Regenera Logo" className="h-8 w-auto mb-4 brightness-0 invert" />
              <p className="text-brand-100 text-sm max-w-xs">
                Empowering Panama's sustainable future through data-driven energy insights.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start space-y-2">
               <span className="text-xs font-bold text-brand-accent uppercase tracking-widest">Partners</span>
               <div className="flex items-center gap-4">
                  <span className="font-serif font-bold text-xl tracking-tighter">APAFAM</span>
                  <div className="w-px h-4 bg-brand-700"></div>
                  <span className="font-bold text-lg">REGENERA</span>
               </div>
            </div>
            <div className="flex flex-col md:items-end text-sm text-brand-200">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy & Data Policy</Link>
              <p className="mt-4">&copy; {new Date().getFullYear()} Panama Energy Baseline</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};