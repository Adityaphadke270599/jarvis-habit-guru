# ADR-0002 — Ship the backend as a modular monolith with named seams, not microservices

**Status:** Accepted
**Date:** 2026-07-02
**Deciders:** Aditya Phadke
**Consulted:** —

## Context

The product needs a backend eventually — habit persistence, circle state, Jarvis prompt calls, calendar/gmail delivery, digest scheduling. The question is not *whether* to build one, but at what topology.

Three plausible shapes:

- **Monolith** — one deployable, one database, one process per environment.
- **Modular monolith with named seams** — one deployable at first, but the code is organised as if it were N services, with hard module boundaries and an internal event bus. Splitting later is a deploy change, not a rewrite.
- **Microservices from Day 1** — auth service, habits service, circles service, jarvis service, delivery service. Independent deploys, service mesh, distributed tracing.

Constraints:

1. We have **four users today**, none paying, and are optimising for the first twenty. Not the millionth.
2. The team is one PM (you) plus AI collaborators. Zero dedicated engineers.
3. The daily traffic profile per user is roughly: one nudge write, one check-in write, a handful of reads, ~5 Claude API calls. Total request volume for 100 users would be trivial — well inside a single Postgres and a single Node/Python process.
4. The failure modes we care about at demo scale are correctness bugs (a check-in going missing) and voice bugs (Jarvis saying the wrong thing), not latency or throughput.
5. The PRD explicitly defers backend architecture to roadmap. The demo runs on local state.
6. Microservices carry a real cost: service discovery, distributed transactions, cross-service auth, deployment pipelines, observability infra. All of this is fixed overhead that pays back at scale we haven't reached.

## Decision

We ship the backend as a **modular monolith**: one deployable, one Postgres, one process. Inside the codebase, code is organised into module boundaries that match the HLD surfaces (`auth`, `habit-loop`, `circle-witness`, `jarvis-orchestration`, `delivery`). Modules communicate through an in-process event bus and typed interfaces. No module reaches into another's data model directly.

When a module needs to become a separate service — because of independent scaling, isolation, or team ownership — the extraction is a deploy change and a network hop, not a code rewrite. The seam already exists.

Stack (pending validation but on the recommended path): **TypeScript + Fastify + PostgreSQL + Prisma**, deployed as a single container. The n8n orchestration continues to run alongside as an external scheduler.

## Consequences

**Positive**

- One deploy pipeline, one database, one bug surface. Every hour we save on infrastructure goes into product.
- Refactors are cheap because they happen inside one process. We can move a boundary in an afternoon.
- Correctness is easier to reason about — no distributed transactions, no eventual consistency between two services that could both be lying.
- The named seams give us the option to extract services later without a rewrite. This is the "monolith first" pattern in its intended form.

**Negative (accepted)**

- One deploy = one blast radius. A bad release takes down all surfaces at once. We accept this trade-off at demo scale.
- All modules share one database's failure domain. If Postgres is down, everything is down. We accept this.
- Independent scaling is not free — if `jarvis-orchestration` needs 4x the CPU of the rest, we scale the whole monolith. This is fine until it isn't.

**Neutral**

- We are explicitly reserving the right to extract services later. The module boundaries are the seam. Extraction cost: one week per module, once the module has stable interfaces.

## Alternatives considered

- **Pure monolith (no named seams)** — Rejected. Cheap now, but every future service extraction becomes a rewrite. The named seams cost nothing to introduce and pay off the first time we extract anything.
- **Microservices from Day 1** — Rejected on cost. We do not have the scale, the team, or the operational maturity to justify the overhead. Building this now is architecture theatre.
- **Serverless (Lambda-per-endpoint)** — Rejected. Cold starts hurt the check-in latency NFR (NFR7: under 2s). Also, we lose the ability to hold in-memory state between beats of the daily loop.

## Revisit criteria

- One module hits sustained load that dominates the process (e.g., `jarvis-orchestration` becomes 70%+ of CPU).
- Two or more engineers on the team need to deploy independently and the shared pipeline becomes a bottleneck.
- A regulatory requirement (e.g., PII isolation) forces a data-plane split.
- Operational failures show consistent correlation to blast radius — one bad deploy taking down surfaces that should be isolated.
- Sustained request volume exceeds ~500 req/s on any single module, at which point independent scaling becomes worth its cost.
