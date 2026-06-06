'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { FLOW_STEPS, FlowStep } from '@/lib/how-data'
import { NodeIcon } from './NodeIcon'
import styles from './how-it-works.module.css'

function Step({ step, i }: { step: FlowStep; i: number }) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  const cls = [
    styles.howStep,
    step.path === 'miss' ? styles.howStepMiss : '',
    step.emphasis ? styles.isEmph : '',
    inView ? styles.isIn : '',
  ].filter(Boolean).join(' ')

  return (
    <li ref={ref} className={cls} style={{ transitionDelay: `${(i % 2) * 60}ms` }}>
      <div className={styles.howStepRail}>
        <span className={styles.howStepDot}><NodeIcon name={step.icon} size={16} /></span>
      </div>
      <div className={styles.howStepCard}>
        <div className={styles.howStepHead}>
          <span className={styles.howStepN} style={{ fontFamily: 'var(--font-mono)' }}>
            STEP {step.n}
          </span>
          <h3 className={styles.howStepTitle}>{step.title}</h3>
          {step.path === 'miss' && (
            <span className={`${styles.howTag} ${styles.howTagMiss}`} style={{ fontFamily: 'var(--font-mono)' }}>
              cache miss
            </span>
          )}
          {step.emphasis && (
            <span className={`${styles.howTag} ${styles.howTagGold}`} style={{ fontFamily: 'var(--font-mono)' }}>
              code, not AI
            </span>
          )}
        </div>
        <p className={styles.howStepBody}>{step.body}</p>
        {step.code && <code className={styles.howCodeLine}>{step.code}</code>}
        {step.path === 'branch' && (
          <div className={styles.howBranch}>
            <div className={`${styles.howBranchRow} ${styles.howBranchRowHit}`}>
              <span className={styles.howBranchKey} style={{ fontFamily: 'var(--font-mono)' }}>HIT</span>
              <span className={styles.howBranchTxt}>return cached story immediately</span>
              <span className={styles.howBranchMs} style={{ fontFamily: 'var(--font-mono)' }}>&lt; 50ms</span>
            </div>
            <div className={`${styles.howBranchRow} ${styles.howBranchRowMiss}`}>
              <span className={styles.howBranchKey} style={{ fontFamily: 'var(--font-mono)' }}>MISS</span>
              <span className={styles.howBranchTxt}>continue to story generation</span>
              <span className={styles.howBranchMs} style={{ fontFamily: 'var(--font-mono)' }}>~1,400ms</span>
            </div>
          </div>
        )}
      </div>
    </li>
  )
}

export function FlowStepper() {
  return (
    <ol className={styles.howStepper}>
      {FLOW_STEPS.map((step, i) => <Step key={step.n} step={step} i={i} />)}
    </ol>
  )
}
