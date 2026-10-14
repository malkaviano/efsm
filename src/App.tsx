import { useState } from 'react'
import { OboroCompanion, RichardCompanion, ZeraseCompanion } from './models/companions'
import type {
  Companion,
  CompanionStatus,
  GameContext,
  RecruitmentResponse,
} from './types/companion'

interface LogEntry {
  id: number
  companionName: string
  timestamp: string
  response: RecruitmentResponse
}

const statusColors: Record<CompanionStatus, { bg: string; text: string; border: string }> = {
  UNMET: { bg: 'bg-zinc-800/80', text: 'text-zinc-400', border: 'border-zinc-700' },
  AVAILABLE: { bg: 'bg-amber-950/60', text: 'text-amber-300', border: 'border-amber-700/60' },
  QUEST_IN_PROGRESS: { bg: 'bg-blue-950/60', text: 'text-blue-300', border: 'border-blue-700/60' },
  RECRUITED: { bg: 'bg-emerald-950/60', text: 'text-emerald-300', border: 'border-emerald-600/60' },
  MISSED: { bg: 'bg-rose-950/60', text: 'text-rose-400', border: 'border-rose-800/60' },
}

export default function App() {
  // Initialize EFSM companions
  const [companions, setCompanions] = useState<Companion[]>([
    new RichardCompanion(),
    new ZeraseCompanion(),
    new OboroCompanion(),
  ])

  const [selectedCompanionId, setSelectedCompanionId] = useState<string>('richard')

  // Global World Context (External EFSM Variables)
  const [context, setContext] = useState<GameContext>({
    princeLevel: 20,
    castleLevel: 1,
    partyMembers: ['Lyon'],
    inventory: ['Falena Seal'],
    storyFlags: {
      helped_oboro_investigation: false,
      dawn_rune_awakened: false,
      sun_rune_war_ended: false,
    },
  })

  // EFSM transition response history
  const [lastResponse, setLastResponse] = useState<{
    companionId: string
    response: RecruitmentResponse
  } | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])

  const currentCompanion =
    companions.find((c) => c.id === selectedCompanionId) || companions[0]

  // Trigger recruit(context) action
  const handleRecruit = () => {
    const response = currentCompanion.recruit(context)

    // Apply any contextUpdates to game context
    if (Object.keys(response.contextUpdates).length > 0) {
      setContext((prev) => ({ ...prev, ...response.contextUpdates }))
    }

    // Force re-render of companions after internal EFSM mutation
    setCompanions([...companions])

    setLastResponse({
      companionId: currentCompanion.id,
      response,
    })

    setLogs((prev) => [
      {
        id: Date.now(),
        companionName: currentCompanion.name,
        timestamp: new Date().toLocaleTimeString(),
        response,
      },
      ...prev,
    ])
  }

  // Reset selected companion state
  const handleResetCompanion = () => {
    currentCompanion.reset()
    setCompanions([...companions])
    setLastResponse(null)
  }

  // Toggle party members
  const togglePartyMember = (member: string) => {
    setContext((prev) => ({
      ...prev,
      partyMembers: prev.partyMembers.includes(member)
        ? prev.partyMembers.filter((m) => m !== member)
        : [...prev.partyMembers, member],
    }))
  }

  // Toggle inventory items
  const toggleInventoryItem = (item: string) => {
    setContext((prev) => ({
      ...prev,
      inventory: prev.inventory.includes(item)
        ? prev.inventory.filter((i) => i !== item)
        : [...prev.inventory, item],
    }))
  }

  // Toggle story flags
  const toggleStoryFlag = (flagKey: string) => {
    setContext((prev) => ({
      ...prev,
      storyFlags: {
        ...prev.storyFlags,
        [flagKey]: !prev.storyFlags[flagKey],
      },
    }))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header: EFSM Simulator */}
      <header className="border-b border-amber-900/40 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-mono text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 border border-amber-300/40">
              EFSM
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                EFSM <span className="text-amber-400 font-serif font-normal">| Companion Recruitment Engine</span>
              </h1>
              <p className="text-xs text-slate-400">
                Extended Finite State Machine simulator for RPG companion recruitment systems
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: World Context (EFSM External Inputs) */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <span className="text-amber-400">⚔️</span> Game Context (EFSM Input)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                External world variables evaluated by transition guards.
              </p>
            </div>

            {/* Castle Level Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Headquarters / Castle Level:</span>
                <span className="text-amber-400 font-bold">Level {context.castleLevel} / 4</span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                value={context.castleLevel}
                onChange={(e) => setContext({ ...context, castleLevel: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Lv 1 (Raftfleet)</span>
                <span>Lv 2 (Ceras Lake)</span>
                <span>Lv 3 (Fortress)</span>
                <span>Lv 4 (Palace)</span>
              </div>
            </div>

            {/* Prince Level Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Prince Level:</span>
                <span className="text-cyan-400 font-bold">Lv {context.princeLevel}</span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={context.princeLevel}
                onChange={(e) => setContext({ ...context, princeLevel: Number(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Active Party Members */}
            <div className="space-y-2">
              <span className="text-xs text-slate-300 font-medium block">Active Party Members:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Lyon', 'Mueller', 'Georg Prime', 'Kyle'].map((member) => {
                  const inParty = context.partyMembers.includes(member)
                  return (
                    <button
                      key={member}
                      onClick={() => togglePartyMember(member)}
                      className={`px-3 py-2 rounded-lg text-left font-medium transition border flex items-center justify-between ${
                        inParty
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span>{member}</span>
                      <span className="text-[10px]">{inParty ? '✓' : '+'}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Key Items */}
            <div className="space-y-2">
              <span className="text-xs text-slate-300 font-medium block">Key Inventory:</span>
              <div className="grid grid-cols-1 gap-2 text-xs">
                {['Dawn Rune', 'Falena Seal', 'Byakuren Fish Hook'].map((item) => {
                  const hasItem = context.inventory.includes(item)
                  return (
                    <button
                      key={item}
                      onClick={() => toggleInventoryItem(item)}
                      className={`px-3 py-2 rounded-lg text-left font-medium transition border flex items-center justify-between ${
                        hasItem
                          ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span>{item}</span>
                      <span className="text-[10px]">{hasItem ? '✓' : '+'}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Story Flags */}
            <div className="space-y-2">
              <span className="text-xs text-slate-300 font-medium block">Story Flags:</span>
              <div className="space-y-2 text-xs">
                {[
                  { key: 'helped_oboro_investigation', label: 'Helped Oboro in Rainwall' },
                  { key: 'dawn_rune_awakened', label: 'Dawn Rune Awakened' },
                  { key: 'sun_rune_war_ended', label: 'War Concluded (Missable Window Closed)' },
                ].map(({ key, label }) => {
                  const isActive = Boolean(context.storyFlags[key])
                  return (
                    <label
                      key={key}
                      className="flex items-center gap-2 cursor-pointer bg-slate-800/40 hover:bg-slate-800/70 p-2 rounded-lg border border-slate-700/40 transition"
                    >
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => toggleStoryFlag(key)}
                        className="rounded accent-amber-500"
                      />
                      <span className={isActive ? 'text-amber-200' : 'text-slate-400'}>{label}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Companion Card, State Diagram & Recruitment Response */}
        <section className="lg:col-span-8 space-y-6">
          {/* Companion Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {companions.map((c) => {
              const isSelected = c.id === currentCompanion.id
              const colors = statusColors[c.currentState]
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCompanionId(c.id)}
                  className={`flex-1 min-w-[180px] p-3 rounded-xl border text-left transition flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/70 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-white">{c.name}</span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}
                    >
                      {c.currentState}
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-400/80 font-serif">{c.starOfDestiny}</span>
                </button>
              )
            })}
          </div>

          {/* Detailed Selected Companion Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-white">{currentCompanion.name}</h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-serif">
                    {currentCompanion.starOfDestiny}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {currentCompanion.role} • Location: <span className="text-slate-300">{currentCompanion.location}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCompanion}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition"
                  title="Reset companion internal variables and state"
                >
                  ↺ Reset EFSM
                </button>
              </div>
            </div>

            {/* EFSM State Flow Diagram */}
            <div className="mt-5 mb-6 space-y-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                Extended Finite State Machine Flow:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-center font-mono">
                {(['UNMET', 'AVAILABLE', 'QUEST_IN_PROGRESS', 'RECRUITED', 'MISSED'] as CompanionStatus[]).map(
                  (state) => {
                    const isActive = currentCompanion.currentState === state
                    const colors = statusColors[state]
                    return (
                      <div
                        key={state}
                        className={`p-2.5 rounded-lg border transition-all ${
                          isActive
                            ? `${colors.bg} ${colors.text} ${colors.border} ring-2 ring-amber-400/50 scale-105 font-bold shadow-md`
                            : 'bg-slate-950/40 border-slate-800 text-slate-600'
                        }`}
                      >
                        <div className="text-[10px] opacity-75">{isActive ? '● ACTIVE' : '○'}</div>
                        <div className="text-xs truncate">{state}</div>
                      </div>
                    )
                  }
                )}
              </div>
            </div>

            {/* Action Trigger: recruit(context) */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button
                onClick={handleRecruit}
                disabled={currentCompanion.currentState === 'RECRUITED' || currentCompanion.currentState === 'MISSED'}
                className={`w-full sm:w-auto flex-1 py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-3 shadow-xl ${
                  currentCompanion.currentState === 'RECRUITED'
                    ? 'bg-emerald-950/40 text-emerald-400/50 border border-emerald-900/40 cursor-not-allowed'
                    : currentCompanion.currentState === 'MISSED'
                    ? 'bg-rose-950/40 text-rose-400/50 border border-rose-900/40 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 shadow-amber-500/20 hover:scale-[1.01] active:scale-95 cursor-pointer'
                }`}
              >
                <span>📜</span>
                <span>
                  Execute <code className="bg-black/20 px-2 py-0.5 rounded font-mono text-sm">recruit(context)</code>
                </span>
              </button>
            </div>

            {/* Companion Dialogue Box and RecruitmentResponse */}
            {lastResponse && lastResponse.companionId === currentCompanion.id && (
              <div className="mt-6 space-y-4">
                <div
                  className={`p-5 rounded-xl border backdrop-blur transition-all ${
                    lastResponse.response.status === 'RECRUITED'
                      ? 'bg-emerald-950/30 border-emerald-500/50 shadow-emerald-500/10 shadow-lg'
                      : 'bg-slate-950/80 border-slate-700/80 shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-serif">
                      {currentCompanion.name} says:
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          statusColors[lastResponse.response.status].bg
                        } ${statusColors[lastResponse.response.status].text} ${
                          statusColors[lastResponse.response.status].border
                        }`}
                      >
                        STATUS: {lastResponse.response.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg italic text-slate-200 font-serif leading-relaxed">
                    "{lastResponse.response.dialogue}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* EFSM Transition Log */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span>📋</span> EFSM Transition History Log
              </h3>
              <button
                onClick={() => setLogs([])}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition"
              >
                Clear Logs
              </button>
            </div>

            {logs.length === 0 ? (
              <p className="text-xs text-slate-600 italic py-2">
                No recruitment attempts performed yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                {logs.map((log) => {
                  const colors = statusColors[log.response.status]
                  return (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs flex flex-col sm:flex-row justify-between gap-2"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200">{log.companionName}</span>
                          <span className="text-[10px] font-mono text-slate-500">[{log.timestamp}]</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-mono border ${colors.bg} ${colors.text} ${colors.border}`}
                          >
                            {log.response.status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] italic">"{log.response.dialogue}"</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
