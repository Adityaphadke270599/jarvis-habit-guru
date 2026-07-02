import * as React from "react";
import { cn } from "../../lib/cn";
import { Avatar } from "../atoms/Avatar";

export interface WitnessLineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Names of partners watching. Order matters — caller controls it. */
  partners: string[];
  /** Optional copy override. Default: "{names} are watching today." */
  children?: React.ReactNode;
}

function joinNames(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

/* Golden Path addition — the WITNESS line.
 *
 * Appears at nudge-time (NudgeCard) and check-in time (CheckInScreen).
 * Makes the circle's presence visible BEFORE the rep, not only after.
 *
 * This is the "partners CC'd on the daily reminder — the day's commitment
 * is publicly visible from sunrise" Golden Path note made into a component. */
export const WitnessLine = React.forwardRef<HTMLDivElement, WitnessLineProps>(
  ({ partners, children, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-2 text-body-sm text-ink-soft", className)}
      {...rest}
    >
      <div className="flex -space-x-2">
        {partners.slice(0, 3).map((n) => (
          <Avatar key={n} name={n} size="sm" className="ring-2 ring-paper" />
        ))}
      </div>
      <p className="leading-snug">
        {children ?? <>{joinNames(partners)} {partners.length === 1 ? "is" : "are"} watching today.</>}
      </p>
    </div>
  )
);

WitnessLine.displayName = "WitnessLine";
