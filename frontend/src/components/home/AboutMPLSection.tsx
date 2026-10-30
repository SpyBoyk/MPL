import React from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';

const RECORD = [
  {
    mark: '2023',
    entry:
      'MPL begins. Six teams of local players, the first floodlit championship staged at Lohar Wadi Stadium.',
  },
  {
    mark: '4th',
    entry: 'Edition on the board. Every scorecard since opening night is archived in the portal.',
  },
  {
    mark: '58',
    entry: 'Players in the record book, from the inaugural squads to the current season.',
  },
];

export const AboutMPLSection: React.FC = () => {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-pitch">
      <img
        src="/images/bg3.jpg"
        alt=""
        aria-hidden
        className="backdrop-blend absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-pitch/55 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-pitch via-transparent to-pitch" />
      <div className="absolute inset-0 bg-gradient-to-r from-pitch/80 via-pitch/30 to-transparent lg:bg-gradient-to-r lg:from-pitch/85 lg:via-pitch/40 lg:to-transparent" />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl mb-12 sm:mb-16">
          <ScrollReveal direction="down" distance={34}>
            <span className="mpl-rule-label">The record</span>
            <h2 className="mpl-display mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold text-chalk leading-[0.97]">
              One village, one ground, four seasons of cricket.
            </h2>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <ScrollReveal direction="left" distance={44}>
            <figure>
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src="/images/mpl-about-community.jpg"
                  alt="Malghar Premier League award ceremony with players, village elders and the community"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pitch/60 via-transparent to-transparent" />
              </div>
              <figcaption className="mt-3 text-xs text-chalk/40 tracking-wide">
                Season award night, Lohar Wadi Stadium
              </figcaption>
            </figure>
          </ScrollReveal>

          <ol>
            {RECORD.map((row, idx) => (
              <ScrollReveal key={row.mark} direction="right" distance={34} delay={idx * 110}>
                <li className="flex gap-6 sm:gap-10 border-t border-chalk/12 py-7 sm:py-8">
                  <span className="mpl-num shrink-0 text-3xl sm:text-4xl text-sodium leading-none w-16 sm:w-20">
                    {row.mark}
                  </span>
                  <p className="text-chalk/70 text-sm sm:text-base leading-relaxed pt-0.5">{row.entry}</p>
                </li>
              </ScrollReveal>
            ))}
            <li aria-hidden className="border-t border-chalk/12" />
          </ol>
        </div>
      </div>
    </section>
  );
};
