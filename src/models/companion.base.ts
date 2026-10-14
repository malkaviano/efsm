import type {
  Companion,
  CompanionMemory,
  CompanionStatus,
  GameContext,
  RecruitmentResponse,
  RecruitmentState,
} from '../types/companion'

/**
 * Base companion implementation providing standard EFSM orchestration with generic memory TMemory.
 * Concrete companions define their specific memory storage and states, while this base
 * class delegates recruitment transitions to the active RecruitmentState<TMemory>.
 */
export abstract class BaseCompanion<TMemory extends CompanionMemory = CompanionMemory>
  implements Companion<TMemory>
{
  abstract readonly id: string
  abstract readonly name: string
  abstract readonly starOfDestiny: string
  abstract readonly role: string
  abstract readonly location: string

  currentState: CompanionStatus = 'UNMET'
  abstract memory: TMemory

  abstract readonly states: Record<CompanionStatus, RecruitmentState<TMemory>>

  /**
   * Orchestrates recruitment by delegating evaluation and transitions
   * to the current state implementation.
   */
  recruit(context: GameContext): RecruitmentResponse {
    const currentState = this.states[this.currentState]
    const response = currentState.handle(this, context)
    this.currentState = response.status
    return response
  }

  reset(): void {
    this.currentState = 'UNMET'
  }
}
