# ADR-0006 — OAuth consent choreography: identity at sign-up, incremental grants at the moment of use

**Status:** Proposed
**Date:** 2026-07-03
**Deciders:** Aditya Phadke

## Context

Jarvis needs two Google scopes to fulfil the Golden Path — `calendar.events` (to create daily promises on a private calendar per ADR-0005) and `gmail.send` (to email accountability partners on a missed day, from the user's own inbox). Both are classified by Google as **sensitive scopes**, which brings three hard constraints:

1. **OAuth Verification is mandatory.** Any app requesting these scopes must go through Google's OAuth Verification process before serving more than 100 users. Requires verified domain ownership, published privacy policy + terms of service, a demo video per scope, and a security review. Turnaround: 2–6 weeks. This is calendar time, not code time — it must start early.
2. **Prototype ceiling is 100 users.** Until verified, up to 100 users can be added manually as "test users" in the Google Cloud Console. Fine for closed beta; nothing can be done to lift the ceiling short of verification.
3. **Sensitive-scope consent screens are aggressive.** Google's own consent UI shows a full-page warning listing every scope requested, with warm-orange styling suggesting risk. A bundled request at sign-in feels — accurately — like a large ask.

Layered on top of that is a product-side concern: shame mechanics are forbidden (NFR1), and one form shame takes in habit apps is *asking for too much access before earning trust*. A bundled consent screen at sign-in ("we need your calendar and your inbox to begin") reads as extractive; refusal or hesitation is high. The consent choreography is not just a Google problem — it's part of the product's voice.

Two existing constraints:

- **ADR-0004** commits Jarvis's mutating tools to a narrow scope (two chat surfaces). This ADR is upstream — it decides *when Google grants those tools' capabilities in the first place*.
- **ADR-0005** commits Jarvis to a dedicated secondary calendar with an ownership check. That decision presupposes `calendar.events` has been granted — this ADR decides how and when we ask.

## Decision

Three consent moments, keyed to onboarding beats already in the PRD:

| Beat | Scope requested | Voice cue |
|---|---|---|
| Sign in | `openid email profile` only | Standard "Sign in with Google" — no extra scopes on the consent screen. |
| Onboarding: after frequency chosen (before `create_habit` is called) | `calendar.events` (incremental) | *"If I may — I'll place your daily promise on a private calendar I create for us. You can hide or delete it any time."* |
| Onboarding: after circle confirmed (before first partner brief is sent) | `gmail.send` (incremental) | *"On a quiet day, I'll reach out to Jaanvi and Mike from your own email — never to anyone else, never for anything else."* |

**Incremental authorization** is the mechanism (Google supports this natively via the `include_granted_scopes=true` parameter). The user sees a consent screen for one additional scope at a time, in the moment its use is being agreed to — never bundled.

**Refusal is a first-class product state.** For each of the two incremental grants, if the user declines:

- **No `calendar.events`** → no calendar events created; nudges live in-app only. Jarvis acknowledges the mode (*"Very good — we'll keep to the app then, sir."*). The Frontend surfaces this in Settings as *"Calendar off. Nudges appear only in the app."* — no shame framing, just factual.
- **No `gmail.send`** → escalation emails cannot be sent. When a user goes silent past the threshold (per accountability-layer.md §3), the escalation is instead surfaced as an in-app circle notification when a partner next opens the app. Downgraded reach, not silent failure.

**Revocation is always visible.** Settings shows each scope as its own line item with:
- Its current state (granted / declined / revoked)
- What Jarvis does with it, in one sentence
- A "revoke" affordance that walks the user to Google's Account Permissions page

**System emails vs. escalation emails — two separate paths.** The `gmail.send` scope is for *escalation emails from the user's own account* — the accountability play (Mike sees the email is from Aditya, not from a bot). System emails (welcome, weekly digest, verification, password recovery once real auth exists) go via a transactional email provider on the Jarvis sending domain, per `delivery.md`. This split needs a note added to `delivery.md`; noted as follow-up.

## Consequences

**Positive**

- Consent friction is minimised — no scary all-at-once consent screen. The user encounters each scope *in the moment its use makes sense*, with in-voice explanation of why.
- Refusal doesn't break the product. A user can complete onboarding without granting either sensitive scope and still keep a promise, be witnessed, and be closed on. The core loop degrades gracefully.
- Google's OAuth Verification video is easier to record: each scope has a clear, single-purpose use case with matching in-app copy. That's exactly what Google's reviewers look for.
- Aligns with modern platform expectations (Apple's HIG, Google's own guidelines) around progressive disclosure and contextual consent.

**Negative (accepted)**

- Two extra round-trips through Google's consent screen during onboarding. Adds friction to the happy path in exchange for reduced friction at the aggregate (fewer refusals, higher completion).
- Two send paths for email means two integrations to maintain: `gmail.send` for escalation, transactional provider for system emails. Accepted as the price of the accountability play.
- Incremental authorization requires our OAuth code to correctly propagate `include_granted_scopes=true` and to store the union of granted scopes per user. Adds a small amount of complexity vs. one-shot consent.

**Neutral**

- OAuth Verification submission is required either way — bundled or incremental. This ADR doesn't accelerate or delay verification, only shapes what we demo to Google's reviewers.

## Alternatives considered

- **Bundled consent at sign-in.** Rejected. Google's consent screen for `calendar.events + gmail.send` at sign-in reads as extractive. Refusal rate is empirically higher for bundled sensitive scopes across the ecosystem; users trust an app they've used briefly more than an app they've just met.
- **Only ask for scopes at first *actual* use in the running app** (e.g. defer `calendar.events` until the first check-in). Rejected. Onboarding is where the user is bought in and voice is high-trust; interrupting the daily loop with a consent screen is worse timing.
- **Use `gmail.send` for both escalation and system emails.** Rejected. System emails from the user's own Gmail would be legally and stylistically odd (welcome email from Aditya to Aditya). Two paths, deliberately.
- **Skip `gmail.send`, use only transactional provider.** Rejected. Loses the emotional weight of "the email is from your friend, not from a bot" — the exact witness dynamic the accountability layer is built around.

## Revisit criteria

- Google's OAuth policy changes to require verification before scoping (currently it does not). Would compress the timeline for filing verification.
- Verification is rejected on the grounds that our scope use isn't clearly justified — the video and the incremental flow would need to be rebuilt around the reviewer's feedback.
- The `gmail.send` refusal rate turns out to be so high that escalation email as a mechanic is de facto disabled — would need to reconsider whether the sender-account model is worth the friction.
- We start needing `gmail.readonly` or `gmail.modify` (currently no plan to). Those are *restricted* scopes, not sensitive — they require a full CASA security audit (paid, ~$15-75k) on top of OAuth Verification. Would need its own ADR.

## Follow-up

- Add a `## Send paths` section to [delivery.md](../lld/delivery.md) documenting the split between `gmail.send`-via-user and transactional-provider-via-Jarvis. Tracked.
- Add an "OAuth Verification submission" milestone to the delivery timeline — the two-to-six-week clock starts when the backend has the OAuth flow working end-to-end, not when it's production-perfect. File early.
