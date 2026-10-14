import { describe, expect, it } from 'vitest'
import type {
  Companion,
  CompanionMemory,
  CompanionStatus,
  GameContext,
  RecruitmentResponse,
  RecruitmentState,
} from '../types/companion'
import { BaseCompanion } from './companion.base'

const createMockContext = (): GameContext => ({
  princeLevel: 1,
  castleLevel: 1,
  partyMembers: [],
  inventory: [],
  storyFlags: {},
})

class TestMemory implements CompanionMemory {
  talkCount = 0
  affinity = 0
  questStep = 0
}

class MockState implements RecruitmentState<TestMemory> {
  readonly status: CompanionStatus
  private readonly targetStatus: CompanionStatus
  private readonly dialogueText: string

  constructor(status: CompanionStatus, targetStatus: CompanionStatus, dialogueText: string) {
    this.status = status
    this.targetStatus = targetStatus
    this.dialogueText = dialogueText
  }

  handle(companion: Companion<TestMemory>): RecruitmentResponse {
    companion.memory.talkCount += 1
    return {
      status: this.targetStatus,
      dialogue: this.dialogueText,
      contextUpdates: {},
    }
  }
}

class TestCompanion extends BaseCompanion<TestMemory> {
  readonly id = 'test-companion'
  readonly name = 'Test Hero'
  readonly starOfDestiny = 'Test Star'
  readonly role = 'Tester'
  readonly location = 'Test Arena'

  memory: TestMemory = new TestMemory()

  readonly states: Record<CompanionStatus, RecruitmentState<TestMemory>> = {
    UNMET: new MockState('UNMET', 'AVAILABLE', 'Hello from UNMET'),
    AVAILABLE: new MockState('AVAILABLE', 'RECRUITED', 'Recruited from AVAILABLE'),
    QUEST_IN_PROGRESS: new MockState('QUEST_IN_PROGRESS', 'RECRUITED', 'Done quest'),
    RECRUITED: new MockState('RECRUITED', 'RECRUITED', 'Already with you'),
    MISSED: new MockState('MISSED', 'MISSED', 'Gone forever'),
  }

  override reset(): void {
    super.reset()
    this.memory = new TestMemory()
  }
}

describe('BaseCompanion & RecruitmentState Orchestration', () => {
  it('should delegate recruitment to the active RecruitmentState and update currentState', () => {
    const companion = new TestCompanion()
    const context = createMockContext()

    expect(companion.currentState).toBe('UNMET')

    // First recruit: UNMET -> AVAILABLE
    const res1 = companion.recruit(context)
    expect(res1.status).toBe('AVAILABLE')
    expect(res1.dialogue).toBe('Hello from UNMET')
    expect(companion.currentState).toBe('AVAILABLE')
    expect(companion.memory.talkCount).toBe(1)

    // Second recruit: AVAILABLE -> RECRUITED
    const res2 = companion.recruit(context)
    expect(res2.status).toBe('RECRUITED')
    expect(res2.dialogue).toBe('Recruited from AVAILABLE')
    expect(companion.currentState).toBe('RECRUITED')
    expect(companion.memory.talkCount).toBe(2)
  })

  it('should reset properly to UNMET and clear companion memory', () => {
    const companion = new TestCompanion()
    const context = createMockContext()

    companion.recruit(context)
    companion.recruit(context)
    expect(companion.currentState).toBe('RECRUITED')

    companion.reset()
    expect(companion.currentState).toBe('UNMET')
    expect(companion.memory.talkCount).toBe(0)
  })
})
