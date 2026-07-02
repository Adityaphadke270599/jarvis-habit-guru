import * as React from "react";
import { cn } from "../../lib/cn";
import { JarvisMessage } from "../molecules/JarvisMessage";
import { CircleCheers, type CheerNote } from "../molecules/CircleCheers";
import { Button } from "../atoms/Button";

export interface MilestoneScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Day number (e.g., 14, 21). */
  day: number;
  /** Identity moment — language ladders from behaviour to becoming.
   *  Example: "You are no longer someone trying to read. You are a reader." */
  identityLine: string;
  /** Quiet eyebrow above the day. Defaults to "Day {day}". */
  eyebrow?: string;
  /** Optional supporting line from Jarvis. */
  closingLine?: string;
  /** Cheers from the circle — beat 5 witness landing. */
  cheers?: CheerNote[];
  /** Optional CTA at the bottom (e.g., "Carry on"). */
  onContinue?: () => void;
  continueLabel?: string;
}

/* MilestoneScreen — beat 5 of the Golden Path: identity-led close.
 *
 * The identity pillar's main expression. Full-bleed serif quote
 * treatment, brass eyebrow, and the circle's quiet acknowledgement.
 *
 * Day 14: "Twelve kept, two missed. The book is winning — quietly, but it is winning."
 * Day 21: "You are no longer someone trying to read. You are a reader." */
export const MilestoneScreen = React.forwardRef<HTMLDivElement, MilestoneScreenProps>(
  (
    {
      day,
      identityLine,
      eyebrow,
      closingLine,
      cheers,
      onContinue,
      continueLabel = "Carry on",
      className,
      ...rest
    },
    ref
  ) => (
    <section
      ref={ref}
      className={cn("ds-viewport flex flex-col gap-8 p-6 pt-12 min-h-[100dvh]", className)}
      {...rest}
    >
      <div className="flex flex-col gap-1">
        <span className="text-caps-lg ds-caps text-brass">
          {eyebrow ?? `Day ${day}`}
        </span>
      </div>

      <JarvisMessage tone="milestone">{identityLine}</JarvisMessage>

      {closingLine && (
        <p className="ds-jarvis-quote text-body-lg text-ink-soft leading-relaxed">
          {closingLine}
        </p>
      )}

      {cheers && cheers.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          <span className="ds-caps text-caps">The circle</span>
          <CircleCheers notes={cheers} />
        </div>
      )}

      <div className="mt-auto">
        {onContinue && (
          <Button variant="ghost" fullWidth onClick={onContinue}>
            {continueLabel}
          </Button>
        )}
      </div>
    </section>
  )
);

MilestoneScreen.displayName = "MilestoneScreen";
