'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Character } from '@/lib/types'
import { getPopularCharacters, runBattle } from '@/lib/api'
import { CharacterCard } from '@/components/CharacterCard'
import { TeamColumn } from '@/components/TeamColumn'
import { LightningVS } from '@/components/LightningVS'

function SkeletonCard() {
  return (
    <div
      className="card-cut"
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        aspectRatio: '3/5',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    />
  )
}

export default function HomePage() {
  const router = useRouter()
  const [popular, setPopular] = useState<Character[]>([])
  const [search, setSearch] = useState('')
  const [teamA, setTeamA] = useState<string[]>([])
  const [teamB, setTeamB] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBattling, setIsBattling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    getPopularCharacters()
      .then((chars) => { setPopular(chars); setIsLoading(false) })
      .catch(() => { setLoadError(true); setIsLoading(false) })
  }, [])

  const displayed = search.trim()
    ? popular.filter((c) => c.name.toLowerCase().includes(search.trim().toLowerCase()))
    : popular

  function getTeam(id: string): 'A' | 'B' | null {
    if (teamA.includes(id)) return 'A'
    if (teamB.includes(id)) return 'B'
    return null
  }

  function handlePickA(id: string) {
    if (teamA.includes(id)) {
      setTeamA((p) => p.filter((x) => x !== id))
    } else {
      setTeamB((p) => p.filter((x) => x !== id))
      setTeamA((p) => [...p, id])
    }
  }

  function handlePickB(id: string) {
    if (teamB.includes(id)) {
      setTeamB((p) => p.filter((x) => x !== id))
    } else {
      setTeamA((p) => p.filter((x) => x !== id))
      setTeamB((p) => [...p, id])
    }
  }

  function handleRemove(id: string) {
    setTeamA((p) => p.filter((x) => x !== id))
    setTeamB((p) => p.filter((x) => x !== id))
  }

  async function handleBattle() {
    if (!canBattle || isBattling) return
    setIsBattling(true)
    setError(null)
    try {
      await runBattle(teamA, teamB)
      router.push(`/battle?a=${teamA.join(',')}&b=${teamB.join(',')}`)
    } catch {
      setError('Battle failed. Try again.')
      setIsBattling(false)
    }
  }

  const byId = new Map(popular.map((c) => [c.id, c]))
  const teamAChars = teamA.map((id) => byId.get(id)).filter(Boolean) as Character[]
  const teamBChars = teamB.map((id) => byId.get(id)).filter(Boolean) as Character[]
  const canBattle = teamA.length > 0 && teamB.length > 0

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.4 } }
        @media (max-width: 760px) {
          .builder-grid { grid-template-columns: 1fr !important; }
          .roster-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 440px) {
          .roster-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <main style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '0 var(--gutter) 80px' }}>
        {/* Header */}
        <header style={{ textAlign: 'center', padding: '48px 0 40px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(56px, 10vw, 96px)',
              color: 'var(--gold)',
              textShadow: '0 0 40px var(--gold-glow)',
              lineHeight: 1,
              marginBottom: '8px',
            }}
          >
            SUPERBATTLE
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
            PICK YOUR DC CHAMPIONS. LET THEM FIGHT.
          </p>
        </header>

        {/* Section 01 — Roster */}
        <section style={{ marginBottom: '48px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '4px' }}>
            01 / ROSTER
          </p>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '40px', color: 'var(--text)', lineHeight: 1, marginBottom: '16px' }}>
            SELECT YOUR CHAMPIONS
          </h2>
          <input
            type="text"
            placeholder="Search characters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '400px',
              background: 'var(--surface)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              padding: '10px 14px',
              borderRadius: '4px',
              outline: 'none',
              marginBottom: '20px',
              display: 'block',
            }}
          />

          {loadError ? (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--red)' }}>
              Could not load characters. Please refresh.
            </p>
          ) : isLoading ? (
            <div className="roster-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="roster-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {displayed.map((char) => (
                <CharacterCard
                  key={char.id}
                  char={char}
                  team={getTeam(char.id)}
                  onPickA={() => handlePickA(char.id)}
                  onPickB={() => handlePickB(char.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section 02 — Matchup */}
        <section style={{ marginBottom: '32px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '4px' }}>
            02 / MATCHUP
          </p>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '40px', color: 'var(--text)', lineHeight: 1, marginBottom: '20px' }}>
            BUILD YOUR TEAMS
          </h2>
          <div
            className="builder-grid"
            style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'start' }}
          >
            <TeamColumn team="A" characters={teamAChars} onRemove={handleRemove} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 8px' }}>
              <LightningVS />
            </div>
            <TeamColumn team="B" characters={teamBChars} onRemove={handleRemove} />
          </div>
        </section>

        {/* Initiate button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleBattle}
            disabled={!canBattle || isBattling}
            style={{
              width: '100%',
              height: '72px',
              background: canBattle && !isBattling ? 'var(--gold)' : 'var(--surface-2)',
              color: canBattle && !isBattling ? '#0a0c10' : 'var(--text-muted)',
              fontFamily: 'var(--font-title)',
              fontSize: '28px',
              letterSpacing: '0.08em',
              border: 'none',
              cursor: canBattle && !isBattling ? 'pointer' : 'not-allowed',
              clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
              transition: 'background 0.2s ease, color 0.2s ease',
            }}
          >
            {isBattling ? 'GENERATING BATTLE…' : 'INITIATE BATTLE'}
          </button>
          {error && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--red)' }}>{error}</p>
          )}
        </div>

        {/* Footer */}
        <footer style={{ marginTop: '80px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto' }}>
            SuperBattle is a fan project and is not affiliated with, endorsed by, or associated with DC Comics or Warner Bros. All character names are trademarks of their respective owners.
          </p>
        </footer>
      </main>
    </>
  )
}
