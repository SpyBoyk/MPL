import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LayoutGrid, Swords, Trophy as TrophyIcon } from 'lucide-react';
import { apiClient } from '../../api/client';
import { ScrollReveal } from '../ui/ScrollReveal';
import { useDrawPath } from './scrollFx';

const STAGES = [
  {
    icon: LayoutGrid,
    title: 'Group stage',
    copy: 'Every team plays through the round-robin group fixtures at Lohar Wadi Stadium.',
  },
  {
    icon: Swords,
    title: 'Knockouts',
    copy: 'Top sides carry their group form into the semi-final knockout rounds.',
  },
  {
    icon: TrophyIcon,
    title: 'The final',
    copy: 'One floodlit night, two teams, the cup and ₹50,000 on the line.',
  },
];

export const TournamentOverviewSection: React.FC = () => {
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

  const lineRef = useDrawPath<SVGLineElement>();
  const teamsCount = overview?.teams_count ?? 6;
  const playersCount = overview?.players_count ?? 58;

  return (
    <section className="lp-dot-grid relative py-12 sm:py-16 bg-navy overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <ScrollReveal direction="down" distance={24}>
          <div className="text-center mb-10 sm:mb-12">
            <span className="lp-eyebrow text-mpl-gold justify-center">
              <LayoutGrid className="w-3.5 h-3.5" />
              Tournament overview
            </span>
            <h2 className="lp-heading mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-cloud leading-[0.98]">
              {teamsCount} teams, {playersCount} players, one format.
            </h2>
          </div>
        </ScrollReveal>

        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
          <div aria-hidden className="hidden sm:block absolute top-6 left-[16.6%] right-[16.6%] h-px">
            <svg className="block w-full h-full overflow-visible" viewBox="0 0 100 1" preserveAspectRatio="none">
              <line ref={lineRef} x1="0" y1="0.5" x2="100" y2="0.5" stroke="var(--color-navy-line)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeDasharray="4 4" />
            </svg>
          </div>
          {STAGES.map((stage, idx) => (
            <ScrollReveal key={stage.title} direction="up" distance={24} delay={idx * 100}>
              <div className="relative flex flex-col items-center text-center gap-4">
                <div className="relative z-10 grid place-items-center w-12 h-12 rounded-full bg-navy-raised border border-navy-line">
                  <stage.icon className="w-5 h-5 text-mpl-gold" />
                </div>
                <h3 className="lp-heading text-lg font-bold text-cloud">{stage.title}</h3>
                <p className="text-sm text-cloud/55 leading-relaxed max-w-xs">{stage.copy}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
