import { Character, BattleResponse, ApiError } from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init)
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new ApiError(res.status, text)
  }
  return res.json() as Promise<T>
}

export function getPopularCharacters(): Promise<Character[]> {
  return apiFetch('/api/characters/popular')
}

export function searchCharacters(q: string): Promise<Character[]> {
  return apiFetch(`/api/characters/search?q=${encodeURIComponent(q)}`)
}

export function runBattle(teamA: string[], teamB: string[]): Promise<BattleResponse> {
  return apiFetch('/api/battle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ team_a: teamA, team_b: teamB }),
  })
}
