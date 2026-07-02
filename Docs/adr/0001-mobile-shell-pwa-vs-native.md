# ADR-0001 — Ship the mobile shell as a PWA, not a native app

**Status:** Accepted
**Date:** 2026-07-02
**Deciders:** Aditya Phadke
**Consulted:** Kanchuki (post-demo)

## Context

The daily loop needs a mobile surface. Two Golden-Path beats — nudge (beat 1) and check-in (beat 3) — must feel one-tap fast and reach the user via their calendar/email in the interim. The rest of the beats happen inside the app.

Three broad routes:

- **PWA** — one React codebase, installable on iOS and Android, deployed as a web app. What the demo is built on today.
- **React Native** — one codebase, native shell, native notifications, app-store distribution.
- **Fully native (Swift + Kotlin)** — two codebases, best-in-class polish, highest cost.

Constraints that make this non-trivial:

1. The demo already exists as a React web build. Reusing it accelerates every downstream step.
2. Post-demo, the first 20 users are known personally. We don't need an app-store presence to reach them.
3. Push notifications on iOS PWAs are supported since iOS 16.4 (installed home-screen PWAs only). Android has full support.
4. The Golden Path leans on **email and calendar as delivery channels**, not app notifications, so the "push notification" gap is smaller than usual.
5. Every hour spent on native shell is an hour not spent on the Jarvis voice layer, which is the differentiator.

## Decision

We ship the mobile shell as an **installable PWA**, using the same React codebase as the demo. iOS users install via "Add to Home Screen"; Android users install via the browser install prompt. Push notifications are deferred — the Golden Path uses Calendar events and Gmail as its delivery channels.

We will revisit if — and only if — Kanchuki explicitly asks for App Store distribution as a condition of funding.

## Consequences

**Positive**

- Zero delta between the demo build and the shipped app on Day 1. The click-through Kanchuki sees IS the app.
- One codebase, one deploy pipeline, one bug surface.
- No app-store review latency. We can ship copy or component changes the same day.
- The Jarvis voice work stays on the critical path; native shell work does not.

**Negative (accepted)**

- iOS PWA install has friction (Safari-only, three-tap install flow). We accept this; the first 20 users will be personally onboarded.
- No home-screen widget on iOS. The daily nudge lives in Calendar and email until we build a native widget.
- App-store presence is deferred. If Kanchuki treats "downloadable from the App Store" as a proxy for legitimacy, we may need to revisit fast.

**Neutral**

- We are not locked in. React Native shares ~70% of the React codebase we're already writing, so switching later is a shell rewrite, not a full rewrite.

## Alternatives considered

- **React Native from Day 1** — Rejected. Adds native-shell complexity before we've earned it. The Jarvis voice work is more differentiating than native fidelity.
- **Fully native** — Rejected. Two codebases. Doubles every feature's cost from the second one onward. Not defensible for a team our size.
- **Web-only, no install** — Rejected. Users need something that looks and feels like an app on their phone. A bookmark isn't enough.

## Revisit criteria

- Kanchuki names App Store distribution as a funding condition.
- iOS PWA install friction blocks ≥ 30% of the first 20 onboarded users.
- We need home-screen widgets, background sync, or Health/HealthKit integration for the product to work.
- Push notification reach drops below 60% of the user base due to Safari-only install.
