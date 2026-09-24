import { create } from 'zustand';
import { WindowState } from '../types/os';
import { PORTFOLIO_DATA, DESKTOP_ICONS } from '../data/portfolioData';

const INITIAL_ICON_POSITIONS = DESKTOP_ICONS.reduce((acc, icon) => {
  acc[icon.id] = { x: icon.defaultPos.left, y: icon.defaultPos.top };
  return acc;
}, {} as Record<string, { x: number; y: number }>);

const INITIAL_WINDOWS: Record<string, WindowState> = {
  'window-status': {
    id: 'window-status',
    title: 'Adarsh Sen - Profile',
    icon: '👨‍💻',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    position: { x: 220, y: 50 },
    size: { width: 480, height: 'auto' },
    zIndex: 10
  },
  'window-skills': {
    id: 'window-skills',
    title: 'SKILLS.DATABANK',
    icon: '⚙️',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 700, y: 80 },
    size: { width: 350, height: 'auto' },
    zIndex: 11
  },
  'window-projects': {
    id: 'window-projects',
    title: 'QUEST.LOG (PROJECTS)',
    icon: '📁',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 250, y: 150 },
    size: { width: 450, height: 'auto' },
    zIndex: 12
  },
  'window-project-details': {
    id: 'window-project-details',
    title: 'Project View',
    icon: '📄',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 350, y: 180 },
    size: { width: 500, height: 'auto' },
    zIndex: 50
  },
  'window-contact': {
    id: 'window-contact',
    title: 'COMM.LINK',
    icon: '✉️',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 600, y: 250 },
    size: { width: 350, height: 'auto' },
    zIndex: 13
  },
  'window-cmd': {
    id: 'window-cmd',
    title: 'C:\\WINDOWS\\system32\\cmd.exe',
    icon: '⌨️',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 400, y: 100 },
    size: { width: 450, height: 320 },
    zIndex: 16
  },
  'window-cube': {
    id: 'window-cube',
    title: '3D_RENDERER.EXE',
    icon: '🧊',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 550, y: 150 },
    size: { width: 320, height: 'auto' },
    zIndex: 17
  },
  'window-paint': {
    id: 'window-paint',
    title: 'PAINT.EXE',
    icon: '🎨',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 350, y: 180 },
    size: { width: 340, height: 'auto' },
    zIndex: 18
  },
  'window-pong': {
    id: 'window-pong',
    title: 'PONG.EXE',
    icon: '🕹️',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 420, y: 80 },
    size: { width: 620, height: 430 },
    zIndex: 19
  }
};

interface OSState {
  windows: Record<string, WindowState>;
  activeWindowId: string | null;
  highestZIndex: number;
  selectedProjectIndex: number | null;
  startMenuOpen: boolean;

  // System special modes
  isGravityOn: boolean;
  isMatrixRunning: boolean;
  isShakeMode: boolean;
  isKonamiMode: boolean;
  isBlackholeMode: boolean;

  iconPositions: Record<string, { x: number; y: number }>;
  updateIconPosition: (id: string, pos: { x: number; y: number }) => void;
  restoreIconPositions: () => void;

  // Actions
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, pos: { x: number; y: number }) => void;
  openProjectDetails: (index: number) => void;
  closeProjectDetails: () => void;
  toggleStartMenu: (open?: boolean) => void;
  
  toggleGravity: (on?: boolean) => void;
  toggleMatrix: (on?: boolean) => void;
  triggerShake: () => void;
  toggleKonami: () => void;
  triggerBlackhole: () => void;
}

export const useOSStore = create<OSState>((set, get) => ({
  windows: INITIAL_WINDOWS,
  iconPositions: INITIAL_ICON_POSITIONS,
  activeWindowId: 'window-status',
  highestZIndex: 25,
  selectedProjectIndex: null,
  startMenuOpen: false,

  isGravityOn: false,
  isMatrixRunning: false,
  isShakeMode: false,
  isKonamiMode: false,
  isBlackholeMode: false,

  openWindow: (id: string) => {
    const { windows, highestZIndex } = get();
    const win = windows[id];
    if (!win) return;
    const newZ = highestZIndex + 1;
    set({
      windows: {
        ...windows,
        [id]: {
          ...win,
          isOpen: true,
          isMinimized: false,
          zIndex: newZ
        }
      },
      activeWindowId: id,
      highestZIndex: newZ,
      startMenuOpen: false
    });
  },

  closeWindow: (id: string) => {
    const { windows, activeWindowId } = get();
    const win = windows[id];
    if (!win) return;
    set({
      windows: {
        ...windows,
        [id]: {
          ...win,
          isOpen: false,
          isMinimized: false
        }
      },
      activeWindowId: activeWindowId === id ? null : activeWindowId
    });
  },

  minimizeWindow: (id: string) => {
    const { windows, activeWindowId } = get();
    const win = windows[id];
    if (!win) return;
    set({
      windows: {
        ...windows,
        [id]: {
          ...win,
          isMinimized: true
        }
      },
      activeWindowId: activeWindowId === id ? null : activeWindowId
    });
  },

  maximizeWindow: (id: string) => {
    const { windows } = get();
    const win = windows[id];
    if (!win) return;

    if (!win.isMaximized) {
      // Maximizing
      set({
        windows: {
          ...windows,
          [id]: {
            ...win,
            isMaximized: true,
            prevBounds: {
              x: win.position.x,
              y: win.position.y,
              width: win.size.width,
              height: win.size.height
            }
          }
        }
      });
    } else {
      // Restoring
      const pb = win.prevBounds || { x: 100, y: 50, width: 450, height: 300 };
      set({
        windows: {
          ...windows,
          [id]: {
            ...win,
            isMaximized: false,
            position: { x: pb.x, y: pb.y },
            size: { width: pb.width, height: pb.height }
          }
        }
      });
    }
  },

  focusWindow: (id: string) => {
    const { windows, highestZIndex } = get();
    const win = windows[id];
    if (!win) return;
    const newZ = highestZIndex + 1;
    set({
      windows: {
        ...windows,
        [id]: {
          ...win,
          isMinimized: false,
          zIndex: newZ
        }
      },
      activeWindowId: id,
      highestZIndex: newZ
    });
  },

  updateWindowPosition: (id: string, pos: { x: number; y: number }) => {
    const { windows } = get();
    const win = windows[id];
    if (!win) return;
    set({
      windows: {
        ...windows,
        [id]: {
          ...win,
          position: pos
        }
      }
    });
  },

  openProjectDetails: (index: number) => {
    const project = PORTFOLIO_DATA.projects[index];
    if (!project) return;
    const { highestZIndex, windows } = get();
    const newZ = highestZIndex + 1;
    set({
      selectedProjectIndex: index,
      windows: {
        ...windows,
        'window-project-details': {
          ...windows['window-project-details'],
          isOpen: true,
          isMinimized: false,
          zIndex: newZ
        }
      },
      activeWindowId: 'window-project-details',
      highestZIndex: newZ
    });
  },

  closeProjectDetails: () => {
    const { windows } = get();
    set({
      selectedProjectIndex: null,
      windows: {
        ...windows,
        'window-project-details': {
          ...windows['window-project-details'],
          isOpen: false
        }
      }
    });
  },

  toggleStartMenu: (open?: boolean) => {
    set(state => ({
      startMenuOpen: typeof open === 'boolean' ? open : !state.startMenuOpen
    }));
  },

  updateIconPosition: (id: string, pos: { x: number; y: number }) => {
    set(state => ({
      iconPositions: {
        ...state.iconPositions,
        [id]: pos
      }
    }));
  },

  restoreIconPositions: () => {
    set({ iconPositions: INITIAL_ICON_POSITIONS });
  },

  toggleGravity: (on?: boolean) => {
    set(state => {
      const nextGravity = typeof on === 'boolean' ? on : !state.isGravityOn;
      return {
        isGravityOn: nextGravity,
        iconPositions: !nextGravity ? INITIAL_ICON_POSITIONS : state.iconPositions
      };
    });
  },

  toggleMatrix: (on?: boolean) => {
    set(state => ({
      isMatrixRunning: typeof on === 'boolean' ? on : !state.isMatrixRunning
    }));
  },

  triggerShake: () => {
    set({ isShakeMode: true });
    setTimeout(() => {
      set({ isShakeMode: false });
    }, 1000);
  },

  toggleKonami: () => {
    set(state => ({ isKonamiMode: !state.isKonamiMode }));
  },

  triggerBlackhole: () => {
    set({ isBlackholeMode: true });
    setTimeout(() => {
      window.location.reload();
    }, 4000);
  }
}));
