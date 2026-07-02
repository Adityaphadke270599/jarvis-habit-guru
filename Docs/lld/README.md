# Low-Level Design

Per-component and per-service detail. Written **only** when there's an engineer about to build the thing.

Empty by design. Populated from HLDs, which are populated from ADRs. Do not write an LLD before its parent HLD is stable — you'll spend the LLD chasing a moving target.

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
