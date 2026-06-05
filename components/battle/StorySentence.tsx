'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface StorySentenceProps {
  text: string
  index: number
  visible: boolean
}

export function StorySentence({ text, index, visible }: StorySentenceProps) {
  const shouldReduce = useReducedMotion()
  const isFromLeft = index % 2 === 0
  const isHighlight = index === 6

  const xValue = shouldReduce ? 0 : (isFromLeft ? -40 : 40)
  const accentColor = isHighlight
    ? 'var(--gold)'
    : isFromLeft
      ? 'var(--blue-hero-bright)'
      : 'var(--red-villain-bright)'

  return (
    <motion.div
      initial={{ opacity: 0, x: xValue }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: xValue }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: '12px 16px',
        borderLeft: `3px solid ${accentColor}`,
        background: isHighlight ? 'var(--gold-soft)' : 'transparent',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          lineHeight: 1.6,
          color: isHighlight ? 'var(--text)' : 'var(--text-muted)',
          margin: 0,
        }}
      >
        {text}
      </p>
    </motion.div>
  )
}
