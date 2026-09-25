import React from 'react';

export const AboutApp: React.FC = () => {
  return (
    <div style={{ lineHeight: 1.5 }}>
      <p style={{ fontSize: '22px', color: 'var(--retro-lime)', fontWeight: 'bold', marginTop: 0 }}>
        {'> SYSTEM INFO'}
      </p>
      <p style={{ fontSize: '20px', margin: '8px 0' }}>
        This portfolio is a custom OS environment built entirely from scratch.
      </p>
      <hr />
      <div style={{ fontSize: '19px' }}>
        <p><strong style={{ color: 'var(--neon-cyan)' }}>ENGINE:</strong> React 19 + TypeScript + Zustand</p>
        <p><strong style={{ color: 'var(--neon-cyan)' }}>BUILD:</strong> Vite 6</p>
        <p><strong style={{ color: 'var(--neon-cyan)' }}>RENDERING:</strong> Canvas2D software rasterizer (3D cube)</p>
        <p><strong style={{ color: 'var(--neon-cyan)' }}>AUDIO:</strong> Web Audio API — all sounds procedurally generated</p>
        <p><strong style={{ color: 'var(--neon-cyan)' }}>PHYSICS:</strong> Custom gravity engine with bounce & friction</p>
        <p><strong style={{ color: 'var(--neon-cyan)' }}>WINDOW MGR:</strong> Drag, minimize, maximize, z-index focus</p>
        <p><strong style={{ color: 'var(--neon-cyan)' }}>PET:</strong> Pixel creature with pathfinding & boop interaction</p>
      </div>
      <hr />
      <p style={{ fontSize: '18px', color: 'var(--ui-text-dim)' }}>
        No UI libraries. No CSS frameworks. Just vibes and code.
      </p>
      <p style={{ fontSize: '17px', color: 'var(--neon-pink)' }}>
        Try the Konami Code: ↑↑↓↓←→←→BA
      </p>
    </div>
  );
};
