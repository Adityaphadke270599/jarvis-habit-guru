import * as React from "react";
import { cn } from "../../lib/cn";
import { JarvisMessage } from "../molecules/JarvisMessage";
import { NudgeCard } from "../molecules/NudgeCard";

export interface CheckInScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** User's chosen honorific. Defaults to "sir" per voice spec. */
  honorific?: string;
  /** Time-of-day greeting copy — caller composes the line in Jarvis voice. */
  greeting?: string;
  /** Habit text (e.g., "Read 10 minutes"). */
  habit: string;
  /** Jarvis's one-line nudge for today. */
  jarvisNote?: string;
  /** Partners watching today. */
  partners: string[];
  /** Open = primary CTA, kept = post-tap confirmation. */
  state?: "open" | "kept";
  onCheckIn?: () => void;
}

/* CheckInScreen — beats 1 and 3 of the Golden Path.
 *
 * The figure is the NudgeCard. Everything else recedes (figure/ground).
 * Witness pillar fires inside the NudgeCard via WitnessLine. */
export const CheckInScreen = React.forwardRef<HTMLDivElement, CheckInScreenProps>(
  (
    {
      honorific = "sir",
      greeting,
      habit,
      jarvisNote,
      partners,
      state = "open",
      onCheckIn,
      className,
      ...rest
    },
    ref
  ) => (
    <section
      ref={ref}
      className={cn("ds-viewport flex flex-col gap-6 p-5", className)}
      {...rest}
    >
      {greeting && (
        <JarvisMessage eyebrow="Jarvis" tone="default">
          {greeting}
        </JarvisMessage>
      )}

      <NudgeCard
        habit={habit}
        jarvisNote={jarvisNote}
        partners={partners}
        state={state}
        onCheckIn={onCheckIn}
      />

      <p className="text-body-sm text-ink-faint text-center px-4 leading-relaxed">
        The rep itself is yours, {honorific}. The tick is what reaches the circle.
      </p>
    </section>
  )
);

CheckInScreen.displayName = "CheckInScreen";
