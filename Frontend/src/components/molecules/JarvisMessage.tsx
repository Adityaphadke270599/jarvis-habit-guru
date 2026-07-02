import * as React from "react";
import { cn } from "../../lib/cn";

export type JarvisTone = "default" | "milestone" | "miss";

export interface JarvisMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The line of copy. Always in Jarvis's voice — see CLAUDE.md voice section. */
  children: React.ReactNode;
  /** Visual treatment. `milestone` is for identity-close moments (Day 21). */
  tone?: JarvisTone;
  /** Optional small label above the quote. Use sparingly. */
  eyebrow?: string;
}

const TONE: Record<JarvisTone, string> = {
  default:   "text-ink",
  milestone: "text-ink",
  miss:      "text-ink-soft",
};

const TONE_SIZE: Record<JarvisTone, string> = {
  default:   "text-display-md",
  milestone: "text-display-xl",
  miss:      "text-display-md",
};

/* Jarvis voice container — the warmth pillar's main expression.
 *
 * Always serif. Always Jarvis's words. No emoji. No exclamations.
 * The component does not validate copy — that's a copy review gate —
 * but its visual treatment makes shouting look wrong, which is the point. */
export const JarvisMessage = React.forwardRef<HTMLDivElement, JarvisMessageProps>(
  ({ tone = "default", eyebrow, className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2", className)}
      {...rest}
    >
      {eyebrow && (
        <span className="ds-caps text-caps">{eyebrow}</span>
      )}
      <p
        className={cn(
          "ds-jarvis-quote",
          TONE[tone],
          TONE_SIZE[tone]
        )}
      >
        {children}
      </p>
    </div>
  )
);

JarvisMessage.displayName = "JarvisMessage";
