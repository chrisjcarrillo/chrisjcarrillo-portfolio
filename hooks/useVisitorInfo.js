import { useEffect, useState } from 'react';
import { parseUserAgent } from '../lib/uaParser';

// Resolves the visitor's IP + approximate location (ipwho.is, free/no-key/HTTPS)
// and device (from the user agent). Degrades gracefully to '—' on failure/timeout.
export function useVisitorInfo() {
  const [info, setInfo] = useState({
    ip: '…',
    location: '…',
    device: '…',
    status: 'loading',
  });

  useEffect(() => {
    const { browser, os } = parseUserAgent(navigator.userAgent);
    setInfo((i) => ({ ...i, device: `${browser} on ${os}` }));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    fetch('https://ipwho.is/', { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => {
        if (!d || d.success === false) throw new Error('geo lookup failed');
        const loc = [d.city, d.region, d.country].filter(Boolean).join(', ');
        setInfo((i) => ({ ...i, ip: d.ip || '—', location: loc || '—', status: 'ready' }));
      })
      .catch(() => {
        setInfo((i) => ({ ...i, ip: '—', location: '—', status: 'error' }));
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return info;
}
