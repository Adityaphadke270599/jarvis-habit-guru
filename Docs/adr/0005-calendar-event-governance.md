# ADR-0005 — Calendar event governance: ownership scoping and provenance flagging

**Status:** Proposed
**Date:** 2026-07-03
**Deciders:** Aditya Phadke
**Consulted:** —

## Context

The [ADR-0004](0004-jarvis-mcp-tool-access.md) prototype (`Backend/mcp/`) gives Jarvis `update_calendar_event` and `delete_calendar_event` tools scoped to `calendarId="primary"` — the user's own calendar, with no notion of who created a given event. Two gaps surfaced while testing it:

1. **No ownership check.** Jarvis can currently list, patch, or delete *any* event on the primary calendar — including ones the user created themselves, or that came from an unrelated source (work meetings, other apps). Nothing stops a `delete_calendar_event` call from removing an event Jarvis never created.
2. **No provenance flag.** Once an event exists, there's no way for the user — or for Jarvis, reading its own list output later — to tell "Jarvis made this for the habit loop" apart from "I put this on my own calendar." Both look identical in `list_calendar_events` output and in the Calendar UI.

This is a security and trust problem, not a cosmetic one: an LLM deciding autonomously which tool to call, reading event titles/descriptions as part of its context, should not have blanket mutate access to a calendar it doesn't exclusively own. It's also a product problem — [delivery.md](../lld/delivery.md)'s open question "Calendar location — user's personal calendar or a shared 'Jarvis' calendar?" is the same question from the delivery-integration side, unresolved when that doc was written.

Two existing constraints shape the decision:

- **ADR-0004** already commits the MCP tool surface to a narrow scope (two conversational surfaces, in-process transport). This ADR adds a governance layer *underneath* that surface — it constrains what the mutating tools are allowed to do, regardless of which surface calls them.
- **ADR-0002**'s "no module reaches into another's data model directly" implies the ownership check belongs in code the MCP tools run through, not in a prompt instruction the model is expected to honor. A system-prompt rule ("only touch events you created") is not an authorization boundary — it can be argued around by adversarial or malformed input the model reads (e.g. injected instructions sitting inside another event's description), and a wrong tool call is a real irreversible action (a deleted calendar event), not a recoverable chat mistake.

## Decision

Introduce two mechanisms, layered:

**1. Provenance — a dedicated secondary calendar.** Jarvis-created events are written to their own secondary Google Calendar (e.g. "Jarvis — Habit Guru"), not `primary`. This is the main ownership signal: an event's calendar membership *is* its provenance. It also resolves delivery.md's open question — this is the "shared Jarvis calendar" option, chosen for exactly the reason already named there: single source of truth, trivially revocable (the user can unsubscribe from or delete the whole calendar), and it renders in a distinct color in the Calendar UI with zero changes to event titles or descriptions — keeping the no-clutter, no-emoji voice rule intact instead of prefixing titles with a text marker.

As defense-in-depth, every event Jarvis creates also gets an `extendedProperties.private` tag (e.g. `{"createdBy": "jarvis", "conversationId": "..."}`). `extendedProperties.private` is only readable via the API by the client that set it — invisible in the Calendar UI, and useful if Jarvis is ever given read access to events outside its own calendar (e.g. to avoid double-booking against the user's real schedule) where calendar membership alone can't answer "did I make this."

**2. Authorization — a hard-coded ownership check inside the mutating tools.** `update_calendar_event` and `delete_calendar_event` (in `mcp-server.py`, or wherever they land once wired into a real module per ADR-0004) fetch the target event first, verify `calendarId` is the Jarvis calendar **and** the `extendedProperties.private.createdBy` tag matches, and refuse with a plain-string tool result if either check fails — e.g. `"This event wasn't created by Jarvis; refusing to modify it."` The calling model relays that string in voice; it never gets to decide the check doesn't apply. `list_calendar_events` remains unrestricted and can read across calendars — Jarvis is allowed to *see* the user's real schedule for context (e.g. avoiding a nudge during a meeting); only mutation is gated.

## Consequences

**Positive**

- A deleted or mangled event that wasn't Jarvis's becomes structurally impossible through this tool surface, not just discouraged by prompt wording.
- The user gets a free, zero-maintenance way to see "everything Jarvis has done" — open the Jarvis calendar. No separate audit UI needed for the common case.
- Resolves delivery.md's "Calendar location" open question as a side effect.
- The `extendedProperties` tag gives a second, UI-invisible check that survives even if the calendar-separation invariant is ever violated (e.g. a future tool that reads/writes primary for a different reason).

**Negative (accepted)**

- Extra onboarding step: the user must grant access to (or Jarvis must create) a second calendar, and the OAuth scope already requested (`calendar.events`) needs confirming it covers secondary-calendar creation, not just event CRUD on existing calendars.
- One more round trip per mutating call (`events().get()` before `patch()`/`delete()`) — acceptable latency cost for a user-attended chat surface, per the same reasoning ADR-0004 already accepted for tool-calling generally.
- Doesn't cover events that predate this decision — see Revisit criteria.

**Neutral**

- Does not change `create_calendar_event`'s signature meaningfully — it just targets the Jarvis calendar's ID instead of `"primary"`, and stamps the extended property on creation.

## Alternatives considered

- **Title/description prefix as the only marker (e.g. "[Jarvis] ...")** — rejected. Pollutes the event title with a mechanical marker, works against the calibrated voice/no-clutter rules in `CLAUDE.md`, and is a weaker check than calendar membership (a user could rename the title and break the tag).
- **System-prompt instruction only ("don't touch events you didn't create")** — rejected as the sole mechanism. Not enforceable — the model reads event content as untrusted input and a wrong call is irreversible. May still be worth keeping as a belt-and-suspenders instruction, but not the security boundary.
- **`extendedProperties` tag only, no separate calendar** — rejected as insufficient alone. Solves the authorization check but not the user-visible flagging ask; the user would have no simple way to eyeball "what has Jarvis done" without a dedicated view into private, API-only metadata.

## Revisit criteria

- ADR-0004's prototype gets wired into a real conversational surface — this ADR's mechanisms need to actually be built at that point, not just decided.
- Google Calendar API's secondary-calendar creation/permission model turns out to need a broader OAuth scope than currently requested (`calendar.events`) — would need a re-consent flow, worth flagging to the user before shipping.
- Pre-existing events created on `primary` before this decision need a migration story (either left alone and simply never touched by mutating tools, or a one-time backfill that tags/moves them) — unresolved, deliberately deferred until this is actually implemented.
