import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Menu, X, ArrowRight, LayoutDashboard, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 dark:border-slate-800/80 bg-white/90 dark:bg-[#070d18]/85 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official Main Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-amber-500/30 dark:border-amber-400/30 bg-white dark:bg-slate-900/80 flex items-center justify-center shadow-md shadow-amber-500/10 dark:shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200 p-1">
              <img
                src="/images/mpl-logo-clean.png"
                alt="Malghar Premier League Official Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                MPL <span className="text-amber-600 dark:text-amber-400 font-bold text-sm tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">2026</span>
              </span>
              <span className="text-[10px] tracking-wider text-slate-500 dark:text-slate-400 uppercase font-semibold">
                Malghar Premier League
              </span>
            </div>
          </Link>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Mode Toggle (Prominent in Top Bar) */}
            <ThemeToggle variant="pill" showLabel={true} />

            <Link
              to="/portal/matches"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-white dark:hover:bg-slate-800/70 transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>See Matches & Scores</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/portal/dashboard"
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-amber-500/40 transition group"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-xs uppercase">
                    {profile?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition">
                    Dashboard
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/portal/matches"
                  className="gold-gradient-btn px-4.5 py-2 rounded-xl text-sm font-bold shadow-md flex items-center gap-2"
                >
                  <span>See Matches</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger & Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle variant="icon" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-[#070d18]/98 px-4 pt-4 pb-6 space-y-3 backdrop-blur-2xl max-h-[calc(100vh-80px)] overflow-y-auto">
          {/* Mobile Theme Toggle Strip */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Appearance Theme</span>
            <ThemeToggle variant="pill" showLabel={true} />
          </div>

          <Link
            to="/portal"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-[#174478] to-[#1d5b9f] border border-cyan-400/40 text-white text-sm font-black shadow-lg"
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-cyan-300" />
              <span>See Matches & Scores</span>
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Quick Module Grid for Mobile */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to="/portal/matches"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-amber-400"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="truncate">Matches & Scores</span>
            </Link>
            <Link
              to="/portal/points-table"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-amber-400"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="truncate">Points Table</span>
            </Link>
            <Link
              to="/portal/teams"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-amber-400"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="truncate">6 Teams</span>
            </Link>
            <Link
              to="/portal/players"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-amber-400"
            >
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="truncate">58 Squad</span>
            </Link>
            <Link
              to="/portal/statistics"
              onClick={() => setMobileMenuOpen(false)}
              className="col-span-2 flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-amber-700 dark:text-amber-300 hover:border-amber-400"
            >
              <span className="flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Tournament Honors & Caps</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Link
                to="/portal/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
              >
                Go to Player Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-center py-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block py-2.5 rounded-xl gold-gradient-btn text-xs font-bold"
              >
                Register as Player
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
