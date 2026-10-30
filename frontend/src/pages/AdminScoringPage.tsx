import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trophy, Shield, AlertCircle, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const AdminScoringPage: React.FC = () => {
  const { matchId } = useParams<{ matchId?: string }>();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // If no matchId provided, find the active live match or fallback to match 3
  const activeMatchId = matchId || '3';

  const [selectedStriker, setSelectedStriker] = useState<string>('');
  const [selectedNonStriker, setSelectedNonStriker] = useState<string>('');
  const [selectedBowler, setSelectedBowler] = useState<string>('');

  const [wicketModalOpen, setWicketModalOpen] = useState(false);
  const [wicketType, setWicketType] = useState('bowled');
  const [fielderId, setFielderId] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  // Fetch match details
  const { data: match, isLoading } = useQuery({
    queryKey: ['admin-match-scoring', activeMatchId],
    queryFn: async () => {
      const res = await apiClient.get(`/matches/${activeMatchId}/`);
      return res.data;
    },
  });

  // Fetch recent deliveries
  const { data: recentDelivs } = useQuery({
    queryKey: ['recent-deliveries', activeMatchId],
    queryFn: async () => {
      const res = await apiClient.get(`/matches/${activeMatchId}/recent-deliveries/`);
      return res.data || [];
    },
  });

  // Current innings (innings 1 or 2)
  const currentInnings = match?.innings?.find((i: any) => !i.is_completed) || match?.innings?.[0];

  // Mutation to record delivery
  const recordDeliveryMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClient.post(`/matches/${activeMatchId}/record-delivery/`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-match-scoring', activeMatchId] });
      queryClient.invalidateQueries({ queryKey: ['recent-deliveries', activeMatchId] });
      setMessage('Ball recorded successfully!');
      setTimeout(() => setMessage(null), 2500);
    },
    onError: (err: any) => {
      setMessage(`Error: ${err.response?.data?.detail || 'Failed to record ball'}`);
    },
  });

  const handleRecordRun = (runs: number, isBoundary = false, isSix = false) => {
    if (!currentInnings) return;

    // Use current or fallback player IDs
    const strikerId = selectedStriker || currentInnings.scorecard?.batting?.[0]?.player_id || 1;
    const nonStrikerId = selectedNonStriker || currentInnings.scorecard?.batting?.[1]?.player_id || 2;
    const bowlerId = selectedBowler || currentInnings.scorecard?.bowling?.[0]?.player_id || 3;

    recordDeliveryMutation.mutate({
      batter: strikerId,
      non_striker: nonStrikerId,
      bowler: bowlerId,
      runs_scored: runs,
      is_boundary: isBoundary,
      is_six: isSix,
      is_wide: false,
      is_no_ball: false,
    });
  };

  const handleRecordExtra = (type: 'wide' | 'no_ball' | 'bye' | 'leg_bye') => {
    if (!currentInnings) return;

    const strikerId = selectedStriker || currentInnings.scorecard?.batting?.[0]?.player_id || 1;
    const nonStrikerId = selectedNonStriker || currentInnings.scorecard?.batting?.[1]?.player_id || 2;
    const bowlerId = selectedBowler || currentInnings.scorecard?.bowling?.[0]?.player_id || 3;

    recordDeliveryMutation.mutate({
      batter: strikerId,
      non_striker: nonStrikerId,
      bowler: bowlerId,
      runs_scored: 0,
      extras_runs: 1,
      is_wide: type === 'wide',
      is_no_ball: type === 'no_ball',
      is_bye: type === 'bye',
      is_leg_bye: type === 'leg_bye',
    });
  };

  const handleConfirmWicket = () => {
    if (!currentInnings) return;

    const strikerId = selectedStriker || currentInnings.scorecard?.batting?.[0]?.player_id || 1;
    const nonStrikerId = selectedNonStriker || currentInnings.scorecard?.batting?.[1]?.player_id || 2;
    const bowlerId = selectedBowler || currentInnings.scorecard?.bowling?.[0]?.player_id || 3;

    recordDeliveryMutation.mutate({
      batter: strikerId,
      non_striker: nonStrikerId,
      bowler: bowlerId,
      runs_scored: 0,
      is_wicket: true,
      wicket_type: wicketType,
      wicket_player: strikerId,
      fielder: fielderId ? parseInt(fielderId) : null,
    });

    setWicketModalOpen(false);
  };

  if (isLoading) {
    return <LoadingSpinner message="Initializing live scoring console..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-rose-400">
            <Shield className="w-4 h-4" /> Official Scorer Terminal
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
            {match?.team_a?.short_name} vs {match?.team_b?.short_name} (Match #{match?.match_number})
          </h1>
        </div>

        <button
          onClick={() => navigate(`/portal/matches/${activeMatchId}`)}
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
        >
          View Public Scorecard →
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* BIG LIVE GAUGE */}
      {currentInnings ? (
        <div className="glass-panel-gold rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="text-xs uppercase tracking-widest font-bold text-amber-400 mb-1">
            {currentInnings.batting_team?.name} Innings
          </div>
          <div className="text-5xl sm:text-7xl font-heading font-black text-white tracking-tight">
            {currentInnings.total_runs} / {currentInnings.total_wickets}
          </div>
          <div className="text-sm font-semibold text-slate-300 mt-2">
            Overs: <span className="font-mono text-amber-300">{currentInnings.total_overs}</span> • Current RR:{' '}
            <span className="font-mono text-emerald-400">{currentInnings.run_rate || '0.0'}</span>
          </div>

          {/* Recent balls stream */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 mr-2 uppercase font-semibold">Last Deliveries:</span>
            {recentDelivs && recentDelivs.length > 0 ? (
              recentDelivs.slice(0, 10).map((d: any, idx: number) => {
                const isWkt = d.is_wicket;
                const isSix = d.is_six;
                const isFour = d.is_boundary;
                const isExtra = d.is_wide || d.is_no_ball;

                return (
                  <span
                    key={idx}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs font-mono shadow-sm ${
                      isWkt
                        ? 'bg-rose-500 text-white'
                        : isSix
                        ? 'bg-purple-600 text-white'
                        : isFour
                        ? 'bg-amber-500 text-slate-950'
                        : isExtra
                        ? 'bg-sky-500 text-white'
                        : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    {isWkt ? 'W' : d.is_wide ? 'Wd' : d.is_no_ball ? 'Nb' : d.runs_scored}
                  </span>
                );
              })
            ) : (
              <span className="text-xs text-slate-500">None yet</span>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-3xl text-center text-slate-400">
          No active innings found for this match.
        </div>
      )}

      {/* QUICK SCORING KEYPAD */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Record Next Delivery
        </h3>

        {/* Regular Runs Row */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[0, 1, 2, 3].map((r) => (
            <button
              key={r}
              onClick={() => handleRecordRun(r)}
              disabled={recordDeliveryMutation.isPending}
              className="py-5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 font-heading font-black text-2xl text-white transition active:scale-95 disabled:opacity-50"
            >
              {r}
            </button>
          ))}
          <button
            onClick={() => handleRecordRun(4, true, false)}
            disabled={recordDeliveryMutation.isPending}
            className="py-5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 font-heading font-black text-2xl text-amber-300 transition active:scale-95 disabled:opacity-50"
          >
            4
          </button>
          <button
            onClick={() => handleRecordRun(6, false, true)}
            disabled={recordDeliveryMutation.isPending}
            className="py-5 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 font-heading font-black text-2xl text-purple-300 transition active:scale-95 disabled:opacity-50"
          >
            6
          </button>
        </div>

        {/* Extras & Wicket Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => handleRecordExtra('wide')}
            disabled={recordDeliveryMutation.isPending}
            className="py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold uppercase text-slate-200 transition"
          >
            Wide (+1)
          </button>
          <button
            onClick={() => handleRecordExtra('no_ball')}
            disabled={recordDeliveryMutation.isPending}
            className="py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold uppercase text-slate-200 transition"
          >
            No-Ball (+1)
          </button>
          <button
            onClick={() => handleRecordExtra('bye')}
            disabled={recordDeliveryMutation.isPending}
            className="py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold uppercase text-slate-200 transition"
          >
            Bye (+1)
          </button>
          <button
            onClick={() => handleRecordExtra('leg_bye')}
            disabled={recordDeliveryMutation.isPending}
            className="py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold uppercase text-slate-200 transition"
          >
            Leg Bye (+1)
          </button>
          <button
            onClick={() => setWicketModalOpen(true)}
            disabled={recordDeliveryMutation.isPending}
            className="py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase shadow-lg shadow-rose-600/30 transition active:scale-95 col-span-2 sm:col-span-1"
          >
            Wicket!
          </button>
        </div>
      </div>

      {/* WICKET MODAL */}
      {wicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4">
            <h3 className="text-xl font-heading font-bold text-white">Record Dismissal</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Dismissal Type
              </label>
              <select
                value={wicketType}
                onChange={(e) => setWicketType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="bowled">Bowled</option>
                <option value="caught">Caught</option>
                <option value="lbw">LBW</option>
                <option value="run_out">Run Out</option>
                <option value="stumped">Stumped</option>
                <option value="hit_wicket">Hit Wicket</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setWicketModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWicket}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase shadow-md"
              >
                Confirm Wicket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
