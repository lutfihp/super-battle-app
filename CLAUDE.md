@AGENTS.md

# super-battle-app

Next.js 16 frontend for SuperBattle — DC character battle story generator. Fully implemented. Connects to the FastAPI backend at `super-battle-api/`.

## Status: Complete — ready for visual QA and integration testing

All pages and components are built, TypeScript clean, production build passes. Needs a human visual check with the backend running.

## Run locally

```powershell
# Backend must be running first (see super-battle-api/CLAUDE.md)

# From d:\Codading Repo\super-battle\super-battle-app
npm run dev
# → http://localhost:3000
```

Production build check:
```powershell
npm run build
```

## Tech stack

- Next.js 16 (App Router), TypeScript
- Tailwind CSS v4 — CSS-first (`@theme` in `globals.css`, no tailwind.config needed)
- Framer Motion v12 — hover animations, story slide-ins, winner shimmer, `useInView` for scroll-triggered animations on `/how-it-works`
- `next/font/google` — Bebas Neue (`--font-title`), DM Sans (`--font-body`), DM Mono (`--font-mono`), JetBrains Mono (page-scoped to `/how-it-works` only, sets `--font-code`)
- URL search params for team state: `/battle?a=<ids>&b=<ids>`
- No tests, no Zustand, no Context

## PostCSS

Tailwind v4 uses `@tailwindcss/postcss` in `postcss.config.mjs` — **not** the old `tailwindcss` plugin. Don't change this.

## Pages

| Route | File | Type |
|---|---|---|
| `/` | `app/page.tsx` | Client component |
| `/battle` | `app/battle/page.tsx` | Async server component (awaits searchParams Promise) |
| `/how-it-works` | `app/how-it-works/page.tsx` | Client component (framer-motion useInView) |

`app/battle/page.tsx` is a **server component** that awaits `searchParams`, then renders `components/battle/BattleClient.tsx` (client component). This is required because `searchParams` is a Promise in Next.js 15+.

## File structure

```
app/
  layout.tsx              # Fonts, html vars, body base class
  globals.css             # @import tailwindcss + CSS vars + @theme + .card-cut
  page.tsx                # Landing page (client) — flex header: logo left, how-it-works link + tagline right
  battle/
    page.tsx              # Server wrapper — awaits searchParams, renders BattleClient
  how-it-works/
    page.tsx              # Engineering deep-dive page — JetBrains Mono font, 6 animated sections
components/
  AlignBadge.tsx          # Alignment pill (HERO / VILLAIN / NEUTRAL)
  CharacterCard.tsx       # Roster card — Framer hover, team buttons (client); accepts teamAFull/teamBFull booleans — dims button + sets cursor:not-allowed when that team is full
  LightningVS.tsx         # Gold VS with bolt clip-path
  Portrait.tsx            # Radial bg + stripe + SVG bust + scrim
  StatBar.tsx             # exports StatBar + StatGrid
  TeamColumn.tsx          # Team roster display (card-cut, empty state)
  battle/
    BattleClient.tsx      # Phase machine: loading → telling → done (client); center column shows LightningVS during telling, ScoreCompare only at done
    PortraitStrip.tsx     # Overlapping 84×112 portraits
    ScoreCompare.tsx      # Animated split bar with gold pivot (client)
    StorySentence.tsx     # Slide-in story line with reduced-motion support (client)
    WinnerBanner.tsx      # Gold shimmer, scale-in, FIGHT AGAIN button (client)
  how/
    how-it-works.module.css   # All how-specific styles — local tokens on .howRoot, camelCase classes
    NodeIcon.tsx              # 12 SVG icons (browser, proxy, next, py, db, ai, ext, click, scale, search, save, sparkle)
    HowSection.tsx            # Reusable section shell: eyebrow + title + visual/prose grid, useInView fade-in
    ArchitectureDiagram.tsx   # S1: positioned nodes + SVG cubic-bezier edges, stroke-dashoffset draw-on
    FlowStepper.tsx           # S2: 7-step ordered list, each step uses useInView stagger
    CacheBars.tsx             # S3: HIT/MISS bars + count-up counter fetching GET /api/stats
    PromptInspector.tsx       # S4: terminal block with staggered highlight tooltips
    PipelineDiagram.tsx       # S5: same SVG draw-on technique as ArchitectureDiagram
    StackGrid.tsx             # S6: 2-col grid of 6 stack cards, hover reveals "why" text
    RamGauge.tsx              # S6: stacked bar with 5 RAM segments, animates width on scroll
lib/
  types.ts                # Character, BattleResponse, ApiError
  api.ts                  # getPopularCharacters, searchCharacters, runBattle, getStats
  how-data.ts             # All static content for /how-it-works: ARCH_NODES, ARCH_EDGES, FLOW_STEPS,
                          #   PROMPT_SEGMENTS, PIPE_NODES, PIPE_EDGES, STACK, RAM, STATS_FALLBACK
```

## Design tokens

All in `app/globals.css`. Key vars:
- `--bg`, `--surface`, `--surface-2` — dark backgrounds
- `--gold`, `--gold-glow`, `--gold-soft` — gold accent + glow
- `--blue-hero`, `--blue-hero-bright` — Team A / hero color
- `--red-villain`, `--red-villain-bright` — Team B / villain color
- `--font-title`, `--font-body`, `--font-mono` — set on `<html>` by layout
- `.card-cut` — diagonal corner clip-path used on cards and team columns

The `/how-it-works` CSS module defines additional local tokens on `.howRoot`:
- `--_deep: #060810` — diagram backgrounds
- `--_dim: rgba(232,234,240,0.72)` — body text in how sections
- `--_sp2` through `--_sp9` — spacing scale (8px–96px)
- `--_rSm: 3px`, `--_rMd: 4px` — radius scale
- `--_dFast: 140ms` — fast transition duration

## How It Works page — animation contract

| Element | Trigger | Technique |
|---|---|---|
| Section fade-in | `useInView(ref, { once: true, amount: 0.15 })` | CSS `opacity` + `translateY` transition, `.isIn` class |
| SVG diagram edges | `useInView` → `.isDraw` class on container | CSS `stroke-dashoffset` transition (`pathLength="1"`) |
| SVG diagram nodes | Same `.isDraw` class | CSS `opacity` + `translateY`, staggered `transitionDelay` |
| FlowStepper steps | `useInView` per `<li>` | CSS transitions, `.isIn` class |
| CacheBars widths | `useInView` boolean → inline `width` style | CSS `transition: width 1100ms` |
| Stats count-up | `useInView` → `useCountUp` hook | `requestAnimationFrame` loop, ease-out cubic |
| PromptInspector highlights | `useInView` → `.isIn` on container | CSS `opacity`, staggered `transitionDelay` per span |
| StackGrid cards | `useInView` per card | CSS transitions, `.isIn` class |
| RamGauge segments | `useInView` boolean → inline `width` style | CSS `transition: width 800ms`, staggered `transitionDelay` |

Reduced motion: `@media (prefers-reduced-motion: reduce)` in the CSS module sets all animated elements to their final state immediately.

## Battle page phase machine (BattleClient.tsx)

```
loading  →  API call + 1100ms minimum  →  telling  →  1200ms per sentence × 8  →  done
```
- `loading`: gold sweep bar animation
- `telling`: StorySentence components reveal one by one via setInterval; center column shows `LightningVS` (scores hidden)
- `done`: WinnerBanner mounts with scale + shimmer animation; center column shows `ScoreCompare` with final multiplied scores

## Environment

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Copy `.env.local.example` to `.env.local`. The API base URL falls back to `http://localhost:8000` if the env var is not set.

## Visual QA checklist (do with backend running)

### Landing page
- [ ] Header: logo left, "How it works" link + tagline stacked right
- [ ] "How it works" link turns gold on hover; navigates to `/how-it-works`
- [ ] Skeleton cards → 4 character cards load
- [ ] Search filters by character name (client-side)
- [ ] `+ TEAM A` assigns; clicking again removes (toggle); clicking `+ TEAM A` on a B character swaps it
- [ ] Teams capped at 3 — adding a 4th to a full team does nothing; the button dims to 40% opacity with `cursor:not-allowed`
- [ ] `×` in TeamColumn removes character
- [ ] INITIATE BATTLE disabled when either team empty; gold when ready

### Battle page
- [ ] Battle page: sweep bar ~1.1s → overview grid → story reveals 1 per 1.2s → sentence 7 (index 6) has gold bg → WinnerBanner appears
- [ ] During storytelling, center column shows gold VS bolt only — no scores visible
- [ ] Scores appear only inside WinnerBanner (bottom line: `scoreA — scoreB`)
- [ ] FIGHT AGAIN → back to landing
- [ ] Navigate to `/battle` with no params → immediate redirect to `/`
- [ ] Responsive: builder stacks vertically at ≤760px, roster goes to 2 cols

### How It Works page (`/how-it-works`)
- [ ] Sticky nav shows "Battle" and "How it works" links; current page is gold + underlined
- [ ] Hero: large gold title, engineering deep-dive eyebrow, meta row (2 containers · 1 droplet · ~240MB RAM · $6/month)
- [ ] Scrolling: each section fades + slides up as it enters view
- [ ] S1: architecture diagram nodes appear and edges draw on scroll entry; hovering nodes shows tooltip
- [ ] S2: step cards light up gold as they scroll in; Step 3 has "code, not AI" gold badge; Step 4 shows HIT/MISS branch rows
- [ ] S3: cache bars animate from 0 to target width; counter counts up (battles_cached / characters_loaded from GET /api/stats)
- [ ] S4: prompt inspector highlights fade in with stagger; hovering highlighted spans shows tooltip
- [ ] S5: pipeline diagram draws in on scroll
- [ ] S6: stack cards stagger in; hovering card reveals "why" text; RAM gauge segments animate in with stagger
- [ ] Footer: "← back to the battle" link works

## Next steps

- Wire real character data once Supabase is populated (backend integration phase)
- Replace stub Portrait with real character images using `next/image` once art is available
- Deploy via Docker to server (Dockerfile written, not tested locally)
- Update `GET /api/stats` to return real Supabase COUNT queries (backend integration phase)
