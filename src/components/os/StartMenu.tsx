import React, { useEffect, useRef } from 'react';
import { useOSStore } from '../../stores/useOSStore';
import { sfx } from '../../hooks/useAudioSynth';

export const StartMenu: React.FC = () => {
  const startMenuOpen = useOSStore(state => state.startMenuOpen);
  const toggleStartMenu = useOSStore(state => state.toggleStartMenu);
  const openWindow = useOSStore(state => state.openWindow);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        startMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('#start-btn')
      ) {
        toggleStartMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [startMenuOpen, toggleStartMenu]);

  if (!startMenuOpen) return null;

  const handleItemClick = (windowId: string) => {
    sfx.open();
    openWindow(windowId);
    toggleStartMenu(false);
  };

  const handleReboot = () => {
    window.location.reload();
  };

  return (
    <div id="start-menu" ref={menuRef}>
      <div className="start-menu-sidebar">
        <span>Windows 98</span>
      </div>
      <div className="start-menu-items">
        <div
          className="start-item interactive-btn"
          onClick={() => handleItemClick('window-status')}
        >
          👨‍💻 Player Status
        </div>
        <div
          className="start-item interactive-btn"
          onClick={() => handleItemClick('window-projects')}
        >
          🌍 Quest Log
        </div>
        <div
          className="start-item interactive-btn"
          onClick={() => handleItemClick('window-cmd')}
        >
          ⌨️ Command Prompt
        </div>
        <div
          className="start-item interactive-btn"
          onClick={() => handleItemClick('window-pong')}
        >
          🕹️ Pong.exe
        </div>
        <div className="start-divider" />
        <div className="start-item interactive-btn" onClick={handleReboot}>
          ⏻ Reboot System
        </div>
      </div>
    </div>
  );
};
