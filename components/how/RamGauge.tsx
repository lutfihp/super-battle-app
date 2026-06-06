'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { RAM } from '@/lib/how-data'
import styles from './how-it-works.module.css'

export function RamGauge() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  const total = RAM.reduce((s, r) => s + r.mb, 0)
  const used = RAM.filter(r => !r.muted).reduce((s, r) => s + r.mb, 0)

  return (
    <div ref={ref} className={styles.howRam}>
      <div className={styles.howRamHead}>
        <span className={styles.howRamTitle} style={{ fontFamily: 'var(--font-mono)' }}>
          1 GB DROPLET · RAM BUDGET
        </span>
        <span className={styles.howRamUsed} style={{ fontFamily: 'var(--font-mono)' }}>
          ~{used}MB in use
        </span>
      </div>
      <div className={styles.howRamBar}>
        {RAM.map((seg, i) => (
          <div
            key={seg.label}
            className={`${styles.howRamSeg} ${seg.muted ? styles.isMuted : ''}`}
            style={{
              width: inView ? `${(seg.mb / total) * 100}%` : '0%',
              background: seg.tone,
              transitionDelay: `${i * 90}ms`,
            }}
          >
            <span className={styles.howRamSeglabel} style={{ fontFamily: 'var(--font-mono)' }}>
              {seg.label}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.howRamLegend}>
        {RAM.map(seg => (
          <span key={seg.label} className={styles.howRamKey} style={{ fontFamily: 'var(--font-mono)' }}>
            <span className={styles.howRamSwatch} style={{ background: seg.tone }} />
            {seg.label} · {seg.mb}MB
          </span>
        ))}
      </div>
    </div>
  )
}
