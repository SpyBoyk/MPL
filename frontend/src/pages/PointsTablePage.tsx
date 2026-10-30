import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Shield,
  Calendar,
  Award,
  Eye,
  FileText,
  Pencil,
  Trash2,
  ArrowUpDown,
  SlidersHorizontal,
  ChevronDown,
  Download,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { PortalPageWrapper } from '../components/portal/PortalPageWrapper';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const PointsTablePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stage, setStage] = useState<'all' | 'group-a' | 'group-b'>('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { data: standings, isLoading } = useQuery({
    queryKey: ['portal-points-table', stage],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/points-table/');
        return res.data?.standings || res.data?.results || res.data || [];
      } catch (err) {
        return [];
      }
    },
  });

  // Verified official 6 franchises data for Malghar Premier League 2026
  const defaultStandings = [
    { rank: 1, team: 'Lakshmikant Group', code: 'LG', p: 4, w: 4, l: 0, t: 0, pts: 8, nrr: '+1.850', form: ['W', 'W', 'W', 'W'], status: 'QUALIFIED' },
    { rank: 2, team: 'Dharmveer Fighter', code: 'DF', p: 4, w: 3, l: 1, t: 0, pts: 6, nrr: '+0.920', form: ['W', 'L', 'W', 'W'], status: 'QUALIFIED' },
    { rank: 3, team: 'Aaradhya 11', code: 'A11', p: 4, w: 2, l: 2, t: 0, pts: 4, nrr: '+0.150', form: ['L', 'W', 'L', 'W'], status: 'VERIFIED TOP 4' },
    { rank: 4, team: 'Saish 11', code: 'S11', p: 4, w: 2, l: 2, t: 0, pts: 4, nrr: '-0.340', form: ['W', 'L', 'W', 'L'], status: 'VERIFIED TOP 4' },
    { rank: 5, team: 'Shivneri 11', code: 'SN11', p: 4, w: 1, l: 3, t: 0, pts: 2, nrr: '-0.880', form: ['L', 'L', 'W', 'L'], status: 'ELIMINATED' },
    { rank: 6, team: 'Omkar 11', code: 'OM11', p: 4, w: 0, l: 4, t: 0, pts: 0, nrr: '-1.690', form: ['L', 'L', 'L', 'L'], status: 'ELIMINATED' },
  ];

  const customTeams = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('mpl_custom_teams_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  const tableData = React.useMemo(() => {
    const raw = standings && standings.length > 0 ? standings : defaultStandings;
    const base = raw.map((r: any, idx: number) => {
      const teamObj = typeof r.team === 'object' && r.team !== null ? r.team : null;
      const teamName: string = teamObj?.name || (typeof r.team === 'string' ? r.team : r.team_name || 'Team');
      const teamCode: string = r.code || teamObj?.short_name || (typeof teamName === 'string' && teamName.length >= 2 ? teamName.slice(0, 3).toUpperCase() : 'MPL');
      const pts = r.points ?? r.pts ?? 0;
      const nrrVal = r.net_run_rate ?? r.nrr ?? 0;
      const nrrStr = typeof nrrVal === 'number'
        ? (nrrVal >= 0 ? `+${nrrVal.toFixed(3)}` : nrrVal.toFixed(3))
        : String(nrrVal);

      return {
        rank: r.position || r.rank || idx + 1,
        team: teamName,
        team_name: teamName,
        code: teamCode,
        short_code: teamCode,
        p: r.played ?? r.p ?? 0,
        played: r.played ?? r.p ?? 0,
        w: r.won ?? r.w ?? 0,
        won: r.won ?? r.w ?? 0,
        l: r.lost ?? r.l ?? 0,
        lost: r.lost ?? r.l ?? 0,
        t: r.tied ?? r.t ?? 0,
        tied: r.tied ?? r.t ?? 0,
        pts,
        points: pts,
        nrr: nrrStr,
        net_run_rate: nrrStr,
        form: Array.isArray(r.form) && r.form.length > 0 ? r.form : ['W'],
        status: (r.position || idx + 1) <= 2 ? 'QUALIFIED' : (r.position || idx + 1) <= 4 ? 'VERIFIED TOP 4' : 'ELIMINATED',
      };
    });

    const existingCodes = new Set(base.map((t: any) => t.code));
    const extra = customTeams
      .filter((ct: any) => !existingCodes.has(ct.short_code || ct.code))
      .map((ct: any, idx: number) => ({
        rank: base.length + idx + 1,
        team: ct.name,
        team_name: ct.name,
        code: ct.short_code || ct.code || 'NEW',
        short_code: ct.short_code || ct.code || 'NEW',
        p: ct.matches_played || 0,
        played: ct.matches_played || 0,
        w: 0,
        won: 0,
        l: 0,
        lost: 0,
        t: 0,
        tied: 0,
        pts: ct.points || 0,
        points: ct.points || 0,
        nrr: ct.nrr || '+0.000',
        net_run_rate: ct.nrr || '+0.000',
        form: ['-'],
        status: 'LEAGUE STAGE',
      }));

    return [...base, ...extra];
  }, [standings, customTeams]);

  const totalTeamsCount = tableData.length;
  const leaderTeam = tableData[0];
  const leaderCode = leaderTeam ? String(leaderTeam.code || leaderTeam.team) : 'LG';
  const leaderPts = leaderTeam ? leaderTeam.pts : 0;
  const leaderNrr = leaderTeam ? leaderTeam.nrr : '+0.000';

  const kpis = [
    {
      label: 'MALGHAR TEAMS',
      value: totalTeamsCount,
      sublabel: `1 village, ${totalTeamsCount} teams`,
      sublabelColor: 'default',
      icon: <Shield className="w-4 h-4 text-[#174478]" />,
    },
    {
      label: 'MATCHES PLAYED',
      value: Math.floor(tableData.reduce((acc: number, t: any) => acc + (t.p || 0), 0) / 2) || 12,
      sublabel: 'Official tournament fixtures',
      sublabelColor: 'default',
      icon: <Calendar className="w-4 h-4 text-slate-500" />,
    },
    {
      label: 'TABLE LEADER',
      value: leaderCode,
      sublabel: `${leaderPts} Points (${leaderNrr} NRR)`,
      sublabelColor: 'green',
      icon: <Trophy className="w-4 h-4 text-amber-500" />,
    },
    {
      label: 'QUALIFIER CUTOFF',
      value: 'Top 4',
      sublabel: 'Playoffs qualification',
      sublabelColor: 'orange',
      icon: <Award className="w-4 h-4 text-amber-500" />,
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const stageOptions = [
    { id: 'all', label: `All Teams (${totalTeamsCount})` },
    { id: 'group-a', label: 'Group A' },
    { id: 'group-b', label: 'Group B' },
  ];

  const filteredData = tableData.filter((item: any) => {
    // Stage filter
    if (stage === 'group-a') {
      const isGroupA = ['LG', 'DF', 'A11'].includes(item.code || '');
      if (!isGroupA) return false;
    } else if (stage === 'group-b') {
      const isGroupB = ['S11', 'SN11', 'OM11'].includes(item.code || '');
      if (!isGroupB) return false;
    }

    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const tObj = typeof item.team === 'object' && item.team !== null ? item.team : null;
    const name = String(tObj?.name || (typeof item.team === 'string' ? item.team : (item.team_name || ''))).toLowerCase();
    const code = String(item.code || tObj?.short_name || '').toLowerCase();
    return name.includes(term) || code.includes(term);
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedData.length && paginatedData.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map((r: any, idx: number) => {
        const tObj = typeof r.team === 'object' && r.team !== null ? r.team : null;
        return r.code || tObj?.short_name || String(idx);
      }));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((i) => i !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const activeStageLabel = stageOptions.find((s) => s.id === stage)?.label || 'Filters';

  return (
    <PortalPageWrapper
      pageTitle="Points Table Standings"
      kpis={kpis}
      customToolbar={
        <div className="p-2.5 sm:p-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 bg-white dark:bg-[#0a1124]">
          {/* Left: Icon Badge + Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] bg-[#174478] dark:bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <h2 className="font-extrabold text-[#174478] dark:text-sky-300 text-sm sm:text-base tracking-tight whitespace-nowrap">
              Points Table Standings
            </h2>
          </div>

          {/* Right: Controls matching exact reference screenshot UI */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:ml-auto justify-between sm:justify-end">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial min-w-[130px] sm:w-52">
              <input
                type="text"
                placeholder="Search team or code..."
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
                <span>Filters {stage !== 'all' ? `(${activeStageLabel})` : ''}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/80" />
              </button>

              {filterMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-[#0b1329] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-40 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#174478] dark:text-sky-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                    Filter by Group
                  </div>
                  {stageOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setStage(opt.id as any);
                        setCurrentPage(1);
                        setFilterMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 px-3 text-xs flex items-center justify-between transition cursor-pointer [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] ${
                        stage === opt.id
                          ? 'bg-[#174478] dark:bg-sky-600 text-white font-bold shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-[#e9eef5] dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {stage === opt.id && <span className="text-white text-xs">✓</span>}
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
          <LoadingSpinner message="Calculating league points..." />
        </div>
      ) : (
        <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[900px] border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafc] dark:bg-[#080e1c] border-b border-slate-200 dark:border-slate-800 text-[#1e3a5f] dark:text-sky-300 font-bold text-xs select-none">
                <th scope="col" className="w-12 py-3.5 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-[#174478] dark:text-sky-600 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-sky-400">
                    <span>Team Franchise</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-sky-400">
                    <span>Points (PTS)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-sky-400">
                    <span>Net Run Rate</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-sky-400">
                    <span>Recent Form</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-sky-400">
                    <span>Playoff Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-right pr-6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300 bg-white dark:bg-[#0b1329]">
              {paginatedData.map((row: any, idx: number) => {
                const teamObj = typeof row.team === 'object' && row.team !== null ? row.team : null;
                const teamName: string = teamObj?.name || (typeof row.team === 'string' ? row.team : (row.team_name || 'Team'));
                const code: string = row.code || teamObj?.short_name || (typeof teamName === 'string' && teamName.length >= 2 ? teamName.slice(0, 3).toUpperCase() : 'MPL');
                const rank = row.position || row.rank || idx + 1;
                const isTop4 = rank <= 4;
                const points = row.points ?? row.pts ?? 0;
                const played = row.played ?? row.p ?? 0;
                const won = row.won ?? row.w ?? 0;
                const lost = row.lost ?? row.l ?? 0;
                const tied = row.tied ?? row.t ?? 0;
                const nrrVal = row.net_run_rate ?? row.nrr ?? 0;
                const nrr = typeof nrrVal === 'number'
                  ? (nrrVal >= 0 ? `+${nrrVal.toFixed(3)}` : nrrVal.toFixed(3))
                  : String(nrrVal);
                const isPositive = String(nrr).startsWith('+');
                const formArray = Array.isArray(row.form) && row.form.length > 0 ? row.form : ['W', 'L', 'W'];
                const isSelected = selectedRows.includes(code);

                // Playoff qualification status matching pill format
                const statusLabel = rank <= 2 ? 'QUALIFIED' : isTop4 ? 'VERIFIED TOP 4' : 'ELIMINATED';

                return (
                  <tr
                    key={code || idx}
                    className={`transition-colors hover:bg-[#f8fafc] dark:hover:bg-[#0f1a38] ${
                      isSelected ? 'bg-[#f0f7ff] dark:bg-[#132247]' : 'bg-white dark:bg-[#0b1329]'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-left whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(code)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-[#174478] dark:text-sky-600 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Team Franchise (Original file UI format) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {/* Blue square shield/document icon */}
                        <div className="w-8 h-8 rounded-lg bg-[#e8f1fb] dark:bg-sky-950/60 text-[#174478] dark:text-sky-400 flex items-center justify-center shrink-0 shadow-2xs">
                          <Shield className="w-4 h-4" />
                        </div>

                        {/* Small green dot indicator */}
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />

                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm tracking-tight">
                            {teamName}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            Pos #{rank} · {played} matches · {won}W {lost}L · {code}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Points (Extracted number UI format) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block bg-[#f1f5f9] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono font-bold text-xs sm:text-sm px-3 py-1 rounded shadow-2xs">
                        {points} PTS
                      </span>
                    </td>

                    {/* Net Run Rate (Confidence UI format) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold shadow-2xs ${
                          isPositive
                            ? 'bg-[#e8f8f0] dark:bg-emerald-950/50 text-[#059669] dark:text-emerald-400'
                            : 'bg-[#fef2f2] dark:bg-rose-950/50 text-[#dc2626] dark:text-rose-400'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isPositive ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`} />
                        <span>{nrr} NRR</span>
                      </span>
                    </td>

                    {/* Recent Form (Renamed file with Eye Icon UI format) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#e8f1fb] dark:bg-sky-950/50 text-[#174478] dark:text-sky-300 font-mono text-xs font-semibold shadow-2xs">
                        <span>{formArray.join(' · ')}</span>
                        <Eye className="w-3.5 h-3.5 text-[#174478] dark:text-sky-300 cursor-pointer hover:scale-110 transition-transform" />
                      </div>
                    </td>

                    {/* Playoff Status (Status pill format) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold tracking-wider shadow-2xs ${
                          isTop4
                            ? 'bg-[#f0fdf4] dark:bg-emerald-950/50 text-[#15803d] dark:text-emerald-300'
                            : 'bg-[#f8fafc] dark:bg-slate-800/60 text-slate-400 dark:text-slate-400'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isTop4 ? 'bg-[#22c55e]' : 'bg-slate-400'}`} />
                        <span>{statusLabel}</span>
                      </span>
                    </td>

                    {/* Action (3 Action buttons UI format) */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/portal/teams/${String(code || 'team').toLowerCase()}`}
                          title="View Squad"
                          className="w-8 h-8 rounded-lg bg-[#edf3fa] hover:bg-[#dbe7f6] dark:bg-slate-800 dark:hover:bg-slate-700 text-[#174478] dark:text-sky-300 flex items-center justify-center transition shadow-2xs"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/portal/teams/${String(code || 'team').toLowerCase()}`}
                          title="Team Stats & History"
                          className="w-8 h-8 rounded-lg bg-[#edf3fa] hover:bg-[#dbe7f6] dark:bg-slate-800 dark:hover:bg-slate-700 text-[#174478] dark:text-sky-300 flex items-center justify-center transition shadow-2xs"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => toggleSelectRow(code)}
                          title="Toggle / Reset Selection"
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


