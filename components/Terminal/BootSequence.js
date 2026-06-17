import Banner from './Banner';

// Presentational. Renders the identity banner, then the cascading info lines and
// the typed prompt line. `infoLines`: [{ label, value }]; `visibleCount`, `typed`,
// `typingDone` come from useBootSequence (owned by the parent Terminal).
export default function BootSequence({ infoLines, visibleCount, typed, typingDone }) {
  return (
    <div className="flex flex-col">
      <Banner />

      <div className="mt-5 flex flex-col">
        {infoLines.map((line, i) => (
          <span
            key={line.label}
            className={`block text-sm leading-7 ${
              i < visibleCount ? 'opacity-100 animate-slide-up' : 'opacity-0'
            }`}
          >
            {line.label}: {line.value}
          </span>
        ))}
        <span className="block font-bold mt-1.5 min-h-[1.4em]">
          {typed}
          {!typingDone && (
            <span className="inline-block w-2 h-[1em] bg-[var(--term-accent)] align-[-2px] ml-0.5 animate-blink" />
          )}
        </span>
      </div>
    </div>
  );
}
