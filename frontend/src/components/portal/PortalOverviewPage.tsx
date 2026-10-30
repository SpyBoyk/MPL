import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Folder,
  Clock,
  ChevronDown,
  Trophy,
  Calendar,
  Users,
  Shield,
  Award,
  TrendingUp,
  BarChart2,
  CheckCircle2,
  Activity,
  Flame,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { getPlayerPhoto } from '../../utils/playerPhotos';

interface TeamSeasonData {
  teamCode: string;
  teamName: string;
  color: string;
  seasons: {
    [year: string]: {
      matches: number;
      wins: number;
      points: number;
      nrr: string;
      finish: string;
      winRate: number; // percentage
    };
  };
  totalTitles: number;
}

export const PortalOverviewPage: React.FC = () => {
  const [moduleGroupFilter, setModuleGroupFilter] = useState('All Groups');
  const [trendMetric, setTrendMetric] = useState<'points' | 'wins' | 'winRate'>('points');
  const [distSeason, setDistSeason] = useState<string>('all');
  const [matrixFilter, setMatrixFilter] = useState<string>('all');

  // Exact 6 MPL franchises with their verified all-season historical records (2023, 2024, 2025, 2026)
  const teamsData: TeamSeasonData[] = [
    {
      teamCode: 'LG',
      teamName: 'Lakshmikant Group',
      color: '#174478',
      totalTitles: 2,
      seasons: {
        '2023': { matches: 7, wins: 6, points: 12, nrr: '+1.420', finish: 'Champions', winRate: 85.7 },
        '2024': { matches: 8, wins: 6, points: 12, nrr: '+1.680', finish: 'Champions', winRate: 75.0 },
        '2025': { matches: 8, wins: 6, points: 12, nrr: '+1.250', finish: 'Runners-Up', winRate: 75.0 },
        '2026': { matches: 4, wins: 4, points: 8, nrr: '+1.850', finish: 'Active 1st', winRate: 100.0 },
      },
    },
    {
      teamCode: 'DF',
      teamName: 'Dharmveer Fighter',
      color: '#f59e0b',
      totalTitles: 1,
      seasons: {
        '2023': { matches: 5, wins: 3, points: 6, nrr: '+0.100', finish: '3rd Place', winRate: 60.0 },
        '2024': { matches: 7, wins: 5, points: 10, nrr: '+0.820', finish: 'Runners-Up', winRate: 71.4 },
        '2025': { matches: 8, wins: 6, points: 12, nrr: '+1.550', finish: 'Champions', winRate: 75.0 },
        '2026': { matches: 4, wins: 3, points: 6, nrr: '+0.920', finish: 'Active 2nd', winRate: 75.0 },
      },
    },
    {
      teamCode: 'A11',
      teamName: 'Aaradhya 11',
      color: '#5c86c5',
      totalTitles: 0,
      seasons: {
        '2023': { matches: 6, wins: 4, points: 8, nrr: '+0.650', finish: 'Runners-Up', winRate: 66.7 },
        '2024': { matches: 6, wins: 4, points: 8, nrr: '+0.350', finish: '3rd Place', winRate: 66.7 },
        '2025': { matches: 6, wins: 4, points: 8, nrr: '+0.400', finish: '3rd Place', winRate: 66.7 },
        '2026': { matches: 4, wins: 2, points: 4, nrr: '+0.150', finish: 'Active 3rd', winRate: 50.0 },
      },
    },
    {
      teamCode: 'S11',
      teamName: 'Saish 11',
      color: '#ea580c',
      totalTitles: 0,
      seasons: {
        '2023': { matches: 5, wins: 2, points: 4, nrr: '-0.420', finish: '4th Place', winRate: 40.0 },
        '2024': { matches: 6, wins: 3, points: 6, nrr: '-0.250', finish: '4th Place', winRate: 50.0 },
        '2025': { matches: 6, wins: 3, points: 6, nrr: '-0.150', finish: '4th Place', winRate: 50.0 },
        '2026': { matches: 4, wins: 2, points: 4, nrr: '-0.340', finish: 'Active 4th', winRate: 50.0 },
      },
    },
    {
      teamCode: 'SN11',
      teamName: 'Shivneri 11',
      color: '#8b5cf6',
      totalTitles: 0,
      seasons: {
        '2023': { matches: 5, wins: 1, points: 2, nrr: '-0.850', finish: '5th Place', winRate: 20.0 },
        '2024': { matches: 5, wins: 2, points: 4, nrr: '-0.650', finish: '5th Place', winRate: 40.0 },
        '2025': { matches: 5, wins: 2, points: 4, nrr: '-0.720', finish: '5th Place', winRate: 40.0 },
        '2026': { matches: 4, wins: 1, points: 2, nrr: '-0.880', finish: 'Active 5th', winRate: 25.0 },
      },
    },
    {
      teamCode: 'OM11',
      teamName: 'Omkar 11',
      color: '#06b6d4',
      totalTitles: 0,
      seasons: {
        '2023': { matches: 5, wins: 1, points: 2, nrr: '-1.100', finish: '6th Place', winRate: 20.0 },
        '2024': { matches: 5, wins: 1, points: 2, nrr: '-1.450', finish: '6th Place', winRate: 20.0 },
        '2025': { matches: 5, wins: 1, points: 2, nrr: '-1.500', finish: '6th Place', winRate: 20.0 },
        '2026': { matches: 4, wins: 0, points: 0, nrr: '-1.690', finish: 'Active 6th', winRate: 0.0 },
      },
    },
  ];

  const seasonsList = ['2023', '2024', '2025', '2026'];

  // Verified official Season 2026 Live Standings for Points Table Chart
  const season2026Standings = [
    { rank: 1, team: 'Lakshmikant Group', code: 'LG', color: '#174478', p: 4, w: 4, l: 0, pts: 8, nrr: '+1.850', status: 'QUALIFIED' },
    { rank: 2, team: 'Dharmveer Fighter', code: 'DF', color: '#f59e0b', p: 4, w: 3, l: 1, pts: 6, nrr: '+0.920', status: 'QUALIFIED' },
    { rank: 3, team: 'Aaradhya 11', code: 'A11', color: '#5c86c5', p: 4, w: 2, l: 2, pts: 4, nrr: '+0.150', status: 'TOP 4' },
    { rank: 4, team: 'Saish 11', code: 'S11', color: '#ea580c', p: 4, w: 2, l: 2, pts: 4, nrr: '-0.340', status: 'TOP 4' },
    { rank: 5, team: 'Shivneri 11', code: 'SN11', color: '#8b5cf6', p: 4, w: 1, l: 3, pts: 2, nrr: '-0.880', status: 'ELIMINATED' },
    { rank: 6, team: 'Omkar 11', code: 'OM11', color: '#06b6d4', p: 4, w: 0, l: 4, pts: 0, nrr: '-1.690', status: 'ELIMINATED' },
  ];
  const getMetricValue = (team: TeamSeasonData, year: string) => {
    const s = team.seasons[year];
    if (!s) return 0;
    if (trendMetric === 'points') return s.points;
    if (trendMetric === 'wins') return s.wins;
    return s.winRate;
  };

  const maxMetricVal = trendMetric === 'points' ? 14 : trendMetric === 'wins' ? 8 : 100;

  // Distribution calculations for Donut Chart
  const getTeamDistShare = (team: TeamSeasonData) => {
    if (distSeason === 'all') {
      return seasonsList.reduce((acc, y) => acc + (team.seasons[y]?.points || 0), 0);
    }
    return team.seasons[distSeason]?.points || 0;
  };

  const totalDistPoints = teamsData.reduce((acc, t) => acc + getTeamDistShare(t), 0);

  // Calculate donut offsets
  let cumulativePercent = 0;
  const donutSegments = teamsData.map((team) => {
    const pts = getTeamDistShare(team);
    const pct = totalDistPoints > 0 ? (pts / totalDistPoints) * 100 : 0;
    const dashLength = (pct / 100) * 238.76; // 2 * pi * 38 ≈ 238.76
    const offset = -(cumulativePercent / 100) * 238.76;
    cumulativePercent += pct;
    return {
      ...team,
      points: pts,
      percentage: pct.toFixed(1),
      dashArray: `${dashLength.toFixed(1)} 240`,
      offset: offset.toFixed(1),
    };
  });

  return (
    <div className="relative min-h-full bg-[#f4f7fb] dark:bg-[#030712] p-4 sm:p-6 space-y-4 text-slate-800 dark:text-slate-100 transition-colors">
      {/* MODULE GROUP HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#0b1329] p-3 px-4 rounded-lg border border-[#e2e8f0] dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-[#174478] dark:text-sky-400 fill-[#174478]/10" />
          <span className="text-[12px] font-bold tracking-wider uppercase text-[#174478] dark:text-sky-400">
            MODULE GROUP
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase hidden sm:inline">Scope:</span>
          <div className="relative">
            <select
              value={moduleGroupFilter}
              onChange={(e) => setModuleGroupFilter(e.target.value)}
              className="appearance-none bg-[#f8fafc] dark:bg-[#121c32] border border-[#cbd5e1] dark:border-slate-700 rounded-md px-3 py-1.5 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#174478] focus:outline-none focus:ring-1 focus:ring-[#174478] cursor-pointer"
            >
              <option value="All Groups">All Groups & All Seasons (2023–2026)</option>
              <option value="Group A">Group A Fixtures</option>
              <option value="Group B">Group B Fixtures</option>
              <option value="Playoffs">Playoffs & Grand Finale</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* TOURNAMENT LEADERS: COMPACT USER UI PROFILE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 1. BEST BATSMAN USER UI CARD */}
        <Link
          to="/portal/players/1"
          className="bg-white dark:bg-[#0b1329] rounded-xl border border-slate-200/90 dark:border-slate-800 p-3 hover:border-[#174478] dark:hover:border-sky-500 hover:shadow-xs transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={getPlayerPhoto(1, 'Prasad Rahate')}
                  alt="Prasad Rahate"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400/90 shadow-2xs group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/action-batsman.png';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-[#174478] dark:group-hover:text-sky-300 transition-colors leading-tight">
                    Prasad Rahate
                  </h3>
                  <span className="text-[9px] font-bold text-slate-400">#18</span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                  Lakshmikant Group (LG)
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700/60 shrink-0">
              Orange Cap
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center">
            <div className="bg-[#f8fafc] dark:bg-[#121c32] rounded-md py-1 px-1 border border-slate-100 dark:border-slate-800">
              <span className="text-[8px] font-bold text-slate-400 uppercase block">Runs</span>
              <span className="text-[11px] font-black text-slate-900 dark:text-white block leading-tight">248</span>
            </div>
            <div className="bg-[#f8fafc] dark:bg-[#121c32] rounded-md py-1 px-1 border border-slate-100 dark:border-slate-800">
              <span className="text-[8px] font-bold text-slate-400 uppercase block">Avg</span>
              <span className="text-[11px] font-black text-[#174478] dark:text-sky-400 block leading-tight">82.66</span>
            </div>
            <div className="bg-[#f8fafc] dark:bg-[#121c32] rounded-md py-1 px-1 border border-slate-100 dark:border-slate-800">
              <span className="text-[8px] font-bold text-slate-400 uppercase block">SR</span>
              <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 block leading-tight">164.2</span>
            </div>
          </div>
        </Link>

        {/* 2. BEST BOWLER USER UI CARD */}
        <Link
          to="/portal/players/11"
          className="bg-white dark:bg-[#0b1329] rounded-xl border border-slate-200/90 dark:border-slate-800 p-3 hover:border-[#174478] dark:hover:border-sky-500 hover:shadow-xs transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={getPlayerPhoto(11, 'Abhi Kilje')}
                  alt="Abhi Kilje"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-400/90 shadow-2xs group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/action-bowler.png';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-[#174478] dark:group-hover:text-sky-300 transition-colors leading-tight">
                    Abhi Kilje
                  </h3>
                  <span className="text-[9px] font-bold text-slate-400">#9</span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                  Aaradhya 11 (A11)
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700/60 shrink-0">
              Purple Cap
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center">
            <div className="bg-[#f8fafc] dark:bg-[#121c32] rounded-md py-1 px-1 border border-slate-100 dark:border-slate-800">
              <span className="text-[8px] font-bold text-slate-400 uppercase block">Wickets</span>
              <span className="text-[11px] font-black text-slate-900 dark:text-white block leading-tight">14</span>
            </div>
            <div className="bg-[#f8fafc] dark:bg-[#121c32] rounded-md py-1 px-1 border border-slate-100 dark:border-slate-800">
              <span className="text-[8px] font-bold text-slate-400 uppercase block">Econ</span>
              <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 block leading-tight">5.80</span>
            </div>
            <div className="bg-[#f8fafc] dark:bg-[#121c32] rounded-md py-1 px-1 border border-slate-100 dark:border-slate-800">
              <span className="text-[8px] font-bold text-slate-400 uppercase block">BBI</span>
              <span className="text-[11px] font-black text-purple-700 dark:text-purple-300 block leading-tight">5/18</span>
            </div>
          </div>
        </Link>

        {/* 3. BEST TEAM USER UI CARD */}
        <Link
          to="/portal/teams/lakshmikant-group"
          className="bg-white dark:bg-[#0b1329] rounded-xl border border-slate-200/90 dark:border-slate-800 p-3 hover:border-[#174478] dark:hover:border-sky-500 hover:shadow-xs transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-emerald-500/90 shadow-2xs bg-slate-900 relative group-hover:scale-105 transition-transform">
                  <img
                    src="/images/cricket_golden_trophy.jpg"
                    alt="Lakshmikant Group"
                    className="w-full h-full object-cover"
                  />
                  <img
                    src={getPlayerPhoto(1, 'Prasad Rahate')}
                    alt="Captain"
                    className="w-4 h-4 rounded-full object-cover border border-white absolute bottom-0 right-0 shadow-2xs"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-[#174478] dark:group-hover:text-sky-300 transition-colors leading-tight">
                    Lakshmikant Group
                  </h3>
                  <span className="text-[9px] font-bold text-[#174478] dark:text-sky-400">LG</span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                  Capt: Prasad Rahate · 2x Champ
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60 shrink-0">
              Rank #1
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center">
            <div className="bg-[#f8fafc] dark:bg-[#121c32] rounded-md py-1 px-1 border border-slate-100 dark:border-slate-800">
              <span className="text-[8px] font-bold text-slate-400 uppercase block">Points</span>
              <span className="text-[11px] font-black text-slate-900 dark:text-white block leading-tight">8 PTS</span>
            </div>
            <div className="bg-[#f8fafc] dark:bg-[#121c32] rounded-md py-1 px-1 border border-slate-100 dark:border-slate-800">
              <span className="text-[8px] font-bold text-slate-400 uppercase block">Record</span>
              <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 block leading-tight">4W - 0L</span>
            </div>
            <div className="bg-[#f8fafc] dark:bg-[#121c32] rounded-md py-1 px-1 border border-slate-100 dark:border-slate-800">
              <span className="text-[8px] font-bold text-slate-400 uppercase block">NRR</span>
              <span className="text-[11px] font-black text-[#174478] dark:text-sky-400 block leading-tight">+1.850</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Points Table Chart & Standings (Season 2026 Live) */}
      <div className="bg-white dark:bg-[#0b1329] rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3.5 transition-colors">
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-xs shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#174478] dark:text-sky-300 tracking-tight">
                  Points Table Chart & Standings (Season 2026 Live)
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Standings
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Official franchise rankings, points progress bar chart, and net run rate (NRR)
              </p>
            </div>
          </div>
          <Link
            to="/portal/points-table"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174478] dark:text-sky-400 hover:text-[#123660] dark:hover:text-sky-300 hover:underline px-2.5 py-1 rounded-md bg-[#edf3fa] dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 transition"
          >
            <span>Full Points Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Desktop Table Column Labels */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-3 py-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
          <div className="col-span-4">Rank & Franchise</div>
          <div className="col-span-2 text-center">Record (P / W / L)</div>
          <div className="col-span-2 text-center">Net Run Rate (NRR)</div>
          <div className="col-span-3 text-center">Points Progress (Max 8 Pts)</div>
          <div className="col-span-1 text-right">Status</div>
        </div>

        {/* Premium Standings Rows */}
        <div className="space-y-2">
          {season2026Standings.map((team) => {
            const isTop1 = team.rank === 1;
            const isTop2 = team.rank === 2;
            const isTop4 = team.rank <= 4;
            const progressPercent = Math.min(100, Math.max(12, (team.pts / 8) * 100));

            return (
              <div
                key={team.code}
                className="grid grid-cols-1 md:grid-cols-12 items-center gap-2.5 md:gap-3 p-2.5 sm:p-3 rounded-xl bg-[#f8fafc] dark:bg-[#070e1c] hover:bg-slate-100/80 dark:hover:bg-[#0c162c] border border-slate-200/70 dark:border-slate-800 transition-all text-xs group"
              >
                {/* 1. Rank & Franchise Name */}
                <div className="col-span-1 md:col-span-4 flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-lg [clip-path:polygon(4px_0,100%_0,calc(100%-4px)_100%,0_100%)] flex items-center justify-center font-black text-[11px] shrink-0 shadow-2xs ${
                      isTop1
                        ? 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-slate-950'
                        : isTop2
                        ? 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-900'
                        : isTop4
                        ? 'bg-gradient-to-br from-sky-100 to-blue-200 dark:from-sky-950 dark:to-blue-900 text-[#174478] dark:text-sky-300 border border-sky-300/40'
                        : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    #{team.rank}
                  </span>

                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs ring-2 ring-white dark:ring-[#070e1c]"
                    style={{ backgroundColor: team.color }}
                  />

                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate block leading-tight group-hover:text-[#174478] dark:group-hover:text-sky-400 transition-colors">
                      {team.team}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                      {team.code} Franchise
                    </span>
                  </div>
                </div>

                {/* 2. Match Record (Played / Won / Lost) */}
                <div className="col-span-1 md:col-span-2 flex md:justify-center items-center gap-1.5 text-xs">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 font-mono font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
                    <span>{team.p} Mat</span>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="text-emerald-700 dark:text-emerald-400">{team.w}W</span>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="text-rose-600 dark:text-rose-400">{team.l}L</span>
                  </span>
                </div>

                {/* 3. Net Run Rate (NRR) */}
                <div className="col-span-1 md:col-span-2 flex md:justify-center items-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold shadow-2xs ${
                      team.nrr.startsWith('+')
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/50'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/50'
                    }`}
                  >
                    <span>{team.nrr}</span>
                  </span>
                </div>

                {/* 4. Points Progress Bar Chart */}
                <div className="col-span-1 md:col-span-3 flex items-center gap-2.5">
                  <div className="w-full h-3 bg-slate-200/80 dark:bg-slate-800/90 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-700 shadow-sm"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: team.color,
                      }}
                    />
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-[11px] font-mono font-extrabold text-[#174478] dark:text-sky-300 border border-slate-200 dark:border-slate-700 shrink-0 min-w-[45px] justify-center shadow-2xs">
                    {team.pts} pts
                  </span>
                </div>

                {/* 5. Qualification Status Badge */}
                <div className="col-span-1 md:col-span-1 flex md:justify-end items-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold [clip-path:polygon(4px_0,100%_0,calc(100%-4px)_100%,0_100%)] shadow-2xs ${
                      team.status === 'QUALIFIED'
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60'
                        : team.status === 'TOP 4'
                        ? 'bg-blue-100 dark:bg-sky-950/80 text-[#174478] dark:text-sky-300 border border-blue-200 dark:border-sky-800/60'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {team.status === 'QUALIFIED' ? 'Qualified' : team.status === 'TOP 4' ? 'Top 4' : 'Active'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Notes Strip */}
        <div className="flex flex-wrap items-center justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80 gap-2">
          <span>• Top 2 franchises advance to the Grand Final, #3 and #4 contest the Eliminator.</span>
          <span className="font-semibold text-[#174478] dark:text-sky-400">All matches played at Lohar Wadi Stadium</span>
        </div>
      </div>

      {/* TOP GRID: TREND (ALL SEASONS PROGRESS) & OVERALL DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT CARD: TREND CHART (TEAMS PROGRESS ACROSS ALL SEASONS 2023, 2024, 2025, 2026) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0b1329] rounded-lg border border-[#e2e8f0] dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#174478] dark:text-sky-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#174478] dark:text-sky-300">
                TEAMS PROGRESS ACROSS ALL SEASONS (2023–2026)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">Metric:</span>
              <div className="relative">
                <select
                  value={trendMetric}
                  onChange={(e) => setTrendMetric(e.target.value as any)}
                  className="appearance-none bg-[#f8fafc] dark:bg-[#121c32] border border-[#cbd5e1] dark:border-slate-700 rounded px-2.5 py-1 pr-6 text-[11px] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none"
                >
                  <option value="points">Points Won</option>
                  <option value="wins">Matches Won</option>
                  <option value="winRate">Win % Rate</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Bar Chart Canvas with All 4 Seasons Grouped Side-by-Side */}
          <div className="relative pt-6 pb-2 px-2 flex-1 min-h-[240px] flex flex-col justify-between">
            {/* Horizontal Dashed Gridlines */}
            <div className="absolute inset-x-8 top-8 bottom-12 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full relative">
                <span className="absolute -left-6 -top-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                  {trendMetric === 'winRate' ? '100%' : trendMetric === 'wins' ? '8' : '14'}
                </span>
              </div>
              <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full relative">
                <span className="absolute -left-6 -top-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                  {trendMetric === 'winRate' ? '50%' : trendMetric === 'wins' ? '4' : '7'}
                </span>
              </div>
              <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full relative">
                <span className="absolute -left-6 -top-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500">0</span>
              </div>
            </div>

            {/* 4 Season Clusters (2023, 2024, 2025, 2026) */}
            <div className="grid grid-cols-4 items-end h-48 z-10 pl-6 pr-2 gap-2 sm:gap-4">
              {seasonsList.map((year) => (
                <div key={year} className="flex flex-col items-center justify-end h-full group">
                  {/* Grouped 6 Team Bars for this Season */}
                  <div className="flex items-end justify-center gap-0.5 sm:gap-1.5 h-full w-full px-0.5 sm:px-1 py-1 rounded bg-slate-50/70 dark:bg-slate-900/60 border border-slate-100/80 dark:border-slate-800">
                    {teamsData.map((team) => {
                      const val = getMetricValue(team, year);
                      const heightPct = Math.max(8, Math.min(100, Math.round((val / maxMetricVal) * 100)));
                      const seasonRec = team.seasons[year];

                      return (
                        <div
                          key={team.teamCode}
                          style={{ height: `${heightPct}%`, backgroundColor: team.color }}
                          className="w-1.5 sm:w-2.5 rounded-t-xs shadow-2xs transition-all hover:scale-y-105 hover:brightness-110 cursor-pointer relative"
                          title={`${team.teamName} (${year}): ${val} ${trendMetric === 'winRate' ? '%' : trendMetric === 'wins' ? 'Wins' : 'Pts'} · ${seasonRec?.finish || ''}`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-[11px] font-bold text-[#174478] dark:text-sky-300">{year}</span>
                    {year === '2026' && (
                      <span className="px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-extrabold text-[8px] uppercase tracking-wide">
                        Live
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color-Coded Franchise Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
            {teamsData.map((team) => (
              <div key={team.teamCode} className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0"
                  style={{ backgroundColor: team.color }}
                />
                <span className="truncate">
                  {team.teamName} <strong className="text-slate-800 dark:text-slate-200">({team.teamCode})</strong>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CARD: OVERALL DISTRIBUTION (MULTI-SEASON WIN & POINTS SHARE DONUT) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0b1329] rounded-lg border border-[#e2e8f0] dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#174478] dark:text-sky-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#174478] dark:text-sky-300">
                POINTS DISTRIBUTION
              </span>
            </div>
            <div className="relative">
              <select
                value={distSeason}
                onChange={(e) => setDistSeason(e.target.value)}
                className="appearance-none bg-[#f8fafc] dark:bg-[#121c32] border border-[#cbd5e1] dark:border-slate-700 rounded px-2.5 py-1 pr-6 text-[11px] font-semibold text-slate-600 dark:text-slate-200 cursor-pointer focus:outline-none"
              >
                <option value="all">All Seasons (2023–2026)</option>
                <option value="2026">Season 2026 (Live)</option>
                <option value="2025">Season 2025</option>
                <option value="2024">Season 2024</option>
                <option value="2023">Season 2023</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Donut Chart with Center Total */}
          <div className="flex flex-col items-center justify-center py-3">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {donutSegments.map((seg) => (
                  <circle
                    key={seg.teamCode}
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth="15"
                    strokeDasharray={seg.dashArray}
                    strokeDashoffset={seg.offset}
                    className="transition-all duration-300"
                  />
                ))}
              </svg>

              {/* Center Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-[#174478] dark:text-sky-300 leading-none">
                  {totalDistPoints}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  POINTS
                </span>
                <span className="text-[8px] font-semibold text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                  {distSeason === 'all' ? 'All Seasons' : `Season ${distSeason}`}
                </span>
              </div>
            </div>
          </div>

          {/* Team Breakdown list with Counts & Percentages */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
            {donutSegments.map((item) => (
              <div key={item.teamCode} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0 pr-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.teamCode}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.points} pts</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM CARD: ALL-SEASONS PERFORMANCE & STANDINGS PROGRESSION MATRIX */}
      <div className="bg-white dark:bg-[#0b1329] rounded-lg border border-[#e2e8f0] dark:border-slate-800 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#174478] dark:text-sky-400" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#174478] dark:text-sky-300">
                ALL-SEASONS PERFORMANCE & STANDINGS PROGRESSION MATRIX
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tracking every franchise's points, podium finish, and win trajectory across 2023, 2024, 2025, and 2026.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">Filter Franchise:</span>
            <div className="relative">
              <select
                value={matrixFilter}
                onChange={(e) => setMatrixFilter(e.target.value)}
                className="appearance-none bg-[#f8fafc] dark:bg-[#121c32] border border-[#cbd5e1] dark:border-slate-700 rounded px-2.5 py-1 pr-6 text-[11px] font-semibold text-slate-600 dark:text-slate-200 cursor-pointer focus:outline-none"
              >
                <option value="all">All 6 Franchises</option>
                {teamsData.map((t) => (
                  <option key={t.teamCode} value={t.teamCode}>
                    {t.teamName} ({t.teamCode})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Matrix Progression Table */}
        <div className="pt-3 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafc] dark:bg-[#0e172e] border-b border-[#e2e8f0] dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Franchise</th>
                <th className="py-2.5 px-3">2023 Season</th>
                <th className="py-2.5 px-3">2024 Season</th>
                <th className="py-2.5 px-3">2025 Season</th>
                <th className="py-2.5 px-3 bg-blue-50/60 dark:bg-sky-950/40 text-[#174478] dark:text-sky-300">2026 (Live)</th>
                <th className="py-2.5 px-3 text-center">All-Time Cumulative</th>
                <th className="py-2.5 px-3 text-center">Titles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] dark:divide-slate-800">
              {teamsData
                .filter((t) => matrixFilter === 'all' || t.teamCode === matrixFilter)
                .map((team) => {
                  const s23 = team.seasons['2023'];
                  const s24 = team.seasons['2024'];
                  const s25 = team.seasons['2025'];
                  const s26 = team.seasons['2026'];

                  const totalCareerPoints = s23.points + s24.points + s25.points + s26.points;
                  const totalCareerWins = s23.wins + s24.wins + s25.wins + s26.wins;
                  const totalCareerMatches = s23.matches + s24.matches + s25.matches + s26.matches;
                  const overallWinPct = ((totalCareerWins / totalCareerMatches) * 100).toFixed(1);

                  return (
                    <tr key={team.teamCode} className="hover:bg-[#f8fafc] dark:hover:bg-[#121c32] transition-colors">
                      {/* Franchise */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                            style={{ backgroundColor: team.color }}
                          />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block leading-tight">{team.teamName}</span>
                            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">({team.teamCode})</span>
                          </div>
                        </div>
                      </td>

                      {/* 2023 Season */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{s23.points} pts</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{s23.wins}W / {s23.matches}M</span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${(s23.points / 14) * 100}%`, backgroundColor: team.color }}
                            />
                          </div>
                          <span className="inline-block text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                            {s23.finish === 'Champions' ? '🏆 Champions' : s23.finish}
                          </span>
                        </div>
                      </td>

                      {/* 2024 Season */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{s24.points} pts</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{s24.wins}W / {s24.matches}M</span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${(s24.points / 14) * 100}%`, backgroundColor: team.color }}
                            />
                          </div>
                          <span className="inline-block text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                            {s24.finish === 'Champions' ? '🏆 Champions' : s24.finish}
                          </span>
                        </div>
                      </td>

                      {/* 2025 Season */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{s25.points} pts</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{s25.wins}W / {s25.matches}M</span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${(s25.points / 14) * 100}%`, backgroundColor: team.color }}
                            />
                          </div>
                          <span className="inline-block text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                            {s25.finish === 'Champions' ? '🏆 Champions' : s25.finish}
                          </span>
                        </div>
                      </td>

                      {/* 2026 Season (Live) */}
                      <td className="py-3 px-3 bg-blue-50/30 dark:bg-sky-950/20">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-extrabold text-[#174478] dark:text-sky-300">{s26.points} pts</span>
                            <span className="text-[10px] text-[#174478] dark:text-sky-400 font-bold">{s26.wins}W / {s26.matches}M</span>
                          </div>
                          <div className="w-24 h-1.5 bg-blue-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${(s26.points / 8) * 100}%`, backgroundColor: team.color }}
                            />
                          </div>
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 px-1.5 py-0.5 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {s26.finish}
                          </span>
                        </div>
                      </td>

                      {/* All-Time Cumulative */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-extrabold text-slate-900 dark:text-white text-sm">{totalCareerPoints} PTS</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            {totalCareerWins} Wins · {overallWinPct}% Win
                          </span>
                        </div>
                      </td>

                      {/* Titles */}
                      <td className="py-3 px-3 text-center">
                        {team.totalTitles > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-700/60 text-amber-800 dark:text-amber-300 rounded-full font-bold text-[11px] shadow-2xs">
                            🏆 {team.totalTitles} {team.totalTitles === 1 ? 'Title' : 'Titles'}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-600 font-medium text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
