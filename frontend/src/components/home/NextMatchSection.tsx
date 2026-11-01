import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Radio } from 'lucide-react';
import { apiClient } from '../../api/client';
import { ScrollReveal } from '../ui/ScrollReveal';
import { TeamBadge } from './TeamBadge';
import { useMagnetic } from './scrollFx';

interface ApiMatch {
  id: number;
  team_a_name?: string;
  team_b_name?: string;
  team_a_short?: string;
  team_b_short?: string;
  team_a_logo?: string | null;
  team_b_logo?: string | null;
  status: string;
  venue?: { name?: string } | string | null;
  date?: string;
}

// Mirrors MatchesPage's own fallback convention — real fixtures once the
// backend has them, sensible placeholders until then. Shaped exactly like
// the real /matches/ API response so both paths render identically.
const FALLBACK_MATCHES: ApiMatch[] = [
  {
    id: -2,
    team_a_name: 'Dharmveer Fighter',
    team_b_name: 'Aaradhya 11',
    status: 'live',
    venue: { name: 'Lohar Wadi Stadium' },
    date: '2026-11-02T19:30:00',
  },
  {
    id: -4,
    team_a_name: 'Lakshmikant Group',
    team_b_name: 'Dharmveer Fighter',
    status: 'scheduled',
    venue: { name: 'Lohar Wadi Stadium' },
    date: '2026-11-04T19:30:00',
  },
  {
    id: -5,
    team_a_name: 'Aaradhya 11',
    team_b_name: 'Saish 11',
    status: 'scheduled',
    venue: { name: 'Lohar Wadi Stadium' },
    date: '2026-11-05T19:30:00',
  },
];

function venueName(venue?: { name?: string } | string | null): string {
  if (!venue) return '';
  return typeof venue === 'string' ? venue : venue.name || '';
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatTime(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function FixtureCard({ match, featured }: { match: ApiMatch; featured?: boolean }) {
  const isLive = match.status === 'live';
  const venue = venueName(match.venue);
  return (
    <div className={`lp-card lp-lift h-full p-5 sm:p-6 flex flex-col gap-5 ${featured ? 'sm:p-7' : ''}`}>
      <div className="flex items-center justify-between">
        {isLive ? (
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
            </span>
            Live now
          </span>
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mpl-gold">Upcoming</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col items-center text-center gap-2 min-w-0 flex-1">
          <TeamBadge name={match.team_a_name} code={match.team_a_short} logoUrl={match.team_a_logo} size={44} />
          <span className="lp-heading text-xs sm:text-sm font-bold text-cloud truncate max-w-full">
            {match.team_a_name || 'TBD'}
          </span>
        </div>
        <span className="lp-heading text-sm font-extrabold text-cloud/25 shrink-0">VS</span>
        <div className="flex flex-col items-center text-center gap-2 min-w-0 flex-1">
          <TeamBadge name={match.team_b_name} code={match.team_b_short} logoUrl={match.team_b_logo} size={44} />
          <span className="lp-heading text-xs sm:text-sm font-bold text-cloud truncate max-w-full">
            {match.team_b_name || 'TBD'}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-navy-line flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-cloud/55">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-mpl-gold" />
          {formatDate(match.date)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-mpl-gold" />
          {formatTime(match.date)}
        </span>
        {venue && <span className="w-full text-center text-cloud/35">{venue}</span>}
      </div>
    </div>
  );
}

export const NextMatchSection: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['home-fixtures'],
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

  const magneticRef = useMagnetic<HTMLAnchorElement>(0.3, 70);
  const pool = data && data.length > 0 ? data : FALLBACK_MATCHES;
  const fixtures = pool.filter((m) => m.status === 'live' || m.status === 'scheduled').slice(0, 3);
  if (fixtures.length === 0) return null;

  return (
    <section className="lp-dot-grid relative py-12 sm:py-16 bg-navy-raised border-y border-navy-line overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <ScrollReveal direction="down" distance={24}>
          <div className="text-center mb-8 sm:mb-10">
            <span className="lp-eyebrow text-mpl-gold justify-center">
              <Calendar className="w-3.5 h-3.5" />
              Fixtures
            </span>
            <h2 className="lp-heading mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-cloud leading-[0.98]">
              What's coming up.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {fixtures.map((m, idx) => (
            <ScrollReveal key={m.id} direction="up" distance={24} delay={idx * 80}>
              <FixtureCard match={m} featured={idx === 0} />
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            ref={magneticRef}
            to="/portal/matches"
            className="group inline-flex items-center gap-2 rounded-xl bg-mpl-gold hover:bg-mpl-gold-light text-navy font-bold text-sm px-7 py-3.5 shadow-lg shadow-mpl-gold/20 transition-[background-color,box-shadow]"
          >
            <Radio className="w-4 h-4" />
            All fixtures & live scores
          </Link>
        </div>
      </div>
    </section>
  );
};
