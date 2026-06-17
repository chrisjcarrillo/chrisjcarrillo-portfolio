# Portfolio Polish Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four polish features to the terminal portfolio — a CRT theme toggle, command history + tab autocomplete + easter eggs, a social share preview (OG image) + favicon, and richer `work`/`projects` output plus a `resume` command.

**Architecture:** Color is tokenized via CSS variables in `globals.css` (`:root` light default + `[data-theme="crt"]` override); a `useTheme` hook + a pre-paint script in `_document.js` persist the choice. `commands.js` stays a (mostly) pure registry that returns action markers (`clear`/`theme`/`openUrl`) consumed by `Terminal`. `CommandBar` gains history + autocomplete. A `next/og` route renders the OG image.

**Tech Stack:** Next.js 16 (Pages Router), React 19, Tailwind v4, `next/og` (built in). No new dependencies.

**Verification note:** No test framework (per spec). Verify with `yarn build` (must compile clean) and, if enabled, browser dogfooding via `/browse`. Each task ends in a commit.

**Builds on spec:** `docs/superpowers/specs/2026-06-17-portfolio-polish-batch-design.md`

---

## File Structure

**Create:** `hooks/useTheme.js`, `pages/_document.js`, `pages/api/og.js`, `public/favicon.svg`.
**Modify:** `styles/globals.css`, `data/content.js`, `lib/commands.js`, `components/Terminal/Terminal.js`, `components/Terminal/CommandBar.js`, `components/Terminal/BootSequence.js`, `pages/index.js`.
(`components/Terminal/Banner.js` needs no change — it inherits `currentColor`.)

---

## Task 1: Theme infrastructure (tokens, CRT styles, hook, document, favicon)

**Files:**
- Modify: `styles/globals.css`
- Create: `hooks/useTheme.js`
- Create: `pages/_document.js`
- Create: `public/favicon.svg`

- [ ] **Step 1: Append theme tokens + CRT styles to `styles/globals.css`**

Append to the END of the file (keep everything already there):

```css
:root {
  --page-bg: #ffffff;
  --term-bg: #ffffff;
  --term-fg: #000000;
  --term-border: #000000;
  --term-header-bg: #000000;
  --term-header-fg: #ffffff;
  --term-accent: #000000;
  --term-muted: #555555;
}

[data-theme='crt'] {
  --page-bg: #050805;
  --term-bg: #0a0f0a;
  --term-fg: #00ff66;
  --term-border: #00ff66;
  --term-header-bg: #04150c;
  --term-header-fg: #00ff66;
  --term-accent: #00ff66;
  --term-muted: #2bb673;
}

body {
  background: var(--page-bg);
}

[data-theme='crt'] .term-body {
  background-image: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0px,
    rgba(0, 0, 0, 0) 2px,
    rgba(0, 255, 102, 0.05) 3px,
    rgba(0, 0, 0, 0) 4px
  );
  text-shadow: 0 0 4px rgba(0, 255, 102, 0.45);
}
```

- [ ] **Step 2: Create `hooks/useTheme.js`**

```js
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
```

- [ ] **Step 3: Create `pages/_document.js`**

```js
import { Html, Head, Main, NextScript } from 'next/document';

// Applies the saved theme before first paint to avoid a flash, and registers the
// favicon site-wide.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='crt'||t==='light'){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.svg" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

- [ ] **Step 4: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#0a0f0a" />
  <path d="M16 20 L28 32 L16 44" fill="none" stroke="#00ff66" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  <rect x="32" y="39" width="18" height="5" rx="2.5" fill="#00ff66" />
</svg>
```

- [ ] **Step 5: Build**

Run: `yarn build`
Expected: `✓ Compiled successfully`, no errors. (Theme isn't visibly wired into components yet — that's Task 3 — but everything must compile.)

- [ ] **Step 6: Commit**

```bash
git add styles/globals.css hooks/useTheme.js pages/_document.js public/favicon.svg
git commit -m "Add theme tokens, CRT styles, useTheme hook, document script, favicon"
```

---

## Task 2: Content data + commands registry

**Files:**
- Modify: `data/content.js`
- Modify: `lib/commands.js`

- [ ] **Step 1: Update `data/content.js`**

(a) Add `resumeUrl: '/resume.pdf',` immediately after the `name: 'Chris Carrillo',` line.

(b) Replace the entire `projects: [ ... ]` array with this (swaps `tech` string → `tags` array):

```js
  projects: [
    {
      name: 'Terminal Portfolio',
      description: 'This site — an interactive terminal built with Next.js.',
      tags: ['Next.js', 'React', 'Tailwind'],
      link: 'https://github.com/chrisjcarrillo',
    },
    {
      name: 'Placeholder Project',
      description: 'Short description of a cool thing you built. Replace with a real project.',
      tags: ['React', 'Node'],
      link: 'https://example.com',
    },
  ],
```

- [ ] **Step 2: Replace `lib/commands.js` entirely**

```js
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
export const PRESET_COMMANDS = ['about', 'work', 'projects', 'contact', 'resume'];

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
        <li key={i} className="mb-3">
          <span className="font-bold">{w.title}</span>{' '}
          <span className="text-[var(--term-muted)]">· {w.period}</span>
          <div>{w.summary}</div>
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
    <div>available commands: about · work · projects · contact · resume · theme · help · clear</div>
  ),
  whoami: () => <div>chris</div>,
  pwd: () => <div>/home/chris/portfolio</div>,
  ls: () => <div>about  work  projects  contact  resume.pdf</div>,
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
//   { openUrl, output }              → Terminal opens url + prints output
//   { output }                       → Terminal prints output
export function runCommand(raw) {
  const input = raw.trim();
  const parts = input.split(/\s+/);
  const first = (parts[0] || '').toLowerCase();
  const arg = parts.slice(1).join(' ');
  const lower = input.toLowerCase();

  if (lower === 'clear') return { clear: true };
  if (lower === 'theme') return { theme: true };
  if (lower === 'resume') {
    return {
      openUrl: content.resumeUrl,
      output: (
        <span>
          opening resume… if it doesn&apos;t open,{' '}
          <Ext href={content.resumeUrl}>download it here</Ext>.
        </span>
      ),
    };
  }

  // arg commands — matched on the first token
  if (first === 'echo') return { output: <div>{arg}</div> };
  if (first === 'sudo') return { output: <span>nice try — you&apos;re not chris 😏</span> };
  if (first === 'rm') return { output: <span>🔥 nice try — this terminal is read-only</span> };

  const fn = commands[lower];
  if (!fn) return notFound(input);
  return { output: fn() };
}
```

- [ ] **Step 3: Commit**

```bash
git add data/content.js lib/commands.js
git commit -m "Add easter eggs, resume/theme actions, tag chips, richer command output"
```

---

## Task 3: Terminal — theme wiring, action handling, history tracking, token colors

**Files:**
- Modify: `components/Terminal/Terminal.js`
- Modify: `components/Terminal/BootSequence.js`

- [ ] **Step 1: Replace `components/Terminal/Terminal.js` entirely**

```js
import { useEffect, useRef, useState } from 'react';
import { formatLastLogin } from '../../lib/formatDate';
import BootSequence from './BootSequence';
import CommandBar from './CommandBar';
import { useVisitorInfo } from '../../hooks/useVisitorInfo';
import { useBootSequence } from '../../hooks/useBootSequence';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useTheme } from '../../hooks/useTheme';
import { runCommand } from '../../lib/commands';

const PROMPT_TEXT = '$ available commands:';

export default function Terminal() {
  const reduced = usePrefersReducedMotion();
  const visitor = useVisitorInfo();
  const { toggleTheme } = useTheme();

  const [lastLogin, setLastLogin] = useState('…');
  useEffect(() => {
    setLastLogin(formatLastLogin());
  }, []);

  const infoLines = [
    { label: 'last login', value: lastLogin },
    { label: 'current ip', value: visitor.ip },
    { label: 'current location', value: visitor.location },
    { label: 'device', value: visitor.device },
  ];

  const { visibleCount, typed, done } = useBootSequence(infoLines.length, PROMPT_TEXT, { reduced });

  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const idRef = useRef(0);
  const bottomRef = useRef(null);

  function handleRun(cmd) {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setCommandHistory((h) => [...h, trimmed]);

    const result = runCommand(trimmed);

    if (result.clear) {
      setHistory([]);
      return;
    }

    let output = result.output;
    if (result.theme) {
      const next = toggleTheme();
      output = <span>theme switched to {next}</span>;
    }
    if (result.openUrl) {
      try {
        window.open(result.openUrl, '_blank', 'noopener');
      } catch (e) {
        /* ignore */
      }
    }

    idRef.current += 1;
    setHistory((h) => [...h, { id: idRef.current, command: trimmed, output }]);
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [history, done]);

  return (
    <div className="w-full h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] flex flex-col bg-[var(--term-bg)] text-[var(--term-fg)] border border-[var(--term-border)] rounded overflow-hidden">
      <header className="flex items-center px-4 py-2 bg-[var(--term-header-bg)] text-[var(--term-header-fg)]">
        <span className="flex gap-2.5">
          <span className="h-3 w-3 rounded-full inline-block bg-[var(--term-header-fg)]" />
          <span className="h-3 w-3 rounded-full inline-block bg-[var(--term-header-fg)]" />
          <span className="h-3 w-3 rounded-full inline-block bg-[var(--term-header-fg)]" />
        </span>
        <span className="flex-1 text-center text-sm">chris@portfolio: ~</span>
        <span className="w-8" />
      </header>

      <div className="term-body flex-1 min-h-0 px-4 py-3 overflow-y-auto bg-[var(--term-bg)] text-[var(--term-fg)]">
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

        {done && <CommandBar onRun={handleRun} commandHistory={commandHistory} />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update the cursor color in `components/Terminal/BootSequence.js`**

Change the cursor span class from:
```js
            <span className="inline-block w-2 h-[1em] bg-black align-[-2px] ml-0.5 animate-blink" />
```
to:
```js
            <span className="inline-block w-2 h-[1em] bg-[var(--term-accent)] align-[-2px] ml-0.5 animate-blink" />
```

- [ ] **Step 3: Commit**

```bash
git add components/Terminal/Terminal.js components/Terminal/BootSequence.js
git commit -m "Wire theme/resume actions, command history, and token colors into Terminal"
```

---

## Task 4: CommandBar — history (↑/↓), Tab autocomplete, token colors

**Files:**
- Modify: `components/Terminal/CommandBar.js`

- [ ] **Step 1: Replace `components/Terminal/CommandBar.js` entirely**

```js
import { useRef, useState } from 'react';
import { PRESET_COMMANDS } from '../../lib/commands';

// Commands the Tab key can complete to.
const COMPLETIONS = ['about', 'work', 'projects', 'contact', 'resume', 'theme', 'help', 'clear'];

// Clickable preset commands (primary) + a typed input with history (↑/↓) and Tab
// autocomplete (secondary). Both paths call onRun(commandString).
export default function CommandBar({ onRun, commandHistory }) {
  const [value, setValue] = useState('');
  const histIdx = useRef(null); // null = editing current line
  const tab = useRef({ matches: [], idx: 0, active: false });

  function resetTransient() {
    histIdx.current = null;
    tab.current = { matches: [], idx: 0, active: false };
  }

  function submit(e) {
    e.preventDefault();
    const cmd = value.trim();
    if (cmd) {
      onRun(cmd);
      setValue('');
      resetTransient();
    }
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!commandHistory.length) return;
      const i = histIdx.current === null ? commandHistory.length - 1 : Math.max(0, histIdx.current - 1);
      histIdx.current = i;
      setValue(commandHistory[i]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx.current === null) return;
      const i = histIdx.current + 1;
      if (i >= commandHistory.length) {
        histIdx.current = null;
        setValue('');
      } else {
        histIdx.current = i;
        setValue(commandHistory[i]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (!tab.current.active) {
        const base = value.trim().toLowerCase();
        const matches = base ? COMPLETIONS.filter((c) => c.startsWith(base)) : COMPLETIONS.slice();
        if (!matches.length) return;
        tab.current = { matches, idx: 0, active: true };
        setValue(matches[0]);
      } else {
        const idx = (tab.current.idx + 1) % tab.current.matches.length;
        tab.current.idx = idx;
        setValue(tab.current.matches[idx]);
      }
    }
  }

  function onChange(e) {
    setValue(e.target.value);
    resetTransient();
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-2">
        {PRESET_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => onRun(cmd)}
            className="font-mono text-sm font-semibold bg-transparent border-0 p-0 cursor-pointer underline hover:bg-[var(--term-accent)] hover:text-[var(--term-bg)] hover:no-underline"
          >
            $ {cmd}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="flex items-center">
        <span className="font-bold">$</span>
        <input
          className="font-mono text-sm border-0 outline-none bg-transparent flex-1 text-[var(--term-fg)] ml-1.5"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          aria-label="terminal command input"
          placeholder="type a command…"
        />
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Build**

Run: `yarn build`
Expected: `✓ Compiled successfully`, no errors.

- [ ] **Step 3: Commit**

```bash
git add components/Terminal/CommandBar.js
git commit -m "Add command history and tab autocomplete to CommandBar"
```

---

## Task 5: OG image route + social meta tags

**Files:**
- Create: `pages/api/og.js`
- Modify: `pages/index.js`

- [ ] **Step 1: Create `pages/api/og.js`**

```js
import { ImageResponse } from 'next/og';

export const config = { runtime: 'edge' };

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0a0f0a',
          color: '#00ff66',
          padding: '60px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: 30, color: '#9effc4' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#00ff66' }} />
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#00ff66' }} />
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#00ff66' }} />
          </div>
          <div style={{ display: 'flex' }}>chris@portfolio: ~</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
          <div style={{ display: 'flex', fontSize: 92, fontWeight: 700, color: '#ffffff', letterSpacing: '2px' }}>
            CHRIS CARRILLO
          </div>
          <div style={{ display: 'flex', fontSize: 36, color: '#00ff66', marginTop: '16px' }}>
            a miami based creative &amp; software engineer
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, color: '#00ff66', marginTop: '44px' }}>
            $&nbsp;
            <div style={{ display: 'flex', width: 20, height: 40, background: '#00ff66' }} />
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
```

- [ ] **Step 2: Add social meta tags to `pages/index.js`**

In the `<Head>`, after the existing `<meta name="description" ... />` line, add:

```js
        <meta property="og:title" content="Chris Carrillo — Creative & Software Engineer" />
        <meta
          property="og:description"
          content="An interactive terminal portfolio — a Miami-based creative and software engineer."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://chrisjcarrillo.dev" />
        <meta property="og:image" content="https://chrisjcarrillo.dev/api/og" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Chris Carrillo — Creative & Software Engineer" />
        <meta name="twitter:image" content="https://chrisjcarrillo.dev/api/og" />
```

- [ ] **Step 3: Build**

Run: `yarn build`
Expected: `✓ Compiled successfully`; the build output lists `/api/og` as a route. No errors.

- [ ] **Step 4: Commit**

```bash
git add pages/api/og.js pages/index.js
git commit -m "Add next/og social share image route and OG/Twitter meta tags"
```

---

## Task 6: Verification

**Files:** none.

- [ ] **Step 1: Final build** — `yarn build` compiles clean; routes include `/`, `/404`, `/api/default`, `/api/og`.

- [ ] **Step 2: Dev dogfood (if `/browse` enabled)** — `yarn dev`, then verify:
- `theme` toggles white ↔ green CRT (scanlines + glow), persists across reload with no flash; clickable + typed both work.
- ↑/↓ recalls previous commands; Tab autocompletes/cycles command names.
- Easter eggs respond: `whoami`, `ls`, `pwd`, `date`, `echo hi`, `sudo`, `rm -rf /`, `matrix` (green rows pop in CRT mode).
- `resume` opens `/resume.pdf` in a new tab (404 until the file is added — expected) and prints the note; `resume` appears in the preset row.
- `projects` shows tag chips; `work` shows formatted entries.
- `GET http://localhost:3000/api/og` returns a 1200×630 PNG; page source contains the `og:`/`twitter:` meta; favicon loads.
- CRT theme readable on desktop + mobile; no horizontal overflow.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "Fix issues found during polish-batch dogfooding"
```

---

## Self-Review

**Spec coverage:**
- Feature 1 (CRT theme): tokens + CRT + scanlines (Task 1), `useTheme` + pre-paint script (Task 1), token colors across components (Tasks 3, 4), `theme` command toggles + persists (Tasks 2, 3). ✓
- Feature 2 (history/autocomplete/easter eggs): ↑/↓ + Tab (Task 4), `commandHistory` survives `clear` (Task 3 — separate state, not cleared), easter eggs incl. first-token `echo`/`sudo`/`rm` (Task 2). ✓
- Feature 3 (OG + favicon): `next/og` route (Task 5), favicon.svg + link (Task 1), meta tags (Task 5). ✓
- Feature 4 (richer output + resume): tag chips + formatting (Task 2), `resume` action + preset + `ls` + `help` + `resumeUrl` (Tasks 2, 3). ✓
- Theme persistence/no-flash, graceful errors (try/catch in hook + script + window.open), black-on-white default. ✓

**Placeholder scan:** All code is complete; ASCII/SVG/JSX included verbatim. No TBD/TODO. (`public/resume.pdf` is intentionally user-supplied later; `resume` degrades to a 404 tab, documented.) ✓

**Type/name consistency:** `runCommand` returns `{clear}` / `{theme}` / `{openUrl,output}` / `{output}` (Task 2) — consumed exactly so in Terminal `handleRun` (Task 3). `PRESET_COMMANDS` includes `resume` (Task 2) → preset row (Task 4). `commandHistory` state (Task 3) → `CommandBar` prop (Task 4). `content.resumeUrl` + `projects[].tags` defined (Task 2) → used in `commands.js` (Task 2) and `Terminal`/`og` consistently. CSS tokens defined in Task 1 → referenced as `var(--term-*)` in Tasks 2–4. `.term-body` class set in Task 3 → styled in Task 1. ✓
