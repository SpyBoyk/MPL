import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  SlidersHorizontal,
  Flame,
  Pencil,
  Trash2,
  ArrowUpDown,
  ChevronDown,
  Download,
  Plus,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { PortalPageWrapper } from '../components/portal/PortalPageWrapper';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Default mock matches if API returns empty
const defaultMatches = [
  { id: 1, match_number: 1, team1: 'Lakshmikant Group', team2: 'Saish 11', score1: '168/4 (20)', score2: '165/8 (20)', status: 'completed', stage: 'Group Stage', venue: 'Lohar Wadi Stadium', date: '2026-11-01', time: '07:30 PM' },
  { id: 2, match_number: 2, team1: 'Dharmveer Fighter', team2: 'Aaradhya 11', score1: '142/3 (15.2)', score2: '141/9 (20)', status: 'live', stage: 'Group Stage', venue: 'Lohar Wadi Stadium', date: '2026-11-02', time: '07:30 PM' },
  { id: 3, match_number: 3, team1: 'Shivneri 11', team2: 'Omkar 11', score1: '175/6 (20)', score2: '130/10 (17.4)', status: 'completed', stage: 'Group Stage', venue: 'Lohar Wadi Stadium', date: '2026-11-03', time: '07:30 PM' },
  { id: 4, match_number: 4, team1: 'Lakshmikant Group', team2: 'Dharmveer Fighter', score1: '-', score2: '-', status: 'scheduled', stage: 'Group Stage', venue: 'Lohar Wadi Stadium', date: '2026-11-04', time: '07:30 PM' },
  { id: 5, match_number: 5, team1: 'Aaradhya 11', team2: 'Saish 11', score1: '-', score2: '-', status: 'scheduled', stage: 'Group Stage', venue: 'Lohar Wadi Stadium', date: '2026-11-05', time: '07:30 PM' },
  { id: 6, match_number: 6, team1: 'Shivneri 11', team2: 'Lakshmikant Group', score1: '-', score2: '-', status: 'scheduled', stage: 'Group Stage', venue: 'Lohar Wadi Stadium', date: '2026-11-06', time: '07:30 PM' },
];

export const MatchesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'fixtures' | 'results'>('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const navigate = useNavigate();

  const { data: matches, isLoading } = useQuery({
    queryKey: ['portal-matches-list', statusFilter],
    queryFn: async () => {
      let url = '/matches/';
      if (statusFilter === 'live') url = '/matches/?status=live';
      else if (statusFilter === 'fixtures') url = '/fixtures/';
      else if (statusFilter === 'results') url = '/results/';

      const res = await apiClient.get(url);
      return res.data?.results || res.data || [];
    },
  });

  const customMatches = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('mpl_custom_matches_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  // Calculate counts for KPI summary cards
  const sourceMatches = React.useMemo(() => {
    const apiOrMock = matches && matches.length > 0 ? matches : defaultMatches;
    return [...customMatches, ...apiOrMock];
  }, [customMatches, matches]);

  const totalCount = sourceMatches.length;
  const completedCount = sourceMatches.filter((m: any) => m.status === 'completed').length;
  const liveCount = sourceMatches.filter((m: any) => m.status === 'live').length;
  const upcomingCount = sourceMatches.filter((m: any) => m.status === 'scheduled').length;

  const kpis = [
    {
      label: 'TOTAL MATCHES',
      value: totalCount,
      sublabel: 'MPL 2026 Schedule',
      sublabelColor: 'default',
      icon: <Calendar className="w-4 h-4 text-[#174478]" />,
    },
    {
      label: 'COMPLETED RESULTS',
      value: completedCount,
      sublabel: 'Official results verified',
      sublabelColor: 'green',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    },
    {
      label: 'LIVE NOW',
      value: liveCount,
      sublabel: 'Lohar Wadi Stadium',
      sublabelColor: 'red',
      icon: <Flame className="w-4 h-4 text-rose-500 animate-pulse" />,
    },
    {
      label: 'UPCOMING FIXTURES',
      value: upcomingCount,
      sublabel: 'Next match at 07:30 PM',
      sublabelColor: 'orange',
      icon: <Clock className="w-4 h-4 text-amber-500" />,
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);



  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const filterOptions = [
    { id: 'all', label: 'All Matches' },
    { id: 'live', label: 'Live' },
    { id: 'fixtures', label: 'Upcoming' },
    { id: 'results', label: 'Completed' },
  ];


  const filteredMatches = sourceMatches.filter((m: any) => {
    // Stage / status filter
    if (statusFilter === 'live' && m.status !== 'live') return false;
    if (statusFilter === 'fixtures' && m.status !== 'scheduled') return false;
    if (statusFilter === 'results' && m.status !== 'completed') return false;

    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const t1 = String(m.team1_name || m.team1?.name || m.team1 || '').toLowerCase();
    const t2 = String(m.team2_name || m.team2?.name || m.team2 || '').toLowerCase();
    const venueStr = typeof m.venue === 'object' ? (m.venue?.name || '') : (m.venue || '');
    const venue = String(venueStr).toLowerCase();
    const matchNum = String(m.match_number || m.id || '');
    return t1.includes(term) || t2.includes(term) || venue.includes(term) || matchNum.includes(term);
  });

  const totalItems = filteredMatches.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMatches = filteredMatches.slice(startIndex, startIndex + pageSize);

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedMatches.length && paginatedMatches.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedMatches.map((m: any, idx: number) => String(m.id || idx)));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((i) => i !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const activeFilterLabel = filterOptions.find((o) => o.id === statusFilter)?.label || 'Filters';

  return (
    <PortalPageWrapper
      pageTitle="Matches & Fixtures"
      kpis={kpis}
      customToolbar={
        <div className="p-2.5 sm:p-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 bg-white dark:bg-[#0a1124]">
          {/* Left: Icon Badge + Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] bg-[#174478] dark:bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <h2 className="font-extrabold text-[#174478] dark:text-sky-300 text-sm sm:text-base tracking-tight whitespace-nowrap">
              Match Schedule & Records
            </h2>
          </div>

          {/* Right: Controls matching reference screenshot UI */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:ml-auto justify-between sm:justify-end">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial min-w-[130px] sm:w-52">
              <input
                type="text"
                placeholder="Search match or team..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#f8fafc] dark:bg-[#070d18] border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#174478] dark:focus:ring-sky-500"
              />
            </div>

            {/* Filters Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                className="flex items-center gap-1.5 bg-[#174478] hover:bg-[#123660] dark:bg-sky-700 dark:hover:bg-sky-600 text-white text-xs font-bold px-4 py-1.5 transition shadow-xs cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
                <span>Filters {statusFilter !== 'all' ? `(${activeFilterLabel})` : ''}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/80" />
              </button>

              {filterMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-[#0b1329] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-40 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#174478] dark:text-sky-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                    Filter by Status
                  </div>
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setStatusFilter(opt.id as any);
                        setCurrentPage(1);
                        setFilterMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 px-3 text-xs flex items-center justify-between transition cursor-pointer [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] ${
                        statusFilter === opt.id
                          ? 'bg-[#174478] dark:bg-sky-600 text-white font-bold shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-[#e9eef5] dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {statusFilter === opt.id && <span className="text-white text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Navy Export Button */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-[#174478] hover:bg-[#123660] dark:bg-sky-700 dark:hover:bg-sky-600 text-white text-xs font-bold px-4 py-1.5 transition shadow-xs cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {/* Dark Navy Schedule Match Button */}
            <button
              type="button"
              onClick={() => navigate('/portal/matches/new')}
              className="flex items-center gap-1.5 bg-[#174478] hover:bg-[#123660] text-white text-xs font-bold px-4 py-1.5 transition shadow-xs cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Match</span>
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
        pageSizeOptions: [6, 12, 24],
      }}
    >
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner message="Loading match records..." />
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="py-16 text-center text-slate-500">
          <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
          <p className="text-sm font-bold text-slate-700">No matches found</p>
          <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search criteria or schedule a new fixture.</p>
        </div>
      ) : (
        <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[900px] border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafc] dark:bg-[#080e1c] border-b border-slate-200 dark:border-slate-800 text-[#1e3a5f] dark:text-sky-300 font-bold text-xs select-none">
                <th scope="col" className="w-12 py-3.5 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedMatches.length && paginatedMatches.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-[#174478] dark:text-sky-600 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-sky-400">
                    <span>Match Fixture</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-sky-400">
                    <span>Venue & Stadium</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-sky-400">
                    <span>Schedule / Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-sky-400">
                    <span>Score Summary</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-sky-400">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-right pr-6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300 bg-white dark:bg-[#0b1329]">
              {paginatedMatches.map((m: any, idx: number) => {
                const getTeamStr = (v: any, fallback: string): string => {
                  if (!v) return fallback;
                  if (typeof v === 'string') return v;
                  if (typeof v === 'object') return v.name || v.short_name || fallback;
                  return String(v);
                };
                const team1 = getTeamStr(m.team1_name || m.team_a_name || m.team1 || m.team_a, 'Lakshmikant Group');
                const team2 = getTeamStr(m.team2_name || m.team_b_name || m.team2 || m.team_b, 'Saish 11');
                const status = m.status || (idx % 3 === 0 ? 'completed' : idx % 3 === 1 ? 'live' : 'scheduled');
                const venueName = typeof m.venue === 'object' ? (m.venue?.name || 'Lohar Wadi Stadium') : (m.venue || 'Lohar Wadi Stadium');
                const dateStr = m.date || '2026-11-04';
                const timeStr = m.time || '07:30 PM';
                const scoreSummary = m.score1 && m.score2 ? `${m.score1} vs ${m.score2}` : 'Scorecard Available';
                const rowId = String(m.id || idx);
                const isSelected = selectedRows.includes(rowId);

                return (
                  <tr
                    key={rowId}
                    className={`transition-colors hover:bg-[#f8fafc] dark:hover:bg-[#0f1a38] ${
                      isSelected ? 'bg-[#f0f7ff] dark:bg-[#132247]' : 'bg-white dark:bg-[#0b1329]'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-left whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(rowId)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-[#174478] dark:text-sky-600 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Match Fixture */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#e8f1fb] dark:bg-sky-950/60 text-[#174478] dark:text-sky-400 flex items-center justify-center shrink-0 shadow-2xs">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm tracking-tight">
                            {team1} vs {team2}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            Match #{m.match_number || idx + 1} · {m.stage || 'Group Stage'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Venue & Stadium */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block bg-[#f1f5f9] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono font-bold text-xs sm:text-sm px-3 py-1 rounded shadow-2xs">
                        {venueName}
                      </span>
                    </td>

                    {/* Schedule / Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#e8f8f0] dark:bg-emerald-950/50 text-[#059669] dark:text-emerald-400 font-semibold text-xs shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                        <span>{dateStr} · {timeStr}</span>
                      </span>
                    </td>

                    {/* Score Summary */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#e8f1fb] dark:bg-sky-950/50 text-[#174478] dark:text-sky-300 font-mono text-xs font-semibold shadow-2xs">
                        <span>{scoreSummary}</span>
                        <Eye className="w-3.5 h-3.5 text-[#174478] dark:text-sky-300 cursor-pointer hover:scale-110 transition-transform" />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {status === 'live' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                          <span>LIVE MATCH</span>
                        </span>
                      ) : status === 'completed' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold tracking-wider bg-[#f0fdf4] dark:bg-emerald-950/50 text-[#15803d] dark:text-emerald-400 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                          <span>COMPLETED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold tracking-wider bg-[#f8fafc] dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>SCHEDULED</span>
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/portal/matches/${m.id || idx + 1}`}
                          title="View Scorecard"
                          className="w-8 h-8 rounded-lg bg-[#edf3fa] hover:bg-[#dbe7f6] dark:bg-slate-800 dark:hover:bg-slate-700 text-[#174478] dark:text-sky-300 flex items-center justify-center transition shadow-2xs"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/portal/matches/${m.id || idx + 1}`}
                          title="Match Details"
                          className="w-8 h-8 rounded-lg bg-[#edf3fa] hover:bg-[#dbe7f6] dark:bg-slate-800 dark:hover:bg-slate-700 text-[#174478] dark:text-sky-300 flex items-center justify-center transition shadow-2xs"
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
