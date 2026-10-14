import type { CompanionMemory } from '../../../types/companion'

/**
 * Storage registers for Zerase's EFSM companion memory.
 * Zerase relies entirely on world context (Dawn Rune, Castle Level, Prince Level),
 * so her internal companion memory registers are stateless.
 */
export class ZeraseMemory implements CompanionMemory {}
