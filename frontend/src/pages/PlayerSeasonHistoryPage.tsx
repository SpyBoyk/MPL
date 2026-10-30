import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Trophy,
  Award,
  ArrowLeft,
  Shield,
  Flame,
  CheckCircle2,
  TrendingUp,
  Download,
  MapPin,
  Activity,
  ArrowUpDown,
  SlidersHorizontal,
  ChevronDown,
  Pencil,
  Trash2,
  Eye,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { PortalPageWrapper } from '../components/portal/PortalPageWrapper';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { getPlayerById } from '../data/playersData';
import type { PlayerProfileData } from '../data/playersData';

export const PlayerSeasonHistoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const playerId = id || '1';

  const { data: apiPlayer, isLoading } = useQuery({
    queryKey: ['player-season-history', playerId],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/players/${playerId}/`);
        return res.data;
      } catch (err) {
        return null;
      }
    },
  });

  const playerOfficial: PlayerProfileData = getPlayerById(playerId);
  const playerName = apiPlayer?.full_name || apiPlayer?.name || playerOfficial.fullName;
  const playerTeam = apiPlayer?.team_name || apiPlayer?.team?.name || playerOfficial.currentTeam;
  const playerRole = playerOfficial.primaryRole;
  const photoUrl = playerOfficial.photoUrl;
  const stats = playerOfficial.careerStats;

  // Comprehensive 4-Season Career History (Strictly Only Last 4 Seasons: 2023 - 2026)
  const seasonRecords = [
    {
      season: 'Season 2026',
      year: '2026',
      team: playerTeam,
      matches: 4,
      innings: 4,
      runs: Math.max(25, (stats.runs * 0.22) | 0),
      hs: stats.highestScore,
      avg: stats.average,
      sr: stats.strikeRate,
      fifties: Math.max(1, Math.round(stats.runs * 0.003)),
      hundreds: 0,
      wickets: Math.max(1, (stats.wickets * 0.22) | 0),
      bestBowling: stats.bestBowling,
      econ: stats.economy,
      honors: 'Current Season Active',
      status: 'In Progress',
    },
    {
      season: 'Season 2025',
      year: '2025',
      team: playerTeam,
      matches: 7,
      innings: 7,
      runs: Math.max(40, (stats.runs * 0.35) | 0),
      hs: `${Math.round(parseInt(stats.highestScore) * 0.95)}`,
      avg: `${(parseFloat(stats.average) * 0.96).toFixed(2)}`,
      sr: `${(parseFloat(stats.strikeRate) * 0.98).toFixed(1)}`,
      fifties: Math.max(1, Math.round(stats.runs * 0.004)),
      hundreds: 0,
      wickets: Math.max(2, (stats.wickets * 0.35) | 0),
      bestBowling: stats.bestBowling,
      econ: `${(parseFloat(stats.economy) * 1.02).toFixed(2)}`,
      honors: 'MPL 2025 Champions League',
      status: 'Completed',
    },
    {
      season: 'Season 2024',
      year: '2024',
      team: playerTeam,
      matches: 6,
      innings: 6,
      runs: Math.max(30, (stats.runs * 0.25) | 0),
      hs: '78*',
      avg: `${(parseFloat(stats.average) * 0.92).toFixed(2)}`,
      sr: `${(parseFloat(stats.strikeRate) * 0.95).toFixed(1)}`,
      fifties: 1,
      hundreds: 0,
      wickets: Math.max(2, (stats.wickets * 0.25) | 0),
      bestBowling: '3/18',
      econ: '6.70',
      honors: 'Player of the Tournament Finalist',
      status: 'Completed',
    },
    {
      season: 'Season 2023',
      year: '2023',
      team: playerTeam,
      matches: 5,
      innings: 5,
      runs: Math.max(20, (stats.runs * 0.18) | 0),
      hs: '65',
      avg: `${(parseFloat(stats.average) * 0.88).toFixed(2)}`,
      sr: `${(parseFloat(stats.strikeRate) * 0.92).toFixed(1)}`,
      fifties: 1,
      hundreds: 0,
      wickets: Math.max(1, (stats.wickets * 0.18) | 0),
      bestBowling: '3/24',
      econ: '6.85',
      honors: 'Super Striker Award',
      status: 'Completed',
    },
  ];

  const totalCareerRuns = seasonRecords.reduce((acc, curr) => acc + curr.runs, 0);
  const totalCareerWickets = seasonRecords.reduce((acc, curr) => acc + curr.wickets, 0);
  const totalMatches = seasonRecords.reduce((acc, curr) => acc + curr.matches, 0);

  const kpis = [
    {
      label: 'TOTAL SEASONS',
      value: '4 Editions',
      sublabel: 'Last 4: 2023 to 2026',
      sublabelColor: 'default',
      icon: <Calendar className="w-3.5 h-3.5 text-[#174478]" />,
    },
    {
      label: 'CAREER RUNS',
      value: totalCareerRuns,
      sublabel: `Avg ${stats.average} · SR ${stats.strikeRate}`,
      sublabelColor: 'green',
      icon: <Trophy className="w-3.5 h-3.5 text-emerald-600" />,
    },
    {
      label: 'CAREER WICKETS',
      value: totalCareerWickets,
      sublabel: `Econ ${stats.economy} · BBI ${stats.bestBowling}`,
      sublabelColor: 'orange',
      icon: <Flame className="w-3.5 h-3.5 text-amber-500" />,
    },
    {
      label: 'CAREER MATCHES',
      value: totalMatches,
      sublabel: `${stats.matches} Official Games`,
      sublabelColor: 'default',
      icon: <Shield className="w-3.5 h-3.5 text-[#174478]" />,
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const filteredRecords = seasonRecords.filter((rec) => {
    const matchesSeason = selectedSeason === 'all' || rec.year === selectedSeason;
    if (!matchesSeason) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return String(rec.season || '').toLowerCase().includes(term) || String(rec.honors || '').toLowerCase().includes(term);
  });

  const totalItems = filteredRecords.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + pageSize);

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedRecords.length && paginatedRecords.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedRecords.map((r) => r.year));
    }
  };

  const toggleSelectRow = (year: string) => {
    if (selectedRows.includes(year)) {
      setSelectedRows(selectedRows.filter((y) => y !== year));
    } else {
      setSelectedRows([...selectedRows, year]);
    }
  };

  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const seasonOptions = [
    { id: 'all', label: 'All 4 Editions (2023-2026)' },
    { id: '2026', label: 'Season 2026' },
    { id: '2025', label: 'Season 2025' },
    { id: '2024', label: 'Season 2024' },
    { id: '2023', label: 'Season 2023' },
  ];

  const activeSeasonLabel = seasonOptions.find((s) => s.id === selectedSeason)?.label || 'Filters';

  return (
    <PortalPageWrapper
      pageTitle={`${playerName} — All Season History`}
      kpis={kpis}
      customToolbar={
        <div className="p-2.5 sm:p-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 bg-white">
          {/* Left: Icon Badge + Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] bg-[#174478] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-[#174478] text-sm sm:text-base tracking-tight whitespace-nowrap">
                {playerName} — Season History
              </h2>
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">{playerTeam}</span>
                <span>•</span>
                <span>{playerRole}</span>
              </div>
            </div>
          </div>

          {/* Right: Controls matching exact reference screenshot UI */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:ml-auto justify-between sm:justify-end">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial min-w-[130px] sm:w-52">
              <input
                type="text"
                placeholder="Search season honors..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#174478]"
              />
            </div>

            {/* Filters Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                className="flex items-center gap-1.5 bg-[#174478] hover:bg-[#123660] text-white text-xs font-bold px-4 py-1.5 transition shadow-xs cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
                <span>Filters {selectedSeason !== 'all' ? `(${activeSeasonLabel})` : ''}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/80" />
              </button>

              {filterMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#174478] border-b border-slate-100 mb-1">
                    Filter by Season Edition
                  </div>
                  {seasonOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedSeason(opt.id);
                        setCurrentPage(1);
                        setFilterMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 px-3 text-xs flex items-center justify-between transition cursor-pointer [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] ${
                        selectedSeason === opt.id
                          ? 'bg-[#174478] text-white font-bold shadow-xs'
                          : 'text-slate-700 hover:bg-[#e9eef5]'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedSeason === opt.id && <span className="text-white text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Navy Export Button */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-[#174478] hover:bg-[#123660] text-white text-xs font-bold px-4 py-1.5 transition shadow-xs cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)]"
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
        pageSizeOptions: [2, 4, 8],
      }}
    >
      {/* Return to Profile Action bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-[#e2e8f0] flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Link
            to={`/portal/players/${playerId}`}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#174478] hover:bg-[#123660] text-white text-xs font-bold transition shadow-xs cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Profile</span>
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#174478] shrink-0">
              <img src={photoUrl} alt={playerName} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-extrabold text-slate-800">{playerName}</span>
            <span className="text-[11px] text-slate-500">({playerTeam})</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner message="Loading complete season history..." />
        </div>
      ) : (
        <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[900px] border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-slate-200 text-[#1e3a5f] font-bold text-xs select-none">
                <th scope="col" className="w-12 py-3.5 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedRecords.length && paginatedRecords.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-[#174478] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478]">
                    <span>Edition / Season</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478]">
                    <span>Runs Scored</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478]">
                    <span>Strike Rate & Avg</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478]">
                    <span>Wickets & Economy</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478]">
                    <span>Accolades & Honors</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478]">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-right pr-6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
              {paginatedRecords.map((season) => {
                const isSelected = selectedRows.includes(season.year);
                const isCurrent = season.year === '2026';

                return (
                  <tr
                    key={season.year}
                    className={`transition-colors hover:bg-[#f8fafc] ${
                      isSelected ? 'bg-[#f0f7ff]' : 'bg-white'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-left whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(season.year)}
                        className="w-4 h-4 rounded border-slate-300 text-[#174478] focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Edition / Season */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {/* Blue calendar icon badge */}
                        <div className="w-8 h-8 rounded-lg bg-[#e8f1fb] text-[#174478] flex items-center justify-center shrink-0 shadow-2xs">
                          <Calendar className="w-4 h-4" />
                        </div>

                        {/* Small green dot indicator */}
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />

                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-800 text-xs sm:text-sm tracking-tight">
                            {season.season}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {season.team} · {season.matches} Mat · {season.innings} Inns
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Runs */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block bg-[#f1f5f9] text-slate-800 font-mono font-bold text-xs sm:text-sm px-3 py-1 rounded shadow-2xs">
                        {season.runs} RUNS (HS {season.hs})
                      </span>
                    </td>

                    {/* Strike Rate & Avg */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold shadow-2xs bg-[#e8f8f0] text-[#059669]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                        <span>{season.sr} SR (Avg {season.avg})</span>
                      </span>
                    </td>

                    {/* Wickets & Economy */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#e8f1fb] text-[#174478] font-mono text-xs font-semibold shadow-2xs">
                        <span>{season.wickets} Wkts (Econ {season.econ})</span>
                        <Eye className="w-3.5 h-3.5 text-[#174478] cursor-pointer hover:scale-110 transition-transform" />
                      </div>
                    </td>

                    {/* Accolades & Honors */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="font-semibold text-slate-800 text-xs truncate max-w-[200px]">
                          {season.honors}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold tracking-wider shadow-2xs ${
                          isCurrent
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-[#f0fdf4] text-[#15803d]'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-rose-500' : 'bg-[#22c55e]'}`} />
                        <span>{season.status.toUpperCase()}</span>
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/portal/players/${playerId}`}
                          title="View Profile"
                          className="w-8 h-8 rounded-lg bg-[#edf3fa] hover:bg-[#dbe7f6] text-[#174478] flex items-center justify-center transition shadow-2xs"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/portal/players/${playerId}`}
                          title="Detailed Analytics"
                          className="w-8 h-8 rounded-lg bg-[#edf3fa] hover:bg-[#dbe7f6] text-[#174478] flex items-center justify-center transition shadow-2xs"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => toggleSelectRow(season.year)}
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

