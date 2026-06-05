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
- Framer Motion — hover animations, story slide-ins, winner shimmer
- `next/font/google` — Bebas Neue (`--font-title`), DM Sans (`--font-body`), DM Mono (`--font-mono`)
- URL search params for team state: `/battle?a=<ids>&b=<ids>`
- No tests, no Zustand, no Context

## PostCSS

Tailwind v4 uses `@tailwindcss/postcss` in `postcss.config.mjs` — **not** the old `tailwindcss` plugin. Don't change this.

## Pages

| Route | File | Type |
|---|---|---|
| `/` | `app/page.tsx` | Client component |
| `/battle` | `app/battle/page.tsx` | Async server component (awaits searchParams Promise) |

`app/battle/page.tsx` is a **server component** that awaits `searchParams`, then renders `components/battle/BattleClient.tsx` (client component). This is required because `searchParams` is a Promise in Next.js 15+.

## File structure

```
app/
  layout.tsx              # Fonts, html vars, body base class
  globals.css             # @import tailwindcss + CSS vars + @theme + .card-cut
  page.tsx                # Landing page (client)
  battle/
    page.tsx              # Server wrapper — awaits searchParams, renders BattleClient
components/
  AlignBadge.tsx          # Alignment pill (HERO / VILLAIN / NEUTRAL)
  CharacterCard.tsx       # Roster card — Framer hover, team buttons (client)
  LightningVS.tsx         # Gold VS with bolt clip-path
  Portrait.tsx            # Radial bg + stripe + SVG bust + scrim
  StatBar.tsx             # exports StatBar + StatGrid
  TeamColumn.tsx          # Team roster display (card-cut, empty state)
  battle/
    BattleClient.tsx      # Phase machine: loading → telling → done (client)
    PortraitStrip.tsx     # Overlapping 84×112 portraits
    ScoreCompare.tsx      # Animated split bar with gold pivot (client)
    StorySentence.tsx     # Slide-in story line with reduced-motion support (client)
    WinnerBanner.tsx      # Gold shimmer, scale-in, FIGHT AGAIN button (client)
lib/
  types.ts                # Character, BattleResponse, ApiError
  api.ts                  # getPopularCharacters, searchCharacters, runBattle
```

## Design tokens

All in `app/globals.css`. Key vars:
- `--bg`, `--surface`, `--surface-2` — dark backgrounds
- `--gold`, `--gold-glow`, `--gold-soft` — gold accent + glow
- `--blue-hero`, `--blue-hero-bright` — Team A / hero color
- `--red-villain`, `--red-villain-bright` — Team B / villain color
- `--font-title`, `--font-body`, `--font-mono` — set on `<html>` by layout
- `.card-cut` — diagonal corner clip-path used on cards and team columns

## Battle page phase machine (BattleClient.tsx)

```
loading  →  API call + 1100ms minimum  →  telling  →  1200ms per sentence × 8  →  done
```
- `loading`: gold sweep bar animation
- `telling`: StorySentence components reveal one by one via setInterval
- `done`: WinnerBanner mounts with scale + shimmer animation

## Environment

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Copy `.env.local.example` to `.env.local`. The API base URL falls back to `http://localhost:8000` if the env var is not set.

## Visual QA checklist (do with backend running)

- [ ] Landing: skeleton cards → 4 character cards load
- [ ] Search filters by character name (client-side)
- [ ] `+ TEAM A` assigns; clicking again removes (toggle); clicking `+ TEAM A` on a B character swaps it
- [ ] `×` in TeamColumn removes character
- [ ] INITIATE BATTLE disabled when either team empty; gold when ready
- [ ] Battle page: sweep bar ~1.1s → overview grid → story reveals 1 per 1.2s → sentence 7 (index 6) has gold bg → WinnerBanner appears
- [ ] FIGHT AGAIN → back to landing
- [ ] Navigate to `/battle` with no params → immediate redirect to `/`
- [ ] Responsive: builder stacks vertically at ≤760px, roster goes to 2 cols

## Next steps

- Wire real character data once Supabase is populated (backend integration phase)
- Replace stub Portrait with real character images using `next/image` once art is available
- Deploy via Docker to server (Dockerfile written, not tested locally)
