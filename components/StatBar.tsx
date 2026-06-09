import { Character } from '@/lib/types'

interface StatBarProps {
  label: string
  full: string
  value: number
  accent: string
}

export function StatBar({ label, full, value, accent }: StatBarProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span
        data-stat-full={full}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: 'var(--text-muted)',
          width: '24px',
          flexShrink: 0,
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: '4px',
          background: 'rgba(255,255,255,.06)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${value}%`,
            background: accent,
            borderRadius: '2px',
          }}
        />
      </div>
    </div>
  )
}

interface StatGridProps {
  char: Character
  accent?: string
}

const STATS: Array<{ key: keyof Character; label: string; full: string }> = [
  { key: 'power',        label: 'POW', full: 'Power' },
  { key: 'speed',        label: 'SPD', full: 'Speed' },
  { key: 'strength',     label: 'STR', full: 'Strength' },
  { key: 'intelligence', label: 'INT', full: 'Intelligence' },
  { key: 'durability',   label: 'DUR', full: 'Durability' },
  { key: 'combat',       label: 'CBT', full: 'Combat' },
]

export function StatGrid({ char, accent = 'var(--text-muted)' }: StatGridProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px' }}>
      {STATS.map(({ key, label, full }) => (
        <StatBar key={key} label={label} full={full} value={char[key] as number} accent={accent} />
      ))}
    </div>
  )
}
