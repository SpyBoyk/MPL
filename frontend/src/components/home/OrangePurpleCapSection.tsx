import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { apiClient } from '../../api/client';
import { getPlayerPhoto } from '../../utils/playerPhotos';

interface LeaderEntry {
  id: number;
  full_name: string;
  team?: { name: string; short_name: string } | null;
  runs?: number;
  wickets?: number;
}

function CapPanel({
  kind,
  entry,
  displayName,
}: {
  kind: 'orange' | 'purple';
  entry?: LeaderEntry;
  displayName: string;
}) {
  const isOrange = kind === 'orange';
  return (
    <motion.div
      initial={{ opacity: 0, x: isOrange ? -48 : 48 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 'some' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`relative px-5 py-5 sm:px-8 sm:py-6 ${
        isOrange
          ? 'bg-gradient-to-r from-orange-950/60 via-transparent to-transparent'
          : 'bg-gradient-to-l from-purple-950/60 via-transparent to-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${
            isOrange ? 'text-orange-300' : 'text-purple-300'
          }`}
        >
          {isOrange ? 'Orange cap' : 'Purple cap'}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-chalk/35">
          {isOrange ? 'Most runs' : 'Most wickets'}
        </span>
      </div>

      {entry ? (
        <div className="mt-4 flex items-center gap-4">
          <img
            src={getPlayerPhoto(entry.id, displayName)}
            alt={displayName}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shrink-0 ${
              isOrange ? 'ring-2 ring-orange-400/50' : 'ring-2 ring-purple-400/50'
            }`}
          />
          <div className="min-w-0">
            <div className="mpl-display text-lg sm:text-xl font-semibold text-chalk leading-tight truncate">
              {displayName}
            </div>
            <div className="text-xs text-chalk/45 truncate">{entry.team?.name}</div>
          </div>
          <div className="ml-auto text-right shrink-0">
            <div
              className={`mpl-num text-3xl sm:text-4xl leading-none ${
                isOrange ? 'text-orange-300' : 'text-purple-300'
              }`}
            >
              {isOrange ? entry.runs?.toLocaleString('en-IN') : entry.wickets}
            </div>
            <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-chalk/40">
              {isOrange ? 'Runs' : 'Wickets'}
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-chalk/30 text-sm">No data on record yet.</p>
      )}
    </motion.div>
  );
}

export const OrangePurpleCapSection: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['home-orange-purple-cap'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/statistics/', { params: { top: true } });
        return res.data as { top_batters?: LeaderEntry[]; top_bowlers?: LeaderEntry[] };
      } catch {
        return null;
      }
    },
    staleTime: 60_000,
  });

  const topBatter = data?.top_batters?.[0];
  const topBowler = data?.top_bowlers?.[0];

  return (
    <section className="relative bg-pitch overflow-hidden">
      <img
        src="/images/bg2.jpg"
        alt=""
        aria-hidden
        className="backdrop-blend absolute inset-0 w-full h-full object-cover object-center opacity-[0.25]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-pitch/60 via-transparent to-pitch" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 border-x border-chalk/10">
          <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-chalk/10">
            <CapPanel kind="orange" entry={topBatter} displayName="Akash Jadhav" />
            <CapPanel kind="purple" entry={topBowler} displayName="Prafull Pawer" />
          </div>

        <div className="py-4 flex justify-end border-t border-chalk/10">
          <Link
            to="/portal/statistics"
            className="inline-flex items-center gap-1.5 border-b border-chalk/25 hover:border-sodium hover:text-sodium text-chalk/80 font-semibold text-sm pb-0.5 transition-colors"
          >
            Full leaderboard
          </Link>
        </div>
      </div>
    </section>
  );
};
