# LLD — Jarvis Orchestration

The runtime layer that turns events into composed voice lines. Prompt selection, LLM calls, response validation, fallback.

## Parent HLD / LLD

- [system-overview.md](../hld/system-overview.md) — see §2 (User ↔ Jarvis flow)
- [orchestration.md](orchestration.md) — the event bus this handler set registers against
- [jarvis.md](jarvis.md) — the voice contract and prompt library this layer executes against

## Scope

This module owns everything between "an event fires that needs Jarvis's voice" and "a composed line lands in the app, on the Calendar, or in a Gmail send." It does not own:

- The prompt text or the voice contract (owned by `jarvis.md`)
- The Claude API key or provider choice (owned by ADR-0003 and infra config)
- Where the composed line is delivered (owned by Delivery — see failure modes below)

## Interface

### Events consumed

| Event | What this handler does |
|---|---|
| `daily.rollover` | Compose the morning nudge for each user with an active habit that day |
| `user.checked_in` | Compose the end-of-day close for the user |
| `user.missed_day` | Compose the miss-follow-up probe for the user |
| `partner.accepted` | Compose the partner-brief line for a newly-accepted partner |
| `escalation.triggered` | Compose the escalation email body for the accountability partners |
| `milestone.reached` | Compose the identity-led milestone line (Day 7 / 14 / 21 / 100) |

### Events emitted

| Event | Payload |
|---|---|
| `voice.line_composed` | `{ userId, promptName, line, model, register, correlationId }` |
| `voice.line_failed` | `{ userId, promptName, reason, fallbackUsed: string, correlationId }` |

## Internals

### 1. Prompt selector

A pure function: `event → promptName`. No side effects.

```ts
function selectPrompt(event: EventName, context: EventContext): PromptName {
  switch (event) {
    case "daily.rollover":     return "composeNudge";
    case "user.checked_in":    return context.milestoneDay ? "composeMilestone" : "composeClose";
    case "user.missed_day":    return "composeMissFollowup";
    case "partner.accepted":   return "composePartnerBrief";
    case "escalation.triggered": return "composeEscalationBrief";
    case "milestone.reached":  return "composeMilestone";
  }
}
```

Milestone override: on `user.checked_in`, if the day number is in `{7, 14, 21, 30, 60, 100}`, the milestone prompt takes precedence over the daily close. Never both fire.

### 2. Context assembly

For each prompt, build the `PromptInput` from database state:

```ts
interface PromptInput {
  user: { name: string; honorific: string; register: Register };
  habit: { title: string; tinyUnit: string; startedAt: Date };
  streak: { kept: number; missed: number; today: DayState };
  circle: { partners: Array<{ name: string; status: Status }> };
  jarvis: { previousLine?: string; previousLineAt?: Date };
}
```

Only fields the prompt template names are included — no gratuitous context bloat. Every prompt declares its required inputs; the assembler validates before the LLM call.

### 3. Model routing

Routing is prompt-driven, defaults per ADR-0003:

| Prompt | Model default | Streaming? | Rationale |
|---|---|---|---|
| `composeNudge` | Sonnet | No | Cheap, fast, high-throughput morning batch. |
| `composeClose` | Sonnet | No | Same profile as nudge. |
| `composeMissFollowup` | Sonnet | Yes | Chat-adjacent; feels conversational. |
| `composeMissReflection` | Opus | Yes | Emotional payload; worth the cost. |
| `composeMilestone` | Opus | No | Identity-land line — deserves the best model. |
| `composePartnerBrief` | Sonnet | No | Transactional voice. |
| `composeEscalationBrief` | Sonnet | No | Email body; no user-facing latency. |

The routing table is a config file, not a code constant. Changing routing does not require a deploy.

### 4. Call runtime

```ts
async function compose(
  promptName: PromptName,
  input: PromptInput,
  ctx: Context
): Promise<ComposedLine> {
  const template = getTemplate(promptName);
  const model = getModel(promptName);
  const stream = getStreaming(promptName);

  try {
    const raw = await callLLM({ template, input, model, stream, timeout: 5_000 });
    const validated = validate(promptName, raw);
    return { line: validated, model };
  } catch (err) {
    logger.warn({ err, promptName, correlationId: ctx.correlationId }, "LLM call failed");
    orchestrator.dispatch("voice.line_failed", { ... });
    return { line: getFallback(promptName, input), model: "fallback" };
  }
}
```

Retry policy: **one** retry on timeout, none on refusal. LLM refusals are a signal that the prompt or input is off — retrying an identical call would fail identically.

### 5. Response validation

Before returning a composed line, validate it against the voice contract. Reject and fall back if any rule fails:

- Contains emoji? Reject.
- Contains `!` at end of sentence? Reject (exclamations forbidden).
- Contains any of `boss|mate|buddy|champ|dude|rockstar|bro`? Reject.
- Contains any of the shame vocabulary (`red X`, `you failed`, `broken streak`)? Reject.
- For `composeMilestone`: contains the word `you are` or `you have become` (identity ladder marker)? If not, warn — do not reject (the model may express identity differently).

Validation is a pure function; unit-tested against known good and bad outputs from prior sessions.

### 6. Fallback library

Every prompt has one hardcoded fallback line matched to the register. Never blank. Never longer than the model's expected output. Deliberately quiet — a fallback line is not the moment to reach for wit.

Example fallbacks (Neutral register):

- `composeNudge`: *"Today's promise, sir — the small thing. When you have a moment."*
- `composeClose`: *"A quiet close to the day, sir. The practice continues."*
- `composeMissFollowup`: *"A quiet day, sir. When you're ready, we carry on."*

Full library in `Backend/prompts/<name>.fallback.json`, keyed by register.

## Tests

- **Prompt selection**: for each event, assert the correct prompt name (including milestone override).
- **Context assembly**: given a fixture DB state, assert the exact `PromptInput` shape.
- **Validation**: bad LLM outputs (emoji, exclamations, forbidden words) get rejected; fallback fires.
- **Retry**: timeout → retry once → success on second call.
- **Refusal**: refusal → no retry → fallback fires; `voice.line_failed` emitted.
- **Streaming stability**: streamed close-of-day arrives as a complete line by the time the client subscribes.

## Operational notes

Metrics:

- `voice_compose_duration_seconds{prompt, model}` — histogram
- `voice_compose_failures_total{prompt, reason}` — reasons: `timeout`, `refusal`, `validation_reject`, `provider_error`
- `voice_fallback_used_total{prompt}`
- `llm_tokens_total{prompt, direction}` — input/output token counts

Alerts:

- `voice_fallback_used_total` rate > 10% of `dispatched_total` for the same prompt over 15 min → warn (voice is degraded)
- `voice_compose_failures_total{reason="refusal"}` > 0 → warn (indicates a prompt regression)
- `llm_tokens_total` daily total exceeds budget → warn

Log: every compose emits one JSON line with prompt name, model, duration, token counts, and outcome.

## Open questions

- Should we cache composed lines for identical inputs? Would save token cost but risks staleness (a user getting an identical morning nudge on two different days would notice). Leaning against caching for user-facing prompts, in favour of caching for the fallback templates.
- Should validation include a semantic voice-check (a second LLM call scoring the first one)? Probably overkill until we see real voice drift in production.
- The context-assembly model above (fully pre-fetched `PromptInput`, no model-initiated lookups) is deliberately kept for the six batch prompts. The two conversational surfaces (onboarding, miss-reflection) are proposed to work differently — see [ADR-0004](../adr/0004-jarvis-mcp-tool-access.md).
