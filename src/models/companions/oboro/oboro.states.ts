import type {
  Companion,
  CompanionStatus,
  GameContext,
  RecruitmentResponse,
  RecruitmentState,
} from '../../../types/companion'
import { oboroDialogues } from './oboro.dialogues'
import type { OboroMemory } from './oboro.memory'

export class OboroUnmetState implements RecruitmentState<OboroMemory> {
  readonly status: CompanionStatus = 'UNMET'

  handle(companion: Companion<OboroMemory>, context: GameContext): RecruitmentResponse {
    if (context.storyFlags['sun_rune_war_ended'] || context.storyFlags['raftfleet_burned']) {
      return {
        status: 'MISSED',
        dialogue: oboroDialogues.missedWindow,
        contextUpdates: {},
      }
    }

    companion.memory.talkCount += 1
    return {
      status: 'AVAILABLE',
      dialogue: oboroDialogues.firstEncounter,
      contextUpdates: {},
    }
  }
}

export class OboroAvailableState implements RecruitmentState<OboroMemory> {
  readonly status: CompanionStatus = 'AVAILABLE'

  handle(companion: Companion<OboroMemory>, context: GameContext): RecruitmentResponse {
    if (context.storyFlags['sun_rune_war_ended'] || context.storyFlags['raftfleet_burned']) {
      return {
        status: 'MISSED',
        dialogue: oboroDialogues.missedWindow,
        contextUpdates: {},
      }
    }

    companion.memory.talkCount += 1

    if (context.storyFlags['helped_oboro_investigation']) {
      return {
        status: 'RECRUITED',
        dialogue: oboroDialogues.helpedRecruited,
        contextUpdates: {},
      }
    }

    companion.memory.timesRefused += 1
    const remaining = 5 - companion.memory.talkCount

    if (companion.memory.talkCount < 5) {
      return {
        status: 'QUEST_IN_PROGRESS',
        dialogue: oboroDialogues.persistenceFailed(remaining),
        contextUpdates: {},
      }
    }

    return {
      status: 'RECRUITED',
      dialogue: oboroDialogues.persistenceRecruited,
      contextUpdates: {},
    }
  }
}

export class OboroQuestInProgressState implements RecruitmentState<OboroMemory> {
  readonly status: CompanionStatus = 'QUEST_IN_PROGRESS'

  handle(companion: Companion<OboroMemory>, context: GameContext): RecruitmentResponse {
    return new OboroAvailableState().handle(companion, context)
  }
}

export class OboroRecruitedState implements RecruitmentState<OboroMemory> {
  readonly status: CompanionStatus = 'RECRUITED'

  handle(): RecruitmentResponse {
    return {
      status: 'RECRUITED',
      dialogue: oboroDialogues.alreadyRecruited,
      contextUpdates: {},
    }
  }
}

export class OboroMissedState implements RecruitmentState<OboroMemory> {
  readonly status: CompanionStatus = 'MISSED'

  handle(): RecruitmentResponse {
    return {
      status: 'MISSED',
      dialogue: oboroDialogues.missedWindow,
      contextUpdates: {},
    }
  }
}
