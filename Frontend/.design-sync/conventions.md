# Jarvis: The Habit Guru — Design System

A quiet, considered habit companion. Warmth comes from typography and copy, not colour. Reads closer to Things 3 / Linear than to Duolingo. Mobile-only, ~390px viewport.

## Mounting a screen

Every full-page screen must be wrapped in `<div className="ds-viewport">…</div>`. That gives the 390px max-width and the paper background. Without it, layouts look unframed on desktop.

```tsx
import { CheckInScreen, GroupView } from "@jarvis/ds";

<div className="ds-viewport">
  <CheckInScreen
    greeting="Good morning, sir. Day fourteen — quietly to begin."
    habit="Read 10 minutes"
    partners={["Jaanvi", "Mike"]}
    state="open"
    onCheckIn={() => {}}
  />
</div>
```

The library's stylesheet (`styles.css`) defines `@import` for tokens, fonts, and Tailwind. Always load it once at the top of the app.

## Styling vocabulary — Tailwind preset

This DS ships a Tailwind preset. Use these utility classes for layout glue and adjustments; never invent off-system colors.

**Surfaces (background / borders)**
`bg-paper` `bg-paper-deep` `bg-paper-edge` (border) — three warm cream tones. `bg-paper` for screens, `bg-paper-deep` for cards, `bg-paper-edge` for hairlines.

**Text (foreground)**
`text-ink` (primary) `text-ink-soft` (secondary) `text-ink-faint` (captions, disabled, placeholders).

**Brass — the one accent**
`bg-brass` `text-brass` `bg-brass-deep` (pressed) `bg-brass-tint` (badge fills). Use sparingly: today, primary CTA, milestone eyebrow, active dial dot. One brass element per screen, ideally.

**State tones**
`bg-sage` / `text-sage` — habit *kept*. Muted moss. Never a joyful bright green.
`bg-dust` / `text-dust` — habit *missed*. Warm tan. **Never red.** The token system has no red value.
`bg-sage-tint` / `bg-dust-tint` for soft fills (e.g., kept-confirmation banner).

**Type**
`font-serif` (Cormorant Garamond) — for Jarvis's voice, only.
`font-sans` (Inter) — everything else.
Type scale: `text-display-xl` `text-display-lg` `text-display-md` `text-body-lg` `text-body` `text-body-sm` `text-caps` `text-caps-lg`.

**Component-class helpers**
`.ds-viewport` — mobile frame wrapper (mandatory on full screens).
`.ds-jarvis-quote` — serif weight/leading for Jarvis copy. Apply only to Jarvis's words.
`.ds-caps` — all-caps tracked label.
`.ds-rule` — 1px hairline divider.

**Radii**: `rounded-md` `rounded-lg` `rounded-xl` `rounded-pill` (used for pills, avatars, dots).

## Hard rules — the design agent must honour these

- **No red. Anywhere.** Not for errors, not for misses, not for warnings. There is no red token.
- **No emoji. Anywhere.** Not for streaks, not for reactions, not for celebration. The product has explicitly rejected this.
- **Streaks always show two numbers** — `<StreakChip kept={X} missed={Y} />`. Never a single number. Never a fire/flame icon.
- **"Missed" is always dust (warm tan)**, never red. The visual reads as "quiet day," not failure.
- **Jarvis's voice is serif + warm + dry-witted.** ~70% formal, ~30% understated humour. "Sir" used sparingly. No exclamations. Examples in `JarvisMessage` and `ChatBubble role="jarvis"`.
- **Witness pillar visible on every primary screen** — use `WitnessLine` on nudge surfaces, `CircleMemberRow` / `GroupView` for live status, `CircleCheers` at the close.
- **No leaderboards, no member comparison.** GroupView shows status only, never rank.
- **Reason logs are private** (`MissReflection`-style probes). Never surface them in any circle-visible component.

## Composing a screen — the four pillars to express

Every primary screen should make all four visible:

1. **Witness** — partners on-screen at some point (`WitnessLine`, `CircleMemberRow`, `CircleCheers`).
2. **Warmth** — Jarvis copy via `JarvisMessage` or chat bubble.
3. **Resilience** — when streak/history shows, use `StreakChip` or `DotCalendar`. Two numbers, never zero on miss.
4. **Identity** — at milestones (`MilestoneScreen`), language ladders from behaviour ("you tried") to becoming ("you are").

## Where the truth lives

- `_ds/jarvis-ds/styles.css` — all tokens, font imports, and the `.ds-*` helpers. Read this before adjusting colors.
- `_ds/jarvis-ds/components/<group>/<Name>/` — every component's `.d.ts` (prop API) and `.prompt.md` (usage).
- For voice/tone questions, the canonical examples live in the `JarvisMessage` and `OnboardingChat` previews.

## Idiomatic build snippet

```tsx
import { CheckInScreen, NudgeCard, JarvisMessage } from "@jarvis/ds";

export function MorningScreen({ partners }: { partners: string[] }) {
  return (
    <div className="ds-viewport flex flex-col gap-6 p-5">
      <JarvisMessage eyebrow="Good morning">
        Today's promise — ten minutes with the book. The circle awaits your tick.
      </JarvisMessage>

      <NudgeCard
        habit="Read 10 minutes"
        jarvisNote="The book waits on the shelf."
        partners={partners}
        state="open"
        onCheckIn={() => {}}
      />
    </div>
  );
}
```
