import React, { useState, useRef, useEffect } from 'react';
import { useOSStore } from '../../stores/useOSStore';
import { sfx } from '../../hooks/useAudioSynth';

interface OutputLine {
  id: number;
  text: string;
  color?: string;
}

export const CmdApp: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<OutputLine[]>([
    { id: 1, text: 'AdarshOS v1.0 [Version 10.0.19045]' },
    { id: 2, text: '(c) Adarsh Sen. All rights reserved.' },
    { id: 3, text: '' },
    { id: 4, text: "Type 'help' for a list of commands." },
    { id: 5, text: '' }
  ]);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleGravity = useOSStore(state => state.toggleGravity);
  const isGravityOn = useOSStore(state => state.isGravityOn);
  const toggleMatrix = useOSStore(state => state.toggleMatrix);
  const isMatrixRunning = useOSStore(state => state.isMatrixRunning);
  const triggerShake = useOSStore(state => state.triggerShake);
  const openWindow = useOSStore(state => state.openWindow);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const appendLine = (text: string, color = '#33ff33') => {
    setHistory(prev => [...prev, { id: Date.now() + Math.random(), text, color }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const rawVal = inputVal;
    const val = rawVal.trim().toLowerCase();
    setInputVal('');

    appendLine(`C:\\> ${rawVal}`);

    if (val === 'help') {
      [
        'Available commands:',
        '- help      : Shows this menu',
        '- matrix    : Toggles matrix override',
        '- gravity on: Enable window and icon gravity physics',
        '- gravity off: Disable window and icon gravity physics',
        '- shake     : Simulates hardware failure',
        '- clear     : Clears terminal output'
      ].forEach(line => appendLine(line));
    } else if (val === 'clear') {
      setHistory([]);
    } else if (val === 'gravity on') {
      if (!isGravityOn) {
        toggleGravity(true);
        appendLine('Window and icon gravity enabled. Physics engine online.', '#00ffff');
        sfx.gravityOn();
      } else {
        appendLine('Window gravity is already enabled.', '#ffff00');
      }
    } else if (val === 'gravity off') {
      if (isGravityOn) {
        toggleGravity(false);
        appendLine('Window and icon gravity disabled. Icons restored.', '#ffff00');
        sfx.gravityOff();
      } else {
        appendLine('Window gravity is already disabled.', '#ffff00');
      }
    } else if (val === 'gravity') {
      appendLine('Usage: gravity on | gravity off', '#00ffff');
    } else if (val === 'shake') {
      triggerShake();
      sfx.shake();
      appendLine('Hardware failure simulated.', '#ffff00');
    } else if (val === 'matrix') {
      const nextMatrix = !isMatrixRunning;
      toggleMatrix(nextMatrix);
      if (nextMatrix) {
        appendLine('Matrix override initiated.', '#00ffff');
      } else {
        appendLine('Matrix override terminated.', '#ff0000');
      }
    } else if (val === 'admin' || val.startsWith('admin')) {
      appendLine('ACCESS DENIED. Admin subsystem has been permanently disabled for security.', '#ff0000');
      sfx.shake();
      triggerShake();
    } else if (val) {
      appendLine(`'${rawVal}' is not recognized as an internal or external command.`, '#ff0000');
    }
  };

  return (
    <div
      id="cmd-body"
      style={{
        background: 'black',
        color: '#33ff33',
        fontFamily: "'VT323', monospace",
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'text',
        height: '100%',
        boxSizing: 'border-box'
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <div
        id="cmd-output"
        ref={outputRef}
        style={{
          overflowY: 'auto',
          flexGrow: 1,
          textShadow: '0 0 5px #33ff33',
          lineHeight: 1.2
        }}
      >
        {history.map(item => (
          <div key={item.id} style={{ color: item.color || '#33ff33' }}>
            {item.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: '5px' }}>
        <span style={{ marginRight: '8px' }}>C:\&gt;</span>
        <input
          ref={inputRef}
          type="text"
          id="cmd-input"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flexGrow: 1,
            background: 'transparent',
            border: 'none',
            color: '#33ff33',
            fontFamily: "'VT323', monospace",
            outline: 'none',
            fontSize: '20px',
            textShadow: '0 0 5px #33ff33'
          }}
          autoComplete="off"
          spellCheck={false}
          autoFocus
        />
      </div>
    </div>
  );
};
