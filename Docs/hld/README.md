# High-Level Design

System-shaped design documents. One doc per **surface** — a coherent area of the product with a clear boundary. HLDs describe what talks to what, not how each piece is built.

## Convention

- One markdown file per surface.
- Every HLD names the ADRs it depends on. If those ADRs move, the HLD is stale by definition.
- Diagrams: prefer ASCII or Mermaid — checked in with the doc, never external SVGs.
- The audience is a mid-level engineer joining the team; they should be able to draw the system on a whiteboard after reading.

## Structure

```
# HLD — <surface name>

## Purpose
One paragraph: what the surface does for the user, what it hides from the rest of the system.

## Depends on
- ADR-XXXX (title)
- ADR-YYYY (title)

## Actors and boundaries
Who calls into this surface. What this surface calls out to. Draw the box.

## Data model
The entities that live in this surface. Owning service, not schema-level detail.

## Sequences
The two or three most important request flows, in Mermaid.

## Failure modes
What happens when a dependency is down, when a call fails, when data is inconsistent.

## Open questions
Things we know we don't know yet.
```

## Surfaces in scope

Ordered by the beat they serve in the Golden Path:

| Surface | Owns | Key ADRs |
|---|---|---|
| `auth` | Sign-in, session, identity | 0001 |
| `habit-loop` | Habits, daily promises, check-in state, streaks | 0002 |
| `circle-witness` | Partner state, broadcast, cheers | 0002 |
| `jarvis-orchestration` | LLM calls, composed copy, prompt selection, fallbacks | 0003 |
| `delivery` | Calendar events, Gmail sends, n8n workflows | 0002 |

An HLD is written only when we're about to build the surface. Empty until the demo lands and Kanchuki's feedback reshapes priorities.
