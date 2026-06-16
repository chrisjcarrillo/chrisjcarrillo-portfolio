# Full-Terminal Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the split layout into a single full-screen terminal whose boot output contains an ASCII name banner, tagline, live visitor info, and a row of social icons — everything from the old left panel now lives inside the terminal.

**Architecture:** `pages/index.js` becomes a near-full-viewport shell rendering `<Terminal />`. A new presentational `Banner` component (ASCII art + tagline + FontAwesome social row) renders at the top of `BootSequence`, above the existing cascading info lines and typed prompt. Content/ASCII strings live in `data/content.js`.

**Tech Stack:** Next.js 16 (Pages Router), React 19, Tailwind v4, FontAwesome 7. No new dependencies.

**Verification note:** No test framework (per spec). Verify with `yarn build` (must compile clean) and, if enabled, browser dogfooding via `/browse`. Each task ends in a commit.

**Builds on spec:** `docs/superpowers/specs/2026-06-16-full-terminal-portfolio-design.md`

---

## File Structure

**Modify:**
- `data/content.js` — add `name`, `bannerFull`, `bannerShort` exports.
- `lib/commands.js` — rename command `about me` → `about` (registry + `PRESET_COMMANDS`).
- `components/Terminal/BootSequence.js` — render `<Banner />` at the top.
- `components/Terminal/Terminal.js` — full-height sizing + header title `chris@portfolio: ~`.
- `pages/index.js` — near-full-viewport shell; remove the old intro/icons markup.

**Create:**
- `components/Terminal/Banner.js` — ASCII banner (responsive) + tagline + social icon row.

---

## Task 1: Add name + ASCII banners to content

**Files:**
- Modify: `data/content.js`

- [ ] **Step 1: Add `name`, `bannerFull`, and `bannerShort` to `data/content.js`**

Add a `name` field to the existing object (next to `alias`), and append the two banner exports AFTER the `content` object. **CRITICAL:** the ASCII lines inside the template literals must start at column 0 (no source indentation) — template literals preserve all whitespace.

Add `name: 'Chris Carrillo',` immediately after the `alias: 'Chris',` line.

Then append to the end of the file:

```js
// ANSI Shadow figlet — "CHRIS CARRILLO". Lines must stay un-indented.
export const bannerFull = `
 ██████╗██╗  ██╗██████╗ ██╗███████╗     ██████╗ █████╗ ██████╗ ██████╗ ██╗██╗     ██╗      ██████╗
██╔════╝██║  ██║██╔══██╗██║██╔════╝    ██╔════╝██╔══██╗██╔══██╗██╔══██╗██║██║     ██║     ██╔═══██╗
██║     ███████║██████╔╝██║███████╗    ██║     ███████║██████╔╝██████╔╝██║██║     ██║     ██║   ██║
██║     ██╔══██║██╔══██╗██║╚════██║    ██║     ██╔══██║██╔══██╗██╔══██╗██║██║     ██║     ██║   ██║
╚██████╗██║  ██║██║  ██║██║███████║    ╚██████╗██║  ██║██║  ██║██║  ██║██║███████╗███████╗╚██████╔╝
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝     ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝ ╚═════╝
`;

// ANSI Shadow figlet — "CHRIS" (mobile). Lines must stay un-indented.
export const bannerShort = `
 ██████╗██╗  ██╗██████╗ ██╗███████╗
██╔════╝██║  ██║██╔══██╗██║██╔════╝
██║     ███████║██████╔╝██║███████╗
██║     ██╔══██║██╔══██╗██║╚════██║
╚██████╗██║  ██║██║  ██║██║███████║
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝
`;
```

- [ ] **Step 2: Verify the file still parses**

Run:
```bash
node --input-type=module -e "import('./data/content.js').then(m => { console.log('name:', m.content.name); console.log('full lines:', m.bannerFull.trim().split('\n').length); console.log('short lines:', m.bannerShort.trim().split('\n').length); })"
```
Expected: `name: Chris Carrillo`, `full lines: 6`, `short lines: 6`.

- [ ] **Step 3: Commit**

```bash
git add data/content.js
git commit -m "Add name and ASCII name banners to content"
```

---

## Task 2: Create the Banner component

**Files:**
- Create: `components/Terminal/Banner.js`

- [ ] **Step 1: Create `components/Terminal/Banner.js`**

```js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { content, bannerFull, bannerShort } from '../../data/content';

// The static "identity" header of the terminal: ASCII name banner (responsive),
// tagline, and the social-icon row. Fades in as a unit (motion-safe only).
export default function Banner() {
  const c = content.contact;

  return (
    <div className="motion-safe:animate-fade-in-up">
      {/* Full name — desktop/tablet */}
      <pre
        aria-label={content.name}
        className="hidden md:block whitespace-pre overflow-x-auto font-bold leading-none text-[7px] lg:text-[9px]"
      >
        {bannerFull.replace(/^\n/, '')}
      </pre>

      {/* First name — mobile */}
      <pre
        aria-label={content.name}
        className="md:hidden whitespace-pre overflow-x-auto font-bold leading-none text-[10px]"
      >
        {bannerShort.replace(/^\n/, '')}
      </pre>

      <div className="mt-3 text-sm md:text-base">
        <span className="md:hidden font-bold">{content.name} — </span>
        {content.tagline.join(' ')}
      </div>

      <div className="flex gap-6 mt-4">
        <a href={c.linkedIn} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FontAwesomeIcon icon={['fab', 'linkedin-in']} size="lg" />
        </a>
        <a href={c.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <FontAwesomeIcon icon={['fab', 'instagram']} size="lg" />
        </a>
        <a href={c.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FontAwesomeIcon icon={['fab', 'github']} size="lg" />
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Terminal/Banner.js
git commit -m "Add Banner component (responsive ASCII + tagline + social row)"
```

---

## Task 3: Render Banner at the top of BootSequence

**Files:**
- Modify: `components/Terminal/BootSequence.js`

- [ ] **Step 1: Replace `components/Terminal/BootSequence.js` entirely**

```js
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
            <span className="inline-block w-2 h-[1em] bg-black align-[-2px] ml-0.5 animate-blink" />
          )}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Terminal/BootSequence.js
git commit -m "Render Banner at top of boot sequence"
```

---

## Task 4: Full-screen terminal + header title + command rename

**Files:**
- Modify: `lib/commands.js`
- Modify: `components/Terminal/Terminal.js`
- Modify: `pages/index.js`

- [ ] **Step 1: Rename `about me` → `about` in `lib/commands.js`**

Change the `PRESET_COMMANDS` line from:
```js
export const PRESET_COMMANDS = ['about me', 'work', 'projects', 'contact'];
```
to:
```js
export const PRESET_COMMANDS = ['about', 'work', 'projects', 'contact'];
```

Change the command registry key from:
```js
  'about me': () => (
```
to:
```js
  about: () => (
```

And update the `help` output line from:
```js
    <div>available commands: about me · work · projects · contact · help · clear</div>
```
to:
```js
    <div>available commands: about · work · projects · contact · help · clear</div>
```

- [ ] **Step 2: Update header title + full-height sizing in `components/Terminal/Terminal.js`**

Replace the outer wrapper `<div>` opening tag:
```js
    <div className="w-full bg-white border border-black rounded overflow-hidden">
```
with:
```js
    <div className="w-full h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] flex flex-col bg-white border border-black rounded overflow-hidden">
```

Replace the header title span:
```js
        <span className="flex-1 text-center text-sm">Current IP: {visitor.ip}</span>
```
with:
```js
        <span className="flex-1 text-center text-sm">chris@portfolio: ~</span>
```

Replace the body `<div>` opening tag:
```js
      <div className="bg-white text-black px-4 py-3 max-h-[60vh] overflow-y-auto">
```
with:
```js
      <div className="flex-1 min-h-0 bg-white text-black px-4 py-3 overflow-y-auto">
```

(Leave the rest of `Terminal.js` — hooks, history, BootSequence, CommandBar, refs — unchanged.)

- [ ] **Step 3: Replace `pages/index.js` entirely**

```js
import Head from 'next/head';
import Terminal from '../components/Terminal/Terminal';

export default function Home() {
  return (
    <div className="min-h-screen p-4 md:p-6 font-mono">
      <Head>
        <title>Chris Carrillo — Creative &amp; Software Engineer</title>
        <meta
          name="description"
          content="Chris Carrillo — a Miami-based creative and software engineer."
        />
      </Head>

      <Terminal />
    </div>
  );
}
```

- [ ] **Step 4: Build the whole app**

Run: `yarn build`
Expected: `✓ Compiled successfully`, all pages generated, no errors. (No build-time network fetch exists, so the build is deterministic.)

- [ ] **Step 5: Commit**

```bash
git add lib/commands.js components/Terminal/Terminal.js pages/index.js
git commit -m "Full-screen terminal shell, header title, about command rename"
```

---

## Task 5: Browser verification

**Files:** none (verification only)

- [ ] **Step 1: Start dev server** — `yarn dev`, confirm http://localhost:3000 returns 200.

- [ ] **Step 2: Dogfood with `/browse`** (capture screenshots):
- Full-screen terminal fills the viewport; header reads `chris@portfolio: ~`.
- ASCII "CHRIS CARRILLO" banner renders cleanly (no wrapping/misalignment) and fades in.
- Tagline + LinkedIn/Instagram/GitHub icons show as a row; icons link out in a new tab.
- Boot order correct: banner/icons → info lines cascade → prompt types → commands appear.
- Live `current ip` / `current location` / `device` populate (GeoJS).
- Commands work clicked and typed; `about` (renamed) prints; `help`/`clear` work; unknown → not found.
- Mobile (~390px): shows the shorter "CHRIS" banner with full name in the tagline line; no horizontal page overflow.
- Reduced-motion: content appears without animation.

- [ ] **Step 3: Stop dev server; commit any fixes found.**

```bash
git add -A
git commit -m "Fix issues found during full-terminal dogfooding"
```

---

## Self-Review

**Spec coverage:**
- Single full-screen terminal, no split → Task 4 (Terminal sizing + index shell). ✓
- ASCII banner "CHRIS CARRILLO" (ANSI Shadow), fade not typed → Tasks 1, 2 (`motion-safe:animate-fade-in-up`, rendered as a unit). ✓
- Tagline + social icons inside terminal, icons as a persistent row → Task 2 (Banner). ✓
- Boot order banner → info cascade → typed prompt → commands → Task 3. ✓
- Header title `chris@portfolio: ~` → Task 4. ✓
- Responsive: full name desktop / "CHRIS" mobile + full name in tagline; overflow guard → Tasks 1, 2 (`hidden md:block` / `md:hidden`, `overflow-x-auto`). ✓
- `about me` → `about` rename → Task 4 Step 1. ✓
- Live data / clickable+typeable commands / inline output preserved → unchanged Terminal/commands. ✓
- Black-on-white theme kept → no color changes. ✓

**Placeholder scan:** ASCII art is included verbatim (real content, not a placeholder). No TBD/TODO; every code step shows complete code or an exact find/replace. ✓

**Type/name consistency:** `bannerFull`/`bannerShort`/`content.name` defined in Task 1, consumed in Task 2. `Banner` default export (Task 2) imported in Task 3. `PRESET_COMMANDS` rename (Task 4) flows to `CommandBar` automatically. Terminal's `visitor.ip` still used in `infoLines` (only the header title changed, not the hook). ✓
