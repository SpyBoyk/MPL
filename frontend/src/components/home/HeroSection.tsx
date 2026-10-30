import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { useCountUp } from './useCountUp';

interface HeroSectionProps {
  onSeeMatches: () => void;
}

const rise: Variants = {
  hidden: { opacity: 0, y: 34 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function ScoreCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-4 sm:px-7 sm:py-5 bg-[rgba(6,11,19,0.72)] backdrop-blur-sm">
      <div className="mpl-num text-3xl sm:text-4xl md:text-[2.6rem] text-chalk leading-none">{children}</div>
      <div className="mt-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-chalk/45">
        {label}
      </div>
    </div>
  );
}

/** Static floodlit backdrop — no motion. */
function HeroBackdrop() {
  return (
    <div className="absolute inset-0">
      <img
        src="/images/bg1.jpg"
        alt=""
        aria-hidden
        className="backdrop-blend absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-pitch via-pitch/40 to-pitch/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-pitch/75 via-pitch/20 to-transparent" />
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

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen w-full flex items-center overflow-hidden bg-pitch">
      <HeroBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-16 pb-24 sm:py-24 w-full">
        <motion.div initial="hidden" animate="show" className="max-w-4xl">
          {/* Scoreboard header line */}
          <motion.div custom={0} variants={rise} className="flex items-center gap-4 mb-7">
            <img
              src="/images/mpl-logo-clean.png"
              alt="MPL Official Logo"
              className="w-11 h-11 sm:w-12 sm:h-12 object-contain bg-chalk/95 rounded-md p-1"
            />
            <div className="h-8 w-px bg-chalk/20" />
            <div className="flex flex-col gap-0.5">
              <span className="mpl-display text-lg sm:text-xl text-chalk leading-none">
                Malghar Premier League
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] text-sodium">
                Fourth edition — 2026
              </span>
            </div>
          </motion.div>

          {/* Billboard masthead */}
          <motion.h1
            custom={0.12}
            variants={rise}
            className="mpl-display font-semibold text-chalk leading-[0.94] text-[clamp(2.5rem,6.5vw,4.75rem)]"
          >
            The biggest stage
            <br />
            of village cricket<span className="text-sodium">.</span>
          </motion.h1>

          <motion.p
            custom={0.26}
            variants={rise}
            className="mt-6 max-w-xl text-chalk/65 text-base sm:text-lg leading-relaxed font-normal"
          >
            Four seasons kept on record — fixtures, live scores and full scorecards from every
            floodlit night at Lohar Wadi Stadium.
          </motion.p>

          <motion.div custom={0.4} variants={rise} className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onSeeMatches}
              className="inline-flex items-center justify-center gap-2 bg-sodium hover:bg-sodium-deep text-pitch font-bold text-sm px-8 py-4 transition-colors cursor-pointer"
            >
              Enter match centre
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/portal/teams"
              className="inline-flex items-center justify-center gap-1.5 text-chalk border-b border-chalk/30 hover:border-sodium hover:text-sodium font-semibold text-sm px-1 py-3 sm:py-4 transition-colors"
            >
              Meet the six teams
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Scoreboard strip — the one counting moment on the page */}
          <motion.div
            custom={0.56}
            variants={rise}
            ref={ref}
            className="mpl-score-strip mt-14 grid grid-cols-2 sm:grid-cols-4 gap-px bg-chalk/[0.14]"
          >
            <ScoreCell label="Teams">{teamsCount}</ScoreCell>
            <ScoreCell label="Players">
              <span ref={ref}>{playersShown}</span>
            </ScoreCell>
            <ScoreCell label="Prize">₹50,000</ScoreCell>
            <ScoreCell label="Season">4th</ScoreCell>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-pitch to-transparent pointer-events-none" />

      <div className="hidden sm:flex absolute bottom-7 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-chalk/40">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-chalk/40 to-transparent" />
      </div>
    </section>
  );
};

