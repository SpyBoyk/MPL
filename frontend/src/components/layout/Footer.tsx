import React from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Mail,
  MapPin,
  Phone,
  Heart,
  Shield,
  Calendar,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const franchises = [
    { code: 'LG', name: 'Lakshmikant Group', color: '#174478' },
    { code: 'A11', name: 'Aaradhya 11', color: '#5c86c5' },
    { code: 'DF', name: 'Dharmveer Fighter', color: '#f59e0b' },
    { code: 'S11', name: 'Saish 11', color: '#ea580c' },
    { code: 'SN11', name: 'Shivneri 11', color: '#8b5cf6' },
    { code: 'OM11', name: 'Omkar 11', color: '#06b6d4' },
  ];

  return (
    <footer className="relative z-20 w-full border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#040814] text-slate-700 dark:text-slate-300 overflow-hidden transition-colors duration-300">
      {/* Crisp Background Stadium Texture (Unblurred) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <img
          src="/images/stadium_floodlit_pitch.jpg"
          alt="Lohar Wadi Stadium Texture"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-slate-50/90 to-slate-100 dark:from-[#040814]/95 dark:via-[#040814]/90 dark:to-[#02050e]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-8 sm:pb-12">
        {/* TOP FRANCHISE PILL BAR */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8 sm:pb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Official Malghar Franchises · Season 2026
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {franchises.map((f) => (
                <Link
                  key={f.code}
                  to={`/portal/teams/${String(f.code || 'team').toLowerCase()}`}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 hover:border-amber-400 text-[11px] sm:text-xs font-bold text-slate-800 dark:text-white transition hover:-translate-y-0.5"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: f.color }}
                  />
                  <span>{f.code}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN FOOTER GRID (4 COLUMNS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Brand Info (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-500/30 dark:border-amber-400/30 bg-white dark:bg-slate-900 flex items-center justify-center p-1 shadow-md shrink-0">
                <img
                  src="/images/mpl-logo-clean.png"
                  alt="Malghar Premier League Official Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-heading font-black text-xl text-slate-900 dark:text-white tracking-tight block">
                  Malghar Premier League
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase block">
                  4th Edition · Official Digital Portal
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-sm">
              The premier cricket championship of Malghar village. Uniting 1 village, 6 local teams, 58
              players, and passionate village fans under the Lohar Wadi floodlights.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Official Tournament Committee & Ground Committee</span>
            </div>
          </div>

          {/* Tournament Quick Links */}
          <div>
            <h4 className="font-heading font-black text-xs tracking-wider uppercase mb-4 text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <span>Tournament</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-600 dark:text-slate-300">
              <li>
                <Link to="/portal/matches" className="hover:text-amber-600 dark:hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span>Matches & Schedule</span>
                </Link>
              </li>
              <li>
                <Link to="/portal/points-table" className="hover:text-amber-600 dark:hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span>Points Table & Standings</span>
                </Link>
              </li>
              <li>
                <Link to="/portal/statistics" className="hover:text-amber-600 dark:hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span>Orange & Purple Cap</span>
                </Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-amber-600 dark:hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span>All Seasons History</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Franchise & Squads */}
          <div>
            <h4 className="font-heading font-black text-xs tracking-wider uppercase mb-4 text-sky-700 dark:text-cyan-400 flex items-center gap-1.5">
              <span>Teams & Players</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-600 dark:text-slate-300">
              <li>
                <Link to="/portal/teams" className="hover:text-amber-600 dark:hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span>6 Village Teams</span>
                </Link>
              </li>
              <li>
                <Link to="/portal/players" className="hover:text-amber-600 dark:hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span>58 Village Players</span>
                </Link>
              </li>
              <li>
                <Link to="/portal/players" className="hover:text-amber-600 dark:hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span>Player Scores & Records</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-600 dark:hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span>Official Admin Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Venue & Location */}
          <div>
            <h4 className="font-heading font-black text-xs tracking-wider uppercase mb-4 text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <span>Arena & Contact</span>
            </h4>
            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-white block font-bold">Lohar Wadi Stadium</strong>
                  Malghar Village, Maharashtra, India
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                <span>contact@malgharpl.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                <span>+91 98230 00000</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT ROW */}
        <div className="pt-8 mt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Malghar Premier League (MPL). All official rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <span>Official Village Cricket Championship</span>
            <span>•</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">Lohar Wadi Stadium</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
