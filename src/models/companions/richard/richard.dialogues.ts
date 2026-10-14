export const richardDialogues = {
  unmetEncounter: '...Zzz... Huh? Who are you? I was busy taking a nap by the river.',
  alreadyRecruited: 'My sword already belongs to your army, Prince! Let us win this war.',
  missedWindow: '...The time has passed. Destiny has drifted elsewhere.',
  castleTooLow:
    'Fight for you? Your hideout barely has room to sleep! Come back when you have a real stronghold.',
  needsMueller:
    'Your cause sounds interesting... But I will only join if my old mentor Mueller approves. Bring him here!',
  recruitedWithMueller:
    'Oh! Mueller is with you? Haha, then I have no reason to refuse! My blade is yours, Prince!',
  waitingForMueller: 'I am still waiting for Mueller. Where is he?',
  questRecruited:
    'Master Mueller! You truly pledged allegiance to the Prince? Very well, I, Richard, shall join your cause!',
  fallback: '...',
} as const

export const richardReasons = {
  firstEncounter: 'First encounter with Richard. Transitioned UNMET -> AVAILABLE.',
  alreadyRecruited: 'Companion was already recruited (terminal state).',
  missedWindow: 'Time guard expired: Richard can no longer be recruited.',
  castleTooLow: 'Guard failed: Requires Castle Level >= 2.',
  needsMueller:
    'Partial guard satisfaction: Castle OK, but Mueller missing. Transitioned AVAILABLE -> QUEST_IN_PROGRESS.',
  recruitedWithMueller:
    'All guards satisfied: Mueller in party and Castle Level >= 2. Transitioned AVAILABLE -> RECRUITED.',
  waitingForMueller: 'Guard failed: Mueller is not yet in the active party.',
  questRecruited:
    'Quest guard satisfied: Mueller brought to the waterfall. Transitioned QUEST_IN_PROGRESS -> RECRUITED.',
  fallback: 'Unhandled state in EFSM.',
} as const

export const richardGuards = {
  castleLevelRequired: (currentLevel: number): string =>
    `Castle Level >= 2 (Current: ${currentLevel})`,
  muellerRequired: 'Mueller in Party',
  bringMueller: 'Bring Mueller in active party',
} as const

