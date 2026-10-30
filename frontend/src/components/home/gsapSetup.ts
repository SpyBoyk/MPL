import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

let registered = false;

/**
 * Registers the ScrollTrigger plugin exactly once. Callers must still check
 * `prefersReducedMotion()` themselves before creating pinned/scrubbed
 * ScrollTrigger instances and fall back to their existing static/CSS reveal.
 */
export function ensureGsapRegistered() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };
