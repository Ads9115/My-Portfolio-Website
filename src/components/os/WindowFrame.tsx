import React, { useRef } from 'react';
import { useOSStore } from '../../stores/useOSStore';
import { sfx } from '../../hooks/useAudioSynth';

interface WindowFrameProps {
  id: string;
  children: React.ReactNode;
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
  bodyId?: string;
  hasMaxBtn?: boolean;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  id,
  children,
  bodyClassName = 'window-body',
  bodyStyle,
  bodyId,
  hasMaxBtn = true
}) => {
  const windowState = useOSStore(state => state.windows[id]);
  const focusWindow = useOSStore(state => state.focusWindow);
  const closeWindow = useOSStore(state => state.closeWindow);
  const minimizeWindow = useOSStore(state => state.minimizeWindow);
  const maximizeWindow = useOSStore(state => state.maximizeWindow);
  const updateWindowPosition = useOSStore(state => state.updateWindowPosition);

  const dragStartRef = useRef<{ mouseX: number; mouseY: number; initX: number; initY: number } | null>(null);

  if (!windowState || !windowState.isOpen || windowState.isMinimized) {
    return null;
  }

  const handlePointerDownTitle = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (windowState.isMaximized) return;

    focusWindow(id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initX: windowState.position.x,
      initY: windowState.position.y
    };
  };

  const handlePointerMoveTitle = (e: React.PointerEvent) => {
    if (!dragStartRef.current || windowState.isMaximized) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;

    const newX = Math.max(-100, Math.min(window.innerWidth - 80, dragStartRef.current.initX + dx));
    const newY = Math.max(0, Math.min(window.innerHeight - 80, dragStartRef.current.initY + dy));

    updateWindowPosition(id, { x: newX, y: newY });
  };

  const handlePointerUpTitle = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    dragStartRef.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeWindow(id);
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    sfx.minimize();
    minimizeWindow(id);
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    maximizeWindow(id);
  };

  const style: React.CSSProperties = windowState.isMaximized
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 40px)',
        zIndex: windowState.zIndex,
        display: 'flex'
      }
    : {
        position: 'absolute',
        top: `${windowState.position.y}px`,
        left: `${windowState.position.x}px`,
        width: typeof windowState.size.width === 'number' ? `${windowState.size.width}px` : windowState.size.width,
        height: typeof windowState.size.height === 'number' ? `${windowState.size.height}px` : windowState.size.height,
        zIndex: windowState.zIndex,
        display: 'flex'
      };

  return (
    <div
      id={id}
      className={`window ${windowState.isMaximized ? 'maximized' : ''}`}
      style={style}
      onMouseDown={() => focusWindow(id)}
    >
      <div
        className="title-bar"
        onPointerDown={handlePointerDownTitle}
        onPointerMove={handlePointerMoveTitle}
        onPointerUp={handlePointerUpTitle}
      >
        <div className="title-bar-text">{windowState.title}</div>
        <div className="title-bar-controls">
          <button className="min-btn" onClick={handleMinimize} title="Minimize">
            _
          </button>
          {hasMaxBtn && (
            <button className="max-btn" onClick={handleMaximize} title="Maximize">
              □
            </button>
          )}
          <button className="close-btn" onClick={handleClose} title="Close" />
        </div>
      </div>
      <div id={bodyId} className={bodyClassName} style={bodyStyle}>
        {children}
      </div>
    </div>
  );
};
