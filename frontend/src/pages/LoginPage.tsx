import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

/* Scorebook tokens with paired light mode (warm paper + pitch ink) */
const ink = 'text-slate-900 dark:text-chalk';
const inkSoft = 'text-slate-600 dark:text-chalk/50';
const ruleBorder = 'border-slate-300/80 dark:border-chalk/15';
const panelBg = 'bg-[#f7f4ed] dark:bg-[#080f1a]';
const asideBg = 'bg-[#efeadd] dark:bg-[#060b13]';

const inputCls =
  'w-full px-4 py-3 bg-transparent border border-slate-400/60 dark:border-chalk/20 text-slate-900 dark:text-chalk placeholder-slate-400/80 dark:placeholder-chalk/25 text-sm font-medium focus:outline-none focus:border-sodium-deep dark:focus:border-sodium focus:bg-slate-900/[0.03] dark:focus:bg-chalk/[0.03] transition-colors';
const labelCls =
  'block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-chalk/50 mb-2';
const statBorder = 'border-slate-300/80 dark:border-chalk/15 divide-slate-300/80 dark:divide-chalk/15';

function AuthPanel({
  heading,
  subheading,
  children,
}: {
  heading: string;
  subheading: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative px-6 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-24 ${panelBg}`}>
      <div className="max-w-sm mx-auto lg:mx-auto">
        <span className="mpl-rule-label">MPL official portal</span>
        <h1 className={`mpl-display mt-4 text-4xl sm:text-5xl font-semibold ${ink} leading-[0.98]`}>
          {heading}
        </h1>
        <p className={`mt-3 text-sm ${inkSoft} leading-relaxed`}>{subheading}</p>
        <div className="mt-9 space-y-5">{children}</div>
      </div>
    </div>
  );
}

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login/', {
        username,
        password,
      });

      const { token, user, player_profile } = response.data;
      login(token, user, player_profile);
      showToast(`Welcome back, ${player_profile?.full_name || user?.username}.`, 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const detail =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        'Invalid username or password. Please try again.';
      showToast(detail, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] grid grid-cols-1 lg:grid-cols-2 bg-[#f7f4ed] dark:bg-pitch">
      {/* Identity side */}
      <div className={`relative hidden lg:flex flex-col justify-end overflow-hidden border-r ${ruleBorder} ${asideBg} lg:order-1`}>
        <img
          src="/images/bg1.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-white/40 dark:bg-pitch/55" />
        <div className="absolute inset-0 dark:hidden bg-gradient-to-r from-white/55 via-transparent to-[#efeadd]/80" />
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-r from-pitch/70 via-transparent to-[#080f1a]" />

        <div className={`relative p-12 lg:p-16 pb-10`}>
          <h2 className={`mpl-display text-5xl xl:text-6xl font-semibold ${ink} leading-[0.96] max-w-md drop-shadow-md`}>
            Sign in to your season on record.
          </h2>
          <p className={`mt-4 ${inkSoft} text-sm max-w-sm leading-relaxed drop-shadow-md`}>
            Player profiles, scorecards and the full fixture list from every floodlit night at
            Lohar Wadi.
          </p>
        </div>

        <dl className={`relative mt-10 grid grid-cols-3 divide-x ${statBorder} border-t backdrop-blur-sm bg-white/50 dark:bg-pitch/65`}>
          <div className="px-8 py-8">
            <dt className={`text-[10px] uppercase tracking-[0.22em] ${inkSoft} font-semibold`}>Teams</dt>
            <dd className={`mpl-num text-3xl ${ink} mt-1`}>6</dd>
          </div>
          <div className="px-8 py-8">
            <dt className={`text-[10px] uppercase tracking-[0.22em] ${inkSoft} font-semibold`}>Seasons</dt>
            <dd className="mpl-num text-3xl text-sodium-deep dark:text-sodium mt-1">4</dd>
          </div>
          <div className="px-8 py-8">
            <dt className={`text-[10px] uppercase tracking-[0.22em] ${inkSoft} font-semibold`}>Prize</dt>
            <dd className={`mpl-num text-3xl ${ink} mt-1`}>₹50K</dd>
          </div>
        </dl>
      </div>

      {/* Form side — on mobile carries the photographic underlay */}
      <div className={`relative ${panelBg} lg:order-2 overflow-hidden`}>
        <img
          src="/images/bg2.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.22] dark:opacity-[0.22] lg:hidden"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/70 to-[#f7f4ed] lg:hidden" />
        <div className="absolute inset-0 hidden dark:lg:hidden bg-gradient-to-b from-pitch/85 via-pitch/70 to-[#080f1a]" />

        <AuthPanel
          heading="Portal sign in"
          subheading="Your profile, statistics and schedule, all on record."
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-username" className={labelCls}>
                Username or email
              </label>
              <input
                id="login-username"
                type="text"
                required
                autoComplete="username"
                placeholder="e.g. rohitp"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="login-password" className={labelCls}>
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Compact scoreboard — mobile stand-in for the identity panel */}
            <dl className={`lg:hidden grid grid-cols-3 divide-x ${statBorder} border-y ${ruleBorder}`}>
              <div className="py-4 pr-4">
                <dt className={`text-[9px] uppercase tracking-[0.2em] ${inkSoft} font-semibold`}>Teams</dt>
                <dd className={`mpl-num text-2xl ${ink} mt-0.5`}>6</dd>
              </div>
              <div className="py-4 px-4">
                <dt className={`text-[9px] uppercase tracking-[0.2em] ${inkSoft} font-semibold`}>Seasons</dt>
                <dd className="mpl-num text-2xl text-sodium-deep dark:text-sodium mt-0.5">4</dd>
              </div>
              <div className="py-4 pl-4">
                <dt className={`text-[9px] uppercase tracking-[0.2em] ${inkSoft} font-semibold`}>Prize</dt>
                <dd className={`mpl-num text-2xl ${ink} mt-0.5`}>₹50K</dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-sodium hover:bg-sodium-deep text-pitch font-bold text-sm px-8 py-4 transition-colors cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Authenticating…' : 'Sign in'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className={`pt-5 border-t ${ruleBorder}`}>
            <p className={`text-sm ${inkSoft}`}>
              No account yet?{' '}
              <Link
                to="/register"
                className="text-sodium-deep dark:text-sodium font-semibold border-b border-sodium-deep/40 dark:border-sodium/40 hover:border-current transition-colors"
              >
                Register as a player
              </Link>
            </p>
          </div>
        </AuthPanel>
      </div>
    </div>
  );
};
