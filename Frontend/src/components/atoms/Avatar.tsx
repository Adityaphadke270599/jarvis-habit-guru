import * as React from "react";
import { cn } from "../../lib/cn";
import { initials, tintFor } from "../../lib/names";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Display name. Drives initials + deterministic tint. */
  name: string;
  size?: AvatarSize;
  /** Optional small status dot, anchored to the lower-right. */
  status?: "done" | "pending" | "missed";
}

const SIZE: Record<AvatarSize, { box: string; text: string; dot: string }> = {
  sm: { box: "w-7 h-7",   text: "text-[10px]",   dot: "w-2 h-2 ring-2" },
  md: { box: "w-10 h-10", text: "text-body-sm",  dot: "w-2.5 h-2.5 ring-2" },
  lg: { box: "w-14 h-14", text: "text-body",     dot: "w-3 h-3 ring-[3px]" },
};

const STATUS_COLOR: Record<NonNullable<AvatarProps["status"]>, string> = {
  done:    "bg-sage",
  pending: "bg-ring",
  missed:  "bg-dust",
};

/* Monogram-disc avatar.
 * Deterministic tint per name (so Jaanvi always reads the same).
 * No photos — by design. The PRD specifies illustrated/abstract only. */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ name, size = "md", status, className, style, ...rest }, ref) => {
    const tint = tintFor(name);
    const s = SIZE[size];

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex shrink-0", className)}
        {...rest}
      >
        <div
          className={cn(
            "inline-flex items-center justify-center rounded-pill font-semibold",
            s.box,
            s.text
          )}
          style={{ background: tint.bg, color: tint.fg, ...style }}
          aria-label={name}
        >
          {initials(name)}
        </div>
        {status && (
          <span
            className={cn(
              "absolute -bottom-0 -right-0 rounded-pill ring-paper",
              s.dot,
              STATUS_COLOR[status]
            )}
            aria-hidden="true"
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
