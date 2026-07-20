export type ArchNode = {
  x: number; y: number; w: number; h: number
  label: string; icon: string; tip: string
}

export type FlowStep = {
  n: number
  title: string
  icon: string
  path: 'neutral' | 'branch' | 'miss'
  body: string
  code?: string
  emphasis?: boolean
}

export type PromptSegment =
  | { kind: 'label'; text: string }
  | { kind: 'plain'; text: string }
  | { kind: 'rule' }
  | { kind: 'hl-blue' | 'hl-gold' | 'hl-muted' | 'hl-green'; text: string; tip: string }

export type PipeNode = {
  x: number; y: number; w: number; h: number
  label: string; sub?: string; icon: string; soft?: boolean
}

export type StackCard = { name: string; sub: string; why: string }

export type RamSegment = { label: string; mb: number; tone: string; muted?: boolean }

export const ARCH_NODES: Record<string, ArchNode> = {
  browser:  { x: 290, y: 24,  w: 240, h: 60,
    label: 'Browser / Next.js', icon: 'browser',
    tip: 'Frontend — renders UI, calls only /api/* on the backend. Zero external API keys.' },
  nginx:    { x: 320, y: 150, w: 180, h: 54,
    label: 'Nginx', icon: 'proxy',
    tip: 'Reverse proxy — routes /api/* to FastAPI, everything else to Next.js.' },
  next:     { x: 120, y: 262, w: 200, h: 60,
    label: 'Next.js container', icon: 'next',
    tip: 'Frontend — renders UI, calls only /api/* on the backend. Zero external API keys.' },
  fastapi:  { x: 500, y: 262, w: 200, h: 60,
    label: 'FastAPI container', icon: 'py',
    tip: 'Backend — all business logic, all external calls, all secrets live here.' },
  supabase: { x: 96,  y: 430, w: 184, h: 64,
    label: 'Supabase Postgres', icon: 'db',
    tip: 'Postgres cache — characters and battle stories stored here to minimize API calls.' },
  fireworks: { x: 322, y: 430, w: 176, h: 64,
    label: 'gpt-oss-120b via Fireworks', icon: 'ai',
    tip: "LLM inference — called only on cache miss. OpenAI's 120B open-weight model hosted on Fireworks serverless." },
  sources:  { x: 540, y: 430, w: 204, h: 64,
    label: 'SuperHero API · Comic Vine', icon: 'ext',
    tip: 'Character data sources — seeded once at deploy, rarely called again.' },
}

export const ARCH_EDGES: [string, string][] = [
  ['browser', 'nginx'], ['nginx', 'next'], ['nginx', 'fastapi'],
  ['fastapi', 'supabase'], ['fastapi', 'fireworks'], ['fastapi', 'sources'],
]

export const FLOW_STEPS: FlowStep[] = [
  { n: 1, title: 'Initiate Battle', icon: 'click', path: 'neutral',
    body: "The frontend sends POST /api/battle with both teams' character IDs — nothing else.",
    code: 'POST /api/battle { team_a: [...ids], team_b: [...ids] }' },
  { n: 2, title: 'Fetch character data', icon: 'db', path: 'neutral',
    body: 'FastAPI queries Supabase for each ID. Fast — every character is pre-seeded locally.' },
  { n: 3, title: 'Decide the winner', icon: 'scale', path: 'neutral', emphasis: true,
    body: 'Code sums six stats per team, then applies a size multiplier — smaller teams punch harder per character. The AI never decides the outcome.',
    code: 'score = round(Σ stats × multiplier)\nmultiplier: 1 hero → ×1.0 · 2 heroes → ×0.6 · 3 heroes → ×0.5' },
  { n: 4, title: 'Cache check', icon: 'search', path: 'branch',
    body: 'An order-independent matchup key is built, then looked up in the battles table.',
    code: "key = sorted(team_a) + '_vs_' + sorted(team_b)" },
  { n: 5, title: 'Generate story', icon: 'ai', path: 'miss',
    body: 'On a miss: build the prompt with names, powers, and the pre-decided winner, then call gpt-oss-120b via Fireworks.',
    code: '→ Fireworks · parse 8 sentences' },
  { n: 6, title: 'Cache & respond', icon: 'save', path: 'miss',
    body: 'Store the story under its matchup key, then return story, winner, and both scores.',
    code: '{ story[], winner, score_a, score_b }' },
  { n: 7, title: 'Reveal', icon: 'sparkle', path: 'neutral',
    body: 'Sentences surface one by one on a 1.2s stagger; sentence 7 is the turning point; the winner banner follows sentence 8.' },
]

export const PROMPT_SEGMENTS: PromptSegment[] = [
  { kind: 'label', text: 'SYSTEM' },
  { kind: 'plain', text: 'You are a dramatic comic-book battle narrator.' },
  { kind: 'rule' },
  { kind: 'label', text: 'USER' },
  { kind: 'hl-blue',
    text: 'Team A: The Sentinel, Halcyon\nPowers: Solar projection, Flight,\n        Storm conduction, Super strength',
    tip: 'SuperHero API gives numeric stats; Comic Vine gives named abilities. Both feed the prompt for richer storytelling.' },
  { kind: 'plain', text: '' },
  { kind: 'hl-blue',
    text: 'Team B: Mortis, Warlock\nPowers: Dread aura, Rift manipulation,\n        Tactical genius, Hex casting',
    tip: 'Named abilities give the LLM specific vocabulary to use, instead of generic superhero language.' },
  { kind: 'plain', text: '' },
  { kind: 'hl-gold',
    text: 'Winner: Team A   ← injected by code, not the AI',
    tip: 'The winner is decided by stat math before this prompt is built. We tell the LLM who won — it never guesses.' },
  { kind: 'plain', text: '' },
  { kind: 'plain', text: 'Rules:' },
  { kind: 'hl-muted',
    text: '- 8 sentences total\n- Sentences 1–2: setup\n- Sentences 3–6: escalating clash\n- Sentence 7: decisive strike by the winner\n- Sentence 8: aftermath — name the victors',
    tip: 'The narrative arc is enforced in the prompt: setup, escalation, decisive strike by the winning side in sentence 7, and an aftermath that names the victors in sentence 8.' },
]

export const PIPE_NODES: Record<string, PipeNode> = {
  src0: { x: 70,  y: 24,  w: 250, h: 64, label: 'SuperHero API CDN', sub: 'all.json · 731 chars', icon: 'ext' },
  src1: { x: 560, y: 24,  w: 250, h: 64, label: 'Comic Vine API', sub: 'search by name', icon: 'search' },
  t0:   { x: 70,  y: 150, w: 250, h: 72, label: 'Filter DC Comics + Marvel Comics → ~420 characters', icon: 'search', soft: true },
  t1:   { x: 560, y: 150, w: 250, h: 72, label: 'Named ability text (e.g. Flight, Heat Vision)', icon: 'ai', soft: true },
  supa: { x: 285, y: 296, w: 310, h: 64, label: 'Supabase characters table', sub: 'one-time seed at deploy', icon: 'db' },
  api:  { x: 285, y: 420, w: 310, h: 64, label: 'FastAPI /api/characters/*', sub: 'serves frontend — no external call', icon: 'py' },
}

export const PIPE_EDGES: [string, string][] = [
  ['src0', 't0'], ['src1', 't1'], ['t0', 'supa'], ['t1', 'supa'], ['supa', 'api'],
]

export const STACK: StackCard[] = [
  { name: 'Next.js 15', sub: 'App Router · Frontend UI',
    why: 'App Router gives server components for the initial character load — no client-side waterfall on first paint.' },
  { name: 'FastAPI', sub: 'Python · single worker · ~80MB idle',
    why: 'Chosen over NestJS and .NET for the lowest Docker RAM footprint. One Uvicorn worker idles at ~80MB — it matters on a shared 1GB droplet.' },
  { name: 'gpt-oss-120b via Fireworks', sub: 'OpenAI open-weight · serverless · ~$0.0005 per miss',
    why: "OpenAI's 120B open-weight model hosted on Fireworks serverless. Slower per-call than a dedicated LPU host, but ~10× cheaper than the alternatives on the same platform. The battles cache smooths over the latency — most matchups return instantly from Supabase; the LLM is only called for genuinely new combinations." },
  { name: 'Supabase', sub: 'Postgres · free-tier cache',
    why: 'Postgres on the free tier. Relational schema fits perfectly, with a built-in REST API and Python SDK. Picked over MongoDB Atlas for structured data and no cold-start lag.' },
  { name: 'Docker Compose', sub: '2 containers · 1 droplet',
    why: 'Two containers (frontend + backend) orchestrated together. Clean separation, independent redeploys, predictable RAM budget.' },
  { name: 'Nginx', sub: 'Reverse proxy · SSL via Certbot',
    why: 'Runs on the host (not containerized) for simpler Certbot SSL. Routes /api/* to FastAPI, everything else to Next.js.' },
]

export const RAM: RamSegment[] = [
  { label: 'Next.js',   mb: 100, tone: 'var(--blue-hero-bright)' },
  { label: 'FastAPI',   mb: 80,  tone: 'var(--gold)' },
  { label: 'Docker',    mb: 50,  tone: '#27c08a' },
  { label: 'Nginx',     mb: 10,  tone: 'var(--red-villain-bright)' },
  { label: 'Available', mb: 784, tone: 'rgba(255,255,255,0.06)', muted: true },
]

export const STATS_FALLBACK = { battles_cached: 2847, characters_loaded: 386 }
