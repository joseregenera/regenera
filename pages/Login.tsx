import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../components/ui';
import { loginUser } from '../services/storageService';
import { User } from '../types';

interface LoginProps {
  setUser: (u: User) => void;
}

export const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      // Simulate Magic Link flow (Just logs in for MVP)
      const user = await loginUser(email);
      setUser(user);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or <a href="#" className="font-medium text-brand-600 hover:text-brand-500">create a new account</a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <Input
              label="Email address"
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <Button type="submit" className="w-full" isLoading={loading}>
                Send Magic Link
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Secure access
                </span>
              </div>
            </div>
            <p className="mt-4 text-xs text-center text-gray-400">
              We use passwordless login for better security. You'll verify your email to access your dashboard.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
