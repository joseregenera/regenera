
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
import { getCurrentUser } from './services/supabaseService';
import { supabase } from './lib/supabaseClient';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    const init = async () => {
      const u = await getCurrentUser();
      setUser(u);
      setLoading(false);
    };
    init();

    // Listen for auth changes
    // Using 'as any' to bypass the error: Property 'onAuthStateChange' does not exist on type 'SupabaseAuthClient'
    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange(async (_event: any, session: any) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.email?.split('@')[0] || 'User',
          role: 'USER' as any
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 font-bold italic">Regenera Data Engine Loading...</div>;

  return (
    <Router>
      <Layout user={user} setUser={setUser}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/public-benchmark" element={<PublicBenchmark />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/add-facility" element={user ? <Wizard user={user} /> : <Navigate to="/login" />} />
          <Route path="/facility/:id" element={<ResultsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
