import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';
import { useMagnetic } from './scrollFx';

interface FinalCtaBandProps {
  onEnter: () => void;
}

export const FinalCtaBand: React.FC<FinalCtaBandProps> = ({ onEnter }) => {
  const magneticRef = useMagnetic<HTMLButtonElement>(0.35, 80);

  return (
    <section className="relative bg-mpl-gold text-navy overflow-hidden">
      <div className="lp-glow w-[26rem] h-[26rem] bg-navy/15 -bottom-32 -left-24" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
        <ScrollReveal direction="up" distance={20}>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-navy/60">
              Free to follow
            </span>
            <h2 className="lp-heading mt-2 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[0.98]">
              Match nights start here.
            </h2>
            <p className="mt-3 max-w-md text-sm sm:text-base font-medium text-navy/75">
              Live scores, standings and every player's record — no account needed to follow the
              championship.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={20} delay={120}>
          <button
            ref={magneticRef}
            onClick={onEnter}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-navy text-cloud hover:text-mpl-gold font-bold text-sm px-9 py-5 shadow-xl shadow-navy/30 transition-colors cursor-pointer"
          >
            Enter match centre
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
};
