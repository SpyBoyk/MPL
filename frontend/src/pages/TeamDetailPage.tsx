import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Crown, Users, Calendar, ArrowLeft, ArrowRight, Shield, MapPin, Award } from 'lucide-react';
import { apiClient } from '../api/client';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ALL_PLAYERS_DATA } from '../data/playersData';
import { Pagination } from '../components/ui/Pagination';

export const TeamDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<'squad' | 'matches'>('squad');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const teamSlug = String(slug || 'msk').toLowerCase();

  const {
    data: apiTeam,
    isLoading,
  } = useQuery({
    queryKey: ['team-detail', teamSlug],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/teams/${teamSlug}/`);
        return res.data;
      } catch (err) {
        return null;
      }
    },
  });

  const { data: teamMatches } = useQuery({
    queryKey: ['team-matches', teamSlug],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/matches/?team=${teamSlug}`);
        return res.data?.results || res.data || [];
      } catch (err) {
        return [];
      }
    },
  });

  // Team meta for the 6 village franchises
  const lgMeta = {
    name: 'Lakshmikant Group',
    code: 'LG',
    color: '#174478',
    captain: 'Prasad Rahate',
    ground: 'Lohar Wadi Stadium',
    desc: 'Two-time Malghar Premier League champions known for clinical death overs bowling, strategic leadership, and explosive top-order strokeplay.',
  };
  const a11Meta = {
    name: 'Aaradhya 11',
    code: 'A11',
    color: '#5c86c5',
    captain: 'Abhi Kilje',
    ground: 'Lohar Wadi Stadium',
    desc: 'Perennial powerhouse with lethal pace depth, reliable all-round anchors, and supreme boundary fielding disciplines.',
  };
  const dfMeta = {
    name: 'Dharmveer Fighter',
    code: 'DF',
    color: '#f59e0b',
    captain: 'Rushikesh Thasale',
    ground: 'Lohar Wadi Stadium',
    desc: '2025 Champions boasting high strike-rate finishers, disciplined seamers, and an aggressive fearless tournament brand.',
  };
  const s11Meta = {
    name: 'Saish 11',
    code: 'S11',
    color: '#ea580c',
    captain: 'Prafulla Mahadik',
    ground: 'Lohar Wadi Stadium',
    desc: 'Tenacious battlers with supreme running between the wickets, crafty spinners, and unmatched fighting spirit in close chases.',
  };
  const sn11Meta = {
    name: 'Shivneri 11',
    code: 'SN11',
    color: '#8b5cf6',
    captain: 'Suraj Waje',
    ground: 'Lohar Wadi Stadium',
    desc: 'Dynamic squad blending promising village young guns with experienced veteran anchors, known for high-lux derby thrillers.',
  };
  const om11Meta = {
    name: 'Omkar 11',
    code: 'OM11',
    color: '#06b6d4',
    captain: 'Akshay Dilip Mahadik',
    ground: 'Lohar Wadi Stadium',
    desc: 'Hard-hitting batting unit with electric boundary fielders and versatile multi-skilled village champions.',
  };

  const franchiseInfo: { [key: string]: { name: string; code: string; color: string; captain: string; ground: string; desc: string } } = {
    lg: lgMeta,
    'lakshmikant-group': lgMeta,
    msk: lgMeta,
    a11: a11Meta,
    'aaradhya-11': a11Meta,
    mr: a11Meta,
    df: dfMeta,
    'dharmveer-fighter': dfMeta,
    mt: dfMeta,
    s11: s11Meta,
    'saish-11': s11Meta,
    mw: s11Meta,
    sn11: sn11Meta,
    'shivneri-11': sn11Meta,
    mc: sn11Meta,
    om11: om11Meta,
    'omkar-11': om11Meta,
    ms: om11Meta,
  };

  const currentFranchise = franchiseInfo[teamSlug] || {
    name: apiTeam?.name || 'Malghar Franchise',
    code: apiTeam?.short_name || 'MPL',
    color: apiTeam?.primary_color || '#174478',
    captain: apiTeam?.captain?.full_name || 'Appointed Captain',
    ground: 'Lohar Wadi Stadium',
    desc: 'Official registered franchise in the Malghar Premier League.',
  };

  // Find official players for this team from ALL_PLAYERS_DATA
  const officialPlayers = ALL_PLAYERS_DATA.filter((p) => {
    const pCode = String(p.teamCode || '').toLowerCase();
    const pTeam = String(p.currentTeam || '').toLowerCase();
    const targetName = String(currentFranchise.name || '').toLowerCase();
    return (
      pCode === teamSlug ||
      pTeam.includes(teamSlug) ||
      pTeam === targetName
    );
  });

  // Pagination for players
  const totalSquadCount = officialPlayers.length;
  const totalSquadPages = Math.ceil(totalSquadCount / pageSize) || 1;
  const squadStartIndex = (currentPage - 1) * pageSize;
  const paginatedSquad = officialPlayers.slice(squadStartIndex, squadStartIndex + pageSize);

  // Pagination for matches
  const matchesList = teamMatches && teamMatches.length > 0 ? teamMatches : [
    { id: 1, match_number: 1, date: '2026-03-01', status: 'Completed', team_a: { name: currentFranchise.name }, team_b: { name: 'Aaradhya 11' }, result: { result_summary: `${currentFranchise.code} won by 18 runs` } },
    { id: 2, match_number: 4, date: '2026-03-04', status: 'Completed', team_a: { name: currentFranchise.name }, team_b: { name: 'Dharmveer Fighter' }, result: { result_summary: `${currentFranchise.code} won by 4 wickets` } },
    { id: 3, match_number: 7, date: '2026-03-08', status: 'Upcoming', team_a: { name: currentFranchise.name }, team_b: { name: 'Saish 11' }, result: null },
    { id: 4, match_number: 11, date: '2026-03-12', status: 'Upcoming', team_a: { name: currentFranchise.name }, team_b: { name: 'Shivneri 11' }, result: null },
  ];

  if (isLoading) {
    return <LoadingSpinner message="Loading team squad and player records..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 space-y-4 sm:space-y-6 pb-20">
      <Link
        to="/portal/teams"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#174478] hover:bg-[#123660] px-3.5 py-1.5 transition shadow-xs cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)]"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to All Teams
      </Link>

      {/* Team Hero - Compact Sleek Design */}
      <div
        className="rounded-xl p-3.5 sm:p-5 relative overflow-hidden shadow-xs border border-slate-200 text-white"
        style={{
          background: `linear-gradient(135deg, ${currentFranchise.color} 0%, #081a30 90%)`,
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-sm sm:text-base text-white shadow-xs shrink-0 [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)]">
              {currentFranchise.code}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                <Shield className="w-3 h-3 shrink-0" /> Official Premier Franchise · Season 2026
              </div>
              <h1 className="text-base sm:text-xl font-bold text-white tracking-tight truncate">
                {currentFranchise.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-medium text-slate-200">
                <span className="flex items-center gap-1 text-amber-300 font-semibold">
                  <Crown className="w-3 h-3" /> Captain: {currentFranchise.captain}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-300" /> {currentFranchise.ground}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg text-center">
              <div className="text-base sm:text-lg font-bold font-mono text-white leading-tight">{totalSquadCount}</div>
              <div className="text-[9px] text-slate-200 uppercase tracking-wider font-semibold">
                Registered Squad
              </div>
            </div>
          </div>
        </div>

        {currentFranchise.desc && (
          <p className="mt-2.5 text-[11px] sm:text-xs text-slate-200 max-w-3xl leading-relaxed relative z-10 font-normal">
            {currentFranchise.desc}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#cbd5e1] pb-2">
        <button
          onClick={() => {
            setActiveTab('squad');
            setCurrentPage(1);
          }}
          className={`px-4 py-2 text-xs font-bold transition flex items-center gap-2 cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)] ${
            activeTab === 'squad'
              ? 'bg-[#174478] text-white shadow-xs'
              : 'bg-white border border-[#cbd5e1] text-slate-700 hover:bg-[#e9eef5]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Squad Roster ({totalSquadCount} Players)</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('matches');
            setCurrentPage(1);
          }}
          className={`px-4 py-2 text-xs font-bold transition flex items-center gap-2 cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)] ${
            activeTab === 'matches'
              ? 'bg-[#174478] text-white shadow-xs'
              : 'bg-white border border-[#cbd5e1] text-slate-700 hover:bg-[#e9eef5]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Team Fixtures ({matchesList.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: SQUAD ROSTER */}
      {activeTab === 'squad' ? (
        <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-[#e2e8f0] flex items-center justify-between bg-slate-50">
            <span className="text-xs font-extrabold uppercase text-[#174478]">
              {currentFranchise.name} — Full Certified Squad
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">
              {totalSquadCount} Athletes Certified by Official MPL Commission
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {paginatedSquad.map((player) => {
              const isCap = player.leadershipStatus !== 'Squad Member';

              return (
                <Link
                  key={player.id}
                  to={`/portal/players/${player.id}`}
                  className="bg-white rounded-lg p-3.5 border border-[#e2e8f0] shadow-2xs hover:shadow-md hover:border-[#174478] hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#174478]/30 shadow-2xs shrink-0 bg-slate-100">
                        <img
                          src={player.photoUrl}
                          alt={player.fullName}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      {isCap ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase tracking-wider">
                          <Crown className="w-3 h-3" /> {player.leadershipStatus}
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold text-[#174478] bg-slate-100 px-2 py-0.5 rounded">
                          #{player.jerseyNumber}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#174478] transition">
                      {player.fullName}
                    </h4>
                    <div className="text-xs text-slate-500 font-semibold mt-0.5">
                      {player.primaryRole} · {player.battingStyle}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#174478]" /> {player.cityOrVillage}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700">
                      {player.careerStats.runs} Runs · {player.careerStats.wickets} Wkts
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#174478] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalSquadPages}
            totalItems={totalSquadCount}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setCurrentPage(1);
            }}
            pageSizeOptions={[4, 8, 12]}
          />
        </div>
      ) : (
        /* TAB CONTENT: FIXTURES & MATCHES */
        <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-xs overflow-hidden">
          <div className="divide-y divide-[#e2e8f0]">
            {matchesList.map((m: any) => (
              <Link
                key={m.id}
                to={`/portal/matches/${m.id}`}
                className="p-4 flex items-center justify-between hover:bg-[#f8fafc] transition group"
              >
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold mb-1">
                    <span>Match #{m.match_number}</span>
                    <span>•</span>
                    <span>{m.date}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-slate-100 text-[#174478]">
                      {m.status}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-slate-900 group-hover:text-[#174478] transition">
                    {m.team_a?.name} vs {m.team_b?.name}
                  </div>
                  {m.result && (
                    <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                      {m.result.result_summary}
                    </div>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#174478] group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
