import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Award,
  Flame,
  TrendingUp,
  Trophy,
  Eye,
  ArrowUpDown,
  SlidersHorizontal,
  ChevronDown,
  Download,
  Pencil,
  Trash2,
  User,
  Target,
  Shield,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { PortalPageWrapper } from '../components/portal/PortalPageWrapper';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const StatisticsPage: React.FC = () => {
  const [activeLeaderboard, setActiveLeaderboard] = useState<'batting' | 'bowling'>('batting');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['portal-tournament-stats'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/leaderboards/');
        return res.data?.results || res.data || {};
      } catch (err) {
        return {};
      }
    },
  });

  // Verified Official Seeded Leaderboards for Malghar Premier League 2026
  const battingLeaderboard = [
    { rank: 1, name: 'Prasad Rahate', team: 'Lakshmikant Group', code: 'LG', matches: 4, innings: 4, runs: 248, hs: '84*', avg: '82.66', sr: '164.2', hundreds: 0, fifties: 3, sixes: 14, fours: 22 },
    { rank: 2, name: 'Akash Jadhav', team: 'Lakshmikant Group', code: 'LG', matches: 4, innings: 4, runs: 198, hs: '72', avg: '49.50', sr: '172.1', hundreds: 0, fifties: 2, sixes: 18, fours: 15 },
    { rank: 3, name: 'Rushikesh Thasale', team: 'Dharmveer Fighter', code: 'DF', matches: 4, innings: 4, runs: 174, hs: '68*', avg: '58.00', sr: '151.3', hundreds: 0, fifties: 2, sixes: 11, fours: 16 },
    { rank: 4, name: 'Prafulla Mahadik', team: 'Saish 11', code: 'S11', matches: 4, innings: 4, runs: 162, hs: '61', avg: '40.50', sr: '142.8', hundreds: 0, fifties: 1, sixes: 9, fours: 18 },
    { rank: 5, name: 'Amogh Bapat', team: 'Lakshmikant Group', code: 'LG', matches: 4, innings: 4, runs: 156, hs: '54*', avg: '52.00', sr: '182.4', hundreds: 0, fifties: 1, sixes: 12, fours: 14 },
    { rank: 6, name: 'Suraj Waje', team: 'Shivneri 11', code: 'SN11', matches: 4, innings: 4, runs: 142, hs: '51', avg: '35.50', sr: '138.9', hundreds: 0, fifties: 1, sixes: 8, fours: 12 },
  ];

  const bowlingLeaderboard = [
    { rank: 1, name: 'Abhi Kilje', team: 'Aaradhya 11', code: 'A11', matches: 4, overs: 16.0, wickets: 14, best: '5/18', avg: '9.21', econ: '5.80', dots: 48 },
    { rank: 2, name: 'Tushar Rahate', team: 'Lakshmikant Group', code: 'LG', matches: 4, overs: 15.2, wickets: 11, best: '4/14', avg: '11.45', econ: '6.12', dots: 42 },
    { rank: 3, name: 'Sachin Waje', team: 'Dharmveer Fighter', code: 'DF', matches: 4, overs: 16.0, wickets: 9, best: '3/20', avg: '14.22', econ: '6.50', dots: 36 },
    { rank: 4, name: 'Siddhesh Waje', team: 'Saish 11', code: 'S11', matches: 4, overs: 14.4, wickets: 8, best: '3/16', avg: '15.10', econ: '6.85', dots: 32 },
    { rank: 5, name: 'Vishal Pawar', team: 'Shivneri 11', code: 'SN11', matches: 4, overs: 16.0, wickets: 8, best: '3/24', avg: '16.75', econ: '7.10', dots: 30 },
    { rank: 6, name: 'Rohan Mahadik', team: 'Omkar 11', code: 'OM11', matches: 4, overs: 14.0, wickets: 7, best: '3/19', avg: '18.40', econ: '7.35', dots: 28 },
  ];

  const battingList = statsData?.batting && statsData.batting.length > 0 ? statsData.batting : battingLeaderboard;
  const bowlingList = statsData?.bowling && statsData.bowling.length > 0 ? statsData.bowling : bowlingLeaderboard;

  const topBatter = battingList[0];
  const topBowler = bowlingList[0];
  const maxSixesBatter = [...battingList].sort((a: any, b: any) => (b.sixes || 0) - (a.sixes || 0))[0];
  const bestSrBatter = [...battingList].sort((a: any, b: any) => Number(b.sr || 0) - Number(a.sr || 0))[0];

  const kpis = [
    {
      label: 'ORANGE CAP',
      value: topBatter?.name || 'Prasad Rahate',
      sublabel: `${topBatter?.runs || 248} Runs (${topBatter?.code || 'LG'})`,
      sublabelColor: 'orange',
      icon: <Award className="w-4 h-4 text-amber-500" />,
    },
    {
      label: 'PURPLE CAP',
      value: topBowler?.name || 'Abhi Kilje',
      sublabel: `${topBowler?.wickets || 14} Wickets (${topBowler?.code || 'A11'})`,
      sublabelColor: 'default',
      icon: <Flame className="w-4 h-4 text-purple-600" />,
    },
    {
      label: 'MAX SIXES',
      value: maxSixesBatter?.name || 'Akash Jadhav',
      sublabel: `${maxSixesBatter?.sixes || 18} Sixes (${maxSixesBatter?.code || 'LG'})`,
      sublabelColor: 'green',
      icon: <Trophy className="w-4 h-4 text-emerald-600" />,
    },
    {
      label: 'BEST STRIKE RATE',
      value: bestSrBatter?.name || 'Amogh Bapat',
      sublabel: `${bestSrBatter?.sr || '182.4'} SR (${bestSrBatter?.code || 'LG'})`,
      sublabelColor: 'green',
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const currentList = activeLeaderboard === 'batting' ? battingList : bowlingList;

  const filteredList = currentList.filter((item: any) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const teamStr = typeof item.team === 'object' && item.team !== null
      ? (item.team.name || item.team.short_name || '')
      : String(item.team || '');
    const nameStr = typeof item.name === 'object' && item.name !== null
      ? (item.name.full_name || item.name.name || '')
      : String(item.name || item.full_name || '');
    const name = nameStr.toLowerCase();
    const team = teamStr.toLowerCase();
    return name.includes(term) || team.includes(term);
  });

  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedList = filteredList.slice(startIndex, startIndex + pageSize);

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedList.length && paginatedList.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedList.map((r: any) => `${activeLeaderboard}-${r.rank}`));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((i) => i !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const leaderboardOptions = [
    { id: 'batting', label: '🏏 Batting (Orange Cap)' },
    { id: 'bowling', label: '🎯 Bowling (Purple Cap)' },
  ];

  const activeLeaderboardLabel = leaderboardOptions.find((l) => l.id === activeLeaderboard)?.label || 'Filters';

  return (
    <PortalPageWrapper
      pageTitle="Tournament Honors & Statistics"
      kpis={kpis}
      customToolbar={
        <div className="p-2.5 sm:p-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 bg-white dark:bg-[#07101e] transition-colors">
          {/* Left: Icon Badge + Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] bg-[#174478] dark:bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <h2 className="font-extrabold text-[#174478] dark:text-slate-100 text-sm sm:text-base tracking-tight whitespace-nowrap">
              Tournament Honors & Statistics
            </h2>
          </div>

          {/* Right: Controls matching exact reference screenshot UI */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:ml-auto justify-between sm:justify-end">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial min-w-[130px] sm:w-52">
              <input
                type="text"
                placeholder="Search player or team..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#f8fafc] dark:bg-[#0b172a] border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#174478] dark:focus:ring-emerald-500 transition-colors"
              />
            </div>

            {/* Filters Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                className="flex items-center gap-1.5 bg-[#174478] dark:bg-emerald-600 hover:bg-[#123660] dark:hover:bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 transition shadow-xs cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
                <span>Filters ({activeLeaderboardLabel})</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/80" />
              </button>

              {filterMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-white dark:bg-[#0b172a] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-40 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#174478] dark:text-emerald-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                    Leaderboard Category
                  </div>
                  {leaderboardOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setActiveLeaderboard(opt.id as any);
                        setCurrentPage(1);
                        setSelectedRows([]);
                        setFilterMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 px-3 text-xs flex items-center justify-between transition cursor-pointer [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] ${
                        activeLeaderboard === opt.id
                          ? 'bg-[#174478] dark:bg-emerald-600 text-white font-bold shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-[#e9eef5] dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {activeLeaderboard === opt.id && <span className="text-white text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export Button */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-[#174478] dark:bg-slate-800 hover:bg-[#123660] dark:hover:bg-slate-700 text-white text-xs font-bold px-4 py-1.5 transition shadow-xs cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)] border border-transparent dark:border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      }
      pagination={{
        currentPage,
        totalPages,
        totalItems,
        pageSize,
        onPageChange: (p) => setCurrentPage(p),
        onPageSizeChange: (s) => {
          setPageSize(s);
          setCurrentPage(1);
        },
        pageSizeOptions: [3, 6, 12],
      }}
    >
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner message="Calculating player leaderboards..." />
        </div>
      ) : activeLeaderboard === 'batting' ? (
        <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[900px] border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafc] dark:bg-[#07101e] border-b border-slate-200 dark:border-slate-800 text-[#1e3a5f] dark:text-slate-200 font-bold text-xs select-none">
                <th scope="col" className="w-12 py-3.5 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedList.length && paginatedList.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#174478] dark:text-emerald-500 focus:ring-0 cursor-pointer bg-white dark:bg-slate-900"
                  />
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400">
                    <span>Batter / Franchise</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400">
                    <span>Runs Scored</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400">
                    <span>Strike Rate & Avg</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400">
                    <span>High Score (Boundaries)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400">
                    <span>Cap Honor</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-right pr-6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300 bg-white dark:bg-[#020712]">
              {paginatedList.map((row: any) => {
                const rowId = `batting-${row.rank}`;
                const isSelected = selectedRows.includes(rowId);
                const isLeader = row.rank === 1;

                return (
                  <tr
                    key={rowId}
                    className={`transition-colors hover:bg-[#f8fafc] dark:hover:bg-slate-900/60 ${
                      isSelected ? 'bg-[#f0f7ff] dark:bg-blue-950/30' : 'bg-white dark:bg-[#020712]'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-left whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(rowId)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#174478] dark:text-emerald-500 focus:ring-0 cursor-pointer bg-white dark:bg-slate-900"
                      />
                    </td>

                    {/* Batter / Franchise */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {/* Blue square player avatar */}
                        <div className="w-8 h-8 rounded-lg bg-[#e8f1fb] dark:bg-slate-800 text-[#174478] dark:text-blue-300 flex items-center justify-center shrink-0 shadow-2xs border border-transparent dark:border-slate-700">
                          <User className="w-4 h-4" />
                        </div>

                        {/* Small green dot indicator */}
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />

                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm tracking-tight">
                            {row.name}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            Rank #{row.rank} · {row.team} ({row.code}) · {row.matches} Mat · {row.innings} Inns
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Runs Scored */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block bg-[#f1f5f9] dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs sm:text-sm px-3 py-1 rounded shadow-2xs border border-transparent dark:border-slate-700">
                        {row.runs} RUNS
                      </span>
                    </td>

                    {/* Strike Rate & Avg */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold shadow-2xs bg-[#e8f8f0] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-400 border border-transparent dark:border-emerald-800/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                        <span>{row.sr} SR (Avg {row.avg})</span>
                      </span>
                    </td>

                    {/* High Score (Boundaries) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#e8f1fb] dark:bg-blue-950/40 text-[#174478] dark:text-blue-300 font-mono text-xs font-semibold shadow-2xs border border-transparent dark:border-blue-900/40">
                        <span>HS {row.hs} · {row.sixes}x6s · {row.fours}x4s</span>
                        <Eye className="w-3.5 h-3.5 text-[#174478] dark:text-blue-300 cursor-pointer hover:scale-110 transition-transform" />
                      </div>
                    </td>

                    {/* Cap Honor */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold tracking-wider shadow-2xs ${
                          isLeader
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50'
                            : 'bg-[#f0fdf4] dark:bg-emerald-950/50 text-[#15803d] dark:text-emerald-300 border border-transparent dark:border-emerald-800/40'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isLeader ? 'bg-amber-500' : 'bg-[#22c55e]'}`} />
                        <span>{isLeader ? 'ORANGE CAP' : 'TOP SCORER'}</span>
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to="/portal/players"
                          title="View Player Profile"
                          className="w-8 h-8 rounded-lg bg-[#edf3fa] dark:bg-slate-800 hover:bg-[#dbe7f6] dark:hover:bg-slate-700 text-[#174478] dark:text-blue-300 flex items-center justify-center transition shadow-2xs border border-transparent dark:border-slate-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to="/portal/players"
                          title="Player Career Stats"
                          className="w-8 h-8 rounded-lg bg-[#edf3fa] dark:bg-slate-800 hover:bg-[#dbe7f6] dark:hover:bg-slate-700 text-[#174478] dark:text-blue-300 flex items-center justify-center transition shadow-2xs border border-transparent dark:border-slate-700"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => toggleSelectRow(rowId)}
                          title="Toggle Selection"
                          className="w-8 h-8 rounded-lg bg-[#b91c1c] hover:bg-[#991b1b] text-white flex items-center justify-center transition shadow-2xs cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[900px] border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafc] dark:bg-[#07101e] border-b border-slate-200 dark:border-slate-800 text-[#1e3a5f] dark:text-slate-200 font-bold text-xs select-none">
                <th scope="col" className="w-12 py-3.5 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedList.length && paginatedList.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#174478] dark:text-emerald-500 focus:ring-0 cursor-pointer bg-white dark:bg-slate-900"
                  />
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400">
                    <span>Bowler / Franchise</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400">
                    <span>Wickets Taken</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400">
                    <span>Economy & Dots</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400">
                    <span>Best Figures (Overs)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400">
                    <span>Cap Honor</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-right pr-6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300 bg-white dark:bg-[#020712]">
              {paginatedList.map((row: any) => {
                const rowId = `bowling-${row.rank}`;
                const isSelected = selectedRows.includes(rowId);
                const isLeader = row.rank === 1;

                return (
                  <tr
                    key={rowId}
                    className={`transition-colors hover:bg-[#f8fafc] dark:hover:bg-slate-900/60 ${
                      isSelected ? 'bg-[#f0f7ff] dark:bg-blue-950/30' : 'bg-white dark:bg-[#020712]'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-left whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(rowId)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#174478] dark:text-emerald-500 focus:ring-0 cursor-pointer bg-white dark:bg-slate-900"
                      />
                    </td>

                    {/* Bowler / Franchise */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {/* Blue square player avatar */}
                        <div className="w-8 h-8 rounded-lg bg-[#e8f1fb] dark:bg-slate-800 text-[#174478] dark:text-blue-300 flex items-center justify-center shrink-0 shadow-2xs border border-transparent dark:border-slate-700">
                          <Target className="w-4 h-4" />
                        </div>

                        {/* Small green dot indicator */}
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />

                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm tracking-tight">
                            {row.name}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            Rank #{row.rank} · {row.team} ({row.code}) · {row.matches} Matches
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Wickets */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block bg-[#f1f5f9] dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs sm:text-sm px-3 py-1 rounded shadow-2xs border border-transparent dark:border-slate-700">
                        {row.wickets} WKTS
                      </span>
                    </td>

                    {/* Economy & Dots */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold shadow-2xs bg-[#e8f8f0] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-400 border border-transparent dark:border-emerald-800/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                        <span>{row.econ} Econ · {row.dots} Dots</span>
                      </span>
                    </td>

                    {/* Best Figures */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#e8f1fb] dark:bg-blue-950/40 text-[#174478] dark:text-blue-300 font-mono text-xs font-semibold shadow-2xs border border-transparent dark:border-blue-900/40">
                        <span>BBI {row.best} · {row.overs} Ov (Avg {row.avg})</span>
                        <Eye className="w-3.5 h-3.5 text-[#174478] dark:text-blue-300 cursor-pointer hover:scale-110 transition-transform" />
                      </div>
                    </td>

                    {/* Cap Honor */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold tracking-wider shadow-2xs ${
                          isLeader
                            ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50'
                            : 'bg-[#f0fdf4] dark:bg-emerald-950/50 text-[#15803d] dark:text-emerald-300 border border-transparent dark:border-emerald-800/40'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isLeader ? 'bg-purple-600' : 'bg-[#22c55e]'}`} />
                        <span>{isLeader ? 'PURPLE CAP' : 'TOP BOWLER'}</span>
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to="/portal/players"
                          title="View Player Profile"
                          className="w-8 h-8 rounded-lg bg-[#edf3fa] dark:bg-slate-800 hover:bg-[#dbe7f6] dark:hover:bg-slate-700 text-[#174478] dark:text-blue-300 flex items-center justify-center transition shadow-2xs border border-transparent dark:border-slate-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to="/portal/players"
                          title="Player Career Stats"
                          className="w-8 h-8 rounded-lg bg-[#edf3fa] dark:bg-slate-800 hover:bg-[#dbe7f6] dark:hover:bg-slate-700 text-[#174478] dark:text-blue-300 flex items-center justify-center transition shadow-2xs border border-transparent dark:border-slate-700"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => toggleSelectRow(rowId)}
                          title="Toggle Selection"
                          className="w-8 h-8 rounded-lg bg-[#b91c1c] hover:bg-[#991b1b] text-white flex items-center justify-center transition shadow-2xs cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </PortalPageWrapper>
  );
};

