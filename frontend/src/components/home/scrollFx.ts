import { useEffect, useRef } from 'react';
import { ensureGsapRegistered, gsap, prefersReducedMotion, ScrollTrigger } from './gsapSetup';

type ClipDirection = 'up' | 'down' | 'left' | 'right';

const CLIP_FROM: Record<ClipDirection, string> = {
  up: 'inset(100% 0% 0% 0%)',
  down: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
};

/**
 * Reveals the attached element through a simple geometric clip-path wipe as
 * it scrolls into view — an inset() wipe, not a freeform polygon, so it
 * can't render as a stray diagonal cut. Plays once; renders fully visible
 * immediately under prefers-reduced-motion.
 */
export function useClipReveal<T extends HTMLElement>(direction: ClipDirection = 'up') {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    ensureGsapRegistered();
    gsap.set(el, { clipPath: CLIP_FROM[direction] });
    const tween = gsap.to(el, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [direction]);

  return ref;
}

/**
 * Pulls the attached element a few pixels toward the pointer while the
 * pointer is within `radius` px of its center — the "magnetic button"
 * micro-interaction. No-ops on touch and under prefers-reduced-motion.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35, radius = 90) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const handleMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        xTo(dx * strength);
        yTo(dy * strength);
      } else {
        xTo(0);
        yTo(0);
      }
    };
    const handleLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener('pointermove', handleMove);
    el.addEventListener('pointerleave', handleLeave);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      el.removeEventListener('pointerleave', handleLeave);
    };
  }, [strength, radius]);

  return ref;
}

/**
 * Subtle 3D-perspective tilt tied to scroll position — the section rotates
 * a few degrees in and settles flat as it reaches its natural scroll
 * position, then rotates slightly the other way leaving. Scrubbed, not a
 * one-shot, so it stays in sync with the scrollbar/Lenis position.
 */
export function useScrollPerspective<T extends HTMLElement>(maxDeg = 4) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    // Skip on phones: a continuous scroll-scrubbed 3D transform costs a
    // frame-synced recalculation on every scroll tick, and most visitors
    // here are on mid-range mobile hardware — not worth the battery/jank
    // for a desktop-only flourish.
    if (!el || prefersReducedMotion() || window.innerWidth < 1024) return;

    ensureGsapRegistered();
    gsap.set(el, { transformPerspective: 1000 });
    const tween = gsap.fromTo(
      el,
      { rotateX: maxDeg, autoAlpha: 0.6 },
      {
        rotateX: 0,
        autoAlpha: 1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 55%', scrub: 0.6 },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [maxDeg]);

  return ref;
}

/** Draws an SVG stroke (e.g. an underline or ring) in as it scrolls into view. */
export function useDrawPath<T extends SVGGeometryElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    ensureGsapRegistered();
    const length = el.getTotalLength();
    gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
    const tween = gsap.to(el, {
      strokeDashoffset: 0,
      duration: 1,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return ref;
}

export { ScrollTrigger };
