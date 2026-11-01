import React from 'react';
import { Circle } from 'lucide-react';

const ITEMS = [
  { text: 'Lohar Wadi Stadium live matches' },
  { text: 'Malghar village cricket championship' },
  { text: 'One village, six teams' },
  { text: 'Fifty-eight local players' },
  { text: 'Four seasons on record, 2023 to 2026' },
];

export const TournamentTicker: React.FC = () => {
  const track = (keyPrefix: string) => (
    <div className="flex items-center gap-10 shrink-0 pr-10">
      {ITEMS.map((item, i) => (
        <React.Fragment key={`${keyPrefix}-${i}`}>
          <span className="text-sm sm:text-base font-semibold text-cloud/75 tracking-wide">
            {item.text}
          </span>
          <Circle aria-hidden className="w-1.5 h-1.5 fill-mpl-gold text-mpl-gold shrink-0" />
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="lp-edge-fade relative z-10 w-full overflow-hidden bg-navy-raised border-y border-navy-line py-3">
      <div className="animate-marquee-left flex items-center whitespace-nowrap">
        {track('a')}
        {track('b')}
      </div>
    </div>
  );
};
