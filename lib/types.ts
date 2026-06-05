export interface Character {
  id: string
  name: string
  alignment: 'good' | 'bad' | 'neutral'
  image_url: string
  intelligence: number
  strength: number
  speed: number
  durability: number
  power: number
  combat: number
  powers_text: string
}

export interface BattleResponse {
  story: string[]
  winner: 'A' | 'B' | 'tie'
  score_a: number
  score_b: number
  team_a: Character[]
  team_b: Character[]
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}
