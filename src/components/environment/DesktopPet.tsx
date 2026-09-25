import React, { useState, useEffect, useRef } from 'react';
import { sfx } from '../../hooks/useAudioSynth';

export const DesktopPet: React.FC = () => {
  const [posX, setPosX] = useState(150);
  const [facing, setFacing] = useState<number>(1);
  const [isBooped, setIsBooped] = useState(false);
  const petRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      const maxX = Math.max(100, window.innerWidth - 120);
      const newX = Math.random() * maxX;
      setPosX(prevX => {
        setFacing(newX < prevX ? -1 : 1);
        return newX;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleBoop = (e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
    sfx.boop();
    setIsBooped(false);
    requestAnimationFrame(() => {
      setIsBooped(true);
    });
    setTimeout(() => {
      setIsBooped(false);
    }, 240);
  };

  return (
    <div
      ref={petRef}
      id="desktop-pet"
      className={`interactive-btn ${isBooped ? 'pet-booped' : ''}`}
      style={{
        left: `${posX}px`,
        '--pet-face': facing
      } as React.CSSProperties}
      onClick={handleBoop}
      title="Boop me!"
    >
      {/* Invisible hitbox to cover the box-shadow body */}
      <div style={{ position: 'absolute', top: -10, left: -10, width: 60, height: 60 }} />
    </div>
  );
};
