import type { CompanionMemory } from '../../../types/companion'

/**
 * Storage registers for Richard's EFSM companion memory.
 * Richard only tracks recruitment quest progression.
 */
export class RichardMemory implements CompanionMemory {
  questStep = 0
}
