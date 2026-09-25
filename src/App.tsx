import React, { useEffect, useState } from 'react';
import { useOSStore } from './stores/useOSStore';
import { CRTOverlay } from './components/os/CRTOverlay';
import { Desktop } from './components/os/Desktop';
import { Taskbar } from './components/os/Taskbar';
import { sfx } from './hooks/useAudioSynth';
import { BootScreen } from './components/apps/BootScreen';

export const App: React.FC = () => {
  const [booting, setBooting] = useState(true);
  const isKonamiMode = useOSStore(state => state.isKonamiMode);
  const isShakeMode = useOSStore(state => state.isShakeMode);

  useEffect(() => {
    if (isKonamiMode) {
      document.body.classList.add('konami-mode');
    } else {
      document.body.classList.remove('konami-mode');
    }
  }, [isKonamiMode]);

  useEffect(() => {
    if (isShakeMode) {
      document.body.classList.add('shake-mode');
    } else {
      document.body.classList.remove('shake-mode');
    }
  }, [isShakeMode]);

  // Global click audio feedback
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, a, .interactive-btn, .icon, .color-swatch')) {
        sfx.click();
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  return (
    <>
      {booting && <BootScreen onBootComplete={() => setBooting(false)} />}
      <CRTOverlay />
      <Desktop />
      <Taskbar />
    </>
  );
};

export default App;
