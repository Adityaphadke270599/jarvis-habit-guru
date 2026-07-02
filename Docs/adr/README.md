# Architecture Decision Records

A running log of decisions that are **costly to reverse**. Written when we lock a decision, read when we wonder why the codebase is shaped as it is.

## Convention

- One file per decision. Numbered `NNNN-kebab-case-title.md`, monotonically increasing.
- Do not edit an ADR after its status becomes **Accepted**. If reality changes, supersede it with a new ADR that links back.
- The status field is the source of truth: `Proposed → Accepted → Superseded → Deprecated`.

## Structure of each ADR

Standard Nygard form, minor extensions:

```
# ADR-NNNN — Title (imperative, one line)

**Status:** Proposed | Accepted | Superseded (by ADR-XXXX) | Deprecated
**Date:** YYYY-MM-DD
**Deciders:** Aditya Phadke, ...
**Consulted:** (people whose input mattered)

## Context
What situation forced the decision. Include the constraints that make it non-trivial.

## Decision
The chosen path, in one paragraph. Present-tense, declarative — "we will use X."

## Consequences
Positive, negative, and neutral. Especially the negatives — the things we accepted as the cost.

## Alternatives considered
Each with a one-line "why not." No straw-men.

## Revisit criteria
The observable events that would legitimately reopen this ADR. Not "when we scale" — specific triggers.
```

## The current series

| # | Title | Status |
|---|---|---|
| 0001 | Mobile shell — PWA vs native | Accepted |
| 0002 | Backend shape — monolith with named seams | Accepted |
| 0003 | Jarvis LLM provider and model policy | Accepted (deferred) |

## When to write one

**Yes:** the decision costs a rebuild to undo. Stack choice. Auth model. Data-store shape. Whether the mobile app is PWA or native. LLM provider. Deployment topology.

**No:** internal naming conventions, one-off refactors, temporary hacks. Those live in code comments or PR descriptions.
