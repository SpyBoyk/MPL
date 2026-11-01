import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Users } from 'lucide-react';
import { apiClient } from '../../api/client';
import { ScrollReveal } from '../ui/ScrollReveal';
import { TeamBadge } from './TeamBadge';
import { TEAM_BRANDS, type TeamBrand } from './teamBrand';
import { TiltCard } from './TiltCard';

interface ApiTeam {
  id: number;
  name: string;
  short_name: string;
  slug: string;
  logo?: string | null;
  primary_color?: string;
  captain?: string | null;
}

type DisplayTeam = TeamBrand & { captain?: string | null };

export const TeamsShowcase: React.FC = () => {
  const { data: apiTeams } = useQuery({
    queryKey: ['home-teams'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/teams/');
        const list = res.data?.results ?? res.data ?? [];
        return Array.isArray(list) ? (list as ApiTeam[]) : [];
      } catch {
        return [] as ApiTeam[];
      }
    },
    staleTime: 60_000,
  });

  // Always render all 6 official franchises; merge real backend fields
  // (logo/captain/slug/color) wherever a matching team record exists.
  const teams: DisplayTeam[] = TEAM_BRANDS.map((brand) => {
    const match = apiTeams?.find(
      (t) => t.short_name?.toUpperCase() === brand.code || t.name === brand.name
    );
    return {
      ...brand,
      slug: match?.slug || brand.slug,
      color: match?.primary_color || brand.color,
      logo: match?.logo || brand.logo,
      captain: match?.captain,
    };
  });

  return (
    <section className="lp-dot-grid relative py-14 sm:py-20 bg-navy overflow-hidden">
      <div className="lp-glow w-[32rem] h-[32rem] bg-mpl-gold/10 -top-20 right-0" aria-hidden />
      <span className="lp-section-mark absolute -top-6 right-4 sm:right-8 text-[8rem] sm:text-[11rem]" aria-hidden>
        01
      </span>

      <div className="relative max-w-7xl mx-auto">
        <div className="px-5 sm:px-8 lg:px-10">
          <ScrollReveal direction="down" distance={30}>
            <div className="flex items-end justify-between gap-4 mb-8 sm:mb-10">
              <div>
                <span className="lp-eyebrow text-mpl-gold">
                  <Users className="w-3.5 h-3.5" />
                  The six
                </span>
                <h2 className="lp-heading mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold text-cloud leading-[0.98]">
                  Six teams, one village.
                </h2>
              </div>
              <Link
                to="/portal/teams"
                className="group hidden sm:inline-flex items-center gap-1.5 border-b border-cloud/25 hover:border-mpl-gold hover:text-mpl-gold text-cloud font-semibold text-sm py-2.5 transition-colors shrink-0"
              >
                Squads and profiles
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Auto-scrolling marquee of team cards — keeps moving, pauses on hover/touch */}
        <div className="lp-perspective overflow-hidden">
          <div className="animate-marquee-left flex gap-4 sm:gap-5 w-max">
            {[0, 1].map((copy) =>
              teams.map((team, idx) => (
                <TiltCard
                  key={`${copy}-${team.code}`}
                  maxTilt={6}
                  className="group shrink-0 w-[78vw] sm:w-80 lp-card lp-lift overflow-hidden transition-colors hover:border-[var(--team-color)]"
                  style={{ ['--team-color' as string]: team.color } as React.CSSProperties}
                >
                  <Link to={`/portal/teams/${team.slug}`} className="relative block p-6 sm:p-7 h-full">
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(120% 100% at 100% 0%, ${team.color}2e, transparent 65%)`,
                      }}
                      aria-hidden
                    />
                    <div className="relative flex items-start justify-between">
                      <span className="lp-num text-cloud/25 text-sm">{String(idx + 1).padStart(2, '0')}</span>
                      <ArrowUpRight className="w-4 h-4 text-cloud/25 group-hover:text-cloud transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>

                    <div className="relative mt-5 flex items-center gap-4">
                      <TeamBadge name={team.name} code={team.code} logoUrl={team.logo} color={team.color} size={52} />
                      <div className="min-w-0">
                        <div className="lp-heading text-xl sm:text-2xl font-bold text-cloud leading-none truncate">
                          {team.name}
                        </div>
                        <div
                          className="mt-1.5 text-[10px] font-bold tracking-[0.25em]"
                          style={{ color: team.color }}
                        >
                          {team.code}
                        </div>
                      </div>
                    </div>

                    <div className="relative mt-5 pt-4 border-t border-navy-line text-xs text-cloud/45">
                      {team.captain ? (
                        <>
                          Captain <span className="text-cloud/80 font-medium">{team.captain}</span>
                        </>
                      ) : (
                        'Squad to be confirmed'
                      )}
                    </div>
                  </Link>
                </TiltCard>
              ))
            )}
          </div>
        </div>

        <div className="px-5 sm:px-8 lg:px-10">
          <Link
            to="/portal/teams"
            className="sm:hidden inline-flex items-center gap-1.5 mt-6 border-b border-cloud/25 text-cloud font-semibold text-sm py-3"
          >
            Squads and profiles
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
