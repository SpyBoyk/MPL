import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

interface FinalCtaBandProps {
  onEnter: () => void;
}

export const FinalCtaBand: React.FC<FinalCtaBandProps> = ({ onEnter }) => {
  return (
    <section className="relative bg-sodium text-pitch">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
        <ScrollReveal direction="up" distance={20}>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-pitch/60">
              Free to follow
            </span>
            <h2 className="mpl-display mt-2 text-4xl sm:text-5xl md:text-6xl font-semibold leading-[0.97]">
              Match nights start here.
            </h2>
            <p className="mt-3 max-w-md text-sm sm:text-base font-medium text-pitch/75">
              Live scores, standings and every player's record — no account needed to follow the
              championship.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={20} delay={120}>
          <button
            onClick={onEnter}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-pitch text-chalk hover:text-sodium font-bold text-sm px-9 py-5 transition-colors cursor-pointer"
          >
            Enter match centre
            <ArrowRight className="w-4 h-4" />
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
};
