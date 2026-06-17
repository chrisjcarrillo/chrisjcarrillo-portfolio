import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';

// Theme state synced to <html data-theme> and localStorage. The initial
// data-theme is set pre-paint by the script in _document.js; this hook reads it
// on mount so React state matches what's already on screen (no flash).
export function useTheme() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === 'crt' ? 'crt' : 'light');
  }, []);

  const toggleTheme = useCallback(() => {
    const next = document.documentElement.dataset.theme === 'crt' ? 'light' : 'crt';
    setTheme(next);
    try {
      document.documentElement.dataset.theme = next;
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      /* ignore storage errors */
    }
    return next;
  }, []);

  return { theme, toggleTheme };
}
