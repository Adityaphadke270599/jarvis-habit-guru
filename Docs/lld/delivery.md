# LLD — Delivery

The layer that turns "voice line composed" or "escalation triggered" into an actual Google Calendar event, Gmail send, or in-app push. Owns the boundary with the outside world.

## Parent HLD / LLD

- [system-overview.md](../hld/system-overview.md) — see §5 (Google Calendar and Gmail as external actors), §6 (failure modes)
- [orchestration.md](orchestration.md) — the events this layer consumes
- [ADR-0002](../adr/0002-backend-shape-monolith-vs-services.md) — Delivery is one of the named module seams

## Scope

Owns everything between "orchestration emitted an event that needs to reach the world" and "the world acknowledges receipt."

- Google Calendar event CRUD (nudges, follow-up tasks, completion marks)
- Gmail message composition + send (escalation emails, digest emails)
- OAuth token storage and refresh (per-user, per-partner)
- Deliverability posture: SPF / DKIM / DMARC on the sending domain
- Retry policy specific to external services (respects rate limits, not internal defaults)
- Delivery receipts (webhooks from providers) — where available

Does NOT own:

- The message's text (owned by `jarvis-orchestration.md`)
- The decision to send (owned by orchestrator handlers)
- User-facing delivery status (owned by `app-structure.md`)

## Interface

### Events consumed

| Event | Handler action |
|---|---|
| `voice.line_composed` (target: calendar) | Update the Calendar event's title/description with the composed line |
| `escalation.triggered` | Compose HTML email, send to partner list via transactional provider |
| `partner.accepted` | Create the initial FollowUpTask calendar events on the partner's calendar |
| `user.checked_in` | Mark the day's Calendar task as complete |

### Events emitted

| Event | Payload |
|---|---|
| `delivery.succeeded` | `{ deliveryType, targetId, providerMessageId, correlationId }` |
| `delivery.failed` | `{ deliveryType, targetId, reason, retryable, correlationId }` |
| `oauth.token_expired` | `{ userId, provider }` — triggers UI re-auth prompt |

## Deliverability posture (the load-bearing bit)

**Three DNS records must be in place before transactional email can be sent at any real volume:**

- **SPF** (Sender Policy Framework) — TXT record listing our authorised sending IPs / providers. Without it, Gmail marks messages as "unable to authenticate."
- **DKIM** (DomainKeys Identified Mail) — cryptographic signature attached to every outgoing message. Proves the message wasn't tampered in transit.
- **DMARC** (Domain-based Message Authentication) — policy telling receiving servers what to do if SPF or DKIM fails. Start at `p=none` (monitor only), advance to `p=quarantine` after 30 days of clean delivery, then `p=reject`.

**Threshold at which this is load-bearing:** ~50 escalation emails per day. Below that, Gmail's tolerance for unauthenticated senders is generous. Above, we hit the spam folder consistently.

**Chosen provider path:** transactional email service (Resend, Postmark, or AWS SES) that handles the SPF / DKIM setup as part of its onboarding. **Do not send from a raw SMTP server** — we would inherit a reputation-management problem we have no capacity for. Pick one before the first ~50-email day; retrofitting is painful.

Provider comparison, to draft when we're close to needing this:

| Provider | Pros | Cons |
|---|---|---|
| Resend | Modern API, generous free tier, clean DX | Newer — less established sender reputation |
| Postmark | Excellent deliverability track record, transactional-only | Slightly more expensive |
| AWS SES | Cheapest at scale, integrates with existing AWS stack | More setup ceremony; sender reputation is on us |

## Retry policy

External-service retries are stricter than the orchestration layer's defaults — providers have their own rate limits and we must not hammer them.

- Google Calendar / Gmail API: respect the `Retry-After` header; if absent, exponential backoff (2s, 8s, 30s), then dead-letter
- Transactional email provider: respect their SDK's built-in retry; if a 5xx persists after 3 attempts, DLQ + alert
- OAuth token refresh failures: single retry, then emit `oauth.token_expired` and stop — no more sends until the user re-authenticates

## Internals

To be drafted when an engineer is staffed. Key pieces:

- OAuth token storage (encrypted at rest, per-user, per-provider)
- Provider adapter interface (`sendEmail`, `createCalendarEvent`, `updateCalendarEvent`, `markCalendarComplete`)
- Delivery receipt webhook handler (updates internal delivery state, emits `delivery.succeeded`)
- Bounce / complaint handler (a hard bounce disables the partner's email until they update it)

## Tests

- OAuth refresh flow: expired token → refresh → replay send
- Rate-limit handling: provider returns 429 → back off per `Retry-After` → succeed on next attempt
- Bounce handling: hard bounce → partner marked email-bad → future sends short-circuited
- DKIM signature validation: sample messages verify against the published public key

## Operational notes

Metrics:

- `delivery_sent_total{type, provider}` — volume by channel and provider
- `delivery_failed_total{type, provider, reason}` — split by transient vs terminal failure
- `oauth_refresh_failures_total{provider}`
- `email_bounce_rate` — hard vs soft, per sending domain

Alerts:

- Bounce rate > 5% over 24 hours → page (reputation impact)
- DMARC quarantine reports arriving → warn (misconfiguration somewhere)
- OAuth refresh failure rate > 10% over 1 hour → warn (token store issue or provider outage)

## Open questions

- **Calendar location** — user's personal calendar or a shared "Jarvis" calendar? Shared is cleaner (single source of truth, easier to revoke) but requires an extra permission grant at onboarding.
- **Revocation UX** — what happens when the user revokes Calendar access mid-cycle? Currently the write silently fails. Should surface as a UI state ("Reconnect Calendar to receive nudges").
- **Escalation email format** — plain HTML with brand tokens (paper / brass / ink) or one-line plain text? HTML is on-brand; plain text has marginally better deliverability. Test both once we have the sending domain warmed up.
- **Digest cadence** — weekly by default. Does the weekly digest go via calendar or email? Probably email — a calendar event feels wrong for a summary.
