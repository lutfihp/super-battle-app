'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import styles from './how-it-works.module.css'

type Props = {
  num: string
  kicker: string
  title: string
  lead?: string
  visual: React.ReactNode
  wide?: boolean
  children: React.ReactNode
}

export function HowSection({ num, kicker, title, lead, visual, wide, children }: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section
      ref={ref}
      className={`${styles.howSection} ${inView ? styles.isIn : ''}`}
    >
      <div className={styles.howSectionHead}>
        <span className={styles.howSectionNum} style={{ fontFamily: 'var(--font-mono)' }}>
          {num}
        </span>
        <div className={styles.howSectionHeading}>
          <span className={styles.howEyebrow} style={{ fontFamily: 'var(--font-mono)' }}>
            {kicker}
          </span>
          <h2 className={styles.howSectionTitle}>{title}</h2>
        </div>
      </div>
      <div className={`${styles.howSectionGrid} ${wide ? styles.howSectionGridWide : ''}`}>
        <div>{visual}</div>
        <div className={styles.howSectionProse}>
          {lead && <p className={styles.howLead}>{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
