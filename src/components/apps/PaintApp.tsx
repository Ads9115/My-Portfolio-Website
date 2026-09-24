import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sfx } from '../../hooks/useAudioSynth';

const PALETTE = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ffffff'];

export const PaintApp: React.FC = () => {
  const [currentColor, setCurrentColor] = useState('#000000');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    clearCanvas();
  }, [clearCanvas]);

  const drawPixel = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor(((clientX - rect.left) * scaleX) / 5) * 5;
    const y = Math.floor(((clientY - rect.top) * scaleY) / 5) * 5;

    ctx.fillStyle = currentColor;
    ctx.fillRect(x, y, 5, 5);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drawPixel(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    drawPixel(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handleClear = () => {
    clearCanvas();
    sfx.paintClear();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div id="color-palette" style={{ display: 'flex', gap: '5px', width: '100%', alignItems: 'center' }}>
        {PALETTE.map(color => (
          <div
            key={color}
            className={`color-swatch ${currentColor === color ? 'active' : ''}`}
            style={{ background: color }}
            data-color={color}
            onClick={() => setCurrentColor(color)}
          />
        ))}
        <button
          id="clear-canvas"
          className="win-btn"
          style={{ marginLeft: 'auto', padding: '2px 10px', fontSize: '16px' }}
          onClick={handleClear}
        >
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        id="paint-canvas"
        width={300}
        height={200}
        style={{
          background: 'white',
          border: '2px inset var(--win-gray)',
          cursor: 'crosshair',
          imageRendering: 'pixelated',
          touchAction: 'none'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
    </div>
  );
};
