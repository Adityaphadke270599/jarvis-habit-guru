import * as React from "react";
import { cn } from "../../lib/cn";
import { Avatar } from "../atoms/Avatar";

export interface CheerNote {
  /** Partner's name. */
  name: string;
  /** Short witness-acknowledgement copy. Never emoji, never an exclamation.
   *  Examples: "Jaanvi noted today.", "Mike saw your tick." */
  note: string;
}

export interface CircleCheersProps extends React.HTMLAttributes<HTMLDivElement> {
  notes: CheerNote[];
}

/* Golden Path addition — the CHEERS landing at close.
 *
 * Used on the end-of-day close screen. The "witness mechanic fires" — this
 * component is what fires it. Visually quiet: a stack of monogram + soft line.
 * NOT a reactions ticker, NOT emoji, NOT counts. The cheer is the
 * acknowledgement itself. */
export const CircleCheers = React.forwardRef<HTMLDivElement, CircleCheersProps>(
  ({ notes, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2", className)}
      {...rest}
    >
      {notes.map(({ name, note }) => (
        <div
          key={name}
          className="flex items-center gap-3 py-2 px-3 rounded-lg bg-paper-deep"
        >
          <Avatar name={name} size="sm" />
          <p className="text-body-sm text-ink-soft leading-snug">
            <span className="text-ink font-medium">{name}</span>
            <span className="text-ink-faint"> · </span>
            <span>{note}</span>
          </p>
        </div>
      ))}
    </div>
  )
);

CircleCheers.displayName = "CircleCheers";
