import React, { useState, useEffect } from 'react';
import { useOSStore } from '../../stores/useOSStore';
import { sfx } from '../../hooks/useAudioSynth';

export const Taskbar: React.FC = () => {
  const startMenuOpen = useOSStore(state => state.startMenuOpen);
  const toggleStartMenu = useOSStore(state => state.toggleStartMenu);
  const windows = useOSStore(state => state.windows);
  const activeWindowId = useOSStore(state => state.activeWindowId);
  const focusWindow = useOSStore(state => state.focusWindow);
  const minimizeWindow = useOSStore(state => state.minimizeWindow);

  // Clock
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      setTimeStr(`${h % 12 || 12}:${m < 10 ? '0' + m : m} ${h >= 12 ? 'PM' : 'AM'}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sfx.click();
    toggleStartMenu();
  };

  const handleTaskbarWindowClick = (id: string) => {
    const win = windows[id];
    if (!win) return;

    if (activeWindowId === id && !win.isMinimized) {
      sfx.minimize();
      minimizeWindow(id);
    } else {
      sfx.open();
      focusWindow(id);
    }
  };

  const openWindows = Object.values(windows).filter(w => w.isOpen);

  return (
    <div id="taskbar">
      <button
        id="start-btn"
        className={`interactive-btn ${startMenuOpen ? 'active' : ''}`}
        onClick={handleStartClick}
      >
        <span style={{ color: '#ff00ff', marginRight: '5px' }}>⊞</span> Start
      </button>

      <div className="taskbar-divider" />

      <div id="taskbar-windows">
        {openWindows.map(w => {
          const isActive = activeWindowId === w.id && !w.isMinimized;
          return (
            <button
              key={w.id}
              className={`taskbar-window-btn interactive-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleTaskbarWindowClick(w.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '2px 8px',
                margin: '0 3px',
                height: '28px',
                fontSize: '18px',
                color: 'var(--ui-text)',
                background: isActive ? 'var(--ui-panel-soft)' : 'var(--win-gray)',
                border: '2px outset var(--win-light)',
                cursor: 'pointer'
              }}
            >
              <span>{w.icon || '📄'}</span>
              <span>{w.title.length > 15 ? w.title.slice(0, 14) + '…' : w.title}</span>
            </button>
          );
        })}
      </div>

      <div id="clock">{timeStr}</div>
    </div>
  );
};
