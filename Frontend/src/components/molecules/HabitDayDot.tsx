import * as React from "react";
import { cn } from "../../lib/cn";

export type DayState = "kept" | "missed" | "today" | "future" | "skipped";

export interface HabitDayDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  state: DayState;
  /** Visual size of the dot. */
  size?: "sm" | "md" | "lg";
  /** Optional day label (e.g., "M", "T"). Renders below the dot. */
  label?: string;
}

const SIZE: Record<NonNullable<HabitDayDotProps["size"]>, string> = {
  sm: "w-2.5 h-2.5",
  md: "w-3.5 h-3.5",
  lg: "w-5 h-5",
};

const STATE: Record<DayState, string> = {
  kept:    "bg-sage",
  missed:  "bg-dust",
  today:   "bg-brass ring-2 ring-offset-2 ring-offset-paper ring-brass-tint",
  future:  "bg-paper-deep border border-paper-edge",
  skipped: "bg-paper-deep",
};

/* A single day's status as a soft dot.
 *
 * The grammar this DS uses for the resilience pillar — never a red X,
 * never an empty slot that reads as failure. "missed" is dust (warm tan),
 * never red. "today" is brass and slightly larger. */
export const HabitDayDot = React.forwardRef<HTMLSpanElement, HabitDayDotProps>(
  ({ state, size = "md", label, className, ...rest }, ref) => (
    <span
      ref={ref}
      className={cn("inline-flex flex-col items-center gap-1", className)}
      {...rest}
    >
      <span
        role="img"
        aria-label={state}
        className={cn("inline-block rounded-pill", SIZE[size], STATE[state])}
      />
      {label && (
        <span className="text-[10px] uppercase tracking-wider text-ink-faint font-medium">
          {label}
        </span>
      )}
    </span>
  )
);

HabitDayDot.displayName = "HabitDayDot";
