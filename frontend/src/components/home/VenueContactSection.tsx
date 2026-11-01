import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';
import { useClipReveal } from './scrollFx';

export const VenueContactSection: React.FC = () => {
  const imgRef = useClipReveal<HTMLImageElement>('left');

  return (
    <section className="relative bg-navy overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-[32vh] sm:h-[40vh] lg:h-auto overflow-hidden order-1 lg:order-none">
          <img
            ref={imgRef}
            src="/images/stadium_floodlit_pitch.jpg"
            alt="Lohar Wadi Stadium, Malghar village"
            className="absolute inset-0 w-full h-full object-cover object-[center_32%]"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent lg:bg-gradient-to-r lg:from-navy/10 lg:via-transparent lg:to-navy" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-5 sm:px-8 lg:px-14 py-12 sm:py-16">
          <ScrollReveal direction="up" distance={24}>
            <span className="lp-eyebrow text-mpl-gold">
              <MapPin className="w-3.5 h-3.5" />
              Venue &amp; contact
            </span>
            <h2 className="lp-heading mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-cloud leading-[0.98]">
              Lohar Wadi Stadium.
            </h2>
            <p className="mt-3 text-cloud/55 text-sm sm:text-base">Malghar village, Maharashtra</p>

            <div className="mt-8 flex flex-col gap-4">
              <a
                href="mailto:contact@malgharpl.com"
                className="group inline-flex items-center gap-3 text-cloud/80 hover:text-mpl-gold transition-colors w-fit"
              >
                <span className="grid place-items-center w-10 h-10 rounded-full bg-navy-raised border border-navy-line group-hover:border-mpl-gold/40 transition-colors">
                  <Mail className="w-4 h-4" />
                </span>
                <span className="text-sm sm:text-base font-medium">contact@malgharpl.com</span>
              </a>
              <a
                href="tel:+919823000000"
                className="group inline-flex items-center gap-3 text-cloud/80 hover:text-mpl-gold transition-colors w-fit"
              >
                <span className="grid place-items-center w-10 h-10 rounded-full bg-navy-raised border border-navy-line group-hover:border-mpl-gold/40 transition-colors">
                  <Phone className="w-4 h-4" />
                </span>
                <span className="text-sm sm:text-base font-medium">+91 98230 00000</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
