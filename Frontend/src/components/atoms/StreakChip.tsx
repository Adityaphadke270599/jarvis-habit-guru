import * as React from "react";
import { cn } from "../../lib/cn";

export interface StreakChipProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Days kept. Required. */
  kept: number;
  /** Days missed. Required. The two-number contract is the whole point. */
  missed: number;
  /** Compact "14 · 1" form vs. verbose "14 kept · 1 missed". */
  verbose?: boolean;
  size?: "sm" | "md";
}

/* The streak surface — NFR5 contract.
 *
 * Always two numbers. Never a single number. Never zeroed on miss.
 * The component refuses to render a single-number streak by design:
 * `missed` has no default, so the caller must reckon with it.
 *
 * The middle dot is "·" — a soft separator, never a flame, never a fire icon. */
export const StreakChip = React.forwardRef<HTMLDivElement, StreakChipProps>(
  ({ kept, missed, verbose = false, size = "md", className, ...rest }, ref) => {
    const small = size === "sm";
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-baseline gap-1 rounded-pill",
          "bg-paper-deep text-ink",
          small ? "px-2 py-0.5 text-body-sm" : "px-3 py-1 text-body",
          className
        )}
        aria-label={`${kept} days kept, ${missed} missed`}
        {...rest}
      >
        <span className="font-semibold tabular-nums">{kept}</span>
        <span className="text-ink-faint">·</span>
        <span className="font-semibold tabular-nums">{missed}</span>
        {verbose && (
          <span className={cn("ml-1 ds-caps", small ? "text-[9px]" : "text-caps")}>
            kept · missed
          </span>
        )}
      </div>
    );
  }
);

StreakChip.displayName = "StreakChip";
