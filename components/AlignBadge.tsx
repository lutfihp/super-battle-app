import { Character } from '@/lib/types'

interface AlignBadgeProps {
  alignment: Character['alignment']
}

const STYLES: Record<Character['alignment'], React.CSSProperties> = {
  good: { background: 'var(--blue-hero)', boxShadow: 'inset 0 0 0 1px var(--blue-hero-bright)' },
  bad: { background: 'var(--red-villain)', boxShadow: 'inset 0 0 0 1px var(--red-villain-bright)' },
  neutral: { background: 'var(--surface-2)', boxShadow: 'inset 0 0 0 1px var(--border-strong)' },
}

const LABELS: Record<Character['alignment'], string> = {
  good: 'HERO',
  bad: 'VILLAIN',
  neutral: 'NEUTRAL',
}

export function AlignBadge({ alignment }: AlignBadgeProps) {
  return (
    <span
      style={{
        ...STYLES[alignment],
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.14em',
        color: '#fff',
        padding: '4px 9px',
        borderRadius: '999px',
        display: 'inline-block',
        lineHeight: 1,
      }}
    >
      {LABELS[alignment]}
    </span>
  )
}
