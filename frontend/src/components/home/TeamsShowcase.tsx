import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight } from 'lucide-react';
import { apiClient } from '../../api/client';
import { ScrollReveal } from '../ui/ScrollReveal';
import { TeamBadge } from './TeamBadge';
import { TEAM_BRANDS, type TeamBrand } from './teamBrand';

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
    <section className="relative py-16 sm:py-24 bg-pitch overflow-hidden">
      <img
        src="/images/bg1.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-left -scale-x-100"
      />
      <div className="absolute inset-0 bg-pitch/60 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-pitch via-transparent to-pitch" />
      <div className="absolute inset-0 bg-gradient-to-r from-pitch/80 via-pitch/35 to-transparent" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <ScrollReveal direction="down" distance={34}>
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <span className="mpl-rule-label">The six</span>
              <h2 className="mpl-display mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold text-chalk leading-[0.97]">
                Six teams, one village.
              </h2>
            </div>
            <Link
              to="/portal/teams"
              className="hidden sm:inline-flex items-center gap-1.5 border-b border-chalk/25 hover:border-sodium hover:text-sodium text-chalk font-semibold text-sm pb-1 transition-colors shrink-0"
            >
              Squads and profiles
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        <ul className="border-b border-chalk/12">
          {teams.map((team, idx) => (
            <ScrollReveal
              key={team.code}
              direction={idx % 2 === 0 ? 'left' : 'right'}
              distance={idx % 2 === 0 ? 44 : 44}
              delay={idx * 60}
            >
              <li>
                <Link
                  to={`/portal/teams/${team.slug}`}
                  className="mpl-ledger-row group flex items-center gap-4 sm:gap-6 border-t border-chalk/12 pl-4 sm:pl-6 pr-3 sm:pr-5 py-3.5 sm:py-4 hover:bg-chalk/[0.04]"
                >
                  <span aria-hidden className="mpl-num hidden sm:block text-chalk/30 text-sm w-7 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <TeamBadge
                    name={team.name}
                    code={team.code}
                    logoUrl={team.logo}
                    color={team.color}
                    size={44}
                  />
                  <span className="mpl-display text-lg sm:text-2xl font-semibold text-chalk group-hover:text-sodium transition-colors leading-none truncate min-w-0">
                    {team.name}
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-chalk/35 shrink-0">
                    {team.code}
                  </span>
                  {team.captain && (
                    <span className="hidden md:block ml-auto text-xs text-chalk/45">
                      Captain <span className="text-chalk/75">{team.captain}</span>
                    </span>
                  )}
                  <ArrowUpRight className="w-4 h-4 ml-auto md:ml-6 text-chalk/25 group-hover:text-sodium transition-colors shrink-0" />
                </Link>
              </li>
            </ScrollReveal>
          ))}
        </ul>

        <Link
          to="/portal/teams"
          className="sm:hidden inline-flex items-center gap-1.5 mt-6 border-b border-chalk/25 text-chalk font-semibold text-sm pb-1"
        >
          Squads and profiles
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
