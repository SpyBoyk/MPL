import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

const GALLERY_IMAGES = Array.from({ length: 8 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return `/images/gallery/gallery-${n}.jpg`;
});

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
    <section className="relative py-16 sm:py-24 bg-pitch overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <ScrollReveal direction="up" distance={24}>
          <div className="mb-8 sm:mb-10">
            <span className="mpl-rule-label">Gallery</span>
            <h2 className="mpl-display mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold text-chalk leading-[0.97]">
              Our Squad
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {GALLERY_IMAGES.map((src, idx) => (
            <motion.figure
              key={src}
              initial={{ opacity: 0, y: 26, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 'some' }}
              transition={{
                duration: 0.6,
                delay: (idx % 4) * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative aspect-[4/3] overflow-hidden bg-black/40"
            >
              <button
                type="button"
                onClick={() => openLightbox(src)}
                className="absolute inset-0 z-10 w-full h-full cursor-zoom-in"
                aria-label={`View frame ${String(idx + 1).padStart(2, '0')} full size`}
              />
              <img
                src={src}
                alt={`Malghar Premier League season moment ${idx + 1}`}
                className="w-full h-full object-cover transition-all duration-700 will-change-transform group-hover:scale-[1.06] group-hover:brightness-110"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pitch/75 via-transparent to-transparent transition-opacity duration-500 opacity-70 group-hover:opacity-100 pointer-events-none" />
              <span className="mpl-num absolute left-2.5 bottom-2 text-chalk/55 text-xs tracking-[0.25em] transition-colors group-hover:text-sodium pointer-events-none">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-sodium/70 transition-transform duration-500 ease-out group-hover:scale-x-100 pointer-events-none"
              />
            </motion.figure>
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
            className="w-full max-h-[80vh] object-contain bg-pitch/90"
          />
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
            className="absolute top-3 right-3 grid place-items-center w-10 h-10 bg-pitch/80 text-chalk hover:text-sodium transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </dialog>
    </section>
  );
};
