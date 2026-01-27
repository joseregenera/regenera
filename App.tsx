import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Wizard } from './pages/Wizard';
import { ResultsPage } from './pages/ResultsPage';
import { PublicBenchmark } from './pages/PublicBenchmark';
import { PrivacyPage } from './pages/PrivacyPage';
import { User } from './types';
import { getCurrentUser } from './services/storageService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    setLoading(false);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;

  return (
    <Router>
      <Layout user={user} setUser={setUser}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/public-benchmark" element={<PublicBenchmark />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/add-facility" 
            element={user ? <Wizard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/facility/:id" 
            element={user ? <ResultsPage /> : <Navigate to="/login" />} 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
