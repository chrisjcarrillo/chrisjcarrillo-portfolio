# Full-Terminal Portfolio — Design Spec

**Date:** 2026-06-16
**Status:** Approved (pending spec review)
**Author:** Chris Carrillo (with Claude)
**Builds on:** [2026-06-16-interactive-terminal-portfolio-design.md](./2026-06-16-interactive-terminal-portfolio-design.md)

## Summary

Evolve the current split layout (left intro panel + right terminal) into a **single
full-screen terminal**. Everything from the left panel — the name, tagline, and
social icons — moves *inside* the terminal as part of its boot output, rendered with
an ASCII-art name banner. The goal is to make the portfolio read as a real shell
session rather than a styled card beside some text.

## Goals

- One full-screen terminal; no split layout.
- Name shown as an **ASCII-art banner** ("CHRIS CARRILLO", ANSI Shadow style).
- All former left-panel content lives in the terminal: tagline + social icons.
- Social icons remain real FontAwesome icons (LinkedIn, Instagram, GitHub),
  displayed as a persistent **row** (not hidden behind a command).
- Preserve everything that already works: live IP/location/device, clickable +
  typeable commands, inline output, boot animation, graceful degradation.
- Stay responsive — the wide ASCII banner must not break small screens.

## Non-Goals (out of scope)

- Dark mode / theme toggle.
- Routed sub-pages.
- Command history (up-arrow) or tab-completion.
- Any backend/CMS.

## Layout

- The terminal fills the viewport with a small uniform margin around it
  (e.g. centered, `min-h-screen`, modest padding). No second column.
- Header bar: three dots (left) + centered window title `chris@portfolio: ~`.
- Body is the scrollable shell content, capped to the viewport height so long
  command output scrolls inside the terminal.

## Boot Sequence (order, top to bottom)

1. **ASCII banner** — "CHRIS CARRILLO" in ANSI Shadow. Rendered as a unit with a
   quick fade-in (NOT typed char-by-char — block art types poorly). 6 lines.
2. **Tagline** — `a miami based creative & software engineer`.
3. **Boot info lines** — cascade in (slide-up, ~150ms apart): `last login`,
   `current ip`, `current location`, `device`. Live values from the existing
   `useVisitorInfo` (GeoJS) hook.
4. **Social icons row** — FontAwesome LinkedIn / Instagram / GitHub, always
   visible, links open in a new tab.
5. **Prompt** — `$ available commands:` types out with a blinking cursor, then the
   clickable command list + typed input become available.

The existing hybrid timing model is preserved: banner + icons settle in, info
lines cascade, prompt types. `prefers-reduced-motion` shows everything instantly.

## Commands & Interaction (behavior unchanged)

- Commands: `about`, `work`, `projects`, `contact`, `help`, `clear`.
  - **Change:** rename the existing `about me` command to `about` for a cleaner CLI.
- Clickable preset buttons (primary) + typed input (secondary); both run a command.
- Running a command echoes `$ cmd` and prints output below; history stacks;
  terminal auto-scrolls to newest. Unknown command → friendly `command not found`.
- Output links are real `<a target="_blank" rel="noopener noreferrer">`.

## Responsive

The full-name ANSI banner is ~98 columns — too wide for phones. Solution:

- **Desktop/tablet (≥ md):** show the full "CHRIS CARRILLO" banner.
- **Mobile (< md):** show a shorter "CHRIS" ANSI banner instead; the full name
  appears as text in the tagline line so it isn't lost.
- Both ASCII strings are stored in `data/content.js`. The breakpoint swap is done
  with utility classes (`hidden md:block` / `md:hidden`).
- The banner `<pre>` uses a small, fixed font size with `overflow-x: auto` as a
  final safety net so it never forces the page wider than the viewport.
- Command list wraps; terminal body scrolls internally.

## Theme

Keep the existing black-on-white aesthetic: white terminal body, black header bar,
Roboto Mono. (Dark mode is a clean future enhancement, explicitly out of scope.)

## Component Architecture

Current files: `pages/index.js`, `components/Terminal/{Terminal,BootSequence,CommandBar}.js`,
`lib/{commands,uaParser,formatDate}.js`, `hooks/{useVisitorInfo,useBootSequence,usePrefersReducedMotion}.js`,
`data/content.js`.

Changes:

- **`pages/index.js`** — shrinks to a full-screen shell that renders `<Terminal />`
  centered in the viewport. All intro JSX and the social-icon markup are removed
  from here (they move into the terminal). No `getStaticProps`.
- **`data/content.js`** — add `bannerFull` (ASCII "CHRIS CARRILLO") and
  `bannerShort` (ASCII "CHRIS") strings; keep `alias`, `tagline`, `contact`, etc.
- **`components/Terminal/Banner.js`** *(new)* — presentational: renders the
  responsive ASCII banner (`<pre>`), the tagline, and the social-icon row
  (FontAwesome). One clear responsibility: the static "identity" header of the
  terminal. Depends on `content` + FontAwesome.
- **`components/Terminal/BootSequence.js`** — extended to render `<Banner />` at the
  top, before the cascading info lines and typed prompt. Banner/tagline/icons show
  immediately (fade); info lines + prompt keep their cascade/typed timing.
- **`components/Terminal/Terminal.js`** — unchanged responsibilities (owns history,
  boot/visitor hooks); now sized to fill the viewport. Header title becomes
  `chris@portfolio: ~`.
- **`lib/commands.js`** — rename `about me` → `about` in the registry and
  `PRESET_COMMANDS`.
- **`components/Terminal/CommandBar.js`** — picks up the renamed preset
  automatically via `PRESET_COMMANDS`.

Each unit stays small and single-purpose: `Banner` = identity header, `BootSequence`
= boot orchestration/animation, `CommandBar` = input, `commands` = pure output
registry.

## Error Handling

- Live data: unchanged — GeoJS fetch with `r.ok` check, 5s timeout, fallback `—`.
- Unknown command: friendly message, no throw.
- ASCII banner: pure static strings — no runtime failure surface. The mobile swap
  and `overflow-x` guard prevent layout breakage.

## Testing / Verification

No test framework (consistent with prior spec). Verify via:

- `yarn build` compiles clean.
- Browser dogfood (if enabled): banner renders correctly desktop + mobile, icons
  clickable, boot animation order correct, commands work, live data populates,
  reduced-motion path, no horizontal overflow on phones.

## Rollout

Feature branch off `main`, built incrementally per the implementation plan,
verified, merged to `main`.
