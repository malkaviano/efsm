export const zeraseDialogues = {
  firstEncounter: 'You bear the Dawn Rune... yet your will remains fragile, Prince.',
  alreadyRecruited: 'The Star Rune shines beside the Dawn Rune. Do not disturb my focus.',
  guardsFailed:
    'You are not yet ready for the truth of the Runes. Your fortress and your spirit remain inadequate.',
  recruited: 'The power of the 27 True Runes shall guide your fate. I will stand with you.',
} as const

export const zeraseReasons = {
  firstEncounter: 'First encounter with Zerase. Transitioned UNMET -> AVAILABLE.',
  alreadyRecruited: 'Companion was already recruited (terminal state).',
  guardsFailed: 'Guards failed for Zerase recruitment.',
  recruited:
    'All guards satisfied: Dawn Rune awakened, Castle Level >= 3, and Prince Level >= 25. Transitioned AVAILABLE -> RECRUITED.',
} as const

export const zeraseGuards = {
  dawnRuneRequired: 'Dawn Rune Awakened',
  castleLevelRequired: (currentLevel: number): string =>
    `Castle Level >= 3 (Current: ${currentLevel})`,
  princeLevelRequired: (currentLevel: number): string =>
    `Prince Level >= 25 (Current: ${currentLevel})`,
} as const

