import type { CompanionMemory } from '../../../types/companion'

/**
 * Storage registers for Oboro's EFSM companion memory.
 */
export class OboroMemory implements CompanionMemory {
  talkCount = 0
  affinity = 0
  questStep = 0
  timesRefused = 0
}

