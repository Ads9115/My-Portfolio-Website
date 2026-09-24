import React, { useEffect, useRef } from 'react';

export const UFO: React.FC = () => {
  const ufoRef = useRef<HTMLDivElement>(null);
  const ufoMinTop = 36;
  const ufoMaxTop = 220;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      // 30% chance every 10 seconds to fly across screen
      if (Math.random() > 0.7 && ufoRef.current) {
        const el = ufoRef.current;
        el.style.transition = 'none';
        el.style.left = '-140px';
        const startTop = Math.random() * (ufoMaxTop - ufoMinTop) + ufoMinTop;
        el.style.top = `${startTop}px`;

        setTimeout(() => {
          if (!ufoRef.current) return;
          const endTop = Math.random() * (ufoMaxTop - ufoMinTop) + ufoMinTop;
          el.style.transition = 'left 8s linear, top 4s ease-in-out';
          el.style.left = `${window.innerWidth + 140}px`;
          el.style.top = `${endTop}px`;
        }, 50);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return <div ref={ufoRef} id="ufo" aria-hidden="true" />;
};
