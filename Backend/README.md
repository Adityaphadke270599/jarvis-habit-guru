# Backend

Jarvis Habit Guru — backend service. Modular monolith per [ADR-0002](../Docs/adr/0002-backend-shape-monolith-vs-services.md), one Postgres in prod, SQLite in dev.

## First run

1. Follow the Google Cloud setup: [Docs/google-cloud-setup.md](../Docs/google-cloud-setup.md). Non-optional — the backend won't boot without valid Google credentials in `.env`.
2. `cp .env.example .env` and fill in the values.
3. `pnpm install`
4. `pnpm db:migrate` — creates `dev.db` via Prisma.
5. `pnpm dev` — Fastify boots on the port in `.env` (default 4000).

## Module structure

Per [ADR-0002](../Docs/adr/0002-backend-shape-monolith-vs-services.md)'s "named seams" — one folder per module. No module reaches into another's data model directly.

```
src/
├── index.ts        # entry
├── app.ts          # Fastify wiring
├── config.ts       # env schema (fails fast on invalid config)
├── lib/            # db client, crypto — shared across modules
├── auth/           # Google OAuth, session, token storage
├── delivery/       # Calendar + Gmail adapters, ownership enforcement
├── habit-loop/     # (unwritten) habits, promises, streaks, check-ins
├── circle-witness/ # (unwritten) partnerships, follow-ups, escalation, stars
└── jarvis-orch/    # (unwritten) LLM call runtime, prompt library
```

## What's wired today

The smallest end-to-end from ADR-0006's build sequence:

- `GET /auth/google` — identity sign-in (per ADR-0006)
- `GET /auth/google/grant?scope=calendar` — incremental grant for `calendar.events`
- `GET /auth/google/grant?scope=gmail` — incremental grant for `gmail.send`
- `GET /auth/google/callback` — token exchange, encrypted storage
- `GET /auth/session` — session probe (used by Frontend on boot)
- `DELETE /auth/session` — sign-out
- `POST /delivery/calendar/test-event` — creates the Jarvis calendar (idempotent) and drops one event on it with the ADR-0005 provenance tag

Everything else — habits, promises, circles, Jarvis voice, the LLM — is scaffolded in the LLDs but not yet code.

## The MCP prototype

`Backend/mcp/` is a Python spike from [ADR-0004](../Docs/adr/0004-jarvis-mcp-tool-access.md)'s implementation note. It stays in Python; the TypeScript backend will drive it as a stdio subprocess when the two chat surfaces (onboarding, miss-reflection) get wired. Its OAuth handling will move under this backend's `auth/tokens.ts` at that point — see delivery.md open question "MCP prototype reconciliation."

## Env vars

See `.env.example`. Every value is required at boot; `src/config.ts` validates via zod and exits non-zero on missing or malformed input.
