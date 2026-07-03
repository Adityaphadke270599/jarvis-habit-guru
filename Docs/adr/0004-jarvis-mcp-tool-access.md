# ADR-0004 — Jarvis tool access: MCP for conversational surfaces, not batch voice lines

**Status:** Proposed
**Date:** 2026-07-03
**Deciders:** Aditya Phadke
**Consulted:** —

## Context

The current design (`jarvis-orchestration.md` §2, "Context assembly") builds a fully-populated `PromptInput` from DB state *before* every LLM call — "only fields the prompt template names are included... no gratuitous context bloat." One round trip, deterministic, cheap. This fits the six batch/transactional voice lines cleanly: `composeNudge`, `composeClose`, `composeMilestone`, `composeMissFollowup`, `composePartnerBrief`, `composeEscalationBrief`. Their inputs are fully known at dispatch time from the triggering event — there's nothing for the model to decide to look up.

Two surfaces don't fit that shape:

- **Onboarding chat** (HLD §2, steps Q1–Q2 — "understand WHAT and WHY," "design the program: tiny unit, register, frequency, circle") — `/#/onboarding` in `app-structure.md`.
- **Miss-reflection chat** (`composeMissReflection`, `/#/chat` route, reuses the onboarding chat shell) — retrospective, open-ended, conversational per `jarvis.md`'s prompt catalogue.

Both are multi-turn and open-ended: what Jarvis needs to know depends on what the user says, not on the firing event. Pre-fetching "everything a reflection prompt might plausibly need" would itself violate the no-bloat rule already in place for the batch prompts. This is the gap MCP fills — tools the model calls mid-conversation, instead of the orchestrator guessing every field up front.

Two existing constraints shape the decision:

- **ADR-0002** commits to a modular monolith with named seams (`auth`, `habit-loop`, `circle-witness`, `jarvis-orchestration`, `delivery`) and is explicit that "no module reaches into another's data model directly." An MCP server must be an adapter in front of existing module APIs, not a new place that owns data.
- **ADR-0003** defaults nudges/closes to Sonnet, batch, no streaming — optimized for a cheap, fast, predictable cron path. Multi-turn tool-calling adds latency (extra round trips) and token cost per turn. Fine for a chat surface the user is actively looking at; not something to introduce into the background batch path for no benefit.

Note: `Backend/mcp/mcp-server.py` and `mcp-client.py` already exist as empty scaffold files. This ADR should be read before either is filled in — the scope below is narrower than "an MCP server for the backend."

## Decision

Introduce an MCP server, scoped narrowly to the two conversational surfaces (onboarding chat, miss-reflection chat). The six batch voice-line prompts keep the existing pre-fetched `PromptInput` model unchanged — no tool-calling in the cron-fired hot path.

The server runs in-process within the modular monolith (per ADR-0002), not as a separately deployed service. It is a protocol-shaped adapter over existing module functions, not a new seam with its own data:

- **Read tools:** `get_habit`, `get_streak`, `get_circle`, `get_miss_history` (own-user scope only — never exposed in a way that lets a circle-facing prompt join it, per NFR2 / the accountability layer's private-reason-log rule), `get_partner_status`
- **Write tools (onboarding only):** `create_habit`, `set_register`, `add_partner`, `schedule_calendar_task` (delegates to Delivery's Calendar adapter, does not write Calendar state itself)

**Transport:** stdio / in-process. The server and the calling runtime live in the same deployable per ADR-0002; a network transport (HTTP/SSE) is unneeded overhead unless a module is later extracted to its own service.

## Consequences

**Positive**

- Onboarding and miss-reflection become genuinely conversational — Jarvis can ask a clarifying question and only then decide what to look up, instead of the orchestrator pre-guessing every field the model might reference.
- The tool surface is reusable: the same `get_streak` / `get_circle` tools can back a future conversational surface without new plumbing.
- Contained blast radius: wrapping existing module APIs (rather than introducing new data ownership) keeps ADR-0002's seam discipline intact.

**Negative (accepted)**

- Multi-turn tool calls cost more latency and tokens than one pre-fetched call. Acceptable for two low-frequency, user-attended chat surfaces; would not be acceptable applied to the six batch prompts — which is why they're explicitly out of scope here.
- New failure mode: a tool call can fail, or the model can call the wrong tool, or loop. Needs the same validation + fallback discipline `jarvis-orchestration.md` already applies to LLM output, extended to cover tool-call outcomes.
- Write tools mean the LLM can mutate state directly during onboarding (e.g., `add_partner`). These must call the same invariant-enforcing functions the HTTP API layer uses (e.g., the Partnership state machine in `accountability-layer.md`) — never a raw DB write path of their own.

**Neutral**

- Does not touch model routing from ADR-0003 — deferred until real traffic exists, same as ADR-0003's own deferral condition.

## Alternatives considered

- **Apply MCP to all eight prompts, including the six batch ones** — rejected. Their inputs are fully known at dispatch time; tool-calling would add latency and cost for zero flexibility gain.
- **Keep pre-fetching for chat too, just fetch "everything" up front** — rejected. Onboarding needs writes, not just reads, which pre-fetch can't provide; and speculative fetching for miss-reflection reintroduces the exact context bloat the current design deliberately avoids.
- **Separately deployed MCP service (HTTP transport)** — rejected for now, contradicts ADR-0002's monolith-first stance. Revisit only if a module is extracted to its own service.

## Implementation note (2026-07-03)

A prototype was built at `Backend/mcp/` (`mcp-server.py`, `mcp-client.py`, `google_auth.py`) to de-risk the tool-calling mechanics before committing engineering time to the design above. It intentionally diverges from the Decision in three ways:

- **Tools wrap Google APIs directly, not internal modules.** `mcp-server.py` calls `googleapiclient` (Calendar, Gmail) straight from the tool functions. None of the internal read/write tools listed above (`get_habit`, `get_streak`, `create_habit`, etc.) exist yet. The prototype only proves that Claude can be handed Calendar/Gmail tools and decide autonomously when to call them — `list_calendar_events`, `create_calendar_event`, `update_calendar_event`, and `delete_calendar_event` are built and tested end-to-end (create → move → delete, all model-initiated); `send_email` (Gmail) is scoped but not yet built.
- **Not wired into onboarding or miss-reflection.** The prototype runs as a standalone CLI (`mcp-client.py`, a REPL loop against `AsyncAnthropic` using the SDK's `tool_runner`), not inside either conversational surface named in the Decision. It has no connection to `habit-loop` or `circle-witness` module state.
- **Own OAuth/token handling, outside Delivery's ownership.** `google_auth.py` runs its own installed-app OAuth flow and caches `token.json` locally. Per-module ownership (ADR-0002) and `delivery.md`'s "OAuth token storage and refresh" responsibility are not yet reconciled with this — the prototype owns its own token where the target design has Delivery own it.

None of this changes the Decision above — it is a spike proving the mechanism, not a replacement for the module-wrapping design. Before this reaches either named conversational surface, the prototype's tools need to be re-pointed at internal module functions (or the Delivery adapter, for anything Calendar/Gmail-shaped), and its OAuth handling needs to move under Delivery's token storage. Tracked as follow-up work, not a scope change to this ADR.

Testing the prototype also surfaced a governance gap this ADR didn't address: `update_calendar_event` / `delete_calendar_event` have no ownership check, so nothing stops them mutating an event Jarvis didn't create, and there's no way to tell a Jarvis-made event apart from a user-made one. Tracked separately in [ADR-0005](0005-calendar-event-governance.md) rather than folded in here, since it's a security/authorization boundary orthogonal to which surfaces get tool access.

## Revisit criteria

- Onboarding or miss-reflection latency (tool-call round trips) proves unacceptable against a user-facing latency budget.
- A module is extracted to its own service per ADR-0002's revisit criteria — the MCP server's transport would need to move from in-process to network.
- Real usage shows a batch prompt (e.g., `composeMilestone`) would meaningfully benefit from dynamic lookup — requires a new ADR to extend scope, not a silent expansion of this one.
