import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, ListOrdered } from 'lucide-react';
import { apiClient } from '../../api/client';
import { ScrollReveal } from '../ui/ScrollReveal';
import { TeamBadge } from './TeamBadge';

interface StandingTeam {
  id: number;
  name: string;
  short_name?: string;
  logo?: string | null;
  primary_color?: string;
}

interface Standing {
  team: StandingTeam;
  played: number;
  won: number;
  lost: number;
  points: number;
  position: number;
}

// Mirrors PointsTablePage's own "verified official franchises" fallback —
// shaped exactly like the real /points-table/ API response.
const FALLBACK_STANDINGS: Standing[] = [
  { team: { id: -1, name: 'Lakshmikant Group', short_name: 'LG' }, played: 4, won: 4, lost: 0, points: 8, position: 1 },
  { team: { id: -2, name: 'Dharmveer Fighter', short_name: 'DF' }, played: 4, won: 3, lost: 1, points: 6, position: 2 },
  { team: { id: -3, name: 'Aaradhya 11', short_name: 'A11' }, played: 4, won: 2, lost: 2, points: 4, position: 3 },
  { team: { id: -4, name: 'Saish 11', short_name: 'S11' }, played: 4, won: 2, lost: 2, points: 4, position: 4 },
];

const RANK_ACCENT: Record<number, string> = {
  1: '#f3cb69',
  2: '#d7dbe0',
  3: '#c98a4a',
};

export const PointsTablePreview: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['home-points-table'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/points-table/');
        const list = res.data?.standings ?? res.data?.results ?? res.data ?? [];
        return Array.isArray(list) ? (list as Standing[]) : [];
      } catch {
        return [] as Standing[];
      }
    },
    staleTime: 60_000,
  });

  const standings = (data && data.length > 0 ? data : FALLBACK_STANDINGS)
    .slice()
    .sort((a, b) => a.position - b.position)
    .slice(0, 4);

  return (
    <section className="lp-dot-grid relative py-14 sm:py-20 bg-navy overflow-hidden">
      <span className="lp-section-mark absolute -top-6 right-4 sm:right-8 text-[8rem] sm:text-[11rem]" aria-hidden>
        02
      </span>
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <ScrollReveal direction="down" distance={24}>
          <div className="text-center mb-8 sm:mb-10">
            <span className="lp-eyebrow text-mpl-gold justify-center">
              <ListOrdered className="w-3.5 h-3.5" />
              Standings
            </span>
            <h2 className="lp-heading mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold text-cloud leading-[0.98]">
              Who's on top.
            </h2>
          </div>
        </ScrollReveal>

        <div className="lp-card divide-y divide-navy-line overflow-hidden max-w-3xl mx-auto">
          {standings.map((row, idx) => {
            const accent = RANK_ACCENT[row.position];
            return (
              <ScrollReveal key={row.team.id} direction="up" distance={18} delay={idx * 70}>
                <div className="flex items-center gap-4 sm:gap-6 px-5 sm:px-8 py-4 sm:py-5">
                  <span
                    className="lp-num w-8 text-xl sm:text-2xl shrink-0"
                    style={{ color: accent ?? 'var(--color-cloud)', opacity: accent ? 1 : 0.4 }}
                  >
                    {row.position}
                  </span>
                  <TeamBadge name={row.team.name} code={row.team.short_name} logoUrl={row.team.logo} size={38} />
                  <span className="lp-heading flex-1 min-w-0 truncate text-sm sm:text-lg font-bold text-cloud">
                    {row.team.name}
                  </span>
                  <span className="hidden sm:block text-xs text-cloud/40 shrink-0">
                    {row.won}W–{row.lost}L · {row.played} played
                  </span>
                  <span className="lp-num text-lg sm:text-xl text-mpl-gold shrink-0 w-10 text-right">
                    {row.points}
                  </span>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/portal/points-table"
            className="group inline-flex items-center gap-1.5 border-b border-cloud/25 hover:border-mpl-gold hover:text-mpl-gold text-cloud/80 font-semibold text-sm py-2.5 transition-colors"
          >
            Full points table
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
