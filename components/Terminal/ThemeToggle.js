// Sun/moon theme switcher for the terminal header. Shows a moon in light mode
// (click → CRT) and a sun in CRT mode (click → light). Monochrome — inherits the
// header color via currentColor, so no new dependency and it fits both themes.
export default function ThemeToggle({ theme, onToggle }) {
  const isCrt = theme === 'crt';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isCrt ? 'Switch to light theme' : 'Switch to CRT theme'}
      title="Toggle theme"
      className="flex items-center justify-center w-6 h-6 p-0 bg-transparent border-0 cursor-pointer text-[var(--term-header-fg)] opacity-80 hover:opacity-100"
    >
      {isCrt ? (
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
