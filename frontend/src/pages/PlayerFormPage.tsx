import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown } from 'lucide-react';
import { PortalPageWrapper } from '../components/portal/PortalPageWrapper';
import type { PlayerProfileData } from '../data/playersData';
import { getDynamicTeams } from '../utils/dynamicStore';

export const PlayerFormPage: React.FC = () => {
  const navigate = useNavigate();
  const availableTeams = React.useMemo(() => getDynamicTeams(), []);

  // Form Fields matching screenshot 3-column layout
  const [fullName, setFullName] = useState('');
  const [currentTeam, setCurrentTeam] = useState(availableTeams[0]?.name || 'Lakshmikant Group');
  const [primaryRole, setPrimaryRole] = useState<'Batter' | 'Bowler' | 'All-rounder' | 'Wicketkeeper'>('Batter');

  const [jerseyNumber, setJerseyNumber] = useState<number | ''>(10);
  const [cityOrVillage, setCityOrVillage] = useState('Malghar Gavthan');
  const [leadershipStatus, setLeadershipStatus] = useState<'Squad Member' | 'Team Captain' | 'Vice-Captain'>('Squad Member');

  const [battingStyle, setBattingStyle] = useState<'Right-hand' | 'Left-hand'>('Right-hand');
  const [bowlingStyle, setBowlingStyle] = useState('Right-arm Medium Fast');
  const [photoUrl, setPhotoUrl] = useState('');

  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    try {
      const saved = localStorage.getItem('mpl_custom_players_v1');
      const list: PlayerProfileData[] = saved ? JSON.parse(saved) : [];

      const matchedTeam = availableTeams.find((t) => t.name === currentTeam);
      const teamCode = matchedTeam?.short_code || 'MPL';

      const newPlayer: PlayerProfileData = {
        id: 1000 + list.length + 1,
        fullName: fullName.trim(),
        currentTeam,
        teamCode,
        jerseyNumber: Number(jerseyNumber) || 99,
        primaryRole,
        leadershipStatus,
        cityOrVillage: cityOrVillage.trim() || 'Malghar Gavthan',
        battingStyle,
        bowlingStyle,
        isWicketkeeper: primaryRole === 'Wicketkeeper',
        preferredPosition: 'Middle Order',
        season: '2026',
        availability: 'Available',
        potmAwards: 0,
        previousTeams: 'Malghar Champions',
        dob: '2000-01-01',
        age: 24,
        bio: notes.trim() || 'Official registered player for Malghar Premier League 2026.',
        regNumber: `MPL-2026-${String(list.length + 1).padStart(3, '0')}`,
        photoUrl: photoUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        careerStats: {
          matches: 0,
          innings: 0,
          runs: 0,
          highestScore: '0',
          average: '0.00',
          strikeRate: '0.00',
          wickets: 0,
          bestBowling: '0/0',
          economy: '0.00',
          catches: 0,
          stumpings: 0,
        },
      };

      localStorage.setItem('mpl_custom_players_v1', JSON.stringify([newPlayer, ...list]));
      navigate('/portal/players');
    } catch (e) {
      console.error('Failed saving player', e);
    }
  };

  return (
    <PortalPageWrapper
      pageTitle="Register New Player"
      kpis={[]}
      hideToolbar={true}
    >
      {/* 3-Column Rows, Separate Labels, Clean Borderless Canvas */}
      <div className="py-8 sm:py-12 px-4 sm:px-10 max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* ROW 1: 3 COLUMNS (Player full name, Team, Playing role) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Player full name */}
            <div>
              <label htmlFor="player-name" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Player full name
              </label>
              <div className="relative">
                <input
                  id="player-name"
                  type="text"
                  required
                  placeholder="e.g. Prasad Rahate"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs ${
                    fullName.trim().length > 2
                      ? 'border-emerald-400 focus:border-emerald-500 pr-9'
                      : 'border-slate-200 focus:border-[#174478] hover:border-slate-300'
                  }`}
                />
                {fullName.trim().length > 2 && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            </div>

            {/* Team */}
            <div>
              <label htmlFor="player-team" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Tournament team
              </label>
              <div className="relative">
                <select
                  id="player-team"
                  value={currentTeam}
                  onChange={(e) => setCurrentTeam(e.target.value)}
                  className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs cursor-pointer font-medium"
                >
                  {availableTeams.map((t) => (
                    <option key={t.slug || t.name} value={t.name}>
                      {t.name} ({t.short_code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Playing role */}
            <div>
              <label htmlFor="player-role" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Playing role
              </label>
              <div className="relative">
                <select
                  id="player-role"
                  value={primaryRole}
                  onChange={(e) => setPrimaryRole(e.target.value as any)}
                  className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs cursor-pointer font-medium"
                >
                  <option value="Batter">Batter</option>
                  <option value="Bowler">Bowler</option>
                  <option value="All-rounder">All-rounder</option>
                  <option value="Wicketkeeper">Wicketkeeper</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ROW 2: 3 COLUMNS (Jersey number, Village / Area, Leadership status) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Jersey number */}
            <div>
              <label htmlFor="player-jersey" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Jersey number
              </label>
              <input
                id="player-jersey"
                type="number"
                min="1"
                max="999"
                placeholder="e.g. 7"
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs font-mono"
              />
            </div>

            {/* Village / Area */}
            <div>
              <label htmlFor="player-village" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Village / area
              </label>
              <input
                id="player-village"
                type="text"
                placeholder="e.g. Malghar Gavthan, Malghar Wadi"
                value={cityOrVillage}
                onChange={(e) => setCityOrVillage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs"
              />
            </div>

            {/* Leadership status */}
            <div>
              <label htmlFor="player-leadership" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Leadership status
              </label>
              <div className="relative">
                <select
                  id="player-leadership"
                  value={leadershipStatus}
                  onChange={(e) => setLeadershipStatus(e.target.value as any)}
                  className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs cursor-pointer font-medium"
                >
                  <option value="Squad Member">Squad Member</option>
                  <option value="Team Captain">Team Captain</option>
                  <option value="Vice-Captain">Vice-Captain</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ROW 3: 3 COLUMNS (Batting style, Bowling style, Player photo URL) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Batting style */}
            <div>
              <label htmlFor="player-batting" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Batting style
              </label>
              <div className="relative">
                <select
                  id="player-batting"
                  value={battingStyle}
                  onChange={(e) => setBattingStyle(e.target.value as 'Right-hand' | 'Left-hand')}
                  className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs cursor-pointer font-medium"
                >
                  <option value="Right-hand">Right-hand bat</option>
                  <option value="Left-hand">Left-hand bat</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Bowling style */}
            <div>
              <label htmlFor="player-bowling" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Bowling style
              </label>
              <div className="relative">
                <select
                  id="player-bowling"
                  value={bowlingStyle}
                  onChange={(e) => setBowlingStyle(e.target.value)}
                  className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs cursor-pointer font-medium"
                >
                  <option value="Right-arm Medium Fast">Right-arm Medium Fast</option>
                  <option value="Right-arm Fast">Right-arm Fast</option>
                  <option value="Right-arm Off-spin">Right-arm Off-spin</option>
                  <option value="Right-arm Leg-spin">Right-arm Leg-spin</option>
                  <option value="Left-arm Medium">Left-arm Medium</option>
                  <option value="Slow Left-arm">Slow Left-arm</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Player photo URL */}
            <div>
              <label htmlFor="player-photo" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Profile photo URL
              </label>
              <input
                id="player-photo"
                type="text"
                placeholder="Optional (defaults to player avatar)"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs"
              />
            </div>
          </div>

          {/* ROW 4: Player background & scouting remarks (Textarea) */}
          <div>
            <label htmlFor="player-notes" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
              Player bio & scouting remarks
            </label>
            <textarea
              id="player-notes"
              rows={3}
              placeholder="e.g. Proven village power-hitter with notable performances in inter-village championship finals..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs resize-none"
            />
          </div>

          {/* BOTTOM ACTION BAR */}
          <div className="pt-6 sm:pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Registered players will be officially inducted into the Malghar Premier League 2026 team roster.
            </p>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => navigate('/portal/players')}
                className="px-5 py-2.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-600 font-semibold rounded-lg transition text-xs sm:text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#174478] hover:bg-[#123660] text-white font-bold rounded-lg transition shadow-xs text-xs sm:text-sm cursor-pointer"
              >
                Register Player
              </button>
            </div>
          </div>
        </form>
      </div>
    </PortalPageWrapper>
  );
};
