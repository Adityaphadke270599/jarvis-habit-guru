# PRD Slice — Jarvis: The Habit Guru
**Demo scope, Option C (hybrid).** Input for Claude Design and Claude Code.

| Field | Value |
|---|---|
| Author | PM, Zemosolabs |
| Status | Draft v1, design-ready |
| Demo date | Thu 2 Jul 2026 |
| Audience | Kanchuki |
| Source brief | `product-brief-jarvis-habit-guru.md` |
| Pinned sentence | The job is **Keep today's promise.** Everything we ship must make that easier, warmer, witnessed, and quietly identity-affirming. |

---

## 1. Demo thesis

**Aha (compound):** *"Jarvis got to the point in 90 seconds, and the loop actually works."*

Two payloads in one walkthrough — the **GenAI craft signal** (Jarvis interviews like a senior coach, not a wizard with checkboxes) followed by the **product proof** (the daily loop runs end-to-end, in voice, with witness).

**Three sentences Kanchuki should leave repeating:**
1. *"The onboarding talked to me like a person, not a form."*
2. *"It tracks 'days kept, days missed' — never zeros me out."*
3. *"The circle saw me show up in real time."*

---

## 2. Scope at a glance

**In:** Hardcoded sign-in, 90-second Jarvis-led onboarding, register slider (gentle ↔ direct, one voice), two pre-populated dummy partners, full daily loop with miss path, milestone teaser, streak display.

**Out (cut on purpose):**
- Real auth (Email/OTP, Google SSO) — replaced by "Sign in as Arjun" button
- Personality picker (Friendly / Strict / Father) — violates locked voice pillar; replaced by register slider
- Real partner invite flow (email, accept, multi-user onboarding) — dummy partners only
- Real Google Calendar + Gmail wiring — consent screen shown, integration is roadmap
- Persistent "chat with Jarvis anytime" surface — onboarding chat UI is the only conversational surface this sprint; reusable for future miss-probe
- Adaptive unit shrinking — proposed only as Jarvis copy; no model behind it yet
- Full personality questionnaire — folded into the onboarding interview as 2 inline questions

**Non-goals (forever, not just demo):** Shame mechanics, red Xs, zeroed streaks, leaderboards, member-vs-member comparison, emoji enthusiasm.

---

## 3. User flow (demo arc)

The walkthrough Kanchuki sees, end-to-end:

| # | Screen | What happens |
|---|---|---|
| 0 | Splash | "Sign in as Arjun" — one tap, skips auth entirely |
| 1 | Jarvis opener | *"Good evening, sir. Before we begin — what habit are you trying to build, or break?"* User types: "Read 30 min/day" |
| 2 | Tiny-unit reframe | Jarvis proposes shrinking: *"30 minutes is a fine target. May I suggest we start at 10? Easier to keep than to restart."* User accepts |
| 3 | Register slider | *"When you miss a day — do you want me gentle, or more direct?"* Single slider, one voice |
| 4 | Frequency | *"How often shall I check in?"* Daily / Weekdays / Custom |
| 5 | Circle | *"Who's witnessing this with you?"* Two dummy partners (Jaanvi, Mike) pre-populated; user "confirms" |
| 6 | Consent | *"May I place this on your Calendar, and reach you by email on a missed day?"* Visual screen; integration stubbed |
| 7 | "Here's how it works" | 4-card animated preview of the daily loop |
| 8 | **Cut to Day 14** | Demo jumps forward — today's nudge card visible; the habit dashboard shows 12 days kept, 2 missed on the calendar dots |
| 9 | Group view | Jaanvi done, Mike pending, Arjun pending |
| 10 | Check-in | One-tap ✓ — broadcast animates to circle |
| 11 | Jarvis close | *"Day fourteen, sir. Twelve kept, two missed. The book is winning — quietly, but it is winning."* |
| 12 | Miss reflection | Jarvis surfaces the 2 prior misses: *"Two quiet days in the last fortnight, sir. No judgement — but if you've a moment, what got in the way, and how are you sitting with them?"* User replies in chat; Jarvis acknowledges in voice and offers (no pressure) to shrink the unit if a pattern is forming |
| 13 | Milestone teaser | Day 21 card glimpsed: *"You are no longer someone trying to read. You are a reader."* |

Total demo runtime target: **6–8 minutes.**

---

## 4. Feature inventory + RICE

**Scoring axes (demo-context):**
- **Reach** = fraction of demo arc exposed (1.0 central / 0.5 shown briefly / 0.2 teased)
- **Impact on Aha** = 1 (supports) / 2 (reinforces) / 3 (carries it)
- **Confidence** = 1.0 (trivial) / 0.8 (standard) / 0.5 (risky)
- **Effort** = person-days
- **RICE** = (R × I × C) / E

Sorted by RICE descending. **MUST** = ≥ 3.0, **SHOULD** = 1.0–3.0, **WON'T this sprint** = below 1.0 or out-of-scope.

| # | Feature | R | I | C | E | RICE | Verdict |
|---|---|---|---|---|---|---|---|
| F1 | Streak display ("X days, Y missed") | 1.0 | 2 | 1.0 | 0.25 | **8.0** | MUST |
| F2 | Frequency question (daily/weekdays/custom) | 1.0 | 2 | 1.0 | 0.25 | **8.0** | MUST |
| F3 | Tiny-unit reframe ("may I propose 10?") | 1.0 | 2 | 0.8 | 0.25 | **6.4** | MUST |
| F4 | Today's nudge card (in-app) | 1.0 | 3 | 1.0 | 0.5 | **6.0** | MUST |
| F5 | One-tap check-in ✓ | 1.0 | 3 | 1.0 | 0.5 | **6.0** | MUST |
| F6 | Jarvis end-of-day close (composeMilestone-style) | 1.0 | 3 | 0.8 | 0.5 | **4.8** | MUST |
| F7 | Hardcoded "Sign in as Arjun" | 1.0 | 1 | 1.0 | 0.25 | **4.0** | MUST |
| F8 | Accountability circle screen (dummy partners) | 1.0 | 2 | 1.0 | 0.5 | **4.0** | MUST |
| F9 | Calendar/Gmail consent screen (visual only) | 1.0 | 1 | 1.0 | 0.25 | **4.0** | MUST |
| F10 | "Here's how it works" 4-card preview | 1.0 | 2 | 1.0 | 0.5 | **4.0** | MUST |
| F11 | Group view (circle status today) | 1.0 | 3 | 1.0 | 0.75 | **4.0** | MUST |
| F12 | Habit dashboard (today + history under one habit) | 1.0 | 2 | 1.0 | 0.5 | **4.0** | MUST |
| F13 | Milestone teaser screen (day 21 identity moment) | 0.5 | 3 | 1.0 | 0.5 | **3.0** | MUST |
| F14 | Jarvis onboarding interview (habit capture) | 1.0 | 3 | 0.8 | 1.5 | **1.6** | MUST¹ |
| F15 | Register slider (gentle ↔ direct, one voice) | 1.0 | 1 | 0.8 | 0.5 | **1.6** | SHOULD |
| F16 | Miss-path follow-up + retrospective probe (in-app, Jarvis voice) | 1.0 | 3 | 0.8 | 0.75 | **3.2** | MUST |
| F17 | Miss reason capture (private log) | 1.0 | 2 | 0.8 | 0.5 | **3.2** | MUST |
| F18 | Personality questionnaire (full, 5–7 Qs) | 1.0 | 1 | 0.8 | 1.0 | 0.8 | WON'T — folded into F14 |
| F19 | Adaptive unit-shrink (data-driven, not just copy) | 0.5 | 2 | 0.5 | 1.0 | 0.5 | WON'T — roadmap |
| F20 | Real Google Calendar event creation | 0.5 | 2 | 0.5 | 1.5 | 0.33 | WON'T — roadmap |
| F21 | Real Gmail miss follow-up | 0.5 | 2 | 0.5 | 1.5 | 0.33 | WON'T — roadmap |
| F22 | Persistent chat-with-Jarvis surface | 0.5 | 1 | 0.5 | 1.5 | 0.17 | WON'T — F14 UI reusable later |
| F23 | Real partner invite flow (email, accept, onboard) | 0 | 0 | 0.5 | 2.0 | 0 | WON'T — cut by Option C |
| F24 | Real auth (Email/OTP, Google SSO) | 0 | 0 | 0.8 | 1.0 | 0 | WON'T — cut by Option C |

¹ F14 is MUST despite a low RICE — the score is artificially deflated by effort, but the Aha *cannot* land without it. RICE is a forcing function, not a tyrant; this one is a strategic override and noted as such.

**Effort tally for MUST set:** ~7.5 person-days (F16 and F17 promoted by the Day-14 probe decision). SHOULD set: ~0.5 (only F15 remains). Total: ~8 days. Sprint has 7 working days remaining (D2 → D9). The retrospective probe is now on the demo critical path; the register slider (F15) is the only cut surface if D5/D6 wobble.

---

## 5. Functional requirements (the MUST cut)

Lifted from Brief §2.3 and §5, scoped to demo. Numbered by feature.

**F14 — Onboarding interview**
- FR14.1: Conversational UI (chat bubbles, Jarvis-led)
- FR14.2: Capture habit (free text) + tiny daily unit (free text or stepper)
- FR14.3: One-shot reframe if unit reads as ambitious (>20 min, >1 chapter, etc.) — Jarvis proposes smaller; user accepts or overrides
- FR14.4: Capture frequency, register, accountability circle, consent — in that order
- FR14.5: Persist habit profile to local state; no backend round-trip required for demo

**F4 / F5 / F11 / F12 — The loop**
- FR-loop.1: Today's nudge card visible on app open if state = "pending"
- FR-loop.2: One tap ✓ marks today as kept; latency under 1 second
- FR-loop.3: Group view shows each member with status (done / pending / missed) and current streak
- FR-loop.4: Streak format is **always** "X days kept, Y missed" — never a single number, never a zero
- FR-loop.5: Habit dashboard (F12) shows last 14 days as small calendar dots — green / grey / amber

**F6 — Jarvis end-of-day close**
- FR6.1: Triggered immediately on first check-in of the day
- FR6.2: Copy composed by Claude API call (composeMilestone prompt, Brief §10)
- FR6.3: Falls back to a pre-written line if API errors — never blocks the UI

**F16 / F17 — Miss path (forward) + retrospective probe**
- FR16.1: If today's rollover hour passes without ✓, state flips to "missed"
- FR16.2: Jarvis follow-up card appears next session, in voice (composeMissFollowup)
- FR16.3: At the day-N close, if prior misses exist in the habit's history, Jarvis surfaces them with a single retrospective question (one prompt, not a chain) — composeMissReflection
- FR16.4: Retrospective probe is conversational (chat bubble UI, reuses the F14 onboarding chat component); user can decline to engage without penalty
- FR17.1: Reason capture is a free-text field, optional, **never shared with the circle**
- FR17.2: Reason stored in private log; not surfaced to any other UI this sprint
- FR17.3: Both forward miss-reason capture (FR16.2) and retrospective probe (FR16.3) write to the same private log

---

## 6. Non-functional requirements (the hard rules)

Pulled from Brief §8.2 — these are NFRs, not preferences.

| NFR | Rule | How we verify |
|---|---|---|
| NFR1 | No shame mechanics, ever. No red Xs, no zeroed streaks, no "you fell behind." | Design review on D5; copy review on D3 |
| NFR2 | Reason logs are private by default. | Group view contract — status only, never reason |
| NFR3 | One tap maximum for daily check-in. | Interaction test on D4 |
| NFR4 | No comparison between members. No leaderboards. | Group view design check |
| NFR5 | Streak preserved on miss — always "X kept, Y missed." | Streak component contract |
| NFR6 | Voice consistency — ~70/30 formal/dry, "sir" sparingly, no emojis, no exclamations. | Voice acceptance check on D3 |
| NFR7 | Check-in latency under 2 seconds. | Manual stopwatch test on D4 |
| NFR8 | No PII in client bundle, no secrets in JS. | Track E security audit on D7 |

---

## 7. Design handoff notes (for the Claude Design prompt)

The PRD is the *what*. The Claude Design prompt is the *how it looks and feels*. Anchors for that next artefact:

**Aesthetic direction (one line):** A quiet, considered habit companion. Closer to Things 3 or Linear than to Duolingo or Habitica. Warmth comes from typography and copy, not from colour.

**Four pillars on every primary screen (Brief §4.2):**
- **Witness** — at least one cue showing the circle is present (avatars, status dots)
- **Warmth** — Jarvis voice present in at least one piece of copy
- **Resilience** — streak shown as "kept / missed," never as a punitive single number
- **Identity** — at the milestone screen, language ladders from behaviour to becoming

**Gestalt principles to apply explicitly:**
- *Proximity* — circle members grouped together, separate from solo metrics
- *Similarity* — done/pending/missed states use consistent visual language across screens
- *Continuity* — daily loop reads left-to-right or top-to-bottom as a flow, not a grid
- *Figure/ground* — today's action (check-in button or nudge card) is the figure; everything else recedes

**Atomic structure (light):**
- **Atoms:** Button, Tick, Avatar, StatusDot, StreakChip
- **Molecules:** CircleMemberRow, NudgeCard, JarvisMessage, HabitDayDot
- **Organisms:** GroupView, CheckInScreen, OnboardingChat, MilestoneScreen, HabitDashboard

**Hard visual rules:**
- No red. No flame icons. No "🔥". No "💪". No emoji at all.
- Serif accent face permitted for Jarvis quotes; sans for UI chrome.
- Streak chip always two-number: "14 ▪ 1" or "14 kept, 1 missed" — never "14 🔥".

---

## 8. Decisions closed (D2)

The four open items are now locked. Listed here so downstream artefacts (Claude Design prompt, Claude Code prompt) consume them without ambiguity.

1. **Onboarding chat input mode** — **Typed** for the habit question (F14.2); **button / MCQ** for everything else (frequency, register, circle confirm, consent). Best of both worlds — the GenAI craft signal lands where it matters, the rest is safe-to-ship.
2. **Demo state seed (Day 14)** — **12 kept, 2 missed.** At the day-14 close, Jarvis surfaces the 2 prior misses and probes them reflectively (*"what got in the way, how are you sitting with them?"*). **Consequence:** this promotes F16 and F17 from SHOULD to MUST — the miss probe is now on the demo critical path, not teased on a secondary habit. Replaces the "toggle to workout habit" beat in §3.
3. **Dummy partner names** — **Jaanvi** and **Mike.** Avatars: any two warm, age-appropriate illustrations; no photos.
4. **Register slider — stops** — **3 stops:** Gentle / Neutral / Direct. Default to **Neutral.**

---

## 9. What this PRD does *not* cover

- The Phase 0 voice prompts (composeNudge / composeMissFollowup / composeMissReflection / composeDigest / composeMilestone) — separate artefact, drafted D2/D3
- The ADR for PWA + stack — separate artefact, drafted D0/D1
- The Claude Code prompts — drafted off this PRD + the design output
- The agent architecture (Analyser/Planner/Executor) — explicitly deferred to roadmap; not in demo
