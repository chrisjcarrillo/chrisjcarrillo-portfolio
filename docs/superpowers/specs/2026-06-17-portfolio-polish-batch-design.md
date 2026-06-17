# Portfolio Polish Batch — Design Spec

**Date:** 2026-06-17
**Status:** Approved (pending spec review)
**Author:** Chris Carrillo (with Claude)
**Builds on:** [2026-06-16-full-terminal-portfolio-design.md](./2026-06-16-full-terminal-portfolio-design.md)

## Summary

Four independent enhancements to the full-terminal portfolio, batched into one
cohesive "polish" release: (1) a CRT/hacker theme toggle, (2) command history +
tab autocomplete + easter-egg commands, (3) social share preview (OG image) +
favicon, and (4) richer `work`/`projects` output plus a `resume` command. All four
share the existing terminal architecture and fit a single implementation plan.

## Feature 1 — CRT / Hacker Theme Toggle

**Behavior:** Default theme stays the current **white/black**. A `theme` command
toggles a **green-on-near-black CRT** mode (green `~#00ff66` on `~#0a0a0a`, subtle
scanlines + soft text-shadow glow). The choice **persists** in `localStorage` and
is applied **before first paint** (no flash).

**Implementation:**
- Replace hardcoded terminal colors (`bg-white`, `text-black`, `border-black`,
  header `bg-black text-white`) with CSS custom properties defined in
  `styles/globals.css`:
  - `--term-bg`, `--term-fg`, `--term-border`, `--term-header-bg`,
    `--term-header-fg`, `--term-accent`.
  - Default (`:root`) = white/black palette matching today.
  - `[data-theme="crt"]` override block = green-on-near-black palette.
- CRT extras live under `[data-theme="crt"]`: a scanline overlay (faint
  `repeating-linear-gradient`) on the terminal body and a `text-shadow` glow.
  Scanlines must be subtle and must not hurt readability.
- `hooks/useTheme.js`: reads/writes `localStorage` key `theme` (`"light"` |
  `"crt"`), applies `document.documentElement.dataset.theme`, exposes
  `{ theme, toggleTheme }`.
- `pages/_document.js`: a small inline script in `<Head>` that reads
  `localStorage.theme` and sets `data-theme` on `<html>` before paint (guarded in
  try/catch; defaults to light).
- The `theme` command is handled like `clear`: `runCommand('theme')` returns
  `{ theme: true }`; `Terminal` calls `toggleTheme()` and prints an echo +
  `theme switched to <crt|light>`.

Components reference the tokens via Tailwind arbitrary values, e.g.
`bg-[var(--term-bg)] text-[var(--term-fg)] border-[var(--term-border)]`.

## Feature 2 — History + Autocomplete + Easter Eggs

- **Command history:** `Terminal` keeps a `commandHistory` array of entered command
  strings that is **not** cleared by `clear` (real-shell behavior). Passed to
  `CommandBar`. `CommandBar` handles **↑/↓** to walk history into the input.
- **Tab autocomplete:** on `Tab` (preventDefault), complete the current input
  against the list of known command names; if multiple match, repeated `Tab`
  cycles through them. Completion source: the public commands
  (`about, work, projects, contact, resume, theme, help, clear`).
- **Easter-egg commands** added to the `commands` registry, **hidden from `help`**:
  - `whoami` → `chris`
  - `pwd` → `/home/chris/portfolio`
  - `ls` → `about  work  projects  contact  resume.pdf`
  - `date` → current date/time (computed at run time)
  - `echo <text>` → prints the argument text
  - `sudo` (and `sudo <anything>`) → cheeky denial, e.g. `nice try — you're not chris`
  - `rm -rf /` (and any `rm ...`) → joke: read-only terminal
  - `matrix` → a few static rows of green katakana-style characters (no animation)
  - Unknown command still → friendly `command not found: <x> — try 'help'`

`echo`, `sudo`, `rm` take arguments, so `runCommand` must match on the **first
token** for those while keeping exact-match for the others.

## Feature 3 — Social Share Preview + Favicon

- **Favicon:** `public/favicon.svg` — a simple terminal `>_` glyph (black bg, white
  or green mark). Linked via `<link rel="icon" href="/favicon.svg">` in the head.
- **OG image:** `pages/api/og.js` using Next's built-in `next/og` `ImageResponse`
  (no new dependency). Renders a 1200×630 terminal-styled card: dark window with a
  title bar, `chris@portfolio:~`, "CHRIS CARRILLO", the tagline, and a `$ _` prompt.
  Uses the default font (custom mono font fetch is explicitly out of scope for v1).
- **Meta tags** in `pages/index.js` `<Head>`: `og:title`, `og:description`,
  `og:type=website`, `og:url=https://chrisjcarrillo.dev`, `og:image` (absolute URL
  `https://chrisjcarrillo.dev/api/og`, width 1200, height 630), `twitter:card=
  summary_large_image`, `twitter:image`.

## Feature 4 — Richer Projects/Work + Resume

- **Output formatting** in `lib/commands.js`: `work` and `projects` get bold titles,
  a muted meta line, **stack tags rendered as chips** (e.g. `[Next.js] [React]`),
  and real links. `data/content.js` `projects[]` gains a `tags` array (string[]);
  `work[]` keeps `title/period/summary/link`. (Existing single `tech` string on
  projects is replaced by `tags`.)
- **`resume` command:** opens `/resume.pdf` in a new tab and prints a note; handled
  like an action (`runCommand('resume')` returns `{ openUrl: '/resume.pdf' }`;
  `Terminal` opens it via `window.open` and prints output). Until a real
  `public/resume.pdf` exists this 404s gracefully — no code change needed when the
  file is added. `resume` is added to `PRESET_COMMANDS` (clickable row), to `help`,
  and to the `ls` listing. `data/content.js` stores `resumeUrl: '/resume.pdf'`.

## Architecture / Files

**New**
- `hooks/useTheme.js` — theme state, persistence, applies `data-theme`.
- `pages/_document.js` — pre-paint theme script + document scaffolding.
- `pages/api/og.js` — `next/og` OG image route.
- `public/favicon.svg` — terminal `>_` favicon.

**Modify**
- `styles/globals.css` — theme tokens (`:root` + `[data-theme="crt"]`), scanline +
  glow.
- `lib/commands.js` — easter eggs, `theme`/`resume` action markers, first-token
  matching for arg commands, richer `work`/`projects` output, `resume`, updated
  `help`, `PRESET_COMMANDS` += `resume`.
- `components/Terminal/Terminal.js` — `useTheme`; handle `{theme}`/`{openUrl}`
  results; token-based colors; track `commandHistory`; pass it to `CommandBar`.
- `components/Terminal/CommandBar.js` — ↑/↓ history + Tab autocomplete; token colors.
- `components/Terminal/Banner.js`, `BootSequence.js` — token-based colors (accent
  for prompt/cursor).
- `data/content.js` — `resumeUrl`, `projects[].tags`.
- `pages/index.js` (or `pages/_app.js`) — favicon link + OG/Twitter meta.

Each unit keeps one responsibility: `useTheme` = theme; `commands` = pure registry
(+ action markers consumed by Terminal); `CommandBar` = input/history/autocomplete;
`Terminal` = orchestration/state.

## Error Handling

- Theme: `localStorage`/`matchMedia` access wrapped in try/catch; defaults to light.
- Autocomplete/history: no-ops on empty input / empty history; never throw.
- `resume`: `window.open` of a possibly-missing file 404s in the browser tab only;
  the app does not error.
- OG route: pure render of static-ish content; if it errors, the page still works
  (the preview just won't render) — no impact on the site itself.
- Easter eggs / unknown commands: friendly messages, never throw.

## Testing / Verification

No test framework (consistent with prior specs). Verify via:
- `yarn build` compiles clean.
- Browser dogfood (if enabled): `theme` toggles + persists across reload with no
  flash; ↑/↓ history and Tab autocomplete work; easter eggs respond; `resume` opens
  the tab; `/api/og` returns a 1200×630 image; favicon shows; OG meta present in
  page source; CRT theme readable on desktop + mobile.

## Rollout

Feature branch off `main`, built incrementally per the implementation plan,
reviewed, merged to `main`.

## Out of Scope (YAGNI)

Animated Matrix background (static rows only), typing sounds, custom OG font fetch,
analytics, amber theme variant.
