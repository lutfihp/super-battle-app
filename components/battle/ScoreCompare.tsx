'use client'

import { motion } from 'framer-motion'

interface ScoreCompareProps {
  scoreA: number
  scoreB: number
}

export function ScoreCompare({ scoreA, scoreB }: ScoreCompareProps) {
  const total = scoreA + scoreB
  const aPercent = total > 0 ? (scoreA / total) * 100 : 50
  const bPercent = 100 - aPercent

  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '160px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'baseline' }}>
        <span style={{ fontFamily: 'var(--font-title)', fontSize: '40px', color: 'var(--blue-hero-bright)', lineHeight: 1 }}>
          {scoreA.toLocaleString()}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          VS
        </span>
        <span style={{ fontFamily: 'var(--font-title)', fontSize: '40px', color: 'var(--red-villain-bright)', lineHeight: 1 }}>
          {scoreB.toLocaleString()}
        </span>
      </div>

      <div style={{ position: 'relative', height: '8px', borderRadius: '4px', background: 'var(--surface-2)', display: 'flex', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: '50%' }}
          animate={{ width: `${aPercent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ height: '100%', background: 'linear-gradient(to right, var(--blue-hero), var(--blue-hero-bright))', borderRadius: '4px 0 0 4px', flexShrink: 0 }}
        />
        <motion.div
          initial={{ width: '50%' }}
          animate={{ width: `${bPercent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ height: '100%', background: 'linear-gradient(to left, var(--red-villain), var(--red-villain-bright))', borderRadius: '0 4px 4px 0', flexShrink: 0 }}
        />
      </div>

      {/* Gold pivot marker — positioned outside the overflow:hidden bar */}
      <div style={{ position: 'relative', height: '4px', marginTop: '-14px' }}>
        <motion.div
          initial={{ left: '50%' }}
          animate={{ left: `${aPercent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ position: 'absolute', top: '-4px', width: '2px', height: '12px', background: 'var(--gold)', transform: 'translateX(-50%)' }}
        />
      </div>
    </div>
  )
}
