'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { ARCH_NODES, ARCH_EDGES } from '@/lib/how-data'
import { NodeIcon } from './NodeIcon'
import styles from './how-it-works.module.css'

const VW = 820, VH = 580

function pt(n: { x: number; y: number; w: number; h: number }) {
  return { x: n.x + n.w / 2, y: n.y }
}
function pb(n: { x: number; y: number; w: number; h: number }) {
  return { x: n.x + n.w / 2, y: n.y + n.h }
}
function cubic(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dy = b.y - a.y
  return `M ${a.x} ${a.y} C ${a.x} ${a.y + dy * 0.5}, ${b.x} ${b.y - dy * 0.5}, ${b.x} ${b.y}`
}

export function ArchitectureDiagram() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <div
      ref={ref}
      className={`${styles.howDiagram} ${inView ? styles.isDraw : ''}`}
      style={{ aspectRatio: `${VW} / ${VH}` }}
    >
      <svg
        className={styles.howDiagramSvg}
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <marker id="arch-arrow" viewBox="0 0 10 10" refX="8" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="var(--gold)" />
          </marker>
        </defs>
        {ARCH_EDGES.map(([from, to], i) => (
          <path
            key={i}
            className={styles.howEdge}
            d={cubic(pb(ARCH_NODES[from]), pt(ARCH_NODES[to]))}
            pathLength="1"
            markerEnd="url(#arch-arrow)"
            style={{ transitionDelay: `${i * 110}ms` }}
          />
        ))}
      </svg>
      {Object.entries(ARCH_NODES).map(([key, node]) => (
        <div
          key={key}
          className={styles.howNode}
          tabIndex={0}
          style={{
            left: `${(node.x / VW) * 100}%`,
            top: `${(node.y / VH) * 100}%`,
            width: `${(node.w / VW) * 100}%`,
            height: `${(node.h / VH) * 100}%`,
          }}
        >
          <span
            className={styles.howNodeIcon}
            style={node.icon === 'ai' ? { color: 'var(--gold)' } : undefined}
          >
            <NodeIcon name={node.icon} />
          </span>
          <span className={styles.howNodeLabel}>{node.label}</span>
          <span className={styles.howNodeTip}>{node.tip}</span>
        </div>
      ))}
    </div>
  )
}
