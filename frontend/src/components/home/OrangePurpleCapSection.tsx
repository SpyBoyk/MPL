import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Flame, Zap } from 'lucide-react';
import { getPlayerPhoto } from '../../utils/playerPhotos';
import { ScrollReveal } from '../ui/ScrollReveal';
import { TiltCard } from './TiltCard';

interface LeaderEntry {
  id: number;
  full_name: string;
  team?: { name: string; short_name: string } | null;
  runs?: number;
  wickets?: number;
}

// Season leaders pinned for the landing page.
const ORANGE_CAP_LEADER: LeaderEntry = { id: 901, full_name: 'Pritesh Mahadik', runs: 400 };
const PURPLE_CAP_LEADER: LeaderEntry = { id: 26, full_name: 'Akash Jadhav', wickets: 10 };

function Leader({ kind, entry }: { kind: 'orange' | 'purple'; entry?: LeaderEntry }) {
  const isOrange = kind === 'orange';
  const displayName = entry?.full_name ?? '';
  const accent = isOrange ? '#f59e0b' : '#a855f7';

  return (
    <div className="flex flex-col items-center text-center gap-4 px-6 py-8 sm:py-10">
      <div className="flex items-center gap-2">
        {isOrange ? <Flame className="w-4 h-4" style={{ color: accent }} /> : <Zap className="w-4 h-4" style={{ color: accent }} />}
        <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: accent }}>
          {isOrange ? 'Orange cap' : 'Purple cap'}
        </span>
      </div>

      {entry ? (
        <>
          <img
            src={getPlayerPhoto(entry.id, displayName)}
            alt={displayName}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4"
            style={{ ['--tw-ring-color' as string]: `${accent}30` }}
          />
          <div>
            <div className="lp-heading text-xl sm:text-2xl font-bold text-cloud leading-tight">{displayName}</div>
            <div className="text-xs text-cloud/45 mt-1">{entry.team?.name}</div>
          </div>
          <div>
            <div className="lp-num text-4xl sm:text-5xl leading-none" style={{ color: accent }}>
              {isOrange ? entry.runs?.toLocaleString('en-IN') : entry.wickets}
            </div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-cloud/40">
              {isOrange ? 'Runs' : 'Wickets'}
            </div>
          </div>
        </>
      ) : (
        <p className="text-cloud/30 text-sm py-6">No data on record yet.</p>
      )}
    </div>
  );
}

export const OrangePurpleCapSection: React.FC = () => {
  const topBatter = ORANGE_CAP_LEADER;
  const topBowler = PURPLE_CAP_LEADER;

  return (
    <section className="lp-dot-grid relative py-14 sm:py-20 bg-navy overflow-hidden">
      <span className="lp-section-mark absolute -top-6 right-4 sm:right-8 text-[8rem] sm:text-[11rem]" aria-hidden>
        03
      </span>
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <ScrollReveal direction="down" distance={24}>
          <div className="text-center mb-8 sm:mb-10">
            <span className="lp-eyebrow text-mpl-gold justify-center">
              <Flame className="w-3.5 h-3.5" />
              Season leaders
            </span>
            <h2 className="lp-heading mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold text-cloud leading-[0.98]">
              The caps to beat.
            </h2>
          </div>
        </ScrollReveal>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lp-perspective max-w-4xl mx-auto"
        >
          <TiltCard maxTilt={3} className="lp-card lp-lift relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] overflow-hidden">
            <Leader kind="orange" entry={topBatter} />

            {/* Divider: horizontal rule + VS badge on mobile, vertical rule on desktop */}
            <div className="relative flex md:flex-col items-center justify-center px-6 py-4 md:px-0 md:py-6 min-h-[2.75rem]">
              <div className="h-px w-full md:h-full md:w-px bg-navy-line" />
              <span className="lp-heading absolute inset-0 m-auto grid place-items-center w-11 h-11 rounded-full bg-navy border border-navy-line text-cloud/60 text-xs font-extrabold">
                VS
              </span>
            </div>

            <Leader kind="purple" entry={topBowler} />
          </TiltCard>
        </motion.div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/portal/statistics"
            className="group inline-flex items-center gap-1.5 border-b border-cloud/25 hover:border-mpl-gold hover:text-mpl-gold text-cloud/80 font-semibold text-sm py-2.5 transition-colors"
          >
            Full leaderboard
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
