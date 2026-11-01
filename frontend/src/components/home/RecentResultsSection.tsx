import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Trophy } from 'lucide-react';
import { apiClient } from '../../api/client';
import { ScrollReveal } from '../ui/ScrollReveal';
import { TeamBadge } from './TeamBadge';

interface ApiMatch {
  id: number;
  team_a_name?: string;
  team_b_name?: string;
  team_a_short?: string;
  team_b_short?: string;
  team_a_logo?: string | null;
  team_b_logo?: string | null;
  team_a_score?: string;
  team_b_score?: string;
  status: string;
  result?: { winner_name?: string } | null;
}

// Mirrors MatchesPage's own fallback results until the backend has real
// ones — shaped exactly like the real /matches/ API response.
const FALLBACK_RESULTS: ApiMatch[] = [
  {
    id: -1,
    team_a_name: 'Lakshmikant Group',
    team_b_name: 'Saish 11',
    team_a_score: '168/4 (20)',
    team_b_score: '165/8 (20)',
    status: 'completed',
    result: { winner_name: 'Lakshmikant Group' },
  },
  {
    id: -3,
    team_a_name: 'Shivneri 11',
    team_b_name: 'Omkar 11',
    team_a_score: '175/6 (20)',
    team_b_score: '130/10 (17.4)',
    status: 'completed',
    result: { winner_name: 'Shivneri 11' },
  },
];

export const RecentResultsSection: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['home-recent-results'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/matches/');
        const list = res.data?.results ?? res.data ?? [];
        return Array.isArray(list) ? (list as ApiMatch[]) : [];
      } catch {
        return [] as ApiMatch[];
      }
    },
    staleTime: 60_000,
  });

  const pool = data && data.length > 0 ? data : FALLBACK_RESULTS;
  const results = pool.filter((m) => m.status === 'completed').slice(0, 3);
  if (results.length === 0) return null;

  return (
    <section className="lp-dot-grid relative py-14 sm:py-20 bg-navy overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <ScrollReveal direction="down" distance={24}>
          <div className="flex items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <span className="lp-eyebrow text-mpl-gold">
                <Trophy className="w-3.5 h-3.5" />
                Recent results
              </span>
              <h2 className="lp-heading mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-cloud leading-[0.98]">
                Latest scorecards.
              </h2>
            </div>
            <Link
              to="/portal/matches"
              className="group hidden sm:inline-flex items-center gap-1.5 border-b border-cloud/25 hover:border-mpl-gold hover:text-mpl-gold text-cloud font-semibold text-sm py-2.5 transition-colors shrink-0"
            >
              All results
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {results.map((m, idx) => {
            const winner = m.result?.winner_name;
            return (
              <ScrollReveal key={m.id} direction="up" distance={24} delay={idx * 80}>
                <div className="lp-card lp-lift h-full p-5 sm:p-6 flex flex-col gap-3.5 divide-y divide-navy-line">
                  {[
                    { name: m.team_a_name, code: m.team_a_short, logo: m.team_a_logo, score: m.team_a_score },
                    { name: m.team_b_name, code: m.team_b_short, logo: m.team_b_logo, score: m.team_b_score },
                  ].map((side, i) => (
                    <div key={i} className={`flex items-center gap-3 min-w-0 ${i === 1 ? 'pt-3.5' : ''}`}>
                      <TeamBadge name={side.name} code={side.code} logoUrl={side.logo} size={32} />
                      <div className="min-w-0 flex-1">
                        <div
                          className={`lp-heading text-sm font-bold truncate ${winner === side.name ? 'text-mpl-gold' : 'text-cloud/80'}`}
                        >
                          {side.name || 'TBD'}
                        </div>
                        <div className="lp-num text-[11px] text-cloud/45 truncate">{side.score || '—'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <Link
          to="/portal/matches"
          className="sm:hidden inline-flex items-center gap-1.5 mt-8 border-b border-cloud/25 text-cloud font-semibold text-sm py-3"
        >
          All results
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
