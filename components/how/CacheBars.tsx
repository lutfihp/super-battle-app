'use client'

import { useRef, useState, useEffect } from 'react'
import { useInView } from 'framer-motion'
import { getStats, StatsResponse } from '@/lib/api'
import { STATS_FALLBACK } from '@/lib/how-data'
import styles from './how-it-works.module.css'

function useCountUp(target: number, run: boolean, duration = 1100) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf: number
    let start: number | null = null
    const snap = setTimeout(() => setValue(target), duration + 120)
    function tick(ts: number) {
      if (start === null) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); clearTimeout(snap) }
  }, [run, target, duration])
  return value
}

const BARS = [
  { label: 'Cache HIT',  ms: '~40ms',     note: 'Supabase read only',        pct: 12,  hit: true },
  { label: 'Cache MISS', ms: '~3s',       note: 'Supabase + Fireworks + write', pct: 100, hit: false },
]

export function CacheBars() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const [stats, setStats] = useState<StatsResponse>(STATS_FALLBACK)

  useEffect(() => {
    getStats().then(setStats).catch(() => {/* keep fallback */})
  }, [])

  const battles = useCountUp(stats.battles_cached, inView)
  const chars = useCountUp(stats.characters_loaded, inView)

  return (
    <div ref={ref} className={styles.howCacheBarsWrap}>
      <div className={styles.howCacheBarsGroup}>
        {BARS.map(bar => (
          <div key={bar.label}>
            <div className={styles.howCachebarTop}>
              <span className={`${styles.howCachebarLabel} ${bar.hit ? styles.howCachebarLabelHit : styles.howCachebarLabelMiss}`}>
                {bar.label}
              </span>
              <span className={styles.howCachebarMs} style={{ fontFamily: 'var(--font-mono)' }}>{bar.ms}</span>
            </div>
            <div className={styles.howCachebarTrack}>
              <div
                className={`${styles.howCachebarFill} ${bar.hit ? styles.howCachebarFillHit : styles.howCachebarFillMiss}`}
                style={{ width: inView ? `${bar.pct}%` : '0%' }}
              />
            </div>
            <span className={styles.howCachebarNote} style={{ fontFamily: 'var(--font-mono)' }}>{bar.note}</span>
          </div>
        ))}
      </div>
      <div className={styles.howCounter}>
        <div className={styles.howCounterCell}>
          <span className={styles.howCounterNum}>{battles.toLocaleString('en-US')}</span>
          <span className={styles.howCounterCap} style={{ fontFamily: 'var(--font-mono)' }}>battles cached</span>
        </div>
        <span className={styles.howCounterDiv} />
        <div className={styles.howCounterCell}>
          <span className={styles.howCounterNum}>{chars.toLocaleString('en-US')}</span>
          <span className={styles.howCounterCap} style={{ fontFamily: 'var(--font-mono)' }}>characters loaded</span>
        </div>
        <span className={styles.howCounterSrc} style={{ fontFamily: 'var(--font-mono)' }}>GET /api/stats</span>
      </div>
    </div>
  )
}
