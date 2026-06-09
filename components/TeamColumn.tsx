import { Character } from '@/lib/types'
import { Portrait } from './Portrait'

interface TeamColumnProps {
  team: 'A' | 'B'
  characters: Character[]
  onRemove: (id: string) => void
  onAddChampion?: () => void
}

const ACCENT: Record<'A' | 'B', string> = {
  A: 'var(--blue-hero-bright)',
  B: 'var(--red-villain-bright)',
}

const LABEL: Record<'A' | 'B', string> = {
  A: 'TEAM ALPHA',
  B: 'TEAM BETA',
}

export function TeamColumn({ team, characters, onRemove, onAddChampion }: TeamColumnProps) {
  const accent = ACCENT[team]

  return (
    <div
      className="card-cut"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderTop: `2px solid ${accent}`,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '200px',
      }}
    >
      <div style={{ padding: '16px 16px 12px' }}>
        <div style={{ fontFamily: 'var(--font-title)', fontSize: '38px', color: accent, lineHeight: 1 }}>
          {LABEL[team]}
        </div>
      </div>

      <div style={{ flex: 1, padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {characters.length === 0 ? (
          <button
            onClick={onAddChampion}
            style={{
              width: '100%',
              border: '1px dashed var(--border-strong)',
              borderRadius: '4px',
              padding: '24px 16px',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            ADD A CHAMPION
          </button>
        ) : (
          characters.map((char) => (
            <div
              key={char.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div style={{ width: '44px', height: '44px', flexShrink: 0, borderRadius: '3px', overflow: 'hidden' }}>
                <Portrait char={char} ratio="1/1" sizes="44px" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: '18px', lineHeight: 1, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {char.name}
                </div>
              </div>
              <button
                onClick={() => onRemove(char.id)}
                aria-label={`Remove ${char.name}`}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer', padding: '4px 8px', lineHeight: 1, flexShrink: 0 }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
