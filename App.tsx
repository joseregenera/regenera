import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Wizard } from './pages/Wizard';
import { ResultsPage } from './pages/ResultsPage';
import { PublicBenchmark } from './pages/PublicBenchmark';
import { PrivacyPage } from './pages/PrivacyPage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout user={null} setUser={() => {}}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/public-benchmark" element={<PublicBenchmark />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-facility" element={<Wizard />} />
          <Route path="/facility/:id" element={<ResultsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
