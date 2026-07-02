import * as React from "react";
import { cn } from "../../lib/cn";
import { CircleMemberRow } from "../molecules/CircleMemberRow";
import type { Status } from "../atoms/StatusDot";

export interface CircleMember {
  name: string;
  status: Status;
  kept: number;
  missed: number;
  isSelf?: boolean;
  lastUpdate?: string;
}

export interface GroupViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Member list. Order is set by the caller — never sorted by rank (NFR4). */
  members: CircleMember[];
  /** Optional header copy from Jarvis. */
  jarvisCopy?: string;
  /** Section label, default "The circle today". */
  eyebrow?: string;
}

/* GroupView — beat 4 of the Golden Path: "Witness my circle's day."
 *
 * Status-only. No reasons (NFR2). No ranking (NFR4). No comparison.
 * The "witness mechanic fires" here because the circle is visibly present
 * and the user can see who's done / pending. */
export const GroupView = React.forwardRef<HTMLDivElement, GroupViewProps>(
  ({ members, jarvisCopy, eyebrow = "The circle today", className, ...rest }, ref) => (
    <section
      ref={ref}
      className={cn("ds-viewport flex flex-col gap-5 p-5", className)}
      {...rest}
    >
      <div className="flex flex-col gap-1.5">
        <span className="ds-caps text-caps">{eyebrow}</span>
        {jarvisCopy && (
          <p className="ds-jarvis-quote text-body-lg text-ink-soft">{jarvisCopy}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {members.map((m) => (
          <CircleMemberRow
            key={m.name}
            name={m.name}
            status={m.status}
            kept={m.kept}
            missed={m.missed}
            isSelf={m.isSelf}
            lastUpdate={m.lastUpdate}
          />
        ))}
      </div>
    </section>
  )
);

GroupView.displayName = "GroupView";
