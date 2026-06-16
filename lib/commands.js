import { content } from '../data/content';

function Ext({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline break-all">
      {children}
    </a>
  );
}

// Commands shown as clickable presets (order matters for the UI).
export const PRESET_COMMANDS = ['about', 'work', 'projects', 'contact'];

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
        <li key={i} className="mb-2.5">
          <span className="font-bold">{w.title}</span>{' '}
          <span className="text-neutral-600">({w.period})</span>
          <div>{w.summary}</div>
          <Ext href={w.link}>{w.link}</Ext>
        </li>
      ))}
    </ul>
  ),
  projects: () => (
    <ul className="list-none m-0 p-0">
      {content.projects.map((p, i) => (
        <li key={i} className="mb-2.5">
          <span className="font-bold">{p.name}</span>{' '}
          <span className="text-neutral-600">· {p.tech}</span>
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
    <div>available commands: about · work · projects · contact · help · clear</div>
  ),
};

// Dispatch a command by name. Returns { clear: true } for clear,
// { output: <node> } otherwise (including a friendly not-found message).
export function runCommand(name) {
  const key = name.trim().toLowerCase();
  if (key === 'clear') return { clear: true };
  const fn = commands[key];
  if (!fn) {
    return {
      output: (
        <span className="italic">command not found: {name} — try &apos;help&apos;</span>
      ),
    };
  }
  return { output: fn() };
}
