import React from 'react';
import { IndianRupee } from 'lucide-react';
import { useCountUp } from './useCountUp';
import { ScrollReveal } from '../ui/ScrollReveal';
import { TiltCard } from './TiltCard';
import { useDrawPath } from './scrollFx';

export const ChampionshipPrizeSection: React.FC = () => {
  const { ref, value } = useCountUp(50000, 1600);
  const ringRef = useDrawPath<SVGCircleElement>();

  return (
    <section className="lp-dot-grid relative py-14 sm:py-20 bg-navy overflow-hidden">
      <div className="lp-glow w-[34rem] h-[34rem] bg-mpl-gold/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col items-center text-center">
        <ScrollReveal direction="down" distance={24}>
          <span className="lp-eyebrow text-mpl-gold justify-center">
            <IndianRupee className="w-3.5 h-3.5" />
            Championship prize
          </span>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={100} className="lp-perspective mt-8 relative w-56 h-56 sm:w-72 sm:h-72">
          {/* Spotlight ring draws itself in as the trophy scrolls into view */}
          <svg className="absolute -inset-2 w-[calc(100%+1rem)] h-[calc(100%+1rem)] -rotate-90 pointer-events-none" viewBox="0 0 100 100" aria-hidden>
            <circle ref={ringRef} cx="50" cy="50" r="48" fill="none" stroke="var(--color-mpl-gold)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
          <TiltCard maxTilt={6} className="lp-lift relative w-full h-full rounded-full overflow-hidden shadow-2xl shadow-black/50 ring-4 ring-mpl-gold/20">
            <img
              src="/images/mpl-championship-trophy.jpg"
              alt="Malghar Premier League 2026 championship trophy"
              className="absolute inset-0 w-full h-full object-cover object-[center_28%]"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
          </TiltCard>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={20} delay={200}>
          <div ref={ref} className="lp-num lp-gold-text mt-10 text-6xl sm:text-7xl md:text-8xl leading-none">
            ₹{value.toLocaleString('en-IN')}
          </div>
          <p className="mt-4 text-cloud/55 text-sm sm:text-base font-medium max-w-sm mx-auto">
            Winner's cup and cash — season 2026 champion.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};
