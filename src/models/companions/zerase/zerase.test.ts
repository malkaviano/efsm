import { describe, expect, it } from 'vitest'
import type { GameContext } from '../../../types/companion'
import { ZeraseCompanion } from './zerase'
import { zeraseDialogues } from './zerase.dialogues'

const createMockContext = (overrides?: Partial<GameContext>): GameContext => ({
  princeLevel: 10,
  castleLevel: 1,
  partyMembers: ['Lyon'],
  inventory: [],
  storyFlags: {},
  ...overrides,
})

describe('ZeraseCompanion EFSM', () => {
  it('should initialize with UNMET state', () => {
    const zerase = new ZeraseCompanion()
    expect(zerase.currentState).toBe('UNMET')
  })

  it('should transition UNMET -> AVAILABLE on first contact', () => {
    const zerase = new ZeraseCompanion()
    const context = createMockContext()

    const res = zerase.recruit(context)
    expect(res.status).toBe('AVAILABLE')
    expect(res.dialogue).toBe(zeraseDialogues.firstEncounter)
    expect(zerase.currentState).toBe('AVAILABLE')
  })

  it('should fail guards if Dawn Rune, Castle Lv 3, or Prince Lv 25 are missing', () => {
    const zerase = new ZeraseCompanion()
    const context = createMockContext({ princeLevel: 15, castleLevel: 2, inventory: [] })

    zerase.recruit(context) // to AVAILABLE
    const res = zerase.recruit(context)

    expect(res.status).toBe('AVAILABLE')
    expect(res.dialogue).toBe(zeraseDialogues.guardsFailed)
    expect(zerase.currentState).toBe('AVAILABLE')
  })

  it('should transition to RECRUITED when all guards are fulfilled via inventory item', () => {
    const zerase = new ZeraseCompanion()
    const context = createMockContext({
      princeLevel: 30,
      castleLevel: 3,
      inventory: ['Dawn Rune'],
    })

    zerase.recruit(context) // to AVAILABLE
    const res = zerase.recruit(context)

    expect(res.status).toBe('RECRUITED')
    expect(res.dialogue).toBe(zeraseDialogues.recruited)
    expect(zerase.currentState).toBe('RECRUITED')
  })

  it('should transition to RECRUITED when Dawn Rune is fulfilled via story flag', () => {
    const zerase = new ZeraseCompanion()
    const context = createMockContext({
      princeLevel: 25,
      castleLevel: 4,
      storyFlags: { dawn_rune_awakened: true },
    })

    zerase.recruit(context) // to AVAILABLE
    const res = zerase.recruit(context)

    expect(res.status).toBe('RECRUITED')
    expect(res.dialogue).toBe(zeraseDialogues.recruited)
  })

  it('should return already recruited response if called after RECRUITED', () => {
    const zerase = new ZeraseCompanion()
    const context = createMockContext({
      princeLevel: 25,
      castleLevel: 3,
      inventory: ['Dawn Rune'],
    })

    zerase.recruit(context)
    zerase.recruit(context)
    const res = zerase.recruit(context)

    expect(res.status).toBe('RECRUITED')
    expect(res.dialogue).toBe(zeraseDialogues.alreadyRecruited)
  })

  it('should reset properly to initial state', () => {
    const zerase = new ZeraseCompanion()
    const context = createMockContext({
      princeLevel: 25,
      castleLevel: 3,
      inventory: ['Dawn Rune'],
    })

    zerase.recruit(context)
    zerase.recruit(context)
    expect(zerase.currentState).toBe('RECRUITED')

    zerase.reset()
    expect(zerase.currentState).toBe('UNMET')
  })
})
