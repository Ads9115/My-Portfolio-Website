import React, { useEffect, useRef } from 'react';

export const Rasterizer3DApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const verts = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1]
    ];

    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7]
    ];

    let angle = 0;
    let animId: number;

    const render = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      angle += 0.02;
      const s = Math.sin(angle);
      const c = Math.cos(angle);

      const p = verts.map(v => {
        const x = v[0] * c - v[2] * s;
        const z = v[0] * s + v[2] * c;
        const y = v[1] * c - z * s;
        return {
          x: x * 60 + canvas.width / 2,
          y: y * 60 + canvas.height / 2
        };
      });

      // Draw wireframe edges
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      edges.forEach(e => {
        ctx.moveTo(p[e[0]].x, p[e[0]].y);
        ctx.lineTo(p[e[1]].x, p[e[1]].y);
      });
      ctx.stroke();

      // Draw vertices
      ctx.fillStyle = '#ff00ff';
      p.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      style={{
        background: '#111',
        padding: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <canvas
        ref={canvasRef}
        id="render-canvas"
        width={280}
        height={280}
        style={{ border: '2px solid #333', background: '#000' }}
      />
      <span style={{ color: 'var(--neon-cyan)', marginTop: '5px', fontSize: '16px' }}>
        Software Rasterization Loop Active
      </span>
    </div>
  );
};
