import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown } from 'lucide-react';
import { PortalPageWrapper } from '../components/portal/PortalPageWrapper';

export const TeamFormPage: React.FC = () => {
  const navigate = useNavigate();

  // Form Fields matching screenshot 3-column layout
  const [name, setName] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [color, setColor] = useState('#174478');

  const [captain, setCaptain] = useState('');
  const [ground, setGround] = useState('Lohar Wadi Stadium');
  const [group, setGroup] = useState<'Group A' | 'Group B'>('Group A');

  const [desc, setDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const saved = localStorage.getItem('mpl_custom_teams_v1');
      const list = saved ? JSON.parse(saved) : [];

      const code = (shortCode.trim() || name.slice(0, 3)).toUpperCase();
      const newTeam = {
        id: 3000 + list.length + 1,
        name: name.trim(),
        short_code: code,
        code,
        short_name: code,
        primary_color: color,
        color,
        captain: captain.trim() || 'Appointed Captain',
        captain_name: captain.trim() || 'Appointed Captain',
        ground: 'Lohar Wadi Stadium',
        group,
        desc: desc.trim() || 'Official registered franchise in the Malghar Premier League 2026.',
        total_runs: 0,
        matches_played: 0,
        points: 0,
        nrr: '+0.000',
      };

      localStorage.setItem('mpl_custom_teams_v1', JSON.stringify([newTeam, ...list]));
      navigate('/portal/teams');
    } catch (e) {
      console.error('Failed saving team', e);
    }
  };

  return (
    <PortalPageWrapper
      pageTitle="Register Tournament Franchise"
      kpis={[]}
      hideToolbar={true}
    >
      {/* 3-Column Rows, Separate Labels, Clean Borderless Canvas */}
      <div className="py-8 sm:py-12 px-4 sm:px-10 max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* ROW 1: 3 COLUMNS (Franchise name, Short code, Primary color) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Franchise name */}
            <div>
              <label htmlFor="team-name" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Franchise name
              </label>
              <div className="relative">
                <input
                  id="team-name"
                  type="text"
                  required
                  placeholder="e.g. Malghar Super Kings"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs ${
                    name.trim().length > 2
                      ? 'border-emerald-400 focus:border-emerald-500 pr-9'
                      : 'border-slate-200 focus:border-[#174478] hover:border-slate-300'
                  }`}
                />
                {name.trim().length > 2 && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            </div>

            {/* Short code */}
            <div>
              <label htmlFor="team-code" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Short code (2-4 letters)
              </label>
              <input
                id="team-code"
                type="text"
                maxLength={4}
                required
                placeholder="e.g. MSK"
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs font-mono font-bold uppercase"
              />
            </div>

            {/* Primary color */}
            <div>
              <label htmlFor="team-color" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Franchise theme color
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  id="team-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-200 p-0.5 cursor-pointer bg-white"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* ROW 2: 3 COLUMNS (Team captain, Home ground, Tournament group) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Team captain */}
            <div>
              <label htmlFor="team-captain" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Appointed captain
              </label>
              <input
                id="team-captain"
                type="text"
                placeholder="e.g. Prasad Rahate"
                value={captain}
                onChange={(e) => setCaptain(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs"
              />
            </div>

            {/* Home ground strictly Lohar Wadi Stadium */}
            <div>
              <label htmlFor="team-ground" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Home ground
              </label>
              <input
                id="team-ground"
                type="text"
                readOnly
                value={ground}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs sm:text-sm outline-none font-bold"
              />
            </div>

            {/* Tournament group */}
            <div>
              <label htmlFor="team-group" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Tournament group
              </label>
              <div className="relative">
                <select
                  id="team-group"
                  value={group}
                  onChange={(e) => setGroup(e.target.value as any)}
                  className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs cursor-pointer font-medium"
                >
                  <option value="Group A">Group A</option>
                  <option value="Group B">Group B</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ROW 3: Franchise bio & squad profile (Textarea) */}
          <div>
            <label htmlFor="team-desc" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
              Franchise background & squad overview
            </label>
            <textarea
              id="team-desc"
              rows={3}
              placeholder="e.g. Known for clinical death overs bowling, strategic leadership, and explosive top-order strokeplay..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs resize-none"
            />
          </div>

          {/* BOTTOM ACTION BAR */}
          <div className="pt-6 sm:pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Registered franchises will be officially inducted into the Malghar Premier League 2026 championship.
            </p>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => navigate('/portal/teams')}
                className="px-5 py-2.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-600 font-semibold rounded-lg transition text-xs sm:text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#174478] hover:bg-[#123660] text-white font-bold rounded-lg transition shadow-xs text-xs sm:text-sm cursor-pointer"
              >
                Register Team
              </button>
            </div>
          </div>
        </form>
      </div>
    </PortalPageWrapper>
  );
};
