# Product Brief — Jarvis: The Habit Guru
**Working title.** The accountability-first habit system with a British-gentleman AI coach.

**Document type:** Product Brief (pre-PRD). This is the upstream source-of-truth from which the PRD is drafted and the design is ideated. Read this end-to-end before producing either.

**Author:** Product Manager, Zemosolabs
**Status:** Draft v1, ready for PRD and Design handoff
**Related artefacts:** "The Pact" build spec; first-principles market research; Jarvis PM collaborator skill

---

## 1. The Strategic Frame

### 1.1 The market context

Wellness is a $500B+ consumer category in the US alone, growing 4–5% annually, with 84% of US consumers naming it a top or important priority (McKinsey, 2025). Habit and productivity apps capture a meaningful slice — but they fail catastrophically at retention: most apps see sharp drop-off within weeks of install. The dominant cohort of 2026 wellness consumers has moved past all-or-nothing self-improvement and toward **micro-habits and resilient routines** — small, repeatable actions that compound.

The structural problem in the vertical: every existing solution treats **discipline as a willpower problem.** It is, in fact, a **design problem.** A good system makes the right action the easy action. The market is full of trackers, gamifiers, and punishers. It is empty of *systems that make discipline structurally easier.*

### 1.2 The biggest unsolved problem

Six root causes of habit failure exist — activation cost, ambiguity, no feedback loop, invisible progress, all-or-nothing collapse, misfit difficulty. The single most powerful lever in the behaviour-change literature, however, is **scheduled peer accountability with a trusted person.** The ASTD finding: probability of completing a goal jumps from 65% ("you committed to someone") to **95%** ("you have a scheduled accountability appointment with someone you committed to"). No mainstream product operationalises that 30-point delta. Focusmate pairs strangers. Beeminder punishes with money. Habitica gamifies with strangers in a party. WhatsApp groups go silent. **Nobody has built the system for 3–5 trusted people, structured around a daily check-in, with a warm AI coach who handles the orchestration.**

Four blind spots no current product combines:
1. **Small trusted group as the accountability primitive** — not strangers, not solo, not gamified parties.
2. **AI as coach, not logger** — warm, real-time, voice-led, channel-native.
3. **Resilience as the metric** — bounce-back rate, not unbroken streaks.
4. **Identity reinforcement** — the user *becomes* the practitioner, not just logs the behaviour.

### 1.3 Our thesis

> **Discipline is a design problem. Make the daily promise small, witnessed, and warmly received — and habits form themselves.**

The product is a system in which a user makes one tiny daily commitment, invites 2–4 trusted accountability partners, and is supported by a warm AI coach (**Jarvis**) who orchestrates the daily nudge, the check-in, the celebration, and — critically — the gentle follow-up on a miss. The system is built around resilience-first design (a miss is data, not failure) and identity-led close (the user is named as *becoming* the practitioner over time, not just logging reps).

### 1.4 Why now

The 2026 consumer is fatigued by gamified self-improvement and primed for micro-habit, identity-led approaches. AI is finally good enough to act as a real coach (warm, context-aware, voice-consistent), not just a notification engine. Calendar and email integrations are commodity-level reliable. The build cost has collapsed.

---

## 2. The Job to Be Done

### 2.1 The Job Ladder

The three tiers, written as verb + object + qualifier:

| Tier | Statement | What it is |
|---|---|---|
| **T1 — Aspirational identity (5-year)** | Become a person of my word | The "why" the user wants this |
| **T2 — Main Job** | Keep today's promise | What the product is designed around |
| **T3 — Tactical execution** | Log today's tiny rep | The smallest visible user action |

Read upward (why?) and downward (how?). T2 is the sentence pinned at the top of every artefact from here forward.

### 2.2 Job Performer Environment

The Job Performer is the **end user** (the habit-builder). The Buyer is the same person (B2C self-purchase). Two non-obvious findings:

- **Audience = the accountability circle**, not just future-self. The peer partners *consume the output of the daily rep* by witnessing it. They are load-bearing, not optional.
- **Manager and Approver are voids in the environment.** Nobody traditionally manages or approves a personal habit. Jarvis (AI) plays the Manager role; the circle informally plays the Approver role through witness. These voids are the product opportunity.

### 2.3 The 8-Step Job Map

| Step | Parent job |
|---|---|
| 1 — Define | Define my daily commitment |
| 2 — Locate | Locate my accountability circle |
| 3 — Prepare | Prepare my daily routine |
| 4 — Confirm | Confirm my circle is ready |
| 5 — Execute | Log today's tiny rep |
| 6 — Monitor | Check today's group status |
| 7 — Modify | Adjust my daily unit |
| 8 — Conclude | Complete my 100-day track |

### 2.4 Granular Sub-Jobs (31 total)

| **Define** | **Locate** | **Prepare** | **Confirm** | **Execute** | **Monitor** | **Modify** | **Conclude** |
|---|---|---|---|---|---|---|---|
| 1.1 Choose my target habit | 2.1 Identify my trusted friends | 3.1 Schedule my daily slot | 4.1 Verify my partners are in | 5.1 Receive today's nudge | 6.1 Check my running streak | 7.1 Acknowledge my miss | 8.1 Hit my final milestone |
| 1.2 Set my tiny daily unit | 2.2 Invite my chosen partners | 3.2 Set my nudge channel | 4.2 Preview tomorrow's nudge | 5.2 Complete today's rep | 6.2 Check my circle's status | 7.2 Log my missed reason | 8.2 Celebrate with my circle |
| 1.3 Pick my track length | 2.3 Secure my partners' buy-in | 3.3 Connect my reminder tools | 4.3 Announce my start date | 5.3 Mark today's rep done | 6.3 Watch my next milestone | 7.3 Shrink my daily unit | 8.3 Reflect on my journey |
| 1.4 Name my deeper intent | — | — | — | 5.4 Capture today's reflection | 6.4 Celebrate my circle's wins | 7.4 Reset my cue | 8.4 Choose my next chapter |
| — | — | — | — | — | — | 7.5 Restart my streak | 8.5 Claim my new identity |

**Industry insight:** existing habit apps over-invest in Step 5 (Execute) and abandon the user at Steps 6, 7, 8 (Monitor circle, Modify, Conclude). Those three under-designed steps are exactly where this product can be distinctive.

**Strategic moments embedded in the map:**
- **5.4** (Capture today's reflection) closes the "context blindness" gap — the system finally knows the *why*.
- **7.2** (Log my missed reason) is the procrastination tracker — over weeks, this becomes self-knowledge.
- **8.5** (Claim my new identity) is the moment no current app delivers — the identity shift named and witnessed.

---

## 3. The User

### 3.1 Arjun Iyer — board-ready

**Arjun Iyer, 29. Senior PM, Bengaluru fintech. Reads aspirationally, acts sporadically.**

- **The problem:** Sets a habit on Monday, keeps it three days, misses once, resets to "from Monday." One miss reads as failure because no one witnesses it and no one cares.
- **What happens:** Shame stays private. Tools punish with red Xs. He deletes the app. Identity never shifts — he logs reps, never becomes the person.
- **What he needs:** A witness. A warm voice on the miss. Resilience framed as strength, not failure. Proof he's becoming someone.

### 3.2 The pattern — Arjun's formula and the problems on the way to consistency

Arjun's formula is the same one millions in his cohort run: Sunday-night ambition, Monday-morning start, a clean three or four days, then a tired Wednesday or a meeting-stacked Thursday, one miss, the week quietly declared "ruined," and a reset to "from Monday." The problems he hits along the way are mechanical, not moral. The daily unit he sets is too ambitious for the day he actually lives. The first miss reads to him as catastrophic rather than ordinary, so restart feels like *starting over* rather than *continuing.* No one in his daily orbit notices whether he reads tonight, which means the cost of skipping is paid only in self-image — precisely the cost he is most practised at deferring. The tools he has tried *punish* the miss: a red X, a zeroed counter, a notification telling him he's fallen behind. He deletes the app rather than be scolded by software. And beneath all of it sits the slower, quieter problem — the absence of identity reinforcement. On day 14, he does not get to feel that he is *becoming* a reader. He gets to feel that he has *logged* 14 reps. The gap between the behaviour and the becoming is structural, and it is the gap that closes most habits down at the very moment they were starting to take.

### 3.3 Adjacent problems orbiting Arjun

- **Asymmetric calendar discipline:** ruthless at work, absent for himself.
- **The competence–identity mismatch:** he runs successful product launches, which makes the personal slip feel disproportionately shameful and therefore unspeakable.
- **Benign humiliation from peer streaks:** his partner Riya's day-84 Duolingo run isolates rather than motivates.
- **The residue of the app graveyard:** every new tool inherits the cynicism of every previous failure. Our product has to survive that cynicism before it earns trust.

---

## 4. The Product Concept

### 4.1 Jarvis — the in-app AI coach

Jarvis is the system's voice. Modelled on Tony Stark's AI and Alfred from Batman — distinguished, dryly witty, unfailingly loyal, never sycophantic. He orchestrates the daily loop, writes the nudges and follow-ups, and names the identity shift over time. ~70% formal, ~30% dry banter. He calls the user "sir" (or equivalent honorific based on user preference) sparingly enough that it carries weight. He is *never* a guilt machine. A miss is met with a question, not a sanction.

**Voice anchors for the in-app Jarvis:**

✅ Morning nudge: *"Good morning, sir. Today's promise — ten minutes with the book. The circle awaits your tick."*

✅ Miss follow-up: *"A quiet day, sir. No judgement — but if you've a moment, what got in the way? I'll adjust accordingly."*

✅ Milestone close: *"Day twenty-one, sir. With respect, you are no longer someone trying to read. You are a reader."*

❌ Never: red Xs, "you broke your streak," "you fell behind," exclamation marks deployed as enthusiasm, emojis used at all.

### 4.2 The four pillars

The product rests on four design pillars, each addressing one of the unmet blind spots:

1. **Witness** — the accountability circle is present at every step. Daily nudges CC'd to partners; daily ticks broadcast in real time; cheers and milestones celebrated together.
2. **Warmth** — Jarvis's voice is the system's emotional payload. No shame mechanics. A miss is met with curiosity, not punishment.
3. **Resilience** — streaks display "X days, Y missed" rather than zeroing. Restart is silent and frictionless. The user is celebrated for *coming back,* not just for unbroken runs.
4. **Identity** — the close of each day, and especially milestone days, name the user as the practitioner. Behaviour ladders upward to becoming.

---

## 5. The Golden Path (daily loop)

### 5.1 Main Job on the canvas
**🟢 Keep today's promise — Complete today's task.**

### 5.2 Start and End states

- **🟢 Start:** *A new day. Today's promise is open.*
- **🟢 End:** *Today's promise kept — becoming, one day closer.*

The End state is designed asymmetrically — it confirms the daily win (T2) *and* signals the upward ladder to identity (T1).

### 5.3 The five-step daily loop

| | **Step 1** | **Step 2** | **Step 3** | **Step 4** | **Step 5** |
|---|---|---|---|---|---|
| **🔵 User action** | Receive today's nudge | Complete today's rep | Mark today's rep done | Witness my circle's day | Receive today's close |
| **🟠 Social / accountability layer** | Partners CC'd on the daily reminder — the commitment is publicly visible from sunrise | Off-app — the rep is private, the *outcome* is what becomes social | One tap ✓ — the check-in broadcasts to the circle in real time | Group view shows who's done, who's pending — the witness mechanic fires | Jarvis sends an identity-led close; circle cheers land |
| **🟠 Streak / system layer** | Calendar event + Gmail nudge in Jarvis voice; today's tiny unit named explicitly | System awaits check-in until rollover hour; no penalty for *when* it lands | Streak ticks to "Day 14 of 100, 1 missed" — preserved, not zeroed | Partners' streaks visible alongside own | Tomorrow's nudge queued; next milestone shown |

### 5.4 Friction budget

The user touches the app at most **twice per day** — once to see the nudge (Step 1), once to tap done (Step 3). Everything else is Jarvis and the circle doing work in the background. **One tap is the friction ceiling.** Anything more breaks the loop.

### 5.5 The miss branch (off Step 3)

If the user does not tap ✓ by the rollover hour:

| | **Miss-1** | **Miss-2** | **Miss-3** | **Miss-4** |
|---|---|---|---|---|
| **User action** | Acknowledge the miss | Log my missed reason | Receive Jarvis's reframe | Reset to tomorrow's promise |
| **System** | Gmail follow-up in Jarvis voice — gentle, never shaming | Reason captured in the procrastination log (sub-job 7.2) | Jarvis offers to shrink tomorrow's unit if pattern emerges | Streak shows "X days, Y missed"; tomorrow's nudge fires anyway |
| **Circle** | Sees "pending → missed" with no commentary | Reason is *not* shared with circle (privacy NFR) | Sees the user re-engage tomorrow | Restart is silent — no drama |

The miss branch is the design moment that separates this product from every habit app that came before it.

---

## 6. The Three Aha Moments

These are the experiential anchors the daily loop must produce. Design should manufacture them deliberately.

1. **"It landed."** First check-in. The user taps done; the tick broadcasts to the circle in seconds; Jarvis confirms warmly. The realisation: *I'm in a live social loop.*
2. **"It doesn't shame me."** First miss. Gmail follow-up arrives in Jarvis's voice — curious, kind, not a red X anywhere. The realisation: *the system absorbs the miss as data, not failure.*
3. **"I'm becoming this."** First milestone (day 21 typically). Jarvis names the identity shift; the circle is CC'd on the celebration. The realisation: *the system is helping me become someone, not just tallying reps.*

---

## 7. Build Phases

| Phase | What | Why first / next |
|---|---|---|
| **Phase 0 — Voice/Brain** | Jarvis prompt library: composeNudge, composeMissFollowup, composeDigest, composeMilestone. Tested against fake group state. | The voice *is* the product. A cold-copy version dies on day one. |
| **Phase 1 — Check-in loop** | Shared group state + check-in mechanic. Minimum viable: one screen showing the circle's daily status; one-tap check-in. | Core social mechanic. The moment partners can see each other show up, the thesis is demonstrated. |
| **Phase 2 — Delivery (Calendar + Gmail)** | n8n or equivalent orchestration: daily Calendar event fires the nudge; Gmail handles the miss follow-up. | Meets users in channels they already use. No new app to open daily. |
| **Phase 3 — Progress made visible** | Streak display ("14 days, 1 missed"), milestone watch, weekly group digest. | Compounding visibility is what carries weeks 2–4, the retention cliff. |
| **Phase 4 — Identity & Conclude (post-demo)** | Milestone identity moments; 100-day graduation flow; Jarvis's "what kind of person am I becoming" reflection prompts. | The strategic differentiator. Where the product transcends "habit tracker." |

---

## 8. The Honesty Box (risks and hard NFRs)

### 8.1 Risks
- **Shame is the failure mode.** If visibility tips from motivating into guilt-inducing, the product collapses. Every design choice must be tested against this.
- **The "tiny unit" rule is non-negotiable.** Over-committed units kill the loop at Step 2.
- **Channel friction.** If the user has to open a new app to check in, retention craters. Calendar / Gmail / WhatsApp meet them where they are.
- **The graveyard cynicism.** Users like Arjun arrive sceptical. The first week must feel structurally different from every habit app they've quit.
- **Voice drift.** If Jarvis slips into corporate cheer or generic motivation, the product loses its emotional payload. Voice consistency is load-bearing.

### 8.2 Hard NFRs
- **No shame mechanics, ever.** No red Xs, no zeroed streaks, no "you fell behind." This is a hard rule, not a guideline.
- **Reason logs are private** by default. The circle sees presence and outcomes, never the *why* of a miss.
- **One tap maximum** for the daily check-in.
- **No comparison between members.** No leaderboards. No "you're behind Priya." Witness, never compete.
- **Streak preserved on miss.** Always "X days, Y missed" — never zero.
- **Frequent misses → gentler tone + offer to shrink the unit.** Not pressure, not escalation.

---

## 9. Stack Summary

| Layer | Tool |
|---|---|
| **The brain (Jarvis voice)** | Claude API |
| **Orchestration / scheduling** | n8n (daily trigger → Claude → channel) |
| **Delivery channels** | Google Calendar (nudge), Gmail (miss follow-up, digest) |
| **Mobile / web UI** | Mobile app (in build) for habit input, partner management, group view |
| **Group state & history** | Persistent storage (mobile app backend) |

---

## 10. Voice & Tone Guidelines (for the in-app Jarvis)

For Claude Code and Claude Design to apply consistently in copy and UI.

### 10.1 Identity
British gentleman. Distinguished, dryly witty, anti-fragile. The voice of someone who has seen many habits attempted and treats each fresh attempt with calm seriousness.

### 10.2 Tone mix
~70% formal, ~30% dry banter. Formal does not mean stiff; banter does not mean jokey.

### 10.3 Forms of address
- "Sir" (or user-chosen honorific) is permitted and natural. **Use sparingly** so it carries weight — not every sentence.
- Never: "boss," "mate," "buddy," "friend," "champ," "rockstar."

### 10.4 Allowed flourishes
"Right then.", "Quite.", "Indeed, sir.", "I dare say…", "If I may…", "Permit me to note…", "A small observation —", "With respect,…"

### 10.5 Forbidden
Smug. Obsequious. Theatrical. Exclamation-point enthusiasm. Emojis. Catchphrase repetition. Cod-Shakespeare. American football metaphors. Anything that reads as parody.

### 10.6 Calibrated examples

✅ *"Good morning, sir. Today's promise — ten minutes with the book. The circle awaits your tick."*

✅ *"A quiet day, sir. No judgement — but if you've a moment, what got in the way? I'll adjust accordingly."*

✅ *"Day twenty-one, sir. With respect, you are no longer someone trying to read. You are a reader."*

❌ *"Hey there! 🎉 Great job! Keep that streak alive! 🔥"*

❌ *"You missed yesterday. Don't let it happen again."*

❌ *"Way to go, champion! You're crushing it!"*

---

## 11. What to do with this document

**For PRD drafting:**
- The Job Map (§2.3) and sub-jobs (§2.4) become FRs.
- The Honesty Box (§8) becomes NFRs and explicit non-goals.
- The Build Phases (§7) become the slice scoping.
- The Aha Moments (§6) become the success metrics.
- The Persona (§3) becomes the "users" section.

**For Design ideation:**
- The Golden Path (§5) is the primary screen-flow source.
- The Voice Guidelines (§10) shape every piece of copy on every screen.
- The Friction Budget (§5.4) is the hard ceiling on interaction count per screen.
- The Four Pillars (§4.2) — Witness, Warmth, Resilience, Identity — should each be visible somewhere on every main screen.

**One sentence pinned to every artefact downstream of this brief:**
> The job is *Keep today's promise.* Everything we ship must make that easier, warmer, witnessed, and quietly identity-affirming.
