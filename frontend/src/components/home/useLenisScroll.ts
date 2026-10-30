import { useEffect } from 'react';
import Lenis from 'lenis';
import { ensureGsapRegistered, gsap, ScrollTrigger, prefersReducedMotion } from './gsapSetup';

/**
 * Mounts a Lenis smooth-scroll instance for as long as the calling component
 * is mounted, and tears it down on unmount — scoped to the landing page only
 * so the rest of the app keeps native scrolling. No-ops under
 * prefers-reduced-motion.
 *
 * Also wires Lenis into GSAP's ticker and keeps ScrollTrigger's measurements
 * synced to Lenis's smoothed scroll position — without this, any pinned or
 * scrubbed ScrollTrigger section (stadium parallax, prize tile pin, etc.)
 * drifts out of sync with what the user actually sees scrolling.
 */
export function useLenisScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    ensureGsapRegistered();

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);
}
