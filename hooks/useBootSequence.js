import { useEffect, useRef, useState } from 'react';

// Drives the hybrid boot animation timing:
//   1) reveal info lines one-by-one (cascade)
//   2) type out the prompt text character-by-character
//   3) mark done
// When `reduced` is true, everything is shown instantly.
export function useBootSequence(infoLineCount, promptText, { reduced }) {
  const [visibleCount, setVisibleCount] = useState(reduced ? infoLineCount : 0);
  const [typed, setTyped] = useState(reduced ? promptText : '');
  const [done, setDone] = useState(reduced);
  const timers = useRef([]);

  useEffect(() => {
    if (reduced) return undefined;
    const schedule = (fn, ms) => {
      const id = setTimeout(fn, ms);
      timers.current.push(id);
    };

    for (let i = 1; i <= infoLineCount; i++) {
      schedule(() => setVisibleCount(i), 150 * i);
    }

    const startType = 150 * infoLineCount + 350;
    for (let i = 1; i <= promptText.length; i++) {
      schedule(() => setTyped(promptText.slice(0, i)), startType + 38 * i);
    }
    schedule(() => setDone(true), startType + 38 * promptText.length + 200);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [infoLineCount, promptText, reduced]);

  return { visibleCount, typed, done };
}
