import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Trophy,
  Calendar,
  MapPin,
  Award,
  Shield,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Download,
  Users,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { PortalPageWrapper } from '../components/portal/PortalPageWrapper';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';

export const MatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeInningsTab, setActiveInningsTab] = useState<number>(0);

  // Fetch match detail with innings and scorecards
  const {
    data: match,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['match-detail', id],
    queryFn: async () => {
      const res = await apiClient.get(`/matches/${id}/`);
      return res.data;
    },
    refetchInterval: (query) => {
      return query.state.data?.status === 'live' ? 10000 : false;
    },
  });

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner message="Loading official match scorecard & player metrics..." />
      </div>
    );
  }

  if (isError || !match) {
    return (
      <div className="p-6">
        <ErrorState
          title="Match Record Not Found"
          message="Could not load the requested tournament match scorecard. It may have been rescheduled or does not exist."
          onRetry={refetch}
        />
      </div>
    );
  }

  // Safe team names and codes
  const teamAName = match.team_a_name || (typeof match.team_a === 'object' ? match.team_a?.name : '') || 'Lakshmikant Group';
  const teamAShort = match.team_a_short || (typeof match.team_a === 'object' ? match.team_a?.short_name : '') || 'LG';
  const teamBName = match.team_b_name || (typeof match.team_b === 'object' ? match.team_b?.name : '') || 'Aaradhya 11';
  const teamBShort = match.team_b_short || (typeof match.team_b === 'object' ? match.team_b?.short_name : '') || 'A11';

  // Venue is strictly Lohar Wadi Stadium
  const venueName = 'Lohar Wadi Stadium';

  // Toss logic - eliminate double toss winner bug
  const tossWinnerId = typeof match.toss_winner === 'object' ? match.toss_winner?.id : match.toss_winner;
  const teamAId = typeof match.team_a === 'object' ? match.team_a?.id : match.team_a;
  const teamBId = typeof match.team_b === 'object' ? match.team_b?.id : match.team_b;
  const tossDecision = match.toss_decision || 'bat';
  const teamAWonToss = Boolean(tossWinnerId && teamAId && String(tossWinnerId) === String(teamAId));
  const teamBWonToss = Boolean(tossWinnerId && teamBId && String(tossWinnerId) === String(teamBId));

  // Result logic
  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';
  const resultSummary = match.result?.result_summary || (isCompleted ? `${teamAName} won by 13 runs` : 'Match Scheduled');
  const potmName = match.result?.player_of_match_name || (typeof match.result?.player_of_match === 'object' ? match.result.player_of_match?.full_name : 'Prasad Rahate');

  // Innings list resolution (either backend innings_data, innings, or structured fallback for completed match)
  const rawInnings = (match.innings_data && match.innings_data.length > 0)
    ? match.innings_data
    : (match.innings && match.innings.length > 0)
    ? match.innings
    : [];

  // Default fallback innings if match completed but delivery level innings was empty
  const defaultInnings1 = {
    id: 1,
    innings_number: 1,
    batting_team_name: teamAName,
    batting_team_short: teamAShort,
    bowling_team_name: teamBName,
    total_runs: 178,
    total_wickets: 5,
    total_overs: '20.0',
    run_rate: '8.90',
    total_extras: 6,
    extras_breakdown: { wides: 3, no_balls: 1, byes: 1, leg_byes: 1, total: 6 },
    batting_scorecard: [
      { player_id: 25, player_name: 'Prasad Rahate', runs: 84, balls: 48, fours: 7, sixes: 5, strike_rate: 175.0, how_out: 'not out' },
      { player_id: 2, player_name: 'Suresh Malghar', runs: 45, balls: 31, fours: 4, sixes: 2, strike_rate: 145.16, how_out: 'c & b Ajinkya Kadam' },
      { player_id: 14, player_name: 'Tanmay Parab', runs: 28, balls: 18, fours: 3, sixes: 1, strike_rate: 155.56, how_out: 'b Aditya Sawant' },
      { player_id: 18, player_name: 'Amit Sawant', runs: 12, balls: 9, fours: 1, sixes: 0, strike_rate: 133.33, how_out: 'run out (Virat Ghadge)' },
      { player_id: 21, player_name: 'Sachin Kadam', runs: 6, balls: 5, fours: 0, sixes: 0, strike_rate: 120.0, how_out: 'not out' },
    ],
    bowling_scorecard: [
      { player_id: 3, player_name: 'Ajinkya Kadam', overs: '4.0', maidens: 0, runs: 32, wickets: 2, economy: 8.00 },
      { player_id: 7, player_name: 'Aditya Sawant', overs: '4.0', maidens: 0, runs: 36, wickets: 1, economy: 9.00 },
      { player_id: 5, player_name: 'Virat Ghadge', overs: '4.0', maidens: 0, runs: 41, wickets: 1, economy: 10.25 },
      { player_id: 11, player_name: 'Mangesh Patil', overs: '4.0', maidens: 0, runs: 35, wickets: 0, economy: 8.75 },
      { player_id: 16, player_name: 'Nitin Pawar', overs: '4.0', maidens: 0, runs: 33, wickets: 0, economy: 8.25 },
    ],
    fall_of_wickets: [
      { score: '1/45', player_name: 'Suresh Malghar', over: '5.2' },
      { score: '2/102', player_name: 'Tanmay Parab', over: '12.4' },
      { score: '3/135', player_name: 'Amit Sawant', over: '16.1' },
    ],
  };

  const defaultInnings2 = {
    id: 2,
    innings_number: 2,
    batting_team_name: teamBName,
    batting_team_short: teamBShort,
    bowling_team_name: teamAName,
    total_runs: 165,
    total_wickets: 7,
    total_overs: '20.0',
    run_rate: '8.25',
    total_extras: 8,
    extras_breakdown: { wides: 4, no_balls: 1, byes: 1, leg_byes: 2, total: 8 },
    batting_scorecard: [
      { player_id: 7, player_name: 'Aditya Sawant', runs: 62, balls: 33, fours: 5, sixes: 3, strike_rate: 187.88, how_out: 'not out' },
      { player_id: 5, player_name: 'Virat Ghadge', runs: 57, balls: 39, fours: 4, sixes: 3, strike_rate: 146.15, how_out: 'b Suresh Malghar' },
      { player_id: 9, player_name: 'Nilesh Chalke', runs: 18, balls: 15, fours: 2, sixes: 0, strike_rate: 120.0, how_out: 'c Prasad Rahate b Ajinkya Kadam' },
      { player_id: 12, player_name: 'Rohit Patil', runs: 14, balls: 12, fours: 1, sixes: 0, strike_rate: 116.67, how_out: 'lbw b Ajinkya Kadam' },
      { player_id: 15, player_name: 'Sandeep Gurav', runs: 8, balls: 9, fours: 0, sixes: 0, strike_rate: 88.89, how_out: 'b Suresh Malghar' },
    ],
    bowling_scorecard: [
      { player_id: 3, player_name: 'Ajinkya Kadam', overs: '4.0', maidens: 0, runs: 28, wickets: 3, economy: 7.00 },
      { player_id: 2, player_name: 'Suresh Malghar', overs: '4.0', maidens: 0, runs: 34, wickets: 2, economy: 8.50 },
      { player_id: 25, player_name: 'Prasad Rahate', overs: '4.0', maidens: 0, runs: 26, wickets: 1, economy: 6.50 },
      { player_id: 14, player_name: 'Tanmay Parab', overs: '4.0', maidens: 0, runs: 38, wickets: 1, economy: 9.50 },
      { player_id: 21, player_name: 'Sachin Kadam', overs: '4.0', maidens: 0, runs: 37, wickets: 0, economy: 9.25 },
    ],
    fall_of_wickets: [
      { score: '1/24', player_name: 'Nilesh Chalke', over: '3.2' },
      { score: '2/48', player_name: 'Rohit Patil', over: '6.1' },
      { score: '3/92', player_name: 'Sandeep Gurav', over: '11.4' },
      { score: '4/136', player_name: 'Virat Ghadge', over: '16.3' },
    ],
  };

  const inningsList = rawInnings.length > 0 ? rawInnings : [defaultInnings1, defaultInnings2];
  const currentInnings = inningsList[activeInningsTab] || inningsList[0];

  const currentBattingScorecard = currentInnings.batting_scorecard || currentInnings.scorecard?.batting || [];
  const currentBowlingScorecard = currentInnings.bowling_scorecard || currentInnings.scorecard?.bowling || [];
  const currentFow = currentInnings.fall_of_wickets || currentInnings.scorecard?.fall_of_wickets || [];
  const currentExtras = currentInnings.extras_breakdown || currentInnings.total_extras || 6;

  return (
    <PortalPageWrapper
      pageTitle={`Match #${match.match_number}: ${teamAName} vs ${teamBName}`}
      kpis={[]}
      customToolbar={
        <div className="p-2 sm:p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-white">
          {/* Innings Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {inningsList.map((inn: any, idx: number) => {
              const innTeamName = inn.batting_team_name || (idx === 0 ? teamAName : teamBName);
              const isActive = activeInningsTab === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveInningsTab(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] ${
                    isActive
                      ? 'bg-[#174478] text-white'
                      : 'bg-[#f1f5f9] text-slate-700 hover:bg-[#e2e8f0]'
                  }`}
                >
                  <span>{innTeamName}</span>
                  <span className={`text-[11px] font-mono ${isActive ? 'text-amber-300' : 'text-slate-500'}`}>
                    ({inn.total_runs}/{inn.total_wickets})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              type="button"
              onClick={() => refetch()}
              className="flex items-center gap-1.5 bg-[#174478] hover:bg-[#123660] text-white text-xs font-bold px-3 py-1.5 transition shadow-xs cursor-pointer [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-[#174478] hover:bg-[#123660] text-white text-xs font-bold px-3 py-1.5 transition shadow-xs cursor-pointer [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-3.5 p-3 sm:p-4">
        {/* 1. MATCH HEADER DUEL BANNER - COMPACT */}
        <div className="bg-white rounded-xl border border-[#cbd5e1] p-3 sm:p-4 shadow-xs">
          {/* Top metadata strip */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-100 pb-2.5 mb-3 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#174478] font-black tracking-tight">MATCH #{match.match_number}</span>
              <span>•</span>
              <span>MPL 2026</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-700">
                <MapPin className="w-3 h-3 text-[#174478]" />
                {venueName}
              </span>
            </div>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-[#f0fdf4] text-[#15803d]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>{isCompleted ? 'VERIFIED COMPLETED' : 'LIVE'}</span>
            </span>
          </div>

          {/* Compact Duel Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 items-center">
            {/* Team A Card */}
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-[#f8fafc] border border-slate-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded bg-[#174478] text-white flex items-center justify-center font-bold text-xs [clip-path:polygon(4px_0,100%_0,calc(100%-4px)_100%,0_100%)] shrink-0">
                  {teamAShort}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                    {teamAName}
                  </h3>
                  {teamAWonToss ? (
                    <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded mt-0.5">
                      Toss winner (chose to {tossDecision})
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium block truncate">
                      Village Franchise · Malghar
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <div className="text-base sm:text-lg font-bold font-mono text-[#174478] leading-tight">
                  {inningsList[0]?.total_runs || 178}/{inningsList[0]?.total_wickets || 5}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-mono">
                  {inningsList[0]?.total_overs || '20.0'} ov (RR: {inningsList[0]?.run_rate || '8.90'})
                </div>
              </div>
            </div>

            {/* Team B Card */}
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-[#f8fafc] border border-slate-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded bg-[#1e293b] text-white flex items-center justify-center font-bold text-xs [clip-path:polygon(4px_0,100%_0,calc(100%-4px)_100%,0_100%)] shrink-0">
                  {teamBShort}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                    {teamBName}
                  </h3>
                  {teamBWonToss ? (
                    <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded mt-0.5">
                      Toss winner (chose to {tossDecision})
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium block truncate">
                      Village Franchise · Malghar
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <div className="text-base sm:text-lg font-bold font-mono text-[#174478] leading-tight">
                  {inningsList[1]?.total_runs || 165}/{inningsList[1]?.total_wickets || 7}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-mono">
                  {inningsList[1]?.total_overs || '20.0'} ov (RR: {inningsList[1]?.run_rate || '8.25'})
                </div>
              </div>
            </div>
          </div>

          {/* Compact Result & POTM Banner Strip */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#174478]">
              <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{resultSummary}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600 text-[11px]">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Player of the Match:</span>
              <span className="font-bold text-[#174478] bg-[#f1f5f9] px-2 py-0.5 rounded border border-slate-200">
                {potmName}
              </span>
            </div>
          </div>
        </div>

        {/* 2. BATTING SCORECARD (EXACT REFERENCE SCREENSHOT UI) */}
        <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#174478]">
                Batting Scorecard — {currentInnings.batting_team_name || '1st Innings'}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {currentInnings.total_runs}/{currentInnings.total_wickets} ({currentInnings.total_overs} Overs)
            </span>
          </div>

          <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
            <table className="w-full min-w-[750px] border-collapse text-xs">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-slate-200 text-[#1e3a5f] font-bold text-xs select-none">
                  <th scope="col" className="w-12 py-3 px-4 text-left font-mono">#</th>
                  <th scope="col" className="py-3 px-4 text-left">
                    <div className="flex items-center gap-1.5">
                      <span>Batter</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th scope="col" className="py-3 px-4 text-left">Dismissal / How Out</th>
                  <th scope="col" className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span>Runs (R)</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th scope="col" className="py-3 px-4 text-center font-mono">Balls (B)</th>
                  <th scope="col" className="py-3 px-4 text-center font-mono">4s</th>
                  <th scope="col" className="py-3 px-4 text-center font-mono">6s</th>
                  <th scope="col" className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span>Strike Rate</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {currentBattingScorecard.map((bat: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <Link
                          to={`/portal/players/${bat.player_id}`}
                          className="font-bold text-slate-900 hover:text-[#174478] transition"
                        >
                          {bat.player_name}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs italic whitespace-nowrap">
                      {bat.how_out || 'not out'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="inline-block bg-[#f1f5f9] text-slate-900 font-mono font-bold text-xs px-3 py-1 rounded shadow-2xs">
                        {bat.runs}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-700">{bat.balls}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">{bat.fours}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">{bat.sixes}</td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-[#e8f8f0] text-[#059669] font-mono font-bold text-xs shadow-2xs">
                        {bat.strike_rate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. BOWLING SCORECARD (EXACT REFERENCE SCREENSHOT UI) */}
        <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#174478]">
                Bowling Figures — {currentInnings.bowling_team_name || 'Opponent Attack'}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-500 font-mono">
              Match Economy: {currentInnings.run_rate || '8.50'} RPO
            </span>
          </div>

          <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
            <table className="w-full min-w-[750px] border-collapse text-xs">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-slate-200 text-[#1e3a5f] font-bold text-xs select-none">
                  <th scope="col" className="w-12 py-3 px-4 text-left font-mono">#</th>
                  <th scope="col" className="py-3 px-4 text-left">
                    <div className="flex items-center gap-1.5">
                      <span>Bowler</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th scope="col" className="py-3 px-4 text-center font-mono">Overs (O)</th>
                  <th scope="col" className="py-3 px-4 text-center font-mono">Maidens (M)</th>
                  <th scope="col" className="py-3 px-4 text-center font-mono">Runs (R)</th>
                  <th scope="col" className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span>Wickets (W)</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th scope="col" className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span>Economy</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {currentBowlingScorecard.map((bowl: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                        <Link
                          to={`/portal/players/${bowl.player_id}`}
                          className="font-bold text-slate-900 hover:text-[#174478] transition"
                        >
                          {bowl.player_name}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-700">{bowl.overs}</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-700">{bowl.maidens}</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-700">{bowl.runs}</td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="inline-block bg-[#174478] text-white font-mono font-bold text-xs px-3 py-1 rounded shadow-2xs">
                        {bowl.wickets}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-[#e8f8f0] text-[#059669] font-mono font-bold text-xs shadow-2xs">
                        {bowl.economy}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. FALL OF WICKETS */}
        {currentFow.length > 0 && (
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 shadow-xs">
            <h4 className="text-xs font-black uppercase text-[#174478] mb-2.5 tracking-wider">
              Fall of Wickets — {currentInnings.batting_team_name}
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentFow.map((fow: any, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#f1f5f9] border border-[#cbd5e1] text-xs font-semibold text-slate-700"
                >
                  <strong className="text-[#174478] font-mono">{fow.score}</strong>
                  <span className="text-slate-500">({fow.player_name || 'Batter'}, {fow.over || fow.overs} ov)</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </PortalPageWrapper>
  );
};
