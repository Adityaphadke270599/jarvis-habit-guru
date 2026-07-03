# LLD — App Structure

The Frontend PWA. Routing, state, offline behaviour, screen composition, and the boundary between design-system components and app-level state.

## Parent HLD

- [system-overview.md](../hld/system-overview.md) — the User is one actor in the system-context diagram; this LLD is how they experience it
- [ADR-0001](../adr/0001-mobile-shell-pwa-vs-native.md) — the shell is a PWA
- Design system: `Frontend/src/components/` (see `Frontend/.design-sync/conventions.md` for voice/pillar rules baked into props)

## Scope

Owns the PWA's runtime architecture:

- Routing between screens
- Client-side state (auth session, current habit, streak, circle, register)
- Offline behaviour (service worker strategy, IndexedDB persistence, sync queue)
- HTTP client (auth token attachment, retry, error surfacing)
- Realtime updates (SSE from backend for check-in broadcasts, star awards, close lines)
- Session lifecycle (login, refresh, logout, error recovery)

Does NOT own:

- The design system components (already in `Frontend/src/components/`)
- The demo click-through (`Frontend/src/demo/` is separate, for the walkthrough only)
- Screen prompts for Claude Design (owned by `Docs/design-agent-prompts.md`)

## Interface

### Public routes

Hash-based routing (safer for PWA install on iOS Safari):

| Route | Screen | Auth required |
|---|---|---|
| `/#/` | Splash / sign-in redirect | No |
| `/#/onboarding` | Multi-step Jarvis chat (F14) | Session-cookie required |
| `/#/today` | The daily NudgeCard + witness | Yes |
| `/#/circle` | GroupView | Yes |
| `/#/habit` | HabitDashboard | Yes |
| `/#/close` | End-of-day close + circle cheers | Yes |
| `/#/chat` | Miss-reflection probe (reuses OnboardingChat shell) | Yes |
| `/#/settings` | Register, task days, partner management | Yes |

### PWA manifest

Installable from Chrome and Safari (iOS 16.4+). Manifest lives at `Frontend/public/manifest.json`:

- Name: "Jarvis"
- Short name: "Jarvis"
- Display: `standalone`
- Start URL: `/#/today`
- Theme color: `#A07C3E` (brass)
- Background color: `#F4EDE3` (paper)
- Icons: 192 and 512 (brass "J" on paper)

## Internals

### 1. Directory structure

```
Frontend/src/
├── components/       # design system (existing — do not modify from app code)
├── app/              # NEW — app runtime lives here
│   ├── main.tsx      # entry, mounts <App />
│   ├── App.tsx       # top-level router + providers
│   ├── routes/       # one folder per route
│   │   ├── Today/
│   │   ├── Circle/
│   │   ├── Habit/
│   │   ├── Close/
│   │   ├── Chat/
│   │   └── Settings/
│   ├── state/        # global stores (session, habit, streak, circle)
│   ├── api/          # HTTP client, SSE client, offline queue
│   ├── offline/      # service worker, IndexedDB adapter
│   └── lib/          # small utilities
└── demo/             # existing — for the click-through prototype, untouched
```

The design system stays a leaf dependency of the app. Nothing in `app/` reaches into a component's internals. If a component prop is missing, the fix goes into the component, not around it.

### 2. State management

**Zustand** (small, no context/provider tree bloat). Three stores:

```ts
// state/session.ts — auth session, current user
interface SessionStore {
  user: User | null;
  status: "idle" | "authenticating" | "authenticated" | "expired";
  signInAsArjun: () => Promise<void>;   // demo path
  signInReal: () => Promise<void>;      // production path (deferred, per ADR-0001)
  signOut: () => void;
}

// state/habit.ts — the user's current habit, streak, and today's promise
interface HabitStore {
  habit: Habit | null;
  streak: { kept: number; missed: number };
  today: { promiseId: string; state: DayState };
  checkIn: () => Promise<void>;          // one-tap ✓ — the friction ceiling
  loadFromServer: () => Promise<void>;
}

// state/circle.ts — the accountability circle
interface CircleStore {
  partners: Array<{ id: string; name: string; status: Status; kept: number; missed: number }>;
  loadFromServer: () => Promise<void>;
}
```

Stores subscribe to server events via SSE (see §4) and refresh their slice.

### 3. HTTP client

Thin wrapper around `fetch`, with:

- Auto-attaches the session cookie (HttpOnly, `Secure`, `SameSite=Lax`)
- Retries `5xx` and network errors: 2 attempts, backoff 500ms / 2s
- 401 → automatic session refresh; if refresh fails, redirect to `/#/`
- Every request tagged with `X-Correlation-ID` (generated client-side, so the backend can join client and server logs)
- Errors surface as typed exceptions (`AuthExpired`, `Offline`, `ServerError`), not raw responses

### 4. Realtime updates (SSE)

One long-lived SSE connection per authenticated session, subscribed to `/api/events?userId={id}`. Events pushed from the backend orchestrator:

| SSE event | UI reaction |
|---|---|
| `voice.line_composed` | Update the Jarvis message in view (if on `/#/today` or `/#/close`) |
| `stars.awarded` | Toast + refresh streak count |
| `partner.followed_up` | Refresh circle store (partner's status changes) |
| `partner.ghost_detected` | Modal: "Jaanvi has been quiet for 14 days — keep, replace, or continue smaller?" |

Reconnect strategy: exponential backoff up to 30s, then keep trying every 30s. UI shows a small "reconnecting…" chip if backoff exceeds 5s, so the user knows.

### 5. Offline behaviour

The daily check-in tap MUST work offline. Nothing else needs to.

**Service worker** (via [Workbox](https://developer.chrome.com/docs/workbox)):

- Precache: HTML shell, `dist/index.js`, `dist/styles.css`, fonts
- Runtime cache: API GET responses with `stale-while-revalidate` (2h max age)
- POST requests use Background Sync: if offline, queue in IndexedDB and replay on reconnect

**Offline check-in path:**

1. User taps "Mark today's rep done"
2. `HabitStore.checkIn()` writes optimistically to IndexedDB and updates local state
3. HTTP POST fires; if it fails, the write stays in the outgoing queue
4. On reconnect, the queue drains
5. If the server rejects a queued check-in (e.g., day rollover already passed), the store reverts and surfaces a soft toast

**What we do not offline-support:** Onboarding (needs LLM). Miss reflection (also LLM). The circle view (needs fresh state).

### 6. Session lifecycle

- Sign in as Arjun (demo): backend issues a session cookie for a hardcoded user. No password, no OTP.
- Sign in real (production, deferred): TBD — will land as its own ADR when we need it (see ADR-0001).
- Refresh: automatic on 401. Cookie is HttpOnly + Secure, no client-side token handling.
- Sign out: `DELETE /api/session` + clear all Zustand stores + `window.location.hash = "/"`
- Session expiry: on repeated refresh failures (3 in 60s), force sign-out and show a soft "signed out" message.

### 7. Error surfacing

Three error tiers:

- **Silent**: transient network hiccup, offline queue drains later. Log to console only.
- **Soft**: toast at the bottom, non-blocking, dismisses after 4s. E.g., "Couldn't reach the circle — retrying."
- **Blocking**: full-screen error page with a "Sign in again" or "Reload" affordance. E.g., session expired, corrupted state.

## Tests

- **Route tests** — every route mounts without error given a valid session; auth-required routes redirect to `/#/` without one
- **State tests** — Zustand store mutations, subscriptions fire, no memory leaks on repeat mount/unmount
- **HTTP client** — 401 → refresh → replay; retry logic on 5xx
- **SSE client** — reconnect on drop; handler dispatch on each event type
- **Offline check-in** — network kill mid-tap: local state updates, queue populates, drains on reconnect
- **PWA install** — manifest passes Lighthouse audit; service worker registers cleanly on both Chrome and Safari

## Operational notes

Client-side telemetry (Sentry or similar):

- All uncaught exceptions
- SSE reconnect count per session
- Offline queue depth on drain
- Route render duration
- Check-in tap → server-ack latency (validates NFR7: under 2s)

Analytics events (non-PII):

- Onboarding funnel drop-off per step
- Check-in rate per user
- Escalation email click-through rate (attributed via the email link's `utm_*`)

## Open questions

- Do we bundle the demo click-through and the production app into one deployable, or two? Leaning: two, but sharing the DS. Demo lives at `demo.jarvis.app`, production at `app.jarvis.app`. Post-demo decision.
- Zustand vs. Redux vs. Context — Zustand chosen for cost; revisit only if we grow past ~10 stores.
- Push notification support — deferred per ADR-0001. When we add it, service worker gets a `push` handler and the manifest declares `gcm_sender_id`.
- Session cookie: `SameSite=Lax` today. If we ever host the app on a subdomain of a different site, revisit.
