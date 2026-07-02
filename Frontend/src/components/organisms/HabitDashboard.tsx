import * as React from "react";
import { cn } from "../../lib/cn";
import { StreakChip } from "../atoms/StreakChip";
import { DotCalendar } from "../molecules/DotCalendar";
import type { DayState } from "../molecules/HabitDayDot";
import { DaySelector, type DayKey } from "../molecules/DaySelector";

export interface HabitDashboardProps extends React.HTMLAttributes<HTMLDivElement> {
  habit: string;
  /** Day-by-day history, oldest → newest. */
  history: DayState[];
  /** Days of week this habit is active. Default Mon-Sun (all 7). */
  taskDays?: DayKey[];
  /** Optional Jarvis note above the calendar. */
  jarvisNote?: string;
}

function countStates(history: DayState[]) {
  let kept = 0, missed = 0;
  for (const s of history) {
    if (s === "kept") kept++;
    else if (s === "missed") missed++;
  }
  return { kept, missed };
}

/* HabitDashboard — beat 2's "history under one habit."
 *
 * The resilience pillar's main expression: shows X kept, Y missed
 * as a streak chip AND as a calendar of soft dots. Never zero.
 * Never a single number.
 *
 * Demo state: 14-day history, 12 kept, 2 missed. */
export const HabitDashboard = React.forwardRef<HTMLDivElement, HabitDashboardProps>(
  ({ habit, history, taskDays = ["M", "T", "W", "Th", "F", "Sa", "S"], jarvisNote, className, ...rest }, ref) => {
    const { kept, missed } = countStates(history);
    return (
      <section
        ref={ref}
        className={cn("ds-viewport flex flex-col gap-6 p-5", className)}
        {...rest}
      >
        <div className="flex flex-col gap-2">
          <span className="ds-caps text-caps">The habit</span>
          <h2 className="text-display-md text-ink font-semibold leading-tight">{habit}</h2>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-paper-deep">
          <div>
            <span className="ds-caps text-[10px]">Since the start</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-display-lg font-semibold tabular-nums">{kept}</span>
              <span className="text-body text-ink-soft">kept</span>
              <span className="text-ink-faint">·</span>
              <span className="text-display-md font-medium tabular-nums">{missed}</span>
              <span className="text-body text-ink-soft">missed</span>
            </div>
          </div>
          <StreakChip kept={kept} missed={missed} size="sm" />
        </div>

        {jarvisNote && (
          <p className="ds-jarvis-quote text-body-lg text-ink-soft">{jarvisNote}</p>
        )}

        <div className="flex flex-col gap-3">
          <span className="ds-caps text-caps">Last {history.length} days</span>
          <DotCalendar days={history} columns={7} />
        </div>

        <div className="flex flex-col gap-3">
          <span className="ds-caps text-caps">Task days</span>
          <DaySelector value={taskDays} readOnly />
        </div>
      </section>
    );
  }
);

HabitDashboard.displayName = "HabitDashboard";
