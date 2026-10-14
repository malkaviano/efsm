import type {
  Companion,
  CompanionStatus,
  GameContext,
  RecruitmentResponse,
  RecruitmentState,
} from '../../../types/companion'
import { richardDialogues } from './richard.dialogues'
import type { RichardMemory } from './richard.memory'

export class RichardUnmetState implements RecruitmentState<RichardMemory> {
  readonly status: CompanionStatus = 'UNMET'

  handle(_companion: Companion<RichardMemory>, context: GameContext): RecruitmentResponse {
    if (context.storyFlags['sun_rune_war_ended']) {
      return {
        status: 'MISSED',
        dialogue: richardDialogues.missedWindow,
        contextUpdates: {},
      }
    }

    return {
      status: 'AVAILABLE',
      dialogue: richardDialogues.unmetEncounter,
      contextUpdates: {},
    }
  }
}

export class RichardAvailableState implements RecruitmentState<RichardMemory> {
  readonly status: CompanionStatus = 'AVAILABLE'

  handle(companion: Companion<RichardMemory>, context: GameContext): RecruitmentResponse {
    if (context.storyFlags['sun_rune_war_ended']) {
      return {
        status: 'MISSED',
        dialogue: richardDialogues.missedWindow,
        contextUpdates: {},
      }
    }

    if (context.castleLevel < 2) {
      return {
        status: 'AVAILABLE',
        dialogue: richardDialogues.castleTooLow,
        contextUpdates: {},
      }
    }

    if (!context.partyMembers.includes('Mueller')) {
      companion.memory.questStep = 1
      return {
        status: 'QUEST_IN_PROGRESS',
        dialogue: richardDialogues.needsMueller,
        contextUpdates: {},
      }
    }

    return {
      status: 'RECRUITED',
      dialogue: richardDialogues.recruitedWithMueller,
      contextUpdates: {},
    }
  }
}

export class RichardQuestInProgressState implements RecruitmentState<RichardMemory> {
  readonly status: CompanionStatus = 'QUEST_IN_PROGRESS'

  handle(_companion: Companion<RichardMemory>, context: GameContext): RecruitmentResponse {
    if (context.storyFlags['sun_rune_war_ended']) {
      return {
        status: 'MISSED',
        dialogue: richardDialogues.missedWindow,
        contextUpdates: {},
      }
    }

    if (context.partyMembers.includes('Mueller')) {
      return {
        status: 'RECRUITED',
        dialogue: richardDialogues.questRecruited,
        contextUpdates: {},
      }
    }

    return {
      status: 'QUEST_IN_PROGRESS',
      dialogue: richardDialogues.waitingForMueller,
      contextUpdates: {},
    }
  }
}

export class RichardRecruitedState implements RecruitmentState<RichardMemory> {
  readonly status: CompanionStatus = 'RECRUITED'

  handle(): RecruitmentResponse {
    return {
      status: 'RECRUITED',
      dialogue: richardDialogues.alreadyRecruited,
      contextUpdates: {},
    }
  }
}

export class RichardMissedState implements RecruitmentState<RichardMemory> {
  readonly status: CompanionStatus = 'MISSED'

  handle(): RecruitmentResponse {
    return {
      status: 'MISSED',
      dialogue: richardDialogues.missedWindow,
      contextUpdates: {},
    }
  }
}
