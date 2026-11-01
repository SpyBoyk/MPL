import React from 'react';
import { Heart } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

// Real names supplied directly for the landing page's patrons/committee wall.
const PATRONS = ['Suraj Waje', 'Praful Pawar', 'Sagar Duduskar', 'Prasad Rahate', 'Shivam Pawar', 'Pranit Tatkare'];

export const PatronsSection: React.FC = () => {
  return (
    <section className="lp-dot-grid relative py-14 sm:py-20 bg-navy overflow-hidden">
      <div className="lp-glow w-[26rem] h-[26rem] bg-mpl-gold/10 top-0 right-1/4" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="down" distance={24}>
            <span className="lp-eyebrow text-mpl-gold justify-center">
              <Heart className="w-3.5 h-3.5" />
              Patrons &amp; supporters
            </span>
            <h2 className="lp-heading mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-cloud leading-[0.98]">
              Run by the village, for the village.
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-cloud/55 leading-relaxed">
              The organizing committee and supporters who keep every match night at Lohar Wadi
              Stadium running.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={24} delay={100}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
              {PATRONS.map((name) => (
                <span key={name} className="lp-card px-4 py-2 text-xs sm:text-sm font-semibold text-cloud/80">
                  {name}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
