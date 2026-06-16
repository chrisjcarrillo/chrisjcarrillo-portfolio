import { useState } from 'react';
import { PRESET_COMMANDS } from '../../lib/commands';

// Clickable preset commands (primary path for clients) + a typed input (secondary).
// Both call onRun(commandString).
export default function CommandBar({ onRun }) {
  const [value, setValue] = useState('');

  function submit(e) {
    e.preventDefault();
    const cmd = value.trim();
    if (cmd) {
      onRun(cmd);
      setValue('');
    }
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-2">
        {PRESET_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => onRun(cmd)}
            className="font-mono text-sm font-semibold bg-transparent border-0 p-0 cursor-pointer underline hover:bg-black hover:text-white hover:no-underline"
          >
            $ {cmd}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="flex items-center">
        <span className="font-bold">$</span>
        <input
          className="font-mono text-sm border-0 outline-none bg-transparent flex-1 text-black ml-1.5"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-label="terminal command input"
          placeholder="type a command…"
        />
      </form>
    </div>
  );
}
