import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import BootSequence from './BootSequence';
import CommandBar from './CommandBar';
import { useVisitorInfo } from '../../hooks/useVisitorInfo';
import { useBootSequence } from '../../hooks/useBootSequence';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { runCommand } from '../../lib/commands';

const PROMPT_TEXT = '$ available commands:';

export default function Terminal() {
  const reduced = usePrefersReducedMotion();
  const visitor = useVisitorInfo();

  // Compute last-login on the client to avoid SSR/CSR hydration mismatch.
  const [lastLogin, setLastLogin] = useState('…');
  useEffect(() => {
    setLastLogin(moment().format('dddd, MMMM Do YYYY, h:mm A'));
  }, []);

  const infoLines = [
    { label: 'last login', value: lastLogin },
    { label: 'current ip', value: visitor.ip },
    { label: 'current location', value: visitor.location },
    { label: 'device', value: visitor.device },
  ];

  const { visibleCount, typed, done } = useBootSequence(infoLines.length, PROMPT_TEXT, { reduced });

  const [history, setHistory] = useState([]);
  const idRef = useRef(0);
  const bottomRef = useRef(null);

  function handleRun(cmd) {
    const result = runCommand(cmd);
    if (result.clear) {
      setHistory([]);
      return;
    }
    idRef.current += 1;
    setHistory((h) => [...h, { id: idRef.current, command: cmd, output: result.output }]);
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [history, done]);

  return (
    <div className="w-full bg-white border border-black rounded overflow-hidden">
      <header className="bg-black text-white flex items-center px-4 py-2">
        <span className="flex gap-2.5">
          <span className="h-3 w-3 bg-white rounded-full inline-block" />
          <span className="h-3 w-3 bg-white rounded-full inline-block" />
          <span className="h-3 w-3 bg-white rounded-full inline-block" />
        </span>
        <span className="flex-1 text-center text-sm">Current IP: {visitor.ip}</span>
        <span className="w-8" />
      </header>

      <div className="bg-white text-black px-4 py-3 max-h-[60vh] overflow-y-auto">
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

        {done && <CommandBar onRun={handleRun} />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
