'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { STACK, StackCard } from '@/lib/how-data'
import styles from './how-it-works.module.css'

function Card({ card, i }: { card: StackCard; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div
      ref={ref}
      className={`${styles.howStackcard} ${inView ? styles.isIn : ''}`}
      style={{ transitionDelay: `${(i % 2) * 80}ms` }}
      tabIndex={0}
    >
      <div className={styles.howStackcardHead}>
        <h3 className={styles.howStackcardName}>{card.name}</h3>
        <span className={styles.howStackcardPlus} aria-hidden="true">?</span>
      </div>
      <p className={styles.howStackcardSub} style={{ fontFamily: 'var(--font-mono)' }}>{card.sub}</p>
      <span className={styles.howStackcardWhy}>{card.why}</span>
    </div>
  )
}

export function StackGrid() {
  return (
    <div className={styles.howStackgrid}>
      {STACK.map((card, i) => <Card key={card.name} card={card} i={i} />)}
    </div>
  )
}
