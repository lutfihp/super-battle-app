'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { BattleResponse } from '@/lib/types'
import { runBattle } from '@/lib/api'
import { PortraitStrip } from './PortraitStrip'
import { ScoreCompare } from './ScoreCompare'
import { StorySentence } from './StorySentence'
import { WinnerBanner } from './WinnerBanner'
import { LightningVS } from '@/components/LightningVS'

type Phase = 'loading' | 'telling' | 'done'

interface BattleClientProps {
  teamAIds: string[]
  teamBIds: string[]
}

export function BattleClient({ teamAIds, teamBIds }: BattleClientProps) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [revealed, setRevealed] = useState(0)
  const [result, setResult] = useState<BattleResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const start = Date.now()
    runBattle(teamAIds, teamBIds)
      .then((data) => {
        const delay = Math.max(0, 1100 - (Date.now() - start))
        const t = setTimeout(() => { setResult(data); setPhase('telling') }, delay)
        timers.current.push(t)
      })
      .catch(() => setError('Battle failed. Go back and try again.'))

    return () => { timers.current.forEach(clearTimeout) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase !== 'telling') return
    const interval = setInterval(() => {
      setRevealed((prev) => {
        const next = prev + 1
        if (next >= 8) { clearInterval(interval); setPhase('done') }
        return next
      })
    }, 1200)
    return () => clearInterval(interval)
  }, [phase])

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--red)', marginBottom: '16px' }}>{error}</p>
        <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--gold)', textDecoration: 'none' }}>← Go back</Link>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes sweep { 0% { transform: translateX(-100%) } 100% { transform: translateX(350%) } }
        @media (max-width: 760px) {
          .battle-overview { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <main style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '0 var(--gutter) 80px' }}>
        <header style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', padding: '24px 0', marginBottom: '32px' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none', letterSpacing: '0.08em' }}>
            ← BACK
          </Link>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '32px', color: 'var(--gold)', textAlign: 'center', lineHeight: 1 }}>
            SUPERBATTLE
          </h1>
          <div />
        </header>

        {phase === 'loading' && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ height: '4px', background: 'var(--surface-2)', borderRadius: '2px', maxWidth: '320px', margin: '0 auto 24px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '40%', background: 'var(--gold)', borderRadius: '2px', animation: 'sweep 1.2s ease-in-out infinite' }} />
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
              SIMULATING OUTCOME…
            </p>
          </div>
        )}

        {result && (phase === 'telling' || phase === 'done') && (
          <>
            <div
              className="battle-overview"
              style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '24px', alignItems: 'center', marginBottom: '48px' }}
            >
              <PortraitStrip team="A" characters={result.team_a} />
              {phase === 'telling' ? (
                <LightningVS />
              ) : (
                <ScoreCompare scoreA={result.score_a} scoreB={result.score_b} />
              )}
              <PortraitStrip team="B" characters={result.team_b} />
            </div>

            <div
              style={{ maxWidth: '820px', margin: '0 auto 48px', background: 'var(--surface)', border: '1px solid var(--border)', padding: '32px' }}
              role="log"
              aria-live="polite"
              aria-label="Battle story"
            >
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '28px', color: 'var(--text)', marginBottom: '24px', lineHeight: 1 }}>
                BATTLE LOG
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {result.story.map((sentence, i) => (
                  <StorySentence key={i} text={sentence} index={i} visible={i < revealed} />
                ))}
              </div>
            </div>

            {phase === 'done' && (
              <div style={{ maxWidth: '820px', margin: '0 auto' }}>
                <WinnerBanner result={result} />
              </div>
            )}
          </>
        )}
      </main>
    </>
  )
}
