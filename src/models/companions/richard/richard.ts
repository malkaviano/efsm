import type {
  CompanionStatus,
  RecruitmentState,
} from '../../../types/companion'
import { BaseCompanion } from '../../companion.base'
import { RichardMemory } from './richard.memory'
import {
  RichardAvailableState,
  RichardMissedState,
  RichardQuestInProgressState,
  RichardRecruitedState,
  RichardUnmetState,
} from './richard.states'

/**
 * Richard (The Prodigious Swordsman) - Chisa Star
 * Resting near the Byakuren Waterfall.
 * Requires Castle Level >= 2 and Mueller in the active party.
 */
export class RichardCompanion extends BaseCompanion<RichardMemory> {
  readonly id = 'richard'
  readonly name = 'Richard'
  readonly starOfDestiny = 'Chisa Star'
  readonly role = 'Legendary Swordsman'
  readonly location = 'Byakuren Waterfall'

  memory: RichardMemory = new RichardMemory()

  readonly states: Record<CompanionStatus, RecruitmentState<RichardMemory>> = {
    UNMET: new RichardUnmetState(),
    AVAILABLE: new RichardAvailableState(),
    QUEST_IN_PROGRESS: new RichardQuestInProgressState(),
    RECRUITED: new RichardRecruitedState(),
    MISSED: new RichardMissedState(),
  }

  override reset(): void {
    super.reset()
    this.memory = new RichardMemory()
  }
}
