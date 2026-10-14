# AGENTS.md

## Project Overview

**EFSM (Extended Finite State Machine) Simulator**
This project simulates an Extended Finite State Machine (EFSM) engine for companion recruitment mechanics in RPGs.

In this architecture, each companion is modeled as an EFSM where:
- Transitions depend on both the current finite state and companion memory registers (`CompanionMemory`).
- Guards (predicates) evaluate world context (castle level, party members, items, story flags) and companion memory registers (affinity, talk counts, quest steps).
- Actions produce state transitions, update companion memory registers, and return structured recruitment responses (`RecruitmentResponse`) with dialogue and status.

---

## Core Directives

### 1. Language Directive: English Only
- **All code, types, interfaces, functions, variables, comments, docstrings, commit messages, and documentation must be written entirely in English.**
- In-game dialogue, UI text, error messages, and logs must be in English.

### 2. Testing Directive: 100% Feature Unit Test Coverage
- **Every feature, state transition, guard condition, and companion model must have accompanying unit tests.**
- Unit tests must cover:
  - Default initial state and companion memory registers.
  - Valid transitions when guards are satisfied.
  - Guard failures and partial progress (e.g., moving to quest states or blocked transitions).
  - Terminal states (`RECRUITED`, `MISSED`) and idempotent behavior.
  - Edge cases (missable recruitment windows, missing inventory items, party member checks).
- No feature is considered complete until its unit tests are written and passing.

### 3. Non-Nullable Collections & Objects Directive
- **Array and object fields must never be nullable or undefined.**
- Always use empty collections (`[]`) and empty objects (`{}`) instead of `null`, `undefined`, or optional fields (`?`).
- Interfaces, models, DTOs, return types, and extended state registers must declare array fields as non-nullable collections (e.g. `items: Item[]`, never `items?: Item[]` or `items: Item[] | null`) and object fields as non-nullable structures (e.g. `flags: Record<string, boolean>`, never `flags?: Record<string, boolean>`).
- This guarantees safe iteration (`.map()`, `.filter()`, `.forEach()`) and property access without requiring defensive null checks.

### 4. Architecture & Code Style Directives
- **TypeScript Strictness**: Use strict TypeScript types. Use type-only imports (`import type { ... }`) when `verbatimModuleSyntax` is active.
- **Separation of Concerns**:
  - `src/types/`: Pure type definitions, interfaces, and contracts.
  - `src/models/`: EFSM implementations, companion logic, and state machine definitions.
  - `src/components/` & `src/App.tsx`: UI presentation and simulator controls.
- **Verification Commands**:
  - `npm run test`: Must pass without errors.
  - `npm run lint`: Must pass without warnings or errors.
  - `npm run build`: Must compile cleanly.
