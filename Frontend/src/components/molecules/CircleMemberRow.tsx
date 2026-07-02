import * as React from "react";
import { cn } from "../../lib/cn";
import { Avatar } from "../atoms/Avatar";
import { StatusDot, type Status } from "../atoms/StatusDot";
import { StreakChip } from "../atoms/StreakChip";

export interface CircleMemberRowProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  status: Status;
  kept: number;
  missed: number;
  /** If true, renders an "(you)" hint after the name. */
  isSelf?: boolean;
  /** Optional, very subtle "Just now" timestamp on done. */
  lastUpdate?: string;
}

const STATUS_LABEL: Record<Status, string> = {
  done: "Today, kept",
  pending: "Pending today",
  missed: "Today, missed",
};

/* The witness row.
 *
 * Used in GroupView. Shows partner + status + streak. No comparison,
 * no leaderboard ranking (NFR4) — the order is set by the caller and
 * should be stable (self last, partners by join date).
 *
 * Reason logs are NEVER surfaced here (NFR2). The row shows STATUS only. */
export const CircleMemberRow = React.forwardRef<HTMLDivElement, CircleMemberRowProps>(
  ({ name, status, kept, missed, isSelf, lastUpdate, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 py-3 px-4 rounded-lg",
        "bg-paper-deep",
        className
      )}
      {...rest}
    >
      <Avatar name={name} size="md" status={status} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-body font-medium text-ink truncate">
            {name}{isSelf && <span className="text-ink-faint font-normal"> (you)</span>}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <StatusDot status={status} size="sm" />
          <span className="text-body-sm text-ink-soft">
            {STATUS_LABEL[status]}
            {lastUpdate && status === "done" && (
              <span className="text-ink-faint"> · {lastUpdate}</span>
            )}
          </span>
        </div>
      </div>
      <StreakChip kept={kept} missed={missed} size="sm" />
    </div>
  )
);

CircleMemberRow.displayName = "CircleMemberRow";
