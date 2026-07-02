import * as React from "react";
import { cn } from "../../lib/cn";

export type Register = "gentle" | "neutral" | "direct";

export interface RegisterSliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: Register;
  onChange?: (value: Register) => void;
  /** Pass false to hide the underline labels. */
  showLabels?: boolean;
}

const STOPS: Register[] = ["gentle", "neutral", "direct"];
const LABEL: Record<Register, string> = {
  gentle: "Gentle",
  neutral: "Neutral",
  direct: "Direct",
};

/* The register dial — F15.
 *
 * 3 discrete stops on a brass track, default Neutral. One voice across all
 * stops — the personality picker (Friendly / Strict / Father) was rejected
 * by PRD §2 as a voice-pillar violation. This dial only changes register
 * within Jarvis's voice, never personality. */
export const RegisterSlider = React.forwardRef<HTMLDivElement, RegisterSliderProps>(
  ({ value, onChange, showLabels = true, className, ...rest }, ref) => {
    const idx = STOPS.indexOf(value);
    return (
      <div
        ref={ref}
        className={cn("w-full select-none", className)}
        role="radiogroup"
        {...rest}
      >
        <div className="relative h-12 flex items-center">
          {/* Track */}
          <div className="absolute left-2 right-2 h-px bg-paper-edge" />

          {/* Stops */}
          <div className="relative w-full flex items-center justify-between px-1">
            {STOPS.map((stop, i) => {
              const active = i === idx;
              return (
                <button
                  key={stop}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange?.(stop)}
                  className={cn(
                    "relative w-8 h-8 rounded-pill bg-paper",
                    "transition-all duration-[var(--ds-dur-base)] var(--ds-ease-out)",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
                  )}
                  aria-label={LABEL[stop]}
                >
                  <span
                    className={cn(
                      "absolute inset-0 m-auto rounded-pill",
                      active
                        ? "w-5 h-5 bg-brass ring-4 ring-brass-tint"
                        : "w-2.5 h-2.5 bg-paper-edge"
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
        {showLabels && (
          <div className="mt-1 flex w-full items-start justify-between px-1">
            {STOPS.map((stop, i) => (
              <span
                key={stop}
                className={cn(
                  "text-body-sm w-8 text-center",
                  i === idx ? "text-ink font-medium" : "text-ink-faint"
                )}
              >
                {LABEL[stop]}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
);

RegisterSlider.displayName = "RegisterSlider";
