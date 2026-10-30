import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Lock, User as UserIcon, AlertCircle, ArrowRight } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login/', {
        username,
        password,
      });

      const { token, user, player_profile } = response.data;
      login(token, user, player_profile);
      navigate('/dashboard');
    } catch (err: any) {
      const detail =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        'Invalid username or password. Please try again.';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-10 shadow-2xl">
          {/* Brand header */}
          <div className="text-center mb-8 space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto text-slate-950 shadow-lg shadow-amber-500/20 mb-4">
              <Trophy className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h1 className="font-heading font-black text-2xl text-white">Player Portal Sign In</h1>
            <p className="text-sm text-slate-400">
              Access your personalized player profile, statistics, and schedule.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Username or Email
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. rohitp"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient-btn py-3.5 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick login helper for demo */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-400">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-semibold text-amber-400 hover:underline">
                Register as a player
              </Link>
            </p>
            <p className="text-[11px] text-slate-500">
              Demo accounts: <code>rohitp</code> / <code>player123</code> or <code>admin</code> / <code>admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
