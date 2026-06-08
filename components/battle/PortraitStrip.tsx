import { Character } from '@/lib/types'
import { Portrait } from '@/components/Portrait'

interface PortraitStripProps {
  team: 'A' | 'B'
  characters: Character[]
}

const ACCENT: Record<'A' | 'B', string> = {
  A: 'var(--blue-hero-bright)',
  B: 'var(--red-villain-bright)',
}

const SIDE_LABEL: Record<'A' | 'B', string> = {
  A: 'HEROES',
  B: 'VILLAINS',
}

const TEAM_LABEL: Record<'A' | 'B', string> = {
  A: 'TEAM ALPHA',
  B: 'TEAM BETA',
}

export function PortraitStrip({ team, characters }: PortraitStripProps) {
  const accent = ACCENT[team]

  return (
    <div>
      <div style={{ marginBottom: '12px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: accent, letterSpacing: '0.12em', marginBottom: '2px' }}>
          {SIDE_LABEL[team]}
        </p>
        <p style={{ fontFamily: 'var(--font-title)', fontSize: '34px', color: 'var(--text)', lineHeight: 1 }}>
          {TEAM_LABEL[team]}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        {characters.map((char, i) => (
          <div
            key={char.id}
            style={{
              width: '84px',
              height: '112px',
              borderRadius: '4px',
              overflow: 'hidden',
              border: `2px solid ${accent}`,
              marginLeft: i > 0 ? '-16px' : '0',
              zIndex: characters.length - i,
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <Portrait char={char} ratio="3/4" sizes="84px" />
          </div>
        ))}
      </div>
    </div>
  )
}
