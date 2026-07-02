import * as React from "react";

export interface TickProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number;
  strokeWidth?: number;
}

/* The check mark.
 * Never paired with red, never punitive — used for "kept today"
 * and the CheckInButton broadcast. */
export const Tick = React.forwardRef<SVGSVGElement, TickProps>(
  ({ size = 18, strokeWidth = 2, ...rest }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
);

Tick.displayName = "Tick";
