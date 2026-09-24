// Web Audio API chiptune synthesizer

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function playTone(freq: number, type: OscillatorType, duration: number, vol = 0.1) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
}

export const sfx = {
  click: () => playTone(600, 'square', 0.05, 0.05),
  open: () => {
    playTone(400, 'square', 0.1, 0.05);
    setTimeout(() => playTone(800, 'square', 0.15, 0.05), 100);
  },
  minimize: () => {
    playTone(800, 'square', 0.1, 0.05);
    setTimeout(() => playTone(400, 'square', 0.15, 0.05), 100);
  },
  boop: () => playTone(300, 'sine', 0.1, 0.1),
  gravityOn: () => playTone(240, 'sawtooth', 0.08, 0.05),
  gravityOff: () => playTone(420, 'triangle', 0.08, 0.04),
  shake: () => playTone(100, 'sawtooth', 1.0, 0.2),
  konami: () => {
    playTone(200, 'square', 0.5, 0.2);
    setTimeout(() => playTone(300, 'square', 0.5, 0.2), 200);
  },
  pongWall: () => playTone(720, 'square', 0.03, 0.03),
  pongAiPaddle: () => playTone(430, 'triangle', 0.04, 0.03),
  pongPlayerPaddle: () => playTone(560, 'square', 0.04, 0.03),
  pongPlayerScore: () => playTone(920, 'sawtooth', 0.08, 0.05),
  pongAiScore: () => playTone(180, 'sawtooth', 0.08, 0.05),
  paintClear: () => playTone(200, 'sawtooth', 0.1, 0.1)
};
