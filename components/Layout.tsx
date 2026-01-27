import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, BarChart3, ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { logoutUser } from '../services/storageService';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  setUser: (u: User | null) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, setUser }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
               {/* Logo Area */}
               <div className="flex items-center gap-2">
                 <div className="h-8 w-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">
                    R
                 </div>
                 <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 leading-tight">Panama Energy</span>
                    <span className="text-xs text-gray-500 tracking-wider">BASELINE</span>
                 </div>
               </div>
               <div className="hidden md:block h-6 w-px bg-gray-200 mx-2"></div>
               <div className="hidden md:flex items-center gap-2 opacity-70">
                  <span className="text-xs font-medium text-gray-500">Supported by</span>
                  <span className="font-serif font-bold text-gray-700 tracking-widest text-xs">APAFAM</span>
               </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/public-benchmark" className={`text-sm font-medium transition-colors ${isActive('/public-benchmark') ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`}>
                Public Baseline
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`}>
                    My Facilities
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-brand-600 focus:outline-none">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                         <UserIcon size={16} />
                      </div>
                      <span>{user.name}</span>
                    </button>
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 hidden group-hover:block hover:block">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <Link to="/login" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
                  Sign In / Join
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/public-benchmark" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Public Baseline</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Dashboard</Link>
                  <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-brand-600 hover:text-brand-700 hover:bg-gray-50">Sign In</Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                   <span className="font-bold text-gray-900">Regenera</span>
                   <span className="text-xs text-gray-500">Data Steward & Tech Partner</span>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="flex flex-col">
                   <span className="font-serif font-bold text-gray-700 tracking-wider">APAFAM</span>
                   <span className="text-xs text-gray-500">Strategic Partner</span>
                </div>
            </div>
            <div className="flex space-x-6 md:order-2">
              <Link to="/privacy" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Privacy</span>
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </Link>
            </div>
            <div className="md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; {new Date().getFullYear()} Panama Energy Baseline. All rights reserved.
              </p>
              <div className="mt-2 text-center text-xs text-gray-400">
                <Link to="/privacy" className="hover:underline">Privacy Policy & Data Use</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
