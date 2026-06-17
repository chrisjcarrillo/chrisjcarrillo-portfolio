import { useEffect, useRef, useState } from 'react';
import { formatLastLogin } from '../../lib/formatDate';
import BootSequence from './BootSequence';
import CommandBar from './CommandBar';
import ThemeToggle from './ThemeToggle';
import { useVisitorInfo } from '../../hooks/useVisitorInfo';
import { useBootSequence } from '../../hooks/useBootSequence';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useTheme } from '../../hooks/useTheme';
import { runCommand } from '../../lib/commands';

const PROMPT_TEXT = '$ available commands:';

export default function Terminal() {
  const reduced = usePrefersReducedMotion();
  const visitor = useVisitorInfo();
  const { theme, toggleTheme } = useTheme();

  const [lastLogin, setLastLogin] = useState('…');
  useEffect(() => {
    setLastLogin(formatLastLogin());
  }, []);

  const infoLines = [
    { label: 'last login', value: lastLogin },
    { label: 'current ip', value: visitor.ip },
    { label: 'current location', value: visitor.location },
    { label: 'device', value: visitor.device },
  ];

  const { visibleCount, typed, done } = useBootSequence(infoLines.length, PROMPT_TEXT, { reduced });

  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const idRef = useRef(0);
  const bottomRef = useRef(null);

  function handleRun(cmd) {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setCommandHistory((h) => [...h, trimmed]);

    const result = runCommand(trimmed);

    if (result.clear) {
      setHistory([]);
      return;
    }

    let output = result.output;
    if (result.theme) {
      const next = toggleTheme();
      output = <span>theme switched to {next}</span>;
    }
    if (result.openUrl) {
      try {
        window.open(result.openUrl, '_blank', 'noopener');
      } catch (e) {
        /* ignore */
      }
    }

    idRef.current += 1;
    setHistory((h) => [...h, { id: idRef.current, command: trimmed, output }]);
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [history, done]);

  return (
    <div className="w-full h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] flex flex-col bg-[var(--term-bg)] text-[var(--term-fg)] border border-[var(--term-border)] rounded overflow-hidden">
      <header className="flex items-center px-4 py-2 bg-[var(--term-header-bg)] text-[var(--term-header-fg)]">
        <span className="flex gap-2.5">
          <span className="h-3 w-3 rounded-full inline-block bg-[var(--term-header-fg)]" />
          <span className="h-3 w-3 rounded-full inline-block bg-[var(--term-header-fg)]" />
          <span className="h-3 w-3 rounded-full inline-block bg-[var(--term-header-fg)]" />
        </span>
        <span className="flex-1 text-center text-sm">chris@portfolio: ~</span>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <div className="term-body flex-1 min-h-0 px-4 py-3 overflow-y-auto bg-[var(--term-bg)] text-[var(--term-fg)]">
        <BootSequence
          infoLines={infoLines}
          visibleCount={visibleCount}
          typed={typed}
          typingDone={done}
        />

        {done &&
          history.map((entry) => (
            <div key={entry.id} className="mt-2.5">
              <div className="font-bold">
                <span className="font-bold">$ </span>
                {entry.command}
              </div>
              <div className="mt-1">{entry.output}</div>
            </div>
          ))}

        {done && <CommandBar onRun={handleRun} commandHistory={commandHistory} />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
