import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Trophy,
  Calendar,
  Shield,
  Users,
  Award,
  BarChart3,
  User,
  LogOut,
  ExternalLink,
  Flame,
  FileText,
  Bell,
  Sparkles,
  Radio,
  X,
  Gift,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PortalSubTabs } from './PortalSubTabs';
import { ThemeToggle } from '../ui/ThemeToggle';

export const PortalLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });
  const { user, profile, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavClass = (isActive: boolean) =>
    `group relative flex w-full items-center gap-3 p-2.5 px-3 text-left shadow-xs [clip-path:polygon(10px_0,100%_0,calc(100%-10px)_100%,0_100%)] transition-all ${
      isActive
        ? 'bg-gradient-to-br from-[#174478] to-[#0f2d52] dark:from-sky-700 dark:to-blue-900 text-white shadow-sm'
        : 'bg-white dark:bg-[#0e172e] text-slate-700 dark:text-slate-300 hover:bg-[#e9eef5] dark:hover:bg-[#152243] hover:shadow-2xs dark:border dark:border-slate-800/80'
    }`;

  const getIconBoxClass = (isActive: boolean) =>
    `flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg shadow-xs transition-colors ${
      isActive
        ? 'bg-white/20 text-white'
        : 'bg-[#f0f4f9] dark:bg-[#17233f] border border-[#cbd5e1] dark:border-slate-700 text-[#174478] dark:text-sky-300'
    }`;

  // Determine current active module and titles
  const getModuleMeta = () => {
    const path = location.pathname;
    if (path.includes('/portal/matches/new')) {
      return { tab: 'matches', title: 'Schedule New Match', subtitle: 'Add Official Fixture to Tournament Calendar' };
    }
    if (path.includes('/portal/matches/') && !path.endsWith('/matches')) {
      return { tab: 'matches', title: 'Match Scorecard & Results', subtitle: 'Ball-by-Ball Innings Breakdown & Highlights' };
    }
    if (path.includes('/portal/matches')) {
      return { tab: 'matches', title: 'Matches & Fixtures', subtitle: 'Schedule, Fixtures & Match Results' };
    }
    if (path.includes('/portal/points-table')) {
      return { tab: 'points-table', title: 'Points Table', subtitle: 'League Standings & Net Run Rate (NRR)' };
    }
    if (path.includes('/portal/teams/new')) {
      return { tab: 'teams', title: 'Register New Franchise', subtitle: 'Add Official Team Squad to Tournament' };
    }
    if (path.includes('/portal/teams')) {
      return { tab: 'teams', title: 'Teams & Squads', subtitle: 'Tournament Squads' };
    }
    if (path.includes('/portal/players/new')) {
      return { tab: 'players', title: 'Register New Player', subtitle: 'Add Official Village Champion to Tournament Roster' };
    }
    if (path.includes('/portal/players') && path.includes('/history')) {
      return { tab: 'players', title: 'Player Season History', subtitle: 'Career Year-by-Year Records & Honors' };
    }
    if (path.includes('/portal/players/') && !path.endsWith('/players')) {
      return { tab: 'players', title: 'Player Profile & Records', subtitle: 'Official Career Metrics & Performance Cards' };
    }
    if (path.includes('/portal/players')) {
      return { tab: 'players', title: 'Players Roster', subtitle: '58 Official Registered Village Champions' };
    }
    if (path.includes('/portal/statistics')) {
      return { tab: 'statistics', title: 'Tournament Honors', subtitle: 'Orange Cap, Purple Cap & Records' };
    }
    if (path.includes('/portal/awards/new')) {
      return { tab: 'awards', title: 'Add New Tournament Award', subtitle: 'Register Official Tournament Award & Sponsoring Patron' };
    }
    if (path.includes('/portal/awards/') && path.includes('/edit')) {
      return { tab: 'awards', title: 'Edit Tournament Award', subtitle: 'Modify Tournament Award & Sponsorship Details' };
    }
    if (path.includes('/portal/awards')) {
      return { tab: 'awards', title: 'Awards & Sponsors', subtitle: 'Prizes, Trophies, Medals & Sponsoring Patrons' };
    }
    if (path.includes('/portal/dashboard')) {
      return { tab: 'dashboard', title: 'Player Dashboard', subtitle: 'Personal Records & Match Performance' };
    }
    return { tab: 'overview', title: 'Dashboard', subtitle: 'Metrics Across Every Team & Match' };
  };

  const meta = getModuleMeta();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f3f6fa] dark:bg-[#030712] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      {/* LEFT SIDEBAR (EXACT DOMS FORMAT & POLIES) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col shrink-0 overflow-hidden bg-[#f3f6fa] dark:bg-[#070c18] border-r border-[#e2e8f0] dark:border-slate-800 transition-all duration-300 ease-in-out lg:static lg:z-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
          sidebarOpen ? 'w-60' : 'w-0 -translate-x-full lg:w-0 lg:translate-x-0'
        }`}
      >
        {/* LOGO HEADER AREA */}
        <div className="h-20 shrink-0 flex items-center justify-between border-b border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#0b1329] px-4 transition-colors">
          <Link to="/" className="flex items-center gap-3 group">
            {/* Official Logo Image */}
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#174478]/15 dark:border-amber-400/30 bg-white dark:bg-slate-900 flex items-center justify-center shadow-xs p-1 group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/images/mpl-logo-clean.png"
                alt="MPL Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* MPL Official Brand Representation in DOMS high-end bold typography */}
            <div className="flex flex-col">
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-black tracking-tighter text-[#174478] dark:text-sky-400 font-heading">
                  MPL
                </span>
                <span className="text-[9px] font-bold text-[#174478] dark:text-sky-400">®</span>
              </div>
              <span className="text-[7.5px] font-bold tracking-tight text-slate-400 dark:text-slate-500 uppercase -mt-0.5">
                MALGHAR PREMIER LEAGUE 2026
              </span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SIDEBAR NAVIGATION ITEMS (MPL DATA & SECTIONS - NO VISIBLE SCROLLBAR, AUTO SCROLL) */}
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-3.5 py-4 space-y-3.5 text-xs">
          {/* Top Dashboard Button */}
          <NavLink
            to="/portal"
            end
            onClick={handleNavClick}
            className={({ isActive }) => getNavClass(isActive)}
          >
            {({ isActive }) => (
              <>
                <div className={getIconBoxClass(isActive)}>
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold leading-tight">Dashboard</p>
                  <p className={`truncate text-[10px] font-medium ${isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-400'}`}>
                    Metrics Across Every Module
                  </p>
                </div>
              </>
            )}
          </NavLink>

          {/* SECTION 1: LEAGUE TOURNAMENT */}
          <div className="pt-2 space-y-1.5">
            <p className="flex items-center gap-2 px-1 pb-1 text-[10px] font-black uppercase tracking-wider text-[#174478] dark:text-sky-400">
              <span className="h-1 w-3 rounded-full bg-[#174478] dark:bg-sky-400" />
              LEAGUE TOURNAMENT
            </p>

            <div className="space-y-1.5">
              {/* Matches & Scores */}
              <NavLink
                to="/portal/matches"
                onClick={handleNavClick}
                className={({ isActive }) => getNavClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <div className={getIconBoxClass(isActive)}>
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold leading-tight">Matches & Scores</p>
                      <p className={`truncate text-[10px] font-medium ${isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-400'}`}>
                        2 Active Fixtures Scheduled
                      </p>
                    </div>
                  </>
                )}
              </NavLink>

              {/* Points Table */}
              <NavLink
                to="/portal/points-table"
                onClick={handleNavClick}
                className={({ isActive }) => getNavClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <div className={getIconBoxClass(isActive)}>
                      <Trophy className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold leading-tight">Points Table</p>
                      <p className={`truncate text-[10px] font-medium ${isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-400'}`}>
                        Standings & Net Run Rate
                      </p>
                    </div>
                  </>
                )}
              </NavLink>
            </div>
          </div>

          {/* SECTION 2: SQUADS & HONORS */}
          <div className="pt-2 space-y-1.5">
            <p className="flex items-center gap-2 px-1 pb-1 text-[10px] font-black uppercase tracking-wider text-[#174478] dark:text-sky-400">
              <span className="h-1 w-3 rounded-full bg-[#174478] dark:bg-sky-400" />
              SQUADS & HONORS
            </p>

            <div className="space-y-1.5">
              {/* Teams & Squads */}
              <NavLink
                to="/portal/teams"
                onClick={handleNavClick}
                className={({ isActive }) => getNavClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <div className={getIconBoxClass(isActive)}>
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold leading-tight">Teams & Squads</p>
                      <p className={`truncate text-[10px] font-medium ${isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-400'}`}>
                        Tournament Squads
                      </p>
                    </div>
                  </>
                )}
              </NavLink>

              {/* Players Roster */}
              <NavLink
                to="/portal/players"
                onClick={handleNavClick}
                className={({ isActive }) => getNavClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <div className={getIconBoxClass(isActive)}>
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold leading-tight">Players Roster</p>
                      <p className={`truncate text-[10px] font-medium ${isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-400'}`}>
                        58 Registered Champions
                      </p>
                    </div>
                  </>
                )}
              </NavLink>

              {/* Tournament Honors & Stats */}
              <NavLink
                to="/portal/statistics"
                onClick={handleNavClick}
                className={({ isActive }) => getNavClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <div className={getIconBoxClass(isActive)}>
                      <Award className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold leading-tight">Tournament Honors</p>
                      <p className={`truncate text-[10px] font-medium ${isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-400'}`}>
                        Orange & Purple Cap Stats
                      </p>
                    </div>
                  </>
                )}
              </NavLink>

              {/* Tournament Awards & Sponsors */}
              <NavLink
                to="/portal/awards"
                onClick={handleNavClick}
                className={({ isActive }) => getNavClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <div className={getIconBoxClass(isActive)}>
                      <Gift className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold leading-tight">Awards & Sponsors</p>
                      <p className={`truncate text-[10px] font-medium ${isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-400'}`}>
                        32 Prizes, Medals & Patrons
                      </p>
                    </div>
                  </>
                )}
              </NavLink>
            </div>
          </div>

          {/* SECTION 3: PLAYER HUB */}
          <div className="pt-2 space-y-1.5">
            <p className="flex items-center gap-2 px-1 pb-1 text-[10px] font-black uppercase tracking-wider text-[#174478] dark:text-sky-400">
              <span className="h-1 w-3 rounded-full bg-[#174478] dark:bg-sky-400" />
              PLAYER HUB
            </p>

            <div className="space-y-1.5">
              <NavLink
                to="/portal/dashboard"
                onClick={handleNavClick}
                className={({ isActive }) => getNavClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <div className={getIconBoxClass(isActive)}>
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold leading-tight">Player Profile & Records</p>
                      <p className={`truncate text-[10px] font-medium ${isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-400'}`}>
                        Personal Stats & Performance
                      </p>
                    </div>
                  </>
                )}
              </NavLink>
            </div>
          </div>

          {/* SECTION 4: ADMINISTRATION — admin accounts only */}
          {isAdmin && (
            <div className="pt-2 space-y-1.5">
              <p className="flex items-center gap-2 px-1 pb-1 text-[10px] font-black uppercase tracking-wider text-[#174478] dark:text-sky-400">
                <span className="h-1 w-3 rounded-full bg-[#174478] dark:bg-sky-400" />
                ADMINISTRATION
              </p>

              <div className="space-y-1.5">
                <NavLink
                  to="/portal/admin/users"
                  onClick={handleNavClick}
                  className={({ isActive }) => getNavClass(isActive)}
                >
                  {({ isActive }) => (
                    <>
                      <div className={getIconBoxClass(isActive)}>
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold leading-tight">User Management</p>
                        <p className={`truncate text-[10px] font-medium ${isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-400'}`}>
                          Accounts & Payment Verification
                        </p>
                      </div>
                    </>
                  )}
                </NavLink>
              </div>
            </div>
          )}

          {/* Quick Exit to Main Website */}
          <div className="pt-4 mt-2 border-t border-[#e2e8f0] dark:border-slate-800">
            <Link
              to="/"
              onClick={handleNavClick}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#174478] dark:hover:text-sky-300 hover:bg-white dark:hover:bg-[#0e172e] transition group shadow-2xs"
            >
              <span className="text-sm group-hover:-translate-x-0.5 transition-transform">←</span>
              <span>Back to Tournament Website</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* TOP ENTERPRISE HEADER */}
        <header className="h-16 sm:h-20 shrink-0 flex items-center justify-between border-b border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#0b1329] px-3 sm:px-4 shadow-xs z-20 transition-colors">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* POINTING HAND SIDEBAR TOGGLE BUTTON WITH POLYGON CLIP */}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              title={sidebarOpen ? 'Minimize sidebar' : 'Expand sidebar'}
              className="flex h-8 w-9 sm:w-10 shrink-0 items-center justify-center bg-[#174478] dark:bg-[#15233f] text-white shadow-xs [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] border border-[#174478] dark:border-slate-700 hover:bg-[#123660] dark:hover:bg-[#1e3258] transition-colors cursor-pointer"
            >
              <span className="text-base sm:text-lg leading-none select-none">
                {sidebarOpen ? '👈' : '👉'}
              </span>
            </button>

            <span className="hidden h-6 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

            {/* Current Module Title & Subtitle */}
            <div className="flex flex-col leading-tight min-w-0">
              <p className="truncate text-xs sm:text-sm font-black text-[#174478] dark:text-sky-300 uppercase tracking-tight">
                {meta.title}
              </p>
              <p className="hidden sm:block truncate text-[11px] font-medium text-slate-400 dark:text-slate-400">
                {meta.subtitle}
              </p>
            </div>
          </div>

          {/* RIGHT ACTION CONTROLS */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Theme Toggle (Prominent in Portal Top Bar) */}
            <ThemeToggle variant="doms" showLabel={true} />

            {/* USER PROFILE INFO PILL */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-[#f8fafc] dark:bg-[#0e172e] border border-slate-200 dark:border-slate-700 px-2 sm:px-2.5 py-1 sm:py-1.5 [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] shadow-xs">
              <div className="w-6 h-6 sm:w-7 sm:h-7 [clip-path:polygon(4px_0,100%_0,calc(100%-4px)_100%,0_100%)] bg-[#174478] dark:bg-sky-600 overflow-hidden flex items-center justify-center text-white font-bold text-xs">
                {profile?.full_name ? profile.full_name[0] : 'P'}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-[#174478] dark:text-sky-200">
                {profile?.full_name || 'Prasad Rahate'}
              </span>
              <span className="hidden lg:inline-block bg-[#174478] dark:bg-sky-600 text-white text-[9px] font-black uppercase px-2 py-0.5 [clip-path:polygon(4px_0,100%_0,calc(100%-4px)_100%,0_100%)] shadow-xs tracking-wider">
                SUPER ADMINISTRATOR
              </span>
            </div>

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-[#174478] dark:bg-slate-800 text-white text-xs font-bold px-2.5 sm:px-3 py-1.5 [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] hover:bg-[#123660] dark:hover:bg-rose-900/60 dark:border dark:border-slate-700 transition shadow-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* SUB-TABS STRIP - SHOWN ACROSS PORTAL SECTIONS */}
        {!location.pathname.includes('/new') && !location.pathname.includes('/edit') && (
          <PortalSubTabs activeTab={meta.tab} />
        )}

        {/* MAIN BODY SCROLL AREA */}
        <main className="flex-1 overflow-y-auto bg-[#f3f6fa] dark:bg-[#030712] transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
