import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  Award,
  CheckCircle2,
  Eye,
  ChevronDown,
  ChevronUp,
  MapPin,
  Crown,
  Pencil,
  Trash2,
  ArrowUpDown,
  SlidersHorizontal,
  Download,
  Plus,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { PortalPageWrapper } from '../components/portal/PortalPageWrapper';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ALL_PLAYERS_DATA } from '../data/playersData';
import type { PlayerProfileData } from '../data/playersData';

export const TeamsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTeamCode, setExpandedTeamCode] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [stageFilter, setStageFilter] = useState<'all' | 'group-a' | 'group-b'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const navigate = useNavigate();

  const { data: teams, isLoading } = useQuery({
    queryKey: ['portal-teams-list'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/teams/');
        return res.data?.results || res.data || [];
      } catch (err) {
        return [];
      }
    },
  });

  // Official 6 verified franchises with appointed captains & player counts
  const defaultTeams = [
    { name: 'Lakshmikant Group', slug: 'lakshmikant-group', short_code: 'LG', captain: 'Prasad Rahate', players_count: 10, home_ground: 'Lohar Wadi Stadium', color: '#174478' },
    { name: 'Aaradhya 11', slug: 'aaradhya-11', short_code: 'A11', captain: 'Abhi Kilje', players_count: 10, home_ground: 'Lohar Wadi Stadium', color: '#5c86c5' },
    { name: 'Dharmveer Fighter', slug: 'dharmveer-fighter', short_code: 'DF', captain: 'Rushikesh Thasale', players_count: 10, home_ground: 'Lohar Wadi Stadium', color: '#f59e0b' },
    { name: 'Saish 11', slug: 'saish-11', short_code: 'S11', captain: 'Prafulla Mahadik', players_count: 10, home_ground: 'Lohar Wadi Stadium', color: '#ea580c' },
    { name: 'Shivneri 11', slug: 'shivneri-11', short_code: 'SN11', captain: 'Suraj Waje', players_count: 9, home_ground: 'Lohar Wadi Stadium', color: '#8b5cf6' },
    { name: 'Omkar 11', slug: 'omkar-11', short_code: 'OM11', captain: 'Akshay Dilip Mahadik', players_count: 9, home_ground: 'Lohar Wadi Stadium', color: '#06b6d4' },
  ];

  const customTeams = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('mpl_custom_teams_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  const teamsData = [...customTeams, ...(teams && teams.length > 0 ? teams : defaultTeams)];

  const allCurrentPlayers = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('mpl_custom_players_v1');
      const custom: PlayerProfileData[] = saved ? JSON.parse(saved) : [];
      return [...custom, ...ALL_PLAYERS_DATA];
    } catch {
      return ALL_PLAYERS_DATA;
    }
  }, []);

  // Helper to get players belonging to a team dynamically
  const getTeamPlayers = (code?: string, teamName?: string): PlayerProfileData[] => {
    const safeCode = String(code || '').toLowerCase();
    const safeName = String(teamName || '').toLowerCase();
    return allCurrentPlayers.filter((p) => {
      const pCode = String(p.teamCode || '').toLowerCase();
      const pTeam = String(p.currentTeam || '').toLowerCase();
      const matchCode = safeCode ? pCode === safeCode : false;
      const matchName = safeName ? pTeam === safeName || (safeCode ? pTeam.includes(safeCode) : false) : false;
      return matchCode || matchName;
    });
  };

  const totalTeamsCount = teamsData.length;
  const totalRegisteredPlayers = allCurrentPlayers.length;
  const totalCaptainsCount = teamsData.filter((t: any) => t.captain && t.captain !== '-').length;

  const kpis = [
    {
      label: 'MALGHAR TEAMS',
      value: totalTeamsCount,
      sublabel: `1 village, ${totalTeamsCount} teams`,
      sublabelColor: 'default',
      icon: <Shield className="w-4 h-4 text-[#174478]" />,
    },
    {
      label: 'REGISTERED PLAYERS',
      value: totalRegisteredPlayers,
      sublabel: `${totalRegisteredPlayers} Malghar village players`,
      sublabelColor: 'default',
      icon: <Users className="w-4 h-4 text-slate-500" />,
    },
    {
      label: 'TEAM CAPTAINS',
      value: totalCaptainsCount,
      sublabel: 'Malghar team leaders',
      sublabelColor: 'orange',
      icon: <Award className="w-4 h-4 text-amber-500" />,
    },
    {
      label: 'TOURNAMENT STATUS',
      value: 'Active',
      sublabel: 'League stage underway',
      sublabelColor: 'green',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    },
  ];

  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const stageOptions = [
    { id: 'all', label: `All Teams (${totalTeamsCount})` },
    { id: 'group-a', label: 'Group A' },
    { id: 'group-b', label: 'Group B' },
  ];

  const filteredTeams = teamsData.filter((t: any) => {
    // Stage filter
    if (stageFilter === 'group-a') {
      const isGroupA = ['LG', 'DF', 'A11'].includes(t.short_code || t.code || '');
      if (!isGroupA) return false;
    } else if (stageFilter === 'group-b') {
      const isGroupB = ['S11', 'SN11', 'OM11'].includes(t.short_code || t.code || '');
      if (!isGroupB) return false;
    }

    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const name = String(t.name || '').toLowerCase();
    const code = String(t.short_code || t.code || '').toLowerCase();
    const captain = String(t.captain || t.captain_name || '').toLowerCase();
    const players = getTeamPlayers(t.short_code || t.code, t.name);
    const hasMatchingPlayer = players.some((p) => String(p.fullName || '').toLowerCase().includes(term));
    return name.includes(term) || code.includes(term) || captain.includes(term) || hasMatchingPlayer;
  });

  const totalItems = filteredTeams.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTeams = filteredTeams.slice(startIndex, startIndex + pageSize);

  const toggleExpand = (teamCode: string) => {
    setExpandedTeamCode((prev) => (prev === teamCode ? null : teamCode));
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedTeams.length && paginatedTeams.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedTeams.map((t: any) => t.short_code || t.code || ''));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((i) => i !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const activeStageLabel = stageOptions.find((s) => s.id === stageFilter)?.label || 'Filters';

  return (
    <PortalPageWrapper
      pageTitle="Teams & Squads"
      kpis={kpis}
      customToolbar={
        <div className="p-2.5 sm:p-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 bg-white dark:bg-[#0a1124]">
          {/* Left: Icon Badge + Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] bg-[#174478] dark:bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <h2 className="font-extrabold text-[#174478] dark:text-sky-300 text-sm sm:text-base tracking-tight whitespace-nowrap">
              Village Franchises & Squads
            </h2>
          </div>

          {/* Right: Controls matching reference screenshot UI */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:ml-auto justify-between sm:justify-end">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial min-w-[130px] sm:w-52">
              <input
                type="text"
                placeholder="Search franchise or captain..."
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
                <span>Filters {stageFilter !== 'all' ? `(${activeStageLabel})` : ''}</span>
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
                        setStageFilter(opt.id as any);
                        setCurrentPage(1);
                        setFilterMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 px-3 text-xs flex items-center justify-between transition cursor-pointer [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] ${
                        stageFilter === opt.id
                          ? 'bg-[#174478] dark:bg-sky-600 text-white font-bold shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-[#e9eef5] dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {stageFilter === opt.id && <span className="text-white text-xs">✓</span>}
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

            {/* Dark Navy Add Team Button */}
            <button
              type="button"
              onClick={() => navigate('/portal/teams/new')}
              className="flex items-center gap-1.5 bg-[#174478] hover:bg-[#123660] text-white text-xs font-bold px-4 py-1.5 transition shadow-xs cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Team</span>
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
          <LoadingSpinner message="Loading franchise squads..." />
        </div>
      ) : (
        <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[900px] border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafc] dark:bg-[#080e1c] border-b border-slate-200 dark:border-slate-800 text-[#1e3a5f] dark:text-sky-300 font-bold text-xs select-none">
                <th scope="col" className="w-12 py-3.5 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedTeams.length && paginatedTeams.length > 0}
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
                    <span>Squad Size</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-sky-400">
                    <span>Home Stadium</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-sky-400">
                    <span>Roster File</span>
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
              {paginatedTeams.map((team: any, idx: number) => {
                const captainName = team.captain || team.captain_name || 'Appointed Captain';
                const teamCodeKey = String(team.short_code || team.code || idx);
                const slug = String(team.slug || team.short_code || team.code || 'team').toLowerCase();
                const teamPlayers = getTeamPlayers(team.short_code || team.code, team.name);
                const squadCount = teamPlayers.length || team.players_count || (idx < 4 ? 10 : 9);
                const isExpanded = expandedTeamCode === teamCodeKey;
                const isSelected = selectedRows.includes(teamCodeKey);

                return (
                  <React.Fragment key={slug || idx}>
                    <tr
                      className={`transition-colors hover:bg-[#f8fafc] dark:hover:bg-[#0f1a38] ${
                        isSelected ? 'bg-[#f0f7ff] dark:bg-[#132247]' : isExpanded ? 'bg-blue-50/30 dark:bg-sky-950/20' : 'bg-white dark:bg-[#0b1329]'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-left whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(teamCodeKey)}
                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-[#174478] dark:text-sky-600 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Team Franchise */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#e8f1fb] dark:bg-sky-950/60 text-[#174478] dark:text-sky-400 flex items-center justify-center shrink-0 shadow-2xs">
                            <Shield className="w-4 h-4" />
                          </div>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm tracking-tight">
                              {team.name}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                              Malghar Village · {team.short_code} · Captain: {captainName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Squad Size */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-block bg-[#f1f5f9] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono font-bold text-xs px-3 py-1 rounded shadow-2xs">
                          {squadCount} Players
                        </span>
                      </td>

                      {/* Home Stadium */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#e8f8f0] dark:bg-emerald-950/50 text-[#059669] dark:text-emerald-400 font-semibold text-xs shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                          <span>{team.home_ground || 'Lohar Wadi Stadium'}</span>
                        </span>
                      </td>

                      {/* Roster File with Eye Icon (Clicking toggles squad preview) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => toggleExpand(team.short_code || team.code || 'team')}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#e8f1fb] dark:bg-sky-950/50 text-[#174478] dark:text-sky-300 font-mono text-xs font-semibold shadow-2xs hover:bg-blue-100 dark:hover:bg-sky-900/50 transition cursor-pointer"
                        >
                          <span>{String(team.short_code || team.code || 'team').toLowerCase()}_squad_roster.mpl</span>
                          <Eye className="w-3.5 h-3.5 text-[#174478] dark:text-sky-300" />
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold tracking-wider bg-[#f0fdf4] dark:bg-emerald-950/50 text-[#15803d] dark:text-emerald-400 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                          <span>VERIFIED ACTIVE</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/portal/teams/${slug}`}
                            title="View Full Team Page"
                            className="w-8 h-8 rounded-lg bg-[#edf3fa] hover:bg-[#dbe7f6] dark:bg-slate-800 dark:hover:bg-slate-700 text-[#174478] dark:text-sky-300 flex items-center justify-center transition shadow-2xs"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleExpand(teamCodeKey)}
                            title={isExpanded ? 'Hide Squad' : 'Expand Squad'}
                            className="w-8 h-8 rounded-lg bg-[#edf3fa] hover:bg-[#dbe7f6] dark:bg-slate-800 dark:hover:bg-slate-700 text-[#174478] dark:text-sky-300 flex items-center justify-center transition shadow-2xs cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleSelectRow(teamCodeKey)}
                            title="Toggle Selection"
                            className="w-8 h-8 rounded-lg bg-[#b91c1c] hover:bg-[#991b1b] text-white flex items-center justify-center transition shadow-2xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* EXPANDED SQUAD ACCORDION ROW */}
                    {isExpanded && (
                      <tr className="bg-slate-50/70 dark:bg-slate-900/60">
                        <td colSpan={7} className="p-4 sm:p-5">
                          <div className="bg-white dark:bg-[#0a1124] rounded-xl p-4 shadow-xs space-y-3 border border-slate-200/80 dark:border-slate-800">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                              <span className="text-xs font-bold text-[#174478] dark:text-sky-400 uppercase tracking-wider">
                                {team.name} Squad Roster ({teamPlayers.length} Village Players)
                              </span>
                              <Link
                                to={`/portal/teams/${slug}`}
                                className="text-xs font-bold text-[#174478] dark:text-sky-400 hover:underline"
                              >
                                View Detailed Squad →
                              </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {teamPlayers.map((p) => (
                                <Link
                                  key={p.id}
                                  to={`/portal/players/${p.id}`}
                                  className="flex items-center gap-2 p-2 rounded-lg bg-[#f8fafc] dark:bg-[#070d18] border border-slate-200/60 dark:border-slate-800 hover:bg-[#edf3fa] dark:hover:bg-slate-800/60 transition"
                                >
                                  <div className="w-7 h-7 rounded-md overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                                    <img src={p.photoUrl} alt={p.fullName} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{p.fullName}</div>
                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{p.primaryRole}</div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </PortalPageWrapper>
  );
};
