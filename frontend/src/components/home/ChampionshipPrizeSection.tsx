import React from 'react';
import { useCountUp } from './useCountUp';

export const ChampionshipPrizeSection: React.FC = () => {
  const { ref, value } = useCountUp(50000, 1600);

  return (
    <section className="relative bg-pitch overflow-hidden border-y border-chalk/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_minmax(0,46%)]">
        <div className="relative z-10 px-5 sm:px-8 lg:px-10 py-8 sm:py-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div>
            <span className="mpl-rule-label">Championship prize</span>
            <div
              ref={ref}
              className="mpl-num mt-1.5 text-4xl sm:text-5xl md:text-6xl text-chalk leading-none"
            >
              ₹{value.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="h-10 w-px bg-chalk/15 hidden sm:block" />
          <p className="text-chalk/60 text-sm sm:text-base font-medium max-w-[22rem]">
            Winner's cup and cash — season 2026 champion.
          </p>
        </div>

        <div className="relative h-52 sm:h-64 md:h-full md:min-h-[13rem]">
          <img
            src="/images/mpl-championship-trophy.jpg"
            alt="Malghar Premier League 2026 championship trophy"
            width={1400}
            height={781}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pitch via-pitch/35 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-pitch to-transparent md:hidden" />
        </div>
      </div>
    </section>
  );
};
