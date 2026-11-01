import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionStyle } from 'framer-motion';
import { prefersReducedMotion } from './gsapSetup';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees. Keep modest (6-12) so it reads as premium, not gimmicky. */
  maxTilt?: number;
  glare?: boolean;
  style?: MotionStyle;
}

/**
 * Wraps content in a real 3D pointer-tracking tilt + specular glare — the
 * "premium product shot" interaction. No-ops to a flat card on touch devices
 * and under prefers-reduced-motion, where it just renders children normally.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 8,
  glare = true,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = prefersReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), { stiffness: 260, damping: 22 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), { stiffness: 260, damping: 22 });
  const glareBackground = useTransform([px, py], (latest) => {
    const [gx, gy] = latest as number[];
    return `radial-gradient(circle at ${gx * 100}% ${gy * 100}%, rgba(255,255,255,0.22), transparent 58%)`;
  });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType === 'touch') return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000, ...style }}
      className={`relative [transform-style:preserve-3d] will-change-transform ${className}`}
    >
      {children}
      {glare && !reduceMotion && (
        <motion.span
          aria-hidden
          style={{ background: glareBackground }}
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      )}
    </motion.div>
  );
};
