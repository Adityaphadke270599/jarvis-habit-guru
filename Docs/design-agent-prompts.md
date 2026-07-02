# Screen Prompts for Claude Design

Paste-ready prompts for the 13-beat demo arc from `PRD/jarvis-prd-slice-option-c.md` §3. Each prompt names the exact `@jarvis/ds` components to compose, the Jarvis-voice copy verbatim (do not let the agent paraphrase), and which of the four pillars is foregrounded.

## How to use

1. Open Claude Design (claude.ai/design)
2. Select the **Jarvis DS** design system (uploaded via `/design-sync`)
3. Paste one prompt at a time, screen by screen — the agent renders each as a React page using our real components
4. Iterate on copy or layout in-line if a screen doesn't land

**Global rules for every prompt (implicitly enforced by our conventions header, but worth restating in the first session):**
- Mobile only, 390px viewport, wrap every screen in `<div className="ds-viewport">`
- Never use red, orange, or emoji anywhere
- Streaks always render as two numbers (kept · missed) via `StreakChip`
- Jarvis's copy renders in serif via `JarvisMessage` or `ChatBubble role="jarvis"`

---

## Beat 0 — Splash

> Build a mobile splash screen (390px). Show the word "Jarvis" as a small brass caps eyebrow at the top, then the sentence "Keep today's promise." as a large serif display heading centred on the screen. Below it, a quieter serif sub-line: "A small, witnessed commitment — and a warm voice to meet you on the way." At the bottom of the screen, a full-width primary `Button` labeled "Sign in as Arjun". Below the button, a tiny caption: "Demo build · authentication stubbed."
>
> **Pillar:** Warmth (opens the emotional register).

---

## Beat 1 — Jarvis opener (chat, typed)

> Build an onboarding chat screen using `OnboardingChat`. History contains one Jarvis turn: *"Good evening, sir. Before we begin — what habit are you trying to build, or break?"* The input mode is `typed`, placeholder "What habit?" and the Send button routes forward. Do NOT show any other UI chrome.
>
> **Pillar:** Warmth. GenAI craft signal — this must feel like conversation, not a form.

---

## Beat 2 — Tiny-unit reframe (chat, choices)

> Extend the onboarding chat with two new turns. User: *"Read 30 minutes a day."* Then Jarvis: *"Thirty minutes is a fine target. May I suggest we start at ten? Easier to keep than to restart."* Input mode is `choices` (layout stack), two options: "Ten is fine." and "Keep it at thirty." The Continue button routes forward.
>
> **Pillar:** Warmth + Resilience (small unit = safer daily promise).

---

## Beat 3 — Register slider

> Screen shows the chat history so far, then a bottom sheet with a `RegisterSlider` set to `neutral`. Above the slider, a small caps eyebrow: "Register". Below it, three labels: Gentle · Neutral · Direct. A full-width Continue button underneath. Include a Jarvis intro turn just above the slider: *"When you miss a day — would you have me gentle, neutral, or rather more direct? One voice; the register changes."*
>
> **Pillar:** Warmth (Jarvis tone stays one voice — this is not a personality picker).

---

## Beat 4 — Frequency (chat, choices)

> Onboarding chat continues. New Jarvis turn: *"Noted. How often shall I check in?"* Choices (stack layout): "Daily", "Weekdays", "Custom".
>
> **Pillar:** Resilience (frequency preserves streak semantics — "custom" opens Task Days on later screens).

---

## Beat 5 — Circle confirm (chat, choices)

> Onboarding chat continues. New Jarvis turn: *"Excellent. Now — who's witnessing this with you? I'll cc them on the daily reminder."* Show two `Avatar` components (Jaanvi, Mike) with monogram tints centered above the choices. Choices: "Yes — Jaanvi and Mike." and "I'll choose later."
>
> **Pillar:** Witness. This is the first appearance of the circle — the visual anchor for every subsequent screen.

---

## Beat 6 — Consent

> Onboarding chat concludes. Jarvis: *"Splendid. One last thing, sir — may I place this on your Calendar, and reach you by email on a missed day?"* Choices: "Yes — please go ahead." and "Not yet." Include a tiny disclaimer under the choices: "Calendar and email are stubbed in this demo. No live integrations."
>
> **Pillar:** Warmth (asks permission rather than assuming).

---

## Beat 7 — "Here's how it works"

> Build a 4-card preview screen. Header: caps eyebrow "A quiet preview" (brass), then serif heading "Here's how it works, sir." Below, four numbered cards (01–04) each with a small eyebrow, serif title, and a body line:
>
> - **01 · Each morning** — "I'll set today's promise." · "A small, witnessed commitment — placed on your Calendar, cc'd to your circle."
> - **02 · Across the day** — "You keep it, off-app." · "Ten minutes with the book. The rep is yours; nothing performative."
> - **03 · One tap** — "Mark it done." · "A tick — and your circle sees you've shown up. The witness mechanic fires."
> - **04 · By evening** — "We close the day together." · "An identity-led word from me, and quiet acknowledgement from the circle."
>
> Bottom of screen: full-width primary Button "Begin".
>
> **Pillar:** All four — this is the daily loop teaser.

---

## Beat 8 — Day 14 nudge (check-in screen, open state)

> Build a `CheckInScreen`. Greeting from Jarvis: *"Good morning, sir. Day fourteen — and a quiet, unflashy one to begin."* Habit: "Read 10 minutes". Jarvis note on the NudgeCard: *"The book waits on the shelf. Ten minutes will do."* Partners: ["Jaanvi", "Mike"] — surfaced via `WitnessLine` inside the card. State: `open`. The check-in button label is "Mark today's rep done" with a Tick leading icon.
>
> **Pillar:** Witness (partners visible from sunrise) + Warmth (Jarvis greeting).

---

## Beat 9 — Group view (before check-in)

> Build a `GroupView`. Jarvis copy at the top: *"The circle is gathered. Jaanvi has shown today; Mike and you are yet to."* Members (in this order — self last):
>
> - Jaanvi · status `done` · kept 9, missed 1 · lastUpdate "Just now"
> - Mike · status `pending` · kept 11, missed 3
> - Arjun · status `pending` · kept 12, missed 2 · isSelf true
>
> **Pillar:** Witness. No ranking, no comparison. Order is stable.

---

## Beat 10 — Check-in tap (broadcast animation moment)

> Build the exact same `CheckInScreen` as Beat 8 but in state `kept`. Show the confirmation banner: Tick + "Kept today — broadcast to your circle" against a soft sage-tint background. Below the card, keep the honorific caption: "The rep itself is yours, sir. The tick is what reaches the circle."
>
> **Pillar:** Witness. This IS the broadcast moment.

---

## Beat 11 — Jarvis close (Day 14, identity-led)

> Build a `MilestoneScreen` for Day 14. Eyebrow "Day 14" (brass caps). Identity line (serif display XL): *"The book is winning, sir — quietly, but it is winning."* Closing line (soft serif): *"Twelve kept, two missed. A fortnight in, the practice has begun to take its own shape."* Cheers (via `CircleCheers`):
>
> - Jaanvi · "noted your tick today."
> - Mike · "saw the book is winning."
>
> Continue label: "A word about the two missed days."
>
> **Pillar:** Identity + Witness. Never a red X, never a zeroed streak.

---

## Beat 12 — Miss reflection (private probe)

> Build an `OnboardingChat` screen for the retrospective probe. History (one turn): Jarvis: *"Two quiet days in the last fortnight, sir. No judgement — but if you've a moment, what got in the way, and how are you sitting with them?"* Input mode: `typed`, placeholder: "What got in the way? (Private — never shared.)"
>
> After the user sends any text (or nothing), add two turns and switch to `choices` mode: user echo (or "I'd rather not say."), then Jarvis: *"Thank you for telling me, sir. I'll adjust the tone gently for the next stretch. If a pattern forms, I may quietly propose a smaller unit — never as pressure."* Single choice: "Thank you, Jarvis."
>
> **Pillar:** Warmth + Resilience. NFR2: reason is NEVER surfaced in the circle.

---

## Beat 13 — Day 21 milestone teaser

> Build a `MilestoneScreen` for Day 21. Eyebrow "A glimpse — Day 21" (brass caps). Identity line (serif display XL): *"You are no longer someone trying to read. You are a reader."* Closing line: *"With respect, sir — the practice has done its quiet work. Three weeks. The book has become a part of the day, not an item on it."* Cheers:
>
> - Jaanvi · "saw twenty-one days."
> - Mike · "noted the milestone."
>
> Continue label: "Restart the walkthrough."
>
> **Pillar:** Identity. This is the language ladder — from behaviour ("someone trying to read") to becoming ("you are a reader").

---

## Bonus — HabitDashboard (F12, secondary surface)

For completeness, one screen not on the main demo arc but exposed on demand:

> Build a `HabitDashboard` for the habit "Read 10 minutes". Pass a 14-day history with the pattern: kept, kept, missed, kept, kept, kept, kept, kept, kept, missed, kept, kept, kept, today. Task days: ["M","T","W","Th","F","Sa"] (Sundays off — habit is weekdays + Saturday). Jarvis note: *"Twelve kept, two missed. The book is winning — quietly, but it is winning."*
>
> **Pillar:** Resilience. The DotCalendar shows kept as sage, missed as dust, today as brass. Never a red X.

---

## Iteration checklist

When a rendered screen feels off, run through this before re-prompting:

- [ ] Is Jarvis's copy verbatim, or has it been paraphrased? (Re-quote.)
- [ ] Is the witness visible? (Partners on the screen somewhere — avatar, line, or card.)
- [ ] Is the streak two numbers? (Not "12 days", not "12 🔥")
- [ ] Any red? Any orange? Any emoji? (There shouldn't be.)
- [ ] Is the primary CTA brass, and only ONE thing on the screen brass?
- [ ] Are all measurements paper/ink family? (No off-system greys or purples.)
