import * as React from "react";
import { cn } from "../../lib/cn";
import { HabitDayDot, type DayState } from "./HabitDayDot";

export interface DotCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** State per day, oldest → newest. Most recent is "today". */
  days: DayState[];
  /** Visual density of each dot. */
  dotSize?: "sm" | "md" | "lg";
  /** Number of columns. Default 7 (week grid). */
  columns?: number;
}

/* The HabitDashboard's history grid — last N days as soft dots.
 *
 * Pulled directly from the Streaks-style calendar in the inspiration,
 * but recoloured to dust/sage. No red Xs. No zero-state.
 *
 * Demo state: 14 days, 12 kept, 2 missed. */
export const DotCalendar = React.forwardRef<HTMLDivElement, DotCalendarProps>(
  ({ days, dotSize = "md", columns = 7, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn("grid gap-2", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      {...rest}
    >
      {days.map((state, i) => (
        <HabitDayDot key={i} state={state} size={dotSize} />
      ))}
    </div>
  )
);

DotCalendar.displayName = "DotCalendar";
