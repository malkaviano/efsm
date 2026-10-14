import { describe, expect, it } from 'vitest'
import type { GameContext } from '../../../types/companion'
import { OboroCompanion } from './oboro'
import { oboroDialogues } from './oboro.dialogues'

const createMockContext = (overrides?: Partial<GameContext>): GameContext => ({
  princeLevel: 10,
  castleLevel: 1,
  partyMembers: ['Lyon'],
  inventory: [],
  storyFlags: {},
  ...overrides,
})

describe('OboroCompanion EFSM', () => {
  it('should initialize with UNMET state and zeroed registers', () => {
    const oboro = new OboroCompanion()
    expect(oboro.currentState).toBe('UNMET')
    expect(oboro.memory.talkCount).toBe(0)
    expect(oboro.memory.timesRefused).toBe(0)
  })

  it('should transition UNMET -> AVAILABLE on first contact', () => {
    const oboro = new OboroCompanion()
    const context = createMockContext()

    const res = oboro.recruit(context)
    expect(res.status).toBe('AVAILABLE')
    expect(res.dialogue).toBe(oboroDialogues.firstEncounter)
    expect(oboro.currentState).toBe('AVAILABLE')
  })

  it('should immediately recruit if helped with Rainwall investigation', () => {
    const oboro = new OboroCompanion()
    const context = createMockContext({ storyFlags: { helped_oboro_investigation: true } })

    oboro.recruit(context) // to AVAILABLE
    const res = oboro.recruit(context)

    expect(res.status).toBe('RECRUITED')
    expect(res.dialogue).toBe(oboroDialogues.helpedRecruited)
    expect(oboro.currentState).toBe('RECRUITED')
  })

  it('should require 5 recruitment requests through persistence mechanic', () => {
    const oboro = new OboroCompanion()
    const context = createMockContext()

    oboro.recruit(context) // talk 1: UNMET -> AVAILABLE
    expect(oboro.currentState).toBe('AVAILABLE')

    // talk 2
    let res = oboro.recruit(context)
    expect(res.status).toBe('QUEST_IN_PROGRESS')
    expect(oboro.currentState).toBe('QUEST_IN_PROGRESS')
    expect(oboro.memory.timesRefused).toBe(1)

    // talk 3
    res = oboro.recruit(context)
    expect(res.status).toBe('QUEST_IN_PROGRESS')
    expect(oboro.memory.timesRefused).toBe(2)

    // talk 4
    res = oboro.recruit(context)
    expect(res.status).toBe('QUEST_IN_PROGRESS')
    expect(oboro.memory.timesRefused).toBe(3)

    // talk 5 (5th total attempt)
    res = oboro.recruit(context)
    expect(res.status).toBe('RECRUITED')
    expect(res.dialogue).toBe(oboroDialogues.persistenceRecruited)
    expect(oboro.currentState).toBe('RECRUITED')
  })

  it('should transition to MISSED if raftfleet was burned', () => {
    const oboro = new OboroCompanion()
    const context = createMockContext({ storyFlags: { raftfleet_burned: true } })

    const res = oboro.recruit(context)
    expect(res.status).toBe('MISSED')
    expect(res.dialogue).toBe(oboroDialogues.missedWindow)
    expect(oboro.currentState).toBe('MISSED')
  })

  it('should return already recruited response if called after RECRUITED', () => {
    const oboro = new OboroCompanion()
    const context = createMockContext({ storyFlags: { helped_oboro_investigation: true } })

    oboro.recruit(context)
    oboro.recruit(context)
    const res = oboro.recruit(context)

    expect(res.status).toBe('RECRUITED')
    expect(res.dialogue).toBe(oboroDialogues.alreadyRecruited)
  })

  it('should reset properly to initial state', () => {
    const oboro = new OboroCompanion()
    const context = createMockContext({ storyFlags: { helped_oboro_investigation: true } })

    oboro.recruit(context)
    oboro.recruit(context)
    expect(oboro.currentState).toBe('RECRUITED')

    oboro.reset()
    expect(oboro.currentState).toBe('UNMET')
    expect(oboro.memory.talkCount).toBe(0)
    expect(oboro.memory.timesRefused).toBe(0)
  })
})
