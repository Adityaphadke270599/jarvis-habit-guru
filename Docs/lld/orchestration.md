# LLD — Orchestration Layer (parent)

The brainstem. Sits between the HTTP API layer and the two runtime sub-layers (Jarvis Orchestration + Accountability). Receives events, dispatches to handlers, owns cross-cutting concerns.

## Parent HLD

[system-overview.md](../hld/system-overview.md) — see §1 (system-context diagram) and the two interaction flows.

## Scope

The orchestration layer owns three things and nothing else:

1. **The event bus.** In-process, typed, synchronous by default. Handlers subscribe by event name.
2. **The dispatcher.** Receives events from producers (cron scheduler, HTTP handlers, sub-layer emissions) and routes them to registered handlers.
3. **Cross-cutting runtime concerns.** Correlation IDs, retry policy defaults, dead-letter handling, structured logging, tracing spans.

It does NOT own business logic. Jarvis Orchestration owns LLM calls. Accountability owns partner state and stars. The orchestration layer routes; it does not decide.

## Interface

### Event catalogue

Every event has a stable name and a typed payload. Names use `<subject>.<verb>` in past tense (things that happened, not commands).

| Event | Producer | Consumer(s) |
|---|---|---|
| `daily.rollover` | Cron (n8n) | Jarvis Orchestration (compose nudge), Accountability (schedule follow-ups) |
| `nudge.sent` | Jarvis Orchestration | Accountability (arm the escalation timer) |
| `user.checked_in` | HTTP (user tap) | Jarvis Orchestration (compose close), Accountability (award stars) |
| `user.missed_day` | Cron (end of day, no check-in) | Jarvis Orchestration (miss follow-up), Accountability (check escalation threshold) |
| `partner.followed_up` | HTTP (partner action) | Accountability (record, award if user then completes) |
| `partner.accepted` | HTTP (invite acceptance) | Accountability (activate partnership), Jarvis Orchestration (brief message) |
| `voice.line_composed` | Jarvis Orchestration | HTTP push (SSE to app), Delivery (Calendar/Gmail write) |
| `voice.line_failed` | Jarvis Orchestration | Logging, alerting; consumers fall back to pre-written lines |
| `stars.awarded` | Accountability | HTTP push (UI update), analytics |
| `escalation.triggered` | Accountability | Jarvis Orchestration (compose partner brief), Delivery (email send) |

### Dispatcher API (module-level)

```ts
type EventName = "daily.rollover" | "user.checked_in" | ...;
type Handler<E> = (payload: PayloadFor<E>, ctx: Context) => Promise<void>;

interface Orchestrator {
  register<E extends EventName>(event: E, handler: Handler<E>): void;
  dispatch<E extends EventName>(event: E, payload: PayloadFor<E>): Promise<void>;
}
```

The `Context` carries `correlationId`, `traceSpan`, `user` (if scoped), and `now` (injectable clock — no `Date.now()` calls inside handlers).

## Internals

### Dispatch semantics

- **Synchronous by default.** A handler's promise settles before the next one runs. Guarantees ordering within an event. Handlers with heavy work (LLM calls, network I/O) declare `async: "queue"` and return immediately — their work is enqueued.
- **All-or-nothing per event.** If any handler throws, the event is marked failed. The whole set of handlers does not retry piecemeal — the producer retries the event, or the operator replays it from the dead-letter queue.
- **No fan-out to unregistered events.** Producers cannot invent event names. Compile-time enforcement via the `EventName` union.

### Retry policy defaults

Handlers may opt into retry declarations. Defaults for handlers that do not:

- Network-dependent (LLM, Calendar, Gmail): 3 attempts, exponential backoff (1s, 4s, 15s), then dead-letter.
- Internal (DB writes): no retry — surface the error, let the producer decide.

### Correlation and tracing

Every event carries a `correlationId`. Cron-initiated events generate one at the scheduler. HTTP-initiated events adopt the request ID. Downstream handlers propagate.

Trace spans are opened per event, closed on handler completion. LLM calls, DB queries, and external HTTP calls each get child spans.

### Dead-letter queue

Failed events after retries land in a `dlq` table with the payload, error, and last-attempt timestamp. A human replays or discards. No auto-retry from DLQ — deliberate to prevent thundering-herd on partial outages.

## Tests

- **Contract tests** for each event: producer emits the expected payload shape; consumer accepts it.
- **Dispatch-order tests** for multi-handler events (e.g., `user.checked_in` must fire stars-award before compose-close so the close copy can reference the fresh star count).
- **Retry tests** with a fake network layer that fails N times then succeeds.
- **DLQ replay** end-to-end: fail, land in DLQ, replay, succeed.

Not covered: LLM output quality (that's Jarvis's own suite). Calendar/Gmail integration reliability (integration tests owned by Delivery).

## Operational notes

Metrics per event: `dispatched_total`, `handler_duration_seconds{event, handler}`, `handler_failures_total{event, handler, reason}`.

Alerts: DLQ depth > 10 → page. Handler p95 latency > 5s for LLM events → warn. Any `voice.line_failed` rate > 5% of `daily.rollover` → warn.

Log format: JSON, one line per event dispatch and per handler completion, tagged with `correlationId`.

## Open questions

- Do we need cross-instance event delivery? Only if we scale horizontally. Deferred until we hit that threshold (see ADR-0002 revisit criteria).
- Should DLQ replay require a second human's sign-off in production? Probably yes, but only when there's a second human.
