import React, { useEffect, useRef } from 'react';
import { useOSStore } from '../../stores/useOSStore';

export const MatrixRainCanvas: React.FC = () => {
  const isMatrixRunning = useOSStore(state => state.isMatrixRunning);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isMatrixRunning) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
    const fs = 16;
    let drops: number[] = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 40;
      drops = Array.from({ length: Math.floor(canvas.width / fs) }, () => 1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    let lastDraw = 0;

    const drawMatrix = (time: number) => {
      if (time - lastDraw >= 33) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0F0';
        ctx.font = `${fs}px monospace`;

        drops.forEach((d, i) => {
          const char = letters[Math.floor(Math.random() * letters.length)];
          ctx.fillText(char, i * fs, d * fs);
          if (d * fs > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        });
        lastDraw = time;
      }
      animationFrameId = requestAnimationFrame(drawMatrix);
    };

    animationFrameId = requestAnimationFrame(drawMatrix);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMatrixRunning]);

  if (!isMatrixRunning) return null;

  return (
    <canvas
      ref={canvasRef}
      id="matrix-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 7,
        display: 'block',
        opacity: 0.6,
        pointerEvents: 'none'
      }}
    />
  );
};
