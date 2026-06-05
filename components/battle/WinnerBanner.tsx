'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { BattleResponse } from '@/lib/types'
import { Portrait } from '@/components/Portrait'

interface WinnerBannerProps {
  result: BattleResponse
}

export function WinnerBanner({ result }: WinnerBannerProps) {
  const router = useRouter()
  const shouldReduce = useReducedMotion()

  const isTie = result.winner === 'tie'
  const isA = result.winner === 'A'
  const winners = isTie ? [...result.team_a, ...result.team_b] : (isA ? result.team_a : result.team_b)
  const accent = isA ? 'var(--blue-hero-bright)' : 'var(--red-villain-bright)'
  const headline = isTie ? 'TIE MATCH' : `TEAM ${result.winner} WINS`

  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={shouldReduce ? {} : {
          boxShadow: ['0 0 40px var(--gold-glow)', '0 0 80px var(--gold-glow)', '0 0 40px var(--gold-glow)'],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--gold)',
          padding: '48px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--gold)', letterSpacing: '0.4em', margin: 0 }}>
          VICTORY
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {winners.map((char) => (
            <div
              key={char.id}
              style={{ width: '110px', height: '146px', borderRadius: '4px', overflow: 'hidden', border: `2px solid ${accent}` }}
            >
              <Portrait char={char} ratio="3/4" />
            </div>
          ))}
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(48px, 10vw, 88px)',
            color: accent,
            lineHeight: 1,
            margin: 0,
          }}
        >
          {headline}
        </h2>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          {result.score_a.toLocaleString()} — {result.score_b.toLocaleString()}
        </p>

        <button
          onClick={() => router.push('/')}
          style={{
            marginTop: '8px',
            height: '56px',
            padding: '0 40px',
            background: 'transparent',
            border: '1px solid var(--gold)',
            color: 'var(--gold)',
            fontFamily: 'var(--font-title)',
            fontSize: '22px',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            transition: 'background 0.2s ease, color 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = '#0a0c10' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gold)' }}
        >
          FIGHT AGAIN
        </button>
      </motion.div>
    </motion.div>
  )
}
