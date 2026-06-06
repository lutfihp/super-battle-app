'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { PROMPT_SEGMENTS } from '@/lib/how-data'
import styles from './how-it-works.module.css'

const HL_CLASS: Record<string, string> = {
  'hl-gold':  styles.howHlGold,
  'hl-blue':  styles.howHlBlue,
  'hl-muted': styles.howHlMuted,
  'hl-green': styles.howHlGreen,
}

export function PromptInspector() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  let hlIndex = 0

  return (
    <div ref={ref} className={`${styles.howPrompt} ${inView ? styles.isIn : ''}`}>
      <div className={styles.howPromptBar}>
        <span className={styles.howPromptDot} />
        <span className={styles.howPromptDot} />
        <span className={styles.howPromptDot} />
        <span className={styles.howPromptFile} style={{ fontFamily: 'var(--font-mono)' }}>
          battle_prompt.txt
        </span>
      </div>
      <pre className={styles.howPromptBody}>
        {PROMPT_SEGMENTS.map((seg, i) => {
          if (seg.kind === 'rule') return <span key={i} className={styles.howPromptRule} />
          if (seg.kind === 'label') return <span key={i} className={styles.howPromptLabel}>{seg.text}</span>
          if (seg.kind === 'plain') return <span key={i} className={styles.howPromptPlain}>{seg.text + '\n'}</span>
          const delay = `${(hlIndex++) * 140}ms`
          return (
            <span
              key={i}
              className={`${styles.howHl} ${HL_CLASS[seg.kind]}`}
              style={{ transitionDelay: delay }}
              tabIndex={0}
            >
              {seg.text}
              <span className={styles.howHlTip}>{seg.tip}</span>
            </span>
          )
        })}
      </pre>
    </div>
  )
}
