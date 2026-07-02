# Low-Level Design

Per-component and per-service detail. Written **only** when there's an engineer about to build the thing.

Populated from HLDs, which are populated from ADRs. The current set is a batch of **target designs** — written before an engineer was staffed, at the PM's direction. They will want a re-read once contact with reality begins.

## Current set

| # | Doc | Owns |
|---|---|---|
| 1 | [app-structure.md](app-structure.md) | Frontend PWA — routing, state, offline, SSE, session |
| 2 | [jarvis.md](jarvis.md) | Voice contract, prompt library, fallback lines, acceptance tests |
| 3 | [orchestration.md](orchestration.md) | Event bus, dispatcher, cross-cutting runtime concerns |
| 3a | [accountability-layer.md](accountability-layer.md) | Partner state, follow-ups, escalation, star ledger |
| 3b | [jarvis-orchestration.md](jarvis-orchestration.md) | Prompt selection, LLM call runtime, validation, fallback |

## When an LLD becomes worth writing

- The HLD is stable (no open questions blocking implementation)
- An engineer has been staffed against the surface
- The estimate for the build is ≥ 5 person-days (below that, the code is faster than the doc)

## Structure

```
# LLD — <component or service name>

## Parent HLD
Link.

## Scope
What this component owns, in one paragraph.

## Interface
- Public API (functions, endpoints, events emitted)
- Consumer contracts (schemas, invariants)

## Internals
The important algorithms, data structures, state machines. Not every line — the ones a reader would trip on.

## Tests
Which behaviours have coverage. Which are deliberately not covered and why.

## Operational notes
Metrics emitted. Alerts wired. Runbooks linked.
```
