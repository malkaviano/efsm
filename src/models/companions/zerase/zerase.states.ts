import type {
  Companion,
  CompanionStatus,
  GameContext,
  RecruitmentResponse,
  RecruitmentState,
} from '../../../types/companion'
import { zeraseDialogues } from './zerase.dialogues'
import type { ZeraseMemory } from './zerase.memory'

export class ZeraseUnmetState implements RecruitmentState<ZeraseMemory> {
  readonly status: CompanionStatus = 'UNMET'

  handle(_companion: Companion<ZeraseMemory>): RecruitmentResponse {
    return {
      status: 'AVAILABLE',
      dialogue: zeraseDialogues.firstEncounter,
      contextUpdates: {},
    }
  }
}

export class ZeraseAvailableState implements RecruitmentState<ZeraseMemory> {
  readonly status: CompanionStatus = 'AVAILABLE'

  handle(_companion: Companion<ZeraseMemory>, context: GameContext): RecruitmentResponse {
    const hasDawnRune =
      context.inventory.includes('Dawn Rune') || Boolean(context.storyFlags['dawn_rune_awakened'])
    const hasCastleLv3 = context.castleLevel >= 3
    const hasMinLevel = context.princeLevel >= 25

    if (!hasDawnRune || !hasCastleLv3 || !hasMinLevel) {
      return {
        status: 'AVAILABLE',
        dialogue: zeraseDialogues.guardsFailed,
        contextUpdates: {},
      }
    }

    return {
      status: 'RECRUITED',
      dialogue: zeraseDialogues.recruited,
      contextUpdates: {},
    }
  }
}

export class ZeraseQuestInProgressState implements RecruitmentState<ZeraseMemory> {
  readonly status: CompanionStatus = 'QUEST_IN_PROGRESS'

  handle(companion: Companion<ZeraseMemory>, context: GameContext): RecruitmentResponse {
    return new ZeraseAvailableState().handle(companion, context)
  }
}

export class ZeraseRecruitedState implements RecruitmentState<ZeraseMemory> {
  readonly status: CompanionStatus = 'RECRUITED'

  handle(): RecruitmentResponse {
    return {
      status: 'RECRUITED',
      dialogue: zeraseDialogues.alreadyRecruited,
      contextUpdates: {},
    }
  }
}

export class ZeraseMissedState implements RecruitmentState<ZeraseMemory> {
  readonly status: CompanionStatus = 'MISSED'

  handle(): RecruitmentResponse {
    return {
      status: 'MISSED',
      dialogue: '...',
      contextUpdates: {},
    }
  }
}
