# Interactive Terminal Portfolio — Design Spec

**Date:** 2026-06-16
**Status:** Approved (pending spec review)
**Author:** Chris Carrillo (with Claude)

## Summary

Turn the existing static, terminal-*styled* landing page into a real, interactive
terminal portfolio. The right-hand panel becomes a working shell session: it boots
with an animation, prints live visitor data, and responds to preset commands
(`about me`, `work`, `projects`, `contact`, plus `help`/`clear`). Commands are
**clickable** (primary, for clients) and **typeable** (secondary, for tinkerers).
This is a **client-facing** showcase, so curated `work`/`projects` content is the
priority and must be prominent and easy to update.

## Goals

- Make the page actually functional — no more `TEXT`/`text` placeholders.
- Commit fully to the terminal concept: running a command prints output inline,
  like a real shell session.
- Show the visitor their own IP, approximate location, and device (the "I see you"
  terminal touch).
- Keep content trivial to update: all copy/data lives in one file.
- Stay fast and client-friendly: content on screen in ~1.2s, clickable commands,
  graceful degradation.

## Non-Goals (out of scope)

- Separate routed pages (`/about`, `/work`, etc.).
- A backend, database, or CMS.
- A live GitHub repo feed (easy future add).
- Dark/light theme toggle.
- Authentication or analytics.

## Interaction Model

The terminal is a scrollable shell session with persistent history.

- **On load:** boot sequence runs (see Animation), ending with the available
  commands listed and a focused input line with a blinking cursor.
- **Running a command:** echo the command (`$ projects`) into history, then append
  its output below. History stacks; the panel scrolls internally and auto-scrolls
  to the newest output.
- **Two input paths, same result:**
  - **Click** a preset command link/button (primary path — what clients use).
  - **Type** the command into the input line and press Enter (secondary).
- **Built-in commands:** `about me`, `work`, `projects`, `contact`, `help`
  (lists commands), `clear` (resets history to a fresh prompt).
- **Unknown command:** prints `command not found: <x>` + a hint to try `help`.
- Output links are real `<a>` tags — clickable, crawlable, `target="_blank"`
  with `rel="noopener noreferrer"`.

## Boot Animation (Hybrid — confirmed)

1. Info lines cascade in fast, one after another (slide-up + fade, ~150ms apart):
   `last login`, `current IP`, `current location`, `device`.
2. Then the prompt + available-commands line types out character-by-character
   with a trailing blinking cursor.
3. Total ≈ 1.2s. Respect `prefers-reduced-motion`: if set, render everything
   instantly with no animation.

Left intro panel keeps its existing `fadeInUp` entrance.

Implementation: pure CSS keyframes + a small React hook (`useBootSequence`).
No animation library.

## Content / Data Model

All content lives in `data/content.js` (single source of truth, edited to update
the site). Initial values are realistic placeholders the user replaces later.

```js
export const content = {
  about: "Short bio blurb (2–4 sentences).",
  work: [
    { title: "Role @ Company", period: "2023 – present", summary: "What you did.", link: "https://..." },
    // ...
  ],
  projects: [
    { name: "Project Name", description: "One-line description.", tech: "Next.js · Node", link: "https://..." },
    // ...
  ],
  contact: {
    email: "chrisjcarrillo@hotmail.com",
    linkedIn: "https://www.linkedin.com/in/christopherjcarrillo/",
    instagram: "https://www.instagram.com/chrisjcarrillo/",
    github: "https://github.com/chrisjcarrillo",
  },
};
```

A `commands.js` registry maps command name → a function that takes `content` and
returns the output (string or JSX). This keeps adding/editing commands isolated
from the terminal rendering logic.

## Live Visitor Data

Client-side only (IP/geo can only be resolved from the browser).

- **IP + location:** `fetch` from a free, no-key, HTTPS, CORS-enabled geo-IP API
  (`https://ipwho.is/`). Returns IP, city, region, country.
- **Device:** parse `navigator.userAgent` with a tiny inline parser for
  browser + OS (no heavy dependency).
- Encapsulated in a `useVisitorInfo` hook returning
  `{ ip, location, device, status }`.
- **Graceful degradation:** while loading, show `…`; on failure/timeout (3s),
  show `—`. Never crash, never hang the boot sequence — the terminal boots with
  whatever is available and fills data in as it resolves.

Privacy note: showing a visitor their own IP/location is standard and client-side;
no data is stored or sent anywhere except the geo-IP lookup the browser makes.

## Layout & Responsive

- **Desktop:** intro panel left, terminal right (current layout preserved).
- **Mobile:** intro stacks above the terminal; commands render as tappable
  buttons (larger hit targets); terminal scrolls internally with a capped height.
- Keep the existing Roboto Mono font and black/white aesthetic.

## Component Architecture

Refactor `pages/index.js` (currently does everything) into focused units:

- `pages/index.js` — page shell; renders intro panel + `<Terminal />`. Keeps
  `getStaticProps` only if still needed (likely removable — content is local now).
- `components/Terminal/Terminal.js` — owns history state, renders boot sequence,
  output history, command bar, and input; auto-scrolls.
- `components/Terminal/CommandBar.js` — the clickable preset command links +
  the typeable input line.
- `components/Terminal/BootSequence.js` — the hybrid boot animation (info lines +
  typed prompt).
- `lib/commands.js` — command registry (name → output fn).
- `hooks/useVisitorInfo.js` — IP/location/device fetch + parse.
- `hooks/useBootSequence.js` — drives the cascade + typing timing.
- `data/content.js` — all editable content.

Clean up the dead stubs: `components/LeftHome/LeftHome.js` (references undefined
`me`) and the empty `components/Terminal/Terminal.js` get replaced/removed as part
of this refactor.

Each unit has one clear purpose and a small interface:
- `Terminal` depends on `commands`, `useVisitorInfo`, `useBootSequence`.
- `commands` depends only on `content` (pure, testable).
- `useVisitorInfo` depends only on `fetch` + `navigator` (isolated side effects).

## Error Handling

- Geo-IP fetch: timeout + try/catch → fallback `—`, logged to console only.
- Unknown command: friendly `command not found` message, no throw.
- `getStaticProps`: if removed, no build-time network dependency (more robust than
  today's external fetch). If kept, retains the existing `DEFAULT_SETTINGS`
  fallback.

## Testing / Verification

No test framework is set up in this project; verification is manual + visual:

- `yarn build` passes (no type/lint/build errors).
- `yarn dev` + browser dogfood (gstack `/browse`): confirm boot animation, each
  command's output, clickable + typed input, live data populates, links work,
  reduced-motion path, and mobile layout via responsive check.
- Capture before/after screenshots.

## Rollout

Single feature branch off `master`, built incrementally per the implementation
plan, verified locally, then shipped. Content placeholders are obviously
placeholder so it's clear what to replace before sharing with clients.

## Open Questions / Future

- Real content for `work`/`projects` (user fills `data/content.js`).
- Optional later: live GitHub feed for an auto-updating projects list.
- Optional later: command history (up-arrow), tab-completion.
