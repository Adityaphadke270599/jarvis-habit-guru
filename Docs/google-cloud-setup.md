# Google Cloud Setup — hand-off checklist

Actions you (Aditya) run in your browser once, before the backend can make its first Google API call. Estimated time: **20 minutes** for the code path; **file the verification submission the same day** (see §5) since it's the long-running dependency.

## Prerequisites

- A Google account you own the accountability app under (the one that will show as the "developer" on consent screens).
- A verified domain you control (e.g., `jarvis.app`, `zemosolabs.com`) — needed for OAuth verification later. Not strictly required to boot the backend locally.

## 1. Create the GCP project

- Go to https://console.cloud.google.com/
- Top bar → project dropdown → **New Project**
- Name: `jarvis-habit-guru` (or similar). Organisation: leave as-is.
- Note the Project ID once created — you'll need it in a few places.

## 2. Enable the APIs

APIs & Services → Library. Search for and enable each:

- **Google Calendar API**
- **Gmail API**
- **Google People API** (used for the identity flow's userinfo endpoint)

## 3. Configure the OAuth consent screen

APIs & Services → OAuth consent screen.

- User Type: **External** (Internal is only for Google Workspace orgs).
- App name: `Jarvis` (or your chosen product name).
- User support email: yours.
- App logo: skip for now (needed for verification, not for dev).
- App domain / homepage: your verified domain if you have one, else your GitHub repo URL as a placeholder.
- Developer contact: yours.

**Scopes** — click "Add or Remove Scopes." Add exactly these three:

- `openid`
- `.../auth/userinfo.email`
- `.../auth/userinfo.profile`
- `.../auth/calendar.events`
- `.../auth/gmail.send`

Save.

**Test users** — while the app is unverified, only these email addresses can complete the OAuth flow. Add:

- Your own Google account
- Any partner accounts you'll use for demo (e.g., accounts you control that represent "Mike" and "Jaanvi")

**Cap:** 100 test users total. Enough for closed beta.

## 4. Create the OAuth 2.0 Client

APIs & Services → Credentials → Create Credentials → **OAuth client ID**.

- Application type: **Web application**
- Name: `Jarvis backend (dev)`
- Authorized JavaScript origins:
  - `http://localhost:4000`
  - `http://localhost:5173` (Frontend dev server)
- Authorized redirect URIs:
  - `http://localhost:4000/auth/google/callback`

Save. Google shows you the **Client ID** and **Client Secret** — copy both.

**Paste them into `Backend/.env`:**

```
GOOGLE_CLIENT_ID=<the client id>
GOOGLE_CLIENT_SECRET=<the client secret>
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback
```

Also generate the two secrets the env file requires:

```bash
# In Terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"  # SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"  # TOKEN_ENCRYPTION_KEY
```

Paste both into `.env`.

## 5. File the OAuth Verification submission (the long-running dependency)

Do this the same day you complete steps 1–4. Verification takes **2–6 weeks**, and 100-user cap kicks in immediately without it.

OAuth consent screen → **Publishing status: In production** → **Prepare for verification**.

Google will ask for:

- **Homepage URL** — must be on your verified domain.
- **Privacy policy URL** — must exist, must be linkable, must specifically mention the sensitive scopes you're using and what you do with them. Template starting point: https://www.google.com/about/appsecurity/help/privacy-policies/
- **Terms of service URL** — same.
- **App homepage screenshots.**
- **Scope justification per scope** — one paragraph each explaining why you need `calendar.events` and `gmail.send`. The `Docs/adr/0006-oauth-consent-choreography.md` "voice cue" copy is a good starting point for the reviewer-facing text.
- **Demo video** — a screen recording showing each scope in use. For `calendar.events`, show onboarding requesting the scope with in-app copy, then the app creating an event on the Jarvis calendar. For `gmail.send`, show the escalation email being sent (a real send, with the recipient consenting). Google's reviewers want to see the app actually using each scope — no marketing content, just the flow.

Google may come back with clarifying questions; respond within their SLA (usually 5 business days) or the submission goes stale.

## 6. Boot the backend locally

Once `.env` is filled:

```bash
cd Backend
pnpm install
pnpm db:migrate   # creates dev.db via Prisma
pnpm dev
```

You should see `Jarvis backend listening on http://localhost:4000`.

## 7. Test the OAuth flow end-to-end

In a browser (must be logged in as a test user from §3):

- Visit `http://localhost:4000/auth/google` → Google consent screen (identity only) → redirects to `http://localhost:5173/#/today`
- Visit `http://localhost:4000/auth/google/grant?scope=calendar` → Google consent screen (calendar.events only) → redirects back
- `POST http://localhost:4000/delivery/calendar/test-event` (with the session cookie) → response includes `htmlLink` to the new event on the Jarvis calendar
- Open Google Calendar → the "Jarvis — Habit Guru" calendar exists in the sidebar with the test event on it

That's Phase A + half of Phase B complete.

## Common failures

- **"redirect_uri_mismatch"** — the URI in `.env` doesn't match what's in the OAuth client's Authorized redirect URIs. They must match exactly, character-for-character.
- **"access_denied"** — the Google account signing in isn't a test user. Add them in §3.
- **"invalid_client"** — Client ID or Secret has a stray whitespace character. Re-paste.
- **`prompt=consent` behaviour** — we force it on the identity flow so Google always returns a refresh_token. Subsequent grants use the default (incremental), so users don't see a repeat consent screen for scopes they've already granted.
- **Prisma "table not found"** — you forgot `pnpm db:migrate`. Run it.

## What this hand-off does NOT do

- Doesn't set up Postgres. SQLite is used for dev per Backend/.env.example.
- Doesn't set up a transactional email provider (for system emails). That happens in the next slice — see delivery.md.
- Doesn't submit for CASA (only needed if we ever add restricted Gmail scopes; currently we don't).
