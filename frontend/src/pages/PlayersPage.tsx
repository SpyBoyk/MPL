import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Award,
  Shield,
  Flame,
  CheckCircle2,
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
  SlidersHorizontal,
  ChevronDown,
  Download,
  User,
  MapPin,
  Plus,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { PortalPageWrapper } from '../components/portal/PortalPageWrapper';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ALL_PLAYERS_DATA } from '../data/playersData';
import type { PlayerProfileData } from '../data/playersData';

export const PlayersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'batsman' | 'bowler' | 'all_rounder' | 'wicketkeeper'>('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { data: apiPlayers, isLoading } = useQuery({
    queryKey: ['portal-players-list', roleFilter],
    queryFn: async () => {
      try {
        let url = '/players/';
        if (roleFilter !== 'all') url = `/players/?role=${roleFilter}`;
        const res = await apiClient.get(url);
        return res.data?.results || res.data || [];
      } catch (err) {
        return [];
      }
    },
  });

  const customPlayers: PlayerProfileData[] = useMemo(() => {
    try {
      const saved = localStorage.getItem('mpl_custom_players_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  const playersList: PlayerProfileData[] = useMemo(() => {
    return [...customPlayers, ...ALL_PLAYERS_DATA];
  }, [customPlayers]);

  const totalPlayersCount = playersList.length;
  const batsmenCount = playersList.filter((p) => p.primaryRole === 'Batter').length;
  const bowlersCount = playersList.filter((p) => p.primaryRole === 'Bowler').length;
  const allRoundersCount = playersList.filter(
    (p) => p.primaryRole === 'All-rounder' || p.primaryRole === 'Wicketkeeper'
  ).length;

  const kpis = [
    {
      label: 'TOTAL PLAYERS',
      value: totalPlayersCount,
      sublabel: 'Official registered roster',
      sublabelColor: 'default',
      icon: <Users className="w-4 h-4 text-[#174478]" />,
    },
    {
      label: 'BATSMEN',
      value: batsmenCount,
      sublabel: 'Top & middle order',
      sublabelColor: 'green',
      icon: <Award className="w-4 h-4 text-emerald-500" />,
    },
    {
      label: 'BOWLERS',
      value: bowlersCount,
      sublabel: 'Pace & spin specialists',
      sublabelColor: 'orange',
      icon: <Flame className="w-4 h-4 text-amber-500" />,
    },
    {
      label: 'ALL-ROUNDERS',
      value: allRoundersCount,
      sublabel: 'Dual skill contributors',
      sublabelColor: 'default',
      icon: <Shield className="w-4 h-4 text-[#174478]" />,
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const roleOptions = [
    { id: 'all', label: `All Players (${totalPlayersCount})` },
    { id: 'batsman', label: `Batsmen (${batsmenCount})` },
    { id: 'bowler', label: `Bowlers (${bowlersCount})` },
    { id: 'all_rounder', label: `All-Rounders (${allRoundersCount})` },
    { id: 'wicketkeeper', label: 'Wicketkeepers' },
  ];

  const filteredPlayers = playersList.filter((p) => {
    if (roleFilter !== 'all') {
      const pRole = String(p.primaryRole || '').toLowerCase().replace(/[\s-]/g, '_');
      if (roleFilter === 'batsman' && !pRole.includes('bat')) return false;
      if (roleFilter === 'bowler' && !pRole.includes('bowl')) return false;
      if (roleFilter === 'all_rounder' && !pRole.includes('all')) return false;
      if (roleFilter === 'wicketkeeper' && !pRole.includes('keeper') && !p.isWicketkeeper) return false;
    }
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const name = String(p.fullName || '').toLowerCase();
    const team = String(p.currentTeam || '').toLowerCase();
    const role = String(p.primaryRole || '').toLowerCase();
    const village = String(p.cityOrVillage || '').toLowerCase();
    return name.includes(term) || team.includes(term) || role.includes(term) || village.includes(term);
  });

  const totalItems = filteredPlayers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPlayers = filteredPlayers.slice(startIndex, startIndex + pageSize);

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedPlayers.length && paginatedPlayers.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedPlayers.map((p) => String(p.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((i) => i !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const activeRoleLabel = roleOptions.find((r) => r.id === roleFilter)?.label || 'Filters';

  return (
    <PortalPageWrapper
      pageTitle="Players Roster"
      kpis={kpis}
      customToolbar={
        <div className="p-2.5 sm:p-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 bg-white dark:bg-[#07101e] transition-colors">
          {/* Left: Icon Badge + Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] bg-[#174478] dark:bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <h2 className="font-extrabold text-[#174478] dark:text-slate-100 text-sm sm:text-base tracking-tight whitespace-nowrap">
              Village Players Directory
            </h2>
          </div>

          {/* Right: Controls matching reference screenshot UI */}
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
                <span>Filters {roleFilter !== 'all' ? `(${activeRoleLabel})` : ''}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/80" />
              </button>

              {filterMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-[#0b172a] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-40 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#174478] dark:text-emerald-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                    Filter by Role
                  </div>
                  {roleOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setRoleFilter(opt.id as any);
                        setCurrentPage(1);
                        setFilterMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 px-3 text-xs flex items-center justify-between transition cursor-pointer [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] ${
                        roleFilter === opt.id
                          ? 'bg-[#174478] dark:bg-emerald-600 text-white font-bold shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-[#e9eef5] dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {roleFilter === opt.id && <span className="text-white text-xs">✓</span>}
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

            {/* Dark Navy Add Player Button */}
            <button
              type="button"
              onClick={() => navigate('/portal/players/new')}
              className="flex items-center gap-1.5 bg-[#174478] hover:bg-[#123660] text-white text-xs font-bold px-4 py-1.5 transition shadow-xs cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Player</span>
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
        pageSizeOptions: [10, 20, 50],
      }}
    >
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner message="Loading player profiles..." />
        </div>
      ) : (
        <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[900px] border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafc] dark:bg-[#07101e] border-b border-slate-200 dark:border-slate-800 text-[#1e3a5f] dark:text-slate-200 font-bold text-xs select-none">
                <th scope="col" className="w-12 py-3.5 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedPlayers.length && paginatedPlayers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#174478] dark:text-emerald-500 focus:ring-0 cursor-pointer bg-white dark:bg-slate-900"
                  />
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400">
                    <span>Player Profile</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400">
                    <span>Playing Role</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400">
                    <span>Village / Location</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400">
                    <span>Batting & Bowling Style</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-right pr-6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300 bg-white dark:bg-[#020712]">
              {paginatedPlayers.map((player) => {
                const isCap = player.leadershipStatus !== 'Squad Member';
                const rowId = String(player.id);
                const isSelected = selectedRows.includes(rowId);

                return (
                  <tr
                    key={player.id}
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

                    {/* Player Profile */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 shadow-2xs relative border border-slate-200/60 dark:border-slate-700">
                          <img
                            src={player.photoUrl}
                            alt={player.fullName}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                          />
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm tracking-tight hover:text-[#174478] dark:hover:text-emerald-400 transition-colors">
                              {player.fullName}
                            </span>
                            {isCap && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 uppercase tracking-wider">
                                {player.leadershipStatus}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            #{player.jerseyNumber} · {player.currentTeam}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Playing Role */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block bg-[#f1f5f9] dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs px-3 py-1 rounded shadow-2xs border border-transparent dark:border-slate-700">
                        {player.primaryRole}
                      </span>
                    </td>

                    {/* Village / Location */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#e8f8f0] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-400 font-semibold text-xs shadow-2xs border border-transparent dark:border-emerald-800/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                        <span>{player.cityOrVillage}</span>
                      </span>
                    </td>

                    {/* Batting & Bowling Style */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#e8f1fb] dark:bg-blue-950/40 text-[#174478] dark:text-blue-300 font-mono text-xs font-semibold shadow-2xs border border-transparent dark:border-blue-900/40">
                        <span>{player.battingStyle} · {player.bowlingStyle}</span>
                        <Eye className="w-3.5 h-3.5 text-[#174478] dark:text-blue-300 cursor-pointer hover:scale-110 transition-transform" />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold tracking-wider bg-[#f0fdf4] dark:bg-emerald-950/50 text-[#15803d] dark:text-emerald-300 shadow-2xs border border-transparent dark:border-emerald-800/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                        <span>VERIFIED ROSTER</span>
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/portal/players/${player.id}`}
                          title="View Player Profile"
                          className="w-8 h-8 rounded-lg bg-[#edf3fa] dark:bg-slate-800 hover:bg-[#dbe7f6] dark:hover:bg-slate-700 text-[#174478] dark:text-blue-300 flex items-center justify-center transition shadow-2xs border border-transparent dark:border-slate-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/portal/players/${player.id}`}
                          title="Player Season Stats"
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
