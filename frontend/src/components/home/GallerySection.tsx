import React, { useEffect, useRef } from 'react';
import { Sparkles, X } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';
import { GalleryTile } from './GalleryTile';

const GALLERY_IMAGES = Array.from({ length: 11 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return `/images/gallery/gallery-${n}.jpg`;
});

// Mixed aspect ratios per tile create the bento/masonry rhythm in the
// CSS-columns layout below — deterministic, not random, so SSR/CSR match.
const ASPECTS = ['4/3', '1/1', '3/4', '4/3', '1/1', '4/3', '3/4', '1/1', '4/3', '3/4', '1/1'];

export const GallerySection: React.FC = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeImage, setActiveImage] = React.useState(GALLERY_IMAGES[0]);

  const openLightbox = (src: string) => {
    setActiveImage(src);
    dialogRef.current?.showModal();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setActiveImage(GALLERY_IMAGES[0]);
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, []);

  return (
    <section className="lp-dot-grid relative py-14 sm:py-20 bg-navy overflow-hidden">
      <div className="lp-glow w-[28rem] h-[28rem] bg-mpl-gold/10 top-1/4 -left-20" aria-hidden />
      <span className="lp-section-mark absolute -top-6 right-4 sm:right-8 text-[8rem] sm:text-[11rem]" aria-hidden>
        04
      </span>
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <ScrollReveal direction="up" distance={24}>
          <div className="mb-8 sm:mb-10">
            <span className="lp-eyebrow text-mpl-gold">
              <Sparkles className="w-3.5 h-3.5" />
              Gallery
            </span>
            <h2 className="lp-heading mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold text-cloud leading-[0.98]">
              Season moments.
            </h2>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-cloud/55 leading-relaxed">
              Award nights, floodlit finishes and the village turning out for every match.
            </p>
          </div>
        </ScrollReveal>

        {/* Masonry via CSS columns — each tile's own aspect ratio creates the bento rhythm */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4">
          {GALLERY_IMAGES.map((src, idx) => (
            <GalleryTile key={src} src={src} index={idx} aspect={ASPECTS[idx]} onOpen={openLightbox} />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="fixed inset-0 m-auto w-[min(92vw,64rem)] bg-transparent p-0 backdrop:backdrop-blur-md backdrop:bg-black/70 open:animate-none"
      >
        <div className="relative">
          <img
            src={activeImage}
            alt="Malghar Premier League season moment, full size"
            className="w-full max-h-[80vh] object-contain rounded-xl bg-navy/90"
          />
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
            className="absolute top-3 right-3 grid place-items-center w-11 h-11 rounded-full bg-navy/80 text-cloud hover:text-mpl-gold transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </dialog>
    </section>
  );
};
