import { useEffect, useState } from 'react';
import { parseUserAgent } from '../lib/uaParser';

// Resolves the visitor's IP + approximate location and device (from the user agent).
// Uses GeoJS (get.geojs.io) — free, no API key, HTTPS, and CORS-enabled for
// browser/client-side requests. Degrades gracefully to '—' on failure/timeout.
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
    const timeout = setTimeout(() => controller.abort(), 5000);

    fetch('https://get.geojs.io/v1/ip/geo.json', { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`geo lookup failed: ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (!d || !d.ip) throw new Error('geo lookup returned no data');
        const loc = [d.city, d.region, d.country].filter(Boolean).join(', ');
        setInfo((i) => ({ ...i, ip: d.ip, location: loc || '—', status: 'ready' }));
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
