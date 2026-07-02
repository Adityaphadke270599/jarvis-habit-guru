import * as React from "react";
import { cn } from "../../lib/cn";
import { Button } from "../atoms/Button";
import { Tick } from "../atoms/Tick";
import { WitnessLine } from "./WitnessLine";

export interface NudgeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Habit title, e.g., "Read 10 minutes". */
  habit: string;
  /** Eyebrow label above the habit. Defaults to "Today's promise". */
  eyebrow?: string;
  /** Jarvis's one-line nudge copy. Optional. */
  jarvisNote?: string;
  /** Partners visibly witnessing today. */
  partners: string[];
  /** Current state: open = primary check-in; kept = soft done state. */
  state?: "open" | "kept";
  /** Tap handler for the check-in CTA. */
  onCheckIn?: () => void;
}

/* The day's PROMISE surface — the figure of beats 1 and 3 of the Golden Path.
 *
 * Two states:
 *   - "open"  → primary CTA "Mark today's rep done" (one tap, broadcast)
 *   - "kept"  → quiet confirmation, no shouting, no streak number here
 *
 * Witness fires INSIDE this card (WitnessLine), making the circle present
 * BEFORE the rep — per the Golden Path note "publicly visible from sunrise". */
export const NudgeCard = React.forwardRef<HTMLDivElement, NudgeCardProps>(
  (
    {
      habit,
      eyebrow = "Today's promise",
      jarvisNote,
      partners,
      state = "open",
      onCheckIn,
      className,
      ...rest
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-5 p-5 rounded-xl",
        "bg-paper-deep shadow-card",
        className
      )}
      {...rest}
    >
      <div className="flex flex-col gap-1.5">
        <span className="ds-caps text-caps">{eyebrow}</span>
        <h2 className="text-display-md text-ink font-semibold leading-tight">
          {habit}
        </h2>
      </div>

      {jarvisNote && (
        <p className="ds-jarvis-quote text-body-lg text-ink-soft">
          {jarvisNote}
        </p>
      )}

      <WitnessLine partners={partners} />

      {state === "open" ? (
        <Button
          size="lg"
          fullWidth
          leadingIcon={<Tick size={20} />}
          onClick={onCheckIn}
        >
          Mark today's rep done
        </Button>
      ) : (
        <div className="flex items-center justify-center gap-2 h-14 rounded-lg bg-sage-tint text-sage font-medium">
          <Tick size={20} />
          <span>Kept today — broadcast to your circle</span>
        </div>
      )}
    </div>
  )
);

NudgeCard.displayName = "NudgeCard";
