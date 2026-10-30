import React from 'react';
import { Link } from 'react-router-dom';

const FRANCHISES = [
  { code: 'LG', name: 'Lakshmikant Group', color: '#174478' },
  { code: 'A11', name: 'Aaradhya 11', color: '#5c86c5' },
  { code: 'DF', name: 'Dharmveer Fighter', color: '#f59e0b' },
  { code: 'S11', name: 'Saish 11', color: '#ea580c' },
  { code: 'SN11', name: 'Shivneri 11', color: '#8b5cf6' },
  { code: 'OM11', name: 'Omkar 11', color: '#06b6d4' },
];

const TOURNAMENT_LINKS = [
  { to: '/portal/matches', label: 'Matches & schedule' },
  { to: '/portal/points-table', label: 'Points table' },
  { to: '/portal/statistics', label: 'Orange & purple cap' },
  { to: '/portal', label: 'All seasons history' },
];

const TEAM_LINKS = [
  { to: '/portal/teams', label: 'Squad lists' },
  { to: '/portal/players', label: 'Player profiles' },
  { to: '/portal/players', label: 'Career records' },
  { to: '/login', label: 'Official admin login' },
];

const linkCls =
  'text-slate-600 dark:text-chalk/60 hover:text-slate-900 dark:hover:text-sodium transition-colors text-sm font-medium';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-20 w-full bg-slate-100 dark:bg-[#04070e] text-slate-700 dark:text-chalk/70 overflow-hidden">
      {/* Restrained stadium texture under the wash */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.08]">
        <img
          src="/images/stadium_floodlit_pitch.jpg"
          alt=""
          aria-hidden
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-12 sm:pt-16 pb-8 sm:pb-10">
        {/* Franchise index — a plain ruled row, not chips */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-300/70 dark:border-chalk/12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-chalk/40">
            The six franchises — season 2026
          </span>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Franchises">
            {FRANCHISES.map((f) => (
              <Link
                key={f.code}
                to={`/portal/teams/${String(f.code || 'team').toLowerCase()}`}
                className="group inline-flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
                <span className="text-xs font-semibold tracking-wide text-slate-600 dark:text-chalk/55 group-hover:text-slate-900 dark:group-hover:text-sodium transition-colors">
                  {f.code}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] gap-10 sm:gap-12 pt-10 sm:pt-12">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3.5">
              <img
                src="/images/mpl-logo-clean.png"
                alt="Malghar Premier League Official Logo"
                className="w-12 h-12 object-contain bg-white dark:bg-chalk/95 rounded-md p-1 shrink-0"
              />
              <div>
                <span className="mpl-display text-2xl text-slate-900 dark:text-chalk leading-none block">
                  Malghar Premier League
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sodium block mt-1.5">
                  Fourth edition — 2026
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-chalk/55 max-w-sm">
              Village cricket, kept on record. Six teams and fifty-eight players, four seasons of
              scorecards from every floodlit night at Lohar Wadi Stadium.
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-chalk/40">
              Official Tournament &amp; Ground Committee
            </p>
          </div>

          {/* Tournament */}
          <nav aria-label="Tournament links">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sodium mb-5">
              Tournament
            </h4>
            <ul className="space-y-3">
              {TOURNAMENT_LINKS.map((l) => (
                <li key={l.to + l.label}>
                  <Link to={l.to} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Teams & players */}
          <nav aria-label="Team and player links">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sodium mb-5">
              Teams &amp; players
            </h4>
            <ul className="space-y-3">
              {TEAM_LINKS.map((l) => (
                <li key={l.to + l.label}>
                  <Link to={l.to} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Venue & contact */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sodium mb-5">
              Ground &amp; contact
            </h4>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-slate-900 dark:text-chalk font-semibold">Lohar Wadi Stadium</dt>
                <dd className="text-slate-600 dark:text-chalk/55 mt-0.5">Malghar village, Maharashtra</dd>
              </div>
              <div className="space-y-1.5 text-slate-600 dark:text-chalk/55">
                <dd>
                  <a href="mailto:contact@malgharpl.com" className={linkCls}>
                    contact@malgharpl.com
                  </a>
                </dd>
                <dd>
                  <a href="tel:+919823000000" className={linkCls}>
                    +91 98230 00000
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-6 border-t border-slate-300/70 dark:border-chalk/12 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-chalk/35">
          <p>© {new Date().getFullYear()} Malghar Premier League. All rights reserved.</p>
          <p className="font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-chalk/40">
            Official village cricket championship
          </p>
        </div>
      </div>
    </footer>
  );
};
