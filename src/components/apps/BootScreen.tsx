import React, { useState, useEffect } from 'react';

interface BootScreenProps {
  onBootComplete: () => void;
}

const BOOT_LINES = [
  'AdarshOS BIOS v2.0',
  'Checking hardware... OK',
  'GPU: Custom Rasterizer Pipeline',
  'RAM: 640K ought to be enough',
  'Loading synthwave drivers...',
  'Mounting pixel filesystem...',
  'Initializing window manager...',
  '',
  'BOOT COMPLETE. Welcome, User.'
];

export const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (visibleLines < BOOT_LINES.length) {
      const delay = BOOT_LINES[visibleLines] === '' ? 200 : 180 + Math.random() * 120;
      const timer = setTimeout(() => {
        setVisibleLines(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 600);
      const completeTimer = setTimeout(() => {
        onBootComplete();
      }, 1200);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [visibleLines, onBootComplete]);

  return (
    <div
      className={`boot-screen ${fadeOut ? 'boot-fade-out' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#02030a',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '40px',
        fontFamily: "'VT323', monospace",
        color: '#33ff33',
        fontSize: '22px',
        textShadow: '0 0 6px #33ff33',
        transition: 'opacity 0.5s ease',
        opacity: fadeOut ? 0 : 1,
      }}
    >
      {BOOT_LINES.slice(0, visibleLines).map((line, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: '6px',
            color: idx === BOOT_LINES.length - 1 ? 'var(--neon-cyan)' : '#33ff33'
          }}
        >
          {line ? `> ${line}` : ''}
        </div>
      ))}
      {visibleLines < BOOT_LINES.length && (
        <span style={{ animation: 'twinkle 0.5s steps(2, end) infinite' }}>▌</span>
      )}
    </div>
  );
};
