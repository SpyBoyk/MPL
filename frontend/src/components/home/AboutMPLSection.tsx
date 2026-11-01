import React from 'react';
import { CalendarDays } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';
import { TiltCard } from './TiltCard';
import { useClipReveal, useDrawPath } from './scrollFx';

const TIMELINE = [
  { year: '2023', entry: 'Opening night. Six teams, one ground, the first floodlit championship.' },
  { year: '2024', entry: 'Second season. The scorecards start piling up in the archive.' },
  { year: '2025', entry: 'Third edition. Fifty-eight players across the six squads.' },
  { year: '2026', entry: 'Fourth season, live now — four years of village cricket on record.' },
];

export const AboutMPLSection: React.FC = () => {
  const lineRef = useDrawPath<SVGLineElement>();
  const bannerRef = useClipReveal<HTMLImageElement>('up');

  return (
    <section className="lp-dot-grid relative py-14 sm:py-20 bg-navy overflow-hidden">
      <div className="lp-glow w-[28rem] h-[28rem] bg-mpl-gold/10 top-0 left-1/3" aria-hidden />
      <span className="lp-section-mark absolute -top-4 right-4 sm:right-8 text-[8rem] sm:text-[11rem]" aria-hidden>
        05
      </span>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl mb-10 sm:mb-12">
          <ScrollReveal direction="down" distance={30}>
            <span className="lp-eyebrow text-mpl-gold">
              <CalendarDays className="w-3.5 h-3.5" />
              The record
            </span>
            <h2 className="lp-heading mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold text-cloud leading-[0.98]">
              One village, one ground, four seasons of cricket.
            </h2>
          </ScrollReveal>
        </div>

        {/* Horizontal timeline — a connecting rail with four season stops */}
        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-8">
          <div aria-hidden className="hidden lg:block absolute top-[0.65rem] left-[12.5%] right-[12.5%] h-px overflow-visible">
            <svg className="block w-full h-full overflow-visible" viewBox="0 0 100 1" preserveAspectRatio="none">
              <line ref={lineRef} x1="0" y1="0.5" x2="100" y2="0.5" stroke="var(--color-navy-line)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          {TIMELINE.map((stop, idx) => (
            <ScrollReveal key={stop.year} direction="up" distance={24} delay={idx * 100}>
              <div className="relative flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="relative z-10 w-3 h-3 rounded-full bg-mpl-gold shadow-[0_0_0_4px_var(--color-navy)]" />
                  <span className="lp-num text-sm text-mpl-gold tracking-[0.1em]">{stop.year}</span>
                </div>
                <p className="text-cloud/65 text-sm leading-relaxed">{stop.entry}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Cinematic banner photo beneath the timeline */}
        <ScrollReveal direction="up" distance={30} delay={120} className="lp-perspective mt-10 sm:mt-12">
          <TiltCard maxTilt={3} className="lp-lift relative overflow-hidden rounded-2xl aspect-[21/9] shadow-2xl shadow-black/40">
            <img
              ref={bannerRef}
              src="/images/mpl-about-community.jpg"
              alt="Malghar Premier League award ceremony with players, village elders and the community"
              className="w-full h-full object-cover object-top"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
            <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cloud/70">
                Season award night, Lohar Wadi Stadium
              </span>
            </div>
          </TiltCard>
        </ScrollReveal>
      </div>
    </section>
  );
};
