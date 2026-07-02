import * as React from "react";
import { cn } from "../../lib/cn";

export type Status = "done" | "pending" | "missed";

export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: Status;
  size?: "sm" | "md";
  /** Show a subtle ring around the dot (helps on busy backgrounds). */
  ring?: boolean;
}

const COLOR: Record<Status, string> = {
  done:    "bg-sage",
  pending: "bg-ring",
  missed:  "bg-dust",
};

const SIZE = {
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
};

/* The shared status vocabulary for done / pending / missed.
 * Used in CircleMemberRow, GroupView, HabitDayDot's tooltip dots, etc.
 *
 * "Missed" is dust (warm tan) — never red. This is enforced at the
 * token layer; the prop API has no way to override it. */
export const StatusDot = React.forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ status, size = "md", ring, className, ...rest }, ref) => (
    <span
      ref={ref}
      role="img"
      aria-label={status}
      className={cn(
        "inline-block rounded-pill",
        SIZE[size],
        COLOR[status],
        ring && "ring-2 ring-paper",
        className
      )}
      {...rest}
    />
  )
);

StatusDot.displayName = "StatusDot";
