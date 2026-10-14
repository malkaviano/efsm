import type {
  CompanionStatus,
  RecruitmentState,
} from '../../../types/companion'
import { BaseCompanion } from '../../companion.base'
import { OboroMemory } from './oboro.memory'
import {
  OboroAvailableState,
  OboroMissedState,
  OboroQuestInProgressState,
  OboroRecruitedState,
  OboroUnmetState,
} from './oboro.states'

/**
 * Oboro (The Private Detective) - Chiki Star
 * Operating from his ship in Raftfleet.
 * Can be recruited immediately if helped in Rainwall, or via persistence (asking 5 times).
 */
export class OboroCompanion extends BaseCompanion<OboroMemory> {
  readonly id = 'oboro'
  readonly name = 'Oboro'
  readonly starOfDestiny = 'Chiki Star'
  readonly role = 'Private Detective'
  readonly location = 'Ship at Raftfleet'

  memory: OboroMemory = new OboroMemory()

  readonly states: Record<CompanionStatus, RecruitmentState<OboroMemory>> = {
    UNMET: new OboroUnmetState(),
    AVAILABLE: new OboroAvailableState(),
    QUEST_IN_PROGRESS: new OboroQuestInProgressState(),
    RECRUITED: new OboroRecruitedState(),
    MISSED: new OboroMissedState(),
  }

  override reset(): void {
    super.reset()
    this.memory = new OboroMemory()
  }
}
