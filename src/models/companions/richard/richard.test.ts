import { describe, expect, it } from 'vitest'
import type { GameContext } from '../../../types/companion'
import { RichardCompanion } from './richard'
import { richardDialogues } from './richard.dialogues'

const createMockContext = (overrides?: Partial<GameContext>): GameContext => ({
  princeLevel: 10,
  castleLevel: 1,
  partyMembers: ['Lyon'],
  inventory: [],
  storyFlags: {},
  ...overrides,
})

describe('RichardCompanion EFSM', () => {
  it('should initialize with UNMET state and zeroed registers', () => {
    const richard = new RichardCompanion()
    expect(richard.currentState).toBe('UNMET')
    expect(richard.memory.questStep).toBe(0)
  })

  it('should transition UNMET -> AVAILABLE on first recruit attempt', () => {
    const richard = new RichardCompanion()
    const context = createMockContext()

    const res = richard.recruit(context)
    expect(res.status).toBe('AVAILABLE')
    expect(res.dialogue).toBe(richardDialogues.unmetEncounter)
    expect(richard.currentState).toBe('AVAILABLE')
  })

  it('should remain AVAILABLE when castle level < 2', () => {
    const richard = new RichardCompanion()
    const context = createMockContext({ castleLevel: 1 })

    richard.recruit(context) // UNMET -> AVAILABLE
    const res = richard.recruit(context) // Evaluates AVAILABLE guards

    expect(res.status).toBe('AVAILABLE')
    expect(res.dialogue).toBe(richardDialogues.castleTooLow)
    expect(richard.currentState).toBe('AVAILABLE')
  })

  it('should transition AVAILABLE -> QUEST_IN_PROGRESS when Castle Lv >= 2 but Mueller missing', () => {
    const richard = new RichardCompanion()
    const context = createMockContext({ castleLevel: 2, partyMembers: ['Lyon'] })

    richard.recruit(context) // UNMET -> AVAILABLE
    const res = richard.recruit(context) // AVAILABLE -> QUEST_IN_PROGRESS

    expect(res.status).toBe('QUEST_IN_PROGRESS')
    expect(res.dialogue).toBe(richardDialogues.needsMueller)
    expect(richard.currentState).toBe('QUEST_IN_PROGRESS')
    expect(richard.memory.questStep).toBe(1)
  })

  it('should transition QUEST_IN_PROGRESS -> RECRUITED when Mueller is brought to party', () => {
    const richard = new RichardCompanion()
    const context = createMockContext({ castleLevel: 2, partyMembers: ['Lyon'] })

    richard.recruit(context) // to AVAILABLE
    richard.recruit(context) // to QUEST_IN_PROGRESS

    // Now bring Mueller
    const updatedContext = createMockContext({
      castleLevel: 2,
      partyMembers: ['Lyon', 'Mueller'],
    })
    const res = richard.recruit(updatedContext)

    expect(res.status).toBe('RECRUITED')
    expect(res.dialogue).toBe(richardDialogues.questRecruited)
    expect(richard.currentState).toBe('RECRUITED')
  })

  it('should transition directly AVAILABLE -> RECRUITED if Mueller is already in party', () => {
    const richard = new RichardCompanion()
    const context = createMockContext({ castleLevel: 2, partyMembers: ['Mueller'] })

    richard.recruit(context) // to AVAILABLE
    const res = richard.recruit(context)

    expect(res.status).toBe('RECRUITED')
    expect(res.dialogue).toBe(richardDialogues.recruitedWithMueller)
    expect(richard.currentState).toBe('RECRUITED')
  })

  it('should transition to MISSED if story window closed', () => {
    const richard = new RichardCompanion()
    const context = createMockContext({ storyFlags: { sun_rune_war_ended: true } })

    const res = richard.recruit(context)
    expect(res.status).toBe('MISSED')
    expect(res.dialogue).toBe(richardDialogues.missedWindow)
    expect(richard.currentState).toBe('MISSED')
  })

  it('should reset properly to initial state', () => {
    const richard = new RichardCompanion()
    const context = createMockContext({ castleLevel: 2, partyMembers: ['Mueller'] })

    richard.recruit(context)
    richard.recruit(context)
    expect(richard.currentState).toBe('RECRUITED')

    richard.reset()
    expect(richard.currentState).toBe('UNMET')
    expect(richard.memory.questStep).toBe(0)
  })

  it('should return already recruited response if called after RECRUITED', () => {
    const richard = new RichardCompanion()
    const context = createMockContext({ castleLevel: 2, partyMembers: ['Mueller'] })

    richard.recruit(context)
    richard.recruit(context)
    const res = richard.recruit(context)

    expect(res.status).toBe('RECRUITED')
    expect(res.dialogue).toBe(richardDialogues.alreadyRecruited)
  })

  it('should always return non-nullable contextUpdates object', () => {
    const richard = new RichardCompanion()
    const context = createMockContext()
    const res = richard.recruit(context)

    expect(typeof res.contextUpdates).toBe('object')
    expect(res.contextUpdates).not.toBeNull()
  })
})
