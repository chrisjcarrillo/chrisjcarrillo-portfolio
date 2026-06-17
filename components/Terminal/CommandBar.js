import { useRef, useState } from 'react';
import { PRESET_COMMANDS } from '../../lib/commands';

// Commands the Tab key can complete to.
const COMPLETIONS = ['about', 'work', 'projects', 'contact', 'theme', 'help', 'clear'];

// Clickable preset commands (primary) + a typed input with history (↑/↓) and Tab
// autocomplete (secondary). Both paths call onRun(commandString).
export default function CommandBar({ onRun, commandHistory }) {
  const [value, setValue] = useState('');
  const histIdx = useRef(null); // null = editing current line
  const tab = useRef({ matches: [], idx: 0, active: false });

  function resetTransient() {
    histIdx.current = null;
    tab.current = { matches: [], idx: 0, active: false };
  }

  function submit(e) {
    e.preventDefault();
    const cmd = value.trim();
    if (cmd) {
      onRun(cmd);
      setValue('');
      resetTransient();
    }
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!commandHistory.length) return;
      const i = histIdx.current === null ? commandHistory.length - 1 : Math.max(0, histIdx.current - 1);
      histIdx.current = i;
      setValue(commandHistory[i]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx.current === null) return;
      const i = histIdx.current + 1;
      if (i >= commandHistory.length) {
        histIdx.current = null;
        setValue('');
      } else {
        histIdx.current = i;
        setValue(commandHistory[i]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (!tab.current.active) {
        const base = value.trim().toLowerCase();
        const matches = base ? COMPLETIONS.filter((c) => c.startsWith(base)) : COMPLETIONS.slice();
        if (!matches.length) return;
        tab.current = { matches, idx: 0, active: true };
        setValue(matches[0]);
      } else {
        const idx = (tab.current.idx + 1) % tab.current.matches.length;
        tab.current.idx = idx;
        setValue(tab.current.matches[idx]);
      }
    }
  }

  function onChange(e) {
    setValue(e.target.value);
    resetTransient();
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-2">
        {PRESET_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => onRun(cmd)}
            className="font-mono text-sm font-semibold bg-transparent border-0 p-0 cursor-pointer underline hover:bg-[var(--term-accent)] hover:text-[var(--term-bg)] hover:no-underline"
          >
            $ {cmd}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="flex items-center">
        <span className="font-bold">$</span>
        <input
          className="font-mono text-sm border-0 outline-none bg-transparent flex-1 text-[var(--term-fg)] ml-1.5"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          aria-label="terminal command input"
          placeholder="type a command…"
        />
      </form>
    </div>
  );
}
