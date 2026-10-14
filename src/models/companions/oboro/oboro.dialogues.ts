export const oboroDialogues = {
  alreadyRecruited: 'The Oboro Detective Agency remains at your service, Your Highness.',
  missedWindow: '...It is too late. Our circumstances no longer align.',
  firstEncounter:
    'Greetings! I am Oboro of the Detective Agency. Are you in need of confidential intelligence?',
  helpedRecruited:
    'You proved yourself trustworthy during our Rainwall investigation. My agency accepts your permanent retainer!',
  persistenceFailed: (remaining: number): string =>
    `A detective does not sign on so easily. You have not convinced me yet... (${remaining} attempt(s) remaining)`,
  persistenceRecruited:
    'Your persistence is remarkable, Prince! Very few ask five times with such sincerity. We accept your offer!',
} as const

export const oboroReasons = {
  alreadyRecruited: 'Companion was already recruited (terminal state).',
  missedWindow:
    'Critical story event missed window: Raftfleet event passed before recruitment.',
  firstEncounter: 'First encounter with Oboro. Transitioned UNMET -> AVAILABLE.',
  helpedRecruited:
    'Story Guard satisfied: "helped_oboro_investigation" is true. Transitioned directly to RECRUITED.',
  persistenceFailed: (count: number): string =>
    `Persistence guard evaluated (EFSM variable talkCount < 5). Progress: ${count}/5.`,
  persistenceRecruited:
    'Persistence guard satisfied (talkCount >= 5). Transitioned QUEST_IN_PROGRESS -> RECRUITED.',
} as const

export const oboroGuards = {
  persistenceOrInvestigation: (remaining: number): string =>
    `Ask ${remaining} more time(s) or have helped with the Rainwall investigation`,
} as const

