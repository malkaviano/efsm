import type {
  CompanionStatus,
  RecruitmentState,
} from '../../../types/companion'
import { BaseCompanion } from '../../companion.base'
import { ZeraseMemory } from './zerase.memory'
import {
  ZeraseAvailableState,
  ZeraseMissedState,
  ZeraseQuestInProgressState,
  ZeraseRecruitedState,
  ZeraseUnmetState,
} from './zerase.states'

/**
 * Zerase (The Star Rune Wielder) - Teni Star
 * Found at Ceras Lake Ruins.
 * Requires the awakened Dawn Rune, Castle Level >= 3, and Prince Level >= 25.
 */
export class ZeraseCompanion extends BaseCompanion<ZeraseMemory> {
  readonly id = 'zerase'
  readonly name = 'Zerase'
  readonly starOfDestiny = 'Teni Star'
  readonly role = 'Star Rune Sorceress'
  readonly location = 'Ceras Lake Ruins'

  memory: ZeraseMemory = new ZeraseMemory()

  readonly states: Record<CompanionStatus, RecruitmentState<ZeraseMemory>> = {
    UNMET: new ZeraseUnmetState(),
    AVAILABLE: new ZeraseAvailableState(),
    QUEST_IN_PROGRESS: new ZeraseQuestInProgressState(),
    RECRUITED: new ZeraseRecruitedState(),
    MISSED: new ZeraseMissedState(),
  }

  override reset(): void {
    super.reset()
    this.memory = new ZeraseMemory()
  }
}
