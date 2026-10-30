import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown } from 'lucide-react';
import { PortalPageWrapper } from '../components/portal/PortalPageWrapper';
import { getDynamicTeams } from '../utils/dynamicStore';

export const MatchFormPage: React.FC = () => {
  const navigate = useNavigate();
  const availableTeams = React.useMemo(() => getDynamicTeams(), []);

  // Form Fields matching screenshot 3-column layout
  const [matchNumber, setMatchNumber] = useState<number | ''>(11);
  const [team1, setTeam1] = useState(availableTeams[0]?.name || 'Lakshmikant Group');
  const [team2, setTeam2] = useState(availableTeams[1]?.name || 'Aaradhya 11');

  const [date, setDate] = useState('2026-03-15');
  const [time, setTime] = useState('10:00 AM');
  const [status, setStatus] = useState<'scheduled' | 'live' | 'completed'>('scheduled');

  const [venue, setVenue] = useState('Lohar Wadi Stadium');
  const [round, setRound] = useState('Group Stage');
  const [tossDecision, setTossDecision] = useState('bat');

  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!team1 || !team2) return;

    try {
      const saved = localStorage.getItem('mpl_custom_matches_v1');
      const list = saved ? JSON.parse(saved) : [];

      const newMatch = {
        id: 2000 + list.length + 1,
        match_number: Number(matchNumber) || list.length + 1,
        team1_name: team1,
        team2_name: team2,
        team1: { name: team1 },
        team2: { name: team2 },
        date,
        time,
        status,
        venue: 'Lohar Wadi Stadium',
        venue_name: 'Lohar Wadi Stadium',
        stage: round,
        round,
        toss_decision: tossDecision,
        notes,
      };

      localStorage.setItem('mpl_custom_matches_v1', JSON.stringify([newMatch, ...list]));
      navigate('/portal/matches');
    } catch (e) {
      console.error('Failed saving match', e);
    }
  };

  return (
    <PortalPageWrapper
      pageTitle="Schedule Tournament Match"
      kpis={[]}
      hideToolbar={true}
    >
      {/* 3-Column Rows, Separate Labels, Clean Borderless Canvas */}
      <div className="py-8 sm:py-12 px-4 sm:px-10 max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* ROW 1: 3 COLUMNS (Match number, Team 1, Team 2) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Match number */}
            <div>
              <label htmlFor="match-number" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Match number
              </label>
              <div className="relative">
                <input
                  id="match-number"
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 11"
                  value={matchNumber}
                  onChange={(e) => setMatchNumber(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs font-mono"
                />
                {matchNumber && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            </div>

            {/* Team 1 */}
            <div>
              <label htmlFor="match-team1" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                First team (Team A)
              </label>
              <div className="relative">
                <select
                  id="match-team1"
                  value={team1}
                  onChange={(e) => setTeam1(e.target.value)}
                  className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs cursor-pointer font-medium"
                >
                  {availableTeams.map((t) => (
                    <option key={`t1-${t.slug || t.name}`} value={t.name}>
                      {t.name} ({t.short_code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Team 2 */}
            <div>
              <label htmlFor="match-team2" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Second team (Team B)
              </label>
              <div className="relative">
                <select
                  id="match-team2"
                  value={team2}
                  onChange={(e) => setTeam2(e.target.value)}
                  className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs cursor-pointer font-medium"
                >
                  {availableTeams.map((t) => (
                    <option key={`t2-${t.slug || t.name}`} value={t.name}>
                      {t.name} ({t.short_code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ROW 2: 3 COLUMNS (Date, Time, Status) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Match date */}
            <div>
              <label htmlFor="match-date" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Fixture date
              </label>
              <input
                id="match-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs font-mono"
              />
            </div>

            {/* Match time */}
            <div>
              <label htmlFor="match-time" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Start time
              </label>
              <div className="relative">
                <select
                  id="match-time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs cursor-pointer font-medium"
                >
                  <option value="09:00 AM">09:00 AM (Morning Session)</option>
                  <option value="11:30 AM">11:30 AM (Mid-day Session)</option>
                  <option value="02:30 PM">02:30 PM (Afternoon Session)</option>
                  <option value="06:00 PM">06:00 PM (Floodlit Derby)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Match status */}
            <div>
              <label htmlFor="match-status" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Match status
              </label>
              <div className="relative">
                <select
                  id="match-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs cursor-pointer font-medium"
                >
                  <option value="scheduled">Scheduled Fixture</option>
                  <option value="live">Live in Progress</option>
                  <option value="completed">Completed & Verified</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ROW 3: 3 COLUMNS (Venue, Tournament round, Toss decision) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Venue strictly Lohar Wadi Stadium */}
            <div>
              <label htmlFor="match-venue" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Venue & ground
              </label>
              <input
                id="match-venue"
                type="text"
                readOnly
                value={venue}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs sm:text-sm outline-none font-bold"
              />
            </div>

            {/* Tournament round */}
            <div>
              <label htmlFor="match-round" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Tournament round
              </label>
              <div className="relative">
                <select
                  id="match-round"
                  value={round}
                  onChange={(e) => setRound(e.target.value)}
                  className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs cursor-pointer font-medium"
                >
                  <option value="Group Stage">Group Stage</option>
                  <option value="Semi-Final 1">Semi-Final 1</option>
                  <option value="Semi-Final 2">Semi-Final 2</option>
                  <option value="Grand Final">Grand Final</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Toss decision */}
            <div>
              <label htmlFor="match-toss" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Default toss choice
              </label>
              <div className="relative">
                <select
                  id="match-toss"
                  value={tossDecision}
                  onChange={(e) => setTossDecision(e.target.value)}
                  className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs cursor-pointer font-medium"
                >
                  <option value="bat">Elected to Bat</option>
                  <option value="bowl">Elected to Bowl</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ROW 4: Match Notes / Highlights */}
          <div>
            <label htmlFor="match-notes" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
              Fixture remarks & umpire assignment
            </label>
            <textarea
              id="match-notes"
              rows={3}
              placeholder="e.g. Official league match under standard MPL 20-over regulations with certified panel umpires..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs resize-none"
            />
          </div>

          {/* BOTTOM ACTION BAR */}
          <div className="pt-6 sm:pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Matches scheduled will immediately become active in the official tournament calendar and fixtures board.
            </p>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => navigate('/portal/matches')}
                className="px-5 py-2.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-600 font-semibold rounded-lg transition text-xs sm:text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#174478] hover:bg-[#123660] text-white font-bold rounded-lg transition shadow-xs text-xs sm:text-sm cursor-pointer"
              >
                Schedule Match
              </button>
            </div>
          </div>
        </form>
      </div>
    </PortalPageWrapper>
  );
};
