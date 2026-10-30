import React from 'react';

const ITEMS = [
  { text: 'Lohar Wadi Stadium live matches' },
  { text: 'Malghar village cricket championship' },
  { text: 'One village, six teams' },
  { text: 'Fifty-eight local players' },
  { text: 'Four seasons on record, 2023 to 2026' },
];

export const TournamentTicker: React.FC = () => {
  const track = (keyPrefix: string) => (
    <div className="flex items-center gap-12 shrink-0 pr-12">
      {ITEMS.map((item, i) => (
        <React.Fragment key={`${keyPrefix}-${i}`}>
          <span className="mpl-display text-base sm:text-lg text-chalk/70 tracking-[0.08em]">
            {item.text}
          </span>
          <span className="text-sodium/70 text-xs" aria-hidden>
            ▮
          </span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="relative z-10 w-full overflow-hidden bg-black border-y border-chalk/10 py-3.5">
      <div className="animate-marquee-left flex items-center whitespace-nowrap">
        {track('a')}
        {track('b')}
      </div>
    </div>
  );
};
