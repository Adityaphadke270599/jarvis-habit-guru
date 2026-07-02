# Jarvis: The Habit Guru

**Working title.** The accountability-first habit system with a British-gentleman AI coach.

**Product Manager:** Aditya Phadke, Zemosolabs
**Status:** Pre-PRD → PRD drafting in progress

---

## Project Overview

A habit system where users make one tiny daily commitment, invite 2–4 trusted accountability partners, and are supported by **Jarvis** — a warm AI coach modelled on Tony Stark's JARVIS and Alfred from Batman. The core thesis:

> **Discipline is a design problem. Make the daily promise small, witnessed, and warmly received — and habits form themselves.**

The pinned job-to-be-done across every artefact:
> **Keep today's promise.** Everything we ship must make that easier, warmer, witnessed, and quietly identity-affirming.

---

## Folder Structure

```
jarvis-habit-guru/
├── CLAUDE.md                     ← this file
├── Research/                     ← market research, product briefs, first-principles docs
│   └── product-brief-jarvis-habit-guru.md
├── PRD/                          ← product requirements documents
├── Design/                       ← wireframes, mockups, Figma exports, voice/tone specs
├── Backend/
│   ├── src/                      ← backend application code
│   └── prompts/                  ← Jarvis Claude prompt library (nudge, miss, digest, milestone)
├── Frontend/
│   ├── src/                      ← shared/utility code
│   ├── screens/                  ← full-page screens (home, onboarding, group view, etc.)
│   └── components/               ← reusable UI components
├── n8n-workflows/                ← n8n automation flows (daily trigger, miss follow-up, digest)
└── Docs/                         ← internal docs, ADRs, onboarding notes
```

---

## Tech Stack

| Layer | Tool |
|---|---|
| AI brain (Jarvis voice) | Claude API |
| Orchestration / scheduling | n8n (daily trigger → Claude → channel) |
| Delivery channels | Google Calendar (nudge), Gmail (miss follow-up, digest) |
| Mobile / web UI | Mobile app (in build) |
| Group state & history | Persistent storage (mobile app backend) |

---

## Jarvis — Voice & Tone

Jarvis is the product's emotional payload. Never let his voice drift.

- **Identity:** British gentleman. Distinguished, dryly witty, anti-fragile.
- **Tone mix:** ~70% formal, ~30% dry banter.
- **Address:** "Sir" (or user-chosen honorific). Use sparingly so it carries weight.
- **Allowed flourishes:** "Right then.", "Quite.", "Indeed, sir.", "I dare say…", "If I may…", "Permit me to note…", "A small observation —", "With respect,…"

**Canonical examples:**

✅ Morning nudge: *"Good morning, sir. Today's promise — ten minutes with the book. The circle awaits your tick."*

✅ Miss follow-up: *"A quiet day, sir. No judgement — but if you've a moment, what got in the way? I'll adjust accordingly."*

✅ Milestone close: *"Day twenty-one, sir. With respect, you are no longer someone trying to read. You are a reader."*

**Hard forbidden:**
- Red Xs, zeroed streaks, "you fell behind"
- Exclamation-point enthusiasm
- Emojis (anywhere in product copy)
- "boss," "mate," "buddy," "champ," "rockstar"
- American football metaphors, cod-Shakespeare, anything that reads as parody

---

## Four Design Pillars

Every main screen should visibly express all four:

1. **Witness** — the accountability circle is present at every step
2. **Warmth** — Jarvis's voice is the emotional payload; no shame mechanics
3. **Resilience** — streaks display "X days, Y missed," never zero on a miss
4. **Identity** — the close of each day names the user as the practitioner

---

## Hard NFRs (non-negotiable)

- No shame mechanics, ever. No red Xs, no zeroed streaks, no "you fell behind."
- Reason logs are private by default. The circle never sees the *why* of a miss.
- One tap maximum for the daily check-in. That is the friction ceiling.
- No leaderboards, no member comparison. Witness, never compete.
- Streak preserved on miss — always "X days, Y missed."
- Frequent misses → gentler tone + offer to shrink the unit. Not pressure, not escalation.

---

## Build Phases

| Phase | What |
|---|---|
| **0 — Voice/Brain** | Jarvis prompt library: `composeNudge`, `composeMissFollowup`, `composeDigest`, `composeMilestone` |
| **1 — Check-in loop** | Shared group state + one-tap check-in; circle's daily status screen |
| **2 — Delivery** | n8n orchestration: Calendar nudge + Gmail miss follow-up |
| **3 — Progress visible** | Streak display ("14 days, 1 missed"), milestone watch, weekly group digest |
| **4 — Identity & Conclude** | Milestone identity moments, 100-day graduation flow, reflection prompts |

---

## Key Source Documents

| Document | Location | Purpose |
|---|---|---|
| Product Brief | `Research/product-brief-jarvis-habit-guru.md` | Upstream source-of-truth; read before producing any PRD or design artefact |
| PRD | `PRD/` (to be created) | Derived from Product Brief §2, §7, §8 |
| Jarvis Prompt Library | `Backend/prompts/` (to be built) | Phase 0 deliverable |

---

## Working with this Codebase

- **Before writing any copy or UI text:** re-read the Voice & Tone section above and `Research/product-brief-jarvis-habit-guru.md` §10.
- **Before scoping any feature:** check against the 8-step Job Map in the Product Brief (§2.3) and the Hard NFRs above.
- **Before designing any screen:** the Golden Path (Brief §5) is the primary screen-flow source. The Friction Budget is the hard ceiling — one tap max for the daily check-in.
- **Prompt files in `Backend/prompts/`:** always test output against the calibrated voice examples above before shipping.
