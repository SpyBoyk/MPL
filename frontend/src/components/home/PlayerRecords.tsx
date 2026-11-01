import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Users } from 'lucide-react';
import { apiClient } from '../../api/client';
import { ALL_PLAYERS_DATA } from '../../data/playersData';
import { ScrollReveal } from '../ui/ScrollReveal';
import { useMagnetic } from './scrollFx';

// A representative sample (captains + a spread of squad members) rather
// than rendering all 58+ tiles — keeps the wall lively without bloating
// the page with dozens of images. Sachin Pawar excluded from this featured
// spread at request — he's still on record on the full players page.
const FEATURED_PLAYERS = ALL_PLAYERS_DATA.filter(
  (p) => p.fullName !== 'Sachin Pawar' && (p.leadershipStatus === 'Team Captain' || p.id % 5 === 0)
).slice(0, 18);

export const PlayerRecords: React.FC = () => {
  const { data: overview } = useQuery({
    queryKey: ['tournament-overview'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/tournament-overview/');
        return res.data;
      } catch {
        return null;
      }
    },
    staleTime: 60_000,
  });

  const playersCount = overview?.players_count ?? ALL_PLAYERS_DATA.length;
  const magneticRef = useMagnetic<HTMLAnchorElement>(0.3, 70);

  return (
    <section className="lp-dot-grid relative py-14 sm:py-20 bg-navy overflow-hidden">
      <div className="lp-glow w-[28rem] h-[28rem] bg-mpl-gold/10 -bottom-32 right-0" aria-hidden />
      <span className="lp-section-mark absolute -top-6 right-4 sm:right-8 text-[8rem] sm:text-[11rem]" aria-hidden>
        06
      </span>
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <ScrollReveal direction="up" distance={24}>
          <div className="mb-8 sm:mb-10">
            <span className="lp-eyebrow text-mpl-gold">
              <Users className="w-3.5 h-3.5" />
              On record
            </span>
            <h2 className="lp-heading mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold text-cloud leading-[0.98]">
              Every player, on paper.
            </h2>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-cloud/55 leading-relaxed">
              Runs, wickets and four seasons of history for every name in the squad — tap a face for the
              full profile.
            </p>
          </div>
        </ScrollReveal>

        <p className="mb-3 flex items-center gap-4 text-[11px] text-cloud/40 font-semibold tracking-wide">
          <span>
            <span aria-hidden className="inline-block w-1.5 h-1.5 rounded-full bg-mpl-gold mr-1.5 align-middle" />
            Captain
          </span>
          <span>
            <span aria-hidden className="inline-block w-1.5 h-1.5 rounded-full bg-cloud/30 mr-1.5 align-middle" />
            Squad member
          </span>
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3">
          {FEATURED_PLAYERS.map((player, idx) => (
            <ScrollReveal key={player.id} direction="up" distance={18} delay={(idx % 6) * 50}>
              <Link
                to={`/portal/players/${player.id}`}
                className="group relative block aspect-square overflow-hidden rounded-xl bg-black/40 shadow-lg shadow-black/30"
              >
                <img
                  src={player.photoUrl}
                  alt={player.fullName}
                  className="w-full h-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-[1.05]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/10 to-transparent" />
                <span
                  className={`absolute left-2 top-2 w-1.5 h-1.5 rounded-full ${
                    player.leadershipStatus === 'Team Captain' ? 'bg-mpl-gold' : 'bg-cloud/30'
                  }`}
                  title={player.leadershipStatus === 'Team Captain' ? 'Team captain' : undefined}
                />
                <div className="absolute inset-x-0 bottom-0 p-2 sm:p-2.5">
                  <span className="block text-[11px] sm:text-xs font-semibold text-cloud truncate">
                    {player.fullName}
                  </span>
                  <span className="block text-[9px] tracking-[0.2em] text-mpl-gold/90 font-semibold truncate">
                    {player.teamCode}
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <Link
          ref={magneticRef}
          to="/portal/players"
          className="group mt-8 sm:mt-10 inline-flex items-center gap-2 rounded-xl bg-mpl-gold hover:bg-mpl-gold-light text-navy font-bold text-sm px-7 py-3.5 shadow-lg shadow-mpl-gold/20 hover:shadow-xl hover:shadow-mpl-gold/35 transition-[background-color,box-shadow]"
        >
          All {playersCount} players
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
};
