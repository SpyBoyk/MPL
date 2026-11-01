import React, { useRef } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { useCountUp } from './useCountUp';
import { prefersReducedMotion } from './gsapSetup';
import { TiltCard } from './TiltCard';
import { useClipReveal, useMagnetic } from './scrollFx';

interface HeroSectionProps {
  onSeeMatches: () => void;
}

const wordRise: Variants = {
  hidden: { opacity: 0, y: '100%' },
  show: (delay = 0) => ({
    opacity: 1,
    y: '0%',
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

/** Headline rendered as per-word masked reveals, with the final word picked out in gold. */
function RevealHeadline({ lines, startDelay = 0.1 }: { lines: string[][]; startDelay?: number }) {
  const wordsBeforeLine = lines.reduce<number[]>((acc, line, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + lines[i - 1].length);
    return acc;
  }, []);
  const totalWords = lines.reduce((sum, line) => sum + line.length, 0);

  return (
    <>
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden">
          <span className="flex flex-wrap">
            {line.map((word, wi) => {
              const wordIndex = wordsBeforeLine[li] + wi;
              const delay = startDelay + wordIndex * 0.06;
              const isLast = wordIndex === totalWords - 1;
              return (
                <motion.span
                  key={wi}
                  initial="hidden"
                  animate="show"
                  custom={delay}
                  variants={wordRise}
                  className={`inline-block pr-[0.26em] pb-[0.06em] ${isLast ? 'lp-gold-text' : ''}`}
                >
                  {word}
                </motion.span>
              );
            })}
          </span>
        </span>
      ))}
    </>
  );
}

function StatBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 shrink-0">
      <div className="lp-num text-lg sm:text-3xl md:text-4xl text-cloud leading-none whitespace-nowrap">
        {children}
      </div>
      <div className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-cloud/45 whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}

const MOTE_POSITIONS = [
  { left: '15%', top: '70%', size: '4px', delay: '0s' },
  { left: '35%', top: '55%', size: '3px', delay: '1.4s' },
  { left: '55%', top: '78%', size: '5px', delay: '2.6s' },
  { left: '75%', top: '40%', size: '3px', delay: '0.8s' },
  { left: '85%', top: '62%', size: '4px', delay: '3.4s' },
];

/** The image half of the split hero: floodlit stadium with scroll parallax and ambient light. */
function HeroImagePanel({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const reduceMotion = prefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['0%', '14%']);
  const clipRef = useClipReveal<HTMLDivElement>('right');

  return (
    <div ref={clipRef} className="relative h-[46vh] sm:h-[54vh] lg:h-auto overflow-hidden">
      <motion.img
        style={{ y: parallaxY, scale: 1.1 }}
        src="/images/stadium_floodlit_pitch.jpg"
        alt="Floodlit night match at Lohar Wadi Stadium"
        className="absolute inset-0 w-full h-full object-cover object-[center_32%]"
      />
      <div className="lp-photo-wash" aria-hidden />
      {/* Blend into the text panel on desktop, flat gradient on mobile */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent lg:bg-gradient-to-r lg:from-navy lg:via-navy/5 lg:to-transparent" />
      <div className="lp-glow w-[24rem] h-[24rem] bg-mpl-gold/15 top-1/4 right-0" aria-hidden />
      {!reduceMotion &&
        MOTE_POSITIONS.map((pos, i) => (
          <span
            key={i}
            aria-hidden
            className="lp-mote"
            style={{ left: pos.left, top: pos.top, width: pos.size, height: pos.size, animationDelay: pos.delay }}
          />
        ))}
    </div>
  );
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSeeMatches }) => {
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

  const teamsCount = overview?.teams_count ?? 6;
  const playersCount = overview?.players_count ?? 58;
  const { ref, value: playersShown } = useCountUp(playersCount);
  const sectionRef = useRef<HTMLElement>(null);
  const magneticRef = useMagnetic<HTMLButtonElement>(0.3, 70);

  return (
    <section ref={sectionRef} className="relative bg-navy overflow-hidden pt-16 sm:pt-20">
      {/* Split layout: exactly two children, so there is no ambiguity about row vs column flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative z-10 flex flex-col justify-center px-5 sm:px-8 lg:px-14 py-12 sm:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-7"
          >
            <img
              src="/images/mpl-logo-clean.png"
              alt="MPL Official Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain bg-cloud rounded-lg p-1"
            />
            <span className="lp-eyebrow text-mpl-gold">Season 2026 · 4th edition</span>
          </motion.div>

          <h1 className="lp-heading font-extrabold text-cloud leading-[0.98] text-[clamp(2.5rem,5.2vw,4.25rem)]">
            <RevealHeadline lines={[['The', 'biggest', 'stage'], ['of', 'village', 'cricket.']]} />
          </h1>

          <motion.p
            custom={0.5}
            initial="hidden"
            animate="show"
            variants={rise}
            className="mt-6 max-w-lg text-cloud/65 text-base sm:text-lg leading-relaxed"
          >
            Four seasons kept on record — fixtures, live scores and full scorecards from every
            floodlit night at Lohar Wadi Stadium.
          </motion.p>

          <motion.div
            custom={0.62}
            initial="hidden"
            animate="show"
            variants={rise}
            className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <button
              ref={magneticRef}
              onClick={onSeeMatches}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-mpl-gold hover:bg-mpl-gold-light text-navy font-bold text-sm px-8 py-4 shadow-lg shadow-mpl-gold/20 hover:shadow-xl hover:shadow-mpl-gold/35 transition-[background-color,box-shadow] cursor-pointer"
            >
              Enter match centre
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <Link
              to="/portal/teams"
              className="group inline-flex items-center justify-center gap-1.5 text-cloud border-b border-cloud/30 hover:border-mpl-gold hover:text-mpl-gold font-semibold text-sm px-1 py-3 sm:py-4 transition-colors"
            >
              Meet the six teams
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <HeroImagePanel sectionRef={sectionRef} />
      </div>

      {/* Stat strip: a full-width band below the split, its own block — never inside a row flex */}
      <div ref={ref} className="relative z-10 border-t border-navy-line bg-navy-raised">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-5 sm:py-6 lp-perspective">
          <TiltCard
            maxTilt={2}
            className="flex flex-nowrap items-start justify-between sm:justify-start gap-x-5 sm:gap-x-12 overflow-x-auto no-scrollbar"
          >
            <StatBlock label="Teams">{teamsCount}</StatBlock>
            <StatBlock label="Players">
              <span>{playersShown}</span>
            </StatBlock>
            <StatBlock label="Prize pool">₹50,000</StatBlock>
            <StatBlock label="Season">4th</StatBlock>
          </TiltCard>
        </div>
      </div>
    </section>
  );
};
