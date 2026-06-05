import { redirect } from 'next/navigation'
import { BattleClient } from '@/components/battle/BattleClient'

interface BattlePageProps {
  searchParams: Promise<{ a?: string; b?: string }>
}

export default async function BattlePage({ searchParams }: BattlePageProps) {
  const params = await searchParams
  const teamA = params.a?.split(',').filter(Boolean) ?? []
  const teamB = params.b?.split(',').filter(Boolean) ?? []

  if (teamA.length === 0 || teamB.length === 0) {
    redirect('/')
  }

  return <BattleClient teamAIds={teamA} teamBIds={teamB} />
}
