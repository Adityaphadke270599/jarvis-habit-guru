import * as React from "react";
import { cn } from "../../lib/cn";

export type DayKey = "S" | "M" | "T" | "W" | "Th" | "F" | "Sa";

const DAYS: { key: DayKey; label: string }[] = [
  { key: "S",  label: "S" },
  { key: "M",  label: "M" },
  { key: "T",  label: "T" },
  { key: "W",  label: "W" },
  { key: "Th", label: "T" },
  { key: "F",  label: "F" },
  { key: "Sa", label: "S" },
];

export interface DaySelectorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Set of selected day keys. */
  value: DayKey[];
  onChange?: (value: DayKey[]) => void;
  /** Optional readonly mode for display (e.g., habit summary). */
  readOnly?: boolean;
}

/* The SMTWTFS pill row — Task Days selector.
 *
 * Lifted from your inspiration screenshot (the purple "Task Days" screen),
 * recoloured to brass for active, paper-deep for inactive. */
export const DaySelector = React.forwardRef<HTMLDivElement, DaySelectorProps>(
  ({ value, onChange, readOnly, className, ...rest }, ref) => {
    const toggle = (k: DayKey) => {
      if (readOnly) return;
      const has = value.includes(k);
      onChange?.(has ? value.filter((d) => d !== k) : [...value, k]);
    };
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between gap-1", className)}
        {...rest}
      >
        {DAYS.map(({ key, label }) => {
          const on = value.includes(key);
          return (
            <button
              key={key}
              type="button"
              aria-pressed={on}
              aria-label={`${key}${on ? " selected" : ""}`}
              disabled={readOnly}
              onClick={() => toggle(key)}
              className={cn(
                "w-10 h-10 rounded-pill text-body-sm font-semibold",
                "transition-colors duration-[var(--ds-dur-quick)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
                on
                  ? "bg-brass text-paper"
                  : "bg-paper-deep text-ink-soft hover:bg-paper-edge"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }
);

DaySelector.displayName = "DaySelector";
