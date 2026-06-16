# Interactive Terminal Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the static terminal-styled landing page into a real interactive terminal: it boots with a hybrid animation, shows the visitor's live IP/location/device, and runs preset clickable (or typed) commands that print curated content inline.

**Architecture:** Pages Router, fully client-driven terminal. `pages/index.js` renders the intro panel + a `<Terminal />`. The terminal owns history state and composes a presentational `BootSequence`, an interactive `CommandBar`, a `commands` registry (pure, content-driven), and hooks for visitor info, boot timing, and reduced-motion. All copy lives in one `data/content.js`.

**Tech Stack:** Next.js 16 (Pages Router), React 19, **Tailwind CSS v4** (via `@tailwindcss/postcss`), `moment`, FontAwesome 7. No animation library.

**Verification note:** This project has no test framework (confirmed in the spec). Pure functions get a throwaway Node assertion; everything else is verified with `yarn build` (must compile clean) and browser dogfooding via the gstack `/browse` skill with screenshots. Each task ends in a commit.

**Styling update (mid-execution decision):** The project is being fully migrated from SCSS modules to **Tailwind CSS v4**. Tailwind is already installed and configured (`postcss.config.mjs`, `styles/globals.css` is the Tailwind entry with custom `@theme` animations `slide-up`, `blink`, `fade-in-up`). All terminal components use Tailwind utility classes inline — there is **no `Terminal.module.scss`** (Task 4 below is superseded). Integration (Task 8) migrates `pages/index.js` to Tailwind, deletes `styles/Home.module.scss` + `styles/Home.module.css`, and removes the now-unused `sass` and `react-device-detect` dependencies.

---

## File Structure

**Create:**
- `data/content.js` — all editable site content (intro, about, work, projects, contact).
- `lib/uaParser.js` — pure `parseUserAgent(ua)` → `{ browser, os }`.
- `lib/commands.js` — command registry + `runCommand(name)` dispatcher.
- `hooks/useVisitorInfo.js` — fetch IP/location (ipwho.is) + parse device.
- `hooks/useBootSequence.js` — drive cascade + typing timing.
- `hooks/usePrefersReducedMotion.js` — reduced-motion media query.
- `components/Terminal/BootSequence.js` — presentational boot lines + typed prompt.
- `components/Terminal/CommandBar.js` — clickable presets + typed input.
- `components/Terminal/Terminal.module.scss` — all terminal styles.

**Modify:**
- `components/Terminal/Terminal.js` — currently empty (0 bytes); becomes the composed terminal.
- `pages/index.js` — refactor to use `content` + `<Terminal />`; remove `getStaticProps`.

**Delete:**
- `components/LeftHome/LeftHome.js` — dead stub (references undefined `me`).

---

## Task 1: Content data file + reduced-motion hook

**Files:**
- Create: `data/content.js`
- Create: `hooks/usePrefersReducedMotion.js`

- [ ] **Step 1: Create `data/content.js`**

```js
// Single source of truth for all site content.
// Edit this file to update the site — no component changes needed.
export const content = {
  alias: 'Chris',
  tagline: ['A Miami Based', 'Creative & Software Engineer'],
  about: [
    "I'm Chris Carrillo — a Miami-based creative and software engineer.",
    'I design and build web apps, brand experiences, and the occasional terminal portfolio.',
  ],
  work: [
    {
      title: 'Senior Software Engineer @ Placeholder Co',
      period: '2023 – present',
      summary: 'Lead frontend for a product used by thousands of users. Replace with real work.',
      link: 'https://example.com',
    },
    {
      title: 'Freelance Developer',
      period: '2020 – 2023',
      summary: 'Built marketing sites and web apps for Miami startups. Replace with real work.',
      link: 'https://example.com',
    },
  ],
  projects: [
    {
      name: 'Terminal Portfolio',
      description: 'This site — an interactive terminal built with Next.js.',
      tech: 'Next.js · React',
      link: 'https://github.com/chrisjcarrillo',
    },
    {
      name: 'Placeholder Project',
      description: 'Short description of a cool thing you built. Replace with a real project.',
      tech: 'React · Node',
      link: 'https://example.com',
    },
  ],
  contact: {
    email: 'chrisjcarrillo@hotmail.com',
    linkedIn: 'https://www.linkedin.com/in/christopherjcarrillo/',
    instagram: 'https://www.instagram.com/chrisjcarrillo/',
    github: 'https://github.com/chrisjcarrillo',
  },
};
```

- [ ] **Step 2: Create `hooks/usePrefersReducedMotion.js`**

```js
import { useEffect, useState } from 'react';

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
```

- [ ] **Step 3: Commit**

```bash
git add data/content.js hooks/usePrefersReducedMotion.js
git commit -m "Add content data file and reduced-motion hook"
```

---

## Task 2: User-agent parser + visitor info hook

**Files:**
- Create: `lib/uaParser.js`
- Create: `hooks/useVisitorInfo.js`

- [ ] **Step 1: Create `lib/uaParser.js`**

```js
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
```

- [ ] **Step 2: Verify the pure function with a throwaway Node check**

Run:
```bash
node --input-type=module -e "
import { parseUserAgent } from './lib/uaParser.js';
const mac = parseUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36');
const win = parseUserAgent('Mozilla/5.0 (Windows NT 10.0) Gecko/20100101 Firefox/121.0');
console.assert(mac.browser==='Chrome' && mac.os==='macOS', 'mac case failed: '+JSON.stringify(mac));
console.assert(win.browser==='Firefox' && win.os==='Windows', 'win case failed: '+JSON.stringify(win));
console.log('uaParser OK', mac, win);
"
```
Expected: prints `uaParser OK { browser: 'Chrome', os: 'macOS' } { browser: 'Firefox', os: 'Windows' }` with no assertion errors.

- [ ] **Step 3: Create `hooks/useVisitorInfo.js`**

```js
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
```

- [ ] **Step 4: Commit**

```bash
git add lib/uaParser.js hooks/useVisitorInfo.js
git commit -m "Add user-agent parser and visitor-info hook"
```

---

## Task 3: Command registry

**Files:**
- Create: `lib/commands.js`

Note: depends on `components/Terminal/Terminal.module.scss` for styling classes; that file is created in Task 4. The import resolves once Task 4 lands. Build verification for this task happens at the end of Task 4.

- [ ] **Step 1: Create `lib/commands.js`**

```js
import { content } from '../data/content';
import styles from '../components/Terminal/Terminal.module.scss';

function Ext({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

// Commands shown as clickable presets (order matters for the UI).
export const PRESET_COMMANDS = ['about me', 'work', 'projects', 'contact'];

const commands = {
  'about me': () => (
    <div>
      {content.about.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  ),
  work: () => (
    <ul className={styles.entries}>
      {content.work.map((w, i) => (
        <li key={i}>
          <span className={styles.entryTitle}>{w.title}</span>{' '}
          <span className={styles.muted}>({w.period})</span>
          <div>{w.summary}</div>
          <Ext href={w.link}>{w.link}</Ext>
        </li>
      ))}
    </ul>
  ),
  projects: () => (
    <ul className={styles.entries}>
      {content.projects.map((p, i) => (
        <li key={i}>
          <span className={styles.entryTitle}>{p.name}</span>{' '}
          <span className={styles.muted}>· {p.tech}</span>
          <div>{p.description}</div>
          <Ext href={p.link}>{p.link}</Ext>
        </li>
      ))}
    </ul>
  ),
  contact: () => {
    const c = content.contact;
    return (
      <ul className={styles.entries}>
        <li>email: <Ext href={`mailto:${c.email}`}>{c.email}</Ext></li>
        <li>linkedin: <Ext href={c.linkedIn}>{c.linkedIn}</Ext></li>
        <li>instagram: <Ext href={c.instagram}>{c.instagram}</Ext></li>
        <li>github: <Ext href={c.github}>{c.github}</Ext></li>
      </ul>
    );
  },
  help: () => (
    <div>available commands: about me · work · projects · contact · help · clear</div>
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
        <span className={styles.error}>command not found: {name} — try &apos;help&apos;</span>
      ),
    };
  }
  return { output: fn() };
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/commands.js
git commit -m "Add terminal command registry and dispatcher"
```

---

## Task 4: Terminal styles (SCSS module)

**Files:**
- Create: `components/Terminal/Terminal.module.scss`

- [ ] **Step 1: Create `components/Terminal/Terminal.module.scss`**

```scss
.cli {
  background: #fff;
  flex: 1 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #000;
  border-radius: 4px;
  overflow: hidden;
}

.cliHeader {
  background: #000;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
}

.dotContainer {
  display: flex;
  gap: 10px;
  flex: 0 0 auto;
}

.dot {
  height: 12px;
  width: 12px;
  background: #fff;
  border-radius: 50%;
  display: inline-block;
}

.ipContainer {
  flex: 1;
  text-align: center;
  font-size: 0.95rem;
}

.cliBody {
  background: #fff;
  color: #000;
  padding: 0.75rem 1rem;
  max-height: 60vh;
  overflow-y: auto;
}

/* boot sequence */
.boot {
  display: flex;
  flex-direction: column;
}

.infoLine {
  display: block;
  font-size: 0.95rem;
  line-height: 1.7;
}

.hidden {
  opacity: 0;
}

.show {
  opacity: 1;
  animation: slideUp 0.35s ease both;
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.promptLine {
  display: block;
  font-weight: 700;
  margin-top: 0.4rem;
  min-height: 1.4em;
}

.cursor {
  display: inline-block;
  width: 8px;
  height: 1em;
  background: #000;
  vertical-align: -2px;
  margin-left: 2px;
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

/* command history */
.entry {
  margin-top: 0.6rem;
}

.cmdEcho {
  font-weight: 700;
}

.dollar {
  font-weight: 700;
}

.output {
  margin: 0.2rem 0 0.2rem 0;

  a { text-decoration: underline; word-break: break-all; }
  p { margin: 0.2rem 0; }
}

.entries {
  list-style: none;
  margin: 0;
  padding: 0;

  li { margin-bottom: 0.6rem; }
}

.entryTitle { font-weight: 700; }
.muted { color: #555; }
.error { color: #000; font-style: italic; }

/* command bar */
.commandBar {
  margin-top: 0.8rem;
}

.presets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin-bottom: 0.5rem;
}

.presetBtn {
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
  color: #000;
}

.presetBtn:hover { background: #000; color: #fff; text-decoration: none; }

.inputLine {
  display: flex;
  align-items: center;
}

.input {
  font-family: inherit;
  font-size: 0.95rem;
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  color: #000;
  margin-left: 0.3rem;
}

@media only screen and (max-width: 414px) {
  .cliBody { max-height: 50vh; font-size: 0.85rem; }
  .ipContainer { font-size: 0.7rem; }
  .presetBtn { padding: 0.3rem 0; }
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Terminal/Terminal.module.scss
git commit -m "Add terminal SCSS module"
```

---

## Task 5: BootSequence component + boot hook

**Files:**
- Create: `hooks/useBootSequence.js`
- Create: `components/Terminal/BootSequence.js`

- [ ] **Step 1: Create `hooks/useBootSequence.js`**

```js
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
```

- [ ] **Step 2: Create `components/Terminal/BootSequence.js`**

```js
import styles from './Terminal.module.scss';

// Presentational. Renders the cascading info lines and the typed prompt line.
// `infoLines`: [{ label, value }]; `visibleCount`, `typed`, `typingDone` come
// from useBootSequence (owned by the parent Terminal).
export default function BootSequence({ infoLines, visibleCount, typed, typingDone }) {
  return (
    <div className={styles.boot}>
      {infoLines.map((line, i) => (
        <span
          key={line.label}
          className={`${styles.infoLine} ${i < visibleCount ? styles.show : styles.hidden}`}
        >
          {line.label}: {line.value}
        </span>
      ))}
      <span className={styles.promptLine}>
        {typed}
        {!typingDone && <span className={styles.cursor} />}
      </span>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add hooks/useBootSequence.js components/Terminal/BootSequence.js
git commit -m "Add boot sequence hook and component"
```

---

## Task 6: CommandBar component

**Files:**
- Create: `components/Terminal/CommandBar.js`

- [ ] **Step 1: Create `components/Terminal/CommandBar.js`**

```js
import { useState } from 'react';
import styles from './Terminal.module.scss';
import { PRESET_COMMANDS } from '../../lib/commands';

// Clickable preset commands (primary path for clients) + a typed input (secondary).
// Both call onRun(commandString).
export default function CommandBar({ onRun }) {
  const [value, setValue] = useState('');

  function submit(e) {
    e.preventDefault();
    const cmd = value.trim();
    if (cmd) {
      onRun(cmd);
      setValue('');
    }
  }

  return (
    <div className={styles.commandBar}>
      <div className={styles.presets}>
        {PRESET_COMMANDS.map((cmd) => (
          <button key={cmd} type="button" className={styles.presetBtn} onClick={() => onRun(cmd)}>
            $ {cmd}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className={styles.inputLine}>
        <span className={styles.dollar}>$</span>
        <input
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
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

- [ ] **Step 2: Commit**

```bash
git add components/Terminal/CommandBar.js
git commit -m "Add command bar (clickable presets + typed input)"
```

---

## Task 7: Terminal composition

**Files:**
- Modify: `components/Terminal/Terminal.js` (currently empty)

- [ ] **Step 1: Write `components/Terminal/Terminal.js`**

```js
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import styles from './Terminal.module.scss';
import BootSequence from './BootSequence';
import CommandBar from './CommandBar';
import { useVisitorInfo } from '../../hooks/useVisitorInfo';
import { useBootSequence } from '../../hooks/useBootSequence';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { runCommand } from '../../lib/commands';

const PROMPT_TEXT = '$ available commands:';

export default function Terminal() {
  const reduced = usePrefersReducedMotion();
  const visitor = useVisitorInfo();

  // Compute last-login on the client to avoid SSR/CSR hydration mismatch.
  const [lastLogin, setLastLogin] = useState('…');
  useEffect(() => {
    setLastLogin(moment().format('dddd, MMMM Do YYYY, h:mm A'));
  }, []);

  const infoLines = [
    { label: 'last login', value: lastLogin },
    { label: 'current ip', value: visitor.ip },
    { label: 'current location', value: visitor.location },
    { label: 'device', value: visitor.device },
  ];

  const { visibleCount, typed, done } = useBootSequence(infoLines.length, PROMPT_TEXT, { reduced });

  const [history, setHistory] = useState([]);
  const idRef = useRef(0);
  const bottomRef = useRef(null);

  function handleRun(cmd) {
    const result = runCommand(cmd);
    if (result.clear) {
      setHistory([]);
      return;
    }
    idRef.current += 1;
    setHistory((h) => [...h, { id: idRef.current, command: cmd, output: result.output }]);
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [history, done]);

  return (
    <div className={styles.cli}>
      <header className={styles.cliHeader}>
        <span className={styles.dotContainer}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </span>
        <span className={styles.ipContainer}>Current IP: {visitor.ip}</span>
        <span style={{ width: '34px' }} />
      </header>

      <div className={styles.cliBody}>
        <BootSequence
          infoLines={infoLines}
          visibleCount={visibleCount}
          typed={typed}
          typingDone={done}
        />

        {done &&
          history.map((entry) => (
            <div key={entry.id} className={styles.entry}>
              <div className={styles.cmdEcho}>
                <span className={styles.dollar}>$ </span>
                {entry.command}
              </div>
              <div className={styles.output}>{entry.output}</div>
            </div>
          ))}

        {done && <CommandBar onRun={handleRun} />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Terminal/Terminal.js
git commit -m "Compose interactive Terminal component"
```

---

## Task 8: Refactor index.js + remove dead code

**Files:**
- Modify: `pages/index.js`
- Delete: `components/LeftHome/LeftHome.js`

- [ ] **Step 1: Replace `pages/index.js` entirely**

```js
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../styles/Home.module.scss';
import { content } from '../data/content';
import Terminal from '../components/Terminal/Terminal';

export default function Home() {
  const c = content.contact;

  return (
    <div className={styles.container}>
      <Head>
        <title>Chris Carrillo — Creative &amp; Software Engineer</title>
        <meta name="description" content="Chris Carrillo — a Miami-based creative and software engineer." />
      </Head>

      <div
        className={`${styles.inner_main_right} ${styles.animated} ${styles.animatedFadeInUp} ${styles.fadeInUp}`}
      >
        <div className={styles.inner}>
          <h1 className={styles.hello_world}>Hello World!</h1>
          <h1 className={styles.greeting}>I&apos;m {content.alias}.</h1>
          <div className={styles.label_container}>
            <h1 className={styles.label}>
              {content.tagline[0]} <br /> {content.tagline[1]}
            </h1>
          </div>
          <div className={styles.icon_container}>
            <a href={c.linkedIn} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={['fab', 'linkedin-in']} size="2x" />
            </a>
            <a href={c.instagram} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={['fab', 'instagram']} size="2x" />
            </a>
            <a href={c.github} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={['fab', 'github']} size="2x" />
            </a>
          </div>
        </div>

        <div className={styles.inner}>
          <Terminal />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Delete the dead stub**

Run:
```bash
git rm components/LeftHome/LeftHome.js
```

- [ ] **Step 3: Verify the whole app builds**

Run: `yarn build`
Expected: `✓ Compiled successfully`, all pages generated, no type/lint errors. (The build-time external fetch is gone, so no network dependency.)

- [ ] **Step 4: Commit**

```bash
git add pages/index.js
git commit -m "Wire up Terminal in index, remove getStaticProps and dead LeftHome stub"
```

---

## Task 9: Browser verification + screenshots

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `yarn dev` (in background) and confirm it serves http://localhost:3000 with HTTP 200.

- [ ] **Step 2: Dogfood with the gstack `/browse` skill**

Verify each item, capturing screenshots:
- Boot animation: info lines cascade, then `$ available commands:` types out with a blinking cursor (~1.2s total).
- `current ip` / `current location` / `device` populate with real values (or `—` if the geo API is blocked — must not hang or crash).
- Clicking each preset (`about me`, `work`, `projects`, `contact`) prints its output below; output links are clickable and open in a new tab.
- Typing `help` + Enter prints the command list; typing `clear` + Enter empties history; typing a bogus command prints `command not found`.
- Terminal scrolls internally and auto-scrolls to newest output as history grows.
- Mobile layout (responsive check at ~390px): intro stacks above terminal; presets are tappable.
- Reduced-motion: with `prefers-reduced-motion: reduce`, content appears instantly (no animation).

- [ ] **Step 3: Capture before/after screenshots and stop the dev server**

- [ ] **Step 4: Commit any fixes found during dogfooding**

```bash
git add -A
git commit -m "Fix issues found during terminal dogfooding"
```

---

## Self-Review

**Spec coverage:**
- Interaction model (clickable + typed, history, help/clear, unknown cmd) → Tasks 3, 6, 7. ✓
- Boot animation (hybrid, reduced-motion) → Tasks 1, 5, 7. ✓
- Content/data model (single `data/content.js`, `commands` registry) → Tasks 1, 3. ✓
- Live visitor data (ipwho.is + UA parse, graceful degradation) → Task 2. ✓
- Layout & responsive → Task 4 (SCSS), Task 8 (markup). ✓
- Component architecture (Terminal/CommandBar/BootSequence + hooks) → Tasks 5–7. ✓
- Error handling (geo timeout/fallback, unknown command, no build-time fetch) → Tasks 2, 3, 8. ✓
- Testing/verification (build + browser) → Tasks 2, 8, 9. ✓
- Cleanup of dead stubs → Task 8 (LeftHome deleted; empty Terminal.js overwritten in Task 7). ✓

**Placeholder scan:** Content placeholders in `data/content.js` are intentional and clearly labeled "Replace with real…". No TBD/TODO in plan steps; every code step shows complete code. ✓

**Type/name consistency:** `runCommand` returns `{ clear }` / `{ output }` (Task 3) — consumed exactly that way in Terminal (Task 7). `PRESET_COMMANDS` exported in Task 3, imported in Task 6. `useBootSequence(count, text, { reduced })` → `{ visibleCount, typed, done }` defined in Task 5, used in Task 7. `BootSequence` props (`infoLines`, `visibleCount`, `typed`, `typingDone`) match between Tasks 5 and 7. SCSS class names referenced in Tasks 3/5/6/7 are all defined in Task 4. ✓
