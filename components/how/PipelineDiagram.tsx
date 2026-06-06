'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { PIPE_NODES, PIPE_EDGES } from '@/lib/how-data'
import { NodeIcon } from './NodeIcon'
import styles from './how-it-works.module.css'

const VW = 880, VH = 510

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

export function PipelineDiagram() {
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
        {PIPE_EDGES.map(([from, to], i) => (
          <path
            key={i}
            className={styles.howEdge}
            d={cubic(pb(PIPE_NODES[from]), pt(PIPE_NODES[to]))}
            pathLength="1"
            style={{ transitionDelay: `${i * 120}ms` }}
          />
        ))}
      </svg>
      {Object.entries(PIPE_NODES).map(([key, node]) => (
        <div
          key={key}
          className={[
            styles.howNode,
            styles.howNodePipe,
            node.soft ? styles.howNodeSoft : '',
          ].filter(Boolean).join(' ')}
          style={{
            left: `${(node.x / VW) * 100}%`,
            top: `${(node.y / VH) * 100}%`,
            width: `${(node.w / VW) * 100}%`,
            height: `${(node.h / VH) * 100}%`,
          }}
        >
          <span className={styles.howNodeIcon}><NodeIcon name={node.icon} size={16} /></span>
          <span className={styles.howNodeStack}>
            <span className={styles.howNodeLabel}>{node.label}</span>
            {node.sub && <span className={styles.howNodeSub}>{node.sub}</span>}
          </span>
        </div>
      ))}
    </div>
  )
}
