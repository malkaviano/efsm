export type CompanionStatus =
  | 'UNMET'
  | 'AVAILABLE'
  | 'QUEST_IN_PROGRESS'
  | 'RECRUITED'
  | 'MISSED'

export interface GameContext {
  /** Prince or player current level */
  princeLevel: number
  /** Castle or Headquarters level (1 through 4) */
  castleLevel: number
  /** Current active party members (e.g. ['Lyon', 'Georg']) */
  partyMembers: string[]
  /** Key items in inventory */
  inventory: string[]
  /** Story progression event flags */
  storyFlags: Record<string, boolean>
}

export interface RecruitmentResponse {
  /** Resulting companion status after recruitment attempt */
  status: CompanionStatus
  /** Companion dialogue line upon recruit attempt */
  dialogue: string
  /** Context updates produced by the recruitment transition (empty object {} if none) */
  contextUpdates: Partial<GameContext>
}

/**
 * Base interface representing companion memory registers used as storage in the EFSM.
 */
export interface CompanionMemory {}

/**
 * Encapsulates the recruitment behavior and transition logic for a specific companion status.
 * Accepts a generic TMemory parameter to provide strongly-typed memory access without type casts.
 */
export interface RecruitmentState<TMemory extends CompanionMemory = CompanionMemory> {
  readonly status: CompanionStatus
  handle(companion: Companion<TMemory>, context: GameContext): RecruitmentResponse
}

/**
 * Represents an EFSM companion with generic memory storage TMemory.
 */
export interface Companion<TMemory extends CompanionMemory = CompanionMemory> {
  id: string
  name: string
  starOfDestiny: string
  role: string
  location: string
  currentState: CompanionStatus
  /** Strongly-typed memory storage registers of the companion */
  memory: TMemory
  /** State definitions configured with the companion's specific TMemory */
  states: Record<CompanionStatus, RecruitmentState<TMemory>>
  /**
   * Recruitment method that orchestrates state transitions by delegating
   * to the current RecruitmentState handler.
   */
  recruit(context: GameContext): RecruitmentResponse
  /** Reset companion to initial state */
  reset(): void
}
