import * as React from "react";
import { cn } from "../../lib/cn";

export interface ChoiceOption {
  value: string;
  label: string;
}

export interface ChoiceChipRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  options: ChoiceOption[];
  value?: string | null;
  onSelect?: (value: string) => void;
  /** Layout: 'wrap' for many short options, 'stack' for full-width buttons. */
  layout?: "wrap" | "stack";
}

/* The button-MCQ surface used in onboarding for frequency, register,
 * circle confirm, consent — everything except the typed habit input.
 *
 * PRD §8 decision 1: typed for the habit; buttons everywhere else. */
export const ChoiceChipRow = React.forwardRef<HTMLDivElement, ChoiceChipRowProps>(
  ({ options, value, onSelect, layout = "wrap", className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        layout === "wrap" ? "flex flex-wrap gap-2" : "flex flex-col gap-2",
        className
      )}
      role="radiogroup"
      {...rest}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect?.(opt.value)}
            className={cn(
              "transition-colors duration-[var(--ds-dur-quick)]",
              "px-4 py-2.5 rounded-pill text-body font-medium",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
              layout === "stack" && "w-full text-left px-5",
              selected
                ? "bg-brass text-paper"
                : "bg-paper-deep text-ink hover:bg-paper-edge"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  )
);

ChoiceChipRow.displayName = "ChoiceChipRow";
