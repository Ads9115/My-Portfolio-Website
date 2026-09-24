import React, { useEffect, useRef } from 'react';
import { useOSStore } from '../../stores/useOSStore';
import { DESKTOP_ICONS } from '../../data/portfolioData';
import { SkyEnvironment } from '../environment/SkyEnvironment';
import { UFO } from '../environment/UFO';
import { DesktopPet } from '../environment/DesktopPet';
import { DesktopIcon } from './DesktopIcon';
import { WindowFrame } from './WindowFrame';
import { StartMenu } from './StartMenu';
import { MatrixRainCanvas } from '../apps/MatrixRainCanvas';
import { ProfileApp } from '../apps/ProfileApp';
import { SkillsApp } from '../apps/SkillsApp';
import { ProjectsApp } from '../apps/ProjectsApp';
import { ProjectDetailModal } from '../apps/ProjectDetailModal';
import { ContactApp } from '../apps/ContactApp';
import { CmdApp } from '../apps/CmdApp';
import { Rasterizer3DApp } from '../apps/Rasterizer3DApp';
import { PaintApp } from '../apps/PaintApp';
import { PongApp } from '../apps/PongApp';
import { sfx } from '../../hooks/useAudioSynth';

interface PhysicsBody {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const Desktop: React.FC = () => {
  const isGravityOn = useOSStore(state => state.isGravityOn);
  const isBlackholeMode = useOSStore(state => state.isBlackholeMode);
  const toggleKonami = useOSStore(state => state.toggleKonami);
  const updateWindowPosition = useOSStore(state => state.updateWindowPosition);
  const windows = useOSStore(state => state.windows);

  const iconPositions = useOSStore(state => state.iconPositions);
  const updateIconPosition = useOSStore(state => state.updateIconPosition);

  // Physics Bodies Map
  const physicsBodiesRef = useRef<Map<string, PhysicsBody>>(new Map());
  const iconPhysicsBodiesRef = useRef<Map<string, PhysicsBody>>(new Map());

  // Konami Code Detector
  useEffect(() => {
    const konamiCode = [
      'arrowup',
      'arrowup',
      'arrowdown',
      'arrowdown',
      'arrowleft',
      'arrowright',
      'arrowleft',
      'arrowright',
      'b',
      'a'
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          toggleKonami();
          sfx.konami();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleKonami]);

  // Gravity Physics Loop for Windows and Icons
  useEffect(() => {
    if (!isGravityOn) {
      physicsBodiesRef.current.clear();
      iconPhysicsBodiesRef.current.clear();
      return;
    }

    const bodies = physicsBodiesRef.current;
    const iconBodies = iconPhysicsBodiesRef.current;
    const TASKBAR_HEIGHT = 40;
    const WINDOW_GRAVITY = 0.55;
    const WINDOW_BOUNCE = 0.45;
    const WINDOW_SIDE_BOUNCE = 0.55;
    const WINDOW_FRICTION = 0.985;

    const ICON_GRAVITY = 0.5;
    const ICON_BOUNCE = 0.38;
    const ICON_SIDE_BOUNCE = 0.5;
    const ICON_FRICTION = 0.98;

    // Initialize open windows into physics bodies
    Object.values(windows).forEach(win => {
      if (win.isOpen && !win.isMinimized && !win.isMaximized) {
        if (!bodies.has(win.id)) {
          bodies.set(win.id, {
            x: win.position.x,
            y: win.position.y,
            vx: (Math.random() - 0.5) * 4,
            vy: 0
          });
        }
      }
    });

    // Initialize icons into physics bodies
    DESKTOP_ICONS.forEach(icon => {
      if (!iconBodies.has(icon.id)) {
        const cur = iconPositions[icon.id] || { x: icon.defaultPos.left, y: icon.defaultPos.top };
        iconBodies.set(icon.id, {
          x: cur.x,
          y: cur.y,
          vx: (Math.random() - 0.5) * 3,
          vy: 0
        });
      }
    });

    let animId: number;

    const runPhysics = () => {
      const floorY = window.innerHeight - TASKBAR_HEIGHT;
      const maxX = window.innerWidth;

      // Simulate Windows
      bodies.forEach((body, winId) => {
        const win = windows[winId];
        if (!win || !win.isOpen || win.isMinimized || win.isMaximized) {
          bodies.delete(winId);
          return;
        }

        const width = typeof win.size.width === 'number' ? win.size.width : 400;
        const height = typeof win.size.height === 'number' ? win.size.height : 300;

        body.vy += WINDOW_GRAVITY;
        body.x += body.vx;
        body.y += body.vy;

        if (body.x < 0) {
          body.x = 0;
          body.vx = Math.abs(body.vx) * WINDOW_SIDE_BOUNCE;
        }

        if (body.x + width > maxX) {
          body.x = Math.max(0, maxX - width);
          body.vx = -Math.abs(body.vx) * WINDOW_SIDE_BOUNCE;
        }

        if (body.y < 0) {
          body.y = 0;
          body.vy = Math.abs(body.vy) * WINDOW_BOUNCE;
        }

        if (body.y + height > floorY) {
          body.y = floorY - height;
          body.vy = -Math.abs(body.vy) * WINDOW_BOUNCE;
          body.vx *= 0.9;
          if (Math.abs(body.vy) < 0.8) body.vy = 0;
        }

        body.vx *= WINDOW_FRICTION;
        if (Math.abs(body.vx) < 0.05) body.vx = 0;

        updateWindowPosition(winId, { x: body.x, y: body.y });
      });

      // Simulate Icons
      iconBodies.forEach((body, iconId) => {
        const width = 72;
        const height = 80;

        body.vy += ICON_GRAVITY;
        body.x += body.vx;
        body.y += body.vy;

        if (body.x < 0) {
          body.x = 0;
          body.vx = Math.abs(body.vx) * ICON_SIDE_BOUNCE;
        }

        if (body.x + width > maxX) {
          body.x = Math.max(0, maxX - width);
          body.vx = -Math.abs(body.vx) * ICON_SIDE_BOUNCE;
        }

        if (body.y < 0) {
          body.y = 0;
          body.vy = Math.abs(body.vy) * ICON_BOUNCE;
        }

        if (body.y + height > floorY) {
          body.y = floorY - height;
          body.vy = -Math.abs(body.vy) * ICON_BOUNCE;
          body.vx *= 0.92;
          if (Math.abs(body.vy) < 0.65) body.vy = 0;
        }

        body.vx *= ICON_FRICTION;
        if (Math.abs(body.vx) < 0.04) body.vx = 0;

        updateIconPosition(iconId, { x: body.x, y: body.y });
      });

      animId = requestAnimationFrame(runPhysics);
    };

    animId = requestAnimationFrame(runPhysics);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isGravityOn, windows, iconPositions, updateWindowPosition, updateIconPosition]);

  return (
    <div
      id="desktop"
      style={
        isBlackholeMode
          ? {
              transition: 'all 3s cubic-bezier(0.5,0,0.5,1)',
              transform: 'rotate(720deg) scale(0)'
            }
          : undefined
      }
    >
      <SkyEnvironment />
      <UFO />
      <DesktopPet />
      <MatrixRainCanvas />

      {/* Desktop Icons */}
      {DESKTOP_ICONS.map(iconConfig => (
        <DesktopIcon key={iconConfig.id} config={iconConfig} />
      ))}

      {/* Windows */}
      <WindowFrame id="window-status" bodyId="inject-status">
        <ProfileApp />
      </WindowFrame>

      <WindowFrame id="window-skills" bodyId="inject-skills">
        <SkillsApp />
      </WindowFrame>

      <WindowFrame id="window-projects" bodyClassName="window-body project-list" bodyId="inject-projects">
        <ProjectsApp />
      </WindowFrame>

      <WindowFrame id="window-project-details">
        <ProjectDetailModal />
      </WindowFrame>

      <WindowFrame id="window-contact">
        <ContactApp />
      </WindowFrame>

      <WindowFrame id="window-cmd" hasMaxBtn={false}>
        <CmdApp />
      </WindowFrame>

      <WindowFrame id="window-cube" hasMaxBtn={false}>
        <Rasterizer3DApp />
      </WindowFrame>

      <WindowFrame id="window-paint" hasMaxBtn={false}>
        <PaintApp />
      </WindowFrame>

      <WindowFrame id="window-pong">
        <PongApp />
      </WindowFrame>

      {/* Start Menu */}
      <StartMenu />
    </div>
  );
};
