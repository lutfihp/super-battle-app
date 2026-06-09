'use client'

import { motion } from 'framer-motion'
import { Character } from '@/lib/types'
import { Portrait } from './Portrait'
import { AlignBadge } from './AlignBadge'
import { StatGrid } from './StatBar'

interface CharacterCardProps {
  char: Character
  team: 'A' | 'B' | null
  teamAFull: boolean
  teamBFull: boolean
  onPickA: () => void
  onPickB: () => void
}

function powerTotal(char: Character): number {
  return char.intelligence + char.strength + char.speed + char.durability + char.power + char.combat
}


const TEAM_ACCENT: Record<'A' | 'B', string> = {
  A: 'var(--blue-hero-bright)',
  B: 'var(--red-villain-bright)',
}

export function CharacterCard({ char, team, teamAFull, teamBFull, onPickA, onPickB }: CharacterCardProps) {
  const accent = team ? TEAM_ACCENT[team] : 'var(--text-muted)'
  const borderColor = team ? TEAM_ACCENT[team] : 'var(--border)'

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.012 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="card-cut"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${borderColor}`,
        boxShadow: team ? 'var(--shadow-gold)' : 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Portrait with overlays */}
      <div style={{ position: 'relative' }}>
        <Portrait char={char} ratio="3/4" sizes="(max-width:440px) 50vw, 25vw" />
        <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
          <AlignBadge alignment={char.alignment} />
        </div>
        {team && (
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              background: TEAM_ACCENT[team],
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              color: '#fff',
              padding: '2px 7px',
              borderRadius: '3px',
              letterSpacing: '0.1em',
            }}
          >
            TEAM {team}
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: '27px', lineHeight: 1, color: 'var(--text)', marginBottom: '2px' }}>
            {char.name}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--gold)' }}>
            {powerTotal(char).toLocaleString()} PWR
          </div>
        </div>

        <StatGrid char={char} accent={accent} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: 'auto', paddingTop: '8px' }}>
          <button
            onClick={onPickA}
            style={{
              background: team === 'A' ? 'var(--blue-hero)' : 'transparent',
              border: '1px solid var(--blue-hero-bright)',
              color: 'var(--blue-hero-bright)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.08em',
              padding: '6px 0',
              cursor: teamAFull && team !== 'A' ? 'not-allowed' : 'pointer',
              borderRadius: '3px',
              opacity: teamAFull && team !== 'A' ? 0.4 : 1,
            }}
          >
            + TEAM A
          </button>
          <button
            onClick={onPickB}
            style={{
              background: team === 'B' ? 'var(--red-villain)' : 'transparent',
              border: '1px solid var(--red-villain-bright)',
              color: 'var(--red-villain-bright)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.08em',
              padding: '6px 0',
              cursor: teamBFull && team !== 'B' ? 'not-allowed' : 'pointer',
              borderRadius: '3px',
              opacity: teamBFull && team !== 'B' ? 0.4 : 1,
            }}
          >
            + TEAM B
          </button>
        </div>
      </div>
    </motion.div>
  )
}
