import { content } from '../data/content';

function Ext({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline break-all">
      {children}
    </a>
  );
}

function Tags({ tags }) {
  return (
    <span>
      {tags.map((t) => (
        <span
          key={t}
          className="inline-block border border-[var(--term-border)] px-1 mr-1 text-xs"
        >
          {t}
        </span>
      ))}
    </span>
  );
}

// Clickable preset commands (order matters for the UI).
export const PRESET_COMMANDS = ['about', 'work', 'projects', 'contact'];

const MATRIX = `01101  ｱｶｻﾀﾅ  11001
ﾊﾏﾔﾗﾝ  100110  ｲｷｼﾁﾆ
01101  ﾋﾐﾘ ｳ ﾝ  110010
ｴｹｾﾄﾇ  011001  ﾍﾓﾚﾞ`;

// Exact-match commands (name → output node). Easter eggs are intentionally
// omitted from `help` for discovery.
const commands = {
  about: () => (
    <div>
      {content.about.map((p, i) => (
        <p key={i} className="my-1">{p}</p>
      ))}
    </div>
  ),
  work: () => (
    <ul className="list-none m-0 p-0">
      {content.work.map((w, i) => (
        <li key={i} className="mb-4">
          <div>
            <span className="font-bold">{w.role}</span>
            <span className="text-[var(--term-muted)]"> @ {w.company}</span>
            <span className="text-[var(--term-muted)]"> · {w.period}</span>
          </div>
          <div className="mt-0.5">{w.summary}</div>
          <ul className="list-none m-0 p-0 mt-1">
            {w.highlights.map((h, j) => (
              <li key={j}>
                <span className="text-[var(--term-muted)]">— </span>
                {h}
              </li>
            ))}
          </ul>
          <div className="my-1">
            <Tags tags={w.tags} />
          </div>
          <Ext href={w.link}>{w.link}</Ext>
        </li>
      ))}
    </ul>
  ),
  projects: () => (
    <ul className="list-none m-0 p-0">
      {content.projects.map((p, i) => (
        <li key={i} className="mb-3">
          <span className="font-bold">{p.name}</span>
          <div className="my-1">
            <Tags tags={p.tags} />
          </div>
          <div>{p.description}</div>
          <Ext href={p.link}>{p.link}</Ext>
        </li>
      ))}
    </ul>
  ),
  contact: () => {
    const c = content.contact;
    return (
      <ul className="list-none m-0 p-0 [&>li]:mb-1">
        <li>email: <Ext href={`mailto:${c.email}`}>{c.email}</Ext></li>
        <li>linkedin: <Ext href={c.linkedIn}>{c.linkedIn}</Ext></li>
        <li>instagram: <Ext href={c.instagram}>{c.instagram}</Ext></li>
        <li>github: <Ext href={c.github}>{c.github}</Ext></li>
      </ul>
    );
  },
  help: () => (
    <div>available commands: about · work · projects · contact · theme · help · clear</div>
  ),
  whoami: () => <div>chris</div>,
  pwd: () => <div>/home/chris/portfolio</div>,
  ls: () => <div>about  work  projects  contact</div>,
  date: () => <div>{new Date().toString()}</div>,
  matrix: () => (
    <pre className="whitespace-pre text-[var(--term-accent)]">{MATRIX}</pre>
  ),
};

function notFound(name) {
  return {
    output: <span className="italic">command not found: {name} — try &apos;help&apos;</span>,
  };
}

// Dispatch a command. Returns one of:
//   { clear: true }                  → Terminal clears history
//   { theme: true }                  → Terminal toggles theme
//   { output }                       → Terminal prints output
export function runCommand(raw) {
  const input = raw.trim();
  const parts = input.split(/\s+/);
  const first = (parts[0] || '').toLowerCase();
  const arg = parts.slice(1).join(' ');
  const lower = input.toLowerCase();

  if (lower === 'clear') return { clear: true };
  if (lower === 'theme') return { theme: true };

  // arg commands — matched on the first token
  if (first === 'echo') return { output: <div>{arg}</div> };
  if (first === 'sudo') return { output: <span>nice try — you&apos;re not chris 😏</span> };
  if (first === 'rm') return { output: <span>🔥 nice try — this terminal is read-only</span> };

  const fn = commands[lower];
  if (!fn) return notFound(input);
  return { output: fn() };
}
