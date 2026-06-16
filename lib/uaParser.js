// Tiny user-agent parser — display-only (browser + OS). No external dependency.
export function parseUserAgent(ua = '') {
  const browser =
    /edg/i.test(ua) ? 'Edge' :
    /opr|opera/i.test(ua) ? 'Opera' :
    /chrome|crios/i.test(ua) ? 'Chrome' :
    /firefox|fxios/i.test(ua) ? 'Firefox' :
    /safari/i.test(ua) ? 'Safari' : 'Unknown browser';

  const os =
    /windows/i.test(ua) ? 'Windows' :
    /(mac os|macintosh)/i.test(ua) ? 'macOS' :
    /(iphone|ipad|ipod)/i.test(ua) ? 'iOS' :
    /android/i.test(ua) ? 'Android' :
    /linux/i.test(ua) ? 'Linux' : 'Unknown OS';

  return { browser, os };
}
