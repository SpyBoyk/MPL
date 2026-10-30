import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  repeat?: boolean; // if true, re-animates every time scrolled into view
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'left',
  delay = 0,
  duration = 700,
  distance = 50,
  className = '',
  repeat = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else if (repeat) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentElem = domRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [repeat]);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    // On mobile devices, use a smaller distance to avoid horizontal scrollbar/overflow
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const effectiveDistance = isMobile ? Math.min(distance, 24) : distance;

    switch (direction) {
      case 'left':
        return `translate3d(-${effectiveDistance}px, 0, 0)`;
      case 'right':
        return `translate3d(${effectiveDistance}px, 0, 0)`;
      case 'up':
        return `translate3d(0, ${effectiveDistance}px, 0)`;
      case 'down':
        return `translate3d(0, -${effectiveDistance}px, 0)`;
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <div
      ref={domRef}
      style={{
        transform: getTransform(),
        opacity: isVisible ? 1 : 0,
        transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity ${duration}ms ease-out ${delay}ms`,
        willChange: 'transform, opacity',
      }}
      className={className}
    >
      {children}
    </div>
  );
};
