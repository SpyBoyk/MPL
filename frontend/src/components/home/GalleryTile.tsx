import React from 'react';
import { useClipReveal } from './scrollFx';

interface GalleryTileProps {
  src: string;
  index: number;
  aspect: string;
  onOpen: (src: string) => void;
}

const DIRECTIONS = ['up', 'left', 'right'] as const;

/** One masonry tile: a GSAP ScrollTrigger clip-path wipe reveal on the image itself. */
export const GalleryTile: React.FC<GalleryTileProps> = ({ src, index, aspect, onOpen }) => {
  const imgRef = useClipReveal<HTMLImageElement>(DIRECTIONS[index % DIRECTIONS.length]);

  return (
    <figure
      className="group relative mb-3 sm:mb-4 break-inside-avoid overflow-hidden rounded-xl bg-black/40 shadow-lg shadow-black/30"
      style={{ aspectRatio: aspect }}
    >
      <button
        type="button"
        onClick={() => onOpen(src)}
        className="absolute inset-0 z-10 w-full h-full cursor-zoom-in"
        aria-label={`View frame ${String(index + 1).padStart(2, '0')} full size`}
      />
      <img
        ref={imgRef}
        src={src}
        alt={`Malghar Premier League season moment ${index + 1}`}
        className="w-full h-full object-cover transition-all duration-700 will-change-transform group-hover:scale-[1.06]"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-transparent to-transparent transition-opacity duration-500 opacity-70 group-hover:opacity-90 pointer-events-none" />
      <span className="lp-num absolute left-2.5 bottom-2 text-cloud/60 text-xs tracking-[0.2em] transition-colors group-hover:text-mpl-gold pointer-events-none">
        {String(index + 1).padStart(2, '0')}
      </span>
    </figure>
  );
};
