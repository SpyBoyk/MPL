import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Lock, User as UserIcon, Mail, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../api/client';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    playing_role: 'all_rounder',
    batting_style: 'right_hand',
    bowling_style: 'right_arm_medium',
    jersey_number: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/auth/register/', {
        ...formData,
        jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : null,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      const respData = err.response?.data;
      if (respData) {
        const firstKey = Object.keys(respData)[0];
        const val = respData[firstKey];
        setError(Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val));
      } else {
        setError('Registration failed. Please check your details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-8 space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto text-slate-950 shadow-lg shadow-amber-500/20 mb-4">
              <Trophy className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h1 className="font-heading font-black text-2xl text-white">Register as an MPL Player</h1>
            <p className="text-sm text-slate-400">
              Create your official Malghar Premier League player profile and join the tournament roster.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>Registration successful! Redirecting to sign in...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  required
                  placeholder="e.g. Rahul Patil"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="e.g. rahulp"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="rahul@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="password_confirm"
                  required
                  placeholder="••••••••"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Playing Role
                </label>
                <select
                  name="playing_role"
                  value={formData.playing_role}
                  onChange={handleChange}
                  className="w-full px-3 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="batter">Batter</option>
                  <option value="bowler">Bowler</option>
                  <option value="all_rounder">All-rounder</option>
                  <option value="wk_batter">Wicket-keeper</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Batting Style
                </label>
                <select
                  name="batting_style"
                  value={formData.batting_style}
                  onChange={handleChange}
                  className="w-full px-3 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="right_hand">Right-hand Bat</option>
                  <option value="left_hand">Left-hand Bat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Jersey Number
                </label>
                <input
                  type="number"
                  name="jersey_number"
                  placeholder="e.g. 18"
                  value={formData.jersey_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full gold-gradient-btn py-3.5 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span>Registering Profile...</span>
              ) : (
                <>
                  <span>Create Player Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-amber-400 hover:underline">
                Sign in to your dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
