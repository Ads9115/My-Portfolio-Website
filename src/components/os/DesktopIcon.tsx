import React, { useRef } from 'react';
import { DesktopIconConfig } from '../../types/os';
import { useOSStore } from '../../stores/useOSStore';
import { sfx } from '../../hooks/useAudioSynth';

interface DesktopIconProps {
  config: DesktopIconConfig;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ config }) => {
  const openWindow = useOSStore(state => state.openWindow);
  const storePos = useOSStore(state => state.iconPositions[config.id]);
  const updateIconPosition = useOSStore(state => state.updateIconPosition);

  const pos = storePos || { x: config.defaultPos.left, y: config.defaultPos.top };
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, iconX: 0, iconY: 0, moved: false });
  const iconRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      iconX: pos.x,
      iconY: pos.y,
      moved: false
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;

    if (!dragStartRef.current.moved && Math.hypot(dx, dy) > 4) {
      dragStartRef.current.moved = true;
    }

    if (dragStartRef.current.moved) {
      const newX = Math.max(0, Math.min(window.innerWidth - 80, dragStartRef.current.iconX + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, dragStartRef.current.iconY + dy));
      updateIconPosition(config.id, { x: newX, y: newY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    if (!dragStartRef.current.moved) {
      sfx.click();
      openWindow(config.targetWindowId);
    }
  };

  return (
    <div
      ref={iconRef}
      className="icon interactive-btn"
      data-target={config.targetWindowId}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        position: 'absolute'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      title={`Open ${config.label}`}
    >
      <div className="icon-img">{config.iconEmoji}</div>
      <span>{config.label}</span>
    </div>
  );
};
