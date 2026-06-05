import { Character } from '@/lib/types'

interface StatBarProps {
  label: string
  value: number
  accent: string
}

export function StatBar({ label, value, accent }: StatBarProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span
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

const STATS: Array<{ key: keyof Character; label: string }> = [
  { key: 'power', label: 'POW' },
  { key: 'speed', label: 'SPD' },
  { key: 'strength', label: 'STR' },
  { key: 'intelligence', label: 'INT' },
  { key: 'durability', label: 'DUR' },
  { key: 'combat', label: 'CBT' },
]

export function StatGrid({ char, accent = 'var(--text-muted)' }: StatGridProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px' }}>
      {STATS.map(({ key, label }) => (
        <StatBar key={key} label={label} value={char[key] as number} accent={accent} />
      ))}
    </div>
  )
}
