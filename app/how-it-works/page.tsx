'use client'

import Link from 'next/link'
import { JetBrains_Mono } from 'next/font/google'
import styles from '@/components/how/how-it-works.module.css'
import { HowSection } from '@/components/how/HowSection'
import { ArchitectureDiagram } from '@/components/how/ArchitectureDiagram'
import { FlowStepper } from '@/components/how/FlowStepper'
import { CacheBars } from '@/components/how/CacheBars'
import { PromptInspector } from '@/components/how/PromptInspector'
import { PipelineDiagram } from '@/components/how/PipelineDiagram'
import { StackGrid } from '@/components/how/StackGrid'
import { RamGauge } from '@/components/how/RamGauge'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-code',
})

export default function HowItWorksPage() {
  return (
    <div className={`${styles.howRoot} ${jetbrainsMono.variable}`}>

      {/* Sticky nav */}
      <header className={styles.howNav}>
        <Link href="/" className={styles.howNavBrand}>
          <span style={{ fontFamily: 'var(--font-title)', fontSize: '22px', color: 'var(--gold)', letterSpacing: '0.04em' }}>
            SUPERBATTLE
          </span>
        </Link>
        <nav className={styles.howNavLinks} style={{ fontFamily: 'var(--font-mono)' }}>
          <Link href="/">Battle</Link>
          <Link href="/how-it-works" className={styles.isCurrent} aria-current="page">
            How it works
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <div className={styles.howHero}>
        <span className={styles.howEyebrow} style={{ fontFamily: 'var(--font-mono)' }}>
          Engineering deep-dive
        </span>
        <h1 className={styles.howHeroTitle}>How It Works</h1>
        <p className={styles.howHeroSub}>
          A look behind the scenes — the system design, caching, and prompt-engineering
          decisions that keep SuperBattle fast, cheap, and honest about who wins.
        </p>
        <div className={styles.howHeroMeta} style={{ fontFamily: 'var(--font-mono)' }}>
          <span>2 containers</span><span>·</span><span>1 droplet</span><span>·</span>
          <span>~240MB RAM</span><span>·</span><span>$6 / month</span>
        </div>
      </div>

      {/* S1 — System Architecture */}
      <HowSection
        num="01" kicker="System / Architecture" title="The Whole Picture" wide
        visual={<ArchitectureDiagram />}
        lead="Two Docker containers behind Nginx on a single DigitalOcean droplet."
      >
        <p className={styles.howP}>Next.js handles the UI; FastAPI owns all business logic and external API calls.</p>
        <p className={styles.howP}>API keys never leave the server — the browser only ever talks to our own backend. That separation keeps the app secure and the architecture clean.</p>
        <p className={styles.howHint} style={{ fontFamily: 'var(--font-mono)' }}>Hover any node for its role.</p>
      </HowSection>

      {/* S2 — Request Lifecycle */}
      <HowSection
        num="02" kicker="Request / Lifecycle" title="One Battle, Step by Step" wide
        visual={<FlowStepper />}
        lead="The winner is always determined mathematically before the AI is ever called."
      >
        <p className={styles.howP}>This guarantees the story matches the outcome — there&apos;s no hallucination risk. The prompt simply tells the LLM who won and asks it to write a narrative around that fact.</p>
        <p className={styles.howHint} style={{ fontFamily: 'var(--font-mono)' }}>Steps light up as you scroll. Gold = code path, blue = cache miss.</p>
      </HowSection>

      {/* S3 — Caching */}
      <HowSection
        num="03" kicker="Performance / Caching" title="Generate Once, Serve Forever"
        visual={<CacheBars />}
        lead="Every unique matchup is stored after its first generation."
      >
        <p className={styles.howP}>The matchup key is order-independent — A vs B is the same key as B vs A. On a cache hit, the response bypasses the LLM entirely and returns in under 100ms.</p>
        <p className={styles.howP}>Cache hits matter more now than they used to. Each miss calls Fireworks for ~3 seconds and costs a fraction of a cent; each hit is a single Supabase read. Over time the most popular matchups are always served from cache — the LLM is only called for genuinely new combinations, which keeps both latency and spend near zero for repeat visitors.</p>
      </HowSection>

      {/* S4 — Prompt Engineering */}
      <HowSection
        num="04" kicker="AI / Prompt Engineering" title="Telling, Not Asking" wide
        visual={<PromptInspector />}
        lead="LLMs tend to narrate toward whoever pop-culture says should win."
      >
        <p className={styles.howP}>By injecting the winner as a hard constraint, we override that bias entirely. The named powers from Comic Vine give the LLM specific vocabulary instead of generic superhero language.</p>
        <p className={styles.howP}>Asking for structured JSON output (instead of prose) makes the sentence-by-sentence reveal animation trivial to implement on the frontend.</p>
        <p className={styles.howHint} style={{ fontFamily: 'var(--font-mono)' }}>Hover a highlighted block to see the decision behind it.</p>
      </HowSection>

      {/* S5 — Data Pipeline */}
      <HowSection
        num="05" kicker="Data / Pipeline" title="Seeded Once, Self-Contained" wide
        visual={<PipelineDiagram />}
        lead="Character data is merged from two sources into Supabase at deploy time."
      >
        <p className={styles.howP}>SuperHero API provides the numeric stats; Comic Vine provides named abilities that make the AI story richer. After the seed script runs once, the app is effectively self-contained.</p>
        <p className={styles.howP}>SuperHero API is only called at runtime for a character that wasn&apos;t in the seed; Comic Vine is never called at runtime. The app keeps working even if either source goes down.</p>
      </HowSection>

      {/* S6 — Stack */}
      <HowSection
        num="06" kicker="Stack / Infrastructure" title="Built Within Real Limits"
        visual={
          <div className={styles.howStackwrap}>
            <StackGrid />
            <RamGauge />
          </div>
        }
        lead="The entire stack runs on a $6/month droplet with roughly 240MB RAM in use."
      >
        <p className={styles.howP}>Every technology choice was made with that constraint in mind — not for cost, but as a deliberate exercise in building efficiently within real-world limits.</p>
        <p className={styles.howHint} style={{ fontFamily: 'var(--font-mono)' }}>Hover a card for the reasoning.</p>
      </HowSection>

      {/* Footer */}
      <footer className={styles.howFooter} style={{ fontFamily: 'var(--font-mono)' }}>
        <Link href="/" className={styles.howFooterBack}>← back to the battle</Link>
        <span>SuperBattle · engineering showcase · 2026</span>
      </footer>

    </div>
  )
}
